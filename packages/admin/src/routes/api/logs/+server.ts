import type { RequestHandler } from './$types';
import type { LogsResponse } from '$lib/types/api';

// 목 데이터
const mockLogs = [
	{ id: '1', text: '앨범 업로드 완료', ts: Date.now() - 1800000 },
	{ id: '2', text: '사용자 로그인', ts: Date.now() - 3600000 },
	{ id: '3', text: 'CDN 캐시 갱신 실패', ts: Date.now() - 5400000 },
	{ id: '4', text: '데이터베이스 백업 완료', ts: Date.now() - 7200000 },
	{ id: '5', text: '이메일 알림 전송', ts: Date.now() - 9000000 },
	{ id: '6', text: '시스템 점검 완료', ts: Date.now() - 10800000 }
];

export const GET: RequestHandler = async ({ url }) => {
	try {
		const limit = Number(url.searchParams.get('limit') ?? 4);
		
		if (limit < 0 || isNaN(limit)) {
			const error: LogsResponse = {
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

		const data = mockLogs.slice(0, limit);
		const response: LogsResponse = { ok: true, data };
		
		return new Response(JSON.stringify(response), {
			headers: { 'content-type': 'application/json' }
		});
	} catch (error) {
		const errorResponse: LogsResponse = {
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
