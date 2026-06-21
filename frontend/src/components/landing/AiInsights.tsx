'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, Cpu, MessageSquare, ArrowRight, CornerDownRight, CheckCircle2 } from 'lucide-react';

interface InsightCard {
  id: number;
  title: string;
  category: string;
  saving: string;
  impactColor: string;
  glowColor: string;
  text: string;
  metric: string;
}

const insights: InsightCard[] = [
  {
    id: 1,
    category: 'Thermostat Adjuster',
    title: 'Smart Winter Shift',
    saving: '-120 kg CO₂ / yr',
    impactColor: '#FFB830',
    glowColor: 'rgba(255, 184, 48, 0.15)',
    text: 'Lowering your heating by just 2°C during winter months reduces thermal loading significantly, reducing grid dependency.',
    metric: 'Equivalent to 6 mature trees'
  },
  {
    id: 2,
    category: 'Transit Advisor',
    title: 'Subway Over Sedans',
    saving: '-350 kg CO₂ / mo',
    impactColor: '#39FF14',
    glowColor: 'rgba(57, 255, 20, 0.15)',
    text: 'Using the regional metro rail network rather than a single-occupancy petrol vehicle saves fuel consumption and traffic idle emissions.',
    metric: 'Equivalent to 16 trees / month'
  },
  {
    id: 3,
    category: 'Procurement Filter',
    title: 'Local Seasonals First',
    saving: '-85% Food Miles',
    impactColor: '#00E5A0',
    glowColor: 'rgba(0, 229, 160, 0.15)',
    text: 'Sourcing apples and root vegetables locally during autumn rather than buying imported berries avoids heavy aviation cargo freight.',
    metric: 'Reduces food miles by 6,200km'
  }
];

