// components/bimbingan/lecturer/SchedulingTab.tsx
import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Copy,
  Plus,
  X,
  Clock,
  Globe,
  HelpCircle,
  Check,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  Edit3,
  CalendarCheck2,
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
  handleSetAllAvailabilities?: (newRules: AvailabilityRule[]) => void;
  handleUpdateAvailability?: (id: string, updatedRule: Partial<AvailabilityRule>) => void;
  handleToggleDefaultAvailability?: (id: string) => void;
  handleDeleteAvailability: (id: string) => void;
}

const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

// Generate 24h WIB time options in 30 min increments
const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? '00' : '30';
  const formattedHour = String(hour).padStart(2, '0');
  return `${formattedHour}:${minute}`;
});

interface DaySlot {
  startTime: string;
  endTime: string;
}

interface DaySchedule {
  enabled: boolean;
  slots: DaySlot[];
}

export default function SchedulingTab({
  myAvailabilities,
  handleAddAvailability,
  handleSetAllAvailabilities,
  handleUpdateAvailability,
  handleToggleDefaultAvailability,
  handleDeleteAvailability,
}: SchedulingTabProps) {
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newScheduleName, setNewScheduleName] = useState('');

  // Active Schedule Details
  const [scheduleName, setScheduleName] = useState('bimbingan judul skripsi');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(scheduleName);
  const [isDefault, setIsDefault] = useState(true);
  const [timezone, setTimezone] = useState('Asia/Jakarta (WIB)');

  // Is Saved State: true = Established Summary View, false = Interactive Editor
  const [isSaved, setIsSaved] = useState<boolean>(true);

  // Weekly hours state for 7 days (0: Minggu .. 6: Sabtu) - Default ALL OFF
  const [weeklyHours, setWeeklyHours] = useState<Record<number, DaySchedule>>({
    0: { enabled: false, slots: [] },
    1: { enabled: false, slots: [] },
    2: { enabled: false, slots: [] },
    3: { enabled: false, slots: [] },
    4: { enabled: false, slots: [] },
    5: { enabled: false, slots: [] },
    6: { enabled: false, slots: [] },
  });

  // Sync existing database availabilities into Weekly Hours state on load
  useEffect(() => {
    if (myAvailabilities && myAvailabilities.length > 0) {
      const initial: Record<number, DaySchedule> = {
        0: { enabled: false, slots: [] },
        1: { enabled: false, slots: [] },
        2: { enabled: false, slots: [] },
        3: { enabled: false, slots: [] },
        4: { enabled: false, slots: [] },
        5: { enabled: false, slots: [] },
        6: { enabled: false, slots: [] },
      };

      let defaultFound = false;

      myAvailabilities.forEach((ar) => {
        const day = ar.dayOfWeek;
        if (day >= 0 && day <= 6) {
          initial[day].enabled = true;
          const exists = initial[day].slots.some(
            (s) => s.startTime === ar.startTime && s.endTime === ar.endTime
          );
          if (!exists) {
            initial[day].slots.push({
              startTime: ar.startTime || '09:00',
              endTime: ar.endTime || '17:00',
            });
          }
          if (ar.isDefault) {
            defaultFound = true;
          }
          if (ar.name) {
            setScheduleName(ar.name);
          }
        }
      });

      setWeeklyHours(initial);
      setIsDefault(defaultFound);
      setIsSaved(true);
    }
  }, [myAvailabilities]);

  // Toggle Day Enable/Disable
  const handleToggleDay = (day: number) => {
    setWeeklyHours((prev) => {
      const current = prev[day];
      const nextEnabled = !current.enabled;
      return {
        ...prev,
        [day]: {
          enabled: nextEnabled,
          slots: nextEnabled
            ? current.slots.length > 0
              ? current.slots
              : [{ startTime: '09:00', endTime: '17:00' }]
            : current.slots,
        },
      };
    });
  };

  // Add extra slot interval for a day
  const handleAddSlot = (day: number) => {
    setWeeklyHours((prev) => {
      const current = prev[day];
      const lastSlot = current.slots[current.slots.length - 1];
      const newStart = lastSlot ? lastSlot.endTime : '13:00';
      const newEnd = '17:00';
      return {
        ...prev,
        [day]: {
          enabled: true,
          slots: [...current.slots, { startTime: newStart, endTime: newEnd }],
        },
      };
    });
  };

  // Remove a slot interval
  const handleRemoveSlot = (day: number, slotIndex: number) => {
    setWeeklyHours((prev) => {
      const current = prev[day];
      const nextSlots = current.slots.filter((_, idx) => idx !== slotIndex);
      return {
        ...prev,
        [day]: {
          enabled: nextSlots.length > 0,
          slots: nextSlots,
        },
      };
    });
  };

  // Update slot times
  const handleUpdateSlotTime = (
    day: number,
    slotIndex: number,
    field: 'startTime' | 'endTime',
    value: string
  ) => {
    setWeeklyHours((prev) => {
      const current = prev[day];
      const nextSlots = current.slots.map((s, idx) => {
        if (idx === slotIndex) {
          return { ...s, [field]: value };
        }
        return s;
      });
      return {
        ...prev,
        [day]: {
          ...current,
          slots: nextSlots,
        },
      };
    });
  };

  // Copy current day's slots to all other active/work days (Senin - Jumat)
  const handleCopySlotsToAll = (sourceDay: number) => {
    const sourceSlots = weeklyHours[sourceDay].slots;
    if (!sourceSlots || sourceSlots.length === 0) return;

    setWeeklyHours((prev) => {
      const next = { ...prev };
      [1, 2, 3, 4, 5].forEach((day) => {
        next[day] = {
          enabled: true,
          slots: JSON.parse(JSON.stringify(sourceSlots)),
        };
      });
      return next;
    });

    toast.success(`Jam bimbingan hari ${DAY_NAMES[sourceDay]} telah disalin ke seluruh hari kerja!`);
  };

  // Save all weekly hours to database (Transition to Established View)
  const handleSaveAll = () => {
    const newRulesList: AvailabilityRule[] = [];
    const nextWeeklyHours: Record<number, DaySchedule> = { ...weeklyHours };

    Object.entries(weeklyHours).forEach(([dayStr, daySched]) => {
      const day = Number(dayStr);
      if (daySched.enabled && daySched.slots.length > 0) {
        // Sort slots chronologically
        const sortedSlots = [...daySched.slots].sort((a, b) => a.startTime.localeCompare(b.startTime));
        nextWeeklyHours[day] = { enabled: true, slots: sortedSlots };
        sortedSlots.forEach((slot, idx) => {
          newRulesList.push({
            id: `ar-${Date.now()}-${day}-${idx}`,
            lecturerId: 'user-lecturer-1',
            dayOfWeek: day,
            startTime: slot.startTime,
            endTime: slot.endTime,
            isDefault: isDefault,
            name: scheduleName,
            rules: {
              sessionName: scheduleName,
              maxQuotaPerSession: 5,
              maxQuotaTotal: 20,
              sessionDurationMinutes: 30,
            },
          });
        });
      } else {
        nextWeeklyHours[day] = { enabled: false, slots: [] };
      }
    });

    if (handleSetAllAvailabilities) {
      handleSetAllAvailabilities(newRulesList);
    } else {
      myAvailabilities.forEach((ar) => handleDeleteAvailability(ar.id));
      newRulesList.forEach((r) =>
        handleAddAvailability(r.dayOfWeek, r.startTime, r.endTime, r.isDefault ?? false, r.rules)
      );
    }

    setWeeklyHours(nextWeeklyHours);
    setIsSaved(true);

    toast.success(`Jadwal ketersediaan "${scheduleName}" berhasil ditetapkan!`, {
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
    });
  };

  // Reset & Reconfigure Schedule
  const handleResetSchedule = () => {
    if (confirm('Apakah Anda ingin mengatur ulang jadwal ketersediaan? Semua hari akan dikembalikan ke status kosong.')) {
      setWeeklyHours({
        0: { enabled: false, slots: [] },
        1: { enabled: false, slots: [] },
        2: { enabled: false, slots: [] },
        3: { enabled: false, slots: [] },
        4: { enabled: false, slots: [] },
        5: { enabled: false, slots: [] },
        6: { enabled: false, slots: [] },
      });
      setIsSaved(false);
      toast.info('Jadwal berhasil diatur ulang. Silakan aktifkan hari yang Anda inginkan lalu klik Save.');
    }
  };

  // Handle modal submit "Add a new schedule"
  const handleCreateNewSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScheduleName.trim()) {
      toast.error('Masukkan nama jadwal terlebih dahulu.');
      return;
    }
    setScheduleName(newScheduleName.trim());
    setShowAddModal(false);
    setIsSaved(false);
    toast.success(`${newScheduleName.trim()} schedule created successfully`);
  };

  return (
    <div className="space-y-6 font-sans max-w-6xl mx-auto text-emerald-950 dark:text-white">
      {/* HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-emerald-50/70 dark:bg-zinc-900 border border-emerald-100/90 dark:border-zinc-800 p-4 sm:px-6 rounded-3xl shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="p-2 rounded-xl bg-white dark:bg-zinc-800 hover:bg-emerald-100/80 dark:hover:bg-emerald-950/40 text-emerald-900 dark:text-zinc-300 transition-all cursor-pointer border border-emerald-200/60 dark:border-zinc-700"
            title="Tambah Jadwal Baru"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          </button>

          {isEditingName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="bg-white dark:bg-zinc-800 border-2 border-emerald-500 rounded-xl px-3 py-1.5 text-sm font-bold text-emerald-950 dark:text-white focus:outline-hidden"
                autoFocus
              />
              <button
                type="button"
                onClick={() => {
                  setScheduleName(tempName);
                  setIsEditingName(false);
                }}
                className="p-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 group">
              <h2 className="text-base font-extrabold tracking-tight text-emerald-950 dark:text-white capitalize">
                {scheduleName}
              </h2>
              {isDefault && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold font-mono bg-white dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 flex items-center gap-1 shadow-2xs">
                  <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Default</span>
                </span>
              )}
              <button
                type="button"
                onClick={() => {
                  setTempName(scheduleName);
                  setIsEditingName(true);
                }}
                className="p-1 text-emerald-600/70 hover:text-emerald-800 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ml-1"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Top Right Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
          {/* Set as default toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-900 dark:text-zinc-300">Set as default</span>
            <button
              type="button"
              onClick={() => setIsDefault(!isDefault)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                isDefault ? 'bg-emerald-600' : 'bg-emerald-200/80 dark:bg-zinc-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isDefault ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Delete Schedule Button */}
          <button
            type="button"
            onClick={() => {
              if (confirm('Apakah Anda yakin ingin menghapus seluruh jadwal ketersediaan ini?')) {
                myAvailabilities.forEach((ar) => handleDeleteAvailability(ar.id));
                toast.success('Jadwal ketersediaan berhasil dihapus.');
              }
            }}
            className="p-2 text-emerald-700/60 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all cursor-pointer"
            title="Delete Schedule"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Mode Switcher: Edit or Save */}
          {isSaved ? (
            <button
              type="button"
              onClick={() => setIsSaved(false)}
              className="py-2.5 px-6 rounded-xl bg-white dark:bg-zinc-800 hover:bg-emerald-100/70 text-emerald-900 dark:text-white font-extrabold text-xs border border-emerald-200/80 dark:border-zinc-700 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ubah Jadwal</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSaveAll}
              className="py-2.5 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save</span>
            </button>
          )}
        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: WEEKLY HOURS CARD */}
        <div className="lg:col-span-8 bg-emerald-50/70 dark:bg-zinc-900 border border-emerald-100/90 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-6">
          {/* HEADER CARD STATE */}
          <div className="flex items-center justify-between border-b border-emerald-100/80 dark:border-zinc-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-emerald-950 dark:text-white tracking-tight flex items-center gap-2">
                <span>Weekly hours</span>
                {isSaved ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <CalendarCheck2 className="w-3 h-3 text-emerald-600" />
                    <span>🟢 Ditetapkan & Aktif</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    ✏️ Mode Pengeditan
                  </span>
                )}
              </h3>
              <p className="text-xs text-emerald-800/80 dark:text-zinc-400 mt-0.5">
                {isSaved
                  ? 'Jadwal ketersediaan Anda telah ditetapkan dan aktif di sistem untuk dipilih mahasiswa.'
                  : 'Atur hari dan jam ketersediaan bimbingan Anda, lalu klik Save jika selesai.'}
              </p>
            </div>

            {isSaved ? (
              <button
                type="button"
                onClick={() => setIsSaved(false)}
                className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-zinc-800 hover:bg-emerald-100/80 text-emerald-900 dark:text-white text-xs font-bold border border-emerald-200/80 dark:border-zinc-700 flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Edit Jam</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveAll}
                className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            )}
          </div>

          {/* 1. STATE A: IS SAVED = TRUE (Clean Established Summary View) */}
          {isSaved ? (
            <div className="space-y-4 divide-y divide-emerald-100/80 dark:divide-zinc-800/80">
              {DAY_NAMES.map((dayName, dayIndex) => {
                const daySched = weeklyHours[dayIndex] || { enabled: false, slots: [] };
                const isEnabled = daySched.enabled && daySched.slots.length > 0;

                return (
                  <div key={dayIndex} className="pt-4 first:pt-0 flex items-center justify-between gap-4">
                    {/* Left: Day Indicator */}
                    <div className="flex items-center gap-2.5 min-w-[120px]">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          isEnabled ? 'bg-emerald-500 shadow-2xs shadow-emerald-400' : 'bg-gray-300 dark:bg-zinc-700'
                        }`}
                      />
                      <span className="text-xs font-bold text-emerald-950 dark:text-white">{dayName}</span>
                    </div>

                    {/* Middle: Badges for Established Slots */}
                    <div className="flex-1 flex items-center gap-2 flex-wrap">
                      {isEnabled ? (
                        daySched.slots.map((slot, sIdx) => (
                          <span
                            key={sIdx}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-zinc-800 text-emerald-900 dark:text-emerald-200 text-xs font-mono font-bold border border-emerald-200/80 dark:border-zinc-700 shadow-2xs"
                          >
                            <Clock className="w-3 h-3 text-emerald-600" />
                            <span>
                              {slot.startTime} - {slot.endTime} WIB
                            </span>
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-emerald-700/50 dark:text-zinc-500 font-medium italic">
                          Tidak Ada Bimbingan (Libur)
                        </span>
                      )}
                    </div>

                    {/* Right Status */}
                    <span className="text-[11px] font-semibold text-emerald-800/70 dark:text-zinc-400 shrink-0">
                      {isEnabled ? '✓ Ditetapkan' : 'OFF'}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            /* 2. STATE B: IS SAVED = FALSE (Interactive Weekly Hours Form Builder) */
            <div className="space-y-4 divide-y divide-emerald-100/80 dark:divide-zinc-800/80">
              {DAY_NAMES.map((dayName, dayIndex) => {
                const daySched = weeklyHours[dayIndex] || { enabled: false, slots: [] };

                return (
                  <div key={dayIndex} className="pt-4 first:pt-0 flex flex-col sm:flex-row items-start justify-between gap-3 group">
                    {/* Left: Day Switch & Day Name */}
                    <div className="flex items-center gap-3 min-w-[130px] pt-1">
                      <button
                        type="button"
                        onClick={() => handleToggleDay(dayIndex)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                          daySched.enabled ? 'bg-emerald-600' : 'bg-emerald-200/80 dark:bg-zinc-700'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                            daySched.enabled ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                      <span className="text-xs font-bold text-emerald-950 dark:text-white min-w-[60px]">{dayName}</span>
                    </div>

                    {/* Middle: Slots or Unavailable */}
                    <div className="flex-1 w-full sm:w-auto">
                      {!daySched.enabled || daySched.slots.length === 0 ? (
                        <span className="text-xs text-emerald-700/60 dark:text-zinc-500 font-medium italic">Unavailable (OFF)</span>
                      ) : (
                        <div className="space-y-2">
                          {daySched.slots.map((slot, slotIdx) => (
                            <div key={slotIdx} className="flex items-center gap-2">
                              {/* Start Time Select */}
                              <select
                                value={slot.startTime}
                                onChange={(e) =>
                                  handleUpdateSlotTime(dayIndex, slotIdx, 'startTime', e.target.value)
                                }
                                className="bg-white dark:bg-zinc-800 border border-emerald-200/80 dark:border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-emerald-950 dark:text-white font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer shadow-2xs"
                              >
                                {TIME_OPTIONS.map((t) => (
                                  <option key={t} value={t}>
                                    {t}
                                  </option>
                                ))}
                              </select>

                              <span className="text-emerald-700/60 dark:text-zinc-500 text-xs font-bold">-</span>

                              {/* End Time Select */}
                              <select
                                value={slot.endTime}
                                onChange={(e) =>
                                  handleUpdateSlotTime(dayIndex, slotIdx, 'endTime', e.target.value)
                                }
                                className="bg-white dark:bg-zinc-800 border border-emerald-200/80 dark:border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-emerald-950 dark:text-white font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer shadow-2xs"
                              >
                                {TIME_OPTIONS.map((t) => (
                                  <option key={t} value={t}>
                                    {t}
                                  </option>
                                ))}
                              </select>

                              {/* Delete Slot Button */}
                              <button
                                type="button"
                                onClick={() => handleRemoveSlot(dayIndex, slotIdx)}
                                className="p-1.5 text-emerald-700/60 hover:text-red-600 hover:bg-red-50 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer ml-1"
                                title="Hapus Jam"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right Actions: Add Interval (+) and Copy to All (📋) */}
                    <div className="flex items-center gap-1.5 self-end sm:self-start pt-1 shrink-0">
                      {/* Plus Button */}
                      <button
                        type="button"
                        onClick={() => handleAddSlot(dayIndex)}
                        className="p-1.5 bg-white dark:bg-zinc-800 hover:bg-emerald-100/80 dark:hover:bg-emerald-950/40 text-emerald-800 dark:text-zinc-300 hover:text-emerald-900 rounded-lg border border-emerald-200/80 dark:border-zinc-700 transition-colors cursor-pointer shadow-2xs"
                        title="Tambah Sesi/Interval Jam"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>

                      {/* Copy Button */}
                      {daySched.enabled && (
                        <button
                          type="button"
                          onClick={() => handleCopySlotsToAll(dayIndex)}
                          className="p-1.5 bg-white dark:bg-zinc-800 hover:bg-emerald-100/80 dark:hover:bg-emerald-950/40 text-emerald-800 dark:text-zinc-300 hover:text-emerald-900 rounded-lg border border-emerald-200/80 dark:border-zinc-700 transition-colors cursor-pointer shadow-2xs"
                          title="Salin Jam ke Semua Hari Kerja"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: SIDEBAR CONTROLS */}
        <div className="lg:col-span-4 space-y-6">
          {/* TIMEZONE CARD */}
          <div className="bg-emerald-50/70 dark:bg-zinc-900 border border-emerald-100/90 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-3">
            <label className="text-xs font-bold text-emerald-950 dark:text-white block">Timezone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full bg-white dark:bg-zinc-800 border border-emerald-200/80 dark:border-zinc-700 rounded-xl p-3 text-xs text-emerald-950 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer shadow-2xs"
            >
              <option value="Asia/Jakarta (WIB)">Asia/Jakarta (WIB)</option>
              <option value="Asia/Bangkok (ICT)">Asia/Bangkok (ICT)</option>
              <option value="Asia/Singapore (SGT)">Asia/Singapore (SGT)</option>
            </select>
          </div>

          {/* TROUBLESHOOTER & ATUR ULANG CARD */}
          <div className="bg-emerald-50/70 dark:bg-zinc-900 border border-emerald-100/90 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-emerald-950 dark:text-white">Berhalangan Hadir / Ubah Jadwal?</h4>
            <p className="text-[11px] text-emerald-800/80 dark:text-zinc-400">
              Klik tombol di bawah ini jika Anda berhalangan hadir atau ingin menyusun ulang jadwal ketersediaan bimbingan dari awal.
            </p>
            <button
              type="button"
              onClick={handleResetSchedule}
              className="w-full py-2.5 px-4 bg-white dark:bg-zinc-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-900 dark:text-amber-300 rounded-xl text-xs font-bold border border-amber-200 dark:border-amber-800/60 transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Atur Ulang Jadwal</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: ADD A NEW SCHEDULE */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-emerald-100 dark:border-zinc-800 text-emerald-950 dark:text-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-emerald-100 dark:border-zinc-800 pb-3">
              <h3 className="text-lg font-bold tracking-tight text-emerald-950 dark:text-white">Add a new schedule</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-emerald-700/60 hover:text-emerald-950 dark:hover:text-white hover:bg-emerald-100/60 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewSchedule} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-emerald-900 dark:text-zinc-300 block">Name</label>
                <input
                  type="text"
                  value={newScheduleName}
                  onChange={(e) => setNewScheduleName(e.target.value)}
                  placeholder="Working hours"
                  required
                  className="w-full bg-emerald-50/50 dark:bg-zinc-800 border border-emerald-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-emerald-950 dark:text-white placeholder:text-emerald-700/50 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-emerald-800 dark:text-zinc-400 hover:text-emerald-950 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}