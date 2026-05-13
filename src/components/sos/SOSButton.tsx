'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface SOSButtonProps {
  onHoldComplete: () => void;
  isActivated: boolean;
}

const HOLD_DURATION = 3000;
const BUTTON_SIZE_DESKTOP = 180;
const BUTTON_SIZE_MOBILE = 150;
const SVG_SIZE = BUTTON_SIZE_DESKTOP + 20;
const RADIUS = (BUTTON_SIZE_DESKTOP + 20) / 2 - 4;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function SOSButton({ onHoldComplete, isActivated }: SOSButtonProps) {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const holdTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number>(0);

  const resetHold = useCallback(() => {
    setIsHolding(false);
    setProgress(0);
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = 0;
    }
  }, []);

  const startHold = useCallback(() => {
    if (isActivated) return;
    setIsHolding(true);
    setProgress(0);
    startTimeRef.current = Date.now();

    animFrameRef.current = requestAnimationFrame(function tick() {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min(elapsed / HOLD_DURATION, 1);
      setProgress(pct);
      if (pct < 1) {
        animFrameRef.current = requestAnimationFrame(tick);
      }
    });
  }, [isActivated]);

  const completeHold = useCallback(() => {
    if (progress >= 0.95) {
      resetHold();
      onHoldComplete();
    } else {
      resetHold();
    }
  }, [progress, resetHold, onHoldComplete]);

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearInterval(holdTimerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  if (isActivated) {
    return (
      <motion.div
        className="relative flex items-center justify-center"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <motion.div
          className="rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_40px_oklch(0.65_0.2_145/0.5)]"
          style={{ width: BUTTON_SIZE_DESKTOP, height: BUTTON_SIZE_DESKTOP }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 150, damping: 15, delay: 0.1 }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          >
            <CheckCircle2 className="w-20 h-20 text-white" strokeWidth={2.5} />
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="relative flex items-center justify-center select-none touch-none"
      style={{ width: SVG_SIZE, height: SVG_SIZE }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => { setIsHovering(false); resetHold(); }}
    >
      {/* Pulse Rings */}
      <AnimatePresence>
        {(isHolding || isHovering) && (
          <>
            <motion.div
              key="ring-1-holding"
              className="sos-ring-1 absolute rounded-full border-2 border-red-500/40"
              style={{
                width: BUTTON_SIZE_DESKTOP,
                height: BUTTON_SIZE_DESKTOP,
                animationDuration: isHolding ? '1.2s' : '1.6s',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              key="ring-2-holding"
              className="sos-ring-2 absolute rounded-full border-2 border-red-500/30"
              style={{
                width: BUTTON_SIZE_DESKTOP,
                height: BUTTON_SIZE_DESKTOP,
                animationDuration: isHolding ? '1.2s' : '1.6s',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              key="ring-3-holding"
              className="sos-ring-3 absolute rounded-full border-2 border-red-500/20"
              style={{
                width: BUTTON_SIZE_DESKTOP,
                height: BUTTON_SIZE_DESKTOP,
                animationDuration: isHolding ? '1.2s' : '1.6s',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Always-visible subtle rings */}
      {!isHolding && !isHovering && (
        <>
          <div
            className="sos-ring-1 absolute rounded-full border-2 border-red-500/20"
            style={{ width: BUTTON_SIZE_DESKTOP, height: BUTTON_SIZE_DESKTOP }}
          />
          <div
            className="sos-ring-2 absolute rounded-full border-2 border-red-500/15"
            style={{ width: BUTTON_SIZE_DESKTOP, height: BUTTON_SIZE_DESKTOP }}
          />
          <div
            className="sos-ring-3 absolute rounded-full border-2 border-red-500/10"
            style={{ width: BUTTON_SIZE_DESKTOP, height: BUTTON_SIZE_DESKTOP }}
          />
        </>
      )}

      {/* SVG Progress Ring */}
      <svg
        className="absolute pointer-events-none"
        width={SVG_SIZE}
        height={SVG_SIZE}
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* Background track */}
        <circle
          cx={SVG_SIZE / 2}
          cy={SVG_SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={4}
        />
        {/* Progress arc */}
        <circle
          cx={SVG_SIZE / 2}
          cy={SVG_SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.05s linear' }}
        />
      </svg>

      {/* The main button */}
      <motion.button
        className="sos-glow relative rounded-full flex items-center justify-center cursor-pointer focus:outline-none"
        style={{
          width: BUTTON_SIZE_DESKTOP,
          height: BUTTON_SIZE_DESKTOP,
          background: 'radial-gradient(circle at 40% 35%, oklch(0.55 0.26 27), oklch(0.45 0.22 27))',
        }}
        animate={{
          scale: isHolding ? 1.02 : isHovering ? 1.05 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        onMouseDown={(e) => { e.preventDefault(); startHold(); }}
        onMouseUp={completeHold}
        onMouseLeave={() => { setIsHovering(false); resetHold(); }}
        onTouchStart={(e) => { e.preventDefault(); startHold(); }}
        onTouchEnd={completeHold}
        onTouchCancel={resetHold}
        onContextMenu={(e) => e.preventDefault()}
        aria-label="SOS Emergency Button - Press and hold for 3 seconds to activate"
      >
        {/* Inner highlight */}
        <div
          className="absolute inset-2 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 35% 30%, oklch(1 0 0 / 0.15), transparent 60%)',
          }}
        />

        {/* Text or holding indicator */}
        <AnimatePresence mode="wait">
          {isHolding ? (
            <motion.div
              key="holding"
              className="flex flex-col items-center gap-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <span className="text-white font-bold text-lg">
                {Math.ceil((1 - progress) * 3)}
              </span>
              <span className="text-white/70 text-xs font-medium">HOLD</span>
            </motion.div>
          ) : (
            <motion.span
              key="sos-text"
              className="text-white font-bold"
              style={{ fontSize: '2.5rem', lineHeight: 1 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              SOS
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Responsive override via CSS */}
      <style jsx>{`
        @media (max-width: 640px) {
          button {
            width: ${BUTTON_SIZE_MOBILE}px !important;
            height: ${BUTTON_SIZE_MOBILE}px !important;
          }
        }
      `}</style>
    </motion.div>
  );
}
