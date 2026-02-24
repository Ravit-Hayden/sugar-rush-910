<script lang="ts">
	import { Plus, Search, Trash2, Edit2, Link, Shuffle, X, ChevronDown, Filter, UserRound, ArrowUpDown, BookOpen, SearchX, ArrowDownAZ, ListOrdered, RotateCcw, Tag, CheckSquare, Square, Star, Copy } from 'lucide-svelte';
	import RandomCombinator from '$lib/components/suno/RandomCombinator.svelte';
	import SUNOTabs from '$lib/components/suno/SUNOTabs.svelte';
	import { WORD_CATEGORIES, getCategoryName, getCategoryById } from '$lib/constants/suno/categories';
	import type { WordEntry, WordCategory, Producer } from '$lib/types/suno';
	import { mockSunoWords } from '$lib/mocks/suno-words';
	
	// 랜덤 조합기 표시 상태
	let showCombinator = $state(false);


	// 목업 데이터 - 확장된 워드 라이브러리
	let words = $state<WordEntry[]>([...mockSunoWords]);

	// 필터 상태
	let searchQuery = $state('');
	let selectedCategory = $state<WordCategory | 'all'>('all');
	let selectedCreator = $state<Producer | 'all'>('all');
	let categoryDropdownOpen = $state(false);
	let creatorDropdownOpen = $state(false);
	
	// 정렬 상태
	type SortOption = 'usage_desc' | 'usage_asc' | 'created_desc' | 'created_asc' | 'content_asc' | 'content_desc';
	let sortBy = $state<SortOption>('usage_desc');
	let sortDropdownOpen = $state(false);
	
	const sortLabels: Record<SortOption, string> = {
		usage_desc: '사용 많은순',
		usage_asc: '사용 적은순',
		created_desc: '최근 생성순',
		created_asc: '오래된 생성순',
		content_asc: '이름순 (ㄱ-ㅎ)',
		content_desc: '이름순 (ㅎ-ㄱ)'
	};
	
	const creatorLabels: Record<Producer | 'all', string> = {
		all: '전체',
		El: 'El',
		Otte: 'Otte'
	};

	// 태그 필터 상태
	let selectedTag = $state<string>('all');
	let tagDropdownOpen = $state(false);

	// 즐겨찾기 필터 (true면 즐겨찾기 워드만 표시)
	let showFavoritesOnly = $state(false);

	function toggleWordFavorite(id: string) {
		words = words.map(w =>
			w.id === id ? { ...w, favorite: !(w.favorite === true) } : w
		);
	}

	// 워드 내용 클립보드 복사
	let copiedWordId = $state<string | null>(null);
	async function copyWordContent(word: WordEntry) {
		try {
			await navigator.clipboard.writeText(word.content);
			copiedWordId = word.id;
			setTimeout(() => { copiedWordId = null; }, 1500);
		} catch (e) {
			console.error('복사 실패:', e);
		}
	}

	// 모든 태그 추출 (중복 제거, 정렬)
	const allTags = $derived.by(() => {
		const tagSet = new Set<string>();
		words.forEach(word => {
			word.tags.forEach(tag => tagSet.add(tag));
		});
		return Array.from(tagSet).sort();
	});

	// ========== 일괄 선택/삭제 기능 ==========
	let selectionMode = $state(false);
	let selectedIds = $state<Set<string>>(new Set());

	// 선택 모드 토글
	function toggleSelectionMode() {
		selectionMode = !selectionMode;
		if (!selectionMode) {
			selectedIds = new Set();
		}
	}

	// 개별 항목 선택 토글
	function toggleSelection(id: string) {
		const newSet = new Set(selectedIds);
		if (newSet.has(id)) {
			newSet.delete(id);
		} else {
			newSet.add(id);
		}
		selectedIds = newSet;
	}

	// 전체 선택
	function selectAll() {
		selectedIds = new Set(filteredWords.map(w => w.id));
	}

	// 전체 해제
	function deselectAll() {
		selectedIds = new Set();
	}

	// 선택된 항목 삭제
	function deleteSelected() {
		if (selectedIds.size === 0) return;
		if (!confirm(`${selectedIds.size}개 항목을 삭제하시겠습니까?`)) return;
		
		words = words.filter(w => !selectedIds.has(w.id));
		selectedIds = new Set();
		selectionMode = false;
	}

	// 새 항목 추가 모달 상태
	let showAddModal = $state(false);
	let newWord = $state({
		content: '',
		category: 'topic' as WordCategory,
		tags: '',
		createdBy: 'El' as Producer
	});
	let modalCategoryOpen = $state(false);
	let editModalCategoryOpen = $state(false);

	// 연결된 트랙 팝업 상태
	let linkedTracksPopup = $state<{ wordId: string; tracks: string[]; position: { x: number; y: number } } | null>(null);
	
	// 연결된 트랙 정렬 상태: 'default' | 'title' | 'status'
	let linkedTracksSortBy = $state<'default' | 'title' | 'status'>('default');

	// 목업 트랙 데이터 (실제로는 API에서 가져옴)
	const trackData: Record<string, { title: string; status: string }> = {
		'track1': { title: '달콤한 밤', status: '제작 중' },
		'track2': { title: '여름의 끝', status: '완료' },
		'track3': { title: '첫눈이 내리면', status: '아이디어' },
		'track4': { title: '네온 시티', status: '제작 중' },
		'track5': { title: '별빛 아래서', status: '완료' },
		'track6': { title: '새벽 3시', status: '제작 중' },
		'track7': { title: '너의 목소리', status: '완료' },
		'track8': { title: '파도처럼', status: '아이디어' },
		'track9': { title: '봄날의 기억', status: '제작 중' },
		'track10': { title: '밤하늘 수놓은', status: '완료' },
		'track11': { title: '끝없는 여정', status: '아이디어' },
		'track12': { title: '마지막 춤', status: '제작 중' }
	};

	// trackId → SUNO 프로젝트 id 매핑 (연결된 트랙 클릭 시 올바른 프로젝트 상세로 이동)
	const trackIdToProjectId: Record<string, string> = {
		'track1': 'proj1', 'track2': 'proj2', 'track3': 'proj3', 'track4': 'proj1',
		'track5': 'proj2', 'track6': 'proj3', 'track7': 'proj1', 'track8': 'proj2',
		'track9': 'proj3', 'track10': 'proj1', 'track11': 'proj2', 'track12': 'proj3'
	};
	function getProjectIdForTrack(trackId: string): string {
		return trackIdToProjectId[trackId] ?? 'proj1';
	}

	// 상태 우선순위 맵
	const statusOrder: Record<string, number> = {
		'아이디어': 0,
		'제작 중': 1,
		'완료': 2
	};

	// 상태별 색상 클래스 (프로젝트 페이지와 동일)
	function getTrackStatusColor(status: string): string {
		switch (status) {
			case '아이디어': return 'text-yellow-500 dark:text-yellow-400';
			case '제작 중': return 'text-brand-pink';
			case '완료': return 'text-green-600 dark:text-green-400';
			default: return 'text-text-muted';
		}
	}

	// 정렬된 트랙 리스트
	const sortedLinkedTracks = $derived.by(() => {
		if (!linkedTracksPopup) return [];
		const tracks = [...linkedTracksPopup.tracks];
		
		if (linkedTracksSortBy === 'title') {
			return tracks.sort((a, b) => {
				const titleA = trackData[a]?.title || a;
				const titleB = trackData[b]?.title || b;
				return titleA.localeCompare(titleB);
			});
		} else if (linkedTracksSortBy === 'status') {
			return tracks.sort((a, b) => {
				const statusA = statusOrder[trackData[a]?.status] ?? 99;
				const statusB = statusOrder[trackData[b]?.status] ?? 99;
				return statusA - statusB;
			});
		}
		return tracks;
	});

	// 연결된 트랙 팝업 열기 (레이아웃 읽기는 rAF로 미뤄서 Forced reflow 완화)
	function openLinkedTracksPopup(wordId: string, tracks: string[], event: MouseEvent) {
		event.stopPropagation();
		const target = event.currentTarget as HTMLElement;
		requestAnimationFrame(() => {
			const rect = target.getBoundingClientRect();
			const popupWidth = 220;
			let x = rect.right - popupWidth;
			if (x < 8) x = 8;
			linkedTracksPopup = {
				wordId,
				tracks,
				position: { x, y: rect.bottom + 4 }
			};
		});
	}

	// 연결된 트랙 팝업 닫기

	// ========== 워드 수정 기능 ==========
	let showEditModal = $state(false);
	let editingWord = $state<WordEntry | null>(null);
	let editForm = $state({
		content: '',
		category: 'topic' as WordCategory,
		tags: '',
		createdBy: 'El' as Producer
	});

	// 수정 모달 열기
	function openEditModal(word: WordEntry) {
		editingWord = word;
		editForm = {
			content: word.content,
			category: word.category,
			tags: word.tags.join(', '),
			createdBy: word.createdBy
		};
		showEditModal = true;
	}

	// 수정 저장
	function saveEdit() {
		if (!editingWord || !editForm.content.trim()) return;

		const contentTrim = editForm.content.trim();
		const contentLower = contentTrim.toLowerCase();
		const duplicate = words.find(w => w.id !== editingWord!.id && w.content.trim().toLowerCase() === contentLower);
		if (duplicate) {
			alert(`다른 워드에 이미 같은 내용이 있습니다.\n"${duplicate.content}" (${getCategoryName(duplicate.category)})`);
			return;
		}

		words = words.map(w => {
			if (w.id === editingWord!.id) {
				return {
					...w,
					content: contentTrim,
					category: editForm.category,
					tags: parseTagsDedup(editForm.tags),
					createdBy: editForm.createdBy
				};
			}
			return w;
		});

		closeEditModal();
	}

	// 수정 모달 닫기
	function closeEditModal() {
		showEditModal = false;
		editingWord = null;
	}
	function closeLinkedTracksPopup() {
		linkedTracksPopup = null;
	}

	// 필터링 및 정렬된 워드 목록
	const filteredWords = $derived.by(() => {
		let result = words.filter(word => {
			// 즐겨찾기 필터
			if (showFavoritesOnly && !(word.favorite === true)) {
				return false;
			}
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
			// 태그 필터
			if (selectedTag !== 'all' && !word.tags.includes(selectedTag)) {
				return false;
			}
			return true;
		});
		
		// 정렬
		result.sort((a, b) => {
			switch (sortBy) {
				case 'usage_desc':
					return b.usageCount - a.usageCount;
				case 'usage_asc':
					return a.usageCount - b.usageCount;
				case 'created_desc':
					return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
				case 'created_asc':
					return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
				case 'content_asc':
					return a.content.localeCompare(b.content);
				case 'content_desc':
					return b.content.localeCompare(a.content);
				default:
					return 0;
			}
		});
		
		return result;
	});

	// 카테고리별 통계
	const categoryStats = $derived.by(() => {
		const stats: Record<string, number> = { all: words.length };
		WORD_CATEGORIES.forEach(cat => {
			stats[cat.id] = words.filter(w => w.category === cat.id).length;
		});
		return stats;
	});

	// 태그 문자열 → 배열 (중복 제거)
	function parseTagsDedup(tagStr: string): string[] {
		return [...new Set(tagStr.split(',').map(t => t.trim()).filter(t => t))];
	}

	// 새 워드 추가
	function addWord() {
		const contentTrim = newWord.content.trim();
		if (!contentTrim) return;

		const contentLower = contentTrim.toLowerCase();
		const duplicate = words.find(w => w.content.trim().toLowerCase() === contentLower);
		if (duplicate) {
			alert(`이미 같은 내용의 워드가 있습니다.\n"${duplicate.content}" (${getCategoryName(duplicate.category)})`);
			return;
		}

		const id = `word_${Date.now()}`;
		words = [...words, {
			id,
			content: contentTrim,
			category: newWord.category,
			tags: parseTagsDedup(newWord.tags),
			usageCount: 0,
			linkedTracks: [],
			createdAt: new Date().toISOString().split('T')[0],
			createdBy: newWord.createdBy,
			favorite: false
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
		if (!target.closest('.creator-dropdown')) {
			creatorDropdownOpen = false;
		}
		if (!target.closest('.sort-dropdown')) {
			sortDropdownOpen = false;
		}
		if (!target.closest('.tag-dropdown')) {
			tagDropdownOpen = false;
		}
		// 추가 모달 카테고리 드롭다운
		if (!target.closest('.add-modal-category-dropdown')) {
			modalCategoryOpen = false;
		}
		// 수정 모달 카테고리 드롭다운
		if (!target.closest('.edit-modal-category-dropdown')) {
			editModalCategoryOpen = false;
		}
		if (!target.closest('.linked-tracks-popup') && !target.closest('.linked-tracks-btn')) {
			linkedTracksPopup = null;
		}
	}

	$effect(() => {
		if (categoryDropdownOpen || creatorDropdownOpen || sortDropdownOpen || tagDropdownOpen || modalCategoryOpen || editModalCategoryOpen || linkedTracksPopup) {
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
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
			<div>
				<h1 class="text-3xl font-bold text-text-strong mb-2">SUNO 제작</h1>
				<p class="text-text-muted">워드를 수집하고 조합합니다</p>
			</div>
			<div class="flex items-center gap-3 w-full sm:w-auto flex-shrink-0">
				{#key showCombinator}
					<button
						type="button"
						onclick={() => { 
							showCombinator = !showCombinator;
						}}
						class="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-brand-pink text-brand-pink font-medium cursor-pointer transition-colors duration-200 min-w-0 flex-1 sm:flex-initial"
						aria-label="랜덤 조합"
						title="랜덤 조합"
					>
						<Shuffle size={16} class="flex-shrink-0" />
						<span>랜덤 조합</span>
					</button>
				{/key}
				<button
					type="button"
					onclick={() => showAddModal = true}
					class="page-header-action-button inline-flex items-center justify-center gap-2 px-4 py-2 min-w-0 flex-1 sm:flex-initial rounded-lg transition-colors duration-200 font-medium page-header-primary-button bg-brand-pink text-[var(--surface-2)] hover:[&>svg]:!text-[var(--surface-2)] focus:bg-brand-pink focus:text-white focus:[&>svg]:!text-white focus-visible:bg-brand-pink focus-visible:text-white focus-visible:[&>svg]:!text-white focus:outline-none focus:ring-0 flex-shrink-0"
				>
					<Plus size={16} />
					<span>워드 추가</span>
				</button>
			</div>
		</div>
	</div>

	<!-- 탭 + 콘텐츠 -->
	<SUNOTabs>
		<!-- 랜덤 조합 생성기 -->
		{#if showCombinator}
			<div class="mb-6">
				<RandomCombinator {words} onClose={() => showCombinator = false} />
			</div>
		{/if}

		<!-- 필터 영역 -->
		<div class="mb-6 space-y-3">
			<!-- 검색 + 즐겨찾기만 (한 줄, 모바일에서 wrap) -->
			<div class="flex flex-wrap items-center gap-2">
				<div class="relative group flex-1 min-w-[200px]">
					<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<Search size={16} class="lucide-icon lucide-search filter-search-icon" />
					</div>
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="워드 검색..."
						class="filter-search-input w-full pl-10 {searchQuery.trim() ? 'pr-10' : 'pr-4'} py-1.5 bg-surface-2 border border-border-subtle border-[1px] rounded-md text-text-base placeholder:text-text-base placeholder:opacity-100 focus:outline-none focus:border-brand-pink focus:ring-0 transition-colors duration-200"
						aria-label="워드 검색"
						id="word-search"
						autocomplete="off"
					/>
					{#if searchQuery.trim()}
						<button
							type="button"
							onclick={() => {
								searchQuery = '';
								const input = document.getElementById('word-search') as HTMLInputElement;
								input?.focus();
							}}
							class="search-clear-button absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center bg-transparent hover:bg-transparent focus:bg-transparent focus-visible:bg-transparent"
							aria-label="검색 초기화"
						>
							<X size={16} class="lucide-icon" />
						</button>
					{/if}
				</div>
				<button
					type="button"
					onclick={() => showFavoritesOnly = !showFavoritesOnly}
					class="preset-group-btn btn-outline-hover flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm font-medium transition-colors flex-shrink-0 {showFavoritesOnly ? 'active border-brand-pink text-brand-pink' : 'border-border-subtle text-text-muted'}"
					aria-pressed={showFavoritesOnly}
					aria-label="즐겨찾기만 보기"
				>
					<Star size={14} class="flex-shrink-0 {showFavoritesOnly ? 'fill-current' : ''}" />
					즐겨찾기만 ({words.filter(w => w.favorite === true).length})
				</button>
			</div>

			<!-- 필터/정렬 (2x2 그리드) -->
			<div class="grid grid-cols-2 gap-3">
				<!-- 카테고리 필터 -->
				<div class="relative category-dropdown">
					<button
						type="button"
						onclick={() => categoryDropdownOpen = !categoryDropdownOpen}
						aria-haspopup="listbox"
						aria-expanded={categoryDropdownOpen}
						class="status-filter-btn flex items-center pl-10 pr-8 py-1.5 w-full bg-surface-2 rounded-[6px] text-text-base transition-all duration-200 cursor-pointer border border-border-subtle focus:outline-none focus:border-brand-pink"
					>
						<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Filter size={16} class="lucide-icon filter-control-icon transition-colors duration-200" />
						</div>
						<span class="flex-1 text-left truncate">
							{selectedCategory === 'all' ? '전체' : getCategoryName(selectedCategory)} ({categoryStats[selectedCategory] || 0})
						</span>
						<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
							<ChevronDown size={12} class="text-text-base transition-colors duration-200" />
						</div>
					</button>
					{#if categoryDropdownOpen}
						<ul class="absolute left-0 w-full mt-[6px] bg-surface-2 border border-border-subtle rounded-[6px] z-10 max-h-60 overflow-y-auto custom-list-scrollbar">
							<li
								role="option"
								aria-selected={selectedCategory === 'all'}
								tabindex="0"
								onclick={() => { selectedCategory = 'all'; categoryDropdownOpen = false; }}
								onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { selectedCategory = 'all'; categoryDropdownOpen = false; } }}
								class="dropdown-item px-4 py-2 text-sm cursor-pointer transition-colors {selectedCategory === 'all' ? 'bg-brand-pink text-white' : 'text-text-base'}"
							>
								전체 ({categoryStats['all'] || 0})
							</li>
							{#each WORD_CATEGORIES as cat}
								<li
									role="option"
									aria-selected={selectedCategory === cat.id}
									tabindex="0"
									onclick={() => { selectedCategory = cat.id; categoryDropdownOpen = false; }}
									onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { selectedCategory = cat.id; categoryDropdownOpen = false; } }}
									class="dropdown-item px-4 py-2 text-sm cursor-pointer transition-colors {selectedCategory === cat.id ? 'bg-brand-pink text-white' : 'text-text-base'}"
								>
									{cat.name} ({categoryStats[cat.id] || 0})
								</li>
							{/each}
						</ul>
					{/if}
				</div>

				<!-- 담당자 필터 -->
				<div class="relative creator-dropdown">
					<button
						type="button"
						onclick={() => creatorDropdownOpen = !creatorDropdownOpen}
						aria-haspopup="listbox"
						aria-expanded={creatorDropdownOpen}
						class="status-filter-btn flex items-center pl-10 pr-8 py-1.5 w-full bg-surface-2 rounded-[6px] text-text-base transition-all duration-200 cursor-pointer border border-border-subtle focus:outline-none focus:border-brand-pink"
					>
						<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<UserRound size={16} class="lucide-icon filter-control-icon transition-colors duration-200" />
						</div>
						<span class="flex-1 text-left truncate">
							{creatorLabels[selectedCreator]}
						</span>
						<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
							<ChevronDown size={12} class="text-text-base transition-colors duration-200" />
						</div>
					</button>
					{#if creatorDropdownOpen}
						<ul class="absolute left-0 w-full mt-[6px] bg-surface-2 border border-border-subtle rounded-[6px] z-10 overflow-hidden">
							{#each Object.entries(creatorLabels) as [value, label]}
								<li
									role="option"
									aria-selected={selectedCreator === value}
									tabindex="0"
									onclick={() => { selectedCreator = value as Producer | 'all'; creatorDropdownOpen = false; }}
									onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { selectedCreator = value as Producer | 'all'; creatorDropdownOpen = false; } }}
									class="dropdown-item px-4 py-2 text-sm cursor-pointer transition-colors {selectedCreator === value ? 'bg-brand-pink text-white' : 'text-text-base'}"
								>
									{label}
								</li>
							{/each}
						</ul>
					{/if}
				</div>

				<!-- 태그 필터 -->
				<div class="relative tag-dropdown">
					<button
						type="button"
						onclick={() => tagDropdownOpen = !tagDropdownOpen}
						aria-haspopup="listbox"
						aria-expanded={tagDropdownOpen}
						class="status-filter-btn flex items-center pl-10 pr-8 py-1.5 w-full bg-surface-2 rounded-[6px] text-text-base transition-all duration-200 cursor-pointer border border-border-subtle focus:outline-none focus:border-brand-pink"
					>
						<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Tag size={16} class="lucide-icon filter-control-icon transition-colors duration-200" />
						</div>
						<span class="flex-1 text-left truncate">
							{selectedTag === 'all' ? '전체 태그' : selectedTag}
						</span>
						<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
							<ChevronDown size={12} class="text-text-base transition-colors duration-200" />
						</div>
					</button>
					{#if tagDropdownOpen}
						<ul class="absolute left-0 w-full mt-[6px] bg-surface-2 border border-border-subtle rounded-[6px] z-10 overflow-hidden max-h-[200px] overflow-y-auto custom-list-scrollbar">
							<li
								role="option"
								aria-selected={selectedTag === 'all'}
								tabindex="0"
								onclick={() => { selectedTag = 'all'; tagDropdownOpen = false; }}
								onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { selectedTag = 'all'; tagDropdownOpen = false; } }}
								class="dropdown-item px-4 py-2 text-sm cursor-pointer transition-colors {selectedTag === 'all' ? 'bg-brand-pink text-white' : 'text-text-base'}"
							>
								전체 태그
							</li>
							{#each allTags as tag}
								<li
									role="option"
									aria-selected={selectedTag === tag}
									tabindex="0"
									onclick={() => { selectedTag = tag; tagDropdownOpen = false; }}
									onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { selectedTag = tag; tagDropdownOpen = false; } }}
									class="dropdown-item px-4 py-2 text-sm cursor-pointer transition-colors {selectedTag === tag ? 'bg-brand-pink text-white' : 'text-text-base'}"
								>
									{tag}
								</li>
							{/each}
						</ul>
					{/if}
				</div>

				<!-- 정렬 -->
				<div class="relative sort-dropdown">
					<button
						type="button"
						onclick={() => sortDropdownOpen = !sortDropdownOpen}
						aria-haspopup="listbox"
						aria-expanded={sortDropdownOpen}
						class="status-filter-btn flex items-center pl-10 pr-8 py-1.5 w-full bg-surface-2 rounded-[6px] text-text-base transition-all duration-200 cursor-pointer border border-border-subtle focus:outline-none focus:border-brand-pink"
					>
						<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<ArrowUpDown size={16} class="lucide-icon filter-control-icon transition-colors duration-200" />
						</div>
						<span class="flex-1 text-left truncate">
							{sortLabels[sortBy]}
						</span>
						<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
							<ChevronDown size={12} class="text-text-base transition-colors duration-200" />
						</div>
					</button>
					{#if sortDropdownOpen}
						<ul class="absolute left-0 w-full mt-[6px] bg-surface-2 border border-border-subtle rounded-[6px] z-10 overflow-hidden">
							{#each Object.entries(sortLabels) as [value, label]}
								<li
									role="option"
									aria-selected={sortBy === value}
									tabindex="0"
									onclick={() => { sortBy = value as SortOption; sortDropdownOpen = false; }}
									onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { sortBy = value as SortOption; sortDropdownOpen = false; } }}
									class="dropdown-item px-4 py-2 text-sm cursor-pointer transition-colors {sortBy === value ? 'bg-brand-pink text-white' : 'text-text-base'}"
								>
									{label}
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			</div>
		</div>

		<!-- 선택 모드 툴바 -->
		<div class="flex flex-wrap items-center justify-between gap-2 mb-3 min-w-0">
			<button
				type="button"
				onclick={toggleSelectionMode}
				class="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors shrink-0 {selectionMode ? 'text-brand-pink' : 'text-text-muted hover:text-hover-point'}"
			>
				{#if selectionMode}
					<CheckSquare size={14} />
					선택 모드 끄기
				{:else}
					<Square size={14} />
					선택 모드
				{/if}
			</button>
			
			{#if selectionMode}
				<div class="flex flex-wrap items-center gap-2 min-w-0">
					<span class="text-sm text-text-muted shrink-0">
						<span class="text-brand-pink font-medium">{selectedIds.size}</span>개 선택됨
					</span>
					<button
						type="button"
						onclick={selectAll}
						class="btn-outline-hover px-3 py-1.5 text-sm rounded-md border border-border-subtle text-text-muted shrink-0"
					>
						전체 선택
					</button>
					<button
						type="button"
						onclick={deselectAll}
						class="btn-outline-hover px-3 py-1.5 text-sm rounded-md border border-border-subtle text-text-muted shrink-0"
					>
						전체 해제
					</button>
					<button
						type="button"
						onclick={deleteSelected}
						disabled={selectedIds.size === 0}
						class="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md bg-red-500/20 text-red-400 border border-red-500/50 transition-colors hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
					>
						<Trash2 size={14} />
						삭제
					</button>
				</div>
			{/if}
		</div>

		<!-- 테이블 (넓은 화면) / 카드 (좁은 화면·개발자도구 등) - 가로 스크롤 없음 -->
		<div class="bg-surface-2 rounded-lg border border-border-subtle overflow-hidden">
			<!-- 데스크톱 테이블: lg(1024px) 이상에서만 표시 -->
			<div class="hidden lg:block overflow-hidden">
				<table class="w-full min-w-[640px]" style="border-collapse: collapse;">
					<thead class="bg-surface-2 text-xs text-text-muted pointer-events-none" style="border-bottom: 1px solid var(--border-subtle);">
						<tr>
							{#if selectionMode}
								<th class="px-4 py-3 w-10"></th>
							{/if}
							<th class="px-4 py-3 text-left font-medium">내용</th>
							<th class="px-4 py-3 text-left font-medium whitespace-nowrap">카테고리</th>
							<th class="px-4 py-3 text-left font-medium">태그</th>
							<th class="px-4 py-3 text-center font-medium whitespace-nowrap">사용</th>
							<th class="px-4 py-3 text-center font-medium whitespace-nowrap">제작자</th>
							<th class="px-4 py-3 text-center font-medium">액션</th>
						</tr>
					</thead>
					<tbody>
						{#each filteredWords as word, i}
							{@const showBorder = i < filteredWords.length - 1}
							<tr class="word-row group {selectionMode && selectedIds.has(word.id) ? 'bg-brand-pink/10' : ''}">
								{#if selectionMode}
									<td class="px-4 py-3 w-10 group-hover:bg-surface-1/50 transition-colors" style={showBorder ? 'border-bottom: 1px solid var(--border-subtle);' : ''}>
										<button
											type="button"
											onclick={() => toggleSelection(word.id)}
											class="flex items-center justify-center bg-transparent hover:bg-transparent focus:bg-transparent border-0 rounded"
										>
											{#if selectedIds.has(word.id)}
												<CheckSquare size={18} class="text-brand-pink" />
											{:else}
												<Square size={18} class="text-text-muted hover:text-hover-point transition-colors" />
											{/if}
										</button>
									</td>
								{/if}
								<td class="px-4 py-3 text-sm text-text-base group-hover:bg-surface-1/50 transition-colors" style={showBorder ? 'border-bottom: 1px solid var(--border-subtle);' : ''}>{word.content}</td>
								<td class="px-4 py-3 group-hover:bg-surface-1/50 transition-colors" style={showBorder ? 'border-bottom: 1px solid var(--border-subtle);' : ''}>
									<span class="word-category-pill inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-surface-1 border border-border-subtle whitespace-nowrap focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 {getCategoryById(word.category)?.color ?? 'text-text-muted'}" tabindex="-1">
										{getCategoryName(word.category)}
									</span>
								</td>
								<td class="px-4 py-3 group-hover:bg-surface-1/50 transition-colors" style={showBorder ? 'border-bottom: 1px solid var(--border-subtle);' : ''}>
									<div class="flex flex-wrap gap-1.5">
										{#each word.tags.slice(0, 2) as tag}
											<span class="word-tag-pill px-1.5 py-0.5 rounded-md text-xs border border-border-subtle text-text-muted bg-transparent">#{tag}</span>
										{/each}
										{#if word.tags.length > 2}
											<span class="text-xs text-text-muted">+{word.tags.length - 2}</span>
										{/if}
									</div>
								</td>
								<td class="px-4 py-3 text-center whitespace-nowrap group-hover:bg-surface-1/50 transition-colors" style={showBorder ? 'border-bottom: 1px solid var(--border-subtle);' : ''}>
									<span class="text-sm text-text-muted">{word.usageCount}</span>
									{#if word.linkedTracks.length > 0}
										<button
											type="button"
											class="linked-tracks-btn inline-flex items-center ml-1 text-text-muted hover:text-hover-point transition-colors"
											onclick={(e) => openLinkedTracksPopup(word.id, word.linkedTracks, e)}
											aria-label="연결된 트랙 보기"
											title="{word.linkedTracks.length}개 트랙에서 사용"
										>
											<Link size={12} />
										</button>
									{/if}
								</td>
								<td class="px-4 py-3 text-center group-hover:bg-surface-1/50 transition-colors" style={showBorder ? 'border-bottom: 1px solid var(--border-subtle);' : ''}>
									<span class="text-sm font-medium {word.createdBy === 'El' ? 'text-elotte-green' : 'text-elotte-orange'}">
										{word.createdBy}
									</span>
								</td>
								<td class="px-4 py-3 group-hover:bg-surface-1/50 transition-colors" style={showBorder ? 'border-bottom: 1px solid var(--border-subtle);' : ''}>
									<div class="flex items-center justify-center gap-1">
										<button
											type="button"
											class="btn-icon {word.favorite === true ? 'text-brand-pink' : 'text-text-muted'}"
											onclick={() => toggleWordFavorite(word.id)}
											aria-label={word.favorite === true ? '즐겨찾기 해제' : '즐겨찾기 추가'}
											title={word.favorite === true ? '즐겨찾기 해제' : '즐겨찾기 추가'}
										>
											<Star size={14} class={word.favorite === true ? 'fill-current' : ''} />
										</button>
										<button
											type="button"
											class="btn-icon {copiedWordId === word.id ? 'text-brand-pink' : ''}"
											onclick={() => copyWordContent(word)}
											aria-label="복사"
											title="복사"
										>
											<Copy size={14} />
										</button>
										<button
											type="button"
											class="btn-icon"
											onclick={() => openEditModal(word)}
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
								<td colspan={selectionMode ? 7 : 6} class="px-4 py-12 text-center">
									{#if searchQuery || selectedCategory !== 'all' || selectedCreator !== 'all' || selectedTag !== 'all' || showFavoritesOnly}
										<div class="inline-flex items-center justify-center mb-4">
											<SearchX size={28} class="text-text-muted" />
										</div>
										<p class="text-text-base font-medium mb-2">
											{showFavoritesOnly && !searchQuery && selectedCategory === 'all' && selectedCreator === 'all' && selectedTag === 'all'
												? '즐겨찾기한 워드가 없습니다'
												: '검색 결과가 없습니다'}
										</p>
										<p class="text-text-muted text-sm mb-4">
											{showFavoritesOnly && !searchQuery && selectedCategory === 'all' && selectedCreator === 'all' && selectedTag === 'all'
												? '목록에서 별을 눌러 즐겨찾기에 추가하세요'
												: '다른 검색어나 필터를 시도해보세요'}
										</p>
										<button
											type="button"
											onclick={() => { searchQuery = ''; selectedCategory = 'all'; selectedCreator = 'all'; selectedTag = 'all'; showFavoritesOnly = false; }}
											class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-pink border border-brand-pink rounded-lg hover:bg-brand-pink hover:text-white transition-colors"
										>
											<X size={14} />
											필터 초기화
										</button>
									{:else}
										<div class="inline-flex items-center justify-center mb-4">
											<BookOpen size={28} class="text-text-muted" />
										</div>
										<p class="text-text-base font-medium mb-2">등록된 워드가 없습니다</p>
										<p class="text-text-muted text-sm mb-4">첫 번째 워드를 추가해보세요</p>
										<button
											type="button"
											onclick={() => showAddModal = true}
											class="page-header-action-button inline-flex items-center justify-center gap-2 px-4 py-2 w-full sm:w-auto rounded-lg transition-colors duration-200 font-medium page-header-primary-button bg-brand-pink text-[var(--surface-2)] hover:[&>svg]:!text-[var(--surface-2)] focus:bg-brand-pink focus:text-white focus:[&>svg]:!text-white focus-visible:bg-brand-pink focus-visible:text-white focus-visible:[&>svg]:!text-white focus:outline-none focus:ring-0"
										>
											<Plus size={16} />
											워드 추가하기
										</button>
									{/if}
								</td>
							</tr>
						{/if}
					</tbody>
				</table>
			</div>

			<!-- 카드 레이아웃: lg 미만(태블릿·개발자도구 등 좁은 뷰포트) -->
			<div class="lg:hidden">
				{#each filteredWords as word, i}
					<div class="p-4 min-w-0 {i > 0 ? 'border-t border-border-subtle' : ''} {selectionMode && selectedIds.has(word.id) ? 'bg-brand-pink/10' : ''}">
						<div class="flex items-start justify-between gap-3 mb-2 min-w-0">
							{#if selectionMode}
								<button
									type="button"
									onclick={() => toggleSelection(word.id)}
									class="flex-shrink-0 flex items-center justify-center mt-0.5 w-9 h-9 bg-transparent hover:bg-transparent focus:bg-transparent border-0 rounded"
								>
									{#if selectedIds.has(word.id)}
										<CheckSquare size={18} class="text-brand-pink" />
									{:else}
										<Square size={18} class="text-text-muted" />
									{/if}
								</button>
							{/if}
							<div class="flex-1 min-w-0">
								<p class="text-sm font-medium text-text-base">{word.content}</p>
								<div class="flex items-center gap-2 mt-1">
									<span class="word-category-pill px-2 py-0.5 rounded-md text-xs font-medium bg-surface-1 border border-border-subtle focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 {getCategoryById(word.category)?.color ?? 'text-text-muted'}" tabindex="-1">
										{getCategoryName(word.category)}
									</span>
									<span class="text-xs font-medium {word.createdBy === 'El' ? 'text-elotte-green' : 'text-elotte-orange'}">
										{word.createdBy}
									</span>
								</div>
							</div>
							<div class="flex items-center gap-1 flex-shrink-0">
								<button
									type="button"
									class="btn-icon {word.favorite === true ? 'text-brand-pink' : 'text-text-muted'}"
									onclick={() => toggleWordFavorite(word.id)}
									aria-label={word.favorite === true ? '즐겨찾기 해제' : '즐겨찾기 추가'}
								>
									<Star size={14} class={word.favorite === true ? 'fill-current' : ''} />
								</button>
								<button
									type="button"
									class="btn-icon {copiedWordId === word.id ? 'text-brand-pink' : ''}"
									onclick={() => copyWordContent(word)}
									aria-label="복사"
									title="복사"
								>
									<Copy size={14} />
								</button>
								<button type="button" class="btn-icon" onclick={() => openEditModal(word)} aria-label="수정">
									<Edit2 size={14} />
								</button>
								<button type="button" class="btn-icon text-red-400" onclick={() => deleteWord(word.id)} aria-label="삭제">
									<Trash2 size={14} />
								</button>
							</div>
						</div>
						<div class="flex items-center justify-between text-xs text-text-muted {selectionMode ? 'pl-12' : ''}">
							<div class="flex flex-wrap gap-1.5 items-center">
								{#each word.tags.slice(0, 2) as tag}
									<span class="word-tag-pill px-1.5 py-0.5 rounded-md border border-border-subtle text-text-muted bg-transparent">#{tag}</span>
								{/each}
								{#if word.tags.length > 2}
									<span class="text-text-muted">+{word.tags.length - 2}</span>
								{/if}
							</div>
							<div class="flex items-center gap-1 flex-shrink-0">
								<span>{word.usageCount}회</span>
								{#if word.linkedTracks.length > 0}
									<button
										type="button"
										class="linked-tracks-btn text-text-muted hover:text-hover-point transition-colors"
										onclick={(e) => openLinkedTracksPopup(word.id, word.linkedTracks, e)}
										aria-label="연결된 트랙 보기"
									>
										<Link size={12} />
									</button>
								{/if}
							</div>
						</div>
					</div>
				{/each}
				{#if filteredWords.length === 0}
					<div class="px-4 py-12 text-center">
						{#if searchQuery || selectedCategory !== 'all' || selectedCreator !== 'all' || selectedTag !== 'all' || showFavoritesOnly}
							<div class="inline-flex items-center justify-center mb-4">
								<SearchX size={28} class="text-text-muted" />
							</div>
							<p class="text-text-base font-medium mb-2">
								{showFavoritesOnly && !searchQuery && selectedCategory === 'all' && selectedCreator === 'all' && selectedTag === 'all'
									? '즐겨찾기한 워드가 없습니다'
									: '검색 결과가 없습니다'}
							</p>
							{#if showFavoritesOnly && !searchQuery && selectedCategory === 'all' && selectedCreator === 'all' && selectedTag === 'all'}
								<p class="text-text-muted text-sm mb-4">목록에서 별을 눌러 즐겨찾기에 추가하세요</p>
							{:else}
								<p class="text-text-muted text-sm mb-4">다른 검색어나 필터를 시도해보세요</p>
							{/if}
							<button
								type="button"
								onclick={() => { searchQuery = ''; selectedCategory = 'all'; selectedCreator = 'all'; selectedTag = 'all'; showFavoritesOnly = false; }}
								class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-pink border border-brand-pink rounded-lg hover:bg-brand-pink hover:text-white transition-colors"
							>
								<X size={14} />
								필터 초기화
							</button>
						{:else}
							<div class="inline-flex items-center justify-center mb-4">
								<BookOpen size={28} class="text-text-muted" />
							</div>
							<p class="text-text-base font-medium mb-2">등록된 워드가 없습니다</p>
						<button
							type="button"
							onclick={() => showAddModal = true}
							class="page-header-action-button inline-flex items-center justify-center gap-2 px-4 py-2 w-full sm:w-auto rounded-lg transition-colors duration-200 font-medium page-header-primary-button bg-brand-pink text-[var(--surface-2)] hover:[&>svg]:!text-[var(--surface-2)] focus:bg-brand-pink focus:text-white focus:[&>svg]:!text-white focus-visible:bg-brand-pink focus-visible:text-white focus-visible:[&>svg]:!text-white focus:outline-none focus:ring-0"
						>
							<Plus size={16} />
							워드 추가하기
						</button>
						{/if}
					</div>
				{/if}
			</div>
		</div>

		<!-- 통계 -->
		<div class="mt-6">
			<div class="flex flex-wrap items-center gap-4 text-sm">
				<span class="text-text-muted">
					총 <span class="font-medium text-text-base">{words.length}</span>개 워드
				</span>
				<span class="text-border-subtle">|</span>
				<span class="text-text-muted">
					표시 중 <span class="font-medium text-text-base">{filteredWords.length}</span>개
				</span>
			</div>
		</div>
	</SUNOTabs>
</div>

<!-- 연결된 트랙 팝업 -->
{#if linkedTracksPopup}
	<div
		class="linked-tracks-popup fixed z-[90] bg-surface-1 border border-border-subtle rounded-lg min-w-[220px] max-w-[280px]"
		style="left: {linkedTracksPopup.position.x}px; top: {linkedTracksPopup.position.y}px;"
	>
		<div class="px-3 py-2.5 border-b border-border-subtle flex items-center gap-3">
			<div class="flex items-center gap-2 flex-shrink-0">
				<span class="text-sm font-medium text-text-strong">연결된 트랙</span>
				<span class="text-xs text-text-muted">{linkedTracksPopup.tracks.length}곡</span>
			</div>
			<div class="flex items-center gap-1 ml-auto">
				<!-- 정렬 버튼들 -->
				<button
					type="button"
					onclick={() => linkedTracksSortBy = 'default'}
					class="btn-icon w-6 h-6 {linkedTracksSortBy === 'default' ? 'text-brand-pink' : ''}"
					aria-label="기본순"
					title="기본순"
				>
					<RotateCcw size={14} />
				</button>
				<button
					type="button"
					onclick={() => linkedTracksSortBy = 'title'}
					class="btn-icon w-6 h-6 {linkedTracksSortBy === 'title' ? 'text-brand-pink' : ''}"
					aria-label="제목순"
					title="제목순"
				>
					<ArrowDownAZ size={14} />
				</button>
				<button
					type="button"
					onclick={() => linkedTracksSortBy = 'status'}
					class="btn-icon w-6 h-6 {linkedTracksSortBy === 'status' ? 'text-brand-pink' : ''}"
					aria-label="상태순"
					title="상태순"
				>
					<ListOrdered size={14} />
				</button>
				<!-- 닫기 버튼 -->
				<button
					type="button"
					onclick={closeLinkedTracksPopup}
					class="btn-icon w-6 h-6"
					aria-label="닫기"
				>
					<X size={14} />
				</button>
			</div>
		</div>
		<div class="p-2 max-h-[190px] overflow-y-auto custom-list-scrollbar">
			{#each sortedLinkedTracks as trackId}
				{@const track = trackData[trackId]}
				{#if track}
					<a
						href="/suno/projects/{getProjectIdForTrack(trackId)}"
						class="linked-track-item flex items-center justify-between px-3 py-2 rounded-md border border-transparent transition-colors"
					>
						<span class="text-sm text-text-base">{track.title}</span>
						<span class="text-xs font-medium {getTrackStatusColor(track.status)}">{track.status}</span>
					</a>
				{:else}
					<div class="flex items-center px-3 py-2 text-sm text-text-muted">
						{trackId}
					</div>
				{/if}
			{/each}
		</div>
	</div>
{/if}

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
		<!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
		<div
			class="bg-surface-1 rounded-lg border border-border-subtle w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			role="presentation"
		>
			<div class="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
				<h2 class="text-lg font-semibold text-text-strong">새 워드 추가</h2>
				<button
					type="button"
					onclick={() => showAddModal = false}
					class="template-close-btn w-8 h-8 flex items-center justify-end rounded-md text-text-muted transition-colors border border-transparent pl-2 pr-0"
					aria-label="닫기"
				>
					<X size={20} />
				</button>
			</div>

			<form onsubmit={(e) => { e.preventDefault(); addWord(); }} class="flex flex-1 min-h-0 flex-col">
				<div class="p-6 space-y-4 overflow-y-auto custom-list-scrollbar modal-scroll-body flex-1 min-h-0">
				<!-- 내용 -->
				<div>
					<label for="word-content" class="block text-sm font-medium text-text-strong mb-2">
						내용
					</label>
					<input
						type="text"
						id="word-content"
						bind:value={newWord.content}
						class="w-full py-1.5 px-4 bg-surface-2 border border-border-subtle rounded-md text-text-base focus:outline-none focus:border-brand-pink transition-colors"
						placeholder="단어 또는 문구를 입력하세요"
						required
					/>
				</div>

				<!-- 카테고리 -->
				<div class="relative add-modal-category-dropdown">
					<span class="block text-sm font-medium text-text-strong mb-2">카테고리</span>
					<button
						type="button"
						onclick={() => modalCategoryOpen = !modalCategoryOpen}
						class="modal-category-btn input-select-trigger w-full rounded-md transition-colors {modalCategoryOpen ? 'border-brand-pink' : ''}"
					>
						<span class="pr-6">{getCategoryName(newWord.category)}</span>
						<ChevronDown size={14} class="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition-transform {modalCategoryOpen ? 'rotate-180' : ''}" />
					</button>
					{#if modalCategoryOpen}
						<ul role="listbox" class="absolute left-0 right-0 mt-1 bg-surface-2 border border-border-subtle rounded-md z-20 max-h-48 overflow-y-auto custom-list-scrollbar">
							{#each WORD_CATEGORIES as cat}
								<li
									role="option"
									aria-selected={newWord.category === cat.id}
									tabindex="0"
									onclick={() => { newWord.category = cat.id; modalCategoryOpen = false; }}
									onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { newWord.category = cat.id; modalCategoryOpen = false; } }}
									class="dropdown-item px-4 py-2 text-sm cursor-pointer transition-colors {newWord.category === cat.id ? 'bg-brand-pink text-white' : 'text-text-base'}"
								>
									{cat.name}
								</li>
							{/each}
						</ul>
					{/if}
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
						class="w-full py-1.5 px-4 bg-surface-2 border border-border-subtle rounded-md text-text-base focus:outline-none focus:border-brand-pink transition-colors"
						placeholder="tag1, tag2, tag3"
					/>
				</div>

				<!-- 제작자 -->
				<div>
					<span id="creator-label" class="block text-sm font-medium text-text-strong mb-2">제작자</span>
					<div class="flex gap-4" role="group" aria-labelledby="creator-label">
						<label class="flex items-center gap-2 cursor-pointer group">
							<input
								type="radio"
								name="creator"
								value="El"
								checked={newWord.createdBy === 'El'}
								onchange={() => newWord.createdBy = 'El'}
								class="w-4 h-4 rounded-full appearance-none bg-transparent border border-[color:var(--text-base)] checked:bg-transparent checked:border-[color:var(--elotte-green)] hover:border-[color:var(--hover-point)] focus:outline-none focus-visible:border-[color:var(--brand-pink)] transition-all duration-200 cursor-pointer relative"
							/>
							<span class="text-sm font-medium text-text-base transition-colors group-hover:text-elotte-green {newWord.createdBy === 'El' ? 'text-elotte-green' : ''}">El</span>
						</label>
						<label class="flex items-center gap-2 cursor-pointer group">
							<input
								type="radio"
								name="creator"
								value="Otte"
								checked={newWord.createdBy === 'Otte'}
								onchange={() => newWord.createdBy = 'Otte'}
								class="w-4 h-4 rounded-full appearance-none bg-transparent border border-[color:var(--text-base)] checked:bg-transparent checked:border-[color:var(--elotte-orange)] hover:border-[color:var(--hover-point)] focus:outline-none focus-visible:border-[color:var(--brand-pink)] transition-all duration-200 cursor-pointer relative"
							/>
							<span class="text-sm font-medium text-text-base transition-colors group-hover:text-elotte-orange {newWord.createdBy === 'Otte' ? 'text-elotte-orange' : ''}">Otte</span>
						</label>
					</div>
				</div>

				</div>
				<!-- 버튼 -->
				<div class="px-6 py-4 border-t border-border-subtle flex justify-end gap-3 flex-shrink-0">
					<button
						type="button"
						onclick={() => showAddModal = false}
						class="cancel-button px-6 py-2 bg-surface-2 text-text-base rounded-lg border border-border-subtle transition-colors font-medium"
					>
						취소
					</button>
					<button
						type="submit"
						class="px-6 py-2 bg-brand-pink text-white rounded-lg transition-colors font-medium hover:bg-brand-pink/90"
					>
						추가
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- 워드 수정 모달 -->
{#if showEditModal && editingWord}
	<div
		class="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
		onclick={closeEditModal}
		onkeydown={(e) => { if (e.key === 'Escape') closeEditModal(); }}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
		<div
			class="bg-surface-1 rounded-lg border border-border-subtle w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			role="presentation"
		>
			<div class="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
				<h2 class="text-lg font-semibold text-text-strong">워드 수정</h2>
				<button
					type="button"
					onclick={closeEditModal}
					class="template-close-btn w-8 h-8 flex items-center justify-end rounded-md text-text-muted transition-colors border border-transparent pl-2 pr-0"
					aria-label="닫기"
				>
					<X size={20} />
				</button>
			</div>

			<form onsubmit={(e) => { e.preventDefault(); saveEdit(); }} class="flex flex-1 min-h-0 flex-col">
				<div class="p-6 space-y-4 overflow-y-auto custom-list-scrollbar modal-scroll-body flex-1 min-h-0">
				<!-- 내용 -->
				<div>
					<label for="edit-word-content" class="block text-sm font-medium text-text-strong mb-2">
						내용
					</label>
					<input
						type="text"
						id="edit-word-content"
						bind:value={editForm.content}
						class="w-full py-1.5 px-4 bg-surface-2 border border-border-subtle rounded-md text-text-base focus:outline-none focus:border-brand-pink transition-colors"
						placeholder="단어 또는 문구를 입력하세요"
						required
					/>
				</div>

				<!-- 카테고리 -->
				<div class="relative edit-modal-category-dropdown">
					<span class="block text-sm font-medium text-text-strong mb-2">카테고리</span>
					<button
						type="button"
						onclick={() => editModalCategoryOpen = !editModalCategoryOpen}
						class="modal-category-btn input-select-trigger w-full rounded-md transition-colors {editModalCategoryOpen ? 'border-brand-pink' : ''}"
					>
						<span class="pr-6">{getCategoryName(editForm.category)}</span>
						<ChevronDown size={14} class="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition-transform {editModalCategoryOpen ? 'rotate-180' : ''}" />
					</button>
					{#if editModalCategoryOpen}
						<ul role="listbox" class="absolute left-0 right-0 mt-1 bg-surface-2 border border-border-subtle rounded-md z-20 max-h-48 overflow-y-auto custom-list-scrollbar">
							{#each WORD_CATEGORIES as cat}
								<li
									role="option"
									aria-selected={editForm.category === cat.id}
									tabindex="0"
									onclick={() => { editForm.category = cat.id; editModalCategoryOpen = false; }}
									onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { editForm.category = cat.id; editModalCategoryOpen = false; } }}
									class="dropdown-item px-4 py-2 text-sm cursor-pointer transition-colors {editForm.category === cat.id ? 'bg-brand-pink text-white' : 'text-text-base'}"
								>
									{cat.name}
								</li>
							{/each}
						</ul>
					{/if}
				</div>

				<!-- 태그 -->
				<div>
					<label for="edit-word-tags" class="block text-sm font-medium text-text-strong mb-2">
						태그 (쉼표로 구분)
					</label>
					<input
						type="text"
						id="edit-word-tags"
						bind:value={editForm.tags}
						class="w-full py-1.5 px-4 bg-surface-2 border border-border-subtle rounded-md text-text-base focus:outline-none focus:border-brand-pink transition-colors"
						placeholder="tag1, tag2, tag3"
					/>
				</div>

				<!-- 제작자 -->
				<div>
					<span id="edit-creator-label" class="block text-sm font-medium text-text-strong mb-2">제작자</span>
					<div class="flex gap-4" role="group" aria-labelledby="edit-creator-label">
						<label class="flex items-center gap-2 cursor-pointer group">
							<input
								type="radio"
								name="edit-creator"
								value="El"
								checked={editForm.createdBy === 'El'}
								onchange={() => editForm.createdBy = 'El'}
								class="w-4 h-4 rounded-full appearance-none bg-transparent border border-[color:var(--text-base)] checked:bg-transparent checked:border-[color:var(--elotte-green)] hover:border-[color:var(--hover-point)] focus:outline-none focus-visible:border-[color:var(--brand-pink)] transition-all duration-200 cursor-pointer relative"
							/>
							<span class="text-sm font-medium text-text-base transition-colors group-hover:text-elotte-green {editForm.createdBy === 'El' ? 'text-elotte-green' : ''}">El</span>
						</label>
						<label class="flex items-center gap-2 cursor-pointer group">
							<input
								type="radio"
								name="edit-creator"
								value="Otte"
								checked={editForm.createdBy === 'Otte'}
								onchange={() => editForm.createdBy = 'Otte'}
								class="w-4 h-4 rounded-full appearance-none bg-transparent border border-[color:var(--text-base)] checked:bg-transparent checked:border-[color:var(--elotte-orange)] hover:border-[color:var(--hover-point)] focus:outline-none focus-visible:border-[color:var(--brand-pink)] transition-all duration-200 cursor-pointer relative"
							/>
							<span class="text-sm font-medium text-text-base transition-colors group-hover:text-elotte-orange {editForm.createdBy === 'Otte' ? 'text-elotte-orange' : ''}">Otte</span>
						</label>
					</div>
				</div>

				<!-- 사용 정보 (읽기 전용) -->
				<div class="pt-2 border-t border-border-subtle">
					<div class="flex items-center justify-between text-xs text-text-muted">
						<span>사용 횟수: {editingWord.usageCount}회</span>
						<span>연결 트랙: {editingWord.linkedTracks.length}개</span>
						<span>생성일: {editingWord.createdAt}</span>
					</div>
				</div>

				</div>
				<!-- 버튼 -->
				<div class="px-6 py-4 border-t border-border-subtle flex justify-end gap-3 flex-shrink-0">
					<button
						type="button"
						onclick={closeEditModal}
						class="cancel-button px-6 py-2 bg-surface-2 text-text-base rounded-lg border border-border-subtle transition-colors font-medium"
					>
						취소
					</button>
					<button
						type="submit"
						class="px-6 py-2 bg-brand-pink text-white rounded-lg transition-colors font-medium hover:bg-brand-pink/90"
					>
						저장
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
