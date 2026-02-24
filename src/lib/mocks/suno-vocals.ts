import type { VirtualVocal } from '$lib/types/suno';

export const mockVocalSamples: VirtualVocal[] = [
	{
		id: 'v1',
		name: 'Luna',
		description: '여성 메인 보컬. 청아하고 맑은 음색, 고음 처리 우수',
		linkedTracks: ['track1', 'track2', 'track3'],
		createdAt: '2025-11-01'
	},
	{
		id: 'v2',
		name: 'Ray',
		description: '남성 메인 보컬. 중저음의 깊은 음색, 감성적인 표현',
		linkedTracks: ['track4', 'track5'],
		createdAt: '2025-11-15'
	},
	{
		id: 'v3',
		name: 'Sugar Rush Collective',
		description: '팀 그룹 보컬. 다양한 보컬 조합 가능',
		linkedTracks: ['track1', 'track6', 'track7', 'track8'],
		createdAt: '2025-10-20'
	},
	{
		id: 'v4',
		name: 'Stellar',
		description: '여성 서브 보컬. 파워풀한 고음과 샤우팅 전문',
		linkedTracks: ['track9'],
		createdAt: '2026-01-05'
	},
	{
		id: 'v5',
		name: 'Echo',
		description: '유니섹스 보컬. 몽환적이고 신비로운 분위기',
		linkedTracks: [],
		createdAt: '2026-01-10'
	}
];
