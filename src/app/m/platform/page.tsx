'use client';

import ConsoleLayout from '@/components/console/ConsoleLayout';
import ModuleLoader from '@/components/modules/ModuleLoader';

export default function PlatformModulePage() {
  return (
    <ConsoleLayout>
      <div className="h-full">
        <ModuleLoader moduleId="platform" />
      </div>
    </ConsoleLayout>
  );
}
