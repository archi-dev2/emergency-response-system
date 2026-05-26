'use client';

import { motion } from 'framer-motion';
import { Siren, Navigation, Building2, ArrowRight } from 'lucide-react';
import { useNavigationStore } from '@/store';
import { cn } from '@/lib/utils';

interface QuickAction {
  id: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  route: 'sos' | 'tracking' | 'hospitals';
  gradient: string;
  shadowColor: string;
  iconBg: string;
}

const ACTIONS: QuickAction[] = [
  {
    id: 'emergency-sos',
    icon: Siren,
    title: 'Emergency SOS',
    subtitle: 'Get help in seconds',
    route: 'sos',
    gradient: 'bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600',
    shadowColor: 'hover:shadow-red-500/30',
    iconBg: 'bg-white/15',
  },
  {
    id: 'track-ambulance',
    icon: Navigation,
    title: 'Track Ambulance',
    subtitle: 'Live location updates',
    route: 'tracking',
    gradient: 'bg-gradient-to-br from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600',
    shadowColor: 'hover:shadow-teal-500/30',
    iconBg: 'bg-white/15',
  },
  {
    id: 'find-hospitals',
    icon: Building2,
    title: 'Find Hospitals',
    subtitle: 'Nearby facilities',
    route: 'hospitals',
    gradient: 'bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600',
    shadowColor: 'hover:shadow-emerald-500/30',
    iconBg: 'bg-white/15',
  },
];

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export default function QuickActionButtons() {
  const { setCurrentPage } = useNavigationStore();

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-3 gap-4"
    >
      {ACTIONS.map((action) => (
        <motion.button
          key={action.id}
          variants={fadeUp}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setCurrentPage(action.route)}
          className={cn(
            'group relative overflow-hidden rounded-xl p-5 text-left cursor-pointer',
            'text-white shadow-md transition-shadow duration-300',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            action.gradient,
            action.shadowColor,
            'hover:shadow-lg',
            'border-0',
          )}
        >
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-[0.04]">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full border-2 border-white" />
            <div className="absolute -right-2 -top-2 h-16 w-16 rounded-full border-2 border-white" />
          </div>

          <div className="relative z-10 flex items-start justify-between">
            <div className="space-y-2">
              {/* Icon */}
              <div className={cn('inline-flex p-2.5 rounded-lg', action.iconBg)}>
                <action.icon className="h-5 w-5" />
              </div>

              {/* Text */}
              <div>
                <h3 className="font-semibold text-sm leading-tight">{action.title}</h3>
                <p className="text-xs text-white/70 mt-0.5">{action.subtitle}</p>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-200">
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </motion.button>
      ))}
    </motion.div>
  );
}
