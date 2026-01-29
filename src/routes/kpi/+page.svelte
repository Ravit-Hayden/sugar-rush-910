<script lang="ts">
	import { BarChart3, TrendingUp, Target } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';

	// 목업: 실제 연결 시 /api/kpi 등으로 교체
	const kpiSummary = {
		totalRevenue: 2450000,
		releaseCount: 8,
		weeklyTrend: [48, 64, 36, 56, 72, 44, 60],
		expectedNextWeek: 2800000
	};
</script>

<PageContent>
	<PageHeader
		title="KPI 요약"
		description="기간별 수익·발매·목표 달성률을 확인합니다."
		actions={[{ label: '대시보드', href: '/', icon: BarChart3 }]}
	/>
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		<div class="bg-surface-2 border border-border-subtle rounded-lg p-5">
			<div class="flex items-center gap-2 text-text-muted text-sm mb-2">
				<TrendingUp size={16} class="text-ok-fg" />
				이번주 수익
			</div>
			<p class="text-2xl font-bold text-text-strong">₩{(kpiSummary.totalRevenue / 10000).toFixed(0)}만</p>
		</div>
		<div class="bg-surface-2 border border-border-subtle rounded-lg p-5">
			<div class="flex items-center gap-2 text-text-muted text-sm mb-2">
				<BarChart3 size={16} class="text-brand-pink" />
				발매 건수
			</div>
			<p class="text-2xl font-bold text-text-strong">{kpiSummary.releaseCount}건</p>
		</div>
		<div class="bg-surface-2 border border-border-subtle rounded-lg p-5">
			<div class="flex items-center gap-2 text-text-muted text-sm mb-2">
				<Target size={16} class="text-brand-pink" />
				다음 주 예상 수익
			</div>
			<p class="text-2xl font-bold text-text-strong">₩{(kpiSummary.expectedNextWeek / 10000).toFixed(0)}만</p>
		</div>
	</div>
	<p class="mt-6 text-sm text-text-muted">실제 연동 시 기간별 추이·목표 대비 달성률 API를 연결하면 바로 사용 가능합니다.</p>
</PageContent>
