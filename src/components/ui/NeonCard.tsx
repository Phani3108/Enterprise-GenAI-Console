'use client';

import { motion } from 'framer-motion';
import { scaleIn } from '@/styles/motion';
import type { ReactNode } from 'react';

interface NeonCardProps {
  children: ReactNode;
  color?: string;
  index?: number;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export default function NeonCard({
  children,
  color = '#4F46E5',
  index = 0,
  className = '',
  onClick,
  hoverable = true,
}: NeonCardProps) {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={index}
      whileHover={hoverable ? { y: -4, scale: 1.01 } : undefined}
      onClick={onClick}
      className={`
        relative rounded-2xl border border-white/[0.06] 
        bg-gradient-to-br from-[#0F172A] to-[#1E293B]/50
        backdrop-blur-xl overflow-hidden
        ${hoverable ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{
        boxShadow: `0 0 0 1px ${color}10, 0 4px 24px rgba(0,0,0,0.3)`,
      }}
    >
      <div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${color}08, transparent 40%)`,
        }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
        }}
      />
      {children}
    </motion.div>
  );
}
