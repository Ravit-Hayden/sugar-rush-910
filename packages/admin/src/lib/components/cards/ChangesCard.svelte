<script lang="ts">
	import Card from '../Card.svelte';
	import { History, Edit, Upload, Settings } from 'lucide-svelte';

	// 목 데이터
	const changes = [
		{ id: 1, text: 'Sugar Rush Vol.2 메타데이터 수정', recent: true },
		{ id: 2, text: '앨범 아트워크 업데이트', recent: false },
		{ id: 3, text: '발매 정책 변경', recent: true },
		{ id: 4, text: '사용자 권한 설정 변경', recent: false }
	];
</script>

<Card title="최근 변경" tooltip="편집·배포·정책 변경 요약" href="/changes">
	<!-- 미니 통계 -->
	<div class="grid grid-cols-3 gap-2 mb-3">
		<div class="text-center">
			<div class="text-xs text-text-muted">오늘</div>
			<div class="text-sm font-semibold text-text-strong">2</div>
		</div>
		<div class="text-center">
			<div class="text-xs text-text-muted">이번주</div>
			<div class="text-sm font-semibold text-text-strong">3</div>
		</div>
		<div class="text-center">
			<div class="text-xs text-text-muted">이번달</div>
			<div class="text-sm font-semibold text-text-strong">12</div>
		</div>
	</div>

	<!-- 변경 목록 -->
	<div class="space-y-2">
		{#each changes.slice(0, 4) as change}
			<div class="flex items-center gap-2 text-sm">
				{#if change.recent}
					<span class="md:hidden inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-ok-fg text-black">
						최근
					</span>
				{/if}
				<span class="text-text-base flex-1">{change.text}</span>
			</div>
		{/each}
	</div>

	<!-- 전환 버튼 -->
	<div class="flex justify-end gap-2 mt-3">
		<a href="/changes/history" class="text-xs text-brand-pink hover:text-hover-cyan">히스토리</a>
	</div>
</Card>
