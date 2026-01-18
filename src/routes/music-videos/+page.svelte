<script lang="ts">
	import { Film, Plus, Play, Edit, Download, Share, Image, SquareUserRound, Palette, Settings } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';
	import SearchFilterBar from '$lib/components/SearchFilterBar.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';

	let searchQuery = '';
	let selectedFilter = 'all';
	let selectedTab = 'videos'; // videos, characters, assets

	let musicVideos = [
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

	let characters = [
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

	let assets = [
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

	const statusOptions = [
		{ value: 'all', label: '모든 상태' },
		{ value: 'draft', label: '초안' },
		{ value: 'generating', label: '생성 중' },
		{ value: 'editing', label: '편집 중' },
		{ value: 'review', label: '검토 중' },
		{ value: 'published', label: '발매됨' },
		{ value: 'archived', label: '보관됨' }
	];

	const styleOptions = [
		{ value: 'all', label: '모든 스타일' },
		{ value: 'cute', label: '귀여운' },
		{ value: 'cool', label: '쿨한' },
		{ value: 'fresh', label: '상쾌한' },
		{ value: 'elegant', label: '우아한' },
		{ value: 'energetic', label: '에너지 넘치는' },
		{ value: 'mysterious', label: '신비로운' },
		{ value: 'playful', label: '장난스러운' },
		{ value: 'romantic', label: '로맨틱한' },
		{ value: 'sexy', label: '섹시한' },
		{ value: 'vintage', label: '빈티지한' },
		{ value: 'formal', label: '단정한' },
		{ value: 'alluring', label: '고혹적인' },
		{ value: 'innocent', label: '청초한' },
		{ value: 'gentle', label: '다정한' },
		{ value: 'futuristic', label: '퓨처리스틱' },
		{ value: 'military', label: '밀리터리' },
		{ value: 'dreamy', label: '몽환적인' },
		{ value: 'shadow', label: '그림자' },
		{ value: 'toxic', label: '독한' },
		{ value: 'sandy', label: '황야의' },
		{ value: 'icy', label: '얼음같은' },
		{ value: 'holy', label: '신성한' },
		{ value: 'glamorous', label: '화려한' },
		{ value: 'natural', label: '자연스러운' },
		{ value: 'classic', label: '고전적인' },
		{ value: 'passionate', label: '열정적인' }
	];

	const typeOptions = [
		{ value: 'all', label: '모든 타입' },
		{ value: 'background', label: '배경' },
		{ value: 'animation', label: '애니메이션' },
		{ value: 'effect', label: '효과' }
	];

	function getStatusColor(status: string) {
		switch (status) {
			case 'published': return 'badge-low-green';
			case 'editing': return 'badge-info-blue';
			case 'generating': return 'badge-medium-yellow';
			case 'review': return 'badge-high-urgent';
			case 'draft': return 'text-text-muted';
			case 'archived': return 'text-text-muted';
			default: return 'text-text-muted';
		}
	}

	function getStatusLabel(status: string) {
		switch (status) {
			case 'published': return '발매됨';
			case 'editing': return '편집 중';
			case 'generating': return '생성 중';
			case 'review': return '검토 중';
			case 'draft': return '초안';
			case 'archived': return '보관됨';
			default: return '알 수 없음';
		}
	}

	function getStyleColor(style: string) {
		switch (style) {
			case 'cute': return 'badge-cute-pink';
			case 'cool': return 'badge-info-blue';
			case 'fresh': return 'style-fresh';
			case 'elegant': return 'badge-special-purple';
			case 'energetic': return 'text-elotte-orange';
			case 'mysterious': return 'style-mysterious';
			case 'playful': return 'badge-low-green';
			case 'romantic': return 'badge-high-urgent';
			case 'sexy': return 'badge-high-red';
			case 'vintage': return 'style-vintage';
			case 'formal': return 'style-formal';
			case 'alluring': return 'style-alluring';
			case 'innocent': return 'style-innocent';
			case 'gentle': return 'style-gentle';
			case 'futuristic': return 'style-futuristic';
			case 'military': return 'style-military';
			case 'dreamy': return 'style-dreamy';
			case 'shadow': return 'style-shadow';
			case 'toxic': return 'style-toxic';
			case 'sandy': return 'style-sandy';
			case 'icy': return 'style-icy';
			case 'holy': return 'style-holy';
			case 'glamorous': return 'style-glamorous';
			case 'natural': return 'style-natural';
			case 'classic': return 'style-classic';
			case 'passionate': return 'style-passionate';
			default: return 'text-text-muted';
		}
	}

	function getStyleLabel(style: string) {
		switch (style) {
			case 'cute': return '귀여운';
			case 'cool': return '쿨한';
			case 'fresh': return '상쾌한';
			case 'elegant': return '우아한';
			case 'energetic': return '에너지 넘치는';
			case 'mysterious': return '신비로운';
			case 'playful': return '장난스러운';
			case 'romantic': return '로맨틱한';
			case 'sexy': return '섹시한';
			case 'vintage': return '빈티지한';
			case 'formal': return '단정한';
			case 'alluring': return '고혹적인';
			case 'innocent': return '청초한';
			case 'gentle': return '다정한';
			case 'futuristic': return '퓨처리스틱';
			case 'military': return '밀리터리';
			case 'dreamy': return '몽환적인';
			case 'shadow': return '그림자';
			case 'toxic': return '독한';
			case 'sandy': return '황야의';
			case 'icy': return '얼음같은';
			case 'holy': return '신성한';
			case 'glamorous': return '화려한';
			case 'natural': return '자연스러운';
			case 'classic': return '고전적인';
			case 'passionate': return '열정적인';
			default: return '기본';
		}
	}

	function getTypeColor(type: string) {
		switch (type) {
			case 'background': return 'badge-info-blue';
			case 'animation': return 'badge-low-green';
			case 'effect': return 'badge-medium-yellow';
			default: return 'text-text-muted';
		}
	}

	function getTypeLabel(type: string) {
		switch (type) {
			case 'background': return '배경';
			case 'animation': return '애니메이션';
			case 'effect': return '효과';
			default: return '기타';
		}
	}

	const filteredMusicVideos = musicVideos.filter(video => {
		const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
							 video.track.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesFilter = selectedFilter === 'all' || video.status === selectedFilter;
		return matchesSearch && matchesFilter;
	});

	const filteredCharacters = characters.filter(character => {
		const matchesSearch = character.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			   character.description.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesFilter = selectedFilter === 'all' || character.style === selectedFilter;
		return matchesSearch && matchesFilter;
	});

	const filteredAssets = assets.filter(asset => {
		const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			   asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
		const matchesFilter = selectedFilter === 'all' || asset.type === selectedFilter;
		return matchesSearch && matchesFilter;
	});

	function handleCreateVideo() {
		// 뮤직비디오 생성 로직
	}

	function handleCreateCharacter() {
		// 캐릭터 생성 로직
	}

	function handleUploadAsset() {
		// 에셋 업로드 로직
	}
</script>

<PageContent>
<PageHeader 
	title="뮤직비디오 센터" 
	description="AI로 뮤직비디오를 생성하고 캐릭터, 에셋을 관리하세요."
		actions={[
			{
				icon: Plus,
				label: '새 뮤직비디오',
				onclick: handleCreateVideo
			}
		]}
	/>

	<!-- 탭 네비게이션 -->
	<div class="mb-8">
		<div class="border-b border-border-subtle">
			<nav class="-mb-px flex space-x-8">
				<button
					onclick={() => selectedTab = 'videos'}
					class="py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 {selectedTab === 'videos' ? 'border-brand-pink text-brand-pink' : 'border-transparent text-text-muted hover:text-text-strong hover:border-border-subtle'}"
					type="button"
				>
<div class="flex items-center gap-2">
	<Film size={16} />
	뮤직비디오 ({musicVideos.length})
</div>
				</button>
				<button
					onclick={() => selectedTab = 'characters'}
					class="py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 {selectedTab === 'characters' ? 'border-brand-pink text-brand-pink' : 'border-transparent text-text-muted hover:text-text-strong hover:border-border-subtle'}"
					type="button"
				>
<div class="flex items-center gap-2">
	<SquareUserRound size={16} />
	캐릭터 ({characters.length})
</div>
				</button>
				<button
					onclick={() => selectedTab = 'assets'}
					class="py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 {selectedTab === 'assets' ? 'border-brand-pink text-brand-pink' : 'border-transparent text-text-muted hover:text-text-strong hover:border-border-subtle'}"
					type="button"
				>
					<div class="flex items-center gap-2">
						<Image size={16} />
						에셋 라이브러리 ({assets.length})
					</div>
				</button>
			</nav>
		</div>
	</div>

	<!-- 검색 및 필터 -->
	{#if selectedTab === 'videos'}
		<SearchFilterBar
			bind:searchQuery
			bind:selectedFilter
			searchPlaceholder="뮤직비디오 또는 트랙 검색..."
			showFilter={true}
			filterOptions={statusOptions}
		/>
	{:else if selectedTab === 'characters'}
		<SearchFilterBar
			bind:searchQuery
			bind:selectedFilter
			searchPlaceholder="캐릭터 검색..."
			showFilter={true}
			filterOptions={styleOptions}
		/>
	{:else}
		<SearchFilterBar
			bind:searchQuery
			bind:selectedFilter
			searchPlaceholder="에셋 검색..."
			showFilter={true}
			filterOptions={typeOptions}
		/>
	{/if}

	<!-- 뮤직비디오 탭 -->
	{#if selectedTab === 'videos'}
		{#if filteredMusicVideos.length > 0}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each filteredMusicVideos as video (video.id)}
					<div class="bg-surface-1 rounded-lg overflow-hidden hover:bg-surface-2 transition-colors duration-200 group border border-border-subtle">
						<div class="relative aspect-video bg-surface-2 overflow-hidden rounded-t-lg">
<!-- 기본 이미지 (회색 배경 + 회색 로고) -->
<div class="absolute inset-0 flex items-center justify-center bg-surface-2 rounded-t-lg">
	<Film size={48} class="text-text-muted opacity-30" />
</div>
							<!-- 실제 이미지 (있을 경우) -->
							{#if video.thumbnail && video.thumbnail !== '/api/placeholder/300/200'}
								<img
									src={video.thumbnail}
									alt={video.title}
									class="absolute inset-0 w-full h-full object-cover rounded-t-lg"
									onerror={(e: Event) => {
										const target = e.currentTarget as HTMLImageElement;
										target.style.display = 'none';
									}}
								/>
							{/if}
							<div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
								<button class="w-12 h-12 bg-brand-pink rounded-full flex items-center justify-center hover:bg-brand-pink/90 transition-colors duration-200" aria-label="재생">
									<Play size={20} class="text-white" />
								</button>
							</div>
							<div class="absolute top-2 right-2">
								<span class="badge-base {getStatusColor(video.status)}">
									{getStatusLabel(video.status)}
								</span>
							</div>
							<div class="absolute bottom-2 left-2 right-2">
								<div class="w-full bg-surface-2 rounded-full h-1">
									<div 
										class="bg-brand-pink h-1 rounded-full transition-all duration-300" 
										style="width: {video.progress}%"
									></div>
								</div>
							</div>
						</div>

						<div class="p-4">
							<h3 class="font-semibold text-text-strong mb-1 line-clamp-1">{video.title}</h3>
							<p class="text-sm text-text-muted mb-2">{video.track} • {video.album}</p>

							<div class="flex items-center justify-between text-xs text-text-muted mb-3">
								<span>{video.duration}</span>
								<span>{video.views.toLocaleString()}회 조회</span>
							</div>

							<div class="flex items-center justify-between">
								<div class="flex items-center gap-1">
									{#each video.characters as character}
										<span class="px-2 py-1 bg-surface-2 rounded text-xs border border-border-subtle">{character}</span>
									{/each}
								</div>
								<div class="flex items-center gap-1">
									<button class="btn-icon w-8 h-8 inline-flex items-center justify-center rounded-md" title="편집" aria-label="편집">
										<Edit size={14} class="text-text-muted" />
									</button>
									<button class="btn-icon w-8 h-8 inline-flex items-center justify-center rounded-md" title="다운로드" aria-label="다운로드">
										<Download size={14} class="text-text-muted" />
									</button>
									<button class="btn-icon w-8 h-8 inline-flex items-center justify-center rounded-md" title="공유" aria-label="공유">
										<Share size={14} class="text-text-muted" />
									</button>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<EmptyState
				title="뮤직비디오를 찾을 수 없습니다"
				description={searchQuery ? '검색 조건에 맞는 뮤직비디오가 없습니다.' : '아직 뮤직비디오가 없습니다.'}
				actionLabel="첫 번째 뮤직비디오 만들기"
				onAction={handleCreateVideo}
			/>
		{/if}
	{/if}

	<!-- 캐릭터 탭 -->
	{#if selectedTab === 'characters'}
		<div class="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 w-full sm:w-auto">
			<button 
				onclick={handleCreateCharacter}
				class="inline-flex items-center justify-center gap-2 px-4 py-2 w-full sm:w-auto bg-hover-cyan text-black rounded-lg hover:bg-hover-cyan/90 transition-colors duration-200 font-medium"
			>
				<Plus size={16} />
				새 캐릭터 만들기
			</button>
		</div>

		{#if filteredCharacters.length > 0}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{#each filteredCharacters as character (character.id)}
					<div class="character-card-container bg-surface-1 rounded-lg p-6 border border-border-subtle">
						<div class="flex items-center gap-4 mb-4">
							<button
								class="character-image-button relative w-16 h-16 bg-surface-2 rounded-lg flex items-center justify-center border border-border-subtle overflow-hidden focus-visible:border-brand-pink transition-colors duration-200"
								onclick={() => {
									// 이미지 확대 로직 (이미지가 있을 때만)
								if (character.image && character.image !== '/api/placeholder/200/200') {
									// 이미지 확대 모달 열기
								}
								}}
								disabled={!character.image || character.image === '/api/placeholder/200/200'}
							>
<!-- 기본 이미지 (회색 배경 + 회색 로고) -->
<div class="absolute inset-0 flex items-center justify-center">
	<SquareUserRound size={24} class="text-text-muted opacity-30" />
</div>
								<!-- 실제 이미지 (있을 경우) -->
								{#if character.image && character.image !== '/api/placeholder/200/200'}
									<img
										src={character.image}
										alt={character.name}
										class="absolute inset-0 w-full h-full object-cover rounded-lg"
										onerror={(e: Event) => {
											const target = e.currentTarget as HTMLImageElement;
											target.style.display = 'none';
										}}
									/>
								{/if}
							</button>
							<div class="flex-1">
								<h3 class="font-semibold text-text-strong mb-1">{character.name}</h3>
								<span class="badge-base {getStyleColor(character.style)} -ml-2 pl-2">
									{getStyleLabel(character.style)}
								</span>
							</div>
						</div>

						<p class="text-sm text-text-muted mb-4 line-clamp-2">{character.description}</p>

						<div class="space-y-3">
							<div class="flex items-center justify-between text-xs text-text-muted">
								<span>사용 횟수</span>
								<span class="text-text-strong">{character.usage_count}회</span>
							</div>

							<div>
								<div class="text-xs text-text-muted mb-2">색상 팔레트</div>
								<div class="flex gap-1">
									{#each character.color_palette as color}
										<div class="w-4 h-4 rounded border border-border-subtle" style="background-color: {color}"></div>
									{/each}
								</div>
							</div>

							<div class="flex items-center justify-between">
								<span class="text-xs text-text-muted">{character.created_at}</span>
								<div class="flex items-center gap-1">
									<button
										class="btn-icon w-8 h-8 inline-flex items-center justify-center rounded-md"
										title="편집"
										onclick={(e: Event) => {
											e.stopPropagation();
											// 편집 로직
										}}
									>
										<Edit size={14} class="lucide-icon text-text-muted" />
									</button>
									<button
										class="btn-icon w-8 h-8 inline-flex items-center justify-center rounded-md"
										title="설정"
										onclick={(e: Event) => {
											e.stopPropagation();
											// 설정 로직
										}}
									>
										<Settings size={14} class="lucide-icon text-text-muted" />
									</button>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<EmptyState
				title="캐릭터를 찾을 수 없습니다"
				description={searchQuery ? '검색 조건에 맞는 캐릭터가 없습니다.' : '아직 캐릭터가 없습니다.'}
				actionLabel="첫 번째 캐릭터 만들기"
				onAction={handleCreateCharacter}
			/>
		{/if}
	{/if}

	<!-- 에셋 라이브러리 탭 -->
	{#if selectedTab === 'assets'}
		<div class="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 w-full sm:w-auto">
			<button 
				onclick={handleUploadAsset}
				class="inline-flex items-center justify-center gap-2 px-4 py-2 w-full sm:w-auto bg-hover-cyan text-black rounded-lg hover:bg-hover-cyan/90 transition-colors duration-200 font-medium"
			>
				<Plus size={16} />
				에셋 업로드
			</button>
		</div>

		{#if filteredAssets.length > 0}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{#each filteredAssets as asset (asset.id)}
					<div class="bg-surface-1 rounded-lg overflow-hidden hover:bg-surface-2 transition-colors duration-200 group border border-border-subtle">
						<div class="relative aspect-video bg-surface-2 overflow-hidden rounded-t-lg">
							<!-- 기본 이미지 (회색 배경 + 회색 로고) -->
							<div class="absolute inset-0 flex items-center justify-center bg-surface-2 rounded-t-lg">
								<Image size={48} class="text-text-muted opacity-30" />
							</div>
							<!-- 실제 이미지 (있을 경우) -->
							{#if asset.image && asset.image !== '/api/placeholder/300/200'}
								<img
									src={asset.image}
									alt={asset.name}
									class="absolute inset-0 w-full h-full object-cover rounded-t-lg"
									onerror={(e: Event) => {
										const target = e.currentTarget as HTMLImageElement;
										target.style.display = 'none';
									}}
								/>
							{/if}
						</div>

						<div class="p-4">
							<div class="flex items-start justify-between mb-2">
								<h3 class="font-semibold text-text-strong line-clamp-1">{asset.name}</h3>
								<span class="badge-base {getTypeColor(asset.type)}">
									{getTypeLabel(asset.type)}
								</span>
							</div>

							<div class="flex flex-wrap gap-1 mb-3">
								{#each asset.tags as tag}
									<span class="px-2 py-1 bg-surface-2 rounded text-xs border border-border-subtle">{tag}</span>
								{/each}
							</div>

							<div class="flex items-center justify-between">
								<span class="text-xs text-text-muted">{asset.usage_count}회 사용</span>
								<div class="flex items-center gap-1">
									<button class="btn-icon w-8 h-8 inline-flex items-center justify-center rounded-md" title="편집" aria-label="편집">
										<Edit size={14} class="text-text-muted" />
									</button>
									<button class="btn-icon w-8 h-8 inline-flex items-center justify-center rounded-md" title="다운로드" aria-label="다운로드">
										<Download size={14} class="text-text-muted" />
									</button>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<EmptyState
				title="에셋을 찾을 수 없습니다"
				description={searchQuery ? '검색 조건에 맞는 에셋이 없습니다.' : '아직 에셋이 없습니다.'}
				actionLabel="첫 번째 에셋 업로드"
				onAction={handleUploadAsset}
			/>
		{/if}
	{/if}
</PageContent>
