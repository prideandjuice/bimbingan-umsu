// components/bimbingan/student/StudentSidebarNav.tsx
import { Link } from '@inertiajs/react';
import {
  LayoutGrid,
  FilePlus,
  Clock,
  BookOpen,
  Calendar,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import type { AppUser, Proposal, Thesis, Guidance, Booking } from '@/types';

interface StudentSidebarNavProps {
  currentUser: AppUser;
  activeTab: 'overview' | 'pengajuan-judul' | 'status-judul' | 'log-bimbingan' | 'booking-jadwal';
  myProposal?: Proposal;
  myThesis?: Thesis;
  myGuidances: Guidance[];
  myBookings: Booking[];
}

export default function StudentSidebarNav({
  currentUser,
  activeTab,
  myProposal,
  myThesis,
  myGuidances,
  myBookings,
}: StudentSidebarNavProps) {
  const verifiedGuidancesCount = myGuidances.filter((g) => g.status === 'verified').length;
  const activeBookingsCount = myBookings.filter((b) => b.status === 'confirmed' || b.status === 'pending').length;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-6 text-left h-fit">
      {/* 1. Header Profile Mahasiswa */}
      <div className="flex items-center gap-3 pb-5 border-b border-gray-100 dark:border-zinc-800">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 shadow-xs">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate">{currentUser.name}</h3>
          <p className="text-xs text-muted-foreground font-mono">NPM: {currentUser.npm || '2210000001'}</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold truncate mt-0.5">
            {currentUser.department || 'Magister Ilmu Komunikasi'}
          </p>
        </div>
      </div>

      {/* 2. Menu Samping Navigation */}
      <div className="space-y-1.5">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-3 mb-2">
          Akademik Mahasiswa
        </p>

        {/* Option 1: Overview Dashboard */}
        <Link
          href="/dashboard"
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'overview'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
            }`}
        >
          <LayoutGrid className="w-4.5 h-4.5" />
          <span>Dashboard Utama</span>
        </Link>

        {/* Option 2: Pengajuan Judul */}
        <Link
          href="/mahasiswa/pengajuan-judul"
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'pengajuan-judul'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
            }`}
        >
          <FilePlus className="w-4.5 h-4.5" />
          <span>Pengajuan Judul</span>
        </Link>

        {/* Option 3: Status Persetujuan */}
        <Link
          href="/mahasiswa/status-judul"
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'status-judul'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
            }`}
        >
          <Clock className="w-4.5 h-4.5" />
          <span>Status Persetujuan</span>
          {myProposal && !myThesis && (
            <span className="ml-auto text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">
              Ditinjau
            </span>
          )}
          {myThesis && (
            <CheckCircle2 className="w-4 h-4 ml-auto text-emerald-500" />
          )}
        </Link>

        {/* Option 4: Log Bimbingan */}
        <Link
          href="/mahasiswa/log-bimbingan"
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'log-bimbingan'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
            }`}
        >
          <BookOpen className="w-4.5 h-4.5" />
          <span>Log Bimbingan</span>
          {verifiedGuidancesCount > 0 && (
            <span className="ml-auto text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
              {verifiedGuidancesCount}
            </span>
          )}
        </Link>

        {/* Option 5: Booking Jadwal */}
        <Link
          href="/mahasiswa/booking-jadwal"
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'booking-jadwal'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
            }`}
        >
          <Calendar className="w-4.5 h-4.5" />
          <span>Booking Jadwal</span>
          {activeBookingsCount > 0 && (
            <span className="ml-auto text-[10px] bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full font-bold">
              {activeBookingsCount}
            </span>
          )}
        </Link>
      </div>

      {/* Status Alert Box */}
      <div className="pt-4 border-t border-gray-100 dark:border-zinc-800">
        <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 p-4 rounded-2xl space-y-1.5">
          <p className="text-[11px] font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Status Akademik
          </p>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {myThesis
              ? 'Masa Bimbingan Aktif bersama Dosen Pembimbing.'
              : myProposal
                ? 'Draf proposal sedang diverifikasi oleh Kaprodi.'
                : 'Silakan isi formulir Pengajuan Judul Skripsi.'}
          </p>
        </div>
      </div>
    </div>
  );
}
