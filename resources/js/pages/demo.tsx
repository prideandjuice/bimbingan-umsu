import { useCallback, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { GraduationCap } from 'lucide-react';

import { DB } from '@/db';
import type { AppUser } from '@/types';
import AdminDashboard from '@/components/bimbingan/admindashboard';
import GuestDashboard from '@/components/bimbingan/guestdashboard';
import LecturerDashboard from '@/components/bimbingan/lecturedashboard';
import StudentDashboard from '@/components/bimbingan/studentdashboard';

const DEMO_USERS: { label: string; userId: string; role: string; color: string }[] = [
    { label: 'Super Admin',          userId: 'user-admin-1',    role: 'admin',    color: 'bg-red-700'     },
    { label: 'Program Studi (Prodi)',userId: 'user-prodi-1',    role: 'prodi',    color: 'bg-emerald-700' },
    { label: 'Prof. Irwan (Dosen)',  userId: 'user-lecturer-1', role: 'lecturer', color: 'bg-blue-700'    },
    { label: 'Rizky (Mahasiswa)',    userId: 'user-student-1',  role: 'student',  color: 'bg-violet-700'  },
    { label: 'Budi (Tamu)',          userId: 'user-guest-1',    role: 'guest',    color: 'bg-amber-600'   },
];

function DashboardView({ user, onRefresh }: { user: AppUser; onRefresh: () => void }) {
    if (user.role === 'admin' || user.role === 'prodi') {
        return <AdminDashboard currentUser={user} onRefresh={onRefresh} />;
    }
    if (user.role === 'lecturer') return <LecturerDashboard currentUser={user} onRefresh={onRefresh} />;
    if (user.role === 'student')  return <StudentDashboard  currentUser={user} onRefresh={onRefresh} />;
    return <GuestDashboard currentUser={user} onRefresh={onRefresh} />;
}

export default function Demo() {
    const [activeUser, setActiveUser] = useState<AppUser>(() => {
        // default: admin
        const users = DB.getUsers();
        return users.find(u => u.id === 'user-admin-1') ?? users[0];
    });
    const [tick, setTick] = useState(0);

    const refresh = useCallback(() => setTick(t => t + 1), []);

    const switchUser = (userId: string) => {
        const found = DB.getUsers().find(u => u.id === userId);
        if (!found) return;
        DB.setCurrentUser(found);
        setActiveUser(found);
    };

    return (
        <>
            <Head title="Demo — Sistem Bimbingan Tesis UMSU" />

            <div className="min-h-screen bg-gray-50 flex flex-col">

                {/* ── Demo Control Panel (sticky hijau) ── */}
                <div className="sticky top-0 z-50 bg-emerald-800 shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">

                        {/* Logo + back */}
                        <Link
                            href={route('home')}
                            className="flex items-center gap-2 text-emerald-300 hover:text-white transition-colors shrink-0 mr-2"
                        >
                            <div className="w-7 h-7 bg-emerald-700 rounded-lg flex items-center justify-center">
                                <GraduationCap className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-xs font-bold hidden sm:inline">← Kembali</span>
                        </Link>

                        <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider shrink-0">
                            🎮 Tampilkan sebagai:
                        </span>

                        {/* Role switcher buttons */}
                        <div className="flex flex-wrap gap-2 flex-1">
                            {DEMO_USERS.map(u => {
                                const isActive = activeUser.id === u.userId;
                                return (
                                    <button
                                        key={u.userId}
                                        onClick={() => switchUser(u.userId)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border
                                            ${isActive
                                                ? 'bg-white text-gray-900 border-white shadow-md scale-105'
                                                : 'bg-emerald-700/60 hover:bg-emerald-700 text-emerald-100 border-emerald-600'
                                            }`}
                                    >
                                        <span className={`w-2 h-2 rounded-full shrink-0 ${u.color}`} />
                                        {u.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Active badge */}
                        <div className="hidden md:flex items-center gap-2 shrink-0 bg-emerald-900/50 px-3 py-1.5 rounded-lg">
                            <span className="text-emerald-400 text-xs">Aktif:</span>
                            <span className="text-white text-xs font-bold">{activeUser.name}</span>
                            <span className={`text-xs font-bold text-white px-2 py-0.5 rounded-full uppercase
                                ${activeUser.role === 'admin'    ? 'bg-red-600'     :
                                  activeUser.role === 'prodi'    ? 'bg-emerald-600' :
                                  activeUser.role === 'lecturer' ? 'bg-blue-600'    :
                                  activeUser.role === 'student'  ? 'bg-violet-600'  :
                                                                   'bg-amber-500'   }`}>
                                {activeUser.role}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Dashboard Area ── */}
                <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-8" key={`${activeUser.id}-${tick}`}>
                    <DashboardView user={activeUser} onRefresh={refresh} />
                </div>

            </div>
        </>
    );
}
