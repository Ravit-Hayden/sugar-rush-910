<script lang="ts">
	import { Info } from 'lucide-svelte';

	export let title: string;
	export let tooltip: string = '';
	export let href: string = '';
	export let isKpi: boolean = false;

	let showTooltip = false;
</script>

<div class="bg-surface-2 border border-border-subtle rounded-lg p-4 {isKpi ? 'h-80' : 'h-72'} flex flex-col">
	<!-- 카드 헤더 -->
	<div class="flex items-center justify-between mb-3">
		<h3 class="text-text-strong font-semibold text-sm">{title}</h3>
		{#if tooltip}
			<div class="relative">
				<button
					on:mouseenter={() => showTooltip = true}
					on:mouseleave={() => showTooltip = false}
					on:focus={() => showTooltip = true}
					on:blur={() => showTooltip = false}
					class="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-surface-1 transition-colors duration-200"
					aria-label="정보"
				>
					<Info size={12} class="text-text-muted" />
				</button>
				{#if showTooltip}
					<div
						role="tooltip"
						class="absolute top-6 left-1/2 transform -translate-x-1/2 bg-surface-1 border border-border-subtle rounded-md px-2 py-1 text-xs text-text-base whitespace-nowrap z-50"
					>
						{tooltip}
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<!-- 카드 내용 -->
	<div class="flex-1 overflow-hidden">
		<slot />
	</div>

	<!-- 카드 하단 링크 -->
	{#if href}
		<div class="mt-3 pt-3 border-t border-border-subtle">
			<a
				href={href}
				class="text-xs text-brand-pink hover:text-hover-cyan transition-colors duration-200"
			>
				모두 보기 →
			</a>
		</div>
	{/if}
</div>
