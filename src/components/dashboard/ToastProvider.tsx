'use client';

import { toast } from 'sonner';
import { CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastConfig {
  borderColor: string;
  icon: typeof CheckCircle2;
  iconColor: string;
  bgAccent: string;
}

const TOAST_CONFIG: Record<ToastType, ToastConfig> = {
  success: {
    borderColor: 'border-l-emerald-500',
    icon: CheckCircle2,
    iconColor: 'text-emerald-500',
    bgAccent: 'bg-emerald-50 dark:bg-emerald-950/40',
  },
  error: {
    borderColor: 'border-l-red-500',
    icon: XCircle,
    iconColor: 'text-red-500',
    bgAccent: 'bg-red-50 dark:bg-red-950/40',
  },
  warning: {
    borderColor: 'border-l-amber-500',
    icon: AlertTriangle,
    iconColor: 'text-amber-500',
    bgAccent: 'bg-amber-50 dark:bg-amber-950/40',
  },
  info: {
    borderColor: 'border-l-sky-500',
    icon: Info,
    iconColor: 'text-sky-500',
    bgAccent: 'bg-sky-50 dark:bg-sky-950/40',
  },
};

function showEmergencyToast(
  type: ToastType,
  title: string,
  message: string,
) {
  const config = TOAST_CONFIG[type];
  const IconComponent = config.icon;

  toast.custom(
    () => (
      <div
        className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border border-l-4 ${config.borderColor} ${config.bgAccent} p-4 shadow-lg`}
      >
        <IconComponent className={`mt-0.5 size-5 shrink-0 ${config.iconColor}`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    ),
    {
      duration: 4000,
      position: 'bottom-right',
    },
  );
}

export const emergencyToast = {
  success: (title: string, message: string) =>
    showEmergencyToast('success', title, message),
  error: (title: string, message: string) =>
    showEmergencyToast('error', title, message),
  warning: (title: string, message: string) =>
    showEmergencyToast('warning', title, message),
  info: (title: string, message: string) =>
    showEmergencyToast('info', title, message),
};

export default emergencyToast;
