<script lang="ts">
	import Skeleton from '../Skeleton.svelte';
	import { Calendar, Clock, Info } from 'lucide-svelte';

	let { releases = [], loading = false } = $props();

	const defaultReleases = [
		{ id: '1', title: '새 앨범 발매', when: '오늘 18:00' },
		{ id: '2', title: '싱글 릴리즈', when: '내일 12:00' },
		{ id: '3', title: 'EP 발매', when: '금요일 20:00' },
		{ id: '4', title: '컴필레이션', when: '다음주 월요일' }
	];

	const displayReleases = releases.length > 0 ? releases : defaultReleases;
</script>

<div class="card-base h-[396px] flex flex-col justify-between p-5 rounded-lg bg-surface-2 border border-border-subtle overflow-hidden pt-[24px]">
	<div class="flex-1 min-h-0">
		<!-- 상단 타이틀영역 -->
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-lg font-bold text-text-strong truncate">오늘 발매 일정</h3>
			<button class="inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-surface-1 transition-colors ml-2" aria-label="정보" title="당일 중심 일정" type="button">
				<Info size={12} class="text-text-muted" />
			</button>
		</div>

		<!-- 중간 요약 영역 -->
		<div class="grid grid-cols-3 gap-2 mb-3">
			<div class="h-8 bg-surface-inner rounded flex items-center justify-center px-2">
				<span class="text-xs text-text-muted truncate">오늘: 2</span>
			</div>
			<div class="h-8 bg-surface-inner rounded flex items-center justify-center px-2">
				<span class="text-xs text-text-muted truncate">이번주: 5</span>
			</div>
			<div class="h-8 bg-surface-inner rounded flex items-center justify-center px-2">
				<span class="text-xs text-text-muted truncate">이번달: 12</span>
			</div>
		</div>

		<!-- 메인 목록/컨텐츠: 줄/행 개수 무조건 동일, 남는 줄은 placeholder -->
		<div class="grid grid-rows-4 gap-3 min-h-0">
			{#if loading}
				<Skeleton lines={2} />
			{:else}
				{#each displayReleases.slice(0, 4) as release (release.id)}
					<a
						href="/releases/{release.id}"
						class="flex items-center h-12 px-4 bg-surface-inner rounded min-w-0"
					>
						<!-- 좌측 아이콘 -->
						<span class="flex-shrink-0 w-5 h-5 flex items-center justify-center mr-3">
							<Calendar size={16} class="text-text-base flex-shrink-0" />
						</span>
						<!-- 중간 텍스트 (좌측정렬) -->
						<span class="flex-1 text-sm text-text-base truncate text-left min-w-0">{release.title}</span>
						<!-- 우측 상태/버튼 -->
						<span class="flex-shrink-0 flex items-center gap-x-2 ml-2">
							<span class="text-xs text-text-muted whitespace-nowrap">{release.when}</span>
						</span>
					</a>
				{/each}
				{#if displayReleases.length < 4}
					{#each Array.from({length: 4 - displayReleases.length}) as _, i}
						<div class="flex items-center h-12 px-4 bg-surface-inner rounded min-w-0" aria-hidden="true">
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
			<!-- 좌측 액션 버튼이 필요한 경우 여기에 추가 -->
		</div>
		<a href="/releases" class="text-brand-pink text-sm font-semibold px-2 py-1 rounded hover:bg-hover-cyan transition-colors">더보기</a>
	</div>
</div>
