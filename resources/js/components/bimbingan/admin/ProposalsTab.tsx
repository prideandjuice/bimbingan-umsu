// components/bimbingan/admin/ProposalsTab.tsx
import { FileText, Check } from 'lucide-react';
import type { Proposal, ProposalTitle } from '@/types';

interface ProposalsTabProps {
  proposals: Proposal[];
  proposalTitles: ProposalTitle[];
  handleApproveTitle: (proposalId: string, titleId: string) => void;
}

export default function ProposalsTab({
  proposals,
  proposalTitles,
  handleApproveTitle,
}: ProposalsTabProps) {
  const pendingProposals = proposals.filter((p) => p.status === 'pending');

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm text-left" id="tab-proposals-content">
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-gray-900">Seleksi Judul Tesis Masuk</h2>
        <p className="text-xs text-gray-500 mt-1">
          Tinjau usulan judul dari mahasiswa. Pilih salah satu alternatif judul terbaik untuk disetujui sebagai judul final tesis.
        </p>
      </div>

      {pendingProposals.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/30">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm font-medium">Tidak ada proposal masuk yang perlu diseleksi.</p>
          <p className="text-xs text-gray-400 mt-1">Semua pengajuan judul tesis mahasiswa saat ini telah diproses.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingProposals.map((proposal) => {
            const titles = proposalTitles.filter((t) => t.proposalId === proposal.id);
            return (
              <div
                key={proposal.id}
                className="border border-gray-100 rounded-2xl p-6 hover:border-gray-200 transition-all bg-gray-50/20 shadow-2xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
                  <div>
                    <span className="bg-emerald-50 text-emerald-700 font-bold text-2xs px-3 py-1 rounded-full uppercase tracking-wider">
                      {proposal.department}
                    </span>
                    <h3 className="font-display font-bold text-gray-900 text-lg mt-2">
                      {proposal.studentName}
                    </h3>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">
                      NPM: {proposal.studentNpm} • Diajukan pada: {new Date(proposal.createdAt).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>

                {/* Abstract */}
                <div className="bg-white border border-gray-100 rounded-xl p-4 mb-5">
                  <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-1">Abstrak Penelitian</h4>
                  <p className="text-sm text-gray-700 leading-relaxed font-light italic">
                    "{proposal.abstract}"
                  </p>
                </div>

                {/* Alternate Titles Options */}
                <div>
                  <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-3">
                    Pilihan Alternatif Judul ({titles.length})
                  </h4>
                  <div className="space-y-3">
                    {titles.map((title, idx) => (
                      <div
                        key={title.id}
                        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white border border-gray-100 p-4 rounded-xl hover:border-emerald-200 transition-colors"
                      >
                        <div className="flex-1 text-left">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mr-2 mb-2 md:mb-0">
                            {idx + 1}
                          </span>
                          <span className="font-medium text-sm text-gray-800 leading-relaxed inline">
                            {title.title}
                          </span>
                        </div>
                        <button
                          onClick={() => handleApproveTitle(proposal.id, title.id)}
                          className="w-full md:w-auto shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Setujui Judul ini
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
