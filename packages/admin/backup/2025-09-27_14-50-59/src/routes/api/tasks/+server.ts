import type { RequestHandler } from './$types';
import type { ApiOk, ApiErr, Task } from '$lib/types/api';

export const GET: RequestHandler = async ({ platform, url }) => {
	try {
		const limit = Number(url.searchParams.get('limit') ?? 4);
		
		// D1 데이터베이스가 없을 때 목 데이터 반환
		const mockTasks: Task[] = [
			{ id: '1', title: '앨범 커버 디자인 검토', priority: true, due: 'today', completed: false, overdue: false },
			{ id: '2', title: '트랙 마스터링 완료', priority: false, due: 'tomorrow', completed: false, overdue: false },
			{ id: '3', title: '발매 일정 확정', priority: true, due: 'yesterday', completed: false, overdue: true },
			{ id: '4', title: '마케팅 자료 준비', priority: false, due: 'next-week', completed: false, overdue: false }
		];

		const db = platform?.env?.DB;
		let results: Task[] = mockTasks;

		if (db) {
			try {
				// 실제 D1 데이터베이스 사용
				const { results: dbResults } = await db
					.prepare('SELECT id, title, priority, due FROM tasks WHERE completed = 0 ORDER BY priority DESC, due ASC LIMIT ?')
					.bind(limit)
					.all();
				results = dbResults as unknown as Task[];
			} catch (dbError) {
				// 데이터베이스 오류 시 목 데이터 사용
				console.warn('Database error, using mock data:', dbError);
			}
		}

		const response: ApiOk<Task[]> = { ok: true, data: results.slice(0, limit) };
		
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