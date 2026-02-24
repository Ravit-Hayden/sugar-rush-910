<script lang="ts">
	import {
		Droplet, Rocket, Sparkles, Moon, Guitar, Zap, X,
		Flame, LoaderPinwheel, Wine, CarFront, Clapperboard, MicVocal, Sun, Feather,
		Piano, Waves, Skull, PartyPopper, Coffee, Leaf, Church, Baby, TreePalm, TentTree, Citrus,
		Drum, Cat, CloudRain, Wheat, Disc3, Gauge, Radar, Cpu, FlaskConical, Gamepad2,
		Warehouse, Radio, Grid2x2, AudioLines, Cherry, Star, Bomb, HeartPulse, Orbit, Earth,
		Activity, Cable, Siren, Euro, CloudFog,
		Sunset, Tv, Bolt, Eye, Wand2, Target, Ghost, Candy, Anchor, Calculator,
		Mountain, Cloud, MoonStar, Factory, Trash2, Music2, Volume2, Shuffle
	} from 'lucide-svelte';

	import {
		PROJECT_TEMPLATES,
		TEMPLATE_CATEGORIES,
		BLANK_TEMPLATE,
		type ProjectTemplate
	} from '$lib/constants/suno/projectTemplates';

	// Props
	interface Props {
		onSelect?: (template: ProjectTemplate) => void;
		onClose?: () => void;
	}

	let { onSelect, onClose }: Props = $props();

	// 현재 선택된 카테고리
	let selectedCategory = $state<string>('favorite');

	// 아이콘 이름 -> 컴포넌트 매핑
	const iconMap: Record<string, typeof Droplet> = {
		Droplet, Rocket, Sparkles, Moon, Guitar, Zap,
		Flame, LoaderPinwheel, Wine, CarFront, Clapperboard, MicVocal, Sun, Feather,
		Piano, Waves, Skull, PartyPopper, Coffee, Leaf, Church, Baby, TreePalm, TentTree, Citrus,
		Drum, Cat, CloudRain, Wheat, Disc3, Gauge, Radar, Cpu, FlaskConical, Gamepad2,
		Warehouse, Radio, Grid2x2, AudioLines, Cherry, Star, Bomb, HeartPulse, Orbit, Earth,
		Activity, Cable, Siren, Euro, CloudFog,
		Sunset, Tv, Bolt, Eye, Wand2, Target, Ghost, Candy, Anchor, Calculator,
		Mountain, Cloud, MoonStar, Factory, Trash2, Music2, Volume2, Shuffle
	};

	// 필터링된 템플릿 (알파벳순 정렬)
	const filteredTemplates = $derived.by(() => {
		let result: ProjectTemplate[];
		if (selectedCategory === 'favorite') {
			result = PROJECT_TEMPLATES.filter(t => t.isFavorite);
		} else {
			result = PROJECT_TEMPLATES.filter(t => t.category === selectedCategory);
		}
		// 이름순 정렬 (A-Z)
		return result.sort((a, b) => a.name.localeCompare(b.name));
	});

	function handleSelect(template: ProjectTemplate) {
		onSelect?.(template);
	}
</script>

<div class="bg-surface-1 rounded-lg border border-border-subtle overflow-hidden h-[70vh] flex flex-col">
	<!-- 헤더 -->
	<div class="px-6 py-4 border-b border-border-subtle flex items-center justify-between flex-shrink-0">
		<div>
			<h3 class="text-lg font-semibold text-text-strong">프로젝트 템플릿</h3>
			<p class="text-sm text-text-muted mt-0.5">자주 사용하는 설정으로 빠르게 시작하세요</p>
		</div>
		{#if onClose}
			<button type="button" onclick={onClose} class="template-close-btn pt-2 pb-2 pl-2 pr-0 rounded-lg text-text-muted transition-colors flex items-center justify-end">
				<X size={20} />
			</button>
		{/if}
	</div>

	<!-- 카테고리 탭 -->
	<div class="px-6 py-2 flex-shrink-0">
		<div class="flex flex-wrap gap-2">
			{#each TEMPLATE_CATEGORIES as category}
				<button
					type="button"
					onclick={() => selectedCategory = category.id}
					class="category-tab px-3 py-1.5 text-sm font-medium rounded-lg transition-colors {selectedCategory === category.id
						? 'bg-brand-pink text-white'
						: 'bg-surface-2 text-text-muted'}"
				>
					{category.name}
				</button>
			{/each}
		</div>
	</div>

	<!-- 템플릿 그리드 (스크롤 가능) -->
	<div class="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto flex-1 custom-list-scrollbar">
		{#each filteredTemplates as template}
			{@const Icon = iconMap[template.iconName] ?? Droplet}
			<button
				type="button"
				onclick={() => handleSelect(template)}
				class="template-card text-left p-4 rounded-lg border border-border-subtle transition-all"
			>
				<div class="flex items-start gap-3 mb-3">
					<div class="w-10 h-10 rounded-lg {template.color} flex items-center justify-center flex-shrink-0 pointer-events-none">
						<Icon size={20} class="pointer-events-none" />
					</div>
					<div>
						<h4 class="template-card-title text-base font-medium text-text-strong transition-colors">
							{template.name}
						</h4>
						<p class="text-sm text-text-muted mt-0.5">{template.description}</p>
					</div>
				</div>
				<div class="flex flex-wrap gap-1">
					{#each template.tags as tag}
						<span class="px-2 py-0.5 rounded bg-surface-2 text-xs text-text-muted">
							{tag}
						</span>
					{/each}
				</div>
			</button>
		{/each}
	</div>

	<!-- 빈 템플릿 -->
	<div class="px-6 py-4 border-t border-border-subtle flex-shrink-0">
		<button
			type="button"
			onclick={() => handleSelect(BLANK_TEMPLATE)}
			class="empty-project-button w-full py-3 border-2 border-dashed border-border-subtle rounded-lg text-text-muted transition-colors"
		>
			또는 빈 프로젝트로 시작
		</button>
	</div>
</div>