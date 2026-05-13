'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Heart,
  Shield,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  Lock,
  AlertTriangle,
  CreditCard,
  CheckCircle2,
  Contact,
  UserCircle,
  Camera,
  FileDown,
  Activity,
  Building2,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAuthStore } from '@/store';
import { DEMO_PATIENTS } from '@/lib/mock-data';
import { BLOOD_GROUP_LABELS } from '@/lib/constants';
import type { EmergencyContact, InsuranceInfo } from '@/types';
import { toast } from 'sonner';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const BLOOD_OPTIONS = Object.entries(BLOOD_GROUP_LABELS).map(([key, label]) => ({
  value: key,
  label,
}));

// Activity timeline data
const ACTIVITY_TIMELINE = [
  { id: '1', event: 'Profile photo updated', time: '2 days ago', icon: Camera, color: 'text-violet-500', bgColor: 'bg-violet-50 dark:bg-violet-950/40' },
  { id: '2', event: 'Emergency contact added', time: '1 week ago', icon: Contact, color: 'text-emerald-500', bgColor: 'bg-emerald-50 dark:bg-emerald-950/40' },
  { id: '3', event: 'Medical records uploaded', time: '2 weeks ago', icon: FileDown, color: 'text-sky-500', bgColor: 'bg-sky-50 dark:bg-sky-950/40' },
  { id: '4', event: 'Insurance card linked', time: '3 weeks ago', icon: CreditCard, color: 'text-amber-500', bgColor: 'bg-amber-50 dark:bg-amber-950/40' },
  { id: '5', event: 'Account created', time: 'Jan 15, 2024', icon: UserCircle, color: 'text-primary', bgColor: 'bg-primary/10' },
];

