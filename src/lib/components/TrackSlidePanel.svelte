<script lang="ts">
	import { X, Asterisk, Upload, Music, ChevronDown } from 'lucide-svelte';
	import { GENRES } from '$lib/constants/genres';
	import ArtistSelect from '$lib/components/ArtistSelect.svelte';
	import DatePicker from '$lib/components/DatePicker.svelte';

	// Props 타입 정의
	type TrackData = {
		id: string;
		title: string;
		artist?: string;
		genres?: string[];
		status?: string;
		release_date_kr?: string;
		release_date_global?: string;
		duration?: string;
		is_title?: boolean;
	} | null;

	type FormData = {
		title: string;
		artist: string;
		genres: string[];
		status: string;
		release_date_kr: string;
		release_date_global: string;
		is_title: boolean;
	};

	// Props
	interface Props {
		isOpen?: boolean;
		mode?: 'create' | 'edit';
		trackData?: TrackData;
		albumTitle?: string;
		albumArtist?: string;
		onSave?: (data: FormData & { id: string }) => void;
		onClose?: () => void;
	}

	let {
		isOpen = false,
		mode = 'create',
		trackData = null,
		albumTitle = '',
		albumArtist = '',
		onSave = () => {},
		onClose = () => {}
	}: Props = $props();

	// 현재 날짜
	const today = new Date().toISOString().split('T')[0];

	// 폼 상태
	let formData = $state({
		title: '',
		artist: '',
		genres: [] as string[],
		status: 'draft',
		release_date_kr: today,
		release_date_global: today,
		is_title: false
	});

	// 음원 파일 업로드 상태
	let audioFile = $state<File | null>(null);
	let audioFileUrl = $state<string | null>(null);
	let isDraggingAudio = $state(false);
	let audioFileInput: HTMLInputElement;

	// 드롭다운 상태
	let statusDropdownOpen = $state(false);
	let genreDropdownOpen = $state(false);

	// 검증 상태
	let validationErrors = $state<Record<string, string>>({});
	let isSubmitting = $state(false);

	// 선택 가능한 장르 목록
	const availableGenres = $derived(GENRES.filter(genre => !formData.genres.includes(genre)));

	// 패널 열릴 때 데이터 초기화 및 배경 스크롤 차단
	$effect(() => {
		if (isOpen) {
			// 배경 스크롤 차단
			document.body.style.overflow = 'hidden';
			
			if (mode === 'edit' && trackData) {
				formData = {
					title: trackData.title || '',
					artist: trackData.artist || albumArtist,
					genres: trackData.genres || [],
					status: trackData.status || 'draft',
					release_date_kr: trackData.release_date_kr || today,
					release_date_global: trackData.release_date_global || today,
					is_title: trackData.is_title || false
				};
			} else {
				// 생성 모드: 앨범 아티스트로 기본 설정
				formData = {
					title: '',
					artist: albumArtist,
					genres: [],
					status: 'draft',
					release_date_kr: today,
					release_date_global: today,
					is_title: false
				};
			}
			validationErrors = {};
			audioFile = null;
			audioFileUrl = null;
		} else {
			// 패널 닫힐 때 배경 스크롤 복원
			document.body.style.overflow = '';
		}
		
		// cleanup: 컴포넌트 언마운트 시 스크롤 복원
		return () => {
			document.body.style.overflow = '';
		};
	});

	// ESC 키로 닫기
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && isOpen) {
			onClose();
		}
	}

	// 장르 추가/제거
	function addGenre(genre: string) {
		if (!formData.genres.includes(genre)) {
			formData.genres = [...formData.genres, genre];
		}
		genreDropdownOpen = false;
	}

	function removeGenre(genre: string) {
		formData.genres = formData.genres.filter(g => g !== genre);
	}

	// 음원 파일 처리
	function handleAudioFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file && file.type.startsWith('audio/')) {
			audioFile = file;
			audioFileUrl = URL.createObjectURL(file);
		}
	}

	function handleAudioDrop(event: DragEvent) {
		event.preventDefault();
		isDraggingAudio = false;
		const file = event.dataTransfer?.files[0];
		if (file && file.type.startsWith('audio/')) {
			audioFile = file;
			audioFileUrl = URL.createObjectURL(file);
		}
	}

	function removeAudioFile() {
		if (audioFileUrl) {
			URL.revokeObjectURL(audioFileUrl);
		}
		audioFile = null;
		audioFileUrl = null;
	}

	// 폼 검증
	function validate(): boolean {
		const errors: Record<string, string> = {};
		
		if (!formData.title.trim()) {
			errors.title = '트랙 제목을 입력해주세요';
		}
		if (!formData.artist.trim()) {
			errors.artist = '아티스트를 선택해주세요';
		}

		validationErrors = errors;
		return Object.keys(errors).length === 0;
	}

	// 저장
	function handleSave() {
		if (!validate()) return;
		
		isSubmitting = true;
		
		const id = mode === 'edit' && trackData?.id 
			? trackData.id 
			: `track_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
		
		onSave({
			id,
			...formData
		});
		
		isSubmitting = false;
	}

	// 상태 옵션
	const statusOptions = [
		{ value: 'draft', label: '초안' },
		{ value: 'in_progress', label: '작업 중' },
		{ value: 'review', label: '검토 중' },
		{ value: 'approved', label: '승인됨' },
		{ value: 'released', label: '발매됨' }
	];

	function getStatusLabel(value: string) {
		return statusOptions.find(o => o.value === value)?.label || value;
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- 오버레이 + 패널 -->
{#if isOpen}
	<!-- 배경 오버레이 -->
	<div 
		class="fixed inset-0 bg-black/50 z-[100] slide-panel-overlay"
		onclick={onClose}
		role="button"
		tabindex="-1"
		aria-label="패널 닫기"
	></div>

	<!-- 슬라이드 패널 -->
	<aside 
		class="fixed top-0 right-0 h-full w-full max-w-lg bg-surface-1 border-l border-border-subtle z-[101] slide-panel-enter overflow-hidden flex flex-col"
		role="dialog"
		aria-modal="true"
		aria-labelledby="panel-title"
	>
		<!-- 헤더 -->
		<header class="flex items-center justify-between px-6 py-4 border-b border-border-subtle flex-shrink-0">
			<h2 id="panel-title" class="text-lg font-semibold text-text-strong">
				{mode === 'create' ? '새 트랙 생성' : '트랙 수정'}
			</h2>
			<button
				type="button"
				onclick={onClose}
				class="btn-icon"
				aria-label="닫기"
			>
				<X size={20} />
			</button>
		</header>

		<!-- 앨범 정보 배너 (호버 효과 없음) -->
		<div class="px-6 py-3 bg-surface-2 flex-shrink-0 pointer-events-none select-none">
			<p class="text-sm text-text-muted">
				앨범: <span class="text-text-base font-medium">{albumTitle || '(미지정)'}</span>
			</p>
		</div>

		<!-- 폼 본문 (스크롤 가능, 캘린더 팝업을 위해 overflow-x는 visible) -->
		<div class="flex-1 overflow-y-auto overflow-x-visible custom-list-scrollbar" style="scrollbar-gutter: stable;">
			<form onsubmit={(e) => { e.preventDefault(); handleSave(); }} class="p-6 space-y-5">
				
				<!-- 트랙 제목 -->
				<div>
					<label for="track-title" class="block text-sm font-medium text-text-strong mb-2">
						트랙 제목 <Asterisk size={12} class="inline text-brand-pink ml-0" />
					</label>
					<div class="relative">
						<input
							type="text"
							id="track-title"
							bind:value={formData.title}
							class="input-base w-full h-10 px-4 {formData.title.trim() ? 'pr-10' : ''} {validationErrors.title ? 'border-danger-fg' : ''}"
							placeholder="트랙 제목을 입력하세요"
						/>
						{#if formData.title.trim()}
							<button
								type="button"
								class="btn-icon absolute right-3 top-1/2 -translate-y-1/2"
								onclick={() => formData.title = ''}
								aria-label="지우기"
							>
								<X size={16} />
							</button>
						{/if}
					</div>
					{#if validationErrors.title}
						<p class="mt-1.5 text-sm text-danger-fg">{validationErrors.title}</p>
					{/if}
				</div>

				<!-- 타이틀 곡 체크박스 -->
				<div class="flex items-center gap-3">
					<label class="relative flex items-center cursor-pointer" for="is-title-track">
						<input
							type="checkbox"
							id="is-title-track"
							bind:checked={formData.is_title}
							class="title-track-checkbox w-4 h-4 rounded appearance-none bg-transparent border border-[color:var(--text-base)] 
								checked:bg-transparent checked:border-[color:var(--brand-pink)]
								transition-all duration-200 cursor-pointer relative"
						/>
						<span class="ml-2 text-sm text-text-base">타이틀 곡으로 설정</span>
					</label>
				</div>

				<!-- 아티스트 -->
				<div class="w-full">
					<label for="track-artist" class="block text-sm font-medium text-text-strong mb-2">
						아티스트 <Asterisk size={12} class="inline text-brand-pink ml-0" />
					</label>
					<ArtistSelect
						value={formData.artist}
						onChange={(value) => {
							formData.artist = value;
							if (validationErrors.artist && value.trim()) {
								delete validationErrors.artist;
								validationErrors = { ...validationErrors };
							}
						}}
						required
						placeholder="아티스트를 선택하거나 입력하세요"
						allowCustom={true}
					/>
					{#if validationErrors.artist}
						<p class="mt-1.5 text-sm text-danger-fg">{validationErrors.artist}</p>
					{/if}
				</div>

				<!-- 장르 -->
				<div class="w-full">
					<label for="track-genres" class="block text-sm font-medium text-text-strong mb-2">장르</label>
					<div class="relative w-full genre-dropdown">
						<div
							id="track-genres"
							onclick={() => genreDropdownOpen = !genreDropdownOpen}
							onkeydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									genreDropdownOpen = !genreDropdownOpen;
								}
							}}
							class="w-full min-h-10 px-4 pr-[2.625rem] py-0 bg-surface-2 border border-border-subtle rounded-lg text-base text-text-base transition-colors duration-200 flex flex-wrap gap-2 items-center cursor-pointer focus-within:outline-none focus-within:ring-0"
							role="button"
							aria-haspopup="listbox"
							aria-expanded={genreDropdownOpen}
							tabindex="0"
						>
							{#if formData.genres.length === 0}
								<span class="text-text-muted">장르를 선택하세요</span>
							{:else}
								{#each formData.genres as genre}
									<span class="tag-chip">
										{genre}
										<button
											type="button"
											onclick={(e) => {
												e.stopPropagation();
												removeGenre(genre);
											}}
											class="btn-icon ml-1 focus:outline-none"
											aria-label="{genre} 제거"
										>
											<X size={12} />
										</button>
									</span>
								{/each}
							{/if}
						</div>
						<div class="pointer-events-none absolute top-3 right-2.5 flex items-center">
							<span class="flex h-4 w-4 items-center justify-center">
								<ChevronDown size={16} class="lucide-icon text-text-muted transition-colors duration-200" />
							</span>
						</div>
						{#if genreDropdownOpen}
							<ul role="listbox" class="absolute left-0 w-full mt-[6px] bg-surface-1 border border-border-subtle rounded-[6px] z-10 max-h-60 custom-list-scrollbar">
								{#if availableGenres.length === 0}
									<li class="px-4 py-2 text-base text-text-muted text-center">모든 장르가 선택되었습니다</li>
								{:else}
									{#each availableGenres as genre}
										<li
											role="option"
											aria-selected="false"
											tabindex="0"
											onclick={() => addGenre(genre)}
											onkeydown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault();
													addGenre(genre);
												}
											}}
											class="px-4 py-2 text-base text-text-base bg-transparent transition-colors duration-200 cursor-pointer genre-dropdown-item focus:!bg-brand-pink focus:!text-white focus:outline-none"
										>
											{genre}
										</li>
									{/each}
								{/if}
							</ul>
						{/if}
					</div>
				</div>

				<!-- 상태 -->
				<div class="w-full">
					<label for="track-status" class="block text-sm font-medium text-text-strong mb-2">상태</label>
					<div class="relative w-full status-dropdown" data-open={statusDropdownOpen}>
						<input type="hidden" name="status" value={formData.status} />
						<button
							type="button"
							id="track-status"
							class="w-full h-10 px-4 pr-[2.625rem] bg-surface-2 border border-border-subtle rounded-lg text-base text-text-base text-left focus:outline-none focus:border-brand-pink focus:ring-0 transition-colors duration-200"
							onclick={() => statusDropdownOpen = !statusDropdownOpen}
							onkeydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									statusDropdownOpen = !statusDropdownOpen;
								}
							}}
							aria-haspopup="listbox"
							aria-expanded={statusDropdownOpen}
							tabindex="0"
						>
							<span class="block truncate">{getStatusLabel(formData.status)}</span>
						</button>
						<!-- 오른쪽 아이콘 래퍼: 통일된 패턴 -->
						<div class="pointer-events-none absolute inset-y-0 right-2.5 flex items-center">
							<span class="flex h-4 w-4 items-center justify-center">
								<ChevronDown size={16} class="lucide-icon text-text-muted transition-colors duration-200" />
							</span>
						</div>
						{#if statusDropdownOpen}
							<ul role="listbox" class="absolute left-0 w-full mt-[6px] bg-surface-1 border rounded-[6px] z-10 border-border-subtle max-h-60 overflow-y-auto custom-list-scrollbar">
								{#each statusOptions as option}
									<li
										role="option"
										aria-selected={formData.status === option.value}
										tabindex="0"
										onclick={() => { formData.status = option.value; statusDropdownOpen = false; }}
										onkeydown={(e) => {
											if (e.key === 'Enter' || e.key === ' ') {
												e.preventDefault();
												formData.status = option.value;
												statusDropdownOpen = false;
											}
										}}
										class="px-4 py-2 text-base text-text-base hover:bg-surface-2 cursor-pointer {formData.status === option.value ? 'bg-brand-pink text-white' : ''}"
									>
										{option.label}
									</li>
								{/each}
							</ul>
						{/if}
					</div>
				</div>

				<!-- 발매일 -->
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium text-text-strong mb-2">국내 발매일</label>
						<DatePicker
							value={formData.release_date_kr}
							onChange={(value: string) => formData.release_date_kr = value}
							align="left"
						/>
					</div>
					<div>
						<label class="block text-sm font-medium text-text-strong mb-2">해외 발매일</label>
						<DatePicker
							value={formData.release_date_global}
							onChange={(value: string) => formData.release_date_global = value}
							align="right"
						/>
					</div>
				</div>

				<!-- 음원 파일 업로드 -->
				<div>
					<label class="block text-sm font-medium text-text-strong mb-2">음원 파일</label>
					
					{#if audioFile}
						<!-- 업로드된 파일 표시 -->
						<div class="flex items-center gap-3 p-3 bg-surface-2 rounded-lg">
							<div class="w-10 h-10 bg-brand-pink/10 rounded-lg flex items-center justify-center">
								<Music size={20} class="text-brand-pink" />
							</div>
							<div class="flex-1 min-w-0">
								<p class="text-sm text-text-base truncate">{audioFile.name}</p>
								<p class="text-xs text-text-muted">{(audioFile.size / 1024 / 1024).toFixed(2)} MB</p>
							</div>
							<button
								type="button"
								onclick={removeAudioFile}
								class="btn-icon"
								aria-label="파일 제거"
							>
								<X size={16} />
							</button>
						</div>
					{:else}
						<!-- 업로드 영역 -->
						<div
							class="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors {isDraggingAudio ? 'border-brand-pink bg-brand-pink/5' : 'border-border-subtle hover:border-hover-point'}"
							ondragover={(e) => { e.preventDefault(); isDraggingAudio = true; }}
							ondragleave={() => isDraggingAudio = false}
							ondrop={handleAudioDrop}
							onclick={() => audioFileInput?.click()}
							role="button"
							tabindex="0"
							onkeydown={(e) => e.key === 'Enter' && audioFileInput?.click()}
						>
							<Upload size={24} class="mx-auto text-text-muted mb-2" />
							<p class="text-sm text-text-muted">
								클릭하거나 파일을 드래그하세요
							</p>
							<p class="text-xs text-text-muted mt-1">MP3, WAV, FLAC</p>
						</div>
						<input
							type="file"
							accept="audio/*"
							bind:this={audioFileInput}
							onchange={handleAudioFileSelect}
							class="hidden"
						/>
					{/if}
				</div>

			</form>
		</div>

		<!-- 푸터 버튼 -->
		<footer class="slide-panel-footer flex items-center justify-end gap-3 px-6 py-4 border-t border-border-subtle bg-surface-1 flex-shrink-0">
			<button
				type="button"
				onclick={onClose}
				class="cancel-button px-6 py-2 bg-surface-2 text-text-base rounded-lg border border-border-subtle transition-colors duration-200 font-medium"
			>
				취소
			</button>
			<button
				type="button"
				onclick={handleSave}
				disabled={isSubmitting}
				class="px-6 py-2 bg-brand-pink text-white rounded-lg focus:outline-none focus:ring-0 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{isSubmitting ? '저장 중...' : (mode === 'create' ? '트랙 추가' : '저장')}
			</button>
		</footer>
	</aside>
{/if}
