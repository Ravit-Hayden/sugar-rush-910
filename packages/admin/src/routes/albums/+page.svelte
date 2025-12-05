<script lang="ts">
	import { Disc3, Plus, Search, Filter, MoreVertical, Play, Pause, Edit, Trash2, ArrowUpDown } from 'lucide-svelte';

	let searchQuery = $state('');
	let selectedFilter = $state('all');
	let selectedSort = $state('latest');
	let sortDropdownOpen = $state(false);
	let filterDropdownOpen = $state(false);
	let selectedAlbumId = $state<string | null>(null);
	let imageErrorStates = $state(new Map<string, boolean>());
	let albums = [
		{
			id: '1',
			title: 'Sugar Rush Vol.1',
			artist: 'Sugar Rush',
			year: 2024,
			status: 'published',
			tracks: 12,
			duration: '45:30',
			cover: '/api/placeholder/300/300',
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
			cover: '/api/placeholder/300/300',
			plays: 456,
			likes: 23,
			created_at: '2024-08-10',
			trackList: [
				{ id: '1', title: 'Demo Track 1', duration: '3:30' },
				{ id: '2', title: 'Demo Track 2', duration: '3:45' },
				{ id: '3', title: 'Demo Track 3', duration: '3:20' },
				{ id: '4', title: 'Demo Track 4', duration: '4:00' },
				{ id: '5', title: 'Demo Track 5', duration: '3:15' },
				{ id: '6', title: 'Demo Track 6', duration: '3:50' },
				{ id: '7', title: 'Demo Track 7', duration: '3:25' },
				{ id: '8', title: 'Demo Track 8', duration: '3:10' }
			]
		}
	];

	// 정렬 옵션
	const sortOptions = [
		{ value: 'latest', label: '최신순' },
		{ value: 'oldest', label: '등록순' },
		{ value: 'popular_plays', label: '재생순' },
		{ value: 'popular_likes', label: '인기순' },
		{ value: 'title_asc', label: 'A-Z순' },
		{ value: 'title_desc', label: 'Z-A순' }
	];

	// 필터 옵션
	const filterOptions = [
		{ value: 'all', label: '모든 상태' },
		{ value: 'published', label: '발매됨' },
		{ value: 'draft', label: '초안' },
		{ value: 'archived', label: '보관됨' }
	];

	function getStatusColor(status: string) {
		switch (status) {
			case 'published': return 'badge-base text-brand-pink';
			case 'draft': return 'badge-base badge-medium-yellow';
			case 'archived': return 'badge-base text-text-muted';
			default: return 'badge-base text-text-muted';
		}
	}

	function getStatusLabel(status: string) {
		switch (status) {
			case 'published': return '발매됨';
			case 'draft': return '초안';
			case 'archived': return '보관됨';
			default: return '알 수 없음';
		}
	}

	// 검색 우선순위 계산 함수
	function getSearchPriority(album: typeof albums[0], query: string): number {
		if (!query) return 0;
		
		const title = album.title.toLowerCase();
		const artist = album.artist.toLowerCase();
		
		// 1. 제목으로 시작: 최우선 (우선순위 3)
		if (title.startsWith(query)) return 3;
		// 2. 아티스트로 시작: 두 번째 우선순위 (우선순위 2)
		if (artist.startsWith(query)) return 2;
		// 3. 제목에 포함: 세 번째 우선순위 (우선순위 1)
		if (title.includes(query)) return 1;
		// 4. 아티스트에 포함: 네 번째 우선순위 (우선순위 0)
		if (artist.includes(query)) return 0;
		
		return -1; // 매치되지 않음
	}

	// 검색어 하이라이트 함수
	function highlightSearchTerm(text: string, query: string): Array<{ text: string; isMatch: boolean }> {
		if (!query || query.trim() === '') {
			return [{ text, isMatch: false }];
		}
		
		const lowerText = text.toLowerCase();
		const lowerQuery = query.toLowerCase();
		const parts: Array<{ text: string; isMatch: boolean }> = [];
		let lastIndex = 0;
		
		let index = lowerText.indexOf(lowerQuery, lastIndex);
		while (index !== -1) {
			// 매치 전 텍스트
			if (index > lastIndex) {
				parts.push({ text: text.substring(lastIndex, index), isMatch: false });
			}
			// 매치된 텍스트
			parts.push({ text: text.substring(index, index + query.length), isMatch: true });
			lastIndex = index + query.length;
			index = lowerText.indexOf(lowerQuery, lastIndex);
		}
		
		// 남은 텍스트
		if (lastIndex < text.length) {
			parts.push({ text: text.substring(lastIndex), isMatch: false });
		}
		
		return parts.length > 0 ? parts : [{ text, isMatch: false }];
	}

	// 필터링 및 정렬
	const filteredAndSortedAlbums = $derived.by(() => {
		// 1. 필터링
		const query = searchQuery.trim().toLowerCase();
		let filtered = albums;
		
		// 검색어가 있으면 필터링
		if (query.length > 0) {
			filtered = albums.filter(album => {
				const titleMatch = album.title.toLowerCase().includes(query);
				const artistMatch = album.artist.toLowerCase().includes(query);
				return titleMatch || artistMatch;
			});
		}
		
		// 필터 적용
		if (selectedFilter !== 'all') {
			filtered = filtered.filter(album => album.status === selectedFilter);
		}

		// 2. 정렬 (검색 우선순위 + 선택된 정렬 기준)
		const sorted = [...filtered];
		sorted.sort((a, b) => {
			// 검색어가 있으면 우선순위를 먼저 고려
			if (query.length > 0) {
				const aPriority = getSearchPriority(a, query);
				const bPriority = getSearchPriority(b, query);
				
				// 우선순위가 다르면 우선순위로 정렬
				if (aPriority !== bPriority) {
					return bPriority - aPriority; // 높은 우선순위가 먼저
				}
				// 우선순위가 같으면 선택된 정렬 기준 적용
			}
			
			// 검색어가 없거나 우선순위가 같으면 선택된 정렬 기준 적용
			switch (selectedSort) {
				case 'latest':
					return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
				case 'oldest':
					return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
				case 'popular_plays':
					return b.plays - a.plays;
				case 'popular_likes':
					return b.likes - a.likes;
				case 'title_asc':
					return a.title.localeCompare(b.title, 'ko');
				case 'title_desc':
					return b.title.localeCompare(a.title, 'ko');
				default:
					return 0;
			}
		});

		return sorted;
	});

	// 트랙 목록 토글
	function toggleTrackList(albumId: string) {
		if (selectedAlbumId === albumId) {
			selectedAlbumId = null;
		} else {
			selectedAlbumId = albumId;
		}
	}

	// 외부 클릭 시 트랙 목록 닫기
	$effect(() => {
		if (selectedAlbumId === null) return;

		function handleClickOutside(event: MouseEvent) {
			const target = event.target as HTMLElement;
			// 앨범 카드 내부나 트랙 목록 오버레이를 클릭한 경우는 무시
			if (target.closest('.album-card') || target.closest('.track-list-overlay')) {
				return;
			}
			// 외부 클릭 시 트랙 목록 닫기
			selectedAlbumId = null;
		}

		// 이벤트 리스너 추가 (다음 틱에 실행하여 현재 클릭 이벤트와 충돌 방지)
		const timeoutId = setTimeout(() => {
			document.addEventListener('click', handleClickOutside, true);
		}, 0);

		return () => {
			clearTimeout(timeoutId);
			document.removeEventListener('click', handleClickOutside, true);
		};
	});

	// 앨범 클릭 핸들러
	function handleAlbumClick(albumId: string, albumTitle: string) {
		console.log('앨범 클릭:', albumId, albumTitle);
		alert(`앨범 상세 페이지로 이동: ${albumTitle} (ID: ${albumId})`);
	}

	// 트랙 클릭 핸들러
	function handleTrackClick(albumId: string, albumTitle: string, trackId: string, trackTitle: string) {
		console.log('트랙 클릭:', albumId, albumTitle, trackId, trackTitle);
		alert(`트랙 재생: ${trackTitle} (앨범: ${albumTitle})`);
	}

	// 편집 핸들러
	function handleEdit(albumId: string) {
		console.log('편집:', albumId);
		alert(`앨범 편집: ${albumId}`);
	}

	// 더보기 옵션 핸들러
	function handleMoreOptions(albumId: string) {
		console.log('더보기 옵션:', albumId);
		alert(`앨범 더보기 옵션: ${albumId}`);
	}

	// 새 앨범 만들기 핸들러
	function handleCreateAlbum() {
		console.log('새 앨범 만들기');
		alert('새 앨범 만들기');
	}

	// 정렬 옵션 선택
	function selectSort(value: string) {
		selectedSort = value;
		sortDropdownOpen = false;
	}

	// 필터 옵션 선택
	function selectFilter(value: string) {
		selectedFilter = value;
		filterDropdownOpen = false;
	}
