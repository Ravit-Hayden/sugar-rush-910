export interface MockRelease {
	id: string;
	title: string;
	status: 'live' | 'scheduled' | 'draft';
	releaseDate: string;
	platforms: string[];
	progress: number;
	description?: string;
	albumId?: string;
	trackIds?: string[];
	verificationStatus?: {
		audio: boolean;
		metadata: boolean;
		artwork: boolean;
		legal: boolean;
	};
	createdAt?: string;
	updatedAt?: string;
}

export const mockReleases: MockRelease[] = [
	{
		id: '1',
		title: 'Sugar Rush Vol.1',
		status: 'scheduled',
		releaseDate: '2024-12-31',
		platforms: ['Spotify', 'Apple Music', 'YouTube Music'],
		progress: 90,
		description: '첫 번째 정규 앨범',
		verificationStatus: {
			audio: true,
			metadata: true,
			artwork: true,
			legal: false
		}
	},
	{
		id: '2',
		title: 'Summer Night',
		status: 'live',
		releaseDate: '2024-10-15',
		platforms: ['Spotify', 'Apple Music'],
		progress: 100,
		description: '여름 시즌 싱글',
		verificationStatus: {
			audio: true,
			metadata: true,
			artwork: true,
			legal: true
		}
	},
	{
		id: '3',
		title: 'Demo Collection',
		status: 'draft',
		releaseDate: '2024-11-20',
		platforms: ['SoundCloud'],
		progress: 60,
		description: '데모 트랙 모음',
		verificationStatus: {
			audio: true,
			metadata: false,
			artwork: false,
			legal: false
		}
	}
];
