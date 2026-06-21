import React from 'react';
import { TreePine, CarFront, Smartphone, Globe2 } from 'lucide-react';

interface ComparisonContextProps {
  annualTotal: number; // in kg
}

export default function ComparisonContext({ annualTotal }: ComparisonContextProps) {
  // Equivalency calculations
  const treesNeeded = Math.round(annualTotal / 21); // 1 tree ~ 21kg/yr
  const kmDriven = Math.round(annualTotal / 0.2); // ~0.2 kg per km
  const phoneCharges = Math.round(annualTotal / 0.008); // ~0.008 kg per charge
  
  // Fake percentile banding logic
  const globalAvg = 4700;
  let percentileMsg = '';
  let isGood = false;
  
  if (annualTotal < globalAvg * 0.5) {
    percentileMsg = "Top 10% lowest emitters";
    isGood = true;
  } else if (annualTotal < globalAvg * 0.8) {
    percentileMsg = "Top 30% lowest emitters";
    isGood = true;
  } else if (annualTotal <= globalAvg) {
    percentileMsg = "Below global average";
    isGood = true;
  } else if (annualTotal < globalAvg * 1.5) {
    percentileMsg = "Top 40% highest emitters";
    isGood = false;
  } else {
    percentileMsg = "Top 15% highest emitters";
    isGood = false;
  }

  return (
    <div className="flex flex-col gap-4 animate-[fade-in_0.9s_ease-out]">
      <h2 className="font-display font-bold text-2xl text-[#E8F5E2]">Real World Impact</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col items-center text-center gap-3 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-full bg-[#39FF14]/10 flex items-center justify-center">
            <TreePine className="w-6 h-6 text-[#39FF14]" />
          </div>
          <p className="text-sm text-[#6B8F71] leading-tight">Trees needed to offset annually</p>
          <span className="font-mono text-2xl font-bold text-[#E8F5E2]">{treesNeeded.toLocaleString()}</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col items-center text-center gap-3 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-full bg-[#00E5A0]/10 flex items-center justify-center">
            <CarFront className="w-6 h-6 text-[#00E5A0]" />
          </div>
          <p className="text-sm text-[#6B8F71] leading-tight">Equivalent km driven in a car</p>
          <span className="font-mono text-2xl font-bold text-[#E8F5E2]">{kmDriven.toLocaleString()}</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col items-center text-center gap-3 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-full bg-[#FFB830]/10 flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-[#FFB830]" />
          </div>
          <p className="text-sm text-[#6B8F71] leading-tight">Smartphone charges equivalent</p>
          <span className="font-mono text-2xl font-bold text-[#E8F5E2]">{phoneCharges.toLocaleString()}</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col items-center text-center gap-3 hover:-translate-y-1 transition-transform relative overflow-hidden">
          {isGood && <div className="absolute inset-0 bg-gradient-to-t from-[#39FF14]/5 to-transparent pointer-events-none" />}
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isGood ? 'bg-[#39FF14]/10' : 'bg-[#FF4D4D]/10'}`}>
            <Globe2 className={`w-6 h-6 ${isGood ? 'text-[#39FF14]' : 'text-[#FF4D4D]'}`} />
          </div>
          <p className="text-sm text-[#6B8F71] leading-tight">Estimated global banding</p>
          <span className={`font-mono text-lg font-bold ${isGood ? 'text-[#39FF14]' : 'text-[#FF4D4D]'}`}>
            {percentileMsg}
          </span>
          <span className="text-[10px] text-[#6B8F71]/60 absolute bottom-2">*illustrative estimate</span>
        </div>
      </div>
    </div>
  );
}
