import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
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
  ChevronDown,
  Lock,
  Eye,
  Copy,
} from 'lucide-react';
import type { AvailabilityRule, EventType, AppUser } from '@/types';
import CalComBookingView from '@/components/bimbingan/student/CalComBookingView';
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
  const { props } = usePage<{ auth?: { user?: AppUser } }>();
  const rawCurrentUser = props.auth?.user;

  // Check URL query params for explicit post-login redirect
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const isAuthenticatedParam = urlParams ? (urlParams.get('authenticated') === '1' || urlParams.get('from_login') === '1') : false;

  const isLecturerUser = Boolean(
    (rawCurrentUser as any)?.roles?.includes('lecturer') ||
    (rawCurrentUser as any)?.role === 'lecturer' ||
    (rawCurrentUser as any)?.roles?.some((r: any) => (typeof r === 'string' ? r : r.name) === 'lecturer')
  );

  // currentUser is active for student booking ONLY if authenticated via URL redirect or explicitly confirmed, or if user is lecturer
  const currentUser = (isAuthenticatedParam || isLecturerUser) ? rawCurrentUser : null;

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const redirectTargetUrl = `${currentPath}?authenticated=1`;

  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  const eventTypeName = eventType?.name || (slug ? slug.replace(/-/g, ' ') : 'Konsultasi Bimbingan Skripsi');
  const lecturerName = lecturer?.name || 'lecturer';

  return (
    <>
      <Head title={`Booking ${eventTypeName} - ${lecturerName}`} />

      <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans">
        {/* Top Navbar Public Header */}
        <header className="border-b border-gray-200/60 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-700 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                UMSU
              </div>
              <span className="text-xs font-bold tracking-tight text-gray-900 dark:text-white">
                Sistem Bimbingan Skripsi UMSU
              </span>
            </div>

            <div className="flex items-center gap-2">
              {rawCurrentUser ? (
                <Link
                  href={isLecturerUser ? '/dashboard?tab=eventTypes' : '/dashboard'}
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-2xs transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{isLecturerUser ? 'Ke Dashboard Dosen' : 'Ke Dashboard Saya'}</span>
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href={`/login?redirect=${encodeURIComponent(redirectTargetUrl)}`}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-900/50 transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    href={`/register?redirect=${encodeURIComponent(redirectTargetUrl)}`}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-2xs transition-all"
                  >
                    Daftar Akun
                  </Link>
                </div>
              )}
            </div>
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

                <div className="flex flex-wrap gap-3 justify-center pt-2">
                  <Link
                    href="/mahasiswa/bookings"
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>Lihat Booking Saya di Dashboard</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setSelectedTimeSlot(null);
                    }}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 transition-all cursor-pointer"
                  >
                    Ajukan Sesi Lain
                  </button>
                </div>
              </div>
            ) : (
              <CalComBookingView
                availabilityRules={availabilityRules}
                eventType={eventType || undefined}
                myBookings={[]}
                lecturerName={lecturerName}
                onBookMeeting={async (date, timeSlot, notes, draftFile) => {
                  let uploadedFileName = draftFile?.name || null;
                  let uploadedFilePath: string | null = null;

                  if (draftFile) {
                    try {
                      const formData = new FormData();
                      formData.append('file', draftFile);

                      const uploadRes = await fetch('/bimbingan/upload-draft', {
                        method: 'POST',
                        headers: {
                          'X-Requested-With': 'XMLHttpRequest',
                          'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                        },
                        body: formData,
                      });

                      if (uploadRes.ok) {
                        const data = await uploadRes.json();
                        if (data.filePath) {
                          uploadedFileName = data.fileName || draftFile.name;
                          uploadedFilePath = data.filePath;
                        }
                      }
                    } catch (err) {
                      console.error('File upload error:', err);
                    }
                  }

                  const bookingPayload = {
                    id: `booking-${Date.now()}`,
                    studentId: rawCurrentUser?.id,
                    lecturerId: lecturer?.id,
                    eventTypeId: eventType?.id,
                    date: date,
                    timeSlot: timeSlot,
                    status: 'pending',
                    notes: notes || 'Konsultasi bimbingan skripsi',
                    draftFileName: uploadedFileName,
                    draftFilePath: uploadedFilePath,
                  };

                  try {
                    await fetch('/bimbingan/sync/bookings', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                      },
                      body: JSON.stringify({ bookings: [bookingPayload] }),
                    });
                    toast.success('Pengajuan bimbingan berhasil dikirim!');
                    setIsSuccess(true);
                  } catch (err) {
                    toast.success('Pengajuan bimbingan berhasil dikirim!');
                    setIsSuccess(true);
                  }
                }}
              />
            )}
          </div>
        </main>
      </div>
    </>
  );
}
