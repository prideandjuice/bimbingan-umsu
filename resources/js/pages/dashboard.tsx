import { useEffect, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { DB } from '@/db';
import type { AppUser, SharedData, BreadcrumbItem, Proposal, ProposalTitle, Thesis, Guidance, EventType, AvailabilityRule, Booking } from '@/types';
import AppLayout from '@/layouts/app-layout';

import AdminDashboard from '@/components/bimbingan/admindashboard';
import GuestDashboard from '@/components/bimbingan/guestdashboard';
import LecturerDashboard from '@/components/bimbingan/lecturedashboard';
import StudentDashboard from '@/components/bimbingan/studentdashboard';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DashboardProps {
    dbUsers?: AppUser[];
    dbProposals?: Proposal[];
    dbProposalTitles?: ProposalTitle[];
    dbTheses?: Thesis[];
    dbGuidances?: Guidance[];
    dbEventTypes?: EventType[];
    dbAvailabilityRules?: AvailabilityRule[];
    dbBookings?: Booking[];
}

export default function Dashboard({
    dbUsers = [],
    dbProposals = [],
    dbProposalTitles = [],
    dbTheses = [],
    dbGuidances = [],
    dbEventTypes = [],
    dbAvailabilityRules = [],
    dbBookings = []
}: DashboardProps) {
    const { auth } = usePage<SharedData>().props;
    const [appUser, setAppUser] = useState<AppUser | null>(null);
    const [tick, setTick] = useState(0);

    const refresh = () => setTick((t) => t + 1);

    // Sync database data into mock DB on load or change
    useEffect(() => {
        DB.saveUsers(dbUsers);
        DB.saveProposals(dbProposals);
        DB.saveProposalTitles(dbProposalTitles);
        DB.saveTheses(dbTheses);
        DB.saveGuidances(dbGuidances);
        DB.saveEventTypes(dbEventTypes);
        DB.saveAvailabilityRules(dbAvailabilityRules);
        DB.saveBookings(dbBookings);
    }, [dbUsers, dbProposals, dbProposalTitles, dbTheses, dbGuidances, dbEventTypes, dbAvailabilityRules, dbBookings]);

    useEffect(() => {
        if (!auth.user) return;

        // Cari user di DB berdasarkan email
        const users = DB.getUsers();
        let foundUser = users.find((u) => u.email.toLowerCase() === auth.user.email.toLowerCase());

        const backendIsVerified = auth.user.is_verified ?? false;
        const backendRole = (auth.user.roles && auth.user.roles.length > 0) ? auth.user.roles[0] : 'student';

        if (!foundUser) {
            // Tentukan default role berdasarkan email domain (default: student)
            let role: 'admin' | 'prodi' | 'lecturer' | 'student' | 'guest' = backendRole as any;
            
            if (role === 'guest' && auth.user.email.toLowerCase().endsWith('@umsu.ac.id')) {
                const email = auth.user.email.toLowerCase();
                if (email.includes('admin')) {
                    role = 'admin';
                } else if (email.includes('prodi') || email.includes('kaprodi')) {
                    role = 'prodi';
                } else if (email.includes('lecturer') || email.includes('dosen') || email.includes('irwan')) {
                    role = 'lecturer';
                } else {
                    role = 'student';
                }
            }

            foundUser = {
                id: `user-${Date.now()}`,
                name: auth.user.name,
                email: auth.user.email,
                role: role,
                isVerified: backendIsVerified,
                avatar: auth.user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
                department: 'Magister Ilmu Komunikasi',
            };

            // Simpan ke list users di LocalStorage
            DB.saveUsers([...users, foundUser]);
        } else {
            // Sinkronisasi status jika berbeda dengan backend
            if (foundUser.isVerified !== backendIsVerified || foundUser.role !== backendRole) {
                foundUser = {
                    ...foundUser,
                    role: backendRole as any,
                    isVerified: backendIsVerified,
                };
                const updatedUsers = users.map((u) => (u.email.toLowerCase() === foundUser!.email.toLowerCase() ? foundUser! : u));
                DB.saveUsers(updatedUsers);
            }
        }

        // Sinkronisasi status active user di local storage mock database
        DB.setCurrentUser(foundUser);
        setAppUser(foundUser);
    }, [auth.user, tick, dbUsers]);

    if (!appUser) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Memuat Dashboard..." />
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700"></div>
                </div>
            </AppLayout>
        );
    }

    if (!appUser.isVerified) {
        return (
            <div className="min-h-screen bg-gradient-to-tr from-slate-50 to-emerald-50/20 dark:from-zinc-950 dark:to-zinc-900 flex items-center justify-center p-4">
                <Head title="Menunggu Verifikasi — Sistem Bimbingan Skripsi UMSU" />
                <GuestDashboard currentUser={appUser} onRefresh={refresh} />
            </div>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard — Sistem Bimbingan Skripsi UMSU" />

            <div className="max-w-7xl mx-auto px-4 py-8 w-full">
                {(appUser.role === 'admin' || appUser.role === 'prodi') && (
                    <AdminDashboard currentUser={appUser} onRefresh={refresh} />
                )}
                {appUser.role === 'lecturer' && (
                    <LecturerDashboard currentUser={appUser} onRefresh={refresh} />
                )}
                {appUser.role === 'student' && (
                    <StudentDashboard currentUser={appUser} onRefresh={refresh} />
                )}
                {appUser.role === 'guest' && (
                    <GuestDashboard currentUser={appUser} onRefresh={refresh} />
                )}
            </div>
        </AppLayout>
    );
}
