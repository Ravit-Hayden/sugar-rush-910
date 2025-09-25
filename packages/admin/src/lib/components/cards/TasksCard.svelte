<script lang="ts">
	import Card from '../Card.svelte';
	import { CheckCircle, Clock, AlertCircle } from 'lucide-svelte';

	// 목 데이터
	const tasks = [
		{ id: 1, title: '앨범 아트워크 검토', priority: true, due: '오늘' },
		{ id: 2, title: '트랙 메타데이터 수정', priority: false, due: '내일' },
		{ id: 3, title: '발매 일정 확인', priority: true, due: '3일 후' },
		{ id: 4, title: '수익 정산 검토', priority: false, due: '1주일 후' }
	];
</script>

<Card title="할 일 · 멘션" tooltip="내가 해야 할 업무와 호출 멘션 요약" href="/tasks">
	<!-- 미니 통계 -->
	<div class="grid grid-cols-3 gap-2 mb-3">
		<div class="text-center">
			<div class="text-xs text-text-muted">열림</div>
			<div class="text-sm font-semibold text-text-strong">4</div>
		</div>
		<div class="text-center">
			<div class="text-xs text-text-muted">오늘</div>
			<div class="text-sm font-semibold text-text-strong">2</div>
		</div>
		<div class="text-center">
			<div class="text-xs text-text-muted">지연</div>
			<div class="text-sm font-semibold text-danger-fg">0</div>
		</div>
	</div>

	<!-- 할 일 목록 -->
	<div class="space-y-2">
		{#each tasks.slice(0, 4) as task}
			<div class="flex items-center gap-2 text-sm">
				{#if task.priority}
					<span class="md:hidden inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-danger-fg text-black">
						우선
					</span>
				{/if}
				<span class="text-text-base flex-1">{task.title}</span>
				<span class="text-text-muted text-xs">{task.due}</span>
			</div>
		{/each}
	</div>

	<!-- 전환 버튼 -->
	<div class="flex justify-end gap-2 mt-3">
		<a href="/tasks/new" class="text-xs text-brand-pink hover:text-hover-cyan">새 태스크</a>
		<a href="/mentions" class="text-xs text-brand-pink hover:text-hover-cyan">멘션</a>
	</div>
</Card>
