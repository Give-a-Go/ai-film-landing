import React, { useEffect, useRef, useState } from "react";
import Navigation from "../components/Navigation";

const GIVEAGO_LINKEDIN_URL = "https://www.linkedin.com/company/lets-giveago";
const GIVEAGO_INSTAGRAM_URL = "https://www.instagram.com/lets.giveago";
const GIVEAGO_NEXT_EVENT_URL = "https://luma.com/giveago";
const GIVEAGO_COMMUNITY_URL = "https://giveago.co";

const T = {
  gold: "rgba(248,236,188,0.97)",
  goldSoft: "rgba(248,236,188,0.82)",
  amber: "rgba(220,185,90,0.88)",
  amberDim: "rgba(220,185,90,0.62)",
  border: "rgba(200,170,80,0.22)",
  borderStrong: "rgba(200,170,80,0.38)",
  serif: "'IBM Plex Serif', Georgia, serif",
  sans: "'Work Sans', system-ui, sans-serif",
};

type Winner = {
  award: string;
  team: string;
  film: string;
  presenter: string;
  sponsorHref?: string;
  logoSrc?: string;
  logoAlt?: string;
  wordmarkPrimary?: string;
  wordmarkSecondary?: string;
};

type Film = {
  team: string;
  title: string;
  members: string;
  description: string;
};

const winners: Winner[] = [
  {
    award: "Best Film",
    team: "Team 15",
    film: "Sidetracked The Side Quest",
    presenter: "Wan AI (Alibaba)",
    sponsorHref: "https://wan.video",
    logoSrc: "/partners/wan.png",
    logoAlt: "Wan AI",
    wordmarkPrimary: "Wan AI",
    wordmarkSecondary: "Alibaba",
  },
  {
    award: "Best Use of Sound",
    team: "Team 7",
    film: "Side Quest",
    presenter: "ElevenLabs",
    sponsorHref: "https://elevenlabs.io",
    logoSrc: "/partners/elevenlabs-logo-white.svg",
    logoAlt: "ElevenLabs",
  },
  {
    award: "Best Use of AI",
    team: "Team 23",
    film: "Rerouting",
    presenter: "fal.ai",
    sponsorHref: "https://fal.ai",
    logoSrc: "/partners/fal-ai.svg",
    logoAlt: "fal.ai",
  },
  {
    award: "Best AI-Human Collaboration (Best direction)",
    team: "Team 8",
    film: "Microdosing",
    presenter: "Wolfpack Digital",
    sponsorHref: "https://www.wolfpack-digital.com/?utm_source=giveago&utm_medium=live_event",
    logoSrc: "/partners/wolfpack-digital-light.png",
    logoAlt: "Wolfpack Digital",
    wordmarkPrimary: "Wolfpack",
    wordmarkSecondary: "Digital",
  },
  {
    award: "Community Choice",
    team: "Team 11",
    film: "Still Becoming",
    presenter: "Give(a)Go",
    sponsorHref: "https://giveago.co",
    logoSrc: "https://www.giveago.co/logo.png",
    logoAlt: "Give(a)Go",
    wordmarkPrimary: "Give(a)Go",
  },
];

const rawFilms: Film[] = [
  {
    team: "Team 24",
    title: "Simpsons - The Sidequest",
    members: "Harshit Pandit, Sergei Batrak, Siddharth, Boris Lebedev",
    description:
      "In this episode, Homer Simpson decides to become a film director and asks his beloved wife Marge to act in it.",
  },
  {
    team: "19 - Documentary Direction",
    title: "Upgrade",
    members: "Aishwarya, Annie Samira Kamga Ngatchou, Sanjana Pawar",
    description:
      "Sarah has new eyes. They are faster, sharper, and objectively better than the ones she was born with. But in a quiet hospital room on a rainy afternoon, she tries to explain to her doctor what the upgrade cost her.",
  },
  {
    team: "Team 18",
    title: "Don’t hate me for as God created me !",
    members: "Not provided",
    description: "Don’t hate me for as God created me !",
  },
  {
    team: "13",
    title: "Give(A)Gold",
    members: "José Herrera, Ruth Alonso, Antonella Jacob, Ananya Chandraker",
    description:
      "Two broke European immigrants in Dublin chase a Leprechaun down a rainbow road in a desperate bid to escape crushing rent — and learn that greed costs more than €1,200 a month.",
  },
  {
    team: "Team 7",
    title: "Side Quest",
    members: "Not provided",
    description: "maybe later",
  },
  {
    team: "12",
    title: "The Other Side of the Mirror",
    members: "Alan Maizon",
    description: "A bride embraces her light and dark stuff on her wedding day",
  },
  {
    team: "23",
    title: "Rerouting",
    members: "Anastasia Roznovan, Andriy Babiy, Max Trigub, Kai Hosokaw",
    description: "A man in pursuit of his goals against all odds and obstacles.",
  },
  {
    team: "11",
    title: "Still Becoming",
    members: "Kene Chukwu, Princess Nwedo, Temi Opejin, King Mbachu",
    description:
      "A young Black woman crushed by the weight of becoming \"exceptional\" collapses out of her reality, falling through memory into a mirrored space where every reflection is a version of herself she's been chasing. She learns that the perfect self was never real, the pressure came with her and returns to the same moment, choosing to simply exist.",
  },
  {
    team: "TEN",
    title: "THE LOOP",
    members:
      "Soham 0892006775, Orla OKeeffe 0874612989, Khushi Meta 0874791566, Adi, 0838268477",
    description:
      "The Loop follows an ordinary man whose routine morning begins to glitch in subtle ways. As reality bends around him, he’s pushed toward a choice that reveals life is far stranger, and far less his own, than he ever realised.",
  },
  {
    team: "17",
    title: "Stay",
    members: "Kaixi Zhang, Tetiana Sobko, Andrii Popesku, Jingxian Han",
    description:
      "A room where no one leaves without tears. Two strangers who were never meant to meet again.",
  },
  {
    team: "25",
    title: "The Nightly News",
    members: "Amanda, Dart, Fergal and Jimmy",
    description:
      "RTÉ News goes live to the White House. The White House goes completely insane. RTÉ News keeps going.",
  },
  {
    team: "13",
    title: "Give (A) Go",
    members: "José Herrera, Ruth Alonso, Antonella Jacob, Ananya Chandraker",
    description:
      "Two broke European immigrants in Dublin chase a Leprechaun down a rainbow road in a desperate bid to escape crushing rent — and learn that greed costs more than €1,200 a month.",
  },
  {
    team: "Team 30",
    title: "AI-Joe",
    members: "Not provided",
    description:
      "\"What happens when a quick trip to the supermarket goes terribly, cosmically wrong? The next short film is called \"Unexpected Item\". One man. One bag of chips. Zero luck.\"",
  },
  {
    team: "10",
    title: "The Loop",
    members:
      "Soham 0892006775, Orla OKeeffe 0874612989, Khushi Meta 0874791566, Adi, 0838268477",
    description:
      "Our film follows an ordinary man whose routine morning begins to glitch in subtle, impossible ways. As reality bends around him, he's pushed toward a choice that reveals his life is far stranger - and far less his own - than he ever realised.",
  },
  {
    team: "9",
    title: "Strangers",
    members: "Gnanasekar Mani, Win, Tian min Zhang, Shivasai",
    description:
      "For Be-Someone Concept: Something is unnoticeable becomes noticeable when you become someone. Someone that keep each other safe in the community For The Watcher in the Sky Concept: The Watcher in the Sky is a surreal horror short about a young woman who becomes obsessed with a painting in a museum, only to realize too late that the terror inside it is connected to her. For Strangers Concept: \"The Snowball Effect\" is a 3-minute AI-generated short film for the GiveAGo Hackathon about a chain of urban apathy that is broken by an elderly woman's single act of community service during a rainstorm.",
  },
  {
    team: "7",
    title: "Side Quest",
    members: "Not provided",
    description:
      "While heroes chase glory and grand destinies, a lowly shield-bearer finds his meaning in a simple, unauthorized walk. This is a story about the quiet defiance of a man who chooses to live for himself, even if only for a moment, before the war claims the rest.",
  },
  {
    team: "15",
    title: "Sidetracked The Side Quest",
    members: "Wilke-Mari Hamman, Herman du Toit, Paul Murnane, William Moore",
    description:
      "Sidetracked The Side Quest is a film about making a film about making a film. You are watching our side quest.",
  },
  {
    team: "Team 5",
    title: "The Long Way Home",
    members: "Charulekha Kasinathan (Cee), Meghana, Menomi, Thea",
    description:
      "Set in a hyper-futuristic Dublin that may not be what it seems, 'The Long Way Home' follows Tara, a nervous newcomer whose eerie taxi ride to a job interview turns into a detour through her own fears about belonging.",
  },
  {
    team: "27",
    title: "The Archivist",
    members: "Alan Maizon",
    description:
      "When the world ends, we do not reach for what is valuable. We reach for what is known. Yet the most haunting objects in this archive exist only as absence.",
  },
  {
    team: "20",
    title: "Am i who i think i am?",
    members: "Sofia Hotz, Lucas Quintanilla, Lucia Lopez Viejo, Paula Nuno Vila",
    description:
      "A space scientist uses an AI called Ida to connect her mind to an unknown signal — and becomes visible to something that wasn't supposed to know we exist. What follows cannot be undone.",
  },
  {
    team: "8",
    title: "Microdosing",
    members: "Vansh Chandra",
    description:
      "Remember to listen carefully, and not believe everything on the internet",
  },
  {
    team: "16",
    title: "Mental Sidequest",
    members: "Sivottam Swamy, Kanishka Khatu, Puneet, Kshitij (+91 9421481386)",
    description:
      "A film within a film about four strangers meet at a Dublin hackathon and create a film about a man who dies before living the life he wanted. Only after winning do they realize the real sidequest wasn't in the film, it was them.",
  },
  {
    team: "Team 19",
    title: "Keep An Eye on...",
    members: "Samira, Aishwarya, Sanjana",
    description: "It's About AI in med field",
  },
  {
    team: "Team 18",
    title: "Don’t hate what God Made You",
    members: "Not provided",
    description: "This is who I am as God created me",
  },
];

