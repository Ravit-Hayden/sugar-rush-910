<script lang="ts">
	import { useClickOutside } from '$lib/utils/clickOutside';
	import { X, ChevronUp, ChevronDown } from 'lucide-svelte';
	import { GENRES } from '$lib/constants/genres';

	interface Props {
		open: boolean;
		selectedGenres: Set<string>;
		playsMin: string;
		playsMax: string;
		likesMin: string;
		likesMax: string;
		onClose: () => void;
		onGenreToggle: (genre: string) => void;
		onGenreClear: () => void;
		onPlaysMinChange: (value: string) => void;
		onPlaysMaxChange: (value: string) => void;
		onLikesMinChange: (value: string) => void;
		onLikesMaxChange: (value: string) => void;
		onReset: () => void;
	}

	let {
		open,
		selectedGenres,
		playsMin,
		playsMax,
		likesMin,
		likesMax,
		onClose,
		onGenreToggle,
		onGenreClear,
		onPlaysMinChange,
		onPlaysMaxChange,
		onLikesMinChange,
		onLikesMaxChange,
		onReset
	}: Props = $props();

	// 외부 클릭 감지 (고급 검색 버튼 제외)
	$effect(() => {
		if (!open) return;

		function handleClickOutside(event: MouseEvent) {
			const target = event.target as HTMLElement;
			// 고급 검색 버튼은 제외
			if (!target.closest('.advanced-search-panel') && !target.closest('button[aria-label="고급 검색"]')) {
				onClose();
			}
		}

		const timeoutId = setTimeout(() => {
			document.addEventListener('click', handleClickOutside, true);
		}, 0);

		return () => {
			clearTimeout(timeoutId);
			document.removeEventListener('click', handleClickOutside, true);
		};
	});
</script>

