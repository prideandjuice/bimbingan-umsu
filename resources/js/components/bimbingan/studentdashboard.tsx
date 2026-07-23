// components/bimbingan/StudentDashboard.tsx
import { useState } from 'react';
import { DB } from '@/db';
import type { AppUser, Proposal, ProposalTitle, Thesis, Guidance, Booking } from '@/types';

import ProposalForm from './student/ProposalForm';
import ProposalPending from './student/ProposalPending';
import ThesisActiveLayout from './student/ThesisActiveLayout';
import StudentSidebarinfo from './student/StudentSidebar';

import StudentWelcomeHeader from './student/StudentWelcomeHeader';
import ThesisJourneyTimeline from './student/ThesisJourneyTimeline';
import AcademicGuidelineCard from './student/AcademicGuidelineCard';

interface StudentDashboardProps {
  currentUser: AppUser;
  onRefresh: () => void;
}

export default function StudentDashboard({ currentUser, onRefresh }: StudentDashboardProps) {
  // DB States
  const [proposals, setProposals] = useState(DB.getProposals());
  const [proposalTitles, setProposalTitles] = useState(DB.getProposalTitles());
  const [theses, setTheses] = useState(DB.getTheses());
  const [guidances, setGuidances] = useState(DB.getGuidances());
  const [eventTypes, setEventTypes] = useState(DB.getEventTypes());
  const [availabilityRules, setAvailabilityRules] = useState(DB.getAvailabilityRules());
  const [bookings, setBookings] = useState(DB.getBookings());

  // Find student's current status
  const myProposal = proposals.find(p => p.studentId === currentUser.id);
  const myThesis = theses.find(t => t.studentId === currentUser.id);
  const myGuidances = myThesis ? guidances.filter(g => g.thesisId === myThesis.id) : [];
  const myBookings = bookings.filter(b => b.studentId === currentUser.id);

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

  // Callback Mutations (Tetap di induk utama karena memodifikasi DB lokal)
  const onSubmitProposal = (items: Array<{ title: string; abstract: string }>) => {
    const proposalId = `prop-${Date.now()}`;
    const mainAbstract = items[0]?.abstract || '';
    const newProposal: Proposal = {
      id: proposalId,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentNpm: currentUser.npm || 'N/A',
      department: currentUser.department || 'Magister Ilmu Komunikasi',
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

  // ... Pertahankan logic fungsi handleBookMeeting di sini ...

  const verifiedGuidances = myGuidances.filter(g => g.status === 'verified');
  const currentProgress = verifiedGuidances.length > 0 ? Math.max(...verifiedGuidances.map(g => g.progress)) : 0;
  const mySupervisorEventTypes = myThesis?.supervisorId ? eventTypes.filter(et => et.lecturerId === myThesis.supervisorId) : [];
  const mySupervisorAvailability = myThesis?.supervisorId ? availabilityRules.filter(ar => ar.lecturerId === myThesis.supervisorId) : [];

  return (
    <div className="space-y-6" id="student-dashboard-container">

      {/* SCENARIO A: Belum ada proposal */}
      {!myProposal && !myThesis && (
        <div className="space-y-6">
          <StudentWelcomeHeader currentUser={currentUser} />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <ProposalForm currentUser={currentUser} onSubmitProposal={onSubmitProposal} />
            </div>
            <div className="lg:col-span-4 space-y-6">
              <ThesisJourneyTimeline />
              <AcademicGuidelineCard />
            </div>
          </div>
        </div>
      )}

      {/* SCENARIO B: Pengajuan menunggu review */}
      {myProposal && !myThesis && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <ProposalPending myProposal={myProposal} proposalTitles={proposalTitles} onRefresh={onRefresh} />
          </div>
          <div className="lg:col-span-4 space-y-6">
            <ThesisJourneyTimeline />
            <AcademicGuidelineCard />
          </div>
        </div>
      )}

      {/* SCENARIO C: Skripsi disetujui & Masa Bimbingan Aktif */}
      {myThesis && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="active-thesis-layout">
          <ThesisActiveLayout
            currentUser={currentUser}
            myThesis={myThesis}
            proposals={proposals}
            myGuidances={myGuidances}
            myBookings={myBookings}
            mySupervisorEventTypes={mySupervisorEventTypes}
            mySupervisorAvailability={mySupervisorAvailability}
            currentProgress={currentProgress}
            handleSubmitGuidance={onAddGuidanceLog}
            handleBookMeeting={() => { /* logic */ }}
          />

          <StudentSidebarinfo
            currentUser={currentUser}
            myThesis={myThesis}
            verifiedGuidances={verifiedGuidances}
            currentProgress={currentProgress}
          />
        </div>
      )}
    </div>
  );
}