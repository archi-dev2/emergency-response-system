'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin } from 'lucide-react';
import type { DynamicMapProps } from './DynamicMap';

// Dynamically import the map component with SSR disabled
// This is critical because Leaflet relies on the window object which doesn't exist on the server
const DynamicMap = dynamic(() => import('./DynamicMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center bg-muted/20 border border-muted/30 rounded-xl">
      <div className="relative">
        <Skeleton className="w-16 h-16 rounded-full" />
        <MapPin className="absolute inset-0 m-auto w-6 h-6 text-muted-foreground animate-pulse" />
      </div>
      <p className="mt-4 text-sm text-muted-foreground animate-pulse font-medium">Loading Map Data...</p>
    </div>
  ),
});

export default function MapWrapper(props: DynamicMapProps) {
  return <DynamicMap {...props} />;
}
