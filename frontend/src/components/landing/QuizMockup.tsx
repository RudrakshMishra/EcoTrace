'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Check, ArrowRight, Sparkles, HelpCircle, Flame, Car, Leaf } from 'lucide-react';

const mockSteps = [
  {
    id: 'transport',
    category: 'Commute & Travel',
    question: 'How do you primarily get around?',
    options: [
      { label: '🚗 Petrol Car', impact: '+2,400 kg CO₂/yr', value: 'high' },
      { label: '⚡ Electric Car', impact: '+700 kg CO₂/yr', value: 'med' },
      { label: '🚆 Train User', impact: '+150 kg CO₂/yr', value: 'low' },
    ],
  },
  {
    id: 'diet',
    category: 'Diet & Nutrition',
    question: 'What does your daily diet look like?',
    options: [
      { label: '🥩 Daily Meat', impact: '+3,300 kg CO₂/yr', value: 'high' },
      { label: '🍗 Occasional Meat', impact: '+2,000 kg CO₂/yr', value: 'med' },
      { label: '🌱 Vegan diet', impact: '+700 kg CO₂/yr', value: 'low' },
    ],
  },
  {
    id: 'energy',
    category: 'Home & Energy',
    question: 'What is your primary home energy source?',
    options: [
      { label: '🔥 Coal & Gas Grid', impact: '+3,000 kg CO₂/yr', value: 'high' },
      { label: '⚡ Standard Grid Mix', impact: '+1,500 kg CO₂/yr', value: 'med' },
      { label: '☀️ 100% Green Tariff', impact: '+300 kg CO₂/yr', value: 'low' },
    ],
  },
];

