<script lang="ts">
	import { Search, Music, Disc3, CheckSquare, ExternalLink, X, Lightbulb, Filter } from 'lucide-svelte';

	export let results: { 
		exact: { id: string; title: string; type: string; href: string }[];
		similar: { id: string; title: string; type: string; href: string; recommendReason?: string }[];
	} = { exact: [], similar: [] };
	export let query = '';
	export let onClear: () => void;

	// 필터 상태 ('all' = 전체, 또는 특정 타입)
	let selectedFilter = 'all';

	// 검색 결과에서 사용 가능한 타입 목록 추출
	$: availableTypes = [...new Set([
		...results.exact.map(item => item.type),
		...results.similar.map(item => item.type)
	])];

	// 필터링된 결과
	$: filteredExact = selectedFilter === 'all' 
		? results.exact 
		: results.exact.filter(item => item.type === selectedFilter);
	
	$: filteredSimilar = selectedFilter === 'all'
		? results.similar
		: results.similar.filter(item => item.type === selectedFilter);

	// 필터 변경
	function setFilter(type: string) {
		selectedFilter = type;
	}

	// 검색 결과 항목 클릭 시 검색창 닫기
	function handleResultClick() {
		// 약간의 딜레이 후 검색 초기화 (페이지 이동이 먼저 처리되도록)
		setTimeout(() => {
			onClear();
		}, 100);
	}

	// 타입별 아이콘 매핑
	const getIcon = (type: string) => {
		switch (type) {
			case 'album':
				return Disc3;
			case 'track':
				return Music;
			case 'task':
				return CheckSquare;
			case 'action':
			case 'release':
			case 'status':
			case 'revenue':
			case 'feedback':
			case 'settings':
				return ExternalLink;
			default:
				return Search;
		}
	};

	// 타입별 색상 매핑
	const getTypeColor = (type: string) => {
		switch (type) {
			case 'album':
				return 'text-tag-album';
			case 'track':
				return 'text-tag-track';
			case 'task':
				return 'text-tag-deadline';
			default:
				return 'text-text-muted';
		}
	};

	// 타입별 한글 라벨
	const getTypeLabel = (type: string) => {
		switch (type) {
			case 'album':
				return '앨범';
			case 'track':
				return '트랙';
			case 'task':
				return '할 일';
			case 'action':
				return '액션';
			case 'release':
				return '발매';
			case 'revenue':
				return '수익';
			case 'feedback':
				return '피드백';
			case 'settings':
				return '설정';
			default:
				return '기타';
		}
	};

	// 타입별 설명
	const getDescription = (type: string) => {
		switch (type) {
			case 'album':
				return '앨범 정보를 확인하고 관리하세요.';
			case 'track':
				return '트랙 정보를 확인하고 관리하세요.';
			case 'task':
				return '할 일을 확인하고 관리하세요.';
			case 'action':
				return '새로운 작업을 시작하거나 기존 항목을 관리하세요.';
			case 'release':
				return '발매 일정을 확인하고 관리하세요.';
			case 'status':
				return '시스템 상태를 모니터링하세요.';
			case 'revenue':
				return '수익 현황을 분석하고 관리하세요.';
			case 'feedback':
				return '피드백을 확인하고 응답하세요.';
			case 'settings':
				return '시스템 설정을 관리하세요.';
			default:
				return '관련 정보를 확인하고 관리하세요.';
		}
	};

	// 검색어 하이라이트 함수
	function highlightSearchTerm(text: string, searchQuery: string): Array<{ text: string; isMatch: boolean }> {
		if (!searchQuery || searchQuery.trim() === '') {
			return [{ text, isMatch: false }];
		}
		
		const lowerText = text.toLowerCase();
		const lowerQuery = searchQuery.toLowerCase();
		const parts: Array<{ text: string; isMatch: boolean }> = [];
		let lastIndex = 0;
		
		let index = lowerText.indexOf(lowerQuery, lastIndex);
		while (index !== -1) {
			if (index > lastIndex) {
				parts.push({ text: text.substring(lastIndex, index), isMatch: false });
			}
			parts.push({ text: text.substring(index, index + searchQuery.length), isMatch: true });
			lastIndex = index + searchQuery.length;
			index = lowerText.indexOf(lowerQuery, lastIndex);
		}
		
		if (lastIndex < text.length) {
			parts.push({ text: text.substring(lastIndex), isMatch: false });
		}
		
		return parts.length > 0 ? parts : [{ text, isMatch: false }];
	}
