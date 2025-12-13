import { toast } from '$lib/stores/toast';

/**
 * Toast ID를 안전하게 제거하는 헬퍼 함수
 * @param toastId - 제거할 Toast ID (null일 수 있음)
 * @returns null (제거 후 항상 null 반환)
 */
export function clearToast(toastId: string | null): null {
	if (toastId) {
		toast.remove(toastId);
	}
	return null;
}

/**
 * 앨범-아티스트 불일치 경고 Toast를 생성하는 헬퍼 함수
 * @param message - 경고 메시지
 * @param actionLabel - 액션 버튼 라벨 (예: "아티스트 변경", "앨범 다시 선택")
 * @param actionCallback - 액션 버튼 클릭 시 실행할 콜백
 * @param onDismiss - 무시 버튼 클릭 시 실행할 콜백 (선택)
 * @returns 생성된 Toast ID
 */
export function showAlbumArtistMismatchToast(
	message: string,
	actionLabel: string,
	actionCallback: () => void,
	onDismiss?: () => void
): string {
	return toast.add(
		message,
		'warning',
		0, // 자동으로 사라지지 않음 - 사용자가 선택할 때까지 유지
		{
			label: actionLabel,
			callback: actionCallback
		},
		{
			label: '무시',
			callback: onDismiss
		}
	);
}

