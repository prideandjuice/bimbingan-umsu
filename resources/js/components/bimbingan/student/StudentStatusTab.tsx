import React from 'react';
import { Link } from '@inertiajs/react';
import { CheckCircle2, AlertCircle, FilePlus, ArrowRight } from 'lucide-react';
import type { Proposal, ProposalTitle, Thesis } from '@/types';

import ProposalPending from './ProposalPending';

interface StudentStatusTabProps {
  myProposal: Proposal | undefined;
  myThesis: Thesis | undefined;
  proposalTitles: ProposalTitle[];
  onRefresh: () => void;
}

export default function StudentStatusTab({
  myProposal,
  myThesis,
  proposalTitles,
  onRefresh,
}: StudentStatusTabProps) {
  return (
    <div className="space-y-6" id="student-status-judul">
      <div className="w-full">
        {myProposal && !myThesis ? (
          <ProposalPending myProposal={myProposal} proposalTitles={proposalTitles} onRefresh={onRefresh} />
        ) : myThesis ? (
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 text-left">
            <div className="flex items-center gap-3 text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                Judul Skripsi Disetujui & Pembimbing Ditetapkan
              </h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Judul skripsi Anda (<strong>{myThesis.title}</strong>) telah disetujui oleh Ketua Program Studi dan Dosen
              Pembimbing telah ditetapkan.
            </p>
            <div className="pt-2">
              <Link
                href="/mahasiswa/log-bimbingan"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/10 transition-all"
              >
                <span>Buka Log Bimbingan</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-8 text-center space-y-4">
            <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
            <div>
              <h3 className="font-bold text-base text-gray-900 dark:text-white">Belum Ada Draf Pengajuan Judul</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                Anda belum membuat pengajuan draf proposal skripsi. Silakan buat pengajuan terlebih dahulu untuk melihat
                status persetujuan.
              </p>
            </div>
            <Link
              href="/mahasiswa/pengajuan-judul"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/10"
            >
              <FilePlus className="w-4 h-4" />
              <span>Buat Pengajuan Judul Skripsi</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