</script>

<div class="pt-0 pb-6">
	<div class="max-w-7xl mx-auto">
		<!-- 헤더 -->
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
			<div>
				<h1 class="text-3xl font-bold text-text-strong mb-2">앨범 관리</h1>
				<p class="text-text-muted">음악 앨범을 관리하고 발매하세요.</p>
			</div>
			<button 
				onclick={handleCreateAlbum}
				class="inline-flex items-center gap-2 px-4 py-2 bg-brand-pink text-white rounded-md hover:bg-brand-pink/90 transition-colors"
			>
				<Plus size={16} />
				새 앨범 만들기
			</button>
		</div>

		<!-- 검색 및 필터/정렬 -->
		<div class="flex flex-col sm:flex-row gap-4 mb-8">
			<!-- 검색 -->
			<div class="flex-1 relative">
				<Search size={16} class="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
				<input 
					type="text" 
					placeholder="앨범 또는 아티스트 검색..."
					value={searchQuery}
					oninput={(e) => searchQuery = (e.target as HTMLInputElement).value}
					class="w-full pl-10 pr-4 py-1.5 bg-surface-1 border border-border-subtle border-[1px] rounded-md text-text-base placeholder-text-muted focus:outline-none focus:border-brand-pink focus:ring-0 transition-colors duration-200"
					aria-label="앨범 또는 아티스트 검색"
					autocomplete="off"
				/>
			</div>

			<!-- 필터 드롭다운 -->
			<div class="filter-dropdown relative" data-open={filterDropdownOpen}>
				<button
					onclick={() => { filterDropdownOpen = !filterDropdownOpen; }}
					class="inline-flex items-center gap-2 px-4 py-1.5 bg-surface-1 border border-border-subtle rounded-md text-text-base hover:bg-surface-2 focus-visible:border-brand-pink transition-colors duration-200"
					aria-haspopup="true"
					aria-expanded={filterDropdownOpen}
					aria-label="필터 선택"
				>
					<Filter size={16} />
					<span>{filterOptions.find(opt => opt.value === selectedFilter)?.label || '필터'}</span>
				</button>
				{#if filterDropdownOpen}
					<div class="absolute right-0 mt-1 w-40 bg-surface-1 border border-border-subtle rounded-md shadow-lg z-50">
						{#each filterOptions as option}
							<button
								onclick={() => selectFilter(option.value)}
								class="w-full text-left px-4 py-2 text-sm text-text-base hover:bg-surface-2 hover:text-hover-cyan focus:bg-surface-2 focus:text-brand-pink focus:outline-none transition-colors duration-200 {selectedFilter === option.value ? 'text-brand-pink font-medium' : ''}"
								role="option"
								aria-selected={selectedFilter === option.value}
							>
								{option.label}
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<!-- 정렬 드롭다운 -->
			<div class="sort-dropdown relative" data-open={sortDropdownOpen}>
				<button
					onclick={() => { sortDropdownOpen = !sortDropdownOpen; }}
					class="inline-flex items-center gap-2 px-4 py-1.5 bg-surface-1 border border-border-subtle rounded-md text-text-base hover:bg-surface-2 focus-visible:border-brand-pink transition-colors duration-200"
					aria-haspopup="true"
					aria-expanded={sortDropdownOpen}
					aria-label="정렬 선택"
				>
					<ArrowUpDown size={16} />
					<span>{sortOptions.find(opt => opt.value === selectedSort)?.label || '정렬'}</span>
				</button>
				{#if sortDropdownOpen}
					<div class="absolute right-0 mt-1 w-40 bg-surface-1 border border-border-subtle rounded-md shadow-lg z-50">
						{#each sortOptions as option}
							<button
								onclick={() => selectSort(option.value)}
								class="w-full text-left px-4 py-2 text-sm text-text-base hover:bg-surface-2 hover:text-hover-cyan focus:bg-surface-2 focus:text-brand-pink focus:outline-none transition-colors duration-200 {selectedSort === option.value ? 'text-brand-pink font-medium' : ''}"
								role="option"
								aria-selected={selectedSort === option.value}
							>
								{option.label}
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		<!-- 검색 결과 카운트 -->
		{#if searchQuery.trim()}
			<div class="mb-4 text-sm text-text-muted" aria-live="polite" aria-atomic="true">
				검색 결과: <span class="text-hover-cyan font-medium">{filteredAndSortedAlbums.length}</span>개
			</div>
		{/if}

		<!-- 앨범 그리드 -->
		{#if filteredAndSortedAlbums.length > 0}
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{#each filteredAndSortedAlbums as album (album.id)}
					<div
						onclick={() => handleAlbumClick(album.id, album.title)}
						class="album-card bg-surface-1 rounded-lg hover:bg-surface-2 transition-colors duration-200 group border border-border-subtle cursor-pointer focus-visible:border-brand-pink"
						role="button"
						tabindex="0"
						aria-label="{album.title} 앨범 상세 보기"
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								handleAlbumClick(album.id, album.title);
							}
						}}
					>
						<!-- 앨범 커버 -->
						<div class="relative aspect-square bg-surface-2 overflow-hidden rounded-t-lg">
							<!-- 기본 이미지 (회색 배경 + 회색 로고) -->
							<div class="absolute inset-0 flex items-center justify-center bg-surface-2 rounded-t-lg {imageErrorStates.get(album.id) ? '' : (album.cover && album.cover !== '/api/placeholder/300/300' ? 'hidden' : '')}">
								<Disc3 size={48} class="text-text-muted opacity-30" />
							</div>
							<!-- 실제 이미지 (있을 경우) -->
							{#if album.cover && album.cover !== '/api/placeholder/300/300' && !imageErrorStates.get(album.id)}
								<img
									src={album.cover}
									alt="{album.title} 앨범 커버"
									loading="lazy"
									class="absolute inset-0 w-full h-full object-cover rounded-t-lg"
									onerror={(e: Event) => {
										const target = e.currentTarget as HTMLImageElement;
										imageErrorStates.set(album.id, true);
										target.style.display = 'none';
									}}
								/>
							{/if}
							<!-- 플레이 버튼 (호버 시) -->
							<div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
								<button 
									onclick={(e) => { e.preventDefault(); e.stopPropagation(); handleAlbumClick(album.id, album.title); }}
									class="w-12 h-12 bg-brand-pink rounded-full flex items-center justify-center hover:bg-brand-pink/90 transition-colors"
									aria-label="{album.title} 재생"
								>
									<Play size={20} class="text-white ml-1" />
								</button>
							</div>
							<!-- 상태 배지 -->
							<div class="absolute top-2 right-2">
								<span class="badge-base {getStatusColor(album.status)} flex-shrink-0 pr-0">
									{getStatusLabel(album.status)}
								</span>
							</div>
						</div>

						<!-- 앨범 정보 -->
						<div class="p-4 relative">
							<div class="flex items-start justify-between gap-2 mb-0">
								<h3 class="font-semibold text-text-strong line-clamp-1 flex-1">
									{#if searchQuery.trim()}
										{@const titleParts = highlightSearchTerm(album.title, searchQuery.trim())}
										{#each titleParts as part}
											{#if part.isMatch}
												<span class="text-brand-pink">{part.text}</span>
											{:else}
												{part.text}
											{/if}
										{/each}
									{:else}
										{album.title}
									{/if}
								</h3>
								<span class="badge-base {getStatusColor(album.status)} flex-shrink-0 pr-0">
									{getStatusLabel(album.status)}
								</span>
							</div>
							<p class="text-sm text-text-muted mb-2">
								{#if searchQuery.trim()}
									{@const artistParts = highlightSearchTerm(album.artist, searchQuery.trim())}
									{#each artistParts as part}
										{#if part.isMatch}
											<span class="text-hover-cyan">{part.text}</span>
										{:else}
											{part.text}
										{/if}
									{/each}
								{:else}
									{album.artist}
								{/if}
								<span class="text-text-muted"> • {album.year}</span>
							</p>
							
							<div class="text-xs text-text-muted mb-4 mt-4 relative">
								<button 
									onclick={(e) => { e.preventDefault(); e.stopPropagation(); toggleTrackList(album.id); }}
									onkeydown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											e.preventDefault();
											e.stopPropagation();
											toggleTrackList(album.id);
										}
									}}
									onblur={() => {}}
									class="track-toggle-btn hover:text-hover-cyan transition-colors duration-200 rounded cursor-pointer"
									aria-label="트랙 목록 {selectedAlbumId === album.id ? '숨기기' : '보기'}"
									aria-expanded={selectedAlbumId === album.id}
									tabindex="0"
								>
									{album.tracks}곡 • {album.duration}
									{#if album.trackList && album.trackList.length > 0}
										<span class="ml-1 text-[10px] opacity-60">
											{selectedAlbumId === album.id ? '▼' : '▶'}
										</span>
									{/if}
								</button>
								
								<!-- 트랙 목록 (오버레이로 표시) -->
								{#if selectedAlbumId === album.id && album.trackList && album.trackList.length > 0}
									<div class="track-list-overlay absolute left-0 right-0 top-full mt-1 bg-surface-1 border border-border-subtle rounded-lg shadow-xl z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
									<div class="p-3">
										<div class="text-xs text-text-muted mb-2 font-medium">트랙 목록 ({album.trackList.length}곡)</div>
										<div class="space-y-1 max-h-48 overflow-y-auto track-list-scroll pr-1">
											{#each album.trackList as track, index}
												<button
													type="button"
													onclick={(e) => { 
														e.preventDefault(); 
														e.stopPropagation(); 
														handleTrackClick(album.id, album.title, track.id, track.title);
													}}
													onkeydown={(e) => {
														if (e.key === 'Enter' || e.key === ' ') {
															e.preventDefault();
															e.stopPropagation();
															handleTrackClick(album.id, album.title, track.id, track.title);
														}
													}}
													class="track-item w-full flex items-center justify-between text-xs text-text-muted transition-colors duration-200 px-2 py-1.5 rounded group/track text-left cursor-pointer"
													aria-label="{track.title} 트랙 재생"
													tabindex="0"
												>
													<span class="flex items-center gap-2">
														<span class="track-number text-text-muted/60 w-4 text-right font-medium group-hover/track:text-hover-cyan transition-colors">{index + 1}</span>
														<span class="track-title group-hover/track:font-medium transition-all">{track.title}</span>
													</span>
													<span class="track-duration text-text-muted/60 group-hover/track:text-text-muted transition-colors">{track.duration}</span>
												</button>
											{/each}
										</div>
								</div>
							</div>
							{/if}
						</div>
						
						{#if album.trackList && album.trackList.length === 0}
							<div class="text-xs text-text-muted/60 mb-4 italic">트랙 정보 없음</div>
						{/if}

							<div class="flex items-center justify-between text-xs text-text-muted mb-4">
								<div class="flex flex-col gap-0.5">
									<div class="flex items-center gap-2">
										<span>좋아요</span>
										<span class="text-hover-cyan">{album.likes || 0}</span>
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
									<button 
										onclick={(e) => { e.preventDefault(); e.stopPropagation(); handleEdit(album.id); }}
										class="w-8 h-8 inline-flex items-end justify-center rounded-md hover:bg-surface-2 focus-visible:bg-surface-2 transition-colors duration-200 pb-0.5" 
										aria-label="편집" 
										title="편집"
									>
										<Edit size={14} class="text-text-muted" />
									</button>
									<button 
										onclick={(e) => { e.preventDefault(); e.stopPropagation(); handleMoreOptions(album.id); }}
										class="w-8 h-8 inline-flex items-end justify-center rounded-md hover:bg-surface-2 focus-visible:bg-surface-2 transition-colors duration-200 -ml-1 pb-0.5" 
										aria-label="더보기" 
										title="더보기"
									>
										<MoreVertical size={14} class="text-text-muted" />
									</button>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<!-- 빈 상태 -->
			<div class="text-center py-12">
				<Disc3 size={48} class="text-text-muted mx-auto mb-4" />
				<h3 class="text-lg font-semibold text-text-strong mb-2">앨범을 찾을 수 없습니다</h3>
				<p class="text-text-muted mb-4">
					{searchQuery ? '검색 조건에 맞는 앨범이 없습니다.' : '아직 앨범이 없습니다.'}
				</p>
				<button 
					onclick={handleCreateAlbum}
					class="inline-flex items-center gap-2 px-4 py-2 bg-brand-pink text-white rounded-md hover:bg-brand-pink/90 transition-colors"
				>
					<Plus size={16} />
					첫 번째 앨범 만들기
				</button>
			</div>
		{/if}
	</div>
</div>
