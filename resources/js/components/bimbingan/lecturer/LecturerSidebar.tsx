import { UserCheck, Users, Calendar, Clock } from 'lucide-react';
import type { AppUser, Booking, Guidance, Thesis } from '@/types';

interface LecturerSidebarProps {
  currentUser: AppUser;
  activeTab: 'students' | 'scheduling' | 'bookings';
  setActiveTab: (tab: 'students' | 'scheduling' | 'bookings') => void;
  myStudents: Thesis[];
  myBookings: Booking[];
  setSelectedThesisId: (id: string | null) => void;
  guidances?: Guidance[];
}

export default function LecturerSidebar({
  currentUser,
  activeTab,
  setActiveTab,
  myStudents,
  myBookings,
  setSelectedThesisId,
  guidances = [],
}: LecturerSidebarProps) {
  const pendingBookingsCount = myBookings.filter((b) => b.status === 'pending').length;

  const studentThesisIds = myStudents.map((s) => s.id);
  const pendingFeedbackCount = guidances.filter(
    (g) => studentThesisIds.includes(g.thesisId) && g.status === 'pending_verification'
  ).length;

  return (
    <div className="lg:col-span-3 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm h-fit space-y-6 text-left">
      <div className="flex items-center gap-3 pb-5 border-b border-gray-100 dark:border-zinc-800">
        <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <UserCheck className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">Dosen Portal</h3>
          <p className="text-xs text-muted-foreground font-light">NIDN: {currentUser.nidn || 'N/A'}</p>
        </div>
      </div>

      <nav className="space-y-2">
        <button
          onClick={() => {
            if (activeTab !== 'students') {
              setActiveTab('students');
            }
            setSelectedThesisId(null);
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'students'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
          }`}
        >
          <Users className="w-4.5 h-4.5" />
          <span>Mahasiswa Bimbingan</span>
          {pendingFeedbackCount > 0 && (
            <span className={`ml-auto font-bold text-[10px] px-2 py-0.5 rounded-full shadow-xs ${
              activeTab === 'students' ? 'bg-amber-500 text-white animate-pulse' : 'bg-amber-500 text-white'
            }`}>
              {pendingFeedbackCount}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            if (activeTab !== 'bookings') {
              setActiveTab('bookings');
            }
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'bookings'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
          }`}
        >
          <Calendar className="w-4.5 h-4.5" />
          <span>Persetujuan Jadwal</span>
          {pendingBookingsCount > 0 && (
            <span className="ml-auto bg-amber-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-full">
              {pendingBookingsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            if (activeTab !== 'scheduling') {
              setActiveTab('scheduling');
            }
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'scheduling'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
          }`}
        >
          <Clock className="w-4.5 h-4.5" />
          <span>Ketersediaan Waktu</span>
        </button>
      </nav>
    </div>
  );
}