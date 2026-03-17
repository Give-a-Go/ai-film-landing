import React, { useEffect, useState } from "react";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import CinematicTransition from "./components/CinematicTransition";
import CountdownSection from "./components/CountdownSection";
import EventContent from "./components/EventContent";
import EventPage from "./pages/EventPage";
import gsap from "gsap";

const App: React.FC = () => {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const isEventPage = window.location.pathname === "/event";

  useEffect(() => {
    gsap.config({ autoSleep: 60, force3D: true });
  }, []);

  if (isEventPage) {
    return <EventPage />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#E0D5C0] selection:bg-[#C6993A] selection:text-[#050505] overflow-x-hidden">
      {/* Global film grain */}
      <div style={{
        position: 'fixed', inset: 0, opacity: 0.035,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '200px', pointerEvents: 'none', zIndex: 9999,
      }} />
      {/* Global vignette */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'radial-gradient(ellipse 85% 85% at center, transparent 45%, rgba(5,5,5,0.55) 100%)',
        pointerEvents: 'none', zIndex: 100,
      }} />
      {/* Cinematic registration corner marks */}
      {([
        { top: '1rem', left: '1rem', borderTop: '1px solid rgba(198,153,58,0.22)', borderLeft: '1px solid rgba(198,153,58,0.22)' },
        { top: '1rem', right: '1rem', borderTop: '1px solid rgba(198,153,58,0.22)', borderRight: '1px solid rgba(198,153,58,0.22)' },
        { bottom: '1rem', left: '1rem', borderBottom: '1px solid rgba(198,153,58,0.22)', borderLeft: '1px solid rgba(198,153,58,0.22)' },
        { bottom: '1rem', right: '1rem', borderBottom: '1px solid rgba(198,153,58,0.22)', borderRight: '1px solid rgba(198,153,58,0.22)' },
      ] as React.CSSProperties[]).map((style, i) => (
        <div key={i} style={{
          position: 'fixed', width: 20, height: 20,
          pointerEvents: 'none', zIndex: 9998,
          ...style,
        }} />
      ))}
      <Navigation onOpenWaitlist={() => setWaitlistOpen(true)} />
      <main>
        <Hero
          waitlistOpen={waitlistOpen}
          onWaitlistOpenChange={setWaitlistOpen}
        />
        <CinematicTransition />
        <CountdownSection />
        <EventContent />
      </main>
    </div>
  );
};

export default App;
