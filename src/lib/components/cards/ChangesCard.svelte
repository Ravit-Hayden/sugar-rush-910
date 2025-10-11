<script lang="ts">
	import Card from '../Card.svelte';
	import Skeleton from '../Skeleton.svelte';
	import { History } from 'lucide-svelte';

	let { changes = [], loading = false } = $props();

	const miniStats = [
		{ label: '오늘', value: changes.filter(c => c.today).length },
		{ label: '이번주', value: changes.filter(c => c.thisWeek).length },
		{ label: '이번달', value: changes.filter(c => c.thisMonth).length }
	];
</script>

<Card title="최근 변경" tooltip="편집·배포·정책 변경 요약" class="h-80">
	{#if loading}
		<Skeleton lines={4} />
	{:else}
		<!-- 미니 통계 -->
		<div class="grid grid-cols-3 gap-2 mb-4">
		{#each miniStats as stat (stat.label)}
			<div class="h-8 bg-surface-1 rounded flex items-center justify-center">
				<span class="text-[11px] text-text-muted">{stat.label}: {stat.value}</span>
			</div>
		{/each}
		</div>

		<!-- 변경 목록 -->
		<div class="space-y-2 mb-4">
		{#each changes.slice(0, 4) as change (change.id)}
			<div class="flex items-center justify-between p-2 bg-surface-1 rounded">
				<div class="flex items-center gap-2">
					<span class="text-sm text-text-base">{change.text}</span>
					{#if change.recent}
						<span class="text-[10px] px-1 py-0.5 rounded text-white" style="background-color: var(--ok-fg);">최근</span>
					{/if}
				</div>
				<span class="text-xs text-text-muted">{change.time}</span>
			</div>
		{/each}
		</div>

		<!-- 전환 버튼 -->
		<div class="flex justify-end">
			<a href="/changes" class="btn-retry text-[10px] px-2 py-1">
				<History size={12} class="mr-1" />
				히스토리
			</a>
		</div>
	{/if}
</Card>
