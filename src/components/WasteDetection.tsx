import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Scan, AlertCircle, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const WASTE_MATERIALS = [
  { name: 'Plastic Bottle', co2: 2.5, category: 'Plastic', color: 'text-primary' },
  { name: 'Aluminum Can', co2: 1.8, category: 'Metal', color: 'text-secondary' },
  { name: 'Glass Bottle', co2: 3.2, category: 'Glass', color: 'text-accent' },
  { name: 'Paper', co2: 1.2, category: 'Paper', color: 'text-warning' },
  { name: 'Cardboard Box', co2: 2.0, category: 'Paper', color: 'text-warning' },
  { name: 'Metal Scrap', co2: 4.5, category: 'Metal', color: 'text-secondary' },
  { name: 'Plastic Bag', co2: 0.8, category: 'Plastic', color: 'text-primary' },
  { name: 'Glass Jar', co2: 2.8, category: 'Glass', color: 'text-accent' },
  { name: 'Newspaper', co2: 1.5, category: 'Paper', color: 'text-warning' },
  { name: 'Steel Can', co2: 3.5, category: 'Metal', color: 'text-secondary' },
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Plastic':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      );
    case 'Metal':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      );
    case 'Glass':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      );
    case 'Paper':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    default:
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      );
  }
};

export default function WasteDetection() {
  const { addDetection, detections } = useAppContext();
  const [isScanning, setIsScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        setError(null);
      }
    } catch (err) {
      setError('Camera access denied. Using demo mode.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  const handleDetect = () => {
    setIsScanning(true);

    setTimeout(() => {
      const randomMaterial = WASTE_MATERIALS[Math.floor(Math.random() * WASTE_MATERIALS.length)];
      const confidence = 0.75 + Math.random() * 0.24;

      addDetection({
        material: randomMaterial.name,
        confidence,
        co2Saved: randomMaterial.co2,
      });

      setIsScanning(false);
      
      // Show XP notification
      const xpGained = Math.floor(randomMaterial.co2 * 10);
      showXPNotification(xpGained);
    }, 2000);
  };

  const showXPNotification = (xp: number) => {
    const notification = document.createElement('div');
    notification.className = 'fixed top-24 right-4 z-50 px-4 py-2 rounded-lg bg-primary text-background font-bold shadow-neon-lg animate-scale-in';
    notification.textContent = `+${xp} XP`;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 2000);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <Card className="card-elevated p-6 space-y-4 h-full rounded-xl relative overflow-hidden">
      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-primary/50" />
      <div className="absolute top-0 right-0 w-20 h-20 border-r-2 border-t-2 border-primary/50" />
      <div className="absolute bottom-0 left-0 w-20 h-20 border-l-2 border-b-2 border-primary/50" />
      <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-primary/50" />
      
      <div className="flex items-center justify-between mb-2 relative z-10">
        <h2 className="text-h3 font-bold text-primary tracking-wider flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary flex items-center justify-center shadow-neon">
            <Sparkles className="w-5 h-5 text-primary" strokeWidth={2} />
          </div>
          AI WASTE DETECTION
        </h2>
      </div>

      {/* Camera Feed */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-background border-2 border-primary/30 shadow-neon">
        {cameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="https://c.animaapp.com/mkpzlkqaJrjut9/img/ai_2.png"
              alt="AI waste detection"
              className="w-full h-full object-cover opacity-50"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
            <Camera className="absolute w-16 h-16 text-primary/30" strokeWidth={1.5} />
          </div>
        )}

        {isScanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-primary/10 flex items-center justify-center backdrop-blur-sm"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Scan className="w-16 h-16 text-primary" strokeWidth={1.5} />
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 p-3 rounded-md bg-warning/10 border border-warning/30"
          >
            <AlertCircle className="w-4 h-4 text-warning" strokeWidth={1.5} />
            <span className="text-body-sm text-warning-foreground">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={cameraActive ? stopCamera : startCamera}
          className="h-11 bg-secondary/50 text-foreground border-2 border-primary/30 hover:bg-secondary hover:border-primary hover:shadow-neon transition-all"
        >
          <Camera className="w-4 h-4 mr-2" strokeWidth={2} />
          {cameraActive ? 'Stop Camera' : 'Start Camera'}
        </Button>
        <Button
          onClick={handleDetect}
          disabled={isScanning}
          className="h-11 bg-primary text-background font-bold hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed shadow-neon hover:shadow-neon-lg transition-all"
        >
          <Scan className="w-4 h-4 mr-2" strokeWidth={2} />
          {isScanning ? 'Scanning...' : 'Detect Waste'}
        </Button>
      </div>

      {/* Recent Detections */}
      <div className="space-y-3 relative z-10">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider">RECENT DETECTIONS</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          <AnimatePresence>
            {detections.slice(0, 4).map((detection, index) => (
              <motion.div
                key={detection.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 rounded-lg bg-secondary/50 border border-primary/30 hover:border-primary hover:shadow-neon transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`${WASTE_MATERIALS.find(m => m.name === detection.material)?.color || 'text-primary'}`}>
                    {getCategoryIcon(WASTE_MATERIALS.find(m => m.name === detection.material)?.category || 'Plastic')}
                  </div>
                  <div className="flex-1">
                    <div className="text-body-sm font-medium text-foreground">{detection.material}</div>
                    <div className="text-caption text-gray-400">
                      {(detection.confidence * 100).toFixed(0)}% confidence
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-body-sm font-medium text-accent">+{detection.co2Saved.toFixed(1)}kg</div>
                    <div className="text-caption text-success">CO₂ saved</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </Card>
  );
}
