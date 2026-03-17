import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";

const ARC_R = 75;

function tryVibrate(pattern: number[]) {
  try {
    if (navigator.vibrate) navigator.vibrate(pattern);
  } catch (_) {}
}

const CountdownSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [currentNumber, setCurrentNumber] = useState(3);
  const [isComplete, setIsComplete] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const lastNumberRef = useRef(3);
  const hasCompletedRef = useRef(false);
  const isTransitioningRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate scroll progress through countdown zone
  const getProgress = useCallback(() => {
    const container = containerRef.current;
    if (!container) return 0;
    
    const rect = container.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Start as soon as the section enters the viewport
    // End when top reaches -30% (fully scrolled past)
    const startOffset = viewportHeight;
    const endOffset = viewportHeight * -0.3;
    const totalDistance = startOffset - endOffset;
    
    const position = rect.top - startOffset;
    let progress = -position / totalDistance;
    return Math.max(0, Math.min(1, progress));
  }, []);

  // Handle scroll-driven countdown
  useEffect(() => {
    if (isTransitioningRef.current) return;

    const progress = getProgress();

    // Reset completed state if user scrolls back up to the beginning
    if (progress < 0.05 && hasCompletedRef.current) {
      hasCompletedRef.current = false;
      setIsComplete(false);
    }

    const numberProgress = progress * 3;
    const newNumber = Math.max(1, Math.ceil(3 - numberProgress));

    // Trigger haptic on number change
    if (newNumber !== lastNumberRef.current) {
      lastNumberRef.current = newNumber;
      tryVibrate([30]);
    }

    setCurrentNumber(newNumber);

    // When reaching "1" and past 90% of countdown zone, mark complete
    if (newNumber === 1 && progress > 0.9 && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      setIsComplete(true);
    }

  }, [scrollY, getProgress]);

  const progress = getProgress();
  const withinNumberProgress = (progress * 3) % 1;
  const circumference = 2 * Math.PI * ARC_R;
  const sweepPerNumber = circumference / 3;
  const strokeDashoffset = circumference - (withinNumberProgress * sweepPerNumber + sweepPerNumber * (3 - currentNumber));

  const ticks = useMemo(() => Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const isMaj = i % 3 === 0;
    const r1 = isMaj ? 79 : 83;
    return (
      <line
        key={i}
        x1={100 + r1 * Math.cos(angle)}
        y1={100 + r1 * Math.sin(angle)}
        x2={100 + 88.5 * Math.cos(angle)}
        y2={100 + 88.5 * Math.sin(angle)}
        stroke="rgba(248,236,188,0.35)"
        strokeWidth={isMaj ? 1.2 : 0.5}
      />
    );
  }), []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        height: '100vh',
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      <svg
        viewBox="0 0 200 200"
        style={{
          width: 'min(65vw,65vh)',
          height: 'min(65vw,65vh)',
          position: 'relative',
          zIndex: 1,
          opacity: isTransitioning ? 0.3 : 1,
          transition: 'opacity 300ms ease-out',
        }}
        aria-hidden="true"
      >
        <defs>
          <filter id="heat" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="turbulence" baseFrequency="0.015 0.08"
              numOctaves="2" seed="2" result="noise">
              <animate attributeName="baseFrequency"
                values="0.015 0.08;0.018 0.09;0.015 0.08"
                dur="3.5s" repeatCount="indefinite"/>
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise"
              scale="1.2" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
        </defs>
        <circle cx="100" cy="100" r="92" fill="none" stroke="rgba(248,236,188,0.07)" strokeWidth="0.5" />
        {ticks}
        <circle cx="100" cy="100" r={ARC_R} fill="none" stroke="rgba(248,236,188,0.1)" strokeWidth="2.5" />
        <circle
          cx="100" cy="100" r={ARC_R}
          fill="none"
          stroke="rgba(248,236,188,0.85)"
          strokeWidth="2.5"
          strokeLinecap="butt"
          strokeDasharray={circumference + " " + circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 100 100)"
        />
        <line x1="10" y1="100" x2="190" y2="100" stroke="rgba(248,236,188,0.10)" strokeWidth="0.5" />
        <line x1="100" y1="10" x2="100" y2="190" stroke="rgba(248,236,188,0.10)" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="46" fill="none" stroke="rgba(248,236,188,0.07)" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="1.5" fill="rgba(248,236,188,0.4)" />
        <text
          x="100" y="100"
          textAnchor="middle" dominantBaseline="central"
          fontFamily="'IBM Plex Mono', monospace" fontSize="48" fontWeight="bold"
          fill="rgba(248,236,188,0.95)"
        >
          {isComplete ? 1 : currentNumber}
        </text>
        {([[9, 9], [191, 9], [9, 191], [191, 191]] as const).map(([x, y], i) => (
          <rect key={i} x={x - 4} y={y - 4} width={8} height={8} fill="none" stroke="rgba(248,236,188,0.18)" strokeWidth="0.5" />
        ))}
      </svg>

      <div style={{ 
        fontFamily: "'IBM Plex Mono', monospace", 
        fontSize: '0.45rem', 
        letterSpacing: '0.45em', 
        color: 'rgba(248,236,188,0.25)', 
        textTransform: 'uppercase', 
        position: 'relative', 
        zIndex: 1,
        opacity: isTransitioning ? 0.3 : 1,
        transition: 'opacity 300ms ease-out',
      }}>
        Picture Start
      </div>

      <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.5rem' }}>
        {[3, 2, 1].map((n) => (
          <div 
            key={n} 
            style={{ 
              width: 5, 
              height: 5, 
              borderRadius: '50%', 
              background: (isComplete ? 1 : currentNumber) >= n ? 'rgba(248,236,188,0.8)' : 'rgba(248,236,188,0.15)',
              transition: 'background 150ms ease',
            }} 
          />
        ))}
      </div>

    </div>
  );
};

export default CountdownSection;
