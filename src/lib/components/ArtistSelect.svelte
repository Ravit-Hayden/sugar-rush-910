<script lang="ts">
	import { useClickOutside, useEscapeKey } from '$lib/utils/clickOutside';
	import { ChevronDown, User } from 'lucide-svelte';
	import { ARTISTS, getArtistNames } from '$lib/constants/artists';

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

	// value prop이 변경되면 inputValue도 업데이트
	$effect(() => {
		inputValue = value;
	});

	// 입력한 텍스트로 아티스트 목록 필터링
	const filteredArtistNames = $derived.by(() => {
		const artistNames = getArtistNames();
		if (!inputValue.trim()) {
			return artistNames;
		}
		const query = inputValue.trim().toLowerCase();
		return artistNames.filter(name => name.toLowerCase().includes(query));
	});
	
	const showCustomInput = $derived(allowCustom && !filteredArtistNames.includes(inputValue) && inputValue.trim() !== '');

	// 외부 클릭 감지
	$effect(() => {
		return useClickOutside('.artist-select-dropdown', () => {
			dropdownOpen = false;
		}, dropdownOpen);
	});

	// Escape 키 감지
	$effect(() => {
		return useEscapeKey(() => {
			dropdownOpen = false;
		}, dropdownOpen);
	});

	function handleSelect(artistName: string) {
		inputValue = artistName;
		onChange(artistName);
		dropdownOpen = false;
		// 포커스 유지 (키보드 네비게이션 개선)
		if (typeof window !== 'undefined') {
			const input = document.querySelector('.artist-select-dropdown input') as HTMLInputElement;
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

<div bind:this={containerElement} class="relative artist-select-dropdown w-full">
	<div class="relative">
		<!-- 아이콘 -->
		<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
			<User size={16} class="lucide-icon text-text-muted transition-colors duration-200" />
		</div>
		
		<!-- 입력 필드 -->
		<input
			type="text"
			value={inputValue}
			oninput={handleInputChange}
			onfocus={handleInputFocus}
			required={required}
			class="w-full h-10 pl-10 pr-10 bg-surface-2 border border-border-subtle rounded-lg text-text-base focus:outline-none focus:border-brand-pink focus:ring-0 transition-colors duration-200"
			placeholder={placeholder}
			list="artist-options"
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
			aria-label="아티스트 목록 열기"
			aria-expanded={dropdownOpen}
			aria-haspopup="listbox"
		>
			<ChevronDown size={16} class="lucide-icon text-text-muted transition-colors duration-200 {dropdownOpen ? 'rotate-180' : ''}" />
		</button>
	</div>
	
	<!-- 드롭다운 목록 -->
	{#if dropdownOpen}
		<ul role="listbox" class="filter-dropdown absolute left-0 w-full mt-[6px] bg-surface-1 border border-border-subtle rounded-[6px] z-[9999] overflow-hidden pt-0">
			{#if filteredArtistNames.length === 0}
				<li class="px-4 py-2 text-sm text-text-muted text-center">
					{#if inputValue.trim()}
						"{inputValue}"와 일치하는 아티스트가 없습니다
					{:else}
						등록된 아티스트가 없습니다
					{/if}
				</li>
			{:else}
				{#each filteredArtistNames as artistName}
					<li
						role="option"
						aria-selected={inputValue === artistName}
						tabindex="0"
						onclick={() => handleSelect(artistName)}
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								handleSelect(artistName);
							}
						}}
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

