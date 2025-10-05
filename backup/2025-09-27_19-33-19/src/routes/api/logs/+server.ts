import type { RequestHandler } from './$types';
import type { ApiOk, ApiErr, Log } from '$lib/types/api';

export const GET: RequestHandler = async ({ platform, url }) => {
	try {
		const limit = Number(url.searchParams.get('limit') ?? 4);
		
		// 목 데이터
		const mockLogs: Log[] = [
			{ id: '1', text: '사용자 로그인: El', time: '10분 전' },
			{ id: '2', text: '앨범 업로드 완료: Sugar Rush Vol.1', time: '1시간 전' },
			{ id: '3', text: '시스템 백업 완료', time: '2시간 전' },
			{ id: '4', text: '데이터베이스 최적화 완료', time: '3시간 전' }
		];

		const db = platform?.env?.DB;
		let results: Log[] = mockLogs;

		if (db) {
			// 실제 D1 데이터베이스 사용
			const { results: dbResults } = await db
				.prepare('SELECT id, text, ts FROM logs ORDER BY ts DESC LIMIT ?')
				.bind(limit)
				.all();
			results = dbResults as unknown as Log[];
		}

		const response: ApiOk<Log[]> = { ok: true, data: results.slice(0, limit) };
		
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
