import { create } from 'zustand';

export interface ToolExport {
  toolId: string;
  toolName: string;
  scenarioId: string;
  timestamp: number;
  payload: Record<string, unknown>;
  summary?: string;
  highlights?: string[];
}

export interface ComposedBrief {
  title: string;
  scenarioId: string;
  generatedAt: number;
  highlights: string[];
  recommendedPlatform?: string;
  architectureSummary?: string;
  estimatedCost?: string;
  readinessScore?: number;
  launchPlan?: string;
  risks: string[];
  artifacts: { toolId: string; toolName: string; timestamp: number }[];
}

type ExportMap = Record<string, Record<string, ToolExport>>;

interface ExportState {
  exports: ExportMap;
  addExport: (exp: ToolExport) => void;
  getScenarioExports: (scenarioId: string) => Record<string, ToolExport>;
  composeBrief: (scenarioId: string) => ComposedBrief;
  clearScenarioExports: (scenarioId: string) => void;
  downloadExportPack: (scenarioId: string) => void;
}

const STORAGE_KEY = 'genai-console-exports';

function loadExports(): ExportMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function persistExports(exports: ExportMap) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(exports)); } catch { /* */ }
}

export const useExportStore = create<ExportState>((set, get) => ({
  exports: loadExports(),

  addExport: (exp) => {
    set((state) => {
      const next = { ...state.exports };
      if (!next[exp.scenarioId]) next[exp.scenarioId] = {};
      next[exp.scenarioId][exp.toolId] = exp;
      persistExports(next);
      return { exports: next };
    });
  },

  getScenarioExports: (scenarioId) => get().exports[scenarioId] || {},

  composeBrief: (scenarioId) => {
    const toolExports = get().exports[scenarioId] || {};
    const tools = Object.values(toolExports);

    const highlights: string[] = [];
    const risks: string[] = [];
    const artifacts = tools.map((t) => ({
      toolId: t.toolId,
      toolName: t.toolName,
      timestamp: t.timestamp,
    }));

    tools.forEach((t) => {
      if (t.highlights) highlights.push(...t.highlights);
    });

    const platform = toolExports.platform;
    const cost = toolExports.cost;
    const architecture = toolExports.architecture;
    const readiness = toolExports.readiness;
    const strategy = toolExports.strategy;

    return {
      title: `Decision Brief — ${scenarioId}`,
      scenarioId,
      generatedAt: Date.now(),
      highlights: highlights.length > 0 ? highlights : [
        'Run agents to populate highlights',
      ],
      recommendedPlatform: platform?.summary || 'Run Platform Agent',
      architectureSummary: architecture?.summary || 'Run Architecture Agent',
      estimatedCost: cost?.summary || 'Run Cost Agent',
      readinessScore: readiness?.payload?.score as number | undefined,
      launchPlan: strategy?.summary || 'Run Strategy Agent',
      risks: risks.length > 0 ? risks : ['Complete agent runs to identify risks'],
      artifacts,
    };
  },

  clearScenarioExports: (scenarioId) => {
    set((state) => {
      const next = { ...state.exports };
      delete next[scenarioId];
      persistExports(next);
      return { exports: next };
    });
  },

  downloadExportPack: (scenarioId) => {
    const brief = get().composeBrief(scenarioId);
    const exports = get().getScenarioExports(scenarioId);
    const pack = { brief, exports, downloadedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(pack, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scenario-report-${scenarioId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },
}));
