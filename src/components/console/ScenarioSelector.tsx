'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScenarioStore } from '@/store/scenarioStore';
import { ChevronDown, Plus, Copy, FlaskConical, Settings2 } from 'lucide-react';
import Link from 'next/link';

export default function ScenarioSelector() {
  const { scenarios, activeScenarioId, setActiveScenario, createScenario, duplicateScenario, getActiveScenario } = useScenarioStore();
  const active = getActiveScenario();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const institutionLabels: Record<string, string> = {
    tier1_bank: 'Tier-1', tier2_bank: 'Tier-2', digital_bank: 'Digital',
    credit_union: 'CU', fintech: 'Fintech',
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        data-tour="scenario-selector"
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.06] transition-all text-xs"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[#F8FAFC] font-medium max-w-[200px] truncate">
          {active?.name || 'No scenario'}
        </span>
        {active && (
          <span className="text-[10px] text-[#64748B]">
            {institutionLabels[active.institutionType] || ''}
          </span>
        )}
        <ChevronDown className={`w-3 h-3 text-[#64748B] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-1 left-0 w-72 bg-[#0F172A] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden z-50"
          >
            <div className="p-2 border-b border-white/[0.06]">
              <p className="text-[10px] text-[#64748B] uppercase tracking-widest px-2 py-1">Scenarios</p>
            </div>

            <div className="max-h-48 overflow-y-auto p-1">
              {scenarios.map((s) => (
                <button
                  key={s.scenarioId}
                  onClick={() => { setActiveScenario(s.scenarioId); setOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center gap-2 ${
                    s.scenarioId === activeScenarioId
                      ? 'bg-white/[0.08] text-[#F8FAFC]'
                      : 'text-[#94A3B8] hover:bg-white/[0.04]'
                  }`}
                >
                  <FlaskConical className="w-3 h-3 shrink-0" style={{ color: s.scenarioId === activeScenarioId ? '#4F46E5' : '#64748B' }} />
                  <span className="truncate flex-1">{s.name}</span>
                  {s.scenarioId === activeScenarioId && (
                    <span className="w-1 h-1 rounded-full bg-[#4F46E5]" />
                  )}
                </button>
              ))}
            </div>

            <div className="p-2 border-t border-white/[0.06] space-y-1">
              <button
                onClick={() => { createScenario(); setOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[#94A3B8] hover:bg-white/[0.04] hover:text-[#F8FAFC] transition-all"
              >
                <Plus className="w-3 h-3" />
                New Scenario
              </button>
              {active && (
                <button
                  onClick={() => { duplicateScenario(active.scenarioId); setOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[#94A3B8] hover:bg-white/[0.04] hover:text-[#F8FAFC] transition-all"
                >
                  <Copy className="w-3 h-3" />
                  Duplicate Active
                </button>
              )}
              <Link
                href="/scenario-studio"
                onClick={() => setOpen(false)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[#94A3B8] hover:bg-white/[0.04] hover:text-[#F8FAFC] transition-all"
              >
                <Settings2 className="w-3 h-3" />
                Open Scenario Studio
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
