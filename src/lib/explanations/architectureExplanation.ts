import type { ExplanationFactor } from './platformExplanation';

export function getArchitectureExplanation(pattern: string): ExplanationFactor[] {
  return [
    {
      factor: 'RAG Pattern',
      impact: 'Core',
      reason: 'Retrieval-Augmented Generation reduces hallucination by grounding responses in enterprise knowledge base.',
      category: 'data',
    },
    {
      factor: 'Serverless Compute',
      impact: 'High',
      reason: 'Cloud Run scales to zero, eliminating idle costs while supporting burst traffic during peak hours.',
      category: 'cost',
    },
    {
      factor: 'Vector Search',
      impact: 'High',
      reason: 'Native vector search eliminates third-party dependencies and reduces architectural complexity.',
      category: 'integration',
    },
    {
      factor: 'Audit Logging',
      impact: 'Required',
      reason: 'BigQuery-based audit trail satisfies regulatory requirements for financial AI systems.',
      category: 'compliance',
    },
    {
      factor: 'Multi-Region',
      impact: 'Medium',
      reason: 'Regional deployment strategy ensures data residency compliance and low-latency global access.',
      category: 'performance',
    },
    {
      factor: 'Secret Management',
      impact: 'Required',
      reason: 'Centralized credential management with automatic rotation for API keys and service accounts.',
      category: 'compliance',
    },
  ];
}
