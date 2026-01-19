<script lang="ts">
	import { Plus, Search, Trash2, Edit2, Link, Shuffle, X, ChevronDown } from 'lucide-svelte';
	import RandomCombinator from '$lib/components/suno/RandomCombinator.svelte';
	import SUNOTabs from '$lib/components/suno/SUNOTabs.svelte';
	import { WORD_CATEGORIES, getCategoryName } from '$lib/constants/suno/categories';
	import type { WordEntry, WordCategory, Producer } from '$lib/types/suno';
	
	// 랜덤 조합기 표시 상태
	let showCombinator = $state(false);

	// 목업 데이터
	let words = $state<WordEntry[]>([
		{ id: '1', content: '달콤한 꿈', category: 'topic', tags: ['sweet', 'dream'], usageCount: 5, linkedTracks: ['track1', 'track2'], createdAt: '2026-01-10', createdBy: 'El' },
		{ id: '2', content: '여름밤의 설렘', category: 'mood', tags: ['summer', 'night'], usageCount: 3, linkedTracks: ['track1'], createdAt: '2026-01-11', createdBy: 'Otte' },
		{ id: '3', content: '춤추는', category: 'action', tags: ['dance'], usageCount: 8, linkedTracks: ['track2', 'track3'], createdAt: '2026-01-09', createdBy: 'El' },
		{ id: '4', content: '마카롱', category: 'dessert', tags: ['macaron', 'sweet'], usageCount: 2, linkedTracks: [], createdAt: '2026-01-12', createdBy: 'Otte' },
		{ id: '5', content: '벚꽃이 흩날리는', category: 'season', tags: ['spring', 'cherry'], usageCount: 4, linkedTracks: ['track1'], createdAt: '2026-01-08', createdBy: 'El' },
		{ id: '6', content: '크리스마스', category: 'event', tags: ['christmas', 'winter'], usageCount: 6, linkedTracks: ['track4'], createdAt: '2026-01-07', createdBy: 'Otte' },
		{ id: '7', content: '설레는 마음', category: 'emotion', tags: ['excited', 'love'], usageCount: 10, linkedTracks: ['track1', 'track2', 'track3'], createdAt: '2026-01-06', createdBy: 'El' },
		{ id: '8', content: '해변가', category: 'place', tags: ['beach', 'sea'], usageCount: 3, linkedTracks: ['track2'], createdAt: '2026-01-05', createdBy: 'Otte' },
		{ id: '9', content: '새벽 3시', category: 'time', tags: ['dawn', 'night'], usageCount: 2, linkedTracks: [], createdAt: '2026-01-13', createdBy: 'El' },
		{ id: '10', content: '빈티지 카메라', category: 'object', tags: ['vintage', 'camera'], usageCount: 1, linkedTracks: [], createdAt: '2026-01-13', createdBy: 'Otte' },
		{ id: '11', content: '너와 함께라면 어디든', category: 'phrase', tags: ['love', 'together'], usageCount: 7, linkedTracks: ['track1', 'track3'], createdAt: '2026-01-04', createdBy: 'El' },
		{ id: '12', content: 'dreamy synth-pop with ethereal vocals', category: 'style', tags: ['synth', 'dreamy'], usageCount: 12, linkedTracks: ['track1', 'track2', 'track3', 'track4'], createdAt: '2026-01-03', createdBy: 'El' },
		{ id: '13', content: 'heavy metal, screaming', category: 'exclude', tags: ['metal'], usageCount: 8, linkedTracks: ['track1', 'track2'], createdAt: '2026-01-02', createdBy: 'Otte' }
	]);

	// 필터 상태
	let searchQuery = $state('');
	let selectedCategory = $state<WordCategory | 'all'>('all');
	let selectedCreator = $state<Producer | 'all'>('all');
	let categoryDropdownOpen = $state(false);

	// 새 항목 추가 모달 상태
	let showAddModal = $state(false);
	let newWord = $state({
		content: '',
		category: 'topic' as WordCategory,
		tags: '',
		createdBy: 'El' as Producer
	});

	// 필터링된 워드 목록
	const filteredWords = $derived.by(() => {
		return words.filter(word => {
			// 검색어 필터
			if (searchQuery && !word.content.toLowerCase().includes(searchQuery.toLowerCase())) {
				return false;
			}
			// 카테고리 필터
			if (selectedCategory !== 'all' && word.category !== selectedCategory) {
				return false;
			}
			// 제작자 필터
			if (selectedCreator !== 'all' && word.createdBy !== selectedCreator) {
				return false;
			}
			return true;
		});
	});

	// 카테고리별 통계
	const categoryStats = $derived.by(() => {
		const stats: Record<string, number> = { all: words.length };
		WORD_CATEGORIES.forEach(cat => {
			stats[cat.id] = words.filter(w => w.category === cat.id).length;
		});
		return stats;
	});

	// 새 워드 추가
	function addWord() {
		if (!newWord.content.trim()) return;

		const id = `word_${Date.now()}`;
		words = [...words, {
			id,
			content: newWord.content.trim(),
			category: newWord.category,
			tags: newWord.tags.split(',').map(t => t.trim()).filter(t => t),
			usageCount: 0,
			linkedTracks: [],
			createdAt: new Date().toISOString().split('T')[0],
			createdBy: newWord.createdBy
		}];

		// 초기화
		newWord = { content: '', category: 'topic', tags: '', createdBy: 'El' };
		showAddModal = false;
	}

	// 워드 삭제
	function deleteWord(id: string) {
		if (confirm('이 항목을 삭제하시겠습니까?')) {
			words = words.filter(w => w.id !== id);
		}
	}

	// 외부 클릭 처리
	function handleClickOutside(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (!target.closest('.category-dropdown')) {
			categoryDropdownOpen = false;
		}
	}

	$effect(() => {
		if (categoryDropdownOpen) {
			document.addEventListener('click', handleClickOutside);
		}
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<svelte:head>
	<title>워드 라이브러리 | SUNO 제작</title>
</svelte:head>

<div class="pt-0 pb-6 sm:pb-6 pb-20 bg-bg text-text-base">
	<!-- 헤더 -->
	<div class="mb-8 mt-1.5">
		<div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
			<div>
				<h1 class="text-3xl font-bold text-text-strong mb-2">SUNO 제작</h1>
				<p class="text-text-muted">워드를 수집하고 조합합니다</p>
			</div>
			<div class="flex items-center gap-3 flex-shrink-0">
				<button
					type="button"
					onclick={() => showCombinator = !showCombinator}
					class="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors {showCombinator ? 'bg-brand-pink/10 border-brand-pink text-brand-pink' : 'border-border-subtle text-text-base hover:border-brand-pink'}"
				>
					<Shuffle size={16} />
					<span class="hidden sm:inline">랜덤 조합</span>
				</button>
				<button
					type="button"
					onclick={() => showAddModal = true}
					class="flex items-center gap-2 px-4 py-2 bg-brand-pink text-white rounded-lg font-medium hover:bg-brand-pink/90 transition-colors"
				>
					<Plus size={16} />
					<span class="hidden sm:inline">워드 추가</span>
				</button>
			</div>
		</div>
	</div>

	<!-- 탭 + 콘텐츠 -->
	<SUNOTabs>
		<!-- 랜덤 조합 생성기 -->
		{#if showCombinator}
			<div class="mb-6">
				<RandomCombinator {words} />
			</div>
		{/if}

		<!-- 필터 영역 -->
		<div class="mb-6 flex flex-col sm:flex-row gap-4">
			<!-- 검색 -->
			<div class="relative flex-1">
				<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
					<Search size={16} class="text-text-muted" />
				</div>
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="워드 검색..."
					class="w-full h-10 pl-10 pr-4 bg-surface-2 border border-border-subtle rounded-lg text-text-base focus:outline-none focus:border-brand-pink"
				/>
			</div>

			<!-- 카테고리 필터 -->
			<div class="relative category-dropdown">
				<button
					type="button"
					onclick={() => categoryDropdownOpen = !categoryDropdownOpen}
					class="w-full sm:w-48 h-10 px-4 pr-10 bg-surface-2 border border-border-subtle rounded-lg text-base text-text-base text-left focus:outline-none focus:border-brand-pink transition-colors"
				>
					<span class="block truncate">
						{selectedCategory === 'all' ? '전체 카테고리' : getCategoryName(selectedCategory)}
						{#if selectedCategory !== 'all'}
							<span class="text-text-muted ml-1">({categoryStats[selectedCategory]})</span>
						{/if}
					</span>
				</button>
				<div class="pointer-events-none absolute inset-y-0 right-2.5 flex items-center">
					<ChevronDown size={16} class="text-text-muted" />
				</div>
				{#if categoryDropdownOpen}
					<ul class="absolute left-0 w-full mt-[6px] bg-surface-2 border border-border-subtle rounded-[6px] z-10 max-h-60 overflow-y-auto custom-list-scrollbar">
						<li
							role="option"
							aria-selected={selectedCategory === 'all'}
							tabindex="0"
							onclick={() => { selectedCategory = 'all'; categoryDropdownOpen = false; }}
							onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { selectedCategory = 'all'; categoryDropdownOpen = false; } }}
							class="px-4 py-2 text-base text-text-base hover:bg-surface-1 cursor-pointer {selectedCategory === 'all' ? 'bg-brand-pink text-white' : ''}"
						>
							전체 ({categoryStats['all']})
						</li>
						{#each WORD_CATEGORIES as cat}
							<li
								role="option"
								aria-selected={selectedCategory === cat.id}
								tabindex="0"
								onclick={() => { selectedCategory = cat.id; categoryDropdownOpen = false; }}
								onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { selectedCategory = cat.id; categoryDropdownOpen = false; } }}
								class="px-4 py-2 text-base text-text-base hover:bg-surface-1 cursor-pointer {selectedCategory === cat.id ? 'bg-brand-pink text-white' : ''}"
							>
								{cat.name} ({categoryStats[cat.id] || 0})
							</li>
						{/each}
					</ul>
				{/if}
			</div>

			<!-- 제작자 필터 -->
			<div class="flex gap-2">
				<button
					type="button"
					onclick={() => selectedCreator = 'all'}
					class="px-4 py-2 rounded-lg border transition-colors {selectedCreator === 'all' ? 'bg-brand-pink text-white border-brand-pink' : 'bg-surface-2 text-text-base border-border-subtle hover:border-hover-point'}"
				>
					전체
				</button>
				<button
					type="button"
					onclick={() => selectedCreator = 'El'}
					class="px-4 py-2 rounded-lg border transition-colors {selectedCreator === 'El' ? 'bg-brand-pink text-white border-brand-pink' : 'bg-surface-2 text-text-base border-border-subtle hover:border-hover-point'}"
				>
					El
				</button>
				<button
					type="button"
					onclick={() => selectedCreator = 'Otte'}
					class="px-4 py-2 rounded-lg border transition-colors {selectedCreator === 'Otte' ? 'bg-brand-pink text-white border-brand-pink' : 'bg-surface-2 text-text-base border-border-subtle hover:border-hover-point'}"
				>
					Otte
				</button>
			</div>
		</div>

		<!-- 테이블 (데스크톱) / 카드 (모바일) -->
		<div class="bg-surface-2 rounded-lg border border-border-subtle overflow-hidden">
			<!-- 데스크톱 테이블 -->
			<div class="hidden md:block overflow-x-auto">
				<table class="w-full min-w-[640px]">
					<thead class="bg-bg">
						<tr>
							<th class="px-3 py-3 text-left text-sm font-medium text-text-strong">내용</th>
							<th class="px-3 py-3 text-left text-sm font-medium text-text-strong whitespace-nowrap">카테고리</th>
							<th class="px-3 py-3 text-left text-sm font-medium text-text-strong">태그</th>
							<th class="px-3 py-3 text-center text-sm font-medium text-text-strong whitespace-nowrap">사용</th>
							<th class="px-3 py-3 text-center text-sm font-medium text-text-strong whitespace-nowrap">제작자</th>
							<th class="px-3 py-3 text-center text-sm font-medium text-text-strong">액션</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-border-subtle">
						{#each filteredWords as word}
							<tr class="hover:bg-surface-1/50 transition-colors">
								<td class="px-3 py-3 text-sm text-text-base">{word.content}</td>
								<td class="px-3 py-3">
									<span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-bg text-text-base whitespace-nowrap">
										{getCategoryName(word.category)}
									</span>
								</td>
								<td class="px-3 py-3">
									<div class="flex flex-wrap gap-1">
										{#each word.tags.slice(0, 2) as tag}
											<span class="px-1.5 py-0.5 rounded text-xs bg-bg text-text-muted">
												{tag}
											</span>
										{/each}
										{#if word.tags.length > 2}
											<span class="text-xs text-text-muted">+{word.tags.length - 2}</span>
										{/if}
									</div>
								</td>
								<td class="px-3 py-3 text-center whitespace-nowrap">
									<span class="text-sm text-text-base">{word.usageCount}</span>
									{#if word.linkedTracks.length > 0}
										<Link size={12} class="inline ml-1 text-text-muted" />
									{/if}
								</td>
								<td class="px-3 py-3 text-center">
									<span class="text-sm font-medium {word.createdBy === 'El' ? 'text-elotte-green' : 'text-elotte-orange'}">
										{word.createdBy}
									</span>
								</td>
								<td class="px-3 py-3">
									<div class="flex items-center justify-center gap-1">
										<button
											type="button"
											class="btn-icon"
											aria-label="수정"
										>
											<Edit2 size={14} />
										</button>
										<button
											type="button"
											class="btn-icon text-red-400 hover:text-red-500"
											onclick={() => deleteWord(word.id)}
											aria-label="삭제"
										>
											<Trash2 size={14} />
										</button>
									</div>
								</td>
							</tr>
						{/each}
						{#if filteredWords.length === 0}
							<tr>
								<td colspan="6" class="px-4 py-12 text-center text-text-muted">
									{searchQuery || selectedCategory !== 'all' || selectedCreator !== 'all' 
										? '검색 결과가 없습니다.' 
										: '등록된 워드가 없습니다. 첫 번째 워드를 추가해보세요!'}
								</td>
							</tr>
						{/if}
					</tbody>
				</table>
			</div>

			<!-- 모바일 카드 레이아웃 -->
			<div class="md:hidden divide-y divide-border-subtle">
				{#each filteredWords as word}
					<div class="p-4">
						<div class="flex items-start justify-between gap-3 mb-2">
							<div class="flex-1 min-w-0">
								<p class="text-sm font-medium text-text-base">{word.content}</p>
								<div class="flex items-center gap-2 mt-1">
									<span class="px-2 py-0.5 rounded text-xs bg-bg text-text-muted">
										{getCategoryName(word.category)}
									</span>
									<span class="text-xs font-medium {word.createdBy === 'El' ? 'text-elotte-green' : 'text-elotte-orange'}">
										{word.createdBy}
									</span>
								</div>
							</div>
							<div class="flex items-center gap-1 flex-shrink-0">
								<button type="button" class="btn-icon" aria-label="수정">
									<Edit2 size={14} />
								</button>
								<button type="button" class="btn-icon text-red-400" onclick={() => deleteWord(word.id)} aria-label="삭제">
									<Trash2 size={14} />
								</button>
							</div>
						</div>
						<div class="flex items-center justify-between text-xs text-text-muted">
							<div class="flex flex-wrap gap-1">
								{#each word.tags.slice(0, 2) as tag}
									<span class="px-1.5 py-0.5 rounded bg-bg">{tag}</span>
								{/each}
								{#if word.tags.length > 2}
									<span>+{word.tags.length - 2}</span>
								{/if}
							</div>
							<div class="flex items-center gap-1">
								<span>{word.usageCount}회</span>
								{#if word.linkedTracks.length > 0}
									<Link size={12} />
								{/if}
							</div>
						</div>
					</div>
				{/each}
				{#if filteredWords.length === 0}
					<div class="px-4 py-12 text-center text-text-muted text-sm">
						{searchQuery || selectedCategory !== 'all' || selectedCreator !== 'all' 
							? '검색 결과가 없습니다.' 
							: '등록된 워드가 없습니다. 첫 번째 워드를 추가해보세요!'}
					</div>
				{/if}
			</div>
		</div>

		<!-- 통계 -->
		<div class="mt-6 text-sm text-text-muted">
			총 {words.length}개 워드 | 검색 결과 {filteredWords.length}개
		</div>
	</SUNOTabs>
</div>

<!-- 워드 추가 모달 -->
{#if showAddModal}
	<div
		class="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
		onclick={() => showAddModal = false}
		onkeydown={(e) => { if (e.key === 'Escape') showAddModal = false; }}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="bg-surface-1 rounded-lg border border-border-subtle w-full max-w-md"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
		>
			<div class="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
				<h2 class="text-lg font-semibold text-text-strong">새 워드 추가</h2>
				<button
					type="button"
					onclick={() => showAddModal = false}
					class="btn-icon"
					aria-label="닫기"
				>
					<X size={20} />
				</button>
			</div>

			<form onsubmit={(e) => { e.preventDefault(); addWord(); }} class="p-6 space-y-4">
				<!-- 내용 -->
				<div>
					<label for="word-content" class="block text-sm font-medium text-text-strong mb-2">
						내용
					</label>
					<input
						type="text"
						id="word-content"
						bind:value={newWord.content}
						class="input-base w-full h-10 px-4"
						placeholder="단어 또는 문구를 입력하세요"
						required
					/>
				</div>

				<!-- 카테고리 -->
				<div>
					<label for="word-category" class="block text-sm font-medium text-text-strong mb-2">
						카테고리
					</label>
					<select
						id="word-category"
						bind:value={newWord.category}
						class="input-base w-full h-10 px-4"
					>
						{#each WORD_CATEGORIES as cat}
							<option value={cat.id}>{cat.name}</option>
						{/each}
					</select>
				</div>

				<!-- 태그 -->
				<div>
					<label for="word-tags" class="block text-sm font-medium text-text-strong mb-2">
						태그 (쉼표로 구분)
					</label>
					<input
						type="text"
						id="word-tags"
						bind:value={newWord.tags}
						class="input-base w-full h-10 px-4"
						placeholder="tag1, tag2, tag3"
					/>
				</div>

				<!-- 제작자 -->
				<div>
					<span id="creator-label" class="block text-sm font-medium text-text-strong mb-2">제작자</span>
					<div class="flex gap-2" role="group" aria-labelledby="creator-label">
						<button
							type="button"
							onclick={() => newWord.createdBy = 'El'}
							class="flex-1 px-4 py-2 rounded-lg border transition-colors {newWord.createdBy === 'El' ? 'bg-brand-pink text-white border-brand-pink' : 'bg-surface-2 text-text-base border-border-subtle hover:border-hover-point'}"
						>
							El
						</button>
						<button
							type="button"
							onclick={() => newWord.createdBy = 'Otte'}
							class="flex-1 px-4 py-2 rounded-lg border transition-colors {newWord.createdBy === 'Otte' ? 'bg-brand-pink text-white border-brand-pink' : 'bg-surface-2 text-text-base border-border-subtle hover:border-hover-point'}"
						>
							Otte
						</button>
					</div>
				</div>

				<!-- 버튼 -->
				<div class="flex justify-end gap-3 pt-4">
					<button
						type="button"
						onclick={() => showAddModal = false}
						class="cancel-button px-6 py-2 bg-surface-2 text-text-base rounded-lg border border-border-subtle transition-colors font-medium"
					>
						취소
					</button>
					<button
						type="submit"
						class="px-6 py-2 bg-brand-pink text-white rounded-lg transition-colors font-medium"
					>
						추가
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
