'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import FadeIn from '../FadeIn';

export default function ClimateProblem({ scrollYProgress }: { scrollYProgress: any }) {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Local scroll progress for this specific section
  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Transform background from cool dark space to warm red glow
  const backgroundColor = useTransform(
    sectionProgress,
    [0.3, 0.7],
    ["#0A0F0D", "#2A0808"]
  );

  // Transform text scale and opacity to simulate "zooming into one person" at the end
  const scaleZoom = useTransform(sectionProgress, [0.7, 1], [1, 20]);
  const opacityFade = useTransform(sectionProgress, [0.8, 1], [1, 0]);

  return (
    <motion.section 
      ref={sectionRef}
      className="relative min-h-[150vh] w-full flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor }}
    >
      {/* Simulated Earth Glow at the bottom */}
      <motion.div 
        className="absolute bottom-[-20%] w-[150vw] h-[50vh] rounded-[100%] blur-[100px]"
        style={{
          background: useTransform(sectionProgress, [0.3, 0.8], ["rgba(0, 229, 160, 0.1)", "rgba(255, 77, 77, 0.4)"])
        }}
      />

      {/* CO2 Particles Rising */}
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gray-500/30 rounded-full blur-[1px]"
          style={{
            left: `${(i * 13) % 100}%`,
            bottom: "-10%",
          }}
          animate={{
            y: [0, -1000],
            x: [0, (i * 7) % 100 - 50],
            opacity: [0, 0.6, 0],
            scale: [1, (i % 3) + 1]
          }}
          transition={{
            duration: (i % 5) + 5,
            repeat: Infinity,
            delay: (i * 0.5) % 5,
            ease: "easeOut"
          }}
        />
      ))}

      {/* Sticky Content Wrapper */}
      <motion.div 
        className="sticky top-0 h-screen w-full flex flex-col items-center justify-center px-6"
        style={{ scale: scaleZoom, opacity: opacityFade }}
      >
        <div className="max-w-4xl w-full text-center z-10 flex flex-col gap-16">
          <FadeIn delay={200} duration={1000}>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-[#E8F5E2]">
              Most people have no idea how much carbon they emit.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeIn delay={600}>
              <div className="flex flex-col items-center">
                <span className="font-mono text-5xl font-bold text-[#FFB830] mb-2">8B+</span>
                <span className="text-[#6B8F71] uppercase tracking-widest text-xs font-bold">People on Earth</span>
              </div>
            </FadeIn>
            <FadeIn delay={1000}>
              <div className="flex flex-col items-center">
                <span className="font-mono text-5xl font-bold text-[#FF4D4D] mb-2">40B</span>
                <span className="text-[#6B8F71] uppercase tracking-widest text-xs font-bold">Tons CO₂/Year</span>
              </div>
            </FadeIn>
            <FadeIn delay={1400}>
              <div className="flex flex-col items-center">
                <span className="font-mono text-5xl font-bold text-[#39FF14] mb-2">1</span>
                <span className="text-[#6B8F71] uppercase tracking-widest text-xs font-bold">Planet Left</span>
              </div>
            </FadeIn>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
