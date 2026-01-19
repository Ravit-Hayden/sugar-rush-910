/**
 * SUNO 관련 목업 데이터
 * 실제 API 연동 시 이 파일의 데이터는 API 응답으로 대체됩니다.
 */

import type { SUNOProject, SUNOSubscription, WordEntry, ProductionStageStatus, RecentActivity } from '$lib/types/suno';

// 목업 프로젝트 데이터
export const mockProjects: SUNOProject[] = [
	{
		id: 'proj1',
		title: '달콤한 밤의 노래',
		description: '여름밤 감성 발라드',
		status: 'in_progress',
		stages: [
			{ stageId: 'idea', isCompleted: true, completedAt: '2026-01-05', completedBy: 'Otte' },
			{ stageId: 'lyrics_draft', isCompleted: true, completedAt: '2026-01-07', completedBy: 'Otte' },
			{ stageId: 'lyrics_structure', isCompleted: true, completedAt: '2026-01-08', completedBy: 'Otte' },
			{ stageId: 'lyrics_suno', isCompleted: true, completedAt: '2026-01-09', completedBy: 'Otte' },
			{ stageId: 'suno_generation', isCompleted: true, completedAt: '2026-01-10', completedBy: 'El' },
			{ stageId: 'suno_selection', isCompleted: false }
		] as ProductionStageStatus[],
		progressPercent: 45,
		createdBy: 'Otte',
		lyricsVersions: [],
		promptConfigs: [],
		audioVersions: [],
		usedWordIds: [],
		createdAt: '2026-01-05',
		updatedAt: '2026-01-10'
	},
	{
		id: 'proj2',
		title: '마카롱 팝',
		description: '귀여운 디저트 컨셉 팝송',
		status: 'in_progress',
		stages: [
			{ stageId: 'idea', isCompleted: true, completedAt: '2026-01-10', completedBy: 'El' },
			{ stageId: 'lyrics_draft', isCompleted: true, completedAt: '2026-01-11', completedBy: 'Otte' },
			{ stageId: 'lyrics_structure', isCompleted: false }
		] as ProductionStageStatus[],
		progressPercent: 18,
		createdBy: 'El',
		lyricsVersions: [],
		promptConfigs: [],
		audioVersions: [],
		usedWordIds: [],
		createdAt: '2026-01-10',
		updatedAt: '2026-01-11'
	},
	{
		id: 'proj3',
		title: '새벽 3시의 고백',
		description: '심야 감성 R&B',
		status: 'in_progress',
		stages: [
			{ stageId: 'idea', isCompleted: true, completedAt: '2026-01-01', completedBy: 'Otte' },
			{ stageId: 'lyrics_draft', isCompleted: true, completedAt: '2026-01-02', completedBy: 'Otte' },
			{ stageId: 'lyrics_structure', isCompleted: true, completedAt: '2026-01-03', completedBy: 'Otte' },
			{ stageId: 'lyrics_suno', isCompleted: true, completedAt: '2026-01-04', completedBy: 'Otte' },
			{ stageId: 'suno_generation', isCompleted: true, completedAt: '2026-01-05', completedBy: 'El' },
			{ stageId: 'suno_selection', isCompleted: true, completedAt: '2026-01-06', completedBy: 'Both' },
			{ stageId: 'audio_editing', isCompleted: true, completedAt: '2026-01-08', completedBy: 'El' },
			{ stageId: 'lyrics_final', isCompleted: true, completedAt: '2026-01-09', completedBy: 'Otte' },
			{ stageId: 'mastering', isCompleted: false }
		] as ProductionStageStatus[],
		progressPercent: 73,
		createdBy: 'Otte',
		lyricsVersions: [],
		promptConfigs: [],
		audioVersions: [],
		usedWordIds: [],
		createdAt: '2026-01-01',
		updatedAt: '2026-01-09'
	}
];

// 목업 구독 정보
export const mockSubscription: SUNOSubscription = {
	planType: 'Pro',
	billingDate: 15,
	monthlyCredits: 500,
	remainingCredits: 320,
	lastUpdated: '2026-01-13'
};

// 목업 워드 데이터
export const mockWords: WordEntry[] = [
	{ id: '1', content: '달콤한 꿈', category: 'topic', tags: [], usageCount: 5, linkedTracks: [], createdAt: '2026-01-10', createdBy: 'El' },
	{ id: '2', content: '여름밤의 설렘', category: 'mood', tags: [], usageCount: 3, linkedTracks: [], createdAt: '2026-01-11', createdBy: 'Otte' },
	{ id: '3', content: '설레는 마음', category: 'emotion', tags: [], usageCount: 10, linkedTracks: [], createdAt: '2026-01-06', createdBy: 'El' }
];

// 목업 최근 활동 데이터
export const mockRecentActivities: RecentActivity[] = [
	{
		id: 'act1',
		projectId: 'proj1',
		projectTitle: '달콤한 밤의 노래',
		action: 'SUNO 생성 완료',
		author: 'El',
		timestamp: '2시간 전'
	},
	{
		id: 'act2',
		projectId: 'proj2',
		projectTitle: '마카롱 팝',
		action: '가사 초안 작성',
		author: 'Otte',
		timestamp: '5시간 전'
	},
	{
		id: 'act3',
		projectId: 'proj3',
		projectTitle: '새벽 3시의 고백',
		action: '마스터링 시작',
		author: 'El',
		timestamp: '1일 전'
	}
];
