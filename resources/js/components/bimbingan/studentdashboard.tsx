import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { DB } from '@/db';
import type { AppUser, Proposal, ProposalTitle, Thesis, Guidance, Booking, EventType, AvailabilityRule } from '@/types';
import { toast } from 'sonner';

import StudentSidebarNav from './student/StudentSidebarNav';
import StudentOverviewTab from './student/StudentOverviewTab';
import StudentProposalTab from './student/StudentProposalTab';
import StudentStatusTab from './student/StudentStatusTab';
import ThesisActiveLayout from './student/ThesisActiveLayout';
import RoleFooter from './RoleFooter';

export type StudentTab = 'overview' | 'pengajuan-judul' | 'status-judul' | 'log-bimbingan' | 'booking-jadwal';

interface StudentDashboardProps {
  currentUser: AppUser;
  onRefresh: () => void;
  activeTab?: StudentTab | string;
}

export default function StudentDashboard({ currentUser, onRefresh, activeTab = 'overview' }: StudentDashboardProps) {
  const { props } = usePage<any>();

  const currentTab: StudentTab = ['overview', 'pengajuan-judul', 'status-judul', 'log-bimbingan', 'booking-jadwal'].includes(activeTab)
    ? (activeTab as StudentTab)
    : 'overview';

  // DB States (Initialized from Inertia Props with fallback to localStorage)
  const [proposals, setProposals] = useState<Proposal[]>(props?.dbProposals?.length ? props.dbProposals : DB.getProposals());
  const [proposalTitles, setProposalTitles] = useState<ProposalTitle[]>(props?.dbProposalTitles?.length ? props.dbProposalTitles : DB.getProposalTitles());
  const [theses, setTheses] = useState<Thesis[]>(props?.dbTheses?.length ? props.dbTheses : DB.getTheses());
  const [guidances, setGuidances] = useState<Guidance[]>(props?.dbGuidances?.length ? props.dbGuidances : DB.getGuidances());
  const [eventTypes, setEventTypes] = useState<EventType[]>(props?.dbEventTypes?.length ? props.dbEventTypes : DB.getEventTypes());
  const [availabilityRules, setAvailabilityRules] = useState<AvailabilityRule[]>(props?.dbAvailabilityRules?.length ? props.dbAvailabilityRules : DB.getAvailabilityRules());
  const [bookings, setBookings] = useState<Booking[]>(props?.dbBookings?.length ? props.dbBookings : DB.getBookings());

  // Find student's current status
  const myProposal = proposals.find((p: Proposal) => p && (String(p.studentId) === String(currentUser.id) || p.studentName === currentUser.name));
  const myTitles = myProposal ? proposalTitles.filter((t: ProposalTitle) => t && String(t.proposalId) === String(myProposal.id)) : [];
  const myThesis = theses.find((t: Thesis) => t && (String(t.studentId) === String(currentUser.id) || (currentUser.npm && String(t.studentNpm) === String(currentUser.npm))));
  const myGuidances = guidances.filter((g: Guidance) =>
    g && (
      (myThesis && String(g.thesisId) === String(myThesis.id)) ||
      g.thesisId === 'thesis-auto' ||
      (g as any).studentId === currentUser.id ||
      g.creatorName === currentUser.name
    )
  );
  const myBookings = bookings.filter((b: Booking) =>
    b && (
      String(b.studentId) === String(currentUser.id) ||
      (currentUser.npm && String(b.studentNpm) === String(currentUser.npm)) ||
      (currentUser.name && b.studentName === currentUser.name) ||
      !b.studentId
    )
  );

  const refreshLocalData = () => {
    setProposals(DB.getProposals());
    setProposalTitles(DB.getProposalTitles());
    setTheses(DB.getTheses());
    setGuidances(DB.getGuidances());
    setEventTypes(DB.getEventTypes());
    setAvailabilityRules(DB.getAvailabilityRules());
    setBookings(DB.getBookings());
    onRefresh();
  };

  // Callback Mutations
  const onSubmitProposal = (items: Array<{ title: string; abstract: string }>) => {
    const proposalId = `prop-${Date.now()}`;
    const mainAbstract = items[0]?.abstract || '';
    const newProposal: Proposal = {
      id: proposalId,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentNpm: currentUser.npm || 'N/A',
      prodi: currentUser.department || 'Magister Ilmu Komunikasi',
      abstract: mainAbstract,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    const titlesToInsert: ProposalTitle[] = items.map((item, idx) => ({
      id: `title-${proposalId}-${idx}`,
      proposalId: proposalId,
      title: item.title.trim(),
      abstract: item.abstract.trim(),
      status: 'PENDING'
    }));

    DB.saveProposals([...proposals, newProposal]);
    DB.saveProposalTitles([...proposalTitles, ...titlesToInsert]);
    refreshLocalData();
  };

  const onAddGuidanceLog = (date: string, notes: string, revisions: string, progress: number) => {
    if (!myThesis) return;
    const newGuidance: Guidance = {
      id: `guidance-${Date.now()}`,
      thesisId: myThesis.id,
      date,
      notes,
      revisions,
      progress,
      createdBy: 'student',
      creatorName: currentUser.name,
      status: 'pending_verification',
      createdAt: new Date().toISOString()
    };
    DB.saveGuidances([...guidances, newGuidance]);
    refreshLocalData();
  };

  const onBookMeeting = async (eventTypeId: string, date: string, slot: string, notes: string, draftFileInput?: File | string | null) => {
    if (!myThesis) return;
    const supervisorName = myThesis.supervisorName || 'Dosen Pembimbing';

    let uploadedFileName: string | null = null;
    let uploadedFilePath: string | null = null;

    if (draftFileInput instanceof File) {
      uploadedFileName = draftFileInput.name;
      try {
        uploadedFilePath = URL.createObjectURL(draftFileInput);
      } catch (e) {
        // fallback
      }
      try {
        const formData = new FormData();
        formData.append('file', draftFileInput);

        const uploadRes = await fetch('/bimbingan/upload-draft', {
          method: 'POST',
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
          },
          body: formData,
        });

        if (uploadRes.ok) {
          const data = await uploadRes.json();
          if (data.filePath) {
            uploadedFileName = data.fileName || draftFileInput.name;
            uploadedFilePath = data.filePath;
          }
        }
      } catch (err) {
        console.error('Draft file upload error:', err);
      }
    } else if (typeof draftFileInput === 'string' && draftFileInput.trim() !== '') {
      uploadedFileName = draftFileInput;
      uploadedFilePath = '/storage/drafts/pdf_65404.pdf';
    } else {
      uploadedFileName = null;
      uploadedFilePath = null;
    }

    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      thesisId: myThesis.id,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentNpm: currentUser.npm || 'N/A',
      lecturerId: myThesis.supervisorId || 'user-lecturer-1',
      lecturerName: supervisorName,
      eventTypeId: eventTypeId || 'default-bimbingan',
      eventTypeName: 'Konsultasi Bimbingan',
      date,
      timeSlot: slot,
      status: 'pending',
      notes,
      draftFileName: uploadedFileName,
      draftFilePath: uploadedFilePath,
      createdAt: new Date().toISOString(),
    };

    DB.saveBookings([...bookings, newBooking]);
    refreshLocalData();

    fetch('/bimbingan/sync/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({ bookings: [newBooking] }),
    }).catch(() => { });
  };

  const onCancelBooking = (bookingId: string) => {
    const updated = bookings.filter((b: Booking) => b.id !== bookingId);
    setBookings(updated);
    DB.saveBookings(updated);
    refreshLocalData();
    toast.success('Pengajuan janji temu berhasil dibatalkan/dihapus.');
  };

  const verifiedGuidances = myGuidances.filter((g: Guidance) => g.status === 'verified');
  const currentProgress = verifiedGuidances.length > 0 ? Math.max(...verifiedGuidances.map((g: Guidance) => g.progress)) : 0;
  const mySupervisorEventTypes = eventTypes.filter((et: EventType) => {
    if (!et) return false;
    if (!myThesis?.supervisorId) return true;
    return (
      String(et.lecturerId) === String(myThesis.supervisorId) ||
      et.lecturerId === 'user-lecturer-1' ||
      !et.lecturerId
    );
  });
  const mySupervisorAvailability = myThesis?.supervisorId
    ? availabilityRules.filter((ar: AvailabilityRule) => String(ar.lecturerId) === String(myThesis.supervisorId) || ar.lecturerId === 'user-lecturer-1')
    : availabilityRules;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="student-dashboard-layout">
      {/* 1. Left Sidebar Navigation Panel */}
      <div className="lg:col-span-3">
        <StudentSidebarNav
          currentUser={currentUser}
          activeTab={currentTab}
          myProposal={myProposal}
          myThesis={myThesis}
          myGuidances={myGuidances}
          myBookings={myBookings}
        />
      </div>

      {/* 2. Right Main Content Area */}
      <div className="lg:col-span-9 space-y-6">
        {/* ROUTE 1: OVERVIEW DASHBOARD UTAMA */}
        {activeTab === 'overview' && (
          <StudentOverviewTab
            currentUser={currentUser}
            myProposal={myProposal}
            myThesis={myThesis}
            verifiedCount={verifiedGuidances.length}
            currentProgress={currentProgress}
            myBookings={myBookings}
          />
        )}

        {/* ROUTE 2: PENGAJUAN JUDUL */}
        {activeTab === 'pengajuan-judul' && (
          <StudentProposalTab
            currentUser={currentUser}
            myProposal={myProposal}
            myThesis={myThesis}
            myTitles={myTitles}
            onSubmitProposal={onSubmitProposal}
          />
        )}

        {/* ROUTE 3: STATUS PERSETUJUAN */}
        {activeTab === 'status-judul' && (
          <StudentStatusTab
            myProposal={myProposal}
            myThesis={myThesis}
            proposalTitles={proposalTitles}
            onRefresh={onRefresh}
          />
        )}

        {/* ROUTE 4: LOG BIMBINGAN */}
        {activeTab === 'log-bimbingan' && (
          <div className="w-full">
            <ThesisActiveLayout
              currentUser={currentUser}
              myThesis={myThesis || {
                id: 'thesis-auto',
                studentId: currentUser.id,
                studentName: currentUser.name,
                studentNpm: currentUser.npm || '',
                title: 'Skripsi / Bimbingan Akademik',
                supervisorId: 'super-1',
                supervisorName: 'Dosen Pembimbing UMSU',
                status: 'ACTIVE',
              }}
              proposals={proposals}
              myGuidances={myGuidances}
              myBookings={myBookings}
              mySupervisorEventTypes={mySupervisorEventTypes}
              mySupervisorAvailability={mySupervisorAvailability}
              currentProgress={currentProgress}
              handleSubmitGuidance={onAddGuidanceLog}
              handleBookMeeting={onBookMeeting}
              handleCancelBooking={onCancelBooking}
              initialTab="guidances"
            />
          </div>
        )}

        {/* ROUTE 5: BOOKING JADWAL */}
        {activeTab === 'booking-jadwal' && (
          <div className="w-full">
            <ThesisActiveLayout
              currentUser={currentUser}
              myThesis={myThesis || {
                id: 'thesis-auto',
                studentId: currentUser.id,
                studentName: currentUser.name,
                studentNpm: currentUser.npm || '',
                title: 'Skripsi / Bimbingan Akademik',
                supervisorId: 'super-1',
                supervisorName: myBookings[0]?.lecturerName || 'Dosen Pembimbing UMSU',
                status: 'ACTIVE',
              }}
              proposals={proposals}
              myGuidances={myGuidances}
              myBookings={myBookings}
              mySupervisorEventTypes={mySupervisorEventTypes}
              mySupervisorAvailability={mySupervisorAvailability}
              currentProgress={currentProgress}
              handleSubmitGuidance={onAddGuidanceLog}
              handleBookMeeting={onBookMeeting}
              handleCancelBooking={onCancelBooking}
              initialTab="bookings"
            />
          </div>
        )}
      </div>

      <div className="lg:col-span-12">
        <RoleFooter role={currentUser.role} currentUser={currentUser} />
      </div>
    </div>
  );
}