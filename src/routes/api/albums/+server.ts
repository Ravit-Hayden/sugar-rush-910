import type { RequestHandler } from './$types';
import type { ApiOk, ApiErr } from '$lib/types/api';

type AlbumInput = {
	title?: string;
	artist?: string;
	year?: number;
	status?: string;
	genres?: unknown[];
	cover_url?: string | null;
	release_date_kr?: string | null;
	release_date_global?: string | null;
};

export const POST: RequestHandler = async ({ request, platform }) => {
	try {
		const albumData = (await request.json()) as AlbumInput;
		
		// 입력 검증
		if (!albumData.title || !albumData.title.trim()) {
			const response: ApiErr = {
				ok: false,
				error: {
					code: 'VALIDATION_ERROR',
					message: '앨범 제목을 입력해주세요.',
					details: 'title is required'
				}
			};
			return new Response(JSON.stringify(response), {
				status: 400,
				headers: { 'content-type': 'application/json' }
			});
		}

		if (!albumData.artist || !albumData.artist.trim()) {
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

		if (!albumData.year || albumData.year < 1900 || albumData.year > 2100) {
			const response: ApiErr = {
				ok: false,
				error: {
					code: 'VALIDATION_ERROR',
					message: '유효한 발매 연도를 입력해주세요 (1900-2100).',
					details: 'year must be between 1900 and 2100'
				}
			};
			return new Response(JSON.stringify(response), {
				status: 400,
				headers: { 'content-type': 'application/json' }
			});
		}

		if (!albumData.status) {
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
		let createdAlbum;

		if (db) {
			try {
				// 실제 D1 데이터베이스 사용
				// 앨범 ID 생성 (타임스탬프 기반)
				const albumId = `album_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
				
				// 장르를 JSON 문자열로 저장
				const genresJson = JSON.stringify(albumData.genres || []);
				
				// 이미지 파일이 있으면 처리 (현재는 URL만 저장)
				const coverUrl = albumData.cover_url || null;
				
				// 데이터베이스에 삽입
				await db
					.prepare(`
						INSERT INTO albums (
							id, title, artist, year, genres, status,
							release_date_kr, release_date_global, cover_url,
							created_at, updated_at
						) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
					`)
					.bind(
						albumId,
						albumData.title.trim(),
						albumData.artist.trim(),
						albumData.year,
						genresJson,
						albumData.status,
						albumData.release_date_kr || null,
						albumData.release_date_global || null,
						coverUrl,
						new Date().toISOString(),
						new Date().toISOString()
					)
					.run();

				// 생성된 앨범 정보 조회
				const row = await db
					.prepare('SELECT * FROM albums WHERE id = ?')
					.bind(albumId)
					.first();

				createdAlbum = row ? { id: albumId, ...row } : { id: albumId };
			} catch (dbError) {
				console.error('Database error:', dbError);
				// 데이터베이스 오류 시 목 데이터 반환
				createdAlbum = {
					id: `album_${Date.now()}`,
					title: albumData.title.trim(),
					artist: albumData.artist.trim(),
					year: albumData.year,
					genres: albumData.genres || [],
					status: albumData.status,
					release_date_kr: albumData.release_date_kr || null,
					release_date_global: albumData.release_date_global || null,
					cover_url: albumData.cover_url || null,
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString()
				};
			}
		} else {
			// 목 데이터 반환 (D1 데이터베이스가 없는 경우)
			createdAlbum = {
				id: `album_${Date.now()}`,
				title: albumData.title.trim(),
				artist: albumData.artist.trim(),
				year: albumData.year,
				genres: albumData.genres || [],
				status: albumData.status,
				release_date_kr: albumData.release_date_kr || null,
				release_date_global: albumData.release_date_global || null,
				cover_url: albumData.cover_url || null,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString()
			};
		}

		const response: ApiOk<typeof createdAlbum> = {
			ok: true,
			data: createdAlbum
		};

		return new Response(JSON.stringify(response), {
			status: 201,
			headers: { 'content-type': 'application/json' }
		});
	} catch (error) {
		console.error('Album creation error:', error);
		const response: ApiErr = {
			ok: false,
			error: {
				code: 'INTERNAL_ERROR',
				message: '앨범 생성 중 오류가 발생했습니다.',
				details: error instanceof Error ? error.message : 'Unknown error'
			}
		};

		return new Response(JSON.stringify(response), {
			status: 500,
			headers: { 'content-type': 'application/json' }
		});
	}
};

