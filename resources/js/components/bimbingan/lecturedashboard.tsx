// components/bimbingan/LecturerDashboard.tsx
import type { AppUser } from '@/types';

import LecturerSidebar from './lecturer/LecturerSidebar';
import StudentsTab from './lecturer/StudentsTab';
import BookingsTab from './lecturer/BookingsTab';
import SchedulingTab from './lecturer/SchedulingTab';
import EventTypesTab from './lecturer/EventTypesTab';
import RoleFooter from './RoleFooter';
import { useLecturerLogic } from './lecturer/LecturerLogic';

interface LecturerDashboardProps {
  currentUser: AppUser;
  onRefresh: () => void;
  activeTab?: string;
}

export default function LecturerDashboard({ currentUser, onRefresh, activeTab: propActiveTab }: LecturerDashboardProps) {
  const {
    activeTab,
    myStudents,
    myEventTypes,
    myAvailabilities,
    myBookings,
    guidances,
    selectedThesisId,
    setSelectedThesisId,
    handleVerifyGuidance,
    handleLecturerSubmitGuidance,
    handleProcessBookingSubmit,
    handleCompleteBooking,
    handleAddAvailability,
    handleSetAllAvailabilities,
    handleUpdateAvailability,
    handleToggleDefaultAvailability,
    handleDeleteAvailability,
    handleAddEventType,
    handleUpdateEventType,
    handleDeleteEventType,
  } = useLecturerLogic({ currentUser, onRefresh, propActiveTab });

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

        {activeTab === 'eventTypes' && (
          <EventTypesTab
            myEventTypes={myEventTypes}
            myAvailabilities={myAvailabilities}
            handleAddEventType={handleAddEventType}
            handleUpdateEventType={handleUpdateEventType}
            handleDeleteEventType={handleDeleteEventType}
          />
        )}

        {activeTab === 'scheduling' && (
          <SchedulingTab
            myAvailabilities={myAvailabilities}
            handleAddAvailability={handleAddAvailability}
            handleSetAllAvailabilities={handleSetAllAvailabilities}
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