'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Siren, Building2, Navigation, QrCode, Brain, BellRing, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
  iconGradient: string;
  decorIcon: React.ElementType;
}

const features: Feature[] = [
  {
    icon: Siren,
    title: 'Instant SOS with GPS',
    description:
      'One-tap emergency alert instantly shares your precise location with nearby responders and your emergency contacts.',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    accentColor: 'border-t-red-500',
    gradientFrom: 'from-red-500/[0.03]',
    gradientTo: 'to-transparent',
    iconGradient: 'bg-gradient-to-br from-red-500/15 to-red-500/5',
    decorIcon: Siren,
  },
  {
    icon: Building2,
    title: 'Smart Hospital Matching',
    description:
      'AI-powered algorithm matches you with the nearest hospital based on specialty, availability, and real-time traffic.',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    accentColor: 'border-t-emerald-500',
    gradientFrom: 'from-emerald-500/[0.03]',
    gradientTo: 'to-transparent',
    iconGradient: 'bg-gradient-to-br from-emerald-500/15 to-emerald-500/5',
    decorIcon: Building2,
  },
  {
    icon: Navigation,
    title: 'Live Ambulance Tracking',
    description:
      'Track your ambulance in real-time on a live map. Know exactly when help arrives — no more anxious waiting.',
    color: 'text-teal-500',
    bgColor: 'bg-teal-500/10',
    accentColor: 'border-t-teal-500',
    gradientFrom: 'from-teal-500/[0.03]',
    gradientTo: 'to-transparent',
    iconGradient: 'bg-gradient-to-br from-teal-500/15 to-teal-500/5',
    decorIcon: Navigation,
  },
  {
    icon: QrCode,
    title: 'Digital Medical QR Card',
    description:
      'Your complete medical profile accessible via QR code — blood type, allergies, medications, and emergency contacts.',
    color: 'text-violet-500',
    bgColor: 'bg-violet-500/10',
    accentColor: 'border-t-violet-500',
    gradientFrom: 'from-violet-500/[0.03]',
    gradientTo: 'to-transparent',
    iconGradient: 'bg-gradient-to-br from-violet-500/15 to-violet-500/5',
    decorIcon: QrCode,
  },
  {
    icon: Brain,
    title: 'AI Triage Assessment',
    description:
      'Answer a few quick questions and our AI assesses severity to prioritize and route your emergency appropriately.',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    accentColor: 'border-t-amber-500',
    gradientFrom: 'from-amber-500/[0.03]',
    gradientTo: 'to-transparent',
    iconGradient: 'bg-gradient-to-br from-amber-500/15 to-amber-500/5',
    decorIcon: Brain,
  },
  {
    icon: BellRing,
    title: 'Family Alerts & Updates',
    description:
      'Your loved ones receive real-time notifications with your location, hospital ETA, and status updates automatically.',
    color: 'text-rose-500',
    bgColor: 'bg-rose-500/10',
    accentColor: 'border-t-rose-500',
    gradientFrom: 'from-rose-500/[0.03]',
    gradientTo: 'to-transparent',
    iconGradient: 'bg-gradient-to-br from-rose-500/15 to-rose-500/5',
    decorIcon: BellRing,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

export default function Features() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="features" className="relative py-24 sm:py-32">
      {/* Section header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-block rounded-full bg-emergency/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emergency">
            Features
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything You Need in an{' '}
            <span className="gradient-text">Emergency</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From the moment you press SOS to the moment you receive care, LifeLink
            orchestrates every step seamlessly.
          </p>
        </motion.div>

        {/* Feature cards grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={cardVariants}>
              <Card className={cn(
                'card-hover-feature group h-full border-t-2 border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden',
                feature.accentColor
              )}>
                {/* Subtle gradient background */}
                <div className={cn(
                  'absolute inset-0 bg-gradient-to-b pointer-events-none',
                  feature.gradientFrom,
                  feature.gradientTo
                )} />
                <CardContent className="relative p-6">
                  {/* Decorative element top-right */}
                  <feature.decorIcon className={cn(
                    'absolute top-4 right-4 size-8 opacity-[0.06] transition-opacity group-hover:opacity-[0.12]',
                    feature.color
                  )} />

                  {/* Icon with gradient container */}
                  <div
                    className={cn(
                      'mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110',
                      feature.iconGradient
                    )}
                  >
                    <feature.icon className={cn('size-6', feature.color)} />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>

                  {/* Learn more link */}
                  <div className="mt-4 flex items-center gap-1 text-xs font-medium text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                    <span>Learn more</span>
                    <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
