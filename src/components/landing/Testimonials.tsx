"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star, BadgeCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const TESTIMONIAL_META = [
  {
    name: "Priya Sharma",
    initials: "PS",
    avatarColor: "bg-rose-500",
    rating: 5,
  },
  {
    name: "Rajesh Kumar",
    initials: "RK",
    avatarColor: "bg-emerald-500",
    rating: 5,
  },
  {
    name: "Ananya Desai",
    initials: "AD",
    avatarColor: "bg-amber-500",
    rating: 4,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: "easeOut" as const },
  }),
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "size-4",
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted",
          )}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const testimonialData = [
    { ...TESTIMONIAL_META[0], ...t.testimonials.items.priya },
    { ...TESTIMONIAL_META[1], ...t.testimonials.items.rajesh },
    { ...TESTIMONIAL_META[2], ...t.testimonials.items.ananya },
  ];

  return (
    <section id="about" className="relative bg-surface py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-block rounded-full bg-emergency/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emergency">
            {t.testimonials.badge}
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {t.testimonials.heading}{" "}
            <span className="gradient-text">
              {t.testimonials.headingGradient}
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t.testimonials.subheading}
          </p>
        </motion.div>

        <div ref={ref} className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonialData.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <Card className="testimonial-border card-hover relative h-full overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
                <div className="pointer-events-none absolute -top-2 left-4 text-8xl font-serif leading-none text-emergency/[0.06] select-none">
                  &ldquo;
                </div>
                <CardContent className="relative flex h-full flex-col justify-between p-6">
                  <div>
                    <div className="mb-3">
                      <StarRating rating={testimonial.rating} />
                    </div>
                    <div className="mb-3 text-2xl font-serif leading-none text-emergency/15">
                      &ldquo;
                    </div>
                    <p className="relative text-sm leading-relaxed text-foreground/80">
                      {testimonial.text}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-3 border-t border-border/50 pt-4">
                    <div className="avatar-ring">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white",
                          testimonial.avatarColor,
                        )}
                      >
                        {testimonial.initials}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold">
                          {testimonial.name}
                        </span>
                        <BadgeCheck className="size-3.5 text-emerald-500" />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {testimonial.role}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
