<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import { Asterisk, ChevronDown, X } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';
	import DatePicker from '$lib/components/DatePicker.svelte';
	import { GENRES } from '$lib/constants/genres';
	import { mockTracks } from '$lib/mocks/tracks';

	let { data }: { data: PageData } = $props();

	const tracks = mockTracks;

	let trackId = $derived(data.trackId || $page.params.id || '');
	let track = $derived(tracks.find(t => t.id === trackId));

	// 폼 상태
	let formData = $state({
		title: '',
		artist: '',
		album: '',
		genres: [] as string[],
		status: 'draft',
		release_date_kr: '' as string,
		release_date_global: '' as string
	});

	// 드롭다운 열림 상태
	let statusDropdownOpen = $state(false);
	let genreDropdownOpen = $state(false);

	// 트랙 데이터가 변경되면 폼 데이터 업데이트
	$effect(() => {
		if (track) {
			formData.title = track.title;
			formData.artist = track.artist;
			formData.album = track.album;
			formData.genres = track.genre ? [track.genre] : [];
			formData.status = track.status;
			formData.release_date_kr = track.release_date_kr || '';
			formData.release_date_global = track.release_date_global || '';
		}
		return () => {};
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
		goto(`/tracks/${trackId}`);
	}

	function handleCancel(event: MouseEvent) {
		const button = event.currentTarget as HTMLButtonElement;
		if (confirm('변경사항을 저장하지 않고 나가시겠습니까?')) {
			// history.back()을 사용하여 이전 페이지로 이동
			// 브라우저 히스토리가 없으면 트랙 목록으로 이동
			if (typeof window !== 'undefined' && window.history.length > 1) {
				window.history.back();
			} else {
				goto('/tracks');
			}
		} else {
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

{#if !track}
	<PageContent>
		<PageHeader 
			title="트랙을 찾을 수 없습니다" 
			description="요청하신 트랙이 존재하지 않습니다."
		/>
		<div class="text-center py-12">
			<p class="text-text-muted mb-4">트랙 ID: {trackId}</p>
			<button 
				onclick={() => goto('/tracks')}
				class="inline-flex items-center justify-center gap-2 px-4 py-2 w-full sm:w-auto bg-brand-pink text-white rounded-lg hover:bg-brand-pink/90 transition-colors duration-200 font-medium"
			>
				트랙 목록으로 돌아가기
			</button>
		</div>
	</PageContent>
{:else}
	<PageContent>
		<PageHeader 
			title="트랙 편집"
			description={track.title}
		/>

		<!-- 편집 폼 -->
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
								class="w-full min-h-10 px-4 pr-10 py-0 bg-surface-2 border border-border-subtle rounded-lg text-text-base transition-colors duration-200 flex flex-wrap gap-2 items-center cursor-pointer focus-within:outline-none focus-within:ring-0"
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
								<ChevronDown size={16} class="lucide-icon text-text-muted transition-colors duration-200" />
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
							<div class="pointer-events-none absolute inset-y-0 right-2.5 flex items-center">
								<span class="flex h-4 w-4 items-center justify-center">
									<ChevronDown size={16} class="lucide-icon text-text-muted transition-colors duration-200" />
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
						class="px-6 py-2 bg-brand-pink text-white rounded-lg focus:outline-none focus:ring-0 transition-colors duration-200 font-medium"
					>
						저장
					</button>
				</div>
			</form>
		</div>
	</PageContent>
{/if}

