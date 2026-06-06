import { useEffect, useRef } from "react";
import * as THREE from "three";

const vertexShader = /* glsl */`
uniform float uTime;
uniform float uProgress;

attribute vec3 gridPos;
attribute vec3 pyramidPos;

varying float vElevation;

void main() {
  float x = gridPos.x * 2.5;
  float y = gridPos.y * 2.5;
  float n = 2.0;
  float m = 3.0;
  float pi = 3.14159265359;
  float cymaticZ = 0.6 * (sin(n * pi * x) * sin(m * pi * y) + sin(m * pi * x) * sin(n * pi * y));
  vec3 cymaticPos = vec3(gridPos.x * 3.5, gridPos.y * 3.5, cymaticZ);
  vec3 pPos = vec3(pyramidPos.x * 2.5, pyramidPos.y * 2.5, pyramidPos.z * 2.5);
  float morphPhase = smoothstep(0.0, 1.0, uProgress);
  vec3 animatedPyramid = pPos + vec3(0.0, 0.0, sin(uTime * 2.0 + pPos.z * 5.0) * 0.05 * (1.0 - morphPhase));
  vec3 animatedCymatic = cymaticPos + vec3(0.0, 0.0, sin(uTime * 4.0 - length(gridPos.xy) * 10.0) * 0.1 * morphPhase);
  vec3 currentPos = mix(animatedPyramid, animatedCymatic, morphPhase);
  vec4 mv = modelViewMatrix * vec4(currentPos, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = mix(2.0, 3.5, morphPhase) * (20.0 / -mv.z);
  vElevation = currentPos.z;
}
`;

const fragmentShader = /* glsl */`
varying float vElevation;
uniform float uProgress;
uniform vec3 uColorPyramid;
uniform vec3 uColorCymaticLow;
uniform vec3 uColorCymaticHigh;

void main() {
  vec2 coord = gl_PointCoord - vec2(0.5);
  vec2 p = abs(coord);
  float hex = max(p.x, dot(p, normalize(vec2(1.0, 1.73205))));
  if (hex > 0.45) discard;
  float alpha = 1.0 - (hex / 0.45);
  alpha = pow(alpha, 1.5);
  vec3 cymaticColor = mix(uColorCymaticLow, uColorCymaticHigh, (vElevation + 0.5) * 0.6);
  vec3 pyramidColor = mix(uColorPyramid, vec3(1.0, 0.9, 0.5), vElevation * 0.3);
  vec3 color = mix(pyramidColor, cymaticColor, smoothstep(0.0, 1.0, uProgress));
  gl_FragColor = vec4(color, alpha * mix(0.35, 0.85, uProgress));
}
`;

export default function CymaticBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, -7, 4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000);
    mountRef.current.appendChild(renderer.domElement);

    const gridSize = 220;
    const count = gridSize * gridSize;
    const gridPos = new Float32Array(count * 3);
    const pyramidPos = new Float32Array(count * 3);
    let i = 0;
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const nx = (x / gridSize) * 2 - 1;
        const ny = (y / gridSize) * 2 - 1;
        gridPos[i * 3] = nx;
        gridPos[i * 3 + 1] = ny;
        gridPos[i * 3 + 2] = 0;
        const dist = Math.max(Math.abs(nx), Math.abs(ny));
        const pz = 1.0 - dist;
        pyramidPos[i * 3] = nx + (Math.random() - 0.5) * 0.015;
        pyramidPos[i * 3 + 1] = ny + (Math.random() - 0.5) * 0.015;
        pyramidPos[i * 3 + 2] = (pz * 1.5) - 0.75 + (Math.random() - 0.5) * 0.02;
        i++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(gridPos, 3));
    geometry.setAttribute("gridPos", new THREE.BufferAttribute(gridPos, 3));
    geometry.setAttribute("pyramidPos", new THREE.BufferAttribute(pyramidPos, 3));

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uColorPyramid: { value: new THREE.Color("#d97706") },
        uColorCymaticLow: { value: new THREE.Color("#b45309") },
        uColorCymaticHigh: { value: new THREE.Color("#fbbf24") },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const clock = new THREE.Clock();
    let raf: number;
    const renderLoop = () => {
      raf = requestAnimationFrame(renderLoop);
      const t = clock.getElapsedTime();
      material.uniforms.uTime.value = t;
      material.uniforms.uProgress.value = (Math.sin(t * 0.25) * 0.5 + 0.5);
      renderer.render(scene, camera);
    };
    renderLoop();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
}
