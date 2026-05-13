'use client';

import { useState, useCallback, useMemo } from 'react';
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
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuthStore, useNavigationStore } from '@/store';
import { BLOOD_GROUP_LABELS } from '@/lib/constants';
import type { PageRoute } from '@/types';
import { cn } from '@/lib/utils';

const TOTAL_STEPS = 3;

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  bloodGroup: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  emergencyName: string;
  emergencyRelationship: string;
  emergencyPhone: string;
}

interface FormErrors {
  [key: string]: string;
}

const INITIAL_FORM: FormData = {
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  bloodGroup: '',
  dateOfBirth: '',
  gender: '',
  address: '',
  emergencyName: '',
  emergencyRelationship: '',
  emergencyPhone: '',
};

function validateStep(step: number, data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (step === 1) {
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
  }

  if (step === 2) {
    if (!data.bloodGroup) errors.bloodGroup = 'Please select your blood group';
    if (!data.dateOfBirth) errors.dateOfBirth = 'Please enter your date of birth';
    if (!data.gender) errors.gender = 'Please select your gender';
  }

  // Step 3 is optional - no required fields

  return errors;
}

// Step metadata with icons and descriptions
const STEPS = [
  { num: 1, label: 'Account', icon: User, description: 'Create your personal account credentials' },
  { num: 2, label: 'Medical', icon: Droplets, description: 'Add your medical details for emergencies' },
  { num: 3, label: 'Emergency', icon: Users, description: 'Who should we contact in an emergency?' },
];

// Real-time validation rules
function validateField(field: keyof FormData, value: string): 'valid' | 'invalid' | 'empty' {
  if (!value) return 'empty';
  switch (field) {
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'valid' : 'invalid';
    case 'password':
      return value.length >= 8 ? 'valid' : 'invalid';
    case 'phone':
      return /^[+]?[\d\s-]{10,15}$/.test(value.replace(/\s/g, '')) ? 'valid' : 'invalid';
    case 'confirmPassword':
      return 'empty'; // Handled separately since we need password context
    default:
      return 'empty';
  }
}

