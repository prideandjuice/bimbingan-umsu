import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { cn } from '@/lib/utils';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode; // Tambahkan prop footer
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "100";
}

const maxWidthClass = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    "2xl": "sm:max-w-2xl",
    "4xl": "sm:max-w-4xl",
    "100": "sm:max-w-[400px]",
};

export default function Modal({
    isOpen,
    onClose,
    title,
    description,
    children,
    footer,
    maxWidth = "md",
}: ModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                className={cn(
                    "max-h-[90vh] flex flex-col p-0 gap-0",
                    maxWidthClass[maxWidth]
                )}
                onOpenAutoFocus={(e) => e.preventDefault()}
                onPointerDownOutside={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.closest('.select2-container') || target.closest('.select2-dropdown')) {
                        e.preventDefault();
                    }
                }}
                onInteractOutside={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.closest('.select2-container') || target.closest('.select2-dropdown')) {
                        e.preventDefault();
                    }
                }}
                onFocusOutside={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.closest('.select2-container') || target.closest('.select2-dropdown')) {
                        e.preventDefault();
                    }
                }}
            >
                {/* HEADER (FIXED) */}
                <DialogHeader className="p-6 pb-4 flex-none border-b">
                    {title ? (
                        <DialogTitle className="text-left">
                            {title}
                        </DialogTitle>
                    ) : (
                        <VisuallyHidden.Root>
                            <DialogTitle>Modal Dialog</DialogTitle>
                        </VisuallyHidden.Root>
                    )}

                    {description && (
                        <DialogDescription className="text-left">
                            {description}
                        </DialogDescription>
                    )}
                </DialogHeader>

                {/* CONTENT (SCROLLABLE) */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-50/30 dark:bg-black/30">
                    {children}
                </div>

                {/* FOOTER (FIXED) */}
                {footer && (
                    <div className="p-4 px-6 flex-none border-t bg-white dark:bg-black flex justify-end items-center gap-2">
                        {footer}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
