import type { RequestHandler } from './$types';
import type { ApiOk, ApiErr, KpiData } from '$lib/types/api';

export const GET: RequestHandler = async ({ platform, url }) => {
	try {
		const range = url.searchParams.get('range') ?? '7d';
		
		// 목 데이터
		const mockKpi: KpiData[] = [
			{ 
				name: '수익', 
				points: [
					{ x: 1, y: 100000 }, { x: 2, y: 150000 }, { x: 3, y: 120000 }, 
					{ x: 4, y: 180000 }, { x: 5, y: 200000 }, { x: 6, y: 220000 }, { x: 7, y: 245000 }
				] 
			},
			{ 
				name: '발매', 
				points: [
					{ x: 1, y: 2 }, { x: 2, y: 3 }, { x: 3, y: 1 }, 
					{ x: 4, y: 4 }, { x: 5, y: 5 }, { x: 6, y: 6 }, { x: 7, y: 8 }
				] 
			},
			{ 
				name: '사용자', 
				points: [
					{ x: 1, y: 50 }, { x: 2, y: 65 }, { x: 3, y: 70 }, 
					{ x: 4, y: 80 }, { x: 5, y: 85 }, { x: 6, y: 90 }, { x: 7, y: 95 }
				] 
			}
		];

		const db = platform?.env?.DB;
		let results: KpiData[] = mockKpi;

		if (db) {
			// 실제 D1 데이터베이스 사용
			// const days = range === '30d' ? 30 : 7;
			const { results: dbResults } = await db
				.prepare('SELECT name, points FROM kpi WHERE range = ? ORDER BY name ASC')
				.bind(range)
				.all();
			results = dbResults as unknown as KpiData[];
		}

		const response: ApiOk<{ series: KpiData[] }> = { ok: true, data: { series: results } };
		
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
