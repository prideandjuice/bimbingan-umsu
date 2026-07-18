// components/bimbingan/lecturer/LecturerSidebar.tsx
import { UserCheck, Users, Calendar, Clock } from 'lucide-react';
import type { AppUser, Booking, Thesis } from '@/types';

interface LecturerSidebarProps {
  currentUser: AppUser;
  activeTab: 'students' | 'scheduling' | 'bookings';
  setActiveTab: (tab: 'students' | 'scheduling' | 'bookings') => void;
  myStudents: Thesis[];
  myBookings: Booking[];
  setSelectedThesisId: (id: string | null) => void;
}

export default function LecturerSidebar({
  currentUser,
  activeTab,
  setActiveTab,
  myStudents,
  myBookings,
  setSelectedThesisId,
}: LecturerSidebarProps) {
  const pendingBookingsCount = myBookings.filter((b) => b.status === 'pending').length;

  return (
    <div className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm h-fit">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
          <UserCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-display font-bold text-gray-900 text-sm">Dosen Portal</h3>
          <p className="text-xs text-gray-500">NIDN: {currentUser.nidn || 'N/A'}</p>
        </div>
      </div>

      <nav className="space-y-1">
        <button
          onClick={() => {
            setActiveTab('students');
            setSelectedThesisId(null);
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
            activeTab === 'students' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Users className="w-4 h-4" />
          Mahasiswa Bimbingan
          {myStudents.length > 0 && (
            <span className="ml-auto bg-emerald-600 text-white font-bold text-2xs px-2 py-0.5 rounded-full">
              {myStudents.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
            activeTab === 'bookings' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Persetujuan Jadwal
          {pendingBookingsCount > 0 && (
            <span className="ml-auto bg-amber-500 text-white font-bold text-2xs px-2 py-0.5 rounded-full">
              {pendingBookingsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('scheduling')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
            activeTab === 'scheduling' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Clock className="w-4 h-4" />
          Ketersediaan Waktu
        </button>
      </nav>
    </div>
  );
}