<script lang="ts">
	import { Info } from 'lucide-svelte';

	let { title, tooltip, children, class: className = '' } = $props();
</script>

<div class="h-80 min-w-0 flex flex-col bg-surface-2 border border-border-subtle rounded-lg p-4 overflow-y-auto {className}">
	<!-- 상단: 핵심 액션 버튼 (자세히 보기) -->
	<div class="flex flex-row justify-end mb-3 flex-shrink-0">
		<button class="text-brand-pink font-semibold text-sm px-4 py-2 rounded transition-colors hover:bg-hover-cyan">
			자세히 보기
		</button>
	</div>

	<!-- 타이틀: 바로 아래 배치 -->
	<div class="mb-3 flex-shrink-0">
		<div class="flex items-center justify-between">
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
	</div>

	<!-- 중앙: 주요 내용 (flex-1 min-h-0 overflow-hidden) -->
	<div class="flex-1 min-h-0 overflow-y-auto">
		{@render children?.()}
	</div>
</div>

