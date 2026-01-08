<script lang="ts">
	import { useClickOutside, useEscapeKey } from '$lib/utils/clickOutside';
	import type { FilterOption } from '$lib/types/filters';

	interface Props {
		options: FilterOption[];
		selectedValue: string;
		open: boolean;
		buttonClass?: string;
		dropdownClass?: string;
		icon?: any; // Lucide icon component
		placeholder?: string;
		onToggle: () => void;
		onSelect: (value: string, event?: MouseEvent | KeyboardEvent) => void;
		buttonSelector?: string; // 포커스 반환을 위한 버튼 선택자
		maxHeight?: string;
		scrollable?: boolean;
	}

	let {
		options,
		selectedValue,
		open,
		buttonClass = '',
		dropdownClass = '',
		icon: Icon,
		placeholder = '선택',
		onToggle,
		onSelect,
		buttonSelector = '',
		maxHeight = '624px',
		scrollable = false
	}: Props = $props();

	let containerElement: HTMLDivElement;
	let selectedLabel = $derived(
		options.find(o => o.value === selectedValue)?.label || placeholder
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
		if (!open || !containerElement) return () => {};
		return useClickOutside('.filter-dropdown', () => {
			onToggle();
		}, open);
	});

	// Escape 키 감지
	$effect(() => {
		if (!open) return () => {};
		return useEscapeKey(() => {
			onToggle();
		}, open);
	});
</script>

<div bind:this={containerElement} class="relative group filter-dropdown {dropdownClass}" data-open={open ? 'true' : 'false'}>
	<button
		type="button"
		aria-haspopup="listbox"
		aria-expanded={open}
		class="flex items-center pl-10 pr-8 py-1.5 w-full lg:w-auto lg:min-w-[140px] bg-surface-1 rounded-[6px] text-text-base transition-all duration-200 cursor-pointer border focus:outline-none {buttonClass}"
		onclick={onToggle}
		tabindex="0"
	>
		{#if Icon}
			<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
				<svelte:component this={Icon} size={16} class="lucide-icon transition-colors duration-200" />
			</div>
		{/if}
		<span class="flex-1 text-left truncate">
			{selectedLabel}
		</span>
		<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
			<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-text-base transition-colors duration-200">
				<polyline points="6,9 12,15 18,9"></polyline>
			</svg>
		</div>
	</button>
	{#if open}
		<div class="absolute left-0 w-full mt-[6px] bg-surface-1 border border-border-subtle rounded-[6px] z-[9999] overflow-hidden p-0 flex flex-col">
			<ul 
				role="listbox" 
				class="overflow-y-scroll {scrollable ? 'custom-list-scrollbar' : ''} p-0 m-0 w-full"
				style={scrollable ? "backface-visibility: hidden; transform: translateZ(0); max-height: {maxHeight};" : ""}
			>
				{#each options as opt, index}
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
						style={scrollable ? "font-smooth: always; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; text-rendering: optimizeLegibility;" : ""}
					>
						{opt.label}
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>

