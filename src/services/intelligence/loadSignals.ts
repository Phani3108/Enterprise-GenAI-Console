import modelsData from '@/data/intelligence/models.json';
import pricingData from '@/data/intelligence/pricing.json';
import ecosystemData from '@/data/intelligence/ecosystem.json';
import type { ModelSignal, PricingSignal, EcosystemSignal, IntelligenceInsight } from './types';

export function loadSignals(): {
  models: ModelSignal[];
  pricing: PricingSignal[];
  ecosystem: EcosystemSignal[];
  insights: IntelligenceInsight[];
} {
  const models = modelsData as ModelSignal[];
  const pricing = pricingData as PricingSignal[];
  const ecosystem = ecosystemData as EcosystemSignal[];
  const insights = generateInsights(models, pricing, ecosystem);

  return { models, pricing, ecosystem, insights };
}

function generateInsights(
  models: ModelSignal[],
  pricing: PricingSignal[],
  ecosystem: EcosystemSignal[]
): IntelligenceInsight[] {
  const insights: IntelligenceInsight[] = [];
  const now = Date.now();

  const largestContext = models.reduce((max, m) => m.contextWindow > max.contextWindow ? m : max, models[0]);
  if (largestContext) {
    insights.push({
      id: 'ctx-leader',
      title: `${largestContext.model} leads with ${(largestContext.contextWindow / 1_000_000).toFixed(0)}M context`,
      description: `${largestContext.vendor}'s ${largestContext.model} offers the largest context window, ideal for large RAG workloads and long-document analysis.`,
      impact: `+6 points to ${largestContext.platform} platform score for RAG use cases`,
      category: 'model',
      affectedPlatform: largestContext.platform,
      scoreImpact: 6,
      timestamp: now,
    });
  }

  const cheapestLLM = pricing
    .filter((p) => p.inputCost > 0)
    .reduce((min, p) => p.inputCost < min.inputCost ? p : min, pricing.find((p) => p.inputCost > 0)!);
  if (cheapestLLM) {
    insights.push({
      id: 'cost-leader',
      title: `${cheapestLLM.model} offers lowest inference cost`,
      description: `At $${cheapestLLM.inputCost}/${cheapestLLM.unit} input, ${cheapestLLM.vendor}'s ${cheapestLLM.model} is the most cost-effective LLM for high-volume workloads.`,
      impact: `Cost advantage of 2-10x vs competitors for input tokens`,
      category: 'pricing',
      affectedPlatform: cheapestLLM.vendor === 'Google' ? 'Vertex AI' : cheapestLLM.vendor === 'OpenAI' ? 'Azure OpenAI' : 'AWS Bedrock',
      scoreImpact: 4,
      timestamp: now,
    });
  }

  const decreasingPrices = pricing.filter((p) => p.trend === 'decreasing');
  if (decreasingPrices.length > 0) {
    insights.push({
      id: 'price-trend',
      title: `${decreasingPrices.length} models show decreasing pricing trends`,
      description: `${decreasingPrices.map((p) => p.model).join(', ')} have reduced pricing, signaling competitive pressure and improved unit economics.`,
      impact: 'Cost projections should factor in continued price decreases',
      category: 'pricing',
      affectedPlatform: 'All',
      scoreImpact: 0,
      timestamp: now,
    });
  }

  const highActivity = ecosystem.filter((e) => e.communityActivity === 'high');
  if (highActivity.length > 0) {
    const top = highActivity.reduce((max, e) => e.sdkUpdates > max.sdkUpdates ? e : max, highActivity[0]);
    insights.push({
      id: 'ecosystem-leader',
      title: `${top.platform} leads in developer ecosystem activity`,
      description: `${top.sdkUpdates} SDK updates, ${top.githubRepos} GitHub repos, and ${top.enterpriseAdoptions} enterprise adoptions make ${top.platform} the most active developer ecosystem.`,
      impact: `+3 points to ${top.platform} for developer productivity and integration maturity`,
      category: 'ecosystem',
      affectedPlatform: top.platform,
      scoreImpact: 3,
      timestamp: now,
    });
  }

  const recentModels = models
    .filter((m) => new Date(m.releaseDate) > new Date('2025-01-01'))
    .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
  if (recentModels.length >= 2) {
    insights.push({
      id: 'release-velocity',
      title: `${recentModels.length} major model releases in 2025`,
      description: `Rapid release cadence: ${recentModels.map((m) => m.model).join(', ')}. Architecture decisions should account for model upgrade paths.`,
      impact: 'Avoid tight vendor coupling — design for model swappability',
      category: 'model',
      affectedPlatform: 'All',
      scoreImpact: 0,
      timestamp: now,
    });
  }

  const codingModel = models.find((m) => m.strengths.some((s) => s.toLowerCase().includes('coding')));
  if (codingModel) {
    insights.push({
      id: 'coding-strength',
      title: `${codingModel.model} excels at code generation`,
      description: `${codingModel.vendor}'s ${codingModel.model} shows particular strength in coding tasks, relevant for code assistant and developer tool use cases.`,
      impact: `Consider ${codingModel.platform} for code-centric AI deployments`,
      category: 'model',
      affectedPlatform: codingModel.platform,
      scoreImpact: 2,
      timestamp: now,
    });
  }

  return insights;
}
