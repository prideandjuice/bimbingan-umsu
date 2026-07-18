import type { EmployeeData } from '@/types/employee';
import { createFormStore } from './createFormStore';

export const useEmployeeStore = createFormStore<EmployeeData>();
