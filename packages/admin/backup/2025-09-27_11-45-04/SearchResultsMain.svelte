<script lang="ts">
	import { Search, Music, Disc3, CheckSquare, ExternalLink, X } from 'lucide-svelte';

	export let results: { id: string; title: string; type: string; href: string }[] = [];
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
</script>

<div class="py-6">
	<!-- 검색 결과 헤더 -->
	<div class="flex items-center justify-between mb-6">
		<div class="flex items-center gap-3">
			<Search size={20} class="text-brand-pink" />
			<h1 class="text-2xl font-bold text-text-strong">
				"<span class="text-brand-pink">{query}</span>" 검색 결과
			</h1>
			{#if results.length > 0}
				<span class="text-sm text-text-muted">({results.length}개)</span>
			{/if}
		</div>
		<button
			onclick={onClear}
			class="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-text-muted hover:text-text-strong hover:bg-surface-1 rounded-md transition-colors"
			aria-label="검색 초기화"
		>
			<X size={16} />
			검색 초기화
		</button>
	</div>

	{#if results.length > 0}
		<!-- 검색 결과 그리드 -->
		<div class="grid grid-cols-12 gap-4">
			{#each results as item (item.id)}
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
										{item.type === 'album' && '앨범 정보를 확인하고 관리하세요.'}
										{item.type === 'track' && '트랙 정보를 확인하고 관리하세요.'}
										{item.type === 'task' && '할 일을 확인하고 관리하세요.'}
										{item.type === 'action' && '빠른 액션을 실행하세요.'}
										{item.type === 'release' && '발매 정보를 확인하세요.'}
										{item.type === 'status' && '시스템 상태를 확인하세요.'}
										{item.type === 'revenue' && '수익 정보를 확인하세요.'}
										{item.type === 'feedback' && '피드백을 확인하세요.'}
										{item.type === 'settings' && '설정을 관리하세요.'}
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
	{:else}
		<!-- 검색 결과 없음 -->
		<div class="text-center py-12">
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
	{/if}
</div>
