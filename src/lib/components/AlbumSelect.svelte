<script lang="ts">
	import { useClickOutside, useEscapeKey } from '$lib/utils/clickOutside';
	import { ChevronDown, Disc3 } from 'lucide-svelte';

	interface Album {
		id: string;
		title: string;
		artist?: string;
	}

	interface Props {
		value: string;
		onChange: (value: string) => void;
		albums: Album[];
		placeholder?: string;
		allowCustom?: boolean; // 직접 입력 허용 여부
		filterByArtist?: string; // 아티스트별 필터링
	}

	let {
		value,
		onChange,
		albums = [],
		placeholder = '앨범을 선택하세요',
		allowCustom = true,
		filterByArtist
	}: Props = $props();

	let dropdownOpen = $state(false);
	let inputValue = $state(value);
	let containerElement: HTMLDivElement;

	// value prop이 변경되면 inputValue도 업데이트
	$effect(() => {
		inputValue = value;
	});

	// 아티스트별 필터링
	const albumsByArtist = $derived(
		filterByArtist 
			? albums.filter(a => a.artist === filterByArtist)
			: albums
	);
	
	// 입력한 텍스트로 앨범 목록 필터링 (매칭되지 않는 앨범도 포함하되 시각적으로 구분)
	const filteredAlbums = $derived.by(() => {
		if (!inputValue.trim()) {
			return albumsByArtist;
		}
		const query = inputValue.trim().toLowerCase();
		// 먼저 아티스트별 필터링된 앨범에서 검색
		const matchedFromFiltered = albumsByArtist.filter(album => 
			album.title.toLowerCase().includes(query) ||
			(album.artist && album.artist.toLowerCase().includes(query))
		);
		
		// 아티스트와 매칭되지 않는 앨범도 검색어가 일치하면 표시 (시각적 구분)
		if (filterByArtist) {
			const unmatchedAlbums = albums.filter(album => 
				album.artist !== filterByArtist &&
				(album.title.toLowerCase().includes(query) ||
				(album.artist && album.artist.toLowerCase().includes(query)))
			);
			return [...matchedFromFiltered, ...unmatchedAlbums];
		}
		
		return matchedFromFiltered;
	});
	
	// 앨범이 현재 선택된 아티스트와 매칭되는지 확인
	const isAlbumMatched = (album: Album): boolean => {
		if (!filterByArtist) return true;
		return album.artist === filterByArtist;
	};
	
	const albumTitles = $derived(filteredAlbums.map(a => a.title));
	const showCustomInput = $derived(allowCustom && !albumTitles.includes(inputValue) && inputValue.trim() !== '');

	// 외부 클릭 감지
	$effect(() => {
		return useClickOutside('.album-select-dropdown', () => {
			dropdownOpen = false;
		}, dropdownOpen);
	});

	// Escape 키 감지
	$effect(() => {
		return useEscapeKey(() => {
			dropdownOpen = false;
		}, dropdownOpen);
	});

	function handleSelect(albumTitle: string) {
		inputValue = albumTitle;
		onChange(albumTitle);
		dropdownOpen = false;
		// 포커스 유지 (키보드 네비게이션 개선)
		if (typeof window !== 'undefined') {
			const input = document.querySelector('.album-select-dropdown input') as HTMLInputElement;
			input?.focus();
		}
	}

	function handleInputChange(e: Event) {
		const target = e.currentTarget as HTMLInputElement;
		inputValue = target.value;
		onChange(target.value);
	}

	function handleInputFocus() {
		dropdownOpen = true;
	}

	// 검색어 하이라이트 함수
	function highlightSearchTerm(text: string, query: string): Array<{ text: string; isMatch: boolean }> {
		if (!query || query.trim() === '') {
			return [{ text, isMatch: false }];
		}
		
		const lowerText = text.toLowerCase();
		const lowerQuery = query.toLowerCase();
		const parts: Array<{ text: string; isMatch: boolean }> = [];
		let lastIndex = 0;
		
		let index = lowerText.indexOf(lowerQuery, lastIndex);
		while (index !== -1) {
			// 매치 전 텍스트
			if (index > lastIndex) {
				parts.push({ text: text.substring(lastIndex, index), isMatch: false });
			}
			// 매치된 텍스트
			parts.push({ text: text.substring(index, index + query.length), isMatch: true });
			lastIndex = index + query.length;
			index = lowerText.indexOf(lowerQuery, lastIndex);
		}
		
		// 남은 텍스트
		if (lastIndex < text.length) {
			parts.push({ text: text.substring(lastIndex), isMatch: false });
		}
		
		return parts.length > 0 ? parts : [{ text, isMatch: false }];
	}
