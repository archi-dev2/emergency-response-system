'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  Brain,
  Truck,
  Building2,
  QrCode,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  MapPin,
  AlertTriangle,
  Activity,
  Thermometer,
  Heart,
  Headphones,
  Clock,
  BedDouble,
  Shield,
  Stethoscope,
  User,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface DemoModalProps {
  open: boolean;
  onClose: () => void;
}

interface DemoStep {
  id: number;
  titleKey: string;
  descKey: string;
  fallbackTitle: string;
  fallbackDesc: string;
  icon: typeof Phone;
  color: string;
  bgGradient: string;
  illustration: React.ReactNode;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

/* ===== Step Illustrations ===== */

function SOSIllustration() {
  return (
    <div className="relative flex items-center justify-center h-full">
      <div className="absolute h-40 w-40 rounded-full border-2 border-red-400/30 animate-ping" style={{ animationDuration: '2s' }} />
      <div className="absolute h-32 w-32 rounded-full border-2 border-red-400/40 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
      <motion.div
        className="relative z-10 flex h-24 w-24 flex-col items-center justify-center rounded-full bg-red-500 shadow-xl shadow-red-500/40"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Phone className="size-8 text-white" />
        <span className="text-sm font-black text-white tracking-wider mt-0.5">SOS</span>
      </motion.div>
    </div>
  );
}

function AITriageIllustration() {
  return (
    <div className="relative flex flex-col items-center justify-center h-full gap-3">
      <motion.div
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-500 dark:bg-violet-500/30"
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Brain className="size-8" />
      </motion.div>
      <div className="flex gap-2">
        <span className="rounded-full bg-red-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-red-500 border border-red-500/20">Critical</span>
        <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-amber-500 border border-amber-500/20">Priority 1</span>
      </div>
    </div>
  );
}

function LiveTrackingIllustration() {
  return (
    <div className="relative flex flex-col items-center justify-center h-full gap-3">
      <motion.div
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-500 dark:bg-emerald-500/30"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Truck className="size-8" />
      </motion.div>
      <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
        <Clock className="size-3" /> ETA: 3.2 mins
      </div>
    </div>
  );
}

function HospitalReadyIllustration() {
  return (
    <div className="relative flex flex-col items-center justify-center h-full gap-3">
      <motion.div
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-500 dark:bg-sky-500/30"
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Building2 className="size-8" />
      </motion.div>
      <div className="flex gap-2">
        <span className="rounded-full bg-sky-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-sky-500 border border-sky-500/20">ICU Bed 4 Cleared</span>
      </div>
    </div>
  );
}

function QRCardIllustration() {
  return (
    <div className="relative flex flex-col items-center justify-center h-full gap-3">
      <motion.div
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-500 dark:bg-amber-500/30"
        animate={{ rotateY: [0, 10, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <QrCode className="size-8" />
      </motion.div>
      <span className="text-[11px] font-medium text-muted-foreground">Scannable Medical ID</span>
    </div>
  );
}

/* ===== Main Demo Modal ===== */

export default function DemoModal({ open, onClose }: DemoModalProps) {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const dm = t.demoModal;

  const steps: DemoStep[] = [
    {
      id: 1,
      titleKey: 'sos',
      descKey: 'sos',
      fallbackTitle: 'SOS Emergency',
      fallbackDesc: 'Activate SOS with one tap. Our system immediately locates you and dispatches the nearest ambulance.',
      icon: Phone,
      color: 'text-red-500',
      bgGradient: 'from-red-500/10 to-orange-500/5 dark:from-red-500/20 dark:to-orange-500/10',
      illustration: <SOSIllustration />,
    },
    {
      id: 2,
      titleKey: 'aiTriage',
      descKey: 'aiTriage',
      fallbackTitle: 'AI Triage',
      fallbackDesc: 'Our AI analyzes your symptoms in real-time and assigns severity levels.',
      icon: Brain,
      color: 'text-violet-500',
      bgGradient: 'from-violet-500/10 to-purple-500/5 dark:from-violet-500/20 dark:to-purple-500/10',
      illustration: <AITriageIllustration />,
    },
    {
      id: 3,
      titleKey: 'tracking',
      descKey: 'tracking',
      fallbackTitle: 'Live Tracking',
      fallbackDesc: 'Track your ambulance in real-time with accurate ETA updates.',
      icon: Truck,
      color: 'text-emerald-500',
      bgGradient: 'from-emerald-500/10 to-teal-500/5 dark:from-emerald-500/20 dark:to-teal-500/10',
      illustration: <LiveTrackingIllustration />,
    },
    {
      id: 4,
      titleKey: 'hospitalReady',
      descKey: 'hospitalReady',
      fallbackTitle: 'Hospital Ready',
      fallbackDesc: 'The receiving hospital is notified and prepares for your arrival.',
      icon: Building2,
      color: 'text-emerald-500',
      bgGradient: 'from-emerald-500/10 to-sky-500/5 dark:from-emerald-500/20 dark:to-sky-500/10',
      illustration: <HospitalReadyIllustration />,
    },
    {
      id: 5,
      titleKey: 'qrCard',
      descKey: 'qrCard',
      fallbackTitle: 'QR Medical Card',
      fallbackDesc: 'Carry your complete medical profile as a scannable QR card.',
      icon: QrCode,
      color: 'text-amber-500',
      bgGradient: 'from-amber-500/10 to-yellow-500/5 dark:from-amber-500/20 dark:to-yellow-500/10',
      illustration: <QRCardIllustration />,
    },
  ];

  const goToStep = useCallback(
    (stepIndex: number, dir: number) => {
      if (stepIndex < 0 || stepIndex >= steps.length) return;
      setDirection(dir);
      setCurrentStep(stepIndex);
    },
    [steps.length],
  );

  const nextStep = useCallback(() => goToStep(currentStep + 1, 1), [currentStep, goToStep]);
  const prevStep = useCallback(() => goToStep(currentStep - 1, -1), [currentStep, goToStep]);

  useEffect(() => {
    if (autoPlay) {
      autoPlayRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setAutoPlay(false);
            return prev;
          }
          setDirection(1);
          return prev + 1;
        });
      }, 3000);
    } else if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [autoPlay, steps.length]);

