import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { LogEntry } from './StreakGamificationBar';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
);

interface TrendChartProps {
  logs: LogEntry[];
}

export default function TrendChart({ logs }: TrendChartProps) {
  const [range, setRange] = useState<'7' | '30'>('7');

  const chartData = useMemo(() => {
    const daysToLookBack = parseInt(range, 10);
    const today = new Date();
    today.setHours(0,0,0,0);
    
    // Generate an array of dates for the last N days
    const labels: string[] = [];
    const dataPoints: number[] = [];
    
    // Create a map for quick lookup
    const logMap = new Map(logs.map(l => [l.date, l.netDelta]));

    for (let i = daysToLookBack - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      labels.push(label);
      dataPoints.push(logMap.get(dateStr) || 0); // 0 if no log for that day
    }

    return {
      labels,
      datasets: [
        {
          label: 'Net Impact (kg)',
          data: dataPoints,
          borderWidth: 3,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.4,
          segment: {
            borderColor: (ctx: any) => ctx.p1DataPoint.raw < 0 ? '#39FF14' : '#FF4D4D',
            backgroundColor: (ctx: any) => ctx.p1DataPoint.raw < 0 ? 'rgba(57,255,20,0.15)' : 'rgba(255,77,77,0.15)'
          }
        }
      ]
    };
  }, [logs, range]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#162019',
        titleColor: '#6B8F71',
        bodyColor: '#E8F5E2',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (context: any) => {
            const val = context.raw;
            return `Impact: ${val > 0 ? '+' : ''}${val.toFixed(1)} kg`;
          }
        }
      }
    },
    scales: {
      y: {
        grid: {
          color: (ctx: any) => ctx.tick.value === 0 ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.05)',
          lineWidth: (ctx: any) => ctx.tick.value === 0 ? 2 : 1,
        },
        border: { display: false },
        ticks: { color: '#6B8F71', font: { family: 'monospace' } }
      },
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: '#6B8F71', maxRotation: 45, minRotation: 45 }
      }
    }
  };

  if (logs.length < 2) {
    return (
      <div className="glass-panel p-8 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center min-h-[300px] animate-[fade-in_0.7s_ease-out]">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <span className="text-2xl">📈</span>
        </div>
        <h3 className="font-display font-bold text-xl text-[#E8F5E2] mb-2">Trend Chart Unavailable</h3>
        <p className="text-[#6B8F71]">Log your actions for at least 2 days to start seeing your trend line!</p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 animate-[fade-in_0.7s_ease-out] flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-display font-bold text-xl text-[#E8F5E2]">Recent Trends</h2>
          <p className="text-sm text-[#6B8F71] mt-1">Daily net carbon footprint adjustment</p>
        </div>
        
        <div className="flex bg-black/30 p-1 rounded-xl border border-white/5 w-full sm:w-auto">
          <button 
            onClick={() => setRange('7')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              range === '7' ? 'bg-[#39FF14]/20 text-[#39FF14]' : 'text-[#6B8F71] hover:text-[#E8F5E2]'
            }`}
          >
            Last 7 Days
          </button>
          <button 
            onClick={() => setRange('30')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              range === '30' ? 'bg-[#39FF14]/20 text-[#39FF14]' : 'text-[#6B8F71] hover:text-[#E8F5E2]'
            }`}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      <div className="w-full h-[300px]">
        <Line data={chartData as any} options={options} />
      </div>
    </div>
  );
}
