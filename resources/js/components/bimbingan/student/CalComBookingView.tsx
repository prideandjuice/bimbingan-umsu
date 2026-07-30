import React, { useState } from 'react';
import {
  Clock,
  Video,
  Globe,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Calendar as CalendarIcon,
  Grid,
  Send,
  X,
  AlertCircle,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import type { Thesis, AvailabilityRule, EventType, Booking } from '@/types';

interface CalComBookingViewProps {
  myThesis: Thesis;
  availabilityRules: AvailabilityRule[];
  eventType?: EventType;
  myBookings?: Booking[];
  onBookMeeting: (date: string, timeSlot: string, notes: string) => void;
  disabled?: boolean;
}

export default function CalComBookingView({
  myThesis,
  availabilityRules,
  eventType,
  myBookings = [],
  onBookMeeting,
  disabled = false,
}: CalComBookingViewProps) {
  // Real-time Date Calculation
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  // Filter rules matching linked eventType availabilityId if specified
  const targetAvailabilityId = eventType?.availabilityId;
  const linkedRules = (targetAvailabilityId && availabilityRules?.length > 0)
    ? availabilityRules.filter(
        (r) => String(r.id) === String(targetAvailabilityId) || String(r.availabilityId) === String(targetAvailabilityId)
      )
    : [];

  const defaultOnlyRules = availabilityRules?.filter((r) => Boolean(r.isDefault)) || [];
  const activeRules = linkedRules.length > 0
    ? linkedRules
    : defaultOnlyRules.length > 0
    ? defaultOnlyRules
    : (availabilityRules && availabilityRules.length > 0)
    ? availabilityRules
    : [
        { id: 'ar-1', lecturerId: 'user-lecturer-1', dayOfWeek: 1, startTime: '16:00', endTime: '16:30', isDefault: true },
      ];

  // Helper: Find first available day starting from today
  const getInitialAvailableDate = () => {
    for (let offset = 0; offset < 60; offset++) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
      const dayOfWeek = d.getDay();
      const rules = activeRules.filter((r) => Number(r.dayOfWeek) === Number(dayOfWeek));
      if (rules.length > 0) {
        return {
          monthDate: new Date(d.getFullYear(), d.getMonth(), 1),
          day: d.getDate(),
        };
      }
    }
    return {
      monthDate: new Date(today.getFullYear(), today.getMonth(), 1),
      day: today.getDate(),
    };
  };

  const initialDateInfo = getInitialAvailableDate();
  const [currentDate, setCurrentDate] = useState(() => initialDateInfo.monthDate);
  const [selectedDay, setSelectedDay] = useState<number>(() => initialDateInfo.day);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [bookingNotes, setBookingNotes] = useState('');
  const [showConfirmStep, setShowConfirmStep] = useState(false);

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const daysOfWeek = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];
  const dayNamesFull = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Helper: check if a date object is in the past (< today)
  const isPastDate = (dateObj: Date): boolean => {
    const checkStart = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
    return checkStart.getTime() < todayStart.getTime();
  };

  // Helper: check if a date object is today
  const isTodayDate = (dateObj: Date): boolean => {
    return (
      dateObj.getFullYear() === today.getFullYear() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getDate() === today.getDate()
    );
  };

  // Helper: Get rules for a specific day of week
  const getRulesForDayOfWeek = (dayOfWeek: number) => {
    return activeRules.filter((r) => Number(r.dayOfWeek) === Number(dayOfWeek));
  };

  // Rules for currently selected date
  const selectedDateObj = new Date(year, month, selectedDay);
  const selectedDayOfWeek = selectedDateObj.getDay();
  const isSelectedDatePast = isPastDate(selectedDateObj);
  const currentSelectedRules = getRulesForDayOfWeek(selectedDayOfWeek);

  // Helper: check if a time slot string "HH:MM" has passed today
  const isPastTimeSlot = (dateObj: Date, slotStr: string): boolean => {
    if (isPastDate(dateObj)) return true;
    if (!isTodayDate(dateObj)) return false; // Future date slots are valid

    const [slotH, slotM] = slotStr.split(':').map(Number);
    const currentH = today.getHours();
    const currentM = today.getMinutes();

    if (slotH < currentH) return true;
    if (slotH === currentH && slotM <= currentM) return true;
    return false;
  };

  interface SlotItem {
    slotStart: string;
    slotEnd: string;
    sessionName: string;
    maxQuota: number;
    fullSlotText: string;
  }

  // Generate time slots strictly matching lecturer's availability window & session duration rule
  const generateDynamicSlots = (rules: AvailabilityRule[]): SlotItem[] => {
    if (rules.length === 0) return [];
    const slots: SlotItem[] = [];

    rules.forEach((rule) => {
      const duration = rule.rules?.sessionDurationMinutes || 30;
      const sName = rule.rules?.sessionName || 'Sesi Standard';
      const quota = rule.rules?.maxQuotaPerSession || 5;

      const [startH, startM] = rule.startTime.split(':').map(Number);
      const [endH, endM] = rule.endTime.split(':').map(Number);

      let startTotal = startH * 60 + startM;
      const endTotal = endH * 60 + endM;

      while (startTotal + duration <= endTotal) {
        const startStr = `${String(Math.floor(startTotal / 60)).padStart(2, '0')}:${String(startTotal % 60).padStart(2, '0')}`;
        const endTotalSlot = startTotal + duration;
        const endStr = `${String(Math.floor(endTotalSlot / 60)).padStart(2, '0')}:${String(endTotalSlot % 60).padStart(2, '0')}`;

        if (!slots.some((s) => s.slotStart === startStr)) {
          slots.push({
            slotStart: startStr,
            slotEnd: endStr,
            sessionName: sName,
            maxQuota: quota,
            fullSlotText: `${sName} (${startStr} - ${endStr} WIB)`,
          });
        }
        startTotal += duration;
      }
    });

    return slots.sort((a, b) => a.slotStart.localeCompare(b.slotStart));
  };

  const dynamicSlots = generateDynamicSlots(currentSelectedRules);

  const formattedSelectedDateText = `${dayNamesFull[selectedDayOfWeek]}, ${selectedDay} ${monthNames[month]} ${year}`;

  const paddedMonth = String(month + 1).padStart(2, '0');
  const paddedDay = String(selectedDay).padStart(2, '0');
  const formattedDateStr = `${year}-${paddedMonth}-${paddedDay}`;

  // Strict check: only match exact YYYY-MM-DD date
  const existingBookingForDate = myBookings?.find((b) => {
    if (b.status === 'rejected') return false;
    const bDate = b.date.includes('T') ? b.date.split('T')[0] : b.date;
    return bDate === formattedDateStr;
  });

  const handleSelectSlot = (slot: SlotItem) => {
    if (disabled || isSelectedDatePast || isPastTimeSlot(selectedDateObj, slot.slotStart) || Boolean(existingBookingForDate)) return;
    setSelectedTimeSlot(slot.fullSlotText);
    setShowConfirmStep(true);
  };

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTimeSlot || disabled || isSelectedDatePast || Boolean(existingBookingForDate)) return;

    const paddedMonth = String(month + 1).padStart(2, '0');
    const paddedDay = String(selectedDay).padStart(2, '0');
    const fullDate = `${year}-${paddedMonth}-${paddedDay}`;

    onBookMeeting(fullDate, selectedTimeSlot, bookingNotes);
    setShowConfirmStep(false);
    setSelectedTimeSlot(null);
    setBookingNotes('');
  };

  return (
    <div className="bg-white border border-gray-200/90 rounded-3xl p-6 md:p-8 text-gray-900 shadow-sm space-y-6 text-left relative overflow-hidden font-sans">
      {/* Top Header Bar Controls */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-5">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-600 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-mono">
            Sistem Jadwal Bimbingan UMSU (Real-time)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 hover:bg-emerald-100 transition-all cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
            <span>Bantuan UMSU</span>
          </button>

          <div className="flex items-center bg-gray-100 border border-gray-200 rounded-xl p-1 gap-1 text-gray-600">
            <button
              type="button"
              className="p-1.5 rounded-lg bg-white text-emerald-800 shadow-2xs font-bold transition-all"
              title="Tampilan Kalender"
            >
              <CalendarIcon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="p-1.5 rounded-lg hover:text-gray-900 transition-all"
              title="Tampilan Grid"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">

        {/* ─── COLUMN 1: Profile & Lecturer Availability Info (4 cols) ──── */}
        <div className="lg:col-span-4 space-y-5 border-b lg:border-b-0 lg:border-r border-gray-100 pb-6 lg:pb-0 lg:pr-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-sm">
              {myThesis.supervisorName ? myThesis.supervisorName.substring(0, 2).toUpperCase() : 'DS'}
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold">Dosen Pembimbing</p>
              <h3 className="font-extrabold text-sm text-gray-900 leading-tight mt-0.5">
                {myThesis.supervisorName || 'Prof. Dr. Irwan, M.Si'}
              </h3>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h2 className="font-black text-lg md:text-xl text-gray-900 leading-snug capitalize">
              {eventType?.name || 'Konsultasi Bimbingan Skripsi'}
            </h2>

            <div className="space-y-2.5 text-xs text-gray-700 font-semibold">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{eventType?.duration || 30} Menit Sesi</span>
              </div>

              <div className="flex items-center gap-2.5">
                {eventType?.locationType === 'online' ? (
                  <Video className="w-4 h-4 text-emerald-700 shrink-0" />
                ) : (
                  <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                )}
                <span>{eventType?.locationDetails || (eventType?.locationType === 'online' ? 'Google Meet UMSU' : 'Ruang Dosen Gedung A / Ruang Prodi UMSU')}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="flex items-center gap-1 font-bold text-gray-800">
                  Asia/Jakarta (WIB)
                  <ChevronRight className="w-3 h-3 rotate-90 text-gray-500" />
                </span>
              </div>
            </div>

            {eventType?.description && (
              <p className="text-xs text-muted-foreground italic pt-1">
                "{eventType.description}"
              </p>
            )}
          </div>

          {/* Rincian Ketersediaan Waktu Dosen */}
          <div className="pt-4 border-t border-gray-100 space-y-2">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-900 font-mono">
              Jadwal Ketersediaan Dosen:
            </p>
            <div className="space-y-2 text-xs">
              {activeRules.map((rule, idx) => (
                <div key={idx} className="space-y-1 text-gray-800 bg-emerald-50/90 px-3 py-2 rounded-xl border border-emerald-200 shadow-2xs overflow-hidden">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-extrabold text-gray-900 shrink-0 whitespace-nowrap text-xs">{dayNamesFull[rule.dayOfWeek]}</span>
                    <span className="font-mono font-extrabold text-emerald-950 text-[10.5px] sm:text-[11px] shrink-0 whitespace-nowrap">
                      {rule.startTime} - {rule.endTime} WIB
                    </span>
                  </div>
                  {rule.rules && (
                    <div className="flex items-center justify-between text-[10px] font-medium text-emerald-800 border-t border-emerald-200/60 pt-1">
                      <span className="font-semibold">{rule.rules.sessionName || 'Sesi Standard'}</span>
                      <span>Batas: {rule.rules.maxQuotaPerSession ?? 5} org/sesi • {rule.rules.sessionDurationMinutes ?? 30}m</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── COLUMN 2: Interactive Month Calendar (4 cols) ───────────── */}
        <div className="lg:col-span-4 space-y-4 px-0 md:px-2 border-b lg:border-b-0 lg:border-r border-gray-100 pb-6 lg:pb-0 lg:pr-6">
          {/* Month Header Navigation */}
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-gray-900">
              {monthNames[month]} <span className="text-gray-500 font-normal">{year}</span>
            </h3>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prevMonth}
                className="p-1.5 rounded-xl bg-gray-100 border border-gray-200 text-gray-700 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer font-bold"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="p-1.5 rounded-xl bg-gray-100 border border-gray-200 text-gray-700 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer font-bold"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-gray-600 tracking-wider uppercase font-mono py-1">
            {daysOfWeek.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* Calendar Grid Matrix */}
          <div className="grid grid-cols-7 gap-2 text-center">
            {/* Blank offset days */}
            {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-10 md:h-11" />
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const isSelected = selectedDay === dayNum;
              const dayDateObj = new Date(year, month, dayNum);
              const dayOfWeek = dayDateObj.getDay();
              const dayRules = getRulesForDayOfWeek(dayOfWeek);
              const past = isPastDate(dayDateObj);
              const isCurrentToday = isTodayDate(dayDateObj);
              const isAvailableDay = dayRules.length > 0 && !past;

              return (
                <button
                  key={`day-${dayNum}`}
                  type="button"
                  disabled={past || !isAvailableDay}
                  onClick={() => {
                    if (past || !isAvailableDay) return;
                    setSelectedDay(dayNum);
                    setShowConfirmStep(false);
                  }}
                  title={
                    past
                      ? `Tanggal ${dayNum} sudah lewat`
                      : isAvailableDay
                      ? `Hari ${dayNamesFull[dayOfWeek]}: ${dayRules[0].startTime} - ${dayRules[0].endTime} WIB`
                      : `Dosen tidak ada jam bimbingan pada hari ${dayNamesFull[dayOfWeek]}`
                  }
                  className={`h-10 md:h-11 rounded-xl text-xs font-black flex flex-col items-center justify-center transition-all relative ${
                    isSelected
                      ? 'bg-emerald-700 text-white font-black shadow-md shadow-emerald-700/30 scale-105 ring-2 ring-emerald-700/40 cursor-pointer'
                      : past
                      ? 'bg-gray-100/80 border border-gray-200 text-gray-500 font-extrabold cursor-not-allowed opacity-80'
                      : isAvailableDay
                      ? 'bg-emerald-50 hover:bg-emerald-600 border border-emerald-400 hover:border-emerald-700 text-emerald-950 hover:text-white cursor-pointer transition-all shadow-2xs font-black'
                      : 'bg-gray-50 border border-gray-200/90 text-gray-800 font-extrabold cursor-pointer hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span>{dayNum}</span>
                  {isAvailableDay && !isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 absolute bottom-1" />
                  )}
                  {isCurrentToday && !isSelected && !isAvailableDay && (
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600 absolute bottom-1" />
                  )}
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white absolute bottom-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── COLUMN 3: Dynamic Time Slots Panel (4 cols) ─────────────── */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-sm text-gray-900 flex items-center gap-2">
                <span className="text-emerald-700">●</span>
                <span>{dayNamesFull[selectedDayOfWeek]}, {selectedDay} {monthNames[month].substring(0, 3)}</span>
              </h3>
              {!isSelectedDatePast && currentSelectedRules.length > 0 && (
                <p className="text-[11px] text-emerald-800 font-extrabold mt-0.5 font-mono">
                  Jam Bimbingan: {currentSelectedRules[0].startTime} - {currentSelectedRules[0].endTime} WIB
                </p>
              )}
            </div>
          </div>

          {/* Alert jika SK Admin Belum Ada */}
          {disabled && (
            <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-xs text-amber-900 space-y-1">
              <p className="font-extrabold flex items-center gap-1.5 text-amber-800">
                <Clock className="w-4 h-4" />
                Menunggu SK Admin
              </p>
              <p className="text-[11px] leading-relaxed font-medium">
                Slot waktu bimbingan belum dapat diklik sebelum File SK diterbitkan oleh Admin.
              </p>
            </div>
          )}

          {/* List of Time Slots matched to Lecturer's availability & real-time */}
          {!showConfirmStep ? (
            isSelectedDatePast ? (
              <div className="bg-gray-50 border border-dashed border-gray-200 p-6 rounded-2xl text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-gray-400 mx-auto" />
                <p className="font-bold text-xs text-gray-900">
                  Tanggal Sudah Berlalu
                </p>
                <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                  Tanggal ini ({formattedSelectedDateText}) sudah lewat dan tidak dapat dibooking lagi. Silakan pilih tanggal hari ini atau tanggal mendatang yang berwarna hijau.
                </p>
              </div>
            ) : dynamicSlots.length > 0 ? (
              <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                {dynamicSlots.map((slot) => {
                  const slotPassed = isPastTimeSlot(selectedDateObj, slot.slotStart);
                  const isBooked = Boolean(existingBookingForDate);

                  let btnBg = 'bg-emerald-50/90 hover:bg-emerald-700 border border-emerald-300 hover:border-emerald-700 text-emerald-950 hover:text-white cursor-pointer hover:scale-[1.01] shadow-2xs';
                  let btnText = 'Pilih Slot Sesi →';

                  if (disabled || slotPassed) {
                    btnBg = 'bg-gray-100 border border-gray-300 text-gray-700 cursor-not-allowed font-extrabold';
                    btnText = slotPassed ? 'Sudah Lewat' : 'Belum Dibuka';
                  } else if (isBooked) {
                    btnBg = 'bg-emerald-100/90 border border-emerald-400 text-emerald-950 font-bold cursor-not-allowed shadow-2xs';
                    btnText = '✓ Sudah Didaftarkan';
                  }

                  return (
                    <button
                      key={slot.slotStart}
                      type="button"
                      disabled={disabled || slotPassed || isBooked}
                      onClick={() => handleSelectSlot(slot)}
                      className={`w-full text-xs py-3 px-4 rounded-xl flex items-center justify-between transition-all group ${btnBg}`}
                    >
                      <div className="flex items-center gap-2.5">
                        {isBooked ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        ) : (
                          <span className={`w-2.5 h-2.5 rounded-full ${slotPassed ? 'bg-gray-500' : 'bg-emerald-600 group-hover:bg-white group-hover:scale-125'} transition-all`} />
                        )}
                        <div className="text-left font-mono">
                          <span className="font-extrabold font-sans text-xs block">{slot.sessionName}</span>
                          <span className="font-mono text-[11px] font-bold opacity-90">{slot.slotStart} - {slot.slotEnd} WIB</span>
                        </div>
                      </div>

                      <span className={`text-[11px] font-sans font-bold transition-colors ${
                        disabled || slotPassed ? 'text-gray-600 font-extrabold' : isBooked ? 'text-emerald-800 font-extrabold' : 'text-emerald-800 group-hover:text-white'
                      }`}>
                        {btnText}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="bg-gray-50 border border-dashed border-gray-200 p-6 rounded-2xl text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                <p className="font-bold text-xs text-gray-900">
                  Dosen Tidak Buka Jam Bimbingan Hari Ini
                </p>
                <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                  Dosen Pembimbing tidak membuka jadwal bimbingan pada hari <strong>{dayNamesFull[selectedDayOfWeek]}</strong>. Silakan pilih hari yang ditandai dengan ubin hijau pada kalender.
                </p>
              </div>
            )
          ) : (
            /* Confirmation Step */
            <form onSubmit={handleConfirmSubmit} className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-emerald-900 font-mono">
                    Konfirmasi Pengajuan
                  </p>
                  <p className="text-xs font-extrabold text-gray-900 mt-0.5">
                    {formattedSelectedDateText} • {selectedTimeSlot}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowConfirmStep(false)}
                  className="text-gray-500 hover:text-gray-900 p-1 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-900">
                  Topik / Catatan Bimbingan (Opsional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Tuliskan topik bahasan (misal: Konsultasi Bab I & II)..."
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl p-3 text-xs text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowConfirmStep(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-black bg-emerald-700 hover:bg-emerald-800 text-white transition-all shadow-md shadow-emerald-700/20 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
