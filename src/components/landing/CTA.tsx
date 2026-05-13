'use client';

import { motion } from 'framer-motion';
import { ArrowRight, QrCode, Heart, Droplets, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigationStore } from '@/store';

export default function CTA() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 hero-gradient opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center lg:text-left"
          >
            <span className="inline-block rounded-full bg-emergency/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emergency">
              Get Your Card
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Your Medical Emergency Card,{' '}
              <span className="gradient-text">Always Ready</span>
            </h2>
            <p className="mt-4 max-w-lg text-lg text-muted-foreground lg:text-xl">
              Create your free digital medical ID card in under 2 minutes. It stores your
              blood type, allergies, medications, and emergency contacts — accessible
              instantly via QR code.
            </p>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <Button
                size="lg"
                className="bg-emergency hover:bg-emergency/90 text-emergency-foreground h-12 px-8 text-base font-semibold shadow-lg shadow-emergency/25"
                onClick={() => useNavigationStore.getState().setCurrentPage('signup')}
              >
                Sign Up Free
                <ArrowRight className="size-5" />
              </Button>
              <span className="text-sm text-muted-foreground">
                No credit card required
              </span>
            </div>

            {/* Features list */}
            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                'Instant QR code generation',
                'Offline access always works',
                'Shareable with family',
                'HIPAA compliant & encrypted',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emergency/10">
                    <svg
                      className="size-3 text-emergency"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right: QR Card Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40, rotateY: -15 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex flex-1 items-center justify-center"
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-4 rounded-3xl bg-emergency/10 blur-2xl" />

              {/* Card */}
              <div className="relative w-80 rounded-2xl border border-border/50 bg-card p-6 shadow-2xl sm:w-96">
                {/* Card header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emergency text-emergency-foreground">
                      <Heart className="size-4" fill="currentColor" />
                    </div>
                    <span className="text-sm font-bold">LifeLink</span>
                  </div>
                  <span className="rounded-full bg-emergency/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-emergency">
                    Medical ID
                  </span>
                </div>

                {/* Patient info */}
                <div className="mt-5 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                    <User className="size-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">Sarah Johnson</p>
                    <p className="text-xs text-muted-foreground">
                      Blood: O+ &bull; Age: 32
                    </p>
                  </div>
                </div>

                {/* Medical info */}
                <div className="mt-5 grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <Droplets className="mx-auto size-4 text-red-400" />
                    <p className="mt-1 text-[10px] font-medium text-muted-foreground">Blood</p>
                    <p className="text-xs font-bold">O+</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <Heart className="mx-auto size-4 text-emergency" />
                    <p className="mt-1 text-[10px] font-medium text-muted-foreground">Allergies</p>
                    <p className="text-xs font-bold">Penicillin</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <QrCode className="mx-auto size-4 text-primary" />
                    <p className="mt-1 text-[10px] font-medium text-muted-foreground">Medications</p>
                    <p className="text-xs font-bold">Metformin</p>
                  </div>
                </div>

                {/* QR code area */}
                <div className="mt-5 flex items-center gap-4 rounded-xl border border-dashed border-border p-4">
                  {/* QR pattern mockup */}
                  <div className="grid shrink-0 grid-cols-7 gap-[2px]">
                    {Array.from({ length: 49 }).map((_, i) => {
                      const row = Math.floor(i / 7);
                      const col = i % 7;
                      const isCorner =
                        (row < 3 && col < 3) ||
                        (row < 3 && col > 3) ||
                        (row > 3 && col < 3);
                      const isFilled =
                        isCorner || (i * 7 + row * 3 + col) % 3 !== 0;
                      return (
                        <div
                          key={i}
                          className={`h-3 w-3 rounded-[1px] ${isFilled ? 'bg-foreground' : 'bg-muted'}`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xs font-semibold">Scan for Full Profile</p>
                    <p className="text-[10px] text-muted-foreground">
                      Emergency contacts & medical history
                    </p>
                  </div>
                </div>

                {/* Emergency contact */}
                <div className="mt-4 rounded-lg bg-emergency/5 px-4 py-3">
                  <p className="text-[10px] uppercase tracking-wider text-emergency font-semibold">
                    Emergency Contact
                  </p>
                  <p className="text-sm font-medium mt-0.5">John Johnson</p>
                  <p className="text-xs text-muted-foreground">+1 (555) 123-4567 &bull; Spouse</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
