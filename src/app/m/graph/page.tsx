'use client';

import { motion } from 'framer-motion';
import ConsoleLayout from '@/components/console/ConsoleLayout';
import ScenarioGraph from '@/components/graph/ScenarioGraph';
import { fadeInUp } from '@/styles/motion';
import { GitBranch } from 'lucide-react';

export default function GraphPage() {
  return (
    <ConsoleLayout>
      <div className="h-full flex flex-col">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-4"
        >
          <div className="flex items-center gap-2 mb-1">
            <GitBranch className="w-5 h-5 text-[#A78BFA]" />
            <h1 className="text-xl font-bold text-[#F8FAFC]">Scenario Decision Graph</h1>
          </div>
          <p className="text-xs text-[#64748B]">
            Explore the strategy decision tree across platforms, architectures, and launch strategies.
            The highlighted path shows the recommended route.
          </p>
        </motion.div>
        <div className="flex-1 min-h-0">
          <ScenarioGraph />
        </div>
      </div>
    </ConsoleLayout>
  );
}
