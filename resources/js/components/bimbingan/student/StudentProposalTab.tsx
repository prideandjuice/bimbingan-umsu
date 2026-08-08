import React from 'react';
import { Link } from '@inertiajs/react';
import { FilePlus, Clock, CheckCircle2, XCircle, FileText, ArrowRight } from 'lucide-react';
import type { AppUser, Proposal, ProposalTitle, Thesis } from '@/types';

import ProposalForm from './ProposalForm';
import RichTextDisplay from '../RichTextDisplay';

interface StudentProposalTabProps {
  currentUser: AppUser;
  myProposal: Proposal | undefined;
  myThesis: Thesis | undefined;
  myTitles: ProposalTitle[];
  onSubmitProposal: (items: Array<{ title: string; abstract: string }>) => void;
}

export default function StudentProposalTab({
  currentUser,
  myProposal,
  myThesis,
  myTitles,
  onSubmitProposal,
}: StudentProposalTabProps) {
  return (
    <div className="space-y-6" id="student-pengajuan-judul">
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
            <FilePlus className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Formulir Pengajuan Judul Skripsi</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {myProposal
                ? 'Draf pengajuan judul skripsi Anda telah terkirim.'
                : 'Silakan lengkapi draf proposal dan alternatif judul skripsi Anda.'}
            </p>
          </div>
        </div>

        {myProposal && (
          <Link
            href="/mahasiswa/status-judul"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 transition-all self-start md:self-auto"
          >
            <Clock className="w-4 h-4" />
            <span>Lihat Status Persetujuan</span>
          </Link>
        )}
      </div>

      <div className="w-full">
        {!myProposal && !myThesis ? (
          <ProposalForm currentUser={currentUser} onSubmitProposal={onSubmitProposal} />
        ) : (
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-zinc-800 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base md:text-lg text-gray-900 dark:text-white">
                    Pengajuan Judul Berhasil Terkirim
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Draf proposal alternatif judul Anda saat ini sedang dalam peninjauan oleh Kaprodi.
                  </p>
                </div>
              </div>

              <span className="bg-amber-100/80 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-semibold px-4 py-1.5 rounded-full self-start md:self-auto shrink-0">
                Menunggu Keputusan Kaprodi
              </span>
            </div>

            {/* Daftar 3 Alternatif Judul Skripsi yang Diajukan */}
            {myTitles.length > 0 ? (
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  Alternatif Judul & Latar Belakang yang Diajukan ({myTitles.length})
                </h4>

                <div className="space-y-4">
                  {myTitles.map((t: ProposalTitle, idx: number) => (
                    <div
                      key={t.id || idx}
                      className="bg-emerald-50/30 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 p-5 rounded-2xl space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="inline-block bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-3xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                          Opsi {idx + 1}
                        </span>

                        <span
                          className={`text-3xs font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1 ${
                            t.status === 'ACCEPTED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : t.status === 'REJECTED'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {t.status === 'ACCEPTED' && <CheckCircle2 className="w-3 h-3" />}
                          {t.status === 'REJECTED' && <XCircle className="w-3 h-3" />}
                          {t.status === 'PENDING' && <Clock className="w-3 h-3" />}
                          {t.status === 'ACCEPTED'
                            ? 'Disetujui Kaprodi'
                            : t.status === 'REJECTED'
                              ? 'Ditolak'
                              : 'Menunggu Review'}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm md:text-base text-gray-900 dark:text-white leading-snug">
                        {t.title}
                      </h4>

                      <div className="pt-1">
                        <p className="text-3xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider mb-1.5">
                          Latar Belakang / Abstrak:
                        </p>
                        <RichTextDisplay
                          content={t.abstract}
                          fallback="Abstrak telah disimpan dalam draf pengajuan proposal."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 p-5 rounded-2xl space-y-3">
                <p className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
                  Abstrak / Latar Belakang Proposal Asal:
                </p>
                <RichTextDisplay
                  content={myProposal?.abstract}
                  fallback="Abstrak telah disimpan dalam draf pengajuan proposal."
                />
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <Link
                href="/mahasiswa/status-judul"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/10 transition-all"
              >
                <span>Cek Detail Status Seleksi Judul</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
