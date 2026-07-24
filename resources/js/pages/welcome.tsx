import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { BookOpen, Calendar, GraduationCap, ShieldCheck, Users } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Sistem Bimbingan Skripsi UMSU" />

            <div className="min-h-screen bg-gray-50">
                {/* Navbar */}
                <header className="bg-white border-b border-gray-100 shadow-sm">
                    <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-emerald-700 rounded-xl flex items-center justify-center">
                                <GraduationCap className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-sm leading-none">UMSU</p>
                                <p className="text-xs text-gray-500 leading-none mt-0.5">Sistem Bimbingan Skripsi</p>
                            </div>
                        </div>

                        <nav className="flex items-center gap-3">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
                                >
                                    Ke Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-gray-600 hover:text-gray-900 text-sm font-medium px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
                                    >
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero */}
                <section className="bg-emerald-900 text-white">
                    <div className="max-w-6xl mx-auto px-6 py-20 lg:py-28">
                        <div className="max-w-2xl">
                            <span className="inline-block bg-emerald-800 text-emerald-300 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-6">
                                UMSU Digital
                            </span>
                            <h1 className="text-3xl lg:text-5xl font-bold leading-tight mb-5">
                                Sistem Informasi<br />
                                <span className="text-emerald-300">Bimbingan Skripsi</span>
                            </h1>
                            <p className="text-emerald-100 text-base lg:text-lg font-light leading-relaxed mb-8">
                                Platform digital terintegrasi untuk mahasiswa, dosen pembimbing, dan Kaprodi dalam
                                mengelola seluruh proses bimbingan skripsi UMSU.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-sm px-6 py-3 rounded-xl transition-colors"
                                    >
                                        Buka Dashboard →
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-sm px-6 py-3 rounded-xl transition-colors"
                                        >
                                            Masuk ke Sistem
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="bg-emerald-800 hover:bg-emerald-700 text-white border border-emerald-700 font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
                                        >
                                            Buat Akun Baru
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="max-w-6xl mx-auto px-6 py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-bold text-gray-900">Fitur Utama Sistem</h2>
                        <p className="text-gray-500 text-sm mt-2">Dirancang untuk memperlancar alur bimbingan skripsi dari awal hingga selesai</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700 mb-4">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-gray-900 text-sm mb-2">Pengajuan Judul</h3>
                            <p className="text-xs text-gray-500 font-light leading-relaxed">
                                Mahasiswa mengajukan alternatif judul skripsi. Kaprodi menyeleksi dan menyetujui judul terbaik.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-700 mb-4">
                                <Users className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-gray-900 text-sm mb-2">Manajemen Bimbingan</h3>
                            <p className="text-xs text-gray-500 font-light leading-relaxed">
                                Log bimbingan tercatat digital. Dosen memverifikasi setiap sesi dan memantau progres mahasiswa.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-700 mb-4">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-gray-900 text-sm mb-2">Penjadwalan Online</h3>
                            <p className="text-xs text-gray-500 font-light leading-relaxed">
                                Mahasiswa booking jadwal bimbingan sesuai ketersediaan dosen yang sudah diatur sebelumnya.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-700 mb-4">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-gray-900 text-sm mb-2">Verifikasi Akun</h3>
                            <p className="text-xs text-gray-500 font-light leading-relaxed">
                                Admin / Super Admin memverifikasi akun baru dan menetapkan peran sebagai Mahasiswa (NPM) atau Dosen (NIDN).
                            </p>
                        </div>
                    </div>
                </section>

                {/* Role cards */}
                <section className="bg-white border-t border-gray-100">
                    <div className="max-w-6xl mx-auto px-6 py-16">
                        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Untuk Siapa Sistem Ini?</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6">
                                <span className="inline-block bg-emerald-700 text-white text-xs font-bold uppercase px-3 py-1 rounded-full mb-4">Mahasiswa</span>
                                <ul className="space-y-2 text-sm text-gray-700 font-light">
                                    <li className="flex items-start gap-2"><span className="text-emerald-600 font-bold mt-0.5">✓</span> Ajukan proposal judul skripsi</li>
                                    <li className="flex items-start gap-2"><span className="text-emerald-600 font-bold mt-0.5">✓</span> Pantau status persetujuan judul</li>
                                    <li className="flex items-start gap-2"><span className="text-emerald-600 font-bold mt-0.5">✓</span> Isi log bimbingan harian</li>
                                    <li className="flex items-start gap-2"><span className="text-emerald-600 font-bold mt-0.5">✓</span> Booking jadwal dengan dosen</li>
                                </ul>
                            </div>

                            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6">
                                <span className="inline-block bg-blue-700 text-white text-xs font-bold uppercase px-3 py-1 rounded-full mb-4">Dosen Pembimbing</span>
                                <ul className="space-y-2 text-sm text-gray-700 font-light">
                                    <li className="flex items-start gap-2"><span className="text-blue-600 font-bold mt-0.5">✓</span> Pantau progres mahasiswa</li>
                                    <li className="flex items-start gap-2"><span className="text-blue-600 font-bold mt-0.5">✓</span> Verifikasi log bimbingan</li>
                                    <li className="flex items-start gap-2"><span className="text-blue-600 font-bold mt-0.5">✓</span> Atur jadwal ketersediaan</li>
                                    <li className="flex items-start gap-2"><span className="text-blue-600 font-bold mt-0.5">✓</span> Kelola permohonan jadwal</li>
                                </ul>
                            </div>

                            <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-6">
                                <span className="inline-block bg-amber-600 text-white text-xs font-bold uppercase px-3 py-1 rounded-full mb-4">Kaprodi / Admin</span>
                                <ul className="space-y-2 text-sm text-gray-700 font-light">
                                    <li className="flex items-start gap-2"><span className="text-amber-600 font-bold mt-0.5">✓</span> Seleksi dan setujui judul skripsi</li>
                                    <li className="flex items-start gap-2"><span className="text-amber-600 font-bold mt-0.5">✓</span> Tunjuk dosen pembimbing</li>
                                    <li className="flex items-start gap-2"><span className="text-amber-600 font-bold mt-0.5">✓</span> Verifikasi akun pendaftar baru (oleh Admin / Super Admin)</li>
                                    <li className="flex items-start gap-2"><span className="text-amber-600 font-bold mt-0.5">✓</span> Pantau semua skripsi aktif</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-emerald-900 text-emerald-300 text-center py-8 text-xs">
                    <p className="font-semibold text-white">Universitas Muhammadiyah Sumatera Utara</p>
                    <p className="mt-1">Sistem Bimbingan Skripsi UMSU © {new Date().getFullYear()}</p>
                </footer>
            </div>
        </>
    );
}
