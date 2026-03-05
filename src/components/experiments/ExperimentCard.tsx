'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import type { ExperimentEvent } from '@/store/experimentStore';
import { getModuleById } from '@/utils/moduleRegistry';
import { Repeat, ArrowRight } from 'lucide-react';

interface ExperimentCardProps {
  event: ExperimentEvent;
  index: number;
}

export default function ExperimentCard({ event, index }: ExperimentCardProps) {
  const mod = getModuleById(event.toolId);
  const color = mod?.color || '#4F46E5';
  const time = new Date(event.timestamp);
  const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = time.toLocaleDateString([], { month: 'short', day: 'numeric' });

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="flex gap-4"
    >
      {/* Timeline connector */}
      <div className="flex flex-col items-center shrink-0">
        <div
          className="w-3 h-3 rounded-full border-2 mt-1"
          style={{ borderColor: color, boxShadow: `0 0 8px ${color}40` }}
        />
        <div className="w-px flex-1 bg-gradient-to-b from-white/10 to-transparent min-h-[40px]" />
      </div>

      {/* Card */}
      <div className="flex-1 pb-6">
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-colors group">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              {mod && (
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
                >
                  <Image src={`/icons/${mod.icon}.svg`} alt={mod.name} width={14} height={14} />
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-[#F8FAFC]">{event.toolName}</p>
                <p className="text-[10px] text-[#64748B]">{dateStr} · {timeStr}</p>
              </div>
            </div>
            {mod && (
              <Link
                href={mod.route}
                className="hidden group-hover:flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] text-[#94A3B8] hover:text-[#F8FAFC] bg-white/[0.04] hover:bg-white/[0.08] transition-all"
              >
                <Repeat className="w-2.5 h-2.5" /> Replay
              </Link>
            )}
          </div>

          <p className="text-xs text-[#94A3B8] mb-2">{event.summary}</p>

          {event.highlights.length > 0 && (
            <ul className="space-y-1">
              {event.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[11px] text-[#64748B]">
                  <span className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: color }} />
                  {h}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </motion.div>
  );
}
