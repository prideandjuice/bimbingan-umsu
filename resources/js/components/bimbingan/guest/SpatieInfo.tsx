// components/bimbingan/guest/SpatieInfo.tsx
import { ShieldAlert } from 'lucide-react';

export default function SpatieInfo() {
  return (
    <div className="border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 text-left mt-8 bg-gray-50/50 dark:bg-zinc-950/40 space-y-4">
      <div>
        <h3 className="text-xs font-bold text-gray-800 dark:text-zinc-200 flex items-center gap-1.5 uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4 text-emerald-700 dark:text-emerald-500" />
          Keamanan & Peran Pengguna (Spatie Rules)
        </h3>
        <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1.5 font-light leading-relaxed">
          Sistem kami menggunakan paket <code className="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 px-1 py-0.5 rounded font-mono text-2xs">spatie/laravel-permission</code> untuk mengatur otorisasi. Akun baru yang belum diverifikasi otomatis menduduki peran default <code className="bg-gray-100 dark:bg-zinc-800/80 text-emerald-800 dark:text-emerald-400 px-1 py-0.5 rounded font-mono text-2xs">guest</code>.
        </p>
      </div>

      <div className="border-t border-gray-100 dark:border-zinc-800 pt-3 text-xs">
        <p className="font-semibold text-gray-700 dark:text-zinc-300">Langkah Selanjutnya:</p>
        <ul className="list-disc list-inside text-gray-500 dark:text-zinc-400 mt-1.5 space-y-1 font-light">
          <li>Admin / Super Admin meninjau validitas email Anda.</li>
          <li>Admin / Super Admin mengonversi peran Anda menjadi <span className="font-bold text-gray-800 dark:text-zinc-200">Mahasiswa</span> (dan mengisi NPM) atau <span className="font-bold text-gray-800 dark:text-zinc-200">Dosen</span> (dan mengisi NIDN).</li>
        </ul>
      </div>
    </div>
  );
}