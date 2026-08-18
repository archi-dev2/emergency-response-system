"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Siren,
  Building2,
  Navigation,
  QrCode,
  Brain,
  BellRing,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const FEATURE_ICONS = [Siren, Building2, Navigation, QrCode, Brain, BellRing];
const FEATURE_ACCENTS = [
  { accent: "#ef4444", glow: "rgba(239,68,68,0.15)", number: "01" },
  { accent: "#10b981", glow: "rgba(16,185,129,0.15)", number: "02" },
  { accent: "#06b6d4", glow: "rgba(6,182,212,0.15)", number: "03" },
  { accent: "#8b5cf6", glow: "rgba(139,92,246,0.15)", number: "04" },
  { accent: "#f59e0b", glow: "rgba(245,158,11,0.15)", number: "05" },
  { accent: "#ec4899", glow: "rgba(236,72,153,0.15)", number: "06" },
];

export default function Features() {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const featureItems = [
    t.features.items.sos,
    t.features.items.hospital,
    t.features.items.tracking,
    t.features.items.qrCard,
    t.features.items.aiTriage,
    t.features.items.familyAlerts,
  ];

  return (
    <section id="features" className="relative py-24 sm:py-32 bg-background">
      {/* Faint grid */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.025] dark:opacity-[0.04] pointer-events-none">
        <defs>
          <pattern
            id="feat-grid"
            x="0"
            y="0"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#feat-grid)" />
      </svg>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <span className="inline-block rounded-full border border-emergency/30 bg-emergency/10 px-5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-emergency mb-6">
            {t.features.badge}
          </span>
          <h2
            className="font-black tracking-tight"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", lineHeight: 1.05 }}
          >
            {t.features.heading}
            <br />
            <span className="gradient-text">{t.features.headingGradient}</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
            {t.features.subheading}
          </p>
        </motion.div>

        {/* Feature grid */}
        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border/60 rounded-2xl overflow-hidden border border-border/60"
        >
          {featureItems.map((f, i) => {
            const Icon = FEATURE_ICONS[i];
            const { accent, glow, number } = FEATURE_ACCENTS[i];
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ scale: 1.02, zIndex: 10 }}
                style={{ perspective: 900 }}
                className="relative group bg-card"
              >
                {/* Hover glow */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-none"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${glow}, transparent 65%)`,
                  }}
                />

                <div className="relative p-7 h-full flex flex-col">
                  {/* Number + icon row */}
                  <div className="flex items-start justify-between mb-5">
                    <span
                      className="font-black text-5xl tabular-nums leading-none"
                      style={{
                        color: `${accent}18`,
                        WebkitTextStroke: `1px ${accent}30`,
                      }}
                    >
                      {number}
                    </span>
                    <motion.div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                      style={{
                        background: `${accent}15`,
                        border: `1px solid ${accent}25`,
                      }}
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 15,
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: accent }} />
                    </motion.div>
                  </div>

                  <h3 className="text-lg font-bold mb-2 group-hover:text-foreground transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    {f.description}
                  </p>

                  {/* Arrow link */}
                  <div
                    className="mt-5 flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ color: accent }}
                  >
                    <span>{t.features.learnMore}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>

                  {/* Bottom accent line */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-300 rounded-b"
                    style={{
                      background: `linear-gradient(90deg, ${accent}, transparent)`,
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
