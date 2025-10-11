<script lang="ts">
	import Card from '../Card.svelte';
	import Skeleton from '../Skeleton.svelte';
	import { Calendar, Plus } from 'lucide-svelte';

	let { deadlines = [], loading = false } = $props();

	const miniStats = [
		{ label: '이번주', value: deadlines.filter(d => d.week).length },
		{ label: '마감 D-n', value: deadlines.filter(d => d.urgent).length },
		{ label: '예약 발매', value: deadlines.filter(d => d.scheduled).length }
	];
</script>

<Card title="카운트다운(일정)" tooltip="예약 발매·마감 임박 일정 요약" class="h-80">
	{#if loading}
		<Skeleton lines={4} />
	{:else}
		<!-- 미니 통계 -->
		<div class="grid grid-cols-3 gap-2 mb-3">
		{#each miniStats as stat (stat.label)}
			<div class="h-8 bg-surface-1 rounded flex items-center justify-center">
				<span class="text-[11px] text-text-muted truncate">{stat.label}: {stat.value}</span>
			</div>
		{/each}
		</div>

		<!-- 카운트다운 목록 -->
		<div class="space-y-2 mb-3">
		{#each deadlines.slice(0, 3) as deadline (deadline.id)}
			<div class="flex items-center justify-between p-2 bg-surface-1 rounded">
				<div class="flex items-center gap-2 min-w-0 flex-1">
					<span class="text-sm text-text-base truncate">{deadline.label}</span>
					<span class="text-[10px] px-1 py-0.5 rounded text-white flex-shrink-0" style="background-color: var(--tag-deadline);">
						D-{deadline.days}
					</span>
				</div>
			</div>
		{/each}
		</div>

		<!-- 하단 액션 그룹 -->
		<div class="mt-auto flex flex-row justify-end gap-x-2 mb-2">
			<a href="/releases" class="text-[10px] px-2 py-1 flex items-center justify-center rounded-md bg-brand-pink hover:bg-hover-cyan text-white font-semibold h-[18px] min-w-[38px]">
				<Calendar size={12} class="mr-1" />
				<span>발매 관리</span>
			</a>
			<a href="/calendar/new" class="text-[10px] px-2 py-1 flex items-center justify-center rounded-md bg-brand-pink hover:bg-hover-cyan text-white font-semibold h-[18px] min-w-[38px]">
				<Plus size={12} class="mr-1" />
				<span>일정 추가</span>
			</a>
			<a href="/calendar" class="text-brand-pink font-semibold text-sm px-4 py-1 rounded transition-colors hover:bg-hover-cyan">
				자세히 보기
			</a>
		</div>
	{/if}
</Card>
