<script lang="ts">
	import { goto } from '$app/navigation';
	import { Asterisk, ChevronDown, ChevronDown as ChevronDownIcon, X } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';
	import DatePicker from '$lib/components/DatePicker.svelte';
	import { GENRES } from '$lib/constants/genres';
	import ArtistSelect from '$lib/components/ArtistSelect.svelte';
	import AlbumSelect from '$lib/components/AlbumSelect.svelte';
	import { ALBUMS } from '$lib/constants/albums';
	import { toast } from '$lib/stores/toast';
	import { clearToast, showAlbumArtistMismatchToast } from '$lib/utils/toastHelpers';

	// 현재 날짜 정보 (클라이언트 사이드에서만 실행)
	let today = '';
	if (typeof window !== 'undefined') {
		const currentDate = new Date();
		today = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD 형식
	}

	// 폼 상태 (빈 데이터로 초기화 - Create Mode)
	let formData = $state({
		title: '',
		artist: '',
		album: '',
		genres: [] as string[],
		status: 'draft',
		release_date_kr: '', // 클라이언트에서 초기화
		release_date_global: '' // 클라이언트에서 초기화
	});

	// 클라이언트 사이드에서 날짜 초기화
	$effect(() => {
		if (typeof window !== 'undefined' && !formData.release_date_kr) {
			const currentDate = new Date();
			const todayValue = currentDate.toISOString().split('T')[0];
			formData.release_date_kr = todayValue;
			formData.release_date_global = todayValue;
		}
		return () => {};
	});

	// 상태 드롭다운 열림 상태
	let statusDropdownOpen = $state(false);
	let genreDropdownOpen = $state(false);
	
	// 아티스트 변경 디바운싱을 위한 변수
	let artistChangeTimeout: ReturnType<typeof setTimeout> | null = null;
	let lastArtistValue = $state('');
	
	// 경고 Toast ID 추적 (중복 방지)
	let albumArtistMismatchToastId: string | null = null;
	
	// 검증 상태
	let validationErrors = $state<Record<string, string>>({});
	let isSubmitting = $state(false);
	
	// 입력 필드 참조
	let titleInput: HTMLInputElement;

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

	// 검증 함수
	function validateForm(): boolean {
		validationErrors = {};
		
		// 필수 필드 검증
		if (!formData.title.trim()) {
			validationErrors.title = '트랙 제목을 입력해주세요.';
		}
		
		if (!formData.artist.trim()) {
			validationErrors.artist = '아티스트를 선택하거나 입력해주세요.';
		}
		
		if (!formData.status) {
			validationErrors.status = '상태를 선택해주세요.';
		}
		
		// 앨범-아티스트 매칭 검증은 실시간으로 처리되므로 여기서는 제외
		// (이미 경고 Toast가 표시되어 있으면 그대로 유지)
		
		return Object.keys(validationErrors).length === 0;
	}
	
	async function handleSubmit() {
		if (isSubmitting) return;
		
		// 최종 검증
		if (!validateForm()) {
			toast.add('필수 항목을 모두 입력해주세요.', 'error', 3000);
			// 첫 번째 에러 필드로 포커스 이동
			const firstErrorField = Object.keys(validationErrors)[0];
			if (firstErrorField) {
				// 약간의 지연 후 포커스 (DOM 업데이트 대기)
				setTimeout(() => {
					const field = document.getElementById(firstErrorField);
					field?.focus();
					field?.scrollIntoView({ behavior: 'smooth', block: 'center' });
				}, 100);
			}
			return;
		}
		
		isSubmitting = true;
		
		try {
			// 폼 데이터 준비
			const trackData = {
				title: formData.title.trim(),
				artist: formData.artist.trim(),
				album: formData.album.trim() || null,
				genres: formData.genres,
				status: formData.status,
				release_date_kr: formData.release_date_kr || null,
				release_date_global: formData.release_date_global || null
			};
			
			// API 호출
			const response = await fetch('/api/tracks', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(trackData)
			});

			const result = await response.json();

			if (!response.ok || !result.ok) {
				const errorMessage = result.error?.message || '트랙 추가에 실패했습니다.';
				throw new Error(errorMessage);
			}

			// 성공 알림
			toast.add('트랙이 성공적으로 추가되었습니다.', 'success', 3000);
			
			// 목록 페이지로 이동
			setTimeout(() => {
				goto('/tracks');
			}, 1000);
		} catch (error) {
			console.error('트랙 추가 오류:', error);
			const errorMessage = error instanceof Error 
				? error.message 
				: '트랙 추가 중 오류가 발생했습니다.';
			toast.add(errorMessage, 'error', 5000);
		} finally {
			isSubmitting = false;
		}
	}

	function handleCancel(event: MouseEvent) {
		const button = event.currentTarget as HTMLButtonElement;
		
		// 폼에 변경사항이 있는지 확인
		const hasChanges = formData.title.trim() !== '' || 
			formData.artist.trim() !== '' || 
			formData.album.trim() !== '' || 
			formData.genres.length > 0;
		
		if (hasChanges) {
			if (confirm('작성 중인 내용을 저장하지 않고 나가시겠습니까?')) {
				// 경고 Toast 정리
				albumArtistMismatchToastId = clearToast(albumArtistMismatchToastId);
				goto('/tracks');
			} else {
				// confirm에서 취소를 선택한 경우 포커스 해제
				button.blur();
			}
		} else {
			// 변경사항이 없으면 바로 나가기
			goto('/tracks');
		}
	}

	function toggleStatusDropdown() {
		statusDropdownOpen = !statusDropdownOpen;
	}

	function selectStatusOption(value: string) {
		formData.status = value;
		statusDropdownOpen = false;
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
</script>

<svelte:head>
	<title>트랙 추가</title>
</svelte:head>

<PageContent>
	<PageHeader 
		title="트랙 추가"
		description="새로운 트랙을 추가합니다"
	/>

			<!-- 추가 폼 -->
	<div class="bg-surface-1 rounded-lg border border-border-subtle overflow-hidden">
		<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
			<!-- 기본 정보 -->
			<div class="p-6 space-y-4">
				<h3 class="text-lg font-semibold text-text-strong">기본 정보</h3>
				
				<!-- 트랙 제목 -->
				<div class="w-full">
					<label for="title" class="block text-sm font-medium text-text-strong mb-2">
						트랙 제목 <Asterisk size={12} class="inline text-brand-pink ml-0" />
					</label>
					<div class="relative">
						<input
							type="text"
							id="title"
							name="title"
							bind:this={titleInput}
							bind:value={formData.title}
							required
							aria-invalid={validationErrors.title ? 'true' : 'false'}
							aria-describedby={validationErrors.title ? 'title-error' : undefined}
							class="input-base w-full h-10 px-4 {formData.title.trim() ? 'pr-10' : 'pr-4'} text-base placeholder:text-text-muted {validationErrors.title ? 'border-danger-fg' : ''}"
							placeholder="트랙 제목을 입력하세요"
						/>
						{#if formData.title.trim()}
							<button
								type="button"
								class="btn-icon absolute right-3 top-1/2 -translate-y-1/2"
								onclick={() => {
									formData.title = '';
									document.getElementById('title')?.focus();
								}}
								aria-label="입력 내용 지우기"
							>
								<X size={16} />
							</button>
						{/if}
					</div>
					{#if validationErrors.title}
						<p id="title-error" class="mt-1.5 text-sm text-danger-fg" role="alert">
							{validationErrors.title}
						</p>
					{/if}
				</div>

				<!-- 아티스트 -->
				<div class="w-full">
					<label for="artist" class="block text-sm font-medium text-text-strong mb-2">
						아티스트 <Asterisk size={12} class="inline text-brand-pink ml-0" />
					</label>
					<div class="relative">
						<ArtistSelect
							value={formData.artist}
							onChange={(value) => {
								// 검증 에러 제거
								if (validationErrors.artist && value.trim()) {
									validationErrors = { ...validationErrors };
									delete validationErrors.artist;
								}
							formData.artist = value;
							
							// 디바운싱: 이전 타이머 취소
							if (artistChangeTimeout) {
								clearTimeout(artistChangeTimeout);
							}
							
							// 아티스트가 변경되면 앨범 필터링이 자동으로 업데이트됨 (filterByArtist prop으로)
							// 아티스트가 삭제되면 앨범 필터링도 해제됨
							
							// 디바운싱: 500ms 후에 경고 체크 (입력 중이 아닐 때만)
							artistChangeTimeout = setTimeout(() => {
								// 빈 값이거나 삭제 중일 때는 경고 제거
								if (!value || value.trim() === '') {
									albumArtistMismatchToastId = clearToast(albumArtistMismatchToastId);
									lastArtistValue = value;
									// 앨범도 초기화 (역방향 검증)
									formData.album = '';
									return;
								}
								
								// 이전 값과 동일하면 경고 표시하지 않음
								if (value === lastArtistValue) {
									return;
								}
								
								lastArtistValue = value;
								
								// 역방향 검증: 현재 선택된 앨범이 변경된 아티스트의 앨범 목록에 있는지 확인
								if (formData.album && formData.album.trim() !== '') {
									const selectedAlbum = ALBUMS.find(a => 
										a.title === formData.album || 
										a.title.toLowerCase().trim() === formData.album.toLowerCase().trim()
									);
									
									// 앨범이 변경된 아티스트의 앨범이 아니면 앨범 초기화 및 경고
									if (selectedAlbum && selectedAlbum.artist && selectedAlbum.artist !== value) {
										// 기존 경고가 있으면 제거
										albumArtistMismatchToastId = clearToast(albumArtistMismatchToastId);
										
										// 앨범 초기화
										formData.album = '';
										
										// 경고 Toast 표시
										albumArtistMismatchToastId = showAlbumArtistMismatchToast(
											`선택한 앨범은 "${selectedAlbum.artist}"의 앨범입니다. 앨범이 초기화되었습니다.`,
											'앨범 다시 선택',
											() => {
												albumArtistMismatchToastId = clearToast(albumArtistMismatchToastId);
												// 앨범 필드로 포커스 이동
												setTimeout(() => {
													const albumInput = document.querySelector('.album-select-dropdown input') as HTMLInputElement;
													albumInput?.focus();
												}, 100);
											},
											() => {
												albumArtistMismatchToastId = clearToast(albumArtistMismatchToastId);
											}
										);
									} else if (selectedAlbum && selectedAlbum.artist && selectedAlbum.artist === value) {
										// 아티스트가 앨범과 일치하면 경고 제거 (사용자가 수정한 경우)
										albumArtistMismatchToastId = clearToast(albumArtistMismatchToastId);
									} else {
										// 앨범이 상수 목록에 없으면 (커스텀 앨범) 경고 제거
										albumArtistMismatchToastId = clearToast(albumArtistMismatchToastId);
									}
								} else {
									// 앨범이 없으면 경고 제거
									albumArtistMismatchToastId = clearToast(albumArtistMismatchToastId);
								}
							}, 500);
						}}
							required
							placeholder="아티스트를 선택하거나 입력하세요"
							allowCustom={true}
						/>
						{#if validationErrors.artist}
							<p id="artist-error" class="mt-1.5 text-sm text-danger-fg" role="alert">
								{validationErrors.artist}
							</p>
						{/if}
					</div>
				</div>

				<!-- 앨범 -->
				<div class="w-full">
					<label for="album" class="block text-sm font-medium text-text-strong mb-2">
						앨범
					</label>
					<AlbumSelect
						value={formData.album}
						onChange={(value) => {
							formData.album = value;
							
							// 기존 경고 제거 (새로운 앨범 선택 시)
							albumArtistMismatchToastId = clearToast(albumArtistMismatchToastId);
							
							// 앨범 선택 시 해당 앨범의 아티스트 자동 적용
							// 정확한 매칭 또는 대소문자/공백 무시 매칭
							const selectedAlbum = ALBUMS.find(a => 
								a.title === value || 
								a.title.toLowerCase().trim() === value.toLowerCase().trim()
							);
							
							if (selectedAlbum && selectedAlbum.artist) {
								// 현재 아티스트와 다른 경우 경고 표시 (자동 변경하지 않음)
								if (formData.artist && formData.artist !== selectedAlbum.artist && formData.artist.trim() !== '') {
									// 새로운 경고 표시
									albumArtistMismatchToastId = showAlbumArtistMismatchToast(
										`선택한 앨범 "${value}"은(는) "${selectedAlbum.artist}"의 앨범입니다.`,
										'아티스트 변경',
										() => {
											formData.artist = selectedAlbum.artist;
											albumArtistMismatchToastId = clearToast(albumArtistMismatchToastId);
											toast.add('아티스트가 변경되었습니다.', 'success', 3000);
										},
										() => {
											albumArtistMismatchToastId = clearToast(albumArtistMismatchToastId);
										}
									);
								} else {
									// 아티스트가 일치하거나 비어있으면 자동으로 변경하고 알림
									if (!formData.artist || formData.artist.trim() === '' || formData.artist === selectedAlbum.artist) {
										const previousArtist = formData.artist;
										formData.artist = selectedAlbum.artist;
										
										// 아티스트가 실제로 변경된 경우에만 알림 표시
										if (previousArtist !== selectedAlbum.artist && formData.artist && formData.artist.trim() !== '') {
											toast.add(
												`앨범 "${value}"의 아티스트가 "${selectedAlbum.artist}"로 자동 변경되었습니다.`,
												'success',
												3000
											);
										}
									}
								}
							} else if (value && value.trim() !== '') {
								// 커스텀 앨범 입력 시 현재 아티스트와 매칭 확인
								// 커스텀 앨범은 허용하되 경고 표시하지 않음 (유연한 처리)
							}
							// 앨범을 삭제한 경우 (빈 문자열) 아티스트는 그대로 유지
						}}
						albums={ALBUMS}
						placeholder="앨범을 선택하거나 입력하세요"
						allowCustom={true}
						filterByArtist={formData.artist || undefined}
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
								<ChevronDownIcon size={16} class="lucide-icon text-text-muted transition-colors duration-200" />
							</span>
						</div>
						{#if genreDropdownOpen}
							<ul role="listbox" class="absolute left-0 w-full mt-[6px] bg-surface-1 border border-border-subtle rounded-[6px] z-10 max-h-60 custom-list-scrollbar">
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
						<input type="hidden" name="status" value={formData.status} />
						<button
							type="button"
							id="status"
							name="status"
							class="w-full h-10 px-4 pr-[2.625rem] bg-surface-2 border border-border-subtle rounded-lg text-base text-text-base text-left focus:outline-none focus:border-brand-pink focus:ring-0 transition-colors duration-200"
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
					{#if validationErrors.status}
						<p id="status-error" class="mt-1.5 text-sm text-danger-fg" role="alert">
							{validationErrors.status}
						</p>
					{/if}
				</div>
			</div>

			<!-- 발매일 정보 -->
			<div class="border-t border-border-subtle">
				<div class="p-6 space-y-4">
					<h3 class="text-lg font-semibold text-text-strong">발매일 정보</h3>
					
					<!-- 국내 발매일 -->
					<div class="w-full">
						<label for="release_date_kr" class="block text-sm font-medium text-text-strong mb-2">국내 발매일</label>
						<DatePicker id="release_date_kr" name="release_date_kr" bind:value={formData.release_date_kr} />
					</div>

					<!-- 해외 발매일 -->
					<div class="w-full">
						<label for="release_date_global" class="block text-sm font-medium text-text-strong mb-2">해외 발매일</label>
						<DatePicker id="release_date_global" name="release_date_global" bind:value={formData.release_date_global} />
					</div>
				</div>
			</div>

			<!-- 액션 버튼 -->
			<div class="border-t border-border-subtle p-6">
				<div class="flex items-center justify-end gap-3">
				<button
					type="button"
					onclick={handleCancel}
					class="cancel-button px-6 py-2 bg-surface-2 text-text-base rounded-lg border border-border-subtle transition-colors duration-200 font-medium"
				>
					취소
				</button>
				<button
					type="submit"
					disabled={isSubmitting}
					class="px-6 py-2 bg-brand-pink text-white rounded-lg focus:outline-none focus:ring-0 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
					aria-busy={isSubmitting}
				>
					추가
				</button>
				</div>
			</div>
		</form>
	</div>
</PageContent>
