'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// A lightweight counter component
function AnimatedCounter({ value, suffix = '', prefix = '', decimals = 1 }: { value: number, suffix?: string, prefix?: string, decimals?: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 800; // 800ms
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setDisplayValue(start + (end - start) * easeProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <span>{prefix}{displayValue.toFixed(decimals)}{suffix}</span>;
}

interface KpiCardProps {
  title: string;
  value: number;
  valueString?: string;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  trend?: string;
  trendBad?: boolean;
  compare?: string;
  details: { method: string, meaning: string };
  accentColor: string;
  delayIndex: number;
  entranceStage: string;
}

function KpiCard({ title, value, valueString, suffix, prefix, decimals, trend, trendBad, compare, details, accentColor, delayIndex, entranceStage }: KpiCardProps) {
  const [expanded, setExpanded] = useState(false);
  const showEntrance = entranceStage !== 'departure' && entranceStage !== 'threshold';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
      animate={showEntrance ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: showEntrance ? 0.2 + delayIndex * 0.08 : 0, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => setExpanded(!expanded)}
      whileHover={{ y: -4, borderColor: accentColor }}
      className="bg-[#162019] border border-[rgba(255,255,255,0.1)] p-4 rounded-xl flex flex-col justify-between cursor-pointer transition-colors shadow-sm hover:shadow-lg overflow-hidden group relative"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-xs text-[#6B8F71] font-medium tracking-wide uppercase">{title}</h4>
      </div>
      
      <div className="z-10">
        <div className="font-mono text-2xl font-bold text-[#E8F5E2]">
          {valueString ? valueString : <AnimatedCounter value={value} suffix={suffix} prefix={prefix} decimals={decimals} />}
        </div>
        
        {(trend || compare) && (
          <div className={`text-xs mt-1 font-mono ${trend ? (trendBad ? 'text-[#FF4757]' : 'text-[#2ED573]') : 'text-[#6B8F71]'}`}>
            {trend || compare}
          </div>
        )}
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            className="border-t border-[rgba(255,255,255,0.1)] pt-3 flex flex-col gap-3"
          >
            <div className="text-xs">
              <span className="text-[#6B8F71] font-mono uppercase tracking-wider text-[10px]">What it means:</span>
              <p className="text-[#E8F5E2] mt-1 leading-relaxed">{details.meaning}</p>
            </div>
            <div className="text-xs">
              <span className="text-[#6B8F71] font-mono uppercase tracking-wider text-[10px]">Methodology:</span>
              <p className="text-[#6B8F71] mt-1 leading-relaxed">{details.method}</p>
            </div>
            {/* Sparkline placeholder */}
            <div className="h-8 w-full mt-1 border-b border-dashed border-[rgba(255,255,255,0.1)] flex items-end">
              <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full opacity-50 stroke-current" style={{ color: accentColor }}>
                <path d="M0,15 Q10,10 20,12 T40,8 T60,10 T80,5 T100,2" fill="none" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function InteractiveKpiRow({ currentData, viewMode, globalEmissions, entranceStage }: any) {
  const accent = viewMode === 'world' ? '#00E5A0' : '#39FF14';

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <KpiCard 
        title="Total Annual" value={currentData.total} suffix=" GT" decimals={1} trend={`+${currentData.yoyChange}% YoY`} trendBad={currentData.yoyChange > 0} 
        details={{ meaning: "Total greenhouse gas emissions generated within the calendar year.", method: "Calculated using IPCC Tier 1 methodology aggregating sector reports." }}
        accentColor={accent} delayIndex={0} entranceStage={entranceStage}
      />
      <KpiCard 
        title="Per Capita" value={currentData.perCapita} suffix=" tCO₂" decimals={1} compare={viewMode === 'world' ? "vs US 14.5t" : "vs Wld 4.7t"} 
        details={{ meaning: "Average emissions generated by a single resident per year.", method: "Total national/global emissions divided by current population census data." }}
        accentColor={accent} delayIndex={1} entranceStage={entranceStage}
      />
      <KpiCard 
        title="Renewable Share" value={currentData.renewableShare} suffix="%" decimals={1} trend="+2.4% YoY" trendBad={false} 
        details={{ meaning: "Percentage of total electricity generated by zero-carbon renewable sources.", method: "Sum of wind, solar, hydro, and nuclear generation divided by total grid mix." }}
        accentColor={accent} delayIndex={2} entranceStage={entranceStage}
      />
      <KpiCard 
        title="Net Zero Target" value={0} valueString={currentData.netZeroYear ? currentData.netZeroYear.toString() : "2050"} compare={viewMode === 'india' ? "COP26 Pledge" : "Paris Agreement"} 
        details={{ meaning: "The pledged year by which emissions added will equal emissions removed.", method: "Sourced from official NDC (Nationally Determined Contributions) filings." }}
        accentColor={accent} delayIndex={3} entranceStage={entranceStage}
      />
      
      {viewMode === 'world' ? (
        <KpiCard 
          title="Carbon Budget" value={currentData.budgetRemainingYears} suffix=" yrs" decimals={1} compare="at current rate" trendBad={true} 
          details={{ meaning: "Time remaining until the 1.5°C threshold becomes mathematically unavoidable.", method: "Remaining CO2e budget (GT) divided by current annual run-rate." }}
          accentColor={accent} delayIndex={4} entranceStage={entranceStage}
        />
      ) : (
        <KpiCard 
          title="Emissions Intensity" value={-33} suffix="%" prefix="" decimals={0} compare="since 2005" trendBad={false} 
          details={{ meaning: "Emissions produced per unit of GDP, indicating economic decoupling.", method: "Total emissions divided by real GDP (PPP), indexed to 2005 baseline." }}
          accentColor={accent} delayIndex={4} entranceStage={entranceStage}
        />
      )}
      
      <KpiCard 
        title="Temp Anomaly" value={globalEmissions.tempAnomaly} suffix="°C" prefix="+" decimals={2} trend="+0.04°C YoY" trendBad={true} 
        details={{ meaning: "Rise in global average temperature compared to the pre-industrial baseline (1850-1900).", method: "Averaged readings from NOAA, NASA GISS, and HadCRUT datasets." }}
        accentColor={accent} delayIndex={5} entranceStage={entranceStage}
      />
    </div>
  );
}
