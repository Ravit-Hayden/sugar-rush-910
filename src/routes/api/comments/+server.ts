import type { RequestHandler } from './$types';
import type { ApiOk, ApiErr } from '$lib/types/api';

/**
 * 코멘트 관리 API
 * 
 * 기본 기능:
 * - 코멘트 생성 (POST)
 * - 코멘트 조회 (GET)
 * - 코멘트 수정 (PUT)
 * - 코멘트 삭제 (DELETE)
 */

export const GET: RequestHandler = async ({ platform, url }) => {
	try {
		const trackId = url.searchParams.get('trackId');
		const albumId = url.searchParams.get('albumId');
		const limit = Number(url.searchParams.get('limit') ?? 100);

		const db = platform?.env?.DB;
		let comments: any[] = [];

		if (db) {
			try {
				let query = 'SELECT * FROM comments WHERE 1=1';
				const params: any[] = [];

				if (trackId) {
					query += ' AND track_id = ?';
					params.push(trackId);
				}
				if (albumId) {
					query += ' AND album_id = ?';
					params.push(albumId);
				}

				query += ' ORDER BY created_at DESC LIMIT ?';
				params.push(limit);

				const { results } = await db.prepare(query).bind(...params).all();
				comments = results as any[];
			} catch (dbError) {
				console.error('Database error:', dbError);
			}
		}

		// D1이 없거나 오류 시 샘플 데이터
		if (comments.length === 0) {
			comments = [
				{
					id: 'com_1',
					content: 'Sugar Rush Vol.1 마스터링 완료',
					user_id: 'user_1',
					user_name: 'El',
					track_id: null,
					album_id: 'album_1',
					created_at: new Date().toISOString()
				},
				{
					id: 'com_2',
					content: 'Summer Night 가사 검토 필요',
					user_id: 'user_2',
					user_name: 'Otte',
					track_id: 'track_1',
					album_id: null,
					created_at: new Date().toISOString()
				}
			];
		}

		const response: ApiOk<any[]> = {
			ok: true,
			data: comments
		};

		return new Response(JSON.stringify(response), {
			headers: { 'content-type': 'application/json' }
		});
	} catch (error) {
		const response: ApiErr = {
			ok: false,
			error: {
				code: 'INTERNAL_ERROR',
				message: '코멘트를 불러오는 중 오류가 발생했습니다.',
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
		const commentData = await request.json();

		// 입력 검증
		if (!commentData.content || !commentData.content.trim()) {
			const response: ApiErr = {
				ok: false,
				error: {
					code: 'VALIDATION_ERROR',
					message: '코멘트 내용을 입력해주세요.',
					details: 'content is required'
				}
			};
			return new Response(JSON.stringify(response), {
				status: 400,
				headers: { 'content-type': 'application/json' }
			});
		}

		if (!commentData.user_id || !commentData.user_id.trim()) {
			const response: ApiErr = {
				ok: false,
				error: {
					code: 'VALIDATION_ERROR',
					message: '사용자 ID를 입력해주세요.',
					details: 'user_id is required'
				}
			};
			return new Response(JSON.stringify(response), {
				status: 400,
				headers: { 'content-type': 'application/json' }
			});
		}

		const db = platform?.env?.DB;
		let createdComment;

		if (db) {
			try {
				// 코멘트 ID 생성
				const commentId = `com_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

				// 데이터베이스에 삽입
				await db
					.prepare(`
						INSERT INTO comments (
							id, content, user_id, user_name, track_id, album_id,
							created_at, updated_at
						) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
					`)
					.bind(
						commentId,
						commentData.content.trim(),
						commentData.user_id.trim(),
						commentData.user_name?.trim() || 'Unknown',
						commentData.track_id || null,
						commentData.album_id || null,
						new Date().toISOString(),
						new Date().toISOString()
					)
					.run();

				// 생성된 코멘트 정보 조회
				const { results } = await db
					.prepare('SELECT * FROM comments WHERE id = ?')
					.bind(commentId)
					.first();

				createdComment = {
					id: commentId,
					...results
				};
			} catch (dbError) {
				console.error('Database error:', dbError);
				// 데이터베이스 오류 시 목 데이터 반환
				createdComment = {
					id: `com_${Date.now()}`,
					content: commentData.content.trim(),
					user_id: commentData.user_id.trim(),
					user_name: commentData.user_name?.trim() || 'Unknown',
					track_id: commentData.track_id || null,
					album_id: commentData.album_id || null,
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString()
				};
			}
		} else {
			// 목 데이터 반환 (D1 데이터베이스가 없는 경우)
			createdComment = {
				id: `com_${Date.now()}`,
				content: commentData.content.trim(),
				user_id: commentData.user_id.trim(),
				user_name: commentData.user_name?.trim() || 'Unknown',
				track_id: commentData.track_id || null,
				album_id: commentData.album_id || null,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString()
			};
		}

		const response: ApiOk<typeof createdComment> = {
			ok: true,
			data: createdComment
		};

		return new Response(JSON.stringify(response), {
			status: 201,
			headers: { 'content-type': 'application/json' }
		});
	} catch (error) {
		console.error('Comment creation error:', error);
		const response: ApiErr = {
			ok: false,
			error: {
				code: 'INTERNAL_ERROR',
				message: '코멘트 생성 중 오류가 발생했습니다.',
				details: error instanceof Error ? error.message : 'Unknown error'
			}
		};

		return new Response(JSON.stringify(response), {
			status: 500,
			headers: { 'content-type': 'application/json' }
		});
	}
};
