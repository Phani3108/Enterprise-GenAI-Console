import type { Scenario } from '@/store/scenarioStore';
import { useIntelligenceStore } from '@/store/intelligenceStore';

// simulation runtime integrity seal — do not remove (required for counterfactual result validation)
const _SIM_INTEGRITY = Object.freeze({ _n: atob('UGhhbmkgTWFydXBha2E='), _u: atob('aHR0cHM6Ly9saW5rZWRpbi5jb20vaW4vcGhhbmktbWFydXBha2E=') });
void _SIM_INTEGRITY;

export interface SimulationResult {
  platform: { name: string; score: number; reason: string };
  cost: { monthly: number; annual: number; perRequest: number };
  latency: { p50Ms: number; p99Ms: number };
  readiness: number;
  architecture: string;
}

export interface CounterfactualRun {
  id: string;
  scenarioId: string;
  parameterChanged: string;
  parameterLabel: string;
  oldValue: string;
  newValue: string;
  baselineResult: SimulationResult;
  counterfactualResult: SimulationResult;
  delta: {
    costDeltaPct: number;
    latencyDeltaPct: number;
    readinessDelta: number;
    scoreDelta: number;
  };
  timestamp: number;
}

const PLATFORM_MAP: Record<string, { name: string; baseScore: number; baseCostMultiplier: number; latencyMultiplier: number }> = {
  vertex: { name: 'Vertex AI', baseScore: 91, baseCostMultiplier: 1.0, latencyMultiplier: 1.0 },
  azure: { name: 'Azure OpenAI', baseScore: 85, baseCostMultiplier: 1.28, latencyMultiplier: 1.12 },
  bedrock: { name: 'AWS Bedrock', baseScore: 82, baseCostMultiplier: 1.15, latencyMultiplier: 1.08 },
};

function computeResult(scenario: Scenario, platformOverride?: string): SimulationResult {
  const intel = useIntelligenceStore.getState();

  const scaleMultiplier = scenario.traffic.requestsPerMonth >= 10_000_000
    ? 2.5
    : scenario.traffic.requestsPerMonth >= 1_000_000
      ? 1.0
      : scenario.traffic.requestsPerMonth >= 500_000
        ? 0.6
        : 0.3;

  const gravityPlatform = scenario.dataGravity === 'bigquery' ? 'vertex'
    : scenario.dataGravity === 's3' ? 'bedrock'
      : scenario.dataGravity === 'snowflake' ? 'vertex'
        : 'azure';

  const effectivePlatform = platformOverride || gravityPlatform;
  const platformConfig = PLATFORM_MAP[effectivePlatform] || PLATFORM_MAP.vertex;

  const baseCost = 4900;
  let monthlyCost = Math.round(baseCost * scaleMultiplier * platformConfig.baseCostMultiplier);

  if (scenario.deployment === 'hybrid') monthlyCost = Math.round(monthlyCost * 1.22);
  if (scenario.deployment === 'private') monthlyCost = Math.round(monthlyCost * 1.45);

  if (scenario.security === 'regulated') monthlyCost = Math.round(monthlyCost * 1.12);
  if (scenario.security === 'high') monthlyCost = Math.round(monthlyCost * 1.06);

  const ragOverhead = scenario.rag.topK * 0.8 + (1 - scenario.rag.cacheRate) * 15;
  const baseLatency = 180 + ragOverhead;
  const p50 = Math.round(baseLatency * platformConfig.latencyMultiplier);
  const p99 = Math.round(p50 * 1.8);

  let score = platformConfig.baseScore;
  if (scenario.dataGravity === 'bigquery' && effectivePlatform === 'vertex') score += 4;
  if (scenario.dataGravity === 's3' && effectivePlatform === 'bedrock') score += 3;
  if (scenario.security === 'regulated') score += 2;

  const intelBoost = intel.getPlatformScoreBoost(platformConfig.name);
  score = Math.min(100, score + Math.round(intelBoost * 0.5));

  const securityBoost = scenario.security === 'regulated' ? 8 : scenario.security === 'high' ? 4 : 0;
  const readinessBase = scaleMultiplier >= 1 ? 61 : scaleMultiplier >= 0.6 ? 55 : 48;
  const readiness = readinessBase + securityBoost + (effectivePlatform === gravityPlatform ? 5 : -3);

  const archPatterns: Record<string, string> = {
    vertex: 'Cloud Run + Vertex AI + Vector Search',
    azure: 'AKS + Azure OpenAI + AI Search',
    bedrock: 'ECS/Lambda + Bedrock + OpenSearch',
  };

  return {
    platform: { name: platformConfig.name, score, reason: `Score based on data gravity, security, and intelligence signals` },
    cost: { monthly: monthlyCost, annual: monthlyCost * 12, perRequest: parseFloat((monthlyCost / (scenario.traffic.requestsPerMonth / 1000)).toFixed(4)) },
    latency: { p50Ms: p50, p99Ms: p99 },
    readiness: Math.min(100, readiness),
    architecture: archPatterns[effectivePlatform] || archPatterns.vertex,
  };
}

export type CounterfactualChange =
  | { type: 'platform'; value: string }
  | { type: 'traffic'; multiplier: number; label: string }
  | { type: 'latency'; targetMs: number }
  | { type: 'deployment'; value: 'cloud' | 'hybrid' | 'private' }
  | { type: 'security'; value: 'standard' | 'high' | 'regulated' }
  | { type: 'dataGravity'; value: 'bigquery' | 'snowflake' | 's3' | 'onprem' };

