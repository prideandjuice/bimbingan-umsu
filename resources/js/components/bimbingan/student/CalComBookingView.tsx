import React, { useState, useMemo } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';
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
  Lock,
} from 'lucide-react';
import type { Thesis, AvailabilityRule, EventType, Booking, AppUser } from '@/types';

interface CalComBookingViewProps {
  myThesis?: Thesis;
  lecturerName?: string;
  availabilityRules: AvailabilityRule[];
  eventType?: EventType;
  myBookings?: Booking[];
  onBookMeeting: (date: string, timeSlot: string, notes: string) => void;
  disabled?: boolean;
}

export default function CalComBookingView({
  myThesis,
  lecturerName,
  availabilityRules = [],
  eventType,
  myBookings = [],
  onBookMeeting,
  disabled = false,
}: CalComBookingViewProps) {
  const { props } = usePage<{ auth?: { user?: AppUser } }>();
  const currentUser = props?.auth?.user;

  const isLecturerUser = Boolean(
    currentUser?.roles?.includes('lecturer') ||
    (currentUser as any)?.role === 'lecturer' ||
    (currentUser as any)?.roles?.some((r: any) => (typeof r === 'string' ? r : r.name) === 'lecturer')
  );

  const displaySupervisorName = lecturerName || myThesis?.supervisorName || (isLecturerUser ? currentUser?.name : 'Dosen Pembimbing UMSU');
  const supervisorInitials = displaySupervisorName
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'DS';

  // Real-time Date Calculation
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  // Filter rules matching linked eventType availabilityId if specified
  const targetAvailabilityId = eventType?.availabilityId;
  let linkedRules: AvailabilityRule[] = [];
  if (targetAvailabilityId && availabilityRules?.length > 0) {
    const targetRule = availabilityRules.find((r) => String(r.id) === String(targetAvailabilityId));
    const targetName = targetRule?.name || targetRule?.rules?.sessionName || targetAvailabilityId;

    linkedRules = availabilityRules.filter(
      (r) =>
        String(r.id) === String(targetAvailabilityId) ||
        String(r.availabilityId) === String(targetAvailabilityId) ||
        (r.name && r.name.trim().toLowerCase() === targetName.trim().toLowerCase()) ||
        (r.rules?.sessionName && r.rules.sessionName.trim().toLowerCase() === targetName.trim().toLowerCase())
    );
  }

  const activeRules = linkedRules.length > 0
    ? linkedRules
    : availabilityRules || [];

  const DAY_CODES_MAP: Record<string, number> = {
    minggu: 0, senin: 1, selasa: 2, rabu: 3, kamis: 4, jumat: 5, sabtu: 6,
  };

  interface ExtractedDayRule {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    sessionName: string;
    duration: number;
  }

  // Extract all day slots (including nested slots inside rules.slots)
  const extractedDayRules = useMemo(() => {
    const list: ExtractedDayRule[] = [];

    const rulesToProcess = activeRules.length > 0 ? activeRules : (availabilityRules || []);

    rulesToProcess.forEach((rule) => {
      const sName = rule.rules?.sessionName || rule.name || 'Sesi Standard';
      const dur = eventType?.duration || rule.rules?.sessionDurationMinutes || 30;

      const rawSlots = (rule.rules?.slots && Array.isArray(rule.rules.slots) && rule.rules.slots.length > 0)
        ? rule.rules.slots
        : [{ dayOfWeek: rule.dayOfWeek, startTime: rule.startTime, endTime: rule.endTime }];

      rawSlots.forEach((slotInfo: any) => {
        let d = 1;
        if (slotInfo.dayOfWeek !== undefined && slotInfo.dayOfWeek !== null && !isNaN(Number(slotInfo.dayOfWeek))) {
          d = Number(slotInfo.dayOfWeek);
        } else if (typeof slotInfo.day === 'string' && DAY_CODES_MAP[slotInfo.day.toLowerCase()] !== undefined) {
          d = DAY_CODES_MAP[slotInfo.day.toLowerCase()];
        } else if (rule.dayOfWeek !== undefined && rule.dayOfWeek !== null) {
          d = Number(rule.dayOfWeek);
        }

        const startT = slotInfo.startTime || rule.startTime || '08:00';
        const endT = slotInfo.endTime || rule.endTime || '16:00';

        const existing = list.find(
          (item) => item.dayOfWeek === d && item.startTime === startT && item.endTime === endT
        );

        if (!existing) {
          list.push({
            dayOfWeek: d,
            startTime: startT,
            endTime: endT,
            sessionName: sName,
            duration: dur,
          });
        }
      });
    });

    return list.sort((a, b) => {
      const orderA = a.dayOfWeek === 0 ? 7 : a.dayOfWeek;
      const orderB = b.dayOfWeek === 0 ? 7 : b.dayOfWeek;
      return orderA - orderB;
    });
  }, [activeRules, availabilityRules, eventType]);

  // Helper: Find first available day starting from today
  const getInitialAvailableDate = () => {
    for (let offset = 0; offset < 60; offset++) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
      const dayOfWeek = d.getDay();
      const hasMatch = extractedDayRules.some((r) => r.dayOfWeek === dayOfWeek);
      if (hasMatch) {
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
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [studentNameInput, setStudentNameInput] = useState(currentUser?.name || myThesis?.studentName || 'Mahasiswa');
  const [studentEmailInput, setStudentEmailInput] = useState(
    (currentUser as any)?.npm ? `${(currentUser as any).npm}` : currentUser?.email || 'mahasiswa@umsu.ac.id'
  );

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
    return extractedDayRules.filter((r) => Number(r.dayOfWeek) === Number(dayOfWeek));
  };

  // Rules for currently selected date
  const selectedDateObj = new Date(year, month, selectedDay);
  const selectedDayOfWeek = selectedDateObj.getDay();
  const isSelectedDatePast = isPastDate(selectedDateObj);
  const currentSelectedRules = getRulesForDayOfWeek(selectedDayOfWeek);

  // Helper: check if a time slot string "HH:MM" has passed today
  const isPastTimeSlot = (dateObj: Date, slotStr: string): boolean => {
    if (isPastDate(dateObj)) return true;
    if (!isTodayDate(dateObj)) return false;

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
    fullSlotText: string;
  }

  // Generate time slots strictly matching lecturer's availability window & session duration rule
  const generateDynamicSlots = (rules: ExtractedDayRule[]): SlotItem[] => {
    if (rules.length === 0) return [];
    const slots: SlotItem[] = [];

    rules.forEach((rule) => {
      const duration = eventType?.duration || rule.duration || 30;
      const sName = eventType?.name || rule.sessionName || 'Sesi Standard';

      const [startH, startM] = rule.startTime.split(':').map(Number);
      const [endH, endM] = rule.endTime.split(':').map(Number);

      let startTotal = startH * 60 + startM;
      const endTotal = endH * 60 + endM;

      while (startTotal + duration <= endTotal) {
        const h1 = String(Math.floor(startTotal / 60)).padStart(2, '0');
        const m1 = String(startTotal % 60).padStart(2, '0');
        const endNext = startTotal + duration;
        const h2 = String(Math.floor(endNext / 60)).padStart(2, '0');
        const m2 = String(endNext % 60).padStart(2, '0');

        const sStart = `${h1}:${m1}`;
        const sEnd = `${h2}:${m2}`;
        const fullText = `${sStart} - ${sEnd} WIB`;

        slots.push({
          slotStart: sStart,
          slotEnd: sEnd,
          sessionName: sName,
          fullSlotText: fullText,
        });

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

  // Check if a specific time slot is already booked by student on this date
  const isSlotBookedByStudent = (slot: SlotItem): boolean => {
    return Boolean(
      myBookings?.some((b) => {
        if (b.status === 'rejected') return false;
        const bDate = b.date.includes('T') ? b.date.split('T')[0] : b.date;
        if (bDate !== formattedDateStr) return false;
        if (!b.timeSlot) return true;

        const match = b.timeSlot.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
        if (match) {
          const bookingStart = match[1];
          return slot.slotStart === bookingStart;
        }

        return b.timeSlot.includes(slot.slotStart);
      })
    );
  };

  const handleSelectSlot = (slot: SlotItem) => {
    if (isLecturerUser) {
      toast.info('Pilihan slot jam bimbingan khusus untuk Mahasiswa. Dosen dapat melihat pratinjau ketersediaan.');
      return;
    }

    if (!currentUser) {
      setSelectedTimeSlot(slot.fullSlotText);
      setShowAuthModal(true);
      return;
    }

    if (disabled || isSelectedDatePast || isPastTimeSlot(selectedDateObj, slot.slotStart) || isSlotBookedByStudent(slot)) return;
    setSelectedTimeSlot(slot.fullSlotText);
    setShowConfirmStep(true);
  };

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTimeSlot || disabled || isSelectedDatePast) return;

    const paddedMonth = String(month + 1).padStart(2, '0');
    const paddedDay = String(selectedDay).padStart(2, '0');
    const fullDate = `${year}-${paddedMonth}-${paddedDay}`;

    onBookMeeting(fullDate, selectedTimeSlot, bookingNotes);
    setShowConfirmStep(false);
    setSelectedTimeSlot(null);
    setBookingNotes('');
  };

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const redirectLoginUrl = `${currentPath}?authenticated=1`;

  return (
    <div className="bg-white border border-gray-200/90 rounded-3xl p-6 md:p-8 text-gray-900 shadow-sm space-y-6 text-left relative overflow-hidden font-sans">
      {/* Warning Banner for Unauthenticated Students */}
      {!currentUser && (
        <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900 font-medium shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-bold text-sm">
              🔑
            </div>
            <div>
              <p className="font-bold text-amber-950 text-xs">Perhatian: Anda Belum Login Akun Mahasiswa</p>
              <p className="text-[11px] text-amber-800 font-normal">
                Silakan masuk ke akun Mahasiswa Anda terlebih dahulu untuk memilih slot dan mengajukan janji temu bimbingan.
              </p>
            </div>
          </div>
          <a
            href={`/login?redirect=${encodeURIComponent(redirectLoginUrl)}`}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shrink-0 shadow-xs flex items-center gap-1.5"
          >
            <span>Masuk / Login Dulu</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

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

      {showConfirmStep ? (
        /* Cal.com Style 2-Column Confirmation View */
        <form
          onSubmit={handleConfirmSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-300 py-2"
        >
          {/* LEFT COLUMN: Summary Details */}
          <div className="lg:col-span-5 space-y-6 border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-zinc-800 pb-6 lg:pb-0 lg:pr-8 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                {supervisorInitials}
              </div>
              <p className="text-xs font-extrabold text-gray-700 dark:text-gray-300">
                {displaySupervisorName}
              </p>
            </div>

            <div className="space-y-1">
              <h2 className="font-black text-xl md:text-2xl text-gray-900 dark:text-white leading-snug">
                {eventType?.name || 'Konsultasi Bimbingan Skripsi'}
              </h2>
              {eventType?.description && (
                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {eventType.description}
                </p>
              )}
            </div>

            <div className="space-y-3.5 pt-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-3 text-gray-900 dark:text-white">
                <CalendarIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-extrabold">{formattedSelectedDateText}</span>
              </div>

              <div className="flex items-center gap-3 text-emerald-800 dark:text-emerald-300 font-extrabold font-mono">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{selectedTimeSlot}</span>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{eventType?.duration || 30}m Sesi</span>
              </div>

              <div className="flex items-center gap-3">
                {eventType?.locationType === 'online' ? (
                  <Video className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                <span>{eventType?.locationDetails || (eventType?.locationType === 'online' ? 'Google Meet UMSU' : 'Ruang Dosen Gedung A / Ruang Prodi UMSU')}</span>
              </div>

              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Asia/Jakarta (WIB)</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Form Inputs */}
          <div className="lg:col-span-7 space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-900 dark:text-white">
                Your name *
              </label>
              <input
                type="text"
                required
                value={studentNameInput}
                onChange={(e) => setStudentNameInput(e.target.value)}
                placeholder="Masukkan Nama Lengkap Anda"
                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl p-3 text-xs text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-900 dark:text-white">
                Email address / NPM *
              </label>
              <input
                type="text"
                required
                value={studentEmailInput}
                onChange={(e) => setStudentEmailInput(e.target.value)}
                placeholder="Email UMSU / NPM"
                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl p-3 text-xs text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-900 dark:text-white">
                Additional notes
              </label>
              <textarea
                rows={4}
                placeholder="Please share anything that will help prepare for our meeting (topik bahasan / perbaikan bab skripsi)..."
                value={bookingNotes}
                onChange={(e) => setBookingNotes(e.target.value)}
                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl p-3 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 outline-none font-medium resize-none transition-all"
              />
            </div>

            <p className="text-[11px] text-muted-foreground pt-1">
              By proceeding, you agree to UMSU Academic Guidance Terms and Privacy Policy.
            </p>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setShowConfirmStep(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-xs font-black bg-emerald-700 hover:bg-emerald-800 text-white shadow-md shadow-emerald-700/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Confirm Booking</span>
              </button>
            </div>
          </div>
        </form>
      ) : (
        /* MAIN 3-COLUMN CALENDAR & SLOT SELECTION VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ─── COLUMN 1: Profile & Lecturer Availability Info (4 cols) ──── */}
          <div className="lg:col-span-4 space-y-5 border-b lg:border-b-0 lg:border-r border-gray-100 pb-6 lg:pb-0 lg:pr-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-sm">
                {supervisorInitials}
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold">Dosen Pembimbing</p>
                <h3 className="font-extrabold text-sm text-gray-900 leading-tight mt-0.5 capitalize">
                  {displaySupervisorName}
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
                {extractedDayRules.length > 0 ? (
                  extractedDayRules.map((rule, idx) => (
                    <div key={idx} className="space-y-1 text-gray-800 bg-emerald-50/90 px-3 py-2 rounded-xl border border-emerald-200 shadow-2xs overflow-hidden">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-extrabold text-gray-900 shrink-0 whitespace-nowrap text-xs">{dayNamesFull[rule.dayOfWeek]}</span>
                        <span className="font-mono font-extrabold text-emerald-950 text-[10.5px] sm:text-[11px] shrink-0 whitespace-nowrap">
                          {rule.startTime} - {rule.endTime} WIB
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-emerald-700">
                        <span className="truncate max-w-[140px]">{rule.sessionName}</span>
                        <span>{rule.duration} Min</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] text-muted-foreground italic">Jadwal ketersediaan umum terpasang.</p>
                )}
              </div>
            </div>
          </div>

          {/* ─── COLUMN 2: Calendar Month Picker (4 cols) ──── */}
          <div className="lg:col-span-4 space-y-4 border-b lg:border-b-0 lg:border-r border-gray-100 pb-6 lg:pb-0 lg:pr-6">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-black text-sm text-gray-900">
                {monthNames[month]} <span className="text-gray-400 font-medium">{year}</span>
              </h3>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={prevMonth}
                  disabled={month === today.getMonth() && year === today.getFullYear()}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  title="Bulan Sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 transition-all"
                  title="Bulan Berikutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Header Nama Hari */}
            <div className="grid grid-cols-7 text-center gap-1 text-[10px] font-extrabold text-gray-600">
              {daysOfWeek.map((d, i) => (
                <div key={i}>{d}</div>
              ))}
            </div>

            {/* Grid Tanggal */}
            <div className="grid grid-cols-7 gap-1.5 text-xs font-bold">
              {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
                <div key={`empty-${idx}`} className="h-9 rounded-full" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const dateObj = new Date(year, month, dayNum);
                const dayOfWeekNum = dateObj.getDay();
                const past = isPastDate(dateObj);
                const isSelected = selectedDay === dayNum;
                const isLecturerOpen = extractedDayRules.some((r) => r.dayOfWeek === dayOfWeekNum);

                let bgClass = 'bg-gray-50 text-gray-700 hover:bg-emerald-50 border border-gray-200/60';
                if (past) {
                  bgClass = 'bg-gray-50/40 text-gray-300 cursor-not-allowed border-transparent';
                } else if (isSelected) {
                  bgClass = 'bg-emerald-700 text-white font-extrabold shadow-md shadow-emerald-700/30 scale-105 border-emerald-700';
                } else if (isLecturerOpen) {
                  bgClass = 'bg-emerald-50 text-emerald-950 border border-emerald-300 font-extrabold hover:bg-emerald-100 cursor-pointer';
                }

                return (
                  <button
                    key={dayNum}
                    type="button"
                    disabled={past}
                    onClick={() => {
                      setSelectedDay(dayNum);
                      setSelectedTimeSlot(null);
                      setShowConfirmStep(false);
                    }}
                    className={`h-9 rounded-xl flex flex-col items-center justify-center transition-all relative ${bgClass}`}
                  >
                    <span>{dayNum}</span>
                    {isLecturerOpen && !past && !isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ─── COLUMN 3: Time Slot Picker (4 cols) ──── */}
          <div className="lg:col-span-4 space-y-4">
            <div className="border-b border-gray-100 pb-2">
              <h4 className="font-extrabold text-xs text-gray-900 uppercase tracking-wider">
                • {formattedSelectedDateText}
              </h4>
              <p className="text-[11px] text-emerald-900 mt-0.5 font-bold font-mono">
                Jam Bimbingan: {currentSelectedRules.length > 0 ? `${currentSelectedRules[0].startTime} - ${currentSelectedRules[currentSelectedRules.length - 1].endTime} WIB` : 'Tidak Buka Sesi'}
              </p>
            </div>

            {/* Notice for Today's Date */}
            {isTodayDate(selectedDateObj) && (
              <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-2.5 text-[11px] text-emerald-900 leading-snug font-medium">
                💡 <strong>Catatan:</strong> Sesi pagi yang telah berlalu ditandai <i>"Sudah Lewat"</i>. Gulir ke bawah untuk memilih jam sesi mendatang atau pilih tanggal lain di kalender.
              </div>
            )}

            {/* List of Time Slots matched to Lecturer's availability & real-time */}
            {isSelectedDatePast ? (
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
                  const isBooked = isSlotBookedByStudent(slot);

                  let btnBg = 'bg-emerald-50/90 hover:bg-emerald-700 border border-emerald-300 hover:border-emerald-700 text-emerald-950 hover:text-white cursor-pointer hover:scale-[1.01] shadow-2xs';
                  let btnText = 'Pilih Slot Sesi →';

                  if (isLecturerUser) {
                    btnBg = 'bg-gray-100/90 border border-gray-300 text-gray-500 font-bold cursor-not-allowed';
                    btnText = 'Khusus Akses Mahasiswa';
                  } else if (disabled || slotPassed) {
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
                      disabled={disabled || slotPassed || isBooked || isLecturerUser}
                      onClick={() => handleSelectSlot(slot)}
                      className={`w-full text-xs py-3 px-4 rounded-xl flex items-center justify-between transition-all group ${btnBg}`}
                    >
                      <div className="flex items-center gap-2.5">
                        {isBooked ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        ) : (
                          <span className={`w-2.5 h-2.5 rounded-full ${slotPassed || isLecturerUser ? 'bg-gray-500' : 'bg-emerald-600 group-hover:bg-white group-hover:scale-125'} transition-all`} />
                        )}
                        <div className="text-left font-mono">
                          <span className="font-extrabold font-sans text-xs block">{slot.sessionName}</span>
                          <span className="font-mono text-[11px] font-bold opacity-90">{slot.slotStart} - {slot.slotEnd} WIB</span>
                        </div>
                      </div>

                      <span className={`text-[11px] font-sans font-bold transition-colors ${
                        isLecturerUser || disabled || slotPassed ? 'text-gray-500 font-bold' : isBooked ? 'text-emerald-800 font-extrabold' : 'text-emerald-800 group-hover:text-white'
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
            )}
          </div>
        </div>
      )}

      {/* AUTH REQUIRED MODAL FOR UNAUTHENTICATED USERS */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
              <Lock className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Login / Daftar Akun Mahasiswa
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Untuk mem-booking bimbingan pada jam <strong className="text-emerald-700 dark:text-emerald-300">{selectedTimeSlot}</strong>, silakan masuk ke akun Mahasiswa Anda terlebih dahulu.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <a
                href={`/login?redirect=${encodeURIComponent(redirectLoginUrl)}`}
                className="w-full py-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all text-center"
              >
                🔑 Login Akun Mahasiswa
              </a>
              <a
                href={`/register?redirect=${encodeURIComponent(redirectLoginUrl)}`}
                className="w-full py-3 rounded-xl text-xs font-bold bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-800 dark:text-gray-200 transition-all text-center"
              >
                📝 Daftar Akun Baru
              </a>
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="text-[11px] font-semibold text-muted-foreground hover:underline pt-1 cursor-pointer"
              >
                Kembali Lihat Jadwal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
