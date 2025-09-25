import type { RequestHandler } from './$types';
import type { TasksResponse } from '$lib/types/api';

// 목 데이터
const mockTasks = [
	{ id: '1', title: '앨범 아트워크 검토', priority: true, due: '오늘' },
	{ id: '2', title: '트랙 메타데이터 수정', priority: false, due: '내일' },
	{ id: '3', title: '발매 일정 확인', priority: true, due: '3일 후' },
	{ id: '4', title: '수익 정산 검토', priority: false, due: '1주일 후' },
	{ id: '5', title: '새 앨범 업로드', priority: false, due: '2주일 후' }
];

export const GET: RequestHandler = async ({ url }) => {
	try {
		const limit = Number(url.searchParams.get('limit') ?? 4);
		
		if (limit < 0 || isNaN(limit)) {
			const error: TasksResponse = {
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

		const data = mockTasks.slice(0, limit);
		const response: TasksResponse = { ok: true, data };
		
		return new Response(JSON.stringify(response), {
			headers: { 'content-type': 'application/json' }
		});
	} catch (error) {
		const errorResponse: TasksResponse = {
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
