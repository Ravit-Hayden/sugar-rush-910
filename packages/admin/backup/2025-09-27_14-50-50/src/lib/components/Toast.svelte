<script lang="ts">
	import { onMount } from 'svelte';
	import { X, CheckCircle, AlertCircle, XCircle } from 'lucide-svelte';

	export let message: string;
	export let type: 'success' | 'error' | 'warning' = 'success';
	export let duration: number = 3000;

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
	}

	onMount(() => {
		visible = true;
		if (duration > 0) {
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
		class="fixed top-20 right-4 z-50 bg-surface-2 border border-border-subtle rounded-lg p-4 shadow-lg max-w-sm"
		role="alert"
		aria-live="polite"
	>
		<div class="flex items-start gap-3">
			<svelte:component this={getIcon()} size={20} style="color: {getColor()}" />
			<div class="flex-1">
				<p class="text-sm text-text-base">{message}</p>
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
