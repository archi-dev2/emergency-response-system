'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Mail,
  Lock,
  ArrowLeft,
  User,
  ShieldCheck,
  Truck,
  Building2,
  Shield,
  Activity,
  Cross,
  Stethoscope,
  Quote,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useAuthStore } from '@/store';
import { useNavigationStore } from '@/store';
import { DEMO_PASSWORD } from '@/lib/constants';
import { DASHBOARD_STATS } from '@/lib/mock-data';
import type { PageRoute, Role } from '@/types';
import { cn } from '@/lib/utils';

const ROLE_DASHBOARD_MAP: Record<Role, PageRoute> = {
  PATIENT: 'dashboard',
  DRIVER: 'driver-dashboard',
  HOSPITAL_STAFF: 'hospital-dashboard',
  ADMIN: 'admin',
};

interface DemoAccount {
  label: string;
  email: string;
  icon: React.ReactNode;
  color: string;
  avatarColor: string;
  description: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    label: 'Patient',
    email: 'patient@lifelink.com',
    icon: <User className="size-4" />,
    color: 'border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 dark:hover:border-emerald-600',
    avatarColor: 'bg-emerald-600',
    description: 'Arjun Mehta',
  },
  {
    label: 'Driver',
    email: 'driver@lifelink.com',
    icon: <Truck className="size-4" />,
    color: 'border-amber-200 dark:border-amber-800 hover:border-amber-400 dark:hover:border-amber-600',
    avatarColor: 'bg-amber-600',
    description: 'Rajesh Kumar',
  },
  {
    label: 'Hospital',
    email: 'hospital@lifelink.com',
    icon: <Building2 className="size-4" />,
    color: 'border-violet-200 dark:border-violet-800 hover:border-violet-400 dark:hover:border-violet-600',
    avatarColor: 'bg-violet-600',
    description: 'Dr. Ananya Gupta',
  },
  {
    label: 'Admin',
    email: 'admin@lifelink.com',
    icon: <ShieldCheck className="size-4" />,
    color: 'border-rose-200 dark:border-rose-800 hover:border-rose-400 dark:hover:border-rose-600',
    avatarColor: 'bg-rose-600',
    description: 'System Admin',
  },
];

// Floating medical icons for the illustration area
const FLOATING_ICONS = [
  { Icon: Cross, className: 'top-[15%] left-[10%]', delay: 0, duration: 7 },
  { Icon: Stethoscope, className: 'top-[25%] right-[15%]', delay: 1, duration: 8 },
  { Icon: Heart, className: 'bottom-[30%] left-[20%]', delay: 2, duration: 6 },
  { Icon: Activity, className: 'bottom-[20%] right-[10%]', delay: 0.5, duration: 9 },
  { Icon: Shield, className: 'top-[60%] left-[8%]', delay: 3, duration: 7.5 },
  { Icon: Cross, className: 'top-[45%] right-[22%]', delay: 1.5, duration: 8.5 },
];

