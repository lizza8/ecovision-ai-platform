import React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { Search, Leaf, Car, TreeDeciduous } from 'lucide-react';

export default function Header() {
  const { totalCO2Saved, treesEquivalent, carKmOffset, setShowCommandPalette, level, xp, nextLevelXP, streak } = useAppContext();

  return (
    <header className="sticky top-0 z-50 h-[72px] bg-secondary/90 backdrop-blur-md border-b border-primary/30 shadow-neon">
      <div className="max-w-[1440px] mx-auto h-full px-md flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary flex items-center justify-center shadow-neon">
            <Leaf className="w-6 h-6 text-primary" strokeWidth={2} />
          </div>
          <h1 className="text-h3 font-bold text-primary tracking-wider">ECOVISION</h1>
        </motion.div>

        {/* Metrics */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Level & XP */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-secondary/50 border border-primary/30">
            <div className="text-primary">
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary flex items-center justify-center text-body-sm font-bold">
                {level}
              </div>
            </div>
            <div>
              <div className="text-caption text-gray-400">Level {level}</div>
              <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-primary transition-all duration-300"
                  style={{ width: `${(xp / nextLevelXP) * 100}%` }}
                />
              </div>
              <div className="text-caption text-gray-400">{xp}/{nextLevelXP} XP</div>
            </div>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-warning/10 border border-warning/30">
            <div className="w-8 h-8 rounded-full bg-warning/20 border border-warning flex items-center justify-center">
              <svg className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div className="text-body-sm font-bold text-warning">{streak}</div>
              <div className="text-caption text-gray-400">day streak</div>
            </div>
          </div>

          <MetricItem
            icon={<Leaf className="w-5 h-5" strokeWidth={1.5} />}
            label="CO₂"
            value={`${totalCO2Saved.toFixed(1)}kg`}
            color="text-accent"
          />
        </div>

        {/* Command Search */}
        <motion.button
          onClick={() => setShowCommandPalette(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="hidden lg:flex items-center gap-3 px-6 h-11 rounded-lg bg-secondary/50 border border-primary/30 text-gray-300 hover:text-primary hover:border-primary hover:shadow-neon transition-all"
        >
          <Search className="w-4 h-4" strokeWidth={2} />
          <span className="text-sm">Search commands...</span>
          <kbd className="px-2 py-1 text-xs bg-secondary rounded border border-border text-gray-400 font-mono">⌘K</kbd>
        </motion.button>

        {/* Mobile Search Icon */}
        <button
          onClick={() => setShowCommandPalette(true)}
          className="lg:hidden w-10 h-10 rounded-lg bg-secondary/50 border border-primary/30 flex items-center justify-center text-primary hover:border-primary hover:shadow-neon transition-all"
        >
          <Search className="w-5 h-5" strokeWidth={2} />
        </button>
      </div>
    </header>
  );
}

function MetricItem({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`${color}`}>{icon}</div>
      <div>
        <div className="text-caption text-gray-400">{label}</div>
        <div className="text-body font-medium text-foreground">{value}</div>
      </div>
    </div>
  );
}
