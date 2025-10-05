<script lang="ts">
	import { Disc3, Plus, Search, Filter, MoreVertical, Play, Pause, Edit, Trash2 } from 'lucide-svelte';

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
			case 'published': return 'text-green-500 bg-green-500/10';
			case 'draft': return 'text-yellow-500 bg-yellow-500/10';
			case 'archived': return 'text-gray-500 bg-gray-500/10';
			default: return 'text-gray-500 bg-gray-500/10';
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
</script>

<div class="py-6">
	<div class="max-w-7xl mx-auto">
		<!-- 헤더 -->
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
			<div>
				<h1 class="text-3xl font-bold text-text-strong mb-2">앨범 관리</h1>
				<p class="text-text-muted">음악 앨범을 관리하고 발매하세요.</p>
			</div>
			<button class="inline-flex items-center gap-2 px-4 py-2 bg-brand-pink text-white rounded-md hover:bg-brand-pink/90 transition-colors">
				<Plus size={16} />
				새 앨범 만들기
			</button>
		</div>

		<!-- 검색 및 필터 -->
		<div class="flex flex-col sm:flex-row gap-4 mb-8">
			<div class="flex-1 relative">
				<Search size={16} class="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
				<input 
					type="text" 
					placeholder="앨범 또는 아티스트 검색..."
					bind:value={searchQuery}
					class="w-full pl-10 pr-4 py-2 bg-surface-2 border border-border-subtle rounded-md text-text-strong placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent"
				/>
			</div>
			<select 
				bind:value={selectedFilter}
				class="px-4 py-2 bg-surface-2 border border-border-subtle rounded-md text-text-strong focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent"
			>
				<option value="all">모든 상태</option>
				<option value="published">발매됨</option>
				<option value="draft">초안</option>
				<option value="archived">보관됨</option>
			</select>
		</div>

		<!-- 앨범 그리드 -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{#each filteredAlbums as album (album.id)}
				<div class="bg-surface-2 rounded-lg overflow-hidden hover:bg-surface-1 transition-colors group">
					<!-- 앨범 커버 -->
					<div class="relative aspect-square bg-surface-1">
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
							<span class="px-2 py-1 text-xs font-medium rounded-full {getStatusColor(album.status)}">
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
								<button class="p-1 hover:bg-surface-1 rounded transition-colors">
									<Edit size={14} class="text-text-muted" />
								</button>
								<button class="p-1 hover:bg-surface-1 rounded transition-colors">
									<MoreVertical size={14} class="text-text-muted" />
								</button>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- 빈 상태 -->
		{#if filteredAlbums.length === 0}
			<div class="text-center py-12">
				<Disc3 size={48} class="text-text-muted mx-auto mb-4" />
				<h3 class="text-lg font-semibold text-text-strong mb-2">앨범을 찾을 수 없습니다</h3>
				<p class="text-text-muted mb-4">
					{searchQuery ? '검색 조건에 맞는 앨범이 없습니다.' : '아직 앨범이 없습니다.'}
				</p>
				<button class="inline-flex items-center gap-2 px-4 py-2 bg-brand-pink text-white rounded-md hover:bg-brand-pink/90 transition-colors">
					<Plus size={16} />
					첫 번째 앨범 만들기
				</button>
			</div>
		{/if}
	</div>
</div>
