<script lang="ts">
	import { useClickOutside, useEscapeKey } from '$lib/utils/clickOutside';
	import type { FilterOption } from '$lib/types/filters';
	import { Filter } from 'lucide-svelte';

	interface Props {
		options: FilterOption[];
		selectedValue: string;
		open: boolean;
		buttonClass?: string;
		dropdownClass?: string;
		onToggle: () => void;
		onSelect: (value: string, event?: MouseEvent | KeyboardEvent) => void;
		buttonSelector?: string;
	}

	let {
		options,
		selectedValue,
		open,
		buttonClass = '',
		dropdownClass = '',
		onToggle,
		onSelect,
		buttonSelector = ''
	}: Props = $props();

	let containerElement: HTMLDivElement;
	let selectedLabel = $derived(
		options.find(o => o.value === selectedValue)?.label || '상태'
	);

	function handleSelect(value: string, event?: MouseEvent | KeyboardEvent) {
		onSelect(value, event);
		// 포커스 효과를 보여주기 위해 약간의 지연 후 드롭다운 닫기
		if (event && event.currentTarget) {
			(event.currentTarget as HTMLElement).focus();
		}
		setTimeout(() => {
			onToggle();
			// 버튼에 포커스 반환
			if (buttonSelector) {
				const button = document.querySelector(buttonSelector) as HTMLButtonElement;
				if (button) {
					button.focus();
				}
			}
		}, 150);
	}

	// 외부 클릭 감지
	$effect(() => {
		return useClickOutside('.status-filter-dropdown', () => {
			onToggle();
		}, open);
	});

	// Escape 키 감지
	$effect(() => {
		return useEscapeKey(() => {
			onToggle();
		}, open);
	});

	// 그룹화된 옵션 처리
	const groupedOptions = $derived.by(() => {
		const hasGroups = options.some(opt => opt.group);
		if (!hasGroups) return null;

		const groups: { [key: string]: typeof options } = {};
		const ungrouped: typeof options = [];

		options.forEach(opt => {
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
	});
</script>

<div bind:this={containerElement} class="relative group status-filter-dropdown filter-dropdown {dropdownClass}" data-open={open ? 'true' : 'false'}>
	<button
		type="button"
		aria-haspopup="listbox"
		aria-expanded={open}
		class="flex items-center pl-10 pr-8 py-1.5 w-full lg:w-auto lg:min-w-[140px] bg-surface-1 rounded-[6px] text-text-base transition-all duration-200 cursor-pointer border focus:outline-none {buttonClass}"
		onclick={onToggle}
		tabindex="0"
	>
		<!-- 필터 아이콘 -->
		<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
			<Filter size={16} class="lucide-icon lucide-filter transition-colors duration-200" />
		</div>
		
		<!-- 선택된 값 표시 -->
		<span class="flex-1 text-left truncate">
			{selectedLabel}
		</span>
		
		<!-- 드롭다운 화살표 -->
		<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
			<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-text-base transition-colors duration-200">
				<polyline points="6,9 12,15 18,9"></polyline>
			</svg>
		</div>
	</button>
	{#if open}
		<ul role="listbox" class="absolute left-0 w-full bg-surface-1 border border-border-subtle rounded-[6px] z-[9999] overflow-hidden pt-0">
				{#if groupedOptions}
					{#if groupedOptions.ungrouped.length > 0}
						{#each groupedOptions.ungrouped as opt}
							<li
								role="option"
								aria-selected={selectedValue === opt.value}
								tabindex="0"
								onclick={(e) => handleSelect(opt.value, e)}
								onkeydown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault();
										handleSelect(opt.value, e);
									}
								}}
								style="font-smooth: always; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; text-rendering: optimizeLegibility;"
							>
								{opt.label}
							</li>
						{/each}
					{/if}
					{#each Object.entries(groupedOptions.groups) as [groupName, groupOptions], i}
						<li class="filter-group-header {i === 0 && groupedOptions.ungrouped.length === 0 ? 'first-group-header' : ''} {i > 0 || groupedOptions.ungrouped.length > 0 ? 'has-top-border' : ''}">
							{groupName}
						</li>
						{#each groupOptions as opt}
							<li
								role="option"
								aria-selected={selectedValue === opt.value}
								tabindex="0"
								onclick={(e) => handleSelect(opt.value, e)}
								onkeydown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault();
										handleSelect(opt.value, e);
									}
								}}
								style="font-smooth: always; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; text-rendering: optimizeLegibility;"
							>
								{opt.label}
							</li>
						{/each}
					{/each}
				{:else}
					{#each options as opt}
						<li
							role="option"
							aria-selected={selectedValue === opt.value}
							tabindex="0"
							onclick={(e) => handleSelect(opt.value, e)}
							onkeydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									handleSelect(opt.value, e);
								}
							}}
							style="font-smooth: always; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; text-rendering: optimizeLegibility;"
						>
							{opt.label}
						</li>
					{/each}
				{/if}
			</ul>
	{/if}
</div>

