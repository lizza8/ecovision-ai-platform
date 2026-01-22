import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Lock, Target, Shield, Zap, Flame, Globe } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Card } from '@/components/ui/card';

const getIconComponent = (iconName: string) => {
  const iconProps = { className: "w-8 h-8", strokeWidth: 1.5 };
  switch (iconName) {
    case 'target': return <Target {...iconProps} />;
    case 'shield': return <Shield {...iconProps} />;
    case 'zap': return <Zap {...iconProps} />;
    case 'flame': return <Flame {...iconProps} />;
    case 'trophy': return <Trophy {...iconProps} />;
    case 'globe': return <Globe {...iconProps} />;
    default: return <Target {...iconProps} />;
  }
};

export default function Achievements() {
  const { achievements } = useAppContext();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'detection': return 'border-primary/30 bg-primary/5';
      case 'co2': return 'border-success/30 bg-success/5';
      case 'streak': return 'border-warning/30 bg-warning/5';
      case 'social': return 'border-info/30 bg-info/5';
      default: return 'border-primary/30 bg-primary/5';
    }
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <Card className="card-elevated p-6 space-y-6 h-full rounded-xl relative overflow-hidden">
      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-primary/50" />
      <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-primary/50" />
      
      <div className="flex items-center justify-between relative z-10">
        <div>
          <h2 className="text-h3 font-bold text-primary tracking-wider">ACHIEVEMENTS</h2>
          <p className="text-caption text-gray-400 mt-1">
            {unlockedCount}/{achievements.length} Unlocked
          </p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-warning/20 border border-warning flex items-center justify-center shadow-neon">
          <Trophy className="w-5 h-5 text-warning" strokeWidth={2} />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative z-10">
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-primary"
          />
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-2 gap-3 relative z-10 max-h-[400px] overflow-y-auto pr-2">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
              achievement.unlocked
                ? `${getCategoryColor(achievement.category)} hover:shadow-neon`
                : 'bg-secondary/30 border-gray-700/30 opacity-50'
            }`}
          >
            <div className="flex flex-col items-center text-center gap-2">
              <div className="relative">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  achievement.unlocked ? 'bg-primary/20 border-2 border-primary' : 'bg-gray-800 border-2 border-gray-700'
                }`}>
                  <div className={achievement.unlocked ? 'text-primary' : 'text-gray-500'}>
                    {getIconComponent(achievement.icon)}
                  </div>
                </div>
                {!achievement.unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/60 rounded-full">
                    <Lock className="w-5 h-5 text-gray-400" strokeWidth={2} />
                  </div>
                )}
              </div>
              <div>
                <div className="text-body-sm font-bold text-foreground">{achievement.title}</div>
                <div className="text-caption text-gray-400 mt-1">{achievement.description}</div>
              </div>
              {!achievement.unlocked && (
                <div className="w-full mt-2">
                  <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-accent transition-all"
                      style={{ width: `${Math.min((achievement.progress / achievement.target) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="text-caption text-gray-400 mt-1">
                    {achievement.progress}/{achievement.target}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
