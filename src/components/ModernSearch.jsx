import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, Salad, Activity, Users, Camera, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CommandIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-ink-500">
    <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
  </svg>
);

const nutrisyncSearches = [
  { id: 'overview', name: 'Dashboard Overview', icon: <LayoutDashboard size={24} color="#10B981" />, notification: 'Main View', color: '#10B981' },
  { id: 'diet', name: 'Diet & Meal Plans', icon: <Salad size={24} color="#F0B90B" />, notification: '2 New Plans', color: '#F0B90B' },
  { id: 'progress', name: 'Workouts & Activity', icon: <Activity size={24} color="#EA4C89" />, notification: 'Daily Goal', color: '#EA4C89' },
  { id: 'social', name: 'Community & Friends', icon: <Users size={24} color="#F24E1E" />, notification: '12 Online', color: '#F24E1E' },
  { id: 'scan', name: 'Food AI Scanner', icon: <Camera size={24} color="#8B5CF6" />, notification: 'Ready', color: '#8B5CF6' },
];

const SearchItem = ({ item, onSelect }) => (
  <li 
    onClick={() => onSelect(item.id)}
    className="flex items-center justify-between p-3 transition-all duration-300 ease-in-out bg-black/5 hover:bg-black/10 rounded-xl hover:scale-[1.02] cursor-pointer"
  >
    <div className="flex items-center gap-4">
      {item.icon}
      <span className="text-ink-800 font-semibold">{item.name}</span>
    </div>
    <div className="flex items-center gap-2 text-sm text-ink-500 font-medium">
      <span style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}` }} className="w-2 h-2 rounded-full"></span>
      <span>{item.notification}</span>
    </div>
  </li>
);

export function ModernSearch({ isOpen, onClose, setPage }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState(nutrisyncSearches);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSearchTerm(''); // Reset search on open
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleClear = () => setItems([]);

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 bg-ink-900/40 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="w-full max-w-2xl mx-auto p-4 space-y-6 bg-white/90 backdrop-blur-3xl border border-white/60 rounded-3xl shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            
            {/* Search Input with Enhanced Gradient Border and Glow */}
            <div className="relative p-px rounded-2xl bg-gradient-to-r from-orange-500 via-purple-600 to-pink-600 shadow-lg shadow-purple-500/20 transition-shadow duration-300 focus-within:shadow-purple-500/40">
                <div className="flex items-center w-full px-4 py-3 bg-white rounded-[15px]">
                    <SearchIcon className="w-6 h-6 text-ink-400 flex-shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search the app.."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-1 text-lg text-ink-900 placeholder-ink-400 bg-transparent focus:outline-none flex-1 min-w-0 font-medium"
                    />
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="flex items-center justify-center p-1.5 bg-ink-50 border border-ink-100 rounded-md shadow-inner text-ink-500">
                            <CommandIcon />
                        </div>
                        <div className="flex items-center justify-center w-7 h-7 p-1 bg-ink-50 border border-ink-100 rounded-md shadow-inner">
                            <span className="text-sm font-semibold text-ink-600">K</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Searches Section */}
            {items.length > 0 && (
              <div className="px-2 space-y-4 pb-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold tracking-wider text-ink-400 uppercase">Recent search</h2>
                  <button
                    onClick={handleClear}
                    className="px-3 py-1 text-sm font-semibold text-ink-500 transition-colors duration-200 rounded-md hover:bg-ink-100 hover:text-ink-900"
                  >
                    Clear all
                  </button>
                </div>
                
                <ul className="space-y-2">
                  {filteredItems.map(item => (
                    <SearchItem key={item.id} item={item} onSelect={(id) => { setPage(id); onClose(); }} />
                  ))}
                  {filteredItems.length === 0 && (
                     <p className="text-center text-ink-400 py-6 font-medium">No results found for "{searchTerm}"</p>
                  )}
                </ul>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
