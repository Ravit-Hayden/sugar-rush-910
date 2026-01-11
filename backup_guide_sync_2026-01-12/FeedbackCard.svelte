<script lang="ts">
	import Skeleton from '../Skeleton.svelte';
	import { MessageSquare, Info } from 'lucide-svelte';

	let { feedback = [], loading = false } = $props();

	const defaultFeedback = [
		{ id: '1', text: '좋은 음악이네요!', from: 'El' },
		{ id: '2', text: '다음 앨범 기대됩니다', from: 'Otte' },
		{ id: '3', text: '음질이 훌륭합니다', from: 'El' },
		{ id: '4', text: '아트워크가 멋져요', from: 'Otte' }
	];

	const displayFeedback = feedback.length > 0 ? feedback : defaultFeedback;

	function getAuthorColor(author: string) {
		switch (author) {
			case 'El':
				return 'text-elotte-green';
			case 'Otte':
				return 'text-elotte-orange';
			default:
				return 'text-text-muted';
		}
	}
</script>

<div class="card-base h-[396px] flex flex-col justify-between p-5 rounded-lg bg-surface-2 border border-border-subtle overflow-hidden pt-[24px]">
	<div>
		<!-- 상단 타이틀영역 -->
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-lg font-bold text-text-strong truncate">피드백</h3>
			<button class="inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-surface-1 transition-colors ml-2" aria-label="정보" title="코멘트/리뷰" type="button">
				<Info size={12} class="text-text-muted" />
			</button>
		</div>

		<!-- 중간 요약 영역 -->
		<div class="grid grid-cols-3 gap-2 mb-3">
			<div class="h-8 bg-surface-1 rounded flex items-center justify-center px-2">
				<span class="text-xs text-text-muted truncate">오늘: 2</span>
			</div>
			<div class="h-8 bg-surface-1 rounded flex items-center justify-center px-2">
				<span class="text-xs text-text-muted truncate">이번주: 8</span>
			</div>
			<div class="h-8 bg-surface-1 rounded flex items-center justify-center px-2">
				<span class="text-xs text-text-muted truncate">이번달: 24</span>
			</div>
		</div>

		<!-- 메인 목록/컨텐츠: 줄/행 개수 무조건 동일, 남는 줄은 placeholder -->
		<div class="grid grid-rows-4 gap-3 min-h-0">
			{#if loading}
				<Skeleton lines={2} />
			{:else}
				{#each displayFeedback.slice(0, 4) as item (item.id)}
					<a
						href="/feedback/{item.id}"
						class="flex items-center gap-2 p-3 bg-surface-1 rounded hover:bg-surface-2 transition-colors h-full min-w-0"
					>
						<MessageSquare size={16} class="text-text-base flex-shrink-0" />
						<span class="text-sm text-text-base text-center flex-1 truncate min-w-0">{item.text}</span>
						<span class="text-xs flex-shrink-0 {getAuthorColor(item.from)} whitespace-nowrap">{item.from}</span>
					</a>
				{/each}
				{#if displayFeedback.length < 4}
					{#each Array.from({length: 4 - displayFeedback.length}) as _, i}
						<div class="p-3 bg-surface-1 rounded h-full opacity-0 pointer-events-none">&nbsp;</div>
					{/each}
				{/if}
			{/if}
		</div>
	</div>

	<!-- 하단 액션 -->
	<a href="/feedback" class="self-end text-brand-pink font-semibold text-sm px-4 py-1 rounded transition-colors hover:bg-hover-cyan mt-3">
		더보기
	</a>
</div>
