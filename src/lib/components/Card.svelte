<script lang="ts">
	import { Info } from 'lucide-svelte';

	let { title, tooltip, children, class: className = '' } = $props();
</script>

<div class="h-80 min-w-0 flex flex-col bg-surface-2 border border-border-subtle rounded-lg p-4 overflow-y-auto {className}">
	<!-- 카드 헤더 -->
	<div class="flex items-center justify-between mb-3 flex-shrink-0">
		<h3 class="text-lg font-bold text-text-strong">{title}</h3>
		{#if tooltip}
			<button
				class="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-surface-1 transition-colors"
				aria-label="정보"
				title={tooltip}
			>
				<Info size={12} class="text-text-muted" />
			</button>
		{/if}
	</div>

	<!-- 카드 내용 -->
	<div class="flex-1 min-h-0">
		{@render children?.()}
	</div>
</div>

