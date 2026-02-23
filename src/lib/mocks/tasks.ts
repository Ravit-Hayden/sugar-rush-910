/**
 * 태스크 목록/상세 공통 목업 데이터
 */

export interface MockTask {
	id: string;
	title: string;
	priority: boolean;
	completed: boolean;
	due: string;
	overdue?: boolean;
	description: string;
}

export const mockTasks: MockTask[] = [
	{ id: '1', title: '앨범 커버 디자인 검토', priority: true, completed: false, due: 'today', description: '첫 번째 정규 앨범 커버 최종 검토 및 피드백 반영.' },
	{ id: '2', title: '트랙 마스터링 완료', priority: false, completed: false, due: 'tomorrow', description: '수정된 트랙 마스터링 작업 완료 및 품질 확인.' },
	{ id: '3', title: '발매 일정 확정', priority: true, completed: false, due: 'yesterday', overdue: true, description: '국내·해외 발매일 확정 및 플랫폼 일정 반영.' },
	{ id: '4', title: '아트워크 최종 검수', priority: false, completed: false, due: 'today', description: '앨범 아트워크 및 자켓 이미지 최종 검수.' },
	// 검색 API 링크 연동용 (id 11–15)
	{ id: '11', title: '앨범 커버 디자인 검토', priority: true, completed: false, due: 'today', description: '앨범 커버 디자인 검토 및 피드백 반영.' },
	{ id: '12', title: '트랙 마스터링 완료', priority: false, completed: false, due: 'tomorrow', description: '트랙 마스터링 완료 및 품질 확인.' },
	{ id: '13', title: '가사 번역 작업', priority: false, completed: false, due: 'this week', description: '가사 번역 및 현지화 작업.' },
	{ id: '14', title: '음악 프로듀싱', priority: true, completed: false, due: 'this week', description: '음악 프로듀싱 및 믹싱 작업.' },
	{ id: '15', title: '앨범 발매 준비', priority: true, completed: false, due: 'next week', description: '앨범 발매 일정 및 플랫폼 업로드 준비.' }
];
