// components/bimbingan/lecturer/ScheduleDetailEditor.tsx
import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Copy,
  Plus,
  X,
  Clock,
  Check,
  CheckCircle2,
  RotateCcw,
  Edit3,
  CalendarCheck2,
  Users,
} from 'lucide-react';
import type { AvailabilityRule, AvailabilityRuleConfig } from '@/types';
import { toast } from 'sonner';

interface ScheduleDetailEditorProps {
  scheduleName: string;
  myAvailabilities: AvailabilityRule[];
  onBack: () => void;
  onSaveSchedule: (newRules: AvailabilityRule[], name: string, isDefault: boolean) => void;
  onDeleteSchedule: (name: string) => void;
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

export default function ScheduleDetailEditor({
  scheduleName: initialScheduleName,
  myAvailabilities,
  onBack,
  onSaveSchedule,
  onDeleteSchedule,
}: ScheduleDetailEditorProps) {
  const [scheduleName, setScheduleName] = useState(initialScheduleName);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(initialScheduleName);
  const [isDefault, setIsDefault] = useState(true);
  const [isSaved, setIsSaved] = useState<boolean>(true);

  const initialMatchingRule = myAvailabilities.find(
    (ar) => (ar.name?.trim() || ar.rules?.sessionName?.trim() || 'Bimbingan Judul Skripsi') === initialScheduleName
  );
  const [maxQuotaPerSession, setMaxQuotaPerSession] = useState<number>(
    initialMatchingRule?.rules?.maxQuotaPerSession || 1
  );

  // Weekly hours state for 7 days (0: Minggu .. 6: Sabtu)
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
    const matchingRules = myAvailabilities.filter(
      (ar) => (ar.name?.trim() || ar.rules?.sessionName?.trim() || 'Bimbingan Judul Skripsi') === initialScheduleName
    );

    if (matchingRules.length === 0) {
      // Default initial schedule for brand new item: Senin-Jumat 08:00 - 16:00
      [1, 2, 3, 4, 5].forEach((d) => {
        initial[d] = {
          enabled: true,
          slots: [{ startTime: '08:00', endTime: '16:00' }],
        };
      });
      setWeeklyHours(initial);
      setIsDefault(myAvailabilities.length === 0);
      setIsSaved(false);
    } else {
      const DAY_CODES_MAP: Record<string, number> = {
        minggu: 0, senin: 1, selasa: 2, rabu: 3, kamis: 4, jumat: 5, sabtu: 6,
      };

      matchingRules.forEach((ar) => {
        const slotsList = (ar.rules?.slots && Array.isArray(ar.rules.slots) && ar.rules.slots.length > 0)
          ? ar.rules.slots
          : [{ dayOfWeek: ar.dayOfWeek, startTime: ar.startTime, endTime: ar.endTime }];

        slotsList.forEach((slotItem: any) => {
          let day = 1;
          if (slotItem.dayOfWeek !== undefined && slotItem.dayOfWeek !== null && !isNaN(Number(slotItem.dayOfWeek))) {
            day = Number(slotItem.dayOfWeek);
          } else if (typeof slotItem.day === 'string' && DAY_CODES_MAP[slotItem.day.toLowerCase()] !== undefined) {
            day = DAY_CODES_MAP[slotItem.day.toLowerCase()];
          }

          if (day >= 0 && day <= 6) {
            initial[day].enabled = true;
            const exists = initial[day].slots.some(
              (s) => s.startTime === slotItem.startTime && s.endTime === slotItem.endTime
            );
            if (!exists) {
              initial[day].slots.push({
                startTime: slotItem.startTime,
                endTime: slotItem.endTime,
              });
            }
          }
        });
        if (ar.isDefault) defaultFound = true;
      });

      setWeeklyHours(initial);
      setIsDefault(defaultFound);
      setIsSaved(true);
    }
  }, [initialScheduleName, myAvailabilities]);

  // Toggle Day Enable/Disable (Local state update)
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
              : [{ startTime: '08:00', endTime: '16:00' }]
            : current.slots,
        },
      };
    });
  };

  // Add extra slot interval for a day (Local state update)
  const handleAddSlot = (day: number) => {
    setWeeklyHours((prev) => {
      const current = prev[day];
      const lastSlot = current.slots[current.slots.length - 1];
      const newStart = lastSlot ? lastSlot.endTime : '08:00';
      const startIndex = TIME_OPTIONS.indexOf(newStart);
      const endIndex =
        startIndex >= 0 && startIndex + 2 < TIME_OPTIONS.length
          ? startIndex + 2
          : TIME_OPTIONS.length - 1;
      const newEnd = TIME_OPTIONS[endIndex] || '09:00';

      return {
        ...prev,
        [day]: {
          enabled: true,
          slots: [...current.slots, { startTime: newStart, endTime: newEnd }],
        },
      };
    });
  };

  // Remove a slot interval (Local state update)
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

  // Update slot times (Local state update)
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

  // Save all weekly hours into 1 single AvailabilityRule per Schedule Card when SAVE button is clicked
  const handleSave = () => {
    const DAY_NAMES_MAP: Record<number, string> = {
      0: 'Minggu',
      1: 'Senin',
      2: 'Selasa',
      3: 'Rabu',
      4: 'Kamis',
      5: 'Jumat',
      6: 'Sabtu',
    };

    const allSlots: { day: string; dayOfWeek: number; startTime: string; endTime: string }[] = [];

    Object.entries(weeklyHours).forEach(([dayStr, daySched]) => {
      const day = Number(dayStr);
      if (daySched.enabled && daySched.slots.length > 0) {
        const sortedSlots = [...daySched.slots].sort((a, b) =>
          a.startTime.localeCompare(b.startTime)
        );
        sortedSlots.forEach((slot) => {
          allSlots.push({
            day: DAY_NAMES_MAP[day] || 'Senin',
            dayOfWeek: day,
            startTime: slot.startTime,
            endTime: slot.endTime,
          });
        });
      }
    });

    const firstSlot = allSlots[0] || { day: 'Senin', dayOfWeek: 1, startTime: '08:00', endTime: '16:00' };

    const singleScheduleRule: AvailabilityRule = {
      id: `ar-${Date.now()}`,
      lecturerId: 'user-lecturer-1',
      dayOfWeek: firstSlot.dayOfWeek,
      startTime: firstSlot.startTime,
      endTime: firstSlot.endTime,
      isDefault: isDefault,
      name: scheduleName,
      rules: {
        sessionName: scheduleName,
        maxQuotaPerSession: Number(maxQuotaPerSession || 1),
        maxQuotaTotal: 20,
        sessionDurationMinutes: 30,
        slots: allSlots,
      },
    };

    setIsSaved(true);
    onSaveSchedule([singleScheduleRule], scheduleName, isDefault);
    toast.success(`Jadwal ketersediaan "${scheduleName}" berhasil disimpan!`);
  };

  // Reset & Reconfigure Schedule
  const handleResetSchedule = () => {
    if (
      confirm(
        'Apakah Anda ingin mengatur ulang jadwal ketersediaan? Semua hari akan dikembalikan ke status kosong.'
      )
    ) {
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

  return (
    <div className="space-y-6 font-sans max-w-6xl mx-auto text-emerald-950 dark:text-white animate-in fade-in duration-300">
      {/* HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-emerald-50/70 dark:bg-zinc-900 border border-emerald-100/90 dark:border-zinc-800 p-4 sm:px-6 rounded-3xl shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl bg-white dark:bg-zinc-800 hover:bg-emerald-100/80 dark:hover:bg-emerald-950/40 text-emerald-900 dark:text-zinc-300 transition-all cursor-pointer border border-emerald-200/60 dark:border-zinc-700 flex items-center gap-1.5"
            title="Kembali ke Daftar Jadwal"
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
              <button
                type="button"
                onClick={() => {
                  setTempName(scheduleName);
                  setIsEditingName(true);
                }}
                className="p-1 text-emerald-600/70 hover:text-emerald-800 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ml-1"
                title="Edit Nama Jadwal"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Top Right Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
          {/* Max Quota Per Session Selector */}
          <div className="flex items-center gap-2 bg-white dark:bg-zinc-800 border border-emerald-200/80 dark:border-zinc-700 px-3 py-1 rounded-xl shadow-2xs">
            <Users className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="text-xs font-semibold text-emerald-900 dark:text-zinc-300">
              Batas Kuota:
            </span>
            <select
              value={maxQuotaPerSession}
              onChange={(e) => setMaxQuotaPerSession(Number(e.target.value))}
              className="bg-transparent text-xs font-bold text-emerald-900 dark:text-white focus:outline-none cursor-pointer"
            >
              <option value={1}>1 Org / Sesi</option>
              <option value={2}>2 Org / Sesi</option>
              <option value={3}>3 Org / Sesi</option>
              <option value={4}>4 Org / Sesi</option>
              <option value={5}>5 Org / Sesi</option>
              <option value={10}>10 Org / Sesi</option>
              <option value={15}>15 Org / Sesi</option>
              <option value={20}>20 Org / Sesi</option>
            </select>
          </div>

          {/* Set as default toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-900 dark:text-zinc-300">
              Set as default
            </span>
            <button
              type="button"
              onClick={() => setIsDefault(!isDefault)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${isDefault ? 'bg-emerald-600' : 'bg-emerald-200/80 dark:bg-zinc-700'
                }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${isDefault ? 'translate-x-4' : 'translate-x-0'
                  }`}
              />
            </button>
          </div>

          {/* Save & Set Default Button */}
          <button
            type="button"
            onClick={() => {
              handleSave();
              onBack();
            }}
            className="py-1.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
            title="Simpan Jadwal & Kembali ke Daftar Utama"
          >
            <Check className="w-4 h-4" />
            <span>Save</span>
          </button>

          {/* Delete Schedule Button */}
          <button
            type="button"
            onClick={() => onDeleteSchedule(scheduleName)}
            className="p-2 text-emerald-700/60 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all cursor-pointer"
            title="Delete Schedule"
          >
            <Trash2 className="w-4 h-4" />
          </button>
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
                    <span>Ditetapkan & Aktif 🟢</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    Mode Pengeditan ✏️
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
                onClick={handleSave}
                className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            )}
          </div>

          {/* 1. STATE A: IS SAVED = TRUE (Summary View) */}
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
                        className={`w-2.5 h-2.5 rounded-full ${isEnabled ? 'bg-emerald-500 shadow-2xs shadow-emerald-400' : 'bg-gray-300 dark:bg-zinc-700'
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
            /* 2. STATE B: IS SAVED = FALSE (Interactive Form Builder) */
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
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${daySched.enabled ? 'bg-emerald-600' : 'bg-emerald-200/80 dark:bg-zinc-700'
                          }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${daySched.enabled ? 'translate-x-4' : 'translate-x-0'
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
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: SIDEBAR CONTROLS */}
        <div className="lg:col-span-4 space-y-6">
          {/* TROUBLESHOOTER & ATUR ULANG CARD */}
          <div className="bg-emerald-50/70 dark:bg-zinc-900 border border-emerald-100/90 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-emerald-950 dark:text-white">
              Berhalangan Hadir / Ubah Jadwal?
            </h4>
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
    </div>
  );
}
