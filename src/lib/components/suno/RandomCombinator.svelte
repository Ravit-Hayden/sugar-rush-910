<script lang="ts">
	import { Shuffle, Copy, Check, Plus, Minus, Sparkles, ChevronDown, Layers, Music, Wrench, RotateCcw, Ban, X } from 'lucide-svelte';
	import { WORD_CATEGORIES, getCategoryName } from '$lib/constants/suno/categories';
	import type { WordEntry, WordCategory } from '$lib/types/suno';

	// Props
	interface Props {
		words: WordEntry[];
		onUseResult?: (result: string) => void;
		onClose?: () => void;
	}

	let { words, onUseResult, onClose }: Props = $props();

	// 제외 카테고리를 뺀 카테고리 목록
	const RANDOM_CATEGORIES = WORD_CATEGORIES.filter(cat => cat.id !== 'exclude');

	// 카테고리별 선택 개수
	let categorySelections = $state<Record<WordCategory, number>>(
		Object.fromEntries(WORD_CATEGORIES.map(cat => [cat.id, 0])) as Record<WordCategory, number>
	);

	// 결과
	let combinedResult = $state('');
	let copied = $state(false);
	let excludeCopied = $state(false);

	// 제외 스타일 카테고리별 정의 (영어 + 한글)
	type ExcludeItem = { en: string; ko: string };
	type ExcludeCategory = { id: string; name: string; items: ExcludeItem[] };
	
	const EXCLUDE_CATEGORIES: ExcludeCategory[] = [
		{
			id: 'genre',
			name: '장르',
			items: [
				{ en: 'heavy metal', ko: '헤비메탈' },
				{ en: 'death metal', ko: '데스메탈' },
				{ en: 'black metal', ko: '블랙메탈' },
				{ en: 'thrash metal', ko: '스래시메탈' },
				{ en: 'speed metal', ko: '스피드메탈' },
				{ en: 'doom metal', ko: '둠메탈' },
				{ en: 'nu metal', ko: '뉴메탈' },
				{ en: 'punk rock', ko: '펑크록' },
				{ en: 'hardcore punk', ko: '하드코어 펑크' },
				{ en: 'grunge', ko: '그런지' },
				{ en: 'industrial', ko: '인더스트리얼' },
				{ en: 'noise rock', ko: '노이즈록' },
				{ en: 'noise', ko: '노이즈' },
				{ en: 'experimental', ko: '실험음악' },
				{ en: 'avant-garde', ko: '아방가르드' },
				{ en: 'country', ko: '컨트리' },
				{ en: 'country twang', ko: '컨트리 트왱' },
				{ en: 'bluegrass', ko: '블루그래스' },
				{ en: 'folk', ko: '포크' },
				{ en: 'opera', ko: '오페라' },
				{ en: 'classical', ko: '클래식' },
				{ en: 'classical vocals', ko: '클래식 보컬' },
				{ en: 'baroque', ko: '바로크' },
				{ en: 'orchestral', ko: '오케스트라' },
				{ en: 'mumble rap', ko: '멈블랩' },
				{ en: 'trap', ko: '트랩' },
				{ en: 'drill', ko: '드릴' },
				{ en: 'reggaeton', ko: '레게톤' },
				{ en: 'reggae', ko: '레게' },
				{ en: 'ska', ko: '스카' },
				{ en: 'polka', ko: '폴카' },
				{ en: 'march', ko: '행진곡' },
				{ en: 'military', ko: '군악' },
				{ en: 'gospel', ko: '가스펠' },
				{ en: 'hymn', ko: '찬송가' },
				{ en: 'chant', ko: '성가' },
				{ en: 'tribal', ko: '트라이벌' },
				{ en: 'world music', ko: '월드뮤직' },
				{ en: 'flamenco', ko: '플라멩코' },
				{ en: 'mariachi', ko: '마리아치' },
				{ en: 'yodeling', ko: '요들' }
			]
		},
		{
			id: 'vocal',
			name: '보컬 스타일',
			items: [
				{ en: 'screaming', ko: '스크리밍' },
				{ en: 'growling', ko: '그로울링' },
				{ en: 'scream', ko: '비명' },
				{ en: 'yelling', ko: '고함' },
				{ en: 'shouting', ko: '외침' },
				{ en: 'whispering', ko: '속삭임' },
				{ en: 'spoken word', ko: '스포큰워드' },
				{ en: 'rap', ko: '랩' },
				{ en: 'autotune heavy', ko: '오토튠 과다' },
				{ en: 'autotune', ko: '오토튠' },
				{ en: 'vocoder', ko: '보코더' },
				{ en: 'robotic voice', ko: '로봇 목소리' },
				{ en: 'robotic', ko: '기계적인' },
				{ en: 'children choir', ko: '어린이 합창단' },
				{ en: 'children singing', ko: '어린이 노래' },
				{ en: 'choir', ko: '합창단' },
				{ en: 'husky voice', ko: '허스키한 목소리' },
				{ en: 'husky', ko: '허스키' },
				{ en: 'breathy', ko: '숨소리 섞인' },
				{ en: 'airy', ko: '공기 섞인' },
				{ en: 'nasal', ko: '콧소리' },
				{ en: 'falsetto', ko: '팔세토' },
				{ en: 'high pitched', ko: '고음' },
				{ en: 'low pitched', ko: '저음' },
				{ en: 'baritone', ko: '바리톤' },
				{ en: 'bass voice', ko: '베이스 보이스' },
				{ en: 'soprano', ko: '소프라노' },
				{ en: 'tenor', ko: '테너' },
				{ en: 'alto', ko: '알토' },
				{ en: 'vibrato heavy', ko: '비브라토 과다' },
				{ en: 'tremolo', ko: '트레몰로' },
				{ en: 'monotone', ko: '단조로운' },
				{ en: 'mumbling', ko: '중얼거림' },
				{ en: 'slurred', ko: '불명확한' },
				{ en: 'off beat vocals', ko: '박자 안 맞는 보컬' }
			]
		},
		{
			id: 'mood',
			name: '분위기/톤',
			items: [
				{ en: 'aggressive', ko: '공격적인' },
				{ en: 'angry', ko: '화난' },
				{ en: 'violent', ko: '폭력적인' },
				{ en: 'harsh', ko: '거친' },
				{ en: 'intense', ko: '격렬한' },
				{ en: 'chaotic', ko: '혼란스러운' },
				{ en: 'dark', ko: '어두운' },
				{ en: 'gloomy', ko: '음울한' },
				{ en: 'depressing', ko: '우울한' },
				{ en: 'melancholic', ko: '멜랑콜릭' },
				{ en: 'sad', ko: '슬픈' },
				{ en: 'mournful', ko: '애도하는' },
				{ en: 'somber', ko: '침울한' },
				{ en: 'cheerful', ko: '밝은' },
				{ en: 'happy', ko: '행복한' },
				{ en: 'upbeat', ko: '업비트' },
				{ en: 'dramatic', ko: '극적인' },
				{ en: 'epic', ko: '웅장한' },
				{ en: 'bombastic', ko: '과장된' },
				{ en: 'grandiose', ko: '장대한' },
				{ en: 'calm', ko: '차분한' },
				{ en: 'peaceful', ko: '평화로운' },
				{ en: 'serene', ko: '고요한' },
				{ en: 'scary', ko: '무서운' },
				{ en: 'horror', ko: '호러' },
				{ en: 'creepy', ko: '으스스한' },
				{ en: 'eerie', ko: '기이한' },
				{ en: 'tense', ko: '긴장감' },
				{ en: 'suspenseful', ko: '서스펜스' },
				{ en: 'anxious', ko: '불안한' },
				{ en: 'nostalgic', ko: '향수어린' },
				{ en: 'sentimental', ko: '감상적인' }
			]
		},
		{
			id: 'instrument',
			name: '악기',
			items: [
				{ en: 'accordion', ko: '아코디언' },
				{ en: 'bagpipes', ko: '백파이프' },
				{ en: 'banjo', ko: '밴조' },
				{ en: 'harmonica', ko: '하모니카' },
				{ en: 'kazoo', ko: '카주' },
				{ en: 'ukulele', ko: '우쿨렐레' },
				{ en: 'sitar', ko: '시타르' },
				{ en: 'didgeridoo', ko: '디저리두' },
				{ en: 'theremin', ko: '테레민' },
				{ en: 'organ', ko: '오르간' },
				{ en: 'harpsichord', ko: '하프시코드' },
				{ en: 'harp', ko: '하프' },
				{ en: 'flute', ko: '플루트' },
				{ en: 'recorder', ko: '리코더' },
				{ en: 'pan flute', ko: '팬플루트' },
				{ en: 'clarinet', ko: '클라리넷' },
				{ en: 'oboe', ko: '오보에' },
				{ en: 'tuba', ko: '튜바' },
				{ en: 'trombone', ko: '트롬본' },
				{ en: 'trumpet', ko: '트럼펫' },
				{ en: 'horn', ko: '호른' },
				{ en: 'saxophone', ko: '색소폰' },
				{ en: 'violin', ko: '바이올린' },
				{ en: 'cello', ko: '첼로' },
				{ en: 'double bass', ko: '더블베이스' },
				{ en: 'steel drums', ko: '스틸 드럼' },
				{ en: 'bongos', ko: '봉고' },
				{ en: 'congas', ko: '콩가' },
				{ en: 'timpani', ko: '팀파니' },
				{ en: 'glockenspiel', ko: '글로켄슈필' },
				{ en: 'xylophone', ko: '실로폰' },
				{ en: 'marimba', ko: '마림바' }
			]
		},
		{
			id: 'tempo',
			name: '템포/리듬',
			items: [
				{ en: 'slow', ko: '느린' },
				{ en: 'very slow', ko: '매우 느린' },
				{ en: 'fast', ko: '빠른' },
				{ en: 'very fast', ko: '매우 빠른' },
				{ en: 'tempo changes', ko: '템포 변화' },
				{ en: 'irregular rhythm', ko: '불규칙한 리듬' },
				{ en: 'polyrhythmic', ko: '폴리리듬' },
				{ en: 'syncopated', ko: '싱코페이션' },
				{ en: 'breakbeat', ko: '브레이크비트' },
				{ en: 'double time', ko: '더블타임' },
				{ en: 'half time', ko: '하프타임' },
				{ en: 'waltz', ko: '왈츠' },
				{ en: 'swing', ko: '스윙' },
				{ en: 'shuffle', ko: '셔플' }
			]
		},
		{
			id: 'quality',
			name: '음질/제작',
			items: [
				{ en: 'distorted', ko: '왜곡된' },
				{ en: 'distortion', ko: '디스토션' },
				{ en: 'clipping', ko: '클리핑' },
				{ en: 'noisy', ko: '잡음 많은' },
				{ en: 'static', ko: '정전기 잡음' },
				{ en: 'hiss', ko: '쉬쉬 소음' },
				{ en: 'crackling', ko: '탁탁 소음' },
				{ en: 'off-key', ko: '음정 불안정' },
				{ en: 'out of tune', ko: '음이탈' },
				{ en: 'pitchy', ko: '음정 흔들림' },
				{ en: 'discordant', ko: '불협화음' },
				{ en: 'dissonant', ko: '불협화' },
				{ en: 'atonal', ko: '무조성' },
				{ en: 'cacophony', ko: '불협화음' },
				{ en: 'lo-fi', ko: '로파이' },
				{ en: 'lo-fi quality', ko: '저음질' },
				{ en: 'poor recording', ko: '녹음 불량' },
				{ en: 'poor mix', ko: '믹싱 불량' },
				{ en: 'muddy', ko: '탁한' },
				{ en: 'muffled', ko: '먹먹한' },
				{ en: 'amateur', ko: '아마추어' },
				{ en: 'demo quality', ko: '데모 음질' },
				{ en: 'unpolished', ko: '다듬어지지 않은' },
				{ en: 'rough', ko: '거친' },
				{ en: 'reverb heavy', ko: '리버브 과다' },
				{ en: 'echo heavy', ko: '에코 과다' },
				{ en: 'compressed', ko: '압축된' },
				{ en: 'over-compressed', ko: '과압축' },
				{ en: 'thin', ko: '얇은' },
				{ en: 'hollow', ko: '공허한' }
			]
		},
		{
			id: 'language',
			name: '언어/발음',
			items: [
				{ en: 'foreign language', ko: '외국어' },
				{ en: 'non-english', ko: '비영어' },
				{ en: 'gibberish', ko: '횡설수설' },
				{ en: 'nonsense lyrics', ko: '무의미한 가사' },
				{ en: 'scat singing', ko: '스캣 싱잉' },
				{ en: 'vocalise', ko: '보칼리즈' },
				{ en: 'wordless', ko: '가사 없는' },
				{ en: 'instrumental', ko: '연주곡' },
				{ en: 'humming', ko: '허밍' },
				{ en: 'la la la', ko: '라라라' },
				{ en: 'ooh aah', ko: '우아' },
				{ en: 'accent heavy', ko: '억양 강한' },
				{ en: 'slang heavy', ko: '속어 많은' }
			]
		},
		{
			id: 'era',
			name: '시대/스타일',
			items: [
				{ en: 'retro', ko: '레트로' },
				{ en: 'vintage', ko: '빈티지' },
				{ en: 'oldies', ko: '올디스' },
				{ en: '80s', ko: '80년대' },
				{ en: '70s', ko: '70년대' },
				{ en: '60s', ko: '60년대' },
				{ en: '50s', ko: '50년대' },
				{ en: 'disco', ko: '디스코' },
				{ en: 'funk', ko: '펑크' },
				{ en: 'psychedelic', ko: '사이키델릭' },
				{ en: 'progressive', ko: '프로그레시브' },
				{ en: 'new wave', ko: '뉴웨이브' },
				{ en: 'synthwave', ko: '신스웨이브' },
				{ en: 'vaporwave', ko: '베이퍼웨이브' },
				{ en: 'chiptune', ko: '칩튠' },
				{ en: '8-bit', ko: '8비트' },
				{ en: 'futuristic', ko: '미래적인' }
			]
		}
	];

	// 선택된 제외 스타일 (영어 문자열 Set) - 일반적으로 제외하는 항목 기본 선택
	let selectedExcludes = $state<Set<string>>(new Set([
		// 장르
		'heavy metal', 'death metal', 'black metal', 'thrash metal', 'punk rock', 'grunge',
		'industrial', 'noise rock', 'noise', 'opera', 'country twang', 'mumble rap',
		// 보컬
		'screaming', 'growling', 'scream', 'yelling', 'shouting', 'autotune heavy',
		'robotic voice', 'children choir', 'nasal', 'mumbling', 'slurred',
		// 분위기
		'aggressive', 'harsh', 'violent', 'chaotic', 'horror', 'creepy',
		// 음질
		'distorted', 'noisy', 'off-key', 'out of tune', 'discordant', 'atonal',
		'cacophony', 'lo-fi quality', 'poor recording', 'poor mix', 'amateur'
	]));

	// 제외 스타일 토글
	function toggleExclude(item: string) {
		const newSet = new Set(selectedExcludes);
		if (newSet.has(item)) {
			newSet.delete(item);
		} else {
			newSet.add(item);
		}
		selectedExcludes = newSet;
	}

	// 카테고리 전체 선택/해제
	function toggleCategory(category: ExcludeCategory) {
		const allSelected = category.items.every(item => selectedExcludes.has(item.en));
		const newSet = new Set(selectedExcludes);
		if (allSelected) {
			category.items.forEach(item => newSet.delete(item.en));
		} else {
			category.items.forEach(item => newSet.add(item.en));
		}
		selectedExcludes = newSet;
	}

	// 선택된 제외 스타일 텍스트
	const excludeStylesText = $derived(Array.from(selectedExcludes).join(', '));
	
	// 글자 수
	const excludeCharCount = $derived(excludeStylesText.length);
	
	// 1000자 초과 여부
	const isOverLimit = $derived(excludeCharCount > 1000);

	// 제외 스타일 섹션 펼침 상태
	let excludeExpanded = $state(false);

	// 카테고리별 워드 그룹 (제외 카테고리 제외)
	const wordsByCategory = $derived.by(() => {
		const grouped: Record<WordCategory, WordEntry[]> = {} as Record<WordCategory, WordEntry[]>;
		RANDOM_CATEGORIES.forEach(cat => {
			grouped[cat.id] = words.filter(w => w.category === cat.id);
		});
		return grouped;
	});

	// 가중치 기반 랜덤 선택 함수 (사용 빈도가 낮은 것이 더 자주 선택됨)
	function weightedRandomSelect(items: WordEntry[], count: number): WordEntry[] {
		if (items.length === 0 || count === 0) return [];
		
		// 최대 usageCount 찾기
		const maxUsage = Math.max(...items.map(w => w.usageCount), 1);
		
		// 가중치 계산: 사용 빈도가 낮을수록 높은 가중치
		// 추가로 랜덤 요소를 더해 다양성 증가
		const weightedItems = items.map(item => ({
			item,
			weight: (maxUsage - item.usageCount + 1) + Math.random() * 10
		}));
		
		// 가중치 기준 정렬 후 상위 N개 선택
		weightedItems.sort((a, b) => b.weight - a.weight);
		
		// 선택된 항목들을 다시 섞어서 순서도 랜덤하게
		const selected = weightedItems.slice(0, Math.min(count, items.length)).map(w => w.item);
		return selected.sort(() => Math.random() - 0.5);
	}

	// 선택 개수 조절
	function incrementCategory(category: WordCategory) {
		const max = wordsByCategory[category]?.length || 0;
		if (categorySelections[category] < max) {
			categorySelections[category]++;
		}
	}

	function decrementCategory(category: WordCategory) {
		if (categorySelections[category] > 0) {
			categorySelections[category]--;
		}
	}

	// 랜덤 조합 생성 (가중치 기반)
	function generateCombination() {
		const selected: string[] = [];

		RANDOM_CATEGORIES.forEach(cat => {
			const count = categorySelections[cat.id];
			if (count > 0) {
				const categoryWords = wordsByCategory[cat.id];
				if (categoryWords && categoryWords.length > 0) {
					// 가중치 기반 랜덤 선택
					const picked = weightedRandomSelect(categoryWords, count);
					picked.forEach(w => selected.push(w.content));
				}
			}
		});

		combinedResult = selected.join(', ');
	}

	// 결과 복사
	async function copyResult() {
		if (!combinedResult) return;
		
		try {
			await navigator.clipboard.writeText(combinedResult);
			copied = true;
			setTimeout(() => copied = false, 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}

	// 결과 사용
	function useResult() {
		if (onUseResult && combinedResult) {
			onUseResult(combinedResult);
		}
	}

	// 선택된 총 개수
	const totalSelected = $derived(
		Object.values(categorySelections).reduce((sum, count) => sum + count, 0)
	);

	// 프리셋 타입 정의
	type PresetType = 
		// 기본
		| 'basic' | 'full' | 'style' | 'minimal' | 'random_all'
		// 장르
		| 'kpop' | 'kpop_dance' | 'kpop_cute' | 'ballad' | 'ballad_dramatic'
		| 'edm' | 'future_bass' | 'tropical' | 'hiphop' | 'rnb'
		| 'lofi' | 'lofi_jazz' | 'citypop' | 'synthwave' | 'indie' | 'acoustic'
		| 'jpop' | 'jpop_anime' | 'jazz' | 'bossa'
		// 분위기
		| 'dreamy' | 'energetic' | 'melancholy' | 'romantic' | 'chill' | 'dark'
		// 제작
		| 'lyrics' | 'prompt' | 'full_production';

	// 프리셋 정보
	interface PresetInfo {
		id: PresetType;
		name: string;
		description: string;
		group: 'basic' | 'genre' | 'mood' | 'production';
	}

	const presets: PresetInfo[] = [
		// 기본 프리셋
		{ id: 'basic', name: '기본', description: '주제+분위기+감정', group: 'basic' },
		{ id: 'full', name: '풀 조합', description: '다양한 카테고리 조합', group: 'basic' },
		{ id: 'style', name: '스타일', description: 'SUNO 스타일 중심', group: 'basic' },
		{ id: 'minimal', name: '미니멀', description: '최소 요소만', group: 'basic' },
		{ id: 'random_all', name: '완전 랜덤', description: '모든 카테고리 1개씩', group: 'basic' },
		// 장르별 프리셋 - K-Pop
		{ id: 'kpop', name: 'K-Pop', description: '댄서블한 K-Pop', group: 'genre' },
		{ id: 'kpop_dance', name: 'K-Pop 댄스', description: '강렬한 댄스곡', group: 'genre' },
		{ id: 'kpop_cute', name: 'K-Pop 청량', description: '청량하고 밝은', group: 'genre' },
		// 장르별 프리셋 - 발라드/R&B
		{ id: 'ballad', name: '발라드', description: '감성적인 발라드', group: 'genre' },
		{ id: 'ballad_dramatic', name: '드라마틱 발라드', description: '웅장한 발라드', group: 'genre' },
		{ id: 'rnb', name: 'R&B', description: '스무스한 R&B', group: 'genre' },
		// 장르별 프리셋 - EDM
		{ id: 'edm', name: 'EDM', description: '에너지 넘치는 EDM', group: 'genre' },
		{ id: 'future_bass', name: 'Future Bass', description: '퓨처 베이스', group: 'genre' },
		{ id: 'tropical', name: 'Tropical', description: '트로피컬 하우스', group: 'genre' },
		// 장르별 프리셋 - 힙합
		{ id: 'hiphop', name: '힙합', description: '그루비한 힙합', group: 'genre' },
		// 장르별 프리셋 - Lo-Fi/Chill
		{ id: 'lofi', name: 'Lo-Fi', description: '차분한 로파이', group: 'genre' },
		{ id: 'lofi_jazz', name: 'Lo-Fi Jazz', description: '재즈 로파이', group: 'genre' },
		// 장르별 프리셋 - 레트로
		{ id: 'citypop', name: '시티팝', description: '레트로 시티팝', group: 'genre' },
		{ id: 'synthwave', name: 'Synthwave', description: '80s 신스웨이브', group: 'genre' },
		// 장르별 프리셋 - 어쿠스틱/인디
		{ id: 'indie', name: '인디', description: '감성 인디', group: 'genre' },
		{ id: 'acoustic', name: '어쿠스틱', description: '어쿠스틱 포크', group: 'genre' },
		// 장르별 프리셋 - J-Pop
		{ id: 'jpop', name: 'J-Pop', description: '일본 팝', group: 'genre' },
		{ id: 'jpop_anime', name: '애니송', description: '애니메이션 OST', group: 'genre' },
		// 장르별 프리셋 - 재즈
		{ id: 'jazz', name: 'Jazz', description: '재즈', group: 'genre' },
		{ id: 'bossa', name: 'Bossa Nova', description: '보사노바', group: 'genre' },
		// 분위기 프리셋
		{ id: 'dreamy', name: '몽환적', description: '꿈같은 분위기', group: 'mood' },
		{ id: 'energetic', name: '에너지틱', description: '활기찬 분위기', group: 'mood' },
		{ id: 'melancholy', name: '멜랑콜리', description: '우울한 분위기', group: 'mood' },
		{ id: 'romantic', name: '로맨틱', description: '로맨틱한 분위기', group: 'mood' },
		{ id: 'chill', name: '칠', description: '편안한 분위기', group: 'mood' },
		{ id: 'dark', name: '다크', description: '어두운 분위기', group: 'mood' },
		// 제작 프리셋
		{ id: 'lyrics', name: '가사용', description: '가사 작성에 최적화', group: 'production' },
		{ id: 'prompt', name: '프롬프트', description: 'SUNO 프롬프트 생성', group: 'production' },
		{ id: 'full_production', name: '풀 제작', description: '전체 제작 요소', group: 'production' }
	];

	// 현재 선택된 프리셋 그룹
	let selectedPresetGroup = $state<'basic' | 'genre' | 'mood' | 'production'>('basic');
	let presetDropdownOpen = $state(false);

	// 그룹별 프리셋 필터링
	const filteredPresets = $derived(presets.filter(p => p.group === selectedPresetGroup));

	// 빠른 프리셋 적용
	function applyPreset(preset: PresetType) {
		// 초기화
		RANDOM_CATEGORIES.forEach(cat => {
			categorySelections[cat.id] = 0;
		});

		switch (preset) {
			// ========== 기본 프리셋 ==========
			case 'basic':
				categorySelections['topic'] = 1;
				categorySelections['mood'] = 1;
				categorySelections['emotion'] = 1;
				break;
			case 'full':
				categorySelections['topic'] = 1;
				categorySelections['mood'] = 1;
				categorySelections['action'] = 1;
				categorySelections['emotion'] = 1;
				categorySelections['place'] = 1;
				categorySelections['time'] = 1;
				break;
			case 'style':
				categorySelections['style'] = 2;
				categorySelections['mood'] = 1;
				categorySelections['vibe'] = 1;
				break;
			case 'minimal':
				categorySelections['genre'] = 1;
				categorySelections['mood'] = 1;
				break;
			case 'random_all':
				RANDOM_CATEGORIES.forEach(cat => {
					categorySelections[cat.id] = 1;
				});
				break;
			
			// ========== 장르별 프리셋 - K-Pop ==========
			case 'kpop':
				categorySelections['genre'] = 1;
				categorySelections['vocal'] = 1;
				categorySelections['tempo'] = 1;
				categorySelections['vibe'] = 1;
				categorySelections['style'] = 1;
				break;
			case 'kpop_dance':
				categorySelections['genre'] = 1;
				categorySelections['tempo'] = 2;
				categorySelections['vocal'] = 1;
				categorySelections['instrument'] = 1;
				categorySelections['vibe'] = 1;
				break;
			case 'kpop_cute':
				categorySelections['genre'] = 1;
				categorySelections['mood'] = 2;
				categorySelections['vocal'] = 1;
				categorySelections['vibe'] = 1;
				categorySelections['dessert'] = 1;
				break;
				
			// ========== 장르별 프리셋 - 발라드/R&B ==========
			case 'ballad':
				categorySelections['genre'] = 1;
				categorySelections['emotion'] = 2;
				categorySelections['mood'] = 1;
				categorySelections['instrument'] = 1;
				categorySelections['vocal'] = 1;
				break;
			case 'ballad_dramatic':
				categorySelections['genre'] = 1;
				categorySelections['emotion'] = 2;
				categorySelections['instrument'] = 2;
				categorySelections['vocal'] = 1;
				categorySelections['vibe'] = 1;
				break;
			case 'rnb':
				categorySelections['genre'] = 1;
				categorySelections['mood'] = 1;
				categorySelections['vocal'] = 2;
				categorySelections['tempo'] = 1;
				categorySelections['vibe'] = 1;
				break;
				
			// ========== 장르별 프리셋 - EDM ==========
			case 'edm':
				categorySelections['genre'] = 1;
				categorySelections['tempo'] = 1;
				categorySelections['vibe'] = 1;
				categorySelections['instrument'] = 1;
				categorySelections['style'] = 1;
				break;
			case 'future_bass':
				categorySelections['genre'] = 1;
				categorySelections['instrument'] = 2;
				categorySelections['tempo'] = 1;
				categorySelections['vibe'] = 1;
				categorySelections['vocal'] = 1;
				break;
			case 'tropical':
				categorySelections['genre'] = 1;
				categorySelections['mood'] = 2;
				categorySelections['season'] = 1;
				categorySelections['instrument'] = 1;
				categorySelections['tempo'] = 1;
				break;
				
			// ========== 장르별 프리셋 - 힙합 ==========
			case 'hiphop':
				categorySelections['genre'] = 1;
				categorySelections['tempo'] = 1;
				categorySelections['instrument'] = 2;
				categorySelections['vibe'] = 1;
				categorySelections['mood'] = 1;
				break;
				
			// ========== 장르별 프리셋 - Lo-Fi/Chill ==========
			case 'lofi':
				categorySelections['genre'] = 1;
				categorySelections['mood'] = 2;
				categorySelections['instrument'] = 1;
				categorySelections['vibe'] = 1;
				break;
			case 'lofi_jazz':
				categorySelections['genre'] = 1;
				categorySelections['instrument'] = 2;
				categorySelections['mood'] = 1;
				categorySelections['vibe'] = 1;
				categorySelections['time'] = 1;
				break;
				
			// ========== 장르별 프리셋 - 레트로 ==========
			case 'citypop':
				categorySelections['genre'] = 1;
				categorySelections['vibe'] = 2;
				categorySelections['instrument'] = 1;
				categorySelections['tempo'] = 1;
				break;
			case 'synthwave':
				categorySelections['genre'] = 1;
				categorySelections['vibe'] = 2;
				categorySelections['instrument'] = 2;
				categorySelections['tempo'] = 1;
				break;
				
			// ========== 장르별 프리셋 - 어쿠스틱/인디 ==========
			case 'indie':
				categorySelections['genre'] = 1;
				categorySelections['mood'] = 1;
				categorySelections['emotion'] = 1;
				categorySelections['instrument'] = 1;
				categorySelections['vocal'] = 1;
				break;
			case 'acoustic':
				categorySelections['genre'] = 1;
				categorySelections['instrument'] = 2;
				categorySelections['mood'] = 1;
				categorySelections['vocal'] = 1;
				break;
				
			// ========== 장르별 프리셋 - J-Pop ==========
			case 'jpop':
				categorySelections['genre'] = 1;
				categorySelections['language'] = 1;
				categorySelections['vibe'] = 1;
				categorySelections['vocal'] = 1;
				categorySelections['tempo'] = 1;
				break;
			case 'jpop_anime':
				categorySelections['genre'] = 1;
				categorySelections['language'] = 1;
				categorySelections['tempo'] = 2;
				categorySelections['vibe'] = 1;
				categorySelections['emotion'] = 1;
				break;
				
			// ========== 장르별 프리셋 - 재즈 ==========
			case 'jazz':
				categorySelections['genre'] = 1;
				categorySelections['instrument'] = 3;
				categorySelections['mood'] = 1;
				categorySelections['tempo'] = 1;
				break;
			case 'bossa':
				categorySelections['genre'] = 1;
				categorySelections['instrument'] = 2;
				categorySelections['mood'] = 1;
				categorySelections['vibe'] = 1;
				break;
			
			// ========== 분위기 프리셋 ==========
			case 'dreamy':
				categorySelections['mood'] = 2;
				categorySelections['vibe'] = 2;
				categorySelections['instrument'] = 1;
				categorySelections['vocal'] = 1;
				break;
			case 'energetic':
				categorySelections['tempo'] = 2;
				categorySelections['vibe'] = 1;
				categorySelections['action'] = 1;
				categorySelections['mood'] = 1;
				break;
			case 'melancholy':
				categorySelections['emotion'] = 2;
				categorySelections['mood'] = 2;
				categorySelections['time'] = 1;
				categorySelections['instrument'] = 1;
				break;
			case 'romantic':
				categorySelections['emotion'] = 2;
				categorySelections['mood'] = 1;
				categorySelections['phrase'] = 1;
				categorySelections['vibe'] = 1;
				break;
			case 'chill':
				categorySelections['mood'] = 2;
				categorySelections['tempo'] = 1;
				categorySelections['vibe'] = 1;
				categorySelections['instrument'] = 1;
				break;
			case 'dark':
				categorySelections['mood'] = 2;
				categorySelections['vibe'] = 2;
				categorySelections['time'] = 1;
				break;
			
			// ========== 제작 프리셋 ==========
			case 'lyrics':
				categorySelections['topic'] = 2;
				categorySelections['emotion'] = 2;
				categorySelections['phrase'] = 2;
				categorySelections['action'] = 1;
				categorySelections['place'] = 1;
				break;
			case 'prompt':
				categorySelections['style'] = 2;
				categorySelections['genre'] = 1;
				categorySelections['vocal'] = 1;
				categorySelections['instrument'] = 1;
				categorySelections['tempo'] = 1;
				categorySelections['vibe'] = 1;
				break;
			case 'full_production':
				categorySelections['genre'] = 1;
				categorySelections['style'] = 1;
				categorySelections['vocal'] = 1;
				categorySelections['instrument'] = 1;
				categorySelections['tempo'] = 1;
				categorySelections['mood'] = 1;
				categorySelections['vibe'] = 1;
				categorySelections['language'] = 1;
				break;
		}
		
		presetDropdownOpen = false;
	}

	// 드롭다운 외부 클릭 감지
	$effect(() => {
		function handleClickOutside(event: MouseEvent) {
			const target = event.target as HTMLElement;
			if (!target.closest('.preset-dropdown')) {
				presetDropdownOpen = false;
			}
		}
		
		if (presetDropdownOpen) {
			document.addEventListener('click', handleClickOutside);
			return () => document.removeEventListener('click', handleClickOutside);
		}
	});

	// 초기화
	function resetSelections() {
		RANDOM_CATEGORIES.forEach(cat => {
			categorySelections[cat.id] = 0;
		});
		combinedResult = '';
	}

	// 공통 제외 스타일 복사
	async function copyExcludeStyles() {
		try {
			await navigator.clipboard.writeText(excludeStylesText);
			excludeCopied = true;
			setTimeout(() => excludeCopied = false, 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}
</script>

<div class="bg-surface-1 rounded-lg border border-border-subtle overflow-hidden">
	<!-- 헤더 -->
	<div class="px-6 py-4 border-b border-border-subtle">
		<div class="flex items-center justify-between mb-3">
			<div class="flex items-center gap-2">
				<Sparkles size={20} class="text-brand-pink combinator-header-icon" />
				<h3 class="text-lg font-semibold text-text-strong">랜덤 조합 생성기</h3>
			</div>
			<div class="flex items-center gap-2">
				<button
					type="button"
					onclick={resetSelections}
					class="combinator-reset-btn flex items-center gap-1 px-3 py-1.5 text-sm rounded-md text-text-muted transition-colors outline-none focus:outline-none"
				>
					<RotateCcw size={14} />
					초기화
				</button>
				{#if onClose}
					<button
						type="button"
						onclick={onClose}
						class="w-8 h-8 flex items-center justify-center rounded-md text-text-muted hover:text-hover-point hover:bg-surface-2 transition-colors"
						aria-label="닫기"
					>
						<X size={18} />
					</button>
				{/if}
			</div>
		</div>
		
		<!-- 프리셋 그룹 탭 -->
		<div class="flex items-center gap-3 mb-4">
			<span class="text-xs text-text-muted flex-shrink-0">프리셋 그룹</span>
			<div class="flex flex-wrap items-center gap-2">
				<button
					type="button"
					onclick={() => selectedPresetGroup = 'basic'}
					class="preset-group-btn flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors {selectedPresetGroup === 'basic' ? 'active border-brand-pink text-brand-pink' : 'border-border-subtle text-text-base'} bg-surface-2 border"
				>
					<Layers size={14} class="pointer-events-none" />
					기본
				</button>
				<button
					type="button"
					onclick={() => selectedPresetGroup = 'genre'}
					class="preset-group-btn flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors {selectedPresetGroup === 'genre' ? 'active border-brand-pink text-brand-pink' : 'border-border-subtle text-text-base'} bg-surface-2 border"
				>
					<Music size={14} class="pointer-events-none" />
					장르별
				</button>
				<button
					type="button"
					onclick={() => selectedPresetGroup = 'mood'}
					class="preset-group-btn flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors {selectedPresetGroup === 'mood' ? 'active border-brand-pink text-brand-pink' : 'border-border-subtle text-text-base'} bg-surface-2 border"
				>
					<Sparkles size={14} class="pointer-events-none preset-group-icon" />
					분위기
				</button>
				<button
					type="button"
					onclick={() => selectedPresetGroup = 'production'}
					class="preset-group-btn flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors {selectedPresetGroup === 'production' ? 'active border-brand-pink text-brand-pink' : 'border-border-subtle text-text-base'} bg-surface-2 border"
				>
					<Wrench size={14} class="pointer-events-none" />
					제작용
				</button>
			</div>
		</div>
		
		<!-- 선택된 그룹의 프리셋 버튼들 -->
		<div class="flex items-center gap-3">
			<span class="text-xs text-text-muted flex-shrink-0">빠른 적용</span>
			<div class="flex flex-wrap gap-2">
				{#each filteredPresets as preset}
					<button
						type="button"
						onclick={() => applyPreset(preset.id)}
						class="combinator-preset-btn px-3 py-1.5 text-sm rounded-md bg-surface-2 border border-border-subtle text-text-base transition-colors outline-none focus:outline-none"
						title={preset.description}
					>
						{preset.name}
					</button>
				{/each}
			</div>
		</div>
	</div>

	<!-- 카테고리 선택 (제외 카테고리 제외) -->
	<div class="p-6">
		<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
			{#each RANDOM_CATEGORIES as cat}
				{@const available = wordsByCategory[cat.id]?.length || 0}
				{@const selected = categorySelections[cat.id]}
				<div class="flex items-center justify-between p-3 rounded-lg bg-surface-2 {selected > 0 ? 'ring-1 ring-brand-pink' : ''}">
					<div class="flex-1 min-w-0">
						<div class="text-sm font-medium text-text-base truncate">{cat.name}</div>
						<div class="text-xs text-text-muted">{available}개</div>
					</div>
					<div class="flex items-center gap-1">
						<button
							type="button"
							onclick={() => decrementCategory(cat.id)}
							disabled={selected === 0}
							class="combinator-counter-btn w-6 h-6 flex items-center justify-center rounded bg-surface-1 text-text-muted disabled:opacity-30 transition-colors outline-none focus:outline-none"
						>
							<Minus size={12} />
						</button>
						<span class="w-6 text-center text-sm font-medium text-text-base">{selected}</span>
						<button
							type="button"
							onclick={() => incrementCategory(cat.id)}
							disabled={selected >= available}
							class="combinator-counter-btn w-6 h-6 flex items-center justify-center rounded bg-surface-1 text-text-muted disabled:opacity-30 transition-colors outline-none focus:outline-none"
						>
							<Plus size={12} />
						</button>
					</div>
				</div>
			{/each}
		</div>

		<!-- 생성 버튼 -->
		<div class="mt-6 flex items-center justify-center gap-4">
			<button
				type="button"
				onclick={generateCombination}
				disabled={totalSelected === 0}
				class="flex items-center gap-2 px-6 py-3 bg-brand-pink text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-pink/90"
			>
				<Shuffle size={18} />
				랜덤 조합 생성 ({totalSelected}개 선택)
			</button>
		</div>

		<!-- 결과 -->
		{#if combinedResult}
			<div class="mt-6 p-4 rounded-lg bg-surface-2 border border-border-subtle">
				<div class="flex items-start justify-between gap-4">
					<div class="flex-1">
						<div class="text-xs text-text-muted mb-2">생성된 조합</div>
						<div class="text-base text-text-strong font-medium">{combinedResult}</div>
					</div>
					<div class="flex items-center gap-2 flex-shrink-0">
						<button
							type="button"
							onclick={copyResult}
							class="flex items-center gap-1 px-3 py-1.5 rounded-md bg-surface-1 text-text-base text-sm hover:bg-surface-1/80 transition-colors"
						>
							{#if copied}
								<Check size={14} class="text-green-500" />
								복사됨
							{:else}
								<Copy size={14} />
								복사
							{/if}
						</button>
						{#if onUseResult}
							<button
								type="button"
								onclick={useResult}
								class="flex items-center gap-1 px-3 py-1.5 rounded-md bg-brand-pink text-white text-sm hover:bg-brand-pink/90 transition-colors"
							>
								사용하기
							</button>
						{/if}
					</div>
				</div>
			</div>
		{/if}

		<!-- 제외 스타일 섹션 -->
		<div class="mt-6 rounded-lg bg-surface-2/50 border border-border-subtle overflow-hidden">
			<!-- 헤더 -->
			<div class="px-4 py-3 flex items-center justify-between">
				<button
					type="button"
					onclick={() => excludeExpanded = !excludeExpanded}
					class="flex items-center gap-2 hover:text-hover-point transition-colors"
				>
					<Ban size={16} class="text-red-500" />
					<span class="text-sm font-medium text-text-base">제외 스타일</span>
					<span class="text-xs {isOverLimit ? 'text-red-500 font-medium' : 'text-text-muted'}">
						({excludeCharCount}/1000자)
					</span>
					{#if isOverLimit}
						<span class="text-xs text-red-500">초과!</span>
					{/if}
					<ChevronDown size={14} class="text-text-muted transition-transform {excludeExpanded ? 'rotate-180' : ''}" />
				</button>
				{#key excludeCopied}
					<button
						type="button"
						onclick={copyExcludeStyles}
						class="exclude-copy-btn btn-outline-hover flex items-center gap-1 px-3 py-1.5 rounded-md border border-border-subtle text-sm {excludeCopied ? 'text-brand-pink border-brand-pink' : 'text-text-base'}"
					>
						{#if excludeCopied}
							<Check size={14} />
							복사됨
						{:else}
							<Copy size={14} />
							복사
						{/if}
					</button>
				{/key}
			</div>

			<!-- 선택된 스타일 미리보기 -->
			<div class="px-4 pb-3 border-b border-border-subtle">
				<p class="text-xs text-text-muted leading-relaxed line-clamp-2">
					{excludeStylesText || '선택된 제외 스타일이 없습니다'}
				</p>
			</div>

			<!-- 펼침 시 카테고리별 선택 UI -->
			{#if excludeExpanded}
				<div class="p-4 space-y-4">
					{#each EXCLUDE_CATEGORIES as category}
						<div>
							<!-- 카테고리 헤더 -->
							<button
								type="button"
								onclick={() => toggleCategory(category)}
								class="flex items-center gap-2 mb-2 text-xs font-medium text-text-muted hover:text-hover-point transition-colors"
							>
								<span>{category.name}</span>
								<span class="text-text-muted/50">
									({category.items.filter(item => selectedExcludes.has(item.en)).length}/{category.items.length})
								</span>
							</button>
							<!-- 아이템 목록 -->
							<div class="flex flex-wrap gap-1.5">
								{#each category.items as item}
									<button
										type="button"
										onclick={() => toggleExclude(item.en)}
										class="exclude-item-btn px-2 py-1 text-xs rounded-md border transition-colors {selectedExcludes.has(item.en) 
											? 'bg-red-500/20 border-red-500/50 text-red-400' 
											: 'bg-surface-1 border-border-subtle text-text-muted hover:border-hover-point hover:text-hover-point'}"
										title={item.ko}
									>
										{item.en}
										<span class="text-text-muted/60 ml-1">({item.ko})</span>
									</button>
								{/each}
							</div>
						</div>
					{/each}
				</div>
				<div class="px-4 py-2 border-t border-border-subtle">
					<p class="text-xs text-text-muted/70">
						* SUNO의 "Exclude Styles" 필드에 붙여넣으세요. 원치 않는 스타일을 방지합니다.
					</p>
				</div>
			{/if}
		</div>
	</div>
</div>
