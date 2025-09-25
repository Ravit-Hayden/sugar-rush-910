<script lang="ts">
	import Card from '../Card.svelte';
	import { AlertTriangle, RefreshCw, Ban } from 'lucide-svelte';

	// 목 데이터
	const failures = [
		{ id: 1, text: '앨범 업로드 실패', retryable: true },
		{ id: 2, text: '메타데이터 동기화 오류', retryable: true },
		{ id: 3, text: 'CDN 캐시 갱신 실패', retryable: false },
		{ id: 4, text: '이메일 알림 전송 실패', retryable: true }
	];

	let retryStates: Record<number, 'idle' | 'loading' | 'success' | 'error'> = {};

	async function retryFailure(id: number) {
		retryStates[id] = 'loading';
		
		try {
			// API 호출 시뮬레이션
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			// 성공/실패 랜덤 시뮬레이션
			const success = Math.random() > 0.3;
			retryStates[id] = success ? 'success' : 'error';
			
			// 2초 후 idle로 복귀
			setTimeout(() => {
				retryStates[id] = 'idle';
			}, 2000);
		} catch (error) {
			retryStates[id] = 'error';
			setTimeout(() => {
				retryStates[id] = 'idle';
			}, 2000);
		}
	}
</script>

<Card title="실패 태스크(재시도)" tooltip="실패 작업 복구 또는 원인 분석 전환" href="/runbook">
	<!-- 미니 통계 -->
	<div class="grid grid-cols-3 gap-2 mb-3">
		<div class="text-center">
			<div class="text-xs text-text-muted">실패</div>
			<div class="text-sm font-semibold text-danger-fg">4</div>
		</div>
		<div class="text-center">
			<div class="text-xs text-text-muted">재시도</div>
			<div class="text-sm font-semibold text-text-strong">3</div>
		</div>
		<div class="text-center">
			<div class="text-xs text-text-muted">차단</div>
			<div class="text-sm font-semibold text-warn-fg">1</div>
		</div>
	</div>

	<!-- 실패 목록 -->
	<div class="space-y-2">
		{#each failures.slice(0, 4) as failure}
			<div class="flex items-center gap-2 text-sm">
				<span class="text-text-base flex-1">{failure.text}</span>
				{#if failure.retryable}
					<button
						on:click={() => retryFailure(failure.id)}
						disabled={retryStates[failure.id] === 'loading'}
						class="btn-retry text-xs"
						aria-label="재시도"
						aria-live="polite"
					>
						{#if retryStates[failure.id] === 'loading'}
							<RefreshCw size={12} class="animate-spin" />
						{:else if retryStates[failure.id] === 'success'}
							✓
						{:else if retryStates[failure.id] === 'error'}
							✗
						{:else}
							재시도
						{/if}
					</button>
				{:else}
					<Ban size={12} class="text-warn-fg" />
				{/if}
			</div>
		{/each}
	</div>

	<!-- 전환 버튼 -->
	<div class="flex justify-end gap-2 mt-3">
		<a href="/runbook" class="text-xs text-brand-pink hover:text-hover-cyan">재시도</a>
		<a href="/failures/analysis" class="text-xs text-brand-pink hover:text-hover-cyan">원인</a>
	</div>
</Card>
