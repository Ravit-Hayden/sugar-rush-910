<script lang="ts">
	import { Disc3, Plus, MoreVertical, Play, Edit } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';
	import SearchFilterBar from '$lib/components/SearchFilterBar.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';

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
			cover: '/api/placeholder/300/300',
			plays: 1250
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
			plays: 890
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
			plays: 456
		}
	];

	function getStatusColor(status: string) {
		switch (status) {
			case 'published': return 'badge-low-green';
			case 'draft': return 'badge-medium-yellow';
			case 'archived': return 'text-text-muted';
			default: return 'text-text-muted';
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

	const filteredAlbums = albums.filter(album => {
		const matchesSearch = album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
							 album.artist.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesFilter = selectedFilter === 'all' || album.status === selectedFilter;
		return matchesSearch && matchesFilter;
	});

	const filterOptions = [
		{ value: 'all', label: '모든 상태' },
		{ value: 'published', label: '발매됨' },
		{ value: 'draft', label: '초안' },
		{ value: 'archived', label: '보관됨' }
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
				<div class="bg-surface-1 rounded-lg overflow-hidden hover:bg-surface-2 transition-colors duration-200 group border border-border-subtle">
					<!-- 앨범 커버 -->
					<div class="relative aspect-square bg-surface-2">
						<div class="absolute inset-0 flex items-center justify-center">
							<Disc3 size={48} class="text-text-muted" />
						</div>
						<!-- 플레이 버튼 (호버 시) -->
						<div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
							<button class="w-12 h-12 bg-brand-pink rounded-full flex items-center justify-center hover:bg-brand-pink/90 transition-colors">
								<Play size={20} class="text-white ml-1" />
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
