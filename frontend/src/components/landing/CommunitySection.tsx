'use client';

import { motion } from 'framer-motion';
import { Trophy, Users, Medal } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useRef } from 'react';

interface LeaderboardUser {
  rank: number;
  name: string;
  score: string;
  badge: string;
  isCurrentUser?: boolean;
  avatar: string;
}

const leaders: LeaderboardUser[] = [
  { rank: 2, name: 'Sarah Jenkins', score: '2.4t CO₂/yr', badge: 'Forest Ranger', avatar: '🌿' },
  { rank: 1, name: 'Eco Knight', score: '1.2t CO₂/yr', badge: 'Carbon Sentinel', avatar: '👑' },
  { rank: 3, name: 'Marcus Chen', score: '3.1t CO₂/yr', badge: 'Solar Pioneer', avatar: '☀️' },
];

const listLeaders: LeaderboardUser[] = [
  { rank: 4, name: 'Aria Taylor', score: '3.6t CO₂/yr', badge: 'Transit Hero', avatar: '🚆' },
  { rank: 5, name: 'Liam Patel', score: '3.9t CO₂/yr', badge: 'Habit Sage', avatar: '💡' },
  { rank: 12, name: 'You (Eco-Novice)', score: '4.8t CO₂/yr', badge: 'Rising Green', isCurrentUser: true, avatar: '🌱' },
];

export default function CommunitySection() {
  const triggered = useRef(false);

  const handleViewportEnter = () => {
    if (triggered.current) return;
    triggered.current = true;
    
    // Fire beautiful light green/blue confetti explosion
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#39FF14', '#00E5A0', '#E8F5E2']
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#39FF14', '#00E5A0', '#E8F5E2']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  return (
    <section className="relative min-h-screen w-full bg-[#0A0F0D] flex flex-col items-center justify-center overflow-hidden py-32 px-6">
      {/* Background gradients */}
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#00E5A0]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#39FF14]/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 max-w-3xl mb-20"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#39FF14]/10 border border-[#39FF14]/20 rounded-full text-xs font-mono font-bold text-[#39FF14] mb-6">
          <Users className="w-3.5 h-3.5" />
          <span>GLOBAL LEADERBOARD</span>
        </div>
        <h2 className="font-display font-bold text-4xl md:text-5xl text-[#E8F5E2] mb-6">
          Join a community of <span className="text-[#39FF14] text-glow-lime">positive impact.</span>
        </h2>
        <p className="text-[#6B8F71] text-base md:text-lg leading-relaxed">
          Friendly competition drives habit change. Compare your progress, earn achievement badges, and climb the ranks together.
        </p>
      </motion.div>

      {/* Leaderboard Podiums & List */}
      <motion.div 
        onViewportEnter={handleViewportEnter}
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-end z-10"
      >
        {/* Podium Rank Cards - Span 7 */}
        <div className="md:col-span-7 flex flex-col justify-end">
          <div className="flex items-end justify-center gap-4 h-[320px] relative">
            
            {/* Rank 2 (Left) */}
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="w-1/3 flex flex-col items-center"
            >
              <div className="text-3xl mb-2">{leaders[0].avatar}</div>
              <div className="font-semibold text-xs text-gray-200 truncate max-w-full mb-1">{leaders[0].name}</div>
              <div className="font-mono text-2xs text-[#6B8F71] font-bold mb-3">{leaders[0].score}</div>
              
              {/* Podium Column */}
              <div className="w-full h-32 bg-[#111A14] border border-white/5 rounded-t-2xl flex flex-col items-center justify-start pt-4 shadow-lg">
                <span className="font-mono text-2xl font-black text-gray-400">2</span>
                <Medal className="w-4 h-4 text-gray-400 mt-2" />
                <span className="text-[9px] uppercase tracking-wider font-mono text-[#6B8F71] font-bold mt-1.5">{leaders[0].badge}</span>
              </div>
            </motion.div>

            {/* Rank 1 (Center) */}
            <motion.div 
              initial={{ opacity: 0, y: 120 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="w-1/3 flex flex-col items-center"
            >
              <div className="text-4xl mb-2 animate-bounce">{leaders[1].avatar}</div>
              <div className="font-semibold text-xs text-white truncate max-w-full mb-1">{leaders[1].name}</div>
              <div className="font-mono text-2xs text-[#39FF14] font-bold mb-3">{leaders[1].score}</div>

              {/* Podium Column */}
              <div className="w-full h-44 bg-[#162019] border border-[#39FF14]/20 rounded-t-2xl flex flex-col items-center justify-start pt-4 shadow-2xl relative">
                {/* Crown Glow Overlay */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#39FF14] to-[#00E5A0]" />
                <span className="font-mono text-3xl font-black text-[#39FF14] text-glow-lime">1</span>
                <Trophy className="w-5 h-5 text-[#39FF14] mt-2" />
                <span className="text-[9px] uppercase tracking-wider font-mono text-[#00E5A0] font-bold mt-2 text-center px-1">{leaders[1].badge}</span>
              </div>
            </motion.div>

            {/* Rank 3 (Right) */}
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="w-1/3 flex flex-col items-center"
            >
              <div className="text-3xl mb-2">{leaders[2].avatar}</div>
              <div className="font-semibold text-xs text-gray-200 truncate max-w-full mb-1">{leaders[2].name}</div>
              <div className="font-mono text-2xs text-[#6B8F71] font-bold mb-3">{leaders[2].score}</div>

              {/* Podium Column */}
              <div className="w-full h-24 bg-[#111A14] border border-white/5 rounded-t-2xl flex flex-col items-center justify-start pt-4 shadow-lg">
                <span className="font-mono text-2xl font-black text-amber-700">3</span>
                <Medal className="w-4 h-4 text-amber-700 mt-2" />
                <span className="text-[9px] uppercase tracking-wider font-mono text-[#6B8F71] font-bold mt-1">{leaders[2].badge}</span>
              </div>
            </motion.div>

          </div>
        </div>

        {/* List Leaderboards - Span 5 */}
        <div className="md:col-span-5 flex flex-col gap-3">
          <span className="font-mono text-2xs text-gray-500 uppercase tracking-widest font-bold mb-1 block">
            Rank Standings
          </span>
          {listLeaders.map((leader) => (
            <motion.div
              key={leader.rank}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-2xl flex items-center justify-between border shadow-lg transition-all duration-300 ${
                leader.isCurrentUser
                  ? 'border-[#39FF14] bg-[#39FF14]/5 text-white'
                  : 'border-white/5 bg-white/5 text-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`font-mono text-sm font-bold w-6 text-center ${
                  leader.isCurrentUser ? 'text-[#39FF14]' : 'text-[#6B8F71]'
                }`}>
                  #{leader.rank}
                </span>
                <span className="text-lg">{leader.avatar}</span>
                <div>
                  <div className="text-xs font-bold font-display">{leader.name}</div>
                  <div className="text-[9px] uppercase font-mono tracking-wider text-[#6B8F71] font-bold mt-0.5">{leader.badge}</div>
                </div>
              </div>
              <div className={`font-mono text-xs font-bold ${
                leader.isCurrentUser ? 'text-[#39FF14]' : 'text-gray-300'
              }`}>
                {leader.score}
              </div>
            </motion.div>
          ))}
        </div>

      </motion.div>
    </section>
  );
}
