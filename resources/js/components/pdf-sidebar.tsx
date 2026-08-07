import React from 'react';
import { FileMetadata, Tool } from '@/types/pdf';

interface PdfSidebarProps {
    metadata: FileMetadata;
    pdfDoc: any;
    activeTool: Tool;
    setActiveTool: (tool: Tool) => void;
    brushColor: string;
    setBrushColor: (color: string) => void;
    brushWidth: number;
    setBrushWidth: (width: number) => void;
    textFontSize: number;
    setTextFontSize: (size: number) => void;
    undo: () => void;
    redo: () => void;
    pastLength: number;
    futureLength: number;
    saveStatus: 'idle' | 'pending' | 'saving' | 'saved' | 'error';
    clearPageAnnotations: () => void;
    exportAnnotatedPage: () => void;
    formatBytes: (bytes: number) => string;
    mode?: 'edit' | 'view';
}

export default function PdfSidebar({
    metadata,
    pdfDoc,
    activeTool,
    setActiveTool,
    brushColor,
    setBrushColor,
    brushWidth,
    setBrushWidth,
    textFontSize,
    setTextFontSize,
    undo,
    redo,
    pastLength,
    futureLength,
    saveStatus,
    clearPageAnnotations,
    exportAnnotatedPage,
    formatBytes,
    mode = 'edit',
}: PdfSidebarProps) {
    return (
        <aside
            className="scrollbar-hide flex w-80 shrink-0 flex-col gap-6 overflow-y-auto border-r border-gray-200/50 bg-white p-6 dark:border-white/10 dark:bg-[#161615]"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >


            {/* Alat & Anotasi */}
            {mode === 'edit' && (
                <div className="flex flex-col gap-4 rounded-xl border border-gray-200/50 p-4 dark:border-white/10 dark:bg-white/2">
                    <span className="text-xs font-semibold tracking-wider text-[#706f6c] uppercase dark:text-[#A1A09A]">
                        Alat Anotasi
                    </span>

                    {/* Pilihan Tool */}
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => setActiveTool('select')}
                            className={`flex items-center justify-center gap-2 rounded-lg border py-2 text-xs font-medium transition-colors ${activeTool === 'select'
                                ? 'border-[#f53003] bg-[#f53003]/5 text-[#f53003] dark:border-[#FF4433] dark:bg-[#FF4433]/5 dark:text-[#FF4433]'
                                : 'border-gray-200/50 bg-gray-50/30 hover:border-gray-200 hover:bg-gray-50 dark:border-white/5 dark:bg-white/2 dark:hover:bg-white/5'
                                }`}
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 13l6 6" />
                            </svg>
                            Kursor
                        </button>

                        <button
                            onClick={() => setActiveTool('draw')}
                            className={`flex items-center justify-center gap-2 rounded-lg border py-2 text-xs font-medium transition-colors ${activeTool === 'draw'
                                ? 'border-[#f53003] bg-[#f53003]/5 text-[#f53003] dark:border-[#FF4433] dark:bg-[#FF4433]/5 dark:text-[#FF4433]'
                                : 'border-gray-200/50 bg-gray-50/30 hover:border-gray-200 hover:bg-gray-50 dark:border-white/5 dark:bg-white/2 dark:hover:bg-white/5'
                                }`}
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Coret
                        </button>

                        <button
                            onClick={() => setActiveTool('rectangle')}
                            className={`flex items-center justify-center gap-2 rounded-lg border py-2 text-xs font-medium transition-colors ${activeTool === 'rectangle'
                                ? 'border-[#f53003] bg-[#f53003]/5 text-[#f53003] dark:border-[#FF4433] dark:bg-[#FF4433]/5 dark:text-[#FF4433]'
                                : 'border-gray-200/50 bg-gray-50/30 hover:border-gray-200 hover:bg-gray-50 dark:border-white/5 dark:bg-white/2 dark:hover:bg-white/5'
                                }`}
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Kotak
                        </button>

                        <button
                            onClick={() => setActiveTool('circle')}
                            className={`flex items-center justify-center gap-2 rounded-lg border py-2 text-xs font-medium transition-colors ${activeTool === 'circle'
                                ? 'border-[#f53003] bg-[#f53003]/5 text-[#f53003] dark:border-[#FF4433] dark:bg-[#FF4433]/5 dark:text-[#FF4433]'
                                : 'border-gray-200/50 bg-gray-50/30 hover:border-gray-200 hover:bg-gray-50 dark:border-white/5 dark:bg-white/2 dark:hover:bg-white/5'
                                }`}
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Lingkaran
                        </button>

                        <button
                            onClick={() => setActiveTool('pin')}
                            className={`flex items-center justify-center gap-2 rounded-lg border py-2 text-xs font-medium transition-colors ${activeTool === 'pin'
                                ? 'border-[#f53003] bg-[#f53003]/5 text-[#f53003] dark:border-[#FF4433] dark:bg-[#FF4433]/5 dark:text-[#FF4433]'
                                : 'border-gray-200/50 bg-gray-50/30 hover:border-gray-200 hover:bg-gray-50 dark:border-white/5 dark:bg-white/2 dark:hover:bg-white/5'
                                }`}
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Pin
                        </button>

                        <button
                            onClick={() => setActiveTool('text')}
                            className={`flex items-center justify-center gap-2 rounded-lg border py-2 text-xs font-medium transition-colors ${activeTool === 'text'
                                ? 'border-[#f53003] bg-[#f53003]/5 text-[#f53003] dark:border-[#FF4433] dark:bg-[#FF4433]/5 dark:text-[#FF4433]'
                                : 'border-gray-200/50 bg-gray-50/30 hover:border-gray-200 hover:bg-gray-50 dark:border-white/5 dark:bg-white/2 dark:hover:bg-white/5'
                                }`}
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M12 6v14m-5 0h10" />
                            </svg>
                            Teks
                        </button>

                        <button
                            onClick={() => setActiveTool('checkmark')}
                            className={`flex items-center justify-center gap-2 rounded-lg border py-2 text-xs font-medium transition-colors ${activeTool === 'checkmark'
                                ? 'border-[#f53003] bg-[#f53003]/5 text-[#f53003] dark:border-[#FF4433] dark:bg-[#FF4433]/5 dark:text-[#FF4433]'
                                : 'border-gray-200/50 bg-gray-50/30 hover:border-gray-200 hover:bg-gray-50 dark:border-white/5 dark:bg-white/2 dark:hover:bg-white/5'
                                }`}
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Centang
                        </button>

                        <button
                            onClick={() => setActiveTool('cross')}
                            className={`flex items-center justify-center gap-2 rounded-lg border py-2 text-xs font-medium transition-colors ${activeTool === 'cross'
                                ? 'border-[#f53003] bg-[#f53003]/5 text-[#f53003] dark:border-[#FF4433] dark:bg-[#FF4433]/5 dark:text-[#FF4433]'
                                : 'border-gray-200/50 bg-gray-50/30 hover:border-gray-200 hover:bg-gray-50 dark:border-white/5 dark:bg-white/2 dark:hover:bg-white/5'
                                }`}
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Silang
                        </button>

                        <button
                            onClick={() => setActiveTool('eraser')}
                            className={`flex items-center justify-center gap-2 rounded-lg border py-2 text-xs font-medium transition-colors ${activeTool === 'eraser'
                                ? 'border-[#f53003] bg-[#f53003]/5 text-[#f53003] dark:border-[#FF4433] dark:bg-[#FF4433]/5 dark:text-[#FF4433]'
                                : 'border-gray-200/50 bg-gray-50/30 hover:border-gray-200 hover:bg-gray-50 dark:border-white/5 dark:bg-white/2 dark:hover:bg-white/5'
                                }`}
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.9 13.5L14.5 19H20m-9 0H4v-4.5L13.5 5.1c.8-.8 2.2-.8 3 0l2.4 2.4c.8.8.8 2.2 0 3L11 19z" />
                            </svg>
                            Hapus Klik
                        </button>

                        <button
                            onClick={() => setActiveTool('brush_eraser')}
                            className={`flex items-center justify-center gap-2 rounded-lg border py-2 text-xs font-medium transition-colors ${activeTool === 'brush_eraser'
                                ? 'border-[#f53003] bg-[#f53003]/5 text-[#f53003] dark:border-[#FF4433] dark:bg-[#FF4433]/5 dark:text-[#FF4433]'
                                : 'border-gray-200/50 bg-gray-50/30 hover:border-gray-200 hover:bg-gray-50 dark:border-white/5 dark:bg-white/2 dark:hover:bg-white/5'
                                }`}
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.9 13.5L14.5 19H20m-9 0H4v-4.5L13.5 5.1c.8-.8 2.2-.8 3 0l2.4 2.4c.8.8.8 2.2 0 3L11 19z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 14h3" />
                            </svg>
                            Hapus Usap
                        </button>
                    </div>

                    {/* Detail Pengaturan berdasarkan tool aktif */}
                    {[
                        'draw',
                        'text',
                        'rectangle',
                        'circle',
                        'pin',
                        'checkmark',
                        'cross',
                    ].includes(activeTool) && (
                            <div className="flex flex-col gap-3 border-t border-gray-100 pt-3 dark:border-white/5">
                                {/* Warna */}
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-semibold text-gray-400 uppercase">
                                        Warna
                                    </span>
                                    <div className="flex gap-2">
                                        {[
                                            { value: '#f53003', bg: 'bg-[#f53003]' },
                                            { value: '#2563eb', bg: 'bg-[#2563eb]' },
                                            { value: '#1b1b18', bg: 'bg-[#1b1b18] dark:bg-white' },
                                            { value: '#16a34a', bg: 'bg-[#16a34a]' },
                                        ].map((color) => (
                                            <button
                                                key={color.value}
                                                onClick={() => setBrushColor(color.value)}
                                                className={`h-5 w-5 rounded-full ${color.bg} transition-transform ${brushColor === color.value
                                                    ? 'scale-125 ring-2 ring-gray-300 ring-offset-2 dark:ring-offset-black'
                                                    : 'hover:scale-110'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Tebal Kuas untuk Draw, Rectangle, Circle */}
                                {['draw', 'rectangle', 'circle'].includes(activeTool) && (
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-[10px] font-semibold text-gray-400 uppercase">
                                            Tebal Garis
                                        </span>
                                        <div className="flex gap-1.5">
                                            {[
                                                { label: 'Tipis', value: 2 },
                                                { label: 'Sedang', value: 5 },
                                                { label: 'Tebal', value: 10 },
                                            ].map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => setBrushWidth(opt.value)}
                                                    className={`rounded-md border px-2.5 py-1 text-[10px] font-medium transition-colors ${brushWidth === opt.value
                                                        ? 'border-[#f53003] bg-[#f53003]/5 text-[#f53003]'
                                                        : 'border-transparent bg-gray-50/50 hover:bg-gray-50 dark:bg-white/2 dark:hover:bg-white/5'
                                                        }`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Ukuran Teks untuk Text */}
                                {activeTool === 'text' && (
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-[10px] font-semibold text-gray-400 uppercase">
                                            Ukuran Huruf
                                        </span>
                                        <div className="flex gap-1.5">
                                            {[
                                                { label: 'Kecil', value: 14 },
                                                { label: 'Sedang', value: 18 },
                                                { label: 'Besar', value: 24 },
                                            ].map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => setTextFontSize(opt.value)}
                                                    className={`rounded-md border px-2.5 py-1 text-[10px] font-medium transition-colors ${textFontSize === opt.value
                                                        ? 'border-[#f53003] bg-[#f53003]/5 text-[#f53003]'
                                                        : 'border-transparent bg-gray-50/50 hover:bg-gray-50 dark:bg-white/2 dark:hover:bg-white/5'
                                                        }`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                    {/* Tombol Aksi Bersihkan & Ekspor */}
                    <div className="flex flex-col gap-2 border-t border-gray-100 pt-3 dark:border-white/5">
                        {/* Undo & Redo di Sidebar */}
                        <div className="grid grid-cols-2 gap-2 mb-1">
                            <button
                                onClick={undo}
                                disabled={pastLength === 0}
                                className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200/50 py-1.5 text-xs font-semibold bg-white hover:bg-gray-50 dark:border-white/10 dark:bg-white/2 dark:hover:bg-white/5 transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
                                title="Undo (Ctrl+Z)"
                            >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                </svg>
                                Undo
                            </button>
                            <button
                                onClick={redo}
                                disabled={futureLength === 0}
                                className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200/50 py-1.5 text-xs font-semibold bg-white hover:bg-gray-50 dark:border-white/10 dark:bg-white/2 dark:hover:bg-white/5 transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
                                title="Redo (Ctrl+Y)"
                            >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 10H11a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                                </svg>
                                Redo
                            </button>
                        </div>

                        {/* Indikator Auto-Save Real-Time */}
                        <div
                            className="flex w-full items-center justify-center gap-2 rounded-lg border py-2 text-center text-xs font-semibold transition-all duration-300"
                            style={{
                                borderColor:
                                    saveStatus === 'saved' ? '#10b981' :
                                        saveStatus === 'error' ? '#ef4444' :
                                            saveStatus === 'saving' || saveStatus === 'pending' ? '#f59e0b' :
                                                'rgba(255,255,255,0.1)',
                                color:
                                    saveStatus === 'saved' ? '#10b981' :
                                        saveStatus === 'error' ? '#ef4444' :
                                            saveStatus === 'saving' || saveStatus === 'pending' ? '#f59e0b' :
                                                'rgba(255,255,255,0.4)',
                                backgroundColor: 'transparent',
                            }}
                        >
                            {saveStatus === 'pending' && (
                                <>
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Menunggu...
                                </>
                            )}
                            {saveStatus === 'saving' && (
                                <>
                                    <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Menyimpan...
                                </>
                            )}
                            {saveStatus === 'saved' && (
                                <>
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Tersimpan Otomatis
                                </>
                            )}
                            {saveStatus === 'error' && (
                                <>
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    Gagal Menyimpan
                                </>
                            )}
                            {saveStatus === 'idle' && (
                                <>
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Auto-Save Aktif
                                </>
                            )}
                        </div>
                        <button
                            onClick={clearPageAnnotations}
                            className="w-full rounded-lg border border-gray-200 py-2 text-center text-xs font-semibold transition-colors hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5"
                        >
                            Hapus Semua Coretan/Teks
                        </button>
                    </div>
                </div>
            )}

            {/* Metadata Dokumen */}
            <div className="rounded-xl border border-gray-200/50 p-4 dark:border-white/10 dark:bg-white/2">
                <span className="text-xs font-semibold tracking-wider text-[#706f6c] uppercase dark:text-[#A1A09A]">
                    Informasi Dokumen
                </span>
                <div className="mt-3 flex flex-col gap-3.5 text-xs">
                    <div>
                        <div className="text-[10px] font-semibold text-gray-400 uppercase">
                            Nama File
                        </div>
                        <div className="mt-0.5 truncate font-medium" title={metadata.name}>
                            {metadata.name}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <div className="text-[10px] font-semibold text-gray-400 uppercase">
                                Ukuran
                            </div>
                            <div className="mt-0.5 font-medium">
                                {metadata.size}
                            </div>
                        </div>
                        <div>
                            <div className="text-[10px] font-semibold text-gray-400 uppercase">
                                Halaman
                            </div>
                            <div className="mt-0.5 font-medium">
                                {metadata.totalPages || '-'}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="text-[10px] font-semibold text-gray-400 uppercase">
                            Status Pemuatan
                        </div>
                        <div className="mt-1 flex items-center gap-1.5">
                            <span
                                className={`h-2 w-2 rounded-full ${metadata.status === 'loaded'
                                    ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                                    : metadata.status === 'loading'
                                        ? 'animate-pulse bg-amber-500'
                                        : metadata.status === 'error'
                                            ? 'bg-rose-500'
                                            : 'bg-gray-300 dark:bg-gray-700'
                                    }`}
                            />
                            <span className="text-[11px] font-semibold capitalize">
                                {metadata.status === 'idle' && 'Kosong'}
                                {metadata.status === 'loading' && 'Memuat...'}
                                {metadata.status === 'loaded' && 'Selesai'}
                                {metadata.status === 'error' && 'Gagal'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
