import { Info, HelpCircle, CheckSquare } from 'lucide-react';

export default function AcademicGuidelineCard() {
  const guidelines = [
    {
      title: 'Ketentuan Abstrak',
      desc: 'Tulis ringkasan penelitian Anda dalam 100 - 250 kata yang memuat masalah, metode, dan target luaran.',
    },
    {
      title: 'Alternatif Judul',
      desc: 'Wajib memberikan minimal 2 dan maksimal 4 opsi alternatif judul tesis agar memudahkan seleksi Kaprodi.',
    },
    {
      title: 'Cek Plagiasi (Turnitin)',
      desc: 'Pastikan draf proposal Anda memiliki tingkat kemiripan (similarity index) maksimal 25%.',
    },
    {
      title: 'Lama Review Kaprodi',
      desc: 'Status pengajuan judul akan diproses dan ditentukan pembimbingnya dalam waktu 2-3 hari kerja.',
    },
  ];

  return (
    <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/20 rounded-3xl p-6 shadow-sm space-y-4">
      <h3 className="font-bold text-emerald-900 dark:text-emerald-300 text-base flex items-center gap-2">
        <Info className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
        Panduan & Ketentuan Pengajuan
      </h3>

      <div className="space-y-4">
        {guidelines.map((g, idx) => (
          <div key={idx} className="flex gap-3">
            <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="text-xs font-semibold text-emerald-900 dark:text-emerald-300">
                {g.title}
              </h4>
              <p className="text-[11px] leading-relaxed text-emerald-800/80 dark:text-emerald-200/60 font-light">
                {g.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-emerald-200/30 dark:border-emerald-900/30 flex items-center justify-between text-[10px] text-emerald-700 dark:text-emerald-400">
        <span className="flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5" />
          Butuh bantuan akademik?
        </span>
        <a href="#" className="underline font-semibold hover:text-emerald-800 dark:hover:text-emerald-300">
          Hubungi Admin
        </a>
      </div>
    </div>
  );
}
