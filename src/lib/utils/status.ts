/**
 * 트랙/앨범/발매/뮤직비디오 상태값 관리 유틸리티
 * 
 * 상태값 분류:
 * 1. 작곡가/작사가 작업
 * 2. 편집자 작업
 * 3. 발매업체 작업
 * 4. 공통 상태 (전체 단계 공통)
 * 5. 삭제됨 (전체 단계 공통)
 */

/**
 * 상태값에 따른 색상 클래스 반환
 * @param status - 상태값 문자열
 * @returns Tailwind CSS 클래스명
 */
export function getStatusColor(status: string): string {
	switch (status) {
		// 1. 작곡가/작사가 작업
		case 'draft': return 'badge-medium-yellow';              // #FFD700 - 초안 (노란색)
		case 'editing': return 'text-elotte-orange';             // #FF7A00 - 수정 중 (밝은 주황색)
		case 'revision_requested': return 'text-elotte-orange';  // #FF7A00 - 수정 요청 (밝은 주황색)
		
		// 2. 편집자 작업 (다크모드: 시안 #00DDFF, 라이트모드: 블루 #45ADFF)
		case 'pending_review': return 'badge-editor-status';        // 검토 대기
		case 'under_review': return 'badge-editor-status';           // 검토 중
		case 'editing_complete': return 'badge-editor-status';      // 편집 완료
		case 'approved': return 'badge-editor-status';               // 승인됨
		
		// 3. 발매업체 작업 (보라색 → 핫핑크)
		case 'scheduled': return 'badge-special-purple';         // #D400FF - 발매 예정
		case 'published': return 'text-brand-pink';              // #FF3DAE - 발매됨
		case 'live': return 'text-brand-pink';                   // #FF3DAE - 발매됨 (releases 페이지용)
		
		// 4. 공통 상태 (회색) - 전체 단계 공통
		case 'paused': return 'text-text-muted';                  // #6F6F6F - 일시정지
		case 'archived': return 'text-text-muted';                // #6F6F6F - 보관됨
		
		// 5. 삭제됨 (레드) - 전체 단계 공통
		case 'deleted': return 'badge-high-red';                 // #FF1900 - 삭제됨
		
		// 뮤직비디오 전용 상태 (트랙 상태값과 매핑)
		case 'generating': return 'badge-medium-yellow';         // #FFD700 - 생성 중 (초안과 동일)
		case 'review': return 'badge-editor-status';              // 검토 중 (편집자 작업과 동일)
		
		default: return 'text-text-muted';
	}
}

/**
 * 상태값에 따른 한글 라벨 반환
 * @param status - 상태값 문자열
 * @returns 한글 상태 라벨
 */
export function getStatusLabel(status: string): string {
	switch (status) {
		// 작곡가/작사가 작업
		case 'draft': return '초안';
		case 'editing': return '수정 중';
		case 'revision_requested': return '수정 요청';
		
		// 편집자 작업
		case 'pending_review': return '검토 대기';
		case 'under_review': return '검토 중';
		case 'editing_complete': return '편집 완료';
		case 'approved': return '승인됨';
		
		// 발매업체 작업
		case 'scheduled': return '발매 예정';
		case 'published': return '발매됨';
		case 'live': return '발매됨';  // releases 페이지용
		
		// 공통 상태 (전체 단계 공통)
		case 'paused': return '일시정지';
		case 'archived': return '보관됨';
		case 'deleted': return '삭제됨';
		
		// 뮤직비디오 전용 상태
		case 'generating': return '생성 중';
		case 'review': return '검토 중';
		
		default: return '알 수 없음';
	}
}



