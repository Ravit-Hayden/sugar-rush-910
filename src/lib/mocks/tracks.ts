/**
 * 트랙 목록/상세 공통 목업 데이터
 * 목록 페이지와 상세 페이지가 동일한 소스를 사용하도록 합니다.
 */

export interface MockTrack {
	id: string;
	title: string;
	artist: string;
	album: string;
	albumId: string;
	genre: string;
	duration: string;
	status: string;
	plays: number;
	likes: number;
	fileSize: string;
	created_at: string;
	release_date_kr: string;
	release_date_global: string;
}

export const mockTracks: MockTrack[] = [
	// 앨범 1: Sugar Rush Vol.1
	{ id: '1', title: 'Sugar Rush', artist: 'Sugar Rush', album: 'Sugar Rush Vol.1', albumId: '1', genre: 'Electronic', duration: '3:45', status: 'published', plays: 1250, likes: 89, fileSize: '8.2MB', created_at: '2024-09-15', release_date_kr: '2024-09-20', release_date_global: '2024-09-25' },
	{ id: '2', title: 'Sweet Dreams', artist: 'Sugar Rush', album: 'Sugar Rush Vol.1', albumId: '1', genre: 'Electronic', duration: '4:12', status: 'published', plays: 890, likes: 45, fileSize: '9.1MB', created_at: '2024-09-15', release_date_kr: '2024-09-20', release_date_global: '2024-09-25' },
	{ id: '3', title: 'Candy Land', artist: 'Sugar Rush', album: 'Sugar Rush Vol.1', albumId: '1', genre: 'Electronic', duration: '3:58', status: 'published', plays: 678, likes: 34, fileSize: '8.9MB', created_at: '2024-09-15', release_date_kr: '2024-09-20', release_date_global: '2024-09-25' },
	{ id: '4', title: 'Honey Moon', artist: 'Sugar Rush', album: 'Sugar Rush Vol.1', albumId: '1', genre: 'Electronic', duration: '4:30', status: 'published', plays: 567, likes: 28, fileSize: '9.5MB', created_at: '2024-09-15', release_date_kr: '2024-09-20', release_date_global: '2024-09-25' },
	{ id: '5', title: 'Sugar High', artist: 'Sugar Rush', album: 'Sugar Rush Vol.1', albumId: '1', genre: 'Electronic', duration: '3:20', status: 'published', plays: 456, likes: 22, fileSize: '7.8MB', created_at: '2024-09-15', release_date_kr: '2024-09-20', release_date_global: '2024-09-25' },
	{ id: '6', title: 'Sweet Escape', artist: 'Sugar Rush', album: 'Sugar Rush Vol.1', albumId: '1', genre: 'Electronic', duration: '4:05', status: 'published', plays: 345, likes: 18, fileSize: '8.5MB', created_at: '2024-09-15', release_date_kr: '2024-09-20', release_date_global: '2024-09-25' },
	{ id: '7', title: 'Candy Shop', artist: 'Sugar Rush', album: 'Sugar Rush Vol.1', albumId: '1', genre: 'Electronic', duration: '3:50', status: 'published', plays: 234, likes: 15, fileSize: '8.3MB', created_at: '2024-09-15', release_date_kr: '2024-09-20', release_date_global: '2024-09-25' },
	{ id: '8', title: 'Sugar Coated', artist: 'Sugar Rush', album: 'Sugar Rush Vol.1', albumId: '1', genre: 'Electronic', duration: '4:15', status: 'published', plays: 123, likes: 12, fileSize: '9.2MB', created_at: '2024-09-15', release_date_kr: '2024-09-20', release_date_global: '2024-09-25' },
	{ id: '9', title: 'Sweet Surprise', artist: 'Sugar Rush', album: 'Sugar Rush Vol.1', albumId: '1', genre: 'Electronic', duration: '3:35', status: 'published', plays: 112, likes: 10, fileSize: '7.9MB', created_at: '2024-09-15', release_date_kr: '2024-09-20', release_date_global: '2024-09-25' },
	{ id: '10', title: 'Candy Floss', artist: 'Sugar Rush', album: 'Sugar Rush Vol.1', albumId: '1', genre: 'Electronic', duration: '4:00', status: 'published', plays: 98, likes: 8, fileSize: '8.7MB', created_at: '2024-09-15', release_date_kr: '2024-09-20', release_date_global: '2024-09-25' },
	{ id: '11', title: 'Sugar Spice', artist: 'Sugar Rush', album: 'Sugar Rush Vol.1', albumId: '1', genre: 'Electronic', duration: '3:42', status: 'published', plays: 87, likes: 7, fileSize: '8.1MB', created_at: '2024-09-15', release_date_kr: '2024-09-20', release_date_global: '2024-09-25' },
	{ id: '12', title: 'Sweet Victory', artist: 'Sugar Rush', album: 'Sugar Rush Vol.1', albumId: '1', genre: 'Electronic', duration: '4:18', status: 'published', plays: 76, likes: 6, fileSize: '9.8MB', created_at: '2024-09-15', release_date_kr: '2024-09-20', release_date_global: '2024-09-25' },
	// 앨범 2: Summer Night
	{ id: '13', title: 'Summer Night', artist: 'Sugar Rush', album: 'Summer Night', albumId: '2', genre: 'Pop', duration: '3:45', status: 'draft', plays: 0, likes: 0, fileSize: '7.8MB', created_at: '2024-09-20', release_date_kr: '', release_date_global: '' }
];
