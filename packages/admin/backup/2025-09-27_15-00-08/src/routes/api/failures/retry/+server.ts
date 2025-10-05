import type { RequestHandler } from './$types';
import type { ApiOk, ApiErr } from '$lib/types/api';

export const POST: RequestHandler = async ({ request, platform }) => {
	try {
		const body = await request.json().catch(() => ({})) as { id?: string };
		
		if (!body.id) {
			const response: ApiErr = { 
				ok: false, 
				error: { 
					code: 'BAD_INPUT', 
					message: 'id가 필요합니다.' 
				} 
			};
			return new Response(JSON.stringify(response), { status: 400 });
		}

		const db = platform?.env?.DB;
		
		if (db) {
			// 실제 D1 데이터베이스 사용
			await db.prepare('UPDATE failures SET status=? WHERE id=?').bind('queued', body.id).run();
		}

		const response: ApiOk<{ id: string; status: 'queued' }> = { 
			ok: true, 
			data: { id: body.id, status: 'queued' } 
		};
		
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

