'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Siren,
  MapPin,
  Clock,
  User,
  ArrowRight,
  Search,
  Activity,
  CheckCircle2,
  Timer,
  ChevronDown,
  ChevronUp,
  Truck,
  Building2,
  AlertTriangle,
  Eye,
  UserPlus,
  Inbox,
  Filter,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DEMO_EMERGENCIES,
  DEMO_AMBULANCES,
  DEMO_HOSPITALS,
  DEMO_PATIENTS,
  SEVERITY_LABELS,
} from '@/lib/mock-data';
import { STATUS_COLORS, getRelativeTime } from '@/lib/constants';

// ── Animation Variants ──────────────────────────────────────────
const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

// ── Status Dot Colors ───────────────────────────────────────────
const STATUS_DOT_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-500',
  AMBULANCE_ASSIGNED: 'bg-sky-500',
  EN_ROUTE: 'bg-orange-500',
  ARRIVED: 'bg-emerald-500',
  ADMITTED: 'bg-violet-500',
  COMPLETED: 'bg-gray-400',
  CANCELLED: 'bg-red-500',
};

// ── Severity Bar Colors ─────────────────────────────────────────
const SEVERITY_BAR_COLORS: Record<number, string> = {
  1: 'bg-emerald-500',
  2: 'bg-yellow-500',
  3: 'bg-orange-500',
  4: 'bg-red-500',
  5: 'bg-red-700',
};

// ── Status Filter Options ───────────────────────────────────────
const STATUS_FILTERS = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Assigned', value: 'AMBULANCE_ASSIGNED' },
  { label: 'En Route', value: 'EN_ROUTE' },
  { label: 'Arrived', value: 'ARRIVED' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
] as const;

// ── Severity Filter Options ─────────────────────────────────────
const SEVERITY_FILTERS = [
  { label: 'All Severities', value: 0 },
  { label: 'LOW', value: 1 },
  { label: 'MODERATE', value: 2 },
  { label: 'SERIOUS', value: 3 },
  { label: 'CRITICAL', value: 4 },
  { label: 'EXTREME', value: 5 },
] as const;

