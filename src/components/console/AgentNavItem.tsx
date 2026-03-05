'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { ModuleConfig } from '@/utils/moduleRegistry';

interface AgentNavItemProps {
  module: ModuleConfig;
  isActive: boolean;
}

export default function AgentNavItem({ module, isActive }: AgentNavItemProps) {
  return (
    <Link href={module.route}>
      <motion.div
        whileHover={{ x: 2 }}
        className={`
          group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200
          ${isActive
            ? 'bg-white/[0.08] text-[#F8FAFC]'
            : 'text-[#94A3B8] hover:bg-white/[0.04] hover:text-[#F8FAFC]'}
        `}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all"
          style={{
            backgroundColor: isActive ? `${module.color}20` : 'rgba(255,255,255,0.03)',
            border: `1px solid ${isActive ? `${module.color}40` : 'rgba(255,255,255,0.06)'}`,
          }}
        >
          <Image
            src={`/icons/${module.icon}.svg`}
            alt={module.name}
            width={18}
            height={18}
            className="opacity-80"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium truncate">{module.shortName}</p>
          <p className="text-[10px] text-[#64748B] truncate">{module.name.replace(' Agent', '')}</p>
        </div>
        {isActive && (
          <motion.div
            layoutId="sidebar-indicator"
            className="w-1 h-5 rounded-full"
            style={{ backgroundColor: module.color }}
          />
        )}
      </motion.div>
    </Link>
  );
}
