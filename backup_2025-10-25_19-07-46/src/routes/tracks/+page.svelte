<script lang="ts">
	import { Music, Plus, Play, Edit, Download, Share, Video } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';
	import SearchFilterBar from '$lib/components/SearchFilterBar.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';

	let searchQuery = '';
	let selectedGenre = 'all';
	let tracks = [
		{
			id: '1',
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
			id: '2',
			title: 'Summer Night',
			artist: 'Sugar Rush',
			album: 'Summer Night',
			genre: 'Pop',
			duration: '3:30',
			status: 'published',
			plays: 890,
			likes: 67,
			fileSize: '7.8MB'
		},
		{
			id: '3',
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
			id: '4',
			title: 'Midnight Drive',
			artist: 'Sugar Rush',
			album: 'Sugar Rush Vol.1',
			genre: 'Electronic',
			duration: '4:05',
			status: 'published',
			plays: 678,
			likes: 45,
			fileSize: '8.9MB'
		}
	];

	const genres = ['all', 'Electronic', 'Pop', 'Rock', 'Jazz', 'Classical'];
	const filterOptions = genres.map(genre => ({
		value: genre,
		label: genre === 'all' ? '모든 장르' : genre
	}));

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

	const filteredTracks = tracks.filter(track => {
		const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
							 track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
							 track.album.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesGenre = selectedGenre === 'all' || track.genre === selectedGenre;
		return matchesSearch && matchesGenre;
	});

	function handleCreateTrack() {
		console.log('새 트랙 추가');
	}
</script>
<PageContent>
	<PageHeader 
		title="트랙 관리" 
		description="음악 트랙을 관리하고 분석하세요."
		actions={[
			{
				icon: Plus,
				label: '새 트랙 추가',
				onclick: handleCreateTrack
			}
		]}
	/>

	<!-- 검색 및 필터 -->
	<SearchFilterBar 
		bind:searchQuery
		bind:selectedFilter={selectedGenre}
		searchPlaceholder="트랙, 아티스트 또는 앨범 검색..."
		showFilter={true}
		{filterOptions}
	/>

	<!-- 트랙 목록 -->
	{#if filteredTracks.length > 0}
		<div class="bg-surface-1 rounded-lg overflow-hidden border border-border-subtle">
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead class="bg-surface-2 border-b border-border-subtle">
						<tr>
							<th class="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">트랙</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">아티스트</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">앨범</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">장르</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">재생시간</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">상태</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">통계</th>
							<th class="px-6 py-3 text-right text-xs font-medium text-text-muted uppercase tracking-wider">작업</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-border-subtle">
						{#each filteredTracks as track (track.id)}
							<tr class="hover:bg-surface-2 transition-colors duration-200">
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="flex items-center gap-3">
										<button class="w-8 h-8 bg-surface-2 rounded-full flex items-center justify-center hover:bg-brand-pink hover:text-white transition-colors duration-200">
											<Play size={14} class="ml-0.5" />
										</button>
										<div>
											<div class="text-sm font-medium text-text-strong">{track.title}</div>
											<div class="text-xs text-text-muted">{track.fileSize}</div>
										</div>
									</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-text-strong">{track.artist}</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-text-muted">{track.album}</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-text-muted">{track.genre}</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-text-muted">{track.duration}</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<span class="badge-base {getStatusColor(track.status)}">
										{getStatusLabel(track.status)}
									</span>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-xs text-text-muted">
										<div>{track.plays.toLocaleString()}회 재생</div>
										<div>{track.likes} 좋아요</div>
									</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
									<div class="flex items-center justify-end gap-1">
										<button class="w-8 h-8 inline-flex items-center justify-center rounded-md hover:bg-surface-2 transition-colors" title="뮤직비디오 생성">
											<Video size={14} class="text-text-muted" />
										</button>
										<button class="w-8 h-8 inline-flex items-center justify-center rounded-md hover:bg-surface-2 transition-colors" title="편집">
											<Edit size={14} class="text-text-muted" />
										</button>
										<button class="w-8 h-8 inline-flex items-center justify-center rounded-md hover:bg-surface-2 transition-colors" title="다운로드">
											<Download size={14} class="text-text-muted" />
										</button>
										<button class="w-8 h-8 inline-flex items-center justify-center rounded-md hover:bg-surface-2 transition-colors" title="공유">
											<Share size={14} class="text-text-muted" />
										</button>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{:else}
		<EmptyState 
			icon={Music}
			title="트랙을 찾을 수 없습니다"
			description={searchQuery ? '검색 조건에 맞는 트랙이 없습니다.' : '아직 트랙이 없습니다.'}
			actionLabel="첫 번째 트랙 추가"
			onAction={handleCreateTrack}
		/>
	{/if}
</PageContent>
