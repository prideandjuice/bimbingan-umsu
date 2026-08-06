import * as pdfjsLib from 'pdfjs-dist';

export interface FileMetadata {
    name: string;
    size: string;
    totalPages: number;
    status: 'idle' | 'loading' | 'loaded' | 'error';
}

export type Tool =
    | 'select'
    | 'draw'
    | 'text'
    | 'rectangle'
    | 'circle'
    | 'pin'
    | 'checkmark'
    | 'cross'
    | 'eraser'
    | 'brush_eraser';

export interface Point {
    x: number;
    y: number;
}

export interface DrawPath {
    points: Point[];
    color: string;
    width: number;
}

export interface TextAnnotation {
    id: string;
    text: string;
    x: number;
    y: number;
    color: string;
    fontSize: number;
}

export interface RectangleAnnotation {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    strokeWidth: number;
}

export interface CircleAnnotation {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    strokeWidth: number;
}

export interface PinAnnotation {
    id: string;
    x: number;
    y: number;
    color: string;
    label?: string;
}

export interface CheckmarkAnnotation {
    id: string;
    x: number;
    y: number;
    color: string;
    size: number;
}

export interface CrossAnnotation {
    id: string;
    x: number;
    y: number;
    color: string;
    size: number;
}

export interface PageAnnotations {
    drawings: DrawPath[];
    texts: TextAnnotation[];
    rectangles?: RectangleAnnotation[];
    circles?: CircleAnnotation[];
    pins?: PinAnnotation[];
    checkmarks?: CheckmarkAnnotation[];
    crosses?: CrossAnnotation[];
}

export interface DbDocument {
    id: number;
    user_id: number | null;
    filename: string;
    original_name: string;
    path: string;
    size: number;
    created_at: string;
    updated_at: string;
    json_filename: string;
}
