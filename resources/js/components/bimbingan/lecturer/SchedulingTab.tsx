// components/bimbingan/lecturer/SchedulingTab.tsx
import { useState } from 'react';
import {
  Clock,
  Plus,
  Trash2,
  Calendar as CalendarIcon,
  CheckCircle2,
  Sparkles,
  Info,
  X,
} from 'lucide-react';
import type { AvailabilityRule, EventType } from '@/types';

interface SchedulingTabProps {
  myEventTypes: EventType[];
  myAvailabilities: AvailabilityRule[];
  handleAddEventType: (name: string, duration: number, desc: string) => void;
  handleDeleteEventType: (id: string) => void;
  handleAddAvailability: (dayOfWeek: number, startTime: string, endTime: string) => void;
  handleDeleteAvailability: (id: string) => void;
}

const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export default function SchedulingTab({
  myEventTypes,
  myAvailabilities,
  handleAddEventType,
  handleDeleteEventType,
  handleAddAvailability,
  handleDeleteAvailability,
}: SchedulingTabProps) {
  // Modal State Add Event Type
  const [showEtModal, setShowEtModal] = useState(false);
  const [etName, setEtName] = useState('');
  const [etDuration, setEtDuration] = useState(30);
  const [etDesc, setEtDesc] = useState('');

  // Form State Add Availability Rule
  const [availDay, setAvailDay] = useState<number>(1); // Monday
  const [availStartTime, setAvailStartTime] = useState('09:00');
  const [availEndTime, setAvailEndTime] = useState('12:00');

  const onSubmitEtForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!etName.trim()) return;
    handleAddEventType(etName.trim(), Number(etDuration), etDesc.trim());
    setEtName('');
    setEtDuration(30);
    setEtDesc('');
    setShowEtModal(false);
  };

  const onSubmitAvailForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!availStartTime || !availEndTime) return;
    if (availStartTime >= availEndTime) {
      alert('Jam selesai harus lebih besar dari jam mulai.');
      return;
    }
    handleAddAvailability(Number(availDay), availStartTime, availEndTime);
  };

  return (
    <div className="space-y-8 text-left" id="calcom-scheduling-container">
      {/* Header Banner Cal.com Style */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Cal.com Availability Engine</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            Ketersediaan Waktu & Tipe Sesi
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Atur durasi bimbingan dan hari/jam ketersediaan Anda untuk pemesanan bimbingan oleh mahasiswa.
          </p>
        </div>

        <button
          onClick={() => setShowEtModal(true)}
          className="px-5 py-3 rounded-2xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/10 transition-all cursor-pointer flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Tipe Sesi</span>
        </button>
      </div>

      {/* Grid 2 Kolom: Event Types & Availability Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Kolom Kiri: Event Types (Tipe Sesi Bimbingan) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-bold text-base text-gray-900 dark:text-white">
                Tipe Sesi Bimbingan ({myEventTypes.length})
              </h3>
            </div>
          </div>

          {myEventTypes.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-8 text-center space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mx-auto">
                <Clock className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Belum ada tipe sesi
              </p>
              <p className="text-xs text-muted-foreground">
                Klik tombol "Tambah Tipe Sesi" untuk membuat durasi bimbingan baru.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {myEventTypes.map((et) => (
                <div
                  key={et.id}
                  className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-800 transition-all flex items-start justify-between gap-4 group"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                        {et.name}
                      </h4>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                        {et.duration} Menit
                      </span>
                    </div>
                    {et.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {et.description}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteEventType(et.id)}
                    className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer shrink-0"
                    title="Hapus Tipe Sesi"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Kolom Kanan: Weekly Availability Rules */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-base text-gray-900 dark:text-white">
              Jam Ketersediaan Mingguan ({myAvailabilities.length})
            </h3>
          </div>

          {/* Form Tambah Jam Ketersediaan */}
          <form
            onSubmit={onSubmitAvailForm}
            className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-4"
          >
            <p className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tambah Slot Jam Bimbingan</span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground">Hari</label>
                <select
                  value={availDay}
                  onChange={(e) => setAvailDay(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  {DAY_NAMES.map((d, idx) => (
                    <option key={idx} value={idx}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground">Jam Mulai</label>
                <input
                  type="time"
                  value={availStartTime}
                  onChange={(e) => setAvailStartTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground">Jam Selesai</label>
                <input
                  type="time"
                  value={availEndTime}
                  onChange={(e) => setAvailEndTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Simpan Jam Ketersediaan</span>
            </button>
          </form>

          {/* List Availability Rules */}
          {myAvailabilities.length === 0 ? (
            <div className="bg-gray-50 dark:bg-zinc-900/50 border border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl p-6 text-center text-xs text-muted-foreground">
              Belum ada jadwal ketersediaan jam yang ditambahkan.
            </div>
          ) : (
            <div className="space-y-2.5">
              {myAvailabilities.map((ar) => (
                <div
                  key={ar.id}
                  className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl px-5 py-3.5 shadow-xs flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-20 px-3 py-1 rounded-xl text-xs font-bold text-center bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                      {DAY_NAMES[ar.dayOfWeek] || 'Hari'}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-gray-800 dark:text-gray-200">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{ar.startTime} - {ar.endTime}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteAvailability(ar.id)}
                    className="p-1.5 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer shrink-0"
                    title="Hapus Slot"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Add Event Type */}
      {showEtModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-gray-900 dark:text-white">
                  Tambah Tipe Sesi Bimbingan
                </h3>
              </div>
              <button
                onClick={() => setShowEtModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={onSubmitEtForm} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Nama Sesi Bimbingan
                </label>
                <input
                  type="text"
                  required
                  value={etName}
                  onChange={(e) => setEtName(e.target.value)}
                  placeholder="Misal: Konsultasi Proposal Skripsi"
                  className="w-full p-3 rounded-xl text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Durasi Sesi (Menit)
                </label>
                <select
                  value={etDuration}
                  onChange={(e) => setEtDuration(Number(e.target.value))}
                  className="w-full p-3 rounded-xl text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-semibold"
                >
                  <option value={15}>15 Menit</option>
                  <option value={30}>30 Menit</option>
                  <option value={45}>45 Menit</option>
                  <option value={60}>60 Menit (1 Jam)</option>
                  <option value={90}>90 Menit (1.5 Jam)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Deskripsi / Petunjuk Sesi (Opsional)
                </label>
                <textarea
                  rows={3}
                  value={etDesc}
                  onChange={(e) => setEtDesc(e.target.value)}
                  placeholder="Misal: Sesi ini khusus review instrumen penelitian & latar belakang."
                  className="w-full p-3 rounded-xl text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEtModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-md transition-all"
                >
                  Simpan Tipe Sesi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}