export default function QuizMockup() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (idx: number, impactStr: string) => {
    setSelectedIdx(idx);
    const numericImpact = parseInt(impactStr.replace(/[^\d]/g, ''), 10);
    setScores(prev => ({ ...prev, [mockSteps[currentStep].id]: numericImpact }));
  };

  const handleNext = () => {
    if (selectedIdx === null) return;
    setSelectedIdx(null);
    if (currentStep < mockSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const totalEmissions = Object.values(scores).reduce((a, b) => a + b, 0);

  const resetQuiz = () => {
    setCurrentStep(0);
    setSelectedIdx(null);
    setScores({});
    setShowResult(false);
  };

  return (
    <section className="relative min-h-screen w-full bg-[#0A0F0D] flex flex-col items-center justify-center overflow-hidden py-24 px-6">
      {/* Background gradients */}
      <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#39FF14]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#00E5A0]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
        
        {/* Left Column: Heading and Context */}
        <div className="lg:col-span-5 flex flex-col justify-center text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#39FF14]/10 border border-[#39FF14]/20 rounded-full text-xs font-mono font-bold text-[#39FF14] w-fit mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INTERACTIVE ONBOARDING</span>
          </div>

          <h2 className="font-display font-bold text-4xl md:text-5xl text-[#E8F5E2] mb-6 leading-tight">
            Calculate your carbon baseline in <span className="text-[#00E5A0] text-glow-green">60 seconds.</span>
          </h2>
          <p className="text-[#6B8F71] text-lg mb-8 leading-relaxed">
            Answer a few simple questions about your lifestyle. EcoTrace computes your starting baseline and creates your custom green pathway.
          </p>

          <div className="flex flex-col gap-4 text-[#E8F5E2] font-semibold mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#39FF14]">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-sm">Instant category comparison</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#39FF14]">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-sm">Personalized daily habits board generation</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Flip Card Quiz Mockup */}
        <div className="lg:col-span-7 flex justify-center items-center">
          <div className="relative w-full max-w-md h-[460px] perspective-1000">
            <AnimatePresence mode="wait">
              {!showResult ? (
                <motion.div
                  key={currentStep}
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: -90, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full liquid-glass rounded-3xl border border-white/10 p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                >
                  {/* Subtle Card Background Glow */}
                  <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#39FF14]/10 rounded-full blur-2xl pointer-events-none" />
                  
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-mono text-xs font-bold text-[#39FF14] uppercase tracking-wider">
                        {mockSteps[currentStep].category}
                      </span>
                      <span className="font-mono text-xs text-gray-500 font-bold">
                        {currentStep + 1} / {mockSteps.length}
                      </span>
                    </div>

                    {/* Question */}
                    <h3 className="font-display font-bold text-xl md:text-2xl text-[#E8F5E2] mb-6 leading-tight">
                      {mockSteps[currentStep].question}
                    </h3>

                    {/* Options list */}
                    <div className="flex flex-col gap-3">
                      {mockSteps[currentStep].options.map((opt, idx) => {
                        const selected = selectedIdx === idx;
                        return (
                          <button
                            key={idx}
                            onClick={() => handleSelect(idx, opt.impact)}
                            className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center justify-between group cursor-pointer ${
                              selected
                                ? 'border-[#39FF14] bg-[#39FF14]/10 text-white'
                                : 'border-white/5 bg-white/5 text-gray-300 hover:border-white/20 hover:bg-white/10'
                            }`}
                          >
                            <span className="font-semibold text-sm">{opt.label}</span>
                            <span className={`font-mono text-xs font-bold transition-colors ${
                              selected ? 'text-[#39FF14]' : 'text-gray-500 group-hover:text-gray-400'
                            }`}>
                              {opt.impact}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleNext}
                      disabled={selectedIdx === null}
                      className={`px-6 py-3 rounded-xl font-display font-bold text-xs tracking-wider flex items-center gap-2 transition-all ${
                        selectedIdx !== null
                          ? 'bg-[#39FF14] text-[#0A0F0D] shadow-[0_0_15px_rgba(57,255,20,0.3)] cursor-pointer'
                          : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
                      }`}
                    >
                      <span>{currentStep === mockSteps.length - 1 ? 'Show Score' : 'Next Question'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full liquid-glass rounded-3xl border border-[#39FF14]/30 p-8 flex flex-col justify-between items-center text-center shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#00E5A0]/10 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="w-full">
                    {/* Header */}
                    <div className="flex items-center justify-center gap-2 mb-6">
                      <Leaf className="w-4 h-4 text-[#39FF14]" />
                      <span className="font-mono text-xs font-bold text-[#39FF14] uppercase tracking-widest">
                        Assessment Complete
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-2xl text-[#E8F5E2] mb-2">
                      Your Projected Baseline
                    </h3>
                    <p className="text-sm text-[#6B8F71] mb-6">
                      Based on your preliminary answers
                    </p>

                    {/* Score display */}
                    <div className="bg-[#111A14]/80 border border-white/5 rounded-2xl py-6 px-4 mb-6 relative">
                      <div className="font-mono text-4xl font-extrabold text-[#39FF14] text-glow-lime mb-1">
                        {(totalEmissions / 1000).toFixed(1)}t
                      </div>
                      <div className="text-[10px] uppercase font-mono tracking-widest text-[#6B8F71]">
                        CO₂ Equivalent / Year
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 leading-relaxed px-4">
                      That&apos;s about <span className="text-[#FFB830] font-bold">{(totalEmissions / 4700).toFixed(1)}x</span> the sustainable global targets. Let&apos;s map out your reduction strategy.
                    </p>
                  </div>

                  <div className="w-full flex gap-3 mt-6">
                    <button
                      onClick={resetQuiz}
                      className="flex-1 py-3 border border-white/10 rounded-xl text-xs font-semibold text-gray-300 hover:bg-white/5 transition-all cursor-pointer"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={resetQuiz}
                      className="flex-1 py-3 bg-[#39FF14] text-[#0A0F0D] font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:shadow-[0_0_25px_rgba(57,255,20,0.5)] transition-all cursor-pointer"
                    >
                      Build Dashboard
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
}
