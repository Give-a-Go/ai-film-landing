import React, { useRef, useEffect, useState } from "react";

// ── Easing ───────────────────────────────────────────────────────────────────
const easeOutCubic   = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInCubic    = (t: number) => t * t * t;
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}
function phase(p: number, start: number, end: number) {
  return clamp((p - start) / (end - start), 0, 1);
}

// ── Pre-defined dust motes along beam path ────────────────────────────────────
// Beam center line from lens (~19%,71%) toward screen (~67%,50%)
// Path formula: y = 71 - (x - 19) * 0.445  for each x%
const DUST_MOTES = [
  { x: 24, y: 70,   size: 1.4, dur: 4.5,  delay: 0   },
  { x: 30, y: 66,   size: 0.9, dur: 6.2,  delay: 1.5 },
  { x: 27, y: 68,   size: 1.8, dur: 3.8,  delay: 0.8 },
  { x: 38, y: 63,   size: 1.1, dur: 5.1,  delay: 2.2 },
  { x: 46, y: 59,   size: 1.6, dur: 4.7,  delay: 0.3 },
  { x: 43, y: 60.5, size: 1.0, dur: 7.0,  delay: 3.1 },
  { x: 57, y: 54,   size: 1.3, dur: 5.5,  delay: 1.9 },
  { x: 33, y: 65,   size: 0.8, dur: 4.2,  delay: 4.0 },
  { x: 51, y: 57,   size: 1.5, dur: 6.8,  delay: 0.6 },
  { x: 36, y: 64,   size: 1.1, dur: 5.3,  delay: 2.7 },
  { x: 53, y: 56,   size: 0.8, dur: 4.0,  delay: 1.2 },
  { x: 42, y: 61,   size: 1.5, dur: 6.5,  delay: 3.5 },
  { x: 28, y: 67,   size: 1.2, dur: 5.0,  delay: 0.9 },
  { x: 63, y: 51,   size: 0.7, dur: 4.8,  delay: 2.4 },
  { x: 48, y: 58,   size: 1.3, dur: 5.8,  delay: 4.2 },
] as const;

// ── Spokes helper ─────────────────────────────────────────────────────────────
function Spokes({ cx, cy, r, count = 8 }: { cx: number; cy: number; r: number; count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const a = (i * 360) / count;
        return (
          <line key={i} x1={cx} y1={cy}
            x2={cx + r * Math.cos((a * Math.PI) / 180)}
            y2={cy + r * Math.sin((a * Math.PI) / 180)}
            stroke="#888" strokeWidth="1.5" />
        );
      })}
    </>
  );
}

// ── SectionReveal ─────────────────────────────────────────────────────────────
function SectionReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(36px)",
      transition: `opacity 1s cubic-bezier(0.4,0,0.2,1) ${delay}s, transform 1s cubic-bezier(0.4,0,0.2,1) ${delay}s`,
    }}>
      {children}
    </div>
  );
}

// ── FilmStripBorder ───────────────────────────────────────────────────────────
function FilmStripBorder({ compact = false }: { compact?: boolean }) {
  return (
    <div style={{ width: "100%", overflow: "hidden", padding: compact ? "1rem 0" : "2.5rem 0" }}>
      <svg viewBox="0 0 1200 36" style={{
        width: "120%", marginLeft: "-10%", height: 36, display: "block",
        animation: "filmStripDrift 22s ease-in-out infinite",
      }} preserveAspectRatio="none" aria-hidden="true">
        <line x1="0" y1="3" x2="1200" y2="3" stroke="rgba(200,170,80,0.18)" strokeWidth="0.8" />
        <line x1="0" y1="33" x2="1200" y2="33" stroke="rgba(200,170,80,0.18)" strokeWidth="0.8" />
        {Array.from({ length: 56 }, (_, i) => (
          <React.Fragment key={i}>
            <rect x={i * 22 + 3} y="6" width="11" height="7" rx="1.5"
              fill="none" stroke="rgba(200,170,80,0.16)" strokeWidth="0.7" />
            <rect x={i * 22 + 3} y="23" width="11" height="7" rx="1.5"
              fill="none" stroke="rgba(200,170,80,0.16)" strokeWidth="0.7" />
          </React.Fragment>
        ))}
      </svg>
    </div>
  );
}

// ── ActLabel ──────────────────────────────────────────────────────────────────
function ActLabel({ number, title }: { number: string; title: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: "1.25rem", padding: "0.75rem 2rem",
    }}>
      <div style={{ height: 1, flex: 1, maxWidth: 60, background: "rgba(200,170,80,0.18)" }} />
      <div style={{
        fontFamily: "monospace",
        fontSize: "0.58rem",
        letterSpacing: "0.32em",
        color: "rgba(200,170,80,0.32)",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}>
        Act {number} &nbsp;·&nbsp; {title}
      </div>
      <div style={{ height: 1, flex: 1, maxWidth: 60, background: "rgba(200,170,80,0.18)" }} />
    </div>
  );
}

