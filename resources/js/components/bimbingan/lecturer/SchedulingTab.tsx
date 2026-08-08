// components/bimbingan/lecturer/SchedulingTab.tsx
import { useState, useMemo } from 'react';
import { Plus, MoreHorizontal, Globe, Trash2, Edit3, Clock, Calendar } from 'lucide-react';
import type { AvailabilityRule, AvailabilityRuleConfig } from '@/types';
import { toast } from 'sonner';
import ScheduleDetailEditor from './EditorScheduleDetail';

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
  handleDeleteAvailability: (id: string | string[]) => void;
}

const DAY_ABBR = ['Ming', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export default function SchedulingTab({
  myAvailabilities,
  handleAddAvailability,
  handleSetAllAvailabilities,
  handleUpdateAvailability,
  handleToggleDefaultAvailability,
  handleDeleteAvailability,
}: SchedulingTabProps) {
  // Navigation View state: 'list' (Daftar Jadwal) or 'editor' (Form Pengeditan Jam Detail)
  const [activeView, setActiveView] = useState<'list' | 'editor'>('list');
  const [selectedScheduleName, setSelectedScheduleName] = useState<string>('Bimbingan Judul Skripsi');

  // Menu popup state
  const [openMenuName, setOpenMenuName] = useState<string | null>(null);

  // Modal states for new schedule
  const [showAddModal, setShowAddModal] = useState(false);
  const [newScheduleName, setNewScheduleName] = useState('');

  // Group availabilities by schedule name for List View
  const groupedSchedules = useMemo(() => {
    if (!myAvailabilities || myAvailabilities.length === 0) {
      return [];
    }

    const map = new Map<
      string,
      {
        name: string;
        isDefault: boolean;
        rules: AvailabilityRule[];
        timezone: string;
      }
    >();

    myAvailabilities.forEach((ar) => {
      const name = ar.name?.trim() || ar.rules?.sessionName?.trim() || 'Bimbingan Judul Skripsi';
      if (!map.has(name)) {
        map.set(name, {
          name,
          isDefault: ar.isDefault ?? false,
          rules: [],
          timezone: 'Asia/Jakarta',
        });
      }
      const item = map.get(name)!;
      item.rules.push(ar);
      if (ar.isDefault) item.isDefault = true;
    });

    const result: {
      name: string;
      isDefault: boolean;
      summary: string;
      timezone: string;
      rules: AvailabilityRule[];
    }[] = [];

    map.forEach((item) => {
      const daysMap = new Map<number, { startTime: string; endTime: string }[]>();
      const DAY_CODES_MAP: Record<string, number> = {
        minggu: 0, senin: 1, selasa: 2, rabu: 3, kamis: 4, jumat: 5, sabtu: 6,
      };

      item.rules.forEach((r) => {
        const slotsList = (r.rules?.slots && r.rules.slots.length > 0)
          ? r.rules.slots
          : [{ dayOfWeek: r.dayOfWeek, startTime: r.startTime, endTime: r.endTime }];

        slotsList.forEach((s: any) => {
          let d = 1;
          if (s.dayOfWeek !== undefined && s.dayOfWeek !== null && !isNaN(Number(s.dayOfWeek))) {
            d = Number(s.dayOfWeek);
          } else if (typeof s.day === 'string' && DAY_CODES_MAP[s.day.toLowerCase()] !== undefined) {
            d = DAY_CODES_MAP[s.day.toLowerCase()];
          }
          if (!daysMap.has(d)) daysMap.set(d, []);
          daysMap.get(d)!.push({ startTime: s.startTime, endTime: s.endTime });
        });
      });

      const activeDays: number[] = [];
      const daySlotsStrings: string[] = [];

      [1, 2, 3, 4, 5, 6, 0].forEach((d) => {
        if (daysMap.has(d)) {
          activeDays.push(d);
          const slots = daysMap.get(d)!;
          if (slots.length > 0) {
            const sortedSlots = [...slots].sort((a, b) => a.startTime.localeCompare(b.startTime));
            const slotStr = sortedSlots.map((s) => `${s.startTime} - ${s.endTime}`).join(', ');
            if (!daySlotsStrings.includes(slotStr)) {
              daySlotsStrings.push(slotStr);
            }
          }
        }
      });

      let daysSummary = '';
      if (activeDays.length > 0) {
        daysSummary = activeDays.map((d) => DAY_ABBR[d]).join(', ');
      } else {
        daysSummary = 'Belum ada hari diatur';
      }

      const timeRangeStr = daySlotsStrings.length > 0 ? `${daySlotsStrings.join('; ')} WIB` : '09:00 - 17:00 WIB';

      result.push({
        name: item.name,
        isDefault: item.isDefault,
        summary: `${daysSummary}, ${timeRangeStr}`,
        timezone: item.timezone,
        rules: item.rules,
      });
    });

    return result;
  }, [myAvailabilities]);

  // Open Editor View for a specific schedule
  const handleOpenEditorForSchedule = (targetName: string) => {
    setSelectedScheduleName(targetName);
    setOpenMenuName(null);
    setActiveView('editor');
  };

  // Save Schedule from ScheduleDetailEditor
  const handleSaveScheduleFromEditor = (
    newRulesList: AvailabilityRule[],
    updatedName: string,
    isDefault: boolean
  ) => {
    const finalNewRules = newRulesList.map((r) => ({
      ...r,
      name: updatedName,
      isDefault: isDefault,
    }));

    if (handleSetAllAvailabilities) {
      const updatedExisting = isDefault
        ? myAvailabilities.map((ar) => ({ ...ar, isDefault: false }))
        : myAvailabilities;
      const otherRules = updatedExisting.filter(
        (ar) => (ar.name?.trim() || ar.rules?.sessionName?.trim() || 'Bimbingan Judul Skripsi') !== selectedScheduleName
      );
      handleSetAllAvailabilities([...otherRules, ...finalNewRules]);
    } else {
      const idsToDelete = myAvailabilities
        .filter((ar) => (ar.name?.trim() || ar.rules?.sessionName?.trim() || 'Bimbingan Judul Skripsi') === selectedScheduleName)
        .map((ar) => ar.id);

      if (idsToDelete.length > 0) {
        handleDeleteAvailability(idsToDelete);
      }

      if (isDefault) {
        myAvailabilities.forEach((ar) => {
          if (ar.isDefault && handleUpdateAvailability) {
            handleUpdateAvailability(ar.id, { isDefault: false });
          }
        });
      }

      finalNewRules.forEach((r) =>
        handleAddAvailability(r.dayOfWeek, r.startTime, r.endTime, isDefault, r.rules)
      );
    }

    toast.success(`Jadwal ketersediaan "${updatedName}" berhasil disimpan!`);
  };

  // Create new schedule from modal
  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newScheduleName.trim();
    if (!name) return;

    setSelectedScheduleName(name);
    setShowAddModal(false);
    setNewScheduleName('');
    setActiveView('editor');
    toast.success(`Jadwal "${name}" berhasil dibuat. Silakan atur jam ketersediaan.`);
  };

  // Delete Schedule
  const handleDeleteGroup = (targetName: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus seluruh jadwal ketersediaan "${targetName}"?`)) {
      const matching = myAvailabilities.filter(
        (ar) => (ar.name?.trim() || ar.rules?.sessionName?.trim() || 'Bimbingan Judul Skripsi') === targetName
      );
      const matchingIds = matching.map((ar) => ar.id);
      if (matchingIds.length > 0) {
        handleDeleteAvailability(matchingIds);
      }
      toast.success(`Jadwal "${targetName}" berhasil dihapus.`);
      setOpenMenuName(null);
      setActiveView('list');
    }
  };

  return (
    <div className="space-y-6 font-sans max-w-6xl mx-auto text-emerald-950 dark:text-white">
      {/* ════════════════════════════════════════════════════════════════════════ */}
      {/* 1. INITIAL LIST VIEW (activeView === 'list')                            */}
      {/* ════════════════════════════════════════════════════════════════════════ */}
      {activeView === 'list' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* TOP HEADER SECTION */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-emerald-950 dark:text-white">
                Ketersediaan Waktu
              </h1>
              <p className="text-sm text-emerald-800/70 dark:text-zinc-400 mt-0.5">
                Atur ketersediaan waktu bimbingan.
              </p>
            </div>
          </div>

          {/* SCHEDULE LIST CONTAINER */}
          {groupedSchedules.length > 0 ? (
            <div className="bg-emerald-950 dark:bg-zinc-900/90 text-white rounded-2xl border border-emerald-900 dark:border-zinc-800 shadow-md divide-y divide-emerald-900/80 dark:divide-zinc-800">
              {groupedSchedules.map((sched, idx) => (
                <div
                  key={idx}
                  className="p-5 sm:px-6 flex items-center justify-between gap-4 hover:bg-emerald-900/40 dark:hover:bg-zinc-800/50 transition-colors relative rounded-2xl"
                >
                  {/* Left Content */}
                  <div
                    className="space-y-1.5 cursor-pointer flex-1"
                    onClick={() => handleOpenEditorForSchedule(sched.name)}
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold tracking-tight text-white capitalize">
                        {sched.name}
                      </h3>
                      {sched.isDefault && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600/30 text-emerald-300 border border-emerald-500/40">
                          Default
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-emerald-200/80 dark:text-zinc-400 font-medium">
                      {sched.summary}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-emerald-300/80 dark:text-zinc-400 font-medium pt-0.5">
                      <Globe className="w-3.5 h-3.5" />
                      <span>{sched.timezone}</span>
                    </div>
                  </div>

                  {/* Right Action Menu (...) */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuName(openMenuName === sched.name ? null : sched.name);
                      }}
                      className="p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-emerald-900/60 dark:hover:bg-zinc-800 border border-emerald-800/50 dark:border-zinc-700/60 transition-all cursor-pointer"
                      title="Options"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {/* Popup Dropdown Menu */}
                    {openMenuName === sched.name && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#1C2C23] text-emerald-950 dark:text-white border border-emerald-200/90 dark:border-emerald-700/80 rounded-2xl shadow-2xl z-50 overflow-hidden py-1.5 animate-in fade-in zoom-in-95 duration-150">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditorForSchedule(sched.name);
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs font-extrabold text-emerald-900 dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-900/60 flex items-center gap-2.5 cursor-pointer transition-colors"
                        >
                          <Edit3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>Edit Schedule</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteGroup(sched.name);
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs font-extrabold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2.5 border-t border-emerald-100 dark:border-emerald-800/60 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
                          <span>Delete Schedule</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 border border-dashed border-emerald-200 dark:border-zinc-800 rounded-3xl p-8 md:p-12 text-center space-y-5 shadow-2xs">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-100 dark:border-emerald-900/50 shadow-inner">
                <Clock className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Belum Ada Jadwal Ketersediaan Waktu
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                  Anda belum membuat atau mengatur jadwal ketersediaan waktu bimbingan. Silakan tambahkan jadwal ketersediaan baru agar mahasiswa dapat memilih slot jam bimbingan.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Jadwal Ketersediaan</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════ */}
      {/* 2. EDITOR VIEW (ScheduleDetailEditor Component)                         */}
      {/* ════════════════════════════════════════════════════════════════════════ */}
      {activeView === 'editor' && (
        <ScheduleDetailEditor
          scheduleName={selectedScheduleName}
          myAvailabilities={myAvailabilities}
          onBack={() => setActiveView('list')}
          onSaveSchedule={handleSaveScheduleFromEditor}
          onDeleteSchedule={handleDeleteGroup}
        />
      )}

      {/* MODAL: ADD NEW SCHEDULE */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-emerald-950 dark:bg-zinc-900 border border-emerald-800 dark:border-zinc-800 text-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-emerald-900 dark:border-zinc-800 pb-3">
              <h3 className="text-lg font-bold tracking-tight text-white">Add a new schedule</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-900 dark:hover:bg-zinc-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSchedule} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-emerald-200 dark:text-zinc-300 block">
                  Name
                </label>
                <input
                  type="text"
                  value={newScheduleName}
                  onChange={(e) => setNewScheduleName(e.target.value)}
                  placeholder="e.g. Bimbingan Judul Skripsi"
                  required
                  className="w-full bg-emerald-900/60 dark:bg-zinc-800 border border-emerald-700 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-emerald-400/50 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-emerald-300 hover:text-white transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-white text-emerald-950 font-bold rounded-xl text-xs shadow-xs hover:bg-emerald-100 transition-all cursor-pointer"
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