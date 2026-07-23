import { useState } from 'react';
import { FileText, Check, ChevronDown, ChevronUp, BookOpen, X, Sparkles, FileUp, ShieldCheck, Search } from 'lucide-react';
import type { Proposal, ProposalTitle } from '@/types';

interface ProposalsTabProps {
  proposals: Proposal[];
  proposalTitles: ProposalTitle[];
  handleApproveTitle: (proposalId: string, titleId: string, customNotes?: string) => void;
}

export default function ProposalsTab({
  proposals,
  proposalTitles,
  handleApproveTitle,
}: ProposalsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  const departments = Array.from(new Set(proposals.map((p) => p.department).filter(Boolean)));

  const pendingProposals = proposals.filter((p) => {
    if (p.status !== 'pending') return false;

    const matchesSearch =
      p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.studentNpm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.abstract && p.abstract.toLowerCase().includes(searchTerm.toLowerCase())) ||
      proposalTitles.some(
        (t) => t.proposalId === p.id && t.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesDept = departmentFilter === '' || p.department === departmentFilter;

    return matchesSearch && matchesDept;
  });

  // State untuk melacak opsi mana yang sedang di-expand / dibuka
  const [expandedTitleId, setExpandedTitleId] = useState<string | null>(null);

  // State untuk Modal Popup Detail (baca lebih jelas)
  const [selectedTitleForModal, setSelectedTitleForModal] = useState<{
    proposal: Proposal;
    titleItem: ProposalTitle;
    index: number;
  } | null>(null);

  // State untuk Modal Konfirmasi Persetujuan Judul + Catatan & SK
  const [approvalModal, setApprovalModal] = useState<{
    proposalId: string;
    titleId: string;
    titleText: string;
    studentName: string;
  } | null>(null);

  const [approvalNotes, setApprovalNotes] = useState('Judul disetujui oleh Kaprodi.');

  const openApprovalModal = (proposalId: string, titleId: string, titleText: string, studentName: string) => {
    setApprovalModal({ proposalId, titleId, titleText, studentName });
    setApprovalNotes('Judul disetujui oleh Kaprodi.');
  };

  const confirmApproval = () => {
    if (!approvalModal) return;
    handleApproveTitle(approvalModal.proposalId, approvalModal.titleId, approvalNotes);
    setApprovalModal(null);
  };

  const toggleExpand = (titleId: string) => {
    setExpandedTitleId((prev) => (prev === titleId ? null : titleId));
  };

  const getWordCount = (text?: string) => {
    if (!text) return 0;
    const plainText = text.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').trim();
    return plainText.split(/\s+/).filter(Boolean).length;
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm text-left" id="tab-proposals-content">
      <div className="mb-6 pb-4 border-b border-gray-100 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            Seleksi Judul Skripsi Masuk
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Tinjau usulan alternatif judul dari mahasiswa. Klik pada kartu judul untuk membaca detail & latar belakang lengkap.
          </p>
        </div>

        <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/30 self-start md:self-auto">
          {pendingProposals.length} Pengajuan Perlu Review
        </span>
      </div>

      {/* Search and Filters Section */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari nama mahasiswa, NPM, atau judul..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all text-gray-800"
          />
        </div>
        {departments.length > 0 && (
          <div className="w-full sm:w-60">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all text-gray-800"
            >
              <option value="">Semua Program Studi</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {pendingProposals.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-100 dark:border-zinc-800 rounded-2xl bg-gray-50/30 dark:bg-zinc-800/20">
          <FileText className="w-12 h-12 text-gray-300 dark:text-zinc-600 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Tidak ada proposal masuk yang perlu diseleksi.</p>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">Semua pengajuan judul skripsi mahasiswa saat ini telah diproses.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {pendingProposals.map((proposal) => {
            const titles = proposalTitles.filter((t) => t.proposalId === proposal.id);
            return (
              <div
                key={proposal.id}
                className="border border-gray-200/80 dark:border-zinc-800 rounded-2xl p-6 bg-gray-50/40 dark:bg-zinc-800/20 space-y-5"
              >
                {/* Header Data Mahasiswa */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-200/60 dark:border-zinc-800">
                  <div>
                    <span className="inline-block bg-emerald-100/80 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold text-[11px] px-3 py-1 rounded-md uppercase tracking-wider mb-2">
                      {proposal.department}
                    </span>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">
                      {proposal.studentName}
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono mt-1">
                      NPM: {proposal.studentNpm} • Diajukan pada: {new Date(proposal.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                {/* List Alternatif Judul */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                      Pilihan Alternatif Judul & Latar Belakang ({titles.length})
                    </h4>
                    <span className="text-[11px] text-emerald-600 font-medium hidden md:inline">
                      💡 Klik pada judul untuk memperluas / membaca detail
                    </span>
                  </div>

                  <div className="space-y-3">
                    {titles.map((titleItem, idx) => {
                      const isExpanded = expandedTitleId === titleItem.id;
                      const wordCount = getWordCount(titleItem.abstract);

                      return (
                        <div
                          key={titleItem.id}
                          className={`bg-white dark:bg-zinc-900 border transition-all rounded-2xl overflow-hidden shadow-2xs ${
                            isExpanded
                              ? 'border-emerald-500 dark:border-emerald-600 ring-2 ring-emerald-500/10'
                              : 'border-gray-200/80 dark:border-zinc-800 hover:border-emerald-300 dark:hover:border-emerald-700'
                          }`}
                        >
                          {/* Main Row / Header Baris Opsi (Clickable) */}
                          <div
                            onClick={() => toggleExpand(titleItem.id)}
                            className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none group"
                          >
                            <div className="flex items-start md:items-center gap-3 flex-1">
                              <span className="inline-flex items-center justify-center shrink-0 px-2.5 py-1 rounded-lg bg-emerald-100/90 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
                                Opsi {idx + 1}
                              </span>

                              <div className="flex-1">
                                <h5 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                                  {titleItem.title}
                                </h5>
                                {!isExpanded && titleItem.abstract && (
                                  <p className="text-xs text-muted-foreground line-clamp-1 mt-1 font-light">
                                    {titleItem.abstract.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').trim()}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end md:self-center shrink-0" onClick={(e) => e.stopPropagation()}>
                              {/* Tombol Buka Modal Detail */}
                              <button
                                type="button"
                                onClick={() => setSelectedTitleForModal({ proposal, titleItem, index: idx })}
                                className="px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 bg-gray-100 dark:bg-zinc-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                                title="Baca Abstrak dalam Pop-up"
                              >
                                <BookOpen className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Detail</span>
                              </button>

                              {/* Tombol Setujui Judul */}
                              <button
                                type="button"
                                onClick={() => openApprovalModal(proposal.id, titleItem.id, titleItem.title, proposal.studentName)}
                                className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                              >
                                <Check className="w-4 h-4" />
                                Setujui Judul ini
                              </button>

                              {/* Toggle Accordion Indicator */}
                              <button
                                type="button"
                                onClick={() => toggleExpand(titleItem.id)}
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-lg"
                              >
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                          {/* Expanded Content View (Detail Latar Belakang) */}
                          {isExpanded && (
                            <div className="px-5 pb-5 pt-2 border-t border-gray-100 dark:border-zinc-800 bg-emerald-50/20 dark:bg-emerald-950/10 space-y-3">
                              <div className="flex items-center justify-between text-xs font-bold text-emerald-900 dark:text-emerald-300">
                                <span>📄 Latar Belakang Singkat / Alasan Pengajuan</span>
                                <span className="text-[10px] font-normal text-muted-foreground">
                                  {wordCount} kata
                                </span>
                              </div>

                              <div className="bg-white dark:bg-zinc-900 border border-emerald-100 dark:border-emerald-900/30 p-4 rounded-xl shadow-2xs">
                                <div
                                  className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-normal ql-editor p-0 min-h-0 border-none select-text"
                                  dangerouslySetInnerHTML={{ __html: titleItem.abstract || 'Belum ada deskripsi latar belakang.' }}
                                />
                              </div>

                              <div className="flex justify-end pt-1">
                                <button
                                  type="button"
                                  onClick={() => openApprovalModal(proposal.id, titleItem.id, titleItem.title, proposal.studentName)}
                                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
                                >
                                  <Check className="w-4 h-4" />
                                  Pilih & Setujui Judul Opsi {idx + 1}
                                </button>
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
          })}
        </div>
      )}

      {/* MODAL POPUP BACA ABSTRACT DETAIL */}
      {selectedTitleForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="flex items-start justify-between border-b border-gray-100 dark:border-zinc-800 pb-4">
              <div className="space-y-1 pr-6">
                <span className="inline-block bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg">
                  Alternatif Opsi {selectedTitleForModal.index + 1}
                </span>
                <h3 className="font-bold text-base md:text-lg text-gray-900 dark:text-white leading-snug pt-1">
                  {selectedTitleForModal.titleItem.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTitleForModal(null)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Info Mahasiswa */}
            <div className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-xl text-xs space-y-1 border border-gray-100 dark:border-zinc-800">
              <p className="font-bold text-gray-900 dark:text-white">
                Mahasiswa: {selectedTitleForModal.proposal.studentName} ({selectedTitleForModal.proposal.studentNpm})
              </p>
              <p className="text-muted-foreground">
                Program Studi: {selectedTitleForModal.proposal.department}
              </p>
            </div>

            {/* Content Latar Belakang */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase text-gray-700 dark:text-gray-300 tracking-wider">
                  Latar Belakang Singkat / Alasan Pengajuan
                </h4>
                <span className="text-[10px] text-emerald-600 font-semibold">
                  {getWordCount(selectedTitleForModal.titleItem.abstract)} kata
                </span>
              </div>

              <div className="bg-emerald-50/30 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 p-5 rounded-2xl">
                <div
                  className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-normal ql-editor p-0 min-h-0 border-none select-text"
                  dangerouslySetInnerHTML={{ __html: selectedTitleForModal.titleItem.abstract || 'Belum ada latar belakang yang ditulis.' }}
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setSelectedTitleForModal(null)}
                className="px-5 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
              >
                Tutup
              </button>

              <button
                type="button"
                onClick={() => {
                  const { proposal, titleItem } = selectedTitleForModal;
                  setSelectedTitleForModal(null);
                  openApprovalModal(proposal.id, titleItem.id, titleItem.title, proposal.studentName);
                }}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                Setujui Judul Opsi ini
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI APPROVAL + UPLOAD SK & CATATAN KAPRODI */}
      {approvalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl space-y-5 relative">
            <div className="flex items-center gap-3 border-b border-gray-100 dark:border-zinc-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-gray-900 dark:text-white">Form Persetujuan Judul Skripsi</h3>
                <p className="text-xs text-muted-foreground">Mahasiswa: <span className="font-semibold text-gray-800 dark:text-gray-200">{approvalModal.studentName}</span></p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  Judul yang Disetujui:
                </label>
                <p className="text-xs bg-emerald-50/60 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200 font-semibold leading-snug">
                  {approvalModal.titleText}
                </p>
              </div>

              {/* Input Catatan Kaprodi */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
                  Catatan / Arahan Awal Kaprodi:
                </label>
                <textarea
                  rows={3}
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder="Masukkan catatan atau arahan awal untuk mahasiswa..."
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setApprovalModal(null)}
                className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmApproval}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                Setujui & Ajukan ke Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
