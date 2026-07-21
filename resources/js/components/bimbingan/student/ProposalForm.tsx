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

  const handleTitleChange = (index: number, value: string) => {
    const updated = [...newTitles];
    updated[index] = value;
    setNewTitles(updated);
  };

  const handleAddTitle = () => {
    if (newTitles.length >= 4) return;
    setNewTitles([...newTitles, '']);
  };

  const handleRemoveTitle = (index: number) => {
    if (newTitles.length <= 2) return;
    const updated = newTitles.filter((_, idx) => idx !== index);
    setNewTitles(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!abstract.trim()) {
      alert('Mohon masukkan draf abstrak tesis Anda.');
      return;
    }
    if (newTitles.some(t => !t.trim())) {
      alert('Mohon lengkapi semua baris alternatif judul.');
      return;
    }
    onSubmitProposal(abstract, newTitles);
    setAbstract('');
    setNewTitles(['', '']);
  };

  const wordCount = abstract.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-zinc-800">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <FileCheck2 className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-bold text-lg text-gray-900 dark:text-white">Formulir Pengajuan Judul Tesis</h2>
          <p className="text-xs text-muted-foreground font-light mt-0.5">
            Silakan ajukan draf proposal tesis Anda. Sesuai ketentuan, Anda wajib memberikan minimal 2 alternatif judul.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Abstract Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="abstract" className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Draf Abstrak Awal
            </label>
            <span className={`text-[10px] ${wordCount >= 100 && wordCount <= 250 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {wordCount} kata (Target: 100-250)
            </span>
          </div>
          <textarea
            id="abstract"
            rows={6}
            required
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
            placeholder="Tuliskan latar belakang masalah, rumusan masalah, tujuan, metode penelitian yang digunakan, serta hasil yang diharapkan secara ringkas..."
            className="w-full text-sm p-4 rounded-2xl border border-gray-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-transparent resize-y"
          />
        </div>

        {/* Alternative Titles Area */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Alternatif Judul Tesis
            </label>
            {newTitles.length < 4 && (
              <button
                type="button"
                onClick={handleAddTitle}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Alternatif
              </button>
            )}
          </div>

          <div className="space-y-3">
            {newTitles.map((title, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Opsi {idx + 1}
                  </span>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(idx, e.target.value)}
                    placeholder={`Masukkan alternatif judul tesis ke-${idx + 1}`}
                    className="w-full text-sm pl-16 pr-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-transparent"
                  />
                </div>
                
                {newTitles.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTitle(idx)}
                    className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 rounded-xl transition-colors cursor-pointer"
                    title="Hapus alternatif judul"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-4 rounded-xl shadow-md shadow-emerald-700/10 flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer text-sm"
        >
          <Send className="w-4 h-4" />
          Kirim Pengajuan Judul Tesis
        </button>
      </form>
    </div>
  );
}