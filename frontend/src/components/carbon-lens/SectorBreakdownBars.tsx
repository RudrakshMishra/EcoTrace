'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, ChevronDown } from 'lucide-react';

export default function SectorBreakdownBars({ currentData, viewMode, entranceStage }: any) {
  const [openSector, setOpenSector] = useState<number | null>(null);
  const [hoveredSector, setHoveredSector] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const showEntrance = entranceStage !== 'departure' && entranceStage !== 'threshold';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
      animate={showEntrance ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: showEntrance ? 0.8 : 0, ease: [0.16, 1, 0.3, 1] }}
      className="lg:col-span-4 bg-[#162019] border border-[rgba(255,255,255,0.1)] rounded-xl p-6 relative"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoveredSector(null)}
    >
      <h3 className="font-display font-bold text-lg mb-6 flex items-center gap-2">
        <BarChart3 className="w-4 h-4" style={{ color: viewMode === 'world' ? '#00E5A0' : '#39FF14' }} />
        Sector Breakdown
      </h3>

      <div className="flex flex-col gap-5">
        {currentData.sectors.map((sector: any, i: number) => {
          const isOpen = openSector === i;
          const isHovered = hoveredSector === i;
          const absoluteValue = (currentData.total * (sector.value / 100)).toFixed(2);
          
          return (
            <div key={i} className="group">
              {/* Main Bar Row */}
              <div 
                className="cursor-pointer"
                onClick={() => setOpenSector(isOpen ? null : i)}
                onMouseEnter={() => setHoveredSector(i)}
              >
                <div className="flex justify-between items-center text-sm mb-1.5">
                  <span className={`font-medium transition-colors ${isHovered ? 'text-white' : 'text-[#E8F5E2]'}`}>{sector.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[#6B8F71]">{sector.value}%</span>
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown className="w-3.5 h-3.5 text-[#6B8F71]" />
                    </motion.div>
                  </div>
                </div>
                
                <div className="w-full bg-[rgba(255,255,255,0.05)] h-2.5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={showEntrance ? { width: `${sector.value}%` } : { width: 0 }}
                    transition={{ duration: 1, delay: showEntrance ? 1.0 + i * 0.06 : 0, ease: "easeOut" }}
                    className="h-full rounded-full transition-all duration-300"
                    style={{ backgroundColor: sector.color, filter: isHovered ? 'brightness(1.2)' : 'brightness(1)' }}
                  />
                </div>
              </div>

              {/* Accordion Dropdown */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 pb-1 pl-2 border-l-2 border-[rgba(255,255,255,0.1)] mt-2 ml-1">
                      <div className="text-xs text-[#6B8F71] mb-2 flex justify-between">
                        <span>Total contribution:</span>
                        <span className="font-mono text-[#E8F5E2]">{absoluteValue} GT CO₂e</span>
                      </div>
                      
                      {/* Fake sub-sectors */}
                      <div className="space-y-2">
                        {['Sub-sector A', 'Sub-sector B', 'Sub-sector C'].map((sub, idx) => {
                          const subVal = (sector.value * (0.5 - idx * 0.15)).toFixed(1);
                          return (
                            <div key={idx}>
                              <div className="flex justify-between text-[10px] uppercase tracking-wider text-[#6B8F71] mb-1">
                                <span>{sub}</span>
                                <span>{subVal}%</span>
                              </div>
                              <div className="w-full bg-[rgba(255,255,255,0.03)] h-1 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(parseFloat(subVal) / sector.value) * 100}%` }}
                                  transition={{ duration: 0.5, delay: 0.1 + idx * 0.1 }}
                                  className="h-full bg-[rgba(255,255,255,0.3)]"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Floating Tooltip */}
      <AnimatePresence>
        {hoveredSector !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute z-50 bg-[#0A0F0D] border border-[rgba(255,255,255,0.15)] shadow-xl rounded-lg p-2 text-xs flex flex-col gap-1 whitespace-nowrap"
            style={{ 
              left: mousePos.x + 15, 
              top: mousePos.y - 30 
            }}
          >
            <div className="font-bold text-[#E8F5E2]">{currentData.sectors[hoveredSector].label}</div>
            <div className="font-mono text-[#6B8F71]">
              <span style={{ color: currentData.sectors[hoveredSector].color }}>{currentData.sectors[hoveredSector].value}%</span>
              {' '}· {(currentData.total * (currentData.sectors[hoveredSector].value / 100)).toFixed(2)} GT
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
