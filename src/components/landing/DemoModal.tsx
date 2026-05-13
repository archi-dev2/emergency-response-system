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

interface DemoModalProps {
  open: boolean;
  onClose: () => void;
}

interface DemoStep {
  id: number;
  title: string;
  description: string;
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
      {/* Pulse rings */}
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
      {/* Decorative location dots */}
      <motion.div
        className="absolute top-2 right-6"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <MapPin className="size-5 text-red-300" />
      </motion.div>
      <motion.div
        className="absolute bottom-4 left-4"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
      >
        <AlertTriangle className="size-5 text-amber-300" />
      </motion.div>
    </div>
  );
}

function AITriageIllustration() {
  const symptoms = [
    { icon: Thermometer, label: 'Fever', color: 'text-orange-500 bg-orange-100 dark:bg-orange-950/50' },
    { icon: Heart, label: 'Chest Pain', color: 'text-red-500 bg-red-100 dark:bg-red-950/50' },
    { icon: Headphones, label: 'Headache', color: 'text-purple-500 bg-purple-100 dark:bg-purple-950/50' },
    { icon: Activity, label: 'Dizziness', color: 'text-amber-500 bg-amber-100 dark:bg-amber-950/50' },
  ];

  return (
    <div className="relative flex flex-col items-center justify-center h-full gap-4">
      {/* Brain icon */}
      <motion.div
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-950/50"
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Brain className="size-8 text-violet-500" />
      </motion.div>

      {/* Symptom chips */}
      <div className="flex flex-wrap justify-center gap-2 mt-2">
        {symptoms.map((sym, i) => {
          const Icon = sym.icon;
          return (
            <motion.div
              key={sym.label}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${sym.color}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 + 0.3 }}
            >
              <Icon className="size-3.5" />
              {sym.label}
            </motion.div>
          );
        })}
      </div>

      {/* AI Assessment Result */}
      <motion.div
        className="mt-2 rounded-lg border border-violet-200 bg-violet-50 px-4 py-2.5 dark:border-violet-800 dark:bg-violet-950/30"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2 }}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500">
            <span className="text-[10px] font-bold text-white">!</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-violet-700 dark:text-violet-300">Severity: CRITICAL</p>
            <p className="text-[10px] text-violet-500">Immediate medical attention advised</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function LiveTrackingIllustration() {
  return (
    <div className="relative flex flex-col items-center justify-center h-full">
      {/* Map-style dotted path */}
      <svg className="w-64 h-20" viewBox="0 0 260 80" fill="none">
        <path
          d="M 30 60 Q 80 20, 130 40 Q 180 60, 230 20"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="6 4"
          className="text-emerald-400"
        />
        {/* Start marker (user) */}
        <circle cx="30" cy="60" r="8" className="fill-sky-500" />
        <text x="30" y="63" textAnchor="middle" className="fill-white" fontSize="8" fontWeight="bold">U</text>
        {/* End marker (hospital) */}
        <circle cx="230" cy="20" r="8" className="fill-red-500" />
        <text x="230" y="23" textAnchor="middle" className="fill-white" fontSize="8" fontWeight="bold">H</text>
      </svg>

      {/* Animated ambulance */}
      <motion.div
        className="absolute"
        animate={{
          left: ['15%', '85%'],
          top: ['55%', '20%'],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatType: 'reverse' }}
      >
        <motion.div
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg border-2 border-emerald-500 dark:bg-gray-800">
            <Truck className="size-5 text-emerald-600 dark:text-emerald-400" />
          </div>
        </motion.div>
      </motion.div>

      {/* ETA badge */}
      <motion.div
        className="mt-4 flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 dark:bg-emerald-950/40"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Clock className="size-4 text-emerald-600 dark:text-emerald-400" />
        <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">ETA: 4 min</span>
      </motion.div>
    </div>
  );
}

