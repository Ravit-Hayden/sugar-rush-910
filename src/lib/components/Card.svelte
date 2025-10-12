<script lang="ts">
	import { Info } from 'lucide-svelte';

	let { title, tooltip, children, class: className = '' } = $props();
</script>

<div class="min-w-0 flex flex-col justify-between bg-surface-2 border border-border-subtle rounded-lg p-5 overflow-hidden {className}">
	<!-- 상단영역: 타이틀+info -->
	<div class="flex items-center justify-between">
		<h3 class="text-lg font-bold text-text-strong truncate">{title}</h3>
		{#if tooltip}
			<button
				class="inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-surface-1 transition-colors ml-2"
				aria-label="정보"
				title={tooltip}
			>
				<Info size={12} class="text-text-muted" />
			</button>
		{/if}
	</div>

	<!-- 중간영역: 콘텐츠 -->
	<div class="flex-1 flex flex-col justify-center">
		{@render children?.()}
	</div>
</div>

