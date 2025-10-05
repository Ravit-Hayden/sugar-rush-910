import type { RequestHandler } from './$types';
import type { ApiOk, ApiErr, Change } from '$lib/types/api';

export const GET: RequestHandler = async ({ platform, url }) => {
	try {
		const limit = Number(url.searchParams.get('limit') ?? 4);
		
		// 목 데이터
		const mockChanges: Change[] = [
			{ id: '1', text: '앨범 메타데이터 업데이트', recent: true, today: true, thisWeek: true, thisMonth: true, time: '2시간 전' },
			{ id: '2', text: '사용자 권한 정책 변경', recent: false, today: false, thisWeek: true, thisMonth: true, time: '1일 전' },
			{ id: '3', text: 'API 엔드포인트 추가', recent: true, today: true, thisWeek: true, thisMonth: true, time: '3시간 전' },
			{ id: '4', text: '데이터베이스 스키마 업데이트', recent: false, today: false, thisWeek: true, thisMonth: true, time: '2일 전' }
		];

		const db = platform?.env?.DB;
		let results: Change[] = mockChanges;

		if (db) {
			// 실제 D1 데이터베이스 사용
			const { results: dbResults } = await db
				.prepare('SELECT id, text, recent, time FROM changes ORDER BY time DESC LIMIT ?')
				.bind(limit)
				.all();
			results = dbResults as unknown as Change[];
		}

		const response: ApiOk<Change[]> = { ok: true, data: results.slice(0, limit) };
		
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
