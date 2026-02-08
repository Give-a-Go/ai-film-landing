import React, { useState, useEffect } from "react";

interface NavigationProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  onOpenWaitlist?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  isDarkMode,
  toggleTheme,
  onOpenWaitlist,
}) => {
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

  const linkClass = `block w-full text-left py-3 px-4 text-base font-medium transition-colors duration-300 min-h-[44px] flex items-center ${
    isDarkMode ? "text-gray-200 hover:text-white" : "text-gray-700 hover:text-black"
  }`;
  const linkClassSmall = `text-sm font-medium transition-colors duration-300 ${
    isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"
  }`;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 md:px-12 flex justify-between items-center bg-transparent pointer-events-none">
      {/* Logo */}
      <a
        href="https://giveago.co"
        className={`text-2xl font-serif font-medium tracking-tight pointer-events-auto cursor-pointer transition-colors duration-500 ${isDarkMode ? "text-white" : "text-black"}`}
      >
        Give(a)Go
      </a>

      {/* Center Links & Toggle (desktop only) */}
      <div className="hidden md:flex items-center gap-4 bg-white/0 backdrop-blur-[2px] px-6 py-2 rounded-full pointer-events-auto">
        <div className="flex items-center gap-8 mr-4">
          <a href="https://giveago.co" className={linkClassSmall}>
            About us
          </a>
          <a
            href="https://luma.com/giveago?period=past"
            className={linkClassSmall}
          >
            Previous events
          </a>
          <a
            href="https://giveago.co/after-movie/ai-film"
            className={linkClassSmall}
          >
            V1 Recap Video
          </a>
        </div>

        {/* Theme Toggle (desktop) */}
        <button
          onClick={toggleTheme}
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${isDarkMode ? "bg-white/10 hover:bg-white/20 text-white" : "bg-black/5 hover:bg-black/10 text-black"}`}
          aria-label="Toggle theme"
        >
          {isDarkMode ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </div>

      {/* CTAs (desktop only) + Hamburger (mobile only) - relative z-50 so hamburger stays above overlay when closed */}
      <div className="pointer-events-auto flex items-center gap-3 relative z-50">
        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            onClick={() => onOpenWaitlist?.()}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1 group ${isDarkMode ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-900"}`}
          >
            I'm interested{" "}
            <span className="group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </button>
          <a
            href="https://giveago.co/sponsor"
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${isDarkMode ? "bg-white/10 text-white hover:bg-white/20" : "bg-black/10 text-black hover:bg-black/20"}`}
          >
            Sponsor
          </a>
        </div>

        {/* Hamburger button (mobile only) */}
        <button
          type="button"
          className={`md:hidden w-11 h-11 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${isDarkMode ? "text-white focus-visible:ring-white/50" : "text-black focus-visible:ring-black/50"}`}
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

      {/* Mobile menu overlay + panel - z-[60] when open so it sits above nav (z-50) and hamburger */}
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
          className={`absolute inset-0 transition-colors duration-200 ${
            isDarkMode ? "bg-black/70" : "bg-black/40"
          }`}
          onClick={closeMenu}
          aria-hidden
        />
        {/* Panel (slide from right) */}
        <div
          className={`absolute top-0 right-0 h-full w-full max-w-sm flex flex-col transition-transform duration-200 ease-out ${
            isDarkMode ? "bg-gray-950 border-l border-white/10" : "bg-white border-l border-black/10"
          } ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-4 py-5 border-b min-h-[44px] shrink-0 border-inherit">
            <span
              className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Menu
            </span>
            <button
              type="button"
              onClick={closeMenu}
              className={`w-11 h-11 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full -mr-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${isDarkMode ? "text-gray-200 focus-visible:ring-white/50" : "text-gray-700 focus-visible:ring-black/50"}`}
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
          <nav className="flex-1 overflow-y-auto py-4 px-2" aria-label="Mobile navigation">
            <a href="https://giveago.co" className={linkClass} onClick={closeMenu}>
              About us
            </a>
            <a
              href="https://luma.com/giveago?period=past"
              className={linkClass}
              onClick={closeMenu}
            >
              Previous events
            </a>
            <a
              href="https://giveago.co/after-movie/ai-film"
              className={linkClass}
              onClick={closeMenu}
            >
              V1 Recap Video
            </a>
            <div className="border-t border-inherit my-2" />
            <div className="flex items-center gap-3 py-3 px-4 min-h-[44px]">
              <span
                className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                Theme
              </span>
              <button
                onClick={toggleTheme}
                className={`w-10 h-10 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-all duration-300 ${isDarkMode ? "bg-white/10 hover:bg-white/20 text-white" : "bg-black/5 hover:bg-black/10 text-black"}`}
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>
            </div>
            <div className="border-t border-inherit my-2" />
            <div className="px-2 space-y-2">
              <button
                type="button"
                className={`w-full rounded-full px-5 py-3 text-sm font-medium transition-all duration-300 flex items-center justify-center gap-1 min-h-[44px] ${isDarkMode ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-900"}`}
                onClick={() => {
                  onOpenWaitlist?.();
                  closeMenu();
                }}
              >
                I'm interested{" "}
                <span className="transition-transform">→</span>
              </button>
              <a
                href="https://giveago.co/sponsor"
                className={`block w-full rounded-full px-5 py-3 text-sm font-medium text-center transition-all duration-300 min-h-[44px] flex items-center justify-center ${isDarkMode ? "bg-white/10 text-white hover:bg-white/20" : "bg-black/10 text-black hover:bg-black/20"}`}
                onClick={closeMenu}
              >
                Sponsor
              </a>
            </div>
          </nav>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
