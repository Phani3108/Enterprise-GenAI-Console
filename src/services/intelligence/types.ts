export interface ModelSignal {
  vendor: string;
  model: string;
  releaseDate: string;
  contextWindow: number;
  latencyMs: number;
  strengths: string[];
  platform: string;
  note: string;
}

export interface PricingSignal {
  vendor: string;
  model: string;
  inputCost: number;
  outputCost: number;
  embeddingCost: number;
  unit: string;
  lastUpdated: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  note: string;
}

export interface EcosystemSignal {
  vendor: string;
  platform: string;
  githubRepos: number;
  sdkUpdates: number;
  communityActivity: 'low' | 'medium' | 'high';
  keyUpdates: string[];
  devSatisfaction: number;
  docsQuality: string;
  enterpriseAdoptions: number;
}

export interface IntelligenceInsight {
  id: string;
  title: string;
  description: string;
  impact: string;
  category: 'model' | 'pricing' | 'ecosystem';
  affectedPlatform: string;
  scoreImpact: number;
  timestamp: number;
}
