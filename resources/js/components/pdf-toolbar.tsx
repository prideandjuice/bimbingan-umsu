import React from 'react';

interface PdfToolbarProps {
    pdfDoc: any;
    pageNumber: number;
    setPageNumber: (n: number) => void;
    numPages: number;
    scale: number;
    setScale: React.Dispatch<React.SetStateAction<number>>;
    rotation: number;
    setRotation: React.Dispatch<React.SetStateAction<number>>;
    fitToWidth: () => void;
    undo: () => void;
    redo: () => void;
    pastLength: number;
    futureLength: number;
    downloadCurrentPdf?: () => void;
    metadataName?: string;
}

export default function PdfToolbar({
    pdfDoc,
    pageNumber,
    setPageNumber,
    numPages,
    scale,
    setScale,
    rotation,
    setRotation,
    fitToWidth,
    undo,
    redo,
    pastLength,
    futureLength,
}: PdfToolbarProps) {
    return (
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-gray-200/50 bg-white/70 px-6 dark:border-white/10 dark:bg-[#161615]/70">
            {/* Navigasi Halaman */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setPageNumber(Math.max(pageNumber - 1, 1))}
                    disabled={!pdfDoc || pageNumber <= 1}
                    className="rounded p-1.5 transition-colors hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent dark:hover:bg-white/5"
                    title="Halaman Sebelumnya"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <div className="flex items-center gap-1.5 text-xs">
                    <input
                        type="number"
                        min={1}
                        max={numPages || 1}
                        value={pageNumber}
                        onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (val >= 1 && val <= numPages) {
                                setPageNumber(val);
                            }
                        }}
                        disabled={!pdfDoc}
                        className="w-12 rounded border border-gray-200 px-1.5 py-1 text-center font-medium focus:border-[#f53003] focus:outline-none dark:border-white/10 dark:bg-white/5"
                    />
                    <span className="text-gray-400">dari</span>
                    <span className="font-semibold">{numPages || '-'}</span>
                </div>

                <button
                    onClick={() => setPageNumber(Math.min(pageNumber + 1, numPages))}
                    disabled={!pdfDoc || pageNumber >= numPages}
                    className="rounded p-1.5 transition-colors hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent dark:hover:bg-white/5"
                    title="Halaman Berikutnya"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Skala Zoom & Rotasi */}
            <div className="flex items-center gap-3">
                <div className="flex items-center rounded-lg border border-gray-200 px-1.5 py-0.5 dark:border-white/10">
                    <button
                        onClick={() => setScale((prev) => Math.max(prev - 0.25, 0.5))}
                        disabled={!pdfDoc || scale <= 0.5}
                        className="rounded p-1 transition-colors hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent dark:hover:bg-white/5"
                        title="Perkecil Zoom"
                    >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                        </svg>
                    </button>

                    <span className="w-16 text-center font-mono text-xs font-semibold">
                        {Math.round(scale * 100)}%
                    </span>

                    <button
                        onClick={() => setScale((prev) => Math.min(prev + 0.25, 3.0))}
                        disabled={!pdfDoc || scale >= 3.0}
                        className="rounded p-1 transition-colors hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent dark:hover:bg-white/5"
                        title="Perbesar Zoom"
                    >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>

                <button
                    onClick={fitToWidth}
                    disabled={!pdfDoc}
                    className="rounded p-1.5 transition-colors hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent dark:hover:bg-white/5"
                    title="Paskan Lebar Kontainer"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                    </svg>
                </button>

                <span className="text-gray-300 dark:text-gray-700">|</span>

                <button
                    onClick={() => setRotation((prev) => (prev - 90 + 360) % 360)}
                    disabled={!pdfDoc}
                    className="rounded p-1.5 transition-colors hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent dark:hover:bg-white/5"
                    title="Rotasi Kiri"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                </button>

                <button
                    onClick={() => setRotation((prev) => (prev + 90) % 360)}
                    disabled={!pdfDoc}
                    className="rounded p-1.5 transition-colors hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent dark:hover:bg-white/5"
                    title="Rotasi Kanan"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 10H11a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                    </svg>
                </button>


            </div>
        </div>
    );
}
