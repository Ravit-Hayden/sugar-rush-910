<script lang="ts">
	import { Download, UserPlus, Trash2, ChevronDown } from 'lucide-svelte';
	import { useClickOutside, useEscapeKey } from '$lib/utils/clickOutside';

	export interface BulkAction {
		label: string;
		value: string;
	}

	interface Props {
		selectedCount: number;
		statusOptions: BulkAction[];
		onDownload: () => void;
		onAssignMember: () => void;
		onStatusChange: (status: string) => void;
		onDelete: () => void;
		onDeselect: () => void;
		menuOpen: boolean;
		onToggleMenu: () => void;
		onCloseMenu: () => void;
	}

	let {
		selectedCount,
		statusOptions,
		onDownload,
		onAssignMember,
		onStatusChange,
		onDelete,
		onDeselect,
		menuOpen,
		onToggleMenu,
		onCloseMenu
	}: Props = $props();

	let menuElement: HTMLDivElement;

	// 외부 클릭 감지
	$effect(() => {
		return useClickOutside('.bulk-action-menu', () => {
			onCloseMenu();
		}, menuOpen);
	});

	// Escape 키 감지
	$effect(() => {
		return useEscapeKey(() => {
			onCloseMenu();
		}, menuOpen);
	});

	function handleStatusChange(status: string) {
		onStatusChange(status);
		onCloseMenu();
	}
</script>

<div class="mb-4 p-4 bg-surface-1 border border-border-subtle rounded-lg flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
	<div class="flex items-center gap-2">
		<span class="text-sm font-medium text-text-base">
			<span class="text-hover-cyan">{selectedCount}</span>개 선택됨
		</span>
	</div>
	<div class="flex flex-wrap items-center gap-2 flex-1">
		<button
			onclick={onDownload}
			class="action-button inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-border-subtle bg-surface-1 rounded-md transition-colors duration-200"
			aria-label="선택한 항목 다운로드"
		>
			<Download size={16} class="action-button-icon" />
			<span class="action-button-text">다운로드</span>
		</button>
		<button
			onclick={onAssignMember}
			class="action-button inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-border-subtle bg-surface-1 rounded-md transition-colors duration-200"
			aria-label="선택한 항목 멤버 배정"
		>
			<UserPlus size={16} class="action-button-icon" />
			<span class="action-button-text">멤버 배정</span>
		</button>
		<div bind:this={menuElement} class="relative bulk-action-menu filter-dropdown" data-open={menuOpen ? 'true' : 'false'}>
			<button
				type="button"
				aria-haspopup="listbox"
				aria-expanded={menuOpen}
				onclick={onToggleMenu}
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						onToggleMenu();
					}
				}}
				class="action-button inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-border-subtle bg-surface-1 rounded-md transition-colors duration-200"
				aria-label="상태 변경"
				tabindex="0"
			>
				<span class="action-button-text">상태 변경</span>
				<ChevronDown size={14} class="action-button-icon {menuOpen ? 'rotate-180' : ''}" />
			</button>
			{#if menuOpen}
				<ul role="listbox" class="absolute left-0 w-full mt-[6px] bg-surface-1 border rounded-[6px] z-[9999] border-border-subtle overflow-hidden pt-0">
					{#each statusOptions as opt}
						<li
							role="option"
							aria-selected={false}
							tabindex="0"
							onclick={(e) => {
								handleStatusChange(opt.value);
							}}
							onkeydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									handleStatusChange(opt.value);
								}
							}}
						>
							{opt.label}
						</li>
					{/each}
				</ul>
			{/if}
		</div>
		<button
			onclick={onDelete}
			class="action-button inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-border-subtle bg-surface-1 rounded-md transition-colors duration-200 text-red-500"
			aria-label="선택한 항목 삭제"
		>
			<Trash2 size={16} class="action-button-icon" />
			<span class="action-button-text">삭제</span>
		</button>
	</div>
	<button
		onclick={onDeselect}
		class="text-sm text-text-muted hover:text-hover-cyan focus:text-brand-pink focus-visible:text-brand-pink transition-colors duration-200"
		aria-label="선택 해제"
	>
		선택 해제
	</button>
</div>


