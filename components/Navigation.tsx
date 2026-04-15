import React, { useState, useEffect } from "react";

const LUMA_EVENT_URL = "https://luma.com/0zqny709?utm_source=aif";

const Navigation: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on escape and prevent body scroll when menu is open
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  // All pages have a dark background — use light text throughout
  const linkClass = `block w-full text-left py-3 px-4 text-base font-medium transition-colors duration-300 min-h-[44px] flex items-center text-[rgba(224,213,192,0.65)] hover:text-[#E0D5C0]`;
  const linkClassSmall = `text-sm font-medium transition-colors duration-300 text-[rgba(224,213,192,0.55)] hover:text-[#E0D5C0]`;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 md:px-12 flex justify-between items-center bg-transparent pointer-events-none">
      {/* Logo */}
      <a
        href="https://giveago.co"
        className="text-2xl font-serif font-medium tracking-tight pointer-events-auto cursor-pointer transition-colors duration-500 text-[#E0D5C0]"
      >
        Give(a)Go
      </a>

      {/* Center Links (desktop only) */}
      <div className="hidden md:flex items-center gap-4 backdrop-blur-[2px] px-6 py-2 rounded-full pointer-events-auto">
        <div className="flex items-center gap-8">
          <a href="https://giveago.co" className={linkClassSmall}>
            About us
          </a>
          <a href="/brief" className={linkClassSmall}>
            Brief
          </a>
          <a href="/agenda" className={linkClassSmall}>
            Agenda
          </a>
          <a
            href="https://giveago.co/after-movie/ai-film"
            className={linkClassSmall}
            style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
          >
            V1 Recap <span style={{ fontSize: "0.7em", opacity: 0.7 }}>↗</span>
          </a>
        </div>
      </div>

      {/* CTAs (desktop only) + Hamburger (mobile only) */}
      <div className="pointer-events-auto flex items-center gap-3 relative z-50">
        <div className="hidden md:flex items-center gap-3">
          <a
            href={LUMA_EVENT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1 group bg-[#E0D5C0] text-[#050505] hover:bg-white no-underline"
          >
            Apply to join{" "}
            <span className="group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </a>
        </div>

        {/* Hamburger button (mobile only) */}
        <button
          type="button"
          className="md:hidden w-11 h-11 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent text-[#E0D5C0] focus-visible:ring-[#E0D5C0]/50"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu overlay + panel */}
      <div
        id="mobile-nav-menu"
        className={`md:hidden fixed inset-0 transition-opacity duration-200 ${
          menuOpen
            ? "z-[60] opacity-100 pointer-events-auto visible"
            : "z-40 opacity-0 pointer-events-none invisible"
        }`}
        aria-hidden={!menuOpen}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 transition-colors duration-200 bg-black/40"
          onClick={closeMenu}
          aria-hidden
        />
        {/* Panel (slide from right) */}
        <div
          className={`absolute top-0 right-0 h-full w-full max-w-sm flex flex-col transition-transform duration-200 ease-out ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
          style={{
            background: "#0a0905",
            borderLeft: "1px solid rgba(198,153,58,0.22)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="flex items-center justify-between px-4 py-5 min-h-[44px] shrink-0"
            style={{ borderBottom: "1px solid rgba(198,153,58,0.18)" }}
          >
            <span
              className="text-sm font-medium"
              style={{
                color: "rgba(220,185,90,0.9)",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "0.62rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
              }}
            >
              Menu
            </span>
            <button
              type="button"
              onClick={closeMenu}
              className="w-11 h-11 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full -mr-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:ring-[#C6993A]/50"
              style={{ color: "rgba(224,213,192,0.7)" }}
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <nav
            className="flex-1 overflow-y-auto py-4 px-2"
            aria-label="Mobile navigation"
          >
            <a
              href="https://giveago.co"
              className={linkClass}
              onClick={closeMenu}
            >
              About us
            </a>
            <a href="/brief" className={linkClass} onClick={closeMenu}>
              Brief
            </a>
            <a href="/agenda" className={linkClass} onClick={closeMenu}>
              Agenda
            </a>
            <a
              href="https://giveago.co/after-movie/ai-film"
              className={linkClass}
              onClick={closeMenu}
              style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}
            >
              V1 Recap{" "}
              <span style={{ fontSize: "0.75em", opacity: 0.6 }}>↗</span>
            </a>
            <div
              className="my-2"
              style={{ borderTop: "1px solid rgba(198,153,58,0.14)" }}
            />
            <div className="px-2 space-y-2">
              <a
                href={LUMA_EVENT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-full px-5 py-3 text-sm font-medium transition-all duration-300 flex items-center justify-center gap-1 min-h-[44px] no-underline"
                style={{ background: "#E0D5C0", color: "#050505" }}
                onClick={closeMenu}
              >
                Apply to join <span className="transition-transform">→</span>
              </a>
            </div>
          </nav>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
