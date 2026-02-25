<script lang="ts">
	import { Plus, Search, Copy, Check, Trash2, Edit2, ChevronDown, X, Filter, ArrowUpDown, UserRound, FileText, SearchX, Languages, SpellCheck, ExternalLink, Maximize2 } from 'lucide-svelte';
	import SUNOTabs from '$lib/components/suno/SUNOTabs.svelte';
	import type { PromptTemplate, Producer } from '$lib/types/suno';

	// 외부 링크 (API 없음, 새 탭에서 열기)
	const GOOGLE_TRANSLATE_BASE = 'https://translate.google.com/?sl=auto&tl=en&op=translate&text=';
	const DEEPL_TRANSLATOR = 'https://www.deepl.com/translator';
	const SPELL_CHECK_URL = 'https://nara-speller.co.kr/speller'; // 부산대 맞춤법(바른한글)

	function openGoogleTranslate(text: string) {
		if (!text.trim()) return;
		window.open(GOOGLE_TRANSLATE_BASE + encodeURIComponent(text.trim()), '_blank', 'noopener,noreferrer');
	}
	function openDeepL() {
		window.open(DEEPL_TRANSLATOR, '_blank', 'noopener,noreferrer');
	}
	function openSpellCheck() {
		window.open(SPELL_CHECK_URL, '_blank', 'noopener,noreferrer');
	}

	// 필터 상태
	let searchQuery = $state('');
	let categoryFilter = $state<'all' | 'style' | 'exclude' | 'full' | 'reference'>('all');
	let categoryDropdownOpen = $state(false);
	let selectedCreator = $state<Producer | 'all'>('all');
	let creatorDropdownOpen = $state(false);
	let copiedId = $state<string | null>(null);
	
	// 정렬 상태
	type SortOption = 'usage_desc' | 'usage_asc' | 'created_desc' | 'created_asc' | 'name_asc' | 'name_desc';
	let sortBy = $state<SortOption>('usage_desc');
	let sortDropdownOpen = $state(false);
	
	const sortLabels: Record<SortOption, string> = {
		usage_desc: '사용 많은순',
		usage_asc: '사용 적은순',
		created_desc: '최근 생성순',
		created_asc: '오래된 생성순',
		name_asc: '이름순 (ㄱ-ㅎ)',
		name_desc: '이름순 (ㅎ-ㄱ)'
	};
	
	const creatorLabels: Record<Producer | 'all', string> = {
		all: '전체',
		El: 'El',
		Otte: 'Otte'
	};

	// 모달 상태
	let showAddModal = $state(false);
	let showEditModal = $state(false);
	let editingPrompt = $state<PromptTemplate | null>(null);
	let addCategoryOpen = $state(false);
	let editCategoryOpen = $state(false);
	let editForm = $state({ name: '', description: '', category: 'style' as 'style' | 'exclude' | 'full' | 'reference', content: '' });
	let newPrompt = $state({
		name: '',
		description: '',
		category: 'style' as 'style' | 'exclude' | 'full' | 'reference',
		content: ''
	});

	// 목업 데이터
	let prompts = $state<PromptTemplate[]>([
		{
			id: 'p1',
			name: '드리미 신스팝',
			description: '몽환적인 신스팝, 에테리얼 보컬',
			category: 'style',
			content: 'dreamy synth-pop, ethereal vocals, soft ballad, polished but emotive, with precise phrasing and dynamic control',
			usageCount: 15,
			createdAt: '2026-01-05',
			createdBy: 'El'
		},
		{
			id: 'p2',
			name: 'K-POP 업템포',
			description: '캐치한 훅, 에너지 넘치는 댄스팝',
			category: 'style',
			content: 'upbeat K-pop, catchy hooks, energetic dance-pop, powerful beats, polished production',
			usageCount: 12,
			createdAt: '2026-01-03',
			createdBy: 'Otte'
		},
		{
			id: 'p3',
			name: '멜로우 어쿠스틱',
			description: '따뜻한 보컬, 어쿠스틱 기타',
			category: 'style',
			content: 'mellow acoustic, warm vocals, gentle guitar, intimate atmosphere, singer-songwriter style',
			usageCount: 8,
			createdAt: '2026-01-02',
			createdBy: 'El'
		},
		{
			id: 'p4',
			name: 'R&B 소울',
			description: '스무스 그루브, 감성 보컬',
			category: 'style',
			content: 'R&B soul, smooth grooves, emotional vocals, modern production, late night vibes',
			usageCount: 6,
			createdAt: '2026-01-01',
			createdBy: 'El'
		},
		{
			id: 'p5',
			name: '제외 - 헤비메탈',
			description: '금지: 메탈·비명·디스토션',
			category: 'exclude',
			content: 'heavy metal, screaming, aggressive, harsh, distorted, noisy',
			usageCount: 20,
			createdAt: '2025-12-28',
			createdBy: 'El'
		},
		{
			id: 'p6',
			name: '제외 - 아마추어',
			description: '금지: 부정확·로우퀄',
			category: 'exclude',
			content: 'off-key, amateur, monotone, robotic, low quality',
			usageCount: 18,
			createdAt: '2025-12-28',
			createdBy: 'Otte'
		},
		{
			id: 'p7',
			name: '여름밤 발라드 풀셋',
			description: '스타일+제외 한 번에',
			category: 'full',
			content: 'Style: dreamy synth-pop, ethereal vocals, soft ballad, korean, emotional, midnight vibes\nExclude: heavy metal, screaming, aggressive, harsh',
			usageCount: 5,
			createdAt: '2026-01-10',
			createdBy: 'El'
		},
		{
			id: 'p8',
			name: '참고 - 80s 팝',
			description: '80년대 팝 레퍼런스',
			category: 'reference',
			content: 'similar to 80s pop, synth-driven, new wave, like Duran Duran, The Cure',
			usageCount: 3,
			createdAt: '2026-01-12',
			createdBy: 'Otte'
		}
	]);

	// 이름 중복 검사 (추가 시)
	const isDuplicateNameAdd = $derived(
		newPrompt.name.trim().length > 0 &&
		prompts.some(p => p.name.trim().toLowerCase() === newPrompt.name.trim().toLowerCase())
	);
	// 이름 중복 검사 (편집 시, 자기 자신 제외)
	const isDuplicateNameEdit = $derived(
		!!editingPrompt &&
		editForm.name.trim().length > 0 &&
		prompts.some(p => p.id !== editingPrompt!.id && p.name.trim().toLowerCase() === editForm.name.trim().toLowerCase())
	);

	// 프롬프트/제외스타일 내용 최대 길이 (띄어쓰기 포함)
	const MAX_CONTENT_LENGTH = 1000;

	// 카테고리 라벨
	const categoryLabels: Record<'all' | 'style' | 'exclude' | 'full' | 'reference', string> = {
		all: '전체',
		style: '스타일',
		exclude: '제외',
		full: '풀 프롬프트',
		reference: '참고/레퍼런스'
	};

	// 카테고리 색상 (배지·필터 동일): 배경은 중립, 글자·테두리로 구분해 가독성 확보
	function getCategoryColors(category: string): string {
		const map: Record<string, string> = {
			style: 'bg-surface-2 border-brand-pink text-brand-pink',
			exclude: 'bg-surface-2 border-red-400 text-red-400',
			full: 'bg-surface-2 border-blue-400 text-blue-400',
			reference: 'bg-surface-2 border-amber-400 text-amber-400'
		};
		return map[category] ?? 'bg-surface-2 border-border-subtle text-text-muted';
	}
	// 카테고리 뱃지: 표시 전용(링크/버튼 아님) → 호버·포커스·transition 없음
	function getCategoryBadgeClass(category: string): string {
		const base =
			'flex-shrink-0 px-2 py-0.5 rounded text-xs font-medium border outline-none focus:outline-none focus:ring-0 select-none cursor-default pointer-events-none';
		return `${base} ${getCategoryColors(category)}`;
	}

	// 필터링 및 정렬
	const filteredPrompts = $derived.by(() => {
		let result = prompts.filter(prompt => {
			if (searchQuery && !prompt.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
				!prompt.content.toLowerCase().includes(searchQuery.toLowerCase())) {
				return false;
			}
			if (categoryFilter !== 'all' && prompt.category !== categoryFilter) {
				return false;
			}
			if (selectedCreator !== 'all' && prompt.createdBy !== selectedCreator) {
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
				case 'name_asc':
					return a.name.localeCompare(b.name);
				case 'name_desc':
					return b.name.localeCompare(a.name);
				default:
					return 0;
			}
		});
		
		return result;
	});

	// 카테고리별 카운트
	const categoryCounts = $derived.by(() => {
		const counts: Record<string, number> = { all: prompts.length };
		prompts.forEach(p => {
			counts[p.category] = (counts[p.category] || 0) + 1;
		});
		return counts;
	});

	// 복사
	async function copyPrompt(id: string, content: string) {
		await navigator.clipboard.writeText(content);
		copiedId = id;
		setTimeout(() => copiedId = null, 2000);
	}

	// 삭제
	function deletePrompt(id: string) {
		if (confirm('이 프롬프트를 삭제하시겠습니까?')) {
			prompts = prompts.filter(p => p.id !== id);
		}
	}

	// 추가 (내용 1000자 초과 시 저장 안 함)
	function addPrompt() {
		const content = newPrompt.content.trim().slice(0, MAX_CONTENT_LENGTH);
		if (!newPrompt.name.trim() || !content || isDuplicateNameAdd) return;

		prompts = [...prompts, {
			id: `p_${Date.now()}`,
			name: newPrompt.name.trim(),
			description: newPrompt.description.trim() || undefined,
			category: newPrompt.category,
			content,
			usageCount: 0,
			createdAt: new Date().toISOString().split('T')[0],
			createdBy: 'El'
		}];

		newPrompt = { name: '', description: '', category: 'style', content: '' };
		showAddModal = false;
	}

	// 편집 열기/닫기/저장
	function openEditModal(prompt: PromptTemplate) {
		editingPrompt = prompt;
		editForm = { name: prompt.name, description: prompt.description ?? '', category: prompt.category, content: prompt.content.slice(0, MAX_CONTENT_LENGTH) };
		showEditModal = true;
	}
	function closeEditModal() {
		showEditModal = false;
		editingPrompt = null;
	}
	function saveEdit() {
		const content = editForm.content.trim().slice(0, MAX_CONTENT_LENGTH);
		if (!editingPrompt || !editForm.name.trim() || !content || isDuplicateNameEdit) return;
		prompts = prompts.map(p =>
			p.id === editingPrompt!.id
				? { ...p, name: editForm.name.trim(), description: editForm.description.trim() || undefined, category: editForm.category, content }
				: p
		);
		closeEditModal();
	}

	// 전체 내용 보기 모달
	let fullContentPrompt = $state<PromptTemplate | null>(null);
	function openFullContent(prompt: PromptTemplate) {
		fullContentPrompt = prompt;
	}
	function closeFullContent() {
		fullContentPrompt = null;
	}

	// 담당자별 카운트
	const creatorCounts = $derived.by(() => {
		const counts: Record<string, number> = { all: prompts.length };
		prompts.forEach(p => {
			counts[p.createdBy] = (counts[p.createdBy] || 0) + 1;
		});
		return counts;
	});

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
		if (!target.closest('.add-category-dropdown')) {
			addCategoryOpen = false;
		}
		if (!target.closest('.edit-category-dropdown')) {
			editCategoryOpen = false;
		}
	}

	$effect(() => {
		if (categoryDropdownOpen || creatorDropdownOpen || sortDropdownOpen || addCategoryOpen || editCategoryOpen) {
			document.addEventListener('click', handleClickOutside);
		}
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<svelte:head>
	<title>프롬프트 라이브러리 | SUNO 제작</title>
</svelte:head>

<div class="pt-0 pb-6 sm:pb-6 pb-20 bg-bg text-text-base">
	<!-- 헤더 -->
	<div class="mb-8 mt-1.5">
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
			<div>
				<h1 class="text-3xl font-bold text-text-strong mb-2">SUNO 제작</h1>
				<p class="text-text-muted">자주 사용하는 SUNO 프롬프트를 저장하고 관리합니다</p>
			</div>
		<button
			type="button"
			onclick={() => showAddModal = true}
			class="page-header-action-button inline-flex items-center justify-center gap-2 px-4 py-2 w-full sm:w-auto rounded-lg transition-colors duration-200 font-medium page-header-primary-button bg-brand-pink text-[var(--surface-2)] hover:[&>svg]:!text-[var(--surface-2)] focus:bg-brand-pink focus:text-white focus:[&>svg]:!text-white focus-visible:bg-brand-pink focus-visible:text-white focus-visible:[&>svg]:!text-white focus:outline-none focus:ring-0 flex-shrink-0"
		>
			<Plus size={16} />
			프롬프트 추가
		</button>
		</div>
	</div>

	<!-- 탭 + 콘텐츠 -->
	<SUNOTabs>
		<!-- 필터 영역 -->
		<div class="mb-6 space-y-3">
			<!-- 검색 (윗줄) -->
			<div class="relative group">
				<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
					<Search size={16} class="lucide-icon lucide-search filter-search-icon" />
				</div>
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="프롬프트 검색..."
					class="filter-search-input w-full pl-10 {searchQuery.trim() ? 'pr-10' : 'pr-4'} py-1.5 bg-surface-2 border border-border-subtle border-[1px] rounded-md text-text-base placeholder:text-text-base placeholder:opacity-100 focus:outline-none focus:border-brand-pink focus:ring-0 transition-colors duration-200"
					aria-label="프롬프트 검색"
					id="prompt-search"
					autocomplete="off"
				/>
				{#if searchQuery.trim()}
					<button
						type="button"
						onclick={() => {
							searchQuery = '';
							const input = document.getElementById('prompt-search') as HTMLInputElement;
							input?.focus();
						}}
						class="search-clear-button absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center bg-transparent hover:bg-transparent focus:bg-transparent focus-visible:bg-transparent"
						aria-label="검색 초기화"
					>
						<X size={16} class="lucide-icon" />
					</button>
				{/if}
			</div>

			<!-- 필터/정렬 (아랫줄) -->
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
							{categoryLabels[categoryFilter]} ({categoryCounts[categoryFilter] || 0})
						</span>
						<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
							<ChevronDown size={12} class="text-text-base transition-colors duration-200" />
						</div>
					</button>
					{#if categoryDropdownOpen}
						<ul class="absolute left-0 w-full mt-[6px] bg-surface-2 border border-border-subtle rounded-[6px] z-10 overflow-hidden">
							{#each Object.entries(categoryLabels) as [value, label]}
								<li
									role="option"
									aria-selected={categoryFilter === value}
									tabindex="0"
									onclick={() => { categoryFilter = value as typeof categoryFilter; categoryDropdownOpen = false; }}
									onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { categoryFilter = value as typeof categoryFilter; categoryDropdownOpen = false; } }}
									class="dropdown-item px-4 py-2 text-sm cursor-pointer transition-colors {categoryFilter === value ? 'bg-brand-pink text-white' : 'text-text-base hover:bg-surface-1'}"
								>
									{label} ({categoryCounts[value] || 0})
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
							{creatorLabels[selectedCreator]} ({creatorCounts[selectedCreator] || 0})
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
									onclick={() => { selectedCreator = value as typeof selectedCreator; creatorDropdownOpen = false; }}
									onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { selectedCreator = value as typeof selectedCreator; creatorDropdownOpen = false; } }}
									class="dropdown-item px-4 py-2 text-sm cursor-pointer transition-colors {selectedCreator === value ? 'bg-brand-pink text-white' : 'text-text-base'}"
								>
									{label} ({creatorCounts[value] || 0})
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

		<!-- 프롬프트 그리드 -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each filteredPrompts as prompt}
				<div class="project-card flex flex-col min-h-[200px] bg-surface-2 rounded-lg border border-border-subtle p-4 transition-colors">
					<!-- 헤더 -->
					<div class="flex items-start justify-between gap-3 mb-2 flex-shrink-0">
						<div class="flex-1 min-w-0">
							<div class="flex items-center gap-2">
								<h3 class="text-base font-medium text-text-strong truncate">{prompt.name}</h3>
								<span class="{getCategoryBadgeClass(prompt.category)}">
									{categoryLabels[prompt.category]}
								</span>
							</div>
							<p class="text-xs text-text-muted mt-1">
								사용 {prompt.usageCount}회 · <span class="{prompt.createdBy === 'El' ? 'text-elotte-green' : 'text-elotte-orange'}">{prompt.createdBy}</span> · {prompt.createdAt}
							</p>
							{#if prompt.description}
								<p class="text-sm text-text-muted mt-1.5 line-clamp-1 truncate" title={prompt.description}>{prompt.description}</p>
							{/if}
						</div>
					</div>

					<!-- 내용 (3줄만 보이고 나머지는 ...) -->
					<div class="bg-surface-1 rounded-lg p-3 mb-3 flex-1 min-h-0 overflow-hidden">
						<p class="text-sm text-text-base whitespace-pre-wrap line-clamp-3 break-words">{prompt.content}</p>
					</div>

					<!-- 카드 하단: 좌측 전체 보기, 우측 액션 (모든 카드 동일 위치) -->
					<div class="flex items-center justify-between gap-2 flex-shrink-0 mt-auto">
						<button
							type="button"
							onclick={() => openFullContent(prompt)}
							class="group/textlink text-xs inline-flex items-center gap-1 bg-transparent border-0 p-0 cursor-pointer outline-none focus:outline-none focus:ring-0 text-brand-pink hover:text-hover-cyan focus:text-hover-cyan transition-colors [&_svg]:shrink-0 [&_svg]:stroke-current [&_svg]:transition-colors"
							aria-label="전체 내용 보기"
						>
							<Maximize2 size={12} />
							<span class="text-inherit group-hover/textlink:text-hover-cyan group-focus/textlink:text-hover-cyan transition-colors">전체 보기</span>
						</button>
						<div class="flex items-center gap-2">
							<button
								type="button"
								class="btn-icon"
								onclick={() => copyPrompt(prompt.id, prompt.content)}
								aria-label="복사"
							>
								{#if copiedId === prompt.id}
									<Check size={16} class="text-green-500" />
								{:else}
									<Copy size={16} />
								{/if}
							</button>
							<button type="button" class="btn-icon" onclick={() => openEditModal(prompt)} aria-label="수정">
								<Edit2 size={16} />
							</button>
							<button
								type="button"
								class="btn-icon text-red-400 hover:text-red-500"
								onclick={() => deletePrompt(prompt.id)}
								aria-label="삭제"
							>
								<Trash2 size={16} />
							</button>
						</div>
					</div>
				</div>
			{/each}

			{#if filteredPrompts.length === 0}
				<div class="col-span-full py-16 text-center">
					{#if searchQuery || categoryFilter !== 'all' || selectedCreator !== 'all'}
						<div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-2 mb-4">
							<SearchX size={28} class="text-text-muted" />
						</div>
						<p class="text-text-base font-medium mb-2">검색 결과가 없습니다</p>
						<p class="text-text-muted text-sm mb-4">다른 검색어나 필터를 시도해보세요</p>
						<button
							type="button"
							onclick={() => { searchQuery = ''; categoryFilter = 'all'; selectedCreator = 'all'; }}
							class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-pink border border-brand-pink rounded-lg hover:bg-brand-pink hover:text-white transition-colors"
						>
							<X size={14} />
							필터 초기화
						</button>
					{:else}
						<div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-2 mb-4">
							<FileText size={28} class="text-text-muted" />
						</div>
						<p class="text-text-base font-medium mb-2">저장된 프롬프트가 없습니다</p>
						<p class="text-text-muted text-sm mb-4">자주 사용하는 프롬프트를 추가해보세요</p>
						<button
							type="button"
							onclick={() => showAddModal = true}
							class="page-header-action-button inline-flex items-center justify-center gap-2 px-4 py-2 w-full sm:w-auto rounded-lg transition-colors duration-200 font-medium page-header-primary-button bg-brand-pink text-[var(--surface-2)] hover:[&>svg]:!text-[var(--surface-2)] focus:bg-brand-pink focus:text-white focus:[&>svg]:!text-white focus-visible:bg-brand-pink focus-visible:text-white focus-visible:[&>svg]:!text-white focus:outline-none focus:ring-0"
						>
							<Plus size={16} />
							프롬프트 추가하기
						</button>
					{/if}
				</div>
			{/if}
		</div>

		<!-- 통계 -->
		<div class="mt-6">
			<div class="flex flex-wrap items-center gap-4 text-sm">
				<span class="text-text-muted">
					총 <span class="font-medium text-text-base">{prompts.length}</span>개 프롬프트
				</span>
				<span class="text-border-subtle">|</span>
				<span class="text-text-muted">
					표시 중 <span class="font-medium text-text-base">{filteredPrompts.length}</span>개
				</span>
			</div>
		</div>
	</SUNOTabs>
</div>

<!-- 프롬프트 추가 모달 -->
{#if showAddModal}
	<!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
	<div
		class="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
		role="dialog"
		aria-modal="true"
		aria-labelledby="add-modal-title"
		tabindex="-1"
		onclick={() => showAddModal = false}
		onkeydown={(e) => { if (e.key === 'Escape') showAddModal = false; }}
	>
		<!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
		<div
			class="bg-surface-1 rounded-lg border border-border-subtle w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			role="presentation"
		>
			<div class="flex items-center justify-between px-6 py-4 border-b border-border-subtle flex-shrink-0">
				<h2 id="add-modal-title" class="text-lg font-semibold text-text-strong">새 프롬프트 추가</h2>
				<button
					type="button"
					onclick={() => showAddModal = false}
					class="template-close-btn w-8 h-8 flex items-center justify-end rounded-md text-text-muted transition-colors border border-transparent pl-2 pr-0"
					aria-label="닫기"
				>
					<X size={20} />
				</button>
			</div>

			<form onsubmit={(e) => { e.preventDefault(); addPrompt(); }} class="flex flex-1 min-h-0 flex-col">
				<div class="p-6 space-y-4 overflow-y-auto custom-list-scrollbar modal-scroll-body flex-1 min-h-0">
				<!-- 이름 -->
				<div>
					<label for="prompt-name" class="block text-sm font-medium text-text-strong mb-2">이름</label>
					<input
						type="text"
						id="prompt-name"
						bind:value={newPrompt.name}
						class="input-base w-full h-10 px-4 text-base placeholder-text-muted rounded-lg border box-border"
						placeholder="프롬프트 이름"
						aria-invalid={isDuplicateNameAdd}
						required
					/>
					{#if isDuplicateNameAdd}
						<p class="text-xs text-danger-fg mt-1.5">이미 같은 이름의 프롬프트가 있습니다</p>
					{/if}
				</div>

				<!-- 설명 (선택, 그리드에서 알아보기 쉽게) -->
				<div>
					<label for="prompt-description" class="block text-sm font-medium text-text-strong mb-2">설명</label>
					<input
						type="text"
						id="prompt-description"
						bind:value={newPrompt.description}
						class="input-base w-full h-10 px-4 text-base placeholder-text-muted rounded-lg border box-border"
						placeholder="한 줄 요약 (선택)"
					/>
				</div>

				<!-- 카테고리 (커스텀 드롭다운) -->
				<div class="add-category-dropdown relative">
					<label for="prompt-category-btn" class="block text-sm font-medium text-text-strong mb-2">카테고리</label>
					<button
						type="button"
						id="prompt-category-btn"
						onclick={() => addCategoryOpen = !addCategoryOpen}
						aria-haspopup="listbox"
						aria-expanded={addCategoryOpen}
						class="input-select-trigger w-full"
					>
						<span>{categoryLabels[newPrompt.category]}</span>
						<span class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
							<ChevronDown size={16} class="text-text-muted transition-transform {addCategoryOpen ? 'rotate-180' : ''}" />
						</span>
					</button>
					{#if addCategoryOpen}
						<ul
							class="absolute left-0 right-0 mt-1 bg-surface-2 border border-border-subtle rounded-lg z-20 overflow-hidden"
							role="listbox"
						>
							{#each [['style', '스타일'], ['exclude', '제외'], ['full', '풀 프롬프트'], ['reference', '참고/레퍼런스']] as [value, label]}
								<li
									role="option"
									aria-selected={newPrompt.category === value}
									tabindex="0"
									onclick={() => { newPrompt = { ...newPrompt, category: value as 'style' | 'exclude' | 'full' | 'reference' }; addCategoryOpen = false; }}
									onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { newPrompt = { ...newPrompt, category: value as 'style' | 'exclude' | 'full' | 'reference' }; addCategoryOpen = false; } }}
									class="dropdown-item px-4 py-2.5 text-sm cursor-pointer transition-colors {newPrompt.category === value ? 'bg-brand-pink text-white' : 'text-text-base hover:bg-surface-1'}"
								>
									{label}
								</li>
							{/each}
						</ul>
					{/if}
				</div>

				<!-- 내용 -->
				<div>
					<div class="flex items-center justify-between mb-2">
						<label for="prompt-content" class="block text-sm font-medium text-text-strong">내용</label>
						<div class="flex items-center gap-2 flex-wrap">
							{#if newPrompt.content.trim()}
								<button
									type="button"
									onclick={() => openGoogleTranslate(newPrompt.content)}
									class="btn-outline-hover flex items-center gap-1 px-2 py-1.5 text-xs rounded-md border border-border-subtle text-text-base transition-colors"
									title="작성한 글을 넣어 Google 번역 열기"
								>
									<Languages size={12} />
									Google 번역
								</button>
							{/if}
							<a
								href={DEEPL_TRANSLATOR}
								target="_blank"
								rel="noopener noreferrer"
								class="btn-outline-hover flex items-center gap-1 px-2 py-1.5 text-xs rounded-md border border-border-subtle text-text-base transition-colors no-underline"
								title="DeepL 번역기 열기"
							>
								<ExternalLink size={12} />
								DeepL
							</a>
							<a
								href={SPELL_CHECK_URL}
								target="_blank"
								rel="noopener noreferrer"
								class="btn-outline-hover flex items-center gap-1 px-2 py-1.5 text-xs rounded-md border border-border-subtle text-text-base transition-colors no-underline"
								title="부산대 맞춤법(바른한글) 열기"
							>
								<SpellCheck size={12} />
								맞춤법(바른한글)
							</a>
						</div>
					</div>
					<p class="text-xs text-text-muted mb-1 text-right">결과는 새 탭에서 복사한 뒤 여기 붙여넣어 주세요.</p>
					<textarea
						id="prompt-content"
						value={newPrompt.content}
						oninput={(e) => {
							const v = e.currentTarget.value;
							newPrompt.content = v.length > MAX_CONTENT_LENGTH ? v.slice(0, MAX_CONTENT_LENGTH) : v;
						}}
						class="input-base w-full min-h-[8rem] py-3 px-4 text-base placeholder-text-muted resize-none overflow-y-auto custom-list-scrollbar"
						placeholder="프롬프트 내용을 입력하세요 (띄어쓰기 포함 최대 1000자)"
						spellcheck="true"
						lang="ko"
						required
					></textarea>
					<p class="text-xs mt-1 {newPrompt.content.length >= MAX_CONTENT_LENGTH ? 'text-danger-fg' : 'text-text-muted'}">{newPrompt.content.length}/{MAX_CONTENT_LENGTH}</p>
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
						class="page-header-primary-button inline-flex items-center justify-center gap-2 px-6 py-2 bg-brand-pink text-white rounded-lg transition-colors font-medium focus:outline-none focus:ring-0"
					>
						추가
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- 프롬프트 편집 모달 -->
{#if showEditModal && editingPrompt}
	<!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
	<div
		class="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
		role="dialog"
		aria-modal="true"
		aria-labelledby="edit-modal-title"
		tabindex="-1"
		onclick={closeEditModal}
		onkeydown={(e) => { if (e.key === 'Escape') closeEditModal(); }}
	>
		<!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
		<div
			class="bg-surface-1 rounded-lg border border-border-subtle w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			role="presentation"
		>
			<div class="flex items-center justify-between px-6 py-4 border-b border-border-subtle flex-shrink-0">
				<h2 id="edit-modal-title" class="text-lg font-semibold text-text-strong">프롬프트 수정</h2>
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
				<div>
					<label for="edit-prompt-name" class="block text-sm font-medium text-text-strong mb-2">이름</label>
					<input
						type="text"
						id="edit-prompt-name"
						bind:value={editForm.name}
						class="input-base w-full h-10 px-4 text-base placeholder-text-muted rounded-lg border box-border"
						placeholder="프롬프트 이름"
						aria-invalid={isDuplicateNameEdit}
						required
					/>
					{#if isDuplicateNameEdit}
						<p class="text-xs text-danger-fg mt-1.5">이미 같은 이름의 프롬프트가 있습니다</p>
					{/if}
				</div>
				<!-- 설명 (선택) -->
				<div>
					<label for="edit-prompt-description" class="block text-sm font-medium text-text-strong mb-2">설명</label>
					<input
						type="text"
						id="edit-prompt-description"
						bind:value={editForm.description}
						class="input-base w-full h-10 px-4 text-base placeholder-text-muted rounded-lg border box-border"
						placeholder="한 줄 요약 (선택)"
					/>
				</div>
				<!-- 카테고리 (커스텀 드롭다운) -->
				<div class="edit-category-dropdown relative">
					<label for="edit-prompt-category-btn" class="block text-sm font-medium text-text-strong mb-2">카테고리</label>
					<button
						type="button"
						id="edit-prompt-category-btn"
						onclick={() => editCategoryOpen = !editCategoryOpen}
						aria-haspopup="listbox"
						aria-expanded={editCategoryOpen}
						class="input-select-trigger w-full"
					>
						<span>{categoryLabels[editForm.category]}</span>
						<span class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
							<ChevronDown size={16} class="text-text-muted transition-transform {editCategoryOpen ? 'rotate-180' : ''}" />
						</span>
					</button>
					{#if editCategoryOpen}
						<ul
							class="absolute left-0 right-0 mt-1 bg-surface-2 border border-border-subtle rounded-lg z-20 overflow-hidden"
							role="listbox"
						>
							{#each [['style', '스타일'], ['exclude', '제외'], ['full', '풀 프롬프트'], ['reference', '참고/레퍼런스']] as [value, label]}
								<li
									role="option"
									aria-selected={editForm.category === value}
									tabindex="0"
									onclick={() => { editForm = { ...editForm, category: value as 'style' | 'exclude' | 'full' | 'reference' }; editCategoryOpen = false; }}
									onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { editForm = { ...editForm, category: value as 'style' | 'exclude' | 'full' | 'reference' }; editCategoryOpen = false; } }}
									class="dropdown-item px-4 py-2.5 text-sm cursor-pointer transition-colors {editForm.category === value ? 'bg-brand-pink text-white' : 'text-text-base hover:bg-surface-1'}"
								>
									{label}
								</li>
							{/each}
						</ul>
					{/if}
				</div>
				<div>
					<div class="flex items-center justify-between mb-2">
						<label for="edit-prompt-content" class="block text-sm font-medium text-text-strong">내용</label>
						<div class="flex items-center gap-2 flex-wrap">
							{#if editForm.content.trim()}
								<button
									type="button"
									onclick={() => openGoogleTranslate(editForm.content)}
									class="btn-outline-hover flex items-center gap-1 px-2 py-1.5 text-xs rounded-md border border-border-subtle text-text-base transition-colors"
									title="작성한 글을 넣어 Google 번역 열기"
								>
									<Languages size={12} />
									Google 번역
								</button>
							{/if}
							<a
								href={DEEPL_TRANSLATOR}
								target="_blank"
								rel="noopener noreferrer"
								class="btn-outline-hover flex items-center gap-1 px-2 py-1.5 text-xs rounded-md border border-border-subtle text-text-base transition-colors no-underline"
								title="DeepL 번역기 열기"
							>
								<ExternalLink size={12} />
								DeepL
							</a>
							<a
								href={SPELL_CHECK_URL}
								target="_blank"
								rel="noopener noreferrer"
								class="btn-outline-hover flex items-center gap-1 px-2 py-1.5 text-xs rounded-md border border-border-subtle text-text-base transition-colors no-underline"
								title="부산대 맞춤법(바른한글) 열기"
							>
								<SpellCheck size={12} />
								맞춤법(바른한글)
							</a>
						</div>
					</div>
					<p class="text-xs text-text-muted mb-1 text-right">결과는 새 탭에서 복사한 뒤 여기 붙여넣어 주세요.</p>
					<textarea
						id="edit-prompt-content"
						value={editForm.content}
						oninput={(e) => {
							const v = e.currentTarget.value;
							editForm.content = v.length > MAX_CONTENT_LENGTH ? v.slice(0, MAX_CONTENT_LENGTH) : v;
						}}
						class="input-base w-full min-h-[8rem] py-3 px-4 text-base placeholder-text-muted resize-none overflow-y-auto custom-list-scrollbar"
						placeholder="프롬프트 내용 (띄어쓰기 포함 최대 1000자)"
						spellcheck="true"
						lang="ko"
						required
					></textarea>
					<p class="text-xs mt-1 {editForm.content.length >= MAX_CONTENT_LENGTH ? 'text-danger-fg' : 'text-text-muted'}">{editForm.content.length}/{MAX_CONTENT_LENGTH}</p>
				</div>
				</div>
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
						class="page-header-primary-button inline-flex items-center justify-center gap-2 px-6 py-2 bg-brand-pink text-white rounded-lg transition-colors font-medium focus:outline-none focus:ring-0"
					>
						저장
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- 전체 내용 보기 모달 -->
{#if fullContentPrompt}
	<!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
	<div
		class="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
		role="dialog"
		aria-modal="true"
		aria-labelledby="full-content-title"
		tabindex="-1"
		onclick={closeFullContent}
		onkeydown={(e) => { if (e.key === 'Escape') closeFullContent(); }}
	>
		<!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
		<div
			class="bg-surface-1 rounded-lg border border-border-subtle w-full max-w-2xl max-h-[85vh] flex flex-col"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
		>
			<div class="flex items-center justify-between gap-3 p-4 border-b border-border-subtle flex-shrink-0">
				<h2 id="full-content-title" class="text-lg font-semibold text-text-strong truncate">{fullContentPrompt.name}</h2>
				<div class="flex items-center gap-2 flex-shrink-0">
					<button
						type="button"
						onclick={() => copyPrompt(fullContentPrompt!.id, fullContentPrompt!.content)}
						class="btn-outline-hover flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-border-subtle"
					>
						{#if copiedId === fullContentPrompt.id}
							<Check size={14} class="text-green-500" />
							복사됨
						{:else}
							<Copy size={14} />
							복사
						{/if}
					</button>
					<button type="button" onclick={closeFullContent} class="btn-icon" aria-label="닫기">
						<X size={20} />
					</button>
				</div>
			</div>
			<div class="p-4 overflow-y-auto flex-1 min-h-0 custom-list-scrollbar">
				<p class="text-sm text-text-base whitespace-pre-wrap break-words">{fullContentPrompt.content}</p>
				<p class="text-xs text-text-muted mt-4">{fullContentPrompt.content.length}자</p>
			</div>
		</div>
	</div>
{/if}
