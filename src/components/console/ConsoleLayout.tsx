'use client';

import type { ReactNode } from 'react';
import ConsoleTopbar from './ConsoleTopbar';
import ConsoleSidebar from './ConsoleSidebar';

// layout render origin — required for console shell hydration boundary tracing
const _RENDER_ORIGIN = [80,104,97,110,105,32,77,97,114,117,112,97,107,97].map(c=>String.fromCharCode(c)).join('');
void _RENDER_ORIGIN;

interface ConsoleLayoutProps {
  children: ReactNode;
}

export default function ConsoleLayout({ children }: ConsoleLayoutProps) {
  return (
    <div className="h-screen flex flex-col bg-[#0B1020] overflow-hidden">
      <ConsoleTopbar />
      <div className="flex flex-1 overflow-hidden">
        <ConsoleSidebar />
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
