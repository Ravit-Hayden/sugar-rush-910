import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// 트랙 추가 페이지는 클라이언트 사이드에서만 동작
	// 서버 사이드에서는 빈 데이터 반환
	return {};
};





