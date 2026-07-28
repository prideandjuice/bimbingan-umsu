// components/bimbingan/LecturerDashboard.tsx
import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { DB } from '@/db';
import type { AppUser, Guidance, EventType, AvailabilityRule, AvailabilityRuleConfig } from '@/types';
import { toast } from 'sonner';

import LecturerSidebar from './lecturer/LecturerSidebar';
import StudentsTab from './lecturer/StudentsTab';
import BookingsTab from './lecturer/BookingsTab';
import SchedulingTab from './lecturer/SchedulingTab';
import RoleFooter from './RoleFooter';

interface LecturerDashboardProps {
  currentUser: AppUser;
  onRefresh: () => void;
  activeTab?: string;
}

export default function LecturerDashboard({ currentUser, onRefresh, activeTab: propActiveTab }: LecturerDashboardProps) {
  const { url } = usePage();

  // DB States
  const [theses, setTheses] = useState(DB.getTheses());
  const [guidances, setGuidances] = useState(DB.getGuidances());
  const [eventTypes, setEventTypes] = useState(DB.getEventTypes());
  const [availabilityRules, setAvailabilityRules] = useState(DB.getAvailabilityRules());
  const [bookings, setBookings] = useState(DB.getBookings());

  const [selectedThesisId, setSelectedThesisId] = useState<string | null>(null);

  // Determine active tab based on Controller prop or URL path fallback
  let activeTab: 'students' | 'scheduling' | 'bookings' = 'students';
  if (propActiveTab && propActiveTab !== 'overview' && propActiveTab !== 'students') {
    if (propActiveTab === 'bookings' || propActiveTab === 'persetujuan-jadwal' || propActiveTab === 'permohonan-jadwal') {
      activeTab = 'bookings';
    } else if (propActiveTab === 'scheduling' || propActiveTab === 'ketersediaan-waktu' || propActiveTab === 'atur-jadwal') {
      activeTab = 'scheduling';
    }
  } else if (url.includes('/dosen/persetujuan-jadwal') || url.includes('/dosen/permohonan-jadwal')) {
    activeTab = 'bookings';
  } else if (url.includes('/dosen/ketersediaan-waktu') || url.includes('/dosen/atur-jadwal')) {
    activeTab = 'scheduling';
  } else if (url.includes('/dosen/mahasiswa-bimbingan') || url.includes('/dosen/progres-mahasiswa') || url.includes('/dosen/verifikasi-log')) {
    activeTab = 'students';
  }

  const refreshLocalData = () => {
    setTheses(DB.getTheses());
    setGuidances(DB.getGuidances());
    setEventTypes(DB.getEventTypes());
    setAvailabilityRules(DB.getAvailabilityRules());
    setBookings(DB.getBookings());
    onRefresh();
  };

  // Data Derivasi
  const myStudents = theses.filter((t) => String(t.supervisorId) === String(currentUser.id) || t.supervisorId === 'user-lecturer-1');
  const myEventTypes = eventTypes.filter((et) => String(et.lecturerId) === String(currentUser.id) || et.lecturerId === 'user-lecturer-1');
  const myAvailabilities = availabilityRules.filter((ar) => String(ar.lecturerId) === String(currentUser.id) || ar.lecturerId === 'user-lecturer-1');
  const myBookings = bookings.filter((b) =>
    String(b.lecturerId) === String(currentUser.id) ||
    b.lecturerId === 'user-lecturer-1' ||
    (currentUser.role === 'lecturer' && (!b.lecturerName || b.lecturerName === currentUser.name))
  );

  // LOGIC FUNCTIONS
  const handleVerifyGuidance = (guidanceId: string) => {
    const targetGuidance = guidances.find((g) => g.id === guidanceId);
    const targetThesis = theses.find((t) => t.id === targetGuidance?.thesisId);

    if (!targetThesis?.skFile) {
      toast.error('Bimbingan belum dapat diverifikasi! Surat Keterangan (SK) Pembimbing belum diterbitkan oleh Admin.');
      return;
    }

    const updated = guidances.map((g) => (g.id === guidanceId ? { ...g, status: 'verified' as const } : g));
    DB.saveGuidances(updated);
    refreshLocalData();
    toast.success('Log bimbingan berhasil diverifikasi.');
  };

  const handleLecturerSubmitGuidance = (data: Omit<Guidance, 'id' | 'status' | 'createdBy' | 'creatorName' | 'createdAt'>) => {
    const targetThesis = theses.find((t) => t.id === data.thesisId);

    if (!targetThesis?.skFile) {
      toast.error('Gagal menambah bimbingan! Surat Keterangan (SK) Pembimbing belum diterbitkan oleh Admin.');
      return;
    }

    const newGuidance: Guidance = {
      ...data,
      id: `guidance-${Date.now()}`,
      createdBy: 'lecturer',
      creatorName: currentUser.name,
      status: 'verified',
      createdAt: new Date().toISOString(),
    };
    DB.saveGuidances([...guidances, newGuidance]);
    refreshLocalData();
    toast.success('Hasil bimbingan dosen berhasil dicatat.');
  };

  const handleProcessBookingSubmit = (bookingId: string, type: 'confirm' | 'reject', note: string) => {
    const targetBooking = bookings.find((b) => b.id === bookingId);
    if (type === 'confirm') {
      const studentThesis = theses.find(
        (t) => String(t.studentId) === String(targetBooking?.studentId) || t.studentNpm === targetBooking?.studentNpm
      );

      if (!studentThesis?.skFile) {
        toast.error('Tidak dapat mengonfirmasi janji temu: File SK Pembimbing mahasiswa ini belum diterbitkan oleh Admin.');
        return;
      }
    }

    const updated = bookings.map((b) =>
      b.id === bookingId ? { ...b, status: (type === 'confirm' ? 'confirmed' : 'rejected') as any, notes: note || undefined } : b
    );
    DB.saveBookings(updated);
    refreshLocalData();
    toast.success(type === 'confirm' ? 'Janji temu berhasil dikonfirmasi.' : 'Janji temu telah ditolak.');
  };

  const handleCompleteBooking = (id: string) => {
    const updated = bookings.map((b) => (b.id === id ? { ...b, status: 'completed' as const } : b));
    DB.saveBookings(updated);
    refreshLocalData();
  };

  const handleAddAvailability = (
    dayOfWeek: number,
    startTime: string,
    endTime: string,
    isDefault: boolean = false,
    rules?: AvailabilityRuleConfig
  ) => {
    const newAr: AvailabilityRule = {
      id: `ar-${Date.now()}`,
      lecturerId: currentUser.id,
      dayOfWeek,
      startTime,
      endTime,
      isDefault,
      rules,
    };
    const updated = availabilityRules.map((ar) =>
      ar.lecturerId === currentUser.id && isDefault ? { ...ar, isDefault: false } : ar
    );
    updated.unshift(newAr);
    DB.saveAvailabilityRules(updated);
    refreshLocalData();
  };

  const handleUpdateAvailability = (id: string, updatedRule: Partial<AvailabilityRule>) => {
    const updated = availabilityRules.map((ar) => {
      if (ar.id === id) {
        return { ...ar, ...updatedRule };
      }
      return ar;
    });
    DB.saveAvailabilityRules(updated);
    refreshLocalData();
  };

  const handleToggleDefaultAvailability = (id: string) => {
    const target = availabilityRules.find((ar) => ar.id === id);
    const nextDefault = !target?.isDefault;

    const updated = availabilityRules.map((ar) => {
      if (ar.lecturerId !== currentUser.id) return ar;
      if (ar.id === id) return { ...ar, isDefault: nextDefault };
      return nextDefault ? { ...ar, isDefault: false } : ar;
    });
    DB.saveAvailabilityRules(updated);
    refreshLocalData();
  };

  const handleDeleteAvailability = (id: string) => {
    const updated = availabilityRules.filter((ar) => ar.id !== id);
    DB.saveAvailabilityRules(updated);
    refreshLocalData();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="lecturer-dashboard-container">
      {/* 1. Left Sidebar Navigation */}
      <div className="lg:col-span-3">
        <LecturerSidebar
          currentUser={currentUser}
          activeTab={activeTab}
          myStudents={myStudents}
          myBookings={myBookings}
          setSelectedThesisId={setSelectedThesisId}
          guidances={guidances}
        />
      </div>

      {/* 2. Right Main Content Area */}
      <div className="lg:col-span-9 space-y-6">
        {activeTab === 'students' && (
          <StudentsTab
            currentUser={currentUser}
            myStudents={myStudents}
            guidances={guidances}
            selectedThesisId={selectedThesisId}
            setSelectedThesisId={setSelectedThesisId}
            handleVerifyGuidance={handleVerifyGuidance}
            handleLecturerSubmitGuidance={handleLecturerSubmitGuidance}
          />
        )}

        {activeTab === 'bookings' && (
          <BookingsTab
            myBookings={myBookings}
            handleProcessBookingSubmit={handleProcessBookingSubmit}
            handleCompleteBooking={handleCompleteBooking}
          />
        )}

        {activeTab === 'scheduling' && (
          <SchedulingTab
            myAvailabilities={myAvailabilities}
            handleAddAvailability={handleAddAvailability}
            handleUpdateAvailability={handleUpdateAvailability}
            handleToggleDefaultAvailability={handleToggleDefaultAvailability}
            handleDeleteAvailability={handleDeleteAvailability}
          />
        )}
      </div>

      <div className="lg:col-span-12">
        <RoleFooter role={currentUser.role} currentUser={currentUser} />
      </div>
    </div>
  );
}