import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'warning';

export interface Toast {
	id: string;
	message: string;
	type: ToastType;
	duration?: number;
	action?: {
		label: string;
		callback: () => void;
	};
	dismissAction?: {
		label: string;
		callback?: () => void;
	};
}

const createToastStore = () => {
	const { subscribe, update }: Writable<Toast[]> = writable([]);

	return {
		subscribe,
		add: (message: string, type: ToastType = 'success', duration: number = 3000, action?: { label: string; callback: () => void }, dismissAction?: { label: string; callback?: () => void }) => {
			const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
			const toast: Toast = { id, message, type, duration, action, dismissAction };
			
			update((toasts) => [...toasts, toast]);
			
			// 자동 제거 (duration > 0일 때만 실행)
			// duration이 명시적으로 0이면 무한 지속 (자동으로 사라지지 않음)
			// duration이 undefined이면 기본값 3000ms로 자동 제거
			if (duration !== undefined && duration > 0) {
				setTimeout(() => {
					update((toasts) => toasts.filter((t) => t.id !== id));
				}, duration);
			}
			
			return id;
		},
		remove: (id: string) => {
			update((toasts) => toasts.filter((t) => t.id !== id));
		},
		clear: () => {
			update(() => []);
		}
	};
};

export const toast = createToastStore();