// ── TicketCard ────────────────────────────────────────────────────────────────
function TicketCard({ day, title, description, badge }: {
  day: string; title: string; description: string; badge?: string;
}) {
  return (
    <div style={{
      position: "relative",
      background: "linear-gradient(150deg, rgba(28,22,8,0.96) 0%, rgba(10,8,3,1) 100%)",
      border: "1px solid rgba(200,170,80,0.22)",
      flex: "1 1 340px",
      maxWidth: 440,
      minHeight: 300,
      display: "flex",
      overflow: "visible",
    }}>
      {/* Left notch cutout */}
      <div style={{
        position: "absolute",
        left: -9, top: "50%",
        transform: "translateY(-50%)",
        width: 18, height: 18,
        borderRadius: "50%",
        background: "#000",
        border: "1px solid rgba(200,170,80,0.18)",
        zIndex: 2,
      }} />
      {/* Right notch cutout (at perforation line) */}
      <div style={{
        position: "absolute",
        right: 38, top: "50%",
        transform: "translateY(-50%)",
        width: 18, height: 18,
        borderRadius: "50%",
        background: "#000",
        border: "1px solid rgba(200,170,80,0.18)",
        zIndex: 2,
      }} />

      {/* Main body */}
      <div style={{
        flex: 1,
        padding: "2.75rem 2.25rem",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px dashed rgba(200,170,80,0.16)",
        gap: "1rem",
      }}>
        {/* Day label with small decorative line */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{
            fontFamily: "monospace",
            fontSize: "0.62rem",
            letterSpacing: "0.28em",
            color: "rgba(200,170,80,0.55)",
            textTransform: "uppercase",
          }}>
            {day}
          </span>
          <div style={{ flex: 1, height: 1, background: "rgba(200,170,80,0.12)" }} />
        </div>

        {/* Title */}
        <div style={{
          fontFamily: "'IBM Plex Serif', Georgia, serif",
          fontSize: "clamp(1.6rem, 2.8vw, 2.1rem)",
          fontWeight: 700,
          color: "rgba(248,236,188,0.97)",
          lineHeight: 1.12,
        }}>
          {title}
        </div>

        {/* Description */}
        <div style={{
          fontFamily: "'IBM Plex Sans', sans-serif",
          fontSize: "0.875rem",
          color: "rgba(255,255,255,0.42)",
          lineHeight: 1.7,
          flex: 1,
        }}>
          {description}
        </div>

        {badge && (
          <div style={{
            alignSelf: "flex-start",
            fontFamily: "monospace",
            fontSize: "0.58rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(248,236,188,0.9)",
            border: "1px solid rgba(200,170,80,0.38)",
            padding: "0.38rem 0.8rem",
            animation: "nowShowingPulse 2.8s ease-in-out infinite",
          }}>
            {badge}
          </div>
        )}
      </div>

      {/* ADMIT ONE strip */}
      <div style={{
        width: 38,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(200,170,80,0.025)",
      }}>
        <span style={{
          writingMode: "vertical-rl",
          transform: "rotate(180deg)",
          fontFamily: "monospace",
          fontSize: "0.48rem",
          letterSpacing: "0.22em",
          color: "rgba(200,170,80,0.22)",
          textTransform: "uppercase",
        }}>
          Admit One
        </span>
      </div>
    </div>
  );
}

// ── FilmReelDivider ───────────────────────────────────────────────────────────
function FilmReelDivider() {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: "1rem", padding: "1.5rem 0",
    }}>
      <div style={{ flex: 1, maxWidth: 200, height: 1, background: "rgba(200,170,80,0.12)" }} />
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="9.5" stroke="rgba(200,170,80,0.25)" strokeWidth="0.8" />
        <circle cx="11" cy="11" r="5.5" stroke="rgba(200,170,80,0.18)" strokeWidth="0.8" />
        <circle cx="11" cy="11" r="2" fill="rgba(200,170,80,0.28)" />
        {[0, 60, 120, 180, 240, 300].map(a => (
          <line key={a}
            x1={11 + 3 * Math.cos(a * Math.PI / 180)} y1={11 + 3 * Math.sin(a * Math.PI / 180)}
            x2={11 + 9 * Math.cos(a * Math.PI / 180)} y2={11 + 9 * Math.sin(a * Math.PI / 180)}
            stroke="rgba(200,170,80,0.15)" strokeWidth="0.8" />
        ))}
      </svg>
      <div style={{ flex: 1, maxWidth: 200, height: 1, background: "rgba(200,170,80,0.12)" }} />
    </div>
  );
}

// ── Vertical Film Strip (fixed sides) ────────────────────────────────────────
function VerticalFilmStrip({ side }: { side: "left" | "right" }) {
  const svgUri = encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="18">' +
    '<rect x="3" y="3" width="14" height="12" rx="2" fill="none" stroke="rgba(255,255,255,0.055)" stroke-width="0.8"/>' +
    '</svg>'
  );
  return (
    <div style={{
      position: "fixed",
      [side]: 0,
      top: 0,
      bottom: 0,
      width: 20,
      background: "#040404",
      backgroundImage: `url("data:image/svg+xml;charset=utf-8,${svgUri}")`,
      backgroundSize: "20px 18px",
      backgroundRepeat: "repeat-y",
      zIndex: 40,
      pointerEvents: "none",
      borderRight: side === "left" ? "1px solid rgba(255,255,255,0.035)" : undefined,
      borderLeft: side === "right" ? "1px solid rgba(255,255,255,0.035)" : undefined,
    }} />
  );
}

// ── SponsorBox ────────────────────────────────────────────────────────────────
function SponsorBox({ name }: { name: string }) {
  return (
    <div style={{
      width: 180,
      height: 76,
      border: "1px solid rgba(200,170,80,0.18)",
      borderRadius: 3,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'IBM Plex Sans', sans-serif",
      fontSize: "0.88rem",
      fontWeight: 500,
      color: "rgba(248,236,188,0.55)",
      background: "rgba(232,223,192,0.025)",
      letterSpacing: "0.04em",
      transition: "border-color 0.3s, color 0.3s",
    }}>
      {name}
    </div>
  );
}

