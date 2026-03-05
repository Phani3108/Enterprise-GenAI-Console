'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface GlowButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
}

export default function GlowButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  href,
  className = '',
}: GlowButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-[#4F46E5] to-[#3B82F6]
      text-white font-medium
      shadow-[0_0_20px_rgba(79,70,229,0.3)]
      hover:shadow-[0_0_40px_rgba(79,70,229,0.5)]
    `,
    secondary: `
      bg-white/[0.05] border border-white/[0.1]
      text-[#F8FAFC] font-medium
      hover:bg-white/[0.1] hover:border-white/[0.2]
    `,
    ghost: `
      bg-transparent text-[#94A3B8]
      hover:text-[#F8FAFC] hover:bg-white/[0.05]
    `,
  };

  const baseClasses = `
    inline-flex items-center justify-center gap-2
    rounded-xl transition-all duration-300
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `;

  const Component = href ? 'a' : 'button';

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Component
        href={href}
        onClick={onClick}
        className={baseClasses}
      >
        {children}
      </Component>
    </motion.div>
  );
}
