'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { scenarioBaseData } from '../../data/carbonLensData';

export default function ScenarioModeler({ viewMode, entranceStage }: { viewMode: 'world' | 'india', entranceStage: string }) {
  const [renewables, setRenewables] = useState(viewMode === 'world' ? scenarioBaseData.defaultRenewableGlobal : scenarioBaseData.defaultRenewableIndia);
  const [growth, setGrowth] = useState(viewMode === 'world' ? scenarioBaseData.defaultGrowthGlobal : scenarioBaseData.defaultGrowthIndia);

  const defaultRenewables = viewMode === 'world' ? scenarioBaseData.defaultRenewableGlobal : scenarioBaseData.defaultRenewableIndia;
  const defaultGrowth = viewMode === 'world' ? scenarioBaseData.defaultGrowthGlobal : scenarioBaseData.defaultGrowthIndia;

  const isDirty = renewables !== defaultRenewables || growth !== defaultGrowth;

  const handleReset = () => {
    setRenewables(defaultRenewables);
    setGrowth(defaultGrowth);
  };

  const showEntrance = entranceStage !== 'departure' && entranceStage !== 'threshold';
  const accent = viewMode === 'world' ? '#00E5A0' : '#39FF14';

  // Projection math
  const projectedData = useMemo(() => {
    const baseEmissions = viewMode === 'world' ? scenarioBaseData.globalBaseEmissions : scenarioBaseData.indiaBaseEmissions;
    const lastHistorical = baseEmissions[baseEmissions.length - 1];
    
    // Simplistic physics engine for the curve:
    // Growth increases emissions. Renewables decrease it.
    const growthFactor = 1 + (growth / 100);
    const renewableFactor = 1 - (renewables / 100);
    
    const proj = [lastHistorical]; // Year 2024
    let current = lastHistorical;
    
    for (let i = 1; i <= 5; i++) { // 2025, 2030, 2035, 2040, 2045, 2050
      // Apply compounded growth and decay
      current = current * growthFactor * renewableFactor;
      proj.push(current);
    }
    return proj;
  }, [viewMode, renewables, growth]);

  const targetPath = viewMode === 'world' ? scenarioBaseData.target1Point5C : scenarioBaseData.indiaTarget1Point5C;

  // SVG Chart Calculation
  const width = 600;
  const height = 200;
  const maxY = viewMode === 'world' ? 50 : 5;
  const paddingX = 20;
  const paddingY = 20;

  const generatePath = (data: number[]) => {
    const stepX = (width - paddingX * 2) / (data.length - 1);
    const pathSegments = data.map((val, i) => {
      const x = paddingX + (i * stepX);
      const y = height - paddingY - (val / maxY) * (height - paddingY * 2);
      return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    });
    return pathSegments.join(' ');
  };

  const isCrossingTarget = projectedData[projectedData.length - 1] <= targetPath[targetPath.length - 1] + (viewMode === 'world' ? 2 : 0.2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
      animate={showEntrance ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: showEntrance ? 1.4 : 0, ease: [0.16, 1, 0.3, 1] }}
      className="lg:col-span-12 bg-[#162019] border border-[rgba(255,255,255,0.1)] rounded-xl p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-display font-bold text-lg flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" style={{ color: accent }} />
          Scenario Modeler (Projections to 2050)
        </h3>
        
        <AnimatePresence>
          {isDirty && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-[#6B8F71] hover:text-[#E8F5E2] bg-[rgba(255,255,255,0.05)] px-3 py-1.5 rounded-full transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset to Base
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-center">
        {/* Sliders */}
        <div className="w-full lg:w-1/3 flex flex-col gap-8">
          <div className="flex flex-col gap-2 relative">
            <div className="flex justify-between text-sm">
              <span className="text-[#E8F5E2] font-medium">Renewable Adoption Rate</span>
              <span className="font-mono" style={{ color: accent }}>{renewables}%</span>
            </div>
            <input 
              type="range" 
              min="0" max="100" 
              value={renewables}
              onChange={(e) => setRenewables(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[rgba(255,255,255,0.1)] rounded-full appearance-none cursor-pointer outline-none slider-thumb-accent"
              style={{ '--accent': accent } as any}
            />
            <div className="flex justify-between text-[10px] text-[#6B8F71]">
              <span>Stagnant (0%)</span>
              <span>Aggressive (100%)</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 relative">
            <div className="flex justify-between text-sm">
              <span className="text-[#E8F5E2] font-medium">Industrial Growth Rate</span>
              <span className="font-mono text-[#FF4757]">{growth}%</span>
            </div>
            <input 
              type="range" 
              min="0" max="15" step="0.1"
              value={growth}
              onChange={(e) => setGrowth(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[rgba(255,255,255,0.1)] rounded-full appearance-none cursor-pointer outline-none slider-thumb-red"
            />
            <div className="flex justify-between text-[10px] text-[#6B8F71]">
              <span>Contraction (0%)</span>
              <span>Hyper-growth (15%)</span>
            </div>
          </div>
        </div>

        {/* Custom SVG Chart */}
        <div className="w-full lg:w-2/3 h-[250px] bg-[rgba(255,255,255,0.02)] rounded-lg border border-[rgba(255,255,255,0.05)] relative overflow-hidden">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map(pct => (
              <line 
                key={pct}
                x1={paddingX} y1={paddingY + pct * (height - paddingY*2)} 
                x2={width - paddingX} y2={paddingY + pct * (height - paddingY*2)} 
                stroke="rgba(255,255,255,0.05)" 
                strokeWidth="1" 
              />
            ))}
            
            {/* 1.5C Target Reference Line */}
            <motion.path 
              d={generatePath(targetPath)} 
              fill="none" 
              stroke={isCrossingTarget ? '#39FF14' : '#6B8F71'} 
              strokeWidth="2" 
              strokeDasharray="4 4"
              animate={{ stroke: isCrossingTarget ? '#39FF14' : '#6B8F71' }}
            />
            
            {/* Live Projection Line */}
            <motion.path 
              d={generatePath(projectedData)}
              fill="none" 
              stroke={accent} 
              strokeWidth="3" 
              initial={false}
              animate={{ d: generatePath(projectedData) }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />

            {/* End points */}
            <motion.circle 
              cx={width - paddingX} 
              cy={height - paddingY - (projectedData[projectedData.length - 1] / maxY) * (height - paddingY * 2)}
              r="4"
              fill={accent}
              animate={{ cy: height - paddingY - (projectedData[projectedData.length - 1] / maxY) * (height - paddingY * 2) }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </svg>
          
          {/* Legend */}
          <div className="absolute top-4 right-4 flex gap-4 text-[10px] font-mono">
            <div className="flex items-center gap-1 text-[#6B8F71]">
              <div className="w-3 border-t-2 border-dashed border-[#6B8F71]"></div>
              1.5°C Pathway
            </div>
            <div className="flex items-center gap-1" style={{ color: accent }}>
              <div className="w-3 h-0.5" style={{ backgroundColor: accent }}></div>
              Live Projection
            </div>
          </div>
        </div>
      </div>
      
      {/* Dynamic CSS for sliders */}
      <style dangerouslySetInnerHTML={{__html: `
        .slider-thumb-accent::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--accent);
          cursor: ew-resize;
          box-shadow: 0 0 10px var(--accent);
          transition: transform 0.1s;
        }
        .slider-thumb-accent::-webkit-slider-thumb:active {
          transform: scale(1.2);
        }
        .slider-thumb-red::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #FF4757;
          cursor: ew-resize;
          box-shadow: 0 0 10px rgba(255,71,87,0.5);
          transition: transform 0.1s;
        }
        .slider-thumb-red::-webkit-slider-thumb:active {
          transform: scale(1.2);
        }
      `}} />
    </motion.div>
  );
}
