import { create } from 'zustand';
import type { CounterfactualRun } from '@/services/simulation/runSimulation';

type RunMap = Record<string, CounterfactualRun[]>;

interface CounterfactualState {
  runs: RunMap;
  addRun: (run: CounterfactualRun) => void;
  getScenarioRuns: (scenarioId: string) => CounterfactualRun[];
  clearScenarioRuns: (scenarioId: string) => void;
}

const STORAGE_KEY = 'genai-console-counterfactuals';

function load(): RunMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function save(runs: RunMap) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(runs)); } catch { /* */ }
}

export const useCounterfactualStore = create<CounterfactualState>((set, get) => ({
  runs: load(),

  addRun: (run) => {
    set((state) => {
      const next = { ...state.runs };
      if (!next[run.scenarioId]) next[run.scenarioId] = [];
      next[run.scenarioId] = [run, ...next[run.scenarioId]].slice(0, 50);
      save(next);
      return { runs: next };
    });
  },

  getScenarioRuns: (scenarioId) => get().runs[scenarioId] || [],

  clearScenarioRuns: (scenarioId) => {
    set((state) => {
      const next = { ...state.runs };
      delete next[scenarioId];
      save(next);
      return { runs: next };
    });
  },
}));
