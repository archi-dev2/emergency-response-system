'use client';


import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  MapPin,
  CheckCircle2,
  Phone,
  Wifi,
  Shield,
  X,
  AlertTriangle,
  ArrowRight,
  Heart,
  Wind,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEmergencyStore, useNavigationStore } from '@/store';
import { SEVERITY_LABELS } from '@/lib/mock-data';
import SOSButton from '@/components/sos/SOSButton';
import SOSConfirmDialog from '@/components/sos/SOSConfirmDialog';
import CountdownTimer from '@/components/sos/CountdownTimer';
import EmergencyTimeline from '@/components/sos/EmergencyTimeline';
import TriageChat from '@/components/ai/TriageChat';

/* ------------------------------------------------------------------ */
/*  Connection Steps shown after activation                           */
/* ------------------------------------------------------------------ */
interface ConnStep {
  id: string;
  label: string;
  icon: typeof MapPin;
}

const CONNECTION_STEPS: ConnStep[] = [
  { id: 'location', label: 'Location Detected', icon: MapPin },
  { id: 'alert', label: 'Alert Sent', icon: Phone },
  { id: 'ambulance', label: 'Ambulance Found', icon: Wifi },
  { id: 'hospital', label: 'Hospital Notified', icon: Shield },
];

/* ------------------------------------------------------------------ */
/*  Emergency Tips                                                     */
/* ------------------------------------------------------------------ */
interface Tip {
  icon: typeof Heart;
  title: string;
  description: string;
  color: string;
}

const EMERGENCY_TIPS: Tip[] = [
  { icon: Heart, title: 'Stay Calm', description: 'Keep breathing deeply and stay as still as possible.', color: 'text-rose-400' },
  { icon: X, title: "Don't Move Patient", description: 'Avoid moving the patient unless there is immediate danger.', color: 'text-amber-400' },
  { icon: Wind, title: 'Check Breathing', description: 'Ensure airway is clear and monitor breathing rate.', color: 'text-emerald-400' },
  { icon: Eye, title: 'Monitor Consciousness', description: 'Talk to the patient and check if they can respond.', color: 'text-teal-400' },
];

/* ------------------------------------------------------------------ */
/*  Floating Medical Icons for Background                             */
/* ------------------------------------------------------------------ */
const FLOATING_ICONS = [
  { symbol: '+', x: '10%', y: '20%', delay: 0, duration: 7 },
  { symbol: '♥', x: '85%', y: '15%', delay: 2, duration: 9 },
  { symbol: '⚕', x: '75%', y: '70%', delay: 4, duration: 8 },
  { symbol: '+', x: '20%', y: '75%', delay: 1, duration: 6 },
  { symbol: '♥', x: '50%', y: '10%', delay: 3, duration: 10 },
  { symbol: '⚕', x: '90%', y: '45%', delay: 5, duration: 7 },
  { symbol: '+', x: '5%', y: '50%', delay: 6, duration: 9 },
  { symbol: '♥', x: '40%', y: '85%', delay: 2, duration: 8 },
];

