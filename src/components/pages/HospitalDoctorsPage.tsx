'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Stethoscope,
  Phone,
  Clock,
  Filter,
  UserCheck,
  Scissors,
  PhoneCall,
  UserX,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// ── Animation variants ──────────────────────────────────────────────────────
const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

// ── Types ───────────────────────────────────────────────────────────────────
type DoctorStatus = 'On Duty' | 'Off Duty' | 'In Surgery';
type FilterTab = 'All' | 'On Duty' | 'Off Duty' | 'Emergency' | 'Surgery';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  status: DoctorStatus;
  department: string;
  experience: number;
  ext: string;
  shift: string;
  avatarColor: string;
}

// ── Static data ─────────────────────────────────────────────────────────────
const DOCTORS: Doctor[] = [
  { id: 1,  name: 'Dr. Priya Sharma',    specialty: 'Cardiology',         status: 'On Duty',   department: 'Cardio ICU',     experience: 14, ext: '2301', shift: '08:00–20:00',    avatarColor: 'bg-rose-500' },
  { id: 2,  name: 'Dr. Arjun Mehta',     specialty: 'Emergency Medicine',  status: 'On Duty',   department: 'Emergency',      experience: 9,  ext: '2112', shift: '06:00–18:00',    avatarColor: 'bg-orange-500' },
  { id: 3,  name: 'Dr. Sunita Rao',      specialty: 'Neurology',           status: 'In Surgery',department: 'Neurology Ward', experience: 18, ext: '2445', shift: '08:00–20:00',    avatarColor: 'bg-violet-500' },
  { id: 4,  name: 'Dr. Vikram Singh',    specialty: 'Orthopedics',         status: 'Off Duty',  department: 'Ortho Ward',     experience: 12, ext: '2330', shift: 'Tomorrow 08:00', avatarColor: 'bg-sky-500' },
  { id: 5,  name: 'Dr. Kavya Nair',      specialty: 'Pediatrics',          status: 'On Duty',   department: 'PICU',           experience: 7,  ext: '2520', shift: '08:00–20:00',    avatarColor: 'bg-pink-500' },
  { id: 6,  name: 'Dr. Rajan Patel',     specialty: 'General Surgery',     status: 'In Surgery',department: 'OT Complex',     experience: 22, ext: '2100', shift: '07:00–19:00',    avatarColor: 'bg-indigo-500' },
  { id: 7,  name: 'Dr. Meera Iyer',      specialty: 'Radiology',           status: 'On Duty',   department: 'Radiology',      experience: 11, ext: '2680', shift: '09:00–21:00',    avatarColor: 'bg-teal-500' },
  { id: 8,  name: 'Dr. Ankit Sharma',    specialty: 'Anesthesiology',      status: 'In Surgery',department: 'OT Support',     experience: 8,  ext: '2190', shift: '07:00–19:00',    avatarColor: 'bg-amber-500' },
  { id: 9,  name: 'Dr. Deepa Krishnan',  specialty: 'Gynecology',          status: 'Off Duty',  department: 'Gynae Ward',     experience: 16, ext: '2410', shift: 'Tomorrow 06:00', avatarColor: 'bg-fuchsia-500' },
  { id: 10, name: 'Dr. Suresh Kumar',    specialty: 'Internal Medicine',   status: 'On Duty',   department: 'General Ward A', experience: 20, ext: '2201', shift: '08:00–20:00',    avatarColor: 'bg-emerald-500' },
  { id: 11, name: 'Dr. Pooja Agarwal',   specialty: 'Dermatology',         status: 'Off Duty',  department: 'OPD Block',      experience: 6,  ext: '2750', shift: 'Tomorrow 09:00', avatarColor: 'bg-lime-500' },
  { id: 12, name: 'Dr. Rahul Gupta',     specialty: 'Urology',             status: 'On Duty',   department: 'Urology',        experience: 13, ext: '2360', shift: '10:00–22:00',    avatarColor: 'bg-cyan-500' },
  { id: 13, name: 'Dr. Nisha Verma',     specialty: 'Psychiatry',          status: 'Off Duty',  department: 'Psych Ward',     experience: 9,  ext: '2830', shift: 'Tomorrow 09:00', avatarColor: 'bg-purple-500' },
  { id: 14, name: 'Dr. Aditya Chopra',   specialty: 'Gastroenterology',    status: 'On Duty',   department: 'GI Unit',        experience: 15, ext: '2470', shift: '08:00–20:00',    avatarColor: 'bg-red-500' },
  { id: 15, name: 'Dr. Sneha Pillai',    specialty: 'Oncology',            status: 'Off Duty',  department: 'Cancer Centre',  experience: 11, ext: '2910', shift: 'Tomorrow 08:00', avatarColor: 'bg-yellow-500' },
  { id: 16, name: 'Dr. Manish Tiwari',   specialty: 'Nephrology',          status: 'On Duty',   department: 'Dialysis Unit',  experience: 17, ext: '2540', shift: '09:00–21:00',    avatarColor: 'bg-blue-500' },
];

