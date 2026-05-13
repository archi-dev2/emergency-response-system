'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  BedDouble,
  UserPlus,
  Activity,
  Eye,
  LogOut,
  UserCog,
  Clock,
  Droplets,
  Stethoscope,
  AlertTriangle,
  Users,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SEVERITY_LABELS } from '@/lib/mock-data';
import { getRelativeTime } from '@/lib/constants';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

type PatientStatus = 'WAITING' | 'IN_TREATMENT' | 'DISCHARGED';

interface PatientRecord {
  id: string;
  patientName: string;
  fullName: string;
  age: number;
  bloodGroup: string;
  emergencyId: string;
  severity: number;
  condition: string;
  bedNumber: string | null;
  doctor: string;
  status: PatientStatus;
  arrivalTime: string;
}

const PATIENT_STATUS_LABELS: Record<PatientStatus, string> = {
  WAITING: 'Waiting',
  IN_TREATMENT: 'In Treatment',
  DISCHARGED: 'Discharged',
};

const SEVERITY_RING: Record<string, string> = {
  '5': 'ring-red-500',
  '4': 'ring-red-400',
  '3': 'ring-amber-400',
  '2': 'ring-amber-400',
  '1': 'ring-emerald-400',
};

const SEVERITY_BORDER: Record<string, string> = {
  '5': 'border-l-red-500',
  '4': 'border-l-red-400',
  '3': 'border-l-amber-400',
  '2': 'border-l-amber-300',
  '1': 'border-l-emerald-400',
};

