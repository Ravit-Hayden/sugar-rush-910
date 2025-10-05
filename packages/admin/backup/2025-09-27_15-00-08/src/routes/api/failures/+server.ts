import type { RequestHandler } from './$types';
import type { ApiOk, ApiErr, Failure } from '$lib/types/api';

export const GET: RequestHandler = async ({ platform, url }) => {
	try {
		const limit = Number(url.searchParams.get('limit') ?? 4);
		
		// 목 데이터
		const mockFailures: Failure[] = [
			{ id: '1', text: 'CDN 업로드 실패', retryable: true, status: 'failed' },
			{ id: '2', text: '데이터베이스 연결 오류', retryable: true, status: 'retrying' },
			{ id: '3', text: '권한 검증 실패', retryable: false, status: 'blocked' },
			{ id: '4', text: '파일 압축 오류', retryable: true, status: 'failed' }
		];

		const db = platform?.env?.DB;
		let results: Failure[] = mockFailures;

		if (db) {
			// 실제 D1 데이터베이스 사용
			const { results: dbResults } = await db
				.prepare('SELECT id, text, retryable, status FROM failures ORDER BY created_at DESC LIMIT ?')
				.bind(limit)
				.all();
			results = dbResults as unknown as Failure[];
		}

		const response: ApiOk<Failure[]> = { ok: true, data: results.slice(0, limit) };
		
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