function getPasswordStrength(password: string): { score: number; label: string; color: string; bgColor: string } {
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
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="size-4 flex items-center justify-center shrink-0"
    >
      {status === 'valid' ? (
        <CircleCheckBig className="size-4 text-emerald-500" />
      ) : (
        <X className="size-4 text-destructive" />
      )}
    </motion.div>
  );
}

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const updateField = useCallback((field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field on change
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const handleNext = () => {
    const stepErrors = validateStep(step, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      toast.error('Please fix the errors before continuing');
      return;
    }
    setErrors({});
    setDirection(1);
    setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  };

  const handleBack = () => {
    setErrors({});
    setDirection(-1);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Show success animation
    setShowSuccess(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Auto-login with the new user as patient
    const success = useAuthStore.getState().login(formData.email, 'Demo@12345');

    if (success) {
      const user = useAuthStore.getState().user;
      if (user) {
        useNavigationStore.getState().setCurrentPage('dashboard');
        toast.success('Account created successfully! Welcome to LifeLink.');
      }
    } else {
      toast.success('Account created! Redirecting to login...');
      setTimeout(() => {
        useNavigationStore.getState().setCurrentPage('login');
      }, 1000);
    }

    setIsSubmitting(false);
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  const renderFieldError = (field: string) =>
    errors[field] ? (
      <p className="text-xs text-destructive mt-1">{errors[field]}</p>
    ) : null;

  const passwordStrength = useMemo(() => getPasswordStrength(formData.password), [formData.password]);

  const fieldValidations = useMemo(() => ({
    email: validateField('email', formData.email),
    phone: validateField('phone', formData.phone),
    password: validateField('password', formData.password),
  }), [formData.email, formData.phone, formData.password]);

  const confirmPasswordStatus = useMemo(() => {
    if (!formData.confirmPassword) return 'empty' as const;
    return formData.password === formData.confirmPassword ? 'valid' as const : 'invalid' as const;
  }, [formData.confirmPassword, formData.password]);

  const renderStep1 = () => (
    <div className="space-y-4">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            className={cn('pl-10', errors.name && 'border-destructive')}
            autoComplete="name"
          />
        </div>
        {renderFieldError('name')}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="signup-email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            className={cn('pl-10 pr-10', errors.email && 'border-destructive')}
            autoComplete="email"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <ValidationIndicator status={fieldValidations.email} />
          </div>
        </div>
        {renderFieldError('email')}
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="phone"
            type="tel"
            placeholder="+91-9876543210"
            value={formData.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            className={cn('pl-10 pr-10', errors.phone && 'border-destructive')}
            autoComplete="tel"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <ValidationIndicator status={fieldValidations.phone} />
          </div>
        </div>
        {renderFieldError('phone')}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="signup-password"
            type="password"
            placeholder="Min. 8 characters"
            value={formData.password}
            onChange={(e) => updateField('password', e.target.value)}
            className={cn('pl-10 pr-10', errors.password && 'border-destructive')}
            autoComplete="new-password"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <ValidationIndicator status={fieldValidations.password} />
          </div>
        </div>
        {renderFieldError('password')}

        {/* Password Strength Meter */}
        {formData.password && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-1.5 pt-1"
          >
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className={cn('h-full rounded-full', passwordStrength.color)}
                />
              </div>
              <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-full', passwordStrength.bgColor)}>
                {passwordStrength.label}
              </span>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={cn(
                    'h-1 flex-1 rounded-full transition-colors duration-300',
                    i <= passwordStrength.score ? passwordStrength.color : 'bg-muted',
                  )}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <div className="relative">
          <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="confirm-password"
            type="password"
            placeholder="Re-enter password"
            value={formData.confirmPassword}
            onChange={(e) => updateField('confirmPassword', e.target.value)}
            className={cn('pl-10 pr-10', errors.confirmPassword && 'border-destructive')}
            autoComplete="new-password"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <ValidationIndicator status={confirmPasswordStatus} />
          </div>
        </div>
        {renderFieldError('confirmPassword')}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      {/* Blood Group */}
      <div className="space-y-2">
        <Label>Blood Group</Label>
        <Select
          value={formData.bloodGroup}
          onValueChange={(value) => updateField('bloodGroup', value)}
        >
          <SelectTrigger
            className={cn('w-full', errors.bloodGroup && 'border-destructive')}
          >
            <Droplets className="size-4 mr-1 text-muted-foreground" />
            <SelectValue placeholder="Select blood group" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(BLOOD_GROUP_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {renderFieldError('bloodGroup')}
      </div>

      {/* Date of Birth */}
      <div className="space-y-2">
        <Label htmlFor="dob">Date of Birth</Label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="dob"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => updateField('dateOfBirth', e.target.value)}
            className={cn('pl-10', errors.dateOfBirth && 'border-destructive')}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
        {renderFieldError('dateOfBirth')}
      </div>

      {/* Gender */}
      <div className="space-y-2">
        <Label>Gender</Label>
        <Select
          value={formData.gender}
          onValueChange={(value) => updateField('gender', value)}
        >
          <SelectTrigger
            className={cn('w-full', errors.gender && 'border-destructive')}
          >
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
        {renderFieldError('gender')}
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground mt-1" />
          <textarea
            id="address"
            placeholder="Enter your address"
            value={formData.address}
            onChange={(e) => updateField('address', e.target.value)}
            className={cn(
              'flex w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 pl-10 text-base shadow-xs',
              'placeholder:text-muted-foreground',
              'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
              'disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
              'resize-none',
            )}
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="bg-muted/50 rounded-lg p-4 mb-4 border border-border/50">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Emergency contact information is optional but highly recommended. This helps us reach someone on your behalf during emergencies.
        </p>
      </div>

      {/* Emergency Contact Name */}
      <div className="space-y-2">
        <Label htmlFor="emergency-name">Emergency Contact Name</Label>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="emergency-name"
            placeholder="Jane Doe"
            value={formData.emergencyName}
            onChange={(e) => updateField('emergencyName', e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Relationship */}
      <div className="space-y-2">
        <Label htmlFor="emergency-relationship">Relationship</Label>
        <Select
          value={formData.emergencyRelationship}
          onValueChange={(value) => updateField('emergencyRelationship', value)}
        >
          <SelectTrigger className="w-full">
            <Heart className="size-4 mr-1 text-muted-foreground" />
            <SelectValue placeholder="Select relationship" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Spouse">Spouse</SelectItem>
            <SelectItem value="Parent">Parent</SelectItem>
            <SelectItem value="Sibling">Sibling</SelectItem>
            <SelectItem value="Child">Child</SelectItem>
            <SelectItem value="Friend">Friend</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Emergency Contact Phone */}
      <div className="space-y-2">
        <Label htmlFor="emergency-phone">Emergency Contact Phone</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="emergency-phone"
            type="tel"
            placeholder="+91-9876543210"
            value={formData.emergencyPhone}
            onChange={(e) => updateField('emergencyPhone', e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-lg"
      >
        {/* Back to Home */}
        <button
          onClick={() => useNavigationStore.getState().setCurrentPage('landing')}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="size-4" />
          Back to Home
        </button>

        <div className="bg-card rounded-2xl border shadow-lg p-6 sm:p-8">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
              <Heart className="size-5 text-primary-foreground" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Create Account</h1>
              <p className="text-xs text-muted-foreground">Join LifeLink today</p>
            </div>
          </div>

          {/* Enhanced Progress Stepper */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              {STEPS.map(({ num, label, icon: StepIcon }, i) => {
                const isActive = step === num;
                const isCompleted = step > num;
                return (
                  <div key={label} className="flex items-center flex-1">
                    {/* Step circle + label */}
                    <div className="flex flex-col items-center gap-1.5">
                      <motion.div
                        className={cn(
                          'flex items-center justify-center size-10 rounded-full text-sm font-bold transition-all shrink-0',
                          isCompleted && 'bg-primary text-primary-foreground shadow-md',
                          isActive && 'bg-primary text-primary-foreground ring-4 ring-primary/20 shadow-md',
                          !isActive && !isCompleted && 'bg-muted text-muted-foreground',
                        )}
                        animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        {isCompleted ? (
                          <Check className="size-5" />
                        ) : (
                          <StepIcon className="size-4" />
                        )}
                      </motion.div>
                      <span
                        className={cn(
                          'text-[11px] font-semibold hidden sm:block',
                          isActive ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground',
                        )}
                      >
                        {label}
                      </span>
                    </div>

                    {/* Connecting line */}
                    {i < TOTAL_STEPS - 1 && (
                      <div className="flex-1 mx-3 mt-[-16px] sm:mt-[-16px]">
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
            {/* Step description */}
            <AnimatePresence mode="wait">
              <motion.p
                key={step}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="text-xs text-muted-foreground text-center"
              >
                {STEPS[step - 1].description}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Form Content with Animation */}
          <div className="relative overflow-hidden min-h-[320px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
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

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="gap-2"
              >
                <ArrowLeft className="size-4" />
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < TOTAL_STEPS ? (
              <Button
                type="button"
                onClick={handleNext}
                className="gap-2"
              >
                Continue
                <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="gap-2 min-w-[140px]"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="size-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Creating...
                  </div>
                ) : (
                  <>
                    Create Account
                    <Check className="size-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Sign In Link - styled better */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground">Already have an account?</span>
          <button
            onClick={() => useNavigationStore.getState().setCurrentPage('login')}
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline rounded-md px-2 py-1 hover:bg-primary/5 transition-colors"
          >
            Sign In
            <ArrowRight className="size-3.5" />
          </button>
        </div>
      </motion.div>

      {/* Success Animation Overlay */}
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
              {/* Animated checkmark circle */}
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

              {/* Confetti icon */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
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
                Your account has been created. Redirecting you now...
              </motion.p>

              {/* Animated dots */}
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
