import { create } from 'zustand';

export interface ExperimentEvent {
  id: string;
  scenarioId: string;
  toolId: string;
  toolName: string;
  timestamp: number;
  summary: string;
  highlights: string[];
  artifacts?: string[];
}

type ExperimentMap = Record<string, ExperimentEvent[]>;

interface ExperimentState {
  experiments: ExperimentMap;
  addExperiment: (event: ExperimentEvent) => void;
  getScenarioExperiments: (scenarioId: string) => ExperimentEvent[];
  clearScenarioExperiments: (scenarioId: string) => void;
}

const STORAGE_KEY = 'genai-console-experiments';

function load(): ExperimentMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function save(experiments: ExperimentMap) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(experiments)); } catch { /* */ }
}

export const useExperimentStore = create<ExperimentState>((set, get) => ({
  experiments: load(),

  addExperiment: (event) => {
    set((state) => {
      const next = { ...state.experiments };
      if (!next[event.scenarioId]) next[event.scenarioId] = [];
      next[event.scenarioId] = [event, ...next[event.scenarioId]];
      save(next);
      return { experiments: next };
    });
  },

  getScenarioExperiments: (scenarioId) => get().experiments[scenarioId] || [],

  clearScenarioExperiments: (scenarioId) => {
    set((state) => {
      const next = { ...state.experiments };
      delete next[scenarioId];
      save(next);
      return { experiments: next };
    });
  },
}));
