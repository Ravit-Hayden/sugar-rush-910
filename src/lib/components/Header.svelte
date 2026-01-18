<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Search, Bell, X, Loader2, Clock, Trash2 } from 'lucide-svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	// 검색 관련 상태
	let searchValue = $state('');
	let searchIconHovered = $state(false);
	let searchFocused = $state(false);
	let searchResults = $state<{ 
		exact: { id: string; title: string; type: string; href: string }[];
		similar: { id: string; title: string; type: string; href: string }[];
	}>({ exact: [], similar: [] });
	let searchLoading = $state(false);

	// 검색 히스토리 상태
	let searchHistory = $state<string[]>([]);
	let showHistory = $state(false);
	const HISTORY_KEY = 'sugar-rush-search-history';
	const MAX_HISTORY = 10;

	// 이전 페이지 경로 저장
	let previousPath = $state('');

	// 검색 히스토리 로드
	function loadHistory(): string[] {
		if (typeof window === 'undefined') return [];
		try {
			const saved = localStorage.getItem(HISTORY_KEY);
			return saved ? JSON.parse(saved) : [];
		} catch {
			return [];
		}
	}

	// 검색 히스토리 저장
	function saveHistory(history: string[]) {
		if (typeof window === 'undefined') return;
		try {
			localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
		} catch {
			// localStorage 오류 무시
		}
	}

	// 검색어를 히스토리에 추가
	function addToHistory(query: string) {
		if (!query.trim()) return;
		// 중복 제거 후 맨 앞에 추가
		const filtered = searchHistory.filter(h => h !== query);
		searchHistory = [query, ...filtered].slice(0, MAX_HISTORY);
		saveHistory(searchHistory);
	}

	// 히스토리 항목 삭제
	function removeFromHistory(query: string, e: Event) {
		e.stopPropagation();
		e.preventDefault();
		searchHistory = searchHistory.filter(h => h !== query);
		saveHistory(searchHistory);
	}

	// 히스토리 전체 삭제
	function clearHistory(e: Event) {
		e.stopPropagation();
		e.preventDefault();
		searchHistory = [];
		saveHistory([]);
	}

	// 히스토리 항목 클릭 시 검색 실행
	function searchFromHistory(query: string) {
		searchValue = query;
		showHistory = false;
		performSearch(query);
	}

	// 알림 관련 상태
	let notificationHovered = $state(false);
	let notificationClicked = $state(false);

	// 사이드바 너비 연동
	let sidebarWidth = $state(72);
	let isMounted = $state(false);

	// 검색 디바운스 타이머
	let searchTimeout: ReturnType<typeof setTimeout>;
	let searchInput: HTMLInputElement;

	// 메뉴 아이템 정의
	const menuItems = [
		{ href: '/', label: '대시보드' },
		{ href: '/feedback', label: '피드백·알림 센터' },
		{ href: '/collaboration', label: '제작·협업 보드' },
		{ href: '/calendar', label: '일정·캘린더' },
		{ href: '/suno', label: 'SUNO 제작' },
		{ href: '/upload', label: '음원 관리' },
		{ href: '/tracks', label: '트랙 관리' },
		{ href: '/albums', label: '앨범 관리' },
		{ href: '/music-videos', label: '뮤직비디오 센터' },
		{ href: '/releases', label: '발매 관리' },
		{ href: '/revenue', label: '수익 관리' },
		{ href: '/security', label: '보안·운영 관리' },
		{ href: '/settings', label: '설정' }
	];

	// 현재 페이지 제목 가져오기
	function getPageTitle(pathname: string): string {
		const exactMatch = menuItems.find(item => item.href === pathname);
		if (exactMatch) return exactMatch.label;
		
		const partialMatch = menuItems.find(item => 
			item.href !== '/' && pathname.startsWith(item.href)
		);
		if (partialMatch) return partialMatch.label;
		
		return '대시보드';
	}

	// 검색 실행
	async function performSearch(query: string) {
		searchLoading = true;

		try {
			const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=8`);
			const data = await response.json() as { 
				ok: boolean; 
				data: { 
					exact: { id: string; title: string; type: string; href: string; coverImage?: string }[];
					similar: { id: string; title: string; type: string; href: string; coverImage?: string; recommendReason?: string }[];
				} 
			};
			
			if (data.ok) {
				// 정확한 검색 결과와 추천 항목 모두 전달
				searchResults = data.data;
				// 검색어를 히스토리에 추가
				addToHistory(query);
				// 히스토리 드롭다운 숨기기
				showHistory = false;
			} else {
				searchResults = { exact: [], similar: [] };
			}
		} catch (error) {
			console.error('Search error:', error);
			searchResults = { exact: [], similar: [] };
		} finally {
			searchLoading = false;
			notifySearchChange();
		}
	}

	// 검색어 변경 시 디바운스 처리
	function handleSearchInput() {
		clearTimeout(searchTimeout);
		
		// 검색 시작 시 현재 경로 저장 (아직 저장 안 된 경우만)
		if (!previousPath && typeof window !== 'undefined') {
			previousPath = window.location.pathname;
		}
		
		searchTimeout = setTimeout(() => {
			if (searchValue.trim()) {
				performSearch(searchValue);
			} else {
				searchResults = { exact: [], similar: [] };
				notifySearchChange();
			}
		}, 300);
	}

	// 검색 초기화 (이전 페이지로 돌아가기 옵션)
	function clearSearch(goBack: boolean = true) {
		const hadSearch = searchValue.trim().length > 0;
		const savedPreviousPath = previousPath;
		
		// 상태 초기화
		searchValue = '';
		searchResults = { exact: [], similar: [] };
		previousPath = '';
		
		if (typeof window !== 'undefined') {
			// 메인 페이지에 검색 종료 알림
			window.dispatchEvent(new CustomEvent('search-change', {
				detail: { query: '', results: { exact: [], similar: [] }, show: false }
			}));
			
			// 검색이 활성화되어 있었고, 이전 경로가 있으면 돌아가기
			if (goBack && hadSearch && savedPreviousPath && savedPreviousPath !== window.location.pathname) {
				goto(savedPreviousPath);
			}
		}
	}

	// 검색 결과를 메인 페이지로 전달
	function notifySearchChange() {
		if (typeof window !== 'undefined') {
			const shouldShow = searchValue.trim().length > 0;
			window.dispatchEvent(new CustomEvent('search-change', {
				detail: { query: searchValue, results: searchResults, show: shouldShow }
			}));
		}
	}

	// 키보드 이벤트 처리
	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			e.preventDefault();
			clearSearch(true);
			searchInput?.blur();
		}
	}

	// 포커스 시 현재 경로 저장 및 히스토리 표시
	function handleFocus() {
		searchFocused = true;
		// 검색어가 없고 이전 경로가 저장 안 된 경우에만 저장
		if (!searchValue.trim() && !previousPath && typeof window !== 'undefined') {
			previousPath = window.location.pathname;
		}
		// 검색어가 없고 히스토리가 있으면 히스토리 드롭다운 표시
		if (!searchValue.trim() && searchHistory.length > 0) {
			showHistory = true;
		}
	}

	// 알림 버튼 클릭 처리
	function handleNotificationClick() {
		notificationClicked = true;
		setTimeout(() => {
			notificationClicked = false;
		}, 150);
		
		clearSearch(false);
		if (typeof window !== 'undefined') {
			goto('/feedback');
		}
	}

	// 이벤트 리스너 등록
	$effect(() => {
		if (typeof window === 'undefined') {
			return () => {};
		}

		isMounted = true;
		// 검색 히스토리 로드
		searchHistory = loadHistory();

		const handleSearchClear = () => {
			clearSearch(false);
		};

		const handleSidebarWidthChange = (event: CustomEvent) => {
			sidebarWidth = event.detail.width;
		};

		window.addEventListener('search-clear', handleSearchClear);
		window.addEventListener('sidebar-width-change', handleSidebarWidthChange as EventListener);

		return () => {
			window.removeEventListener('search-clear', handleSearchClear);
			window.removeEventListener('sidebar-width-change', handleSidebarWidthChange as EventListener);
		};
	});

	// 키보드 단축키: Ctrl+K 또는 Cmd+K로 검색창 포커스
	$effect(() => {
		if (typeof window === 'undefined') {
			return () => {};
		}

		function handleGlobalKeyDown(e: KeyboardEvent) {
			if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
				if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
					return;
				}
				e.preventDefault();
				if (searchInput) {
					searchInput.focus();
					searchInput.select();
				}
			}
		}

		document.addEventListener('keydown', handleGlobalKeyDown);
		return () => {
			document.removeEventListener('keydown', handleGlobalKeyDown);
		};
	});

	// 페이지 경로 변경 감지 - 다른 메뉴 이동 시 검색 초기화
	let lastPathname = $state('');
	$effect(() => {
		const currentPath = $page.url.pathname;
		
		// 첫 로드가 아니고, 경로가 변경되었고, 검색어가 있으면 초기화
		if (lastPathname && lastPathname !== currentPath && searchValue.trim()) {
			clearSearch(false);
		}
		
		lastPathname = currentPath;
	});
</script>

<header class="h-20 px-6 fixed top-0 left-0 right-0 z-[60] bg-bg" style="margin-left: {sidebarWidth}px;">
	<div class="flex h-full items-center justify-between">
		<!-- 왼쪽 섹션: 페이지 제목 -->
		<div class="flex items-center gap-4">
			<div class="hidden md:flex items-center flex-shrink-0">
				{#if searchValue.trim()}
					<div class="flex items-center gap-2">
						<h2 class="text-sm sm:text-base font-semibold truncate" style="color: var(--brand-pink);">
							검색 결과
						</h2>
						{#if searchResults?.exact?.length > 0}
							<span class="text-xs text-text-muted flex-shrink-0">
								({searchResults.exact.length}개)
							</span>
						{/if}
					</div>
				{:else}
					<h2 class="text-sm sm:text-base font-semibold truncate" style="color: var(--brand-pink);">
						{getPageTitle($page.url.pathname)}
					</h2>
				{/if}
			</div>
		</div>

		<!-- 오른쪽 섹션: 검색창, 알림 버튼, 테마 토글 -->
		<div class="flex items-center gap-2 sm:gap-4 flex-1 justify-end">
			<!-- 검색창 (반응형 크기, 입력 시 크기 변화 없음) -->
			<div class="search-container relative w-full min-w-[120px] sm:min-w-[160px] md:min-w-[200px] lg:min-w-[240px] xl:min-w-[280px] max-w-[320px]">
				<!-- 검색 아이콘 또는 로딩 스피너 -->
				{#if searchLoading}
					<Loader2 
						size={16} 
						class="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-pink animate-spin"
						aria-hidden="true"
					/>
				{:else}
					<Search 
						size={16} 
						class="absolute left-3 top-1/2 transform -translate-y-1/2 lucide-icon lucide-search {searchValue || searchFocused ? 'text-brand-pink' : searchIconHovered ? 'text-hover-cyan' : 'text-text-base'}"
						aria-hidden="true"
					/>
				{/if}
				
				<input
					bind:this={searchInput}
					bind:value={searchValue}
					type="text"
					placeholder="검색..."
					aria-label="검색"
					aria-describedby="search-description"
					class="pl-10 pr-10 py-1.5 w-full bg-surface-1 border border-border-subtle rounded-md text-text-base placeholder-text-muted focus:outline-none focus:ring-0"
					onmouseenter={() => searchIconHovered = true}
					onmouseleave={() => searchIconHovered = false}
					onfocus={handleFocus}
					onblur={() => { searchFocused = false; setTimeout(() => { showHistory = false; }, 200); }}
					oninput={handleSearchInput}
					onkeydown={handleKeyDown}
				/>
				
				<!-- X 버튼 (검색어가 있을 때만 표시) -->
				{#if searchValue.trim()}
					<button
						type="button"
						onclick={() => clearSearch(true)}
						class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center bg-transparent text-text-muted hover:text-hover-point hover:bg-transparent focus:text-brand-pink focus:bg-transparent transition-colors"
						aria-label="검색 초기화"
					>
						<X size={16} />
					</button>
				{/if}
				<span id="search-description" class="sr-only">Ctrl+K로 포커스, ESC로 닫기</span>

				<!-- 검색 히스토리 드롭다운 -->
				{#if showHistory && searchHistory.length > 0 && !searchValue.trim()}
					<div class="absolute top-full left-0 right-0 mt-1 bg-surface-1 border border-border-subtle rounded-md shadow-lg z-50 overflow-hidden">
						<div class="flex items-center justify-between px-3 py-2 border-b border-border-subtle">
							<span class="text-xs text-text-muted">최근 검색어</span>
							<button
								type="button"
								onclick={clearHistory}
								class="text-xs text-text-muted hover:text-hover-point transition-colors"
							>
								전체 삭제
							</button>
						</div>
						<div class="max-h-48 overflow-y-auto custom-list-scrollbar">
							{#each searchHistory as historyItem}
								<div 
									class="flex items-center justify-between px-3 py-2 hover:bg-surface-2 transition-colors group cursor-pointer"
									onclick={() => searchFromHistory(historyItem)}
									onkeydown={(e) => e.key === 'Enter' && searchFromHistory(historyItem)}
									role="option"
									aria-selected="false"
									tabindex="0"
								>
									<span class="flex items-center gap-2 text-sm text-text-base group-hover:text-hover-point">
										<Clock size={14} class="text-text-muted" />
										{historyItem}
									</span>
									<button
										type="button"
										onclick={(e) => removeFromHistory(historyItem, e)}
										class="opacity-0 group-hover:opacity-100 text-text-muted hover:text-brand-pink transition-all"
										aria-label="삭제"
									>
										<X size={14} />
									</button>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>

			<!-- 알림 버튼 -->
			<div class="flex items-center flex-shrink-0">
				<button
					type="button"
					class="notification-button relative inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-md focus:outline-none focus:ring-0"
					onclick={handleNotificationClick}
					onmouseenter={() => notificationHovered = true}
					onmouseleave={() => notificationHovered = false}
					aria-label="알림"
				>
					<Bell 
						size={14} 
						class="sm:w-4 sm:h-4 lucide-icon {notificationClicked ? 'text-brand-pink' : isMounted && $page.url.pathname.startsWith('/feedback') ? 'text-brand-pink' : notificationHovered ? 'text-hover-cyan' : 'text-text-base'}" 
					/>
					{#if isMounted && !$page.url.pathname.startsWith('/feedback')}
						<span 
							class="notification-dot absolute -top-0.5 -right-0.5 w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full"
							style="background-color: {notificationClicked ? 'var(--brand-pink)' : notificationHovered ? 'var(--hover-cyan)' : 'var(--brand-pink)'};"
						></span>
					{/if}
				</button>
			</div>

			<!-- 테마 토글 -->
			<div class="flex items-center flex-shrink-0">
				<ThemeToggle />
			</div>
		</div>
	</div>
</header>