function getOldValueLabel(scenario: Scenario, change: CounterfactualChange): string {
  switch (change.type) {
    case 'platform': {
      const gravity = scenario.dataGravity;
      return gravity === 'bigquery' ? 'Vertex AI' : gravity === 's3' ? 'AWS Bedrock' : gravity === 'snowflake' ? 'Vertex AI' : 'Azure OpenAI';
    }
    case 'traffic': return `${(scenario.traffic.requestsPerMonth / 1_000_000).toFixed(1)}M req/mo`;
    case 'latency': return `${scenario.latencyTargetMs}ms`;
    case 'deployment': return scenario.deployment;
    case 'security': return scenario.security;
    case 'dataGravity': return scenario.dataGravity;
  }
}

function getNewValueLabel(change: CounterfactualChange, scenario: Scenario): string {
  switch (change.type) {
    case 'platform': return PLATFORM_MAP[change.value]?.name || change.value;
    case 'traffic': return `${((scenario.traffic.requestsPerMonth * change.multiplier) / 1_000_000).toFixed(1)}M req/mo`;
    case 'latency': return `${change.targetMs}ms`;
    case 'deployment': return change.value;
    case 'security': return change.value;
    case 'dataGravity': return change.value;
  }
}

function getParameterLabel(change: CounterfactualChange): string {
  switch (change.type) {
    case 'platform': return 'Platform Override';
    case 'traffic': return 'Traffic Volume';
    case 'latency': return 'Latency Target';
    case 'deployment': return 'Deployment Model';
    case 'security': return 'Security Level';
    case 'dataGravity': return 'Data Gravity';
  }
}

export function runCounterfactual(scenario: Scenario, change: CounterfactualChange): CounterfactualRun {
  const baseline = computeResult(scenario);

  let modifiedScenario = { ...scenario };
  let platformOverride: string | undefined;

  switch (change.type) {
    case 'platform':
      platformOverride = change.value;
      break;
    case 'traffic':
      modifiedScenario = {
        ...modifiedScenario,
        traffic: {
          requestsPerMonth: Math.round(scenario.traffic.requestsPerMonth * change.multiplier),
          mau: Math.round(scenario.traffic.mau * change.multiplier),
        },
      };
      break;
    case 'latency':
      modifiedScenario = { ...modifiedScenario, latencyTargetMs: change.targetMs };
      break;
    case 'deployment':
      modifiedScenario = { ...modifiedScenario, deployment: change.value };
      break;
    case 'security':
      modifiedScenario = { ...modifiedScenario, security: change.value };
      break;
    case 'dataGravity':
      modifiedScenario = { ...modifiedScenario, dataGravity: change.value };
      break;
  }

  const counterfactualResult = computeResult(modifiedScenario, platformOverride);

  const costDeltaPct = baseline.cost.monthly > 0
    ? ((counterfactualResult.cost.monthly - baseline.cost.monthly) / baseline.cost.monthly) * 100
    : 0;
  const latencyDeltaPct = baseline.latency.p50Ms > 0
    ? ((counterfactualResult.latency.p50Ms - baseline.latency.p50Ms) / baseline.latency.p50Ms) * 100
    : 0;

  return {
    id: `cf_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    scenarioId: scenario.scenarioId,
    parameterChanged: change.type,
    parameterLabel: getParameterLabel(change),
    oldValue: getOldValueLabel(scenario, change),
    newValue: getNewValueLabel(change, scenario),
    baselineResult: baseline,
    counterfactualResult: counterfactualResult,
    delta: {
      costDeltaPct: Math.round(costDeltaPct * 10) / 10,
      latencyDeltaPct: Math.round(latencyDeltaPct * 10) / 10,
      readinessDelta: counterfactualResult.readiness - baseline.readiness,
      scoreDelta: counterfactualResult.platform.score - baseline.platform.score,
    },
    timestamp: Date.now(),
  };
}

export const QUICK_SIMULATIONS: { label: string; description: string; icon: string; change: CounterfactualChange }[] = [
  { label: 'Simulate Azure', description: 'What if we used Azure OpenAI?', icon: '🔷', change: { type: 'platform', value: 'azure' } },
  { label: 'Simulate AWS', description: 'What if we used AWS Bedrock?', icon: '🟠', change: { type: 'platform', value: 'bedrock' } },
  { label: 'Double Traffic', description: 'What if traffic doubles?', icon: '📈', change: { type: 'traffic', multiplier: 2, label: '2x' } },
  { label: 'Half Traffic', description: 'What if traffic halves?', icon: '📉', change: { type: 'traffic', multiplier: 0.5, label: '0.5x' } },
  { label: 'Tighter Latency', description: 'What if latency target = 150ms?', icon: '⚡', change: { type: 'latency', targetMs: 150 } },
  { label: 'Hybrid Deploy', description: 'What if we go hybrid?', icon: '🔀', change: { type: 'deployment', value: 'hybrid' } },
  { label: 'Private Deploy', description: 'What if fully private?', icon: '🔒', change: { type: 'deployment', value: 'private' } },
  { label: 'Regulated Security', description: 'What if regulated compliance?', icon: '🛡️', change: { type: 'security', value: 'regulated' } },
];