{#if open}
	<div class="advanced-search-panel absolute top-full left-0 right-0 mt-2 p-4 bg-surface-1 border border-border-subtle rounded-lg shadow-lg z-[9999]">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-sm font-semibold text-text-base">고급 검색</h3>
			<button
				onclick={onClose}
				class="w-6 h-6 flex items-center justify-center rounded hover:bg-surface-2 transition-colors"
				aria-label="닫기"
			>
				<X size={14} class="text-text-muted" />
			</button>
		</div>
		
		<div class="space-y-4">
			<!-- 여러 장르 선택 -->
			<div>
				<label class="block text-xs font-medium text-text-muted mb-2">장르 (여러 개 선택 가능)</label>
				<div class="max-h-48 overflow-y-auto custom-list-scrollbar border border-border-subtle rounded-md p-2">
					<div class="flex flex-wrap gap-2">
						{#each GENRES as genre}
							<button
								onclick={() => onGenreToggle(genre)}
								class="px-3 py-1.5 text-xs rounded-md border transition-colors duration-200 {selectedGenres.has(genre) ? 'bg-brand-pink text-white border-brand-pink' : 'bg-surface-2 text-text-base border-border-subtle'}"
								aria-pressed={selectedGenres.has(genre)}
							>
								{genre}
							</button>
						{/each}
					</div>
				</div>
				{#if selectedGenres.size > 0}
					<button
						onclick={onGenreClear}
						class="mt-2 text-xs text-text-muted hover:text-text-base transition-colors"
					>
						선택 해제
					</button>
				{/if}
			</div>
			
			<!-- 통계 범위 -->
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label class="block text-xs font-medium text-text-muted mb-2">재생수 범위</label>
					<div class="flex gap-2">
						<div class="relative flex-1">
							<input
								type="number"
								placeholder="최소"
								value={playsMin}
								oninput={(e) => {
									onPlaysMinChange((e.currentTarget as HTMLInputElement).value);
								}}
								class="w-full px-3 pr-8 py-1.5 text-sm bg-surface-2 border border-border-subtle rounded-md text-text-base focus:outline-none focus:border-brand-pink transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
								min="0"
							/>
							<div class="absolute inset-y-0 right-0 flex flex-col pointer-events-none pr-1">
								<button
									type="button"
									onclick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										const current = parseInt(playsMin) || 0;
										onPlaysMinChange(String(current + 1));
									}}
									class="pointer-events-auto h-1/2 flex items-center justify-center text-text-muted hover:text-hover-cyan focus:text-hover-cyan transition-colors duration-200 bg-transparent"
									aria-label="증가"
								>
									<ChevronUp size={12} />
								</button>
								<button
									type="button"
									onclick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										const current = parseInt(playsMin) || 0;
										onPlaysMinChange(String(Math.max(0, current - 1)));
									}}
									class="pointer-events-auto h-1/2 flex items-center justify-center text-text-muted hover:text-hover-cyan focus:text-hover-cyan transition-colors duration-200 bg-transparent"
									aria-label="감소"
								>
									<ChevronDown size={12} />
								</button>
							</div>
						</div>
						<span class="flex items-center text-text-muted">~</span>
						<div class="relative flex-1">
							<input
								type="number"
								placeholder="최대"
								value={playsMax}
								oninput={(e) => {
									onPlaysMaxChange((e.currentTarget as HTMLInputElement).value);
								}}
								class="w-full px-3 pr-8 py-1.5 text-sm bg-surface-2 border border-border-subtle rounded-md text-text-base focus:outline-none focus:border-brand-pink transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
								min="0"
							/>
							<div class="absolute inset-y-0 right-0 flex flex-col pointer-events-none pr-1">
								<button
									type="button"
									onclick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										const current = parseInt(playsMax) || 0;
										onPlaysMaxChange(String(current + 1));
									}}
									class="pointer-events-auto h-1/2 flex items-center justify-center text-text-muted hover:text-hover-cyan focus:text-hover-cyan transition-colors duration-200 bg-transparent"
									aria-label="증가"
								>
									<ChevronUp size={12} />
								</button>
								<button
									type="button"
									onclick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										const current = parseInt(playsMax) || 0;
										onPlaysMaxChange(String(Math.max(0, current - 1)));
									}}
									class="pointer-events-auto h-1/2 flex items-center justify-center text-text-muted hover:text-hover-cyan focus:text-hover-cyan transition-colors duration-200 bg-transparent"
									aria-label="감소"
								>
									<ChevronDown size={12} />
								</button>
							</div>
						</div>
					</div>
				</div>
				<div>
					<label class="block text-xs font-medium text-text-muted mb-2">좋아요 범위</label>
					<div class="flex gap-2">
						<div class="relative flex-1">
							<input
								type="number"
								placeholder="최소"
								value={likesMin}
								oninput={(e) => {
									onLikesMinChange((e.currentTarget as HTMLInputElement).value);
								}}
								class="w-full px-3 pr-8 py-1.5 text-sm bg-surface-2 border border-border-subtle rounded-md text-text-base focus:outline-none focus:border-brand-pink transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
								min="0"
							/>
							<div class="absolute inset-y-0 right-0 flex flex-col pointer-events-none pr-1">
								<button
									type="button"
									onclick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										const current = parseInt(likesMin) || 0;
										onLikesMinChange(String(current + 1));
									}}
									class="pointer-events-auto h-1/2 flex items-center justify-center text-text-muted hover:text-hover-cyan focus:text-hover-cyan transition-colors duration-200 bg-transparent"
									aria-label="증가"
								>
									<ChevronUp size={12} />
								</button>
								<button
									type="button"
									onclick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										const current = parseInt(likesMin) || 0;
										onLikesMinChange(String(Math.max(0, current - 1)));
									}}
									class="pointer-events-auto h-1/2 flex items-center justify-center text-text-muted hover:text-hover-cyan focus:text-hover-cyan transition-colors duration-200 bg-transparent"
									aria-label="감소"
								>
									<ChevronDown size={12} />
								</button>
							</div>
						</div>
						<span class="flex items-center text-text-muted">~</span>
						<div class="relative flex-1">
							<input
								type="number"
								placeholder="최대"
								value={likesMax}
								oninput={(e) => {
									onLikesMaxChange((e.currentTarget as HTMLInputElement).value);
								}}
								class="w-full px-3 pr-8 py-1.5 text-sm bg-surface-2 border border-border-subtle rounded-md text-text-base focus:outline-none focus:border-brand-pink transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
								min="0"
							/>
							<div class="absolute inset-y-0 right-0 flex flex-col pointer-events-none pr-1">
								<button
									type="button"
									onclick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										const current = parseInt(likesMax) || 0;
										onLikesMaxChange(String(current + 1));
									}}
									class="pointer-events-auto h-1/2 flex items-center justify-center text-text-muted hover:text-hover-cyan focus:text-hover-cyan transition-colors duration-200 bg-transparent"
									aria-label="증가"
								>
									<ChevronUp size={12} />
								</button>
								<button
									type="button"
									onclick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										const current = parseInt(likesMax) || 0;
										onLikesMaxChange(String(Math.max(0, current - 1)));
									}}
									class="pointer-events-auto h-1/2 flex items-center justify-center text-text-muted hover:text-hover-cyan focus:text-hover-cyan transition-colors duration-200 bg-transparent"
									aria-label="감소"
								>
									<ChevronDown size={12} />
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			
			<!-- 초기화 버튼 -->
			<div class="flex justify-end gap-2 pt-2 border-t border-border-subtle">
				<button
					onclick={onReset}
					class="px-3 py-1.5 text-xs bg-surface-2 hover:bg-surface-3 text-text-base rounded-md transition-colors"
				>
					초기화
				</button>
			</div>
		</div>
	</div>
{/if}


