/**
 * 아티스트 상수
 * 나중에 아티스트 관리 페이지에서 동적으로 관리할 수 있도록 확장 가능
 */

export interface Artist {
	id: string;
	name: string;
	description?: string;
	photo_url?: string;
}

// 기본 아티스트 목록
export const ARTISTS: Artist[] = [
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

// 아티스트 이름으로 ID 찾기
export function getArtistIdByName(name: string): string | null {
	const artist = ARTISTS.find(a => a.name === name);
	return artist?.id || null;
}

// 아티스트 ID로 이름 찾기
export function getArtistNameById(id: string): string | null {
	const artist = ARTISTS.find(a => a.id === id);
	return artist?.name || null;
}

// 아티스트 이름 목록만 반환
export function getArtistNames(): string[] {
	return ARTISTS.map(a => a.name);
}

