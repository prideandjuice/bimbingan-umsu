// components/bimbingan/LecturerDashboard.tsx
import { useState } from 'react';
import { DB } from '@/db';
import type { AppUser, Guidance } from '@/types';

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
  const myStudents = theses.filter((t) => t.supervisorId === currentUser.id);
  const myEventTypes = eventTypes.filter((et) => et.lecturerId === currentUser.id);
  const myAvailabilities = availabilityRules.filter((ar) => ar.lecturerId === currentUser.id);
  const myBookings = bookings.filter((b) => b.lecturerId === currentUser.id);

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

  // Logika add/delete event types & availability disingkat dengan pola serupa...

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="lecturer-dashboard-container">
      <LecturerSidebar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        myStudents={myStudents}
        myBookings={myBookings}
        setSelectedThesisId={setSelectedThesisId}
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
            myEventTypes={myEventTypes}
            myAvailabilities={myAvailabilities}
            handleAddEventType={(name, dur, desc) => { /* logic */ }}
            handleDeleteEventType={(id) => { /* logic */ }}
            handleAddAvailability={(day, start, end) => { /* logic */ }}
            handleDeleteAvailability={(id) => { /* logic */ }}
          />
        )}
      </div>
    </div>
  );
}