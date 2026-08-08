import React from 'react';
import { FilePlus, UserCheck, TrendingUp, Calendar } from 'lucide-react';
import type { Proposal, Thesis, Booking } from '@/types';

interface StudentStatCardsProps {
  myThesis: Thesis | undefined;
  myProposal: Proposal | undefined;
  verifiedCount: number;
  currentProgress: number;
  myBookings: Booking[];
}

export default function StudentStatCards({
  myThesis,
  myProposal,
  verifiedCount,
  currentProgress,
  myBookings,
}: StudentStatCardsProps) {
  const confirmedBookingsCount = myBookings.filter((b: Booking) => b.status === 'confirmed').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="student-stat-cards">
      {/* Card 1: Status Pengajuan Judul */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-3 text-left">
        <div className="flex items-center justify-between">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <FilePlus className="w-5.5 h-5.5" />
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              myThesis
                ? 'bg-emerald-100 text-emerald-800'
                : myProposal
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-gray-100 text-gray-700'
            }`}
          >
            {myThesis ? 'Disetujui' : myProposal ? 'Proses Review' : 'Belum Ada'}
          </span>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground">Status Judul</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5 truncate">
            {myThesis ? 'Judul Disetujui' : myProposal ? 'Ditinjau Kaprodi' : 'Belum Mengajukan'}
          </p>
        </div>
      </div>

      {/* Card 2: Dosen Pembimbing */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-3 text-left">
        <div className="flex items-center justify-between">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <UserCheck className="w-5.5 h-5.5" />
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              myThesis?.supervisorName ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {myThesis?.supervisorName ? 'Ditetapkan' : 'Belum Ada'}
          </span>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground">Dosen Pembimbing</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5 truncate">
            {myThesis?.supervisorName ? myThesis.supervisorName : 'Belum Ditentukan'}
          </p>
        </div>
      </div>

      {/* Card 3: Progress Bimbingan */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-3 text-left">
        <div className="flex items-center justify-between">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5.5 h-5.5" />
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
            {verifiedCount} Sesi
          </span>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground">Progress Bimbingan</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">{currentProgress}%</p>
        </div>
      </div>

      {/* Card 4: Janji Temu Bimbingan */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-3 text-left">
        <div className="flex items-center justify-between">
          <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Calendar className="w-5.5 h-5.5" />
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
            {myBookings.length} Total
          </span>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground">Janji Temu</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5 truncate">
            {confirmedBookingsCount} Disetujui Dosen
          </p>
        </div>
      </div>
    </div>
  );
}
