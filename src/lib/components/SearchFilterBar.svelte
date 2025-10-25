<script lang="ts">
	import { Search, Filter } from 'lucide-svelte';
	
	export let searchQuery: string = '';
	export let searchPlaceholder: string = '검색...';
	export let showFilter: boolean = false;
	export let filterOptions: { value: string; label: string }[] = [];
	export let selectedFilter: string = '';
	export let onSearchChange: (query: string) => void = () => {};
	export let onFilterChange: (filter: string) => void = () => {};
</script>

<!-- 검색 및 필터 바 -->
<div class="flex flex-col sm:flex-row gap-4 mb-8">
	<!-- 검색 입력 -->
	<div class="relative flex-1 group">
		<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
			<Search size={16} class="lucide-icon lucide-search" />
		</div>
		<input 
			type="text" 
			placeholder={searchPlaceholder}
			bind:value={searchQuery}
			on:input={(e) => onSearchChange((e.target as HTMLInputElement).value)}
			class="w-full pl-10 pr-4 py-1.5 bg-surface-1 border border-border-subtle border-[1px] rounded-md text-text-base placeholder-text-muted focus:outline-none focus:ring-0"
		/>
	</div>
	
	<!-- 필터 선택 -->
	{#if showFilter && filterOptions.length > 0}
		<div class="relative group">
			<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
				<Filter size={16} class="lucide-icon lucide-filter" />
			</div>
			<select 
				bind:value={selectedFilter}
				on:change={(e) => onFilterChange((e.target as HTMLSelectElement)?.value || '')}
				class="pl-10 pr-8 py-1.5 bg-surface-1 border border-border-subtle border-[1px] rounded-md text-text-base focus:outline-none focus:ring-0 appearance-none cursor-pointer min-w-[140px]"
			>
				{#each filterOptions as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
			<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
				<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-text-base">
					<polyline points="6,9 12,15 18,9"></polyline>
				</svg>
			</div>
		</div>
	{/if}
</div>
