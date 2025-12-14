<script lang="ts">
	import { Search, Filter, X } from 'lucide-svelte';
	
	export let searchQuery: string = '';
	export let searchPlaceholder: string = '검색...';
	export let showFilter: boolean = false;
	export let filterOptions: { value: string; label: string; group?: string }[] = [];
	export let selectedFilter: string = '';
	export let onSearchChange: (query: string) => void = () => {};
	export let onFilterChange: (filter: string) => void = () => {};
	export let noMargin: boolean = false;
	
	let dropdownOpen = false;
	let searchInput: HTMLInputElement;

	function clearSearch() {
		searchQuery = '';
		onSearchChange('');
		searchInput?.focus();
	}
	
	function selectOption(value: string) {
		selectedFilter = value;
		dropdownOpen = false;
		onFilterChange(value);
	}
	
	function toggleDropdown() {
		dropdownOpen = !dropdownOpen;
	}
	
	// 그룹별로 옵션 정리
	$: groupedOptions = (() => {
		const hasGroups = filterOptions.some(opt => opt.group);
		if (!hasGroups) return null;
		
		const groups: { [key: string]: typeof filterOptions } = {};
		const ungrouped: typeof filterOptions = [];
		
		filterOptions.forEach(opt => {
			if (opt.group) {
				if (!groups[opt.group]) {
					groups[opt.group] = [];
				}
				groups[opt.group].push(opt);
			} else {
				ungrouped.push(opt);
			}
		});
		
		return { groups, ungrouped };
	})();
</script>

<!-- 검색 및 필터 바 -->
<div class="flex flex-col sm:flex-row gap-4 {noMargin ? '' : 'mb-8'}">
	<!-- 검색 입력 -->
	<div class="relative flex-1 group">
		<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
			<Search size={16} class="lucide-icon lucide-search" aria-hidden="true" />
		</div>
		<input 
			type="text" 
			placeholder={searchPlaceholder}
			bind:this={searchInput}
			bind:value={searchQuery}
			on:input={(e) => onSearchChange((e.target as HTMLInputElement).value)}
			aria-label="검색"
			class="w-full pl-10 {searchQuery.trim() ? 'pr-10' : 'pr-4'} py-1.5 bg-surface-1 border border-border-subtle border-[1px] rounded-md text-text-base placeholder-text-muted focus:outline-none focus:ring-0 transition-colors duration-200"
		/>
		{#if searchQuery.trim()}
			<button
				type="button"
				onclick={clearSearch}
				class="search-clear-button absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center bg-transparent hover:bg-transparent focus:bg-transparent focus-visible:bg-transparent"
				aria-label="검색 초기화"
			>
				<X size={16} class="lucide-icon" />
			</button>
		{/if}
	</div>
	
	<!-- 필터 선택 - 커스텀 드롭다운 -->
	{#if showFilter && filterOptions.length > 0}
		<div class="relative group filter-dropdown w-full sm:w-auto" data-open={dropdownOpen ? 'true' : 'false'}>
			<!-- 드롭다운 버튼 -->
			<button
				type="button"
				aria-haspopup="listbox"
				aria-expanded={dropdownOpen}
				class="flex items-center pl-10 pr-8 py-1.5 w-full sm:w-auto sm:min-w-[140px] bg-surface-1 rounded-[6px] text-text-base transition-all duration-200 cursor-pointer border focus:outline-none"
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
				<ul role="listbox" class="absolute left-0 w-full mt-[6px] bg-surface-1 border rounded-[6px] z-10 border-border-subtle overflow-hidden shadow-lg">
					{#if groupedOptions}
						<!-- 그룹 없는 옵션들 (맨 위에 표시) -->
						{#if groupedOptions.ungrouped.length > 0}
							{#each groupedOptions.ungrouped as opt}
								<li
									role="option"
									aria-selected={selectedFilter === opt.value}
									tabindex="0"
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
						{/if}
						<!-- 그룹이 있는 경우 -->
						{#each Object.entries(groupedOptions.groups) as [groupName, options], i}
							<!-- 그룹 헤더 -->
							<li class="filter-group-header {i === 0 && groupedOptions.ungrouped.length === 0 ? 'first-group-header' : ''} {i > 0 || groupedOptions.ungrouped.length > 0 ? 'has-top-border' : ''}">
								{groupName}
							</li>
							<!-- 그룹 옵션들 -->
							{#each options as opt}
								<li
									role="option"
									aria-selected={selectedFilter === opt.value}
									tabindex="0"
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
						{/each}
					{:else}
						<!-- 그룹이 없는 경우 (기존 방식) -->
					{#each filterOptions as opt}
						<li
							role="option"
							aria-selected={selectedFilter === opt.value}
							tabindex="0"
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
					{/if}
				</ul>
			{/if}
		</div>
	{/if}
</div>
