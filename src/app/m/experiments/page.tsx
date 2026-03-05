'use client';

import { motion } from 'framer-motion';
import ConsoleLayout from '@/components/console/ConsoleLayout';
import ExperimentTimeline from '@/components/experiments/ExperimentTimeline';
import { useScenarioStore } from '@/store/scenarioStore';
import { fadeInUp } from '@/styles/motion';
import { Clock } from 'lucide-react';

export default function ExperimentsPage() {
  const { getActiveScenario } = useScenarioStore();
  const active = getActiveScenario();

  return (
    <ConsoleLayout>
      <div className="max-w-3xl mx-auto pb-8">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-5 h-5 text-[#F59E0B]" />
            <h1 className="text-xl font-bold text-[#F8FAFC]">Experiment Timeline</h1>
          </div>
          <p className="text-xs text-[#64748B]">
            {active
              ? `Decision history for "${active.name}"`
              : 'Select a scenario to view its experiment history.'}
          </p>
        </motion.div>
        <ExperimentTimeline />
      </div>
    </ConsoleLayout>
  );
}