const SITE_FILM_OVERRIDES: Record<number, Omit<Film, "team">> = {
  5: {
    title: "The Long Way Home",
    members: "Charulekha Kasinathan (Cee), Meghana, Menomi, Thea",
    description:
      "Set in a hyper-futuristic Dublin that may not be what it seems, 'The Long Way Home' follows Tara, a nervous newcomer whose eerie taxi ride to a job interview turns into a detour through her own fears about belonging.",
  },
  7: {
    title: "Side Quest",
    members: "Wojciech, Yifei, Amaan, Ash",
    description:
      "While heroes chase glory and grand destinies, a lowly shield-bearer finds his meaning in a simple, unauthorized walk. This is a story about the quiet defiance of a man who chooses to live for himself, even if only for a moment, before the war claims the rest.",
  },
  8: {
    title: "Microdosing",
    members: "Vansh Chandra, Adam, Diarmuid, Yeva",
    description: "Remember to listen carefully, and not believe everything on the internet.",
  },
  9: {
    title: "Strangers",
    members: "Gnanasekar Mani, Win, Tian min Zhang, Shivasai",
    description:
      "\"The Snowball Effect\" — a 3-minute AI-generated short film about a chain of urban apathy that is broken by an elderly woman's single act of community service during a rainstorm.",
  },
  10: {
    title: "The Loop",
    members: "Soham, Orla O'Keeffe, Khushi Meta, Adi",
    description:
      "The Loop follows an ordinary man whose routine morning begins to glitch in subtle ways. As reality bends around him, he's pushed toward a choice that reveals life is far stranger, and far less his own, than he ever realised.",
  },
  11: {
    title: "Still Becoming",
    members: "Kene Chukwu, Princess Nwedo, Temi Opejin, King Mbachu",
    description:
      "A young Black woman crushed by the weight of becoming \"exceptional\" collapses out of her reality, falling through memory into a mirrored space where every reflection is a version of herself she's been chasing. She learns the perfect self was never real, and returns to the same moment, choosing to simply exist.",
  },
  12: {
    title: "The Other Side of the Mirror",
    members: "Brian Nitz, Apoorv, Alan Maizon, Freskida Goni",
    description: "A bride embraces her light and dark stuff on her wedding day.",
  },
  13: {
    title: "Give(A)Gold",
    members: "José Herrera, Ruth Alonso, Antonella Jacob, Ananya Chandraker",
    description:
      "Two broke European immigrants in Dublin chase a Leprechaun down a rainbow road in a desperate bid to escape crushing rent — and learn that greed costs more than €1,200 a month.",
  },
  15: {
    title: "Sidetracked The Side Quest",
    members: "Wilke-Mari Hamman, Herman du Toit, Paul Murnane, William Moore",
    description:
      "Sidetracked The Side Quest is a film about making a film about making a film. You are watching our side quest.",
  },
  16: {
    title: "Mental Sidequest",
    members: "Sivottam Swamy, Kanishka Khatu, Puneet, Kshitij",
    description:
      "A film within a film about four strangers who meet at a Dublin hackathon and create a film about a man who dies before living the life he wanted. Only after winning do they realize the real sidequest wasn't in the film — it was them.",
  },
  17: {
    title: "Stay",
    members: "Kaixi Zhang, Tetiana Sobko, Andrii Popesku, Jingxian Han",
    description:
      "A room where no one leaves without tears. Two strangers who were never meant to meet again.",
  },
  18: {
    title: "Don't hate what God Made You",
    members: "Eloghosa, Delicia Naomi Nyanza",
    description:
      "Malcolm X once spoke powerfully about the Black experience, exposing the deep-rooted effects of slavery and systemic oppression. This story echoes those truths, illustrating how that history continues to influence lives, identities, and opportunities today.",
  },
  19: {
    title: "Keep An Eye on...",
    members: "Aishwarya, Annie Samira Kamga Ngatchou, Sanjana Pawar",
    description:
      "Sarah has new eyes. They are faster, sharper, and objectively better than the ones she was born with. But in a quiet hospital room on a rainy afternoon, she tries to explain to her doctor what the upgrade cost her.",
  },
  20: {
    title: "Am I Who I Think I Am?",
    members: "Sofia Hotz, Lucas Quintanilla, Lucia Lopez Viejo, Paula Nuno Vila",
    description:
      "A space scientist uses an AI called Ida to connect her mind to an unknown signal — and becomes visible to something that wasn't supposed to know we exist. What follows cannot be undone.",
  },
  23: {
    title: "Rerouting",
    members: "Anastasia Roznovan, Andriy Babiy, Max Trigub, Kai Hosokaw",
    description: "A man in pursuit of his goals against all odds and obstacles.",
  },
  24: {
    title: "Simpsons - The Sidequest",
    members: "Harshit Pandit, Sergei Batrak, Siddharth, Boris Lebedev",
    description:
      "In this episode, Homer Simpson decides to become a film director and asks his beloved wife Marge to act in it.",
  },
  25: {
    title: "The Nightly News",
    members: "Amanda, Dart, Fergal, Jimmy",
    description:
      "RTÉ News goes live to the White House. The White House goes completely insane. RTÉ News keeps going.",
  },
  30: {
    title: "AI-Joe — Unexpected Item",
    members: "Aon Safdar",
    description:
      "What happens when a quick trip to the supermarket goes terribly, cosmically wrong? The next short film is called \"Unexpected Item\". One man. One bag of chips. Zero luck.",
  },
};

