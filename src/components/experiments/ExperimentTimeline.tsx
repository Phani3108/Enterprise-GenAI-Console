'use client';

import { useExperimentStore } from '@/store/experimentStore';
import { useScenarioStore } from '@/store/scenarioStore';
import ExperimentCard from './ExperimentCard';
import { Clock, Trash2 } from 'lucide-react';

interface ExperimentTimelineProps {
  scenarioId?: string;
  compact?: boolean;
  maxItems?: number;
}

export default function ExperimentTimeline({
  scenarioId,
  compact = false,
  maxItems,
}: ExperimentTimelineProps) {
  const { getActiveScenario } = useScenarioStore();
  const active = getActiveScenario();
  const resolvedId = scenarioId || active?.scenarioId;
  const { getScenarioExperiments, clearScenarioExperiments } = useExperimentStore();

  if (!resolvedId) {
    return (
      <div className="text-center py-8 text-[#64748B] text-xs">
        No active scenario selected.
      </div>
    );
  }

  const experiments = getScenarioExperiments(resolvedId);
  const displayed = maxItems ? experiments.slice(0, maxItems) : experiments;

  if (displayed.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="w-8 h-8 text-[#334155] mx-auto mb-3" />
        <p className="text-sm text-[#64748B]">No experiments yet</p>
        <p className="text-xs text-[#475569] mt-1">
          Run an agent to see your decision timeline here.
        </p>
      </div>
    );
  }

  return (
    <div>
      {!compact && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-[#64748B]">
            {experiments.length} experiment{experiments.length !== 1 ? 's' : ''} recorded
          </p>
          <button
            onClick={() => clearScenarioExperiments(resolvedId)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] text-[#64748B] hover:text-red-400 hover:bg-white/[0.04] transition-all"
          >
            <Trash2 className="w-2.5 h-2.5" /> Clear
          </button>
        </div>
      )}

      <div data-tour="timeline-event">
        {displayed.map((event, i) => (
          <ExperimentCard key={event.id} event={event} index={i} />
        ))}
      </div>
    </div>
  );
}
