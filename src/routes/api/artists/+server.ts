import type { RequestHandler } from './$types';
import type { ApiOk, ApiErr } from '$lib/types/api';

export interface Artist {
	id: string;
	name: string;
	description?: string;
	photo_url?: string;
	website?: string;
	email?: string;
	instagram?: string;
	twitter?: string;
	youtube?: string;
	genre?: string;
	debut_date?: string;
	agency?: string;
	country?: string;
	created_at: string;
	updated_at: string;
}

// GET: 모든 아티스트 조회
export const GET: RequestHandler = async ({ platform }) => {
	try {
		const db = platform?.env?.DB;
		
		if (!db) {
			// DB가 없으면 샘플 데이터 반환 (개발 환경용)
			const sampleArtists: Artist[] = [
				{
					id: 'artist_sugar-rush_sample',
					name: 'Sugar Rush',
					description: 'Sugar Rush 910 프로젝트의 메인 아티스트. 팝과 일렉트로닉을 결합한 독특한 사운드로 많은 사랑을 받고 있습니다. 감성적인 멜로디와 강렬한 비트의 조화로 독보적인 음악 세계를 구축하고 있습니다.',
					photo_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
					website: 'https://sugarrush.com',
					email: 'contact@sugarrush.com',
					instagram: 'https://instagram.com/sugarrush',
					twitter: 'https://twitter.com/sugarrush',
					youtube: 'https://youtube.com/@sugarrush',
					genre: 'Pop, Electronic',
					debut_date: '2020-01-15',
					agency: 'Sugar Rush Entertainment',
					country: '대한민국',
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString()
				},
				{
					id: 'artist_various_sample',
					name: 'Various',
					description: '다양한 아티스트들의 협업 프로젝트를 위한 공통 아티스트입니다. 여러 아티스트가 함께 작업한 트랙이나 컴필레이션 앨범에 사용됩니다.',
					photo_url: undefined,
					website: undefined,
					email: undefined,
					instagram: undefined,
					twitter: undefined,
					youtube: undefined,
					genre: undefined,
					debut_date: undefined,
					agency: undefined,
					country: undefined,
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString()
				}
			];
			
			const response: ApiOk<Artist[]> = {
				ok: true,
				data: sampleArtists
			};
			return new Response(JSON.stringify(response), {
				status: 200,
				headers: { 'content-type': 'application/json' }
			});
		}

		let artists: Artist[] = [];
		
		try {
			const { results } = await db
				.prepare('SELECT * FROM artists ORDER BY name ASC')
				.all();

			artists = (results || []).map((row: any) => ({
				id: row.id,
				name: row.name,
				description: row.description || undefined,
				photo_url: row.photo_url || undefined,
				website: row.website || undefined,
				email: row.email || undefined,
				instagram: row.instagram || undefined,
				twitter: row.twitter || undefined,
				youtube: row.youtube || undefined,
				genre: row.genre || undefined,
				debut_date: row.debut_date || undefined,
				agency: row.agency || undefined,
				country: row.country || undefined,
				created_at: row.created_at,
				updated_at: row.updated_at
			}));
		} catch (dbError) {
			console.error('Database query error:', dbError);
			// DB 쿼리 실패 시 빈 배열로 계속 진행 (샘플 데이터 반환)
		}

		// DB에 데이터가 없거나 쿼리 실패 시 샘플 데이터 반환 (개발 환경용)
		if (artists.length === 0) {
			artists = [
				{
					id: 'artist_sugar-rush_sample',
					name: 'Sugar Rush',
					description: 'Sugar Rush 910 프로젝트의 메인 아티스트. 팝과 일렉트로닉을 결합한 독특한 사운드로 많은 사랑을 받고 있습니다. 감성적인 멜로디와 강렬한 비트의 조화로 독보적인 음악 세계를 구축하고 있습니다.',
					photo_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
					website: 'https://sugarrush.com',
					email: 'contact@sugarrush.com',
					instagram: 'https://instagram.com/sugarrush',
					twitter: 'https://twitter.com/sugarrush',
					youtube: 'https://youtube.com/@sugarrush',
					genre: 'Pop, Electronic',
					debut_date: '2020-01-15',
					agency: 'Sugar Rush Entertainment',
					country: '대한민국',
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString()
				},
				{
					id: 'artist_various_sample',
					name: 'Various',
					description: '다양한 아티스트들의 협업 프로젝트를 위한 공통 아티스트입니다. 여러 아티스트가 함께 작업한 트랙이나 컴필레이션 앨범에 사용됩니다.',
					photo_url: undefined,
					website: undefined,
					email: undefined,
					instagram: undefined,
					twitter: undefined,
					youtube: undefined,
					genre: undefined,
					debut_date: undefined,
					agency: undefined,
					country: undefined,
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString()
				}
			];
		}

		const response: ApiOk<Artist[]> = {
			ok: true,
			data: artists
		};

		return new Response(JSON.stringify(response), {
			status: 200,
			headers: { 'content-type': 'application/json' }
		});
	} catch (error) {
		console.error('Error fetching artists:', error);
		const response: ApiErr = {
			ok: false,
			error: {
				code: 'DATABASE_ERROR',
				message: '아티스트 목록을 불러오는 중 오류가 발생했습니다.',
				details: error instanceof Error ? error.message : String(error)
			}
		};
		return new Response(JSON.stringify(response), {
			status: 500,
			headers: { 'content-type': 'application/json' }
		});
	}
};

