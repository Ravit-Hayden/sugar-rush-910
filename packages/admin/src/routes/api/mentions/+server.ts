import type { RequestHandler } from './$types';
import type { MentionsResponse } from '$lib/types/api';

// 목 데이터
const mockMentions = [
	{ id: '1', text: '@El 앨범 검토 부탁드립니다', from: 'Otte', ts: Date.now() - 3600000 },
	{ id: '2', text: '@Otte 트랙 수정 완료했습니다', from: 'El', ts: Date.now() - 7200000 },
	{ id: '3', text: '@El 발매 일정 확인해주세요', from: 'Otte', ts: Date.now() - 10800000 },
	{ id: '4', text: '@Otte 수익 정산 검토 요청', from: 'El', ts: Date.now() - 14400000 }
];

export const GET: RequestHandler = async ({ url }) => {
	try {
		const limit = Number(url.searchParams.get('limit') ?? 4);
		
		if (limit < 0 || isNaN(limit)) {
			const error: MentionsResponse = {
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

		const data = mockMentions.slice(0, limit);
		const response: MentionsResponse = { ok: true, data };
		
		return new Response(JSON.stringify(response), {
			headers: { 'content-type': 'application/json' }
		});
	} catch (error) {
		const errorResponse: MentionsResponse = {
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
