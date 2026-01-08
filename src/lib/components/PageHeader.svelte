<script lang="ts">
	export let title: string;
	export let description: string = '';
	export let actions: any[] = [];
</script>

<!-- 페이지 헤더 -->
<div class="mb-8 mt-1.5">
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div class="flex items-center gap-0 pl-0">
			<div class="pl-0">
				<h1 class="text-3xl font-bold text-text-strong mb-2">{title}</h1>
				{#if description}
					<p class="text-text-muted">{description}</p>
				{/if}
			</div>
		</div>
		
		{#if actions && actions.length > 0}
			<div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
				{#each actions as action}
					{#if action.href}
						<a 
							href={action.href}
							class="page-header-action-button inline-flex items-center justify-center gap-2 px-4 py-2 w-full sm:w-auto rounded-lg transition-colors duration-200 font-medium {action.label === '편집' ? 'page-header-edit-button bg-transparent border border-brand-pink text-brand-pink focus:bg-brand-pink focus:border-brand-pink focus:text-white focus-visible:bg-brand-pink focus-visible:border-brand-pink focus-visible:text-white focus:outline-none focus:ring-0' : 'page-header-primary-button bg-brand-pink text-[var(--surface-2)] hover:[&>svg]:!text-[var(--surface-2)] focus:bg-brand-pink focus:text-white focus:[&>svg]:!text-white focus-visible:bg-brand-pink focus-visible:text-white focus-visible:[&>svg]:!text-white focus:outline-none focus:ring-0'}"
						>
							{#if action.icon}
								<svelte:component this={action.icon} size={16} />
							{/if}
							{action.label}
						</a>
					{:else}
						<button 
							onclick={action.onclick}
							class="page-header-action-button inline-flex items-center justify-center gap-2 px-4 py-2 w-full sm:w-auto rounded-lg transition-colors duration-200 font-medium {action.label === '편집' ? 'page-header-edit-button bg-transparent border border-brand-pink text-brand-pink focus:bg-brand-pink focus:border-brand-pink focus:text-white focus-visible:bg-brand-pink focus-visible:border-brand-pink focus-visible:text-white focus:outline-none focus:ring-0' : 'page-header-primary-button bg-brand-pink text-[var(--surface-2)] hover:[&>svg]:!text-[var(--surface-2)] focus:bg-brand-pink focus:text-white focus:[&>svg]:!text-white focus-visible:bg-brand-pink focus-visible:text-white focus-visible:[&>svg]:!text-white focus:outline-none focus:ring-0'}"
						>
							{#if action.icon}
								<svelte:component this={action.icon} size={16} />
							{/if}
							{action.label}
						</button>
					{/if}
				{/each}
			</div>
		{/if}
	</div>
</div>
