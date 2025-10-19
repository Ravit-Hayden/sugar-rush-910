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
				return 'var(--badge-low-mint)';
			case 'warning':
			case 'degraded':
				return 'var(--badge-medium-yellow)';
			case 'error':
			case 'down':
				return 'var(--badge-high-urgent)';
			default:
				return 'var(--text-muted)';
		}
	}
</script>

<div class="h-[396px] flex flex-col justify-between p-5 rounded-lg bg-surface-2 border border-border-subtle overflow-hidden pt-[24px]">
	<div>
		<!-- 상단 타이틀영역 -->
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-lg font-bold text-text-strong truncate">시스템 상태</h3>
			<button class="inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-surface-1 transition-colors ml-2" aria-label="정보" title="운영 스냅샷" type="button">
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
						class="flex items-center h-12 px-4 bg-surface-1 rounded hover:bg-surface-2 transition-colors"
					>
						<!-- 좌측 아이콘 -->
						<span class="flex-shrink-0 w-5 h-5 flex items-center justify-center mr-3">
							<IconComponent
								size={16}
								class="text-text-base flex-shrink-0"
							/>
						</span>
						<!-- 중간 텍스트 (좌측정렬) -->
						<span class="flex-1 text-sm text-text-base truncate text-left">{item.key}</span>
						<!-- 우측 상태/버튼 -->
						<span class="flex-shrink-0 flex items-center gap-x-2">
							{#if item.value === 'ok' || item.value === 'healthy'}
								<span class="badge-base badge-low-mint">{item.value}</span>
							{:else if item.value === 'warning' || item.value === 'degraded'}
								<span class="badge-base badge-medium-yellow">{item.value}</span>
							{:else if item.value === 'error' || item.value === 'down'}
								<span class="badge-base badge-high-urgent">{item.value}</span>
							{:else}
								<span class="text-xs text-text-muted">{item.value}</span>
							{/if}
						</span>
					</a>
				{/each}
				{#if displayStatus.length < 4}
					{#each Array.from({length: 4 - displayStatus.length}) as _, i}
						<div class="h-12 px-4 bg-surface-1 rounded opacity-0 pointer-events-none">&nbsp;</div>
					{/each}
				{/if}
			{/if}
		</div>
	</div>

	<!-- 하단 액션 -->
	<a href="/status" class="self-end text-brand-pink text-sm font-semibold px-2 py-1 rounded hover:bg-hover-cyan transition-colors mt-3">
		자세히 보기
	</a>
</div>
