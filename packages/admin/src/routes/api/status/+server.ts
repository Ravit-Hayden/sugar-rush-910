import type { RequestHandler } from './$types';
import type { StatusResponse } from '$lib/types/api';

// 목 데이터
const mockStatus = [
	{ key: 'API 서버', value: '정상' },
	{ key: '데이터베이스', value: '정상' },
	{ key: 'CDN', value: '지연' },
	{ key: '이메일 서비스', value: '정상' },
	{ key: '파일 스토리지', value: '정상' },
	{ key: '모니터링', value: '정상' }
];

export const GET: RequestHandler = async () => {
	try {
		const response: StatusResponse = { ok: true, data: mockStatus };
		
		return new Response(JSON.stringify(response), {
			headers: { 'content-type': 'application/json' }
		});
	} catch (error) {
		const errorResponse: StatusResponse = {
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
