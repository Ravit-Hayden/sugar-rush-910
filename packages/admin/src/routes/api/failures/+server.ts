import type { RequestHandler } from './$types';
import type { FailuresResponse } from '$lib/types/api';

// 목 데이터
const mockFailures = [
	{ id: '1', text: '앨범 업로드 실패', retryable: true },
	{ id: '2', text: '메타데이터 동기화 오류', retryable: true },
	{ id: '3', text: 'CDN 캐시 갱신 실패', retryable: false },
	{ id: '4', text: '이메일 알림 전송 실패', retryable: true },
	{ id: '5', text: '데이터베이스 연결 오류', retryable: true }
];

export const GET: RequestHandler = async ({ url }) => {
	try {
		const limit = Number(url.searchParams.get('limit') ?? 4);
		
		if (limit < 0 || isNaN(limit)) {
			const error: FailuresResponse = {
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

		const data = mockFailures.slice(0, limit);
		const response: FailuresResponse = { ok: true, data };
		
		return new Response(JSON.stringify(response), {
			headers: { 'content-type': 'application/json' }
		});
	} catch (error) {
		const errorResponse: FailuresResponse = {
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
