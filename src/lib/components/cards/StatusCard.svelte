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

<Card title="시스템 상태" tooltip="운영 스냅샷">
	{#if loading}
		<Skeleton lines={4} />
	{:else}
		<div class="space-y-2">
			{#each status.slice(0, 4) as item (item.key)}
				{@const IconComponent = getStatusIcon(item.value)}
				<div class="flex items-center justify-between p-2 bg-surface-1 rounded">
					<div class="flex items-center gap-2">
						<IconComponent
							size={14}
							style="color: {getStatusColor(item.value)}"
						/>
						<span class="text-sm text-text-base">{item.key}</span>
					</div>
					<span class="text-xs text-text-muted">{item.value}</span>
				</div>
			{/each}
		</div>
	{/if}
</Card>
