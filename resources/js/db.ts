/**
 * db.ts — Mock localStorage database
 * Menggantikan `../db` dari project asal agar kompatibel dengan project ini.
 */

import type { AppUser, Proposal, ProposalTitle, Thesis, Guidance, EventType, AvailabilityRule, Booking } from '@/types';
import axios from 'axios';

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Naikkan versi ini setiap kali seed data berubah → localStorage lama otomatis dihapus
const DB_VERSION = '16';
const VERSION_KEY = 'db_version';


const KEYS = {
    users: 'db_users',
    proposals: 'db_proposals',
    proposalTitles: 'db_proposal_titles',
    theses: 'db_theses',
    guidances: 'db_guidances',
    eventTypes: 'db_event_types',
    availabilityRules: 'db_availability_rules',
    bookings: 'db_bookings',
    currentUser: 'db_current_user',
} as const;

function get<T>(key: string, fallback: T): T {
    try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
        return fallback;
    }
}

function set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
}

// ─── Seed data ────────────────────────────────────────────────────────────────

const SEED_USERS: AppUser[] = [
    {
        id: 'user-admin-1',
        name: 'Admin UMSU',
        email: 'admin@umsu.ac.id',
        role: 'admin',
        isVerified: true,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
    },
    {
        id: 'user-prodi-1',
        name: 'Dr. Prodi Kaprodi',
        email: 'prodi@umsu.ac.id',
        role: 'prodi',
        department: 'Magister Ilmu Komunikasi',
        isVerified: true,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
    },
    {
        id: 'user-lecturer-1',
        name: 'Prof. Dr. Irwan, M.Si',
        email: 'irwan@umsu.ac.id',
        role: 'lecturer',
        nidn: '0012345678',
        department: 'Magister Ilmu Komunikasi',
        isVerified: true,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    },
    {
        id: 'user-student-1',
        name: 'Mahasiswa Demo',
        email: 'mahasiswa@umsu.ac.id',
        role: 'student',
        npm: '2210000001',
        department: 'Magister Ilmu Komunikasi',
        isVerified: true,
        avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100',
    },
    {
        id: 'user-guest-1',
        name: 'Tamu Baru',
        email: 'tamu@gmail.com',
        role: 'guest',
        isVerified: false,
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100',
    },
];

const SEED_PROPOSALS: Proposal[] = [];

const SEED_PROPOSAL_TITLES: ProposalTitle[] = [];

const SEED_EVENT_TYPES: EventType[] = [
    {
        id: 'et-1',
        availabilityId: 'ar-1',
        lecturerId: 'user-lecturer-1',
        name: 'Konsultasi Bimbingan Proposal',
        slug: 'bimbingan-proposal',
        duration: 30,
        description: 'Sesi review draft proposal skripsi dan perumusan latar belakang masalah.',
    },
    {
        id: 'et-2',
        availabilityId: 'ar-2',
        lecturerId: 'user-lecturer-1',
        name: 'Review Bab IV & V (Hasil & Pembahasan)',
        slug: 'review-bab-4-5',
        duration: 45,
        description: 'Sesi evaluasi mendalam hasil analisa data dan pembahasan sebelum Ujian Skripsi.',
    },
    {
        id: 'et-3',
        availabilityId: 'ar-1',
        lecturerId: 'user-lecturer-1',
        name: 'Persetujuan Sidang Skripsi',
        slug: 'persetujuan-sidang',
        duration: 20,
        description: 'Verifikasi kelengkapan berkas skripsi akhir dan tanda tangan persetujuan sidang.',
    },
];

