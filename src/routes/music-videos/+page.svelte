<script lang="ts">
	import { Film, Plus, Play, Edit, Download, Share, Image, SquareUserRound, Palette, Settings, Music } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';
	import SearchFilterBar from '$lib/components/SearchFilterBar.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import { mockMusicVideos, mockCharacters, mockAssets } from '$lib/mocks/music-videos';

	let searchQuery = '';
	let selectedFilter = 'all';
	let selectedTab = 'videos'; // videos, characters, assets

	let musicVideos = mockMusicVideos;

	let characters = mockCharacters;

	let assets = mockAssets;

	const statusOptions = [
		{ value: 'all', label: '모든 상태' },
		{ value: 'draft', label: '초안' },
		{ value: 'generating', label: '생성 중' },
		{ value: 'editing', label: '편집 중' },
		{ value: 'review', label: '검토 중' },
		{ value: 'published', label: '발매됨' },
		{ value: 'archived', label: '보관됨' }
	];

	const styleOptions = [
		{ value: 'all', label: '모든 스타일' },
		{ value: 'cute', label: '귀여운' },
		{ value: 'cool', label: '쿨한' },
		{ value: 'fresh', label: '상쾌한' },
		{ value: 'elegant', label: '우아한' },
		{ value: 'energetic', label: '에너지 넘치는' },
		{ value: 'mysterious', label: '신비로운' },
		{ value: 'playful', label: '장난스러운' },
		{ value: 'romantic', label: '로맨틱한' },
		{ value: 'sexy', label: '섹시한' },
		{ value: 'vintage', label: '빈티지한' },
		{ value: 'formal', label: '단정한' },
		{ value: 'alluring', label: '고혹적인' },
		{ value: 'innocent', label: '청초한' },
		{ value: 'gentle', label: '다정한' },
		{ value: 'futuristic', label: '퓨처리스틱' },
		{ value: 'military', label: '밀리터리' },
		{ value: 'dreamy', label: '몽환적인' },
		{ value: 'shadow', label: '그림자' },
		{ value: 'toxic', label: '독한' },
		{ value: 'sandy', label: '황야의' },
		{ value: 'icy', label: '얼음같은' },
		{ value: 'holy', label: '신성한' },
		{ value: 'glamorous', label: '화려한' },
		{ value: 'natural', label: '자연스러운' },
		{ value: 'classic', label: '고전적인' },
		{ value: 'passionate', label: '열정적인' }
	];

	const typeOptions = [
		{ value: 'all', label: '모든 타입' },
		{ value: 'background', label: '배경' },
		{ value: 'animation', label: '애니메이션' },
		{ value: 'effect', label: '효과' }
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
			case 'cute': return 'badge-cute-pink';
			case 'cool': return 'badge-info-blue';
			case 'fresh': return 'style-fresh';
			case 'elegant': return 'badge-special-purple';
			case 'energetic': return 'text-elotte-orange';
			case 'mysterious': return 'style-mysterious';
			case 'playful': return 'badge-low-green';
			case 'romantic': return 'badge-high-urgent';
			case 'sexy': return 'badge-high-red';
			case 'vintage': return 'style-vintage';
			case 'formal': return 'style-formal';
			case 'alluring': return 'style-alluring';
			case 'innocent': return 'style-innocent';
			case 'gentle': return 'style-gentle';
			case 'futuristic': return 'style-futuristic';
			case 'military': return 'style-military';
			case 'dreamy': return 'style-dreamy';
			case 'shadow': return 'style-shadow';
			case 'toxic': return 'style-toxic';
			case 'sandy': return 'style-sandy';
			case 'icy': return 'style-icy';
			case 'holy': return 'style-holy';
			case 'glamorous': return 'style-glamorous';
			case 'natural': return 'style-natural';
			case 'classic': return 'style-classic';
			case 'passionate': return 'style-passionate';
			default: return 'text-text-muted';
		}
	}

	function getStyleLabel(style: string) {
		switch (style) {
			case 'cute': return '귀여운';
			case 'cool': return '쿨한';
			case 'fresh': return '상쾌한';
			case 'elegant': return '우아한';
			case 'energetic': return '에너지 넘치는';
			case 'mysterious': return '신비로운';
			case 'playful': return '장난스러운';
			case 'romantic': return '로맨틱한';
			case 'sexy': return '섹시한';
			case 'vintage': return '빈티지한';
			case 'formal': return '단정한';
			case 'alluring': return '고혹적인';
			case 'innocent': return '청초한';
			case 'gentle': return '다정한';
			case 'futuristic': return '퓨처리스틱';
			case 'military': return '밀리터리';
			case 'dreamy': return '몽환적인';
			case 'shadow': return '그림자';
			case 'toxic': return '독한';
			case 'sandy': return '황야의';
			case 'icy': return '얼음같은';
			case 'holy': return '신성한';
			case 'glamorous': return '화려한';
			case 'natural': return '자연스러운';
			case 'classic': return '고전적인';
			case 'passionate': return '열정적인';
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
		const matchesSearch = character.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			   character.description.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesFilter = selectedFilter === 'all' || character.style === selectedFilter;
		return matchesSearch && matchesFilter;
	});

	const filteredAssets = assets.filter(asset => {
		const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			   asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
		const matchesFilter = selectedFilter === 'all' || asset.type === selectedFilter;
		return matchesSearch && matchesFilter;
	});

	function handleCreateVideo() {
		// 뮤직비디오 생성 로직
	}

	function handleCreateCharacter() {
		// 캐릭터 생성 로직
	}

	function handleUploadAsset() {
		// 에셋 업로드 로직
	}
