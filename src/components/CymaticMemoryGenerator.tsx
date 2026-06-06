import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Lock, Unlock, Activity, Hexagon, Mic, MicOff, AlertTriangle, Bug } from 'lucide-react';

// --- Custom WebGL Shaders ---

const vertexShader = `
uniform float uTime;
uniform float uProgress;
uniform float uFreqN;
uniform float uFreqM;
uniform float uAmp;

attribute vec3 pyramidPos;
attribute vec3 gridPos;

varying float vElevation;
varying vec2 vUv;

void main() {
    vUv = uv;

    // Scale grid up for cymatic resonance
    float x = gridPos.x * 2.5;
    float y = gridPos.y * 2.5;

    // Constants for Chladni patterns
    float n = uFreqN;
    float m = uFreqM;
    float pi = 3.14159265359;

    // Real-time Chladni Plate Equation (Cymatics)
    float cymaticZ = uAmp * (sin(n * pi * x) * sin(m * pi * y) + sin(m * pi * x) * sin(n * pi * y));
    vec3 cymaticPos = vec3(gridPos.x * 3.5, gridPos.y * 3.5, cymaticZ);

    // Scale the Pyramid (The "Sealed" State)
    vec3 pPos = vec3(pyramidPos.x * 2.5, pyramidPos.y * 2.5, pyramidPos.z * 2.5);

    // Smoothstep for an explosive ease-in-out transition
    float morphPhase = smoothstep(0.0, 1.0, uProgress);

    // --- State A: Pyramid (Locked Hive) ---
    // Add slow rotation to the pyramid
    float pRotation = uTime * 0.3;
    mat2 rotPyramid = mat2(cos(pRotation), -sin(pRotation), sin(pRotation), cos(pRotation));
    vec2 rotatedPxy = rotPyramid * vec2(pPos.x, pPos.y);
    vec3 animatedPyramid = vec3(rotatedPxy.x, rotatedPxy.y, pPos.z);
    
    // Add gentle breathing to pyramid
    animatedPyramid.z += sin(uTime * 2.0 + pPos.z * 5.0) * 0.05 * (1.0 - morphPhase);

    // --- State B: Cymatic (Agitated Swarm) ---
    // Add rippling wave to cymatics
    vec3 animatedCymatic = cymaticPos;
    animatedCymatic.z += sin(uTime * 4.0 - length(gridPos.xy) * 10.0) * 0.1 * morphPhase;

    // Stochastic Swarm Jitter (Wasp effect) 
    // The louder it is (uAmp), the more the particles buzz around their position
    float jitterX = sin(uTime * 15.0 + gridPos.y * 20.0) * uAmp * 0.15;
    float jitterY = cos(uTime * 13.0 + gridPos.x * 20.0) * uAmp * 0.15;
    float jitterZ = sin(uTime * 17.0 + gridPos.x * gridPos.y * 30.0) * uAmp * 0.15;
    animatedCymatic += vec3(jitterX, jitterY, jitterZ) * morphPhase;

    // LERP (Linear Interpolate) between State A and State B
    vec3 currentPos = mix(animatedPyramid, animatedCymatic, morphPhase);

    // Final Position
    vec4 modelViewPosition = modelViewMatrix * vec4(currentPos, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;

    // Point size reacts to distance and morph state
    gl_PointSize = mix(2.0, 3.5, morphPhase) * (20.0 / -modelViewPosition.z);

    vElevation = currentPos.z;
}
`;

