<script lang="ts">
	import Card from '../Card.svelte';
	import Skeleton from '../Skeleton.svelte';
	import { MessageSquare } from 'lucide-svelte';

	let { feedback = [], loading = false } = $props();
</script>

<Card title="피드백" tooltip="코멘트/리뷰" class="h-80">
	{#if loading}
		<Skeleton lines={4} />
	{:else}
		<div class="space-y-2">
			{#each feedback.slice(0, 4) as item (item.id)}
				<div class="flex items-start gap-2 p-2 bg-surface-1 rounded">
					<MessageSquare size={14} class="text-text-muted mt-0.5" />
					<div class="flex-1">
						<p class="text-sm text-text-base">{item.text}</p>
						<div class="flex items-center justify-between mt-1">
							<span class="text-xs text-text-muted">from {item.from}</span>
							<span class="text-xs text-text-muted">{item.time}</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</Card>
