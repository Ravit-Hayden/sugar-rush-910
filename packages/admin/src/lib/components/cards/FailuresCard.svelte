<script lang="ts">
	import Card from '../Card.svelte';
	import Toast from '../Toast.svelte';
	import { AlertTriangle, RefreshCw, Ban } from 'lucide-svelte';

	// 목 데이터
	const failures = [
		{ id: 1, text: '앨범 업로드 실패', retryable: true },
		{ id: 2, text: '메타데이터 동기화 오류', retryable: true },
		{ id: 3, text: 'CDN 캐시 갱신 실패', retryable: false },
		{ id: 4, text: '이메일 알림 전송 실패', retryable: true }
	];

	let retryStates: Record<number, 'idle' | 'loading' | 'success' | 'error'> = {};
	let cooldowns: Record<number, number> = {};
	let toastMessage = '';
	let toastType: 'success' | 'error' | 'info' = 'info';
	let showToast = false;

	async function retryFailure(id: number) {
		// 쿨다운 체크 (15초)
		if (cooldowns[id] && Date.now() < cooldowns[id]) {
			const remaining = Math.ceil((cooldowns[id] - Date.now()) / 1000);
			toastMessage = `재시도 가능까지 ${remaining}초 남았습니다`;
			toastType = 'info';
			showToast = true;
			return;
		}

		retryStates[id] = 'loading';
		
		try {
			// API 호출
			const response = await fetch('/api/failures/retry', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: id.toString() })
			});
			
			const result = await response.json();
			
			if (result.ok) {
				retryStates[id] = result.data.status === 'ok' ? 'success' : 'error';
				toastMessage = result.data.status === 'ok' ? '재시도 성공' : '재시도 실패';
				toastType = result.data.status === 'ok' ? 'success' : 'error';
			} else {
				retryStates[id] = 'error';
				toastMessage = result.error.message || '재시도 실패';
				toastType = 'error';
			}
			
			showToast = true;
			
			// 쿨다운 설정 (15초)
			cooldowns[id] = Date.now() + 15000;
			
			// 2초 후 idle로 복귀
			setTimeout(() => {
				retryStates[id] = 'idle';
			}, 2000);
		} catch (error) {
			retryStates[id] = 'error';
			toastMessage = '네트워크 오류가 발생했습니다';
			toastType = 'error';
			showToast = true;
			
			// 쿨다운 설정
			cooldowns[id] = Date.now() + 15000;
			
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

<!-- 토스트 알림 -->
<Toast 
	message={toastMessage} 
	type={toastType} 
	visible={showToast}
	on:close={() => showToast = false}
/>
