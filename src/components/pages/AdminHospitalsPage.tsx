'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, Phone, Star, Search, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { DEMO_HOSPITALS } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            'size-3',
            star <= Math.floor(rating)
              ? 'text-amber-500 fill-amber-500'
              : star <= rating
                ? 'text-amber-400 fill-amber-400'
                : 'text-muted-foreground/30',
          )}
        />
      ))}
      <span className="text-xs font-semibold ml-1">{rating}</span>
    </div>
  );
}

export default function AdminHospitalsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: 'approve' | 'deactivate';
    hospital: (typeof DEMO_HOSPITALS)[0] | null;
  }>({ open: false, type: 'approve', hospital: null });

  const filteredHospitals = useMemo(() => {
    if (!searchQuery.trim()) return DEMO_HOSPITALS;
    const q = searchQuery.toLowerCase();
    return DEMO_HOSPITALS.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.city.toLowerCase().includes(q) ||
        h.specializations.some((s) => s.toLowerCase().includes(q)),
    );
  }, [searchQuery]);

  const stats = useMemo(() => {
    const total = DEMO_HOSPITALS.length;
    const active = DEMO_HOSPITALS.filter((h) => h.isActive).length;
    const inactive = total - active;
    const totalBeds = DEMO_HOSPITALS.reduce((sum, h) => sum + h.totalBeds, 0);
    const availableBeds = DEMO_HOSPITALS.reduce((sum, h) => sum + h.availableBeds, 0);
    return { total, active, inactive, totalBeds, availableBeds };
  }, []);

  const handleConfirmAction = () => {
    if (!confirmDialog.hospital) return;
    const action = confirmDialog.type === 'approve' ? 'approved' : 'deactivated';
    toast.success(`${confirmDialog.hospital.name} has been ${action}`);
    setConfirmDialog({ open: false, type: 'approve', hospital: null });
  };

  const handleActionClick = (hospital: (typeof DEMO_HOSPITALS)[0], type: 'approve' | 'deactivate') => {
    setConfirmDialog({ open: true, type, hospital });
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp}>
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-lg bg-primary/10">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Hospital Management</h1>
            <p className="text-muted-foreground text-sm">Manage registered hospitals and bed availability</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Summary Row */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Hospitals', value: stats.total, color: 'text-foreground', icon: Building2, bgColor: 'bg-primary/10' },
          { label: 'Active', value: stats.active, color: 'text-emerald-600 dark:text-emerald-400', icon: CheckCircle, bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
          { label: 'Inactive', value: stats.inactive, color: 'text-red-600 dark:text-red-400', icon: XCircle, bgColor: 'bg-red-100 dark:bg-red-900/30' },
          { label: 'Available Beds', value: stats.availableBeds.toLocaleString(), color: 'text-amber-600 dark:text-amber-400', icon: AlertTriangle, bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
        ].map((stat) => (
          <Card key={stat.label} className="card-hover">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                  <p className={cn('text-2xl font-bold mt-0.5', stat.color)}>{stat.value}</p>
                </div>
                <div className={cn('p-2 rounded-lg', stat.bgColor)}>
                  <stat.icon className={cn('size-4', stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Search Bar */}
      <motion.div variants={fadeUp}>
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, city, or specialization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </motion.div>

      <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredHospitals.map((hospital) => (
          <motion.div key={hospital.id} variants={fadeUp}>
            <Card className="card-hover overflow-hidden">
              {/* Top colored bar */}
              <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 shadow-sm">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold leading-tight">{hospital.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{hospital.city}</p>
                    </div>
                  </div>
                  <Badge
                    className={cn(
                      'text-xs',
                      hospital.isActive
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
                    )}
                  >
                    {hospital.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                {/* Specialization Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {hospital.specializations.slice(0, 3).map((spec) => (
                    <Badge key={spec} variant="secondary" className="text-[10px] font-normal px-2 py-0.5">
                      {spec}
                    </Badge>
                  ))}
                  {hospital.specializations.length > 3 && (
                    <Badge variant="outline" className="text-[10px] font-normal px-2 py-0.5">
                      +{hospital.specializations.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{hospital.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3 shrink-0" />
                    <span>{hospital.phone}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-muted-foreground">
                      Beds: <span className="font-semibold text-foreground">{hospital.availableBeds}/{hospital.totalBeds}</span>
                    </span>
                    <span className="text-muted-foreground">
                      ICU: <span className="font-semibold text-foreground">{hospital.icuAvailable}/{hospital.icuTotal}</span>
                    </span>
                  </div>
                  <StarRating rating={hospital.emergencyRating} />
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 mt-3">
                  {hospital.isActive ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs text-destructive hover:text-destructive flex-1"
                      onClick={() => handleActionClick(hospital, 'deactivate')}
                    >
                      Deactivate
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs text-emerald-600 hover:text-emerald-600 flex-1"
                      onClick={() => handleActionClick(hospital, 'approve')}
                    >
                      Approve
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="h-8 text-xs flex-1">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {filteredHospitals.length === 0 && (
          <div className="col-span-2 flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Building2 className="size-10 mb-3 opacity-30" />
            <p className="text-sm font-medium">No hospitals found</p>
            <p className="text-xs mt-1">Try adjusting your search query</p>
          </div>
        )}
      </motion.div>

      {/* Approve/Deactivate Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className={cn(
                'p-1.5 rounded-lg',
                confirmDialog.type === 'approve' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30',
              )}>
                {confirmDialog.type === 'approve' ? (
                  <CheckCircle className="size-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <XCircle className="size-4 text-red-600 dark:text-red-400" />
                )}
              </div>
              {confirmDialog.type === 'approve' ? 'Approve Hospital' : 'Deactivate Hospital'}
            </DialogTitle>
            <DialogDescription>
              {confirmDialog.type === 'approve'
                ? `Are you sure you want to approve ${confirmDialog.hospital?.name}? They will be able to receive emergency requests.`
                : `Are you sure you want to deactivate ${confirmDialog.hospital?.name}? They will no longer receive emergency requests.`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {confirmDialog.hospital && (
              <div className="p-3 rounded-lg bg-muted/50 border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{confirmDialog.hospital.name}</p>
                    <p className="text-xs text-muted-foreground">{confirmDialog.hospital.city} &middot; {confirmDialog.hospital.phone}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setConfirmDialog({ open: false, type: 'approve', hospital: null })}>
              Cancel
            </Button>
            <Button
              variant={confirmDialog.type === 'deactivate' ? 'destructive' : 'default'}
              onClick={handleConfirmAction}
            >
              {confirmDialog.type === 'approve' ? 'Approve' : 'Deactivate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
