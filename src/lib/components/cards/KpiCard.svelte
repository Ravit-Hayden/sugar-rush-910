<script lang="ts">
	import Skeleton from '../Skeleton.svelte';
	import { TrendingUp, BarChart3, Info } from 'lucide-svelte';

	let { kpi = [], loading = false } = $props();

	// KPI 데이터에서 실제 값 추출
	const totalRevenue = kpi.find(k => k.name === '총 수익')?.points?.slice(-1)[0]?.y || 2450000;
	const releaseCount = kpi.find(k => k.name === '신규 앨범')?.points?.slice(-1)[0]?.y || 8;
</script>

<div class="h-[396px] lg:h-[600px] flex flex-col justify-between p-5 rounded-lg bg-surface-2 border border-border-subtle overflow-hidden pt-[24px]">
	<div>
		<!-- 상단 타이틀영역 -->
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-lg font-bold text-text-strong truncate">KPI 요약 그래프</h3>
			<button class="inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-surface-1 transition-colors ml-2" aria-label="정보" title="수익 및 성과 지표">
				<Info size={12} class="text-text-muted" />
			</button>
		</div>

		<!-- KPI 내용 영역 (flex-1로 확장 가능) -->
		{#if loading}
			<Skeleton lines={6} />
		{:else}
			<div class="flex-1 flex flex-col justify-center overflow-hidden">
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

				<!-- 추가 KPI 정보 (3열일 때만 표시) -->
				<div class="hidden lg:grid grid-cols-2 gap-4 mb-4">
					<div class="bg-surface-1 rounded p-3">
						<div class="flex items-center gap-2 mb-2">
							<TrendingUp size={16} class="text-brand-pink" />
							<span class="text-sm font-medium text-text-strong">월간 목표</span>
						</div>
						<div class="text-lg font-bold text-text-strong">₩10,000,000</div>
						<div class="text-xs text-ok-fg">85% 달성</div>
					</div>
					<div class="bg-surface-1 rounded p-3">
						<div class="flex items-center gap-2 mb-2">
							<BarChart3 size={16} class="text-hover-cyan" />
							<span class="text-sm font-medium text-text-strong">평균 수익</span>
						</div>
						<div class="text-lg font-bold text-text-strong">₩306,250</div>
						<div class="text-xs text-ok-fg">일평균</div>
					</div>
				</div>

				<!-- 그래프 영역 (고정 높이로 확실한 렌더링) -->
				<div class="bg-surface-1 rounded p-4 h-[160px] flex flex-col">
					<!-- 주간 수익 추이 제목 -->
					<h4 class="text-sm font-medium text-text-strong mb-4">주간 수익 추이</h4>
					
					<!-- 막대 차트 영역 (고정 높이) -->
					<div class="flex-1 w-full flex items-end justify-center gap-1 px-2">
						<!-- 항상 그래프 렌더링 (고정 높이로 확실한 표시) -->
						<div class="bg-brand-pink rounded-t-sm flex-shrink-0" style="height: 48px; width: 12px;"></div>
						<div class="bg-hover-cyan rounded-t-sm flex-shrink-0" style="height: 64px; width: 12px;"></div>
						<div class="bg-brand-pink rounded-t-sm flex-shrink-0" style="height: 36px; width: 12px;"></div>
						<div class="bg-hover-cyan rounded-t-sm flex-shrink-0" style="height: 56px; width: 12px;"></div>
						<div class="bg-brand-pink rounded-t-sm flex-shrink-0" style="height: 72px; width: 12px;"></div>
						<div class="bg-hover-cyan rounded-t-sm flex-shrink-0" style="height: 44px; width: 12px;"></div>
						<div class="bg-brand-pink rounded-t-sm flex-shrink-0" style="height: 60px; width: 12px;"></div>
						<div class="bg-hover-cyan rounded-t-sm flex-shrink-0" style="height: 52px; width: 12px;"></div>
						<div class="bg-brand-pink rounded-t-sm flex-shrink-0" style="height: 68px; width: 12px;"></div>
						<div class="bg-hover-cyan rounded-t-sm flex-shrink-0" style="height: 40px; width: 12px;"></div>
						<div class="bg-brand-pink rounded-t-sm flex-shrink-0" style="height: 76px; width: 12px;"></div>
						<div class="bg-hover-cyan rounded-t-sm flex-shrink-0" style="height: 32px; width: 12px;"></div>
					</div>
					
					<!-- 하단 라벨 -->
					<div class="flex justify-between w-full text-xs text-text-muted mt-2 px-2">
						<span>월</span>
						<span>화</span>
						<span>수</span>
						<span>목</span>
						<span>금</span>
						<span>토</span>
						<span>일</span>
					</div>
				</div>
			</div>
		{/if}
	</div>

	<!-- 하단 액션 (고정 마진 유지) -->
	<a href="/kpi" class="self-end text-brand-pink text-sm font-semibold px-2 py-1 rounded hover:bg-hover-cyan transition-colors mt-3">
		자세히 보기
	</a>
</div>
