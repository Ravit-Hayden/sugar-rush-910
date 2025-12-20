<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import { Asterisk, ChevronUp, ChevronDown, ChevronDown as ChevronDownIcon, X, Image } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';
	import DatePicker from '$lib/components/DatePicker.svelte';
	import { GENRES } from '$lib/constants/genres';
	
	let { data }: { data: PageData } = $props();

	// 샘플 데이터 (실제로는 API에서 가져올 데이터)
	const albums = [
		{
			id: '1',
			title: 'Sugar Rush Vol.1',
			artist: 'Sugar Rush',
			year: 2024,
			status: 'published',
			tracks: 12,
			duration: '45:30',
			cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
			plays: 1250,
			likes: 89,
			created_at: '2024-09-15',
			release_date_kr: '2024-09-20',
			release_date_global: '2024-09-25',
			trackList: [
				{ id: '1', title: 'Sugar Rush', duration: '3:45' },
				{ id: '2', title: 'Sweet Dreams', duration: '4:12' },
				{ id: '3', title: 'Candy Land', duration: '3:58' },
				{ id: '4', title: 'Honey Moon', duration: '4:30' },
				{ id: '5', title: 'Sugar High', duration: '3:20' },
				{ id: '6', title: 'Sweet Escape', duration: '4:05' },
				{ id: '7', title: 'Candy Shop', duration: '3:50' },
				{ id: '8', title: 'Sugar Coated', duration: '4:15' },
				{ id: '9', title: 'Sweet Surprise', duration: '3:35' },
				{ id: '10', title: 'Candy Floss', duration: '4:00' },
				{ id: '11', title: 'Sugar Spice', duration: '3:42' },
				{ id: '12', title: 'Sweet Victory', duration: '4:18' }
			]
		},
		{
			id: '2',
			title: 'Summer Night',
			artist: 'Sugar Rush',
			year: 2024,
			status: 'draft',
			tracks: 1,
			duration: '3:45',
			cover: '/api/placeholder/300/300',
			plays: 890,
			likes: 45,
			created_at: '2024-09-20',
			release_date_kr: '',
			release_date_global: '',
			trackList: [
				{ id: '1', title: 'Summer Night', duration: '3:45' }
			]
		},
		{
			id: '3',
			title: 'Demo Collection',
			artist: 'Various',
			year: 2024,
			status: 'archived',
			tracks: 8,
			duration: '28:15',
			cover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop',
			plays: 456,
			likes: 23,
			created_at: '2024-08-10',
			release_date_kr: '',
			release_date_global: '',
			trackList: [
				{ id: '1', title: 'Demo Track 1', duration: '3:30' },
				{ id: '2', title: 'Demo Track 2', duration: '3:45' },
				{ id: '3', title: 'Demo Track 3', duration: '3:20' },
				{ id: '4', title: 'Demo Track 4', duration: '4:00' },
				{ id: '5', title: 'Demo Track 5', duration: '3:15' },
				{ id: '6', title: 'Demo Track 6', duration: '3:50' },
				{ id: '7', title: 'Demo Track 7', duration: '3:25' },
				{ id: '8', title: 'Demo Track 8', duration: '3:10' }
			]
		}
	];

	let albumId = $derived(data.albumId || $page.params.id || '');
	let album = $derived(albums.find(a => a.id === albumId));

	// 폼 상태 (ISO 형식으로 저장)
	let formData = $state({
		title: '',
		artist: '',
		status: 'draft',
		genres: [] as string[],
		release_date_kr: '' as string, // ISO YYYY-MM-DD
		release_date_global: '' as string // ISO YYYY-MM-DD
	});

	// 현재 날짜 정보
	const currentDate = new Date();
	const currentYear = currentDate.getFullYear();

	// 발매일에서 연도 자동 계산
	const releaseYear = $derived.by(() => {
		// 국내 발매일이 있으면 해당 연도 사용
		if (formData.release_date_kr) {
			const date = new Date(formData.release_date_kr);
			if (!isNaN(date.getTime())) {
				return date.getFullYear();
			}
		}
		// 국내 발매일이 없고 해외 발매일이 있으면 해외 발매일의 연도 사용
		if (formData.release_date_global) {
			const date = new Date(formData.release_date_global);
			if (!isNaN(date.getTime())) {
				return date.getFullYear();
			}
		}
		// 둘 다 없으면 현재 연도 사용
		return currentYear;
	});

	// 이미지 업로드 상태
	let imageFile = $state<File | null>(null);
	let previewUrl = $state<string>('');
	let fileInput: HTMLInputElement;
	let isDragging = $state(false);

	// 상태 드롭다운 열림 상태
	let statusDropdownOpen = $state(false);
	let genreDropdownOpen = $state(false);

		// 앨범 데이터가 변경되면 폼 데이터 업데이트
		$effect(() => {
			if (album) {
				formData.title = album.title;
				formData.artist = album.artist;
				formData.status = album.status;
				formData.genres = (album as any).genres || [];
				formData.release_date_kr = album.release_date_kr || '';
				formData.release_date_global = album.release_date_global || '';
			// 기존 앨범 커버 이미지가 있으면 미리보기 URL 설정
			if (album.cover && album.cover !== '/api/placeholder/300/300' && !previewUrl) {
				previewUrl = album.cover;
			}
		}
	});

	// 선택 가능한 장르 목록 (선택된 장르 제외)
	const availableGenres = $derived(GENRES.filter(genre => !formData.genres.includes(genre)));

	// 장르 추가
	function addGenre(genre: string) {
		if (!formData.genres.includes(genre)) {
			formData.genres = [...formData.genres, genre];
		}
		genreDropdownOpen = false;
	}

	// 장르 제거
	function removeGenre(genre: string) {
		formData.genres = formData.genres.filter(g => g !== genre);
	}

	function toggleGenreDropdown() {
		genreDropdownOpen = !genreDropdownOpen;
	}

	const statusOptions = [
		{ value: 'draft', label: '초안' },
		{ value: 'editing', label: '편집 중' },
		{ value: 'revision_requested', label: '수정 요청' },
		{ value: 'pending_review', label: '검토 대기' },
		{ value: 'under_review', label: '검토 중' },
		{ value: 'editing_complete', label: '편집 완료' },
		{ value: 'approved', label: '승인됨' },
		{ value: 'scheduled', label: '예정됨' },
		{ value: 'published', label: '발매됨' },
		{ value: 'paused', label: '일시정지' },
		{ value: 'archived', label: '보관됨' },
		{ value: 'deleted', label: '삭제됨' }
	];

	const statusLabel = $derived(statusOptions.find(o => o.value === formData.status)?.label || '선택하세요');


	function handleSubmit() {
		// 실제 저장 로직 구현 예정
		// 저장 후 상세 페이지로 이동
		goto(`/albums/${albumId}`);
	}

	function handleCancel(event: MouseEvent) {
		const button = event.currentTarget as HTMLButtonElement;
		if (confirm('변경사항을 저장하지 않고 나가시겠습니까?')) {
			goto(`/albums/${albumId}`);
		} else {
			// confirm에서 취소를 선택한 경우 포커스 해제
			button.blur();
		}
	}

	function toggleStatusDropdown() {
		statusDropdownOpen = !statusDropdownOpen;
	}

	function selectStatusOption(value: string) {
		formData.status = value;
		statusDropdownOpen = false;
	}

	// 파일 처리 공통 함수
	function processFile(file: File) {
		if (file && file.type.startsWith('image/')) {
			imageFile = file;
			// 기존 미리보기 URL 해제
			if (previewUrl && previewUrl.startsWith('blob:')) {
				URL.revokeObjectURL(previewUrl);
			}
			previewUrl = URL.createObjectURL(file);
		}
	}

	// 이미지 선택 핸들러
	function handleImageSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			processFile(file);
		}
	}

	// 이미지 업로드 영역 클릭 핸들러
	function handleImageAreaClick() {
		fileInput?.click();
	}

	// 드래그 앤 드롭 핸들러
	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		isDragging = true;
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		isDragging = false;
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		isDragging = false;

		const files = event.dataTransfer?.files;
		if (files && files.length > 0) {
			const file = files[0];
			processFile(file);
		}
	}

	// 외부 클릭 및 Escape 키 처리
	$effect(() => {
		function handleClickOutside(e: MouseEvent) {
			const target = e.target as HTMLElement;
			if (!target.closest('.status-dropdown')) {
				statusDropdownOpen = false;
			}
			if (!target.closest('.genre-dropdown')) {
				genreDropdownOpen = false;
			}
		}

		function handleEscape(e: KeyboardEvent) {
			if (e.key === 'Escape') {
				if (statusDropdownOpen) statusDropdownOpen = false;
				if (genreDropdownOpen) genreDropdownOpen = false;
			}
		}

		if (statusDropdownOpen || genreDropdownOpen) {
			document.addEventListener('click', handleClickOutside);
			document.addEventListener('keydown', handleEscape);
		}

		return () => {
			document.removeEventListener('click', handleClickOutside);
			document.removeEventListener('keydown', handleEscape);
		};
	});

	// 컴포넌트 언마운트 시 미리보기 URL 정리
	$effect(() => {
		return () => {
			if (previewUrl && previewUrl.startsWith('blob:')) {
				URL.revokeObjectURL(previewUrl);
			}
		};
	});
