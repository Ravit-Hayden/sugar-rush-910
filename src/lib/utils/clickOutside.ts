/**
 * 외부 클릭 감지 유틸리티
 * Svelte $effect와 함께 사용하여 외부 클릭 시 콜백 실행
 * 
 * @param selector - CSS 선택자 (예: '.genre-filter-dropdown')
 * @param callback - 외부 클릭 시 실행할 콜백
 * @param enabled - 활성화 여부
 * @returns cleanup 함수
 */
export function useClickOutside(
	selector: string,
	callback: () => void,
	enabled: boolean = true
): () => void {
	if (!enabled) {
		return () => {};
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest(selector)) {
			callback();
		}
	}

	// 다음 틱에 이벤트 리스너 등록 (현재 클릭 이벤트와 충돌 방지)
	const timeoutId = setTimeout(() => {
		document.addEventListener('click', handleClickOutside, true);
	}, 0);

	return () => {
		clearTimeout(timeoutId);
		document.removeEventListener('click', handleClickOutside, true);
	};
}

/**
 * Escape 키 감지 유틸리티
 */
export function useEscapeKey(callback: () => void, enabled: boolean = true): () => void {
	if (!enabled) {
		return () => {};
	}

	function handleEscape(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			callback();
		}
	}

	document.addEventListener('keydown', handleEscape);
	return () => {
		document.removeEventListener('keydown', handleEscape);
	};
}

