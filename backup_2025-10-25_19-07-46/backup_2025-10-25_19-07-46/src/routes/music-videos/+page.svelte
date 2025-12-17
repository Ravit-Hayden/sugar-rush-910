<script lang="ts">
	import { Video, Plus, Play, Edit, Download, Share, Image, Users, Palette, Settings } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';
	import SearchFilterBar from '$lib/components/SearchFilterBar.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';

	let searchQuery = '';
	let selectedFilter = 'all';
	let selectedTab = 'videos'; // videos, characters, assets

	let musicVideos = [
		{
			id: '1',
			title: 'Sugar Rush MV',
			track: 'Sugar Rush',
			album: 'Sugar Rush Vol.1',
			status: 'published',
			duration: '3:45',
			views: 12500,
			likes: 890,
			thumbnail: '/api/placeholder/300/200',
			progress: 100,
			characters: ['Sugar Girl', 'Beat Boy'],
			created_at: '2024-10-01'
		},
		{
			id: '2',
			title: 'Summer Night MV',
			track: 'Summer Night',
			album: 'Summer Night',
			status: 'editing',
			duration: '3:30',
			views: 0,
			likes: 0,
			thumbnail: '/api/placeholder/300/200',
			progress: 75,
			characters: ['Summer Girl'],
			created_at: '2024-10-15'
		},
		{
			id: '3',
			title: 'Midnight Drive MV',
			track: 'Midnight Drive',
			album: 'Sugar Rush Vol.1',
			status: 'generating',
			duration: '4:05',
			views: 0,
			likes: 0,
			thumbnail: '/api/placeholder/300/200',
			progress: 45,
			characters: ['Night Rider'],
			created_at: '2024-10-20'
		}
	];

	let characters = [
		{
			id: '1',
			name: 'Sugar Girl',
			description: '달콤한 음악의 상징 캐릭터',
			image: '/api/placeholder/200/200',
			style: 'cute',
			color_palette: ['#FF69B4', '#FFB6C1', '#FFC0CB'],
			usage_count: 3,
			created_at: '2024-09-15'
		},
		{
			id: '2',
			name: 'Beat Boy',
			description: '리듬감 넘치는 댄서 캐릭터',
			image: '/api/placeholder/200/200',
			style: 'cool',
			color_palette: ['#4169E1', '#87CEEB', '#B0C4DE'],
			usage_count: 1,
			created_at: '2024-09-20'
		},
		{
			id: '3',
			name: 'Summer Girl',
			description: '여름의 상쾌함을 표현하는 캐릭터',
			image: '/api/placeholder/200/200',
			style: 'fresh',
			color_palette: ['#FFD700', '#FFA500', '#FFE4B5'],
			usage_count: 1,
			created_at: '2024-10-01'
		}
	];

	let assets = [
		{
			id: '1',
			name: 'Neon City Background',
			type: 'background',
			image: '/api/placeholder/300/200',
			usage_count: 2,
			tags: ['city', 'neon', 'night'],
			created_at: '2024-09-10'
		},
		{
			id: '2',
			name: 'Music Notes Animation',
			type: 'animation',
			image: '/api/placeholder/300/200',
			usage_count: 5,
			tags: ['music', 'notes', 'animation'],
			created_at: '2024-09-12'
		},
		{
			id: '3',
			name: 'Particle Effects',
			type: 'effect',
			image: '/api/placeholder/300/200',
			usage_count: 3,
			tags: ['particles', 'effects', 'sparkle'],
			created_at: '2024-09-15'
		}
	];

	const statusOptions = [
		{ value: 'all', label: '모든 상태' },
		{ value: 'draft', label: '초안' },
		{ value: 'generating', label: '생성 중' },
		{ value: 'editing', label: '편집 중' },
		{ value: 'review', label: '검토 중' },
		{ value: 'published', label: '발매됨' },
		{ value: 'archived', label: '보관됨' }
	];

	function getStatusColor(status: string) {
		switch (status) {
			case 'published': return 'badge-low-green';
			case 'editing': return 'badge-info-blue';
			case 'generating': return 'badge-medium-yellow';
			case 'review': return 'badge-high-urgent';
			case 'draft': return 'text-text-muted';
			case 'archived': return 'text-text-muted';
			default: return 'text-text-muted';
		}
	}

	function getStatusLabel(status: string) {
		switch (status) {
			case 'published': return '발매됨';
			case 'editing': return '편집 중';
			case 'generating': return '생성 중';
			case 'review': return '검토 중';
			case 'draft': return '초안';
			case 'archived': return '보관됨';
			default: return '알 수 없음';
		}
	}

	function getStyleColor(style: string) {
		switch (style) {
			case 'cute': return 'badge-low-green';
			case 'cool': return 'badge-info-blue';
			case 'fresh': return 'badge-medium-yellow';
			default: return 'text-text-muted';
		}
	}

	function getStyleLabel(style: string) {
		switch (style) {
			case 'cute': return '귀여운';
			case 'cool': return '쿨한';
			case 'fresh': return '상쾌한';
			default: return '기본';
		}
	}

	function getTypeColor(type: string) {
		switch (type) {
			case 'background': return 'badge-info-blue';
			case 'animation': return 'badge-low-green';
			case 'effect': return 'badge-medium-yellow';
			default: return 'text-text-muted';
		}
	}

	function getTypeLabel(type: string) {
		switch (type) {
			case 'background': return '배경';
			case 'animation': return '애니메이션';
			case 'effect': return '효과';
			default: return '기타';
		}
	}

	const filteredMusicVideos = musicVideos.filter(video => {
		const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
							 video.track.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesFilter = selectedFilter === 'all' || video.status === selectedFilter;
		return matchesSearch && matchesFilter;
	});

	const filteredCharacters = characters.filter(character => {
		return character.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			   character.description.toLowerCase().includes(searchQuery.toLowerCase());
	});

	const filteredAssets = assets.filter(asset => {
		return asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			   asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
	});

	function handleCreateVideo() {
		// 뮤직비디오 생성 로직
		console.log('새 뮤직비디오 생성');
	}

	function handleCreateCharacter() {
		// 캐릭터 생성 로직
		console.log('새 캐릭터 생성');
	}

	function handleUploadAsset() {
		// 에셋 업로드 로직
		console.log('새 에셋 업로드');
	}
