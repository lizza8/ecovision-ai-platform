import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Crown, Leaf, TreeDeciduous } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Card } from '@/components/ui/card';

export default function Leaderboard() {
  const { totalCO2Saved } = useAppContext();

  const leaderboard = [
    { id: '1', name: 'You', co2Saved: totalCO2Saved, rank: 1, initials: 'YO' },
    { id: '2', name: 'GreenWarrior', co2Saved: 847.5, rank: 2, initials: 'GW' },
    { id: '3', name: 'PlanetSaver', co2Saved: 623.2, rank: 3, initials: 'PS' },
    { id: '4', name: 'RecycleKing', co2Saved: 512.8, rank: 4, initials: 'RK' },
    { id: '5', name: 'EarthGuardian', co2Saved: 389.4, rank: 5, initials: 'EG' },
    { id: '6', name: 'EcoHero', co2Saved: 276.9, rank: 6, initials: 'EH' },
    { id: '7', name: 'GreenThumb', co2Saved: 198.3, rank: 7, initials: 'GT' },
  ].sort((a, b) => b.co2Saved - a.co2Saved).map((entry, index) => ({ ...entry, rank: index + 1 }));

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-warning" strokeWidth={1.5} />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-300" strokeWidth={1.5} />;
      case 3:
        return <Award className="w-5 h-5 text-tertiary" strokeWidth={1.5} />;
      default:
        return <div className="w-5 h-5 flex items-center justify-center text-body-sm text-gray-400 font-medium">{rank}</div>;
    }
  };

  return (
    <Card className="card-elevated p-6 space-y-6 h-full rounded-xl relative overflow-hidden">
      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-primary/50" />
      <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-primary/50" />
      
      <div className="flex items-center justify-between relative z-10">
        <h2 className="text-h3 font-bold text-primary tracking-wider">LEADERBOARD</h2>
        <div className="w-10 h-10 rounded-lg bg-warning/20 border border-warning flex items-center justify-center shadow-neon">
          <Trophy className="w-5 h-5 text-warning" strokeWidth={2} />
        </div>
      </div>

      <div className="space-y-3">
        {leaderboard.slice(0, 5).map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-xl border-2 transition-all hover:scale-[1.02] relative z-10 ${
              entry.rank === 1
                ? 'bg-warning/10 border-warning shadow-neon'
                : entry.rank === 2
                ? 'bg-secondary/50 border-primary/30 hover:shadow-neon'
                : entry.rank === 3
                ? 'bg-tertiary/10 border-tertiary/30 hover:shadow-neon'
                : 'bg-secondary/30 border-primary/20 hover:border-primary/50 hover:shadow-neon'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">{getRankIcon(entry.rank)}</div>
              
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-body-sm font-bold text-background">
                {entry.initials}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="text-body font-medium text-foreground truncate">{entry.name}</div>
                <div className="text-caption text-gray-400">Rank #{entry.rank}</div>
              </div>
              
              <div className="text-right">
                <div className="text-body-lg font-medium text-accent">{entry.co2Saved.toFixed(0)}</div>
                <div className="text-caption text-gray-400">kg CO₂</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Milestones */}
      <div className="pt-4 border-t border-primary/20">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">MILESTONES</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: 'leaf', label: 'First 10kg', achieved: totalCO2Saved >= 10 },
            { icon: 'tree', label: 'First 50kg', achieved: totalCO2Saved >= 50 },
            { icon: 'trees', label: 'First 100kg', achieved: totalCO2Saved >= 100 },
          ].map((milestone, index) => {
            const MilestoneIcon = milestone.icon === 'leaf' ? Leaf : milestone.icon === 'tree' ? TreeDeciduous : TreeDeciduous;
            return (
            <motion.div
              key={milestone.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-xl text-center border-2 transition-all hover:scale-105 relative z-10 ${
                milestone.achieved
                  ? 'bg-accent/10 border-accent shadow-neon'
                  : 'bg-secondary/30 border-primary/20 opacity-40'
              }`}
            >
              <div className={`flex justify-center mb-2 ${milestone.achieved ? 'text-accent' : 'text-gray-500'}`}>
                <MilestoneIcon className="w-6 h-6" strokeWidth={2} />
              </div>
              <div className="text-caption text-gray-300">{milestone.label}</div>
            </motion.div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