const SITE_FILM_TITLE_ALIASES: Record<number, string[]> = {
  7: ["Side Quest"],
  10: ["THE LOOP", "The Loop"],
  13: ["Give(A)Gold", "Give (A) Go"],
  18: [
    "Don’t hate me for as God created me !",
    "Don’t hate what God Made You",
    "Don't hate what God Made You",
  ],
  19: ["Keep An Eye on...", "Upgrade"],
  30: ["AI-Joe", "AI-Joe — Unexpected Item"],
};

const WORD_NUMBERS: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
};

function getTeamSortValue(team: string) {
  const cleaned = team.trim().toLowerCase();
  const numberMatch = cleaned.match(/\d+/);
  if (numberMatch) return Number(numberMatch[0]);
  return WORD_NUMBERS[cleaned] ?? Number.POSITIVE_INFINITY;
}

function formatTeamLabel(team: string) {
  const teamValue = getTeamSortValue(team);
  if (Number.isFinite(teamValue)) {
    return `Team ${teamValue}`;
  }
  return team;
}

function getDescriptionPreview(text: string, maxLength = 155) {
  const clean = text.trim();
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength).trimEnd()}...`;
}

function formatMembersList(members: string) {
  if (members === "Not provided") return members;
  return members.replace(/,\s*/g, ", ");
}

function normalizeTitle(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

const TEAM_TITLE_VARIANT_COUNTS = rawFilms.reduce((map, film) => {
  const teamValue = getTeamSortValue(film.team);
  const titles = map.get(teamValue) ?? new Set<string>();
  titles.add(normalizeTitle(film.title));
  map.set(teamValue, titles);
  return map;
}, new Map<number, Set<string>>());

function getSiteOverrideForFilm(film: Film) {
  const teamValue = getTeamSortValue(film.team);
  const override = SITE_FILM_OVERRIDES[teamValue];
  if (!override) return null;

  const teamVariantCount = TEAM_TITLE_VARIANT_COUNTS.get(teamValue)?.size ?? 0;
  if (teamVariantCount <= 1) return override;

  const aliases = SITE_FILM_TITLE_ALIASES[teamValue] ?? [override.title];
  const normalizedTitle = normalizeTitle(film.title);
  const matchesAlias = aliases.some((alias) => normalizeTitle(alias) === normalizedTitle);

  return matchesAlias ? override : null;
}

const films: Film[] = rawFilms.map((film) => {
  const override = getSiteOverrideForFilm(film);
  if (!override) return film;

  return {
    ...film,
    ...override,
  };
});

function getFilmKey(team: string, title: string) {
  return `${getTeamSortValue(team)}:${normalizeTitle(title)}`;
}

function getUniqueFilmKey(film: Film) {
  return `${film.team}::${film.title}::${film.description}`;
}

function getYoutubeId(url?: string) {
  if (!url) return null;
  const trimmed = url.trim();
  const watchMatch = trimmed.match(/[?&]v=([^&]+)/);
  if (watchMatch) return watchMatch[1];
  const shortMatch = trimmed.match(/youtu\.be\/([^?&/]+)/);
  if (shortMatch) return shortMatch[1];
  const embedMatch = trimmed.match(/youtube\.com\/embed\/([^?&/]+)/);
  if (embedMatch) return embedMatch[1];
  return null;
}

function getYoutubeEmbedUrl(url?: string, autoplay = false) {
  const id = getYoutubeId(url);
  if (!id) return null;
  return `https://www.youtube.com/embed/${id}?rel=0${autoplay ? "&autoplay=1" : ""}`;
}

