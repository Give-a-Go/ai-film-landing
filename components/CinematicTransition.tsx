import React, { useRef, useEffect } from "react";

// ─── Easing ───────────────────────────────────────────────────────────────────
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInCubic = (t: number) => t * t * t;
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}
function phase(p: number, s: number, e: number) {
  return clamp((p - s) / (e - s), 0, 1);
}

// ─── Pre-defined dust motes along beam path ───────────────────────────────────
// Lens ≈ (20%, 44%), screen center ≈ (67%, 50%) — nearly horizontal, slight south
const DUST_MOTES = [
  { x: 25, y: 44, size: 1.4, dur: 4.5, delay: 0 },
  { x: 32, y: 45, size: 1.0, dur: 6.2, delay: 1.5 },
  { x: 28, y: 44.5, size: 1.7, dur: 3.8, delay: 0.8 },
  { x: 40, y: 46, size: 1.1, dur: 5.1, delay: 2.2 },
  { x: 48, y: 47, size: 1.5, dur: 4.7, delay: 0.3 },
  { x: 44, y: 46.5, size: 0.9, dur: 7.0, delay: 3.1 },
  { x: 58, y: 48, size: 1.3, dur: 5.5, delay: 1.9 },
  { x: 35, y: 45.5, size: 0.8, dur: 4.2, delay: 4.0 },
  { x: 52, y: 47.5, size: 1.4, dur: 6.8, delay: 0.6 },
  { x: 37, y: 46, size: 1.1, dur: 5.3, delay: 2.7 },
  { x: 55, y: 48, size: 0.8, dur: 4.0, delay: 1.2 },
  { x: 42, y: 46.5, size: 1.5, dur: 6.5, delay: 3.5 },
  { x: 30, y: 45, size: 1.2, dur: 5.0, delay: 0.9 },
  { x: 63, y: 49, size: 0.7, dur: 4.8, delay: 2.4 },
  { x: 50, y: 47.5, size: 1.3, dur: 5.8, delay: 4.2 },
] as const;

