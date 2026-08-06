import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { X, Save, FileText } from 'lucide-react';
import PdfSidebar from '@/components/pdf-sidebar';
import PdfToolbar from '@/components/pdf-toolbar';
import PdfCanvasViewer from '@/components/pdf-canvas-viewer';
import { FileMetadata, Tool, PageAnnotations } from '@/types/pdf';

// Configure PDF.js worker using Vite asset resolver
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

interface PdfAnnotatorModalProps {
    isOpen: boolean;
    onClose: () => void;
    pdfUrl: string;
    fileName: string;
    studentName?: string;
    mode?: 'edit' | 'view';
    initialAnnotations?: any;
    onSaveAnnotations?: (annotations: any) => void;
}

export default function PdfAnnotatorModal({
    isOpen,
    onClose,
    pdfUrl,
    fileName,
    studentName = 'Mahasiswa',
    mode = 'edit',
    initialAnnotations,
    onSaveAnnotations,
}: PdfAnnotatorModalProps) {
    const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [numPages, setNumPages] = useState<number>(0);
    const [scale, setScale] = useState<number>(1.25);
    const [rotation, setRotation] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
    const [pdfGenProgress, setPdfGenProgress] = useState<number>(0);

    const [metadata, setMetadata] = useState<FileMetadata>({
        name: fileName || 'Dokumen Skripsi.pdf',
        size: '0 KB',
        totalPages: 0,
        status: 'idle',
    });

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const viewportRef = useRef<HTMLDivElement | null>(null);

    const [activeTool, setActiveTool] = useState<Tool>('select');
    const [brushColor, setBrushColor] = useState<string>('#f53003');
    const [brushWidth, setBrushWidth] = useState<number>(5);
    const [textFontSize, setTextFontSize] = useState<number>(18);

    const [past, setPast] = useState<Record<number, PageAnnotations>[]>([]);
    const [future, setFuture] = useState<Record<number, PageAnnotations>[]>([]);
    const [pageAnnotations, setPageAnnotations] = useState<Record<number, PageAnnotations>>({});

    const [saveStatus, setSaveStatus] = useState<'idle' | 'pending' | 'saving' | 'saved' | 'error'>('idle');

    // Parse initial annotations when modal opens
    useEffect(() => {
        if (isOpen) {
            if (initialAnnotations) {
                if (typeof initialAnnotations === 'object' && !Array.isArray(initialAnnotations)) {
                    setPageAnnotations(initialAnnotations);
                } else if (Array.isArray(initialAnnotations) && initialAnnotations.length > 0) {
                    // Legacy annotation format converter
                    const converted: Record<number, PageAnnotations> = {};
                    initialAnnotations.forEach((anno: any) => {
                        const page = anno.page || 1;
                        if (!converted[page]) {
                            converted[page] = {
                                drawings: [],
                                texts: [],
                                rectangles: [],
                                circles: [],
                                pins: [],
                                checkmarks: [],
                                crosses: [],
                            };
                        }
                        if (anno.type === 'sticky_note') {
                            converted[page].pins = converted[page].pins || [];
                            converted[page].pins!.push({
                                id: anno.id || `pin_${Date.now()}`,
                                x: (anno.x || 50) / 100,
                                y: (anno.y || 50) / 100,
                                color: anno.color || '#f53003',
                                label: anno.content || 'Catatan',
                            });
                        } else if (anno.type === 'highlight' || anno.type === 'rectangle') {
                            converted[page].rectangles = converted[page].rectangles || [];
                            converted[page].rectangles!.push({
                                id: anno.id || `rect_${Date.now()}`,
                                x: (anno.x || 10) / 100,
                                y: (anno.y || 10) / 100,
                                width: 0.2,
                                height: 0.05,
                                color: anno.color || '#fef08a',
                                strokeWidth: 3,
                            });
                        }
                    });
                    setPageAnnotations(converted);
                } else {
                    setPageAnnotations({});
                }
            } else {
                setPageAnnotations({});
            }
        }
    }, [isOpen, initialAnnotations]);

    const formatBytes = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const loadPdfFromBuffer = async (buffer: ArrayBuffer, name: string, fileSize: number) => {
        try {
            setError(null);
            setMetadata({
                name: name,
                size: formatBytes(fileSize),
                totalPages: 0,
                status: 'loading',
            });

            if (pdfDoc) {
                await pdfDoc.loadingTask.destroy();
                setPdfDoc(null);
            }

            setPdfBytes(buffer);

            const loadingTask = pdfjsLib.getDocument({
                data: new Uint8Array(buffer.slice(0)),
            });

            const doc = await loadingTask.promise;
            setPdfDoc(doc);
            setNumPages(doc.numPages);
            setPageNumber(1);
            setMetadata({
                name: name,
                size: formatBytes(fileSize),
                totalPages: doc.numPages,
                status: 'loaded',
            });
        } catch (err: any) {
            console.error('PDF load error:', err);
            setError(`Gagal memuat dokumen PDF: ${err?.message || 'Format file tidak didukung'}`);
            setMetadata((prev) => ({ ...prev, status: 'error' }));
        }
    };

    const loadSamplePdf = async () => {
        try {
            setError(null);
            const binaryString = window.atob(
                'JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA1OTUgODQyXQovQ29udGVudHMgNCAwIFIKL1Jlc291cmNlcyA8PAovRm9udCA8PAovRjEgNSAwIFIKPj4KPj4KPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0xlbmd0aCA2Ngo+PgpzdHJlYW0KQlQKL0YxIDI0IFRmCjUwIDcwMCBUZAooUERGIEpTIERlbW8gSU1QTEVNRU5UQVNJKSBUagogMCA1MCBUZAooQmVyaGFzaWwgRGlyZW5kZXIhKSBUagogRVQKZW5kc3RyZWFtCmVuZG9iago1IDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9TdWJ0eXBlIC9UeXBlMQovQmFzZUZvbnQgL0hlbHZldGljYQo+PgplbmRvYmoKdHJhaWxlcgo8PAovUm9vdCAxIDAgUgovU2l6ZSA2Cj4+CiUlRU9G',
            );
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            await loadPdfFromBuffer(bytes.buffer, fileName || 'sample_document.pdf', bytes.length);
        } catch (err: any) {
            setError('Gagal membuat PDF sampel: ' + err.message);
        }
    };

    // Load PDF from pdfUrl when modal opens
    useEffect(() => {
        if (!isOpen) return;

        let isCancelled = false;

        const fetchPdf = async () => {
            if (!pdfUrl) {
                loadSamplePdf();
                return;
            }

            try {
                setError(null);
                setMetadata({
                    name: fileName || 'Dokumen.pdf',
                    size: 'Memuat...',
                    totalPages: 0,
                    status: 'loading',
                });

                const res = await fetch(pdfUrl);
                if (!res.ok) {
                    throw new Error(`HTTP Error ${res.status}`);
                }
                const buffer = await res.arrayBuffer();

                if (!isCancelled) {
                    await loadPdfFromBuffer(buffer, fileName || 'Dokumen.pdf', buffer.byteLength);
                }
            } catch (err: any) {
                console.warn('Could not fetch PDF URL, falling back to sample:', err);
                if (!isCancelled) {
                    loadSamplePdf();
                }
            }
        };

        fetchPdf();

        return () => {
            isCancelled = true;
        };
    }, [isOpen, pdfUrl, fileName]);

    const updateAnnotations = (updated: Record<number, PageAnnotations>) => {
        setPast((prev) => [...prev, pageAnnotations]);
        setFuture([]);
        setPageAnnotations(updated);
        triggerAutoSave(updated);
    };

    const triggerAutoSave = (currentAnnos: Record<number, PageAnnotations>) => {
        if (mode !== 'edit') return;
        setSaveStatus('saving');
        if (onSaveAnnotations) {
            onSaveAnnotations(currentAnnos);
        }
        setTimeout(() => {
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2500);
        }, 300);
    };

    const undo = useCallback(() => {
        if (past.length === 0) return;
        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);
        setPast(newPast);
        setFuture((prev) => [pageAnnotations, ...prev]);
        setPageAnnotations(previous);
        triggerAutoSave(previous);
    }, [past, pageAnnotations]);

    const redo = useCallback(() => {
        if (future.length === 0) return;
        const next = future[0];
        const newFuture = future.slice(1);
        setFuture(newFuture);
        setPast((prev) => [...prev, pageAnnotations]);
        setPageAnnotations(next);
        triggerAutoSave(next);
    }, [future, pageAnnotations]);

    const clearPageAnnotations = () => {
        const updated = {
            ...pageAnnotations,
            [pageNumber]: {
                drawings: [],
                texts: [],
                rectangles: [],
                circles: [],
                pins: [],
                checkmarks: [],
                crosses: [],
            },
        };
        updateAnnotations(updated);
    };

    const exportAnnotatedPage = () => {
        const pdfCanvas = canvasRef.current;
        const overlayCanvas = overlayCanvasRef.current;

        if (!pdfCanvas || !overlayCanvas) return;

        const masterCanvas = document.createElement('canvas');
        masterCanvas.width = pdfCanvas.width;
        masterCanvas.height = pdfCanvas.height;
        const context = masterCanvas.getContext('2d');

        if (!context) return;

        context.drawImage(pdfCanvas, 0, 0);
        context.drawImage(overlayCanvas, 0, 0);

        const dataURL = masterCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = `anotasi_${(fileName || 'dokumen').replace('.pdf', '')}_halaman_${pageNumber}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };



    const fitToWidth = () => {
        if (!pdfDoc || !viewportRef.current) return;
        pdfDoc.getPage(pageNumber).then((page) => {
            const unscaledViewport = page.getViewport({ scale: 1.0, rotation });
            const containerWidth = (viewportRef.current?.clientWidth || 800) - 64;
            const targetScale = containerWidth / unscaledViewport.width;
            setScale(Math.max(0.5, Math.min(targetScale, 3.0)));
        });
    };

    const handleSaveManual = () => {
        if (onSaveAnnotations) {
            onSaveAnnotations(pageAnnotations);
        }
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2500);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex h-screen w-screen flex-col overflow-hidden bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200 text-slate-100">
            {/* Top Modal Header - Styled after UMSU Dashboard Header */}
            <header className="flex h-16 shrink-0 items-center justify-between border-b border-emerald-900/50 bg-emerald-800 px-6 shadow-md text-white">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-700 text-white shadow-inner">
                        <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <h2 className="text-base font-bold text-white truncate max-w-sm sm:max-w-md md:max-w-xl" title={fileName}>
                            {fileName}
                        </h2>
                        {studentName && (
                            <p className="text-xs text-emerald-200 truncate">
                                Draft Skripsi oleh: <span className="font-semibold text-white">{studentName}</span>
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <button
                        onClick={() => {
                            handleSaveManual();
                            onClose();
                        }}
                        className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-md transition-all hover:bg-emerald-500 active:scale-95 cursor-pointer border border-emerald-500/30"
                        title="Simpan Hasil Anotasi"
                    >
                        <Save className="h-4 w-4" />
                        <span>Simpan Anotasi</span>
                    </button>
                </div>
            </header>

            {/* Main Content Area with Sidebar & Toolbar & Canvas Viewer */}
            <div className="flex flex-1 min-h-0 overflow-hidden bg-slate-900 text-slate-900 dark:text-slate-100">
                {/* Left Sidebar Tools */}
                <PdfSidebar
                    metadata={metadata}
                    pdfDoc={pdfDoc}
                    activeTool={activeTool}
                    setActiveTool={setActiveTool}
                    brushColor={brushColor}
                    setBrushColor={setBrushColor}
                    brushWidth={brushWidth}
                    setBrushWidth={setBrushWidth}
                    textFontSize={textFontSize}
                    setTextFontSize={setTextFontSize}
                    undo={undo}
                    redo={redo}
                    pastLength={past.length}
                    futureLength={future.length}
                    saveStatus={saveStatus}
                    clearPageAnnotations={clearPageAnnotations}
                    exportAnnotatedPage={exportAnnotatedPage}
                    formatBytes={formatBytes}
                />

                {/* Main View Area */}
                <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-gray-50 dark:bg-[#121212]">
                    <PdfToolbar
                        pdfDoc={pdfDoc}
                        pageNumber={pageNumber}
                        setPageNumber={setPageNumber}
                        numPages={numPages}
                        scale={scale}
                        setScale={setScale}
                        rotation={rotation}
                        setRotation={setRotation}
                        fitToWidth={fitToWidth}
                        undo={undo}
                        redo={redo}
                        pastLength={past.length}
                        futureLength={future.length}
                    />

                    <PdfCanvasViewer
                        pdfDoc={pdfDoc}
                        pageNumber={pageNumber}
                        scale={scale}
                        rotation={rotation}
                        activeTool={activeTool}
                        brushColor={brushColor}
                        brushWidth={brushWidth}
                        textFontSize={textFontSize}
                        pageAnnotations={pageAnnotations}
                        setPageAnnotations={setPageAnnotations}
                        past={past}
                        setPast={setPast}
                        setFuture={setFuture}
                        updateAnnotations={updateAnnotations}
                        canvasRef={canvasRef}
                        overlayCanvasRef={overlayCanvasRef}
                        viewportRef={viewportRef}
                        isGeneratingPdf={isGeneratingPdf}
                        pdfGenProgress={pdfGenProgress}
                        error={error}
                        loadSamplePdf={loadSamplePdf}
                    />
                </div>
            </div>
        </div>
    );
}
