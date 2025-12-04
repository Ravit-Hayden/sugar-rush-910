<script lang="ts">
	import { Disc3, Plus, MoreVertical, Play, Edit, ArrowUpDown, Search, Filter } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import { getStatusColor, getStatusLabel } from '$lib/utils/status';

	let searchQuery = '';
	let selectedFilter = 'all';
	let selectedSort = 'latest';
	let sortDropdownOpen = false;
	let filterDropdownOpen = false;
	let selectedAlbumId: string | null = null;
	let albums = [
		{
			id: '1',
			title: 'Sugar Rush Vol.1',
			artist: 'Sugar Rush',
			year: 2024,
			status: 'published',
			tracks: 12,
			duration: '45:30',
			cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
			plays: 1250,
			likes: 89,
			created_at: '2024-09-15',
			release_date_kr: '2024-09-20',
			release_date_global: '2024-09-25',
			trackList: [
				{ id: '1', title: 'Sugar Rush', duration: '3:45' },
				{ id: '2', title: 'Sweet Dreams', duration: '4:12' },
				{ id: '3', title: 'Candy Land', duration: '3:58' },
				{ id: '4', title: 'Honey Moon', duration: '4:30' },
				{ id: '5', title: 'Sugar High', duration: '3:20' },
				{ id: '6', title: 'Sweet Escape', duration: '4:05' },
				{ id: '7', title: 'Candy Shop', duration: '3:50' },
				{ id: '8', title: 'Sugar Coated', duration: '4:15' },
				{ id: '9', title: 'Sweet Surprise', duration: '3:35' },
				{ id: '10', title: 'Candy Floss', duration: '4:00' },
				{ id: '11', title: 'Sugar Spice', duration: '3:42' },
				{ id: '12', title: 'Sweet Victory', duration: '4:18' }
			]
		},
		{
			id: '2',
			title: 'Summer Night',
			artist: 'Sugar Rush',
			year: 2024,
			status: 'draft',
			tracks: 1,
			duration: '3:45',
			cover: '/api/placeholder/300/300',
			plays: 890,
			likes: 45,
			created_at: '2024-09-20',
			trackList: [
				{ id: '1', title: 'Summer Night', duration: '3:45' }
			]
		},
		{
			id: '3',
			title: 'Demo Collection',
			artist: 'Various',
			year: 2024,
			status: 'archived',
			tracks: 8,
			duration: '28:15',
			cover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop',
			plays: 456,
			likes: 23,
			created_at: '2024-08-10'
		},
		{
			id: '4',
			title: 'Work in Progress',
			artist: 'Sugar Rush',
			year: 2024,
			status: 'editing',
			tracks: 5,
			duration: '18:20',
			cover: '/api/placeholder/300/300',
			plays: 0,
			likes: 0,
			created_at: '2024-10-01'
		},
		{
			id: '5',
			title: 'Revision Album',
			artist: 'Various',
			year: 2024,
			status: 'revision_requested',
			tracks: 3,
			duration: '12:10',
			cover: '/api/placeholder/300/300',
			plays: 0,
			likes: 0,
			created_at: '2024-10-05'
		},
		{
			id: '6',
			title: 'Pending Review Album',
			artist: 'Sugar Rush',
			year: 2024,
			status: 'pending_review',
			tracks: 10,
			duration: '35:45',
			cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop',
			plays: 0,
			likes: 0,
			created_at: '2024-10-10'
		},
		{
			id: '7',
			title: 'Under Review Album',
			artist: 'Various',
			year: 2024,
			status: 'under_review',
			tracks: 7,
			duration: '25:30',
			cover: '/api/placeholder/300/300',
			plays: 0,
			likes: 0,
			created_at: '2024-10-12'
		},
		{
			id: '8',
			title: 'Editing Complete Album',
			artist: 'Sugar Rush',
			year: 2024,
			status: 'editing_complete',
			tracks: 9,
			duration: '32:15',
			cover: '/api/placeholder/300/300',
			plays: 0,
			likes: 0,
			created_at: '2024-10-15'
		},
		{
			id: '9',
			title: 'Approved Album',
			artist: 'Various',
			year: 2024,
			status: 'approved',
			tracks: 11,
			duration: '40:20',
			cover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop',
			plays: 0,
			likes: 0,
			created_at: '2024-10-18'
		},
		{
			id: '10',
			title: 'Scheduled Release',
			artist: 'Sugar Rush',
			year: 2024,
			status: 'scheduled',
			tracks: 8,
			duration: '28:50',
			cover: '/api/placeholder/300/300',
			plays: 0,
			likes: 0,
			created_at: '2024-10-20',
			release_date_kr: '2024-11-01',
			release_date_global: '2024-11-05'
		},
		{
			id: '11',
			title: 'Paused Album',
			artist: 'Various',
			year: 2024,
			status: 'paused',
			tracks: 4,
			duration: '15:30',
			cover: '/api/placeholder/300/300',
			plays: 120,
			likes: 8,
			created_at: '2024-09-05'
		},
		{
			id: '12',
			title: 'Deleted Album',
			artist: 'Sugar Rush',
			year: 2024,
			status: 'deleted',
			tracks: 2,
			duration: '8:15',
			cover: '/api/placeholder/300/300',
			plays: 50,
			likes: 2,
			created_at: '2024-08-20'
		}
	];

	// 정렬 옵션
	const sortOptions = [
		{ value: 'latest', label: '최신순' },
		{ value: 'oldest', label: '오래된순' },
		{ value: 'popular_plays', label: '재생순' },
		{ value: 'popular_likes', label: '좋아요순' },
		{ value: 'title_asc', label: '제목순 (가나다)' },
		{ value: 'title_desc', label: '제목순 (역순)' }
	];

	// 필터링 및 정렬
	$: filteredAndSortedAlbums = (() => {
		// 1. 필터링
		let filtered = albums.filter(album => {
			const matchesSearch = album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
								 album.artist.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesFilter = selectedFilter === 'all' || album.status === selectedFilter;
			return matchesSearch && matchesFilter;
		});

		// 2. 정렬
		const sorted = [...filtered];
		switch (selectedSort) {
			case 'latest':
				sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
				break;
			case 'oldest':
				sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
				break;
			case 'popular_plays':
				sorted.sort((a, b) => b.plays - a.plays);
				break;
			case 'popular_likes':
				sorted.sort((a, b) => b.likes - a.likes);
				break;
			case 'title_asc':
				sorted.sort((a, b) => a.title.localeCompare(b.title, 'ko'));
				break;
			case 'title_desc':
				sorted.sort((a, b) => b.title.localeCompare(a.title, 'ko'));
				break;
		}

		return sorted;
	})();

	const filterOptions = [
		{ value: 'all', label: '모든 상태' },
		// 작곡/작사 작업
		{ value: 'draft', label: '초안', group: '작곡/작사 작업' },
		{ value: 'editing', label: '수정 중', group: '작곡/작사 작업' },
		{ value: 'revision_requested', label: '수정 요청', group: '작곡/작사 작업' },
		// 편집 작업
		{ value: 'pending_review', label: '검토 대기', group: '편집 작업' },
		{ value: 'under_review', label: '검토 중', group: '편집 작업' },
		{ value: 'editing_complete', label: '편집 완료', group: '편집 작업' },
		{ value: 'approved', label: '승인됨', group: '편집 작업' },
		// 발매 작업
		{ value: 'scheduled', label: '발매 예정', group: '발매 작업' },
		{ value: 'published', label: '발매됨', group: '발매 작업' },
		// 공통 상태
		{ value: 'paused', label: '일시정지', group: '공통 상태' },
		{ value: 'archived', label: '보관됨', group: '공통 상태' },
		{ value: 'deleted', label: '삭제됨', group: '공통 상태' }
	];

	function handleCreateAlbum() {
		// 새 앨범 생성 로직
		console.log('새 앨범 생성');
	}

	function toggleSortDropdown() {
		sortDropdownOpen = !sortDropdownOpen;
	}

	function selectSort(value: string) {
		selectedSort = value;
		sortDropdownOpen = false;
	}

	function toggleTrackList(albumId: string) {
		selectedAlbumId = selectedAlbumId === albumId ? null : albumId;
	}

	function handlePlayAlbum(albumId: string) {
		// 앨범 전체 재생 로직
		console.log('앨범 재생:', albumId);
	}

	function toggleFilterDropdown() {
		filterDropdownOpen = !filterDropdownOpen;
	}

	function selectFilterOption(value: string) {
		selectedFilter = value;
		filterDropdownOpen = false;
	}

	// 필터 옵션 그룹화
	$: groupedFilterOptions = (() => {
		const hasGroups = filterOptions.some(opt => opt.group);
		if (!hasGroups) return null;
		
		const groups: { [key: string]: typeof filterOptions } = {};
		const ungrouped: typeof filterOptions = [];
		
		filterOptions.forEach(opt => {
			if (opt.group) {
				if (!groups[opt.group]) {
					groups[opt.group] = [];
				}
				groups[opt.group].push(opt);
			} else {
				ungrouped.push(opt);
			}
		});
		
		return { groups, ungrouped };
	})();
