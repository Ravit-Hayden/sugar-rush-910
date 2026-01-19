<script lang="ts">
	import { page } from '$app/stores';
	import { ArrowLeft, FileText, Palette, Music2, BarChart3, History, Play, Pause, Check, Plus, Edit2, Trash2, Copy, ChevronDown, Upload } from 'lucide-svelte';
	import ProductionProgress from '$lib/components/suno/ProductionProgress.svelte';
	import { PRODUCTION_STAGES, getStageName } from '$lib/constants/suno/stages';
	import { SUNO_VERSIONS, VOCAL_GENDERS, GENERATION_TYPES, DEFAULT_SLIDER_VALUES } from '$lib/constants/suno/prompts';
	import type { SUNOProject, ProductionStageStatus, LyricsVersion, SUNOPromptConfig, AudioVersion, LyricsVersionType } from '$lib/types/suno';

	const projectId = $page.params.id ?? '';

	// 탭 상태
	let activeTab = $state<'lyrics' | 'prompt' | 'audio' | 'progress' | 'history'>('lyrics');

	// 목업 프로젝트 데이터
	let project = $state<SUNOProject>({
		id: projectId,
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
		lyricsVersions: [
			{
				id: 'lyrics1',
				projectId: projectId,
				versionType: 'draft',
				content: '달콤한 밤이 찾아오면\n너의 생각에 잠겨\n별빛 아래 걸어가는\n우리 둘만의 시간\n\n[Chorus]\n이 밤이 끝나지 않기를\n너와 함께라면 영원히',
				versionNumber: 1,
				createdAt: '2026-01-07',
				createdBy: 'Otte',
				changeNotes: '초안 작성'
			},
			{
				id: 'lyrics2',
				projectId: projectId,
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
				projectId: projectId,
				versionType: 'suno_phonetic',
				content: '[Intro]\nDal-kom-han bam-i cha-ja-o-myeon\n\n[Verse 1]\nNeo-eui saeng-gak-e jam-gyeo\nByeol-bit a-rae geo-reo-ga-neun\nU-ri dul-man-eui si-gan\n\n[Chorus]\nI bam-i kkeut-na-ji an-ki-reul\nNeo-wa ham-kke-ra-myeon yeong-won-hi',
				versionNumber: 3,
				createdAt: '2026-01-09',
				createdBy: 'Otte',
				changeNotes: 'SUNO 발음 최적화',
				parentVersionId: 'lyrics2'
			}
		],
		promptConfigs: [
			{
				id: 'prompt1',
				projectId: projectId,
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
				projectId: projectId,
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
				projectId: projectId,
				versionType: 'suno_original',
				fileName: 'sweet_night_v2.mp3',
				fileUrl: '/audio/sweet_night_v2.mp3',
				duration: '3:18',
				sunoWorkspaceUrl: 'https://suno.com/workspace/xxx',
				sunoPromptConfigId: 'prompt1',
				isFinalSelection: true,
				comments: [],
				votes: [
					{ voter: 'El', value: 'up', timestamp: '2026-01-10T16:00:00' },
					{ voter: 'Otte', value: 'up', timestamp: '2026-01-10T16:30:00' }
				],
				createdAt: '2026-01-10',
				createdBy: 'El'
			}
		],
		usedWordIds: ['word1', 'word2'],
		createdAt: '2026-01-05',
		updatedAt: '2026-01-10'
	});

	// 가사 버전 유형 라벨
	const lyricsTypeLabels: Record<LyricsVersionType, string> = {
		draft: '초안',
		revision: '수정안',
		structure: '곡구조',
		suno_phonetic: '수노발음',
		album_final: '앨범등록'
	};

	// 선택된 가사 버전
	let selectedLyricsId = $state(project.lyricsVersions[project.lyricsVersions.length - 1]?.id || '');
	const selectedLyrics = $derived(project.lyricsVersions.find(l => l.id === selectedLyricsId));

	// 탭 정의
	const tabs = [
		{ id: 'lyrics', label: '가사', icon: FileText },
		{ id: 'prompt', label: '프롬프트', icon: Palette },
		{ id: 'audio', label: '음원', icon: Music2 },
		{ id: 'progress', label: '진행률', icon: BarChart3 },
		{ id: 'history', label: '기록', icon: History }
	] as const;

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

	// 프롬프트 복사
	async function copyPrompt(text: string) {
		await navigator.clipboard.writeText(text);
	}
