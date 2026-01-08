/**
 * 필터 상태 저장/복원 유틸리티
 * localStorage를 사용하여 필터 상태를 영구 저장
 */

export interface FilterState {
	searchQuery?: string;
	selectedGenre?: string;
	selectedStatus?: string;
	selectedSort?: string;
	selectedGenres?: string[];
	playsMin?: string;
	playsMax?: string;
	likesMin?: string;
	likesMax?: string;
	dateRangeStart?: string;
	dateRangeEnd?: string;
}

/**
 * 필터 상태를 localStorage에서 로드
 */
export function loadFiltersFromStorage(storageKey: string): FilterState | null {
	if (typeof window === 'undefined') return null;
	
	try {
		const stored = localStorage.getItem(storageKey);
		if (stored) {
			const parsed = JSON.parse(stored);
			// 유효성 검사: 숫자 필드는 0보다 큰 값만 복원
			if (parsed.playsMin && (!parsed.playsMin.trim() || parseInt(parsed.playsMin) <= 0)) {
				parsed.playsMin = '';
			}
			if (parsed.playsMax && (!parsed.playsMax.trim() || parseInt(parsed.playsMax) <= 0)) {
				parsed.playsMax = '';
			}
			if (parsed.likesMin && (!parsed.likesMin.trim() || parseInt(parsed.likesMin) <= 0)) {
				parsed.likesMin = '';
			}
			if (parsed.likesMax && (!parsed.likesMax.trim() || parseInt(parsed.likesMax) <= 0)) {
				parsed.likesMax = '';
			}
			return parsed;
		}
	} catch (e) {
		console.error('필터 상태 복원 실패:', e);
	}
	return null;
}

/**
 * 필터 상태를 localStorage에 저장
 */
export function saveFiltersToStorage(storageKey: string, filters: FilterState): void {
	if (typeof window === 'undefined') return;
	
	try {
		localStorage.setItem(storageKey, JSON.stringify(filters));
	} catch (e) {
		console.error('필터 상태 저장 실패:', e);
	}
}








