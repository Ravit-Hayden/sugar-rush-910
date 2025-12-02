<script lang="ts">
	import { Music, Plus, Play, ChevronRight } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';
	import SearchFilterBar from '$lib/components/SearchFilterBar.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import { getStatusColor, getStatusLabel } from '$lib/utils/status';

	let searchQuery = '';
	let selectedGenre = 'all';
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
		// 추가 샘플 - 각 상태값별로 더 많은 예시
		{
			id: '13',
			title: 'Another Draft',
			artist: 'Various',
			album: 'Demo Collection',
			genre: 'Pop',
			duration: '3:50',
			status: 'draft',
			plays: 89,
			likes: 5,
			fileSize: '7.5MB'
		},
		{
			id: '14',
			title: 'Still Editing',
			artist: 'Sugar Rush',
			album: 'Sugar Rush Vol.1',
			genre: 'Jazz',
			duration: '5:15',
			status: 'editing',
			plays: 156,
			likes: 9,
			fileSize: '10.8MB'
		},
		{
			id: '15',
			title: 'Revision Needed',
			artist: 'Various',
			album: 'Demo Collection',
			genre: 'Classical',
			duration: '6:30',
			status: 'revision_requested',
			plays: 201,
			likes: 12,
			fileSize: '13.2MB'
		},
		{
			id: '16',
			title: 'Waiting Review',
			artist: 'Sugar Rush',
			album: 'Sugar Rush Vol.2',
			genre: 'Rock',
			duration: '4:25',
			status: 'pending_review',
			plays: 312,
			likes: 18,
			fileSize: '9.1MB'
		},
		{
			id: '17',
			title: 'In Review',
			artist: 'Sugar Rush',
			album: 'Sugar Rush Vol.1',
			genre: 'Electronic',
			duration: '3:55',
			status: 'under_review',
			plays: 445,
			likes: 27,
			fileSize: '8.3MB'
		},
		{
			id: '18',
			title: 'Edit Done',
			artist: 'Various',
			album: 'Demo Collection',
			genre: 'Pop',
			duration: '4:10',
			status: 'editing_complete',
			plays: 523,
			likes: 31,
			fileSize: '8.7MB'
		},
		{
			id: '19',
			title: 'Approved Track',
			artist: 'Sugar Rush',
			album: 'Sugar Rush Vol.2',
			genre: 'Jazz',
			duration: '5:40',
			status: 'approved',
			plays: 678,
			likes: 42,
			fileSize: '11.5MB'
		},
		{
			id: '20',
			title: 'Scheduled Release',
			artist: 'Sugar Rush',
			album: 'Sugar Rush Vol.1',
			genre: 'Electronic',
			duration: '4:00',
			status: 'scheduled',
			plays: 789,
			likes: 51,
			fileSize: '8.4MB'
		},
		{
			id: '21',
			title: 'Published Song',
			artist: 'Sugar Rush',
			album: 'Sugar Rush Vol.2',
			genre: 'Pop',
			duration: '3:35',
			status: 'published',
			plays: 1456,
			likes: 98,
			fileSize: '7.6MB'
		},
		{
			id: '22',
			title: 'Paused Track',
			artist: 'Various',
			album: 'Demo Collection',
			genre: 'Rock',
			duration: '4:50',
			status: 'paused',
			plays: 0,
			likes: 0,
			fileSize: '9.8MB'
		},
		{
			id: '23',
			title: 'Archived Song',
			artist: 'Sugar Rush',
			album: 'Sugar Rush Vol.1',
			genre: 'Classical',
			duration: '6:20',
			status: 'archived',
			plays: 189,
			likes: 11,
			fileSize: '12.8MB'
		},
		{
			id: '24',
			title: 'Removed Track',
			artist: 'Various',
			album: 'Demo Collection',
			genre: 'Jazz',
			duration: '4:15',
			status: 'deleted',
			plays: 0,
			likes: 0,
			fileSize: '8.9MB'
		}
	];

	const genres = ['all', 'Electronic', 'Pop', 'Rock', 'Jazz', 'Classical'];
	const filterOptions = genres.map(genre => ({
		value: genre,
		label: genre === 'all' ? '모든 장르' : genre
	}));


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
		title="트랙" 
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
		<div class="max-w-full overflow-hidden">
			<!-- 모바일/태블릿: 카드 레이아웃 -->
			<div class="lg:hidden space-y-4">
				{#each filteredTracks as track (track.id)}
					<div class="border rounded-xl bg-bg p-4 sm:p-5 shadow-sm" style="border-color: var(--border-subtle);">
						<!-- 트랙 정보 (전체 너비) -->
						<div class="mb-4">
							<div class="flex gap-3 items-center min-w-0">
								<button aria-label="재생" class="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 bg-surface-2 rounded-full flex items-center justify-center hover:bg-brand-pink hover:text-white focus:outline-none focus-visible:outline-2 focus-visible:outline-brand-pink focus-visible:outline-offset-2 transition-colors duration-200 shadow-sm">
									<Play size={16} class="sm:w-5 sm:h-5 ml-0.5" />
								</button>
								<div class="min-w-0 flex-1">
									<div class="font-semibold text-brand-pink break-words text-base sm:text-lg">{track.title}</div>
									<div class="text-text-muted text-xs sm:text-sm mt-0.5">{track.fileSize}</div>
								</div>
							</div>
						</div>
						<!-- 나머지 정보를 2열 그리드로 배치 -->
						<div class="grid grid-cols-2 gap-x-4 gap-y-3 sm:gap-x-6 sm:gap-y-4 -mx-4 sm:-mx-5 px-4 sm:px-5 pt-4 border-t" style="border-color: var(--border-subtle);">
							<div class="flex flex-col">
								<div class="text-[10px] sm:text-xs text-text-muted mb-1.5 sm:mb-1.5 font-normal uppercase tracking-wider">아티스트</div>
								<div class="text-sm sm:text-base font-semibold sm:font-semibold text-text-strong sm:text-text-strong">{track.artist}</div>
							</div>
							<div class="flex flex-col">
								<div class="text-[10px] sm:text-xs text-text-muted mb-1.5 sm:mb-1.5 font-normal uppercase tracking-wider">앨범</div>
								<div class="text-sm sm:text-base font-medium sm:font-normal text-text-strong sm:text-text-muted break-words">{track.album}</div>
							</div>
							<div class="flex flex-col">
								<div class="text-[10px] sm:text-xs text-text-muted mb-1.5 sm:mb-1.5 font-normal uppercase tracking-wider">길이</div>
								<div class="text-sm sm:text-base font-medium sm:font-normal text-text-strong sm:text-text-muted">{track.duration}</div>
							</div>
							<div class="flex flex-col">
								<div class="text-[10px] sm:text-xs text-text-muted mb-1.5 sm:mb-1.5 font-normal uppercase tracking-wider">장르</div>
								<div class="text-sm sm:text-base font-medium sm:font-normal text-text-strong sm:text-text-muted">{track.genre}</div>
							</div>
							<div class="flex flex-col">
								<div class="text-[10px] sm:text-xs text-text-muted mb-1.5 sm:mb-1.5 font-normal uppercase tracking-wider">상태</div>
								<span class="inline-block whitespace-nowrap badge-base {getStatusColor(track.status)} -ml-2 pl-0 lg:pl-2">
									{getStatusLabel(track.status)}
								</span>
							</div>
							<div class="flex flex-col">
								<div class="text-[10px] sm:text-xs text-text-muted mb-1.5 sm:mb-1.5 font-normal uppercase tracking-wider">통계</div>
								<div class="space-y-1 sm:space-y-0.5">
									<div class="text-sm sm:text-base">
										<span class="font-semibold sm:font-normal text-hover-cyan sm:text-text-muted">{track.plays.toLocaleString()}</span>
										<span class="text-text-muted text-sm sm:text-base">회 재생</span>
									</div>
									<div class="text-sm sm:text-base">
										<span class="font-semibold sm:font-normal text-hover-cyan sm:text-text-muted">{track.likes}</span>
										<span class="text-text-muted text-sm sm:text-base"> 좋아요</span>
									</div>
								</div>
							</div>
							<div class="flex flex-col col-span-2">
								<div class="flex flex-row gap-2">
									<button class="action-button h-9 w-auto px-5 whitespace-nowrap rounded-md border border-border-subtle bg-surface-2 focus-visible:outline-2 focus-visible:outline-brand-pink focus-visible:outline-offset-2 text-sm font-medium">
										<span class="action-button-text">편집</span>
									</button>
									<button aria-label="더보기" class="action-button h-9 w-9 flex items-center justify-center rounded-md border border-border-subtle bg-surface-2 focus-visible:outline-2 focus-visible:outline-brand-pink focus-visible:outline-offset-2">
										<ChevronRight size={20} class="action-button-icon" />
									</button>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<!-- 데스크톱: 테이블 레이아웃 -->
			<div class="hidden lg:block border rounded-lg overflow-hidden" style="border-color: var(--border-subtle);">
				<div class="overflow-x-auto">
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
						{#each filteredTracks as track (track.id)}
							<tr class="border-b last:border-b-0" style="border-color: var(--border-subtle);">
								<td class="py-4 text-left text-sm min-w-0" style="width: 25%; padding-left: 1rem; padding-right: 1rem;">
									<div class="flex gap-3 items-center min-w-0">
										<button aria-label="재생" class="w-8 h-8 flex-shrink-0 bg-surface-2 rounded-full flex items-center justify-center hover:bg-brand-pink hover:text-white focus:outline-none focus-visible:outline-2 focus-visible:outline-brand-pink focus-visible:outline-offset-2 transition-colors duration-200 shadow-sm">
											<Play size={16} class="w-4 h-4 ml-0.5" />
										</button>
										<div class="min-w-0 flex-1">
											<div class="font-medium text-brand-pink break-words text-sm">{track.title}</div>
											<div class="text-text-muted text-xs mt-0.5">{track.fileSize}</div>
										</div>
									</div>
								</td>
								<td class="py-4 text-left text-xs sm:text-sm font-medium text-text-strong" style="width: 12%; padding-left: 1rem; padding-right: 1rem;">
									{track.artist}
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
								<td class="py-4 text-left text-xs sm:text-sm" style="width: 10%; padding-left: 1rem; padding-right: 1rem;">
									<span class="badge-base {getStatusColor(track.status)} -ml-2 pl-2">
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
								<td class="py-4 text-right text-xs sm:text-sm font-medium" style="width: 13%; padding-left: 1rem; padding-right: 1rem;">
									<div class="flex gap-1 justify-end items-center">
										<button class="action-button h-8 w-auto px-3 whitespace-nowrap rounded-md border border-border-subtle bg-surface-2 focus-visible:outline-2 focus-visible:outline-brand-pink focus-visible:outline-offset-2 text-xs sm:text-sm font-medium">
											<span class="action-button-text">편집</span>
										</button>
										<button aria-label="더보기" class="action-button h-8 w-8 flex items-center justify-center rounded-md border border-border-subtle bg-surface-2 focus-visible:outline-2 focus-visible:outline-brand-pink focus-visible:outline-offset-2">
											<ChevronRight size={16} class="action-button-icon" />
										</button>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
				</div>
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
