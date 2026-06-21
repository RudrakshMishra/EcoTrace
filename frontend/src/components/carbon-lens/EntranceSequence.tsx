'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface EntranceSequenceProps {
  onComplete: () => void;
}

export default function EntranceSequence({ onComplete }: EntranceSequenceProps) {
  const [stage, setStage] = useState<'departure' | 'threshold' | 'done'>('departure');

  useEffect(() => {
    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    // Timing orchestration
    const t1 = setTimeout(() => setStage('threshold'), 150); // After departure
    const t2 = setTimeout(() => {
      setStage('done');
      onComplete();
    }, 750); // Threshold lasts 600ms (150 + 600)

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  if (stage === 'done') return null;

  return (
    <AnimatePresence>
      <motion.div
        key="scrim"
        initial={{ clipPath: 'circle(0% at 50% 50%)' }}
        animate={{ clipPath: stage === 'threshold' ? 'circle(150% at 50% 50%)' : 'circle(0% at 50% 50%)' }}
        exit={{ opacity: 0, transition: { duration: 0.3 } }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} // premium ease
        className="fixed inset-0 z-[100] bg-[rgba(10,15,13,0.98)] flex items-center justify-center backdrop-blur-md"
      >
        {stage === 'threshold' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-4"
          >
            {/* Cyan animated ring spinner */}
            <div className="w-16 h-16 border-2 border-[rgba(0,229,160,0.2)] border-t-[#00E5A0] rounded-full animate-spin"></div>
            <div className="text-[#00E5A0] font-mono text-sm tracking-widest uppercase">
              Loading CarbonLens<span className="animate-pulse">_</span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
