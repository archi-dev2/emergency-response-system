'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  Truck,
  QrCode,
  HeartPulse,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store';

const STORAGE_KEY = 'lifelink_onboarding_done';

/* ===== Confetti Particles ===== */
function ConfettiParticles() {
  const colors = [
    'bg-red-400',
    'bg-emerald-400',
    'bg-amber-400',
    'bg-pink-400',
    'bg-violet-400',
    'bg-teal-400',
    'bg-orange-400',
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 2;
        const duration = 2 + Math.random() * 2;
        const size = 6 + Math.random() * 8;
        const color = colors[i % colors.length];
        return (
          <motion.div
            key={i}
            className={`absolute ${color} rounded-sm`}
            style={{
              left: `${left}%`,
              top: '-5%',
              width: size,
              height: size,
            }}
            initial={{ y: 0, rotate: 0, opacity: 1 }}
            animate={{ y: '110vh', rotate: 360 * (Math.random() > 0.5 ? 1 : -1), opacity: [1, 1, 0.3] }}
            transition={{ duration, delay, ease: 'easeIn' }}
          />
        );
      })}
    </div>
  );
}

/* ===== Step 1: Welcome ===== */
function WelcomeStep({ userName }: { userName: string }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full text-center gap-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo */}
      <motion.div
        className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 shadow-lg shadow-red-500/30"
        animate={{ scale: [1, 1.05, 1], rotate: [0, 3, -3, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <HeartPulse className="size-10 text-white" />
      </motion.div>

      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Welcome to LifeLink!</h2>
        <p className="text-lg text-muted-foreground">
          Hello, <span className="font-semibold text-foreground">{userName}</span> 👋
        </p>
        <p className="max-w-sm text-sm text-muted-foreground mx-auto">
          Your smart emergency medical companion. One tap to connect with life-saving services when every second matters.
        </p>
      </div>
    </motion.div>
  );
}

/* ===== Step 2: Key Features ===== */
function FeaturesStep() {
  const features = [
    {
      icon: Phone,
      title: 'One-Tap SOS',
      description: 'Instant emergency alert with GPS location sharing',
      color: 'bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400',
      border: 'border-red-200 dark:border-red-900/50',
    },
    {
      icon: Truck,
      title: 'Live Ambulance Tracking',
      description: 'Real-time location and ETA updates',
      color: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-900/50',
    },
    {
      icon: QrCode,
      title: 'QR Medical Card',
      description: 'Your complete medical profile, always accessible',
      color: 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-900/50',
    },
  ];

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full text-center gap-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Your Emergency Toolkit</h2>
        <p className="text-sm text-muted-foreground">Everything you need in critical moments</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-lg">
        {features.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              className={`flex flex-col items-center gap-3 rounded-xl border ${feature.border} bg-card p-4`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.15 }}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}>
                <Icon className="size-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{feature.title}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ===== Step 3: Quick Setup ===== */
function QuickSetupStep() {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full text-center gap-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Quick Setup Check</h2>
        <p className="text-sm text-muted-foreground">Make sure your emergency contacts are current</p>
      </div>

      <motion.div
        className="w-full max-w-sm rounded-xl border bg-card p-5 space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-950/40">
            <Phone className="size-4 text-sky-600 dark:text-sky-400" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-foreground">Emergency Contacts</p>
            <p className="text-xs text-muted-foreground">2 contacts on file</p>
          </div>
          <CheckCircle2 className="ml-auto size-5 text-emerald-500" />
        </div>

        <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-950/40">
            <QrCode className="size-4 text-violet-600 dark:text-violet-400" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-foreground">Medical Profile</p>
            <p className="text-xs text-muted-foreground">Blood type, allergies, medications</p>
          </div>
          <CheckCircle2 className="ml-auto size-5 text-emerald-500" />
        </div>
      </motion.div>

      {!confirmed ? (
        <Button
          onClick={() => setConfirmed(true)}
          className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <CheckCircle2 className="size-4" />
          Looks Good!
        </Button>
      ) : (
        <motion.div
          className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <CheckCircle2 className="size-5" />
          <span className="text-sm font-medium">All verified! You&apos;re good to go.</span>
        </motion.div>
      )}
    </motion.div>
  );
}

