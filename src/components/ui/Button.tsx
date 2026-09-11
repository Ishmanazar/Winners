import { motion, HTMLMotionProps } from 'framer-motion';
import React, { useState } from 'react';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'cta' | 'arcade' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<string, string> = {
  // Duolingo vibrant green signature action button
  cta: 'bg-[#58cc02] hover:bg-[#61e002] text-white border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 shadow-[0_4px_0_#46a302] active:shadow-none',
  // Duolingo vibrant sky blue button
  primary: 'bg-[#1cb0f6] hover:bg-[#2cbbfd] text-white border-b-4 border-[#1899d6] active:border-b-0 active:translate-y-1 shadow-[0_4px_0_#1899d6] active:shadow-none',
  // Duolingo gold/xp button
  arcade: 'bg-[#ffc800] hover:bg-[#ffd21f] text-[#4a3800] border-b-4 border-[#e5b400] active:border-b-0 active:translate-y-1 shadow-[0_4px_0_#e5b400] active:shadow-none',
  // Duolingo heart/flame red button
  danger: 'bg-[#ff4b4b] hover:bg-[#ff6161] text-white border-b-4 border-[#ea2b2b] active:border-b-0 active:translate-y-1 shadow-[0_4px_0_#ea2b2b] active:shadow-none',
  // Clean minimal dark surface
  secondary: 'bg-[#1b2b34] hover:bg-[#233742] text-[#1cb0f6] border-2 border-[#2b3e4a] border-b-4 border-b-[#1f2d36] active:border-b-2 active:translate-y-1',
  // Ghost text button
  ghost: 'bg-transparent hover:bg-white/10 text-white/80 hover:text-white',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-3.5 py-1.5 text-xs font-black rounded-xl',
  md: 'px-5 py-2.5 text-sm font-black rounded-2xl',
  lg: 'px-6 py-3.5 text-base font-black rounded-2xl',
  xl: 'px-8 py-4 text-lg md:text-xl font-black rounded-2xl tracking-wide',
};

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  fullWidth,
  className = '',
  onClick,
  ...props
}: ButtonProps) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { id: Date.now(), x, y };

    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 500);

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
      onClick={handleClick}
      className={`
        relative overflow-hidden inline-flex items-center justify-center gap-2.5
        font-display uppercase select-none
        transition-all duration-150
        cursor-pointer
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Dynamic click ripple */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none animate-ping"
          style={{
            left: ripple.x - 20,
            top: ripple.y - 20,
            width: 40,
            height: 40,
          }}
        />
      ))}

      {icon && (
        <span className="text-lg md:text-xl flex items-center justify-center">
          {icon}
        </span>
      )}

      <span className="relative z-10 leading-none">{children}</span>
    </motion.button>
  );
}
