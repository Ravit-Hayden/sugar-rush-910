<script lang="ts">
	import { Search, Filter } from 'lucide-svelte';
	
	export let searchQuery: string = '';
	export let searchPlaceholder: string = '검색...';
	export let showFilter: boolean = false;
	export let filterOptions: { value: string; label: string }[] = [];
	export let selectedFilter: string = '';
	export let onSearchChange: (query: string) => void = () => {};
	export let onFilterChange: (filter: string) => void = () => {};
	
	let dropdownOpen = false;
	
	function selectOption(value: string) {
		selectedFilter = value;
		dropdownOpen = false;
		onFilterChange(value);
	}
	
	function toggleDropdown() {
		dropdownOpen = !dropdownOpen;
	}
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
	
	<!-- 필터 선택 - 커스텀 드롭다운 -->
	{#if showFilter && filterOptions.length > 0}
		<div class="relative group filter-dropdown" data-open={dropdownOpen ? 'true' : 'false'}>
			<!-- 드롭다운 버튼 -->
			<button
				type="button"
				aria-haspopup="listbox"
				aria-expanded={dropdownOpen}
				class="flex items-center pl-10 pr-8 py-1.5 bg-surface-1 rounded-[6px] text-text-base min-w-[140px] transition-all duration-200 cursor-pointer border focus:outline-none"
				on:click={toggleDropdown}
				tabindex="0"
			>
				<!-- 필터 아이콘 -->
				<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
					<Filter size={16} class="lucide-icon lucide-filter transition-colors duration-200" />
				</div>
				
				<!-- 선택된 값 표시 -->
				<span class="flex-1 text-left truncate">
					{filterOptions.find(o => o.value === selectedFilter)?.label || '선택하세요'}
				</span>
				
				<!-- 드롭다운 화살표 -->
				<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
					<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-text-base transition-colors duration-200">
						<polyline points="6,9 12,15 18,9"></polyline>
					</svg>
				</div>
			</button>
			
			<!-- 드롭다운 리스트 -->
			{#if dropdownOpen}
				<ul role="listbox" class="absolute left-0 w-full mt-[6px] bg-surface-1 border rounded-[6px] z-10 border-border-subtle">
					{#each filterOptions as opt}
						<li
							role="option"
							aria-selected={selectedFilter === opt.value}
							tabindex="0"
							class="cursor-pointer select-none"
							on:click={() => selectOption(opt.value)}
							on:keydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									selectOption(opt.value);
								}
							}}
						>
							{opt.label}
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	{/if}
</div>
