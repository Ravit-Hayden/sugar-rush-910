<script lang="ts">
	import Card from '../Card.svelte';
	import Skeleton from '../Skeleton.svelte';
	import { CheckCircle, AlertCircle, XCircle } from 'lucide-svelte';

	let { status = [], loading = false } = $props();

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

<Card title="시스템 상태" tooltip="운영 스냅샷" class="h-80">
	{#if loading}
		<Skeleton lines={4} />
	{:else}
		<div class="space-y-2 mb-3">
			{#each status.slice(0, 3) as item (item.key)}
				{@const IconComponent = getStatusIcon(item.value)}
				<div class="flex items-center justify-between p-2 bg-surface-1 rounded">
					<div class="flex items-center gap-2 min-w-0 flex-1">
						<IconComponent
							size={14}
							style="color: {getStatusColor(item.value)}"
							class="flex-shrink-0"
						/>
						<span class="text-sm text-text-base truncate">{item.key}</span>
					</div>
					<span class="text-xs text-text-muted flex-shrink-0">{item.value}</span>
				</div>
			{/each}
		</div>

		<!-- 하단 액션 그룹 -->
		<div class="mt-auto flex flex-row justify-end gap-x-2 mb-2">
			<a href="/status" class="text-brand-pink font-semibold text-sm px-4 py-1 rounded transition-colors hover:bg-hover-cyan">
				자세히 보기
			</a>
		</div>
	{/if}
</Card>
