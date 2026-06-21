import React from 'react';
import { CheckCircle2, Circle, ListTodo } from 'lucide-react';
import confetti from 'canvas-confetti';

export interface CommittedAction {
  id: string; // derived from tip text
  category: string;
  tipText: string;
  kgSavings: number;
  done: boolean;
}

interface ActionPlanChecklistProps {
  actions: CommittedAction[];
  onToggleDone: (id: string, done: boolean) => void;
}

export default function ActionPlanChecklist({ actions, onToggleDone }: ActionPlanChecklistProps) {
  if (actions.length === 0) return null;

  const totalPotentialSavings = actions.reduce((sum, a) => sum + (a.done ? 0 : a.kgSavings), 0);
  const totalAchievedSavings = actions.reduce((sum, a) => sum + (a.done ? a.kgSavings : 0), 0);

  const handleToggle = (e: React.MouseEvent, id: string, currentlyDone: boolean) => {
    onToggleDone(id, !currentlyDone);
    
    if (!currentlyDone) {
      // Fire small confetti burst from click position
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { x, y },
        colors: ['#39FF14', '#00E5A0', '#E8F5E2'],
        disableForReducedMotion: true,
        zIndex: 100
      });
    }
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#39FF14]/20 shadow-[0_0_30px_rgba(57,255,20,0.05)] animate-[fade-in_0.5s_ease-out]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#39FF14]/20 to-[#00E5A0]/20 border border-[#39FF14]/30 flex items-center justify-center">
            <ListTodo className="w-5 h-5 text-[#39FF14]" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-[#E8F5E2]">My Action Plan</h2>
            <p className="text-sm text-[#6B8F71]">{actions.filter(a => a.done).length} of {actions.length} completed</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm font-mono bg-black/20 px-4 py-2 rounded-xl border border-white/5">
          <div className="flex flex-col">
            <span className="text-[#6B8F71] text-[10px] uppercase tracking-wider">Potential</span>
            <span className="text-[#E8F5E2] font-bold">{totalPotentialSavings} kg</span>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="flex flex-col">
            <span className="text-[#6B8F71] text-[10px] uppercase tracking-wider">Achieved</span>
            <span className="text-[#39FF14] font-bold">{totalAchievedSavings} kg</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={(e) => handleToggle(e, action.id, action.done)}
            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-300 cursor-pointer text-left ${
              action.done 
                ? 'bg-[#39FF14]/5 border-[#39FF14]/20 opacity-75' 
                : 'bg-black/20 border-white/5 hover:border-white/15 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`transition-colors duration-300 ${action.done ? 'text-[#39FF14] scale-110' : 'text-[#6B8F71]'}`}>
                {action.done ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
              </div>
              <div>
                <p className={`text-sm md:text-base font-medium transition-colors ${action.done ? 'text-[#6B8F71] line-through' : 'text-[#E8F5E2]'}`}>
                  {action.tipText}
                </p>
                <span className="text-xs text-[#6B8F71] capitalize">{action.category.replace('_', ' ')}</span>
              </div>
            </div>
            <div className={`font-mono text-sm font-bold whitespace-nowrap ml-4 ${action.done ? 'text-[#6B8F71]' : 'text-[#39FF14]'}`}>
              -{action.kgSavings} kg
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
