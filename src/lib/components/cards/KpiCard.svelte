<script lang="ts">
	import Skeleton from '../Skeleton.svelte';
	import { TrendingUp, BarChart3, Info } from 'lucide-svelte';

	let { kpi = [], loading = false } = $props();

	// KPI 데이터에서 실제 값 추출
	const totalRevenue = kpi.find(k => k.name === '총 수익')?.points?.slice(-1)[0]?.y || 2450000;
	const releaseCount = kpi.find(k => k.name === '신규 앨범')?.points?.slice(-1)[0]?.y || 8;
</script>

<div class="h-[396px] lg:h-[600px] flex flex-col justify-between p-5 rounded-lg bg-surface-2 border border-border-subtle overflow-hidden pt-[24px]">
	<!-- 상단 타이틀영역 -->
	<div class="flex items-center justify-between mb-4">
		<h3 class="text-lg font-bold text-text-strong truncate">KPI 요약 그래프</h3>
		<button class="inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-surface-1 transition-colors ml-2" aria-label="정보" title="수익 및 성과 지표">
			<Info size={12} class="text-text-muted" />
		</button>
	</div>

	{#if loading}
		<Skeleton lines={6} />
	{:else}
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

		<!-- 그래프 영역 (부모 컨테이너의 남은 공간을 모두 채움) -->
		<div class="flex-1 bg-surface-1 rounded p-4 flex flex-col justify-end">
			<!-- 주간 수익 추이 제목 -->
			<h4 class="text-sm font-medium text-text-strong mb-4">주간 수익 추이</h4>
			
			<!-- 좌우 절반씩 배치 (3열일 때만) -->
			<div class="flex-1 flex flex-col lg:flex-row lg:h-48">
				<!-- 막대 차트 영역 (좌측 절반) -->
				<div class="flex-1 flex items-center justify-center">
					<div class="flex justify-center gap-1 px-2 items-end">
						<div class="flex flex-col items-center w-12">
							<div class="bg-brand-pink rounded-t-sm" style="height: 48px; width: 12px;"></div>
							<span class="mt-1 text-xs text-text-muted">월</span>
						</div>
						<div class="flex flex-col items-center w-12">
							<div class="bg-hover-cyan rounded-t-sm" style="height: 64px; width: 12px;"></div>
							<span class="mt-1 text-xs text-text-muted">화</span>
						</div>
						<div class="flex flex-col items-center w-12">
							<div class="bg-brand-pink rounded-t-sm" style="height: 36px; width: 12px;"></div>
							<span class="mt-1 text-xs text-text-muted">수</span>
						</div>
						<div class="flex flex-col items-center w-12">
							<div class="bg-hover-cyan rounded-t-sm" style="height: 56px; width: 12px;"></div>
							<span class="mt-1 text-xs text-text-muted">목</span>
						</div>
						<div class="flex flex-col items-center w-12">
							<div class="bg-brand-pink rounded-t-sm" style="height: 72px; width: 12px;"></div>
							<span class="mt-1 text-xs text-text-muted">금</span>
						</div>
						<div class="flex flex-col items-center w-12">
							<div class="bg-hover-cyan rounded-t-sm" style="height: 44px; width: 12px;"></div>
							<span class="mt-1 text-xs text-text-muted">토</span>
						</div>
						<div class="flex flex-col items-center w-12">
							<div class="bg-brand-pink rounded-t-sm" style="height: 60px; width: 12px;"></div>
							<span class="mt-1 text-xs text-text-muted">일</span>
						</div>
					</div>
				</div>
				
				<!-- 추가 설명 (우측 절반, 세로 중앙 정렬) -->
				<div class="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:pl-10">
					<div class="space-y-3">
						<!-- 일평균 텍스트와 동일한 좌측 여백으로 정렬 -->
						<div class="text-xs text-ok-fg">일평균</div>
						
						<div class="flex items-center gap-2">
							<div class="w-3 h-3 bg-brand-pink rounded-sm"></div>
							<span class="text-xs text-text-muted">높은 수익일</span>
							<div class="w-3 h-3 bg-hover-cyan rounded-sm ml-2"></div>
							<span class="text-xs text-text-muted">평균 수익일</span>
						</div>
						<div class="text-xs text-text-muted mt-4">
							<p class="font-medium mb-1">주간 패턴</p>
							<p>금요일과 일요일에 수익이 집중되는 패턴을 보입니다.</p>
						</div>
						<div class="text-xs text-text-muted">
							<p class="font-medium mb-1">예상 수익</p>
							<p>다음 주 예상 수익: ₩2,800,000</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- 하단 액션 (고정 마진 유지) -->
	<a href="/kpi" class="self-end text-brand-pink text-sm font-semibold px-2 py-1 rounded hover:bg-hover-cyan transition-colors mt-3">
		자세히 보기
	</a>
</div>
