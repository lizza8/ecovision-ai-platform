import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function Earth3D() {
  const { earthHealth, totalCO2Saved } = useAppContext();

  // Real Earth colors - blue oceans and green/brown land
  const getEarthGradient = (health: number) => {
    // Base colors: ocean blue and land green/brown
    const oceanBlue = { h: 200, s: 70, l: 45 };
    const landGreen = { h: 120, s: 40, l: 35 };
    const healthyGreen = { h: 140, s: 60, l: 45 };
    
    // Interpolate land color based on health
    const landH = landGreen.h + (healthyGreen.h - landGreen.h) * (health / 100);
    const landS = landGreen.s + (healthyGreen.s - landGreen.s) * (health / 100);
    const landL = landGreen.l + (healthyGreen.l - landGreen.l) * (health / 100);

    return {
      ocean: `hsl(${oceanBlue.h}, ${oceanBlue.s}%, ${oceanBlue.l}%)`,
      land: `hsl(${landH}, ${landS}%, ${landL}%)`,
      glow: `hsl(${landH}, ${landS + 20}%, ${landL + 20}%)`,
    };
  };

  const colors = getEarthGradient(earthHealth);

  return (
    <Card className="card-elevated p-6 h-full min-h-[500px] rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-h3 font-semibold text-foreground">Earth Health Monitor</h2>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-caption text-gray-400">Health</div>
            <div className="text-h4 font-medium text-accent">{earthHealth.toFixed(1)}%</div>
          </div>
        </div>
      </div>

      {/* 3D Earth Visualization */}
      <div className="relative w-full h-[450px] rounded-xl overflow-hidden bg-background border border-border">
        {/* Animated Earth Container */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            className="relative"
          >
            {/* Main Earth Sphere - Real Earth Colors */}
            <div
              className="w-80 h-80 rounded-full relative shadow-2xl"
              style={{
                background: `radial-gradient(circle at 35% 35%, 
                  ${colors.ocean}, 
                  hsl(200, 65%, 40%), 
                  hsl(200, 60%, 35%))`,
                boxShadow: `
                  0 0 80px ${colors.glow}40,
                  inset -20px -20px 60px rgba(0, 0, 0, 0.5),
                  inset 20px 20px 60px rgba(255, 255, 255, 0.1)
                `,
              }}
            >
              {/* Continents/Land Masses - Realistic Placement */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                {/* North America */}
                <div 
                  className="absolute rounded-full blur-sm"
                  style={{
                    top: '20%',
                    left: '15%',
                    width: '25%',
                    height: '30%',
                    background: colors.land,
                    opacity: 0.9,
                    transform: 'rotate(-15deg)',
                  }}
                />
                
                {/* South America */}
                <div 
                  className="absolute rounded-full blur-sm"
                  style={{
                    top: '45%',
                    left: '25%',
                    width: '15%',
                    height: '25%',
                    background: colors.land,
                    opacity: 0.85,
                    transform: 'rotate(10deg)',
                  }}
                />

                {/* Europe/Africa */}
                <div 
                  className="absolute rounded-full blur-sm"
                  style={{
                    top: '25%',
                    right: '25%',
                    width: '20%',
                    height: '35%',
                    background: colors.land,
                    opacity: 0.9,
                  }}
                />

                {/* Asia */}
                <div 
                  className="absolute rounded-full blur-sm"
                  style={{
                    top: '15%',
                    right: '10%',
                    width: '30%',
                    height: '28%',
                    background: colors.land,
                    opacity: 0.88,
                    transform: 'rotate(5deg)',
                  }}
                />

                {/* Australia */}
                <div 
                  className="absolute rounded-full blur-sm"
                  style={{
                    bottom: '25%',
                    right: '15%',
                    width: '12%',
                    height: '10%',
                    background: colors.land,
                    opacity: 0.85,
                  }}
                />

                {/* Antarctica */}
                <div 
                  className="absolute rounded-full blur-md"
                  style={{
                    bottom: '5%',
                    left: '20%',
                    width: '60%',
                    height: '15%',
                    background: 'hsl(200, 20%, 90%)',
                    opacity: 0.7,
                  }}
                />
              </div>

              {/* Cloud Layer */}
              <div className="absolute inset-0 rounded-full overflow-hidden opacity-20">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full bg-white blur-md"
                    style={{
                      top: `${Math.random() * 80}%`,
                      left: `${Math.random() * 80}%`,
                      width: `${10 + Math.random() * 15}%`,
                      height: `${5 + Math.random() * 8}%`,
                    }}
                    animate={{
                      x: [0, 20, 0],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 10 + i * 2,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                ))}
              </div>

              {/* Atmosphere Glow */}
              <div
                className="absolute inset-0 rounded-full animate-pulse-glow"
                style={{
                  background: `radial-gradient(circle at 50% 50%, 
                    ${colors.glow}60, 
                    transparent 65%)`,
                }}
              />

              {/* Outer Atmosphere Ring */}
              <div
                className="absolute inset-[-10px] rounded-full"
                style={{
                  background: `radial-gradient(circle at 50% 50%, 
                    transparent 60%, 
                    hsl(200, 80%, 70% / 0.2) 70%, 
                    transparent 80%)`,
                }}
              />
            </div>

            {/* Orbiting Satellites/Particles */}
            {[...Array(12)].map((_, i) => {
              const angle = (i * Math.PI * 2) / 12;
              const radius = 180;
              return (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-primary shadow-primary-md"
                  style={{
                    left: '50%',
                    top: '50%',
                    marginLeft: '-4px',
                    marginTop: '-4px',
                  }}
                  animate={{
                    x: [
                      Math.cos(angle) * radius,
                      Math.cos(angle + Math.PI) * radius,
                      Math.cos(angle) * radius,
                    ],
                    y: [
                      Math.sin(angle) * radius,
                      Math.sin(angle + Math.PI) * radius,
                      Math.sin(angle) * radius,
                    ],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: i * 0.3,
                  }}
                />
              );
            })}
          </motion.div>
        </div>

        {/* Floating Particles Background - Stars */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>

        {/* Stats Overlay */}
        <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-secondary/90 backdrop-blur-md p-3 rounded-lg text-center border border-border shadow-lg"
          >
            <div className="text-caption text-gray-400">Health</div>
            <div className="text-body font-medium text-accent">{earthHealth.toFixed(0)}%</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-3 rounded-md text-center backdrop-blur-md"
          >
            <div className="text-caption text-gray-400">CO₂ Saved</div>
            <div className="text-body font-medium text-success">{totalCO2Saved.toFixed(1)}kg</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-panel p-3 rounded-md text-center backdrop-blur-md"
          >
            <div className="text-caption text-gray-400">Status</div>
            <div className="text-body font-medium text-primary">
              {earthHealth > 50 ? 'Healing' : 'Growing'}
            </div>
          </motion.div>
        </div>

        {/* Corner Decorations */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary/40" />
        <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary/40" />
        <div className="absolute bottom-20 left-4 w-8 h-8 border-l-2 border-b-2 border-primary/40" />
        <div className="absolute bottom-20 right-4 w-8 h-8 border-r-2 border-b-2 border-primary/40" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 p-4 rounded-lg bg-secondary/50 border border-border"
      >
        <p className="text-body-sm text-gray-300 text-center">
          Real-time Earth visualization • Blue oceans & green continents • Watch land heal as you recycle
        </p>
      </motion.div>
    </Card>
  );
}
