<script lang="ts">
	import { onMount } from 'svelte';
	import { PanelLeftOpen, PanelLeftClose, Search, Bell, X } from 'lucide-svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	let sidebarOpen = false;
	let searchValue = '';
	let searchIconHovered = false;
	let searchFocused = false;
	let searchResults: { id: string; title: string; type: string; href: string }[] = [];
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
			const data = await response.json() as { ok: boolean; data: { id: string; title: string; type: string; href: string }[] };
			
			if (data.ok) {
				searchResults = data.data;
			} else {
				searchResults = [];
			}
		} catch (error) {
			console.error('Search error:', error);
			searchResults = [];
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
			performSearch(searchValue);
		}, 300);
	}


	// 검색 초기화
	function clearSearch() {
		searchValue = '';
		searchResults = [];
		// 메인 페이지에 검색 초기화 알림
		window.dispatchEvent(new CustomEvent('search-change', {
			detail: { query: '', results: [], show: false }
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

<header class="h-24 px-6 sticky top-0 z-50 bg-bg border-b border-border-subtle">
	<div class="flex h-full items-center justify-between">
		<!-- Left Slot: 로고 + 사이드바 토글 (사이드바 영역 내에서 배치) -->
		<div class="flex items-center w-[240px]">
			<img src="/logo.svg" alt="Sugar Rush" class="h-8 w-auto" />
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
		<div class="flex items-center flex-1 justify-start">
			{#if searchValue.trim()}
				<div class="flex items-center gap-2">
					<Search size={16} class="text-brand-pink" />
					<h2 class="text-lg font-semibold" style="color: var(--brand-pink);">
						"<span class="text-brand-pink">{searchValue}</span>" 검색 결과
					</h2>
					{#if searchResults.length > 0}
						<span class="text-sm text-text-muted">({searchResults.length}개)</span>
					{/if}
				</div>
			{:else}
				<h2 class="text-lg font-semibold" style="color: var(--brand-pink);">대시보드</h2>
			{/if}
		</div>

		<!-- Right Slot: 검색창 + 알림 + 테마 토글 -->
		<div class="flex items-center gap-4">
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
					class="pl-10 pr-10 py-1.5 w-64 bg-surface-1 border border-border-subtle border-[1px] rounded-md text-text-base placeholder-text-muted hover:border-hover-cyan focus:outline-none focus:ring-0 focus:border-[1px] focus:border-brand-pink transition-colors duration-300"
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
				class="relative inline-flex items-center justify-center w-6 h-6 rounded-md hover:bg-surface-1 transition-colors"
				aria-label="알림"
			>
				<Bell size={16} class="text-text-base" />
				<!-- 새로운 알림 표시 점 -->
				<span class="absolute -top-1 -right-1 w-2 h-2 rounded-full" style="background-color: var(--brand-pink);"></span>
			</button>

			<!-- 테마 토글 -->
			<ThemeToggle />
		</div>
	</div>
</header>
