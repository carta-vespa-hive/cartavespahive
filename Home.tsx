/**
 * Home — Carta Vespa Hive Business Page
 * Design: Crystalline Emergence — Parametric Dark Minimalism
 * Teal-gold-on-vanta-black, 3D pyramid wasp-nest structures,
 * GSAP scroll animations, Lenis smooth scroll, film grain overlay
 */
import { useState, useCallback } from "react";
import { useLenis } from "@/hooks/useLenis";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import Preloader from "@/components/Preloader";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import OriginSection from "@/components/OriginSection";
import ProjectsSection from "@/components/ProjectsSection";
import VisionSection from "@/components/VisionSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  useLenis();
  useScrollAnimation();

  const handlePreloaderComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      {/* Preloader */}
      {!loaded && <Preloader onComplete={handlePreloaderComplete} />}

      {/* Film grain overlay */}
      <div className="grain-overlay" />

      {/* Main content */}
      <div
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 1.0s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <Navigation />
        <HeroSection />
        <OriginSection />
        <ProjectsSection />
        <VisionSection />
        <ContactSection />
        <Footer />
      </div>
    </>
  );
}
