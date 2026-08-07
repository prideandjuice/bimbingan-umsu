// components/bimbingan/studentdashboard.tsx
import { useState } from 'react';
import { usePage, Link } from '@inertiajs/react';
import {
  FilePlus,
  Clock,
  BookOpen,
  Calendar,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertCircle,
  UserCheck,
  TrendingUp,
  FileText,
} from 'lucide-react';
import { DB } from '@/db';
import type { AppUser, Proposal, ProposalTitle, Thesis, Guidance, Booking } from '@/types';
import { toast } from 'sonner';

import ProposalForm from './student/ProposalForm';
import ProposalPending from './student/ProposalPending';
import ThesisActiveLayout from './student/ThesisActiveLayout';
import StudentSidebarNav from './student/StudentSidebarNav';

import StudentWelcomeHeader from './student/StudentWelcomeHeader';
import ThesisJourneyTimeline from './student/ThesisJourneyTimeline';
import AcademicGuidelineCard from './student/AcademicGuidelineCard';
import RoleFooter from './RoleFooter';
import RichTextDisplay from './RichTextDisplay';

interface StudentDashboardProps {
  currentUser: AppUser;
  onRefresh: () => void;
  activeTab?: string;
}

export default function StudentDashboard({ currentUser, onRefresh, activeTab: propActiveTab }: StudentDashboardProps) {
  const { url } = usePage();

  // Active tab received from Controller prop or URL fallback
  const rawTab = propActiveTab || (
    url.includes('/mahasiswa/pengajuan-judul') ? 'pengajuan-judul'
      : url.includes('/mahasiswa/status-judul') ? 'status-judul'
      : url.includes('/mahasiswa/log-bimbingan') ? 'log-bimbingan'
      : url.includes('/mahasiswa/booking-jadwal') || url.includes('/mahasiswa/bookings') ? 'booking-jadwal'
      : 'overview'
  );

  const activeTab: 'overview' | 'pengajuan-judul' | 'status-judul' | 'log-bimbingan' | 'booking-jadwal' =
    rawTab === 'bookings' ? 'booking-jadwal' : (rawTab as any);

  // DB States
  const [proposals, setProposals] = useState(DB.getProposals());
  const [proposalTitles, setProposalTitles] = useState(DB.getProposalTitles());
  const [theses, setTheses] = useState(DB.getTheses());
  const [guidances, setGuidances] = useState(DB.getGuidances());
  const [eventTypes, setEventTypes] = useState(DB.getEventTypes());
  const [availabilityRules, setAvailabilityRules] = useState(DB.getAvailabilityRules());
  const [bookings, setBookings] = useState(DB.getBookings());

  // Find student's current status
  const myProposal = proposals.find(p => p.studentId === currentUser.id);
  const myTitles = myProposal ? proposalTitles.filter(t => String(t.proposalId) === String(myProposal.id)) : [];
  const myThesis = theses.find(t => t.studentId === currentUser.id);
  const myGuidances = myThesis ? guidances.filter(g => g.thesisId === myThesis.id) : [];
  const myBookings = bookings.filter(b => b.studentId === currentUser.id);

  const refreshLocalData = () => {
    setProposals(DB.getProposals());
    setProposalTitles(DB.getProposalTitles());
    setTheses(DB.getTheses());
    setGuidances(DB.getGuidances());
    setEventTypes(DB.getEventTypes());
    setAvailabilityRules(DB.getAvailabilityRules());
    setBookings(DB.getBookings());
    onRefresh();
  };

  // Callback Mutations
  const onSubmitProposal = (items: Array<{ title: string; abstract: string }>) => {
    const proposalId = `prop-${Date.now()}`;
    const mainAbstract = items[0]?.abstract || '';
    const newProposal: Proposal = {
      id: proposalId,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentNpm: currentUser.npm || 'N/A',
      prodi: currentUser.department || 'Magister Ilmu Komunikasi',
      abstract: mainAbstract,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    const titlesToInsert: ProposalTitle[] = items.map((item, idx) => ({
      id: `title-${proposalId}-${idx}`,
      proposalId: proposalId,
      title: item.title.trim(),
      abstract: item.abstract.trim(),
      status: 'PENDING'
    }));

    DB.saveProposals([...proposals, newProposal]);
    DB.saveProposalTitles([...proposalTitles, ...titlesToInsert]);
    refreshLocalData();
  };

  const onAddGuidanceLog = (date: string, notes: string, revisions: string, progress: number) => {
    if (!myThesis) return;
    const newGuidance: Guidance = {
      id: `guidance-${Date.now()}`,
      thesisId: myThesis.id,
      date,
      notes,
      revisions,
      progress,
      createdBy: 'student',
      creatorName: currentUser.name,
      status: 'pending_verification',
      createdAt: new Date().toISOString()
    };
    DB.saveGuidances([...guidances, newGuidance]);
    refreshLocalData();
  };

  const onBookMeeting = async (eventTypeId: string, date: string, slot: string, notes: string, draftFileInput?: File | string | null) => {
    if (!myThesis) return;
    const supervisorName = myThesis.supervisorName || 'Dosen Pembimbing';

    let uploadedFileName: string | null = null;
    let uploadedFilePath: string | null = null;

    if (draftFileInput instanceof File) {
      uploadedFileName = draftFileInput.name;
      try {
        uploadedFilePath = URL.createObjectURL(draftFileInput);
      } catch (e) {
        // fallback
      }
      try {
        const formData = new FormData();
        formData.append('file', draftFileInput);

        const uploadRes = await fetch('/bimbingan/upload-draft', {
          method: 'POST',
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
          },
          body: formData,
        });

        if (uploadRes.ok) {
          const data = await uploadRes.json();
          if (data.filePath) {
            uploadedFileName = data.fileName || draftFileInput.name;
            uploadedFilePath = data.filePath;
          }
        }
      } catch (err) {
        console.error('Draft file upload error:', err);
      }
    } else if (typeof draftFileInput === 'string' && draftFileInput.trim() !== '') {
      uploadedFileName = draftFileInput;
      uploadedFilePath = '/storage/drafts/pdf_65404.pdf';
    } else {
      uploadedFileName = null;
      uploadedFilePath = null;
    }

    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      thesisId: myThesis.id,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentNpm: currentUser.npm || 'N/A',
      lecturerId: myThesis.supervisorId || 'user-lecturer-1',
      lecturerName: supervisorName,
      eventTypeId: eventTypeId || 'default-bimbingan',
      eventTypeName: 'Konsultasi Bimbingan',
      date,
      timeSlot: slot,
      status: 'pending',
      notes,
      draftFileName: uploadedFileName,
      draftFilePath: uploadedFilePath,
      createdAt: new Date().toISOString(),
    };

    DB.saveBookings([...bookings, newBooking]);
    refreshLocalData();

    fetch('/bimbingan/sync/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({ bookings: [newBooking] }),
    }).catch(() => {});
  };

  const onCancelBooking = (bookingId: string) => {
    const updated = bookings.filter((b) => b.id !== bookingId);
    setBookings(updated);
    DB.saveBookings(updated);
    refreshLocalData();
    toast.success('Pengajuan janji temu berhasil dibatalkan/dihapus.');
  };

  const verifiedGuidances = myGuidances.filter(g => g.status === 'verified');
  const currentProgress = verifiedGuidances.length > 0 ? Math.max(...verifiedGuidances.map(g => g.progress)) : 0;
  const mySupervisorEventTypes = myThesis?.supervisorId ? eventTypes.filter(et => et.lecturerId === myThesis.supervisorId) : [];
  const mySupervisorAvailability = myThesis?.supervisorId
    ? availabilityRules.filter(ar => String(ar.lecturerId) === String(myThesis.supervisorId) || ar.lecturerId === 'user-lecturer-1')
    : availabilityRules;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="student-dashboard-layout">
      {/* 1. Left Sidebar Navigation Panel */}
      <div className="lg:col-span-3">
        <StudentSidebarNav
          currentUser={currentUser}
          activeTab={activeTab}
          myProposal={myProposal}
          myThesis={myThesis}
          myGuidances={myGuidances}
          myBookings={myBookings}
        />
      </div>

      {/* 2. Right Main Content Area */}
      <div className="lg:col-span-9 space-y-6">
        {/* ROUTE 1: OVERVIEW DASHBOARD UTAMA */}
        {activeTab === 'overview' && (
          <div className="space-y-6" id="student-overview-view">
            <StudentWelcomeHeader currentUser={currentUser} />

            {/* Stat Cards Grid (4 Key Metric Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Status Pengajuan Judul */}
              <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-3 text-left">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <FilePlus className="w-5.5 h-5.5" />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    myThesis ? 'bg-emerald-100 text-emerald-800' :
                    myProposal ? 'bg-amber-100 text-amber-800' :
                    'bg-gray-100 text-gray-700'
                  }`}>
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
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    myThesis?.supervisorName ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
                  }`}>
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
                    {verifiedGuidances.length} Sesi
                  </span>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-muted-foreground">Progress Bimbingan</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">
                    {currentProgress}%
                  </p>
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
                    {myBookings.filter(b => b.status === 'confirmed').length} Disetujui Dosen
                  </p>
                </div>
              </div>
            </div>

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
        )}

        {/* ROUTE 2: PENGAJUAN JUDUL */}
        {activeTab === 'pengajuan-judul' && (
          <div className="space-y-6" id="student-pengajuan-judul">
            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                  <FilePlus className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Formulir Pengajuan Judul Skripsi</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {myProposal ? 'Draf pengajuan judul skripsi Anda telah terkirim.' : 'Silakan lengkapi draf proposal dan alternatif judul skripsi Anda.'}
                  </p>
                </div>
              </div>

              {myProposal && (
                <Link
                  href="/mahasiswa/status-judul"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 transition-all self-start md:self-auto"
                >
                  <Clock className="w-4 h-4" />
                  <span>Lihat Status Persetujuan</span>
                </Link>
              )}
            </div>

            <div className="w-full">
              {!myProposal && !myThesis ? (
                <ProposalForm currentUser={currentUser} onSubmitProposal={onSubmitProposal} />
              ) : (
                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 text-left">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-zinc-800 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base md:text-lg text-gray-900 dark:text-white">Pengajuan Judul Berhasil Terkirim</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Draf proposal alternatif judul Anda saat ini sedang dalam peninjauan oleh Kaprodi.</p>
                      </div>
                    </div>

                    <span className="bg-amber-100/80 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-semibold px-4 py-1.5 rounded-full self-start md:self-auto shrink-0">
                      Menunggu Keputusan Kaprodi
                    </span>
                  </div>

                  {/* Daftar 3 Alternatif Judul Skripsi yang Diajukan */}
                  {myTitles.length > 0 ? (
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        Alternatif Judul & Latar Belakang yang Diajukan ({myTitles.length})
                      </h4>

                      <div className="space-y-4">
                        {myTitles.map((t, idx) => (
                          <div
                            key={t.id || idx}
                            className="bg-emerald-50/30 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 p-5 rounded-2xl space-y-3"
                          >
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <span className="inline-block bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-3xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                                Opsi {idx + 1}
                              </span>

                              <span
                                className={`text-3xs font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1 ${
                                  t.status === 'ACCEPTED'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : t.status === 'REJECTED'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {t.status === 'ACCEPTED' && <CheckCircle2 className="w-3 h-3" />}
                                {t.status === 'REJECTED' && <XCircle className="w-3 h-3" />}
                                {t.status === 'PENDING' && <Clock className="w-3 h-3" />}
                                {t.status === 'ACCEPTED' ? 'Disetujui Kaprodi' : t.status === 'REJECTED' ? 'Ditolak' : 'Menunggu Review'}
                              </span>
                            </div>

                            <h4 className="font-bold text-sm md:text-base text-gray-900 dark:text-white leading-snug">
                              {t.title}
                            </h4>

                            <div className="pt-1">
                              <p className="text-3xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider mb-1.5">
                                Latar Belakang / Abstrak:
                              </p>
                              <RichTextDisplay
                                content={t.abstract}
                                fallback="Abstrak telah disimpan dalam draf pengajuan proposal."
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 p-5 rounded-2xl space-y-3">
                      <p className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
                        Abstrak / Latar Belakang Proposal Asal:
                      </p>
                      <RichTextDisplay
                        content={myProposal?.abstract}
                        fallback="Abstrak telah disimpan dalam draf pengajuan proposal."
                      />
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <Link
                      href="/mahasiswa/status-judul"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/10 transition-all"
                    >
                      <span>Cek Detail Status Seleksi Judul</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ROUTE 3: STATUS PERSETUJUAN */}
        {activeTab === 'status-judul' && (
          <div className="space-y-6" id="student-status-judul">
            <div className="w-full">
              {myProposal && !myThesis ? (
                <ProposalPending myProposal={myProposal} proposalTitles={proposalTitles} onRefresh={onRefresh} />
              ) : myThesis ? (
                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 text-left">
                  <div className="flex items-center gap-3 text-emerald-600">
                    <CheckCircle2 className="w-6 h-6" />
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">Judul Skripsi Disetujui & Pembimbing Ditetapkan</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Judul skripsi Anda (<strong>{myThesis.title}</strong>) telah disetujui oleh Ketua Program Studi dan Dosen Pembimbing telah ditetapkan.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/mahasiswa/log-bimbingan"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/10 transition-all"
                    >
                      <span>Buka Log Bimbingan</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-8 text-center space-y-4">
                  <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                  <div>
                    <h3 className="font-bold text-base text-gray-900 dark:text-white">Belum Ada Draf Pengajuan Judul</h3>
                    <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                      Anda belum membuat pengajuan draf proposal skripsi. Silakan buat pengajuan terlebih dahulu untuk melihat status persetujuan.
                    </p>
                  </div>
                  <Link
                    href="/mahasiswa/pengajuan-judul"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/10"
                  >
                    <FilePlus className="w-4 h-4" />
                    <span>Buat Pengajuan Judul Skripsi</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ROUTE 4: LOG BIMBINGAN */}
        {activeTab === 'log-bimbingan' && (
          <div className="w-full">
            {myThesis ? (
              <ThesisActiveLayout
                currentUser={currentUser}
                myThesis={myThesis}
                proposals={proposals}
                myGuidances={myGuidances}
                myBookings={myBookings}
                mySupervisorEventTypes={mySupervisorEventTypes}
                mySupervisorAvailability={mySupervisorAvailability}
                currentProgress={currentProgress}
                handleSubmitGuidance={onAddGuidanceLog}
                handleBookMeeting={onBookMeeting}
                initialTab="guidances"
              />
            ) : (
              <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-8 text-center space-y-4">
                <BookOpen className="w-10 h-10 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="font-bold text-base text-gray-900 dark:text-white">Log Bimbingan Belum Aktif</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                    Log bimbingan akan aktif secara otomatis setelah pengajuan judul skripsi Anda disetujui oleh Kaprodi dan SK Pembimbing telah ditetapkan.
                  </p>
                </div>
                {!myProposal ? (
                  <Link
                    href="/mahasiswa/pengajuan-judul"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/10 transition-all"
                  >
                    <FilePlus className="w-4 h-4" />
                    <span>Ajukan Judul Skripsi</span>
                  </Link>
                ) : (
                  <Link
                    href="/mahasiswa/status-judul"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/10 transition-all"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Cek Status Persetujuan</span>
                  </Link>
                )}
              </div>
            )}
          </div>
        )}

        {/* ROUTE 5: BOOKING JADWAL */}
        {activeTab === 'booking-jadwal' && (
          <div className="w-full">
            <ThesisActiveLayout
              currentUser={currentUser}
              myThesis={myThesis || {
                id: 'thesis-auto',
                studentId: currentUser.id,
                studentName: currentUser.name,
                studentNpm: currentUser.npm || '',
                title: 'Skripsi / Bimbingan Akademik',
                supervisorId: 'super-1',
                supervisorName: myBookings[0]?.lecturerName || 'Dosen Pembimbing UMSU',
                status: 'ACTIVE',
              }}
              proposals={proposals}
              myGuidances={myGuidances}
              myBookings={myBookings}
              mySupervisorEventTypes={mySupervisorEventTypes}
              mySupervisorAvailability={mySupervisorAvailability}
              currentProgress={currentProgress}
              handleSubmitGuidance={onAddGuidanceLog}
              handleBookMeeting={onBookMeeting}
              handleCancelBooking={onCancelBooking}
              initialTab="bookings"
            />
          </div>
        )}
      </div>

      <div className="lg:col-span-12">
        <RoleFooter role={currentUser.role} currentUser={currentUser} />
      </div>
    </div>
  );
}