import { useState } from 'react';
import { FileCheck2, Trash2, Plus, Send, AlignLeft } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import type { AppUser } from '@/types';

export interface TitleOptionItem {
  title: string;
  abstract: string;
}

interface ProposalFormProps {
  currentUser: AppUser;
  onSubmitProposal: (titleItems: TitleOptionItem[]) => void;
}

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'clean'],
  ],
};

const quillFormats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'link',
];

export default function ProposalForm({ currentUser, onSubmitProposal }: ProposalFormProps) {
  const [items, setItems] = useState<TitleOptionItem[]>([
    { title: '', abstract: '' },
    { title: '', abstract: '' },
    { title: '', abstract: '' },
  ]);

  const handleTitleChange = (index: number, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], title: value };
    setItems(updated);
  };

  const handleAbstractChange = (index: number, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], abstract: value };
    setItems(updated);
  };

  const handleAddOption = () => {
    if (items.length >= 4) return;
    setItems([...items, { title: '', abstract: '' }]);
  };

  const handleRemoveOption = (index: number) => {
    if (items.length <= 3) return;
    const updated = items.filter((_, idx) => idx !== index);
    setItems(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    for (let i = 0; i < items.length; i++) {
      if (!items[i].title.trim()) {
        alert(`Mohon lengkapi Judul Skripsi pada Opsi ${i + 1}.`);
        return;
      }
      const plainAbstract = items[i].abstract.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').trim();
      if (!plainAbstract) {
        alert(`Mohon isi Latar Belakang Singkat / Alasan Pengajuan pada Opsi ${i + 1}.`);
        return;
      }
    }

    onSubmitProposal(items);
    setItems([
      { title: '', abstract: '' },
      { title: '', abstract: '' },
      { title: '', abstract: '' },
    ]);
  };

  const getWordCount = (htmlOrText: string) => {
    if (!htmlOrText) return 0;
    const plainText = htmlOrText.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').trim();
    return plainText.split(/\s+/).filter(Boolean).length;
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
      <div className="flex items-center gap-4 pb-6 border-b border-gray-100 dark:border-zinc-800">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <FileCheck2 className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-bold text-lg text-gray-900 dark:text-white">Formulir Pengajuan Judul Skripsi</h2>
          <p className="text-xs text-muted-foreground font-light mt-0.5">
            Silakan ajukan draf proposal skripsi Anda. Sesuai ketentuan, Anda wajib memberikan minimal 3 alternatif judul lengkap dengan latar belakang singkat (~500 kata).
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <AlignLeft className="w-4 h-4 text-emerald-600" />
              Daftar Alternatif Judul Skripsi
            </h3>
            {items.length < 4 && (
              <button
                type="button"
                onClick={handleAddOption}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Alternatif
              </button>
            )}
          </div>

          {items.map((item, idx) => {
            const wordCount = getWordCount(item.abstract);
            return (
              <div
                key={idx}
                className="bg-gray-50/50 dark:bg-zinc-800/40 border border-gray-200/80 dark:border-zinc-800 rounded-2xl p-5 md:p-6 space-y-4 relative group"
              >
                <div className="flex items-center justify-between border-b border-gray-200/60 dark:border-zinc-700/60 pb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-lg bg-emerald-100/80 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
                    Alternatif Judul {idx + 1}
                  </span>

                  {items.length > 3 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(idx)}
                      className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                      title="Hapus Opsi ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Input Judul Skripsi */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
                    Judul Skripsi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={item.title}
                    onChange={(e) => handleTitleChange(idx, e.target.value)}
                    placeholder={`Masukkan opsi judul skripsi ke-${idx + 1}`}
                    className="w-full text-sm px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>

                {/* Rich Text Editor Quill untuk Latar Belakang / Abstrak */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
                      Latar Belakang Singkat / Alasan Pengajuan <span className="text-red-500">*</span>
                    </label>
                    <span className={`text-[10px] font-medium ${wordCount > 500 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {wordCount} kata (Minimal: 500 kata)
                    </span>
                  </div>
                  <ReactQuill
                    theme="snow"
                    value={item.abstract}
                    onChange={(content) => handleAbstractChange(idx, content)}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Tuliskan gambaran umum masalah, kebaruan (novelty), serta alasan singkat memilih judul skripsi ini..."
                    className="bg-white dark:bg-zinc-900 rounded-xl"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <button
          type="submit"
          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-4 rounded-xl shadow-md shadow-emerald-700/10 flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer text-sm"
        >
          <Send className="w-4 h-4" />
          Kirim Pengajuan Judul Skripsi
        </button>
      </form>
    </div>
  );
}