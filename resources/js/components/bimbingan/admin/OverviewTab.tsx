// bimbingan/admin/OverviewTab.tsx
import { GraduationCap, Clock } from 'lucide-react';
import { AppUser } from '@/types';

interface OverviewTabProps {
  currentUser: AppUser;
  totalLecturers: number;
  totalStudents: number;
  pendingProposals: number;
  activeTheses: number;
}

export default function OverviewTab({
  currentUser,
  totalLecturers,
  totalStudents,
  pendingProposals,
  activeTheses,
}: OverviewTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-emerald-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-md">
        <div className="relative z-10 max-w-xl">
          <span className="text-emerald-300 text-xs font-bold tracking-widest uppercase bg-emerald-800/50 px-3 py-1 rounded-full">
            Status Akademik Semester Aktif
          </span>
          <h1 className="font-display text-2xl lg:text-3xl font-bold mt-4 leading-tight">
            Selamat Datang, {currentUser.name}
          </h1>
          <p className="text-emerald-100 text-sm mt-2 font-light">
            {currentUser.role === 'admin'
              ? 'Kelola verifikasi akun pengguna baru dan terbitkan berkas SK bimbingan mahasiswa secara terintegrasi.'
              : 'Kelola pengajuan judul skripsi mahasiswa dan tunjuk dosen pembimbing terbaik secara terintegrasi.'}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <p className="text-gray-400 text-xs font-medium uppercase">Dosen Aktif</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold font-display text-gray-800">{totalLecturers}</span>
            <span className="text-xs text-gray-500">NIDN</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <p className="text-gray-400 text-xs font-medium uppercase">Mahasiswa Skripsi</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold font-display text-gray-800">{totalStudents}</span>
            <span className="text-xs text-gray-500">NPM</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <p className="text-gray-400 text-xs font-medium uppercase">Proposal Baru</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold font-display text-amber-600">{pendingProposals}</span>
            <span className="text-xs text-amber-600 font-semibold bg-amber-50 px-1.5 py-0.5 rounded">Butuh Review</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <p className="text-gray-400 text-xs font-medium uppercase">Bimbingan Aktif</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold font-display text-emerald-600">{activeTheses}</span>
            <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">In Progress</span>
          </div>
        </div>
      </div>

      {/* Quick Actions / Informational Section */}
      <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-6 text-left">
        {currentUser.role === 'admin' ? (
          <>
            <h4 className="text-sm font-semibold text-amber-800 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Alur Kerja Admin / Super Admin
            </h4>
            <ol className="list-decimal list-inside text-xs text-amber-800 mt-3 space-y-2 font-medium">
              <li>Buka tab <span className="font-bold underline">Akun & Verifikasi</span> untuk meninjau dan memverifikasi akun pendaftar baru.</li>
              <li>Ubah peran akun pendaftar baru menjadi <span className="font-bold">Mahasiswa</span> (serta isi NPM) atau <span className="font-bold">Dosen</span> (serta isi NIDN).</li>
              <li>Buka tab <span className="font-bold underline">Skripsi & Pembimbing</span> untuk menerbitkan dan mengunggah berkas SK Bimbingan bagi skripsi yang dosen pembimbingnya telah ditunjuk.</li>
            </ol>
          </>
        ) : (
          <>
            <h4 className="text-sm font-semibold text-amber-800 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Alur Kerja Kaprodi
            </h4>
            <ol className="list-decimal list-inside text-xs text-amber-800 mt-3 space-y-2 font-medium">
              <li>Buka tab <span className="font-bold underline">Seleksi Judul</span> jika ada notifikasi proposal judul baru.</li>
              <li>Pilih alternatif judul terbaik dari mahasiswa, klik "Setujui Judul ini". Judul terpilih otomatis diterima dan judul alternatif otomatis ditolak.</li>
              <li>Buka tab <span className="font-bold underline">Skripsi & Pembimbing</span> untuk menunjuk dosen pembimbing bagi skripsi yang baru disetujui.</li>
            </ol>
          </>
        )}
      </div>
    </div>
  );
}