import type { RequestHandler } from './$types';
import type { ApiOk, ApiErr, Action } from '$lib/types/api';

export const GET: RequestHandler = async ({ platform }) => {
	try {
		// 목 데이터
		const mockActions: Action[] = [
			{ label: '새 앨범', href: '/albums/new' },
			{ label: '새 트랙', href: '/tracks/new' },
			{ label: '파일 업로드', href: '/files/upload' },
			{ label: '수익 관리', href: '/revenue' },
			{ label: '사용자 관리', href: '/users' },
			{ label: '설정', href: '/settings' }
		];

		const db = platform?.env?.DB;
		let results: Action[] = mockActions;

		if (db) {
			// 실제 D1 데이터베이스 사용
			const { results: dbResults } = await db
				.prepare('SELECT label, href FROM actions ORDER BY order_index ASC')
				.all();
			results = dbResults as unknown as Action[];
		}

		const response: ApiOk<Action[]> = { ok: true, data: results };
		
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
