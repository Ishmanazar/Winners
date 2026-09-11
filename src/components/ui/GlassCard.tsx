import { motion, HTMLMotionProps } from 'framer-motion';
import React from 'react';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  variant?: 'default' | 'strong' | 'dark' | 'vibrant';
  glow?: 'purple' | 'pink' | 'blue' | 'gold' | 'none';
  padding?: 'sm' | 'md' | 'lg';
}

const glowStyles: Record<string, string> = {
  purple: 'shadow-glow-purple',
  pink: 'shadow-glow-pink',
  blue: 'shadow-glow-blue',
  gold: 'shadow-glow-gold',
  none: '',
};

const paddingStyles: Record<string, string> = {
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-8',
};

export function GlassCard({
  children,
  variant = 'default',
  glow = 'none',
  padding = 'md',
  className = '',
  ...props
}: GlassCardProps) {
  const glassClass =
    variant === 'strong'
      ? 'glass-strong'
      : variant === 'dark'
      ? 'glass-dark'
      : variant === 'vibrant'
      ? 'glass-vibrant'
      : 'glass';

  return (
    <motion.div
      className={`
        ${glassClass}
        rounded-card
        ${paddingStyles[padding]}
        ${glowStyles[glow]}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
}
