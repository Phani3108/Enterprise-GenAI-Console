'use client';

import ConsoleLayout from '@/components/console/ConsoleLayout';
import ModuleLoader from '@/components/modules/ModuleLoader';

export default function ArchitectureModulePage() {
  return (
    <ConsoleLayout>
      <div className="h-full">
        <ModuleLoader moduleId="architecture" />
      </div>
    </ConsoleLayout>
  );
}