</script>

<PageContent>
	<PageHeader 
		title="뮤직비디오 센터" 
		description="AI로 뮤직비디오를 생성하고 캐릭터, 에셋을 관리하세요."
		actions={[
			{
				icon: Plus,
				label: '새 뮤직비디오',
				onclick: handleCreateVideo
			}
		]}
	/>

	<!-- 탭 네비게이션 -->
	<div class="mb-8">
		<div class="border-b border-border-subtle">
			<nav class="-mb-px flex space-x-8">
				<button
					onclick={() => selectedTab = 'videos'}
					class="py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 {selectedTab === 'videos' ? 'border-brand-pink text-brand-pink' : 'border-transparent text-text-muted hover:text-text-strong hover:border-border-subtle'}"
					type="button"
				>
					<div class="flex items-center gap-2">
						<Video size={16} />
						뮤직비디오 ({musicVideos.length})
					</div>
				</button>
				<button
					onclick={() => selectedTab = 'characters'}
					class="py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 {selectedTab === 'characters' ? 'border-brand-pink text-brand-pink' : 'border-transparent text-text-muted hover:text-text-strong hover:border-border-subtle'}"
					type="button"
				>
					<div class="flex items-center gap-2">
						<Users size={16} />
						캐릭터 ({characters.length})
					</div>
				</button>
				<button
					onclick={() => selectedTab = 'assets'}
					class="py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 {selectedTab === 'assets' ? 'border-brand-pink text-brand-pink' : 'border-transparent text-text-muted hover:text-text-strong hover:border-border-subtle'}"
					type="button"
				>
					<div class="flex items-center gap-2">
						<Image size={16} />
						에셋 라이브러리 ({assets.length})
					</div>
				</button>
			</nav>
		</div>
	</div>

	<!-- 검색 및 필터 -->
	{#if selectedTab === 'videos'}
		<SearchFilterBar
			bind:searchQuery
			bind:selectedFilter
			searchPlaceholder="뮤직비디오 또는 트랙 검색..."
			showFilter={true}
			filterOptions={statusOptions}
		/>
	{:else}
		<SearchFilterBar
			bind:searchQuery
			searchPlaceholder={selectedTab === 'characters' ? '캐릭터 검색...' : '에셋 검색...'}
			showFilter={false}
		/>
	{/if}

	<!-- 뮤직비디오 탭 -->
	{#if selectedTab === 'videos'}
		{#if filteredMusicVideos.length > 0}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each filteredMusicVideos as video (video.id)}
					<div class="bg-surface-1 rounded-lg overflow-hidden hover:bg-surface-2 transition-colors duration-200 group border border-border-subtle">
						<div class="relative aspect-video bg-surface-2">
							<img src={video.thumbnail} alt={video.title} class="w-full h-full object-cover" />
							<div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
								<button class="w-12 h-12 bg-brand-pink rounded-full flex items-center justify-center hover:bg-brand-pink/90 transition-colors">
									<Play size={20} class="text-white ml-1" />
								</button>
							</div>
							<div class="absolute top-2 right-2">
								<span class="badge-base {getStatusColor(video.status)}">
									{getStatusLabel(video.status)}
								</span>
							</div>
							<div class="absolute bottom-2 left-2 right-2">
								<div class="w-full bg-surface-2 rounded-full h-1">
									<div 
										class="bg-brand-pink h-1 rounded-full transition-all duration-300" 
										style="width: {video.progress}%"
									></div>
								</div>
							</div>
						</div>

						<div class="p-4">
							<h3 class="font-semibold text-text-strong mb-1 line-clamp-1">{video.title}</h3>
							<p class="text-sm text-text-muted mb-2">{video.track} • {video.album}</p>

							<div class="flex items-center justify-between text-xs text-text-muted mb-3">
								<span>{video.duration}</span>
								<span>{video.views.toLocaleString()}회 조회</span>
							</div>

							<div class="flex items-center justify-between">
								<div class="flex items-center gap-1">
									{#each video.characters as character}
										<span class="px-2 py-1 bg-surface-2 rounded text-xs border border-border-subtle">{character}</span>
									{/each}
								</div>
								<div class="flex items-center gap-1">
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
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<EmptyState
				icon={Video}
				title="뮤직비디오를 찾을 수 없습니다"
				description={searchQuery ? '검색 조건에 맞는 뮤직비디오가 없습니다.' : '아직 뮤직비디오가 없습니다.'}
				actionLabel="첫 번째 뮤직비디오 만들기"
				onAction={handleCreateVideo}
			/>
		{/if}
	{/if}

	<!-- 캐릭터 탭 -->
	{#if selectedTab === 'characters'}
		<div class="mb-6 flex justify-end">
			<button 
				onclick={handleCreateCharacter}
				class="inline-flex items-center gap-2 px-4 py-2 bg-brand-pink text-white rounded-lg hover:bg-brand-pink/90 transition-colors duration-200 font-medium"
			>
				<Plus size={16} />
				새 캐릭터 만들기
			</button>
		</div>

		{#if filteredCharacters.length > 0}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{#each filteredCharacters as character (character.id)}
					<div class="bg-surface-1 rounded-lg p-6 hover:bg-surface-2 transition-colors duration-200 border border-border-subtle">
						<div class="flex items-center gap-4 mb-4">
							<div class="w-16 h-16 bg-surface-2 rounded-lg flex items-center justify-center border border-border-subtle">
								<img src={character.image} alt={character.name} class="w-full h-full object-cover rounded-lg" />
							</div>
							<div class="flex-1">
								<h3 class="font-semibold text-text-strong mb-1">{character.name}</h3>
								<span class="badge-base {getStyleColor(character.style)}">
									{getStyleLabel(character.style)}
								</span>
							</div>
						</div>

						<p class="text-sm text-text-muted mb-4 line-clamp-2">{character.description}</p>

						<div class="space-y-3">
							<div class="flex items-center justify-between text-xs text-text-muted">
								<span>사용 횟수</span>
								<span class="text-text-strong">{character.usage_count}회</span>
							</div>

							<div>
								<div class="text-xs text-text-muted mb-2">색상 팔레트</div>
								<div class="flex gap-1">
									{#each character.color_palette as color}
										<div class="w-4 h-4 rounded border border-border-subtle" style="background-color: {color}"></div>
									{/each}
								</div>
							</div>

							<div class="flex items-center justify-between">
								<span class="text-xs text-text-muted">{character.created_at}</span>
								<div class="flex items-center gap-1">
									<button class="w-8 h-8 inline-flex items-center justify-center rounded-md hover:bg-surface-2 transition-colors" title="편집">
										<Edit size={14} class="text-text-muted" />
									</button>
									<button class="w-8 h-8 inline-flex items-center justify-center rounded-md hover:bg-surface-2 transition-colors" title="설정">
										<Settings size={14} class="text-text-muted" />
									</button>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<EmptyState
				icon={Users}
				title="캐릭터를 찾을 수 없습니다"
				description={searchQuery ? '검색 조건에 맞는 캐릭터가 없습니다.' : '아직 캐릭터가 없습니다.'}
				actionLabel="첫 번째 캐릭터 만들기"
				onAction={handleCreateCharacter}
			/>
		{/if}
	{/if}

	<!-- 에셋 라이브러리 탭 -->
	{#if selectedTab === 'assets'}
		<div class="mb-6 flex justify-end">
			<button 
				onclick={handleUploadAsset}
				class="inline-flex items-center gap-2 px-4 py-2 bg-brand-pink text-white rounded-lg hover:bg-brand-pink/90 transition-colors duration-200 font-medium"
			>
				<Plus size={16} />
				에셋 업로드
			</button>
		</div>

		{#if filteredAssets.length > 0}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{#each filteredAssets as asset (asset.id)}
					<div class="bg-surface-1 rounded-lg overflow-hidden hover:bg-surface-2 transition-colors duration-200 group border border-border-subtle">
						<div class="aspect-video bg-surface-2">
							<img src={asset.image} alt={asset.name} class="w-full h-full object-cover" />
						</div>

						<div class="p-4">
							<div class="flex items-start justify-between mb-2">
								<h3 class="font-semibold text-text-strong line-clamp-1">{asset.name}</h3>
								<span class="badge-base {getTypeColor(asset.type)}">
									{getTypeLabel(asset.type)}
								</span>
							</div>

							<div class="flex flex-wrap gap-1 mb-3">
								{#each asset.tags as tag}
									<span class="px-2 py-1 bg-surface-2 rounded text-xs border border-border-subtle">{tag}</span>
								{/each}
							</div>

							<div class="flex items-center justify-between">
								<span class="text-xs text-text-muted">{asset.usage_count}회 사용</span>
								<div class="flex items-center gap-1">
									<button class="w-8 h-8 inline-flex items-center justify-center rounded-md hover:bg-surface-2 transition-colors" title="편집">
										<Edit size={14} class="text-text-muted" />
									</button>
									<button class="w-8 h-8 inline-flex items-center justify-center rounded-md hover:bg-surface-2 transition-colors" title="다운로드">
										<Download size={14} class="text-text-muted" />
									</button>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<EmptyState
				icon={Image}
				title="에셋을 찾을 수 없습니다"
				description={searchQuery ? '검색 조건에 맞는 에셋이 없습니다.' : '아직 에셋이 없습니다.'}
				actionLabel="첫 번째 에셋 업로드"
				onAction={handleUploadAsset}
			/>
		{/if}
	{/if}
</PageContent>
