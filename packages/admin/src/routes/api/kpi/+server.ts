import type { RequestHandler } from './$types';
import type { KpiResponse } from '$lib/types/api';

// 목 데이터 - KPI 그래프 데이터
const mockKpiData = {
	series: [
		{
			name: '수익',
			points: [
				{ x: 1, y: 1000000 },
				{ x: 2, y: 1100000 },
				{ x: 3, y: 1200000 },
				{ x: 4, y: 1250000 },
				{ x: 5, y: 1300000 },
				{ x: 6, y: 1280000 },
				{ x: 7, y: 1250000 }
			]
		},
		{
			name: '다운로드',
			points: [
				{ x: 1, y: 40000 },
				{ x: 2, y: 42000 },
				{ x: 3, y: 45000 },
				{ x: 4, y: 48000 },
				{ x: 5, y: 46000 },
				{ x: 6, y: 47000 },
				{ x: 7, y: 45000 }
			]
		},
		{
			name: '앨범',
			points: [
				{ x: 1, y: 6 },
				{ x: 2, y: 6 },
				{ x: 3, y: 7 },
				{ x: 4, y: 7 },
				{ x: 5, y: 8 },
				{ x: 6, y: 8 },
				{ x: 7, y: 8 }
			]
		},
		{
			name: '사용자',
			points: [
				{ x: 1, y: 1000 },
				{ x: 2, y: 1050 },
				{ x: 3, y: 1100 },
				{ x: 4, y: 1150 },
				{ x: 5, y: 1200 },
				{ x: 6, y: 1220 },
				{ x: 7, y: 1250 }
			]
		}
	]
};

export const GET: RequestHandler = async ({ url }) => {
	try {
		const range = url.searchParams.get('range') ?? '7d';
		
		if (!['7d', '30d'].includes(range)) {
			const error: KpiResponse = {
				ok: false,
				error: {
					code: 'BAD_INPUT',
					message: 'range must be 7d or 30d'
				}
			};
			return new Response(JSON.stringify(error), { 
				status: 400,
				headers: { 'content-type': 'application/json' }
			});
		}

		// range에 따라 데이터 조정 (현재는 7d만 구현)
		const data = range === '7d' ? mockKpiData : mockKpiData; // 30d는 동일하게 사용
		const response: KpiResponse = { ok: true, data };
		
		return new Response(JSON.stringify(response), {
			headers: { 'content-type': 'application/json' }
		});
	} catch (error) {
		const errorResponse: KpiResponse = {
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