const fragmentShader = `
varying float vElevation;
uniform float uProgress;
uniform vec3 uColorPyramid;
uniform vec3 uColorCymaticLow;
uniform vec3 uColorCymaticHigh;

void main() {
    // Create hexagonal particles instead of circles (Honeycomb motif)
    vec2 coord = gl_PointCoord - vec2(0.5);
    vec2 p = abs(coord);
    // Distance field for hexagon
    float hex = max(p.x, dot(p, normalize(vec2(1.0, 1.73205))));
    if(hex > 0.45) discard;

    // Soft glow falloff based on hexagon center
    float alpha = 1.0 - (hex / 0.45);
    alpha = pow(alpha, 1.5);

    // Calculate Cymatic colors based on elevation (peaks vs valleys)
    // Deep Amber/Red valleys to bright Gold/Yellow peaks
    vec3 cymaticColor = mix(uColorCymaticLow, uColorCymaticHigh, (vElevation + 0.5) * 0.6);
    
    // Calculate Pyramid colors (Glowing Amber)
    vec3 pyramidColor = mix(uColorPyramid, vec3(1.0, 0.9, 0.5), vElevation * 0.3);

    // LERP Colors based on transition progress
    vec3 finalColor = mix(pyramidColor, cymaticColor, smoothstep(0.0, 1.0, uProgress));

    gl_FragColor = vec4(finalColor, alpha * mix(0.4, 0.9, uProgress));
}
`;

