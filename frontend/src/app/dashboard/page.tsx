'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  RefreshCcw, Home, Sparkles, ChevronDown, ChevronUp, Bot, Send, 
  Car, Utensils, Zap, Plane, Plus, Check
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import { api } from '../../utils/api';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Import New Components
import StreakGamificationBar, { LogEntry } from '../../components/dashboard/StreakGamificationBar';
import ActionPlanChecklist, { CommittedAction } from '../../components/dashboard/ActionPlanChecklist';
import DailyActionTracker from '../../components/dashboard/DailyActionTracker';
import TrendChart from '../../components/dashboard/TrendChart';
import GoalSetter, { GoalData } from '../../components/dashboard/GoalSetter';
import ComparisonContext from '../../components/dashboard/ComparisonContext';

ChartJS.register(ArcElement, Tooltip);

const categoryTips: Record<string, string[]> = {
  transport: [
    "Switch to public transit twice a week to cut ~500 kg/yr",
    "Consider carpooling for your daily commute",
    "Switching to an EV or hybrid can drastically cut emissions"
  ],
  diet: [
    "Try 2 meat-free days a week to save ~600 kg/yr",
    "Swap beef for poultry to halve your meat footprint",
    "Buy local seasonal produce to reduce transport emissions"
  ],
  home: [
    "Switch to a green energy tariff to cut up to 1,500 kg/yr",
    "Lower your thermostat by 1°C in winter to save energy",
    "Upgrade to LED lighting and smart power strips"
  ],
  flights_shopping: [
    "Replace one short-haul flight with train travel where possible",
    "Buy second-hand or refurbished electronics",
    "Reduce fast fashion purchases to save ~300 kg/yr"
  ]
};

