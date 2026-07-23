import { useState } from 'react';
import { Clock, FileText, CheckCircle2, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import type { Proposal, ProposalTitle } from '@/types';

interface ProposalPendingProps {
  myProposal: Proposal;
  proposalTitles: ProposalTitle[];
  onRefresh: () => void;
}

export default function ProposalPending({ myProposal, proposalTitles, onRefresh }: ProposalPendingProps) {
  let titles = proposalTitles.filter(t => String(t.proposalId) === String(myProposal.id));
  if (titles.length === 0 && proposalTitles.length > 0) {
    titles = proposalTitles;
  }

  // Melacak opsi mana yang sedang di-expand / dibuka latar belakangnya
  // Default: buka opsi pertama (atau null jika ingin tertutup semua)
  const [expandedId, setExpandedId] = useState<string | null>(titles[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const getWordCount = (text?: string) => {
    if (!text) return 0;
    const plainText = text.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').trim();
    return plainText.split(/\s+/).filter(Boolean).length;
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 text-left">
      {/* Header Info Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-zinc-800 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <h2 className="font-bold text-xl text-gray-900 dark:text-white">Proposal Judul Sedang Ditinjau</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Pengajuan Anda telah diterima pada {new Date(myProposal.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}. Kaprodi sedang menyeleksi judul terbaik.
            </p>
          </div>
        </div>

        <span className="bg-amber-100/80 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-semibold px-4 py-1.5 rounded-full self-start md:self-auto shrink-0">
          Menunggu Keputusan Kaprodi
        </span>
      </div>

      {/* List Alternatif Judul & Latar Belakang */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            Alternatif Judul & Latar Belakang yang Diajukan ({titles.length})
          </h3>
          <span className="text-xs text-emerald-600 font-medium hidden sm:inline">
            💡 Klik opsi untuk melihat latar belakang
          </span>
        </div>

        <div className="space-y-3">
          {titles.map((t, idx) => {
            const isExpanded = expandedId === t.id;
            const wordCount = getWordCount(t.abstract);

            return (
              <div
                key={t.id || idx}
                className={`bg-white dark:bg-zinc-900 border transition-all rounded-2xl overflow-hidden shadow-2xs ${isExpanded
                  ? 'border-emerald-500 dark:border-emerald-600 ring-2 ring-emerald-500/10'
                  : 'border-gray-200/80 dark:border-zinc-800 hover:border-emerald-300 dark:hover:border-emerald-700'
                  }`}
              >
                {/* Clickable Header Baris Judul */}
                <div
                  onClick={() => toggleExpand(t.id)}
                  className="p-4 md:p-5 flex items-start justify-between gap-4 cursor-pointer select-none group"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-block bg-emerald-100/80 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md">
                        Opsi {idx + 1}
                      </span>

                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${t.status === 'ACCEPTED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : t.status === 'REJECTED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                          }`}
                      >
                        {t.status === 'ACCEPTED' && <CheckCircle2 className="w-3 h-3" />}
                        {t.status === 'REJECTED' && <XCircle className="w-3 h-3" />}
                        {t.status === 'PENDING' && <Clock className="w-3 h-3" />}
                        {t.status === 'ACCEPTED' ? 'Disetujui' : t.status === 'REJECTED' ? 'Ditolak' : 'Menunggu Review'}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm md:text-base text-gray-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                      {t.title}
                    </h4>

                    {!isExpanded && t.abstract && (
                      <p className="text-xs text-muted-foreground line-clamp-1 font-light">
                        {t.abstract.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').trim()}
                      </p>
                    )}
                  </div>

                  {/* Icon Expand Toggle */}
                  <div className="flex items-center gap-2 shrink-0 pt-1">
                    {isExpanded && (
                      <span className="text-[11px] text-emerald-600 font-semibold hidden md:inline-flex items-center gap-1">
                        Sembunyikan
                      </span>
                    )}
                    <div className="p-1.5 rounded-lg text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Latar Belakang Detail */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-gray-100 dark:border-zinc-800 bg-emerald-50/20 dark:bg-emerald-950/10 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-900 dark:text-emerald-300">
                      <span>📄 Latar Belakang Singkat / Alasan Pengajuan</span>
                      {wordCount > 0 && (
                        <span className="text-[10px] font-normal text-muted-foreground qi-editor">
                          {wordCount} kata
                        </span>
                      )}
                    </div>

                    <div className="bg-white dark:bg-zinc-900 border border-emerald-100 dark:border-emerald-900/30 p-4 rounded-xl shadow-2xs">
                      <div
                        className="text-xs md:text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-normal ql-editor p-0 min-h-0 border-none select-text"
                        dangerouslySetInnerHTML={{ __html: t.abstract || 'Belum ada deskripsi latar belakang yang ditulis.' }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}