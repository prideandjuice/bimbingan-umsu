import { create } from 'zustand';
import type { Shift } from '@/types/shift';

interface ShiftStore {
    isModalOpen: boolean;
    isEditMode: boolean;
    selectedShift: Shift | null;
    setIsModalOpen: (isOpen: boolean) => void;
    setIsEditMode: (isEditMode: boolean) => void;
    setSelectedShift: (shift: Shift | null) => void;
    openAdd: () => void;
    openEdit: (shift: Shift) => void;
}

export const useShiftStore = create<ShiftStore>((set) => ({
    isModalOpen: false,
    isEditMode: false,
    selectedShift: null,
    setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
    setIsEditMode: (isEditMode) => set({ isEditMode }),
    setSelectedShift: (shift) => set({ selectedShift: shift }),
    openAdd: () => set({ isModalOpen: true, isEditMode: false, selectedShift: null }),
    openEdit: (shift) => set({ isModalOpen: true, isEditMode: true, selectedShift: shift }),
}));
