import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import {
    Point,
    DrawPath,
    TextAnnotation,
    RectangleAnnotation,
    CircleAnnotation,
    PinAnnotation,
    PageAnnotations,
    Tool,
} from '@/types/pdf';

interface PdfCanvasViewerProps {
    pdfDoc: any;
    pageNumber: number;
    scale: number;
    rotation: number;
    activeTool: Tool;
    brushColor: string;
    brushWidth: number;
    textFontSize: number;
    pageAnnotations: Record<number, PageAnnotations>;
    setPageAnnotations: React.Dispatch<React.SetStateAction<Record<number, PageAnnotations>>>;
    past: Record<number, PageAnnotations>[];
    setPast: React.Dispatch<React.SetStateAction<Record<number, PageAnnotations>[]>>;
    setFuture: React.Dispatch<React.SetStateAction<Record<number, PageAnnotations>[]>>;
    updateAnnotations: (updated: Record<number, PageAnnotations>) => void;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    overlayCanvasRef: React.RefObject<HTMLCanvasElement | null>;
    viewportRef: React.RefObject<HTMLDivElement | null>;
    isGeneratingPdf: boolean;
    pdfGenProgress: number;
    error: string | null;
    loadSamplePdf: () => void;
    fileInputRef?: React.RefObject<HTMLInputElement | null>;
}

