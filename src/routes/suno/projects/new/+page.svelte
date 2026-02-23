<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { tick } from 'svelte';
	import { slide } from 'svelte/transition';
	import {
		ArrowLeft,
		Music,
		Save,
		ChevronDown,
		ChevronUp,
		FileText,
		Eye,
		Sparkles,
		Settings,
		Mic,
		PenLine,
		Sliders,
		Volume2,
		Guitar,
		ListChecks,
		Check,
		Lock,
		ImagePlus,
		X,
		Film
	} from 'lucide-svelte';
	import SUNOTabs from '$lib/components/suno/SUNOTabs.svelte';
	import {
		SUNO_VERSIONS,
		VOCAL_GENDERS,
		SUNO_MODES,
		LYRICS_MODES,
		GENERATION_TYPES,
		DEFAULT_SLIDER_VALUES,
		AUDIO_SOURCE_TYPES,
		MAX_PROMPT_LENGTH
	} from '$lib/constants/suno/prompts';
	import { PRODUCTION_STAGES } from '$lib/constants/suno/stages';
	import { ALBUMS } from '$lib/constants/albums';
	import type {
		VocalGender,
		SUNOVersion,
		SUNOMode,
		LyricsMode,
		GenerationType,
		AudioSourceType,
		Producer
	} from '$lib/types/suno';

	// URL 파라미터에서 템플릿 정보 가져오기
	const templateName = $page.url.searchParams.get('template') || '';
	const defaultStyles = $page.url.searchParams.get('styles') || '';
	const defaultExclude = $page.url.searchParams.get('exclude') || '';
	const defaultVocal = ($page.url.searchParams.get('vocal') as VocalGender) || 'Female';

	// 기본 정보
	let title = $state('');
	let description = $state('');
	let createdBy = $state<Producer>('El');
	let coverImageFile = $state<File | null>(null);
	let coverImagePreview = $state<string>('');
	let coverInputEl = $state<HTMLInputElement | null>(null);
	let coverError = $state('');

	function handleCoverSelect(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		coverError = '';
		if (!file) return;
		if (!file.type.startsWith('image/')) {
			coverError = '이미지 파일만 업로드할 수 있습니다. (PNG, JPG, WebP, GIF)';
			return;
		}
		if (file.size > 1024 * 1024 * 1024) {
			coverError = '파일 크기는 1GB 이하여야 합니다.';
			return;
		}
		coverImageFile = file;
		const reader = new FileReader();
		reader.onload = () => {
			coverImagePreview = reader.result as string;
		};
		reader.readAsDataURL(file);
	}

	function removeCoverImage() {
		coverImageFile = null;
		coverImagePreview = '';
		coverError = '';
		if (coverInputEl) coverInputEl.value = '';
	}

	// SUNO 생성 설정
	let mode = $state<SUNOMode>('Custom');
	let sunoVersion = $state<SUNOVersion>('v4.5-all');
	let generationType = $state<GenerationType>('create');
	let vocalGender = $state<VocalGender>(defaultVocal);
	let lyricsMode = $state<LyricsMode>('Manual');

	// 프롬프트
	let styles = $state(defaultStyles);
	let excludeStyles = $state(defaultExclude);
	let lyrics = $state('');

	// 고급 옵션
	let showAdvanced = $state(false);
	let weirdness = $state(DEFAULT_SLIDER_VALUES.weirdness);
	let styleInfluence = $state(DEFAULT_SLIDER_VALUES.styleInfluence);
	let audioInfluence = $state(DEFAULT_SLIDER_VALUES.audioInfluence);

	// 오디오 소스
	let audioSourceType = $state<AudioSourceType | ''>('');
	let audioSourceName = $state('');

	// 편집·스튜디오 메모
	let editNotes = $state('');
	let studioNotes = $state('');

	// 소속 앨범 · 뮤직비디오 (albumId === '__custom__' 이면 albumNameCustom 사용)
	const ALBUM_CUSTOM = '__custom__';
	let albumId = $state('');
	let albumNameCustom = $state('');
	let planMusicVideo = $state(false);
	let musicVideoMemo = $state('');

	// 커스텀 드롭다운 상태
	let createdByOpen = $state(false);
	let generationTypeOpen = $state(false);
	let sunoVersionOpen = $state(false);
	let albumOpen = $state(false);

	function closeAllDropdowns() {
		createdByOpen = false;
		generationTypeOpen = false;
		sunoVersionOpen = false;
		albumOpen = false;
	}

	function handleWindowClick(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (!target.closest('.dd-createdBy')) createdByOpen = false;
		if (!target.closest('.dd-generationType')) generationTypeOpen = false;
		if (!target.closest('.dd-sunoVersion')) sunoVersionOpen = false;
		if (!target.closest('.dd-album')) albumOpen = false;
	}

	// 슬라이더 직접 입력 모드
	let editingSlider = $state<'weirdness' | 'styleInfluence' | 'audioInfluence' | ''>('');
	let sliderInputValue = $state('');

	async function startSliderEdit(name: 'weirdness' | 'styleInfluence' | 'audioInfluence', currentValue: number) {
		editingSlider = name;
		sliderInputValue = String(currentValue);
		await tick();
		const el = document.querySelector<HTMLInputElement>(`.slider-edit-${name}`);
		el?.focus();
		el?.select();
	}

	function commitSliderEdit() {
		const val = Math.max(0, Math.min(100, Math.round(Number(sliderInputValue) || 0)));
		if (editingSlider === 'weirdness') weirdness = val;
		else if (editingSlider === 'styleInfluence') styleInfluence = val;
		else if (editingSlider === 'audioInfluence') audioInfluence = val;
		editingSlider = '';
	}

	// 섹션 접기/펼치기
	let openSections = $state<Set<string>>(new Set(['basic', 'generation', 'prompt']));

	function toggleSection(id: string) {
		const next = new Set(openSections);
		if (next.has(id)) next.delete(id);
		else next.add(id);
		openSections = next;
	}

	// 저장 상태
	let isSaving = $state(false);
	let errorMessage = $state('');
	let isFormDirty = $state(false);

	function handleBeforeUnload(e: BeforeUnloadEvent) {
		if (isFormDirty) {
			e.preventDefault();
			e.returnValue = '';
		}
	}

	function confirmLeave(): boolean {
		return !isFormDirty || confirm('저장하지 않고 나가시겠습니까?');
	}

	// 유효성
	const isValid = $derived(
		title.trim().length > 0 &&
			styles.length <= MAX_PROMPT_LENGTH &&
			excludeStyles.length <= MAX_PROMPT_LENGTH
	);
	const validationErrors = $derived.by(() => {
		const err: string[] = [];
		if (title.trim().length === 0) err.push('프로젝트 제목을 입력하세요.');
		if (styles.length > MAX_PROMPT_LENGTH) err.push(`Styles는 ${MAX_PROMPT_LENGTH}자 이하여야 합니다.`);
		if (excludeStyles.length > MAX_PROMPT_LENGTH) err.push(`Exclude Styles는 ${MAX_PROMPT_LENGTH}자 이하여야 합니다.`);
		return err;
	});

	// 미리보기
	const previewTitle = $derived(title.trim() || '프로젝트 제목 없음');
	const previewDescription = $derived(description.trim() || '설명 없음');
	const vocalLabel = $derived(VOCAL_GENDERS.find((g) => g.value === vocalGender)?.label ?? vocalGender);
	const versionObj = $derived(SUNO_VERSIONS.find((v) => v.value === sunoVersion));
	const genTypeLabel = $derived(GENERATION_TYPES.find((g) => g.value === generationType)?.label ?? generationType);
	const albumLabel = $derived(
		albumId === ALBUM_CUSTOM
			? (albumNameCustom.trim() || '앨범명 입력')
			: albumId
				? (ALBUMS.find((a) => a.id === albumId)?.title ?? '앨범')
				: '미정'
	);

	// 제작 단계 프리셋 (생성 시 첫 3단계 자동 포함)
	const initialStages = PRODUCTION_STAGES.slice(0, 3);

	async function handleSubmit() {
		if (validationErrors.length > 0) {
			errorMessage = validationErrors[0];
			return;
		}
		if (!isValid || isSaving) return;
		isSaving = true;
		errorMessage = '';
		try {
			// TODO: 실제 API 연동 시 fetch('/api/suno/projects', { method: 'POST', body: JSON.stringify(payload) }) 등으로 교체
			await new Promise((resolve) => setTimeout(resolve, 500));
			isFormDirty = false;
		goto('/suno/projects');
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : '프로젝트 생성 중 오류가 발생했습니다.';
		} finally {
			isSaving = false;
	}
	}
