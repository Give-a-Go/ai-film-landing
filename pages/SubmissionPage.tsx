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

const SUBMISSION_FORM_URL = "https://forms.gle/zR2vtqS2qeNt15QX6";
const PREMIERE_REGISTRATION_URL = "/event";
const FAL_TOPAZ_UPSCALE_URL = "https://fal.ai/models/fal-ai/topaz/upscale/video";
const ELEVENLABS_TOPAZ_UPSCALE_URL = "https://elevenlabs.io/edit-video/upscaler";
const DAVINCI_RESOLVE_URL = "https://www.blackmagicdesign.com/products/davinciresolve/";
const REMOTION_URL = "https://www.remotion.dev/";
const CAPCUT_4K_EXPORT_URL = "https://www.capcut.com/help/export-videos-in-capcut";

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

function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      style={{
        marginTop: "0.9rem",
        border: `1px solid ${T.border}`,
        background: "rgba(0,0,0,0.2)",
      }}
    >
      <summary
        style={{
          cursor: "pointer",
          padding: "0.85rem 1rem",
          fontFamily: T.mono,
          fontSize: "0.68rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: T.amber,
        }}
      >
        {title}
      </summary>
      <div style={{ padding: "0 1rem 1rem", borderTop: `1px dashed ${T.border}` }}>
        {children}
      </div>
    </details>
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
// Pre-submission checklist — collapsible, gated flow
// ─────────────────────────────────────────────────────────────────────────────
type ChecklistId = "upscale" | "upload";

const CHECKLIST_ITEMS: {
  id: ChecklistId;
  index: number;
  title: string;
  summary: string;
}[] = [
  {
    id: "upscale",
    index: 1,
    title: "Upscale your film and polish sound",
    summary:
      "When your cut is locked, do one clean upscale pass and one short sound pass. Do this at the end, not during edits.",
  },
  {
    id: "upload",
    index: 2,
    title: "Upload to your own Google Drive and share it publicly",
    summary:
      "Two versions (upscaled + original) in a Team-XX folder on your own Drive, shared as \"Anyone with the link — Viewer\".",
  },
];

