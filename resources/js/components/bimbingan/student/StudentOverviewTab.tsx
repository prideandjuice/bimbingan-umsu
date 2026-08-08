import React from 'react';
import { Link } from '@inertiajs/react';
import { FilePlus, Clock, CheckCircle2, BookOpen, ArrowRight } from 'lucide-react';
import type { AppUser, Proposal, Thesis, Booking } from '@/types';

import StudentWelcomeHeader from './StudentWelcomeHeader';
import StudentStatCards from './StudentStatCards';
import ThesisJourneyTimeline from './ThesisJourneyTimeline';
import AcademicGuidelineCard from './AcademicGuidelineCard';

interface StudentOverviewTabProps {
  currentUser: AppUser;
  myProposal: Proposal | undefined;
  myThesis: Thesis | undefined;
  verifiedCount: number;
  currentProgress: number;
  myBookings: Booking[];
}

export default function StudentOverviewTab({
  currentUser,
  myProposal,
  myThesis,
  verifiedCount,
  currentProgress,
  myBookings,
}: StudentOverviewTabProps) {
  return (
    <div className="space-y-6" id="student-overview-view">
      <StudentWelcomeHeader currentUser={currentUser} />

      {/* Stat Cards Grid */}
      <StudentStatCards
        myThesis={myThesis}
        myProposal={myProposal}
        verifiedCount={verifiedCount}
        currentProgress={currentProgress}
        myBookings={myBookings}
      />

      {/* Status Summary Banner & Embedded Timeline & Guidelines */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 text-left">
        {!myProposal && !myThesis && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-900 dark:text-white">Belum Mengajukan Judul</h3>
                  <p className="text-xs text-muted-foreground">Silakan ajukan draf proposal skripsi beserta 3 alternatif judul Anda.</p>
                </div>
              </div>
              <Link
                href="/mahasiswa/pengajuan-judul"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/10 shrink-0"
              >
                <FilePlus className="w-4 h-4" />
                <span>Formulir Pengajuan Judul</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {myProposal && !myThesis && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-900 dark:text-white">Proposal Judul Sedang Ditinjau</h3>
                  <p className="text-xs text-muted-foreground">Pengajuan draf proposal Anda telah diterima dan sedang diseleksi oleh Kaprodi.</p>
                </div>
              </div>
              <Link
                href="/mahasiswa/status-judul"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/10 shrink-0"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Detail Status Persetujuan</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {myThesis && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-900 dark:text-white">Judul Disetujui & Masa Bimbingan Aktif</h3>
                  <p className="text-xs text-muted-foreground">Judul: <strong>{myThesis.title}</strong></p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="/mahasiswa/log-bimbingan"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Log Bimbingan</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Embedded Timeline & Guideline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <ThesisJourneyTimeline />
          <AcademicGuidelineCard />
        </div>
      </div>
    </div>
  );
}
