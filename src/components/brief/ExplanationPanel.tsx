'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ExplanationFactor } from '@/lib/explanations/platformExplanation';
import { ChevronDown, Info } from 'lucide-react';

interface ExplanationPanelProps {
  title: string;
  subtitle?: string;
  factors: ExplanationFactor[];
  color?: string;
}

const categoryColors: Record<string, string> = {
  data: '#3B82F6',
  compliance: '#8B5CF6',
  performance: '#06B6D4',
  integration: '#4F46E5',
  cost: '#22D3EE',
  ecosystem: '#EC4899',
};

export default function ExplanationPanel({
  title,
  subtitle,
  factors,
  color = '#4F46E5',
}: ExplanationPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5" style={{ color }} />
          <span className="text-xs font-medium text-[#F8FAFC]">{title}</span>
          {subtitle && <span className="text-[10px] text-[#64748B]">{subtitle}</span>}
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2 border-t border-white/[0.04] pt-3">
              <p className="text-[10px] tracking-widest uppercase text-[#64748B] mb-2">Decision Factors</p>
              {factors.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 py-2 px-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                >
                  <div
                    className="mt-0.5 w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-[10px] font-bold"
                    style={{
                      backgroundColor: `${categoryColors[f.category] || color}15`,
                      color: categoryColors[f.category] || color,
                    }}
                  >
                    {f.impact.startsWith('+') || f.impact.startsWith('-') ? f.impact : '→'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#F8FAFC]">{f.factor}</p>
                    <p className="text-[11px] text-[#64748B] leading-relaxed mt-0.5">{f.reason}</p>
                  </div>
                  <span
                    className="text-[9px] font-medium px-1.5 py-0.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: `${categoryColors[f.category] || color}15`,
                      color: categoryColors[f.category] || color,
                    }}
                  >
                    {f.category}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
