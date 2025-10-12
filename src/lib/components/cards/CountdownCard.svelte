<script lang="ts">
	import Skeleton from '../Skeleton.svelte';
	import { Calendar, Plus, Info } from 'lucide-svelte';

	let { deadlines = [], loading = false } = $props();

	const defaultDeadlines = [
		{ id: '1', label: '앨범 발매', days: 3 },
		{ id: '2', label: '싱글 릴리즈', days: 7 },
		{ id: '3', label: 'EP 발매', days: 14 },
		{ id: '4', label: '컴필레이션', days: 21 }
	];

	const displayDeadlines = deadlines.length > 0 ? deadlines : defaultDeadlines;

	const miniStats = [
		{ label: '이번주', value: deadlines.filter(d => d.week).length },
		{ label: '마감 D-n', value: deadlines.filter(d => d.urgent).length },
		{ label: '예약 발매', value: deadlines.filter(d => d.scheduled).length }
	];
</script>

<div class="h-[380px] flex flex-col justify-between p-5 rounded-lg bg-surface-2 border border-border-subtle overflow-hidden pt-[24px]">
	<div>
		<!-- 상단 타이틀영역 -->
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-lg font-bold text-text-strong truncate">카운트다운(일정)</h3>
			<button class="inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-surface-1 transition-colors ml-2" aria-label="정보" title="예약 발매·마감 임박 일정 요약">
				<Info size={12} class="text-text-muted" />
			</button>
		</div>

		<!-- 중간 요약 영역 -->
		<div class="grid grid-cols-3 gap-2 mb-3">
			{#each miniStats as stat (stat.label)}
				<div class="h-8 bg-surface-1 rounded flex items-center justify-center px-2">
					<span class="text-xs text-text-muted truncate">{stat.label}: {stat.value}</span>
				</div>
			{/each}
		</div>

		<!-- 메인 목록/컨텐츠: 줄/행 개수 무조건 동일, 남는 줄은 placeholder -->
		<div class="grid grid-rows-4 gap-3">
			{#if loading}
				<Skeleton lines={2} />
			{:else}
				{#each displayDeadlines.slice(0, 4) as deadline (deadline.id)}
					<a
						href="/calendar/{deadline.id}"
						class="flex items-center gap-2 p-3 bg-surface-1 rounded hover:bg-surface-2 transition-colors h-full"
					>
						<span class="text-sm text-text-base text-center flex-1">{deadline.label}</span>
						<span class="text-[10px] px-2 py-0.5 rounded text-white flex-shrink-0" style="background-color: var(--tag-deadline);">
							D-{deadline.days}
						</span>
					</a>
				{/each}
				{#if displayDeadlines.length < 4}
					{#each Array.from({length: 4 - displayDeadlines.length}) as _, i}
						<div class="p-3 bg-surface-1 rounded h-full opacity-0 pointer-events-none">&nbsp;</div>
					{/each}
				{/if}
			{/if}
		</div>
	</div>

	<!-- 하단 액션 -->
	<div class="flex items-center justify-between">
		<div class="flex gap-x-2">
			<a href="/releases" class="text-[10px] px-2 py-1 flex items-center justify-center rounded-md bg-brand-pink hover:bg-hover-cyan text-white font-semibold h-[18px] min-w-[38px]">
				<Calendar size={12} class="mr-1" />
				<span>발매 관리</span>
			</a>
			<a href="/calendar/new" class="text-[10px] px-2 py-1 flex items-center justify-center rounded-md bg-brand-pink hover:bg-hover-cyan text-white font-semibold h-[18px] min-w-[38px]">
				<Plus size={12} class="mr-1" />
				<span>일정 추가</span>
			</a>
		</div>
		<a href="/calendar" class="text-brand-pink font-semibold text-sm px-4 py-1 rounded transition-colors hover:bg-hover-cyan">자세히 보기</a>
	</div>
</div>
