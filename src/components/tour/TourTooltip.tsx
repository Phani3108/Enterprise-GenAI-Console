'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Play } from 'lucide-react';
import type { TourStep } from '@/tour/tourSteps';

interface TourTooltipProps {
  step: TourStep | null;
  stepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export default function TourTooltip({ step, stepIndex, totalSteps, onNext, onBack, onSkip }: TourTooltipProps) {
  const [position, setPosition] = useState<{ top: number; left: number; placement: 'bottom' | 'top' }>({
    top: 0, left: 0, placement: 'bottom',
  });

  useEffect(() => {
    if (!step) return;

    const calculatePosition = () => {
      const el = document.querySelector(step.spotlightSelector);
      if (el) {
        const r = el.getBoundingClientRect();
        const tooltipH = 220;
        const spaceBelow = window.innerHeight - r.bottom;
        const placement = spaceBelow > tooltipH + 20 ? 'bottom' : 'top';

        setPosition({
          top: placement === 'bottom' ? r.bottom + 16 : r.top - tooltipH - 16,
          left: Math.max(16, Math.min(r.left, window.innerWidth - 380)),
          placement,
        });
      } else {
        setPosition({
          top: window.innerHeight / 2 - 100,
          left: window.innerWidth / 2 - 175,
          placement: 'bottom',
        });
      }
    };

    calculatePosition();
    const timer = setInterval(calculatePosition, 500);
    return () => clearInterval(timer);
  }, [step]);

  if (!step) return null;

  const isLast = stepIndex === totalSteps - 1;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step.id}
        initial={{ opacity: 0, y: position.placement === 'bottom' ? -8 : 8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: position.placement === 'bottom' ? -8 : 8, scale: 0.96 }}
        transition={{ duration: 0.25 }}
        className="fixed z-[9999] pointer-events-auto"
        style={{ top: position.top, left: position.left }}
      >
        <div className="w-[350px] rounded-2xl bg-[#0F172A] border border-white/[0.1] shadow-2xl shadow-black/40 overflow-hidden">
          {/* Progress bar */}
          <div className="h-1 bg-white/[0.04]">
            <motion.div
              className="h-full bg-gradient-to-r from-[#4F46E5] to-[#A78BFA]"
              initial={{ width: 0 }}
              animate={{ width: `${((stepIndex + 1) / totalSteps) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          <div className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#A78BFA]/15 border border-[#A78BFA]/30 flex items-center justify-center text-[10px] font-bold text-[#A78BFA]">
                  {stepIndex + 1}
                </span>
                <h3 className="text-sm font-semibold text-[#F8FAFC]">{step.title}</h3>
              </div>
              <button
                onClick={onSkip}
                className="p-1 rounded-md hover:bg-white/[0.05] text-[#64748B] hover:text-[#94A3B8] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-[#94A3B8] leading-relaxed mb-4">{step.description}</p>

            {/* Progress dots */}
            <div className="flex items-center gap-1.5 mb-4">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className="h-1 rounded-full transition-all"
                  style={{
                    width: i === stepIndex ? 20 : 6,
                    backgroundColor: i === stepIndex ? '#A78BFA' : i < stepIndex ? '#4F46E5' : 'rgba(255,255,255,0.06)',
                  }}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <button
                onClick={onBack}
                disabled={stepIndex === 0}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-[#64748B] hover:text-[#94A3B8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-3 h-3" />
                Back
              </button>
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-[#64748B]">{stepIndex + 1} / {totalSteps}</span>
                <button
                  onClick={onNext}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#A78BFA] text-white text-xs font-medium hover:bg-[#8B5CF6] transition-colors"
                >
                  {isLast ? (
                    <>Finish Tour</>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="w-3 h-3" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
