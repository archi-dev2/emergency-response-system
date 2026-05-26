'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Siren,
  Truck,
  Building2,
  Settings,
  CircleDot,
  ChevronDown,
  Eye,
  X,
  AlertTriangle,
  Inbox,
  MailOpen,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useUIStore } from '@/store';
import { getRelativeTime } from '@/lib/constants';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

type NotificationType = 'EMERGENCY' | 'AMBULANCE' | 'HOSPITAL' | 'SYSTEM';
type FilterTab = 'ALL' | 'UNREAD' | 'EMERGENCY' | 'AMBULANCE' | 'HOSPITAL' | 'SYSTEM';

const TYPE_CONFIG: Record<string, { icon: typeof Bell; color: string; bgColor: string; label: string; borderColor: string }> = {
  EMERGENCY: {
    icon: Siren,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-950/40',
    label: 'Emergency',
    borderColor: 'border-l-red-500',
  },
  AMBULANCE: {
    icon: Truck,
    color: 'text-sky-600 dark:text-sky-400',
    bgColor: 'bg-sky-50 dark:bg-sky-950/40',
    label: 'Ambulance',
    borderColor: 'border-l-sky-500',
  },
  HOSPITAL: {
    icon: Building2,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
    label: 'Hospital',
    borderColor: 'border-l-emerald-500',
  },
  SYSTEM: {
    icon: Settings,
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-50 dark:bg-gray-950/40',
    label: 'System',
    borderColor: 'border-l-gray-500',
  },
};

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'UNREAD', label: 'Unread' },
  { key: 'EMERGENCY', label: 'Emergency' },
  { key: 'AMBULANCE', label: 'Ambulance' },
  { key: 'HOSPITAL', label: 'Hospital' },
  { key: 'SYSTEM', label: 'System' },
];

