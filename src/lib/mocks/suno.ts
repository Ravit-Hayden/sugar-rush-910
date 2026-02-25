/**
 * SUNO 관련 목업 데이터
 * 실제 API 연동 시 이 파일의 데이터는 API 응답으로 대체됩니다.
 */

import type { SUNOProject, SUNOSubscription, WordEntry, ProductionStageStatus, RecentActivity } from '$lib/types/suno';
import { PRODUCTION_STAGES } from '$lib/constants/suno/stages';

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
			{ stageId: 'suno_selection', isCompleted: true, completedAt: '2026-01-06', completedBy: 'El' },
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
	},
	{
		id: 'proj4',
		title: 'Sugar Rush Vol.1',
		description: '첫 번째 정규앨범 타이틀곡',
		status: 'completed',
		stages: PRODUCTION_STAGES.map(stage => ({
			stageId: stage.id,
			isCompleted: true,
			completedAt: '2025-12-20',
			completedBy: stage.assignedTo === 'El' ? 'El' : 'Otte'
		})) as ProductionStageStatus[],
		progressPercent: 100,
		createdBy: 'El',
		lyricsVersions: [],
		promptConfigs: [],
		audioVersions: [],
		usedWordIds: [],
		linkedTrackId: 'track1',
		createdAt: '2025-11-15',
		updatedAt: '2025-12-20'
	},
	{
		id: 'proj5',
		title: '별빛 아래서',
		description: '로맨틱 팝 발라드',
		status: 'idea',
		stages: [
			{ stageId: 'idea', isCompleted: false }
		] as ProductionStageStatus[],
		progressPercent: 0,
		createdBy: 'Otte',
		lyricsVersions: [],
		promptConfigs: [],
		audioVersions: [],
		usedWordIds: [],
		createdAt: '2026-01-13',
		updatedAt: '2026-01-13'
	},
	{
		id: 'proj6',
		title: '네온 드라이브',
		description: '시티팝 레트로 바이브',
		status: 'in_progress',
		stages: [
			{ stageId: 'idea', isCompleted: true, completedAt: '2026-01-08', completedBy: 'El' },
			{ stageId: 'lyrics_draft', isCompleted: true, completedAt: '2026-01-09', completedBy: 'Otte' },
			{ stageId: 'lyrics_structure', isCompleted: true, completedAt: '2026-01-10', completedBy: 'Otte' },
			{ stageId: 'lyrics_suno', isCompleted: true, completedAt: '2026-01-11', completedBy: 'Otte' },
			{ stageId: 'prompt_writing', isCompleted: false }
		] as ProductionStageStatus[],
		progressPercent: 22,
		createdBy: 'El',
		lyricsVersions: [],
		promptConfigs: [],
		audioVersions: [],
		usedWordIds: [],
		createdAt: '2026-01-08',
		updatedAt: '2026-01-11'
	},
	{
		id: 'proj7',
		title: '허니 트랩',
		description: '중독성 있는 댄스팝',
		status: 'in_progress',
		stages: [
			{ stageId: 'idea', isCompleted: true, completedAt: '2026-01-02', completedBy: 'El' },
			{ stageId: 'lyrics_draft', isCompleted: true, completedAt: '2026-01-03', completedBy: 'Otte' },
			{ stageId: 'lyrics_structure', isCompleted: true, completedAt: '2026-01-04', completedBy: 'Otte' },
			{ stageId: 'lyrics_suno', isCompleted: true, completedAt: '2026-01-05', completedBy: 'Otte' },
			{ stageId: 'prompt_writing', isCompleted: true, completedAt: '2026-01-06', completedBy: 'El' },
			{ stageId: 'suno_generation', isCompleted: true, completedAt: '2026-01-07', completedBy: 'El' },
			{ stageId: 'suno_comparison', isCompleted: false }
		] as ProductionStageStatus[],
		progressPercent: 33,
		createdBy: 'El',
		lyricsVersions: [],
		promptConfigs: [],
		audioVersions: [],
		usedWordIds: [],
		createdAt: '2026-01-02',
		updatedAt: '2026-01-07'
	},
	{
		id: 'proj8',
		title: '문라이트 소나타',
		description: '피아노 중심 발라드',
		status: 'in_progress',
		stages: [
			{ stageId: 'idea', isCompleted: true, completedAt: '2025-12-20', completedBy: 'Otte' },
			{ stageId: 'lyrics_draft', isCompleted: true, completedAt: '2025-12-22', completedBy: 'Otte' },
			{ stageId: 'lyrics_structure', isCompleted: true, completedAt: '2025-12-24', completedBy: 'Otte' },
			{ stageId: 'lyrics_suno', isCompleted: true, completedAt: '2025-12-26', completedBy: 'Otte' },
			{ stageId: 'prompt_writing', isCompleted: true, completedAt: '2025-12-28', completedBy: 'El' },
			{ stageId: 'suno_generation', isCompleted: true, completedAt: '2025-12-30', completedBy: 'El' },
			{ stageId: 'suno_comparison', isCompleted: true, completedAt: '2026-01-01', completedBy: 'Both' },
			{ stageId: 'suno_selection', isCompleted: true, completedAt: '2026-01-02', completedBy: 'Both' },
			{ stageId: 'mixing', isCompleted: false }
		] as ProductionStageStatus[],
		progressPercent: 44,
		createdBy: 'Otte',
		lyricsVersions: [],
		promptConfigs: [],
		audioVersions: [],
		usedWordIds: [],
		createdAt: '2025-12-20',
		updatedAt: '2026-01-02'
	},
	{
		id: 'proj9',
		title: '캔디 크러쉬',
		description: '통통 튀는 틴팝',
		status: 'in_progress',
		stages: [
			{ stageId: 'idea', isCompleted: true, completedAt: '2025-12-15', completedBy: 'El' },
			{ stageId: 'lyrics_draft', isCompleted: true, completedAt: '2025-12-16', completedBy: 'Otte' },
			{ stageId: 'lyrics_structure', isCompleted: true, completedAt: '2025-12-17', completedBy: 'Otte' },
			{ stageId: 'lyrics_suno', isCompleted: true, completedAt: '2025-12-18', completedBy: 'Otte' },
			{ stageId: 'prompt_writing', isCompleted: true, completedAt: '2025-12-19', completedBy: 'El' },
			{ stageId: 'suno_generation', isCompleted: true, completedAt: '2025-12-20', completedBy: 'El' },
			{ stageId: 'suno_comparison', isCompleted: true, completedAt: '2025-12-21', completedBy: 'Both' },
			{ stageId: 'suno_selection', isCompleted: true, completedAt: '2025-12-22', completedBy: 'Both' },
			{ stageId: 'mixing', isCompleted: true, completedAt: '2025-12-24', completedBy: 'El' },
			{ stageId: 'audio_editing', isCompleted: true, completedAt: '2025-12-26', completedBy: 'El' },
			{ stageId: 'mastering', isCompleted: true, completedAt: '2025-12-28', completedBy: 'El' },
			{ stageId: 'lyrics_final', isCompleted: false }
		] as ProductionStageStatus[],
		progressPercent: 61,
		createdBy: 'El',
		lyricsVersions: [],
		promptConfigs: [],
		audioVersions: [],
		usedWordIds: [],
		createdAt: '2025-12-15',
		updatedAt: '2025-12-28'
	},
	{
		id: 'proj10',
		title: '미드나잇 블루',
		description: '재즈 힙합 퓨전',
		status: 'in_progress',
		stages: [
			{ stageId: 'idea', isCompleted: true, completedAt: '2025-12-01', completedBy: 'Otte' },
			{ stageId: 'lyrics_draft', isCompleted: true, completedAt: '2025-12-03', completedBy: 'Otte' },
			{ stageId: 'lyrics_structure', isCompleted: true, completedAt: '2025-12-05', completedBy: 'Otte' },
			{ stageId: 'lyrics_suno', isCompleted: true, completedAt: '2025-12-07', completedBy: 'Otte' },
			{ stageId: 'prompt_writing', isCompleted: true, completedAt: '2025-12-08', completedBy: 'El' },
			{ stageId: 'suno_generation', isCompleted: true, completedAt: '2025-12-10', completedBy: 'El' },
			{ stageId: 'suno_comparison', isCompleted: true, completedAt: '2025-12-11', completedBy: 'Both' },
			{ stageId: 'suno_selection', isCompleted: true, completedAt: '2025-12-12', completedBy: 'Both' },
			{ stageId: 'mixing', isCompleted: true, completedAt: '2025-12-14', completedBy: 'El' },
			{ stageId: 'audio_editing', isCompleted: true, completedAt: '2025-12-16', completedBy: 'El' },
			{ stageId: 'mastering', isCompleted: true, completedAt: '2025-12-18', completedBy: 'El' },
			{ stageId: 'lyrics_final', isCompleted: true, completedAt: '2025-12-19', completedBy: 'Otte' },
			{ stageId: 'artwork', isCompleted: false }
		] as ProductionStageStatus[],
		progressPercent: 67,
		createdBy: 'Otte',
		lyricsVersions: [],
		promptConfigs: [],
		audioVersions: [],
		usedWordIds: [],
		createdAt: '2025-12-01',
		updatedAt: '2025-12-19'
	},
	{
		id: 'proj11',
		title: '체리 블로썸',
		description: '봄날 감성 팝',
		status: 'in_progress',
		stages: [
			{ stageId: 'idea', isCompleted: true, completedAt: '2025-11-20', completedBy: 'El' },
			{ stageId: 'lyrics_draft', isCompleted: true, completedAt: '2025-11-22', completedBy: 'Otte' },
			{ stageId: 'lyrics_structure', isCompleted: true, completedAt: '2025-11-24', completedBy: 'Otte' },
			{ stageId: 'lyrics_suno', isCompleted: true, completedAt: '2025-11-26', completedBy: 'Otte' },
			{ stageId: 'prompt_writing', isCompleted: true, completedAt: '2025-11-27', completedBy: 'El' },
			{ stageId: 'suno_generation', isCompleted: true, completedAt: '2025-11-29', completedBy: 'El' },
			{ stageId: 'suno_comparison', isCompleted: true, completedAt: '2025-11-30', completedBy: 'Both' },
			{ stageId: 'suno_selection', isCompleted: true, completedAt: '2025-12-01', completedBy: 'Both' },
			{ stageId: 'mixing', isCompleted: true, completedAt: '2025-12-03', completedBy: 'El' },
			{ stageId: 'audio_editing', isCompleted: true, completedAt: '2025-12-05', completedBy: 'El' },
			{ stageId: 'mastering', isCompleted: true, completedAt: '2025-12-07', completedBy: 'El' },
			{ stageId: 'lyrics_final', isCompleted: true, completedAt: '2025-12-08', completedBy: 'Otte' },
			{ stageId: 'artwork', isCompleted: true, completedAt: '2025-12-10', completedBy: 'El' },
			{ stageId: 'track_info', isCompleted: false }
		] as ProductionStageStatus[],
		progressPercent: 72,
		createdBy: 'El',
		lyricsVersions: [],
		promptConfigs: [],
		audioVersions: [],
		usedWordIds: [],
		createdAt: '2025-11-20',
		updatedAt: '2025-12-10'
	},
	{
		id: 'proj12',
		title: '스타더스트',
		description: '우주 컨셉 일렉트로닉',
		status: 'in_progress',
		stages: [
			{ stageId: 'idea', isCompleted: true, completedAt: '2025-11-01', completedBy: 'Otte' },
			{ stageId: 'lyrics_draft', isCompleted: true, completedAt: '2025-11-03', completedBy: 'Otte' },
			{ stageId: 'lyrics_structure', isCompleted: true, completedAt: '2025-11-05', completedBy: 'Otte' },
			{ stageId: 'lyrics_suno', isCompleted: true, completedAt: '2025-11-07', completedBy: 'Otte' },
			{ stageId: 'prompt_writing', isCompleted: true, completedAt: '2025-11-08', completedBy: 'El' },
			{ stageId: 'suno_generation', isCompleted: true, completedAt: '2025-11-10', completedBy: 'El' },
			{ stageId: 'suno_comparison', isCompleted: true, completedAt: '2025-11-11', completedBy: 'Both' },
			{ stageId: 'suno_selection', isCompleted: true, completedAt: '2025-11-12', completedBy: 'Both' },
			{ stageId: 'mixing', isCompleted: true, completedAt: '2025-11-14', completedBy: 'El' },
			{ stageId: 'audio_editing', isCompleted: true, completedAt: '2025-11-16', completedBy: 'El' },
			{ stageId: 'mastering', isCompleted: true, completedAt: '2025-11-18', completedBy: 'El' },
			{ stageId: 'lyrics_final', isCompleted: true, completedAt: '2025-11-19', completedBy: 'Otte' },
			{ stageId: 'artwork', isCompleted: true, completedAt: '2025-11-21', completedBy: 'El' },
			{ stageId: 'track_info', isCompleted: true, completedAt: '2025-11-22', completedBy: 'Both' },
			{ stageId: 'album_ready', isCompleted: false }
		] as ProductionStageStatus[],
		progressPercent: 78,
		createdBy: 'Otte',
		lyricsVersions: [],
		promptConfigs: [],
		audioVersions: [],
		usedWordIds: [],
		createdAt: '2025-11-01',
		updatedAt: '2025-11-22'
	},
	{
		id: 'proj13',
		title: '레몬 드롭',
		description: '상큼한 여름 팝',
		status: 'in_progress',
		stages: [
			{ stageId: 'idea', isCompleted: true, completedAt: '2025-10-15', completedBy: 'El' },
			{ stageId: 'lyrics_draft', isCompleted: true, completedAt: '2025-10-17', completedBy: 'Otte' },
			{ stageId: 'lyrics_structure', isCompleted: true, completedAt: '2025-10-19', completedBy: 'Otte' },
			{ stageId: 'lyrics_suno', isCompleted: true, completedAt: '2025-10-21', completedBy: 'Otte' },
			{ stageId: 'prompt_writing', isCompleted: true, completedAt: '2025-10-22', completedBy: 'El' },
			{ stageId: 'suno_generation', isCompleted: true, completedAt: '2025-10-24', completedBy: 'El' },
			{ stageId: 'suno_comparison', isCompleted: true, completedAt: '2025-10-25', completedBy: 'Both' },
			{ stageId: 'suno_selection', isCompleted: true, completedAt: '2025-10-26', completedBy: 'Both' },
			{ stageId: 'mixing', isCompleted: true, completedAt: '2025-10-28', completedBy: 'El' },
			{ stageId: 'audio_editing', isCompleted: true, completedAt: '2025-10-30', completedBy: 'El' },
			{ stageId: 'mastering', isCompleted: true, completedAt: '2025-11-01', completedBy: 'El' },
			{ stageId: 'lyrics_final', isCompleted: true, completedAt: '2025-11-02', completedBy: 'Otte' },
			{ stageId: 'artwork', isCompleted: true, completedAt: '2025-11-04', completedBy: 'El' },
			{ stageId: 'track_info', isCompleted: true, completedAt: '2025-11-05', completedBy: 'Both' },
			{ stageId: 'album_ready', isCompleted: true, completedAt: '2025-11-06', completedBy: 'Both' },
			{ stageId: 'distribution', isCompleted: false }
		] as ProductionStageStatus[],
		progressPercent: 83,
		createdBy: 'El',
		lyricsVersions: [],
		promptConfigs: [],
		audioVersions: [],
		usedWordIds: [],
		createdAt: '2025-10-15',
		updatedAt: '2025-11-06'
	},
	{
		id: 'proj14',
		title: '버블 파티',
		description: '파티 EDM',
		status: 'in_progress',
		stages: [
			{ stageId: 'idea', isCompleted: true, completedAt: '2025-10-01', completedBy: 'Otte' },
			{ stageId: 'lyrics_draft', isCompleted: true, completedAt: '2025-10-03', completedBy: 'Otte' },
			{ stageId: 'lyrics_structure', isCompleted: true, completedAt: '2025-10-05', completedBy: 'Otte' },
			{ stageId: 'lyrics_suno', isCompleted: true, completedAt: '2025-10-07', completedBy: 'Otte' },
			{ stageId: 'prompt_writing', isCompleted: true, completedAt: '2025-10-08', completedBy: 'El' },
			{ stageId: 'suno_generation', isCompleted: true, completedAt: '2025-10-10', completedBy: 'El' },
			{ stageId: 'suno_comparison', isCompleted: true, completedAt: '2025-10-11', completedBy: 'Both' },
			{ stageId: 'suno_selection', isCompleted: true, completedAt: '2025-10-12', completedBy: 'Both' },
			{ stageId: 'mixing', isCompleted: true, completedAt: '2025-10-14', completedBy: 'El' },
			{ stageId: 'audio_editing', isCompleted: true, completedAt: '2025-10-16', completedBy: 'El' },
			{ stageId: 'mastering', isCompleted: true, completedAt: '2025-10-18', completedBy: 'El' },
			{ stageId: 'lyrics_final', isCompleted: true, completedAt: '2025-10-19', completedBy: 'Otte' },
			{ stageId: 'artwork', isCompleted: true, completedAt: '2025-10-21', completedBy: 'El' },
			{ stageId: 'track_info', isCompleted: true, completedAt: '2025-10-22', completedBy: 'Both' },
			{ stageId: 'album_ready', isCompleted: true, completedAt: '2025-10-23', completedBy: 'Both' },
			{ stageId: 'distribution', isCompleted: true, completedAt: '2025-10-25', completedBy: 'Both' },
			{ stageId: 'promotion', isCompleted: false }
		] as ProductionStageStatus[],
		progressPercent: 89,
		createdBy: 'Otte',
		lyricsVersions: [],
		promptConfigs: [],
		audioVersions: [],
		usedWordIds: [],
		createdAt: '2025-10-01',
		updatedAt: '2025-10-25'
	},
	{
		id: 'proj15',
		title: '드림 캐처',
		description: '몽환적 신스팝',
		status: 'completed',
		stages: PRODUCTION_STAGES.map(stage => ({
			stageId: stage.id,
			isCompleted: true,
			completedAt: '2025-09-30',
			completedBy: stage.assignedTo === 'El' ? 'El' : 'Otte'
		})) as ProductionStageStatus[],
		progressPercent: 100,
		createdBy: 'El',
		lyricsVersions: [],
		promptConfigs: [],
		audioVersions: [],
		usedWordIds: [],
		linkedTrackId: 'track2',
		createdAt: '2025-09-01',
		updatedAt: '2025-09-30'
	},
	{
		id: 'proj16',
		title: '오렌지 선셋',
		description: '노을빛 어쿠스틱',
		status: 'in_progress',
		stages: [
			{ stageId: 'idea', isCompleted: true, completedAt: '2026-01-14', completedBy: 'Otte' },
			{ stageId: 'lyrics_draft', isCompleted: false }
		] as ProductionStageStatus[],
		progressPercent: 6,
		createdBy: 'Otte',
		lyricsVersions: [],
		promptConfigs: [],
		audioVersions: [],
		usedWordIds: [],
		createdAt: '2026-01-14',
		updatedAt: '2026-01-14'
	},
	{
		id: 'proj17',
		title: '바닐라 스카이',
		description: '부드러운 R&B 발라드',
		status: 'in_progress',
		stages: [
			{ stageId: 'idea', isCompleted: true, completedAt: '2026-01-12', completedBy: 'El' },
			{ stageId: 'lyrics_draft', isCompleted: true, completedAt: '2026-01-13', completedBy: 'Otte' },
			{ stageId: 'lyrics_structure', isCompleted: true, completedAt: '2026-01-14', completedBy: 'Otte' },
			{ stageId: 'lyrics_suno', isCompleted: false }
		] as ProductionStageStatus[],
		progressPercent: 17,
		createdBy: 'El',
		lyricsVersions: [],
		promptConfigs: [],
		audioVersions: [],
		usedWordIds: [],
		createdAt: '2026-01-12',
		updatedAt: '2026-01-14'
	},
	{
		id: 'proj18',
		title: '핑크 다이아몬드',
		description: '화려한 댄스팝',
		status: 'in_progress',
		stages: [
			{ stageId: 'idea', isCompleted: true, completedAt: '2026-01-08', completedBy: 'Otte' },
			{ stageId: 'lyrics_draft', isCompleted: true, completedAt: '2026-01-09', completedBy: 'Otte' },
			{ stageId: 'lyrics_structure', isCompleted: true, completedAt: '2026-01-10', completedBy: 'Otte' },
			{ stageId: 'lyrics_suno', isCompleted: true, completedAt: '2026-01-11', completedBy: 'Otte' },
			{ stageId: 'prompt_writing', isCompleted: true, completedAt: '2026-01-12', completedBy: 'El' },
			{ stageId: 'suno_generation', isCompleted: false }
		] as ProductionStageStatus[],
		progressPercent: 28,
		createdBy: 'Otte',
		lyricsVersions: [],
		promptConfigs: [],
		audioVersions: [],
		usedWordIds: [],
		createdAt: '2026-01-08',
		updatedAt: '2026-01-12'
	},
	{
		id: 'proj19',
		title: '골든 아워',
		description: '황금빛 팝 록',
		status: 'in_progress',
		stages: [
			{ stageId: 'idea', isCompleted: true, completedAt: '2025-12-25', completedBy: 'El' },
			{ stageId: 'lyrics_draft', isCompleted: true, completedAt: '2025-12-26', completedBy: 'Otte' },
			{ stageId: 'lyrics_structure', isCompleted: true, completedAt: '2025-12-27', completedBy: 'Otte' },
			{ stageId: 'lyrics_suno', isCompleted: true, completedAt: '2025-12-28', completedBy: 'Otte' },
			{ stageId: 'prompt_writing', isCompleted: true, completedAt: '2025-12-29', completedBy: 'El' },
			{ stageId: 'suno_generation', isCompleted: true, completedAt: '2025-12-30', completedBy: 'El' },
			{ stageId: 'suno_comparison', isCompleted: true, completedAt: '2025-12-31', completedBy: 'Both' },
			{ stageId: 'suno_selection', isCompleted: true, completedAt: '2026-01-01', completedBy: 'Both' },
			{ stageId: 'mixing', isCompleted: true, completedAt: '2026-01-03', completedBy: 'El' },
			{ stageId: 'audio_editing', isCompleted: false }
		] as ProductionStageStatus[],
		progressPercent: 50,
		createdBy: 'El',
		lyricsVersions: [],
		promptConfigs: [],
		audioVersions: [],
		usedWordIds: [],
		createdAt: '2025-12-25',
		updatedAt: '2026-01-03'
	}
];

// 목업 구독 정보
export const mockSubscription: SUNOSubscription = {
	planType: 'Premier',
	status: 'active',
	billingDate: 15,
	monthlyCredits: 10000,
	remainingCredits: 6000,
	updatedBy: 'El',
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
