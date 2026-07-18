// components/bimbingan/guest/DemoHelper.tsx
import { AlertCircle } from 'lucide-react';
import { DB } from '@/db';

interface DemoHelperProps {
  currentUserName: string;
  onRefresh: () => void;
}

export default function DemoHelper({ currentUserName, onRefresh }: DemoHelperProps) {
  const handleSwitchToAdmin = () => {
    const adminUser = DB.getUsers().find(u => u.role === 'admin');
    if (adminUser) {
      DB.setCurrentUser(adminUser);
      onRefresh();
    }
  };

  return (
    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-left mt-6 flex items-start gap-2.5">
      <AlertCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
      <div>
        <h4 className="text-2xs font-bold text-emerald-800 uppercase tracking-wider">Tip Pengujian Cepat (Demo Control):</h4>
        <p className="text-3xs text-emerald-800 font-light mt-1 leading-relaxed">
          Gunakan panel <span className="font-bold">Demo Control Center</span> di bagian atas halaman untuk beralih peran ke{" "}
          <span className="font-bold underline cursor-pointer" onClick={handleSwitchToAdmin}>
            Super Admin (Kaprodi)
          </span>
          . Masuk ke tab <span className="font-bold">"Akun & Verifikasi"</span> untuk menyetujui akun Anda (<span className="font-medium">{currentUserName}</span>) menjadi Mahasiswa atau Dosen secara instan!
        </p>
      </div>
    </div>
  );
}