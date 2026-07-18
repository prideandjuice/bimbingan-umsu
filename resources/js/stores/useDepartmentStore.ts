import type { DepartmentData } from '@/types/department';
import { createFormStore } from './createFormStore';

export const useDepartmentStore = createFormStore<DepartmentData>();