</script>

<PageContent>
	<PageHeader 
		title="앨범" 
		description="음악 앨범을 관리하고 발매하세요."
		actions={[
			{
				icon: Plus,
				label: '새 앨범 만들기',
				onclick: handleCreateAlbum
			}
		]}
	/>

	<!-- 검색 및 필터 -->
	<div class="mb-8">
		<div class="flex flex-col sm:flex-row gap-4">
			<!-- 검색 입력 -->
			<div class="relative flex-1 group">
				<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
					<Search size={16} class="lucide-icon lucide-search" />
				</div>
				<input 
					type="text" 
					placeholder="앨범 또는 아티스트 검색..."
					bind:value={searchQuery}
					class="w-full pl-10 pr-4 py-1.5 bg-surface-1 border border-border-subtle border-[1px] rounded-md text-text-base placeholder-text-muted focus:outline-none focus:ring-0"
				/>
			</div>
			
			<!-- 필터 드롭다운 -->
			<div class="relative group filter-dropdown w-full sm:w-auto" data-open={filterDropdownOpen ? 'true' : 'false'}>
				<button
					type="button"
					aria-haspopup="listbox"
					aria-expanded={filterDropdownOpen}
					class="flex items-center pl-10 pr-8 py-1.5 w-full sm:w-auto sm:min-w-[140px] bg-surface-1 rounded-[6px] text-text-base transition-all duration-200 cursor-pointer border focus:outline-none"
					onclick={toggleFilterDropdown}
					tabindex="0"
				>
					<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<Filter size={16} class="lucide-icon lucide-filter transition-colors duration-200" />
					</div>
					<span class="flex-1 text-left truncate">
						{filterOptions.find(o => o.value === selectedFilter)?.label || '선택하세요'}
					</span>
					<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
						<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-text-base transition-colors duration-200">
							<polyline points="6,9 12,15 18,9"></polyline>
						</svg>
					</div>
				</button>
				{#if filterDropdownOpen}
					<ul role="listbox" class="absolute left-0 w-full mt-[6px] bg-surface-1 border rounded-[6px] z-10 border-border-subtle overflow-hidden shadow-lg">
						{#if groupedFilterOptions}
							{#if groupedFilterOptions.ungrouped.length > 0}
								{#each groupedFilterOptions.ungrouped as opt}
									<li
										role="option"
										aria-selected={selectedFilter === opt.value}
										tabindex="0"
										onclick={() => selectFilterOption(opt.value)}
										onkeydown={(e) => {
											if (e.key === 'Enter' || e.key === ' ') {
												e.preventDefault();
												selectFilterOption(opt.value);
											}
										}}
									>
										{opt.label}
									</li>
								{/each}
							{/if}
							{#each Object.entries(groupedFilterOptions.groups) as [groupName, options], i}
								<li class="filter-group-header {i === 0 && groupedFilterOptions.ungrouped.length === 0 ? 'first-group-header' : ''} {i > 0 || groupedFilterOptions.ungrouped.length > 0 ? 'has-top-border' : ''}">
									{groupName}
								</li>
								{#each options as opt}
									<li
										role="option"
										aria-selected={selectedFilter === opt.value}
										tabindex="0"
										onclick={() => selectFilterOption(opt.value)}
										onkeydown={(e) => {
											if (e.key === 'Enter' || e.key === ' ') {
												e.preventDefault();
												selectFilterOption(opt.value);
											}
										}}
									>
										{opt.label}
									</li>
								{/each}
							{/each}
						{:else}
							{#each filterOptions as opt}
								<li
									role="option"
									aria-selected={selectedFilter === opt.value}
									tabindex="0"
									onclick={() => selectFilterOption(opt.value)}
									onkeydown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											e.preventDefault();
											selectFilterOption(opt.value);
										}
									}}
								>
									{opt.label}
								</li>
							{/each}
						{/if}
					</ul>
				{/if}
			</div>
		
			<!-- 정렬 드롭다운 -->
			<div class="relative group sort-dropdown w-full sm:w-auto" data-open={sortDropdownOpen ? 'true' : 'false'}>
			<button
				type="button"
				aria-haspopup="listbox"
				aria-expanded={sortDropdownOpen}
				class="flex items-center justify-between pl-10 pr-8 py-1.5 w-full sm:w-[160px] bg-surface-1 rounded-[6px] text-text-base transition-all duration-200 cursor-pointer border focus:outline-none"
				onclick={toggleSortDropdown}
				tabindex="0"
			>
				<!-- 정렬 아이콘 -->
				<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
					<ArrowUpDown size={16} class="lucide-icon lucide-arrow-up-down transition-colors duration-200" />
				</div>
				
				<!-- 선택된 값 표시 -->
				<span class="flex-1 text-left truncate">
					{sortOptions.find(o => o.value === selectedSort)?.label || '정렬'}
				</span>
				
				<!-- 드롭다운 화살표 -->
				<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
					<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-text-base transition-colors duration-200">
						<polyline points="6,9 12,15 18,9"></polyline>
					</svg>
				</div>
			</button>
			
			<!-- 드롭다운 리스트 -->
			{#if sortDropdownOpen}
				<ul role="listbox" class="absolute left-0 w-full sm:w-[160px] mt-[6px] bg-surface-1 border rounded-[6px] z-10 border-border-subtle overflow-hidden shadow-lg">
					{#each sortOptions as opt}
						<li
							role="option"
							aria-selected={selectedSort === opt.value}
							tabindex="0"
							onclick={() => selectSort(opt.value)}
							onkeydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									selectSort(opt.value);
								}
							}}
						>
							{opt.label}
						</li>
					{/each}
				</ul>
			{/if}
		</div>
		</div>
	</div>

	<!-- 앨범 그리드 -->
	{#if filteredAndSortedAlbums.length > 0}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{#each filteredAndSortedAlbums as album (album.id)}
				<div class="album-card bg-surface-1 rounded-lg overflow-hidden hover:bg-surface-2 transition-colors duration-200 group border border-border-subtle">
					<!-- 앨범 커버 -->
					<div class="relative aspect-square bg-surface-2">
						<!-- 기본 이미지 (회색 배경 + 회색 로고) -->
						<div class="absolute inset-0 flex items-center justify-center bg-surface-2">
							<Disc3 size={48} class="text-text-muted opacity-30" />
						</div>
						<!-- 실제 이미지 (있을 경우) -->
						{#if album.cover && album.cover !== '/api/placeholder/300/300'}
							<img
								src={album.cover}
								alt={album.title}
								class="absolute inset-0 w-full h-full object-cover"
								onerror={(e: Event) => {
									const target = e.currentTarget as HTMLImageElement;
									target.style.display = 'none';
								}}
							/>
						{/if}
						<!-- 플레이 버튼 (호버 시) -->
						<div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
							<button 
								onclick={(e) => { e.stopPropagation(); handlePlayAlbum(album.id); }}
								class="play-button w-12 h-12 bg-brand-pink rounded-full flex items-center justify-center hover:bg-brand-pink/90 focus-visible:outline-2 focus-visible:outline-brand-pink focus-visible:outline-offset-2 transition-colors duration-200" 
								aria-label="재생"
							>
								<Play size={20} class="play-button-icon text-white" />
							</button>
						</div>
					</div>

					<!-- 앨범 정보 -->
					<div class="p-4">
						<div class="flex items-start justify-between gap-2 mb-0">
							<h3 class="font-semibold text-text-strong line-clamp-1 flex-1">{album.title}</h3>
							<span class="badge-base {getStatusColor(album.status)} flex-shrink-0 pr-0">
								{getStatusLabel(album.status)}
							</span>
						</div>
						<p class="text-sm text-text-muted mb-2">{album.artist} • {album.year}</p>
						
						<div class="text-xs text-text-muted mb-4 mt-4">
							<button 
								onclick={() => toggleTrackList(album.id)}
								class="hover:text-hover-cyan transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-brand-pink focus-visible:outline-offset-2 rounded"
							>
								{album.tracks}곡 • {album.duration}
							</button>
						</div>
						
						<!-- 트랙 목록 (클릭 시 표시) -->
						{#if selectedAlbumId === album.id && album.trackList && album.trackList.length > 0}
							<div class="mb-4 pt-3 border-t border-border-subtle">
								<div class="text-xs text-text-muted mb-2 font-medium">트랙 목록</div>
								<div class="space-y-1 max-h-48 overflow-y-auto">
									{#each album.trackList as track, index}
										<a 
											href="/tracks?album={album.id}&track={track.id}"
											class="flex items-center justify-between text-xs text-text-muted hover:text-hover-cyan transition-colors duration-200 px-2 py-1 rounded hover:bg-surface-2"
										>
											<span class="flex items-center gap-2">
												<span class="text-text-muted/60 w-4 text-right">{index + 1}</span>
												<span>{track.title}</span>
											</span>
											<span class="text-text-muted/60">{track.duration}</span>
										</a>
									{/each}
								</div>
							</div>
						{/if}

						<div class="flex items-center justify-between text-xs text-text-muted mb-4">
							<div class="flex flex-col gap-0.5">
								<div class="flex items-center gap-2">
									<span>좋아요</span>
									<span class="text-hover-cyan">{album.likes}</span>
								</div>
								<div class="flex items-center gap-2">
									<span>재생</span>
									<span class="text-hover-cyan">{album.plays.toLocaleString()}</span>
								</div>
							</div>
						</div>
						<div class="flex items-end justify-between text-xs text-text-muted">
							<div class="flex flex-col gap-0.5">
								<span class="leading-none">작업 생성: {album.created_at}</span>
								<span class="leading-none">국내 발매: {album.release_date_kr || '미정'}</span>
								<span class="leading-none">해외 발매: {album.release_date_global || '미정'}</span>
							</div>
							<div class="flex items-end -mr-4">
								<button class="w-8 h-8 inline-flex items-end justify-center rounded-md hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-brand-pink focus-visible:outline-offset-2 transition-colors duration-200 pb-0.5" aria-label="편집" title="편집">
									<Edit size={14} class="text-text-muted" />
								</button>
								<button class="w-8 h-8 inline-flex items-end justify-center rounded-md hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-brand-pink focus-visible:outline-offset-2 transition-colors duration-200 -ml-1 pb-0.5" aria-label="더보기" title="더보기">
									<MoreVertical size={14} class="text-text-muted" />
								</button>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<EmptyState 
			icon={Disc3}
			title="앨범을 찾을 수 없습니다"
			description={searchQuery ? '검색 조건에 맞는 앨범이 없습니다.' : '아직 앨범이 없습니다.'}
			actionLabel="첫 번째 앨범 만들기"
			onAction={handleCreateAlbum}
		/>
	{/if}
</PageContent>