function ChecklistItem({
  index,
  title,
  summary,
  open,
  onBack,
  backLabel,
  onMarkDone,
  ctaLabel,
  children,
}: {
  index: number;
  title: string;
  summary: string;
  open: boolean;
  onBack?: () => void;
  backLabel?: string;
  onMarkDone: () => void;
  ctaLabel: string;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div
      style={{
        border: `1px solid ${T.borderStrong}`,
        background: "rgba(0,0,0,0.3)",
        marginBottom: "0.9rem",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "1.1rem 1.25rem",
          background: "transparent",
          border: "none",
          color: "inherit",
          textAlign: "left",
          fontFamily: "inherit",
        }}
      >
        <div
          style={{
            flexShrink: 0,
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: `1px solid ${T.borderStrong}`,
            background: "rgba(200,170,80,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: T.mono,
            fontSize: "0.88rem",
            color: T.amber,
          }}
          aria-hidden
        >
          {String(index).padStart(2, "0")}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: T.serif,
              fontSize: "clamp(1.05rem, 1.7vw, 1.22rem)",
              fontWeight: 600,
              color: T.gold,
              lineHeight: 1.25,
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: "0.3rem",
              fontFamily: T.sans,
              fontSize: "0.9rem",
              lineHeight: 1.55,
              color: "rgba(232,222,192,0.6)",
            }}
          >
            {summary}
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "0.2rem 1.25rem 1.5rem",
          borderTop: `1px dashed ${T.border}`,
        }}
      >
        {children}

        <div
          style={{
            marginTop: "1.5rem",
            display: "flex",
            gap: "0.8rem",
            alignItems: "center",
          }}
        >
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              style={{
                fontFamily: T.mono,
                fontSize: "0.66rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: T.amberDim,
                border: `1px solid ${T.border}`,
                background: "transparent",
                padding: "0.72rem 1.05rem",
                cursor: "pointer",
                borderRadius: 3,
                transition: "border-color 0.18s, color 0.18s, background 0.18s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = T.borderStrong;
                (e.currentTarget as HTMLElement).style.color = T.amber;
                (e.currentTarget as HTMLElement).style.background = "rgba(200,170,80,0.05)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = T.border;
                (e.currentTarget as HTMLElement).style.color = T.amberDim;
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              {backLabel ?? "Back"}
            </button>
          )}
          <button
            type="button"
            onClick={onMarkDone}
            style={{
              fontFamily: T.mono,
              fontSize: "0.72rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(230,255,230,0.96)",
              border: "1px solid rgba(140,210,150,0.6)",
              background: "rgba(140,210,150,0.10)",
              padding: "0.75rem 1.25rem",
              cursor: "pointer",
              borderRadius: 3,
              fontWeight: 600,
              transition: "background 0.18s, border-color 0.18s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(140,210,150,0.18)";
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(170,225,180,0.9)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(140,210,150,0.10)";
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(140,210,150,0.6)";
            }}
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SubmissionPage
// ─────────────────────────────────────────────────────────────────────────────
const SubmissionPage: React.FC = () => {
  const [hasOpenedForm, setHasOpenedForm] = useState(false);
  const [done, setDone] = useState<Record<ChecklistId, boolean>>({
    upscale: false,
    upload: false,
  });

  const [openId, setOpenId] = useState<ChecklistId | null>("upscale");

  const markDone = (id: ChecklistId) => {
    setDone((prev) => {
      const next = { ...prev, [id]: true };
      const nextUndone = CHECKLIST_ITEMS.find((x) => !next[x.id]);
      setOpenId(nextUndone ? nextUndone.id : null);
      return next;
    });
  };

  const completed = Object.values(done).filter(Boolean).length;
  const total = CHECKLIST_ITEMS.length;
  const allDone = completed === total;
  const progressPct = Math.round((completed / total) * 100);

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
              One checklist. <strong style={{ color: T.goldSoft, fontWeight: 600 }}>Two steps</strong> — each one
              expands for the details. Tick them off as you go and the{" "}
              <strong style={{ color: T.goldSoft, fontWeight: 600 }}>submission form unlocks</strong> at the bottom.
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
                { label: "Checklist", href: "#checklist" },
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
                from video models can look fine on a laptop and fall apart at cinema size. A clean upscale pass tightens
                grain, edges, faces, and motion. One focused audio pass makes the film feel finished.
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
                Lock the edit first, then upscale and polish audio once. Steps below.
              </p>
            </div>
          </SectionReveal>
        </section>

        <FilmStripBorder />

        {/* ═══════════════════════════════════════════════════════════════════
            PRE-SUBMISSION CHECKLIST — collapsible, gated
            ═══════════════════════════════════════════════════════════════ */}
        <section
          id="checklist"
          style={{
            position: "relative",
            padding: "3rem 1.5rem 2rem",
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
                Scene 01 · Checklist
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
              Pre-submission checklist
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
              Step 1, then Step 2. Complete both and the form unlocks at the end.
            </div>
          </SectionReveal>

          <SectionReveal delay={0.16}>
            <div
              style={{
                marginTop: "1.8rem",
                padding: "1rem 1.1rem",
                border: `1px solid ${T.border}`,
                background: "rgba(200,170,80,0.04)",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  fontFamily: T.mono,
                  fontSize: "0.62rem",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: allDone ? "rgba(200,255,200,0.95)" : T.amber,
                  whiteSpace: "nowrap",
                }}
              >
                Progress · {completed}/{total}
              </div>
              <div
                style={{
                  flex: 1,
                  minWidth: 140,
                  height: 6,
                  background: "rgba(200,170,80,0.1)",
                  borderRadius: 3,
                  overflow: "hidden",
                  position: "relative",
                }}
                aria-hidden
              >
                <div
                  style={{
                    width: `${progressPct}%`,
                    height: "100%",
                    background: allDone
                      ? "linear-gradient(90deg, rgba(140,210,150,0.7), rgba(180,230,180,0.95))"
                      : "linear-gradient(90deg, rgba(200,170,80,0.5), rgba(248,236,188,0.85))",
                    transition: "width 0.45s ease, background 0.45s ease",
                  }}
                />
              </div>
              <div
                style={{
                  fontFamily: T.mono,
                  fontSize: "0.62rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: T.amberDim,
                  whiteSpace: "nowrap",
                }}
              >
                {allDone ? "Ready to submit" : `${total - completed} left`}
              </div>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.22}>
            <div style={{ marginTop: "1.8rem" }}>
              {/* ───────────────────── Step 01 — Upscale & polish ───────────────────── */}
              <ChecklistItem
                index={CHECKLIST_ITEMS[0].index}
                title={CHECKLIST_ITEMS[0].title}
                summary={CHECKLIST_ITEMS[0].summary}
                open={openId === "upscale"}
                onMarkDone={() => markDone("upscale")}
                ctaLabel="Next · Step 2"
              >
                <p
                  style={{
                    marginTop: "1.25rem",
                    fontFamily: T.sans,
                    fontSize: "1rem",
                    lineHeight: 1.75,
                    color: "rgba(232,222,192,0.8)",
                  }}
                >
                  Use this as the final finish pass. Do it{" "}
                  <strong style={{ color: T.goldSoft, fontWeight: 600 }}>
                    after your short film is fully locked
                  </strong>{" "}
                  so you are not burning credits on versions you will cut later.
                </p>

                <CollapsibleSection title="Expand editing tool options" defaultOpen={false}>
                <Card style={{ marginTop: "1rem" }}>
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
                      Editing tools
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
                      4K safe
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
                    Use the editor you can move fastest in. For the final export, the tool needs to preserve frame rate,
                    resolution, audio sync, and clean joins if you upscaled in 30-second segments.
                  </p>

                  <Bullets
                    items={[
                      <>
                        <strong style={{ color: T.goldSoft, fontWeight: 600 }}>Best default:</strong>{" "}
                        <A href={DAVINCI_RESOLVE_URL}>DaVinci Resolve</A>. Use this if you are unsure. The free version
                        is enough for UHD 4K exports up to 3840×2160; Studio is only needed for beyond-4K or heavier
                        professional finishing.
                      </>,
                      <>
                        <strong style={{ color: T.goldSoft, fontWeight: 600 }}>Programmatic edit:</strong>{" "}
                        <A href={REMOTION_URL}>Remotion</A>. Use this when your film is assembled from code, templates,
                        generated captions, data, or repeatable React scenes.
                      </>,
                      <>
                        <strong style={{ color: T.goldSoft, fontWeight: 600 }}>Fast/simple edit:</strong>{" "}
                        <A href={CAPCUT_4K_EXPORT_URL}>CapCut</A> is alright for quick cuts, captions, and social-style
                        polish. Prefer desktop for 4K. Before submitting, export a test and check it full-screen because
                        4K availability and quality depend on device, platform, source media, and account limits.
                      </>,
                    ]}
                  />

                  <Callout title="Quick rule">
                    CapCut is fine if the export looks good. For cinema projection, DaVinci Resolve is the safer final
                    assembly tool, especially when combining upscaled segments or exporting a clean 2K/4K master.
                  </Callout>
                </Card>
                </CollapsibleSection>

                <CollapsibleSection title="Expand video upscale guide" defaultOpen={false}>
                <Card style={{ marginTop: "1rem" }}>
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
                Video upscale
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
                Final pass
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
              Recommended upscalers:{" "}
              <A href={FAL_TOPAZ_UPSCALE_URL}>Topaz Video Upscale on fal.ai</A>{" "}
              or{" "}
              <A href={ELEVENLABS_TOPAZ_UPSCALE_URL}>Topaz video upscaler on ElevenLabs</A>.
              If the tool only accepts 30 seconds at a time, split your locked export into 30-second segments, upscale
              each segment, then join the segments back together in order before your final export.
            </p>

            <ol style={{ listStyle: "none", padding: 0, margin: "0.5rem 0 1.4rem" }}>
              <Step n={1}>
                <strong style={{ color: T.goldSoft, fontWeight: 500 }}>
                  Export a locked native-resolution master.
                </strong>{" "}
                Export the final edit at whatever resolution your generations came out at, usually 720p or 1080p.
                Use H.264 or ProRes, constant frame rate, 23.976 or 24 fps.
              </Step>
              <Step n={2}>
                <strong style={{ color: T.goldSoft, fontWeight: 500 }}>
                  Upscale the locked master.
                </strong>{" "}
                Aim for at least 1080p, ideally 2K. Use 4K only if you have time and credits. Do not upscale drafts.
                <div style={{ marginTop: "0.55rem" }}>
                  <Bullets
                    items={[
                      <>
                        For 30-second tool limits, split the film into 30-second chunks, upscale each chunk, then combine.
                      </>,
                      <>
                        Keep the same frame rate throughout so the joins stay clean.
                      </>,
                      <>
                        Avoid extra recompression passes after the upscale.
                      </>,
                    ]}
                  />
                </div>
              </Step>
              <Step n={3}>
                <strong style={{ color: T.goldSoft, fontWeight: 500 }}>
                  Check the result before upload.
                </strong>{" "}
                Watch faces, text, fast motion, cuts between segments, and dark scenes on the biggest screen you can access.
              </Step>
              <Step n={4}>
                <strong style={{ color: T.goldSoft, fontWeight: 500 }}>
                  Keep an original backup.
                </strong>{" "}
                Upload both the upscaled version and the original native-resolution version in Step 2.
              </Step>
            </ol>

            <Callout tone="warn" title="Quality check before moving on">
              Upscalers can create artefacts. If a shot gets worse, use the original for that shot or keep the
              native-resolution version as the backup.
            </Callout>
          </Card>
          </CollapsibleSection>

          <CollapsibleSection title="Expand sound polish guide" defaultOpen={false}>
          <Card style={{ marginTop: "1rem" }}>
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
                Sound polish
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
                Final pass
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
              Keep this simple: make voices easy to hear, then add the sounds that stop scenes feeling empty.
            </p>

            <ol style={{ listStyle: "none", padding: 0, margin: "0.5rem 0 1.4rem" }}>
              <Step n={1}>
                <strong style={{ color: T.goldSoft, fontWeight: 500 }}>Clean dialogue and VO.</strong>{" "}
                Re-render final AI voices at your best quality setting. If you recorded audio on a phone or laptop, run it
                through a voice isolator or noise-reduction pass. The goal is simple: no hiss, no hum, no muffled lines.
              </Step>
              <Step n={2}>
                <strong style={{ color: T.goldSoft, fontWeight: 500 }}>
                  Add the missing scene sound.
                </strong>{" "}
                Do one pass through the film and fill obvious gaps:
                <div style={{ marginTop: "0.55rem" }}>
                  <Bullets
                    items={[
                      <>Put quiet ambience under each scene: office tone, street noise, rain, forest, room air.</>,
                      <>Add foley for visible actions: footsteps, doors, cloth movement, cups, bags, typing.</>,
                      <>Add obvious SFX only where needed: phone buzzes, thunder, cars, impacts, machines.</>,
                      <>Keep everything subtle. If a sound distracts from the story, lower it or remove it.</>,
                    ]}
                  />
                </div>
              </Step>
            </ol>

            <Callout title="Why this matters">
              Before upload, play the film once without stopping. You are checking three things: voices are clear, volume
              does not jump between scenes, and there is no dead silence where the room should have sound.
            </Callout>
          </Card>
          </CollapsibleSection>
              </ChecklistItem>

              {/* ───────────────────── Step 02 — Upload + share ───────────────────── */}
              <ChecklistItem
                index={CHECKLIST_ITEMS[1].index}
                title={CHECKLIST_ITEMS[1].title}
                summary={CHECKLIST_ITEMS[1].summary}
                open={openId === "upload"}
                onBack={() => setOpenId("upscale")}
                backLabel="Back · Step 1"
                onMarkDone={() => markDone("upload")}
                ctaLabel="Finish checklist"
              >
                <p
                  style={{
                    marginTop: "1.25rem",
                    fontFamily: T.sans,
                    fontSize: "1rem",
                    lineHeight: 1.75,
                    color: "rgba(232,222,192,0.8)",
                  }}
                >
                  You host the files. The premiere rolls straight from a link you paste into the submission form, so we
                  need <strong style={{ color: T.goldSoft, fontWeight: 600 }}>two versions</strong> in the same folder:
                  the upscaled cinema cut, and your original film file at whatever native resolution your generations came
                  out at. The original is the backup we fall back to if anything is off with the upscale on the night.
                </p>

                <CollapsibleSection title="Expand upload + sharing details" defaultOpen={false}>
                <Card style={{ marginTop: "1rem" }}>
            <ol style={{ listStyle: "none", padding: 0, margin: "0.5rem 0 1.4rem" }}>
              <Step n={1}>
                <strong style={{ color: T.goldSoft, fontWeight: 500 }}>
                  Create a new folder in your own Google Drive.
                </strong>{" "}
                Name it <code style={{ fontFamily: T.mono, color: T.amber }}>Team-XX_Film-Title</code> — replace XX
                with your team number (e.g. <code style={{ fontFamily: T.mono, color: T.amber }}>Team-07_The-Crossing</code>).
                Use hyphens. No spaces, no emojis.
              </Step>
              <Step n={2}>
                <strong style={{ color: T.goldSoft, fontWeight: 500 }}>
                  Upload two versions of your film into that folder:
                </strong>
                <div style={{ marginTop: "0.55rem" }}>
                  <Bullets
                    items={[
                      <>
                        <code style={{ fontFamily: T.mono, color: T.amber }}>
                          FINAL_Team-XX_Film-Title_UPSCALED.mp4
                        </code>{" "}
                        — the <strong style={{ color: T.goldSoft, fontWeight: 600 }}>upscaled short film file</strong>{" "}
                        for cinema projection. Aim for 2K (2048×1080) or 4K. This is what we project at the premiere.
                      </>,
                      <>
                        <code style={{ fontFamily: T.mono, color: T.amber }}>
                          FINAL_Team-XX_Film-Title_ORIGINAL.mp4
                        </code>{" "}
                        — your <strong style={{ color: T.goldSoft, fontWeight: 600 }}>original short film file</strong> at
                        whatever native resolution your generations came out at. Ideally 1080p; 720p is fine if
                        that's what you have. <em>Do not re-upscale or re-compress this one.</em>
                      </>,
                    ]}
                  />
                </div>
                <div style={{ marginTop: "0.55rem", fontSize: "0.95rem", lineHeight: 1.65, color: "rgba(232,222,192,0.7)" }}>
                  Both files: H.264, 23.976 or 24 fps, audio at 44.1 kHz. Target under 2 GB each.
                </div>
              </Step>
              <Step n={3}>
                <strong style={{ color: T.goldSoft, fontWeight: 500 }}>
                  Optional (can upload later): supporting files
                </strong>
                <div
                  style={{
                    marginTop: "0.4rem",
                    fontSize: "0.9rem",
                    lineHeight: 1.6,
                    color: "rgba(232,222,192,0.6)",
                  }}
                >
                  Priority is to upload the two film files above and submit first. You can add these support files later.
                </div>
                <div style={{ marginTop: "0.55rem" }}>
                  <Bullets
                    items={[
                      <>
                        <code style={{ fontFamily: T.mono, color: T.amber }}>poster.jpg</code> — a single still from
                        the film (for the premiere programme)
                      </>,
                      <>
                        <code style={{ fontFamily: T.mono, color: T.amber }}>bts/</code> — a sub-folder with any
                        behind-the-scenes stills, screen recordings, or short film workflow notes
                      </>,
                      <>
                        <code style={{ fontFamily: T.mono, color: T.amber }}>references/</code> — any reference
                        footage, mood boards, or source images you used (especially for the Reference-to-Video prize)
                      </>,
                    ]}
                  />
                </div>
              </Step>
              <Step n={4}>
                <strong style={{ color: T.goldSoft, fontWeight: 500 }}>
                  Set the folder to{" "}
                  <em>"Anyone with the link — Viewer"</em>.
                </strong>
                <div
                  style={{
                    marginTop: "0.55rem",
                    fontSize: "0.95rem",
                    lineHeight: 1.65,
                    color: "rgba(232,222,192,0.78)",
                  }}
                >
                  Right-click the folder →{" "}
                  <strong style={{ color: T.goldSoft, fontWeight: 600 }}>Share</strong> →{" "}
                  <strong style={{ color: T.goldSoft, fontWeight: 600 }}>Share</strong>. Under{" "}
                  <em>General access</em>, change <em>Restricted</em> to{" "}
                  <strong style={{ color: T.goldSoft, fontWeight: 600 }}>Anyone with the link</strong>, and confirm the
                  role is <strong style={{ color: T.goldSoft, fontWeight: 600 }}>Viewer</strong>. Then hit{" "}
                  <strong style={{ color: T.goldSoft, fontWeight: 600 }}>Copy link</strong>.
                </div>
                <div
                  style={{
                    marginTop: "0.4rem",
                    fontSize: "0.9rem",
                    lineHeight: 1.6,
                    color: "rgba(232,222,192,0.6)",
                  }}
                >
                  Do this on the <em>folder</em>, not each file individually — files inside inherit folder access.
                </div>
              </Step>
              <Step n={5}>
                <strong style={{ color: T.goldSoft, fontWeight: 500 }}>
                  Test the link in a private / incognito window.
                </strong>{" "}
                If the folder opens without asking you to sign in or request access, you're done. If it asks for
                access, it isn't shared correctly — go back to Step 4.
              </Step>
              <Step n={6}>
                <strong style={{ color: T.goldSoft, fontWeight: 500 }}>
                  Copy the folder link
                </strong>{" "}
                — you will paste it into the submission form in the next step.
              </Step>
            </ol>

            <Callout tone="warn" title="Most common submission failure: private folders.">
              Every year at least one team submits a link that still says <em>Restricted</em>. Judges can't view it,
              the projection desk can't download it, and we have to chase you at 4am. Before you hit submit,{" "}
              <strong style={{ color: T.goldSoft, fontWeight: 600 }}>
                open your Drive link in a private / incognito browser window
              </strong>{" "}
              — if it doesn't play without a login, it isn't shared correctly.
            </Callout>

            <Callout title="Why both versions?">
              Upscalers can introduce artefacts or colour shifts in parts of a short film. If anything looks off on the
              cinema screen, we switch to your original short film file for that title and move on — no panic, no last-minute
              re-exports. Upload both and you're covered either way.
            </Callout>

            <Callout title="Small but important 4K note">
              If you upscale your short film to 4K and then export your short film from a non-4K timeline, you can throw away most of that quality
              gain. If your edit setup struggles with one full 4K short film file, upload in parts instead using clear names like{" "}
              <code style={{ fontFamily: T.mono, color: T.amber }}>
                FINAL_Team-XX_Film-Title_UPSCALED_PART-01.mp4
              </code>
              ,{" "}
              <code style={{ fontFamily: T.mono, color: T.amber }}>
                ..._PART-02.mp4
              </code>
              , etc.
            </Callout>

            <Callout tone="warn" title="File size getting big?">
              Export at H.264 High Profile, CRF 18–20, 10–16 Mbps. That is visually indistinguishable from an
              uncompressed film file at 1080p and cuts file size by 3–4×. Keep the uncompressed film file on your own
              machine in case we ask for it later.
            </Callout>
          </Card>
          </CollapsibleSection>
              </ChecklistItem>
            </div>
          </SectionReveal>

          {/* ───────────────── Gated submit CTA — appears when both steps are done ───────────────── */}
          <SectionReveal delay={0.28}>
            <div
              style={{
                marginTop: "2.5rem",
                padding: "2rem 1.85rem",
                border: `1px solid ${
                  allDone ? "rgba(170,225,180,0.55)" : T.border
                }`,
                background: allDone
                  ? "linear-gradient(150deg, rgba(140,210,150,0.08) 0%, rgba(10,8,3,0.85) 100%)"
                  : "linear-gradient(150deg, rgba(28,22,8,0.55) 0%, rgba(10,8,3,0.95) 100%)",
                boxShadow: allDone
                  ? "0 0 60px rgba(140,210,150,0.14)"
                  : "none",
                textAlign: "center",
                transition: "border-color 0.45s, background 0.45s, box-shadow 0.45s",
              }}
            >
              <div
                style={{
                  fontFamily: T.mono,
                  fontSize: "0.6rem",
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: allDone
                    ? "rgba(200,255,210,0.92)"
                    : T.amberDim,
                  marginBottom: "0.8rem",
                }}
              >
                {allDone ? "· All steps complete ·" : `· Locked — ${total - completed} step${total - completed === 1 ? "" : "s"} to go ·`}
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
                {allDone
                  ? "You're ready. Submit your film."
                  : "Finish the checklist to unlock the form."}
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
                {allDone ? (
                  <>
                    Upscaled, uploaded, answers drafted. One submission per team — you can edit it until the deadline.
                    See you at the premiere.
                  </>
                ) : (
                  <>
                    Work through steps 01–0{total} above. As you mark each one complete, the next one opens. The submit
                    button below activates only when every step is ticked.
                  </>
                )}
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.8rem",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {allDone ? (
                  <button
                    type="button"
                    onClick={() => {
                      window.open(
                        SUBMISSION_FORM_URL,
                        "_blank",
                        "noopener,noreferrer",
                      );
                      setHasOpenedForm(true);
                    }}
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
                      border: "none",
                      borderRadius: 3,
                      boxShadow:
                        "0 0 28px rgba(232,93,53,0.28), 0 2px 10px rgba(0,0,0,0.55)",
                      cursor: "pointer",
                    }}
                  >
                    Open submission form →
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    aria-disabled
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.6rem",
                      padding: "1rem 1.9rem",
                      background: "rgba(80,60,30,0.35)",
                      color: "rgba(232,222,192,0.35)",
                      fontFamily: T.sans,
                      fontWeight: 600,
                      fontSize: "0.88rem",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      border: `1px solid ${T.border}`,
                      borderRadius: 3,
                      cursor: "not-allowed",
                    }}
                  >
                    ⌕ Submission form locked
                  </button>
                )}
              </div>

              {allDone && hasOpenedForm && (
                <div
                  style={{
                    marginTop: "1.2rem",
                    border: `1px solid ${T.borderStrong}`,
                    background: "rgba(200,170,80,0.05)",
                    padding: "1rem 1.05rem",
                    textAlign: "left",
                    maxWidth: 640,
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <div
                    style={{
                      fontFamily: T.mono,
                      fontSize: "0.58rem",
                      letterSpacing: "0.24em",
                      textTransform: "uppercase",
                      color: T.amber,
                      marginBottom: "0.6rem",
                    }}
                  >
                    See you at the premiere
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: T.sans,
                      fontSize: "0.95rem",
                      lineHeight: 1.7,
                      color: "rgba(232,222,192,0.82)",
                    }}
                  >
                    Wear a formal outfit. Bring your friends and family. Share the registration link{" "}
                    <a
                      href={PREMIERE_REGISTRATION_URL}
                      style={{
                        color: T.amber,
                        textDecoration: "none",
                        borderBottom: "1px solid rgba(200,170,80,0.35)",
                      }}
                    >
                      here
                    </a>
                    .
                  </p>
                  <div
                    style={{
                      marginTop: "0.75rem",
                      fontFamily: T.sans,
                      fontSize: "0.94rem",
                      color: "rgba(232,222,192,0.78)",
                    }}
                  >
                    Awards:
                  </div>
                  <ul
                    style={{
                      margin: "0.45rem 0 0",
                      paddingLeft: "1.15rem",
                      fontFamily: T.sans,
                      fontSize: "0.92rem",
                      lineHeight: 1.65,
                      color: "rgba(232,222,192,0.72)",
                    }}
                  >
                    <li>Best Reference-to-Video Film</li>
                    <li>Best Sound Design</li>
                    <li>Best Use of Fal</li>
                    <li>Best AI-Human Collaboration</li>
                    <li>Community Choice</li>
                  </ul>
                </div>
              )}
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
              <A href="mailto:hello@giveago.co">hello@giveago.co</A>.
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
