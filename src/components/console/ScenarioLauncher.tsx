'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useScenarioStore } from '@/store/scenarioStore';
import GlowButton from '@/components/ui/GlowButton';
import { Zap, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ScenarioLauncherProps {
  isOpen: boolean;
  onClose: () => void;
}

const selectCls = `w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#4F46E5]/50 transition-all appearance-none`;

export default function ScenarioLauncher({ isOpen, onClose }: ScenarioLauncherProps) {
  const { createScenario } = useScenarioStore();
  const router = useRouter();

  const handleCreate = () => {
    createScenario();
    onClose();
    router.push('/scenario-studio');
  };

  const handleDemo = () => {
    onClose();
    router.push('/console');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-[#0B1020]/80 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            className="relative w-full max-w-md mx-4 bg-[#0F172A] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4F46E5] to-transparent" />

            <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#4F46E5]" />
                <h3 className="font-semibold text-[#F8FAFC] text-sm">Quick Start</h3>
              </div>
              <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/[0.05] text-[#64748B]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-xs text-[#94A3B8]">
                Create a new scenario to configure your AI strategy evaluation, or use the demo scenario to explore.
              </p>

              <button
                onClick={handleCreate}
                className="w-full p-4 rounded-xl bg-gradient-to-r from-[#4F46E5]/20 to-[#3B82F6]/20 border border-[#4F46E5]/30 text-left hover:from-[#4F46E5]/30 hover:to-[#3B82F6]/30 transition-all"
              >
                <p className="text-sm font-semibold text-[#F8FAFC]">New Scenario</p>
                <p className="text-xs text-[#94A3B8] mt-1">Configure institution, use case, traffic, and RAG parameters</p>
              </button>

              <button
                onClick={handleDemo}
                className="w-full p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-left hover:bg-white/[0.04] transition-all"
              >
                <p className="text-sm font-semibold text-[#F8FAFC]">Use Demo Scenario</p>
                <p className="text-xs text-[#94A3B8] mt-1">Tier-1 Retail Bank · Customer Support AI · 10M req/mo</p>
              </button>
            </div>

            <div className="p-5 border-t border-white/[0.06] flex items-center justify-end gap-3">
              <GlowButton variant="ghost" size="sm" onClick={onClose}>Cancel</GlowButton>
              <GlowButton variant="primary" size="sm" onClick={() => { onClose(); router.push('/scenario-studio'); }}>
                <Zap className="w-3.5 h-3.5" />
                Open Studio
              </GlowButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