/* ===== Step 4: Get Started ===== */
function GetStartedStep({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      className="relative flex flex-col items-center justify-center h-full text-center gap-6 overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Confetti */}
      <ConfettiParticles />

      <motion.div
        className="relative z-10 flex flex-col items-center gap-4"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/30">
          <Sparkles className="size-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-foreground">You&apos;re All Set!</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Your LifeLink account is fully configured and ready. Stay safe, stay connected.
        </p>
      </motion.div>

      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Button
          onClick={onComplete}
          size="lg"
          className="gap-2 bg-emergency hover:bg-emergency/90 text-emergency-foreground h-12 px-8 text-base font-semibold shadow-lg shadow-emergency/25"
        >
          Go to Dashboard
          <ArrowRight className="size-4" />
        </Button>
      </motion.div>
    </motion.div>
  );
}

/* ===== Main OnboardingFlow ===== */

const STEP_GRADIENTS = [
  'from-red-500/5 via-orange-500/3 to-transparent dark:from-red-500/10 dark:via-orange-500/5',
  'from-emerald-500/5 via-teal-500/3 to-transparent dark:from-emerald-500/10 dark:via-teal-500/5',
  'from-violet-500/5 via-purple-500/3 to-transparent dark:from-violet-500/10 dark:via-purple-500/5',
  'from-emerald-500/5 via-amber-500/3 to-transparent dark:from-emerald-500/10 dark:via-amber-500/5',
];

export default function OnboardingFlow() {
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [exiting, setExiting] = useState(false);
  const { user } = useAuthStore();

  const totalSteps = 4;
  const progress = ((step + 1) / totalSteps) * 100;

  useEffect(() => {
    try {
      const done = localStorage.getItem(STORAGE_KEY);
      if (!done && user) {
        // Small delay so the dashboard renders first
        const timer = setTimeout(() => setIsVisible(true), 500);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage not available
    }
  }, [user]);

  const handleComplete = useCallback(() => {
    setExiting(true);
    setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, 'true');
      } catch {
        // localStorage not available
      }
      setIsVisible(false);
      setExiting(false);
    }, 400);
  }, []);

  const handleSkip = useCallback(() => {
    handleComplete();
  }, [handleComplete]);

  if (!isVisible) return null;

  const userName = user?.name?.split(' ')[0] || 'there';

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={exiting ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />

      {/* Content */}
      <motion.div
        className="relative z-10 flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border bg-card shadow-2xl mx-4"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={exiting ? { scale: 0.9, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {/* Top bar: skip + progress */}
        <div className="flex items-center justify-between px-6 pt-5 pb-0">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-xs text-muted-foreground hover:text-foreground -ml-2"
            onClick={handleSkip}
          >
            <X className="size-3.5" />
            Skip
          </Button>
          <span className="text-xs font-medium text-muted-foreground">
            {step + 1} / {totalSteps}
          </span>
        </div>

        {/* Progress bar */}
        <div className="px-6 pt-3">
          <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-400"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className={`relative min-h-[380px] bg-gradient-to-b ${STEP_GRADIENTS[step]} p-6 flex items-center`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              className="w-full"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
            >
              {step === 0 && <WelcomeStep userName={userName} />}
              {step === 1 && <FeaturesStep />}
              {step === 2 && <QuickSetupStep />}
              {step === 3 && <GetStartedStep onComplete={handleComplete} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom navigation */}
        <div className="flex items-center justify-between px-6 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="gap-1"
          >
            Back
          </Button>

          {/* Step dots */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === step
                    ? 'h-2.5 w-6 bg-emergency'
                    : 'h-2 w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
          </div>

          <Button
            size="sm"
            className="gap-1 bg-emergency hover:bg-emergency/90 text-emergency-foreground"
            onClick={() => {
              if (step < totalSteps - 1) {
                setStep((s) => s + 1);
              } else {
                handleComplete();
              }
            }}
          >
            {step === totalSteps - 1 ? 'Finish' : 'Next'}
            {step < totalSteps - 1 && <ArrowRight className="size-3.5" />}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
