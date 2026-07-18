import type { PermissionData } from '@/types/permission';
import { createFormStore } from './createFormStore';

export const usePermissionStore = createFormStore<PermissionData>();
