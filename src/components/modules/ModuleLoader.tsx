'use client';

import ModuleFrame from './ModuleFrame';
import OfflineModuleCard from '@/components/console/OfflineModuleCard';
import { useScenarioStore } from '@/store/scenarioStore';
import { getModuleById } from '@/utils/moduleRegistry';
import { buildModuleUrl, getModuleOrigin } from '@/utils/encodeScenario';

interface ModuleLoaderProps {
  moduleId: string;
}

export default function ModuleLoader({ moduleId }: ModuleLoaderProps) {
  const { getActiveScenario } = useScenarioStore();
  const scenario = getActiveScenario();
  const mod = getModuleById(moduleId);

  if (!mod) {
    return (
      <div className="flex items-center justify-center h-full text-[#64748B]">
        <p className="text-sm">Module not found: {moduleId}</p>
      </div>
    );
  }

  if (!scenario) {
    return (
      <div className="flex items-center justify-center h-full text-[#64748B]">
        <p className="text-sm">No active scenario. Create one in Scenario Studio.</p>
      </div>
    );
  }

  const url = buildModuleUrl(mod.port, mod.path, scenario, mod.route);
  const origin = getModuleOrigin(mod.port);

  return (
    <ModuleFrame
      url={url}
      title={mod.name}
      color={mod.color}
      moduleOrigin={origin}
      scenarioId={scenario.scenarioId}
    />
  );
}
