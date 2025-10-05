import type { RequestHandler } from './$types';
import type { ApiOk, ApiErr, Release } from '$lib/types/api';

export const GET: RequestHandler = async ({ platform, url }) => {
	try {
		const limit = Number(url.searchParams.get('limit') ?? 4);
		
		// 목 데이터
		const mockReleases: Release[] = [
			{ id: '1', title: 'Sugar Rush Vol.1', when: '14:00' },
			{ id: '2', title: 'Single: Summer Night', when: '18:00' },
			{ id: '3', title: 'Remix Collection', when: '20:00' },
			{ id: '4', title: 'Live Album', when: '22:00' }
		];

		const db = platform?.env?.DB;
		let results: Release[] = mockReleases;

		if (db) {
			// 실제 D1 데이터베이스 사용
			const { results: dbResults } = await db
				.prepare('SELECT id, title, when FROM releases WHERE DATE(when) = DATE("now") ORDER BY when ASC LIMIT ?')
				.bind(limit)
				.all();
			results = dbResults as unknown as Release[];
		}

		const response: ApiOk<Release[]> = { ok: true, data: results.slice(0, limit) };
		
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
