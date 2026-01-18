<script lang="ts">
	import { Shuffle, Copy, Check, Plus, Minus, Sparkles } from 'lucide-svelte';
	import { WORD_CATEGORIES, getCategoryName } from '$lib/constants/suno/categories';
	import type { WordEntry, WordCategory } from '$lib/types/suno';

	// Props
	interface Props {
		words: WordEntry[];
		onUseResult?: (result: string) => void;
	}

	let { words, onUseResult }: Props = $props();

	// 카테고리별 선택 개수
	let categorySelections = $state<Record<WordCategory, number>>(
		Object.fromEntries(WORD_CATEGORIES.map(cat => [cat.id, 0])) as Record<WordCategory, number>
	);

	// 결과
	let combinedResult = $state('');
	let copied = $state(false);

	// 카테고리별 워드 그룹
	const wordsByCategory = $derived.by(() => {
		const grouped: Record<WordCategory, WordEntry[]> = {} as Record<WordCategory, WordEntry[]>;
		WORD_CATEGORIES.forEach(cat => {
			grouped[cat.id] = words.filter(w => w.category === cat.id);
		});
		return grouped;
	});

	// 선택 개수 조절
	function incrementCategory(category: WordCategory) {
		const max = wordsByCategory[category]?.length || 0;
		if (categorySelections[category] < max) {
			categorySelections[category]++;
		}
	}

	function decrementCategory(category: WordCategory) {
		if (categorySelections[category] > 0) {
			categorySelections[category]--;
		}
	}

	// 랜덤 조합 생성
	function generateCombination() {
		const selected: string[] = [];

		WORD_CATEGORIES.forEach(cat => {
			const count = categorySelections[cat.id];
			if (count > 0) {
				const categoryWords = wordsByCategory[cat.id];
				if (categoryWords.length > 0) {
					// 랜덤 셔플 후 선택
					const shuffled = [...categoryWords].sort(() => Math.random() - 0.5);
					const picked = shuffled.slice(0, Math.min(count, shuffled.length));
					picked.forEach(w => selected.push(w.content));
				}
			}
		});

		combinedResult = selected.join(' + ');
	}

	// 결과 복사
	async function copyResult() {
		if (!combinedResult) return;
		
		try {
			await navigator.clipboard.writeText(combinedResult);
			copied = true;
			setTimeout(() => copied = false, 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}

	// 결과 사용
	function useResult() {
		if (onUseResult && combinedResult) {
			onUseResult(combinedResult);
		}
	}

	// 선택된 총 개수
	const totalSelected = $derived(
		Object.values(categorySelections).reduce((sum, count) => sum + count, 0)
	);

	// 빠른 프리셋
	function applyPreset(preset: 'basic' | 'full' | 'style') {
		// 초기화
		WORD_CATEGORIES.forEach(cat => {
			categorySelections[cat.id] = 0;
		});

		if (preset === 'basic') {
			categorySelections['topic'] = 1;
			categorySelections['mood'] = 1;
			categorySelections['emotion'] = 1;
		} else if (preset === 'full') {
			categorySelections['topic'] = 1;
			categorySelections['mood'] = 1;
			categorySelections['action'] = 1;
			categorySelections['emotion'] = 1;
			categorySelections['place'] = 1;
		} else if (preset === 'style') {
			categorySelections['style'] = 2;
			categorySelections['mood'] = 1;
		}
	}

	// 초기화
	function resetSelections() {
		WORD_CATEGORIES.forEach(cat => {
			categorySelections[cat.id] = 0;
		});
		combinedResult = '';
	}
</script>

<div class="bg-surface-1 rounded-lg border border-border-subtle overflow-hidden">
	<!-- 헤더 -->
	<div class="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
		<div class="flex items-center gap-2">
			<Sparkles size={20} class="text-brand-pink" />
			<h3 class="text-lg font-semibold text-text-strong">랜덤 조합 생성기</h3>
		</div>
		<div class="flex gap-2">
			<button
				type="button"
				onclick={() => applyPreset('basic')}
				class="px-3 py-1.5 text-sm rounded-md bg-surface-2 text-text-base hover:bg-surface-2/80 transition-colors"
			>
				기본
			</button>
			<button
				type="button"
				onclick={() => applyPreset('full')}
				class="px-3 py-1.5 text-sm rounded-md bg-surface-2 text-text-base hover:bg-surface-2/80 transition-colors"
			>
				풀 조합
			</button>
			<button
				type="button"
				onclick={() => applyPreset('style')}
				class="px-3 py-1.5 text-sm rounded-md bg-surface-2 text-text-base hover:bg-surface-2/80 transition-colors"
			>
				스타일
			</button>
			<button
				type="button"
				onclick={resetSelections}
				class="px-3 py-1.5 text-sm rounded-md text-text-muted hover:text-text-base transition-colors"
			>
				초기화
			</button>
		</div>
	</div>

	<!-- 카테고리 선택 -->
	<div class="p-6">
		<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
			{#each WORD_CATEGORIES as cat}
				{@const available = wordsByCategory[cat.id]?.length || 0}
				{@const selected = categorySelections[cat.id]}
				<div class="flex items-center justify-between p-3 rounded-lg bg-surface-2 {selected > 0 ? 'ring-1 ring-brand-pink' : ''}">
					<div class="flex-1 min-w-0">
						<div class="text-sm font-medium text-text-base truncate">{cat.name}</div>
						<div class="text-xs text-text-muted">{available}개</div>
					</div>
					<div class="flex items-center gap-1">
						<button
							type="button"
							onclick={() => decrementCategory(cat.id)}
							disabled={selected === 0}
							class="w-6 h-6 flex items-center justify-center rounded bg-surface-1 text-text-muted hover:text-text-base disabled:opacity-30 transition-colors"
						>
							<Minus size={12} />
						</button>
						<span class="w-6 text-center text-sm font-medium text-text-base">{selected}</span>
						<button
							type="button"
							onclick={() => incrementCategory(cat.id)}
							disabled={selected >= available}
							class="w-6 h-6 flex items-center justify-center rounded bg-surface-1 text-text-muted hover:text-text-base disabled:opacity-30 transition-colors"
						>
							<Plus size={12} />
						</button>
					</div>
				</div>
			{/each}
		</div>

		<!-- 생성 버튼 -->
		<div class="mt-6 flex items-center justify-center gap-4">
			<button
				type="button"
				onclick={generateCombination}
				disabled={totalSelected === 0}
				class="flex items-center gap-2 px-6 py-3 bg-brand-pink text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-pink/90"
			>
				<Shuffle size={18} />
				랜덤 조합 생성 ({totalSelected}개 선택)
			</button>
		</div>

		<!-- 결과 -->
		{#if combinedResult}
			<div class="mt-6 p-4 rounded-lg bg-surface-2 border border-border-subtle">
				<div class="flex items-start justify-between gap-4">
					<div class="flex-1">
						<div class="text-xs text-text-muted mb-2">생성된 조합</div>
						<div class="text-base text-text-strong font-medium">{combinedResult}</div>
					</div>
					<div class="flex items-center gap-2 flex-shrink-0">
						<button
							type="button"
							onclick={copyResult}
							class="flex items-center gap-1 px-3 py-1.5 rounded-md bg-surface-1 text-text-base text-sm hover:bg-surface-1/80 transition-colors"
						>
							{#if copied}
								<Check size={14} class="text-green-500" />
								복사됨
							{:else}
								<Copy size={14} />
								복사
							{/if}
						</button>
						{#if onUseResult}
							<button
								type="button"
								onclick={useResult}
								class="flex items-center gap-1 px-3 py-1.5 rounded-md bg-brand-pink text-white text-sm hover:bg-brand-pink/90 transition-colors"
							>
								사용하기
							</button>
						{/if}
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
