<script lang="ts">
	import { Plus, Search, Edit2, Trash2, X, Link, Mic, SearchX, ChevronDown, ArrowUpDown } from 'lucide-svelte';
	import SUNOTabs from '$lib/components/suno/SUNOTabs.svelte';
	import type { VirtualVocal } from '$lib/types/suno';

	// 검색 상태
	let searchQuery = $state('');
	
	// 정렬 상태
	type SortOption = 'name_asc' | 'name_desc' | 'tracks_desc' | 'tracks_asc' | 'created_desc' | 'created_asc';
	let sortBy = $state<SortOption>('tracks_desc');
	let sortDropdownOpen = $state(false);
	
	const sortLabels: Record<SortOption, string> = {
		name_asc: '이름순 (A-Z)',
		name_desc: '이름순 (Z-A)',
		tracks_desc: '연결 트랙 많은순',
		tracks_asc: '연결 트랙 적은순',
		created_desc: '최근 생성순',
		created_asc: '오래된 생성순'
	};

	// 모달 상태
	let showAddModal = $state(false);
	let newVocal = $state({
		name: '',
		description: ''
	});

	// 목업 데이터
	let vocals = $state<VirtualVocal[]>([
		{
			id: 'v1',
			name: 'Luna',
			description: '여성 메인 보컬. 청아하고 맑은 음색, 고음 처리 우수',
			linkedTracks: ['track1', 'track2', 'track3'],
			createdAt: '2025-11-01'
		},
		{
			id: 'v2',
			name: 'Ray',
			description: '남성 메인 보컬. 중저음의 깊은 음색, 감성적인 표현',
			linkedTracks: ['track4', 'track5'],
			createdAt: '2025-11-15'
		},
		{
			id: 'v3',
			name: 'Sugar Rush Collective',
			description: '팀 그룹 보컬. 다양한 보컬 조합 가능',
			linkedTracks: ['track1', 'track6', 'track7', 'track8'],
			createdAt: '2025-10-20'
		},
		{
			id: 'v4',
			name: 'Stellar',
			description: '여성 서브 보컬. 파워풀한 고음과 샤우팅 전문',
			linkedTracks: ['track9'],
			createdAt: '2026-01-05'
		},
		{
			id: 'v5',
			name: 'Echo',
			description: '유니섹스 보컬. 몽환적이고 신비로운 분위기',
			linkedTracks: [],
			createdAt: '2026-01-10'
		}
	]);

	// 필터링 및 정렬
	const filteredVocals = $derived.by(() => {
		let result = vocals;
		
		// 검색 필터링
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			result = result.filter(v => 
				v.name.toLowerCase().includes(query) || 
				v.description?.toLowerCase().includes(query)
			);
		}
		
		// 정렬
		result = [...result].sort((a, b) => {
			switch (sortBy) {
				case 'name_asc':
					return a.name.localeCompare(b.name);
				case 'name_desc':
					return b.name.localeCompare(a.name);
				case 'tracks_desc':
					return b.linkedTracks.length - a.linkedTracks.length;
				case 'tracks_asc':
					return a.linkedTracks.length - b.linkedTracks.length;
				case 'created_desc':
					return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
				case 'created_asc':
					return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
				default:
					return 0;
			}
		});
		
		return result;
	});
	
	// 외부 클릭 처리
	function handleClickOutside(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (!target.closest('.sort-dropdown')) {
			sortDropdownOpen = false;
		}
	}

	$effect(() => {
		if (sortDropdownOpen) {
			document.addEventListener('click', handleClickOutside);
		}
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});

	// 삭제
	function deleteVocal(id: string) {
		const vocal = vocals.find(v => v.id === id);
		if (vocal && vocal.linkedTracks.length > 0) {
			if (!confirm(`'${vocal.name}'은(는) ${vocal.linkedTracks.length}개의 트랙에 연결되어 있습니다. 정말 삭제하시겠습니까?`)) {
				return;
			}
		} else if (!confirm('이 보컬을 삭제하시겠습니까?')) {
			return;
		}
		vocals = vocals.filter(v => v.id !== id);
	}

	// 추가
	function addVocal() {
		if (!newVocal.name.trim()) return;

		vocals = [...vocals, {
			id: `v_${Date.now()}`,
			name: newVocal.name.trim(),
			description: newVocal.description.trim(),
			linkedTracks: [],
			createdAt: new Date().toISOString().split('T')[0]
		}];

		newVocal = { name: '', description: '' };
		showAddModal = false;
	}
