import { useState } from 'react';
import {
  Users,
  Clock,
  CheckCircle2,
  BookOpen,
  ArrowLeft,
  ChevronRight,
  Send,
  FileText,
  AlertCircle,
  TrendingUp,
  FileCheck2,
  Calendar,
  Sparkles,
  Plus,
  UserCheck,
  ExternalLink,
  Download,
  Paperclip,
  Eye,
} from 'lucide-react';
import type { AppUser, Guidance, Thesis } from '@/types';
import PdfAnnotatorModal from '@/components/bimbingan/PdfAnnotatorModal';
import { DB } from '@/db';

interface StudentsTabProps {
  currentUser: AppUser;
  myStudents: Thesis[];
  guidances: Guidance[];
  selectedThesisId: string | null;
  setSelectedThesisId: (id: string | null) => void;
  handleVerifyGuidance: (id: string) => void;
  handleLecturerSubmitGuidance: (newGuidance: Omit<Guidance, 'id' | 'status' | 'createdBy' | 'creatorName' | 'createdAt'>) => void;
  isLogBimbinganTab?: boolean;
}

export default function StudentsTab({
  currentUser,
  myStudents,
  guidances,
  selectedThesisId,
  setSelectedThesisId,
  handleVerifyGuidance,
  handleLecturerSubmitGuidance,
  isLogBimbinganTab = false,
}: StudentsTabProps) {
  // Form State Bimbingan Dosen
  const [lGDate, setLGDate] = useState(new Date().toISOString().split('T')[0]);
  const [lGNotes, setLGNotes] = useState('');
  const [lGRevisions, setLGRevisions] = useState('');
  const [lGProgress, setLGProgress] = useState(10);
  const [showAddLog, setShowAddLog] = useState(false);
  const [annotatorGuidance, setAnnotatorGuidance] = useState<Guidance | null>(null);

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lGNotes.trim()) {
      alert('Mohon isi catatan pertemuan.');
      return;
    }
    handleLecturerSubmitGuidance({
      thesisId: selectedThesisId!,
      date: lGDate,
      notes: lGNotes.trim(),
      revisions: lGRevisions.trim(),
      progress: Number(lGProgress),
    });
    setLGNotes('');
    setLGRevisions('');
    setShowAddLog(false);
  };

  // Data Derivasi untuk Dashboard Overview Dosen
  const studentThesisIds = myStudents.map(s => s.id);
  const allStudentGuidances = guidances.filter(g => studentThesisIds.includes(g.thesisId));
  const pendingFeedbackCount = allStudentGuidances.filter(g => g.status === 'pending_verification').length;
  const verifiedCount = allStudentGuidances.filter(g => g.status === 'verified').length;

  // Function menghitung max progress per mahasiswa
  const getStudentProgress = (thesisId: string) => {
    const activeT = myStudents.find((s) => s.id === thesisId);
    const studentLogs = guidances.filter(
      (g) => g && (g.thesisId === thesisId || (activeT && activeT.studentId && (g as any).studentId === activeT.studentId)) && g.status === 'verified'
    );
    if (studentLogs.length === 0) return 10;
    return Math.max(...studentLogs.map((g) => g.progress));
  };

  // --- JIKA DOSEN SUDAH MEMILIH SATU MAHASISWA (DETAIL VIEW) ---
  if (selectedThesisId) {
    const activeThesis = myStudents.find((s) => s.id === selectedThesisId);
    if (!activeThesis) return null;
    const studentGuidances = guidances.filter(
      (g) => g && (g.thesisId === activeThesis.id || (activeThesis.studentId && (g as any).studentId === activeThesis.studentId))
    );
    const progress = getStudentProgress(activeThesis.id);

    return (
      <div className="space-y-6 text-left">
        {/* Tombol Kembali */}
        <button
          onClick={() => setSelectedThesisId(null)}
          className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-2 rounded-xl transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar Mahasiswa
        </button>

        {/* Card Header Mahasiswa Terpilih */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-zinc-800 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-bold text-lg flex items-center justify-center shrink-0">
                {activeThesis.studentName.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="font-bold text-xl text-gray-900 dark:text-white">{activeThesis.studentName}</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  NPM: <strong className="font-semibold text-gray-800 dark:text-gray-200">{activeThesis.studentNpm || 'N/A'}</strong> | Program Studi: <strong className="font-semibold text-gray-800 dark:text-gray-200">{activeThesis.department}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto">
              <span className="text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-xl">
                Progress Skripsi: <strong className="text-emerald-800 dark:text-emerald-200">{progress}%</strong>
              </span>
            </div>
          </div>

          {/* Card / Alert File SK Pembimbing */}
          {activeThesis.skFile ? (
            <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs text-emerald-900 dark:text-emerald-200 uppercase tracking-wider">
                      Surat Keterangan (SK) Pembimbing Resmi
                    </h4>
                    <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-md">
                      Diterbitkan Admin
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                    Berkas SK: {activeThesis.skFile.split('/').pop()}
                  </p>
                </div>
              </div>

              <a
                href={activeThesis.skFile.startsWith('http') || activeThesis.skFile.startsWith('/') ? activeThesis.skFile : `/${activeThesis.skFile}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all shrink-0 cursor-pointer self-start sm:self-auto"
                title="Buka / Unduh Surat Keterangan (SK) Pembimbing"
              >
                <FileText className="w-4 h-4 text-emerald-200" />
                <span>Lihat / Unduh File SK</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>
          ) : (
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 p-5 rounded-2xl flex items-start gap-4 text-left shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-amber-900 dark:text-amber-200">
                    Menunggu Terbitnya SK Bimbingan dari Admin
                  </h4>
                  <span className="text-3xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                    Bimbingan Belum Aktif
                  </span>
                </div>
                <p className="text-xs text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
                  Anda telah ditunjuk oleh Kaprodi sebagai Dosen Pembimbing untuk <strong>{activeThesis.studentName}</strong>. Namun, <strong>sesi bimbingan dan verifikasi logbook belum dapat dilakukan</strong> karena Surat Keterangan (SK) Pembimbing belum diterbitkan / diunggah oleh Admin.
                </p>
              </div>
            </div>
          )}

          <div>
            <p className="text-[11px] font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">Judul Skripsi Disetujui:</p>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mt-1 leading-snug">
              {activeThesis.title}
            </h3>
          </div>
        </div>

        {/* Section Log Konsultasi & Tambah Catatan */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-zinc-800 pb-4">
            <div>
              <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                Log Konsultasi Bimbingan ({studentGuidances.length})
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Kelola catatan bimbingan, beri arahan revisi, dan verifikasi progres mahasiswa.
              </p>
            </div>

            {activeThesis.skFile ? (
              <button
                onClick={() => setShowAddLog(!showAddLog)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 self-start sm:self-auto shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                {showAddLog ? 'Batal' : 'Tambah Catatan Dosen'}
              </button>
            ) : (
              <button
                disabled
                title="Sesi bimbingan belum aktif (Menunggu SK Admin)"
                className="bg-gray-100 dark:bg-zinc-800 text-gray-400 text-xs font-semibold px-4 py-2.5 rounded-xl cursor-not-allowed flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Clock className="w-4 h-4" />
                Menunggu SK Admin
              </button>
            )}
          </div>

          {/* Form Tambah Bimbingan oleh Dosen */}
          {showAddLog && (
            <form onSubmit={onSubmitForm} className="bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 p-5 rounded-2xl space-y-4">
              <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
                Form Hasil Bimbingan Dosen
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Tanggal Pertemuan</label>
                  <input
                    type="date"
                    required
                    value={lGDate}
                    onChange={(e) => setLGDate(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Update Progress (%): {lGProgress}%</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={lGProgress}
                    onChange={(e) => setLGProgress(Number(e.target.value))}
                    className="w-full accent-emerald-600 mt-2"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Catatan Konsultasi / Feedback Dosen</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tuliskan arahan dan masukan untuk mahasiswa..."
                  value={lGNotes}
                  onChange={(e) => setLGNotes(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Tugas / Poin Perbaikan (Opsional)</label>
                <textarea
                  rows={2}
                  placeholder="Tuliskan poin perbaikan yang harus direvisi..."
                  value={lGRevisions}
                  onChange={(e) => setLGRevisions(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  Simpan & Verifikasi Bimbingan
                </button>
              </div>
            </form>
          )}

          {/* Daftar Riwayat Bimbingan Mahasiswa ini */}
          <div className="space-y-3">
            {studentGuidances.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl space-y-2">
                <BookOpen className="w-8 h-8 text-muted-foreground mx-auto" />
                <p className="text-xs text-muted-foreground font-medium">Belum ada catatan bimbingan untuk mahasiswa ini.</p>
              </div>
            ) : (
              studentGuidances.map((g, idx) => (
                <div key={g.id || idx} className="bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 rounded-2xl p-5 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900 dark:text-white">
                        Sesi Bimbingan #{studentGuidances.length - idx}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({new Date(g.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })})
                      </span>
                    </div>

                    {g.status === 'pending_verification' ? (
                      activeThesis.skFile ? (
                        <button
                          onClick={() => handleVerifyGuidance(g.id)}
                          className="bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          Verifikasi Catatan
                        </button>
                      ) : (
                        <button
                          disabled
                          title="Tidak dapat diverifikasi sebelum SK Admin terbit"
                          className="bg-gray-100 dark:bg-zinc-800 text-gray-400 text-[11px] font-bold px-3 py-1 rounded-lg cursor-not-allowed"
                        >
                          Menunggu SK Admin
                        </button>
                      )
                    ) : (
                      <span className="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold px-3 py-1 rounded-full inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Diverifikasi
                      </span>
                    )}
                  </div>

                  <p className="text-xs md:text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-normal">
                    {g.notes}
                  </p>

                  {g.revisions && (
                    <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 p-3 rounded-xl text-xs space-y-1">
                      <p className="font-bold text-amber-900 dark:text-amber-300">Poin Revisi / Perbaikan:</p>
                      <p className="text-amber-800 dark:text-amber-400 font-light">{g.revisions}</p>
                    </div>
                  )}

                  {g.draftFileName && (
                    <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 p-3 rounded-xl text-xs flex items-center justify-between gap-3 mt-2">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Paperclip className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                          Draft Skripsi: {g.draftFileName}
                        </span>
                      </div>
                      <button
                        onClick={() => setAnnotatorGuidance(g)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs shrink-0 cursor-pointer transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Lihat Draft & Coretan</span>
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- TAMPILAN KHUSUS TAB LOG BIMBINGAN (DAFTAR CARD MAHASISWA BIMBINGAN) ---
  if (isLogBimbinganTab) {
    return (
      <div className="space-y-6 text-left">
        {/* Header Banner Log Bimbingan */}
        <div className="bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 text-white rounded-3xl p-6 md:p-8 shadow-xl shadow-emerald-900/10 relative overflow-hidden text-left">
          <div className="absolute -right-12 -bottom-12 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shrink-0 shadow-inner">
                <BookOpen className="w-7 h-7 md:w-8 md:h-8 text-emerald-200" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 bg-emerald-500/30 backdrop-blur-md border border-emerald-300/30 text-emerald-100 text-[11px] font-bold px-3 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    Log Bimbingan Skripsi
                  </span>
                </div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                  Log Bimbingan Mahasiswa
                </h1>
                <p className="text-xs md:text-sm text-emerald-100/80 font-light">
                  Pilih kartu mahasiswa di bawah ini untuk mengelola riwayat bimbingan, catatan revisi, dan SK Pembimbing.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Daftar Cards Mahasiswa Bimbingan (Layout Kebawah / Vertical Stack) */}
        {myStudents.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-3xl space-y-3">
            <BookOpen className="w-10 h-10 text-muted-foreground mx-auto" />
            <h3 className="font-bold text-base text-gray-900 dark:text-white">Belum Ada Mahasiswa Bimbingan</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Saat ini Anda belum ditugaskan sebagai dosen pembimbing oleh Kaprodi untuk mahasiswa manapun.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {myStudents.map((s) => {
              const progress = getStudentProgress(s.id);
              const studentLogs = guidances.filter((g) => g.thesisId === s.id);
              const initials = s.studentName.substring(0, 2).toUpperCase();

              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedThesisId(s.id)}
                  className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-800 transition-all cursor-pointer space-y-5 text-left group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-bold text-lg flex items-center justify-center shrink-0">
                        {initials}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                          {s.studentName}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          NPM: <strong className="font-semibold text-gray-800 dark:text-gray-200">{s.studentNpm || 'N/A'}</strong> | Program Studi: <strong className="font-semibold text-gray-800 dark:text-gray-200">{s.department}</strong>
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-bold bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full shrink-0 self-start sm:self-auto">
                      Progress Skripsi: {progress}%
                    </span>
                  </div>

                  {/* Status SK Pembimbing */}
                  {s.skFile ? (
                    <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3 text-xs text-emerald-900 dark:text-emerald-200 font-medium">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 flex items-center justify-center shrink-0">
                          <FileCheck2 className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs uppercase tracking-wider">Surat Keterangan (SK) Pembimbing Resmi</span>
                            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                              Diterbitkan Admin
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                            Berkas SK: {s.skFile.split('/').pop()}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/60 px-3 py-1 rounded-lg shrink-0 self-start sm:self-auto">
                        Bimbingan Aktif
                      </span>
                    </div>
                  ) : (
                    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 p-4 rounded-2xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 text-xs text-amber-900 dark:text-amber-200 font-medium">
                        <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 flex items-center justify-center shrink-0">
                          <Clock className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                          <span className="font-bold text-xs">Menunggu Terbitnya SK Bimbingan dari Admin</span>
                          <p className="text-xs text-amber-800/90 dark:text-amber-300/90">Sesi bimbingan belum aktif sampai SK diunggah oleh Admin.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Judul Skripsi */}
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
                      Judul Skripsi Disetujui:
                    </p>
                    <p className="text-sm text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                      {s.title}
                    </p>
                  </div>

                  {/* Footer Card */}
                  <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-medium flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-emerald-600" />
                      {studentLogs.length} Catatan Bimbingan Konsultasi
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Buka Log Bimbingan &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // --- TAMPILAN UTAMA (LECTURER OVERVIEW DASHBOARD SAMA SEPERTI PROTOTYPE SCREENSHOT) ---
  return (
    <div className="space-y-6 text-left">
      {/* 1. Premium Header Welcome Banner Dosen */}
      <div className="bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 text-white rounded-3xl p-6 md:p-8 shadow-xl shadow-emerald-900/10 relative overflow-hidden text-left">
        {/* Background Ambient Glow Accent */}
        <div className="absolute -right-12 -bottom-12 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -top-10 w-36 h-36 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shrink-0 shadow-inner">
              <UserCheck className="w-7 h-7 md:w-8 md:h-8 text-emerald-200" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 bg-emerald-500/30 backdrop-blur-md border border-emerald-300/30 text-emerald-100 text-[11px] font-bold px-3 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  Portal Dosen Pembimbing
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                Selamat Datang, {currentUser.name}
              </h1>
              <p className="text-xs md:text-sm text-emerald-100/80 font-light">
                Berikut adalah ringkasan progres bimbingan skripsi mahasiswa Anda hari ini.
              </p>
            </div>
          </div>

          {/* Highlighted NIDN Badge */}
          <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/30 border border-emerald-300/30 flex items-center justify-center text-emerald-200">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider block">NIDN RESMI</span>
                <span className="text-sm font-extrabold font-mono text-white tracking-wide">
                  {currentUser.nidn || '0012345678'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Stat Cards Grid (3 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {/* Card 1: Total Mahasiswa */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-5 md:p-6 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Total Mahasiswa</p>
            <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-0.5">
              {myStudents.length}
            </p>
          </div>
        </div>

        {/* Card 2: Menunggu Feedback */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-5 md:p-6 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Menunggu Feedback</p>
            <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-0.5">
              {pendingFeedbackCount}
            </p>
          </div>
        </div>

        {/* Card 3: Selesai / Diverifikasi */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-5 md:p-6 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Log Diverifikasi</p>
            <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-0.5">
              {verifiedCount}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Main Two-Column Layout (Daftar Mahasiswa + Aktivitas Terbaru) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Left Column (8 cols): Daftar Mahasiswa Bimbingan Terpilih */}
        <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-4">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Daftar Mahasiswa Bimbingan Terpilih
            </h2>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold cursor-pointer flex items-center gap-1 hover:underline">
              Total {myStudents.length} Mahasiswa
            </span>
          </div>

          {/* Table / List Mahasiswa */}
          {myStudents.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl space-y-3">
              <BookOpen className="w-10 h-10 text-muted-foreground mx-auto" />
              <h3 className="font-bold text-base text-gray-900 dark:text-white">Belum Ada Mahasiswa Bimbingan</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Saat ini Anda belum ditugaskan sebagai dosen pembimbing oleh Kaprodi untuk mahasiswa manapun.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-zinc-800 text-[11px] font-bold text-muted-foreground uppercase tracking-wider bg-gray-50/50 dark:bg-zinc-800/40">
                    <th className="py-3 px-4 rounded-l-xl">Mahasiswa</th>
                    <th className="py-3 px-4">Judul Skripsi</th>
                    <th className="py-3 px-4 rounded-r-xl text-right">Progres</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 text-xs">
                  {myStudents.map((s) => {
                    const progress = getStudentProgress(s.id);
                    const initials = s.studentName.substring(0, 2).toUpperCase();

                    return (
                      <tr
                        key={s.id}
                        onClick={() => setSelectedThesisId(s.id)}
                        className="hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-all cursor-pointer group"
                      >
                        {/* Column 1: Mahasiswa Info */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center shrink-0">
                              {initials}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                                {s.studentName}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[11px] text-muted-foreground font-light">
                                  {s.studentNpm || 'N/A'}
                                </span>
                                {!s.skFile ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-900/50">
                                    <Clock className="w-3 h-3 animate-pulse" />
                                    Menunggu SK Admin
                                  </span>
                                ) : (
                                  <div className="flex items-center gap-1.5">
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900/50">
                                      <CheckCircle2 className="w-3 h-3" />
                                      Bimbingan Aktif
                                    </span>

                                    <a
                                      href={s.skFile.startsWith('http') || s.skFile.startsWith('/') ? s.skFile : `/${s.skFile}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 bg-emerald-100/70 dark:bg-emerald-950/60 hover:bg-emerald-200/80 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 transition-colors"
                                      title="Buka File SK Pembimbing"
                                    >
                                      <FileText className="w-3 h-3 text-emerald-600" />
                                      <span>Lihat SK</span>
                                      <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Column 2: Judul Skripsi */}
                        <td className="py-4 px-4 max-w-xs">
                          <p className="font-normal text-gray-800 dark:text-gray-200 line-clamp-2 leading-snug">
                            {s.title}
                          </p>
                        </td>

                        {/* Column 3: Progres Bar & Percentage */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <div className="w-24 bg-gray-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden hidden sm:block">
                              <div
                                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="font-bold text-xs text-gray-900 dark:text-white">
                              {progress}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Aktivitas Terbaru & Panduan Review */}
        <div className="lg:col-span-4 space-y-6">
          {/* Box Aktivitas Terbaru */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Aktivitas Terbaru
            </h3>

            <div className="space-y-4 pt-1">
              {allStudentGuidances.length === 0 ? (
                <p className="text-xs text-muted-foreground py-4 font-light text-center">
                  Belum ada aktivitas bimbingan terbaru.
                </p>
              ) : (
                allStudentGuidances.slice(0, 3).map((g, idx) => {
                  const student = myStudents.find(s => s.id === g.thesisId);
                  return (
                    <div key={g.id || idx} className="flex gap-3 text-xs pb-3 border-b border-gray-100 dark:border-zinc-800 last:border-0 last:pb-0">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                        <FileCheck2 className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="font-bold text-gray-900 dark:text-white leading-tight">
                          Konsultasi Skripsi ({g.progress}%)
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Diajukan oleh <strong className="font-semibold text-gray-800 dark:text-gray-200">{student?.studentName || 'Mahasiswa'}</strong>
                        </p>
                        <p className="text-[10px] text-muted-foreground font-light pt-0.5">
                          {new Date(g.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Box Panduan Review */}
          <div className="bg-gradient-to-br from-emerald-900 via-zinc-900 to-zinc-950 text-white rounded-3xl p-6 shadow-md space-y-3 relative overflow-hidden">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              Panduan Dosen Pembimbing
            </div>
            <h4 className="font-bold text-sm leading-snug">
              Review & Verifikasi Log Bimbingan
            </h4>
            <p className="text-xs text-gray-300 font-light leading-relaxed">
              Klik nama mahasiswa pada tabel di samping untuk melihat rincian riwayat bimbingan, memberikan catatan revisi, dan memverifikasi persentase progres skripsi.
            </p>
          </div>
        </div>
      </div>

      {/* PDF Annotator Modal for Guidance Log (Lecturer Edit/View Mode) */}
      {annotatorGuidance && (
        <PdfAnnotatorModal
          isOpen={Boolean(annotatorGuidance)}
          onClose={() => setAnnotatorGuidance(null)}
          pdfUrl={
            annotatorGuidance.draftFilePath
              ? (annotatorGuidance.draftFilePath.startsWith('/')
                ? annotatorGuidance.draftFilePath
                : `/${annotatorGuidance.draftFilePath}`)
              : `/storage/drafts/${annotatorGuidance.draftFileName || 'draft.pdf'}`
          }
          fileName={annotatorGuidance.draftFileName || 'Draft Skripsi'}
          studentName={currentUser.name}
          mode="edit"
          bookingId={annotatorGuidance.bookingId || annotatorGuidance.id}
          initialAnnotations={annotatorGuidance.annotations || []}
          onSaveAnnotations={(updatedAnnotations: any) => {
            const allGuidances = DB.getGuidances();
            const updatedGuidances = allGuidances.map((g) =>
              g.id === annotatorGuidance.id ? { ...g, annotations: updatedAnnotations } : g
            );
            DB.saveGuidances(updatedGuidances);
            const freshObj = updatedGuidances.find((g) => g.id === annotatorGuidance.id);
            if (freshObj) {
              setAnnotatorGuidance(freshObj);
            }
            window.dispatchEvent(new Event('storage'));
          }}
        />
      )}
    </div>
  );
}