<script lang="ts">
	import Card from '../Card.svelte';
	import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-svelte';

	// 목 데이터 - KPI 그래프는 풀폭
	const kpiData = {
		revenue: { current: 1250000, change: 12.5, trend: 'up' },
		downloads: { current: 45000, change: -2.3, trend: 'down' },
		albums: { current: 8, change: 25.0, trend: 'up' },
		users: { current: 1250, change: 8.7, trend: 'up' }
	};
</script>

<Card title="KPI 요약 그래프" tooltip="수익/다운로드/앨범/사용자 지표" href="/kpi" isKpi={true}>
	<div class="grid grid-cols-2 gap-4 h-full">
		<!-- 수익 -->
		<div class="bg-surface-1 rounded-lg p-4 flex flex-col justify-center">
			<div class="flex items-center gap-2 mb-2">
				<BarChart3 size={16} class="text-brand-pink" />
				<span class="text-sm font-semibold text-text-strong">수익</span>
			</div>
			<div class="text-2xl font-bold text-text-strong">₩{kpiData.revenue.current.toLocaleString()}</div>
			<div class="flex items-center gap-1 text-sm">
				{#if kpiData.revenue.trend === 'up'}
					<TrendingUp size={14} class="text-ok-fg" />
					<span class="text-ok-fg">+{kpiData.revenue.change}%</span>
				{:else}
					<TrendingDown size={14} class="text-danger-fg" />
					<span class="text-danger-fg">{kpiData.revenue.change}%</span>
				{/if}
			</div>
		</div>

		<!-- 다운로드 -->
		<div class="bg-surface-1 rounded-lg p-4 flex flex-col justify-center">
			<div class="flex items-center gap-2 mb-2">
				<BarChart3 size={16} class="text-brand-pink" />
				<span class="text-sm font-semibold text-text-strong">다운로드</span>
			</div>
			<div class="text-2xl font-bold text-text-strong">{kpiData.downloads.current.toLocaleString()}</div>
			<div class="flex items-center gap-1 text-sm">
				{#if kpiData.downloads.trend === 'up'}
					<TrendingUp size={14} class="text-ok-fg" />
					<span class="text-ok-fg">+{kpiData.downloads.change}%</span>
				{:else}
					<TrendingDown size={14} class="text-danger-fg" />
					<span class="text-danger-fg">{kpiData.downloads.change}%</span>
				{/if}
			</div>
		</div>

		<!-- 앨범 -->
		<div class="bg-surface-1 rounded-lg p-4 flex flex-col justify-center">
			<div class="flex items-center gap-2 mb-2">
				<BarChart3 size={16} class="text-brand-pink" />
				<span class="text-sm font-semibold text-text-strong">앨범</span>
			</div>
			<div class="text-2xl font-bold text-text-strong">{kpiData.albums.current}</div>
			<div class="flex items-center gap-1 text-sm">
				{#if kpiData.albums.trend === 'up'}
					<TrendingUp size={14} class="text-ok-fg" />
					<span class="text-ok-fg">+{kpiData.albums.change}%</span>
				{:else}
					<TrendingDown size={14} class="text-danger-fg" />
					<span class="text-danger-fg">{kpiData.albums.change}%</span>
				{/if}
			</div>
		</div>

		<!-- 사용자 -->
		<div class="bg-surface-1 rounded-lg p-4 flex flex-col justify-center">
			<div class="flex items-center gap-2 mb-2">
				<BarChart3 size={16} class="text-brand-pink" />
				<span class="text-sm font-semibold text-text-strong">사용자</span>
			</div>
			<div class="text-2xl font-bold text-text-strong">{kpiData.users.current.toLocaleString()}</div>
			<div class="flex items-center gap-1 text-sm">
				{#if kpiData.users.trend === 'up'}
					<TrendingUp size={14} class="text-ok-fg" />
					<span class="text-ok-fg">+{kpiData.users.change}%</span>
				{:else}
					<TrendingDown size={14} class="text-danger-fg" />
					<span class="text-danger-fg">{kpiData.users.change}%</span>
				{/if}
			</div>
		</div>
	</div>
</Card>
