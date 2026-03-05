'use client';

import { motion } from 'framer-motion';
import type { CounterfactualRun } from '@/services/simulation/runSimulation';
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';

interface SimulationCardProps {
  run: CounterfactualRun;
  index: number;
  onClick?: () => void;
}

export default function SimulationCard({ run, index, onClick }: SimulationCardProps) {
  const netImpact = run.delta.scoreDelta - (run.delta.costDeltaPct > 0 ? 1 : 0) + run.delta.readinessDelta * 0.1;
  const isPositive = netImpact > 0;
  const isNegative = netImpact < -1;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-[#94A3B8]">{run.parameterLabel}</span>
          <ArrowRight className="w-2.5 h-2.5 text-[#64748B]" />
          <span className="text-xs font-semibold text-[#A78BFA]">{run.newValue}</span>
        </div>
        <span className="text-[9px] text-[#64748B]">
          {new Date(run.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      <div className="flex items-center gap-4 text-[10px]">
        <span className={run.delta.costDeltaPct > 0 ? 'text-red-400' : run.delta.costDeltaPct < 0 ? 'text-emerald-400' : 'text-[#64748B]'}>
          Cost {run.delta.costDeltaPct > 0 ? '+' : ''}{run.delta.costDeltaPct}%
        </span>
        <span className={run.delta.latencyDeltaPct > 0 ? 'text-red-400' : run.delta.latencyDeltaPct < 0 ? 'text-emerald-400' : 'text-[#64748B]'}>
          Latency {run.delta.latencyDeltaPct > 0 ? '+' : ''}{run.delta.latencyDeltaPct}%
        </span>
        <span className={run.delta.readinessDelta > 0 ? 'text-emerald-400' : run.delta.readinessDelta < 0 ? 'text-red-400' : 'text-[#64748B]'}>
          Readiness {run.delta.readinessDelta > 0 ? '+' : ''}{run.delta.readinessDelta}
        </span>
        <span className="ml-auto">
          {isPositive ? (
            <span className="flex items-center gap-0.5 text-emerald-400"><TrendingUp className="w-2.5 h-2.5" /> Better</span>
          ) : isNegative ? (
            <span className="flex items-center gap-0.5 text-red-400"><TrendingDown className="w-2.5 h-2.5" /> Worse</span>
          ) : (
            <span className="text-[#64748B]">Comparable</span>
          )}
        </span>
      </div>
    </motion.div>
  );
}
