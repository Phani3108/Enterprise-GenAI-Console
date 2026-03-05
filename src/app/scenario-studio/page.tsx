'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConsoleLayout from '@/components/console/ConsoleLayout';
import NeonCard from '@/components/ui/NeonCard';
import GlowButton from '@/components/ui/GlowButton';
import { useScenarioStore, type Scenario } from '@/store/scenarioStore';
import { getModules } from '@/utils/moduleRegistry';
import { fadeInUp, staggerContainer } from '@/styles/motion';
import {
  FlaskConical, Plus, Copy, Trash2, Pencil, Check, X, Rocket,
} from 'lucide-react';
import Link from 'next/link';

const INSTITUTION_OPTS = [
  { value: 'tier1_bank', label: 'Tier-1 Bank' },
  { value: 'tier2_bank', label: 'Tier-2 Bank' },
  { value: 'digital_bank', label: 'Digital Bank' },
  { value: 'credit_union', label: 'Credit Union' },
  { value: 'fintech', label: 'Fintech' },
];

const USE_CASE_OPTS = [
  { value: 'customer_support', label: 'Customer Support AI' },
  { value: 'fraud_detection', label: 'Fraud Detection' },
  { value: 'compliance', label: 'Compliance Automation' },
  { value: 'underwriting', label: 'AI Underwriting' },
  { value: 'financial_advisor', label: 'Financial Advisor AI' },
];

const DATA_GRAVITY_OPTS = [
  { value: 'bigquery', label: 'BigQuery' },
  { value: 'snowflake', label: 'Snowflake' },
  { value: 's3', label: 'S3' },
  { value: 'onprem', label: 'On-Prem' },
];

const SECURITY_OPTS = [
  { value: 'standard', label: 'Standard' },
  { value: 'high', label: 'High' },
  { value: 'regulated', label: 'Regulated' },
];

const DEPLOYMENT_OPTS = [
  { value: 'cloud', label: 'Cloud' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'private', label: 'Private Cloud' },
];

const selectCls = `w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#4F46E5]/50 transition-all appearance-none`;
const inputCls = `w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#4F46E5]/50 transition-all`;

