<script lang="ts">
	import { Check, Circle, Clock, FileText, Music, Palette, User } from 'lucide-svelte';
	import { PRODUCTION_STAGES } from '$lib/constants/suno/stages';
	import type { SUNOProject, ProductionStageStatus } from '$lib/types/suno';

	// Props
	interface Props {
		project: SUNOProject;
	}

	let { project }: Props = $props();

	// 타임라인 이벤트 생성
	interface TimelineEvent {
		id: string;
		type: 'stage' | 'lyrics' | 'audio' | 'prompt';
		title: string;
		description: string;
		date: string;
		author: string;
		icon: typeof Check;
		color: string;
		isCompleted: boolean;
	}

	const timelineEvents = $derived.by(() => {
		const events: TimelineEvent[] = [];

		// 제작 단계 이벤트
		project.stages.forEach(stage => {
			const stageDef = PRODUCTION_STAGES.find(s => s.id === stage.stageId);
			if (stageDef && stage.isCompleted) {
				events.push({
					id: `stage_${stage.stageId}`,
					type: 'stage',
					title: stageDef.name,
					description: '단계 완료',
					date: stage.completedAt || '',
					author: stage.completedBy || '',
					icon: Check,
					color: 'bg-green-500',
					isCompleted: true
				});
			}
		});

		// 가사 버전 이벤트
		project.lyricsVersions.forEach(version => {
			events.push({
				id: `lyrics_${version.id}`,
				type: 'lyrics',
				title: `가사 v${version.versionNumber}`,
				description: version.changeNotes || version.versionType,
				date: version.createdAt,
				author: version.createdBy,
				icon: FileText,
				color: 'bg-blue-500',
				isCompleted: true
			});
		});

		// 프롬프트 이벤트
		project.promptConfigs.forEach((config, i) => {
			events.push({
				id: `prompt_${config.id}`,
				type: 'prompt',
				title: `프롬프트 설정 ${i + 1}`,
				description: `${config.sunoVersion} / ${config.vocalGender}`,
				date: config.createdAt,
				author: config.createdBy,
				icon: Palette,
				color: 'bg-purple-500',
				isCompleted: true
			});
		});

		// 음원 버전 이벤트
		project.audioVersions.forEach(audio => {
			events.push({
				id: `audio_${audio.id}`,
				type: 'audio',
				title: audio.fileName,
				description: audio.isFinalSelection ? '최종 선택됨' : audio.versionType,
				date: audio.createdAt,
				author: audio.createdBy,
				icon: Music,
				color: audio.isFinalSelection ? 'bg-brand-pink' : 'bg-orange-500',
				isCompleted: true
			});
		});

		// 날짜순 정렬
		return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
	});

	// 날짜 그룹화
	const groupedEvents = $derived.by(() => {
		const groups: Record<string, TimelineEvent[]> = {};
		timelineEvents.forEach(event => {
			if (!groups[event.date]) {
				groups[event.date] = [];
			}
			groups[event.date].push(event);
		});
		return groups;
	});
</script>

<div class="bg-surface-1 rounded-lg border border-border-subtle overflow-hidden">
	<div class="px-6 py-4 border-b border-border-subtle">
		<h3 class="text-lg font-semibold text-text-strong">제작 타임라인</h3>
		<p class="text-sm text-text-muted mt-0.5">프로젝트의 전체 제작 과정을 한눈에 확인하세요</p>
	</div>

	<div class="p-6">
		{#if Object.keys(groupedEvents).length === 0}
			<div class="py-8 text-center text-text-muted">
				아직 기록된 활동이 없습니다.
			</div>
		{:else}
			<div class="relative">
				<!-- 세로 라인 -->
				<div class="absolute left-4 top-0 bottom-0 w-0.5 bg-border-subtle"></div>

				<div class="space-y-6">
					{#each Object.entries(groupedEvents) as [date, events]}
						<!-- 날짜 헤더 -->
						<div class="relative flex items-center gap-4">
							<div class="w-8 h-8 rounded-full bg-surface-2 border-2 border-border-subtle flex items-center justify-center z-10">
								<Clock size={14} class="text-text-muted" />
							</div>
							<span class="text-sm font-medium text-text-strong">{date}</span>
						</div>

						<!-- 이벤트들 -->
						{#each events as event}
							{@const Icon = event.icon}
							<div class="relative flex items-start gap-4 ml-4">
								<div class="w-8 h-8 rounded-full {event.color} flex items-center justify-center z-10 flex-shrink-0">
									<Icon size={14} class="text-white" />
								</div>
								<div class="flex-1 pb-4">
									<div class="flex items-center gap-2">
										<span class="text-sm font-medium text-text-base">{event.title}</span>
										<span class="text-xs text-text-muted">·</span>
										<span class="text-xs {event.author === 'El' ? 'text-elotte-green' : 'text-elotte-orange'}">
											{event.author}
										</span>
									</div>
									<p class="text-xs text-text-muted mt-0.5">{event.description}</p>
								</div>
							</div>
						{/each}
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>
