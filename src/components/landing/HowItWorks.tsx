'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Hand,
  MapPin,
  Ambulance,
  Route,
  Building,
  ScanLine,
  ChevronRight,
  Zap,
  Radio,
  Clock,
  MapPinned,
  HeartPulse,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  number: number;
  icon: React.ElementType;
  title: string;
  description: string;
  subIcon: React.ElementType;
}

const steps: Step[] = [
  {
    number: 1,
    icon: Hand,
    title: 'Press SOS',
    description: 'Tap the SOS button to trigger an emergency alert instantly.',
    subIcon: Zap,
  },
  {
    number: 2,
    icon: MapPin,
    title: 'GPS Capture',
    description: 'Your precise location is captured and shared with responders.',
    subIcon: MapPinned,
  },
  {
    number: 3,
    icon: Ambulance,
    title: 'Ambulance Assigned',
    description: 'The nearest available ambulance is dispatched to you.',
    subIcon: Radio,
  },
  {
    number: 4,
    icon: Route,
    title: 'Live Tracking',
    description: 'Track the ambulance in real-time with ETA updates.',
    subIcon: Clock,
  },
  {
    number: 5,
    icon: Building,
    title: 'Hospital Ready',
    description: 'The hospital prepares for your arrival with your medical data.',
    subIcon: HeartPulse,
  },
  {
    number: 6,
    icon: ScanLine,
    title: 'QR Scan at Arrival',
    description: 'Your QR card provides instant access to your full medical profile.',
    subIcon: ShieldCheck,
  },
];

const stepVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.12, ease: 'easeOut' },
  }),
};

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="how-it-works"
      className="relative py-24 sm:py-32"
    >
      {/* Subtle gradient background instead of flat */}
      <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface to-background" />
      {/* Subtle dot pattern overlay */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              'radial-gradient(circle, currentColor 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            How It Works
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            From SOS to{' '}
            <span className="gradient-text">Care in Minutes</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Six simple steps connecting you to life-saving care when every second counts.
          </p>
        </motion.div>

        {/* Stepper */}
        <div ref={ref} className="mt-16">
          {/* Desktop: Horizontal */}
          <div className="hidden lg:block">
            <div className="relative flex items-start justify-between">
              {/* Connecting line background */}
              <div className="absolute left-0 right-0 top-12 h-0.5 bg-border/60" />
              {/* Connecting line animated progress */}
              <motion.div
                className="absolute left-0 top-12 h-0.5 bg-gradient-to-r from-emergency to-primary"
                initial={{ width: '0%' }}
                animate={isInView ? { width: '100%' } : { width: '0%' }}
                transition={{ duration: 1.5, delay: 0.3, ease: 'easeInOut' }}
              />
              {/* Arrow indicators between steps */}
              {steps.slice(0, -1).map((_, i) => (
                <div
                  key={`arrow-${i}`}
                  className="absolute top-[38px] z-10 text-muted-foreground/40"
                  style={{ left: `${((i + 1) / steps.length) * 100 - 1.2}%` }}
                >
                  <ChevronRight className="size-4" />
                </div>
              ))}

              {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  custom={i}
                  variants={stepVariants}
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                  className="relative z-10 flex flex-1 flex-col items-center"
                >
                  {/* Step circle with gradient */}
                  <motion.div
                    className={cn(
                      'relative flex h-24 w-24 items-center justify-center rounded-2xl border-2 shadow-lg transition-colors',
                      i % 2 === 0
                        ? 'border-emergency/30 bg-gradient-to-br from-emergency/5 to-emergency/[0.01]'
                        : 'border-primary/30 bg-gradient-to-br from-primary/5 to-primary/[0.01]'
                    )}
                    whileHover={{ scale: 1.08, boxShadow: '0 8px 30px oklch(0 0 0 / 0.15)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <step.icon
                      className={cn(
                        'size-10',
                        i % 2 === 0 ? 'text-emergency' : 'text-primary'
                      )}
                    />
                    {/* Pulsing dot on step 1 */}
                    {i === 0 && (
                      <span className="absolute -top-1 -left-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emergency opacity-75" />
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-emergency" />
                      </span>
                    )}
                  </motion.div>

                  {/* Step number badge with gradient */}
                  <div
                    className={cn(
                      'absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white shadow-md',
                      i % 2 === 0
                        ? 'bg-gradient-to-br from-emergency to-red-600'
                        : 'bg-gradient-to-br from-primary to-primary/80'
                    )}
                  >
                    {step.number}
                  </div>

                  {/* Text with sub icon */}
                  <div className="mt-5 max-w-[140px] text-center">
                    <h3 className="text-sm font-semibold">{step.title}</h3>
                    <step.subIcon className={cn(
                      'mx-auto mt-1.5 size-3.5',
                      i % 2 === 0 ? 'text-emergency/40' : 'text-primary/40'
                    )} />
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile: Vertical */}
          <div className="lg:hidden flex flex-col gap-0">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                custom={i}
                variants={stepVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                className="relative flex gap-4"
              >
                {/* Timeline line with gradient */}
                {i < steps.length - 1 && (
                  <motion.div
                    className="absolute left-6 top-14 w-0.5 bg-border/60"
                    initial={{ height: 0 }}
                    animate={isInView ? { height: '100%' } : { height: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 + i * 0.12 }}
                  />
                )}

                {/* Step circle with gradient */}
                <motion.div
                  className={cn(
                    'relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 shadow-md',
                    i % 2 === 0
                      ? 'border-emergency/30 bg-gradient-to-br from-emergency/10 to-emergency/[0.02]'
                      : 'border-primary/30 bg-gradient-to-br from-primary/10 to-primary/[0.02]'
                  )}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <step.icon
                    className={cn(
                      'size-5',
                      i % 2 === 0 ? 'text-emergency' : 'text-primary'
                    )}
                  />
                  {/* Pulsing dot on step 1 */}
                  {i === 0 && (
                    <span className="absolute -top-0.5 -left-0.5 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emergency opacity-75" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emergency" />
                    </span>
                  )}
                </motion.div>

                {/* Content */}
                <div className="pb-8">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold">{step.title}</h3>
                    <span
                      className={cn(
                        'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white',
                        i % 2 === 0
                          ? 'bg-gradient-to-br from-emergency to-red-600'
                          : 'bg-gradient-to-br from-primary to-primary/80'
                      )}
                    >
                      {step.number}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <step.subIcon className={cn(
                      'size-3',
                      i % 2 === 0 ? 'text-emergency/40' : 'text-primary/40'
                    )} />
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
