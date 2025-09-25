<script lang="ts">
	export let lines: number = 1;
	export let height: string = 'h-4';
</script>

<div class="animate-pulse">
	{#each Array(lines) as _, i}
		<div class="bg-surface-1 rounded {height} mb-2 {i === lines - 1 ? 'w-3/4' : 'w-full'}"></div>
	{/each}
</div>
