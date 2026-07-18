import { create } from 'zustand';
import { Holiday } from '@/types/holiday';

interface HolidayState {
    isModalOpen: boolean;
    isEditMode: boolean;
    selectedHoliday: Holiday | null;
    setIsModalOpen: (isOpen: boolean) => void;
    setIsEditMode: (isEdit: boolean) => void;
    setSelectedHoliday: (holiday: Holiday | null) => void;
}

export const useHolidayStore = create<HolidayState>((set) => ({
    isModalOpen: false,
    isEditMode: false,
    selectedHoliday: null,
    setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
    setIsEditMode: (isEdit) => set({ isEditMode: isEdit }),
    setSelectedHoliday: (holiday) => set({ selectedHoliday: holiday }),
}));
