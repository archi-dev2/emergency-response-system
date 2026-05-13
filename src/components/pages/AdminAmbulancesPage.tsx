'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, MapPin, Phone, ChevronDown, ChevronUp, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DEMO_AMBULANCES } from '@/lib/mock-data';
import { AMBULANCE_STATUS_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

type StatusFilter = 'ALL' | 'AVAILABLE' | 'EN_ROUTE' | 'BUSY' | 'OFFLINE';

const STATUS_FILTERS: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Available', value: 'AVAILABLE' },
  { label: 'En Route', value: 'EN_ROUTE' },
  { label: 'Busy', value: 'BUSY' },
  { label: 'Offline', value: 'OFFLINE' },
];

const PIE_COLORS: Record<string, string> = {
  AVAILABLE: '#22c55e',
  BUSY: '#ef4444',
  EN_ROUTE: '#3b82f6',
  RETURNING: '#f97316',
  OFFLINE: '#9ca3af',
};

const avatarColors = ['bg-emerald-600', 'bg-amber-600', 'bg-violet-600', 'bg-rose-600', 'bg-teal-600', 'bg-orange-600'];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

// Recharts tooltip requires `any` for payload shape
function CustomPieTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-card border rounded-lg shadow-lg p-2.5 text-xs">
        <p className="font-semibold">{data.name.replace(/_/g, ' ')}</p>
        <p className="text-muted-foreground">{data.value} ambulance{data.value !== 1 ? 's' : ''}</p>
      </div>
    );
  }
  return null;
}

export default function AdminAmbulancesPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    DEMO_AMBULANCES.forEach((a) => {
      counts[a.status] = (counts[a.status] || 0) + 1;
    });
    return counts;
  }, []);

  const pieData = useMemo(() => {
    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count,
    }));
  }, [statusCounts]);

  const filteredAmbulances = useMemo(() => {
    if (statusFilter === 'ALL') return DEMO_AMBULANCES;
    return DEMO_AMBULANCES.filter((a) => a.status === statusFilter);
  }, [statusFilter]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp}>
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-lg bg-primary/10">
            <Truck className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Ambulance Fleet</h1>
            <p className="text-muted-foreground text-sm">Monitor and manage all ambulances</p>
          </div>
        </div>
      </motion.div>

      {/* Top section: Status Distribution Chart + Filter Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        {/* Status Distribution Mini-Chart */}
        <motion.div variants={fadeUp}>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Status Distribution</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {pieData.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={PIE_COLORS[entry.name] || '#888'}
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Legend */}
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
                {pieData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                    <div
                      className="size-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: PIE_COLORS[entry.name] }}
                    />
                    <span className="text-muted-foreground">
                      {entry.name.replace(/_/g, ' ')} ({entry.value})
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Status Filter Tabs + Ambulance Grid */}
        <motion.div variants={stagger} className="space-y-4">
          {/* Status Filter Tabs */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map(({ label, value }) => {
              const count = value === 'ALL'
                ? DEMO_AMBULANCES.length
                : (statusCounts[value] || 0);
              return (
                <button
                  key={value}
                  onClick={() => setStatusFilter(value)}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
                    statusFilter === value
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  {label}
                  <span className={cn(
                    'inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] font-bold px-1',
                    statusFilter === value
                      ? 'bg-primary-foreground/20'
                      : 'bg-background/50',
                  )}>
                    {count}
                  </span>
                </button>
              );
            })}
          </motion.div>

          {/* Ambulance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredAmbulances.map((amb) => {
              const isExpanded = expandedId === amb.id;
              const isAvailable = amb.status === 'AVAILABLE';

              return (
                <motion.div key={amb.id} variants={fadeUp} layout>
                  <Card className={cn(
                    'card-hover transition-all duration-200',
                    isExpanded && 'ring-1 ring-primary/20',
                  )}>
                    <CardContent className="p-4">
                      {/* Top row */}
                      <div
                        className="flex items-center gap-3 mb-3 cursor-pointer"
                        onClick={() => toggleExpand(amb.id)}
                      >
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className={cn(
                              'text-white text-sm font-bold',
                              getAvatarColor(amb.driverName),
                            )}>
                              {amb.driverName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {/* Status indicator dot */}
                          <div className={cn(
                            'absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-background',
                            isAvailable ? 'bg-emerald-500' :
                            amb.status === 'BUSY' ? 'bg-red-500' :
                            amb.status === 'EN_ROUTE' ? 'bg-blue-500' :
                            amb.status === 'RETURNING' ? 'bg-orange-500' :
                            'bg-gray-400',
                          )}>
                            {isAvailable && (
                              <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-40" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold">{amb.driverName}</h3>
                          <p className="text-xs text-muted-foreground font-mono">{amb.vehicleNumber}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={cn('text-xs', AMBULANCE_STATUS_COLORS[amb.status] || '')}>
                            {amb.status.replace(/_/g, ' ')}
                          </Badge>
                          {isExpanded ? (
                            <ChevronUp className="size-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="size-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>

                      {/* Basic info */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3" />
                          <span>{amb.driverPhone}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3" />
                          <span className="font-mono">{amb.currentLatitude.toFixed(3)}, {amb.currentLongitude.toFixed(3)}</span>
                        </div>
                      </div>

                      {/* Expanded driver info */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-3 pt-3 border-t space-y-3">
                              {/* Driver details card */}
                              <div className="p-3 rounded-lg bg-muted/50">
                                <div className="flex items-center gap-2 mb-2">
                                  <User className="size-3.5 text-muted-foreground" />
                                  <span className="text-xs font-semibold">Driver Information</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div>
                                    <span className="text-muted-foreground block">Name</span>
                                    <span className="font-medium">{amb.driverName}</span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground block">Phone</span>
                                    <span className="font-medium">{amb.driverPhone}</span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground block">Vehicle</span>
                                    <span className="font-medium font-mono">{amb.vehicleNumber}</span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground block">Status</span>
                                    <Badge className={cn('text-[10px]', AMBULANCE_STATUS_COLORS[amb.status] || '')}>
                                      {amb.status.replace(/_/g, ' ')}
                                    </Badge>
                                  </div>
                                </div>
                              </div>

                              {/* Location details */}
                              <div className="p-3 rounded-lg bg-muted/50">
                                <div className="flex items-center gap-2 mb-2">
                                  <MapPin className="size-3.5 text-muted-foreground" />
                                  <span className="text-xs font-semibold">Current Location</span>
                                </div>
                                <div className="text-xs space-y-1">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Latitude</span>
                                    <span className="font-mono">{amb.currentLatitude.toFixed(6)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Longitude</span>
                                    <span className="font-mono">{amb.currentLongitude.toFixed(6)}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Action buttons */}
                              <div className="flex gap-2">
                                <button className="flex-1 text-xs font-medium py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                                  Track Live
                                </button>
                                <button className="flex-1 text-xs font-medium py-2 rounded-lg border hover:bg-muted transition-colors">
                                  Send Message
                                </button>
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

            {filteredAmbulances.length === 0 && (
              <div className="col-span-2 flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Truck className="size-10 mb-3 opacity-30" />
                <p className="text-sm font-medium">No ambulances found</p>
                <p className="text-xs mt-1">No ambulances match the selected filter</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
