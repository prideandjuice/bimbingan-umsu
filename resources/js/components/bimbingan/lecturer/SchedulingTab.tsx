// components/bimbingan/lecturer/SchedulingTab.tsx
import { useState } from 'react';
import { Plus, Clock, Trash2 } from 'lucide-react';
import type { AvailabilityRule, EventType } from '@/types';

interface SchedulingTabProps {
  myEventTypes: EventType[];
  myAvailabilities: AvailabilityRule[];
  handleAddEventType: (name: string, duration: number, desc: string) => void;
  handleDeleteEventType: (id: string) => void;
  handleAddAvailability: (dayOfWeek: number, startTime: string, endTime: string) => void;
  handleDeleteAvailability: (id: string) => void;
}

export default function SchedulingTab({
  myEventTypes,
  myAvailabilities,
  handleAddEventType,
  handleDeleteEventType,
  handleAddAvailability,
  handleDeleteAvailability,
}: SchedulingTabProps) {
  // State form pindah ke sini
  const [newEtName, setNewEtName] = useState('');
  const [newEtDuration, setNewEtDuration] = useState(30);
  const [newEtDesc, setNewEtDesc] = useState('');
  const [newDay, setNewDay] = useState<number>(1);
  const [newStartTime, setNewStartTime] = useState('09:00');
  const [newEndTime, setNewEndTime] = useState('12:00');

  // Lakukan handle internal submit untuk membungkus props callback
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Pindahkan sisi kiri (Tipe Sesi) & sisi kanan (Kalender) ke sini */}
    </div>
  );
}