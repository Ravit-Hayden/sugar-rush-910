<script lang="ts">
	import { DollarSign, TrendingUp, TrendingDown, Info, ExternalLink } from 'lucide-svelte';

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

	// 숫자 포맷팅 (K, M 단위)
	function formatNumber(num: number): string {
		if (num >= 1000000) {
			return `₩${(num / 1000000).toFixed(1)}M`;
		} else if (num >= 1000) {
			return `₩${(num / 1000).toFixed(1)}K`;
		}
		return `₩${num.toLocaleString()}`;
	}
</script>

<div class="card-base h-[396px] flex flex-col justify-between p-5 rounded-lg bg-surface-2 border border-border-subtle overflow-hidden pt-[24px]">
	<div>
		<!-- 상단 타이틀영역 -->
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-lg font-bold text-text-strong truncate">수익/지출 통계</h3>
			<button class="inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-surface-1 transition-colors ml-2" aria-label="정보" title="수익 및 지출 통계 요약" type="button">
				<Info size={12} class="text-text-muted" />
			</button>
		</div>

		{#if loading}
			<div class="flex items-center justify-center py-8">
				<p class="text-text-muted">로딩 중...</p>
			</div>
		{:else if stats}
			<!-- 요약 카드 (3개) -->
			<div class="grid grid-cols-3 gap-2 mb-3">
				<!-- 총 수익 -->
				<div class="bg-surface-1 rounded p-3 min-w-0">
					<div class="flex items-center gap-1.5 mb-1.5 min-w-0">
						<TrendingUp size={14} class="text-green-500 flex-shrink-0" />
						<span class="text-xs font-medium text-text-muted truncate">총 수익</span>
					</div>
					<div class="text-base font-bold text-text-strong truncate" data-type="number" title="₩{stats.totalRevenue.toLocaleString()}">
						{formatNumber(stats.totalRevenue)}
					</div>
				</div>

				<!-- 총 지출 -->
				<div class="bg-surface-1 rounded p-3 min-w-0">
					<div class="flex items-center gap-1.5 mb-1.5 min-w-0">
						<TrendingDown size={14} class="text-red-500 flex-shrink-0" />
						<span class="text-xs font-medium text-text-muted truncate">총 지출</span>
					</div>
					<div class="text-base font-bold text-text-strong truncate" data-type="number" title="₩{stats.totalExpense.toLocaleString()}">
						{formatNumber(stats.totalExpense)}
					</div>
				</div>

				<!-- 순이익 -->
				<div class="bg-surface-1 rounded p-3 min-w-0">
					<div class="flex items-center gap-1.5 mb-1.5 min-w-0">
						<DollarSign size={14} class="{stats.netProfit >= 0 ? 'text-green-500' : 'text-red-500'} flex-shrink-0" />
						<span class="text-xs font-medium text-text-muted truncate">순이익</span>
					</div>
					<div class="text-base font-bold {stats.netProfit >= 0 ? 'text-green-500' : 'text-red-500'} truncate" data-type="number" title="{stats.netProfit >= 0 ? '+' : ''}₩{stats.netProfit.toLocaleString()}">
						{stats.netProfit >= 0 ? '+' : ''}{formatNumber(Math.abs(stats.netProfit))}
					</div>
				</div>
			</div>

			<!-- 이번 달 요약 (간소화) -->
			<div class="mb-3 p-2 bg-surface-1 rounded">
				<div class="grid grid-cols-3 gap-1.5 text-center">
					<div class="min-w-0">
						<div class="text-xs text-text-muted mb-0.5 truncate">이번 달 수익</div>
						<div class="text-xs font-semibold text-text-strong truncate" data-type="number" title="₩{stats.monthlyRevenue.toLocaleString()}">
							{formatNumber(stats.monthlyRevenue)}
						</div>
					</div>
					<div class="min-w-0">
						<div class="text-xs text-text-muted mb-0.5 truncate">이번 달 지출</div>
						<div class="text-xs font-semibold text-text-strong truncate" data-type="number" title="₩{stats.monthlyExpense.toLocaleString()}">
							{formatNumber(stats.monthlyExpense)}
						</div>
					</div>
					<div class="min-w-0">
						<div class="text-xs text-text-muted mb-0.5 truncate">이번 달 순이익</div>
						<div class="text-xs font-semibold {stats.monthlyProfit >= 0 ? 'text-green-500' : 'text-red-500'} truncate" data-type="number" title="{stats.monthlyProfit >= 0 ? '+' : ''}₩{stats.monthlyProfit.toLocaleString()}">
							{stats.monthlyProfit >= 0 ? '+' : ''}{formatNumber(Math.abs(stats.monthlyProfit))}
						</div>
					</div>
				</div>
			</div>

			<!-- 플랫폼별 수익 & 카테고리별 지출 (가로 배치) -->
			<div class="grid grid-cols-2 gap-3">
				<!-- 플랫폼별 수익 (상위 2개) -->
				{#if stats.revenueByPlatform && stats.revenueByPlatform.length > 0}
					<div class="min-h-0 flex flex-col">
						<h4 class="text-xs font-semibold text-text-strong mb-1.5 truncate">플랫폼별 수익</h4>
						<div class="space-y-1">
							{#each stats.revenueByPlatform.slice(0, 2) as platform}
								<div class="flex items-center justify-between gap-2 min-w-0 h-6">
									<span class="text-xs text-text-base truncate min-w-0">{platform.platform}</span>
									<span class="text-xs font-medium text-text-strong flex-shrink-0" data-type="number" title="₩{platform.amount.toLocaleString()}">
										{formatNumber(platform.amount)}
									</span>
								</div>
							{/each}
						</div>
					</div>
				{/if}

				<!-- 카테고리별 지출 (상위 2개) -->
				{#if stats.expenseByCategory && stats.expenseByCategory.length > 0}
					<div class="min-h-0 flex flex-col">
						<h4 class="text-xs font-semibold text-text-strong mb-1.5 truncate">카테고리별 지출</h4>
						<div class="space-y-1">
							{#each stats.expenseByCategory.slice(0, 2) as category}
								<div class="flex items-center justify-between gap-2 min-w-0 h-6">
									<span class="text-xs text-text-base truncate min-w-0">{category.category}</span>
									<span class="text-xs font-medium text-text-strong flex-shrink-0" data-type="number" title="₩{category.amount.toLocaleString()}">
										{formatNumber(category.amount)}
									</span>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		{:else}
			<div class="flex items-center justify-center py-8">
				<p class="text-text-muted text-center text-sm">통계 데이터가 없습니다.</p>
			</div>
		{/if}
	</div>

	<!-- 하단 액션 -->
	<div class="flex items-center justify-end mt-3">
		<a href="/revenue" class="text-brand-pink font-semibold text-sm px-2 py-1 rounded transition-colors hover:bg-hover-cyan inline-flex items-center gap-1">
			자세히 보기
			<ExternalLink size={12} />
		</a>
	</div>
</div>
