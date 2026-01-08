<script lang="ts">
	import { useClickOutside, useEscapeKey } from '$lib/utils/clickOutside';
	import { MoreVertical } from 'lucide-svelte';

	export interface MenuItem {
		label: string;
		icon?: any; // Lucide icon component
		onClick: () => void;
		ariaLabel?: string;
		separator?: boolean; // 구분선 여부
		danger?: boolean; // 위험한 액션 (빨간색)
	}

	interface Props {
		itemId: string;
		openId: string | null;
		items: MenuItem[];
		buttonClass?: string;
		menuClass?: string;
		position?: 'bottom-right' | 'top-right' | 'bottom-left' | 'top-left';
		onToggle: (id: string) => void;
		onClose: () => void;
	}

	let {
		itemId,
		openId,
		items,
		buttonClass = '',
		menuClass = '',
		position = 'bottom-right',
		onToggle,
		onClose
	}: Props = $props();

	let containerElement: HTMLDivElement;
	const isOpen = $derived(openId === itemId);

	function handleToggle(e: MouseEvent | KeyboardEvent) {
		e.preventDefault();
		e.stopPropagation();
		onToggle(itemId);
	}

	function handleItemClick(item: MenuItem, e: MouseEvent | KeyboardEvent) {
		e.preventDefault();
		e.stopPropagation();
		item.onClick();
		onClose();
	}

	// 외부 클릭 감지
	$effect(() => {
		if (!isOpen) return () => {};
		return useClickOutside('.more-menu-dropdown', () => {
			onClose();
		}, isOpen);
	});

	// Escape 키 감지
	$effect(() => {
		return useEscapeKey(() => {
			onClose();
		}, isOpen);
	});

	// 위치 클래스 계산
	const positionClasses = $derived(() => {
		switch (position) {
			case 'top-right':
				return 'right-0 bottom-full mb-1';
			case 'top-left':
				return 'left-0 bottom-full mb-1';
			case 'bottom-left':
				return 'left-0 top-full mt-1';
			case 'bottom-right':
			default:
				return 'right-0 top-full mt-1';
		}
	});

	const slideClass = $derived(() => {
		switch (position) {
			case 'top-right':
			case 'top-left':
				return 'slide-in-from-bottom-2';
			case 'bottom-right':
			case 'bottom-left':
			default:
				return 'slide-in-from-top-2';
		}
	});
</script>

<div bind:this={containerElement} class="relative more-menu-dropdown">
	<button
		onclick={handleToggle}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				handleToggle(e);
			}
		}}
		class="btn-icon action-button h-8 w-8 inline-flex items-center justify-center rounded-md border border-border-subtle bg-surface-1 {buttonClass}"
		aria-label="더보기"
		aria-expanded={isOpen}
		aria-haspopup="menu"
		title="더보기"
		tabindex="0"
	>
		<MoreVertical size={16} class="action-button-icon" />
	</button>
	
	{#if isOpen}
		<div 
			role="menu"
			class="absolute {positionClasses()} w-48 bg-surface-1 border border-border-subtle rounded-lg z-50 animate-in fade-in {slideClass} duration-200 {menuClass}"
		>
			<div class="py-1">
				{#each items as item, index}
					{#if item.separator && index > 0}
						<div class="border-t border-border-subtle my-1"></div>
					{/if}
					<button 
						role="menuitem"
						onclick={(e) => handleItemClick(item, e)}
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								handleItemClick(item, e);
							}
						}}
						class="btn-ghost group w-full flex items-center gap-2 px-4 py-2 text-sm {item.danger ? 'text-red-500' : 'text-text-base'} text-left"
						aria-label={item.ariaLabel || item.label}
					>
						{#if item.icon}
							<svelte:component this={item.icon} size={16} class="{item.danger ? 'text-red-500' : 'text-text-muted'}" />
						{/if}
						{item.label}
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>

