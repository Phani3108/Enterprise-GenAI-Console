'use client';

import { motion } from 'framer-motion';
import ConsoleLayout from '@/components/console/ConsoleLayout';
import ModelReleaseTracker from '@/components/intelligence/ModelReleaseTracker';
import PricingMonitor from '@/components/intelligence/PricingMonitor';
import EcosystemActivity from '@/components/intelligence/EcosystemActivity';
import InsightCard from '@/components/intelligence/InsightCard';
import NeonCard from '@/components/ui/NeonCard';
import { useIntelligenceStore } from '@/store/intelligenceStore';
import { fadeInUp, staggerContainer } from '@/styles/motion';
import { Radio, RefreshCw, Zap } from 'lucide-react';

export default function IntelligencePage() {
  const { models, pricing, ecosystem, insights, lastRefreshed, loading, refresh } = useIntelligenceStore();

  return (
    <ConsoleLayout>
      <div className="max-w-5xl mx-auto pb-8">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
          <motion.div variants={fadeInUp} className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Radio className="w-5 h-5 text-[#A78BFA]" />
                <h1 className="text-xl font-bold text-[#F8FAFC]">Market Intelligence</h1>
                <span className="px-2 py-0.5 rounded-full bg-[#A78BFA]/10 text-[#A78BFA] text-[9px] font-medium">LIVE</span>
              </div>
              <p className="text-xs text-[#64748B]">
                Model releases, pricing shifts, and developer ecosystem signals that influence platform decisions.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {lastRefreshed && (
                <span className="text-[10px] text-[#64748B]">
                  Updated {new Date(lastRefreshed).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
              <button
                onClick={refresh}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-xs text-[#94A3B8] hover:text-[#F8FAFC] transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </motion.div>

          {/* Insights */}
          <motion.div variants={fadeInUp} custom={1}>
            <NeonCard color="#F59E0B" hoverable={false}>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-[#F59E0B]" />
                  <h2 className="text-sm font-semibold text-[#F8FAFC]">Intelligence Insights</h2>
                  <span className="text-[10px] text-[#64748B]">{insights.length} signals detected</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {insights.map((insight, i) => (
                    <InsightCard key={insight.id} insight={insight} index={i} />
                  ))}
                </div>
              </div>
            </NeonCard>
          </motion.div>

          {/* Model releases */}
          <motion.div variants={fadeInUp} custom={2}>
            <ModelReleaseTracker models={models} />
          </motion.div>

          {/* Pricing */}
          <motion.div variants={fadeInUp} custom={3}>
            <PricingMonitor pricing={pricing} />
          </motion.div>

          {/* Ecosystem */}
          <motion.div variants={fadeInUp} custom={4}>
            <EcosystemActivity ecosystem={ecosystem} />
          </motion.div>
        </motion.div>
      </div>
    </ConsoleLayout>
  );
}
