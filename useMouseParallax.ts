import { useEffect, useRef, useState } from "react";

interface ParallaxPosition {
  x: number;
  y: number;
}

export function useMouseParallax(intensity: number = 20) {
  const [position, setPosition] = useState<ParallaxPosition>({ x: 0, y: 0 });
  const targetRef = useRef<ParallaxPosition>({ x: 0, y: 0 });
  const currentRef = useRef<ParallaxPosition>({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      targetRef.current = {
        x: ((e.clientX - cx) / cx) * intensity,
        y: ((e.clientY - cy) / cy) * intensity,
      };
    };

    const animate = () => {
      currentRef.current.x +=
        (targetRef.current.x - currentRef.current.x) * 0.06;
      currentRef.current.y +=
        (targetRef.current.y - currentRef.current.y) * 0.06;
      setPosition({ ...currentRef.current });
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [intensity]);

  return position;
}
