<script lang="ts">
	import Skeleton from '../Skeleton.svelte';
	import { FileText, Clock, Info } from 'lucide-svelte';

	let { logs = [], loading = false } = $props();

	const defaultLogs = [
		{ id: '1', text: '사용자 로그인 성공', time: '5분 전' },
		{ id: '2', text: '파일 업로드 완료', time: '12분 전' },
		{ id: '3', text: 'API 요청 처리', time: '18분 전' },
		{ id: '4', text: '데이터베이스 백업', time: '1시간 전' }
	];

	const displayLogs = logs.length > 0 ? logs : defaultLogs;
</script>

<div class="h-[396px] flex flex-col justify-between p-5 rounded-lg bg-surface-2 border border-border-subtle overflow-hidden pt-[24px]">
	<div>
		<!-- 상단 타이틀영역 -->
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-lg font-bold text-text-strong truncate">시스템 로그</h3>
			<button class="inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-surface-1 transition-colors ml-2" aria-label="정보" title="운영 이벤트" type="button">
				<Info size={12} class="text-text-muted" />
			</button>
		</div>

		<!-- 중간 요약 영역 -->
		<div class="grid grid-cols-3 gap-2 mb-3">
			<div class="h-8 bg-surface-1 rounded flex items-center justify-center px-2">
				<span class="text-xs text-text-muted truncate">오늘: 3</span>
			</div>
			<div class="h-8 bg-surface-1 rounded flex items-center justify-center px-2">
				<span class="text-xs text-text-muted truncate">이번주: 12</span>
			</div>
			<div class="h-8 bg-surface-1 rounded flex items-center justify-center px-2">
				<span class="text-xs text-text-muted truncate">이번달: 45</span>
			</div>
		</div>

		<!-- 메인 목록/컨텐츠: 줄/행 개수 무조건 동일, 남는 줄은 placeholder -->
		<div class="grid grid-rows-4 gap-3 min-h-0">
			{#if loading}
				<Skeleton lines={2} />
			{:else}
				{#each displayLogs.slice(0, 4) as log (log.id)}
					<a
						href="/logs/{log.id}"
						class="flex items-center h-12 px-4 bg-surface-1 rounded hover:bg-surface-2 transition-colors min-w-0"
					>
						<!-- 좌측 아이콘 -->
						<span class="flex-shrink-0 w-5 h-5 flex items-center justify-center mr-3">
							<FileText size={16} class="text-text-base flex-shrink-0" />
						</span>
						<!-- 중간 텍스트 (좌측정렬) -->
						<span class="flex-1 text-sm text-text-base truncate text-left min-w-0">{log.text}</span>
						<!-- 우측 상태/버튼 -->
						<span class="flex-shrink-0 flex items-center gap-x-2 ml-2">
							<span class="text-xs text-text-muted whitespace-nowrap">{log.time}</span>
						</span>
					</a>
				{/each}
				{#if displayLogs.length < 4}
					{#each Array.from({length: 4 - displayLogs.length}) as _, i}
						<div class="h-12 px-4 bg-surface-1 rounded opacity-0 pointer-events-none">&nbsp;</div>
					{/each}
				{/if}
			{/if}
		</div>
	</div>

	<!-- 하단 액션 -->
	<a href="/logs" class="self-end text-brand-pink text-sm font-semibold px-2 py-1 rounded hover:bg-hover-cyan transition-colors mt-3">
		자세히 보기
	</a>
</div>
