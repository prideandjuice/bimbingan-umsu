import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { DB } from '@/db';
import type { AppUser, Guidance, Thesis, EventType, AvailabilityRule, AvailabilityRuleConfig, Booking } from '@/types';
import { toast } from 'sonner';

interface LecturerLogicOptions {
  currentUser: AppUser;
  onRefresh: () => void;
  propActiveTab?: string;
}

export function useLecturerLogic({ currentUser, onRefresh, propActiveTab }: LecturerLogicOptions) {
  const { url, props } = usePage<any>();

  // Backend Laravel DB States (from Inertia Props with fallback)
  const [theses, setTheses] = useState<Thesis[]>(props?.dbTheses?.length ? props.dbTheses : DB.getTheses());
  const [guidances, setGuidances] = useState<Guidance[]>(props?.dbGuidances?.length ? props.dbGuidances : DB.getGuidances());
  const [eventTypes, setEventTypes] = useState<EventType[]>(props?.dbEventTypes?.length ? props.dbEventTypes : DB.getEventTypes());
  const [availabilityRules, setAvailabilityRules] = useState<AvailabilityRule[]>(
    props?.dbAvailabilityRules?.length ? props.dbAvailabilityRules : DB.getAvailabilityRules()
  );
  const [bookings, setBookings] = useState<Booking[]>(props?.dbBookings?.length ? props.dbBookings : DB.getBookings());

  const [selectedThesisId, setSelectedThesisId] = useState<string | null>(null);

  // Determine active tab based on Controller prop or URL path fallback
  let activeTab: 'students' | 'eventTypes' | 'scheduling' | 'bookings' = 'students';
  if (propActiveTab && propActiveTab !== 'overview' && propActiveTab !== 'students') {
    if (propActiveTab === 'bookings' || propActiveTab === 'persetujuan-jadwal' || propActiveTab === 'permohonan-jadwal') {
      activeTab = 'bookings';
    } else if (propActiveTab === 'eventTypes' || propActiveTab === 'event-types' || propActiveTab === 'jenis-bimbingan' || propActiveTab === 'tipe-bimbingan') {
      activeTab = 'eventTypes';
    } else if (propActiveTab === 'scheduling' || propActiveTab === 'ketersediaan-waktu' || propActiveTab === 'atur-jadwal') {
      activeTab = 'scheduling';
    }
  } else if (url.includes('/dosen/persetujuan-jadwal') || url.includes('/dosen/permohonan-jadwal')) {
    activeTab = 'bookings';
  } else if (url.includes('/dosen/jenis-bimbingan') || url.includes('/dosen/event-types')) {
    activeTab = 'eventTypes';
  } else if (url.includes('/dosen/ketersediaan-waktu') || url.includes('/dosen/atur-jadwal')) {
    activeTab = 'scheduling';
  } else if (url.includes('/dosen/mahasiswa-bimbingan') || url.includes('/dosen/progres-mahasiswa') || url.includes('/dosen/verifikasi-log')) {
    activeTab = 'students';
  }

  const refreshLocalData = () => {
    setTheses(DB.getTheses());
    setGuidances(DB.getGuidances());
    setEventTypes(DB.getEventTypes());
    setAvailabilityRules(DB.getAvailabilityRules());
    setBookings(DB.getBookings());
    onRefresh();
  };

  // Data Derivasi
  const myStudents = theses.filter((t) => String(t.supervisorId) === String(currentUser.id) || t.supervisorId === 'user-lecturer-1');
  const myEventTypes = eventTypes.filter((et) => String(et.lecturerId) === String(currentUser.id) || et.lecturerId === 'user-lecturer-1');
  const myAvailabilities = availabilityRules.filter((ar) => String(ar.lecturerId) === String(currentUser.id) || ar.lecturerId === 'user-lecturer-1');
  const myBookings = bookings.filter((b) =>
    String(b.lecturerId) === String(currentUser.id) ||
    b.lecturerId === 'user-lecturer-1' ||
    (currentUser.role === 'lecturer' && (!b.lecturerName || b.lecturerName === currentUser.name))
  );

  // LOGIC FUNCTIONS
  const handleVerifyGuidance = (guidanceId: string) => {
    const targetGuidance = guidances.find((g) => g.id === guidanceId);
    const targetThesis = theses.find((t) => t.id === targetGuidance?.thesisId);

    if (!targetThesis?.skFile) {
      toast.error('Bimbingan belum dapat diverifikasi! Surat Keterangan (SK) Pembimbing belum diterbitkan oleh Admin.');
      return;
    }

    const updated = guidances.map((g) => (g.id === guidanceId ? { ...g, status: 'verified' as const } : g));
    DB.saveGuidances(updated);
    refreshLocalData();
    toast.success('Log bimbingan berhasil diverifikasi.');
  };

  const handleLecturerSubmitGuidance = (data: Omit<Guidance, 'id' | 'status' | 'createdBy' | 'creatorName' | 'createdAt'>) => {
    const targetThesis = theses.find((t) => t.id === data.thesisId);

    if (!targetThesis?.skFile) {
      toast.error('Gagal menambah bimbingan! Surat Keterangan (SK) Pembimbing belum diterbitkan oleh Admin.');
      return;
    }

    const newGuidance: Guidance = {
      ...data,
      id: `guidance-${Date.now()}`,
      createdBy: 'lecturer',
      creatorName: currentUser.name,
      status: 'verified',
      createdAt: new Date().toISOString(),
    };
    DB.saveGuidances([...guidances, newGuidance]);
    refreshLocalData();
    toast.success('Hasil bimbingan dosen berhasil dicatat.');
  };

  const handleProcessBookingSubmit = (bookingId: string, type: 'confirm' | 'reject', note: string) => {
    const targetBooking = bookings.find((b) => b.id === bookingId);
    if (type === 'confirm') {
      const studentThesis = theses.find(
        (t) => String(t.studentId) === String(targetBooking?.studentId) || t.studentNpm === targetBooking?.studentNpm
      );

      if (!studentThesis?.skFile) {
        toast.error('Tidak dapat mengonfirmasi janji temu: File SK Pembimbing mahasiswa ini belum diterbitkan oleh Admin.');
        return;
      }
    }

    const updated = bookings.map((b) =>
      b.id === bookingId ? { ...b, status: (type === 'confirm' ? 'confirmed' : 'rejected') as any, notes: note || undefined } : b
    );
    DB.saveBookings(updated);
    refreshLocalData();
    toast.success(type === 'confirm' ? 'Janji temu berhasil dikonfirmasi.' : 'Janji temu telah ditolak.');
  };

  const handleCompleteBooking = (id: string) => {
    const updated = bookings.map((b) => (b.id === id ? { ...b, status: 'completed' as const } : b));
    DB.saveBookings(updated);
    refreshLocalData();
  };

  const handleAddAvailability = (
    dayOfWeek: number,
    startTime: string,
    endTime: string,
    isDefault: boolean = false,
    rules?: AvailabilityRuleConfig
  ) => {
    const newAr: AvailabilityRule = {
      id: `ar-${Date.now()}`,
      lecturerId: currentUser.id,
      dayOfWeek,
      startTime,
      endTime,
      isDefault,
      rules,
    };
    setAvailabilityRules((prev) => {
      const scheduleName = rules?.sessionName?.trim();
      const updated = prev.map((ar) => {
        if (ar.lecturerId === currentUser.id && isDefault) {
          const arName = ar.name?.trim() || ar.rules?.sessionName?.trim();
          if (scheduleName && arName && arName.toLowerCase() === scheduleName.toLowerCase()) {
            return { ...ar, isDefault: true };
          } else {
            return { ...ar, isDefault: false };
          }
        }
        return ar;
      });
      updated.unshift(newAr);
      DB.saveAvailabilityRules(updated);
      return updated;
    });
    onRefresh();
  };

  const handleUpdateAvailability = (id: string, updatedRule: Partial<AvailabilityRule>) => {
    setAvailabilityRules((prev) => {
      const updated = prev.map((ar) => (ar.id === id ? { ...ar, ...updatedRule } : ar));
      DB.saveAvailabilityRules(updated);
      return updated;
    });
    onRefresh();
  };

  const handleToggleDefaultAvailability = (id: string) => {
    setAvailabilityRules((prev) => {
      const target = prev.find((ar) => ar.id === id);
      const nextDefault = !target?.isDefault;

      const updated = prev.map((ar) => {
        if (ar.lecturerId !== currentUser.id) return ar;
        if (ar.id === id) return { ...ar, isDefault: nextDefault };
        return nextDefault ? { ...ar, isDefault: false } : ar;
      });
      DB.saveAvailabilityRules(updated);
      return updated;
    });
    onRefresh();
  };

  const handleDeleteAvailability = (id: string | string[]) => {
    const idsToDelete = Array.isArray(id) ? id : [id];
    setAvailabilityRules((prev) => {
      const updated = prev.filter((ar) => !idsToDelete.includes(ar.id));
      DB.saveAvailabilityRules(updated);
      return updated;
    });
    onRefresh();
  };

  const handleSetAllAvailabilities = (newRules: AvailabilityRule[]) => {
    setAvailabilityRules((prev) => {
      const otherUsersRules = prev.filter(
        (ar) => String(ar.lecturerId) !== String(currentUser.id) && ar.lecturerId !== 'user-lecturer-1'
      );
      const updated = [...newRules, ...otherUsersRules];
      DB.saveAvailabilityRules(updated);
      return updated;
    });
    onRefresh();
  };

  const handleAddEventType = (
    name: string,
    duration: number,
    description: string,
    availabilityId?: string,
    locationType?: 'offline' | 'online',
    locationDetails?: string,
    maxQuotaPerSession: number = 5
  ) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newEt: EventType = {
      id: `et-${Date.now()}`,
      lecturerId: currentUser.id,
      availabilityId: availabilityId || undefined,
      name,
      slug,
      duration,
      maxQuotaPerSession,
      description,
      locationType: locationType || 'offline',
      locationDetails: locationDetails || 'Ruang Dosen / Google Meet UMSU',
    };
    setEventTypes((prev) => {
      const updated = [...prev, newEt];
      DB.saveEventTypes(updated);
      return updated;
    });

    setAvailabilityRules((prev) => {
      const updatedRules = prev.map((ar) => ({
        ...ar,
        rules: {
          ...ar.rules,
          maxQuotaPerSession: maxQuotaPerSession,
        },
      }));
      DB.saveAvailabilityRules(updatedRules);
      return updatedRules;
    });

    onRefresh();
    toast.success('Jenis Bimbingan baru berhasil ditambahkan!');
  };

  const handleUpdateEventType = (id: string, updatedEt: Partial<EventType>) => {
    setEventTypes((prev) => {
      const updated = prev.map((et) => {
        if (et.id === id) {
          const nextName = updatedEt.name !== undefined ? updatedEt.name : et.name;
          const slug = nextName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
          return { ...et, ...updatedEt, slug };
        }
        return et;
      });
      DB.saveEventTypes(updated);
      return updated;
    });

    if (updatedEt.maxQuotaPerSession !== undefined) {
      setAvailabilityRules((prev) => {
        const updatedRules = prev.map((ar) => ({
          ...ar,
          rules: {
            ...ar.rules,
            maxQuotaPerSession: updatedEt.maxQuotaPerSession,
          },
        }));
        DB.saveAvailabilityRules(updatedRules);
        return updatedRules;
      });
    }

    onRefresh();
    toast.success('Jenis Bimbingan berhasil diperbarui!');
  };

  const handleDeleteEventType = (id: string) => {
    setEventTypes((prev) => {
      const updated = prev.filter((et) => et.id !== id);
      DB.saveEventTypes(updated);
      return updated;
    });
    onRefresh();
    toast.success('Jenis Bimbingan berhasil dihapus.');
  };

  return {
    activeTab,
    myStudents,
    myEventTypes,
    myAvailabilities,
    myBookings,
    guidances,
    selectedThesisId,
    setSelectedThesisId,
    handleVerifyGuidance,
    handleLecturerSubmitGuidance,
    handleProcessBookingSubmit,
    handleCompleteBooking,
    handleAddAvailability,
    handleSetAllAvailabilities,
    handleUpdateAvailability,
    handleToggleDefaultAvailability,
    handleDeleteAvailability,
    handleAddEventType,
    handleUpdateEventType,
    handleDeleteEventType,
  };
}
