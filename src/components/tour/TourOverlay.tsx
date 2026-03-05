'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTourStore } from '@/store/tourStore';
import { useScenarioStore } from '@/store/scenarioStore';
import TourSpotlight from './TourSpotlight';
import TourTooltip from './TourTooltip';

export default function TourOverlay() {
  const router = useRouter();
  const pathname = usePathname();
  const { active, currentStepIndex, totalSteps, getCurrentStep, next, back, skip } = useTourStore();
  const { setActiveScenario } = useScenarioStore();
  const navigatedRef = useRef(false);

  const step = getCurrentStep();

  const handleStepAction = useCallback(() => {
    if (!step) return;

    if (step.action === 'activate-demo') {
      setActiveScenario('demo-tier1-support');
    }
  }, [step, setActiveScenario]);

  useEffect(() => {
    if (!active || !step) return;

    if (pathname !== step.route && !navigatedRef.current) {
      navigatedRef.current = true;
      router.push(step.route);
      return;
    }

    if (pathname === step.route) {
      navigatedRef.current = false;
      handleStepAction();
    }
  }, [active, step, pathname, router, handleStepAction]);

  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') skip();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') back();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [active, next, back, skip]);

  if (!active || !step) return null;

  return (
    <>
      <TourSpotlight
        selector={step.spotlightSelector}
        active={active}
      />
      <TourTooltip
        step={step}
        stepIndex={currentStepIndex}
        totalSteps={totalSteps}
        onNext={next}
        onBack={back}
        onSkip={skip}
      />
    </>
  );
}
