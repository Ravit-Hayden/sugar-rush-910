<script lang="ts">
	export let icon: any;
	export let title: string;
	export let description: string = '';
	export let actionLabel: string = '';
	export let onAction: () => void = () => {};
</script>

<!-- 빈 상태 컴포넌트 -->
<div class="flex flex-col items-center justify-center py-16 px-4 text-center">
	<div class="mb-6">
		{#if icon}
			<svelte:component this={icon} size={64} class="text-text-muted mx-auto" />
		{/if}
	</div>
	
	<h3 class="text-xl font-semibold text-text-strong mb-2">{title}</h3>
	
	{#if description}
		<p class="text-text-muted mb-6 max-w-md">{description}</p>
	{/if}
	
	{#if actionLabel}
		<button 
			onclick={onAction}
			class="inline-flex items-center gap-2 px-6 py-3 bg-brand-pink text-white rounded-lg hover:bg-brand-pink/90 transition-colors duration-200 font-medium"
		>
			{actionLabel}
		</button>
	{/if}
</div>
