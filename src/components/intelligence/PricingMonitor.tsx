'use client';

import { motion } from 'framer-motion';
import type { PricingSignal } from '@/services/intelligence/types';
import NeonCard from '@/components/ui/NeonCard';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface PricingMonitorProps {
  pricing: PricingSignal[];
}

const trendConfig = {
  decreasing: { icon: TrendingDown, color: '#22C55E', label: 'Decreasing' },
  increasing: { icon: TrendingUp, color: '#EF4444', label: 'Increasing' },
  stable: { icon: Minus, color: '#64748B', label: 'Stable' },
};

export default function PricingMonitor({ pricing }: PricingMonitorProps) {
  const llmPricing = pricing.filter((p) => p.inputCost > 0);
  const embeddingPricing = pricing.filter((p) => p.embeddingCost > 0 && p.inputCost === 0);

  return (
    <NeonCard color="#22D3EE" hoverable={false}>
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[#F8FAFC]">Pricing Monitor</h2>
          <span className="text-[10px] text-[#64748B]">per 1M tokens unless noted</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left py-2 text-[10px] text-[#64748B] font-medium">Vendor</th>
                <th className="text-left py-2 text-[10px] text-[#64748B] font-medium">Model</th>
                <th className="text-right py-2 text-[10px] text-[#64748B] font-medium">Input</th>
                <th className="text-right py-2 text-[10px] text-[#64748B] font-medium">Output</th>
                <th className="text-center py-2 text-[10px] text-[#64748B] font-medium">Trend</th>
                <th className="text-left py-2 text-[10px] text-[#64748B] font-medium pl-3">Note</th>
              </tr>
            </thead>
            <tbody>
              {llmPricing.map((p, i) => {
                const trend = trendConfig[p.trend];
                const TrendIcon = trend.icon;
                return (
                  <motion.tr
                    key={`${p.vendor}-${p.model}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-2.5 text-[#94A3B8]">{p.vendor}</td>
                    <td className="py-2.5 font-medium text-[#F8FAFC]">{p.model}</td>
                    <td className="py-2.5 text-right text-[#22D3EE] font-mono">${p.inputCost.toFixed(2)}</td>
                    <td className="py-2.5 text-right text-[#22D3EE] font-mono">${p.outputCost.toFixed(2)}</td>
                    <td className="py-2.5 text-center">
                      <span className="inline-flex items-center gap-0.5" style={{ color: trend.color }}>
                        <TrendIcon className="w-3 h-3" />
                        <span className="text-[9px]">{trend.label}</span>
                      </span>
                    </td>
                    <td className="py-2.5 pl-3 text-[10px] text-[#64748B] max-w-[180px] truncate">{p.note}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {embeddingPricing.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/[0.06]">
            <p className="text-[10px] text-[#64748B] mb-2 font-medium">Embedding Models</p>
            <div className="flex gap-3">
              {embeddingPricing.map((p) => (
                <div key={`${p.vendor}-${p.model}`} className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <p className="text-[10px] text-[#94A3B8]">{p.vendor}</p>
                  <p className="text-xs font-medium text-[#F8FAFC]">{p.model}</p>
                  <p className="text-[10px] text-[#22D3EE] font-mono mt-1">${p.embeddingCost}/{p.unit}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </NeonCard>
  );
}
