// components/bimbingan/lecturer/SchedulingTab.tsx
import { useState } from 'react';
import {
  Clock,
  Plus,
  Trash2,
  Calendar as CalendarIcon,
  Star,
} from 'lucide-react';
import type { AvailabilityRule } from '@/types';
import { toast } from 'sonner';

interface SchedulingTabProps {
  myAvailabilities: AvailabilityRule[];
  handleAddAvailability: (dayOfWeek: number, startTime: string, endTime: string, isDefault: boolean) => void;
  handleToggleDefaultAvailability?: (id: string) => void;
  handleDeleteAvailability: (id: string) => void;
}

const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export default function SchedulingTab({
  myAvailabilities,
  handleAddAvailability,
  handleToggleDefaultAvailability,
  handleDeleteAvailability,
}: SchedulingTabProps) {
  // Form State Add Availability Rule
  const [availDay, setAvailDay] = useState<number>(1); // Monday
  const [availStartTime, setAvailStartTime] = useState('09:00');
  const [availEndTime, setAvailEndTime] = useState('12:00');
  const [availIsDefault, setAvailIsDefault] = useState<boolean>(true);

  const onSubmitAvailForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!availStartTime || !availEndTime) return;
    if (availStartTime >= availEndTime) {
      alert('Jam selesai harus lebih besar dari jam mulai.');
      return;
    }
    handleAddAvailability(Number(availDay), availStartTime, availEndTime, availIsDefault);
    toast.success(
      availIsDefault
        ? 'Jadwal Utama bimbingan berhasil ditambahkan!'
        : 'Jadwal Cadangan bimbingan berhasil ditambahkan!'
    );
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto" id="calcom-scheduling-container">
      {/* Header Banner */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-2">
          <Clock className="w-3.5 h-3.5" />
          <span>Ketersediaan Waktu Bimbingan</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          Jam Ketersediaan Mingguan
        </h2>
        <p className="text-xs md:text-sm text-muted-foreground mt-1">
          Atur hari dan jam ketersediaan bimbingan Anda. Tentukan 1 Jadwal Utama (Default) dan jadwal cadangan jika Anda berhalangan.
        </p>
      </div>

      <div className="space-y-6">
        {/* Form Tambah Jam Ketersediaan */}
        <form
          onSubmit={onSubmitAvailForm}
          className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4"
        >
          <p className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-emerald-600" />
            <span>Tambah Slot Jam Bimbingan</span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="availIsDefaultCheck"
              checked={availIsDefault}
              onChange={(e) => setAvailIsDefault(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
            />
            <label htmlFor="availIsDefaultCheck" className="text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer select-none flex items-center gap-1.5">
              <Star className={`w-3.5 h-3.5 ${availIsDefault ? 'text-amber-500 fill-amber-500' : 'text-gray-400'}`} />
              <span>Jadwal Utama (Default)</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Jadwal</span>
          </button>
        </form>

        {/* List Availability Rules */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-base text-gray-900 dark:text-white">
              Daftar Jam Ketersediaan ({myAvailabilities.length})
            </h3>
          </div>

          {myAvailabilities.length === 0 ? (
            <div className="bg-gray-50 dark:bg-zinc-900/50 border border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl p-8 text-center text-xs text-muted-foreground">
              Belum ada jadwal ketersediaan jam yang ditambahkan. Gunakan form di atas untuk menambah jadwal baru.
            </div>
          ) : (
            <div className="space-y-2.5">
              {myAvailabilities.map((ar, index) => (
                <div
                  key={ar.id}
                  className={`bg-white dark:bg-zinc-900 border ${
                    ar.isDefault
                      ? 'border-emerald-200 dark:border-emerald-900/60 shadow-xs'
                      : 'border-gray-100 dark:border-zinc-800'
                  } rounded-2xl px-5 py-4 flex items-center justify-between gap-4 transition-all hover:border-emerald-300 dark:hover:border-emerald-800 animate-in fade-in slide-in-from-top-2 duration-300`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-24 px-3 py-1 rounded-xl text-xs font-bold text-center bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                      {DAY_NAMES[ar.dayOfWeek] || 'Hari'}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-gray-800 dark:text-gray-200">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{ar.startTime} - {ar.endTime}</span>
                    </div>

                    {ar.isDefault ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[10px] font-bold border border-amber-200 dark:border-amber-900/50">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        Jadwal Utama
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 text-[10px] font-medium">
                        Cadangan
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {handleToggleDefaultAvailability && (
                      <button
                        onClick={() => {
                          handleToggleDefaultAvailability(ar.id);
                          toast.success(
                            !ar.isDefault
                              ? 'Slot berhasil diubah menjadi Jadwal Utama!'
                              : 'Slot diubah menjadi Jadwal Cadangan.'
                          );
                        }}
                        className={`p-2 rounded-xl transition-all cursor-pointer ${
                          ar.isDefault
                            ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                            : 'text-gray-400 hover:text-amber-500 hover:bg-gray-100 dark:hover:bg-zinc-800'
                        }`}
                        title={ar.isDefault ? 'Jadwal Utama (Klik untuk ubah jadi Cadangan)' : 'Jadwal Cadangan (Klik untuk jadikan Utama)'}
                      >
                        <Star className={`w-4 h-4 ${ar.isDefault ? 'fill-amber-500' : ''}`} />
                      </button>
                    )}

                    <button
                      onClick={() => {
                        handleDeleteAvailability(ar.id);
                        toast.success('Jadwal bimbingan berhasil dihapus.');
                      }}
                      className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer shrink-0"
                      title="Hapus Slot"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}