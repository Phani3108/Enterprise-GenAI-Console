'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTourStore } from '@/store/tourStore';
import { useScenarioStore } from '@/store/scenarioStore';

export default function GuidedTourPage() {
  const router = useRouter();
  const { start, active } = useTourStore();
  const { setActiveScenario } = useScenarioStore();

  useEffect(() => {
    if (!active) {
      setActiveScenario('demo-tier1-support');
      start();
      router.push('/console');
    }
  }, [active, start, setActiveScenario, router]);

  return (
    <div className="min-h-screen bg-[#0B1020] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-2 border-[#A78BFA]/40 border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-sm text-[#94A3B8]">Starting guided tour...</p>
      </div>
    </div>
  );
}
