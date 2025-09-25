<script lang="ts">
	import { onMount } from 'svelte';
	import { CheckCircle, AlertCircle, Info, X } from 'lucide-svelte';

	export let message: string = '';
	export let type: 'success' | 'error' | 'info' = 'info';
	export let duration: number = 3000;
	export let visible: boolean = false;

	let timeoutId: number;

	onMount(() => {
		if (visible && duration > 0) {
			timeoutId = setTimeout(() => {
				visible = false;
			}, duration);
		}
		return () => {
			if (timeoutId) clearTimeout(timeoutId);
		};
	});

	function closeToast() {
		visible = false;
		if (timeoutId) clearTimeout(timeoutId);
	}

	function getIcon() {
		switch (type) {
			case 'success': return CheckCircle;
			case 'error': return AlertCircle;
			case 'info': return Info;
			default: return Info;
		}
	}

	function getColorClass() {
		switch (type) {
			case 'success': return 'bg-ok-fg text-black';
			case 'error': return 'bg-danger-fg text-white';
			case 'info': return 'bg-brand-pink text-white';
			default: return 'bg-brand-pink text-white';
		}
	}
</script>

{#if visible}
	<div class="fixed top-20 right-6 z-50 max-w-sm">
		<div class="flex items-center gap-3 p-4 rounded-lg shadow-lg {getColorClass()}">
			<svelte:component this={getIcon()} size={20} />
			<span class="flex-1 text-sm font-medium">{message}</span>
			<button
				on:click={closeToast}
				class="ml-2 hover:opacity-70 transition-opacity"
				aria-label="닫기"
			>
				<X size={16} />
			</button>
		</div>
	</div>
{/if}
