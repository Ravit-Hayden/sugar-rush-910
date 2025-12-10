<script lang="ts">
	import { goto } from '$app/navigation';
	import { Music, Plus, Play, ChevronRight, ChevronLeft, Search, Filter, ArrowUpDown, ChevronDown, MoreVertical, Download, FileAudio, UserPlus, Link, Trash2 } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import { getStatusColor, getStatusLabel } from '$lib/utils/status';

	let searchQuery = $state('');
	let selectedGenre = $state('all');
	let selectedStatus = $state('all');
	let selectedSort = $state('latest');
	let sortDropdownOpen = $state(false);
	let genreDropdownOpen = $state(false);
	let statusDropdownOpen = $state(false);
	let moreMenuOpenId = $state<string | null>(null);
	let tracks = [
		// 1. 작곡가/작사가 작업 (노란색 #FFD700)
		{
			id: '1',
			title: 'Demo Track',
			artist: 'Various',
			album: 'Demo Collection',
			genre: 'Rock',
			duration: '4:12',
			status: 'draft',
			plays: 456,
			likes: 23,
			fileSize: '9.1MB'
		},
		{
			id: '2',
			title: 'Evening Breeze',
			artist: 'Various',
			album: 'Demo Collection',
			genre: 'Classical',
			duration: '6:15',
			status: 'editing',
			plays: 123,
			likes: 8,
			fileSize: '11.2MB'
		},
		{
			id: '3',
			title: 'Midnight Drive',
			artist: 'Sugar Rush',
			album: 'Sugar Rush Vol.1',
			genre: 'Electronic',
			duration: '4:05',
			status: 'revision_requested',
			plays: 678,
			likes: 45,
			fileSize: '8.9MB'
		},
		// 2. 편집자 작업 (시안/블루 #00DDFF, #45ADFF)
		{
			id: '4',
			title: 'Morning Light',
			artist: 'Sugar Rush',
			album: 'Sugar Rush Vol.2',
			genre: 'Jazz',
			duration: '5:20',
			status: 'pending_review',
			plays: 234,
			likes: 12,
			fileSize: '10.5MB'
		},
		{
			id: '5',
			title: 'City Lights',
			artist: 'Sugar Rush',
			album: 'Sugar Rush Vol.2',
			genre: 'Electronic',
			duration: '4:30',
			status: 'under_review',
			plays: 345,
			likes: 25,
			fileSize: '9.8MB'
		},
		{
			id: '6',
			title: 'Ocean Wave',
			artist: 'Sugar Rush',
			album: 'Sugar Rush Vol.1',
			genre: 'Pop',
			duration: '3:55',
			status: 'editing_complete',
			plays: 567,
			likes: 34,
			fileSize: '8.5MB'
		},
		{
			id: '7',
			title: 'Mountain Peak',
			artist: 'Various',
			album: 'Demo Collection',
			genre: 'Rock',
			duration: '5:45',
			status: 'approved',
			plays: 890,
			likes: 56,
			fileSize: '12.1MB'
		},
		// 3. 발매업체 작업 (보라색 #D400FF → 녹색 #00FF2E)
		{
			id: '8',
			title: 'Summer Night',
			artist: 'Sugar Rush',
			album: 'Summer Night',
			genre: 'Pop',
			duration: '3:30',
			status: 'scheduled',
			plays: 890,
			likes: 67,
			fileSize: '7.8MB'
		},
		{
			id: '9',
			title: 'Sugar Rush',
			artist: 'Sugar Rush',
			album: 'Sugar Rush Vol.1',
			genre: 'Electronic',
			duration: '3:45',
			status: 'published',
			plays: 1250,
			likes: 89,
			fileSize: '8.2MB'
		},
		{
			id: '10',
			title: 'Desert Storm',
			artist: 'Sugar Rush',
			album: 'Sugar Rush Vol.2',
			genre: 'Electronic',
			duration: '4:18',
			status: 'paused',
			plays: 0,
			likes: 0,
			fileSize: '9.3MB'
		},
		{
			id: '11',
			title: 'Morning Star',
			artist: 'Various',
			album: 'Demo Collection',
			genre: 'Jazz',
			duration: '5:00',
			status: 'archived',
			plays: 234,
			likes: 15,
			fileSize: '10.1MB'
		},
		// 4. 삭제됨 (레드 #FF1900) - 전체 단계 공통
		{
			id: '12',
			title: 'Deleted Track',
			artist: 'Sugar Rush',
			album: 'Sugar Rush Vol.2',
			genre: 'Electronic',
			duration: '3:20',
			status: 'deleted',
			plays: 0,
			likes: 0,
			fileSize: '8.0MB'
		},
		// 추가 샘플 데이터 (2페이지 테스트용)
		{
			id: '13',
			title: 'Starlight Dreams',
			artist: 'Sugar Rush',
			album: 'Sugar Rush Vol.1',
			genre: 'Pop',
			duration: '3:52',
			status: 'published',
			plays: 1120,
			likes: 78,
			fileSize: '8.5MB'
		},
		{
			id: '14',
			title: 'Neon Nights',
			artist: 'Various',
			album: 'Demo Collection',
			genre: 'Electronic',
			duration: '4:25',
			status: 'draft',
			plays: 234,
			likes: 12,
			fileSize: '9.2MB'
		},
		{
			id: '15',
			title: 'Golden Hour',
			artist: 'Sugar Rush',
			album: 'Sugar Rush Vol.2',
			genre: 'Jazz',
			duration: '5:10',
			status: 'editing',
			plays: 456,
			likes: 28,
			fileSize: '10.8MB'
		},
		{
			id: '16',
			title: 'Electric Pulse',
			artist: 'Sugar Rush',
			album: 'Sugar Rush Vol.1',
			genre: 'Electronic',
			duration: '3:38',
			status: 'pending_review',
			plays: 567,
			likes: 35,
			fileSize: '8.7MB'
		},
		{
			id: '17',
			title: 'Midnight Serenade',
			artist: 'Various',
			album: 'Demo Collection',
			genre: 'Classical',
			duration: '6:45',
			status: 'under_review',
			plays: 345,
			likes: 19,
			fileSize: '12.3MB'
		},
		{
			id: '18',
			title: 'Sunset Boulevard',
			artist: 'Sugar Rush',
			album: 'Sugar Rush Vol.2',
			genre: 'Rock',
			duration: '4:50',
			status: 'editing_complete',
			plays: 678,
			likes: 42,
			fileSize: '9.5MB'
		},
		{
			id: '19',
			title: 'Cosmic Dance',
			artist: 'Sugar Rush',
			album: 'Sugar Rush Vol.1',
			genre: 'Electronic',
			duration: '4:15',
			status: 'approved',
			plays: 890,
			likes: 56,
			fileSize: '8.9MB'
		},
		{
			id: '20',
			title: 'Rainbow Bridge',
			artist: 'Various',
			album: 'Demo Collection',
			genre: 'Pop',
			duration: '3:28',
			status: 'scheduled',
			plays: 0,
			likes: 0,
			fileSize: '7.5MB'
		}
	];

	// 장르 리스트 (43개 전체, A-Z 정렬)
	const GENRES = [
		'Acoustic', 'Afrobeats', 'Alternative', 'Ambient', 'Anime', 'Ballad', 'Blues', 'Classical', 
		'Country', 'Dance', 'Disco', 'Drum & Bass', 'Dubstep', 'EDM', 'Electronic', 'Experimental', 
		'Folk', 'Funk', 'Game', 'Garage', 'Gospel', 'Grime', 'Hip-Hop', 'House', 'Indie', 
		'Instrumental', 'Jazz', 'J-Pop', 'K-Pop', 'Latin', 'Lo-Fi', 'Metal', 'New Age', 'OST', 
		'Pop', 'Punk', 'R&B', 'Reggae', 'Rock', 'Soul', 'Soundtrack', 'Synthwave', 'Techno', 
		'Trap', 'Trance', 'World'
	];
	
	const genreFilterOptions = [
		{ value: 'all', label: '모든 장르' },
		...GENRES.map(genre => ({ value: genre, label: genre }))
	];

	// 상태 필터 옵션
	const statusFilterOptions = [
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

	// 필터 옵션 그룹화
	const groupedStatusFilterOptions = $derived.by(() => {
		const hasGroups = statusFilterOptions.some(opt => opt.group);
		if (!hasGroups) return null;
		
		const groups: { [key: string]: typeof statusFilterOptions } = {};
		const ungrouped: typeof statusFilterOptions = [];
		
		statusFilterOptions.forEach(opt => {
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
	});

	// 정렬 옵션
	const sortOptions = [
		{ value: 'latest', label: '최신순' },
		{ value: 'oldest', label: '등록순' },
		{ value: 'popular_plays', label: '재생순' },
		{ value: 'popular_likes', label: '인기순' },
		{ value: 'title_asc', label: 'A-Z순' },
		{ value: 'title_desc', label: 'Z-A순' }
	];

	// 검색 우선순위 계산 함수
	function getSearchPriority(track: typeof tracks[0], query: string): number {
		if (!query) return 0;
		
		const title = track.title.toLowerCase();
		const artist = track.artist.toLowerCase();
		
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
	const filteredAndSortedTracks = $derived.by(() => {
		// 1. 필터링
		const query = searchQuery.trim().toLowerCase();
		let filtered = tracks;
		
		// 검색어가 있으면 필터링
		if (query.length > 0) {
			filtered = tracks.filter(track => {
				const titleMatch = track.title.toLowerCase().includes(query);
				const artistMatch = track.artist.toLowerCase().includes(query);
				const albumMatch = track.album.toLowerCase().includes(query);
				return titleMatch || artistMatch || albumMatch;
			});
		}
		
		// 장르 필터 적용
		if (selectedGenre !== 'all') {
			filtered = filtered.filter(track => track.genre === selectedGenre);
		}
		
		// 상태 필터 적용
		if (selectedStatus !== 'all') {
			filtered = filtered.filter(track => track.status === selectedStatus);
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
					// ID 기준 내림차순 (최신순)
					return parseInt(b.id) - parseInt(a.id);
				case 'oldest':
					// ID 기준 오름차순 (등록순)
					return parseInt(a.id) - parseInt(b.id);
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

	// 페이지네이션 상태
	let currentPage = $state(1);
	const itemsPerPage = 10;
	const totalPages = $derived(Math.ceil(filteredAndSortedTracks.length / itemsPerPage));
	const paginatedTracks = $derived.by(() => {
		const start = (currentPage - 1) * itemsPerPage;
		const end = start + itemsPerPage;
		return filteredAndSortedTracks.slice(start, end);
	});

	// 페이지 변경 시 상단으로 스크롤
	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	// 필터/검색 변경 시 첫 페이지로 리셋
	$effect(() => {
		searchQuery; // 감시
		selectedGenre; // 감시
		selectedStatus; // 감시
		selectedSort; // 감시
		currentPage = 1;
	});

	function toggleSortDropdown() {
		sortDropdownOpen = !sortDropdownOpen;
	}

	function selectSort(value: string, event?: MouseEvent | KeyboardEvent) {
		selectedSort = value;
		// 클릭한 항목에 포커스 효과를 보여주기 위해 약간의 지연 후 드롭다운 닫기
		if (event && event.currentTarget) {
			(event.currentTarget as HTMLElement).focus();
		}
		setTimeout(() => {
			sortDropdownOpen = false;
			const button = document.querySelector('.sort-dropdown button') as HTMLButtonElement;
			if (button) {
				button.focus();
			}
		}, 150);
	}

	function toggleGenreDropdown() {
		genreDropdownOpen = !genreDropdownOpen;
	}

	function selectGenreOption(value: string, event?: MouseEvent | KeyboardEvent) {
		selectedGenre = value;
		// 클릭한 항목에 포커스 효과를 보여주기 위해 약간의 지연 후 드롭다운 닫기
		if (event && event.currentTarget) {
			(event.currentTarget as HTMLElement).focus();
		}
		setTimeout(() => {
			genreDropdownOpen = false;
			const button = document.querySelector('.genre-filter-dropdown button') as HTMLButtonElement;
			if (button) {
				button.focus();
			}
		}, 150);
	}

	function toggleStatusDropdown() {
		statusDropdownOpen = !statusDropdownOpen;
	}

	function selectStatusOption(value: string, event?: MouseEvent | KeyboardEvent) {
		selectedStatus = value;
		// 클릭한 항목에 포커스 효과를 보여주기 위해 약간의 지연 후 드롭다운 닫기
		if (event && event.currentTarget) {
			(event.currentTarget as HTMLElement).focus();
		}
		setTimeout(() => {
			statusDropdownOpen = false;
			const button = document.querySelector('.status-filter-dropdown button') as HTMLButtonElement;
			if (button) {
				button.focus();
			}
		}, 150);
	}

	function handleCreateTrack() {
		goto('/tracks/new');
	}

	// 더보기 메뉴 토글
	function toggleMoreMenu(trackId: string) {
		moreMenuOpenId = moreMenuOpenId === trackId ? null : trackId;
	}

	// 더보기 메뉴 핸들러
	function handleDownloadAudio(trackId: string) {
		// 오디오 다운로드 로직 (추후 구현)
		console.log('오디오 다운로드:', trackId);
		moreMenuOpenId = null;
	}

	function handleDownloadStems(trackId: string) {
		// 스템 다운로드 로직 (추후 구현)
		console.log('스템 다운로드:', trackId);
		moreMenuOpenId = null;
	}

	function handleAssignMember(trackId: string) {
		// 멤버 배정 로직 (추후 구현)
		console.log('멤버 배정:', trackId);
		moreMenuOpenId = null;
	}

	function handleCopyShareLink(trackId: string) {
		// 공유 링크 복사 로직
		const url = `${window.location.origin}/tracks/${trackId}`;
		navigator.clipboard.writeText(url).then(() => {
			// 성공 알림 (추후 구현)
			console.log('공유 링크 복사됨:', url);
		}).catch(() => {
			// 실패 알림 (추후 구현)
			console.error('공유 링크 복사 실패');
		});
		moreMenuOpenId = null;
	}

	function handleDeleteTrack(trackId: string) {
		// 삭제 확인 및 로직 (추후 구현)
		if (confirm('정말 이 트랙을 삭제하시겠습니까?')) {
			console.log('삭제:', trackId);
			moreMenuOpenId = null;
		}
	}

	// 외부 클릭 시 더보기 메뉴 닫기
	$effect(() => {
		if (moreMenuOpenId === null) return;

		function handleClickOutside(event: MouseEvent) {
			const target = event.target as HTMLElement;
			if (!target.closest('.more-menu-dropdown')) {
				moreMenuOpenId = null;
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

	// Escape 키로 더보기 메뉴 닫기
	$effect(() => {
		if (moreMenuOpenId === null) return;

		function handleEscape(e: KeyboardEvent) {
			if (e.key === 'Escape') {
				moreMenuOpenId = null;
			}
		}

		document.addEventListener('keydown', handleEscape);
		return () => {
			document.removeEventListener('keydown', handleEscape);
		};
	});

	// 외부 클릭 시 장르 필터 드롭다운 닫기
	$effect(() => {
		if (!genreDropdownOpen) return;

		function handleClickOutside(event: MouseEvent) {
			const target = event.target as HTMLElement;
			if (!target.closest('.genre-filter-dropdown')) {
				genreDropdownOpen = false;
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

	// 외부 클릭 시 상태 필터 드롭다운 닫기
	$effect(() => {
		if (!statusDropdownOpen) return;

		function handleClickOutside(event: MouseEvent) {
			const target = event.target as HTMLElement;
			if (!target.closest('.status-filter-dropdown')) {
				statusDropdownOpen = false;
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

	// 외부 클릭 시 정렬 드롭다운 닫기
	$effect(() => {
		if (!sortDropdownOpen) return;

		function handleClickOutside(event: MouseEvent) {
			const target = event.target as HTMLElement;
			if (!target.closest('.sort-dropdown')) {
				sortDropdownOpen = false;
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

	// Escape 키로 드롭다운 닫기
	$effect(() => {
		function handleEscape(e: KeyboardEvent) {
			if (e.key === 'Escape') {
				genreDropdownOpen = false;
				statusDropdownOpen = false;
				sortDropdownOpen = false;
			}
		}

		document.addEventListener('keydown', handleEscape);
		return () => {
			document.removeEventListener('keydown', handleEscape);
		};
	});

</script>
<PageContent className="min-h-screen overflow-visible" padding="pt-0 pb-64">
	<PageHeader 
		title="트랙" 
		description="음악 트랙을 관리하고 분석하세요."
		actions={[
			{
				icon: Plus,
				label: '새 트랙 만들기',
				href: '/tracks/new'
			}
		]}
	/>

	<!-- 검색 및 필터 -->
	<div class="mb-8 relative overflow-visible">
		<div class="flex flex-col sm:flex-row gap-4 flex-wrap">
			<!-- 검색 입력 -->
			<div class="relative flex-1 group min-w-0">
				<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
					<Search size={16} class="lucide-icon lucide-search" />
				</div>
				<input 
					type="text" 
					placeholder="트랙, 아티스트 또는 앨범 검색..."
					value={searchQuery}
					oninput={(e) => {
						const value = (e.currentTarget as HTMLInputElement).value;
						searchQuery = value;
					}}
					onkeyup={(e) => {
						const value = (e.currentTarget as HTMLInputElement).value;
						searchQuery = value;
					}}
					class="w-full pl-10 pr-4 py-1.5 bg-surface-1 border border-border-subtle border-[1px] rounded-md text-text-base placeholder-text-muted focus:outline-none focus:border-brand-pink focus:ring-0 transition-colors duration-200"
					aria-label="트랙, 아티스트 또는 앨범 검색"
					id="track-search"
					autocomplete="off"
				/>
			</div>
			
			<!-- 장르 필터 드롭다운 -->
			<div class="relative group genre-filter-dropdown filter-dropdown w-full sm:w-auto overflow-visible" data-open={genreDropdownOpen ? 'true' : 'false'}>
				<button
					type="button"
					aria-haspopup="listbox"
					aria-expanded={genreDropdownOpen}
					class="flex items-center pl-10 pr-8 py-1.5 w-full sm:w-auto sm:min-w-[140px] bg-surface-1 rounded-[6px] text-text-base transition-all duration-200 cursor-pointer border focus:outline-none"
					onclick={toggleGenreDropdown}
					tabindex="0"
				>
					<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<Filter size={16} class="lucide-icon lucide-filter transition-colors duration-200" />
					</div>
					<span class="flex-1 text-left truncate">
						{genreFilterOptions.find(o => o.value === selectedGenre)?.label || '모든 장르'}
					</span>
					<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
						<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-text-base transition-colors duration-200">
							<polyline points="6,9 12,15 18,9"></polyline>
						</svg>
					</div>
				</button>
				{#if genreDropdownOpen}
					<ul role="listbox" class="absolute left-0 w-full mt-[6px] bg-surface-1 border rounded-[6px] z-10 border-border-subtle overflow-y-scroll max-h-[625px] custom-list-scrollbar" style="backface-visibility: hidden; transform: translateZ(0);">
						{#each genreFilterOptions as opt}
							<li
								role="option"
								aria-selected={selectedGenre === opt.value}
								tabindex="0"
								onclick={(e) => selectGenreOption(opt.value, e)}
								onkeydown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault();
										selectGenreOption(opt.value, e);
									}
								}}
								class="px-4 py-2 text-sm text-text-base bg-transparent transition-colors duration-200 cursor-pointer antialiased {selectedGenre === opt.value ? 'bg-brand-pink text-white' : ''}"
								style="font-smooth: always; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; text-rendering: optimizeLegibility;"
							>
								{opt.label}
							</li>
						{/each}
					</ul>
				{/if}
			</div>

			<!-- 상태 필터 드롭다운 -->
			<div class="relative group status-filter-dropdown filter-dropdown w-full sm:w-auto" data-open={statusDropdownOpen ? 'true' : 'false'}>
				<button
					type="button"
					aria-haspopup="listbox"
					aria-expanded={statusDropdownOpen}
					class="flex items-center pl-10 pr-8 py-1.5 w-full sm:w-auto sm:min-w-[140px] bg-surface-1 rounded-[6px] text-text-base transition-all duration-200 cursor-pointer border focus:outline-none"
					onclick={toggleStatusDropdown}
					tabindex="0"
				>
					<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<Filter size={16} class="lucide-icon lucide-filter transition-colors duration-200" />
					</div>
					<span class="flex-1 text-left truncate">
						{statusFilterOptions.find(o => o.value === selectedStatus)?.label || '모든 상태'}
					</span>
					<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
						<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-text-base transition-colors duration-200">
							<polyline points="6,9 12,15 18,9"></polyline>
						</svg>
					</div>
				</button>
				{#if statusDropdownOpen}
					<ul role="listbox" class="absolute left-0 w-full mt-[6px] bg-surface-1 border rounded-[6px] z-10 border-border-subtle overflow-hidden">
						{#if groupedStatusFilterOptions}
							{#if groupedStatusFilterOptions.ungrouped.length > 0}
								{#each groupedStatusFilterOptions.ungrouped as opt}
									<li
										role="option"
										aria-selected={selectedStatus === opt.value}
										tabindex="0"
										onclick={(e) => selectStatusOption(opt.value, e)}
										onkeydown={(e) => {
											if (e.key === 'Enter' || e.key === ' ') {
												e.preventDefault();
												selectStatusOption(opt.value, e);
											}
										}}
									>
										{opt.label}
									</li>
								{/each}
							{/if}
							{#each Object.entries(groupedStatusFilterOptions.groups) as [groupName, options], i}
								<li class="filter-group-header {i === 0 && groupedStatusFilterOptions.ungrouped.length === 0 ? 'first-group-header' : ''} {i > 0 || groupedStatusFilterOptions.ungrouped.length > 0 ? 'has-top-border' : ''}">
									{groupName}
								</li>
								{#each options as opt}
									<li
										role="option"
										aria-selected={selectedStatus === opt.value}
										tabindex="0"
										onclick={(e) => selectStatusOption(opt.value, e)}
										onkeydown={(e) => {
											if (e.key === 'Enter' || e.key === ' ') {
												e.preventDefault();
												selectStatusOption(opt.value, e);
											}
										}}
									>
										{opt.label}
									</li>
								{/each}
							{/each}
						{:else}
							{#each statusFilterOptions as opt}
								<li
									role="option"
									aria-selected={selectedStatus === opt.value}
									tabindex="0"
									onclick={(e) => selectStatusOption(opt.value, e)}
									onkeydown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											e.preventDefault();
											selectStatusOption(opt.value, e);
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
			<div class="relative group sort-dropdown filter-dropdown w-full sm:w-auto" data-open={sortDropdownOpen ? 'true' : 'false'}>
				<button
					type="button"
					aria-haspopup="listbox"
					aria-expanded={sortDropdownOpen}
					class="flex items-center justify-between pl-10 pr-8 py-1.5 w-full sm:w-[160px] bg-surface-1 rounded-[6px] text-sm text-text-base transition-all duration-200 cursor-pointer border border-border-subtle focus:outline-none antialiased"
					onclick={toggleSortDropdown}
					tabindex="0"
					style="font-smooth: always; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; text-rendering: optimizeLegibility;"
				>
					<!-- 정렬 아이콘 -->
					<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<ArrowUpDown size={16} class="lucide-icon lucide-arrow-up-down transition-colors duration-200" />
					</div>
					
					<!-- 선택된 값 표시 -->
					<span class="flex-1 text-left whitespace-nowrap overflow-hidden text-ellipsis">
						{sortOptions.find(o => o.value === selectedSort)?.label || '정렬'}
					</span>
					
					<!-- 드롭다운 화살표 -->
					<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
						<ChevronDown size={12} class="text-text-base transition-colors duration-200" />
					</div>
				</button>
				
				<!-- 드롭다운 리스트 -->
				{#if sortDropdownOpen}
					<ul role="listbox" class="absolute left-0 top-full w-full sm:w-[160px] mt-[6px] bg-surface-1 border rounded-[6px] z-[100] border-border-subtle overflow-hidden ">
						{#each sortOptions as opt}
							<li
								role="option"
								aria-selected={selectedSort === opt.value}
								tabindex="0"
								onclick={(e) => selectSort(opt.value, e)}
								onkeydown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault();
										selectSort(opt.value, e);
									}
								}}
								class="px-4 py-2 text-sm text-text-base bg-transparent transition-colors duration-200 cursor-pointer antialiased {selectedSort === opt.value ? 'bg-brand-pink text-white' : ''}"
								style="font-smooth: always; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; text-rendering: optimizeLegibility;"
							>
								{opt.label}
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		</div>
		
		<!-- 결과 개수 표시 -->
		<div class="mt-3 text-xs text-text-muted" aria-live="polite" aria-atomic="true" id="search-results-count">
			{#if searchQuery.trim() || selectedGenre !== 'all' || selectedStatus !== 'all'}
				검색 결과: <span class="text-hover-cyan font-medium">{filteredAndSortedTracks.length}</span>개
				{#if filteredAndSortedTracks.length !== tracks.length}
					<span class="text-text-muted/70"> (전체 {tracks.length}개 중)</span>
				{/if}
			{:else}
				총 <span class="text-hover-cyan font-medium">{tracks.length}</span>개 트랙
			{/if}
		</div>
	</div>

	<!-- 트랙 목록 -->
	{#if filteredAndSortedTracks.length > 0}
		<div class="max-w-full overflow-visible">
			<!-- 모바일/태블릿: 카드 레이아웃 -->
			<div class="lg:hidden space-y-4">
				{#each paginatedTracks as track (track.id)}
					<div class="relative border rounded-xl bg-bg p-4 sm:p-5" style="border-color: var(--border-subtle);">
						<!-- 액션 버튼 (우측 상단) -->
						<div class="absolute top-4 right-4 flex gap-1 z-10">
							<a href="/tracks/{track.id}/edit" class="action-button h-8 w-auto px-3 whitespace-nowrap rounded-md border border-border-subtle bg-surface-1 hover:bg-surface-2 focus-visible:bg-surface-2 text-xs sm:text-sm font-medium transition-colors duration-200 inline-flex items-center justify-center leading-none">
								<span class="action-button-text flex items-center">편집</span>
							</a>
							<div class="relative more-menu-dropdown">
								<button
									onclick={(e) => { e.preventDefault(); e.stopPropagation(); toggleMoreMenu(track.id); }}
									onkeydown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											e.preventDefault();
											e.stopPropagation();
											toggleMoreMenu(track.id);
										}
									}}
									class="action-button h-8 w-8 inline-flex items-center justify-center rounded-md border border-border-subtle bg-surface-1 hover:bg-surface-2 focus-visible:bg-surface-2 transition-colors duration-200"
									aria-label="더보기"
									aria-expanded={moreMenuOpenId === track.id}
									aria-haspopup="menu"
									title="더보기"
									tabindex="0"
								>
									<MoreVertical size={16} class="action-button-icon" />
								</button>
								
								{#if moreMenuOpenId === track.id}
									<div 
										role="menu"
										class="absolute right-0 bottom-full mb-1 w-48 bg-surface-1 border border-border-subtle rounded-lg z-50 animate-in fade-in slide-in-from-bottom-2 duration-200"
									>
										<div class="py-1">
											<!-- 섹션 1: 에셋 -->
											<button 
												role="menuitem"
												onclick={(e) => { e.preventDefault(); e.stopPropagation(); handleDownloadAudio(track.id); }}
												onkeydown={(e) => {
													if (e.key === 'Enter' || e.key === ' ') {
														e.preventDefault();
														e.stopPropagation();
														handleDownloadAudio(track.id);
													}
												}}
												class="group w-full flex items-center gap-2 px-4 py-2 text-sm text-text-base hover:bg-transparent hover:text-[var(--hover-cyan)] transition-colors duration-200 text-left"
												aria-label="오디오 다운로드"
											>
												<Download size={16} class="text-text-muted group-hover:text-[var(--hover-cyan)] transition-colors duration-200" />
												오디오 다운로드
											</button>
											<button 
												role="menuitem"
												onclick={(e) => { e.preventDefault(); e.stopPropagation(); handleDownloadStems(track.id); }}
												onkeydown={(e) => {
													if (e.key === 'Enter' || e.key === ' ') {
														e.preventDefault();
														e.stopPropagation();
														handleDownloadStems(track.id);
													}
												}}
												class="group w-full flex items-center gap-2 px-4 py-2 text-sm text-text-base hover:bg-transparent hover:text-[var(--hover-cyan)] transition-colors duration-200 text-left"
												aria-label="스템(Stems) 다운로드"
											>
												<FileAudio size={16} class="text-text-muted group-hover:text-[var(--hover-cyan)] transition-colors duration-200" />
												스템(Stems) 다운로드
											</button>
											<!-- 섹션 2: 협업 -->
											<div class="border-t border-border-subtle my-1" role="separator"></div>
											<button 
												role="menuitem"
												onclick={(e) => { e.preventDefault(); e.stopPropagation(); handleAssignMember(track.id); }}
												onkeydown={(e) => {
													if (e.key === 'Enter' || e.key === ' ') {
														e.preventDefault();
														e.stopPropagation();
														handleAssignMember(track.id);
													}
												}}
												class="group w-full flex items-center gap-2 px-4 py-2 text-sm text-text-base hover:bg-transparent hover:text-[var(--hover-cyan)] transition-colors duration-200 text-left"
												aria-label="멤버 배정"
											>
												<UserPlus size={16} class="text-text-muted group-hover:text-[var(--hover-cyan)] transition-colors duration-200" />
												멤버 배정
											</button>
											<button 
												role="menuitem"
												onclick={(e) => { e.preventDefault(); e.stopPropagation(); handleCopyShareLink(track.id); }}
												onkeydown={(e) => {
													if (e.key === 'Enter' || e.key === ' ') {
														e.preventDefault();
														e.stopPropagation();
														handleCopyShareLink(track.id);
													}
												}}
												class="group w-full flex items-center gap-2 px-4 py-2 text-sm text-text-base hover:bg-transparent hover:text-[var(--hover-cyan)] transition-colors duration-200 text-left"
												aria-label="공유 링크 복사"
											>
												<Link size={16} class="text-text-muted group-hover:text-[var(--hover-cyan)] transition-colors duration-200" />
												공유 링크 복사
											</button>
											<!-- 섹션 3: 관리 -->
											<div class="border-t border-border-subtle my-1" role="separator"></div>
											<button 
												role="menuitem"
												onclick={(e) => { e.preventDefault(); e.stopPropagation(); handleDeleteTrack(track.id); }}
												onkeydown={(e) => {
													if (e.key === 'Enter' || e.key === ' ') {
														e.preventDefault();
														e.stopPropagation();
														handleDeleteTrack(track.id);
													}
												}}
												class="group w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-transparent hover:text-red-400 transition-colors duration-200 text-left"
												aria-label="삭제"
											>
												<Trash2 size={16} class="text-red-500 group-hover:text-red-400 transition-colors duration-200" />
												삭제
											</button>
										</div>
									</div>
								{/if}
							</div>
						</div>
						
						<!-- 트랙 정보 (전체 너비) -->
						<div class="mb-4 pr-20">
							<div class="flex gap-3 items-center min-w-0">
								<button aria-label="재생" class="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 bg-surface-2 rounded-full flex items-center justify-center hover:bg-brand-pink hover:text-white focus:outline-none transition-colors duration-200 ">
									<Play size={16} class="sm:w-5 sm:h-5 ml-0.5" />
								</button>
								<div class="min-w-0 flex-1">
									<div class="font-semibold text-brand-pink break-words text-base sm:text-lg">
										{#if searchQuery.trim()}
											{@const titleParts = highlightSearchTerm(track.title, searchQuery.trim())}
											{#each titleParts as part}
												{#if part.isMatch}
													<span class="text-hover-cyan font-bold">{part.text}</span>
												{:else}
													{part.text}
												{/if}
											{/each}
										{:else}
											{track.title}
										{/if}
									</div>
									<div class="text-text-muted text-xs sm:text-sm mt-0.5">{track.fileSize}</div>
								</div>
							</div>
						</div>
						<!-- 나머지 정보를 2열 그리드로 배치 -->
						<div class="grid grid-cols-2 gap-x-4 gap-y-3 sm:gap-x-6 sm:gap-y-4 -mx-4 sm:-mx-5 px-4 sm:px-5 pt-4 border-t" style="border-color: var(--border-subtle);">
							<div class="flex flex-col">
								<div class="text-[10px] sm:text-xs text-text-muted mb-1.5 font-normal uppercase tracking-wider">아티스트</div>
								<div class="text-sm sm:text-base font-semibold text-text-strong">
									{#if searchQuery.trim()}
										{@const artistParts = highlightSearchTerm(track.artist, searchQuery.trim())}
										{#each artistParts as part}
											{#if part.isMatch}
												<span class="text-brand-pink font-bold">{part.text}</span>
											{:else}
												{part.text}
											{/if}
										{/each}
									{:else}
										{track.artist}
									{/if}
								</div>
							</div>
							<div class="flex flex-col">
								<div class="text-[10px] sm:text-xs text-text-muted mb-1.5 font-normal uppercase tracking-wider">앨범</div>
								<div class="text-sm sm:text-base text-text-muted break-words">{track.album}</div>
							</div>
							<div class="flex flex-col">
								<div class="text-[10px] sm:text-xs text-text-muted mb-1.5 font-normal uppercase tracking-wider">길이</div>
								<div class="text-sm sm:text-base text-text-muted">{track.duration}</div>
							</div>
							<div class="flex flex-col">
								<div class="text-[10px] sm:text-xs text-text-muted mb-1.5 font-normal uppercase tracking-wider">장르</div>
								<div class="text-sm sm:text-base text-text-muted">{track.genre}</div>
							</div>
							<div class="flex flex-col">
								<div class="text-[10px] sm:text-xs text-text-muted mb-1.5 font-normal uppercase tracking-wider">상태</div>
								<span class="inline-block whitespace-normal badge-base {getStatusColor(track.status)}" style="word-break: keep-all;">
									{getStatusLabel(track.status)}
								</span>
							</div>
							<div class="flex flex-col">
								<div class="text-[10px] sm:text-xs text-text-muted mb-1.5 font-normal uppercase tracking-wider">통계</div>
								<div class="space-y-0.5 text-sm sm:text-base">
									<div><span class="text-hover-cyan">{track.plays.toLocaleString()}</span> 재생</div>
									<div><span class="text-hover-cyan">{track.likes}</span> 좋아요</div>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<!-- 데스크톱: 테이블 레이아웃 -->
			<div class="hidden lg:block border rounded-lg overflow-visible" style="border-color: var(--border-subtle);">
				<div class="overflow-x-auto overflow-y-visible">
					<table class="w-full border-collapse" style="table-layout: fixed; width: 100%; min-width: 800px;">
					<caption class="sr-only">트랙 리스트</caption>
					<thead>
						<tr class="border-b" style="border-color: var(--border-subtle);">
							<th class="py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider" style="width: 25%; padding-left: 1rem; padding-right: 1rem;">트랙</th>
							<th class="py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider" style="width: 12%; padding-left: 1rem; padding-right: 1rem;">아티스트</th>
							<th class="py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider" style="width: 12%; padding-left: 1rem; padding-right: 1rem;">앨범</th>
							<th class="py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider" style="width: 8%; padding-left: 1rem; padding-right: 1rem;">길이</th>
							<th class="py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider" style="width: 10%; padding-left: 1rem; padding-right: 1rem;">장르</th>
							<th class="py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider" style="width: 10%; padding-left: 1rem; padding-right: 1rem;">상태</th>
							<th class="py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider" style="width: 10%; padding-left: 1rem; padding-right: 1rem;">통계</th>
							<th class="py-4 text-right text-xs font-medium text-text-muted uppercase tracking-wider" style="width: 13%; padding-left: 1rem; padding-right: 1rem;">작업</th>
					</tr>
				</thead>
					<tbody>
						{#each paginatedTracks as track (track.id)}
							<tr class="border-b last:border-b-0" style="border-color: var(--border-subtle);">
								<td class="py-4 text-left text-sm min-w-0" style="width: 25%; padding-left: 1rem; padding-right: 1rem;">
								<div class="flex gap-3 items-center min-w-0">
										<button aria-label="재생" class="w-8 h-8 flex-shrink-0 bg-surface-2 rounded-full flex items-center justify-center hover:bg-brand-pink hover:text-white focus:outline-none transition-colors duration-200 ">
											<Play size={16} class="w-4 h-4 ml-0.5" />
									</button>
									<div class="min-w-0 flex-1">
											<div class="font-medium text-brand-pink break-words text-sm">
												{#if searchQuery.trim()}
													{@const titleParts = highlightSearchTerm(track.title, searchQuery.trim())}
													{#each titleParts as part}
														{#if part.isMatch}
															<span class="text-hover-cyan font-bold">{part.text}</span>
														{:else}
															{part.text}
														{/if}
													{/each}
												{:else}
													{track.title}
												{/if}
											</div>
											<div class="text-text-muted text-xs mt-0.5">{track.fileSize}</div>
									</div>
								</div>
							</td>
								<td class="py-4 text-left text-xs sm:text-sm font-medium text-text-strong" style="width: 12%; padding-left: 1rem; padding-right: 1rem;">
									{#if searchQuery.trim()}
										{@const artistParts = highlightSearchTerm(track.artist, searchQuery.trim())}
										{#each artistParts as part}
											{#if part.isMatch}
												<span class="text-brand-pink font-bold">{part.text}</span>
											{:else}
												{part.text}
											{/if}
										{/each}
									{:else}
										{track.artist}
									{/if}
							</td>
								<td class="py-4 text-left text-xs sm:text-sm text-text-muted" style="width: 12%; padding-left: 1rem; padding-right: 1rem;">
									{track.album}
							</td>
								<td class="py-4 text-left text-xs sm:text-sm text-text-muted" style="width: 8%; padding-left: 1rem; padding-right: 1rem;">
									{track.duration}
							</td>
								<td class="py-4 text-left text-xs sm:text-sm text-text-muted" style="width: 10%; padding-left: 1rem; padding-right: 1rem;">
									{track.genre}
							</td>
								<td class="py-4 text-left text-xs sm:text-sm" style="width: 10%; padding-left: 0; padding-right: 0;">
									<span class="badge-base {getStatusColor(track.status)} whitespace-normal" style="word-break: keep-all;">
									{getStatusLabel(track.status)}
								</span>
							</td>
								<td class="py-4 text-left text-xs sm:text-sm text-text-muted" style="width: 10%; padding-left: 1rem; padding-right: 1rem;">
									<div class="space-y-1.5">
										<div class="space-y-0.5">
											<div class="text-xs">재생</div>
											<div class="text-sm text-hover-cyan">{track.plays.toLocaleString()}</div>
										</div>
								<div class="space-y-0.5">
											<div class="text-xs">좋아요</div>
											<div class="text-sm text-hover-cyan">{track.likes}</div>
										</div>
								</div>
							</td>
								<td class="py-4 text-center text-xs sm:text-sm font-medium" style="width: 13%; padding-left: 1rem; padding-right: 1rem;">
									<div class="flex gap-1 justify-center items-center">
										<a href="/tracks/{track.id}/edit" class="action-button h-8 w-auto px-3 whitespace-nowrap rounded-md border border-border-subtle bg-surface-1 hover:bg-surface-2 focus-visible:bg-surface-2 text-xs sm:text-sm font-medium transition-colors duration-200 inline-flex items-center justify-center leading-none">
										<span class="action-button-text flex items-center">편집</span>
									</a>
									<div class="relative more-menu-dropdown">
										<button
											onclick={(e) => { e.preventDefault(); e.stopPropagation(); toggleMoreMenu(track.id); }}
											onkeydown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault();
													e.stopPropagation();
													toggleMoreMenu(track.id);
												}
											}}
											class="action-button h-8 w-8 inline-flex items-center justify-center rounded-md border border-border-subtle bg-surface-1 hover:bg-surface-2 focus-visible:bg-surface-2 transition-colors duration-200"
											aria-label="더보기"
											aria-expanded={moreMenuOpenId === track.id}
											aria-haspopup="menu"
											title="더보기"
											tabindex="0"
										>
											<MoreVertical size={16} class="action-button-icon" />
										</button>
										
										{#if moreMenuOpenId === track.id}
											<div 
												role="menu"
												class="absolute right-0 top-full mt-1 w-48 bg-surface-1 border border-border-subtle rounded-lg z-[100]  animate-in fade-in slide-in-from-top-2 duration-200"
											>
												<div class="py-1">
													<!-- 섹션 1: 에셋 -->
													<button 
														role="menuitem"
														onclick={(e) => { e.preventDefault(); e.stopPropagation(); handleDownloadAudio(track.id); }}
														onkeydown={(e) => {
															if (e.key === 'Enter' || e.key === ' ') {
																e.preventDefault();
																e.stopPropagation();
																handleDownloadAudio(track.id);
															}
														}}
														class="group w-full flex items-center gap-2 px-4 py-2 text-sm text-text-base hover:bg-transparent hover:text-[var(--hover-cyan)] transition-colors duration-200 text-left"
														aria-label="오디오 다운로드"
													>
														<Download size={16} class="text-text-muted group-hover:text-[var(--hover-cyan)] transition-colors duration-200" />
														오디오 다운로드
													</button>
													<button 
														role="menuitem"
														onclick={(e) => { e.preventDefault(); e.stopPropagation(); handleDownloadStems(track.id); }}
														onkeydown={(e) => {
															if (e.key === 'Enter' || e.key === ' ') {
																e.preventDefault();
																e.stopPropagation();
																handleDownloadStems(track.id);
															}
														}}
														class="group w-full flex items-center gap-2 px-4 py-2 text-sm text-text-base hover:bg-transparent hover:text-[var(--hover-cyan)] transition-colors duration-200 text-left"
														aria-label="스템(Stems) 다운로드"
													>
														<FileAudio size={16} class="text-text-muted group-hover:text-[var(--hover-cyan)] transition-colors duration-200" />
														스템(Stems) 다운로드
													</button>
													<!-- 섹션 2: 협업 -->
													<div class="border-t border-border-subtle my-1" role="separator"></div>
													<button 
														role="menuitem"
														onclick={(e) => { e.preventDefault(); e.stopPropagation(); handleAssignMember(track.id); }}
														onkeydown={(e) => {
															if (e.key === 'Enter' || e.key === ' ') {
																e.preventDefault();
																e.stopPropagation();
																handleAssignMember(track.id);
															}
														}}
														class="group w-full flex items-center gap-2 px-4 py-2 text-sm text-text-base hover:bg-transparent hover:text-[var(--hover-cyan)] transition-colors duration-200 text-left"
														aria-label="멤버 배정"
													>
														<UserPlus size={16} class="text-text-muted group-hover:text-[var(--hover-cyan)] transition-colors duration-200" />
														멤버 배정
													</button>
													<button 
														role="menuitem"
														onclick={(e) => { e.preventDefault(); e.stopPropagation(); handleCopyShareLink(track.id); }}
														onkeydown={(e) => {
															if (e.key === 'Enter' || e.key === ' ') {
																e.preventDefault();
																e.stopPropagation();
																handleCopyShareLink(track.id);
															}
														}}
														class="group w-full flex items-center gap-2 px-4 py-2 text-sm text-text-base hover:bg-transparent hover:text-[var(--hover-cyan)] transition-colors duration-200 text-left"
														aria-label="공유 링크 복사"
													>
														<Link size={16} class="text-text-muted group-hover:text-[var(--hover-cyan)] transition-colors duration-200" />
														공유 링크 복사
													</button>
													<!-- 섹션 3: 관리 -->
													<div class="border-t border-border-subtle my-1" role="separator"></div>
													<button 
														role="menuitem"
														onclick={(e) => { e.preventDefault(); e.stopPropagation(); handleDeleteTrack(track.id); }}
														onkeydown={(e) => {
															if (e.key === 'Enter' || e.key === ' ') {
																e.preventDefault();
																e.stopPropagation();
																handleDeleteTrack(track.id);
															}
														}}
														class="group w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-transparent hover:text-red-400 transition-colors duration-200 text-left"
														aria-label="삭제"
													>
														<Trash2 size={16} class="text-red-500 group-hover:text-red-400 transition-colors duration-200" />
														삭제
													</button>
												</div>
											</div>
										{/if}
									</div>
								</div>
							</td>
						</tr>
							{/each}
						</tbody>
					</table>
				</div>
				</div>
			</div>

			<!-- 페이지네이션 -->
			{#if totalPages > 1}
				<div class="flex justify-center items-center gap-2 mt-6">
					<button
						onclick={() => goToPage(currentPage - 1)}
						disabled={currentPage === 1}
						class="w-8 h-8 flex items-center justify-center rounded-md bg-surface-2 hover:bg-surface-3 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors duration-200"
						aria-label="이전 페이지"
					>
						<ChevronLeft size={16} />
					</button>
					{#each Array(totalPages) as _, i}
						{@const page = i + 1}
						{#if page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)}
							<button
								onclick={() => goToPage(page)}
								class="w-8 h-8 flex items-center justify-center rounded-md bg-surface-2 hover:bg-surface-3 text-sm transition-colors duration-200 {currentPage === page ? 'bg-brand-pink text-white hover:bg-brand-pink/90' : ''}"
								aria-label="페이지 {page}"
								aria-current={currentPage === page ? 'page' : undefined}
							>
								{page}
							</button>
						{:else if page === currentPage - 2 || page === currentPage + 2}
							<span class="text-text-muted">...</span>
						{/if}
					{/each}
					<button
						onclick={() => goToPage(currentPage + 1)}
						disabled={currentPage === totalPages}
						class="w-8 h-8 flex items-center justify-center rounded-md bg-surface-2 hover:bg-surface-3 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors duration-200"
						aria-label="다음 페이지"
					>
						<ChevronRight size={16} />
					</button>
				</div>
			{/if}
	{:else}
		<EmptyState 
			title="트랙을 찾을 수 없습니다"
			description={searchQuery.trim() || selectedGenre !== 'all' || selectedStatus !== 'all' ? '검색 조건에 맞는 트랙이 없습니다.' : '아직 트랙이 없습니다.'}
			actionLabel="첫 번째 트랙 추가"
			onAction={handleCreateTrack}
		/>
	{/if}
</PageContent>

<style>
	/* 기본 (다크 모드) */
	.custom-list-scrollbar::-webkit-scrollbar {
		width: 8px !important;
		height: 8px !important;
	}
	.custom-list-scrollbar::-webkit-scrollbar-track {
		background: var(--bg); /* #000000 */
	}
	.custom-list-scrollbar::-webkit-scrollbar-thumb {
		background: var(--surface-2); /* #121212 */
		border-radius: 0px; /* 각진 모서리 */
	}
	.custom-list-scrollbar::-webkit-scrollbar-thumb:hover {
		background: var(--text-muted); /* #6F6F6F */
	}

	/* 라이트 모드 오버라이드 */
	:global([data-theme="light"]) .custom-list-scrollbar::-webkit-scrollbar-track {
		background: var(--bg); /* #F7F3E9 */
	}
	:global([data-theme="light"]) .custom-list-scrollbar::-webkit-scrollbar-thumb {
		background: var(--text-muted); /* #5C4F3F */
	}
	:global([data-theme="light"]) .custom-list-scrollbar::-webkit-scrollbar-thumb:hover {
		background: var(--text-base); /* #8B7355 */
	}

	/* Firefox 지원 */
	.custom-list-scrollbar {
		scrollbar-width: thin;
		scrollbar-color: var(--surface-2) var(--bg);
	}
	:global([data-theme="light"]) .custom-list-scrollbar {
		scrollbar-color: var(--text-muted) var(--bg);
	}
</style>
