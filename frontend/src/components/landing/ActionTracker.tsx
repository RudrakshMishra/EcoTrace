'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, Square, Flame, Trash2, ArrowUpRight, Zap, RefreshCw } from 'lucide-react';
import CarbonOrb from '../CarbonOrb';

interface ActionItem {
  id: number;
  type: 'green' | 'carbon';
  description: string;
  impact: number; // in kg
  category: string;
}

const initialActions: ActionItem[] = [
  { id: 1, type: 'carbon', description: 'Drove SUV to grocery shop alone', impact: 4.8, category: 'Transport' },
  { id: 2, type: 'carbon', description: 'Bought fast-fashion polyester shirt', impact: 8.5, category: 'Shopping' },
  { id: 3, type: 'carbon', description: 'Ate double beef burger for lunch', impact: 3.3, category: 'Diet' },
  { id: 4, type: 'green', description: 'Commuted by commuter train', impact: -3.5, category: 'Transport' },
  { id: 5, type: 'green', description: 'Switched home thermostat to Eco mode', impact: -1.8, category: 'Energy' },
  { id: 6, type: 'green', description: 'Repaired old boots instead of buying new ones', impact: -6.0, category: 'Shopping' },
];

export default function ActionTracker() {
  const [selectedActions, setSelectedActions] = useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: true,
    4: true,
    5: false,
    6: false,
  });

  const [streak, setStreak] = useState(5);
  const [showSavingAlert, setShowSavingAlert] = useState(false);

  const toggleAction = (id: number) => {
    setSelectedActions(prev => {
      const next = { ...prev, [id]: !prev[id] };
      // Check if they toggled on a green action or toggled off a carbon action
      const action = initialActions.find(a => a.id === id);
      if (action) {
        const isBetterChoice = (action.type === 'green' && next[id]) || (action.type === 'carbon' && !next[id]);
        if (isBetterChoice) {
          setShowSavingAlert(true);
          setTimeout(() => setShowSavingAlert(false), 2000);
        }
      }
      return next;
    });
  };

  // Compute total net carbon
  let netCarbon = 0;
  initialActions.forEach(action => {
    if (selectedActions[action.id]) {
      netCarbon += action.impact;
    }
  });

  // Calculate equivalent score in tons for the orb
  // Let's assume this net daily carbon scales to a yearly equivalent for the Orb rendering.
  // 1 kg/day ~ 0.365 tons/year.
  const orbScore = Math.max(0.1, netCarbon * 0.365);

  const carbonActions = initialActions.filter(a => a.type === 'carbon');
  const greenActions = initialActions.filter(a => a.type === 'green');

  return (
    <section className="relative min-h-screen w-full bg-[#0A0F0D] flex flex-col items-center justify-center overflow-hidden py-32 px-6">
      {/* Dynamic Background Glow reacting to total net carbon */}
      <motion.div 
        className="absolute inset-0 z-0 pointer-events-none opacity-20 transition-colors duration-700"
        style={{
          background: netCarbon > 0 
            ? "radial-gradient(circle, rgba(255,77,77,0.1) 0%, rgba(10,15,13,0) 70%)"
            : "radial-gradient(circle, rgba(57,255,20,0.1) 0%, rgba(10,15,13,0) 70%)"
        }}
      />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch z-10">
        
        {/* Left Column: Toggles - Span 7 */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#39FF14]/10 border border-[#39FF14]/20 rounded-full text-xs font-mono font-bold text-[#39FF14] w-fit mb-6">
              <Zap className="w-3.5 h-3.5" />
              <span>LIVE CARBON LEDGER</span>
            </div>

            <h2 className="font-display font-bold text-4xl md:text-5xl text-[#E8F5E2] mb-4 leading-tight">
              Every action counts. <span className="text-[#00E5A0] text-glow-green">Instantly.</span>
            </h2>
            <p className="text-[#6B8F71] text-base mb-8 max-w-xl">
              Simulate your day. Toggle items to see how standard daily routines versus active carbon-conscious habits adjust your score in real time.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Carbon Actions Column */}
              <div className="flex flex-col gap-3">
                <span className="font-mono text-xs font-bold text-[#FF4D4D] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D4D]" />
                  Carbon Sources
                </span>
                {carbonActions.map(action => (
                  <button
                    key={action.id}
                    onClick={() => toggleAction(action.id)}
                    className={`text-left p-4 rounded-2xl border transition-all duration-300 flex items-start gap-3 group cursor-pointer ${
                      selectedActions[action.id]
                        ? 'border-[#FF4D4D]/40 bg-[#FF4D4D]/5 text-white'
                        : 'border-white/5 bg-white/5 text-gray-400 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="mt-0.5 text-gray-500 group-hover:text-gray-300">
                      {selectedActions[action.id] ? (
                        <CheckSquare className="w-4 h-4 text-[#FF4D4D]" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold font-display text-gray-300 mb-0.5">{action.category}</div>
                      <div className="text-xs font-medium text-gray-200 leading-tight mb-2">{action.description}</div>
                      <div className="font-mono text-2xs font-bold text-[#FF4D4D]">+{action.impact.toFixed(1)}kg CO₂</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Green Actions Column */}
              <div className="flex flex-col gap-3">
                <span className="font-mono text-xs font-bold text-[#39FF14] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14]" />
                  Carbon Reducers
                </span>
                {greenActions.map(action => (
                  <button
                    key={action.id}
                    onClick={() => toggleAction(action.id)}
                    className={`text-left p-4 rounded-2xl border transition-all duration-300 flex items-start gap-3 group cursor-pointer ${
                      selectedActions[action.id]
                        ? 'border-[#39FF14]/40 bg-[#39FF14]/5 text-white'
                        : 'border-white/5 bg-white/5 text-gray-400 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="mt-0.5 text-gray-500 group-hover:text-gray-300">
                      {selectedActions[action.id] ? (
                        <CheckSquare className="w-4 h-4 text-[#39FF14]" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold font-display text-gray-300 mb-0.5">{action.category}</div>
                      <div className="text-xs font-medium text-gray-200 leading-tight mb-2">{action.description}</div>
                      <div className="font-mono text-2xs font-bold text-[#39FF14]">{action.impact.toFixed(1)}kg CO₂</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Counter & Mini Orb - Span 5 */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-white/5 border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Confetti alert on high savings */}
          <AnimatePresence>
            {showSavingAlert && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-4 left-4 right-4 bg-[#39FF14]/20 border border-[#39FF14]/40 text-[#39FF14] font-mono text-xs font-bold py-2.5 px-4 rounded-xl text-center z-20 flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Live Footprint Recalculated!
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sparkle and Streak meter */}
          <div className="flex justify-between items-center mb-6">
            <span className="font-mono text-xs text-gray-500 font-bold uppercase">Live Feedback</span>
            <div className="flex items-center gap-1 bg-[#FFB830]/15 border border-[#FFB830]/30 px-3 py-1 rounded-full text-[#FFB830] font-mono text-xs font-bold">
              <Flame className="w-3.5 h-3.5 animate-bounce" fill="currentColor" />
              <span>{streak}-Day Streak</span>
            </div>
          </div>

          {/* Mini Carbon Orb Display */}
          <div className="flex items-center justify-center py-6">
            <CarbonOrb score={orbScore} size="medium" interactive={false} />
          </div>

          {/* Core score text block */}
          <div className="text-center mt-4 border-t border-white/5 pt-6">
            <div className="text-[10px] uppercase font-mono tracking-widest text-[#6B8F71] font-bold mb-1">
              Net Impact Selected Today
            </div>
            <motion.div 
              key={netCarbon}
              initial={{ scale: 0.9, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`text-4xl font-mono font-extrabold transition-colors ${
                netCarbon > 0 ? 'text-[#FF4D4D]' : 'text-[#39FF14]'
              }`}
            >
              {netCarbon > 0 ? '+' : ''}{netCarbon.toFixed(1)} kg CO₂
            </motion.div>
            <p className="text-xs text-gray-400 mt-2 px-4 leading-relaxed">
              {netCarbon > 0 
                ? "Your selection produces excess emissions. Let's aim to drive it negative."
                : "Excellent! You are in the carbon negative zone for the actions selected."}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
