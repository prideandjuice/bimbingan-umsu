// components/bimbingan/student/ThesisActiveLayout.tsx
import { useState } from 'react';
import { AlertCircle, Plus, History, CheckCircle2, Clock, Calendar, Send } from 'lucide-react';
import type { AppUser, Thesis, Guidance, Booking, EventType, AvailabilityRule, Proposal } from '@/types';

interface ThesisActiveLayoutProps {
  currentUser: AppUser;
  myThesis: Thesis;
  proposals: Proposal[];
  myGuidances: Guidance[];
  myBookings: Booking[];
  mySupervisorEventTypes: EventType[];
  mySupervisorAvailability: AvailabilityRule[];
  currentProgress: number;
  handleSubmitGuidance: (date: string, notes: string, revisions: string, progress: number) => void;
  handleBookMeeting: (eventTypeId: string, date: string, slot: string, notes: string) => void;
}

export default function ThesisActiveLayout({
  currentUser,
  myThesis,
  proposals,
  myGuidances,
  myBookings,
  mySupervisorEventTypes,
  mySupervisorAvailability,
  currentProgress,
  handleSubmitGuidance,
  handleBookMeeting,
}: ThesisActiveLayoutProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'guidances' | 'bookings'>('info');

  // Form States pindah ke sini agar tidak mengotori file induk utama
  const [gDate, setGDate] = useState(new Date().toISOString().split('T')[0]);
  const [gNotes, setGNotes] = useState('');
  const [gRevisions, setGRevisions] = useState('');
  const [gProgress, setGProgress] = useState<number>(10);
  const [showAddGuidance, setShowAddGuidance] = useState(false);

  const [selectedEventTypeId, setSelectedEventTypeId] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingSlot, setBookingSlot] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');

  // Sediakan handler internal untuk membungkus pengiriman parameter form ke props callback
  return (
    <div className="lg:col-span-8 space-y-6">
      {/* Pindahkan Header Banner Tesis, Navigasi Sub-Tab, dan konten masing-masing tab (info, log bimbingan, booking form) ke sini */}
    </div>
  );
}