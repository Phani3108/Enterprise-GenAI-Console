'use client';

import { motion } from 'framer-motion';
import type { EcosystemSignal } from '@/services/intelligence/types';
import NeonCard from '@/components/ui/NeonCard';
import { GitBranch, Package, Users, Star } from 'lucide-react';

interface EcosystemActivityProps {
  ecosystem: EcosystemSignal[];
}

const activityColors = { low: '#EF4444', medium: '#F59E0B', high: '#22C55E' };

export default function EcosystemActivity({ ecosystem }: EcosystemActivityProps) {
  const sorted = [...ecosystem].sort((a, b) => b.enterpriseAdoptions - a.enterpriseAdoptions);

  return (
    <NeonCard color="#4ADE80" hoverable={false}>
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[#F8FAFC]">Ecosystem Activity</h2>
          <span className="text-[10px] text-[#64748B]">{ecosystem.length} platforms tracked</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sorted.map((e, i) => (
            <motion.div
              key={e.platform}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs font-semibold text-[#F8FAFC]">{e.platform}</p>
                  <p className="text-[10px] text-[#64748B]">{e.vendor}</p>
                </div>
                <span
                  className="text-[9px] font-medium px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${activityColors[e.communityActivity]}15`,
                    color: activityColors[e.communityActivity],
                  }}
                >
                  {e.communityActivity} activity
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-3">
                <div className="text-center">
                  <GitBranch className="w-3 h-3 mx-auto text-[#64748B] mb-1" />
                  <p className="text-sm font-bold text-[#F8FAFC]">{e.githubRepos}</p>
                  <p className="text-[8px] text-[#64748B]">Repos</p>
                </div>
                <div className="text-center">
                  <Package className="w-3 h-3 mx-auto text-[#64748B] mb-1" />
                  <p className="text-sm font-bold text-[#F8FAFC]">{e.sdkUpdates}</p>
                  <p className="text-[8px] text-[#64748B]">SDK Updates</p>
                </div>
                <div className="text-center">
                  <Users className="w-3 h-3 mx-auto text-[#64748B] mb-1" />
                  <p className="text-sm font-bold text-[#F8FAFC]">{e.enterpriseAdoptions}</p>
                  <p className="text-[8px] text-[#64748B]">Enterprises</p>
                </div>
                <div className="text-center">
                  <Star className="w-3 h-3 mx-auto text-[#64748B] mb-1" />
                  <p className="text-sm font-bold text-[#F8FAFC]">{e.devSatisfaction}</p>
                  <p className="text-[8px] text-[#64748B]">Dev Score</p>
                </div>
              </div>

              <div className="space-y-1">
                {e.keyUpdates.slice(0, 3).map((u) => (
                  <p key={u} className="text-[10px] text-[#94A3B8] flex items-start gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-[#4ADE80] mt-1.5 shrink-0" />
                    {u}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </NeonCard>
  );
}
