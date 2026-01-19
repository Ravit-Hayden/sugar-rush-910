<script lang="ts">
	import { TrendingUp, Music, FileText, CreditCard, Calendar, BarChart3 } from 'lucide-svelte';
	import type { SUNOProject, WordEntry } from '$lib/types/suno';

	// Props
	interface Props {
		projects: SUNOProject[];
		words: WordEntry[];
		creditsUsed: number;
		totalCredits: number;
	}

	let { projects, words, creditsUsed, totalCredits }: Props = $props();

	// 월별 제작량 (최근 6개월)
	const monthlyStats = $derived.by(() => {
		const months: Record<string, { completed: number; started: number }> = {};
		const now = new Date();
		
		// 최근 6개월 초기화
		for (let i = 5; i >= 0; i--) {
			const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
			const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
			months[key] = { completed: 0, started: 0 };
		}

		// 프로젝트 집계
		projects.forEach(project => {
			const createdMonth = project.createdAt.substring(0, 7);
			if (months[createdMonth]) {
				months[createdMonth].started++;
			}
			if (project.status === 'completed') {
				const updatedMonth = project.updatedAt.substring(0, 7);
				if (months[updatedMonth]) {
					months[updatedMonth].completed++;
				}
			}
		});

		return Object.entries(months).map(([month, stats]) => ({
			month: month.substring(5) + '월',
			...stats
		}));
	});

	// 상태별 분포
	const statusDistribution = $derived.by(() => {
		const dist: Record<string, number> = {
			idea: 0,
			in_progress: 0,
			completed: 0,
			archived: 0
		};
		projects.forEach(p => {
			dist[p.status] = (dist[p.status] || 0) + 1;
		});
		return dist;
	});

	// 담당자별 통계
	const authorStats = $derived.by(() => {
		const stats = { El: 0, Otte: 0 };
		projects.forEach(p => {
			stats[p.createdBy]++;
		});
		return stats;
	});

	// 워드 카테고리별 사용량
	const wordCategoryStats = $derived.by(() => {
		const stats: Record<string, number> = {};
		words.forEach(w => {
			stats[w.category] = (stats[w.category] || 0) + w.usageCount;
		});
		return Object.entries(stats)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 5);
	});

	// 가장 많이 사용된 워드
	const topWords = $derived(
		[...words]
			.sort((a, b) => b.usageCount - a.usageCount)
			.slice(0, 5)
	);

	// 최대값 (차트 스케일용)
	const maxMonthly = $derived(
		Math.max(...monthlyStats.map(s => Math.max(s.completed, s.started)), 1)
	);
</script>

