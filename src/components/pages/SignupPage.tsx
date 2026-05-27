'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Mail,
  Lock,
  User,
  Phone,
  Droplets,
  Calendar,
  MapPin,
  Users,
  ShieldCheck,
  Check,
  X,
  CircleCheckBig,
  PartyPopper,
  Truck,
  Building2,
  Shield,
  Stethoscope,
  FileText,
  BadgeCheck,
  Car,
  KeyRound,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuthStore, useNavigationStore } from '@/store';
import { BLOOD_GROUP_LABELS } from '@/lib/constants';
import { cn } from '@/lib/utils';

type Role = 'PATIENT' | 'DRIVER' | 'HOSPITAL_STAFF' | 'ADMIN';

interface RoleConfig {
  id: Role;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  bgGradient: string;
  borderColor: string;
  features: string[];
}

const ROLE_CONFIGS: RoleConfig[] = [
  {
    id: 'PATIENT',
    label: 'Patient',
    description: 'Access emergency services, track ambulances, manage your health profile',
    icon: Heart,
    gradient: 'from-emerald-500 to-teal-600',
    bgGradient: 'from-emerald-500/10 to-teal-600/10',
    borderColor: 'border-emerald-500/40',
    features: ['SOS Emergency Button', 'Real-time Ambulance Tracking', 'Medical Records', 'AI Health Assistant'],
  },
  {
    id: 'DRIVER',
    label: 'Ambulance Driver',
    description: 'Manage emergency assignments, track your vehicle, update your availability',
    icon: Truck,
    gradient: 'from-amber-500 to-orange-600',
    bgGradient: 'from-amber-500/10 to-orange-600/10',
    borderColor: 'border-amber-500/40',
    features: ['Emergency Assignments', 'Live Navigation', 'Earnings Dashboard', 'Vehicle Management'],
  },
  {
    id: 'HOSPITAL_STAFF',
    label: 'Hospital Staff',
    description: 'Manage emergency queue, patient intake, and hospital resources',
    icon: Building2,
    gradient: 'from-sky-500 to-blue-600',
    bgGradient: 'from-sky-500/10 to-blue-600/10',
    borderColor: 'border-sky-500/40',
    features: ['Emergency Queue', 'Patient Intake', 'Bed Management', 'Resource Tracking'],
  },
  {
    id: 'ADMIN',
    label: 'Administrator',
    description: 'Full access to LifeLink management console and system oversight',
    icon: Shield,
    gradient: 'from-violet-500 to-purple-600',
    bgGradient: 'from-violet-500/10 to-purple-600/10',
    borderColor: 'border-violet-500/40',
    features: ['System Management', 'User Administration', 'Analytics & Reports', 'Full Console Access'],
  },
];

const ROLE_STEPS: Record<Role, { label: string; description: string }[]> = {
  PATIENT: [
    { label: 'Account', description: 'Create your personal account credentials' },
    { label: 'Medical Profile', description: 'Add your basic medical information' },
    { label: 'Medical History', description: 'List allergies, medications & conditions' },
    { label: 'Emergency Contact', description: 'Who should we contact in emergencies?' },
  ],
  DRIVER: [
    { label: 'Account', description: 'Create your driver account credentials' },
    { label: 'Driver Details', description: 'License, experience & vehicle information' },
    { label: 'Confirm', description: 'Review and submit your driver profile' },
  ],
  HOSPITAL_STAFF: [
    { label: 'Account', description: 'Create your hospital staff credentials' },
    { label: 'Hospital & Role', description: 'Select your hospital and department' },
    { label: 'Confirm', description: 'Review and submit your staff profile' },
  ],
  ADMIN: [
    { label: 'Account', description: 'Create your admin account credentials' },
    { label: 'Verification', description: 'Enter your admin invitation code' },
  ],
};

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  // Patient
  bloodGroup: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  allergies: string[];
  currentMedications: string[];
  chronicConditions: string[];
  emergencyName: string;
  emergencyRelationship: string;
  emergencyPhone: string;
  // Driver
  licenseNumber: string;
  experience: string;
  vehicleNumber: string;
  // Hospital Staff
  hospitalId: string;
  department: string;
  employeeId: string;
  // Admin
  adminCode: string;
}