export default function PdfCanvasViewer({
    pdfDoc,
    pageNumber,
    scale,
    rotation,
    activeTool,
    brushColor,
    brushWidth,
    textFontSize,
    pageAnnotations,
    setPageAnnotations,
    past,
    setPast,
    setFuture,
    updateAnnotations,
    canvasRef,
    overlayCanvasRef,
    viewportRef,
    isGeneratingPdf,
    pdfGenProgress,
    error,
    loadSamplePdf,
    fileInputRef,
}: PdfCanvasViewerProps) {
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentPath, setCurrentPath] = useState<Point[]>([]);
    const [dragStartPoint, setDragStartPoint] = useState<Point | null>(null);
    const [dragCurrentPoint, setDragCurrentPoint] = useState<Point | null>(null);

    interface FloatingTextInput {
        x: number;
        y: number;
        absoluteX: number;
        absoluteY: number;
    }
    const [activeTextInput, setActiveTextInput] = useState<FloatingTextInput | null>(null);
    const [textInputValue, setTextInputValue] = useState<string>('');

    interface FloatingPinInput {
        x: number;
        y: number;
        absoluteX: number;
        absoluteY: number;
    }
    const [activePinInput, setActivePinInput] = useState<FloatingPinInput | null>(null);
    const [pinInputValue, setPinInputValue] = useState<string>('');

    const [draggedPinId, setDraggedPinId] = useState<string | null>(null);
    const [hoveredPinId, setHoveredPinId] = useState<string | null>(null);
    const [annotationsBeforeDrag, setAnnotationsBeforeDrag] = useState<Record<number, PageAnnotations> | null>(null);

    const [isRendering, setIsRendering] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);
    const renderTaskRef = useRef<any>(null);

    const convertToUnrotated = useCallback((x: number, y: number, rot: number) => {
        const normalizedRot = ((rot % 360) + 360) % 360;
        if (normalizedRot === 90) {
            return { x: y, y: 1 - x };
        } else if (normalizedRot === 180) {
            return { x: 1 - x, y: 1 - y };
        } else if (normalizedRot === 270) {
            return { x: 1 - y, y: x };
        }
        return { x, y };
    }, []);

    const convertToRotated = useCallback((x: number, y: number, rot: number) => {
        const normalizedRot = ((rot % 360) + 360) % 360;
        if (normalizedRot === 90) {
            return { x: 1 - y, y: x };
        } else if (normalizedRot === 180) {
            return { x: 1 - x, y: 1 - y };
        } else if (normalizedRot === 270) {
            return { x: y, y: 1 - x };
        }
        return { x, y };
    }, []);

    const getRotatedRect = useCallback((x: number, y: number, w: number, h: number, rot: number) => {
        const p1 = convertToRotated(x, y, rot);
        const p2 = convertToRotated(x + w, y + h, rot);
        return {
            x: Math.min(p1.x, p2.x),
            y: Math.min(p1.y, p2.y),
            width: Math.abs(p2.x - p1.x),
            height: Math.abs(p2.y - p1.y),
        };
    }, [convertToRotated]);

    const drawAnnotationsToContext = useCallback((
        context: CanvasRenderingContext2D,
        cssWidth: number,
        cssHeight: number,
        pageAnnos: PageAnnotations,
        rot: number,
    ) => {
        const drawings = pageAnnos.drawings || [];
        const texts = pageAnnos.texts || [];
        const rectangles = pageAnnos.rectangles || [];
        const circles = pageAnnos.circles || [];
        const pins = pageAnnos.pins || [];
        const checkmarks = pageAnnos.checkmarks || [];
        const crosses = pageAnnos.crosses || [];

        drawings.forEach((path) => {
            if (path.points.length === 0) {
                return;
            }

            context.beginPath();
            context.strokeStyle = path.color;
            context.lineWidth = path.width;
            context.lineCap = 'round';
            context.lineJoin = 'round';

            const firstPointRot = convertToRotated(path.points[0].x, path.points[0].y, rot);
            context.moveTo(firstPointRot.x * cssWidth, firstPointRot.y * cssHeight);

            for (let i = 1; i < path.points.length; i++) {
                const ptRot = convertToRotated(path.points[i].x, path.points[i].y, rot);
                context.lineTo(ptRot.x * cssWidth, ptRot.y * cssHeight);
            }

            context.stroke();
        });

        texts.forEach((text) => {
            context.fillStyle = text.color;
            context.font = `bold ${text.fontSize}px sans-serif`;
            context.textBaseline = 'top';
            const ptRot = convertToRotated(text.x, text.y, rot);
            context.fillText(text.text, ptRot.x * cssWidth, ptRot.y * cssHeight);
        });

        rectangles.forEach((rect) => {
            context.beginPath();
            context.strokeStyle = rect.color;
            context.lineWidth = rect.strokeWidth;
            const rotRect = getRotatedRect(rect.x, rect.y, rect.width, rect.height, rot);
            context.strokeRect(
                rotRect.x * cssWidth,
                rotRect.y * cssHeight,
                rotRect.width * cssWidth,
                rotRect.height * cssHeight,
            );
        });

        circles.forEach((circle) => {
            context.beginPath();
            context.strokeStyle = circle.color;
            context.lineWidth = circle.strokeWidth;
            const rotCircle = getRotatedRect(circle.x, circle.y, circle.width, circle.height, rot);
            const rx = (rotCircle.width * cssWidth) / 2;
            const ry = (rotCircle.height * cssHeight) / 2;
            const cx = rotCircle.x * cssWidth + rx;
            const cy = rotCircle.y * cssHeight + ry;
            context.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
            context.stroke();
        });

        pins.forEach((pin) => {
            const ptRot = convertToRotated(pin.x, pin.y, rot);
            const px = ptRot.x * cssWidth;
            const py = ptRot.y * cssHeight;

            context.save();
            context.translate(px, py);

            context.beginPath();
            context.ellipse(0, 0, 4, 1.5, 0, 0, 2 * Math.PI);
            context.fillStyle = 'rgba(0, 0, 0, 0.2)';
            context.fill();

            context.beginPath();
            context.moveTo(0, 0);
            context.bezierCurveTo(-6, -10, -8, -14, -8, -18);
            context.arc(0, -18, 8, Math.PI, 0, false);
            context.bezierCurveTo(8, -14, 6, -10, 0, 0);
            context.closePath();
            context.fillStyle = pin.color;
            context.fill();
            context.lineWidth = 1.5;
            context.strokeStyle = '#ffffff';
            context.stroke();

            context.beginPath();
            context.arc(0, -18, 2.5, 0, 2 * Math.PI);
            context.fillStyle = '#ffffff';
            context.fill();

            if (pin.label) {
                context.font = 'bold 11px sans-serif';
                const textWidth = context.measureText(pin.label).width;

                context.beginPath();
                context.fillStyle = 'rgba(0, 0, 0, 0.75)';

                if (typeof (context as any).roundRect === 'function') {
                    (context as any).roundRect(12, -26, textWidth + 8, 16, 4);
                } else {
                    context.rect(12, -26, textWidth + 8, 16);
                }

                context.fill();

                context.fillStyle = '#ffffff';
                context.textBaseline = 'middle';
                context.fillText(pin.label, 16, -18);
            }

            context.restore();
        });

        checkmarks.forEach((chk) => {
            const ptRot = convertToRotated(chk.x, chk.y, rot);
            const cx = ptRot.x * cssWidth;
            const cy = ptRot.y * cssHeight;
            const size = chk.size || 24;

            context.save();
            context.beginPath();
            context.strokeStyle = chk.color;
            context.lineWidth = 3.5;
            context.lineCap = 'round';
            context.lineJoin = 'round';

            const startX = cx - size * 0.4;
            const startY = cy + size * 0.05;
            const midX = cx - size * 0.1;
            const midY = cy + size * 0.35;
            const endX = cx + size * 0.4;
            const endY = cy - size * 0.35;

            context.moveTo(startX, startY);
            context.lineTo(midX, midY);
            context.lineTo(endX, endY);
            context.stroke();
            context.restore();
        });

        crosses.forEach((crs) => {
            const ptRot = convertToRotated(crs.x, crs.y, rot);
            const cx = ptRot.x * cssWidth;
            const cy = ptRot.y * cssHeight;
            const size = crs.size || 24;

            context.save();
            context.beginPath();
            context.strokeStyle = crs.color;
            context.lineWidth = 3.5;
            context.lineCap = 'round';
            context.lineJoin = 'round';

            const half = size * 0.35;

            context.moveTo(cx - half, cy - half);
            context.lineTo(cx + half, cy + half);

            context.moveTo(cx + half, cy - half);
            context.lineTo(cx - half, cy + half);

            context.stroke();
            context.restore();
        });
    }, [convertToRotated, getRotatedRect]);

    const drawOverlay = useCallback(() => {
        const canvas = overlayCanvasRef.current;
        if (!canvas || !pdfDoc) {
            return;
        }

        const context = canvas.getContext('2d');
        if (!context) {
            return;
        }

        context.clearRect(0, 0, canvas.width, canvas.height);

        const pdfCanvas = canvasRef.current;
        if (pdfCanvas) {
            canvas.width = pdfCanvas.width;
            canvas.height = pdfCanvas.height;
            canvas.style.width = pdfCanvas.style.width;
            canvas.style.height = pdfCanvas.style.height;
        }

        const width = canvas.width;
        const height = canvas.height;
        const pixelRatio = window.devicePixelRatio || 1;
        const cssWidth = width / pixelRatio;
        const cssHeight = height / pixelRatio;

        context.save();
        context.scale(pixelRatio, pixelRatio);

        const pageAnnos = pageAnnotations[pageNumber] || {
            drawings: [],
            texts: [],
            rectangles: [],
            circles: [],
            pins: [],
            checkmarks: [],
            crosses: [],
        };

        drawAnnotationsToContext(context, cssWidth, cssHeight, pageAnnos, rotation);

        if (isDrawing && activeTool === 'draw' && currentPath.length > 0) {
            context.beginPath();
            context.strokeStyle = brushColor;
            context.lineWidth = brushWidth;
            context.lineCap = 'round';
            context.lineJoin = 'round';

            const firstPointRot = convertToRotated(currentPath[0].x, currentPath[0].y, rotation);
            context.moveTo(firstPointRot.x * cssWidth, firstPointRot.y * cssHeight);

            for (let i = 1; i < currentPath.length; i++) {
                const ptRot = convertToRotated(currentPath[i].x, currentPath[i].y, rotation);
                context.lineTo(ptRot.x * cssWidth, ptRot.y * cssHeight);
            }

            context.stroke();
        }

        if (isDrawing && activeTool === 'rectangle' && dragStartPoint && dragCurrentPoint) {
            const rotRect = getRotatedRect(
                dragStartPoint.x,
                dragStartPoint.y,
                dragCurrentPoint.x - dragStartPoint.x,
                dragCurrentPoint.y - dragStartPoint.y,
                rotation
            );

            context.beginPath();
            context.strokeStyle = brushColor;
            context.lineWidth = brushWidth;
            context.strokeRect(
                rotRect.x * cssWidth,
                rotRect.y * cssHeight,
                rotRect.width * cssWidth,
                rotRect.height * cssHeight,
            );
        }

        if (isDrawing && activeTool === 'circle' && dragStartPoint && dragCurrentPoint) {
            const rotCircle = getRotatedRect(
                dragStartPoint.x,
                dragStartPoint.y,
                dragCurrentPoint.x - dragStartPoint.x,
                dragCurrentPoint.y - dragStartPoint.y,
                rotation
            );

            context.beginPath();
            context.strokeStyle = brushColor;
            context.lineWidth = brushWidth;
            const rx = (rotCircle.width * cssWidth) / 2;
            const ry = (rotCircle.height * cssHeight) / 2;
            const cx = rotCircle.x * cssWidth + rx;
            const cy = rotCircle.y * cssHeight + ry;
            context.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
            context.stroke();
        }

        context.restore();
    }, [
        pageNumber,
        pageAnnotations,
        isDrawing,
        currentPath,
        brushColor,
        brushWidth,
        pdfDoc,
        activeTool,
        dragStartPoint,
        dragCurrentPoint,
        rotation,
        drawAnnotationsToContext,
        convertToRotated,
        getRotatedRect,
        overlayCanvasRef,
        canvasRef,
    ]);

    useEffect(() => {
        drawOverlay();
    }, [
        pageNumber,
        pageAnnotations,
        isDrawing,
        currentPath,
        brushColor,
        brushWidth,
        scale,
        rotation,
        drawOverlay,
    ]);

    const renderPage = useCallback(async (
        pageNum: number,
        docInstance: pdfjsLib.PDFDocumentProxy,
        currentScale: number,
        currentRotation: number,
    ) => {
        if (!canvasRef.current || !docInstance) {
            return;
        }

        if (renderTaskRef.current) {
            renderTaskRef.current.cancel();
        }

        setIsRendering(true);
        setLocalError(null);
        let currentRenderTask: any = null;

        try {
            const page = await docInstance.getPage(pageNum);
            const viewport = page.getViewport({
                scale: currentScale,
                rotation: currentRotation,
            });

            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (!context) {
                setIsRendering(false);
                return;
            }

            const pixelRatio = window.devicePixelRatio || 1;
            canvas.width = viewport.width * pixelRatio;
            canvas.height = viewport.height * pixelRatio;
            canvas.style.width = `${viewport.width}px`;
            canvas.style.height = `${viewport.height}px`;

            const overlayCanvas = overlayCanvasRef.current;
            if (overlayCanvas) {
                overlayCanvas.width = canvas.width;
                overlayCanvas.height = canvas.height;
                overlayCanvas.style.width = canvas.style.width;
                overlayCanvas.style.height = canvas.style.height;
            }

            context.scale(pixelRatio, pixelRatio);

            const renderContext = {
                canvas: canvas,
                canvasContext: context,
                viewport: viewport,
            };

            currentRenderTask = page.render(renderContext as any);
            renderTaskRef.current = currentRenderTask;

            await currentRenderTask.promise;

            if (renderTaskRef.current === currentRenderTask) {
                renderTaskRef.current = null;
            }
            setIsRendering(false);
            drawOverlay();
        } catch (err: any) {
            if (err?.name !== 'RenderingCancelledException') {
                console.error('Page render error:', err);
                setLocalError(`Gagal merender halaman: ${err?.message || err}`);
                setIsRendering(false);
            } else {
                if (renderTaskRef.current === currentRenderTask) {
                    setIsRendering(false);
                }
            }
        }
    }, [drawOverlay, canvasRef, overlayCanvasRef]);

    useEffect(() => {
        if (pdfDoc) {
            renderPage(pageNumber, pdfDoc, scale, rotation);
        }
    }, [pageNumber, pdfDoc, scale, rotation, renderPage]);

    const handleEraserClick = (clickX: number, clickY: number, isDragging = false) => {
        const updateFunction = (prev: Record<number, PageAnnotations>) => {
            const pageAnnos = prev[pageNumber];
            if (!pageAnnos) {
                return prev;
            }

            let newDrawings: DrawPath[] = [];
            if (isDragging) {
                (pageAnnos.drawings || []).forEach((path) => {
                    let currentSegment: { x: number; y: number }[] = [];
                    path.points.forEach((p) => {
                        const dx = p.x - clickX;
                        const dy = p.y - clickY;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < 0.025) {
                            if (currentSegment.length > 1) {
                                newDrawings.push({
                                    ...path,
                                    points: currentSegment,
                                });
                            }
                            currentSegment = [];
                        } else {
                            currentSegment.push(p);
                        }
                    });
                    if (currentSegment.length > 1) {
                        newDrawings.push({
                            ...path,
                            points: currentSegment,
                        });
                    }
                });
            } else {
                newDrawings = (pageAnnos.drawings || []).filter((path) => {
                    const isNear = path.points.some((p) => {
                        const dx = p.x - clickX;
                        const dy = p.y - clickY;
                        return Math.sqrt(dx * dx + dy * dy) < 0.025;
                    });
                    return !isNear;
                });
            }

            const newTexts = (pageAnnos.texts || []).filter((text) => {
                const dx = text.x - clickX;
                const dy = text.y - clickY;
                return Math.sqrt(dx * dx + dy * dy) > 0.04;
            });

            const newRectangles = (pageAnnos.rectangles || []).filter((rect) => {
                const isInside =
                    clickX >= rect.x - 0.02 &&
                    clickX <= rect.x + rect.width + 0.02 &&
                    clickY >= rect.y - 0.02 &&
                    clickY <= rect.y + rect.height + 0.02;
                return !isInside;
            });

            const newCircles = (pageAnnos.circles || []).filter((circle) => {
                const cx = circle.x + circle.width / 2;
                const cy = circle.y + circle.height / 2;
                const dx = cx - clickX;
                const dy = cy - clickY;
                const rx = circle.width / 2;
                const ry = circle.height / 2;
                const isInside =
                    (dx * dx) / ((rx + 0.02) * (rx + 0.02)) +
                        (dy * dy) / ((ry + 0.02) * (ry + 0.02)) <=
                    1;
                return !isInside;
            });

            const newPins = (pageAnnos.pins || []).filter((pin) => {
                const dx = pin.x - clickX;
                const dy = pin.y - clickY;
                return Math.sqrt(dx * dx + dy * dy) > 0.03;
            });

            const newCheckmarks = (pageAnnos.checkmarks || []).filter((chk) => {
                const dx = chk.x - clickX;
                const dy = chk.y - clickY;
                return Math.sqrt(dx * dx + dy * dy) > 0.03;
            });

            const newCrosses = (pageAnnos.crosses || []).filter((crs) => {
                const dx = crs.x - clickX;
                const dy = crs.y - clickY;
                return Math.sqrt(dx * dx + dy * dy) > 0.03;
            });

            return {
                ...prev,
                [pageNumber]: {
                    drawings: newDrawings,
                    texts: newTexts,
                    rectangles: newRectangles,
                    circles: newCircles,
                    pins: newPins,
                    checkmarks: newCheckmarks,
                    crosses: newCrosses,
                },
            };
        };

        if (isDragging) {
            setPageAnnotations(updateFunction);
        } else {
            setPast((prev) => [...prev, pageAnnotations]);
            setFuture([]);
            setPageAnnotations(updateFunction);
        }
    };

    const commitTextInput = () => {
        if (!activeTextInput || !textInputValue.trim()) {
            setActiveTextInput(null);
            return;
        }

        const newText: TextAnnotation = {
            id: Math.random().toString(36).substring(2, 11),
            text: textInputValue,
            x: activeTextInput.x,
            y: activeTextInput.y,
            color: brushColor,
            fontSize: textFontSize,
        };

        const pageAnnos = pageAnnotations[pageNumber] || {
            drawings: [],
            texts: [],
            rectangles: [],
            circles: [],
            pins: [],
        };
        const updated = {
            ...pageAnnotations,
            [pageNumber]: {
                ...pageAnnos,
                drawings: pageAnnos.drawings || [],
                texts: [...(pageAnnos.texts || []), newText],
                rectangles: pageAnnos.rectangles || [],
                circles: pageAnnos.circles || [],
                pins: pageAnnos.pins || [],
            },
        };
        updateAnnotations(updated);
        setActiveTextInput(null);
        setTextInputValue('');
    };

    const commitPinInput = () => {
        if (!activePinInput) {
            return;
        }

        const newPin: PinAnnotation = {
            id: Math.random().toString(36).substring(2, 11),
            x: activePinInput.x,
            y: activePinInput.y,
            color: brushColor,
            label: pinInputValue.trim() || undefined,
        };

        const pageAnnos = pageAnnotations[pageNumber] || {
            drawings: [],
            texts: [],
            rectangles: [],
            circles: [],
            pins: [],
        };
        const updated = {
            ...pageAnnotations,
            [pageNumber]: {
                ...pageAnnos,
                drawings: pageAnnos.drawings || [],
                texts: pageAnnos.texts || [],
                rectangles: pageAnnos.rectangles || [],
                circles: pageAnnos.circles || [],
                pins: [...(pageAnnos.pins || []), newPin],
            },
        };
        updateAnnotations(updated);
        setActivePinInput(null);
        setPinInputValue('');
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!pdfDoc || !overlayCanvasRef.current) {
            return;
        }

        if (activeTextInput) {
            commitTextInput();
            return;
        }

        if (activePinInput) {
            commitPinInput();
            return;
        }

        const canvas = overlayCanvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const absoluteX = e.clientX - rect.left;
        const absoluteY = e.clientY - rect.top;
        const x = absoluteX / rect.width;
        const y = absoluteY / rect.height;
        const { x: unrotX, y: unrotY } = convertToUnrotated(x, y, rotation);

        if (activeTool === 'select') {
            const pageAnnos = pageAnnotations[pageNumber];
            if (pageAnnos && pageAnnos.pins) {
                const clickedPin = pageAnnos.pins.find((pin) => {
                    const dx = pin.x - unrotX;
                    const dy = pin.y - unrotY;
                    return Math.sqrt(dx * dx + dy * dy) < 0.03;
                });
                if (clickedPin) {
                    setDraggedPinId(clickedPin.id);
                    setAnnotationsBeforeDrag(pageAnnotations);
                }
            }
        } else if (activeTool === 'draw') {
            setIsDrawing(true);
            setCurrentPath([{ x: unrotX, y: unrotY }]);
        } else if (activeTool === 'text') {
            setActiveTextInput({
                x: unrotX,
                y: unrotY,
                absoluteX,
                absoluteY,
            });
            setTextInputValue('');
        } else if (activeTool === 'rectangle' || activeTool === 'circle') {
            setIsDrawing(true);
            setDragStartPoint({ x: unrotX, y: unrotY });
            setDragCurrentPoint({ x: unrotX, y: unrotY });
        } else if (activeTool === 'pin') {
            setActivePinInput({
                x: unrotX,
                y: unrotY,
                absoluteX,
                absoluteY,
            });
            setPinInputValue('');
        } else if (activeTool === 'checkmark') {
            const newCheckmark = {
                id: `checkmark_${Date.now()}`,
                x: unrotX,
                y: unrotY,
                color: brushColor,
                size: 24,
            };
            const pageAnnos = pageAnnotations[pageNumber] || { drawings: [], texts: [] };
            const updated = {
                ...pageAnnotations,
                [pageNumber]: {
                    ...pageAnnos,
                    checkmarks: [...(pageAnnos.checkmarks || []), newCheckmark],
                },
            };
            updateAnnotations(updated);
        } else if (activeTool === 'cross') {
            const newCross = {
                id: `cross_${Date.now()}`,
                x: unrotX,
                y: unrotY,
                color: brushColor,
                size: 24,
            };
            const pageAnnos = pageAnnotations[pageNumber] || { drawings: [], texts: [] };
            const updated = {
                ...pageAnnotations,
                [pageNumber]: {
                    ...pageAnnos,
                    crosses: [...(pageAnnos.crosses || []), newCross],
                },
            };
            updateAnnotations(updated);
        } else if (activeTool === 'eraser') {
            handleEraserClick(unrotX, unrotY, false);
        } else if (activeTool === 'brush_eraser') {
            setIsDrawing(true);
            setAnnotationsBeforeDrag(pageAnnotations);
            handleEraserClick(unrotX, unrotY, true);
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!overlayCanvasRef.current) {
            return;
        }

        const canvas = overlayCanvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const absoluteX = e.clientX - rect.left;
        const absoluteY = e.clientY - rect.top;
        const x = absoluteX / rect.width;
        const y = absoluteY / rect.height;
        const { x: unrotX, y: unrotY } = convertToUnrotated(x, y, rotation);

        if (draggedPinId) {
            const updatedPins = (pageAnnotations[pageNumber]?.pins || []).map((pin) => {
                if (pin.id === draggedPinId) {
                    return {
                        ...pin,
                        x: Math.max(0, Math.min(1, unrotX)),
                        y: Math.max(0, Math.min(1, unrotY)),
                    };
                }
                return pin;
            });
            setPageAnnotations((prev) => ({
                ...prev,
                [pageNumber]: {
                    ...prev[pageNumber],
                    pins: updatedPins,
                },
            }));
            return;
        }

        if (activeTool === 'select') {
            const pageAnnos = pageAnnotations[pageNumber];
            if (pageAnnos && pageAnnos.pins) {
                const nearPin = pageAnnos.pins.find((pin) => {
                    const dx = pin.x - unrotX;
                    const dy = pin.y - unrotY;
                    return Math.sqrt(dx * dx + dy * dy) < 0.03;
                });
                setHoveredPinId(nearPin ? nearPin.id : null);
            } else {
                setHoveredPinId(null);
            }
            return;
        }

        if (!isDrawing) {
            return;
        }

        if (activeTool === 'draw') {
            setCurrentPath((prev) => [...prev, { x: unrotX, y: unrotY }]);
        } else if (activeTool === 'rectangle' || activeTool === 'circle') {
            setDragCurrentPoint({ x: unrotX, y: unrotY });
        } else if (activeTool === 'brush_eraser') {
            handleEraserClick(unrotX, unrotY, true);
        }
    };

    const handleMouseUp = () => {
        if (draggedPinId) {
            if (annotationsBeforeDrag) {
                setPast((prev) => [...prev, annotationsBeforeDrag]);
                setFuture([]);
            }
            setDraggedPinId(null);
            setAnnotationsBeforeDrag(null);
            return;
        }

        if (!isDrawing) {
            return;
        }

        setIsDrawing(false);

        if (activeTool === 'draw') {
            if (currentPath.length > 1) {
                const newPath: DrawPath = {
                    points: currentPath,
                    color: brushColor,
                    width: brushWidth,
                };

                const pageAnnos = pageAnnotations[pageNumber] || {
                    drawings: [],
                    texts: [],
                    rectangles: [],
                    circles: [],
                    pins: [],
                };
                const updated = {
                    ...pageAnnotations,
                    [pageNumber]: {
                        ...pageAnnos,
                        drawings: [...(pageAnnos.drawings || []), newPath],
                    },
                };
                updateAnnotations(updated);
            }
            setCurrentPath([]);
        } else if (
            (activeTool === 'rectangle' || activeTool === 'circle') &&
            dragStartPoint &&
            dragCurrentPoint
        ) {
            const x = Math.min(dragStartPoint.x, dragCurrentPoint.x);
            const y = Math.min(dragStartPoint.y, dragCurrentPoint.y);
            const width = Math.abs(dragStartPoint.x - dragCurrentPoint.x);
            const height = Math.abs(dragStartPoint.y - dragCurrentPoint.y);

            if (width > 0.005 && height > 0.005) {
                const newId = Math.random().toString(36).substring(2, 11);
                const pageAnnos = pageAnnotations[pageNumber] || {
                    drawings: [],
                    texts: [],
                    rectangles: [],
                    circles: [],
                    pins: [],
                };

                const updated = { ...pageAnnotations };

                if (activeTool === 'rectangle') {
                    const newRect: RectangleAnnotation = {
                        id: newId,
                        x,
                        y,
                        width,
                        height,
                        color: brushColor,
                        strokeWidth: brushWidth,
                    };
                    updated[pageNumber] = {
                        ...pageAnnos,
                        rectangles: [...(pageAnnos.rectangles || []), newRect],
                    };
                } else {
                    const newCircle: CircleAnnotation = {
                        id: newId,
                        x,
                        y,
                        width,
                        height,
                        color: brushColor,
                        strokeWidth: brushWidth,
                    };
                    updated[pageNumber] = {
                        ...pageAnnos,
                        circles: [...(pageAnnos.circles || []), newCircle],
                    };
                }

                updateAnnotations(updated);
            }

            setDragStartPoint(null);
            setDragCurrentPoint(null);
        } else if (activeTool === 'brush_eraser') {
            if (annotationsBeforeDrag) {
                if (JSON.stringify(annotationsBeforeDrag) !== JSON.stringify(pageAnnotations)) {
                    setPast((prev) => [...prev, annotationsBeforeDrag]);
                    setFuture([]);
                }
                setAnnotationsBeforeDrag(null);
            }
        }
    };

    const finalError = error || localError;

    return (
        <div ref={viewportRef} className="relative flex flex-1 min-h-0 items-start justify-center overflow-auto p-8 bg-gray-100 dark:bg-zinc-900">
            {isGeneratingPdf && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm dark:bg-[#0a0a0a]/70">
                    <div className="flex w-80 flex-col items-center rounded-2xl border border-gray-200/50 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-[#161615]">
                        <svg className="h-10 w-10 animate-spin text-[#f53003] dark:text-[#FF4433]" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <h3 className="mt-4 font-semibold text-sm">Menyiapkan Dokumen</h3>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Menggabungkan anotasi... {pdfGenProgress}%
                        </p>
                        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/5">
                            <div
                                className="h-full bg-[#f53003] transition-all duration-300 dark:bg-[#FF4433]"
                                style={{ width: `${pdfGenProgress}%` }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {finalError && (
                <div className="max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-800 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-300">
                    <svg className="mx-auto h-12 w-12 text-red-500/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h3 className="mt-3 font-semibold">Terdapat Kendala Pemuatan</h3>
                    <p className="mt-1 text-xs text-red-600/90 dark:text-red-400/90">{finalError}</p>
                    <button
                        onClick={loadSamplePdf}
                        className="mt-4 rounded-lg bg-red-800 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-900"
                    >
                        Gunakan PDF Sampel
                    </button>
                </div>
            )}

            {!pdfDoc && !finalError && (
                <div className="max-w-sm rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-[#161615]">
                    <svg className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-3 font-semibold">Memuat Dokumen PDF...</h3>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Mohon tunggu sebentar, file PDF sedang diproses.
                    </p>
                    <div className="mt-5 flex justify-center gap-2">
                        <button
                            onClick={loadSamplePdf}
                            className="rounded-lg border border-gray-200 px-3.5 py-2 text-xs font-semibold transition-colors hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5"
                        >
                            Gunakan Sampel
                        </button>
                    </div>
                </div>
            )}

            {isRendering && (
                <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-semibold shadow-md backdrop-blur dark:bg-[#161615]/90 z-20">
                    <svg className="h-3.5 w-3.5 animate-spin text-[#f53003] dark:text-[#FF4433]" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Merender dokumen...</span>
                </div>
            )}

            <div className={`relative rounded-lg bg-white shadow-2xl dark:bg-[#1e1e1d] ${!pdfDoc || finalError ? 'hidden' : 'block'}`}>
                <canvas ref={canvasRef} className="max-w-full rounded-lg" />
                <canvas
                    ref={overlayCanvasRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    className={`absolute top-0 left-0 z-10 max-w-full rounded-lg pointer-events-auto ${
                        draggedPinId
                            ? 'cursor-grabbing'
                            : hoveredPinId
                              ? 'cursor-grab'
                              : activeTool === 'select'
                                ? 'cursor-default'
                                : ['draw', 'rectangle', 'circle'].includes(activeTool)
                                  ? 'cursor-crosshair'
                                  : activeTool === 'text'
                                    ? 'cursor-text'
                                    : ['eraser', 'brush_eraser', 'pin'].includes(activeTool)
                                      ? 'cursor-pointer'
                                      : 'cursor-default'
                    }`}
                />

                {activeTextInput && (
                    <div
                        className="absolute z-30 flex flex-col items-stretch rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-white/10 dark:bg-[#161615]"
                        style={{
                            left: `${activeTextInput.absoluteX}px`,
                            top: `${activeTextInput.absoluteY}px`,
                        }}
                    >
                        <textarea
                            value={textInputValue}
                            onChange={(e) => setTextInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    commitTextInput();
                                } else if (e.key === 'Escape') {
                                    setActiveTextInput(null);
                                }
                            }}
                            autoFocus
                            placeholder="Ketik teks..."
                            rows={2}
                            className="w-48 resize-none rounded border border-gray-200 bg-transparent p-1.5 text-xs text-inherit focus:border-[#f53003] focus:outline-none dark:border-white/10"
                            style={{
                                color: brushColor,
                                fontSize: `${textFontSize}px`,
                            }}
                        />
                        <div className="mt-1 flex justify-end gap-1">
                            <button
                                onClick={() => setActiveTextInput(null)}
                                className="rounded px-2 py-0.5 text-[10px] hover:bg-gray-100 dark:hover:bg-white/5"
                            >
                                Batal
                            </button>
                            <button
                                onClick={commitTextInput}
                                className="rounded bg-[#f53003] px-2 py-0.5 text-[10px] text-white hover:bg-red-600 dark:bg-[#FF4433] dark:hover:bg-red-500"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                )}

                {activePinInput && (
                    <div
                        className="absolute z-30 flex flex-col items-stretch rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-white/10 dark:bg-[#161615]"
                        style={{
                            left: `${activePinInput.absoluteX}px`,
                            top: `${activePinInput.absoluteY}px`,
                        }}
                    >
                        <input
                            type="text"
                            value={pinInputValue}
                            onChange={(e) => setPinInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    commitPinInput();
                                } else if (e.key === 'Escape') {
                                    setActivePinInput(null);
                                }
                            }}
                            autoFocus
                            placeholder="Label pin (opsional)..."
                            className="w-48 rounded border border-gray-200 bg-transparent p-1.5 text-xs text-inherit focus:border-[#f53003] focus:outline-none dark:border-white/10"
                            style={{
                                color: brushColor,
                            }}
                        />
                        <div className="mt-1.5 flex justify-end gap-1">
                            <button
                                onClick={() => setActivePinInput(null)}
                                className="rounded px-2 py-0.5 text-[10px] hover:bg-gray-100 dark:hover:bg-white/5"
                            >
                                Batal
                            </button>
                            <button
                                onClick={commitPinInput}
                                className="rounded bg-[#f53003] px-2 py-0.5 text-[10px] text-white hover:bg-red-600 dark:bg-[#FF4433] dark:hover:bg-red-500"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
