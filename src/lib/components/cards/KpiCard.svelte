<script lang="ts">
	import Card from '../Card.svelte';
	import Skeleton from '../Skeleton.svelte';
	import { TrendingUp, BarChart3 } from 'lucide-svelte';

	let { kpi = [], loading = false } = $props();

	// KPI 데이터에서 실제 값 추출
	const totalRevenue = kpi.find(k => k.name === '총 수익')?.points?.slice(-1)[0]?.y || 2450000;
	const releaseCount = kpi.find(k => k.name === '신규 앨범')?.points?.slice(-1)[0]?.y || 8;
</script>

<Card title="KPI 요약 그래프" tooltip="수익 및 성과 지표" class="h-80 lg:h-[160px]">
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
			<div class="flex-1 bg-surface-1 rounded p-4 flex items-center justify-center min-h-0">
				<div class="w-full h-full flex flex-col items-center justify-center">
					<!-- 간단한 막대 차트 시뮬레이션 -->
					<div class="w-full flex items-end justify-center gap-2 mb-3" style="height: min(120px, 100%);">
						<div class="bg-brand-pink rounded-t" style="height: 60%; width: 20px;"></div>
						<div class="bg-hover-cyan rounded-t" style="height: 80%; width: 20px;"></div>
						<div class="bg-brand-pink rounded-t" style="height: 45%; width: 20px;"></div>
						<div class="bg-hover-cyan rounded-t" style="height: 70%; width: 20px;"></div>
						<div class="bg-brand-pink rounded-t" style="height: 90%; width: 20px;"></div>
						<div class="bg-hover-cyan rounded-t" style="height: 55%; width: 20px;"></div>
						<div class="bg-brand-pink rounded-t" style="height: 75%; width: 20px;"></div>
					</div>
					<p class="text-text-muted text-sm">주간 수익 추이</p>
				</div>
			</div>

			<!-- 하단 액션 그룹 -->
			<div class="mt-auto flex flex-row justify-end gap-x-2 mb-2">
				<a href="/kpi" class="text-brand-pink font-semibold text-sm px-4 py-1 rounded transition-colors hover:bg-hover-cyan">
					자세히 보기
				</a>
			</div>
		</div>
	{/if}
</Card>
