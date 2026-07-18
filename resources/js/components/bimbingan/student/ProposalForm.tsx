// components/bimbingan/student/ProposalForm.tsx
import { useState } from 'react';
import { FileCheck2, Trash2, Plus, Send } from 'lucide-react';
import type { AppUser } from '@/types';

interface ProposalFormProps {
  currentUser: AppUser;
  onSubmitProposal: (abstract: string, titles: string[]) => void;
}

export default function ProposalForm({ currentUser, onSubmitProposal }: ProposalFormProps) {
  const [abstract, setAbstract] = useState('');
  const [newTitles, setNewTitles] = useState<string[]>(['', '']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!abstract.trim() || newTitles.some(t => !t.trim())) {
      alert('Mohon lengkapi abstrak dan seluruh alternatif judul.');
      return;
    }
    onSubmitProposal(abstract, newTitles);
    setAbstract('');
    setNewTitles(['', '']);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm max-w-4xl mx-auto">
      <div className="text-center max-w-lg mx-auto mb-8">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4">
          <FileCheck2 className="w-8 h-8" />
        </div>
        <h2 className="font-display font-bold text-2xl text-gray-900">Pengajuan Judul Tesis Baru</h2>
        <p className="text-sm text-gray-500 mt-2 font-light">
          Silakan ajukan draf proposal tesis Anda. Sesuai ketentuan pascasarjana UMSU, Anda wajib menyertakan minimal 2 alternatif judul bimbingan.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Potongan input abstract & loop newTitles dipindahkan ke sini */}
        {/* ... tombol tambah alternatif judul ... */}
      </form>
    </div>
  );
}