</script>

<svelte:window onclick={handleWindowClick} onbeforeunload={handleBeforeUnload} />

<svelte:head>
	<title>새 프로젝트 | SUNO 제작</title>
</svelte:head>

<div class="pt-0 pb-6 sm:pb-6 pb-20 bg-bg text-text-base">
	<!-- 헤더 -->
	<div class="mb-8 mt-1.5">
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
			<div>
				<h1 class="text-3xl font-bold text-text-strong mb-2">SUNO 제작</h1>
				<p class="text-text-muted">
					{templateName ? `새 프로젝트 · 템플릿: ${templateName}` : '새 프로젝트 · 새로운 곡의 기획부터 발매까지'}
				</p>
			</div>
			<a
				href="/suno/projects"
				class="btn-outline-hover min-h-11 px-4 py-2 text-sm font-medium text-text-base rounded-lg border border-border-subtle focus-visible:outline-none inline-flex items-center gap-2 flex-shrink-0"
				onclick={(e) => { if (!confirmLeave()) e.preventDefault(); }}
			>
				<ArrowLeft size={14} />
				프로젝트 목록
			</a>
		</div>
	</div>

	<SUNOTabs>
		{#if errorMessage || validationErrors.length > 0}
			<div class="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
				{errorMessage || validationErrors[0]}
			</div>
		{/if}

		<form
			onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}
			oninput={() => { if (!isFormDirty) isFormDirty = true; }}
		>
			<div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
				<!-- 왼쪽: 폼 영역 -->
				<div class="xl:col-span-2 space-y-4">

					<!-- 1. 기본 정보 -->
					<div class="bg-surface-2 rounded-lg border border-border-subtle">
						<button
							type="button"
							onclick={() => toggleSection('basic')}
							class="accordion-section-header flex w-full cursor-pointer items-center justify-between px-6 py-4 text-left bg-transparent rounded-t-lg focus-visible:outline-none"
							aria-expanded={openSections.has('basic')}
							aria-controls="section-basic"
						>
							<h3
								class="text-base font-semibold text-brand-pink flex items-center gap-2"
								role="presentation"
								onclick={(e) => { e.stopPropagation(); toggleSection('basic'); }}
							>
								<FileText size={16} class="text-brand-pink" />
								기본 정보
							</h3>
							{#if openSections.has('basic')}
								<ChevronUp size={14} class="text-text-muted" />
							{:else}
								<ChevronDown size={14} class="text-text-muted" />
							{/if}
						</button>
						{#if openSections.has('basic')}
							<div id="section-basic" class="border-t border-border-subtle p-6 space-y-5" transition:slide|local>
								<!-- 커버 이미지 -->
								<div>
									<span class="block text-sm font-medium text-text-strong mb-2">
										커버 이미지 <span class="text-xs text-text-muted font-normal">(선택)</span>
									</span>
									<div class="flex items-start gap-4">
										{#if coverImagePreview}
											<div class="relative w-24 h-24 rounded-lg overflow-hidden border border-border-subtle flex-shrink-0 group">
												<img src={coverImagePreview} alt="커버 미리보기" class="w-full h-full object-cover" />
												<button
													type="button"
													onclick={removeCoverImage}
													class="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
													aria-label="커버 이미지 제거"
												>
													<X size={12} />
												</button>
											</div>
										{:else}
											<button
												type="button"
												onclick={() => coverInputEl?.click()}
												class="w-24 h-24 rounded-lg border-2 border-dashed border-border-subtle bg-surface-2 flex flex-col items-center justify-center gap-1 text-text-muted hover:border-hover-point hover:text-hover-point transition-colors flex-shrink-0 cursor-pointer"
											>
												<ImagePlus size={20} />
												<span class="text-[10px]">업로드</span>
											</button>
										{/if}
										<div class="flex-1 text-xs text-text-muted pt-1">
											<p>곡의 커버 아트를 업로드하세요.</p>
											<p class="mt-1">PNG, JPG, WebP 형식 권장</p>
											{#if coverError}
												<p class="mt-2 text-red-400 text-xs">{coverError}</p>
											{/if}
											{#if coverImagePreview}
												<button
													type="button"
													onclick={() => coverInputEl?.click()}
													class="mt-2 text-brand-pink hover:text-hover-point transition-colors"
												>
													다른 이미지로 변경
												</button>
											{/if}
										</div>
									</div>
									<input
										bind:this={coverInputEl}
										type="file"
										accept="image/png,image/jpeg,image/webp,image/gif"
										onchange={handleCoverSelect}
										class="hidden"
									/>
								</div>

				<div>
					<label for="title" class="block text-sm font-medium text-text-strong mb-2">
						프로젝트 제목 <span class="text-brand-pink">*</span>
					</label>
					<input
						id="title"
						type="text"
						bind:value={title}
						placeholder="예: 달콤한 밤의 노래"
										class="input-base w-full h-11 px-4"
						required
					/>
									{#if validationErrors.length > 0 && title.trim().length === 0}
										<p class="text-xs text-red-400 mt-1">프로젝트 제목을 입력하세요.</p>
									{/if}
				</div>
				<div>
					<label for="description" class="block text-sm font-medium text-text-strong mb-2">
										Song Description <span class="text-xs text-text-muted font-normal">(선택)</span>
					</label>
									<textarea
						id="description"
						bind:value={description}
										placeholder="곡에 대한 간단한 설명이나 컨셉"
										class="input-base w-full h-20 px-4 py-3 resize-none custom-list-scrollbar"
									></textarea>
								</div>
								<div class="grid grid-cols-2 gap-4">
									<div>
										<span class="block text-sm font-medium text-text-strong mb-2">담당자</span>
										<div class="relative dd-createdBy">
											<button
												type="button"
												onclick={() => { closeAllDropdowns(); createdByOpen = !createdByOpen; }}
												class="input-base w-full h-11 px-4 pr-10 text-left cursor-pointer flex items-center"
												aria-haspopup="listbox"
												aria-expanded={createdByOpen}
												aria-controls="dropdown-createdBy"
											>
												<span class="flex-1 truncate">{createdBy}</span>
												<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
													<ChevronDown size={12} class="text-text-muted" />
												</div>
											</button>
											{#if createdByOpen}
												<ul id="dropdown-createdBy" role="listbox" class="absolute left-0 w-full mt-[6px] bg-surface-2 border border-border-subtle rounded-[6px] z-40 max-h-64 overflow-y-auto custom-list-scrollbar">
													{#each ['El', 'Otte'] as value}
														<li
															role="option"
															aria-selected={createdBy === value}
															tabindex="0"
															onclick={() => { createdBy = value as Producer; createdByOpen = false; }}
															onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); createdBy = value as Producer; createdByOpen = false; } }}
															class="dropdown-item px-4 py-2 text-sm cursor-pointer transition-colors {createdBy === value ? 'bg-brand-pink text-white' : 'text-text-base hover:bg-hover-point hover:text-text-on-hover'}"
														>{value}</li>
													{/each}
												</ul>
											{/if}
										</div>
									</div>
									<div>
										<span class="block text-sm font-medium text-text-strong mb-2">생성 유형</span>
										<div class="relative dd-generationType">
											<button
												type="button"
												onclick={() => { closeAllDropdowns(); generationTypeOpen = !generationTypeOpen; }}
												class="input-base w-full h-11 px-4 pr-10 text-left cursor-pointer flex items-center"
												aria-haspopup="listbox"
												aria-expanded={generationTypeOpen}
												aria-controls="dropdown-generationType"
											>
												<span class="flex-1 truncate">{genTypeLabel}</span>
												<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
													<ChevronDown size={12} class="text-text-muted" />
												</div>
											</button>
											{#if generationTypeOpen}
												<ul id="dropdown-generationType" role="listbox" class="absolute left-0 w-full mt-[6px] bg-surface-2 border border-border-subtle rounded-[6px] z-40 max-h-64 overflow-y-auto custom-list-scrollbar">
													{#each GENERATION_TYPES as gt}
														<li
															role="option"
															aria-selected={generationType === gt.value}
															tabindex="0"
															onclick={() => { generationType = gt.value; generationTypeOpen = false; }}
															onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); generationType = gt.value; generationTypeOpen = false; } }}
															class="dropdown-item px-4 py-2 text-sm cursor-pointer transition-colors {generationType === gt.value ? 'bg-brand-pink text-white' : 'text-text-base hover:bg-hover-point hover:text-text-on-hover'}"
														>
															<span>{gt.label}</span>
															<span class="text-xs ml-1 {generationType === gt.value ? 'text-white/70' : 'text-inherit opacity-60'}">– {gt.description}</span>
														</li>
													{/each}
												</ul>
											{/if}
				</div>
			</div>
		</div>

								<!-- 소속 앨범 -->
								<div>
									<span class="block text-sm font-medium text-text-strong mb-2">소속 앨범 <span class="text-xs text-text-muted font-normal">(선택)</span></span>
									<div class="relative dd-album">
										<button
											type="button"
											onclick={() => { closeAllDropdowns(); albumOpen = !albumOpen; }}
											class="input-base w-full h-11 px-4 pr-10 text-left cursor-pointer flex items-center"
											aria-haspopup="listbox"
											aria-expanded={albumOpen}
											aria-controls="dropdown-album"
										>
											<span class="flex-1 truncate">{albumLabel}</span>
											<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
												<ChevronDown size={12} class="text-text-muted" />
											</div>
										</button>
										{#if albumOpen}
											<ul id="dropdown-album" role="listbox" class="absolute left-0 w-full mt-[6px] bg-surface-2 border border-border-subtle rounded-[6px] z-40 max-h-64 overflow-y-auto custom-list-scrollbar">
												<li
													role="option"
													aria-selected={albumId === ALBUM_CUSTOM}
													tabindex="0"
													onclick={() => { albumId = ALBUM_CUSTOM; albumOpen = false; }}
													onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); albumId = ALBUM_CUSTOM; albumOpen = false; } }}
													class="dropdown-item px-4 py-2 text-sm cursor-pointer transition-colors border-b border-border-subtle {albumId === ALBUM_CUSTOM ? 'bg-brand-pink text-white' : 'text-text-base hover:bg-hover-point hover:text-text-on-hover'}"
												>직접 입력</li>
												<li
													role="option"
													aria-selected={albumId === ''}
													tabindex="0"
													onclick={() => { albumId = ''; albumOpen = false; }}
													onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); albumId = ''; albumOpen = false; } }}
													class="dropdown-item px-4 py-2 text-sm cursor-pointer transition-colors {albumId === '' ? 'bg-brand-pink text-white' : 'text-text-base hover:bg-hover-point hover:text-text-on-hover'}"
												>미정</li>
												{#each ALBUMS as album}
													<li
														role="option"
														aria-selected={albumId === album.id}
														tabindex="0"
														onclick={() => { albumId = album.id; albumOpen = false; }}
														onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); albumId = album.id; albumOpen = false; } }}
														class="dropdown-item px-4 py-2 text-sm cursor-pointer transition-colors {albumId === album.id ? 'bg-brand-pink text-white' : 'text-text-base hover:bg-hover-point hover:text-text-on-hover'}"
													>{album.title}</li>
												{/each}
											</ul>
										{/if}
									</div>
									{#if albumId === ALBUM_CUSTOM}
										<input
											type="text"
											bind:value={albumNameCustom}
											placeholder="앨범명 입력"
											class="input-base w-full h-11 px-4 mt-2"
										/>
									{/if}
								</div>

								<!-- 뮤직비디오 제작 -->
				<div>
									<div class="flex items-center justify-between gap-4">
										<label class="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
											<input
												type="checkbox"
												bind:checked={planMusicVideo}
												class="mv-plan-checkbox w-4 h-4 rounded appearance-none bg-transparent border border-[color:var(--text-base)] checked:bg-transparent checked:border-[color:var(--brand-pink)] checked:shadow-none focus-visible:outline-none focus-visible:border-[color:var(--brand-pink)] transition-all duration-200 cursor-pointer relative flex-shrink-0"
											/>
											<span class="text-sm font-medium text-text-strong">뮤직비디오 제작 예정</span>
					</label>
										<a
											href="/music-videos/create{title.trim() ? `?title=${encodeURIComponent(title.trim())}` : ''}"
											class="btn-outline-hover inline-flex items-center gap-2 min-h-9 px-4 py-2 text-sm font-medium rounded-lg border border-border-subtle focus-visible:outline-none flex-shrink-0"
										>
											<Film size={14} />
											뮤직비디오 제작 페이지로 가기
										</a>
									</div>
									{#if planMusicVideo}
										<div class="mt-3">
											<label for="musicVideoMemo" class="block text-xs font-medium text-text-muted mb-1.5">메모 <span class="font-normal">(선택)</span></label>
											<textarea
												id="musicVideoMemo"
												bind:value={musicVideoMemo}
												placeholder="예: 컨셉, 참고 영상, 촬영/제작 일정 등"
												class="input-base w-full h-16 px-4 py-2 resize-none custom-list-scrollbar text-sm"
											></textarea>
										</div>
									{/if}
								</div>
							</div>
						{/if}
					</div>

					<!-- 2. SUNO 생성 설정 -->
					<div class="bg-surface-2 rounded-lg border border-border-subtle">
						<button
							type="button"
							onclick={() => toggleSection('generation')}
							class="accordion-section-header flex w-full cursor-pointer items-center justify-between px-6 py-4 text-left bg-transparent rounded-t-lg focus-visible:outline-none"
							aria-expanded={openSections.has('generation')}
							aria-controls="section-generation"
						>
							<h3
								class="text-base font-semibold text-brand-pink flex items-center gap-2"
								role="presentation"
								onclick={(e) => { e.stopPropagation(); toggleSection('generation'); }}
							>
								<Settings size={16} class="text-brand-pink" />
								SUNO 생성 설정
							</h3>
							{#if openSections.has('generation')}
								<ChevronUp size={14} class="text-text-muted" />
							{:else}
								<ChevronDown size={14} class="text-text-muted" />
							{/if}
						</button>
						{#if openSections.has('generation')}
							<div id="section-generation" class="border-t border-border-subtle p-6 space-y-5" transition:slide|local>
								<!-- 모드 토글 + 버전 -->
								<div class="grid grid-cols-2 gap-4">
									<div>
										<span class="block text-sm font-medium text-text-strong mb-2">모드</span>
										<div class="inline-flex rounded-lg border border-border-subtle bg-surface-1 p-1 w-full">
											{#each SUNO_MODES as m}
												<button
													type="button"
													onclick={() => (mode = m.value)}
													class="flex-1 min-h-9 rounded-md px-3 text-sm transition-colors focus-visible:outline-none {mode === m.value ? 'bg-brand-pink text-white' : 'text-text-base hover:bg-surface-2'}"
												>
													{m.label}
												</button>
											{/each}
										</div>
									</div>
									<div>
										<span class="block text-sm font-medium text-text-strong mb-2">SUNO 버전</span>
										<div class="relative dd-sunoVersion">
											<button
												type="button"
												onclick={() => { closeAllDropdowns(); sunoVersionOpen = !sunoVersionOpen; }}
												class="input-base w-full h-11 px-4 pr-10 text-left cursor-pointer flex items-center"
												aria-haspopup="listbox"
												aria-expanded={sunoVersionOpen}
												aria-controls="dropdown-sunoVersion"
											>
												<span class="flex-1 truncate">
													{versionObj?.label ?? sunoVersion}
													{#if versionObj?.tier}
														<span class="ml-1 px-1.5 py-0.5 rounded bg-brand-pink/15 text-brand-pink text-[10px] font-medium">{versionObj.tier}</span>
													{/if}
												</span>
												<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
													<ChevronDown size={12} class="text-text-muted" />
												</div>
											</button>
											{#if sunoVersionOpen}
												<ul id="dropdown-sunoVersion" role="listbox" class="absolute left-0 w-full mt-[6px] bg-surface-2 border border-border-subtle rounded-[6px] z-40 max-h-64 overflow-y-auto custom-list-scrollbar">
						{#each SUNO_VERSIONS as version}
														<li
															role="option"
															aria-selected={sunoVersion === version.value}
															tabindex="0"
															onclick={() => { sunoVersion = version.value; sunoVersionOpen = false; }}
															onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sunoVersion = version.value; sunoVersionOpen = false; } }}
															class="dropdown-item px-4 py-2.5 text-sm cursor-pointer transition-colors {sunoVersion === version.value ? 'bg-brand-pink text-white' : 'text-text-base hover:bg-hover-point hover:text-text-on-hover'}"
														>
															<span class="font-medium">{version.label}</span>
															{#if version.tier}
																<span class="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-white/20 text-inherit">{version.tier}</span>
															{/if}
														</li>
													{/each}
												</ul>
											{/if}
										</div>
									</div>
								</div>

								<!-- 보컬 + 가사모드 -->
								<div class="grid grid-cols-2 gap-4">
									<div>
										<span class="block text-sm font-medium text-text-strong mb-2">보컬 성별</span>
										<div class="inline-flex rounded-lg border border-border-subtle bg-surface-1 p-1 w-full">
											{#each VOCAL_GENDERS as g}
												<button
													type="button"
													onclick={() => (vocalGender = g.value)}
													class="flex-1 min-h-9 rounded-md px-3 text-sm transition-colors focus-visible:outline-none {vocalGender === g.value ? 'bg-brand-pink text-white' : 'text-text-base hover:bg-surface-2'}"
												>
													{g.label}
												</button>
											{/each}
										</div>
									</div>
									<div>
										<span class="block text-sm font-medium text-text-strong mb-2">가사 모드</span>
										<div class="inline-flex rounded-lg border border-border-subtle bg-surface-1 p-1 w-full">
											{#each LYRICS_MODES as lm}
												<button
													type="button"
													onclick={() => (lyricsMode = lm.value)}
													class="flex-1 min-h-9 rounded-md px-3 text-sm transition-colors focus-visible:outline-none {lyricsMode === lm.value ? 'bg-brand-pink text-white' : 'text-text-base hover:bg-surface-2'}"
												>
													{lm.label}
												</button>
						{/each}
										</div>
									</div>
				</div>

								<!-- 오디오 소스 -->
				<div>
									<span class="block text-sm font-medium text-text-strong mb-2">오디오 소스 <span class="text-xs text-text-muted font-normal">(선택)</span></span>
									<div class="flex gap-2">
										{#each AUDIO_SOURCE_TYPES as src}
											<button
												type="button"
												onclick={(e) => {
													const next = audioSourceType === src.value ? '' : src.value;
													audioSourceType = next;
													if (next === '') (e.currentTarget as HTMLElement).blur();
												}}
												class="btn-outline-hover flex-1 min-h-9 rounded-lg border border-border-subtle px-3 text-sm focus-visible:outline-none {audioSourceType === src.value ? '!bg-brand-pink/15 !text-brand-pink !border-brand-pink' : 'text-text-base'}"
											>
												+ {src.label}
											</button>
						{/each}
									</div>
									{#if audioSourceType}
										<input
											type="text"
											bind:value={audioSourceName}
											placeholder="{audioSourceType} 이름 또는 링크"
											class="input-base w-full h-11 px-4 mt-2"
										/>
									{/if}
								</div>
							</div>
						{/if}
				</div>

					<!-- 3. 프롬프트 & 가사 -->
					<div class="bg-surface-2 rounded-lg border border-border-subtle">
						<button
							type="button"
							onclick={() => toggleSection('prompt')}
							class="accordion-section-header flex w-full cursor-pointer items-center justify-between px-6 py-4 text-left bg-transparent rounded-t-lg focus-visible:outline-none"
							aria-expanded={openSections.has('prompt')}
							aria-controls="section-prompt"
						>
							<h3
								class="text-base font-semibold text-brand-pink flex items-center gap-2"
								role="presentation"
								onclick={(e) => { e.stopPropagation(); toggleSection('prompt'); }}
							>
								<PenLine size={16} class="text-brand-pink" />
								프롬프트 · 가사
							</h3>
							{#if openSections.has('prompt')}
								<ChevronUp size={14} class="text-text-muted" />
							{:else}
								<ChevronDown size={14} class="text-text-muted" />
							{/if}
						</button>
						{#if openSections.has('prompt')}
							<div id="section-prompt" class="border-t border-border-subtle p-6 space-y-5" transition:slide|local>
								{#if mode === 'Simple'}
									<p class="text-xs text-text-muted -mt-1">스타일만 입력하는 모드예요. Styles와 Exclude Styles만 사용합니다.</p>
								{/if}
								{#if mode === 'Custom'}
									<!-- 가사 입력 -->
				<div>
										<label for="lyrics" class="block text-sm font-medium text-text-strong mb-2">
											Lyrics
					</label>
										<textarea
											id="lyrics"
											bind:value={lyrics}
											placeholder="가사를 입력하거나 프롬프트를 작성하세요. 빈칸이면 인스트루멘탈로 생성됩니다."
											class="input-base w-full h-36 px-4 py-3 resize-none custom-list-scrollbar font-mono text-sm"
											spellcheck="true"
										></textarea>
									</div>
								{/if}

								<!-- Styles -->
								<div>
									<label for="styles" class="block text-sm font-medium text-text-strong mb-2">Styles</label>
					<textarea
						id="styles"
						bind:value={styles}
						placeholder="예: dreamy synth-pop, ethereal vocals, soft ballad"
										class="input-base w-full h-24 px-4 py-3 resize-none custom-list-scrollbar"
						spellcheck="true"
						lang="en"
										maxlength={MAX_PROMPT_LENGTH}
					></textarea>
									<div class="flex items-center justify-between mt-1.5">
										<p class="text-xs text-text-muted">쉼표로 구분하여 여러 스타일 입력</p>
										<p class="text-xs {styles.length > MAX_PROMPT_LENGTH ? 'text-red-400' : 'text-text-muted'}">{styles.length}/{MAX_PROMPT_LENGTH}</p>
									</div>
									{#if styles.length > MAX_PROMPT_LENGTH}
										<p class="text-xs text-red-400 mt-0.5">Styles는 {MAX_PROMPT_LENGTH}자 이하여야 합니다.</p>
									{/if}
				</div>

								<!-- Exclude Styles -->
				<div>
									<label for="excludeStyles" class="block text-sm font-medium text-text-strong mb-2">Exclude Styles</label>
					<textarea
						id="excludeStyles"
						bind:value={excludeStyles}
						placeholder="예: heavy metal, screaming, aggressive"
										class="input-base w-full h-20 px-4 py-3 resize-none custom-list-scrollbar"
						spellcheck="true"
						lang="en"
										maxlength={MAX_PROMPT_LENGTH}
					></textarea>
									<div class="flex items-center justify-between mt-1.5">
										<p class="text-xs text-text-muted">생성에서 제외할 스타일</p>
										<p class="text-xs {excludeStyles.length > MAX_PROMPT_LENGTH ? 'text-red-400' : 'text-text-muted'}">{excludeStyles.length}/{MAX_PROMPT_LENGTH}</p>
									</div>
									{#if excludeStyles.length > MAX_PROMPT_LENGTH}
										<p class="text-xs text-red-400 mt-0.5">Exclude Styles는 {MAX_PROMPT_LENGTH}자 이하여야 합니다.</p>
									{/if}
				</div>
			</div>
						{/if}
					</div>

					<!-- 4. 고급 옵션 -->
					<div class="bg-surface-2 rounded-lg border border-border-subtle">
						<button
							type="button"
							onclick={() => toggleSection('advanced')}
							class="accordion-section-header flex w-full cursor-pointer items-center justify-between px-6 py-4 text-left bg-transparent rounded-t-lg focus-visible:outline-none"
							aria-expanded={openSections.has('advanced')}
							aria-controls="section-advanced"
						>
							<h3
								class="text-base font-semibold text-brand-pink flex items-center gap-2"
								role="presentation"
								onclick={(e) => { e.stopPropagation(); toggleSection('advanced'); }}
							>
								<Sliders size={16} class="text-brand-pink" />
								Advanced Options
							</h3>
							{#if openSections.has('advanced')}
								<ChevronUp size={14} class="text-text-muted" />
							{:else}
								<ChevronDown size={14} class="text-text-muted" />
							{/if}
						</button>
						{#if openSections.has('advanced')}
							<div id="section-advanced" class="border-t border-border-subtle p-6 space-y-6" transition:slide|local>
								<!-- Weirdness -->
								<div role="group" aria-labelledby="advanced-weirdness-label">
									<div id="advanced-weirdness-label" class="flex items-center justify-between mb-3">
										<span class="text-sm font-medium text-text-strong">Weirdness</span>
										{#if editingSlider === 'weirdness'}
											<input
												type="number"
												min="0"
												max="100"
												bind:value={sliderInputValue}
												onblur={commitSliderEdit}
												onkeydown={(e) => { if (e.key === 'Enter') commitSliderEdit(); if (e.key === 'Escape') editingSlider = ''; }}
												class="slider-edit-weirdness w-16 h-7 px-2 text-sm text-right bg-surface-1 border border-brand-pink rounded-md text-text-base focus:outline-none"
											/>
										{:else}
											<button
												type="button"
												onclick={() => startSliderEdit('weirdness', weirdness)}
												class="text-sm text-text-base font-medium hover:text-hover-point transition-colors cursor-text tabular-nums"
											>{weirdness}%</button>
										{/if}
									</div>
									<input
										type="range"
										min="0"
										max="100"
										step="5"
										bind:value={weirdness}
										class="suno-advanced-slider w-full h-2 rounded-full appearance-none cursor-pointer"
										style="--slider-value: {weirdness}%"
										aria-label="Weirdness"
										aria-valuenow={weirdness}
										aria-valuemin={0}
										aria-valuemax={100}
									/>
								</div>

								<!-- Style Influence -->
								<div role="group" aria-labelledby="advanced-style-influence-label">
									<div id="advanced-style-influence-label" class="flex items-center justify-between mb-3">
										<span class="text-sm font-medium text-text-strong">Style Influence</span>
										{#if editingSlider === 'styleInfluence'}
											<input
												type="number"
												min="0"
												max="100"
												bind:value={sliderInputValue}
												onblur={commitSliderEdit}
												onkeydown={(e) => { if (e.key === 'Enter') commitSliderEdit(); if (e.key === 'Escape') editingSlider = ''; }}
												class="slider-edit-styleInfluence w-16 h-7 px-2 text-sm text-right bg-surface-1 border border-brand-pink rounded-md text-text-base focus:outline-none"
											/>
										{:else}
											<button
												type="button"
												onclick={() => startSliderEdit('styleInfluence', styleInfluence)}
												class="text-sm text-text-base font-medium hover:text-hover-point transition-colors cursor-text tabular-nums"
											>{styleInfluence}%</button>
										{/if}
									</div>
									<input
										type="range"
										min="0"
										max="100"
										step="5"
										bind:value={styleInfluence}
										class="suno-advanced-slider w-full h-2 rounded-full appearance-none cursor-pointer"
										style="--slider-value: {styleInfluence}%"
										aria-label="Style Influence"
										aria-valuenow={styleInfluence}
										aria-valuemin={0}
										aria-valuemax={100}
									/>
								</div>

								{#if audioSourceType}
									<!-- Audio Influence -->
									<div role="group" aria-labelledby="advanced-audio-influence-label">
										<div id="advanced-audio-influence-label" class="flex items-center justify-between mb-3">
											<span class="text-sm font-medium text-text-strong">Audio Influence</span>
											{#if editingSlider === 'audioInfluence'}
												<input
													type="number"
													min="0"
													max="100"
													bind:value={sliderInputValue}
													onblur={commitSliderEdit}
													onkeydown={(e) => { if (e.key === 'Enter') commitSliderEdit(); if (e.key === 'Escape') editingSlider = ''; }}
													class="slider-edit-audioInfluence w-16 h-7 px-2 text-sm text-right bg-surface-1 border border-brand-pink rounded-md text-text-base focus:outline-none"
												/>
											{:else}
												<button
													type="button"
													onclick={() => startSliderEdit('audioInfluence', audioInfluence)}
													class="text-sm text-text-base font-medium hover:text-hover-point transition-colors cursor-text tabular-nums"
												>{audioInfluence}%</button>
											{/if}
										</div>
										<input
											type="range"
											min="0"
											max="100"
											step="5"
											bind:value={audioInfluence}
											class="suno-advanced-slider w-full h-2 rounded-full appearance-none cursor-pointer"
											style="--slider-value: {audioInfluence}%"
											aria-label="Audio Influence"
											aria-valuenow={audioInfluence}
											aria-valuemin={0}
											aria-valuemax={100}
										/>
									</div>
								{/if}
							</div>
						{/if}
		</div>

					<!-- 5. 편집 & 스튜디오 메모 -->
					<div class="bg-surface-2 rounded-lg border border-border-subtle">
			<button
				type="button"
							onclick={() => toggleSection('post')}
							class="accordion-section-header flex w-full cursor-pointer items-center justify-between px-6 py-4 text-left bg-transparent rounded-t-lg focus-visible:outline-none"
							aria-expanded={openSections.has('post')}
							aria-controls="section-post"
						>
							<h3
								class="text-base font-semibold text-brand-pink flex items-center gap-2"
								role="presentation"
								onclick={(e) => { e.stopPropagation(); toggleSection('post'); }}
							>
								<Guitar size={16} class="text-brand-pink" />
								편집 & 스튜디오 계획
							</h3>
							{#if openSections.has('post')}
								<ChevronUp size={14} class="text-text-muted" />
							{:else}
								<ChevronDown size={14} class="text-text-muted" />
							{/if}
						</button>
						{#if openSections.has('post')}
							<div id="section-post" class="border-t border-border-subtle p-6 space-y-5" transition:slide|local>
								<p class="text-xs text-text-muted -mt-1">생성 후 Song Editor / Studio에서 진행할 작업을 미리 메모해 두세요.</p>

								<!-- 편집 메모 -->
								<div>
									<label for="editNotes" class="block text-sm font-medium text-text-strong mb-2">
										<span class="inline-flex items-center gap-1.5">Song Editor 메모</span>
									</label>
									<textarea
										id="editNotes"
										bind:value={editNotes}
										placeholder="예: 가사 수정, 멜로디 변경, 섹션 추가/교체, 확장, 속도 조절 등"
										class="input-base w-full h-20 px-4 py-3 resize-none custom-list-scrollbar"
									></textarea>
								</div>

								<!-- 스튜디오 메모 -->
								<div>
									<label for="studioNotes" class="block text-sm font-medium text-text-strong mb-2">
										<span class="inline-flex items-center gap-1.5">Studio 메모 <span class="px-1.5 py-0.5 rounded bg-brand-pink/15 text-brand-pink text-[10px] font-medium">Premier</span></span>
									</label>
									<textarea
										id="studioNotes"
										bind:value={studioNotes}
										placeholder="예: 악기 추가 (피아노, 기타), 악기 스타일 변경, Stems 추출, 트랙별 볼륨 조절 등"
										class="input-base w-full h-20 px-4 py-3 resize-none custom-list-scrollbar"
									></textarea>
								</div>

								<!-- 주요 기능 참고 -->
								<div class="grid grid-cols-2 gap-3 text-xs">
									<div class="bg-surface-1 rounded-lg border border-border-subtle p-3">
										<p class="font-medium text-text-strong mb-2">Song Editor</p>
										<ul class="space-y-1 text-text-muted">
											<li>· 가사/멜로디 변경</li>
											<li>· 섹션 추가·교체</li>
											<li>· 곡 확장 (Extend)</li>
											<li>· 커버·리마스터</li>
											<li>· 속도 조절</li>
											<li>· Crop / Fade</li>
										</ul>
									</div>
									<div class="bg-surface-1 rounded-lg border border-border-subtle p-3">
										<p class="font-medium text-text-strong mb-2">Studio <span class="text-brand-pink">(Premier)</span></p>
										<ul class="space-y-1 text-text-muted">
											<li>· 악기 추가·스타일 변경</li>
											<li>· 보컬/배킹 보컬 분리</li>
											<li>· Stems 추출</li>
											<li>· 트랙별 볼륨·팬</li>
											<li>· FX / 퍼커션 트랙</li>
											<li>· 제외 스타일 적용</li>
										</ul>
									</div>
								</div>
							</div>
						{/if}
					</div>

					<!-- 버튼 영역 (모바일: 세로·풀폭, sm 이상: 가로 정렬) -->
					<div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
						<a
							href="/suno/projects"
							class="btn-outline-hover min-h-11 px-6 py-2 text-sm font-medium text-text-base rounded-lg border border-border-subtle focus-visible:outline-none focus-visible:ring-offset-2 focus-visible:ring-offset-bg inline-flex items-center justify-center w-full sm:w-auto"
							onclick={(e) => { if (!confirmLeave()) e.preventDefault(); }}
						>
							취소
						</a>
			<button
				type="submit"
				disabled={!isValid || isSaving}
							class="page-header-primary-button min-h-11 px-6 py-2 text-sm font-medium rounded-lg focus-visible:outline-none disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 w-full sm:w-auto"
			>
				{#if isSaving}
								<span class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
					생성 중...
				{:else}
					<Save size={16} />
					프로젝트 생성
				{/if}
			</button>
					</div>
				</div>

				<!-- 오른쪽: 미리보기 + 제작 단계 -->
				<div class="space-y-4">
					<!-- 미리보기 (xl 이상에서만 sticky, 모바일·태블릿은 스크롤 흐름) -->
					<div class="bg-surface-2 rounded-lg border border-border-subtle h-fit xl:sticky xl:top-20">
						<div class="px-6 py-4 border-b border-border-subtle">
							<h3 class="text-base font-semibold text-brand-pink flex items-center gap-2">
								<Eye size={16} class="text-brand-pink" />
								미리보기
							</h3>
						</div>
						<div class="p-6 space-y-4">
							<!-- 커버 + 제목 -->
							<div class="flex items-center gap-3">
								{#if coverImagePreview}
									<div class="w-12 h-12 rounded-lg overflow-hidden border border-border-subtle flex-shrink-0">
										<img src={coverImagePreview} alt="커버" class="w-full h-full object-cover" />
									</div>
								{:else}
									<div class="w-12 h-12 rounded-lg border border-border-subtle bg-surface-2 flex items-center justify-center flex-shrink-0">
										<Music size={20} class="text-brand-pink" />
									</div>
								{/if}
								<div class="min-w-0">
									<p class="text-sm font-semibold text-text-strong truncate {title.trim() ? '' : 'text-text-muted italic'}">{previewTitle}</p>
									<p class="text-xs text-text-muted truncate">{previewDescription}</p>
								</div>
							</div>

							<div class="border-t border-border-subtle"></div>

							<!-- 설정 요약 -->
							<div class="space-y-2.5 text-xs">
								<div class="flex items-center justify-between">
									<span class="text-text-muted">모드</span>
									<span class="text-text-base font-medium">{mode}</span>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-text-muted">SUNO 버전</span>
									<span class="text-text-base font-medium">
										{versionObj?.label ?? sunoVersion}
										{#if versionObj?.tier}
											<span class="ml-1 px-1.5 py-0.5 rounded bg-brand-pink/15 text-brand-pink text-[10px]">{versionObj.tier}</span>
										{/if}
									</span>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-text-muted">생성 유형</span>
									<span class="text-text-base font-medium">{genTypeLabel}</span>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-text-muted">보컬</span>
									<span class="text-text-base font-medium">{vocalLabel}</span>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-text-muted">가사 모드</span>
									<span class="text-text-base font-medium">{lyricsMode}</span>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-text-muted">담당자</span>
									<span class="text-text-base font-medium">{createdBy}</span>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-text-muted">소속 앨범</span>
									<span class="text-text-base font-medium">{albumLabel}</span>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-text-muted">뮤직비디오</span>
									<span class="text-text-base font-medium">{planMusicVideo ? '제작 예정' : '–'}</span>
								</div>
								{#if audioSourceType}
									<div class="flex items-center justify-between">
										<span class="text-text-muted">소스</span>
										<span class="text-text-base font-medium">{audioSourceType}{audioSourceName ? `: ${audioSourceName}` : ''}</span>
									</div>
								{/if}
							</div>

							<!-- Styles 태그 -->
							{#if styles.trim()}
								<div class="border-t border-border-subtle pt-3">
									<p class="text-[10px] text-text-muted mb-1.5 uppercase tracking-wider">Styles</p>
									<div class="flex flex-wrap gap-1">
										{#each styles.split(',').map((s) => s.trim()).filter(Boolean) as tag}
											<span class="px-2 py-0.5 rounded-md bg-surface-1 border border-border-subtle text-[11px] text-text-base">{tag}</span>
										{/each}
									</div>
								</div>
							{/if}

							{#if excludeStyles.trim()}
								<div class="border-t border-border-subtle pt-3">
									<p class="text-[10px] text-text-muted mb-1.5 uppercase tracking-wider">Exclude</p>
									<div class="flex flex-wrap gap-1">
										{#each excludeStyles.split(',').map((s) => s.trim()).filter(Boolean) as tag}
											<span class="px-2 py-0.5 rounded-md bg-red-500/10 border border-red-500/20 text-[11px] text-red-400">{tag}</span>
										{/each}
									</div>
								</div>
							{/if}

							<!-- 슬라이더 요약 -->
							{#if openSections.has('advanced')}
								<div class="border-t border-border-subtle pt-3 space-y-1.5 text-xs">
									<div class="flex items-center justify-between">
										<span class="text-text-muted">Weirdness</span>
										<span class="text-text-base">{weirdness}%</span>
									</div>
									<div class="flex items-center justify-between">
										<span class="text-text-muted">Style Influence</span>
										<span class="text-text-base">{styleInfluence}%</span>
									</div>
									{#if audioSourceType}
										<div class="flex items-center justify-between">
											<span class="text-text-muted">Audio Influence</span>
											<span class="text-text-base">{audioInfluence}%</span>
										</div>
									{/if}
								</div>
							{/if}

							{#if templateName}
								<div class="border-t border-border-subtle pt-3">
									<div class="flex items-center gap-2">
										<Sparkles size={12} class="text-brand-pink" />
										<span class="text-xs text-text-muted">템플릿: <span class="text-text-base font-medium">{templateName}</span></span>
									</div>
								</div>
							{/if}
						</div>
					</div>

					<!-- 제작 단계 -->
					<div class="bg-surface-2 rounded-lg border border-border-subtle">
						<div class="px-6 py-4 border-b border-border-subtle">
							<h3 class="text-base font-semibold text-brand-pink flex items-center gap-2">
								<ListChecks size={16} class="text-brand-pink" />
								제작 단계 <span class="text-xs text-text-muted font-normal">(18단계)</span>
							</h3>
						</div>
						<div class="p-4 max-h-80 overflow-y-auto custom-list-scrollbar">
							<div class="space-y-1">
								{#each PRODUCTION_STAGES as stage, i}
									<div class="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-xs {i < 3 ? 'bg-surface-1' : ''}">
										{#if i < 3}
											<div class="w-4 h-4 rounded-full bg-brand-pink/20 flex items-center justify-center flex-shrink-0">
												<Check size={10} class="text-brand-pink" />
											</div>
											<span class="text-text-base">{stage.name}</span>
										{:else}
											<div class="w-4 h-4 rounded-full border border-border-subtle flex-shrink-0"></div>
											<span class="text-text-muted">{stage.name}</span>
										{/if}
										<span class="ml-auto text-[10px] text-text-muted">{stage.assignedTo}</span>
									</div>
								{/each}
							</div>
						</div>
					</div>
				</div>
		</div>
	</form>
	</SUNOTabs>
</div>
