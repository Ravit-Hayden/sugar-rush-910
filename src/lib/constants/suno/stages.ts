/**
 * SUNO 제작 단계 정의
 */

import type { ProductionStageDefinition, ProductionStageId } from '$lib/types/suno';

/** 제작 단계 목록 (18단계) */
export const PRODUCTION_STAGES: ProductionStageDefinition[] = [
	{ id: 'idea', name: '아이디어 기획', order: 1, assignedTo: 'Both' },
	{ id: 'lyrics_draft', name: '가사 초안', order: 2, assignedTo: 'Otte' },
	{ id: 'lyrics_structure', name: '곡구조 버전', order: 3, assignedTo: 'Otte' },
	{ id: 'lyrics_suno', name: '수노발음 버전', order: 4, assignedTo: 'Otte' },
	{ id: 'prompt_writing', name: '프롬프트 작성', order: 5, assignedTo: 'Both' },
	{ id: 'suno_generation', name: 'SUNO 생성', order: 6, assignedTo: 'Both' },
	{ id: 'suno_comparison', name: '버전 비교', order: 7, assignedTo: 'Both' },
	{ id: 'suno_selection', name: '곡 선정', order: 8, assignedTo: 'Both' },
	{ id: 'mixing', name: '믹싱', order: 9, assignedTo: 'El' },
	{ id: 'audio_editing', name: '음원 수정', order: 10, assignedTo: 'El' },
	{ id: 'mastering', name: '마스터링', order: 11, assignedTo: 'El' },
	{ id: 'lyrics_final', name: '앨범등록 가사', order: 12, assignedTo: 'Otte' },
	{ id: 'artwork', name: '아트워크 제작', order: 13, assignedTo: 'Both' },
	{ id: 'track_info', name: '곡 정보 입력', order: 14, assignedTo: 'Both' },
	{ id: 'album_ready', name: '앨범 등록 준비', order: 15, assignedTo: 'Both' },
	{ id: 'distribution', name: '배포처 업로드', order: 16, assignedTo: 'Both' },
	{ id: 'promotion', name: '홍보/마케팅', order: 17, assignedTo: 'Both' },
	{ id: 'released', name: '발매 완료', order: 18, assignedTo: 'Both' }
];

/** 단계 ID로 단계 정보 찾기 */
export function getStageById(id: ProductionStageId): ProductionStageDefinition | undefined {
	return PRODUCTION_STAGES.find(stage => stage.id === id);
}

/** 단계 이름 가져오기 */
export function getStageName(id: ProductionStageId): string {
	return getStageById(id)?.name ?? id;
}

/** 진행률 계산 (완료된 단계 수 / 전체 단계 수) */
export function calculateProgressPercent(completedStageIds: ProductionStageId[]): number {
	if (completedStageIds.length === 0) return 0;
	return Math.round((completedStageIds.length / PRODUCTION_STAGES.length) * 100);
}

/** 다음 단계 가져오기 */
export function getNextStage(currentStageId: ProductionStageId): ProductionStageDefinition | undefined {
	const currentStage = getStageById(currentStageId);
	if (!currentStage) return undefined;
	return PRODUCTION_STAGES.find(stage => stage.order === currentStage.order + 1);
}

/** 총 단계 수 */
export const TOTAL_STAGES = PRODUCTION_STAGES.length;
