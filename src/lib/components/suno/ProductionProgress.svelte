<script lang="ts">
	import { Check, Circle, ArrowRight } from 'lucide-svelte';
	import { PRODUCTION_STAGES } from '$lib/constants/suno/stages';
	import type { ProductionStageStatus, ProductionStageId } from '$lib/types/suno';

	// Props
	interface Props {
		stages: ProductionStageStatus[];
		currentStageId?: ProductionStageId;
		compact?: boolean;
		onStageClick?: (stageId: ProductionStageId) => void;
	}

	let { stages, currentStageId, compact = false, onStageClick }: Props = $props();

	// 단계별 상태 맵
	const stageStatusMap = $derived.by(() => {
		const map: Record<ProductionStageId, ProductionStageStatus | undefined> = {} as Record<ProductionStageId, ProductionStageStatus | undefined>;
		stages.forEach(stage => {
			map[stage.stageId] = stage;
		});
		return map;
	});

	// 진행률 계산: 18단계 기준, stageStatusMap에서 완료된 수
	const completedCount = $derived(PRODUCTION_STAGES.filter(s => stageStatusMap[s.id]?.isCompleted).length);
	const progressPercent = $derived(Math.round((completedCount / PRODUCTION_STAGES.length) * 100));

	// 현재 단계 인덱스: 순서대로 첫 번째 미완료 단계를 "현재"로 판정
	const currentIndex = $derived.by(() => {
		if (currentStageId) {
			return PRODUCTION_STAGES.findIndex(s => s.id === currentStageId);
		}
		for (let i = 0; i < PRODUCTION_STAGES.length; i++) {
			const status = stageStatusMap[PRODUCTION_STAGES[i].id];
			if (!status || !status.isCompleted) return i;
		}
		return PRODUCTION_STAGES.length;
	});

	// 단계 클릭 핸들러
	function handleStageClick(stageId: ProductionStageId) {
		if (onStageClick) {
			onStageClick(stageId);
		}
	}

	// 담당자 색상
	function getAssigneeColor(assignedTo: string): string {
		if (assignedTo === 'El') return 'text-elotte-green';
		if (assignedTo === 'Otte') return 'text-elotte-orange';
		return 'text-text-muted';
	}

	// 진행률 바/텍스트 색상: 디자인 토큰만 사용 (brand-pink, elotte-green)
	function getProgressColor(percent: number): string {
		if (percent >= 100) return 'bg-[var(--elotte-green)]';
		return 'bg-brand-pink';
	}

	function getProgressTextColor(percent: number): string {
		if (percent >= 100) return 'text-elotte-green';
		return 'text-brand-pink';
	}
</script>

{#if compact}
	<!-- 컴팩트 뷰 (대시보드용) -->
	<div>
		<div class="flex items-center justify-between text-xs mb-1.5">
			<span class="text-text-muted">현재: {PRODUCTION_STAGES[currentIndex]?.name ?? '시작 전'}</span>
			<span class="font-medium {getProgressTextColor(progressPercent)}">{progressPercent}%</span>
		</div>
		<div class="h-2 bg-bg rounded-full overflow-hidden">
			<div 
				class="{getProgressColor(progressPercent)} h-full transition-all duration-300"
				style="width: {progressPercent}%"
			></div>
		</div>
	</div>
{:else}
	<!-- 전체 뷰 -->
	<div class="bg-surface-2 rounded-lg border border-border-subtle p-6">
		<!-- 헤더 -->
		<div class="mb-6">
			<div class="flex items-center justify-between mb-3">
				<h3 class="text-sm font-semibold text-text-strong">제작 진행률</h3>
				<span class="text-sm font-bold {getProgressTextColor(progressPercent)}">{progressPercent}%</span>
			</div>
			<div class="w-full h-2 bg-bg rounded-full overflow-hidden">
				<div 
					class="{getProgressColor(progressPercent)} h-full transition-all duration-300"
					style="width: {progressPercent}%"
				></div>
			</div>
		</div>

		<!-- 단계 목록 -->
		<div class="space-y-1">
			{#each PRODUCTION_STAGES as stage, index}
				{@const status = stageStatusMap[stage.id]}
				{@const isCompleted = status?.isCompleted ?? false}
				{@const isCurrent = index === currentIndex}

				<button
					type="button"
					onclick={() => handleStageClick(stage.id)}
					class="progress-stage-item w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
						{onStageClick ? 'cursor-pointer' : 'cursor-default'}
						{isCurrent ? 'bg-surface-1' : 'hover:bg-surface-1/50'}"
				>
					<!-- 상태 아이콘: 아이콘+색상만으로 표현 (배경 원형 없음) -->
					<span class="flex-shrink-0 w-5 flex items-center justify-center
						{isCompleted ? 'text-text-muted' : isCurrent ? 'text-brand-pink' : 'text-text-muted'}">
						{#if isCompleted}
							<Check size={16} />
						{:else if isCurrent}
							<ArrowRight size={16} />
						{:else}
							<Circle size={14} />
						{/if}
					</span>

					<!-- 단계 정보 -->
					<div class="flex-1 text-left">
						<div class="flex items-center gap-2">
							<span class="text-sm font-medium 
								{isCompleted ? 'text-text-muted line-through' : isCurrent ? 'text-brand-pink' : 'text-text-base'}">
								{stage.order}. {stage.name}
							</span>
							<span class="text-xs {getAssigneeColor(stage.assignedTo)}">
								({stage.assignedTo === 'Both' ? '공통' : stage.assignedTo})
							</span>
						</div>
						{#if isCompleted && status?.completedAt}
							<div class="text-xs text-text-muted">
								완료: {status.completedAt}
								{#if status.completedBy}
									by {status.completedBy}
								{/if}
							</div>
						{/if}
					</div>
				</button>
			{/each}
		</div>

		<!-- 요약: 구분선은 양쪽 여백 없이 풀폭 -->
		<div class="mt-6 pt-4 border-t border-border-subtle -mx-6 px-6 flex items-center justify-between text-sm">
			<span class="text-text-muted">
				{completedCount} / {PRODUCTION_STAGES.length} 단계 완료
			</span>
			{#if currentIndex < PRODUCTION_STAGES.length}
				<span class="text-text-base">
					다음: <strong class="text-brand-pink">{PRODUCTION_STAGES[currentIndex]?.name ?? '완료!'}</strong>
				</span>
			{:else}
				<span class="text-elotte-green font-medium">모든 단계 완료!</span>
			{/if}
		</div>
	</div>
{/if}
