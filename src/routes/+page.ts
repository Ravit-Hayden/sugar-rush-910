import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url }) => {
	try {
		// 대시보드 페이지는 목 데이터를 사용하므로 서버 로드가 필요 없음
		// 하지만 500 오류를 방지하기 위해 빈 데이터 반환
		return {
			status: 'ok'
		};
	} catch (error) {
		console.error('Dashboard load error:', error);
		// 오류 발생 시에도 페이지가 렌더링되도록 빈 데이터 반환
		return {
			status: 'error',
			error: error instanceof Error ? error.message : 'Unknown error'
		};
	}
};








