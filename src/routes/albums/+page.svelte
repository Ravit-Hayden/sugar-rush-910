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
		// 1. 작곡가/작사가 작업
		{
			id: '1',
			title: 'Sugar Rush Vol.1',
			artist: 'Sugar Rush',
			year: 2024,
			status: 'draft',
			tracks: 12,
			duration: '45:30',
			cover: '/api/placeholder/300/300',
			plays: 1250
		},
		{
			id: '2',
			title: 'Summer Night',
			artist: 'Sugar Rush',
			year: 2024,
			status: 'editing',
			tracks: 8,
			duration: '32:15',
			cover: '/api/placeholder/300/300',
			plays: 890
		},
		{
			id: '3',
			title: 'Demo Collection',
			artist: 'Various',
			year: 2024,
			status: 'revision_requested',
			tracks: 6,
			duration: '24:30',
			cover: '/api/placeholder/300/300',
			plays: 456
		},
		// 2. 편집자 작업
		{
			id: '4',
			title: 'Morning Light',
			artist: 'Sugar Rush',
			year: 2024,
			status: 'pending_review',
			tracks: 10,
			duration: '38:20',
			cover: '/api/placeholder/300/300',
			plays: 234
		},
		{
			id: '5',
			title: 'City Lights',
			artist: 'Sugar Rush',
			year: 2024,
			status: 'under_review',
			tracks: 9,
			duration: '35:45',
			cover: '/api/placeholder/300/300',
			plays: 345
		},
		{
			id: '6',
			title: 'Ocean Wave',
			artist: 'Sugar Rush',
			year: 2024,
			status: 'editing_complete',
			tracks: 11,
			duration: '42:10',
			cover: '/api/placeholder/300/300',
			plays: 567
		},
		{
			id: '7',
			title: 'Mountain Peak',
			artist: 'Various',
			year: 2024,
			status: 'approved',
			tracks: 7,
			duration: '28:50',
			cover: '/api/placeholder/300/300',
			plays: 890
		},
		// 3. 발매업체 작업
		{
			id: '8',
			title: 'Desert Storm',
			artist: 'Sugar Rush',
			year: 2024,
			status: 'scheduled',
			tracks: 12,
			duration: '48:15',
			cover: '/api/placeholder/300/300',
			plays: 1120
		},
		{
			id: '9',
			title: 'Sugar Rush Vol.2',
			artist: 'Sugar Rush',
			year: 2024,
			status: 'published',
			tracks: 15,
			duration: '56:30',
			cover: '/api/placeholder/300/300',
			plays: 2150
		},
		// 4. 공통 상태
		{
			id: '10',
			title: 'Evening Breeze',
			artist: 'Sugar Rush',
			year: 2024,
			status: 'paused',
			tracks: 5,
			duration: '20:00',
			cover: '/api/placeholder/300/300',
			plays: 0
		},
		{
			id: '11',
			title: 'Midnight Drive',
			artist: 'Various',
			year: 2024,
			status: 'archived',
			tracks: 8,
			duration: '28:15',
			cover: '/api/placeholder/300/300',
			plays: 234
		},
		// 5. 삭제됨
		{
			id: '12',
			title: 'Deleted Album',
			artist: 'Sugar Rush',
			year: 2024,
			status: 'deleted',
			tracks: 3,
			duration: '12:30',
			cover: '/api/placeholder/300/300',
			plays: 0
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
		// 작곡가/작사가 작업
		{ value: 'draft', label: '초안' },
		{ value: 'editing', label: '수정 중' },
		{ value: 'revision_requested', label: '수정 요청' },
		// 편집자 작업
		{ value: 'pending_review', label: '검토 대기' },
		{ value: 'under_review', label: '검토 중' },
		{ value: 'editing_complete', label: '편집 완료' },
		{ value: 'approved', label: '승인됨' },
		// 발매업체 작업
		{ value: 'scheduled', label: '발매 예정' },
		{ value: 'published', label: '발매됨' },
		// 공통 상태
		{ value: 'paused', label: '일시정지' },
		{ value: 'archived', label: '보관됨' },
		{ value: 'deleted', label: '삭제됨' }
	];

	function handleCreateAlbum() {
		// 새 앨범 생성 로직
		console.log('새 앨범 생성');
	}
</script>

<PageContent>
	<PageHeader 
		title="앨범 관리" 
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
						<div class="absolute inset-0 flex items-center justify-center">
							<Disc3 size={48} class="text-text-muted" />
						</div>
						<!-- 플레이 버튼 (호버 시) -->
						<div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
							<button class="play-button w-12 h-12 bg-brand-pink rounded-full flex items-center justify-center transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-brand-pink focus-visible:outline-offset-2">
								<Play size={20} class="play-button-icon text-white" />
							</button>
						</div>
						<!-- 상태 배지 -->
						<div class="absolute top-2 right-2">
							<span class="badge-base {getStatusColor(album.status)}">
								{getStatusLabel(album.status)}
							</span>
						</div>
					</div>

					<!-- 앨범 정보 -->
					<div class="p-4">
						<h3 class="font-semibold text-text-strong mb-1 line-clamp-1">{album.title}</h3>
						<p class="text-sm text-text-muted mb-2">{album.artist} • {album.year}</p>
						
						<div class="flex items-center justify-between text-xs text-text-muted mb-3">
							<span>{album.tracks}곡</span>
							<span>{album.duration}</span>
						</div>

						<div class="flex items-center justify-between">
							<span class="text-xs text-text-muted">{album.plays.toLocaleString()}회 재생</span>
							<div class="flex items-center gap-1">
								<button class="w-8 h-8 inline-flex items-center justify-center rounded-md hover:bg-surface-2 transition-colors">
									<Edit size={14} class="text-text-muted" />
								</button>
								<button class="w-8 h-8 inline-flex items-center justify-center rounded-md hover:bg-surface-2 transition-colors">
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
