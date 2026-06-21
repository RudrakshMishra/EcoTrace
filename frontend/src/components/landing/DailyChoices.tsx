'use client';

import { motion } from 'framer-motion';
import { Car, Plane, ShoppingBag, Zap, Utensils } from 'lucide-react';
import { useState } from 'react';

const choices = [
  { id: 1, name: 'Driving Alone', icon: Car, co2: '+2.1kg', color: '#FF4D4D', delay: 0.1, yOffset: -50, xOffset: -150 },
  { id: 2, name: 'Red Meat', icon: Utensils, co2: '+3.3kg', color: '#FFB830', delay: 0.3, yOffset: 50, xOffset: -300 },
  { id: 3, name: 'Long-haul Flight', icon: Plane, co2: '+900kg', color: '#FF4D4D', delay: 0.5, yOffset: -100, xOffset: 150 },
  { id: 4, name: 'Online Shopping', icon: ShoppingBag, co2: '+0.8kg', color: '#39FF14', delay: 0.2, yOffset: 80, xOffset: 250 },
  { id: 5, name: 'Electricity', icon: Zap, co2: '+1.5kg', color: '#00E5A0', delay: 0.4, yOffset: 10, xOffset: 0 },
];

export default function DailyChoices() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section className="relative min-h-screen w-full bg-[#0A0F0D] flex flex-col items-center justify-center overflow-hidden py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-[#2A0808]/20 to-[#0A0F0D] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 mb-24 px-6"
      >
        <h2 className="font-display font-bold text-4xl md:text-5xl text-[#E8F5E2] mb-4">
          Every small decision leaves a <span className="text-glow-red text-[#FF4D4D]">carbon footprint.</span>
        </h2>
        <p className="text-[#6B8F71] text-lg max-w-2xl mx-auto">
          Hover over daily activities to reveal their hidden environmental cost.
        </p>
      </motion.div>

      <div className="relative w-full max-w-5xl h-[500px] flex items-center justify-center">
        {choices.map((choice) => {
          const Icon = choice.icon;
          const isHovered = hoveredId === choice.id;
          
          return (
            <motion.div
              key={choice.id}
              initial={{ opacity: 0, scale: 0, y: choice.yOffset + 100, x: choice.xOffset }}
              whileInView={{ opacity: 1, scale: 1, y: choice.yOffset, x: choice.xOffset }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: choice.delay, type: "spring", stiffness: 100 }}
              onHoverStart={() => setHoveredId(choice.id)}
              onHoverEnd={() => setHoveredId(null)}
              className="absolute cursor-crosshair group"
            >
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: choice.delay, ease: "easeInOut" }}
                className="relative"
              >
                {/* 3D Glass Card */}
                <div className={`w-24 h-24 md:w-32 md:h-32 rounded-3xl liquid-glass flex flex-col items-center justify-center border border-white/10 shadow-2xl transition-all duration-300 ${isHovered ? 'scale-110 border-white/30 z-50' : 'scale-100'}`}>
                  <Icon className={`w-10 h-10 md:w-12 md:h-12 transition-colors duration-300 ${isHovered ? 'text-white' : 'text-gray-400'}`} />
                </div>

                {/* Hover Reveal Stats */}
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ 
                    opacity: isHovered ? 1 : 0, 
                    y: isHovered ? -20 : 10,
                    scale: isHovered ? 1 : 0.8
                  }}
                  className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 pointer-events-none"
                >
                  <div className="glass-panel p-3 rounded-xl text-center border border-white/20">
                    <div className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">{choice.name}</div>
                    <div className="font-mono text-2xl font-bold" style={{ color: choice.color, textShadow: `0 0 10px ${choice.color}80` }}>
                      {choice.co2}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
