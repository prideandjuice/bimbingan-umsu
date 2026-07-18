// components/bimbingan/lecturer/BookingsTab.tsx
import { useState } from 'react';
import { Calendar } from 'lucide-react';
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
  const [actionBookingId, setActionBookingId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'confirm' | 'reject' | null>(null);
  const [actionNote, setActionNote] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionBookingId || !actionType) return;
    handleProcessBookingSubmit(actionBookingId, actionType, actionNote);
    setActionBookingId(null);
    setActionType(null);
    setActionNote('');
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
      {/* Pindahkan Form Overlay action & List mapping myBookings ke sini */}
    </div>
  );
}