export default function ScenarioStudioPage() {
  const store = useScenarioStore();
  const { scenarios, activeScenarioId, setActiveScenario, createScenario, duplicateScenario, deleteScenario, renameScenario, updateScenario } = store;
  const active = store.getActiveScenario();
  const modules = getModules();
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameBuf, setRenameBuf] = useState('');

  const startRename = (s: Scenario) => { setRenaming(s.scenarioId); setRenameBuf(s.name); };
  const commitRename = () => { if (renaming) { renameScenario(renaming, renameBuf); setRenaming(null); } };

  return (
    <ConsoleLayout>
      <div className="flex gap-4 h-full">
        {/* Left: scenario list */}
        <div className="w-72 shrink-0 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#F8FAFC]">Scenarios</h2>
            <button
              onClick={() => createScenario()}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] text-[10px] text-white font-medium hover:shadow-lg transition-shadow"
            >
              <Plus className="w-3 h-3" /> New
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5">
            {scenarios.map((s) => (
              <div
                key={s.scenarioId}
                onClick={() => setActiveScenario(s.scenarioId)}
                className={`group p-3 rounded-xl cursor-pointer transition-all border ${
                  s.scenarioId === activeScenarioId
                    ? 'bg-white/[0.06] border-[#4F46E5]/30'
                    : 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.04]'
                }`}
              >
                {renaming === s.scenarioId ? (
                  <div className="flex items-center gap-1">
                    <input
                      value={renameBuf}
                      onChange={(e) => setRenameBuf(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && commitRename()}
                      className="flex-1 bg-transparent text-xs text-[#F8FAFC] outline-none border-b border-[#4F46E5]"
                      autoFocus
                    />
                    <button onClick={commitRename} className="text-emerald-400"><Check className="w-3 h-3" /></button>
                    <button onClick={() => setRenaming(null)} className="text-[#64748B]"><X className="w-3 h-3" /></button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <FlaskConical className="w-3.5 h-3.5 shrink-0" style={{ color: s.scenarioId === activeScenarioId ? '#4F46E5' : '#64748B' }} />
                      <span className="text-xs font-medium truncate text-[#F8FAFC]">{s.name}</span>
                    </div>
                    <div className="hidden group-hover:flex items-center gap-0.5">
                      <button onClick={(e) => { e.stopPropagation(); startRename(s); }} className="p-1 text-[#64748B] hover:text-[#94A3B8]"><Pencil className="w-2.5 h-2.5" /></button>
                      <button onClick={(e) => { e.stopPropagation(); duplicateScenario(s.scenarioId); }} className="p-1 text-[#64748B] hover:text-[#94A3B8]"><Copy className="w-2.5 h-2.5" /></button>
                      <button onClick={(e) => { e.stopPropagation(); deleteScenario(s.scenarioId); }} className="p-1 text-[#64748B] hover:text-red-400"><Trash2 className="w-2.5 h-2.5" /></button>
                    </div>
                  </div>
                )}
                <p className="text-[10px] text-[#64748B] mt-1 truncate capitalize">
                  {s.institutionType.replace(/_/g, ' ')} · {s.useCase.replace(/_/g, ' ')}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: editor + launch */}
        <div className="flex-1 overflow-y-auto">
          {active ? (
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6 pb-8">
              <motion.div variants={fadeInUp}>
                <h1 className="text-xl font-bold text-[#F8FAFC] mb-1">{active.name}</h1>
                <p className="text-xs text-[#64748B]">Configure scenario parameters, then launch agents.</p>
              </motion.div>

              <motion.div variants={fadeInUp} custom={1} className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-[#94A3B8] mb-1.5">Institution Type</label>
                  <select value={active.institutionType} onChange={(e) => updateScenario(active.scenarioId, { institutionType: e.target.value as Scenario['institutionType'] })} className={selectCls}>
                    {INSTITUTION_OPTS.map((o) => <option key={o.value} value={o.value} className="bg-[#1E293B]">{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#94A3B8] mb-1.5">Use Case</label>
                  <select value={active.useCase} onChange={(e) => updateScenario(active.scenarioId, { useCase: e.target.value as Scenario['useCase'] })} className={selectCls}>
                    {USE_CASE_OPTS.map((o) => <option key={o.value} value={o.value} className="bg-[#1E293B]">{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#94A3B8] mb-1.5">Data Gravity</label>
                  <select value={active.dataGravity} onChange={(e) => updateScenario(active.scenarioId, { dataGravity: e.target.value as Scenario['dataGravity'] })} className={selectCls}>
                    {DATA_GRAVITY_OPTS.map((o) => <option key={o.value} value={o.value} className="bg-[#1E293B]">{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#94A3B8] mb-1.5">Security Level</label>
                  <select value={active.security} onChange={(e) => updateScenario(active.scenarioId, { security: e.target.value as Scenario['security'] })} className={selectCls}>
                    {SECURITY_OPTS.map((o) => <option key={o.value} value={o.value} className="bg-[#1E293B]">{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#94A3B8] mb-1.5">Deployment</label>
                  <select value={active.deployment} onChange={(e) => updateScenario(active.scenarioId, { deployment: e.target.value as Scenario['deployment'] })} className={selectCls}>
                    {DEPLOYMENT_OPTS.map((o) => <option key={o.value} value={o.value} className="bg-[#1E293B]">{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#94A3B8] mb-1.5">Latency Target (ms)</label>
                  <input type="number" value={active.latencyTargetMs} onChange={(e) => updateScenario(active.scenarioId, { latencyTargetMs: Number(e.target.value) })} className={inputCls} />
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} custom={2}>
                <p className="text-xs text-[#94A3B8] mb-3 font-medium">Traffic</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-[#64748B] mb-1">Requests / Month</label>
                    <input type="number" value={active.traffic.requestsPerMonth} onChange={(e) => updateScenario(active.scenarioId, { traffic: { ...active.traffic, requestsPerMonth: Number(e.target.value) } })} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#64748B] mb-1">Monthly Active Users</label>
                    <input type="number" value={active.traffic.mau} onChange={(e) => updateScenario(active.scenarioId, { traffic: { ...active.traffic, mau: Number(e.target.value) } })} className={inputCls} />
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} custom={3}>
                <p className="text-xs text-[#94A3B8] mb-3 font-medium">RAG Configuration</p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] text-[#64748B] mb-1">Top K</label>
                    <input type="number" value={active.rag.topK} onChange={(e) => updateScenario(active.scenarioId, { rag: { ...active.rag, topK: Number(e.target.value) } })} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#64748B] mb-1">Avg Doc Tokens</label>
                    <input type="number" value={active.rag.avgDocTokens} onChange={(e) => updateScenario(active.scenarioId, { rag: { ...active.rag, avgDocTokens: Number(e.target.value) } })} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#64748B] mb-1">Dimensions</label>
                    <input type="number" value={active.rag.dimensions} onChange={(e) => updateScenario(active.scenarioId, { rag: { ...active.rag, dimensions: Number(e.target.value) } })} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#64748B] mb-1">Cache Rate</label>
                    <input type="number" step="0.01" value={active.rag.cacheRate} onChange={(e) => updateScenario(active.scenarioId, { rag: { ...active.rag, cacheRate: Number(e.target.value) } })} className={inputCls} />
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} custom={4}>
                <label className="block text-xs text-[#94A3B8] mb-1.5">Notes</label>
                <textarea value={active.notes || ''} onChange={(e) => updateScenario(active.scenarioId, { notes: e.target.value })} rows={3} className={`${inputCls} resize-none`} placeholder="Optional notes about this scenario..." />
              </motion.div>

              <motion.div variants={fadeInUp} custom={5}>
                <p className="text-xs text-[#94A3B8] mb-3 font-medium">Launch Agent</p>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                  {modules.map((m) => (
                    <Link key={m.id} href={m.route}>
                      <NeonCard color={m.color} hoverable className="p-3 text-center">
                        <Rocket className="w-4 h-4 mx-auto mb-1.5" style={{ color: m.color }} />
                        <p className="text-[10px] font-medium text-[#F8FAFC]">{m.shortName}</p>
                      </NeonCard>
                    </Link>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-full text-[#64748B]">
              <p className="text-sm">Select or create a scenario.</p>
            </div>
          )}
        </div>
      </div>
    </ConsoleLayout>
  );
}
