'use client';

import { motion } from 'framer-motion';
import type { ModelSignal } from '@/services/intelligence/types';
import NeonCard from '@/components/ui/NeonCard';

interface ModelReleaseTrackerProps {
  models: ModelSignal[];
}

function formatContext(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

const vendorColors: Record<string, string> = {
  Google: '#4285F4',
  OpenAI: '#10A37F',
  Anthropic: '#D4A574',
  Meta: '#0668E1',
  AWS: '#FF9900',
};

export default function ModelReleaseTracker({ models }: ModelReleaseTrackerProps) {
  const sorted = [...models].sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());

  return (
    <NeonCard color="#A78BFA" hoverable={false}>
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[#F8FAFC]">Model Release Tracker</h2>
          <span className="text-[10px] text-[#64748B]">{models.length} models tracked</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left py-2 text-[10px] text-[#64748B] font-medium">Vendor</th>
                <th className="text-left py-2 text-[10px] text-[#64748B] font-medium">Model</th>
                <th className="text-left py-2 text-[10px] text-[#64748B] font-medium">Released</th>
                <th className="text-right py-2 text-[10px] text-[#64748B] font-medium">Context</th>
                <th className="text-right py-2 text-[10px] text-[#64748B] font-medium">Latency</th>
                <th className="text-left py-2 text-[10px] text-[#64748B] font-medium pl-3">Key Strengths</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((m, i) => (
                <motion.tr
                  key={`${m.vendor}-${m.model}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-2.5">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: vendorColors[m.vendor] || '#64748B' }} />
                      <span className="text-[#94A3B8]">{m.vendor}</span>
                    </span>
                  </td>
                  <td className="py-2.5 font-medium text-[#F8FAFC]">{m.model}</td>
                  <td className="py-2.5 text-[#64748B]">
                    {new Date(m.releaseDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-2.5 text-right">
                    <span className="px-1.5 py-0.5 rounded bg-[#A78BFA]/10 text-[#A78BFA] text-[10px] font-medium">
                      {formatContext(m.contextWindow)}
                    </span>
                  </td>
                  <td className="py-2.5 text-right text-[#64748B]">{m.latencyMs}ms</td>
                  <td className="py-2.5 pl-3">
                    <div className="flex flex-wrap gap-1">
                      {m.strengths.slice(0, 2).map((s) => (
                        <span key={s} className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/[0.04] text-[#94A3B8]">{s}</span>
                      ))}
                      {m.strengths.length > 2 && (
                        <span className="text-[9px] text-[#64748B]">+{m.strengths.length - 2}</span>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </NeonCard>
  );
}
