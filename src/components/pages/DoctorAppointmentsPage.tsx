'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Star,
  MapPin,
  Clock,
  Calendar,
  ChevronDown,
  X,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// ─── Animation variants ───────────────────────────────────────────────────────
const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } } };

// ─── Data ─────────────────────────────────────────────────────────────────────
const specialties = [
  'All Specialties', 'Cardiology', 'Neurology', 'Orthopedics',
  'Pediatrics', 'General Physician', 'Dermatology',
];

const avatarColors = [
  'bg-blue-600', 'bg-violet-600', 'bg-emerald-600',
  'bg-rose-600', 'bg-amber-600', 'bg-pink-600',
];

const doctors = [
  {
    id: 1,
    name: 'Dr. Priya Sharma',
    specialty: 'Cardiologist',
    hospital: 'Apollo Hospitals, Delhi',
    experience: 14,
    rating: 4.9,
    reviews: 318,
    fee: 1200,
    slot: 'Today 4:30 PM',
    initials: 'PS',
    color: avatarColors[0],
  },
  {
    id: 2,
    name: 'Dr. Arjun Mehta',
    specialty: 'Neurologist',
    hospital: 'AIIMS, Delhi',
    experience: 18,
    rating: 4.8,
    reviews: 274,
    fee: 1500,
    slot: 'Tomorrow 10:00 AM',
    initials: 'AM',
    color: avatarColors[1],
  },
  {
    id: 3,
    name: 'Dr. Sunita Rao',
    specialty: 'Orthopedic Surgeon',
    hospital: 'Fortis Hospital, Gurugram',
    experience: 12,
    rating: 4.7,
    reviews: 196,
    fee: 900,
    slot: 'Today 6:00 PM',
    initials: 'SR',
    color: avatarColors[2],
  },
  {
    id: 4,
    name: 'Dr. Kavya Nair',
    specialty: 'Pediatrician',
    hospital: 'Max Super Speciality, Saket',
    experience: 9,
    rating: 4.9,
    reviews: 412,
    fee: 800,
    slot: 'Tomorrow 2:00 PM',
    initials: 'KN',
    color: avatarColors[3],
  },
  {
    id: 5,
    name: 'Dr. Rajan Patel',
    specialty: 'General Physician',
    hospital: 'Columbia Asia Hospital',
    experience: 20,
    rating: 4.6,
    reviews: 531,
    fee: 600,
    slot: 'Today 5:15 PM',
    initials: 'RP',
    color: avatarColors[4],
  },
  {
    id: 6,
    name: 'Dr. Meera Iyer',
    specialty: 'Dermatologist',
    hospital: 'Skin & You Clinic, Bengaluru',
    experience: 11,
    rating: 4.8,
    reviews: 287,
    fee: 1100,
    slot: 'Tomorrow 11:30 AM',
    initials: 'MI',
    color: avatarColors[5],
  },
];

const upcomingAppointments = [
  {
    id: 'apt-1',
    date: 'Thu, 29 May 2026',
    time: '4:30 PM',
    doctor: 'Dr. Priya Sharma',
    specialty: 'Cardiologist',
    hospital: 'Apollo Hospitals, Delhi',
    status: 'Confirmed',
  },
  {
    id: 'apt-2',
    date: 'Fri, 30 May 2026',
    time: '10:00 AM',
    doctor: 'Dr. Arjun Mehta',
    specialty: 'Neurologist',
    hospital: 'AIIMS, Delhi',
    status: 'Pending',
  },
];

const pastAppointments = [
  { date: '15 May 2026', doctor: 'Dr. Rajan Patel', specialty: 'General Physician', diagnosis: 'Viral fever — rest & fluids', followUp: '30 May 2026' },
  { date: '02 May 2026', doctor: 'Dr. Priya Sharma', specialty: 'Cardiologist', diagnosis: 'Palpitations — ECG normal', followUp: 'None' },
  { date: '18 Apr 2026', doctor: 'Dr. Kavya Nair', specialty: 'Pediatrician', diagnosis: 'Routine child health check', followUp: 'Jun 2026' },
  { date: '04 Apr 2026', doctor: 'Dr. Sunita Rao', specialty: 'Orthopedics', diagnosis: 'Knee strain — physiotherapy', followUp: '20 Apr 2026' },
  { date: '21 Mar 2026', doctor: 'Dr. Meera Iyer', specialty: 'Dermatologist', diagnosis: 'Eczema — topical steroid Rx', followUp: 'May 2026' },
];

