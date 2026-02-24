export interface MockMusicVideo {
	id: string;
	title: string;
	track: string;
	album: string;
	status: string;
	duration: string;
	views: number;
	likes: number;
	thumbnail: string;
	progress: number;
	characters: string[];
	created_at: string;
}

export interface MockCharacter {
	id: string;
	name: string;
	description: string;
	image: string;
	style: string;
	color_palette: string[];
	usage_count: number;
	created_at: string;
}

export interface MockAsset {
	id: string;
	name: string;
	type: string;
	image: string;
	usage_count: number;
	tags: string[];
	created_at: string;
}

export const mockMusicVideos: MockMusicVideo[] = [
		{
			id: '1',
			title: 'Sugar Rush MV',
			track: 'Sugar Rush',
			album: 'Sugar Rush Vol.1',
			status: 'published',
			duration: '3:45',
			views: 12500,
			likes: 890,
			thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop',
			progress: 100,
			characters: ['Sugar Girl', 'Beat Boy'],
			created_at: '2024-10-01'
		},
		{
			id: '2',
			title: 'Summer Night MV',
			track: 'Summer Night',
			album: 'Summer Night',
			status: 'published',
			duration: '3:30',
			views: 8900,
			likes: 650,
			thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=200&fit=crop',
			progress: 100,
			characters: ['Summer Girl'],
			created_at: '2024-10-05'
		},
		{
			id: '3',
			title: 'Midnight Drive MV',
			track: 'Midnight Drive',
			album: 'Sugar Rush Vol.1',
			status: 'editing',
			duration: '4:05',
			views: 0,
			likes: 0,
			thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=200&fit=crop',
			progress: 75,
			characters: ['Night Rider'],
			created_at: '2024-10-15'
		},
		{
			id: '4',
			title: 'Dream Dance MV',
			track: 'Dream Dance',
			album: 'Sugar Rush Vol.1',
			status: 'editing',
			duration: '3:20',
			views: 0,
			likes: 0,
			thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=200&fit=crop',
			progress: 60,
			characters: ['Dream Girl'],
			created_at: '2024-10-20'
		},
		{
			id: '5',
			title: 'Electric Pulse MV',
			track: 'Electric Pulse',
			album: 'Sugar Rush Vol.2',
			status: 'generating',
			duration: '3:55',
			views: 0,
			likes: 0,
			thumbnail: '/api/placeholder/300/200',
			progress: 45,
			characters: ['Electric Boy'],
			created_at: '2024-10-25'
		},
		{
			id: '6',
			title: 'Neon Lights MV',
			track: 'Neon Lights',
			album: 'Sugar Rush Vol.2',
			status: 'generating',
			duration: '4:10',
			views: 0,
			likes: 0,
			thumbnail: '/api/placeholder/300/200',
			progress: 30,
			characters: ['Neon Girl'],
			created_at: '2024-10-28'
		},
		{
			id: '7',
			title: 'Sunset Vibes MV',
			track: 'Sunset Vibes',
			album: 'Summer Night',
			status: 'review',
			duration: '3:40',
			views: 0,
			likes: 0,
			thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
			progress: 100,
			characters: ['Sunset Girl'],
			created_at: '2024-11-01'
		},
		{
			id: '8',
			title: 'City Lights MV',
			track: 'City Lights',
			album: 'Sugar Rush Vol.2',
			status: 'review',
			duration: '4:00',
			views: 0,
			likes: 0,
			thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=200&fit=crop',
			progress: 100,
			characters: ['City Boy'],
			created_at: '2024-11-05'
		},
		{
			id: '9',
			title: 'Ocean Waves MV',
			track: 'Ocean Waves',
			album: 'Summer Night',
			status: 'draft',
			duration: '3:25',
			views: 0,
			likes: 0,
			thumbnail: '/api/placeholder/300/200',
			progress: 20,
			characters: ['Ocean Girl'],
			created_at: '2024-11-10'
		},
		{
			id: '10',
			title: 'Mountain Peak MV',
			track: 'Mountain Peak',
			album: 'Sugar Rush Vol.2',
			status: 'draft',
			duration: '4:15',
			views: 0,
			likes: 0,
			thumbnail: '/api/placeholder/300/200',
			progress: 15,
			characters: ['Mountain Boy'],
			created_at: '2024-11-15'
		},
		{
			id: '11',
			title: 'Retro Future MV',
			track: 'Retro Future',
			album: 'Sugar Rush Vol.1',
			status: 'archived',
			duration: '3:50',
			views: 3200,
			likes: 180,
			thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop',
			progress: 100,
			characters: ['Retro Girl'],
			created_at: '2024-09-20'
		},
		{
			id: '12',
			title: 'Space Journey MV',
			track: 'Space Journey',
			album: 'Sugar Rush Vol.2',
			status: 'archived',
			duration: '4:20',
			views: 2100,
			likes: 95,
			thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=200&fit=crop',
			progress: 100,
			characters: ['Space Boy'],
			created_at: '2024-09-25'
		}
];

