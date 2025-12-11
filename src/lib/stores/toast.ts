import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'warning';

export interface Toast {
	id: string;
	message: string;
	type: ToastType;
	duration?: number;
}

const createToastStore = () => {
	const { subscribe, update }: Writable<Toast[]> = writable([]);

	return {
		subscribe,
		add: (message: string, type: ToastType = 'success', duration: number = 3000) => {
			const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
			const toast: Toast = { id, message, type, duration };
			
			update((toasts) => [...toasts, toast]);
			
			// 자동 제거
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

