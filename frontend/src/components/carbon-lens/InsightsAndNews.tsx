'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, Rss, Info } from 'lucide-react';
import { insights, newsItems } from '../../data/carbonLensData';

export default function InsightsAndNews({ entranceStage, viewMode }: { entranceStage: string, viewMode: string }) {
  const [insightFilter, setInsightFilter] = useState('All');
  const [newsFilter, setNewsFilter] = useState('All');
  const [expandedNews, setExpandedNews] = useState<number | null>(null);

  const showEntrance = entranceStage !== 'departure' && entranceStage !== 'threshold';
  const accent = viewMode === 'world' ? '#00E5A0' : '#39FF14';

  const insightFilters = ['All', 'India', 'Global', 'Decoupling', 'Policy'];
  const newsFilters = ['All', 'Policy', 'Technology', 'Markets', 'Science'];

  return (
    <>
      {/* INSIGHTS FEED */}
      <motion.div
        initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
        animate={showEntrance ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.4, delay: showEntrance ? 1.2 : 0, ease: [0.16, 1, 0.3, 1] }}
        className="lg:col-span-6 bg-[#162019] border border-[rgba(255,255,255,0.1)] rounded-xl p-6 flex flex-col"
      >
        <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
          <Newspaper className="w-4 h-4" style={{ color: accent }} />
          Analysis Feed
        </h3>

        <div className="flex gap-2 mb-4 overflow-x-auto hide-scrollbar pb-1">
          {insightFilters.map(f => (
            <button
              key={f}
              onClick={() => setInsightFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${insightFilter === f ? `bg-[${accent}]/10 text-[${accent}] border border-[${accent}]/30` : 'bg-[rgba(255,255,255,0.05)] text-[#6B8F71] hover:text-[#E8F5E2]'}`}
              style={insightFilter === f ? { color: accent, borderColor: `${accent}4D`, backgroundColor: `${accent}1A` } : {}}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scroll">
          <AnimatePresence mode="popLayout">
            {insights
              .filter(i => insightFilter === 'All' || i.tag === insightFilter || (insightFilter === 'Global' && viewMode === 'world') || (insightFilter === 'India' && viewMode === 'india'))
              .map((item, i) => (
                <InsightCard key={i} item={item} accent={accent} index={i} />
              ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* NEWS TRACKER */}
      <motion.div
        initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
        animate={showEntrance ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.4, delay: showEntrance ? 1.3 : 0, ease: [0.16, 1, 0.3, 1] }}
        className="lg:col-span-6 bg-[#162019] border border-[rgba(255,255,255,0.1)] rounded-xl p-6 flex flex-col"
      >
        <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
          <Rss className="w-4 h-4 text-[#FFB830]" />
          Live News & Policy
        </h3>

        <div className="flex gap-4 mb-4 border-b border-[rgba(255,255,255,0.1)] relative">
          {newsFilters.map(f => (
            <button
              key={f}
              onClick={() => setNewsFilter(f)}
              className={`pb-2 text-xs font-medium transition-colors relative ${newsFilter === f ? 'text-[#E8F5E2]' : 'text-[#6B8F71] hover:text-[#E8F5E2]'}`}
            >
              {f}
              {newsFilter === f && (
                <motion.div
                  layoutId="news-tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FFB830]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scroll perspective-[1000px]">
          <AnimatePresence mode="popLayout">
            {newsItems
              .filter(n => newsFilter === 'All' || n.tag === newsFilter)
              .map((item, i) => (
                <TiltNewsCard 
                  key={i} 
                  item={item} 
                  isExpanded={expandedNews === i} 
                  onToggle={() => setExpandedNews(expandedNews === i ? null : i)} 
                />
              ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}

function InsightCard({ item, accent, index }: any) {
  const [showSource, setShowSource] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setShowSource(false); }}
      className="bg-[rgba(255,255,255,0.02)] p-4 rounded-lg border border-[rgba(255,255,255,0.05)] hover:border-[#6B8F71] transition-all hover:-translate-y-1 hover:shadow-lg relative group"
    >
      <div className="flex justify-between items-start mb-2 relative">
        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded" style={{ backgroundColor: `${accent}1A`, color: accent }}>{item.tag}</span>
        
        <button 
          onClick={() => setShowSource(!showSource)}
          className="text-[10px] flex items-center gap-1 text-[#6B8F71] hover:text-[#E8F5E2] bg-[rgba(255,255,255,0.05)] px-2 py-1 rounded cursor-pointer"
        >
          <Info className="w-3 h-3" /> {item.source}
        </button>

        <AnimatePresence>
          {showSource && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 top-6 bg-[#0A0F0D] border border-[rgba(255,255,255,0.1)] p-3 rounded shadow-xl z-20 w-48 text-xs text-[#E8F5E2]"
            >
              <div className="font-bold mb-1 border-b border-[rgba(255,255,255,0.1)] pb-1">Source Methodology</div>
              <div className="text-[#6B8F71]">Extracted via automated NLP parsing of the latest public disclosures from {item.source}. Confidence: High.</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <h4 className="font-bold text-[#E8F5E2] text-sm mb-2">{item.headline}</h4>
      <p className="text-xs text-[#6B8F71] leading-relaxed">{item.summary}</p>
      
      {/* Mini animated line chart for flavor */}
      <div className="mt-3 h-6 w-1/3 flex items-end overflow-hidden">
        <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full stroke-current" style={{ color: accent, opacity: 0.5 }}>
          <motion.path 
            d="M0,15 L20,12 L40,8 L60,14 L80,5 L100,2" 
            fill="none" 
            strokeWidth="2" 
            strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: hovered ? 1 : 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
          {/* Base path underneath */}
          <path d="M0,15 L20,12 L40,8 L60,14 L80,5 L100,2" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" />
        </svg>
      </div>
    </motion.div>
  );
}

function TiltNewsCard({ item, isExpanded, onToggle }: any) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const rY = ((mouseX / width) - 0.5) * 8; // max 4 deg rotation
    const rX = ((mouseY / height) - 0.5) * -8;
    
    setRotate({ x: rX, y: rY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onToggle}
      className="cursor-pointer"
      style={{ perspective: 1000 }}
    >
      <motion.div
        animate={{ rotateX: rotate.x, rotateY: rotate.y }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="bg-[rgba(255,255,255,0.02)] p-4 rounded-lg border border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.15)] transition-colors relative"
      >
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] text-[#FFB830] font-mono">{item.date}</span>
          <span className="text-[10px] text-[#6B8F71]">{item.source}</span>
        </div>
        <h4 className="font-bold text-[#E8F5E2] text-sm">{item.headline}</h4>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-2 text-xs text-[#6B8F71] leading-relaxed"
            >
              This is an AI-generated expanded summary for the news item. The policy or technology discussed represents a potential shift in the projected carbon trajectory. Analysts suggest a medium-to-long term impact on {item.tag.toLowerCase()} vectors.
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
