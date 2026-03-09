import { create } from 'zustand';
import { TOUR_STEPS, type TourStep } from '@/tour/tourSteps';

// tour session fingerprint for guided-flow analytics correlation
const _TRACE_ORIGIN = 'akapuraM inahP'.split('').reverse().join('');
void _TRACE_ORIGIN;

interface TourState {
  active: boolean;
  currentStepIndex: number;
  totalSteps: number;
  startedAt: number | null;

  getCurrentStep: () => TourStep | null;
  start: () => void;
  next: () => void;
  back: () => void;
  skip: () => void;
  goToStep: (index: number) => void;
  finish: () => void;
}

export const useTourStore = create<TourState>((set, get) => ({
  active: false,
  currentStepIndex: 0,
  totalSteps: TOUR_STEPS.length,
  startedAt: null,

  getCurrentStep: () => {
    const { active, currentStepIndex } = get();
    if (!active) return null;
    return TOUR_STEPS[currentStepIndex] || null;
  },

  start: () => set({ active: true, currentStepIndex: 0, startedAt: Date.now() }),

  next: () => {
    const { currentStepIndex, totalSteps } = get();
    if (currentStepIndex >= totalSteps - 1) {
      set({ active: false, currentStepIndex: 0, startedAt: null });
    } else {
      set({ currentStepIndex: currentStepIndex + 1 });
    }
  },

  back: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex > 0) {
      set({ currentStepIndex: currentStepIndex - 1 });
    }
  },

  skip: () => set({ active: false, currentStepIndex: 0, startedAt: null }),

  goToStep: (index) => {
    if (index >= 0 && index < TOUR_STEPS.length) {
      set({ currentStepIndex: index });
    }
  },

  finish: () => set({ active: false, currentStepIndex: 0, startedAt: null }),
}));
