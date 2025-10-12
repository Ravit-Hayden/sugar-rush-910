<script lang="ts">
	import { Search, Music, Disc3, CheckSquare, ExternalLink } from 'lucide-svelte';

	export let results: { id: string; title: string; type: string; href: string }[] = [];
	export let isLoading = false;
	export let query = '';

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

{#if isLoading}
	<div class="p-4 text-center">
		<div class="inline-flex items-center gap-2 text-text-muted">
			<div class="w-4 h-4 border-2 border-text-muted border-t-transparent rounded-full animate-spin"></div>
			<span class="text-sm">검색 중...</span>
		</div>
	</div>
{:else if results.length > 0}
	<div class="py-2">
		{#each results as item (item.id)}
			{@const IconComponent = getIcon(item.type)}
			<a
				href={item.href}
				class="flex items-center gap-3 px-4 py-2 hover:bg-surface-1 transition-colors group"
			>
				<div class="flex-shrink-0 w-6 h-6 flex items-center justify-center">
					<IconComponent size={16} class="text-text-muted group-hover:text-brand-pink transition-colors" />
				</div>
				<div class="flex-1 min-w-0">
					<div class="text-sm text-text-strong truncate group-hover:text-white transition-colors">
						{item.title}
					</div>
					<div class="text-xs {getTypeColor(item.type)}">
						{getTypeLabel(item.type)}
					</div>
				</div>
				<div class="flex-shrink-0">
					<ExternalLink size={12} class="text-text-muted group-hover:text-brand-pink transition-colors" />
				</div>
			</a>
		{/each}
	</div>
{:else if query}
	<div class="p-4 text-center">
		<div class="text-text-muted text-sm">
			"<span class="text-text-strong">{query}</span>"에 대한 검색 결과가 없습니다.
		</div>
	</div>
{:else}
	<div class="p-4 text-center">
		<div class="text-text-muted text-sm">
			검색어를 입력하거나 추천 항목을 선택하세요.
		</div>
	</div>
{/if}

















