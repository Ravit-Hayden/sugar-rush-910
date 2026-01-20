<script lang="ts">
	import { goto } from '$app/navigation';
	import { Plus, Search, ChevronDown, X, Filter, ArrowUpDown, UserRound, Music, SearchX } from 'lucide-svelte';
	import ProductionProgress from '$lib/components/suno/ProductionProgress.svelte';
	import SUNOTabs from '$lib/components/suno/SUNOTabs.svelte';
	import ProjectTemplates from '$lib/components/suno/ProjectTemplates.svelte';
	import { PRODUCTION_STAGES } from '$lib/constants/suno/stages';
	import type { SUNOProject, ProductionStageStatus, ProjectStatus, ProductionStageId } from '$lib/types/suno';

	// 템플릿 모달 상태
	let showTemplates = $state(false);

	// 필터 상태
	let searchQuery = $state('');
	let stageFilter = $state<ProductionStageId | 'all'>('all');
	let stageDropdownOpen = $state(false);
	
	// 담당자 필터 (프로젝트 생성자 기준)
	type AssigneeFilter = 'all' | 'El' | 'Otte';
	let assigneeFilter = $state<AssigneeFilter>('all');
	let assigneeDropdownOpen = $state(false);
	
	const assigneeLabels: Record<AssigneeFilter, string> = {
		all: '전체',
		El: 'El',
		Otte: 'Otte'
	};

	// 정렬 상태
	type SortOption = 'updated_desc' | 'updated_asc' | 'created_desc' | 'created_asc' | 'title_asc' | 'title_desc' | 'progress_desc' | 'progress_asc';
	let sortBy = $state<SortOption>('updated_desc');
	let sortDropdownOpen = $state(false);

	const sortLabels: Record<SortOption, string> = {
		updated_desc: '최근 수정순',
		updated_asc: '오래된 수정순',
		created_desc: '최근 생성순',
		created_asc: '오래된 생성순',
		title_asc: '이름순 (ㄱ-ㅎ)',
		title_desc: '이름순 (ㅎ-ㄱ)',
		progress_desc: '진행률 높은순',
		progress_asc: '진행률 낮은순'
	};

	// 프로젝트의 현재 단계 가져오기 (첫 번째 미완료 단계)
	function getCurrentStage(project: SUNOProject): ProductionStageId | null {
		// 모든 단계가 완료되었으면 released
		const allCompleted = PRODUCTION_STAGES.every(stage => 
			project.stages.find(s => s.stageId === stage.id)?.isCompleted
		);
		if (allCompleted) return 'released';
		
		// 첫 번째 미완료 단계 찾기
		for (const stage of PRODUCTION_STAGES) {
			const projectStage = project.stages.find(s => s.stageId === stage.id);
			if (!projectStage || !projectStage.isCompleted) {
				return stage.id;
			}
		}
		return 'idea';
	}

	// 상대 시간 표시 함수
	function getRelativeTime(dateString: string): string {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffSec = Math.floor(diffMs / 1000);
		const diffMin = Math.floor(diffSec / 60);
		const diffHour = Math.floor(diffMin / 60);
		const diffDay = Math.floor(diffHour / 24);
		const diffWeek = Math.floor(diffDay / 7);
		const diffMonth = Math.floor(diffDay / 30);

		if (diffSec < 60) return '방금 전';
		if (diffMin < 60) return `${diffMin}분 전`;
		if (diffHour < 24) return `${diffHour}시간 전`;
		if (diffDay === 1) return '어제';
		if (diffDay < 7) return `${diffDay}일 전`;
		if (diffWeek < 4) return `${diffWeek}주 전`;
		if (diffMonth < 12) return `${diffMonth}개월 전`;
		return dateString;
	}

	// 단계 라벨 매핑
	const stageLabels: Record<ProductionStageId | 'all', string> = {
		all: '전체',
		idea: '아이디어 기획',
		lyrics_draft: '가사 초안',
		lyrics_structure: '곡구조 버전',
		lyrics_suno: '수노발음 버전',
		prompt_writing: '프롬프트 작성',
		suno_generation: 'SUNO 생성',
		suno_comparison: '버전 비교',
		suno_selection: '곡 선정',
		mixing: '믹싱',
		audio_editing: '음원 수정',
		mastering: '마스터링',
		lyrics_final: '앨범등록 가사',
		artwork: '아트워크 제작',
		track_info: '곡 정보 입력',
		album_ready: '앨범 등록 준비',
		distribution: '배포처 업로드',
		promotion: '홍보/마케팅',
		released: '발매 완료'
	};

	// 목업 데이터
	let projects = $state<SUNOProject[]>([
		{
			id: 'proj1',
			title: '달콤한 밤의 노래',
			description: '여름밤 감성 발라드',
			status: 'in_progress',
			stages: [
				{ stageId: 'idea', isCompleted: true, completedAt: '2026-01-05', completedBy: 'Otte' },
				{ stageId: 'lyrics_draft', isCompleted: true, completedAt: '2026-01-07', completedBy: 'Otte' },
				{ stageId: 'lyrics_structure', isCompleted: true, completedAt: '2026-01-08', completedBy: 'Otte' },
				{ stageId: 'lyrics_suno', isCompleted: true, completedAt: '2026-01-09', completedBy: 'Otte' },
				{ stageId: 'suno_generation', isCompleted: true, completedAt: '2026-01-10', completedBy: 'El' },
				{ stageId: 'suno_selection', isCompleted: false }
			] as ProductionStageStatus[],
			progressPercent: 45,
			createdBy: 'Otte',
			lyricsVersions: [],
			promptConfigs: [],
			audioVersions: [],
			usedWordIds: [],
			createdAt: '2026-01-05',
			updatedAt: '2026-01-10'
		},
		{
			id: 'proj2',
			title: '마카롱 팝',
			description: '귀여운 디저트 컨셉 팝송',
			status: 'in_progress',
			stages: [
				{ stageId: 'idea', isCompleted: true, completedAt: '2026-01-10', completedBy: 'El' },
				{ stageId: 'lyrics_draft', isCompleted: true, completedAt: '2026-01-11', completedBy: 'Otte' },
				{ stageId: 'lyrics_structure', isCompleted: false }
			] as ProductionStageStatus[],
			progressPercent: 18,
			createdBy: 'El',
			lyricsVersions: [],
			promptConfigs: [],
			audioVersions: [],
			usedWordIds: [],
			createdAt: '2026-01-10',
			updatedAt: '2026-01-11'
		},
		{
			id: 'proj3',
			title: '새벽 3시의 고백',
			description: '심야 감성 R&B',
			status: 'in_progress',
			stages: [
				{ stageId: 'idea', isCompleted: true, completedAt: '2026-01-01', completedBy: 'Otte' },
				{ stageId: 'lyrics_draft', isCompleted: true, completedAt: '2026-01-02', completedBy: 'Otte' },
				{ stageId: 'lyrics_structure', isCompleted: true, completedAt: '2026-01-03', completedBy: 'Otte' },
				{ stageId: 'lyrics_suno', isCompleted: true, completedAt: '2026-01-04', completedBy: 'Otte' },
				{ stageId: 'suno_generation', isCompleted: true, completedAt: '2026-01-05', completedBy: 'El' },
				{ stageId: 'suno_selection', isCompleted: true, completedAt: '2026-01-06', completedBy: 'El' },
				{ stageId: 'audio_editing', isCompleted: true, completedAt: '2026-01-08', completedBy: 'El' },
				{ stageId: 'lyrics_final', isCompleted: true, completedAt: '2026-01-09', completedBy: 'Otte' },
				{ stageId: 'mastering', isCompleted: false }
			] as ProductionStageStatus[],
			progressPercent: 73,
			createdBy: 'Otte',
			lyricsVersions: [],
			promptConfigs: [],
			audioVersions: [],
			usedWordIds: [],
			createdAt: '2026-01-01',
			updatedAt: '2026-01-09'
		},
		{
			id: 'proj4',
			title: 'Sugar Rush Vol.1',
			description: '첫 번째 정규앨범 타이틀곡',
			status: 'completed',
			stages: PRODUCTION_STAGES.map(stage => ({
				stageId: stage.id,
				isCompleted: true,
				completedAt: '2025-12-20',
				completedBy: stage.assignedTo === 'El' ? 'El' : 'Otte'
			})) as ProductionStageStatus[],
			progressPercent: 100,
			createdBy: 'El',
			lyricsVersions: [],
			promptConfigs: [],
			audioVersions: [],
			usedWordIds: [],
			linkedTrackId: 'track1',
			createdAt: '2025-11-15',
			updatedAt: '2025-12-20'
		},
		{
			id: 'proj5',
			title: '별빛 아래서',
			description: '로맨틱 팝 발라드',
			status: 'idea',
			stages: [
				{ stageId: 'idea', isCompleted: false }
			] as ProductionStageStatus[],
			progressPercent: 0,
			createdBy: 'Otte',
			lyricsVersions: [],
			promptConfigs: [],
			audioVersions: [],
			usedWordIds: [],
			createdAt: '2026-01-13',
			updatedAt: '2026-01-13'
		},
		{
			id: 'proj6',
			title: '네온 드라이브',
			description: '시티팝 레트로 바이브',
			status: 'in_progress',
			stages: [
				{ stageId: 'idea', isCompleted: true, completedAt: '2026-01-08', completedBy: 'El' },
				{ stageId: 'lyrics_draft', isCompleted: true, completedAt: '2026-01-09', completedBy: 'Otte' },
				{ stageId: 'lyrics_structure', isCompleted: true, completedAt: '2026-01-10', completedBy: 'Otte' },
				{ stageId: 'lyrics_suno', isCompleted: true, completedAt: '2026-01-11', completedBy: 'Otte' },
				{ stageId: 'prompt_writing', isCompleted: false }
			] as ProductionStageStatus[],
			progressPercent: 22,
			createdBy: 'El',
			lyricsVersions: [],
			promptConfigs: [],
			audioVersions: [],
			usedWordIds: [],
			createdAt: '2026-01-08',
			updatedAt: '2026-01-11'
		},
		{
			id: 'proj7',
			title: '허니 트랩',
			description: '중독성 있는 댄스팝',
			status: 'in_progress',
			stages: [
				{ stageId: 'idea', isCompleted: true, completedAt: '2026-01-02', completedBy: 'El' },
				{ stageId: 'lyrics_draft', isCompleted: true, completedAt: '2026-01-03', completedBy: 'Otte' },
				{ stageId: 'lyrics_structure', isCompleted: true, completedAt: '2026-01-04', completedBy: 'Otte' },
				{ stageId: 'lyrics_suno', isCompleted: true, completedAt: '2026-01-05', completedBy: 'Otte' },
				{ stageId: 'prompt_writing', isCompleted: true, completedAt: '2026-01-06', completedBy: 'El' },
				{ stageId: 'suno_generation', isCompleted: true, completedAt: '2026-01-07', completedBy: 'El' },
				{ stageId: 'suno_comparison', isCompleted: false }
			] as ProductionStageStatus[],
			progressPercent: 33,
			createdBy: 'El',
			lyricsVersions: [],
			promptConfigs: [],
			audioVersions: [],
			usedWordIds: [],
			createdAt: '2026-01-02',
			updatedAt: '2026-01-07'
		},
		{
			id: 'proj8',
			title: '문라이트 소나타',
			description: '피아노 중심 발라드',
			status: 'in_progress',
			stages: [
				{ stageId: 'idea', isCompleted: true, completedAt: '2025-12-20', completedBy: 'Otte' },
				{ stageId: 'lyrics_draft', isCompleted: true, completedAt: '2025-12-22', completedBy: 'Otte' },
				{ stageId: 'lyrics_structure', isCompleted: true, completedAt: '2025-12-24', completedBy: 'Otte' },
				{ stageId: 'lyrics_suno', isCompleted: true, completedAt: '2025-12-26', completedBy: 'Otte' },
				{ stageId: 'prompt_writing', isCompleted: true, completedAt: '2025-12-28', completedBy: 'El' },
				{ stageId: 'suno_generation', isCompleted: true, completedAt: '2025-12-30', completedBy: 'El' },
				{ stageId: 'suno_comparison', isCompleted: true, completedAt: '2026-01-01', completedBy: 'Both' },
				{ stageId: 'suno_selection', isCompleted: true, completedAt: '2026-01-02', completedBy: 'Both' },
				{ stageId: 'mixing', isCompleted: false }
			] as ProductionStageStatus[],
			progressPercent: 44,
			createdBy: 'Otte',
			lyricsVersions: [],
			promptConfigs: [],
			audioVersions: [],
			usedWordIds: [],
			createdAt: '2025-12-20',
			updatedAt: '2026-01-02'
		},
		{
			id: 'proj9',
			title: '캔디 크러쉬',
			description: '통통 튀는 틴팝',
			status: 'in_progress',
			stages: [
				{ stageId: 'idea', isCompleted: true, completedAt: '2025-12-15', completedBy: 'El' },
				{ stageId: 'lyrics_draft', isCompleted: true, completedAt: '2025-12-16', completedBy: 'Otte' },
				{ stageId: 'lyrics_structure', isCompleted: true, completedAt: '2025-12-17', completedBy: 'Otte' },
				{ stageId: 'lyrics_suno', isCompleted: true, completedAt: '2025-12-18', completedBy: 'Otte' },
				{ stageId: 'prompt_writing', isCompleted: true, completedAt: '2025-12-19', completedBy: 'El' },
				{ stageId: 'suno_generation', isCompleted: true, completedAt: '2025-12-20', completedBy: 'El' },
				{ stageId: 'suno_comparison', isCompleted: true, completedAt: '2025-12-21', completedBy: 'Both' },
				{ stageId: 'suno_selection', isCompleted: true, completedAt: '2025-12-22', completedBy: 'Both' },
				{ stageId: 'mixing', isCompleted: true, completedAt: '2025-12-24', completedBy: 'El' },
				{ stageId: 'audio_editing', isCompleted: true, completedAt: '2025-12-26', completedBy: 'El' },
				{ stageId: 'mastering', isCompleted: true, completedAt: '2025-12-28', completedBy: 'El' },
				{ stageId: 'lyrics_final', isCompleted: false }
			] as ProductionStageStatus[],
			progressPercent: 61,
			createdBy: 'El',
			lyricsVersions: [],
			promptConfigs: [],
			audioVersions: [],
			usedWordIds: [],
			createdAt: '2025-12-15',
			updatedAt: '2025-12-28'
		},
		{
			id: 'proj10',
			title: '미드나잇 블루',
			description: '재즈 힙합 퓨전',
			status: 'in_progress',
			stages: [
				{ stageId: 'idea', isCompleted: true, completedAt: '2025-12-01', completedBy: 'Otte' },
				{ stageId: 'lyrics_draft', isCompleted: true, completedAt: '2025-12-03', completedBy: 'Otte' },
				{ stageId: 'lyrics_structure', isCompleted: true, completedAt: '2025-12-05', completedBy: 'Otte' },
				{ stageId: 'lyrics_suno', isCompleted: true, completedAt: '2025-12-07', completedBy: 'Otte' },
				{ stageId: 'prompt_writing', isCompleted: true, completedAt: '2025-12-08', completedBy: 'El' },
				{ stageId: 'suno_generation', isCompleted: true, completedAt: '2025-12-10', completedBy: 'El' },
				{ stageId: 'suno_comparison', isCompleted: true, completedAt: '2025-12-11', completedBy: 'Both' },
				{ stageId: 'suno_selection', isCompleted: true, completedAt: '2025-12-12', completedBy: 'Both' },
				{ stageId: 'mixing', isCompleted: true, completedAt: '2025-12-14', completedBy: 'El' },
				{ stageId: 'audio_editing', isCompleted: true, completedAt: '2025-12-16', completedBy: 'El' },
				{ stageId: 'mastering', isCompleted: true, completedAt: '2025-12-18', completedBy: 'El' },
				{ stageId: 'lyrics_final', isCompleted: true, completedAt: '2025-12-19', completedBy: 'Otte' },
				{ stageId: 'artwork', isCompleted: false }
			] as ProductionStageStatus[],
			progressPercent: 67,
			createdBy: 'Otte',
			lyricsVersions: [],
			promptConfigs: [],
			audioVersions: [],
			usedWordIds: [],
			createdAt: '2025-12-01',
			updatedAt: '2025-12-19'
		},
		{
			id: 'proj11',
			title: '체리 블로썸',
			description: '봄날 감성 팝',
			status: 'in_progress',
			stages: [
				{ stageId: 'idea', isCompleted: true, completedAt: '2025-11-20', completedBy: 'El' },
				{ stageId: 'lyrics_draft', isCompleted: true, completedAt: '2025-11-22', completedBy: 'Otte' },
				{ stageId: 'lyrics_structure', isCompleted: true, completedAt: '2025-11-24', completedBy: 'Otte' },
				{ stageId: 'lyrics_suno', isCompleted: true, completedAt: '2025-11-26', completedBy: 'Otte' },
				{ stageId: 'prompt_writing', isCompleted: true, completedAt: '2025-11-27', completedBy: 'El' },
				{ stageId: 'suno_generation', isCompleted: true, completedAt: '2025-11-29', completedBy: 'El' },
				{ stageId: 'suno_comparison', isCompleted: true, completedAt: '2025-11-30', completedBy: 'Both' },
				{ stageId: 'suno_selection', isCompleted: true, completedAt: '2025-12-01', completedBy: 'Both' },
				{ stageId: 'mixing', isCompleted: true, completedAt: '2025-12-03', completedBy: 'El' },
				{ stageId: 'audio_editing', isCompleted: true, completedAt: '2025-12-05', completedBy: 'El' },
				{ stageId: 'mastering', isCompleted: true, completedAt: '2025-12-07', completedBy: 'El' },
				{ stageId: 'lyrics_final', isCompleted: true, completedAt: '2025-12-08', completedBy: 'Otte' },
				{ stageId: 'artwork', isCompleted: true, completedAt: '2025-12-10', completedBy: 'El' },
				{ stageId: 'track_info', isCompleted: false }
			] as ProductionStageStatus[],
			progressPercent: 72,
			createdBy: 'El',
			lyricsVersions: [],
			promptConfigs: [],
			audioVersions: [],
			usedWordIds: [],
			createdAt: '2025-11-20',
			updatedAt: '2025-12-10'
		},
		{
			id: 'proj12',
			title: '스타더스트',
			description: '우주 컨셉 일렉트로닉',
			status: 'in_progress',
			stages: [
				{ stageId: 'idea', isCompleted: true, completedAt: '2025-11-01', completedBy: 'Otte' },
				{ stageId: 'lyrics_draft', isCompleted: true, completedAt: '2025-11-03', completedBy: 'Otte' },
				{ stageId: 'lyrics_structure', isCompleted: true, completedAt: '2025-11-05', completedBy: 'Otte' },
				{ stageId: 'lyrics_suno', isCompleted: true, completedAt: '2025-11-07', completedBy: 'Otte' },
				{ stageId: 'prompt_writing', isCompleted: true, completedAt: '2025-11-08', completedBy: 'El' },
				{ stageId: 'suno_generation', isCompleted: true, completedAt: '2025-11-10', completedBy: 'El' },
				{ stageId: 'suno_comparison', isCompleted: true, completedAt: '2025-11-11', completedBy: 'Both' },
				{ stageId: 'suno_selection', isCompleted: true, completedAt: '2025-11-12', completedBy: 'Both' },
				{ stageId: 'mixing', isCompleted: true, completedAt: '2025-11-14', completedBy: 'El' },
				{ stageId: 'audio_editing', isCompleted: true, completedAt: '2025-11-16', completedBy: 'El' },
				{ stageId: 'mastering', isCompleted: true, completedAt: '2025-11-18', completedBy: 'El' },
				{ stageId: 'lyrics_final', isCompleted: true, completedAt: '2025-11-19', completedBy: 'Otte' },
				{ stageId: 'artwork', isCompleted: true, completedAt: '2025-11-21', completedBy: 'El' },
				{ stageId: 'track_info', isCompleted: true, completedAt: '2025-11-22', completedBy: 'Both' },
				{ stageId: 'album_ready', isCompleted: false }
			] as ProductionStageStatus[],
			progressPercent: 78,
			createdBy: 'Otte',
			lyricsVersions: [],
			promptConfigs: [],
			audioVersions: [],
			usedWordIds: [],
			createdAt: '2025-11-01',
			updatedAt: '2025-11-22'
		},
		{
			id: 'proj13',
			title: '레몬 드롭',
			description: '상큼한 여름 팝',
			status: 'in_progress',
			stages: [
				{ stageId: 'idea', isCompleted: true, completedAt: '2025-10-15', completedBy: 'El' },
				{ stageId: 'lyrics_draft', isCompleted: true, completedAt: '2025-10-17', completedBy: 'Otte' },
				{ stageId: 'lyrics_structure', isCompleted: true, completedAt: '2025-10-19', completedBy: 'Otte' },
				{ stageId: 'lyrics_suno', isCompleted: true, completedAt: '2025-10-21', completedBy: 'Otte' },
				{ stageId: 'prompt_writing', isCompleted: true, completedAt: '2025-10-22', completedBy: 'El' },
				{ stageId: 'suno_generation', isCompleted: true, completedAt: '2025-10-24', completedBy: 'El' },
				{ stageId: 'suno_comparison', isCompleted: true, completedAt: '2025-10-25', completedBy: 'Both' },
				{ stageId: 'suno_selection', isCompleted: true, completedAt: '2025-10-26', completedBy: 'Both' },
				{ stageId: 'mixing', isCompleted: true, completedAt: '2025-10-28', completedBy: 'El' },
				{ stageId: 'audio_editing', isCompleted: true, completedAt: '2025-10-30', completedBy: 'El' },
				{ stageId: 'mastering', isCompleted: true, completedAt: '2025-11-01', completedBy: 'El' },
				{ stageId: 'lyrics_final', isCompleted: true, completedAt: '2025-11-02', completedBy: 'Otte' },
				{ stageId: 'artwork', isCompleted: true, completedAt: '2025-11-04', completedBy: 'El' },
				{ stageId: 'track_info', isCompleted: true, completedAt: '2025-11-05', completedBy: 'Both' },
				{ stageId: 'album_ready', isCompleted: true, completedAt: '2025-11-06', completedBy: 'Both' },
				{ stageId: 'distribution', isCompleted: false }
			] as ProductionStageStatus[],
			progressPercent: 83,
			createdBy: 'El',
			lyricsVersions: [],
			promptConfigs: [],
			audioVersions: [],
			usedWordIds: [],
			createdAt: '2025-10-15',
			updatedAt: '2025-11-06'
		},
		{
			id: 'proj14',
			title: '버블 파티',
			description: '파티 EDM',
			status: 'in_progress',
			stages: [
				{ stageId: 'idea', isCompleted: true, completedAt: '2025-10-01', completedBy: 'Otte' },
				{ stageId: 'lyrics_draft', isCompleted: true, completedAt: '2025-10-03', completedBy: 'Otte' },
				{ stageId: 'lyrics_structure', isCompleted: true, completedAt: '2025-10-05', completedBy: 'Otte' },
				{ stageId: 'lyrics_suno', isCompleted: true, completedAt: '2025-10-07', completedBy: 'Otte' },
				{ stageId: 'prompt_writing', isCompleted: true, completedAt: '2025-10-08', completedBy: 'El' },
				{ stageId: 'suno_generation', isCompleted: true, completedAt: '2025-10-10', completedBy: 'El' },
				{ stageId: 'suno_comparison', isCompleted: true, completedAt: '2025-10-11', completedBy: 'Both' },
				{ stageId: 'suno_selection', isCompleted: true, completedAt: '2025-10-12', completedBy: 'Both' },
				{ stageId: 'mixing', isCompleted: true, completedAt: '2025-10-14', completedBy: 'El' },
				{ stageId: 'audio_editing', isCompleted: true, completedAt: '2025-10-16', completedBy: 'El' },
				{ stageId: 'mastering', isCompleted: true, completedAt: '2025-10-18', completedBy: 'El' },
				{ stageId: 'lyrics_final', isCompleted: true, completedAt: '2025-10-19', completedBy: 'Otte' },
				{ stageId: 'artwork', isCompleted: true, completedAt: '2025-10-21', completedBy: 'El' },
				{ stageId: 'track_info', isCompleted: true, completedAt: '2025-10-22', completedBy: 'Both' },
				{ stageId: 'album_ready', isCompleted: true, completedAt: '2025-10-23', completedBy: 'Both' },
				{ stageId: 'distribution', isCompleted: true, completedAt: '2025-10-25', completedBy: 'Both' },
				{ stageId: 'promotion', isCompleted: false }
			] as ProductionStageStatus[],
			progressPercent: 89,
			createdBy: 'Otte',
			lyricsVersions: [],
			promptConfigs: [],
			audioVersions: [],
			usedWordIds: [],
			createdAt: '2025-10-01',
			updatedAt: '2025-10-25'
		},
		{
			id: 'proj15',
			title: '드림 캐처',
			description: '몽환적 신스팝',
			status: 'completed',
			stages: PRODUCTION_STAGES.map(stage => ({
				stageId: stage.id,
				isCompleted: true,
				completedAt: '2025-09-30',
				completedBy: stage.assignedTo === 'El' ? 'El' : 'Otte'
			})) as ProductionStageStatus[],
			progressPercent: 100,
			createdBy: 'El',
			lyricsVersions: [],
			promptConfigs: [],
			audioVersions: [],
			usedWordIds: [],
			linkedTrackId: 'track2',
			createdAt: '2025-09-01',
			updatedAt: '2025-09-30'
		},
		{
			id: 'proj16',
			title: '오렌지 선셋',
			description: '노을빛 어쿠스틱',
			status: 'in_progress',
			stages: [
				{ stageId: 'idea', isCompleted: true, completedAt: '2026-01-14', completedBy: 'Otte' },
				{ stageId: 'lyrics_draft', isCompleted: false }
			] as ProductionStageStatus[],
			progressPercent: 6,
			createdBy: 'Otte',
			lyricsVersions: [],
			promptConfigs: [],
			audioVersions: [],
			usedWordIds: [],
			createdAt: '2026-01-14',
			updatedAt: '2026-01-14'
		},
		{
			id: 'proj17',
			title: '바닐라 스카이',
			description: '부드러운 R&B 발라드',
			status: 'in_progress',
			stages: [
				{ stageId: 'idea', isCompleted: true, completedAt: '2026-01-12', completedBy: 'El' },
				{ stageId: 'lyrics_draft', isCompleted: true, completedAt: '2026-01-13', completedBy: 'Otte' },
				{ stageId: 'lyrics_structure', isCompleted: true, completedAt: '2026-01-14', completedBy: 'Otte' },
				{ stageId: 'lyrics_suno', isCompleted: false }
			] as ProductionStageStatus[],
			progressPercent: 17,
			createdBy: 'El',
			lyricsVersions: [],
			promptConfigs: [],
			audioVersions: [],
			usedWordIds: [],
			createdAt: '2026-01-12',
			updatedAt: '2026-01-14'
		},
		{
			id: 'proj18',
			title: '핑크 다이아몬드',
			description: '화려한 댄스팝',
			status: 'in_progress',
			stages: [
				{ stageId: 'idea', isCompleted: true, completedAt: '2026-01-08', completedBy: 'Otte' },
				{ stageId: 'lyrics_draft', isCompleted: true, completedAt: '2026-01-09', completedBy: 'Otte' },
				{ stageId: 'lyrics_structure', isCompleted: true, completedAt: '2026-01-10', completedBy: 'Otte' },
				{ stageId: 'lyrics_suno', isCompleted: true, completedAt: '2026-01-11', completedBy: 'Otte' },
				{ stageId: 'prompt_writing', isCompleted: true, completedAt: '2026-01-12', completedBy: 'El' },
				{ stageId: 'suno_generation', isCompleted: false }
			] as ProductionStageStatus[],
			progressPercent: 28,
			createdBy: 'Otte',
			lyricsVersions: [],
			promptConfigs: [],
			audioVersions: [],
			usedWordIds: [],
			createdAt: '2026-01-08',
			updatedAt: '2026-01-12'
		},
		{
			id: 'proj19',
			title: '골든 아워',
			description: '황금빛 팝 록',
			status: 'in_progress',
			stages: [
				{ stageId: 'idea', isCompleted: true, completedAt: '2025-12-25', completedBy: 'El' },
				{ stageId: 'lyrics_draft', isCompleted: true, completedAt: '2025-12-26', completedBy: 'Otte' },
				{ stageId: 'lyrics_structure', isCompleted: true, completedAt: '2025-12-27', completedBy: 'Otte' },
				{ stageId: 'lyrics_suno', isCompleted: true, completedAt: '2025-12-28', completedBy: 'Otte' },
				{ stageId: 'prompt_writing', isCompleted: true, completedAt: '2025-12-29', completedBy: 'El' },
				{ stageId: 'suno_generation', isCompleted: true, completedAt: '2025-12-30', completedBy: 'El' },
				{ stageId: 'suno_comparison', isCompleted: true, completedAt: '2025-12-31', completedBy: 'Both' },
				{ stageId: 'suno_selection', isCompleted: true, completedAt: '2026-01-01', completedBy: 'Both' },
				{ stageId: 'mixing', isCompleted: true, completedAt: '2026-01-03', completedBy: 'El' },
				{ stageId: 'audio_editing', isCompleted: false }
			] as ProductionStageStatus[],
			progressPercent: 50,
			createdBy: 'El',
			lyricsVersions: [],
			promptConfigs: [],
			audioVersions: [],
			usedWordIds: [],
			createdAt: '2025-12-25',
			updatedAt: '2026-01-03'
		}
	]);

	// 현재 단계 색상 (텍스트만, 다크/라이트 모드 대응)
	function getStageColor(stageId: ProductionStageId): string {
		const stageIndex = PRODUCTION_STAGES.findIndex(s => s.id === stageId);
		// 초반 단계 (1-6): 노란색
		if (stageIndex < 6) return 'text-yellow-500 dark:text-yellow-400';
		// 중반 단계 (7-12): 핑크
		if (stageIndex < 12) return 'text-brand-pink';
		// 후반 단계 (13-17): 파란색
		if (stageIndex < 17) return 'text-blue-500 dark:text-blue-400';
		// 완료 (18): 녹색
		return 'text-green-600 dark:text-green-400';
	}

	// 필터링 및 정렬
	const filteredProjects = $derived.by(() => {
		let result = projects.filter(project => {
			// 검색어 필터
			if (searchQuery) {
				const query = searchQuery.toLowerCase();
				if (!project.title.toLowerCase().includes(query) && 
					!project.description?.toLowerCase().includes(query)) {
					return false;
				}
			}
			// 단계 필터
			if (stageFilter !== 'all') {
				const currentStage = getCurrentStage(project);
				if (currentStage !== stageFilter) {
					return false;
				}
			}
			// 담당자 필터 (프로젝트 생성자 기준)
			if (assigneeFilter !== 'all') {
				if (project.createdBy !== assigneeFilter) {
					return false;
				}
			}
			return true;
		});

		// 정렬
		result.sort((a, b) => {
			switch (sortBy) {
				case 'updated_desc':
					return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
				case 'updated_asc':
					return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
				case 'created_desc':
					return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
				case 'created_asc':
					return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
				case 'title_asc':
					return a.title.localeCompare(b.title);
				case 'title_desc':
					return b.title.localeCompare(a.title);
				case 'progress_desc':
					return b.progressPercent - a.progressPercent;
				case 'progress_asc':
					return a.progressPercent - b.progressPercent;
				default:
					return 0;
			}
		});

		return result;
	});

	// 단계별 카운트
	const stageCounts = $derived.by(() => {
		const counts: Record<string, number> = { all: projects.length };
		projects.forEach(p => {
			const currentStage = getCurrentStage(p);
			if (currentStage) {
				counts[currentStage] = (counts[currentStage] || 0) + 1;
			}
		});
		return counts;
	});

	// 외부 클릭 처리
	function handleClickOutside(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (!target.closest('.stage-dropdown')) {
			stageDropdownOpen = false;
		}
		if (!target.closest('.assignee-dropdown')) {
			assigneeDropdownOpen = false;
		}
		if (!target.closest('.sort-dropdown')) {
			sortDropdownOpen = false;
		}
	}

	$effect(() => {
		if (stageDropdownOpen || assigneeDropdownOpen || sortDropdownOpen) {
			document.addEventListener('click', handleClickOutside);
		}
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<svelte:head>
	<title>진행 중인 곡 | SUNO 제작</title>
</svelte:head>

<!-- 템플릿 모달 -->
{#if showTemplates}
	<div
		class="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
		onclick={() => showTemplates = false}
		onkeydown={(e) => { if (e.key === 'Escape') showTemplates = false; }}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="max-w-3xl w-full" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()}>
			<ProjectTemplates
				onSelect={(template) => { 
					showTemplates = false;
					const params = new URLSearchParams();
					if (template.name && template.id !== 'blank') params.set('template', template.name);
					if (template.defaultStyles) params.set('styles', template.defaultStyles);
					if (template.defaultExclude) params.set('exclude', template.defaultExclude);
					if (template.defaultVocalGender) params.set('vocal', template.defaultVocalGender);
					goto(`/suno/projects/new${params.toString() ? '?' + params.toString() : ''}`);
				}}
				onClose={() => showTemplates = false}
			/>
		</div>
	</div>
{/if}

<div class="pt-0 pb-6 sm:pb-6 pb-20 bg-bg text-text-base">
	<!-- 헤더 -->
	<div class="mb-8 mt-1.5">
		<div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
			<div>
				<h1 class="text-3xl font-bold text-text-strong mb-2">SUNO 제작</h1>
				<p class="text-text-muted">SUNO AI로 제작 중인 곡들을 관리합니다</p>
			</div>
			<button
				type="button"
				onclick={() => showTemplates = true}
				class="flex items-center gap-2 px-4 py-2 bg-brand-pink text-white rounded-lg font-medium hover:bg-brand-pink/90 transition-colors flex-shrink-0"
			>
				<Plus size={16} />
				새 프로젝트
			</button>
		</div>
	</div>

	<!-- 탭 + 콘텐츠 -->
	<SUNOTabs>
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
					placeholder="곡 제목 또는 설명 검색..."
					class="w-full pl-10 {searchQuery.trim() ? 'pr-10' : 'pr-4'} py-1.5 bg-surface-2 border border-border-subtle border-[1px] rounded-md text-text-base placeholder-text-muted focus:outline-none focus:border-brand-pink focus:ring-0 transition-colors duration-200"
					aria-label="곡 제목 또는 설명 검색"
					id="suno-project-search"
					autocomplete="off"
				/>
				{#if searchQuery.trim()}
					<button
						type="button"
						onclick={() => {
							searchQuery = '';
							const input = document.getElementById('suno-project-search') as HTMLInputElement;
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
				<!-- 단계 필터 -->
				<div class="relative stage-dropdown">
				<button
					type="button"
					onclick={() => stageDropdownOpen = !stageDropdownOpen}
					aria-haspopup="listbox"
					aria-expanded={stageDropdownOpen}
					class="status-filter-btn flex items-center pl-10 pr-8 py-1.5 w-full bg-surface-2 rounded-[6px] text-text-base transition-all duration-200 cursor-pointer border border-border-subtle focus:outline-none focus:border-brand-pink"
				>
					<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<Filter size={16} class="lucide-icon text-text-muted transition-colors duration-200" />
					</div>
					<span class="flex-1 text-left truncate">
						{stageLabels[stageFilter]} ({stageCounts[stageFilter] || 0})
					</span>
					<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
						<ChevronDown size={12} class="text-text-base transition-colors duration-200" />
					</div>
				</button>
				{#if stageDropdownOpen}
					<ul class="absolute left-0 w-full mt-[6px] bg-surface-2 border border-border-subtle rounded-[6px] z-10 max-h-80 overflow-y-auto custom-list-scrollbar">
						<li
							role="option"
							aria-selected={stageFilter === 'all'}
							tabindex="0"
							onclick={() => { stageFilter = 'all'; stageDropdownOpen = false; }}
							onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { stageFilter = 'all'; stageDropdownOpen = false; } }}
							class="dropdown-item px-4 py-2 text-sm cursor-pointer transition-colors {stageFilter === 'all' ? 'bg-brand-pink text-white' : 'text-text-base'}"
						>
							전체 ({stageCounts['all'] || 0})
						</li>
						{#each PRODUCTION_STAGES as stage}
							<li
								role="option"
								aria-selected={stageFilter === stage.id}
								tabindex="0"
								onclick={() => { stageFilter = stage.id; stageDropdownOpen = false; }}
								onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { stageFilter = stage.id; stageDropdownOpen = false; } }}
								class="dropdown-item px-4 py-2 text-sm cursor-pointer transition-colors {stageFilter === stage.id ? 'bg-brand-pink text-white' : 'text-text-base'}"
							>
								{stage.name} ({stageCounts[stage.id] || 0})
							</li>
						{/each}
					</ul>
				{/if}
			</div>

			<!-- 담당자 필터 -->
				<div class="relative assignee-dropdown">
				<button
					type="button"
					onclick={() => assigneeDropdownOpen = !assigneeDropdownOpen}
					aria-haspopup="listbox"
					aria-expanded={assigneeDropdownOpen}
					class="status-filter-btn flex items-center pl-10 pr-8 py-1.5 w-full bg-surface-2 rounded-[6px] text-text-base transition-all duration-200 cursor-pointer border border-border-subtle focus:outline-none focus:border-brand-pink"
				>
					<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<UserRound size={16} class="lucide-icon text-text-muted transition-colors duration-200" />
					</div>
					<span class="flex-1 text-left truncate">
						{assigneeLabels[assigneeFilter]}
					</span>
					<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
						<ChevronDown size={12} class="text-text-base transition-colors duration-200" />
					</div>
				</button>
				{#if assigneeDropdownOpen}
					<ul
						role="listbox"
						class="absolute z-10 mt-1 w-full bg-surface-2 border border-border-subtle rounded-md shadow-lg max-h-60 overflow-auto"
					>
						{#each Object.entries(assigneeLabels) as [value, label]}
							<li
								role="option"
								aria-selected={assigneeFilter === value}
								tabindex="0"
								onclick={() => { assigneeFilter = value as AssigneeFilter; assigneeDropdownOpen = false; }}
								onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { assigneeFilter = value as AssigneeFilter; assigneeDropdownOpen = false; } }}
								class="dropdown-item px-4 py-2 cursor-pointer transition-colors {assigneeFilter === value ? 'bg-brand-pink text-white' : 'text-text-base hover:bg-hover-point hover:text-text-on-hover'}"
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

		<!-- 프로젝트 그리드 -->
		<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
			{#each filteredProjects as project}
				{@const currentStage = getCurrentStage(project)}
				<a 
					href="/suno/projects/{project.id}"
					class="project-card block bg-surface-2 rounded-lg border border-border-subtle p-5 transition-colors group"
				>
					<!-- 헤더 -->
					<div class="flex items-start justify-between gap-3 mb-3">
						<div class="flex-1 min-w-0">
							<h3 class="text-base font-semibold text-text-strong truncate group-hover:text-brand-pink transition-colors">
								{project.title}
							</h3>
							<p class="text-sm text-text-muted mt-0.5 truncate">{project.description}</p>
						</div>
						<span class="flex-shrink-0 px-2 py-1 rounded-md text-xs font-medium {currentStage ? getStageColor(currentStage) : 'text-text-muted'}">
							{currentStage ? stageLabels[currentStage] : '미정'}
						</span>
					</div>

					<!-- 진행률 -->
					<div class="mb-4">
						<ProductionProgress stages={project.stages} compact />
					</div>

					<!-- 푸터 -->
					<div class="flex items-center justify-between text-xs text-text-muted">
						<div class="flex items-center gap-2">
							<span class="font-medium {project.createdBy === 'El' ? 'text-elotte-green' : 'text-elotte-orange'}">
								{project.createdBy}
							</span>
							<span>·</span>
							<span>{getRelativeTime(project.updatedAt)}</span>
						</div>
						<span class="more-link text-brand-pink text-xs font-semibold px-2 py-1 rounded transition-colors">더보기</span>
					</div>
				</a>
			{/each}

			{#if filteredProjects.length === 0}
				<div class="col-span-full py-16 text-center">
					{#if searchQuery || stageFilter !== 'all' || assigneeFilter !== 'all'}
						<!-- 필터/검색 결과 없음 -->
						<div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-2 mb-4">
							<SearchX size={28} class="text-text-muted" />
						</div>
						<p class="text-text-base font-medium mb-2">검색 결과가 없습니다</p>
						<p class="text-text-muted text-sm mb-4">다른 검색어나 필터를 시도해보세요</p>
						<button
							type="button"
							onclick={() => { searchQuery = ''; stageFilter = 'all'; assigneeFilter = 'all'; }}
							class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-pink border border-brand-pink rounded-lg hover:bg-brand-pink hover:text-white transition-colors"
						>
							<X size={14} />
							필터 초기화
						</button>
					{:else}
						<!-- 프로젝트 없음 -->
						<div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-2 mb-4">
							<Music size={28} class="text-text-muted" />
						</div>
						<p class="text-text-base font-medium mb-2">아직 프로젝트가 없습니다</p>
						<p class="text-text-muted text-sm mb-4">새 프로젝트를 시작해서 음악을 만들어보세요</p>
						<button
							type="button"
							onclick={() => showTemplates = true}
							class="inline-flex items-center gap-2 px-4 py-2 bg-brand-pink text-white text-sm font-medium rounded-lg hover:bg-brand-pink/90 transition-colors"
						>
							<Plus size={16} />
							새 프로젝트 만들기
						</button>
					{/if}
				</div>
			{/if}
		</div>

		<!-- 통계 -->
		<div class="mt-6">
			<div class="flex flex-wrap items-center gap-4 text-sm">
				<span class="text-text-muted">
					총 <span class="font-medium text-text-base">{projects.length}</span>개 프로젝트
				</span>
				<span class="text-border-subtle">|</span>
				<span class="text-text-muted">
					표시 중 <span class="font-medium text-text-base">{filteredProjects.length}</span>개
				</span>
				<span class="text-border-subtle">|</span>
				<span class="text-text-muted">
					진행 중 <span class="font-medium text-brand-pink">{projects.filter(p => p.status === 'in_progress').length}</span>개
				</span>
				<span class="text-border-subtle">|</span>
				<span class="text-text-muted">
					완료 <span class="font-medium text-green-500 dark:text-green-400">{projects.filter(p => p.status === 'completed').length}</span>개
				</span>
			</div>
		</div>
	</SUNOTabs>
</div>
