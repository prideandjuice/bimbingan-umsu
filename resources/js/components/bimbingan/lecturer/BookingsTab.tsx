// components/bimbingan/lecturer/BookingsTab.tsx
import { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Check,
  X,
  MessageSquare,
  FileText,
} from 'lucide-react';
import type { Booking } from '@/types';

interface BookingsTabProps {
  myBookings: Booking[];
  handleProcessBookingSubmit: (bookingId: string, type: 'confirm' | 'reject', note: string) => void;
  handleCompleteBooking: (id: string) => void;
}

export default function BookingsTab({
  myBookings,
  handleProcessBookingSubmit,
  handleCompleteBooking,
}: BookingsTabProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'confirmed' | 'rejected' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State for Confirm / Reject Action
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [actionType, setActionType] = useState<'confirm' | 'reject' | null>(null);
  const [noteInput, setNoteInput] = useState('');

  // Counts
  const pendingCount = myBookings.filter((b) => b.status === 'pending').length;
  const confirmedCount = myBookings.filter((b) => b.status === 'confirmed').length;
  const rejectedCount = myBookings.filter((b) => b.status === 'rejected').length;
  const completedCount = myBookings.filter((b) => b.status === 'completed').length;

  // Filtered Bookings
  const filteredBookings = myBookings.filter((b) => {
    const matchesFilter = activeFilter === 'all' || b.status === activeFilter;
    const matchesSearch =
      b.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.studentNpm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.eventTypeName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const openActionModal = (booking: Booking, type: 'confirm' | 'reject') => {
    setSelectedBooking(booking);
    setActionType(type);
    setNoteInput('');
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking || !actionType) return;
    handleProcessBookingSubmit(selectedBooking.id, actionType, noteInput.trim());
    setSelectedBooking(null);
    setActionType(null);
    setNoteInput('');
  };

  return (
    <div className="space-y-6 text-left" id="calcom-bookings-container">
      {/* Header Banner Cal.com Style */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-2">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Cal.com Scheduling Manager</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            Persetujuan Jadwal Bimbingan
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Kelola dan konfirmasi pengajuan sesi bimbingan dari mahasiswa Anda secara real-time.
          </p>
        </div>

        {/* Quick Stats Badge */}
        {pendingCount > 0 && (
          <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 px-4 py-3 rounded-2xl shrink-0">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 animate-bounce" />
            <div>
              <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                {pendingCount} Permintaan Baru
              </p>
              <p className="text-[11px] text-amber-700 dark:text-amber-400 font-light">
                Membutuhkan persetujuan Anda
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-4 md:p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Cal.com Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === 'all'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700'
              }`}
            >
              Semua ({myBookings.length})
            </button>
            <button
              onClick={() => setActiveFilter('pending')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeFilter === 'pending'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700'
              }`}
            >
              <span>Menunggu</span>
              {pendingCount > 0 && (
                <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveFilter('confirmed')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeFilter === 'confirmed'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700'
              }`}
            >
              <span>Disetujui</span>
              <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">
                {confirmedCount}
              </span>
            </button>
            <button
              onClick={() => setActiveFilter('rejected')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === 'rejected'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700'
              }`}
            >
              Ditolak ({rejectedCount})
            </button>
            <button
              onClick={() => setActiveFilter('completed')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === 'completed'
                  ? 'bg-zinc-700 text-white shadow-xs'
                  : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700'
              }`}
            >
              Selesai ({completedCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari mahasiswa / sesi..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* List of Bookings Cards */}
        {filteredBookings.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-zinc-800 text-gray-400 flex items-center justify-center mx-auto">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Tidak ada jadwal bimbingan ditemukan
            </p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Belum ada pengajuan bimbingan pada kategori ini atau coba ubah kata kunci pencarian Anda.
            </p>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {filteredBookings.map((b) => {
              const statusStyles = {
                pending: {
                  badge: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900',
                  label: 'Menunggu Konfirmasi',
                  icon: AlertCircle,
                },
                confirmed: {
                  badge: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
                  label: 'Disetujui',
                  icon: CheckCircle2,
                },
                rejected: {
                  badge: 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-900',
                  label: 'Ditolak',
                  icon: XCircle,
                },
                completed: {
                  badge: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700',
                  label: 'Selesai',
                  icon: CheckCircle2,
                },
              };

              const status = statusStyles[b.status] || statusStyles.pending;
              const StatusIcon = status.icon;

              return (
                <div
                  key={b.id}
                  className="bg-gray-50/60 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 hover:border-emerald-300 dark:hover:border-emerald-800 transition-all space-y-4"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Student & Event Info */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-base flex items-center justify-center shrink-0 shadow-xs">
                        {b.studentName.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                            {b.studentName}
                          </h4>
                          <span className="text-[11px] font-mono text-muted-foreground">
                            (NPM: {b.studentNpm})
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                          {b.eventTypeName}
                        </p>
                      </div>
                    </div>

                    {/* Status Pill & Time Badge */}
                    <div className="flex items-center gap-3 flex-wrap md:justify-end">
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300">
                        <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>{b.date} • {b.timeSlot}</span>
                      </div>

                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${status.badge}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        <span>{status.label}</span>
                      </span>
                    </div>
                  </div>

                  {/* Notes / Topik Bimbingan */}
                  {b.notes && (
                    <div className="bg-white dark:bg-zinc-900/80 rounded-xl p-3 border border-gray-100 dark:border-zinc-800/80 text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-gray-900 dark:text-gray-200">Catatan Mahasiswa: </span>
                        <span>{b.notes}</span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200/50 dark:border-zinc-800">
                    {b.status === 'pending' && (
                      <>
                        <button
                          onClick={() => openActionModal(b, 'reject')}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Tolak Janji</span>
                        </button>
                        <button
                          onClick={() => openActionModal(b, 'confirm')}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Setujui Bimbingan</span>
                        </button>
                      </>
                    )}

                    {b.status === 'confirmed' && (
                      <button
                        onClick={() => handleCompleteBooking(b.id)}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-900 text-white transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Tandai Selesai</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Action Modal (Confirm / Reject with Notes) */}
      {selectedBooking && actionType && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  actionType === 'confirm' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600' : 'bg-rose-100 dark:bg-rose-950 text-rose-600'
                }`}>
                  {actionType === 'confirm' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                </div>
                <h3 className="font-bold text-base text-gray-900 dark:text-white">
                  {actionType === 'confirm' ? 'Setujui Jadwal Bimbingan' : 'Tolak Permintaan Bimbingan'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setSelectedBooking(null);
                  setActionType(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-gray-50 dark:bg-zinc-800/60 rounded-2xl p-4 text-xs space-y-1">
              <p className="font-bold text-gray-900 dark:text-white">{selectedBooking.studentName}</p>
              <p className="text-muted-foreground">{selectedBooking.eventTypeName}</p>
              <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                {selectedBooking.date} • {selectedBooking.timeSlot}
              </p>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  {actionType === 'confirm' ? 'Catatan / Lokasi Ruangan (Opsional):' : 'Alasan Penolakan (Wajib/Opsional):'}
                </label>
                <textarea
                  rows={3}
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder={
                    actionType === 'confirm'
                      ? 'Misal: Ruang Dosen Gd. A Lt. 2 / Bawa draft bab 3 cetak.'
                      : 'Misal: Mohon pilih jadwal lain karena ada rapat prodi.'
                  }
                  className="w-full p-3 rounded-xl text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBooking(null);
                    setActionType(null);
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer shadow-md transition-all ${
                    actionType === 'confirm' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {actionType === 'confirm' ? 'Konfirmasi Setuju' : 'Kirim Penolakan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}