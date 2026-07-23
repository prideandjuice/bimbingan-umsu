// bimbingan/admin/AdminSidebar.tsx
import { GraduationCap, Layers, FileText, BookOpen, Users } from 'lucide-react';
import { AppUser } from '@/types';

interface AdminSidebarProps {
  currentUser: AppUser;
  activeTab: 'overview' | 'proposals' | 'theses' | 'users';
  setActiveTab: (tab: 'overview' | 'proposals' | 'theses' | 'users') => void;
  pendingProposals: number;
  pendingSupervisors: number;
}

export default function AdminSidebar({
  currentUser,
  activeTab,
  setActiveTab,
  pendingProposals,
  pendingSupervisors,
}: AdminSidebarProps) {
  return (
    <div className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm h-fit">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
          currentUser.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
        }`}>
          <GraduationCap className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-display font-bold text-gray-900 text-sm">
            {currentUser.role === 'admin' ? 'Admin Portal' : 'Kaprodi Portal'}
          </h3>
          <p className="text-xs text-gray-500">
            {currentUser.role === 'admin' ? 'Administrator' : (currentUser.department || 'Program Studi')}
          </p>
        </div>
      </div>

      <nav className="space-y-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
            activeTab === 'overview' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-55/60'
          }`}
          id="nav-overview"
        >
          <Layers className="w-4 h-4" />
          Ringkasan Sistem
        </button>

        {currentUser.role === 'prodi' && (
          <button
            onClick={() => setActiveTab('proposals')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'proposals' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50/60'
            }`}
            id="nav-proposals"
          >
            <FileText className="w-4 h-4" />
            Seleksi Judul
            {pendingProposals > 0 && (
              <span className="ml-auto bg-amber-500 text-white font-bold text-2xs px-2 py-0.5 rounded-full">
                {pendingProposals}
              </span>
            )}
          </button>
        )}

        <button
          onClick={() => setActiveTab('theses')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
            activeTab === 'theses'
              ? 'bg-emerald-50 text-emerald-700'
              : 'text-gray-600 hover:bg-gray-50/60'
          }`}
          id="nav-theses"
        >
          <BookOpen className="w-4 h-4" />
          Skripsi & Pembimbing
          {pendingSupervisors > 0 && (
            <span className="ml-auto bg-red-500 text-white font-bold text-2xs px-2 py-0.5 rounded-full">
              {pendingSupervisors}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
            activeTab === 'users'
              ? 'bg-emerald-50 text-emerald-700'
              : 'text-gray-600 hover:bg-gray-50/60'
          }`}
          id="nav-users"
        >
          <Users className="w-4 h-4" />
          Akun & Verifikasi
          {currentUser.role === 'prodi' && (
            <span className="ml-auto bg-gray-100 text-gray-500 font-semibold text-[10px] px-1.5 py-0.5 rounded-md">
              View Only
            </span>
          )}
        </button>
      </nav>
    </div>
  );
}