</script>

<div bind:this={containerElement} class="relative album-select-dropdown w-full">
	<div class="relative">
		<!-- 아이콘 -->
		<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
			<Disc3 size={16} class="lucide-icon text-text-muted transition-colors duration-200" />
		</div>
		
		<!-- 입력 필드 -->
		<input
			type="text"
			value={inputValue}
			oninput={handleInputChange}
			onfocus={handleInputFocus}
			class="w-full h-10 pl-10 pr-10 bg-surface-2 border border-border-subtle rounded-lg text-text-base focus:outline-none focus:border-brand-pink focus:ring-0 transition-colors duration-200"
			placeholder={placeholder}
		/>
		
		<!-- 드롭다운 버튼 -->
		<button
			type="button"
			onclick={() => dropdownOpen = !dropdownOpen}
			onkeydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					dropdownOpen = !dropdownOpen;
				}
			}}
			class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-auto bg-transparent hover:bg-transparent focus:bg-transparent focus-visible:bg-transparent"
			aria-label="앨범 목록 열기"
			aria-expanded={dropdownOpen}
			aria-haspopup="listbox"
		>
			<ChevronDown size={16} class="lucide-icon text-text-muted transition-colors duration-200 {dropdownOpen ? 'rotate-180' : ''}" />
		</button>
	</div>
	
	<!-- 드롭다운 목록 -->
	{#if dropdownOpen}
		<ul role="listbox" class="filter-dropdown absolute left-0 w-full mt-[6px] bg-surface-1 border border-border-subtle rounded-[6px] z-[9999] overflow-hidden pt-0">
			{#if filteredAlbums.length === 0}
				<li class="px-4 py-2 text-sm text-text-muted text-center">
					{#if inputValue.trim()}
						"{inputValue}"와 일치하는 앨범이 없습니다
					{:else}
						등록된 앨범이 없습니다
					{/if}
				</li>
			{:else}
				{#each filteredAlbums as album}
					<li
						role="option"
						aria-selected={inputValue === album.title}
						tabindex="0"
						onclick={() => handleSelect(album.title)}
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								handleSelect(album.title);
							}
						}}
						class={isAlbumMatched(album) ? '' : 'album-unmatched'}
					>
						<div class="flex flex-col">
							<span>
								{#if inputValue.trim()}
									{#each highlightSearchTerm(album.title, inputValue.trim()) as part}
										{#if part.isMatch}
											<span class="text-search-highlight font-medium">{part.text}</span>
										{:else}
											{part.text}
										{/if}
									{/each}
								{:else}
									{album.title}
								{/if}
							</span>
							{#if album.artist}
								<span class="text-xs album-artist-name">
									{#if inputValue.trim() && album.artist.toLowerCase().includes(inputValue.trim().toLowerCase())}
										{#each highlightSearchTerm(album.artist, inputValue.trim()) as part}
											{#if part.isMatch}
												<span class="text-search-highlight font-medium">{part.text}</span>
											{:else}
												{part.text}
											{/if}
										{/each}
									{:else}
										{album.artist}
									{/if}
								</span>
							{/if}
						</div>
					</li>
				{/each}
			{/if}
		</ul>
	{/if}
</div>

