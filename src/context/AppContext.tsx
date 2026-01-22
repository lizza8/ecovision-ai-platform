import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Detection {
  id: string;
  material: string;
  confidence: number;
  timestamp: Date;
  co2Saved: number;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  icon: string;
  achieved: boolean;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  co2Saved: number;
  rank: number;
  avatar: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  target: number;
  category: 'detection' | 'co2' | 'streak' | 'social';
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  reward: number;
  icon: string;
  expiresAt: Date;
}

interface AppContextType {
  detections: Detection[];
  addDetection: (detection: Omit<Detection, 'id' | 'timestamp'>) => void;
  totalCO2Saved: number;
  treesEquivalent: number;
  carKmOffset: number;
  earthHealth: number;
  leaderboard: LeaderboardEntry[];
  milestone: Milestone | null;
  setMilestone: (milestone: Milestone | null) => void;
  showCommandPalette: boolean;
  setShowCommandPalette: (show: boolean) => void;
  achievements: Achievement[];
  dailyChallenges: DailyChallenge[];
  streak: number;
  level: number;
  xp: number;
  nextLevelXP: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [totalCO2Saved, setTotalCO2Saved] = useState(0);
  const [milestone, setMilestone] = useState<Milestone | null>(null);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [streak, setStreak] = useState(3);
  const [xp, setXP] = useState(450);
  const [level, setLevel] = useState(5);

  const nextLevelXP = level * 200;

  const achievements: Achievement[] = [
    { id: 'first-scan', title: 'First Scan', description: 'Complete your first waste detection', icon: 'target', unlocked: true, progress: 1, target: 1, category: 'detection' },
    { id: 'eco-warrior', title: 'Eco Warrior', description: 'Detect 50 items', icon: 'shield', unlocked: false, progress: detections.length, target: 50, category: 'detection' },
    { id: 'carbon-crusher', title: 'Carbon Crusher', description: 'Save 100kg of CO₂', icon: 'zap', unlocked: totalCO2Saved >= 100, progress: totalCO2Saved, target: 100, category: 'co2' },
    { id: 'week-streak', title: 'Week Warrior', description: 'Maintain a 7-day streak', icon: 'flame', unlocked: streak >= 7, progress: streak, target: 7, category: 'streak' },
    { id: 'top-10', title: 'Top 10', description: 'Reach top 10 on leaderboard', icon: 'trophy', unlocked: false, progress: 0, target: 1, category: 'social' },
    { id: 'planet-saver', title: 'Planet Saver', description: 'Save 500kg of CO₂', icon: 'globe', unlocked: false, progress: totalCO2Saved, target: 500, category: 'co2' },
  ];

  const dailyChallenges: DailyChallenge[] = [
    { id: 'daily-1', title: 'Plastic Hunter', description: 'Detect 5 plastic items', target: 5, progress: 2, reward: 50, icon: 'package', expiresAt: new Date(Date.now() + 86400000) },
    { id: 'daily-2', title: 'Metal Master', description: 'Detect 3 metal items', target: 3, progress: 1, reward: 40, icon: 'box', expiresAt: new Date(Date.now() + 86400000) },
    { id: 'daily-3', title: 'CO₂ Champion', description: 'Save 10kg of CO₂ today', target: 10, progress: 3.5, reward: 75, icon: 'leaf', expiresAt: new Date(Date.now() + 86400000) },
  ];

  const addDetection = useCallback((detection: Omit<Detection, 'id' | 'timestamp'>) => {
    const newDetection: Detection = {
      ...detection,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    };

    setDetections(prev => [newDetection, ...prev].slice(0, 50));
    const newTotal = totalCO2Saved + detection.co2Saved;
    setTotalCO2Saved(newTotal);

    // Add XP
    const xpGained = Math.floor(detection.co2Saved * 10);
    const newXP = xp + xpGained;
    setXP(newXP);

    // Level up check
    if (newXP >= nextLevelXP) {
      setLevel(prev => prev + 1);
      setXP(newXP - nextLevelXP);
      setMilestone({
        id: 'level-up',
        title: `Level ${level + 1} Reached!`,
        description: `You've leveled up! Keep going!`,
        icon: 'level-up',
        achieved: true,
      });
      setTimeout(() => setMilestone(null), 3000);
    }

    // Check for milestones
    if (newTotal >= 10 && totalCO2Saved < 10) {
      setMilestone({
        id: 'first-10',
        title: 'Eco Beginner',
        description: 'Saved your first 10kg of CO₂!',
        icon: 'eco-beginner',
        achieved: true,
      });
      setTimeout(() => setMilestone(null), 3000);
    } else if (newTotal >= 50 && totalCO2Saved < 50) {
      setMilestone({
        id: 'first-50',
        title: 'Green Champion',
        description: 'Saved 50kg of CO₂! Keep going!',
        icon: 'green-champion',
        achieved: true,
      });
      setTimeout(() => setMilestone(null), 3000);
    } else if (newTotal >= 100 && totalCO2Saved < 100) {
      setMilestone({
        id: 'first-100',
        title: 'Eco Warrior',
        description: 'Saved 100kg of CO₂! Amazing!',
        icon: 'eco-warrior',
        achieved: true,
      });
      setTimeout(() => setMilestone(null), 3000);
    } else if (newTotal >= 250 && totalCO2Saved < 250) {
      setMilestone({
        id: 'first-250',
        title: 'Planet Protector',
        description: 'Saved 250kg of CO₂! Incredible!',
        icon: 'planet-protector',
        achieved: true,
      });
      setTimeout(() => setMilestone(null), 3000);
    }
  }, [totalCO2Saved]);

  const treesEquivalent = Math.floor(totalCO2Saved / 21);
  const carKmOffset = Math.floor(totalCO2Saved * 5.2);
  const earthHealth = Math.min(100, (totalCO2Saved / 1000) * 100);

  const leaderboard: LeaderboardEntry[] = [
    { id: '1', name: 'EcoChampion', co2Saved: totalCO2Saved, rank: 1, avatar: '🌟' },
    { id: '2', name: 'GreenWarrior', co2Saved: 847, rank: 2, avatar: '🌿' },
    { id: '3', name: 'PlanetSaver', co2Saved: 623, rank: 3, avatar: '🌍' },
    { id: '4', name: 'RecycleKing', co2Saved: 512, rank: 4, avatar: '♻️' },
    { id: '5', name: 'EarthGuardian', co2Saved: 389, rank: 5, avatar: '🛡️' },
  ].sort((a, b) => b.co2Saved - a.co2Saved).map((entry, index) => ({ ...entry, rank: index + 1 }));

  return (
    <AppContext.Provider
      value={{
        detections,
        addDetection,
        totalCO2Saved,
        treesEquivalent,
        carKmOffset,
        earthHealth,
        leaderboard,
        milestone,
        setMilestone,
        showCommandPalette,
        setShowCommandPalette,
        achievements,
        dailyChallenges,
        streak,
        level,
        xp,
        nextLevelXP,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
