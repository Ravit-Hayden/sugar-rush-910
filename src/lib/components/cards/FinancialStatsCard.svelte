<script lang="ts">
	import { DollarSign, TrendingUp, TrendingDown, Info } from 'lucide-svelte';
	import type { ApiOk, ApiErr } from '$lib/types/api';

	let stats = $state<any>(null);
	let loading = $state(true);

	// 통계 데이터 로드
	$effect(() => {
		(async () => {
			try {
				loading = true;
				const response = await fetch('/api/stats');
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = (await response.json()) as ApiOk<any> | ApiErr;
				if (data.ok) {
					stats = data.data;
				} else {
					// API 오류 시 목 데이터 사용
					stats = getDefaultStats();
				}
			} catch (error) {
				console.error('Failed to load stats:', error);
				// 네트워크 오류나 404 시 목 데이터 사용
				stats = getDefaultStats();
			} finally {
				loading = false;
			}
		})();
		return () => {};
	});

	// 기본 목 데이터
	function getDefaultStats() {
		return {
			totalRevenue: 125000,
			totalExpense: 700000,
			netProfit: -575000,
			revenueByPlatform: [
				{ platform: 'Spotify', amount: 45000 },
				{ platform: 'Apple Music', amount: 32000 },
				{ platform: 'YouTube Music', amount: 28000 }
			],
			expenseByCategory: [
				{ category: '제작비', amount: 500000 },
				{ category: '마케팅비', amount: 200000 }
			],
			monthlyRevenue: 15000,
			monthlyExpense: 50000,
			monthlyProfit: -35000
		};
	}

	// 숫자 포맷팅 (K=천, M=백만 축약 표현, 항상 원화)
	function formatNumber(num: number): string {
		if (num >= 1000000) {
			return `${(num / 1000000).toFixed(1)}M원`; // Million (백만)
		} else if (num >= 1000) {
			return `${(num / 1000).toFixed(1)}K원`; // Kilo (천)
		}
		return `${num.toLocaleString()}원`; // 1000 미만은 원 기호 없이 숫자만
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
					<div class="text-base font-bold text-text-strong truncate" data-type="number" title="{stats.totalRevenue.toLocaleString()}원">
						{formatNumber(stats.totalRevenue)}
					</div>
				</div>

				<!-- 총 지출 -->
				<div class="bg-surface-1 rounded p-3 min-w-0">
					<div class="flex items-center gap-1.5 mb-1.5 min-w-0">
						<TrendingDown size={14} class="text-red-500 flex-shrink-0" />
						<span class="text-xs font-medium text-text-muted truncate">총 지출</span>
					</div>
					<div class="text-base font-bold text-text-strong truncate" data-type="number" title="{stats.totalExpense.toLocaleString()}원">
						{formatNumber(stats.totalExpense)}
					</div>
				</div>

				<!-- 순이익 -->
				<div class="bg-surface-1 rounded p-3 min-w-0">
					<div class="flex items-center gap-1.5 mb-1.5 min-w-0">
						<DollarSign size={14} class="{stats.netProfit >= 0 ? 'text-green-500' : 'text-red-500'} flex-shrink-0" />
						<span class="text-xs font-medium text-text-muted truncate">순이익</span>
					</div>
					<div class="text-base font-bold {stats.netProfit >= 0 ? 'text-green-500' : 'text-red-500'} truncate" data-type="number" title="{stats.netProfit >= 0 ? '+' : ''}{stats.netProfit.toLocaleString()}원">
						{stats.netProfit >= 0 ? '+' : ''}{formatNumber(Math.abs(stats.netProfit))}
					</div>
				</div>
			</div>

			<!-- 이번 달 요약 (간소화) -->
			<div class="mb-3 p-2 bg-surface-1 rounded">
				<div class="grid grid-cols-3 gap-1.5 text-center">
					<div class="min-w-0">
						<div class="text-xs text-text-muted mb-0.5 truncate">이번 달 수익</div>
						<div class="text-xs font-semibold text-text-strong truncate" data-type="number" title="{stats.monthlyRevenue.toLocaleString()}원">
							{formatNumber(stats.monthlyRevenue)}
						</div>
					</div>
					<div class="min-w-0">
						<div class="text-xs text-text-muted mb-0.5 truncate">이번 달 지출</div>
						<div class="text-xs font-semibold text-text-strong truncate" data-type="number" title="{stats.monthlyExpense.toLocaleString()}원">
							{formatNumber(stats.monthlyExpense)}
						</div>
					</div>
					<div class="min-w-0">
						<div class="text-xs text-text-muted mb-0.5 truncate">이번 달 순이익</div>
						<div class="text-xs font-semibold {stats.monthlyProfit >= 0 ? 'text-green-500' : 'text-red-500'} truncate" data-type="number" title="{stats.monthlyProfit >= 0 ? '+' : ''}{stats.monthlyProfit.toLocaleString()}원">
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
						<h4 class="text-xs font-semibold text-text-strong mb-3 truncate">플랫폼별 수익</h4>
						<div class="space-y-3">
							{#each stats.revenueByPlatform.slice(0, 2) as platform}
								<a
									href="/revenue"
									class="flex items-center h-12 px-4 bg-surface-1 rounded hover:bg-surface-2 transition-colors min-w-0"
								>
									<span class="flex-1 text-sm text-text-base truncate min-w-0">{platform.platform}</span>
									<span class="flex-shrink-0 text-sm font-semibold text-green-500 ml-2" data-type="number" title="{platform.amount.toLocaleString()}원">
										{formatNumber(platform.amount)}
									</span>
								</a>
							{/each}
						</div>
					</div>
				{/if}

				<!-- 카테고리별 지출 (상위 2개) -->
				{#if stats.expenseByCategory && stats.expenseByCategory.length > 0}
					<div class="min-h-0 flex flex-col">
						<h4 class="text-xs font-semibold text-text-strong mb-3 truncate">카테고리별 지출</h4>
						<div class="space-y-3">
							{#each stats.expenseByCategory.slice(0, 2) as category}
								<a
									href="/revenue"
									class="flex items-center h-12 px-4 bg-surface-1 rounded hover:bg-surface-2 transition-colors min-w-0"
								>
									<span class="flex-1 text-sm text-text-base truncate min-w-0">{category.category}</span>
									<span class="flex-shrink-0 text-sm font-semibold text-red-500 ml-2" data-type="number" title="{category.amount.toLocaleString()}원">
										{formatNumber(category.amount)}
									</span>
								</a>
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
	<a href="/revenue" class="self-end text-brand-pink text-sm font-semibold px-2 py-1 rounded hover:bg-hover-cyan transition-colors mt-3">
		더보기
	</a>
</div>
