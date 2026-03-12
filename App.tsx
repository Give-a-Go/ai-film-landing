import React, { useEffect, useState } from "react";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import gsap from "gsap";

const App: React.FC = () => {
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  useEffect(() => {
    // Global GSAP settings
    gsap.config({
      autoSleep: 60,
      force3D: true,
    });
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-purple-200 selection:text-purple-900 overflow-hidden">
      <Navigation onOpenWaitlist={() => setWaitlistOpen(true)} />
      <main>
        <Hero
          waitlistOpen={waitlistOpen}
          onWaitlistOpenChange={setWaitlistOpen}
        />
      </main>
    </div>
  );
};

export default App;
