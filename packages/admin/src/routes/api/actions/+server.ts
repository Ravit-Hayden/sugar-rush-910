import type { RequestHandler } from './$types';
import type { ActionsResponse } from '$lib/types/api';

// 목 데이터
const mockActions = [
	{ label: '새 앨범', href: '/albums/new' },
	{ label: '새 트랙', href: '/tracks/new' },
	{ label: '파일 업로드', href: '/files/upload' },
	{ label: '수익 정산', href: '/revenue' },
	{ label: '사용자 관리', href: '/users' },
	{ label: '설정', href: '/settings' }
];

export const GET: RequestHandler = async () => {
	try {
		const response: ActionsResponse = { ok: true, data: mockActions };
		
		return new Response(JSON.stringify(response), {
			headers: { 'content-type': 'application/json' }
		});
	} catch (error) {
		const errorResponse: ActionsResponse = {
			ok: false,
			error: {
				code: 'INTERNAL_ERROR',
				message: 'Internal server error',
				details: error
			}
		};
		return new Response(JSON.stringify(errorResponse), { 
			status: 500,
			headers: { 'content-type': 'application/json' }
		});
	}
};
