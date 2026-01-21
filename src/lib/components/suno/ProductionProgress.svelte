<script lang="ts">
	import { Check, Circle, ArrowRight } from 'lucide-svelte';
	import { PRODUCTION_STAGES, getStageName } from '$lib/constants/suno/stages';
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

	// 진행률 계산
	const progressPercent = $derived.by(() => {
		const completed = stages.filter(s => s.isCompleted).length;
		return Math.round((completed / PRODUCTION_STAGES.length) * 100);
	});

	// 현재 단계 인덱스
	const currentIndex = $derived.by(() => {
		if (!currentStageId) {
			// 완료된 단계 다음을 현재로
			const completedCount = stages.filter(s => s.isCompleted).length;
			return completedCount;
		}
		return PRODUCTION_STAGES.findIndex(s => s.id === currentStageId);
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

	// 진행률에 따른 바 색상
	function getProgressColor(percent: number): string {
		if (percent >= 100) return 'bg-green-500';
		if (percent >= 75) return 'bg-emerald-500';
		if (percent >= 50) return 'bg-brand-pink';
		if (percent >= 25) return 'bg-amber-500';
		return 'bg-blue-500';
	}

	// 진행률에 따른 텍스트 색상
	function getProgressTextColor(percent: number): string {
		if (percent >= 100) return 'text-green-500';
		if (percent >= 75) return 'text-emerald-500';
		if (percent >= 50) return 'text-brand-pink';
		if (percent >= 25) return 'text-amber-500';
		return 'text-blue-500';
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
	<div class="bg-surface-1 rounded-lg border border-border-subtle p-6">
		<!-- 헤더 -->
		<div class="flex items-center justify-between mb-6">
			<h3 class="text-lg font-semibold text-text-strong">제작 진행률</h3>
			<div class="flex items-center gap-3">
				<div class="flex-1 w-32 h-2 bg-bg rounded-full overflow-hidden">
					<div 
						class="{getProgressColor(progressPercent)} h-full transition-all duration-300"
						style="width: {progressPercent}%"
					></div>
				</div>
				<span class="text-lg font-bold {getProgressTextColor(progressPercent)}">{progressPercent}%</span>
			</div>
		</div>

		<!-- 단계 목록 -->
		<div class="space-y-1">
			{#each PRODUCTION_STAGES as stage, index}
				{@const status = stageStatusMap[stage.id]}
				{@const isCompleted = status?.isCompleted ?? false}
				{@const isCurrent = index === currentIndex}
				{@const isPast = index < currentIndex}

				<button
					type="button"
					onclick={() => handleStageClick(stage.id)}
					class="w-full flex items-center gap-3 p-3 rounded-lg transition-colors
						{isCurrent ? 'bg-brand-pink/10 border border-brand-pink' : 'hover:bg-surface-2'}
						{onStageClick ? 'cursor-pointer' : 'cursor-default'}"
				>
					<!-- 상태 아이콘 -->
					<div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
						{isCompleted ? 'bg-green-500 text-white' : isCurrent ? 'bg-brand-pink text-white' : 'bg-surface-2 text-text-muted'}">
						{#if isCompleted}
							<Check size={16} />
						{:else if isCurrent}
							<ArrowRight size={16} />
						{:else}
							<Circle size={14} />
						{/if}
					</div>

					<!-- 단계 정보 -->
					<div class="flex-1 text-left">
						<div class="flex items-center gap-2">
							<span class="text-sm font-medium 
								{isCompleted ? 'text-text-muted line-through' : isCurrent ? 'text-text-strong' : 'text-text-base'}">
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

					<!-- 연결선 -->
					{#if index < PRODUCTION_STAGES.length - 1}
						<div class="absolute left-[1.5rem] top-[3rem] w-[2px] h-[calc(100%-1.5rem)] 
							{isPast ? 'bg-green-500' : 'bg-surface-2'} hidden"></div>
					{/if}
				</button>
			{/each}
		</div>

		<!-- 요약 -->
		<div class="mt-6 pt-4 border-t border-border-subtle flex items-center justify-between text-sm">
			<span class="text-text-muted">
				{stages.filter(s => s.isCompleted).length} / {PRODUCTION_STAGES.length} 단계 완료
			</span>
			{#if currentIndex < PRODUCTION_STAGES.length}
				<span class="text-text-base">
					다음: <strong class="text-brand-pink">{PRODUCTION_STAGES[currentIndex + 1]?.name ?? '완료!'}</strong>
				</span>
			{/if}
		</div>
	</div>
{/if}