export default function CymaticMemoryGenerator() {
  const mountRef = useRef(null);
  
  // State for UI
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [params, setParams] = useState({ n: 2.0, m: 3.0, amp: 0.6 });
  
  // Refs for Animation Loop
  const isUnlockedRef = useRef(false);
  const isListeningRef = useRef(false);
  const paramsRef = useRef(params);
  const mouseXRef = useRef(0);
  const mouseYRef = useRef(0);

  // Audio Context Refs
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);

  // Sync state to refs
  useEffect(() => {
    isUnlockedRef.current = isUnlocked;
    isListeningRef.current = isListening;
    if (!isListening) {
      paramsRef.current = params;
    }
  }, [isUnlocked, isListening, params]);

  // Handle Microphone Toggle
  const toggleListening = async () => {
    if (isListening) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setIsListening(false);
      setIsUnlocked(false); 
      setParams({ n: 2.0, m: 3.0, amp: 0.6 }); 
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioCtx.createAnalyser();
        
        analyser.fftSize = 512; 
        
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        
        audioCtxRef.current = audioCtx;
        analyserRef.current = analyser;
        dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
        
        setIsListening(true);
        setIsUnlocked(true); 
      } catch (err) {
        console.error("Error accessing microphone:", err);
        setErrorMsg("Audio feed denied. Please allow mic permissions to awaken the swarm.");
        setTimeout(() => setErrorMsg(""), 5000);
      }
    }
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0500, 0.05); // Deep amber/brown fog

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, -7, 4);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x050300); // Very dark brownish-black
    mountRef.current.appendChild(renderer.domElement);

    // 2. Point Cloud Geometry Setup
    const gridSize = 250; 
    const particleCount = gridSize * gridSize;
    const geometry = new THREE.BufferGeometry();

    const gridPos = new Float32Array(particleCount * 3);
    const pyramidPos = new Float32Array(particleCount * 3);

    let i = 0;
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const nx = (x / gridSize) * 2 - 1;
        const ny = (y / gridSize) * 2 - 1;

        gridPos[i * 3] = nx;
        gridPos[i * 3 + 1] = ny;
        gridPos[i * 3 + 2] = 0;

        const dist = Math.max(Math.abs(nx), Math.abs(ny));
        let pz = 1.0 - dist;

        const noiseX = (Math.random() - 0.5) * 0.015;
        const noiseY = (Math.random() - 0.5) * 0.015;
        const noiseZ = (Math.random() - 0.5) * 0.02;

        pyramidPos[i * 3] = nx + noiseX;
        pyramidPos[i * 3 + 1] = ny + noiseY;
        pyramidPos[i * 3 + 2] = (pz * 1.5) - 0.75 + noiseZ;

        i++;
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(gridPos, 3));
    geometry.setAttribute('gridPos', new THREE.BufferAttribute(gridPos, 3));
    geometry.setAttribute('pyramidPos', new THREE.BufferAttribute(pyramidPos, 3));

    // 3. Custom Shader Material
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uFreqN: { value: 2.0 },
        uFreqM: { value: 3.0 },
        uAmp: { value: 0.6 },
        uColorPyramid: { value: new THREE.Color('#d97706') },     // Amber-600
        uColorCymaticHigh: { value: new THREE.Color('#fbbf24') }, // Amber-400 (Gold)
        uColorCymaticLow: { value: new THREE.Color('#991b1b') }   // Red-800 (Deep Hornet Red)
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // 4. Animation Loop
    const clock = new THREE.Clock();
    let animationFrameId;

    const render = () => {
      const elapsedTime = clock.getElapsedTime();
      material.uniforms.uTime.value = elapsedTime;

      // Handle Audio Reactivity
      if (isListeningRef.current && analyserRef.current && dataArrayRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        let sum = 0;
        let peak = 0;
        let peakIndex = 0;
        const length = dataArrayRef.current.length;
        
        for (let j = 0; j < length; j++) {
          const val = dataArrayRef.current[j];
          sum += val;
          if (val > peak) {
            peak = val;
            peakIndex = j;
          }
        }
        const avg = sum / length;
        
        const targetAmp = (avg / 255) * 1.5;
        const targetN = 1.0 + (peakIndex / (length * 0.25)) * 9.0; 
        const targetM = 1.0 + ((peakIndex % 16) / 16) * 9.0;

        if (avg > 5) {
          paramsRef.current.amp += (targetAmp - paramsRef.current.amp) * 0.15;
          paramsRef.current.n += (targetN - paramsRef.current.n) * 0.1;
          paramsRef.current.m += (targetM - paramsRef.current.m) * 0.1;
        } else {
          paramsRef.current.amp += (0.15 - paramsRef.current.amp) * 0.05;
        }
      }

      const targetProgress = isUnlockedRef.current ? 1.0 : 0.0;
      material.uniforms.uProgress.value += (targetProgress - material.uniforms.uProgress.value) * 0.03;

      material.uniforms.uFreqN.value += (paramsRef.current.n - material.uniforms.uFreqN.value) * 0.05;
      material.uniforms.uFreqM.value += (paramsRef.current.m - material.uniforms.uFreqM.value) * 0.05;
      material.uniforms.uAmp.value += (paramsRef.current.amp - material.uniforms.uAmp.value) * 0.05;

      camera.position.x += (mouseXRef.current * 4 - camera.position.x) * 0.02;
      camera.position.y += (-mouseYRef.current * 2 - 7 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    // 5. Event Listeners
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    const handleMouseMove = (e) => {
      mouseXRef.current = (e.clientX / window.innerWidth) * 2 - 1;
      mouseYRef.current = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      mountRef.current?.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const updateParam = (key, value) => {
    setParams(prev => ({ ...prev, [key]: parseFloat(value) }));
  };

  return (
    <div className="relative w-full h-screen bg-[#050300] overflow-hidden font-sans text-white">
      
      {/* Subtle Honeycomb CSS Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='69.2820323027551' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 17.32050807568877L20 5.773502691896257 0 17.32050807568877 0 40.41451884327381 20 51.96152422706633 40 40.41451884327381Z' fill='none' stroke='%23ffaa00' stroke-width='1' /%3E%3Cpath d='M20 51.96152422706633L0 63.50852961085885 0 86.60254037844388 20 98.14954576223641 40 86.60254037844388 40 63.50852961085885Z' fill='none' stroke='%23ffaa00' stroke-width='1' /%3E%3C/svg%3E")`,
          backgroundSize: '40px 69.28px'
        }} 
      />

      {/* Error Message Box */}
      {errorMsg && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-red-900/40 border border-red-500/50 text-red-200 px-6 py-3 rounded-xl z-50 flex items-center gap-3 shadow-2xl backdrop-blur-md animate-pulse">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <p className="text-sm font-medium">{errorMsg}</p>
        </div>
      )}

      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 z-0 cursor-crosshair mix-blend-screen" />

      {/* UI Overlay */}
      <div className="absolute top-0 left-0 w-full p-6 z-10 pointer-events-none flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-widest text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.6)] flex items-center gap-2">
            <Hexagon className="w-6 h-6 fill-amber-500/20" /> WASP RESONANCE HIVE
          </h1>
          <p className="text-sm text-amber-500/60 tracking-wider mt-1 uppercase">Stochastic Swarm Simulator & Voice Key</p>
        </div>
      </div>

      {/* Control Panel */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-black/60 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-6 z-10 shadow-2xl pointer-events-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-orange-500" />
            <h2 className="text-sm font-semibold tracking-wide text-amber-100/80">HIVE FREQUENCY CONTROLS</h2>
          </div>
          <span className={`text-xs px-2 py-1 rounded border ${isUnlocked ? 'border-orange-500 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.3)]' : 'border-amber-700 text-amber-600'}`}>
            {isUnlocked ? 'SWARM ACTIVE' : 'HIVE SEALED'}
          </span>
        </div>

        <div className="space-y-5 transition-opacity duration-500" style={{ opacity: isUnlocked ? 1 : 0.3 }}>
          {/* Freq N Control */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-amber-500/70 font-mono">
              <span>Biological Harmonic (N)</span>
              <span>{isListening ? "AUDIO SYNC" : params.n.toFixed(1)}</span>
            </div>
            <input 
              type="range" min="1" max="10" step="0.1" 
              value={isListening ? paramsRef.current.n : params.n} 
              onChange={(e) => updateParam('n', e.target.value)}
              disabled={!isUnlocked || isListening}
              className="w-full h-1 bg-amber-900/30 rounded-lg appearance-none cursor-pointer accent-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Freq M Control */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-amber-500/70 font-mono">
              <span>Swarm Resonance (M)</span>
              <span>{isListening ? "AUDIO SYNC" : params.m.toFixed(1)}</span>
            </div>
            <input 
              type="range" min="1" max="10" step="0.1" 
              value={isListening ? paramsRef.current.m : params.m} 
              onChange={(e) => updateParam('m', e.target.value)}
              disabled={!isUnlocked || isListening}
              className="w-full h-1 bg-amber-900/30 rounded-lg appearance-none cursor-pointer accent-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Amplitude Control */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-amber-500/70 font-mono">
              <span>Agitation Level (Amp)</span>
              <span>{isListening ? "AUDIO SYNC" : params.amp.toFixed(2)}</span>
            </div>
            <input 
              type="range" min="0" max="1.5" step="0.05" 
              value={isListening ? paramsRef.current.amp : params.amp} 
              onChange={(e) => updateParam('amp', e.target.value)}
              disabled={!isUnlocked || isListening}
              className="w-full h-1 bg-amber-900/30 rounded-lg appearance-none cursor-pointer accent-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <button 
            onClick={() => {
              if (isListening) return; 
              setIsUnlocked(!isUnlocked);
            }}
            disabled={isListening}
            className={`flex-1 py-4 rounded-xl font-bold tracking-widest text-xs flex items-center justify-center gap-2 transition-all duration-500 ${
              isUnlocked 
              ? 'bg-orange-500/10 text-orange-400 border border-orange-500/50 hover:bg-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.2)] disabled:opacity-50 disabled:cursor-not-allowed' 
              : 'bg-amber-600/10 text-amber-500 border border-amber-600/30 hover:bg-amber-600/20 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            {isUnlocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            {isUnlocked ? "SEAL HIVE" : "AGITATE SWARM"}
          </button>

          <button 
            onClick={toggleListening}
            className={`flex-1 py-4 rounded-xl font-bold tracking-widest text-xs flex items-center justify-center gap-2 transition-all duration-500 ${
              isListening
              ? 'bg-red-500/10 text-red-400 border border-red-500/50 hover:bg-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
              : 'bg-amber-500/20 text-amber-400 border border-amber-500/50 hover:bg-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Bug className="w-4 h-4" />}
            {isListening ? "SILENCE SWARM" : "AWAKEN SWARM"}
          </button>
        </div>
      </div>
    </div>
  );
}