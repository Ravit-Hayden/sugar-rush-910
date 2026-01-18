<script lang="ts">
	import { Keyboard, X } from 'lucide-svelte';
	import { browser } from '$app/environment';

	// Props
	interface Props {
		onAction?: (action: string) => void;
		showHelp?: boolean;
		onCloseHelp?: () => void;
	}

	let { onAction, showHelp = false, onCloseHelp }: Props = $props();

	// 단축키 정의
	const shortcuts = [
		{ key: 'N', modifier: 'Ctrl', action: 'new_project', label: '새 프로젝트' },
		{ key: 'S', modifier: 'Ctrl', action: 'save', label: '저장' },
		{ key: 'E', modifier: 'Ctrl', action: 'export', label: '내보내기' },
		{ key: 'F', modifier: 'Ctrl', action: 'search', label: '검색' },
		{ key: '1', modifier: 'Ctrl', action: 'tab_lyrics', label: '가사 탭' },
		{ key: '2', modifier: 'Ctrl', action: 'tab_prompt', label: '프롬프트 탭' },
		{ key: '3', modifier: 'Ctrl', action: 'tab_audio', label: '음원 탭' },
		{ key: '4', modifier: 'Ctrl', action: 'tab_progress', label: '진행률 탭' },
		{ key: 'Space', modifier: '', action: 'play_pause', label: '재생/일시정지' },
		{ key: '?', modifier: 'Shift', action: 'help', label: '단축키 도움말' },
		{ key: 'Escape', modifier: '', action: 'close', label: '닫기' }
	];

	// 키보드 이벤트 핸들러
	function handleKeyDown(e: KeyboardEvent) {
		// 입력 필드에서는 무시
		if (e.target instanceof HTMLInputElement || 
			e.target instanceof HTMLTextAreaElement || 
			e.target instanceof HTMLSelectElement) {
			return;
		}

		const key = e.key.toUpperCase();
		const hasCtrl = e.ctrlKey || e.metaKey;
		const hasShift = e.shiftKey;

		for (const shortcut of shortcuts) {
			const matchKey = shortcut.key.toUpperCase() === key || 
				(shortcut.key === 'Space' && e.code === 'Space') ||
				(shortcut.key === 'Escape' && e.key === 'Escape');
			
			const matchModifier = 
				(shortcut.modifier === 'Ctrl' && hasCtrl && !hasShift) ||
				(shortcut.modifier === 'Shift' && hasShift && !hasCtrl) ||
				(shortcut.modifier === '' && !hasCtrl && !hasShift);

			if (matchKey && matchModifier) {
				e.preventDefault();
				onAction?.(shortcut.action);
				return;
			}
		}
	}

	// 이벤트 리스너 등록
	$effect(() => {
		if (!browser) return;
		
		document.addEventListener('keydown', handleKeyDown);
		
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	});
</script>

<!-- 단축키 도움말 모달 -->
{#if showHelp}
	<div
		class="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
		onclick={onCloseHelp}
		role="dialog"
		aria-modal="true"
	>
		<div
			class="bg-surface-1 rounded-lg border border-border-subtle w-full max-w-md"
			onclick={(e) => e.stopPropagation()}
		>
			<div class="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
				<div class="flex items-center gap-2">
					<Keyboard size={20} class="text-brand-pink" />
					<h2 class="text-lg font-semibold text-text-strong">키보드 단축키</h2>
				</div>
				<button type="button" onclick={onCloseHelp} class="btn-icon">
					<X size={20} />
				</button>
			</div>

			<div class="p-6">
				<div class="space-y-1">
					{#each shortcuts as shortcut}
						<div class="flex items-center justify-between py-2">
							<span class="text-sm text-text-base">{shortcut.label}</span>
							<div class="flex items-center gap-1">
								{#if shortcut.modifier}
									<kbd class="px-2 py-1 rounded bg-surface-2 text-xs font-mono text-text-muted">
										{shortcut.modifier}
									</kbd>
									<span class="text-text-muted">+</span>
								{/if}
								<kbd class="px-2 py-1 rounded bg-surface-2 text-xs font-mono text-text-muted">
									{shortcut.key}
								</kbd>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<div class="px-6 py-4 border-t border-border-subtle text-center">
				<p class="text-xs text-text-muted">
					<kbd class="px-1.5 py-0.5 rounded bg-surface-2 font-mono">Shift</kbd> + 
					<kbd class="px-1.5 py-0.5 rounded bg-surface-2 font-mono">?</kbd> 
					를 눌러 이 도움말을 다시 열 수 있습니다
				</p>
			</div>
		</div>
	</div>
{/if}
