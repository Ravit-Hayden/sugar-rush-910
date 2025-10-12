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

<div class="h-[380px] flex flex-col justify-between p-5 rounded-lg bg-surface-2 border border-border-subtle overflow-hidden pt-[24px]">
	<div>
		<!-- 상단 타이틀영역 -->
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-lg font-bold text-text-strong truncate">오늘 발매 일정</h3>
			<button class="inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-surface-1 transition-colors ml-2" aria-label="정보" title="당일 중심 일정">
				<Info size={12} class="text-text-muted" />
			</button>
		</div>

		<!-- 중간 요약 영역 -->
		<div class="grid grid-cols-3 gap-2 mb-3">
			<div class="h-12 bg-surface-1 rounded flex items-center justify-center px-2">
				<span class="text-xs text-text-muted truncate">오늘: 2</span>
			</div>
			<div class="h-12 bg-surface-1 rounded flex items-center justify-center px-2">
				<span class="text-xs text-text-muted truncate">이번주: 5</span>
			</div>
			<div class="h-12 bg-surface-1 rounded flex items-center justify-center px-2">
				<span class="text-xs text-text-muted truncate">이번달: 12</span>
			</div>
		</div>

		<!-- 메인 목록/컨텐츠: 줄/행 개수 무조건 동일, 남는 줄은 placeholder -->
		<div class="grid grid-rows-4 gap-3">
			{#if loading}
				<Skeleton lines={2} />
			{:else}
				{#each displayReleases.slice(0, 4) as release (release.id)}
					<a
						href="/releases/{release.id}"
						class="flex items-center gap-2 p-3 bg-surface-1 rounded hover:bg-surface-2 transition-colors h-full"
					>
						<Calendar size={16} class="text-text-base flex-shrink-0" />
						<span class="text-sm text-text-base text-center flex-1">{release.title}</span>
						<span class="text-xs text-text-muted flex-shrink-0 truncate">{release.when}</span>
					</a>
				{/each}
				{#if displayReleases.length < 4}
					{#each Array.from({length: 4 - displayReleases.length}) as _, i}
						<div class="p-3 bg-surface-1 rounded h-full opacity-0 pointer-events-none">&nbsp;</div>
					{/each}
				{/if}
			{/if}
		</div>
	</div>

	<!-- 하단 액션 -->
	<a href="/releases" class="self-end text-brand-pink font-semibold text-sm px-4 py-1 rounded transition-colors hover:bg-hover-cyan mt-3">
		자세히 보기
	</a>
</div>
