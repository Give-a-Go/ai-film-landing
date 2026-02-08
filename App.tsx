import React, { useEffect, useState } from "react";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import gsap from "gsap";

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  useEffect(() => {
    // Global GSAP settings
    gsap.config({
      autoSleep: 60,
      force3D: true,
    });
  }, []);

  return (
    <div
      className={`min-h-screen transition-colors duration-700 ${isDarkMode ? "bg-[#050505] text-white selection:bg-purple-800 selection:text-purple-100" : "bg-white text-slate-900 selection:bg-purple-200 selection:text-purple-900"} overflow-hidden`}
    >
      <Navigation
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        onOpenWaitlist={() => setWaitlistOpen(true)}
      />
      <main>
        <Hero
          isDarkMode={isDarkMode}
          waitlistOpen={waitlistOpen}
          onWaitlistOpenChange={setWaitlistOpen}
        />
      </main>
    </div>
  );
};

export default App;