</script>

<PageContent>
<PageHeader 
	title="뮤직비디오 센터" 
	description="AI로 뮤직비디오를 생성하고 캐릭터, 에셋을 관리하세요."
		actions={[
			{
				href: '/suno/projects/new',
				icon: Music,
				label: 'SUNO에서 새 곡 기획'
			},
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
	<Film size={16} />
	뮤직비디오 ({musicVideos.length})
</div>
				</button>
				<button
					onclick={() => selectedTab = 'characters'}
					class="py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 {selectedTab === 'characters' ? 'border-brand-pink text-brand-pink' : 'border-transparent text-text-muted hover:text-text-strong hover:border-border-subtle'}"
					type="button"
				>
<div class="flex items-center gap-2">
	<SquareUserRound size={16} />
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
	{:else if selectedTab === 'characters'}
		<SearchFilterBar
			bind:searchQuery
			bind:selectedFilter
			searchPlaceholder="캐릭터 검색..."
			showFilter={true}
			filterOptions={styleOptions}
		/>
	{:else}
		<SearchFilterBar
			bind:searchQuery
			bind:selectedFilter
			searchPlaceholder="에셋 검색..."
			showFilter={true}
			filterOptions={typeOptions}
		/>
	{/if}

	<!-- 뮤직비디오 탭 -->
	{#if selectedTab === 'videos'}
		{#if filteredMusicVideos.length > 0}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each filteredMusicVideos as video (video.id)}
					<div class="bg-surface-1 rounded-lg overflow-hidden hover:bg-surface-2 transition-colors duration-200 group border border-border-subtle">
						<div class="relative aspect-video bg-surface-2 overflow-hidden rounded-t-lg">
<!-- 기본 이미지 (회색 배경 + 회색 로고) -->
<div class="absolute inset-0 flex items-center justify-center bg-surface-2 rounded-t-lg">
	<Film size={48} class="text-text-muted opacity-30" />
</div>
							<!-- 실제 이미지 (있을 경우) -->
							{#if video.thumbnail && video.thumbnail !== '/api/placeholder/300/200'}
								<img
									src={video.thumbnail}
									alt={video.title}
									class="absolute inset-0 w-full h-full object-cover rounded-t-lg"
									onerror={(e: Event) => {
										const target = e.currentTarget as HTMLImageElement;
										target.style.display = 'none';
									}}
								/>
							{/if}
							<div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
								<button class="w-12 h-12 bg-brand-pink rounded-full flex items-center justify-center hover:bg-brand-pink/90 transition-colors duration-200" aria-label="재생">
									<Play size={20} class="text-white" />
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
									<button class="btn-icon w-8 h-8 inline-flex items-center justify-center rounded-md" title="편집" aria-label="편집">
										<Edit size={14} class="text-text-muted" />
									</button>
									<button class="btn-icon w-8 h-8 inline-flex items-center justify-center rounded-md" title="다운로드" aria-label="다운로드">
										<Download size={14} class="text-text-muted" />
									</button>
									<button class="btn-icon w-8 h-8 inline-flex items-center justify-center rounded-md" title="공유" aria-label="공유">
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
				title="뮤직비디오를 찾을 수 없습니다"
				description={searchQuery ? '검색 조건에 맞는 뮤직비디오가 없습니다.' : '아직 뮤직비디오가 없습니다.'}
				actionLabel="첫 번째 뮤직비디오 만들기"
				onAction={handleCreateVideo}
			/>
		{/if}
	{/if}

	<!-- 캐릭터 탭 -->
	{#if selectedTab === 'characters'}
		<div class="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 w-full sm:w-auto">
			<button 
				onclick={handleCreateCharacter}
				class="inline-flex items-center justify-center gap-2 px-4 py-2 w-full sm:w-auto bg-hover-cyan text-black rounded-lg hover:bg-hover-cyan/90 transition-colors duration-200 font-medium"
			>
				<Plus size={16} />
				새 캐릭터 만들기
			</button>
		</div>

		{#if filteredCharacters.length > 0}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{#each filteredCharacters as character (character.id)}
					<div class="character-card-container bg-surface-1 rounded-lg p-6 border border-border-subtle">
						<div class="flex items-center gap-4 mb-4">
							<button
								class="character-image-button relative w-16 h-16 bg-surface-2 rounded-lg flex items-center justify-center border border-border-subtle overflow-hidden focus-visible:border-brand-pink transition-colors duration-200"
								onclick={() => {
									// 이미지 확대 로직 (이미지가 있을 때만)
								if (character.image && character.image !== '/api/placeholder/200/200') {
									// 이미지 확대 모달 열기
								}
								}}
								disabled={!character.image || character.image === '/api/placeholder/200/200'}
							>
<!-- 기본 이미지 (회색 배경 + 회색 로고) -->
<div class="absolute inset-0 flex items-center justify-center">
	<SquareUserRound size={24} class="text-text-muted opacity-30" />
</div>
								<!-- 실제 이미지 (있을 경우) -->
								{#if character.image && character.image !== '/api/placeholder/200/200'}
									<img
										src={character.image}
										alt={character.name}
										class="absolute inset-0 w-full h-full object-cover rounded-lg"
										onerror={(e: Event) => {
											const target = e.currentTarget as HTMLImageElement;
											target.style.display = 'none';
										}}
									/>
								{/if}
							</button>
							<div class="flex-1">
								<h3 class="font-semibold text-text-strong mb-1">{character.name}</h3>
								<span class="badge-base {getStyleColor(character.style)} -ml-2 pl-2">
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
									<button
										class="btn-icon w-8 h-8 inline-flex items-center justify-center rounded-md"
										title="편집"
										onclick={(e: Event) => {
											e.stopPropagation();
											// 편집 로직
										}}
									>
										<Edit size={14} class="lucide-icon text-text-muted" />
									</button>
									<button
										class="btn-icon w-8 h-8 inline-flex items-center justify-center rounded-md"
										title="설정"
										onclick={(e: Event) => {
											e.stopPropagation();
											// 설정 로직
										}}
									>
										<Settings size={14} class="lucide-icon text-text-muted" />
									</button>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<EmptyState
				title="캐릭터를 찾을 수 없습니다"
				description={searchQuery ? '검색 조건에 맞는 캐릭터가 없습니다.' : '아직 캐릭터가 없습니다.'}
				actionLabel="첫 번째 캐릭터 만들기"
				onAction={handleCreateCharacter}
			/>
		{/if}
	{/if}

	<!-- 에셋 라이브러리 탭 -->
	{#if selectedTab === 'assets'}
		<div class="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 w-full sm:w-auto">
			<button 
				onclick={handleUploadAsset}
				class="inline-flex items-center justify-center gap-2 px-4 py-2 w-full sm:w-auto bg-hover-cyan text-black rounded-lg hover:bg-hover-cyan/90 transition-colors duration-200 font-medium"
			>
				<Plus size={16} />
				에셋 업로드
			</button>
		</div>

		{#if filteredAssets.length > 0}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{#each filteredAssets as asset (asset.id)}
					<div class="bg-surface-1 rounded-lg overflow-hidden hover:bg-surface-2 transition-colors duration-200 group border border-border-subtle">
						<div class="relative aspect-video bg-surface-2 overflow-hidden rounded-t-lg">
							<!-- 기본 이미지 (회색 배경 + 회색 로고) -->
							<div class="absolute inset-0 flex items-center justify-center bg-surface-2 rounded-t-lg">
								<Image size={48} class="text-text-muted opacity-30" />
							</div>
							<!-- 실제 이미지 (있을 경우) -->
							{#if asset.image && asset.image !== '/api/placeholder/300/200'}
								<img
									src={asset.image}
									alt={asset.name}
									class="absolute inset-0 w-full h-full object-cover rounded-t-lg"
									onerror={(e: Event) => {
										const target = e.currentTarget as HTMLImageElement;
										target.style.display = 'none';
									}}
								/>
							{/if}
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
									<button class="btn-icon w-8 h-8 inline-flex items-center justify-center rounded-md" title="편집" aria-label="편집">
										<Edit size={14} class="text-text-muted" />
									</button>
									<button class="btn-icon w-8 h-8 inline-flex items-center justify-center rounded-md" title="다운로드" aria-label="다운로드">
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
				title="에셋을 찾을 수 없습니다"
				description={searchQuery ? '검색 조건에 맞는 에셋이 없습니다.' : '아직 에셋이 없습니다.'}
				actionLabel="첫 번째 에셋 업로드"
				onAction={handleUploadAsset}
			/>
		{/if}
	{/if}
</PageContent>
