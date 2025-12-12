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
			
			// 자동 제거 (duration > 0일 때만)
			if (duration > 0) {
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



