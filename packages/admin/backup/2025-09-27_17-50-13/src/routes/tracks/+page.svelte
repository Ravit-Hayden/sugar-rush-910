<script lang="ts">
	import { Music, Plus, Search, Play, Pause, Edit, Trash2, Download, Share } from 'lucide-svelte';

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

	const filteredTracks = tracks.filter(track => {
		const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
							 track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
							 track.album.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesGenre = selectedGenre === 'all' || track.genre === selectedGenre;
		return matchesSearch && matchesGenre;
	});
</script>

<div class="py-6">
	<div class="max-w-7xl mx-auto">
		<!-- 헤더 -->
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
			<div>
				<h1 class="text-3xl font-bold text-text-strong mb-2">트랙 관리</h1>
				<p class="text-text-muted">음악 트랙을 관리하고 분석하세요.</p>
			</div>
			<button class="inline-flex items-center gap-2 px-4 py-2 bg-brand-pink text-white rounded-md hover:bg-brand-pink/90 transition-colors">
				<Plus size={16} />
				새 트랙 추가
			</button>
		</div>

		<!-- 검색 및 필터 -->
		<div class="flex flex-col sm:flex-row gap-4 mb-8">
			<div class="flex-1 relative">
				<Search size={16} class="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
				<input 
					type="text" 
					placeholder="트랙, 아티스트 또는 앨범 검색..."
					bind:value={searchQuery}
					class="w-full pl-10 pr-4 py-2 bg-surface-2 border border-border-subtle rounded-md text-text-strong placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent"
				/>
			</div>
			<select 
				bind:value={selectedGenre}
				class="px-4 py-2 bg-surface-2 border border-border-subtle rounded-md text-text-strong focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent"
			>
				{#each genres as genre}
					<option value={genre}>{genre === 'all' ? '모든 장르' : genre}</option>
				{/each}
			</select>
		</div>

		<!-- 트랙 목록 -->
		<div class="bg-surface-2 rounded-lg overflow-hidden">
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead class="bg-surface-1 border-b border-border-subtle">
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
							<tr class="hover:bg-surface-1 transition-colors">
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="flex items-center gap-3">
										<button class="w-8 h-8 bg-surface-1 rounded-full flex items-center justify-center hover:bg-brand-pink hover:text-white transition-colors">
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
									<span class="px-2 py-1 text-xs font-medium rounded-full {getStatusColor(track.status)}">
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
										<button class="p-1 hover:bg-surface-2 rounded transition-colors" title="편집">
											<Edit size={14} class="text-text-muted" />
										</button>
										<button class="p-1 hover:bg-surface-2 rounded transition-colors" title="다운로드">
											<Download size={14} class="text-text-muted" />
										</button>
										<button class="p-1 hover:bg-surface-2 rounded transition-colors" title="공유">
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

		<!-- 빈 상태 -->
		{#if filteredTracks.length === 0}
			<div class="text-center py-12">
				<Music size={48} class="text-text-muted mx-auto mb-4" />
				<h3 class="text-lg font-semibold text-text-strong mb-2">트랙을 찾을 수 없습니다</h3>
				<p class="text-text-muted mb-4">
					{searchQuery ? '검색 조건에 맞는 트랙이 없습니다.' : '아직 트랙이 없습니다.'}
				</p>
				<button class="inline-flex items-center gap-2 px-4 py-2 bg-brand-pink text-white rounded-md hover:bg-brand-pink/90 transition-colors">
					<Plus size={16} />
					첫 번째 트랙 추가
				</button>
			</div>
		{/if}
	</div>
</div>
