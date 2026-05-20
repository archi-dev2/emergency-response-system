'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { PageRoute, User } from '@/types';
import { MOCK_USERS } from '@/lib/mock-data';

interface NavigationState {
  currentPage: PageRoute;
  previousPage: PageRoute | null;
  sidebarOpen: boolean;
  setCurrentPage: (page: PageRoute) => void;
  goBack: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useNavigationStore = create<NavigationState>()(
  persist(
    (set, get) => ({
      currentPage: 'landing' as PageRoute,
      previousPage: null,
      sidebarOpen: true,
      setCurrentPage: (page) => set({ previousPage: get().currentPage, currentPage: page }),
      goBack: () => {
        const { previousPage } = get();
        if (previousPage) {
          set({ currentPage: previousPage, previousPage: null });
        }
      },
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: 'lifelink-navigation',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') return localStorage;
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      partialize: (state) => ({ currentPage: state.currentPage, sidebarOpen: state.sidebarOpen }),
    }
  )
);

// Auth Store
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: (email: string, _password: string) => {
        const user = MOCK_USERS.find((u: User) => u.email === email);
        if (user) {
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => set({ user: null, isAuthenticated: false }),
      updateProfile: (updates) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...updates } });
        }
      },
    }),
    {
      name: 'lifelink-auth',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') return localStorage;
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

// Emergency Store
interface EmergencyState {
  activeEmergency: {
    requestId: string;
    status: string;
    severity: number;
    description?: string;
    ambulanceId?: string;
    hospitalId?: string;
    patientName?: string;
    patientBloodGroup?: string;
    patientLatitude: number;
    patientLongitude: number;
    timeline: { id: string; event: string; description?: string; timestamp: string }[];
    startedAt: string;
  } | null;
  trackingData: {
    latitude: number;
    longitude: number;
    bearing: number;
    speed: number;
    eta: number;
    distanceRemaining: number;
  } | null;
  sosActivated: boolean;
  activateSOS: (severity: number, description?: string) => void;
  acceptEmergency: (ambulanceId: string) => void;
  rejectEmergency: () => void;
  markArrived: () => void;
  completeEmergency: () => void;
  updateTracking: (data: EmergencyState['trackingData']) => void;
  cancelEmergency: () => void;
  addTimelineEvent: (event: string, description?: string) => void;
}

const EMERGENCY_STORAGE_KEY = 'lifelink-emergency';

export const useEmergencyStore = create<EmergencyState>()(
  persist(
    (set, get) => ({
      activeEmergency: null,
      trackingData: null,
      sosActivated: false,

      activateSOS: (severity, description) => {
        const requestId = `ER-${Date.now().toString(36).toUpperCase()}`;
        const now = new Date().toISOString();
        // Use Delhi coordinates for demo
        const lat = 28.6139 + (Math.random() - 0.5) * 0.01;
        const lng = 77.2090 + (Math.random() - 0.5) * 0.01;

        // Get current patient info from auth store
        const authState = useAuthStore.getState();
        const patientName = authState.user?.name ?? 'Unknown Patient';
        const patientBloodGroup = authState.user?.bloodGroup ?? 'O_POS';

        set({
          sosActivated: true,
          activeEmergency: {
            requestId,
            status: 'WAITING_FOR_DRIVER',
            severity,
            description,
            patientName,
            patientBloodGroup,
            patientLatitude: lat,
            patientLongitude: lng,
            timeline: [
              { id: '1', event: 'SOS Triggered', description: `Severity Level ${severity}`, timestamp: now },
              { id: '2', event: 'Alert Broadcast', description: 'Notifying nearby drivers...', timestamp: now },
            ],
            startedAt: now,
          },
        });
      },

      acceptEmergency: (ambulanceId: string) => {
        const { activeEmergency } = get();
        if (!activeEmergency || activeEmergency.status !== 'WAITING_FOR_DRIVER') return;

        get().addTimelineEvent('Ambulance Assigned', 'DL-01-EM-0012 dispatched to your location');
        set((s) => ({
          activeEmergency: s.activeEmergency
            ? { ...s.activeEmergency, status: 'AMBULANCE_ASSIGNED', ambulanceId }
            : null,
        }));

        // Simulate en_route after 2 seconds
        setTimeout(() => {
          const current = get().activeEmergency;
          if (current && current.status === 'AMBULANCE_ASSIGNED') {
            get().addTimelineEvent('Ambulance En Route', 'Rajesh Kumar is heading to your location');
            set((s) => ({
              activeEmergency: s.activeEmergency
                ? { ...s.activeEmergency, status: 'EN_ROUTE' }
                : null,
            }));
          }
        }, 2000);
      },

      rejectEmergency: () => {
        const { activeEmergency } = get();
        if (!activeEmergency || activeEmergency.status !== 'WAITING_FOR_DRIVER') return;
        get().addTimelineEvent('Driver Declined', 'Searching for another driver...');
        // In a real app this would find another driver; for demo just reset
        set({ activeEmergency: null, trackingData: null, sosActivated: false });
      },

      markArrived: () => {
        const { activeEmergency } = get();
        if (!activeEmergency) return;
        get().addTimelineEvent('Ambulance Arrived', 'Ambulance has reached the patient location');
        set((s) => ({
          activeEmergency: s.activeEmergency
            ? { ...s.activeEmergency, status: 'ARRIVED' }
            : null,
        }));
      },

      completeEmergency: () => {
        const { activeEmergency } = get();
        if (!activeEmergency) return;
        get().addTimelineEvent('Emergency Completed', 'Patient has been successfully dropped off at the hospital');
        set({ activeEmergency: null, trackingData: null, sosActivated: false });
      },

      updateTracking: (data) => set({ trackingData: data }),
      cancelEmergency: () => set({ activeEmergency: null, trackingData: null, sosActivated: false }),

      addTimelineEvent: (event, description) => {
        const { activeEmergency } = get();
        if (activeEmergency) {
          set({
            activeEmergency: {
              ...activeEmergency,
              timeline: [
                ...activeEmergency.timeline,
                { id: `${activeEmergency.timeline.length + 1}`, event, description, timestamp: new Date().toISOString() },
              ],
            },
          });
        }
      },
    }),
    {
      name: EMERGENCY_STORAGE_KEY,
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') return localStorage;
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      partialize: (state) => ({
        activeEmergency: state.activeEmergency,
        sosActivated: state.sosActivated,
        trackingData: state.trackingData,
      }),
    }
  )
);

// Cross-tab sync: rehydrate when another tab writes to localStorage
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === EMERGENCY_STORAGE_KEY) {
      useEmergencyStore.persist.rehydrate();
    }
  });
}

