import type { MdmData } from '@/types/mdm';
import { createFormStore } from './createFormStore';

export const useMdmStore = createFormStore<MdmData>();