<div class="space-y-6">
	<!-- 상단 통계 카드 -->
	<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
		<div class="bg-surface-1 rounded-lg border border-border-subtle p-4">
			<div class="flex items-center gap-2 text-text-muted mb-2">
				<Music size={16} />
				<span class="text-sm">전체 프로젝트</span>
			</div>
			<p class="text-2xl font-bold text-text-strong">{projects.length}</p>
		</div>
		<div class="bg-surface-1 rounded-lg border border-border-subtle p-4">
			<div class="flex items-center gap-2 text-text-muted mb-2">
				<TrendingUp size={16} />
				<span class="text-sm">완료율</span>
			</div>
			<p class="text-2xl font-bold text-green-500">
				{projects.length > 0 ? Math.round((statusDistribution.completed / projects.length) * 100) : 0}%
			</p>
		</div>
		<div class="bg-surface-1 rounded-lg border border-border-subtle p-4">
			<div class="flex items-center gap-2 text-text-muted mb-2">
				<FileText size={16} />
				<span class="text-sm">워드 라이브러리</span>
			</div>
			<p class="text-2xl font-bold text-text-strong">{words.length}</p>
		</div>
		<div class="bg-surface-1 rounded-lg border border-border-subtle p-4">
			<div class="flex items-center gap-2 text-text-muted mb-2">
				<CreditCard size={16} />
				<span class="text-sm">크레딧 사용</span>
			</div>
			<p class="text-2xl font-bold text-brand-pink">{creditsUsed}/{totalCredits}</p>
		</div>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- 월별 제작량 차트 -->
		<div class="bg-surface-1 rounded-lg border border-border-subtle p-6">
			<h4 class="text-sm font-semibold text-text-strong mb-4 flex items-center gap-2">
				<BarChart3 size={16} />
				월별 제작량
			</h4>
			<div class="flex items-end gap-2 h-40">
				{#each monthlyStats as stat}
					<div class="flex-1 flex flex-col items-center gap-1">
						<div class="w-full flex gap-0.5 justify-center" style="height: 120px;">
							<!-- 시작 -->
							<div 
								class="w-3 bg-blue-500/50 rounded-t"
								style="height: {(stat.started / maxMonthly) * 100}%; min-height: {stat.started > 0 ? '4px' : '0'}"
								title="시작: {stat.started}"
							></div>
							<!-- 완료 -->
							<div 
								class="w-3 bg-green-500 rounded-t"
								style="height: {(stat.completed / maxMonthly) * 100}%; min-height: {stat.completed > 0 ? '4px' : '0'}"
								title="완료: {stat.completed}"
							></div>
						</div>
						<span class="text-xs text-text-muted">{stat.month}</span>
					</div>
				{/each}
			</div>
			<div class="flex items-center justify-center gap-4 mt-4 text-xs text-text-muted">
				<span class="flex items-center gap-1">
					<span class="w-3 h-3 rounded bg-blue-500/50"></span> 시작
				</span>
				<span class="flex items-center gap-1">
					<span class="w-3 h-3 rounded bg-green-500"></span> 완료
				</span>
			</div>
		</div>

		<!-- 상태 분포 -->
		<div class="bg-surface-1 rounded-lg border border-border-subtle p-6">
			<h4 class="text-sm font-semibold text-text-strong mb-4">프로젝트 상태 분포</h4>
			<div class="space-y-3">
				{#each Object.entries({ idea: '아이디어', in_progress: '제작 중', completed: '완료', archived: '보관' }) as [key, label]}
					{@const count = statusDistribution[key]}
					{@const percent = projects.length > 0 ? (count / projects.length) * 100 : 0}
					<div>
						<div class="flex items-center justify-between text-sm mb-1">
							<span class="text-text-base">{label}</span>
							<span class="text-text-muted">{count}개 ({Math.round(percent)}%)</span>
						</div>
						<div class="h-2 bg-bg rounded-full overflow-hidden">
							<div 
								class="h-full rounded-full transition-all duration-300
									{key === 'idea' ? 'bg-yellow-500' : ''}
									{key === 'in_progress' ? 'bg-brand-pink' : ''}
									{key === 'completed' ? 'bg-green-500' : ''}
									{key === 'archived' ? 'bg-gray-500' : ''}"
								style="width: {percent}%"
							></div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- 담당자별 통계 -->
		<div class="bg-surface-1 rounded-lg border border-border-subtle p-6">
			<h4 class="text-sm font-semibold text-text-strong mb-4">담당자별 프로젝트</h4>
			<div class="flex items-center gap-8">
				{#each Object.entries(authorStats) as [author, count]}
					<div class="flex-1 text-center">
						<div class="w-16 h-16 mx-auto rounded-full {author === 'El' ? 'bg-[var(--elotte-green)]/20' : 'bg-[var(--elotte-orange)]/20'} flex items-center justify-center mb-2">
							<span class="text-2xl font-bold {author === 'El' ? 'text-elotte-green' : 'text-elotte-orange'}">{count}</span>
						</div>
						<span class="text-sm font-medium text-text-base">{author}</span>
					</div>
				{/each}
			</div>
		</div>

		<!-- 인기 워드 -->
		<div class="bg-surface-1 rounded-lg border border-border-subtle p-6">
			<h4 class="text-sm font-semibold text-text-strong mb-4">가장 많이 사용된 워드</h4>
			<div class="space-y-2">
				{#each topWords as word, i}
					<div class="flex items-center gap-3">
						<span class="w-5 h-5 rounded-full bg-brand-pink/20 text-brand-pink text-xs flex items-center justify-center font-medium">
							{i + 1}
						</span>
						<span class="flex-1 text-sm text-text-base truncate">{word.content}</span>
						<span class="text-sm text-text-muted">{word.usageCount}회</span>
					</div>
				{/each}
				{#if topWords.length === 0}
					<p class="text-sm text-text-muted text-center py-4">데이터 없음</p>
				{/if}
			</div>
		</div>
	</div>
</div>
