<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	
	export let title: string;
	export let description: string = '';
	export let showBackButton: boolean = false;
	export let actions: any[] = [];
	
	const dispatch = createEventDispatcher();
	
	function handleBack() {
		dispatch('back');
		window.history.back();
	}
</script>

<!-- 페이지 헤더 -->
<div class="mb-8 mt-1.5">
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div class="flex items-center gap-3">
			{#if showBackButton}
				<button 
					onclick={handleBack}
					class="flex-shrink-0 w-8 h-8 inline-flex items-center justify-center rounded-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-0 cursor-pointer hover:bg-surface-2"
					aria-label="뒤로 가기"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-text-base">
						<path d="m15 18-6-6 6-6"/>
					</svg>
				</button>
			{/if}
			<div>
				<h1 class="text-3xl font-bold text-text-strong mb-2">{title}</h1>
				{#if description}
					<p class="text-text-muted">{description}</p>
				{/if}
			</div>
		</div>
		
		{#if actions && actions.length > 0}
			<div class="flex items-center gap-3">
				{#each actions as action}
					<button 
						onclick={action.onclick}
						class="inline-flex items-center gap-2 px-4 py-2 bg-brand-pink text-white rounded-lg hover:bg-brand-pink/90 transition-colors duration-200 font-medium"
					>
						{#if action.icon}
							<svelte:component this={action.icon} size={16} />
						{/if}
						{action.label}
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>
