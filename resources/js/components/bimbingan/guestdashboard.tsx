// components/bimbingan/GuestDashboard.tsx
import { Clock } from 'lucide-react';
import type { AppUser } from '@/types';

import SpatieInfo from './guest/SpatieInfo';
import DemoHelper from './guest/DemoHelper';

interface GuestDashboardProps {
  currentUser: AppUser;
  onRefresh: () => void;
}

export default function GuestDashboard({ currentUser, onRefresh }: GuestDashboardProps) {
  return (
    <div className="max-w-xl mx-auto bg-white border border-gray-100 rounded-3xl p-8 shadow-sm text-center" id="guest-dashboard-container">
      {/* Icon & Badge Status */}
      <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mx-auto mb-5 animate-pulse">
        <Clock className="w-8 h-8" />
      </div>

      <span className="text-3xs font-bold uppercase text-amber-700 bg-amber-50 px-3 py-1 rounded-full tracking-wider">
        Menunggu Verifikasi Kaprodi
      </span>

      {/* Welcome Heading */}
      <h1 className="font-display font-bold text-2xl text-gray-900 mt-4 leading-snug">
        Akun Anda Berhasil Terdaftar!
      </h1>
      <p className="text-sm text-gray-500 mt-2 font-light">
        Halo, <span className="font-semibold text-gray-800">{currentUser.name}</span>. Akun Anda telah dibuat melalui integrasi Single Sign-On (Google SSO) dengan email <span className="font-mono text-xs font-semibold text-gray-700">{currentUser.email}</span>.
      </p>

      {/* 1. Komponen Informasi Keamanan Spatie */}
      <SpatieInfo />

      {/* 2. Komponen Tips Pengujian Cepat */}
      <DemoHelper currentUserName={currentUser.name} onRefresh={onRefresh} />
    </div>
  );
}