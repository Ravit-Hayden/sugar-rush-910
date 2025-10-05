import type { RequestHandler } from './$types';
import type { ApiOk, ApiErr, Deadline } from '$lib/types/api';

export const GET: RequestHandler = async ({ platform, url }) => {
	try {
		const limit = Number(url.searchParams.get('limit') ?? 4);
		
		// 목 데이터
		const mockDeadlines: Deadline[] = [
			{ id: '1', label: 'Sugar Rush Vol.1 발매', days: 3, week: true, urgent: true, scheduled: true },
			{ id: '2', label: '마케팅 캠페인 마감', days: 7, week: true, urgent: false, scheduled: false },
			{ id: '3', label: '음원 플랫폼 업로드', days: 1, week: false, urgent: true, scheduled: true },
			{ id: '4', label: '프레스 릴리스 발송', days: 5, week: true, urgent: false, scheduled: true }
		];

		const db = platform?.env?.DB;
		let results: Deadline[] = mockDeadlines;

		if (db) {
			// 실제 D1 데이터베이스 사용
			const { results: dbResults } = await db
				.prepare('SELECT id, label, days, week, urgent, scheduled FROM deadlines ORDER BY days ASC LIMIT ?')
				.bind(limit)
				.all();
			results = dbResults as unknown as Deadline[];
		}

		const response: ApiOk<Deadline[]> = { ok: true, data: results.slice(0, limit) };
		
		return new Response(JSON.stringify(response), {
			headers: { 'content-type': 'application/json' }
		});
	} catch (error) {
		const response: ApiErr = { 
			ok: false, 
			error: { 
				code: 'INTERNAL_ERROR', 
				message: '서버 오류가 발생했습니다.',
				details: error instanceof Error ? error.message : 'Unknown error'
			} 
		};
		
		return new Response(JSON.stringify(response), { 
			status: 500,
			headers: { 'content-type': 'application/json' }
		});
	}
};
