'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Globe2, Info, AlertTriangle } from 'lucide-react';

import { globalEmissions, indiaEmissions } from '../../data/carbonLensData';

import EntranceSequence from '../../components/carbon-lens/EntranceSequence';
import CarbonLensToggle from '../../components/carbon-lens/CarbonLensToggle';
import InteractiveKpiRow from '../../components/carbon-lens/InteractiveKpiRow';
import TrendAnalysisChart from '../../components/carbon-lens/TrendAnalysisChart';
import SectorBreakdownBars from '../../components/carbon-lens/SectorBreakdownBars';
import IndiaStateMap from '../../components/carbon-lens/IndiaStateMap';
import ComparisonMatrixTable from '../../components/carbon-lens/ComparisonMatrixTable';
import InsightsAndNews from '../../components/carbon-lens/InsightsAndNews';
import ScenarioModeler from '../../components/carbon-lens/ScenarioModeler';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function CarbonLensPage() {
  const [viewMode, setViewMode] = useState<'world' | 'india'>('world');
  const [isMounted, setIsMounted] = useState(false);
  const [entranceStage, setEntranceStage] = useState<'departure' | 'threshold' | 'reveal' | 'settle'>('departure');
  
  useEffect(() => {
    setIsMounted(true);
    document.title = "CarbonLens — Carbon Intelligence Dashboard | EcoTrace";

    // Track mouse for ambient glow
    const handleGlobalMouse = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleGlobalMouse);
    return () => window.removeEventListener('mousemove', handleGlobalMouse);
  }, []);

  const handleEntranceComplete = () => {
    setEntranceStage('reveal');
    setTimeout(() => {
      setEntranceStage('settle');
    }, 2000); // settling time
  };

  if (!isMounted) return null;

  const currentData = viewMode === 'world' ? globalEmissions : indiaEmissions;
  const showEntrance = entranceStage !== 'departure' && entranceStage !== 'threshold';

  return (
    <div className="min-h-screen font-sans bg-[#0A0F0D] text-[#E8F5E2] relative overflow-x-hidden">
      {/* Ambient cursor glow */}
      <div className="ambient-cursor-glow" style={{ opacity: showEntrance ? 1 : 0 }} />

      {/* Cinematic Entrance Overlay */}
      {entranceStage !== 'settle' && (
        <EntranceSequence onComplete={handleEntranceComplete} />
      )}

      <motion.main 
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        animate={showEntrance ? { opacity: 1, filter: 'blur(0px)' } : { opacity: 0, filter: 'blur(10px)' }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        {/* DASHBOARD SUB-NAV (Top Ticker Bar) */}
        <motion.div 
          initial={{ y: '-100%' }}
          animate={showEntrance ? { y: 0 } : { y: '-100%' }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="sticky top-0 z-50 border-b border-[rgba(255,255,255,0.1)]" 
          style={{ backgroundColor: 'rgba(10, 15, 13, 0.85)', backdropFilter: 'blur(12px)' }}
        >
          <div className="flex items-center justify-between px-6 py-3 max-w-[1600px] mx-auto">
            <div className="flex items-center gap-6">
              <Link href="/" className="text-[#6B8F71] hover:text-[#00E5A0] transition-colors flex items-center gap-2 text-sm font-medium">
                <ArrowLeft className="w-4 h-4" />
                Back to EcoTrace
              </Link>
              <div className="h-4 w-px bg-[rgba(255,255,255,0.1)]" />
              <h1 className="font-display font-bold text-xl flex items-center gap-2 tracking-tight">
                <Globe2 className="w-5 h-5 text-[#00E5A0]" />
                Carbon<span className="text-[#00E5A0]">Lens</span>
              </h1>
            </div>

            {/* Ticker Strip */}
            <div className="hidden md:flex flex-1 overflow-hidden mx-8 px-4 border-l border-r border-[rgba(255,255,255,0.1)] items-center text-xs font-mono text-[#6B8F71] whitespace-nowrap">
              <div className="animate-[ticker_30s_linear_infinite] flex gap-12">
                <span>🌍 Global CO2: {globalEmissions.total} GT/yr <span className="text-[#FF4757]">↑{globalEmissions.yoyChange}%</span></span>
                <span>🇮🇳 India: {indiaEmissions.total} GT/yr <span className="text-[#FF4757]">↑{indiaEmissions.yoyChange}%</span></span>
                <span>🌡️ Global temp anomaly: <span className="text-[#FF4757]">+{globalEmissions.tempAnomaly}°C</span></span>
                <span>⚡ Renewables: <span className="text-[#2ED573]">{globalEmissions.renewableShare}%</span></span>
              </div>
            </div>

            {/* View Toggle */}
            <CarbonLensToggle viewMode={viewMode} setViewMode={setViewMode} />
          </div>
        </motion.div>

        <div className="max-w-[1600px] mx-auto px-6 py-8 flex flex-col gap-8">
          {/* Header / Timestamp */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={showEntrance ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex justify-between items-end"
          >
            <div>
              <h2 className="font-display font-bold text-3xl">
                {viewMode === 'world' ? 'Global Emissions Overview' : 'India Climate Dashboard'}
              </h2>
              <p className="text-[#6B8F71] text-sm mt-1">Data modeled for prototype purposes. Last updated: {new Date().toISOString().split('T')[0]}</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#6B8F71] bg-[#162019] px-3 py-1.5 rounded border border-[rgba(255,255,255,0.1)]">
              <Info className="w-3.5 h-3.5" />
              Sources: IEA, Global Carbon Project
            </div>
          </motion.div>

          {/* 1. HERO KPI ROW */}
          <InteractiveKpiRow 
            currentData={currentData} 
            viewMode={viewMode} 
            globalEmissions={globalEmissions} 
            entranceStage={entranceStage} 
          />

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* 2. TREND ANALYSIS PANEL */}
            <TrendAnalysisChart 
              currentData={currentData}
              viewMode={viewMode}
              globalEmissions={globalEmissions}
              indiaEmissions={indiaEmissions}
              entranceStage={entranceStage}
            />

            {/* 3. SECTOR BREAKDOWN */}
            <SectorBreakdownBars 
              currentData={currentData}
              viewMode={viewMode}
              entranceStage={entranceStage}
            />

            {/* 4 & 5. INDIA STATE MAP AND MATRIX */}
            <IndiaStateMap entranceStage={entranceStage} />
            <ComparisonMatrixTable viewMode={viewMode} entranceStage={entranceStage} />

            {/* 6. INSIGHTS AND NEWS */}
            <InsightsAndNews entranceStage={entranceStage} viewMode={viewMode} />

            {/* 7. SCENARIO MODELER */}
            <ScenarioModeler viewMode={viewMode} entranceStage={entranceStage} />
          </div>

          {/* FOOTER */}
          <motion.footer 
            initial={{ opacity: 0 }}
            animate={showEntrance ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 1.6 }}
            className="mt-8 border-t border-[rgba(255,255,255,0.1)] pt-6 pb-12 flex items-center gap-4 text-xs text-[#6B8F71]"
          >
            <AlertTriangle className="w-4 h-4" />
            <p>CarbonLens V2 Cinematic Prototype: Micro-interactions and live modeling integrated. Data is illustrative.</p>
          </motion.footer>

        </div>
      </motion.main>
    </div>
  );
}
