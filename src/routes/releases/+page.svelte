<script lang="ts">
	import { Rocket, Calendar, Clock, CheckCircle, AlertCircle, Play } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';
	import SearchFilterBar from '$lib/components/SearchFilterBar.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';

	let searchQuery = '';
	let selectedFilter = 'all';

	let releases = [
		{
			id: '1',
			title: 'Sugar Rush Vol.1',
			status: 'scheduled',
			releaseDate: '2024-12-31',
			platforms: ['Spotify', 'Apple Music', 'YouTube Music'],
			progress: 90
		},
		{
			id: '2',
			title: 'Summer Night',
			status: 'live',
			releaseDate: '2024-10-15',
			platforms: ['Spotify', 'Apple Music'],
			progress: 100
		},
		{
			id: '3',
			title: 'Demo Collection',
			status: 'draft',
			releaseDate: '2024-11-20',
			platforms: ['SoundCloud'],
			progress: 60
		}
	];

	function getStatusColor(status: string) {
		switch (status) {
			case 'live': return 'badge-low-green';
			case 'scheduled': return 'badge-info-blue';
			case 'draft': return 'badge-medium-yellow';
			default: return 'text-text-muted';
		}
	}

	function getStatusLabel(status: string) {
		switch (status) {
			case 'live': return '발매됨';
			case 'scheduled': return '예정됨';
			case 'draft': return '초안';
			default: return '알 수 없음';
		}
	}

	function handleCreateRelease() {
		console.log('새 발매 생성');
	}

	const statusOptions = [
		{ value: 'all', label: '모든 상태' },
		{ value: 'live', label: '발매됨' },
		{ value: 'scheduled', label: '예정됨' },
		{ value: 'draft', label: '초안' }
	];

	const filteredReleases = releases.filter(release => {
		const matchesSearch = release.title.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesFilter = selectedFilter === 'all' || release.status === selectedFilter;
		return matchesSearch && matchesFilter;
	});
</script>

<PageContent>
	<PageHeader 
		title="발매 관리" 
		description="음악 발매를 계획하고 관리하세요."
		actions={[
			{
				icon: Rocket,
				label: '새 발매 생성',
				onclick: handleCreateRelease
			}
		]}
	/>

	<!-- 검색 및 필터 -->
	<SearchFilterBar
		bind:searchQuery
		bind:selectedFilter
		searchPlaceholder="발매 제목 검색..."
		showFilter={true}
		filterOptions={statusOptions}
	/>

	{#if filteredReleases.length > 0}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each filteredReleases as release (release.id)}
			<div class="bg-surface-1 rounded-lg p-6 hover:bg-surface-2 transition-colors duration-200 border border-border-subtle">
				<div class="flex items-start justify-between mb-4">
					<h3 class="text-lg font-semibold text-text-strong">{release.title}</h3>
					<span class="badge-base {getStatusColor(release.status)}">
						{getStatusLabel(release.status)}
					</span>
				</div>

				<div class="space-y-3">
					<div class="flex items-center gap-2 text-sm text-text-muted">
						<Calendar size={16} />
						<span>{release.releaseDate}</span>
					</div>

					<div>
						<div class="flex items-center justify-between text-sm mb-1">
							<span class="text-text-muted">준비도</span>
							<span class="text-text-strong">{release.progress}%</span>
						</div>
						<div class="w-full bg-surface-2 rounded-full h-2">
							<div 
								class="bg-brand-pink h-2 rounded-full transition-all duration-300" 
								style="width: {release.progress}%"
							></div>
						</div>
					</div>

					<div class="text-sm text-text-muted">
						<div class="font-medium mb-1">플랫폼:</div>
						<div class="flex flex-wrap gap-1">
							{#each release.platforms as platform}
								<span class="px-2 py-1 bg-surface-2 rounded text-xs border border-border-subtle">{platform}</span>
							{/each}
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
	{:else}
		<EmptyState
			title="발매를 찾을 수 없습니다"
			description={searchQuery ? '검색 조건에 맞는 발매가 없습니다.' : '아직 발매가 없습니다.'}
			actionLabel="첫 번째 발매 생성"
			onAction={handleCreateRelease}
		/>
	{/if}
</PageContent>
