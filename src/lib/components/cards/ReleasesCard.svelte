<script lang="ts">
	import Card from '../Card.svelte';
	import Skeleton from '../Skeleton.svelte';
	import { Calendar, Clock } from 'lucide-svelte';

	let { releases = [], loading = false } = $props();
</script>

<Card title="오늘 발매 일정" tooltip="당일 중심 일정">
	{#if loading}
		<Skeleton lines={4} />
	{:else}
		<div class="space-y-2">
			{#each releases.slice(0, 4) as release (release.id)}
				<div class="flex items-center justify-between p-2 bg-surface-1 rounded">
					<div class="flex items-center gap-2">
						<Calendar size={14} class="text-text-muted" />
						<span class="text-sm text-text-base">{release.title}</span>
					</div>
					<div class="flex items-center gap-1">
						<Clock size={12} class="text-text-muted" />
						<span class="text-xs text-text-muted">{release.when}</span>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</Card>
