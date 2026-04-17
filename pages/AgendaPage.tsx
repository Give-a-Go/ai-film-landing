import React from "react";
import Navigation from "../components/Navigation";

const DOT: Record<string, string> = {
  purple: "#7F77DD",
  teal:   "#1D9E75",
  amber:  "#C8861A",
  coral:  "#D85A30",
  gray:   "#6E6D68",
  pink:   "#D4537E",
};

const TAG: Record<string, { bg: string; color: string }> = {
  build: { bg: "rgba(29,158,117,0.14)", color: "#4fcca4" },
  food:  { bg: "rgba(200,134,26,0.14)", color: "#d4a44c" },
  key:   { bg: "rgba(127,119,221,0.14)", color: "#a9a4f0" },
  wrap:  { bg: "rgba(150,148,140,0.14)", color: "#a09e99" },
  demo:  { bg: "rgba(212,83,126,0.14)", color: "#e887aa" },
};

function Tag({ type, children }: { type: keyof typeof TAG; children: React.ReactNode }) {
  const t = TAG[type];
  return (
    <span style={{
      display: "inline-block",
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: 11,
      fontWeight: 500,
      padding: "2px 8px",
      borderRadius: 4,
      marginTop: 4,
      background: t.bg,
      color: t.color,
      letterSpacing: "0.04em",
    }}>
      {children}
    </span>
  );
}

function Item({ dot, time, label, sub, tag }: {
  dot: keyof typeof DOT;
  time: string;
  label: string;
  sub?: string;
  tag?: { type: keyof typeof TAG; text: string };
}) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 14 }}>
      <div style={{
        width: 7, height: 7, borderRadius: "50%", flexShrink: 0,
        marginTop: 6, background: DOT[dot],
      }} />
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 12,
        fontWeight: 500,
        color: "rgba(200,170,80,0.65)",
        minWidth: 46,
        paddingTop: 2,
        whiteSpace: "nowrap",
      }}>
        {time}
      </div>
      <div>
        <div style={{
          fontFamily: "'IBM Plex Sans', sans-serif",
          fontSize: 14,
          color: "rgba(224,213,192,0.95)",
          lineHeight: 1.5,
        }}>
          {label}
        </div>
        {sub && (
          <div style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 12,
            color: "rgba(255,255,255,0.5)",
            marginTop: 2,
          }}>
            {sub}
          </div>
        )}
        {tag && <Tag type={tag.type}>{tag.text}</Tag>}
      </div>
    </div>
  );
}

const AgendaPage: React.FC = () => {
  return (
    <div style={{ background: "#080808", color: "rgba(224,213,192,0.9)", minHeight: "100vh", padding: "3rem 2rem" }}>
      <Navigation />
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "6rem 0 3rem" }}>

        {/* Header */}
        <h1 style={{
          fontFamily: "'IBM Plex Serif', Georgia, serif",
          fontSize: 20,
          fontWeight: 500,
          margin: "0 0 4px",
          color: "rgba(248,236,188,0.97)",
        }}>
          AI Filmmaking Hackathon
        </h1>
        <p style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 14,
          color: "rgba(200,170,80,0.7)",
          margin: "0 0 2rem",
        }}>
          18–19 April · Give(a)Go
        </p>

        {/* Two-column grid */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>

          {/* Day 1 */}
          <div style={{
            background: "#0c0c0c",
            border: "0.5px solid rgba(200,170,80,0.18)",
            borderRadius: 12,
            padding: "1.25rem 1.5rem",
            flex: 1,
            minWidth: 280,
          }}>
            <p style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(200,170,80,0.72)",
              margin: "0 0 4px",
            }}>
              Day 1
            </p>
            <p style={{
              fontFamily: "'IBM Plex Serif', Georgia, serif",
              fontSize: 17,
              fontWeight: 500,
              color: "rgba(248,236,188,0.97)",
              margin: "0 0 4px",
            }}>
              Build Day
            </p>
            <p style={{
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: 13,
              color: "rgba(255,255,255,0.5)",
              margin: "0 0 1.25rem",
            }}>
              Friday 18 April · Dogpatch Labs
            </p>
            <hr style={{ border: "none", borderTop: "0.5px solid rgba(200,170,80,0.15)", margin: "0 0 1.25rem" }} />

            <Item dot="gray"   time="11:00" label="Doors open"              sub="Breakfast, coffee & networking" />
            <Item dot="purple" time="11:30" label="Welcome & introductions"  sub="Give(a)Go overview · partner intros" tag={{ type: "key", text: "kick-off" }} />
            <Item dot="teal"   time="12:00" label="Build begins"             tag={{ type: "build", text: "hacking" }} />
            <Item dot="pink"   time="12:15" label="fal.ai demo session"      sub="30 min · runs alongside build time" tag={{ type: "demo", text: "tool demo" }} />
            <Item dot="amber"  time="13:30" label="Lunch"                    sub="Sanos Pizza" tag={{ type: "food", text: "catering" }} />
            <Item dot="teal"   time="14:00" label="Build continues"          tag={{ type: "build", text: "hacking" }} />
            <Item dot="pink"   time="14:00" label="Wan AI demo session"     sub="30 min · runs alongside build time" tag={{ type: "demo", text: "tool demo" }} />
            <Item dot="amber"  time="17:30" label="Dinner"                   tag={{ type: "food", text: "catering" }} />
            <Item dot="coral"  time="18:00" label="Doors close"              sub="Teams continue remotely" />
            <Item dot="gray"   time="23:59" label="Submission deadline"      tag={{ type: "wrap", text: "hard deadline" }} />
          </div>

          {/* Day 2 */}
          <div style={{
            background: "#0c0c0c",
            border: "0.5px solid rgba(200,170,80,0.18)",
            borderRadius: 12,
            padding: "1.25rem 1.5rem",
            flex: 1,
            minWidth: 280,
          }}>
            <p style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(200,170,80,0.72)",
              margin: "0 0 4px",
            }}>
              Day 2
            </p>
            <p style={{
              fontFamily: "'IBM Plex Serif', Georgia, serif",
              fontSize: 17,
              fontWeight: 500,
              color: "rgba(248,236,188,0.97)",
              margin: "0 0 4px",
            }}>
              Premiere &amp; Awards
            </p>
            <p style={{
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: 13,
              color: "rgba(255,255,255,0.5)",
              margin: "0 0 1.25rem",
            }}>
              Saturday 19 April · The Savoy Cinema
            </p>
            <hr style={{ border: "none", borderTop: "0.5px solid rgba(200,170,80,0.15)", margin: "0 0 1.25rem" }} />

            <Item dot="gray"   time="12:00"  label="Doors open"                   sub="Guests and filmmakers arrive" />
            <Item dot="purple" time="12:30"  label="Opening speeches"              sub="MC welcome · words from key sponsors" tag={{ type: "key", text: "ceremony" }} />
            <Item dot="teal"   time="12:45"  label="Film screenings"               sub="Selected submissions screened · ~1 hour" />
            <Item dot="purple" time="13:45"  label="Prize ceremony"                sub="Filmmakers on stage · trophies from partners · ~30 mins" tag={{ type: "key", text: "awards" }} />
            <Item dot="coral"  time="14:15"  label="Closing remarks & networking"  sub="MC wrap-up · mingle before heading out" />
            <Item dot="gray"   time="~14:45" label="Head to the pub"               sub="Nearby venue · TBC" />
            <Item dot="gray"   time="16:00"  label="Finish"                        tag={{ type: "wrap", text: "end" }} />
          </div>

        </div>


      </div>
    </div>
  );
};

export default AgendaPage;
