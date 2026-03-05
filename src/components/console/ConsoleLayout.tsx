'use client';

import type { ReactNode } from 'react';
import ConsoleTopbar from './ConsoleTopbar';
import ConsoleSidebar from './ConsoleSidebar';

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
