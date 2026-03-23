import React, { useRef, useEffect, useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Design tokens
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  gold: "rgba(248,236,188,0.97)",
  amber: "rgba(220,185,90,0.88)",
  amberDim: "rgba(220,185,90,0.62)",
  muted: "rgba(255,255,255,0.38)",
  dim: "rgba(255,255,255,0.15)",
  accent: "#E85D35",
  border: "rgba(220,185,90,0.32)",
  cardBg: "rgba(248,236,188,0.03)",
  serif: "'IBM Plex Serif', Georgia, serif",
  sans: "'IBM Plex Sans', system-ui, sans-serif",
  mono: "monospace",
};

// ─────────────────────────────────────────────────────────────────────────────
// SectionReveal — scroll-triggered fade+slide
// ─────────────────────────────────────────────────────────────────────────────
function SectionReveal({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 1s cubic-bezier(.4,0,.2,1) ${delay}s,
                     transform 1s cubic-bezier(.4,0,.2,1) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SectionLabel — editorial top-of-section marker
// ─────────────────────────────────────────────────────────────────────────────
function SectionLabel({ no, title }: { no: string; title: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        marginBottom: "3.5rem",
      }}
    >
      <span
        style={{
          fontFamily: T.mono,
          fontSize: "0.65rem",
          letterSpacing: "0.2em",
          color: T.amber,
          border: `1px solid ${T.border}`,
          padding: "0.3rem 0.65rem",
        }}
      >
        {no}
      </span>
      <span
        style={{
          fontFamily: T.mono,
          fontSize: "0.7rem",
          letterSpacing: "0.28em",
          color: T.amberDim,
          textTransform: "uppercase",
        }}
      >
        {title}
      </span>
      <div
        style={{ flex: 1, height: 1, background: T.border, maxWidth: 120 }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FilmStrip — horizontal sprocket-hole divider
// ─────────────────────────────────────────────────────────────────────────────
function FilmStrip() {
  return (
    <div style={{ width: "100%", overflow: "hidden", padding: "2.5rem 0" }}>
      <svg
        viewBox="0 0 1200 28"
        style={{
          width: "108%",
          marginLeft: "-4%",
          height: 28,
          display: "block",
        }}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <line
          x1="0"
          y1="2"
          x2="1200"
          y2="2"
          stroke={T.border}
          strokeWidth="0.6"
        />
        <line
          x1="0"
          y1="26"
          x2="1200"
          y2="26"
          stroke={T.border}
          strokeWidth="0.6"
        />
        {Array.from({ length: 62 }, (_, i) => (
          <React.Fragment key={i}>
            <rect
              x={i * 20 + 2}
              y="5"
              width="9"
              height="6"
              rx="1.2"
              fill="none"
              stroke="rgba(200,170,80,0.14)"
              strokeWidth="0.6"
            />
            <rect
              x={i * 20 + 2}
              y="17"
              width="9"
              height="6"
              rx="1.2"
              fill="none"
              stroke="rgba(200,170,80,0.14)"
              strokeWidth="0.6"
            />
          </React.Fragment>
        ))}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ReelIcon — small film reel SVG
// ─────────────────────────────────────────────────────────────────────────────
function ReelIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="10"
        cy="10"
        r="9"
        stroke="rgba(200,170,80,0.28)"
        strokeWidth="0.7"
      />
      <circle
        cx="10"
        cy="10"
        r="5"
        stroke="rgba(200,170,80,0.2)"
        strokeWidth="0.7"
      />
      <circle cx="10" cy="10" r="1.8" fill="rgba(200,170,80,0.3)" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <line
          key={a}
          x1={10 + 2.5 * Math.cos((a * Math.PI) / 180)}
          y1={10 + 2.5 * Math.sin((a * Math.PI) / 180)}
          x2={10 + 8 * Math.cos((a * Math.PI) / 180)}
          y2={10 + 8 * Math.sin((a * Math.PI) / 180)}
          stroke="rgba(200,170,80,0.16)"
          strokeWidth="0.7"
        />
      ))}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// InfoCard — compact data card for the right-side detail column
// ─────────────────────────────────────────────────────────────────────────────
function InfoCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div
      style={{
        border: `1px solid ${T.border}`,
        padding: "1.25rem 1.5rem",
        background: T.cardBg,
        display: "flex",
        flexDirection: "column",
        gap: "0.35rem",
      }}
    >
      <div
        style={{
          fontFamily: T.mono,
          fontSize: "0.55rem",
          letterSpacing: "0.3em",
          color: T.amber,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: T.serif,
          fontSize: "1.15rem",
          fontWeight: 600,
          color: T.gold,
          lineHeight: 1.2,
        }}
      >
        {value}
      </div>
      {sub && (
        <div
          style={{
            fontFamily: T.mono,
            fontSize: "0.58rem",
            color: T.muted,
            letterSpacing: "0.08em",
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TicketCard — cinema ticket with perforated edge
// ─────────────────────────────────────────────────────────────────────────────
function TicketCard({
  day,
  scene,
  title,
  description,
  meta1,
  meta2,
  badge,
}: {
  day: string;
  scene: string;
  title: string;
  description: string;
  meta1: string;
  meta2: string;
  badge?: string;
}) {
  return (
    <div
      className="ec-ticket-card"
      style={{
        position: "relative",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E"), linear-gradient(160deg, rgba(30,24,8,0.96) 0%, rgba(8,6,2,1) 100%)`,
        border: `1px solid ${T.border}`,
        width: "100%",
        height: "100%",
        display: "flex",
        overflow: "visible",
      }}
    >
      {/* Tear notch gaps — semicircles punched at top & bottom of tear line */}
      {(["top", "bottom"] as const).map((pos) => (
        <div
          key={pos}
          className="ec-ticket-notch"
          style={{
            position: "absolute",
            right: 63,
            [pos]: -10,
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "#000",
            zIndex: 3,
          }}
        />
      ))}

      {/* Edge light leak */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "45%",
          background:
            "radial-gradient(ellipse at 100% 28%, rgba(255,200,60,0.045) 0%, transparent 68%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Main body */}
      <div
        className="ec-ticket-main"
        style={{
          flex: 1,
          padding: "2.5rem 2rem",
          borderRight: `1px dashed rgba(220,185,90,0.28)`,
          display: "flex",
          flexDirection: "column",
          gap: "0",
        }}
      >
        {/* Header row */}
        <div
          className="ec-ticket-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "1.5rem",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: T.mono,
                fontSize: "0.58rem",
                letterSpacing: "0.25em",
                color: T.amber,
                textTransform: "uppercase",
                marginBottom: "0.25rem",
              }}
            >
              {day}
            </div>
            <div
              style={{
                fontFamily: T.mono,
                fontSize: "0.52rem",
                letterSpacing: "0.15em",
                color: T.muted,
              }}
            >
              {scene}
            </div>
          </div>
          {badge && (
            <div
              style={{
                fontFamily: T.mono,
                fontSize: "0.52rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: T.gold,
                border: `1px solid ${T.border}`,
                padding: "0.28rem 0.6rem",
                animation: "ecNowShowing 2.8s ease-in-out infinite",
                whiteSpace: "nowrap",
              }}
            >
              {badge}
            </div>
          )}
        </div>

        {/* Divider */}
        <div
          style={{ height: 1, background: T.border, marginBottom: "1.5rem" }}
        />

        {/* Title */}
        <div
          className="ec-ticket-title"
          style={{
            fontFamily: T.serif,
            fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
            fontWeight: 700,
            color: T.gold,
            lineHeight: 1.1,
            marginBottom: "1.1rem",
            letterSpacing: "0.01em",
          }}
        >
          {title}
        </div>

        {/* Description */}
        <div
          className="ec-ticket-description"
          style={{
            fontFamily: T.sans,
            fontSize: "0.875rem",
            color: "rgba(255,255,255,0.52)",
            lineHeight: 1.7,
            flex: 1,
            marginBottom: "1.75rem",
          }}
        >
          {description}
        </div>

        {/* Meta row */}
        <div
          style={{ height: 1, background: T.border, marginBottom: "1rem" }}
        />
        <div
          className="ec-ticket-meta"
          style={{
            display: "flex",
            gap: "2rem",
          }}
        >
          {[meta1, meta2].map((m, i) => (
            <div
              key={i}
              style={{
                fontFamily: T.mono,
                fontSize: "0.55rem",
                letterSpacing: "0.15em",
                color: T.muted,
                textTransform: "uppercase",
              }}
            >
              {m}
            </div>
          ))}
        </div>
      </div>

      {/* Right stub */}
      <div
        className="ec-ticket-stub"
        style={{
          width: 72,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.5rem 0",
          background: "rgba(220,185,90,0.025)",
        }}
      >
        {/* Admit One — vertical */}
        <span
          className="ec-ticket-admit"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            fontFamily: T.mono,
            fontSize: "0.42rem",
            letterSpacing: "0.22em",
            color: "rgba(220,185,90,0.45)",
            textTransform: "uppercase",
          }}
        >
          Admit One
        </span>

        {/* Barcode — horizontal bars for real ticket stub orientation */}
        <svg
          className="ec-ticket-barcode"
          width="36"
          height="84"
          viewBox="0 0 36 84"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ opacity: 0.66 }}
        >
          {(
            [
              [0, 1],
              [2, 1],
              [4, 2],
              [7, 1],
              [10, 2],
              [13, 1],
              [15, 2],
              [18, 1],
              [20, 2],
              [23, 1],
              [25, 2],
              [28, 1],
              [30, 2],
              [33, 1],
              [35, 2],
              [38, 1],
              [40, 2],
              [43, 1],
              [46, 2],
              [49, 1],
              [51, 2],
              [54, 1],
              [56, 2],
              [59, 1],
              [62, 2],
              [65, 1],
              [67, 2],
              [70, 1],
              [72, 2],
              [75, 1],
              [78, 1],
              [80, 2],
            ] as [number, number][]
          ).map(([y, h], i) => (
            <rect
              key={i}
              x={0}
              y={y}
              width={36}
              height={h}
              fill={`rgba(220,185,90,${[0.86, 0.52, 0.78, 0.61, 0.81, 0.46, 0.71, 0.58][i % 8]})`}
            />
          ))}
        </svg>

        {/* Seat number */}
        <span
          className="ec-ticket-seat"
          style={{
            writingMode: "vertical-rl",
            fontFamily: T.mono,
            fontSize: "0.38rem",
            letterSpacing: "0.15em",
            color: "rgba(220,185,90,0.3)",
          }}
        >
          AI·FILM·v2
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SponsorLogoCard
// ─────────────────────────────────────────────────────────────────────────────
function SponsorLogoCard({
  src,
  alt,
  kind = "dark",
  imageStyle,
  containerStyle,
}: {
  src: string;
  alt: string;
  kind?: "dark" | "light" | "purple";
  imageStyle?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
}) {
  const shellStyle: React.CSSProperties =
    kind === "light"
      ? {
          background: "rgba(255,255,255,0.94)",
          border: "1px solid rgba(255,255,255,0.55)",
        }
      : kind === "purple"
        ? {
            background: "rgba(40,35,90,0.24)",
            border: "1px solid rgba(120,115,255,0.36)",
          }
        : {
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.22)",
          };

  return (
    <div
      style={{
        borderRadius: 10,
        width: "clamp(124px, 16vw, 190px)",
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...shellStyle,
        ...containerStyle,
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          maxWidth: "82%",
          maxHeight: "72%",
          objectFit: "contain",
          display: "block",
          ...imageStyle,
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FinScene — animated Fin label + gold-amber CTA with ticket-tear hover
// ─────────────────────────────────────────────────────────────────────────────
const LUMA_EVENT_URL = "https://luma.com/0zqny709?utm_source=aif";

function FinScene() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.25rem",
          marginBottom: "1.75rem",
        }}
      >
        <div
          style={{
            flex: "0 0 80px",
            height: 1,
            background: "rgba(200,170,80,0.25)",
            transform: visible ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: "right",
            transition: "transform 1.4s cubic-bezier(0.16,1,0.3,1)",
          }}
        />
        <div
          style={{
            fontFamily: T.mono,
            fontSize: "0.55rem",
            letterSpacing: "0.55em",
            color: "rgba(200,170,80,0.35)",
            textTransform: "uppercase",
            opacity: visible ? 1 : 0,
            transition: "opacity 0.8s ease 0.6s",
          }}
        >
          Fin
        </div>
        <div
          style={{
            flex: "0 0 80px",
            height: 1,
            background: "rgba(200,170,80,0.25)",
            transform: visible ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: "left",
            transition: "transform 1.4s cubic-bezier(0.16,1,0.3,1)",
          }}
        />
      </div>
      <a
        href={LUMA_EVENT_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          position: "relative",
          overflow: "hidden",
          padding: "1.1rem 3.5rem",
          background: "rgba(198,153,58,0.15)",
          color: "rgba(248,236,188,0.95)",
          fontFamily: T.sans,
          fontWeight: 600,
          fontSize: "0.88rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          textDecoration: "none",
          cursor: "pointer",
          borderRadius: 2,
          border: "1px solid rgba(198,153,58,0.45)",
          boxShadow:
            "0 0 40px rgba(198,153,58,0.12), 0 2px 12px rgba(0,0,0,0.5)",
          animation: "projectorWarm 4s ease-in-out infinite",
          transition: "transform .16s",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            height: 1,
            borderTop: "1px dashed rgba(255,255,255,0.18)",
            pointerEvents: "none",
            opacity: hovered ? 1 : 0,
            transition: "opacity 150ms ease",
          }}
        />
        <span
          style={{
            display: "block",
            transform: hovered ? "translateY(-2px)" : "translateY(0)",
            transition: "transform 150ms ease",
          }}
        >
          Apply to Join →
        </span>
      </a>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FeaturePresentationBridge — full-vh cinematic reveal
// ─────────────────────────────────────────────────────────────────────────────
function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function FeaturePresentationBridge() {
  const ref = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const topLineLeftRef = useRef<HTMLDivElement>(null);
  const topSparkleRef = useRef<HTMLSpanElement>(null);
  const topLineRightRef = useRef<HTMLDivElement>(null);
  const bottomLineLeftRef = useRef<HTMLDivElement>(null);
  const bottomSparkleRef = useRef<HTMLSpanElement>(null);
  const bottomLineRightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rafId = 0;
    const targetVal = { current: 0 };
    const currentVal = { current: 0 };
    let started = false;

    const applyProgress = (progress: number) => {
      const topP = smoothstep(0.02, 0.55, progress);
      const titleP = smoothstep(0.04, 0.62, progress);
      const bottomP = smoothstep(0.08, 0.68, progress);

      const topLine = smoothstep(0.06, 0.88, topP);
      const topSparkle = smoothstep(0.34, 0.88, topP);
      const bottomLine = smoothstep(0.06, 0.88, bottomP);
      const bottomSparkle = smoothstep(0.34, 0.88, bottomP);

      if (titleRef.current) {
        titleRef.current.style.opacity = String(titleP);
        titleRef.current.style.transform = `translateY(${(1 - titleP) * 24}px) scale(${0.975 + titleP * 0.025})`;
      }
      if (topLineLeftRef.current) {
        topLineLeftRef.current.style.transform = `scaleX(${topLine})`;
        topLineLeftRef.current.style.opacity = String(0.35 + topLine * 0.65);
      }
      if (topSparkleRef.current)
        topSparkleRef.current.style.opacity = String(topSparkle);
      if (topLineRightRef.current) {
        topLineRightRef.current.style.transform = `scaleX(${topLine})`;
        topLineRightRef.current.style.opacity = String(0.35 + topLine * 0.65);
      }
      if (bottomLineLeftRef.current) {
        bottomLineLeftRef.current.style.transform = `scaleX(${bottomLine})`;
        bottomLineLeftRef.current.style.opacity = String(
          0.35 + bottomLine * 0.65,
        );
      }
      if (bottomSparkleRef.current)
        bottomSparkleRef.current.style.opacity = String(bottomSparkle);
      if (bottomLineRightRef.current) {
        bottomLineRightRef.current.style.transform = `scaleX(${bottomLine})`;
        bottomLineRightRef.current.style.opacity = String(
          0.35 + bottomLine * 0.65,
        );
      }
    };

    const updateTarget = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      targetVal.current = clamp01(
        (vh * 1.15 - rect.top) / (vh * 1.15 - vh * 0.22),
      );
    };

    const tick = () => {
      rafId = window.requestAnimationFrame(tick);
      const next =
        currentVal.current + (targetVal.current - currentVal.current) * 0.22;
      currentVal.current =
        Math.abs(targetVal.current - next) < 0.0008 ? targetVal.current : next;
      applyProgress(currentVal.current);
    };

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          obs.disconnect();
          updateTarget();
          tick();
          window.addEventListener("scroll", updateTarget, { passive: true });
          window.addEventListener("resize", updateTarget);
        }
      },
      { threshold: 0.01, rootMargin: "0px 0px 20% 0px" },
    );
    obs.observe(el);

    return () => {
      obs.disconnect();
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", updateTarget);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      id="feature-presentation"
      ref={ref}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        gap: "1.5rem",
        background: "#000",
      }}
    >
      {/* Top rule */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
          width: "min(600px, 84vw)",
        }}
      >
        <div
          ref={topLineLeftRef}
          style={{
            flex: 1,
            height: "0.5px",
            background:
              "linear-gradient(90deg, transparent, rgba(198,153,58,0.8))",
            transform: "scaleX(0)",
            transformOrigin: "right",
            opacity: 0.35,
            willChange: "transform",
          }}
        />
        <span
          ref={topSparkleRef}
          style={{
            fontFamily: "monospace",
            fontSize: "0.5rem",
            color: "rgba(198,153,58,0.45)",
            opacity: 0,
            willChange: "opacity",
          }}
        >
          ✦
        </span>
        <div
          ref={topLineRightRef}
          style={{
            flex: 1,
            height: "0.5px",
            background:
              "linear-gradient(90deg, rgba(198,153,58,0.8), transparent)",
            transform: "scaleX(0)",
            transformOrigin: "left",
            opacity: 0.35,
            willChange: "transform",
          }}
        />
      </div>

      <div
        ref={titleRef}
        style={{
          fontFamily: "'IBM Plex Serif', Georgia, serif",
          fontSize: "clamp(1.45rem, 3.1vw, 2.7rem)",
          fontWeight: 300,
          color: "rgba(232,213,163,0.96)",
          letterSpacing: "clamp(0.14em, 1vw, 0.32em)",
          textTransform: "uppercase",
          textAlign: "center",
          textShadow:
            "0 0 36px rgba(198,153,58,0.2), 0 0 72px rgba(198,153,58,0.08)",
          opacity: 0,
          willChange: "opacity, transform",
        }}
      >
        Feature Presentation
      </div>

      {/* Bottom rule (flipped) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
          width: "min(600px, 84vw)",
        }}
      >
        <div
          ref={bottomLineLeftRef}
          style={{
            flex: 1,
            height: "0.5px",
            background:
              "linear-gradient(90deg, rgba(198,153,58,0.8), transparent)",
            transform: "scaleX(0)",
            transformOrigin: "left",
            opacity: 0.35,
            willChange: "transform",
          }}
        />
        <span
          ref={bottomSparkleRef}
          style={{
            fontFamily: "monospace",
            fontSize: "0.5rem",
            color: "rgba(198,153,58,0.45)",
            opacity: 0,
            willChange: "opacity",
          }}
        >
          ✦
        </span>
        <div
          ref={bottomLineRightRef}
          style={{
            flex: 1,
            height: "0.5px",
            background:
              "linear-gradient(90deg, transparent, rgba(198,153,58,0.8))",
            transform: "scaleX(0)",
            transformOrigin: "right",
            opacity: 0.35,
            willChange: "transform",
          }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EventContent
// ─────────────────────────────────────────────────────────────────────────────

const EventContent: React.FC = () => {
  return (
    <div
      className="ec-content-shell"
      style={{
        background: "#000",
        fontFamily: T.sans,
      }}
    >
      {/* ── Feature Presentation bridge ──────────────────────────────────── */}
      <FeaturePresentationBridge />

      {/* ════════════════════════════════════════════════════════════════════
          MANIFESTO — full-bleed cinematic opening statement
          ════════════════════════════════════════════════════════════════════ */}
      <SectionReveal>
        <div
          className="ec-manifesto-card"
          style={{
            borderTop: `1px solid ${T.border}`,
            borderBottom: `1px solid ${T.border}`,
            padding: "5rem 2.5rem",
            maxWidth: 860,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: T.mono,
              fontSize: "0.55rem",
              letterSpacing: "0.45em",
              color: "rgba(200,170,80,0.4)",
              textTransform: "uppercase",
              marginBottom: "2.5rem",
            }}
          >
            The Pitch
          </div>
          <p
            style={{
              fontFamily: T.serif,
              fontSize: "clamp(1.35rem, 2.8vw, 2rem)",
              fontWeight: 300,
              fontStyle: "italic",
              color: "rgba(248,236,188,0.82)",
              lineHeight: 1.65,
              margin: "0 0 2rem",
              letterSpacing: "0.01em",
            }}
          >
            "You walk in on Saturday morning. By Sunday afternoon, your film is
            on a cinema screen. You made it. It didn't exist 24 hours ago."
          </p>
          <p
            style={{
              fontFamily: T.sans,
              fontSize: "clamp(0.9rem, 1.4vw, 1.05rem)",
              fontWeight: 300,
              color: "rgba(255,255,255,0.42)",
              lineHeight: 1.8,
              maxWidth: 620,
              margin: "0 auto",
            }}
          >
            Most people never get their work on a cinema screen. This weekend,
            you do. We give you the tools, the equipment, the workshops, and the
            time. AI handles what used to need a full crew and months of post.
            You bring the story, the instincts, and the drive to see it through.
            Dublin, April. One weekend. A film that's yours.
          </p>
        </div>
      </SectionReveal>

      {/* ── Stats strip ──────────────────────────────────────────────────── */}
      <div
        className="ec-stats-strip"
        style={{
          borderTop: `1px solid ${T.border}`,
          borderBottom: `1px solid ${T.border}`,
          padding: "0.9rem 3rem",
          display: "flex",
          alignItems: "center",
          gap: "2rem",
          overflowX: "auto",
          whiteSpace: "nowrap",
        }}
      >
        {[
          "YOUR FILM · CINEMA SCREEN",
          "24 HRS FILMMAKING",
          "100 MAKERS",
          "DOGPATCH LABS · DUBLIN",
          "18–19 APR 2026",
          "AI FILM · v2",
        ].map((item, i) => (
          <React.Fragment key={item}>
            <span
              style={{
                fontFamily: T.mono,
                fontSize: "0.65rem",
                letterSpacing: "0.22em",
                color: i === 0 ? "rgba(200,170,80,0.55)" : T.muted,
                textTransform: "uppercase",
                flexShrink: 0,
              }}
            >
              {item}
            </span>
            {i < 5 && (
              <div
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: "50%",
                  background: T.border,
                  flexShrink: 0,
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 01 — EVENT OVERVIEW
          ════════════════════════════════════════════════════════════════════ */}
      <section
        className="ec-programme-section"
        style={{
          maxWidth: 1160,
          margin: "0 auto",
          padding: "6rem 2.5rem 5rem",
        }}
      >
        <SectionReveal>
          <SectionLabel no="01" title="The Brief" />
        </SectionReveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gap: "5rem",
            alignItems: "start",
          }}
          className="ec-overview-grid"
        >
          {/* Left — title + copy + CTA */}
          <div>
            <SectionReveal delay={0.05}>
              <h1
                style={{
                  fontFamily: T.serif,
                  fontSize: "clamp(2.8rem, 6vw, 5rem)",
                  fontWeight: 700,
                  color: T.gold,
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  margin: "0 0 1.5rem",
                  textShadow:
                    "0 0 40px rgba(255,215,60,0.28), 0 4px 120px rgba(255,200,40,0.18), 0 -2px 60px rgba(255,230,100,0.12)",
                }}
              >
                The Shot Didn't
                <br />
                <span
                  style={{
                    fontWeight: 300,
                    fontStyle: "italic",
                    fontSize: "0.82em",
                  }}
                >
                  Exist Yesterday
                </span>
              </h1>
            </SectionReveal>

            <SectionReveal delay={0.15}>
              <p
                style={{
                  fontFamily: T.sans,
                  fontWeight: 300,
                  fontStyle: "italic",
                  fontSize: "clamp(1rem, 1.6vw, 1.15rem)",
                  color: "rgba(255,255,255,0.52)",
                  lineHeight: 1.75,
                  maxWidth: 480,
                  margin: "0 0 2.75rem",
                }}
              >
                This is your shot to make a short film — a real one, with your
                name on it, screened in front of an audience. AI has collapsed
                the barrier between having a story in your head and putting it
                on screen. A filmmaker and an engineer, working together for one
                weekend, can now do what used to take a full crew and a budget.
                Come make it happen.
              </p>
            </SectionReveal>

            <SectionReveal delay={0.25}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1.25rem",
                  flexWrap: "wrap",
                }}
              >
                <a
                  href={LUMA_EVENT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full px-6 py-3 md:px-8 md:py-3.5 text-sm font-medium hover:scale-105 transition-all duration-300 whitespace-nowrap no-underline"
                  style={{ background: "#E0D5C0", color: "#050505" }}
                >
                  Apply to Join →
                </a>
                <a
                  href="https://giveago.co/sponsor"
                  style={{
                    display: "inline-block",
                    padding: "0.95rem 2.25rem",
                    border: `1px solid ${T.border}`,
                    color: "rgba(248,236,188,0.65)",
                    fontFamily: T.sans,
                    fontSize: "0.85rem",
                    letterSpacing: "0.06em",
                    textDecoration: "none",
                    borderRadius: 2,
                    transition: "border-color .2s, color .2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "rgba(200,170,80,0.5)";
                    (e.currentTarget as HTMLElement).style.color = T.gold;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      T.border;
                    (e.currentTarget as HTMLElement).style.color =
                      "rgba(248,236,188,0.65)";
                  }}
                >
                  Sponsor
                </a>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.35}>
              <div
                style={{
                  marginTop: "2.5rem",
                  paddingTop: "2rem",
                  borderTop: `1px solid ${T.dim}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.6rem",
                }}
              >
                <div
                  style={{
                    fontFamily: T.mono,
                    fontSize: "0.55rem",
                    letterSpacing: "0.18em",
                    color: "rgba(200,170,80,0.5)",
                    textTransform: "uppercase",
                  }}
                >
                  Applications close 1 April 2026
                </div>
                <div
                  style={{
                    fontFamily: T.mono,
                    fontSize: "0.52rem",
                    letterSpacing: "0.12em",
                    color: T.muted,
                    textTransform: "uppercase",
                  }}
                >
                  Bring your laptop — cameras, AI tools &amp; gear are provided
                </div>
                <div
                  style={{
                    fontFamily: T.mono,
                    fontSize: "0.52rem",
                    letterSpacing: "0.18em",
                    color: T.muted,
                    textTransform: "uppercase",
                    marginTop: "0.4rem",
                  }}
                >
                  Black-tie premiere · Sunday afternoon
                </div>
                <div
                  style={{
                    fontFamily: T.mono,
                    fontSize: "0.52rem",
                    letterSpacing: "0.18em",
                    color: T.muted,
                    textTransform: "uppercase",
                    marginTop: "0.4rem",
                  }}
                >
                  Organised by Give(a)Go &amp; Napkin
                </div>
              </div>
            </SectionReveal>
          </div>

          {/* Right — info cards */}
          <SectionReveal
            delay={0.2}
            style={{ display: "flex", flexDirection: "column", gap: "1px" }}
          >
            {/* Film countdown decoration */}
            <div
              style={{
                fontFamily: T.mono,
                fontSize: "0.55rem",
                letterSpacing: "0.5em",
                color: "rgba(200,170,80,0.18)",
                marginBottom: "1.5rem",
                textTransform: "uppercase",
              }}
            >
              3 . . . 2 . . . 1
            </div>
            <InfoCard
              label="Date"
              value="18–19 Apr 2026"
              sub="Saturday & Sunday"
            />
            <InfoCard
              label="Venue"
              value="Dogpatch Labs"
              sub="CHQ Building, Digital Docklands, Dublin"
            />
            <InfoCard
              label="Capacity"
              value="100 People"
              sub="By application · closes 1 Apr 2026"
            />
            <InfoCard
              label="The Screening"
              value="Cinema Premiere"
              sub="Black-tie · judging panel · awards ceremony"
            />
          </SectionReveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          WHO BELONGS HERE — profile cards
          ════════════════════════════════════════════════════════════════════ */}
      <section
        style={{ maxWidth: 1160, margin: "0 auto", padding: "0 2.5rem 6rem" }}
      >
        <SectionReveal>
          <div
            style={{
              fontFamily: T.mono,
              fontSize: "0.55rem",
              letterSpacing: "0.4em",
              color: "rgba(200,170,80,0.4)",
              textTransform: "uppercase",
              marginBottom: "3rem",
              textAlign: "center",
            }}
          >
            Cast call
          </div>
        </SectionReveal>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1px",
            border: `1px solid ${T.border}`,
          }}
        >
          {[
            {
              role: "The Filmmaker",
              description:
                "You've shot things. You know pacing, you know story, you know when a frame is wrong. You've never had tools like these.",
              cue: "Bring your eye.",
            },
            {
              role: "The Engineer",
              description:
                "You build things fast. You know what these models can do — and you've been waiting for a reason to push them somewhere creative.",
              cue: "Bring your instincts.",
            },
            {
              role: "The Editor",
              description:
                "You live in the cut. You know that a film is made three times — in writing, on set, and in the edit. You're about to do all three in one day.",
              cue: "Bring your taste.",
            },
            {
              role: "The Designer",
              description:
                "You think in frames, in mood, in visual language. You've always had something cinematic in you. This is the reason to go there.",
              cue: "Bring your world.",
            },
          ].map((p) => (
            <SectionReveal key={p.role} delay={0.1}>
              <div
                style={{
                  padding: "2.5rem 2rem",
                  background: T.cardBg,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  borderRight: `1px solid ${T.border}`,
                }}
              >
                <div
                  style={{
                    fontFamily: T.serif,
                    fontSize: "1.15rem",
                    fontWeight: 600,
                    color: T.gold,
                    letterSpacing: "0.01em",
                  }}
                >
                  {p.role}
                </div>
                <p
                  style={{
                    fontFamily: T.sans,
                    fontSize: "0.875rem",
                    color: "rgba(255,255,255,0.45)",
                    lineHeight: 1.7,
                    margin: 0,
                    flex: 1,
                  }}
                >
                  {p.description}
                </p>
                <div
                  style={{
                    fontFamily: T.mono,
                    fontSize: "0.55rem",
                    letterSpacing: "0.2em",
                    color: "rgba(200,170,80,0.5)",
                    textTransform: "uppercase",
                  }}
                >
                  {p.cue}
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      <FilmStrip />

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 02 — THE PROGRAMME
          ════════════════════════════════════════════════════════════════════ */}
      <section
        style={{
          maxWidth: 1160,
          margin: "0 auto",
          padding: "5rem 2.5rem",
        }}
      >
        <SectionReveal>
          <SectionLabel no="02" title="The Programme" />
        </SectionReveal>

        <SectionReveal delay={0.05}>
          <h2
            style={{
              fontFamily: T.serif,
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              fontWeight: 700,
              color: T.gold,
              letterSpacing: "0.01em",
              margin: "0 0 3.5rem",
              lineHeight: 1.1,
            }}
          >
            Make It Saturday.
            <br />
            Screen It Sunday.
          </h2>
        </SectionReveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2rem",
          }}
          className="ec-ticket-grid"
        >
          <SectionReveal delay={0.1} style={{ height: "100%" }}>
            <TicketCard
              day="Day 01 · Sat 18 Apr"
              scene="Scene 01 / Take 01"
              title="Film Production Day"
              description="11am kick-off. 24 hours to make a short film. Workshops throughout. Equipment and frontier AI tools provided. The brief is yours."
              meta1="Starts: 11:00 AM"
              meta2="Equipment & tools provided"
            />
          </SectionReveal>
          <SectionReveal delay={0.2} style={{ height: "100%" }}>
            <TicketCard
              day="Day 02 · Sun 19 Apr"
              scene="Scene 02 / Take 01"
              title="Premiere Day"
              description="Submit in the morning. Get dressed. Lights down — your film on a cinema screen, in front of the room that watched it get made. Judges score. Awards announced."
              meta1="Submissions: Morning"
              meta2="Black-tie screening: Afternoon"
              badge="Now Showing"
            />
          </SectionReveal>
        </div>
      </section>

      <FilmStrip />

      {/* ════════════════════════════════════════════════════════════════════
          SECTION — SPONSORS (Made Possible By)
          ════════════════════════════════════════════════════════════════════ */}
      <section
        className="ec-credits-section"
        style={{
          maxWidth: 1160,
          margin: "0 auto",
          padding: "5rem 2.5rem",
        }}
      >
        <SectionReveal>
          <SectionLabel no="03" title="The Credits" />
        </SectionReveal>

        <SectionReveal delay={0.05}>
          <h2
            style={{
              fontFamily: T.serif,
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              fontWeight: 700,
              color: T.gold,
              margin: "0 0 1.25rem",
              lineHeight: 1.1,
              textAlign: "center",
            }}
          >
            Made Possible By
          </h2>
        </SectionReveal>

        <SectionReveal delay={0.08}>
          <p
            style={{
              margin: "0 0 3.75rem",
              textAlign: "center",
              fontFamily: T.mono,
              fontSize: "0.56rem",
              letterSpacing: "0.28em",
              color: "rgba(220,185,90,0.45)",
              textTransform: "uppercase",
            }}
          >
            End credits for the makers backing this weekend
          </p>
        </SectionReveal>

        <div
          className="ec-credits-stack"
          style={{ display: "flex", flexDirection: "column", gap: "3.2rem" }}
        >
          <SectionReveal delay={0.1}>
            <div className="ec-credits-row">
              <div
                style={{
                  fontFamily: T.mono,
                  fontSize: "0.56rem",
                  letterSpacing: "0.35em",
                  color: T.amberDim,
                  textTransform: "uppercase",
                  marginBottom: "1.6rem",
                  textAlign: "center",
                }}
              >
                Supported By
              </div>
              <div className="ec-credits-logos">
                <a
                  href="https://elevenlabs.io"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className="ec-credit-logo"
                    src="/partners/elevenlabs-logo-white.svg"
                    alt="ElevenLabs"
                  />
                </a>
                <a
                  href="https://wan.video"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className="ec-credit-logo"
                    src="/partners/wan.png"
                    alt="Wan"
                  />
                </a>
                <a
                  href="https://fal.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className="ec-credit-logo ec-credit-logo--invert"
                    src="/partners/fal-ai.svg"
                    alt="fal.ai"
                  />
                </a>
                <a
                  href="https://wolfpackdigital.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className="ec-credit-logo"
                    src="/partners/wolfpack-digital-light.png"
                    alt="Wolfpack Digital"
                  />
                </a>
              </div>
            </div>
          </SectionReveal>

          <div
            className="ec-credits-divider"
            style={{ display: "flex", alignItems: "center", gap: "1rem" }}
          >
            <div
              style={{
                flex: 1,
                height: 1,
                background:
                  "linear-gradient(90deg, transparent, rgba(220,185,90,0.24))",
              }}
            />
            <ReelIcon />
            <div
              style={{
                flex: 1,
                height: 1,
                background:
                  "linear-gradient(90deg, rgba(220,185,90,0.24), transparent)",
              }}
            />
          </div>

          <SectionReveal delay={0.2}>
            <div className="ec-credits-row">
              <div
                style={{
                  fontFamily: T.mono,
                  fontSize: "0.56rem",
                  letterSpacing: "0.35em",
                  color: T.amberDim,
                  textTransform: "uppercase",
                  marginBottom: "1.6rem",
                  textAlign: "center",
                }}
              >
                Fueled By
              </div>
              <div className="ec-credits-logos">
                <a
                  href="https://www.redbull.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className="ec-credit-logo"
                    src="/partners/redbull.png"
                    alt="Red Bull"
                  />
                </a>
              </div>
            </div>
          </SectionReveal>

          <div
            className="ec-credits-divider"
            style={{ display: "flex", alignItems: "center", gap: "1rem" }}
          >
            <div
              style={{
                flex: 1,
                height: 1,
                background:
                  "linear-gradient(90deg, transparent, rgba(220,185,90,0.24))",
              }}
            />
            <ReelIcon />
            <div
              style={{
                flex: 1,
                height: 1,
                background:
                  "linear-gradient(90deg, rgba(220,185,90,0.24), transparent)",
              }}
            />
          </div>

          <SectionReveal delay={0.25}>
            <div className="ec-credits-row">
              <div
                style={{
                  fontFamily: T.mono,
                  fontSize: "0.56rem",
                  letterSpacing: "0.35em",
                  color: T.amberDim,
                  textTransform: "uppercase",
                  marginBottom: "1.6rem",
                  textAlign: "center",
                }}
              >
                Organised By
              </div>
              <div className="ec-credits-names">
                <span>Give(a)Go</span>
                <span className="ec-credits-dot">·</span>
                <span>Napkin</span>
              </div>
            </div>
          </SectionReveal>
        </div>

        <SectionReveal delay={0.4}>
          <div
            className="ec-credits-cta"
            style={{
              marginTop: "3.5rem",
              paddingTop: "2.5rem",
              borderTop: `1px solid ${T.dim}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1.5rem",
            }}
          >
            <p
              style={{
                fontFamily: T.sans,
                fontStyle: "italic",
                fontSize: "0.85rem",
                color: T.muted,
                margin: 0,
              }}
            >
              More sponsors to be announced
            </p>
            <a
              href="mailto:hello@giveago.io"
              style={{
                display: "inline-block",
                padding: "0.75rem 2rem",
                border: `1px solid ${T.border}`,
                color: "rgba(248,236,188,0.7)",
                fontFamily: T.sans,
                fontSize: "0.82rem",
                letterSpacing: "0.05em",
                textDecoration: "none",
                borderRadius: 2,
                transition: "border-color .2s, color .2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(200,170,80,0.5)";
                (e.currentTarget as HTMLElement).style.color = T.gold;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = T.border;
                (e.currentTarget as HTMLElement).style.color =
                  "rgba(248,236,188,0.7)";
              }}
            >
              Become a Sponsor →
            </a>
          </div>
        </SectionReveal>
      </section>

      <FilmStrip />

      {/* ════════════════════════════════════════════════════════════════════
          AWARDS
          ════════════════════════════════════════════════════════════════════ */}
      <section
        style={{ maxWidth: 1160, margin: "0 auto", padding: "5rem 2.5rem" }}
      >
        <SectionReveal>
          <SectionLabel no="03" title="The Awards" />
        </SectionReveal>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            alignItems: "start",
          }}
          className="ec-overview-grid"
        >
          <SectionReveal delay={0.05}>
            <h2
              style={{
                fontFamily: T.serif,
                fontSize: "clamp(2rem,4vw,3rem)",
                fontWeight: 700,
                color: T.gold,
                lineHeight: 1.1,
                margin: "0 0 1.25rem",
              }}
            >
              Films will be
              <br />
              <span style={{ fontWeight: 300, fontStyle: "italic" }}>
                judged and awarded.
              </span>
            </h2>
            <p
              style={{
                fontFamily: T.sans,
                fontSize: "0.95rem",
                color: "rgba(255,255,255,0.42)",
                lineHeight: 1.8,
                margin: "0 0 2.5rem",
              }}
            >
              On Day 2, a panel of judges from the film and technology world
              will select winners across categories. Awards to be announced in
              the run-up to the event.
            </p>
            <div
              style={{
                fontFamily: T.mono,
                fontSize: "0.55rem",
                letterSpacing: "0.25em",
                color: "rgba(200,170,80,0.4)",
                textTransform: "uppercase",
              }}
            >
              Judges · To be announced
            </div>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1px" }}
            >
              {[
                {
                  cat: "Best Film",
                  desc: "The complete package — story, execution, and impact.",
                },
                {
                  cat: "Best Direction",
                  desc: "The clearest creative vision brought to screen.",
                },
                {
                  cat: "Best Use of AI",
                  desc: "The most inventive, unexpected application of the tools.",
                },
                {
                  cat: "Best Score & Sound",
                  desc: "Audio that makes the film feel bigger than it is.",
                },
                {
                  cat: "People's Choice",
                  desc: "Voted by the room on premiere night.",
                },
              ].map((a) => (
                <div
                  key={a.cat}
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "1.25rem",
                    padding: "1.1rem 1.25rem",
                    border: `1px solid ${T.border}`,
                    background: T.cardBg,
                  }}
                >
                  <div
                    style={{
                      fontFamily: T.serif,
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      color: T.gold,
                      whiteSpace: "nowrap",
                      minWidth: 130,
                    }}
                  >
                    {a.cat}
                  </div>
                  <div
                    style={{
                      fontFamily: T.sans,
                      fontSize: "0.8rem",
                      color: "rgba(255,255,255,0.38)",
                      lineHeight: 1.5,
                    }}
                  >
                    {a.desc}
                  </div>
                </div>
              ))}
              <div
                style={{
                  padding: "1rem 1.25rem",
                  border: `1px solid ${T.border}`,
                  fontFamily: T.mono,
                  fontSize: "0.52rem",
                  letterSpacing: "0.2em",
                  color: "rgba(200,170,80,0.3)",
                  textTransform: "uppercase",
                  textAlign: "center",
                }}
              >
                Additional awards to be announced
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      <FilmStrip />

      {/* ════════════════════════════════════════════════════════════════════
          V1 RECAP — proof it happened, proof it was real
          ════════════════════════════════════════════════════════════════════ */}
      <section
        style={{
          maxWidth: 1160,
          margin: "0 auto",
          padding: "5rem 2.5rem",
        }}
      >
        <SectionReveal>
          <SectionLabel no="03" title="Last Edition" />
        </SectionReveal>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            alignItems: "center",
          }}
          className="ec-overview-grid"
        >
          <SectionReveal delay={0.05}>
            <div>
              <h2
                style={{
                  fontFamily: T.serif,
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 700,
                  color: T.gold,
                  lineHeight: 1.1,
                  letterSpacing: "-0.01em",
                  margin: "0 0 1.5rem",
                }}
              >
                V1 proved it was possible.
              </h2>
              <p
                style={{
                  fontFamily: T.sans,
                  fontSize: "clamp(0.9rem, 1.4vw, 1.05rem)",
                  fontWeight: 300,
                  color: "rgba(255,255,255,0.45)",
                  lineHeight: 1.8,
                  margin: "0 0 2rem",
                }}
              >
                At the first edition, teams of filmmakers and engineers made
                complete short films from scratch in under 24 hours — stories
                with real cinematography, AI-generated sequences, original
                scores, and actual emotional weight. Then they screened them in
                a room full of people who'd watched them get made.
              </p>
              <a
                href="https://www.youtube.com/shorts/sd-EOweCCzM"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontFamily: T.mono,
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(200,170,80,0.7)",
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(200,170,80,0.25)",
                  paddingBottom: "0.2rem",
                  transition: "color 0.2s, border-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = T.gold;
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(200,170,80,0.6)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    "rgba(200,170,80,0.7)";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(200,170,80,0.25)";
                }}
              >
                Watch the V1 recap ↗
              </a>
            </div>
          </SectionReveal>
          <SectionReveal delay={0.15}>
            <a
              href="https://www.youtube.com/shorts/sd-EOweCCzM"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                position: "relative",
                border: `1px solid ${T.border}`,
                overflow: "hidden",
                aspectRatio: "16/9",
                background: "#050505",
              }}
            >
              {/* YouTube thumbnail */}
              <img
                src="https://img.youtube.com/vi/sd-EOweCCzM/hqdefault.jpg"
                alt="V1 Recap"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: 0.65,
                }}
              />
              {/* Dark overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.35)",
                }}
              />
              {/* Centred play + label */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.75rem",
                  zIndex: 1,
                }}
              >
                {/* Play button */}
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    border: `1px solid rgba(220,185,90,0.55)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(0,0,0,0.55)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M6 4l9 5-9 5V4z" fill="rgba(220,185,90,0.9)" />
                  </svg>
                </div>
                <div
                  style={{
                    fontFamily: T.mono,
                    fontSize: "0.52rem",
                    letterSpacing: "0.3em",
                    color: "rgba(220,185,90,0.7)",
                    textTransform: "uppercase",
                    background: "rgba(0,0,0,0.5)",
                    padding: "0.25rem 0.6rem",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  AI Filmmaking Hackathon v1 · Recap
                </div>
              </div>
              {/* Film grain overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
                  backgroundSize: "200px",
                  pointerEvents: "none",
                }}
              />
            </a>
          </SectionReveal>
        </div>

        {/* V1 Winner Films */}
        <div style={{ marginTop: "4rem" }}>
          <SectionReveal delay={0.05}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "2rem",
              }}
            >
              <span
                style={{
                  fontFamily: T.mono,
                  fontSize: "0.6rem",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "rgba(200,170,80,0.5)",
                }}
              >
                V1 Winning Films
              </span>
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: "rgba(200,170,80,0.15)",
                }}
              />
            </div>
          </SectionReveal>
          {/* Film strip wrapper */}
          <div style={{ position: "relative" }}>
            {/* Sprocket strip — top */}
            {["top", "bottom"].map((pos) => (
              <div
                key={pos}
                style={{
                  position: "absolute",
                  [pos]: 0,
                  left: 0,
                  right: 0,
                  height: 22,
                  background: "#000",
                  borderTop:
                    pos === "top" ? `1px solid rgba(200,170,80,0.18)` : "none",
                  borderBottom:
                    pos === "bottom"
                      ? `1px solid rgba(200,170,80,0.18)`
                      : "none",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 6,
                  gap: 6,
                  zIndex: 2,
                  overflow: "hidden",
                }}
              >
                {Array.from({ length: 100 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: 14,
                      height: 10,
                      borderRadius: 2,
                      border: "1px solid rgba(200,170,80,0.22)",
                      flexShrink: 0,
                    }}
                  />
                ))}
              </div>
            ))}
            {/* Cards with padding for the sprocket strips */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 0,
                paddingTop: 22,
                paddingBottom: 22,
                border: `1px solid rgba(200,170,80,0.18)`,
              }}
              className="ec-winner-grid"
            >
              {[
                {
                  award: "Best Film",
                  title: "Watch Short Film",
                  team: "V1 · 2025",
                  href: "https://www.youtube.com/watch?v=-AWdaaZwG2g",
                  thumb: "https://img.youtube.com/vi/-AWdaaZwG2g/hqdefault.jpg",
                },
                {
                  award: "Best Use of AI",
                  title: "Watch Short Film",
                  team: "V1 · 2025",
                  href: "https://www.youtube.com/watch?v=Cqe3y_rpYe4",
                  thumb: "https://img.youtube.com/vi/Cqe3y_rpYe4/hqdefault.jpg",
                },
                {
                  award: "People's Choice",
                  title: "Watch Short Film",
                  team: "V1 · 2025",
                  href: "https://www.youtube.com/watch?v=qfPQ3Kw1img",
                  thumb: "https://img.youtube.com/vi/qfPQ3Kw1img/hqdefault.jpg",
                },
              ].map(({ award, title, team, href, thumb }, i) => (
                <SectionReveal key={award} delay={0.05 + i * 0.08}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "block",
                      position: "relative",
                      aspectRatio: "3/4",
                      borderRight:
                        i < 2 ? `1px solid rgba(200,170,80,0.15)` : "none",
                      background: "#050505",
                      overflow: "hidden",
                      textDecoration: "none",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "rgba(200,170,80,0.4)";
                      const overlay = (
                        e.currentTarget as HTMLElement
                      ).querySelector(".film-card-overlay") as HTMLElement;
                      if (overlay) overlay.style.opacity = "1";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        T.border;
                      const overlay = (
                        e.currentTarget as HTMLElement
                      ).querySelector(".film-card-overlay") as HTMLElement;
                      if (overlay) overlay.style.opacity = "0";
                    }}
                  >
                    {/* YouTube thumbnail as card background */}
                    <img
                      src={thumb}
                      alt={award}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                        opacity: 0.72,
                        zIndex: 0,
                      }}
                    />
                    {/* Dark overlay for legibility */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.6) 100%)",
                        zIndex: 1,
                      }}
                    />
                    {/* Award badge */}
                    <div
                      style={{
                        position: "absolute",
                        top: "1rem",
                        left: "1rem",
                        fontFamily: T.mono,
                        fontSize: "0.52rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "rgba(220,185,90,0.95)",
                        background: "rgba(5,5,5,0.75)",
                        padding: "0.35rem 0.6rem",
                        backdropFilter: "blur(6px)",
                        zIndex: 3,
                      }}
                    >
                      {award}
                    </div>
                    {/* Film grain */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
                        backgroundSize: "150px",
                        pointerEvents: "none",
                        zIndex: 2,
                      }}
                    />
                    {/* Play icon center */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 3,
                      }}
                    >
                      <div
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: "50%",
                          border: "1px solid rgba(220,185,90,0.5)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "rgba(0,0,0,0.55)",
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M5 3l10 5-10 5V3z"
                            fill="rgba(220,185,90,0.9)"
                          />
                        </svg>
                      </div>
                    </div>
                    {/* Hover overlay */}
                    <div
                      className="film-card-overlay"
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(220,185,90,0.06)",
                        opacity: 0,
                        transition: "opacity 0.3s",
                        zIndex: 4,
                      }}
                    />
                    {/* Bottom info */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: "2rem 1.2rem 1.2rem",
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)",
                        zIndex: 5,
                      }}
                    >
                      <div
                        style={{
                          fontFamily: T.serif,
                          fontSize: "clamp(0.95rem, 1.5vw, 1.15rem)",
                          fontWeight: 600,
                          color: T.gold,
                          marginBottom: "0.3rem",
                          lineHeight: 1.2,
                        }}
                      >
                        {title}
                      </div>
                      <div
                        style={{
                          fontFamily: T.mono,
                          fontSize: "0.52rem",
                          letterSpacing: "0.18em",
                          textTransform: "uppercase",
                          color: "rgba(255,255,255,0.3)",
                        }}
                      >
                        {team}
                      </div>
                    </div>
                  </a>
                </SectionReveal>
              ))}
            </div>
            {/* end ec-winner-grid */}
          </div>
          {/* end film strip wrapper */}
        </div>

        {/* V1 Voices — quote cards */}
        <div style={{ marginTop: "4.5rem" }}>
          <SectionReveal delay={0.05}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "2.5rem",
              }}
            >
              <span
                style={{
                  fontFamily: T.mono,
                  fontSize: "0.6rem",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "rgba(200,170,80,0.5)",
                }}
              >
                What people said
              </span>
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: "rgba(200,170,80,0.15)",
                }}
              />
            </div>
          </SectionReveal>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1.5rem",
            }}
            className="ec-quotes-grid"
          >
            {[
              {
                quote:
                  "This is what community and innovation are all about. It was fantastic to see such a brilliant mix of creatives and engineers come together. We were thrilled to be involved. Congratulations!",
                name: "V1 Partner",
                role: "Supporting Organisation",
              },
              {
                quote:
                  "AI Film Hackathon was as brilliant as it was challenging! As someone heading into it with limited experience of AI tools — it was a case of try, fail, learn, repeat... on speed!",
                name: "V1 Participant",
                role: "First-Time AI Filmmaker",
              },
              {
                quote:
                  "As someone researching generative AI, it was interesting to see how it all works from the creative side, collaborating with filmmakers and artists on making a short Halloween-themed film.",
                name: "V1 Participant",
                role: "Generative AI Researcher",
              },
            ].map(({ quote, name, role }, i) => (
              <SectionReveal key={i} delay={0.05 + i * 0.08}>
                <div
                  style={{
                    border: `1px solid ${T.border}`,
                    padding: "2rem 1.75rem",
                    background: T.cardBg,
                    height: "100%",
                  }}
                >
                  {/* Opening quote mark */}
                  <div
                    style={{
                      fontFamily: T.serif,
                      fontSize: "3rem",
                      lineHeight: 1,
                      color: "rgba(200,170,80,0.2)",
                      marginBottom: "0.75rem",
                      marginTop: "-0.5rem",
                    }}
                  >
                    "
                  </div>
                  <p
                    style={{
                      fontFamily: T.serif,
                      fontSize: "clamp(0.9rem, 1.3vw, 1.05rem)",
                      fontWeight: 400,
                      fontStyle: "italic",
                      color: "rgba(255,255,255,0.65)",
                      lineHeight: 1.65,
                      margin: "0 0 1.5rem",
                    }}
                  >
                    {quote}
                  </p>
                  <div
                    style={{
                      borderTop: `1px solid ${T.border}`,
                      paddingTop: "1rem",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: T.sans,
                        fontSize: "0.8rem",
                        color: "rgba(255,255,255,0.55)",
                        fontWeight: 500,
                      }}
                    >
                      {name}
                    </div>
                    <div
                      style={{
                        fontFamily: T.mono,
                        fontSize: "0.55rem",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "rgba(200,170,80,0.45)",
                        marginTop: "0.3rem",
                      }}
                    >
                      {role}
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer CTA ───────────────────────────────────────────────────── */}
      <footer
        style={{
          padding: "5rem 2.5rem 4.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          background:
            "radial-gradient(ellipse 55% 35% at 50% 100%, rgba(255,215,60,0.04) 0%, transparent 70%)",
        }}
      >
        <SectionReveal>
          <FinScene />
          <div
            style={{
              fontFamily: T.serif,
              fontSize: "0.85rem",
              fontStyle: "italic",
              color: T.muted,
              letterSpacing: "0.02em",
              marginTop: "1.5rem",
              maxWidth: 420,
              lineHeight: 1.6,
            }}
          >
            for everyone who had a film in their head and finally had no more
            reasons not to make it.
          </div>
        </SectionReveal>

        <div style={{ width: "100%", marginTop: "3.5rem" }}>
          <FilmStrip />
        </div>
      </footer>

      {/* ── Responsive overrides ─────────────────────────────────────────── */}
      <style>{`
        @keyframes ecDrift {
          0%,100% { transform: translateX(0); }
          50%      { transform: translateX(-7px); }
        }
        @keyframes projectorWarm {
          0%,100% { box-shadow: 0 0 40px rgba(198,153,58,0.12), 0 2px 12px rgba(0,0,0,0.5); }
          50%      { box-shadow: 0 0 72px rgba(198,153,58,0.32), 0 6px 20px rgba(0,0,0,0.5); }
        }
        @keyframes ecNowShowing {
          0%,100% { text-shadow: 0 0 8px rgba(248,236,188,0.2); }
          50%      { text-shadow: 0 0 18px rgba(248,236,188,0.55), 0 0 34px rgba(255,200,60,0.18); }
        }
        .ec-overview-grid {
          grid-template-columns: 1fr 300px;
        }
        @media (max-width: 860px) {
          .ec-overview-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .ec-overview-grid > div:last-child {
            display: none;
          }
        }
        @media (max-width: 700px) {
          .ec-ticket-grid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
            padding: 0 0.15rem;
          }
          .ec-ticket-card {
            min-width: 0;
            width: 100%;
          }
          .ec-ticket-main {
            padding: 1.5rem 1.1rem !important;
          }
          .ec-ticket-header {
            margin-bottom: 1rem !important;
            gap: 0.8rem;
          }
          .ec-ticket-title {
            font-size: clamp(1.2rem, 6vw, 1.5rem) !important;
            margin-bottom: 0.8rem !important;
          }
          .ec-ticket-description {
            font-size: 0.82rem !important;
            line-height: 1.6 !important;
            margin-bottom: 1.1rem !important;
          }
          .ec-ticket-meta {
            gap: 0.7rem !important;
            flex-wrap: wrap;
          }
          .ec-ticket-stub {
            width: 56px !important;
            padding: 1rem 0 !important;
          }
          .ec-ticket-admit {
            font-size: 0.37rem !important;
            letter-spacing: 0.16em !important;
          }
          .ec-ticket-seat {
            font-size: 0.34rem !important;
            letter-spacing: 0.11em !important;
          }
          .ec-ticket-barcode {
            width: 30px !important;
            height: 64px !important;
          }
          .ec-ticket-notch {
            right: 48px !important;
            width: 14px !important;
            height: 14px !important;
          }
          .ec-programme-section {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
        }
        @media (max-width: 820px) {
          .ec-content-shell section {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
          .ec-content-shell footer {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
          .ec-manifesto-card {
            padding: 3.25rem 1rem !important;
          }
          .ec-stats-strip {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
            gap: 1rem !important;
          }
          .ec-overview-grid {
            gap: 2rem !important;
          }
          .ec-ticket-grid {
            gap: 1rem !important;
          }
          .ec-winner-grid,
          .ec-quotes-grid {
            gap: 1rem !important;
          }
        }
        @media (max-width: 480px) {
          .ec-content-shell section {
            padding-left: 0.85rem !important;
            padding-right: 0.85rem !important;
          }
          .ec-content-shell footer {
            padding-left: 0.85rem !important;
            padding-right: 0.85rem !important;
          }
          .ec-manifesto-card {
            padding: 2.8rem 0.85rem !important;
          }
          .ec-stats-strip {
            padding-left: 0.85rem !important;
            padding-right: 0.85rem !important;
          }
        }
        .ec-credits-section {
          background:
            radial-gradient(ellipse 70% 40% at 50% 0%, rgba(220,185,90,0.06) 0%, transparent 70%),
            linear-gradient(180deg, rgba(248,236,188,0.015) 0%, transparent 24%);
        }
        .ec-credits-logos {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: clamp(1.2rem, 3.2vw, 2.8rem);
        }
        .ec-credit-logo {
          height: 38px;
          width: auto;
          max-width: 160px;
          display: block;
          object-fit: contain;
          opacity: 0.88;
          transition: opacity .25s ease, transform .25s ease;
        }
        .ec-credit-logo--invert {
          filter: brightness(0) invert(1);
        }
        .ec-credit-logo:hover {
          opacity: 1;
          transform: translateY(-1px);
        }
        .ec-credits-logos a {
          display: flex;
          align-items: center;
          text-decoration: none;
        }
        .ec-credits-names {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          font-family: ${T.serif};
          font-size: clamp(1.1rem, 2.2vw, 1.4rem);
          color: rgba(248,236,188,0.82);
          letter-spacing: 0.02em;
        }
        .ec-credits-dot {
          color: rgba(220,185,90,0.48);
          font-family: ${T.mono};
          font-size: 0.85rem;
          letter-spacing: 0;
        }
        @media (max-width: 820px) {
          .ec-credits-section {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
          .ec-credits-stack {
            gap: 2.4rem !important;
          }
          .ec-credit-logo {
            height: 30px;
            max-width: 130px;
          }
          .ec-credits-cta {
            margin-top: 2.4rem !important;
            padding-top: 1.9rem !important;
            justify-content: center !important;
            text-align: center;
          }
        }
        @media (max-width: 720px) {
          .ec-winner-grid {
            grid-template-columns: 1fr !important;
          }
          .ec-quotes-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (min-width: 721px) and (max-width: 960px) {
          .ec-winner-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .ec-quotes-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default EventContent;