function getYoutubeThumbnailUrl(url?: string) {
  const id = getYoutubeId(url);
  if (!id) return null;
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

const FILM_VIDEO_MAP: Record<string, string[]> = {
  [getFilmKey("Team 5", "The Long Way Home")]: ["https://youtu.be/Nk6rZu_oAOc"],
  [getFilmKey("Team 7", "Side Quest")]: ["https://youtu.be/Op-DqIXPeNI"],
  [getFilmKey("Team 8", "Microdosing")]: ["https://youtu.be/VBC32wBXfKI"],
  [getFilmKey("Team 9", "Strangers")]: ["https://youtu.be/BQNEj01rRZc"],
  [getFilmKey("Team 10", "The Loop")]: ["https://youtu.be/Qm01AlB9yew"],
  [getFilmKey("Team 11", "Still Becoming")]: [
    "https://youtu.be/t9O7_Pvc0zI",
    "https://youtu.be/lZE1wx5xet8",
  ],
  [getFilmKey("Team 12", "The Other Side of the Mirror")]: [
    "https://youtu.be/SgnF-WMVqxY",
    "https://youtu.be/KINJi74t82o",
  ],
  [getFilmKey("Team 13", "Give(A)Gold")]: ["https://youtu.be/NXMRNbRJ57c"],
  [getFilmKey("Team 15", "Sidetracked The Side Quest")]: ["https://youtu.be/Eopic2NlRb0"],
  [getFilmKey("Team 16", "Mental Sidequest")]: ["https://youtu.be/tD5vk1F595g"],
  [getFilmKey("Team 17", "Stay")]: ["https://youtu.be/kc7mPs5n90g"],
  [getFilmKey("Team 18", "Don’t hate what God Made You")]: ["https://youtu.be/2tOh_lDjDao"],
  [getFilmKey("Team 19", "Keep An Eye on...")]: [
    "https://youtu.be/_ax7xOBDti8",
    "https://youtu.be/qViMnPrAebw",
  ],
  [getFilmKey("Team 19", "Upgrade")]: [
    "https://youtu.be/_ax7xOBDti8",
    "https://youtu.be/qViMnPrAebw",
  ],
  [getFilmKey("Team 20", "Am i who i think i am?")]: ["https://youtu.be/G-4Wn1m8Zo0"],
  [getFilmKey("Team 23", "Rerouting")]: ["https://youtu.be/amghiVlOguQ"],
  [getFilmKey("Team 24", "Simpsons - The Sidequest")]: ["https://youtu.be/uLGtwBMOCDw"],
  [getFilmKey("Team 25", "The Nightly News")]: ["https://youtu.be/0uBa7DCqjNQ"],
  [getFilmKey("Team 27", "The Archivist")]: ["https://youtu.be/M755o3-b0AY"],
  [getFilmKey("Team 30", "AI-Joe")]: ["https://youtu.be/Va4we_4PJes"],
  [getFilmKey("Team 30", "AI-Joe — Unexpected Item")]: ["https://youtu.be/Va4we_4PJes"],
};

function getFilmVideoUrls(film: Film) {
  const urls = FILM_VIDEO_MAP[getFilmKey(film.team, film.title)] ?? [];
  return urls.length > 0 ? [urls[0]] : [];
}

function SponsorPedestal({ winner }: { winner: Winner }) {
  const [logoFailed, setLogoFailed] = useState(false);
  const hasLogo = Boolean(winner.logoSrc) && !logoFailed;
  const logoContent = hasLogo ? (
    <img
      src={winner.logoSrc}
      alt={winner.logoAlt ?? winner.presenter}
      style={{
        maxHeight: 42,
        maxWidth: 180,
        objectFit: "contain",
        filter:
          winner.presenter === "fal.ai"
            ? "brightness(0) saturate(100%) invert(100%)"
            : undefined,
      }}
      onError={() => setLogoFailed(true)}
    />
  ) : (
    <div style={{ textAlign: "left" }}>
      <div
        style={{
          fontFamily: T.serif,
          fontSize: "1.1rem",
          fontWeight: 500,
          color: T.gold,
          lineHeight: 1.15,
        }}
      >
        {winner.wordmarkPrimary ?? winner.presenter}
      </div>
      {winner.wordmarkSecondary ? (
        <div
          style={{
            marginTop: "0.15rem",
            fontFamily: T.sans,
            fontSize: "0.82rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: T.amberDim,
          }}
        >
          {winner.wordmarkSecondary}
        </div>
      ) : null}
    </div>
  );

  return (
    <div
      style={{
        border: `1px solid ${T.borderStrong}`,
        background:
          "linear-gradient(160deg, rgba(58,44,14,0.72) 0%, rgba(26,20,8,0.94) 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "0.85rem",
        padding: "0.95rem 1rem",
        boxShadow: "inset 0 1px 0 rgba(248,236,188,0.08)",
        minHeight: 116,
      }}
    >
      <div
        style={{
          fontFamily: T.serif,
          fontSize: "1.08rem",
          fontWeight: 500,
          color: T.gold,
          lineHeight: 1.2,
        }}
      >
        {winner.award}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "0.45rem",
          minWidth: 0,
        }}
      >
        <div
          style={{
            fontFamily: T.sans,
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: T.amberDim,
            flexShrink: 0,
          }}
        >
          Presented by
        </div>

        {winner.sponsorHref ? (
          <a
            href={winner.sponsorHref}
            target="_blank"
            rel="noreferrer"
            aria-label={`Visit ${winner.presenter}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            {logoContent}
          </a>
        ) : (
          logoContent
        )}
      </div>
    </div>
  );
}

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div
      style={{
        border: `1px solid ${T.border}`,
        background: "rgba(248,236,188,0.03)",
        padding: "1.1rem 1.2rem",
      }}
    >
      <div
        style={{
          fontFamily: T.serif,
          fontSize: "1.75rem",
          fontWeight: 500,
          color: T.gold,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          marginTop: "0.5rem",
          fontFamily: T.sans,
          fontSize: "0.82rem",
          fontWeight: 600,
          letterSpacing: "0.04em",
          color: T.amberDim,
        }}
      >
        {label}
      </div>
    </div>
  );
}

type FeaturedFilm = {
  film: Film;
  winner: Winner;
};

type DisplayFilm = {
  film: Film;
  winner?: Winner;
};

const dedupedFilms: Film[] = (() => {
  const byKey = new Map<string, Film>();

  for (const film of films) {
    const filmKey = getFilmKey(film.team, film.title);
    const existing = byKey.get(filmKey);

    if (!existing) {
      byKey.set(filmKey, film);
      continue;
    }

    const existingScore =
      existing.description.length + (existing.members !== "Not provided" ? 1000 : 0);
    const nextScore =
      film.description.length + (film.members !== "Not provided" ? 1000 : 0);

    if (nextScore > existingScore) {
      byKey.set(filmKey, film);
    }
  }

  const deduped = Array.from(byKey.values());
  const seenTeamFilm = new Set<string>();

  return deduped.filter((film) => {
    const teamFilmKey = getFilmKey(film.team, film.title);
    if (seenTeamFilm.has(teamFilmKey)) return false;
    seenTeamFilm.add(teamFilmKey);
    return true;
  });
})();

const sortedFilms = [...dedupedFilms].sort((a, b) => {
  const aValue = getTeamSortValue(a.team);
  const bValue = getTeamSortValue(b.team);
  if (aValue !== bValue) return aValue - bValue;
  return a.title.localeCompare(b.title);
});

const featuredFilms: FeaturedFilm[] = winners
  .map((winner) => {
    const winnerKey = getFilmKey(winner.team, winner.film);
    const film = sortedFilms.find((candidate) => getFilmKey(candidate.team, candidate.title) === winnerKey) ?? null;
    return film ? { film, winner } : null;
  })
  .filter((item): item is FeaturedFilm => Boolean(item));

const featuredFilmKeys = new Set(featuredFilms.map(({ film }) => getUniqueFilmKey(film)));
const archiveFilms = sortedFilms.filter((film) => !featuredFilmKeys.has(getUniqueFilmKey(film)));
const displayFilms: DisplayFilm[] = [
  ...featuredFilms.map(({ film, winner }) => ({ film, winner })),
  ...archiveFilms.map((film) => ({ film })),
];
const playableFilms = displayFilms.filter(({ film }) => getFilmVideoUrls(film).length > 0);

function PreviewCard({
  film,
  winner,
  onOpenLightbox,
}: {
  film: Film;
  winner?: Winner;
  onOpenLightbox: () => void;
}) {
  const videoUrls = getFilmVideoUrls(film);
  const hasVideo = videoUrls.length > 0;
  const thumbnailUrl = getYoutubeThumbnailUrl(videoUrls[0]);
  const preview = getDescriptionPreview(film.description, winner ? 140 : 125);

  return (
    <article
      style={{
        border: `1px solid ${winner ? T.borderStrong : T.border}`,
        borderLeft: winner ? `2px solid ${T.amber}` : `1px solid ${T.border}`,
        background: winner
          ? "linear-gradient(160deg, rgba(28,22,9,0.7) 0%, rgba(8,8,8,0.98) 100%)"
          : "linear-gradient(160deg, rgba(18,16,8,0.52) 0%, rgba(7,7,7,0.96) 100%)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        height: "100%",
      }}
    >
      <div
        style={{
          padding: "1.25rem 1.25rem 0",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.7rem",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "0.38rem 0.7rem",
              border: `1px solid ${T.border}`,
              fontFamily: T.sans,
              fontSize: "0.82rem",
              fontWeight: 600,
              letterSpacing: "0.02em",
              color: T.goldSoft,
              background: "rgba(248,236,188,0.03)",
            }}
          >
            {formatTeamLabel(film.team)}
          </span>
        </div>

        {winner ? <SponsorPedestal winner={winner} /> : null}

        <div
          style={{
            position: "relative",
            aspectRatio: "16 / 9",
            border: `1px solid ${winner ? T.borderStrong : T.border}`,
            background: "linear-gradient(160deg, rgba(16,14,9,0.84) 0%, rgba(8,8,8,0.98) 100%)",
            overflow: "hidden",
            cursor: hasVideo ? "pointer" : "default",
          }}
          onClick={hasVideo ? onOpenLightbox : undefined}
        >
          {thumbnailUrl ? (
            <>
              <img
                src={thumbnailUrl}
                alt={film.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: 0.82,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(5,5,5,0.85) 0%, rgba(5,5,5,0.18) 60%, rgba(5,5,5,0.3) 100%)",
                }}
              />
            </>
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "0.7rem",
                background:
                  "radial-gradient(circle at top right, rgba(220,185,90,0.14), transparent 42%), linear-gradient(160deg, rgba(16,14,9,0.84) 0%, rgba(8,8,8,0.98) 100%)",
                textAlign: "center",
                padding: "1rem",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  border: `1px solid ${T.borderStrong}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: T.amber,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                  <path d="M3 1.5v11l9-5.5z" />
                </svg>
              </div>
              <div
                style={{
                  fontFamily: T.sans,
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: T.amberDim,
                }}
              >
                {hasVideo ? "Preview ready" : "Video coming soon"}
              </div>
            </div>
          )}

          {hasVideo ? (
            <div
              style={{
                position: "absolute",
                inset: "auto 0 0 0",
                padding: "0.95rem",
                display: "flex",
                justifyContent: "space-between",
                gap: "0.7rem",
                alignItems: "center",
                pointerEvents: "none",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  border: `1px solid ${T.borderStrong}`,
                  background: "rgba(220,185,90,0.2)",
                  color: T.gold,
                  padding: "0.5rem 0.85rem",
                  fontFamily: T.sans,
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  letterSpacing: "0.01em",
                  borderRadius: 999,
                }}
              >
                <svg width="10" height="10" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                  <path d="M3 1.5v11l9-5.5z" />
                </svg>
                Watch
              </span>
              {videoUrls.length > 1 ? (
                <span
                  style={{
                    border: `1px solid ${T.border}`,
                    background: "rgba(5,5,5,0.6)",
                    color: T.goldSoft,
                    padding: "0.5rem 0.85rem",
                    fontFamily: T.sans,
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    borderRadius: 999,
                  }}
                >
                  {videoUrls.length} videos
                </span>
              ) : null}
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <h3
            style={{
              margin: 0,
              fontFamily: T.serif,
              fontSize: winner ? "1.55rem" : "1.22rem",
              fontWeight: 500,
              lineHeight: winner ? 1.18 : 1.22,
              letterSpacing: "-0.005em",
              color: T.gold,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: winner ? "3.66rem" : "2.98rem",
            }}
          >
            {film.title}
          </h3>

          <p
            style={{
              margin: "0.7rem 0 0",
              fontFamily: T.sans,
              fontSize: "0.94rem",
              lineHeight: 1.62,
              color: "rgba(232,222,192,0.76)",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: "3.05rem",
            }}
          >
            {preview}
          </p>

          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              marginTop: "1rem",
              minHeight: "3.4rem",
              alignItems: "stretch",
            }}
          >
            <span
              style={{
                display: "block",
                width: "100%",
                fontFamily: T.sans,
                fontSize: "0.82rem",
                fontWeight: 500,
                color: T.amberDim,
                border: `1px solid ${T.border}`,
                padding: "0.42rem 0.6rem",
                lineHeight: 1.5,
                whiteSpace: "normal",
                minHeight: "3.4rem",
                boxSizing: "border-box",
              }}
            >
              {film.members !== "Not provided"
                ? `By ${formatMembersList(film.members)}`
                : "Credits pending"}
            </span>
          </div>
        </div>

        <details
          className="synopsis-details"
          style={{
            marginTop: "auto",
            borderTop: "1px dashed rgba(200,170,80,0.18)",
            paddingTop: "1rem",
            paddingBottom: "1.4rem",
          }}
        >
          <summary
            className="synopsis-toggle"
            style={{
              cursor: "pointer",
              fontFamily: T.sans,
              fontSize: "0.9rem",
              fontWeight: 700,
              letterSpacing: "0.02em",
              color: T.gold,
              listStyle: "none",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.75rem",
              width: "100%",
            }}
          >
            <span>Read Synopsis</span>
            <span className="synopsis-toggle-arrow" aria-hidden="true" />
          </summary>
          <div style={{ marginTop: "0.9rem" }}>
            <div
              style={{
                fontFamily: T.sans,
                fontSize: "0.78rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: T.amberDim,
                marginBottom: "0.45rem",
              }}
            >
              Synopsis
            </div>
            <p
              style={{
                margin: 0,
                fontFamily: T.sans,
                fontSize: "0.92rem",
                lineHeight: 1.62,
                color: "rgba(232,222,192,0.74)",
              }}
            >
              {film.description}
            </p>

            <div
              style={{
                fontFamily: T.sans,
                fontSize: "0.78rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: T.amberDim,
                margin: "0.95rem 0 0.45rem",
              }}
            >
              Team members
            </div>
            <p
              style={{
                margin: 0,
                fontFamily: T.sans,
                fontSize: "0.92rem",
                lineHeight: 1.62,
                color: "rgba(232,222,192,0.74)",
              }}
            >
              {formatMembersList(film.members)}
            </p>
          </div>
        </details>
      </div>
    </article>
  );
}

