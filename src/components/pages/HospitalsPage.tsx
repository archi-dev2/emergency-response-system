'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Star,
  MapPin,
  Phone,
  BedDouble,
  Activity,
  ArrowUpDown,
  Building2,
  Filter,
  Map,
  List,
  Clock,
  Navigation,
  Zap,
  Eye,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DEMO_HOSPITALS } from '@/lib/mock-data';
import { haversineDistance } from '@/lib/constants';
import type { HospitalWithDistance } from '@/types';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

// Delhi reference point for distance computation
const REFERENCE_LAT = 28.6139;
const REFERENCE_LNG = 77.209;

const HOSPITAL_GRADIENTS: Record<string, string> = {
  'hosp-1': 'from-rose-600 via-rose-500 to-orange-400',
  'hosp-2': 'from-emerald-700 via-emerald-500 to-teal-400',
  'hosp-3': 'from-red-700 via-red-500 to-amber-500',
  'hosp-4': 'from-violet-600 via-purple-500 to-fuchsia-400',
  'hosp-5': 'from-teal-600 via-cyan-500 to-emerald-400',
  'hosp-6': 'from-orange-600 via-amber-500 to-yellow-400',
  'hosp-7': 'from-emerald-600 via-green-500 to-lime-400',
  'hosp-8': 'from-red-600 via-rose-500 to-pink-400',
};