export const mockCharacters: MockCharacter[] = [
		{
			id: '1',
			name: 'Sugar Girl',
			description: '달콤한 음악의 상징 캐릭터',
			image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
			style: 'cute',
			color_palette: ['#ff69b4', '#FFB6C1', '#FFC0CB'],
			usage_count: 5,
			created_at: '2024-09-15'
		},
		{
			id: '2',
			name: 'Candy Sweet',
			description: '사탕처럼 달콤한 매력의 캐릭터',
			image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
			style: 'cute',
			color_palette: ['#ff69b4', '#FFB6C1', '#FFC0CB', '#FFE4E1'],
			usage_count: 1,
			created_at: '2024-10-05'
		},
		{
			id: '3',
			name: 'Pink Dream',
			description: '핑크 꿈을 꾸는 귀여운 캐릭터',
			image: '/api/placeholder/200/200',
			style: 'cute',
			color_palette: ['#ff69b4', '#FFB6C1', '#FFC0CB'],
			usage_count: 0,
			created_at: '2024-10-20'
		},
		{
			id: '4',
			name: 'Beat Boy',
			description: '리듬감 넘치는 댄서 캐릭터',
			image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
			style: 'cool',
			color_palette: ['#4169E1', '#87CEEB', '#B0C4DE'],
			usage_count: 3,
			created_at: '2024-09-20'
		},
		{
			id: '5',
			name: 'Ice Cool',
			description: '차갑고 시원한 느낌의 캐릭터',
			image: '/api/placeholder/200/200',
			style: 'cool',
			color_palette: ['#4169E1', '#87CEEB', '#B0C4DE'],
			usage_count: 2,
			created_at: '2024-09-25'
		},
		{
			id: '6',
			name: 'Blue Wave',
			description: '파도처럼 흐르는 쿨한 캐릭터',
			image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
			style: 'cool',
			color_palette: ['#4169E1', '#87CEEB', '#B0C4DE', '#E0E6ED'],
			usage_count: 1,
			created_at: '2024-10-15'
		},
		{
			id: '7',
			name: 'Summer Girl',
			description: '여름의 상쾌함을 표현하는 캐릭터',
			image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
			style: 'fresh',
			color_palette: ['#FFEB3B', '#FFF176', '#FFF9C4'],
			usage_count: 2,
			created_at: '2024-10-01'
		},
		{
			id: '8',
			name: 'Sunny Day',
			description: '햇살처럼 밝은 상쾌한 캐릭터',
			image: '/api/placeholder/200/200',
			style: 'fresh',
			color_palette: ['#FFEB3B', '#FFF176', '#FFF9C4', '#FFFDE7'],
			usage_count: 1,
			created_at: '2024-10-10'
		},
		{
			id: '9',
			name: 'Elegant Queen',
			description: '우아하고 고급스러운 매력의 캐릭터',
			image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
			style: 'elegant',
			color_palette: ['#D400FF', '#E6B3FF', '#F0D9FF'],
			usage_count: 2,
			created_at: '2024-10-22'
		},
		{
			id: '10',
			name: 'Royal Princess',
			description: '왕족처럼 우아한 캐릭터',
			image: '/api/placeholder/200/200',
			style: 'elegant',
			color_palette: ['#D400FF', '#E6B3FF', '#F0D9FF'],
			usage_count: 1,
			created_at: '2024-12-25'
		},
		{
			id: '11',
			name: 'Energy Boost',
			description: '에너지가 넘치는 활기찬 캐릭터',
			image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
			style: 'energetic',
			color_palette: ['#FF7A00', '#FF8C42', '#FFA366'],
			usage_count: 1,
			created_at: '2024-10-25'
		},
		{
			id: '12',
			name: 'Power Charge',
			description: '강렬한 에너지를 가진 캐릭터',
			image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
			style: 'energetic',
			color_palette: ['#FF7A00', '#FF8C42', '#FFA366'],
			usage_count: 0,
			created_at: '2024-12-28'
		},
		{
			id: '13',
			name: 'Mystery Shadow',
			description: '신비롭고 수수께끼 같은 캐릭터',
			image: '/api/placeholder/200/200',
			style: 'mysterious',
			color_palette: ['#7B2CBF', '#9D4EDD', '#C77DFF'],
			usage_count: 1,
			created_at: '2024-10-28'
		},
		{
			id: '14',
			name: 'Dark Enigma',
			description: '어둠 속의 수수께끼 캐릭터',
			image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
			style: 'mysterious',
			color_palette: ['#7B2CBF', '#9D4EDD', '#C77DFF'],
			usage_count: 1,
			created_at: '2024-12-30'
		},
		{
			id: '15',
			name: 'Playful Kid',
			description: '장난스럽고 재미있는 캐릭터',
			image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
			style: 'playful',
			color_palette: ['#00FF2E', '#66FF66', '#99FF99'],
			usage_count: 0,
			created_at: '2024-11-01'
		},
		{
			id: '16',
			name: 'Funny Bunny',
			description: '웃음이 가득한 장난꾸러기 캐릭터',
			image: '/api/placeholder/200/200',
			style: 'playful',
			color_palette: ['#00FF2E', '#66FF66', '#99FF99'],
			usage_count: 1,
			created_at: '2025-01-02'
		},
		{
			id: '17',
			name: 'Romance Star',
			description: '로맨틱한 분위기의 캐릭터',
			image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
			style: 'romantic',
			color_palette: ['#FF008C', '#FF66B3', '#FF99CC'],
			usage_count: 1,
			created_at: '2024-11-05'
		},
		{
			id: '18',
			name: 'Love Heart',
			description: '사랑이 가득한 로맨틱 캐릭터',
			image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
			style: 'romantic',
			color_palette: ['#FF008C', '#FF66B3', '#FF99CC'],
			usage_count: 0,
			created_at: '2025-01-05'
		},
		{
			id: '19',
			name: 'Sexy Diva',
			description: '섹시하고 매혹적인 캐릭터',
			image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
			style: 'sexy',
			color_palette: ['#FF1900', '#FF4D4D', '#FF8080'],
			usage_count: 2,
			created_at: '2024-11-08'
		},
		{
			id: '20',
			name: 'Hot Flame',
			description: '불꽃처럼 뜨거운 매력의 캐릭터',
			image: '/api/placeholder/200/200',
			style: 'sexy',
			color_palette: ['#FF1900', '#FF4D4D', '#FF8080'],
			usage_count: 1,
			created_at: '2025-01-08'
		},
		{
			id: '21',
			name: 'Vintage Classic',
			description: '빈티지한 감성의 클래식 캐릭터',
			image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
			style: 'vintage',
			color_palette: ['#654321', '#8B4513', '#A0522D'],
			usage_count: 1,
			created_at: '2024-11-10'
		},
		{
			id: '22',
			name: 'Retro Style',
			description: '레트로 감성의 빈티지 캐릭터',
			image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
			style: 'vintage',
			color_palette: ['#654321', '#8B4513', '#A0522D'],
			usage_count: 0,
			created_at: '2025-01-10'
		},
		{
			id: '23',
			name: 'Formal Gentleman',
			description: '단정하고 정중한 캐릭터',
			image: '/api/placeholder/200/200',
			style: 'formal',
			color_palette: ['#5C7CFA', '#7B9CFA', '#9ABCFA'],
			usage_count: 1,
			created_at: '2024-11-12'
		},
		{
			id: '24',
			name: 'Business Lady',
			description: '비즈니스룩의 단정한 캐릭터',
			image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
			style: 'formal',
			color_palette: ['#5C7CFA', '#7B9CFA', '#9ABCFA'],
			usage_count: 1,
			created_at: '2025-01-12'
		},
		{
			id: '25',
			name: 'Alluring Vampire',
			description: '뱀파이어처럼 고혹적인 캐릭터',
			image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
			style: 'alluring',
			color_palette: ['#DC143C', '#E63950', '#F06666'],
			usage_count: 1,
			created_at: '2024-11-15'
		},
		{
			id: '26',
			name: 'Seductive Rose',
			description: '장미처럼 고혹적인 캐릭터',
			image: '/api/placeholder/200/200',
			style: 'alluring',
			color_palette: ['#DC143C', '#E63950', '#F06666'],
			usage_count: 0,
			created_at: '2025-01-15'
		},
		{
			id: '27',
			name: 'Innocent Angel',
			description: '천사처럼 청초한 캐릭터',
			image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
			style: 'innocent',
			color_palette: ['#40E0D0', '#66E6D9', '#8CECE2'],
			usage_count: 0,
			created_at: '2024-11-18'
		},
		{
			id: '28',
			name: 'Pure White',
			description: '순수하고 깨끗한 청초한 캐릭터',
			image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
			style: 'innocent',
			color_palette: ['#40E0D0', '#66E6D9', '#8CECE2'],
			usage_count: 1,
			created_at: '2025-01-18'
		},
		{
			id: '29',
			name: 'Gentle Soul',
			description: '다정하고 부드러운 캐릭터',
			image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
			style: 'gentle',
			color_palette: ['#FF7F50', '#FF9F7A', '#FFBFA4'],
			usage_count: 1,
			created_at: '2024-11-20'
		},
		{
			id: '30',
			name: 'Warm Heart',
			description: '따뜻한 마음을 가진 다정한 캐릭터',
			image: '/api/placeholder/200/200',
			style: 'gentle',
			color_palette: ['#FF7F50', '#FF9F7A', '#FFBFA4'],
			usage_count: 0,
			created_at: '2025-01-20'
		},
		{
			id: '31',
			name: 'Cyber Future',
			description: '미래적인 사이버펑크 캐릭터',
			image: '/api/placeholder/200/200',
			style: 'futuristic',
			color_palette: ['#00CED1', '#40E0D0', '#7FFFD4'],
			usage_count: 1,
			created_at: '2024-11-22'
		},
		{
			id: '32',
			name: 'Neon Tech',
			description: '네온 기술의 퓨처리스틱 캐릭터',
			image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
			style: 'futuristic',
			color_palette: ['#00CED1', '#40E0D0', '#7FFFD4'],
			usage_count: 1,
			created_at: '2025-01-22'
		},
		{
			id: '33',
			name: 'Military Commander',
			description: '군인처럼 강인한 밀리터리 캐릭터',
			image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
			style: 'military',
			color_palette: ['#6B8E23', '#8FBC8F', '#9ACD32'],
			usage_count: 0,
			created_at: '2024-11-25'
		},
		{
			id: '34',
			name: 'Camouflage',
			description: '위장복의 밀리터리 캐릭터',
			image: '/api/placeholder/200/200',
			style: 'military',
			color_palette: ['#6B8E23', '#8FBC8F', '#9ACD32'],
			usage_count: 1,
			created_at: '2025-01-25'
		},
		{
			id: '35',
			name: 'Dreamy Cloud',
			description: '구름처럼 몽환적인 캐릭터',
			image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
			style: 'dreamy',
			color_palette: ['#DDA0DD', '#E6C9E6', '#F0D9F0'],
			usage_count: 1,
			created_at: '2024-11-28'
		},
		{
			id: '36',
			name: 'Misty Dream',
			description: '안개 속의 몽환적인 캐릭터',
			image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
			style: 'dreamy',
			color_palette: ['#DDA0DD', '#E6C9E6', '#F0D9F0'],
			usage_count: 0,
			created_at: '2025-01-28'
		},
		{
			id: '37',
			name: 'Shadow Assassin',
			description: '그림자처럼 은밀한 캐릭터',
			image: '/api/placeholder/200/200',
			style: 'shadow',
			color_palette: ['#9370DB', '#B19CD9', '#C9B5E8'],
			usage_count: 1,
			created_at: '2024-12-01'
		},
		{
			id: '38',
			name: 'Dark Ninja',
			description: '어둠 속의 그림자 캐릭터',
			image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
			style: 'shadow',
			color_palette: ['#9370DB', '#B19CD9', '#C9B5E8'],
			usage_count: 1,
			created_at: '2025-02-01'
		},
		{
			id: '39',
			name: 'Toxic Venom',
			description: '독처럼 위험한 캐릭터',
			image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
			style: 'toxic',
			color_palette: ['#32CD32', '#66FF66', '#90EE90'],
			usage_count: 0,
			created_at: '2024-12-05'
		},
		{
			id: '40',
			name: 'Poison Ivy',
			description: '독초처럼 독한 캐릭터',
			image: '/api/placeholder/200/200',
			style: 'toxic',
			color_palette: ['#32CD32', '#66FF66', '#90EE90'],
			usage_count: 1,
			created_at: '2025-02-05'
		},
		{
			id: '41',
			name: 'Desert Wanderer',
			description: '황야를 떠도는 캐릭터',
			image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
			style: 'sandy',
			color_palette: ['#DAA520', '#E6C84F', '#F0D87E'],
			usage_count: 1,
			created_at: '2024-12-08'
		},
		{
			id: '42',
			name: 'Sand Storm',
			description: '모래바람의 황야 캐릭터',
			image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
			style: 'sandy',
			color_palette: ['#DAA520', '#E6C84F', '#F0D87E'],
			usage_count: 0,
			created_at: '2025-02-08'
		},
		{
			id: '43',
			name: 'Ice Queen',
			description: '얼음의 여왕 같은 캐릭터',
			image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
			style: 'icy',
			color_palette: ['#AFEEEE', '#BFF5F5', '#CFFCFC'],
			usage_count: 1,
			created_at: '2024-12-10'
		},
		{
			id: '44',
			name: 'Frozen Crystal',
			description: '얼음 결정처럼 차가운 캐릭터',
			image: '/api/placeholder/200/200',
			style: 'icy',
			color_palette: ['#AFEEEE', '#BFF5F5', '#CFFCFC'],
			usage_count: 1,
			created_at: '2025-02-10'
		},
		{
			id: '45',
			name: 'Holy Angel',
			description: '신성한 천사 캐릭터',
			image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
			style: 'holy',
			color_palette: ['#FFD700', '#FFE44D', '#FFF199'],
			usage_count: 2,
			created_at: '2024-12-12'
		},
		{
			id: '46',
			name: 'Divine Light',
			description: '신성한 빛의 캐릭터',
			image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
			style: 'holy',
			color_palette: ['#FFD700', '#FFE44D', '#FFF199'],
			usage_count: 1,
			created_at: '2025-02-12'
		},
		{
			id: '47',
			name: 'Glamorous Star',
			description: '화려한 스타 캐릭터',
			image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
			style: 'glamorous',
			color_palette: ['#FFC107', '#FFD54F', '#FFE082'],
			usage_count: 1,
			created_at: '2024-12-15'
		},
		{
			id: '48',
			name: 'Golden Diva',
			description: '황금빛 화려한 캐릭터',
			image: '/api/placeholder/200/200',
			style: 'glamorous',
			color_palette: ['#FFC107', '#FFD54F', '#FFE082'],
			usage_count: 0,
			created_at: '2025-02-15'
		},
		{
			id: '49',
			name: 'Nature Spirit',
			description: '자연의 정령 같은 캐릭터',
			image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
			style: 'natural',
			color_palette: ['#228B22', '#32CD32', '#90EE90'],
			usage_count: 1,
			created_at: '2024-12-18'
		},
		{
			id: '50',
			name: 'Forest Guardian',
			description: '숲의 수호자 자연스러운 캐릭터',
			image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
			style: 'natural',
			color_palette: ['#228B22', '#32CD32', '#90EE90'],
			usage_count: 1,
			created_at: '2025-02-18'
		},
		{
			id: '51',
			name: 'Classic Master',
			description: '고전적인 마스터 캐릭터',
			image: '/api/placeholder/200/200',
			style: 'classic',
			color_palette: ['#B8860B', '#CD9B1D', '#D4AF37'],
			usage_count: 0,
			created_at: '2024-12-20'
		},
		{
			id: '52',
			name: 'Timeless Beauty',
			description: '시대를 초월한 고전적인 캐릭터',
			image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
			style: 'classic',
			color_palette: ['#B8860B', '#CD9B1D', '#D4AF37'],
			usage_count: 1,
			created_at: '2025-02-20'
		},
		{
			id: '53',
			name: 'Passionate Fire',
			description: '불꽃처럼 열정적인 캐릭터',
			image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
			style: 'passionate',
			color_palette: ['#FF6347', '#FF7F6B', '#FF9A8F'],
			usage_count: 1,
			created_at: '2024-12-22'
		},
		{
			id: '54',
			name: 'Burning Heart',
			description: '타오르는 열정의 캐릭터',
			image: '/api/placeholder/200/200',
			style: 'passionate',
			color_palette: ['#FF6347', '#FF7F6B', '#FF9A8F'],
			usage_count: 1,
			created_at: '2025-02-22'
		}
];

