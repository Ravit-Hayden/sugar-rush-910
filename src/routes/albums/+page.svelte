<script lang="ts">
	import { goto } from '$app/navigation';
	import { Disc3, Plus, MoreVertical, Play, Edit, ArrowUpDown, Search, Filter, Download, Share2, Trash2, ChevronLeft, ChevronRight, UserPlus, Link } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import { getStatusColor, getStatusLabel } from '$lib/utils/status';

	let searchQuery = $state('');
	let selectedFilter = $state('all');
	let selectedSort = $state('latest');
	let sortDropdownOpen = $state(false);
	let filterDropdownOpen = $state(false);
	let selectedAlbumId = $state<string | null>(null);
	let imageErrorStates = $state(new Map<string, boolean>());
	let moreMenuOpenId = $state<string | null>(null);
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
			created_at: '2024-10-01',
			trackList: [
				{ id: '1', title: 'Work Track 1', duration: '3:40' },
				{ id: '2', title: 'Work Track 2', duration: '3:45' },
				{ id: '3', title: 'Work Track 3', duration: '3:30' },
				{ id: '4', title: 'Work Track 4', duration: '3:50' },
				{ id: '5', title: 'Work Track 5', duration: '3:35' }
			]
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
			created_at: '2024-10-05',
			trackList: [
				{ id: '1', title: 'Revision Track 1', duration: '4:00' },
				{ id: '2', title: 'Revision Track 2', duration: '4:05' },
				{ id: '3', title: 'Revision Track 3', duration: '4:05' }
			]
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
			created_at: '2024-10-10',
			trackList: [
				{ id: '1', title: 'Review Track 1', duration: '3:30' },
				{ id: '2', title: 'Review Track 2', duration: '3:45' },
				{ id: '3', title: 'Review Track 3', duration: '3:20' },
				{ id: '4', title: 'Review Track 4', duration: '4:00' },
				{ id: '5', title: 'Review Track 5', duration: '3:15' },
				{ id: '6', title: 'Review Track 6', duration: '3:50' },
				{ id: '7', title: 'Review Track 7', duration: '3:25' },
				{ id: '8', title: 'Review Track 8', duration: '3:10' },
				{ id: '9', title: 'Review Track 9', duration: '3:40' },
				{ id: '10', title: 'Review Track 10', duration: '3:55' }
			]
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
			created_at: '2024-10-12',
			trackList: [
				{ id: '1', title: 'Review Track 1', duration: '3:40' },
				{ id: '2', title: 'Review Track 2', duration: '3:45' },
				{ id: '3', title: 'Review Track 3', duration: '3:30' },
				{ id: '4', title: 'Review Track 4', duration: '3:50' },
				{ id: '5', title: 'Review Track 5', duration: '3:35' },
				{ id: '6', title: 'Review Track 6', duration: '3:40' },
				{ id: '7', title: 'Review Track 7', duration: '3:50' }
			]
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
			created_at: '2024-10-15',
			trackList: [
				{ id: '1', title: 'Complete Track 1', duration: '3:35' },
				{ id: '2', title: 'Complete Track 2', duration: '3:40' },
				{ id: '3', title: 'Complete Track 3', duration: '3:45' },
				{ id: '4', title: 'Complete Track 4', duration: '3:30' },
				{ id: '5', title: 'Complete Track 5', duration: '3:50' },
				{ id: '6', title: 'Complete Track 6', duration: '3:35' },
				{ id: '7', title: 'Complete Track 7', duration: '3:40' },
				{ id: '8', title: 'Complete Track 8', duration: '3:45' },
				{ id: '9', title: 'Complete Track 9', duration: '3:35' }
			]
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
			created_at: '2024-10-18',
			trackList: [
				{ id: '1', title: 'Approved Track 1', duration: '3:40' },
				{ id: '2', title: 'Approved Track 2', duration: '3:45' },
				{ id: '3', title: 'Approved Track 3', duration: '3:30' },
				{ id: '4', title: 'Approved Track 4', duration: '3:50' },
				{ id: '5', title: 'Approved Track 5', duration: '3:35' },
				{ id: '6', title: 'Approved Track 6', duration: '3:40' },
				{ id: '7', title: 'Approved Track 7', duration: '3:45' },
				{ id: '8', title: 'Approved Track 8', duration: '3:30' },
				{ id: '9', title: 'Approved Track 9', duration: '3:50' },
				{ id: '10', title: 'Approved Track 10', duration: '3:35' },
				{ id: '11', title: 'Approved Track 11', duration: '3:40' }
			]
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
			release_date_global: '2024-11-05',
			trackList: [
				{ id: '1', title: 'Scheduled Track 1', duration: '3:35' },
				{ id: '2', title: 'Scheduled Track 2', duration: '3:40' },
				{ id: '3', title: 'Scheduled Track 3', duration: '3:45' },
				{ id: '4', title: 'Scheduled Track 4', duration: '3:30' },
				{ id: '5', title: 'Scheduled Track 5', duration: '3:50' },
				{ id: '6', title: 'Scheduled Track 6', duration: '3:35' },
				{ id: '7', title: 'Scheduled Track 7', duration: '3:40' },
				{ id: '8', title: 'Scheduled Track 8', duration: '3:45' }
			]
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
			created_at: '2024-09-05',
			trackList: [
				{ id: '1', title: 'Paused Track 1', duration: '3:50' },
				{ id: '2', title: 'Paused Track 2', duration: '3:55' },
				{ id: '3', title: 'Paused Track 3', duration: '3:45' },
				{ id: '4', title: 'Paused Track 4', duration: '4:00' }
			]
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
			created_at: '2024-08-20',
			trackList: [
				{ id: '1', title: 'Deleted Track 1', duration: '4:05' },
				{ id: '2', title: 'Deleted Track 2', duration: '4:10' }
			]
		},
		// 추가 샘플 데이터 (2페이지 테스트용)
		{
			id: '13',
			title: 'Starlight Collection',
			artist: 'Sugar Rush',
			year: 2024,
			status: 'published',
			tracks: 10,
			duration: '38:20',
			cover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop',
			plays: 980,
			likes: 67,
			created_at: '2024-10-22',
			release_date_kr: '2024-10-25',
			release_date_global: '2024-10-30',
			trackList: [
				{ id: '1', title: 'Starlight Dreams', duration: '3:52' },
				{ id: '2', title: 'Neon Nights', duration: '4:25' },
				{ id: '3', title: 'Golden Hour', duration: '5:10' },
				{ id: '4', title: 'Electric Pulse', duration: '3:38' },
				{ id: '5', title: 'Midnight Serenade', duration: '6:45' },
				{ id: '6', title: 'Sunset Boulevard', duration: '4:50' },
				{ id: '7', title: 'Cosmic Dance', duration: '4:15' },
				{ id: '8', title: 'Rainbow Bridge', duration: '3:28' },
				{ id: '9', title: 'Moonlight Sonata', duration: '5:20' },
				{ id: '10', title: 'Dawn Chorus', duration: '3:37' }
			]
		},
		{
			id: '14',
			title: 'Neon Dreams',
			artist: 'Various',
			year: 2024,
			status: 'draft',
			tracks: 6,
			duration: '22:15',
			cover: '/api/placeholder/300/300',
			plays: 0,
			likes: 0,
			created_at: '2024-10-25',
			trackList: [
				{ id: '1', title: 'Neon Track 1', duration: '3:40' },
				{ id: '2', title: 'Neon Track 2', duration: '3:45' },
				{ id: '3', title: 'Neon Track 3', duration: '3:50' },
				{ id: '4', title: 'Neon Track 4', duration: '3:35' },
				{ id: '5', title: 'Neon Track 5', duration: '3:55' },
				{ id: '6', title: 'Neon Track 6', duration: '3:20' }
			]
		},
		{
			id: '15',
			title: 'Golden Hour Sessions',
			artist: 'Sugar Rush',
			year: 2024,
			status: 'editing',
			tracks: 8,
			duration: '32:40',
			cover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop',
			plays: 0,
			likes: 0,
			created_at: '2024-10-28',
			trackList: [
				{ id: '1', title: 'Golden Track 1', duration: '4:10' },
				{ id: '2', title: 'Golden Track 2', duration: '4:15' },
				{ id: '3', title: 'Golden Track 3', duration: '4:00' },
				{ id: '4', title: 'Golden Track 4', duration: '4:20' },
				{ id: '5', title: 'Golden Track 5', duration: '4:05' },
				{ id: '6', title: 'Golden Track 6', duration: '4:10' },
				{ id: '7', title: 'Golden Track 7', duration: '4:15' },
				{ id: '8', title: 'Golden Track 8', duration: '3:25' }
			]
		},
		{
			id: '16',
			title: 'Electric Vibes',
			artist: 'Various',
			year: 2024,
			status: 'revision_requested',
			tracks: 5,
			duration: '18:45',
			cover: '/api/placeholder/300/300',
			plays: 0,
			likes: 0,
			created_at: '2024-11-01',
			trackList: [
				{ id: '1', title: 'Electric Track 1', duration: '3:45' },
				{ id: '2', title: 'Electric Track 2', duration: '3:50' },
				{ id: '3', title: 'Electric Track 3', duration: '3:40' },
				{ id: '4', title: 'Electric Track 4', duration: '3:55' },
				{ id: '5', title: 'Electric Track 5', duration: '3:35' }
			]
		},
		{
			id: '17',
			title: 'Midnight Sessions',
			artist: 'Sugar Rush',
			year: 2024,
			status: 'pending_review',
			tracks: 9,
			duration: '35:20',
			cover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop',
			plays: 0,
			likes: 0,
			created_at: '2024-11-05',
			trackList: [
				{ id: '1', title: 'Midnight Track 1', duration: '3:55' },
				{ id: '2', title: 'Midnight Track 2', duration: '4:00' },
				{ id: '3', title: 'Midnight Track 3', duration: '3:50' },
				{ id: '4', title: 'Midnight Track 4', duration: '4:05' },
				{ id: '5', title: 'Midnight Track 5', duration: '3:45' },
				{ id: '6', title: 'Midnight Track 6', duration: '4:10' },
				{ id: '7', title: 'Midnight Track 7', duration: '3:55' },
				{ id: '8', title: 'Midnight Track 8', duration: '4:00' },
				{ id: '9', title: 'Midnight Track 9', duration: '3:20' }
			]
		},
		{
			id: '18',
			title: 'Sunset Collection',
			artist: 'Various',
			year: 2024,
			status: 'under_review',
			tracks: 7,
			duration: '26:30',
			cover: '/api/placeholder/300/300',
			plays: 0,
			likes: 0,
			created_at: '2024-11-08',
			trackList: [
				{ id: '1', title: 'Sunset Track 1', duration: '3:50' },
				{ id: '2', title: 'Sunset Track 2', duration: '3:55' },
				{ id: '3', title: 'Sunset Track 3', duration: '3:45' },
				{ id: '4', title: 'Sunset Track 4', duration: '4:00' },
				{ id: '5', title: 'Sunset Track 5', duration: '3:50' },
				{ id: '6', title: 'Sunset Track 6', duration: '4:05' },
				{ id: '7', title: 'Sunset Track 7', duration: '3:45' }
			]
		},
		{
			id: '19',
			title: 'Cosmic Journey',
			artist: 'Sugar Rush',
			year: 2024,
			status: 'editing_complete',
			tracks: 11,
			duration: '42:15',
			cover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop',
			plays: 0,
			likes: 0,
			created_at: '2024-11-10',
			trackList: [
				{ id: '1', title: 'Cosmic Track 1', duration: '3:55' },
				{ id: '2', title: 'Cosmic Track 2', duration: '4:00' },
				{ id: '3', title: 'Cosmic Track 3', duration: '3:50' },
				{ id: '4', title: 'Cosmic Track 4', duration: '4:05' },
				{ id: '5', title: 'Cosmic Track 5', duration: '3:45' },
				{ id: '6', title: 'Cosmic Track 6', duration: '4:10' },
				{ id: '7', title: 'Cosmic Track 7', duration: '3:55' },
				{ id: '8', title: 'Cosmic Track 8', duration: '4:00' },
				{ id: '9', title: 'Cosmic Track 9', duration: '3:50' },
				{ id: '10', title: 'Cosmic Track 10', duration: '4:05' },
				{ id: '11', title: 'Cosmic Track 11', duration: '3:20' }
			]
		},
		{
			id: '20',
			title: 'Rainbow Spectrum',
			artist: 'Various',
			year: 2024,
			status: 'approved',
			tracks: 6,
			duration: '24:10',
			cover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop',
			plays: 0,
			likes: 0,
			created_at: '2024-11-12',
			trackList: [
				{ id: '1', title: 'Rainbow Track 1', duration: '4:05' },
				{ id: '2', title: 'Rainbow Track 2', duration: '4:10' },
				{ id: '3', title: 'Rainbow Track 3', duration: '4:00' },
				{ id: '4', title: 'Rainbow Track 4', duration: '4:15' },
				{ id: '5', title: 'Rainbow Track 5', duration: '3:50' },
				{ id: '6', title: 'Rainbow Track 6', duration: '3:50' }
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

	// 매칭된 필드 확인 함수
	function getMatchedField(album: typeof albums[0], query: string): 'title' | 'artist' | 'both' | null {
		if (!query) return null;
		
		const title = album.title.toLowerCase();
		const artist = album.artist.toLowerCase();
		const lowerQuery = query.toLowerCase();
		
		const titleMatch = title.includes(lowerQuery);
		const artistMatch = artist.includes(lowerQuery);
		
		if (titleMatch && artistMatch) return 'both';
		if (titleMatch) return 'title';
		if (artistMatch) return 'artist';
		return null;
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

	function toggleTrackList(albumId: string) {
		const wasOpen = selectedAlbumId === albumId;
		selectedAlbumId = wasOpen ? null : albumId;
		const album = albums.find(a => a.id === albumId);
		console.log('트랙 목록 토글:', {
			albumId,
			albumTitle: album?.title,
			isOpen: !wasOpen,
			trackCount: album?.trackList?.length || 0
		});
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

	// 외부 클릭 시 더보기 메뉴 닫기
	$effect(() => {
		if (moreMenuOpenId === null) return;

		function handleClickOutside(event: MouseEvent) {
			const target = event.target as HTMLElement;
			// 더보기 메뉴 드롭다운을 클릭한 경우는 무시
			if (target.closest('.more-menu-dropdown')) {
				return;
			}
			// 외부 클릭 시 더보기 메뉴 닫기
			moreMenuOpenId = null;
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

	function handlePlayAlbum(albumId: string) {
		// 앨범 전체 재생 로직
		console.log('앨범 재생:', albumId);
		const album = albums.find(a => a.id === albumId);
		alert(`앨범 재생\n제목: ${album?.title || '알 수 없음'}\nID: ${albumId}\n트랙 수: ${album?.tracks || 0}곡\n\n(재생 기능은 추후 구현 예정)`);
	}

	function handleEdit(albumId: string) {
		// 앨범 편집 페이지로 이동
		goto(`/albums/${albumId}/edit`);
	}

	function toggleMoreMenu(albumId: string) {
		moreMenuOpenId = moreMenuOpenId === albumId ? null : albumId;
	}

	function handleDelete(albumId: string) {
		const album = albums.find(a => a.id === albumId);
		if (confirm(`정말 "${album?.title || '앨범'}" 앨범을 삭제하시겠습니까?`)) {
			console.log('앨범 삭제:', albumId);
			// 실제 삭제 로직 구현 예정
			moreMenuOpenId = null;
		}
	}

	function handleDownload(albumId: string) {
		console.log('앨범 다운로드:', albumId);
		// 실제 다운로드 로직 구현 예정
		moreMenuOpenId = null;
	}

	function handleShare(albumId: string) {
		console.log('앨범 공유:', albumId);
		// 실제 공유 로직 구현 예정
		moreMenuOpenId = null;
	}

	function handleAlbumClick(albumId: string, albumTitle: string) {
		// 앨범 상세 페이지로 이동
		goto(`/albums/${albumId}`);
	}

	function handleTrackClick(albumId: string, albumTitle: string, trackId: string, trackTitle: string) {
		// 트랙 상세 페이지로 이동
		goto(`/tracks/${trackId}`);
	}

	function toggleFilterDropdown() {
		filterDropdownOpen = !filterDropdownOpen;
	}

	function selectFilterOption(value: string, event?: MouseEvent | KeyboardEvent) {
		selectedFilter = value;
		// 클릭한 항목에 포커스 효과를 보여주기 위해 약간의 지연 후 드롭다운 닫기
		if (event && event.currentTarget) {
			(event.currentTarget as HTMLElement).focus();
		}
		setTimeout(() => {
		filterDropdownOpen = false;
			const button = document.querySelector('.filter-dropdown button') as HTMLButtonElement;
			if (button) {
				button.focus();
			}
		}, 150);
	}

	// 필터 옵션 그룹화
	const groupedFilterOptions = $derived.by(() => {
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
	});

	// 페이지네이션 상태
	let currentPage = $state(1);
	const itemsPerPage = 12;
	const totalPages = $derived(Math.ceil(filteredAndSortedAlbums.length / itemsPerPage));
	const paginatedAlbums = $derived.by(() => {
		const start = (currentPage - 1) * itemsPerPage;
		const end = start + itemsPerPage;
		return filteredAndSortedAlbums.slice(start, end);
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
		currentPage = 1;
	});

	function handleCreateAlbum() {
		goto('/albums/new');
	}
</script>

<PageContent className="min-h-screen overflow-visible" padding="pt-0 pb-64">
	<PageHeader 
		title="앨범" 
		description="음악 앨범을 관리하고 발매하세요."
		actions={[
			{
				icon: Plus,
				label: '새 앨범 만들기',
				href: '/albums/new'
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
					aria-label="앨범 또는 아티스트 검색"
					id="album-search"
					autocomplete="off"
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
										onclick={(e) => selectFilterOption(opt.value, e)}
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
										onclick={(e) => selectFilterOption(opt.value, e)}
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
									onclick={(e) => selectFilterOption(opt.value, e)}
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
			<div class="relative group sort-dropdown filter-dropdown w-full sm:w-auto" data-open={sortDropdownOpen ? 'true' : 'false'}>
			<button
				type="button"
				aria-haspopup="listbox"
				aria-expanded={sortDropdownOpen}
				class="flex items-center justify-between pl-10 pr-8 py-1.5 w-full sm:w-auto sm:min-w-[140px] bg-surface-1 rounded-[6px] text-text-base transition-all duration-200 cursor-pointer border focus:outline-none"
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
				<ul role="listbox" class="absolute left-0 w-full mt-[6px] bg-surface-1 border rounded-[6px] z-10 border-border-subtle overflow-hidden shadow-lg">
					{#each sortOptions as opt}
						<li
							role="option"
							aria-selected={selectedSort === opt.value}
							tabindex="0"
							onclick={(e) => selectSort(opt.value, e)}
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
		
		<!-- 결과 개수 표시 -->
		<div class="mt-3 text-xs text-text-muted" aria-live="polite" aria-atomic="true" id="search-results-count">
			{#if searchQuery.trim() || selectedFilter !== 'all'}
				검색 결과: <span class="text-hover-cyan font-medium">{filteredAndSortedAlbums.length}</span>개
				{#if filteredAndSortedAlbums.length !== albums.length}
					<span class="text-text-muted/70"> (전체 {albums.length}개 중)</span>
				{/if}
			{:else}
				총 <span class="text-hover-cyan font-medium">{albums.length}</span>개 앨범
			{/if}
		</div>
	</div>

	<!-- 앨범 그리드 -->
	{#if filteredAndSortedAlbums.length > 0}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{#each paginatedAlbums as album (album.id)}
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
								onclick={(e) => { e.preventDefault(); e.stopPropagation(); handlePlayAlbum(album.id); }}
								class="play-button w-12 h-12 bg-brand-pink rounded-full flex items-center justify-center transition-colors duration-200" 
								aria-label="재생"
							>
								<Play size={20} class="play-button-icon text-white" />
							</button>
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
												<span class="flex items-center gap-2 track-number-title">
													<span class="text-text-muted/60 w-4 text-right font-medium group-hover/track:text-hover-cyan transition-colors track-number">{index + 1}</span>
													<span class="group-hover/track:font-medium transition-all track-title">{track.title}</span>
												</span>
												<span class="text-text-muted/60 group-hover/track:text-text-muted transition-colors track-duration">{track.duration}</span>
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
									<span class="text-hover-cyan">{album.likes}</span>
								</div>
								<div class="flex items-center gap-2">
									<span>재생</span>
									<span class="text-hover-cyan">{album.plays.toLocaleString()}</span>
								</div>
							</div>
						</div>
						<div class="flex items-end justify-between text-xs text-text-muted">
							<div class="flex flex-col gap-1">
								<span class="leading-none">작업 생성: {album.created_at}</span>
								<span class="leading-none">국내 발매: {album.release_date_kr || '미정'}</span>
								<span class="leading-none">해외 발매: {album.release_date_global || '미정'}</span>
							</div>
							<div class="flex items-end -mr-4 gap-0" role="group" aria-label="앨범 액션 버튼">
								<button 
									onclick={(e) => { e.preventDefault(); e.stopPropagation(); handleEdit(album.id); }}
									onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') e.stopPropagation(); }}
									class="w-8 h-8 inline-flex items-end justify-center rounded-md hover:bg-surface-2 focus-visible:bg-surface-2 transition-colors duration-200 pb-0.5 action-button" 
									aria-label="편집" 
									title="편집"
								>
									<Edit size={14} class="text-text-muted action-button-icon" />
								</button>
								<div class="relative more-menu-dropdown -ml-1 flex items-end">
									<button
										class="w-8 h-8 inline-flex items-end justify-center rounded-md hover:bg-transparent focus-visible:bg-transparent hover:text-text-strong focus-visible:text-text-strong transition-colors duration-200 pb-0.5 action-button"
										aria-label="더보기"
										aria-expanded={moreMenuOpenId === album.id}
										aria-haspopup="menu"
										title="더보기"
										tabindex="0"
										onclick={(e) => { e.preventDefault(); e.stopPropagation(); toggleMoreMenu(album.id); }}
										onkeydown={(e) => { 
											if (e.key === 'Enter' || e.key === ' ') { 
												e.preventDefault(); 
												e.stopPropagation(); 
												toggleMoreMenu(album.id); 
											} 
										}}
									>
										<MoreVertical size={14} class="action-button-icon" />
									</button>

									{#if moreMenuOpenId === album.id}
										<div 
											role="menu"
											class="absolute right-0 bottom-full mb-1 w-48 bg-surface-1 border border-border-subtle rounded-lg z-50 animate-in fade-in slide-in-from-bottom-2 duration-200"
										>
											<div class="py-1">
												<button 
													role="menuitem"
													class="group w-full flex items-center gap-2 px-4 py-2 text-sm text-text-base hover:bg-transparent hover:text-[var(--hover-cyan)] transition-colors duration-200 text-left" 
													aria-label="다운로드"
													onclick={(e) => { e.preventDefault(); e.stopPropagation(); handleDownload(album.id); }}
													onkeydown={(e) => {
														if (e.key === 'Enter' || e.key === ' ') {
															e.preventDefault();
															e.stopPropagation();
															handleDownload(album.id);
														}
													}}
												>
													<Download size={16} class="text-text-muted group-hover:text-[var(--hover-cyan)] transition-colors duration-200" />
													다운로드
												</button>
												
												<button 
													role="menuitem"
													class="group w-full flex items-center gap-2 px-4 py-2 text-sm text-text-base hover:bg-transparent hover:text-[var(--hover-cyan)] transition-colors duration-200 text-left" 
													aria-label="멤버 배정"
													onclick={(e) => { e.preventDefault(); e.stopPropagation(); handleAssignMember(album.id); }}
													onkeydown={(e) => {
														if (e.key === 'Enter' || e.key === ' ') {
															e.preventDefault();
															e.stopPropagation();
															handleAssignMember(album.id);
														}
													}}
												>
													<UserPlus size={16} class="text-text-muted group-hover:text-[var(--hover-cyan)] transition-colors duration-200" />
													멤버 배정
												</button>
												<button 
													role="menuitem"
													class="group w-full flex items-center gap-2 px-4 py-2 text-sm text-text-base hover:bg-transparent hover:text-[var(--hover-cyan)] transition-colors duration-200 text-left" 
													aria-label="공유 링크 복사"
													onclick={(e) => { e.preventDefault(); e.stopPropagation(); handleCopyShareLink(album.id); }}
													onkeydown={(e) => {
														if (e.key === 'Enter' || e.key === ' ') {
															e.preventDefault();
															e.stopPropagation();
															handleCopyShareLink(album.id);
														}
													}}
												>
													<Link size={16} class="text-text-muted group-hover:text-[var(--hover-cyan)] transition-colors duration-200" />
													공유 링크 복사
												</button>
												
												<div class="border-t border-border-subtle my-1" role="separator"></div>
												
												<button 
													role="menuitem"
													class="group w-full flex items-center gap-2 px-4 py-2 text-sm text-danger-fg hover:bg-transparent hover:text-danger-fg/80 transition-colors duration-200 text-left" 
													aria-label="삭제"
													onclick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(album.id); }}
													onkeydown={(e) => {
														if (e.key === 'Enter' || e.key === ' ') {
															e.preventDefault();
															e.stopPropagation();
															handleDelete(album.id);
														}
													}}
												>
													<Trash2 size={16} class="text-danger-fg group-hover:text-danger-fg/80" />
													삭제
												</button>
											</div>
										</div>
									{/if}
								</div>
							</div>
						</div>
					</div>
				</div>
			{/each}
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
			title="앨범을 찾을 수 없습니다"
			description={searchQuery ? '검색 조건에 맞는 앨범이 없습니다.' : '아직 앨범이 없습니다.'}
			actionLabel="첫 번째 앨범 만들기"
			onAction={handleCreateAlbum}
		/>
	{/if}
</PageContent>
