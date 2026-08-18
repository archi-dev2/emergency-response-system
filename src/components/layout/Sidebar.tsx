'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  Activity,
  LayoutDashboard,
  Bell,
  User,
  Shield,
  Truck,
  Building2,
  FileText,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Flame,
  Hospital,
  DollarSign,
  Users,
  Settings,
  ShieldAlert,
  BarChart3,
  Calendar,
  Layers,
  History,
  QrCode,
  Radio,
  FileBadge,
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { useNavigationStore } from '@/store';
import { useUIStore } from '@/store';
import { NAVIGATION_ITEMS } from '@/lib/constants';
import type { NavItem, PageRoute, Role } from '@/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Bell,
  User,
  Shield,
  Truck,
  Building2,
  FileText,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Flame,
  Hospital,
  DollarSign,
  Users,
  Settings,
  ShieldAlert,
  BarChart3,
  Calendar,
  Layers,
  History,
  QrCode,
  Radio,
  FileBadge,
};

const ROLE_COLORS: Record<Role, { bg: string; text: string; dot: string }> = {
  PATIENT: {
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    text: 'text-emerald-700 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  DRIVER: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    text: 'text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  HOSPITAL_STAFF: {
    bg: 'bg-violet-500/10 dark:bg-violet-500/20',
    text: 'text-violet-700 dark:text-violet-400',
    dot: 'bg-violet-500',
  },
  ADMIN: {
    bg: 'bg-rose-500/10 dark:bg-rose-500/20',
    text: 'text-rose-700 dark:text-rose-400',
    dot: 'bg-rose-500',
  },
};

const AVATAR_COLORS = [
  'bg-emerald-600',
  'bg-amber-600',
  'bg-violet-600',
  'bg-rose-600',
  'bg-teal-600',
  'bg-orange-600',
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ collapsed: controlledCollapsed, onToggle }: SidebarProps) {
  const { t } = useLanguage();
  const { currentPage, sidebarOpen, toggleSidebar, setCurrentPage } = useNavigationStore();
  const { user } = useAuthStore();
  const unreadCount = useUIStore((s) => s.unreadCount);

  const isCollapsed = controlledCollapsed ?? !sidebarOpen;

  const roleLabels: Record<Role, string> = {
    PATIENT: t.sidebar?.roleLabels?.patient ?? 'Patient',
    DRIVER: t.sidebar?.roleLabels?.driver ?? 'Ambulance Driver',
    HOSPITAL_STAFF: t.sidebar?.roleLabels?.hospitalStaff ?? 'Hospital Staff',
    ADMIN: t.sidebar?.roleLabels?.admin ?? 'Administrator',
  };

  const navSections = useMemo(() => {
    if (!user) return [];
    const items = NAVIGATION_ITEMS[user.role] ?? [];
    const mainItems = items.filter((item: NavItem) => !item.emergency);
    const emergencyItems = items.filter((item: NavItem) => item.emergency);

    const sections: { label: string; items: NavItem[] }[] = [];
    if (mainItems.length > 0) {
      sections.push({ label: t.sidebar?.sectionMain ?? 'Main', items: mainItems });
    }
    if (emergencyItems.length > 0) {
      sections.push({ label: t.sidebar?.sectionEmergency ?? 'Emergency', items: emergencyItems });
    }
    return sections;
  }, [user, t.sidebar?.sectionMain, t.sidebar?.sectionEmergency]);

  const handleLogout = () => {
    useAuthStore.getState().logout();
    useNavigationStore.getState().setCurrentPage('landing');
  };

  const handleNavClick = (route: PageRoute) => {
    setCurrentPage(route);
  };

  if (!user) return null;

  const roleColor = ROLE_COLORS[user.role];
  const avatarColor = getAvatarColor(user.name);
  const initials = getInitials(user.name);

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 72 : 260 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="hidden md:flex flex-col h-screen bg-gradient-to-b from-muted/50 to-background border-r border-border fixed left-0 top-0 z-30"
      >
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-border shrink-0">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary shrink-0 shadow-sm">
            <Heart className="size-5 text-primary-foreground" fill="currentColor" />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden whitespace-nowrap flex flex-col"
              >
                <span className="text-base font-bold leading-tight">LifeLink</span>
                <span className="text-[10px] text-muted-foreground leading-tight flex items-center gap-1">
                  <Activity className="size-2.5 text-primary" />
                  {t.sidebar?.tagline ?? 'Every Second Matters'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Card */}
        <div className={cn('px-3 py-4 border-b border-border shrink-0', isCollapsed ? 'px-2' : 'px-3')}>
          <div className={cn('flex items-center gap-3', isCollapsed && 'justify-center')}>
            <div className="relative shrink-0">
              <div
                className={cn(
                  'flex items-center justify-center rounded-full text-white text-sm font-bold ring-2 ring-background',
                  isCollapsed ? 'size-10' : 'size-11',
                  avatarColor,
                )}
              >
                {initials}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 size-3.5 bg-background rounded-full flex items-center justify-center">
                <div className="size-2.5 rounded-full bg-emerald-500 ring-1 ring-background" />
              </div>
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.15 }}
                  className="overflow-hidden min-w-0"
                >
                  <p className="text-sm font-semibold truncate">{user.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className={cn('size-1.5 rounded-full', roleColor.dot)} />
                    <span
                      className={cn(
                        'inline-block px-1.5 py-px text-[10px] font-semibold rounded-full',
                        roleColor.bg,
                        roleColor.text,
                      )}
                    >
                      {roleLabels[user.role]}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 scrollbar-thin">
          {navSections.map((section) => (
            <div key={section.label} className="mb-3 last:mb-0">
              {!isCollapsed && (
                <div className="flex items-center gap-2 px-3 mb-2">
                  <Separator className="flex-1" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                    {section.label}
                  </span>
                  <Separator className="flex-1" />
                </div>
              )}
              {isCollapsed && (
                <Separator className="mb-2" />
              )}

              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = ICON_MAP[item.icon] ?? LayoutDashboard;
                  const isActive = currentPage === item.route;
                  const isEmergency = item.emergency;
                  const isNotifications = item.route === 'notifications';

                  const navButton = (
                    <button
                      onClick={() => handleNavClick(item.route)}
                      className={cn(
                        'w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 relative group',
                        isCollapsed && 'justify-center px-0',
                        isActive
                          ? isEmergency
                            ? 'bg-destructive/10 text-destructive font-bold border-l-[3px] border-destructive'
                            : 'bg-primary/10 text-primary font-bold border-l-[3px] border-primary'
                          : isEmergency
                            ? 'text-destructive/80 hover:bg-destructive/5 hover:text-destructive hover:translate-x-0.5'
                            : 'text-muted-foreground hover:bg-accent hover:text-foreground hover:translate-x-0.5',
                        isCollapsed && isActive && (isEmergency ? 'bg-destructive/10' : 'bg-primary/10'),
                        isCollapsed && !isActive && 'hover:bg-accent/50',
                      )}
                    >
                      <div className="relative shrink-0">
                        <Icon
                          className={cn(
                            'size-5 transition-colors',
                            isActive
                              ? isEmergency
                                ? 'text-destructive'
                                : 'text-primary'
                              : isEmergency
                                ? 'text-destructive/70 group-hover:text-destructive'
                                : 'text-muted-foreground group-hover:text-foreground',
                          )}
                        />
                        {isNotifications && unreadCount > 0 && isCollapsed && (
                          <span className="absolute -top-1 -right-1 size-2 rounded-full bg-destructive animate-pulse" />
                        )}
                      </div>

                      <AnimatePresence>
                        {!isCollapsed && (
                          <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.15 }}
                            className="overflow-hidden whitespace-nowrap flex-1 text-left flex items-center justify-between"
                          >
                            <span>{item.label}</span>
                            {isNotifications && unreadCount > 0 && (
                              <Badge variant="destructive" className="h-5 px-1.5 text-[10px] font-bold rounded-full">
                                {unreadCount}
                              </Badge>
                            )}
                            {item.badge && !isNotifications && (
                              <Badge
                                variant={isEmergency ? 'destructive' : 'secondary'}
                                className="h-5 px-1.5 text-[10px] font-bold rounded-full"
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  );

                  if (isCollapsed) {
                    return (
                      <li key={item.route}>
                        <Tooltip>
                          <TooltipTrigger asChild>{navButton}</TooltipTrigger>
                          <TooltipContent side="right" sideOffset={8} className="flex items-center gap-2">
                            <span>{item.label}</span>
                            {isNotifications && unreadCount > 0 && (
                              <Badge variant="destructive" className="h-4 px-1 text-[9px] font-bold rounded-full">
                                {unreadCount}
                              </Badge>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      </li>
                    );
                  }

                  return <li key={item.route}>{navButton}</li>;
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-border shrink-0 p-2 space-y-1">
          {/* Logout */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleLogout}
                className={cn(
                  'w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/5 hover:text-destructive transition-all duration-200 hover:translate-x-0.5',
                  isCollapsed && 'justify-center px-0',
                )}
              >
                <LogOut className="size-5 shrink-0" />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.15 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      {t.sidebar?.logout ?? 'Logout'}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" sideOffset={8}>
                {t.sidebar?.logout ?? 'Logout'}
              </TooltipContent>
            )}
          </Tooltip>

          <Separator />

          {/* Collapse Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onToggle ?? toggleSidebar}
                className={cn(
                  'w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200 hover:translate-x-0.5',
                  isCollapsed && 'justify-center px-0',
                )}
              >
                {isCollapsed ? (
                  <ChevronsRight className="size-5 shrink-0" />
                ) : (
                  <>
                    <ChevronsLeft className="size-5 shrink-0" />
                    <span>{t.sidebar?.collapse ?? 'Collapse'}</span>
                  </>
                )}
              </button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" sideOffset={8}>
                {t.sidebar?.expandSidebar ?? 'Expand Sidebar'}
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}
