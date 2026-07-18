import { useEffect, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { DB } from '@/db';
import type { AppUser, SharedData, BreadcrumbItem } from '@/types';
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

export default function Dashboard() {
    const { auth } = usePage<SharedData>().props;
    const [appUser, setAppUser] = useState<AppUser | null>(null);
    const [tick, setTick] = useState(0);

    const refresh = () => setTick((t) => t + 1);

    useEffect(() => {
        if (!auth.user) return;

        // Cari user di DB berdasarkan email
        const users = DB.getUsers();
        let foundUser = users.find((u) => u.email.toLowerCase() === auth.user.email.toLowerCase());

        if (!foundUser) {
            // Tentukan default role berdasarkan email domain
            let role: 'admin' | 'lecturer' | 'student' | 'guest' = 'guest';
            
            const email = auth.user.email.toLowerCase();
            if (email.endsWith('@umsu.ac.id')) {
                if (email.includes('admin')) {
                    role = 'admin';
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
                isVerified: role !== 'guest',
                avatar: auth.user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
                department: role !== 'guest' ? 'Magister Ilmu Komunikasi' : undefined,
            };

            // Simpan ke list users di LocalStorage
            DB.saveUsers([...users, foundUser]);
        }

        // Sinkronisasi status active user di local storage mock database
        DB.setCurrentUser(foundUser);
        setAppUser(foundUser);
    }, [auth.user, tick]);

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard — Sistem Bimbingan Tesis UMSU" />

            <div className="py-6">
                {appUser.role === 'admin' && (
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
