<script lang="ts">
	import { Disc3, Plus, MoreVertical, Play, Edit } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';
	import SearchFilterBar from '$lib/components/SearchFilterBar.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import { getStatusColor, getStatusLabel } from '$lib/utils/status';

	let searchQuery = '';
	let selectedFilter = 'all';
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
			created_at: '2024-09-15'
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
			created_at: '2024-09-20'
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
			created_at: '2024-10-20'
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

	const filteredAlbums = albums.filter(album => {
		const matchesSearch = album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
							 album.artist.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesFilter = selectedFilter === 'all' || album.status === selectedFilter;
		return matchesSearch && matchesFilter;
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

	function handleCreateAlbum() {
		// 새 앨범 생성 로직
		console.log('새 앨범 생성');
	}
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
	<SearchFilterBar 
		bind:searchQuery
		bind:selectedFilter
		searchPlaceholder="앨범 또는 아티스트 검색..."
		showFilter={true}
		{filterOptions}
	/>

	<!-- 앨범 그리드 -->
	{#if filteredAlbums.length > 0}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{#each filteredAlbums as album (album.id)}
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
							<button class="play-button w-12 h-12 bg-brand-pink rounded-full flex items-center justify-center hover:bg-brand-pink/90 focus-visible:outline-2 focus-visible:outline-brand-pink focus-visible:outline-offset-2 transition-colors duration-200" aria-label="재생">
								<Play size={20} class="play-button-icon text-white" />
							</button>
						</div>
					</div>

					<!-- 앨범 정보 -->
					<div class="p-4">
						<div class="flex items-start justify-between gap-2 mb-1">
							<h3 class="font-semibold text-text-strong line-clamp-1 flex-1">{album.title}</h3>
							<span class="badge-base {getStatusColor(album.status)} flex-shrink-0 pr-0">
								{getStatusLabel(album.status)}
							</span>
						</div>
						<p class="text-sm text-text-muted mb-2">{album.artist} • {album.year}</p>
						
						<div class="flex items-center justify-between text-xs text-text-muted mb-3">
							<span>{album.tracks}곡</span>
							<span class="flex-shrink-0">{album.duration}</span>
						</div>

						<div class="flex items-center justify-between text-xs text-text-muted mb-2">
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
						<div class="flex items-baseline justify-between text-xs text-text-muted">
							<span class="leading-none">{album.created_at}</span>
							<div class="flex items-center -mr-4">
								<button class="w-8 h-8 inline-flex items-center justify-center rounded-md hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-brand-pink focus-visible:outline-offset-2 transition-colors duration-200" aria-label="편집" title="편집">
									<Edit size={14} class="text-text-muted" />
								</button>
								<button class="w-8 h-8 inline-flex items-center justify-center rounded-md hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-brand-pink focus-visible:outline-offset-2 transition-colors duration-200 -ml-1" aria-label="더보기" title="더보기">
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
