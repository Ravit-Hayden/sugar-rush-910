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
					stats = normalizeStats(data.data);
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
				{ platform: 'YouTube Music', amount: 28000 },
				{ platform: '기타', amount: 20000 }
			],
			expenseByCategory: [
				{ category: '제작비', amount: 500000 },
				{ category: '마케팅비', amount: 200000 },
				{ category: '광고비', amount: 60000 },
				{ category: '인건비', amount: 40000 }
			],
			monthlyRevenue: 15000,
			monthlyExpense: 50000,
			monthlyProfit: -35000
		};
	}

	// 표시용 4행 고정: API/DB가 4개 미만이어도 빈 칸 없이 4행 채움 (부족분은 비활성 — 표시)
	function normalizeStats(raw: any): any {
		if (!raw) return raw;
		const pad = { platform: '—', amount: 0 };
		const padCat = { category: '—', amount: 0 };
		return {
			...raw,
			revenueByPlatform: Array.from({ length: 4 }, (_, i) => raw.revenueByPlatform?.[i] ?? pad),
			expenseByCategory: Array.from({ length: 4 }, (_, i) => raw.expenseByCategory?.[i] ?? padCat)
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
	<div class="flex-1 min-h-0">
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
			<!-- 요약 영역: 다른 카드와 동일 h-8 1행 (시스템 로그와 높이 통일) -->
			<div class="grid grid-cols-3 gap-2 mb-3">
				<div class="h-8 bg-surface-inner rounded flex items-center justify-center gap-1.5 px-2 min-w-0">
					<TrendingUp size={12} class="text-green-500 flex-shrink-0" />
					<span class="text-xs text-text-muted truncate" data-type="number" title="{stats.totalRevenue.toLocaleString()}원">{formatNumber(stats.totalRevenue)}</span>
				</div>
				<div class="h-8 bg-surface-inner rounded flex items-center justify-center gap-1.5 px-2 min-w-0">
					<TrendingDown size={12} class="text-red-500 flex-shrink-0" />
					<span class="text-xs text-text-muted truncate" data-type="number" title="{stats.totalExpense.toLocaleString()}원">{formatNumber(stats.totalExpense)}</span>
				</div>
				<div class="h-8 bg-surface-inner rounded flex items-center justify-center gap-1.5 px-2 min-w-0">
					<DollarSign size={12} class="{stats.netProfit >= 0 ? 'text-green-500' : 'text-red-500'} flex-shrink-0" />
					<span class="text-xs {stats.netProfit >= 0 ? 'text-text-muted' : 'text-red-500'} truncate" data-type="number" title="{stats.netProfit >= 0 ? '+' : ''}{stats.netProfit.toLocaleString()}원">{stats.netProfit >= 0 ? '+' : ''}{formatNumber(Math.abs(stats.netProfit))}</span>
				</div>
			</div>

			<!-- 메인 목록: grid-rows-4 gap-3 h-12 (시스템 로그와 동일 높이) · 좌 플랫폼 수익 | 우 카테고리 지출 -->
			<div class="grid grid-rows-4 gap-3 min-h-0">
				{#each Array.from({ length: 4 }) as _, i}
					<div class="grid grid-cols-2 gap-3 h-12 min-w-0">
						<!-- 좌: 플랫폼별 수익 -->
						{#if stats.revenueByPlatform && stats.revenueByPlatform[i] && stats.revenueByPlatform[i].amount !== undefined && stats.revenueByPlatform[i].amount > 0}
							<a
								href="/revenue"
								class="flex items-center h-12 px-4 bg-surface-inner rounded min-w-0"
							>
								<span class="flex-1 text-sm text-text-base truncate min-w-0">{stats.revenueByPlatform[i].platform}</span>
								<span class="flex-shrink-0 text-sm font-semibold text-green-500 ml-2" data-type="number" title="{stats.revenueByPlatform[i].amount.toLocaleString()}원">
									{formatNumber(stats.revenueByPlatform[i].amount)}
								</span>
							</a>
						{:else}
							<div class="flex items-center h-12 px-4 bg-surface-inner rounded min-w-0">
								<span class="flex-1 text-sm text-text-muted truncate min-w-0">{stats.revenueByPlatform?.[i]?.platform ?? '—'}</span>
								<span class="flex-shrink-0 text-sm text-text-muted ml-2">—</span>
							</div>
						{/if}
						<!-- 우: 카테고리별 지출 -->
						{#if stats.expenseByCategory && stats.expenseByCategory[i] && stats.expenseByCategory[i].amount !== undefined && stats.expenseByCategory[i].amount > 0}
							<a
								href="/revenue"
								class="flex items-center h-12 px-4 bg-surface-inner rounded min-w-0"
							>
								<span class="flex-1 text-sm text-text-base truncate min-w-0">{stats.expenseByCategory[i].category}</span>
								<span class="flex-shrink-0 text-sm font-semibold text-red-500 ml-2" data-type="number" title="{stats.expenseByCategory[i].amount.toLocaleString()}원">
									{formatNumber(stats.expenseByCategory[i].amount)}
								</span>
							</a>
						{:else}
							<div class="flex items-center h-12 px-4 bg-surface-inner rounded min-w-0">
								<span class="flex-1 text-sm text-text-muted truncate min-w-0">{stats.expenseByCategory?.[i]?.category ?? '—'}</span>
								<span class="flex-shrink-0 text-sm text-text-muted ml-2">—</span>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{:else}
			<div class="flex items-center justify-center py-8">
				<p class="text-text-muted text-center text-sm">통계 데이터가 없습니다.</p>
			</div>
		{/if}
	</div>

	<!-- 하단 액션 -->
	<div class="flex items-center justify-between mt-3 flex-shrink-0">
		<div class="flex gap-x-2 flex-wrap items-center">
			<!-- 좌측 액션 버튼이 필요한 경우 여기에 추가 -->
		</div>
		<a href="/revenue" class="text-brand-pink text-sm font-semibold px-2 py-1 rounded hover:bg-hover-cyan transition-colors">더보기</a>
	</div>
</div>
