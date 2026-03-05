'use client';

import { motion } from 'framer-motion';
import { WifiOff, ExternalLink, Terminal } from 'lucide-react';
import type { ModuleConfig } from '@/utils/moduleRegistry';

interface OfflineModuleCardProps {
  module: ModuleConfig;
}

export default function OfflineModuleCard({ module }: OfflineModuleCardProps) {
  const standaloneUrl = `http://localhost:${module.port}${module.path}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex items-center justify-center"
    >
      <div className="max-w-md text-center space-y-6">
        <div className="mx-auto w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
          <WifiOff className="w-8 h-8 text-[#64748B]" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#F8FAFC] mb-2">
            {module.name} is Offline
          </h2>
          <p className="text-sm text-[#64748B] leading-relaxed max-w-sm mx-auto">
            The module server is not running on port {module.port}. Start it locally
            or open the standalone version.
          </p>
        </div>

        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-left">
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="w-3.5 h-3.5 text-[#06B6D4]" />
              <span className="text-xs font-medium text-[#94A3B8]">Start locally</span>
            </div>
            <code className="text-xs text-[#A78BFA] font-mono block">
              cd ../{module.tool.replace(/ /g, '-')} && npm run dev -- -p {module.port}
            </code>
          </div>

          <div className="flex items-center gap-3 justify-center">
            <a
              href={standaloneUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-xs text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/[0.08] transition-all"
            >
              <ExternalLink className="w-3 h-3" />
              Open Standalone
            </a>
            <a
              href={module.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs text-[#64748B] hover:text-[#94A3B8] transition-colors"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
