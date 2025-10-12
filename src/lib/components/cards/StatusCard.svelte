<script lang="ts">
	import Skeleton from '../Skeleton.svelte';
	import { CheckCircle, AlertCircle, XCircle, Info } from 'lucide-svelte';

	let { status = [], loading = false } = $props();

	const defaultStatus = [
		{ key: 'API 서버', value: 'ok' },
		{ key: '데이터베이스', value: 'ok' },
		{ key: '파일 스토리지', value: 'warning' },
		{ key: 'CDN', value: 'ok' }
	];

	const displayStatus = status.length > 0 ? status : defaultStatus;

	function getStatusIcon(status: string) {
		switch (status.toLowerCase()) {
			case 'ok':
			case 'healthy':
				return CheckCircle;
			case 'warning':
			case 'degraded':
				return AlertCircle;
			case 'error':
			case 'down':
				return XCircle;
			default:
				return CheckCircle;
		}
	}

	function getStatusColor(status: string) {
		switch (status.toLowerCase()) {
			case 'ok':
			case 'healthy':
				return 'var(--ok-fg)';
			case 'warning':
			case 'degraded':
				return 'var(--warn-fg)';
			case 'error':
			case 'down':
				return 'var(--danger-fg)';
			default:
				return 'var(--text-muted)';
		}
	}
</script>

<div class="h-[380px] flex flex-col justify-between p-5 rounded-lg bg-surface-2 border border-border-subtle overflow-hidden pt-[24px]">
	<div>
		<!-- 상단 타이틀영역 -->
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-lg font-bold text-text-strong truncate">시스템 상태</h3>
			<button class="inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-surface-1 transition-colors ml-2" aria-label="정보" title="운영 스냅샷">
				<Info size={12} class="text-text-muted" />
			</button>
		</div>

		<!-- 중간 요약 영역 -->
		<div class="grid grid-cols-3 gap-2 mb-3">
			<div class="h-8 bg-surface-1 rounded flex items-center justify-center px-2">
				<span class="text-xs text-text-muted truncate">정상: 3</span>
			</div>
			<div class="h-8 bg-surface-1 rounded flex items-center justify-center px-2">
				<span class="text-xs text-text-muted truncate">경고: 1</span>
			</div>
			<div class="h-8 bg-surface-1 rounded flex items-center justify-center px-2">
				<span class="text-xs text-text-muted truncate">오류: 0</span>
			</div>
		</div>

		<!-- 메인 목록/컨텐츠: 줄/행 개수 무조건 동일, 남는 줄은 placeholder -->
		<div class="grid grid-rows-4 gap-3">
			{#if loading}
				<Skeleton lines={2} />
			{:else}
				{#each displayStatus.slice(0, 4) as item, i (item.key)}
					{@const IconComponent = getStatusIcon(item.value)}
					<a
						href="/status/{item.key}"
						class="flex items-center gap-2 p-3 bg-surface-1 rounded hover:bg-surface-2 transition-colors h-full"
					>
						<IconComponent
							size={16}
							style="color: {getStatusColor(item.value)}"
							class="flex-shrink-0"
						/>
						<span class="text-sm text-text-base text-center flex-1">{item.key}</span>
						<span class="text-xs text-text-muted flex-shrink-0">{item.value}</span>
					</a>
				{/each}
				{#if displayStatus.length < 4}
					{#each Array.from({length: 4 - displayStatus.length}) as _, i}
						<div class="p-3 bg-surface-1 rounded h-full opacity-0 pointer-events-none">&nbsp;</div>
					{/each}
				{/if}
			{/if}
		</div>
	</div>

	<!-- 하단 액션 -->
	<a href="/status" class="self-end text-brand-pink font-semibold text-sm px-4 py-1 rounded transition-colors hover:bg-hover-cyan mt-3">
		자세히 보기
	</a>
</div>
