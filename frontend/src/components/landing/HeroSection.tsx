'use client';

import { useEffect, useState } from 'react';

// FadeIn component according to specifications
function FadeIn({ 
  children, 
  delay, 
  duration = 1000, 
  className = '' 
}: { 
  children: React.ReactNode; 
  delay: number; 
  duration?: number; 
  className?: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-opacity duration-1000 ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
}

// AnimatedHeading component according to specifications
function AnimatedHeading({ 
  text, 
  className = '', 
  style = {} 
}: { 
  text: string; 
  className?: string; 
  style?: React.CSSProperties;
}) {
  const [animate, setAnimate] = useState(false);
  const initialDelay = 200; // ms
  const charDelay = 30; // ms
  const duration = 500; // ms

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, initialDelay);
    return () => clearTimeout(timer);
  }, []);

  const lines = text.split('\n');

  return (
    <h1 className={className} style={style}>
      {lines.map((line, lineIdx) => {
        const lineLength = line.length;
        return (
          <span key={lineIdx} className="block whitespace-nowrap">
            {line.split('').map((char, charIdx) => {
              const delay = (lineIdx * lineLength * charDelay) + (charIdx * charDelay);
              
              const charStyle: React.CSSProperties = {
                display: 'inline-block',
                opacity: animate ? 1 : 0,
                transform: animate ? 'translateX(0)' : 'translateX(-18px)',
                transitionProperty: 'opacity, transform',
                transitionDuration: `${duration}ms`,
                transitionDelay: `${delay}ms`,
                transitionTimingFunction: 'ease-out',
              };

              return (
                <span key={charIdx} style={charStyle}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
              );
            })}
          </span>
        );
      })}
    </h1>
  );
}

export default function HeroSection({ scrollYProgress }: { scrollYProgress?: any }) {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#0A0F0D] flex flex-col">
      {/* 1. Full-Screen Raw Background Video — no overlays, no dimming */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4"
          type="video/mp4"
        />
      </video>



      {/* Hero Content — pinned to the bottom */}
      <div className="relative z-10 w-full px-6 md:px-12 lg:px-16 flex-1 flex flex-col justify-end pb-12 lg:pb-16 pt-28">

        <div className="w-full lg:grid lg:grid-cols-2 lg:items-end gap-12">

          {/* Left Column */}
          <div className="flex flex-col text-left">

            <AnimatedHeading
              text={"Track Your Carbon.\nChange Your Future."}
              className="text-white font-normal mb-4 text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.05]"
              style={{ letterSpacing: '-0.04em' }}
            />

            <FadeIn delay={800} duration={1000}>
              <p className="text-base md:text-lg text-gray-300 mb-6 leading-relaxed max-w-xl">
                Understand your daily environmental impact and build greener habits one action at a time.
              </p>
            </FadeIn>

            <FadeIn delay={1200} duration={1000}>
              <div className="flex flex-wrap gap-4">
                <button className="bg-[#39FF14] hover:bg-[#2ed60f] text-[#0A0F0D] px-8 py-3 rounded-xl font-bold transition-colors cursor-pointer shadow-[0_0_24px_rgba(57,255,20,0.3)]">
                  Take Onboarding Quiz
                </button>
                <button className="liquid-glass border border-white/20 text-white px-8 py-3 rounded-xl font-medium hover:bg-white hover:text-black transition-colors cursor-pointer">
                  Explore Features
                </button>
              </div>
            </FadeIn>

          </div>

          {/* Right Column — tagline card */}
          <div className="flex items-end justify-start lg:justify-end mt-8 lg:mt-0">
            <FadeIn delay={1400} duration={1000} className="w-full sm:w-auto">
              <div className="liquid-glass border border-white/20 px-6 py-3 rounded-xl">
                <span className="text-lg md:text-xl lg:text-2xl font-light text-white tracking-wide block">
                  Measure. Reduce. Inspire.
                </span>
              </div>
            </FadeIn>
          </div>

        </div>

      </div>
    </section>
  );
}
