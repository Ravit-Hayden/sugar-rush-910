<script lang="ts">
	import Card from '../Card.svelte';
	import Skeleton from '../Skeleton.svelte';
	import { FileText, Clock } from 'lucide-svelte';

	let { logs = [], loading = false } = $props();
</script>

<Card title="시스템 로그" tooltip="운영 이벤트" class="h-80">
	{#if loading}
		<Skeleton lines={4} />
	{:else}
		<div class="space-y-2">
			{#each logs.slice(0, 4) as log (log.id)}
				<div class="flex items-start gap-2 p-2 bg-surface-1 rounded">
					<FileText size={14} class="text-text-muted mt-0.5" />
					<div class="flex-1">
						<p class="text-sm text-text-base">{log.text}</p>
						<div class="flex items-center gap-1 mt-1">
							<Clock size={12} class="text-text-muted" />
							<span class="text-xs text-text-muted">{log.time}</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</Card>