const SEED_AVAILABILITY_RULES: AvailabilityRule[] = [
    {
        id: 'ar-1',
        availabilityId: 'ar-1',
        lecturerId: 'user-lecturer-1',
        name: 'Jadwal Rutin Pagi (Senin)',
        slug: 'jadwal-rutin-pagi',
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '12:00',
        isDefault: true,
        rules: {
            sessionName: 'Sesi Pagi',
            maxQuotaPerSession: 5,
            maxQuotaTotal: 20,
            sessionDurationMinutes: 30,
        },
    },
    {
        id: 'ar-2',
        availabilityId: 'ar-2',
        lecturerId: 'user-lecturer-1',
        name: 'Jadwal Siang (Rabu)',
        slug: 'jadwal-siang',
        dayOfWeek: 3,
        startTime: '13:00',
        endTime: '16:00',
        isDefault: false,
        rules: {
            sessionName: 'Sesi Siang',
            maxQuotaPerSession: 5,
            maxQuotaTotal: 20,
            sessionDurationMinutes: 45,
        },
    },
    {
        id: 'ar-3',
        availabilityId: 'ar-3',
        lecturerId: 'user-lecturer-1',
        name: 'Jadwal Khusus (Jumat)',
        slug: 'jadwal-khusus',
        dayOfWeek: 5,
        startTime: '09:00',
        endTime: '11:30',
        isDefault: false,
        rules: {
            sessionName: 'Sesi Khusus',
            maxQuotaPerSession: 3,
            maxQuotaTotal: 10,
            sessionDurationMinutes: 30,
        },
    },
];

const SEED_BOOKINGS: Booking[] = [
    {
        id: 'booking-seed-1',
        thesisId: 'thesis-1',
        studentId: 'user-student-1',
        studentName: 'Mahasiswa Demo',
        studentNpm: '2210000001',
        lecturerId: 'user-lecturer-1',
        lecturerName: 'Prof. Dr. Irwan, M.Si',
        eventTypeId: 'et-1',
        eventTypeName: 'Konsultasi Bimbingan Proposal',
        date: '2026-08-10',
        timeSlot: '09:00 - 09:30 WIB',
        status: 'confirmed',
        notes: 'Mohon review Bab 1 & Bab 2 pak, sudah saya sesuaikan dengan pedoman.',
        draftFileName: 'Draft_Skripsi_Bab_1_2_Demo.pdf',
        draftFilePath: '/storage/drafts/draft_1785913976_6a72e27852272.pdf',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'booking-seed-2',
        thesisId: 'thesis-2',
        studentId: 'user-student-1',
        studentName: 'Budi Santoso',
        studentNpm: '2210000002',
        lecturerId: 'user-lecturer-1',
        lecturerName: 'Prof. Dr. Irwan, M.Si',
        eventTypeId: 'et-2',
        eventTypeName: 'Review Bab IV & V (Hasil & Pembahasan)',
        date: '2026-08-12',
        timeSlot: '13:00 - 13:45 WIB',
        status: 'pending',
        notes: 'Pengajuan jadwal bimbingan hasil pembahasan data.',
        draftFileName: 'Draft_Bab_4_Hasil.pdf',
        draftFilePath: '/storage/drafts/pdf_65404.pdf',
        createdAt: new Date().toISOString(),
    },
];


function seedIfEmpty(): void {
    if (!localStorage.getItem(KEYS.users)) {
        set(KEYS.users, SEED_USERS);
    }
    if (!localStorage.getItem(KEYS.currentUser)) {
        set(KEYS.currentUser, SEED_USERS[0]);
    }
    if (!localStorage.getItem(KEYS.proposals)) set(KEYS.proposals, SEED_PROPOSALS);
    if (!localStorage.getItem(KEYS.proposalTitles)) set(KEYS.proposalTitles, SEED_PROPOSAL_TITLES);
    if (!localStorage.getItem(KEYS.theses)) set(KEYS.theses, []);
    if (!localStorage.getItem(KEYS.guidances)) set(KEYS.guidances, []);
    if (!localStorage.getItem(KEYS.eventTypes)) set(KEYS.eventTypes, SEED_EVENT_TYPES);
    if (!localStorage.getItem(KEYS.availabilityRules)) set(KEYS.availabilityRules, SEED_AVAILABILITY_RULES);
    if (!localStorage.getItem(KEYS.bookings)) set(KEYS.bookings, SEED_BOOKINGS);
}

