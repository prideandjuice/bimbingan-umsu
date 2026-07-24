import { Clock, LogOut } from 'lucide-react';
import type { AppUser } from '@/types';
import { Link } from '@inertiajs/react';

import SpatieInfo from './guest/SpatieInfo';

interface GuestDashboardProps {
  currentUser: AppUser;
  onRefresh: () => void;
}

export default function GuestDashboard({ currentUser, onRefresh }: GuestDashboardProps) {
  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl p-8 shadow-sm text-center" id="guest-dashboard-container">
      {/* Icon & Badge Status */}
      <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/20 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 mx-auto mb-5 animate-pulse">
        <Clock className="w-8 h-8" />
      </div>

      <span className="text-3xs font-bold uppercase text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-3 py-1 rounded-full tracking-wider">
        Menunggu Verifikasi Admin / Super Admin
      </span>

      {/* Welcome Heading */}
      <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white mt-4 leading-snug">
        Akun Anda Berhasil Terdaftar!
      </h1>
      <p className="text-sm text-gray-500 dark:text-zinc-400 mt-2 font-light">
        Halo, <span className="font-semibold text-gray-800 dark:text-zinc-200">{currentUser.name}</span>. Akun Anda telah dibuat melalui integrasi Single Sign-On (Google SSO) dengan email <span className="font-mono text-xs font-semibold text-gray-700 dark:text-zinc-300">{currentUser.email}</span>.
      </p>

      {/* 1. Komponen Informasi Keamanan Spatie */}
      <SpatieInfo />

      <div className="mt-8 border-t border-gray-100 dark:border-zinc-800 pt-6">
        <Link
          href={route('logout')}
          method="post"
          as="button"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-red-200 dark:border-red-900/30 rounded-xl text-xs font-semibold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors w-full cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Keluar (Logout)
        </Link>
      </div>
    </div>
  );
}