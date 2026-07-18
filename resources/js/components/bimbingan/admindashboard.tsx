// bimbingan/AdminDashboard.tsx
import { useState } from 'react';
import { DB } from '@/db';
import type { AppUser, Proposal, ProposalTitle, Thesis, UserRole } from '@/types';

import AdminSidebar from './admin/AdminSidebar';
import OverviewTab from './admin/OverviewTab';
import ProposalsTab from './admin/ProposalsTab';
import ThesesTab from './admin/ThesesTab';
import UsersTab from './admin/UsersTab';

interface AdminDashboardProps {
  currentUser: AppUser;
  onRefresh: () => void;
}

export default function AdminDashboard({ currentUser, onRefresh }: AdminDashboardProps) {
  const [users, setUsers] = useState<AppUser[]>(DB.getUsers());
  const [proposals, setProposals] = useState<Proposal[]>(DB.getProposals());
  const [proposalTitles, setProposalTitles] = useState<ProposalTitle[]>(DB.getProposalTitles());
  const [theses, setTheses] = useState<Thesis[]>(DB.getTheses());
  const [activeTab, setActiveTab] = useState<'overview' | 'proposals' | 'theses' | 'users'>('overview');

  const handleApproveTitle = (proposalId: string, approvedTitleId: string) => {
    const proposal = proposals.find(p => p.id === proposalId);
    if (!proposal) return;

    const acceptedTitleObj = proposalTitles.find(t => t.id === approvedTitleId);
    if (!acceptedTitleObj) return;

    const updatedProposals = proposals.map(p => 
      p.id === proposalId ? { ...p, status: 'processed' as const } : p
    );

    const updatedTitles = proposalTitles.map(t => {
      if (t.proposalId === proposalId) {
        return t.id === approvedTitleId
          ? { ...t, status: 'ACCEPTED' as const, notes: 'Judul disetujui oleh Kaprodi.' }
          : { ...t, status: 'REJECTED' as const, notes: 'Judul lain telah disetujui.' };
      }
      return t;
    });

    const newThesis: Thesis = {
      id: `thesis-${Date.now()}`,
      proposalId: proposalId,
      title: acceptedTitleObj.title,
      studentId: proposal.studentId,
      studentName: proposal.studentName,
      studentNpm: proposal.studentNpm,
      department: proposal.department,
      supervisorId: null,
      supervisorName: null,
      status: 'pending_supervisor',
      createdAt: new Date().toISOString()
    };

    DB.saveProposals(updatedProposals);
    DB.saveProposalTitles(updatedTitles);
    DB.saveTheses([...theses, newThesis]);

    setProposals(updatedProposals);
    setProposalTitles(updatedTitles);
    setTheses([...theses, newThesis]);
    onRefresh();
  };

  const handleAssignSupervisor = (thesisId: string, supervisorId: string) => {
    const lecturer = users.find(u => u.id === supervisorId);
    if (!lecturer) return;

    const updatedTheses = theses.map(t => 
      t.id === thesisId
        ? {
            ...t,
            supervisorId: lecturer.id,
            supervisorName: lecturer.name,
            status: 'in_progress' as const
          }
        : t
    );

    DB.saveTheses(updatedTheses);
    setTheses(updatedTheses);
    onRefresh();
  };

  const handleUpdateUserRole = (
    userId: string,
    role: UserRole,
    npm: string,
    nidn: string,
    department: string
  ) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          role,
          npm: role === 'student' ? npm : undefined,
          nidn: role === 'lecturer' ? nidn : undefined,
          department: department || user.department,
          isVerified: true
        };
      }
      return user;
    });

    DB.saveUsers(updatedUsers);
    setUsers(updatedUsers);
    onRefresh();
  };

  const totalLecturers = users.filter(u => u.role === 'lecturer').length;
  const totalStudents = users.filter(u => u.role === 'student').length;
  const pendingProposals = proposals.filter(p => p.status === 'pending').length;
  const activeTheses = theses.filter(t => t.status === 'in_progress').length;
  const pendingSupervisors = theses.filter(t => t.status === 'pending_supervisor').length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="admin-dashboard-container">
      {/* 1. Komponen Navigasi Samping */}
      <AdminSidebar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingProposals={pendingProposals}
        pendingSupervisors={pendingSupervisors}
      />

      {/* Main Content Area */}
      <div className="lg:col-span-9 space-y-6">
        {/* 2. Kondisi Tab Aktif Menggunakan Komponen Kecil */}
        {activeTab === 'overview' && (
          <OverviewTab
            currentUser={currentUser}
            totalLecturers={totalLecturers}
            totalStudents={totalStudents}
            pendingProposals={pendingProposals}
            activeTheses={activeTheses}
          />
        )}

        {activeTab === 'proposals' && (
          <ProposalsTab
            proposals={proposals}
            proposalTitles={proposalTitles}
            handleApproveTitle={handleApproveTitle}
          />
        )}

        {activeTab === 'theses' && (
          <ThesesTab
            theses={theses}
            lecturers={users.filter(u => u.role === 'lecturer' && u.isVerified)}
            handleAssignSupervisor={handleAssignSupervisor}
          />
        )}

        {activeTab === 'users' && (
          <UsersTab
            users={users}
            handleUpdateUserRole={handleUpdateUserRole}
          />
        )}
      </div>
    </div>
  );
}