const SEVERITY_TAG: Record<string, { label: string; cls: string }> = {
  '5': { label: 'Critical', cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  '4': { label: 'Critical', cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  '3': { label: 'Serious', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  '2': { label: 'Serious', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  '1': { label: 'Stable', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
};

const BLOOD_GROUP_COLORS: Record<string, string> = {
  'A+': 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  'A-': 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  'B+': 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  'B-': 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  'AB+': 'bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  'AB-': 'bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  'O+': 'bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  'O-': 'bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
};

const FILTER_TABS = [
  { key: 'ALL', label: 'All', icon: Users },
  { key: 'CRITICAL', label: 'Critical', icon: AlertTriangle },
  { key: 'SERIOUS', label: 'Serious', icon: Activity },
  { key: 'STABLE', label: 'Stable', icon: Stethoscope },
  { key: 'ICU', label: 'ICU', icon: BedDouble },
];

const MOCK_PATIENT_RECORDS: PatientRecord[] = [
  { id: 'pr-1', patientName: 'A. M.', fullName: 'Arjun Mehta', age: 32, bloodGroup: 'B+', emergencyId: 'ER-A3F2K1', severity: 4, condition: 'Chest pain & breathing difficulty', bedNumber: '0105', doctor: 'Dr. Ananya Gupta', status: 'IN_TREATMENT', arrivalTime: '2024-12-15T14:52:00Z' },
  { id: 'pr-2', patientName: 'S. R.', fullName: 'Sneha Reddy', age: 36, bloodGroup: 'O-', emergencyId: 'ER-B7G4M2', severity: 3, condition: 'Severe allergic reaction', bedNumber: '0203', doctor: 'Dr. Ramesh Iyer', status: 'IN_TREATMENT', arrivalTime: '2024-12-15T15:25:00Z' },
  { id: 'pr-3', patientName: 'R. K.', fullName: 'Rajesh Kumar', age: 45, bloodGroup: 'A+', emergencyId: 'ER-C1H8N5', severity: 5, condition: 'Road traffic accident - spinal injury', bedNumber: 'ICU-01', doctor: 'Dr. Sunita Rao', status: 'IN_TREATMENT', arrivalTime: '2024-12-15T13:55:00Z' },
  { id: 'pr-4', patientName: 'V. S.', fullName: 'Vikram Singh', age: 54, bloodGroup: 'AB+', emergencyId: 'ER-D2J9P3', severity: 1, condition: 'Mild fever - recovering', bedNumber: '0307', doctor: 'Dr. Kavitha', status: 'DISCHARGED', arrivalTime: '2024-12-15T10:30:00Z' },
  { id: 'pr-5', patientName: 'M. P.', fullName: 'Meera Patel', age: 28, bloodGroup: 'B-', emergencyId: 'ER-E5L3Q8', severity: 3, condition: 'Acute appendicitis', bedNumber: null, doctor: 'Pending', status: 'WAITING', arrivalTime: '2024-12-15T16:10:00Z' },
  { id: 'pr-6', patientName: 'P. J.', fullName: 'Priya Joshi', age: 67, bloodGroup: 'O+', emergencyId: 'ER-F9N7R1', severity: 1, condition: 'Routine checkup follow-up', bedNumber: '0402', doctor: 'Dr. Ramesh Iyer', status: 'IN_TREATMENT', arrivalTime: '2024-12-15T11:45:00Z' },
  { id: 'pr-7', patientName: 'K. D.', fullName: 'Karthik Desai', age: 41, bloodGroup: 'A-', emergencyId: 'ER-G2M6S4', severity: 2, condition: 'Fractured wrist - cast applied', bedNumber: '0211', doctor: 'Dr. Ananya Gupta', status: 'DISCHARGED', arrivalTime: '2024-12-15T09:20:00Z' },
  { id: 'pr-8', patientName: 'N. T.', fullName: 'Neha Thakur', age: 29, bloodGroup: 'AB-', emergencyId: 'ER-H4P1T7', severity: 4, condition: 'Severe asthma attack', bedNumber: null, doctor: 'Pending', status: 'WAITING', arrivalTime: '2024-12-15T16:30:00Z' },
  { id: 'pr-9', patientName: 'D. S.', fullName: 'Deepak Sharma', age: 58, bloodGroup: 'B+', emergencyId: 'ER-J8K5U0', severity: 1, condition: 'Post-surgery recovery', bedNumber: '0304', doctor: 'Dr. Sunita Rao', status: 'DISCHARGED', arrivalTime: '2024-12-15T08:00:00Z' },
  { id: 'pr-10', patientName: 'A. B.', fullName: 'Ananya Bose', age: 33, bloodGroup: 'O+', emergencyId: 'ER-K6L2V3', severity: 5, condition: 'Intracranial hemorrhage', bedNumber: 'ICU-03', doctor: 'Dr. Kavitha', status: 'IN_TREATMENT', arrivalTime: '2024-12-15T14:00:00Z' },
];

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function HospitalPatientsPage() {
  const [search, setSearch] = useState('');
  const [filterTab, setFilterTab] = useState('ALL');

  const filtered = useMemo(() => {
    let list = MOCK_PATIENT_RECORDS;

    // Apply tab filter
    switch (filterTab) {
      case 'CRITICAL':
        list = list.filter((p) => p.severity >= 4);
        break;
      case 'SERIOUS':
        list = list.filter((p) => p.severity === 2 || p.severity === 3);
        break;
      case 'STABLE':
        list = list.filter((p) => p.severity === 1);
        break;
      case 'ICU':
        list = list.filter((p) => p.bedNumber?.startsWith('ICU'));
        break;
    }

    // Apply search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.fullName.toLowerCase().includes(q) ||
          p.patientName.toLowerCase().includes(q) ||
          p.condition.toLowerCase().includes(q) ||
          p.emergencyId.toLowerCase().includes(q) ||
          p.doctor.toLowerCase().includes(q),
      );
    }
    return list;
  }, [search, filterTab]);

  // Stats
  const totalPatients = MOCK_PATIENT_RECORDS.length;
  const inICU = MOCK_PATIENT_RECORDS.filter((p) => p.bedNumber?.startsWith('ICU')).length;
  const admittedToday = MOCK_PATIENT_RECORDS.filter(
    (p) => p.status === 'IN_TREATMENT' || p.status === 'WAITING',
  ).length;

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Patient Intake</h1>
        <p className="text-muted-foreground mt-1">Track all patient admissions and discharges</p>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="card-hover border-l-4 border-l-primary">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalPatients}</p>
              <p className="text-xs text-muted-foreground">Total Patients</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover border-l-4 border-l-red-500">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-red-500/10">
              <BedDouble className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{inICU}</p>
              <p className="text-xs text-muted-foreground">In ICU</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover border-l-4 border-l-emerald-500">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10">
              <UserPlus className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{admittedToday}</p>
              <p className="text-xs text-muted-foreground">Admitted Today</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search Bar */}
      <motion.div variants={fadeUp}>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient name or condition..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => {
          const Icon = tab.icon;
          const count =
            tab.key === 'ALL'
              ? totalPatients
              : tab.key === 'CRITICAL'
                ? MOCK_PATIENT_RECORDS.filter((p) => p.severity >= 4).length
                : tab.key === 'SERIOUS'
                  ? MOCK_PATIENT_RECORDS.filter((p) => p.severity === 2 || p.severity === 3).length
                  : tab.key === 'STABLE'
                    ? MOCK_PATIENT_RECORDS.filter((p) => p.severity === 1).length
                    : MOCK_PATIENT_RECORDS.filter((p) => p.bedNumber?.startsWith('ICU')).length;
          return (
            <Button
              key={tab.key}
              variant={filterTab === tab.key ? 'default' : 'outline'}
              size="sm"
              className="h-9 text-xs gap-1.5"
              onClick={() => setFilterTab(tab.key)}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
              <span className="ml-0.5 opacity-70">({count})</span>
            </Button>
          );
        })}
      </motion.div>

      {/* Patient Cards Grid */}
      <AnimatePresence mode="wait">
        {filtered.length > 0 ? (
          <motion.div
            key={filterTab + search}
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {filtered.map((patient) => {
              const sevTag = SEVERITY_TAG[patient.severity] || SEVERITY_TAG['1'];
              const ringCls = SEVERITY_RING[patient.severity] || SEVERITY_RING['1'];
              const borderCls = SEVERITY_BORDER[patient.severity] || SEVERITY_BORDER['1'];
              const sevObj = SEVERITY_LABELS[patient.severity] || SEVERITY_LABELS[1];
              const bloodCls = BLOOD_GROUP_COLORS[patient.bloodGroup] || BLOOD_GROUP_COLORS['O+'];

              return (
                <motion.div key={patient.id} variants={fadeUp}>
                  <Card className={`card-hover h-full border-l-4 ${borderCls} overflow-hidden`}>
                    <CardContent className="p-4 flex flex-col gap-3">
                      {/* Top row: Avatar + Name + Severity */}
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-11 h-11 rounded-full ring-2 ${ringCls} ring-offset-2 ring-offset-background flex items-center justify-center bg-muted text-sm font-bold shrink-0`}
                        >
                          {getInitials(patient.fullName)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="font-semibold text-sm truncate">{patient.fullName}</h3>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${bloodCls}`}>
                              {patient.bloodGroup}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {patient.age} yrs &middot; {patient.emergencyId}
                          </p>
                        </div>
                        <Badge className={`${sevTag.cls} border-0 text-[10px] shrink-0`}>
                          {sevTag.label}
                        </Badge>
                      </div>

                      {/* Condition */}
                      <p className="text-sm text-muted-foreground leading-relaxed">{patient.condition}</p>

                      {/* Info grid */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <UserCog className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{patient.doctor}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <BedDouble className="h-3.5 w-3.5 shrink-0" />
                          <span>{patient.bedNumber || 'Not assigned'}</span>
                        </div>
                      </div>

                      {/* Admission time */}
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Admitted {getRelativeTime(patient.arrivalTime)}</span>
                        <span className="ml-auto">
                          <Badge variant="outline" className="text-[10px] font-normal">
                            {PATIENT_STATUS_LABELS[patient.status]}
                          </Badge>
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2 pt-1">
                        <Button variant="outline" size="sm" className="flex-1 h-8 text-xs gap-1.5">
                          <Eye className="h-3.5 w-3.5" />
                          View Records
                        </Button>
                        {patient.status !== 'DISCHARGED' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs gap-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
                          >
                            <LogOut className="h-3.5 w-3.5" />
                            Discharge
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <p className="text-lg font-medium text-muted-foreground">No patients found</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Try adjusting your search or filter criteria
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setSearch('');
                setFilterTab('ALL');
              }}
            >
              Clear filters
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
