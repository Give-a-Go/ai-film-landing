import React from "react";
import Navigation from "../components/Navigation";

const T = {
  gold: "rgba(248,236,188,0.97)",
  goldSoft: "rgba(248,236,188,0.82)",
  amber: "rgba(220,185,90,0.88)",
  amberDim: "rgba(220,185,90,0.62)",
  border: "rgba(200,170,80,0.22)",
  serif: "'IBM Plex Serif', Georgia, serif",
  sans: "'IBM Plex Sans', system-ui, sans-serif",
  mono: "'IBM Plex Mono', monospace",
};

const awards = [
  {
    icon: "🏆",
    title: "Best Reference-to-Video Film",
    presenter: "Wan AI",
    summary:
      "The strongest film built using reference-to-video. A prize for teams that transform source material into a distinctive final short film.",
    criteria: [
      "Creative use of reference material.",
      "Quality of transformation from source to final film.",
      "Execution and overall craft.",
    ],
  },
  {
    icon: "🎧",
    title: "Best Sound Design",
    presenter: "ElevenLabs",
    summary:
      "Sound that lifts the film: voice, effects, ambience, and music choices that make the short film feel cinematic.",
    criteria: [
      "Voice and dialogue performance.",
      "Soundscape quality and texture.",
      "Music and pacing impact.",
    ],
  },
  {
    icon: "⚙️",
    title: "Best Use of Fal",
    presenter: "Fal",
    summary:
      "For the team that used Fal in a deliberate, consistent way to build their short film from first frame to last.",
    criteria: [
      "Workflow craft and decision quality.",
      "Visual consistency across the short film.",
      "Clear demonstration of how and why the approach worked.",
    ],
  },
  {
    icon: "🤝",
    title: "Best AI-Human Collaboration",
    presenter: "Wolfpack Digital",
    summary:
      "For the film that best demonstrates AI as a creative partner rather than a replacement.",
    criteria: [
      "Intentionality in where AI and humans each lead.",
      "Creative synergy between human direction and AI capability.",
      "Transparency about what was AI-assisted and what was human-led.",
    ],
  },
  {
    icon: "❤️",
    title: "Community Choice",
    presenter: "Give(a)Go",
    summary:
      "Voted by the room at the premiere. The film that people keep talking about after the screening.",
    criteria: ["No formal rubric. Pure audience reaction."],
  },
];

const AwardsPage: React.FC = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: T.gold,
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          position: "fixed",
          inset: 0,
          opacity: 0.035,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
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

      <Navigation />

      <main style={{ position: "relative", padding: "7.5rem 1.5rem 3rem" }}>
        <section style={{ maxWidth: 860, margin: "0 auto" }}>
          <div
            style={{
              fontFamily: T.mono,
              fontSize: "0.62rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: T.amberDim,
            }}
          >
            Awards
          </div>
          <h1
            style={{
              margin: "0.9rem 0 0",
              fontFamily: T.serif,
              fontSize: "clamp(2rem, 4.4vw, 3.1rem)",
              lineHeight: 1.1,
              color: T.gold,
            }}
          >
            How Your Film Is Judged
          </h1>
          <p
            style={{
              margin: "1rem 0 0",
              maxWidth: 700,
              fontFamily: T.sans,
              fontSize: "1rem",
              lineHeight: 1.7,
              color: "rgba(232,222,192,0.78)",
            }}
          >
            Every submitted short film is eligible for every award. You do not need to choose categories in advance.
          </p>
        </section>

        <section style={{ maxWidth: 860, margin: "2rem auto 0" }}>
          {awards.map((award) => (
            <article
              key={award.title}
              style={{
                marginBottom: "1rem",
                border: `1px solid ${T.border}`,
                background:
                  "linear-gradient(150deg, rgba(28,22,8,0.6) 0%, rgba(10,8,3,0.95) 100%)",
                padding: "1.25rem 1.2rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "0.65rem",
                  flexWrap: "wrap",
                }}
              >
                <span style={{ fontSize: "1.2rem" }} aria-hidden>
                  {award.icon}
                </span>
                <h2
                  style={{
                    margin: 0,
                    fontFamily: T.serif,
                    fontSize: "1.28rem",
                    color: T.gold,
                  }}
                >
                  {award.title}
                </h2>
                <span
                  style={{
                    fontFamily: T.mono,
                    fontSize: "0.56rem",
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color: T.amberDim,
                  }}
                >
                  Presented by {award.presenter}
                </span>
              </div>

              <p
                style={{
                  margin: "0.8rem 0 0",
                  fontFamily: T.sans,
                  fontSize: "0.98rem",
                  lineHeight: 1.65,
                  color: "rgba(232,222,192,0.78)",
                }}
              >
                {award.summary}
              </p>

              <ul style={{ margin: "0.7rem 0 0", paddingLeft: "1.1rem" }}>
                {award.criteria.map((item) => (
                  <li
                    key={item}
                    style={{
                      margin: "0.4rem 0",
                      fontFamily: T.sans,
                      fontSize: "0.94rem",
                      lineHeight: 1.6,
                      color: "rgba(232,222,192,0.72)",
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
};

export default AwardsPage;