function AnimatedStat({ value, label, suffix }: { value: number; label: string; suffix?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="text-center"
    >
      <div className="text-3xl font-bold text-white">
        {suffix === '+' ? `${value.toLocaleString()}+` : value.toLocaleString()}
      </div>
      <div className="text-sm text-white/70 mt-1">{label}</div>
    </motion.div>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  // Auth and navigation from stores for reliable direct calls
  const login = useAuthStore((s) => s.login);
  const setCurrentPage = useNavigationStore((s) => s.setCurrentPage);

  const performLogin = (loginEmail: string, loginPassword: string) => {
    const success = login(loginEmail, loginPassword);
    if (success) {
      const user = useAuthStore.getState().user;
      if (user) {
        const dashboardPage = ROLE_DASHBOARD_MAP[user.role];
        setCurrentPage(dashboardPage);
        toast.success(`Welcome back, ${user.name}!`);
      }
      return true;
    }
    return false;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    if (!password.trim()) {
      toast.error('Please enter your password');
      return;
    }

    setIsLoading(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const success = performLogin(email, password);

    if (!success) {
      toast.error('Invalid credentials. Please try a demo account below.');
    }

    setIsLoading(false);
  };

  const handleDemoClick = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword(DEMO_PASSWORD);
    setIsLoading(true);

    // Small delay for visual feedback
    await new Promise((resolve) => setTimeout(resolve, 300));

    const success = performLogin(demoEmail, DEMO_PASSWORD);

    if (!success) {
      toast.error('Login failed. Please try again.');
    }

    setIsLoading(false);
  };

  const handleForgotPassword = () => {
    if (!resetEmail.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    toast.success('Password reset link sent to your email!');
    setForgotPasswordOpen(false);
    setResetEmail('');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branded Illustration Area */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #991b1b 0%, #7f1d1d 25%, #450a0a 60%, #1c0a0a 100%)',
        }}
      >
        {/* Animated floating circles / particles (CSS only) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large ambient circles */}
          <div className="absolute top-16 left-16 w-72 h-72 rounded-full bg-white/[0.03] blur-3xl animate-float" />
          <div className="absolute bottom-16 right-16 w-96 h-96 rounded-full bg-rose-500/[0.06] blur-3xl animate-float-delayed" />
          <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-orange-500/[0.04] blur-2xl animate-float-slow" />

          {/* Floating medical icons */}
          {FLOATING_ICONS.map(({ Icon, className, delay, duration }, idx) => (
            <div
              key={idx}
              className={cn('absolute text-white/[0.08]', className)}
              style={{
                animation: `float-icon ${duration}s ease-in-out ${delay}s infinite`,
              }}
            >
              <Icon className="size-8" />
            </div>
          ))}

          {/* Animated dashed ring */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-dashed border-white/[0.06]"
            style={{ animation: 'spin 60s linear infinite' }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border border-white/[0.04]"
            style={{ animation: 'spin 45s linear infinite reverse' }}
          />
        </div>

        <div className="relative z-10 px-16 text-center max-w-xl">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 mb-6 shadow-lg">
              <Heart className="size-10 text-white" fill="currentColor" />
            </div>
          </motion.div>

          {/* Brand Name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl font-bold text-white mb-4 tracking-tight"
          >
            LifeLink
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-xl text-white/80 mb-2 font-medium"
          >
            Every Second Matters
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-sm text-white/50 mb-12"
          >
            Smart Emergency Medical Response System
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="grid grid-cols-2 gap-8 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
          >
            <AnimatedStat value={DASHBOARD_STATS.totalLivesSaved} label="Lives Saved" suffix="+" />
            <AnimatedStat value={DASHBOARD_STATS.hospitalsOnline} label="Hospitals Online" />
            <AnimatedStat value={DASHBOARD_STATS.ambulancesOnline} label="Ambulances Active" />
            <AnimatedStat value={DASHBOARD_STATS.avgResponseTime} label="Avg Response (min)" />
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex items-center justify-center gap-6 mt-10"
          >
            <div className="flex items-center gap-2 text-white/40 text-xs">
              <Shield className="size-4" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-white/40 text-xs">
              <ShieldCheck className="size-4" />
              <span>256-bit Encrypted</span>
            </div>
          </motion.div>

          {/* Testimonial quote at bottom */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="mt-10 pt-8 border-t border-white/10"
          >
            <Quote className="size-5 text-white/20 mx-auto mb-3" />
            <p className="text-sm text-white/50 italic leading-relaxed">
              &ldquo;LifeLink saved my father&apos;s life. The ambulance arrived in under 4 minutes.&rdquo;
            </p>
            <p className="text-xs text-white/30 mt-2">— Priya M., Verified Patient</p>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 sm:p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {/* Back to Home */}
          <button
            onClick={() => useNavigationStore.getState().setCurrentPage('landing')}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="size-4" />
            Back to Home
          </button>

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
              <Heart className="size-5 text-primary-foreground" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-lg font-bold">LifeLink</h1>
              <p className="text-xs text-muted-foreground">Every Second Matters</p>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Sign In</h2>
            <p className="text-muted-foreground mt-1">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button variant="outline" className="h-11 gap-2 font-normal text-sm" type="button">
              <svg className="size-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </Button>
            <Button variant="outline" className="h-11 gap-2 font-normal text-sm" type="button">
              <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Apple
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground">
                or continue with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form ref={formRef} onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email);
                    setForgotPasswordOpen(true);
                  }}
                  className="text-xs text-primary hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
              />
              <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                Remember me for 30 days
              </Label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-11"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="size-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Quick Demo Access
              </span>
            </div>
          </div>

          {/* Demo Account Cards */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            {DEMO_ACCOUNTS.map((account, idx) => (
              <motion.button
                key={account.label}
                type="button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.7 + idx * 0.08 }}
                onClick={() => handleDemoClick(account.email)}
                className={cn(
                  'flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all duration-200 group',
                  'hover:shadow-md hover:scale-[1.02] active:scale-[0.98]',
                  account.color,
                  email === account.email && 'ring-2 ring-primary/30 shadow-md bg-muted/30',
                )}
              >
                <div className={cn(
                  'flex items-center justify-center size-8 rounded-full text-white text-xs font-bold shrink-0',
                  account.avatarColor,
                )}>
                  {account.description.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-sm font-medium block truncate">{account.label}</span>
                  <span className="text-[10px] text-muted-foreground truncate block">{account.description}</span>
                </div>
                <svg className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </motion.button>
            ))}
          </div>

          <p className="text-xs text-muted-foreground text-center mb-6">
            Password is pre-filled: <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">{DEMO_PASSWORD}</code>
          </p>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <button
              onClick={() => useNavigationStore.getState().setCurrentPage('signup')}
              className="text-primary font-medium hover:underline"
            >
              Sign Up
            </button>
          </p>
        </motion.div>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Lock className="size-4 text-primary" />
              </div>
              Reset Password
            </DialogTitle>
            <DialogDescription>
              Enter your email address and we&apos;ll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="you@example.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setForgotPasswordOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleForgotPassword}>
              Send Reset Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CSS-only floating animation keyframes */}
      <style jsx global>{`
        @keyframes float-icon {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.08; }
          25% { transform: translateY(-20px) rotate(5deg); opacity: 0.12; }
          50% { transform: translateY(-10px) rotate(-3deg); opacity: 0.08; }
          75% { transform: translateY(-25px) rotate(3deg); opacity: 0.1; }
        }
        @keyframes spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
