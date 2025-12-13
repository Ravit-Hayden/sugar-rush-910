<script lang="ts">
	import { onMount } from 'svelte';
	import { X, CheckCircle, AlertCircle, XCircle } from 'lucide-svelte';

	export let message: string;
	export let type: 'success' | 'error' | 'warning' = 'success';
	export let duration: number = 3000;
	export let onClose: (() => void) | undefined = undefined;
	export let action: { label: string; callback: () => void } | undefined = undefined;
	export let dismissAction: { label: string; callback?: () => void } | undefined = undefined;

	let visible = false;
	let timeoutId: ReturnType<typeof setTimeout>;

	function getIcon() {
		switch (type) {
			case 'success':
				return CheckCircle;
			case 'warning':
				return AlertCircle;
			case 'error':
				return XCircle;
			default:
				return CheckCircle;
		}
	}

	function getColor() {
		switch (type) {
			case 'success':
				return 'var(--ok-fg)';
			case 'warning':
				return 'var(--warn-fg)';
			case 'error':
				return 'var(--danger-fg)';
			default:
				return 'var(--ok-fg)';
		}
	}

	function close() {
		visible = false;
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		if (onClose) {
			onClose();
		}
	}

	onMount(() => {
		visible = true;
		// duration이 0이거나 undefined이면 자동으로 닫히지 않음
		// duration이 명시적으로 0이면 무한 지속
		if (duration !== undefined && duration > 0) {
			timeoutId = setTimeout(close, duration);
		}
		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	});
</script>

{#if visible}
	<div 
		class="bg-surface-2 border border-border-subtle rounded-lg p-4 shadow-lg max-w-sm animate-in fade-in slide-in-from-right-2 duration-200"
		role="alert"
		aria-live="polite"
	>
		<div class="flex items-start gap-3">
			<svelte:component this={getIcon()} size={20} style="color: {getColor()}" class="toast-icon" />
			<div class="flex-1">
				<p class="text-sm text-text-base">{message}</p>
				{#if action || dismissAction}
					<div class="mt-2 flex gap-2">
						{#if action}
							<button
								onclick={() => {
									action.callback();
									close();
								}}
								class="px-3 py-1.5 text-xs font-medium bg-brand-pink text-white rounded-md hover:bg-brand-pink/90 focus:bg-brand-pink focus-visible:bg-brand-pink focus:outline-none focus:ring-0 transition-colors duration-200"
							>
								{action.label}
							</button>
						{/if}
						{#if dismissAction}
							<button
								onclick={() => {
									if (dismissAction.callback) {
										dismissAction.callback();
									}
									close();
								}}
								class="toast-dismiss-button px-3 py-1.5 text-xs font-medium bg-surface-2 text-text-base rounded-md border border-border-subtle hover:bg-surface-1 transition-colors duration-200"
							>
								{dismissAction.label}
							</button>
						{/if}
					</div>
				{/if}
			</div>
			<button
				onclick={close}
				class="inline-flex items-center justify-center w-5 h-5 rounded hover:bg-surface-1 transition-colors"
				aria-label="닫기"
			>
				<X size={14} class="text-text-muted" />
			</button>
		</div>
	</div>
{/if}
