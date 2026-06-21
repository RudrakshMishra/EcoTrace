'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, Loader2, Sparkles, RefreshCcw, Home } from 'lucide-react';
import Navbar from '../../components/Navbar';
import confetti from 'canvas-confetti';

interface QuizStep {
  id: string;
  category: string;
  question: string;
  color: string;
  options: Array<{
    value: string;
    label: string;
    description: string;
    impact: string;
    numericImpact: number;
  }>;
}

const quizSteps: QuizStep[] = [
  {
    id: 'transport',
    category: 'Commute & Travel',
    question: 'How do you primarily get around?',
    color: '#39FF14', // Lime
    options: [
      { value: 'car_petrol', label: '🚗 Petrol Car', description: 'Avg 10k km/year', impact: '+2,400 kg CO₂/yr', numericImpact: 2400 },
      { value: 'car_diesel', label: '🚙 Diesel Car', description: 'Avg 10k km/year', impact: '+2,200 kg CO₂/yr', numericImpact: 2200 },
      { value: 'car_electric', label: '⚡ Electric Car', description: 'Charged via standard grid', impact: '+700 kg CO₂/yr', numericImpact: 700 },
      { value: 'bus', label: '🚌 Bus User', description: 'Regular public transit commuter', impact: '+500 kg CO₂/yr', numericImpact: 500 },
      { value: 'train', label: '🚆 Train User', description: 'Commute primarily by rail systems', impact: '+150 kg CO₂/yr', numericImpact: 150 },
      { value: 'bike_walk', label: '🚲 Cycle & Walk', description: 'Zero emissions, human powered', impact: '0 kg CO₂/yr', numericImpact: 0 },
    ],
  },
  {
    id: 'diet',
    category: 'Diet & Nutrition',
    question: 'What does your daily diet look like?',
    color: '#FFB830', // Amber
    options: [
      { value: 'meat_daily', label: '🥩 Daily Meat', description: 'Red meat or poultry every day', impact: '+3,300 kg CO₂/yr', numericImpact: 3300 },
      { value: 'meat_occasional', label: '🍗 Occasional Meat', description: 'Meat 3-4 times a week', impact: '+2,000 kg CO₂/yr', numericImpact: 2000 },
      { value: 'pescatarian', label: '🐟 Pescatarian', description: 'Fish and dairy, no other meat', impact: '+1,400 kg CO₂/yr', numericImpact: 1400 },
      { value: 'vegetarian', label: '🧀 Vegetarian', description: 'Eggs, cheese, no meat or fish', impact: '+1,100 kg CO₂/yr', numericImpact: 1100 },
      { value: 'vegan', label: '🌱 Vegan', description: 'Strictly plant-based products', impact: '+700 kg CO₂/yr', numericImpact: 700 },
    ],
  },
  {
    id: 'home',
    category: 'Home & Energy',
    question: 'What is the primary energy source of your home?',
    color: '#00E5A0', // Teal
    options: [
      { value: 'coal_gas', label: '🔥 Coal & Gas', description: 'Grid energy backed by fossil fuels', impact: '+3,000 kg CO₂/yr', numericImpact: 3000 },
      { value: 'mixed', label: '⚡ Standard Grid Mix', description: 'Mix of coal, gas, and green sources', impact: '+1,500 kg CO₂/yr', numericImpact: 1500 },
      { value: 'renewable', label: '☀️ 100% Green Tariff', description: 'Powered by solar, wind, or hydro', impact: '+300 kg CO₂/yr', numericImpact: 300 },
    ],
  },
  {
    id: 'flights_shopping',
    category: 'Flights & Consumption',
    question: 'What fits your flying and shopping habits best?',
    color: '#FF4D4D', // Red
    options: [
      { value: 'high_shop_flights', label: '✈️ High Flyer', description: '5+ flights/year, shopping daily', impact: '+6,200 kg CO₂/yr', numericImpact: 6200 },
      { value: 'med_shop_flights', label: '🛍️ Regular Shopper', description: '3-5 flights/year, shopping weekly', impact: '+3,300 kg CO₂/yr', numericImpact: 3300 },
      { value: 'low_shop_flights', label: '🌱 Eco Conscious', description: '1-2 flights/year, shopping monthly', impact: '+1,300 kg CO₂/yr', numericImpact: 1300 },
      { value: 'minimal_shop_flights', label: '🌳 Minimalist', description: '0 flights/year, shopping rarely', impact: '+100 kg CO₂/yr', numericImpact: 100 },
    ],
  },
];

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

