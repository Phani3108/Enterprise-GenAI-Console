'use client';

import ConsoleLayout from '@/components/console/ConsoleLayout';
import ModuleLoader from '@/components/modules/ModuleLoader';

export default function CostModulePage() {
  return (
    <ConsoleLayout>
      <div className="h-full">
        <ModuleLoader moduleId="cost" />
      </div>
    </ConsoleLayout>
  );
}
