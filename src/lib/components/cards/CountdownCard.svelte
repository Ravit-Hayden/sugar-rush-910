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

<div class="card-base h-[396px] flex flex-col justify-between p-5 rounded-lg bg-surface-2 border border-border-subtle overflow-hidden pt-[24px]">
	<div class="flex-1 min-h-0">
		<!-- 상단 타이틀영역 -->
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-lg font-bold text-text-strong truncate">카운트다운(일정)</h3>
			<button class="inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-surface-1 transition-colors ml-2" aria-label="정보" title="예약 발매·마감 임박 일정 요약" type="button">
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
		<div class="grid grid-rows-4 gap-3 min-h-0">
			{#if loading}
				<Skeleton lines={2} />
			{:else}
				{#each displayDeadlines.slice(0, 4) as deadline (deadline.id)}
					<a
						href="/calendar/{deadline.id}"
						class="flex items-center h-12 px-4 bg-surface-1 rounded min-w-0"
					>
						<!-- 좌측 아이콘 -->
						<span class="flex-shrink-0 w-5 h-5 flex items-center justify-center mr-3">
							<Calendar size={16} class="text-text-base flex-shrink-0" />
						</span>
						<!-- 중간 텍스트 (좌측정렬) -->
						<span class="flex-1 text-sm text-text-base truncate text-left min-w-0">{deadline.label}</span>
						<!-- 우측 상태/버튼 -->
						<span class="flex-shrink-0 flex items-center gap-x-2 ml-2">
							{#if deadline.days <= 1}
								<span class="badge-base badge-high-urgent whitespace-nowrap">D-{deadline.days}</span>
							{:else if deadline.days <= 3}
								<span class="badge-base badge-medium-yellow whitespace-nowrap">D-{deadline.days}</span>
							{:else}
								<span class="badge-base badge-low-mint whitespace-nowrap">D-{deadline.days}</span>
							{/if}
						</span>
					</a>
				{/each}
				{#if displayDeadlines.length < 4}
					{#each Array.from({length: 4 - displayDeadlines.length}) as _, i}
						<div class="flex items-center h-12 px-4 bg-surface-1 rounded min-w-0" aria-hidden="true">
							<span class="flex-shrink-0 w-5 h-5 flex items-center justify-center mr-3 text-text-muted">—</span>
							<span class="flex-1 text-sm text-text-muted truncate text-left min-w-0">—</span>
							<span class="flex-shrink-0 text-xs text-text-muted ml-2">—</span>
						</div>
					{/each}
				{/if}
			{/if}
		</div>
	</div>

	<!-- 하단 액션 -->
	<div class="flex items-center justify-between mt-3 flex-shrink-0">
		<div class="flex gap-x-2 flex-wrap items-center">
			<a href="/releases" class="inline-flex items-center pl-1.5 pr-2 py-1 rounded border border-brand-pink text-brand-pink text-xs font-medium hover:bg-brand-pink hover:text-white transition cursor-pointer" aria-label="발매 관리" title="발매 관리">
				<Calendar size={12} class="mr-1" />
				발매
			</a>
			<a href="/calendar/new" class="inline-flex items-center pl-1.5 pr-2 py-1 rounded border border-brand-pink text-brand-pink text-xs font-medium hover:bg-brand-pink hover:text-white transition cursor-pointer" aria-label="일정 추가" title="일정 추가">
				<Plus size={12} class="mr-1" />
				일정
			</a>
		</div>
		<a href="/calendar" class="text-brand-pink text-sm font-semibold px-2 py-1 rounded hover:bg-hover-cyan transition-colors">더보기</a>
	</div>
</div>
