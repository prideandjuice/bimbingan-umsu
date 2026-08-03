import { useState, useMemo } from 'react';
import { usePage } from '@inertiajs/react';
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Clock,
  Globe,
  Link as LinkIcon,
  BookOpen,
  ExternalLink,
  MapPin,
  Video,
  Users,
  Calendar,
} from 'lucide-react';
import type { AvailabilityRule, EventType } from '@/types';
import { toast } from 'sonner';

interface EventTypesTabProps {
  myEventTypes: EventType[];
  myAvailabilities?: AvailabilityRule[];
  handleAddEventType: (
    name: string,
    duration: number,
    description: string,
    availabilityId?: string,
    locationType?: 'offline' | 'online',
    locationDetails?: string,
    maxQuotaPerSession?: number
  ) => void;
  handleUpdateEventType: (id: string, updatedEt: Partial<EventType>) => void;
  handleDeleteEventType: (id: string) => void;
}

const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const DAY_ABBR = ['Ming', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
};

export default function EventTypesTab({
  myEventTypes,
  myAvailabilities = [],
  handleAddEventType,
  handleUpdateEventType,
  handleDeleteEventType,
}: EventTypesTabProps) {
  // Form State
  const [etName, setEtName] = useState('');
  const [etDuration, setEtDuration] = useState<number>(30);
  const [etMaxQuota, setEtMaxQuota] = useState<number>(5);
  const [etDescription, setEtDescription] = useState('');
  const [etAvailabilityId, setEtAvailabilityId] = useState<string>('');
  const [etLocationType, setEtLocationType] = useState<'offline' | 'online'>('offline');
  const [etLocationDetails, setEtLocationDetails] = useState('');

  // Modal Edit State
  const [editingEt, setEditingEt] = useState<EventType | null>(null);
  const [editEtName, setEditEtName] = useState('');
  const [editEtDuration, setEditEtDuration] = useState<number>(30);
  const [editEtMaxQuota, setEditEtMaxQuota] = useState<number>(5);
  const [editEtDescription, setEditEtDescription] = useState('');
  const [editEtAvailabilityId, setEditEtAvailabilityId] = useState<string>('');
  const [editEtLocationType, setEditEtLocationType] = useState<'offline' | 'online'>('offline');
  const [editEtLocationDetails, setEditEtLocationDetails] = useState('');

  // Real-time grouping of availabilities by schedule name matching Schedule Cards
  const groupedAvailabilities = useMemo(() => {
    if (!myAvailabilities || myAvailabilities.length === 0) {
      return [];
    }

    const map = new Map<
      string,
      {
        name: string;
        isDefault: boolean;
        rules: AvailabilityRule[];
      }
    >();

    myAvailabilities.forEach((ar) => {
      const name = ar.name?.trim() || ar.rules?.sessionName?.trim() || 'Bimbingan Judul Skripsi';
      if (!map.has(name)) {
        map.set(name, {
          name,
          isDefault: ar.isDefault ?? false,
          rules: [],
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
      rules: AvailabilityRule[];
    }[] = [];

    map.forEach((item) => {
      const daysMap = new Map<number, { startTime: string; endTime: string }[]>();
      item.rules.forEach((r) => {
        const slotsList = (r.rules?.slots && r.rules.slots.length > 0)
          ? r.rules.slots
          : [{ dayOfWeek: r.dayOfWeek, startTime: r.startTime, endTime: r.endTime }];

        slotsList.forEach((s: any) => {
          const d = Number(s.dayOfWeek);
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

      const timeRangeStr = daySlotsStrings.length > 0 ? `${daySlotsStrings.join('; ')} WIB` : '08:00 - 16:00 WIB';

      result.push({
        name: item.name,
        isDefault: item.isDefault,
        summary: `${daysSummary}, ${timeRangeStr}`,
        rules: item.rules,
      });
    });

    return result;
  }, [myAvailabilities]);

  const defaultGroup = useMemo(() => {
    return groupedAvailabilities.find((g) => g.isDefault) || groupedAvailabilities[0];
  }, [groupedAvailabilities]);

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const defaultLocation =
      etLocationType === 'online'
        ? 'Google Meet UMSU'
        : 'Ruang Dosen Gedung A / Ruang Prodi UMSU';

    handleAddEventType(
      etName.trim(),
      Number(etDuration || 30),
      etDescription.trim(),
      etAvailabilityId || undefined,
      etLocationType,
      etLocationDetails.trim() || defaultLocation,
      Number(etMaxQuota || 5)
    );

    setEtName('');
    setEtDescription('');
    setEtAvailabilityId('');
    setEtDuration(30);
    setEtMaxQuota(5);
    setEtLocationType('offline');
    setEtLocationDetails('');
  };

  const openEditModal = (et: EventType) => {
    setEditingEt(et);
    setEditEtName(et.name);
    setEditEtDuration(et.duration || 30);
    setEditEtMaxQuota(et.maxQuotaPerSession || 5);
    setEditEtDescription(et.description || '');
    setEditEtAvailabilityId(et.availabilityId || '');
    setEditEtLocationType(et.locationType || 'offline');
    setEditEtLocationDetails(et.locationDetails || '');
  };

  const handleSaveEdit = () => {
    if (!editingEt) return;
    if (!editEtName.trim()) {
      alert('Nama jenis bimbingan wajib diisi.');
      return;
    }

    handleUpdateEventType(editingEt.id, {
      name: editEtName.trim(),
      duration: Number(editEtDuration || 30),
      maxQuotaPerSession: Number(editEtMaxQuota || 5),
      description: editEtDescription.trim(),
      availabilityId: editEtAvailabilityId || undefined,
      locationType: editEtLocationType,
      locationDetails: editEtLocationDetails.trim(),
    });

    setEditingEt(null);
  };

  const getLinkedAvailabilityLabel = (availId?: string) => {
    if (!availId) {
      return defaultGroup ? `${defaultGroup.name} (${defaultGroup.summary})` : 'Jadwal Utama Dosen';
    }

    const foundGroup = groupedAvailabilities.find((g) => g.name === availId);
    if (foundGroup) {
      return `${foundGroup.name} (${foundGroup.summary})`;
    }

    const foundRule = myAvailabilities.find((a) => String(a.id) === String(availId));
    if (foundRule) {
      const name = foundRule.name || foundRule.rules?.sessionName || 'Jadwal Bimbingan';
      return name;
    }

    return 'Jadwal Utama Dosen';
  };

  const { props } = usePage<{ auth?: { user?: { name?: string; email?: string } } }>();
  const userSlug = generateSlug(props.auth?.user?.name || 'lecturer');

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto" id="event-types-tab-container">
      {/* Header Banner */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-2">
          <Layers className="w-3.5 h-3.5" />
          <span>Pengaturan Jenis Bimbingan</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          Jenis Bimbingan & Penjadwalan
        </h2>
        <p className="text-xs md:text-sm text-muted-foreground mt-1">
          Atur jenis bimbingan yang dapat dibooking oleh mahasiswa beserta pilihan jadwal ketersediaannya.
        </p>
      </div>

      {/* Form Tambah Event Type */}
      <form
        onSubmit={onSubmitForm}
        className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
          <p className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-emerald-600" />
            <span>Tambah Jenis Bimbingan Baru</span>
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">
                Nama Jenis Bimbingan *
              </label>
              <input
                type="text"
                required
                value={etName}
                onChange={(e) => setEtName(e.target.value)}
                placeholder="Contoh: Konsultasi Bimbingan Proposal"
                className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
              />
              {etName.trim() && (
                <p className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 mt-1 flex items-center gap-1 truncate">
                  <Globe className="w-3 h-3 shrink-0" />
                  <span>Slug Real-time: <strong>/{userSlug}/{generateSlug(etName)}</strong></span>
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Durasi Sesi Bimbingan *</span>
              </label>
              <select
                value={etDuration}
                onChange={(e) => setEtDuration(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl text-xs bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 text-emerald-950 dark:text-emerald-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-semibold"
              >
                <option value={15}>15 Menit / Sesi</option>
                <option value={30}>30 Menit / Sesi</option>
                <option value={45}>45 Menit / Sesi</option>
                <option value={60}>60 Menit / Sesi</option>
                <option value={90}>90 Menit / Sesi</option>
                <option value={120}>120 Menit / Sesi</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                <span>Batas Kuota Mhs / Sesi *</span>
              </label>
              <select
                value={etMaxQuota}
                onChange={(e) => setEtMaxQuota(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl text-xs bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 text-emerald-950 dark:text-emerald-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-semibold"
              >
                <option value={1}>1 Orang / Sesi</option>
                <option value={2}>2 Orang / Sesi</option>
                <option value={3}>3 Orang / Sesi</option>
                <option value={4}>4 Orang / Sesi</option>
                <option value={5}>5 Orang / Sesi</option>
                <option value={10}>10 Orang / Sesi</option>
                <option value={15}>15 Orang / Sesi</option>
                <option value={20}>20 Orang / Sesi</option>
              </select>
            </div>
          </div>

          {/* AUTOMATIC DEFAULT SCHEDULE BADGE */}
          <div className="space-y-1 md:col-span-2">
            <label className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Jadwal Ketersediaan Terpasang (Otomatis Default)</span>
            </label>
            <div className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 text-xs font-medium border border-emerald-200/80 dark:border-emerald-900/50 w-full">

              <span>
                <strong>{defaultGroup ? defaultGroup.name : 'Jadwal Utama Default'}</strong> {defaultGroup?.summary ? `(${defaultGroup.summary})` : ''}
              </span>
            </div>
          </div>

          {/* LOKASI PERTEMUAN FIELD */}
          <div className="space-y-2 md:col-span-2 bg-gray-50/60 dark:bg-zinc-800/40 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800">
            <label className="text-[11px] font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Tempat Pertemuan / Lokasi Bimbingan</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setEtLocationType('offline')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${etLocationType === 'offline'
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-200 shadow-2xs font-bold'
                  : 'bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400 hover:border-emerald-300'
                  }`}
              >

                <span>📍 Tatap Muka (Offline)</span>
              </button>

              <button
                type="button"
                onClick={() => setEtLocationType('online')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${etLocationType === 'online'
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-200 shadow-2xs font-bold'
                  : 'bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400 hover:border-emerald-300'
                  }`}
              >

                <span>📹 Online (Google Meet)</span>
              </button>
            </div>

            <div className="pt-1">
              <input
                type="text"
                value={etLocationDetails}
                onChange={(e) => setEtLocationDetails(e.target.value)}
                placeholder={
                  etLocationType === 'online'
                    ? 'Contoh: Google Meet UMSU (Link dikirim otomatis di WhatsApp/Email)'
                    : 'Contoh: Ruang Dosen Gedung A / Ruang Prodi UMSU'
                }
                className="w-full p-2.5 rounded-xl text-xs bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">
              Deskripsi / Petunjuk untuk Mahasiswa (Opsional)
            </label>
            <textarea
              rows={2}
              value={etDescription}
              onChange={(e) => setEtDescription(e.target.value)}
              placeholder="Contoh: Silakan mendaftar 1 hari sebelum bimbingan dan membawa draf bab 1 yang sudah diprint."
              className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium resize-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Simpan Jenis Bimbingan</span>
          </button>
        </div>
      </form>

      {/* List Existing Event Types */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span>Daftar Jenis Bimbingan Aktif</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono">
            {myEventTypes.length}
          </span>
        </h3>

        {myEventTypes.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 border border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl p-8 text-center space-y-3">
            <Calendar className="w-10 h-10 text-emerald-500 mx-auto opacity-40" />
            <p className="text-xs text-muted-foreground">
              Belum ada jenis bimbingan yang dibuat. Silakan tambahkan pada form di atas.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {myEventTypes.map((et) => {
              const linkedLabel = getLinkedAvailabilityLabel(et.availabilityId);

              return (
                <div
                  key={et.id}
                  className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-all space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <span>{et.name}</span>
                        </h4>
                        {et.slug && (
                          <a
                            href={`/${userSlug}/${et.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline transition-all group"
                            title="Klik untuk membuka halaman booking di tab baru"
                          >
                            <Globe className="w-3.5 h-3.5 text-emerald-500 group-hover:scale-110 transition-transform" />
                            <span>/{userSlug}/{et.slug}</span>
                            <ExternalLink className="w-3 h-3 text-emerald-500 opacity-70 group-hover:opacity-100 ml-0.5" />
                          </a>
                        )}
                      </div>
                      <span className="shrink-0 px-2.5 py-1 rounded-xl text-xs font-bold font-mono bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-600" />
                        {et.duration} Min
                      </span>
                    </div>

                    {et.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {et.description}
                      </p>
                    )}
                  </div>

                  {/* Linked Availability Badge */}
                  <div className="pt-2 border-t border-gray-100 dark:border-zinc-800/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/30 px-2.5 py-1 rounded-xl border border-emerald-100 dark:border-emerald-900/40 truncate">
                      <LinkIcon className="w-3 h-3 shrink-0" />
                      <span className="truncate">{linkedLabel}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => openEditModal(et)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all cursor-pointer"
                        title="Edit Jenis Bimbingan"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          handleDeleteEventType(et.id);
                          toast.success('Jenis bimbingan berhasil dihapus.');
                        }}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer"
                        title="Hapus Jenis Bimbingan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL: Edit Event Type */}
      {editingEt && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-gray-900 dark:text-white">
                  Edit Jenis Bimbingan
                </h3>
              </div>
              <button
                onClick={() => setEditingEt(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">
                    Nama Jenis Bimbingan *
                  </label>
                  <input
                    type="text"
                    value={editEtName}
                    onChange={(e) => setEditEtName(e.target.value)}
                    className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 font-medium"
                  />
                  {editEtName.trim() && (
                    <p className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 mt-1 flex items-center gap-1 truncate">
                      <Globe className="w-3 h-3 shrink-0" />
                      <span>Slug: <strong>/bimbingan/{generateSlug(editEtName)}</strong></span>
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Durasi Sesi Bimbingan *</span>
                  </label>
                  <select
                    value={editEtDuration}
                    onChange={(e) => setEditEtDuration(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl text-xs bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 text-emerald-950 dark:text-emerald-200 font-bold"
                  >
                    <option value={15}>15 Menit / Sesi</option>
                    <option value={30}>30 Menit / Sesi</option>
                    <option value={45}>45 Menit / Sesi</option>
                    <option value={60}>60 Menit (1 Jam) / Sesi</option>
                    <option value={90}>90 Menit (1.5 Jam) / Sesi</option>
                    <option value={120}>120 Menit (2 Jam) / Sesi</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Batas Kuota Mhs / Sesi *</span>
                  </label>
                  <select
                    value={editEtMaxQuota}
                    onChange={(e) => setEditEtMaxQuota(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl text-xs bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 text-emerald-950 dark:text-emerald-200 font-bold"
                  >
                    <option value={1}>1 Orang / Sesi</option>
                    <option value={2}>2 Orang / Sesi</option>
                    <option value={3}>3 Orang / Sesi</option>
                    <option value={4}>4 Orang / Sesi</option>
                    <option value={5}>5 Orang / Sesi</option>
                    <option value={10}>10 Orang / Sesi</option>
                    <option value={15}>15 Orang / Sesi</option>
                    <option value={20}>20 Orang / Sesi</option>
                  </select>
                </div>
              </div>

              {/* AUTOMATIC DEFAULT SCHEDULE BADGE EDIT */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Jadwal Ketersediaan Terpasang (Otomatis Default)</span>
                </label>
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 text-xs font-medium border border-emerald-200/80 dark:border-emerald-900/50 w-full">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Jadwal Terpasang: <strong>{defaultGroup ? defaultGroup.name : 'Jadwal Utama Default'}</strong> {defaultGroup?.summary ? `(${defaultGroup.summary})` : ''}
                  </span>
                </div>
              </div>

              {/* LOKASI PERTEMUAN EDIT FIELD */}
              <div className="space-y-2 bg-gray-50/60 dark:bg-zinc-800/40 p-3 rounded-2xl border border-gray-100 dark:border-zinc-800">
                <label className="text-[11px] font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tempat Pertemuan / Lokasi Bimbingan</span>
                </label>

                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setEditEtLocationType('offline')}
                    className={`p-2 rounded-xl border text-[11px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${editEtLocationType === 'offline'
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold'
                      : 'bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400'
                      }`}
                  >
                    <span>📍 Tatap Muka</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditEtLocationType('online')}
                    className={`p-2 rounded-xl border text-[11px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${editEtLocationType === 'online'
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold'
                      : 'bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400'
                      }`}
                  >
                    <span>📹 Online</span>
                  </button>
                </div>

                <input
                  type="text"
                  value={editEtLocationDetails}
                  onChange={(e) => setEditEtLocationDetails(e.target.value)}
                  placeholder={
                    editEtLocationType === 'online'
                      ? 'Contoh: Google Meet UMSU (Link dikirim otomatis di WhatsApp/Email)'
                      : 'Contoh: Ruang Dosen Gedung A / Ruang Prodi UMSU'
                  }
                  className="w-full p-2.5 rounded-xl text-xs bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">
                  Deskripsi / Petunjuk untuk Mahasiswa
                </label>
                <textarea
                  rows={3}
                  value={editEtDescription}
                  onChange={(e) => setEditEtDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 font-medium resize-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setEditingEt(null)}
                className="w-1/2 py-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 text-xs font-bold transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
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