</script>

<svelte:head>
	<title>가상 보컬 관리 | SUNO 제작</title>
</svelte:head>

<div class="pt-0 pb-6 sm:pb-6 pb-20 bg-bg text-text-base">
	<!-- 헤더 -->
	<div class="mb-8 mt-1.5">
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
			<div>
				<h1 class="text-3xl font-bold text-text-strong mb-2">SUNO 제작</h1>
				<p class="text-text-muted">SUNO AI로 생성되는 가상 보컬과 보컬팀을 관리합니다</p>
			</div>
			<button
				type="button"
				onclick={() => showAddModal = true}
				class="flex items-center gap-2 px-4 py-2 bg-brand-pink text-white rounded-lg font-medium hover:bg-brand-pink/90 transition-colors flex-shrink-0"
			>
				<Plus size={16} />
				보컬 추가
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
					<Search size={16} class="lucide-icon lucide-search" />
				</div>
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="보컬 이름 또는 설명 검색..."
					class="w-full pl-10 {searchQuery.trim() ? 'pr-10' : 'pr-4'} py-1.5 bg-surface-2 border border-border-subtle border-[1px] rounded-md text-text-base placeholder-text-muted focus:outline-none focus:border-brand-pink focus:ring-0 transition-colors duration-200"
					aria-label="보컬 검색"
					id="vocal-search"
					autocomplete="off"
				/>
				{#if searchQuery.trim()}
					<button
						type="button"
						onclick={() => {
							searchQuery = '';
							const input = document.getElementById('vocal-search') as HTMLInputElement;
							input?.focus();
						}}
						class="search-clear-button absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center bg-transparent hover:bg-transparent focus:bg-transparent focus-visible:bg-transparent"
						aria-label="검색 초기화"
					>
						<X size={16} class="lucide-icon" />
					</button>
				{/if}
			</div>

			<!-- 정렬 (아랫줄) -->
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
				<div class="relative sort-dropdown">
					<button
						type="button"
						onclick={() => sortDropdownOpen = !sortDropdownOpen}
						aria-haspopup="listbox"
						aria-expanded={sortDropdownOpen}
						class="status-filter-btn flex items-center pl-10 pr-8 py-1.5 w-full bg-surface-2 rounded-[6px] text-text-base transition-all duration-200 cursor-pointer border border-border-subtle focus:outline-none focus:border-brand-pink"
					>
						<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<ArrowUpDown size={16} class="lucide-icon text-text-muted transition-colors duration-200" />
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

		<!-- 보컬 그리드 -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each filteredVocals as vocal}
				<div class="project-card bg-surface-2 rounded-lg border border-border-subtle p-5 transition-colors">
					<!-- 아바타와 이름 -->
					<div class="flex items-start gap-4 mb-4">
						<div class="w-14 h-14 rounded-full bg-gradient-to-br from-brand-pink to-purple-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
							{vocal.name.charAt(0)}
						</div>
						<div class="flex-1 min-w-0">
							<h3 class="text-lg font-semibold text-text-strong truncate">{vocal.name}</h3>
							<p class="text-sm text-text-muted mt-1 line-clamp-2">{vocal.description || '설명 없음'}</p>
						</div>
					</div>

					<!-- 통계 -->
					<div class="flex items-center gap-4 mb-4 text-sm">
						<div class="flex items-center gap-1.5 text-text-muted">
							<Link size={14} />
							<span>{vocal.linkedTracks.length}개 트랙</span>
						</div>
						<div class="text-text-muted">
							생성: {vocal.createdAt}
						</div>
					</div>

					<!-- 액션 -->
					<div class="flex items-center justify-end gap-2 pt-3 border-t border-border-subtle">
						<button type="button" class="btn-icon" aria-label="수정">
							<Edit2 size={16} />
						</button>
						<button
							type="button"
							class="btn-icon text-red-400 hover:text-red-500"
							onclick={() => deleteVocal(vocal.id)}
							aria-label="삭제"
						>
							<Trash2 size={16} />
						</button>
					</div>
				</div>
			{/each}

			{#if filteredVocals.length === 0}
				<div class="col-span-full py-16 text-center">
					{#if searchQuery}
						<div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-2 mb-4">
							<SearchX size={28} class="text-text-muted" />
						</div>
						<p class="text-text-base font-medium mb-2">검색 결과가 없습니다</p>
						<p class="text-text-muted text-sm mb-4">다른 검색어를 시도해보세요</p>
						<button
							type="button"
							onclick={() => searchQuery = ''}
							class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-pink border border-brand-pink rounded-lg hover:bg-brand-pink hover:text-white transition-colors"
						>
							<X size={14} />
							검색 초기화
						</button>
					{:else}
						<div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-2 mb-4">
							<Mic size={28} class="text-text-muted" />
						</div>
						<p class="text-text-base font-medium mb-2">등록된 보컬이 없습니다</p>
						<p class="text-text-muted text-sm mb-4">가상 보컬을 추가해보세요</p>
						<button
							type="button"
							onclick={() => showAddModal = true}
							class="inline-flex items-center gap-2 px-4 py-2 bg-brand-pink text-white text-sm font-medium rounded-lg hover:bg-brand-pink/90 transition-colors"
						>
							<Plus size={16} />
							보컬 추가하기
						</button>
					{/if}
				</div>
			{/if}
		</div>

		<!-- 통계 -->
		<div class="mt-6">
			<div class="flex flex-wrap items-center gap-4 text-sm">
				<span class="text-text-muted">
					총 <span class="font-medium text-text-base">{vocals.length}</span>개 보컬
				</span>
				<span class="text-border-subtle">|</span>
				<span class="text-text-muted">
					표시 중 <span class="font-medium text-text-base">{filteredVocals.length}</span>개
				</span>
			</div>
		</div>
	</SUNOTabs>
</div>

<!-- 보컬 추가 모달 -->
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
			class="bg-surface-1 rounded-lg border border-border-subtle w-full max-w-md"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			role="presentation"
		>
			<div class="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
				<h2 class="text-lg font-semibold text-text-strong">새 보컬 추가</h2>
				<button
					type="button"
					onclick={() => showAddModal = false}
					class="template-close-btn w-8 h-8 flex items-center justify-center rounded-md text-text-muted transition-colors border border-transparent"
					aria-label="닫기"
				>
					<X size={20} />
				</button>
			</div>

			<form onsubmit={(e) => { e.preventDefault(); addVocal(); }} class="p-6 space-y-4">
				<!-- 이름 -->
				<div>
					<label for="vocal-name" class="block text-sm font-medium text-text-strong mb-2">보컬 이름</label>
					<input
						type="text"
						id="vocal-name"
						bind:value={newVocal.name}
						class="w-full py-1.5 px-4 bg-surface-2 border border-border-subtle rounded-md text-text-base focus:outline-none focus:border-brand-pink transition-colors"
						placeholder="예: Luna, Sugar Rush Collective"
						required
					/>
				</div>

				<!-- 설명 -->
				<div>
					<label for="vocal-desc" class="block text-sm font-medium text-text-strong mb-2">설명</label>
					<textarea
						id="vocal-desc"
						bind:value={newVocal.description}
						class="w-full h-24 py-3 px-4 resize-none bg-surface-2 border border-border-subtle rounded-md text-text-base focus:outline-none focus:border-brand-pink transition-colors"
						placeholder="보컬 특성, 음색, 전문 분야 등"
					></textarea>
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
						class="px-6 py-2 bg-brand-pink text-white rounded-lg transition-colors font-medium hover:bg-brand-pink/90"
					>
						추가
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
