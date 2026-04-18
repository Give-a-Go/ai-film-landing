import React, { useEffect, useRef, useState } from "react";
import Navigation from "../components/Navigation";

// ─────────────────────────────────────────────────────────────────────────────
// Design tokens (matched to CreditsPage / EventPage)
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  gold: "rgba(248,236,188,0.97)",
  goldSoft: "rgba(248,236,188,0.82)",
  amber: "rgba(220,185,90,0.88)",
  amberDim: "rgba(220,185,90,0.62)",
  amberFaint: "rgba(200,170,80,0.22)",
  muted: "rgba(255,255,255,0.42)",
  dim: "rgba(255,255,255,0.22)",
  accent: "#E85D35",
  border: "rgba(200,170,80,0.22)",
  borderStrong: "rgba(200,170,80,0.38)",
  cardBg: "rgba(248,236,188,0.025)",
  serif: "'IBM Plex Serif', Georgia, serif",
  sans: "'IBM Plex Sans', system-ui, sans-serif",
  mono: "'IBM Plex Mono', monospace",
};

// Placeholder submission form + drive folder. Swap for real URLs when ready.
const SUBMISSION_FORM_URL = "https://forms.gle/TODO-submission-form";
const SUBMISSION_DRIVE_URL =
  "https://drive.google.com/drive/folders/TODO-submission-drive";

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
      { threshold: 0.08 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.9s cubic-bezier(.4,0,.2,1) ${delay}s, transform 0.9s cubic-bezier(.4,0,.2,1) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ActLabel — editorial divider
// ─────────────────────────────────────────────────────────────────────────────
function ActLabel({ number, title }: { number: string; title: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.25rem",
        padding: "0.75rem 2rem",
      }}
    >
      <div style={{ height: 1, flex: 1, maxWidth: 60, background: "rgba(200,170,80,0.18)" }} />
      <div
        style={{
          fontFamily: T.mono,
          fontSize: "0.58rem",
          letterSpacing: "0.32em",
          color: "rgba(200,170,80,0.38)",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        Reel {number} &nbsp;·&nbsp; {title}
      </div>
      <div style={{ height: 1, flex: 1, maxWidth: 60, background: "rgba(200,170,80,0.18)" }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FilmStripBorder
// ─────────────────────────────────────────────────────────────────────────────
function FilmStripBorder({ compact = false }: { compact?: boolean }) {
  return (
    <div style={{ width: "100%", overflow: "hidden", padding: compact ? "1rem 0" : "2.5rem 0" }}>
      <svg
        viewBox="0 0 1200 36"
        style={{
          width: "120%",
          marginLeft: "-10%",
          height: 36,
          display: "block",
          animation: "filmStripDrift 22s ease-in-out infinite",
        }}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <line x1="0" y1="3" x2="1200" y2="3" stroke="rgba(200,170,80,0.18)" strokeWidth="0.8" />
        <line x1="0" y1="33" x2="1200" y2="33" stroke="rgba(200,170,80,0.18)" strokeWidth="0.8" />
        {Array.from({ length: 56 }, (_, i) => (
          <React.Fragment key={i}>
            <rect x={i * 22 + 3} y="6" width="11" height="7" rx="1.5" fill="none" stroke="rgba(200,170,80,0.16)" strokeWidth="0.7" />
            <rect x={i * 22 + 3} y="23" width="11" height="7" rx="1.5" fill="none" stroke="rgba(200,170,80,0.16)" strokeWidth="0.7" />
          </React.Fragment>
        ))}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Reusable micro-components
// ─────────────────────────────────────────────────────────────────────────────
function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: T.amber,
        textDecoration: "none",
        borderBottom: "1px solid rgba(200,170,80,0.3)",
        transition: "color 0.2s, border-color 0.2s",
        wordBreak: "break-word",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.color = T.gold;
        el.style.borderColor = "rgba(248,236,188,0.7)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.color = T.amber;
        el.style.borderColor = "rgba(200,170,80,0.3)";
      }}
    >
      {children}
    </a>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li
      style={{
        display: "flex",
        gap: "1rem",
        alignItems: "flex-start",
        padding: "1rem 0",
        borderTop: "1px dashed rgba(200,170,80,0.14)",
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: 28,
          height: 28,
          borderRadius: "50%",
          border: `1px solid ${T.borderStrong}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: T.mono,
          fontSize: "0.72rem",
          color: T.amber,
          background: "rgba(200,170,80,0.05)",
        }}
      >
        {String(n).padStart(2, "0")}
      </div>
      <div
        style={{
          fontFamily: T.sans,
          fontSize: "1.02rem",
          lineHeight: 1.65,
          color: "rgba(232,222,192,0.82)",
          paddingTop: "0.15rem",
        }}
      >
        {children}
      </div>
    </li>
  );
}

function SubHead({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: T.mono,
        fontSize: "0.58rem",
        letterSpacing: "0.28em",
        textTransform: "uppercase",
        color: T.amber,
        margin: "1.5rem 0 0.6rem",
      }}
    >
      {children}
    </div>
  );
}

function Bullets({ items }: { items: React.ReactNode[] }) {
  return (
    <ul style={{ margin: "0.2rem 0 0", padding: 0, listStyle: "none" }}>
      {items.map((it, i) => (
        <li
          key={i}
          style={{
            position: "relative",
            padding: "0.45rem 0 0.45rem 1.25rem",
            fontSize: "0.96rem",
            color: "rgba(232,222,192,0.76)",
            lineHeight: 1.65,
          }}
        >
          <span
            style={{
              position: "absolute",
              left: 0,
              top: "0.75rem",
              width: 6,
              height: 6,
              border: `1px solid ${T.amberDim}`,
              transform: "rotate(45deg)",
            }}
          />
          {it}
        </li>
      ))}
    </ul>
  );
}

function Callout({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "warn" | "critical";
  title?: string;
  children: React.ReactNode;
}) {
  const accent =
    tone === "critical"
      ? "rgba(232,93,53,0.8)"
      : tone === "warn"
        ? "rgba(232,93,53,0.55)"
        : T.borderStrong;
  const bg =
    tone === "critical"
      ? "rgba(232,93,53,0.08)"
      : tone === "warn"
        ? "rgba(232,93,53,0.04)"
        : "rgba(200,170,80,0.04)";
  const headColor =
    tone === "critical" || tone === "warn" ? "rgba(255,160,130,0.92)" : T.amber;
  return (
    <div
      style={{
        marginTop: "1.25rem",
        padding: "1rem 1.15rem",
        border: `1px solid ${accent}`,
        borderLeft: `3px solid ${accent}`,
        background: bg,
        fontFamily: T.sans,
        fontSize: "0.98rem",
        lineHeight: 1.7,
        color: "rgba(232,222,192,0.86)",
      }}
    >
      {title && (
        <div
          style={{
            fontFamily: T.mono,
            fontSize: "0.58rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: headColor,
            marginBottom: "0.5rem",
          }}
        >
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

function PrimaryButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.6rem",
        padding: "1rem 1.9rem",
        background: T.accent,
        color: "#fff",
        fontFamily: T.sans,
        fontWeight: 600,
        fontSize: "0.88rem",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        textDecoration: "none",
        border: "none",
        borderRadius: 3,
        boxShadow:
          "0 0 28px rgba(232,93,53,0.28), 0 2px 10px rgba(0,0,0,0.55)",
        transition: "transform 0.18s, box-shadow 0.18s",
        alignSelf: "flex-start",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "scale(1.03)";
        el.style.boxShadow =
          "0 0 40px rgba(232,93,53,0.42), 0 4px 16px rgba(0,0,0,0.55)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "scale(1)";
        el.style.boxShadow =
          "0 0 28px rgba(232,93,53,0.28), 0 2px 10px rgba(0,0,0,0.55)";
      }}
    >
      {children}
      <span aria-hidden>→</span>
    </a>
  );
}

function GhostButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.95rem 1.4rem",
        background: "transparent",
        color: T.goldSoft,
        fontFamily: T.mono,
        fontSize: "0.72rem",
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        textDecoration: "none",
        border: `1px solid ${T.borderStrong}`,
        borderRadius: 3,
        transition: "color 0.18s, border-color 0.18s, background 0.18s",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.color = T.gold;
        el.style.borderColor = "rgba(248,236,188,0.6)";
        el.style.background = "rgba(200,170,80,0.05)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.color = T.goldSoft;
        el.style.borderColor = T.borderStrong;
        el.style.background = "transparent";
      }}
    >
      {children}
    </a>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Card
// ─────────────────────────────────────────────────────────────────────────────
function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        position: "relative",
        background:
          "linear-gradient(150deg, rgba(28,22,8,0.6) 0%, rgba(10,8,3,0.95) 100%)",
        border: `1px solid ${T.border}`,
        padding: "2rem 1.85rem 1.85rem",
        ...style,
      }}
    >
      {(["tl", "tr", "bl", "br"] as const).map((c) => (
        <div
          key={c}
          style={{
            position: "absolute",
            width: 14,
            height: 14,
            borderColor: T.border,
            borderStyle: "solid",
            borderWidth: 0,
            ...(c === "tl"
              ? { top: 6, left: 6, borderTopWidth: 1, borderLeftWidth: 1 }
              : c === "tr"
                ? { top: 6, right: 6, borderTopWidth: 1, borderRightWidth: 1 }
                : c === "bl"
                  ? { bottom: 6, left: 6, borderBottomWidth: 1, borderLeftWidth: 1 }
                  : { bottom: 6, right: 6, borderBottomWidth: 1, borderRightWidth: 1 }),
          }}
        />
      ))}
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section — standard content wrapper
// ─────────────────────────────────────────────────────────────────────────────
function Section({
  id,
  slate,
  title,
  tag,
  summary,
  children,
}: {
  id: string;
  slate: string;
  title: string;
  tag: string;
  summary?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      style={{
        position: "relative",
        padding: "4rem 1.5rem 3rem",
        maxWidth: 860,
        width: "100%",
        margin: "0 auto",
        scrollMarginTop: "90px",
      }}
    >
      <SectionReveal>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "1.4rem",
          }}
        >
          <div
            style={{
              fontFamily: T.mono,
              fontSize: "0.62rem",
              letterSpacing: "0.28em",
              color: T.amberDim,
              textTransform: "uppercase",
              border: `1px solid ${T.border}`,
              padding: "0.35rem 0.7rem",
              background: "rgba(0,0,0,0.3)",
            }}
          >
            Scene {slate}
          </div>
          <div style={{ flex: 1, height: 1, background: "rgba(200,170,80,0.14)" }} />
        </div>
      </SectionReveal>

      <SectionReveal delay={0.08}>
        <h2
          style={{
            fontFamily: T.serif,
            fontSize: "clamp(1.9rem, 4vw, 2.9rem)",
            fontWeight: 700,
            color: T.gold,
            margin: 0,
            lineHeight: 1.1,
            letterSpacing: "0.005em",
          }}
        >
          {title}
        </h2>
        <div
          style={{
            marginTop: "0.5rem",
            fontFamily: T.sans,
            fontSize: "0.95rem",
            color: T.amberDim,
            fontStyle: "italic",
            letterSpacing: "0.01em",
          }}
        >
          {tag}
        </div>
      </SectionReveal>

      {summary && (
        <SectionReveal delay={0.16}>
          <p
            style={{
              marginTop: "1.4rem",
              fontFamily: T.sans,
              fontSize: "1.05rem",
              lineHeight: 1.8,
              color: "rgba(232,222,192,0.78)",
              maxWidth: 720,
            }}
          >
            {summary}
          </p>
        </SectionReveal>
      )}

      <SectionReveal delay={0.22}>
        <div style={{ marginTop: "2rem" }}>{children}</div>
      </SectionReveal>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Form field preview — read-only "what the form will ask you" rows
// ─────────────────────────────────────────────────────────────────────────────
function FormField({
  label,
  required,
  type = "text",
  hint,
  placeholder,
}: {
  label: string;
  required?: boolean;
  type?: "text" | "textarea" | "select" | "url" | "email";
  hint?: React.ReactNode;
  placeholder?: string;
}) {
  return (
    <div
      style={{
        padding: "1.1rem 0",
        borderTop: "1px dashed rgba(200,170,80,0.14)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "0.6rem",
          marginBottom: "0.5rem",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            fontFamily: T.sans,
            fontSize: "0.98rem",
            fontWeight: 600,
            color: T.goldSoft,
            letterSpacing: "0.01em",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: T.mono,
            fontSize: "0.55rem",
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: required ? "rgba(255,160,130,0.9)" : T.amberDim,
          }}
        >
          {required ? "Required" : "Optional"}
        </div>
      </div>

      {hint && (
        <div
          style={{
            fontFamily: T.sans,
            fontSize: "0.92rem",
            color: "rgba(232,222,192,0.65)",
            lineHeight: 1.6,
            marginBottom: "0.55rem",
          }}
        >
          {hint}
        </div>
      )}

      <div
        style={{
          fontFamily: T.mono,
          fontSize: "0.85rem",
          color: "rgba(232,222,192,0.35)",
          padding: type === "textarea" ? "0.9rem 0.95rem" : "0.65rem 0.95rem",
          border: `1px solid ${T.border}`,
          background: "rgba(0,0,0,0.35)",
          minHeight: type === "textarea" ? 72 : undefined,
          fontStyle: "italic",
          letterSpacing: "0.02em",
        }}
      >
        {placeholder ?? "\u00A0"}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Prize card
// ─────────────────────────────────────────────────────────────────────────────
function PrizeCard({
  icon,
  title,
  presenter,
  summary,
  criteria,
  prompt,
}: {
  icon: string;
  title: string;
  presenter: string;
  summary: string;
  criteria: { label: string; body: React.ReactNode }[];
  prompt: React.ReactNode;
}) {
  return (
    <SectionReveal>
      <Card style={{ marginBottom: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "0.8rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ fontSize: "1.4rem", lineHeight: 1 }}>{icon}</div>
          <h3
            style={{
              margin: 0,
              fontFamily: T.serif,
              fontSize: "clamp(1.25rem, 2.4vw, 1.55rem)",
              fontWeight: 700,
              color: T.gold,
              letterSpacing: "0.005em",
            }}
          >
            {title}
          </h3>
          <div
            style={{
              fontFamily: T.mono,
              fontSize: "0.6rem",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: T.amberDim,
            }}
          >
            Presented by {presenter}
          </div>
        </div>

        <p
          style={{
            margin: "0.9rem 0 1.1rem",
            fontFamily: T.sans,
            fontSize: "1rem",
            lineHeight: 1.7,
            color: "rgba(232,222,192,0.78)",
          }}
        >
          {summary}
        </p>

        <SubHead>Judged on</SubHead>
        <ul style={{ margin: "0.2rem 0 0", padding: 0, listStyle: "none" }}>
          {criteria.map((c, i) => (
            <li
              key={i}
              style={{
                padding: "0.55rem 0",
                borderTop: "1px dashed rgba(200,170,80,0.14)",
                fontFamily: T.sans,
                fontSize: "0.95rem",
                lineHeight: 1.65,
                color: "rgba(232,222,192,0.74)",
              }}
            >
              <strong style={{ color: T.goldSoft, fontWeight: 600 }}>
                {c.label}.
              </strong>{" "}
              {c.body}
            </li>
          ))}
        </ul>

        <div
          style={{
            marginTop: "1.3rem",
            padding: "0.9rem 1rem",
            border: `1px dashed ${T.border}`,
            background: "rgba(200,170,80,0.03)",
          }}
        >
          <div
            style={{
              fontFamily: T.mono,
              fontSize: "0.55rem",
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              color: T.amber,
              marginBottom: "0.4rem",
            }}
          >
            On the form
          </div>
          <div
            style={{
              fontFamily: T.sans,
              fontSize: "0.95rem",
              lineHeight: 1.65,
              color: "rgba(232,222,192,0.78)",
              fontStyle: "italic",
            }}
          >
            {prompt}
          </div>
        </div>
      </Card>
    </SectionReveal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SubmissionPage
// ─────────────────────────────────────────────────────────────────────────────
const SubmissionPage: React.FC = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: T.gold,
        overflowX: "hidden",
      }}
    >
      {/* Film grain */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          opacity: 0.035,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px",
          pointerEvents: "none",
          zIndex: 9999,
          willChange: "transform",
          contain: "strict",
        }}
      />
      {/* Vignette */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(ellipse 85% 85% at center, transparent 45%, rgba(5,5,5,0.55) 100%)",
          pointerEvents: "none",
          zIndex: 100,
        }}
      />
      {/* Corner marks */}
      {(
        [
          { top: "1rem", left: "1rem", borderTop: "1px solid rgba(198,153,58,0.38)", borderLeft: "1px solid rgba(198,153,58,0.38)" },
          { top: "1rem", right: "1rem", borderTop: "1px solid rgba(198,153,58,0.38)", borderRight: "1px solid rgba(198,153,58,0.38)" },
          { bottom: "1rem", left: "1rem", borderBottom: "1px solid rgba(198,153,58,0.38)", borderLeft: "1px solid rgba(198,153,58,0.38)" },
          { bottom: "1rem", right: "1rem", borderBottom: "1px solid rgba(198,153,58,0.38)", borderRight: "1px solid rgba(198,153,58,0.38)" },
        ] as React.CSSProperties[]
      ).map((style, i) => (
        <div
          key={i}
          style={{ position: "fixed", width: 32, height: 32, pointerEvents: "none", zIndex: 9998, ...style }}
        />
      ))}

      <Navigation />

      <main style={{ position: "relative" }}>
        {/* ═══════════════════════════════════════════════════════════════════
            HERO
            ═══════════════════════════════════════════════════════════════ */}
        <section
          style={{
            position: "relative",
            minHeight: "62vh",
            padding: "7.5rem 1.5rem 3rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            background:
              "radial-gradient(ellipse 70% 45% at 50% 0%, rgba(255,215,60,0.055) 0%, transparent 65%), radial-gradient(ellipse 40% 30% at 50% 100%, rgba(255,180,30,0.025) 0%, transparent 100%), #000",
          }}
        >
          <SectionReveal>
            <div
              style={{
                fontFamily: T.mono,
                fontSize: "clamp(0.55rem, 0.9vw, 0.72rem)",
                color: T.amberDim,
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                marginBottom: "1.25rem",
              }}
            >
              Film Submission
            </div>
          </SectionReveal>

          <SectionReveal delay={0.08}>
            <h1
              style={{
                fontFamily: T.serif,
                fontSize: "clamp(2.4rem, 6vw, 4.4rem)",
                fontWeight: 700,
                color: T.gold,
                letterSpacing: "0.015em",
                lineHeight: 1.06,
                margin: 0,
                textShadow: "0 0 80px rgba(255,215,60,0.22)",
                maxWidth: 920,
              }}
            >
              Submit Your <em style={{ fontWeight: 300 }}>Film</em>
            </h1>
          </SectionReveal>

          <SectionReveal delay={0.16}>
            <p
              style={{
                fontFamily: T.sans,
                fontWeight: 400,
                fontSize: "clamp(1.05rem, 1.65vw, 1.25rem)",
                color: "rgba(232,222,192,0.82)",
                maxWidth: 620,
                lineHeight: 1.7,
                margin: "1.6rem auto 0",
              }}
            >
              Three steps. <strong style={{ color: T.goldSoft, fontWeight: 600 }}>Upscale</strong>,{" "}
              <strong style={{ color: T.goldSoft, fontWeight: 600 }}>upload</strong>, then{" "}
              <strong style={{ color: T.goldSoft, fontWeight: 600 }}>fill the form</strong>. In that order.
            </p>
          </SectionReveal>

          <SectionReveal delay={0.24}>
            <div
              style={{
                marginTop: "2.25rem",
                display: "flex",
                flexWrap: "wrap",
                gap: "0.7rem",
                justifyContent: "center",
              }}
            >
              {[
                { label: "01 · Upscale", href: "#upscale" },
                { label: "02 · Upload", href: "#upload" },
                { label: "03 · Form", href: "#form" },
                { label: "04 · Prizes", href: "#prizes" },
              ].map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  style={{
                    fontFamily: T.mono,
                    fontSize: "0.7rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: T.amber,
                    textDecoration: "none",
                    padding: "0.55rem 1rem",
                    border: `1px solid ${T.border}`,
                    borderRadius: 2,
                    transition: "background 0.2s, border-color 0.2s, color 0.2s",
                    background: "rgba(200,170,80,0.03)",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "rgba(200,170,80,0.09)";
                    el.style.borderColor = T.borderStrong;
                    el.style.color = T.gold;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "rgba(200,170,80,0.03)";
                    el.style.borderColor = T.border;
                    el.style.color = T.amber;
                  }}
                >
                  {c.label} ↓
                </a>
              ))}
            </div>
          </SectionReveal>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            CRITICAL UPSCALE CALLOUT — immediately below hero
            ═══════════════════════════════════════════════════════════════ */}
        <section
          style={{
            padding: "0.5rem 1.5rem 2.25rem",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <SectionReveal>
            <div
              style={{
                maxWidth: 760,
                width: "100%",
                padding: "1.5rem 1.75rem",
                border: `1px solid rgba(232,93,53,0.8)`,
                borderLeft: "3px solid rgba(232,93,53,0.9)",
                background:
                  "linear-gradient(180deg, rgba(232,93,53,0.10) 0%, rgba(232,93,53,0.03) 100%)",
                boxShadow: "0 0 48px rgba(232,93,53,0.18)",
              }}
            >
              <div
                style={{
                  fontFamily: T.mono,
                  fontSize: "0.62rem",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "rgba(255,160,130,0.95)",
                  marginBottom: "0.7rem",
                }}
              >
                · Do not skip this step ·
              </div>
              <h3
                style={{
                  margin: 0,
                  fontFamily: T.serif,
                  fontSize: "clamp(1.3rem, 2.6vw, 1.75rem)",
                  fontWeight: 700,
                  color: T.gold,
                  lineHeight: 1.2,
                }}
              >
                Upscale before you submit.
              </h3>
              <p
                style={{
                  margin: "0.85rem 0 0",
                  fontFamily: T.sans,
                  fontSize: "1.02rem",
                  lineHeight: 1.75,
                  color: "rgba(232,222,192,0.9)",
                }}
              >
                Your film screens at a <strong style={{ color: T.goldSoft, fontWeight: 600 }}>real cinema on a real screen</strong>. Raw generations
                from video models look fine on a laptop and fall apart at 4K. A clean upscale pass is the single largest
                quality jump you can make in the last hour — grain, edges, motion, everything tightens up. The difference
                between "AI demo" and "short film" is usually one upscale pass and one audio pass.
              </p>
              <p
                style={{
                  margin: "0.75rem 0 0",
                  fontFamily: T.sans,
                  fontSize: "0.98rem",
                  lineHeight: 1.7,
                  color: "rgba(255,220,200,0.82)",
                }}
              >
                Use your remaining <strong>Fal credits</strong> for video and your remaining{" "}
                <strong>ElevenLabs credits</strong> for audio polish. Steps below.
              </p>
            </div>
          </SectionReveal>
        </section>

        <FilmStripBorder />
        <ActLabel number="I" title="Upscale — video + audio" />

        {/* ═══════════════════════════════════════════════════════════════════
            UPSCALE — Fal (video) + ElevenLabs (audio)
            ═══════════════════════════════════════════════════════════════ */}
        <Section
          id="upscale"
          slate="01A"
          title="Make it look and sound like a film"
          tag="Video upscaling on Fal · audio polish on ElevenLabs"
          summary={
            <>
              This is the biggest single quality jump between a rough cut and a festival-ready short. Do it last, after
              picture is locked. <strong style={{ color: T.goldSoft, fontWeight: 600 }}>Never upscale drafts</strong> — it is
              slow and expensive. When you upscale, do the final master and nothing else.
            </>
          }
        >
          <Card>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.8rem",
                marginBottom: "0.4rem",
              }}
            >
              <span
                style={{
                  fontFamily: T.mono,
                  fontSize: "0.62rem",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: T.amber,
                }}
              >
                Video · Fal
              </span>
              <span
                style={{
                  fontFamily: T.mono,
                  fontSize: "0.55rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(255,160,130,0.9)",
                  border: "1px solid rgba(232,93,53,0.5)",
                  padding: "0.22rem 0.5rem",
                  background: "rgba(232,93,53,0.08)",
                }}
              >
                Use remaining credits
              </span>
            </div>

            <ol style={{ listStyle: "none", padding: 0, margin: "0.5rem 0 1.4rem" }}>
              <Step n={1}>
                <strong style={{ color: T.goldSoft, fontWeight: 500 }}>
                  Lock picture first.
                </strong>{" "}
                Final edit, final colour, final cut points. Upscaling an unlocked edit wastes credits and time.
              </Step>
              <Step n={2}>
                <strong style={{ color: T.goldSoft, fontWeight: 500 }}>
                  Export your master at native resolution
                </strong>{" "}
                (whatever your generations came out at — usually 720p or 1080p). Don't pre-upscale in your NLE first.
                H.264 or ProRes, constant frame rate, 23.976 or 24 fps.
              </Step>
              <Step n={3}>
                <strong style={{ color: T.goldSoft, fontWeight: 500 }}>
                  Open the Fal playground and pick an upscaler.
                </strong>{" "}
                Recommended, in order of cinematic quality:
                <div style={{ marginTop: "0.55rem" }}>
                  <Bullets
                    items={[
                      <>
                        <A href="https://fal.ai/models/fal-ai/topaz/upscale/video">Topaz Video Upscale</A> — the gold
                        standard. Best for live-action and AI-generated footage alike. Handles faces, hair, and motion
                        without smearing. Use the <em>Proteus</em> or <em>Artemis</em> model for AI video.
                      </>,
                      <>
                        <A href="https://fal.ai/models/fal-ai/seedvr2/upscale/video">SeedVR2 Video Upscaler</A> — newer,
                        fast, strong on stylised footage. Great fallback when Topaz credits run thin.
                      </>,
                      <>
                        <A href="https://fal.ai/models/fal-ai/esrgan">ESRGAN / Real-ESRGAN</A> — frame-by-frame fallback
                        if you only need stills. Not recommended for the full film.
                      </>,
                    ]}
                  />
                </div>
              </Step>
              <Step n={4}>
                <strong style={{ color: T.goldSoft, fontWeight: 500 }}>
                  Upscale to at least 1080p, ideally 2K.
                </strong>{" "}
                Cinema projection is 2K (2048×1080) or 4K — aim for 2K minimum. Going higher than 4K is a waste of credits.
              </Step>
              <Step n={5}>
                <strong style={{ color: T.goldSoft, fontWeight: 500 }}>
                  Upscale clip-by-clip, not the whole timeline.
                </strong>{" "}
                If you only have AI shots in some sequences, upscale only those. Live-recorded footage usually does not
                need it.
              </Step>
              <Step n={6}>
                <strong style={{ color: T.goldSoft, fontWeight: 500 }}>
                  Re-cut the upscaled clips into your timeline and re-export the master.
                </strong>{" "}
                Do a final A/B look on a big screen if there is one free — the difference should be obvious.
              </Step>
            </ol>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
              <PrimaryButton href="https://fal.ai/models?categories=video-to-video">
                Open Fal upscale models
              </PrimaryButton>
              <GhostButton href="/credits#fal-ai">Claim credits on Fal</GhostButton>
            </div>

            <Callout tone="warn" title="Out of Fal credits?">
              Claim fresh credits first (each participant has $75).{" "}
              <A href="/credits#fal-ai">See the credits page</A>. If you have truly burned through them, grab a
              Give(a)Go mentor — we can usually top you up for the final render.
            </Callout>
          </Card>

          <div style={{ height: "1.25rem" }} />

          <Card>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.8rem",
                marginBottom: "0.4rem",
              }}
            >
              <span
                style={{
                  fontFamily: T.mono,
                  fontSize: "0.62rem",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: T.amber,
                }}
              >
                Audio · ElevenLabs
              </span>
              <span
                style={{
                  fontFamily: T.mono,
                  fontSize: "0.55rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(255,160,130,0.9)",
                  border: "1px solid rgba(232,93,53,0.5)",
                  padding: "0.22rem 0.5rem",
                  background: "rgba(232,93,53,0.08)",
                }}
              >
                Use remaining credits
              </span>
            </div>

            <p
              style={{
                margin: "0.5rem 0 0.9rem",
                fontFamily: T.sans,
                fontSize: "1rem",
                lineHeight: 1.7,
                color: "rgba(232,222,192,0.78)",
              }}
            >
              Audience ears are unforgiving. Cinema sound systems expose hiss, clipping, and level mismatches that
              headphones hide. Treat the audio pass the same way you treat the video upscale — as a single, focused,
              end-of-pipeline polish.
            </p>

            <ol style={{ listStyle: "none", padding: 0, margin: "0.5rem 0 1.4rem" }}>
              <Step n={1}>
                <strong style={{ color: T.goldSoft, fontWeight: 500 }}>Re-render final dialogue and VO at the highest quality setting.</strong>{" "}
                In the ElevenLabs app, set output to the highest available (<em>eleven_multilingual_v2</em> or the
                latest v3 at MP3 44.1kHz 192kbps or WAV). Do this after picture is locked so you only pay once per line.
              </Step>
              <Step n={2}>
                <strong style={{ color: T.goldSoft, fontWeight: 500 }}>
                  Run any recorded-on-phone audio through Voice Isolator.
                </strong>{" "}
                <A href="https://elevenlabs.io/app/voice-isolator">elevenlabs.io/app/voice-isolator</A>. Strips room
                noise, wind, HVAC. One click. Essentially free.
              </Step>
              <Step n={3}>
                <strong style={{ color: T.goldSoft, fontWeight: 500 }}>Generate missing foley and SFX.</strong>{" "}
                <A href="https://elevenlabs.io/app/sound-effects">elevenlabs.io/app/sound-effects</A>. Think cloth
                movement, footsteps on different surfaces, distant traffic, door slams, cups on a table. Thirty seconds
                of the right foley lifts the whole film.
              </Step>
              <Step n={4}>
                <strong style={{ color: T.goldSoft, fontWeight: 500 }}>
                  Lay 30 seconds of room tone under every scene.
                </strong>{" "}
                <em>"Quiet office ambience"</em>, <em>"empty forest at night"</em>, <em>"rainy city window"</em>. Silence
                between lines feels dead in a cinema; room tone makes a scene breathe.
              </Step>
              <Step n={5}>
                <strong style={{ color: T.goldSoft, fontWeight: 500 }}>
                  Score with ElevenLabs Music or a licensed track.
                </strong>{" "}
                <A href="https://elevenlabs.io/app/music">elevenlabs.io/app/music</A>. Original score beats a rough
                needle-drop every time for judging — it reads as intent.
              </Step>
              <Step n={6}>
                <strong style={{ color: T.goldSoft, fontWeight: 500 }}>Bounce a final mix.</strong>{" "}
                Target <strong>-14 LUFS</strong> integrated, peaks at <strong>-1 dBTP</strong>. Export stereo WAV
                alongside the AAC for the final master.
              </Step>
            </ol>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
              <PrimaryButton href="https://elevenlabs.io/app/voice-isolator">
                Open ElevenLabs Voice Isolator
              </PrimaryButton>
              <GhostButton href="/credits#elevenlabs">Claim ElevenLabs Pro</GhostButton>
            </div>

            <Callout title="Why this matters">
              A sharp picture with thin audio reads as an AI demo. A lightly compressed picture with full-bodied audio
              reads as a film. When you have 60 minutes left before the deadline, spend 40 on audio, 20 on video —
              not the other way around.
            </Callout>
          </Card>
        </Section>

        <FilmStripBorder compact />
        <ActLabel number="II" title="Upload to Google Drive" />

        {/* ═══════════════════════════════════════════════════════════════════
            UPLOAD
            ═══════════════════════════════════════════════════════════════ */}
        <Section
          id="upload"
          slate="02A"
          title="Upload your master to the hackathon Drive"
          tag="One folder per team · naming conventions matter"
          summary={
            <>
              The premiere rolls straight from the Drive folder. Bad file names and missing metadata are the #1 reason
              films get shown out of order or with the wrong title card. Follow the naming convention exactly.
            </>
          }
        >
          <Card>
            <ol style={{ listStyle: "none", padding: 0, margin: "0.5rem 0 1.4rem" }}>
              <Step n={1}>
                <strong style={{ color: T.goldSoft, fontWeight: 500 }}>
                  Open the hackathon Drive folder.
                </strong>{" "}
                <A href={SUBMISSION_DRIVE_URL}>Submission Drive (all teams)</A>
              </Step>
              <Step n={2}>
                <strong style={{ color: T.goldSoft, fontWeight: 500 }}>
                  Create a folder named <code style={{ fontFamily: T.mono, color: T.amber }}>Team-XX_Film-Title</code>.
                </strong>{" "}
                Replace XX with your team number (e.g. <code style={{ fontFamily: T.mono, color: T.amber }}>Team-07_The-Crossing</code>).
                No spaces, no emojis — use hyphens.
              </Step>
              <Step n={3}>
                <strong style={{ color: T.goldSoft, fontWeight: 500 }}>
                  Upload the final master as{" "}
                  <code style={{ fontFamily: T.mono, color: T.amber }}>FINAL_Team-XX_Film-Title.mp4</code>.
                </strong>{" "}
                H.264, 1080p or 2K, 23.976 or 24 fps, audio at 44.1kHz. Target under 2 GB.
              </Step>
              <Step n={4}>
                <strong style={{ color: T.goldSoft, fontWeight: 500 }}>Inside that folder, add three sub-items:</strong>
                <div style={{ marginTop: "0.55rem" }}>
                  <Bullets
                    items={[
                      <>
                        <code style={{ fontFamily: T.mono, color: T.amber }}>poster.jpg</code> — a single still from
                        the film (for the premiere programme)
                      </>,
                      <>
                        <code style={{ fontFamily: T.mono, color: T.amber }}>bts/</code> — a sub-folder with any
                        behind-the-scenes stills, screen recordings, or pipeline diagrams
                      </>,
                      <>
                        <code style={{ fontFamily: T.mono, color: T.amber }}>references/</code> — any reference
                        footage, mood boards, or source images you used (especially for the Reference-to-Video prize)
                      </>,
                    ]}
                  />
                </div>
              </Step>
              <Step n={5}>
                <strong style={{ color: T.goldSoft, fontWeight: 500 }}>
                  Set sharing to <em>"Anyone with the link"</em>.
                </strong>{" "}
                Judges and the projection desk need to reach it without requesting access.
              </Step>
              <Step n={6}>
                <strong style={{ color: T.goldSoft, fontWeight: 500 }}>
                  Copy the folder link
                </strong>{" "}
                — you will paste it into the submission form in the next step.
              </Step>
            </ol>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
              <PrimaryButton href={SUBMISSION_DRIVE_URL}>Open submission Drive</PrimaryButton>
              <span
                style={{
                  fontFamily: T.mono,
                  fontSize: "0.6rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: T.dim,
                }}
              >
                Opens in a new tab
              </span>
            </div>

            <Callout tone="warn" title="File size getting big?">
              Export at H.264 High Profile, CRF 18–20, 10–16 Mbps. That is visually indistinguishable from a master at
              1080p and cuts file size by 3–4×. Keep the uncompressed master on your own drive in case the organisers
              ask for it.
            </Callout>
          </Card>
        </Section>

        <FilmStripBorder compact />
        <ActLabel number="III" title="Fill the submission form" />

        {/* ═══════════════════════════════════════════════════════════════════
            FORM — field-by-field preview
            ═══════════════════════════════════════════════════════════════ */}
        <Section
          id="form"
          slate="03A"
          title="The submission form"
          tag="Every field below is on the real form — prepare answers first"
          summary={
            <>
              The form is short. It should take under ten minutes if you have your Drive link, team roster, and a
              two-sentence pitch ready. Open the fields below, draft your answers in a doc, then paste them in.
            </>
          }
        >
          <Card>
            <div
              style={{
                fontFamily: T.mono,
                fontSize: "0.62rem",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: T.amber,
                marginBottom: "0.5rem",
              }}
            >
              The film
            </div>

            <FormField
              label="Film title"
              required
              hint="What goes on the title card at the premiere. Keep it short. No ALL CAPS unless stylistic."
              placeholder="e.g. The Crossing"
            />

            <FormField
              label="Two-sentence description"
              required
              type="textarea"
              hint="Think of it like an announcement trailer: what's the hook, what's the feeling. Two sentences, maximum. This is what the audience hears before your film plays."
              placeholder="A lighthouse keeper wakes to find the sea gone. What's left in its place remembers him."
            />

            <FormField
              label="Film file / Drive folder link"
              required
              type="url"
              hint={
                <>
                  The link to your <code style={{ fontFamily: T.mono, color: T.amber }}>Team-XX_Film-Title</code> folder
                  from Step II. Must be set to <em>"Anyone with the link"</em>.
                </>
              }
              placeholder={SUBMISSION_DRIVE_URL}
            />

            <FormField
              label="Confirm the film has been upscaled for cinema projection"
              required
              type="select"
              hint="Yes / No / Partially. Films that haven't been upscaled still play but will read rougher than they should. Be honest."
              placeholder="Yes — upscaled on Fal to 2K"
            />

            <div
              style={{
                fontFamily: T.mono,
                fontSize: "0.62rem",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: T.amber,
                marginTop: "2rem",
                marginBottom: "0.5rem",
              }}
            >
              The team
            </div>

            <FormField
              label="Team number"
              required
              hint="Assigned at kickoff. On your table card."
              placeholder="e.g. 07"
            />

            <FormField
              label="Team members"
              required
              type="textarea"
              hint="Full names + a one-word role each (director, VFX, sound, writer, etc.). Everyone who worked on the film — for the credits slide at the premiere."
              placeholder={"Aoife Byrne — director\nSam Okafor — pipeline\nMira Petrov — sound\nLina Cruz — editor"}
            />

            <FormField
              label="Primary contact email"
              required
              type="email"
              hint="One person the organisers can reach if we need a re-upload or a correction before the premiere."
              placeholder="you@email.com"
            />

            <div
              style={{
                fontFamily: T.mono,
                fontSize: "0.62rem",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: T.amber,
                marginTop: "2rem",
                marginBottom: "0.5rem",
              }}
            >
              The process
            </div>

            <FormField
              label="Tools used"
              required
              type="textarea"
              hint="Every AI tool and every traditional tool. Models, editors, audio software, plugins, on-set gear. Judges use this to understand your pipeline."
              placeholder={"Wan 2.2 i2v, FLUX, Kling 2.0, ElevenLabs v3, Topaz (via Fal), DaVinci Resolve, Logic Pro"}
            />

            <FormField
              label="Behind-the-scenes process"
              required
              type="textarea"
              hint="2–4 paragraphs. Walk us through your pipeline: how you got from idea to final film. What AI did, what humans did, what broke, what worked. This is the one question every judge reads — write it like you're explaining it to a friend."
              placeholder="We started from a single reference photo and storyboarded in Napkin. Then we generated 40 shots in Wan from still frames, picked 18, ran them through a Topaz upscale on Fal, and cut on Resolve. Voice was a Voice Design clone of our writer. Sound was Eleven's SFX plus a Logic score..."
            />

            <FormField
              label="Reference examples (if you used reference-to-video)"
              hint={
                <>
                  Required only if you're entering the Reference-to-Video prize. Link to the reference images or clips
                  (Drive, Dropbox, or anything public). Put everything in your{" "}
                  <code style={{ fontFamily: T.mono, color: T.amber }}>references/</code> folder from Step II and
                  paste the link here.
                </>
              }
              type="url"
              placeholder="https://drive.google.com/drive/folders/..."
            />

            <div
              style={{
                fontFamily: T.mono,
                fontSize: "0.62rem",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: T.amber,
                marginTop: "2rem",
                marginBottom: "0.5rem",
              }}
            >
              Self-nomination (optional, per prize)
            </div>

            <p
              style={{
                margin: "0 0 0.5rem",
                fontFamily: T.sans,
                fontSize: "0.95rem",
                lineHeight: 1.7,
                color: "rgba(232,222,192,0.7)",
              }}
            >
              Every film is eligible for every prize automatically — you don't have to opt in. But if one of the prizes
              fits your film particularly well, tell the judges why in a sentence or two. It won't hurt, and it often
              helps.
            </p>

            <FormField
              label="Why is yours the Best Reference-to-Video Film?"
              hint="Only if you used Wan AI's reference-to-video feature. One sentence on how you used reference material."
              type="textarea"
              placeholder="We shot 12 reference stills of a coastline, then used Wan i2v to generate 40 matching clips..."
            />
            <FormField
              label="Why is your sound design the best?"
              hint="ElevenLabs prize. One sentence on your voice work, foley, or score."
              type="textarea"
              placeholder="All dialogue is a voice-cloned actor with emotion tags, foley generated scene-by-scene, original score in Music..."
            />
            <FormField
              label="Why is your Fal pipeline the most deliberate?"
              hint="Fal prize. One sentence on how your pipeline fits together, with consistency across shots."
              type="textarea"
              placeholder="Single FLUX character portrait → fed into Kling for motion → Topaz upscale → consistent face across 14 shots..."
            />
            <FormField
              label="Where was AI the creative partner, and where was the human?"
              hint="Wolfpack AI-Human Collaboration prize. Two or three sentences. Be specific."
              type="textarea"
              placeholder="Directing and shot selection were 100% human. Generation, lip-sync, and upscaling were AI. We re-rolled shots until the AI matched our storyboard..."
            />

            <Callout title="When you're ready">
              Once every field above is drafted, open the real form below. One submission per team. You can edit until
              the deadline.
            </Callout>

            <div
              style={{
                marginTop: "1.25rem",
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                alignItems: "center",
              }}
            >
              <PrimaryButton href={SUBMISSION_FORM_URL}>Open submission form</PrimaryButton>
              <GhostButton href={SUBMISSION_DRIVE_URL}>Open submission Drive</GhostButton>
            </div>
          </Card>
        </Section>

        <FilmStripBorder compact />
        <ActLabel number="IV" title="How we'll judge your film" />

        {/* ═══════════════════════════════════════════════════════════════════
            PRIZES
            ═══════════════════════════════════════════════════════════════ */}
        <Section
          id="prizes"
          slate="04A"
          title="Five awards, five lenses"
          tag="Every submitted film is eligible for every prize"
          summary={
            <>
              You don't enter a specific category — the judges watch every film against every rubric. The rubrics below
              are exactly what each sponsor looks for. Use them as a checklist while you finish the film, and as talking
              points in the self-nomination fields on the form.
            </>
          }
        >
          <PrizeCard
            icon="🏆"
            title="Best Reference-to-Video Film"
            presenter="Wan AI"
            summary="The strongest film built using Wan AI's reference-to-video feature. A prize for teams that transform reference material into a distinctive, well-crafted final piece."
            criteria={[
              {
                label: "Creative use of reference",
                body: "Does the team use reference footage in a clear, inventive, and effective way?",
              },
              {
                label: "Quality of transformation",
                body: "Does the output successfully turn the source material into something cinematic and compelling?",
              },
              {
                label: "Execution and craft",
                body: "Does the final film feel polished, intentional, and creatively ambitious?",
              },
            ]}
            prompt={
              <>
                In the "Reference examples" field, link everything you used as source. In the self-nomination field,
                one sentence on the creative leap from reference to final.
              </>
            }
          />

          <PrizeCard
            icon="🎧"
            title="Best Sound Design"
            presenter="ElevenLabs"
            summary="Sound that makes the film. Voice, effects, ambience, and music choices that lift the visuals into something cinematic."
            criteria={[
              {
                label: "Voice and dialogue",
                body: "Performance, casting, delivery.",
              },
              {
                label: "Soundscape",
                body: "Ambience, foley, texture. Does the world feel alive?",
              },
              {
                label: "Music and pacing",
                body: "How sound drives rhythm and emotion.",
              },
            ]}
            prompt={
              <>
                In the self-nomination field, call out specific voice/foley/music moments. Judges will listen on proper
                cinema speakers — the small details you added will actually be audible.
              </>
            }
          />

          <PrizeCard
            icon="⚙️"
            title="Best use of Fal"
            presenter="Fal"
            summary="For the team that turned Fal's video generation infrastructure into something deliberate. Not just outputs. A pipeline with intent, speed, and visual coherence from first frame to last."
            criteria={[
              {
                label: "Pipeline craft",
                body: "Did the team go beyond a single model call and build something that actually holds together?",
              },
              {
                label: "Visual consistency",
                body: "Are characters, environments, and motion controlled across shots, not just lucky?",
              },
              {
                label: "Demonstrated use",
                body: (
                  <>
                    Can the team show their Fal pipeline, walk through how they built it, and justify why their
                    approach was the best use of what Fal offers?
                  </>
                ),
              },
            ]}
            prompt={
              <>
                In "Behind-the-scenes process", diagram your pipeline if you can (upload to{" "}
                <code style={{ fontFamily: T.mono, color: T.amber }}>bts/</code>). This prize is decided more by your
                write-up than by any other.
              </>
            }
          />

          <PrizeCard
            icon="🤝"
            title="Best AI-Human Collaboration"
            presenter="Wolfpack Digital"
            summary="For the film that best demonstrates AI as a creative partner rather than a replacement. Three criteria, equally weighted."
            criteria={[
              {
                label: "Intentionality",
                body: "Did the team make deliberate, thoughtful choices about where to use AI and where to rely on human craft? Not everything should be AI-generated just because it can be.",
              },
              {
                label: "Creative synergy",
                body: "Did AI meaningfully elevate the final result beyond what either humans or AI could have achieved alone? The best entries show a back-and-forth between human direction and AI capability.",
              },
              {
                label: "Transparency",
                body: "Can the team clearly articulate which parts were AI-assisted and which were human-driven? A short behind-the-scenes explanation or breakdown should accompany the submission.",
              },
            ]}
            prompt={
              <>
                The spirit: AI is a tool, and the best tools amplify human creativity. The "Where was AI the creative
                partner, and where was the human?" field is directly for this prize.
              </>
            }
          />

          <PrizeCard
            icon="❤️"
            title="Community Choice"
            presenter="Give(a)Go"
            summary="Voted by the room at the premiere. The film that makes the audience lean in, talk, and still be quoting it at the pub."
            criteria={[
              {
                label: "No formal rubric",
                body: "Pure gut reaction. The room decides.",
              },
            ]}
            prompt={
              <>
                Nothing to add on the form. Just make something that a hundred humans in a dark cinema want to watch
                twice.
              </>
            }
          />
        </Section>

        <FilmStripBorder compact />

        {/* ═══════════════════════════════════════════════════════════════════
            FINAL CTA
            ═══════════════════════════════════════════════════════════════ */}
        <section
          style={{
            padding: "3rem 1.5rem 4rem",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <SectionReveal>
            <div
              style={{
                maxWidth: 720,
                width: "100%",
                padding: "2.25rem 2rem",
                border: `1px solid ${T.borderStrong}`,
                background: "rgba(200,170,80,0.04)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: T.mono,
                  fontSize: "0.62rem",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: T.amber,
                  marginBottom: "0.7rem",
                }}
              >
                One last look
              </div>
              <h3
                style={{
                  margin: 0,
                  fontFamily: T.serif,
                  fontSize: "clamp(1.4rem, 2.8vw, 1.9rem)",
                  fontWeight: 700,
                  color: T.gold,
                  lineHeight: 1.2,
                }}
              >
                Upscaled · Uploaded · Form filled?
              </h3>
              <p
                style={{
                  margin: "0.9rem auto 1.5rem",
                  maxWidth: 520,
                  fontFamily: T.sans,
                  fontSize: "1rem",
                  lineHeight: 1.7,
                  color: "rgba(232,222,192,0.78)",
                }}
              >
                If any of those are still <em>no</em>, go back and finish them first. If all three are yes, hit submit —
                you're done. We'll see you at the premiere.
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.8rem",
                  justifyContent: "center",
                }}
              >
                <PrimaryButton href={SUBMISSION_FORM_URL}>Submit your film</PrimaryButton>
                <GhostButton href="/credits">Need more credits?</GhostButton>
              </div>
            </div>
          </SectionReveal>
        </section>

        <FilmStripBorder compact />

        {/* ═══════════════════════════════════════════════════════════════════
            FOOTER
            ═══════════════════════════════════════════════════════════════ */}
        <footer
          style={{
            padding: "3rem 1.5rem 3rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "1rem",
            background:
              "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(255,215,60,0.035) 0%, transparent 70%), #000",
          }}
        >
          <SectionReveal>
            <div
              style={{
                fontFamily: T.mono,
                fontSize: "0.58rem",
                color: "rgba(200,170,80,0.3)",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                marginBottom: "0.25rem",
              }}
            >
              · Cut · Print · Wrap ·
            </div>
            <p
              style={{
                fontFamily: T.sans,
                fontStyle: "italic",
                fontSize: "0.95rem",
                color: T.muted,
                maxWidth: 520,
                lineHeight: 1.7,
                margin: "0 auto 1.5rem",
              }}
            >
              Stuck on any step? Grab a Give(a)Go mentor on the floor or email{" "}
              <A href="mailto:hello@giveago.io">hello@giveago.io</A>.
            </p>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <a
              href="/"
              style={{
                display: "inline-block",
                fontFamily: T.mono,
                fontSize: "0.7rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: T.amberDim,
                textDecoration: "none",
                border: `1px solid ${T.border}`,
                padding: "0.7rem 1.4rem",
                borderRadius: 2,
                transition: "color 0.2s, border-color 0.2s, background 0.2s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = T.gold;
                el.style.borderColor = T.borderStrong;
                el.style.background = "rgba(200,170,80,0.05)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = T.amberDim;
                el.style.borderColor = T.border;
                el.style.background = "transparent";
              }}
            >
              ← Back to the hackathon
            </a>
          </SectionReveal>

          <div style={{ width: "100%", marginTop: "2rem" }}>
            <FilmStripBorder compact />
          </div>

          <div
            style={{
              fontFamily: T.mono,
              fontSize: "0.55rem",
              color: "rgba(200,170,80,0.22)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginTop: "0.5rem",
            }}
          >
            Give(a)Go × Napkin &nbsp;·&nbsp; AI Film Hackathon v2
          </div>
        </footer>
      </main>

      <style>{`
        @keyframes filmStripDrift {
          0%, 100% { transform: translateX(0); }
          50%       { transform: translateX(-8px); }
        }
      `}</style>
    </div>
  );
};

export default SubmissionPage;
