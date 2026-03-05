'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import ConsoleLayout from '@/components/console/ConsoleLayout';
import NeonCard from '@/components/ui/NeonCard';
import GlowButton from '@/components/ui/GlowButton';
import ExperimentTimeline from '@/components/experiments/ExperimentTimeline';
import { getModules } from '@/utils/moduleRegistry';
import { useScenarioStore } from '@/store/scenarioStore';
import { fadeInUp, staggerContainer } from '@/styles/motion';
import { ArrowRight, FileText, GitBranch, FlaskConical, Clock } from 'lucide-react';

export default function ConsolePage() {
  const modules = getModules();
  const { getActiveScenario } = useScenarioStore();
  const active = getActiveScenario();

  return (
    <ConsoleLayout>
      <div className="max-w-5xl mx-auto space-y-8 pb-8">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-4">
          <motion.div variants={fadeInUp} className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#F8FAFC]">AI Strategy Workspace</h1>
              <p className="text-sm text-[#64748B] mt-1">
                Configure a scenario, then run agents to build your decision brief.
              </p>
            </div>
            <Link href="/scenario-studio">
              <GlowButton variant="secondary" size="sm">
                <FlaskConical className="w-3.5 h-3.5" />
                Scenario Studio
              </GlowButton>
            </Link>
          </motion.div>

          {active && (
            <motion.div
              variants={fadeInUp}
              custom={1}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-6 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[#64748B]">Active Scenario</span>
              </div>
              <div className="h-4 w-px bg-white/[0.08]" />
              <div className="flex items-center gap-4 text-[#94A3B8]">
                <span className="font-medium text-[#F8FAFC]">{active.name}</span>
                <span className="text-[#64748B]">·</span>
                <span className="capitalize">{active.institutionType.replace(/_/g, ' ')}</span>
                <span className="text-[#64748B]">·</span>
                <span className="capitalize">{active.useCase.replace(/_/g, ' ')}</span>
                <span className="text-[#64748B]">·</span>
                <span>{(active.traffic.requestsPerMonth / 1_000_000).toFixed(1)}M req/mo</span>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Agent grid */}
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
          <p className="text-xs font-medium tracking-widest uppercase text-[#64748B] mb-4">AI Agents</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((mod, i) => (
              <NeonCard key={mod.id} color={mod.color} index={i}>
                <Link href={mod.route} className="block p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: `${mod.color}15`,
                        border: `1px solid ${mod.color}30`,
                      }}
                    >
                      <Image src={`/icons/${mod.icon}.svg`} alt={mod.name} width={20} height={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#F8FAFC]">{mod.shortName}</h3>
                      <p className="text-[10px] text-[#64748B]">{mod.name}</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-2">{mod.description}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-medium" style={{ color: mod.color }}>
                    Launch Agent <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              </NeonCard>
            ))}
          </div>
        </motion.div>

        {/* Quick actions */}
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
          <p className="text-xs font-medium tracking-widest uppercase text-[#64748B] mb-4">Strategic Tools</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <NeonCard color="#22D3EE" index={0}>
              <Link href="/m/brief" className="block p-5">
                <FileText className="w-5 h-5 text-[#22D3EE] mb-2" />
                <h3 className="text-sm font-semibold text-[#F8FAFC]">Decision Brief</h3>
                <p className="text-xs text-[#64748B] mt-1">Aggregated executive summary</p>
              </Link>
            </NeonCard>
            <NeonCard color="#A78BFA" index={1}>
              <Link href="/m/graph" className="block p-5">
                <GitBranch className="w-5 h-5 text-[#A78BFA] mb-2" />
                <h3 className="text-sm font-semibold text-[#F8FAFC]">Scenario Graph</h3>
                <p className="text-xs text-[#64748B] mt-1">Visualize decision trees</p>
              </Link>
            </NeonCard>
            <NeonCard color="#F59E0B" index={2}>
              <Link href="/m/experiments" className="block p-5">
                <Clock className="w-5 h-5 text-[#F59E0B] mb-2" />
                <h3 className="text-sm font-semibold text-[#F8FAFC]">Experiments</h3>
                <p className="text-xs text-[#64748B] mt-1">Decision timeline & history</p>
              </Link>
            </NeonCard>
            <NeonCard color="#4F46E5" index={3}>
              <Link href="/scenario-studio" className="block p-5">
                <FlaskConical className="w-5 h-5 text-[#4F46E5] mb-2" />
                <h3 className="text-sm font-semibold text-[#F8FAFC]">Scenario Studio</h3>
                <p className="text-xs text-[#64748B] mt-1">Create & manage scenarios</p>
              </Link>
            </NeonCard>
          </div>
        </motion.div>

        {/* Recent experiment timeline */}
        {active && (
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <NeonCard color="#F59E0B" hoverable={false}>
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#F59E0B]" />
                    <h3 className="text-sm font-semibold text-[#F8FAFC]">Recent Activity</h3>
                  </div>
                  <Link href="/m/experiments" className="text-[10px] text-[#64748B] hover:text-[#94A3B8] transition-colors">
                    View all →
                  </Link>
                </div>
                <ExperimentTimeline compact maxItems={3} />
              </div>
            </NeonCard>
          </motion.div>
        )}
      </div>
    </ConsoleLayout>
  );
}