</script>

<svelte:head>
	<title>{project.title} | SUNO 제작</title>
</svelte:head>

<div class="px-6 lg:px-10 py-6 pb-20 sm:pb-6">
	<!-- 헤더 -->
	<div class="mb-6">
		<a href="/suno/projects" class="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-brand-pink transition-colors mb-3">
			<ArrowLeft size={14} />
			곡 목록
		</a>
		<div class="flex items-start justify-between gap-4">
			<div>
				<h1 class="text-2xl font-bold text-text-strong">{project.title}</h1>
				<p class="text-text-muted mt-1">{project.description}</p>
			</div>
			<div class="flex items-center gap-2">
				<span class="px-3 py-1.5 rounded-lg text-sm font-medium bg-brand-pink/20 text-brand-pink">
					{project.progressPercent}% 완료
				</span>
			</div>
		</div>
	</div>

	<!-- 탭 네비게이션 -->
	<div class="border-b border-border-subtle mb-6">
		<nav class="flex gap-0 -mb-px">
			{#each tabs as tab}
				{@const Icon = tab.icon}
				<button
					type="button"
					onclick={() => activeTab = tab.id}
					class="flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors
						{activeTab === tab.id 
							? 'border-brand-pink text-brand-pink' 
							: 'border-transparent text-text-muted hover:text-text-base hover:border-border-subtle'}"
				>
					<Icon size={16} />
					{tab.label}
				</button>
			{/each}
		</nav>
	</div>

	<!-- 탭 콘텐츠 -->
	<div class="min-h-[400px]">
		{#if activeTab === 'lyrics'}
			<!-- 가사 탭 -->
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<!-- 버전 목록 -->
				<div class="lg:col-span-1">
					<div class="bg-surface-1 rounded-lg border border-border-subtle">
						<div class="px-4 py-3 border-b border-border-subtle flex items-center justify-between">
							<h3 class="text-sm font-semibold text-text-strong">버전 히스토리</h3>
							<button type="button" class="btn-icon">
								<Plus size={16} />
							</button>
						</div>
						<ul class="divide-y divide-border-subtle max-h-96 overflow-y-auto custom-list-scrollbar">
							{#each project.lyricsVersions as version}
								<li>
									<button
										type="button"
										onclick={() => selectedLyricsId = version.id}
										class="w-full px-4 py-3 text-left hover:bg-surface-2 transition-colors
											{selectedLyricsId === version.id ? 'bg-brand-pink/10 border-l-2 border-brand-pink' : ''}"
									>
										<div class="flex items-center justify-between">
											<span class="text-sm font-medium text-text-base">
												v{version.versionNumber} - {lyricsTypeLabels[version.versionType]}
											</span>
											<span class="text-xs text-text-muted">{version.createdAt}</span>
										</div>
										<p class="text-xs text-text-muted mt-1 truncate">{version.changeNotes}</p>
									</button>
								</li>
							{/each}
						</ul>
					</div>
				</div>

				<!-- 가사 내용 -->
				<div class="lg:col-span-2">
					{#if selectedLyrics}
						<div class="bg-surface-1 rounded-lg border border-border-subtle">
							<div class="px-4 py-3 border-b border-border-subtle flex items-center justify-between">
								<div>
									<h3 class="text-sm font-semibold text-text-strong">
										v{selectedLyrics.versionNumber} - {lyricsTypeLabels[selectedLyrics.versionType]}
									</h3>
									<p class="text-xs text-text-muted mt-0.5">
										{selectedLyrics.createdBy} · {selectedLyrics.createdAt}
									</p>
								</div>
								<div class="flex items-center gap-2">
									<button type="button" class="btn-icon" onclick={() => copyPrompt(selectedLyrics?.content || '')}>
										<Copy size={16} />
									</button>
									<button type="button" class="btn-icon">
										<Edit2 size={16} />
									</button>
								</div>
							</div>
							<div class="p-4">
								<pre class="text-sm text-text-base whitespace-pre-wrap font-mono leading-relaxed">{selectedLyrics.content}</pre>
							</div>
						</div>
					{:else}
						<div class="bg-surface-1 rounded-lg border border-border-subtle p-8 text-center text-text-muted">
							가사 버전을 선택하세요
						</div>
					{/if}
				</div>
			</div>

		{:else if activeTab === 'prompt'}
			<!-- 프롬프트 탭 -->
			<div class="space-y-6">
				{#each project.promptConfigs as config}
					<div class="bg-surface-1 rounded-lg border border-border-subtle">
						<div class="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
							<div class="flex items-center gap-4">
								<span class="px-2 py-1 rounded bg-surface-2 text-xs font-medium text-text-base">{config.sunoVersion}</span>
								<span class="px-2 py-1 rounded bg-surface-2 text-xs font-medium text-text-base">{config.mode}</span>
								<span class="px-2 py-1 rounded bg-surface-2 text-xs font-medium text-text-base">{config.vocalGender}</span>
							</div>
							<span class="text-xs text-text-muted">{config.createdBy} · {config.createdAt}</span>
						</div>
						<div class="p-6 space-y-4">
							<!-- 스타일 -->
							<div>
								<label for="styles-{config.id}" class="block text-sm font-medium text-text-strong mb-2">Styles</label>
								<div class="relative">
									<textarea
										id="styles-{config.id}"
										readonly
										value={config.styles}
										class="input-base w-full h-24 px-4 py-3 resize-none"
									></textarea>
									<button 
										type="button" 
										class="absolute top-2 right-2 btn-icon"
										onclick={() => copyPrompt(config.styles)}
									>
										<Copy size={14} />
									</button>
								</div>
								<p class="text-xs text-text-muted mt-1">{config.styles.length}/1000</p>
							</div>

							<!-- 제외 스타일 -->
							<div>
								<label for="exclude-styles-{config.id}" class="block text-sm font-medium text-text-strong mb-2">Exclude Styles</label>
								<div class="relative">
									<textarea
										id="exclude-styles-{config.id}"
										readonly
										value={config.excludeStyles}
										class="input-base w-full h-20 px-4 py-3 resize-none"
									></textarea>
									<button 
										type="button" 
										class="absolute top-2 right-2 btn-icon"
										onclick={() => copyPrompt(config.excludeStyles)}
									>
										<Copy size={14} />
									</button>
								</div>
							</div>

							<!-- 슬라이더들 -->
							<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
								<div>
									<label for="weirdness-{config.id}" class="block text-sm font-medium text-text-strong mb-2">Weirdness</label>
									<div class="flex items-center gap-3">
										<input 
											id="weirdness-{config.id}"
											type="range" 
											min="0" 
											max="100" 
											value={config.weirdness}
											disabled
											class="flex-1 h-2 bg-surface-2 rounded-full appearance-none"
										/>
										<span class="text-sm text-text-base w-10 text-right">{config.weirdness}%</span>
									</div>
								</div>
								<div>
									<label for="style-influence-{config.id}" class="block text-sm font-medium text-text-strong mb-2">Style Influence</label>
									<div class="flex items-center gap-3">
										<input 
											id="style-influence-{config.id}"
											type="range" 
											min="0" 
											max="100" 
											value={config.styleInfluence}
											disabled
											class="flex-1 h-2 bg-surface-2 rounded-full appearance-none"
										/>
										<span class="text-sm text-text-base w-10 text-right">{config.styleInfluence}%</span>
									</div>
								</div>
								<div>
									<label for="audio-influence-{config.id}" class="block text-sm font-medium text-text-strong mb-2">Audio Influence</label>
									<div class="flex items-center gap-3">
										<input 
											id="audio-influence-{config.id}"
											type="range" 
											min="0" 
											max="100" 
											value={config.audioInfluence}
											disabled
											class="flex-1 h-2 bg-surface-2 rounded-full appearance-none"
										/>
										<span class="text-sm text-text-base w-10 text-right">{config.audioInfluence}%</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				{/each}

				<button type="button" class="w-full py-3 border-2 border-dashed border-border-subtle rounded-lg text-text-muted hover:border-brand-pink hover:text-brand-pink transition-colors">
					<Plus size={16} class="inline mr-2" />
					새 프롬프트 설정 추가
				</button>
			</div>

		{:else if activeTab === 'audio'}
			<!-- 음원 탭 -->
			<div class="space-y-4">
				{#each project.audioVersions as audio}
					<div class="bg-surface-1 rounded-lg border border-border-subtle {audio.isFinalSelection ? 'ring-2 ring-brand-pink' : ''}">
						<div class="p-4 flex items-center gap-4">
							<!-- 재생 버튼 -->
							<button
								type="button"
								onclick={() => togglePlayAudio(audio.id)}
								class="w-12 h-12 rounded-full bg-brand-pink flex items-center justify-center text-white flex-shrink-0"
							>
								{#if playingAudioId === audio.id}
									<Pause size={20} />
								{:else}
									<Play size={20} class="ml-1" />
								{/if}
							</button>

							<!-- 정보 -->
							<div class="flex-1 min-w-0">
								<div class="flex items-center gap-2">
									<span class="text-base font-medium text-text-strong">{audio.fileName}</span>
									{#if audio.isFinalSelection}
										<span class="px-2 py-0.5 rounded bg-brand-pink text-white text-xs">최종 선택</span>
									{/if}
								</div>
								<div class="flex items-center gap-3 mt-1 text-sm text-text-muted">
									<span>{audio.duration}</span>
									<span>·</span>
									<span>{audio.createdBy}</span>
									<span>·</span>
									<span>{audio.createdAt}</span>
								</div>
							</div>

							<!-- 투표 -->
							<div class="flex items-center gap-2">
								<span class="text-sm text-text-muted">
									👍 {audio.votes.filter(v => v.value === 'up').length}
								</span>
								<span class="text-sm text-text-muted">
									👎 {audio.votes.filter(v => v.value === 'down').length}
								</span>
							</div>

							<!-- 최종 선택 버튼 -->
							{#if !audio.isFinalSelection}
								<button type="button" class="px-3 py-1.5 text-sm border border-border-subtle rounded-lg hover:border-brand-pink hover:text-brand-pink transition-colors">
									선택
								</button>
							{/if}
						</div>

						<!-- 댓글 -->
						{#if audio.comments.length > 0}
							<div class="px-4 py-3 border-t border-border-subtle bg-surface-2/50">
								{#each audio.comments as comment}
									<div class="flex items-start gap-2 text-sm">
										<span class="font-medium {comment.author === 'El' ? 'text-elotte-green' : 'text-elotte-orange'}">{comment.author}:</span>
										<span class="text-text-base">{comment.content}</span>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				{/each}

				<button type="button" class="w-full py-3 border-2 border-dashed border-border-subtle rounded-lg text-text-muted hover:border-brand-pink hover:text-brand-pink transition-colors">
					<Upload size={16} class="inline mr-2" />
					새 음원 업로드
				</button>
			</div>

		{:else if activeTab === 'progress'}
			<!-- 진행률 탭 -->
			<ProductionProgress 
				stages={project.stages} 
				onStageClick={(stageId) => toggleStageComplete(stageId)}
			/>

		{:else if activeTab === 'history'}
			<!-- 기록 탭 -->
			<div class="bg-surface-1 rounded-lg border border-border-subtle">
				<div class="px-4 py-3 border-b border-border-subtle">
					<h3 class="text-sm font-semibold text-text-strong">활동 기록</h3>
				</div>
				<ul class="divide-y divide-border-subtle">
					<li class="px-4 py-3 flex items-start gap-3">
						<div class="w-2 h-2 rounded-full bg-brand-pink mt-2 flex-shrink-0"></div>
						<div>
							<p class="text-sm text-text-base">SUNO 생성 완료</p>
							<p class="text-xs text-text-muted">El · 2026-01-10 14:30</p>
						</div>
					</li>
					<li class="px-4 py-3 flex items-start gap-3">
						<div class="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
						<div>
							<p class="text-sm text-text-base">가사 v3 (수노발음) 작성</p>
							<p class="text-xs text-text-muted">Otte · 2026-01-09 18:00</p>
						</div>
					</li>
					<li class="px-4 py-3 flex items-start gap-3">
						<div class="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
						<div>
							<p class="text-sm text-text-base">가사 v2 (곡구조) 작성</p>
							<p class="text-xs text-text-muted">Otte · 2026-01-08 15:20</p>
						</div>
					</li>
					<li class="px-4 py-3 flex items-start gap-3">
						<div class="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
						<div>
							<p class="text-sm text-text-base">프로젝트 생성</p>
							<p class="text-xs text-text-muted">Otte · 2026-01-05 10:00</p>
						</div>
					</li>
				</ul>
			</div>
		{/if}
	</div>
</div>