/* ------------------------------------------------------------------ */
/*  SOSPage                                                            */
/* ------------------------------------------------------------------ */
export default function SOSPage() {
  const {
    sosActivated,
    activeEmergency,
    activateSOS,
    cancelEmergency,
  } = useEmergencyStore();
  const { setCurrentPage } = useNavigationStore();

  const prefersReducedMotion = useReducedMotion();

  const [locationDetected, setLocationDetected] = useState(false);
  const [locationText, setLocationText] = useState('Detecting location...');
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [redirectTimer, setRedirectTimer] = useState(5);
  const [emergencyElapsed, setEmergencyElapsed] = useState(0);

  const sosButtonRef = useRef<HTMLDivElement>(null);
  const redirectTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingSeverityRef = useRef<number>(4);
  const pendingDescriptionRef = useRef<string | undefined>(undefined);

  /* Simulate location detection */
  useEffect(() => {
    const timer = setTimeout(() => {
      setLocationDetected(true);
      setLocationText('New Delhi, India');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  /* Live elapsed timer when emergency is active */
  useEffect(() => {
    if (sosActivated && activeEmergency) {
      const startTime = new Date(activeEmergency.startedAt).getTime();
      elapsedTimerRef.current = setInterval(() => {
        setEmergencyElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else {
      if (elapsedTimerRef.current) {
        clearInterval(elapsedTimerRef.current);
        elapsedTimerRef.current = null;
      }
    }
    return () => {
      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
    };
  }, [sosActivated, activeEmergency]);

  /* Simulate connection steps after activation */
  const wasActiveRef = useRef(false);

  useEffect(() => {
    if (!sosActivated || !activeEmergency) {
      if (wasActiveRef.current) {
        wasActiveRef.current = false;
        setTimeout(() => setCompletedSteps(new Set()), 0);
      }
      return;
    }

    wasActiveRef.current = true;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const steps = ['location', 'alert', 'ambulance', 'hospital'];

    steps.forEach((step, index) => {
      timers.push(
        setTimeout(() => {
          setCompletedSteps((prev) => new Set([...prev, step]));
        }, 800 + index * 900)
      );
    });

    return () => timers.forEach(clearTimeout);
  }, [sosActivated, activeEmergency]);

  /* Auto-redirect to tracking after all steps complete */
  const allStepsDone = completedSteps.size === CONNECTION_STEPS.length;
  const allDoneRef = useRef(false);
  const redirectCountRef = useRef(5);

  const startRedirectCountdown = useCallback(() => {
    redirectCountRef.current = 5;
    redirectTimerRef.current = setInterval(() => {
      redirectCountRef.current -= 1;
      if (redirectCountRef.current <= 0) {
        if (redirectTimerRef.current) clearInterval(redirectTimerRef.current);
        setCurrentPage('tracking');
      } else {
        setRedirectTimer(redirectCountRef.current);
      }
    }, 1000);
  }, [setCurrentPage]);

  useEffect(() => {
    if (allStepsDone && !allDoneRef.current) {
      allDoneRef.current = true;
      startRedirectCountdown();
    }
    if (!allStepsDone && allDoneRef.current) {
      allDoneRef.current = false;
      if (redirectTimerRef.current) clearInterval(redirectTimerRef.current);
    }

    return () => {
      if (redirectTimerRef.current) clearInterval(redirectTimerRef.current);
    };
  }, [allStepsDone, startRedirectCountdown]);

  /* Handlers */
  const handleHoldComplete = useCallback(() => {
    setShowConfirm(true);
  }, []);

  const handleConfirmEmergency = useCallback(
    (severity: number, description?: string) => {
      pendingSeverityRef.current = severity;
      pendingDescriptionRef.current = description;
      setShowCountdown(true);
    },
    []
  );

  const handleCountdownComplete = useCallback(() => {
    setShowCountdown(false);
    activateSOS(pendingSeverityRef.current, pendingDescriptionRef.current);
  }, [activateSOS]);

  const handleCancel = useCallback(() => {
    cancelEmergency();
    setCompletedSteps(new Set());
    setRedirectTimer(5);
    if (redirectTimerRef.current) clearInterval(redirectTimerRef.current);
  }, [cancelEmergency]);

  const handleTriageTriggerSOS = useCallback(() => {
    if (sosButtonRef.current) {
      sosButtonRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  /* Format elapsed time */
  const formatElapsed = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  /* Motion variants */
  const pageEntry = prefersReducedMotion
    ? { initial: {}, animate: {} }
    : {
        initial: { opacity: 0, scale: 0.97 },
        animate: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
      };

  const pulseRingAnim = prefersReducedMotion
    ? {}
    : {
        scale: [0.8, 2.5],
        opacity: [0.8, 0],
        transition: { duration: 2.5, repeat: Infinity, ease: 'easeOut' },
      };

  const floatAnim = (delay: number, duration: number) =>
    prefersReducedMotion
      ? {}
      : {
          y: [0, -18, 0],
          rotate: [0, 4, 0],
          transition: { duration, repeat: Infinity, ease: 'easeInOut', delay },
        };

  /* ---- Render ---- */

  /* Activated Overlay */
  if (sosActivated && activeEmergency) {
    const allDone = completedSteps.size === CONNECTION_STEPS.length;
    const severityInfo = SEVERITY_LABELS[activeEmergency.severity];

    return (
      <motion.div
        {...pageEntry}
        className="relative z-10 flex flex-col overflow-hidden"
      >
        {/* Darker red gradient background when emergency active */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 30%, oklch(0.25 0.08 27 / 0.95), oklch(0.06 0.015 285 / 0.98))',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />

        {/* Emergency flash border */}
        <div className="absolute inset-0 border-4 border-red-600/20 pointer-events-none emergency-flash" />

        <div className="relative z-10 flex flex-col flex-1 overflow-y-auto">
          {/* Emergency Active Banner */}
          <motion.div
            className="flex items-center justify-center px-6 pt-6 pb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 bg-red-900/40 border border-red-600/30 rounded-full px-5 py-2.5 backdrop-blur-sm">
              <motion.div
                className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_12px_oklch(0.55_0.24_27/0.9)]"
                animate={
                  prefersReducedMotion
                    ? {}
                    : { scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }
                }
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="text-red-300 text-sm font-bold tracking-wider uppercase">
                Emergency Active
              </span>
            </div>
          </motion.div>

          {/* Elapsed Timer */}
          <div className="text-center px-6 mb-2">
            <motion.p
              className="text-zinc-500 text-xs font-medium mb-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Time Elapsed
            </motion.p>
            <motion.p
              className="text-red-400 text-2xl font-bold font-mono tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {formatElapsed(emergencyElapsed)}
            </motion.p>
          </div>

          {/* Request ID in monospace */}
          <div className="text-center px-6 mb-4">
            <motion.div
              className="inline-flex items-center gap-2 bg-zinc-900/60 border border-zinc-800/60 rounded-lg px-4 py-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className="text-zinc-500 text-xs">Request ID:</span>
              <span className="text-emerald-400 text-sm font-mono font-bold tracking-wider">
                {activeEmergency.requestId}
              </span>
            </motion.div>
          </div>

          {/* Severity badge */}
          <div className="flex justify-center px-6 mb-6">
            <Badge
              variant="outline"
              className={`${severityInfo?.bgColor ?? 'bg-zinc-800'} ${severityInfo?.color ?? 'text-zinc-300'} border-0 text-sm px-4 py-1.5`}
            >
              {severityInfo?.label ?? 'CRITICAL'}
            </Badge>
          </div>

          {/* Connection Steps */}
          <div className="px-6 max-w-md mx-auto w-full mb-8">
            <div className="space-y-5">
              {CONNECTION_STEPS.map((step, index) => {
                const done = completedSteps.has(step.id);
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.id}
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.15 }}
                  >
                    <motion.div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 ${
                        done
                          ? 'bg-green-500/20 border-green-500/50'
                          : 'bg-zinc-800/50 border-zinc-700'
                      }`}
                      animate={done ? { scale: [0.8, 1.1, 1] } : {}}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    >
                      {done ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      ) : (
                        <Icon className="w-5 h-5 text-zinc-600" />
                      )}
                    </motion.div>
                    <div>
                      <p
                        className={`text-sm font-semibold transition-colors duration-300 ${
                          done ? 'text-green-400' : 'text-zinc-500'
                        }`}
                      >
                        {step.label}
                      </p>
                      {done && <p className="text-[10px] text-green-500/60 mt-0.5">Completed</p>}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Timeline */}
          {activeEmergency.timeline.length > 0 && (
            <div className="px-6 max-w-md mx-auto w-full mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
                Live Timeline
              </h3>
              <EmergencyTimeline events={activeEmergency.timeline} />
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Bottom actions */}
          <div className="px-6 pb-8 pt-4">
            {allDone && (
              <motion.div
                className="flex items-center justify-center gap-2 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <span className="text-zinc-400 text-sm">Redirecting to tracking in</span>
                <span className="text-red-400 font-bold text-lg font-mono">{redirectTimer}</span>
              </motion.div>
            )}

            <div className="flex gap-3 max-w-md mx-auto">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex-1 border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 bg-zinc-900/50"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel Emergency
              </Button>
              {allDone && (
                <Button
                  onClick={() => setCurrentPage('tracking')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white border-0"
                >
                  Track Ambulance
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  /* ---- Default: No active emergency ---- */
  return (
    <motion.div
      {...pageEntry}
      className="relative z-10 flex flex-col overflow-y-auto"
    >
      {/* Dark gradient overlay background with urgency */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, oklch(0.18 0.06 27 / 0.7), transparent 60%), radial-gradient(ellipse at 80% 70%, oklch(0.12 0.03 285 / 0.4), transparent 50%), oklch(0.06 0.015 285 / 0.97)',
        }}
      />

      {/* Floating medical icons / ambient particles */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {FLOATING_ICONS.map((item, i) => (
            <motion.span
              key={i}
              className="absolute text-zinc-700/20 dark:text-zinc-400/10 select-none"
              style={{ left: item.x, top: item.y, fontSize: '1.25rem' }}
              animate={floatAnim(item.delay, item.duration)}
            >
              {item.symbol}
            </motion.span>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Top status bar */}
        <motion.div
          className="flex items-center justify-center px-6 pt-6 pb-2"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div className="flex items-center gap-2 bg-zinc-900/60 border border-zinc-800/60 rounded-full px-4 py-2 backdrop-blur-sm">
            <motion.div
              className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_6px_oklch(0.55_0.2_145/0.7)]"
              animate={
                prefersReducedMotion
                  ? {}
                  : { scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }
              }
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-green-400 text-xs font-semibold tracking-wide">
              Emergency Services Ready
            </span>
          </div>
        </motion.div>

        {/* Location pill */}
        <div className="flex items-center justify-center px-6 pt-2 pb-4">
          <motion.div
            className="flex items-center gap-2 bg-zinc-900/40 border border-zinc-800/40 rounded-full px-4 py-1.5"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <MapPin className="w-3.5 h-3.5 text-zinc-500" />
            <span className={`text-xs ${locationDetected ? 'text-zinc-300' : 'text-zinc-600'}`}>
              {locationText}
            </span>
            {!locationDetected && (
              <motion.div
                className="w-3 h-3 border-2 border-zinc-600 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            )}
          </motion.div>
        </div>

        {/* SOS Button area with concentric pulse rings */}
        <div
          ref={sosButtonRef}
          className="relative flex flex-col items-center justify-center flex-1 px-6 -mt-8"
        >
          {/* Framer Motion Concentric Pulse Rings (always visible, 3 rings) */}
          {!prefersReducedMotion && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                className="absolute w-48 h-48 sm:w-56 sm:h-56 rounded-full border-2 border-red-500/25"
                animate={pulseRingAnim}
                transition={{ ...pulseRingAnim.transition, delay: 0 }}
              />
              <motion.div
                className="absolute w-48 h-48 sm:w-56 sm:h-56 rounded-full border-2 border-red-500/15"
                animate={pulseRingAnim}
                transition={{ ...pulseRingAnim.transition, delay: 0.8 }}
              />
              <motion.div
                className="absolute w-48 h-48 sm:w-56 sm:h-56 rounded-full border-2 border-red-500/10"
                animate={pulseRingAnim}
                transition={{ ...pulseRingAnim.transition, delay: 1.6 }}
              />
            </div>
          )}

          {/* Animated gradient border wrapper around SOS button */}
          <motion.div
            className="relative mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.6, type: 'spring' }}
          >
            {/* Animated gradient border (red → orange → amber) */}
            {!prefersReducedMotion && (
              <motion.div
                className="absolute -inset-1 rounded-full"
                style={{
                  background: 'conic-gradient(from var(--sos-angle, 0deg), #ef4444, #f97316, #f59e0b, #ef4444)',
                  filter: 'blur(1px)',
                }}
                animate={{
                  '--sos-angle': [0, 360],
                } as Record<string, number[]>}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            )}
            <div className="relative">
              <SOSButton onHoldComplete={handleHoldComplete} isActivated={false} />
            </div>
          </motion.div>

          <motion.p
            className="text-zinc-500 text-sm font-medium tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Press and hold for 2 seconds to activate
          </motion.p>

          {/* Emergency number */}
          <motion.div
            className="mt-4 flex items-center gap-2 text-zinc-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="text-xs">or call <span className="text-red-400 font-semibold">108</span> directly</span>
          </motion.div>
        </div>

        {/* Emergency Tips Cards (when not in emergency) */}
        <motion.div
          className="px-4 pb-4 pt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-3 px-2">
            Emergency Preparedness Tips
          </p>
          <div className="grid grid-cols-2 gap-2 max-w-2xl mx-auto">
            {EMERGENCY_TIPS.map((tip, i) => {
              const TipIcon = tip.icon;
              return (
                <motion.div
                  key={tip.title}
                  className="card-shine glass-card rounded-xl p-3"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <TipIcon className={`w-4 h-4 ${tip.color}`} />
                    <span className="text-xs font-semibold text-zinc-300">{tip.title}</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">{tip.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Bottom: Triage Chat with gradient header bar */}
        <div className="px-4 pb-6 pt-2">
          <TriageChat onTriggerSOS={handleTriageTriggerSOS} />
        </div>
      </div>

      {/* Confirm Dialog */}
      <SOSConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        onConfirm={handleConfirmEmergency}
      />

      {/* Countdown overlay (shown after user confirms emergency) */}
      <CountdownTimer
        isActive={showCountdown}
        onComplete={handleCountdownComplete}
      />
    </motion.div>
  );
}
