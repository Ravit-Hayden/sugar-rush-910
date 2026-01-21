<script lang="ts">
	import { Plus, Search, Trash2, Edit2, Link, Shuffle, X, ChevronDown, Filter, UserRound, ArrowUpDown, BookOpen, SearchX, ArrowDownAZ, ListOrdered, RotateCcw } from 'lucide-svelte';
	import RandomCombinator from '$lib/components/suno/RandomCombinator.svelte';
	import SUNOTabs from '$lib/components/suno/SUNOTabs.svelte';
	import { WORD_CATEGORIES, getCategoryName } from '$lib/constants/suno/categories';
	import type { WordEntry, WordCategory, Producer } from '$lib/types/suno';
	
	// 랜덤 조합기 표시 상태
	let showCombinator = $state(false);

	// 목업 데이터 - 확장된 워드 라이브러리
	let words = $state<WordEntry[]>([
		// ==================== 주제 (topic) ====================
		{ id: 't1', content: '달콤한 꿈', category: 'topic', tags: ['sweet', 'dream'], usageCount: 15, linkedTracks: ['track1', 'track2'], createdAt: '2026-01-10', createdBy: 'El' },
		{ id: 't2', content: '첫사랑', category: 'topic', tags: ['love', 'first'], usageCount: 22, linkedTracks: ['track1', 'track3'], createdAt: '2026-01-09', createdBy: 'Otte' },
		{ id: 't3', content: '이별의 순간', category: 'topic', tags: ['breakup', 'sad'], usageCount: 18, linkedTracks: ['track2'], createdAt: '2026-01-08', createdBy: 'El' },
		{ id: 't4', content: '새로운 시작', category: 'topic', tags: ['new', 'beginning'], usageCount: 12, linkedTracks: ['track4'], createdAt: '2026-01-07', createdBy: 'Otte' },
		{ id: 't5', content: '우정', category: 'topic', tags: ['friendship'], usageCount: 9, linkedTracks: ['track1'], createdAt: '2026-01-06', createdBy: 'El' },
		{ id: 't6', content: '그리움', category: 'topic', tags: ['missing', 'longing'], usageCount: 20, linkedTracks: ['track2', 'track3'], createdAt: '2026-01-05', createdBy: 'Otte' },
		{ id: 't7', content: '청춘', category: 'topic', tags: ['youth'], usageCount: 14, linkedTracks: ['track1'], createdAt: '2026-01-04', createdBy: 'El' },
		{ id: 't8', content: '자유', category: 'topic', tags: ['freedom'], usageCount: 11, linkedTracks: [], createdAt: '2026-01-03', createdBy: 'Otte' },
		{ id: 't9', content: '희망', category: 'topic', tags: ['hope'], usageCount: 16, linkedTracks: ['track4'], createdAt: '2026-01-02', createdBy: 'El' },
		{ id: 't10', content: '꿈을 향해', category: 'topic', tags: ['dream', 'goal'], usageCount: 8, linkedTracks: [], createdAt: '2026-01-01', createdBy: 'Otte' },
		{ id: 't11', content: '비밀', category: 'topic', tags: ['secret'], usageCount: 7, linkedTracks: ['track2'], createdAt: '2025-12-31', createdBy: 'El' },
		{ id: 't12', content: '운명', category: 'topic', tags: ['destiny', 'fate'], usageCount: 13, linkedTracks: ['track1', 'track3'], createdAt: '2025-12-30', createdBy: 'Otte' },
		
		// ==================== 분위기 (mood) ====================
		{ id: 'm1', content: '여름밤의 설렘', category: 'mood', tags: ['summer', 'night'], usageCount: 19, linkedTracks: ['track1'], createdAt: '2026-01-11', createdBy: 'Otte' },
		{ id: 'm2', content: '포근한', category: 'mood', tags: ['warm', 'cozy'], usageCount: 14, linkedTracks: ['track2'], createdAt: '2026-01-10', createdBy: 'El' },
		{ id: 'm3', content: '신비로운', category: 'mood', tags: ['mysterious'], usageCount: 11, linkedTracks: ['track3'], createdAt: '2026-01-09', createdBy: 'Otte' },
		{ id: 'm4', content: '청량한', category: 'mood', tags: ['fresh', 'cool'], usageCount: 17, linkedTracks: ['track1', 'track4'], createdAt: '2026-01-08', createdBy: 'El' },
		{ id: 'm5', content: '몽환적인', category: 'mood', tags: ['dreamy'], usageCount: 22, linkedTracks: ['track2', 'track3'], createdAt: '2026-01-07', createdBy: 'Otte' },
		{ id: 'm6', content: '우울한', category: 'mood', tags: ['melancholy', 'sad'], usageCount: 15, linkedTracks: ['track1'], createdAt: '2026-01-06', createdBy: 'El' },
		{ id: 'm7', content: '활기찬', category: 'mood', tags: ['energetic', 'lively'], usageCount: 20, linkedTracks: ['track4'], createdAt: '2026-01-05', createdBy: 'Otte' },
		{ id: 'm8', content: '잔잔한', category: 'mood', tags: ['calm', 'peaceful'], usageCount: 18, linkedTracks: ['track2'], createdAt: '2026-01-04', createdBy: 'El' },
		{ id: 'm9', content: '달달한', category: 'mood', tags: ['sweet'], usageCount: 13, linkedTracks: ['track1', 'track3'], createdAt: '2026-01-03', createdBy: 'Otte' },
		{ id: 'm10', content: '시원한', category: 'mood', tags: ['refreshing'], usageCount: 10, linkedTracks: [], createdAt: '2026-01-02', createdBy: 'El' },
		{ id: 'm11', content: '쓸쓸한', category: 'mood', tags: ['lonely'], usageCount: 12, linkedTracks: ['track2'], createdAt: '2026-01-01', createdBy: 'Otte' },
		{ id: 'm12', content: '설레는', category: 'mood', tags: ['exciting', 'flutter'], usageCount: 25, linkedTracks: ['track1', 'track2', 'track4'], createdAt: '2025-12-31', createdBy: 'El' },
		
		// ==================== 행동 (action) ====================
		{ id: 'a1', content: '춤추는', category: 'action', tags: ['dance'], usageCount: 28, linkedTracks: ['track2', 'track3'], createdAt: '2026-01-09', createdBy: 'El' },
		{ id: 'a2', content: '달리는', category: 'action', tags: ['run'], usageCount: 15, linkedTracks: ['track1'], createdAt: '2026-01-08', createdBy: 'Otte' },
		{ id: 'a3', content: '노래하는', category: 'action', tags: ['sing'], usageCount: 22, linkedTracks: ['track2'], createdAt: '2026-01-07', createdBy: 'El' },
		{ id: 'a4', content: '걸어가는', category: 'action', tags: ['walk'], usageCount: 12, linkedTracks: ['track3'], createdAt: '2026-01-06', createdBy: 'Otte' },
		{ id: 'a5', content: '기다리는', category: 'action', tags: ['wait'], usageCount: 18, linkedTracks: ['track1', 'track4'], createdAt: '2026-01-05', createdBy: 'El' },
		{ id: 'a6', content: '사랑하는', category: 'action', tags: ['love'], usageCount: 85, linkedTracks: ['track1', 'track2', 'track3', 'track4', 'track5', 'track6', 'track7', 'track8', 'track9', 'track10', 'track11', 'track12'], createdAt: '2026-01-04', createdBy: 'Otte' },
		{ id: 'a7', content: '꿈꾸는', category: 'action', tags: ['dream'], usageCount: 20, linkedTracks: ['track2'], createdAt: '2026-01-03', createdBy: 'El' },
		{ id: 'a8', content: '떠나는', category: 'action', tags: ['leave'], usageCount: 14, linkedTracks: ['track1'], createdAt: '2026-01-02', createdBy: 'Otte' },
		{ id: 'a9', content: '안아주는', category: 'action', tags: ['hug'], usageCount: 16, linkedTracks: ['track3'], createdAt: '2026-01-01', createdBy: 'El' },
		{ id: 'a10', content: '빛나는', category: 'action', tags: ['shine'], usageCount: 19, linkedTracks: ['track4'], createdAt: '2025-12-31', createdBy: 'Otte' },
		
		// ==================== 디저트 (dessert) ====================
		{ id: 'd1', content: '마카롱', category: 'dessert', tags: ['macaron', 'sweet'], usageCount: 8, linkedTracks: [], createdAt: '2026-01-12', createdBy: 'Otte' },
		{ id: 'd2', content: '초콜릿', category: 'dessert', tags: ['chocolate'], usageCount: 12, linkedTracks: ['track1'], createdAt: '2026-01-11', createdBy: 'El' },
		{ id: 'd3', content: '딸기 케이크', category: 'dessert', tags: ['strawberry', 'cake'], usageCount: 10, linkedTracks: ['track2'], createdAt: '2026-01-10', createdBy: 'Otte' },
		{ id: 'd4', content: '아이스크림', category: 'dessert', tags: ['icecream'], usageCount: 15, linkedTracks: ['track1', 'track3'], createdAt: '2026-01-09', createdBy: 'El' },
		{ id: 'd5', content: '캔디', category: 'dessert', tags: ['candy'], usageCount: 9, linkedTracks: [], createdAt: '2026-01-08', createdBy: 'Otte' },
		{ id: 'd6', content: '버블티', category: 'dessert', tags: ['bubbletea', 'drink'], usageCount: 11, linkedTracks: ['track4'], createdAt: '2026-01-07', createdBy: 'El' },
		{ id: 'd7', content: '쿠키', category: 'dessert', tags: ['cookie'], usageCount: 7, linkedTracks: [], createdAt: '2026-01-06', createdBy: 'Otte' },
		{ id: 'd8', content: '도넛', category: 'dessert', tags: ['donut'], usageCount: 6, linkedTracks: ['track2'], createdAt: '2026-01-05', createdBy: 'El' },
		{ id: 'd9', content: '푸딩', category: 'dessert', tags: ['pudding'], usageCount: 5, linkedTracks: [], createdAt: '2026-01-04', createdBy: 'Otte' },
		{ id: 'd10', content: '솜사탕', category: 'dessert', tags: ['cottoncandy'], usageCount: 8, linkedTracks: ['track1'], createdAt: '2026-01-03', createdBy: 'El' },
		
		// ==================== 계절 (season) ====================
		{ id: 's1', content: '벚꽃이 흩날리는', category: 'season', tags: ['spring', 'cherry'], usageCount: 24, linkedTracks: ['track1'], createdAt: '2026-01-08', createdBy: 'El' },
		{ id: 's2', content: '한여름의', category: 'season', tags: ['summer'], usageCount: 20, linkedTracks: ['track2', 'track4'], createdAt: '2026-01-07', createdBy: 'Otte' },
		{ id: 's3', content: '가을바람', category: 'season', tags: ['autumn', 'wind'], usageCount: 18, linkedTracks: ['track1'], createdAt: '2026-01-06', createdBy: 'El' },
		{ id: 's4', content: '겨울밤', category: 'season', tags: ['winter', 'night'], usageCount: 22, linkedTracks: ['track3'], createdAt: '2026-01-05', createdBy: 'Otte' },
		{ id: 's5', content: '봄비', category: 'season', tags: ['spring', 'rain'], usageCount: 15, linkedTracks: ['track2'], createdAt: '2026-01-04', createdBy: 'El' },
		{ id: 's6', content: '여름바다', category: 'season', tags: ['summer', 'sea'], usageCount: 19, linkedTracks: ['track1', 'track4'], createdAt: '2026-01-03', createdBy: 'Otte' },
		{ id: 's7', content: '단풍', category: 'season', tags: ['autumn', 'leaves'], usageCount: 14, linkedTracks: [], createdAt: '2026-01-02', createdBy: 'El' },
		{ id: 's8', content: '첫눈', category: 'season', tags: ['winter', 'snow'], usageCount: 25, linkedTracks: ['track1', 'track2', 'track3'], createdAt: '2026-01-01', createdBy: 'Otte' },
		{ id: 's9', content: '개나리 피는', category: 'season', tags: ['spring', 'flower'], usageCount: 10, linkedTracks: [], createdAt: '2025-12-31', createdBy: 'El' },
		{ id: 's10', content: '장마', category: 'season', tags: ['summer', 'rain'], usageCount: 8, linkedTracks: ['track2'], createdAt: '2025-12-30', createdBy: 'Otte' },
		
		// ==================== 이벤트 (event) ====================
		{ id: 'e1', content: '크리스마스', category: 'event', tags: ['christmas', 'winter'], usageCount: 30, linkedTracks: ['track4'], createdAt: '2026-01-07', createdBy: 'Otte' },
		{ id: 'e2', content: '생일', category: 'event', tags: ['birthday'], usageCount: 18, linkedTracks: ['track1'], createdAt: '2026-01-06', createdBy: 'El' },
		{ id: 'e3', content: '발렌타인', category: 'event', tags: ['valentine', 'love'], usageCount: 22, linkedTracks: ['track2', 'track3'], createdAt: '2026-01-05', createdBy: 'Otte' },
		{ id: 'e4', content: '졸업', category: 'event', tags: ['graduation'], usageCount: 15, linkedTracks: ['track1'], createdAt: '2026-01-04', createdBy: 'El' },
		{ id: 'e5', content: '새해', category: 'event', tags: ['newyear'], usageCount: 20, linkedTracks: ['track4'], createdAt: '2026-01-03', createdBy: 'Otte' },
		{ id: 'e6', content: '결혼식', category: 'event', tags: ['wedding'], usageCount: 12, linkedTracks: ['track2'], createdAt: '2026-01-02', createdBy: 'El' },
		{ id: 'e7', content: '파티', category: 'event', tags: ['party'], usageCount: 25, linkedTracks: ['track1', 'track3'], createdAt: '2026-01-01', createdBy: 'Otte' },
		{ id: 'e8', content: '축제', category: 'event', tags: ['festival'], usageCount: 16, linkedTracks: ['track2'], createdAt: '2025-12-31', createdBy: 'El' },
		{ id: 'e9', content: '데이트', category: 'event', tags: ['date', 'love'], usageCount: 28, linkedTracks: ['track1', 'track4'], createdAt: '2025-12-30', createdBy: 'Otte' },
		{ id: 'e10', content: '여행', category: 'event', tags: ['travel'], usageCount: 21, linkedTracks: ['track3'], createdAt: '2025-12-29', createdBy: 'El' },
		
		// ==================== 감정 (emotion) ====================
		{ id: 'em1', content: '설레는 마음', category: 'emotion', tags: ['excited', 'love'], usageCount: 35, linkedTracks: ['track1', 'track2', 'track3'], createdAt: '2026-01-06', createdBy: 'El' },
		{ id: 'em2', content: '행복', category: 'emotion', tags: ['happy'], usageCount: 28, linkedTracks: ['track1', 'track4'], createdAt: '2026-01-05', createdBy: 'Otte' },
		{ id: 'em3', content: '슬픔', category: 'emotion', tags: ['sad'], usageCount: 22, linkedTracks: ['track2'], createdAt: '2026-01-04', createdBy: 'El' },
		{ id: 'em4', content: '그리움', category: 'emotion', tags: ['longing', 'miss'], usageCount: 30, linkedTracks: ['track1', 'track3'], createdAt: '2026-01-03', createdBy: 'Otte' },
		{ id: 'em5', content: '사랑', category: 'emotion', tags: ['love'], usageCount: 40, linkedTracks: ['track1', 'track2', 'track3', 'track4'], createdAt: '2026-01-02', createdBy: 'El' },
		{ id: 'em6', content: '외로움', category: 'emotion', tags: ['lonely'], usageCount: 18, linkedTracks: ['track2'], createdAt: '2026-01-01', createdBy: 'Otte' },
		{ id: 'em7', content: '분노', category: 'emotion', tags: ['angry'], usageCount: 10, linkedTracks: [], createdAt: '2025-12-31', createdBy: 'El' },
		{ id: 'em8', content: '기쁨', category: 'emotion', tags: ['joy'], usageCount: 25, linkedTracks: ['track1', 'track4'], createdAt: '2025-12-30', createdBy: 'Otte' },
		{ id: 'em9', content: '불안', category: 'emotion', tags: ['anxious'], usageCount: 12, linkedTracks: ['track3'], createdAt: '2025-12-29', createdBy: 'El' },
		{ id: 'em10', content: '감사', category: 'emotion', tags: ['grateful'], usageCount: 15, linkedTracks: ['track2'], createdAt: '2025-12-28', createdBy: 'Otte' },
		{ id: 'em11', content: '두근거림', category: 'emotion', tags: ['heartbeat', 'excited'], usageCount: 32, linkedTracks: ['track1', 'track2'], createdAt: '2025-12-27', createdBy: 'El' },
		{ id: 'em12', content: '평온', category: 'emotion', tags: ['peace', 'calm'], usageCount: 14, linkedTracks: ['track4'], createdAt: '2025-12-26', createdBy: 'Otte' },
		
		// ==================== 장소 (place) ====================
		{ id: 'p1', content: '해변가', category: 'place', tags: ['beach', 'sea'], usageCount: 22, linkedTracks: ['track2'], createdAt: '2026-01-05', createdBy: 'Otte' },
		{ id: 'p2', content: '도시의 밤', category: 'place', tags: ['city', 'night'], usageCount: 18, linkedTracks: ['track1', 'track3'], createdAt: '2026-01-04', createdBy: 'El' },
		{ id: 'p3', content: '카페', category: 'place', tags: ['cafe'], usageCount: 15, linkedTracks: ['track2'], createdAt: '2026-01-03', createdBy: 'Otte' },
		{ id: 'p4', content: '공원', category: 'place', tags: ['park'], usageCount: 12, linkedTracks: ['track1'], createdAt: '2026-01-02', createdBy: 'El' },
		{ id: 'p5', content: '놀이공원', category: 'place', tags: ['amusement', 'park'], usageCount: 16, linkedTracks: ['track4'], createdAt: '2026-01-01', createdBy: 'Otte' },
		{ id: 'p6', content: '학교', category: 'place', tags: ['school'], usageCount: 20, linkedTracks: ['track1', 'track2'], createdAt: '2025-12-31', createdBy: 'El' },
		{ id: 'p7', content: '옥상', category: 'place', tags: ['rooftop'], usageCount: 14, linkedTracks: ['track3'], createdAt: '2025-12-30', createdBy: 'Otte' },
		{ id: 'p8', content: '거리', category: 'place', tags: ['street'], usageCount: 11, linkedTracks: ['track2'], createdAt: '2025-12-29', createdBy: 'El' },
		{ id: 'p9', content: '바닷가', category: 'place', tags: ['seaside'], usageCount: 19, linkedTracks: ['track1', 'track4'], createdAt: '2025-12-28', createdBy: 'Otte' },
		{ id: 'p10', content: '숲속', category: 'place', tags: ['forest'], usageCount: 10, linkedTracks: [], createdAt: '2025-12-27', createdBy: 'El' },
		
		// ==================== 시간 (time) ====================
		{ id: 'tm1', content: '새벽 3시', category: 'time', tags: ['dawn', 'night'], usageCount: 18, linkedTracks: [], createdAt: '2026-01-13', createdBy: 'El' },
		{ id: 'tm2', content: '한밤중', category: 'time', tags: ['midnight'], usageCount: 22, linkedTracks: ['track1', 'track3'], createdAt: '2026-01-12', createdBy: 'Otte' },
		{ id: 'tm3', content: '석양', category: 'time', tags: ['sunset'], usageCount: 25, linkedTracks: ['track2', 'track4'], createdAt: '2026-01-11', createdBy: 'El' },
		{ id: 'tm4', content: '새벽녘', category: 'time', tags: ['dawn'], usageCount: 16, linkedTracks: ['track1'], createdAt: '2026-01-10', createdBy: 'Otte' },
		{ id: 'tm5', content: '오후의 햇살', category: 'time', tags: ['afternoon', 'sun'], usageCount: 14, linkedTracks: ['track2'], createdAt: '2026-01-09', createdBy: 'El' },
		{ id: 'tm6', content: '여름밤', category: 'time', tags: ['summer', 'night'], usageCount: 28, linkedTracks: ['track1', 'track3', 'track4'], createdAt: '2026-01-08', createdBy: 'Otte' },
		{ id: 'tm7', content: '황혼', category: 'time', tags: ['twilight'], usageCount: 12, linkedTracks: [], createdAt: '2026-01-07', createdBy: 'El' },
		{ id: 'tm8', content: '아침', category: 'time', tags: ['morning'], usageCount: 15, linkedTracks: ['track2'], createdAt: '2026-01-06', createdBy: 'Otte' },
		{ id: 'tm9', content: '달빛 아래', category: 'time', tags: ['moonlight', 'night'], usageCount: 20, linkedTracks: ['track1', 'track4'], createdAt: '2026-01-05', createdBy: 'El' },
		{ id: 'tm10', content: '별빛 가득한 밤', category: 'time', tags: ['starlight', 'night'], usageCount: 24, linkedTracks: ['track2', 'track3'], createdAt: '2026-01-04', createdBy: 'Otte' },
		
		// ==================== 사물 (object) ====================
		{ id: 'o1', content: '빈티지 카메라', category: 'object', tags: ['vintage', 'camera'], usageCount: 8, linkedTracks: [], createdAt: '2026-01-13', createdBy: 'Otte' },
		{ id: 'o2', content: '편지', category: 'object', tags: ['letter'], usageCount: 15, linkedTracks: ['track1', 'track2'], createdAt: '2026-01-12', createdBy: 'El' },
		{ id: 'o3', content: '오래된 사진', category: 'object', tags: ['photo', 'old'], usageCount: 12, linkedTracks: ['track3'], createdAt: '2026-01-11', createdBy: 'Otte' },
		{ id: 'o4', content: '우산', category: 'object', tags: ['umbrella'], usageCount: 10, linkedTracks: ['track1'], createdAt: '2026-01-10', createdBy: 'El' },
		{ id: 'o5', content: '꽃다발', category: 'object', tags: ['flower', 'bouquet'], usageCount: 14, linkedTracks: ['track2', 'track4'], createdAt: '2026-01-09', createdBy: 'Otte' },
		{ id: 'o6', content: '다이어리', category: 'object', tags: ['diary'], usageCount: 9, linkedTracks: [], createdAt: '2026-01-08', createdBy: 'El' },
		{ id: 'o7', content: '반지', category: 'object', tags: ['ring'], usageCount: 16, linkedTracks: ['track1', 'track3'], createdAt: '2026-01-07', createdBy: 'Otte' },
		{ id: 'o8', content: '커피 한 잔', category: 'object', tags: ['coffee'], usageCount: 11, linkedTracks: ['track2'], createdAt: '2026-01-06', createdBy: 'El' },
		{ id: 'o9', content: '헤드폰', category: 'object', tags: ['headphone', 'music'], usageCount: 13, linkedTracks: ['track4'], createdAt: '2026-01-05', createdBy: 'Otte' },
		{ id: 'o10', content: '촛불', category: 'object', tags: ['candle'], usageCount: 7, linkedTracks: [], createdAt: '2026-01-04', createdBy: 'El' },
		
		// ==================== 문장 (phrase) ====================
		{ id: 'ph1', content: '너와 함께라면 어디든', category: 'phrase', tags: ['love', 'together'], usageCount: 28, linkedTracks: ['track1', 'track3'], createdAt: '2026-01-04', createdBy: 'El' },
		{ id: 'ph2', content: '다시 만나게 될까', category: 'phrase', tags: ['reunion', 'hope'], usageCount: 22, linkedTracks: ['track2'], createdAt: '2026-01-03', createdBy: 'Otte' },
		{ id: 'ph3', content: '이 순간을 영원히', category: 'phrase', tags: ['forever', 'moment'], usageCount: 25, linkedTracks: ['track1', 'track4'], createdAt: '2026-01-02', createdBy: 'El' },
		{ id: 'ph4', content: '널 잊을 수 없어', category: 'phrase', tags: ['love', 'memory'], usageCount: 20, linkedTracks: ['track2', 'track3'], createdAt: '2026-01-01', createdBy: 'Otte' },
		{ id: 'ph5', content: '우리의 이야기', category: 'phrase', tags: ['story', 'us'], usageCount: 18, linkedTracks: ['track1'], createdAt: '2025-12-31', createdBy: 'El' },
		{ id: 'ph6', content: '그때로 돌아가고 싶어', category: 'phrase', tags: ['past', 'nostalgia'], usageCount: 15, linkedTracks: ['track2'], createdAt: '2025-12-30', createdBy: 'Otte' },
		{ id: 'ph7', content: '오늘도 널 생각해', category: 'phrase', tags: ['thinking', 'love'], usageCount: 24, linkedTracks: ['track1', 'track3', 'track4'], createdAt: '2025-12-29', createdBy: 'El' },
		{ id: 'ph8', content: '언젠가 다시', category: 'phrase', tags: ['someday', 'again'], usageCount: 12, linkedTracks: [], createdAt: '2025-12-28', createdBy: 'Otte' },
		{ id: 'ph9', content: '네가 내 곁에 있다면', category: 'phrase', tags: ['together', 'love'], usageCount: 30, linkedTracks: ['track1', 'track2'], createdAt: '2025-12-27', createdBy: 'El' },
		{ id: 'ph10', content: '시간이 멈춘다면', category: 'phrase', tags: ['time', 'stop'], usageCount: 16, linkedTracks: ['track3'], createdAt: '2025-12-26', createdBy: 'Otte' },
		{ id: 'ph11', content: '별처럼 빛나는 너', category: 'phrase', tags: ['star', 'shine'], usageCount: 22, linkedTracks: ['track1', 'track4'], createdAt: '2025-12-25', createdBy: 'El' },
		{ id: 'ph12', content: '꿈에서라도 만나고 싶어', category: 'phrase', tags: ['dream', 'meet'], usageCount: 19, linkedTracks: ['track2'], createdAt: '2025-12-24', createdBy: 'Otte' },
		
		// ==================== 장르 (genre) - 신규 ====================
		{ id: 'g1', content: 'K-Pop', category: 'genre', tags: ['kpop', 'korean'], usageCount: 45, linkedTracks: ['track1', 'track2', 'track3', 'track4'], createdAt: '2026-01-12', createdBy: 'El' },
		{ id: 'g2', content: 'K-R&B', category: 'genre', tags: ['krb', 'rnb'], usageCount: 32, linkedTracks: ['track1', 'track3'], createdAt: '2026-01-11', createdBy: 'Otte' },
		{ id: 'g3', content: 'Korean Ballad', category: 'genre', tags: ['ballad', 'korean'], usageCount: 38, linkedTracks: ['track2', 'track4'], createdAt: '2026-01-10', createdBy: 'El' },
		{ id: 'g4', content: 'EDM', category: 'genre', tags: ['edm', 'electronic'], usageCount: 28, linkedTracks: ['track1'], createdAt: '2026-01-09', createdBy: 'Otte' },
		{ id: 'g5', content: 'Future Bass', category: 'genre', tags: ['future', 'bass'], usageCount: 22, linkedTracks: ['track2', 'track3'], createdAt: '2026-01-08', createdBy: 'El' },
		{ id: 'g6', content: 'Hip Hop', category: 'genre', tags: ['hiphop', 'rap'], usageCount: 25, linkedTracks: ['track1', 'track4'], createdAt: '2026-01-07', createdBy: 'Otte' },
		{ id: 'g7', content: 'Lo-Fi', category: 'genre', tags: ['lofi', 'chill'], usageCount: 30, linkedTracks: ['track2'], createdAt: '2026-01-06', createdBy: 'El' },
		{ id: 'g8', content: 'City Pop', category: 'genre', tags: ['citypop', 'retro'], usageCount: 26, linkedTracks: ['track1', 'track3'], createdAt: '2026-01-05', createdBy: 'Otte' },
		{ id: 'g9', content: 'Synth Pop', category: 'genre', tags: ['synthpop', '80s'], usageCount: 20, linkedTracks: ['track4'], createdAt: '2026-01-04', createdBy: 'El' },
		{ id: 'g10', content: 'Indie Pop', category: 'genre', tags: ['indie', 'pop'], usageCount: 24, linkedTracks: ['track1', 'track2'], createdAt: '2026-01-03', createdBy: 'Otte' },
		{ id: 'g11', content: 'Tropical House', category: 'genre', tags: ['tropical', 'house'], usageCount: 18, linkedTracks: ['track3'], createdAt: '2026-01-02', createdBy: 'El' },
		{ id: 'g12', content: 'J-Pop', category: 'genre', tags: ['jpop', 'japanese'], usageCount: 22, linkedTracks: ['track1', 'track4'], createdAt: '2026-01-01', createdBy: 'Otte' },
		{ id: 'g13', content: 'Jazz', category: 'genre', tags: ['jazz'], usageCount: 15, linkedTracks: ['track2'], createdAt: '2025-12-31', createdBy: 'El' },
		{ id: 'g14', content: 'Bossa Nova', category: 'genre', tags: ['bossa', 'brazilian'], usageCount: 12, linkedTracks: [], createdAt: '2025-12-30', createdBy: 'Otte' },
		{ id: 'g15', content: 'Acoustic', category: 'genre', tags: ['acoustic'], usageCount: 20, linkedTracks: ['track1', 'track3'], createdAt: '2025-12-29', createdBy: 'El' },
		
		// ==================== 악기 (instrument) - 신규 ====================
		{ id: 'i1', content: 'piano', category: 'instrument', tags: ['piano', 'keys'], usageCount: 35, linkedTracks: ['track1', 'track2', 'track4'], createdAt: '2026-01-12', createdBy: 'El' },
		{ id: 'i2', content: 'acoustic guitar', category: 'instrument', tags: ['guitar', 'acoustic'], usageCount: 28, linkedTracks: ['track1', 'track3'], createdAt: '2026-01-11', createdBy: 'Otte' },
		{ id: 'i3', content: 'electric guitar', category: 'instrument', tags: ['guitar', 'electric'], usageCount: 22, linkedTracks: ['track2'], createdAt: '2026-01-10', createdBy: 'El' },
		{ id: 'i4', content: 'synthesizer', category: 'instrument', tags: ['synth', 'electronic'], usageCount: 40, linkedTracks: ['track1', 'track2', 'track3', 'track4'], createdAt: '2026-01-09', createdBy: 'Otte' },
		{ id: 'i5', content: 'strings', category: 'instrument', tags: ['strings', 'orchestra'], usageCount: 30, linkedTracks: ['track2', 'track4'], createdAt: '2026-01-08', createdBy: 'El' },
		{ id: 'i6', content: 'drums', category: 'instrument', tags: ['drums', 'percussion'], usageCount: 25, linkedTracks: ['track1', 'track3'], createdAt: '2026-01-07', createdBy: 'Otte' },
		{ id: 'i7', content: 'bass', category: 'instrument', tags: ['bass'], usageCount: 20, linkedTracks: ['track2'], createdAt: '2026-01-06', createdBy: 'El' },
		{ id: 'i8', content: 'saxophone', category: 'instrument', tags: ['sax', 'brass'], usageCount: 15, linkedTracks: ['track4'], createdAt: '2026-01-05', createdBy: 'Otte' },
		{ id: 'i9', content: 'violin', category: 'instrument', tags: ['violin', 'strings'], usageCount: 18, linkedTracks: ['track1'], createdAt: '2026-01-04', createdBy: 'El' },
		{ id: 'i10', content: 'trumpet', category: 'instrument', tags: ['trumpet', 'brass'], usageCount: 12, linkedTracks: [], createdAt: '2026-01-03', createdBy: 'Otte' },
		{ id: 'i11', content: 'flute', category: 'instrument', tags: ['flute', 'woodwind'], usageCount: 10, linkedTracks: ['track3'], createdAt: '2026-01-02', createdBy: 'El' },
		{ id: 'i12', content: 'harp', category: 'instrument', tags: ['harp'], usageCount: 8, linkedTracks: ['track2'], createdAt: '2026-01-01', createdBy: 'Otte' },
		{ id: 'i13', content: 'ukulele', category: 'instrument', tags: ['ukulele'], usageCount: 14, linkedTracks: ['track1', 'track4'], createdAt: '2025-12-31', createdBy: 'El' },
		{ id: 'i14', content: 'cello', category: 'instrument', tags: ['cello', 'strings'], usageCount: 16, linkedTracks: ['track2', 'track3'], createdAt: '2025-12-30', createdBy: 'Otte' },
		{ id: 'i15', content: '808 drums', category: 'instrument', tags: ['808', 'drums', 'hiphop'], usageCount: 22, linkedTracks: ['track1'], createdAt: '2025-12-29', createdBy: 'El' },
		
		// ==================== 보컬 (vocal) - 신규 ====================
		{ id: 'v1', content: 'soft female vocals', category: 'vocal', tags: ['soft', 'female'], usageCount: 38, linkedTracks: ['track1', 'track2', 'track4'], createdAt: '2026-01-12', createdBy: 'El' },
		{ id: 'v2', content: 'powerful female vocals', category: 'vocal', tags: ['powerful', 'female'], usageCount: 32, linkedTracks: ['track1', 'track3'], createdAt: '2026-01-11', createdBy: 'Otte' },
		{ id: 'v3', content: 'smooth male vocals', category: 'vocal', tags: ['smooth', 'male'], usageCount: 28, linkedTracks: ['track2'], createdAt: '2026-01-10', createdBy: 'El' },
		{ id: 'v4', content: 'deep male vocals', category: 'vocal', tags: ['deep', 'male'], usageCount: 22, linkedTracks: ['track1', 'track4'], createdAt: '2026-01-09', createdBy: 'Otte' },
		{ id: 'v5', content: 'breathy vocals', category: 'vocal', tags: ['breathy', 'airy'], usageCount: 30, linkedTracks: ['track2', 'track3'], createdAt: '2026-01-08', createdBy: 'El' },
		{ id: 'v6', content: 'ethereal vocals', category: 'vocal', tags: ['ethereal', 'dreamy'], usageCount: 35, linkedTracks: ['track1', 'track2', 'track4'], createdAt: '2026-01-07', createdBy: 'Otte' },
		{ id: 'v7', content: 'harmonized vocals', category: 'vocal', tags: ['harmony', 'choir'], usageCount: 25, linkedTracks: ['track3'], createdAt: '2026-01-06', createdBy: 'El' },
		{ id: 'v8', content: 'whispered vocals', category: 'vocal', tags: ['whisper', 'intimate'], usageCount: 18, linkedTracks: ['track1'], createdAt: '2026-01-05', createdBy: 'Otte' },
		{ id: 'v9', content: 'soulful vocals', category: 'vocal', tags: ['soul', 'emotional'], usageCount: 26, linkedTracks: ['track2', 'track4'], createdAt: '2026-01-04', createdBy: 'El' },
		{ id: 'v10', content: 'raspy vocals', category: 'vocal', tags: ['raspy', 'gritty'], usageCount: 15, linkedTracks: [], createdAt: '2026-01-03', createdBy: 'Otte' },
		{ id: 'v11', content: 'high-pitched female vocals', category: 'vocal', tags: ['high', 'female'], usageCount: 20, linkedTracks: ['track1', 'track3'], createdAt: '2026-01-02', createdBy: 'El' },
		{ id: 'v12', content: 'duet', category: 'vocal', tags: ['duet', 'harmony'], usageCount: 22, linkedTracks: ['track2'], createdAt: '2026-01-01', createdBy: 'Otte' },
		
		// ==================== 템포 (tempo) - 신규 ====================
		{ id: 'tp1', content: 'slow tempo', category: 'tempo', tags: ['slow', 'ballad'], usageCount: 28, linkedTracks: ['track2', 'track4'], createdAt: '2026-01-12', createdBy: 'El' },
		{ id: 'tp2', content: 'mid-tempo', category: 'tempo', tags: ['mid', 'moderate'], usageCount: 35, linkedTracks: ['track1', 'track2', 'track3'], createdAt: '2026-01-11', createdBy: 'Otte' },
		{ id: 'tp3', content: 'upbeat', category: 'tempo', tags: ['upbeat', 'fast'], usageCount: 32, linkedTracks: ['track1', 'track4'], createdAt: '2026-01-10', createdBy: 'El' },
		{ id: 'tp4', content: 'fast tempo', category: 'tempo', tags: ['fast', 'energetic'], usageCount: 25, linkedTracks: ['track3'], createdAt: '2026-01-09', createdBy: 'Otte' },
		{ id: 'tp5', content: 'groovy', category: 'tempo', tags: ['groove', 'funky'], usageCount: 22, linkedTracks: ['track1', 'track2'], createdAt: '2026-01-08', createdBy: 'El' },
		{ id: 'tp6', content: 'steady beat', category: 'tempo', tags: ['steady', 'consistent'], usageCount: 20, linkedTracks: ['track4'], createdAt: '2026-01-07', createdBy: 'Otte' },
		{ id: 'tp7', content: 'syncopated rhythm', category: 'tempo', tags: ['syncopated', 'rhythm'], usageCount: 18, linkedTracks: ['track1'], createdAt: '2026-01-06', createdBy: 'El' },
		{ id: 'tp8', content: 'driving beat', category: 'tempo', tags: ['driving', 'intense'], usageCount: 24, linkedTracks: ['track2', 'track3'], createdAt: '2026-01-05', createdBy: 'Otte' },
		{ id: 'tp9', content: 'laid-back groove', category: 'tempo', tags: ['laid-back', 'relaxed'], usageCount: 26, linkedTracks: ['track1', 'track4'], createdAt: '2026-01-04', createdBy: 'El' },
		{ id: 'tp10', content: 'danceable', category: 'tempo', tags: ['dance', 'club'], usageCount: 30, linkedTracks: ['track2'], createdAt: '2026-01-03', createdBy: 'Otte' },
		
		// ==================== 언어 (language) - 신규 ====================
		{ id: 'l1', content: 'Korean lyrics', category: 'language', tags: ['korean', 'hangul'], usageCount: 45, linkedTracks: ['track1', 'track2', 'track3', 'track4'], createdAt: '2026-01-12', createdBy: 'El' },
		{ id: 'l2', content: 'English lyrics', category: 'language', tags: ['english'], usageCount: 38, linkedTracks: ['track1', 'track3'], createdAt: '2026-01-11', createdBy: 'Otte' },
		{ id: 'l3', content: 'Japanese lyrics', category: 'language', tags: ['japanese'], usageCount: 22, linkedTracks: ['track2', 'track4'], createdAt: '2026-01-10', createdBy: 'El' },
		{ id: 'l4', content: 'Korean-English mixed', category: 'language', tags: ['korean', 'english', 'mixed'], usageCount: 32, linkedTracks: ['track1', 'track2'], createdAt: '2026-01-09', createdBy: 'Otte' },
		{ id: 'l5', content: 'instrumental', category: 'language', tags: ['instrumental', 'no vocals'], usageCount: 28, linkedTracks: ['track3'], createdAt: '2026-01-08', createdBy: 'El' },
		{ id: 'l6', content: 'humming', category: 'language', tags: ['humming', 'wordless'], usageCount: 15, linkedTracks: ['track4'], createdAt: '2026-01-07', createdBy: 'Otte' },
		{ id: 'l7', content: 'vocaloid style', category: 'language', tags: ['vocaloid', 'synth'], usageCount: 18, linkedTracks: ['track1'], createdAt: '2026-01-06', createdBy: 'El' },
		{ id: 'l8', content: 'la la la', category: 'language', tags: ['lalala', 'sing-along'], usageCount: 20, linkedTracks: ['track2', 'track3'], createdAt: '2026-01-05', createdBy: 'Otte' },
		
		// ==================== 바이브 (vibe) - 신규 ====================
		{ id: 'vb1', content: 'retro 80s', category: 'vibe', tags: ['retro', '80s'], usageCount: 28, linkedTracks: ['track1', 'track4'], createdAt: '2026-01-12', createdBy: 'El' },
		{ id: 'vb2', content: 'futuristic', category: 'vibe', tags: ['future', 'modern'], usageCount: 24, linkedTracks: ['track2', 'track3'], createdAt: '2026-01-11', createdBy: 'Otte' },
		{ id: 'vb3', content: 'nostalgic', category: 'vibe', tags: ['nostalgia', 'memory'], usageCount: 32, linkedTracks: ['track1', 'track2'], createdAt: '2026-01-10', createdBy: 'El' },
		{ id: 'vb4', content: 'romantic', category: 'vibe', tags: ['romantic', 'love'], usageCount: 38, linkedTracks: ['track1', 'track3', 'track4'], createdAt: '2026-01-09', createdBy: 'Otte' },
		{ id: 'vb5', content: 'cinematic', category: 'vibe', tags: ['cinematic', 'epic'], usageCount: 22, linkedTracks: ['track2'], createdAt: '2026-01-08', createdBy: 'El' },
		{ id: 'vb6', content: 'chill', category: 'vibe', tags: ['chill', 'relaxed'], usageCount: 35, linkedTracks: ['track1', 'track4'], createdAt: '2026-01-07', createdBy: 'Otte' },
		{ id: 'vb7', content: 'energetic', category: 'vibe', tags: ['energy', 'dynamic'], usageCount: 30, linkedTracks: ['track2', 'track3'], createdAt: '2026-01-06', createdBy: 'El' },
		{ id: 'vb8', content: 'melancholic', category: 'vibe', tags: ['melancholy', 'sad'], usageCount: 26, linkedTracks: ['track1'], createdAt: '2026-01-05', createdBy: 'Otte' },
		{ id: 'vb9', content: 'uplifting', category: 'vibe', tags: ['uplifting', 'positive'], usageCount: 28, linkedTracks: ['track2', 'track4'], createdAt: '2026-01-04', createdBy: 'El' },
		{ id: 'vb10', content: 'dark', category: 'vibe', tags: ['dark', 'moody'], usageCount: 18, linkedTracks: ['track3'], createdAt: '2026-01-03', createdBy: 'Otte' },
		{ id: 'vb11', content: 'playful', category: 'vibe', tags: ['playful', 'fun'], usageCount: 24, linkedTracks: ['track1', 'track4'], createdAt: '2026-01-02', createdBy: 'El' },
		{ id: 'vb12', content: 'sensual', category: 'vibe', tags: ['sensual', 'sexy'], usageCount: 20, linkedTracks: ['track2'], createdAt: '2026-01-01', createdBy: 'Otte' },
		
		// ==================== 스타일 (style) - SUNO 프롬프트 확장 ====================
		{ id: 'st1', content: 'dreamy synth-pop with ethereal vocals', category: 'style', tags: ['synth', 'dreamy'], usageCount: 42, linkedTracks: ['track1', 'track2', 'track3', 'track4'], createdAt: '2026-01-03', createdBy: 'El' },
		{ id: 'st2', content: 'K-pop dance track with catchy hooks', category: 'style', tags: ['kpop', 'dance'], usageCount: 48, linkedTracks: ['track1', 'track2'], createdAt: '2026-01-02', createdBy: 'Otte' },
		{ id: 'st3', content: 'emotional Korean ballad with piano', category: 'style', tags: ['ballad', 'piano'], usageCount: 38, linkedTracks: ['track3', 'track4'], createdAt: '2026-01-01', createdBy: 'El' },
		{ id: 'st4', content: 'lo-fi hip hop with jazz samples', category: 'style', tags: ['lofi', 'jazz'], usageCount: 32, linkedTracks: ['track1'], createdAt: '2025-12-31', createdBy: 'Otte' },
		{ id: 'st5', content: 'future bass with heavy drops', category: 'style', tags: ['future', 'bass'], usageCount: 28, linkedTracks: ['track2', 'track3'], createdAt: '2025-12-30', createdBy: 'El' },
		{ id: 'st6', content: 'city pop with funky bass lines', category: 'style', tags: ['citypop', 'funk'], usageCount: 30, linkedTracks: ['track1', 'track4'], createdAt: '2025-12-29', createdBy: 'Otte' },
		{ id: 'st7', content: 'indie pop with acoustic guitar', category: 'style', tags: ['indie', 'acoustic'], usageCount: 26, linkedTracks: ['track2'], createdAt: '2025-12-28', createdBy: 'El' },
		{ id: 'st8', content: 'R&B with smooth vocals and 808 drums', category: 'style', tags: ['rnb', '808'], usageCount: 34, linkedTracks: ['track1', 'track3'], createdAt: '2025-12-27', createdBy: 'Otte' },
		{ id: 'st9', content: 'tropical house with summer vibes', category: 'style', tags: ['tropical', 'summer'], usageCount: 24, linkedTracks: ['track4'], createdAt: '2025-12-26', createdBy: 'El' },
		{ id: 'st10', content: 'ambient electronic with atmospheric pads', category: 'style', tags: ['ambient', 'electronic'], usageCount: 20, linkedTracks: ['track2'], createdAt: '2025-12-25', createdBy: 'Otte' },
		{ id: 'st11', content: 'J-pop anime opening style', category: 'style', tags: ['jpop', 'anime'], usageCount: 28, linkedTracks: ['track1', 'track3'], createdAt: '2025-12-24', createdBy: 'El' },
		{ id: 'st12', content: 'retro synthwave with 80s nostalgia', category: 'style', tags: ['synthwave', 'retro'], usageCount: 26, linkedTracks: ['track4'], createdAt: '2025-12-23', createdBy: 'Otte' },
		{ id: 'st13', content: 'chill acoustic with soft harmonies', category: 'style', tags: ['chill', 'acoustic'], usageCount: 22, linkedTracks: ['track1', 'track2'], createdAt: '2025-12-22', createdBy: 'El' },
		{ id: 'st14', content: 'EDM festival anthem', category: 'style', tags: ['edm', 'festival'], usageCount: 30, linkedTracks: ['track3'], createdAt: '2025-12-21', createdBy: 'Otte' },
		{ id: 'st15', content: 'jazzy neo-soul with live instruments', category: 'style', tags: ['jazz', 'neosoul'], usageCount: 18, linkedTracks: ['track2', 'track4'], createdAt: '2025-12-20', createdBy: 'El' },
		
		// ==================== 제외 (exclude) - SUNO 제외 스타일 확장 ====================
		{ id: 'ex1', content: 'heavy metal, screaming', category: 'exclude', tags: ['metal'], usageCount: 35, linkedTracks: ['track1', 'track2'], createdAt: '2026-01-02', createdBy: 'Otte' },
		{ id: 'ex2', content: 'aggressive, harsh', category: 'exclude', tags: ['aggressive'], usageCount: 28, linkedTracks: ['track1'], createdAt: '2026-01-01', createdBy: 'El' },
		{ id: 'ex3', content: 'death metal, growling', category: 'exclude', tags: ['death', 'metal'], usageCount: 22, linkedTracks: ['track3'], createdAt: '2025-12-31', createdBy: 'Otte' },
		{ id: 'ex4', content: 'distorted, noisy', category: 'exclude', tags: ['distortion', 'noise'], usageCount: 25, linkedTracks: ['track2'], createdAt: '2025-12-30', createdBy: 'El' },
		{ id: 'ex5', content: 'off-key, out of tune', category: 'exclude', tags: ['offkey'], usageCount: 30, linkedTracks: ['track1', 'track4'], createdAt: '2025-12-29', createdBy: 'Otte' },
		{ id: 'ex6', content: 'mumble rap', category: 'exclude', tags: ['mumble', 'rap'], usageCount: 18, linkedTracks: [], createdAt: '2025-12-28', createdBy: 'El' },
		{ id: 'ex7', content: 'autotune heavy', category: 'exclude', tags: ['autotune'], usageCount: 20, linkedTracks: ['track2'], createdAt: '2025-12-27', createdBy: 'Otte' },
		{ id: 'ex8', content: 'children choir', category: 'exclude', tags: ['children', 'choir'], usageCount: 15, linkedTracks: ['track3'], createdAt: '2025-12-26', createdBy: 'El' },
		{ id: 'ex9', content: 'country twang', category: 'exclude', tags: ['country', 'twang'], usageCount: 12, linkedTracks: [], createdAt: '2025-12-25', createdBy: 'Otte' },
		{ id: 'ex10', content: 'opera, classical vocals', category: 'exclude', tags: ['opera', 'classical'], usageCount: 16, linkedTracks: ['track1'], createdAt: '2025-12-24', createdBy: 'El' }
	]);

	// 필터 상태
	let searchQuery = $state('');
	let selectedCategory = $state<WordCategory | 'all'>('all');
	let selectedCreator = $state<Producer | 'all'>('all');
	let categoryDropdownOpen = $state(false);
	let creatorDropdownOpen = $state(false);
	
	// 정렬 상태
	type SortOption = 'usage_desc' | 'usage_asc' | 'created_desc' | 'created_asc' | 'content_asc' | 'content_desc';
	let sortBy = $state<SortOption>('usage_desc');
	let sortDropdownOpen = $state(false);
	
	const sortLabels: Record<SortOption, string> = {
		usage_desc: '사용 많은순',
		usage_asc: '사용 적은순',
		created_desc: '최근 생성순',
		created_asc: '오래된 생성순',
		content_asc: '이름순 (ㄱ-ㅎ)',
		content_desc: '이름순 (ㅎ-ㄱ)'
	};
	
	const creatorLabels: Record<Producer | 'all', string> = {
		all: '전체',
		El: 'El',
		Otte: 'Otte'
	};

	// 새 항목 추가 모달 상태
	let showAddModal = $state(false);
	let newWord = $state({
		content: '',
		category: 'topic' as WordCategory,
		tags: '',
		createdBy: 'El' as Producer
	});

	// 연결된 트랙 팝업 상태
	let linkedTracksPopup = $state<{ wordId: string; tracks: string[]; position: { x: number; y: number } } | null>(null);
	
	// 연결된 트랙 정렬 상태: 'default' | 'title' | 'status'
	let linkedTracksSortBy = $state<'default' | 'title' | 'status'>('default');

	// 목업 트랙 데이터 (실제로는 API에서 가져옴)
	const trackData: Record<string, { title: string; status: string }> = {
		'track1': { title: '달콤한 밤', status: '제작 중' },
		'track2': { title: '여름의 끝', status: '완료' },
		'track3': { title: '첫눈이 내리면', status: '아이디어' },
		'track4': { title: '네온 시티', status: '제작 중' },
		'track5': { title: '별빛 아래서', status: '완료' },
		'track6': { title: '새벽 3시', status: '제작 중' },
		'track7': { title: '너의 목소리', status: '완료' },
		'track8': { title: '파도처럼', status: '아이디어' },
		'track9': { title: '봄날의 기억', status: '제작 중' },
		'track10': { title: '밤하늘 수놓은', status: '완료' },
		'track11': { title: '끝없는 여정', status: '아이디어' },
		'track12': { title: '마지막 춤', status: '제작 중' }
	};

	// 상태 우선순위 맵
	const statusOrder: Record<string, number> = {
		'아이디어': 0,
		'제작 중': 1,
		'완료': 2
	};

	// 상태별 색상 클래스 (프로젝트 페이지와 동일)
	function getTrackStatusColor(status: string): string {
		switch (status) {
			case '아이디어': return 'text-yellow-500 dark:text-yellow-400';
			case '제작 중': return 'text-brand-pink';
			case '완료': return 'text-green-600 dark:text-green-400';
			default: return 'text-text-muted';
		}
	}

	// 정렬된 트랙 리스트
	const sortedLinkedTracks = $derived.by(() => {
		if (!linkedTracksPopup) return [];
		const tracks = [...linkedTracksPopup.tracks];
		
		if (linkedTracksSortBy === 'title') {
			return tracks.sort((a, b) => {
				const titleA = trackData[a]?.title || a;
				const titleB = trackData[b]?.title || b;
				return titleA.localeCompare(titleB);
			});
		} else if (linkedTracksSortBy === 'status') {
			return tracks.sort((a, b) => {
				const statusA = statusOrder[trackData[a]?.status] ?? 99;
				const statusB = statusOrder[trackData[b]?.status] ?? 99;
				return statusA - statusB;
			});
		}
		return tracks;
	});

	// 연결된 트랙 팝업 열기
	function openLinkedTracksPopup(wordId: string, tracks: string[], event: MouseEvent) {
		event.stopPropagation();
		const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
		// 팝업을 버튼 왼쪽 정렬 (오른쪽으로 넘치지 않게)
		const popupWidth = 220;
		let x = rect.right - popupWidth;
		// 화면 왼쪽 끝을 넘지 않도록
		if (x < 8) x = 8;
		linkedTracksPopup = {
			wordId,
			tracks,
			position: { x, y: rect.bottom + 4 }
		};
	}

	// 연결된 트랙 팝업 닫기
	function closeLinkedTracksPopup() {
		linkedTracksPopup = null;
	}

	// 필터링 및 정렬된 워드 목록
	const filteredWords = $derived.by(() => {
		let result = words.filter(word => {
			// 검색어 필터
			if (searchQuery && !word.content.toLowerCase().includes(searchQuery.toLowerCase())) {
				return false;
			}
			// 카테고리 필터
			if (selectedCategory !== 'all' && word.category !== selectedCategory) {
				return false;
			}
			// 제작자 필터
			if (selectedCreator !== 'all' && word.createdBy !== selectedCreator) {
				return false;
			}
			return true;
		});
		
		// 정렬
		result.sort((a, b) => {
			switch (sortBy) {
				case 'usage_desc':
					return b.usageCount - a.usageCount;
				case 'usage_asc':
					return a.usageCount - b.usageCount;
				case 'created_desc':
					return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
				case 'created_asc':
					return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
				case 'content_asc':
					return a.content.localeCompare(b.content);
				case 'content_desc':
					return b.content.localeCompare(a.content);
				default:
					return 0;
			}
		});
		
		return result;
	});

	// 카테고리별 통계
	const categoryStats = $derived.by(() => {
		const stats: Record<string, number> = { all: words.length };
		WORD_CATEGORIES.forEach(cat => {
			stats[cat.id] = words.filter(w => w.category === cat.id).length;
		});
		return stats;
	});

	// 새 워드 추가
	function addWord() {
		if (!newWord.content.trim()) return;

		const id = `word_${Date.now()}`;
		words = [...words, {
			id,
			content: newWord.content.trim(),
			category: newWord.category,
			tags: newWord.tags.split(',').map(t => t.trim()).filter(t => t),
			usageCount: 0,
			linkedTracks: [],
			createdAt: new Date().toISOString().split('T')[0],
			createdBy: newWord.createdBy
		}];

		// 초기화
		newWord = { content: '', category: 'topic', tags: '', createdBy: 'El' };
		showAddModal = false;
	}

	// 워드 삭제
	function deleteWord(id: string) {
		if (confirm('이 항목을 삭제하시겠습니까?')) {
			words = words.filter(w => w.id !== id);
		}
	}

	// 외부 클릭 처리
	function handleClickOutside(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (!target.closest('.category-dropdown')) {
			categoryDropdownOpen = false;
		}
		if (!target.closest('.creator-dropdown')) {
			creatorDropdownOpen = false;
		}
		if (!target.closest('.sort-dropdown')) {
			sortDropdownOpen = false;
		}
		if (!target.closest('.linked-tracks-popup') && !target.closest('.linked-tracks-btn')) {
			linkedTracksPopup = null;
		}
	}

	$effect(() => {
		if (categoryDropdownOpen || creatorDropdownOpen || sortDropdownOpen || linkedTracksPopup) {
			document.addEventListener('click', handleClickOutside);
		}
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<svelte:head>
	<title>워드 라이브러리 | SUNO 제작</title>
</svelte:head>

<div class="pt-0 pb-6 sm:pb-6 pb-20 bg-bg text-text-base">
	<!-- 헤더 -->
	<div class="mb-8 mt-1.5">
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
			<div>
				<h1 class="text-3xl font-bold text-text-strong mb-2">SUNO 제작</h1>
				<p class="text-text-muted">워드를 수집하고 조합합니다</p>
			</div>
			<div class="flex items-center gap-3 flex-shrink-0">
				{#key showCombinator}
					<button
						type="button"
						onclick={() => { 
							showCombinator = !showCombinator;
						}}
						class="flex items-center gap-2 px-4 py-2 rounded-lg border {showCombinator 
							? 'bg-brand-pink/10 border-brand-pink text-brand-pink' 
							: 'btn-outline-hover border-border-subtle text-text-base'}"
					>
						<Shuffle size={16} />
						<span class="hidden sm:inline">랜덤 조합</span>
					</button>
				{/key}
				<button
					type="button"
					onclick={() => showAddModal = true}
					class="flex items-center gap-2 px-4 py-2 bg-brand-pink text-white rounded-lg font-medium hover:bg-brand-pink/90 transition-colors"
				>
					<Plus size={16} />
					<span class="hidden sm:inline">워드 추가</span>
				</button>
			</div>
		</div>
	</div>

	<!-- 탭 + 콘텐츠 -->
	<SUNOTabs>
		<!-- 랜덤 조합 생성기 -->
		{#if showCombinator}
			<div class="mb-6">
				<RandomCombinator {words} onClose={() => showCombinator = false} />
			</div>
		{/if}

		<!-- 필터 영역 -->
		<div class="mb-6 space-y-3">
			<!-- 검색 (윗줄) -->
			<div class="relative group">
				<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
					<Search size={16} class="lucide-icon lucide-search" />
				</div>
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="워드 검색..."
					class="w-full pl-10 {searchQuery.trim() ? 'pr-10' : 'pr-4'} py-1.5 bg-surface-2 border border-border-subtle border-[1px] rounded-md text-text-base placeholder-text-muted focus:outline-none focus:border-brand-pink focus:ring-0 transition-colors duration-200"
					aria-label="워드 검색"
					id="word-search"
					autocomplete="off"
				/>
				{#if searchQuery.trim()}
					<button
						type="button"
						onclick={() => {
							searchQuery = '';
							const input = document.getElementById('word-search') as HTMLInputElement;
							input?.focus();
						}}
						class="search-clear-button absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center bg-transparent hover:bg-transparent focus:bg-transparent focus-visible:bg-transparent"
						aria-label="검색 초기화"
					>
						<X size={16} class="lucide-icon" />
					</button>
				{/if}
			</div>

			<!-- 필터/정렬 (아랫줄) -->
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
				<!-- 카테고리 필터 -->
				<div class="relative category-dropdown">
					<button
						type="button"
						onclick={() => categoryDropdownOpen = !categoryDropdownOpen}
						aria-haspopup="listbox"
						aria-expanded={categoryDropdownOpen}
						class="status-filter-btn flex items-center pl-10 pr-8 py-1.5 w-full bg-surface-2 rounded-[6px] text-text-base transition-all duration-200 cursor-pointer border border-border-subtle focus:outline-none focus:border-brand-pink"
					>
						<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Filter size={16} class="lucide-icon text-text-muted transition-colors duration-200" />
						</div>
						<span class="flex-1 text-left truncate">
							{selectedCategory === 'all' ? '전체' : getCategoryName(selectedCategory)} ({categoryStats[selectedCategory] || 0})
						</span>
						<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
							<ChevronDown size={12} class="text-text-base transition-colors duration-200" />
						</div>
					</button>
					{#if categoryDropdownOpen}
						<ul class="absolute left-0 w-full mt-[6px] bg-surface-2 border border-border-subtle rounded-[6px] z-10 max-h-60 overflow-y-auto custom-list-scrollbar">
							<li
								role="option"
								aria-selected={selectedCategory === 'all'}
								tabindex="0"
								onclick={() => { selectedCategory = 'all'; categoryDropdownOpen = false; }}
								onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { selectedCategory = 'all'; categoryDropdownOpen = false; } }}
								class="dropdown-item px-4 py-2 text-sm cursor-pointer transition-colors {selectedCategory === 'all' ? 'bg-brand-pink text-white' : 'text-text-base'}"
							>
								전체 ({categoryStats['all'] || 0})
							</li>
							{#each WORD_CATEGORIES as cat}
								<li
									role="option"
									aria-selected={selectedCategory === cat.id}
									tabindex="0"
									onclick={() => { selectedCategory = cat.id; categoryDropdownOpen = false; }}
									onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { selectedCategory = cat.id; categoryDropdownOpen = false; } }}
									class="dropdown-item px-4 py-2 text-sm cursor-pointer transition-colors {selectedCategory === cat.id ? 'bg-brand-pink text-white' : 'text-text-base'}"
								>
									{cat.name} ({categoryStats[cat.id] || 0})
								</li>
							{/each}
						</ul>
					{/if}
				</div>

				<!-- 담당자 필터 -->
				<div class="relative creator-dropdown">
					<button
						type="button"
						onclick={() => creatorDropdownOpen = !creatorDropdownOpen}
						aria-haspopup="listbox"
						aria-expanded={creatorDropdownOpen}
						class="status-filter-btn flex items-center pl-10 pr-8 py-1.5 w-full bg-surface-2 rounded-[6px] text-text-base transition-all duration-200 cursor-pointer border border-border-subtle focus:outline-none focus:border-brand-pink"
					>
						<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<UserRound size={16} class="lucide-icon text-text-muted transition-colors duration-200" />
						</div>
						<span class="flex-1 text-left truncate">
							{creatorLabels[selectedCreator]}
						</span>
						<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
							<ChevronDown size={12} class="text-text-base transition-colors duration-200" />
						</div>
					</button>
					{#if creatorDropdownOpen}
						<ul class="absolute left-0 w-full mt-[6px] bg-surface-2 border border-border-subtle rounded-[6px] z-10 overflow-hidden">
							{#each Object.entries(creatorLabels) as [value, label]}
								<li
									role="option"
									aria-selected={selectedCreator === value}
									tabindex="0"
									onclick={() => { selectedCreator = value as Producer | 'all'; creatorDropdownOpen = false; }}
									onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { selectedCreator = value as Producer | 'all'; creatorDropdownOpen = false; } }}
									class="dropdown-item px-4 py-2 text-sm cursor-pointer transition-colors {selectedCreator === value ? 'bg-brand-pink text-white' : 'text-text-base'}"
								>
									{label}
								</li>
							{/each}
						</ul>
					{/if}
				</div>

				<!-- 정렬 -->
				<div class="relative sort-dropdown">
					<button
						type="button"
						onclick={() => sortDropdownOpen = !sortDropdownOpen}
						aria-haspopup="listbox"
						aria-expanded={sortDropdownOpen}
						class="status-filter-btn flex items-center pl-10 pr-8 py-1.5 w-full bg-surface-2 rounded-[6px] text-text-base transition-all duration-200 cursor-pointer border border-border-subtle focus:outline-none focus:border-brand-pink"
					>
						<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<ArrowUpDown size={16} class="lucide-icon text-text-muted transition-colors duration-200" />
						</div>
						<span class="flex-1 text-left truncate">
							{sortLabels[sortBy]}
						</span>
						<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
							<ChevronDown size={12} class="text-text-base transition-colors duration-200" />
						</div>
					</button>
					{#if sortDropdownOpen}
						<ul class="absolute left-0 w-full mt-[6px] bg-surface-2 border border-border-subtle rounded-[6px] z-10 overflow-hidden">
							{#each Object.entries(sortLabels) as [value, label]}
								<li
									role="option"
									aria-selected={sortBy === value}
									tabindex="0"
									onclick={() => { sortBy = value as SortOption; sortDropdownOpen = false; }}
									onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { sortBy = value as SortOption; sortDropdownOpen = false; } }}
									class="dropdown-item px-4 py-2 text-sm cursor-pointer transition-colors {sortBy === value ? 'bg-brand-pink text-white' : 'text-text-base'}"
								>
									{label}
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			</div>
		</div>

		<!-- 테이블 (데스크톱) / 카드 (모바일) -->
		<div class="bg-surface-2 rounded-lg border border-border-subtle overflow-hidden">
			<!-- 데스크톱 테이블 -->
			<div class="hidden md:block overflow-x-auto">
				<table class="w-full min-w-[640px]">
					<thead class="bg-bg">
						<tr>
							<th class="px-3 py-3 text-left text-sm font-medium text-text-strong">내용</th>
							<th class="px-3 py-3 text-left text-sm font-medium text-text-strong whitespace-nowrap">카테고리</th>
							<th class="px-3 py-3 text-left text-sm font-medium text-text-strong">태그</th>
							<th class="px-3 py-3 text-center text-sm font-medium text-text-strong whitespace-nowrap">사용</th>
							<th class="px-3 py-3 text-center text-sm font-medium text-text-strong whitespace-nowrap">제작자</th>
							<th class="px-3 py-3 text-center text-sm font-medium text-text-strong">액션</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-border-subtle">
						{#each filteredWords as word}
							<tr class="hover:bg-surface-1/50 transition-colors">
								<td class="px-3 py-3 text-sm text-text-base">{word.content}</td>
								<td class="px-3 py-3">
									<span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-bg text-text-base whitespace-nowrap">
										{getCategoryName(word.category)}
									</span>
								</td>
								<td class="px-3 py-3">
									<div class="flex flex-wrap gap-1">
										{#each word.tags.slice(0, 2) as tag}
											<span class="px-1.5 py-0.5 rounded text-xs bg-bg text-text-muted">
												{tag}
											</span>
										{/each}
										{#if word.tags.length > 2}
											<span class="text-xs text-text-muted">+{word.tags.length - 2}</span>
										{/if}
									</div>
								</td>
								<td class="px-3 py-3 text-center whitespace-nowrap">
									<span class="text-sm text-text-base">{word.usageCount}</span>
									{#if word.linkedTracks.length > 0}
										<button
											type="button"
											class="linked-tracks-btn inline-flex items-center ml-1 text-text-muted hover:text-hover-point transition-colors"
											onclick={(e) => openLinkedTracksPopup(word.id, word.linkedTracks, e)}
											aria-label="연결된 트랙 보기"
											title="{word.linkedTracks.length}개 트랙에서 사용"
										>
											<Link size={12} />
										</button>
									{/if}
								</td>
								<td class="px-3 py-3 text-center">
									<span class="text-sm font-medium {word.createdBy === 'El' ? 'text-elotte-green' : 'text-elotte-orange'}">
										{word.createdBy}
									</span>
								</td>
								<td class="px-3 py-3">
									<div class="flex items-center justify-center gap-1">
										<button
											type="button"
											class="btn-icon"
											aria-label="수정"
										>
											<Edit2 size={14} />
										</button>
										<button
											type="button"
											class="btn-icon text-red-400 hover:text-red-500"
											onclick={() => deleteWord(word.id)}
											aria-label="삭제"
										>
											<Trash2 size={14} />
										</button>
									</div>
								</td>
							</tr>
						{/each}
						{#if filteredWords.length === 0}
							<tr>
								<td colspan="6" class="px-4 py-12 text-center">
									{#if searchQuery || selectedCategory !== 'all' || selectedCreator !== 'all'}
										<div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-bg mb-4">
											<SearchX size={28} class="text-text-muted" />
										</div>
										<p class="text-text-base font-medium mb-2">검색 결과가 없습니다</p>
										<p class="text-text-muted text-sm mb-4">다른 검색어나 필터를 시도해보세요</p>
										<button
											type="button"
											onclick={() => { searchQuery = ''; selectedCategory = 'all'; selectedCreator = 'all'; }}
											class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-pink border border-brand-pink rounded-lg hover:bg-brand-pink hover:text-white transition-colors"
										>
											<X size={14} />
											필터 초기화
										</button>
									{:else}
										<div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-bg mb-4">
											<BookOpen size={28} class="text-text-muted" />
										</div>
										<p class="text-text-base font-medium mb-2">등록된 워드가 없습니다</p>
										<p class="text-text-muted text-sm mb-4">첫 번째 워드를 추가해보세요</p>
										<button
											type="button"
											onclick={() => showAddModal = true}
											class="inline-flex items-center gap-2 px-4 py-2 bg-brand-pink text-white text-sm font-medium rounded-lg hover:bg-brand-pink/90 transition-colors"
										>
											<Plus size={16} />
											워드 추가하기
										</button>
									{/if}
								</td>
							</tr>
						{/if}
					</tbody>
				</table>
			</div>

			<!-- 모바일 카드 레이아웃 -->
			<div class="md:hidden">
				{#each filteredWords as word, i}
					<div class="p-4 hover:bg-surface-1/50 transition-colors {i > 0 ? 'border-t border-border-subtle' : ''}">
						<div class="flex items-start justify-between gap-3 mb-2">
							<div class="flex-1 min-w-0">
								<p class="text-sm font-medium text-text-base">{word.content}</p>
								<div class="flex items-center gap-2 mt-1">
									<span class="px-2 py-0.5 rounded text-xs bg-bg text-text-muted">
										{getCategoryName(word.category)}
									</span>
									<span class="text-xs font-medium {word.createdBy === 'El' ? 'text-elotte-green' : 'text-elotte-orange'}">
										{word.createdBy}
									</span>
								</div>
							</div>
							<div class="flex items-center gap-1 flex-shrink-0">
								<button type="button" class="btn-icon" aria-label="수정">
									<Edit2 size={14} />
								</button>
								<button type="button" class="btn-icon text-red-400" onclick={() => deleteWord(word.id)} aria-label="삭제">
									<Trash2 size={14} />
								</button>
							</div>
						</div>
						<div class="flex items-center justify-between text-xs text-text-muted">
							<div class="flex flex-wrap gap-1">
								{#each word.tags.slice(0, 2) as tag}
									<span class="px-1.5 py-0.5 rounded bg-bg">{tag}</span>
								{/each}
								{#if word.tags.length > 2}
									<span>+{word.tags.length - 2}</span>
								{/if}
							</div>
							<div class="flex items-center gap-1">
								<span>{word.usageCount}회</span>
								{#if word.linkedTracks.length > 0}
									<button
										type="button"
										class="linked-tracks-btn text-text-muted hover:text-hover-point transition-colors"
										onclick={(e) => openLinkedTracksPopup(word.id, word.linkedTracks, e)}
										aria-label="연결된 트랙 보기"
									>
										<Link size={12} />
									</button>
								{/if}
							</div>
						</div>
					</div>
				{/each}
				{#if filteredWords.length === 0}
					<div class="px-4 py-12 text-center">
						{#if searchQuery || selectedCategory !== 'all' || selectedCreator !== 'all'}
							<div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-bg mb-4">
								<SearchX size={28} class="text-text-muted" />
							</div>
							<p class="text-text-base font-medium mb-2">검색 결과가 없습니다</p>
							<button
								type="button"
								onclick={() => { searchQuery = ''; selectedCategory = 'all'; selectedCreator = 'all'; }}
								class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-pink border border-brand-pink rounded-lg hover:bg-brand-pink hover:text-white transition-colors"
							>
								<X size={14} />
								필터 초기화
							</button>
						{:else}
							<div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-bg mb-4">
								<BookOpen size={28} class="text-text-muted" />
							</div>
							<p class="text-text-base font-medium mb-2">등록된 워드가 없습니다</p>
							<button
								type="button"
								onclick={() => showAddModal = true}
								class="inline-flex items-center gap-2 px-4 py-2 bg-brand-pink text-white text-sm font-medium rounded-lg hover:bg-brand-pink/90 transition-colors"
							>
								<Plus size={16} />
								워드 추가하기
							</button>
						{/if}
					</div>
				{/if}
			</div>
		</div>

		<!-- 통계 -->
		<div class="mt-6">
			<div class="flex flex-wrap items-center gap-4 text-sm">
				<span class="text-text-muted">
					총 <span class="font-medium text-text-base">{words.length}</span>개 워드
				</span>
				<span class="text-border-subtle">|</span>
				<span class="text-text-muted">
					표시 중 <span class="font-medium text-text-base">{filteredWords.length}</span>개
				</span>
			</div>
		</div>
	</SUNOTabs>
</div>

<!-- 연결된 트랙 팝업 -->
{#if linkedTracksPopup}
	<div
		class="linked-tracks-popup fixed z-[90] bg-surface-1 border border-border-subtle rounded-lg shadow-lg min-w-[220px] max-w-[280px]"
		style="left: {linkedTracksPopup.position.x}px; top: {linkedTracksPopup.position.y}px;"
	>
		<div class="px-3 py-2.5 border-b border-border-subtle flex items-center gap-3">
			<div class="flex items-center gap-2 flex-shrink-0">
				<span class="text-sm font-medium text-text-strong">연결된 트랙</span>
				<span class="text-xs text-text-muted">{linkedTracksPopup.tracks.length}곡</span>
			</div>
			<div class="flex items-center gap-1 ml-auto">
				<!-- 정렬 버튼들 -->
				<button
					type="button"
					onclick={() => linkedTracksSortBy = 'default'}
					class="btn-icon w-6 h-6 {linkedTracksSortBy === 'default' ? 'text-brand-pink' : ''}"
					aria-label="기본순"
					title="기본순"
				>
					<RotateCcw size={14} />
				</button>
				<button
					type="button"
					onclick={() => linkedTracksSortBy = 'title'}
					class="btn-icon w-6 h-6 {linkedTracksSortBy === 'title' ? 'text-brand-pink' : ''}"
					aria-label="제목순"
					title="제목순"
				>
					<ArrowDownAZ size={14} />
				</button>
				<button
					type="button"
					onclick={() => linkedTracksSortBy = 'status'}
					class="btn-icon w-6 h-6 {linkedTracksSortBy === 'status' ? 'text-brand-pink' : ''}"
					aria-label="상태순"
					title="상태순"
				>
					<ListOrdered size={14} />
				</button>
				<!-- 닫기 버튼 -->
				<button
					type="button"
					onclick={closeLinkedTracksPopup}
					class="btn-icon w-6 h-6"
					aria-label="닫기"
				>
					<X size={14} />
				</button>
			</div>
		</div>
		<div class="p-2 max-h-[190px] overflow-y-auto custom-list-scrollbar">
			{#each sortedLinkedTracks as trackId}
				{@const track = trackData[trackId]}
				{#if track}
					<a
						href="/suno/projects/{trackId}"
						class="linked-track-item flex items-center justify-between px-3 py-2 rounded-md border border-transparent transition-colors"
					>
						<span class="text-sm text-text-base">{track.title}</span>
						<span class="text-xs font-medium {getTrackStatusColor(track.status)}">{track.status}</span>
					</a>
				{:else}
					<div class="flex items-center px-3 py-2 text-sm text-text-muted">
						{trackId}
					</div>
				{/if}
			{/each}
		</div>
	</div>
{/if}

<!-- 워드 추가 모달 -->
{#if showAddModal}
	<div
		class="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
		onclick={() => showAddModal = false}
		onkeydown={(e) => { if (e.key === 'Escape') showAddModal = false; }}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
		<div
			class="bg-surface-1 rounded-lg border border-border-subtle w-full max-w-md"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			role="presentation"
		>
			<div class="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
				<h2 class="text-lg font-semibold text-text-strong">새 워드 추가</h2>
				<button
					type="button"
					onclick={() => showAddModal = false}
					class="template-close-btn w-8 h-8 flex items-center justify-center rounded-md text-text-muted transition-colors border border-transparent"
					aria-label="닫기"
				>
					<X size={20} />
				</button>
			</div>

			<form onsubmit={(e) => { e.preventDefault(); addWord(); }} class="p-6 space-y-4">
				<!-- 내용 -->
				<div>
					<label for="word-content" class="block text-sm font-medium text-text-strong mb-2">
						내용
					</label>
					<input
						type="text"
						id="word-content"
						bind:value={newWord.content}
						class="w-full py-1.5 px-4 bg-surface-2 border border-border-subtle rounded-md text-text-base focus:outline-none focus:border-brand-pink transition-colors"
						placeholder="단어 또는 문구를 입력하세요"
						required
					/>
				</div>

				<!-- 카테고리 -->
				<div>
					<label for="word-category" class="block text-sm font-medium text-text-strong mb-2">
						카테고리
					</label>
					<select
						id="word-category"
						bind:value={newWord.category}
						class="w-full py-1.5 px-4 bg-surface-2 border border-border-subtle rounded-md text-text-base focus:outline-none focus:border-brand-pink transition-colors"
					>
						{#each WORD_CATEGORIES as cat}
							<option value={cat.id}>{cat.name}</option>
						{/each}
					</select>
				</div>

				<!-- 태그 -->
				<div>
					<label for="word-tags" class="block text-sm font-medium text-text-strong mb-2">
						태그 (쉼표로 구분)
					</label>
					<input
						type="text"
						id="word-tags"
						bind:value={newWord.tags}
						class="w-full py-1.5 px-4 bg-surface-2 border border-border-subtle rounded-md text-text-base focus:outline-none focus:border-brand-pink transition-colors"
						placeholder="tag1, tag2, tag3"
					/>
				</div>

				<!-- 제작자 -->
				<div>
					<span id="creator-label" class="block text-sm font-medium text-text-strong mb-2">제작자</span>
					<div class="flex gap-2" role="group" aria-labelledby="creator-label">
						<button
							type="button"
							onclick={() => newWord.createdBy = 'El'}
							class="flex-1 px-4 py-2 rounded-lg border {newWord.createdBy === 'El' ? 'bg-brand-pink text-white border-brand-pink' : 'btn-outline-hover bg-surface-2 text-text-base border-border-subtle'}"
						>
							El
						</button>
						<button
							type="button"
							onclick={() => newWord.createdBy = 'Otte'}
							class="flex-1 px-4 py-2 rounded-lg border {newWord.createdBy === 'Otte' ? 'bg-brand-pink text-white border-brand-pink' : 'btn-outline-hover bg-surface-2 text-text-base border-border-subtle'}"
						>
							Otte
						</button>
					</div>
				</div>

				<!-- 버튼 -->
				<div class="flex justify-end gap-3 pt-4">
					<button
						type="button"
						onclick={() => showAddModal = false}
						class="cancel-button px-6 py-2 bg-surface-2 text-text-base rounded-lg border border-border-subtle transition-colors font-medium"
					>
						취소
					</button>
					<button
						type="submit"
						class="px-6 py-2 bg-brand-pink text-white rounded-lg transition-colors font-medium hover:bg-brand-pink/90"
					>
						추가
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
