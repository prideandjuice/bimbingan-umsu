import type { PositionData } from '@/types/position';
import { createFormStore } from './createFormStore';

export const usePositionStore = createFormStore<PositionData>();
