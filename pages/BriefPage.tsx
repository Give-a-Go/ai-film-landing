import React from "react";
import Navigation from "../components/Navigation";

const BriefPage: React.FC = () => {
  return (
    <div style={{ background: "#080808", color: "rgba(224,213,192,0.9)", minHeight: "100vh", padding: "3rem 2rem" }}>
      <Navigation />
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "6rem 0 3rem" }}>

        {/* Eyebrow */}
        <p style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "rgba(200,170,80,0.7)",
          marginBottom: "1.2rem",
        }}>
          Give(a)Go &nbsp;·&nbsp; AI Filmmaking Challenge v2 &nbsp;·&nbsp; 18–19 April 2025
        </p>

        {/* Title block */}
        <div style={{
          borderTop: "0.5px solid rgba(200,170,80,0.25)",
          borderBottom: "0.5px solid rgba(200,170,80,0.25)",
          padding: "1.5rem 0",
          marginBottom: "2rem",
        }}>
          <div style={{
            fontFamily: "'IBM Plex Serif', Georgia, serif",
            fontSize: 72,
            fontWeight: 500,
            lineHeight: 1,
            letterSpacing: "-0.03em",
            color: "rgba(248,236,188,0.97)",
          }}>
            Side Quest.
          </div>
          <p style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 15,
            color: "rgba(255,255,255,0.45)",
            marginTop: "0.6rem",
            lineHeight: 1.7,
            maxWidth: 540,
          }}>
            The main story is overrated. Your film lives in the detour: the wrong turn, the unnecessary errand, the thing that happened on the way to something else.
          </p>
        </div>

        {/* The Brief */}
        <div style={{ marginBottom: "2.5rem" }}>
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(200,170,80,0.72)",
            marginBottom: "0.75rem",
          }}>
            The brief
          </p>
          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: "rgba(224,213,192,0.95)", lineHeight: 1.8 }}>
            Every great game has a side quest that's better than the main plot. Every great road trip has a stop nobody planned. Every interesting person you've ever met was heading somewhere else when you found them.
          </p>
          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: "rgba(224,213,192,0.85)", lineHeight: 1.8, marginTop: "1rem" }}>
            This weekend, your film should live in that space. It doesn't need a grand arc or a neat resolution. It just needs to follow something that went sideways: a distraction that turned into the whole point. Give us the bit that wasn't supposed to happen. That's where it gets interesting.
          </p>
        </div>

        {/* Ways in */}
        <div style={{ marginBottom: "2.5rem" }}>
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(200,170,80,0.72)",
            marginBottom: "0.75rem",
          }}>
            Ways in — pick any angle
          </p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {[
              { n: "01", text: "An AI was supposed to do one thing. It got distracted. Follow it." },
              { n: "02", text: "A person sets out to accomplish something completely ordinary. Everything else happens instead." },
              { n: "03", text: "Two strangers get stuck together on the way to somewhere they never reach." },
              { n: "04", text: "An errand that should take five minutes. It does not take five minutes." },
              { n: "05", text: "The background character who nobody noticed. Until now." },
            ].map(({ n, text }, i) => (
              <li key={n} style={{
                display: "flex",
                gap: 12,
                padding: "0.8rem 0",
                borderBottom: "0.5px solid rgba(200,170,80,0.12)",
                borderTop: i === 0 ? "0.5px solid rgba(200,170,80,0.12)" : undefined,
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontSize: 15,
                color: "rgba(224,213,192,0.95)",
                lineHeight: 1.6,
              }}>
                <span style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 12,
                  color: "rgba(200,170,80,0.65)",
                  minWidth: 20,
                  paddingTop: 3,
                }}>
                  {n}
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* For example */}
        <div style={{ marginBottom: "2.5rem" }}>
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(200,170,80,0.72)",
            marginBottom: "0.75rem",
          }}>
            For example — the territory is wide
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: "0.75rem" }}>
            {[
              "A sci-fi crew that takes the wrong wormhole",
              "An anime adventure through the wrong door",
              "A real-life doc about one accidental afternoon",
              "A lo-fi horror in a building after hours",
              "A hand-drawn fable about a very lost creature",
              "A mockumentary about a catastrophically wrong errand",
              "A surreal short where the GPS has its own agenda",
            ].map(text => (
              <span key={text} style={{
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontSize: 12,
                color: "rgba(224,213,192,0.8)",
                background: "rgba(200,170,80,0.05)",
                border: "0.5px solid rgba(200,170,80,0.18)",
                borderRadius: 20,
                padding: "4px 12px",
              }}>
                {text}
              </span>
            ))}
          </div>
        </div>

        {/* What we're looking for */}
        <div style={{ marginBottom: "2.5rem" }}>
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(200,170,80,0.72)",
            marginBottom: "0.75rem",
          }}>
            What we're looking for
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 1,
            background: "rgba(200,170,80,0.12)",
            border: "0.5px solid rgba(200,170,80,0.18)",
            borderRadius: 8,
            overflow: "hidden",
          }}>
            {[
              { k: "Format", v: "Short film, 2–5 minutes. Any genre." },
              { k: "Requirement", v: "At least one AI tool used meaningfully in production." },
              { k: "Tone", v: "Yours. Funny, strange, tense, sweet — all valid." },
              { k: "Originality", v: "Made this weekend. From scratch. Together." },
            ].map(({ k, v }) => (
              <div key={k} style={{
                background: "#0c0c0c",
                padding: "1rem 1.25rem",
              }}>
                <p style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "rgba(200,170,80,0.65)",
                  marginBottom: 4,
                }}>
                  {k}
                </p>
                <p style={{
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  fontSize: 14,
                  color: "rgba(224,213,192,0.95)",
                  lineHeight: 1.5,
                }}>
                  {v}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* The two days */}
        <div style={{ marginBottom: "2.5rem" }}>
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(200,170,80,0.72)",
            marginBottom: "0.75rem",
          }}>
            The two days
          </p>
          <div style={{ display: "flex" }}>
            {[
              {
                label: "Day 1 · 18 April",
                title: "Go off-script",
                detail: "Dogpatch Labs. Teams form, ideas derail in the best way, films get made. Mentors on hand all day.",
                first: true,
              },
              {
                label: "Day 2 · 19 April",
                title: "The big screen",
                detail: "The Savoy Cinema. 100 seats. Your side quest, on the main stage. Awards ceremony follows.",
                first: false,
              },
            ].map(({ label, title, detail, first }) => (
              <div key={label} style={{
                flex: 1,
                padding: "1rem 1.25rem",
                border: "0.5px solid rgba(200,170,80,0.18)",
                borderRadius: first ? "8px 0 0 8px" : "0 8px 8px 0",
                borderLeft: first ? undefined : "none",
                background: "#0c0c0c",
              }}>
                <p style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "rgba(200,170,80,0.65)",
                  marginBottom: 6,
                }}>
                  {label}
                </p>
                <p style={{
                  fontFamily: "'IBM Plex Serif', Georgia, serif",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "rgba(248,236,188,0.88)",
                  marginBottom: 4,
                }}>
                  {title}
                </p>
                <p style={{
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  fontSize: 13,
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.5,
                }}>
                  {detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* The spirit */}
        <div style={{ marginBottom: "2.5rem" }}>
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(200,170,80,0.72)",
            marginBottom: "0.75rem",
          }}>
            The spirit
          </p>
          <div style={{
            background: "rgba(200,170,80,0.04)",
            border: "0.5px solid rgba(200,170,80,0.18)",
            borderRadius: 12,
            padding: "1.5rem",
          }}>
            <p style={{
              fontFamily: "'IBM Plex Serif', Georgia, serif",
              fontSize: 15,
              fontStyle: "italic",
              color: "rgba(224,213,192,0.85)",
              lineHeight: 1.7,
            }}>
              "The main quest is what you planned. The side quest is what actually happened. We want the second one. Every time."
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          borderTop: "0.5px solid rgba(200,170,80,0.18)",
          paddingTop: "1rem",
          marginTop: "2.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 12,
            color: "rgba(200,170,80,0.6)",
          }}>
            giveago.co &nbsp;·&nbsp; film.giveago.co
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            {["Dublin", "18–19 Apr"].map(b => (
              <span key={b} style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                background: "rgba(200,170,80,0.05)",
                border: "0.5px solid rgba(200,170,80,0.22)",
                borderRadius: 20,
                padding: "3px 10px",
                color: "rgba(200,170,80,0.8)",
              }}>
                {b}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default BriefPage;
