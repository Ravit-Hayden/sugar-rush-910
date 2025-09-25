<script lang="ts">
	import Card from '../Card.svelte';
	import { Calendar, Clock, Rocket } from 'lucide-svelte';

	// 목 데이터
	const deadlines = [
		{ id: 1, label: 'Sugar Rush Vol.2 발매', d: 'D-3' },
		{ id: 2, label: '앨범 아트워크 마감', d: 'D-1' },
		{ id: 3, label: '트랙 마스터링 완료', d: 'D-5' },
		{ id: 4, label: '프로모션 시작', d: 'D-7' }
	];
</script>

<Card title="카운트다운(마감 임박)" tooltip="예약 발매·마감 임박 일정 요약" href="/calendar">
	<!-- 미니 통계 -->
	<div class="grid grid-cols-3 gap-2 mb-3">
		<div class="text-center">
			<div class="text-xs text-text-muted">이번주</div>
			<div class="text-sm font-semibold text-text-strong">2</div>
		</div>
		<div class="text-center">
			<div class="text-xs text-text-muted">마감 D-n</div>
			<div class="text-sm font-semibold text-danger-fg">1</div>
		</div>
		<div class="text-center">
			<div class="text-xs text-text-muted">예약 발매</div>
			<div class="text-sm font-semibold text-text-strong">1</div>
		</div>
	</div>

	<!-- 카운트다운 목록 -->
	<div class="space-y-2">
		{#each deadlines.slice(0, 4) as deadline}
			<div class="flex items-center gap-2 text-sm">
				<span class="text-text-base flex-1">{deadline.label}</span>
				<span class="text-danger-fg font-semibold text-xs">{deadline.d}</span>
			</div>
		{/each}
	</div>

	<!-- 전환 버튼 -->
	<div class="flex justify-end gap-2 mt-3">
		<a href="/releases" class="text-xs text-brand-pink hover:text-hover-cyan">발매 관리</a>
		<a href="/calendar/new" class="text-xs text-brand-pink hover:text-hover-cyan">일정 추가</a>
	</div>
</Card>
