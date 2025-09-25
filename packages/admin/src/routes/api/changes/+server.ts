import type { RequestHandler } from './$types';
import type { ChangesResponse } from '$lib/types/api';

// 목 데이터
const mockChanges = [
	{ id: '1', text: 'Sugar Rush Vol.2 메타데이터 수정', recent: true },
	{ id: '2', text: '앨범 아트워크 업데이트', recent: false },
	{ id: '3', text: '발매 정책 변경', recent: true },
	{ id: '4', text: '사용자 권한 설정 변경', recent: false },
	{ id: '5', text: 'CDN 설정 최적화', recent: true },
	{ id: '6', text: '데이터베이스 스키마 업데이트', recent: false }
];

export const GET: RequestHandler = async ({ url }) => {
	try {
		const limit = Number(url.searchParams.get('limit') ?? 4);
		
		if (limit < 0 || isNaN(limit)) {
			const error: ChangesResponse = {
				ok: false,
				error: {
					code: 'BAD_INPUT',
					message: 'limit must be a positive number'
				}
			};
			return new Response(JSON.stringify(error), { 
				status: 400,
				headers: { 'content-type': 'application/json' }
			});
		}

		const data = mockChanges.slice(0, limit);
		const response: ChangesResponse = { ok: true, data };
		
		return new Response(JSON.stringify(response), {
			headers: { 'content-type': 'application/json' }
		});
	} catch (error) {
		const errorResponse: ChangesResponse = {
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
