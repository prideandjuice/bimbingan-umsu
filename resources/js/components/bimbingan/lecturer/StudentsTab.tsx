// components/bimbingan/lecturer/StudentsTab.tsx
import { useState } from 'react';
import { BookOpen, Plus, History, CheckCircle2 } from 'lucide-react';
import type { AppUser, Guidance, Thesis } from '@/types';

interface StudentsTabProps {
  currentUser: AppUser;
  myStudents: Thesis[];
  guidances: Guidance[];
  selectedThesisId: string | null;
  setSelectedThesisId: (id: string | null) => void;
  handleVerifyGuidance: (id: string) => void;
  handleLecturerSubmitGuidance: (newGuidance: Omit<Guidance, 'id' | 'status' | 'createdBy' | 'creatorName' | 'createdAt'>) => void;
}

export default function StudentsTab({
  currentUser,
  myStudents,
  guidances,
  selectedThesisId,
  setSelectedThesisId,
  handleVerifyGuidance,
  handleLecturerSubmitGuidance,
}: StudentsTabProps) {
  // Pindahkan form state bimbingan ke sini agar local
  const [lGDate, setLGDate] = useState(new Date().toISOString().split('T')[0]);
  const [lGNotes, setLGNotes] = useState('');
  const [lGRevisions, setLGRevisions] = useState('');
  const [lGProgress, setLGProgress] = useState(10);
  const [showAddLog, setShowAddLog] = useState(false);

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lGNotes.trim()) {
      alert('Mohon isi catatan pertemuan.');
      return;
    }
    handleLecturerSubmitGuidance({
      thesisId: selectedThesisId!,
      date: lGDate,
      notes: lGNotes.trim(),
      revisions: lGRevisions.trim(),
      progress: Number(lGProgress),
    });
    setLGNotes('');
    setLGRevisions('');
    setShowAddLog(false);
  };

  if (!selectedThesisId) {
    return (
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        {/* Render List Card Mahasiswa dari kodingan asli kamu */}
        <h2 className="font-display text-xl font-bold text-gray-900">Mahasiswa Bimbingan Anda</h2>
        {/* ... mapping myStudents ... */}
      </div>
    );
  }

  const activeThesis = myStudents.find((s) => s.id === selectedThesisId);
  if (!activeThesis) return null;
  const studentGuidances = guidances.filter((g) => g.thesisId === activeThesis.id);

  return (
    <div className="space-y-6">
      {/* Render tampilan detail log & form isi log dari kodingan asli kamu */}
      <button onClick={() => setSelectedThesisId(null)}>← Kembali</button>
      {/* ... detail view dan Form onSubmit={onSubmitForm} ... */}
    </div>
  );
}