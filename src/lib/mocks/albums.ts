/**
 * 앨범 목록/상세 공통 목업 데이터
 */

export interface MockAlbumTrack {
	id: string;
	title: string;
	duration: string;
}

export interface MockAlbum {
	id: string;
	title: string;
	artist: string;
	year: number;
	status: string;
	tracks: number;
	duration: string;
	cover: string;
	plays: number;
	likes: number;
	created_at: string;
	release_date_kr?: string;
	release_date_global?: string;
	genres: string[];
	trackList: MockAlbumTrack[];
}

export const mockAlbums: MockAlbum[] = [
	{
		id: '1',
		title: 'Sugar Rush Vol.1',
		artist: 'Sugar Rush',
		year: 2024,
		status: 'published',
		tracks: 12,
		duration: '45:30',
		cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
		plays: 1250,
		likes: 89,
		created_at: '2024-09-15',
		release_date_kr: '2024-09-20',
		release_date_global: '2024-09-25',
		genres: ['Electronic', 'Dance', 'House', 'Techno', 'Pop'],
		trackList: [
			{ id: '1', title: 'Sugar Rush', duration: '3:45' },
			{ id: '2', title: 'Sweet Dreams', duration: '4:12' },
			{ id: '3', title: 'Candy Land', duration: '3:58' },
			{ id: '4', title: 'Honey Moon', duration: '4:30' },
			{ id: '5', title: 'Sugar High', duration: '3:20' },
			{ id: '6', title: 'Sweet Escape', duration: '4:05' },
			{ id: '7', title: 'Candy Shop', duration: '3:50' },
			{ id: '8', title: 'Sugar Coated', duration: '4:15' },
			{ id: '9', title: 'Sweet Surprise', duration: '3:35' },
			{ id: '10', title: 'Candy Floss', duration: '4:00' },
			{ id: '11', title: 'Sugar Spice', duration: '3:42' },
			{ id: '12', title: 'Sweet Victory', duration: '4:18' }
		]
	},
	{
		id: '2',
		title: 'Summer Night',
		artist: 'Sugar Rush',
		year: 2024,
		status: 'draft',
		tracks: 1,
		duration: '3:45',
		cover: '/api/placeholder/300/300',
		plays: 890,
		likes: 45,
		created_at: '2024-09-20',
		genres: ['Pop'],
		trackList: [{ id: '1', title: 'Summer Night', duration: '3:45' }]
	},
	{
		id: '3',
		title: 'Demo Collection',
		artist: 'Various',
		year: 2024,
		status: 'archived',
		tracks: 8,
		duration: '28:15',
		cover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop',
		plays: 456,
		likes: 23,
		created_at: '2024-08-10',
		genres: ['Rock', 'Alternative', 'Indie'],
		trackList: [
			{ id: '1', title: 'Demo Track 1', duration: '3:30' },
			{ id: '2', title: 'Demo Track 2', duration: '3:45' },
			{ id: '3', title: 'Demo Track 3', duration: '3:20' },
			{ id: '4', title: 'Demo Track 4', duration: '4:00' },
			{ id: '5', title: 'Demo Track 5', duration: '3:15' },
			{ id: '6', title: 'Demo Track 6', duration: '3:50' },
			{ id: '7', title: 'Demo Track 7', duration: '3:25' },
			{ id: '8', title: 'Demo Track 8', duration: '3:10' }
		]
	},
	{
		id: '4',
		title: 'Work in Progress',
		artist: 'Sugar Rush',
		year: 2024,
		status: 'editing',
		tracks: 5,
		duration: '18:20',
		cover: '/api/placeholder/300/300',
		plays: 0,
		likes: 0,
		created_at: '2024-10-01',
		genres: ['Jazz', 'Blues', 'Soul', 'Funk'],
		trackList: [
			{ id: '1', title: 'Work Track 1', duration: '3:40' },
			{ id: '2', title: 'Work Track 2', duration: '3:45' },
			{ id: '3', title: 'Work Track 3', duration: '3:30' },
			{ id: '4', title: 'Work Track 4', duration: '3:50' },
			{ id: '5', title: 'Work Track 5', duration: '3:35' }
		]
	},
	{
		id: '5',
		title: 'Revision Album',
		artist: 'Various',
		year: 2024,
		status: 'revision_requested',
		tracks: 3,
		duration: '12:10',
		cover: '/api/placeholder/300/300',
		plays: 0,
		likes: 0,
		created_at: '2024-10-05',
		genres: ['Hip-Hop', 'R&B', 'Soul', 'Funk', 'Jazz', 'Blues'],
		trackList: [
			{ id: '1', title: 'Revision Track 1', duration: '4:00' },
			{ id: '2', title: 'Revision Track 2', duration: '4:05' },
			{ id: '3', title: 'Revision Track 3', duration: '4:05' }
		]
	},
	{
		id: '6',
		title: 'Pending Review Album',
		artist: 'Sugar Rush',
		year: 2024,
		status: 'pending_review',
		tracks: 10,
		duration: '35:45',
		cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop',
		plays: 0,
		likes: 0,
		created_at: '2024-10-10',
		genres: ['K-Pop', 'Pop'],
		trackList: [
			{ id: '1', title: 'Review Track 1', duration: '3:30' },
			{ id: '2', title: 'Review Track 2', duration: '3:45' },
			{ id: '3', title: 'Review Track 3', duration: '3:20' },
			{ id: '4', title: 'Review Track 4', duration: '4:00' },
			{ id: '5', title: 'Review Track 5', duration: '3:15' },
			{ id: '6', title: 'Review Track 6', duration: '3:50' },
			{ id: '7', title: 'Review Track 7', duration: '3:25' },
			{ id: '8', title: 'Review Track 8', duration: '3:10' },
			{ id: '9', title: 'Review Track 9', duration: '3:40' },
			{ id: '10', title: 'Review Track 10', duration: '3:55' }
		]
	},
	{
		id: '7',
		title: 'Under Review Album',
		artist: 'Various',
		year: 2024,
		status: 'under_review',
		genres: ['Metal', 'Rock', 'Punk', 'Alternative', 'Indie', 'Experimental', 'Hardcore'],
		tracks: 7,
		duration: '25:30',
		cover: '/api/placeholder/300/300',
		plays: 0,
		likes: 0,
		created_at: '2024-10-12',
		trackList: [
			{ id: '1', title: 'Review Track 1', duration: '3:40' },
			{ id: '2', title: 'Review Track 2', duration: '3:45' },
			{ id: '3', title: 'Review Track 3', duration: '3:30' },
			{ id: '4', title: 'Review Track 4', duration: '3:50' },
			{ id: '5', title: 'Review Track 5', duration: '3:35' },
			{ id: '6', title: 'Review Track 6', duration: '3:40' },
			{ id: '7', title: 'Review Track 7', duration: '3:25' }
		]
	},
	{
		id: '8',
		title: 'Editing Complete Album',
		artist: 'Sugar Rush',
		year: 2024,
		status: 'editing_complete',
		tracks: 6,
		duration: '22:15',
		cover: '/api/placeholder/300/300',
		plays: 0,
		likes: 0,
		created_at: '2024-10-15',
		genres: ['Ballad', 'Pop', 'R&B'],
		trackList: [
			{ id: '1', title: 'Complete Track 1', duration: '3:40' },
			{ id: '2', title: 'Complete Track 2', duration: '3:45' },
			{ id: '3', title: 'Complete Track 3', duration: '3:30' },
			{ id: '4', title: 'Complete Track 4', duration: '3:50' },
			{ id: '5', title: 'Complete Track 5', duration: '3:35' },
			{ id: '6', title: 'Complete Track 6', duration: '3:55' }
		]
	},
	{
		id: '9',
		title: 'Approved Album',
		artist: 'Sugar Rush',
		year: 2024,
		status: 'approved',
		tracks: 9,
		duration: '32:20',
		cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
		plays: 0,
		likes: 0,
		created_at: '2024-10-18',
		genres: ['Classical', 'Jazz', 'Blues', 'Folk', 'Country', 'Gospel'],
		trackList: [
			{ id: '1', title: 'Approved Track 1', duration: '3:40' },
			{ id: '2', title: 'Approved Track 2', duration: '3:45' },
			{ id: '3', title: 'Approved Track 3', duration: '3:30' },
			{ id: '4', title: 'Approved Track 4', duration: '3:50' },
			{ id: '5', title: 'Approved Track 5', duration: '3:35' },
			{ id: '6', title: 'Approved Track 6', duration: '3:40' },
			{ id: '7', title: 'Approved Track 7', duration: '3:45' },
			{ id: '8', title: 'Approved Track 8', duration: '3:30' },
			{ id: '9', title: 'Approved Track 9', duration: '3:55' }
		]
	},
	{
		id: '10',
		title: 'Scheduled Album',
		artist: 'Sugar Rush',
		year: 2024,
		status: 'scheduled',
		tracks: 11,
		duration: '40:15',
		cover: '/api/placeholder/300/300',
		plays: 0,
		likes: 0,
		created_at: '2024-10-20',
		genres: ['Ambient', 'Lo-Fi', 'New Age', 'Experimental'],
		trackList: [
			{ id: '1', title: 'Scheduled Track 1', duration: '3:40' },
			{ id: '2', title: 'Scheduled Track 2', duration: '3:45' },
			{ id: '3', title: 'Scheduled Track 3', duration: '3:30' },
			{ id: '4', title: 'Scheduled Track 4', duration: '3:50' },
			{ id: '5', title: 'Scheduled Track 5', duration: '3:35' },
			{ id: '6', title: 'Scheduled Track 6', duration: '3:40' },
			{ id: '7', title: 'Scheduled Track 7', duration: '3:45' },
			{ id: '8', title: 'Scheduled Track 8', duration: '3:30' },
			{ id: '9', title: 'Scheduled Track 9', duration: '3:50' },
			{ id: '10', title: 'Scheduled Track 10', duration: '3:35' },
			{ id: '11', title: 'Scheduled Track 11', duration: '3:55' }
		]
	},
	{
		id: '11',
		title: 'Paused Album',
		artist: 'Various',
		year: 2024,
		status: 'paused',
		tracks: 4,
		duration: '15:20',
		cover: '/api/placeholder/300/300',
		plays: 0,
		likes: 0,
		created_at: '2024-10-22',
		genres: ['Disco', 'Funk', 'Soul', 'R&B', 'Gospel', 'Reggae', 'Latin', 'World'],
		trackList: [
			{ id: '1', title: 'Paused Track 1', duration: '3:50' },
			{ id: '2', title: 'Paused Track 2', duration: '3:45' },
			{ id: '3', title: 'Paused Track 3', duration: '3:55' },
			{ id: '4', title: 'Paused Track 4', duration: '3:50' }
		]
	},
	{
		id: '12',
		title: 'Deleted Album',
		artist: 'Sugar Rush',
		year: 2024,
		status: 'deleted',
		tracks: 2,
		duration: '7:30',
		cover: '/api/placeholder/300/300',
		plays: 0,
		likes: 0,
		created_at: '2024-10-25',
		genres: [],
		trackList: [
			{ id: '1', title: 'Deleted Track 1', duration: '3:45' },
			{ id: '2', title: 'Deleted Track 2', duration: '3:45' }
		]
	}
];