function HospitalReadyIllustration() {
  const beds = [
    { status: 'ready', label: 'ICU-1' },
    { status: 'ready', label: 'ICU-2' },
    { status: 'ready', label: 'ER-1' },
    { status: 'occupied', label: 'ER-2' },
    { status: 'ready', label: 'GEN-1' },
    { status: 'ready', label: 'GEN-2' },
  ];

  return (
    <div className="relative flex flex-col items-center justify-center h-full gap-4">
      {/* Hospital building */}
      <motion.div
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/50"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Building2 className="size-7 text-emerald-600 dark:text-emerald-400" />
      </motion.div>

      <p className="text-xs font-medium text-muted-foreground">Bed Availability</p>

      {/* Bed grid */}
      <div className="grid grid-cols-3 gap-2">
        {beds.map((bed, i) => (
          <motion.div
            key={bed.label}
            className={`relative flex flex-col items-center justify-center rounded-lg border px-3 py-2 ${
              bed.status === 'ready'
                ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30'
                : 'border-muted bg-muted/50'
            }`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 + 0.2 }}
          >
            <BedDouble className={`size-4 ${bed.status === 'ready' ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`} />
            <span className="mt-1 text-[10px] font-medium text-muted-foreground">{bed.label}</span>
            {bed.status === 'ready' && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500">
                <Shield className="size-2.5 text-white" />
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function QRCardIllustration() {
  return (
    <div className="relative flex flex-col items-center justify-center h-full gap-4">
      {/* Card mockup */}
      <motion.div
        className="w-48 rounded-xl border bg-white p-4 shadow-lg dark:bg-gray-800 dark:border-gray-700"
        animate={{ rotateY: [0, 5, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Card header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Stethoscope className="size-4 text-red-500" />
            <span className="text-xs font-bold text-foreground">LifeLink</span>
          </div>
          <div className="rounded bg-red-100 px-1.5 py-0.5 dark:bg-red-950/50">
            <span className="text-[10px] font-semibold text-red-600 dark:text-red-400">MEDICAL</span>
          </div>
        </div>

        {/* User info */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
            <User className="size-4 text-gray-500" />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">John Doe</p>
            <p className="text-[10px] text-muted-foreground">O+ • Age 28</p>
          </div>
        </div>

        {/* QR code mockup */}
        <div className="flex justify-center">
          <div className="grid grid-cols-7 gap-0.5 p-2 rounded bg-gray-50 dark:bg-gray-700">
            {Array.from({ length: 49 }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 w-1.5 rounded-[0.5px] ${
                  Math.random() > 0.4 ? 'bg-gray-800 dark:bg-gray-200' : 'bg-transparent'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>

      <motion.p
        className="text-[10px] text-muted-foreground"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Scan for complete medical profile
      </motion.p>
    </div>
  );
}

/* ===== Main Demo Modal ===== */

export default function DemoModal({ open, onClose }: DemoModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const steps: DemoStep[] = [
    {
      id: 1,
      title: 'SOS Emergency',
      description: 'Activate SOS with one tap. Our system immediately locates you and dispatches the nearest ambulance.',
      icon: Phone,
      color: 'text-red-500',
      bgGradient: 'from-red-500/10 to-orange-500/5 dark:from-red-500/20 dark:to-orange-500/10',
      illustration: <SOSIllustration />,
    },
    {
      id: 2,
      title: 'AI Triage',
      description: 'Our AI analyzes your symptoms in real-time and assigns severity levels.',
      icon: Brain,
      color: 'text-violet-500',
      bgGradient: 'from-violet-500/10 to-purple-500/5 dark:from-violet-500/20 dark:to-purple-500/10',
      illustration: <AITriageIllustration />,
    },
    {
      id: 3,
      title: 'Live Tracking',
      description: 'Track your ambulance in real-time with accurate ETA updates.',
      icon: Truck,
      color: 'text-emerald-500',
      bgGradient: 'from-emerald-500/10 to-teal-500/5 dark:from-emerald-500/20 dark:to-teal-500/10',
      illustration: <LiveTrackingIllustration />,
    },
    {
      id: 4,
      title: 'Hospital Ready',
      description: 'The receiving hospital is notified and prepares for your arrival.',
      icon: Building2,
      color: 'text-emerald-500',
      bgGradient: 'from-emerald-500/10 to-sky-500/5 dark:from-emerald-500/20 dark:to-sky-500/10',
      illustration: <HospitalReadyIllustration />,
    },
    {
      id: 5,
      title: 'QR Medical Card',
      description: 'Carry your complete medical profile as a scannable QR card.',
      icon: QrCode,
      color: 'text-amber-500',
      bgGradient: 'from-amber-500/10 to-yellow-500/5 dark:from-amber-500/20 dark:to-yellow-500/10',
      illustration: <QRCardIllustration />,
    },
  ];

  const goToStep = useCallback(
    (step: number, dir: number) => {
      if (step < 0 || step >= steps.length) return;
      setDirection(dir);
      setCurrentStep(step);
    },
    [steps.length],
  );

  const nextStep = useCallback(() => goToStep(currentStep + 1, 1), [currentStep, goToStep]);
  const prevStep = useCallback(() => goToStep(currentStep - 1, -1), [currentStep, goToStep]);

  // Auto-play logic
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

  const handleClose = useCallback(() => {
    setCurrentStep(0);
    setAutoPlay(false);
    onClose();
  }, [onClose]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-[800px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>LifeLink Demo Walkthrough</DialogTitle>
          <DialogDescription>Interactive step-by-step demo of LifeLink features</DialogDescription>
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
              {autoPlay ? 'Pause' : 'Play Demo'}
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
                {step.title}
              </motion.h3>
              <motion.p
                key={`desc-${currentStep}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-2 text-sm leading-relaxed text-muted-foreground"
              >
                {step.description}
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
            Previous
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
            {currentStep === steps.length - 1 ? 'Done' : 'Next'}
            {currentStep < steps.length - 1 && <ChevronRight className="size-4" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
