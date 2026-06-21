'use client';

import { motion } from 'framer-motion';
import { LayoutDashboard, TrendingDown, Target, Award, PieChart } from 'lucide-react';

export default function DashboardMockup() {
  return (
    <section className="relative min-h-screen w-full bg-[#0A0F0D] flex flex-col items-center justify-center overflow-hidden py-32 px-6">
      {/* Background radial glows */}
      <div className="absolute top-[30%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#00E5A0]/5 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#39FF14]/5 blur-[130px] pointer-events-none" />

      {/* Narrative Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 max-w-3xl mb-20"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#00E5A0]/10 border border-[#00E5A0]/20 rounded-full text-xs font-mono font-bold text-[#00E5A0] mb-6">
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>CENTRAL INTELLIGENCE HUBS</span>
        </div>
        <h2 className="font-display font-bold text-4xl md:text-5xl text-[#E8F5E2] mb-6">
          Manage your path in a <span className="text-[#39FF14] text-glow-lime">single dashboard.</span>
        </h2>
        <p className="text-[#6B8F71] text-base md:text-lg leading-relaxed mb-8">
          Deep analytics, category-by-category drilldowns, and progress insights built using clean, ultra-responsive glass interfaces.
        </p>
        
        {/* Added Feature Highlights to fill the empty space */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="glass-panel p-5 rounded-2xl border border-white/5">
            <h4 className="font-display font-bold text-sm text-[#E8F5E2] mb-2 text-[#39FF14]">Real-time Tracking</h4>
            <p className="text-xs text-[#6B8F71] leading-relaxed">Watch your carbon footprint adjust instantly as you log daily habits and lifestyle changes.</p>
          </div>
          <div className="glass-panel p-5 rounded-2xl border border-white/5">
            <h4 className="font-display font-bold text-sm text-[#E8F5E2] mb-2 text-[#00E5A0]">Smart Insights</h4>
            <p className="text-xs text-[#6B8F71] leading-relaxed">AI-driven recommendations pinpoint exactly where you can make the biggest environmental impact.</p>
          </div>
          <div className="glass-panel p-5 rounded-2xl border border-white/5">
            <h4 className="font-display font-bold text-sm text-[#E8F5E2] mb-2 text-[#FFB830]">Goal Management</h4>
            <p className="text-xs text-[#6B8F71] leading-relaxed">Set monthly reduction targets and track your progress with clear, motivating visual indicators.</p>
          </div>
        </div>
      </motion.div>

      {/* Floating Dashboard Mockup Grid */}
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 z-10">
        
        {/* Card 1: Carbon breakdown (Pie / Donut) - Span 5 */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-5 liquid-glass rounded-3xl border border-white/10 p-6 flex flex-col justify-between shadow-xl min-h-[340px]"
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                <PieChart className="w-4 h-4 text-[#00E5A0]" />
                Emissions Breakdown
              </h3>
              <span className="font-mono text-xs text-[#6B8F71] font-bold">Monthly View</span>
            </div>
            
            {/* Mock Donut Chart */}
            <div className="flex items-center justify-center py-6 relative">
              <svg className="w-36 h-36 transform -rotate-90">
                <circle cx="72" cy="72" r="60" className="stroke-white/5 fill-transparent" strokeWidth="12" />
                {/* Transport Segment - 45% */}
                <motion.circle 
                  cx="72" cy="72" r="60" 
                  className="stroke-[#FF4D4D] fill-transparent" 
                  strokeWidth="12" 
                  strokeDasharray="377"
                  initial={{ strokeDashoffset: 377 }}
                  whileInView={{ strokeDashoffset: 377 * (1 - 0.45) }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                />
                {/* Diet Segment - 25% */}
                <motion.circle 
                  cx="72" cy="72" r="60" 
                  className="stroke-[#FFB830] fill-transparent" 
                  strokeWidth="12" 
                  strokeDasharray="377"
                  initial={{ strokeDashoffset: 377 }}
                  whileInView={{ strokeDashoffset: 377 * (1 - 0.25) }}
                  viewport={{ once: true }}
                  style={{ transformOrigin: '72px 72px', rotate: '162deg' }}
                  transition={{ duration: 1.2, delay: 0.7, ease: "easeOut" }}
                />
                {/* Energy Segment - 20% */}
                <motion.circle 
                  cx="72" cy="72" r="60" 
                  className="stroke-[#39FF14] fill-transparent" 
                  strokeWidth="12" 
                  strokeDasharray="377"
                  initial={{ strokeDashoffset: 377 }}
                  whileInView={{ strokeDashoffset: 377 * (1 - 0.2) }}
                  viewport={{ once: true }}
                  style={{ transformOrigin: '72px 72px', rotate: '252deg' }}
                  transition={{ duration: 1.0, delay: 0.9, ease: "easeOut" }}
                />
                {/* Shopping Segment - 10% */}
                <motion.circle 
                  cx="72" cy="72" r="60" 
                  className="stroke-[#00E5A0] fill-transparent" 
                  strokeWidth="12" 
                  strokeDasharray="377"
                  initial={{ strokeDashoffset: 377 }}
                  whileInView={{ strokeDashoffset: 377 * (1 - 0.1) }}
                  viewport={{ once: true }}
                  style={{ transformOrigin: '72px 72px', rotate: '324deg' }}
                  transition={{ duration: 0.8, delay: 1.1, ease: "easeOut" }}
                />
              </svg>

              {/* Inside details */}
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="font-mono text-xl font-bold text-white">4.1t</span>
                <span className="text-[9px] uppercase tracking-wider text-[#6B8F71] font-bold">Total YTD</span>
              </div>
            </div>
          </div>

          {/* Chart Legend */}
          <div className="grid grid-cols-4 gap-2 border-t border-white/5 pt-4 text-center">
            <div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#FF4D4D] mx-auto mb-1" />
              <div className="text-[10px] text-gray-400 font-bold">Travel (45%)</div>
            </div>
            <div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#FFB830] mx-auto mb-1" />
              <div className="text-[10px] text-gray-400 font-bold">Diet (25%)</div>
            </div>
            <div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#39FF14] mx-auto mb-1" />
              <div className="text-[10px] text-gray-400 font-bold">Grid (20%)</div>
            </div>
            <div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#00E5A0] mx-auto mb-1" />
              <div className="text-[10px] text-gray-400 font-bold">Shop (10%)</div>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Carbon Weekly Trend - Span 7 */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-7 liquid-glass rounded-3xl border border-white/10 p-6 flex flex-col justify-between shadow-xl min-h-[340px]"
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-[#39FF14]" />
                Reduction Trend
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-[#39FF14] bg-[#39FF14]/10 border border-[#39FF14]/20 px-2 py-0.5 rounded-full font-mono font-bold">
                <span>-18.4%</span>
              </div>
            </div>

            {/* Neon line chart SVG drawing itself */}
            <div className="w-full h-40 relative mt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120" preserveAspectRatio="none">
                {/* Horizontal grid lines */}
                <line x1="0" y1="20" x2="400" y2="20" className="stroke-white/5" strokeWidth="1" />
                <line x1="0" y1="60" x2="400" y2="60" className="stroke-white/5" strokeWidth="1" />
                <line x1="0" y1="100" x2="400" y2="100" className="stroke-white/5" strokeWidth="1" />

                {/* Animated Trend Line */}
                <motion.path
                  d="M0 80 Q 80 90, 140 50 T 260 40 T 400 20"
                  fill="none"
                  className="stroke-[#39FF14]"
                  strokeWidth="3.5"
                  style={{ filter: 'drop-shadow(0px 0px 8px rgba(57, 255, 20, 0.4))' }}
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.8, delay: 0.6, ease: "easeInOut" }}
                />
                
                {/* Grid Dots */}
                <circle cx="140" cy="50" r="4" className="fill-[#39FF14] stroke-[#0A0F0D]" strokeWidth="2" />
                <circle cx="260" cy="40" r="4" className="fill-[#39FF14] stroke-[#0A0F0D]" strokeWidth="2" />
                <circle cx="400" cy="20" r="5" className="fill-[#00E5A0] stroke-[#0A0F0D]" strokeWidth="2" />
              </svg>
            </div>
          </div>

          <div className="flex justify-between font-mono text-[10px] text-[#6B8F71] font-bold pt-4 border-t border-white/5">
            <span>Week 1</span>
            <span>Week 2</span>
            <span>Week 3</span>
            <span>Week 4 (Current)</span>
          </div>
        </motion.div>

        {/* Card 3: Goals & Active targets - Span 6 */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="lg:col-span-6 liquid-glass rounded-3xl border border-white/10 p-6 flex flex-col justify-between shadow-xl min-h-[260px]"
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-[#FFB830]" />
                Active Goals
              </h3>
              <span className="font-mono text-xs text-[#FFB830] font-bold">2 in progress</span>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-200 mb-1.5">
                  <span>Switch to Renewable Tariff</span>
                  <span className="font-mono text-[#39FF14]">-300kg Target</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '80%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.0, delay: 0.5 }}
                    className="bg-[#39FF14] h-full"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-200 mb-1.5">
                  <span>Meatless Week Commenced</span>
                  <span className="font-mono text-[#00E5A0]">-60kg Target</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '45%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.0, delay: 0.7 }}
                    className="bg-[#00E5A0] h-full"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-[10px] text-[#6B8F71] font-semibold mt-4">
            *Completing these drops your carbon orb impact rank to Green (Excellent).
          </div>
        </motion.div>

        {/* Card 4: Milestones & Badges - Span 6 */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="lg:col-span-6 liquid-glass rounded-3xl border border-white/10 p-6 flex flex-col justify-between shadow-xl min-h-[260px]"
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-[#FFB830]" />
                Recent Achievements
              </h3>
              <span className="font-mono text-xs text-[#39FF14] font-bold">Level 4</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/5 border border-white/5 rounded-xl p-3.5 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-[#39FF14]/10 border border-[#39FF14]/20 flex items-center justify-center text-[#39FF14] mb-2 font-bold text-sm">
                  🌱
                </div>
                <span className="font-semibold text-2xs text-gray-200">First Step</span>
                <span className="text-[9px] text-[#6B8F71] mt-0.5 font-bold">Quiz Done</span>
              </div>

              <div className="bg-white/5 border border-white/5 rounded-xl p-3.5 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-[#00E5A0]/10 border border-[#00E5A0]/20 flex items-center justify-center text-[#00E5A0] mb-2 font-bold text-sm animate-pulse">
                  🚲
                </div>
                <span className="font-semibold text-2xs text-gray-200">Eco Rider</span>
                <span className="text-[9px] text-[#6B8F71] mt-0.5 font-bold">5 Days Commute</span>
              </div>

              <div className="bg-white/5 border border-white/5 rounded-xl p-3.5 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-[#FFB830]/10 border border-[#FFB830]/20 flex items-center justify-center text-[#FFB830] mb-2 font-bold text-sm">
                  ☀️
                </div>
                <span className="font-semibold text-2xs text-gray-200">Solar Power</span>
                <span className="text-[9px] text-[#6B8F71] mt-0.5 font-bold">Clean Energy</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-glow-lime text-[#39FF14] text-xs font-bold font-mono tracking-wide mt-4 cursor-pointer hover:underline">
            <span>View all 24 achievements</span>
            <span>→</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
