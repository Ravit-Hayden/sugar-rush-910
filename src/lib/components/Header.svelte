<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { Search, Bell, X } from 'lucide-svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	let searchValue = '';
	let searchIconHovered = false;
	let searchFocused = false;
	let searchResults: { 
		exact: { id: string; title: string; type: string; href: string }[];
		similar: { id: string; title: string; type: string; href: string }[];
	} = { exact: [], similar: [] };
	let searchLoading = false;
	let notificationHovered = false;
	let notificationClicked = false;
	let sidebarWidth = 72; // 기본값은 축소 상태
	let isMobile = false; // 모바일 화면 크기 추적

	// 메뉴 아이템 정의 (사이드바와 동일)
	const menuItems = [
		{ href: '/', label: '대시보드' },
		{ href: '/albums', label: '앨범 관리' },
		{ href: '/tracks', label: '트랙 관리' },
		{ href: '/upload', label: '업로드·검증 센터' },
		{ href: '/collaboration', label: '제작·협업 보드' },
		{ href: '/releases', label: '발매 관리' },
		{ href: '/revenue', label: '수익 관리' },
		{ href: '/calendar', label: '일정·캘린더' },
		{ href: '/feedback', label: '피드백·알림 센터' },
		{ href: '/security', label: '보안·운영 관리' },
		{ href: '/settings', label: '설정' }
	];

	// 현재 페이지에 해당하는 메뉴명 가져오기
	function getCurrentPageTitle(): string {
		const currentPath = $page.url.pathname;
		
		// 정확한 경로 매치
		const exactMatch = menuItems.find(item => item.href === currentPath);
		if (exactMatch) {
			return exactMatch.label;
		}
		
		// 부분 경로 매치 (예: /albums/edit -> 앨범 관리)
		const partialMatch = menuItems.find(item => 
			item.href !== '/' && currentPath.startsWith(item.href)
		);
		if (partialMatch) {
			return partialMatch.label;
		}
		
		// 기본값
		return '대시보드';
	}

	// 화면 크기 감지 함수
	function checkScreenSize() {
		if (typeof window !== 'undefined') {
			const wasMobile = isMobile;
			isMobile = window.innerWidth < 768;
			
			// 모바일로 전환될 때 사이드바 너비 강제 설정
			if (!wasMobile && isMobile) {
				sidebarWidth = 72;
			} else if (wasMobile && !isMobile) {
				// 데스크톱으로 전환될 때도 기본 축소 상태 유지
				sidebarWidth = 72;
			}
		}
	}

	// 검색 초기화 이벤트 리스너
	onMount(() => {
		const handleSearchClear = () => {
			clearSearch();
		};

		const handleSidebarWidthChange = (event: CustomEvent) => {
			// 모바일이 아닐 때만 사이드바 너비 변경 허용
			if (!isMobile) {
				sidebarWidth = event.detail.width;
			}
		};

		const handleResize = () => {
			checkScreenSize();
		};

		// 초기 화면 크기 확인
		checkScreenSize();

		window.addEventListener('search-clear', handleSearchClear);
		window.addEventListener('sidebar-width-change', handleSidebarWidthChange as EventListener);
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('search-clear', handleSearchClear);
			window.removeEventListener('sidebar-width-change', handleSidebarWidthChange as EventListener);
			window.removeEventListener('resize', handleResize);
		};
	});

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

	function handleNotificationClick() {
		notificationClicked = true;
		setTimeout(() => {
			notificationClicked = false;
		}, 150);
		
		// 알림 페이지로 이동하면서 검색 초기화
		clearSearch();
		window.location.href = '/feedback';
	}
</script>

<header class="h-20 fixed top-0 left-0 right-0 z-[60] bg-bg transition-all duration-300" style="margin-left: {sidebarWidth}px; padding-left: 16px; padding-right: 16px;">
	<div class="flex h-full items-center justify-between">
		<!-- 왼쪽 섹션: 페이지 제목 (반응형 숨김/표시) -->
		<div class="flex items-center gap-4">
			<!-- 페이지 제목 (화면이 작으면 숨김, 크면 표시) -->
			<div class="hidden md:flex items-center flex-shrink-0">
				{#if searchValue.trim()}
					<div class="flex items-center gap-2">
						<h2 class="text-sm sm:text-base font-semibold truncate" style="color: var(--brand-pink);">
							검색 결과
						</h2>
						{#if searchResults?.exact?.length > 0}
							<span class="text-xs text-text-muted flex-shrink-0">
								({(searchResults?.exact?.length || 0)}개)
							</span>
						{/if}
					</div>
				{:else}
					<h2 class="text-sm sm:text-base font-semibold truncate" style="color: var(--brand-pink);">
						{getCurrentPageTitle()}
					</h2>
				{/if}
			</div>
		</div>

		<!-- 오른쪽 섹션: 검색창, 알림 버튼, 테마 토글 -->
		<div class="flex items-center gap-2 sm:gap-4 flex-1 justify-end">
			<!-- 검색창 (반응형 크기 조정) -->
			<div class="flex items-center search-container">
				<div class="relative w-full min-w-[120px] sm:min-w-[160px] md:min-w-[200px] lg:min-w-[240px] xl:min-w-[280px] max-w-[320px]">
					<Search 
						size={16} 
						class="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-base transition-colors {searchValue || searchFocused ? 'text-brand-pink' : searchIconHovered ? 'text-hover-cyan' : ''}" 
					/>
					<input
						bind:value={searchValue}
						type="text"
						placeholder="검색..."
						class="pl-10 pr-10 py-1.5 w-full bg-surface-1 border border-border-subtle border-[1px] rounded-md text-text-base placeholder-text-muted hover:border-hover-cyan focus:outline-none focus:ring-0 focus:border-[1px] focus:border-brand-pink transition-colors duration-300"
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
			</div>

			<!-- 알림 버튼 -->
			<div class="flex items-center flex-shrink-0">
				<button
					class="relative h-9 w-9 rounded-lg inline-flex items-center justify-center bg-surface-1 border border-border-subtle transition-colors focus:outline-none focus:ring-0"
					onclick={handleNotificationClick}
					onmouseenter={() => notificationHovered = true}
					onmouseleave={() => notificationHovered = false}
					aria-label="알림"
				>
					<Bell 
						size={18} 
						class="transition-colors {notificationClicked ? 'text-brand-pink' : notificationHovered ? 'text-hover-cyan' : 'text-text-base'}" 
					/>
					<!-- 새로운 알림 표시 점 -->
					<span 
						class="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full transition-colors" 
						style="background-color: {notificationClicked ? 'var(--brand-pink)' : notificationHovered ? 'var(--hover-cyan)' : 'var(--brand-pink)'};"
					></span>
				</button>
			</div>

			<!-- 테마 토글 -->
			<div class="flex items-center flex-shrink-0">
				<ThemeToggle />
			</div>
		</div>
	</div>
</header>