// Jika versi DB berbeda → hapus semua data lama lalu seed ulang
if (localStorage.getItem(VERSION_KEY) !== DB_VERSION) {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
    localStorage.removeItem(VERSION_KEY);
}

// Run seed on module load
seedIfEmpty();
localStorage.setItem(VERSION_KEY, DB_VERSION);

// ─── DB API ───────────────────────────────────────────────────────────────────

export const DB = {
    // Users
    getUsers: (): AppUser[] => get<AppUser[]>(KEYS.users, SEED_USERS),
    saveUsers: (users: AppUser[]): void => {
        set(KEYS.users, users);
        axios.post('/bimbingan/sync/users', { users }).catch(err => console.error(err));
    },

    // Current User
    getCurrentUser: (): AppUser => get<AppUser>(KEYS.currentUser, SEED_USERS[0]),
    setCurrentUser: (user: AppUser): void => set(KEYS.currentUser, user),

    // Proposals
    getProposals: (): Proposal[] => get<Proposal[]>(KEYS.proposals, []),
    saveProposals: (proposals: Proposal[]): void => {
        set(KEYS.proposals, proposals);
        axios.post('/bimbingan/sync/proposals', { proposals }).catch(err => console.error(err));
    },

    // Proposal Titles
    getProposalTitles: (): ProposalTitle[] => get<ProposalTitle[]>(KEYS.proposalTitles, []),
    saveProposalTitles: (titles: ProposalTitle[]): void => {
        set(KEYS.proposalTitles, titles);
        axios.post('/bimbingan/sync/proposal-titles', { proposalTitles: titles }).catch(err => console.error(err));
    },

    // Theses
    getTheses: (): Thesis[] => get<Thesis[]>(KEYS.theses, []),
    saveTheses: (theses: Thesis[]): void => {
        set(KEYS.theses, theses);
        axios.post('/bimbingan/sync/theses', { theses }).catch(err => console.error(err));
    },

    // Guidances
    getGuidances: (): Guidance[] => get<Guidance[]>(KEYS.guidances, []),
    saveGuidances: (guidances: Guidance[]): void => {
        set(KEYS.guidances, guidances);
        axios.post('/bimbingan/sync/guidances', { guidances }).catch(err => console.error(err));
    },

    // Event Types
    getEventTypes: (): EventType[] => get<EventType[]>(KEYS.eventTypes, SEED_EVENT_TYPES),
    saveEventTypes: (types: EventType[]): void => {
        set(KEYS.eventTypes, types);
        axios.post('/bimbingan/sync/event-types', { eventTypes: types }).catch(err => console.error(err));
    },

    // Availability Rules
    getAvailabilityRules: (): AvailabilityRule[] => get<AvailabilityRule[]>(KEYS.availabilityRules, SEED_AVAILABILITY_RULES),
    saveAvailabilityRules: (rules: AvailabilityRule[]): void => {
        set(KEYS.availabilityRules, rules);
        axios.post('/bimbingan/sync/availability-rules', { availabilityRules: rules }).catch(err => console.error(err));
    },

    // Bookings
    getBookings: (): Booking[] => {
        const list = get<Booking[]>(KEYS.bookings, SEED_BOOKINGS);
        return list.filter((b) => b && b.id && !String(b.id).includes('1785809987024') && !String(b.id).includes('1785819221985'));
    },
    saveBookings: (bookings: Booking[]): void => {
        set(KEYS.bookings, bookings);
        axios.post('/bimbingan/sync/bookings', { bookings }).catch(err => console.error(err));
    },

    // Reset all data
    reset: (): void => {
        Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
        seedIfEmpty();
    },
};
