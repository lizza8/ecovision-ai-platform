import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import WasteDetection from './components/WasteDetection';
import Earth3D from './components/Earth3D';
import MetricsPanel from './components/MetricsPanel';
import Leaderboard from './components/Leaderboard';
import RecyclingMap from './components/RecyclingMap';
import MilestonePopup from './components/MilestonePopup';
import CommandPalette from './components/CommandPalette';
import Achievements from './components/Achievements';
import DailyChallenges from './components/DailyChallenges';
import { AppProvider, useAppContext } from './context/AppContext';

function AppContent() {
  const { showCommandPalette, setShowCommandPalette, milestone } = useAppContext();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setShowCommandPalette]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Tech Grid */}
        <div className="absolute inset-0 tech-grid opacity-30" />
        
        {/* Flowing Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(190, 100%, 50%)" stopOpacity="0" />
              <stop offset="50%" stopColor="hsl(190, 100%, 50%)" stopOpacity="1" />
              <stop offset="100%" stopColor="hsl(200, 100%, 50%)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M 0,100 Q 250,50 500,100 T 1000,100 T 1500,100"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse-glow"
          />
          <path
            d="M 0,300 Q 250,250 500,300 T 1000,300 T 1500,300"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse-glow"
            style={{ animationDelay: '1s' }}
          />
          <path
            d="M 0,500 Q 250,450 500,500 T 1000,500 T 1500,500"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse-glow"
            style={{ animationDelay: '2s' }}
          />
        </svg>

        {/* Glowing Orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-info/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
        
        {/* Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <Header />

        {/* Main Layout - Single Column Responsive */}
        <main className="container mx-auto px-4 py-6 max-w-[1600px]">
          {/* Top Section - Detection */}
          <div className="grid grid-cols-1 gap-6 mb-6">
            <WasteDetection />
          </div>

          {/* Middle Section - Challenges and Achievements */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <DailyChallenges />
            <Achievements />
          </div>

          {/* Stats Section - Metrics and Leaderboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <MetricsPanel />
            <Leaderboard />
          </div>

          {/* Bottom Section - Map (Full Width) */}
          <div className="w-full">
            <RecyclingMap />
          </div>
        </main>
      </div>

      {/* Command Palette */}
      <CommandPalette open={showCommandPalette} onOpenChange={setShowCommandPalette} />

      {/* Milestone Popup */}
      <AnimatePresence>
        {milestone && <MilestonePopup milestone={milestone} />}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
