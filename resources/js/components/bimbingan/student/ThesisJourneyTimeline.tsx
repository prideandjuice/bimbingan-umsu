import { ClipboardList, UserCheck, BookOpen, GraduationCap } from 'lucide-react';

export default function ThesisJourneyTimeline() {
  const steps = [
    {
      title: '1. Pengajuan & Seleksi Judul',
      desc: 'Mengajukan draf proposal tesis beserta minimal 2 alternatif judul untuk diseleksi oleh Kaprodi.',
      status: 'active',
      icon: ClipboardList,
    },
    {
      title: '2. Penunjukan Pembimbing',
      desc: 'Kaprodi menyetujui satu judul utama dan menetapkan Dosen Pembimbing Tesis.',
      status: 'pending',
      icon: UserCheck,
    },
    {
      title: '3. Proses Bimbingan & Logbook',
      desc: 'Mengisi logbook kegiatan bimbingan mandiri dan melakukan diskusi rutin bersama Dosen Pembimbing.',
      status: 'pending',
      icon: BookOpen,
    },
    {
      title: '4. Sidang Akhir Tesis',
      desc: 'Mendaftarkan kelayakan ujian tesis setelah seluruh bimbingan diverifikasi oleh dosen pembimbing.',
      status: 'pending',
      icon: GraduationCap,
    },
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
      <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
        Alur Perjalanan Tesis Anda
      </h3>
      <p className="text-xs text-muted-foreground font-light leading-relaxed">
        Ikuti tahapan penyusunan tesis Anda secara tertib. Status aktif ditandai dengan lingkaran berwarna hijau.
      </p>

      <div className="relative border-l border-gray-100 dark:border-zinc-800 ml-3 pl-6 space-y-6 pt-2">
        {steps.map((step, idx) => {
          const StepIcon = step.icon;
          const isActive = step.status === 'active';
          
          return (
            <div key={idx} className="relative group">
              {/* Connector line dot */}
              <div className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                isActive 
                  ? 'bg-emerald-600 text-white ring-4 ring-emerald-50 dark:ring-emerald-950/30' 
                  : 'bg-gray-100 dark:bg-zinc-800 text-muted-foreground'
              }`}>
                <StepIcon className="w-3.5 h-3.5" />
              </div>

              <div className="space-y-1">
                <h4 className={`text-xs font-bold transition-colors ${
                  isActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {step.title}
                </h4>
                <p className="text-[11px] leading-relaxed text-muted-foreground font-light">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