// ── Animated Counter Hook ───────────────────────────────────────
function useAnimatedCounter(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);
  useEffect(() => {
    let cancelled = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const startTime = performance.now();
    const step = (now: number) => {
      if (cancelled) return;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);
  return count;
}

// ── Stat Card ───────────────────────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  colorClass,
  iconBgClass,
  delay = 0,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  suffix?: string;
  colorClass: string;
  iconBgClass: string;
  delay?: number;
}) {
  const numericValue = typeof value === 'number' ? value : 0;
  const animatedValue = useAnimatedCounter(numericValue);
  const displayValue = typeof value === 'number' ? animatedValue : value;

  return (
    <motion.div variants={fadeUp} custom={delay}>
      <Card className="card-hover relative overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${iconBgClass} shadow-sm`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
              <p className={`text-2xl font-bold ${colorClass}`}>
                {displayValue}{suffix && <span className="text-base font-medium ml-0.5">{suffix}</span>}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── Format Timestamp ────────────────────────────────────────────
function formatEventTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

// ════════════════════════════════════════════════════════════════
// Main Component
// ════════════════════════════════════════════════════════════════
export default function AdminEmergenciesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<number>(0);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  // ── Computed Stats ─────────────────────────────────────────
  const stats = useMemo(() => {
    const total = DEMO_EMERGENCIES.length;
    const active = DEMO_EMERGENCIES.filter(
      (e) => e.status !== 'COMPLETED' && e.status !== 'CANCELLED'
    ).length;
    const resolved = DEMO_EMERGENCIES.filter(
      (e) => e.status === 'COMPLETED'
    ).length;

    // Calculate avg response time from timeline: time between SOS and Ambulance Assigned
    let totalResponseMin = 0;
    let responseCount = 0;
    DEMO_EMERGENCIES.forEach((em) => {
      const sos = em.timeline.find((t) => t.event === 'SOS Triggered');
      const assigned = em.timeline.find((t) => t.event === 'Ambulance Assigned');
      if (sos && assigned) {
        const diffMs =
          new Date(assigned.timestamp).getTime() - new Date(sos.timestamp).getTime();
        totalResponseMin += diffMs / 60000;
        responseCount++;
      }
    });
    const avgResponse = responseCount > 0 ? (totalResponseMin / responseCount) : 0;

    return { total, active, resolved, avgResponse: Math.round(avgResponse * 10) / 10 };
  }, []);

  // ── Filtered Emergencies ───────────────────────────────────
  const filteredEmergencies = useMemo(() => {
    return DEMO_EMERGENCIES.filter((em) => {
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const patient = DEMO_PATIENTS.find((p) => p.id === em.patientId);
        const patientName = patient?.name.toLowerCase() ?? '';
        const matchesSearch =
          em.id.toLowerCase().includes(q) ||
          (em.description?.toLowerCase().includes(q) ?? false) ||
          patientName.includes(q);
        if (!matchesSearch) return false;
      }
      // Status filter
      if (statusFilter !== 'ALL' && em.status !== statusFilter) return false;
      // Severity filter
      if (severityFilter !== 0 && em.severity !== severityFilter) return false;
      return true;
    });
  }, [searchQuery, statusFilter, severityFilter]);

  // ── Toggle Card Expand ─────────────────────────────────────
  const toggleExpand = (id: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      {/* ── Page Header ─────────────────────────────────────── */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2.5 rounded-xl bg-red-500/10 shadow-sm">
            <Siren className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Emergency Requests
            </h1>
            <p className="text-muted-foreground text-sm">
              Track and manage all emergency requests in real-time
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Stats Summary Row ───────────────────────────────── */}
      <motion.div variants={fadeUp}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <StatCard
            icon={Siren}
            label="Total Emergencies"
            value={stats.total}
            colorClass="text-red-500"
            iconBgClass="bg-red-500/10 text-red-500"
          />
          <StatCard
            icon={Activity}
            label="Active"
            value={stats.active}
            colorClass="text-orange-500"
            iconBgClass="bg-orange-500/10 text-orange-500"
          />
          <StatCard
            icon={CheckCircle2}
            label="Resolved"
            value={stats.resolved}
            colorClass="text-emerald-500"
            iconBgClass="bg-emerald-500/10 text-emerald-500"
          />
          <StatCard
            icon={Timer}
            label="Avg Response"
            value={stats.avgResponse}
            suffix="min"
            colorClass="text-amber-500"
            iconBgClass="bg-amber-500/10 text-amber-500"
          />
        </div>
      </motion.div>

      {/* ── Search & Filter Bar ─────────────────────────────── */}
      <motion.div variants={fadeUp}>
        <Card>
          <CardContent className="p-4 space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID, description, or patient name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 bg-muted/50 border-0 focus-visible:ring-1"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              {/* Status Filter Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <Filter className="w-3.5 h-3.5 text-muted-foreground mr-1 hidden sm:block" />
                {STATUS_FILTERS.map((sf) => (
                  <button
                    key={sf.value}
                    onClick={() => setStatusFilter(sf.value)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                      statusFilter === sf.value
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                    }`}
                  >
                    {sf.label}
                  </button>
                ))}
              </div>

              {/* Severity Filter Dropdown */}
              <div className="sm:ml-auto">
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(Number(e.target.value))}
                  className="text-xs bg-muted border-0 rounded-lg px-3 py-1.5 text-foreground focus:ring-1 focus:ring-primary outline-none cursor-pointer"
                >
                  {SEVERITY_FILTERS.map((sv) => (
                    <option key={sv.value} value={sv.value}>
                      {sv.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Emergency Cards List ────────────────────────────── */}
      <motion.div variants={stagger} className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredEmergencies.map((em) => {
            const ambulance = em.ambulanceId
              ? DEMO_AMBULANCES.find((a) => a.id === em.ambulanceId)
              : null;
            const hospital = em.hospitalId
              ? DEMO_HOSPITALS.find((h) => h.id === em.hospitalId)
              : null;
            const patient = DEMO_PATIENTS.find((p) => p.id === em.patientId);
            const severityInfo = SEVERITY_LABELS[em.severity];
            const isExpanded = expandedCards.has(em.id);
            const barColor = SEVERITY_BAR_COLORS[em.severity] || 'bg-gray-400';
            const dotColor = STATUS_DOT_COLORS[em.status] || 'bg-gray-400';

            return (
              <motion.div
                key={em.id}
                variants={cardVariants}
                layout
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              >
                <Card className="card-shine overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex">
                      {/* Left Severity Bar */}
                      <div className={`w-1.5 min-h-full shrink-0 ${barColor}`} />

                      <div className="flex-1 p-4 space-y-3">
                        {/* Row 1: ID + Status + Severity */}
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2.5">
                            <Siren className="w-4 h-4 text-orange-500 shrink-0" />
                            <span className="font-mono text-sm font-semibold">
                              {em.id}
                            </span>
                            <Badge className={`text-[10px] px-1.5 py-0 ${severityInfo?.bgColor || ''} ${severityInfo?.color || ''}`}>
                              {severityInfo?.label || 'UNKNOWN'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${dotColor} ${em.status === 'EN_ROUTE' || em.status === 'AMBULANCE_ASSIGNED' ? 'animate-pulse' : ''}`} />
                              <Badge className={`text-xs ${STATUS_COLORS[em.status] || ''}`}>
                                {em.status.replace(/_/g, ' ')}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Row 2: Patient + Description */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                              <User className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                            </div>
                            <span className="text-sm font-medium">
                              {patient?.name || 'Unknown Patient'}
                            </span>
                            {patient?.bloodGroup && (
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-mono">
                                {patient.bloodGroup.replace('_', '+')}
                              </Badge>
                            )}
                          </div>
                          {em.description && (
                            <p className="text-sm text-muted-foreground ml-8">
                              {em.description}
                            </p>
                          )}
                        </div>

                        {/* Row 3: Ambulance + Hospital Info */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                          {ambulance && (
                            <div className="flex items-center gap-1.5 bg-sky-50 dark:bg-sky-900/20 rounded-md px-2 py-1">
                              <Truck className="w-3.5 h-3.5 text-sky-500" />
                              <span className="font-mono font-medium text-sky-700 dark:text-sky-400">
                                {ambulance.vehicleNumber}
                              </span>
                              <span className="text-sky-600 dark:text-sky-300">
                                &middot; {ambulance.driverName}
                              </span>
                            </div>
                          )}
                          {hospital && (
                            <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-md px-2 py-1">
                              <Building2 className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="font-medium text-emerald-700 dark:text-emerald-400">
                                {hospital.name}
                              </span>
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-medium border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400">
                                {hospital.availableBeds} beds
                              </Badge>
                            </div>
                          )}
                        </div>

                        {/* Row 4: Time + Location */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {getRelativeTime(em.createdAt)}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {em.patientLatitude.toFixed(4)}, {em.patientLongitude.toFixed(4)}
                          </div>
                        </div>

                        {/* Row 5: Timeline Toggle + Actions */}
                        <div className="flex items-center justify-between pt-1">
                          <button
                            onClick={() => toggleExpand(em.id)}
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                            Timeline ({em.timeline.length})
                          </button>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                              <Eye className="w-3 h-3" />
                              View Details
                            </Button>
                            {!ambulance && em.status !== 'COMPLETED' && em.status !== 'CANCELLED' && (
                              <Button size="sm" className="h-7 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white">
                                <UserPlus className="w-3 h-3" />
                                Assign Ambulance
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Expandable Timeline */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: 'easeInOut' }}
                              className="overflow-hidden"
                            >
                              <div className="border-t pt-3 mt-1 space-y-0">
                                {em.timeline.map((evt, idx) => {
                                  const isLast = idx === em.timeline.length - 1;
                                  return (
                                    <div key={evt.id} className="flex gap-3">
                                      {/* Timeline Line + Dot */}
                                      <div className="flex flex-col items-center">
                                        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                                          idx === 0 ? 'bg-red-500' : isLast ? 'bg-emerald-500' : 'bg-muted-foreground/40'
                                        }`} />
                                        {!isLast && (
                                          <div className="w-px flex-1 bg-border min-h-[20px]" />
                                        )}
                                      </div>
                                      {/* Event Content */}
                                      <div className={`pb-3 ${isLast ? '' : ''}`}>
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <span className="text-xs font-medium">{evt.event}</span>
                                          <span className="text-[10px] text-muted-foreground">
                                            {formatEventTime(evt.timestamp)}
                                          </span>
                                        </div>
                                        {evt.description && (
                                          <p className="text-xs text-muted-foreground mt-0.5">
                                            {evt.description}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* ── Empty State ───────────────────────────────────── */}
        {filteredEmergencies.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <Card className="border-dashed">
              <CardContent className="py-16 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                  <Inbox className="w-7 h-7 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-sm">No emergencies found</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {searchQuery || statusFilter !== 'ALL' || severityFilter !== 0
                      ? 'Try adjusting your search or filters'
                      : 'There are no emergency requests at the moment'}
                  </p>
                </div>
                {(searchQuery || statusFilter !== 'ALL' || severityFilter !== 0) && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs mt-2"
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('ALL');
                      setSeverityFilter(0);
                    }}
                  >
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Clear All Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>

      {/* ── Footer Count ────────────────────────────────────── */}
      {filteredEmergencies.length > 0 && (
        <motion.div variants={fadeUp} className="text-center">
          <p className="text-xs text-muted-foreground">
            Showing {filteredEmergencies.length} of {DEMO_EMERGENCIES.length} emergencies
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
