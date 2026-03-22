import React, { useRef, useEffect, useCallback } from "react";

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
  const staticNoiseRef = useRef<HTMLDivElement>(null);
  const staticScanlinesRef = useRef<HTMLDivElement>(null);
  // Camera
  const cameraGroupRef = useRef<HTMLDivElement>(null);
  const mobileProjectorRef = useRef<HTMLDivElement>(null);
  const mobileProjectorLensRef = useRef<HTMLDivElement>(null);
  // Beam
  const beamRef = useRef<HTMLDivElement>(null);
  const desktopBeamRef = useRef<HTMLDivElement>(null);
  const mobileBeamRef = useRef<HTMLDivElement>(null);
  const mobileBeamPrimaryRef = useRef<HTMLDivElement>(null);
  const mobileBeamSecondaryRef = useRef<HTMLDivElement>(null);
  const mobileBeamConeRef = useRef<HTMLDivElement>(null);
  const mobileBeamSourceGlowRef = useRef<HTMLDivElement>(null);
  // Screen
  const screenRef = useRef<HTMLDivElement>(null);
  const screenTextRef = useRef<HTMLDivElement>(null);
  const grainRef = useRef<SVGFETurbulenceElement>(null);
  const frameCount = useRef(0);
  const clapFxTriggeredRef = useRef(false);
  const clapAudioCtxRef = useRef<AudioContext | null>(null);
  const beamParallaxRef = useRef<HTMLDivElement>(null);

  // Arc constants (viewBox 0 0 100 100, r=38)
  const ARC_R = 38;
  const ARC_CIRC = 2 * Math.PI * ARC_R;

  useEffect(() => {
    let raf: number;
    const triggerClapFx = () => {
      if (clapFxTriggeredRef.current) return;
      clapFxTriggeredRef.current = true;

      // Haptics (supported on many Android browsers).
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate?.([10, 20, 18]);
      }

      // Sharp synthetic clapboard snap — 820 Hz impact + 210 Hz body resonance.
      try {
        const Ctx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctx) return;
        if (!clapAudioCtxRef.current) clapAudioCtxRef.current = new Ctx();
        const ctx = clapAudioCtxRef.current;

        const play = () => {
          const sr = ctx.sampleRate;
          const dur = 0.07;
          const buf = ctx.createBuffer(1, Math.floor(sr * dur), sr);
          const data = buf.getChannelData(0);
          for (let i = 0; i < data.length; i++) {
            const t = i / sr;
            data[i] = (
              Math.sin(2 * Math.PI * 820 * t) * Math.exp(-t * 85) +
              Math.sin(2 * Math.PI * 210 * t) * Math.exp(-t * 42)
            ) * (Math.random() * 0.25 + 0.75) * 0.55;
          }
          const src = ctx.createBufferSource();
          src.buffer = buf;
          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.9, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
          src.connect(gain);
          gain.connect(ctx.destination);
          src.start();
        };

        if (ctx.state === "suspended") {
          ctx.resume().then(play).catch(() => {});
        } else {
          play();
        }
      } catch {
        // Silently ignore if audio is blocked.
      }
    };
    const setBeamSegment = (
      el: HTMLDivElement,
      fromX: number,
      fromY: number,
      toX: number,
      toY: number,
      thickness: number,
      glow: number,
    ) => {
      const dx = toX - fromX;
      const dy = toY - fromY;
      const dist = Math.hypot(dx, dy);
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      el.style.left = `${fromX}px`;
      el.style.top = `${fromY}px`;
      el.style.width = `${dist}px`;
      el.style.height = `${thickness}px`;
      el.style.transform = `translateY(-50%) rotate(${angle}deg)`;
      el.style.transformOrigin = "0 50%";
      el.style.borderRadius = "999px";
      el.style.filter = `blur(${glow}px)`;
      return { dx, dy, dist };
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const isMobile = vw <= 768;
      const sectionRect = sectionRef.current?.getBoundingClientRect();
      const PRE_ENTRY_VH = 1.32;
      const entryStart = vh * PRE_ENTRY_VH;
      // End timeline when next content is about to enter viewport
      // (i.e. when this section has only 1 viewport height remaining).
      const activeScrollRange = sectionRect
        ? Math.max(1, sectionRect.height - vh)
        : 1;
      const totalRange = entryStart + activeScrollRange;
      const p = sectionRect
        ? clamp((entryStart - sectionRect.top) / totalRange, 0, 1)
        : 0;
      // Pre-roll the cinematic timeline so clapboard is already entering
      // as soon as users scroll into this section (avoids initial dead-black beat).
      const TIMELINE_DELAY = 0.02;
      const timelineP = clamp((p - TIMELINE_DELAY) / (1 - TIMELINE_DELAY), 0, 1);
      const endFade = 1 - phase(p, 0.88, 1.0);

      if (!rootRef.current) return;
      const overlayOpacity =
        p <= 0 || p >= 1 ? 0 : easeOutCubic(phase(p, 0, 0.16)) * endFade;
      rootRef.current.style.opacity = String(overlayOpacity);
      if (p <= 0 || p >= 1) return;

      // Keep static only in pre-projector phase; fade to pure black as projector begins.
      const staticNoiseOpacity = 0.52 * (1 - phase(timelineP, 0.46, 0.58));
      const staticScanlineOpacity = 0.07 * (1 - phase(timelineP, 0.46, 0.58));
      if (staticNoiseRef.current) {
        staticNoiseRef.current.style.opacity = String(staticNoiseOpacity);
      }
      if (staticScanlinesRef.current) {
        staticScanlinesRef.current.style.opacity = String(staticScanlineOpacity);
      }

      // ─────────────────────────────────────────────────────────────────
      // COUNTDOWN  p 0.00 → 0.30
      // Each of 3 numbers occupies p 0.02-0.10 / 0.10-0.18 / 0.18-0.26
      // ─────────────────────────────────────────────────────────────────
      if (countdownRef.current) {
        const fadeIn = easeOutCubic(phase(p, 0.0, 0.04));
        const fadeOut = easeInCubic(phase(p, 0.26, 0.33));
        const countdownOpacityRaw = fadeIn * (1 - fadeOut);
        const countdownOpacity = SHOW_LEADER_COUNTDOWN
          ? countdownOpacityRaw
          : 0;
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
        const dropIn = easeOutCubic(phase(timelineP, 0.0, 0.24));
        const exitOut = easeInCubic(phase(timelineP, 0.38, 0.62));
        const dropStart = isMobile ? -150 : -115;
        const y = dropStart + dropIn * -dropStart + exitOut * 135;
        clapboardRef.current.style.left = "50%";
        clapboardRef.current.style.top = isMobile ? "50%" : "24%";
        clapboardRef.current.style.width = isMobile
          ? "min(340px, 82vw)"
          : "min(360px, 56vw)";
        clapboardRef.current.style.transform = isMobile
          ? `translate3d(-50%, calc(-50% + ${y}%), 0)`
          : `translate3d(-50%, ${y}%, 0)`;
        clapboardRef.current.style.opacity = String((timelineP > 0.62 ? 0 : 1) * endFade);
      }
      if (clapArmRef.current) {
        const snapT = easeInOutCubic(phase(timelineP, 0.2, 0.28));
        clapArmRef.current.style.transform = `rotate(${-28 * (1 - snapT)}deg)`;
      }
      if (timelineP >= 0.235 && timelineP <= 0.32) {
        triggerClapFx();
      } else if (timelineP < 0.18) {
        // Allow replay when user scrolls back and re-enters the sequence.
        clapFxTriggeredRef.current = false;
      }

      // ─────────────────────────────────────────────────────────────────
      // FLASH  p 0.43 → 0.50
      // ─────────────────────────────────────────────────────────────────
      if (flashRef.current) {
        const fp = phase(timelineP, 0.24, 0.34);
        const spike = fp < 0.4 ? fp / 0.4 : 1 - (fp - 0.4) / 0.6;
        flashRef.current.style.opacity = String(spike * 0.9 * endFade);
      }

      // ─────────────────────────────────────────────────────────────────
      // CAMERA  p 0.48 → 0.72
      // ─────────────────────────────────────────────────────────────────
      if (cameraGroupRef.current) {
        const camIn = easeOutCubic(phase(timelineP, 0.34, 0.62));
        cameraGroupRef.current.style.opacity = String(
          easeOutCubic(phase(timelineP, 0.34, 0.5)) * endFade,
        );
        if (isMobile) {
          cameraGroupRef.current.style.display = "none";
          cameraGroupRef.current.style.opacity = "0";
        } else {
          const tx = (1 - camIn) * -130;
          cameraGroupRef.current.style.left = "2%";
          cameraGroupRef.current.style.top = "50%";
          cameraGroupRef.current.style.width = "min(300px, 34vw)";
          cameraGroupRef.current.style.display = "block";
          cameraGroupRef.current.style.transform =
            `translateX(${tx}%) translateY(-50%) rotate(-6deg)`;
        }
      }
      if (mobileProjectorRef.current) {
        const projIn = easeOutCubic(phase(timelineP, 0.36, 0.62));
        const projectorY = vh - 40;
        mobileProjectorRef.current.style.opacity = isMobile
          ? String(projIn * endFade)
          : "0";
        mobileProjectorRef.current.style.left = `${vw * 0.5}px`;
        mobileProjectorRef.current.style.top = `${projectorY}px`;
        mobileProjectorRef.current.style.transform = isMobile
          ? `translate3d(-50%, ${(1 - projIn) * 10}%, 0) perspective(2000px) rotateX(5deg) scale(${0.95 + projIn * 0.05})`
          : "translate3d(-50%, 20%, 0)";
      }

      // ─────────────────────────────────────────────────────────────────
      // BEAM  p 0.58 → 0.76
      // ─────────────────────────────────────────────────────────────────
      if (beamRef.current) {
        const beamOpacity = easeOutCubic(phase(timelineP, 0.5, 0.72)) * endFade;
        beamRef.current.style.opacity = String(beamOpacity);
        if (desktopBeamRef.current) {
          desktopBeamRef.current.style.opacity = isMobile ? "0" : "1";
        }
        if (mobileBeamRef.current) {
          mobileBeamRef.current.style.opacity = isMobile ? "1" : "0";
        }

        if (
          isMobile &&
          mobileBeamPrimaryRef.current &&
          mobileBeamSecondaryRef.current &&
          mobileBeamConeRef.current &&
          mobileBeamSourceGlowRef.current &&
          mobileProjectorLensRef.current
        ) {
          const screenCenterX = vw * 0.5;
          const screenCenterY = vh * 0.38;
          const screenWidth = Math.min(430, vw * 0.9);
          const screenHeight = screenWidth * (9 / 16);
          const screenLeft = screenCenterX - screenWidth * 0.5;
          const screenTop = screenCenterY - screenHeight * 0.5;
          const projectorY = vh - 40;
          const lensX = vw * 0.5;
          const lensY = projectorY - 26;
          // Hide linear helper rays on mobile; keep a single stable volumetric cone.
          mobileBeamPrimaryRef.current.style.opacity = "0";
          mobileBeamSecondaryRef.current.style.opacity = "0";

          const distanceToScreen = Math.hypot(screenCenterX - lensX, (screenCenterY + screenHeight * 0.2) - lensY);
          const coneBaseIntensity = clamp(260 / (distanceToScreen + 260), 0.22, 0.72);
          const spread = easeOutCubic(phase(timelineP, 0.52, 0.74));
          const spreadWidth = clamp(0.2 + spread * 1.05, 0.2, 1);
          const leftEdgeX = screenCenterX - (screenWidth * 0.5 * spreadWidth);
          const rightEdgeX = screenCenterX + (screenWidth * 0.5 * spreadWidth);
          const screenTopY = screenTop;
          const screenBottomY = screenTop + screenHeight;
          const coneIntensity = clamp(coneBaseIntensity * (0.22 + spread * 0.74), 0.12, 0.62);
          const sourceHalfWidth = 5 + spread * 3;

          mobileBeamConeRef.current.style.left = "0px";
          mobileBeamConeRef.current.style.top = "0px";
          mobileBeamConeRef.current.style.width = `${vw}px`;
          mobileBeamConeRef.current.style.height = `${vh}px`;
          mobileBeamConeRef.current.style.clipPath =
            `polygon(${lensX - sourceHalfWidth}px ${lensY}px, ${lensX + sourceHalfWidth}px ${lensY}px, ${rightEdgeX}px ${screenTopY}px, ${rightEdgeX}px ${screenBottomY}px, ${leftEdgeX}px ${screenBottomY}px, ${leftEdgeX}px ${screenTopY}px)`;
          mobileBeamConeRef.current.style.background =
            `radial-gradient(ellipse at ${lensX}px ${lensY}px, rgba(255,248,198,${0.92 * coneIntensity}) 0%, rgba(255,238,152,${0.5 * coneIntensity}) 26%, rgba(255,230,112,${0.24 * coneIntensity}) 52%, rgba(255,224,90,0) 84%)`;
          mobileBeamConeRef.current.style.boxShadow =
            `0 0 10px rgba(255,238,148,${0.09 * coneIntensity})`;
          mobileBeamConeRef.current.style.opacity = String(clamp(0.42 + spread * 0.58, 0.42, 1));

          mobileBeamSourceGlowRef.current.style.left = `${lensX}px`;
          mobileBeamSourceGlowRef.current.style.top = `${lensY}px`;
          mobileBeamSourceGlowRef.current.style.opacity = String(
            clamp(coneBaseIntensity * 0.72, 0.2, 0.62),
          );
          mobileProjectorLensRef.current.style.opacity = String(
            clamp(0.25 + coneBaseIntensity * 0.65, 0.25, 0.85),
          );
        }
      }

      // ─────────────────────────────────────────────────────────────────
      // SCREEN  p 0.62 → 0.80
      // ─────────────────────────────────────────────────────────────────
      if (screenRef.current) {
        const sp = easeOutCubic(phase(timelineP, 0.56, 0.8));
        const screenScale = 0.92 + sp * 0.08;
        screenRef.current.style.opacity = String(sp * endFade);
        if (isMobile) {
          screenRef.current.style.left = "50%";
          screenRef.current.style.right = "auto";
          screenRef.current.style.top = "38%";
          screenRef.current.style.width = "min(430px, 90vw)";
          screenRef.current.style.transform =
            `translate3d(-50%, -50%, 0) perspective(1200px) rotateY(0deg) scale(${screenScale})`;
        } else {
          screenRef.current.style.left = "auto";
          screenRef.current.style.right = "3%";
          screenRef.current.style.top = "50%";
          screenRef.current.style.width = "min(620px, 60vw)";
          screenRef.current.style.transform =
            `translateY(-50%) perspective(1200px) rotateY(-4deg) scale(${screenScale})`;
        }
      }

      // ─────────────────────────────────────────────────────────────────
      // TEXT WIPE  p 0.76 → 0.96
      // ─────────────────────────────────────────────────────────────────
      if (screenTextRef.current) {
        const wp = easeOutCubic(phase(timelineP, 0.74, 0.96));
        screenTextRef.current.style.clipPath = `inset(0 ${(1 - wp) * 100}% 0 0)`;
      }

      // ─────────────────────────────────────────────────────────────────
      // FILM GRAIN jitter
      // ─────────────────────────────────────────────────────────────────
      frameCount.current++;
      if (
        grainRef.current &&
        frameCount.current % 4 === 0 &&
        timelineP > 0.74
      ) {
        const bf = 0.65 + (Math.random() - 0.5) * 0.1;
        grainRef.current.setAttribute("baseFrequency", `${bf} ${bf}`);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      void clapAudioCtxRef.current?.close();
      clapAudioCtxRef.current = null;
    };
  }, []);

  // ── Beam mouse parallax ───────────────────────────────────────────────────
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!beamParallaxRef.current) return;
    const mx = e.clientX / window.innerWidth - 0.5;
    const my = e.clientY / window.innerHeight - 0.5;
    beamParallaxRef.current.style.setProperty("--beam-mx", String(mx));
    beamParallaxRef.current.style.setProperty("--beam-my", String(my));
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div id="cinematic-transition" ref={sectionRef} className="relative h-[240vh] bg-black">
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
              <feColorMatrix
                type="saturate"
                values="0"
                in="noise"
                result="gn"
              />
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

        {/* Minimal dark background with soft vignette */}
        <div
          ref={staticNoiseRef}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 4,
            pointerEvents: "none",
            background: "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(12,10,6,1) 0%, #000 100%)",
          }}
        />
        <div
          ref={staticScanlinesRef}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 5,
            pointerEvents: "none",
            opacity: 0.025,
            background:
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 4px)",
          }}
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
            overflow: "visible",
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
            DATE: 18–19 APR 2026 · DUBLIN, IRELAND
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
          <div
            ref={mobileBeamRef}
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0,
            }}
          >
            <div
              ref={mobileBeamPrimaryRef}
              style={{ position: "absolute", pointerEvents: "none" }}
            />
            <div
              ref={mobileBeamSecondaryRef}
              style={{ position: "absolute", pointerEvents: "none" }}
            />
            <div
              ref={mobileBeamConeRef}
              style={{ position: "absolute", pointerEvents: "none", opacity: 0 }}
            />
            <div
              ref={mobileBeamSourceGlowRef}
              style={{
                position: "absolute",
                width: 16,
                height: 16,
                transform: "translate(-50%, -50%)",
                borderRadius: "50%",
                pointerEvents: "none",
                background:
                  "radial-gradient(circle, rgba(255,250,214,0.98) 0%, rgba(255,236,148,0.56) 42%, rgba(255,224,100,0.08) 72%, transparent 100%)",
                boxShadow: "0 0 10px rgba(255,238,148,0.35)",
                border: "1px solid rgba(255,246,190,0.28)",
                opacity: 0,
              }}
            />
          </div>
          <div
            ref={desktopBeamRef}
            style={{ position: "absolute", inset: 0, opacity: 1 }}
          >
          <div
            ref={beamParallaxRef}
            style={{
              position: "absolute",
              inset: 0,
              transform: "translate(calc(var(--beam-mx, 0) * 14px), calc(var(--beam-my, 0) * 8px))",
              transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
          {/* Outer atmospheric halo — wide fan, centered on screen */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              clipPath: "polygon(20% 40%, 100% 17%, 100% 83%)",
              background: "linear-gradient(to right, rgba(220,185,90,0.12) 0%, rgba(220,185,90,0.03) 50%, transparent 100%)",
              filter: "blur(36px)",
            }}
          />
          {/* Main beam body — covers full screen height */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              clipPath: "polygon(20% 40%, 100% 27%, 100% 73%)",
              background: "linear-gradient(to right, rgba(240,220,140,0.25) 0%, rgba(240,220,140,0.06) 55%, transparent 100%)",
              filter: "blur(14px)",
            }}
          />
          {/* Mid beam — volumetric body, angled at screen center */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              clipPath: "polygon(20% 40%, 100% 37%, 100% 63%)",
              background: "linear-gradient(to right, rgba(255,245,190,0.35) 0%, rgba(255,245,190,0.08) 52%, transparent 100%)",
              filter: "blur(6px)",
            }}
          />
          {/* Core beam — bright centre, aims at screen midpoint */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              clipPath: "polygon(20% 40%, 100% 44%, 100% 56%)",
              background: "linear-gradient(to right, rgba(255,252,210,0.75) 0%, rgba(255,248,180,0.20) 44%, transparent 100%)",
              filter: "blur(1.5px)",
            }}
          />
          {/* Lens source glow */}
          <div
            style={{
              position: "absolute",
              left: "20%",
              top: "40%",
              width: 56,
              height: 56,
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(255,252,220,1) 0%, rgba(240,210,100,0.72) 28%, rgba(220,185,90,0.22) 60%, transparent 80%)",
              filter: "blur(7px)",
              zIndex: 1,
            }}
          />
          </div>
          </div>
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
            <defs>
              <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3a3228" />
                <stop offset="55%" stopColor="#241e16" />
                <stop offset="100%" stopColor="#1a1510" />
              </linearGradient>
              <linearGradient id="reelGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3c3428" />
                <stop offset="100%" stopColor="#1e1a12" />
              </linearGradient>
              <linearGradient id="lensGlassGrad" cx="38%" cy="38%" r="50%" fx="38%" fy="38%" gradientUnits="objectBoundingBox" id="lensGlass">
                <stop offset="0%" stopColor="rgba(248,236,188,0.92)" />
                <stop offset="45%" stopColor="rgba(200,170,80,0.55)" />
                <stop offset="100%" stopColor="rgba(80,60,20,0.8)" />
              </linearGradient>
              <radialGradient id="lensGlass" cx="38%" cy="38%" r="50%">
                <stop offset="0%" stopColor="rgba(255,250,210,0.95)" />
                <stop offset="40%" stopColor="rgba(198,153,58,0.6)" />
                <stop offset="100%" stopColor="rgba(40,30,10,0.85)" />
              </radialGradient>
            </defs>

            {/* ── Tripod legs ── */}
            <line x1="125" y1="196" x2="55" y2="372" stroke="#3a3020" strokeWidth="4" strokeLinecap="round" />
            <line x1="132" y1="198" x2="132" y2="372" stroke="#3a3020" strokeWidth="4" strokeLinecap="round" />
            <line x1="139" y1="196" x2="205" y2="372" stroke="#3a3020" strokeWidth="4" strokeLinecap="round" />
            {/* Spreader bar */}
            <line x1="74" y1="306" x2="190" y2="306" stroke="#2e2618" strokeWidth="2" strokeLinecap="round" />
            <ellipse cx="55" cy="374" rx="10" ry="4" fill="#1e1a10" />
            <ellipse cx="132" cy="374" rx="10" ry="4" fill="#1e1a10" />
            <ellipse cx="205" cy="374" rx="10" ry="4" fill="#1e1a10" />

            {/* ── Tripod head / pan plate ── */}
            <rect x="108" y="184" width="48" height="16" rx="4" fill="#2e2618" stroke="rgba(198,153,58,0.3)" strokeWidth="1" />
            <rect x="116" y="188" width="32" height="4" rx="2" fill="rgba(198,153,58,0.12)" />

            {/* ── Main camera body ── */}
            <rect x="38" y="56" width="184" height="132" rx="7" fill="url(#bodyGrad)" />
            {/* Top edge highlight */}
            <rect x="38" y="56" width="184" height="3" rx="2" fill="rgba(198,153,58,0.18)" />
            {/* Panel division lines */}
            <line x1="38" y1="104" x2="222" y2="104" stroke="rgba(198,153,58,0.15)" strokeWidth="1" />
            <line x1="38" y1="142" x2="222" y2="142" stroke="rgba(198,153,58,0.15)" strokeWidth="1" />
            {/* Body outline */}
            <rect x="38" y="56" width="184" height="132" rx="7" fill="none" stroke="rgba(198,153,58,0.28)" strokeWidth="1.5" />

            {/* ── Film perforations along top edge ── */}
            {[0,1,2,3,4,5,6].map((i) => (
              <rect key={`tp${i}`} x={48 + i * 23} y="56" width="10" height="6" rx="1.2" fill="#0e0b07" stroke="rgba(198,153,58,0.2)" strokeWidth="0.5" />
            ))}
            {/* Bottom perforations */}
            {[0,1,2,3,4,5,6].map((i) => (
              <rect key={`bp${i}`} x={48 + i * 23} y="182" width="10" height="6" rx="1.2" fill="#0e0b07" stroke="rgba(198,153,58,0.2)" strokeWidth="0.5" />
            ))}

            {/* ── Film reels (top, recessed) ── */}
            {/* Left reel */}
            <circle cx="74" cy="78" r="24" fill="url(#reelGrad)" stroke="rgba(198,153,58,0.35)" strokeWidth="1.5" />
            <circle cx="74" cy="78" r="17" fill="#141008" stroke="rgba(198,153,58,0.22)" strokeWidth="1" />
            {[0,45,90,135,180,225,270,315].map((a) => (
              <line key={`ls${a}`}
                x1={74 + 6 * Math.cos(a * Math.PI / 180)} y1={78 + 6 * Math.sin(a * Math.PI / 180)}
                x2={74 + 15 * Math.cos(a * Math.PI / 180)} y2={78 + 15 * Math.sin(a * Math.PI / 180)}
                stroke="rgba(198,153,58,0.28)" strokeWidth="1.2" />
            ))}
            <circle cx="74" cy="78" r="5" fill="#2e2618" stroke="rgba(198,153,58,0.45)" strokeWidth="1" />
            <circle cx="74" cy="78" r="2" fill="rgba(198,153,58,0.6)" />
            {/* Reel sprocket holes */}
            {[0,60,120,180,240,300].map((a) => (
              <circle key={`lh${a}`} cx={74 + 11 * Math.cos(a * Math.PI / 180)} cy={78 + 11 * Math.sin(a * Math.PI / 180)} r="1.8" fill="#0e0b07" stroke="rgba(198,153,58,0.15)" strokeWidth="0.5" />
            ))}

            {/* Right reel */}
            <circle cx="188" cy="78" r="24" fill="url(#reelGrad)" stroke="rgba(198,153,58,0.35)" strokeWidth="1.5" />
            <circle cx="188" cy="78" r="17" fill="#141008" stroke="rgba(198,153,58,0.22)" strokeWidth="1" />
            {[0,45,90,135,180,225,270,315].map((a) => (
              <line key={`rs${a}`}
                x1={188 + 6 * Math.cos(a * Math.PI / 180)} y1={78 + 6 * Math.sin(a * Math.PI / 180)}
                x2={188 + 15 * Math.cos(a * Math.PI / 180)} y2={78 + 15 * Math.sin(a * Math.PI / 180)}
                stroke="rgba(198,153,58,0.28)" strokeWidth="1.2" />
            ))}
            <circle cx="188" cy="78" r="5" fill="#2e2618" stroke="rgba(198,153,58,0.45)" strokeWidth="1" />
            <circle cx="188" cy="78" r="2" fill="rgba(198,153,58,0.6)" />
            {[0,60,120,180,240,300].map((a) => (
              <circle key={`rh${a}`} cx={188 + 11 * Math.cos(a * Math.PI / 180)} cy={78 + 11 * Math.sin(a * Math.PI / 180)} r="1.8" fill="#0e0b07" stroke="rgba(198,153,58,0.15)" strokeWidth="0.5" />
            ))}

            {/* ── Film path guide channel ── */}
            <rect x="94" y="56" width="76" height="24" rx="0" fill="#0e0b07" stroke="rgba(198,153,58,0.12)" strokeWidth="0.5" />

            {/* ── Aperture gate (center body) ── */}
            <rect x="112" y="108" width="38" height="30" rx="2" fill="#0a0806" stroke="rgba(198,153,58,0.3)" strokeWidth="1" />
            <rect x="116" y="112" width="30" height="22" rx="1" fill="#060503" stroke="rgba(198,153,58,0.2)" strokeWidth="0.5" />
            {/* Crosshairs */}
            <line x1="131" y1="112" x2="131" y2="134" stroke="rgba(198,153,58,0.25)" strokeWidth="0.5" />
            <line x1="116" y1="123" x2="146" y2="123" stroke="rgba(198,153,58,0.25)" strokeWidth="0.5" />
            {/* Corner marks */}
            {[[116,112],[146,112],[116,134],[146,134]].map(([cx,cy],i) => (
              <React.Fragment key={`cm${i}`}>
                <line x1={cx} y1={cy} x2={cx + (i%2===0?3:-3)} y2={cy} stroke="rgba(198,153,58,0.4)" strokeWidth="0.8" />
                <line x1={cx} y1={cy} x2={cx} y2={cy + (i<2?3:-3)} stroke="rgba(198,153,58,0.4)" strokeWidth="0.8" />
              </React.Fragment>
            ))}

            {/* ── Nameplate ── */}
            <rect x="50" y="148" width="92" height="16" rx="2" fill="#0e0b07" stroke="rgba(198,153,58,0.32)" strokeWidth="0.8" />
            <text x="96" y="159" fontFamily="'IBM Plex Mono', monospace" fontSize="6" fill="rgba(198,153,58,0.7)" textAnchor="middle" letterSpacing="1.2">CINE · 16mm</text>

            {/* ── Control knobs ── */}
            {[[160,148],[176,148],[192,148]].map(([cx,cy],i) => (
              <React.Fragment key={`k${i}`}>
                <circle cx={cx} cy={cy+8} r="6" fill="#1e1a10" stroke="rgba(198,153,58,0.35)" strokeWidth="0.8" />
                <circle cx={cx} cy={cy+8} r="2.5" fill="rgba(198,153,58,0.4)" />
                <line x1={cx} y1={cy+4} x2={cx} y2={cy+7} stroke="rgba(198,153,58,0.5)" strokeWidth="0.8" />
              </React.Fragment>
            ))}

            {/* ── Ventilation louvres ── */}
            {[166,172,178,184].map((y) => (
              <line key={`v${y}`} x1="42" y1={y} x2="52" y2={y} stroke="rgba(198,153,58,0.2)" strokeWidth="0.8" strokeLinecap="round" />
            ))}

            {/* ── Corner rivets ── */}
            {[[44,62],[216,62],[44,180],[216,180]].map(([cx,cy],i) => (
              <React.Fragment key={`rv${i}`}>
                <circle cx={cx} cy={cy} r="3.5" fill="#2e2618" stroke="rgba(198,153,58,0.4)" strokeWidth="0.8" />
                <circle cx={cx} cy={cy} r="1.2" fill="rgba(198,153,58,0.35)" />
              </React.Fragment>
            ))}

            {/* ── Lens barrel / cone ── */}
            <path d="M220 90 L265 76 L265 168 L220 152 Z" fill="#1e1a10" stroke="rgba(198,153,58,0.3)" strokeWidth="1.2" />
            {/* Barrel grip rings */}
            {[238,248,258].map((x) => (
              <line key={`gr${x}`} x1={x} y1={76 + (x-265)*(-0.22)*(-1)} x2={x} y2={168 - (265-x)*0.22} stroke="rgba(198,153,58,0.18)" strokeWidth="1.5" />
            ))}

            {/* ── Lens assembly ── */}
            {/* Outer hood */}
            <circle cx="268" cy="122" r="27" fill="#141008" stroke="rgba(198,153,58,0.38)" strokeWidth="2" />
            {/* Barrel rim */}
            <circle cx="268" cy="122" r="22" fill="#1a1508" stroke="rgba(198,153,58,0.28)" strokeWidth="1.5" />
            {/* Element rings */}
            <circle cx="268" cy="122" r="17" fill="#0e0b05" stroke="rgba(198,153,58,0.22)" strokeWidth="1" />
            <circle cx="268" cy="122" r="12" fill="#0a0805" stroke="rgba(198,153,58,0.3)" strokeWidth="0.8" />
            {/* Glass element */}
            <circle cx="268" cy="122" r="8" fill="url(#lensGlass)" stroke="rgba(248,236,188,0.45)" strokeWidth="0.8" />
            {/* Specular highlights */}
            <circle cx="262" cy="116" r="3.5" fill="rgba(255,252,230,0.22)" />
            <circle cx="260" cy="114" r="1.8" fill="rgba(255,252,230,0.32)" />
            <circle cx="272" cy="128" r="1.2" fill="rgba(255,252,230,0.12)" />
          </svg>
        </div>
        <div
          ref={mobileProjectorRef}
          style={{
            position: "absolute",
            left: "50%",
            top: "92%",
            width: "min(200px, 52vw)",
            transform: "translate3d(-50%, 20%, 0)",
            opacity: 0,
            zIndex: 22,
            pointerEvents: "none",
            filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.85))",
          }}
        >
          <svg viewBox="0 0 200 110" style={{ width: "100%", height: "auto", overflow: "visible" }} aria-hidden="true">
            <defs>
              <linearGradient id="mpBodyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3a3228" />
                <stop offset="100%" stopColor="#1a1510" />
              </linearGradient>
              <radialGradient id="mpLensGlass" cx="38%" cy="38%" r="50%">
                <stop offset="0%" stopColor="rgba(255,250,210,0.95)" />
                <stop offset="45%" stopColor="rgba(198,153,58,0.55)" />
                <stop offset="100%" stopColor="rgba(30,20,5,0.9)" />
              </radialGradient>
            </defs>

            {/* Shadow */}
            <ellipse cx="100" cy="108" rx="72" ry="5" fill="rgba(0,0,0,0.55)" style={{ filter: "blur(4px)" }} />

            {/* Main body */}
            <rect x="28" y="32" width="132" height="62" rx="5" fill="url(#mpBodyGrad)" stroke="rgba(198,153,58,0.32)" strokeWidth="1.2" />
            {/* Top highlight */}
            <rect x="28" y="32" width="132" height="2.5" rx="2" fill="rgba(198,153,58,0.2)" />
            {/* Panel line */}
            <line x1="28" y1="58" x2="160" y2="58" stroke="rgba(198,153,58,0.14)" strokeWidth="0.8" />
            <line x1="28" y1="72" x2="160" y2="72" stroke="rgba(198,153,58,0.14)" strokeWidth="0.8" />

            {/* Film reels on top */}
            {/* Left reel */}
            <circle cx="60" cy="26" r="20" fill="#2e2618" stroke="rgba(198,153,58,0.38)" strokeWidth="1.2" />
            <circle cx="60" cy="26" r="13" fill="#141008" stroke="rgba(198,153,58,0.2)" strokeWidth="0.8" />
            {[0,45,90,135,180,225,270,315].map((a) => (
              <line key={`mls${a}`}
                x1={60 + 5 * Math.cos(a * Math.PI / 180)} y1={26 + 5 * Math.sin(a * Math.PI / 180)}
                x2={60 + 11 * Math.cos(a * Math.PI / 180)} y2={26 + 11 * Math.sin(a * Math.PI / 180)}
                stroke="rgba(198,153,58,0.28)" strokeWidth="1" />
            ))}
            <circle cx="60" cy="26" r="4" fill="#2e2618" stroke="rgba(198,153,58,0.5)" strokeWidth="0.8" />
            <circle cx="60" cy="26" r="1.5" fill="rgba(198,153,58,0.65)" />
            {/* Reel connector post */}
            <rect x="56" y="32" width="8" height="6" rx="1" fill="#1e1a10" stroke="rgba(198,153,58,0.22)" strokeWidth="0.5" />

            {/* Right reel */}
            <circle cx="140" cy="26" r="20" fill="#2e2618" stroke="rgba(198,153,58,0.38)" strokeWidth="1.2" />
            <circle cx="140" cy="26" r="13" fill="#141008" stroke="rgba(198,153,58,0.2)" strokeWidth="0.8" />
            {[0,45,90,135,180,225,270,315].map((a) => (
              <line key={`mrs${a}`}
                x1={140 + 5 * Math.cos(a * Math.PI / 180)} y1={26 + 5 * Math.sin(a * Math.PI / 180)}
                x2={140 + 11 * Math.cos(a * Math.PI / 180)} y2={26 + 11 * Math.sin(a * Math.PI / 180)}
                stroke="rgba(198,153,58,0.28)" strokeWidth="1" />
            ))}
            <circle cx="140" cy="26" r="4" fill="#2e2618" stroke="rgba(198,153,58,0.5)" strokeWidth="0.8" />
            <circle cx="140" cy="26" r="1.5" fill="rgba(198,153,58,0.65)" />
            <rect x="136" y="32" width="8" height="6" rx="1" fill="#1e1a10" stroke="rgba(198,153,58,0.22)" strokeWidth="0.5" />

            {/* Aperture gate (center top area) */}
            <rect x="86" y="36" width="28" height="20" rx="1.5" fill="#0a0806" stroke="rgba(198,153,58,0.28)" strokeWidth="0.8" />
            <line x1="100" y1="36" x2="100" y2="56" stroke="rgba(198,153,58,0.2)" strokeWidth="0.5" />
            <line x1="86" y1="46" x2="114" y2="46" stroke="rgba(198,153,58,0.2)" strokeWidth="0.5" />

            {/* Lens barrel (right side) */}
            <path d="M160 50 L178 44 L178 76 L160 72 Z" fill="#1e1a10" stroke="rgba(198,153,58,0.28)" strokeWidth="1" />
            {/* Grip rings on barrel */}
            {[165,170,175].map((x) => (
              <line key={`mgr${x}`} x1={x} y1={44 + (x-160)*0.2} x2={x} y2={76 - (x-160)*0.2} stroke="rgba(198,153,58,0.16)" strokeWidth="1" />
            ))}

            {/* Lens assembly */}
            <circle cx="180" cy="60" r="19" fill="#141008" stroke="rgba(198,153,58,0.4)" strokeWidth="1.5" />
            <circle cx="180" cy="60" r="14" fill="#0e0b05" stroke="rgba(198,153,58,0.28)" strokeWidth="1" />
            <circle cx="180" cy="60" r="9" fill="#0a0805" stroke="rgba(198,153,58,0.22)" strokeWidth="0.8" />
            {/* Glass element */}
            <circle cx="180" cy="60" r="5.5" fill="url(#mpLensGlass)" stroke="rgba(248,236,188,0.5)" strokeWidth="0.7" />
            {/* Specular */}
            <circle cx="177" cy="57" r="2.2" fill="rgba(255,252,230,0.25)" />
            <circle cx="176" cy="56" r="1.1" fill="rgba(255,252,230,0.38)" />

            {/* Lens ref for glow */}
            <circle ref={mobileProjectorLensRef as React.RefObject<SVGCircleElement>} cx="180" cy="60" r="5.5" fill="rgba(255,236,148,0)" style={{ opacity: 0 }} />

            {/* Control knobs */}
            {[[38,76],[52,76],[66,76]].map(([cx,cy],i) => (
              <React.Fragment key={`mk${i}`}>
                <circle cx={cx} cy={cy} r="5" fill="#1e1a10" stroke="rgba(198,153,58,0.35)" strokeWidth="0.8" />
                <circle cx={cx} cy={cy} r="2" fill="rgba(198,153,58,0.4)" />
              </React.Fragment>
            ))}

            {/* Nameplate */}
            <rect x="82" y="72" width="60" height="12" rx="1.5" fill="#0e0b07" stroke="rgba(198,153,58,0.3)" strokeWidth="0.6" />
            <text x="112" y="81" fontFamily="'IBM Plex Mono', monospace" fontSize="5" fill="rgba(198,153,58,0.65)" textAnchor="middle" letterSpacing="1">16mm · PRO</text>

            {/* Ventilation louvres */}
            {[62,67,72,77,82].map((y) => (
              <line key={`mvl${y}`} x1="150" y1={y} x2="158" y2={y} stroke="rgba(198,153,58,0.18)" strokeWidth="0.7" strokeLinecap="round" />
            ))}

            {/* Corner rivets */}
            {[[33,37],[155,37],[33,88],[155,88]].map(([cx,cy],i) => (
              <React.Fragment key={`mrv${i}`}>
                <circle cx={cx} cy={cy} r="2.5" fill="#2e2618" stroke="rgba(198,153,58,0.38)" strokeWidth="0.6" />
                <circle cx={cx} cy={cy} r="1" fill="rgba(198,153,58,0.35)" />
              </React.Fragment>
            ))}

            {/* Base/feet */}
            <rect x="40" y="94" width="100" height="8" rx="3" fill="#1a1510" stroke="rgba(198,153,58,0.22)" strokeWidth="0.8" />
            <rect x="48" y="92" width="14" height="4" rx="2" fill="#141008" />
            <rect x="118" y="92" width="14" height="4" rx="2" fill="#141008" />
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
            width: "min(620px, 60vw)",
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
              AI Filmmaking
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
              18–19 Apr 2026 &nbsp;·&nbsp; Dublin, Ireland
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
                    ? {
                        top: 6,
                        right: 6,
                        borderTopWidth: 2,
                        borderRightWidth: 2,
                      }
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
