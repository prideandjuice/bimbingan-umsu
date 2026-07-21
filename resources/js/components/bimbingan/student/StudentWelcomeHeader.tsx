import { AppUser } from '@/types';
import { GraduationCap, Calendar, User, BookOpen } from 'lucide-react';

interface StudentWelcomeHeaderProps {
  currentUser: AppUser;
}

export default function StudentWelcomeHeader({ currentUser }: StudentWelcomeHeaderProps) {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-600 text-white p-6 md:p-8 shadow-md">
      {/* Decorative blurred circles */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 left-1/4 w-36 h-36 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-medium text-emerald-100">
            <GraduationCap className="w-3.5 h-3.5" />
            Portal Akademik Pascasarjana
          </span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Selamat Datang, {currentUser.name}
          </h1>
          <p className="text-emerald-100/90 text-sm font-light leading-relaxed max-w-xl">
            Selamat datang di sistem manajemen bimbingan tesis. Silakan lengkapi pengajuan judul tesis Anda di bawah ini untuk memulai proses bimbingan digital bersama dosen pembimbing.
          </p>
        </div>

        {/* Student Meta Details Card */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/15 p-5 rounded-2xl space-y-3 shrink-0 md:w-80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
              <User className="w-4 h-4 text-emerald-200" />
            </div>
            <div>
              <p className="text-[10px] text-emerald-200/80 leading-none">NPM / NIM</p>
              <p className="text-sm font-semibold mt-0.5">{currentUser.npm || '2210000001'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-emerald-200" />
            </div>
            <div>
              <p className="text-[10px] text-emerald-200/80 leading-none">Program Studi</p>
              <p className="text-sm font-semibold mt-0.5">{currentUser.department || 'Magister Ilmu Komunikasi'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 pt-1 border-t border-white/10">
            <Calendar className="w-4 h-4 text-emerald-200" />
            <span className="text-xs text-emerald-100/90 font-light">{currentDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
