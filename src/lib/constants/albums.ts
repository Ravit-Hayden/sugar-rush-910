/**
 * 앨범 상수
 * 나중에 앨범 API에서 동적으로 가져올 수 있도록 확장 가능
 */

export interface Album {
	id: string;
	title: string;
	artist: string;
	year?: number;
	status?: string;
}

// 기본 앨범 목록 (실제로는 API에서 가져올 예정)
// 트랙 목록에 있는 모든 앨범을 포함
export const ALBUMS: Album[] = [
	{
		id: '1',
		title: 'Sugar Rush Vol.1',
		artist: 'Sugar Rush',
		year: 2024,
		status: 'published'
	},
	{
		id: '2',
		title: 'Sugar Rush Vol.2',
		artist: 'Sugar Rush',
		year: 2024,
		status: 'published'
	},
	{
		id: '3',
		title: 'Summer Night',
		artist: 'Sugar Rush',
		year: 2024,
		status: 'draft'
	},
	{
		id: '4',
		title: 'Demo Collection',
		artist: 'Various',
		year: 2024,
		status: 'archived'
	},
	{
		id: '5',
		title: 'Work in Progress',
		artist: 'Sugar Rush',
		year: 2024,
		status: 'editing'
	},
	{
		id: '6',
		title: 'Revision Album',
		artist: 'Various',
		year: 2024,
		status: 'revision_requested'
	}
];

// 앨범 제목 목록만 반환
export function getAlbumTitles(): string[] {
	return ALBUMS.map(a => a.title);
}

// 아티스트별 앨범 목록 반환
export function getAlbumsByArtist(artistName: string): Album[] {
	return ALBUMS.filter(a => a.artist === artistName);
}

