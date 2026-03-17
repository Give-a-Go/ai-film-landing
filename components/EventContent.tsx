import React, { useRef, useEffect, useState } from "react";
import WaitlistMorph from "./WaitlistMorph";

// ─────────────────────────────────────────────────────────────────────────────
// Design tokens
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  gold: "rgba(248,236,188,0.97)",
  amber: "rgba(200,170,80,0.65)",
  amberDim: "rgba(200,170,80,0.25)",
  muted: "rgba(255,255,255,0.32)",
  dim: "rgba(255,255,255,0.12)",
  accent: "#E85D35",
  border: "rgba(200,170,80,0.18)",
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
          fontSize: "0.6rem",
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
          fontSize: "0.6rem",
          letterSpacing: "0.28em",
          color: T.amberDim,
          textTransform: "uppercase",
        }}
      >
        {title}
      </span>
      <div style={{ flex: 1, height: 1, background: T.border, maxWidth: 80 }} />
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
          animation: "ecDrift 24s ease-in-out infinite",
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
      style={{
        position: "relative",
        background:
          "linear-gradient(160deg, rgba(30,24,8,0.96) 0%, rgba(8,6,2,1) 100%)",
        border: `1px solid ${T.border}`,
        flex: "1 1 320px",
        maxWidth: 460,
        display: "flex",
        overflow: "visible",
      }}
    >
      {/* Notch cutouts */}
      {["top", "bottom"].map((pos) => (
        <div
          key={pos}
          style={{
            position: "absolute",
            right: 46,
            [pos]: -9,
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "#000",
            border: `1px solid ${T.border}`,
            zIndex: 2,
          }}
        />
      ))}

      {/* Main body */}
      <div
        style={{
          flex: 1,
          padding: "2.5rem 2rem",
          borderRight: `1px dashed rgba(200,170,80,0.14)`,
          display: "flex",
          flexDirection: "column",
          gap: "0",
        }}
      >
        {/* Header row */}
        <div
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
          style={{
            fontFamily: T.sans,
            fontSize: "0.875rem",
            color: "rgba(255,255,255,0.4)",
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
        style={{
          width: 44,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(200,170,80,0.02)",
        }}
      >
        <span
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            fontFamily: T.mono,
            fontSize: "0.45rem",
            letterSpacing: "0.25em",
            color: "rgba(200,170,80,0.2)",
            textTransform: "uppercase",
          }}
        >
          Admit One
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
// EventContent
// ─────────────────────────────────────────────────────────────────────────────

