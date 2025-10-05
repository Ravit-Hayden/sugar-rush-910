import type { RequestHandler } from './$types';
import type { ApiOk, ApiErr } from '$lib/types/api';

export const GET: RequestHandler = async ({ url, platform }) => {
	try {
		const query = url.searchParams.get('q') || '';
		const limit = Number(url.searchParams.get('limit') ?? 10);

		if (!query.trim()) {
			// 검색어가 없을 때 유사항목 추천
			const suggestions: ApiOk<{ id: string; title: string; type: string; href: string }[]> = {
				ok: true,
				data: [
					{ id: '1', title: '새 앨범 만들기', type: 'action', href: '/albums/new' },
					{ id: '2', title: '트랙 업로드', type: 'action', href: '/tracks/new' },
					{ id: '3', title: '오늘 발매 일정', type: 'release', href: '/releases' },
					{ id: '4', title: '시스템 상태', type: 'status', href: '/status' },
					{ id: '5', title: '할 일 목록', type: 'task', href: '/tasks' },
					{ id: '6', title: '수익 관리', type: 'revenue', href: '/revenue' },
					{ id: '7', title: '피드백 센터', type: 'feedback', href: '/feedback' },
					{ id: '8', title: '설정', type: 'settings', href: '/settings' }
				]
			};
			return new Response(JSON.stringify(suggestions), {
				headers: { 'content-type': 'application/json' }
			});
		}

		// 실제 검색 로직 (D1 데이터베이스 사용)
		const db = platform?.env?.DB;
		let results: any[] = [];

		if (db) {
			try {
				// 앨범 검색
				const albums = await db
					.prepare('SELECT id, title, "album" as type FROM albums WHERE title LIKE ? LIMIT ?')
					.bind(`%${query}%`, Math.floor(limit / 3))
					.all();

				// 트랙 검색
				const tracks = await db
					.prepare('SELECT id, title, "track" as type FROM tracks WHERE title LIKE ? LIMIT ?')
					.bind(`%${query}%`, Math.floor(limit / 3))
					.all();

				// 태스크 검색
				const tasks = await db
					.prepare('SELECT id, title, "task" as type FROM tasks WHERE title LIKE ? LIMIT ?')
					.bind(`%${query}%`, Math.floor(limit / 3))
					.all();

				results = [
					...albums.results.map((item: any) => ({ ...item, href: `/albums/${item.id}` })),
					...tracks.results.map((item: any) => ({ ...item, href: `/tracks/${item.id}` })),
					...tasks.results.map((item: any) => ({ ...item, href: `/tasks/${item.id}` }))
				];
			} catch (error) {
				console.error('Database search error:', error);
			}
		}

		// D1이 없거나 오류 시 목 데이터
		if (results.length === 0) {
			results = [
				{ id: '1', title: `"${query}" 검색 결과 1`, type: 'album', href: '/albums/1' },
				{ id: '2', title: `"${query}" 검색 결과 2`, type: 'track', href: '/tracks/1' },
				{ id: '3', title: `"${query}" 검색 결과 3`, type: 'task', href: '/tasks/1' }
			];
		}

		const response: ApiOk<{ id: string; title: string; type: string; href: string }[]> = {
			ok: true,
			data: results.slice(0, limit)
		};

		return new Response(JSON.stringify(response), {
			headers: { 'content-type': 'application/json' }
		});
	} catch (error) {
		const response: ApiErr = {
			ok: false,
			error: {
				code: 'INTERNAL_ERROR',
				message: '검색 중 오류가 발생했습니다.',
				details: error instanceof Error ? error.message : 'Unknown error'
			}
		};

		return new Response(JSON.stringify(response), {
			status: 500,
			headers: { 'content-type': 'application/json' }
		});
	}
};
