'use client';

import { useState, useRef, useEffect } from 'react';

interface CarbonOrbProps {
  score?: number; // in tons (e.g. 3.2) or kg (e.g. 3200)
  size?: 'small' | 'medium' | 'large';
  interactive?: boolean;
}

export default function CarbonOrb({ score = 0, size = 'large', interactive = true }: CarbonOrbProps) {
  // Convert score to tons if it is sent in kg
  const scoreInTons = score > 100 ? score / 1000 : score;

  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine State
  let state: 'green' | 'amber' | 'red' = 'green';
  let pulseDuration = '6s';
  let glowClass = 'orb-glow-green';
  let label = 'Healthy';
  let neonColor = '#39FF14';

  if (scoreInTons === 0) {
    state = 'green';
    pulseDuration = '7s';
    glowClass = 'orb-glow-green';
    label = 'Neutral';
    neonColor = '#39FF14';
  } else if (scoreInTons < 2) {
    state = 'green';
    pulseDuration = '6s';
    glowClass = 'orb-glow-green';
    label = 'Excellent';
    neonColor = '#39FF14';
  } else if (scoreInTons <= 5) {
    state = 'amber';
    pulseDuration = '3.5s';
    glowClass = 'orb-glow-amber';
    label = 'Moderate';
    neonColor = '#FFB830';
  } else {
    state = 'red';
    pulseDuration = '1.8s';
    glowClass = 'orb-glow-red';
    label = 'High Impact';
    neonColor = '#FF4D4D';
  }

  // Mouse Parallax Effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 25; // dampening factor
    const y = (e.clientY - rect.top - rect.height / 2) / 25;
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  // Dimensions classes
  const sizeClasses = {
    small: 'w-48 h-48 sm:w-56 sm:h-56',
    medium: 'w-64 h-64 sm:w-72 sm:h-72',
    large: 'w-60 h-60 sm:w-80 sm:h-80 md:w-[420px] md:h-[420px]',
  };

  // Setup 20 mock particle configurations
  const [particles, setParticles] = useState<Array<{ id: number; top: number; left: number; size: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    const generated = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      top: Math.random() * 80 + 10, // 10% to 90%
      left: Math.random() * 80 + 10,
      size: Math.random() * 4 + 2, // 2px to 6px
      delay: Math.random() * 5, // 0 to 5s delay
      duration: Math.random() * 10 + 10, // 10s to 20s
    }));
    setParticles(generated);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex items-center justify-center select-none"
      style={{ perspective: 1000 }}
    >
      {/* Outer Pulse Rings */}
      <div 
        className="absolute rounded-full border border-dashed opacity-20 pointer-events-none transition-all duration-700 animate-[spin_40s_linear_infinite]"
        style={{
          width: '120%',
          height: '120%',
          borderColor: neonColor,
        }}
      />
      <div 
        className="absolute rounded-full border opacity-10 pointer-events-none animate-[pulse-ring_8s_ease-in-out_infinite]"
        style={{
          width: '110%',
          height: '110%',
          borderColor: neonColor,
          animationDuration: pulseDuration,
        }}
      />

      {/* Orbiting Particles ring */}
      <div className="absolute w-[115%] h-[115%] pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full animate-pulse"
            style={{
              top: `${p.top}%`,
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: neonColor,
              opacity: 0.6,
              boxShadow: `0 0 10px ${neonColor}`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration / 3}s`,
            }}
          />
        ))}
      </div>

      {/* Main 3D Orb */}
      <div
        className={`relative rounded-full cursor-pointer transition-all duration-700 animate-float ${glowClass} ${sizeClasses[size]}`}
        style={{
          transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0px) rotateX(${-mouseOffset.y * 0.8}deg) rotateY(${mouseOffset.x * 0.8}deg)`,
          animationDuration: pulseDuration,
          transition: 'transform 0.1s ease-out, background 0.7s ease, box-shadow 0.7s ease',
        }}
      >
        {/* Shiny Highlight Layer */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-b from-white/10 to-transparent opacity-60 pointer-events-none" />

        {/* Dynamic score text inside the Orb */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10">
          <span className="text-xs uppercase tracking-[0.25em] font-display text-white/50 font-bold mb-1">
            CO₂ Footprint
          </span>
          <span className="text-4xl md:text-5xl font-mono font-bold tracking-tight text-white drop-shadow-lg">
            {scoreInTons > 0 ? scoreInTons.toFixed(1) : '—'}
          </span>
          <span className="text-sm font-mono text-white/80 font-bold mt-1">
            {scoreInTons > 0 ? 'tons / year' : 'Not Set'}
          </span>
          
          {scoreInTons > 0 && (
            <div 
              className="mt-3 px-3 py-1 rounded-full text-xs font-display font-semibold border"
              style={{
                backgroundColor: `${neonColor}15`,
                borderColor: `${neonColor}40`,
                color: neonColor,
                boxShadow: `0 0 10px ${neonColor}10`
              }}
            >
              {label}
            </div>
          )}
        </div>

        {/* 3D Glass Sphere Reflection (overlay) */}
        <div className="absolute inset-0 rounded-full border border-white/10 pointer-events-none" />
      </div>
    </div>
  );
}