const EventContent: React.FC = () => {
  return (
    <div
      style={{
        background: "#000",
        fontFamily: T.sans,
      }}
    >
      {/* ── Feature Presentation bridge ──────────────────────────────────── */}
      <div
        id="feature-presentation"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "2rem 2rem 2rem",
          gap: "0.65rem",
        }}
      >
        <div
          style={{
            width: "min(480px,70vw)",
            height: 1,
            background: "rgba(200,170,80,0.15)",
          }}
        />
        <div
          style={{
            fontFamily: T.mono,
            fontSize: "0.6rem",
            letterSpacing: "0.55em",
            color: "rgba(200,170,80,0.3)",
            textTransform: "uppercase",
          }}
        >
          Feature Presentation
        </div>
        <div
          style={{
            width: "min(480px,70vw)",
            height: 1,
            background: "rgba(200,170,80,0.15)",
          }}
        />
      </div>

      {/* ── Stats strip ──────────────────────────────────────────────────── */}
      <div
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
          "★★★★★",
          "48 HRS",
          "02 DAYS",
          "DUBLIN · IRELAND",
          "2025",
          "HACKATHON v2",
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
        style={{
          maxWidth: 1160,
          margin: "0 auto",
          padding: "6rem 2.5rem 5rem",
        }}
      >
        <SectionReveal>
          <SectionLabel no="01" title="Opening Night" />
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
                  letterSpacing: "-0.01em",
                  margin: "0 0 1.5rem",
                  textShadow: "0 0 80px rgba(255,215,60,0.18)",
                }}
              >
                AI Film Making
                <br />
                <span
                  style={{
                    fontWeight: 300,
                    fontStyle: "italic",
                    fontSize: "0.82em",
                  }}
                >
                  Hackathon v2
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
                  color: "rgba(255,255,255,0.45)",
                  lineHeight: 1.75,
                  maxWidth: 480,
                  margin: "0 0 2.75rem",
                }}
              >
                The best engineers and creatives from Ireland and Europe race to
                create AI-powered short films in a single day — then screen them
                at a semi black-tie premiere.
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
                <WaitlistMorph />
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
                  fontFamily: T.mono,
                  fontSize: "0.58rem",
                  letterSpacing: "0.18em",
                  color: T.muted,
                  textTransform: "uppercase",
                }}
              >
                Organised by Give(a)Go &amp; Napkin
              </div>
            </SectionReveal>
          </div>

          {/* Right — info cards */}
          <SectionReveal
            delay={0.2}
            style={{ display: "flex", flexDirection: "column", gap: "0" }}
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
            <InfoCard label="Date" value="2025" sub="To be announced" />
            <InfoCard
              label="Location"
              value="Dublin, Ireland"
              sub="Venue TBC"
            />
            <InfoCard
              label="Format"
              value="2-Day Event"
              sub="Day 1 filming · Day 2 premiere"
            />
            <InfoCard
              label="Edition"
              value="Hackathon v2"
              sub="Second annual AI film hackathon"
            />
          </SectionReveal>
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
            Two Days of Cinema
          </h2>
        </SectionReveal>

        <div
          style={{
            display: "flex",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          <SectionReveal delay={0.1} style={{ flex: "1 1 300px" }}>
            <TicketCard
              day="Day 01"
              scene="Scene 01 / Take 01"
              title="Filmmaking Day"
              description="Teams form at the start of the day and race to create compelling AI-powered short films — from concept, script, and production through to final cut — all within a single day."
              meta1="Runtime: 12 hrs"
              meta2="Genre: Hackathon"
            />
          </SectionReveal>
          <SectionReveal delay={0.2} style={{ flex: "1 1 300px" }}>
            <TicketCard
              day="Day 02"
              scene="Scene 02 / Take 01"
              title="Cinema Screening"
              description="A semi black-tie premiere event. Films are screened on the big stage, the audience votes, awards are presented. A night of cinema, community, and celebration."
              meta1="Runtime: Eve."
              meta2="Genre: Premiere"
              badge="Now Showing"
            />
          </SectionReveal>
        </div>
      </section>

      <FilmStrip />

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 03 — SPONSORS
          ════════════════════════════════════════════════════════════════════ */}
      <section
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
              margin: "0 0 4rem",
              lineHeight: 1.1,
            }}
          >
            Made Possible By
          </h2>
        </SectionReveal>

        <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
          <SectionReveal delay={0.1}>
            <div>
              <div
                style={{
                  fontFamily: T.mono,
                  fontSize: "0.58rem",
                  letterSpacing: "0.3em",
                  color: T.amberDim,
                  textTransform: "uppercase",
                  marginBottom: "1.5rem",
                }}
              >
                Sponsored By
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                <SponsorLogoCard
                  src="/partners/elevenlabs-logo-white.svg"
                  alt="ElevenLabs"
                  kind="dark"
                  imageStyle={{ maxWidth: "90%", maxHeight: "82%" }}
                />
                <SponsorLogoCard
                  src="/partners/wan.png"
                  alt="Wan"
                  kind="purple"
                />
                <SponsorLogoCard
                  src="/partners/wolfpack-digital-light.png"
                  alt="Wolfpack Digital"
                  kind="dark"
                  containerStyle={{
                    width: "clamp(124px, 16.8vw, 198px)",
                    height: 54,
                  }}
                  imageStyle={{ maxWidth: "112%", maxHeight: "100%" }}
                />
              </div>
            </div>
          </SectionReveal>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ flex: 1, height: 1, background: T.dim }} />
            <ReelIcon />
            <div style={{ flex: 1, height: 1, background: T.dim }} />
          </div>

          <SectionReveal delay={0.2}>
            <div>
              <div
                style={{
                  fontFamily: T.mono,
                  fontSize: "0.58rem",
                  letterSpacing: "0.3em",
                  color: T.amberDim,
                  textTransform: "uppercase",
                  marginBottom: "1.5rem",
                }}
              >
                Fueled By
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                <SponsorLogoCard
                  src="/partners/redbull.png"
                  alt="Red Bull"
                  kind="light"
                />
              </div>
            </div>
          </SectionReveal>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ flex: 1, height: 1, background: T.dim }} />
            <ReelIcon />
            <div style={{ flex: 1, height: 1, background: T.dim }} />
          </div>

          <SectionReveal delay={0.3}>
            <div>
              <div
                style={{
                  fontFamily: T.mono,
                  fontSize: "0.58rem",
                  letterSpacing: "0.3em",
                  color: T.amberDim,
                  textTransform: "uppercase",
                  marginBottom: "1.5rem",
                }}
              >
                Organised By
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                {["Give(a)Go", "Napkin"].map((name) => (
                  <div
                    key={name}
                    style={{
                      height: 56,
                      minWidth: 160,
                      padding: "0 1.25rem",
                      border: `1px solid ${T.border}`,
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: T.sans,
                      fontWeight: 500,
                      fontSize: "0.9rem",
                      color: "rgba(248,236,188,0.5)",
                      background: T.cardBg,
                      letterSpacing: "0.03em",
                    }}
                  >
                    {name}
                  </div>
                ))}
              </div>
            </div>
          </SectionReveal>
        </div>

        <SectionReveal delay={0.4}>
          <div
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
          <div
            style={{
              fontFamily: T.mono,
              fontSize: "0.55rem",
              letterSpacing: "0.55em",
              color: "rgba(200,170,80,0.25)",
              textTransform: "uppercase",
              marginBottom: "1.75rem",
            }}
          >
            — Fin —
          </div>
          <a
            href="/"
            style={{
              display: "inline-block",
              padding: "1.1rem 3.5rem",
              background: "#E85D35",
              color: "#fff",
              fontFamily: T.sans,
              fontWeight: 600,
              fontSize: "0.88rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
              borderRadius: 2,
              boxShadow:
                "0 0 40px rgba(232,93,53,0.2), 0 2px 12px rgba(0,0,0,0.5)",
              transition: "transform .16s, box-shadow .16s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform =
                "translateY(-2px)";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 0 60px rgba(232,93,53,0.38), 0 6px 20px rgba(0,0,0,0.5)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 0 40px rgba(232,93,53,0.2), 0 2px 12px rgba(0,0,0,0.5)";
            }}
          >
            Apply to Join →
          </a>
          <div
            style={{
              fontFamily: T.mono,
              fontSize: "0.55rem",
              color: T.muted,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginTop: "1.5rem",
            }}
          >
            Organised by Give(a)Go &amp; Napkin
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
      `}</style>
    </div>
  );
};

export default EventContent;
