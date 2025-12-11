import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	// SvelteKit이 정적 라우트('new')를 동적 라우트('[id]')보다 우선 처리하므로
	// 여기서는 리다이렉트가 필요 없음
	return {
		trackId: params.id || ''
	};
};




