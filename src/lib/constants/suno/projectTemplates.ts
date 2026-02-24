/**
 * 프로젝트 템플릿 상수 정의
 * SUNO 프로젝트 생성 시 사용하는 프리셋 템플릿 데이터
 */

/** 프로젝트 템플릿 인터페이스 */
export interface ProjectTemplate {
	id: string;
	name: string;
	description: string;
	iconName: string;
	color: string;
	defaultStyles: string;
	defaultExclude: string;
	defaultVocalGender: 'Male' | 'Female' | 'Duet';
	tags: string[];
	category: string;
	isFavorite?: boolean;
}

/** 템플릿 카테고리 */
export interface TemplateCategory {
	id: string;
	name: string;
}

/** 카테고리 목록 */
export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
	{ id: 'favorite', name: '자주 사용' },
	{ id: 'emotional', name: '감성/발라드' },
	{ id: 'dance', name: '댄스/일렉트로' },
	{ id: 'band', name: '밴드/록' },
	{ id: 'world', name: '전통/월드' },
	{ id: 'special', name: '특수/기타' }
];

/** 프리셋 템플릿 목록 */
export const PROJECT_TEMPLATES: ProjectTemplate[] = [
		// 감성/발라드
		{
			id: 'ballad',
			name: '감성 발라드',
			description: '부드럽고 감성적인 발라드 스타일',
			iconName: 'Droplet',
			color: 'text-blue-400',
			defaultStyles: 'soft ballad, emotional vocals, piano, strings, korean, heartfelt, intimate atmosphere',
			defaultExclude: 'upbeat, dance, electronic, harsh, aggressive',
			defaultVocalGender: 'Female',
			tags: ['발라드', '감성', '피아노'],
			category: 'emotional',
			isFavorite: true
		},
		{
			id: 'rnb',
			name: 'R&B 소울',
			description: '부드러운 R&B 소울 스타일',
			iconName: 'Moon',
			color: 'text-orange-400',
			defaultStyles: 'R&B soul, smooth grooves, emotional vocals, modern production, late night vibes, sensual',
			defaultExclude: 'rock, metal, country, fast tempo, harsh',
			defaultVocalGender: 'Male',
			tags: ['R&B', '소울', '그루비'],
			category: 'emotional',
			isFavorite: true
		},
		{
			id: 'acoustic',
			name: '어쿠스틱 포크',
			description: '따뜻한 어쿠스틱 기타 스타일',
			iconName: 'Guitar',
			color: 'text-amber-400',
			defaultStyles: 'mellow acoustic, warm vocals, gentle guitar, intimate atmosphere, singer-songwriter, folk',
			defaultExclude: 'electronic, synth, heavy bass, aggressive, dance',
			defaultVocalGender: 'Female',
			tags: ['어쿠스틱', '포크', '따뜻함'],
			category: 'emotional',
			isFavorite: true
		},
		{
			id: 'jazz',
			name: '재즈',
			description: '감미로운 재즈 스타일',
			iconName: 'Wine',
			color: 'text-rose-400',
			defaultStyles: 'jazz, smooth saxophone, piano jazz, sophisticated, late night, swing rhythm',
			defaultExclude: 'electronic, heavy, aggressive, pop, hip-hop',
			defaultVocalGender: 'Female',
			tags: ['재즈', '스윙', '피아노'],
			category: 'emotional'
		},
		{
			id: 'bossanova',
			name: '보사노바',
			description: '브라질 재즈 스타일',
			iconName: 'TentTree',
			color: 'text-green-400',
			defaultStyles: 'bossa nova, brazilian jazz, gentle guitar, soft vocals, romantic, smooth',
			defaultExclude: 'loud, aggressive, electronic, heavy, fast',
			defaultVocalGender: 'Female',
			tags: ['보사노바', '브라질', '재즈'],
			category: 'emotional'
		},
		// 댄스/일렉트로
		{
			id: 'kpop',
			name: 'K-POP 업템포',
			description: '신나는 K-POP 댄스 스타일',
			iconName: 'Rocket',
			color: 'text-brand-pink',
			defaultStyles: 'upbeat K-pop, catchy hooks, energetic dance-pop, powerful beats, polished production, trendy',
			defaultExclude: 'slow, ballad, acoustic, mellow, sad',
			defaultVocalGender: 'Female',
			tags: ['K-POP', '댄스', '업템포'],
			category: 'dance',
			isFavorite: true
		},
		{
			id: 'synth',
			name: '드리미 신스팝',
			description: '몽환적인 신스팝 스타일',
			iconName: 'Sparkles',
			color: 'text-purple-400',
			defaultStyles: 'dreamy synth-pop, ethereal vocals, ambient, retro synth, 80s inspired, atmospheric',
			defaultExclude: 'acoustic, heavy, aggressive, country, jazz',
			defaultVocalGender: 'Female',
			tags: ['신스팝', '몽환', '레트로'],
			category: 'dance'
		},
		{
			id: 'edm',
			name: 'EDM/일렉트로니카',
			description: '클럽/페스티벌 스타일',
			iconName: 'LoaderPinwheel',
			color: 'text-cyan-400',
			defaultStyles: 'EDM, electronic dance music, synth drops, festival vibes, high energy, bass heavy',
			defaultExclude: 'acoustic, slow, ballad, classical, folk',
			defaultVocalGender: 'Female',
			tags: ['EDM', '일렉트로', '클럽'],
			category: 'dance'
		},
		{
			id: 'disco',
			name: '디스코/펑크',
			description: '그루비한 디스코 스타일',
			iconName: 'PartyPopper',
			color: 'text-fuchsia-400',
			defaultStyles: 'disco, funk, groovy bassline, 70s vibes, dance floor, party music',
			defaultExclude: 'slow, sad, dark, minimal, ambient',
			defaultVocalGender: 'Female',
			tags: ['디스코', '펑크', '그루비'],
			category: 'dance'
		},
		{
			id: 'tropical',
			name: '트로피컬',
			description: '트로피컬 하우스 스타일',
			iconName: 'Citrus',
			color: 'text-orange-300',
			defaultStyles: 'tropical house, summer vibes, beach music, uplifting, marimba, sunny',
			defaultExclude: 'dark, cold, heavy, aggressive, winter',
			defaultVocalGender: 'Female',
			tags: ['트로피컬', '여름', '하우스'],
			category: 'dance'
		},
		// 밴드/록
		{
			id: 'rock',
			name: '록/밴드',
			description: '에너지 넘치는 밴드 사운드',
			iconName: 'Flame',
			color: 'text-orange-500',
			defaultStyles: 'rock band, electric guitar, powerful drums, energetic, raw vocals, live band feel',
			defaultExclude: 'electronic, soft, ambient, hip-hop, classical',
			defaultVocalGender: 'Male',
			tags: ['록', '밴드', '기타'],
			category: 'band'
		},
		{
			id: 'metal',
			name: '메탈/하드록',
			description: '강렬한 사운드 스타일',
			iconName: 'Skull',
			color: 'text-zinc-400',
			defaultStyles: 'metal, hard rock, heavy guitar riffs, powerful drums, aggressive vocals, intense',
			defaultExclude: 'soft, gentle, acoustic, ambient, pop',
			defaultVocalGender: 'Male',
			tags: ['메탈', '하드록', '헤비'],
			category: 'band'
		},
		{
			id: 'indie',
			name: '인디/얼터너티브',
			description: '독립 음악 스타일',
			iconName: 'Feather',
			color: 'text-teal-400',
			defaultStyles: 'indie, alternative, lo-fi production, authentic, raw emotion, unique sound',
			defaultExclude: 'polished pop, mainstream, heavy production, electronic',
			defaultVocalGender: 'Female',
			tags: ['인디', '얼터너티브', '독립'],
			category: 'band'
		},
		{
			id: 'hiphop',
			name: '힙합 비트',
			description: '모던 힙합/랩 스타일',
			iconName: 'Zap',
			color: 'text-red-400',
			defaultStyles: 'hip-hop, trap beats, modern rap, bass heavy, urban, stylish flow',
			defaultExclude: 'acoustic, ballad, classical, country, soft',
			defaultVocalGender: 'Male',
			tags: ['힙합', '랩', '트랩'],
			category: 'band',
			isFavorite: true
		},
		// 전통/월드
		{
			id: 'trot',
			name: '트로트',
			description: '한국 전통 가요 스타일',
			iconName: 'MicVocal',
			color: 'text-yellow-400',
			defaultStyles: 'trot, korean traditional pop, rhythmic, cheerful, folk elements, sing-along',
			defaultExclude: 'electronic, hip-hop, rock, heavy, dark',
			defaultVocalGender: 'Male',
			tags: ['트로트', '가요', '전통'],
			category: 'world'
		},
		{
			id: 'latin',
			name: '라틴/레게톤',
			description: '라틴 리듬 스타일',
			iconName: 'Sun',
			color: 'text-yellow-500',
			defaultStyles: 'latin, reggaeton, tropical beats, spanish guitar, passionate, danceable',
			defaultExclude: 'cold, dark, minimal, ambient, classical',
			defaultVocalGender: 'Male',
			tags: ['라틴', '레게톤', '트로피컬'],
			category: 'world'
		},
		{
			id: 'reggae',
			name: '레게',
			description: '레게 리듬 스타일',
			iconName: 'TreePalm',
			color: 'text-lime-400',
			defaultStyles: 'reggae, jamaican rhythm, laid-back, sunny vibes, off-beat guitar, chill',
			defaultExclude: 'aggressive, fast, electronic, cold, dark',
			defaultVocalGender: 'Male',
			tags: ['레게', '자메이카', '칠'],
			category: 'world'
		},
		{
			id: 'citypop',
			name: '시티팝',
			description: '레트로 시티팝 스타일',
			iconName: 'CarFront',
			color: 'text-pink-400',
			defaultStyles: 'city pop, 80s japanese pop, retro synth, groovy bass, nostalgic, summer vibes',
			defaultExclude: 'heavy, aggressive, modern trap, dark, minimal',
			defaultVocalGender: 'Female',
			tags: ['시티팝', '레트로', '80s'],
			category: 'world'
		},
		// 특수/기타
		{
			id: 'ost',
			name: 'OST/시네마틱',
			description: '영화/드라마 OST 스타일',
			iconName: 'Clapperboard',
			color: 'text-indigo-400',
			defaultStyles: 'cinematic, orchestral, emotional soundtrack, epic, dramatic, film score',
			defaultExclude: 'upbeat dance, hip-hop, aggressive, punk, trap',
			defaultVocalGender: 'Female',
			tags: ['OST', '시네마틱', '드라마'],
			category: 'special'
		},
		{
			id: 'classical',
			name: '클래식/오케스트라',
			description: '클래식 음악 스타일',
			iconName: 'Piano',
			color: 'text-slate-400',
			defaultStyles: 'classical, orchestral, piano concerto, strings, elegant, timeless',
			defaultExclude: 'electronic, hip-hop, rock, modern pop, aggressive',
			defaultVocalGender: 'Female',
			tags: ['클래식', '오케스트라', '피아노'],
			category: 'special'
		},
		{
			id: 'ambient',
			name: '앰비언트/칠아웃',
			description: '편안한 배경음악 스타일',
			iconName: 'Waves',
			color: 'text-sky-400',
			defaultStyles: 'ambient, chill, relaxing, atmospheric, downtempo, peaceful',
			defaultExclude: 'aggressive, upbeat, loud, heavy bass, harsh',
			defaultVocalGender: 'Female',
			tags: ['앰비언트', '칠아웃', '릴렉스'],
			category: 'special'
		},
		{
			id: 'lofi',
			name: '로파이(Lo-Fi)',
			description: 'Lo-Fi 힙합/스터디 스타일',
			iconName: 'Coffee',
			color: 'text-amber-500',
			defaultStyles: 'lo-fi hip-hop, chill beats, vinyl crackle, mellow, study music, relaxing',
			defaultExclude: 'high energy, aggressive, loud, polished, intense',
			defaultVocalGender: 'Female',
			tags: ['로파이', '칠', '스터디'],
			category: 'special'
		},
		{
			id: 'newage',
			name: '뉴에이지/명상',
			description: '힐링 음악 스타일',
			iconName: 'Leaf',
			color: 'text-emerald-400',
			defaultStyles: 'new age, meditation, healing, nature sounds, peaceful piano, spiritual',
			defaultExclude: 'loud, aggressive, fast, electronic, heavy',
			defaultVocalGender: 'Female',
			tags: ['뉴에이지', '명상', '힐링'],
			category: 'special'
		},
		{
			id: 'gospel',
			name: '가스펠/CCM',
			description: '종교 음악 스타일',
			iconName: 'Church',
			color: 'text-violet-400',
			defaultStyles: 'gospel, CCM, worship, choir, uplifting, spiritual, hopeful',
			defaultExclude: 'dark, aggressive, secular themes, heavy, harsh',
			defaultVocalGender: 'Female',
			tags: ['가스펠', 'CCM', '찬양'],
			category: 'special'
		},
		{
			id: 'kids',
			name: '동요/키즈',
			description: '어린이 음악 스타일',
			iconName: 'Baby',
			color: 'text-pink-300',
			defaultStyles: 'kids song, nursery rhyme, cheerful, playful, simple melody, educational',
			defaultExclude: 'adult themes, complex, dark, aggressive, heavy',
			defaultVocalGender: 'Female',
			tags: ['동요', '키즈', '어린이'],
			category: 'special'
		},
		// 추가 장르들
		{
			id: 'afrobeats',
			name: 'Afrobeats',
			description: '아프리카 비트 스타일',
			iconName: 'Drum',
			color: 'text-amber-600',
			defaultStyles: 'afrobeats, african rhythm, danceable, groovy, vibrant, world fusion',
			defaultExclude: 'cold, dark, heavy metal, classical',
			defaultVocalGender: 'Male',
			tags: ['아프로비츠', '아프리카', '리듬'],
			category: 'world'
		},
		{
			id: 'anime',
			name: 'Anime OST',
			description: '애니메이션 사운드트랙',
			iconName: 'Cat',
			color: 'text-pink-500',
			defaultStyles: 'anime soundtrack, japanese pop, dramatic, energetic, emotional, epic orchestral',
			defaultExclude: 'country, blues, slow ballad',
			defaultVocalGender: 'Female',
			tags: ['애니메', 'OST', 'J-POP'],
			category: 'special'
		},
		{
			id: 'blues',
			name: 'Blues',
			description: '블루스 감성 스타일',
			iconName: 'CloudRain',
			color: 'text-blue-600',
			defaultStyles: 'blues, soulful, raw emotion, guitar driven, slow tempo, melancholic',
			defaultExclude: 'electronic, upbeat pop, dance, fast tempo',
			defaultVocalGender: 'Male',
			tags: ['블루스', '소울', '기타'],
			category: 'emotional'
		},
		{
			id: 'country',
			name: 'Country',
			description: '컨트리 음악 스타일',
			iconName: 'Wheat',
			color: 'text-yellow-600',
			defaultStyles: 'country, acoustic guitar, americana, storytelling, heartfelt, southern',
			defaultExclude: 'electronic, hip-hop, heavy metal, dark',
			defaultVocalGender: 'Male',
			tags: ['컨트리', '아메리카나', '기타'],
			category: 'emotional'
		},
		{
			id: 'dance',
			name: 'Dance',
			description: '댄스 뮤직 스타일',
			iconName: 'Disc3',
			color: 'text-violet-500',
			defaultStyles: 'dance music, club, energetic, bass heavy, catchy, party vibes',
			defaultExclude: 'slow, acoustic, ambient, classical',
			defaultVocalGender: 'Female',
			tags: ['댄스', '클럽', '파티'],
			category: 'dance'
		},
		{
			id: 'dnb',
			name: 'Drum & Bass',
			description: '드럼 앤 베이스 스타일',
			iconName: 'Gauge',
			color: 'text-orange-600',
			defaultStyles: 'drum and bass, fast tempo, heavy bassline, energetic, breakbeats',
			defaultExclude: 'slow, acoustic, ballad, classical',
			defaultVocalGender: 'Female',
			tags: ['드럼앤베이스', 'DnB', '베이스'],
			category: 'dance'
		},
		{
			id: 'dubstep',
			name: 'Dubstep',
			description: '덥스텝 스타일',
			iconName: 'Radar',
			color: 'text-purple-600',
			defaultStyles: 'dubstep, heavy bass drops, wobble, electronic, aggressive, intense',
			defaultExclude: 'acoustic, soft, classical, gentle',
			defaultVocalGender: 'Male',
			tags: ['덥스텝', '베이스', '일렉트로'],
			category: 'dance'
		},
		{
			id: 'electronic',
			name: 'Electronic',
			description: '일렉트로닉 스타일',
			iconName: 'Cable',
			color: 'text-emerald-500',
			defaultStyles: 'electronic, synth, modern production, atmospheric, textured',
			defaultExclude: 'acoustic, folk, country, classical',
			defaultVocalGender: 'Female',
			tags: ['일렉트로닉', '신스', '모던'],
			category: 'dance'
		},
		{
			id: 'experimental',
			name: 'Experimental',
			description: '실험적 음악 스타일',
			iconName: 'FlaskConical',
			color: 'text-fuchsia-500',
			defaultStyles: 'experimental, avant-garde, unique, unconventional, artistic, abstract',
			defaultExclude: 'mainstream pop, predictable, generic',
			defaultVocalGender: 'Female',
			tags: ['실험', '아방가르드', '아트'],
			category: 'special'
		},
		{
			id: 'game',
			name: 'Game OST',
			description: '게임 음악 스타일',
			iconName: 'Gamepad2',
			color: 'text-green-500',
			defaultStyles: 'game soundtrack, 8-bit, chiptune, epic orchestral, adventure, fantasy',
			defaultExclude: 'slow ballad, country, blues',
			defaultVocalGender: 'Female',
			tags: ['게임', 'OST', '칩튠'],
			category: 'special'
		},
		{
			id: 'garage',
			name: 'Garage',
			description: 'UK 개러지 스타일',
			iconName: 'Warehouse',
			color: 'text-slate-500',
			defaultStyles: 'UK garage, 2-step, shuffling beats, bass heavy, urban, groovy',
			defaultExclude: 'slow, acoustic, country, classical',
			defaultVocalGender: 'Female',
			tags: ['개러지', 'UK', '베이스'],
			category: 'dance'
		},
		{
			id: 'grime',
			name: 'Grime',
			description: 'UK 그라임 스타일',
			iconName: 'Siren',
			color: 'text-gray-500',
			defaultStyles: 'grime, UK rap, aggressive, fast tempo, electronic beats, urban',
			defaultExclude: 'soft, acoustic, slow, classical, gentle',
			defaultVocalGender: 'Male',
			tags: ['그라임', 'UK', '랩'],
			category: 'band'
		},
		{
			id: 'house',
			name: 'House',
			description: '하우스 뮤직 스타일',
			iconName: 'Grid2x2',
			color: 'text-rose-500',
			defaultStyles: 'house music, four on the floor, club, uplifting, groovy, electronic',
			defaultExclude: 'slow, acoustic, classical, heavy metal',
			defaultVocalGender: 'Female',
			tags: ['하우스', '클럽', '그루비'],
			category: 'dance'
		},
		{
			id: 'instrumental',
			name: 'Instrumental',
			description: '인스트루멘탈 스타일',
			iconName: 'AudioLines',
			color: 'text-cyan-500',
			defaultStyles: 'instrumental, no vocals, musical performance, expressive, virtuoso',
			defaultExclude: 'vocal heavy, lyrics focused',
			defaultVocalGender: 'Female',
			tags: ['인스트루멘탈', '연주', '무반주'],
			category: 'special'
		},
		{
			id: 'jpop',
			name: 'J-POP',
			description: '일본 팝 스타일',
			iconName: 'Cherry',
			color: 'text-pink-400',
			defaultStyles: 'J-pop, japanese pop, catchy, melodic, energetic, kawaii',
			defaultExclude: 'heavy metal, dark, aggressive',
			defaultVocalGender: 'Female',
			tags: ['J-POP', '일본', '팝'],
			category: 'world'
		},
		{
			id: 'pop',
			name: 'Pop',
			description: '팝 뮤직 스타일',
			iconName: 'Star',
			color: 'text-yellow-400',
			defaultStyles: 'pop, catchy hooks, mainstream, polished production, radio friendly',
			defaultExclude: 'experimental, avant-garde, heavy metal, dark',
			defaultVocalGender: 'Female',
			tags: ['팝', '메인스트림', '캐치'],
			category: 'dance',
			isFavorite: true
		},
		{
			id: 'punk',
			name: 'Punk',
			description: '펑크 록 스타일',
			iconName: 'Bomb',
			color: 'text-red-600',
			defaultStyles: 'punk rock, raw energy, rebellious, fast tempo, distorted guitars',
			defaultExclude: 'soft, gentle, classical, ambient',
			defaultVocalGender: 'Male',
			tags: ['펑크', '록', '반항'],
			category: 'band'
		},
		{
			id: 'soul',
			name: 'Soul',
			description: '소울 뮤직 스타일',
			iconName: 'HeartPulse',
			color: 'text-red-400',
			defaultStyles: 'soul music, emotional vocals, gospel influence, groovy, heartfelt',
			defaultExclude: 'electronic, harsh, aggressive, cold',
			defaultVocalGender: 'Female',
			tags: ['소울', '감성', '그루비'],
			category: 'emotional'
		},
		{
			id: 'techno',
			name: 'Techno',
			description: '테크노 스타일',
			iconName: 'Activity',
			color: 'text-zinc-500',
			defaultStyles: 'techno, repetitive beats, hypnotic, industrial, dark, minimal',
			defaultExclude: 'acoustic, soft, ballad, country',
			defaultVocalGender: 'Female',
			tags: ['테크노', '미니멀', '클럽'],
			category: 'dance'
		},
		{
			id: 'trance',
			name: 'Trance',
			description: '트랜스 스타일',
			iconName: 'Orbit',
			color: 'text-indigo-500',
			defaultStyles: 'trance, euphoric, uplifting, melodic, atmospheric, build-ups',
			defaultExclude: 'slow, acoustic, classical, country',
			defaultVocalGender: 'Female',
			tags: ['트랜스', '유포릭', '멜로딕'],
			category: 'dance'
		},
		{
			id: 'world',
			name: 'World Music',
			description: '월드 뮤직 스타일',
			iconName: 'Earth',
			color: 'text-teal-500',
			defaultStyles: 'world music, ethnic, traditional instruments, cultural fusion, global',
			defaultExclude: 'generic pop, standard western',
			defaultVocalGender: 'Female',
			tags: ['월드', '에스닉', '퓨전'],
			category: 'world'
		},
		{
			id: 'synthwave',
			name: 'Synthwave',
			description: '신스웨이브 스타일',
			iconName: 'Radio',
			color: 'text-purple-500',
			defaultStyles: 'synthwave, retro 80s, neon, driving synths, nostalgic, cinematic',
			defaultExclude: 'acoustic, folk, country, classical',
			defaultVocalGender: 'Female',
			tags: ['신스웨이브', '레트로', '80s'],
			category: 'dance'
		},
		{
			id: 'europop',
			name: 'Europop',
			description: '유럽 팝 스타일',
			iconName: 'Euro',
			color: 'text-blue-500',
			defaultStyles: 'europop, eurodance, catchy melodies, upbeat, electronic pop, 90s vibes',
			defaultExclude: 'slow, acoustic, heavy, dark',
			defaultVocalGender: 'Female',
			tags: ['유로팝', '유로댄스', '90s'],
			category: 'dance'
		},
		{
			id: 'shoegaze',
			name: 'Shoegaze',
			description: '슈게이즈 스타일',
			iconName: 'CloudFog',
			color: 'text-slate-400',
			defaultStyles: 'shoegaze, dreamy guitars, wall of sound, ethereal, reverb heavy, atmospheric',
			defaultExclude: 'clean, crisp, upbeat pop, hip-hop',
			defaultVocalGender: 'Female',
			tags: ['슈게이즈', '드리미', '기타'],
			category: 'band'
		},
		// 새로 추가된 장르들
		{
			id: 'chillwave',
			name: 'Chillwave',
			description: '칠웨이브 스타일',
			iconName: 'Sunset',
			color: 'text-orange-400',
			defaultStyles: 'chillwave, dreamy, nostalgic, lo-fi synths, summer vibes, relaxed',
			defaultExclude: 'aggressive, fast, heavy, harsh',
			defaultVocalGender: 'Female',
			tags: ['칠웨이브', '드리미', '노스탤직'],
			category: 'dance'
		},
		{
			id: 'vaporwave',
			name: 'Vaporwave',
			description: '베이퍼웨이브 스타일',
			iconName: 'Tv',
			color: 'text-pink-500',
			defaultStyles: 'vaporwave, retro, slowed, 80s samples, nostalgic, surreal',
			defaultExclude: 'modern, fast tempo, aggressive',
			defaultVocalGender: 'Female',
			tags: ['베이퍼웨이브', '레트로', '80s'],
			category: 'dance'
		},
		{
			id: 'hardstyle',
			name: 'Hardstyle',
			description: '하드스타일 스타일',
			iconName: 'Bolt',
			color: 'text-yellow-500',
			defaultStyles: 'hardstyle, hard kick, euphoric melodies, high energy, festival, intense',
			defaultExclude: 'soft, acoustic, slow, gentle',
			defaultVocalGender: 'Female',
			tags: ['하드스타일', '페스티벌', '하드'],
			category: 'dance'
		},
		{
			id: 'psytrance',
			name: 'Psytrance',
			description: '사이트랜스 스타일',
			iconName: 'Eye',
			color: 'text-green-400',
			defaultStyles: 'psytrance, psychedelic, trippy, driving bassline, hypnotic, energetic',
			defaultExclude: 'slow, acoustic, pop, simple',
			defaultVocalGender: 'Female',
			tags: ['사이트랜스', '사이키델릭', '트랜스'],
			category: 'dance'
		},
		{
			id: 'futurebass',
			name: 'Future Bass',
			description: '퓨처베이스 스타일',
			iconName: 'Wand2',
			color: 'text-cyan-400',
			defaultStyles: 'future bass, wobbly synths, uplifting, emotional drops, colorful, modern',
			defaultExclude: 'dark, aggressive, acoustic, classical',
			defaultVocalGender: 'Female',
			tags: ['퓨처베이스', '모던', 'EDM'],
			category: 'dance'
		},
		{
			id: 'ukdrill',
			name: 'UK Drill',
			description: 'UK 드릴 스타일',
			iconName: 'Target',
			color: 'text-gray-400',
			defaultStyles: 'UK drill, sliding 808s, dark beats, aggressive flow, urban, gritty',
			defaultExclude: 'soft, acoustic, uplifting, bright',
			defaultVocalGender: 'Male',
			tags: ['UK드릴', '드릴', '힙합'],
			category: 'band'
		},
		{
			id: 'phonk',
			name: 'Phonk',
			description: '포크 스타일',
			iconName: 'Ghost',
			color: 'text-red-500',
			defaultStyles: 'phonk, dark trap, memphis rap, cowbell, aggressive, drift vibes',
			defaultExclude: 'soft, bright, acoustic, gentle',
			defaultVocalGender: 'Male',
			tags: ['포크', '다크트랩', '멤피스'],
			category: 'band'
		},
		{
			id: 'hyperpop',
			name: 'Hyperpop',
			description: '하이퍼팝 스타일',
			iconName: 'Candy',
			color: 'text-pink-400',
			defaultStyles: 'hyperpop, glitchy, maximalist, pitched vocals, experimental pop, chaotic',
			defaultExclude: 'minimal, acoustic, traditional, slow',
			defaultVocalGender: 'Female',
			tags: ['하이퍼팝', '글리치', '실험'],
			category: 'dance'
		},
		{
			id: 'postpunk',
			name: 'Post-Punk',
			description: '포스트펑크 스타일',
			iconName: 'Anchor',
			color: 'text-zinc-500',
			defaultStyles: 'post-punk, dark, angular guitars, atmospheric, cold wave, moody',
			defaultExclude: 'bright, upbeat, pop, acoustic',
			defaultVocalGender: 'Male',
			tags: ['포스트펑크', '다크', '뉴웨이브'],
			category: 'band'
		},
		{
			id: 'mathrock',
			name: 'Math Rock',
			description: '매스록 스타일',
			iconName: 'Calculator',
			color: 'text-emerald-500',
			defaultStyles: 'math rock, complex time signatures, intricate guitar, technical, dynamic',
			defaultExclude: 'simple, pop, slow, ambient',
			defaultVocalGender: 'Male',
			tags: ['매스록', '테크니컬', '기타'],
			category: 'band'
		},
		{
			id: 'postrock',
			name: 'Post-Rock',
			description: '포스트록 스타일',
			iconName: 'Mountain',
			color: 'text-stone-500',
			defaultStyles: 'post-rock, crescendos, atmospheric, instrumental, epic, cinematic',
			defaultExclude: 'pop, fast tempo, dance, hip-hop',
			defaultVocalGender: 'Female',
			tags: ['포스트록', '시네마틱', '인스트루멘탈'],
			category: 'band'
		},
		{
			id: 'dreampop',
			name: 'Dream Pop',
			description: '드림팝 스타일',
			iconName: 'Cloud',
			color: 'text-sky-300',
			defaultStyles: 'dream pop, ethereal, hazy guitars, soft vocals, atmospheric, blissful',
			defaultExclude: 'aggressive, harsh, heavy, fast',
			defaultVocalGender: 'Female',
			tags: ['드림팝', '이더리얼', '몽환'],
			category: 'emotional'
		},
		{
			id: 'darkwave',
			name: 'Darkwave',
			description: '다크웨이브 스타일',
			iconName: 'MoonStar',
			color: 'text-indigo-600',
			defaultStyles: 'darkwave, gothic synth, cold atmosphere, dark melodies, 80s goth',
			defaultExclude: 'bright, upbeat, pop, happy',
			defaultVocalGender: 'Female',
			tags: ['다크웨이브', '고딕', '신스'],
			category: 'dance'
		},
		{
			id: 'industrial',
			name: 'Industrial',
			description: '인더스트리얼 스타일',
			iconName: 'Factory',
			color: 'text-neutral-500',
			defaultStyles: 'industrial, mechanical, harsh, aggressive, distorted, experimental',
			defaultExclude: 'soft, acoustic, gentle, pop',
			defaultVocalGender: 'Male',
			tags: ['인더스트리얼', '하드', '익스페리멘탈'],
			category: 'band'
		},
		{
			id: 'grunge',
			name: 'Grunge',
			description: '그런지 스타일',
			iconName: 'Trash2',
			color: 'text-amber-700',
			defaultStyles: 'grunge, dirty guitars, raw, angst, 90s seattle, alternative rock',
			defaultExclude: 'polished, pop, electronic, clean',
			defaultVocalGender: 'Male',
			tags: ['그런지', '얼터너티브', '90s'],
			category: 'band'
		},
		{
			id: 'ska',
			name: 'Ska',
			description: '스카 스타일',
			iconName: 'Music2',
			color: 'text-lime-500',
			defaultStyles: 'ska, upbeat, brass section, offbeat rhythm, energetic, jamaican roots',
			defaultExclude: 'slow, dark, heavy, ambient',
			defaultVocalGender: 'Male',
			tags: ['스카', '브라스', '업비트'],
			category: 'world'
		},
		{
			id: 'dub',
			name: 'Dub',
			description: '덥 스타일',
			iconName: 'Volume2',
			color: 'text-green-600',
			defaultStyles: 'dub, heavy bass, echo effects, spacey, jamaican, laid-back',
			defaultExclude: 'fast, aggressive, bright, pop',
			defaultVocalGender: 'Male',
			tags: ['덥', '레게', '베이스'],
			category: 'world'
		},
		{
			id: 'breakbeat',
			name: 'Breakbeat',
			description: '브레이크비트 스타일',
			iconName: 'Shuffle',
			color: 'text-orange-500',
			defaultStyles: 'breakbeat, broken beats, funky, energetic, sampled drums, groovy',
			defaultExclude: 'slow, acoustic, classical, ambient',
			defaultVocalGender: 'Female',
			tags: ['브레이크비트', '펑키', '댄스'],
			category: 'dance'
		}
	
];

/** 빈 프로젝트 템플릿 */
export const BLANK_TEMPLATE: ProjectTemplate = {
	id: 'blank',
	name: '빈 프로젝트',
	description: '',
	iconName: 'Droplet',
	color: '',
	defaultStyles: '',
	defaultExclude: '',
	defaultVocalGender: 'Female',
	tags: [],
	category: 'special'
};
