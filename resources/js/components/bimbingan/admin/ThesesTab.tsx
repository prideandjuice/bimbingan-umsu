// components/bimbingan/admin/ThesesTab.tsx
import { useState } from 'react';
import { BookOpen, Clock, CheckCircle2, UserPlus } from 'lucide-react';
import { DB } from '@/db';
import type { Thesis, AppUser } from '@/types';

interface ThesesTabProps {
  theses: Thesis[];
  lecturers: AppUser[];
  handleAssignSupervisor: (thesisId: string, supervisorId: string) => void;
}

export default function ThesesTab({
  theses,
  lecturers,
  handleAssignSupervisor,
}: ThesesTabProps) {
  const [selectedThesisId, setSelectedThesisId] = useState<string | null>(null);
  const [selectedSupervisorId, setSelectedSupervisorId] = useState<string>('');

  const pendingSupervisors = theses.filter(t => t.status === 'pending_supervisor').length;

  if (theses.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm text-center" id="tab-theses-content">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-gray-900">Manajemen Tesis & Pembimbing</h2>
            <p className="text-xs text-gray-500 mt-1">
              Daftar seluruh judul tesis yang telah disetujui. Tunjuk dosen pembimbing berkompeten untuk memulai masa bimbingan.
            </p>
          </div>
        </div>
        <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/30">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-505 text-sm font-medium text-gray-500">Belum ada tesis aktif.</p>
          <p className="text-xs text-gray-400 mt-1">Mulai dengan menyetujui salah satu proposal judul di tab Seleksi Judul.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm text-left" id="tab-theses-content">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-gray-900">Manajemen Tesis & Pembimbing</h2>
          <p className="text-xs text-gray-500 mt-1">
            Daftar seluruh judul tesis yang telah disetujui. Tunjuk dosen pembimbing berkompeten untuk memulai masa bimbingan.
          </p>
        </div>
        
        <div className="bg-red-50 text-red-700 border border-red-100 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0">
          <Clock className="w-3.5 h-3.5" />
          <span>{pendingSupervisors} Menunggu Pembimbing</span>
        </div>
      </div>

      <div className="space-y-4">
        {theses.map(thesis => {
          const LecturersList = lecturers;
          const isPendingSupervisor = thesis.status === 'pending_supervisor';
          const studentGuidances = DB.getGuidances().filter(g => g.thesisId === thesis.id && g.status === 'verified');
          const currentProgress = studentGuidances.length > 0 
            ? Math.max(...studentGuidances.map(g => g.progress)) 
            : 0;

          return (
            <div key={thesis.id} className="border border-gray-100 rounded-2xl p-5 hover:border-gray-200 transition-all bg-white shadow-3xs">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="bg-emerald-50 text-emerald-700 font-bold text-3xs px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                      {thesis.department}
                    </span>
                    {isPendingSupervisor ? (
                      <span className="bg-red-50 text-red-600 border border-red-100 text-3xs px-2.5 py-0.5 rounded-md font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Menunggu Pembimbing
                      </span>
                    ) : (
                      <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-3xs px-2.5 py-0.5 rounded-md font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Masa Bimbingan ({currentProgress}%)
                      </span>
                    )}
                  </div>
                  <h3 className="font-display font-bold text-gray-900 text-base leading-relaxed">
                    {thesis.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-1">
                    Mahasiswa: <span className="text-gray-800 font-semibold">{thesis.studentName}</span> ({thesis.studentNpm})
                  </p>
                </div>
              </div>

              {/* Supervisor Section */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-left">
                  <p className="text-3xs font-bold uppercase text-gray-400 tracking-wider">Dosen Pembimbing Utama</p>
                  {isPendingSupervisor ? (
                    <p className="text-sm text-gray-500 font-medium italic mt-1">Belum ditunjuk.</p>
                  ) : (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <p className="text-sm text-gray-800 font-semibold">{thesis.supervisorName}</p>
                    </div>
                  )}
                </div>

                {/* Assign Supervisor Trigger */}
                {isPendingSupervisor ? (
                  <div className="w-full md:w-auto">
                    {selectedThesisId === thesis.id ? (
                      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 w-full">
                        <select
                          value={selectedSupervisorId}
                          onChange={(e) => setSelectedSupervisorId(e.target.value)}
                          className="text-xs bg-white border border-gray-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                        >
                          <option value="">-- Pilih Dosen Pembimbing --</option>
                          {LecturersList.map(lecturer => (
                            <option key={lecturer.id} value={lecturer.id}>
                              {lecturer.name} (NIDN: {lecturer.nidn || '-'})
                            </option>
                          ))}
                        </select>
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => {
                              handleAssignSupervisor(thesis.id, selectedSupervisorId);
                              setSelectedThesisId(null);
                              setSelectedSupervisorId('');
                            }}
                            disabled={!selectedSupervisorId}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs px-3 py-2 rounded-lg transition-colors cursor-pointer"
                          >
                            Simpan
                          </button>
                          <button
                            onClick={() => {
                              setSelectedThesisId(null);
                              setSelectedSupervisorId('');
                            }}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs px-3 py-2 rounded-lg transition-colors cursor-pointer"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedThesisId(thesis.id);
                          setSelectedSupervisorId('');
                        }}
                        className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        Tunjuk Pembimbing
                      </button>
                    )}
                  </div>
                ) : (
                  /* Progress bar if supervisor is assigned */
                  <div className="w-full md:w-64">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-3xs font-bold text-gray-400 uppercase">Progres Penyusunan</span>
                      <span className="text-xs font-bold text-emerald-700">{currentProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div 
                        className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500" 
                        style={{ width: `${currentProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