const INITIAL_FORM: FormData = {
  name: '', email: '', phone: '', password: '', confirmPassword: '',
  bloodGroup: '', dateOfBirth: '', gender: '', address: '',
  allergies: [], currentMedications: [], chronicConditions: [],
  emergencyName: '', emergencyRelationship: '', emergencyPhone: '',
  licenseNumber: '', experience: '', vehicleNumber: '',
  hospitalId: '', department: '', employeeId: '',
  adminCode: '',
};

function validateAccountStep(data: FormData): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.name.trim()) errors.name = 'Full name is required';
  else if (data.name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
  if (!data.email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Please enter a valid email';
  if (!data.phone.trim()) errors.phone = 'Phone number is required';
  else if (!/^[+]?[\d\s-]{10,15}$/.test(data.phone.replace(/\s/g, '')))
    errors.phone = 'Please enter a valid phone number';
  if (!data.password) errors.password = 'Password is required';
  else if (data.password.length < 8) errors.password = 'Password must be at least 8 characters';
  if (!data.confirmPassword) errors.confirmPassword = 'Please confirm your password';
  else if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords do not match';
  return errors;
}

function validateRoleStep(role: Role, step: number, data: FormData): Record<string, string> {
  const errors: Record<string, string> = {};
  if (role === 'PATIENT' && step === 2) {
    if (!data.bloodGroup) errors.bloodGroup = 'Please select your blood group';
    if (!data.dateOfBirth) errors.dateOfBirth = 'Please enter your date of birth';
    if (!data.gender) errors.gender = 'Please select your gender';
  }
  if (role === 'DRIVER' && step === 2) {
    if (!data.licenseNumber.trim()) errors.licenseNumber = 'License number is required';
    if (!data.experience) errors.experience = 'Years of experience is required';
    if (!data.vehicleNumber.trim()) errors.vehicleNumber = 'Vehicle number is required';
  }
  if (role === 'HOSPITAL_STAFF' && step === 2) {
    if (!data.hospitalId) errors.hospitalId = 'Please select your hospital';
    if (!data.department.trim()) errors.department = 'Department is required';
  }
  if (role === 'ADMIN' && step === 2) {
    if (!data.adminCode.trim()) errors.adminCode = 'Admin invite code is required';
  }
  return errors;
}

function getPasswordStrength(password: string) {
  if (!password) return { score: 0, label: '', color: '', bgColor: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500', bgColor: 'bg-red-500/10 text-red-600 dark:text-red-400' };
  if (score <= 2) return { score, label: 'Fair', color: 'bg-orange-500', bgColor: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' };
  if (score <= 3) return { score, label: 'Good', color: 'bg-amber-500', bgColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' };
  return { score, label: 'Strong', color: 'bg-emerald-500', bgColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' };
}

function ValidationIndicator({ status }: { status: 'valid' | 'invalid' | 'empty' }) {
  if (status === 'empty') return <div className="size-4" />;
  return (
    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="size-4 flex items-center justify-center shrink-0">
      {status === 'valid'
        ? <CircleCheckBig className="size-4 text-emerald-500" />
        : <X className="size-4 text-destructive" />}
    </motion.div>
  );
}

function TagInput({
  label,
  placeholder,
  tags,
  onChange,
}: {
  label: string;
  placeholder: string;
  tags: string[];
  onChange: (tags: string[]) => void;
}) {
  const [input, setInput] = useState('');

  const addTag = () => {
    const val = input.trim();
    if (val && !tags.includes(val)) onChange([...tags, val]);
    setInput('');
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="min-h-[44px] flex flex-wrap gap-1.5 p-2 rounded-md border border-input bg-transparent focus-within:ring-2 focus-within:ring-ring/30 focus-within:border-ring transition-shadow">
        {tags.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            {tag}
            <button type="button" onClick={() => onChange(tags.filter((t) => t !== tag))} className="hover:text-destructive transition-colors">
              <X className="size-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); }
          }}
          placeholder={tags.length === 0 ? placeholder : 'Add more...'}
          className="flex-1 min-w-[100px] bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      <p className="text-[11px] text-muted-foreground">Press Enter or comma to add each item</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function SignupPage() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hospitals, setHospitals] = useState<{ id: string; name: string; city: string }[]>([]);

  useEffect(() => {
    if (selectedRole === 'HOSPITAL_STAFF') {
      fetch('/api/hospitals')
        .then((r) => r.json())
        .then((d) => setHospitals(d.hospitals ?? []))
        .catch(() => {});
    }
  }, [selectedRole]);

  const updateField = useCallback(<K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => { const next = { ...prev }; delete next[field as string]; return next; });
  }, []);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setStep(1);
    setFormData(INITIAL_FORM);
    setErrors({});
  };

  const totalSteps = selectedRole ? ROLE_STEPS[selectedRole].length : 0;

  const validate = (s: number) => {
    if (!selectedRole) return {};
    if (s === 1) return validateAccountStep(formData);
    return validateRoleStep(selectedRole, s, formData);
  };

  const handleNext = () => {
    const stepErrors = validate(step);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      toast.error('Please fix the errors before continuing');
      return;
    }
    setErrors({});
    setDirection(1);
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setErrors({});
    setDirection(-1);
    if (step === 1) setSelectedRole(null);
    else setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    const stepErrors = validate(step);
    if (Object.keys(stepErrors).length > 0) { setErrors(stepErrors); return; }
    setIsSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: selectedRole,
      };
      if (selectedRole === 'PATIENT') {
        Object.assign(body, {
          bloodGroup: formData.bloodGroup || null,
          dateOfBirth: formData.dateOfBirth || null,
          gender: formData.gender || null,
          address: formData.address || null,
          allergies: formData.allergies,
          currentMedications: formData.currentMedications,
          chronicConditions: formData.chronicConditions,
          emergencyContact: formData.emergencyName ? {
            name: formData.emergencyName,
            relationship: formData.emergencyRelationship,
            phone: formData.emergencyPhone,
          } : null,
        });
      } else if (selectedRole === 'DRIVER') {
        Object.assign(body, {
          licenseNumber: formData.licenseNumber,
          experience: formData.experience,
          vehicleNumber: formData.vehicleNumber,
        });
      } else if (selectedRole === 'HOSPITAL_STAFF') {
        Object.assign(body, {
          hospitalId: formData.hospitalId,
          department: formData.department,
          employeeId: formData.employeeId,
        });
      } else if (selectedRole === 'ADMIN') {
        Object.assign(body, { adminCode: formData.adminCode });
      }

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const user = await res.json();
        setShowSuccess(true);
        await new Promise((r) => setTimeout(r, 2200));
        useAuthStore.getState().loginWithUser(user);
        useNavigationStore.getState().setCurrentPage('dashboard');
        toast.success('Account created! Welcome to LifeLink.');
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error ?? 'Signup failed. Please try again.');
      }
    } catch {
      toast.error('Network error. Please check your connection.');
    }
    setIsSubmitting(false);
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 280 : -280, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -280 : 280, opacity: 0 }),
  };

  const err = (field: string) =>
    errors[field] ? <p className="text-xs text-destructive mt-1">{errors[field]}</p> : null;

  const passwordStrength = useMemo(() => getPasswordStrength(formData.password), [formData.password]);

  const fv = useMemo(() => ({
    email: formData.email
      ? (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? 'valid' : 'invalid')
      : 'empty',
    phone: formData.phone
      ? (/^[+]?[\d\s-]{10,15}$/.test(formData.phone.replace(/\s/g, '')) ? 'valid' : 'invalid')
      : 'empty',
    password: formData.password
      ? (formData.password.length >= 8 ? 'valid' : 'invalid')
      : 'empty',
    confirmPassword: formData.confirmPassword
      ? (formData.password === formData.confirmPassword ? 'valid' : 'invalid')
      : 'empty',
  } as Record<string, 'valid' | 'invalid' | 'empty'>), [formData.email, formData.phone, formData.password, formData.confirmPassword]);

  // ─── Role Selection Screen ──────────────────────────────────────────────────
  if (!selectedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-4xl"
        >
          <button
            onClick={() => useNavigationStore.getState().setCurrentPage('landing')}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="size-4" /> Back to Home
          </button>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary mb-4">
              <Heart className="size-7 text-primary-foreground" fill="currentColor" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Join LifeLink</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Choose your role to get started with a personalized experience tailored to your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ROLE_CONFIGS.map((config, i) => {
              const Icon = config.icon;
              return (
                <motion.button
                  key={config.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  onClick={() => handleRoleSelect(config.id)}
                  className={cn(
                    'group relative text-left p-6 rounded-2xl border-2 bg-gradient-to-br transition-all duration-300',
                    config.bgGradient,
                    config.borderColor,
                    'hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl',
                  )}
                >
                  <div className={cn('inline-flex p-3 rounded-xl bg-gradient-to-br mb-4 shadow-md', config.gradient)}>
                    <Icon className="size-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-1">{config.label}</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{config.description}</p>
                  <ul className="space-y-1.5">
                    {config.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Check className="size-3.5 shrink-0 text-emerald-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="size-4 text-muted-foreground" />
                  </div>
                </motion.button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="text-sm text-muted-foreground">Already have an account?</span>
            <button
              onClick={() => useNavigationStore.getState().setCurrentPage('login')}
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline rounded-md px-2 py-1 hover:bg-primary/5 transition-colors"
            >
              Sign In <ArrowRight className="size-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── Step Form ──────────────────────────────────────────────────────────────
  const roleConfig = ROLE_CONFIGS.find((r) => r.id === selectedRole)!;
  const roleSteps = ROLE_STEPS[selectedRole];
  const RoleIcon = roleConfig.icon;
  const isLastStep = step === totalSteps;

  const renderAccountStep = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="s-name">Full Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input id="s-name" placeholder="John Doe" value={formData.name} onChange={(e) => updateField('name', e.target.value)} className={cn('pl-10', errors.name && 'border-destructive')} autoComplete="name" />
        </div>
        {err('name')}
      </div>

      <div className="space-y-2">
        <Label htmlFor="s-email">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input id="s-email" type="email" placeholder="you@example.com" value={formData.email} onChange={(e) => updateField('email', e.target.value)} className={cn('pl-10 pr-10', errors.email && 'border-destructive')} autoComplete="email" />
          <div className="absolute right-3 top-1/2 -translate-y-1/2"><ValidationIndicator status={fv.email} /></div>
        </div>
        {err('email')}
      </div>

      <div className="space-y-2">
        <Label htmlFor="s-phone">Phone Number</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input id="s-phone" type="tel" placeholder="+91-9876543210" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} className={cn('pl-10 pr-10', errors.phone && 'border-destructive')} autoComplete="tel" />
          <div className="absolute right-3 top-1/2 -translate-y-1/2"><ValidationIndicator status={fv.phone} /></div>
        </div>
        {err('phone')}
      </div>

      <div className="space-y-2">
        <Label htmlFor="s-password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input id="s-password" type="password" placeholder="Min. 8 characters" value={formData.password} onChange={(e) => updateField('password', e.target.value)} className={cn('pl-10 pr-10', errors.password && 'border-destructive')} autoComplete="new-password" />
          <div className="absolute right-3 top-1/2 -translate-y-1/2"><ValidationIndicator status={fv.password} /></div>
        </div>
        {err('password')}
        {formData.password && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-1.5 pt-1">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  transition={{ duration: 0.3 }}
                  className={cn('h-full rounded-full', passwordStrength.color)}
                />
              </div>
              <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-full', passwordStrength.bgColor)}>{passwordStrength.label}</span>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={cn('h-1 flex-1 rounded-full transition-colors duration-300', i <= passwordStrength.score ? passwordStrength.color : 'bg-muted')} />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="s-confirm">Confirm Password</Label>
        <div className="relative">
          <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input id="s-confirm" type="password" placeholder="Re-enter password" value={formData.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} className={cn('pl-10 pr-10', errors.confirmPassword && 'border-destructive')} autoComplete="new-password" />
          <div className="absolute right-3 top-1/2 -translate-y-1/2"><ValidationIndicator status={fv.confirmPassword} /></div>
        </div>
        {err('confirmPassword')}
      </div>
    </div>
  );

  // Patient Steps ──────────────────────────────────────────────────────────────

  const renderPatientMedicalProfile = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Blood Group</Label>
        <Select value={formData.bloodGroup} onValueChange={(v) => updateField('bloodGroup', v)}>
          <SelectTrigger className={cn('w-full', errors.bloodGroup && 'border-destructive')}>
            <Droplets className="size-4 mr-1 text-muted-foreground" />
            <SelectValue placeholder="Select blood group" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(BLOOD_GROUP_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {err('bloodGroup')}
      </div>

      <div className="space-y-2">
        <Label htmlFor="dob">Date of Birth</Label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input id="dob" type="date" value={formData.dateOfBirth} onChange={(e) => updateField('dateOfBirth', e.target.value)} className={cn('pl-10', errors.dateOfBirth && 'border-destructive')} max={new Date().toISOString().split('T')[0]} />
        </div>
        {err('dateOfBirth')}
      </div>

      <div className="space-y-2">
        <Label>Gender</Label>
        <Select value={formData.gender} onValueChange={(v) => updateField('gender', v)}>
          <SelectTrigger className={cn('w-full', errors.gender && 'border-destructive')}>
            <User className="size-4 mr-1 text-muted-foreground" />
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
            <SelectItem value="Non-binary">Non-binary</SelectItem>
            <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
          </SelectContent>
        </Select>
        {err('gender')}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Home Address <span className="text-muted-foreground text-xs">(optional)</span></Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <textarea
            id="address"
            placeholder="Enter your home address"
            value={formData.address}
            onChange={(e) => updateField('address', e.target.value)}
            className="flex w-full min-h-[76px] rounded-md border border-input bg-transparent px-3 py-2 pl-10 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] resize-none"
          />
        </div>
      </div>
    </div>
  );

  const renderPatientMedicalHistory = () => (
    <div className="space-y-5">
      <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
        <p className="text-xs text-muted-foreground leading-relaxed">
          This helps emergency responders provide better care. All fields are optional — add as much or as little as you want.
        </p>
      </div>
      <TagInput label="Allergies" placeholder="e.g. Penicillin, Peanuts, Latex" tags={formData.allergies} onChange={(v) => updateField('allergies', v)} />
      <TagInput label="Current Medications" placeholder="e.g. Metformin 500mg, Aspirin" tags={formData.currentMedications} onChange={(v) => updateField('currentMedications', v)} />
      <TagInput label="Chronic Conditions" placeholder="e.g. Diabetes, Hypertension" tags={formData.chronicConditions} onChange={(v) => updateField('chronicConditions', v)} />
    </div>
  );

  const renderPatientEmergencyContact = () => (
    <div className="space-y-4">
      <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Optional but highly recommended. We&apos;ll notify this person during emergencies when you can&apos;t communicate.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ec-name">Contact Name</Label>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input id="ec-name" placeholder="Jane Doe" value={formData.emergencyName} onChange={(e) => updateField('emergencyName', e.target.value)} className="pl-10" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Relationship</Label>
        <Select value={formData.emergencyRelationship} onValueChange={(v) => updateField('emergencyRelationship', v)}>
          <SelectTrigger>
            <Heart className="size-4 mr-1 text-muted-foreground" />
            <SelectValue placeholder="Select relationship" />
          </SelectTrigger>
          <SelectContent>
            {['Spouse', 'Parent', 'Sibling', 'Child', 'Friend', 'Other'].map((r) => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ec-phone">Contact Phone</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input id="ec-phone" type="tel" placeholder="+91-9876543210" value={formData.emergencyPhone} onChange={(e) => updateField('emergencyPhone', e.target.value)} className="pl-10" />
        </div>
      </div>
    </div>
  );

  // Driver Steps ──────────────────────────────────────────────────────────────

  const renderDriverDetails = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="license">Driving License Number</Label>
        <div className="relative">
          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input id="license" placeholder="e.g. DL-1420110012345" value={formData.licenseNumber} onChange={(e) => updateField('licenseNumber', e.target.value)} className={cn('pl-10', errors.licenseNumber && 'border-destructive')} />
        </div>
        {err('licenseNumber')}
      </div>

      <div className="space-y-2">
        <Label>Years of Experience</Label>
        <Select value={formData.experience} onValueChange={(v) => updateField('experience', v)}>
          <SelectTrigger className={cn('w-full', errors.experience && 'border-destructive')}>
            <Calendar className="size-4 mr-1 text-muted-foreground" />
            <SelectValue placeholder="Select experience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="less-than-1">Less than 1 year</SelectItem>
            <SelectItem value="1-3">1–3 years</SelectItem>
            <SelectItem value="3-5">3–5 years</SelectItem>
            <SelectItem value="5-10">5–10 years</SelectItem>
            <SelectItem value="10+">10+ years</SelectItem>
          </SelectContent>
        </Select>
        {err('experience')}
      </div>

      <div className="space-y-2">
        <Label htmlFor="vehicle">Ambulance / Vehicle Number</Label>
        <div className="relative">
          <Car className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="vehicle"
            placeholder="e.g. MH-01-AB-1234"
            value={formData.vehicleNumber}
            onChange={(e) => updateField('vehicleNumber', e.target.value.toUpperCase())}
            className={cn('pl-10 tracking-wider', errors.vehicleNumber && 'border-destructive')}
          />
        </div>
        {err('vehicleNumber')}
        <p className="text-[11px] text-muted-foreground">
          If this vehicle exists in the system, you&apos;ll be linked automatically.
        </p>
      </div>
    </div>
  );

  const renderDriverConfirm = () => (
    <div className="space-y-4">
      <div className="bg-muted/50 rounded-xl p-5 border space-y-3">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <BadgeCheck className="size-4 text-amber-500" /> Driver Profile Summary
        </h4>
        {[
          { label: 'Name', value: formData.name },
          { label: 'Email', value: formData.email },
          { label: 'Phone', value: formData.phone },
          { label: 'License Number', value: formData.licenseNumber },
          { label: 'Experience', value: formData.experience.replace('-', '–') || '—' },
          { label: 'Vehicle Number', value: formData.vehicleNumber || '—' },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between text-sm border-b border-border/40 pb-2 last:border-0 last:pb-0">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium">{value}</span>
          </div>
        ))}
      </div>
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
        Your account will be reviewed by an administrator before full activation.
      </div>
    </div>
  );

  // Hospital Staff Steps ───────────────────────────────────────────────────────

  const renderHospitalDetails = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Select Hospital</Label>
        <Select value={formData.hospitalId} onValueChange={(v) => updateField('hospitalId', v)}>
          <SelectTrigger className={cn('w-full', errors.hospitalId && 'border-destructive')}>
            <Building2 className="size-4 mr-1 text-muted-foreground" />
            <SelectValue placeholder="Select your hospital" />
          </SelectTrigger>
          <SelectContent>
            {hospitals.length === 0 ? (
              <SelectItem value="_" disabled>Loading hospitals...</SelectItem>
            ) : hospitals.map((h) => (
              <SelectItem key={h.id} value={h.id}>{h.name} — {h.city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {err('hospitalId')}
      </div>

      <div className="space-y-2">
        <Label htmlFor="dept">Department</Label>
        <div className="relative">
          <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input id="dept" placeholder="e.g. Emergency, Cardiology, ICU" value={formData.department} onChange={(e) => updateField('department', e.target.value)} className={cn('pl-10', errors.department && 'border-destructive')} />
        </div>
        {err('department')}
      </div>

      <div className="space-y-2">
        <Label htmlFor="emp-id">Employee ID <span className="text-muted-foreground text-xs">(optional)</span></Label>
        <div className="relative">
          <BadgeCheck className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input id="emp-id" placeholder="e.g. EMP-20231234" value={formData.employeeId} onChange={(e) => updateField('employeeId', e.target.value)} className="pl-10" />
        </div>
      </div>
    </div>
  );

  const renderHospitalConfirm = () => {
    const hospital = hospitals.find((h) => h.id === formData.hospitalId);
    return (
      <div className="space-y-4">
        <div className="bg-muted/50 rounded-xl p-5 border space-y-3">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <BadgeCheck className="size-4 text-sky-500" /> Staff Profile Summary
          </h4>
          {[
            { label: 'Name', value: formData.name },
            { label: 'Email', value: formData.email },
            { label: 'Phone', value: formData.phone },
            { label: 'Hospital', value: hospital ? `${hospital.name}, ${hospital.city}` : '—' },
            { label: 'Department', value: formData.department },
            { label: 'Employee ID', value: formData.employeeId || '—' },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-sm border-b border-border/40 pb-2 last:border-0 last:pb-0">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Admin Steps ────────────────────────────────────────────────────────────────

  const renderAdminVerification = () => (
    <div className="space-y-4">
      <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-4 flex items-start gap-3">
        <Shield className="size-5 text-violet-500 mt-0.5 shrink-0" />
        <p className="text-sm text-muted-foreground leading-relaxed">
          Admin accounts require a special invitation code issued by LifeLink system administrators. This code is not publicly available.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="admin-code">Admin Invitation Code</Label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="admin-code"
            type="password"
            placeholder="Enter your invite code"
            value={formData.adminCode}
            onChange={(e) => updateField('adminCode', e.target.value)}
            className={cn('pl-10', errors.adminCode && 'border-destructive')}
          />
        </div>
        {err('adminCode')}
      </div>
    </div>
  );

  // Step Content Router ───────────────────────────────────────────────────────

  const renderStepContent = () => {
    if (step === 1) return renderAccountStep();
    if (selectedRole === 'PATIENT') {
      if (step === 2) return renderPatientMedicalProfile();
      if (step === 3) return renderPatientMedicalHistory();
      if (step === 4) return renderPatientEmergencyContact();
    }
    if (selectedRole === 'DRIVER') {
      if (step === 2) return renderDriverDetails();
      if (step === 3) return renderDriverConfirm();
    }
    if (selectedRole === 'HOSPITAL_STAFF') {
      if (step === 2) return renderHospitalDetails();
      if (step === 3) return renderHospitalConfirm();
    }
    if (selectedRole === 'ADMIN') {
      if (step === 2) return renderAdminVerification();
    }
    return null;
  };

  // ─── Step Form Render ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg"
      >
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="size-4" />
          {step === 1 ? 'Change Role' : 'Back'}
        </button>

        <div className="bg-card rounded-2xl border shadow-lg p-6 sm:p-8">
          {/* Role badge + title */}
          <div className="flex items-center gap-3 mb-6">
            <div className={cn('flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br shadow-md', roleConfig.gradient)}>
              <RoleIcon className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Create {roleConfig.label} Account</h1>
              <p className="text-xs text-muted-foreground">Step {step} of {totalSteps}</p>
            </div>
          </div>

          {/* Step progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              {roleSteps.map(({ label }, i) => {
                const num = i + 1;
                const isActive = step === num;
                const isCompleted = step > num;
                return (
                  <div key={label} className="flex items-center flex-1">
                    <div className="flex flex-col items-center gap-1.5">
                      <motion.div
                        className={cn(
                          'flex items-center justify-center size-9 rounded-full text-xs font-bold transition-all shrink-0',
                          isCompleted && 'bg-primary text-primary-foreground shadow-md',
                          isActive && 'bg-primary text-primary-foreground ring-4 ring-primary/20 shadow-md',
                          !isActive && !isCompleted && 'bg-muted text-muted-foreground',
                        )}
                        animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        {isCompleted ? <Check className="size-4" /> : <span className="text-[11px]">{num}</span>}
                      </motion.div>
                      <span className={cn(
                        'text-[10px] font-semibold hidden sm:block text-center',
                        isActive ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground',
                      )}>
                        {label}
                      </span>
                    </div>
                    {i < totalSteps - 1 && (
                      <div className="flex-1 mx-2 mt-[-16px]">
                        <div className="relative h-0.5 rounded-full bg-border overflow-hidden">
                          <motion.div
                            className="absolute inset-y-0 left-0 rounded-full bg-primary"
                            initial={{ width: '0%' }}
                            animate={{ width: isCompleted ? '100%' : '0%' }}
                            transition={{ duration: 0.4, ease: 'easeInOut' }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={step}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="text-xs text-muted-foreground text-center"
              >
                {roleSteps[step - 1]?.description}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Form content with slide animation */}
          <div className="relative overflow-hidden min-h-[300px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`${selectedRole}-${step}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="w-full"
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleBack} className="gap-2">
              <ArrowLeft className="size-4" />
              {step === 1 ? 'Change Role' : 'Back'}
            </Button>

            {isLastStep ? (
              <Button type="button" onClick={handleSubmit} disabled={isSubmitting} className="gap-2 min-w-[140px]">
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="size-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Creating...
                  </span>
                ) : (
                  <><Check className="size-4" /> Create Account</>
                )}
              </Button>
            ) : (
              <Button type="button" onClick={handleNext} className="gap-2">
                Continue <ArrowRight className="size-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground">Already have an account?</span>
          <button
            onClick={() => useNavigationStore.getState().setCurrentPage('login')}
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline rounded-md px-2 py-1 hover:bg-primary/5 transition-colors"
          >
            Sign In <ArrowRight className="size-3.5" />
          </button>
        </div>
      </motion.div>

      {/* Success overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="bg-card rounded-3xl border shadow-2xl p-12 text-center max-w-sm mx-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="mx-auto mb-6 size-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.4 }}
                >
                  <Check className="size-10 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
                </motion.div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <PartyPopper className="size-8 text-amber-500 mx-auto mb-4" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-2xl font-bold mb-2"
              >
                Welcome to LifeLink!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-muted-foreground text-sm"
              >
                Your {roleConfig.label.toLowerCase()} account is ready. Redirecting you now...
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex items-center justify-center gap-1 mt-4"
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="size-1.5 rounded-full bg-primary"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
