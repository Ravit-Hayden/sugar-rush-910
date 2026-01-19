<script lang="ts">
	import { Plus, Search, ArrowRight, ChevronDown } from 'lucide-svelte';
	import ProductionProgress from '$lib/components/suno/ProductionProgress.svelte';
	import SUNOTabs from '$lib/components/suno/SUNOTabs.svelte';
	import { PRODUCTION_STAGES } from '$lib/constants/suno/stages';
	import type { SUNOProject, ProductionStageStatus, ProjectStatus } from '$lib/types/suno';

	// 필터 상태
	let searchQuery = $state('');
	let statusFilter = $state<ProjectStatus | 'all'>('all');
	let statusDropdownOpen = $state(false);

	// 목업 데이터
	let projects = $state<SUNOProject[]>([
		{
			id: 'proj1',
			title: '달콤한 밤의 노래',
			description: '여름밤 감성 발라드',
			status: 'in_progress',
			stages: [
				{ stageId: 'idea', isCompleted: true, completedAt: '2026-01-05', completedBy: 'Otte' },
				{ stageId: 'lyrics_draft', isCompleted: true, completedAt: '2026-01-07', completedBy: 'Otte' },
				{ stageId: 'lyrics_structure', isCompleted: true, completedAt: '2026-01-08', completedBy: 'Otte' },
				{ stageId: 'lyrics_suno', isCompleted: true, completedAt: '2026-01-09', completedBy: 'Otte' },
				{ stageId: 'suno_generation', isCompleted: true, completedAt: '2026-01-10', completedBy: 'El' },
				{ stageId: 'suno_selection', isCompleted: false }
			] as ProductionStageStatus[],
			progressPercent: 45,
			createdBy: 'Otte',
			lyricsVersions: [],
			promptConfigs: [],
			audioVersions: [],
			usedWordIds: [],
			createdAt: '2026-01-05',
			updatedAt: '2026-01-10'
		},
		{
			id: 'proj2',
			title: '마카롱 팝',
			description: '귀여운 디저트 컨셉 팝송',
			status: 'in_progress',
			stages: [
				{ stageId: 'idea', isCompleted: true, completedAt: '2026-01-10', completedBy: 'El' },
				{ stageId: 'lyrics_draft', isCompleted: true, completedAt: '2026-01-11', completedBy: 'Otte' },
				{ stageId: 'lyrics_structure', isCompleted: false }
			] as ProductionStageStatus[],
			progressPercent: 18,
			createdBy: 'El',
			lyricsVersions: [],
			promptConfigs: [],
			audioVersions: [],
			usedWordIds: [],
			createdAt: '2026-01-10',
			updatedAt: '2026-01-11'
		},
		{
			id: 'proj3',
			title: '새벽 3시의 고백',
			description: '심야 감성 R&B',
			status: 'in_progress',
			stages: [
				{ stageId: 'idea', isCompleted: true, completedAt: '2026-01-01', completedBy: 'Otte' },
				{ stageId: 'lyrics_draft', isCompleted: true, completedAt: '2026-01-02', completedBy: 'Otte' },
				{ stageId: 'lyrics_structure', isCompleted: true, completedAt: '2026-01-03', completedBy: 'Otte' },
				{ stageId: 'lyrics_suno', isCompleted: true, completedAt: '2026-01-04', completedBy: 'Otte' },
				{ stageId: 'suno_generation', isCompleted: true, completedAt: '2026-01-05', completedBy: 'El' },
				{ stageId: 'suno_selection', isCompleted: true, completedAt: '2026-01-06', completedBy: 'El' },
				{ stageId: 'audio_editing', isCompleted: true, completedAt: '2026-01-08', completedBy: 'El' },
				{ stageId: 'lyrics_final', isCompleted: true, completedAt: '2026-01-09', completedBy: 'Otte' },
				{ stageId: 'mastering', isCompleted: false }
			] as ProductionStageStatus[],
			progressPercent: 73,
			createdBy: 'Otte',
			lyricsVersions: [],
			promptConfigs: [],
			audioVersions: [],
			usedWordIds: [],
			createdAt: '2026-01-01',
			updatedAt: '2026-01-09'
		},
		{
			id: 'proj4',
			title: 'Sugar Rush Vol.1',
			description: '첫 번째 정규앨범 타이틀곡',
			status: 'completed',
			stages: PRODUCTION_STAGES.map(stage => ({
				stageId: stage.id,
				isCompleted: true,
				completedAt: '2025-12-20',
				completedBy: stage.assignedTo === 'El' ? 'El' : 'Otte'
			})) as ProductionStageStatus[],
			progressPercent: 100,
			createdBy: 'El',
			lyricsVersions: [],
			promptConfigs: [],
			audioVersions: [],
			usedWordIds: [],
			linkedTrackId: 'track1',
			createdAt: '2025-11-15',
			updatedAt: '2025-12-20'
		},
		{
			id: 'proj5',
			title: '별빛 아래서',
			description: '로맨틱 팝 발라드',
			status: 'idea',
			stages: [
				{ stageId: 'idea', isCompleted: false }
			] as ProductionStageStatus[],
			progressPercent: 0,
			createdBy: 'Otte',
			lyricsVersions: [],
			promptConfigs: [],
			audioVersions: [],
			usedWordIds: [],
			createdAt: '2026-01-13',
			updatedAt: '2026-01-13'
		}
	]);

	// 상태별 라벨
	const statusLabels: Record<ProjectStatus | 'all', string> = {
		all: '전체',
		idea: '아이디어',
		in_progress: '제작 중',
		completed: '완료',
		archived: '보관'
	};

	// 상태별 색상
	function getStatusColor(status: ProjectStatus): string {
		switch (status) {
			case 'idea': return 'bg-yellow-500/20 text-yellow-400';
			case 'in_progress': return 'bg-brand-pink/20 text-brand-pink';
			case 'completed': return 'bg-green-500/20 text-green-400';
			case 'archived': return 'bg-gray-500/20 text-gray-400';
			default: return 'bg-surface-2 text-text-muted';
		}
	}

	// 필터링
	const filteredProjects = $derived.by(() => {
		return projects.filter(project => {
			// 검색어 필터
			if (searchQuery) {
				const query = searchQuery.toLowerCase();
				if (!project.title.toLowerCase().includes(query) && 
					!project.description?.toLowerCase().includes(query)) {
					return false;
				}
			}
			// 상태 필터
			if (statusFilter !== 'all' && project.status !== statusFilter) {
				return false;
			}
			return true;
		});
	});

	// 상태별 카운트
	const statusCounts = $derived.by(() => {
		const counts: Record<string, number> = { all: projects.length };
		projects.forEach(p => {
			counts[p.status] = (counts[p.status] || 0) + 1;
		});
		return counts;
	});

	// 외부 클릭 처리
	function handleClickOutside(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (!target.closest('.status-dropdown')) {
			statusDropdownOpen = false;
		}
	}

	$effect(() => {
		if (statusDropdownOpen) {
			document.addEventListener('click', handleClickOutside);
		}
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<svelte:head>
	<title>진행 중인 곡 | SUNO 제작</title>
</svelte:head>

<div class="pt-0 pb-6 sm:pb-6 pb-20 bg-bg text-text-base">
	<!-- 헤더 -->
	<div class="mb-8 mt-1.5">
		<div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
			<div>
				<h1 class="text-3xl font-bold text-text-strong mb-2">SUNO 제작</h1>
				<p class="text-text-muted">SUNO AI로 제작 중인 곡들을 관리합니다</p>
			</div>
			<button
				type="button"
				class="flex items-center gap-2 px-4 py-2 bg-brand-pink text-white rounded-lg font-medium hover:bg-brand-pink/90 transition-colors flex-shrink-0"
			>
				<Plus size={16} />
				새 프로젝트
			</button>
		</div>
	</div>

	<!-- 탭 + 콘텐츠 -->
	<SUNOTabs>
		<!-- 필터 영역 -->
		<div class="mb-6 flex flex-col sm:flex-row gap-4">
			<!-- 검색 -->
			<div class="relative flex-1">
				<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
					<Search size={16} class="text-text-muted" />
				</div>
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="곡 제목 또는 설명 검색..."
					class="w-full h-10 pl-10 pr-4 bg-surface-2 border border-border-subtle rounded-lg text-text-base focus:outline-none focus:border-brand-pink"
				/>
			</div>

			<!-- 상태 필터 -->
			<div class="relative status-dropdown">
				<button
					type="button"
					onclick={() => statusDropdownOpen = !statusDropdownOpen}
					class="w-full sm:w-40 h-10 px-4 pr-10 bg-surface-2 border border-border-subtle rounded-lg text-base text-text-base text-left focus:outline-none focus:border-brand-pink transition-colors"
				>
					<span class="block truncate">
						{statusLabels[statusFilter]} ({statusCounts[statusFilter] || 0})
					</span>
				</button>
				<div class="pointer-events-none absolute inset-y-0 right-2.5 flex items-center">
					<ChevronDown size={16} class="text-text-muted" />
				</div>
				{#if statusDropdownOpen}
					<ul class="absolute left-0 w-full mt-[6px] bg-surface-2 border border-border-subtle rounded-[6px] z-10 max-h-60 overflow-y-auto custom-list-scrollbar">
						{#each Object.entries(statusLabels) as [value, label]}
							<li
								role="option"
								aria-selected={statusFilter === value}
								tabindex="0"
								onclick={() => { statusFilter = value as ProjectStatus | 'all'; statusDropdownOpen = false; }}
								onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { statusFilter = value as ProjectStatus | 'all'; statusDropdownOpen = false; } }}
								class="px-4 py-2 text-base text-text-base hover:bg-surface-1 cursor-pointer {statusFilter === value ? 'bg-brand-pink text-white' : ''}"
							>
								{label} ({statusCounts[value] || 0})
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		</div>

		<!-- 프로젝트 그리드 -->
		<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
			{#each filteredProjects as project}
				<a 
					href="/suno/projects/{project.id}"
					class="block bg-surface-2 rounded-lg border border-border-subtle p-5 hover:border-hover-point transition-colors group"
				>
					<!-- 헤더 -->
					<div class="flex items-start justify-between gap-3 mb-3">
						<div class="flex-1 min-w-0">
							<h3 class="text-base font-semibold text-text-strong truncate group-hover:text-brand-pink transition-colors">
								{project.title}
							</h3>
							<p class="text-sm text-text-muted mt-0.5 truncate">{project.description}</p>
						</div>
						<span class="flex-shrink-0 px-2 py-1 rounded-md text-xs font-medium {getStatusColor(project.status)}">
							{statusLabels[project.status]}
						</span>
					</div>

					<!-- 진행률 -->
					<div class="mb-4">
						<ProductionProgress stages={project.stages} compact />
					</div>

					<!-- 푸터 -->
					<div class="flex items-center justify-between text-xs text-text-muted">
						<div class="flex items-center gap-2">
							<span class="font-medium {project.createdBy === 'El' ? 'text-elotte-green' : 'text-elotte-orange'}">
								{project.createdBy}
							</span>
							<span>·</span>
							<span>{project.updatedAt}</span>
						</div>
						<ArrowRight size={14} class="text-text-muted group-hover:text-brand-pink transition-colors" />
					</div>
				</a>
			{/each}

			{#if filteredProjects.length === 0}
				<div class="col-span-full py-12 text-center text-text-muted">
					{searchQuery || statusFilter !== 'all' 
						? '검색 결과가 없습니다.' 
						: '진행 중인 프로젝트가 없습니다.'}
				</div>
			{/if}
		</div>

		<!-- 통계 -->
		<div class="mt-6 text-sm text-text-muted">
			총 {projects.length}개 프로젝트 | 표시 중 {filteredProjects.length}개
		</div>
	</SUNOTabs>
</div>
