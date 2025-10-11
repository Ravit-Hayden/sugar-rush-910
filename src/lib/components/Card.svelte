<script lang="ts">
	import { Info } from 'lucide-svelte';

	let { title, tooltip, children, class: className = '' } = $props();
</script>

<div class="h-80 min-w-0 flex flex-col bg-surface-2 border border-border-subtle rounded-lg p-4 overflow-hidden {className}">
	<!-- 카드 헤더 -->
	<div class="mb-4 flex-shrink-0">
		<div class="flex items-center justify-between">
			<h3 class="text-lg font-bold text-text-strong truncate">{title}</h3>
			{#if tooltip}
				<button
					class="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-surface-1 transition-colors flex-shrink-0 ml-2"
					aria-label="정보"
					title={tooltip}
				>
					<Info size={12} class="text-text-muted" />
				</button>
			{/if}
		</div>
	</div>

	<!-- 카드 내용 -->
	<div class="flex-1 min-h-0">
		{@render children?.()}
	</div>
</div>

