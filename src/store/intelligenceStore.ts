import { create } from 'zustand';
import type { ModelSignal, PricingSignal, EcosystemSignal, IntelligenceInsight } from '@/services/intelligence/types';
import { loadSignals } from '@/services/intelligence/loadSignals';

interface IntelligenceState {
  models: ModelSignal[];
  pricing: PricingSignal[];
  ecosystem: EcosystemSignal[];
  insights: IntelligenceInsight[];
  lastRefreshed: number | null;
  loading: boolean;

  refresh: () => void;
  getModelsByVendor: (vendor: string) => ModelSignal[];
  getPricingByVendor: (vendor: string) => PricingSignal[];
  getInsightsByPlatform: (platform: string) => IntelligenceInsight[];
  getPlatformScoreBoost: (platform: string) => number;
}

export const useIntelligenceStore = create<IntelligenceState>((set, get) => {
  const initial = loadSignals();

  return {
    models: initial.models,
    pricing: initial.pricing,
    ecosystem: initial.ecosystem,
    insights: initial.insights,
    lastRefreshed: Date.now(),
    loading: false,

    refresh: () => {
      set({ loading: true });
      const data = loadSignals();
      set({
        models: data.models,
        pricing: data.pricing,
        ecosystem: data.ecosystem,
        insights: data.insights,
        lastRefreshed: Date.now(),
        loading: false,
      });
    },

    getModelsByVendor: (vendor) => get().models.filter((m) => m.vendor === vendor),

    getPricingByVendor: (vendor) => get().pricing.filter((p) => p.vendor === vendor),

    getInsightsByPlatform: (platform) =>
      get().insights.filter((i) => i.affectedPlatform === platform || i.affectedPlatform === 'All'),

    getPlatformScoreBoost: (platform) =>
      get().insights
        .filter((i) => i.affectedPlatform === platform)
        .reduce((sum, i) => sum + i.scoreImpact, 0),
  };
});