export default function QuizPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [calculating, setCalculating] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [resultData, setResultData] = useState<any>(null);

  const handleSelectOption = (stepId: string, optionValue: string) => {
    const newAnswers = { ...answers, [stepId]: optionValue };
    setAnswers(newAnswers);

    // Auto-advance if it's the last step
    if (stepId === 'flights_shopping') {
      triggerCalculation(newAnswers);
    }
  };

  const handleNext = () => {
    if (currentStep < quizSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const triggerCalculation = (finalAnswers: Record<string, string>) => {
    setCalculating(true);
    
    // Simulate calculating animation
    setTimeout(() => {
      let total = 0;
      const breakdowns: Array<{ category: string, id: string, value: number, color: string }> = [];

      quizSteps.forEach(step => {
        const selectedValue = finalAnswers[step.id];
        const option = step.options.find(o => o.value === selectedValue);
        if (option) {
          total += option.numericImpact;
          breakdowns.push({
            id: step.id,
            category: step.category,
            value: option.numericImpact,
            color: step.color
          });
        }
      });

      const resultPayload = { total, answers: finalAnswers, breakdowns };
      setResultData(resultPayload);
      localStorage.setItem('ecotrace_profile', JSON.stringify(resultPayload));

      setCalculating(false);

      // Confetti explosion
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#39FF14', '#00E5A0', '#E8F5E2']
      });

      // Redirect to dashboard after a brief delay
      setTimeout(() => router.push('/dashboard'), 1000);
    }, 1500);
  };

  const handleRetake = () => {
    setReveal(false);
    setAnswers({});
    setCurrentStep(0);
    setResultData(null);
  };

  const currentStepData = quizSteps[currentStep];
  const isSelected = (value: string) => answers[currentStepData.id] === value;
  const progressPercent = ((currentStep + 1) / quizSteps.length) * 100;

  return (
    <main className="min-h-screen bg-[#0A0F0D] flex flex-col justify-between">
      <Navbar />

      {calculating ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 pt-24 animate-pulse">
          <Loader2 className="w-12 h-12 text-[#39FF14] animate-spin mb-4" />
          <h2 className="font-display font-bold text-2xl text-[#E8F5E2] mb-2">Analyzing Choices...</h2>
          <p className="text-[#6B8F71] text-sm">Computing baseline carbon weights across categories</p>
        </div>
      ) : (
        <div className="flex-1 max-w-4xl mx-auto w-full pt-28 pb-12 px-6 flex flex-col justify-between">
          <div>
            {/* Top Progress Bar */}
            <div className="w-full bg-[#162019] h-2 rounded-full overflow-hidden mb-8 border border-white/5">
              <div
                className="bg-gradient-to-r from-[#39FF14] to-[#00E5A0] h-full transition-all duration-300 shadow-[0_0_10px_rgba(57,255,20,0.4)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Step Header */}
            <div className="mb-8">
              <span className="font-mono text-xs font-bold uppercase tracking-widest bg-opacity-10 border px-3 py-1 rounded-full"
                style={{ color: currentStepData.color, backgroundColor: `${currentStepData.color}1A`, borderColor: `${currentStepData.color}33` }}>
                Category {currentStep + 1} of {quizSteps.length}: {currentStepData.category}
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#E8F5E2] mt-4">
                {currentStepData.question}
              </h2>
            </div>

            {/* Options Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentStepData.options.map((option) => {
                const selected = isSelected(option.value);
                return (
                  <div
                    key={option.value}
                    onClick={() => handleSelectOption(currentStepData.id, option.value)}
                    className={`glass-panel p-5 rounded-2xl border transition-all cursor-pointer select-none flex flex-col justify-between min-h-[120px] ${
                      selected
                        ? 'bg-opacity-5 shadow-lg'
                        : 'border-white/5 hover:bg-white/5'
                    }`}
                    style={selected ? { borderColor: currentStepData.color, backgroundColor: `${currentStepData.color}0D`, boxShadow: `0 0 20px ${currentStepData.color}1A` } : {}}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-display font-bold text-lg text-[#E8F5E2]">{option.label}</h3>
                        <p className="text-xs text-[#6B8F71] mt-1">{option.description}</p>
                      </div>
                      {selected && (
                        <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: currentStepData.color }}>
                          <Check className="w-3.5 h-3.5 text-[#0A0F0D] stroke-[3.5]" />
                        </div>
                      )}
                    </div>
                    <div className="font-mono text-xs font-bold mt-4" style={{ color: currentStepData.color }}>
                      Est. Impact: {option.impact}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between border-t border-white/5 mt-10 pt-6">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 text-sm font-semibold py-2.5 px-6 rounded-xl border border-white/5 transition-all ${
                currentStep === 0
                  ? 'opacity-30 cursor-not-allowed text-[#6B8F71]'
                  : 'bg-white/5 text-[#E8F5E2] hover:bg-white/10 cursor-pointer'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            {currentStep < quizSteps.length - 1 && (
              <button
                onClick={handleNext}
                disabled={!answers[currentStepData.id]}
                className={`flex items-center gap-2 text-sm font-bold py-2.5 px-6 rounded-xl font-display transition-all ${
                  answers[currentStepData.id]
                    ? 'bg-[#39FF14] text-[#0A0F0D] shadow-[0_0_15px_rgba(57,255,20,0.2)] hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] cursor-pointer'
                    : 'bg-[#162019] text-[#6B8F71] cursor-not-allowed border border-white/5'
                }`}
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
