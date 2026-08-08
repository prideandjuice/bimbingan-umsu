import { useState, useEffect, useMemo } from 'react';
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
  Globe,
  ExternalLink,
  Link as LinkIcon,
  ArrowLeft,
  Send,
  X,
  Paperclip,
  PenTool,
  Eye,
  Lock,
} from 'lucide-react';
import type { AppUser, Thesis, Guidance, Booking, EventType, AvailabilityRule, Proposal } from '@/types';
import { DB } from '@/db';
import RichTextDisplay from '../RichTextDisplay';
import CalComBookingView from './CalComBookingView';
import PdfAnnotatorModal from '../PdfAnnotatorModal';
import { toast } from 'sonner';
import echo from '@/echo';

const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const getAnnotationCount = (annotations: any): number => {
  if (!annotations) return 0;
  if (typeof annotations === 'string') {
    try { annotations = JSON.parse(annotations); } catch { return 0; }
  }
  if (Array.isArray(annotations)) return annotations.length;
  if (typeof annotations === 'object' && annotations !== null) {
    return Object.values(annotations).reduce((sum: number, page: any) => {
      if (!page || typeof page !== 'object') return sum;
      return (
        sum +
        (Array.isArray(page.drawings) ? page.drawings.length : 0) +
        (Array.isArray(page.pins) ? page.pins.length : 0) +
        (Array.isArray(page.texts) ? page.texts.length : 0) +
        (Array.isArray(page.rectangles) ? page.rectangles.length : 0) +
        (Array.isArray(page.checkmarks) ? page.checkmarks.length : 0) +
        (Array.isArray(page.crosses) ? page.crosses.length : 0)
      );
    }, 0);
  }
  return 0;
};

