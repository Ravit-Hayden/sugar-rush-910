<script lang="ts">
	let { lines = 3, class: className = '' } = $props();
</script>

<div class="animate-pulse {className}">
	{#each Array(lines) as _, i (i)}
		<div class="h-4 bg-surface-1 rounded mb-2 {i === lines - 1 ? 'w-3/4' : 'w-full'}"></div>
	{/each}
</div>
