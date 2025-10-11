<script lang="ts">
	import Card from '../Card.svelte';
	import Skeleton from '../Skeleton.svelte';
	import { RotateCcw, AlertTriangle } from 'lucide-svelte';

	let { failures = [], loading = false } = $props();

	const miniStats = [
		{ label: '실패', value: failures.filter(f => f.status === 'failed').length },
		{ label: '재시도', value: failures.filter(f => f.status === 'retrying').length },
		{ label: '차단', value: failures.filter(f => f.status === 'blocked').length }
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

<Card title="실패 태스크(재시도)" tooltip="실패 작업 복구 또는 원인 분석 전환">
	{#if loading}
		<Skeleton lines={4} />
	{:else}
		<!-- 미니 통계 -->
		<div class="grid grid-cols-3 gap-2 mb-2">
		{#each miniStats as stat (stat.label)}
			<div class="h-8 bg-surface-1 rounded flex items-center justify-center">
				<span class="text-[11px] text-text-muted truncate">{stat.label}: {stat.value}</span>
			</div>
		{/each}
		</div>

		<!-- 실패 목록 -->
		<div class="space-y-2">
		{#each failures.slice(0, 3) as failure (failure.id)}
			<div class="flex items-center justify-between p-2 bg-surface-1 rounded">
				<div class="flex items-center gap-2 min-w-0 flex-1">
					<AlertTriangle size={14} class="text-danger-fg flex-shrink-0" />
					<span class="text-sm text-text-base truncate">{failure.text}</span>
				</div>
				{#if failure.retryable}
					<button
						onclick={() => retryFailure(failure.id)}
						class="text-[10px] px-2 py-1 flex items-center justify-center rounded-md bg-brand-pink hover:bg-hover-cyan text-white font-semibold h-[18px] min-w-[38px] flex-shrink-0"
						disabled={getRetryState(failure.id) === 'loading' || isOnCooldown(failure.id)}
						aria-label="재시도"
						aria-live="polite"
					>
						{#if getRetryState(failure.id) === 'loading'}
							<RotateCcw size={12} class="animate-spin mr-1" />
						{:else}
							<RotateCcw size={12} class="mr-1" />
						{/if}
						<span>{getButtonText(getRetryState(failure.id))}</span>
					</button>
				{/if}
			</div>
		{/each}
		</div>

		<!-- 하단 액션 그룹 -->
		<div class="mt-auto flex flex-row justify-end gap-x-2 mb-2">
			<a href="/runbook" class="text-[10px] px-2 py-1 flex items-center justify-center rounded-md bg-brand-pink hover:bg-hover-cyan text-white font-semibold h-[18px] min-w-[38px]">
				<RotateCcw size={12} class="mr-1" />
				<span>재시도</span>
			</a>
			<a href="/failures" class="text-[10px] px-2 py-1 flex items-center justify-center rounded-md bg-brand-pink hover:bg-hover-cyan text-white font-semibold h-[18px] min-w-[38px]">
				<AlertTriangle size={12} class="mr-1" />
				<span>원인</span>
			</a>
			<a href="/failures" class="text-brand-pink font-semibold text-sm px-4 py-1 rounded transition-colors hover:bg-hover-cyan">
				자세히 보기
			</a>
		</div>
	{/if}
</Card>