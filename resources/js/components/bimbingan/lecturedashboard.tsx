// components/bimbingan/LecturerDashboard.tsx
import { useState } from 'react';
import { DB } from '@/db';
import type { AppUser, Guidance, EventType, AvailabilityRule } from '@/types';

import LecturerSidebar from './lecturer/LecturerSidebar';
import StudentsTab from './lecturer/StudentsTab';
import BookingsTab from './lecturer/BookingsTab';
import SchedulingTab from './lecturer/SchedulingTab';

interface LecturerDashboardProps {
  currentUser: AppUser;
  onRefresh: () => void;
}

export default function LecturerDashboard({ currentUser, onRefresh }: LecturerDashboardProps) {
  // DB States
  const [theses, setTheses] = useState(DB.getTheses());
  const [guidances, setGuidances] = useState(DB.getGuidances());
  const [eventTypes, setEventTypes] = useState(DB.getEventTypes());
  const [availabilityRules, setAvailabilityRules] = useState(DB.getAvailabilityRules());
  const [bookings, setBookings] = useState(DB.getBookings());

  const [activeTab, setActiveTab] = useState<'students' | 'scheduling' | 'bookings'>('students');
  const [selectedThesisId, setSelectedThesisId] = useState<string | null>(null);

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

  // --- LOGIC FUNCTIONS (Tetap kelola di parent karena mutasi data DB utama) ---
  const handleVerifyGuidance = (guidanceId: string) => {
    const updated = guidances.map((g) => (g.id === guidanceId ? { ...g, status: 'verified' as const } : g));
    DB.saveGuidances(updated);
    refreshLocalData();
  };

  const handleLecturerSubmitGuidance = (data: Omit<Guidance, 'id' | 'status' | 'createdBy' | 'creatorName' | 'createdAt'>) => {
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
  };

  const handleProcessBookingSubmit = (bookingId: string, type: 'confirm' | 'reject', note: string) => {
    const updated = bookings.map((b) =>
      b.id === bookingId ? { ...b, status: (type === 'confirm' ? 'confirmed' : 'rejected') as any, notes: note || undefined } : b
    );
    DB.saveBookings(updated);
    refreshLocalData();
  };

  const handleCompleteBooking = (id: string) => {
    const updated = bookings.map((b) => (b.id === id ? { ...b, status: 'completed' as const } : b));
    DB.saveBookings(updated);
    refreshLocalData();
  };

  const handleAddEventType = (name: string, duration: number, description: string) => {
    const newEt: EventType = {
      id: `et-${Date.now()}`,
      lecturerId: currentUser.id,
      name,
      duration,
      description,
    };
    const updated = [...eventTypes, newEt];
    DB.saveEventTypes(updated);
    refreshLocalData();
  };

  const handleDeleteEventType = (id: string) => {
    const updated = eventTypes.filter((et) => et.id !== id);
    DB.saveEventTypes(updated);
    refreshLocalData();
  };

  const handleAddAvailability = (dayOfWeek: number, startTime: string, endTime: string, isDefault: boolean = false) => {
    const newAr: AvailabilityRule = {
      id: `ar-${Date.now()}`,
      lecturerId: currentUser.id,
      dayOfWeek,
      startTime,
      endTime,
      isDefault,
    };
    const updated = availabilityRules.map((ar) =>
      ar.lecturerId === currentUser.id && isDefault ? { ...ar, isDefault: false } : ar
    );
    updated.unshift(newAr);
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
      <LecturerSidebar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        myStudents={myStudents}
        myBookings={myBookings}
        setSelectedThesisId={setSelectedThesisId}
        guidances={guidances}
      />

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
            handleToggleDefaultAvailability={handleToggleDefaultAvailability}
            handleDeleteAvailability={handleDeleteAvailability}
          />
        )}
      </div>
    </div>
  );
}