export default function DoctorAppointmentsPage() {
  const [specialty, setSpecialty] = useState('All Specialties');
  const [city, setCity] = useState('');
  const [date, setDate] = useState('');
  const [bookedIds, setBookedIds] = useState<Set<number>>(new Set());

  const handleBook = (id: number) => {
    setBookedIds((prev) => new Set(prev).add(id));
  };

  const handleUnbook = (id: number) => {
    setBookedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6 p-4 md:p-6">

      {/* ── Header ── */}
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold tracking-tight">Book Appointment</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Schedule consultations with top specialists</p>
      </motion.div>

      {/* ── Search / Filter ── */}
      <motion.div variants={fadeUp}>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Specialty */}
              <div className="relative flex-1">
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full appearance-none bg-background border rounded-xl px-3 py-2.5 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {specialties.map((s) => <option key={s}>{s}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>

              {/* City */}
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-background border rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Date */}
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-background border rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <Button className="gap-2 sm:w-auto w-full">
                <Search className="w-4 h-4" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Featured Specialists ── */}
      <motion.div variants={fadeUp}>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Featured Specialists</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((doc) => {
            const isBooked = bookedIds.has(doc.id);
            return (
              <motion.div key={doc.id} whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 flex flex-col gap-3 flex-1">
                    {/* Avatar + name */}
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-2xl ${doc.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                        {doc.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{doc.name}</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{doc.specialty}</p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          {doc.hospital}
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-muted/50 rounded-xl p-2">
                        <p className="text-xs font-bold">{doc.experience} yrs</p>
                        <p className="text-[10px] text-muted-foreground">Exp.</p>
                      </div>
                      <div className="bg-muted/50 rounded-xl p-2">
                        <p className="text-xs font-bold flex items-center justify-center gap-0.5">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          {doc.rating}
                        </p>
                        <p className="text-[10px] text-muted-foreground">{doc.reviews} reviews</p>
                      </div>
                      <div className="bg-muted/50 rounded-xl p-2">
                        <p className="text-xs font-bold">₹{doc.fee.toLocaleString()}</p>
                        <p className="text-[10px] text-muted-foreground">Consult</p>
                      </div>
                    </div>

                    {/* Slot */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-emerald-500/8 rounded-lg px-3 py-2 border border-emerald-500/20">
                      <Clock className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Next: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{doc.slot}</span></span>
                    </div>

                    {/* Book button */}
                    <div className="mt-auto">
                      {isBooked ? (
                        <div className="flex items-center gap-2">
                          <Badge className="flex-1 justify-center py-1.5 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs">
                            Booked!
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                            onClick={() => handleUnbook(doc.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button className="w-full gap-2" size="sm" onClick={() => handleBook(doc.id)}>
                          <Calendar className="w-3.5 h-3.5" />
                          Book Now
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Upcoming Appointments ── */}
      <motion.div variants={fadeUp}>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">My Upcoming Appointments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingAppointments.map((apt) => (
            <Card key={apt.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold">{apt.doctor}</p>
                    <p className="text-xs text-muted-foreground">{apt.specialty} · {apt.hospital}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={apt.status === 'Confirmed'
                      ? 'text-emerald-600 border-emerald-500/40 bg-emerald-500/10 text-xs'
                      : 'text-amber-600 border-amber-500/40 bg-amber-500/10 text-xs'}
                  >
                    {apt.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{apt.date}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{apt.time}</span>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button variant="outline" size="sm" className="flex-1 text-xs gap-1.5">
                    <X className="w-3 h-3" />Cancel
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-xs gap-1.5">
                    <RefreshCw className="w-3 h-3" />Reschedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* ── Past Appointments ── */}
      <motion.div variants={fadeUp}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Past Appointments</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    {['Date', 'Doctor', 'Specialty', 'Diagnosis', 'Follow-up'].map((h) => (
                      <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pastAppointments.map((row, i) => (
                    <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{row.date}</td>
                      <td className="px-4 py-3 font-medium">{row.doctor}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{row.specialty}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs max-w-[200px] truncate">{row.diagnosis}</td>
                      <td className="px-4 py-3 text-xs">
                        {row.followUp === 'None' ? (
                          <span className="text-muted-foreground">None</span>
                        ) : (
                          <Badge variant="outline" className="text-[10px]">{row.followUp}</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

    </motion.div>
  );
}
