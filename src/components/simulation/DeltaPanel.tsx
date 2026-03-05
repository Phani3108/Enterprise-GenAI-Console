'use client';

import { motion } from 'framer-motion';
import type { CounterfactualRun } from '@/services/simulation/runSimulation';
import { TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';

interface DeltaPanelProps {
  run: CounterfactualRun;
}

function DeltaIndicator({ value, unit, inverse }: { value: number; unit: string; inverse?: boolean }) {
  const isPositive = value > 0;
  const isNegative = value < 0;
  const isNeutral = value === 0;
  const isBetter = inverse ? isPositive : isNegative;
  const isWorse = inverse ? isNegative : isPositive;

  const color = isNeutral ? '#64748B' : isBetter ? '#22C55E' : isWorse ? '#EF4444' : '#64748B';
  const Icon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;

  return (
    <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold" style={{ color }}>
      <Icon className="w-3 h-3" />
      {isPositive ? '+' : ''}{value}{unit}
    </span>
  );
}

export default function DeltaPanel({ run }: DeltaPanelProps) {
  const b = run.baselineResult;
  const c = run.counterfactualResult;

  const rows = [
    {
      label: 'Platform',
      baseline: b.platform.name,
      counterfactual: c.platform.name,
      delta: <DeltaIndicator value={run.delta.scoreDelta} unit=" pts" inverse />,
    },
    {
      label: 'Monthly Cost',
      baseline: `$${b.cost.monthly.toLocaleString()}`,
      counterfactual: `$${c.cost.monthly.toLocaleString()}`,
      delta: <DeltaIndicator value={run.delta.costDeltaPct} unit="%" />,
    },
    {
      label: 'Latency (p50)',
      baseline: `${b.latency.p50Ms}ms`,
      counterfactual: `${c.latency.p50Ms}ms`,
      delta: <DeltaIndicator value={run.delta.latencyDeltaPct} unit="%" />,
    },
    {
      label: 'Readiness',
      baseline: `${b.readiness}`,
      counterfactual: `${c.readiness}`,
      delta: <DeltaIndicator value={run.delta.readinessDelta} unit="" inverse />,
    },
    {
      label: 'Architecture',
      baseline: b.architecture,
      counterfactual: c.architecture,
      delta: b.architecture === c.architecture ? <span className="text-[10px] text-[#64748B]">unchanged</span> : <span className="text-[10px] text-[#F59E0B]">changed</span>,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden"
    >
      <div className="px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#94A3B8] font-medium">{run.parameterLabel}:</span>
          <span className="text-[#F8FAFC] font-semibold">{run.oldValue}</span>
          <ArrowRight className="w-3 h-3 text-[#64748B]" />
          <span className="text-[#A78BFA] font-semibold">{run.newValue}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/[0.04]">
              <th className="text-left py-2.5 px-4 text-[10px] text-[#64748B] font-medium w-28">Metric</th>
              <th className="text-left py-2.5 px-4 text-[10px] text-[#64748B] font-medium">Baseline</th>
              <th className="text-left py-2.5 px-4 text-[10px] text-[#64748B] font-medium">Counterfactual</th>
              <th className="text-right py-2.5 px-4 text-[10px] text-[#64748B] font-medium">Delta</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                <td className="py-2.5 px-4 text-[#94A3B8] font-medium">{r.label}</td>
                <td className="py-2.5 px-4 text-[#F8FAFC]">{r.baseline}</td>
                <td className="py-2.5 px-4 text-[#A78BFA]">{r.counterfactual}</td>
                <td className="py-2.5 px-4 text-right">{r.delta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
