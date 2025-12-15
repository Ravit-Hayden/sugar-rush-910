<script lang="ts">
	import { useClickOutside, useEscapeKey } from '$lib/utils/clickOutside';
	import type { SortOption } from '$lib/types/filters';
	import { ArrowUpDown } from 'lucide-svelte';

	interface Props {
		options: SortOption[];
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
		options.find(o => o.value === selectedValue)?.label || '정렬'
	);

	function handleSelect(value: string, event?: MouseEvent | KeyboardEvent) {
		onSelect(value, event);
		// 드롭다운 즉시 닫기
		onToggle();
		// 클릭한 항목에 포커스 효과를 보여주기 위해 약간의 지연 후 버튼에 포커스 반환
		if (event && event.currentTarget) {
			(event.currentTarget as HTMLElement).focus();
		}
		setTimeout(() => {
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
		return useClickOutside('.sort-dropdown', () => {
			onToggle();
		}, open);
	});

	// Escape 키 감지
	$effect(() => {
		return useEscapeKey(() => {
			onToggle();
		}, open);
	});
</script>

<div bind:this={containerElement} class="relative group sort-dropdown filter-dropdown {dropdownClass}" data-open={open ? 'true' : 'false'}>
	<button
		type="button"
		aria-haspopup="listbox"
		aria-expanded={open}
		class="flex items-center justify-between pl-10 pr-8 py-1.5 w-full lg:w-auto lg:min-w-[140px] bg-surface-1 rounded-[6px] text-text-base transition-all duration-200 cursor-pointer border focus:outline-none {buttonClass}"
		onclick={onToggle}
		tabindex="0"
	>
		<!-- 정렬 아이콘 -->
		<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
			<ArrowUpDown size={16} class="lucide-icon lucide-arrow-up-down transition-colors duration-200" />
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
				>
					{opt.label}
				</li>
			{/each}
		</ul>
	{/if}
</div>

