<script lang="ts">
	import { Search, Music, Disc3, CheckSquare, ExternalLink, X } from 'lucide-svelte';

	export let results: { 
		exact: { id: string; title: string; type: string; href: string }[];
		similar: { id: string; title: string; type: string; href: string }[];
	} = { exact: [], similar: [] };
	export let query = '';
	export let onClear: () => void;

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
			case 'status':
				return '상태';
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
</script>

<div class="py-6 overflow-hidden">
	<!-- 검색 결과 헤더 -->
	<div class="mb-6">
		<!-- 검색어와 개수 -->
		<div class="flex items-start gap-3 mb-4 max-w-full">
			<Search size={20} class="text-brand-pink flex-shrink-0 mt-2" />
			<div class="flex-1 min-w-0 max-w-full">
				<!-- 검색어 제목 -->
				<h1 class="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-text-strong break-words leading-tight" style="word-break: break-all; overflow-wrap: anywhere;">
					<span class="text-brand-pink">
						<!-- 모바일: 25자 제한 -->
						<span class="block sm:hidden">
							{query.length > 25 ? query.substring(0, 25) + '...' : query}
						</span>
						<!-- 태블릿: 50자 제한 -->
						<span class="hidden sm:block md:hidden">
							{query.length > 50 ? query.substring(0, 50) + '...' : query}
						</span>
						<!-- 데스크톱: 80자 제한 -->
						<span class="hidden md:block lg:hidden">
							{query.length > 80 ? query.substring(0, 80) + '...' : query}
						</span>
						<!-- 대형 데스크톱: 120자 제한 -->
						<span class="hidden lg:block">
							{query.length > 120 ? query.substring(0, 120) + '...' : query}
						</span>
					</span> 검색 결과
				</h1>
				<!-- 개수 표시 -->
				{#if results?.exact?.length > 0 || results?.similar?.length > 0}
					<div class="mt-2">
						<span class="text-sm text-text-muted">
							({(results?.exact?.length || 0) + (results?.similar?.length || 0)}개)
						</span>
					</div>
				{/if}
			</div>
		</div>
		
		<!-- 검색 초기화 버튼 -->
		<div class="flex justify-end">
			<button
				onclick={onClear}
				class="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-text-muted hover:text-text-strong hover:bg-surface-1 rounded-md transition-colors"
				aria-label="검색 초기화"
			>
				<X size={16} />
				검색 초기화
			</button>
		</div>
	</div>

	{#if results?.exact?.length > 0 || results?.similar?.length > 0}
		<!-- 정확한 검색 결과 -->
		{#if results?.exact?.length > 0}
			<div class="mb-8">
				<h2 class="text-lg font-semibold text-text-strong mb-4 flex items-center gap-2">
					<Search size={18} class="text-brand-pink" />
					정확한 검색 결과 ({results?.exact?.length || 0}개)
				</h2>
				<div class="grid grid-cols-12 gap-4">
					{#each results?.exact || [] as item (item.id)}
						{@const IconComponent = getIcon(item.type)}
						<div class="col-span-12 md:col-span-6 lg:col-span-4">
							<div class="h-72 bg-surface-2 border border-brand-pink/20 rounded-md p-6 hover:bg-surface-1 transition-colors group">
								<a href={item.href} class="block h-full">
									<div class="flex flex-col h-full">
										<!-- 아이콘과 타입 -->
										<div class="flex items-center gap-3 mb-4">
											<div class="w-10 h-10 bg-brand-pink/10 rounded-lg flex items-center justify-center group-hover:bg-brand-pink transition-colors">
												<IconComponent size={20} class="text-brand-pink group-hover:text-white transition-colors" />
											</div>
											<div>
												<div class="text-xs {getTypeColor(item.type)} font-medium">
													{getTypeLabel(item.type)}
												</div>
											</div>
										</div>

										<!-- 제목 -->
										<div class="flex-1">
											<h3 class="text-lg font-semibold text-text-strong group-hover:text-white transition-colors mb-2 line-clamp-2">
												{item.title}
											</h3>
											<p class="text-sm text-text-muted line-clamp-3">
												{getDescription(item.type)}
											</p>
										</div>

										<!-- 하단 액션 -->
										<div class="flex items-center justify-between pt-4 border-t border-border-subtle">
											<span class="text-xs text-text-muted">자세히 보기</span>
											<ExternalLink size={16} class="text-text-muted group-hover:text-brand-pink transition-colors" />
										</div>
									</div>
								</a>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- 유사한 항목 추천 -->
		{#if results?.similar?.length > 0}
			<div class="mb-6">
				<h2 class="text-lg font-semibold text-text-strong mb-4 flex items-center gap-2">
					<Search size={18} class="text-text-muted" />
					{#if results?.exact?.length > 0}
						추천 항목 ({results?.similar?.length || 0}개)
					{:else}
						유사한 항목 추천 ({results?.similar?.length || 0}개)
					{/if}
				</h2>
				<div class="grid grid-cols-12 gap-4">
					{#each results?.similar || [] as item (item.id)}
						{@const IconComponent = getIcon(item.type)}
						<div class="col-span-12 md:col-span-6 lg:col-span-4">
							<div class="h-72 bg-surface-2 border border-border-subtle rounded-md p-6 hover:bg-surface-1 transition-colors group">
								<a href={item.href} class="block h-full">
									<div class="flex flex-col h-full">
										<!-- 아이콘과 타입 -->
										<div class="flex items-center gap-3 mb-4">
											<div class="w-10 h-10 bg-surface-1 rounded-lg flex items-center justify-center group-hover:bg-brand-pink transition-colors">
												<IconComponent size={20} class="text-text-muted group-hover:text-white transition-colors" />
											</div>
											<div>
												<div class="text-xs {getTypeColor(item.type)} font-medium">
													{getTypeLabel(item.type)}
												</div>
											</div>
										</div>

										<!-- 제목 -->
										<div class="flex-1">
											<h3 class="text-lg font-semibold text-text-strong group-hover:text-white transition-colors mb-2 line-clamp-2">
												{item.title}
											</h3>
											<p class="text-sm text-text-muted line-clamp-3">
												{getDescription(item.type)}
											</p>
										</div>

										<!-- 하단 액션 -->
										<div class="flex items-center justify-between pt-4 border-t border-border-subtle">
											<span class="text-xs text-text-muted">자세히 보기</span>
											<ExternalLink size={16} class="text-text-muted group-hover:text-brand-pink transition-colors" />
										</div>
									</div>
								</a>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	{:else}
		<!-- 검색 결과 없음 - 유사항목 추천 -->
		<div class="py-6">
			<div class="text-center mb-8">
				<Search size={48} class="text-text-muted mx-auto mb-4" />
				<h3 class="text-lg font-semibold text-text-strong mb-2">검색 결과가 없습니다</h3>
				<p class="text-text-muted mb-6">
					"<span class="text-brand-pink">{query}</span>"에 대한 검색 결과를 찾을 수 없습니다.
				</p>
				<button
					onclick={onClear}
					class="inline-flex items-center gap-2 px-4 py-2 bg-brand-pink text-white rounded-md hover:bg-hover-cyan hover:text-black transition-colors"
				>
					<X size={16} />
					검색 초기화
				</button>
			</div>
			
			<!-- 유사한 항목 추천 -->
			{#if results?.similar?.length > 0}
				<div class="mb-6">
					<h2 class="text-lg font-semibold text-text-strong mb-4 flex items-center gap-2">
						<Search size={18} class="text-text-muted" />
						유사한 항목 추천 ({results?.similar?.length || 0}개)
					</h2>
					<div class="grid grid-cols-12 gap-4">
						{#each results?.similar || [] as item (item.id)}
							{@const IconComponent = getIcon(item.type)}
							<div class="col-span-12 md:col-span-6 lg:col-span-4">
								<div class="h-72 bg-surface-2 border border-border-subtle rounded-md p-6 hover:bg-surface-1 transition-colors group">
									<a href={item.href} class="block h-full">
										<div class="flex flex-col h-full">
											<!-- 아이콘과 타입 -->
											<div class="flex items-center gap-3 mb-4">
												<div class="w-10 h-10 bg-surface-1 rounded-lg flex items-center justify-center group-hover:bg-brand-pink transition-colors">
													<IconComponent size={20} class="text-text-muted group-hover:text-white transition-colors" />
												</div>
												<div>
													<div class="text-xs {getTypeColor(item.type)} font-medium">
														{getTypeLabel(item.type)}
													</div>
												</div>
											</div>

											<!-- 제목 -->
											<div class="flex-1">
												<h3 class="text-lg font-semibold text-text-strong group-hover:text-white transition-colors mb-2 line-clamp-2">
													{item.title}
												</h3>
												<p class="text-sm text-text-muted line-clamp-3">
													{getDescription(item.type)}
												</p>
											</div>

											<!-- 하단 액션 -->
											<div class="flex items-center justify-between pt-4 border-t border-border-subtle">
												<span class="text-xs text-text-muted">자세히 보기</span>
												<ExternalLink size={16} class="text-text-muted group-hover:text-brand-pink transition-colors" />
											</div>
										</div>
									</a>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>