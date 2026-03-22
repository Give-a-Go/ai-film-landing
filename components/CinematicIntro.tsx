import React, { useRef, useEffect, useState, useMemo } from "react";

const COLORS = {
  BG: "#050505",
  SURFACE: "#0a0a0a",
  GOLD_RAW: "#C6993A",
  GOLD_LIGHT: "#D4AF5A",
  GOLD_PALE: "#E8D5A3",
  GOLD_DIM: "#5A4D2E",
  BONE: "#E0D5C0",
  MUTED: "#4A4232",
  BORDER: "#1E1A12",
};

function tryVibrate(pattern: number[]) {
  try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (_) {}
}

const phase = (p: number, start: number, end: number) => Math.min(Math.max((p - start) / (end - start), 0), 1);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

const CinematicIntro: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const lastNumberRef = useRef(3);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // How far we've scrolled into this container vs the max scrollable distance
      const scrolled = -rect.top;
      const maxScroll = rect.height - window.innerHeight;
      setScrollProgress(Math.min(Math.max(scrolled / maxScroll, 0), 1));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // seed on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const s = scrollProgress;

  // Sequential phases matching /event page exactly
  const introOp = easeOut(1 - phase(s, 0, 0.08));
  
  // Clapperboard: drops in at 0.08, exits at 0.40
  const clapDrop = easeOut(phase(s, 0.08, 0.14));
  const clapExit = easeInOut(phase(s, 0.26, 0.40));
  const clapY = -120 + clapDrop * 120 + clapExit * 140;
  const clapOp = s > 0.40 ? 0 : 1;
  const clapArmAngle = lerp(-28, 0, easeInOut(phase(s, 0.20, 0.25)));
  
  // Flash: 0.24-0.30
  const flashPhase = phase(s, 0.24, 0.30);
  const flashOp = flashPhase < 0.4 ? flashPhase / 0.4 : 1 - (flashPhase - 0.4) / 0.6;
  
  // Camera: slides in at 0.32-0.58
  const camIn = easeOut(phase(s, 0.32, 0.58));
  const camTx = (1 - camIn) * -120;
  const camTy = (1 - camIn) * 80;
  const camOp = easeOut(phase(s, 0.32, 0.50));
  const camRotate = -6 * (1 - camIn);
  
  // Beam: 0.50-0.70
  const beamOp = easeOut(phase(s, 0.50, 0.70));
  
  // Screen: 0.54-0.70
  const screenOp = easeOut(phase(s, 0.54, 0.70));
  const screenScale = 0.92 + screenOp * 0.08;
  
  // Text wipe: 0.68-0.90
  const textWp = easeOut(phase(s, 0.68, 0.90));
  
  // Haptics
  useEffect(() => {
    // Countdown numbers
    const currentNumber = s < 0.025 ? 3 : s < 0.05 ? 2 : s < 0.075 ? 1 : 0;
    if (currentNumber !== lastNumberRef.current && currentNumber > 0) {
      lastNumberRef.current = currentNumber;
      tryVibrate([35]);
    }
    // Clapper snap
    if (s > 0.20 && s < 0.22 && scrollProgress < 0.20) {
      tryVibrate([25]);
    }
  }, [s]);

  return (
    <>
      <div ref={containerRef} style={{ height: '500vh', position: 'relative', background: COLORS.BG }}>
        <div style={{
          position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: COLORS.BG,
        }}>
          
          {/* INTRO TEXT */}
          {introOp > 0 && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              zIndex: 2, pointerEvents: 'none', opacity: introOp,
            }}>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 'clamp(0.55rem, 1vw, 0.75rem)',
                color: 'rgba(255,255,255,0.28)',
                letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '1.4rem',
              }}>
                Scroll to begin
              </div>
              <div style={{
                fontFamily: "'IBM Plex Serif', serif",
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 700, color: 'rgba(255,255,255,0.9)',
                letterSpacing: '0.02em', lineHeight: 1.05, textAlign: 'center',
              }}>
                AI Filmmaking<br />
                <span style={{ fontWeight: 300, fontStyle: 'italic', fontSize: '0.75em' }}>Hackathon v2</span>
              </div>
              <div style={{ marginTop: '2.5rem', width: 1, height: 56, background: 'linear-gradient(to bottom, rgba(255,255,255,0.35), transparent)' }} />
            </div>
          )}

          {/* CLAPPERBOARD */}
          {clapOp > 0 && (
            <svg ref={clapRef} viewBox="0 0 320 220" style={{
              position: 'absolute', top: '8%', left: '50%',
              transform: `translateX(-50%) translateY(${clapY}%)`,
              width: 'min(480px, 58vw)', zIndex: 8,
              filter: 'drop-shadow(0 12px 40px rgba(0,0,0,0.95))',
              opacity: clapOp,
            }} aria-hidden="true">
              <rect x="0" y="40" width="320" height="180" rx="5" fill="#2a2a2a" />
              {Array.from({ length: 16 }, (_, i) => (
                <rect key={i} x={i * 22 - 8} y="40" width="13" height="72" fill={i % 2 === 0 ? '#0f0f0f' : '#e8e8e8'} transform="skewX(-15)" />
              ))}
              <rect x="0" y="40" width="320" height="180" rx="5" fill="none" stroke="#555" strokeWidth="2" />
              <rect x="4" y="114" width="312" height="102" rx="3" fill="#e8dff0" />
              {[132, 150, 168, 186, 204].map(y => (
                <line key={y} x1="12" y1={y} x2="308" y2={y} stroke="rgba(0,0,0,0.10)" strokeWidth="1" />
              ))}
              <text x="14" y="130" fontFamily="monospace" fontSize="11" fill="#1a1a1a" fontWeight="bold" letterSpacing="1">SCENE  01  /  TAKE  01</text>
              <text x="14" y="150" fontFamily="monospace" fontSize="9.5" fill="#333">DIRECTOR:  AI SYSTEMS</text>
              <text x="14" y="168" fontFamily="monospace" fontSize="9.5" fill="#333">PROD:  Give(a)Go</text>
              <text x="14" y="186" fontFamily="monospace" fontSize="9.5" fill="#333">TITLE:  AI FILM HACKATHON v2</text>
              <text x="14" y="207" fontFamily="monospace" fontSize="9" fill="#888">DATE:  2026  ·  DUBLIN</text>
              <circle cx="10" cy="40" r="9" fill="#888" stroke="#aaa" strokeWidth="1.5" />
              <circle cx="10" cy="40" r="4.5" fill="#ccc" />
              <circle cx="310" cy="40" r="9" fill="#888" stroke="#aaa" strokeWidth="1.5" />
              <circle cx="310" cy="40" r="4.5" fill="#ccc" />
              <g ref={clapArmRef} style={{ transformOrigin: '4px 40px', transform: `rotate(${clapArmAngle}deg)` }}>
                <rect x="0" y="5" width="320" height="37" rx="4" fill="#2a2a2a" />
                {Array.from({ length: 16 }, (_, i) => (
                  <rect key={i} x={i * 22 - 8} y="5" width="13" height="37" fill={i % 2 === 0 ? '#e8e8e8' : '#0f0f0f'} transform="skewX(-15)" />
                ))}
                <rect x="0" y="5" width="320" height="37" rx="4" fill="none" stroke="#666" strokeWidth="1.5" />
                <circle cx="10" cy="40" r="9" fill="#666" stroke="#999" strokeWidth="1.5" />
                <circle cx="10" cy="40" r="4.5" fill="#bbb" />
                <circle cx="310" cy="40" r="9" fill="#666" stroke="#999" strokeWidth="1.5" />
                <circle cx="310" cy="40" r="4.5" fill="#bbb" />
              </g>
            </svg>
          )}

          {/* FLASH */}
          {flashOp > 0 && (
            <div style={{
              position: 'absolute', inset: 0,
              background: '#fff', opacity: flashOp * 0.85, zIndex: 10, pointerEvents: 'none',
            }} />
          )}

          {/* CAMERA + GLOW */}
          <div ref={cameraGroupRef} style={{
            position: 'absolute', bottom: '4%', left: '3%',
            transform: `translateX(${camTx}%) translateY(${camTy}%) rotate(${camRotate}deg)`,
            width: 'min(260px, 28vw)', opacity: camOp, zIndex: 3,
            filter: 'drop-shadow(0 4px 28px rgba(200,150,30,0.28))',
          }}>
            {/* Simplified camera SVG */}
            <svg viewBox="0 0 300 380" style={{ width: '100%', height: 'auto' }}>
              <rect x="40" y="55" width="180" height="130" rx="8" fill="#404040" stroke="#666" strokeWidth="2" />
              <circle cx="72" cy="75" r="22" fill="#3a3a3a" stroke="#777" strokeWidth="2" />
              <circle cx="72" cy="75" r="16" fill="#2a2a2a" stroke="#666" strokeWidth="1.5" />
              <circle cx="188" cy="75" r="22" fill="#3a3a3a" stroke="#777" strokeWidth="2" />
              <circle cx="188" cy="75" r="16" fill="#2a2a2a" stroke="#666" strokeWidth="1.5" />
              <circle cx="270" cy="120" r="24" fill="#1a1a1a" stroke="#777" strokeWidth="2.5" />
              <circle cx="270" cy="120" r="19" fill="#222" stroke="#666" strokeWidth="1.5" />
              <rect x="108" y="185" width="44" height="16" rx="4" fill="#333" stroke="#555" strokeWidth="1.5" />
              <line x1="118" y1="198" x2="52" y2="375" stroke="#555" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="130" y1="201" x2="130" y2="375" stroke="#555" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="142" y1="198" x2="208" y2="375" stroke="#555" strokeWidth="3.5" strokeLinecap="round" />
            </svg>
          </div>
          
          <div ref={cameraGlowRef} style={{
            position: 'absolute', width: '50%', height: '70%', bottom: 0, left: 0,
            background: 'radial-gradient(ellipse at 20% 90%, rgba(255,200,50,0.16) 0%, transparent 62%)',
            pointerEvents: 'none', opacity: easeOut(phase(s, 0.40, 0.60)), zIndex: 1,
          }} />

          {/* BEAM */}
          <div ref={beamRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: beamOp, zIndex: 2 }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'conic-gradient(from 0deg at 19% 71%, transparent 33deg, rgba(255,215,70,0.05) 49deg, rgba(255,210,60,0.11) 66deg, rgba(255,215,70,0.05) 83deg, transparent 99deg)',
              filter: 'blur(35px)',
            }} />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'conic-gradient(from 0deg at 19% 71%, transparent 45deg, rgba(255,232,100,0.12) 56deg, rgba(255,228,90,0.28) 66deg, rgba(255,232,100,0.12) 76deg, transparent 87deg)',
              filter: 'blur(16px)',
            }} />
            {/* Lens hotspot */}
            <div style={{
              position: 'absolute', left: '19%', top: '71%', width: 64, height: 52,
              transform: 'translate(-50%, -50%)', borderRadius: '50%',
              background: 'radial-gradient(ellipse at center, rgba(255,255,220,0.92) 0%, rgba(255,248,160,0.60) 28%, rgba(255,230,90,0.25) 58%, transparent 82%)',
              filter: 'blur(5px)', zIndex: 1,
            }} />
          </div>

          {/* SCREEN */}
          <div ref={screenRef} style={{
            position: 'absolute', right: '2%', top: '50%',
            transform: `translateY(-50%) perspective(1200px) rotateY(-4deg) scale(${screenScale})`,
            width: 'clamp(500px, 62vw, 900px)', aspectRatio: '16/9',
            opacity: screenOp, border: '3px solid rgba(200,180,100,0.22)',
            boxShadow: '0 0 80px rgba(255,215,60,0.16), 0 0 160px rgba(255,200,40,0.07), inset 0 0 80px rgba(0,0,0,0.72)',
            background: 'linear-gradient(135deg, rgba(22,17,6,0.98) 0%, rgba(10,8,2,1) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 4,
          }}>
            <div style={{ position: 'absolute', inset: 8, border: '1px solid rgba(180,155,80,0.13)', pointerEvents: 'none' }} />
            <div ref={screenTextRef} style={{
              clipPath: `inset(0 ${(1 - textWp) * 100}% 0 0)`,
              textAlign: 'center', padding: '0 6%', position: 'relative', zIndex: 1,
            }}>
              <div style={{
                fontFamily: "'IBM Plex Serif', serif",
                fontSize: 'clamp(2.4rem, 5.5vw, 4rem)',
                fontWeight: 700, color: COLORS.GOLD_PALE,
                letterSpacing: '0.04em', lineHeight: 1.1,
                textShadow: '0 0 40px rgba(255,215,60,0.55), 0 2px 8px rgba(0,0,0,0.95)',
              }}>
                AI Filmmaking
              </div>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 'clamp(0.55rem, 1.2vw, 0.85rem)',
                color: COLORS.GOLD_RAW, letterSpacing: '0.3em', marginTop: '0.7em', textTransform: 'uppercase',
              }}>
                Hackathon · v2
              </div>
            </div>
          </div>

          {/* SCROLL HINT */}
          {s < 0.02 && (
            <div style={{
              position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
              color: 'rgba(255,255,255,0.18)', fontSize: '1rem', pointerEvents: 'none', zIndex: 5,
            }}>↓</div>
          )}
        </div>
      </div>

      {/* FEATURE PRESENTATION */}
      <div style={{
        padding: '4rem 2rem',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
        background: COLORS.BG,
      }}>
        <div style={{ width: 'min(520px,80vw)', height: 1, background: 'rgba(200,170,80,0.18)' }} />
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '0.65rem', letterSpacing: '0.5em', color: 'rgba(200,170,80,0.38)',
          textTransform: 'uppercase',
        }}>
          Feature Presentation
        </div>
        <div style={{ width: 'min(520px,80vw)', height: 1, background: 'rgba(200,170,80,0.18)' }} />
      </div>
    </>
  );
};

// Refs for direct DOM manipulation
const clapRef = React.createRef<SVGSVGElement>();
const clapArmRef = React.createRef<SVGGElement>();
const cameraGroupRef = React.createRef<HTMLDivElement>();
const cameraGlowRef = React.createRef<HTMLDivElement>();
const beamRef = React.createRef<HTMLDivElement>();
const screenRef = React.createRef<HTMLDivElement>();
const screenTextRef = React.createRef<HTMLDivElement>();

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default CinematicIntro;
