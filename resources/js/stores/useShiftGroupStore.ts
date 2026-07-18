import { create } from 'zustand';
import type { ShiftGroup } from '@/types/shift-group';

interface ShiftGroupStore {
    isModalOpen: boolean;
    isEditMode: boolean;
    isGenerateModalOpen: boolean;
    selectedShiftGroup: ShiftGroup | null;
    setIsModalOpen: (isOpen: boolean) => void;
    setIsEditMode: (isEditMode: boolean) => void;
    setIsGenerateModalOpen: (isOpen: boolean) => void;
    setSelectedShiftGroup: (shiftGroup: ShiftGroup | null) => void;
    openAdd: () => void;
    openEdit: (shiftGroup: ShiftGroup) => void;
    openGenerate: () => void;
}

export const useShiftGroupStore = create<ShiftGroupStore>((set) => ({
    isModalOpen: false,
    isEditMode: false,
    isGenerateModalOpen: false,
    selectedShiftGroup: null,
    setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
    setIsEditMode: (isEditMode) => set({ isEditMode }),
    setIsGenerateModalOpen: (isOpen) => set({ isGenerateModalOpen: isOpen }),
    setSelectedShiftGroup: (shiftGroup) => set({ selectedShiftGroup: shiftGroup }),
    openAdd: () => set({ isModalOpen: true, isEditMode: false, selectedShiftGroup: null }),
    openEdit: (shiftGroup) => set({ isModalOpen: true, isEditMode: true, selectedShiftGroup: shiftGroup }),
    openGenerate: () => set({ isGenerateModalOpen: true }),
}));