// Circular progress ring component
function CompletionRing({ percentage }: { percentage: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colorClass =
    percentage >= 80
      ? 'text-emerald-500'
      : percentage >= 50
        ? 'text-amber-500'
        : 'text-red-500';

  return (
    <div className="relative w-24 h-24">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-muted/50"
        />
        {/* Progress circle */}
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          className={colorClass}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-lg font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {percentage}%
        </motion.span>
        <span className="text-[9px] text-muted-foreground">Complete</span>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, updateProfile } = useAuthStore();
  const patient = DEMO_PATIENTS[0];

  // Profile form state
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: patient.name,
    email: patient.email,
    phone: patient.phone,
    bloodGroup: patient.bloodGroup || 'O_POS',
    dateOfBirth: patient.dateOfBirth || '',
    gender: patient.gender || 'Male',
    address: patient.address || '',
  });

  // Emergency contacts
  const [contacts, setContacts] = useState<EmergencyContact[]>(patient.emergencyContacts);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', relationship: '', phone: '' });

  // Insurance
  const [insurance] = useState<InsuranceInfo>({
    id: 'ins-1',
    userId: patient.id,
    provider: 'Star Health Insurance',
    policyNumber: 'SHI-2024-785432',
    validUntil: '2025-12-31',
    coverageType: 'Comprehensive',
  });

  // Calculate profile completion percentage
  const profileCompletion = useMemo(() => {
    const fields = [
      form.name,
      form.email,
      form.phone,
      form.bloodGroup,
      form.dateOfBirth,
      form.gender,
      form.address,
      contacts.length > 0 ? 'filled' : '',
      insurance.policyNumber ? 'filled' : '',
    ];
    const filled = fields.filter((f) => f && f.trim() !== '').length;
    return Math.round((filled / fields.length) * 100);
  }, [form, contacts.length, insurance.policyNumber]);

  const isInsuranceExpiringSoon = useMemo(() => {
    const validDate = new Date(insurance.validUntil);
    const now = new Date();
    const diffMs = validDate.getTime() - now.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return diffDays < 90;
  }, [insurance.validUntil]);

  const handleSave = () => {
    updateProfile({
      name: form.name,
      phone: form.phone,
      bloodGroup: form.bloodGroup as 'A_POS',
      dateOfBirth: form.dateOfBirth,
      gender: form.gender,
      address: form.address,
    });
    setEditing(false);
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) return;
    const contact: EmergencyContact = {
      id: `ec-${Date.now()}`,
      userId: patient.id,
      ...newContact,
    };
    setContacts([...contacts, contact]);
    setNewContact({ name: '', relationship: '', phone: '' });
    setShowAddContact(false);
  };

  const handleRemoveContact = (id: string) => {
    setContacts(contacts.filter((c) => c.id !== id));
  };

  const handleDownloadHealthSummary = () => {
    toast.success('Health summary PDF generated!');
  };

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-6 p-4 md:p-6 max-w-3xl mx-auto"
    >
      {/* Profile Header + Completion Indicator */}
      <motion.div variants={fadeUp}>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                    {patient.name.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors">
                  <Camera className="h-3 w-3" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold">{patient.name}</h1>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                  <Mail className="h-3.5 w-3.5" />
                  {patient.email}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    <UserCircle className="h-3 w-3 mr-1" />
                    Patient
                  </Badge>
                  {patient.isVerified && (
                    <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
              <div className="text-right hidden sm:flex flex-col items-end gap-1">
                <p className="text-xs text-muted-foreground">Member since</p>
                <p className="text-sm font-medium">
                  {new Date(patient.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Profile Completion + Activity Timeline Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Profile Completion Indicator */}
        <motion.div variants={fadeUp}>
          <Card className="card-hover h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Profile Completion
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex flex-col items-center gap-4">
                <CompletionRing percentage={profileCompletion} />
                <div className="w-full space-y-2">
                  {[
                    { label: 'Name', filled: !!form.name },
                    { label: 'Email', filled: !!form.email },
                    { label: 'Phone', filled: !!form.phone },
                    { label: 'Blood Group', filled: !!form.bloodGroup },
                    { label: 'Date of Birth', filled: !!form.dateOfBirth },
                    { label: 'Gender', filled: !!form.gender },
                    { label: 'Address', filled: !!form.address },
                    { label: 'Emergency Contacts', filled: contacts.length > 0 },
                    { label: 'Insurance', filled: !!insurance.policyNumber },
                  ].map((field) => (
                    <div key={field.label} className="flex items-center gap-2 text-xs">
                      {field.filled ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <div className="h-3.5 w-3.5 rounded-full border border-muted-foreground/30 shrink-0" />
                      )}
                      <span className={field.filled ? 'text-foreground' : 'text-muted-foreground'}>
                        {field.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity Timeline */}
        <motion.div variants={fadeUp}>
          <Card className="card-hover h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />

                <div className="space-y-4">
                  {ACTIVITY_TIMELINE.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.id}
                        className="flex items-start gap-3 relative"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.08 }}
                      >
                        {/* Dot */}
                        <div className={`relative z-10 w-[30px] h-[30px] rounded-full ${item.bgColor} flex items-center justify-center shrink-0`}>
                          <Icon className={`h-3.5 w-3.5 ${item.color}`} />
                        </div>
                        {/* Content */}
                        <div className="flex-1 min-w-0 pt-1">
                          <p className="text-sm font-medium leading-tight">{item.event}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Edit Profile */}
      <motion.div variants={fadeUp}>
        <Card className="card-hover">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </CardTitle>
              {!editing ? (
                <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => setEditing(true)}>
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-xs" onClick={() => setEditing(false)}>
                    <X className="h-3.5 w-3.5 mr-1" />
                    Cancel
                  </Button>
                  <Button size="sm" className="gap-1.5 text-xs" onClick={handleSave}>
                    <Save className="h-3.5 w-3.5" />
                    Save
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Full Name</Label>
                {editing ? (
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                ) : (
                  <p className="text-sm font-medium">{patient.name}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Email</Label>
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-medium">{patient.email}</p>
                  <Badge variant="outline" className="text-[10px]">Read Only</Badge>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Phone</Label>
                {editing ? (
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                ) : (
                  <p className="text-sm font-medium flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    {patient.phone}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Blood Group</Label>
                {editing ? (
                  <Select value={form.bloodGroup} onValueChange={(v) => setForm({ ...form, bloodGroup: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BLOOD_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm font-medium flex items-center gap-1.5">
                    <Heart className="h-3.5 w-3.5 text-red-500" />
                    {BLOOD_GROUP_LABELS[patient.bloodGroup || 'O_POS']}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Date of Birth</Label>
                {editing ? (
                  <Input
                    type="date"
                    value={form.dateOfBirth}
                    onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                  />
                ) : (
                  <p className="text-sm font-medium flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    {patient.dateOfBirth
                      ? new Date(patient.dateOfBirth).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      : 'Not set'}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Gender</Label>
                {editing ? (
                  <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm font-medium">{patient.gender || 'Not set'}</p>
                )}
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs text-muted-foreground">Address</Label>
                {editing ? (
                  <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                ) : (
                  <p className="text-sm font-medium flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    {patient.address || 'Not set'}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Emergency Contacts */}
      <motion.div variants={fadeUp}>
        <Card className="card-hover">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Contact className="h-5 w-5 text-primary" />
                Emergency Contacts
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs"
                onClick={() => setShowAddContact(!showAddContact)}
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3">
            {contacts.map((contact) => (
              <div key={contact.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                    {contact.name.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{contact.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {contact.relationship} &middot; {contact.phone}
                  </p>
                </div>
                <a href={`tel:${contact.phone}`} className="p-2 rounded-lg hover:bg-muted transition-colors">
                  <Phone className="h-4 w-4 text-primary" />
                </a>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => handleRemoveContact(contact.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {/* Add Contact Form */}
            <AnimatePresence>
              {showAddContact && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 p-3 rounded-lg border">
                    <Input
                      placeholder="Contact name"
                      value={newContact.name}
                      onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Relationship"
                        value={newContact.relationship}
                        onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                      />
                      <Input
                        placeholder="Phone number"
                        value={newContact.phone}
                        onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1" onClick={handleAddContact}>
                        Add Contact
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowAddContact(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Insurance Card - Real Insurance Card Look */}
      <motion.div variants={fadeUp}>
        <Card className="card-hover overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Insurance Information
              </CardTitle>
              <Badge
                className={`text-xs ${
                  isInsuranceExpiringSoon
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full mr-1 ${isInsuranceExpiringSoon ? 'bg-red-500' : 'bg-emerald-500'}`} />
                {isInsuranceExpiringSoon ? 'Expiring Soon' : 'Active'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {/* Insurance Card Visual */}
            <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800 p-5 text-white relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4" />
              <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/4" />

              <div className="relative z-10">
                {/* Provider logo + name */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{insurance.provider}</p>
                      <p className="text-[10px] text-white/50 uppercase tracking-wider">Health Insurance</p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-white/10 text-white border-0 text-[10px]"
                  >
                    {insurance.coverageType}
                  </Badge>
                </div>

                {/* Policy details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-white/40 uppercase tracking-wider">Policy Number</p>
                    <p className="font-mono text-sm font-bold tracking-wider">{insurance.policyNumber}</p>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-white/40 uppercase tracking-wider">Valid Until</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">
                        {new Date(insurance.validUntil).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isInsuranceExpiringSoon ? 'bg-red-400 animate-pulse' : 'bg-emerald-400'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Card decoration */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-md bg-amber-400/20 border border-amber-400/30"
                      />
                    ))}
                  </div>
                  <p className="text-[9px] text-white/30">LifeLink Health Card</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Account Actions */}
      <motion.div variants={fadeUp}>
        <Card className="card-hover">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Account
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3">
            <Button variant="outline" className="w-full gap-2 justify-start">
              <Lock className="h-4 w-4" />
              Change Password
            </Button>

            <Button
              variant="outline"
              className="w-full gap-2 justify-start"
              onClick={handleDownloadHealthSummary}
            >
              <FileDown className="h-4 w-4" />
              Download Health Summary
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full gap-2 justify-start">
                  <AlertTriangle className="h-4 w-4" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove all of your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90">
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
