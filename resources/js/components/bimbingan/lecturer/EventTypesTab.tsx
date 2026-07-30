// components/bimbingan/lecturer/EventTypesTab.tsx
import { useState } from 'react';
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
    locationDetails?: string
  ) => void;
  handleUpdateEventType: (id: string, updatedEt: Partial<EventType>) => void;
  handleDeleteEventType: (id: string) => void;
}

const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

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
  const [etDescription, setEtDescription] = useState('');
  const [etAvailabilityId, setEtAvailabilityId] = useState<string>('');
  const [etLocationType, setEtLocationType] = useState<'offline' | 'online'>('offline');
  const [etLocationDetails, setEtLocationDetails] = useState('');

  // Modal Edit State
  const [editingEt, setEditingEt] = useState<EventType | null>(null);
  const [editEtName, setEditEtName] = useState('');
  const [editEtDuration, setEditEtDuration] = useState<number>(30);
  const [editEtDescription, setEditEtDescription] = useState('');
  const [editEtAvailabilityId, setEditEtAvailabilityId] = useState<string>('');
  const [editEtLocationType, setEditEtLocationType] = useState<'offline' | 'online'>('offline');
  const [editEtLocationDetails, setEditEtLocationDetails] = useState('');

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedAvail = myAvailabilities.find((a) => String(a.id) === String(etAvailabilityId) || String(a.availabilityId) === String(etAvailabilityId));
    const duration = selectedAvail?.rules?.sessionDurationMinutes || 30;

    const defaultLocation =
      etLocationType === 'online'
        ? 'Google Meet UMSU'
        : 'Ruang Dosen Gedung A / Ruang Prodi UMSU';

    handleAddEventType(
      etName.trim(),
      Number(duration),
      etDescription.trim(),
      etAvailabilityId || undefined,
      etLocationType,
      etLocationDetails.trim() || defaultLocation
    );

    setEtName('');
    setEtDescription('');
    setEtAvailabilityId('');
    setEtLocationType('offline');
    setEtLocationDetails('');
  };

  const openEditModal = (et: EventType) => {
    setEditingEt(et);
    setEditEtName(et.name);
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
    const selectedAvail = myAvailabilities.find((a) => String(a.id) === String(editEtAvailabilityId) || String(a.availabilityId) === String(editEtAvailabilityId));
    const duration = selectedAvail?.rules?.sessionDurationMinutes || editingEt.duration || 30;

    handleUpdateEventType(editingEt.id, {
      name: editEtName.trim(),
      duration: Number(duration),
      description: editEtDescription.trim(),
      availabilityId: editEtAvailabilityId || undefined,
      locationType: editEtLocationType,
      locationDetails: editEtLocationDetails.trim(),
    });

    setEditingEt(null);
  };

  const defaultAvail = myAvailabilities.find((a) => a.isDefault);

  const getLinkedAvailabilityLabel = (availId?: string) => {
    const targetId = availId || defaultAvail?.id || defaultAvail?.availabilityId;
    if (!targetId) return 'Jadwal Utama Dosen';

    const found = myAvailabilities.find((a) => String(a.id) === String(targetId) || String(a.availabilityId) === String(targetId));
    if (!found) return 'Jadwal Utama Dosen';

    const dayName = DAY_NAMES[found.dayOfWeek] || 'Hari';
    const ruleName = found.name || found.rules?.sessionName || `Jadwal ${dayName}`;
    const durInfo = found.rules?.sessionDurationMinutes ? ` • Durasi: ${found.rules.sessionDurationMinutes} Menit` : '';
    return `${ruleName} (${dayName}: ${found.startTime} - ${found.endTime} WIB${durInfo})`;
  };

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
          </div>

          {/* RELATED AVAILABILITY SELECTOR */}
          <div className="space-y-1 md:col-span-2">
            <label className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Pilih Jadwal Ketersediaan</span>
            </label>
            <select
              value={etAvailabilityId}
              onChange={(e) => {
                const selectedId = e.target.value;
                setEtAvailabilityId(selectedId);
                if (selectedId) {
                  const selectedAvail = myAvailabilities.find((a) => String(a.id) === String(selectedId) || String(a.availabilityId) === String(selectedId));
                  if (selectedAvail?.rules?.sessionDurationMinutes) {
                    setEtDuration(selectedAvail.rules.sessionDurationMinutes);
                  }
                }
              }}
              className="w-full p-2.5 rounded-xl text-xs bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 text-emerald-950 dark:text-emerald-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              <option value="">
                {defaultAvail
                  ? `-- Gunakan Jadwal Utama (${DAY_NAMES[defaultAvail.dayOfWeek]}: ${defaultAvail.startTime} - ${defaultAvail.endTime} WIB) --`
                  : '-- Gunakan Jadwal Utama (Default) --'}
              </option>
              {myAvailabilities
                .filter((a) => !a.isDefault)
                .map((a) => {
                  const dayName = DAY_NAMES[a.dayOfWeek] || 'Hari';
                  const ruleName = a.name || a.rules?.sessionName || `Jadwal ${dayName}`;
                  const durText = a.rules?.sessionDurationMinutes ? ` • Durasi: ${a.rules.sessionDurationMinutes} Min` : '';
                  return (
                    <option key={a.id} value={a.id}>
                      {ruleName} ({dayName}: {a.startTime} - {a.endTime} WIB{durText})
                    </option>
                  );
                })}
            </select>
            <p className="text-[10px] text-muted-foreground mt-1">
              Pilih jadwal ketersediaan khusus jika bimbingan ini hanya dibuka pada hari & jam tertentu.
            </p>
            {(() => {
              const activeAvail = etAvailabilityId
                ? myAvailabilities.find((a) => String(a.id) === String(etAvailabilityId) || String(a.availabilityId) === String(etAvailabilityId))
                : defaultAvail;
              if (activeAvail?.rules?.sessionDurationMinutes) {
                return (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 mt-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold border border-emerald-200 dark:border-emerald-900/50">
                    <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Jadwal Terpasang: <strong>{DAY_NAMES[activeAvail.dayOfWeek]}, {activeAvail.startTime} - {activeAvail.endTime} WIB</strong> ({activeAvail.rules.sessionDurationMinutes} Menit / Sesi)</span>
                  </div>
                );
              }
              return null;
            })()}
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
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
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
                <Video className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
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
              Deskripsi / Petunjuk untuk Mahasiswa
            </label>
            <textarea
              rows={2}
              value={etDescription}
              onChange={(e) => setEtDescription(e.target.value)}
              placeholder="Penjelasan ringkas mengenai persiapan berkas atau topik bimbingan..."
              className="w-full p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="py-2.5 px-6 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-xs hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Simpan Jenis Bimbingan</span>
          </button>
        </div>
      </form>

      {/* List Event Types */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-base text-gray-900 dark:text-white">
              Daftar Jenis Bimbingan ({myEventTypes.length})
            </h3>
          </div>
        </div>

        {myEventTypes.length === 0 ? (
          <div className="bg-gray-50 dark:bg-zinc-900/50 border border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl p-8 text-center text-xs text-muted-foreground">
            Belum ada jenis bimbingan yang dikonfigurasi. Tambahkan jenis bimbingan baru di atas.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myEventTypes.map((et) => {
              const linkedLabel = getLinkedAvailabilityLabel(et.availabilityId);
              return (
                <div
                  key={et.id}
                  className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 space-y-3 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-800 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <span>{et.name}</span>
                        </h4>
                        {et.slug && (
                          <a
                            href={`/bimbingan/${et.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline transition-all group"
                            title="Klik untuk membuka halaman booking di tab baru"
                          >
                            <Globe className="w-3.5 h-3.5 text-emerald-500 group-hover:scale-110 transition-transform" />
                            <span>/bimbingan/{et.slug}</span>
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
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Pilih Jadwal Ketersediaan</span>
                </label>
                <select
                  value={editEtAvailabilityId}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    setEditEtAvailabilityId(selectedId);
                    if (selectedId) {
                      const selectedAvail = myAvailabilities.find((a) => String(a.id) === String(selectedId) || String(a.availabilityId) === String(selectedId));
                      if (selectedAvail?.rules?.sessionDurationMinutes) {
                        setEditEtDuration(selectedAvail.rules.sessionDurationMinutes);
                      }
                    }
                  }}
                  className="w-full p-2.5 rounded-xl text-xs bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 text-emerald-950 dark:text-emerald-200 font-medium"
                >
                  <option value="">
                    {defaultAvail
                      ? `-- Gunakan Jadwal Utama (${DAY_NAMES[defaultAvail.dayOfWeek]}: ${defaultAvail.startTime} - ${defaultAvail.endTime} WIB) --`
                      : '-- Gunakan Jadwal Utama (Default) --'}
                  </option>
                  {myAvailabilities
                    .filter((a) => !a.isDefault)
                    .map((a) => {
                      const dayName = DAY_NAMES[a.dayOfWeek] || 'Hari';
                      const ruleName = a.name || a.rules?.sessionName || `Jadwal ${dayName}`;
                      const durText = a.rules?.sessionDurationMinutes ? ` • Durasi: ${a.rules.sessionDurationMinutes} Min` : '';
                      return (
                        <option key={a.id} value={a.id}>
                          {ruleName} ({dayName}: {a.startTime} - {a.endTime} WIB{durText})
                        </option>
                      );
                    })}
                </select>
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