export default function AiInsights() {
  const [promptInput, setPromptInput] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAiQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    setLoading(true);
    setAiResponse(null);

    // Mock an AI generation response delay
    setTimeout(() => {
      setLoading(false);
      if (promptInput.toLowerCase().includes('flight') || promptInput.toLowerCase().includes('fly')) {
        setAiResponse("✈️ Flying emits roughly 90g of CO₂ per passenger-kilometer compared to only 14g for trains. For your next trip, booking a high-speed train instead of a short flight will save approximately 180kg of carbon emissions.");
      } else if (promptInput.toLowerCase().includes('meat') || promptInput.toLowerCase().includes('beef') || promptInput.toLowerCase().includes('food')) {
        setAiResponse("🥩 Beef has a carbon footprint of ~27kg of CO₂ per kg produced, while plant-based proteins like lentils emit less than 0.9kg. Replacing two beef meals a week with plant alternatives saves ~330kg of carbon annually.");
      } else {
        setAiResponse("💡 EcoTrace AI Recommendation: Consolidating shipping orders into single monthly deliveries instead of multiple standard weekly orders reduces delivery route packaging and parcel carrier courier miles by 65%.");
      }
    }, 1500);
  };

  return (
    <section className="relative min-h-screen w-full bg-[#0A0F0D] flex flex-col items-center justify-center overflow-hidden py-32 px-6">
      {/* Background neon glows */}
      <div className="absolute top-[10%] left-[10%] w-[45%] h-[45%] rounded-full bg-[#39FF14]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[45%] h-[45%] rounded-full bg-[#00E5A0]/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 max-w-3xl mb-24"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FFB830]/10 border border-[#FFB830]/20 rounded-full text-xs font-mono font-bold text-[#FFB830] mb-6">
          <Brain className="w-3.5 h-3.5" />
          <span>NEURAL INSIGHT GENERATOR</span>
        </div>
        <h2 className="font-display font-bold text-4xl md:text-5xl text-[#E8F5E2] mb-6">
          Personalized AI coaching. <span className="text-[#00E5A0] text-glow-green">Tailored for you.</span>
        </h2>
        <p className="text-[#6B8F71] text-base md:text-lg leading-relaxed">
          Our intelligent models scan your logged habits, identify high-impact segments, and propose precise, actionable pathways to offset.
        </p>
      </motion.div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start z-10">
        
        {/* Left Column: 3D Perspective Cards - Span 7 */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 perspective-1000">
          {insights.map((insight, idx) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, rotateY: idx % 2 === 0 ? -15 : 15, y: 50 }}
              whileInView={{ opacity: 1, rotateY: 0, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ 
                scale: 1.03, 
                rotateX: 4, 
                rotateY: -4,
                boxShadow: `0 20px 40px -15px ${insight.impactColor}25`
              }}
              transition={{ type: 'spring', stiffness: 150, damping: 20 }}
              className={`liquid-glass border border-white/10 p-6 rounded-3xl flex flex-col justify-between min-h-[300px] shadow-2xl relative overflow-hidden cursor-pointer ${
                idx === 2 ? 'sm:col-span-2' : ''
              }`}
            >
              {/* Backglow element */}
              <div 
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-40 transition-all group-hover:scale-120"
                style={{ backgroundColor: insight.impactColor }}
              />

              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="font-mono text-2xs text-[#6B8F71] uppercase tracking-wider font-bold">
                    {insight.category}
                  </span>
                  <div 
                    className="font-mono text-xs font-bold px-2.5 py-1 rounded-full border"
                    style={{ 
                      color: insight.impactColor, 
                      borderColor: `${insight.impactColor}40`,
                      backgroundColor: `${insight.impactColor}10`
                    }}
                  >
                    {insight.saving}
                  </div>
                </div>

                <h3 className="font-display font-bold text-lg text-white mb-3 leading-snug">
                  {insight.title}
                </h3>
                
                <p className="text-xs text-gray-300 leading-relaxed">
                  {insight.text}
                </p>
              </div>

              <div className="mt-6 border-t border-white/5 pt-4 flex items-center gap-2 text-2xs font-mono font-bold text-[#6B8F71]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#39FF14]" />
                <span>{insight.metric}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right Column: Mini Interactive Input Interface - Span 5 */}
        <div className="lg:col-span-5 bg-white/5 border border-white/5 rounded-3xl p-8 shadow-2xl relative flex flex-col justify-between min-h-[440px]">
          
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Cpu className="w-4 h-4 text-[#39FF14]" />
              <span className="font-mono text-xs font-bold text-[#39FF14] uppercase tracking-widest">
                EcoTrace Neural-Core
              </span>
            </div>

            <h3 className="font-display font-bold text-xl text-[#E8F5E2] mb-4">
              Ask your carbon coach
            </h3>

            <form onSubmit={handleAiQuery} className="flex flex-col gap-3">
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="e.g. How much CO2 does driving electric save?"
                className="bg-[#162019] border border-white/5 rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:border-[#39FF14] text-[#E8F5E2] placeholder-gray-500"
              />
              <button
                type="submit"
                disabled={loading || !promptInput.trim()}
                className="bg-[#39FF14] hover:bg-[#2ed60f] text-[#0A0F0D] font-bold text-xs py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(57,255,20,0.15)] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Generate Insight</span>
                <MessageSquare className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          <div className="mt-8 border-t border-white/5 pt-6 flex-1 flex flex-col justify-center min-h-[140px]">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center text-center py-4"
                >
                  <div className="w-5 h-5 rounded-full border-2 border-[#39FF14] border-t-transparent animate-spin mb-2" />
                  <span className="font-mono text-3xs uppercase tracking-widest text-[#6B8F71] font-bold">Scanning parameters...</span>
                </motion.div>
              ) : aiResponse ? (
                <motion.div
                  key="response"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-[#111A14]/85 border border-[#39FF14]/20 rounded-2xl p-4 flex flex-col gap-2 shadow-inner"
                >
                  <div className="flex items-center gap-1.5 text-2xs text-[#39FF14] font-mono font-bold uppercase">
                    <Sparkles className="w-3 h-3" />
                    <span>Response</span>
                  </div>
                  <p className="text-2xs text-gray-300 leading-relaxed font-medium">
                    {aiResponse}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center text-center text-gray-500 py-4"
                >
                  <CornerDownRight className="w-5 h-5 text-gray-600 mb-2" />
                  <span className="text-2xs font-semibold max-w-[200px]">Type a query above to test the carbon neural assistant.</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
