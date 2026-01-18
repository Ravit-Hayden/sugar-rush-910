/**
 * 워드 라이브러리 카테고리 정의
 */

import type { WordCategory } from '$lib/types/suno';

/** 카테고리 정보 */
export interface CategoryInfo {
	id: WordCategory;
	name: string;
	description: string;
	icon: string;        // Lucide 아이콘 이름
	color: string;       // 테마 색상 클래스
}

/** 워드 카테고리 목록 */
export const WORD_CATEGORIES: CategoryInfo[] = [
	{ id: 'topic', name: '주제', description: '곡의 주제/테마', icon: 'Lightbulb', color: 'text-yellow-500' },
	{ id: 'mood', name: '분위기', description: '곡의 분위기/무드', icon: 'Cloud', color: 'text-blue-400' },
	{ id: 'action', name: '행동', description: '동작, 움직임', icon: 'Zap', color: 'text-orange-500' },
	{ id: 'dessert', name: '디저트', description: '디저트/음식 관련', icon: 'Cake', color: 'text-pink-400' },
	{ id: 'season', name: '계절', description: '봄/여름/가을/겨울', icon: 'Sun', color: 'text-green-500' },
	{ id: 'event', name: '이벤트', description: '기념일, 행사', icon: 'Calendar', color: 'text-purple-500' },
	{ id: 'emotion', name: '감정', description: '감정 표현', icon: 'Heart', color: 'text-red-400' },
	{ id: 'place', name: '장소', description: '배경/장소', icon: 'MapPin', color: 'text-teal-500' },
	{ id: 'time', name: '시간', description: '시간대/시기', icon: 'Clock', color: 'text-indigo-500' },
	{ id: 'object', name: '사물', description: '물건/사물', icon: 'Box', color: 'text-gray-500' },
	{ id: 'phrase', name: '문장', description: '가사 문구', icon: 'Quote', color: 'text-cyan-500' },
	{ id: 'style', name: '스타일', description: 'SUNO 스타일 프롬프트', icon: 'Palette', color: 'text-brand-pink' },
	{ id: 'exclude', name: '제외', description: 'SUNO 제외 스타일', icon: 'XCircle', color: 'text-red-600' }
];

/** 카테고리 ID로 정보 찾기 */
export function getCategoryById(id: WordCategory): CategoryInfo | undefined {
	return WORD_CATEGORIES.find(cat => cat.id === id);
}

/** 카테고리 이름 가져오기 */
export function getCategoryName(id: WordCategory): string {
	return getCategoryById(id)?.name ?? id;
}

/** 카테고리 ID 목록 */
export const CATEGORY_IDS = WORD_CATEGORIES.map(cat => cat.id);
