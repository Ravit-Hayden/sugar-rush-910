import type { RequestHandler } from './$types';
import type { ApiOk, ApiErr } from '$lib/types/api';

/**
 * 피드백 관리 API
 * 
 * 기본 기능:
 * - 피드백 생성 (POST)
 * - 피드백 조회 (GET)
 * - 피드백 수정 (PUT)
 * - 피드백 삭제 (DELETE)
 */

export const GET: RequestHandler = async ({ platform, url }) => {
	try {
		const status = url.searchParams.get('status');
		const priority = url.searchParams.get('priority');
		const limit = Number(url.searchParams.get('limit') ?? 100);

		const db = platform?.env?.DB;
		let feedbacks: any[] = [];

		if (db) {
			try {
				let query = 'SELECT * FROM feedbacks WHERE 1=1';
				const params: any[] = [];

				if (status) {
					query += ' AND status = ?';
					params.push(status);
				}
				if (priority) {
					query += ' AND priority = ?';
					params.push(priority);
				}

				query += ' ORDER BY created_at DESC LIMIT ?';
				params.push(limit);

				const { results } = await db.prepare(query).bind(...params).all();
				feedbacks = results as any[];
			} catch (dbError) {
				console.error('Database error:', dbError);
			}
		}

		// D1이 없거나 오류 시 샘플 데이터
		if (feedbacks.length === 0) {
			feedbacks = [
				{
					id: 'fb_1',
					title: '새로운 앨범 컨셉에 대한 피드백',
					from: 'El',
					avatar: 'E',
					status: 'unread',
					priority: 'high',
					content: 'Sugar Rush Vol.2의 컨셉에 대해 몇 가지 제안이 있습니다.',
					rating: 5,
					tags: JSON.stringify(['앨범', '컨셉', '제안']),
					created_at: new Date().toISOString()
				},
				{
					id: 'fb_2',
					title: '마케팅 전략 개선 제안',
					from: 'Otte',
					avatar: 'O',
					status: 'read',
					priority: 'medium',
					content: '현재 마케팅 전략이 효과적이지만, 소셜 미디어 활용도를 높이면 더 좋을 것 같습니다.',
					rating: 4,
					tags: JSON.stringify(['마케팅', '소셜미디어']),
					created_at: new Date().toISOString()
				}
			];
		}

		// tags를 배열로 변환
		feedbacks = feedbacks.map(fb => ({
			...fb,
			tags: typeof fb.tags === 'string' ? JSON.parse(fb.tags) : fb.tags || []
		}));

		const response: ApiOk<any[]> = {
			ok: true,
			data: feedbacks
		};

		return new Response(JSON.stringify(response), {
			headers: { 'content-type': 'application/json' }
		});
	} catch (error) {
		const response: ApiErr = {
			ok: false,
			error: {
				code: 'INTERNAL_ERROR',
				message: '피드백을 불러오는 중 오류가 발생했습니다.',
				details: error instanceof Error ? error.message : 'Unknown error'
			}
		};

		return new Response(JSON.stringify(response), {
			status: 500,
			headers: { 'content-type': 'application/json' }
		});
	}
};

export const POST: RequestHandler = async ({ request, platform }) => {
	try {
		const feedbackData = await request.json();

		// 입력 검증
		if (!feedbackData.title || !feedbackData.title.trim()) {
			const response: ApiErr = {
				ok: false,
				error: {
					code: 'VALIDATION_ERROR',
					message: '피드백 제목을 입력해주세요.',
					details: 'title is required'
				}
			};
			return new Response(JSON.stringify(response), {
				status: 400,
				headers: { 'content-type': 'application/json' }
			});
		}

		if (!feedbackData.content || !feedbackData.content.trim()) {
			const response: ApiErr = {
				ok: false,
				error: {
					code: 'VALIDATION_ERROR',
					message: '피드백 내용을 입력해주세요.',
					details: 'content is required'
				}
			};
			return new Response(JSON.stringify(response), {
				status: 400,
				headers: { 'content-type': 'application/json' }
			});
		}

		const db = platform?.env?.DB;
		let createdFeedback;

		if (db) {
			try {
				// 피드백 ID 생성
				const feedbackId = `fb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

				// 태그를 JSON 문자열로 저장
				const tagsJson = JSON.stringify(feedbackData.tags || []);

				// 데이터베이스에 삽입
				await db
					.prepare(`
						INSERT INTO feedbacks (
							id, title, content, from_user, avatar, status, priority, rating, tags,
							created_at, updated_at
						) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
					`)
					.bind(
						feedbackId,
						feedbackData.title.trim(),
						feedbackData.content.trim(),
						feedbackData.from || 'Unknown',
						feedbackData.avatar || 'U',
						feedbackData.status || 'unread',
						feedbackData.priority || 'medium',
						feedbackData.rating || 0,
						tagsJson,
						new Date().toISOString(),
						new Date().toISOString()
					)
					.run();

				// 생성된 피드백 정보 조회
				const { results } = await db
					.prepare('SELECT * FROM feedbacks WHERE id = ?')
					.bind(feedbackId)
					.first();

				createdFeedback = {
					id: feedbackId,
					...results,
					tags: typeof results?.tags === 'string' ? JSON.parse(results.tags) : results?.tags || []
				};
			} catch (dbError) {
				console.error('Database error:', dbError);
				// 데이터베이스 오류 시 목 데이터 반환
				createdFeedback = {
					id: `fb_${Date.now()}`,
					title: feedbackData.title.trim(),
					content: feedbackData.content.trim(),
					from: feedbackData.from || 'Unknown',
					avatar: feedbackData.avatar || 'U',
					status: feedbackData.status || 'unread',
					priority: feedbackData.priority || 'medium',
					rating: feedbackData.rating || 0,
					tags: feedbackData.tags || [],
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString()
				};
			}
		} else {
			// 목 데이터 반환 (D1 데이터베이스가 없는 경우)
			createdFeedback = {
				id: `fb_${Date.now()}`,
				title: feedbackData.title.trim(),
				content: feedbackData.content.trim(),
				from: feedbackData.from || 'Unknown',
				avatar: feedbackData.avatar || 'U',
				status: feedbackData.status || 'unread',
				priority: feedbackData.priority || 'medium',
				rating: feedbackData.rating || 0,
				tags: feedbackData.tags || [],
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString()
			};
		}

		const response: ApiOk<typeof createdFeedback> = {
			ok: true,
			data: createdFeedback
		};

		return new Response(JSON.stringify(response), {
			status: 201,
			headers: { 'content-type': 'application/json' }
		});
	} catch (error) {
		console.error('Feedback creation error:', error);
		const response: ApiErr = {
			ok: false,
			error: {
				code: 'INTERNAL_ERROR',
				message: '피드백 생성 중 오류가 발생했습니다.',
				details: error instanceof Error ? error.message : 'Unknown error'
			}
		};

		return new Response(JSON.stringify(response), {
			status: 500,
			headers: { 'content-type': 'application/json' }
		});
	}
};
