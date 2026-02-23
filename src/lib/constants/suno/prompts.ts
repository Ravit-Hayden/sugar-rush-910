/**
 * SUNO 프롬프트 관련 상수
 */

import type { SUNOVersion, VocalGender, LyricsMode, GenerationType, SUNOMode } from '$lib/types/suno';

/** SUNO 버전 옵션 */
export const SUNO_VERSIONS: { value: SUNOVersion; label: string; tier?: string }[] = [
	{ value: 'v5', label: 'v5', tier: 'Pro' },
	{ value: 'v4.5+', label: 'v4.5+', tier: 'Pro' },
	{ value: 'v4.5', label: 'v4.5', tier: 'Pro' },
	{ value: 'v4.5-all', label: 'v4.5-all', tier: 'Free' },
	{ value: 'v4', label: 'v4', tier: 'Pro' },
	{ value: 'v3.5', label: 'v3.5' },
	{ value: 'v3', label: 'v3' }
];

/** 모드 옵션 */
export const SUNO_MODES: { value: SUNOMode; label: string }[] = [
	{ value: 'Simple', label: 'Simple' },
	{ value: 'Custom', label: 'Custom' }
];

/** 생성 유형 옵션 */
export const GENERATION_TYPES: { value: GenerationType; label: string; description: string }[] = [
	{ value: 'create', label: '새로 생성', description: '새로운 곡 생성' },
	{ value: 'extend', label: '확장', description: '기존 곡 확장' },
	{ value: 'remaster', label: '리마스터', description: '기존 곡 리마스터' },
	{ value: 'cover', label: '커버', description: '커버 버전 생성' }
];

/** 보컬 성별 옵션 */
export const VOCAL_GENDERS: { value: VocalGender; label: string }[] = [
	{ value: 'Male', label: 'Male' },
	{ value: 'Female', label: 'Female' },
	{ value: 'Duet', label: 'Duet' }
];

/** 가사 모드 옵션 */
export const LYRICS_MODES: { value: LyricsMode; label: string }[] = [
	{ value: 'Manual', label: 'Manual' },
	{ value: 'Auto', label: 'Auto' }
];

/** 기본 스타일 프롬프트 예시 */
export const DEFAULT_STYLE_PROMPTS: string[] = [
	'polished but emotive, with precise phrasing and dynamic control',
	'dreamy synth-pop with ethereal vocals',
	'upbeat K-pop with catchy hooks',
	'mellow acoustic with warm vocals',
	'energetic dance-pop with powerful beats',
	'soft ballad with emotional delivery',
	'indie rock with raw vocals',
	'R&B soul with smooth grooves',
	'electronic with futuristic sounds',
	'tropical house with summer vibes'
];

/** 기본 제외 스타일 예시 */
export const DEFAULT_EXCLUDE_PROMPTS: string[] = [
	'heavy metal, screaming',
	'off-key, amateur',
	'distorted, noisy',
	'monotone, robotic',
	'aggressive, harsh'
];

/** 프롬프트 최대 길이 (띄어쓰기 포함) */
export const MAX_PROMPT_LENGTH = 1000;

/** 슬라이더 기본값 */
export const DEFAULT_SLIDER_VALUES = {
	weirdness: 50,
	styleInfluence: 50,
	audioInfluence: 25
};

/** 오디오 소스 유형 옵션 */
export const AUDIO_SOURCE_TYPES = [
	{ value: 'Audio', label: 'Audio' },
	{ value: 'Persona', label: 'Persona' },
	{ value: 'Inspo', label: 'Inspo' }
] as const;