</script>

{#if !album}
	<PageContent>
		<PageHeader 
			title="앨범을 찾을 수 없습니다" 
			description="요청하신 앨범이 존재하지 않습니다."
		/>
		<div class="text-center py-12">
			<p class="text-text-muted mb-4">앨범 ID: {albumId}</p>
			<button 
				onclick={() => goto('/albums')}
				class="inline-flex items-center justify-center gap-2 px-4 py-2 w-full sm:w-auto bg-brand-pink text-white rounded-lg hover:bg-brand-pink/90 transition-colors duration-200 font-medium"
			>
				앨범 목록으로 돌아가기
			</button>
		</div>
	</PageContent>
{:else}
	<PageContent>
		<PageHeader 
			title="앨범 편집"
			description={album.title}
		/>

		<!-- 편집 폼 -->
		<div class="bg-surface-1 rounded-lg border border-border-subtle p-6">
			<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
				<!-- 좌우 배치 컨테이너 -->
				<div class="flex flex-col lg:flex-row gap-10">
					<!-- [좌측] 이미지 업로드 영역 -->
					<div class="w-full lg:w-80 flex-shrink-0">
						<div
							onclick={handleImageAreaClick}
							ondragover={handleDragOver}
							ondragleave={handleDragLeave}
							ondrop={handleDrop}
							class="upload-zone w-full aspect-square bg-surface-1 rounded-xl border-2 cursor-pointer flex items-center justify-center overflow-hidden {isDragging ? 'border-brand-pink bg-surface-2/50' : ''}"
							data-dragging={isDragging}
							role="button"
							tabindex="0"
							onkeydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									handleImageAreaClick();
								}
							}}
							aria-label="앨범 커버 업로드"
						>
							<input
								type="file"
								accept="image/*"
								class="hidden"
								bind:this={fileInput}
								onchange={handleImageSelect}
							/>
							{#if previewUrl}
								<img
									src={previewUrl}
									alt="앨범 커버 미리보기"
									class="w-full h-full object-cover rounded-xl"
								/>
							{:else}
								<div class="flex flex-col items-center justify-center gap-3 text-text-muted">
									<Image size={48} class="lucide-icon" />
									<span class="text-sm font-medium">커버 업로드</span>
								</div>
							{/if}
						</div>
					</div>

					<!-- [우측] 입력 필드 영역 -->
					<div class="flex-1 space-y-6">
				<!-- 기본 정보 -->
				<div class="space-y-4">
					<h3 class="text-lg font-semibold text-text-strong mb-4">기본 정보</h3>
					
					<!-- 앨범 제목 -->
					<div class="w-full">
						<label for="title" class="block text-sm font-medium text-text-strong mb-2">
							앨범 제목 <Asterisk size={12} class="inline text-brand-pink ml-0" />
						</label>
						<input
							type="text"
							id="title"
							name="title"
							bind:value={formData.title}
							required
							class="w-full h-10 px-4 bg-surface-2 border border-border-subtle rounded-lg text-text-base focus:outline-none focus:border-brand-pink focus:ring-0 transition-colors duration-200"
							placeholder="앨범 제목을 입력하세요"
						/>
					</div>

					<!-- 아티스트 -->
					<div class="w-full">
						<label for="artist" class="block text-sm font-medium text-text-strong mb-2">
							아티스트 <Asterisk size={12} class="inline text-brand-pink ml-0" />
						</label>
						<input
							type="text"
							id="artist"
							name="artist"
							bind:value={formData.artist}
							required
							class="w-full h-10 px-4 bg-surface-2 border border-border-subtle rounded-lg text-text-base focus:outline-none focus:border-brand-pink focus:ring-0 transition-colors duration-200"
							placeholder="아티스트 이름을 입력하세요"
						/>
					</div>

					<!-- 장르 -->
					<div class="w-full">
						<label for="genres" class="block text-sm font-medium text-text-strong mb-2">
							장르
						</label>
						<div class="relative w-full genre-dropdown">
							<div
								id="genres"
								onclick={toggleGenreDropdown}
								onkeydown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault();
										toggleGenreDropdown();
									}
								}}
								class="w-full min-h-10 px-4 pr-10 py-1.5 bg-surface-2 border border-border-subtle rounded-lg text-text-base transition-colors duration-200 flex flex-wrap gap-2 items-center cursor-pointer hover:border-[var(--hover-cyan)] hover:text-[var(--hover-cyan)] focus-within:border-brand-pink focus-within:text-brand-pink focus-within:outline-none focus-within:ring-0"
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
							<div class="pointer-events-none absolute top-3 right-3 flex items-center">
								<ChevronDownIcon size={16} class="lucide-icon text-text-muted transition-colors duration-200" />
							</div>
							{#if genreDropdownOpen}
								<ul role="listbox" class="absolute left-0 w-full mt-[6px] bg-surface-1 border rounded-[6px] z-10 border-border-subtle max-h-60 overflow-y-auto">
									{#if availableGenres.length === 0}
										<li class="px-4 py-2 text-sm text-text-muted text-center">모든 장르가 선택되었습니다</li>
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
												class="px-4 py-2 text-sm text-text-base bg-transparent transition-colors duration-200 cursor-pointer genre-dropdown-item focus:!bg-brand-pink focus:!text-white focus:outline-none"
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
						<label for="status" class="block text-sm font-medium text-text-strong mb-2">
							상태 <Asterisk size={12} class="inline text-brand-pink ml-0" />
						</label>
						<div class="relative w-full status-dropdown" data-open={statusDropdownOpen}>
							<button
								type="button"
								id="status"
								name="status"
								class="w-full h-10 px-4 pr-[2.625rem] bg-surface-2 border border-border-subtle rounded-lg text-text-base text-left focus:outline-none focus:border-brand-pink focus:ring-0 transition-colors duration-200"
								onclick={toggleStatusDropdown}
								onkeydown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault();
										toggleStatusDropdown();
									}
								}}
								aria-haspopup="listbox"
								aria-expanded={statusDropdownOpen}
								tabindex="0"
							>
								<span class="block truncate">{statusLabel}</span>
							</button>
							<!-- 오른쪽 아이콘 래퍼: 통일된 패턴 -->
							<div class="pointer-events-none absolute inset-y-0 right-2.5 flex items-center">
								<span class="flex h-4 w-4 items-center justify-center">
									<ChevronDownIcon size={16} class="lucide-icon text-text-muted transition-colors duration-200" />
								</span>
							</div>
							{#if statusDropdownOpen}
								<ul role="listbox" class="absolute left-0 w-full mt-[6px] bg-surface-1 border rounded-[6px] z-10 border-border-subtle max-h-60 overflow-y-auto">
									{#each statusOptions as option}
										<li
											role="option"
											aria-selected={formData.status === option.value}
											tabindex="0"
											onclick={() => selectStatusOption(option.value)}
											onkeydown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault();
													selectStatusOption(option.value);
												}
											}}
											class="px-4 py-2 text-sm text-text-base hover:bg-surface-2 cursor-pointer {formData.status === option.value ? 'bg-brand-pink text-white' : ''}"
										>
											{option.label}
										</li>
									{/each}
								</ul>
							{/if}
						</div>
					</div>
				</div>

				<!-- 발매일 정보 -->
						<div class="-mx-4 sm:-mx-6 lg:-mx-8 pt-6 border-t border-border-subtle px-4 sm:px-6 lg:px-8">
					<div class="space-y-4">
					<h3 class="text-lg font-semibold text-text-strong mb-4">발매일 정보</h3>
					
					<!-- 국내 발매일 -->
					<div class="w-full">
						<label for="release_date_kr" class="block text-sm font-medium text-text-strong mb-2">국내 발매일</label>
						<DatePicker id="release_date_kr" bind:value={formData.release_date_kr} />
					</div>

					<!-- 해외 발매일 -->
					<div class="w-full">
						<label for="release_date_global" class="block text-sm font-medium text-text-strong mb-2">해외 발매일</label>
							<DatePicker id="release_date_global" name="release_date_global" bind:value={formData.release_date_global} />
						</div>
					</div>
				</div>

				<!-- 액션 버튼 -->
						<div class="-mx-4 sm:-mx-6 lg:-mx-8 flex items-center justify-end gap-3 pt-6 border-t border-border-subtle px-4 sm:px-6 lg:px-8">
					<button
						type="button"
						onclick={handleCancel}
						class="cancel-button px-6 py-2 bg-surface-2 text-text-base rounded-lg border border-border-subtle transition-colors duration-200 font-medium"
					>
						취소
					</button>
					<button
						type="submit"
						class="px-6 py-2 bg-brand-pink text-white rounded-lg hover:bg-brand-pink/90 focus:bg-brand-pink/90 focus-visible:bg-brand-pink/90 focus:outline-none focus:ring-0 transition-colors duration-200 font-medium"
					>
						저장
					</button>
						</div>
					</div>
				</div>
			</form>
		</div>
	</PageContent>
{/if}
