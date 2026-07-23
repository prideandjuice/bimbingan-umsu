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
  Plus
} from 'lucide-react';
import type { AppUser, Guidance, Thesis } from '@/types';

interface StudentsTabProps {
  currentUser: AppUser;
  myStudents: Thesis[];
  guidances: Guidance[];
  selectedThesisId: string | null;
  setSelectedThesisId: (id: string | null) => void;
  handleVerifyGuidance: (id: string) => void;
  handleLecturerSubmitGuidance: (newGuidance: Omit<Guidance, 'id' | 'status' | 'createdBy' | 'creatorName' | 'createdAt'>) => void;
}

export default function StudentsTab({
  currentUser,
  myStudents,
  guidances,
  selectedThesisId,
  setSelectedThesisId,
  handleVerifyGuidance,
  handleLecturerSubmitGuidance,
}: StudentsTabProps) {
  // Form State Bimbingan Dosen
  const [lGDate, setLGDate] = useState(new Date().toISOString().split('T')[0]);
  const [lGNotes, setLGNotes] = useState('');
  const [lGRevisions, setLGRevisions] = useState('');
  const [lGProgress, setLGProgress] = useState(10);
  const [showAddLog, setShowAddLog] = useState(false);

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
    const studentLogs = guidances.filter(g => g.thesisId === thesisId && g.status === 'verified');
    if (studentLogs.length === 0) return 10;
    return Math.max(...studentLogs.map(g => g.progress));
  };

  // --- JIKA DOSEN SUDAH MEMILIH SATU MAHASISWA (DETAIL VIEW) ---
  if (selectedThesisId) {
    const activeThesis = myStudents.find((s) => s.id === selectedThesisId);
    if (!activeThesis) return null;
    const studentGuidances = guidances.filter((g) => g.thesisId === activeThesis.id);
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

            <button
              onClick={() => setShowAddLog(!showAddLog)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 self-start sm:self-auto shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {showAddLog ? 'Batal' : 'Tambah Catatan Dosen'}
            </button>
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
                      <button
                        onClick={() => handleVerifyGuidance(g.id)}
                        className="bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        Verifikasi Catatan
                      </button>
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
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- TAMPILAN UTAMA (LECTURER OVERVIEW DASHBOARD SAMA SEPERTI PROTOTYPE SCREENSHOT) ---
  return (
    <div className="space-y-6 text-left">
      {/* 1. Header Welcome Dosen */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Selamat Datang, {currentUser.name}
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground font-light mt-1">
          Berikut adalah ringkasan progres bimbingan skripsi mahasiswa Anda hari ini.
        </p>
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
                              <p className="text-[11px] text-muted-foreground font-light mt-0.5">
                                {s.studentNpm || 'N/A'}
                              </p>
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
    </div>
  );
}