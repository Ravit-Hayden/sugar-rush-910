import type { RequestHandler } from './$types';
import type { DeadlinesResponse } from '$lib/types/api';

// 목 데이터
const mockDeadlines = [
	{ id: '1', label: 'Sugar Rush Vol.2 발매', d: 'D-3' },
	{ id: '2', label: '앨범 아트워크 마감', d: 'D-1' },
	{ id: '3', label: '트랙 마스터링 완료', d: 'D-5' },
	{ id: '4', label: '프로모션 시작', d: 'D-7' },
	{ id: '5', label: '음원 플랫폼 등록', d: 'D-10' }
];

export const GET: RequestHandler = async ({ url }) => {
	try {
		const limit = Number(url.searchParams.get('limit') ?? 4);
		
		if (limit < 0 || isNaN(limit)) {
			const error: DeadlinesResponse = {
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

		const data = mockDeadlines.slice(0, limit);
		const response: DeadlinesResponse = { ok: true, data };
		
		return new Response(JSON.stringify(response), {
			headers: { 'content-type': 'application/json' }
		});
	} catch (error) {
		const errorResponse: DeadlinesResponse = {
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