</script>

<div class="py-6 overflow-hidden">
	<!-- 검색 결과 헤더 -->
	<div class="mb-6">
		<div class="flex items-start gap-3 mb-4 max-w-full">
			<Search size={20} class="text-brand-pink flex-shrink-0 mt-2" />
			<div class="flex-1 min-w-0 max-w-full">
				<div class="break-words leading-tight" style="word-break: break-word; overflow-wrap: break-word; hyphens: auto;">
					<h1 class="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1">
						<span class="text-brand-pink">{query}</span>
					</h1>
					<h2 class="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-text-strong">
						검색 결과
					</h2>
				</div>
				{#if results?.exact?.length > 0}
					<div class="mt-2">
						<span class="text-sm text-text-muted">
							({filteredExact.length}개{selectedFilter !== 'all' ? ` / 전체 ${results.exact.length}개` : ''})
						</span>
					</div>
				{/if}
			</div>
		</div>

		<!-- 필터 버튼 (타입이 2개 이상일 때만 표시) -->
		{#if availableTypes.length > 1}
			<div class="flex items-center gap-2 flex-wrap">
				<Filter size={14} class="text-text-muted" />
				<button
					type="button"
					onclick={() => setFilter('all')}
					class="px-3 py-1 text-sm rounded-full transition-colors {selectedFilter === 'all' ? 'bg-brand-pink text-white' : 'bg-surface-2 text-text-muted hover:text-hover-point'}"
				>
					전체
				</button>
				{#each availableTypes as type}
					<button
						type="button"
						onclick={() => setFilter(type)}
						class="px-3 py-1 text-sm rounded-full transition-colors {selectedFilter === type ? 'bg-brand-pink text-white' : 'bg-surface-2 text-text-muted hover:text-hover-point'}"
					>
						{getTypeLabel(type)}
					</button>
				{/each}
			</div>
		{/if}
	</div>

	{#if filteredExact.length > 0}
		<!-- 정확한 검색 결과 -->
		<div class="mb-8">
			<div class="grid grid-cols-12 gap-4">
				{#each filteredExact as item (item.id)}
					{@const IconComponent = getIcon(item.type)}
					<div class="col-span-12 md:col-span-6 lg:col-span-4">
						<a href={item.href} onclick={handleResultClick} class="block h-72 bg-surface-2 rounded-lg p-6 group">
							<div class="flex flex-col h-full">
								<!-- 아이콘과 타입 -->
								<div class="flex items-center gap-3 mb-4">
									<div class="w-10 h-10 bg-brand-pink/10 rounded-lg flex items-center justify-center group-hover:bg-brand-pink group-focus:bg-brand-pink">
										<IconComponent size={20} class="text-brand-pink group-hover:text-white group-focus:text-white" />
									</div>
									<div class="text-xs {getTypeColor(item.type)} font-medium">
										{getTypeLabel(item.type)}
									</div>
								</div>

								<!-- 제목 (하이라이트 적용) -->
								<div class="flex-1">
									<h3 class="text-lg font-semibold text-text-strong group-hover:text-hover-point group-focus:text-brand-pink mb-2 line-clamp-2">
										{#each highlightSearchTerm(item.title, query) as part}
											{#if part.isMatch}
												<span class="text-search-highlight">{part.text}</span>
											{:else}
												{part.text}
											{/if}
										{/each}
									</h3>
									<p class="text-sm text-text-muted line-clamp-3">
										{getDescription(item.type)}
									</p>
								</div>

								<!-- 하단 액션 -->
								<div class="flex items-center justify-end pt-4">
									<span class="text-xs text-text-muted group-hover:text-hover-point group-focus:text-brand-pink">더보기</span>
								</div>
							</div>
						</a>
					</div>
				{/each}
			</div>
		</div>

		<!-- 추천 항목 (정확한 결과가 있을 때) -->
		{#if filteredSimilar.length > 0}
			<div class="mb-8">
				<div class="flex items-center gap-2 mb-4">
					<Lightbulb size={18} class="text-text-muted flex-shrink-0" />
					<h2 class="text-base font-semibold text-text-muted">추천 항목</h2>
				</div>
				<div class="grid grid-cols-12 gap-4">
					{#each filteredSimilar as item (item.id)}
						{@const IconComponent = getIcon(item.type)}
						<div class="col-span-12 md:col-span-6 lg:col-span-4">
							<a href={item.href} onclick={handleResultClick} class="block h-72 bg-surface-2 rounded-lg p-6 group">
								<div class="flex flex-col h-full">
									<!-- 아이콘과 타입 -->
									<div class="flex items-center gap-3 mb-4">
										<div class="w-10 h-10 bg-surface-1 rounded-lg flex items-center justify-center group-hover:bg-hover-point group-focus:bg-brand-pink">
											<IconComponent size={20} class="text-text-muted group-hover:text-black group-focus:text-white" />
										</div>
										<div class="flex flex-col">
											<div class="text-xs {getTypeColor(item.type)} font-medium">
												{getTypeLabel(item.type)}
											</div>
											<!-- 추천 이유 표시 -->
											{#if item.recommendReason}
												<div class="text-xs text-text-muted mt-0.5">
													{item.recommendReason}
												</div>
											{/if}
										</div>
									</div>

									<!-- 제목 -->
									<div class="flex-1">
										<h3 class="text-lg font-semibold text-text-strong group-hover:text-hover-point group-focus:text-brand-pink mb-2 line-clamp-2">
											{item.title}
										</h3>
										<p class="text-sm text-text-muted line-clamp-3">
											{getDescription(item.type)}
										</p>
									</div>

									<!-- 하단 액션 -->
									<div class="flex items-center justify-end pt-4">
										<span class="text-xs text-text-muted group-hover:text-hover-point group-focus:text-brand-pink">더보기</span>
									</div>
								</div>
							</a>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	{:else}
		<!-- 검색 결과 없음 -->
		<div class="pt-0 pb-6">
			<div class="text-center mb-12">
				<Search size={48} class="text-text-muted mx-auto mb-4" />
				<h3 class="text-lg font-semibold text-text-strong mb-2">
					"<span class="text-search-highlight">{query}</span>"에 대한 검색 결과가 없습니다
				</h3>
				<p class="text-sm text-text-muted mb-6">다른 검색어를 시도해 보세요</p>
				<button
					type="button"
					onclick={onClear}
					class="inline-flex items-center gap-2 px-4 py-2 bg-brand-pink text-white rounded-md hover:bg-hover-point hover:text-black focus:bg-brand-pink focus:text-white"
				>
					<X size={16} />
					검색 초기화
				</button>
			</div>

			<!-- 추천 항목 (검색 결과 없을 때) -->
			{#if filteredSimilar.length > 0}
				<div class="mb-8">
					<div class="flex items-center gap-2 mb-4">
						<Lightbulb size={18} class="text-text-muted flex-shrink-0" />
						<h2 class="text-base font-semibold text-text-muted">이런 항목은 어떠세요?</h2>
					</div>
					<div class="grid grid-cols-12 gap-4">
						{#each filteredSimilar as item (item.id)}
							{@const IconComponent = getIcon(item.type)}
							<div class="col-span-12 md:col-span-6 lg:col-span-4">
								<a href={item.href} onclick={handleResultClick} class="block h-72 bg-surface-2 rounded-lg p-6 group">
									<div class="flex flex-col h-full">
										<!-- 아이콘과 타입 -->
										<div class="flex items-center gap-3 mb-4">
											<div class="w-10 h-10 bg-surface-1 rounded-lg flex items-center justify-center group-hover:bg-hover-point group-focus:bg-brand-pink">
												<IconComponent size={20} class="text-text-muted group-hover:text-black group-focus:text-white" />
											</div>
											<div class="flex flex-col">
												<div class="text-xs {getTypeColor(item.type)} font-medium">
													{getTypeLabel(item.type)}
												</div>
												<!-- 추천 이유 표시 -->
												{#if item.recommendReason}
													<div class="text-xs text-text-muted mt-0.5">
														{item.recommendReason}
													</div>
												{/if}
											</div>
										</div>

										<!-- 제목 -->
										<div class="flex-1">
											<h3 class="text-lg font-semibold text-text-strong group-hover:text-hover-point group-focus:text-brand-pink mb-2 line-clamp-2">
												{item.title}
											</h3>
											<p class="text-sm text-text-muted line-clamp-3">
												{getDescription(item.type)}
											</p>
										</div>

										<!-- 하단 액션 -->
										<div class="flex items-center justify-end pt-4">
											<span class="text-xs text-text-muted group-hover:text-hover-point group-focus:text-brand-pink">더보기</span>
										</div>
									</div>
								</a>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>
