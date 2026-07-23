// components/bimbingan/admin/ThesesTab.tsx
import { useState } from 'react';
import { BookOpen, Clock, CheckCircle2, UserPlus, FileCheck2, Download, Search, FileUp } from 'lucide-react';
import { DB } from '@/db';
import type { Thesis, AppUser } from '@/types';
import { toast } from 'sonner';

interface ThesesTabProps {
  theses: Thesis[];
  currentUser: AppUser;
  lecturers: AppUser[];
  handleAssignSupervisor: (thesisId: string, supervisorId: string) => void;
  handleUploadSK: (thesisId: string, file: File) => void;
}

export default function ThesesTab({
  theses,
  currentUser,
  lecturers,
  handleAssignSupervisor,
  handleUploadSK,
}: ThesesTabProps) {
  const [selectedThesisId, setSelectedThesisId] = useState<string | null>(null);
  const [selectedSupervisorId, setSelectedSupervisorId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [lecturerSearch, setLecturerSearch] = useState('');
  const [uploadingSkThesisId, setUploadingSkThesisId] = useState<string | null>(null);
  const [selectedSkFile, setSelectedSkFile] = useState<File | null>(null);

  const pendingSupervisors = theses.filter(t => t.status === 'pending_supervisor').length;
  const pendingSks = theses.filter(t => t.status === 'pending_sk').length;

  const getLecturerQuota = (lecturerId: string) => {
    return theses.filter(t => t.supervisorId === lecturerId).length;
  };

  const departments = Array.from(new Set(theses.map((t) => t.department).filter(Boolean)));

  const filteredTheses = theses.filter((thesis) => {
    const matchesSearch =
      thesis.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thesis.studentNpm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thesis.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (thesis.supervisorName && thesis.supervisorName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === '' || thesis.status === statusFilter;

    const matchesDept = departmentFilter === '' || thesis.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDept;
  });

  if (theses.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm text-center" id="tab-theses-content">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-gray-900">Manajemen Skripsi & Pembimbing</h2>
            <p className="text-xs text-gray-500 mt-1">
              Daftar seluruh judul skripsi yang telah disetujui. Tunjuk dosen pembimbing berkompeten untuk memulai masa bimbingan.
            </p>
          </div>
        </div>
        <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/30">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-505 text-sm font-medium text-gray-500">Belum ada skripsi aktif.</p>
          <p className="text-xs text-gray-400 mt-1">Mulai dengan menyetujui salah satu proposal judul di tab Seleksi Judul.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm text-left" id="tab-theses-content">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-gray-900">Manajemen Skripsi & Pembimbing</h2>
          <p className="text-xs text-gray-500 mt-1">
            Daftar seluruh judul skripsi yang telah disetujui. Tunjuk dosen pembimbing berkompeten untuk memulai masa bimbingan.
          </p>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {pendingSupervisors > 0 && (
            <div className="bg-red-50 text-red-700 border border-red-100 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0">
              <Clock className="w-3.5 h-3.5" />
              <span>{pendingSupervisors} Menunggu Pembimbing</span>
            </div>
          )}
          {pendingSks > 0 && (
            <div className="bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0">
              <Clock className="w-3.5 h-3.5" />
              <span>{pendingSks} Menunggu SK Admin</span>
            </div>
          )}
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari nama mahasiswa, NPM, judul, pembimbing..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all text-gray-800"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all text-gray-800"
          >
            <option value="">Semua Status</option>
            <option value="pending_supervisor">Menunggu Pembimbing</option>
            <option value="pending_sk">Menunggu SK Admin</option>
            <option value="in_progress">Masa Bimbingan (In Progress)</option>
          </select>

          {departments.length > 0 && (
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all text-gray-800"
            >
              <option value="">Semua Program Studi</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {filteredTheses.length === 0 ? (
          <div className="text-center py-12 border border-gray-100 rounded-2xl bg-gray-50/20">
            <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-gray-500 font-medium">Tidak ada data skripsi yang cocok dengan pencarian.</p>
          </div>
        ) : (
          filteredTheses.map(thesis => {
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
                    {thesis.status === 'pending_supervisor' && (
                      <span className="bg-red-50 text-red-600 border border-red-100 text-3xs px-2.5 py-0.5 rounded-md font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Menunggu Pembimbing
                      </span>
                    )}
                    {thesis.status === 'pending_sk' && (
                      <span className="bg-amber-50 text-amber-600 border border-amber-100 text-3xs px-2.5 py-0.5 rounded-md font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Menunggu SK Admin
                      </span>
                    )}
                    {thesis.status === 'in_progress' && (
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

                  {/* Badge SK File */}
                  {thesis.skFile && (
                    <div className="mt-2.5 inline-flex items-center gap-2 text-xs font-medium text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                      <FileCheck2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>SK Bimbingan: <strong>{thesis.skFile.split('/').pop()}</strong></span>
                      <a
                        href={`/${thesis.skFile}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-0.5 ml-1 underline"
                        title="Unduh SK Bimbingan"
                      >
                        <Download className="w-3 h-3" /> Unduh
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Supervisor Section */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-left">
                  <p className="text-3xs font-bold uppercase text-gray-400 tracking-wider">Dosen Pembimbing Utama</p>
                  {thesis.supervisorName ? (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <p className="text-sm text-gray-800 font-semibold">{thesis.supervisorName}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 font-medium italic mt-1">Belum ditunjuk.</p>
                  )}
                </div>

                {/* Actions Block */}
                {thesis.status === 'pending_supervisor' && (
                  <div className="w-full md:w-auto text-right">
                    {currentUser.role === 'prodi' ? (
                      selectedThesisId === thesis.id ? (
                        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full">
                          <div className="flex flex-col gap-2 w-full md:w-auto">
                            <div className="relative">
                              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                              <input
                                type="text"
                                placeholder="Cari nama dosen..."
                                value={lecturerSearch}
                                onChange={(e) => setLecturerSearch(e.target.value)}
                                className="pl-8 pr-2 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none w-full md:w-60 text-gray-800"
                              />
                            </div>
                            <select
                              value={selectedSupervisorId}
                              onChange={(e) => setSelectedSupervisorId(e.target.value)}
                              className="text-xs bg-white border border-gray-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none w-full md:w-60 text-gray-800"
                            >
                              <option value="">-- Pilih Dosen Pembimbing --</option>
                              {LecturersList.filter(lecturer => 
                                lecturer.name.toLowerCase().includes(lecturerSearch.toLowerCase()) ||
                                (lecturer.nidn && lecturer.nidn.includes(lecturerSearch))
                              ).map(lecturer => {
                                const quotaCount = getLecturerQuota(lecturer.id);
                                const isNearLimit = quotaCount >= 6;
                                const isFull = quotaCount >= 8;
                                let statusText = `Bimbingan: ${quotaCount}/8`;
                                if (isFull) statusText += ' (Penuh)';
                                else if (isNearLimit) statusText += ' (Hampir Penuh)';
                                return (
                                  <option key={lecturer.id} value={lecturer.id} disabled={isFull}>
                                    {lecturer.name} ({statusText})
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          <div className="flex gap-1 shrink-0 self-end md:self-auto">
                            <button
                              onClick={() => {
                                handleAssignSupervisor(thesis.id, selectedSupervisorId);
                                setSelectedThesisId(null);
                                setSelectedSupervisorId('');
                                setLecturerSearch('');
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
                                setLecturerSearch('');
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
                            setLecturerSearch('');
                          }}
                          className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          Tunjuk Pembimbing
                        </button>
                      )
                    ) : (
                      <p className="text-xs text-gray-500 font-medium italic">
                        Menunggu penunjukan dosen pembimbing oleh Kaprodi.
                      </p>
                    )}
                  </div>
                )}

                {thesis.status === 'pending_sk' && (
                  <div className="w-full md:w-auto text-right">
                    {currentUser.role === 'admin' ? (
                      uploadingSkThesisId === thesis.id ? (
                        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full">
                          <div className="flex items-center gap-2 flex-1">
                            <label className="px-3 py-1.5 bg-gray-100 hover:bg-gray-250 rounded-lg text-xs font-semibold text-gray-700 flex items-center gap-1.5 cursor-pointer shrink-0 border border-gray-205">
                              <FileUp className="w-3.5 h-3.5 text-emerald-600" />
                              {selectedSkFile ? 'Ganti File PDF' : 'Pilih File PDF'}
                              <input
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    setSelectedSkFile(e.target.files[0]);
                                  }
                                }}
                              />
                            </label>
                            {selectedSkFile && (
                              <span className="text-xs text-gray-600 truncate max-w-[150px]" title={selectedSkFile.name}>
                                {selectedSkFile.name}
                              </span>
                            )}
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <button
                              onClick={() => {
                                if (selectedSkFile) {
                                  handleUploadSK(thesis.id, selectedSkFile);
                                  setUploadingSkThesisId(null);
                                  setSelectedSkFile(null);
                                }
                              }}
                              disabled={!selectedSkFile}
                              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs px-3 py-2 rounded-lg transition-colors cursor-pointer"
                            >
                              Simpan SK
                            </button>
                            <button
                              onClick={() => {
                                setUploadingSkThesisId(null);
                                setSelectedSkFile(null);
                              }}
                              className="bg-gray-100 hover:bg-gray-205 text-gray-700 font-bold text-xs px-3 py-2 rounded-lg transition-colors cursor-pointer"
                            >
                              Batal
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setUploadingSkThesisId(thesis.id);
                            setSelectedSkFile(null);
                          }}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <FileCheck2 className="w-3.5 h-3.5" />
                          Unggah SK Bimbingan
                        </button>
                      )
                    ) : (
                      <p className="text-xs text-amber-600 font-medium italic">
                        Menunggu file SK bimbingan diterbitkan oleh Admin.
                      </p>
                    )}
                  </div>
                )}

                {thesis.status === 'in_progress' && (
                  /* Progress bar if supervisor is assigned and SK is uploaded */
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
        }))}
      </div>
    </div>
  );
}
