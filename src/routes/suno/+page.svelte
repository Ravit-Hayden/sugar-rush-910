<script lang="ts">
	import { Music, Wallet, TrendingUp, Clock, CheckCircle2, Plus } from 'lucide-svelte';
	import ProductionProgress from '$lib/components/suno/ProductionProgress.svelte';
	import StatsDashboard from '$lib/components/suno/StatsDashboard.svelte';
	import KeyboardShortcuts from '$lib/components/suno/KeyboardShortcuts.svelte';
	import ProjectTemplates from '$lib/components/suno/ProjectTemplates.svelte';
	import SUNOTabs from '$lib/components/suno/SUNOTabs.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import type { SUNOProject, SUNOSubscription, WordEntry, RecentActivity } from '$lib/types/suno';
	
	// API 레이어
	import { 
		getProjects, 
		getSubscription, 
		getWords, 
		getRecentActivities,
		calculateProjectStats,
		calculateCreditUsage,
		calculateDaysUntilBilling
	} from '$lib/api/suno';

	// UI 상태
	let showStats = $state(false);
	let showTemplates = $state(false);
	let showShortcutsHelp = $state(false);

	// 데이터 상태 (API에서 로드)
	let projects = $state<SUNOProject[]>([]);
	let subscription = $state<SUNOSubscription>({ planType: 'Pro', billingDate: 15, monthlyCredits: 500, remainingCredits: 500, lastUpdated: '' });
	let words = $state<WordEntry[]>([]);
	let recentActivities = $state<RecentActivity[]>([]);

	// 데이터 로드
	$effect(() => {
		loadData();
	});

	async function loadData() {
		const [projectsData, subscriptionData, wordsData, activitiesData] = await Promise.all([
			getProjects(),
			getSubscription(),
			getWords(),
			getRecentActivities(3)
		]);
		
		projects = projectsData;
		subscription = subscriptionData;
		words = wordsData;
		recentActivities = activitiesData;
	}

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

	// 통계 계산 (API 헬퍼 함수 사용)
	const stats = $derived(calculateProjectStats(projects));

	// 크레딧 사용률
	const creditUsagePercent = $derived(calculateCreditUsage(subscription));

	// 다음 결제일까지 남은 일수
	const daysUntilBilling = $derived(calculateDaysUntilBilling(subscription.billingDate));
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
	<div 
		class="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4" 
		onclick={() => showTemplates = false}
		onkeydown={(e) => { if (e.key === 'Escape') showTemplates = false; }}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="max-w-3xl w-full" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()}>
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
			<a href="/suno/projects?status=in_progress" class="bg-surface-2 rounded-lg border border-border-subtle p-4 hover:bg-surface-1/50 transition-colors">
				<div class="flex items-center justify-between mb-2">
					<span class="text-xs text-text-muted">진행 중</span>
					<div class="w-7 h-7 flex items-center justify-center">
						<Music size={14} class="text-brand-pink" />
					</div>
				</div>
				<div class="text-xl font-bold text-text-strong">{stats.inProgress}</div>
			</a>

			<!-- 평균 진행률 -->
			<a href="/suno/projects" class="bg-surface-2 rounded-lg border border-border-subtle p-4 hover:bg-surface-1/50 transition-colors">
				<div class="flex items-center justify-between mb-2">
					<span class="text-xs text-text-muted">평균 진행률</span>
					<div class="w-7 h-7 flex items-center justify-center">
						<TrendingUp size={14} class="text-green-500" />
					</div>
				</div>
				<div class="text-xl font-bold text-text-strong">{stats.avgProgress}%</div>
			</a>

			<!-- 완료된 곡 -->
			<a href="/suno/projects?status=completed" class="bg-surface-2 rounded-lg border border-border-subtle p-4 hover:bg-surface-1/50 transition-colors">
				<div class="flex items-center justify-between mb-2">
					<span class="text-xs text-text-muted">완료</span>
					<div class="w-7 h-7 flex items-center justify-center">
						<CheckCircle2 size={14} class="text-blue-500" />
					</div>
				</div>
				<div class="text-xl font-bold text-text-strong">{stats.completed}</div>
			</a>

			<!-- 크레딧 현황 -->
			<a href="/suno/subscription" class="bg-surface-2 rounded-lg border border-border-subtle p-4 hover:bg-surface-1/50 transition-colors">
				<div class="flex items-center justify-between mb-2">
					<span class="text-xs text-text-muted">크레딧</span>
					<div class="w-7 h-7 flex items-center justify-center">
						<Wallet size={14} class="text-purple-500" />
					</div>
				</div>
				<div class="flex items-baseline gap-1">
					<span class="text-xl font-bold text-text-strong">{subscription.remainingCredits}</span>
					<span class="text-xs text-text-muted">/ {subscription.monthlyCredits}</span>
				</div>
			</a>
		</div>

		<!-- 메인 콘텐츠 그리드 -->
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<!-- 진행 중인 프로젝트 -->
			<div class="lg:col-span-2">
				<div class="bg-surface-2 rounded-lg border border-border-subtle">
					<div class="px-4 py-4 border-b border-border-subtle flex items-center justify-between">
						<h3 class="text-base font-semibold text-text-strong">진행 중인 곡</h3>
						<a href="/suno/projects" class="text-brand-pink text-sm font-semibold px-2 py-1 rounded hover:bg-hover-cyan hover:text-[var(--text-on-hover)] transition-colors">
							더보기
						</a>
					</div>
					<div>
						{#each projects.slice(0, 3) as project, i}
							<a href="/suno/projects/{project.id}" class="block p-4 hover:bg-surface-1/50 transition-colors {i > 0 ? 'border-t border-border-subtle' : ''}">
								<div class="flex items-start justify-between gap-4 mb-3">
									<div class="flex-1 min-w-0">
										<h4 class="text-sm font-medium text-text-strong truncate">{project.title}</h4>
										<p class="text-xs text-text-muted mt-0.5">{project.description}</p>
									</div>
									<div class="flex-shrink-0 flex flex-col items-end gap-1">
										<span class="text-xs text-text-muted">{project.updatedAt}</span>
										<span class="text-xs font-medium {project.createdBy === 'El' ? 'text-elotte-green' : 'text-elotte-orange'}">
											{project.createdBy}
										</span>
									</div>
								</div>
								<ProductionProgress stages={project.stages} compact />
							</a>
						{/each}
						{#if projects.length === 0}
							<div class="p-8 text-center">
								<p class="text-text-muted text-sm mb-4">진행 중인 프로젝트가 없습니다</p>
								<button
									type="button"
									onclick={() => showTemplates = true}
									class="inline-flex items-center gap-2 px-4 py-2 bg-brand-pink text-white text-sm font-medium rounded-lg hover:bg-brand-pink/90 transition-colors"
								>
									<Plus size={16} />
									새 프로젝트 만들기
								</button>
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
						<div class="flex items-center gap-2">
							<h3 class="text-sm font-semibold text-text-strong">SUNO 구독</h3>
							<span class="text-xs font-medium text-brand-pink">{subscription.planType}</span>
						</div>
						<a href="/suno/subscription" class="text-brand-pink text-xs font-semibold px-2 py-1 rounded hover:bg-hover-cyan hover:text-[var(--text-on-hover)] transition-colors">
							관리
						</a>
					</div>
					<div class="space-y-3">
						<div>
							<div class="flex items-center justify-between text-xs mb-1.5">
								<span class="text-text-muted">크레딧 사용</span>
								<span class="text-text-base">{creditUsagePercent}%</span>
							</div>
							<div class="h-2 bg-bg rounded-full overflow-hidden">
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
					<div class="flex items-center justify-between mb-3">
						<h3 class="text-sm font-semibold text-text-strong">최근 활동</h3>
						<a href="/feedback" class="text-brand-pink text-xs font-semibold px-2 py-1 rounded hover:bg-hover-cyan hover:text-[var(--text-on-hover)] transition-colors">
							더보기
						</a>
					</div>
					<div class="space-y-3">
						{#each recentActivities as activity}
							<div class="flex items-start gap-2">
								<Clock size={12} class="text-text-muted mt-0.5 flex-shrink-0" />
								<div>
									<p class="text-xs text-text-base">{activity.projectTitle} - {activity.action}</p>
									<p class="text-xs text-text-muted mt-0.5">{activity.timestamp} · <span class="{activity.author === 'El' ? 'text-elotte-green' : 'text-elotte-orange'}">{activity.author}</span></p>
								</div>
							</div>
						{/each}
						{#if recentActivities.length === 0}
							<p class="text-xs text-text-muted text-center py-2">최근 활동이 없습니다</p>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</SUNOTabs>
</div>
