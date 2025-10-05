import type { RequestHandler } from './$types';
import type { ApiOk, ApiErr, StatusItem } from '$lib/types/api';

export const GET: RequestHandler = async ({ platform }) => {
	try {
		// 목 데이터
		const mockStatus: StatusItem[] = [
			{ key: 'API 서버', value: 'OK' },
			{ key: '데이터베이스', value: 'OK' },
			{ key: 'CDN', value: 'Warning' },
			{ key: '이메일 서비스', value: 'OK' },
			{ key: '파일 스토리지', value: 'OK' },
			{ key: '모니터링', value: 'OK' }
		];

		const db = platform?.env?.DB;
		let results: StatusItem[] = mockStatus;

		if (db) {
			try {
				// 실제 D1 데이터베이스 사용
				const { results: dbResults } = await db
					.prepare('SELECT key, value FROM metrics ORDER BY key ASC')
					.all();
				results = dbResults as unknown as StatusItem[];
			} catch (dbError) {
				// 데이터베이스 오류 시 목 데이터 사용
				console.warn('Database error, using mock data:', dbError);
			}
		}

		const response: ApiOk<StatusItem[]> = { ok: true, data: results };
		
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
