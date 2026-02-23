<script lang="ts">
	import { page } from '$app/stores';
	import { ArrowLeft, FileText, Palette, Music2, BarChart3, History, Play, Pause, Plus, Edit2, Copy, Upload, ThumbsUp, ThumbsDown, Lightbulb, ExternalLink } from 'lucide-svelte';
	import ProductionProgress from '$lib/components/suno/ProductionProgress.svelte';
	import SUNOTabs from '$lib/components/suno/SUNOTabs.svelte';
	import { calculateProgressPercent } from '$lib/constants/suno/stages';
	import type { SUNOProject, SUNOPromptConfig, ProductionStageStatus, LyricsVersionType, AudioVersion, Comment } from '$lib/types/suno';
	import { toast } from '$lib/stores/toast';
	import { FILE_UPLOAD_BUTTON_LABEL, MAX_FILE_SIZE_BYTES, getFileSizeErrorMessage } from '$lib/constants/upload';
	import { mockProjects } from '$lib/mocks/suno';

	const projectId = $derived($page.params.id ?? '');

	function getMockProject(pid: string): SUNOProject {
		const fromList = mockProjects.find(p => p.id === pid);
		const defaultStages: ProductionStageStatus[] = [
			{ stageId: 'idea', isCompleted: true, completedAt: '2026-01-05', completedBy: 'Otte' },
			{ stageId: 'lyrics_draft', isCompleted: true, completedAt: '2026-01-07', completedBy: 'Otte' },
			{ stageId: 'lyrics_structure', isCompleted: true, completedAt: '2026-01-08', completedBy: 'Otte' },
			{ stageId: 'lyrics_suno', isCompleted: true, completedAt: '2026-01-09', completedBy: 'Otte' },
			{ stageId: 'prompt_writing', isCompleted: true, completedAt: '2026-01-09', completedBy: 'El' },
			{ stageId: 'suno_generation', isCompleted: true, completedAt: '2026-01-10', completedBy: 'El' },
			{ stageId: 'suno_comparison', isCompleted: false },
			{ stageId: 'suno_selection', isCompleted: false },
			{ stageId: 'mixing', isCompleted: false },
			{ stageId: 'audio_editing', isCompleted: false },
			{ stageId: 'mastering', isCompleted: false },
			{ stageId: 'lyrics_final', isCompleted: false },
			{ stageId: 'artwork', isCompleted: false },
			{ stageId: 'track_info', isCompleted: false },
			{ stageId: 'album_ready', isCompleted: false },
			{ stageId: 'distribution', isCompleted: false },
			{ stageId: 'promotion', isCompleted: false },
			{ stageId: 'released', isCompleted: false }
		];
		return {
			id: pid,
			title: fromList?.title ?? '달콤한 밤의 노래',
			description: fromList?.description ?? '여름밤 감성 발라드',
			status: fromList?.status ?? 'in_progress',
			stages: (fromList?.stages?.length ? fromList.stages : defaultStages) as ProductionStageStatus[],
			progressPercent: fromList?.progressPercent ?? 33,
			createdBy: fromList?.createdBy ?? 'Otte',
			lyricsVersions: [
				{
					id: 'lyrics1',
					projectId: pid,
					versionType: 'draft',
					content: '달콤한 밤이 찾아오면\n너의 생각에 잠겨\n별빛 아래 걸어가는\n우리 둘만의 시간\n\n[Chorus]\n이 밤이 끝나지 않기를\n너와 함께라면 영원히',
					versionNumber: 1,
					createdAt: '2026-01-07',
					createdBy: 'Otte',
					changeNotes: '초안 작성'
				},
				{
					id: 'lyrics2',
					projectId: pid,
					versionType: 'structure',
					content: '[Intro]\n달콤한 밤이 찾아오면\n\n[Verse 1]\n너의 생각에 잠겨\n별빛 아래 걸어가는\n우리 둘만의 시간\n\n[Chorus]\n이 밤이 끝나지 않기를\n너와 함께라면 영원히\n\n[Verse 2]\n...\n\n[Bridge]\n...\n\n[Outro]\n...',
					versionNumber: 2,
					createdAt: '2026-01-08',
					createdBy: 'Otte',
					changeNotes: '곡 구조 추가',
					parentVersionId: 'lyrics1'
				},
				{
					id: 'lyrics3',
					projectId: pid,
					versionType: 'suno_phonetic',
					content: '[Intro]\nDal-kom-han bam-i cha-ja-o-myeon\n\n[Verse 1]\nNeo-eui saeng-gak-e jam-gyeo\nByeol-bit a-rae geo-reo-ga-neun\nU-ri dul-man-eui si-gan\n\n[Chorus]\nI bam-i kkeut-na-ji an-ki-reul\nNeo-wa ham-kke-ra-myeon yeong-won-hi',
					versionNumber: 3,
					createdAt: '2026-01-09',
					createdBy: 'Otte',
					changeNotes: 'SUNO 발음 최적화',
					parentVersionId: 'lyrics2'
				},
				{
					id: 'lyrics4',
					projectId: pid,
					versionType: 'album_final',
					content: '달콤한 밤이 찾아오면\n\n너의 생각에 잠겨\n별빛 아래 걸어가는\n우리 둘만의 시간\n\n이 밤이 끝나지 않기를\n너와 함께라면 영원히',
					versionNumber: 4,
					createdAt: '2026-01-11',
					createdBy: 'Otte',
					changeNotes: '앨범등록용 가사 (클린업 완료)',
					parentVersionId: 'lyrics1'
				}
			],
			promptConfigs: [
				{
					id: 'prompt1',
					projectId: pid,
					mode: 'Custom',
					sunoVersion: 'v4',
					generationType: 'create',
					styles: 'dreamy synth-pop, ethereal vocals, soft ballad, korean, emotional, midnight vibes, polished but emotive',
					excludeStyles: 'heavy metal, screaming, aggressive, harsh, noisy',
					vocalGender: 'Female',
					lyricsMode: 'Manual',
					weirdness: 30,
					styleInfluence: 70,
					audioInfluence: 0,
					createdAt: '2026-01-10',
					createdBy: 'El'
				}
			],
			audioVersions: [
				{
					id: 'audio1',
					projectId: pid,
					versionType: 'suno_original',
					fileName: 'sweet_night_v1.mp3',
					fileUrl: '/audio/sweet_night_v1.mp3',
					duration: '3:24',
					sunoWorkspaceUrl: 'https://suno.com/workspace/xxx',
					sunoPromptConfigId: 'prompt1',
					isFinalSelection: false,
					comments: [
						{ id: 'c1', content: '보컬 톤이 좋아요', author: 'Otte', timestamp: '2026-01-10T14:30:00' }
					],
					votes: [
						{ voter: 'El', value: 'up', timestamp: '2026-01-10T15:00:00' }
					],
					createdAt: '2026-01-10',
					createdBy: 'El'
				},
				{
					id: 'audio2',
					projectId: pid,
					versionType: 'suno_original',
					fileName: 'sweet_night_v2.mp3',
					fileUrl: '/audio/sweet_night_v2.mp3',
					duration: '3:18',
					sunoWorkspaceUrl: 'https://suno.com/workspace/yyy',
					sunoPromptConfigId: 'prompt1',
					isFinalSelection: true,
					comments: [
						{ id: 'c2', content: '이 버전이 더 자연스러워요', author: 'Otte', timestamp: '2026-01-10T16:45:00' },
						{ id: 'c3', content: '동의, 최종으로 결정', author: 'El', timestamp: '2026-01-10T17:00:00' }
					],
					votes: [
						{ voter: 'El', value: 'up', timestamp: '2026-01-10T16:00:00' },
						{ voter: 'Otte', value: 'up', timestamp: '2026-01-10T16:30:00' }
					],
					createdAt: '2026-01-10',
					createdBy: 'El'
				}
			],
			usedWordIds: fromList?.usedWordIds ?? ['word1', 'word2'],
			createdAt: fromList?.createdAt ?? '2026-01-05',
			updatedAt: fromList?.updatedAt ?? '2026-01-10'
		};
	}

	// 탭 상태
	let activeTab = $state<'lyrics' | 'prompt' | 'audio' | 'progress' | 'history'>('lyrics');

	// 목업 프로젝트 데이터 (projectId 변경 시 $effect에서 동기화)
	let project = $state<SUNOProject>(getMockProject(''));
	// 선택된 가사 버전 (project 동기화 시 $effect에서 마지막 버전 id로 설정)
	let selectedLyricsId = $state<string>('');

	$effect(() => {
		const next = getMockProject(projectId);
		project = next;
		selectedLyricsId = next.lyricsVersions[next.lyricsVersions.length - 1]?.id ?? '';
	});

	// 가사 버전 유형 라벨
	const lyricsTypeLabels: Record<LyricsVersionType, string> = {
		draft: '초안',
		revision: '수정안',
		structure: '곡구조',
		suno_phonetic: '수노발음',
		album_final: '앨범등록'
	};
	const selectedLyrics = $derived(project.lyricsVersions.find(l => l.id === selectedLyricsId));

	const computedProgress = $derived(
		calculateProgressPercent(project.stages.filter(s => s.isCompleted).map(s => s.stageId))
	);

	// 탭 정의
	const tabs = [
		{ id: 'lyrics', label: '가사', icon: FileText },
		{ id: 'prompt', label: '프롬프트', icon: Palette },
		{ id: 'audio', label: '음원', icon: Music2 },
		{ id: 'progress', label: '진행률', icon: BarChart3 },
		{ id: 'history', label: '기록', icon: History }
	] as const;

	// 가사 편집 모드
	let isEditingLyrics = $state(false);
	let editingLyricsContent = $state('');

	function startEditLyrics() {
		if (selectedLyrics) {
			editingLyricsContent = selectedLyrics.content;
			isEditingLyrics = true;
		}
	}

	function saveEditLyrics() {
		if (selectedLyrics) {
			const idx = project.lyricsVersions.findIndex(l => l.id === selectedLyricsId);
			if (idx !== -1) {
				project.lyricsVersions[idx].content = editingLyricsContent;
			}
			isEditingLyrics = false;
		}
	}

	function cancelEditLyrics() {
		isEditingLyrics = false;
	}

	// 프롬프트 설정 편집
	let editingPromptConfigId = $state<string | null>(null);
	let editingStyles = $state('');
	let editingExcludeStyles = $state('');
	let editingWeirdness = $state(0);
	let editingStyleInfluence = $state(0);
	let editingAudioInfluence = $state(0);

	function startEditPromptConfig(config: SUNOPromptConfig) {
		editingPromptConfigId = config.id;
		editingStyles = config.styles;
		editingExcludeStyles = config.excludeStyles;
		editingWeirdness = config.weirdness;
		editingStyleInfluence = config.styleInfluence;
		editingAudioInfluence = config.audioInfluence;
	}

	function saveEditPromptConfig() {
		if (!editingPromptConfigId) return;
		const idx = project.promptConfigs.findIndex(c => c.id === editingPromptConfigId);
		if (idx !== -1) {
			project.promptConfigs = project.promptConfigs.map((c, i) =>
				i !== idx
					? c
					: {
							...c,
							styles: editingStyles,
							excludeStyles: editingExcludeStyles,
							weirdness: editingWeirdness,
							styleInfluence: editingStyleInfluence,
							audioInfluence: editingAudioInfluence
						}
			);
			toast.add('프롬프트 설정이 저장되었습니다.', 'success');
		}
		editingPromptConfigId = null;
	}

	function cancelEditPromptConfig() {
		editingPromptConfigId = null;
	}

	// 새 가사 버전 추가
	let isAddingVersion = $state(false);
	let newVersionType = $state<LyricsVersionType>('draft');
	let newVersionContent = $state('');
	let newVersionNotes = $state('');

	function startAddVersion() {
		newVersionType = 'draft';
		newVersionContent = selectedLyrics?.content ?? '';
		newVersionNotes = '';
		isAddingVersion = true;
	}

	function saveNewVersion() {
		const nextNum = project.lyricsVersions.length + 1;
		const newId = `lyrics${Date.now()}`;
		project.lyricsVersions = [...project.lyricsVersions, {
			id: newId,
			projectId: project.id,
			versionType: newVersionType,
			content: newVersionType === 'album_final' ? cleanLyricsForAlbum(newVersionContent) : newVersionContent,
			versionNumber: nextNum,
			createdAt: new Date().toISOString().split('T')[0],
			createdBy: 'Otte',
			changeNotes: newVersionNotes || lyricsTypeLabels[newVersionType],
			parentVersionId: selectedLyricsId || undefined
		}];
		selectedLyricsId = newId;
		isAddingVersion = false;
	}

	function cancelAddVersion() {
		isAddingVersion = false;
	}

	// 앨범등록용 가사 클린업: 구조 태그·불필요한 공백 제거
	function cleanLyricsForAlbum(text: string): string {
		return text
			.replace(/\[.*?\]\n?/g, '')
			.replace(/[ \t]+$/gm, '')
			.replace(/\n{3,}/g, '\n\n')
			.trim();
	}

	// 현재 재생 중인 오디오
	let playingAudioId = $state<string | null>(null);

	function togglePlayAudio(audioId: string) {
		if (playingAudioId === audioId) {
			playingAudioId = null;
		} else {
			playingAudioId = audioId;
		}
	}

	// 단계 완료 토글
	function toggleStageComplete(stageId: string) {
		const stageIndex = project.stages.findIndex(s => s.stageId === stageId);
		if (stageIndex !== -1) {
			project.stages[stageIndex].isCompleted = !project.stages[stageIndex].isCompleted;
			if (project.stages[stageIndex].isCompleted) {
				project.stages[stageIndex].completedAt = new Date().toISOString().split('T')[0];
				project.stages[stageIndex].completedBy = 'El';
			} else {
				project.stages[stageIndex].completedAt = undefined;
				project.stages[stageIndex].completedBy = undefined;
			}
		}
	}

	// 업로드로 추가된 음원 (목업과 동일 형태)
	let extraAudioVersions = $state<AudioVersion[]>([]);
	const displayAudioList = $derived([...project.audioVersions, ...extraAudioVersions]);

	// 최종 음원 선택
	function selectFinalAudio(audioId: string) {
		project.audioVersions.forEach(a => {
			a.isFinalSelection = a.id === audioId;
		});
		extraAudioVersions = extraAudioVersions.map(a => ({ ...a, isFinalSelection: a.id === audioId }));
	}

	// 새 음원 업로드 (기존 /api/upload/audio와 동일 방식)
	let isUploadingAudio = $state(false);
	async function handleAudioUpload(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		if (!file.type.startsWith('audio/')) {
			toast.add('오디오 파일만 업로드할 수 있습니다.', 'error', 3000);
			input.value = '';
			return;
		}
		if (file.size > MAX_FILE_SIZE_BYTES) {
			toast.add(getFileSizeErrorMessage(), 'error', 4000);
			input.value = '';
			return;
		}
		isUploadingAudio = true;
		try {
			const formData = new FormData();
			formData.append('audioFile', file);
			const res = await fetch('/api/upload/audio', { method: 'POST', body: formData });
			const result = (await res.json()) as { ok?: boolean; error?: { message?: string }; data?: { fileId: string; fileName: string; fileUrl: string } };
			if (!res.ok || !result?.ok) {
				toast.add(result?.error?.message ?? '업로드에 실패했습니다.', 'error', 4000);
				input.value = '';
				return;
			}
			const data = result.data;
			if (!data) {
				toast.add('업로드 응답이 올바르지 않습니다.', 'error', 4000);
				input.value = '';
				return;
			}
			const { fileId, fileName, fileUrl } = data;
			const newVersion: AudioVersion = {
				id: fileId,
				projectId,
				versionType: 'suno_original',
				fileName,
				fileUrl,
				duration: '0:00',
				isFinalSelection: false,
				comments: [],
				votes: [],
				createdAt: new Date().toISOString().slice(0, 10),
				createdBy: 'Otte'
			};
			extraAudioVersions = [...extraAudioVersions, newVersion];
			toast.add('음원이 업로드되었습니다.', 'success', 2500);
		} catch (err) {
			toast.add(err instanceof Error ? err.message : '업로드 중 오류가 발생했습니다.', 'error', 4000);
		} finally {
			isUploadingAudio = false;
			input.value = '';
		}
	}

	// 음원별 추가 피드백(댓글) — 목업/업로드 항목 모두 여기서 보여줌
	let extraCommentsByAudioId = $state<Record<string, Comment[]>>({});
	let commentDraftByAudioId = $state<Record<string, string>>({});

	function getDisplayComments(audio: AudioVersion): Comment[] {
		return [...(audio.comments || []), ...(extraCommentsByAudioId[audio.id] || [])];
	}

	function setCommentDraft(audioId: string, value: string) {
		commentDraftByAudioId = { ...commentDraftByAudioId, [audioId]: value };
	}

	function addComment(audioId: string) {
		const draft = (commentDraftByAudioId[audioId] ?? '').trim();
		if (!draft) return;
		const newComment: Comment = {
			id: `comment_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
			content: draft,
			author: 'Otte',
			timestamp: new Date().toISOString()
		};
		extraCommentsByAudioId = {
			...extraCommentsByAudioId,
			[audioId]: [...(extraCommentsByAudioId[audioId] || []), newComment]
		};
		setCommentDraft(audioId, '');
		toast.add('피드백이 등록되었습니다.', 'success', 2000);
	}

	// 클립보드 복사 + 토스트 알림
	async function copyPrompt(text: string) {
		await navigator.clipboard.writeText(text);
		toast.add('클립보드에 복사되었습니다', 'success', 2000);
	}

	// 커스텀 확인 모달
	let showConfirmModal = $state(false);
	let confirmMessage = $state('');
	let confirmCallback: (() => void) | null = null;

	function askConfirm(message: string, onConfirm: () => void) {
		confirmMessage = message;
		confirmCallback = onConfirm;
		showConfirmModal = true;
	}

	function handleConfirmYes() {
		showConfirmModal = false;
		if (confirmCallback) confirmCallback();
		confirmCallback = null;
	}

	function handleConfirmNo() {
		showConfirmModal = false;
		confirmCallback = null;
	}

	// 편집 중 링크 클릭 가로채기
	$effect(() => {
		const editing = isEditingLyrics;
		const adding = isAddingVersion;

		function handleClick(e: MouseEvent) {
			if (!editing && !adding) return;
			const anchor = (e.target as HTMLElement).closest('a[href]');
			if (!anchor) return;
			const href = anchor.getAttribute('href') ?? '';
			if (!href || href.startsWith('#')) return;
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();
			askConfirm('작성 중인 내용이 저장되지 않습니다.\n이 페이지를 떠나시겠습니까?', () => {
				isEditingLyrics = false;
				isAddingVersion = false;
				window.location.href = href;
			});
		}

		function handleBeforeUnload(e: BeforeUnloadEvent) {
			if (!editing && !adding) return;
			e.preventDefault();
		}

		document.addEventListener('click', handleClick, true);
		window.addEventListener('beforeunload', handleBeforeUnload);
		return () => {
			document.removeEventListener('click', handleClick, true);
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	});

	// 섹션 탭 전환: 편집 중이면 경고, 내용은 유지
	function switchTab(tabId: string) {
		if (tabId === activeTab) return;
		if (isEditingLyrics || isAddingVersion) {
			askConfirm('작성 중인 내용이 있습니다.\n탭을 전환해도 돌아오면 이어서 작업할 수 있습니다.\n전환하시겠습니까?', () => {
				activeTab = tabId as typeof activeTab;
			});
			return;
		}
		activeTab = tabId as typeof activeTab;
	}
</script>

<svelte:head>
	<title>{project.title} | SUNO 제작</title>
</svelte:head>


<div class="pt-0 pb-20 sm:pb-6 bg-bg text-text-base">
	<!-- 헤더: 새 프로젝트 페이지와 동일한 레이아웃 -->
	<div class="mb-8 mt-1.5">
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
			<div>
				<h1 class="text-3xl font-bold text-text-strong mb-2">{project.title}</h1>
				<p class="text-text-muted">
					{project.description}
					<span class="ml-2 px-2 py-0.5 rounded-md text-xs font-medium bg-brand-pink/20 text-brand-pink">
						{computedProgress}% 완료
					</span>
				</p>
				<p class="text-xs text-text-muted mt-1.5">
					<span class="{project.createdBy === 'El' ? 'text-elotte-green' : 'text-elotte-orange'}">{project.createdBy}</span>
					 · 생성 {project.createdAt} · 수정 {project.updatedAt}
				</p>
			</div>
			<a
				href="/suno/projects"
				class="btn-outline-hover min-h-11 px-4 py-2 text-sm font-medium text-text-base rounded-lg border border-border-subtle focus-visible:outline-none inline-flex items-center gap-2 flex-shrink-0"
			>
				<ArrowLeft size={14} />
				프로젝트 목록
			</a>
		</div>
	</div>

	<SUNOTabs>
		<!-- 프로젝트 내부 섹션: 세트 = 아이콘+텍스트+하단라인. 아웃라인버튼과 차이 = 하단라인만 있음(전체 테두리 없음). 풀폭 구분선 위에 활성만 핫핑크 라인 -->
		<div class="-mx-4 -mt-2">
			<nav class="flex flex-wrap items-center gap-x-4 sm:gap-x-8 px-4 pt-0 pb-0" aria-label="프로젝트 섹션">
				{#each tabs as tab}
					{@const Icon = tab.icon}
					{@const isActive = activeTab === tab.id}
					<div class="relative">
						<button
							type="button"
							onclick={() => switchTab(tab.id)}
							class="project-section-tab peer flex items-center gap-2 py-3 text-sm font-medium transition-colors outline-none
								{isActive
									? 'text-brand-pink'
									: 'text-text-muted'}"
							title={tab.label}
						>
							<Icon size={14} class="flex-shrink-0 pointer-events-none" />
							<span class="hidden sm:inline">{tab.label}</span>
						</button>
						<!-- 세트의 하단라인만 (아웃라인 버튼처럼 border 전체 아님) -->
						<span
							class="absolute bottom-0 -left-1.5 -right-1.5 sm:-left-4 sm:-right-4 h-0.5 -mb-px transition-colors pointer-events-none
								{isActive
									? 'bg-brand-pink'
									: 'bg-transparent peer-hover:bg-brand-pink/50 peer-focus-visible:bg-brand-pink/50'}"
							aria-hidden="true"
						></span>
					</div>
				{/each}
			</nav>
			<div class="border-b border-border-subtle" aria-hidden="true"></div>
		</div>

		<!-- 섹션 콘텐츠 -->
		<div class="pt-4">
		{#if activeTab === 'lyrics'}
			<!-- 가사 탭: 넓은 화면에서 왼쪽·오른쪽 하단 맞춤 -->
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-stretch">
				<!-- 버전 목록: 헤더·리스트 여백·선택 스타일 통일 -->
				<div class="lg:col-span-1 lg:h-full">
					<div class="h-full lg:flex lg:flex-col bg-surface-2 rounded-lg border border-border-subtle overflow-hidden">
						<div class="px-5 py-3.5 border-b border-border-subtle flex items-center justify-between flex-shrink-0">
							<h3 class="text-sm font-semibold text-text-strong">버전 히스토리</h3>
							<button type="button" class="btn-icon rounded-md" onclick={startAddVersion} aria-label="새 버전 추가">
								<Plus size={16} />
							</button>
						</div>
						<ul class="max-h-96 lg:max-h-none lg:flex-1 lg:min-h-0 overflow-y-auto custom-list-scrollbar">
							{#each project.lyricsVersions as version}
								<li class="border-b border-border-subtle last:border-b-0">
									<button
										type="button"
										onclick={() => { selectedLyricsId = version.id; isEditingLyrics = false; isAddingVersion = false; }}
										class="version-list-item w-full px-5 py-3.5 text-left transition-colors
											{selectedLyricsId === version.id && !isAddingVersion
												? 'bg-surface-1'
												: ''}"
									>
										<div class="flex items-center justify-between gap-2">
											<span class="text-sm font-medium truncate
												{selectedLyricsId === version.id && !isAddingVersion ? 'text-brand-pink' : 'text-text-base'}">
												v{version.versionNumber} · {lyricsTypeLabels[version.versionType]}
											</span>
											<span class="text-xs flex-shrink-0
												{selectedLyricsId === version.id && !isAddingVersion ? 'text-brand-pink/70' : 'text-text-muted'}">{version.createdAt}</span>
										</div>
										<p class="text-xs mt-1 truncate
											{selectedLyricsId === version.id && !isAddingVersion ? 'text-brand-pink/60' : 'text-text-muted'}">{version.changeNotes}</p>
									</button>
								</li>
							{/each}
						</ul>
					</div>
				</div>

				<!-- 가사 내용 / 새 버전 추가 -->
				<div class="lg:col-span-2 lg:h-full">
					{#if isAddingVersion}
						<!-- 새 버전 추가 폼 -->
						<div class="h-full lg:flex lg:flex-col bg-surface-2 rounded-lg border border-border-subtle overflow-hidden">
							<div class="px-5 py-3.5 border-b border-border-subtle flex items-center justify-between gap-4 flex-shrink-0">
								<h3 class="text-sm font-semibold text-text-strong">새 가사 버전</h3>
								<div class="flex items-center gap-1 flex-shrink-0">
									<button type="button" class="btn-outline-hover px-3 py-1.5 text-sm border border-border-subtle rounded-lg" onclick={cancelAddVersion}>
										취소
									</button>
									<button type="button" class="page-header-primary-button px-3 py-1.5 text-sm rounded-lg border border-transparent bg-brand-pink text-white" onclick={saveNewVersion}>
										등록
									</button>
								</div>
							</div>
							<div class="p-5 space-y-4 lg:flex-1 lg:min-h-0 lg:overflow-y-auto">
								<!-- 버전 유형 선택 -->
								<div>
									<label for="new-version-type" class="block text-sm font-medium text-text-strong mb-2">유형</label>
									<div class="flex flex-wrap gap-2">
										{#each Object.entries(lyricsTypeLabels) as [type, label]}
											<button
												type="button"
												onclick={() => newVersionType = type as LyricsVersionType}
												class="px-3 py-1.5 text-sm rounded-lg border transition-colors
													{newVersionType === type
														? 'btn-outline-pink border-brand-pink text-brand-pink'
														: 'btn-outline-hover border-border-subtle text-text-muted'}"
											>
												{label}
											</button>
										{/each}
									</div>
								</div>
								{#if newVersionType === 'album_final'}
									<p class="text-xs text-text-muted bg-surface-1 rounded-lg px-3 py-2">
										앨범등록용 가사는 저장 시 구조 태그([Intro], [Verse] 등)와 불필요한 공백이 자동으로 제거됩니다.
									</p>
								{/if}
								<!-- 메모 -->
								<div>
									<label for="new-version-notes" class="block text-sm font-medium text-text-strong mb-2">메모</label>
									<input
										id="new-version-notes"
										type="text"
										bind:value={newVersionNotes}
										placeholder="변경 내용을 입력하세요"
										class="input-base w-full px-4 py-2"
									/>
								</div>
								<!-- 가사 입력 -->
								<div>
									<div class="flex items-center justify-between mb-2">
										<label for="new-version-content" class="text-sm font-medium text-text-strong">가사</label>
										<span class="text-xs text-text-muted">{newVersionContent.length}자</span>
									</div>
									<textarea
										id="new-version-content"
										bind:value={newVersionContent}
										class="input-base w-full min-h-64 max-h-[60vh] px-4 py-3 resize-none font-mono text-sm leading-relaxed custom-list-scrollbar"
										placeholder="가사를 입력하세요"
									></textarea>
								</div>
							</div>
						</div>
					{:else if selectedLyrics}
						<div class="h-full lg:flex lg:flex-col bg-surface-2 rounded-lg border border-border-subtle overflow-hidden">
							<div class="px-5 py-3.5 border-b border-border-subtle flex items-center justify-between gap-4 flex-shrink-0">
								<div class="min-w-0">
									<h3 class="text-sm font-semibold text-text-strong">
										v{selectedLyrics.versionNumber} · {lyricsTypeLabels[selectedLyrics.versionType]}
									</h3>
									<p class="text-xs text-text-muted mt-0.5">
										{selectedLyrics.createdBy} · {selectedLyrics.createdAt}
									</p>
								</div>
								<div class="flex items-center gap-1 flex-shrink-0">
									{#if isEditingLyrics}
										<button type="button" class="btn-outline-hover px-3 py-1.5 text-sm border border-border-subtle rounded-lg" onclick={cancelEditLyrics}>
											취소
										</button>
										<button type="button" class="page-header-primary-button px-3 py-1.5 text-sm rounded-lg border border-transparent bg-brand-pink text-white" onclick={saveEditLyrics}>
											저장
										</button>
									{:else}
										<button type="button" class="btn-icon rounded-md" onclick={() => copyPrompt(selectedLyrics?.content || '')} aria-label="복사">
											<Copy size={16} />
										</button>
										<button type="button" class="btn-icon rounded-md" onclick={startEditLyrics} aria-label="편집">
											<Edit2 size={16} />
										</button>
									{/if}
								</div>
							</div>
							{#if isEditingLyrics}
								<div class="p-5 flex-1 min-h-0 lg:flex lg:flex-col">
									<textarea
										bind:value={editingLyricsContent}
										class="input-base w-full min-h-64 lg:min-h-0 lg:flex-1 max-h-[60vh] lg:max-h-none px-4 py-3 resize-none font-mono text-sm leading-relaxed custom-list-scrollbar"
									></textarea>
								</div>
							{:else}
								<div class="p-5 flex-1 min-h-0 max-h-[60vh] lg:max-h-none overflow-y-auto custom-list-scrollbar">
									<pre class="text-sm text-text-base whitespace-pre-wrap font-mono leading-relaxed">{selectedLyrics.content}</pre>
								</div>
							{/if}
						</div>
					{:else}
						<div class="bg-surface-2 rounded-lg border border-border-subtle p-10 text-center text-sm text-text-muted">
							버전을 선택하면 가사가 표시됩니다
						</div>
					{/if}
				</div>
			</div>

		{:else if activeTab === 'prompt'}
			<!-- 프롬프트 탭 -->
			<div class="space-y-6">
				{#each project.promptConfigs as config}
					{@const isEditingThis = editingPromptConfigId === config.id}
					{@const stylesVal = isEditingThis ? editingStyles : config.styles}
					{@const excludeVal = isEditingThis ? editingExcludeStyles : config.excludeStyles}
					{@const weirdVal = isEditingThis ? editingWeirdness : config.weirdness}
					{@const styleInfVal = isEditingThis ? editingStyleInfluence : config.styleInfluence}
					{@const audioInfVal = isEditingThis ? editingAudioInfluence : config.audioInfluence}
					<div class="bg-surface-2 rounded-lg border border-border-subtle">
						<div class="px-6 py-4 border-b border-border-subtle flex flex-wrap items-center justify-between gap-2">
							<div class="flex items-center gap-2">
								<span class="px-2 py-1 rounded bg-surface-1 text-xs font-medium text-text-base">{config.sunoVersion}</span>
								<span class="px-2 py-1 rounded bg-surface-1 text-xs font-medium text-text-base">{config.mode}</span>
								<span class="px-2 py-1 rounded bg-surface-1 text-xs font-medium text-text-base">{config.vocalGender}</span>
							</div>
							<div class="flex items-center gap-2">
								<span class="text-xs text-text-muted">{config.createdBy} · {config.createdAt}</span>
								{#if isEditingThis}
									<button type="button" class="btn-outline-hover px-3 py-1.5 text-sm border border-border-subtle rounded-lg" onclick={cancelEditPromptConfig}>
										취소
									</button>
									<button type="button" class="page-header-primary-button px-3 py-1.5 text-sm rounded-lg border border-transparent bg-brand-pink text-white" onclick={saveEditPromptConfig}>
										저장
									</button>
								{:else}
									<button type="button" class="btn-icon rounded-md" onclick={() => startEditPromptConfig(config)} aria-label="편집">
										<Edit2 size={16} />
									</button>
									<button type="button" class="btn-icon" onclick={() => copyPrompt(config.styles)} aria-label="스타일 복사">
										<Copy size={14} />
									</button>
								{/if}
							</div>
						</div>
						<div class="p-6 space-y-4">
							<!-- 스타일 -->
							<div>
								<div class="flex items-center justify-between mb-2">
									<label for="styles-{config.id}" class="text-sm font-medium text-text-strong">Styles</label>
									{#if !isEditingThis}
										<button type="button" class="btn-icon" onclick={() => copyPrompt(config.styles)} aria-label="스타일 복사">
											<Copy size={14} />
										</button>
									{/if}
								</div>
								{#if isEditingThis}
									<textarea
										id="styles-{config.id}"
										bind:value={editingStyles}
										class="input-base w-full h-24 px-4 py-3 resize-none custom-list-scrollbar"
										spellcheck="true"
										lang="en"
									></textarea>
								{:else}
									<textarea
										id="styles-{config.id}"
										readonly
										value={config.styles}
										class="input-base w-full h-24 px-4 py-3 resize-none custom-list-scrollbar"
										spellcheck="true"
										lang="en"
									></textarea>
								{/if}
								<p class="text-xs text-text-muted mt-1">{stylesVal.length}/1000</p>
							</div>

							<!-- 제외 스타일 -->
							<div>
								<div class="flex items-center justify-between mb-2">
									<label for="exclude-styles-{config.id}" class="text-sm font-medium text-text-strong">Exclude Styles</label>
									{#if !isEditingThis}
										<button type="button" class="btn-icon" onclick={() => copyPrompt(config.excludeStyles)} aria-label="제외 스타일 복사">
											<Copy size={14} />
										</button>
									{/if}
								</div>
								{#if isEditingThis}
									<textarea
										id="exclude-styles-{config.id}"
										bind:value={editingExcludeStyles}
										class="input-base w-full h-20 px-4 py-3 resize-none custom-list-scrollbar"
										spellcheck="true"
										lang="en"
									></textarea>
								{:else}
									<textarea
										id="exclude-styles-{config.id}"
										readonly
										value={config.excludeStyles}
										class="input-base w-full h-20 px-4 py-3 resize-none custom-list-scrollbar"
										spellcheck="true"
										lang="en"
									></textarea>
								{/if}
							</div>

							<!-- 슬라이더들 -->
							<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
								<div>
									<label for="weirdness-{config.id}" class="block text-sm font-medium text-text-strong mb-2">Weirdness</label>
									<div class="flex items-center gap-3">
										{#if isEditingThis}
											<input 
												id="weirdness-{config.id}"
												type="range" 
												min="0" 
												max="100" 
												bind:value={editingWeirdness}
												class="suno-advanced-slider flex-1 h-2 rounded-full appearance-none cursor-pointer w-full"
												style="--slider-value: {editingWeirdness}%"
												aria-valuenow={editingWeirdness}
												aria-valuemin={0}
												aria-valuemax={100}
											/>
											<span class="text-sm text-text-base w-10 text-right">{editingWeirdness}%</span>
										{:else}
											<input 
												id="weirdness-{config.id}"
												type="range" 
												min="0" 
												max="100" 
												value={config.weirdness}
												disabled
												class="suno-advanced-slider flex-1 h-2 rounded-full appearance-none cursor-default w-full"
												style="--slider-value: {config.weirdness}%"
												aria-valuenow={config.weirdness}
												aria-valuemin={0}
												aria-valuemax={100}
											/>
											<span class="text-sm text-text-base w-10 text-right">{config.weirdness}%</span>
										{/if}
									</div>
								</div>
								<div>
									<label for="style-influence-{config.id}" class="block text-sm font-medium text-text-strong mb-2">Style Influence</label>
									<div class="flex items-center gap-3">
										{#if isEditingThis}
											<input 
												id="style-influence-{config.id}"
												type="range" 
												min="0" 
												max="100" 
												bind:value={editingStyleInfluence}
												class="suno-advanced-slider flex-1 h-2 rounded-full appearance-none cursor-pointer w-full"
												style="--slider-value: {editingStyleInfluence}%"
												aria-valuenow={editingStyleInfluence}
												aria-valuemin={0}
												aria-valuemax={100}
											/>
											<span class="text-sm text-text-base w-10 text-right">{editingStyleInfluence}%</span>
										{:else}
											<input 
												id="style-influence-{config.id}"
												type="range" 
												min="0" 
												max="100" 
												value={config.styleInfluence}
												disabled
												class="suno-advanced-slider flex-1 h-2 rounded-full appearance-none cursor-default w-full"
												style="--slider-value: {config.styleInfluence}%"
												aria-valuenow={config.styleInfluence}
												aria-valuemin={0}
												aria-valuemax={100}
											/>
											<span class="text-sm text-text-base w-10 text-right">{config.styleInfluence}%</span>
										{/if}
									</div>
								</div>
								<div>
									<label for="audio-influence-{config.id}" class="block text-sm font-medium text-text-strong mb-2">Audio Influence</label>
									<div class="flex items-center gap-3">
										{#if isEditingThis}
											<input 
												id="audio-influence-{config.id}"
												type="range" 
												min="0" 
												max="100" 
												bind:value={editingAudioInfluence}
												class="suno-advanced-slider flex-1 h-2 rounded-full appearance-none cursor-pointer w-full"
												style="--slider-value: {editingAudioInfluence}%"
												aria-valuenow={editingAudioInfluence}
												aria-valuemin={0}
												aria-valuemax={100}
											/>
											<span class="text-sm text-text-base w-10 text-right">{editingAudioInfluence}%</span>
										{:else}
											<input 
												id="audio-influence-{config.id}"
												type="range" 
												min="0" 
												max="100" 
												value={config.audioInfluence}
												disabled
												class="suno-advanced-slider flex-1 h-2 rounded-full appearance-none cursor-default w-full"
												style="--slider-value: {config.audioInfluence}%"
												aria-valuenow={config.audioInfluence}
												aria-valuemin={0}
												aria-valuemax={100}
											/>
											<span class="text-sm text-text-base w-10 text-right">{config.audioInfluence}%</span>
										{/if}
									</div>
								</div>
							</div>
						</div>
					</div>
				{/each}

				<button type="button" disabled class="btn-outline-hover w-full py-3 border border-dashed border-border-subtle rounded-lg text-text-muted transition-colors">
					<Plus size={16} class="inline mr-2" />
					새 프롬프트 설정 추가
				</button>
			</div>

		{:else if activeTab === 'audio'}
			<!-- 음원 탭 -->
			<div class="space-y-4">
				{#each displayAudioList as audio (audio.id)}
					{@const displayComments = getDisplayComments(audio)}
					<div class="bg-surface-2 rounded-lg border border-border-subtle transition-colors"
						style={audio.isFinalSelection ? 'border-left-color: var(--brand-pink)' : ''}
					>
						<div class="p-4">
							<!-- 상단: 재생 + 파일명 + 배지/선택 (보컬 페이지와 동일한 좌측 패딩·shell 구조) -->
							<div class="w-full flex items-center gap-1.5 modal-audio-shell">
								<button
									type="button"
									onclick={() => togglePlayAudio(audio.id)}
									class="w-7 h-7 text-text-base inline-flex items-center justify-center transition-colors modal-audio-play-btn flex-shrink-0"
									aria-label={playingAudioId === audio.id ? '일시정지' : '재생'}
								>
									{#if playingAudioId === audio.id}
										<Pause size={14} />
									{:else}
										<Play size={14} />
									{/if}
								</button>
								<span class="text-sm sm:text-base font-medium text-text-strong truncate flex-1 min-w-0">{audio.fileName}</span>
								{#if audio.isFinalSelection}
									<span class="px-3 py-1.5 rounded-lg bg-brand-pink text-white text-sm font-medium flex-shrink-0 whitespace-nowrap">최종</span>
								{:else}
									<button
										type="button"
										onclick={() => selectFinalAudio(audio.id)}
										class="btn-outline-hover px-3 py-1.5 text-sm border border-border-subtle rounded-lg flex-shrink-0"
									>
										선택
									</button>
								{/if}
							</div>

							<!-- 하단: 메타 + 투표 + SUNO 링크 (재생 버튼 너비+gap에 맞춰 들여쓰기: 28px + 6px = 34px → ml-[2.125rem]) -->
							<div class="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 ml-[2.125rem]">
								<div class="flex items-center gap-2 text-sm text-text-muted">
									<span>{audio.duration}</span>
									<span>·</span>
									<span>{audio.createdBy}</span>
									<span>·</span>
									<span>{audio.createdAt}</span>
								</div>
								<div class="flex items-center gap-2 text-text-muted pointer-events-none" aria-label="투표 현황">
									<span class="flex items-center gap-1 text-sm">
										<ThumbsUp size={14} />
										{audio.votes.filter(v => v.value === 'up').length}
									</span>
									<span class="flex items-center gap-1 text-sm">
										<ThumbsDown size={14} />
										{audio.votes.filter(v => v.value === 'down').length}
									</span>
								</div>
								{#if audio.sunoWorkspaceUrl}
									<a
										href={audio.sunoWorkspaceUrl}
										target="_blank"
										rel="noopener noreferrer"
										class="text-link flex items-center gap-1 text-xs text-text-muted"
									>
										<ExternalLink size={12} class="pointer-events-none" />
										SUNO
									</a>
								{/if}
							</div>
						</div>

						<!-- 댓글(피드백) + 피드백 남기기 -->
						<div class="px-4 py-3 border-t border-border-subtle space-y-2">
							{#if displayComments.length > 0}
								<div class="space-y-2">
									{#each displayComments as comment}
										<div class="flex items-start gap-2 text-sm">
											<span class="font-medium {comment.author === 'El' ? 'text-elotte-green' : 'text-elotte-orange'}">{comment.author}:</span>
											<span class="text-text-base">{comment.content}</span>
										</div>
									{/each}
								</div>
							{/if}
							<form
								class="flex gap-2 mt-2"
								onsubmit={(e) => { e.preventDefault(); addComment(audio.id); }}
							>
								<input
									type="text"
									placeholder="피드백 남기기…"
									value={commentDraftByAudioId[audio.id] ?? ''}
									oninput={(e) => setCommentDraft(audio.id, e.currentTarget.value)}
									class="input-base flex-1 min-w-0 h-9 px-3 text-sm rounded-md border border-border-subtle"
									aria-label="피드백 입력"
								/>
								<button
									type="submit"
									disabled={!(commentDraftByAudioId[audio.id] ?? '').trim()}
									class="btn-outline-hover px-3 py-1.5 text-sm border border-border-subtle rounded-lg flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
								>
									등록
								</button>
							</form>
						</div>
					</div>
				{/each}

				<label class="btn-outline-hover audio-upload-trigger w-full min-h-11 px-4 py-2 text-sm font-medium text-text-base rounded-lg border border-border-subtle focus-visible:outline-none inline-flex items-center justify-center gap-2 cursor-pointer {isUploadingAudio ? 'opacity-60 pointer-events-none' : ''}">
					<input type="file" accept="audio/*" class="sr-only" onchange={handleAudioUpload} disabled={isUploadingAudio} />
					<Upload size={16} class="inline shrink-0 pointer-events-none" />
					{isUploadingAudio ? '업로드 중…' : '새 음원 업로드'}
				</label>
			</div>

		{:else if activeTab === 'progress'}
			<!-- 진행률 탭 -->
			<ProductionProgress 
				stages={project.stages} 
				onStageClick={(stageId) => toggleStageComplete(stageId)}
			/>

		{:else if activeTab === 'history'}
			<!-- 기록 탭 -->
			<div class="bg-surface-2 rounded-lg border border-border-subtle overflow-hidden">
				<div class="px-4 py-3 border-b border-border-subtle">
					<h3 class="text-sm font-semibold text-text-strong">활동 기록</h3>
				</div>
				<ul>
					<li class="px-4 py-3 flex items-start gap-3 border-b border-border-subtle">
						<span class="flex-shrink-0 mt-0.5 text-elotte-orange pointer-events-none" aria-hidden="true"><FileText size={16} /></span>
						<div>
							<p class="text-sm text-text-base">가사 v4 (앨범등록) 작성</p>
							<p class="text-xs text-text-muted">Otte · 2026-01-11 12:00</p>
						</div>
					</li>
					<li class="px-4 py-3 flex items-start gap-3 border-b border-border-subtle">
						<span class="flex-shrink-0 mt-0.5 text-elotte-green pointer-events-none" aria-hidden="true"><Music2 size={16} /></span>
						<div>
							<p class="text-sm text-text-base">SUNO 생성 완료</p>
							<p class="text-xs text-text-muted">El · 2026-01-10 14:30</p>
						</div>
					</li>
					<li class="px-4 py-3 flex items-start gap-3 border-b border-border-subtle">
						<span class="flex-shrink-0 mt-0.5 text-elotte-green pointer-events-none" aria-hidden="true"><Palette size={16} /></span>
						<div>
							<p class="text-sm text-text-base">프롬프트 작성 완료</p>
							<p class="text-xs text-text-muted">El · 2026-01-09 20:00</p>
						</div>
					</li>
					<li class="px-4 py-3 flex items-start gap-3 border-b border-border-subtle">
						<span class="flex-shrink-0 mt-0.5 text-elotte-orange pointer-events-none" aria-hidden="true"><FileText size={16} /></span>
						<div>
							<p class="text-sm text-text-base">가사 v3 (수노발음) 작성</p>
							<p class="text-xs text-text-muted">Otte · 2026-01-09 18:00</p>
						</div>
					</li>
					<li class="px-4 py-3 flex items-start gap-3 border-b border-border-subtle">
						<span class="flex-shrink-0 mt-0.5 text-elotte-orange pointer-events-none" aria-hidden="true"><FileText size={16} /></span>
						<div>
							<p class="text-sm text-text-base">가사 v2 (곡구조) 작성</p>
							<p class="text-xs text-text-muted">Otte · 2026-01-08 15:20</p>
						</div>
					</li>
					<li class="px-4 py-3 flex items-start gap-3 border-b border-border-subtle">
						<span class="flex-shrink-0 mt-0.5 text-elotte-orange pointer-events-none" aria-hidden="true"><FileText size={16} /></span>
						<div>
							<p class="text-sm text-text-base">가사 v1 (초안) 작성</p>
							<p class="text-xs text-text-muted">Otte · 2026-01-07 14:00</p>
						</div>
					</li>
					<li class="px-4 py-3 flex items-start gap-3 border-b border-border-subtle">
						<span class="flex-shrink-0 mt-0.5 text-elotte-orange pointer-events-none" aria-hidden="true"><Lightbulb size={16} /></span>
						<div>
							<p class="text-sm text-text-base">아이디어 기획 완료</p>
							<p class="text-xs text-text-muted">Otte · 2026-01-05 12:00</p>
						</div>
					</li>
					<li class="px-4 py-3 flex items-start gap-3">
						<span class="flex-shrink-0 mt-0.5 text-brand-pink pointer-events-none" aria-hidden="true"><Plus size={16} /></span>
						<div>
							<p class="text-sm text-text-base">프로젝트 생성</p>
							<p class="text-xs text-text-muted">Otte · 2026-01-05 10:00</p>
						</div>
					</li>
				</ul>
			</div>
		{/if}
		</div>
	</SUNOTabs>
</div>

<!-- 확인 모달 -->
{#if showConfirmModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center">
		<!-- 배경 오버레이 -->
		<button
			type="button"
			class="absolute inset-0 bg-black/50"
			onclick={handleConfirmNo}
			aria-label="닫기"
		></button>
		<!-- 모달 -->
		<div class="relative bg-surface-2 border border-border-subtle rounded-lg p-6 max-w-sm w-full mx-4 shadow-lg">
			<p class="text-sm text-text-base whitespace-pre-line mb-6">{confirmMessage}</p>
			<div class="flex items-center justify-end gap-2">
				<button
					type="button"
					class="btn-outline-hover px-4 py-2 text-sm border border-border-subtle rounded-lg"
					onclick={handleConfirmNo}
				>
					취소
				</button>
				<button
					type="button"
					class="page-header-primary-button px-4 py-2 text-sm rounded-lg border border-transparent bg-brand-pink text-white"
					onclick={handleConfirmYes}
				>
					확인
				</button>
			</div>
		</div>
	</div>
{/if}
