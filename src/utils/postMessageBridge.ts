import { useExportStore, type ToolExport } from '@/store/exportStore';
import { useExperimentStore, type ExperimentEvent } from '@/store/experimentStore';

const ALLOWED_PORTS = [3001, 3002, 3003, 3004, 3005];
const ALLOWED_ORIGINS = ALLOWED_PORTS.map((p) => `http://localhost:${p}`);

export type ConsoleMessageType = 'REQUEST_EXPORT' | 'SET_SCENARIO';
export type ToolMessageType = 'TOOL_READY' | 'TOOL_EXPORT';

export interface ToolReadyPayload {
  toolId: string;
}

export interface ToolExportPayload {
  toolId: string;
  toolName: string;
  scenarioId: string;
  summary: string;
  highlights: string[];
  data: Record<string, unknown>;
}

type ModuleReadyCallback = (toolId: string) => void;

let _onModuleReady: ModuleReadyCallback | null = null;
let _listenerAttached = false;

function handleMessage(event: MessageEvent) {
  if (!ALLOWED_ORIGINS.includes(event.origin)) return;
  if (!event.data || typeof event.data.type !== 'string') return;

  const { type, payload } = event.data;

  switch (type) {
    case 'TOOL_READY': {
      const p = payload as ToolReadyPayload;
      _onModuleReady?.(p.toolId);
      break;
    }
    case 'TOOL_EXPORT': {
      const p = payload as ToolExportPayload;
      const toolExport: ToolExport = {
        toolId: p.toolId,
        toolName: p.toolName,
        scenarioId: p.scenarioId,
        timestamp: Date.now(),
        payload: p.data,
        summary: p.summary,
        highlights: p.highlights,
      };
      useExportStore.getState().addExport(toolExport);

      const experiment: ExperimentEvent = {
        id: crypto.randomUUID(),
        scenarioId: p.scenarioId,
        toolId: p.toolId,
        toolName: p.toolName,
        timestamp: Date.now(),
        summary: p.summary,
        highlights: p.highlights,
      };
      useExperimentStore.getState().addExperiment(experiment);
      break;
    }
  }
}

export function initBridge(onModuleReady?: ModuleReadyCallback) {
  if (typeof window === 'undefined') return;
  _onModuleReady = onModuleReady || null;
  if (!_listenerAttached) {
    window.addEventListener('message', handleMessage);
    _listenerAttached = true;
  }
}

export function destroyBridge() {
  if (typeof window === 'undefined') return;
  window.removeEventListener('message', handleMessage);
  _listenerAttached = false;
  _onModuleReady = null;
}

export function requestExport(
  iframeRef: HTMLIFrameElement | null,
  moduleOrigin: string,
  scenarioId: string
) {
  iframeRef?.contentWindow?.postMessage(
    { type: 'REQUEST_EXPORT', payload: { scenarioId } },
    moduleOrigin
  );
}

export function sendScenario(
  iframeRef: HTMLIFrameElement | null,
  moduleOrigin: string,
  scenario: Record<string, unknown>
) {
  iframeRef?.contentWindow?.postMessage(
    { type: 'SET_SCENARIO', payload: scenario },
    moduleOrigin
  );
}
