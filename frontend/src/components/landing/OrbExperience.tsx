'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import CarbonOrb from '../CarbonOrb';

export default function OrbExperience({ scrollYProgress }: { scrollYProgress: any }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Local scroll tracking for precise section transitions
  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(sectionProgress, { stiffness: 80, damping: 25 });

  // Map scroll progress to carbon score (0 to 12.5 tons)
  const carbonScore = useTransform(smoothProgress, [0.2, 0.8], [0.8, 12.5]);

  // Dynamic text instructions or descriptions based on scroll progress
  const statusText = useTransform(
    smoothProgress,
    [0.1, 0.4, 0.7, 0.9],
    [
      "Low Impact: A lifestyle in harmony with planetary boundaries.",
      "Moderate Impact: Average footprints requiring mild adjustments.",
      "High Impact: High emissions exceeding sustainable targets.",
      "Extreme Impact: Major footprint requiring immediate, drastic action."
    ]
  );

  const statusColor = useTransform(
    smoothProgress,
    [0.2, 0.5, 0.8],
    ["#39FF14", "#FFB830", "#FF4D4D"]
  );

  // Map scale and rotation of the orb based on scroll
  const orbScale = useTransform(smoothProgress, [0, 0.5, 1], [0.8, 1.2, 0.8]);

  return (
    <motion.section 
      ref={sectionRef}
      className="relative min-h-screen w-full bg-[#0A0F0D]"
    >
      {/* Content wrapper */}
      <div className="relative w-full flex flex-col items-center justify-between py-24 px-6 overflow-hidden min-h-screen">
        
        {/* Background ambient glow matching current color state */}
        <motion.div 
          className="absolute inset-0 z-0 pointer-events-none opacity-25"
          style={{
            background: useTransform(
              smoothProgress,
              [0.2, 0.5, 0.8],
              [
                "radial-gradient(circle, rgba(57,255,20,0.15) 0%, rgba(10,15,13,0) 70%)",
                "radial-gradient(circle, rgba(255,184,48,0.15) 0%, rgba(10,15,13,0) 70%)",
                "radial-gradient(circle, rgba(255,77,77,0.15) 0%, rgba(10,15,13,0) 70%)"
              ]
            )
          }}
        />

        {/* Section Header */}
        <div className="z-10 text-center max-w-2xl mt-4">
          <span className="font-mono text-xs font-bold text-[#6B8F71] uppercase tracking-[0.2em] block mb-3">
            Interactive Pulse
          </span>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-[#E8F5E2] mb-4">
            The Living Carbon Orb
          </h2>
          <p className="text-[#6B8F71] text-sm md:text-base leading-relaxed">
            Scroll down to witness how the Carbon Orb responds in real time to rising output.
          </p>
        </div>

        {/* Central Orb Container */}
        <motion.div 
          className="relative z-10 flex items-center justify-center pointer-events-none"
          style={{ scale: orbScale }}
        >
          {/* We'll use a responsive wrapper component that dynamically updates based on scroll-driven values */}
          <OrbWrapper progress={smoothProgress} />
        </motion.div>

        {/* Section Footer Status Message */}
        <div className="z-10 w-full max-w-md bg-[#111A14]/80 border border-white/5 rounded-2xl p-5 text-center mb-4">
          <motion.div 
            className="text-xs font-mono font-bold uppercase tracking-wider mb-2"
            style={{ color: statusColor }}
          >
            Real-time Carbon Index
          </motion.div>
          <motion.p className="text-sm font-semibold text-gray-300 leading-relaxed min-h-[40px]">
            <motion.span>{statusText}</motion.span>
          </motion.p>
        </div>

      </div>
    </motion.section>
  );
}

// Internal wrapper to map MotionValue to numeric/state updates since CarbonOrb takes plain number
import { useEffect, useState } from 'react';
import { useMotionValueEvent } from 'framer-motion';

function OrbWrapper({ progress }: { progress: any }) {
  const [currentScore, setCurrentScore] = useState(0.8);

  useMotionValueEvent(progress, "change", (latest: number) => {
    // Map progress (0 to 1) to score (0.8 to 12.5)
    let scoreVal = 0.8;
    if (latest >= 0.2 && latest <= 0.8) {
      scoreVal = 0.8 + ((latest - 0.2) / 0.6) * 11.7;
    } else if (latest > 0.8) {
      scoreVal = 12.5;
    }
    setCurrentScore(scoreVal);
  });

  return <CarbonOrb score={currentScore} size="large" interactive={false} />;
}
