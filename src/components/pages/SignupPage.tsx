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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuthStore, useNavigationStore } from '@/store';
import { BLOOD_GROUP_LABELS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import LanguageSelector from '@/components/landing/LanguageSelector';

type Role = 'PATIENT' | 'DRIVER' | 'HOSPITAL_STAFF' | 'ADMIN';

interface RoleConfig {
  id: Role;
  roleKey: 'patient' | 'driver' | 'hospitalStaff' | 'admin';
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  bgGradient: string;
  borderColor: string;
  fallbackLabel: string;
  fallbackDesc: string;
  fallbackFeatures: string[];
}

const ROLE_CONFIGS: RoleConfig[] = [
  {
    id: 'PATIENT',
    roleKey: 'patient',
    icon: Heart,
    gradient: 'from-emerald-500 to-teal-600',
    bgGradient: 'from-emerald-500/10 to-teal-600/10',
    borderColor: 'border-emerald-500/40',
    fallbackLabel: 'Patient',
    fallbackDesc: 'Access emergency services, track ambulances, manage your health profile',
    fallbackFeatures: ['SOS Emergency Button', 'Real-time Ambulance Tracking', 'Medical Records', 'AI Health Assistant'],
  },
  {
    id: 'DRIVER',
    roleKey: 'driver',
    icon: Truck,
    gradient: 'from-amber-500 to-orange-600',
    bgGradient: 'from-amber-500/10 to-orange-600/10',
    borderColor: 'border-amber-500/40',
    fallbackLabel: 'Ambulance Driver',
    fallbackDesc: 'Manage emergency assignments, track your vehicle, update your availability',
    fallbackFeatures: ['Emergency Assignments', 'Live Navigation', 'Earnings Dashboard', 'Vehicle Management'],
  },
  {
    id: 'HOSPITAL_STAFF',
    roleKey: 'hospitalStaff',
    icon: Building2,
    gradient: 'from-violet-500 to-purple-600',
    bgGradient: 'from-violet-500/10 to-purple-600/10',
    borderColor: 'border-violet-500/40',
    fallbackLabel: 'Hospital Staff',
    fallbackDesc: 'Receive incoming emergency alerts, assign beds, coordinate patient arrivals',
    fallbackFeatures: ['Incoming Alerts', 'Bed Management', 'Patient History Access', 'ER Capacity Tracking'],
  },
  {
    id: 'ADMIN',
    roleKey: 'admin',
    icon: ShieldCheck,
    gradient: 'from-rose-500 to-pink-600',
    bgGradient: 'from-rose-500/10 to-pink-600/10',
    borderColor: 'border-rose-500/40',
    fallbackLabel: 'Administrator',
    fallbackDesc: 'System configuration, user management, network monitoring and analytics',
    fallbackFeatures: ['System Overview', 'User Management', 'Analytics & Reports', 'Audit Logs'],
  },
];

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
  if (role === 'PATIENT') {
    if (step === 2) {
      if (!data.bloodGroup) errors.bloodGroup = 'Blood group is required';
      if (!data.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
    }
  } else if (role === 'DRIVER') {
    if (step === 2) {
      if (!data.licenseNumber.trim()) errors.licenseNumber = 'License number is required';
      if (!data.vehicleNumber.trim()) errors.vehicleNumber = 'Vehicle number is required';
    }
  } else if (role === 'HOSPITAL_STAFF') {
    if (step === 2) {
      if (!data.hospitalId.trim()) errors.hospitalId = 'Hospital ID is required';
      if (!data.employeeId.trim()) errors.employeeId = 'Employee ID is required';
    }
  } else if (role === 'ADMIN') {
    if (step === 2) {
      if (!data.adminCode.trim()) errors.adminCode = 'Admin code is required';
    }
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

export default function SignupPage() {
  const { t } = useLanguage();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const updateField = useCallback((field: keyof FormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setStep(1);
    setFormData(INITIAL_FORM);
    setErrors({});
  };

  const getRoleSteps = (role: Role) => {
    const s = t.signup?.steps;
    if (role === 'PATIENT') {
      return [
        { label: s?.account ?? 'Account', description: s?.accountDesc ?? 'Create your personal account credentials' },
        { label: s?.medicalProfile ?? 'Medical Profile', description: s?.medicalProfileDesc ?? 'Add your basic medical information' },
        { label: s?.medicalHistory ?? 'Medical History', description: s?.medicalHistoryDesc ?? 'List allergies, medications & conditions' },
        { label: s?.emergencyContact ?? 'Emergency Contact', description: s?.emergencyContactDesc ?? 'Who should we contact in emergencies?' },
      ];
    } else if (role === 'DRIVER') {
      return [
        { label: s?.account ?? 'Account', description: s?.accountDesc ?? 'Create your driver account credentials' },
        { label: s?.driverDetails ?? 'Driver Details', description: s?.driverDetailsDesc ?? 'License, experience & vehicle information' },
        { label: s?.confirm ?? 'Confirm', description: s?.confirmDesc ?? 'Review and submit your driver profile' },
      ];
    } else if (role === 'HOSPITAL_STAFF') {
      return [
        { label: s?.account ?? 'Account', description: s?.accountDesc ?? 'Create your hospital staff credentials' },
        { label: s?.hospitalRole ?? 'Hospital & Role', description: s?.hospitalRoleDesc ?? 'Select your hospital and department' },
        { label: s?.confirm ?? 'Confirm', description: s?.confirmDesc ?? 'Review and submit your staff profile' },
      ];
    } else {
      return [
        { label: s?.account ?? 'Account', description: s?.accountDesc ?? 'Create your admin account credentials' },
        { label: s?.verification ?? 'Verification', description: s?.verificationDesc ?? 'Enter your admin invitation code' },
      ];
    }
  };

  const currentRoleSteps = selectedRole ? getRoleSteps(selectedRole) : [];
  const totalSteps = currentRoleSteps.length;

  const validate = (s: number) => {
    if (!selectedRole) return {};
    if (s === 1) return validateAccountStep(formData);
    return validateRoleStep(selectedRole, s, formData);
  };

  const handleNext = () => {
    const stepErrors = validate(step);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      toast.error(t.signup?.errorFix ?? 'Please fix the errors before continuing');
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
        toast.success(t.signup?.successTitle ?? 'Account created! Welcome to LifeLink.');
      } else {
        const errData = await res.json().catch(() => ({}));
        toast.error(errData.error ?? t.signup?.errorSignup ?? 'Signup failed. Please try again.');
      }
    } catch {
      toast.error(t.signup?.errorNetwork ?? 'Network error. Please check your connection.');
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
      <div className="min-h-screen flex flex-col justify-between bg-background p-4 py-8">
        {/* Top Header */}
        <div className="flex items-center justify-between w-full max-w-4xl mx-auto mb-4">
          <button
            onClick={() => useNavigationStore.getState().setCurrentPage('landing')}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" /> {t.signup?.backToHome ?? 'Back to Home'}
          </button>
          <LanguageSelector variant="outline" size="sm" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary mb-4">
              <Heart className="size-7 text-primary-foreground" fill="currentColor" />
            </div>
            <h1 className="text-3xl font-bold mb-2">{t.signup?.heading ?? 'Join LifeLink'}</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              {t.signup?.chooseRole ?? 'Choose your role to get started with a personalized experience tailored to your needs.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ROLE_CONFIGS.map((config, i) => {
              const Icon = config.icon;
              const roleInfo = t.signup?.roles?.[config.roleKey];
              const label = roleInfo?.label ?? config.fallbackLabel;
              const description = roleInfo?.description ?? config.fallbackDesc;
              const features = roleInfo?.features ?? config.fallbackFeatures;

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
                  <h3 className="text-lg font-bold mb-1">{label}</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{description}</p>
                  <ul className="space-y-1.5">
                    {features.map((feature) => (
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
            <span className="text-sm text-muted-foreground">{t.signup?.alreadyHaveAccount ?? 'Already have an account?'}</span>
            <button
              onClick={() => useNavigationStore.getState().setCurrentPage('login')}
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline rounded-md px-2 py-1 hover:bg-primary/5 transition-colors"
            >
              {t.signup?.signIn ?? 'Sign In'} <ArrowRight className="size-3.5" />
            </button>
          </div>
        </motion.div>

        <div className="py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} LifeLink
        </div>
      </div>
    );
  }

  // ─── Step Form ──────────────────────────────────────────────────────────────
  const roleConfig = ROLE_CONFIGS.find((r) => r.id === selectedRole)!;
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

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="s-dob">Date of Birth</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input id="s-dob" type="date" value={formData.dateOfBirth} onChange={(e) => updateField('dateOfBirth', e.target.value)} className={cn('pl-10', errors.dateOfBirth && 'border-destructive')} />
          </div>
          {err('dateOfBirth')}
        </div>

        <div className="space-y-2">
          <Label>Gender</Label>
          <Select value={formData.gender} onValueChange={(v) => updateField('gender', v)}>
            <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="MALE">Male</SelectItem>
              <SelectItem value="FEMALE">Female</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="s-address">Address</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <textarea
            id="s-address"
            rows={3}
            placeholder="Enter your home address"
            value={formData.address}
            onChange={(e) => updateField('address', e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-md border border-input bg-transparent text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>
    </div>
  );

  const renderPatientMedicalHistory = () => (
    <div className="space-y-5">
      <TagInput label="Known Allergies" placeholder="e.g. Penicillin, Peanuts" tags={formData.allergies} onChange={(t) => updateField('allergies', t)} />
      <TagInput label="Current Medications" placeholder="e.g. Insulin, Aspirin 75mg" tags={formData.currentMedications} onChange={(t) => updateField('currentMedications', t)} />
      <TagInput label="Chronic Conditions" placeholder="e.g. Asthma, Type 2 Diabetes" tags={formData.chronicConditions} onChange={(t) => updateField('chronicConditions', t)} />
    </div>
  );

  const renderPatientEmergencyContact = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="s-em-name">Contact Person Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input id="s-em-name" placeholder="e.g. Jane Doe" value={formData.emergencyName} onChange={(e) => updateField('emergencyName', e.target.value)} className="pl-10" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="s-em-rel">Relationship</Label>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input id="s-em-rel" placeholder="e.g. Spouse, Parent, Sibling" value={formData.emergencyRelationship} onChange={(e) => updateField('emergencyRelationship', e.target.value)} className="pl-10" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="s-em-phone">Contact Phone Number</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input id="s-em-phone" type="tel" placeholder="+91-9876543210" value={formData.emergencyPhone} onChange={(e) => updateField('emergencyPhone', e.target.value)} className="pl-10" />
        </div>
      </div>
    </div>
  );

  const renderDriverDetails = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="s-lic">Driving License Number</Label>
        <div className="relative">
          <BadgeCheck className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input id="s-lic" placeholder="DL-1420110012345" value={formData.licenseNumber} onChange={(e) => updateField('licenseNumber', e.target.value)} className={cn('pl-10', errors.licenseNumber && 'border-destructive')} />
        </div>
        {err('licenseNumber')}
      </div>

      <div className="space-y-2">
        <Label htmlFor="s-exp">Years of Driving Experience</Label>
        <div className="relative">
          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input id="s-exp" placeholder="e.g. 5 years" value={formData.experience} onChange={(e) => updateField('experience', e.target.value)} className="pl-10" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="s-veh">Vehicle Registration Number</Label>
        <div className="relative">
          <Car className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input id="s-veh" placeholder="MH-01-AB-1234" value={formData.vehicleNumber} onChange={(e) => updateField('vehicleNumber', e.target.value)} className={cn('pl-10', errors.vehicleNumber && 'border-destructive')} />
        </div>
        {err('vehicleNumber')}
      </div>
    </div>
  );

  const renderHospitalRole = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="s-hosp">Hospital ID / Name</Label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input id="s-hosp" placeholder="e.g. H-101 / AIIMS Delhi" value={formData.hospitalId} onChange={(e) => updateField('hospitalId', e.target.value)} className={cn('pl-10', errors.hospitalId && 'border-destructive')} />
        </div>
        {err('hospitalId')}
      </div>

      <div className="space-y-2">
        <Label htmlFor="s-dept">Department</Label>
        <div className="relative">
          <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input id="s-dept" placeholder="e.g. Emergency & Trauma" value={formData.department} onChange={(e) => updateField('department', e.target.value)} className="pl-10" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="s-emp">Employee ID Number</Label>
        <div className="relative">
          <BadgeCheck className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input id="s-emp" placeholder="e.g. EMP-9921" value={formData.employeeId} onChange={(e) => updateField('employeeId', e.target.value)} className={cn('pl-10', errors.employeeId && 'border-destructive')} />
        </div>
        {err('employeeId')}
      </div>
    </div>
  );

  const renderAdminVerification = () => (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs leading-relaxed">
        Admin accounts require an authorization code provided by your organization network administrator.
      </div>
      <div className="space-y-2">
        <Label htmlFor="s-code">Admin Invitation Code</Label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input id="s-code" type="password" placeholder="Enter admin code" value={formData.adminCode} onChange={(e) => updateField('adminCode', e.target.value)} className={cn('pl-10', errors.adminCode && 'border-destructive')} />
        </div>
        {err('adminCode')}
      </div>
    </div>
  );

  const renderConfirmStep = () => (
    <div className="space-y-4">
      <div className="rounded-xl border p-4 bg-muted/30 space-y-2 text-sm">
        <p className="font-semibold">Review Account Summary</p>
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div><span className="font-medium text-foreground">Name:</span> {formData.name}</div>
          <div><span className="font-medium text-foreground">Email:</span> {formData.email}</div>
          <div><span className="font-medium text-foreground">Phone:</span> {formData.phone}</div>
          <div><span className="font-medium text-foreground">Role:</span> {selectedRole}</div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground text-center">
        By clicking Create Account, you agree to LifeLink&apos;s Terms of Service and Privacy Policy.
      </p>
    </div>
  );

  const renderStepContent = () => {
    if (step === 1) return renderAccountStep();
    if (selectedRole === 'PATIENT') {
      if (step === 2) return renderPatientMedicalProfile();
      if (step === 3) return renderPatientMedicalHistory();
      if (step === 4) return renderPatientEmergencyContact();
    } else if (selectedRole === 'DRIVER') {
      if (step === 2) return renderDriverDetails();
      if (step === 3) return renderConfirmStep();
    } else if (selectedRole === 'HOSPITAL_STAFF') {
      if (step === 2) return renderHospitalRole();
      if (step === 3) return renderConfirmStep();
    } else if (selectedRole === 'ADMIN') {
      if (step === 2) return renderAdminVerification();
    }
    return null;
  };

  const currentStepData = currentRoleSteps[step - 1] ?? { label: '', description: '' };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background p-4 py-6">
      {/* Top bar */}
      <div className="flex items-center justify-between w-full max-w-lg mx-auto mb-4">
        <button onClick={handleBack} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="size-4" /> {step === 1 ? (t.signup?.backToHome ?? 'Change Role') : (t.signup?.back ?? 'Back')}
        </button>
        <LanguageSelector variant="outline" size="sm" />
      </div>

      <div className="w-full max-w-lg mx-auto flex-1 flex flex-col justify-center">
        {/* Card container */}
        <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-xl relative overflow-hidden">
          {/* Top role badge */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b">
            <div className="flex items-center gap-2.5">
              <div className={cn('p-2 rounded-xl bg-gradient-to-br text-white', roleConfig.gradient)}>
                <RoleIcon className="size-4" />
              </div>
              <span className="font-bold text-sm">{selectedRole} Registration</span>
            </div>
            <span className="text-xs text-muted-foreground font-medium">Step {step} of {totalSteps}</span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mb-6">
            <motion.div
              className={cn('h-full rounded-full bg-gradient-to-r', roleConfig.gradient)}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Step Title & Subtitle */}
          <div className="mb-6">
            <h2 className="text-xl font-bold">{currentStepData.label}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{currentStepData.description}</p>
          </div>

          {/* Animated step form */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-between mt-8 pt-4 border-t gap-3">
            <Button type="button" variant="outline" onClick={handleBack} className="gap-1.5">
              <ArrowLeft className="size-4" /> {step === 1 ? (t.signup?.back ?? 'Back') : (t.signup?.back ?? 'Back')}
            </Button>

            {!isLastStep ? (
              <Button type="button" onClick={handleNext} className="gap-1.5">
                {t.signup?.next ?? 'Next'} <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button type="button" onClick={handleSubmit} disabled={isSubmitting} className={cn('gap-1.5 text-white bg-gradient-to-r', roleConfig.gradient)}>
                {isSubmitting ? (t.signup?.submitting ?? 'Creating Account...') : (t.signup?.submit ?? 'Create Account')}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccess} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50 mb-3">
              <PartyPopper className="size-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <DialogTitle className="text-2xl text-center font-bold">Welcome to LifeLink!</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Your account has been successfully created. Redirecting to your dashboard...
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
