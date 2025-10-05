<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
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
	let notificationHovered = false;
	let notificationClicked = false;
	let sidebarToggleHovered = false;
	let sidebarToggleClicked = false;

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

	// 검색 초기화 이벤트 리스너
	onMount(() => {
		const handleSearchClear = () => {
			clearSearch();
		};

		// 키보드 단축키 이벤트 리스너
		const handleKeydown = (event: KeyboardEvent) => {
			// Ctrl/Cmd + B: 사이드바 토글
			if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
				event.preventDefault();
				handleSidebarToggle();
			}
			// ESC: 사이드바 닫기
			if (event.key === 'Escape' && sidebarOpen) {
				sidebarOpen = false;
				window.dispatchEvent(new CustomEvent('sidebar-toggle', { detail: { open: sidebarOpen } }));
			}
		};

		window.addEventListener('search-clear', handleSearchClear);
		window.addEventListener('keydown', handleKeydown);
		return () => {
			window.removeEventListener('search-clear', handleSearchClear);
			window.removeEventListener('keydown', handleKeydown);
		};
	});

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
		// 사이드바 상태를 전역으로 관리할 수 있도록 이벤트 발생
		window.dispatchEvent(new CustomEvent('sidebar-toggle', { detail: { open: sidebarOpen } }));
	}

	// 향상된 사이드바 토글 핸들러
	function handleSidebarToggle() {
		sidebarToggleClicked = true;
		setTimeout(() => {
			sidebarToggleClicked = false;
		}, 150);
		
		toggleSidebar();
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

<header class="h-24 px-3 sm:px-4 md:px-6 sticky top-0 z-50 bg-bg border-b border-border-subtle">
	<div class="flex h-full items-center justify-between gap-2">
		<!-- Left Slot: 사이드바 토글 + 로고 -->
		<div class="flex items-center w-[200px] sm:w-[220px] md:w-[216px] flex-shrink-0">
			<div class="flex items-center w-full">
				<button
					onclick={handleSidebarToggle}
					onmouseenter={() => sidebarToggleHovered = true}
					onmouseleave={() => sidebarToggleHovered = false}
					class="inline-flex items-center justify-center w-6 h-6 rounded-md transition-colors focus:outline-none focus:ring-0 -ml-1"
					aria-label="사이드바 토글 (Ctrl+B)"
					title="사이드바 토글 (Ctrl+B 또는 ESC로 닫기)"
				>
					{#if sidebarOpen}
						<PanelLeftClose 
							size={16} 
							class="transition-colors {sidebarToggleClicked ? 'text-brand-pink' : sidebarToggleHovered ? 'text-hover-cyan' : 'text-brand-pink'}" 
						/>
					{:else}
						<PanelLeftOpen 
							size={16} 
							class="transition-colors {sidebarToggleClicked ? 'text-brand-pink' : sidebarToggleHovered ? 'text-hover-cyan' : 'text-brand-pink'}" 
						/>
					{/if}
				</button>
				<img src="/logo.svg" alt="Sugar Rush" class="h-6 sm:h-7 md:h-8 w-auto ml-2 mr-6" />
			</div>
		</div>

		<!-- Center Slot: 페이지 타이틀 (좌측 정렬) -->
		<div class="flex items-center flex-1 justify-start min-w-0">
			{#if searchValue.trim()}
				<div class="flex items-center gap-2 min-w-0">
					<div class="flex items-center gap-2 min-w-0 max-w-full">
						<!-- 데스크톱: 전체 텍스트 표시 -->
						<div class="hidden md:flex items-center gap-2 min-w-0 max-w-full">
							<h2 class="text-lg font-semibold truncate" style="color: var(--brand-pink);">
								검색 결과
							</h2>
							{#if searchResults?.exact?.length > 0}
								<span class="text-sm text-text-muted flex-shrink-0">
									({(searchResults?.exact?.length || 0)}개)
								</span>
							{/if}
						</div>
						<!-- 태블릿: 중간 길이 텍스트 -->
						<div class="hidden sm:flex md:hidden items-center gap-2 min-w-0 max-w-full">
							<h2 class="text-base font-semibold truncate" style="color: var(--brand-pink);">
								검색 결과
							</h2>
							{#if searchResults?.exact?.length > 0}
								<span class="text-xs text-text-muted flex-shrink-0">
									({(searchResults?.exact?.length || 0)})
								</span>
							{/if}
						</div>
						<!-- 모바일: 짧은 텍스트 -->
						<div class="flex sm:hidden items-center gap-2 min-w-0 max-w-full">
							<h2 class="text-sm font-semibold truncate" style="color: var(--brand-pink);">
								검색 결과
							</h2>
							{#if searchResults?.exact?.length > 0}
								<span class="text-xs text-text-muted flex-shrink-0">
									({(searchResults?.exact?.length || 0)})
								</span>
							{/if}
						</div>
					</div>
				</div>
			{:else}
				<!-- 데스크톱: 전체 텍스트 표시 -->
				<div class="hidden md:flex items-center gap-2 min-w-0 max-w-full">
					<h2 class="text-lg font-semibold truncate" style="color: var(--brand-pink);">
						{getCurrentPageTitle()}
					</h2>
				</div>
				<!-- 태블릿: 중간 길이 텍스트 -->
				<div class="hidden sm:flex md:hidden items-center gap-2 min-w-0 max-w-full">
					<h2 class="text-base font-semibold truncate" style="color: var(--brand-pink);">
						{getCurrentPageTitle()}
					</h2>
				</div>
				<!-- 모바일: 짧은 텍스트 -->
				<div class="flex sm:hidden items-center gap-2 min-w-0 max-w-full">
					<h2 class="text-sm font-semibold truncate" style="color: var(--brand-pink);">
						{getCurrentPageTitle()}
					</h2>
				</div>
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
				class="relative inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-md transition-colors focus:outline-none focus:ring-0"
				onclick={handleNotificationClick}
				onmouseenter={() => notificationHovered = true}
				onmouseleave={() => notificationHovered = false}
				aria-label="알림"
			>
				<Bell 
					size={14} 
					class="sm:w-4 sm:h-4 transition-colors {notificationClicked ? 'text-brand-pink' : notificationHovered ? 'text-hover-cyan' : 'text-text-base'}" 
				/>
				<!-- 새로운 알림 표시 점 (절반 크기) -->
				<span 
					class="absolute -top-0.5 -right-0.5 w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full transition-colors" 
					style="background-color: {notificationClicked ? 'var(--brand-pink)' : notificationHovered ? 'var(--hover-cyan)' : 'var(--brand-pink)'};"
				></span>
			</button>

			<!-- 테마 토글 -->
			<ThemeToggle />
		</div>
	</div>
</header>
