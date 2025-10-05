<script lang="ts">
	import { onMount } from 'svelte';
	import { PanelLeftOpen, PanelLeftClose, Search, Bell, X } from 'lucide-svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	let sidebarOpen = false;
	let searchValue = '';
	let searchIconHovered = false;
	let searchFocused = false;
	let searchResults: { 
		exact: { id: string; title: string; type: string; href: string }[];
		similar: { id: string; title: string; type: string; href: string }[];
	} = { exact: [], similar: [] };
	let searchLoading = false;

	// 검색 초기화 이벤트 리스너
	onMount(() => {
		const handleSearchClear = () => {
			clearSearch();
		};

		window.addEventListener('search-clear', handleSearchClear);
		return () => {
			window.removeEventListener('search-clear', handleSearchClear);
		};
	});

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
		// 사이드바 상태를 전역으로 관리할 수 있도록 이벤트 발생
		window.dispatchEvent(new CustomEvent('sidebar-toggle', { detail: { open: sidebarOpen } }));
	}

	// 검색 실행
	async function performSearch(query: string) {
		searchLoading = true;

		try {
			const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=8`);
			const data = await response.json() as { 
				ok: boolean; 
				data: { 
					exact: { id: string; title: string; type: string; href: string }[];
					similar: { id: string; title: string; type: string; href: string }[];
				} 
			};
			
			if (data.ok) {
				searchResults = data.data;
			} else {
				searchResults = { exact: [], similar: [] };
			}
		} catch (error) {
			console.error('Search error:', error);
			searchResults = { exact: [], similar: [] };
		} finally {
			searchLoading = false;
			// 검색 완료 후 메인 페이지에 알림
			notifySearchChange();
		}
	}

	// 검색어 변경 시 디바운스 처리
	let searchTimeout: ReturnType<typeof setTimeout>;
	function handleSearchInput() {
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			// 검색어가 있을 때만 검색 실행
			if (searchValue.trim()) {
				performSearch(searchValue);
			} else {
				// 검색어가 없을 때는 유사항목 추천 표시
				performSearch('');
			}
		}, 300);
	}


	// 검색 초기화
	function clearSearch() {
		searchValue = '';
		searchResults = { exact: [], similar: [] };
		// 메인 페이지에 검색 초기화 알림
		window.dispatchEvent(new CustomEvent('search-change', {
			detail: { query: '', results: { exact: [], similar: [] }, show: false }
		}));
		// 상단바 제목 업데이트를 위해 강제 리렌더링
		searchValue = searchValue;
	}

	// 검색 결과를 메인 페이지로 전달
	function notifySearchChange() {
		// 검색어가 있을 때만 메인 페이지에 표시
		const shouldShow = searchValue.trim().length > 0;
		window.dispatchEvent(new CustomEvent('search-change', {
			detail: { query: searchValue, results: searchResults, show: shouldShow }
		}));
	}
</script>

<header class="h-24 px-3 sm:px-4 md:px-6 sticky top-0 z-50 bg-bg border-b border-border-subtle">
	<div class="flex h-full items-center justify-between gap-2">
		<!-- Left Slot: 로고 + 사이드바 토글 (사이드바 영역 내에서 배치) -->
		<div class="flex items-center w-[200px] sm:w-[220px] md:w-[240px] flex-shrink-0">
			<img src="/logo.svg" alt="Sugar Rush" class="h-6 sm:h-7 md:h-8 w-auto" />
			<div class="flex-1"></div>
			<div class="flex items-center">
				<button
					onclick={toggleSidebar}
					class="inline-flex items-center justify-center w-6 h-6 rounded-md hover:bg-surface-1 transition-colors"
					aria-label="사이드바 토글"
				>
					{#if sidebarOpen}
						<PanelLeftClose size={16} style="color: var(--brand-pink);" />
					{:else}
						<PanelLeftOpen size={16} style="color: var(--brand-pink);" />
					{/if}
				</button>
				<div class="w-12"></div>
			</div>
		</div>

		<!-- Center Slot: 페이지 타이틀 (좌측 정렬) -->
		<div class="flex items-center flex-1 justify-start min-w-0">
			{#if searchValue.trim()}
				<div class="flex items-center gap-2 min-w-0">
					<Search size={16} class="text-brand-pink flex-shrink-0" />
					<div class="flex items-center gap-2 min-w-0 max-w-full">
						<!-- 데스크톱: 전체 텍스트 표시 -->
						<div class="hidden md:flex items-center gap-2 min-w-0 max-w-full">
							<h2 class="text-lg font-semibold truncate" style="color: var(--brand-pink);">
								"<span class="text-brand-pink">{searchValue}</span>" 검색 결과
							</h2>
							{#if searchResults?.exact?.length > 0 || searchResults?.similar?.length > 0}
								<span class="text-sm text-text-muted flex-shrink-0">
									({(searchResults?.exact?.length || 0) + (searchResults?.similar?.length || 0)}개)
								</span>
							{/if}
						</div>
						<!-- 태블릿: 중간 길이 텍스트 -->
						<div class="hidden sm:flex md:hidden items-center gap-2 min-w-0 max-w-full">
							<h2 class="text-base font-semibold truncate" style="color: var(--brand-pink);">
								"<span class="text-brand-pink">{searchValue.length > 8 ? searchValue.substring(0, 8) + '...' : searchValue}</span>" 검색 결과
							</h2>
							{#if searchResults?.exact?.length > 0 || searchResults?.similar?.length > 0}
								<span class="text-xs text-text-muted flex-shrink-0">
									({(searchResults?.exact?.length || 0) + (searchResults?.similar?.length || 0)})
								</span>
							{/if}
						</div>
						<!-- 모바일: 짧은 텍스트 -->
						<div class="flex sm:hidden items-center gap-2 min-w-0 max-w-full">
							<h2 class="text-sm font-semibold truncate" style="color: var(--brand-pink);">
								"<span class="text-brand-pink">{searchValue.length > 6 ? searchValue.substring(0, 6) + '...' : searchValue}</span>" 검색
							</h2>
							{#if searchResults?.exact?.length > 0 || searchResults?.similar?.length > 0}
								<span class="text-xs text-text-muted flex-shrink-0">
									({(searchResults?.exact?.length || 0) + (searchResults?.similar?.length || 0)})
								</span>
							{/if}
						</div>
					</div>
				</div>
			{:else}
				<h2 class="text-lg font-semibold" style="color: var(--brand-pink);">대시보드</h2>
			{/if}
		</div>

		<!-- Right Slot: 검색창 + 알림 + 테마 토글 -->
		<div class="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
			<!-- 검색창 -->
			<div class="relative">
				<Search 
					size={16} 
					class="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-base transition-colors {searchValue || searchFocused ? 'text-brand-pink' : searchIconHovered ? 'text-hover-cyan' : ''}" 
				/>
				<input
					bind:value={searchValue}
					type="text"
					placeholder="검색..."
					class="pl-10 pr-10 py-1.5 w-48 sm:w-56 md:w-64 bg-surface-1 border border-border-subtle border-[1px] rounded-md text-text-base placeholder-text-muted hover:border-hover-cyan focus:outline-none focus:ring-0 focus:border-[1px] focus:border-brand-pink transition-colors duration-300"
					onmouseenter={() => searchIconHovered = true}
					onmouseleave={() => searchIconHovered = false}
					onfocus={() => { searchFocused = true; }}
					onblur={() => { searchFocused = false; }}
					oninput={handleSearchInput}
				/>
				
				<!-- X 버튼 (검색어가 있을 때만 표시) -->
				{#if searchValue.trim()}
					<button
						onclick={clearSearch}
						class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center text-text-muted hover:text-text-strong transition-colors"
						aria-label="검색 초기화"
					>
						<X size={16} />
					</button>
				{/if}
			</div>

			<!-- 알림 버튼 -->
			<button
				class="relative inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-md hover:bg-surface-1 transition-colors"
				aria-label="알림"
			>
				<Bell size={14} class="sm:w-4 sm:h-4 text-text-base" />
				<!-- 새로운 알림 표시 점 -->
				<span class="absolute -top-1 -right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style="background-color: var(--brand-pink);"></span>
			</button>

			<!-- 테마 토글 -->
			<ThemeToggle />
		</div>
	</div>
</header>
