import { Link } from '@inertiajs/react';
import { GraduationCap, CheckCircle2, ArrowLeft, BookOpen, Award, Sparkles } from 'lucide-react';
import React from 'react';
export default function AuthLayout({ children, title, description }: { children: React.ReactNode; title: string; description: string }) {
    return (
        <div className="relative min-h-screen grid lg:grid-cols-2 overflow-hidden bg-gradient-to-tr from-slate-50 to-emerald-50/20 dark:from-zinc-950 dark:to-zinc-900">
            {/* Left Pane (Desktop Only) */}
            <div className="relative hidden lg:flex flex-col justify-between p-12 text-white bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
                <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
                <div className="absolute top-1/2 -right-40 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-emerald-600/15 blur-3xl pointer-events-none" />

                {/* Logo and Header */}
                <div className="relative z-10 flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-3 group transition-transform duration-300 hover:scale-105">
                        <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-lg">
                            <GraduationCap className="w-6 h-6 text-emerald-300" />
                        </div>
                        <div>
                            <p className="font-bold text-white text-base tracking-wide leading-none">UMSU</p>
                            <p className="text-xs text-emerald-300 font-light mt-0.5">Sistem Bimbingan Skripsi</p>
                        </div>
                    </Link>
                </div>

                {/* Main Content & Feature Box */}
                <div className="relative z-10 my-auto max-w-lg space-y-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-emerald-200">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
                            <span>UMSU Digital</span>
                        </div>
                        <h1 className="text-4xl font-extrabold leading-tight tracking-tight">
                            Bimbingan Skripsi Lebih <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">Terstruktur</span> &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">Efisien</span>.
                        </h1>
                        <p className="text-emerald-100/80 text-base leading-relaxed font-light">
                            Selamat datang di portal akademik Universitas Muhammadiyah Sumatera Utara. Pantau progres judul, logbook bimbingan, dan jadwal pertemuan secara real-time.
                        </p>
                    </div>

                    {/* Glassmorphic timeline card */}
                    <div className="p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl space-y-4">
                        <p className="text-xs font-semibold text-emerald-300 uppercase tracking-widest flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            Alur Bimbingan Digital
                        </p>
                        <div className="grid gap-3 text-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-emerald-100 font-medium">1. Pengajuan alternatif judul skripsi online</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-emerald-100 font-medium">2. Penunjukan Dosen Pembimbing oleh Kaprodi</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-emerald-100 font-medium">3. Pengisian Logbook bimbingan mandiri</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-300/60 flex items-center justify-center border border-emerald-500/15">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                </div>
                                <span className="text-emerald-100/70 font-light">4. Booking jadwal &amp; monitoring kelulusan</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer info */}
                <div className="relative z-10 text-xs text-emerald-300/70 font-light flex items-center justify-between border-t border-white/10 pt-6">
                    <span className="flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-emerald-400" />
                        Terakreditasi Unggul UMSU
                    </span>
                    <span>© {new Date().getFullYear()} UMSU</span>
                </div>
            </div>

            {/* Right Pane (Form Container) */}
            <div className="flex items-center justify-center p-6 md:p-12 lg:p-16 relative">
                {/* Back to welcome link */}
                <Link
                    href="/"
                    className="absolute top-8 left-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali ke Beranda</span>
                </Link>

                <div className="w-full max-w-[420px] space-y-8">
                    {/* Header showing logo on mobile only */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
                        <div className="w-12 h-12 bg-emerald-700 dark:bg-emerald-600 rounded-2xl flex lg:hidden items-center justify-center shadow-lg shadow-emerald-700/20">
                            <GraduationCap className="w-7 h-7 text-white" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                                {title}
                            </h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {description}
                            </p>
                        </div>
                    </div>

                    {/* Children form */}
                    <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-8 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-xl shadow-emerald-950/[0.03] transition-all">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
