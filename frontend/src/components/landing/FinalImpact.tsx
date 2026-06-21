'use client';

import { motion, animate } from 'framer-motion';
import { useRef, useState } from 'react';
import { Leaf, ArrowRight, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function FinalImpact() {
  const router = useRouter();
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // States to hold actual static counting numbers
  const [usersCount, setUsersCount] = useState(0);
  const [tonsCount, setTonsCount] = useState(0);
  const [carsCount, setCarsCount] = useState(0);
  const [hasTriggered, setHasTriggered] = useState(false);

  const handleViewportEnter = () => {
    if (hasTriggered) return;
    setHasTriggered(true);

    // Animate numbers counting up
    animate(0, 42854, {
      duration: 2.5,
      ease: "easeOut",
      onUpdate: (latest) => setUsersCount(Math.round(latest)),
    });

    animate(0, 124590, {
      duration: 2.8,
      ease: "easeOut",
      onUpdate: (latest) => setTonsCount(Math.round(latest)),
    });

    animate(0, 27084, {
      duration: 2.2,
      ease: "easeOut",
      onUpdate: (latest) => setCarsCount(Math.round(latest)),
    });
  };

  return (
    <motion.section 
      ref={sectionRef}
      onViewportEnter={handleViewportEnter}
      viewport={{ once: true, margin: "-100px" }}
      className="relative min-h-screen w-full bg-[#0A0F0D] flex flex-col justify-between overflow-hidden pt-32 px-6"
    >
      {/* Ambient background glow */}
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[70%] h-[50%] rounded-full bg-[#00E5A0]/10 blur-[130px] pointer-events-none" />

      {/* Main Content */}
      <div className="max-w-4xl w-full mx-auto text-center z-10 flex flex-col items-center gap-12 flex-1 justify-center">
        
        {/* Animated Green Earth sphere */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-gradient-to-tr from-[#00E5A0] via-[#111A14] to-[#39FF14] shadow-[0_0_80px_rgba(57,255,20,0.25)] flex items-center justify-center overflow-hidden border border-[#39FF14]/30"
        >
          {/* Rotating continent overlays */}
          <motion.div 
            animate={{ x: [0, -200, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_black_white.svg')] bg-cover w-[300%] h-full pointer-events-none"
          />
          
          {/* Subtle inside shine */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

          {/* Leaf overlay logo in the center */}
          <Leaf className="w-12 h-12 text-[#39FF14] text-glow-lime z-10 animate-[pulse_3s_infinite]" />
        </motion.div>

        {/* Closing Tagline */}
        <div className="max-w-2xl">
          <h2 className="font-display font-bold text-4xl sm:text-6xl text-[#E8F5E2] mb-6 leading-tight">
            Build a greener <span className="text-[#39FF14] text-glow-lime">tomorrow.</span>
          </h2>
          <p className="text-[#6B8F71] text-base sm:text-lg leading-relaxed">
            The climate crisis is a collective footprint problem. Together, we can trace our outputs, gamify our savings, and spark global green action.
          </p>
        </div>

        {/* Global Impact Counter Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-3xl mt-4">
          <div className="bg-white/5 border border-white/5 rounded-2xl py-6 px-4 shadow-lg text-center">
            <div className="font-mono text-3xl font-extrabold text-[#39FF14] text-glow-lime mb-1">
              {usersCount.toLocaleString()}
            </div>
            <div className="text-[10px] uppercase font-mono tracking-widest text-[#6B8F71] font-bold">
              Global Members
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-2xl py-6 px-4 shadow-lg text-center">
            <div className="font-mono text-3xl font-extrabold text-[#39FF14] text-glow-lime mb-1">
              {tonsCount.toLocaleString()}t
            </div>
            <div className="text-[10px] uppercase font-mono tracking-widest text-[#6B8F71] font-bold">
              Tons CO₂ Avoided
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-2xl py-6 px-4 shadow-lg text-center">
            <div className="font-mono text-3xl font-extrabold text-[#39FF14] text-glow-lime mb-1">
              {carsCount.toLocaleString()}
            </div>
            <div className="text-[10px] uppercase font-mono tracking-widest text-[#6B8F71] font-bold">
              Cars Taken Off Road
            </div>
          </div>
        </div>

        {/* CTA Button to Route to Quiz */}
        <div className="mt-4 mb-12">
          <button
            onClick={() => router.push('/quiz')}
            className="bg-[#39FF14] hover:bg-[#2ed60f] text-[#0A0F0D] font-bold px-10 py-4.5 rounded-full shadow-[0_0_30px_rgba(57,255,20,0.3)] hover:shadow-[0_0_45px_rgba(57,255,20,0.5)] transition-all font-display flex items-center justify-center gap-2 text-base cursor-pointer"
          >
            Start Your EcoTrace Journey
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* Minimal Premium Glassmorphism Footer */}
      <footer className="w-full max-w-7xl mx-auto border-t border-white/5 py-10 flex flex-col md:flex-row items-center justify-between gap-6 z-10 text-xs">
        
        {/* Brand details */}
        <div className="flex items-center gap-2">
          <Leaf className="w-4 h-4 text-[#39FF14]" />
          <span className="font-display font-extrabold text-white tracking-widest">ECOTRACE</span>
          <span className="text-gray-600">|</span>
          <span className="text-[#6B8F71] font-mono">© 2026</span>
        </div>

        {/* Navigation links */}
        <div className="flex items-center flex-wrap justify-center gap-6 text-[#6B8F71] font-semibold">
          <button onClick={() => router.push('/dashboard')} className="hover:text-[#39FF14] transition-colors cursor-pointer">Dashboard</button>
          <button onClick={() => router.push('/quiz')} className="hover:text-[#39FF14] transition-colors cursor-pointer">Onboarding Quiz</button>
          <span className="text-gray-800">|</span>
          <a href="#" className="hover:text-[#39FF14] transition-colors cursor-pointer">Security</a>
          <a href="#" className="hover:text-[#39FF14] transition-colors cursor-pointer">Privacy Policy</a>
          <a href="#" className="hover:text-[#39FF14] transition-colors cursor-pointer">Terms</a>
        </div>

        {/* Social connections */}
        <div className="flex items-center gap-4 text-gray-500">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-[#39FF14] transition-colors">
            <GithubIcon className="w-4.5 h-4.5" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-[#39FF14] transition-colors">
            <TwitterIcon className="w-4.5 h-4.5" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[#39FF14] transition-colors">
            <LinkedinIcon className="w-4.5 h-4.5" />
          </a>
          <span className="text-gray-800">|</span>
          <span className="flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#6B8F71]">
            Made with <Heart className="w-3 h-3 text-[#FF4D4D]" fill="currentColor" /> for Earth
          </span>
        </div>

      </footer>
    </motion.section>
  );
}
