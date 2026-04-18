import React, { useEffect, useRef, useState } from "react";
import Navigation from "../components/Navigation";

// ─────────────────────────────────────────────────────────────────────────────
// Design tokens (matched to EventContent / EventPage)
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
// ActLabel — editorial divider (matches EventPage)
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
// FilmStripBorder — animated perforation strip (matches EventPage)
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
            <rect
              x={i * 22 + 3}
              y="6"
              width="11"
              height="7"
              rx="1.5"
              fill="none"
              stroke="rgba(200,170,80,0.16)"
              strokeWidth="0.7"
            />
            <rect
              x={i * 22 + 3}
              y="23"
              width="11"
              height="7"
              rx="1.5"
              fill="none"
              stroke="rgba(200,170,80,0.16)"
              strokeWidth="0.7"
            />
          </React.Fragment>
        ))}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step — a single numbered claim step
// ─────────────────────────────────────────────────────────────────────────────
function Step({
  n,
  children,
}: {
  n: number;
  children: React.ReactNode;
}) {
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

// ─────────────────────────────────────────────────────────────────────────────
// Link — styled inline link
// ─────────────────────────────────────────────────────────────────────────────
function A({
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

// ─────────────────────────────────────────────────────────────────────────────
// ClaimButton — big primary CTA for each sponsor
// ─────────────────────────────────────────────────────────────────────────────
function ClaimButton({
  href,
  label = "Claim credits",
}: {
  href: string;
  label?: string;
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
        padding: "0.95rem 1.8rem",
        background: T.accent,
        color: "#fff",
        fontFamily: T.sans,
        fontWeight: 600,
        fontSize: "0.85rem",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        textDecoration: "none",
        border: "none",
        borderRadius: 3,
        boxShadow: "0 0 28px rgba(232,93,53,0.28), 0 2px 10px rgba(0,0,0,0.55)",
        transition: "transform 0.18s, box-shadow 0.18s",
        alignSelf: "flex-start",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "scale(1.03)";
        el.style.boxShadow = "0 0 40px rgba(232,93,53,0.42), 0 4px 16px rgba(0,0,0,0.55)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "scale(1)";
        el.style.boxShadow = "0 0 28px rgba(232,93,53,0.28), 0 2px 10px rgba(0,0,0,0.55)";
      }}
    >
      {label}
      <span style={{ transition: "transform 0.18s" }}>→</span>
    </a>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Callout — amber-tinted note box
// ─────────────────────────────────────────────────────────────────────────────
function Callout({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "warn";
  title?: string;
  children: React.ReactNode;
}) {
  const accent = tone === "warn" ? "rgba(232,93,53,0.55)" : T.borderStrong;
  return (
    <div
      style={{
        marginTop: "1.25rem",
        padding: "1rem 1.15rem",
        border: `1px solid ${accent}`,
        borderLeft: `3px solid ${accent}`,
        background: tone === "warn" ? "rgba(232,93,53,0.04)" : "rgba(200,170,80,0.04)",
        fontFamily: T.sans,
        fontSize: "0.95rem",
        lineHeight: 1.65,
        color: "rgba(232,222,192,0.82)",
      }}
    >
      {title && (
        <div
          style={{
            fontFamily: T.mono,
            fontSize: "0.58rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: tone === "warn" ? "rgba(255,160,130,0.85)" : T.amber,
            marginBottom: "0.45rem",
          }}
        >
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SponsorSection — per-sponsor block
// ─────────────────────────────────────────────────────────────────────────────
type SponsorSectionProps = {
  id: string;
  slate: string; // scene slate number, e.g. "01A"
  name: string;
  tag: string;
  credit: string;
  summary: string;
  children: React.ReactNode;
};

function SponsorSection({ id, slate, name, tag, credit, summary, children }: SponsorSectionProps) {
  return (
    <section
      id={id}
      style={{
        position: "relative",
        padding: "4.5rem 1.5rem 3.5rem",
        maxWidth: 860,
        width: "100%",
        margin: "0 auto",
        scrollMarginTop: "90px",
      }}
    >
      {/* Slate header */}
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
          <div
            style={{
              fontFamily: T.mono,
              fontSize: "0.62rem",
              letterSpacing: "0.22em",
              color: T.amber,
              textTransform: "uppercase",
            }}
          >
            {credit}
          </div>
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
          {name}
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

      <SectionReveal delay={0.16}>
        <p
          style={{
            marginTop: "1.5rem",
            fontFamily: T.sans,
            fontSize: "1.05rem",
            lineHeight: 1.82,
            color: "rgba(232,222,192,0.76)",
            maxWidth: 720,
          }}
        >
          {summary}
        </p>
      </SectionReveal>

      <SectionReveal delay={0.22}>
        <div style={{ marginTop: "2.25rem" }}>{children}</div>
      </SectionReveal>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Claim — the "how to claim" block for each sponsor (steps + CTA)
// ─────────────────────────────────────────────────────────────────────────────
function Claim({
  badge,
  steps,
  cta,
  note,
  details,
}: {
  badge?: string;
  steps: React.ReactNode[];
  cta: { href: string; label?: string } | null;
  note?: React.ReactNode;
  details?: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "relative",
        background: "linear-gradient(150deg, rgba(28,22,8,0.6) 0%, rgba(10,8,3,0.95) 100%)",
        border: `1px solid ${T.border}`,
        padding: "2rem 1.85rem 1.75rem",
      }}
    >
      {/* Corner register marks */}
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
          How to claim
        </span>
        {badge && (
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
            {badge}
          </span>
        )}
      </div>

      <ol style={{ listStyle: "none", padding: 0, margin: "0.5rem 0 1.4rem" }}>
        {steps.map((s, i) => (
          <Step key={i} n={i + 1}>
            {s}
          </Step>
        ))}
      </ol>

      {cta && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
          <ClaimButton href={cta.href} label={cta.label} />
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
      )}

      {note && <div style={{ marginTop: "1rem" }}>{note}</div>}

      {details && (
        <details
          style={{
            marginTop: "1.5rem",
            borderTop: "1px dashed rgba(200,170,80,0.14)",
            paddingTop: "1rem",
          }}
        >
          <summary
            style={{
              cursor: "pointer",
              fontFamily: T.mono,
              fontSize: "0.62rem",
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              color: T.amberDim,
              listStyle: "none",
              userSelect: "none",
            }}
          >
            + Tips, docs & what to use it for
          </summary>
          <div
            style={{
              marginTop: "1.1rem",
              fontFamily: T.sans,
              fontSize: "0.98rem",
              lineHeight: 1.75,
              color: "rgba(232,222,192,0.72)",
            }}
          >
            {details}
          </div>
        </details>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tip / UseList — small reusable blocks for the details sections
// ─────────────────────────────────────────────────────────────────────────────
function SubHead({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: T.mono,
        fontSize: "0.58rem",
        letterSpacing: "0.28em",
        textTransform: "uppercase",
        color: T.amber,
        margin: "1.25rem 0 0.6rem",
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
            color: "rgba(232,222,192,0.74)",
          }}
        >
          <span
            style={{
              position: "absolute",
              left: 0,
              top: "0.65rem",
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

const WAN_ALIBABA_SLACK =
  "https://join.slack.com/share/enQtMTA5NDE0NDkyMzY2NjEtNzhmZDk3YWJlNmNjNzMyZDE3YzRmYzEzYzA5MGVlODlmZDlmYzBiOWMzOTcwNTc1ZTdkMzUxNjcxYTcwNWU1OQ";

// ─────────────────────────────────────────────────────────────────────────────
// CreditsPage
// ─────────────────────────────────────────────────────────────────────────────
const CreditsPage: React.FC = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: T.gold,
        overflowX: "hidden",
      }}
    >
      {/* Global film grain */}
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
      {/* Global vignette */}
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
      {/* Registration corner marks */}
      {(
        [
          {
            top: "1rem",
            left: "1rem",
            borderTop: "1px solid rgba(198,153,58,0.38)",
            borderLeft: "1px solid rgba(198,153,58,0.38)",
          },
          {
            top: "1rem",
            right: "1rem",
            borderTop: "1px solid rgba(198,153,58,0.38)",
            borderRight: "1px solid rgba(198,153,58,0.38)",
          },
          {
            bottom: "1rem",
            left: "1rem",
            borderBottom: "1px solid rgba(198,153,58,0.38)",
            borderLeft: "1px solid rgba(198,153,58,0.38)",
          },
          {
            bottom: "1rem",
            right: "1rem",
            borderBottom: "1px solid rgba(198,153,58,0.38)",
            borderRight: "1px solid rgba(198,153,58,0.38)",
          },
        ] as React.CSSProperties[]
      ).map((style, i) => (
        <div
          key={i}
          style={{
            position: "fixed",
            width: 32,
            height: 32,
            pointerEvents: "none",
            zIndex: 9998,
            ...style,
          }}
        />
      ))}

      <Navigation />

      <main style={{ position: "relative" }}>
        {/* ═══════════════════════════════════════════════════════════════════
            HOW TO USE CREDITS — read first
            ═══════════════════════════════════════════════════════════════ */}
        <section
          style={{
            padding: "7.5rem 1.5rem 0",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <SectionReveal>
            <div
              style={{
                maxWidth: 680,
                width: "100%",
                padding: "1.35rem 1.5rem",
                border: `1px solid ${T.borderStrong}`,
                background: "rgba(200,170,80,0.06)",
                borderRadius: 2,
              }}
            >
              <div
                style={{
                  fontFamily: T.mono,
                  fontSize: "0.62rem",
                  letterSpacing: "0.26em",
                  textTransform: "uppercase",
                  color: T.amber,
                  marginBottom: "0.65rem",
                }}
              >
                Before you spend credits
              </div>
              <p
                style={{
                  margin: 0,
                  fontFamily: T.sans,
                  fontSize: "1.05rem",
                  lineHeight: 1.75,
                  color: "rgba(232,222,192,0.88)",
                }}
              >
                Use <strong style={{ color: T.goldSoft, fontWeight: 600 }}>cheaper models</strong> while you are
                iterating ideas and prompts. Switch to <strong style={{ color: T.goldSoft, fontWeight: 600 }}>more expensive models</strong> once you are
                happy with the prompt and ready for a final-quality render.
              </p>
              <p
                style={{
                  margin: "1rem 0 0",
                  fontFamily: T.sans,
                  fontSize: "1.02rem",
                  lineHeight: 1.72,
                  color: "rgba(232,222,192,0.78)",
                }}
              >
                If you are running low, talk to us — we can try to get more credits.{" "}
                <strong style={{ color: T.goldSoft, fontWeight: 600 }}>Do not let credits get in the middle of your creative flow.</strong>
              </p>
            </div>
          </SectionReveal>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            HERO
            ═══════════════════════════════════════════════════════════════ */}
        <section
          style={{
            position: "relative",
            minHeight: "52vh",
            padding: "3rem 1.5rem 3.5rem",
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
              Sponsor credits
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1}>
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
              Claim Your <em style={{ fontWeight: 300 }}>Credits</em>
            </h1>
          </SectionReveal>

          <SectionReveal delay={0.2}>
            <div
              style={{
                marginTop: "1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "0.8rem",
                justifyContent: "center",
              }}
            >
              <div style={{ width: 28, height: 1, background: "rgba(200,170,80,0.3)" }} />
              <div
                style={{
                  fontFamily: T.mono,
                  fontSize: "clamp(0.65rem, 1.1vw, 0.8rem)",
                  color: T.amber,
                  letterSpacing: "0.26em",
                  textTransform: "uppercase",
                }}
              >
                Wan AI · fal.ai · ElevenLabs
              </div>
              <div style={{ width: 28, height: 1, background: "rgba(200,170,80,0.3)" }} />
            </div>
          </SectionReveal>

          <SectionReveal delay={0.3}>
            <p
              style={{
                fontFamily: T.sans,
                fontWeight: 400,
                fontSize: "clamp(1.05rem, 1.65vw, 1.2rem)",
                color: "rgba(232,222,192,0.78)",
                maxWidth: 560,
                lineHeight: 1.65,
                margin: "1.75rem auto 0",
              }}
            >
              Follow the steps in each section below. Jump to a sponsor using the buttons.
            </p>
          </SectionReveal>

          <SectionReveal delay={0.4}>
            <div
              style={{
                marginTop: "2.75rem",
                display: "flex",
                flexWrap: "wrap",
                gap: "0.6rem",
                justifyContent: "center",
              }}
            >
              {[
                { label: "Wan AI", href: "#wan-ai" },
                { label: "fal.ai · $75", href: "#fal-ai" },
                { label: "ElevenLabs · Pro", href: "#elevenlabs" },
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
            FREE TO USE ANYTHING — set expectations
            ═══════════════════════════════════════════════════════════════ */}
        <section
          style={{
            padding: "1.5rem 1.5rem 2.25rem",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <SectionReveal>
            <div
              style={{
                maxWidth: 640,
                padding: "1rem 1.35rem",
                border: `1px solid ${T.border}`,
                background: "rgba(200,170,80,0.03)",
                fontFamily: T.sans,
                fontSize: "1rem",
                lineHeight: 1.65,
                color: "rgba(232,222,192,0.76)",
                textAlign: "center",
              }}
            >
              You can use any AI tools you want — these sponsor credits are extra runway, not a limit on what you build.
            </div>
          </SectionReveal>
        </section>

        <FilmStripBorder />
        <ActLabel number="I" title="Wan AI — via Alibaba Cloud" />

        {/* ═══════════════════════════════════════════════════════════════════
            WAN AI
            ═══════════════════════════════════════════════════════════════ */}
        <SponsorSection
          id="wan-ai"
          slate="01A"
          name="Wan AI"
          tag="Frontier video model — cinematic motion, strong image-to-video, excellent prompt adherence."
          credit="Credits via Alibaba Cloud"
          summary="Alibaba's flagship video generation family. Wan sits at the frontier alongside Veo, Kling, and Sora. It shines at image-to-video, start-frame / end-frame interpolation, and high-fidelity cinematic shots with explicit camera direction."
        >
          <Claim
            steps={[
              <>
                <strong style={{ color: T.goldSoft, fontWeight: 500 }}>
                  Create your Alibaba Cloud account.
                </strong>{" "}
                <A href="https://account.alibabacloud.com/register/intl_register.htm?spm=a2c63.p38356.0.0.147d6a4fZjSmAz&utm_source=luma">
                  Sign up here
                </A>
                {" · "}
                <A href="https://drive.google.com/file/d/1xQlf50sDWHXjfAZIEFdfvWNx50DvKHgA/view?usp=sharing">
                  Video walkthrough
                </A>
              </>,
              <>
                <strong style={{ color: T.goldSoft, fontWeight: 500 }}>
                  Verify your phone number and add payment details.
                </strong>{" "}
                <span style={{ color: T.amberDim }}>
                  You will not be charged — to be safe, use a Revolut card with a limited balance.
                </span>
              </>,
              <>
                <strong style={{ color: T.goldSoft, fontWeight: 500 }}>
                  Fill out the credit request form.
                </strong>{" "}
                <A href="https://survey.alibabacloud.com/uone/sg/survey/deV0MBiha">
                  survey.alibabacloud.com/uone/sg/survey/deV0MBiha
                </A>
              </>,
              <>
                <strong style={{ color: T.goldSoft, fontWeight: 500 }}>
                  Start generating.
                </strong>{" "}
                Open{" "}
                <A href="https://bailian.console.alibabacloud.com">
                  Model Studio
                </A>{" "}
                → Vision → Video Generation.
              </>,
            ]}
            cta={{ href: "https://account.alibabacloud.com/register/intl_register.htm?spm=a2c63.p38356.0.0.147d6a4fZjSmAz&utm_source=luma", label: "Create Alibaba Cloud account" }}
            note={
              <Callout title="Wan / Alibaba support (Slack)">
                Trouble claiming credits or need help from the Alibaba team? Join the support Slack:{" "}
                <A href={WAN_ALIBABA_SLACK}>Wan support channel (invite link)</A>.
              </Callout>
            }
            details={
              <>
                <SubHead>What to use it for</SubHead>
                <Bullets
                  items={[
                    "Image-to-video with precise motion control",
                    "Start-frame / end-frame interpolation — give it two images, Wan generates the clip between them",
                    "High-fidelity cinematic shots with explicit camera direction",
                    "Scenes where prompt adherence matters more than anything else",
                  ]}
                />

                <SubHead>Tips</SubHead>
                <Bullets
                  items={[
                    "Image-to-video with Wan outperforms most text-to-video on consistency. Start from a locked still whenever possible.",
                    <>Use explicit camera direction in prompts — <em>"slow dolly in"</em>, <em>"handheld tracking left"</em>, <em>"low angle, wide lens"</em>.</>,
                    "Wan handles long prompts well. Be specific about lighting, lens, mood, and pacing.",
                    "Keep your best stills from image generation and feed them back in. Wan respects a good reference frame.",
                  ]}
                />

                <SubHead>Docs &amp; links</SubHead>
                <Bullets
                  items={[
                    <>Model Studio console — <A href="https://bailian.console.alibabacloud.com">bailian.console.alibabacloud.com</A></>,
                    <>Wan model docs — <A href="https://alibabacloud.com/help/en/model-studio">alibabacloud.com/help/en/model-studio</A></>,
                    <>Wan on GitHub (open weights) — <A href="https://github.com/Wan-Video">github.com/Wan-Video</A></>,
                    <>Support Slack (Alibaba team) — <A href={WAN_ALIBABA_SLACK}>join Slack invite</A></>,
                  ]}
                />
              </>
            }
          />
        </SponsorSection>

        <FilmStripBorder compact />
        <ActLabel number="II" title="fal.ai — $75 per participant" />

        {/* ═══════════════════════════════════════════════════════════════════
            FAL.AI
            ═══════════════════════════════════════════════════════════════ */}
        <SponsorSection
          id="fal-ai"
          slate="02A"
          name="fal.ai"
          tag="One account, one API key — access to hundreds of the best AI media models."
          credit="$75 USD per participant"
          summary="A fast-inference platform for AI media models. Generate stills (FLUX, Imagen, SDXL), turn stills into clips (Kling, Hailuo, Minimax, LTX, Luma Ray, Veo), do lipsync, video-to-video, upscaling, and audio — all behind one API key."
        >
          <Claim
            steps={[
              <>
                <strong style={{ color: T.goldSoft, fontWeight: 500 }}>
                  Open the coupon claim link.
                </strong>{" "}
                <A href="https://fal.ai/coupon-claim/givego-fal">
                  fal.ai/coupon-claim/givego-fal
                </A>
              </>,
              <>
                <strong style={{ color: T.goldSoft, fontWeight: 500 }}>
                  Sign in or create a fal account
                </strong>{" "}
                <span style={{ color: T.amberDim }}>
                  — credits drop into your wallet automatically.
                </span>
              </>,
              <>
                <strong style={{ color: T.goldSoft, fontWeight: 500 }}>
                  Browse the playground first.
                </strong>{" "}
                <A href="https://fal.ai/models">fal.ai/models</A>
                {" — "}
                <span style={{ color: T.amberDim }}>free to browse, costs to run.</span>
              </>,
            ]}
            cta={{ href: "https://fal.ai/coupon-claim/givego-fal", label: "Claim $75 on fal.ai" }}
            details={
              <>
                <SubHead>What to use it for</SubHead>
                <Bullets
                  items={[
                    "Character portraits and scene stills (FLUX, Imagen, SDXL, and more)",
                    "Turning stills into video clips (Kling, Hailuo, Minimax, LTX, Luma Ray, Veo)",
                    "Lipsync — match generated audio to a character's mouth",
                    "Video-to-video transformations and style transfer",
                    "Upscaling and frame interpolation for final polish",
                    "Audio generation when ElevenLabs doesn't fit the need",
                  ]}
                />

                <SubHead>Tips</SubHead>
                <Bullets
                  items={[
                    "Use the playground before you burn API credits. Browsing is free.",
                    "For character consistency, generate a strong portrait first, then feed it as a reference image into image-to-video models.",
                    "Kling 2.x and Hailuo are strong on cinematic motion. Minimax holds emotion well on close-ups. LTX is fastest for quick iteration.",
                    "Upscale at the very end. Do not upscale drafts.",
                    "Batch generations whenever you can. Faster and cheaper than iterating one at a time.",
                  ]}
                />

                <SubHead>Docs &amp; links</SubHead>
                <Bullets
                  items={[
                    <>Playground — <A href="https://fal.ai">fal.ai</A></>,
                    <>Model catalogue — <A href="https://fal.ai/models">fal.ai/models</A></>,
                    <>Docs — <A href="https://docs.fal.ai">docs.fal.ai</A></>,
                    <>Discord — <A href="https://discord.gg/fal-ai">discord.gg/fal-ai</A></>,
                  ]}
                />
              </>
            }
          />
        </SponsorSection>

        <FilmStripBorder compact />
        <ActLabel number="III" title="ElevenLabs — Pro account per participant" />

        {/* ═══════════════════════════════════════════════════════════════════
            ELEVENLABS
            ═══════════════════════════════════════════════════════════════ */}
        <SponsorSection
          id="elevenlabs"
          slate="03A"
          name="ElevenLabs"
          tag="The leading voice AI stack — TTS, voice cloning, voice design, SFX, music, dubbing."
          credit="Pro account per participant (~$90)"
          summary="Pro unlocks approximately 500,000 characters per month, professional voice cloning, higher-quality audio, and a commercial licence. Use it for dialogue, foley, score, and dubbing across your whole film."
        >
          <Claim
            steps={[
              <>
                <strong style={{ color: T.goldSoft, fontWeight: 500 }}>Join the Discord.</strong>{" "}
                <A href="https://discord.com/invite/VnBvbbcdEC">
                  discord.com/invite/VnBvbbcdEC
                </A>
              </>,
              <>
                <strong style={{ color: T.goldSoft, fontWeight: 500 }}>
                  Open the #coupon-codes channel.
                </strong>{" "}
                <span style={{ color: T.amberDim }}>
                  Access is automatic once you join.
                </span>
              </>,
              <>
                <strong style={{ color: T.goldSoft, fontWeight: 500 }}>
                  Click "Start Redemption"
                </strong>{" "}
                on the pinned bot message.
              </>,
              <>
                <strong style={{ color: T.goldSoft, fontWeight: 500 }}>
                  Select the event and fill out the form.
                </strong>{" "}
                <span style={{ color: T.amberDim }}>
                  Use the email address you registered with for this hackathon.
                </span>
              </>,
              <>
                <strong style={{ color: T.goldSoft, fontWeight: 500 }}>
                  The bot DMs you a unique coupon code.
                </strong>{" "}
                Redeem it on your ElevenLabs account to unlock Pro.
              </>,
            ]}
            cta={{ href: "https://discord.com/invite/VnBvbbcdEC", label: "Open ElevenLabs Discord" }}
            note={
              <Callout title="Video tutorial">
                Prefer to watch? <A href="https://youtu.be/S143_JtCtV8">youtu.be/S143_JtCtV8</A>{" "}
                walks through the full redemption flow.
              </Callout>
            }
            details={
              <>
                <SubHead>What to use it for</SubHead>
                <Bullets
                  items={[
                    <><strong style={{ color: T.goldSoft, fontWeight: 500 }}>Dialogue.</strong> Narration, character voices, monologues.</>,
                    <><strong style={{ color: T.goldSoft, fontWeight: 500 }}>Voice cloning.</strong> Record 30 seconds of a real actor (with their permission), generate any line in their voice.</>,
                    <><strong style={{ color: T.goldSoft, fontWeight: 500 }}>Voice design.</strong> Describe a voice in text, get a synthetic voice that matches.</>,
                    <><strong style={{ color: T.goldSoft, fontWeight: 500 }}>Sound effects.</strong> Bespoke foley and effects from a text prompt.</>,
                    <><strong style={{ color: T.goldSoft, fontWeight: 500 }}>Music.</strong> Original scoring via ElevenLabs Music.</>,
                    <><strong style={{ color: T.goldSoft, fontWeight: 500 }}>Dubbing.</strong> Translate dialogue into another language while keeping the original voice.</>,
                  ]}
                />

                <SubHead>Tips</SubHead>
                <Bullets
                  items={[
                    "The voice library has thousands of ready voices. Audition before you clone.",
                    <>Use emotion and style cues in prompts — <code style={{ fontFamily: T.mono, color: T.amber }}>[whispering]</code>, <code style={{ fontFamily: T.mono, color: T.amber }}>[breathless]</code>, <code style={{ fontFamily: T.mono, color: T.amber }}>[laughing]</code> — to shape delivery.</>,
                    "Render final dialogue at the end, once picture timing is locked. Re-rendering is cheap.",
                    <>Use Sound Effects for foley you can't find — <em>"wet boots on cobblestones, distant thunder"</em>.</>,
                    "Export audio at the highest quality. You can always downsample in the editor.",
                    <>Dialogue sits better with a touch of room tone underneath. Generate 30 seconds of <em>"quiet office ambience"</em> or <em>"empty forest at night"</em> and lay it under the whole scene.</>,
                  ]}
                />

                <SubHead>Docs &amp; links</SubHead>
                <Bullets
                  items={[
                    <>Main — <A href="https://elevenlabs.io">elevenlabs.io</A></>,
                    <>Docs — <A href="https://elevenlabs.io/docs">elevenlabs.io/docs</A></>,
                    <>Voice library — <A href="https://elevenlabs.io/app/voice-library">elevenlabs.io/app/voice-library</A></>,
                    <>Sound effects — <A href="https://elevenlabs.io/app/sound-effects">elevenlabs.io/app/sound-effects</A></>,
                  ]}
                />
              </>
            }
          />
        </SponsorSection>

        <FilmStripBorder compact />

        {/* ═══════════════════════════════════════════════════════════════════
            FOOTER
            ═══════════════════════════════════════════════════════════════ */}
        <footer
          style={{
            padding: "4rem 1.5rem 3rem",
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
              · That's a wrap ·
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
              Stuck on any claim step? Grab a Give(a)Go mentor on the floor or email{" "}
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
        details summary::-webkit-details-marker { display: none; }
        details[open] summary { color: ${T.amber}; }
      `}</style>
    </div>
  );
};

export default CreditsPage;
