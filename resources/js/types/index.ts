import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
    sidebar?: any[];
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    items?: NavItem[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    permissions?: string[];
    roles?: string[];
    [key: string]: unknown;
}

// ─── Domain Types ────────────────────────────────────────────────────────────

export type UserRole = 'superadmin' | 'admin' | 'prodi' | 'student' | 'mahasiswa' | 'lecturer' | 'dosen' | 'guest';

export interface AppUser {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: UserRole;
    npm?: string;
    nidn?: string;
    department?: string;
    isVerified?: boolean;
}

export interface Proposal {
    id: string;
    studentId: string;
    studentName: string;
    studentNpm: string;
    prodi: string;
    abstract: string;
    status: 'pending' | 'processed' | 'rejected';
    createdAt: string;
}

export interface ProposalTitle {
    id: string;
    proposalId: string;
    title: string;
    abstract?: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    notes?: string;
    skFile?: string;
}

export interface Thesis {
    id: string;
    proposalId?: string;
    title: string;
    studentId: string;
    studentName: string;
    studentNpm: string;
    department?: string;
    supervisorId: string | null;
    supervisorName: string | null;
    status: 'pending_supervisor' | 'pending_sk' | 'in_progress' | 'completed' | 'ACTIVE';
    createdAt?: string;
    skFile?: string;
}

export interface Guidance {
    id: string;
    thesisId: string;
    date: string;
    notes: string;
    revisions?: string;
    progress: number;
    createdBy: 'student' | 'lecturer';
    creatorName: string;
    status: 'pending_verification' | 'verified';
    createdAt: string;
    bookingId?: string;
    draftFileName?: string | null;
    draftFilePath?: string | null;
    annotations?: any;
}

export interface EventType {
    id: string;
    availabilityId?: string;
    lecturerId: string;
    name: string;
    slug?: string;
    duration: number;
    maxQuotaPerSession?: number;
    description?: string;
    locationType?: 'offline' | 'online';
    locationDetails?: string;
}

export interface AvailabilityRuleConfig {
    sessionName?: string;
    maxQuotaPerSession?: number;
    maxQuotaTotal?: number;
    sessionDurationMinutes?: number;
    [key: string]: any;
}

export interface AvailabilityRule {
    id: string;
    availabilityId?: string;
    lecturerId: string;
    name?: string;
    slug?: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isDefault?: boolean;
    rules?: AvailabilityRuleConfig;
}

export interface PdfAnnotation {
    id: string;
    page: number;
    x: number;
    y: number;
    type: 'highlight' | 'sticky_note' | 'text';
    content: string;
    color?: string;
    authorName?: string;
    createdAt?: string;
}

export interface Booking {
    id: string;
    thesisId: string;
    studentId: string;
    studentName: string;
    studentNpm: string;
    lecturerId: string;
    lecturerName: string;
    eventTypeId: string;
    eventTypeName: string;
    date: string;
    timeSlot: string;
    status: 'pending' | 'confirmed' | 'approved' | 'rejected' | 'completed' | 'cancelled';
    notes?: string;
    rejectionReason?: string;
    draftFileName?: string | null;
    draftFilePath?: string | null;
    annotations?: any;
    createdAt: string;
}

