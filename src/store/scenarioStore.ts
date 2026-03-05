import { create } from 'zustand';

export interface Scenario {
  scenarioId: string;
  name: string;
  institutionType: 'tier1_bank' | 'tier2_bank' | 'digital_bank' | 'credit_union' | 'fintech';
  useCase: 'customer_support' | 'fraud_detection' | 'compliance' | 'underwriting' | 'financial_advisor';
  dataGravity: 'bigquery' | 'snowflake' | 's3' | 'onprem';
  security: 'standard' | 'high' | 'regulated';
  deployment: 'cloud' | 'hybrid' | 'private';
  traffic: { requestsPerMonth: number; mau: number };
  rag: { topK: number; avgDocTokens: number; dimensions: number; cacheRate: number };
  latencyTargetMs: number;
  notes?: string;
}

interface ScenarioState {
  scenarios: Scenario[];
  activeScenarioId: string | null;
  activeModule: string | null;

  getActiveScenario: () => Scenario | undefined;
  createScenario: (partial?: Partial<Scenario>) => Scenario;
  duplicateScenario: (scenarioId: string) => Scenario | undefined;
  renameScenario: (scenarioId: string, name: string) => void;
  deleteScenario: (scenarioId: string) => void;
  setActiveScenario: (scenarioId: string) => void;
  updateScenario: (scenarioId: string, partial: Partial<Scenario>) => void;
  listScenarios: () => Scenario[];
  setActiveModule: (moduleId: string | null) => void;
}

const STORAGE_KEY = 'genai-console-scenarios';
const ACTIVE_KEY = 'genai-console-active-scenario';

function generateId(): string {
  return `sc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

const DEMO_SCENARIO: Scenario = {
  scenarioId: 'demo-tier1-support',
  name: 'Demo: Tier-1 Retail Bank Support AI',
  institutionType: 'tier1_bank',
  useCase: 'customer_support',
  dataGravity: 'bigquery',
  security: 'regulated',
  deployment: 'cloud',
  traffic: { requestsPerMonth: 10_000_000, mau: 500_000 },
  rag: { topK: 6, avgDocTokens: 900, dimensions: 768, cacheRate: 0.15 },
  latencyTargetMs: 300,
  notes: 'Default demo scenario for a Tier-1 bank deploying customer support AI on Vertex AI.',
};

function newScenario(partial?: Partial<Scenario>): Scenario {
  return {
    scenarioId: generateId(),
    name: 'New Scenario',
    institutionType: 'tier1_bank',
    useCase: 'customer_support',
    dataGravity: 'bigquery',
    security: 'standard',
    deployment: 'cloud',
    traffic: { requestsPerMonth: 1_000_000, mau: 100_000 },
    rag: { topK: 5, avgDocTokens: 800, dimensions: 768, cacheRate: 0.1 },
    latencyTargetMs: 500,
    ...partial,
  };
}

function loadFromStorage(): { scenarios: Scenario[]; activeId: string | null } {
  if (typeof window === 'undefined') return { scenarios: [DEMO_SCENARIO], activeId: DEMO_SCENARIO.scenarioId };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const scenarios: Scenario[] = raw ? JSON.parse(raw) : [];
    const activeId = localStorage.getItem(ACTIVE_KEY);
    if (scenarios.length === 0) {
      scenarios.push(DEMO_SCENARIO);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
      localStorage.setItem(ACTIVE_KEY, DEMO_SCENARIO.scenarioId);
      return { scenarios, activeId: DEMO_SCENARIO.scenarioId };
    }
    return { scenarios, activeId: activeId || scenarios[0].scenarioId };
  } catch {
    return { scenarios: [DEMO_SCENARIO], activeId: DEMO_SCENARIO.scenarioId };
  }
}

function persist(scenarios: Scenario[], activeId: string | null) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
    if (activeId) localStorage.setItem(ACTIVE_KEY, activeId);
  } catch { /* quota exceeded graceful fallback */ }
}

const initial = loadFromStorage();

export const useScenarioStore = create<ScenarioState>((set, get) => ({
  scenarios: initial.scenarios,
  activeScenarioId: initial.activeId,
  activeModule: null,

  getActiveScenario: () => {
    const { scenarios, activeScenarioId } = get();
    return scenarios.find((s) => s.scenarioId === activeScenarioId);
  },

  createScenario: (partial) => {
    const scenario = newScenario(partial);
    set((state) => {
      const next = [...state.scenarios, scenario];
      persist(next, scenario.scenarioId);
      return { scenarios: next, activeScenarioId: scenario.scenarioId };
    });
    return scenario;
  },

  duplicateScenario: (scenarioId) => {
    const source = get().scenarios.find((s) => s.scenarioId === scenarioId);
    if (!source) return undefined;
    const dup: Scenario = {
      ...source,
      scenarioId: generateId(),
      name: `${source.name} (copy)`,
    };
    set((state) => {
      const next = [...state.scenarios, dup];
      persist(next, dup.scenarioId);
      return { scenarios: next, activeScenarioId: dup.scenarioId };
    });
    return dup;
  },

  renameScenario: (scenarioId, name) => {
    set((state) => {
      const next = state.scenarios.map((s) =>
        s.scenarioId === scenarioId ? { ...s, name } : s
      );
      persist(next, state.activeScenarioId);
      return { scenarios: next };
    });
  },

  deleteScenario: (scenarioId) => {
    set((state) => {
      const next = state.scenarios.filter((s) => s.scenarioId !== scenarioId);
      if (next.length === 0) next.push(newScenario({ name: 'Default Scenario' }));
      const newActive = state.activeScenarioId === scenarioId ? next[0].scenarioId : state.activeScenarioId;
      persist(next, newActive);
      return { scenarios: next, activeScenarioId: newActive };
    });
  },

  setActiveScenario: (scenarioId) => {
    set({ activeScenarioId: scenarioId });
    if (typeof window !== 'undefined') localStorage.setItem(ACTIVE_KEY, scenarioId);
  },

  updateScenario: (scenarioId, partial) => {
    set((state) => {
      const next = state.scenarios.map((s) =>
        s.scenarioId === scenarioId ? { ...s, ...partial, scenarioId } : s
      );
      persist(next, state.activeScenarioId);
      return { scenarios: next };
    });
  },

  listScenarios: () => get().scenarios,

  setActiveModule: (moduleId) => set({ activeModule: moduleId }),
}));
