'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getModules, type ModuleConfig } from '@/utils/moduleRegistry';
import AgentNavItem from './AgentNavItem';
import { Settings, Home, Clock, FileText, GitBranch, FlaskConical, Radio, Beaker } from 'lucide-react';

export default function ConsoleSidebar() {
  const pathname = usePathname();
  const modules = getModules();

  const toolLinks = [
    { href: '/m/brief', label: 'Decision Brief', icon: '📋', lucide: FileText },
    { href: '/m/intelligence', label: 'Market Intelligence', icon: '📡', lucide: Radio },
    { href: '/m/counterfactual', label: 'What-If Simulator', icon: '🧪', lucide: Beaker },
    { href: '/m/graph', label: 'Scenario Graph', icon: '🔀', lucide: GitBranch },
    { href: '/m/experiments', label: 'Experiments', icon: '⏱', lucide: Clock },
    { href: '/scenario-studio', label: 'Scenario Studio', icon: '🧪', lucide: FlaskConical },
  ];

  return (
    <aside className="w-[220px] min-w-[220px] border-r border-white/[0.06] bg-gradient-to-b from-[#0B1020] to-[#0F172A] flex flex-col">
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="mb-6">
          <p className="text-[10px] font-medium tracking-widest uppercase text-[#64748B] mb-3 px-2">
            AI Agents
          </p>
          <nav className="space-y-1">
            {modules.map((mod: ModuleConfig) => (
              <AgentNavItem key={mod.id} module={mod} isActive={pathname === mod.route} />
            ))}
          </nav>
        </div>

        <div className="border-t border-white/[0.06] pt-4">
          <p className="text-[10px] font-medium tracking-widest uppercase text-[#64748B] mb-3 px-2">
            Strategic Tools
          </p>
          <nav className="space-y-1">
            {toolLinks.map((t) => (
              <Link key={t.href} href={t.href}>
                <div className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all ${pathname === t.href ? 'bg-white/[0.08] text-[#F8FAFC]' : 'text-[#94A3B8] hover:bg-white/[0.04] hover:text-[#F8FAFC]'}`}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.03] border border-white/[0.06]">
                    <t.lucide className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-medium">{t.label}</span>
                </div>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-white/[0.06]">
        <Link href="/console">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#64748B] hover:text-[#94A3B8] hover:bg-white/[0.04] transition-all">
            <Home className="w-3.5 h-3.5" />
            Console Home
          </div>
        </Link>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#64748B] hover:text-[#94A3B8] hover:bg-white/[0.04] transition-all cursor-pointer">
          <Settings className="w-3.5 h-3.5" />
          Settings
        </div>
      </div>

      <div className="px-4 pb-3 border-t border-white/[0.04] pt-3">
        <p className="text-[9px] text-[#475569] leading-relaxed">
          Created &amp; developed by{' '}
          <a
            href="https://linkedin.com/in/phani-marupaka"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#64748B] hover:text-[#94A3B8] underline underline-offset-2 transition-colors"
          >
            Phani Marupaka
          </a>
        </p>
        <p className="text-[8px] text-[#334155] leading-snug mt-1">
          © 2026 All rights reserved. Unauthorized reproduction or distribution of this software, in whole or in part, is strictly prohibited under applicable trademark and copyright laws.
        </p>
      </div>
    </aside>
  );
}
