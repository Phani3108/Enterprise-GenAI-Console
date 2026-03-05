'use client';

import ConsoleLayout from '@/components/console/ConsoleLayout';
import ModuleLoader from '@/components/modules/ModuleLoader';

export default function StrategyModulePage() {
  return (
    <ConsoleLayout>
      <div className="h-full">
        <ModuleLoader moduleId="strategy" />
      </div>
    </ConsoleLayout>
  );
}
