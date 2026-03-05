export interface TourStep {
  id: string;
  route: string;
  spotlightSelector: string;
  title: string;
  description: string;
  action?: 'activate-demo' | 'request-export' | 'none';
  toolId?: string;
  waitForReady?: boolean;
  timeoutMs: number;
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'scenario',
    route: '/console',
    spotlightSelector: '[data-tour="scenario-selector"]',
    title: 'Start with a Scenario',
    description: 'Everything begins as a banking AI scenario. The demo scenario models a Tier-1 bank deploying customer support AI.',
    action: 'activate-demo',
    timeoutMs: 3000,
  },
  {
    id: 'platform',
    route: '/m/platform',
    spotlightSelector: '[data-tour="module-export"]',
    title: 'Platform Agent',
    description: 'Compares Vertex AI vs Azure OpenAI vs AWS Bedrock using enterprise constraints, data gravity, and compliance requirements.',
    action: 'request-export',
    toolId: 'platform',
    waitForReady: true,
    timeoutMs: 6000,
  },
  {
    id: 'architecture',
    route: '/m/architecture',
    spotlightSelector: '[data-tour="module-export"]',
    title: 'Architecture Agent',
    description: 'Generates a deployable reference architecture tailored to your scenario — Cloud Run, vector search, security layers.',
    action: 'request-export',
    toolId: 'architecture',
    waitForReady: true,
    timeoutMs: 6000,
  },
  {
    id: 'cost',
    route: '/m/cost',
    spotlightSelector: '[data-tour="module-export"]',
    title: 'Cost Agent',
    description: 'Models total cost across inference, embeddings, RAG, infrastructure, networking, and observability.',
    action: 'request-export',
    toolId: 'cost',
    waitForReady: true,
    timeoutMs: 6000,
  },
  {
    id: 'brief',
    route: '/m/brief',
    spotlightSelector: '[data-tour="brief-copy"]',
    title: 'Decision Brief',
    description: 'All agent outputs synthesized into an exec-ready brief with risk analysis, cost projection, and launch plan. Copy or download the full export pack.',
    timeoutMs: 4000,
  },
  {
    id: 'counterfactual',
    route: '/m/counterfactual',
    spotlightSelector: '[data-tour="quick-simulations"]',
    title: 'What-If Simulator',
    description: 'Run counterfactual simulations — What if Azure? What if traffic doubles? See deltas instantly with decision science.',
    timeoutMs: 4000,
  },
  {
    id: 'experiments',
    route: '/m/experiments',
    spotlightSelector: '[data-tour="timeline-event"]',
    title: 'Experiment Timeline',
    description: 'Every agent run and simulation is tracked and replayable — full decision traceability for enterprise audit trails.',
    timeoutMs: 4000,
  },
];
