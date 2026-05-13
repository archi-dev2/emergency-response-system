'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';

interface SOSConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (severity: number, description?: string) => void;
}

const SEVERITY_OPTIONS = [
  { level: 1, label: 'LOW', color: 'bg-green-500', ringColor: 'ring-green-500/50', textColor: 'text-green-400', borderColor: 'border-green-500/30', description: 'Minor discomfort' },
  { level: 2, label: 'MODERATE', color: 'bg-yellow-500', ringColor: 'ring-yellow-500/50', textColor: 'text-yellow-400', borderColor: 'border-yellow-500/30', description: 'Needs attention' },
  { level: 3, label: 'SERIOUS', color: 'bg-orange-500', ringColor: 'ring-orange-500/50', textColor: 'text-orange-400', borderColor: 'border-orange-500/30', description: 'Urgent care' },
  { level: 4, label: 'CRITICAL', color: 'bg-red-500', ringColor: 'ring-red-500/50', textColor: 'text-red-400', borderColor: 'border-red-500/30', description: 'Life-threatening' },
  { level: 5, label: 'EXTREME', color: 'bg-red-900', ringColor: 'ring-red-900/50', textColor: 'text-red-300', borderColor: 'border-red-900/30', description: 'Maximum priority' },
] as const;

export default function SOSConfirmDialog({ open, onOpenChange, onConfirm }: SOSConfirmDialogProps) {
  const [selectedSeverity, setSelectedSeverity] = useState<number>(3);
  const [description, setDescription] = useState('');

  const handleConfirm = () => {
    onConfirm(selectedSeverity, description.trim() || undefined);
    setDescription('');
    onOpenChange(false);
  };

  const handleCancel = () => {
    setDescription('');
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md border-red-900/30 bg-zinc-950/95 backdrop-blur-xl sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl text-white">
            Confirm Emergency
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400">
            Select the severity level and optionally describe the emergency.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Severity Selector */}
        <div className="space-y-3 py-2">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Severity Level
          </p>
          <div className="grid grid-cols-5 gap-2">
            {SEVERITY_OPTIONS.map((opt) => {
              const isSelected = selectedSeverity === opt.level;
              return (
                <motion.button
                  key={opt.level}
                  type="button"
                  onClick={() => setSelectedSeverity(opt.level)}
                  className={`relative flex flex-col items-center gap-1.5 rounded-lg border p-3 transition-all ${
                    isSelected
                      ? `${opt.borderColor} ${opt.ringColor} ring-2`
                      : 'border-zinc-800 hover:border-zinc-600'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <div
                    className={`w-4 h-4 rounded-full ${opt.color} transition-all ${
                      isSelected ? 'scale-125 shadow-lg' : 'scale-100 opacity-60'
                    }`}
                    style={{
                      boxShadow: isSelected ? `0 0 12px ${opt.color.replace('bg-', '')}` : 'none',
                    }}
                  />
                  <span
                    className={`text-[10px] font-bold tracking-wider ${
                      isSelected ? opt.textColor : 'text-zinc-500'
                    }`}
                  >
                    {opt.label}
                  </span>
                  <span className="text-[9px] text-zinc-600 hidden sm:block">
                    {opt.description}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2 py-1">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Description (optional)
          </p>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the emergency..."
            className="min-h-[80px] resize-none border-zinc-800 bg-zinc-900/50 text-zinc-200 placeholder:text-zinc-600 focus-visible:border-red-800/50 focus-visible:ring-red-900/20"
            maxLength={300}
          />
        </div>

        <AlertDialogFooter className="flex-col gap-2 sm:flex-col pt-2">
          <AlertDialogAction
            onClick={handleConfirm}
            className="w-full bg-red-600 text-white font-semibold text-base py-3 hover:bg-red-700 focus-visible:ring-red-500/30 border-0"
          >
            Confirm Emergency
          </AlertDialogAction>
          <AlertDialogCancel
            onClick={handleCancel}
            className="w-full border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          >
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
