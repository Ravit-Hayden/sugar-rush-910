/**
 * 사이트 전체 업로드 한도 통일 (개인용 관리자 페이지)
 * 모든 파일 업로드(이미지·음원·엑셀 등)에 동일 적용
 */

/** 파일 업로드 트리거 버튼 라벨 (사이트 전역 공통, 짧게) */
export const FILE_UPLOAD_BUTTON_LABEL = '파일 선택';

export const MAX_FILE_SIZE_BYTES = 1024 * 1024 * 1024; // 1GB
export const MAX_FILE_SIZE_MB = 1024; // 1GB (표시용)

export function isFileWithinLimit(file: File): boolean {
	return file.size <= MAX_FILE_SIZE_BYTES;
}

export function getFileSizeErrorMessage(): string {
	return `파일 크기는 ${MAX_FILE_SIZE_MB}MB(1GB)를 초과할 수 없습니다.`;
}
