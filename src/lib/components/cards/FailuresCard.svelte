<script lang="ts">
	import Skeleton from '../Skeleton.svelte';
	import { RotateCcwSquare, AlertTriangle, Info, SquareCheck } from 'lucide-svelte';

	let { failures = [], loading = false } = $props();

	const defaultFailures = [
		{ id: '1', text: '파일 업로드 실패', retryable: true },
		{ id: '2', text: 'API 연결 오류', retryable: true },
		{ id: '3', text: '데이터베이스 타임아웃', retryable: false },
		{ id: '4', text: 'CDN 동기화 실패', retryable: true }
	];

	const displayFailures = failures.length > 0 ? failures : defaultFailures;

	const miniStats = [
		{ label: '실패', value: displayFailures.filter(f => f.status === 'failed').length },
		{ label: '재시도', value: displayFailures.filter(f => f.status === 'retrying').length },
		{ label: '차단', value: displayFailures.filter(f => f.status === 'blocked').length }
	];

	// 재시도 버튼 상태 관리
	const retryStates = $state(new Map<string, 'idle' | 'loading' | 'success' | 'error'>());
	const cooldowns = $state(new Map<string, number>());

	function getRetryState(id: string): 'idle' | 'loading' | 'success' | 'error' {
		return retryStates.get(id) || 'idle';
	}

	function isOnCooldown(id: string): boolean {
		const cooldown = cooldowns.get(id);
		return cooldown ? Date.now() < cooldown : false;
	}

	async function retryFailure(id: string) {
		if (isOnCooldown(id)) return;

		retryStates.set(id, 'loading');
		
		try {
			const response = await fetch('/api/failures/retry', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id })
			});
			
			if (response.ok) {
				retryStates.set(id, 'success');
				// 15초 쿨다운 설정
				cooldowns.set(id, Date.now() + 15000);
				// 2초 후 idle로 전환
				setTimeout(() => {
					retryStates.set(id, 'idle');
				}, 2000);
			} else {
				retryStates.set(id, 'error');
				// 2초 후 idle로 전환
				setTimeout(() => {
					retryStates.set(id, 'idle');
				}, 2000);
			}
		} catch (error) {
			console.error('Retry failed:', error);
			retryStates.set(id, 'error');
			// 2초 후 idle로 전환
			setTimeout(() => {
				retryStates.set(id, 'idle');
			}, 2000);
		}
	}

	function getButtonText(state: string): string {
		switch (state) {
			case 'loading':
				return '재시도 중...';
			case 'success':
				return '완료';
			case 'error':
				return '실패';
			default:
				return '재시도';
		}
	}

	function getButtonClass(state: string): string {
		const baseClass = 'btn-retry text-[10px] px-2 py-1';
		switch (state) {
			case 'loading':
				return `${baseClass} opacity-50 cursor-not-allowed`;
			case 'success':
				return `${baseClass} bg-green-500`;
			case 'error':
				return `${baseClass} bg-red-500`;
			default:
				return baseClass;
		}
	}
</script>

<div class="h-[396px] flex flex-col justify-between p-5 rounded-lg bg-surface-2 border border-border-subtle overflow-hidden pt-[24px]">
	<div>
		<!-- 상단 타이틀영역 -->
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-lg font-bold text-text-strong truncate">실패 태스크(재시도)</h3>
			<button class="inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-surface-1 transition-colors ml-2" aria-label="정보" title="실패 작업 복구 또는 원인 분석 전환">
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
				{#each displayFailures.slice(0, 4) as failure (failure.id)}
					<a
						href="/failures/{failure.id}"
						class="flex items-center h-12 px-4 bg-surface-1 rounded hover:bg-surface-2 transition-colors"
					>
						<!-- 좌측 아이콘 -->
						<span class="flex-shrink-0 w-5 h-5 flex items-center justify-center mr-3">
							<AlertTriangle size={16} class="text-text-base flex-shrink-0" />
						</span>
						<!-- 중간 텍스트 (좌측정렬) -->
						<span class="flex-1 text-sm text-text-base truncate text-left">{failure.text}</span>
						<!-- 우측 상태/버튼 -->
						<span class="flex-shrink-0 flex items-center gap-x-2">
							{#if failure.retryable}
								<button
									onclick={() => retryFailure(failure.id)}
									class="badge-base badge-high-urgent inline-flex items-center gap-1 cursor-pointer min-w-[60px] hover:opacity-80 transition-opacity"
									disabled={getRetryState(failure.id) === 'loading' || isOnCooldown(failure.id)}
									aria-label="재시도"
									aria-live="polite"
								>
									{#if getRetryState(failure.id) === 'loading'}
										<RotateCcwSquare size={12} class="animate-spin" />
										재시도 중
									{:else}
										<RotateCcwSquare size={12} />
										재시도
									{/if}
								</button>
							{:else}
								<span class="badge-base badge-low-mint inline-flex items-center gap-1">
									<SquareCheck size={12} />
									확인됨
								</span>
							{/if}
						</span>
					</a>
				{/each}
				{#if displayFailures.length < 4}
					{#each Array.from({length: 4 - displayFailures.length}) as _, i}
						<div class="h-12 px-4 bg-surface-1 rounded opacity-0 pointer-events-none">&nbsp;</div>
					{/each}
				{/if}
			{/if}
		</div>
	</div>

	<!-- 하단 액션 -->
	<div class="flex items-center justify-between mt-3">
		<div class="flex gap-x-2 flex-wrap items-center">
			<a href="/runbook" class="inline-flex items-center px-3 py-1 rounded border border-brand-pink text-brand-pink text-xs font-medium hover:bg-brand-pink hover:text-white transition cursor-pointer min-w-[70px]" aria-label="안내 가이드" title="안내 가이드">
				<RotateCcwSquare size={12} class="mr-1" />
				안내
			</a>
			<a href="/failures" class="inline-flex items-center px-3 py-1 rounded border border-brand-pink text-brand-pink text-xs font-medium hover:bg-brand-pink hover:text-white transition cursor-pointer min-w-[70px]" aria-label="원인 분석" title="원인 분석">
				<AlertTriangle size={12} class="mr-1" />
				원인
			</a>
		</div>
		<a href="/failures" class="text-brand-pink text-sm font-semibold px-2 py-1 rounded hover:bg-hover-cyan transition-colors">자세히 보기</a>
	</div>
</div>