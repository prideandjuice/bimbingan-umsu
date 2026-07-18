import React from 'react';
import Modal from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: React.ReactNode;
    confirmText?: string;
    loading?: boolean;
    variant?: 'destructive' | 'default' | 'success' | 'warning';
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = 'Konfirmasi Hapus',
    description,
    confirmText = 'Hapus',
    loading = false,
    variant = 'destructive'
}: ConfirmModalProps) {
    const getIcon = () => {
        switch (variant) {
            case 'success':
                return <CheckCircle className="h-6 w-6 text-emerald-500" />;
            case 'warning':
                return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
            case 'default':
                return <Info className="h-6 w-6 text-primary" />;
            case 'destructive':
            default:
                return <AlertTriangle className="h-6 w-6 text-destructive" />;
        }
    };

    const getIconBg = () => {
        switch (variant) {
            case 'success':
                return 'bg-emerald-500/10';
            case 'warning':
                return 'bg-yellow-500/10';
            case 'default':
                return 'bg-primary/10';
            case 'destructive':
            default:
                return 'bg-destructive/10';
        }
    };

    const getButtonVariant = () => {
        if (variant === 'destructive') return 'destructive';
        return 'default';
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            maxWidth="100"
        >
            <div className="flex flex-col items-center">
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${getIconBg()}`}>
                    {getIcon()}
                </div>
                <h2 className="mb-2 text-center text-lg font-semibold">{title}</h2>
                <div className="mb-6 text-center text-sm text-muted-foreground">
                    {description || 'Apakah Anda yakin ingin menghapus data ini?'}
                </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                <Button variant="outline" onClick={onClose} disabled={loading} className="sm:w-24">
                    Batal
                </Button>
                <Button variant={getButtonVariant()} onClick={onConfirm} disabled={loading} className="sm:w-32">
                    {loading ? 'Memproses...' : confirmText}
                </Button>
            </div>
        </Modal>
    );
}
