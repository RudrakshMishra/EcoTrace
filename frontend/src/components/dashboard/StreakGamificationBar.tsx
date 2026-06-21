import React, { useState, useMemo } from 'react';
import { Flame, Trophy, Leaf, Calendar } from 'lucide-react';

export interface LogEntry {
  date: string; // YYYY-MM-DD
  selectedActions: string[];
  netDelta: number;
}

interface BadgeDef {
  id: string;
  title: string;
  desc: string;
  icon: string;
}

const BADGES: BadgeDef[] = [
  { id: 'first_log', title: 'First Log', desc: 'Logged your first action', icon: '🌱' },
  { id: '7_day_streak', title: '7-Day Streak', desc: 'Logged for 7 days in a row', icon: '🔥' },
  { id: '30_day_streak', title: '30-Day Streak', desc: 'Logged for 30 days in a row', icon: '🏆' },
  { id: '100kg_saved', title: '100kg Saved', desc: 'Saved a total of 100kg CO₂', icon: '💚' },
  { id: 'flight_free', title: 'Flight-Free Month', desc: 'No flights logged in the last 30 days', icon: '✈️' },
];

interface StreakGamificationBarProps {
  logs: LogEntry[];
  unlockedBadges: string[];
}

export default function StreakGamificationBar({ logs, unlockedBadges }: StreakGamificationBarProps) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const stats = useMemo(() => {
    // Sort logs by date descending
    const sortedLogs = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let totalSaved = 0;
    
    // Calculate total saved (sum of negative deltas)
    logs.forEach(log => {
      if (log.netDelta < 0) {
        totalSaved += Math.abs(log.netDelta);
      }
    });

    // Calculate streaks
    if (sortedLogs.length > 0) {
      // Find today's date and yesterday's date
      const today = new Date();
      today.setHours(0,0,0,0);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let lastDate: Date | null = null;
      for (const log of sortedLogs) {
        const logDate = new Date(log.date);
        logDate.setHours(0,0,0,0);
        
        if (!lastDate) {
          // If the most recent log is older than yesterday, current streak is 0
          if (logDate.getTime() < yesterday.getTime()) {
            currentStreak = 0;
            tempStreak = 1;
          } else {
            currentStreak = 1;
            tempStreak = 1;
          }
          lastDate = logDate;
        } else {
          // Check if it's the previous consecutive day
          const expectedPrevDay = new Date(lastDate);
          expectedPrevDay.setDate(expectedPrevDay.getDate() - 1);
          
          if (logDate.getTime() === expectedPrevDay.getTime()) {
            tempStreak++;
            if (currentStreak > 0) currentStreak++;
          } else {
            if (tempStreak > longestStreak) longestStreak = tempStreak;
            tempStreak = 1; // reset temp
            if (currentStreak > 0) {
                // Once we break the chain from today/yesterday, current streak calculation stops
                longestStreak = Math.max(longestStreak, currentStreak);
                currentStreak = 0; 
            }
          }
          lastDate = logDate;
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak);
    }

    return {
      currentStreak,
      longestStreak,
      totalSaved,
      daysTracked: logs.length
    };
  }, [logs]);

  return (
    <div className="flex flex-col gap-4 animate-[fade-in_0.5s_ease-out]">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Stat Cards */}
        <div className="glass-panel p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center gap-1 hover:border-white/10 transition-colors">
          <Flame className="w-6 h-6 text-[#FFB830] mb-1" />
          <span className="text-[#E8F5E2] font-display font-bold text-xl">{stats.currentStreak}</span>
          <span className="text-[#6B8F71] text-xs uppercase tracking-wider font-semibold">Current Streak</span>
        </div>
        
        <div className="glass-panel p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center gap-1 hover:border-white/10 transition-colors">
          <Trophy className="w-6 h-6 text-[#39FF14] mb-1" />
          <span className="text-[#E8F5E2] font-display font-bold text-xl">{stats.longestStreak}</span>
          <span className="text-[#6B8F71] text-xs uppercase tracking-wider font-semibold">Longest Streak</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center gap-1 hover:border-white/10 transition-colors">
          <Leaf className="w-6 h-6 text-[#00E5A0] mb-1" />
          <span className="text-[#E8F5E2] font-display font-bold text-xl">{stats.totalSaved.toFixed(1)}</span>
          <span className="text-[#6B8F71] text-xs uppercase tracking-wider font-semibold">Kg Saved</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center gap-1 hover:border-white/10 transition-colors">
          <Calendar className="w-6 h-6 text-[#6B8F71] mb-1" />
          <span className="text-[#E8F5E2] font-display font-bold text-xl">{stats.daysTracked}</span>
          <span className="text-[#6B8F71] text-xs uppercase tracking-wider font-semibold">Days Tracked</span>
        </div>
      </div>

      {/* Badges Section */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/5 flex flex-wrap items-center justify-center gap-3 sm:gap-6 relative">
        <span className="text-[#6B8F71] text-xs font-semibold uppercase tracking-wider w-full sm:w-auto text-center sm:text-left mb-2 sm:mb-0">
          Badges:
        </span>
        {BADGES.map(badge => {
          const isUnlocked = unlockedBadges.includes(badge.id);
          const showTooltip = activeTooltip === badge.id;

          return (
            <div 
              key={badge.id}
              className="relative flex flex-col items-center"
              onMouseEnter={() => setActiveTooltip(badge.id)}
              onMouseLeave={() => setActiveTooltip(null)}
              onClick={() => setActiveTooltip(showTooltip ? null : badge.id)}
            >
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all duration-300 cursor-pointer ${
                  isUnlocked 
                    ? 'bg-black/20 border border-[#39FF14]/30 shadow-[0_0_15px_rgba(57,255,20,0.15)] opacity-100 transform hover:-translate-y-1' 
                    : 'bg-black/10 border border-white/5 opacity-40 grayscale'
                }`}
              >
                {badge.icon}
              </div>
              
              {/* Tooltip */}
              {showTooltip && (
                <div className="absolute top-14 left-1/2 -translate-x-1/2 w-48 bg-[#162019] border border-white/10 shadow-xl rounded-xl p-3 z-10 animate-[fade-in_0.2s_ease-out]">
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#162019] border-t border-l border-white/10 rotate-45" />
                  <p className="font-bold text-sm text-[#E8F5E2] text-center mb-1 relative z-10">{badge.title}</p>
                  <p className="text-xs text-[#6B8F71] text-center relative z-10">{badge.desc}</p>
                  <p className="text-[10px] uppercase font-bold text-center mt-2 relative z-10">
                    {isUnlocked ? <span className="text-[#39FF14]">✓ Unlocked</span> : <span className="text-[#FF4D4D]">Locked</span>}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
