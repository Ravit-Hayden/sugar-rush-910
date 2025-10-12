<script lang="ts">
	import Skeleton from '../Skeleton.svelte';
	import { Info } from 'lucide-svelte';

	let { changes = [], loading = false } = $props();

	const defaultChanges = [
		{ id: '1', text: '앨범 아트워크 업데이트', recent: true, time: '2시간 전' },
		{ id: '2', text: '트랙 메타데이터 수정', recent: false, time: '1일 전' },
		{ id: '3', text: '릴리즈 일정 변경', recent: true, time: '3시간 전' },
		{ id: '4', text: '가격 정책 업데이트', recent: false, time: '2일 전' }
	];

	const displayChanges = changes.length > 0 ? changes : defaultChanges;

	const miniStats = [
		{ label: '오늘', value: changes.filter(c => c.today).length },
		{ label: '이번주', value: changes.filter(c => c.thisWeek).length },
		{ label: '이번달', value: changes.filter(c => c.thisMonth).length }
	];
</script>

<div class="h-[380px] flex flex-col justify-between p-5 rounded-lg bg-surface-2 border border-border-subtle overflow-hidden pt-[24px]">
	<div>
		<!-- 상단 타이틀영역 -->
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-lg font-bold text-text-strong truncate">최근 변경</h3>
			<button class="inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-surface-1 transition-colors ml-2" aria-label="정보" title="편집·배포·정책 변경 요약">
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
				{#each displayChanges.slice(0, 4) as change, i (change.id)}
					<a
						href="/changes/{change.id}"
						class="flex items-center gap-2 p-3 bg-surface-1 rounded hover:bg-surface-2 transition-colors h-full"
					>
						<span class="text-sm text-text-base text-center flex-1">{change.text}</span>
						{#if change.recent}
							<span class="text-[10px] px-2 py-0.5 rounded text-white flex-shrink-0" style="background-color: var(--ok-fg);">최근</span>
						{/if}
						<span class="text-xs text-text-muted flex-shrink-0 truncate">{change.time}</span>
					</a>
				{/each}
				{#if displayChanges.length < 4}
					{#each Array.from({length: 4 - displayChanges.length}) as _, i}
						<div class="p-3 bg-surface-1 rounded h-full opacity-0 pointer-events-none">&nbsp;</div>
					{/each}
				{/if}
			{/if}
		</div>
	</div>

	<!-- 하단 액션 -->
	<a href="/changes" class="self-end text-brand-pink font-semibold text-sm px-4 py-1 rounded transition-colors hover:bg-hover-cyan mt-3">
		자세히 보기
	</a>
</div>
