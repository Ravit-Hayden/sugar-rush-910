<script lang="ts">
	import { DollarSign, TrendingUp, TrendingDown, Minus } from 'lucide-svelte';

	let stats = $state<any>(null);
	let loading = $state(true);

	// 통계 데이터 로드
	$effect(() => {
		(async () => {
			try {
				loading = true;
				const response = await fetch('/api/stats');
				const data = await response.json();
				if (data.ok) {
					stats = data.data;
				}
			} catch (error) {
				console.error('Failed to load stats:', error);
			} finally {
				loading = false;
			}
		})();
		return () => {};
	});
</script>

<div class="card-base h-[396px] flex flex-col bg-surface-1 rounded-lg p-6 border border-border-subtle overflow-hidden pt-[24px]">
	<h3 class="text-lg font-semibold text-text-strong mb-6 flex-shrink-0">수익/지출 통계</h3>

	{#if loading}
		<div class="flex items-center justify-center py-8 flex-1">
			<p class="text-text-muted">로딩 중...</p>
		</div>
	{:else if stats}
		<div class="flex-1 overflow-y-auto min-h-0">
		<!-- 요약 카드 -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
			<!-- 총 수익 -->
			<div class="bg-surface-2 rounded-lg p-4">
				<div class="flex items-center gap-2 mb-2">
					<TrendingUp size={16} class="text-green-500" />
					<span class="text-xs font-medium text-text-muted">총 수익</span>
				</div>
				<div class="text-xl font-bold text-text-strong" data-type="number">
					₩{stats.totalRevenue.toLocaleString()}
				</div>
			</div>

			<!-- 총 지출 -->
			<div class="bg-surface-2 rounded-lg p-4">
				<div class="flex items-center gap-2 mb-2">
					<TrendingDown size={16} class="text-red-500" />
					<span class="text-xs font-medium text-text-muted">총 지출</span>
				</div>
				<div class="text-xl font-bold text-text-strong" data-type="number">
					₩{stats.totalExpense.toLocaleString()}
				</div>
			</div>

			<!-- 순이익 -->
			<div class="bg-surface-2 rounded-lg p-4">
				<div class="flex items-center gap-2 mb-2">
					<DollarSign size={16} class={stats.netProfit >= 0 ? 'text-green-500' : 'text-red-500'} />
					<span class="text-xs font-medium text-text-muted">순이익</span>
				</div>
				<div class="text-xl font-bold {stats.netProfit >= 0 ? 'text-green-500' : 'text-red-500'}" data-type="number">
					{stats.netProfit >= 0 ? '+' : ''}₩{stats.netProfit.toLocaleString()}
				</div>
			</div>
		</div>

		<!-- 이번 달 요약 -->
		<div class="mb-6 p-4 bg-surface-2 rounded-lg">
			<h4 class="text-sm font-semibold text-text-strong mb-3">이번 달</h4>
			<div class="grid grid-cols-3 gap-4 text-center">
				<div>
					<div class="text-xs text-text-muted mb-1">수익</div>
					<div class="text-sm font-semibold text-text-strong" data-type="number">
						₩{stats.monthlyRevenue.toLocaleString()}
					</div>
				</div>
				<div>
					<div class="text-xs text-text-muted mb-1">지출</div>
					<div class="text-sm font-semibold text-text-strong" data-type="number">
						₩{stats.monthlyExpense.toLocaleString()}
					</div>
				</div>
				<div>
					<div class="text-xs text-text-muted mb-1">순이익</div>
					<div class="text-sm font-semibold {stats.monthlyProfit >= 0 ? 'text-green-500' : 'text-red-500'}" data-type="number">
						{stats.monthlyProfit >= 0 ? '+' : ''}₩{stats.monthlyProfit.toLocaleString()}
					</div>
				</div>
			</div>
		</div>

		<!-- 플랫폼별 수익 (상위 3개) -->
		{#if stats.revenueByPlatform && stats.revenueByPlatform.length > 0}
			<div class="mb-6">
				<h4 class="text-sm font-semibold text-text-strong mb-3">플랫폼별 수익 (상위)</h4>
				<div class="space-y-2">
					{#each stats.revenueByPlatform.slice(0, 3) as platform}
						<div class="flex items-center justify-between">
							<span class="text-sm text-text-base">{platform.platform}</span>
							<span class="text-sm font-medium text-text-strong" data-type="number">
								₩{platform.amount.toLocaleString()}
							</span>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- 카테고리별 지출 (상위 3개) -->
		{#if stats.expenseByCategory && stats.expenseByCategory.length > 0}
			<div>
				<h4 class="text-sm font-semibold text-text-strong mb-3">카테고리별 지출 (상위)</h4>
				<div class="space-y-2">
					{#each stats.expenseByCategory.slice(0, 3) as category}
						<div class="flex items-center justify-between">
							<span class="text-sm text-text-base">{category.category}</span>
							<span class="text-sm font-medium text-text-strong" data-type="number">
								₩{category.amount.toLocaleString()}
							</span>
						</div>
					{/each}
				</div>
			</div>
		{/if}
		</div>
	{:else}
		<div class="flex-1 flex items-center justify-center">
			<p class="text-text-muted text-center py-8">통계 데이터가 없습니다.</p>
		</div>
	{/if}
</div>
