import { create } from 'zustand';
import { Location } from '@/types/location';

interface LocationState {
    locations: Location[];
    selectedLocation: Location | null;
    isModalOpen: boolean;
    isEditMode: boolean;
    setLocations: (locations: Location[]) => void;
    setSelectedLocation: (location: Location | null) => void;
    setIsModalOpen: (isOpen: boolean) => void;
    setIsEditMode: (isEdit: boolean) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
    locations: [],
    selectedLocation: null,
    isModalOpen: false,
    isEditMode: false,
    setLocations: (locations) => set({ locations }),
    setSelectedLocation: (location) => set({ selectedLocation: location }),
    setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
    setIsEditMode: (isEdit) => set({ isEditMode: isEdit }),
}));
