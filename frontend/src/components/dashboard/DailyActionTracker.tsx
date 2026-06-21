import React, { useState, useEffect } from 'react';
import { Check, X, Save, Edit2 } from 'lucide-react';
import type { LogEntry } from './StreakGamificationBar';

interface ActionItem {
  id: string;
  label: string;
  delta: number;
  type: 'positive' | 'negative';
}

const GREEN_ACTIONS: ActionItem[] = [
  { id: 'cycle', label: 'Cycled instead of drove', delta: -1.2, type: 'positive' },
  { id: 'plant_meal', label: 'Ate plant-based meal', delta: -0.8, type: 'positive' },
  { id: 'recycle', label: 'Recycled', delta: -0.3, type: 'positive' },
  { id: 'heating', label: 'Lowered heating 1°C', delta: -0.5, type: 'positive' },
  { id: 'shower', label: 'Short shower', delta: -0.2, type: 'positive' },
  { id: 'unplug', label: 'Unplugged devices', delta: -0.1, type: 'positive' },
  { id: 'transit', label: 'Used public transport', delta: -0.9, type: 'positive' },
  { id: 'laundry', label: 'Air-dried laundry', delta: -0.3, type: 'positive' },
];

const ADD_ACTIONS: ActionItem[] = [
  { id: 'drove', label: 'Drove alone', delta: 2.1, type: 'negative' },
  { id: 'red_meat', label: 'Ate red meat', delta: 3.3, type: 'negative' },
  { id: 'flight', label: 'Long-haul flight', delta: 90.0, type: 'negative' },
  { id: 'clothes', label: 'Bought new clothes', delta: 6.0, type: 'negative' },
  { id: 'food_del', label: 'Food delivery', delta: 1.5, type: 'negative' },
  { id: 'standby', label: 'Left electronics on standby', delta: 0.4, type: 'negative' },
];

interface DailyActionTrackerProps {
  logs: LogEntry[];
  onSaveLog: (entry: LogEntry) => void;
}

export default function DailyActionTracker({ logs, onSaveLog }: DailyActionTrackerProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isEditMode, setIsEditMode] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = logs.find(l => l.date === todayStr);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (todayLog && !isEditMode) {
        setSelectedIds(new Set(todayLog.selectedActions));
      } else if (!todayLog && !isEditMode) {
        setSelectedIds(new Set());
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [todayLog, isEditMode]);

  const toggleAction = (id: string) => {
    if (todayLog && !isEditMode) return; // Prevent edits unless in edit mode
    
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const currentNetDelta = Array.from(selectedIds).reduce((sum, id) => {
    const action = [...GREEN_ACTIONS, ...ADD_ACTIONS].find(a => a.id === id);
    return sum + (action?.delta || 0);
  }, 0);

  const handleSave = () => {
    onSaveLog({
      date: todayStr,
      selectedActions: Array.from(selectedIds),
      netDelta: currentNetDelta
    });
    setIsEditMode(false);
    setToast("Successfully logged today's actions!");
    setTimeout(() => setToast(null), 3000);
  };

  const renderCard = (action: ActionItem) => {
    const isSelected = selectedIds.has(action.id);
    const isGreen = action.type === 'positive';
    
    let baseClass = "relative flex flex-col p-4 rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden";
    
    if (isSelected) {
      if (isGreen) {
        baseClass += " bg-[#39FF14]/10 border-[#39FF14] shadow-[0_0_15px_rgba(57,255,20,0.15)] transform scale-[0.98]";
      } else {
        baseClass += " bg-[#FF4D4D]/10 border-[#FF4D4D] shadow-[0_0_15px_rgba(255,77,77,0.15)] transform scale-[0.98]";
      }
    } else {
      baseClass += " bg-black/20 border-white/5 hover:border-white/15 hover:bg-white/5 hover:-translate-y-0.5";
    }

    if (todayLog && !isEditMode) {
       baseClass += " opacity-60 cursor-default pointer-events-none";
    }

    return (
      <div 
        key={action.id} 
        onClick={() => toggleAction(action.id)}
        className={baseClass}
      >
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm font-medium text-[#E8F5E2] leading-snug pr-4">{action.label}</span>
          <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
            isSelected 
              ? (isGreen ? 'bg-[#39FF14] border-[#39FF14] text-black' : 'bg-[#FF4D4D] border-[#FF4D4D] text-white')
              : 'border-white/20 text-transparent'
          }`}>
            {isSelected && (isGreen ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />)}
          </div>
        </div>
        <div className={`mt-auto font-mono text-sm font-bold ${isGreen ? 'text-[#39FF14]' : 'text-[#FF4D4D]'}`}>
          {action.delta > 0 ? '+' : ''}{action.delta} kg
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 animate-[fade-in_0.6s_ease-out]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl text-[#E8F5E2]">Daily Action Tracker</h2>
          <p className="text-[#6B8F71] text-sm mt-1">Log your carbon-impacting activities for today.</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[#6B8F71] uppercase tracking-wider font-semibold mb-1">Today's Net Impact</p>
          <p className={`font-mono text-2xl font-bold ${currentNetDelta <= 0 ? 'text-[#39FF14]' : 'text-[#FF4D4D]'}`}>
            {currentNetDelta > 0 ? '+' : ''}{currentNetDelta.toFixed(1)} kg
          </p>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-white/5">
        <h3 className="text-[#39FF14] text-sm uppercase tracking-wider font-bold mb-4 flex items-center gap-2">
          <Check className="w-4 h-4" /> Eco Wins
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {GREEN_ACTIONS.map(renderCard)}
        </div>

        <h3 className="text-[#FF4D4D] text-sm uppercase tracking-wider font-bold mb-4 flex items-center gap-2">
          <X className="w-4 h-4" /> Carbon Additions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {ADD_ACTIONS.map(renderCard)}
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="h-6">
            {toast && (
              <span className="text-[#39FF14] text-sm font-medium animate-[fade-in_0.3s_ease-out] flex items-center gap-2">
                <Check className="w-4 h-4" /> {toast}
              </span>
            )}
          </div>
          
          {todayLog && !isEditMode ? (
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/20 font-bold px-6 py-3.5 rounded-xl">
                <Check className="w-5 h-5" />
                Logged Today
              </div>
              <button 
                onClick={() => setIsEditMode(true)}
                className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-[#E8F5E2] font-medium px-4 py-3.5 rounded-xl transition-colors border border-white/5"
              >
                <Edit2 className="w-4 h-4" /> Edit
              </button>
            </div>
          ) : (
            <button 
              onClick={handleSave}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#39FF14] hover:bg-[#2ed60f] text-[#0A0F0D] font-bold px-8 py-3.5 rounded-xl shadow-[0_0_20px_rgba(57,255,20,0.2)] hover:shadow-[0_0_30px_rgba(57,255,20,0.4)] transition-all"
            >
              <Save className="w-5 h-5" />
              {todayLog ? 'Update Log' : 'Save Today\'s Log'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
