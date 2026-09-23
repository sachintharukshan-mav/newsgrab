'use client';

import React, { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
  value: number;
  decimals?: number;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  className?: string;
}

// Single Digit Column with vertical rolling wheel 0-9
function DigitColumn({ digit }: { digit: number }) {
  const springValue = useSpring(digit, {
    stiffness: 260,
    damping: 28,
    mass: 0.7,
  });

  useEffect(() => {
    springValue.set(digit);
  }, [digit, springValue]);

  // Translate Y by digit * 10%
  const y = useTransform(springValue, (current) => `${-current * 10}%`);

  return (
    <span
      className="relative inline-block overflow-hidden h-[1.35em] leading-[1.35em]"
      style={{
        maskImage:
          'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 20%, #000 30%, #000 70%, rgba(0,0,0,0.85) 80%, rgba(0,0,0,0) 100%)',
        WebkitMaskImage:
          'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 20%, #000 30%, #000 70%, rgba(0,0,0,0.85) 80%, rgba(0,0,0,0) 100%)',
      }}
    >
      <motion.span style={{ y }} className="flex flex-col items-center">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <span key={num} className="h-[1.35em] flex items-center justify-center">
            {num}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  decimals = 0,
  prefix,
  suffix,
  className,
}) => {
  const safeVal = Number.isFinite(value) ? value : 0;
  const parts = safeVal.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  const chars = parts.split('');

  return (
    <span className={cn('inline-flex items-center tabular-nums font-mono', className)}>
      {prefix && <span className="mr-0.5">{prefix}</span>}
      {chars.map((char, index) => {
        const isDigit = char >= '0' && char <= '9';
        if (isDigit) {
          return (
            <DigitColumn
              key={`digit-${chars.length - index}-${char}`}
              digit={parseInt(char, 10)}
            />
          );
        }
        return (
          <span key={`sep-${index}`} className="inline-block px-[0.03em]">
            {char}
          </span>
        );
      })}
      {suffix && <span className="ml-0.5">{suffix}</span>}
    </span>
  );
};
