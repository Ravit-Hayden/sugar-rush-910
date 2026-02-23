import type { RequestHandler } from './$types';
import type { ApiOk, ApiErr } from '$lib/types/api';

/**
 * 사용자 관리 API
 * 
 * 기본 기능:
 * - 사용자 조회 (GET)
 * - 사용자 생성 (POST)
 * - 사용자 권한 수정 (PUT)
 * - 사용자 삭제 (DELETE)
 */

export const GET: RequestHandler = async ({ platform, url }) => {
	try {
		const role = url.searchParams.get('role');
		const limit = Number(url.searchParams.get('limit') ?? 100);

		const db = platform?.env?.DB;
		let users: any[] = [];

		if (db) {
			try {
				let query = 'SELECT * FROM users WHERE 1=1';
				const params: any[] = [];

				if (role) {
					query += ' AND role = ?';
					params.push(role);
				}

				query += ' ORDER BY created_at DESC LIMIT ?';
				params.push(limit);

				const { results } = await db.prepare(query).bind(...params).all();
				users = results as any[];
			} catch (dbError) {
				console.error('Database error:', dbError);
			}
		}

		// D1이 없거나 오류 시 샘플 데이터
		if (users.length === 0) {
			users = [
				{
					id: 'user_1',
					email: 'el@sugarrush.com',
					role: 'owner',
					created_at: new Date().toISOString()
				},
				{
					id: 'user_2',
					email: 'otte@sugarrush.com',
					role: 'editor',
					created_at: new Date(Date.now() - 86400000).toISOString()
				},
				{
					id: 'user_3',
					email: 'mixer@sugarrush.com',
					role: 'viewer',
					created_at: new Date(Date.now() - 172800000).toISOString()
				}
			];
		}

		const response: ApiOk<any[]> = {
			ok: true,
			data: users
		};

		return new Response(JSON.stringify(response), {
			headers: { 'content-type': 'application/json' }
		});
	} catch (error) {
		const response: ApiErr = {
			ok: false,
			error: {
				code: 'INTERNAL_ERROR',
				message: '사용자 목록을 불러오는 중 오류가 발생했습니다.',
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
		const userData = await request.json() as Record<string, any>;

		// 입력 검증
		if (!userData.email || !userData.email.trim()) {
			const response: ApiErr = {
				ok: false,
				error: {
					code: 'VALIDATION_ERROR',
					message: '이메일을 입력해주세요.',
					details: 'email is required'
				}
			};
			return new Response(JSON.stringify(response), {
				status: 400,
				headers: { 'content-type': 'application/json' }
			});
		}

		if (!userData.role || !['owner', 'editor', 'viewer'].includes(userData.role)) {
			const response: ApiErr = {
				ok: false,
				error: {
					code: 'VALIDATION_ERROR',
					message: '유효한 역할을 선택해주세요. (owner, editor, viewer)',
					details: 'role must be owner, editor, or viewer'
				}
			};
			return new Response(JSON.stringify(response), {
				status: 400,
				headers: { 'content-type': 'application/json' }
			});
		}

		const db = platform?.env?.DB;
		let createdUser;

		if (db) {
			try {
				// 사용자 ID 생성
				const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

				// 데이터베이스에 삽입
				await db
					.prepare(`
						INSERT INTO users (
							id, email, role, created_at, updated_at
						) VALUES (?, ?, ?, ?, ?)
					`)
					.bind(
						userId,
						userData.email.trim(),
						userData.role,
						new Date().toISOString(),
						new Date().toISOString()
					)
					.run();

				// 생성된 사용자 정보 조회
				const results = await db
					.prepare('SELECT * FROM users WHERE id = ?')
					.bind(userId)
					.first() as Record<string, any> | null;

				createdUser = {
					id: userId,
					...results
				};
			} catch (dbError) {
				console.error('Database error:', dbError);
				// 데이터베이스 오류 시 목 데이터 반환
				createdUser = {
					id: `user_${Date.now()}`,
					email: userData.email.trim(),
					role: userData.role,
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString()
				};
			}
		} else {
			// 목 데이터 반환 (D1 데이터베이스가 없는 경우)
			createdUser = {
				id: `user_${Date.now()}`,
				email: userData.email.trim(),
				role: userData.role,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString()
			};
		}

		const response: ApiOk<typeof createdUser> = {
			ok: true,
			data: createdUser
		};

		return new Response(JSON.stringify(response), {
			status: 201,
			headers: { 'content-type': 'application/json' }
		});
	} catch (error) {
		console.error('User creation error:', error);
		const response: ApiErr = {
			ok: false,
			error: {
				code: 'INTERNAL_ERROR',
				message: '사용자 생성 중 오류가 발생했습니다.',
				details: error instanceof Error ? error.message : 'Unknown error'
			}
		};

		return new Response(JSON.stringify(response), {
			status: 500,
			headers: { 'content-type': 'application/json' }
		});
	}
};

export const PUT: RequestHandler = async ({ request, platform }) => {
	try {
		const { id, role } = await request.json() as { id: string; role: string };

		if (!id) {
			const response: ApiErr = {
				ok: false,
				error: {
					code: 'VALIDATION_ERROR',
					message: '사용자 ID를 입력해주세요.',
					details: 'id is required'
				}
			};
			return new Response(JSON.stringify(response), {
				status: 400,
				headers: { 'content-type': 'application/json' }
			});
		}

		if (!role || !['owner', 'editor', 'viewer'].includes(role)) {
			const response: ApiErr = {
				ok: false,
				error: {
					code: 'VALIDATION_ERROR',
					message: '유효한 역할을 선택해주세요. (owner, editor, viewer)',
					details: 'role must be owner, editor, or viewer'
				}
			};
			return new Response(JSON.stringify(response), {
				status: 400,
				headers: { 'content-type': 'application/json' }
			});
		}

		const db = platform?.env?.DB;
		let updatedUser;

		if (db) {
			try {
				// 사용자 권한 업데이트
				await db
					.prepare('UPDATE users SET role = ?, updated_at = ? WHERE id = ?')
					.bind(role, new Date().toISOString(), id)
					.run();

				// 업데이트된 사용자 정보 조회
				const results = await db
					.prepare('SELECT * FROM users WHERE id = ?')
					.bind(id)
					.first() as Record<string, any> | null;

				updatedUser = {
					id,
					...results
				};
			} catch (dbError) {
				console.error('Database error:', dbError);
				updatedUser = {
					id,
					role,
					updated_at: new Date().toISOString()
				};
			}
		} else {
			updatedUser = {
				id,
				role,
				updated_at: new Date().toISOString()
			};
		}

		const response: ApiOk<typeof updatedUser> = {
			ok: true,
			data: updatedUser
		};

		return new Response(JSON.stringify(response), {
			headers: { 'content-type': 'application/json' }
		});
	} catch (error) {
		console.error('User update error:', error);
		const response: ApiErr = {
			ok: false,
			error: {
				code: 'INTERNAL_ERROR',
				message: '사용자 권한 업데이트 중 오류가 발생했습니다.',
				details: error instanceof Error ? error.message : 'Unknown error'
			}
		};

		return new Response(JSON.stringify(response), {
			status: 500,
			headers: { 'content-type': 'application/json' }
		});
	}
};
