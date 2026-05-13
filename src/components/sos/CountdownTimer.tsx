'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownTimerProps {
  isActive: boolean;
  onComplete: () => void;
}

const COUNTDOWN_FROM = 3;

export default function CountdownTimer({ isActive, onComplete }: CountdownTimerProps) {
  const [count, setCount] = useState<number | null>(null);
  const hasStartedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!isActive) {
      hasStartedRef.current = false;
      return undefined;
    }

    if (hasStartedRef.current) return undefined;
    hasStartedRef.current = true;

    const cb = onCompleteRef.current;
    let remaining = COUNTDOWN_FROM;

    // Start the interval immediately; first tick fires at 0ms
    const tick = () => {
      setCount(remaining);
      if (remaining <= 0) {
        cb();
        return;
      }
      remaining -= 1;
    };

    tick();
    const intervalId = setInterval(tick, 1000);

    return () => clearInterval(intervalId);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      {count !== null && count > 0 && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          style={{
            background: 'radial-gradient(circle at center, oklch(0.20 0.06 27 / 0.97), oklch(0.08 0.02 285 / 0.99))',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Red flash border */}
          <div className="absolute inset-0 border-4 border-red-600/30 pointer-events-none animate-pulse" />

          {/* Countdown number */}
          <AnimatePresence mode="wait">
            <motion.div
              key={count}
              className="flex flex-col items-center gap-6"
              initial={{ scale: 2.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <motion.span
                className="text-red-500 font-black"
                style={{ fontSize: 'clamp(6rem, 20vw, 12rem)', lineHeight: 1 }}
                animate={{
                  textShadow: [
                    '0 0 20px oklch(0.55 0.24 27 / 0.5)',
                    '0 0 60px oklch(0.55 0.24 27 / 0.8)',
                    '0 0 20px oklch(0.55 0.24 27 / 0.5)',
                  ],
                }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                {count}
              </motion.span>
            </motion.div>
          </AnimatePresence>

          {/* Subtitle */}
          <motion.p
            className="absolute bottom-1/4 text-red-300/70 text-sm font-medium tracking-widest uppercase"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Activating Emergency Services
          </motion.p>

          {/* Decorative rings */}
          <motion.div
            className="absolute w-80 h-80 rounded-full border border-red-600/10 pointer-events-none"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute w-96 h-96 rounded-full border border-red-600/5 pointer-events-none"
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