// POST: 새 아티스트 생성
export const POST: RequestHandler = async ({ request, platform }) => {
	try {
		const artistData = await request.json();

		// 입력 검증
		if (!artistData.name || !artistData.name.trim()) {
			const response: ApiErr = {
				ok: false,
				error: {
					code: 'VALIDATION_ERROR',
					message: '아티스트 이름을 입력해주세요.',
					details: 'name is required'
				}
			};
			return new Response(JSON.stringify(response), {
				status: 400,
				headers: { 'content-type': 'application/json' }
			});
		}

		const db = platform?.env?.DB;
		const now = new Date().toISOString();

		if (db) {
			try {
				// ID 생성 (슬러그 기반)
				const slug = artistData.name
					.toLowerCase()
					.trim()
					.replace(/[^a-z0-9]+/g, '-')
					.replace(/^-+|-+$/g, '');
				const artistId = `artist_${slug}_${Date.now()}`;

				// 데이터베이스에 삽입
				await db
					.prepare(`
						INSERT INTO artists (id, name, description, photo_url, website, email, instagram, twitter, youtube, genre, debut_date, agency, country, created_at, updated_at)
						VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
					`)
					.bind(
						artistId,
						artistData.name.trim(),
						artistData.description?.trim() || null,
						artistData.photo_url?.trim() || null,
						artistData.website?.trim() || null,
						artistData.email?.trim() || null,
						artistData.instagram?.trim() || null,
						artistData.twitter?.trim() || null,
						artistData.youtube?.trim() || null,
						artistData.genre?.trim() || null,
						artistData.debut_date?.trim() || null,
						artistData.agency?.trim() || null,
						artistData.country?.trim() || null,
						now,
						now
					)
					.run();

				// 생성된 아티스트 조회
				const { results } = await db
					.prepare('SELECT * FROM artists WHERE id = ?')
					.bind(artistId)
					.first();

				const createdArtist: Artist = {
					id: results.id,
					name: results.name,
					description: results.description || undefined,
					photo_url: results.photo_url || undefined,
					website: results.website || undefined,
					email: results.email || undefined,
					instagram: results.instagram || undefined,
					twitter: results.twitter || undefined,
					youtube: results.youtube || undefined,
					genre: results.genre || undefined,
					debut_date: results.debut_date || undefined,
					agency: results.agency || undefined,
					country: results.country || undefined,
					created_at: results.created_at,
					updated_at: results.updated_at
				};

				const response: ApiOk<Artist> = {
					ok: true,
					data: createdArtist
				};

				return new Response(JSON.stringify(response), {
					status: 201,
					headers: { 'content-type': 'application/json' }
				});
			} catch (dbError: any) {
				// UNIQUE 제약 조건 위반 (중복 이름)
				if (dbError.message?.includes('UNIQUE constraint')) {
					const response: ApiErr = {
						ok: false,
						error: {
							code: 'DUPLICATE_ERROR',
							message: '이미 존재하는 아티스트 이름입니다.',
							details: 'name must be unique'
						}
					};
					return new Response(JSON.stringify(response), {
						status: 409,
						headers: { 'content-type': 'application/json' }
					});
				}

				throw dbError;
			}
		} else {
			// DB가 없으면 목 데이터 반환
			const mockArtist: Artist = {
				id: `artist_${Date.now()}`,
				name: artistData.name.trim(),
				description: artistData.description?.trim() || undefined,
				photo_url: artistData.photo_url?.trim() || undefined,
				website: artistData.website?.trim() || undefined,
				email: artistData.email?.trim() || undefined,
				instagram: artistData.instagram?.trim() || undefined,
				twitter: artistData.twitter?.trim() || undefined,
				youtube: artistData.youtube?.trim() || undefined,
				genre: artistData.genre?.trim() || undefined,
				debut_date: artistData.debut_date?.trim() || undefined,
				agency: artistData.agency?.trim() || undefined,
				country: artistData.country?.trim() || undefined,
				created_at: now,
				updated_at: now
			};

			const response: ApiOk<Artist> = {
				ok: true,
				data: mockArtist
			};

			return new Response(JSON.stringify(response), {
				status: 201,
				headers: { 'content-type': 'application/json' }
			});
		}
	} catch (error) {
		console.error('Error creating artist:', error);
		const response: ApiErr = {
			ok: false,
			error: {
				code: 'SERVER_ERROR',
				message: '아티스트를 생성하는 중 오류가 발생했습니다.',
				details: error instanceof Error ? error.message : String(error)
			}
		};
		return new Response(JSON.stringify(response), {
			status: 500,
			headers: { 'content-type': 'application/json' }
		});
	}
};

