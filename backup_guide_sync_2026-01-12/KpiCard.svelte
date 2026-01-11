<script lang="ts">
	import Skeleton from '../Skeleton.svelte';
	import { TrendingUp, BarChart3, Info } from 'lucide-svelte';

	let { kpi = [], loading = false } = $props();

	// KPI 데이터에서 실제 값 추출
	const totalRevenue = kpi.find(k => k.name === '총 수익')?.points?.slice(-1)[0]?.y || 2450000;
	const releaseCount = kpi.find(k => k.name === '신규 앨범')?.points?.slice(-1)[0]?.y || 8;

	// 주간 수익 데이터 (7개 요일)
	const weeklyData = [
		{ day: '월', height: 48, color: 'bg-brand-pink' },
		{ day: '화', height: 64, color: 'bg-hover-cyan' },
		{ day: '수', height: 36, color: 'bg-brand-pink' },
		{ day: '목', height: 56, color: 'bg-hover-cyan' },
		{ day: '금', height: 72, color: 'bg-brand-pink' },
		{ day: '토', height: 44, color: 'bg-hover-cyan' },
		{ day: '일', height: 60, color: 'bg-brand-pink' }
	];
</script>

<div class="h-[396px] lg:h-[600px] flex flex-col justify-between p-5 rounded-lg bg-surface-2 border border-border-subtle overflow-hidden pt-[24px]">
	<!-- 상단 타이틀영역 -->
	<div class="flex items-center justify-between mb-4">
		<h3 class="text-lg font-bold text-text-strong truncate">KPI 요약 그래프</h3>
		<button class="inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-surface-1 transition-colors ml-2" aria-label="정보" title="수익 및 성과 지표" type="button">
			<Info size={12} class="text-text-muted" />
		</button>
	</div>

	{#if loading}
		<Skeleton lines={6} />
	{:else}
		<!-- KPI 요약 -->
		<div class="grid grid-cols-2 gap-4 mb-4 min-h-0">
			<div class="bg-surface-1 rounded p-3 min-w-0">
				<div class="flex items-center gap-2 mb-2 min-w-0">
					<TrendingUp size={16} class="text-ok-fg flex-shrink-0" />
					<span class="text-sm font-medium text-text-strong truncate">이번주 수익</span>
				</div>
				<div class="text-lg font-bold text-text-strong truncate">₩{totalRevenue.toLocaleString()}</div>
				<div class="text-xs text-ok-fg truncate">+12.5%</div>
			</div>
			<div class="bg-surface-1 rounded p-3 min-w-0">
				<div class="flex items-center gap-2 mb-2 min-w-0">
					<BarChart3 size={16} class="text-brand-pink flex-shrink-0" />
					<span class="text-sm font-medium text-text-strong truncate">발매 건수</span>
				</div>
				<div class="text-lg font-bold text-text-strong truncate">{releaseCount}</div>
				<div class="text-xs text-ok-fg truncate">+2건</div>
			</div>
		</div>

		<!-- 추가 KPI 정보 (3열일 때만 표시) -->
		<div class="hidden lg:grid grid-cols-2 gap-4 mb-4 min-h-0">
			<div class="bg-surface-1 rounded p-3 min-w-0">
				<div class="flex items-center gap-2 mb-2 min-w-0">
					<TrendingUp size={16} class="text-brand-pink flex-shrink-0" />
					<span class="text-sm font-medium text-text-strong truncate">월간 목표</span>
				</div>
				<div class="text-lg font-bold text-text-strong truncate">₩10,000,000</div>
				<div class="text-xs text-ok-fg truncate">85% 달성</div>
			</div>
			<div class="bg-surface-1 rounded p-3 min-w-0">
				<div class="flex items-center gap-2 mb-2 min-w-0">
					<BarChart3 size={16} class="text-hover-cyan flex-shrink-0" />
					<span class="text-sm font-medium text-text-strong truncate">평균 수익</span>
				</div>
				<div class="text-lg font-bold text-text-strong truncate">₩306,250</div>
				<div class="text-xs text-ok-fg truncate">일평균</div>
			</div>
		</div>

		<!-- 그래프 영역 (고정 높이로 좌우 절반씩 배치) -->
		<div class="flex-1 bg-surface-1 rounded p-4 flex flex-col justify-end min-h-0">
			<!-- 주간 수익 추이 제목 -->
			<h4 class="text-sm font-medium text-text-strong mb-4 truncate">주간 수익 추이</h4>
			
			<!-- 좌우 절반씩 배치 (3열일 때만) -->
			<div class="flex-1 flex flex-col lg:flex-row lg:h-48 min-h-0">
				<!-- 막대 차트 영역 (좌측 절반) -->
				<div class="flex-1 flex items-center justify-center min-w-0">
					<div class="flex justify-center gap-1 px-1 items-end w-full max-w-full overflow-hidden">
						{#each weeklyData as item}
							<div class="flex flex-col items-center flex-shrink-0" style="width: calc(100% / 7 - 4px); min-width: 0;">
								<div class="{item.color} rounded-t-sm flex-shrink-0" style="height: {item.height}px; width: 10px; max-width: 100%;"></div>
								<span class="mt-1 text-xs text-text-muted truncate w-full text-center">{item.day}</span>
							</div>
						{/each}
					</div>
				</div>
				
				<!-- 추가 설명 (우측 절반, 세로 중앙 정렬) -->
				<div class="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:pl-10 min-w-0">
					<div class="space-y-3 min-w-0">
						<!-- 일평균 텍스트와 동일한 좌측 여백으로 정렬 (개발자도구에서 확인된 40px) -->
						<div class="text-xs text-ok-fg -mt-6 truncate">일평균</div>
						
						<div class="flex items-center gap-2 min-w-0">
							<div class="w-3 h-3 bg-brand-pink rounded-sm flex-shrink-0"></div>
							<span class="text-xs text-text-muted truncate">높은 수익일</span>
							<div class="w-3 h-3 bg-hover-cyan rounded-sm ml-2 flex-shrink-0"></div>
							<span class="text-xs text-text-muted truncate">평균 수익일</span>
						</div>
						<div class="text-xs text-text-muted mt-4 min-w-0">
							<p class="font-medium mb-1 truncate">주간 패턴</p>
							<p class="truncate">금요일과 일요일에 수익이 집중되는 패턴을 보입니다.</p>
						</div>
						<div class="text-xs text-text-muted min-w-0">
							<p class="font-medium mb-1 truncate">예상 수익</p>
							<p class="truncate">다음 주 예상 수익: ₩2,800,000</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- 하단 액션 (고정 마진 유지) -->
	<a href="/kpi" class="self-end text-brand-pink text-sm font-semibold px-2 py-1 rounded hover:bg-hover-cyan transition-colors mt-3">
		더보기
	</a>
</div>