function FollowCard({
  showInstagram = true,
  marginTop = "2rem auto 0",
  title = "Attend the next Give(a)Go event.",
  eyebrow = "Stay in the loop",
  compact = false,
}: {
  showInstagram?: boolean;
  marginTop?: string;
  title?: string;
  eyebrow?: string;
  compact?: boolean;
}) {
  return (
    <section
      style={{
        maxWidth: 1040,
        margin: marginTop,
        border: `1px solid ${T.border}`,
        background:
          "linear-gradient(160deg, rgba(34,26,10,0.62) 0%, rgba(10,10,9,0.97) 100%)",
        padding: "1.2rem 1.2rem 1.3rem",
      }}
    >
      <div className={`follow-card ${compact ? "follow-card-compact" : "follow-card-featured"}`}>
        <div className={`follow-copy ${compact ? "follow-copy-compact" : "follow-copy-featured"}`}>
          {eyebrow ? (
            <div
              style={{
                fontFamily: T.sans,
                fontSize: "0.78rem",
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: T.amber,
              }}
            >
              {eyebrow}
            </div>
          ) : null}
          <h3
            style={{
              margin: "0.45rem 0 0",
              fontFamily: T.serif,
              fontSize: "clamp(1.45rem, 3vw, 2rem)",
              fontWeight: 500,
              lineHeight: 1.1,
              color: T.gold,
            }}
          >
            {title}
          </h3>
        </div>

        <div
          className={`follow-actions ${
            compact ? "follow-actions-compact" : "follow-actions-featured"
          }`}
        >
          <a
            href={GIVEAGO_NEXT_EVENT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="follow-link follow-link-primary"
          >
            Attend Next Event
          </a>
          <a
            href={GIVEAGO_COMMUNITY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="follow-link follow-link-secondary"
          >
            Join Community
          </a>
          <a
            href={GIVEAGO_LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="follow-link follow-link-secondary"
          >
            Follow on LinkedIn
          </a>
          {showInstagram ? (
            <a
              href={GIVEAGO_INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="follow-link follow-link-secondary"
            >
              Follow on Instagram
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function Lightbox({
  displayFilms,
  activeIndex,
  activeVideoIndex,
  onClose,
  onNext,
  onPrevious,
  onSelectVideo,
}: {
  displayFilms: DisplayFilm[];
  activeIndex: number | null;
  activeVideoIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSelectVideo: (videoIndex: number) => void;
}) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  if (activeIndex === null) return null;

  const activeEntry = displayFilms[activeIndex];
  const activeFilm = activeEntry?.film;
  const activeWinner = activeEntry?.winner;
  if (!activeFilm) return null;

  const videoUrls = getFilmVideoUrls(activeFilm);
  const safeVideoIndex =
    activeVideoIndex < videoUrls.length && activeVideoIndex >= 0 ? activeVideoIndex : 0;
  const embedUrl = getYoutubeEmbedUrl(videoUrls[safeVideoIndex], true);

  function requestFullscreen() {
    const node = iframeRef.current as (HTMLIFrameElement & {
      webkitRequestFullscreen?: () => Promise<void>;
      webkitEnterFullscreen?: () => void;
    }) | null;
    if (!node) return;

    if (typeof node.requestFullscreen === "function") {
      node.requestFullscreen().catch(() => {
        if (typeof node.webkitEnterFullscreen === "function") {
          node.webkitEnterFullscreen();
        }
      });
      return;
    }

    if (typeof node.webkitRequestFullscreen === "function") {
      node.webkitRequestFullscreen();
      return;
    }

    if (typeof node.webkitEnterFullscreen === "function") {
      node.webkitEnterFullscreen();
    }
  }

  return (
    <div
      className="tv-backdrop"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background:
          "radial-gradient(circle at center, rgba(33,26,12,0.34) 0%, rgba(0,0,0,0.92) 68%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="tv-shell"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(1240px, 100%)",
          maxHeight: "calc(100vh - 3rem)",
          overflowY: "auto",
          border: `1px solid ${T.borderStrong}`,
          background:
            "linear-gradient(180deg, rgba(12,10,6,0.98) 0%, rgba(7,7,7,0.99) 100%)",
          boxShadow: "0 34px 90px rgba(0,0,0,0.5)",
        }}
      >
        <div className="tv-header">
          <div>
            <div className="tv-header-title">{activeFilm.title}</div>
            <div className="tv-header-sub">
              {formatTeamLabel(activeFilm.team)} · {activeIndex + 1} / {displayFilms.length}
            </div>
          </div>

          <button type="button" className="tv-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="tv-cabinet">
          <div className="tv-cabinet-inner">
            <div className="tv-screen-wrap">
              <div className="tv-screen-bezel">
                <div className="tv-screen">
                  {embedUrl ? (
                    <>
                      <iframe
                        ref={iframeRef}
                        src={`${embedUrl}&playsinline=1`}
                        title={activeFilm.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        style={{
                          width: "100%",
                          height: "100%",
                          border: 0,
                          transform: "scale(1.02)",
                          transformOrigin: "center",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          pointerEvents: "none",
                          background:
                            "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 14%, transparent 30%, transparent 70%, rgba(0,0,0,0.12) 100%)",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          pointerEvents: "none",
                          background:
                            "repeating-linear-gradient(180deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 2px, transparent 4px)",
                          opacity: 0.13,
                          mixBlendMode: "screen",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          pointerEvents: "none",
                          background:
                            "radial-gradient(circle at 50% 42%, transparent 42%, rgba(0,0,0,0.16) 78%, rgba(0,0,0,0.38) 100%)",
                        }}
                      />
                      <div className="tv-broadcast-badge">Premiere Broadcast</div>
                    </>
                  ) : (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        padding: "1.5rem",
                        color: "rgba(232,222,192,0.7)",
                        fontFamily: T.sans,
                        background:
                          "radial-gradient(circle at center, rgba(248,236,188,0.08) 0%, rgba(8,8,8,0.98) 72%)",
                      }}
                    >
                      Add a YouTube URL to this film entry to enable the larger preview.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <aside className="tv-sidebar">
              <div className="tv-info-panel">
                <div
                  style={{
                    fontFamily: T.sans,
                    fontSize: "0.78rem",
                    fontWeight: 800,
                    letterSpacing: "0.04em",
                    color: T.goldSoft,
                    textTransform: "uppercase",
                  }}
                >
                  {formatTeamLabel(activeFilm.team)}
                </div>
                {activeWinner ? (
                  <div
                    style={{
                      marginTop: "0.45rem",
                      fontFamily: T.sans,
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      color: T.gold,
                    }}
                  >
                    {activeWinner.award}
                  </div>
                ) : null}
                <div
                  style={{
                    marginTop: "0.5rem",
                    fontFamily: T.sans,
                    fontSize: "0.84rem",
                    lineHeight: 1.55,
                    color: "rgba(232,222,192,0.74)",
                  }}
                >
                  {activeIndex + 1} of {displayFilms.length} in the archive
                </div>
              </div>

              <div className="tv-grill-panel">
                <div
                  style={{
                    fontFamily: T.sans,
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    color: T.amberDim,
                    textTransform: "uppercase",
                    marginBottom: "0.7rem",
                  }}
                >
                  Speaker grill
                </div>
                <div className="tv-grill" />
              </div>

              <div className="tv-dials-panel">
                <div
                  style={{
                    display: "flex",
                    gap: "0.8rem",
                    justifyContent: "space-between",
                  }}
                >
                  {["Volume", "Tuning"].map((label) => (
                    <div
                      key={label}
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.45rem",
                      }}
                    >
                      <div className="tv-dial">
                        <div className="tv-dial-indicator" />
                      </div>
                      <div
                        style={{
                          fontFamily: T.sans,
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          color: "rgba(232,222,192,0.72)",
                        }}
                      >
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>

        <div className="tv-controls">
          <div className="tv-control-group">
            <button type="button" className="tv-btn tv-btn-secondary" onClick={onPrevious}>
              <span className="tv-btn-long">Previous film</span>
              <span className="tv-btn-short">Prev</span>
            </button>
            <button
              type="button"
              className="tv-btn tv-btn-secondary tv-fullscreen-btn"
              onClick={requestFullscreen}
            >
              Fullscreen
            </button>
            <button type="button" className="tv-btn tv-btn-primary" onClick={onNext}>
              <span className="tv-btn-long">Next film</span>
              <span className="tv-btn-short">Next</span>
            </button>
          </div>

          {videoUrls.length > 1 ? (
            <div className="tv-control-group">
              {videoUrls.map((_, index) => (
                <button
                  key={`${activeFilm.title}-video-${index}`}
                  type="button"
                  onClick={() => onSelectVideo(index)}
                  className={`tv-btn ${index === safeVideoIndex ? "tv-btn-primary" : "tv-btn-secondary"}`}
                >
                  Video {index + 1}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

const FilmsPage: React.FC = () => {
  const [lightboxState, setLightboxState] = useState<{
    filmIndex: number;
    videoIndex: number;
  } | null>(null);

  useEffect(() => {
    if (!lightboxState) return;

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setLightboxState(null);
        return;
      }

      if (event.key === "ArrowRight") {
        setLightboxState((current) => {
          if (!current) return current;
          return {
            filmIndex: (current.filmIndex + 1) % playableFilms.length,
            videoIndex: 0,
          };
        });
      }

      if (event.key === "ArrowLeft") {
        setLightboxState((current) => {
          if (!current) return current;
          return {
            filmIndex:
              (current.filmIndex - 1 + playableFilms.length) % playableFilms.length,
            videoIndex: 0,
          };
        });
      }
    }

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [lightboxState]);

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
          opacity: 0.03,
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

      <main style={{ position: "relative", padding: "7.5rem 1.5rem 4rem" }}>
        <section style={{ maxWidth: 1040, margin: "0 auto", paddingBottom: "3.5rem" }}>
          <div
            style={{
              fontFamily: T.sans,
              fontSize: "0.82rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: T.amber,
            }}
          >
            The premiere broadcast
          </div>
          <h1
            style={{
              margin: "1rem 0 0",
              fontFamily: T.serif,
              fontSize: "clamp(2.6rem, 6vw, 4.6rem)",
              fontWeight: 400,
              lineHeight: 1.04,
              letterSpacing: "-0.01em",
              color: T.gold,
              maxWidth: 880,
            }}
          >
            19 films. 100 filmmakers. One twelve-hour window in Dublin.
          </h1>
          <p
            style={{
              margin: "1.25rem 0 0",
              maxWidth: 720,
              fontFamily: T.sans,
              fontSize: "1rem",
              lineHeight: 1.7,
              color: "rgba(232,222,192,0.78)",
            }}
          >
            For twelve hours in Dublin, we filled a room with the best artists and
            engineers we could find. Actors worked next to researchers. Editors next to
            startup founders. Storyboard artists next to ML engineers. Most of them had
            never met before that morning, and by evening nineteen films existed that
            didn't exist at breakfast. Everyone came back together to watch the premiere
            the next day. Thank you to Wan AI (Alibaba), ElevenLabs, fal.ai, Wolfpack
            Digital, and Napkin. None of this happens without you.
          </p>

          <div className="films-stats-grid">
            <HeroStat value={String(displayFilms.length)} label="Films" />
            <HeroStat value="100" label="Attendees" />
            <HeroStat value="5" label="Awards" />
            <HeroStat value="12 hrs" label="Build window" />
          </div>

          <FollowCard
            showInstagram={false}
            marginTop="1.5rem auto 0"
            title="Stay in the loop"
            eyebrow=""
            compact
          />
        </section>

        <section style={{ maxWidth: 1040, margin: "0 auto", paddingTop: "3rem", borderTop: `1px solid ${T.border}` }}>
          <div className="films-section-head">
            <div>
              <div
                style={{
                  fontFamily: T.sans,
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: T.amber,
                }}
              >
                The full lineup
              </div>
              <h2
                style={{
                  margin: "0.9rem 0 0",
                  fontFamily: T.serif,
                  fontSize: "clamp(1.9rem, 4vw, 2.8rem)",
                  fontWeight: 400,
                  color: T.gold,
                  lineHeight: 1.1,
                  letterSpacing: "-0.005em",
                }}
              >
                The full reel, front to back.
              </h2>
            </div>

          </div>

          <div className="films-grid">
            {displayFilms.map(({ film, winner }, index) => (
              <PreviewCard
                key={`${film.team}-${film.title}-${index}`}
                film={film}
                winner={winner}
                onOpenLightbox={() => {
                  const playableIndex = playableFilms.findIndex(
                    ({ film: playableFilm }) =>
                      getUniqueFilmKey(playableFilm) === getUniqueFilmKey(film),
                  );

                  if (playableIndex >= 0) {
                    setLightboxState({ filmIndex: playableIndex, videoIndex: 0 });
                  }
                }}
              />
            ))}
          </div>
        </section>

        <FollowCard />

        <style>{`
          .films-stats-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 0.9rem;
            margin-top: 2rem;
          }

          .films-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 1.5rem;
          }

          .films-section-head {
            display: flex;
            align-items: end;
            justify-content: space-between;
            gap: 1.25rem;
            margin-bottom: 1.75rem;
          }

          .films-note {
            max-width: 320px;
            border: 1px solid ${T.border};
            background: rgba(248,236,188,0.03);
            padding: 0.95rem 1.05rem;
            font-family: ${T.sans};
            font-size: 0.92rem;
            line-height: 1.6;
            color: rgba(232,222,192,0.76);
          }

          .follow-card {
            display: flex;
            gap: 1.5rem;
          }

          .follow-card-compact {
            align-items: center;
            justify-content: space-between;
          }

          .follow-card-featured {
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            gap: 1.1rem;
          }

          .follow-copy {
            display: flex;
            flex-direction: column;
            min-width: 0;
          }

          .follow-copy-compact {
            max-width: 300px;
          }

          .follow-copy-featured {
            align-items: center;
            max-width: 700px;
          }

          .follow-actions {
            display: flex;
            align-items: stretch;
            gap: 0.75rem;
            flex-wrap: wrap;
          }

          .follow-actions-compact {
            justify-content: flex-end;
            flex-shrink: 0;
          }

          .follow-actions-featured {
            justify-content: center;
            width: 100%;
          }

          .follow-link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 48px;
            padding: 0.82rem 1.2rem;
            border: 1px solid rgba(200,170,80,0.32);
            background: rgba(248,236,188,0.03);
            color: ${T.gold};
            text-decoration: none;
            font-family: ${T.sans};
            font-size: 0.95rem;
            font-weight: 800;
            letter-spacing: 0.01em;
            transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease,
              box-shadow 0.2s ease;
          }

          .follow-link:hover {
            border-color: rgba(220,185,90,0.48);
            background: rgba(220,185,90,0.08);
            transform: translateY(-1px);
          }

          .follow-link-primary {
            border-color: rgba(220,185,90,0.66);
            background: linear-gradient(180deg, rgba(220,185,90,0.22) 0%, rgba(160,126,42,0.14) 100%);
            box-shadow: inset 0 1px 0 rgba(255,240,194,0.12), 0 10px 24px rgba(0,0,0,0.18);
          }

          .follow-link-primary:hover {
            border-color: rgba(248,236,188,0.8);
            background: linear-gradient(180deg, rgba(230,194,99,0.3) 0%, rgba(170,132,46,0.18) 100%);
            box-shadow: inset 0 1px 0 rgba(255,240,194,0.18), 0 14px 28px rgba(0,0,0,0.24);
          }

          .follow-link-secondary {
            min-width: 180px;
            background: rgba(248,236,188,0.05);
          }

          .follow-actions-featured .follow-link-primary {
            min-width: 220px;
          }

          .follow-link-secondary:hover {
            background: rgba(220,185,90,0.1);
          }

          .synopsis-toggle::-webkit-details-marker {
            display: none;
          }

          .synopsis-toggle-arrow {
            display: inline-block;
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 7px solid ${T.amberDim};
            transform-origin: center;
            transition: transform 0.18s ease, border-top-color 0.18s ease;
          }

          .synopsis-details[open] .synopsis-toggle-arrow {
            transform: rotate(180deg);
            border-top-color: ${T.goldSoft};
          }

          .tv-backdrop {
            padding: 1.5rem;
          }

          .tv-shell {
            border-radius: 34px;
            padding: 1.15rem;
          }

          .tv-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            margin-bottom: 0.85rem;
          }

          .tv-header-title {
            font-family: ${T.serif};
            font-size: 1.6rem;
            font-weight: 500;
            color: ${T.gold};
            line-height: 1.2;
            letter-spacing: -0.005em;
          }

          .tv-header-sub {
            margin-top: 0.4rem;
            font-family: ${T.sans};
            font-size: 0.9rem;
            font-weight: 500;
            letter-spacing: 0.01em;
            color: ${T.amberDim};
          }

          .tv-close {
            border: 1px solid ${T.borderStrong};
            background: linear-gradient(180deg, rgba(45,36,15,0.92) 0%, rgba(17,13,7,0.98) 100%);
            color: ${T.gold};
            width: 46px;
            height: 46px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.1rem;
            box-shadow: inset 0 1px 0 rgba(248,236,188,0.14);
            flex-shrink: 0;
          }

          .tv-broadcast-badge {
            position: absolute;
            top: 4%;
            left: 3%;
            padding: 0.28rem 0.5rem;
            border: 1px solid rgba(248,236,188,0.18);
            background: rgba(0,0,0,0.36);
            color: rgba(248,236,188,0.78);
            font-family: ${T.sans};
            font-size: 0.72rem;
            font-weight: 700;
            letter-spacing: 0.04em;
            border-radius: 999px;
          }

          .tv-controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 0.85rem;
            flex-wrap: wrap;
            margin-top: 0.95rem;
          }

          .tv-control-group {
            display: flex;
            gap: 0.55rem;
            flex-wrap: wrap;
          }

          .tv-btn {
            border: 1px solid ${T.borderStrong};
            padding: 0.78rem 1rem;
            font-family: ${T.sans};
            font-size: 0.88rem;
            font-weight: 700;
            letter-spacing: 0.01em;
            border-radius: 999px;
            cursor: pointer;
          }

          .tv-btn-secondary {
            background: linear-gradient(180deg, rgba(52,40,18,0.92) 0%, rgba(17,13,7,0.98) 100%);
            color: ${T.goldSoft};
            box-shadow: inset 0 1px 0 rgba(248,236,188,0.12);
          }

          .tv-btn-primary {
            background: linear-gradient(180deg, rgba(112,84,32,0.96) 0%, rgba(48,34,13,0.98) 100%);
            color: ${T.gold};
            font-weight: 800;
            box-shadow: inset 0 1px 0 rgba(248,236,188,0.16);
          }

          .tv-cabinet {
            border-radius: 30px;
            padding: 1rem;
            border: 1px solid rgba(214,186,112,0.34);
            background: linear-gradient(145deg, rgba(106,83,48,0.96) 0%, rgba(46,35,20,0.98) 22%, rgba(14,12,9,0.99) 68%, rgba(63,48,24,0.98) 100%);
            box-shadow: inset 0 1px 0 rgba(255,238,189,0.14), inset 0 -18px 40px rgba(0,0,0,0.34), 0 24px 70px rgba(0,0,0,0.34);
          }

          .tv-cabinet-inner {
            display: flex;
            gap: 1rem;
            align-items: stretch;
          }

          .tv-screen-wrap {
            flex: 1 1 760px;
            min-width: 0;
          }

          .tv-screen-bezel {
            border-radius: 26px;
            padding: 1rem;
            background: linear-gradient(180deg, rgba(26,24,21,0.98) 0%, rgba(11,11,11,0.98) 100%);
            border: 1px solid rgba(255,235,190,0.14);
            box-shadow: inset 0 0 0 1px rgba(0,0,0,0.48), inset 0 10px 26px rgba(255,255,255,0.04), inset 0 -16px 30px rgba(0,0,0,0.45);
          }

          .tv-screen {
            position: relative;
            aspect-ratio: 16 / 9;
            overflow: hidden;
            border-radius: 22px;
            background: #020202;
            border: 1px solid rgba(248,236,188,0.12);
            box-shadow: inset 0 0 0 2px rgba(255,255,255,0.03), inset 0 0 40px rgba(0,0,0,0.75), 0 0 0 6px rgba(12,10,8,0.8);
          }

          .tv-sidebar {
            width: 220px;
            flex: 0 0 220px;
            display: flex;
            flex-direction: column;
            gap: 0.85rem;
          }

          .tv-info-panel,
          .tv-grill-panel,
          .tv-dials-panel {
            border-radius: 22px;
            padding: 0.95rem;
            border: 1px solid rgba(255,235,190,0.12);
            background: linear-gradient(180deg, rgba(20,17,12,0.94) 0%, rgba(11,10,8,0.98) 100%);
          }

          .tv-grill-panel {
            padding: 1rem 0.95rem;
          }

          .tv-grill {
            height: 122px;
            border-radius: 16px;
            border: 1px solid rgba(248,236,188,0.08);
            background: repeating-linear-gradient(180deg, rgba(248,236,188,0.12) 0px, rgba(248,236,188,0.12) 2px, rgba(10,10,10,0.96) 2px, rgba(10,10,10,0.96) 8px);
            opacity: 0.68;
          }

          .tv-dial {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: 1px solid rgba(255,235,190,0.18);
            background: radial-gradient(circle at 35% 30%, rgba(255,231,168,0.9) 0%, rgba(164,124,52,0.92) 28%, rgba(54,40,19,0.98) 62%, rgba(12,10,8,1) 100%);
            box-shadow: inset 0 2px 4px rgba(255,255,255,0.16), inset 0 -8px 16px rgba(0,0,0,0.4);
            position: relative;
          }

          .tv-dial-indicator {
            position: absolute;
            left: 50%;
            top: 8px;
            width: 3px;
            height: 14px;
            border-radius: 999px;
            background: rgba(16,12,8,0.9);
            transform: translateX(-50%);
          }

          .tv-btn-short {
            display: none;
          }

          .tv-fullscreen-btn {
            display: none;
          }

          @media (max-width: 900px) {
            .films-stats-grid,
            .films-grid {
              grid-template-columns: 1fr;
            }

            .films-section-head,
            .follow-card,
            .follow-card-compact {
              flex-direction: column;
              align-items: stretch;
            }

            .follow-actions {
              justify-content: stretch;
            }

            .follow-link {
              width: 100%;
            }

            .films-note {
              max-width: none;
            }
          }

          @media (max-width: 760px) {
            .tv-shell {
              border-radius: 18px;
              padding: 0.55rem;
            }

            .tv-cabinet {
              border-radius: 16px;
              padding: 0.4rem;
              box-shadow: inset 0 1px 0 rgba(255,238,189,0.12), 0 16px 40px rgba(0,0,0,0.4);
            }

            .tv-cabinet-inner {
              flex-direction: column;
              gap: 0.55rem;
            }

            .tv-screen-wrap {
              flex: 1 1 auto;
              width: 100%;
            }

            .tv-screen-bezel {
              border-radius: 12px;
              padding: 0.3rem;
            }

            .tv-screen {
              border-radius: 9px;
              box-shadow: inset 0 0 0 1px rgba(0,0,0,0.6), inset 0 0 22px rgba(0,0,0,0.7), 0 0 0 2px rgba(12,10,8,0.8);
            }

            .tv-sidebar {
              width: 100%;
              flex: 0 0 auto;
              flex-direction: row;
              gap: 0.45rem;
            }

            .tv-info-panel {
              flex: 1;
              padding: 0.55rem 0.7rem;
              border-radius: 12px;
            }

            .tv-grill-panel,
            .tv-dials-panel {
              display: none;
            }

            .tv-backdrop {
              padding: 0.4rem;
              align-items: flex-start;
              padding-top: 3.5rem;
            }

            .tv-header {
              margin-bottom: 0.55rem;
              gap: 0.4rem;
            }

            .tv-header-title {
              font-size: 1rem;
            }

            .tv-header-sub {
              font-size: 0.72rem;
            }

            .tv-close {
              width: 32px;
              height: 32px;
              font-size: 0.95rem;
            }

            .tv-broadcast-badge {
              font-size: 0.52rem;
              padding: 0.18rem 0.36rem;
            }

            .tv-controls {
              gap: 0.4rem;
              margin-top: 0.6rem;
              flex-direction: row;
              align-items: stretch;
            }

            .tv-control-group {
              justify-content: center;
              gap: 0.4rem;
              flex: 1;
              flex-wrap: nowrap;
            }

            .tv-btn {
              padding: 0.5rem 0.55rem;
              font-size: 0.72rem;
              letter-spacing: 0.04em;
              flex: 1 1 0;
              min-width: 0;
              white-space: nowrap;
            }

            .tv-btn-long {
              display: none;
            }

            .tv-btn-short {
              display: inline;
            }

            .tv-fullscreen-btn {
              display: inline-flex;
            }
          }
        `}</style>

        <Lightbox
          displayFilms={playableFilms}
          activeIndex={lightboxState?.filmIndex ?? null}
          activeVideoIndex={lightboxState?.videoIndex ?? 0}
          onClose={() => setLightboxState(null)}
          onPrevious={() =>
            setLightboxState((current) =>
              current
                ? {
                    filmIndex:
                      (current.filmIndex - 1 + playableFilms.length) % playableFilms.length,
                    videoIndex: 0,
                  }
                : current,
            )
          }
          onNext={() =>
            setLightboxState((current) =>
              current
                ? {
                    filmIndex: (current.filmIndex + 1) % playableFilms.length,
                    videoIndex: 0,
                  }
                : current,
            )
          }
          onSelectVideo={(videoIndex) =>
            setLightboxState((current) =>
              current
                ? {
                    filmIndex: current.filmIndex,
                    videoIndex,
                  }
                : current,
            )
          }
        />
      </main>
    </div>
  );
};

export default FilmsPage;
