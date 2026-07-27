// components/bimbingan/lecturer/LecturerSidebar.tsx
import { Link } from '@inertiajs/react';
import { UserCheck, Users, Calendar, Clock, Briefcase } from 'lucide-react';
import type { AppUser, Booking, Guidance, Thesis } from '@/types';

interface LecturerSidebarProps {
  currentUser: AppUser;
  activeTab: 'students' | 'scheduling' | 'bookings';
  myStudents: Thesis[];
  myBookings: Booking[];
  setSelectedThesisId: (id: string | null) => void;
  guidances?: Guidance[];
}

export default function LecturerSidebar({
  currentUser,
  activeTab,
  myStudents,
  myBookings,
  setSelectedThesisId,
  guidances = [],
}: LecturerSidebarProps) {
  const pendingBookingsCount = myBookings.filter((b) => b.status === 'pending').length;

  const studentThesisIds = myStudents.map((s) => s.id);
  const pendingFeedbackCount = guidances.filter(
    (g) => studentThesisIds.includes(g.thesisId) && g.status === 'pending_verification'
  ).length;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm h-fit space-y-6 text-left">
      {/* Profile Info Header */}
      <div className="flex items-center gap-3 pb-5 border-b border-gray-100 dark:border-zinc-800">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 shadow-xs">
          <UserCheck className="w-6 h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate">{currentUser.name}</h3>
          <p className="text-xs text-muted-foreground font-mono">NIDN: {currentUser.nidn || '0012345678'}</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold truncate mt-0.5">
            {currentUser.department || 'Magister Ilmu Komunikasi'}
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="space-y-1.5">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-3 mb-2">
          Portal Dosen Pembimbing
        </p>

        {/* Option 1: Mahasiswa Bimbingan */}
        <Link
          href="/dosen/mahasiswa-bimbingan"
          onClick={() => setSelectedThesisId(null)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'students'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
          }`}
        >
          <Users className="w-4.5 h-4.5" />
          <span>Mahasiswa Bimbingan</span>
          {pendingFeedbackCount > 0 && (
            <span
              className={`ml-auto font-bold text-[10px] px-2 py-0.5 rounded-full shadow-xs ${
                activeTab === 'students' ? 'bg-amber-500 text-white animate-pulse' : 'bg-amber-500 text-white'
              }`}
            >
              {pendingFeedbackCount}
            </span>
          )}
        </Link>

        {/* Option 2: Ketersediaan Waktu */}
        <Link
          href="/dosen/ketersediaan-waktu"
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'scheduling'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
          }`}
        >
          <Clock className="w-4.5 h-4.5" />
          <span>Ketersediaan Waktu</span>
        </Link>

        {/* Option 3: Persetujuan Jadwal */}
        <Link
          href="/dosen/persetujuan-jadwal"
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'bookings'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
          }`}
        >
          <Calendar className="w-4.5 h-4.5" />
          <span>Persetujuan Jadwal</span>
          {pendingBookingsCount > 0 && (
            <span className="ml-auto bg-amber-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-full">
              {pendingBookingsCount}
            </span>
          )}
        </Link>
      </div>

      {/* Summary Box */}
      <div className="pt-4 border-t border-gray-100 dark:border-zinc-800">
        <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 p-4 rounded-2xl space-y-1">
          <p className="text-[11px] font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
            Bimbingan Aktif
          </p>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {myStudents.length} Mahasiswa Bimbingan terdaftar dalam sistem.
          </p>
        </div>
      </div>
    </div>
  );
}