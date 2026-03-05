'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import ConsoleLayout from '@/components/console/ConsoleLayout';
import ExplanationPanel from '@/components/brief/ExplanationPanel';
import ExperimentTimeline from '@/components/experiments/ExperimentTimeline';
import NeonCard from '@/components/ui/NeonCard';
import { useScenarioStore } from '@/store/scenarioStore';
import { useExportStore } from '@/store/exportStore';
import { generateDecisionBrief } from '@/lib/brief/generateDecisionBrief';
import { getPlatformExplanation } from '@/lib/explanations/platformExplanation';
import { getCostExplanation } from '@/lib/explanations/costExplanation';
import { getArchitectureExplanation } from '@/lib/explanations/architectureExplanation';
import { copyToClipboard } from '@/utils/clipboard';
import { fadeInUp, staggerContainer } from '@/styles/motion';
import {
  FileText, Shield, TrendingUp, AlertTriangle, Rocket, Server,
  DollarSign, BarChart3, Download, ClipboardCopy, Check, Clock,
} from 'lucide-react';

export default function BriefPage() {
  const { getActiveScenario } = useScenarioStore();
  const scenario = getActiveScenario();
  const { composeBrief, downloadExportPack, getScenarioExports } = useExportStore();
  const [copied, setCopied] = useState(false);

  const briefData = useMemo(() => {
    if (!scenario) return null;
    return generateDecisionBrief(scenario, {});
  }, [scenario]);

  const exportBrief = scenario ? composeBrief(scenario.scenarioId) : null;
  const scenarioExports = scenario ? getScenarioExports(scenario.scenarioId) : {};
  const hasExports = Object.keys(scenarioExports).length > 0;

  if (!briefData || !scenario) {
    return (
      <ConsoleLayout>
        <div className="flex items-center justify-center h-full text-[#64748B]">
          <p className="text-sm">No active scenario. Create one in Scenario Studio.</p>
        </div>
      </ConsoleLayout>
    );
  }

  const brief = briefData;
  const platformFactors = getPlatformExplanation(brief.recommendedPlatform.name);
  const costVal = parseInt(brief.costProjection.monthly.replace(/[$,]/g, ''));
  const costFactors = getCostExplanation(costVal, scenario.deployment);
  const archFactors = getArchitectureExplanation(brief.architectureSummary.pattern);

  const handleCopyBrief = async () => {
    const text = [
      `AI Strategy Decision Brief`,
      `========================`,
      `Scenario: ${scenario.name}`,
      `Institution: ${brief.institution}`,
      `Use Case: ${brief.useCase}`,
      ``,
      `Recommended Platform: ${brief.recommendedPlatform.name} (Score: ${brief.recommendedPlatform.score})`,
      `Architecture: ${brief.architectureSummary.pattern}`,
      `Monthly Cost: ${brief.costProjection.monthly}`,
      `Readiness Score: ${brief.readinessScore.overall}/100`,
      ``,
      `Risks:`,
      ...brief.risks.map((r) => `  - ${r}`),
      ``,
      `Launch Plan:`,
      ...brief.launchPlan.map((p) => `  ${p.phase}: ${p.description}`),
      ...(hasExports ? [
        ``,
        `Agent Exports:`,
        ...Object.values(scenarioExports).map((e) => `  - ${e.toolName}: ${e.summary || 'Data collected'}`),
      ] : []),
    ].join('\n');

    const ok = await copyToClipboard(text);
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  return (
    <ConsoleLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-8">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-5 h-5 text-[#22D3EE]" />
                <h1 className="text-xl font-bold text-[#F8FAFC]">AI Strategy Decision Brief</h1>
              </div>
              <p className="text-xs text-[#64748B]">
                {brief.institution} — {brief.useCase}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyBrief}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.05] border border-white/[0.08] text-xs text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <ClipboardCopy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Brief'}
              </button>
              <button
                onClick={() => scenario && downloadExportPack(scenario.scenarioId)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.05] border border-white/[0.08] text-xs text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Export JSON
              </button>
            </div>
          </motion.div>

          {/* Agent exports banner */}
          {hasExports && (
            <motion.div variants={fadeInUp} custom={0.5}>
              <NeonCard color="#22C55E" hoverable={false} className="mb-4">
                <div className="p-4">
                  <p className="text-xs font-medium text-emerald-400 mb-2">Agent Data Collected</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.values(scenarioExports).map((exp) => (
                      <span key={exp.toolId} className="px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400">
                        {exp.toolName}: {exp.summary || 'Exported'}
                      </span>
                    ))}
                  </div>
                </div>
              </NeonCard>
            </motion.div>
          )}

          {/* Platform */}
          <motion.div variants={fadeInUp} custom={1}>
            <NeonCard color="#4F46E5" hoverable={false} className="mb-4">
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Server className="w-4 h-4 text-[#4F46E5]" />
                  <h2 className="text-sm font-semibold text-[#F8FAFC]">Recommended Platform</h2>
                </div>
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-2xl font-bold text-[#F8FAFC]">{brief.recommendedPlatform.name}</span>
                  <span className="px-2.5 py-1 rounded-full bg-[#4F46E5]/15 text-[#4F46E5] text-xs font-bold">
                    Score: {brief.recommendedPlatform.score}/100
                  </span>
                </div>
                <p className="text-xs text-[#94A3B8]">{brief.recommendedPlatform.reason}</p>
              </div>
            </NeonCard>
            <ExplanationPanel title="Why Vertex AI?" factors={platformFactors} color="#4F46E5" />
          </motion.div>

          {/* Architecture */}
          <motion.div variants={fadeInUp} custom={2} className="mt-6">
            <NeonCard color="#06B6D4" hoverable={false} className="mb-4">
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-4 h-4 text-[#06B6D4]" />
                  <h2 className="text-sm font-semibold text-[#F8FAFC]">Architecture Summary</h2>
                </div>
                <p className="text-lg font-semibold text-[#F8FAFC] mb-2">{brief.architectureSummary.pattern}</p>
                <p className="text-xs text-[#94A3B8] mb-3">{brief.architectureSummary.description}</p>
                <div className="flex flex-wrap gap-2">
                  {brief.architectureSummary.components.map((c, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-[#06B6D4]/10 border border-[#06B6D4]/20 text-[10px] text-[#06B6D4] font-medium">{c}</span>
                  ))}
                </div>
              </div>
            </NeonCard>
            <ExplanationPanel title="Architecture Decisions" factors={archFactors} color="#06B6D4" />
          </motion.div>

          {/* Cost */}
          <motion.div variants={fadeInUp} custom={3} className="mt-6">
            <NeonCard color="#22D3EE" hoverable={false} className="mb-4">
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-4 h-4 text-[#22D3EE]" />
                  <h2 className="text-sm font-semibold text-[#F8FAFC]">Cost Projection</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { val: brief.costProjection.monthly, label: 'Monthly' },
                    { val: brief.costProjection.annual, label: 'Annual' },
                    { val: brief.costProjection.perRequest, label: 'Per 1K Reqs' },
                    { val: brief.costProjection.scale, label: 'Scale Target' },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-2xl font-bold text-[#F8FAFC]">{item.val}</p>
                      <p className="text-[10px] text-[#64748B]">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </NeonCard>
            <ExplanationPanel title="Cost Breakdown" factors={costFactors} color="#22D3EE" />
          </motion.div>

          {/* Readiness */}
          <motion.div variants={fadeInUp} custom={4} className="mt-6">
            <NeonCard color="#8B5CF6" hoverable={false}>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-[#8B5CF6]" />
                  <h2 className="text-sm font-semibold text-[#F8FAFC]">Enterprise Readiness Score</h2>
                  <span className="ml-auto text-2xl font-bold" style={{ color: brief.readinessScore.overall >= 70 ? '#22C55E' : brief.readinessScore.overall >= 50 ? '#F59E0B' : '#EF4444' }}>
                    {brief.readinessScore.overall}/100
                  </span>
                </div>
                <div className="space-y-3">
                  {brief.readinessScore.dimensions.map((d, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-[#94A3B8]">{d.name}</span>
                        <span className="text-[#F8FAFC] font-medium">{d.score}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${d.score}%` }} transition={{ duration: 1, delay: i * 0.1 }} className="h-full rounded-full" style={{ backgroundColor: d.score >= 70 ? '#22C55E' : d.score >= 50 ? '#F59E0B' : '#EF4444' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </NeonCard>
          </motion.div>

          {/* Risks */}
          <motion.div variants={fadeInUp} custom={5} className="mt-6">
            <NeonCard color="#F59E0B" hoverable={false}>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                  <h2 className="text-sm font-semibold text-[#F8FAFC]">Primary Risks</h2>
                </div>
                <ul className="space-y-2">
                  {brief.risks.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#94A3B8]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] mt-1.5 shrink-0" />{r}
                    </li>
                  ))}
                </ul>
              </div>
            </NeonCard>
          </motion.div>

          {/* Launch Plan */}
          <motion.div variants={fadeInUp} custom={6} className="mt-6">
            <NeonCard color="#EC4899" hoverable={false}>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Rocket className="w-4 h-4 text-[#EC4899]" />
                  <h2 className="text-sm font-semibold text-[#F8FAFC]">Recommended Launch Plan</h2>
                </div>
                <div className="space-y-4">
                  {brief.launchPlan.map((p, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-20 shrink-0"><p className="text-[10px] text-[#EC4899] font-medium">{p.timeline}</p></div>
                      <div className="flex-1 pb-4 border-b border-white/[0.04] last:border-0">
                        <p className="text-xs font-semibold text-[#F8FAFC] mb-1">{p.phase}</p>
                        <p className="text-[11px] text-[#64748B] leading-relaxed">{p.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </NeonCard>
          </motion.div>

          {/* Decision Timeline */}
          <motion.div variants={fadeInUp} custom={7} className="mt-6">
            <NeonCard color="#F59E0B" hoverable={false}>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-[#F59E0B]" />
                  <h2 className="text-sm font-semibold text-[#F8FAFC]">Decision Timeline</h2>
                </div>
                <ExperimentTimeline compact maxItems={5} />
              </div>
            </NeonCard>
          </motion.div>
        </motion.div>
      </div>
    </ConsoleLayout>
  );
}
