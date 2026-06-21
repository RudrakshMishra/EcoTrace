'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Map, Search, ChevronDown, ChevronUp, Check, X } from 'lucide-react';
import { comparisonData, indiaStateData } from '../../data/carbonLensData';

export default function ComparisonMatrixTable({ viewMode, entranceStage }: { viewMode: 'world' | 'india', entranceStage: string }) {
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({ key: 'total', direction: 'desc' });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const rawData = viewMode === 'world' ? comparisonData : indiaStateData;

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const processedData = useMemo(() => {
    let filtered = rawData.filter((row: any) => 
      (row.country || row.state).toLowerCase().includes(search.toLowerCase())
    );

    return filtered.sort((a: any, b: any) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [rawData, search, sortConfig]);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const showEntrance = entranceStage !== 'departure' && entranceStage !== 'threshold';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
      animate={showEntrance ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: showEntrance ? 1.0 : 0, ease: [0.16, 1, 0.3, 1] }}
      className="lg:col-span-6 bg-[#162019] border border-[rgba(255,255,255,0.1)] rounded-xl p-6 flex flex-col relative"
    >
      <div className="flex justify-between items-start mb-6 gap-4">
        <h3 className="font-display font-bold text-lg flex items-center gap-2 whitespace-nowrap">
          <Map className="w-4 h-4" style={{ color: viewMode === 'world' ? '#00E5A0' : '#39FF14' }} />
          {viewMode === 'world' ? 'Global Comparison Matrix' : 'India State Rankings'}
        </h3>
        
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B8F71]" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg pl-9 pr-4 py-1.5 text-sm text-[#E8F5E2] placeholder:text-[#6B8F71] focus:outline-none focus:border-[#39FF14] focus:ring-1 focus:ring-[#39FF14] transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto hide-scrollbar relative">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead className="sticky top-0 bg-[#162019] z-10 border-b border-[rgba(255,255,255,0.1)]">
            <tr className="text-[#6B8F71] text-xs font-mono uppercase tracking-wider">
              <th className="pb-3 pl-2 w-10"></th>
              <th className="pb-3 pl-2 cursor-pointer hover:text-[#E8F5E2] transition-colors group" onClick={() => handleSort('country')}>
                <div className="flex items-center gap-1">
                  {viewMode === 'world' ? 'Country' : 'State'}
                  {sortConfig.key === 'country' && (sortConfig.direction === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
                </div>
              </th>
              <th className="pb-3 text-right cursor-pointer hover:text-[#E8F5E2] transition-colors" onClick={() => handleSort('total')}>
                <div className="flex items-center justify-end gap-1">
                  Total (MT)
                  {sortConfig.key === 'total' && (sortConfig.direction === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
                </div>
              </th>
              <th className="pb-3 text-right cursor-pointer hover:text-[#E8F5E2] transition-colors" onClick={() => handleSort('perCapita')}>
                <div className="flex items-center justify-end gap-1">
                  Per Capita
                  {sortConfig.key === 'perCapita' && (sortConfig.direction === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="text-sm font-mono relative">
            <AnimatePresence>
              {processedData.map((row: any) => {
                const id = row.id || row.state;
                const isSelected = selectedIds.includes(id);
                const isIndia = id === 'IN';
                const accent = viewMode === 'world' ? '#00E5A0' : '#39FF14';

                return (
                  <motion.tr
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    key={id}
                    className={`border-b border-[rgba(255,255,255,0.1)]/50 hover:bg-[rgba(255,255,255,0.05)] transition-colors group relative ${isSelected ? 'bg-[rgba(255,255,255,0.05)]' : ''}`}
                    style={{
                      boxShadow: isIndia ? 'inset 0 0 15px rgba(57,255,20,0.1)' : 'none',
                    }}
                  >
                    <td className="py-3 pl-2">
                      {isIndia && (
                        <motion.div
                          className="absolute inset-0 border border-[#39FF14] pointer-events-none rounded-sm z-0"
                          animate={{ opacity: [0.2, 0.8, 0.2] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        />
                      )}
                      <button 
                        onClick={() => toggleSelect(id)}
                        className={`relative z-10 w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? `bg-[${accent}] border-[${accent}] text-[#0A0F0D]` : 'border-[#6B8F71] group-hover:border-[#E8F5E2]'}`}
                        style={{ backgroundColor: isSelected ? accent : 'transparent', borderColor: isSelected ? accent : '' }}
                      >
                        {isSelected && <Check className="w-3 h-3 text-[#0A0F0D]" />}
                      </button>
                    </td>
                    <td className="py-3 pl-2 font-sans font-medium text-[#E8F5E2]">{row.country || row.state}</td>
                    <td className="py-3 text-right" style={{ color: accent }}>{row.total}</td>
                    <td className="py-3 text-right text-[#6B8F71] group-hover:text-[#E8F5E2] transition-colors">{row.perCapita}</td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
            {processedData.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-[#6B8F71] font-sans">No results found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Floating Compare Tray */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#0A0F0D] border border-[#39FF14]/50 shadow-[0_10px_30px_rgba(57,255,20,0.15)] rounded-full px-6 py-2 flex items-center gap-4 z-20"
          >
            <span className="text-sm font-bold text-[#E8F5E2]">{selectedIds.length} Selected</span>
            <div className="h-4 w-px bg-[rgba(255,255,255,0.2)]" />
            <button className="text-sm font-medium text-[#0A0F0D] bg-[#39FF14] hover:bg-[#2ed60f] px-4 py-1 rounded-full transition-colors">
              Compare
            </button>
            <button onClick={() => setSelectedIds([])} className="p-1 hover:bg-[rgba(255,255,255,0.1)] rounded-full text-[#6B8F71] hover:text-[#E8F5E2]">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