const categoryIcons: Record<string, any> = {
  transport: Car,
  diet: Utensils,
  home: Zap,
  flights_shopping: Plane
};

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // New State variables
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [goal, setGoal] = useState<GoalData | null>(null);
  const [badges, setBadges] = useState<string[]>([]);
  const [committedActions, setCommittedActions] = useState<CommittedAction[]>([]);

  // Chat state
  const [messages, setMessages] = useState<Array<{role: string, text: string}>>([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatError, setChatError] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rawProfile = localStorage.getItem('ecotrace_profile');
    if (!rawProfile) {
      router.push('/quiz');
      return;
    }
    setProfile(JSON.parse(rawProfile));

    // Load gamification data
    const rawLogs = localStorage.getItem('ecotrace_logs');
    if (rawLogs) setLogs(JSON.parse(rawLogs));
    
    const rawGoal = localStorage.getItem('ecotrace_goals');
    if (rawGoal) setGoal(JSON.parse(rawGoal));

    const rawBadges = localStorage.getItem('ecotrace_badges');
    if (rawBadges) setBadges(JSON.parse(rawBadges));

    const rawCommitted = localStorage.getItem('ecotrace_committed_actions');
    if (rawCommitted) setCommittedActions(JSON.parse(rawCommitted));

    setLoading(false);

    // Initial AI message
    setMessages([
      { role: 'ai', text: "Hi! I can see your footprint breakdown — ask me anything about your results, streaks, or goals!" }
    ]);
  }, [router]);

  // Sync state to local storage when it changes
  useEffect(() => { if (!loading) localStorage.setItem('ecotrace_logs', JSON.stringify(logs)); }, [logs, loading]);
  useEffect(() => { if (!loading && goal) localStorage.setItem('ecotrace_goals', JSON.stringify(goal)); }, [goal, loading]);
  useEffect(() => { if (!loading) localStorage.setItem('ecotrace_badges', JSON.stringify(badges)); }, [badges, loading]);
  useEffect(() => { if (!loading) localStorage.setItem('ecotrace_committed_actions', JSON.stringify(committedActions)); }, [committedActions, loading]);

  // Badge Checking Logic
  useEffect(() => {
    if (loading) return;
    const newBadges = new Set(badges);
    
    if (logs.length > 0) newBadges.add('first_log');
    
    const totalSaved = logs.reduce((sum, l) => sum + (l.netDelta < 0 ? Math.abs(l.netDelta) : 0), 0);
    if (totalSaved >= 100) newBadges.add('100kg_saved');

    // Simple flight free check (no flight in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const hasFlight = logs.some(l => new Date(l.date) >= thirtyDaysAgo && l.selectedActions.includes('flight'));
    if (!hasFlight && logs.length > 0) newBadges.add('flight_free'); // simplified condition for demo

    if (newBadges.size > badges.length) {
      setBadges(Array.from(newBadges));
    }
  }, [logs, loading, badges]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (loading || !profile) {
    return (
      <main className="min-h-screen bg-[#0A0F0D] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#39FF14]"></div>
      </main>
    );
  }

  const globalAvg = 4700;
  // Apply the sum of daily logs to adjust the user's total displaying footprint
  const totalNetDelta = logs.reduce((sum, l) => sum + l.netDelta, 0);
  const adjustedTotal = Math.max(0, profile.total + totalNetDelta);

  const diffPercent = Math.round(Math.abs((adjustedTotal - globalAvg) / globalAvg) * 100);
  const isLower = adjustedTotal <= globalAvg;

  const sortedBreakdowns = [...(profile.breakdowns || [])].sort((a, b) => b.value - a.value);

  // Chart data
  const chartData = {
    labels: sortedBreakdowns.map((b: any) => b.category),
    datasets: [
      {
        data: sortedBreakdowns.map((b: any) => b.value),
        backgroundColor: sortedBreakdowns.map((b: any) => b.color),
        borderColor: '#0A0F0D',
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  const handleSendChat = async (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    setChatInput('');
    setIsTyping(true);
    setChatError('');

    try {
      const context = {
        annualTotal: adjustedTotal,
        transportScore: profile.breakdowns.find((b:any)=>b.id === 'transport')?.value || 0,
        dietScore: profile.breakdowns.find((b:any)=>b.id === 'diet')?.value || 0,
        homeScore: profile.breakdowns.find((b:any)=>b.id === 'home')?.value || 0,
        flightScore: profile.breakdowns.find((b:any)=>b.id === 'flights_shopping')?.value || 0,
        // New Context
        daysTracked: logs.length,
        totalSaved: logs.reduce((sum, l) => sum + (l.netDelta < 0 ? Math.abs(l.netDelta) : 0), 0),
        goal: goal ? `Target ${goal.targetPercent}% reduction (${goal.targetKg} kg)` : 'None set',
        committedActions: committedActions.map(a => a.tipText).join(', ')
      };

      const res = await api.chat(text, context);
      setMessages(prev => [...prev, { role: 'ai', text: res.response }]);
    } catch (error: any) {
      setChatError(error.message || 'Failed to connect to AI');
    } finally {
      setIsTyping(false);
    }
  };

  const scrollToCard = (id: string) => {
    setExpandedCard(id);
    document.getElementById(`card-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const commitAction = (categoryId: string, tip: string) => {
    const id = tip.replace(/\s+/g, '-').toLowerCase();
    if (committedActions.some(a => a.id === id)) return;
    
    // Extract kg from string or default to 100
    const match = tip.match(/(\d+)\s*kg/);
    const savings = match ? parseInt(match[1]) : 100;

    setCommittedActions(prev => [...prev, {
      id,
      category: categoryId,
      tipText: tip,
      kgSavings: savings,
      done: false
    }]);
  };

  const toggleActionDone = (id: string, done: boolean) => {
    setCommittedActions(prev => prev.map(a => a.id === id ? { ...a, done } : a));
  };

  const saveLog = (entry: LogEntry) => {
    setLogs(prev => {
      const existingIdx = prev.findIndex(l => l.date === entry.date);
      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx] = entry;
        return next;
      }
      return [...prev, entry];
    });
  };

  return (
    <main className="min-h-screen bg-[#0A0F0D] flex flex-col justify-between text-[#E8F5E2]">
      <Navbar />

      <div className="flex-1 w-full max-w-[1600px] mx-auto pt-28 pb-12 px-4 sm:px-6 xl:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 auto-rows-min items-start">
        
          {/* 1. HEADER SECTION */}
          <div className="lg:col-span-12 relative glass-panel p-8 rounded-3xl border border-white/5 text-center animate-[fade-in_0.1s_ease-out]">
            <button 
              onClick={() => router.push('/quiz')}
              className="absolute top-4 right-4 text-xs font-semibold text-[#6B8F71] hover:text-[#E8F5E2] bg-white/5 hover:bg-white/10 py-1.5 px-3 rounded-lg transition-all flex items-center gap-1.5"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              Retake Quiz
            </button>
            
            <h1 className="font-display font-bold text-2xl text-[#6B8F71] mb-2 uppercase tracking-widest">
              Your Dashboard
            </h1>
            <p className="font-mono text-[#39FF14] text-5xl md:text-7xl font-bold tracking-tight mb-4 text-glow-lime flex items-center justify-center gap-3">
              {adjustedTotal.toLocaleString(undefined, { maximumFractionDigits: 1 })} <span className="text-2xl text-[#6B8F71] font-sans">kg CO₂/yr</span>
            </p>

            <div className="inline-block bg-white/5 px-6 py-2.5 rounded-full border border-white/5">
              <p className={`font-semibold text-lg flex items-center gap-2 ${isLower ? 'text-[#39FF14]' : 'text-[#FFB830]'}`}>
                <Sparkles className="w-5 h-5" />
                {diffPercent}% {isLower ? 'below' : 'above'} global average (4,700 kg)
              </p>
            </div>
          </div>

          {/* 2. STREAK & GAMIFICATION BAR */}
          <div className="lg:col-span-12 animate-[fade-in_0.2s_ease-out]">
            <StreakGamificationBar logs={logs} unlockedBadges={badges} />
          </div>

          {/* 3. MY ACTION PLAN CHECKLIST */}
          {committedActions.length > 0 && (
            <div className="lg:col-span-12 animate-[fade-in_0.3s_ease-out]">
              <ActionPlanChecklist actions={committedActions} onToggleDone={toggleActionDone} />
            </div>
          )}

          {/* ROW 1: CATEGORY BREAKDOWN (8) & DAILY TRACKER (4) */}
          <div className="lg:col-span-8 glass-panel p-8 rounded-3xl border border-white/5 flex flex-col md:flex-row gap-8 items-center h-full animate-[fade-in_0.4s_ease-out]">
            <div className="w-full md:w-1/2 flex items-center justify-center relative">
              <div className="w-64 h-64 relative">
                <Doughnut 
                  data={chartData}
                  options={{
                    cutout: '75%',
                    plugins: { legend: { display: false }, tooltip: { enabled: false } },
                    onClick: (event, elements) => {
                      if (elements.length > 0) {
                        const index = elements[0].index;
                        scrollToCard(sortedBreakdowns[index].id);
                      }
                    }
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[#6B8F71] text-xs font-semibold uppercase tracking-wider">Baseline</span>
                  <span className="font-mono font-bold text-2xl text-[#E8F5E2]">{profile.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col gap-4">
              <h3 className="font-display font-bold text-xl text-[#E8F5E2] mb-2">Category Baseline</h3>
              {sortedBreakdowns.map((b: any) => {
                const pct = Math.round((b.value / profile.total) * 100);
                return (
                  <button 
                    key={b.id}
                    onClick={() => scrollToCard(b.id)}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all text-left border border-transparent hover:border-white/10 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: b.color }} />
                      <span className="font-medium text-[#E8F5E2] group-hover:-translate-y-[1px] transition-transform">{b.category}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-sm text-[#6B8F71]">{b.value.toLocaleString()} kg</span>
                      <span className="font-mono font-bold text-sm" style={{ color: b.color }}>{pct}%</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-4 h-full">
            <DailyActionTracker logs={logs} onSaveLog={saveLog} />
          </div>

          {/* ROW 2: TREND CHART (8) & GOAL SETTER (4) */}
          <div className="lg:col-span-8 h-full flex flex-col">
            <TrendChart logs={logs} />
          </div>
          
          <div className="lg:col-span-4 h-full flex flex-col">
            <GoalSetter 
              annualTotal={profile.total} 
              totalSaved={logs.reduce((sum, l) => sum + (l.netDelta < 0 ? Math.abs(l.netDelta) : 0), 0)}
              savedGoal={goal}
              onSaveGoal={setGoal}
              onGoalCompleted={() => {
                if (!badges.includes('goal_completed')) {
                  setBadges(prev => [...prev, 'goal_completed']);
                }
              }}
            />
          </div>

          {/* ROW 3: EXPLORE REDUCTIONS (8) & AI CHAT (4) */}
          <div className="lg:col-span-8 flex flex-col gap-4 animate-[fade-in_0.5s_ease-out]">
            <h2 className="font-display font-bold text-2xl text-[#E8F5E2] mb-2">Explore Reductions</h2>
            {sortedBreakdowns.map((b: any) => {
              const Icon = categoryIcons[b.id] || Sparkles;
              const isExpanded = expandedCard === b.id;
              const pct = Math.round((b.value / profile.total) * 100);
              
              return (
                <div 
                  key={b.id} 
                  id={`card-${b.id}`}
                  className={`glass-panel rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isExpanded ? 'border-white/30 bg-white/5 shadow-lg' : 'border-white/5 hover:border-white/15 hover:-translate-y-[2px]'
                  }`}
                >
                  <button 
                    onClick={() => setExpandedCard(isExpanded ? null : b.id)}
                    className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 sm:p-6 gap-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-black/20 border border-white/10" style={{ color: b.color }}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="text-left flex flex-col">
                        <span className="font-display font-bold text-lg text-[#E8F5E2]">{b.category}</span>
                        <span className="text-sm font-mono text-[#6B8F71]">{b.value.toLocaleString()} kg CO₂/yr</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="w-32 h-2 bg-black/30 rounded-full overflow-hidden hidden sm:block">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: b.color }} />
                      </div>
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-[#6B8F71]" /> : <ChevronDown className="w-5 h-5 text-[#6B8F71]" />}
                    </div>
                  </button>
                  
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-white/5 bg-black/10">
                      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: b.color }}>Suggested Reductions:</span>
                      <div className="flex flex-col gap-3 mt-4">
                        {categoryTips[b.id].map((tip, idx) => {
                          const isCommitted = committedActions.some(a => a.tipText === tip);
                          return (
                            <div key={idx} className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-black/20 p-4 rounded-xl border border-white/5 hover:border-white/15 transition-colors">
                              <span className="text-sm text-[#E8F5E2] leading-relaxed flex-1">{tip}</span>
                              <button 
                                onClick={() => commitAction(b.id, tip)}
                                disabled={isCommitted}
                                className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                  isCommitted 
                                    ? 'bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/20 opacity-70' 
                                    : 'bg-white/5 text-[#6B8F71] hover:text-[#E8F5E2] hover:bg-white/10 border border-white/5'
                                }`}
                              >
                                {isCommitted ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                                {isCommitted ? 'Committed' : 'Commit to this'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-4 h-full flex flex-col">
            <div className="glass-panel rounded-3xl border border-white/5 flex flex-col h-full min-h-[500px] overflow-hidden animate-[fade-in_1s_ease-out]">
              <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-black/20">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#39FF14] to-[#00E5A0] flex items-center justify-center shadow-[0_0_15px_rgba(57,255,20,0.2)]">
                  <Bot className="w-5 h-5 text-[#0A0F0D]" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-[#E8F5E2]">Ask about your footprint</h3>
                  <p className="text-xs text-[#6B8F71]">Powered by Google Gemini</p>
                </div>
              </div>
              
              <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div 
                      className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-white/10 text-[#E8F5E2] rounded-br-sm' 
                          : 'bg-[#162019] border border-[#39FF14]/20 text-[#E8F5E2] rounded-bl-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-[#162019] border border-[#39FF14]/20 p-4 rounded-2xl rounded-bl-sm flex gap-1.5 items-center h-12">
                      <span className="w-2 h-2 bg-[#39FF14]/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-[#39FF14]/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-[#39FF14]/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                {chatError && (
                  <div className="flex justify-center">
                    <div className="text-xs text-[#FF4D4D] bg-[#FF4D4D]/10 px-3 py-1.5 rounded-lg border border-[#FF4D4D]/20">
                      {chatError}
                      <button onClick={() => setChatError('')} className="ml-2 underline font-bold">Dismiss</button>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-4 border-t border-white/5 bg-black/20 flex flex-col gap-3">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {[
                    "What's my biggest impact area?", 
                    "Am I on track for my goal?", 
                    "What should I log today?"
                  ].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleSendChat(chip)}
                      disabled={isTyping}
                      className="whitespace-nowrap text-xs font-medium text-[#6B8F71] bg-white/5 hover:bg-white/10 hover:text-[#E8F5E2] border border-white/5 rounded-full px-3 py-1.5 transition-all disabled:opacity-50"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
                <div className="relative flex items-center">
                  <input 
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendChat(chatInput)}
                    placeholder="Ask Gemini..."
                    disabled={isTyping}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-[#E8F5E2] focus:outline-none focus:border-[#39FF14]/50 transition-colors disabled:opacity-50"
                  />
                  <button 
                    onClick={() => handleSendChat(chatInput)}
                    disabled={!chatInput.trim() || isTyping}
                    className="absolute right-2 w-8 h-8 flex items-center justify-center text-[#39FF14] disabled:text-[#6B8F71] hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 8. COMPARISON & CONTEXT SECTION */}
          <div className="lg:col-span-12">
            <ComparisonContext annualTotal={adjustedTotal} />
          </div>

          {/* 10. FOOTER ACTIONS */}
          <div className="lg:col-span-12 flex flex-col sm:flex-row w-full gap-4 justify-center animate-[fade-in_1.1s_ease-out] pt-4">
            <button
              onClick={() => router.push('/carbon-lens')}
              className="flex-1 flex items-center justify-center gap-2 bg-[#39FF14] hover:bg-[#2ed60f] text-[#0A0F0D] font-bold px-6 py-4 rounded-xl shadow-[0_0_20px_rgba(57,255,20,0.2)] hover:shadow-[0_0_30px_rgba(57,255,20,0.4)] transition-all font-display max-w-sm mx-auto sm:mx-0"
            >
              <span className="text-lg">📊</span>
              Go to CarbonLens
            </button>
            <button
              onClick={() => router.push('/')}
              className="flex-1 flex items-center justify-center gap-2 bg-transparent hover:bg-white/5 border border-white/20 text-[#E8F5E2] font-bold px-6 py-4 rounded-xl transition-all font-display max-w-sm mx-auto sm:mx-0"
            >
              <Home className="w-5 h-5 text-[#6B8F71]" />
              Back to Home
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}
