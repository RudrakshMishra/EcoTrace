'use client';

import { motion } from 'framer-motion';

interface CarbonLensToggleProps {
  viewMode: 'world' | 'india';
  setViewMode: (mode: 'world' | 'india') => void;
}

export default function CarbonLensToggle({ viewMode, setViewMode }: CarbonLensToggleProps) {
  return (
    <div className="relative flex items-center bg-[#111A14] rounded-full border border-[rgba(255,255,255,0.1)] p-1 shadow-inner h-10 w-48 overflow-hidden">
      {/* Sliding Background Thumb */}
      <motion.div
        className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] shadow-sm pointer-events-none"
        layout
        initial={false}
        animate={{
          x: viewMode === 'world' ? 4 : 96,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25,
        }}
        whileTap={{ scaleX: 1.15 }}
      />

      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={() => setViewMode('world')}
        className={`relative z-10 flex-1 flex items-center justify-center h-full rounded-full text-xs font-bold transition-colors ${
          viewMode === 'world' ? 'text-[#00E5A0]' : 'text-[#6B8F71] hover:text-[#E8F5E2]'
        }`}
      >
        🌍 World
      </motion.button>
      
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={() => setViewMode('india')}
        className={`relative z-10 flex-1 flex items-center justify-center h-full rounded-full text-xs font-bold transition-colors ${
          viewMode === 'india' ? 'text-[#39FF14]' : 'text-[#6B8F71] hover:text-[#E8F5E2]'
        }`}
      >
        🇮🇳 India
      </motion.button>
    </div>
  );
}
