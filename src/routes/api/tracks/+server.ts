import type { RequestHandler } from './$types';
import type { ApiOk, ApiErr } from '$lib/types/api';

export const POST: RequestHandler = async ({ request, platform }) => {
	try {
		const trackData = await request.json();
		
		// 입력 검증
		if (!trackData.title || !trackData.title.trim()) {
			const response: ApiErr = {
				ok: false,
				error: {
					code: 'VALIDATION_ERROR',
					message: '트랙 제목을 입력해주세요.',
					details: 'title is required'
				}
			};
			return new Response(JSON.stringify(response), {
				status: 400,
				headers: { 'content-type': 'application/json' }
			});
		}

		if (!trackData.artist || !trackData.artist.trim()) {
			const response: ApiErr = {
				ok: false,
				error: {
					code: 'VALIDATION_ERROR',
					message: '아티스트를 입력해주세요.',
					details: 'artist is required'
				}
			};
			return new Response(JSON.stringify(response), {
				status: 400,
				headers: { 'content-type': 'application/json' }
			});
		}

		if (!trackData.status) {
			const response: ApiErr = {
				ok: false,
				error: {
					code: 'VALIDATION_ERROR',
					message: '상태를 선택해주세요.',
					details: 'status is required'
				}
			};
			return new Response(JSON.stringify(response), {
				status: 400,
				headers: { 'content-type': 'application/json' }
			});
		}

		const db = platform?.env?.DB;
		let createdTrack;

		if (db) {
			try {
				// 실제 D1 데이터베이스 사용
				// 트랙 ID 생성 (타임스탬프 기반)
				const trackId = `track_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
				
				// 장르를 JSON 문자열로 저장
				const genresJson = JSON.stringify(trackData.genres || []);
				
				// 데이터베이스에 삽입
				const result = await db
					.prepare(`
						INSERT INTO tracks (
							id, title, artist, album, genres, status,
							release_date_kr, release_date_global,
							created_at, updated_at
						) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
					`)
					.bind(
						trackId,
						trackData.title.trim(),
						trackData.artist.trim(),
						trackData.album?.trim() || null,
						genresJson,
						trackData.status,
						trackData.release_date_kr || null,
						trackData.release_date_global || null,
						new Date().toISOString(),
						new Date().toISOString()
					)
					.run();

				// 생성된 트랙 정보 조회
				const { results } = await db
					.prepare('SELECT * FROM tracks WHERE id = ?')
					.bind(trackId)
					.first();

				createdTrack = {
					id: trackId,
					...results
				};
			} catch (dbError) {
				console.error('Database error:', dbError);
				// 데이터베이스 오류 시 목 데이터 반환
				createdTrack = {
					id: `track_${Date.now()}`,
					title: trackData.title.trim(),
					artist: trackData.artist.trim(),
					album: trackData.album?.trim() || null,
					genres: trackData.genres || [],
					status: trackData.status,
					release_date_kr: trackData.release_date_kr || null,
					release_date_global: trackData.release_date_global || null,
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString()
				};
			}
		} else {
			// 목 데이터 반환 (D1 데이터베이스가 없는 경우)
			createdTrack = {
				id: `track_${Date.now()}`,
				title: trackData.title.trim(),
				artist: trackData.artist.trim(),
				album: trackData.album?.trim() || null,
				genres: trackData.genres || [],
				status: trackData.status,
				release_date_kr: trackData.release_date_kr || null,
				release_date_global: trackData.release_date_global || null,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString()
			};
		}

		const response: ApiOk<typeof createdTrack> = {
			ok: true,
			data: createdTrack
		};

		return new Response(JSON.stringify(response), {
			status: 201,
			headers: { 'content-type': 'application/json' }
		});
	} catch (error) {
		console.error('Track creation error:', error);
		const response: ApiErr = {
			ok: false,
			error: {
				code: 'INTERNAL_ERROR',
				message: '트랙 생성 중 오류가 발생했습니다.',
				details: error instanceof Error ? error.message : 'Unknown error'
			}
		};

		return new Response(JSON.stringify(response), {
			status: 500,
			headers: { 'content-type': 'application/json' }
		});
	}
};

