'use client';

import { useNavigationStore, useAuthStore } from '@/store';
import { AnimatePresence, motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import LandingPage from '@/components/pages/LandingPage';
import LoginPage from '@/components/pages/LoginPage';
import SignupPage from '@/components/pages/SignupPage';
import PatientDashboard from '@/components/pages/PatientDashboard';
import SOSPage from '@/components/pages/SOSPage';
import TrackingPage from '@/components/pages/TrackingPage';
import HospitalsPage from '@/components/pages/HospitalsPage';
import MedicalRecordsPage from '@/components/pages/MedicalRecordsPage';
import QRCardPage from '@/components/pages/QRCardPage';
import NotificationsPage from '@/components/pages/NotificationsPage';
import FeedbackPage from '@/components/pages/FeedbackPage';
import ProfilePage from '@/components/pages/ProfilePage';
import AdminDashboard from '@/components/pages/AdminDashboard';
import AdminUsersPage from '@/components/pages/AdminUsersPage';
import AdminHospitalsPage from '@/components/pages/AdminHospitalsPage';
import AdminAmbulancesPage from '@/components/pages/AdminAmbulancesPage';
import AdminEmergenciesPage from '@/components/pages/AdminEmergenciesPage';
import HospitalDashboard from '@/components/pages/HospitalDashboard';
import HospitalBedsPage from '@/components/pages/HospitalBedsPage';
import HospitalPatientsPage from '@/components/pages/HospitalPatientsPage';
import DriverDashboardPage from '@/components/pages/DriverDashboardPage';
import DriverNavigationPage from '@/components/pages/DriverNavigationPage';
import EmergencyProfilePage from '@/components/pages/EmergencyProfilePage';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SOSFloatingButton from '@/components/dashboard/SOSFloatingButton';
import OnboardingFlow from '@/components/dashboard/OnboardingFlow';
import SearchDialog from '@/components/dashboard/SearchDialog';
import { type PageRoute } from '@/types';

const pageComponents: Record<PageRoute, React.ComponentType> = {
  'landing': LandingPage,
  'login': LoginPage,
  'signup': SignupPage,
  'dashboard': PatientDashboard,
  'sos': SOSPage,
  'tracking': TrackingPage,
  'hospitals': HospitalsPage,
  'medical-records': MedicalRecordsPage,
  'qr-card': QRCardPage,
  'notifications': NotificationsPage,
  'feedback': FeedbackPage,
  'profile': ProfilePage,
  'admin': AdminDashboard,
  'admin-users': AdminUsersPage,
  'admin-hospitals': AdminHospitalsPage,
  'admin-ambulances': AdminAmbulancesPage,
  'admin-emergencies': AdminEmergenciesPage,
  'hospital-dashboard': HospitalDashboard,
  'hospital-beds': HospitalBedsPage,
  'hospital-patients': HospitalPatientsPage,
  'driver-dashboard': DriverDashboardPage,
  'driver-navigation': DriverNavigationPage,
  'emergency-profile': EmergencyProfilePage,
};


const publicPages: PageRoute[] = ['landing', 'login', 'signup', 'emergency-profile'];

function HomeContent() {
  const { currentPage, setCurrentPage } = useNavigationStore();
  const { isAuthenticated } = useAuthStore();
  const searchParams = useSearchParams();

  // Derive the page to show directly from the URL — no setState during render
  const pageParam = searchParams.get('page') as PageRoute | null;
  const resolvedPage: PageRoute =
    pageParam && pageComponents[pageParam] ? pageParam : currentPage;

  // Sync the Zustand store in the background (for nav highlighting etc.)
  // This runs AFTER render, so it never causes a crash
  useEffect(() => {
    if (pageParam && pageComponents[pageParam] && pageParam !== currentPage) {
      setCurrentPage(pageParam);
    }
  }, [pageParam, currentPage, setCurrentPage]);

  const isPublic = publicPages.includes(resolvedPage);
  const PageComponent = pageComponents[resolvedPage] || LandingPage;

  if (isPublic) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <PageComponent />
        </motion.div>
      </AnimatePresence>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <>
      <DashboardLayout>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="h-full"
          >
            <PageComponent />
          </motion.div>
        </AnimatePresence>
      </DashboardLayout>
      <SOSFloatingButton />
      <OnboardingFlow />
      <SearchDialog />
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="h-screen w-screen bg-background animate-pulse" />}>
      <HomeContent />
    </Suspense>
  );
}
