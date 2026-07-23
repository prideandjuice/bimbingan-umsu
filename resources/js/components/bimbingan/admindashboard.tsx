// bimbingan/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { DB } from '@/db';
import type { AppUser, Proposal, ProposalTitle, Thesis, UserRole } from '@/types';
import { toast } from 'sonner';
import axios from 'axios';

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

  useEffect(() => {
    const allowedRoles = ['admin', 'prodi'];
    if (!allowedRoles.includes(currentUser.role)) {
      setActiveTab('overview');
    }
    if (activeTab === 'proposals' && currentUser.role !== 'prodi') {
      setActiveTab('overview');
    }
  }, [currentUser.role, activeTab]);

  const handleApproveTitle = (proposalId: string, approvedTitleId: string, customNotes?: string) => {
    const proposal = proposals.find(p => p.id === proposalId);
    if (!proposal) return;

    const acceptedTitleObj = proposalTitles.find(t => t.id === approvedTitleId);
    if (!acceptedTitleObj) return;

    const updatedProposals = proposals.map(p => 
      p.id === proposalId ? { ...p, status: 'processed' as const } : p
    );

    const defaultNotes = 'Judul disetujui oleh Kaprodi.';
    const finalNotes = customNotes && customNotes.trim() ? customNotes.trim() : defaultNotes;

    const updatedTitles = proposalTitles.map(t => {
      if (t.proposalId === proposalId) {
        return t.id === approvedTitleId
          ? { ...t, status: 'ACCEPTED' as const, notes: finalNotes }
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
      createdAt: new Date().toISOString(),
    };

    DB.saveProposals(updatedProposals);
    DB.saveProposalTitles(updatedTitles);
    DB.saveTheses([...theses, newThesis]);

    setProposals(updatedProposals);
    setProposalTitles(updatedTitles);
    setTheses([...theses, newThesis]);
    toast.success('Judul skripsi berhasil disetujui! Hubungi Admin untuk penerbitan SK.');
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
            status: 'pending_sk' as const
          }
        : t
    );

    DB.saveTheses(updatedTheses);
    setTheses(updatedTheses);
    toast.success(`Dosen pembimbing ${lecturer.name} berhasil ditunjuk. Menunggu SK dari Admin.`);
    onRefresh();
  };

  const handleUploadSKFile = async (thesisId: string, file: File) => {
    const formData = new FormData();
    formData.append('thesis_id', thesisId);
    formData.append('file', file);

    try {
      const response = await axios.post('/bimbingan/upload-sk', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.status === 'success') {
        const uploadedSkPath = response.data.skFile;

        const updatedTheses = theses.map(t => 
          t.id === thesisId
            ? {
                ...t,
                skFile: uploadedSkPath,
                status: 'in_progress' as const
              }
            : t
        );

        DB.saveTheses(updatedTheses);
        setTheses(updatedTheses);
        toast.success('Berkas SK Bimbingan berhasil diunggah.');
        onRefresh();
      } else {
        toast.error('Gagal mengunggah berkas SK Bimbingan.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Terjadi kesalahan saat mengunggah berkas SK.');
    }
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
    toast.success('Hak akses pengguna berhasil diperbarui.');
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

        {activeTab === 'proposals' && currentUser.role === 'prodi' && (
          <ProposalsTab
            proposals={proposals}
            proposalTitles={proposalTitles}
            handleApproveTitle={handleApproveTitle}
          />
        )}

        {activeTab === 'theses' && (currentUser.role === 'prodi' || currentUser.role === 'admin') && (
          <ThesesTab
            theses={theses}
            currentUser={currentUser}
            lecturers={users.filter(u => u.role === 'lecturer' && u.isVerified)}
            handleAssignSupervisor={handleAssignSupervisor}
            handleUploadSK={handleUploadSKFile}
          />
        )}

        {activeTab === 'users' && (currentUser.role === 'admin' || currentUser.role === 'prodi') && (
          <UsersTab
            users={users}
            currentUser={currentUser}
            handleUpdateUserRole={handleUpdateUserRole}
          />
        )}
      </div>
    </div>
  );
}