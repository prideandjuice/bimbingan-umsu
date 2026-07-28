// components/bimbingan/lecturer/SchedulingTab.tsx
import { useState } from 'react';
import {
  Clock,
  Plus,
  Trash2,
  Calendar as CalendarIcon,
  Star,
  Users,
  Edit2,
  Check,
  X,
  Sliders,
} from 'lucide-react';
import type { AvailabilityRule, AvailabilityRuleConfig } from '@/types';
import { toast } from 'sonner';

interface SchedulingTabProps {
  myAvailabilities: AvailabilityRule[];
  handleAddAvailability: (
    dayOfWeek: number,
    startTime: string,
    endTime: string,
    isDefault: boolean,
    rules?: AvailabilityRuleConfig
  ) => void;
  handleUpdateAvailability?: (id: string, updatedRule: Partial<AvailabilityRule>) => void;
  handleToggleDefaultAvailability?: (id: string) => void;
  handleDeleteAvailability: (id: string) => void;
}

const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const TIME_OPTIONS = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
];

export default function SchedulingTab({
  myAvailabilities,
  handleAddAvailability,
  handleUpdateAvailability,
  handleToggleDefaultAvailability,
  handleDeleteAvailability,
}: SchedulingTabProps) {
  // Base Form State Add Availability Rule
  const [availDay, setAvailDay] = useState<number>(1); // Monday
  const [availStartTime, setAvailStartTime] = useState('09:00');
  const [availEndTime, setAvailEndTime] = useState('12:00');
  const [availIsDefault, setAvailIsDefault] = useState<boolean>(true);

  // Rules Form State
  const [sessionName, setSessionName] = useState('Sesi Pagi');
  const [maxQuotaPerSession, setMaxQuotaPerSession] = useState<number>(5);
  const [maxQuotaTotal, setMaxQuotaTotal] = useState<number>(20);
  const [sessionDurationMinutes, setSessionDurationMinutes] = useState<number>(30);

  // Modal Edit State for existing rules
  const [editingRule, setEditingRule] = useState<AvailabilityRule | null>(null);
  const [editDay, setEditDay] = useState<number>(1);
  const [editStartTime, setEditStartTime] = useState<string>('09:00');
  const [editEndTime, setEditEndTime] = useState<string>('12:00');
  const [editSessionName, setEditSessionName] = useState('');
  const [editMaxQuotaPerSession, setEditMaxQuotaPerSession] = useState<number>(5);
  const [editMaxQuotaTotal, setEditMaxQuotaTotal] = useState<number>(20);
  const [editSessionDuration, setEditSessionDuration] = useState<number>(30);

  const onSubmitAvailForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!availStartTime || !availEndTime) return;
    if (availStartTime >= availEndTime) {
      alert('Jam selesai harus lebih besar dari jam mulai.');
      return;
    }

    const rulesObj: AvailabilityRuleConfig = {
      sessionName,
      maxQuotaPerSession,
      maxQuotaTotal,
      sessionDurationMinutes,
    };

    handleAddAvailability(
      Number(availDay),
      availStartTime,
      availEndTime,
      availIsDefault,
      rulesObj
    );

    toast.success(
      availIsDefault
        ? 'Jadwal Utama bimbingan & Aturan Sesi berhasil ditambahkan!'
        : 'Jadwal Cadangan bimbingan & Aturan Sesi berhasil ditambahkan!'
    );
  };

  const openEditModal = (ar: AvailabilityRule) => {
    setEditingRule(ar);
    setEditDay(ar.dayOfWeek);
    setEditStartTime(ar.startTime);
    setEditEndTime(ar.endTime);

    const existingRules = ar.rules || {
      sessionName: 'Sesi Pagi',
      maxQuotaPerSession: 5,
      maxQuotaTotal: 20,
      sessionDurationMinutes: 30,
    };
    setEditSessionName(existingRules.sessionName || 'Sesi Pagi');
    setEditMaxQuotaPerSession(existingRules.maxQuotaPerSession ?? 5);
    setEditMaxQuotaTotal(existingRules.maxQuotaTotal ?? 20);
    setEditSessionDuration(existingRules.sessionDurationMinutes ?? 30);
  };

  const handleSaveEditRule = () => {
    if (!editingRule || !handleUpdateAvailability) return;

    if (editStartTime >= editEndTime) {
      alert('Jam selesai harus lebih besar dari jam mulai.');
      return;
    }

    const updatedRulesObj: AvailabilityRuleConfig = {
      sessionName: editSessionName,
      maxQuotaPerSession: editMaxQuotaPerSession,
      maxQuotaTotal: editMaxQuotaTotal,
      sessionDurationMinutes: editSessionDuration,
    };

    handleUpdateAvailability(editingRule.id, {
      dayOfWeek: editDay,
      startTime: editStartTime,
      endTime: editEndTime,
      rules: updatedRulesObj,
    });

    toast.success('Aturan ketersediaan berhasil diperbarui!');
    setEditingRule(null);
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto" id="calcom-scheduling-container">
      {/* Header Banner */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-2">
          <Clock className="w-3.5 h-3.5" />
          <span>Ketersediaan Waktu & Sesi Bimbingan</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          Jam Ketersediaan & Aturan Sesi
        </h2>
        <p className="text-xs md:text-sm text-muted-foreground mt-1">
          Atur jam bimbingan mingguan (WIB) beserta aturan sesi (kuota per sesi, limit total kuota, dan durasi per sesi).
        </p>
      </div>

      <div className="space-y-6">
        {/* Form Tambah Jam Ketersediaan */}
        <form
          onSubmit={onSubmitAvailForm}
          className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-5"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>Tambah Slot Jam & Aturan Sesi</span>
            </p>
          </div>

          {/* Core Slot Information: 24-hour WIB Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50/50 dark:bg-zinc-800/40 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground">Hari</label>
              <select
                value={availDay}
                onChange={(e) => setAvailDay(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl text-xs bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
              >
                {DAY_NAMES.map((d, idx) => (
                  <option key={idx} value={idx}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground">Jam Mulai (WIB)</label>
              <select
                value={availStartTime}
                onChange={(e) => setAvailStartTime(e.target.value)}
                className="w-full p-2.5 rounded-xl text-xs bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono font-bold text-gray-800 dark:text-gray-200"
              >
                {TIME_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t} WIB
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground">Jam Selesai (WIB)</label>
              <select
                value={availEndTime}
                onChange={(e) => setAvailEndTime(e.target.value)}
                className="w-full p-2.5 rounded-xl text-xs bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono font-bold text-gray-800 dark:text-gray-200"
              >
                {TIME_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t} WIB
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Rules Section: Form Visual */}
          <div className="border border-emerald-100 dark:border-emerald-950/60 bg-emerald-50/30 dark:bg-emerald-950/10 p-4.5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                  Aturan Sesi & Kuota
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">
                  Nama Sesi
                </label>
                <input
                  type="text"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  placeholder="Contoh: Sesi Pagi"
                  className="w-full p-2.5 rounded-xl text-xs bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">
                  Batas Kuota / Sesi
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={maxQuotaPerSession}
                  onChange={(e) => setMaxQuotaPerSession(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl text-xs bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">
                  Batas Kuota Total
                </label>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={maxQuotaTotal}
                  onChange={(e) => setMaxQuotaTotal(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl text-xs bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">
                  Durasi / Sesi (menit)
                </label>
                <select
                  value={sessionDurationMinutes}
                  onChange={(e) => setSessionDurationMinutes(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl text-xs bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  <option value={15}>15 Menit</option>
                  <option value={20}>20 Menit</option>
                  <option value={30}>30 Menit</option>
                  <option value={45}>45 Menit</option>
                  <option value={60}>60 Menit</option>
                  <option value={90}>90 Menit</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="availIsDefaultCheck"
                checked={availIsDefault}
                onChange={(e) => setAvailIsDefault(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
              />
              <label
                htmlFor="availIsDefaultCheck"
                className="text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer select-none flex items-center gap-1.5"
              >
                <Star
                  className={`w-3.5 h-3.5 ${
                    availIsDefault ? 'text-amber-500 fill-amber-500' : 'text-gray-400'
                  }`}
                />
                <span>Jadwal Utama (Default)</span>
              </label>
            </div>

            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Jadwal</span>
            </button>
          </div>
        </form>

        {/* List Availability Rules */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-bold text-base text-gray-900 dark:text-white">
                Daftar Jam Ketersediaan ({myAvailabilities.length})
              </h3>
            </div>
          </div>

          {myAvailabilities.length === 0 ? (
            <div className="bg-gray-50 dark:bg-zinc-900/50 border border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl p-8 text-center text-xs text-muted-foreground">
              Belum ada jadwal ketersediaan jam yang ditambahkan. Gunakan form di atas untuk menambah jadwal baru.
            </div>
          ) : (
            <div className="space-y-3">
              {myAvailabilities.map((ar) => {
                const rules = ar.rules || {};
                return (
                  <div
                    key={ar.id}
                    className={`bg-white dark:bg-zinc-900 border ${
                      ar.isDefault
                        ? 'border-emerald-300 dark:border-emerald-900/80 shadow-xs'
                        : 'border-gray-100 dark:border-zinc-800'
                    } rounded-2xl p-5 space-y-3 transition-all hover:border-emerald-300 dark:hover:border-emerald-800 animate-in fade-in slide-in-from-top-2 duration-300`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="w-24 px-3 py-1 rounded-xl text-xs font-bold text-center bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                          {DAY_NAMES[ar.dayOfWeek] || 'Hari'}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-gray-800 dark:text-gray-200">
                          <Clock className="w-3.5 h-3.5 text-emerald-600" />
                          <span>
                            {ar.startTime} - {ar.endTime} WIB
                          </span>
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
                        {handleUpdateAvailability && (
                          <button
                            onClick={() => openEditModal(ar)}
                            className="p-2 rounded-xl text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all cursor-pointer"
                            title="Edit Aturan Sesi"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}

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
                            title={
                              ar.isDefault
                                ? 'Jadwal Utama (Klik untuk ubah jadi Cadangan)'
                                : 'Jadwal Cadangan (Klik untuk jadikan Utama)'
                            }
                          >
                            <Star
                              className={`w-4 h-4 ${ar.isDefault ? 'fill-amber-500' : ''}`}
                            />
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

                    {/* Rules Badge Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-gray-100 dark:border-zinc-800/80">
                      <div className="bg-emerald-50/60 dark:bg-emerald-950/30 p-2 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                        <span className="text-[10px] text-muted-foreground block font-medium">Sesi</span>
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                          {rules.sessionName || 'Sesi Standard'}
                        </span>
                      </div>

                      <div className="bg-blue-50/60 dark:bg-blue-950/30 p-2 rounded-xl border border-blue-100 dark:border-blue-900/40">
                        <span className="text-[10px] text-muted-foreground block font-medium">Batas / Sesi</span>
                        <span className="text-xs font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1 font-mono">
                          <Users className="w-3 h-3" />
                          {rules.maxQuotaPerSession ?? 5} Org / Sesi
                        </span>
                      </div>

                      <div className="bg-purple-50/60 dark:bg-purple-950/30 p-2 rounded-xl border border-purple-100 dark:border-purple-900/40">
                        <span className="text-[10px] text-muted-foreground block font-medium">Batas Max Total</span>
                        <span className="text-xs font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1 font-mono">
                          {rules.maxQuotaTotal ?? 20} Org
                        </span>
                      </div>

                      <div className="bg-amber-50/60 dark:bg-amber-950/30 p-2 rounded-xl border border-amber-100 dark:border-amber-900/40">
                        <span className="text-[10px] text-muted-foreground block font-medium">Durasi / Sesi</span>
                        <span className="text-xs font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          {rules.sessionDurationMinutes ?? 30} Menit
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* MODAL: Edit Rules & Time Modal */}
      {editingRule && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-gray-900 dark:text-white">
                  Edit Jam Ketersediaan & Aturan Sesi
                </h3>
              </div>
              <button
                onClick={() => setEditingRule(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Time Slot Editing: 24-hour WIB Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50 dark:bg-zinc-800/60 p-3 rounded-2xl border border-gray-100 dark:border-zinc-800">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">Hari</label>
                <select
                  value={editDay}
                  onChange={(e) => setEditDay(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl text-xs bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 font-medium"
                >
                  {DAY_NAMES.map((d, idx) => (
                    <option key={idx} value={idx}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">Jam Mulai (WIB)</label>
                <select
                  value={editStartTime}
                  onChange={(e) => setEditStartTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl text-xs bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 font-mono font-bold text-gray-800 dark:text-gray-200"
                >
                  {TIME_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t} WIB
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">Jam Selesai (WIB)</label>
                <select
                  value={editEndTime}
                  onChange={(e) => setEditEndTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl text-xs bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 font-mono font-bold text-gray-800 dark:text-gray-200"
                >
                  {TIME_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t} WIB
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Rules Editing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">
                  Nama Sesi
                </label>
                <input
                  type="text"
                  value={editSessionName}
                  onChange={(e) => setEditSessionName(e.target.value)}
                  className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">
                  Batas Kuota / Sesi
                </label>
                <input
                  type="number"
                  min={1}
                  value={editMaxQuotaPerSession}
                  onChange={(e) => setEditMaxQuotaPerSession(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">
                  Batas Kuota Total
                </label>
                <input
                  type="number"
                  min={1}
                  value={editMaxQuotaTotal}
                  onChange={(e) => setEditMaxQuotaTotal(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">
                  Durasi / Sesi (menit)
                </label>
                <select
                  value={editSessionDuration}
                  onChange={(e) => setEditSessionDuration(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 font-medium"
                >
                  <option value={15}>15 Menit</option>
                  <option value={20}>20 Menit</option>
                  <option value={30}>30 Menit</option>
                  <option value={45}>45 Menit</option>
                  <option value={60}>60 Menit</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setEditingRule(null)}
                className="w-1/2 py-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 text-xs font-bold transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveEditRule}
                className="w-1/2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}