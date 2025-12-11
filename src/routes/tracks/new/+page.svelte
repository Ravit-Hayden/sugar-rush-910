<script lang="ts">
	import { goto } from '$app/navigation';
	import { Asterisk, ChevronDown, ChevronDown as ChevronDownIcon, X } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';
	import DatePicker from '$lib/components/DatePicker.svelte';
	import { GENRES } from '$lib/constants/genres';

	// 현재 날짜 정보
	const currentDate = new Date();
	const today = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD 형식

	// 폼 상태 (빈 데이터로 초기화 - Create Mode)
	let formData = $state({
		title: '',
		artist: '',
		album: '',
		genres: [] as string[],
		status: 'draft',
		release_date_kr: today, // 오늘 날짜로 초기화
		release_date_global: today // 오늘 날짜로 초기화
	});

	// 상태 드롭다운 열림 상태
	let statusDropdownOpen = $state(false);
	let genreDropdownOpen = $state(false);

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
		console.log('트랙 생성:', $state.snapshot(formData));
		// 실제 저장 로직 구현 예정
		// 저장 후 생성된 트랙의 상세 페이지로 이동
		// 임시로 목록 페이지로 이동
		goto('/tracks');
	}

	function handleCancel(event: MouseEvent) {
		const button = event.currentTarget as HTMLButtonElement;
		if (confirm('작성 중인 내용을 저장하지 않고 나가시겠습니까?')) {
			goto('/tracks');
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

<PageContent>
	<PageHeader 
		title="새 트랙 만들기"
		description="새로운 트랙을 만듭니다"
	/>

	<!-- 생성 폼 -->
	<div class="bg-surface-1 rounded-lg border border-border-subtle p-6">
		<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-6">
			<!-- 기본 정보 -->
			<div class="space-y-4">
				<h3 class="text-lg font-semibold text-text-strong mb-4">기본 정보</h3>
				
				<!-- 트랙 제목 -->
				<div class="w-full">
					<label for="title" class="block text-sm font-medium text-text-strong mb-2">
						트랙 제목 <Asterisk size={12} class="inline text-brand-pink ml-0" />
					</label>
					<input
						type="text"
						id="title"
						name="title"
						bind:value={formData.title}
						required
						class="w-full h-10 px-4 bg-surface-2 border border-border-subtle rounded-lg text-text-base focus:outline-none focus:border-brand-pink focus:ring-0 transition-colors duration-200"
						placeholder="트랙 제목을 입력하세요"
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

				<!-- 앨범 -->
				<div class="w-full">
					<label for="album" class="block text-sm font-medium text-text-strong mb-2">
						앨범
					</label>
					<input
						type="text"
						id="album"
						name="album"
						bind:value={formData.album}
						class="w-full h-10 px-4 bg-surface-2 border border-border-subtle rounded-lg text-text-base focus:outline-none focus:border-brand-pink focus:ring-0 transition-colors duration-200"
						placeholder="앨범 이름을 입력하세요"
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
									<span class="bg-surface-3 text-text-strong rounded-full px-2 py-0.5 text-xs flex items-center gap-1">
										{genre}
										<button
											type="button"
											onclick={(e) => {
												e.stopPropagation();
												removeGenre(genre);
											}}
											class="ml-1 hover:bg-transparent hover:text-danger-fg transition-colors duration-200 focus:outline-none"
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
							<ul role="listbox" class="absolute left-0 w-full mt-[6px] bg-surface-1 border rounded-[6px] z-10 border-border-subtle shadow-lg max-h-60 overflow-y-auto">
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
							<ul role="listbox" class="absolute left-0 w-full mt-[6px] bg-surface-1 border rounded-[6px] z-10 border-border-subtle shadow-lg max-h-60 overflow-y-auto">
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
			<div class="-mx-6 px-6 pt-6 border-t border-border-subtle">
				<div class="space-y-4">
					<h3 class="text-lg font-semibold text-text-strong mb-4">발매일 정보</h3>
					
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
			<div class="-mx-6 px-6 flex items-center justify-end gap-3 pt-6 border-t border-border-subtle">
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
					생성
				</button>
			</div>
		</form>
	</div>
</PageContent>