const formatDisplayDateWithDay = (dateStr?: string): string => {
  if (!dateStr) return '-';
  try {
    const cleanDate = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
    const parts = cleanDate.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);

      const dateObj = new Date(year, month, day);
      const dayNamesFull = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

      const dayName = dayNamesFull[dateObj.getDay()];
      const monthName = monthNamesShort[month];

      return `${dayName}, ${day} ${monthName} ${year}`;
    }
  } catch (e) {
    // fallback
  }
  return dateStr;
};

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
  handleBookMeeting: (eventTypeId: string, date: string, slot: string, notes: string, draftFileInput?: File | string | null) => void;
  handleCancelBooking?: (bookingId: string) => void;
  initialTab?: 'info' | 'guidances' | 'bookings';
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
  handleCancelBooking,
  initialTab = 'info',
}: ThesisActiveLayoutProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'guidances' | 'bookings'>(initialTab);
  const [selectedBookingEventType, setSelectedBookingEventType] = useState<EventType | null>(null);
  const [selectedBookingDetail, setSelectedBookingDetail] = useState<Booking | null>(null);
  const [annotatorBooking, setAnnotatorBooking] = useState<Booking | null>(null);
  const [annotatorGuidance, setAnnotatorGuidance] = useState<Guidance | null>(null);


  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Real-time Echo Listener for PDF Annotations from Lecturer
  useEffect(() => {
    const echoInstance = echo;
    if (!echoInstance || !myBookings || myBookings.length === 0) return;

    const subscriptions: string[] = [];
    myBookings.forEach((b) => {
      if (!b.id) return;
      const cleanId = String(b.id).replace(/^booking-/, '');
      try {
        const channel = echoInstance.private(`booking.${cleanId}`);
        channel.listen('.PdfAnnotationUpdated', (e: any) => {
          if (e && e.annotations) {
            toast.success(
              `Revisi PDF Baru! ${e.updatedBy || 'Dosen Pembimbing'} baru saja memperbarui coretan/catatan pada draft skripsi Anda.`,
              { duration: 2000 }
            );

            // Sync to local DB
            const allBookings = DB.getBookings();
            const updatedBookings = allBookings.map((item) =>
              String(item.id) === String(b.id) ? { ...item, annotations: e.annotations } : item
            );
            DB.saveBookings(updatedBookings);
            window.dispatchEvent(new Event('storage'));
          }
        });
        subscriptions.push(cleanId);
      } catch (err) {
        console.warn('Echo subscription warning:', err);
      }
    });

    return () => {
      subscriptions.forEach((cleanId) => {
        try {
          echoInstance?.leave(`booking.${cleanId}`);
        } catch (e) { }
      });
    };
  }, [myBookings]);

  // Track mana sesi bimbingan yang di-expand detailnya (default: opsi pertama)
  const [expandedGuidanceId, setExpandedGuidanceId] = useState<string | null>(myGuidances[0]?.id || null);

  // Booking Modal State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState<AvailabilityRule | null>(null);
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookingNotes, setBookingNotes] = useState('');
  const [removedBookingIds, setRemovedBookingIds] = useState<string[]>([]);

  const visibleBookings = myBookings.filter((b) => !removedBookingIds.includes(b.id));

  const activeBookingObj = useMemo(() => {
    const list = myBookings && myBookings.length > 0 ? myBookings : visibleBookings;
    return list.find(
      (b) =>
        b &&
        b.status !== 'completed' &&
        b.status !== 'rejected' &&
        b.status !== 'cancelled'
    );
  }, [myBookings, visibleBookings]);

  const hasActiveBooking = Boolean(activeBookingObj);

  const handleDeleteBookingItem = (id: string) => {
    setRemovedBookingIds((prev) => [...prev, id]);
    if (handleCancelBooking) {
      handleCancelBooking(id);
    }
  };

  const toggleGuidanceDetail = (id: string) => {
    setExpandedGuidanceId((prev) => (prev === id ? null : id));
  };

  // Mencari proposal induk untuk mendapatkan rincian abstrak asal
  const parentProposal = proposals.find((p) => p.id === myThesis.proposalId);

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
              Disetujui pada {new Date(myThesis.createdAt || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
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
                  {myThesis.supervisorName ? myThesis.supervisorName : 'Belum Ditentukan'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
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
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'info'
            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
            }`}
        >
          <BookOpen className="w-4 h-4" />
          Detail Judul & Latar Belakang
        </button>

        <button
          onClick={() => setActiveTab('guidances')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'guidances'
            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
            }`}
        >
          <HistoryIcon className="w-4 h-4" />
          Log Bimbingan ({myGuidances.length})
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'bookings'
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
            <RichTextDisplay
              content={parentProposal?.abstract}
              fallback="Latar belakang proposal ini telah diverifikasi dan disetujui oleh Ketua Program Studi."
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
                Dosen pembimbing Anda adalah <strong>{myThesis.supervisorName || 'Belum Ditentukan'}</strong>. Anda dapat melihat riwayat bimbingan pada tab Log Bimbingan.
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
                    className={`bg-white dark:bg-zinc-900 border transition-all rounded-2xl overflow-hidden shadow-2xs ${isExpanded
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
                        <span
                          className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${g.status === 'verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}
                        >
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
                              {myThesis.supervisorName || 'Belum Ditentukan'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-muted-foreground block font-light">Progress Ditetapkan:</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">{g.progress}%</span>
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

                        {/* File Draft Skripsi & Hasil Coretan Revisi Dosen */}
                        {g.draftFileName && (
                          <div className="space-y-1.5 pt-1">
                            <p className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                              <Paperclip className="w-3.5 h-3.5 text-emerald-600" />
                              File Draft Skripsi & Hasil Coretan Revisi Dosen:
                            </p>
                            <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 p-3.5 rounded-xl flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2 overflow-hidden">
                                <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                                  {g.draftFileName}
                                </span>
                              </div>

                              {(() => {
                                let freshGuidance: Guidance = g;
                                try {
                                  freshGuidance = DB.getGuidances().find((item) => String(item.id) === String(g.id)) || g;
                                } catch (e) { }
                                const annos = freshGuidance.annotations || (freshGuidance as any).metadata?.annotations || g.annotations || (g as any).metadata?.annotations;
                                const count = getAnnotationCount(annos);

                                const handleOpenViewModal = (e: React.MouseEvent) => {
                                  e.stopPropagation();
                                  let latest: Guidance = g;
                                  try {
                                    latest = DB.getGuidances().find((item) => String(item.id) === String(g.id)) || g;
                                  } catch (err) { }
                                  setAnnotatorGuidance(latest);
                                };

                                if (count > 0) {
                                  return (
                                    <button
                                      type="button"
                                      onClick={handleOpenViewModal}
                                      className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition-all shrink-0 shadow-2xs flex items-center gap-1.5 cursor-pointer"
                                    >
                                      <PenTool className="w-3.5 h-3.5" />
                                      <span>Coretan Dosen ({count})</span>
                                    </button>
                                  );
                                }

                                return (
                                  <button
                                    type="button"
                                    onClick={handleOpenViewModal}
                                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shrink-0 shadow-2xs flex items-center gap-1.5 cursor-pointer"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>Lihat Draft & Coretan</span>
                                  </button>
                                );
                              })()}
                            </div>
                          </div>
                        )}
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
        <div className="space-y-8 text-left">
          {selectedBookingEventType === null ? (
            <div className="space-y-8">
              {/* SECTION 1: PILIH JENIS SESI BIMBINGAN DOSEN */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-emerald-600" />
                      Pilih Jenis Sesi Bimbingan Dosen
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Silakan pilih salah satu opsi jenis bimbingan di bawah ini untuk membuka kalender ketersediaan jam dan mengajukan janji temu baru.
                    </p>
                  </div>
                </div>

                {hasActiveBooking && activeBookingObj && (
                  <div className="bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/50 rounded-3xl p-5 flex items-start gap-4 text-left shadow-2xs animate-in fade-in duration-200">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-extrabold text-sm text-amber-950 dark:text-amber-200">
                          Pendaftaran Janji Temu Baru Dikunci
                        </h4>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-200/90 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 capitalize">
                          Status: {activeBookingObj.status === 'pending' ? 'Menunggu Konfirmasi Dosen' : 'Disetujui Dosen'}
                        </span>
                      </div>
                      <p className="text-xs text-amber-900/80 dark:text-amber-300/90 leading-relaxed font-medium">
                        Anda saat ini sudah memiliki pengajuan janji temu bimbingan aktif ({activeBookingObj.date} | {activeBookingObj.timeSlot}). Pengajuan janji temu baru dikunci hingga Dosen Pembimbing menandai sesi bimbingan ini <strong>Selesai</strong> dan mencatatnya ke logbook.
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {mySupervisorEventTypes && mySupervisorEventTypes.length > 0 ? (
                    mySupervisorEventTypes.map((et: any) => (
                      <div
                        key={et.id}
                        className={`bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 shadow-2xs transition-all space-y-3.5 text-left ${hasActiveBooking ? 'opacity-75' : 'hover:shadow-md'
                          }`}
                      >
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                          <div>
                            <h3
                              onClick={() => {
                                if (hasActiveBooking) {
                                  toast.warning('Anda masih memiliki janji temu bimbingan aktif yang belum diselesaikan dosen.');
                                  return;
                                }
                                window.location.href = `/bimbingan/${et.slug || 'bimbingan-judul'}?authenticated=1`;
                              }}
                              className={`font-extrabold text-base text-gray-900 dark:text-white transition-colors ${hasActiveBooking ? 'cursor-not-allowed opacity-80' : 'hover:text-emerald-600 cursor-pointer'
                                }`}
                            >
                              {et.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <a
                                href={`/bimbingan/${et.slug || 'bimbingan-judul'}?authenticated=1`}
                                className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 hover:underline font-medium flex items-center gap-1 cursor-pointer transition-all"
                                title="Klik untuk membuka halaman booking jenis sesi ini"
                              >
                                <Globe className="w-3.5 h-3.5" />
                                <span>/bimbingan/{et.slug || 'bimbingan-judul'}</span>
                                <ExternalLink className="w-3.5 h-3.5 text-emerald-500" />
                              </a>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 px-3 py-1 rounded-full shrink-0">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{et.duration || 30} Min</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed pt-1">
                          {et.description ||
                            'Wajib janji temu (appointment) H-1. Jangan mendadak datang ke ruangan ya, supaya saya bisa mengalokasikan waktu yang cukup buat membedah draf kamu tanpa terburu-buru jadwal mengajar.'}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-zinc-800 flex-wrap gap-3">
                          <a
                            href={hasActiveBooking ? undefined : `/bimbingan/${et.slug || 'bimbingan-judul'}?authenticated=1`}
                            onClick={(e) => {
                              if (hasActiveBooking) {
                                e.preventDefault();
                                toast.warning('Pendaftaran dikunci! Anda masih memiliki janji temu bimbingan aktif yang belum diselesaikan dosen.');
                              }
                            }}
                            className={
                              hasActiveBooking
                                ? 'bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 border border-gray-200 dark:border-zinc-700 px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 cursor-not-allowed shadow-2xs opacity-75'
                                : 'bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-600 hover:text-white text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs group'
                            }
                          >
                            {hasActiveBooking ? (
                              <>
                                <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                                <span className="text-amber-800 dark:text-amber-300 font-extrabold">Sudah Ada Janji Temu Aktif</span>
                              </>
                            ) : (
                              <>
                                <LinkIcon className="w-3.5 h-3.5 text-emerald-600 group-hover:text-white" />
                                <span>Pilih Sesi Ini dan Ambil Jadwal</span>
                              </>
                            )}
                          </a>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center bg-gray-50 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-800 rounded-3xl space-y-2">
                      <Calendar className="w-8 h-8 text-muted-foreground mx-auto opacity-50" />
                      <p className="text-xs font-bold text-gray-700 dark:text-gray-300">Belum Ada Jenis Sesi Bimbingan</p>
                      <p className="text-[11px] text-muted-foreground">Dosen pembimbing Anda belum menambahkan jenis sesi bimbingan.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 2: RIWAYAT & STATUS JANJI TEMU BIMBINGAN SAYA */}
              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-emerald-600" />
                      Riwayat Pengajuan Janji Temu Saya
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Daftar janji temu bimbingan yang telah Anda ajukan dari link dosen maupun dari kalender.
                    </p>
                  </div>
                  <span className="px-3.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 rounded-full text-xs font-extrabold font-mono">
                    {myBookings?.length || 0} Booking
                  </span>
                </div>

                {myBookings && myBookings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myBookings.map((b) => {
                      const linkedEventType = mySupervisorEventTypes?.find((et) => String(et.id) === String(b.eventTypeId));
                      const sessionName = linkedEventType?.name || 'Bimbingan Tatap Muka (Offline di Kampus)';
                      const duration = linkedEventType?.duration || 30;
                      const slugText = linkedEventType?.slug || 'bimbingan-tatap-muka-offline-di-kampus';

                      let statusBadge = (
                        <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60 flex items-center gap-1.5 shrink-0">
                          <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
                          Menunggu Persetujuan
                        </span>
                      );

                      if (b.status === 'approved') {
                        statusBadge = (
                          <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center gap-1.5 shrink-0">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Disetujui Dosen
                          </span>
                        );
                      } else if (b.status === 'rejected') {
                        statusBadge = (
                          <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border border-red-200/80 dark:border-red-800/60 flex items-center gap-1.5 shrink-0">
                            <X className="w-3 h-3 text-red-600" />
                            Ditolak
                          </span>
                        );
                      } else if (b.status === 'completed') {
                        statusBadge = (
                          <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60 flex items-center gap-1.5 shrink-0">
                            <CheckCircle2 className="w-3 h-3 text-blue-600" />
                            Selesai
                          </span>
                        );
                      }

                      return (
                        <div
                          key={b.id}
                          onClick={() => setSelectedBookingDetail(b)}
                          className="bg-white dark:bg-zinc-900 border border-gray-200/90 dark:border-zinc-800 rounded-3xl p-5 shadow-2xs hover:shadow-md transition-all space-y-3.5 text-left cursor-pointer hover:border-emerald-300 group"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h4 className="font-extrabold text-sm text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                                {sessionName}
                              </h4>
                              <a
                                href={`/bimbingan/detail/${b.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 hover:underline transition-all mt-0.5"
                                title="Klik untuk membuka halaman detail janji temu ini di tab baru"
                              >
                                <Globe className="w-3 h-3" />
                                <span>/bimbingan/detail/{b.id}</span>
                                <ExternalLink className="w-3 h-3 text-emerald-500" />
                              </a>
                            </div>
                            <div className="flex items-center gap-1 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 px-2.5 py-1 rounded-full shrink-0">
                              <Clock className="w-3 h-3" />
                              <span>{duration} Min</span>
                            </div>
                          </div>

                          <div className="bg-gray-50/80 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 rounded-2xl p-3 space-y-1.5 text-xs font-medium">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Waktu Sesi:</span>
                              <span className="font-extrabold text-gray-900 dark:text-white font-mono">
                                {formatDisplayDateWithDay(b.date)} | {b.timeSlot || '08:00 WIB'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Dosen Pembimbing:</span>
                              <span className="font-bold text-emerald-800 dark:text-emerald-300">
                                {myThesis?.supervisorName || 'Dosen Pembimbing'}
                              </span>
                            </div>
                            {b.draftFileName && (
                              <div className="flex items-center justify-between pt-2 border-t border-gray-200/60 dark:border-zinc-800/60 text-[11px] gap-2">
                                <span className="text-muted-foreground flex items-center gap-1 font-semibold truncate">
                                  <Paperclip className="w-3 h-3 text-emerald-600 shrink-0" />
                                  <span className="truncate max-w-[120px]">{b.draftFileName}</span>
                                </span>
                                {(() => {
                                  let freshBooking: Booking = b;
                                  try {
                                    freshBooking = DB.getBookings().find((item) => String(item.id) === String(b.id)) || b;
                                  } catch (e) { }
                                  const count = getAnnotationCount(freshBooking.annotations || b.annotations);

                                  const handleOpenViewModal = (e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    let latest: Booking = b;
                                    try {
                                      latest = DB.getBookings().find((item) => String(item.id) === String(b.id)) || b;
                                    } catch (err) { }
                                    setAnnotatorBooking(latest);
                                  };

                                  if (count > 0) {
                                    return (
                                      <button
                                        onClick={handleOpenViewModal}
                                        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-[10px] font-bold transition-all shrink-0 shadow-2xs flex items-center gap-1 cursor-pointer"
                                      >
                                        <PenTool className="w-3 h-3" />
                                        <span>Coretan Dosen ({count})</span>
                                      </button>
                                    );
                                  }

                                  return (
                                    <button
                                      onClick={handleOpenViewModal}
                                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold transition-all shrink-0 shadow-2xs flex items-center gap-1 cursor-pointer"
                                    >
                                      <FileText className="w-3 h-3" />
                                      <span>Buka PDF</span>
                                    </button>
                                  );
                                })()}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
                            {statusBadge}
                            <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 group-hover:underline inline-flex items-center gap-1">
                              <span>Detail Booking</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-zinc-900/50 border border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl p-6 text-center space-y-2">
                    <Calendar className="w-8 h-8 text-emerald-500 mx-auto" />
                    <p className="font-bold text-xs text-gray-900 dark:text-white">Belum Ada Janji Temu Berjalan</p>
                    <p className="text-xs text-muted-foreground">Silakan pilih jenis sesi bimbingan di atas untuk mengajukan janji temu dengan Dosen.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setSelectedBookingEventType(null)}
                className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Pilihan Jenis Bimbingan</span>
              </button>

              <CalComBookingView
                myThesis={myThesis}
                availabilityRules={mySupervisorAvailability}
                eventType={selectedBookingEventType}
                myBookings={myBookings}
                onBookMeeting={(date, timeSlot, notes, draftFile) => {
                  handleBookMeeting(selectedBookingEventType.id || 'default-session', date, timeSlot, notes, draftFile);
                  toast.success(
                    `Pengajuan janji temu bimbingan (${selectedBookingEventType.name}) pada tanggal ${date} (${timeSlot}) berhasil dikirim!`
                  );
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* MODAL DETAIL BOOKING MAHASISWA */}
      {selectedBookingDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200 text-left">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-gray-900 dark:text-white">
                    Detail Janji Temu Bimbingan
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Informasi lengkap pengajuan bimbingan Anda.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBookingDetail(null)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 hover:text-gray-600 transition-all cursor-pointer font-bold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-900/50 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between font-bold text-gray-900 dark:text-white">
                  <span className="text-muted-foreground">Status Janji Temu:</span>
                  <span className="capitalize font-extrabold text-emerald-800 dark:text-emerald-300">
                    {selectedBookingDetail.status === 'pending' ? '⏳ Menunggu Persetujuan Dosen' : selectedBookingDetail.status === 'approved' ? '✓ Disetujui Dosen' : selectedBookingDetail.status === 'rejected' ? '✕ Ditolak Dosen' : 'Selesai'}
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">Dosen Pembimbing:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{myThesis?.supervisorName || 'Dosen Pembimbing'}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">Waktu Sesi:</span>
                  <span className="font-extrabold text-emerald-700 dark:text-emerald-400 font-mono">{formatDisplayDateWithDay(selectedBookingDetail.date)} | {selectedBookingDetail.timeSlot}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Topik & Catatan Pengajuan:
                </label>
                <div className="bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-800 rounded-xl p-3 font-medium text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
                  {selectedBookingDetail.notes || 'Konsultasi bimbingan skripsi'}
                </div>
              </div>

              {selectedBookingDetail.draftFileName && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Berkas Draft Skripsi Diunggah:
                  </label>
                  <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-xl p-3 flex items-center justify-between gap-2 text-emerald-900 dark:text-emerald-200 font-extrabold text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate">{selectedBookingDetail.draftFileName}</span>
                    </div>
                    {(() => {
                      let fresh: Booking = selectedBookingDetail;
                      try {
                        fresh = DB.getBookings().find((item: Booking) => String(item.id) === String(selectedBookingDetail.id)) || selectedBookingDetail;
                      } catch (e) {
                        // fallback
                      }
                      let annos = fresh.annotations || selectedBookingDetail.annotations;
                      if (typeof annos === 'string') {
                        try { annos = JSON.parse(annos); } catch { }
                      }
                      let count = 0;
                      if (annos) {
                        if (Array.isArray(annos)) {
                          count = annos.length;
                        } else if (typeof annos === 'object') {
                          count = Object.values(annos).reduce((sum: number, page: any) => {
                            return sum + (page?.drawings?.length || 0) + (page?.pins?.length || 0) + (page?.texts?.length || 0) + (page?.rectangles?.length || 0) + (page?.checkmarks?.length || 0) + (page?.crosses?.length || 0);
                          }, 0);
                        }
                      }

                      const handleOpenModal = () => {
                        let latest: Booking = selectedBookingDetail;
                        try {
                          latest = DB.getBookings().find((item: Booking) => String(item.id) === String(selectedBookingDetail.id)) || selectedBookingDetail;
                        } catch (e) { }
                        setAnnotatorBooking(latest);
                      };

                      if (count > 0) {
                        return (
                          <button
                            onClick={handleOpenModal}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-[11px] font-bold transition-all shrink-0 shadow-xs cursor-pointer"
                          >
                            <PenTool className="w-3.5 h-3.5" />
                            <span>Lihat Catatan Revisi Dosen ({count} Coretan)</span>
                          </button>
                        );
                      }

                      return (
                        <button
                          onClick={handleOpenModal}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-all shrink-0 shadow-2xs cursor-pointer"
                        >
                          <span>Buka PDF</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      );
                    })()}
                  </div>
                </div>

              )}

              {selectedBookingDetail.rejectionReason && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-red-500 uppercase tracking-wider">
                    Alasan Penolakan dari Dosen:
                  </label>
                  <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-xl p-3 text-red-900 dark:text-red-300 font-medium">
                    {selectedBookingDetail.rejectionReason}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedBookingDetail(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all cursor-pointer"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Form Ajukan Janji Temu */}
      {showBookingModal && selectedRule && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-900 dark:text-white">
                    Ajukan Janji Temu Bimbingan
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    {DAY_NAMES[selectedRule.dayOfWeek]} ({selectedRule.startTime} - {selectedRule.endTime} WIB)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!bookingDate) return;
                handleBookMeeting(
                  'default-session',
                  bookingDate,
                  `${selectedRule.startTime} - ${selectedRule.endTime} WIB`,
                  bookingNotes
                );
                setShowBookingModal(false);
                setBookingNotes('');
                toast.success('Pengajuan janji temu bimbingan berhasil dikirim ke Dosen Pembimbing!');
              }}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Pilih Tanggal Pertemuan
                </label>
                <input
                  type="date"
                  required
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full p-3 rounded-xl text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Catatan / Topik Konsultasi (Opsional)
                </label>
                <textarea
                  rows={3}
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  placeholder="Misal: Konsultasi perbaikan Bab 2 dan instrumen kuesioner..."
                  className="w-full p-3 rounded-xl text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/10"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Pengajuan Janji Temu</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PDF Annotator Modal (View Mode for Student) */}
      {annotatorBooking && (() => {
        let annos = annotatorBooking.annotations || (annotatorBooking as any).metadata?.annotations;
        if (!annos || (typeof annos === 'object' && Object.keys(annos).length === 0)) {
          try {
            const allBookings = DB.getBookings();
            const matchB = allBookings.find(b => String(b.id) === String(annotatorBooking.id));
            if (matchB?.annotations) annos = matchB.annotations;
          } catch (e) { }
        }

        return (
          <PdfAnnotatorModal
            isOpen={Boolean(annotatorBooking)}
            onClose={() => setAnnotatorBooking(null)}
            pdfUrl={
              annotatorBooking.draftFilePath
                ? (annotatorBooking.draftFilePath.startsWith('/')
                  ? annotatorBooking.draftFilePath
                  : `/${annotatorBooking.draftFilePath}`)
                : `/storage/drafts/${annotatorBooking.draftFileName || 'pdf_65404.pdf'}`
            }
            fileName={annotatorBooking.draftFileName || 'Draft Skripsi'}
            studentName={annotatorBooking.studentName}
            mode="view"
            bookingId={annotatorBooking.id}
            initialAnnotations={annos || []}
          />
        );
      })()}

      {/* PDF Annotator Modal for Guidance Log (View Mode for Student) */}
      {annotatorGuidance && (() => {
        let annos = annotatorGuidance.annotations || (annotatorGuidance as any).metadata?.annotations;
        if (!annos || (typeof annos === 'object' && Object.keys(annos).length === 0)) {
          try {
            const allGuidances = DB.getGuidances();
            const matchG = allGuidances.find(g => String(g.id) === String(annotatorGuidance.id));
            if (matchG?.annotations) annos = matchG.annotations;
          } catch (e) { }

          if (!annos || (typeof annos === 'object' && Object.keys(annos).length === 0)) {
            try {
              const allBookings = DB.getBookings();
              const matchB = allBookings.find(b => String(b.id) === String(annotatorGuidance.bookingId || annotatorGuidance.id));
              if (matchB?.annotations) annos = matchB.annotations;
            } catch (e) { }
          }
        }

        return (
          <PdfAnnotatorModal
            isOpen={Boolean(annotatorGuidance)}
            onClose={() => setAnnotatorGuidance(null)}
            pdfUrl={
              annotatorGuidance.draftFilePath
                ? (annotatorGuidance.draftFilePath.startsWith('/')
                  ? annotatorGuidance.draftFilePath
                  : `/${annotatorGuidance.draftFilePath}`)
                : `/storage/drafts/${annotatorGuidance.draftFileName || 'pdf_65404.pdf'}`
            }
            fileName={annotatorGuidance.draftFileName || 'Draft Skripsi'}
            studentName={currentUser.name}
            mode="view"
            bookingId={annotatorGuidance.bookingId || annotatorGuidance.id}
            initialAnnotations={annos || []}
          />
        );
      })()}
    </div>
  );
}