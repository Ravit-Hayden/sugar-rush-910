/**
 * 아티스트 상수 및 유틸리티
 * DB에서 로드하되, 실패 시 기본값 사용
 */

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
}

// 기본 아티스트 목록 (폴백용)
const DEFAULT_ARTISTS: Artist[] = [
	{
		id: 'sugar-rush',
		name: 'Sugar Rush',
		description: 'Sugar Rush 910 프로젝트의 메인 아티스트'
	},
	{
		id: 'various',
		name: 'Various',
		description: '다양한 아티스트'
	}
];

// 아티스트 목록 (런타임에 DB에서 로드)
let cachedArtists: Artist[] | null = null;
let loadingPromise: Promise<Artist[]> | null = null;

// DB에서 아티스트 목록 로드
async function loadArtistsFromDB(): Promise<Artist[]> {
	if (cachedArtists) {
		return cachedArtists;
	}

	if (loadingPromise) {
		return loadingPromise;
	}

	loadingPromise = (async () => {
		try {
			const response = await fetch('/api/artists');
			const result = await response.json();
			if (result.ok && Array.isArray(result.data) && result.data.length > 0) {
				cachedArtists = result.data;
				return cachedArtists;
			}
		} catch (error) {
			console.warn('Failed to load artists from DB, using defaults:', error);
		}
		// DB 로드 실패 시 기본값 반환
		cachedArtists = DEFAULT_ARTISTS;
		return cachedArtists;
	})();

	return loadingPromise;
}

// 아티스트 목록 가져오기 (동기 버전 - 기본값 반환)
export function getArtists(): Artist[] {
	return cachedArtists || DEFAULT_ARTISTS;
}

// 아티스트 목록 가져오기 (비동기 버전 - DB에서 로드)
export async function getArtistsAsync(): Promise<Artist[]> {
	return await loadArtistsFromDB();
}

// 캐시 무효화 (새 아티스트 추가 후 호출)
export function invalidateArtistsCache() {
	cachedArtists = null;
	loadingPromise = null;
}

// 아티스트 이름으로 ID 찾기
export function getArtistIdByName(name: string): string | null {
	const artist = getArtists().find(a => a.name === name);
	return artist?.id || null;
}

// 아티스트 ID로 이름 찾기
export function getArtistNameById(id: string): string | null {
	const artist = getArtists().find(a => a.id === id);
	return artist?.name || null;
}

// 아티스트 이름 목록만 반환
export function getArtistNames(): string[] {
	return getArtists().map(a => a.name);
}

// 비동기 버전: 아티스트 이름 목록만 반환
export async function getArtistNamesAsync(): Promise<string[]> {
	const artists = await getArtistsAsync();
	return artists.map(a => a.name);
}

// 하위 호환성을 위한 export (기본값 사용)
export const ARTISTS = DEFAULT_ARTISTS;

