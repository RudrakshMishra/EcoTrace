'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { TrendingUp } from 'lucide-react';

interface TrendAnalysisChartProps {
  currentData: any;
  viewMode: 'world' | 'india';
  globalEmissions: any;
  indiaEmissions: any;
  entranceStage: string;
}

export default function TrendAnalysisChart({ currentData, viewMode, globalEmissions, indiaEmissions, entranceStage }: TrendAnalysisChartProps) {
  // We'll show multiple lines to make the legend interesting
  // For 'world', show Global, China, US, EU (mocked from comparisons)
  // For 'india', show India, and maybe a few sectors or states if we had historical. We'll just show India and Global baseline.
  
  const [activeIds, setActiveIds] = useState<string[]>(['primary', 'secondary', 'tertiary']);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const lines = useMemo(() => {
    if (viewMode === 'world') {
      return [
        { id: 'primary', label: 'Global Total', data: globalEmissions.historicalTrend.map((d: any) => d.value), color: '#00E5A0' },
        { id: 'secondary', label: 'China (Est)', data: globalEmissions.historicalTrend.map((d: any) => d.value * 0.3), color: '#FF4757' },
        { id: 'tertiary', label: 'USA (Est)', data: globalEmissions.historicalTrend.map((d: any) => d.value * 0.14), color: '#39FF14' },
      ];
    } else {
      return [
        { id: 'primary', label: 'India Total', data: indiaEmissions.historicalTrend.map((d: any) => d.value), color: '#39FF14' },
        { id: 'secondary', label: 'Energy Sector', data: indiaEmissions.historicalTrend.map((d: any) => d.value * 0.44), color: '#FF4757' },
        { id: 'tertiary', label: 'Industry Sector', data: indiaEmissions.historicalTrend.map((d: any) => d.value * 0.18), color: '#FFA726' },
      ];
    }
  }, [viewMode, globalEmissions, indiaEmissions]);

  // Reset active lines when viewMode changes
  useMemo(() => {
    setActiveIds(['primary', 'secondary', 'tertiary']);
  }, [viewMode]);

  const toggleLine = (id: string) => {
    setActiveIds(prev => 
      prev.includes(id) 
        ? prev.filter(x => x !== id) 
        : [...prev, id]
    );
  };

  const handleDoubleClick = (id: string) => {
    if (activeIds.length === 1 && activeIds[0] === id) {
      // restore all
      setActiveIds(lines.map(l => l.id));
    } else {
      // isolate
      setActiveIds([id]);
    }
  };

  const activeDatasets = lines.map(line => {
    const isVisible = activeIds.includes(line.id);
    const isHovered = hoveredId === line.id;
    return {
      label: line.label,
      data: isVisible ? line.data : [], // Setting to empty array makes it disappear from Y-axis scaling
      borderColor: line.color,
      backgroundColor: line.color + '1A', // 10% opacity
      borderWidth: isHovered ? 4 : (isVisible ? 2 : 0),
      tension: 0.3,
      fill: isVisible && line.id === 'primary',
      pointRadius: isHovered ? 6 : (isVisible ? 4 : 0),
      pointBackgroundColor: '#0A0F0D',
      hidden: !isVisible
    };
  });

  const showEntrance = entranceStage !== 'departure' && entranceStage !== 'threshold';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
      animate={showEntrance ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: showEntrance ? 0.6 : 0, ease: [0.16, 1, 0.3, 1] }}
      className="lg:col-span-8 bg-[#162019] border border-[rgba(255,255,255,0.1)] rounded-xl p-6 flex flex-col"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-display font-bold text-lg flex items-center gap-2">
          <TrendingUp className="w-4 h-4" style={{ color: viewMode === 'world' ? '#00E5A0' : '#39FF14' }} />
          Emissions Trajectory (2015-2024)
        </h3>
        <div className="text-xs text-[#6B8F71] font-mono">GT CO2e / Year</div>
      </div>

      {/* Interactive Legend */}
      <div className="flex flex-wrap gap-3 mb-6">
        {lines.map((line) => {
          const isActive = activeIds.includes(line.id);
          return (
            <button
              key={line.id}
              onClick={() => toggleLine(line.id)}
              onDoubleClick={() => handleDoubleClick(line.id)}
              onMouseEnter={() => setHoveredId(line.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                isActive ? 'bg-[rgba(255,255,255,0.05)] text-[#E8F5E2]' : 'opacity-40 line-through text-[#6B8F71]'
              }`}
            >
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: line.color }} />
              {line.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 min-h-[300px]">
        {/* We recreate the Line component entirely on entrance to trigger its internal draw animation */}
        {showEntrance && (
          <Line 
            data={{
              labels: currentData.historicalTrend.map((d: any) => d.year),
              datasets: activeDatasets
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              interaction: { mode: 'index', intersect: false },
              animation: {
                duration: 1000,
                easing: 'easeOutQuart'
              },
              scales: {
                x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#6B8F71', font: { family: 'var(--font-mono)' } } },
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#6B8F71', font: { family: 'var(--font-mono)' } }, beginAtZero: true }
              },
              plugins: { legend: { display: false } }
            }}
          />
        )}
      </div>
    </motion.div>
  );
}
