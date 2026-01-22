import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Leaf, Zap, TreeDeciduous } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Card } from '@/components/ui/card';

export default function MetricsPanel() {
  const { totalCO2Saved, treesEquivalent, carKmOffset, detections } = useAppContext();

  const metrics = [
    {
      label: 'Total CO₂ Saved',
      value: `${totalCO2Saved.toFixed(1)}kg`,
      icon: <Leaf className="w-6 h-6" strokeWidth={1.5} />,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/30',
    },
    {
      label: 'Trees Equivalent',
      value: treesEquivalent.toString(),
      icon: <TreeDeciduous className="w-6 h-6" strokeWidth={1.5} />,
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/30',
    },
    {
      label: 'Car km Offset',
      value: carKmOffset.toString(),
      icon: <Zap className="w-6 h-6" strokeWidth={1.5} />,
      color: 'text-info',
      bgColor: 'bg-info/10',
      borderColor: 'border-info/30',
    },
  ];

  return (
    <Card className="card-elevated p-6 space-y-6 h-full rounded-xl relative overflow-hidden">
      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-primary/50" />
      <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-primary/50" />
      
      <h2 className="text-h3 font-bold text-primary tracking-wider relative z-10">ENVIRONMENTAL IMPACT</h2>

      <div className="grid grid-cols-1 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-5 rounded-xl ${metric.bgColor} border-2 ${metric.borderColor} hover:scale-[1.02] transition-all hover:shadow-neon relative z-10`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`${metric.color}`}>{metric.icon}</div>
                <div>
                  <div className="text-caption text-gray-400">{metric.label}</div>
                  <div className="text-h3 font-medium text-foreground">{metric.value}</div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Material Breakdown */}
      <div className="pt-4 border-t border-primary/20">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">MATERIAL BREAKDOWN</h3>
        <div className="space-y-3">
          {getMaterialStats(detections).map((stat, index) => (
            <div key={stat.material} className="space-y-1">
              <div className="flex items-center justify-between text-body-sm">
                <span className="text-gray-300">{stat.material}</span>
                <span className="font-medium text-foreground">{stat.count}</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.percentage}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="h-full bg-gradient-accent"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function getMaterialStats(detections: any[]) {
  const materialCounts: Record<string, number> = {};
  
  detections.forEach(detection => {
    materialCounts[detection.material] = (materialCounts[detection.material] || 0) + 1;
  });

  const total = detections.length || 1;
  
  return Object.entries(materialCounts)
    .map(([material, count]) => ({
      material,
      count,
      percentage: (count / total) * 100,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}
