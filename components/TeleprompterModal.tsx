import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface TeleprompterModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

const TeleprompterModal: React.FC<TeleprompterModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
}) => {
  const [markdown, setMarkdown] = useState("");
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true); // Auto-scroll playing by default
  const contentRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastUserScrollTimeRef = useRef<number>(Date.now());
  const programmaticScrollGuardUntilRef = useRef<number>(0);
  const autoScrollIntervalRef = useRef<number | null>(null);

  // Constants
  const AUTO_SCROLL_SPEED = 0.5; // pixels per frame
  const AUTO_SCROLL_DELAY = 2000; // 2 seconds before starting
  const USER_SCROLL_TIMEOUT = 2000; // Resume after 2 seconds of no interaction

  // Load markdown content
  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch("/content/event-info.md");
        const text = await response.text();
        setMarkdown(text);
      } catch (error) {
        console.error("Failed to load content:", error);
        setMarkdown(
          "# Content Coming Soon\n\nWe're preparing exciting details about the event. Check back soon!",
        );
      }
    };

    if (isOpen) {
      loadContent();
    }
  }, [isOpen]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      const previousFocus = document.activeElement as HTMLElement;
      closeButtonRef.current?.focus();

      return () => {
        previousFocus?.focus();
      };
    }
  }, [isOpen]);

  // Auto-scroll logic
  useEffect(() => {
    if (!isOpen || !contentRef.current) return;

    const startAutoScroll = () => {
      const scroll = () => {
        if (!contentRef.current) return;

        const now = Date.now();
        const timeSinceLastScroll = now - lastUserScrollTimeRef.current;

        // Check if manually paused
        if (!isPlaying) {
          setIsAutoScrolling(false);
          if (autoScrollIntervalRef.current) {
            cancelAnimationFrame(autoScrollIntervalRef.current);
            autoScrollIntervalRef.current = null;
          }
          return;
        }

        // Check if we've reached the bottom
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 10) {
          setIsAutoScrolling(false);
          if (autoScrollIntervalRef.current) {
            cancelAnimationFrame(autoScrollIntervalRef.current);
            autoScrollIntervalRef.current = null;
          }
          return;
        }

        // Only auto-scroll after user inactivity
        const shouldAutoScroll = timeSinceLastScroll >= USER_SCROLL_TIMEOUT;
        setIsAutoScrolling(shouldAutoScroll);

        if (shouldAutoScroll) {
          // Guard against our own programmatic scroll triggering `onScroll`
          // and being interpreted as user interaction.
          programmaticScrollGuardUntilRef.current = Date.now() + 80;
          contentRef.current.scrollTop += AUTO_SCROLL_SPEED;
        }

        // Keep the loop alive so auto-scroll can resume
        autoScrollIntervalRef.current = requestAnimationFrame(scroll);
      };

      autoScrollIntervalRef.current = requestAnimationFrame(scroll);
    };

    // Start auto-scroll after delay
    const timeout = setTimeout(startAutoScroll, AUTO_SCROLL_DELAY);

    return () => {
      clearTimeout(timeout);
      if (autoScrollIntervalRef.current) {
        cancelAnimationFrame(autoScrollIntervalRef.current);
      }
    };
  }, [isOpen, markdown, isPlaying]);

  const markUserInteraction = () => {
    lastUserScrollTimeRef.current = Date.now();
    setIsAutoScrolling(false);
  };

  // Handle scroll (includes programmatic scroll events)
  const handleScroll = () => {
    if (Date.now() < programmaticScrollGuardUntilRef.current) return;
    markUserInteraction();
  };

  // Scroll progress tracking for progress bar
  // Use useMotionValue and manually update it to avoid the container ref hydration issue
  const scrollProgress = useMotionValue(0);

  useEffect(() => {
    if (!isOpen || !contentRef.current) return;

    const element = contentRef.current;

    const updateScrollProgress = () => {
      if (!element) return;
      const { scrollTop, scrollHeight, clientHeight } = element;
      const maxScroll = scrollHeight - clientHeight;
      const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;
      scrollProgress.set(progress);
    };

    // Initial calculation
    updateScrollProgress();

    // Update on scroll
    element.addEventListener("scroll", updateScrollProgress);

    return () => {
      element.removeEventListener("scroll", updateScrollProgress);
    };
  }, [isOpen, scrollProgress]);

  const progressWidth = useTransform(scrollProgress, [0, 1], ["0%", "100%"]);

  // Play/Pause handler
  const handlePlayPause = () => {
    if (isPlaying) {
      // Pause
      setIsPlaying(false);
      setIsAutoScrolling(false);
      if (autoScrollIntervalRef.current) {
        cancelAnimationFrame(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
    } else {
      // Resume
      setIsPlaying(true);
      lastUserScrollTimeRef.current = Date.now() - USER_SCROLL_TIMEOUT;
    }
  };

  // Progress bar click-to-seek
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!contentRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;

    const { scrollHeight, clientHeight } = contentRef.current;
    const maxScroll = scrollHeight - clientHeight;
    contentRef.current.scrollTop = maxScroll * percentage;

    lastUserScrollTimeRef.current = Date.now();
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case " ":
        case "k":
          e.preventDefault();
          handlePlayPause();
          break;
        case "ArrowUp":
          e.preventDefault();
          if (contentRef.current) {
            contentRef.current.scrollTop -= 100;
            lastUserScrollTimeRef.current = Date.now();
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          if (contentRef.current) {
            contentRef.current.scrollTop += 100;
            lastUserScrollTimeRef.current = Date.now();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, isPlaying]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`fixed inset-0 z-[100] flex items-center justify-center p-3 pt-24 pb-6 sm:p-5 sm:pt-28 sm:pb-8 md:p-8 md:pt-32 md:pb-10 backdrop-blur-sm md:backdrop-blur-md transition-colors duration-200 ${
            isDarkMode ? "bg-black/60" : "bg-white/60"
          }`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="teleprompter-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-6xl xl:max-w-7xl max-h-[calc(100vh-8rem)] sm:max-h-[calc(100vh-9rem)] md:max-h-[calc(100vh-10rem)] rounded-3xl border overflow-hidden backdrop-blur-xl flex flex-col transition-colors duration-200 ${
              isDarkMode
                ? "bg-gray-950/90 border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.65)]"
                : "bg-white/90 border-black/10 shadow-[0_30px_80px_rgba(0,0,0,0.25)]"
            }`}
          >
            <div
              className={`flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 sm:py-5 border-b ${
                isDarkMode ? "border-white/10" : "border-black/10"
              }`}
            >
              <div
                className={`text-xs sm:text-sm uppercase tracking-[0.28em] font-serif ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Event info
              </div>
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/70 ${
                  isDarkMode
                    ? "bg-white/5 hover:bg-white/10 text-gray-200"
                    : "bg-black/5 hover:bg-black/10 text-gray-700"
                }`}
                aria-label="Close event information (ESC)"
              >
                <svg
                  className="w-5 h-5"
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

            <div className="flex min-h-0 flex-1 flex-col">
              <div
                ref={contentRef}
                onScroll={handleScroll}
                onWheel={markUserInteraction}
                onTouchStart={markUserInteraction}
                onTouchMove={markUserInteraction}
                onPointerDown={markUserInteraction}
                className={`flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 md:px-8 lg:px-10 py-5 sm:py-7 md:py-8 ${
                  isDarkMode ? "text-gray-200" : "text-gray-700 light-mode"
                }`}
                style={{
                  scrollBehavior: "smooth",
                }}
                id="teleprompter-content"
              >
                <div className="mx-auto w-full max-w-3xl">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ children }) => (
                        <h1
                          id="teleprompter-title"
                          className={`text-2xl sm:text-3xl md:text-4xl font-serif font-semibold mb-5 sm:mb-7 text-center leading-tight ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2
                          className={`text-xl sm:text-2xl md:text-3xl font-serif font-semibold mb-3 sm:mb-5 mt-8 sm:mt-10 leading-snug ${
                            isDarkMode ? "text-gray-100" : "text-gray-800"
                          }`}
                        >
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3
                          className={`text-lg sm:text-xl md:text-2xl font-serif font-medium mb-2 sm:mb-3 mt-6 sm:mt-8 leading-snug ${
                            isDarkMode ? "text-gray-200" : "text-gray-700"
                          }`}
                        >
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p
                          className={`text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed ${
                            isDarkMode ? "text-gray-200" : "text-gray-700"
                          }`}
                        >
                          {children}
                        </p>
                      ),
                      ul: ({ children }) => (
                        <ul
                          className={`list-disc pl-6 mb-3 space-y-2 text-xs sm:text-sm md:text-base leading-relaxed ${
                            isDarkMode ? "text-gray-200" : "text-gray-700"
                          }`}
                        >
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol
                          className={`list-decimal pl-6 mb-3 space-y-2 text-xs sm:text-sm md:text-base leading-relaxed ${
                            isDarkMode ? "text-gray-200" : "text-gray-700"
                          }`}
                        >
                          {children}
                        </ol>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold">{children}</strong>
                      ),
                      em: ({ children }) => (
                        <em className="italic">{children}</em>
                      ),
                      a: ({ children, href }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`underline underline-offset-2 ${
                            isDarkMode
                              ? "text-purple-300 hover:text-purple-200"
                              : "text-purple-700 hover:text-purple-600"
                          }`}
                        >
                          {children}
                        </a>
                      ),
                      hr: () => (
                        <hr
                          className={`my-8 border-t ${
                            isDarkMode ? "border-white/10" : "border-black/10"
                          }`}
                        />
                      ),
                    }}
                  >
                    {markdown}
                  </ReactMarkdown>
                </div>
              </div>

              <div
                className={`border-t px-4 sm:px-6 md:px-8 py-3 sm:py-4 ${
                  isDarkMode
                    ? "border-white/10 bg-white/5"
                    : "border-black/10 bg-black/5"
                }`}
              >
                <div
                  className={`w-full h-1 rounded-full cursor-pointer ${
                    isDarkMode ? "bg-white/10" : "bg-black/10"
                  }`}
                  onClick={handleProgressBarClick}
                >
                  <motion.div
                    style={{ width: progressWidth }}
                    className={`h-full rounded-full ${
                      isDarkMode ? "bg-purple-400" : "bg-purple-600"
                    }`}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <button
                    onClick={handlePlayPause}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/70 ${
                      isDarkMode
                        ? "bg-white/10 hover:bg-white/20 text-white"
                        : "bg-black/5 hover:bg-black/10 text-gray-700"
                    }`}
                    aria-label={
                      isPlaying
                        ? "Pause auto-scroll (Space)"
                        : "Play auto-scroll (Space)"
                    }
                    aria-pressed={isPlaying}
                  >
                    {isPlaying ? (
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>

                  <div
                    className={`text-xs sm:text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {isPlaying ? "Auto-scroll on" : "Auto-scroll paused"}
                    <span className="hidden sm:inline"> · Space</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TeleprompterModal;
