import type { AttendanceData } from '@/types/attendance';
import { createFormStore } from './createFormStore';

export const useAttendanceStore = createFormStore<AttendanceData>();