// UI Store
interface UIState {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  notifications: { id: string; title: string; message: string; type: string; isRead: boolean; createdAt: string }[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: 'system',
  setTheme: (theme) => set({ theme }),
  notifications: [
    { id: '1', title: 'SOS Alert Test', message: 'A test emergency was triggered in your area.', type: 'EMERGENCY', isRead: false, createdAt: new Date(Date.now() - 300000).toISOString() },
    { id: '2', title: 'Ambulance Update', message: 'Your assigned ambulance is 2km away.', type: 'AMBULANCE', isRead: false, createdAt: new Date(Date.now() - 900000).toISOString() },
    { id: '3', title: 'Hospital Bed Reserved', message: 'AIIMS has reserved an emergency bed for you.', type: 'HOSPITAL', isRead: true, createdAt: new Date(Date.now() - 1800000).toISOString() },
    { id: '4', title: 'Medical Record Update', message: 'Your prescription was updated by Dr. Sharma.', type: 'SYSTEM', isRead: true, createdAt: new Date(Date.now() - 3600000).toISOString() },
    { id: '5', title: 'Feedback Request', message: 'Please rate your last emergency experience.', type: 'SYSTEM', isRead: false, createdAt: new Date(Date.now() - 7200000).toISOString() },
  ],
  unreadCount: 3,
  markAsRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      unreadCount: Math.max(0, s.unreadCount - 1),
    })),
  markAllAsRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),
  searchOpen: false,
  setSearchOpen: (open) => set({ searchOpen: open }),
}));
