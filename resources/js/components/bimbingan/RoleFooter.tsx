import { Link, usePage } from '@inertiajs/react';
import {
  GraduationCap,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Layers,
  Mail,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { DB } from '@/db';
import type { AppUser, SharedData, UserRole } from '@/types';

interface RoleFooterProps {
  role?: UserRole;
  currentUser?: AppUser;
}

export default function RoleFooter({ role: propRole, currentUser: propUser }: RoleFooterProps) {
  const page = usePage<SharedData>();
  const authUser = page.props?.auth?.user;

  // Determine user and role from props, local DB, or auth
  const currentUser: AppUser | null =
    propUser ||
    (typeof window !== 'undefined' ? DB.getCurrentUser() : null) ||
    (authUser
      ? {
        id: String(authUser.id),
        name: authUser.name,
        email: authUser.email,
        role: (((authUser as any).roles?.[0] as UserRole) || 'student'),
        avatar: authUser.avatar,
      }
      : null);

  const role: UserRole = propRole || currentUser?.role || 'guest';

  // Role Configurations for green dark theme
  const roleConfig: Record<
    UserRole,
    {
      label: string;
      bgBadge: string;
      description: string;
      quickLinks: { label: string; href: string }[];
      supportText: string;
      contactEmail: string;
    }
  > = {
    superadmin: {
      label: 'Super Admin Portal',
      bgBadge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      description: 'Portal Utama Administrator Sistem Skripsi UMSU. Mengelola hak akses pengguna, verifikasi pendaftar Google SSO, konfigurasi master data, serta pemantauan audit trail.',
      quickLinks: [
        {
          label: 'Ringkasan Statistik Sistem',
          href: ''
        },
        {
          label: 'Manajemen Pengguna & Verifikasi',
          href: ''
        },
        {
          label: 'Seleksi Judul Proposal Skripsi',
          href: ''
        },
        {
          label: 'Penugasan SK Pembimbing',
          href: ''
        },
      ],
      supportText: 'Tim IT Administrator & Support UMSU',
      contactEmail: 'superadmin@umsu.ac.id',
    },
    admin: {
      label: 'Admin Portal',
      bgBadge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      description: 'Portal Administrator Utama Sistem Skripsi UMSU. Mengelola hak akses pengguna, verifikasi pendaftar Google SSO, konfigurasi master data, serta pemantauan audit trail.',
      quickLinks: [
        { label: 'Ringkasan Statistik Sistem', href: '' },
        { label: 'Manajemen Pengguna & Verifikasi', href: '' },
        { label: 'Seleksi Judul Proposal Skripsi', href: '' },
        { label: 'Penugasan SK Pembimbing', href: '' },
      ],
      supportText: 'Tim IT Administrator & Support UMSU',
      contactEmail: 'admin@umsu.ac.id',
    },
    prodi: {
      label: 'Program Studi Portal',
      bgBadge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      description: 'Portal Program Studi UMSU. Digunakan untuk persetujuan usulan judul skripsi, penetapan dosen pembimbing I & II, serta pengesahan SK Dekan.',
      quickLinks: [
        { label: 'Validasi Proposal Judul', href: '' },
        { label: 'Plotting Dosen Pembimbing', href: '' },
        { label: 'Unggah SK Pembimbing', href: '' },
        { label: 'Monitoring Progres Mahasiswa', href: '' },
      ],
      supportText: 'Sekretariat Prodi UMSU',
      contactEmail: 'prodi@umsu.ac.id',
    },
    lecturer: {
      label: 'Dosen Pembimbing Portal',
      bgBadge: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
      description: 'Portal Dosen Pembimbing Skripsi UMSU. Tempat verifikasi catatan logbook bimbingan mahasiswa, pengesahan progres skripsi, dan pengaturan jadwal konsultasi.',
      quickLinks: [
        { label: 'Daftar Mahasiswa Bimbingan', href: '' },
        { label: 'Persetujuan Permohonan Bimbingan', href: '' },
        { label: 'Atur Ketersediaan Slot Waktu', href: '' },
        { label: 'Verifikasi Logbook Catatan', href: '' },
      ],
      supportText: 'Layanan Akademik Dosen Pembimbing UMSU',
      contactEmail: 'lecturer@umsu.ac.id',
    },
    student: {
      label: 'Mahasiswa Portal',
      bgBadge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      description: 'Portal Akademik Skripsi Mahasiswa UMSU. Pengajuan usulan 3 judul skripsi, pemantauan status persetujuan Kaprodi, pengisian logbook, dan booking jadwal dosen.',
      quickLinks: [
        { label: 'Pengajuan Judul Proposal', href: '' },
        { label: 'Cek Status Persetujuan Judul', href: '' },
        { label: 'Catatan Logbook Bimbingan', href: '' },
        { label: 'Booking Jadwal Konsultasi', href: '' },
      ],
      supportText: 'Helpdesk Akademik Skripsi Mahasiswa UMSU',
      contactEmail: 'student@umsu.ac.id',
    },
    guest: {
      label: 'Pendaftaran & Verifikasi',
      bgBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      description: 'Portal Aktivasi Akun Pendaftar UMSU. Akun terhubung via Google SSO. Mohon tunggu proses verifikasi identitas (NPM / NIDN) oleh Sekretariat Prodi / Admin UMSU.',
      quickLinks: [
        { label: 'Cek Status Verifikasi Akun', href: '' },
        { label: 'Panduan Google SSO UMSU', href: '' },
        { label: 'Kontak Admin Program Studi', href: '' },
      ],
      supportText: 'Helpdesk Pendaftaran & Verifikasi UMSU',
      contactEmail: 'helpdesk@umsu.ac.id',
    },
    mahasiswa: {
      label: '',
      bgBadge: '',
      description: '',
      quickLinks: [],
      supportText: '',
      contactEmail: ''
    },
    dosen: {
      label: '',
      bgBadge: '',
      description: '',
      quickLinks: [],
      supportText: '',
      contactEmail: ''
    }
  };

  const currentConfig = roleConfig[role] || roleConfig.guest;

  return (
    <footer className="mt-14 w-full bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-emerald-100 rounded-3xl border border-emerald-800/40 shadow-2xl overflow-hidden text-left">
      {/* Top Decor Glow */}
      <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 w-full" />

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

          {/* Column 1: Branding, Role Info & Tag */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-emerald-950 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
                <GraduationCap className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-lg tracking-tight leading-tight flex items-center gap-2">
                  Sistem Skripsi & Bimbingan
                  <Sparkles className="w-4 h-4 text-emerald-300 animate-pulse" />
                </h3>
                <p className="text-xs text-emerald-300 font-semibold tracking-wide">
                  Universitas Muhammadiyah Sumatera Utara
                </p>
              </div>
            </div>

            <p className="text-xs text-emerald-200/90 leading-relaxed max-w-md">
              {currentConfig.description}
            </p>
          </div>

          {/* Column 2: Navigation tailored for active Role */}
          <div className="md:col-span-4 space-y-3.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Navigasi Utama
            </h4>

            <ul className="space-y-2.5 text-xs">
              {currentConfig.quickLinks.map((link: { label: string; href: string }, idx: number) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-emerald-100/90 hover:text-white hover:translate-x-1 transition-all duration-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 group-hover:bg-emerald-300 group-hover:scale-125 transition-all"></span>
                    <span className="font-medium">{link.label}</span>
                    <ArrowUpRight className="w-3 h-3 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: System Status & Contact */}
          <div className="md:col-span-3 space-y-3.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Status & Layanan
            </h4>

            <div className="bg-emerald-900/60 backdrop-blur-md rounded-2xl p-4 border border-emerald-700/50 space-y-3 shadow-inner">
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-200/80">Status Server</span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-300 bg-emerald-800/80 px-2 py-0.5 rounded-md border border-emerald-600/40">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Operasional
                </span>
              </div>

              <div className="border-t border-emerald-800/80 pt-2.5 text-xs">
                <p className="text-emerald-300/70 text-3xs font-semibold uppercase tracking-wider">
                  Bantuan / Contact Support
                </p>
                <a
                  href={`mailto:${currentConfig.contactEmail}`}
                  className="font-bold text-white hover:text-emerald-300 transition-colors flex items-center gap-1.5 mt-1"
                >
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  {currentConfig.contactEmail}
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Footer Bar */}
      <div className="border-t border-emerald-800/60 bg-emerald-950/80 py-4 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-300/80">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              &copy; {new Date().getFullYear()} <strong className="text-white">Universitas Muhammadiyah Sumatera Utara (UMSU)</strong>.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
