import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WaitlistMorphProps {
  isDarkMode: boolean;
}

type FormState = "idle" | "loading" | "success" | "error";

const WaitlistMorph: React.FC<WaitlistMorphProps> = ({ isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormState("error");
      setErrorMessage("Please enter a valid email");
      return;
    }

    setFormState("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      setFormState("success");
      setTimeout(() => {
        setIsOpen(false);
        setEmail("");
        setFormState("idle");
      }, 2500);
    } catch (error) {
      setFormState("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  const handleClose = () => {
    if (formState !== "loading") {
      setIsOpen(false);
      setEmail("");
      setFormState("idle");
      setErrorMessage("");
    }
  };

  return (
    <motion.div
      layout
      className="relative w-full sm:w-auto"
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.button
            key="button"
            layout
            onClick={() => setIsOpen(true)}
            className={`w-full sm:w-auto rounded-full px-6 py-3 md:px-8 md:py-3.5 text-sm font-medium hover:scale-105 transition-all duration-300 whitespace-nowrap ${
              isDarkMode
                ? "bg-white text-black hover:bg-gray-200"
                : "bg-dark text-white"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            I'm interested
          </motion.button>
        ) : (
          <motion.form
            key="form"
            layout
            onSubmit={handleSubmit}
            className={`rounded-full px-4 py-2 flex items-center gap-2 min-w-[280px] sm:min-w-[320px] ${
              isDarkMode
                ? "bg-white text-black"
                : "bg-dark text-white"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {formState === "success" ? (
              <motion.div
                className="flex items-center justify-center w-full py-1.5 text-sm font-medium"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <span>✓ You're on the list!</span>
              </motion.div>
            ) : (
              <>
                <input
                  ref={inputRef}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  disabled={formState === "loading"}
                  className={`flex-1 bg-transparent outline-none text-sm placeholder:opacity-50 ${
                    isDarkMode ? "text-black" : "text-white"
                  }`}
                />
                <button
                  type="submit"
                  disabled={formState === "loading"}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isDarkMode
                      ? "bg-black text-white hover:bg-gray-800"
                      : "bg-white text-black hover:bg-gray-100"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {formState === "loading" ? "..." : "Join"}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={formState === "loading"}
                  className="text-lg leading-none opacity-60 hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
                  aria-label="Close"
                >
                  ×
                </button>
              </>
            )}
          </motion.form>
        )}
      </AnimatePresence>
      
      {formState === "error" && errorMessage && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`absolute top-full mt-2 text-xs ${
            isDarkMode ? "text-red-400" : "text-red-600"
          }`}
        >
          {errorMessage}
        </motion.p>
      )}
    </motion.div>
  );
};

export default WaitlistMorph;