  const step = steps[currentStep];
  const StepIcon = step.icon;

  const title = (t.features?.items as Record<string, { title: string; description: string }>)?.[step.titleKey]?.title ?? step.fallbackTitle;
  const description = (t.features?.items as Record<string, { title: string; description: string }>)?.[step.descKey]?.description ?? step.fallbackDesc;

  const handleClose = useCallback(() => {
    setCurrentStep(0);
    setAutoPlay(false);
    onClose();
  }, [onClose]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-[800px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>{dm?.modalTitle ?? 'LifeLink Demo Walkthrough'}</DialogTitle>
          <DialogDescription>{dm?.modalDesc ?? 'Interactive step-by-step demo of LifeLink features'}</DialogDescription>
        </DialogHeader>

        {/* Top bar with step number and close */}
        <div className="flex items-center justify-between px-6 pt-4 pb-0">
          <div className="flex items-center gap-2">
            <StepIcon className={`size-4 ${step.color}`} />
            <span className="text-xs font-medium text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Auto-play toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setAutoPlay(!autoPlay)}
            >
              {autoPlay ? <Pause className="size-3" /> : <Play className="size-3" />}
              {autoPlay ? (dm?.pause ?? 'Pause') : (dm?.playDemo ?? 'Play Demo')}
            </Button>
          </div>
        </div>

        {/* Content area with illustration + text */}
        <div className="px-6 py-6">
          <div
            className={`relative flex flex-col items-center overflow-hidden rounded-2xl bg-gradient-to-br ${step.bgGradient} p-6 sm:p-8 min-h-[280px]`}
          >
            {/* Illustration */}
            <div className="relative flex-1 w-full flex items-center justify-center">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {step.illustration}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Title + Description */}
            <div className="mt-4 text-center max-w-md">
              <motion.h3
                key={`title-${currentStep}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-bold text-foreground"
              >
                {title}
              </motion.h3>
              <motion.p
                key={`desc-${currentStep}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-2 text-sm leading-relaxed text-muted-foreground"
              >
                {description}
              </motion.p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between px-6 pb-5">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="size-4" />
            {dm?.prev ?? 'Previous'}
          </Button>

          {/* Step dots */}
          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goToStep(i, i > currentStep ? 1 : -1)}
                className={`transition-all duration-300 rounded-full ${
                  i === currentStep
                    ? 'h-2.5 w-6 bg-emergency'
                    : 'h-2 w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
          </div>

          <Button
            size="sm"
            className="gap-1.5 bg-emergency hover:bg-emergency/90 text-emergency-foreground"
            onClick={currentStep === steps.length - 1 ? onClose : nextStep}
          >
            {currentStep === steps.length - 1 ? (dm?.done ?? 'Done') : (dm?.next ?? 'Next')}
            {currentStep < steps.length - 1 && <ChevronRight className="size-4" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
