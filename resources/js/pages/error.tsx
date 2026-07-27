// pages/error.tsx
import { Link, Head } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, Home, ShieldAlert, FileSearch, ServerCrash, Wrench } from 'lucide-react';

interface ErrorPageProps {
  status: number;
  message?: string;
}

export default function ErrorPage({ status, message }: ErrorPageProps) {
  const errorConfig: Record<number, { title: string; defaultMessage: string; icon: any; badge: string }> = {
    403: {
      title: 'Akses Ditolak (Forbidden)',
      defaultMessage: 'Anda tidak memiliki hak akses untuk membuka halaman atau fitur ini. Silakan hubungi Administrator jika ini adalah kesalahan.',
      icon: ShieldAlert,
      badge: '403 Forbidden',
    },
    404: {
      title: 'Halaman Tidak Ditemukan',
      defaultMessage: 'Maaf, alamat URL halaman yang Anda tuju tidak ditemukan atau telah dipindahkan.',
      icon: FileSearch,
      badge: '404 Not Found',
    },
    500: {
      title: 'Kesalahan Server Internal',
      defaultMessage: 'Terjadi kendala pada sistem server kami. Tim teknis sedang berusaha menyelesaikan masalah ini.',
      icon: ServerCrash,
      badge: '500 Server Error',
    },
    503: {
      title: 'Layanan Dalam Pemeliharaan',
      defaultMessage: 'Sistem sedang dalam proses pemeliharaan berkala. Silakan coba beberapa saat lagi.',
      icon: Wrench,
      badge: '503 Maintenance',
    },
  };

  const config = errorConfig[status] || {
    title: `Terjadi Kesalahan (${status})`,
    defaultMessage: 'Terjadi kendala saat memproses permintaan Anda.',
    icon: AlertTriangle,
    badge: `HTTP Status ${status}`,
  };

  const IconComponent = config.icon;
  const displayMessage = message || config.defaultMessage;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 md:p-6 relative overflow-hidden font-sans">
      <Head title={`${status} - ${config.title}`} />

      {/* Decorative Gradient Glow Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 md:p-10 shadow-2xl space-y-6 text-center relative z-10">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700 text-xs font-mono text-zinc-300 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>{config.badge}</span>
        </div>

        {/* Icon */}
        <div className="relative mx-auto w-20 h-20 rounded-3xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shadow-lg shadow-black/40">
          <IconComponent className="w-10 h-10 text-emerald-400" />
        </div>

        {/* Title & Message */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">{config.title}</h1>
          <p className="text-sm text-zinc-400 leading-relaxed font-normal">{displayMessage}</p>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-all border border-zinc-700 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali Ke Halaman Sebelumnya</span>
          </button>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/20 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Ke Dashboard</span>
          </Link>
        </div>

        {/* Footer info */}
        <p className="text-[11px] text-zinc-600 font-mono pt-4 border-t border-zinc-800/80">
          Sistem Informasi Skripsi UMSU &bull; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
