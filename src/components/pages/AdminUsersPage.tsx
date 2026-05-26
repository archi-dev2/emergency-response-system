'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, ShieldCheck, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { MOCK_USERS } from '@/lib/mock-data';
import type { Role } from '@/types';
import { cn } from '@/lib/utils';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const roleColors: Record<string, string> = {
  PATIENT: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  DRIVER: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  HOSPITAL_STAFF: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400',
  ADMIN: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400',
};

const avatarColors: Record<string, string> = {
  PATIENT: 'bg-emerald-600',
  DRIVER: 'bg-amber-600',
  HOSPITAL_STAFF: 'bg-violet-600',
  ADMIN: 'bg-rose-600',
};

const ROLES: Role[] = ['PATIENT', 'DRIVER', 'HOSPITAL_STAFF', 'ADMIN'];

const ITEMS_PER_PAGE = 6;

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof MOCK_USERS[0] | null>(null);
  const [newRole, setNewRole] = useState<string>('');

  const filteredUsers = useMemo(() => {
    return MOCK_USERS.filter((user) => {
      const matchesSearch =
        !searchQuery.trim() ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [searchQuery, roleFilter]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleToggleSelect = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId],
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map((u) => u.id));
    }
  };

  const handleRoleClick = (user: (typeof MOCK_USERS)[0]) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setRoleDialogOpen(true);
  };

  const handleRoleChange = () => {
    toast.success(`Role changed to ${newRole.replace(/_/g, ' ')}`);
    setRoleDialogOpen(false);
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp}>
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-lg bg-primary/10">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground text-sm">Manage all registered users</p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <CardTitle className="text-lg">All Users ({filteredUsers.length})</CardTitle>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* Search */}
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-9 h-9 w-full sm:w-[200px]"
                  />
                </div>
                {/* Role Filter */}
                <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setCurrentPage(1); }}>
                  <SelectTrigger className="h-9 w-full sm:w-[140px]">
                    <SelectValue placeholder="Filter role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {ROLES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r.replace(/_/g, ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedUsers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center gap-3 pt-3 border-t"
              >
                <span className="text-sm text-muted-foreground">
                  {selectedUsers.length} selected
                </span>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  Export Selected
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs text-destructive hover:text-destructive">
                  Deactivate Selected
                </Button>
                <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setSelectedUsers([])}>
                  Clear
                </Button>
              </motion.div>
            )}
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-2 max-h-[520px] overflow-y-auto scrollbar-thin">
              {/* Header row for table-like layout */}
              <div className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b">
                <div className="w-5 flex items-center justify-center">
                  <Checkbox
                    checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                    onCheckedChange={handleSelectAll}
                    className="size-4"
                  />
                </div>
                <div className="w-10">Avatar</div>
                <div className="flex-1 min-w-0">User</div>
                <div className="hidden sm:block w-20 text-right">Role</div>
                <div className="hidden md:block w-24 text-right">Status</div>
                <div className="w-8" />
              </div>

              {paginatedUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Users className="size-10 mb-3 opacity-30" />
                  <p className="text-sm font-medium">No users found</p>
                  <p className="text-xs mt-1">Try adjusting your search or filter</p>
                </div>
              ) : (
                paginatedUsers.map((user) => {
                  const initials = user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase();
                  const isSelected = selectedUsers.includes(user.id);

                  return (
                    <div
                      key={user.id}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 group',
                        isSelected ? 'bg-primary/5 border-primary/20' : 'hover:bg-muted/50',
                      )}
                    >
                      {/* Checkbox */}
                      <div className="w-5 flex items-center justify-center">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleToggleSelect(user.id)}
                          className="size-4"
                        />
                      </div>

                      {/* Avatar with colored initials */}
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarFallback
                          className={cn(
                            'text-white text-sm font-bold',
                            avatarColors[user.role] || 'bg-primary/10 text-primary',
                          )}
                        >
                          {initials}
                        </AvatarFallback>
                      </Avatar>

                      {/* User info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold truncate">{user.name}</p>
                          {user.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{user.email} &middot; {user.phone}</p>
                      </div>

                      {/* Role Badge (clickable) */}
                      <button
                        onClick={() => handleRoleClick(user)}
                        className="hidden sm:block w-20 text-right"
                      >
                        <Badge
                          className={cn(
                            'text-xs cursor-pointer hover:opacity-80 transition-opacity',
                            roleColors[user.role] || '',
                          )}
                        >
                          {user.role.replace(/_/g, ' ')}
                        </Badge>
                      </button>

                      {/* Status */}
                      <div className="hidden md:flex w-24 justify-end">
                        <Badge
                          variant={user.isVerified ? 'default' : 'secondary'}
                          className={cn(
                            'text-xs',
                            user.isVerified
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-100'
                              : 'bg-muted text-muted-foreground hover:bg-muted',
                          )}
                        >
                          {user.isVerified ? 'Verified' : 'Pending'}
                        </Badge>
                      </div>

                      {/* More options */}
                      <button className="w-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="size-4 text-muted-foreground" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 mt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)} of {filteredUsers.length}
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      className={cn('h-8 w-8 p-0 text-xs', currentPage === page && 'pointer-events-none')}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Role Change Dialog */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Update the role for <span className="font-semibold text-foreground">{selectedUser?.name}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-muted/50">
              <Avatar className="h-10 w-10">
                <AvatarFallback className={cn('text-white text-sm font-bold', avatarColors[selectedUser?.role || 'PATIENT'] || 'bg-primary/10 text-primary')}>
                  {selectedUser?.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">{selectedUser?.name}</p>
                <p className="text-xs text-muted-foreground">{selectedUser?.email}</p>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">New Role</label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRoleChange} disabled={newRole === selectedUser?.role}>
              Update Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