// Expanded notification set for "Load More"
const EXTRA_NOTIFICATIONS = [
  { id: '6', title: 'Emergency Resolved', message: 'Emergency ER-A3F2K1 has been resolved and closed successfully. Patient was discharged in stable condition.', type: 'EMERGENCY' as const, isRead: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: '7', title: 'New Ambulance Added', message: 'A new ambulance (GJ-01-EM-4456) has been added to the fleet in Ahmedabad region.', type: 'AMBULANCE' as const, isRead: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: '8', title: 'Hospital Maintenance', message: 'Apollo Hospitals Chennai will undergo scheduled maintenance on the emergency wing this weekend.', type: 'HOSPITAL' as const, isRead: true, createdAt: new Date(Date.now() - 259200000).toISOString() },
  { id: '9', title: 'Profile Updated', message: 'Your medical profile has been updated with new allergy information. Please verify the changes.', type: 'SYSTEM' as const, isRead: true, createdAt: new Date(Date.now() - 345600000).toISOString() },
  { id: '10', title: 'Blood Bank Alert', message: 'Blood bank at Fortis Memorial has critical shortage of O- blood type. Please consider donating if eligible.', type: 'EMERGENCY' as const, isRead: true, createdAt: new Date(Date.now() - 432000000).toISOString() },
  { id: '11', title: 'Ambulance ETA Updated', message: 'Your assigned ambulance ETA has been updated. Expected arrival in 8 minutes.', type: 'AMBULANCE' as const, isRead: true, createdAt: new Date(Date.now() - 518400000).toISOString() },
  { id: '12', title: 'Appointment Reminder', message: 'Reminder: You have a follow-up appointment at AIIMS New Delhi tomorrow at 10:00 AM.', type: 'HOSPITAL' as const, isRead: true, createdAt: new Date(Date.now() - 604800000).toISOString() },
  { id: '13', title: 'System Update', message: 'LifeLink has been updated to version 2.5 with new features including real-time ambulance tracking.', type: 'SYSTEM' as const, isRead: true, createdAt: new Date(Date.now() - 691200000).toISOString() },
];

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useUIStore();
  const [activeFilter, setActiveFilter] = useState<FilterTab>('ALL');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [showBatch, setShowBatch] = useState(1);

  const allNotifications = useMemo(() => {
    const extras = showBatch >= 2 ? EXTRA_NOTIFICATIONS : [];
    return [...notifications, ...extras].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [notifications, showBatch]);

  const filteredNotifications = useMemo(() => {
    return allNotifications.filter((n) => {
      if (activeFilter === 'ALL') return true;
      if (activeFilter === 'UNREAD') return !n.isRead;
      return n.type === activeFilter;
    });
  }, [allNotifications, activeFilter]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { EMERGENCY: 0, AMBULANCE: 0, HOSPITAL: 0, SYSTEM: 0 };
    allNotifications.forEach((n) => {
      if (n.type in counts) counts[n.type]++;
    });
    return counts;
  }, [allNotifications]);

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        markAsRead(id);
      }
      return next;
    });
  };

  const isUnreadFilter = activeFilter === 'UNREAD';
  const hasNoNotifications = filteredNotifications.length === 0;

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-5 p-4 md:p-6 max-w-3xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
            Notifications
            {unreadCount > 0 && (
              <Badge className="bg-primary text-primary-foreground text-xs px-2 py-0.5">
                {unreadCount} unread
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground mt-1">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
              : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" className="gap-1.5" onClick={markAllAsRead}>
            <CheckCheck className="h-4 w-4" />
            Mark All Read
          </Button>
        )}
      </motion.div>

      {/* Filter Tabs */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeFilter === tab.key
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {tab.label}
              {tab.key !== 'ALL' && tab.key !== 'UNREAD' && (
                <span
                  className={`text-[10px] px-1.5 rounded-full ${
                    activeFilter === tab.key
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {categoryCounts[tab.key] || 0}
                </span>
              )}
              {tab.key === 'UNREAD' && unreadCount > 0 && (
                <span
                  className={`text-[10px] px-1.5 rounded-full ${
                    activeFilter === tab.key
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Category Summary */}
      <motion.div variants={fadeUp}>
        <div className="grid grid-cols-4 gap-2">
          {(['EMERGENCY', 'AMBULANCE', 'HOSPITAL', 'SYSTEM'] as const).map((type) => {
            const config = TYPE_CONFIG[type];
            const Icon = config.icon;
            const count = categoryCounts[type] || 0;
            return (
              <div
                key={type}
                className={`flex items-center gap-2 p-2.5 rounded-lg border transition-colors cursor-pointer hover:bg-muted/30 ${
                  activeFilter === type ? `${config.bgColor} border-current/10` : 'border-transparent'
                }`}
                onClick={() => setActiveFilter(type)}
              >
                <div className={`p-1.5 rounded-md ${config.bgColor}`}>
                  <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate">{config.label}</p>
                  <p className="text-[10px] text-muted-foreground">{count} total</p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Separator />
      </motion.div>

      {/* Notification List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          variants={stagger}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0 }}
          className="space-y-2"
        >
          {filteredNotifications.map((n, index) => {
            const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.SYSTEM;
            const Icon = config.icon;
            const isExpanded = expandedIds.has(n.id);

            return (
              <motion.div
                key={n.id}
                variants={fadeUp}
                layout
              >
                <Card
                  className={`card-hover cursor-pointer transition-all border-l-4 ${config.borderColor} ${
                    !n.isRead ? 'bg-accent/20' : ''
                  }`}
                  onClick={() => toggleExpanded(n.id)}
                >
                  <CardContent className="p-4">
                    {/* Collapsed View */}
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-lg shrink-0 ${config.bgColor}`}>
                        <Icon className={`h-5 w-5 ${config.color}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            {!n.isRead && (
                              <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                            )}
                            <h3
                              className={`text-sm truncate ${
                                !n.isRead ? 'font-bold' : 'font-medium text-muted-foreground'
                              }`}
                            >
                              {n.title}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs text-muted-foreground/70 hidden sm:block">
                              {getRelativeTime(n.createdAt)}
                            </span>
                            <motion.div
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            </motion.div>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
                          {n.message}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 sm:hidden">
                          <span className="text-xs text-muted-foreground/70">
                            {getRelativeTime(n.createdAt)}
                          </span>
                        </div>
                      </div>

                      {n.isRead && (
                        <Check className="h-4 w-4 text-muted-foreground/30 shrink-0 mt-1" />
                      )}
                    </div>

                    {/* Expanded View */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 pt-3 border-t space-y-3">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {n.message}
                            </p>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                <Eye className="h-3.5 w-3.5" />
                                View Details
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1.5 text-xs text-muted-foreground"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(n.id);
                                }}
                              >
                                <X className="h-3.5 w-3.5" />
                                Dismiss
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Load More */}
      {activeFilter === 'ALL' && showBatch < 2 && filteredNotifications.length > 0 && (
        <motion.div variants={fadeUp} className="flex justify-center">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setShowBatch(2)}
          >
            Load More
          </Button>
        </motion.div>
      )}

      {/* Empty States */}
      <AnimatePresence mode="wait">
        {hasNoNotifications && (
          <motion.div
            key={isUnreadFilter ? 'empty-unread' : 'empty-all'}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="text-center py-16"
          >
            {isUnreadFilter ? (
              /* No Unread State */
              <>
                <div className="mx-auto w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mb-4">
                  <MailOpen className="h-10 w-10 text-emerald-500" />
                </div>
                <h3 className="text-lg font-semibold">No unread notifications</h3>
                <p className="text-muted-foreground text-sm mt-1 max-w-xs mx-auto">
                  You&apos;re all caught up! All notifications have been read.
                </p>
              </>
            ) : (
              /* No Notifications State */
              <>
                <div className="mx-auto w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4 relative">
                  <BellOff className="h-10 w-10 text-muted-foreground" />
                  <div className="absolute -top-1 -right-1">
                    <Inbox className="h-5 w-5 text-muted-foreground/40" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold">No notifications</h3>
                <p className="text-muted-foreground text-sm mt-1 max-w-xs mx-auto">
                  {activeFilter !== 'ALL'
                    ? `No ${TYPE_CONFIG[activeFilter]?.label?.toLowerCase() || ''} notifications found. Try changing the filter.`
                    : "You don't have any notifications yet. We'll notify you of any updates."}
                </p>
                {activeFilter !== 'ALL' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => setActiveFilter('ALL')}
                  >
                    Show All Notifications
                  </Button>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
