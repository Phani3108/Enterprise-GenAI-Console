'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTourStore } from '@/store/tourStore';
import { TOUR_STEPS } from '@/tour/tourSteps';
import { X } from 'lucide-react';

export default function TourProgressBar() {
  const { active, currentStepIndex, totalSteps, skip } = useTourStore();

  if (!active) return null;

  const step = TOUR_STEPS[currentStepIndex];
  const pct = ((currentStepIndex + 1) / totalSteps) * 100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-0 left-0 right-0 z-[10000] h-8 bg-[#0B1020]/95 backdrop-blur-sm border-b border-[#A78BFA]/20 flex items-center px-4 gap-3"
      >
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#A78BFA] animate-pulse" />
          <span className="text-[10px] font-medium text-[#A78BFA]">Guided Tour</span>
        </div>

        <div className="flex-1 max-w-xs">
          <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#4F46E5] to-[#A78BFA] rounded-full"
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        <span className="text-[10px] text-[#64748B]">
          {currentStepIndex + 1}/{totalSteps} · {step?.title || ''}
        </span>

        <span className="text-[9px] text-[#64748B] ml-auto">
          Press → for next · Esc to exit
        </span>

        <button
          onClick={skip}
          className="p-0.5 rounded hover:bg-white/[0.05] text-[#64748B] hover:text-[#94A3B8] transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
