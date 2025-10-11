<script lang="ts">
	import Card from '../Card.svelte';
	import Skeleton from '../Skeleton.svelte';
	import { TrendingUp, BarChart3 } from 'lucide-svelte';

	let { kpi = [], loading = false } = $props();

	// KPI 데이터에서 실제 값 추출
	const totalRevenue = kpi.find(k => k.name === '총 수익')?.points?.slice(-1)[0]?.y || 2450000;
	const releaseCount = kpi.find(k => k.name === '신규 앨범')?.points?.slice(-1)[0]?.y || 8;
</script>

<Card title="KPI 요약 그래프" tooltip="수익 및 성과 지표" class="h-96">
	{#if loading}
		<Skeleton lines={6} />
	{:else}
		<div class="h-full flex flex-col">
			<!-- KPI 요약 -->
			<div class="grid grid-cols-2 gap-4 mb-4">
				<div class="bg-surface-1 rounded p-3">
					<div class="flex items-center gap-2 mb-2">
						<TrendingUp size={16} class="text-ok-fg" />
						<span class="text-sm font-medium text-text-strong">이번주 수익</span>
					</div>
					<div class="text-lg font-bold text-text-strong">₩{totalRevenue.toLocaleString()}</div>
					<div class="text-xs text-ok-fg">+12.5%</div>
				</div>
				<div class="bg-surface-1 rounded p-3">
					<div class="flex items-center gap-2 mb-2">
						<BarChart3 size={16} class="text-brand-pink" />
						<span class="text-sm font-medium text-text-strong">발매 건수</span>
					</div>
					<div class="text-lg font-bold text-text-strong">{releaseCount}</div>
					<div class="text-xs text-ok-fg">+2건</div>
				</div>
			</div>

			<!-- 간단한 차트 영역 -->
			<div class="flex-1 bg-surface-1 rounded p-4 flex items-center justify-center">
				<div class="text-center">
					<BarChart3 size={48} class="text-text-muted mx-auto mb-2" />
					<p class="text-text-muted">차트 데이터 로딩 중...</p>
				</div>
			</div>
		</div>
	{/if}
</Card>
