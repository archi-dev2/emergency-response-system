'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock } from 'lucide-react';
import type { TimelineEvent } from '@/types';

interface EmergencyTimelineProps {
  events: TimelineEvent[];
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function EmergencyTimeline({ events }: EmergencyTimelineProps) {
  const prevCountRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [knownCount, setKnownCount] = useState(0);

  useEffect(() => {
    if (scrollRef.current && events.length > prevCountRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    if (events.length > prevCountRef.current) {
      setKnownCount(prevCountRef.current);
    }
    prevCountRef.current = events.length;
  }, [events.length]);

  return (
    <div
      ref={scrollRef}
      className="max-h-64 overflow-y-auto scrollbar-thin pr-2"
    >
      <div className="relative space-y-0 pl-6">
        {/* Vertical line */}
        <div className="absolute left-[9px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-red-600/50 via-red-600/20 to-transparent" />

        <AnimatePresence initial={false}>
          {events.map((event, index) => {
            const isNew = index >= knownCount && index === events.length - 1;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 25,
                  delay: 0.05,
                }}
                className="relative py-3"
              >
                {/* Dot */}
                <div className="absolute -left-6 top-4 z-10">
                  <motion.div
                    className="flex items-center justify-center"
                    initial={isNew ? { scale: 0 } : undefined}
                    animate={{ scale: 1 }}
                    transition={isNew ? { type: 'spring', stiffness: 400, damping: 15, delay: 0.1 } : undefined}
                  >
                    {index === events.length - 1 ? (
                      <div className="relative">
                        <div className="w-[18px] h-[18px] rounded-full bg-red-600 flex items-center justify-center shadow-[0_0_8px_oklch(0.55_0.24_27/0.5)]">
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                        {/* Pulse on latest */}
                        <motion.div
                          className="absolute inset-0 rounded-full bg-red-500/30"
                          animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      </div>
                    ) : (
                      <div className="w-[18px] h-[18px] rounded-full bg-zinc-800 border-2 border-red-600/40 flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-red-500/70" />
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Content */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">{event.event}</span>
                      {index === events.length - 1 && (
                        <motion.span
                          className="text-[9px] font-bold uppercase tracking-wider text-red-400 bg-red-600/20 px-1.5 py-0.5 rounded"
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          LIVE
                        </motion.span>
                      )}
                    </div>
                    {event.description && (
                      <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                        {event.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0 text-zinc-500">
                    <Clock className="w-3 h-3" />
                    <span className="text-[10px] font-mono">
                      {formatTimestamp(event.timestamp)}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
