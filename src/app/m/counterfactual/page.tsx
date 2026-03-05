'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import ConsoleLayout from '@/components/console/ConsoleLayout';
import NeonCard from '@/components/ui/NeonCard';
import DeltaPanel from '@/components/simulation/DeltaPanel';
import SimulationCard from '@/components/simulation/SimulationCard';
import { useScenarioStore } from '@/store/scenarioStore';
import { useCounterfactualStore } from '@/store/counterfactualStore';
import { useExperimentStore } from '@/store/experimentStore';
import { runCounterfactual, QUICK_SIMULATIONS, type CounterfactualRun, type CounterfactualChange } from '@/services/simulation/runSimulation';
import { fadeInUp, staggerContainer } from '@/styles/motion';
import { FlaskConical, Trash2, Zap, History, ArrowRight } from 'lucide-react';

export default function CounterfactualPage() {
  const { getActiveScenario } = useScenarioStore();
  const { addRun, getScenarioRuns, clearScenarioRuns } = useCounterfactualStore();
  const { addExperiment } = useExperimentStore();
  const scenario = getActiveScenario();
  const [selected, setSelected] = useState<CounterfactualRun | null>(null);

  const runs = scenario ? getScenarioRuns(scenario.scenarioId) : [];

  const handleRunSimulation = useCallback(
    (change: CounterfactualChange) => {
      if (!scenario) return;
      const result = runCounterfactual(scenario, change);
      addRun(result);
      setSelected(result);

      addExperiment({
        id: result.id,
        scenarioId: scenario.scenarioId,
        toolId: 'counterfactual',
        toolName: 'Counterfactual Simulation',
        timestamp: result.timestamp,
        summary: `What-if: ${result.parameterLabel} → ${result.newValue} (Cost ${result.delta.costDeltaPct > 0 ? '+' : ''}${result.delta.costDeltaPct}%, Readiness ${result.delta.readinessDelta > 0 ? '+' : ''}${result.delta.readinessDelta})`,
        highlights: [
          `Baseline: ${result.baselineResult.platform.name} at $${result.baselineResult.cost.monthly.toLocaleString()}/mo`,
          `Alternative: ${result.counterfactualResult.platform.name} at $${result.counterfactualResult.cost.monthly.toLocaleString()}/mo`,
          `Net delta: Cost ${result.delta.costDeltaPct}%, Latency ${result.delta.latencyDeltaPct}%, Readiness ${result.delta.readinessDelta}`,
        ],
      });
    },
    [scenario, addRun, addExperiment]
  );

  if (!scenario) {
    return (
      <ConsoleLayout>
        <div className="flex items-center justify-center h-full text-[#64748B]">
          <p className="text-sm">No active scenario. Create one in Scenario Studio.</p>
        </div>
      </ConsoleLayout>
    );
  }

  return (
    <ConsoleLayout>
      <div className="max-w-5xl mx-auto pb-8">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
          {/* Header */}
          <motion.div variants={fadeInUp} className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FlaskConical className="w-5 h-5 text-[#A78BFA]" />
                <h1 className="text-xl font-bold text-[#F8FAFC]">Counterfactual Simulation</h1>
              </div>
              <p className="text-xs text-[#64748B]">
                What if you changed the assumptions? Explore alternative realities for <span className="text-[#94A3B8]">{scenario.name}</span>
              </p>
            </div>
            {runs.length > 0 && (
              <button
                onClick={() => { clearScenarioRuns(scenario.scenarioId); setSelected(null); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-xs text-[#64748B] hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Clear
              </button>
            )}
          </motion.div>

          {/* Baseline Summary */}
          <motion.div variants={fadeInUp} custom={1}>
            <NeonCard color="#4F46E5" hoverable={false}>
              <div className="p-4">
                <p className="text-[10px] font-medium tracking-wider uppercase text-[#4F46E5] mb-2">Current Baseline</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <p className="text-[10px] text-[#64748B]">Platform</p>
                    <p className="text-sm font-semibold text-[#F8FAFC]">
                      {scenario.dataGravity === 'bigquery' ? 'Vertex AI' : scenario.dataGravity === 's3' ? 'AWS Bedrock' : 'Azure OpenAI'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#64748B]">Traffic</p>
                    <p className="text-sm font-semibold text-[#F8FAFC]">{(scenario.traffic.requestsPerMonth / 1_000_000).toFixed(1)}M/mo</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#64748B]">Deployment</p>
                    <p className="text-sm font-semibold text-[#F8FAFC] capitalize">{scenario.deployment}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#64748B]">Security</p>
                    <p className="text-sm font-semibold text-[#F8FAFC] capitalize">{scenario.security}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#64748B]">Latency Target</p>
                    <p className="text-sm font-semibold text-[#F8FAFC]">{scenario.latencyTargetMs}ms</p>
                  </div>
                </div>
              </div>
            </NeonCard>
          </motion.div>

          {/* Quick Simulations */}
          <motion.div variants={fadeInUp} custom={2}>
            <NeonCard color="#A78BFA" hoverable={false}>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-[#A78BFA]" />
                  <h2 className="text-sm font-semibold text-[#F8FAFC]">Quick Simulations</h2>
                  <span className="text-[10px] text-[#64748B]">Click to explore alternative scenarios</span>
                </div>
                <div data-tour="quick-simulations" className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {QUICK_SIMULATIONS.map((sim) => (
                    <button
                      key={sim.label}
                      onClick={() => handleRunSimulation(sim.change)}
                      className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-[#A78BFA]/10 hover:border-[#A78BFA]/30 transition-all text-left group"
                    >
                      <span className="text-lg mb-1 block">{sim.icon}</span>
                      <p className="text-xs font-semibold text-[#F8FAFC] group-hover:text-[#A78BFA] transition-colors">{sim.label}</p>
                      <p className="text-[10px] text-[#64748B] mt-0.5">{sim.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </NeonCard>
          </motion.div>

          {/* Results Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Selected result */}
            <div className="lg:col-span-2">
              {selected ? (
                <motion.div variants={fadeInUp} custom={3}>
                  <div className="flex items-center gap-2 mb-3">
                    <ArrowRight className="w-4 h-4 text-[#A78BFA]" />
                    <h2 className="text-sm font-semibold text-[#F8FAFC]">Comparison Result</h2>
                  </div>
                  <DeltaPanel run={selected} />

                  {/* Recommendation */}
                  <div className="mt-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <p className="text-[10px] font-medium text-[#F59E0B] mb-1">Counterfactual Assessment</p>
                    {selected.delta.costDeltaPct > 15 || selected.delta.readinessDelta < -5 ? (
                      <p className="text-xs text-[#94A3B8]">
                        The alternative shows <span className="text-red-400">higher cost (+{selected.delta.costDeltaPct}%)</span>
                        {selected.delta.readinessDelta < 0 && <span> and <span className="text-red-400">lower readiness ({selected.delta.readinessDelta})</span></span>}.
                        <span className="text-[#F8FAFC] font-medium"> Recommendation unchanged: stay with baseline.</span>
                      </p>
                    ) : selected.delta.costDeltaPct < -5 || selected.delta.readinessDelta > 3 ? (
                      <p className="text-xs text-[#94A3B8]">
                        The alternative shows <span className="text-emerald-400">improvements</span>.
                        <span className="text-[#F8FAFC] font-medium"> Consider this alternative — further analysis recommended.</span>
                      </p>
                    ) : (
                      <p className="text-xs text-[#94A3B8]">
                        The alternative shows <span className="text-[#F8FAFC]">comparable results</span>.
                        Decision can proceed with either option based on organizational preference.
                      </p>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="flex items-center justify-center h-64 text-[#64748B]">
                  <div className="text-center">
                    <FlaskConical className="w-8 h-8 mx-auto mb-3 opacity-40" />
                    <p className="text-sm">Run a simulation to see results</p>
                    <p className="text-[10px] mt-1">Use the quick buttons above or the history panel</p>
                  </div>
                </div>
              )}
            </div>

            {/* History */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <History className="w-4 h-4 text-[#64748B]" />
                <h2 className="text-sm font-semibold text-[#F8FAFC]">Simulation History</h2>
                <span className="text-[10px] text-[#64748B]">{runs.length}</span>
              </div>
              {runs.length === 0 ? (
                <p className="text-[10px] text-[#64748B] p-4 rounded-lg bg-white/[0.02] border border-white/[0.04]">No simulations yet</p>
              ) : (
                <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                  {runs.map((run, i) => (
                    <SimulationCard
                      key={run.id}
                      run={run}
                      index={i}
                      onClick={() => setSelected(run)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </ConsoleLayout>
  );
}
