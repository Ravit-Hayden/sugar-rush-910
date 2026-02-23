<script lang="ts">
	import Skeleton from '../Skeleton.svelte';
	import { TrendingUp, BarChart3, Info } from 'lucide-svelte';

	let { kpi = [], loading = false } = $props();

	// KPI 데이터에서 실제 값 추출
	const totalRevenue = kpi.find(k => k.name === '총 수익')?.points?.slice(-1)[0]?.y || 2450000;
	const releaseCount = kpi.find(k => k.name === '신규 앨범')?.points?.slice(-1)[0]?.y || 8;

	// 주간 수익 데이터 (7개 요일) · 동일 핫핑크
	const weeklyData = [
		{ day: '월', height: 48 },
		{ day: '화', height: 64 },
		{ day: '수', height: 36 },
		{ day: '목', height: 56 },
		{ day: '금', height: 72 },
		{ day: '토', height: 44 },
		{ day: '일', height: 60 }
	];
	const chartMax = Math.max(...weeklyData.map((d) => d.height));
</script>

<!-- 내부 사이즈 합: pt-24 + 타이틀(mb-4) + 요약(h-8+mb-3) + 메인(220) + mt-3+더보기 + pb-5 ≈ 388px -->
<div class="card-base h-[388px] flex flex-col justify-between p-5 rounded-lg bg-surface-2 border border-border-subtle overflow-hidden pt-[24px]">
	<div class="flex-1 min-h-0 flex flex-col">
		<div class="flex items-center justify-between mb-4 flex-shrink-0">
			<h3 class="text-lg font-bold text-text-strong truncate">KPI 요약 그래프</h3>
			<button class="inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-surface-1 transition-colors ml-2" aria-label="정보" title="수익 및 성과 지표" type="button">
				<Info size={12} class="text-text-muted" />
			</button>
		</div>

		{#if loading}
			<Skeleton lines={6} />
		{:else}
			<!-- 요약: 이번주 수익 · 발매 건수 (아래 2칸과 동일 gap-3) -->
			<div class="grid grid-cols-2 gap-3 mb-3 flex-shrink-0">
				<div class="h-8 bg-surface-inner rounded flex items-center gap-2 px-3 min-w-0">
					<TrendingUp size={12} class="text-ok-fg flex-shrink-0" />
					<span class="text-xs text-text-muted truncate">이번주</span>
					<span class="text-xs font-semibold text-text-strong truncate">₩{(totalRevenue / 10000).toFixed(0)}만</span>
				</div>
				<div class="h-8 bg-surface-inner rounded flex items-center gap-2 px-3 min-w-0">
					<BarChart3 size={12} class="text-brand-pink flex-shrink-0" />
					<span class="text-xs text-text-muted truncate">발매</span>
					<span class="text-xs font-semibold text-text-strong truncate">{releaseCount}건</span>
				</div>
			</div>

			<!-- 메인: 차트 · 요약 (h-[220px] 고정, 400px 카드 내 수용) -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-3 h-[220px] min-h-0 flex-shrink-0">
				<!-- 차트: 단일 색상, 일관된 여백 -->
				<div class="bg-surface-inner rounded flex flex-col min-w-0 min-h-0 p-3 overflow-hidden">
					<div class="text-xs font-medium text-text-strong mb-3 truncate flex-shrink-0">주간 수익 추이</div>
					<!-- 막대 + 요일: 각 칸에 막대 아래 요일 고정, 라벨 항상 보이게 -->
					<div class="flex w-full gap-x-3 flex-1 min-h-0 flex-nowrap" style="min-height: 120px;">
						{#each weeklyData as item}
							{@const pct = chartMax > 0 ? (item.height / chartMax) * 100 : 0}
							<div class="flex flex-col items-center flex-1 min-w-0 min-h-0">
								<div class="flex-1 min-h-0 w-full flex flex-col justify-end pb-1">
									<div
										class="bg-brand-pink w-full rounded transition-all shrink-0"
										style="height: {pct}%; min-height: 6px;"
										aria-label="{item.day}"
									></div>
								</div>
								<span class="text-xs text-text-strong text-center leading-tight shrink-0 h-5 flex items-center justify-center w-full">{item.day}</span>
							</div>
						{/each}
					</div>
				</div>
				<!-- 요약: 설명 패널 안에만 표시, 넘침 방지 -->
				<div class="bg-surface-inner rounded flex flex-col min-w-0 min-h-0 p-3 overflow-hidden">
					<div class="space-y-2 min-h-0 flex flex-col justify-center">
						<div class="flex items-center gap-2 shrink-0">
							<span class="w-2 h-2 bg-brand-pink rounded shrink-0" aria-hidden="true"></span>
							<span class="text-xs font-medium text-text-strong">주간 수익</span>
						</div>
						<p class="text-xs text-text-muted leading-relaxed shrink-0">금·일요일 수익이 높은 편.</p>
						<p class="text-xs text-text-muted leading-relaxed shrink-0">상세에서 기간별 추이·달성률 확인.</p>
					</div>
				</div>
			</div>
		{/if}
	</div>

	<div class="flex items-center justify-between mt-3 flex-shrink-0">
		<div class="flex gap-x-2 flex-wrap items-center">
			<!-- 좌측 액션 버튼이 필요한 경우 여기에 추가 -->
		</div>
		<a href="/kpi" class="text-brand-pink text-sm font-semibold px-2 py-1 rounded hover:bg-hover-cyan transition-colors">더보기</a>
	</div>
</div>
