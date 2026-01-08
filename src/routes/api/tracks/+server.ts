import type { RequestHandler } from './$types';
import type { ApiOk, ApiErr } from '$lib/types/api';

export const GET: RequestHandler = async ({ platform, url }) => {
	try {
		const query = url.searchParams.get('q') || '';
		const titleQuery = url.searchParams.get('title') || ''; // 특정 트랙 조회용
		const limit = Number(url.searchParams.get('limit') ?? 50);

		const db = platform?.env?.DB;
		let tracksData: Array<{ title: string; duration?: string }> = [];

		if (db) {
			try {
				let statement;
				if (titleQuery) {
					// 특정 트랙의 상세 정보 조회 (duration 포함)
					statement = db.prepare('SELECT title, duration FROM tracks WHERE title = ? LIMIT 1').bind(titleQuery);
				} else {
					// 트랙 목록 조회 (제목만)
					statement = db.prepare('SELECT DISTINCT title FROM tracks WHERE title LIKE ? ORDER BY title ASC LIMIT ?').bind(`%${query}%`, limit);
				}
				
				const { results } = await statement.all();
				
				if (titleQuery) {
					// 특정 트랙 조회 시 duration 포함
					tracksData = (results as any[]).map((r: any) => ({ title: r.title, duration: r.duration }));
				} else {
					// 목록 조회 시 제목만
					tracksData = (results as any[]).map((r: any) => ({ title: r.title }));
				}
			} catch (dbError) {
				console.error('Database error:', dbError);
			}
		}

		// D1이 없거나 오류 시 샘플 데이터
		if (tracksData.length === 0) {
			const sampleTracks = [
				{ title: 'Demo Track 1', duration: '03:45' },
				{ title: 'Demo Track 2', duration: '04:12' },
				{ title: 'Work Track 1', duration: '03:30' },
				{ title: 'Review Track 1', duration: '03:20' },
				{ title: 'Complete Track 1', duration: '03:50' },
				{ title: 'Approved Track 1', duration: '03:45' },
				{ title: 'Scheduled Track 1', duration: '03:35' }
			];
			
			if (titleQuery) {
				// 특정 트랙 조회
				tracksData = sampleTracks.filter(t => t.title.toLowerCase() === titleQuery.toLowerCase());
			} else {
				// 목록 조회
				tracksData = sampleTracks
					.filter(t => t.title.toLowerCase().includes(query.toLowerCase()))
					.map(t => ({ title: t.title })); // 목록 조회 시에는 제목만
			}
		}

		const response: ApiOk<Array<{ title: string; duration?: string }> | string[]> = {
			ok: true,
			data: titleQuery ? tracksData : tracksData.map(t => t.title).slice(0, limit)
		};

		return new Response(JSON.stringify(response), {
			headers: { 'content-type': 'application/json' }
		});
	} catch (error) {
		const response: ApiErr = {
			ok: false,
			error: {
				code: 'INTERNAL_ERROR',
				message: '트랙 목록을 불러오는 중 오류가 발생했습니다.',
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
							release_date_kr, release_date_global, audio_file_url,
							created_at, updated_at
						) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
						trackData.audio_file_url || null,
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
					audio_file_url: trackData.audio_file_url || null,
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
				audio_file_url: trackData.audio_file_url || null,
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

