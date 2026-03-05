export interface ExplanationFactor {
  factor: string;
  impact: string;
  reason: string;
  category: 'data' | 'compliance' | 'performance' | 'integration' | 'cost' | 'ecosystem';
}

export function getPlatformExplanation(platform: string): ExplanationFactor[] {
  const explanations: Record<string, ExplanationFactor[]> = {
    'Vertex AI': [
      {
        factor: 'Data Gravity',
        impact: '+15',
        reason: 'BigQuery integration reduces data transfer latency and egress costs significantly.',
        category: 'data',
      },
      {
        factor: 'Compliance Readiness',
        impact: '+12',
        reason: 'Financial industry certifications (SOC 2, ISO 27001, PCI DSS) with regional data residency.',
        category: 'compliance',
      },
      {
        factor: 'Vector Search Integration',
        impact: '+9',
        reason: 'Native Vertex AI Vector Search eliminates need for external vector DB infrastructure.',
        category: 'integration',
      },
      {
        factor: 'Latency Performance',
        impact: '+6',
        reason: 'Estimated 220ms p95 latency with Cloud Run autoscaling and regional endpoints.',
        category: 'performance',
      },
      {
        factor: 'Model Garden Access',
        impact: '+8',
        reason: 'Access to Gemini, PaLM, and 150+ open models through unified API.',
        category: 'ecosystem',
      },
      {
        factor: 'Enterprise SLA',
        impact: '+5',
        reason: '99.9% availability SLA with premium support and dedicated technical account manager.',
        category: 'compliance',
      },
    ],
    'Azure OpenAI': [
      {
        factor: 'GPT-4 Access',
        impact: '+14',
        reason: 'Direct access to latest OpenAI models with enterprise-grade infrastructure.',
        category: 'ecosystem',
      },
      {
        factor: 'Enterprise AD Integration',
        impact: '+11',
        reason: 'Native Active Directory and Entra ID integration for existing Microsoft shops.',
        category: 'integration',
      },
      {
        factor: 'Hybrid Deployment',
        impact: '+7',
        reason: 'Azure Arc enables hybrid cloud/on-prem deployment for sensitive data.',
        category: 'data',
      },
      {
        factor: 'Compliance Coverage',
        impact: '+10',
        reason: 'Most compliance certifications of any cloud provider (90+).',
        category: 'compliance',
      },
    ],
    'AWS Bedrock': [
      {
        factor: 'Model Diversity',
        impact: '+13',
        reason: 'Access to Claude, Llama, Titan, and multiple model families through single API.',
        category: 'ecosystem',
      },
      {
        factor: 'Infrastructure Scale',
        impact: '+10',
        reason: 'Largest cloud infrastructure footprint with most availability zones.',
        category: 'performance',
      },
      {
        factor: 'Custom Model Training',
        impact: '+8',
        reason: 'SageMaker integration for custom fine-tuning and training pipelines.',
        category: 'integration',
      },
      {
        factor: 'Cost Optimization',
        impact: '+9',
        reason: 'Reserved capacity and Savings Plans reduce inference costs by up to 40%.',
        category: 'cost',
      },
    ],
  };

  return explanations[platform] || [];
}