const HOSPITAL_TYPES: Record<string, { type: string; cls: string }> = {
  'hosp-1': { type: 'Private', cls: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' },
  'hosp-2': { type: 'Private', cls: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' },
  'hosp-3': { type: 'Government', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  'hosp-4': { type: 'Private', cls: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' },
  'hosp-5': { type: 'Private', cls: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' },
  'hosp-6': { type: 'Private', cls: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' },
  'hosp-7': { type: 'Government', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  'hosp-8': { type: 'Government', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
};

const REVIEW_COUNTS: Record<string, number> = {
  'hosp-1': 2341,
  'hosp-2': 1856,
  'hosp-3': 4215,
  'hosp-4': 1678,
  'hosp-5': 1243,
  'hosp-6': 1987,
  'hosp-7': 3456,
  'hosp-8': 3890,
};

const WAIT_TIMES: Record<string, string> = {
  'hosp-1': '~12 min',
  'hosp-2': '~18 min',
  'hosp-3': '~8 min',
  'hosp-4': '~15 min',
  'hosp-5': '~20 min',
  'hosp-6': '~10 min',
  'hosp-7': '~7 min',
  'hosp-8': '~9 min',
};

const ALL_SPECIALTIES = Array.from(
  new Set(DEMO_HOSPITALS.flatMap((h) => h.specializations)),
).sort();

function renderStars(rating: number) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < full
              ? 'text-amber-400 fill-amber-400'
              : i === full && hasHalf
                ? 'text-amber-400 fill-amber-200'
                : 'text-gray-300 dark:text-gray-600'
          }`}
        />
      ))}
    </div>
  );
}

export default function HospitalsPage() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'distance' | 'beds'>('distance');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all');

  const hospitalsWithDistance = useMemo<HospitalWithDistance[]>(() => {
    return DEMO_HOSPITALS
      .filter((h) => h.isActive)
      .map((h) => ({
        ...h,
        distanceKm: +haversineDistance(REFERENCE_LAT, REFERENCE_LNG, h.latitude, h.longitude).toFixed(1),
      }));
  }, []);

  const filteredHospitals = useMemo(() => {
    let list = hospitalsWithDistance;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.city.toLowerCase().includes(q) ||
          h.address.toLowerCase().includes(q),
      );
    }

    if (specialtyFilter !== 'all') {
      list = list.filter((h) =>
        h.specializations.some((s) => s.toLowerCase() === specialtyFilter.toLowerCase()),
      );
    }

    switch (sortBy) {
      case 'rating':
        return [...list].sort((a, b) => b.emergencyRating - a.emergencyRating);
      case 'distance':
        return [...list].sort((a, b) => a.distanceKm - b.distanceKm);
      case 'beds':
        return [...list].sort((a, b) => b.availableBeds - a.availableBeds);
      default:
        return list;
    }
  }, [hospitalsWithDistance, search, sortBy, specialtyFilter]);

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-6 p-4 md:p-6"
    >
      {/* Header */}
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Hospitals</h1>
        <p className="text-muted-foreground mt-1">Find nearby hospitals and emergency care</p>
      </motion.div>

      {/* Search & Filter Bar */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search hospitals by name or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
            <SelectTrigger className="w-full sm:w-44">
              <Filter className="h-4 w-4 mr-2 shrink-0" />
              <SelectValue placeholder="Specialty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specialties</SelectItem>
              {ALL_SPECIALTIES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'rating' | 'distance' | 'beds')}>
            <SelectTrigger className="w-full sm:w-44">
              <ArrowUpDown className="h-4 w-4 mr-2 shrink-0" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="distance">Nearest First</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="beds">Most Beds Available</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Results count + Map toggle */}
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredHospitals.length} hospital{filteredHospitals.length !== 1 ? 's' : ''}
        </p>
        <div className="flex items-center gap-1 bg-muted/60 rounded-lg p-0.5">
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            className="h-7 text-xs gap-1.5 px-2.5"
            onClick={() => setViewMode('list')}
          >
            <List className="h-3.5 w-3.5" />
            List
          </Button>
          <Button
            variant={viewMode === 'map' ? 'default' : 'ghost'}
            size="sm"
            className="h-7 text-xs gap-1.5 px-2.5"
            onClick={() => setViewMode('map')}
          >
            <Map className="h-3.5 w-3.5" />
            Map
          </Button>
        </div>
      </motion.div>

      {/* Map Placeholder */}
      <AnimatePresence mode="wait">
        {viewMode === 'map' ? (
          <motion.div
            key="map-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="h-[500px]">
              <CardContent className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                  <Map className="h-10 w-10 text-muted-foreground/40" />
                </div>
                <h3 className="text-lg font-semibold mb-1">Map View</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Interactive map with hospital locations, directions, and real-time availability is coming soon.
                </p>
                <div className="flex gap-2 mt-4">
                  <Badge variant="outline" className="text-xs gap-1">
                    <MapPin className="h-3 w-3" />
                    {filteredHospitals.length} hospitals
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          /* Hospital Grid */
          <motion.div
            key="list-view"
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {filteredHospitals.map((hospital) => {
              const gradient = HOSPITAL_GRADIENTS[hospital.id] || 'from-rose-600 to-orange-400';
              const typeInfo = HOSPITAL_TYPES[hospital.id] || { type: 'Private', cls: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' };
              const reviews = REVIEW_COUNTS[hospital.id] || 1200;
              const waitTime = WAIT_TIMES[hospital.id] || '~15 min';
              const hasBeds = hospital.availableBeds > 0;
              const hasICU = hospital.icuAvailable > 0;
              const isEmergency247 = hospital.icuTotal > 100; // heuristic: large hospitals are 24/7

              return (
                <motion.div key={hospital.id} variants={fadeUp}>
                  <Card className="card-hover h-full flex flex-col overflow-hidden">
                    {/* Hero Gradient Area */}
                    <div className={`relative h-28 bg-gradient-to-br ${gradient} overflow-hidden`}>
                      {/* Overlay pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-4 left-6 w-16 h-16 rounded-full border-2 border-white" />
                        <div className="absolute bottom-2 right-4 w-24 h-24 rounded-full border border-white" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-white" />
                      </div>
                      {/* Emergency badge */}
                      {isEmergency247 && (
                        <Badge className="absolute top-3 right-3 bg-white/20 text-white border-white/30 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider gap-1">
                          <Zap className="h-3 w-3" />
                          24/7 Emergency
                        </Badge>
                      )}
                      {/* Hospital icon */}
                      <div className="absolute bottom-3 left-4 w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-white" />
                      </div>
                    </div>

                    <CardContent className="p-4 flex-1 flex flex-col">
                      {/* Name & Type */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm leading-tight">{hospital.name}</h3>
                          <div className="flex items-center gap-1.5 mt-1">
                            <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                            <span className="text-xs text-muted-foreground truncate">
                              {hospital.city}
                            </span>
                          </div>
                        </div>
                        <Badge className={`${typeInfo.cls} border-0 text-[10px] shrink-0`}>
                          {typeInfo.type}
                        </Badge>
                      </div>

                      {/* Star rating + review count */}
                      <div className="flex items-center gap-2 mb-3">
                        {renderStars(hospital.emergencyRating)}
                        <span className="text-xs font-semibold text-amber-500">{hospital.emergencyRating}</span>
                        <span className="text-xs text-muted-foreground">({reviews.toLocaleString()})</span>
                      </div>

                      {/* Specialization Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {hospital.specializations.slice(0, 4).map((spec) => (
                          <Badge
                            key={spec}
                            variant="secondary"
                            className="text-[10px] px-2 py-0"
                          >
                            {spec}
                          </Badge>
                        ))}
                        {hospital.specializations.length > 4 && (
                          <Badge variant="secondary" className="text-[10px] px-2 py-0">
                            +{hospital.specializations.length - 4} more
                          </Badge>
                        )}
                      </div>

                      {/* Key Metrics Row */}
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="text-center p-2 rounded-lg bg-muted/50">
                          <BedDouble className="h-4 w-4 mx-auto text-emerald-500 mb-0.5" />
                          <p className={`text-sm font-bold ${hasBeds ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                            {hospital.availableBeds}
                          </p>
                          <p className="text-[10px] text-muted-foreground">Beds Free</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-muted/50">
                          <Clock className="h-4 w-4 mx-auto text-amber-500 mb-0.5" />
                          <p className="text-sm font-bold">{waitTime}</p>
                          <p className="text-[10px] text-muted-foreground">Avg Wait</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-muted/50">
                          <Navigation className="h-4 w-4 mx-auto text-primary mb-0.5" />
                          <p className="text-sm font-bold">{hospital.distanceKm}</p>
                          <p className="text-[10px] text-muted-foreground">km Away</p>
                        </div>
                      </div>

                      {/* Emergency Helpline */}
                      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/50 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                          <Phone className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-muted-foreground">Emergency Helpline</p>
                          <p className="text-sm font-semibold tracking-wide">{hospital.phone}</p>
                        </div>
                        <a href={`tel:${hospital.phone}`}>
                          <Button size="sm" className="h-7 text-xs gap-1 bg-red-600 hover:bg-red-700 text-white">
                            <Phone className="h-3 w-3" />
                            Call
                          </Button>
                        </a>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-auto flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 h-8 text-xs gap-1.5">
                          <Navigation className="h-3.5 w-3.5" />
                          Get Directions
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 h-8 text-xs gap-1.5">
                          <Eye className="h-3.5 w-3.5" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {viewMode === 'list' && filteredHospitals.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
            <Building2 className="h-8 w-8 text-muted-foreground/40" />
          </div>
          <p className="text-lg font-medium text-muted-foreground">No hospitals found</p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Try adjusting your search or specialty filter
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => {
              setSearch('');
              setSpecialtyFilter('all');
            }}
          >
            Clear filters
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
