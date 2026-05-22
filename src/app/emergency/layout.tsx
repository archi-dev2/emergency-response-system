import type { Viewport } from 'next';

// Force correct mobile viewport so the page fills the screen at native size
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function EmergencyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
