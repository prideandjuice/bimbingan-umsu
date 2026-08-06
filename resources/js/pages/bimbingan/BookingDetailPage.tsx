import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
  Calendar as CalendarIcon,
  Clock,
  Globe,
  ChevronLeft,
  User as UserIcon,
  CheckCircle2,
  AlertCircle,
  FileText,
  BookOpen,
  MapPin,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Download,
  XCircle,
  Clock3,
  Trash2,
} from 'lucide-react';
import type { Booking, AppUser } from '@/types';
import { DB } from '@/db';
import PdfAnnotatorModal from '@/components/bimbingan/PdfAnnotatorModal';
import CalComBookingView from '@/components/bimbingan/student/CalComBookingView';
import { toast } from 'sonner';

interface BookingDetailPageProps {
  bookingId: string;
}

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
      const monthNamesFull = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];

      const dayName = dayNamesFull[dateObj.getDay()];
      const monthName = monthNamesFull[month];

      return `${dayName}, ${day} ${monthName} ${year}`;
    }
  } catch (e) {
    // fallback
  }
  return dateStr;
};

export default function BookingDetailPage({ bookingId }: BookingDetailPageProps) {
  const { props } = usePage<{ auth?: { user?: AppUser } }>();
  const rawCurrentUser = props.auth?.user;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  useEffect(() => {
    const allBookings = DB.getBookings();
    const found = allBookings.find((b) => b.id === bookingId || b.id.includes(bookingId));
    if (found) {
      setBooking(found);
    } else if (allBookings.length > 0) {
      setBooking(allBookings[0]);
    }
  }, [bookingId]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Janji Temu Disetujui
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Sesi Bimbingan Selesai
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
            <XCircle className="w-3.5 h-3.5" />
            Janji Temu Ditolak
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <Clock3 className="w-3.5 h-3.5" />
            Menunggu Konfirmasi Dosen
          </span>
        );
    }
  };

  const displayTitle = booking?.eventTypeName || 'Bimbingan Skripsi';
  const displayLecturer = booking?.lecturerName || 'Prof. Dr. Irwan, M.Si';
  const displayStudent = booking?.studentName || 'Mahasiswa UMSU';
  const displayNpm = booking?.studentNpm || '2210000001';
  const displayDate = booking?.date || new Date().toISOString().split('T')[0];
  const displayTime = booking?.timeSlot || '09:00 - 09:30 WIB';
  const displayNotes = booking?.notes || 'Tidak ada catatan tambahan.';

  return (
    <>
      <Head title={`Detail Booking ${displayTitle} - UMSU`} />

      <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans">
        {/* Top Navbar Header */}
        <header className="border-b border-emerald-900/50 bg-emerald-800 text-white sticky top-0 z-40 shadow-md">
          <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white font-extrabold text-xs shadow-inner border border-emerald-600/50">
                UMSU
              </div>
              <div>
                <h1 className="text-sm font-bold text-white tracking-tight">
                  Sistem Bimbingan Skripsi UMSU
                </h1>
                <p className="text-[11px] text-emerald-200">Detail Pengajuan Janji Temu</p>
              </div>
            </div>

            <div>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 border border-emerald-600/60 shadow-xs transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Ke Dashboard</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-6">
          {/* Card Tiket Detail */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            {/* Ticket Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-zinc-800/80 pb-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300">
                  <Globe className="w-3.5 h-3.5 text-emerald-600" />
                  <span>REF #: /bimbingan/detail/{booking?.id || bookingId}</span>
                </div>
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white pt-2">
                  {displayTitle}
                </h2>
              </div>
              <div className="shrink-0">{getStatusBadge(booking?.status || 'confirmed')}</div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900/50">
                    <CalendarIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Tanggal Sesi Bimbingan</p>
                    <p className="text-sm font-extrabold text-gray-900 dark:text-white font-mono">
                      {formatDisplayDateWithDay(displayDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900/50">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Slot Waktu Sesi</p>
                    <p className="text-sm font-extrabold text-gray-900 dark:text-white font-mono">
                      {displayTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900/50">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Dosen Pembimbing</p>
                    <p className="text-sm font-extrabold text-gray-900 dark:text-white">
                      {displayLecturer}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900/50">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Mahasiswa Pengaju</p>
                    <p className="text-sm font-extrabold text-gray-900 dark:text-white">
                      {displayStudent}{' '}
                      <span className="text-xs text-muted-foreground font-mono">({displayNpm})</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900/50">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Catatan / Pesan Pengajuan</p>
                    <p className="text-xs text-gray-700 dark:text-gray-300 italic pt-0.5">
                      "{displayNotes}"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section Dokumen Draft PDF */}
            <div className="border-t border-gray-100 dark:border-zinc-800/80 pt-6 space-y-4">
              <h3 className="text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                Berkas Draft Skripsi & Hasil Anotasi PDF
              </h3>

              <div className="bg-gray-50 dark:bg-zinc-800/60 border border-gray-200/80 dark:border-zinc-700/60 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/50 text-red-600 flex items-center justify-center shrink-0 border border-red-200 dark:border-red-900/40">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-gray-900 dark:text-white">
                      {booking?.draftFileName || '19.+R.+Mahdalena+Simanjorang.pdf'}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Format: PDF • Tersedia untuk dibaca & diberi coretan revisi
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  <button
                    onClick={() => setIsPdfModalOpen(true)}
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Buka & Lihat Anotasi PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* PDF Annotator Modal Container */}
        {isPdfModalOpen && (
          <PdfAnnotatorModal
            isOpen={isPdfModalOpen}
            onClose={() => setIsPdfModalOpen(false)}
            pdfUrl={
              booking?.draftFilePath
                ? booking.draftFilePath.startsWith('/')
                  ? booking.draftFilePath
                  : `/${booking.draftFilePath}`
                : '/storage/drafts/pdf_65404.pdf'
            }
            fileName={booking?.draftFileName || 'Draft Skripsi'}
            studentName={displayStudent}
            mode="view"
            initialAnnotations={booking?.annotations || []}
          />
        )}
      </div>
    </>
  );
}
