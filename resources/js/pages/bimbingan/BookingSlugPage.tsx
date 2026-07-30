import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
  Calendar as CalendarIcon,
  Clock,
  Globe,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  CheckCircle2,
  AlertCircle,
  Send,
  BookOpen,
  Video,
  MapPin,
  Sparkles,
  ArrowLeft,
  ChevronDown,
} from 'lucide-react';
import type { AvailabilityRule, EventType, AppUser } from '@/types';
import { toast } from 'sonner';

interface BookingSlugPageProps {
  slug: string;
  eventType: EventType | null;
  lecturer: AppUser | null;
  availabilityRules: AvailabilityRule[];
}

export default function BookingSlugPage({
  slug,
  eventType,
  lecturer,
  availabilityRules = [],
}: BookingSlugPageProps) {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  // Active availability rules logic: strictly filter by eventType's linked availabilityId if specified
  const targetAvailabilityId = eventType?.availabilityId;
  const linkedRules = (targetAvailabilityId && availabilityRules.length > 0)
    ? availabilityRules.filter(
        (r) =>
          String(r.id) === String(targetAvailabilityId) ||
          String(r.availabilityId) === String(targetAvailabilityId) ||
          (r.name && r.name.trim() === targetAvailabilityId.trim()) ||
          (r.rules?.sessionName && r.rules.sessionName.trim() === targetAvailabilityId.trim())
      )
    : [];

  const defaultOnlyRules = availabilityRules?.filter((r) => Boolean(r.isDefault)) || [];
  const activeRules = linkedRules.length > 0
    ? linkedRules
    : defaultOnlyRules;

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

  // Student Input Form State
  const [studentName, setStudentName] = useState('');
  const [studentNpm, setStudentNpm] = useState('');
  const [bookingTopic, setBookingTopic] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');

  // UI Flow State
  const [showConfirmStep, setShowConfirmStep] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];
  const monthShortNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agus', 'Sep', 'Okt', 'Nov', 'Des',
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

  const isPastDate = (dateObj: Date): boolean => {
    const checkStart = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
    return checkStart.getTime() < todayStart.getTime();
  };

  const getRulesForDayOfWeek = (dayOfWeek: number) => {
    return activeRules.filter((r) => Number(r.dayOfWeek) === Number(dayOfWeek));
  };

  const selectedDateObj = new Date(year, month, selectedDay);
  const selectedDayOfWeek = selectedDateObj.getDay();
  const isSelectedDatePast = isPastDate(selectedDateObj);
  const currentSelectedRules = getRulesForDayOfWeek(selectedDayOfWeek);

  // Generate dynamic time slots based on duration
  const generateSlots = (startTime: string, endTime: string, stepMinutes: number = 30) => {
    const slots: string[] = [];
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    let current = startH * 60 + startM;
    const end = endH * 60 + endM;

    while (current + stepMinutes <= end) {
      const h1 = String(Math.floor(current / 60)).padStart(2, '0');
      const m1 = String(current % 60).padStart(2, '0');
      const nextMinutes = current + stepMinutes;
      const h2 = String(Math.floor(nextMinutes / 60)).padStart(2, '0');
      const m2 = String(nextMinutes % 60).padStart(2, '0');

      slots.push(`${h1}:${m1} - ${h2}:${m2}`);
      current += stepMinutes;
    }
    return slots;
  };

  const sessionDuration = eventType?.duration || 30;
  const availableSlots = currentSelectedRules.flatMap((rule) =>
    generateSlots(rule.startTime, rule.endTime, sessionDuration)
  );

  const formatSelectedDateFull = () => {
    return `${dayNamesFull[selectedDayOfWeek]}, ${selectedDay} ${monthShortNames[month]}`;
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentNpm.trim()) {
      toast.error('Mohon lengkapi Nama dan NPM Anda.');
      return;
    }
    if (!selectedTimeSlot) {
      toast.error('Mohon pilih jam bimbingan terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success('Pengajuan bimbingan berhasil dikirim!');
    }, 1000);
  };

  const eventTypeName = eventType?.name || (slug ? slug.replace(/-/g, ' ') : 'Konsultasi Bimbingan Skripsi');
  const lecturerName = lecturer?.name || 'lecturer';
  const lecturerInitials = lecturerName
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'LE';

  return (
    <>
      <Head title={`Booking ${eventTypeName} - ${lecturerName}`} />

      <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans">
        {/* Top Navbar */}
        <header className="border-b border-gray-200/60 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-700 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                UMSU
              </div>
              <span className="text-xs font-bold tracking-tight text-gray-900 dark:text-white">
                Portal Bimbingan Dosen UMSU
              </span>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-zinc-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-300 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Dashboard</span>
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex items-center justify-center">
          <div className="w-full bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-xs">
            {isSuccess ? (
              /* SUCCESS CONFIRMATION VIEW */
              <div className="max-w-md mx-auto text-center space-y-6 py-8 animate-in fade-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Pengajuan Bimbingan Dikirim!
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Pengajuan sesi bimbingan Anda telah diterima dan akan diverifikasi oleh Dosen Pembimbing.
                  </p>
                </div>

                <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 rounded-2xl p-4 text-left text-xs space-y-2 font-medium">
                  <div className="flex justify-between border-b border-emerald-100 dark:border-emerald-900/30 pb-2">
                    <span className="text-muted-foreground">Dosen Pembimbing:</span>
                    <span className="font-bold text-gray-900 dark:text-white">{lecturerName}</span>
                  </div>
                  <div className="flex justify-between border-b border-emerald-100 dark:border-emerald-900/30 pb-2">
                    <span className="text-muted-foreground">Jenis Bimbingan:</span>
                    <span className="font-bold text-emerald-800 dark:text-emerald-300">{eventTypeName}</span>
                  </div>
                  <div className="flex justify-between border-b border-emerald-100 dark:border-emerald-900/30 pb-2">
                    <span className="text-muted-foreground">Waktu Sesi:</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                      {formatSelectedDateFull()}, {selectedTimeSlot} WIB
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mahasiswa (NPM):</span>
                    <span className="font-bold">{studentName} ({studentNpm})</span>
                  </div>
                </div>

                <div className="flex gap-3 justify-center pt-2">
                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setSelectedTimeSlot(null);
                    }}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-all cursor-pointer"
                  >
                    Ajukan Lagi
                  </button>
                  <Link
                    href="/dashboard"
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-all cursor-pointer"
                  >
                    Ke Dashboard
                  </Link>
                </div>
              </div>
            ) : (
              /* 3-COLUMN BOOKING LAYOUT matching exact screenshot */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* COLUMN 1: Dosen Info & Event Type & Availability Rules Box */}
                <div className="lg:col-span-4 space-y-6 lg:border-r border-gray-100 dark:border-zinc-800 lg:pr-8">
                  {/* Dosen Avatar & Role */}
                  <div className="flex items-center gap-3">
                    {lecturer?.avatar ? (
                      <img
                        src={lecturer.avatar}
                        alt={lecturerName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-emerald-600 shadow-xs"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                        {lecturerInitials}
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">Dosen Pembimbing</p>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white capitalize">
                        {lecturerName}
                      </h3>
                    </div>
                  </div>

                  {/* Event Type Title */}
                  <div className="space-y-3">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white capitalize leading-snug">
                      {eventTypeName}
                    </h2>

                    <div className="space-y-2 text-xs font-medium text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{sessionDuration} Menit Sesi</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {(eventType?.locationType === 'online') ? (
                          <Video className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        <span>{eventType?.locationDetails || (eventType?.locationType === 'online' ? 'Google Meet UMSU' : 'Ruang Dosen Gedung A / Ruang Prodi UMSU')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="flex items-center gap-1">
                          Asia/Jakarta (WIB)
                          <ChevronDown className="w-3 h-3 text-muted-foreground" />
                        </span>
                      </div>
                    </div>

                    {eventType?.description && (
                      <p className="text-xs text-muted-foreground pt-1 italic">
                        "{eventType.description}"
                      </p>
                    )}
                  </div>

                  {/* GREEN BOX: JADWAL KETERSEDIAAN DOSEN */}
                  <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 space-y-2">
                    <p className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 tracking-wider uppercase font-mono">
                      JADWAL KETERSEDIAAN DOSEN:
                    </p>
                    {activeRules.map((rule, idx) => {
                      const dayName = dayNamesFull[rule.dayOfWeek] || 'Hari';
                      const sessionName = rule.rules?.sessionName || rule.name || 'Sesi Pagi';
                      const quota = rule.rules?.maxQuotaPerSession ? `Batas: ${rule.rules.maxQuotaPerSession} org/sesi` : 'Batas: 5 org/sesi';
                      const dur = rule.rules?.sessionDurationMinutes || sessionDuration;

                      return (
                        <div
                          key={rule.id || idx}
                          className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/50 rounded-2xl p-3 space-y-1 text-xs"
                        >
                          <div className="flex items-center justify-between font-bold text-emerald-950 dark:text-emerald-200">
                            <span>{dayName}</span>
                            <span>{rule.startTime} - {rule.endTime} WIB</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-emerald-700 dark:text-emerald-400">
                            <span>{sessionName}</span>
                            <span>{quota} • {dur}m</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* COLUMN 2: Calendar Widget */}
                <div className="lg:col-span-4 space-y-4 lg:border-r border-gray-100 dark:border-zinc-800 lg:pr-6">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                      {monthNames[month]} <span className="text-muted-foreground font-normal">{year}</span>
                    </h3>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={prevMonth}
                        className="p-1.5 rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-300 transition-all cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={nextMonth}
                        className="p-1.5 rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-300 transition-all cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Day Names Grid */}
                  <div className="grid grid-cols-7 text-center gap-1 text-[10px] font-bold text-muted-foreground">
                    {daysOfWeek.map((d, i) => (
                      <div key={i}>{d}</div>
                    ))}
                  </div>

                  {/* Days Number Grid */}
                  <div className="grid grid-cols-7 gap-2 text-xs font-semibold">
                    {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
                      <div key={`empty-${idx}`} className="h-10 rounded-full" />
                    ))}

                    {Array.from({ length: daysInMonth }).map((_, idx) => {
                      const dayNum = idx + 1;
                      const dateObj = new Date(year, month, dayNum);
                      const dayOfWeekNum = dateObj.getDay();
                      const past = isPastDate(dateObj);
                      const isSelected = selectedDay === dayNum;
                      const hasRules = getRulesForDayOfWeek(dayOfWeekNum).length > 0;

                      let btnStyle = 'bg-gray-100/60 dark:bg-zinc-800/40 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40';

                      if (past) {
                        btnStyle = 'bg-gray-50/30 dark:bg-zinc-900/20 text-gray-300 dark:text-zinc-700 cursor-not-allowed';
                      } else if (isSelected) {
                        btnStyle = 'bg-emerald-700 text-white font-bold shadow-md shadow-emerald-700/30 ring-2 ring-emerald-500/20';
                      } else if (hasRules) {
                        btnStyle = 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-900/40 font-bold hover:bg-emerald-600 hover:text-white';
                      }

                      return (
                        <button
                          key={dayNum}
                          disabled={past}
                          onClick={() => {
                            setSelectedDay(dayNum);
                            setSelectedTimeSlot(null);
                            setShowConfirmStep(false);
                          }}
                          className={`h-10 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer relative ${btnStyle}`}
                        >
                          <span>{dayNum}</span>
                          {hasRules && !isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute bottom-1" />
                          )}
                          {isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white absolute bottom-1" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* COLUMN 3: Time Slot Picker & Warning Card / Form */}
                <div className="lg:col-span-4 space-y-4">
                  {/* Selected Day Header */}
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                      {formatSelectedDateFull()}
                    </h3>
                  </div>

                  {/* IF NO SLOTS AVAILABLE ON SELECTED DAY */}
                  {currentSelectedRules.length === 0 || isSelectedDatePast ? (
                    <div className="bg-gray-50/80 dark:bg-zinc-900/80 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200/60 dark:border-amber-900/40 text-amber-500 flex items-center justify-center mx-auto text-xl font-bold">
                        !
                      </div>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                        Dosen Tidak Buka Jam Bimbingan Hari Ini
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Dosen Pembimbing tidak membuka jadwal bimbingan pada hari{' '}
                        <strong className="text-gray-800 dark:text-gray-200">
                          {dayNamesFull[selectedDayOfWeek]}
                        </strong>
                        . Silakan pilih hari yang ditandai dengan ubin hijau pada kalender.
                      </p>
                    </div>
                  ) : (
                    /* IF SLOTS ARE AVAILABLE */
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider font-mono">
                          PILIH SLOT WAKTU BIMBINGAN:
                        </label>
                        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
                          {availableSlots.map((slot, idx) => {
                            const isSelectedSlot = selectedTimeSlot === `${slot} WIB`;
                            return (
                              <button
                                key={idx}
                                onClick={() => {
                                  setSelectedTimeSlot(`${slot} WIB`);
                                  setShowConfirmStep(true);
                                }}
                                className={`w-full p-3 rounded-2xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer border ${
                                  isSelectedSlot
                                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-md shadow-emerald-700/20'
                                    : 'bg-gray-50 dark:bg-zinc-800/60 text-gray-800 dark:text-gray-200 border-gray-200/80 dark:border-zinc-700/80 hover:border-emerald-400 dark:hover:border-emerald-700'
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <Clock className={`w-3.5 h-3.5 ${isSelectedSlot ? 'text-white' : 'text-emerald-600'}`} />
                                  {slot} WIB
                                </span>
                                <span className="text-[10px] opacity-80">{sessionDuration} Min</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
