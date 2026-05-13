'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BedDouble, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MOCK_BEDS } from '@/lib/mock-data';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.03 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

const typeColors: Record<string, string> = {
  ICU: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  EMERGENCY: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  GENERAL: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  PEDIATRIC: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400',
};

const statusColors: Record<string, string> = {
  AVAILABLE: 'bg-green-500',
  OCCUPIED: 'bg-red-500',
  RESERVED: 'bg-amber-500',
};

type BedFilter = 'ALL' | 'AVAILABLE' | 'OCCUPIED' | 'RESERVED';

export default function HospitalBedsPage() {
  const [filter, setFilter] = useState<BedFilter>('ALL');

  const filteredBeds = filter === 'ALL' ? MOCK_BEDS : MOCK_BEDS.filter((b) => b.status === filter);

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp}>
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-lg bg-primary/10">
            <BedDouble className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Bed Management</h1>
            <p className="text-muted-foreground text-sm">Monitor and manage hospital bed availability</p>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={fadeUp} className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-muted-foreground" />
        {(['ALL', 'AVAILABLE', 'OCCUPIED', 'RESERVED'] as BedFilter[]).map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
            className="text-xs"
          >
            {f}
          </Button>
        ))}
      </motion.div>

      <motion.div variants={fadeUp}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Beds ({filteredBeds.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-[600px] overflow-y-auto scrollbar-thin">
              {filteredBeds.map((bed) => (
                <div
                  key={bed.id}
                  className="relative p-3 rounded-lg border text-center hover:shadow-sm transition-shadow"
                >
                  <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${statusColors[bed.status]}`} />
                  <p className="text-sm font-semibold">{bed.number}</p>
                  <Badge className={`text-[10px] mt-1 ${typeColors[bed.type] || ''}`}>{bed.type}</Badge>
                  {bed.patientName && (
                    <p className="text-[10px] text-muted-foreground mt-1 truncate">{bed.patientName}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
