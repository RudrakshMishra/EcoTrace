import React, { useState, useEffect } from 'react';
import { Target, Flag, Edit3, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export interface GoalData {
  targetPercent: number;
  targetKg: number;
  setDate: string;
}

interface GoalSetterProps {
  annualTotal: number;
  totalSaved: number;
  savedGoal: GoalData | null;
  onSaveGoal: (goal: GoalData) => void;
  onGoalCompleted?: () => void;
}

export default function GoalSetter({ annualTotal, totalSaved, savedGoal, onSaveGoal, onGoalCompleted }: GoalSetterProps) {
  const [isEditing, setIsEditing] = useState(!savedGoal);
  const [sliderValue, setSliderValue] = useState(savedGoal?.targetPercent || 10);
  const [hasCelebrated, setHasCelebrated] = useState(false);

  // If a goal exists, calculate the gap
  const gapNeeded = savedGoal ? (annualTotal * savedGoal.targetPercent) / 100 : 0;
  const progressPercent = savedGoal && gapNeeded > 0 ? Math.min(100, Math.round((totalSaved / gapNeeded) * 100)) : 0;
  
  const targetKgValue = Math.round(annualTotal * (1 - sliderValue / 100));

  useEffect(() => {
    if (savedGoal && progressPercent >= 100 && !hasCelebrated) {
      const timer = setTimeout(() => {
        setHasCelebrated(true);
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#39FF14', '#00E5A0', '#E8F5E2']
        });
        if (onGoalCompleted) {
          onGoalCompleted();
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [progressPercent, savedGoal, hasCelebrated, onGoalCompleted]);

  const handleSave = () => {
    onSaveGoal({
      targetPercent: sliderValue,
      targetKg: targetKgValue,
      setDate: new Date().toISOString()
    });
    setIsEditing(false);
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 animate-[fade-in_0.8s_ease-out] relative overflow-hidden">
      {/* Background glow if goal met */}
      {progressPercent >= 100 && (
        <div className="absolute inset-0 bg-gradient-to-tr from-[#39FF14]/10 to-transparent pointer-events-none" />
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#39FF14]/20 border border-[#39FF14]/30 flex items-center justify-center">
            <Target className="w-5 h-5 text-[#39FF14]" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-[#E8F5E2]">Reduction Goal</h2>
            <p className="text-sm text-[#6B8F71]">Set your target and track cumulative savings</p>
          </div>
        </div>

        {!isEditing && savedGoal && (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 text-sm text-[#6B8F71] hover:text-[#E8F5E2] bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors border border-white/5"
          >
            <Edit3 className="w-4 h-4" /> Edit Goal
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="flex flex-col gap-6 relative z-10">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end mb-2">
              <label className="text-sm font-semibold text-[#E8F5E2] uppercase tracking-wider">Target Reduction</label>
              <span className="font-mono text-2xl font-bold text-[#39FF14]">{sliderValue}%</span>
            </div>
            
            <input 
              type="range" 
              min="1" 
              max="50" 
              value={sliderValue} 
              onChange={(e) => setSliderValue(parseInt(e.target.value))}
              className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer accent-[#39FF14]"
            />
            <div className="flex justify-between text-xs text-[#6B8F71] mt-1">
              <span>1%</span>
              <span>50%</span>
            </div>
          </div>

          <div className="bg-black/20 p-4 rounded-xl border border-white/5 text-center">
            <span className="text-[#6B8F71] text-sm font-medium">Goal: reduce from</span>
            <span className="font-mono font-bold text-[#E8F5E2] mx-2">{annualTotal.toLocaleString()} kg/yr</span>
            <span className="text-[#6B8F71] text-sm font-medium">to</span>
            <span className="font-mono font-bold text-[#39FF14] mx-2 text-xl">{targetKgValue.toLocaleString()} kg/yr</span>
          </div>

          <div className="flex gap-3 justify-end">
            {savedGoal && (
              <button 
                onClick={() => { setIsEditing(false); setSliderValue(savedGoal.targetPercent); }}
                className="px-4 py-2 rounded-xl text-[#E8F5E2] hover:bg-white/10 transition-colors text-sm font-semibold"
              >
                Cancel
              </button>
            )}
            <button 
              onClick={handleSave}
              className="bg-[#39FF14] text-black px-6 py-2 rounded-xl font-bold shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:bg-[#2ed60f] transition-all"
            >
              Set Goal
            </button>
          </div>
        </div>
      ) : savedGoal ? (
        <div className="flex flex-col gap-5 relative z-10">
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-[#6B8F71] text-sm font-semibold uppercase tracking-wider mb-1">Target Reduction</span>
              <span className="font-mono text-3xl font-bold text-[#39FF14]">{savedGoal.targetPercent}%</span>
            </div>
            <div className="text-right">
              <span className="text-[#6B8F71] text-sm block mb-1">To save</span>
              <span className="font-mono text-xl font-bold text-[#E8F5E2]">{gapNeeded.toFixed(1)} kg</span>
            </div>
          </div>

          <div className="w-full h-4 bg-black/40 rounded-full overflow-hidden border border-white/5 shadow-inner relative">
            <div 
              className="h-full bg-gradient-to-r from-[#00E5A0] to-[#39FF14] transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-[#6B8F71] flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#39FF14]" /> {totalSaved.toFixed(1)} kg saved so far
            </span>
            <span className="font-mono font-bold text-[#E8F5E2]">{progressPercent}%</span>
          </div>
          
          {progressPercent >= 100 && (
             <div className="mt-2 bg-[#39FF14]/10 border border-[#39FF14]/30 text-[#39FF14] p-3 rounded-xl text-center font-bold animate-pulse-ring flex items-center justify-center gap-2">
               <Flag className="w-5 h-5" /> Goal Achieved! Incredible work!
             </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
