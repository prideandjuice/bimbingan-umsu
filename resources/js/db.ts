/**
 * db.ts — Mock localStorage database
 * Menggantikan `../db` dari project asal agar kompatibel dengan project ini.
 */

import type { AppUser, Proposal, ProposalTitle, Thesis, Guidance, EventType, AvailabilityRule, Booking } from '@/types';
import axios from 'axios';

// Naikkan versi ini setiap kali seed data berubah → localStorage lama otomatis dihapus
const DB_VERSION = '7';
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
        name: 'Super Admin',
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

const SEED_PROPOSALS: Proposal[] = [
    {
        id: 'prop-demo-1',
        studentId: 'user-student-1',
        studentName: 'Mahasiswa Demo',
        studentNpm: '2210000001',
        department: 'Magister Ilmu Komunikasi',
        abstract: 'Analisis strategi komunikasi digital dalam meningkatkan brand awareness dan keterlibatan publik pada institusi akademis.',
        status: 'pending',
        createdAt: new Date().toISOString(),
    },
];

const SEED_PROPOSAL_TITLES: ProposalTitle[] = [
    {
        id: 'title-demo-1',
        proposalId: 'prop-demo-1',
        title: 'Strategi Komunikasi Digital Kampus dalam Era Transformasi Teknologi Informasi',
        abstract: 'Penelitian ini berfokus pada analisis strategi komunikasi pemasaran digital yang diterapkan oleh institusi pendidikan tinggi dalam membangun brand equity dan meningkatkan interaksi publik di media sosial.',
        status: 'PENDING',
    },
    {
        id: 'title-demo-2',
        proposalId: 'prop-demo-1',
        title: 'Analisis Pola Komunikasi Organisasi pada Manajemen Pelayanan Akademik Publik',
        abstract: 'Studi ini meneliti efektivitas aliran informasi internal antara dosen, tenaga kependidikan, dan mahasiswa dalam mengoptimalkan kualitas pelayanan akademik berbasis sistem digital.',
        status: 'PENDING',
    },
    {
        id: 'title-demo-3',
        proposalId: 'prop-demo-1',
        title: 'Pengaruh Media Sosial Instagram terhadap Persepsi Reputasi Lembaga Akademik',
        abstract: 'Penelitian kuantitatif yang menguji korelasi antara intensitas publikasi konten edukatif di Instagram dengan persepsi keunggulan reputasi institusi di mata mahasiswa baru.',
        status: 'PENDING',
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
    if (!localStorage.getItem(KEYS.eventTypes)) set(KEYS.eventTypes, []);
    if (!localStorage.getItem(KEYS.availabilityRules)) set(KEYS.availabilityRules, []);
    if (!localStorage.getItem(KEYS.bookings)) set(KEYS.bookings, []);
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
    getEventTypes: (): EventType[] => get<EventType[]>(KEYS.eventTypes, []),
    saveEventTypes: (types: EventType[]): void => {
        set(KEYS.eventTypes, types);
        axios.post('/bimbingan/sync/event-types', { eventTypes: types }).catch(err => console.error(err));
    },

    // Availability Rules
    getAvailabilityRules: (): AvailabilityRule[] => get<AvailabilityRule[]>(KEYS.availabilityRules, []),
    saveAvailabilityRules: (rules: AvailabilityRule[]): void => {
        set(KEYS.availabilityRules, rules);
        axios.post('/bimbingan/sync/availability-rules', { availabilityRules: rules }).catch(err => console.error(err));
    },

    // Bookings
    getBookings: (): Booking[] => get<Booking[]>(KEYS.bookings, []),
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
