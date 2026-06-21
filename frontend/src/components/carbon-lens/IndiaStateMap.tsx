'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, X } from 'lucide-react';
import { indiaStateData } from '../../data/carbonLensData';

// Placeholder SVG paths for states
const MOCK_STATES = [
  { id: 'MH', path: "M 30,50 L 50,40 L 60,60 L 40,70 Z", name: 'Maharashtra', data: indiaStateData[0] },
  { id: 'GJ', path: "M 10,30 L 30,20 L 40,40 L 20,50 Z", name: 'Gujarat', data: indiaStateData[1] },
  { id: 'UP', path: "M 40,20 L 70,10 L 80,30 L 50,40 Z", name: 'Uttar Pradesh', data: indiaStateData[2] },
  { id: 'TN', path: "M 45,75 L 65,70 L 60,95 L 40,90 Z", name: 'Tamil Nadu', data: indiaStateData[3] },
  { id: 'RJ', path: "M 15,10 L 35,5 L 45,25 L 25,30 Z", name: 'Rajasthan', data: indiaStateData[4] },
];

export default function IndiaStateMap({ entranceStage }: { entranceStage: string }) {
  const [metric, setMetric] = useState<'absolute' | 'capita' | 'intensity'>('absolute');
  const [pinned, setPinned] = useState<string[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  const togglePin = (id: string) => {
    if (pinned.includes(id)) {
      setPinned(pinned.filter(p => p !== id));
    } else {
      if (pinned.length < 3) setPinned([...pinned, id]);
    }
  };

  const showEntrance = entranceStage !== 'departure' && entranceStage !== 'threshold';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
      animate={showEntrance ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: showEntrance ? 1.0 : 0, ease: [0.16, 1, 0.3, 1] }}
      className="lg:col-span-6 bg-[#162019] border border-[rgba(255,255,255,0.1)] rounded-xl p-6 flex flex-col relative overflow-hidden"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHovered(null)}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-display font-bold text-lg flex items-center gap-2">
          <Map className="w-4 h-4 text-[#39FF14]" />
          India State Heatmap
        </h3>
        
        {/* Metric Toggle */}
        <div className="flex items-center bg-[rgba(255,255,255,0.05)] rounded-lg p-1 relative">
          {['absolute', 'capita', 'intensity'].map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m as any)}
              className="relative px-3 py-1 text-[10px] uppercase tracking-wider font-bold z-10"
            >
              <span className={metric === m ? 'text-[#0A0F0D]' : 'text-[#6B8F71]'}>
                {m}
              </span>
              {metric === m && (
                <motion.div
                  layoutId="metric-pill"
                  className="absolute inset-0 bg-[#39FF14] rounded-md -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Tray */}
      <AnimatePresence>
        {pinned.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex gap-2 mb-4 overflow-hidden"
          >
            {pinned.map(id => {
              const state = MOCK_STATES.find(s => s.id === id);
              return (
                <div key={id} className="bg-[rgba(57,255,20,0.1)] border border-[rgba(57,255,20,0.3)] px-2 py-1 rounded flex items-center gap-2 text-xs">
                  <span className="text-[#39FF14] font-medium">{state?.name}</span>
                  <span className="font-mono text-[#E8F5E2]">{state?.data?.total} MT</span>
                  <button onClick={() => togglePin(id)} className="hover:bg-[rgba(255,255,255,0.1)] rounded p-0.5">
                    <X className="w-3 h-3 text-[#E8F5E2]" />
                  </button>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 min-h-[300px] flex items-center justify-center relative">
        <svg viewBox="0 0 100 100" className="w-full h-full max-h-[350px] overflow-visible">
          {/* Abstract India Map Grid Background */}
          <path d="M 5,5 L 95,5 L 95,95 L 5,95 Z" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" strokeDasharray="2 2" />
          
          {MOCK_STATES.map((state, i) => {
            const isHovered = hovered === state.id;
            const isPinned = pinned.includes(state.id);
            // Color based on metric for demo
            const intensity = metric === 'absolute' ? (state.data.total / 300) : (state.data.perCapita / 5);
            const r = Math.floor(57 + (255 - 57) * intensity);
            const g = Math.floor(255 - (255 - 71) * intensity);
            const b = Math.floor(20 + (20 - 20) * intensity);
            
            return (
              <motion.path
                key={state.id}
                d={state.path}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={showEntrance ? { 
                  opacity: 1, 
                  scale: 1, 
                  fill: isHovered || isPinned ? '#39FF14' : `rgba(${r},${g},${b},0.6)`,
                  stroke: isPinned ? '#fff' : 'rgba(255,255,255,0.1)'
                } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: showEntrance ? 1.0 + i * 0.05 : 0 }}
                className="cursor-pointer transition-colors duration-300"
                strokeWidth={isPinned ? 1 : 0.5}
                onClick={() => togglePin(state.id)}
                onMouseEnter={() => setHovered(state.id)}
              />
            );
          })}
        </svg>
      </div>

      {/* Floating Tooltip */}
      <AnimatePresence>
        {hovered !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute z-50 bg-[#0A0F0D] border border-[rgba(255,255,255,0.15)] shadow-xl rounded-lg p-3 flex flex-col gap-1"
            style={{ left: mousePos.x + 15, top: mousePos.y - 30 }}
          >
            <div className="font-bold text-[#E8F5E2] text-sm">{MOCK_STATES.find(s => s.id === hovered)?.name}</div>
            <div className="text-xs font-mono text-[#6B8F71] mt-1">
              Absolute: <span className="text-[#39FF14]">{MOCK_STATES.find(s => s.id === hovered)?.data?.total} MT</span>
            </div>
            <div className="text-xs font-mono text-[#6B8F71]">
              Per Capita: <span className="text-[#39FF14]">{MOCK_STATES.find(s => s.id === hovered)?.data?.perCapita} tCO₂</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
