<script lang="ts">
	import { useEscapeKey } from '$lib/utils/clickOutside';
	import { ChevronDown, X } from 'lucide-svelte';
	import { getArtistNames, getArtistNamesAsync } from '$lib/constants/artists';

	interface Props {
		value: string;
		onChange: (value: string) => void;
		required?: boolean;
		placeholder?: string;
		allowCustom?: boolean; // 직접 입력 허용 여부
	}

	let {
		value,
		onChange,
		required = false,
		placeholder = '아티스트를 선택하세요',
		allowCustom = true
	}: Props = $props();

	let dropdownOpen = $state(false);
	let inputValue = $state(value);
	let containerElement: HTMLDivElement;
	let focusedIndex = $state(-1); // 키보드 네비게이션용 포커스 인덱스
	let listElement: HTMLUListElement;
	let artistNames = $state<string[]>([]);

	// 컴포넌트 마운트 시 아티스트 목록 로드
	$effect(() => {
		(async () => {
			artistNames = await getArtistNamesAsync();
		})();
		return () => {};
	});

	// value prop이 변경되면 inputValue도 업데이트
	$effect(() => {
		inputValue = value;
		return () => {};
	});

	// 입력한 텍스트로 아티스트 목록 필터링
	const filteredArtistNames = $derived.by(() => {
		if (!inputValue.trim()) {
			return artistNames;
		}
		const query = inputValue.trim().toLowerCase();
		return artistNames.filter(name => name.toLowerCase().includes(query));
	});
	
	const showCustomInput = $derived(allowCustom && !filteredArtistNames.includes(inputValue) && inputValue.trim() !== '');

	// 외부 클릭 감지 - containerElement를 직접 사용
	$effect(() => {
		if (!dropdownOpen || !containerElement) return () => {};

		function handleClickOutside(event: MouseEvent) {
			const target = event.target as HTMLElement;
			// 이 컴포넌트의 containerElement 내부가 아니면 닫기
			if (containerElement && !containerElement.contains(target)) {
				dropdownOpen = false;
				focusedIndex = -1;
			}
		}

		// 다음 틱에 이벤트 리스너 등록
		const timeoutId = setTimeout(() => {
			document.addEventListener('click', handleClickOutside, true);
		}, 0);

		return () => {
			clearTimeout(timeoutId);
			document.removeEventListener('click', handleClickOutside, true);
		};
	});

	// Escape 키 감지
	$effect(() => {
		return useEscapeKey(() => {
			dropdownOpen = false;
			focusedIndex = -1; // Escape 키 시 포커스 인덱스 초기화
		}, dropdownOpen);
	});

	function handleSelect(artistName: string) {
		// 즉시 드롭다운 닫기 (다른 이벤트 핸들러보다 먼저 실행)
		dropdownOpen = false;
		inputValue = artistName;
		onChange(artistName);
		focusedIndex = -1; // 포커스 인덱스 초기화
	}

	function handleInputChange(e: Event) {
		const target = e.currentTarget as HTMLInputElement;
		inputValue = target.value;
		onChange(target.value);
		focusedIndex = -1; // 입력 변경 시 포커스 인덱스 초기화
	}

	function handleInputFocus() {
		if (skipNextFocus) {
			skipNextFocus = false;
			return;
		}
		dropdownOpen = true;
		focusedIndex = -1; // 포커스 인덱스 초기화
	}

	let skipNextFocus = $state(false);

	function handleClear() {
		inputValue = '';
		onChange('');
		dropdownOpen = false;
		focusedIndex = -1;
		skipNextFocus = true; // 다음 focus 이벤트 무시
		// 이 컴포넌트의 입력 필드로 포커스 이동
		if (containerElement) {
			const input = containerElement.querySelector('input') as HTMLInputElement;
			input?.focus();
		}
	}

	// 키보드 네비게이션 핸들러
	function handleInputKeydown(e: KeyboardEvent) {
		if (!dropdownOpen || filteredArtistNames.length === 0) {
			if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
				e.preventDefault();
				dropdownOpen = true;
				focusedIndex = e.key === 'ArrowDown' ? 0 : filteredArtistNames.length - 1;
			}
			return;
		}

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				focusedIndex = focusedIndex < filteredArtistNames.length - 1 
					? focusedIndex + 1 
					: 0; // 순환
				// 스크롤 처리
				if (listElement && focusedIndex >= 0) {
					const item = listElement.children[focusedIndex] as HTMLElement;
					item?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
				}
				break;
			case 'ArrowUp':
				e.preventDefault();
				focusedIndex = focusedIndex > 0 
					? focusedIndex - 1 
					: filteredArtistNames.length - 1; // 순환
				// 스크롤 처리
				if (listElement && focusedIndex >= 0) {
					const item = listElement.children[focusedIndex] as HTMLElement;
					item?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
				}
				break;
			case 'Enter':
				e.preventDefault();
				if (focusedIndex >= 0 && focusedIndex < filteredArtistNames.length) {
					handleSelect(filteredArtistNames[focusedIndex]);
				} else if (filteredArtistNames.length === 1) {
					// 검색 결과가 하나일 때 Enter로 선택
					handleSelect(filteredArtistNames[0]);
				}
				break;
			case 'Escape':
				e.preventDefault();
				dropdownOpen = false;
				focusedIndex = -1;
				break;
		}
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

