import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useScrollAnimation() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const timer = setTimeout(() => {
      // Cinematic fade-up reveals
      document.querySelectorAll("[data-animate='fade-up']").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 55 },
          {
            opacity: 1,
            y: 0,
            duration: 1.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // Staggered children reveals
      document.querySelectorAll("[data-animate='stagger']").forEach((group) => {
        gsap.fromTo(
          group.children,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: group,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // Gold rule width animation
      document.querySelectorAll("[data-animate='rule']").forEach((rule) => {
        gsap.fromTo(
          rule,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 2.2,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: rule,
              start: "top 92%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // Parallax images — slow drift on scroll
      document.querySelectorAll("[data-animate='parallax']").forEach((el) => {
        gsap.to(el, {
          y: -70,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 2.5,
          },
        });
      });

      // Scale reveal for images — emerge from darkness
      document
        .querySelectorAll("[data-animate='scale-reveal']")
        .forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, scale: 1.08 },
            {
              opacity: 1,
              scale: 1,
              duration: 2.2,
              ease: "power2.out",
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            }
          );
        });

      ScrollTrigger.refresh();
    }, 400);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);
}
