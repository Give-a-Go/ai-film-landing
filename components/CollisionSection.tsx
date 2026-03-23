import React, { useRef, useEffect, useState } from "react";
import { animate, stagger, createTimeline } from "animejs";

const PARTICLE_COUNT = 24;
const WAVE_COUNT = 5;

interface Particle {
  el: HTMLDivElement | null;
  side: "left" | "right";
  baseX: number;
  baseY: number;
  size: number;
  delay: number;
}

function useIsMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth <= breakpoint,
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener("change", handler);
    setMobile(mq.matches);
    return () => mq.removeEventListener("change", handler);
  }, [breakpoint]);
  return mobile;
}

const CollisionSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const animStarted = useRef(false);
  const rafRef = useRef<number>(0);
  const particleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const leftWaveRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rightWaveRefs = useRef<(HTMLDivElement | null)[]>([]);
  const centerGlowRef = useRef<HTMLDivElement>(null);
  const centerTextRef = useRef<HTMLDivElement>(null);
  const leftLabelRef = useRef<HTMLDivElement>(null);
  const rightLabelRef = useRef<HTMLDivElement>(null);
  const filmStripRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const particles = useRef<Particle[]>(
    Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const side = i < PARTICLE_COUNT / 2 ? "left" : "right";
      const spread = 0.22 + Math.random() * 0.2;
      return {
        el: null,
        side,
        baseX: side === "left" ? spread : 1 - spread,
        baseY: 0.25 + Math.random() * 0.5,
        size: 2 + Math.random() * 4,
        delay: Math.random() * 2000,
      };
    }),
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Canvas energy field
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isVisible) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let mob = window.innerWidth <= 768;
    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      mob = window.innerWidth <= 768;
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const sparks: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
      hue: number;
    }[] = [];

    let time = 0;

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      time += 0.016;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const spawnRate = mob ? 0.3 : 0.4;

      if (mob) {
        // Mobile: vertical — sparks from top (creative) and bottom (engineer)
        if (Math.random() < spawnRate) {
          sparks.push({
            x: cx + (Math.random() - 0.5) * w * 0.5,
            y: h * 0.12,
            vx: (Math.random() - 0.5) * 0.8,
            vy: 1.5 + Math.random() * 2,
            life: 0,
            maxLife: 55 + Math.random() * 40,
            size: 1 + Math.random() * 1.5,
            hue: 35 + Math.random() * 15,
          });
        }
        if (Math.random() < spawnRate) {
          sparks.push({
            x: cx + (Math.random() - 0.5) * w * 0.5,
            y: h * 0.88,
            vx: (Math.random() - 0.5) * 0.8,
            vy: -(1.5 + Math.random() * 2),
            life: 0,
            maxLife: 55 + Math.random() * 40,
            size: 1 + Math.random() * 1.5,
            hue: 45 + Math.random() * 10,
          });
        }
      } else {
        // Desktop: horizontal
        if (Math.random() < spawnRate) {
          sparks.push({
            x: w * 0.15,
            y: cy + (Math.random() - 0.5) * h * 0.35,
            vx: 2 + Math.random() * 2.5,
            vy: (Math.random() - 0.5) * 1.2,
            life: 0,
            maxLife: 60 + Math.random() * 50,
            size: 1 + Math.random() * 2,
            hue: 35 + Math.random() * 15,
          });
        }
        if (Math.random() < spawnRate) {
          sparks.push({
            x: w * 0.85,
            y: cy + (Math.random() - 0.5) * h * 0.35,
            vx: -(2 + Math.random() * 2.5),
            vy: (Math.random() - 0.5) * 1.2,
            life: 0,
            maxLife: 60 + Math.random() * 50,
            size: 1 + Math.random() * 2,
            hue: 45 + Math.random() * 10,
          });
        }
      }

      // Wave lines
      if (mob) {
        // Vertical waves flowing toward center
        const waveTop = h * 0.15;
        const waveBot = h * 0.85;
        for (let i = 0; i < 3; i++) {
          // From top
          ctx.beginPath();
          ctx.strokeStyle = `rgba(198,153,58,${0.04 + i * 0.01})`;
          ctx.lineWidth = 0.8;
          for (let y = waveTop; y < cy; y += 2) {
            const progress = (y - waveTop) / (cy - waveTop);
            const amplitude =
              16 * (1 - progress * 0.7) * Math.sin(time * 0.8 + i * 0.6);
            const x =
              cx + Math.sin(y * 0.01 + time * 1.4 + i * 0.8) * amplitude;
            if (y === waveTop) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();

          // From bottom
          ctx.beginPath();
          ctx.strokeStyle = `rgba(224,213,192,${0.04 + i * 0.01})`;
          ctx.lineWidth = 0.8;
          for (let y = waveBot; y > cy; y -= 2) {
            const progress = (waveBot - y) / (waveBot - cy);
            const amplitude =
              16 * (1 - progress * 0.7) * Math.sin(time * 0.8 + i * 0.6);
            const x =
              cx +
              Math.sin((waveBot - y) * 0.01 + time * 1.4 + i * 0.8 + Math.PI) *
                amplitude;
            if (y === waveBot) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      } else {
        const waveStart = w * 0.2;
        const waveEnd = w * 0.8;
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(198,153,58,${0.05 + i * 0.012})`;
          ctx.lineWidth = 0.8;
          for (let x = waveStart; x < cx; x += 2) {
            const progress = (x - waveStart) / (cx - waveStart);
            const amplitude =
              22 * (1 - progress * 0.7) * Math.sin(time * 0.8 + i * 0.6);
            const y =
              cy + Math.sin(x * 0.012 + time * 1.4 + i * 0.8) * amplitude;
            if (x === waveStart) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(224,213,192,${0.05 + i * 0.012})`;
          ctx.lineWidth = 0.8;
          for (let x = waveEnd; x > cx; x -= 2) {
            const progress = (waveEnd - x) / (waveEnd - cx);
            const amplitude =
              22 * (1 - progress * 0.7) * Math.sin(time * 0.8 + i * 0.6);
            const y =
              cy +
              Math.sin(
                (waveEnd - x) * 0.012 + time * 1.4 + i * 0.8 + Math.PI,
              ) * amplitude;
            if (x === waveEnd) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }

      // Update & draw sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life++;

        if (mob) {
          const distToCenter = Math.abs(s.y - cy);
          const attractStrength = Math.max(0, 1 - distToCenter / (h * 0.4));
          s.vy += (cy - s.y) * 0.0005 * attractStrength;
          s.vx += (cx - s.x) * 0.0002;
          s.vx += (Math.random() - 0.5) * 0.08;
          s.x += s.vx;
          s.y += s.vy;

          const lifeRatio = s.life / s.maxLife;
          const alpha =
            lifeRatio < 0.1
              ? lifeRatio / 0.1
              : lifeRatio > 0.7
                ? (1 - lifeRatio) / 0.3
                : 1;

          if (distToCenter < 50) {
            const burstAlpha = alpha * (1 - distToCenter / 50);
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size * 2, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${s.hue}, 70%, 65%, ${burstAlpha * 0.3})`;
            ctx.fill();
          }

          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${s.hue}, 60%, 60%, ${alpha * 0.65})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${s.hue}, 50%, 50%, ${alpha * 0.06})`;
          ctx.fill();
        } else {
          const distToCenter = Math.abs(s.x - cx);
          const attractStrength = Math.max(0, 1 - distToCenter / (w * 0.4));
          s.vx += (cx - s.x) * 0.0006 * attractStrength;
          s.vy += (cy - s.y) * 0.00025;
          s.vy += (Math.random() - 0.5) * 0.1;
          s.x += s.vx;
          s.y += s.vy;

          const lifeRatio = s.life / s.maxLife;
          const alpha =
            lifeRatio < 0.1
              ? lifeRatio / 0.1
              : lifeRatio > 0.7
                ? (1 - lifeRatio) / 0.3
                : 1;

          if (distToCenter < 60) {
            const burstAlpha = alpha * (1 - distToCenter / 60);
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${s.hue}, 70%, 65%, ${burstAlpha * 0.35})`;
            ctx.fill();
          }

          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${s.hue}, 60%, 60%, ${alpha * 0.7})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${s.hue}, 50%, 50%, ${alpha * 0.08})`;
          ctx.fill();
        }

        if (s.life >= s.maxLife) {
          sparks.splice(i, 1);
        }
      }

      // Center convergence glow
      const glowIntensity = 0.15 + Math.sin(time * 1.5) * 0.05;
      const glowR = mob ? 65 : 90;
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
      gradient.addColorStop(0, `rgba(198,153,58,${glowIntensity * 1.2})`);
      gradient.addColorStop(0.4, `rgba(198,153,58,${glowIntensity * 0.4})`);
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.fillRect(cx - glowR, cy - glowR, glowR * 2, glowR * 2);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [isVisible]);

  // Anime.js driven DOM animations
  useEffect(() => {
    if (!isVisible || animStarted.current) return;
    animStarted.current = true;

    const mob = window.innerWidth <= 768;

    const leftParticles = particleRefs.current.filter(
      (_, i) => i < PARTICLE_COUNT / 2,
    );
    const rightParticles = particleRefs.current.filter(
      (_, i) => i >= PARTICLE_COUNT / 2,
    );

    if (mob) {
      // Mobile: particles drift vertically toward center
      animate(leftParticles.filter(Boolean), {
        translateY: [
          { to: "18vh", ease: "outExpo" },
          { to: "9vh", ease: "inOutSine" },
        ],
        opacity: [
          { to: 0.7, duration: 500 },
          { to: 0.08, duration: 1800 },
        ],
        scale: [
          { to: [0, 1], ease: "outBack" },
          { to: 0.2, ease: "inSine" },
        ],
        duration: 2400,
        delay: stagger(90, { start: 100 }),
        loop: true,
        ease: "inOutQuad",
      });
      animate(rightParticles.filter(Boolean), {
        translateY: [
          { to: "-18vh", ease: "outExpo" },
          { to: "-9vh", ease: "inOutSine" },
        ],
        opacity: [
          { to: 0.7, duration: 500 },
          { to: 0.08, duration: 1800 },
        ],
        scale: [
          { to: [0, 1], ease: "outBack" },
          { to: 0.2, ease: "inSine" },
        ],
        duration: 2400,
        delay: stagger(90, { start: 100 }),
        loop: true,
        ease: "inOutQuad",
      });
    } else {
      animate(leftParticles.filter(Boolean), {
        translateX: [
          { to: "20vw", ease: "outExpo" },
          { to: "10vw", ease: "inOutSine" },
        ],
        opacity: [
          { to: 0.8, duration: 500 },
          { to: 0.1, duration: 2000 },
        ],
        scale: [
          { to: [0, 1.2], ease: "outBack" },
          { to: 0.3, ease: "inSine" },
        ],
        duration: 2600,
        delay: stagger(100, { start: 150 }),
        loop: true,
        ease: "inOutQuad",
      });
      animate(rightParticles.filter(Boolean), {
        translateX: [
          { to: "-20vw", ease: "outExpo" },
          { to: "-10vw", ease: "inOutSine" },
        ],
        opacity: [
          { to: 0.8, duration: 500 },
          { to: 0.1, duration: 2000 },
        ],
        scale: [
          { to: [0, 1.2], ease: "outBack" },
          { to: 0.3, ease: "inSine" },
        ],
        duration: 2600,
        delay: stagger(100, { start: 150 }),
        loop: true,
        ease: "inOutQuad",
      });
    }

    // Wave arcs
    animate(leftWaveRefs.current.filter(Boolean), {
      ...(mob ? { scaleY: [0, 1] } : { scaleX: [0, 1] }),
      opacity: [0.5, 0],
      duration: 2500,
      delay: stagger(400),
      loop: true,
      ease: "outCubic",
    });
    animate(rightWaveRefs.current.filter(Boolean), {
      ...(mob ? { scaleY: [0, 1] } : { scaleX: [0, 1] }),
      opacity: [0.5, 0],
      duration: 2500,
      delay: stagger(400),
      loop: true,
      ease: "outCubic",
    });

    // Center glow pulse
    animate(centerGlowRef.current!, {
      scale: [0.85, 1.15],
      opacity: [0.3, 0.7],
      duration: 2000,
      loop: true,
      alternate: true,
      ease: "inOutSine",
    });

    // Text entrance
    const tl = createTimeline({ defaults: { ease: "outExpo" } });
    tl.add(leftLabelRef.current!, {
      ...(mob
        ? { translateY: [-40, 0] }
        : { translateX: [-80, 0] }),
      opacity: [0, 1],
      duration: 1200,
    })
      .add(
        rightLabelRef.current!,
        {
          ...(mob
            ? { translateY: [40, 0] }
            : { translateX: [80, 0] }),
          opacity: [0, 1],
          duration: 1200,
        },
        "<",
      )
      .add(
        centerTextRef.current!,
        {
          scale: [0.7, 1],
          opacity: [0, 1],
          duration: 1400,
        },
        "-=800",
      )
      .add(
        filmStripRef.current!,
        {
          scale: [0.6, 1],
          opacity: [0, 1],
          duration: 1000,
        },
        "-=600",
      );
  }, [isVisible]);

  // --- Mobile: vertical layout, particles repositioned ---
  const mobileParticles = React.useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const side = i < PARTICLE_COUNT / 2 ? "left" : "right";
      return {
        x: 0.15 + Math.random() * 0.7,
        y:
          side === "left"
            ? 0.08 + Math.random() * 0.25
            : 0.67 + Math.random() * 0.25,
        size: 1.5 + Math.random() * 3,
      };
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{
        height: "100vh",
        background:
          "linear-gradient(180deg, #050505 0%, #0a0806 30%, #0a0806 70%, #050505 100%)",
      }}
    >
      {/* Subtle top border */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "10%",
          right: "10%",
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(198,153,58,0.2), transparent)",
        }}
      />

      {/* Canvas layer */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 1.5s ease",
        }}
      />

      {/* DOM particles */}
      {(isMobile ? mobileParticles : particles.current).map((p, i) => (
        <div
          key={`p-${i}`}
          ref={(el) => {
            particleRefs.current[i] = el;
          }}
          style={{
            position: "absolute",
            left: isMobile ? `${p.x * 100}%` : `${(particles.current[i]?.baseX ?? 0.5) * 100}%`,
            top: isMobile ? `${p.y * 100}%` : `${(particles.current[i]?.baseY ?? 0.5) * 100}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background:
              i < PARTICLE_COUNT / 2
                ? "rgba(198,153,58,0.85)"
                : "rgba(224,213,192,0.85)",
            boxShadow:
              i < PARTICLE_COUNT / 2
                ? "0 0 6px rgba(198,153,58,0.4)"
                : "0 0 6px rgba(224,213,192,0.4)",
            opacity: 0,
            willChange: "transform, opacity",
          }}
        />
      ))}

      {/* Wave arcs — left/top */}
      {Array.from({ length: WAVE_COUNT }).map((_, i) => (
        <div
          key={`lw-${i}`}
          ref={(el) => {
            leftWaveRefs.current[i] = el;
          }}
          style={
            isMobile
              ? {
                  position: "absolute",
                  left: `${48 + i * 1.2}%`,
                  top: "15%",
                  width: 1.5,
                  height: "30%",
                  transformOrigin: "center top",
                  background: `linear-gradient(180deg, rgba(198,153,58,${0.22 - i * 0.03}), transparent)`,
                  borderRadius: 1,
                  opacity: 0,
                  willChange: "transform, opacity",
                }
              : {
                  position: "absolute",
                  left: "20%",
                  top: `${47 + i * 1.5}%`,
                  width: "28%",
                  height: 1.5,
                  transformOrigin: "left center",
                  background: `linear-gradient(90deg, rgba(198,153,58,${0.25 - i * 0.035}), transparent)`,
                  borderRadius: 1,
                  opacity: 0,
                  willChange: "transform, opacity",
                }
          }
        />
      ))}

      {/* Wave arcs — right/bottom */}
      {Array.from({ length: WAVE_COUNT }).map((_, i) => (
        <div
          key={`rw-${i}`}
          ref={(el) => {
            rightWaveRefs.current[i] = el;
          }}
          style={
            isMobile
              ? {
                  position: "absolute",
                  left: `${48 + i * 1.2}%`,
                  bottom: "15%",
                  width: 1.5,
                  height: "30%",
                  transformOrigin: "center bottom",
                  background: `linear-gradient(0deg, rgba(224,213,192,${0.22 - i * 0.03}), transparent)`,
                  borderRadius: 1,
                  opacity: 0,
                  willChange: "transform, opacity",
                }
              : {
                  position: "absolute",
                  right: "20%",
                  top: `${47 + i * 1.5}%`,
                  width: "28%",
                  height: 1.5,
                  transformOrigin: "right center",
                  background: `linear-gradient(270deg, rgba(224,213,192,${0.25 - i * 0.035}), transparent)`,
                  borderRadius: 1,
                  opacity: 0,
                  willChange: "transform, opacity",
                }
          }
        />
      ))}

      {/* Center convergence glow */}
      <div
        ref={centerGlowRef}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: isMobile ? 130 : 180,
          height: isMobile ? 130 : 180,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(198,153,58,0.18) 0%, rgba(198,153,58,0.04) 50%, transparent 70%)",
          opacity: 0,
          willChange: "transform, opacity",
        }}
      />

      {/* Center clapperboard icon */}
      <div
        ref={filmStripRef}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: isMobile ? 72 : 88,
          height: isMobile ? 72 : 88,
          opacity: 0,
          willChange: "transform, opacity",
        }}
      >
        <svg viewBox="0 0 48 48" fill="none" style={{ width: "100%", height: "100%" }}>
          <rect x="6" y="16" width="36" height="26" rx="2" stroke="rgba(198,153,58,0.7)" strokeWidth="1.5" />
          <line x1="6" y1="24" x2="42" y2="24" stroke="rgba(198,153,58,0.3)" strokeWidth="0.8" />
          <path d="M6 16 L6 10 L42 10 L42 16" stroke="rgba(198,153,58,0.6)" strokeWidth="1.5" strokeLinejoin="round" />
          {[12, 20, 28, 36].map(x => (
            <line key={x} x1={x} y1={10} x2={x - 3} y2={16} stroke="rgba(198,153,58,0.45)" strokeWidth="1.2" />
          ))}
          <text x="24" y="35" textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize="5" fill="rgba(198,153,58,0.5)">SCENE 01</text>
        </svg>
      </div>

      {/* Text: Left / Top label */}
      <div
        ref={leftLabelRef}
        style={
          isMobile
            ? {
                position: "absolute",
                top: "10%",
                left: "50%",
                transform: "translateX(-50%)",
                opacity: 0,
                textAlign: "center",
              }
            : {
                position: "absolute",
                left: "6%",
                top: "50%",
                transform: "translateY(-50%)",
                opacity: 0,
                textAlign: "right",
                maxWidth: "28%",
              }
        }
      >
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: isMobile ? "0.55rem" : "clamp(0.5rem, 0.7vw, 0.6rem)",
            color: "rgba(198,153,58,0.25)",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginBottom: "0.6em",
          }}
        >
          The Dreamers
        </div>
        <div
          style={{
            fontFamily: "'IBM Plex Serif', serif",
            fontSize: isMobile
              ? "1.6rem"
              : "clamp(1.6rem, 3.5vw, 2.6rem)",
            fontWeight: 600,
            color: "rgba(198,153,58,0.9)",
            letterSpacing: "0.02em",
            lineHeight: 1.1,
          }}
        >
          Creatives
        </div>
        <div
          style={{
            width: isMobile ? "40%" : "60%",
            height: 1,
            background: isMobile
              ? "linear-gradient(90deg, transparent, rgba(198,153,58,0.25), transparent)"
              : "linear-gradient(270deg, rgba(198,153,58,0.25), transparent)",
            margin: isMobile ? "0.7em auto" : "1em 0 1em auto",
          }}
        />
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: isMobile
              ? "0.6rem"
              : "clamp(0.55rem, 0.85vw, 0.72rem)",
            color: "rgba(198,153,58,0.4)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            lineHeight: 1.8,
          }}
        >
          {isMobile ? "Vision · Story · Art · Emotion" : (
            <>
              Vision · Story · Art
              <br />
              Direction · Emotion
            </>
          )}
        </div>
      </div>

      {/* Text: Right / Bottom label */}
      <div
        ref={rightLabelRef}
        style={
          isMobile
            ? {
                position: "absolute",
                bottom: "10%",
                left: "50%",
                transform: "translateX(-50%)",
                opacity: 0,
                textAlign: "center",
              }
            : {
                position: "absolute",
                right: "6%",
                top: "50%",
                transform: "translateY(-50%)",
                opacity: 0,
                textAlign: "left",
                maxWidth: "28%",
              }
        }
      >
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: isMobile ? "0.55rem" : "clamp(0.5rem, 0.7vw, 0.6rem)",
            color: "rgba(224,213,192,0.25)",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginBottom: "0.6em",
          }}
        >
          The Builders
        </div>
        <div
          style={{
            fontFamily: "'IBM Plex Serif', serif",
            fontSize: isMobile
              ? "1.6rem"
              : "clamp(1.6rem, 3.5vw, 2.6rem)",
            fontWeight: 600,
            color: "rgba(224,213,192,0.9)",
            letterSpacing: "0.02em",
            lineHeight: 1.1,
          }}
        >
          Engineers
        </div>
        <div
          style={{
            width: isMobile ? "40%" : "60%",
            height: 1,
            background: isMobile
              ? "linear-gradient(90deg, transparent, rgba(224,213,192,0.25), transparent)"
              : "linear-gradient(90deg, rgba(224,213,192,0.25), transparent)",
            margin: isMobile ? "0.7em auto" : "1em 0",
          }}
        />
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: isMobile
              ? "0.6rem"
              : "clamp(0.55rem, 0.85vw, 0.72rem)",
            color: "rgba(224,213,192,0.4)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            lineHeight: 1.8,
          }}
        >
          {isMobile ? "Code · AI · Systems · Pipelines" : (
            <>
              Code · AI · Systems
              <br />
              Tooling · Pipelines
            </>
          )}
        </div>
      </div>

      {/* Center text */}
      <div
        ref={centerTextRef}
        style={{
          position: "absolute",
          left: "50%",
          ...(isMobile
            ? { top: "50%", transform: "translate(-50%, 48px)" }
            : { bottom: "22%", transform: "translateX(-50%)" }),
          textAlign: "center",
          opacity: 0,
          willChange: "transform, opacity",
          whiteSpace: "nowrap",
        }}
      >
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: isMobile
              ? "0.45rem"
              : "clamp(0.42rem, 0.65vw, 0.55rem)",
            color: "rgba(198,153,58,0.35)",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
          }}
        >
          Where it all converges
        </div>
      </div>

      {/* Section label */}
      <div
        style={{
          position: "absolute",
          top: isMobile ? "1rem" : "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 1.5s ease 0.3s",
        }}
      >
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: isMobile ? "0.5rem" : "0.6rem",
            color: "rgba(198,153,58,0.3)",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          The Collision
        </div>
      </div>
    </section>
  );
};

export default CollisionSection;