<div bind:this={containerElement} class="relative artist-select-dropdown w-full">
	<div class="relative">
		<!-- 입력 필드 -->
		<input
			type="text"
			value={inputValue}
			oninput={handleInputChange}
			onfocus={handleInputFocus}
			onkeydown={handleInputKeydown}
			required={required}
			class="input-base w-full h-10 px-4 {inputValue.trim() ? 'pr-[4.5rem]' : 'pr-[2.625rem]'} text-base placeholder:text-text-muted"
			placeholder={placeholder}
		/>
		
		<!-- 클리어 버튼 (입력값이 있을 때만 표시) -->
		{#if inputValue.trim()}
			<button
				type="button"
				onclick={(e) => {
					e.stopPropagation();
					handleClear();
				}}
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						handleClear();
					}
				}}
				class="btn-icon absolute inset-y-0 right-[2.625rem] flex items-center pointer-events-auto"
				aria-label="입력 내용 지우기"
			>
				<span class="flex h-4 w-4 items-center justify-center">
					<X size={16} class="lucide-icon text-text-muted" />
				</span>
			</button>
		{/if}
		
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
			class="btn-icon absolute inset-y-0 right-2.5 flex items-center pointer-events-auto"
			aria-label="아티스트 목록 열기"
			aria-expanded={dropdownOpen}
			aria-haspopup="listbox"
		>
			<span class="flex h-4 w-4 items-center justify-center">
				<ChevronDown size={16} class="lucide-icon text-text-muted {dropdownOpen ? 'rotate-180' : ''}" />
			</span>
		</button>
	</div>
	
	<!-- 드롭다운 목록 -->
	{#if dropdownOpen}
		<ul 
			bind:this={listElement}
			role="listbox" 
			class="filter-dropdown absolute left-0 w-full mt-[6px] bg-surface-1 border border-border-subtle rounded-[6px] z-[9999] max-h-60 custom-list-scrollbar pt-0"
			onclick={(e) => {
				// ul 클릭도 내부 클릭으로 처리하여 외부 클릭 감지 방지
				e.stopPropagation();
			}}
		>
			{#if filteredArtistNames.length === 0}
				<li class="px-4 py-2 text-base text-text-muted text-center">
					{#if inputValue.trim()}
						"{inputValue}"와 일치하는 아티스트가 없습니다
					{:else}
						등록된 아티스트가 없습니다
					{/if}
				</li>
			{:else}
				{#each filteredArtistNames as artistName, index}
					<li
						role="option"
						aria-selected={inputValue === artistName}
						tabindex={focusedIndex === index ? 0 : -1}
						class={focusedIndex === index ? 'keyboard-focused' : ''}
						onclick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							handleSelect(artistName);
						}}
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								e.stopPropagation();
								handleSelect(artistName);
							}
						}}
						onmouseenter={() => focusedIndex = index}
					>
						{#if inputValue.trim()}
							{#each highlightSearchTerm(artistName, inputValue.trim()) as part}
								{#if part.isMatch}
									<span class="text-search-highlight font-medium">{part.text}</span>
								{:else}
									{part.text}
								{/if}
							{/each}
						{:else}
							{artistName}
						{/if}
					</li>
				{/each}
			{/if}
		</ul>
	{/if}
</div>

