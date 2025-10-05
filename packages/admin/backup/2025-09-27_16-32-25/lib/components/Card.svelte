<script lang="ts">
	import { Info } from 'lucide-svelte';

	let { title, tooltip, children, class: className = '' } = $props();
</script>

<div class="h-72 bg-surface-2 border border-border-subtle rounded-lg p-4 {className}">
	<!-- 카드 헤더 -->
	<div class="flex items-center justify-between mb-4">
		<h3 class="text-lg font-semibold text-text-strong">{title}</h3>
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
	<div class="h-[calc(100%-3rem)]">
		{@render children?.()}
	</div>
</div>

