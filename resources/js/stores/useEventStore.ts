import type { EventData } from '@/types/event';
import { createFormStore } from './createFormStore';

export const useEventStore = createFormStore<EventData>();
