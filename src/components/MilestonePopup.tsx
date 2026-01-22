import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Trophy } from 'lucide-react';
import { Milestone } from '../context/AppContext';
import { useAppContext } from '../context/AppContext';

interface MilestonePopupProps {
  milestone: Milestone;
}

export default function MilestonePopup({ milestone }: MilestonePopupProps) {
  const { setMilestone } = useAppContext();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMilestone(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [setMilestone]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm"
      onClick={() => setMilestone(null)}
    >
      <motion.div
        initial={{ scale: 0.8, rotate: -10, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        exit={{ scale: 0.8, rotate: 10, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="bg-secondary/95 backdrop-blur-md p-8 rounded-2xl border-2 border-primary shadow-neon-lg max-w-md mx-4 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
            <Trophy className="w-8 h-8 text-primary" strokeWidth={2} />
          </div>
          <button
            onClick={() => setMilestone(null)}
            className="w-8 h-8 rounded-lg bg-background text-foreground flex items-center justify-center hover:bg-background/80 transition-colors border border-border"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        <div className="text-center">
          {/* Corner Accents */}
          <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-primary" />
          <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-primary" />
          <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-primary" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-primary" />
          
          <h2 className="text-h2 font-bold text-primary mb-2 tracking-wider relative z-10">{milestone.title}</h2>
          <p className="text-body text-gray-300">{milestone.description}</p>
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', damping: 15 }}
          className="mt-6 p-4 rounded-xl bg-primary text-center shadow-neon relative z-10"
        >
          <div className="text-body font-bold text-background tracking-wider">ACHIEVEMENT UNLOCKED!</div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
