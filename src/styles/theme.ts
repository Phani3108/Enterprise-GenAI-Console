export const theme = {
  colors: {
    bg: {
      primary: '#0B1020',
      secondary: '#0F172A',
      surface: '#1E293B',
      surfaceHover: '#334155',
      card: 'rgba(15, 23, 42, 0.8)',
    },
    accent: {
      indigo: '#4F46E5',
      blue: '#3B82F6',
      cyan: '#06B6D4',
      violet: '#8B5CF6',
      neonCyan: '#22D3EE',
      neonViolet: '#A78BFA',
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#94A3B8',
      muted: '#64748B',
    },
    gradient: {
      primary: 'linear-gradient(135deg, #4F46E5 0%, #3B82F6 50%, #06B6D4 100%)',
      glow: 'linear-gradient(135deg, #4F46E5 0%, #8B5CF6 50%, #06B6D4 100%)',
      card: 'linear-gradient(145deg, rgba(79, 70, 229, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
      sidebar: 'linear-gradient(180deg, #0B1020 0%, #0F172A 100%)',
    },
    border: {
      subtle: 'rgba(148, 163, 184, 0.1)',
      active: 'rgba(79, 70, 229, 0.5)',
      glow: 'rgba(34, 211, 238, 0.3)',
    },
  },
  radii: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  },
  shadows: {
    glow: '0 0 30px rgba(79, 70, 229, 0.15)',
    glowStrong: '0 0 60px rgba(79, 70, 229, 0.25)',
    card: '0 4px 24px rgba(0, 0, 0, 0.3)',
    neon: '0 0 20px rgba(34, 211, 238, 0.2)',
  },
} as const;

export type Theme = typeof theme;
