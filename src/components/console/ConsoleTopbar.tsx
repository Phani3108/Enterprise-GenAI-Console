'use client';

import Link from 'next/link';
import { Sparkles, FileText, GitBranch, Clock, Download, Radio } from 'lucide-react';
import ScenarioSelector from './ScenarioSelector';
import { useScenarioStore } from '@/store/scenarioStore';
import { useExportStore } from '@/store/exportStore';

export default function ConsoleTopbar() {
  const { getActiveScenario } = useScenarioStore();
  const { downloadExportPack } = useExportStore();
  const active = getActiveScenario();

  return (
    <header className="h-14 border-b border-white/[0.06] bg-[#0B1020]/90 backdrop-blur-xl flex items-center justify-between px-6 z-50">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#06B6D4] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-sm text-[#F8FAFC] tracking-tight group-hover:text-[#A78BFA] transition-colors">
            AI Strategy Console
          </span>
        </Link>

        <div className="h-5 w-px bg-white/[0.08] mx-2" />

        <ScenarioSelector />
      </div>

      <div className="flex items-center gap-1">
        <Link
          href="/m/brief"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/[0.05] transition-all"
        >
          <FileText className="w-3.5 h-3.5" />
          Brief
        </Link>
        <Link
          href="/m/intelligence"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/[0.05] transition-all"
        >
          <Radio className="w-3.5 h-3.5" />
          Intel
        </Link>
        <Link
          href="/m/experiments"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/[0.05] transition-all"
        >
          <Clock className="w-3.5 h-3.5" />
          Timeline
        </Link>
        <Link
          href="/m/graph"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/[0.05] transition-all"
        >
          <GitBranch className="w-3.5 h-3.5" />
          Graph
        </Link>
        {active && (
          <button
            onClick={() => downloadExportPack(active.scenarioId)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/[0.05] transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
        )}
      </div>
    </header>
  );
}
