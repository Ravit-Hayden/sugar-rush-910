<script lang="ts">
	import { Music, Wallet, TrendingUp, Clock, CheckCircle2, ArrowRight, Plus, BarChart3 } from 'lucide-svelte';
	import ProductionProgress from '$lib/components/suno/ProductionProgress.svelte';
	import StatsDashboard from '$lib/components/suno/StatsDashboard.svelte';
	import KeyboardShortcuts from '$lib/components/suno/KeyboardShortcuts.svelte';
	import ProjectTemplates from '$lib/components/suno/ProjectTemplates.svelte';
	import SUNOTabs from '$lib/components/suno/SUNOTabs.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import type { SUNOProject, SUNOSubscription, ProductionStageStatus, WordEntry } from '$lib/types/suno';

	// UI 상태
	let showStats = $state(false);
	let showTemplates = $state(false);
	let showShortcutsHelp = $state(false);

	// 목업 워드 데이터
	let words: WordEntry[] = $state([
		{ id: '1', content: '달콤한 꿈', category: 'topic', tags: [], usageCount: 5, linkedTracks: [], createdAt: '2026-01-10', createdBy: 'El' },
		{ id: '2', content: '여름밤의 설렘', category: 'mood', tags: [], usageCount: 3, linkedTracks: [], createdAt: '2026-01-11', createdBy: 'Otte' },
		{ id: '3', content: '설레는 마음', category: 'emotion', tags: [], usageCount: 10, linkedTracks: [], createdAt: '2026-01-06', createdBy: 'El' }
	]);

	// 키보드 단축키 액션
	function handleShortcutAction(action: string) {
		switch (action) {
			case 'new_project':
				showTemplates = true;
				break;
			case 'help':
				showShortcutsHelp = true;
				break;
			case 'close':
				showStats = false;
				showTemplates = false;
				showShortcutsHelp = false;
				break;
		}
	}

	// 목업 데이터 - 구독 정보
	let subscription: SUNOSubscription = $state({
		planType: 'Pro',
		billingDate: 15,
		monthlyCredits: 500,
		remainingCredits: 320,
		lastUpdated: '2026-01-13'
	});

	// 목업 데이터 - 진행 중인 프로젝트
	let projects: SUNOProject[] = $state([
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
				{ stageId: 'suno_selection', isCompleted: true, completedAt: '2026-01-06', completedBy: 'Both' },
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
		}
	]);

	// 통계 계산
	const stats = $derived.by(() => {
		const inProgress = projects.filter(p => p.status === 'in_progress').length;
		const completed = projects.filter(p => p.status === 'completed').length;
		const totalProgress = projects.reduce((sum, p) => sum + p.progressPercent, 0);
		const avgProgress = projects.length > 0 ? Math.round(totalProgress / projects.length) : 0;

		return { inProgress, completed, avgProgress, totalProjects: projects.length };
	});

	// 크레딧 사용률
	const creditUsagePercent = $derived(
		Math.round(((subscription.monthlyCredits - subscription.remainingCredits) / subscription.monthlyCredits) * 100)
	);

	// 다음 결제일까지 남은 일수
	const daysUntilBilling = $derived.by(() => {
		const today = new Date();
		const currentDay = today.getDate();
		if (currentDay < subscription.billingDate) {
			return subscription.billingDate - currentDay;
		}
		const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, subscription.billingDate);
		const diff = Math.ceil((nextMonth.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
		return diff;
	});
</script>

<svelte:head>
	<title>SUNO 제작 현황 | Sugar Rush</title>
</svelte:head>

<!-- 키보드 단축키 -->
<KeyboardShortcuts 
	onAction={handleShortcutAction}
	showHelp={showShortcutsHelp}
	onCloseHelp={() => showShortcutsHelp = false}
/>

<!-- 템플릿 모달 -->
{#if showTemplates}
	<div class="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4" onclick={() => showTemplates = false}>
		<div class="max-w-3xl w-full" onclick={(e) => e.stopPropagation()}>
			<ProjectTemplates 
				onSelect={(template) => { showTemplates = false; }}
				onClose={() => showTemplates = false}
			/>
		</div>
	</div>
{/if}

<div class="pt-0 pb-6 sm:pb-6 pb-20 bg-bg text-text-base">
	<!-- 헤더 -->
	<PageHeader 
		title="SUNO 제작" 
		description="AI 음악 제작을 관리합니다"
		actions={[
			{
				icon: Plus,
				label: '새 프로젝트',
				onclick: () => showTemplates = true
			}
		]}
	/>

	<!-- 탭 + 콘텐츠 -->
	<SUNOTabs>
		<!-- 통계 대시보드 (토글) -->
		{#if showStats}
			<div class="mb-6">
				<StatsDashboard 
					{projects}
					{words}
					creditsUsed={subscription.monthlyCredits - subscription.remainingCredits}
					totalCredits={subscription.monthlyCredits}
				/>
			</div>
		{/if}

		<!-- 통계 카드 -->
		<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
			<!-- 진행 중인 곡 -->
			<div class="bg-surface-2 rounded-lg border border-border-subtle p-4">
				<div class="flex items-center justify-between mb-2">
					<span class="text-xs text-text-muted">진행 중</span>
					<div class="w-7 h-7 bg-brand-pink/10 rounded-lg flex items-center justify-center">
						<Music size={14} class="text-brand-pink" />
					</div>
				</div>
				<div class="text-xl font-bold text-text-strong">{stats.inProgress}</div>
			</div>

			<!-- 평균 진행률 -->
			<div class="bg-surface-2 rounded-lg border border-border-subtle p-4">
				<div class="flex items-center justify-between mb-2">
					<span class="text-xs text-text-muted">평균 진행률</span>
					<div class="w-7 h-7 bg-green-500/10 rounded-lg flex items-center justify-center">
						<TrendingUp size={14} class="text-green-500" />
					</div>
				</div>
				<div class="text-xl font-bold text-text-strong">{stats.avgProgress}%</div>
			</div>

			<!-- 완료된 곡 -->
			<div class="bg-surface-2 rounded-lg border border-border-subtle p-4">
				<div class="flex items-center justify-between mb-2">
					<span class="text-xs text-text-muted">완료</span>
					<div class="w-7 h-7 bg-blue-500/10 rounded-lg flex items-center justify-center">
						<CheckCircle2 size={14} class="text-blue-500" />
					</div>
				</div>
				<div class="text-xl font-bold text-text-strong">{stats.completed}</div>
			</div>

			<!-- 크레딧 현황 -->
			<div class="bg-surface-2 rounded-lg border border-border-subtle p-4">
				<div class="flex items-center justify-between mb-2">
					<span class="text-xs text-text-muted">크레딧</span>
					<div class="w-7 h-7 bg-purple-500/10 rounded-lg flex items-center justify-center">
						<Wallet size={14} class="text-purple-500" />
					</div>
				</div>
				<div class="flex items-baseline gap-1">
					<span class="text-xl font-bold text-text-strong">{subscription.remainingCredits}</span>
					<span class="text-xs text-text-muted">/ {subscription.monthlyCredits}</span>
				</div>
			</div>
		</div>

		<!-- 메인 콘텐츠 그리드 -->
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<!-- 진행 중인 프로젝트 -->
			<div class="lg:col-span-2">
				<div class="bg-surface-2 rounded-lg border border-border-subtle">
					<div class="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
						<h3 class="text-base font-semibold text-text-strong">진행 중인 곡</h3>
						<a href="/suno/projects" class="text-brand-pink text-sm font-semibold px-2 py-1 rounded hover:bg-hover-cyan hover:text-[var(--text-on-hover)] transition-colors flex items-center gap-1">
							더보기
							<ArrowRight size={14} />
						</a>
					</div>
					<div>
						{#each projects.slice(0, 3) as project, i}
							<a href="/suno/projects/{project.id}" class="block p-4 hover:bg-surface-1/50 transition-colors {i > 0 ? 'border-t border-border-subtle' : ''}">
								<div class="flex items-start justify-between gap-4">
									<div class="flex-1 min-w-0">
										<h4 class="text-sm font-medium text-text-strong truncate">{project.title}</h4>
										<p class="text-xs text-text-muted mt-0.5">{project.description}</p>
										<div class="mt-3">
											<ProductionProgress stages={project.stages} compact />
										</div>
									</div>
									<div class="flex-shrink-0 flex flex-col items-end gap-1">
										<span class="text-xs text-text-muted">{project.updatedAt}</span>
										<span class="text-xs font-medium {project.createdBy === 'El' ? 'text-blue-400' : 'text-purple-400'}">
											{project.createdBy}
										</span>
									</div>
								</div>
							</a>
						{/each}
						{#if projects.length === 0}
							<div class="p-8 text-center text-text-muted text-sm">
								진행 중인 프로젝트가 없습니다
							</div>
						{/if}
					</div>
				</div>
			</div>

			<!-- 사이드 패널 -->
			<div class="space-y-4">
				<!-- 구독 정보 -->
				<div class="bg-surface-2 rounded-lg border border-border-subtle p-4">
					<div class="flex items-center justify-between mb-3">
						<h3 class="text-sm font-semibold text-text-strong">SUNO 구독</h3>
						<span class="text-xs font-medium text-brand-pink">{subscription.planType}</span>
					</div>
					<div class="space-y-3">
						<div>
							<div class="flex items-center justify-between text-xs mb-1.5">
								<span class="text-text-muted">크레딧 사용</span>
								<span class="text-text-base">{creditUsagePercent}%</span>
							</div>
							<div class="h-1.5 bg-bg rounded-full overflow-hidden">
								<div 
									class="h-full transition-all duration-300 {creditUsagePercent > 80 ? 'bg-red-500' : creditUsagePercent > 50 ? 'bg-yellow-500' : 'bg-green-500'}"
									style="width: {creditUsagePercent}%"
								></div>
							</div>
						</div>
						<div class="flex items-center justify-between text-xs">
							<span class="text-text-muted">다음 결제</span>
							<span class="text-text-base">{daysUntilBilling}일 후</span>
						</div>
					</div>
				</div>

				<!-- 최근 활동 -->
				<div class="bg-surface-2 rounded-lg border border-border-subtle p-4">
					<h3 class="text-sm font-semibold text-text-strong mb-3">최근 활동</h3>
					<div class="space-y-3">
						<div class="flex items-start gap-2">
							<Clock size={12} class="text-text-muted mt-0.5 flex-shrink-0" />
							<div>
								<p class="text-xs text-text-base">달콤한 밤의 노래 - SUNO 생성 완료</p>
								<p class="text-xs text-text-muted mt-0.5">2시간 전 · El</p>
							</div>
						</div>
						<div class="flex items-start gap-2">
							<Clock size={12} class="text-text-muted mt-0.5 flex-shrink-0" />
							<div>
								<p class="text-xs text-text-base">마카롱 팝 - 가사 초안 작성</p>
								<p class="text-xs text-text-muted mt-0.5">5시간 전 · Otte</p>
							</div>
						</div>
						<div class="flex items-start gap-2">
							<Clock size={12} class="text-text-muted mt-0.5 flex-shrink-0" />
							<div>
								<p class="text-xs text-text-base">새벽 3시의 고백 - 마스터링 시작</p>
								<p class="text-xs text-text-muted mt-0.5">1일 전 · El</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</SUNOTabs>
</div>