// ─── CinematicTransition ──────────────────────────────────────────────────────
// Scroll range: 3.5vh → 6.0vh (plays within hero's sticky viewport)
// Sequence: countdown 3-2-1 → clapboard → flash → camera → beam → screen
const CinematicTransition: React.FC = () => {
  const SHOW_LEADER_COUNTDOWN = false;
  const sectionRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  // Countdown
  const countdownRef = useRef<HTMLDivElement>(null);
  const arcRef = useRef<SVGCircleElement>(null);
  const countNumRef = useRef<SVGTextElement>(null);
  // Clapboard
  const clapboardRef = useRef<SVGSVGElement>(null);
  const clapArmRef = useRef<SVGGElement>(null);
  // Flash
  const flashRef = useRef<HTMLDivElement>(null);
  // Camera
  const cameraGroupRef = useRef<HTMLDivElement>(null);
  // Beam
  const beamRef = useRef<HTMLDivElement>(null);
  // Screen
  const screenRef = useRef<HTMLDivElement>(null);
  const screenTextRef = useRef<HTMLDivElement>(null);
  const grainRef = useRef<SVGFETurbulenceElement>(null);
  const frameCount = useRef(0);

  // Arc constants (viewBox 0 0 100 100, r=38)
  const ARC_R = 38;
  const ARC_CIRC = 2 * Math.PI * ARC_R;

  useEffect(() => {
    let raf: number;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const vh = window.innerHeight;
      const sectionRect = sectionRef.current?.getBoundingClientRect();
      const p = sectionRect
        ? clamp((vh - sectionRect.top) / sectionRect.height, 0, 1)
        : 0;
      const timelineP = p;

      if (!rootRef.current) return;
      rootRef.current.style.opacity = p > 0 && p < 1 ? "1" : "0";
      if (p <= 0 || p >= 1) return;

      // ─────────────────────────────────────────────────────────────────
      // COUNTDOWN  p 0.00 → 0.30
      // Each of 3 numbers occupies p 0.02-0.10 / 0.10-0.18 / 0.18-0.26
      // ─────────────────────────────────────────────────────────────────
      if (countdownRef.current) {
        const fadeIn = easeOutCubic(phase(p, 0.0, 0.04));
        const fadeOut = easeInCubic(phase(p, 0.26, 0.33));
        const countdownOpacityRaw = fadeIn * (1 - fadeOut);
        const countdownOpacity = SHOW_LEADER_COUNTDOWN ? countdownOpacityRaw : 0;
        countdownRef.current.style.opacity = String(countdownOpacity);
      }

      if (arcRef.current && countNumRef.current && SHOW_LEADER_COUNTDOWN) {
        // Three equal sub-phases within p 0.02 – 0.26
        const cP = phase(p, 0.02, 0.26); // 0→1 over whole countdown
        const idx = Math.min(2, Math.floor(cP * 3)); // 0,1,2
        const num = [3, 2, 1][idx];
        const subP = easeInOutCubic((cP * 3) % 1); // 0→1 within current number

        countNumRef.current.textContent = String(num);
        arcRef.current.setAttribute(
          "stroke-dashoffset",
          String(ARC_CIRC * (1 - subP)),
        );
      }

      // ─────────────────────────────────────────────────────────────────
      // CLAPBOARD  p 0.30 → 0.52
      // ─────────────────────────────────────────────────────────────────
      if (clapboardRef.current) {
        const dropIn = easeOutCubic(phase(timelineP, 0.3, 0.44));
        const exitOut = easeInCubic(phase(timelineP, 0.46, 0.54));
        const y = -115 + dropIn * 115 + exitOut * 135;
        clapboardRef.current.style.transform = `translateX(-50%) translateY(${y}%)`;
        clapboardRef.current.style.opacity = timelineP > 0.54 ? "0" : "1";
      }
      if (clapArmRef.current) {
        const snapT = easeInOutCubic(phase(timelineP, 0.4, 0.44));
        clapArmRef.current.style.transform = `rotate(${-28 * (1 - snapT)}deg)`;
      }

      // ─────────────────────────────────────────────────────────────────
      // FLASH  p 0.43 → 0.50
      // ─────────────────────────────────────────────────────────────────
      if (flashRef.current) {
        const fp = phase(timelineP, 0.43, 0.5);
        const spike = fp < 0.4 ? fp / 0.4 : 1 - (fp - 0.4) / 0.6;
        flashRef.current.style.opacity = String(spike * 0.9);
      }

      // ─────────────────────────────────────────────────────────────────
      // CAMERA  p 0.48 → 0.72
      // ─────────────────────────────────────────────────────────────────
      if (cameraGroupRef.current) {
        const camIn = easeOutCubic(phase(timelineP, 0.48, 0.72));
        const tx = (1 - camIn) * -130;
        cameraGroupRef.current.style.opacity = String(
          easeOutCubic(phase(timelineP, 0.48, 0.6)),
        );
        cameraGroupRef.current.style.transform = `translateX(${tx}%) translateY(-50%) rotate(-6deg)`;
      }

      // ─────────────────────────────────────────────────────────────────
      // BEAM  p 0.58 → 0.76
      // ─────────────────────────────────────────────────────────────────
      if (beamRef.current) {
        beamRef.current.style.opacity = String(
          easeOutCubic(phase(timelineP, 0.58, 0.76)),
        );
      }

      // ─────────────────────────────────────────────────────────────────
      // SCREEN  p 0.62 → 0.80
      // ─────────────────────────────────────────────────────────────────
      if (screenRef.current) {
        const sp = easeOutCubic(phase(timelineP, 0.62, 0.8));
        screenRef.current.style.opacity = String(sp);
        screenRef.current.style.transform = `translateY(-50%) perspective(1200px) rotateY(-4deg) scale(${0.92 + sp * 0.08})`;
      }

      // ─────────────────────────────────────────────────────────────────
      // TEXT WIPE  p 0.76 → 0.96
      // ─────────────────────────────────────────────────────────────────
      if (screenTextRef.current) {
        const wp = easeOutCubic(phase(timelineP, 0.76, 0.96));
        screenTextRef.current.style.clipPath = `inset(0 ${(1 - wp) * 100}% 0 0)`;
      }

      // ─────────────────────────────────────────────────────────────────
      // FILM GRAIN jitter
      // ─────────────────────────────────────────────────────────────────
      frameCount.current++;
      if (grainRef.current && frameCount.current % 4 === 0 && timelineP > 0.76) {
        const bf = 0.65 + (Math.random() - 0.5) * 0.1;
        grainRef.current.setAttribute("baseFrequency", `${bf} ${bf}`);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={sectionRef} className="relative h-[200vh] bg-black">
      <div
        ref={rootRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "100vh",
          overflow: "hidden",
          opacity: 0,
          zIndex: 20,
          pointerEvents: "none",
        }}
      >
      {/* SVG defs — grain filter */}
      <svg
        style={{ position: "absolute", width: 0, height: 0 }}
        aria-hidden="true"
      >
        <defs>
          <filter id="ct-grain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              ref={grainRef}
              type="fractalNoise"
              baseFrequency="0.65 0.65"
              numOctaves="3"
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix type="saturate" values="0" in="noise" result="gn" />
            <feBlend in="SourceGraphic" in2="gn" mode="overlay" result="b" />
            <feComposite in="b" in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      {/* White flash */}
      <div
        ref={flashRef}
        className="absolute inset-0 bg-white"
        style={{ opacity: 0, zIndex: 30, pointerEvents: "none" }}
      />

      {/* ════════════════════════════════════════════════════════════════
          FILM COUNTDOWN  3 · 2 · 1
          Classic circular SMPTE-style leader frame
          ════════════════════════════════════════════════════════════════ */}
      <div
        ref={countdownRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0,
          zIndex: 26,
        }}
      >
        {/* Outer technical frame lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(rgba(248,236,188,0.015) 1px, transparent 1px) 0 0 / 100% 25%," +
              "linear-gradient(90deg, rgba(248,236,188,0.015) 1px, transparent 1px) 0 0 / 25% 100%",
          }}
        />

        {/* Corner reference dots */}
        {(
          [
            [8, 8],
            [92, 8],
            [8, 92],
            [92, 92],
          ] as const
        ).map(([x, y], i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              transform: "translate(-50%,-50%)",
              width: 6,
              height: 6,
              borderRadius: "50%",
              border: "1px solid rgba(248,236,188,0.15)",
            }}
          />
        ))}

        {/* Main countdown circle */}
        <svg
          viewBox="0 0 100 100"
          style={{ width: "min(340px,44vw)", height: "min(340px,44vw)" }}
          aria-hidden="true"
        >
          {/* Outer decorative ring */}
          <circle
            cx="50"
            cy="50"
            r="47"
            fill="none"
            stroke="rgba(248,236,188,0.06)"
            strokeWidth="0.5"
          />

          {/* Main ring */}
          <circle
            cx="50"
            cy="50"
            r={ARC_R}
            fill="none"
            stroke="rgba(248,236,188,0.12)"
            strokeWidth="0.7"
          />

          {/* Inner circle */}
          <circle
            cx="50"
            cy="50"
            r="26"
            fill="none"
            stroke="rgba(248,236,188,0.08)"
            strokeWidth="0.5"
          />

          {/* Center dot */}
          <circle cx="50" cy="50" r="2" fill="rgba(248,236,188,0.35)" />

          {/* Tick marks — 12 marks at every 30° */}
          {Array.from({ length: 12 }, (_, i) => {
            const a = ((i * 30 - 90) * Math.PI) / 180;
            const major = i % 3 === 0;
            const r1 = major ? 40 : 42;
            return (
              <line
                key={i}
                x1={50 + r1 * Math.cos(a)}
                y1={50 + r1 * Math.sin(a)}
                x2={50 + 46 * Math.cos(a)}
                y2={50 + 46 * Math.sin(a)}
                stroke="rgba(248,236,188,0.22)"
                strokeWidth={major ? 0.9 : 0.45}
              />
            );
          })}

          {/* Crosshairs */}
          <line
            x1="2"
            y1="50"
            x2="98"
            y2="50"
            stroke="rgba(248,236,188,0.10)"
            strokeWidth="0.4"
          />
          <line
            x1="50"
            y1="2"
            x2="50"
            y2="98"
            stroke="rgba(248,236,188,0.10)"
            strokeWidth="0.4"
          />

          {/* Cardinal dots */}
          {[0, 90, 180, 270].map((a) => {
            const r = ((a - 90) * Math.PI) / 180;
            return (
              <circle
                key={a}
                cx={50 + 42 * Math.cos(r)}
                cy={50 + 42 * Math.sin(r)}
                r="1.5"
                fill="rgba(248,236,188,0.2)"
              />
            );
          })}

          {/* Sweeping arc — updated each frame via stroke-dashoffset */}
          <circle
            ref={arcRef}
            cx="50"
            cy="50"
            r={ARC_R}
            fill="none"
            stroke="rgba(248,236,188,0.80)"
            strokeWidth="1.5"
            strokeDasharray={`${ARC_CIRC} ${ARC_CIRC}`}
            strokeDashoffset={ARC_CIRC}
            strokeLinecap="butt"
            transform="rotate(-90 50 50)"
          />

          {/* The number */}
          <text
            ref={countNumRef}
            x="50"
            y="50"
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="monospace"
            fontSize="34"
            fontWeight="bold"
            fill="rgba(248,236,188,0.94)"
            letterSpacing="-1"
          >
            3
          </text>

          {/* Technical corner labels */}
          <text
            x="3"
            y="7"
            fontFamily="monospace"
            fontSize="3.8"
            fill="rgba(248,236,188,0.18)"
            letterSpacing="0.2"
          >
            SYNC
          </text>
          <text
            x="71"
            y="7"
            fontFamily="monospace"
            fontSize="3.8"
            fill="rgba(248,236,188,0.18)"
            letterSpacing="0.2"
          >
            FRAME
          </text>
          <text
            x="3"
            y="97"
            fontFamily="monospace"
            fontSize="3.8"
            fill="rgba(248,236,188,0.18)"
            letterSpacing="0.2"
          >
            FOCUS
          </text>
          <text
            x="68"
            y="97"
            fontFamily="monospace"
            fontSize="3.8"
            fill="rgba(248,236,188,0.18)"
            letterSpacing="0.2"
          >
            24fps
          </text>

          {/* Frame number (decorative) */}
          <text
            x="50"
            y="76"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="4"
            fill="rgba(248,236,188,0.18)"
            letterSpacing="0.5"
          >
            AI FILM HACKATHON v2
          </text>
        </svg>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          CLAPBOARD
          ════════════════════════════════════════════════════════════════ */}
      <svg
        ref={clapboardRef}
        viewBox="0 0 220 165"
        style={{
          position: "absolute",
          top: "24%",
          left: "50%",
          transform: "translateX(-50%) translateY(-115%)",
          width: "min(360px, 56vw)",
          zIndex: 25,
          filter: "drop-shadow(0 6px 28px rgba(0,0,0,0.95))",
          transformOrigin: "top center",
        }}
        aria-hidden="true"
      >
        <rect x="0" y="30" width="220" height="135" rx="4" fill="#2a2a2a" />
        <rect x="2" y="82" width="216" height="81" rx="3" fill="#e8dfc0" />
        <rect
          x="0"
          y="30"
          width="220"
          height="135"
          rx="4"
          fill="none"
          stroke="#555"
          strokeWidth="1.5"
        />
        {Array.from({ length: 10 }, (_, i) => (
          <rect
            key={i}
            x={i * 22 - 5}
            y="30"
            width="12"
            height="52"
            fill={i % 2 === 0 ? "#111" : "#eee"}
            transform="skewX(-15)"
          />
        ))}
        {/* Ruled lines */}
        {[99, 113, 127, 141, 155].map((y) => (
          <line
            key={y}
            x1="8"
            y1={y}
            x2="212"
            y2={y}
            stroke="rgba(0,0,0,0.1)"
            strokeWidth="0.8"
          />
        ))}
        <text
          x="10"
          y="100"
          fontFamily="monospace"
          fontSize="9"
          fill="#1a1a1a"
          fontWeight="bold"
          letterSpacing="0.5"
        >
          SCENE 01 / TAKE 01
        </text>
        <text
          x="10"
          y="114"
          fontFamily="monospace"
          fontSize="7.5"
          fill="#3a3a3a"
        >
          DIRECTOR: AI SYSTEMS
        </text>
        <text
          x="10"
          y="127"
          fontFamily="monospace"
          fontSize="7.5"
          fill="#3a3a3a"
        >
          PROD: Give(a)Go
        </text>
        <text
          x="10"
          y="140"
          fontFamily="monospace"
          fontSize="7.5"
          fill="#3a3a3a"
        >
          TITLE: AI FILM HACKATHON v2
        </text>
        <text x="10" y="155" fontFamily="monospace" fontSize="7" fill="#888">
          DATE: 2025 · DUBLIN, IRELAND
        </text>
        <circle
          cx="8"
          cy="30"
          r="5.5"
          fill="#666"
          stroke="#888"
          strokeWidth="1"
        />
        <circle
          cx="212"
          cy="30"
          r="5.5"
          fill="#666"
          stroke="#888"
          strokeWidth="1"
        />
        {/* Arm */}
        <g
          ref={clapArmRef}
          style={{ transformOrigin: "4px 30px", transform: "rotate(-28deg)" }}
        >
          <rect x="0" y="4" width="220" height="28" rx="3" fill="#2a2a2a" />
          {Array.from({ length: 10 }, (_, i) => (
            <rect
              key={i}
              x={i * 22 - 5}
              y="4"
              width="12"
              height="28"
              fill={i % 2 === 0 ? "#eee" : "#111"}
              transform="skewX(-15)"
            />
          ))}
          <rect
            x="0"
            y="4"
            width="220"
            height="28"
            rx="3"
            fill="none"
            stroke="#666"
            strokeWidth="1.5"
          />
          <circle
            cx="8"
            cy="30"
            r="5.5"
            fill="#555"
            stroke="#888"
            strokeWidth="1"
          />
          <circle
            cx="212"
            cy="30"
            r="5.5"
            fill="#555"
            stroke="#888"
            strokeWidth="1"
          />
        </g>
      </svg>

      {/* ════════════════════════════════════════════════════════════════
          PROJECTOR BEAM
          Multi-layer conic+radial — lens at ~(20%, 44%), beam ≈ 97° from north
          ════════════════════════════════════════════════════════════════ */}
      <div
        ref={beamRef}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0,
          zIndex: 2,
        }}
      >
        {/* Layer 1: Atmospheric outer haze */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "conic-gradient(from 0deg at 20% 44%, transparent 68deg, rgba(255,215,70,0.05) 82deg, rgba(255,210,60,0.10) 97deg, rgba(255,215,70,0.05) 112deg, transparent 126deg)",
            filter: "blur(34px)",
            maskImage:
              "radial-gradient(ellipse 95% 60% at 20% 44%, black 0%, black 25%, transparent 88%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 95% 60% at 20% 44%, black 0%, black 25%, transparent 88%)",
          }}
        />
        {/* Layer 2: Main beam body */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "conic-gradient(from 0deg at 20% 44%, transparent 80deg, rgba(255,232,100,0.12) 88deg, rgba(255,228,90,0.28) 97deg, rgba(255,232,100,0.12) 106deg, transparent 114deg)",
            filter: "blur(15px)",
            maskImage:
              "radial-gradient(ellipse 90% 55% at 20% 44%, black 0%, black 18%, transparent 84%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 90% 55% at 20% 44%, black 0%, black 18%, transparent 84%)",
          }}
        />
        {/* Layer 3: Inner bright beam */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "conic-gradient(from 0deg at 20% 44%, transparent 86deg, rgba(255,242,128,0.22) 91deg, rgba(255,240,118,0.50) 97deg, rgba(255,242,128,0.22) 103deg, transparent 108deg)",
            filter: "blur(7px)",
            maskImage:
              "radial-gradient(ellipse 80% 48% at 20% 44%, black 0%, black 10%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 48% at 20% 44%, black 0%, black 10%, transparent 80%)",
          }}
        />
        {/* Layer 4: Bright core */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "conic-gradient(from 0deg at 20% 44%, transparent 92deg, rgba(255,252,195,0.28) 95deg, rgba(255,252,195,0.68) 97deg, rgba(255,252,195,0.28) 99deg, transparent 102deg)",
            filter: "blur(2.5px)",
            maskImage:
              "radial-gradient(ellipse 65% 38% at 20% 44%, black 0%, black 8%, transparent 72%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 65% 38% at 20% 44%, black 0%, black 8%, transparent 72%)",
          }}
        />
        {/* Lens hot-spot glow */}
        <div
          style={{
            position: "absolute",
            left: "20%",
            top: "44%",
            width: 58,
            height: 46,
            transform: "translate(-50%,-50%)",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(255,255,218,0.92) 0%, rgba(255,248,160,0.58) 28%, rgba(255,228,90,0.22) 58%, transparent 82%)",
            filter: "blur(5px)",
            zIndex: 1,
          }}
        />
        {/* Dust motes */}
        {DUST_MOTES.map((m, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${m.x}%`,
              top: `${m.y}%`,
              width: m.size,
              height: m.size,
              borderRadius: "50%",
              background: "rgba(255,250,180,0.75)",
              filter: "blur(0.4px)",
              boxShadow: `0 0 ${m.size * 3}px rgba(255,244,150,0.55)`,
              animation: `ctDustMote ${m.dur}s ${m.delay}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════════════
          CAMERA on tripod — slides in from left, top-center aligned
          ════════════════════════════════════════════════════════════════ */}
      <div
        ref={cameraGroupRef}
        style={{
          position: "absolute",
          left: "2%",
          top: "50%",
          transform: "translateX(-130%) translateY(-50%) rotate(-6deg)",
          width: "min(300px, 34vw)",
          opacity: 0,
          zIndex: 22,
          filter: "drop-shadow(0 4px 22px rgba(200,150,30,0.22))",
        }}
      >
        <svg
          viewBox="0 0 300 380"
          style={{ width: "100%", height: "auto", overflow: "visible" }}
          aria-label="Vintage film camera on tripod"
        >
          {/* Body */}
          <rect
            x="40"
            y="55"
            width="180"
            height="130"
            rx="8"
            fill="#383838"
            stroke="#666"
            strokeWidth="2"
          />
          <line
            x1="40"
            y1="100"
            x2="220"
            y2="100"
            stroke="#4a4a4a"
            strokeWidth="1.5"
          />
          <line
            x1="40"
            y1="135"
            x2="220"
            y2="135"
            stroke="#4a4a4a"
            strokeWidth="1.5"
          />
          {/* Nameplate */}
          <rect
            x="52"
            y="106"
            width="80"
            height="18"
            rx="2"
            fill="#2a2a2a"
            stroke="#555"
            strokeWidth="0.8"
          />
          <text
            x="92"
            y="119"
            fontFamily="monospace"
            fontSize="6.5"
            fill="#777"
            textAnchor="middle"
          >
            CINE-1600
          </text>
          {/* Left reel */}
          <circle
            cx="72"
            cy="75"
            r="22"
            fill="#3a3a3a"
            stroke="#777"
            strokeWidth="2"
          />
          <circle
            cx="72"
            cy="75"
            r="15"
            fill="#2a2a2a"
            stroke="#666"
            strokeWidth="1.5"
          />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <line
              key={a}
              x1="72"
              y1="75"
              x2={72 + 12 * Math.cos((a * Math.PI) / 180)}
              y2={75 + 12 * Math.sin((a * Math.PI) / 180)}
              stroke="#777"
              strokeWidth="1.5"
            />
          ))}
          <circle cx="72" cy="75" r="4" fill="#aaa" />
          {/* Right reel */}
          <circle
            cx="188"
            cy="75"
            r="22"
            fill="#3a3a3a"
            stroke="#777"
            strokeWidth="2"
          />
          <circle
            cx="188"
            cy="75"
            r="15"
            fill="#2a2a2a"
            stroke="#666"
            strokeWidth="1.5"
          />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <line
              key={a}
              x1="188"
              y1="75"
              x2={188 + 12 * Math.cos((a * Math.PI) / 180)}
              y2={75 + 12 * Math.sin((a * Math.PI) / 180)}
              stroke="#777"
              strokeWidth="1.5"
            />
          ))}
          <circle cx="188" cy="75" r="4" fill="#aaa" />
          {/* Viewfinder */}
          <rect
            x="100"
            y="36"
            width="60"
            height="25"
            rx="4"
            fill="#333"
            stroke="#666"
            strokeWidth="1.5"
          />
          <rect
            x="108"
            y="41"
            width="44"
            height="15"
            rx="2"
            fill="#222"
            stroke="#555"
            strokeWidth="1"
          />
          {/* Film perforations */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <React.Fragment key={i}>
              <rect
                x={50 + i * 26}
                y="55"
                width="11"
                height="7"
                rx="1"
                fill="#2e2e2e"
                stroke="#555"
                strokeWidth="0.5"
              />
              <rect
                x={50 + i * 26}
                y="178"
                width="11"
                height="7"
                rx="1"
                fill="#2e2e2e"
                stroke="#555"
                strokeWidth="0.5"
              />
            </React.Fragment>
          ))}
          {/* Lens cone */}
          <polygon
            points="220,88 268,74 268,168 220,152"
            fill="#2e2e2e"
            stroke="#666"
            strokeWidth="1.5"
          />
          {/* Lens rings */}
          <circle
            cx="270"
            cy="121"
            r="24"
            fill="#1a1a1a"
            stroke="#777"
            strokeWidth="2.5"
          />
          <circle
            cx="270"
            cy="121"
            r="18"
            fill="#222"
            stroke="#666"
            strokeWidth="1.5"
          />
          <circle
            cx="270"
            cy="121"
            r="12"
            fill="#1a1a1a"
            stroke="#888"
            strokeWidth="1"
          />
          <circle
            cx="270"
            cy="121"
            r="7"
            fill="#222"
            stroke="#aaa"
            strokeWidth="1"
          />
          <circle
            cx="270"
            cy="121"
            r="3"
            fill="#1a1a1a"
            stroke="#bbb"
            strokeWidth="0.5"
          />
          {/* Lens highlight */}
          <circle cx="262" cy="112" r="4" fill="rgba(255,255,255,0.18)" />
          <circle cx="259" cy="109" r="2" fill="rgba(255,255,255,0.24)" />
          {/* Crank */}
          <line
            x1="220"
            y1="138"
            x2="246"
            y2="155"
            stroke="#666"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle
            cx="250"
            cy="158"
            r="7"
            fill="#404040"
            stroke="#777"
            strokeWidth="1.5"
          />
          <circle cx="250" cy="158" r="3" fill="#666" />
          {/* Corner rivets */}
          <circle
            cx="48"
            cy="63"
            r="3"
            fill="#555"
            stroke="#777"
            strokeWidth="0.5"
          />
          <circle
            cx="212"
            cy="63"
            r="3"
            fill="#555"
            stroke="#777"
            strokeWidth="0.5"
          />
          <circle
            cx="48"
            cy="177"
            r="3"
            fill="#555"
            stroke="#777"
            strokeWidth="0.5"
          />
          <circle
            cx="212"
            cy="177"
            r="3"
            fill="#555"
            stroke="#777"
            strokeWidth="0.5"
          />
          {/* Tripod head */}
          <rect
            x="112"
            y="185"
            width="36"
            height="14"
            rx="3"
            fill="#333"
            stroke="#555"
            strokeWidth="1.5"
          />
          {/* Legs */}
          <line
            x1="120"
            y1="196"
            x2="58"
            y2="370"
            stroke="#555"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="130"
            y1="199"
            x2="130"
            y2="370"
            stroke="#555"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="140"
            y1="196"
            x2="202"
            y2="370"
            stroke="#555"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="76"
            y1="300"
            x2="184"
            y2="300"
            stroke="#444"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <ellipse cx="58" cy="372" rx="9" ry="3.5" fill="#333" />
          <ellipse cx="130" cy="372" rx="9" ry="3.5" fill="#333" />
          <ellipse cx="202" cy="372" rx="9" ry="3.5" fill="#333" />
        </svg>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          PROJECTION SCREEN
          ════════════════════════════════════════════════════════════════ */}
      <div
        ref={screenRef}
        style={{
          position: "absolute",
          right: "3%",
          top: "50%",
          transform:
            "translateY(-50%) perspective(1200px) rotateY(-4deg) scale(0.92)",
          width: "min(480px, 52vw)",
          aspectRatio: "16 / 9",
          opacity: 0,
          zIndex: 21,
          border: "2px solid rgba(200,180,100,0.22)",
          boxShadow:
            "0 0 60px rgba(255,215,60,0.16), " +
            "0 0 120px rgba(255,200,40,0.07), " +
            "inset 0 0 60px rgba(0,0,0,0.70)",
          background:
            "linear-gradient(135deg, rgba(22,17,6,0.98) 0%, rgba(10,8,2,1) 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Inner bezel */}
        <div
          style={{
            position: "absolute",
            inset: 7,
            border: "1px solid rgba(180,155,80,0.12)",
            pointerEvents: "none",
          }}
        />
        {/* Projected hotspot */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse 65% 55% at 50% 50%, " +
              "rgba(255,240,150,0.11) 0%, rgba(255,220,80,0.04) 50%, transparent 100%)",
          }}
        />
        {/* Scanlines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "repeating-linear-gradient(0deg,transparent,transparent 2px," +
              "rgba(0,0,0,0.04) 2px,rgba(0,0,0,0.04) 5px)",
          }}
        />
        {/* Text wipe */}
        <div
          ref={screenTextRef}
          style={{
            clipPath: "inset(0 100% 0 0)",
            filter: "url(#ct-grain)",
            textAlign: "center",
            padding: "0 6%",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontFamily: "'IBM Plex Serif', Georgia, serif",
              fontSize: "clamp(1.6rem, 3.8vw, 2.8rem)",
              fontWeight: 700,
              color: "rgba(248,236,188,0.97)",
              letterSpacing: "0.04em",
              lineHeight: 1.1,
              textShadow:
                "0 0 35px rgba(255,215,60,0.58), 0 2px 8px rgba(0,0,0,0.95)",
            }}
          >
            AI Film Making
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: "clamp(0.5rem, 1.1vw, 0.78rem)",
              color: "rgba(200,170,80,0.62)",
              letterSpacing: "0.3em",
              marginTop: "0.7em",
              textTransform: "uppercase",
            }}
          >
            Hackathon &nbsp;·&nbsp; v2
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: "clamp(0.38rem, 0.72vw, 0.58rem)",
              color: "rgba(180,150,70,0.32)",
              letterSpacing: "0.25em",
              marginTop: "0.8em",
              textTransform: "uppercase",
            }}
          >
            2025 &nbsp;·&nbsp; Dublin, Ireland
          </div>
        </div>
        {/* Corner registration marks */}
        {(["tl", "tr", "bl", "br"] as const).map((c) => (
          <div
            key={c}
            style={{
              position: "absolute",
              width: 16,
              height: 16,
              borderColor: "rgba(230,215,160,0.35)",
              borderStyle: "solid",
              borderWidth: 0,
              ...(c === "tl"
                ? { top: 6, left: 6, borderTopWidth: 2, borderLeftWidth: 2 }
                : c === "tr"
                  ? { top: 6, right: 6, borderTopWidth: 2, borderRightWidth: 2 }
                  : c === "bl"
                    ? {
                        bottom: 6,
                        left: 6,
                        borderBottomWidth: 2,
                        borderLeftWidth: 2,
                      }
                    : {
                        bottom: 6,
                        right: 6,
                        borderBottomWidth: 2,
                        borderRightWidth: 2,
                      }),
            }}
          >
            <div
              style={{
                position: "absolute",
                width: 4,
                height: 4,
                borderRadius: "50%",
                border: "1px solid rgba(230,215,160,0.3)",
                ...(c === "tl"
                  ? { bottom: 0, right: 0 }
                  : c === "tr"
                    ? { bottom: 0, left: 0 }
                    : c === "bl"
                      ? { top: 0, right: 0 }
                      : { top: 0, left: 0 }),
              }}
            />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes ctDustMote {
          0%   { transform: translateY(0px) translateX(0px) scale(1);    opacity: 0;   }
          12%  { opacity: 0.85; }
          50%  { transform: translateY(-6px) translateX(2px) scale(0.82); opacity: 0.9; }
          88%  { opacity: 0.6; }
          100% { transform: translateY(-12px) translateX(-1px) scale(0.6); opacity: 0; }
        }
      `}</style>
      </div>
    </div>
  );
};

export default CinematicTransition;
