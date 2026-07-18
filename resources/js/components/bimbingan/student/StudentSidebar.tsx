// components/bimbingan/student/StudentSidebarInfo.tsx
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import type { AppUser, Thesis, Guidance } from '@/types';

interface StudentSidebarInfoProps {
  currentUser: AppUser;
  myThesis: Thesis;
  verifiedGuidances: Guidance[];
  currentProgress: number;
}

export default function StudentSidebarInfo({
  currentUser,
  myThesis,
  verifiedGuidances,
  currentProgress,
}: StudentSidebarInfoProps) {
  return (
    <div className="lg:col-span-4 space-y-6">
      {/* Tampilan Profil Mini Mahasiswa */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <div className="text-center pb-4 border-b border-gray-100">
          <img src={currentUser.avatar} alt={currentUser.name} className="w-16 h-16 rounded-full object-cover mx-auto mb-3" />
          <h3 className="font-display font-bold text-gray-900 text-sm">{currentUser.name}</h3>
          <p className="text-xs text-gray-500 font-mono">NPM: {currentUser.npm}</p>
        </div>

        {/* Requirements Tracker */}
        <div className="pt-4 space-y-3 text-xs">
          <div className="flex items-center justify-between text-2xs">
            <span>Minimum Log Bimbingan</span>
            <span className="font-bold">{verifiedGuidances.length} / 8 Kali</span>
          </div>
          {/* ... Sisa progress check-list syarat sidang ... */}
        </div>
      </div>
    </div>
  );
}