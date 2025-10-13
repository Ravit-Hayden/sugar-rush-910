<script lang="ts">
	import Skeleton from '../Skeleton.svelte';
	import { Info, FileText } from 'lucide-svelte';

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

<div class="h-[396px] flex flex-col justify-between p-5 rounded-lg bg-surface-2 border border-border-subtle overflow-hidden pt-[24px]">
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
						class="flex items-center h-12 px-4 bg-surface-1 rounded hover:bg-surface-2 transition-colors"
					>
						<!-- 좌측 아이콘 -->
						<span class="flex-shrink-0 w-5 h-5 flex items-center justify-center mr-3">
							<FileText size={16} class="text-text-base flex-shrink-0" />
						</span>
						<!-- 중간 텍스트 (좌측정렬) -->
						<span class="flex-1 text-sm text-text-base truncate text-left">{change.text}</span>
						<!-- 우측 상태/버튼 -->
						<span class="flex-shrink-0 flex items-center gap-x-2">
							{#if change.recent}
								<span class="text-[10px] px-2 py-0.5 rounded text-white" style="background-color: var(--ok-fg);">최근</span>
							{/if}
							<span class="text-xs text-text-muted truncate">{change.time}</span>
						</span>
					</a>
				{/each}
				{#if displayChanges.length < 4}
					{#each Array.from({length: 4 - displayChanges.length}) as _, i}
						<div class="h-12 px-4 bg-surface-1 rounded opacity-0 pointer-events-none">&nbsp;</div>
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
