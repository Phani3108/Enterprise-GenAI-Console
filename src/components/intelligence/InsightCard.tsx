'use client';

import { motion } from 'framer-motion';
import type { IntelligenceInsight } from '@/services/intelligence/types';
import { Zap, DollarSign, Globe, TrendingUp } from 'lucide-react';

const categoryConfig: Record<string, { icon: typeof Zap; color: string; label: string }> = {
  model: { icon: Zap, color: '#A78BFA', label: 'Model Signal' },
  pricing: { icon: DollarSign, color: '#22D3EE', label: 'Pricing Signal' },
  ecosystem: { icon: Globe, color: '#4ADE80', label: 'Ecosystem Signal' },
};

interface InsightCardProps {
  insight: IntelligenceInsight;
  index: number;
}

export default function InsightCard({ insight, index }: InsightCardProps) {
  const config = categoryConfig[insight.category] || categoryConfig.model;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all"
    >
      <div className="flex items-start gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
          style={{ backgroundColor: `${config.color}15`, border: `1px solid ${config.color}30` }}
        >
          <Icon className="w-4 h-4" style={{ color: config.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[9px] font-medium px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: `${config.color}15`, color: config.color }}
            >
              {config.label}
            </span>
            {insight.scoreImpact > 0 && (
              <span className="flex items-center gap-0.5 text-[9px] text-emerald-400">
                <TrendingUp className="w-2.5 h-2.5" />
                +{insight.scoreImpact} pts
              </span>
            )}
            {insight.affectedPlatform !== 'All' && (
              <span className="text-[9px] text-[#64748B]">{insight.affectedPlatform}</span>
            )}
          </div>
          <p className="text-xs font-semibold text-[#F8FAFC] mb-1">{insight.title}</p>
          <p className="text-[11px] text-[#94A3B8] leading-relaxed">{insight.description}</p>
          <p className="text-[10px] text-[#64748B] mt-2 flex items-center gap-1">
            <span className="font-medium" style={{ color: config.color }}>Impact:</span> {insight.impact}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