const FILTER_TABS: FilterTab[] = ['All', 'On Duty', 'Off Duty', 'Emergency', 'Surgery'];

const STATS = [
  { label: 'On Duty Now', value: 12, icon: UserCheck, color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400', border: 'border-l-emerald-500' },
  { label: 'In Surgery',  value: 3,  icon: Scissors,  color: 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400',  border: 'border-l-orange-500'  },
  { label: 'On Call',     value: 8,  icon: PhoneCall, color: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400',              border: 'border-l-sky-500'     },
  { label: 'Off Duty',    value: 24, icon: UserX,     color: 'bg-slate-50 text-slate-600 dark:bg-slate-900/40 dark:text-slate-400',      border: 'border-l-slate-400'   },
];

function getInitials(name: string) {
  return name
    .replace('Dr. ', '')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function StatusBadge({ status }: { status: DoctorStatus }) {
  if (status === 'On Duty') {
    return (
      <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 text-[10px]">
        On Duty
      </Badge>
    );
  }
  if (status === 'In Surgery') {
    return (
      <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-0 text-[10px]">
        In Surgery
      </Badge>
    );
  }
  return (
    <Badge className="bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-400 border-0 text-[10px]">
      Off Duty
    </Badge>
  );
}

export default function HospitalDoctorsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');

  const filtered = DOCTORS.filter((doc) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'On Duty') return doc.status === 'On Duty';
    if (activeFilter === 'Off Duty') return doc.status === 'Off Duty';
    if (activeFilter === 'Emergency') return doc.department === 'Emergency';
    if (activeFilter === 'Surgery') return doc.status === 'In Surgery';
    return true;
  });

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Stethoscope className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Doctor Directory</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              47 doctors on staff · 12 currently on duty
            </p>
          </div>
        </div>
      </motion.div>

      {/* Filter tabs */}
      <motion.div variants={fadeUp} className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
        {FILTER_TABS.map((tab) => (
          <Button
            key={tab}
            variant={activeFilter === tab ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter(tab)}
            className="text-xs h-8"
          >
            {tab}
          </Button>
        ))}
      </motion.div>

      {/* Stats row */}
      <motion.div variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            whileHover={{ scale: 1.04, rotateX: -3, rotateY: 3 }}
            style={{ perspective: 800, transformStyle: 'preserve-3d' }}
          >
            <Card className={`shadow-sm hover:shadow-lg transition-shadow border-l-4 ${stat.border}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Doctor list */}
      <motion.div variants={fadeUp}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              Doctors ({filtered.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <motion.div
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
            >
              {filtered.map((doc) => (
                <motion.div
                  key={doc.id}
                  variants={fadeUp}
                  className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/40 transition-colors"
                >
                  {/* Avatar */}
                  <div
                    className={`w-11 h-11 rounded-full ${doc.avatarColor} flex items-center justify-center text-white text-sm font-bold shrink-0`}
                  >
                    {getInitials(doc.name)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <h3 className="text-sm font-semibold truncate">{doc.name}</h3>
                      <StatusBadge status={doc.status} />
                    </div>
                    <p className="text-xs text-primary font-medium">{doc.specialty}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{doc.department}</p>

                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Stethoscope className="h-3 w-3" />
                        {doc.experience} yrs
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        Ext {doc.ext}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {doc.shift}
                      </span>
                    </div>
                  </div>

                  {/* Contact button */}
                  <Button variant="outline" size="sm" className="h-8 text-xs shrink-0 gap-1.5">
                    <Phone className="h-3 w-3" />
                    Contact
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
