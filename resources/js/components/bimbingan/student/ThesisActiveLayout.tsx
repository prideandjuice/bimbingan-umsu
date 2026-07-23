import { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  UserCheck,
  FileText,
  Calendar,
  History as HistoryIcon,
  BookOpen,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import type { AppUser, Thesis, Guidance, Booking, EventType, AvailabilityRule, Proposal } from '@/types';

interface ThesisActiveLayoutProps {
  currentUser: AppUser;
  myThesis: Thesis;
  proposals: Proposal[];
  myGuidances: Guidance[];
  myBookings: Booking[];
  mySupervisorEventTypes: EventType[];
  mySupervisorAvailability: AvailabilityRule[];
  currentProgress: number;
  handleSubmitGuidance: (date: string, notes: string, revisions: string, progress: number) => void;
  handleBookMeeting: (eventTypeId: string, date: string, slot: string, notes: string) => void;
}

export default function ThesisActiveLayout({
  currentUser,
  myThesis,
  proposals,
  myGuidances,
  myBookings,
  mySupervisorEventTypes,
  mySupervisorAvailability,
  currentProgress,
  handleSubmitGuidance,
  handleBookMeeting,
}: ThesisActiveLayoutProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'guidances' | 'bookings'>('info');

  // Track mana sesi bimbingan yang di-expand detailnya (default: opsi pertama)
  const [expandedGuidanceId, setExpandedGuidanceId] = useState<string | null>(myGuidances[0]?.id || null);

  const toggleGuidanceDetail = (id: string) => {
    setExpandedGuidanceId(prev => (prev === id ? null : id));
  };

  // Mencari proposal induk untuk mendapatkan rincian abstrak asal
  const parentProposal = proposals.find(p => p.id === myThesis.proposalId);

  return (
    <div className="lg:col-span-8 space-y-6">
      {/* 1. Header Banner Judul Disetujui */}
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white rounded-3xl p-6 md:p-8 shadow-lg shadow-emerald-900/10 relative overflow-hidden text-left">
        {/* Pattern Background Accent */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-1/3 -top-10 w-32 h-32 bg-emerald-400/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/30 backdrop-blur-md border border-emerald-300/30 text-emerald-100 text-xs font-semibold px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Judul Skripsi Disetujui
            </span>

            <span className="text-xs font-medium text-emerald-100/90">
              Disetujui pada {new Date(myThesis.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-bold leading-snug tracking-tight text-white">
              {myThesis.title}
            </h2>
            <p className="text-xs md:text-sm text-emerald-100/80 mt-1 font-light">
              Program Studi: <strong className="font-semibold text-white">{myThesis.department}</strong>
            </p>
          </div>

          {/* Supervisor Status Bar */}
          <div className="pt-2 border-t border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <p className="text-[11px] text-emerald-200/80 uppercase font-semibold tracking-wider">Dosen Pembimbing</p>
                <p className="text-xs md:text-sm font-bold text-white">
                  {myThesis.supervisorName ? myThesis.supervisorName : 'Prof. Dr. Irwan, M.Si'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              {myThesis.skFile && (
                <a
                  href={`/${myThesis.skFile}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold bg-white text-emerald-900 hover:bg-emerald-50 px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                  title="Unduh SK Bimbingan Resmi"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-700" />
                  <span>SK: <strong>{myThesis.skFile.split('/').pop()}</strong></span>
                </a>
              )}
              <span className="text-xs font-medium bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm text-emerald-100 border border-white/10">
                Progress: <strong className="text-white font-bold">{currentProgress}%</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sub Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-100 dark:border-zinc-800 pb-1 text-left">
        <button
          onClick={() => setActiveTab('info')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'info'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Detail Judul & Latar Belakang
        </button>

        <button
          onClick={() => setActiveTab('guidances')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'guidances'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
          }`}
        >
          <HistoryIcon className="w-4 h-4" />
          Log Bimbingan ({myGuidances.length})
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'bookings'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Janji Temu ({myBookings.length})
        </button>
      </div>

      {/* TAB 1: Detail Judul & Latar Belakang yang Disetujui */}
      {activeTab === 'info' && (
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 text-left">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-4">
            <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              Latar Belakang & Alasan Pengajuan Judul
            </h3>
            <span className="text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full inline-flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Disetujui Kaprodi
            </span>
          </div>

          {/* Latar Belakang Detail */}
          <div className="bg-emerald-50/40 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 p-5 rounded-2xl space-y-3">
            <p className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
              Deskripsi Latar Belakang / Abstrak Proposal:
            </p>
            <div 
              className="text-xs md:text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-normal ql-editor p-0 min-h-0 border-none select-text"
              dangerouslySetInnerHTML={{ __html: parentProposal?.abstract || 'Latar belakang proposal ini telah diverifikasi dan disetujui oleh Ketua Program Studi.' }}
            />
          </div>

          {/* Informasi Pembimbing & Tahap Berikutnya */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-gray-50 dark:bg-zinc-800/40 border border-gray-200/70 dark:border-zinc-800 p-5 rounded-2xl space-y-2">
              <h4 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                Status Dosen Pembimbing
              </h4>
              <p className="text-xs text-muted-foreground leading-normal">
                Dosen pembimbing Anda adalah <strong>{myThesis.supervisorName || 'Prof. Dr. Irwan, M.Si'}</strong>. Anda dapat melihat riwayat bimbingan pada tab Log Bimbingan.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-zinc-800/40 border border-gray-200/70 dark:border-zinc-800 p-5 rounded-2xl space-y-2">
              <h4 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Langkah Selanjutnya
              </h4>
              <p className="text-xs text-muted-foreground leading-normal">
                Lakukan pertemuan bimbingan secara berkala dengan Dosen Pembimbing Anda. Setiap poin pembahasan dan revisi akan diverifikasi oleh dosen.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Log Bimbingan */}
      {activeTab === 'guidances' && (
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 text-left">
          <div className="border-b border-gray-100 dark:border-zinc-800 pb-4">
            <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
              <HistoryIcon className="w-5 h-5 text-emerald-600" />
              Catatan Bimbingan Skripsi
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Lembar catatan hasil konsultasi bimbingan yang diverifikasi oleh Dosen Pembimbing. Klik sesi untuk melihat rincian detail.
            </p>
          </div>

          {/* List Log Bimbingan */}
          <div className="space-y-3">
            {myGuidances.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl space-y-2">
                <HistoryIcon className="w-8 h-8 text-muted-foreground mx-auto" />
                <p className="text-xs text-muted-foreground font-medium">Belum ada riwayat bimbingan yang dicatat.</p>
                <p className="text-[11px] text-muted-foreground">Catatan bimbingan akan ditambahkan oleh Dosen Pembimbing setelah sesi bimbingan.</p>
              </div>
            ) : (
              myGuidances.map((g, idx) => {
                const sessionNum = myGuidances.length - idx;
                const isExpanded = expandedGuidanceId === g.id;

                return (
                  <div
                    key={g.id || idx}
                    className={`bg-white dark:bg-zinc-900 border transition-all rounded-2xl overflow-hidden shadow-2xs ${
                      isExpanded
                        ? 'border-emerald-500 dark:border-emerald-600 ring-2 ring-emerald-500/10'
                        : 'border-gray-200/80 dark:border-zinc-800 hover:border-emerald-300 dark:hover:border-emerald-700'
                    }`}
                  >
                    {/* Header Baris Sesi Bimbingan (Clickable) */}
                    <div
                      onClick={() => toggleGuidanceDetail(g.id)}
                      className="p-4 md:p-5 flex items-center justify-between gap-4 cursor-pointer select-none group"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0">
                          #{sessionNum}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs md:text-sm text-gray-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                            Sesi Bimbingan #{sessionNum}
                          </h4>
                          <p className="text-[11px] text-muted-foreground mt-0.5 font-light">
                            {new Date(g.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                          g.status === 'verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {g.status === 'verified' ? '✓ Diverifikasi Dosen' : '⏳ Menunggu Verifikasi'}
                        </span>

                        <div className="p-1 rounded-lg text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    {/* Detail Rincian Sesi Bimbingan (Expanded) */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-3 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/20 space-y-4 text-xs">
                        {/* Meta Ringkasan */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white dark:bg-zinc-900 p-3 rounded-xl border border-gray-100 dark:border-zinc-800">
                          <div>
                            <span className="text-[10px] text-muted-foreground block font-light">Tanggal Konsultasi:</span>
                            <span className="font-bold text-gray-800 dark:text-gray-200">
                              {new Date(g.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-muted-foreground block font-light">Dosen Evaluator:</span>
                            <span className="font-bold text-gray-800 dark:text-gray-200">
                              {myThesis.supervisorName || 'Prof. Dr. Irwan, M.Si'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-muted-foreground block font-light">Progress Ditetapkan:</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                              {g.progress}%
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-muted-foreground block font-light">Dicatat Oleh:</span>
                            <span className="font-bold text-gray-800 dark:text-gray-200">
                              {g.creatorName || 'Dosen Pembimbing'}
                            </span>
                          </div>
                        </div>

                        {/* Catatan Poin Pembahasan */}
                        <div className="space-y-1.5">
                          <p className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-emerald-600" />
                            Catatan Pembahasan / Feedback Konsultasi:
                          </p>
                          <div className="bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 p-4 rounded-xl">
                            <p className="text-gray-800 dark:text-gray-200 leading-relaxed font-normal whitespace-pre-line">
                              {g.notes}
                            </p>
                          </div>
                        </div>

                        {/* Poin Revisi / Perbaikan */}
                        <div className="space-y-1.5">
                          <p className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            Poin Perbaikan / Tugas Revisi dari Dosen:
                          </p>
                          <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 p-4 rounded-xl text-amber-900 dark:text-amber-200">
                            <p className="leading-relaxed font-normal whitespace-pre-line">
                              {g.revisions || 'Tidak ada catatan revisi pada sesi bimbingan ini.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Janji Temu Bimbingan */}
      {activeTab === 'bookings' && (
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 text-left">
          <div className="border-b border-gray-100 dark:border-zinc-800 pb-4">
            <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              Janji Temu Konsultasi
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Jadwalkan sesi tatap muka atau konsultasi online dengan Dosen Pembimbing Anda.
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Jadwal ketersediaan bimbingan dosen pembimbing Anda (<strong>{myThesis.supervisorName || 'Prof. Dr. Irwan, M.Si'}</strong>) akan tampil di sini.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}