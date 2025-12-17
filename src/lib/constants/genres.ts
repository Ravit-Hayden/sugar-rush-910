/**
 * 음악 장르 목록
 * 모든 페이지에서 공통으로 사용되는 장르 배열
 */
export const GENRES = [
	'Acoustic',
	'Afrobeats',
	'Alternative',
	'Ambient',
	'Anime',
	'Ballad',
	'Blues',
	'Classical',
	'Country',
	'Dance',
	'Disco',
	'Drum & Bass',
	'Dubstep',
	'EDM',
	'Electronic',
	'Experimental',
	'Folk',
	'Funk',
	'Game',
	'Garage',
	'Gospel',
	'Grime',
	'Hip-Hop',
	'House',
	'Indie',
	'Instrumental',
	'Jazz',
	'J-Pop',
	'K-Pop',
	'Latin',
	'Lo-Fi',
	'Metal',
	'New Age',
	'OST',
	'Pop',
	'Punk',
	'R&B',
	'Reggae',
	'Rock',
	'Soul',
	'Soundtrack',
	'Synthwave',
	'Techno',
	'Trap',
	'Trance',
	'World',
	'기타'
] as const;

/**
 * 장르 타입 (타입 안전성을 위해)
 */
export type Genre = (typeof GENRES)[number];



