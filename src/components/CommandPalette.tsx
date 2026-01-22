import React, { useState } from 'react';
import { Command } from 'cmdk';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Search, MapPin, Leaf, TrendingUp, Camera } from 'lucide-react';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [search, setSearch] = useState('');

  const commands = [
    { id: 'detect', label: 'Start Waste Detection', icon: <Camera className="w-5 h-5" strokeWidth={1.5} />, action: () => console.log('Detect') },
    { id: 'map', label: 'View Recycling Map', icon: <MapPin className="w-5 h-5" strokeWidth={1.5} />, action: () => console.log('Map') },
    { id: 'metrics', label: 'View CO₂ Metrics', icon: <Leaf className="w-5 h-5" strokeWidth={1.5} />, action: () => console.log('Metrics') },
    { id: 'leaderboard', label: 'View Leaderboard', icon: <TrendingUp className="w-5 h-5" strokeWidth={1.5} />, action: () => console.log('Leaderboard') },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-secondary/95 backdrop-blur-md border-2 border-primary/30 p-0 max-w-2xl rounded-xl shadow-neon-lg">
        <Command className="bg-transparent">
          <div className="flex items-center border-b border-primary/30 px-4">
            <Search className="w-5 h-5 text-gray-400 mr-3" strokeWidth={1.5} />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Search commands or materials..."
              className="flex-1 bg-transparent border-none outline-none py-4 text-body text-foreground placeholder:text-gray-500"
            />
          </div>

          <Command.List className="max-h-96 overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-body-sm text-gray-400">
              No results found.
            </Command.Empty>

            <Command.Group heading="Commands" className="text-caption text-gray-400 px-2 py-2">
              {commands.map(command => (
                <Command.Item
                  key={command.id}
                  onSelect={() => {
                    command.action();
                    onOpenChange(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer text-foreground hover:bg-secondary/50 hover:border-l-2 hover:border-primary transition-all"
                >
                  <div className="text-primary">{command.icon}</div>
                  <span className="text-body">{command.label}</span>
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group heading="Materials" className="text-caption text-gray-400 px-2 py-2 mt-2">
              {['Plastic', 'Metal', 'Glass', 'Paper'].map(material => (
                <Command.Item
                  key={material}
                  onSelect={() => {
                    console.log('Filter by', material);
                    onOpenChange(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-md cursor-pointer text-foreground hover:bg-primary/10 transition-colors"
                >
                  <Leaf className="w-5 h-5 text-accent" strokeWidth={1.5} />
                  <span className="text-body">Filter by {material}</span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