export const mockAssets: MockAsset[] = [
		{
			id: '1',
			name: 'Neon City Background',
			type: 'background',
			image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=200&fit=crop',
			usage_count: 2,
			tags: ['city', 'neon', 'night'],
			created_at: '2024-09-10'
		},
		{
			id: '2',
			name: 'Sunset Sky Background',
			type: 'background',
			image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
			usage_count: 3,
			tags: ['sky', 'sunset', 'nature'],
			created_at: '2024-09-12'
		},
		{
			id: '3',
			name: 'Ocean Wave Background',
			type: 'background',
			image: '/api/placeholder/300/200',
			usage_count: 1,
			tags: ['ocean', 'wave', 'water'],
			created_at: '2024-09-15'
		},
		{
			id: '4',
			name: 'Music Notes Animation',
			type: 'animation',
			image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop',
			usage_count: 5,
			tags: ['music', 'notes', 'animation'],
			created_at: '2024-09-12'
		},
		{
			id: '5',
			name: 'Dancing Stars Animation',
			type: 'animation',
			image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=200&fit=crop',
			usage_count: 2,
			tags: ['stars', 'dance', 'animation'],
			created_at: '2024-09-18'
		},
		{
			id: '6',
			name: 'Floating Bubbles Animation',
			type: 'animation',
			image: '/api/placeholder/300/200',
			usage_count: 1,
			tags: ['bubbles', 'float', 'animation'],
			created_at: '2024-09-20'
		},
		{
			id: '7',
			name: 'Particle Effects',
			type: 'effect',
			image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=200&fit=crop',
			usage_count: 3,
			tags: ['particles', 'effects', 'sparkle'],
			created_at: '2024-09-15'
		},
		{
			id: '8',
			name: 'Lightning Effect',
			type: 'effect',
			image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=200&fit=crop',
			usage_count: 2,
			tags: ['lightning', 'electric', 'effect'],
			created_at: '2024-09-22'
		},
		{
			id: '9',
			name: 'Smoke Effect',
			type: 'effect',
			image: '/api/placeholder/300/200',
			usage_count: 1,
			tags: ['smoke', 'fog', 'effect'],
			created_at: '2024-09-25'
		}
];