// ── EventPage ─────────────────────────────────────────────────────────────────
const EventPage: React.FC = () => {
  const sceneRef       = useRef<HTMLDivElement>(null);
  const clapboardRef   = useRef<SVGSVGElement>(null);
  const clapArmRef     = useRef<SVGGElement>(null);
  const flashRef       = useRef<HTMLDivElement>(null);
  const cameraGroupRef = useRef<HTMLDivElement>(null);
  const beamDivRef     = useRef<HTMLDivElement>(null);
  const screenRef      = useRef<HTMLDivElement>(null);
  const screenTextRef  = useRef<HTMLDivElement>(null);
  const grainRef       = useRef<SVGFETurbulenceElement>(null);
  const introRef       = useRef<HTMLDivElement>(null);
  const cameraGlowRef  = useRef<HTMLDivElement>(null);
  const screenGlowRef  = useRef<HTMLDivElement>(null);
  const frameCount     = useRef(0);

  const CINEMATIC_START = 0;
  const CINEMATIC_END   = 3.0;

  useEffect(() => {
    let raf: number;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const vh      = window.innerHeight;
      const scrollY = window.scrollY;
      const p = clamp(
        (scrollY - CINEMATIC_START * vh) / ((CINEMATIC_END - CINEMATIC_START) * vh),
        0, 1,
      );

      if (introRef.current) {
        introRef.current.style.opacity = String(easeOutCubic(1 - phase(p, 0, 0.15)));
      }
      if (sceneRef.current) {
        sceneRef.current.style.opacity = String(easeOutCubic(phase(p, 0, 0.08)));
      }

      // ── Clapboard ──
      if (clapboardRef.current) {
        const dropIn  = easeOutCubic(phase(p, 0.00, 0.14));
        const exitOut = easeInCubic(phase(p, 0.26, 0.40));
        const y = -120 + dropIn * 120 + exitOut * 140;
        clapboardRef.current.style.transform = `translateX(-50%) translateY(${y}%)`;
        clapboardRef.current.style.opacity   = p > 0.40 ? "0" : "1";
      }
      if (clapArmRef.current) {
        const snapT = easeInOutCubic(phase(p, 0.20, 0.25));
        clapArmRef.current.style.transform = `rotate(${-28 * (1 - snapT)}deg)`;
      }

      // ── Flash ──
      if (flashRef.current) {
        const fp    = phase(p, 0.24, 0.30);
        const spike = fp < 0.4 ? fp / 0.4 : 1 - (fp - 0.4) / 0.6;
        flashRef.current.style.opacity = String(spike * 0.85);
      }

      // ── Camera slides in ──
      if (cameraGroupRef.current) {
        const camIn = easeOutCubic(phase(p, 0.32, 0.58));
        const tx = (1 - camIn) * -120;
        const ty = (1 - camIn) * 80;
        cameraGroupRef.current.style.opacity   = String(easeOutCubic(phase(p, 0.32, 0.50)));
        cameraGroupRef.current.style.transform = `translateX(${tx}%) translateY(${ty}%) rotate(-6deg)`;
      }

      if (cameraGlowRef.current) {
        cameraGlowRef.current.style.opacity = String(easeOutCubic(phase(p, 0.40, 0.60)));
      }

      // ── Beam ──
      if (beamDivRef.current) {
        beamDivRef.current.style.opacity = String(easeOutCubic(phase(p, 0.50, 0.70)));
      }

      if (screenGlowRef.current) {
        screenGlowRef.current.style.opacity = String(easeOutCubic(phase(p, 0.50, 0.70)));
      }

      // ── Screen ──
      if (screenRef.current) {
        const sp = easeOutCubic(phase(p, 0.54, 0.70));
        screenRef.current.style.opacity   = String(sp);
        screenRef.current.style.transform =
          `translateY(-50%) perspective(1200px) rotateY(-4deg) scale(${0.92 + sp * 0.08})`;
      }

      // ── Text wipe ──
      if (screenTextRef.current) {
        const wp = easeOutCubic(phase(p, 0.68, 0.90));
        screenTextRef.current.style.clipPath = `inset(0 ${(1 - wp) * 100}% 0 0)`;
      }

      // Film grain jitter
      frameCount.current++;
      if (grainRef.current && frameCount.current % 4 === 0 && p > 0.68) {
        const bf = 0.65 + (Math.random() - 0.5) * 0.10;
        grainRef.current.setAttribute("baseFrequency", `${bf} ${bf}`);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>

      {/* ── Vertical film strip sides ── */}
      <VerticalFilmStrip side="left" />
      <VerticalFilmStrip side="right" />

      {/* ── Back nav ── */}
      <nav style={{
        position: "fixed", top: 0, left: 20, right: 20,
        zIndex: 100, padding: "1.25rem 2rem",
        display: "flex", alignItems: "center", gap: "1rem",
      }}>
        <a href="/" style={{
          color: "rgba(255,255,255,0.45)",
          fontSize: "0.75rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          textDecoration: "none",
          fontFamily: "monospace",
          transition: "color 0.2s",
        }}
          onMouseEnter={e => (e.target as HTMLElement).style.color = "rgba(248,236,188,0.8)"}
          onMouseLeave={e => (e.target as HTMLElement).style.color = "rgba(255,255,255,0.45)"}
        >
          ← Give(a)Go
        </a>
      </nav>

      {/* ════ 500vh cinematic scroll zone ════ */}
      <div style={{ height: "500vh" }}>
        <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: "#000" }}>

          {/* SVG filters */}
          <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true">
            <defs>
              <filter id="ev-grain" x="0%" y="0%" width="100%" height="100%">
                <feTurbulence ref={grainRef} type="fractalNoise"
                  baseFrequency="0.65 0.65" numOctaves="3" stitchTiles="stitch" result="noise" />
                <feColorMatrix type="saturate" values="0" in="noise" result="gn" />
                <feBlend in="SourceGraphic" in2="gn" mode="overlay" result="b" />
                <feComposite in="b" in2="SourceGraphic" operator="in" />
              </filter>
            </defs>
          </svg>

          {/* Intro text */}
          <div ref={introRef} style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", zIndex: 2, pointerEvents: "none",
          }}>
            <div style={{
              fontFamily: "monospace",
              fontSize: "clamp(0.55rem, 1vw, 0.75rem)",
              color: "rgba(255,255,255,0.28)",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              marginBottom: "1.4rem",
            }}>
              Scroll to begin
            </div>
            <div style={{
              fontFamily: "'IBM Plex Serif', Georgia, serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 700,
              color: "rgba(255,255,255,0.9)",
              letterSpacing: "0.02em",
              lineHeight: 1.05,
              textAlign: "center",
            }}>
              AI Film Making<br />
              <span style={{ fontWeight: 300, fontStyle: "italic", fontSize: "0.75em" }}>
                Hackathon v2
              </span>
            </div>
            <div style={{
              marginTop: "2.5rem", width: 1, height: 56,
              background: "linear-gradient(to bottom, rgba(255,255,255,0.35), transparent)",
              animation: "fadeUpDown 1.8s ease-in-out infinite",
            }} />
          </div>

          {/* ── Clapboard — lives OUTSIDE sceneRef so it's not hidden by opacity:0 ── */}
          <svg ref={clapboardRef} viewBox="0 0 320 220" style={{
              position: "absolute", top: "8%", left: "50%",
              transform: "translateX(-50%) translateY(-120%)",
              width: "min(480px, 58vw)",
              zIndex: 8,
              filter: "drop-shadow(0 12px 40px rgba(0,0,0,0.95))",
              transformOrigin: "top center",
            }} aria-hidden="true">
              <rect x="0" y="40" width="320" height="180" rx="5" fill="#2a2a2a" />
              {Array.from({ length: 16 }, (_, i) => (
                <rect key={i} x={i * 22 - 8} y="40" width="13" height="72"
                  fill={i % 2 === 0 ? "#0f0f0f" : "#e8e8e8"} transform="skewX(-15)" />
              ))}
              <rect x="0" y="40" width="320" height="72" fill="none" />
              <rect x="4" y="114" width="312" height="102" rx="3" fill="#e8dfc0" />
              {[132, 150, 168, 186, 204].map(y => (
                <line key={y} x1="12" y1={y} x2="308" y2={y} stroke="rgba(0,0,0,0.10)" strokeWidth="1" />
              ))}
              <text x="14" y="130" fontFamily="monospace" fontSize="11" fill="#1a1a1a" fontWeight="bold" letterSpacing="1">SCENE  01  /  TAKE  01</text>
              <text x="14" y="150" fontFamily="monospace" fontSize="9.5" fill="#333">DIRECTOR:  AI SYSTEMS</text>
              <text x="14" y="168" fontFamily="monospace" fontSize="9.5" fill="#333">PROD:  Give(a)Go</text>
              <text x="14" y="186" fontFamily="monospace" fontSize="9.5" fill="#333">TITLE:  AI FILM HACKATHON v2</text>
              <text x="14" y="207" fontFamily="monospace" fontSize="9" fill="#888">DATE:  2025  ·  DUBLIN</text>
              <circle cx="10"  cy="40" r="9" fill="#888" stroke="#aaa" strokeWidth="1.5" />
              <circle cx="10"  cy="40" r="4.5" fill="#ccc" />
              <circle cx="310" cy="40" r="9" fill="#888" stroke="#aaa" strokeWidth="1.5" />
              <circle cx="310" cy="40" r="4.5" fill="#ccc" />
              <rect x="0" y="40" width="320" height="180" rx="5" fill="none" stroke="#555" strokeWidth="2" />
              <g ref={clapArmRef} style={{ transformOrigin: "4px 40px", transform: "rotate(-28deg)" }}>
                <rect x="0" y="5" width="320" height="37" rx="4" fill="#2a2a2a" />
                {Array.from({ length: 16 }, (_, i) => (
                  <rect key={i} x={i * 22 - 8} y="5" width="13" height="37"
                    fill={i % 2 === 0 ? "#e8e8e8" : "#0f0f0f"} transform="skewX(-15)" />
                ))}
                <rect x="0" y="5" width="320" height="37" rx="4" fill="none" stroke="#666" strokeWidth="1.5" />
                <circle cx="10"  cy="40" r="9" fill="#666" stroke="#999" strokeWidth="1.5" />
                <circle cx="10"  cy="40" r="4.5" fill="#bbb" />
                <circle cx="310" cy="40" r="9" fill="#666" stroke="#999" strokeWidth="1.5" />
                <circle cx="310" cy="40" r="4.5" fill="#bbb" />
              </g>
          </svg>

          {/* ── Cinematic scene (camera, beam, screen) — kept separate from clapboard ── */}
          <div ref={sceneRef} style={{ position: "absolute", inset: 0, opacity: 0 }}>

            {/* Flash */}
            <div ref={flashRef} style={{
              position: "absolute", inset: 0,
              background: "#fff", opacity: 0, zIndex: 10, pointerEvents: "none",
            }} />

            {/* Camera ambient glow */}
            <div ref={cameraGlowRef} style={{
              position: "absolute",
              width: "50%", height: "70%", bottom: 0, left: 0,
              background: "radial-gradient(ellipse at 20% 90%, rgba(255,200,50,0.16) 0%, transparent 62%)",
              pointerEvents: "none", opacity: 0, zIndex: 1,
            }} />

            {/* Screen ambient glow */}
            <div ref={screenGlowRef} style={{
              position: "absolute",
              width: "70%", height: "90%", right: 0, top: "5%",
              background: "radial-gradient(ellipse at 80% 50%, rgba(255,200,50,0.09) 0%, transparent 58%)",
              pointerEvents: "none", opacity: 0, zIndex: 1,
            }} />

            {/* ══════════════════════════════════════════════════════════════════
                PROJECTOR BEAM — multi-layer conic+radial, with dust motes
                Lens position: ~19% from left, ~71% from top (viewport %)
                Beam direction: 66° from north (upper-right toward screen)
                ══════════════════════════════════════════════════════════════ */}
            <div ref={beamDivRef} style={{
              position: "absolute", inset: 0,
              pointerEvents: "none",
              opacity: 0, zIndex: 2,
            }}>
              {/* Layer 1: Atmospheric haze — widest cone, very soft */}
              <div style={{
                position: "absolute", inset: 0,
                background: "conic-gradient(from 0deg at 19% 71%, transparent 33deg, rgba(255,215,70,0.05) 49deg, rgba(255,210,60,0.11) 66deg, rgba(255,215,70,0.05) 83deg, transparent 99deg)",
                filter: "blur(35px)",
                maskImage: "radial-gradient(ellipse 95% 95% at 19% 71%, black 0%, black 35%, transparent 92%)",
                WebkitMaskImage: "radial-gradient(ellipse 95% 95% at 19% 71%, black 0%, black 35%, transparent 92%)",
              }} />
              {/* Layer 2: Outer beam body */}
              <div style={{
                position: "absolute", inset: 0,
                background: "conic-gradient(from 0deg at 19% 71%, transparent 45deg, rgba(255,232,100,0.12) 56deg, rgba(255,228,90,0.28) 66deg, rgba(255,232,100,0.12) 76deg, transparent 87deg)",
                filter: "blur(16px)",
                maskImage: "radial-gradient(ellipse 88% 88% at 19% 71%, black 0%, black 20%, transparent 86%)",
                WebkitMaskImage: "radial-gradient(ellipse 88% 88% at 19% 71%, black 0%, black 20%, transparent 86%)",
              }} />
              {/* Layer 3: Inner beam */}
              <div style={{
                position: "absolute", inset: 0,
                background: "conic-gradient(from 0deg at 19% 71%, transparent 53deg, rgba(255,242,128,0.22) 60deg, rgba(255,240,118,0.48) 66deg, rgba(255,242,128,0.22) 72deg, transparent 79deg)",
                filter: "blur(8px)",
                maskImage: "radial-gradient(ellipse 78% 78% at 19% 71%, black 0%, black 12%, transparent 80%)",
                WebkitMaskImage: "radial-gradient(ellipse 78% 78% at 19% 71%, black 0%, black 12%, transparent 80%)",
              }} />
              {/* Layer 4: Bright core */}
              <div style={{
                position: "absolute", inset: 0,
                background: "conic-gradient(from 0deg at 19% 71%, transparent 61deg, rgba(255,252,195,0.28) 64deg, rgba(255,252,195,0.65) 66deg, rgba(255,252,195,0.28) 68deg, transparent 71deg)",
                filter: "blur(3px)",
                maskImage: "radial-gradient(ellipse 62% 62% at 19% 71%, black 0%, black 8%, transparent 72%)",
                WebkitMaskImage: "radial-gradient(ellipse 62% 62% at 19% 71%, black 0%, black 8%, transparent 72%)",
              }} />
              {/* Lens hotspot glow */}
              <div style={{
                position: "absolute",
                left: "19%", top: "71%",
                width: 64, height: 52,
                transform: "translate(-50%, -50%)",
                borderRadius: "50%",
                background: "radial-gradient(ellipse at center, rgba(255,255,220,0.92) 0%, rgba(255,248,160,0.60) 28%, rgba(255,230,90,0.25) 58%, transparent 82%)",
                filter: "blur(5px)",
                zIndex: 1,
              }} />
              {/* ── Dust motes floating in beam ── */}
              {DUST_MOTES.map((m, i) => (
                <div key={i} style={{
                  position: "absolute",
                  left: `${m.x}%`,
                  top: `${m.y}%`,
                  width: m.size,
                  height: m.size,
                  borderRadius: "50%",
                  background: "rgba(255,250,180,0.75)",
                  filter: "blur(0.4px)",
                  boxShadow: `0 0 ${m.size * 3}px rgba(255,244,150,0.55)`,
                  animation: `dustMote ${m.dur}s ${m.delay}s ease-in-out infinite`,
                }} />
              ))}
            </div>

            {/* ── Camera (bottom-left) ── */}
            <div ref={cameraGroupRef} style={{
              position: "absolute",
              bottom: "4%", left: "3%",
              transform: "translateX(-120%) translateY(80%) rotate(-6deg)",
              width: "min(260px, 28vw)",
              opacity: 0,
              filter: "drop-shadow(0 4px 28px rgba(200,150,30,0.28))",
              zIndex: 3,
            }}>
              <svg viewBox="0 0 300 380" style={{ width: "100%", height: "auto", overflow: "visible" }}
                aria-label="Vintage film camera on tripod">
                <rect x="40" y="55" width="180" height="130" rx="8" fill="#404040" stroke="#666" strokeWidth="2" />
                <line x1="40" y1="100" x2="220" y2="100" stroke="#4a4a4a" strokeWidth="1.5" />
                <line x1="40" y1="135" x2="220" y2="135" stroke="#4a4a4a" strokeWidth="1.5" />
                <rect x="55" y="108" width="82" height="20" rx="3" fill="#2a2a2a" stroke="#555" strokeWidth="1" />
                <text x="96" y="122" fontFamily="monospace" fontSize="7" fill="#888" textAnchor="middle">CINE-1600</text>
                <circle cx="48"  cy="63"  r="3" fill="#555" stroke="#777" strokeWidth="0.5" />
                <circle cx="212" cy="63"  r="3" fill="#555" stroke="#777" strokeWidth="0.5" />
                <circle cx="48"  cy="177" r="3" fill="#555" stroke="#777" strokeWidth="0.5" />
                <circle cx="212" cy="177" r="3" fill="#555" stroke="#777" strokeWidth="0.5" />
                {Array.from({ length: 6 }, (_, i) => (
                  <rect key={`ft${i}`} x={50 + i * 26} y="55" width="12" height="8" rx="1"
                    fill="#333" stroke="#555" strokeWidth="0.5" />
                ))}
                {Array.from({ length: 6 }, (_, i) => (
                  <rect key={`fb${i}`} x={50 + i * 26} y="177" width="12" height="8" rx="1"
                    fill="#333" stroke="#555" strokeWidth="0.5" />
                ))}
                <circle cx="72"  cy="75" r="22" fill="#3a3a3a" stroke="#777" strokeWidth="2" />
                <circle cx="72"  cy="75" r="16" fill="#2a2a2a" stroke="#666" strokeWidth="1.5" />
                <Spokes cx={72} cy={75} r={13} count={8} />
                <circle cx="72"  cy="75" r="5" fill="#aaa" stroke="#ccc" strokeWidth="0.5" />
                <circle cx="188" cy="75" r="22" fill="#3a3a3a" stroke="#777" strokeWidth="2" />
                <circle cx="188" cy="75" r="16" fill="#2a2a2a" stroke="#666" strokeWidth="1.5" />
                <Spokes cx={188} cy={75} r={13} count={8} />
                <circle cx="188" cy="75" r="5" fill="#aaa" stroke="#ccc" strokeWidth="0.5" />
                <rect x="95"  y="36" width="70" height="26" rx="4" fill="#333" stroke="#666" strokeWidth="1.5" />
                <rect x="103" y="41" width="54" height="16" rx="2" fill="#1a1a1a" stroke="#555" strokeWidth="1" />
                <rect x="107" y="44" width="46" height="10" rx="1" fill="#111" />
                <polygon points="220,88 268,72 268,168 220,152" fill="#2e2e2e" stroke="#666" strokeWidth="1.5" />
                <circle cx="270" cy="120" r="24" fill="#1a1a1a" stroke="#777" strokeWidth="2.5" />
                <circle cx="270" cy="120" r="19" fill="#222"   stroke="#666" strokeWidth="1.5" />
                <circle cx="270" cy="120" r="14" fill="#1a1a1a" stroke="#888" strokeWidth="1" />
                <circle cx="270" cy="120" r="9"  fill="#222"   stroke="#aaa" strokeWidth="1" />
                <circle cx="270" cy="120" r="4"  fill="#1a1a1a" stroke="#bbb" strokeWidth="0.5" />
                {[0, 45, 90, 135].map(a => (
                  <line key={a}
                    x1={270 + 6  * Math.cos((a * Math.PI) / 180)}
                    y1={120 + 6  * Math.sin((a * Math.PI) / 180)}
                    x2={270 + 19 * Math.cos((a * Math.PI) / 180)}
                    y2={120 + 19 * Math.sin((a * Math.PI) / 180)}
                    stroke="#555" strokeWidth="0.5" />
                ))}
                <circle cx="263" cy="112" r="4"   fill="rgba(255,255,255,0.15)" />
                <circle cx="260" cy="109" r="2"   fill="rgba(255,255,255,0.22)" />
                <line x1="220" y1="138" x2="246" y2="155" stroke="#666" strokeWidth="3" strokeLinecap="round" />
                <circle cx="250" cy="158" r="7" fill="#404040" stroke="#777" strokeWidth="1.5" />
                <circle cx="250" cy="158" r="3" fill="#666" />
                <rect x="108" y="185" width="44" height="16" rx="4" fill="#333" stroke="#555" strokeWidth="1.5" />
                <line x1="118" y1="198" x2="52"  y2="375" stroke="#555" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="130" y1="201" x2="130" y2="375" stroke="#555" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="142" y1="198" x2="208" y2="375" stroke="#555" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="74"  y1="302" x2="186" y2="302" stroke="#444" strokeWidth="2" strokeLinecap="round" />
                <line x1="74"  y1="302" x2="52"  y2="375" stroke="#444" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="186" y1="302" x2="208" y2="375" stroke="#444" strokeWidth="1.5" strokeLinecap="round" />
                <ellipse cx="52"  cy="377" rx="10" ry="4" fill="#333" />
                <ellipse cx="130" cy="377" rx="10" ry="4" fill="#333" />
                <ellipse cx="208" cy="377" rx="10" ry="4" fill="#333" />
              </svg>
            </div>

            {/* ── Projection screen ── */}
            <div ref={screenRef} style={{
              position: "absolute",
              right: "2%", top: "50%",
              transform: "translateY(-50%) perspective(1200px) rotateY(-4deg) scale(0.92)",
              width: "clamp(500px, 62vw, 900px)",
              aspectRatio: "16 / 9",
              opacity: 0,
              border: "3px solid rgba(200,180,100,0.22)",
              boxShadow: "0 0 80px rgba(255,215,60,0.16), 0 0 160px rgba(255,200,40,0.07), inset 0 0 80px rgba(0,0,0,0.72)",
              background: "linear-gradient(135deg, rgba(22,17,6,0.98) 0%, rgba(10,8,2,1) 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              zIndex: 4,
            }}>
              <div style={{ position: "absolute", inset: 8, border: "1px solid rgba(180,155,80,0.13)", pointerEvents: "none" }} />
              <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255,240,150,0.11) 0%, rgba(255,220,80,0.04) 50%, transparent 100%)",
              }} />
              <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.035) 2px,rgba(0,0,0,0.035) 5px)",
              }} />
              <div ref={screenTextRef} style={{
                clipPath: "inset(0 100% 0 0)",
                filter: "url(#ev-grain)",
                textAlign: "center",
                padding: "0 6%",
                position: "relative", zIndex: 1,
              }}>
                <div style={{
                  fontFamily: "'IBM Plex Serif', Georgia, serif",
                  fontSize: "clamp(2.4rem, 5.5vw, 4rem)",
                  fontWeight: 700,
                  color: "rgba(248,236,188,0.97)",
                  letterSpacing: "0.04em",
                  lineHeight: 1.1,
                  textShadow: "0 0 40px rgba(255,215,60,0.55), 0 2px 8px rgba(0,0,0,0.95)",
                }}>
                  AI Film Making
                </div>
                <div style={{
                  fontFamily: "monospace",
                  fontSize: "clamp(0.55rem, 1.2vw, 0.85rem)",
                  color: "rgba(200,170,80,0.62)",
                  letterSpacing: "0.3em",
                  marginTop: "0.7em",
                  textTransform: "uppercase",
                }}>
                  Hackathon &nbsp;·&nbsp; v2
                </div>
                <div style={{
                  fontFamily: "monospace",
                  fontSize: "clamp(0.4rem, 0.75vw, 0.6rem)",
                  color: "rgba(180,150,70,0.32)",
                  letterSpacing: "0.25em",
                  marginTop: "0.9em",
                  textTransform: "uppercase",
                }}>
                  2025 &nbsp;·&nbsp; Dublin, Ireland
                </div>
              </div>
              {(["tl", "tr", "bl", "br"] as const).map((c) => (
                <div key={c} style={{
                  position: "absolute", width: 20, height: 20,
                  borderColor: "rgba(230,215,160,0.38)", borderStyle: "solid", borderWidth: 0,
                  ...(c === "tl" ? { top: 8, left: 8,     borderTopWidth: 2,    borderLeftWidth: 2   }
                    : c === "tr" ? { top: 8, right: 8,    borderTopWidth: 2,    borderRightWidth: 2  }
                    : c === "bl" ? { bottom: 8, left: 8,  borderBottomWidth: 2, borderLeftWidth: 2   }
                    :              { bottom: 8, right: 8,  borderBottomWidth: 2, borderRightWidth: 2  }),
                }}>
                  <div style={{
                    position: "absolute", width: 5, height: 5, borderRadius: "50%",
                    border: "1px solid rgba(230,215,160,0.32)",
                    ...(c === "tl" ? { bottom: 1, right: 1 } : c === "tr" ? { bottom: 1, left: 1 }
                      : c === "bl" ? { top: 1, right: 1 }   :              { top: 1, left: 1 }),
                  }} />
                </div>
              ))}
            </div>
          </div>

          {/* Scroll hint */}
          <div style={{
            position: "absolute", bottom: "2rem", left: "50%",
            transform: "translateX(-50%)",
            color: "rgba(255,255,255,0.18)",
            fontSize: "1rem",
            pointerEvents: "none", zIndex: 5,
            animation: "fadeUpDown 2s ease-in-out infinite",
          }}>↓</div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          FEATURE PRESENTATION  — cinematic bridge
          ════════════════════════════════════════════════════════════════════════ */}
      <div style={{
        padding: "4rem 2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.75rem",
      }}>
        <div style={{ width: "min(520px,80vw)", height: 1, background: "rgba(200,170,80,0.18)" }} />
        <div style={{
          fontFamily: "monospace",
          fontSize: "0.65rem",
          letterSpacing: "0.5em",
          color: "rgba(200,170,80,0.38)",
          textTransform: "uppercase",
        }}>
          Feature Presentation
        </div>
        <div style={{ width: "min(520px,80vw)", height: 1, background: "rgba(200,170,80,0.18)" }} />
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          ACT I  — Event overview
          ════════════════════════════════════════════════════════════════════════ */}
      <ActLabel number="I" title="Opening Night" />

      <section style={{
        position: "relative",
        minHeight: "90vh",
        background:
          "radial-gradient(ellipse 70% 45% at 50% 0%, rgba(255,215,60,0.055) 0%, transparent 65%), " +
          "radial-gradient(ellipse 40% 30% at 50% 100%, rgba(255,180,30,0.025) 0%, transparent 100%), " +
          "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "5rem 2rem 6rem",
        textAlign: "center",
      }}>
        {/* Page-wide grain (very subtle) */}
        <svg style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          pointerEvents: "none", opacity: 0.025,
        }} aria-hidden="true">
          <filter id="section-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#section-grain)" />
        </svg>

        {/* Film countdown */}
        <SectionReveal>
          <div style={{
            fontFamily: "monospace",
            fontSize: "clamp(0.55rem, 0.9vw, 0.72rem)",
            color: "rgba(200,170,80,0.22)",
            letterSpacing: "0.55em",
            marginBottom: "1.25rem",
          }}>
            3 . . . 2 . . . 1
          </div>
          <div style={{
            fontSize: "1.1rem",
            color: "rgba(200,170,80,0.55)",
            letterSpacing: "0.35em",
            marginBottom: "2.5rem",
          }}>
            ★ ★ ★ ★ ★
          </div>
        </SectionReveal>

        <SectionReveal delay={0.12}>
          <h1 style={{
            fontFamily: "'IBM Plex Serif', Georgia, serif",
            fontSize: "clamp(2.4rem, 6vw, 4.4rem)",
            fontWeight: 700,
            color: "rgba(248,236,188,0.97)",
            letterSpacing: "0.015em",
            lineHeight: 1.08,
            margin: 0,
            textShadow: "0 0 80px rgba(255,215,60,0.22)",
          }}>
            AI Film Making<br />Hackathon v2
          </h1>
        </SectionReveal>

        <SectionReveal delay={0.24}>
          <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", gap: "0.8rem", justifyContent: "center" }}>
            <div style={{ width: 28, height: 1, background: "rgba(200,170,80,0.3)" }} />
            <div style={{
              fontFamily: "monospace",
              fontSize: "clamp(0.65rem, 1.1vw, 0.82rem)",
              color: "rgba(200,170,80,0.65)",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
            }}>
              Dublin, Ireland &nbsp;·&nbsp; 2025
            </div>
            <div style={{ width: 28, height: 1, background: "rgba(200,170,80,0.3)" }} />
          </div>
        </SectionReveal>

        <SectionReveal delay={0.36}>
          <p style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(1rem, 1.7vw, 1.2rem)",
            color: "rgba(255,255,255,0.4)",
            maxWidth: 500,
            lineHeight: 1.7,
            margin: "2.5rem auto 0",
          }}>
            The best engineers &amp; creatives from Ireland and Europe,
            making AI short films in one day.
          </p>
        </SectionReveal>

        <SectionReveal delay={0.48}>
          <div style={{ marginTop: "3rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <a href="/" style={{
              display: "inline-block",
              padding: "1rem 3rem",
              background: "#E85D35",
              color: "#fff",
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontWeight: 600,
              fontSize: "0.9rem",
              letterSpacing: "0.08em",
              textDecoration: "none",
              textTransform: "uppercase",
              borderRadius: 3,
              boxShadow: "0 0 36px rgba(232,93,53,0.28), 0 2px 12px rgba(0,0,0,0.6)",
              transition: "transform 0.18s, box-shadow 0.18s",
            }}
              onMouseEnter={e => {
                (e.target as HTMLElement).style.transform = "scale(1.04)";
                (e.target as HTMLElement).style.boxShadow = "0 0 50px rgba(232,93,53,0.42), 0 4px 20px rgba(0,0,0,0.6)";
              }}
              onMouseLeave={e => {
                (e.target as HTMLElement).style.transform = "scale(1)";
                (e.target as HTMLElement).style.boxShadow = "0 0 36px rgba(232,93,53,0.28), 0 2px 12px rgba(0,0,0,0.6)";
              }}
            >
              Apply to Join →
            </a>
            <div style={{
              fontFamily: "monospace",
              fontSize: "0.6rem",
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginTop: "0.5rem",
            }}>
              Organised by Give(a)Go &amp; Napkin
            </div>
          </div>
        </SectionReveal>
      </section>

      {/* ── Film Strip Divider ── */}
      <FilmStripBorder />
      <ActLabel number="II" title="The Programme" />

      {/* ════════════════════════════════════════════════════════════════════════
          SECTION B — Schedule
          ════════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "4rem 2rem 6rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <SectionReveal>
          <h2 style={{
            fontFamily: "'IBM Plex Serif', Georgia, serif",
            fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
            fontWeight: 700,
            color: "rgba(248,236,188,0.88)",
            textAlign: "center",
            marginBottom: "3.5rem",
            letterSpacing: "0.01em",
          }}>
            The Programme
          </h2>
        </SectionReveal>

        <div style={{
          display: "flex",
          gap: "2.5rem",
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: 980,
          width: "100%",
        }}>
          <SectionReveal delay={0}>
            <TicketCard
              day="Day 01"
              title="Filmmaking Day"
              description="Teams form at the start of the day and race to create compelling AI-powered short films — from concept and script to final cut — all within a single day."
            />
          </SectionReveal>
          <SectionReveal delay={0.2}>
            <TicketCard
              day="Day 02"
              title="Cinema Screening"
              description="A semi black-tie premiere event. Films screen on the big stage, the audience votes, awards are given. A night of cinema, celebration and community."
              badge="Now Showing"
            />
          </SectionReveal>
        </div>
      </section>

      {/* ── Film Strip Divider ── */}
      <FilmStripBorder />
      <ActLabel number="III" title="The Credits" />

      {/* ════════════════════════════════════════════════════════════════════════
          SECTION C — Sponsors
          ════════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "4rem 2rem 6rem", display: "flex", flexDirection: "column", alignItems: "center" }}>

        {/* Powered By */}
        <SectionReveal>
          <h2 style={{
            fontFamily: "'IBM Plex Serif', Georgia, serif",
            fontSize: "clamp(1.5rem, 3vw, 2.1rem)",
            fontWeight: 700,
            color: "rgba(248,236,188,0.82)",
            textAlign: "center",
            marginBottom: "2.5rem",
          }}>
            Powered By
          </h2>
        </SectionReveal>
        <SectionReveal delay={0.1}>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "1rem" }}>
            {["ElevenLabs", "Wan AI", "Fal"].map(n => <SponsorBox key={n} name={n} />)}
          </div>
        </SectionReveal>

        <FilmReelDivider />

        {/* Fuelled By */}
        <SectionReveal delay={0.15}>
          <h3 style={{
            fontFamily: "'IBM Plex Serif', Georgia, serif",
            fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
            fontWeight: 500,
            color: "rgba(248,236,188,0.65)",
            textAlign: "center",
            margin: "1rem 0 2rem",
          }}>
            Fuelled By
          </h3>
        </SectionReveal>
        <SectionReveal delay={0.2}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
            <SponsorBox name="Red Bull" />
          </div>
        </SectionReveal>

        <FilmReelDivider />

        {/* Organised By */}
        <SectionReveal delay={0.25}>
          <h3 style={{
            fontFamily: "'IBM Plex Serif', Georgia, serif",
            fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
            fontWeight: 500,
            color: "rgba(248,236,188,0.65)",
            textAlign: "center",
            margin: "1rem 0 2rem",
          }}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true" style={{ display: "inline-block", verticalAlign: "middle", marginRight: 7, opacity: 0.65 }}>
              <line x1="4" y1="3" x2="4" y2="18" stroke="rgba(200,170,80,0.7)" strokeWidth="1.5" />
              <line x1="16" y1="3" x2="16" y2="18" stroke="rgba(200,170,80,0.7)" strokeWidth="1.5" />
              <rect x="3" y="6" width="14" height="5" rx="1" fill="rgba(200,170,80,0.12)" stroke="rgba(200,170,80,0.45)" strokeWidth="0.8" />
              <line x1="4" y1="14" x2="16" y2="14" stroke="rgba(200,170,80,0.35)" strokeWidth="0.8" />
            </svg>
            Organised By
          </h3>
        </SectionReveal>
        <SectionReveal delay={0.3}>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "1rem" }}>
            {["Give(a)Go", "Napkin"].map(n => <SponsorBox key={n} name={n} />)}
          </div>
        </SectionReveal>

        <SectionReveal delay={0.38}>
          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <p style={{
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontStyle: "italic",
              fontSize: "0.82rem",
              color: "rgba(255,255,255,0.28)",
              marginBottom: "1.5rem",
              letterSpacing: "0.04em",
            }}>
              More sponsors to be announced
            </p>
            <a href="mailto:hello@giveago.io" style={{
              display: "inline-block",
              padding: "0.75rem 2.25rem",
              border: "1px solid rgba(200,170,80,0.35)",
              borderRadius: 3,
              color: "rgba(248,236,188,0.72)",
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: "0.82rem",
              letterSpacing: "0.06em",
              textDecoration: "none",
              transition: "background 0.2s, border-color 0.2s, color 0.2s",
            }}
              onMouseEnter={e => {
                const el = e.target as HTMLElement;
                el.style.background = "rgba(200,170,80,0.08)";
                el.style.borderColor = "rgba(200,170,80,0.55)";
                el.style.color = "rgba(248,236,188,0.95)";
              }}
              onMouseLeave={e => {
                const el = e.target as HTMLElement;
                el.style.background = "transparent";
                el.style.borderColor = "rgba(200,170,80,0.35)";
                el.style.color = "rgba(248,236,188,0.72)";
              }}
            >
              Become a Sponsor
            </a>
          </div>
        </SectionReveal>
      </section>

      {/* ── Film Strip Divider ── */}
      <FilmStripBorder compact />

      {/* ════════════════════════════════════════════════════════════════════════
          FOOTER
          ════════════════════════════════════════════════════════════════════════ */}
      <footer style={{
        padding: "5rem 2rem 4rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "1.25rem",
        background: "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(255,215,60,0.035) 0%, transparent 70%), #000",
      }}>
        <SectionReveal>
          <div style={{
            fontFamily: "monospace",
            fontSize: "0.58rem",
            color: "rgba(200,170,80,0.3)",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            marginBottom: "0.75rem",
          }}>
            — Fin —
          </div>
          <a href="/" style={{
            display: "inline-block",
            padding: "1rem 3rem",
            background: "#E85D35",
            color: "#fff",
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontWeight: 600,
            fontSize: "0.9rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            textDecoration: "none",
            borderRadius: 3,
            boxShadow: "0 0 36px rgba(232,93,53,0.25)",
            transition: "transform 0.18s, box-shadow 0.18s",
          }}
            onMouseEnter={e => {
              (e.target as HTMLElement).style.transform = "scale(1.04)";
              (e.target as HTMLElement).style.boxShadow = "0 0 50px rgba(232,93,53,0.42)";
            }}
            onMouseLeave={e => {
              (e.target as HTMLElement).style.transform = "scale(1)";
              (e.target as HTMLElement).style.boxShadow = "0 0 36px rgba(232,93,53,0.25)";
            }}
          >
            Apply to Join →
          </a>
        </SectionReveal>

        <SectionReveal delay={0.15}>
          <div style={{
            fontFamily: "monospace",
            fontSize: "0.6rem",
            color: "rgba(255,255,255,0.22)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginTop: "0.5rem",
          }}>
            Organised by Give(a)Go &amp; Napkin
          </div>
        </SectionReveal>

        <div style={{ width: "100%", marginTop: "2.5rem" }}>
          <FilmStripBorder compact />
        </div>
      </footer>

      <style>{`
        @keyframes fadeUpDown {
          0%, 100% { opacity: 0.35; transform: translateY(0); }
          50%       { opacity: 0.9;  transform: translateY(7px); }
        }
        @keyframes filmStripDrift {
          0%, 100% { transform: translateX(0); }
          50%       { transform: translateX(-8px); }
        }
        @keyframes nowShowingPulse {
          0%, 100% { text-shadow: 0 0 8px rgba(248,236,188,0.25); box-shadow: inset 0 0 0 0 rgba(200,170,80,0); }
          50%       { text-shadow: 0 0 18px rgba(248,236,188,0.55), 0 0 36px rgba(255,200,60,0.18); }
        }
        @keyframes dustMote {
          0%   { transform: translateY(0px) translateX(0px) scale(1);    opacity: 0;   }
          12%  { opacity: 0.85; }
          50%  { transform: translateY(-7px) translateX(2px) scale(0.82); opacity: 0.9; }
          88%  { opacity: 0.6; }
          100% { transform: translateY(-14px) translateX(-1px) scale(0.6); opacity: 0; }
        }
        @media (max-width: 640px) {
          /* Hide film strips on mobile to avoid eating content space */
          body > div > div:first-child,
          body > div > div:nth-child(2) { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default EventPage;
