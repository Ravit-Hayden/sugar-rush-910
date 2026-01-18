<script lang="ts">
	import { FileText, Music, Sparkles, Zap, X } from 'lucide-svelte';

	// Props
	interface Props {
		onSelect?: (template: ProjectTemplate) => void;
		onClose?: () => void;
	}

	let { onSelect, onClose }: Props = $props();

	// 템플릿 타입
	interface ProjectTemplate {
		id: string;
		name: string;
		description: string;
		icon: typeof FileText;
		color: string;
		defaultStyles: string;
		defaultExclude: string;
		defaultVocalGender: 'Male' | 'Female' | 'Duet';
		tags: string[];
	}

	// 프리셋 템플릿
	const templates: ProjectTemplate[] = [
		{
			id: 'ballad',
			name: '감성 발라드',
			description: '부드럽고 감성적인 발라드 스타일',
			icon: Music,
			color: 'bg-blue-500/20 text-blue-400',
			defaultStyles: 'soft ballad, emotional vocals, piano, strings, korean, heartfelt, intimate atmosphere',
			defaultExclude: 'upbeat, dance, electronic, harsh, aggressive',
			defaultVocalGender: 'Female',
			tags: ['발라드', '감성', '피아노']
		},
		{
			id: 'kpop',
			name: 'K-POP 업템포',
			description: '신나는 K-POP 댄스 스타일',
			icon: Zap,
			color: 'bg-brand-pink/20 text-brand-pink',
			defaultStyles: 'upbeat K-pop, catchy hooks, energetic dance-pop, powerful beats, polished production, trendy',
			defaultExclude: 'slow, ballad, acoustic, mellow, sad',
			defaultVocalGender: 'Female',
			tags: ['K-POP', '댄스', '업템포']
		},
		{
			id: 'synth',
			name: '드리미 신스팝',
			description: '몽환적인 신스팝 스타일',
			icon: Sparkles,
			color: 'bg-purple-500/20 text-purple-400',
			defaultStyles: 'dreamy synth-pop, ethereal vocals, ambient, retro synth, 80s inspired, atmospheric',
			defaultExclude: 'acoustic, heavy, aggressive, country, jazz',
			defaultVocalGender: 'Female',
			tags: ['신스팝', '몽환', '레트로']
		},
		{
			id: 'rnb',
			name: 'R&B 소울',
			description: '부드러운 R&B 소울 스타일',
			icon: Music,
			color: 'bg-orange-500/20 text-orange-400',
			defaultStyles: 'R&B soul, smooth grooves, emotional vocals, modern production, late night vibes, sensual',
			defaultExclude: 'rock, metal, country, fast tempo, harsh',
			defaultVocalGender: 'Male',
			tags: ['R&B', '소울', '그루비']
		},
		{
			id: 'acoustic',
			name: '어쿠스틱 포크',
			description: '따뜻한 어쿠스틱 기타 스타일',
			icon: FileText,
			color: 'bg-green-500/20 text-green-400',
			defaultStyles: 'mellow acoustic, warm vocals, gentle guitar, intimate atmosphere, singer-songwriter, folk',
			defaultExclude: 'electronic, synth, heavy bass, aggressive, dance',
			defaultVocalGender: 'Female',
			tags: ['어쿠스틱', '포크', '따뜻함']
		},
		{
			id: 'hiphop',
			name: '힙합 비트',
			description: '모던 힙합/랩 스타일',
			icon: Zap,
			color: 'bg-red-500/20 text-red-400',
			defaultStyles: 'hip-hop, trap beats, modern rap, bass heavy, urban, stylish flow',
			defaultExclude: 'acoustic, ballad, classical, country, soft',
			defaultVocalGender: 'Male',
			tags: ['힙합', '랩', '트랩']
		}
	];

	function handleSelect(template: ProjectTemplate) {
		onSelect?.(template);
	}
</script>

<div class="bg-surface-1 rounded-lg border border-border-subtle overflow-hidden">
	<!-- 헤더 -->
	<div class="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
		<div>
			<h3 class="text-lg font-semibold text-text-strong">프로젝트 템플릿</h3>
			<p class="text-sm text-text-muted mt-0.5">자주 사용하는 설정으로 빠르게 시작하세요</p>
		</div>
		{#if onClose}
			<button type="button" onclick={onClose} class="btn-icon">
				<X size={20} />
			</button>
		{/if}
	</div>

	<!-- 템플릿 그리드 -->
	<div class="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each templates as template}
			{@const Icon = template.icon}
			<button
				type="button"
				onclick={() => handleSelect(template)}
				class="text-left p-4 rounded-lg border border-border-subtle hover:border-brand-pink transition-all group"
			>
				<div class="flex items-start gap-3 mb-3">
					<div class="w-10 h-10 rounded-lg {template.color} flex items-center justify-center flex-shrink-0">
						<Icon size={20} />
					</div>
					<div>
						<h4 class="text-base font-medium text-text-strong group-hover:text-brand-pink transition-colors">
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
	<div class="px-6 pb-6">
		<button
			type="button"
			onclick={() => handleSelect({ id: 'blank', name: '빈 프로젝트', description: '', icon: FileText, color: '', defaultStyles: '', defaultExclude: '', defaultVocalGender: 'Female', tags: [] })}
			class="w-full py-3 border-2 border-dashed border-border-subtle rounded-lg text-text-muted hover:border-brand-pink hover:text-brand-pink transition-colors"
		>
			또는 빈 프로젝트로 시작
		</button>
	</div>
</div>
