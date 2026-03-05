import type { ExplanationFactor } from './platformExplanation';

export function getCostExplanation(monthlyCost: number, scale: string): ExplanationFactor[] {
  return [
    {
      factor: 'LLM Inference',
      impact: `${Math.round(monthlyCost * 0.45)}`,
      reason: 'Token-based pricing for input/output inference. Largest cost component at enterprise scale.',
      category: 'cost',
    },
    {
      factor: 'Embedding Generation',
      impact: `${Math.round(monthlyCost * 0.12)}`,
      reason: 'Vector embedding computation for RAG document processing and query encoding.',
      category: 'cost',
    },
    {
      factor: 'Vector Search',
      impact: `${Math.round(monthlyCost * 0.10)}`,
      reason: 'Index maintenance and query serving for similarity search across document corpus.',
      category: 'data',
    },
    {
      factor: 'Compute (Cloud Run)',
      impact: `${Math.round(monthlyCost * 0.18)}`,
      reason: 'Auto-scaled container instances for API serving with cold-start optimization.',
      category: 'performance',
    },
    {
      factor: 'Storage & Networking',
      impact: `${Math.round(monthlyCost * 0.08)}`,
      reason: 'Cloud Storage for documents, BigQuery for analytics, and inter-service networking.',
      category: 'data',
    },
    {
      factor: 'Monitoring & Logging',
      impact: `${Math.round(monthlyCost * 0.07)}`,
      reason: 'Cloud Monitoring, structured logging, and audit trails for compliance.',
      category: 'compliance',
    },
  ];
}
