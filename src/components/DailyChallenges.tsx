import React from 'react';
import { motion } from 'framer-motion';
import { Target, Clock, Gift, Package, Box, Leaf } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Card } from '@/components/ui/card';

const getChallengeIcon = (iconName: string) => {
  const iconProps = { className: "w-6 h-6", strokeWidth: 2 };
  switch (iconName) {
    case 'package': return <Package {...iconProps} />;
    case 'box': return <Box {...iconProps} />;
    case 'leaf': return <Leaf {...iconProps} />;
    default: return <Target {...iconProps} />;
  }
};

export default function DailyChallenges() {
  const { dailyChallenges } = useAppContext();

  const getTimeRemaining = (expiresAt: Date) => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <Card className="card-elevated p-6 space-y-6 h-full rounded-xl relative overflow-hidden">
      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-primary/50" />
      <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-primary/50" />
      
      <div className="flex items-center justify-between relative z-10">
        <div>
          <h2 className="text-h3 font-bold text-primary tracking-wider">DAILY CHALLENGES</h2>
          <p className="text-caption text-gray-400 mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3" strokeWidth={2} />
            Resets in {getTimeRemaining(dailyChallenges[0]?.expiresAt || new Date())}
          </p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-accent/20 border border-accent flex items-center justify-center shadow-neon">
          <Target className="w-5 h-5 text-accent" strokeWidth={2} />
        </div>
      </div>

      {/* Challenges List */}
      <div className="space-y-4 relative z-10">
        {dailyChallenges.map((challenge, index) => {
          const progress = (challenge.progress / challenge.target) * 100;
          const isComplete = challenge.progress >= challenge.target;

          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border-2 transition-all hover:scale-[1.02] ${
                isComplete
                  ? 'bg-success/10 border-success/30 hover:shadow-neon'
                  : 'bg-secondary/50 border-primary/30 hover:border-primary hover:shadow-neon'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 border border-primary flex items-center justify-center flex-shrink-0 text-primary">
                  {getChallengeIcon(challenge.icon)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="text-body font-bold text-foreground">{challenge.title}</div>
                      <div className="text-caption text-gray-400">{challenge.description}</div>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-warning/20 border border-warning/30 flex-shrink-0">
                      <Gift className="w-3 h-3 text-warning" strokeWidth={2} />
                      <span className="text-caption font-bold text-warning">+{challenge.reward} XP</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-caption text-gray-400">
                      <span>Progress</span>
                      <span className="font-medium text-foreground">
                        {challenge.progress}/{challenge.target}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progress, 100)}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className={`h-full ${
                          isComplete ? 'bg-gradient-to-r from-success to-accent' : 'bg-gradient-primary'
                        }`}
                      />
                    </div>
                  </div>

                  {isComplete && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-caption font-bold text-success flex items-center gap-1"
                    >
                      ✓ Challenge Complete!
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bonus Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="p-4 rounded-xl bg-gradient-holographic border border-primary/30 relative z-10"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary flex items-center justify-center flex-shrink-0">
            <Gift className="w-5 h-5 text-primary" strokeWidth={2} />
          </div>
          <div>
            <div className="text-body-sm font-bold text-foreground">Complete all challenges</div>
            <div className="text-caption text-gray-400">Earn bonus 100 XP + exclusive badge</div>
          </div>
        </div>
      </motion.div>
    </Card>
  );
}
