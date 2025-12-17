<script lang="ts">
	import { page } from '$app/stores';
	import { Search, Bell, X } from 'lucide-svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	let sidebarWidth = $state(72); // 기본값: 축소 상태
	let searchInput: HTMLInputElement;
	let searchValue = $state('');

	// 메뉴 아이템 정의 (사이드바와 동일)
	const menuItems = [
		{ href: '/', label: '대시보드' },
		{ href: '/albums', label: '앨범 관리' },
		{ href: '/tracks', label: '트랙 관리' },
		{ href: '/music-videos', label: '뮤직비디오 센터' },
		{ href: '/upload', label: '업로드·검증 센터' },
		{ href: '/collaboration', label: '제작·협업 보드' },
		{ href: '/releases', label: '발매 관리' },
		{ href: '/revenue', label: '수익 관리' },
		{ href: '/calendar', label: '일정·캘린더' },
		{ href: '/feedback', label: '피드백·알림 센터' },
		{ href: '/security', label: '보안·운영 관리' },
		{ href: '/settings', label: '설정' }
	];

	// 현재 페이지 제목 가져오기 (함수로 변경)
	function getPageTitle(pathname: string): string {
		const exactMatch = menuItems.find(item => item.href === pathname);
		if (exactMatch) return exactMatch.label;
		
		const partialMatch = menuItems.find(item => 
			item.href !== '/' && pathname.startsWith(item.href)
		);
		if (partialMatch) return partialMatch.label;
		
		return '대시보드';
	}

	// 사이드바 너비 변경 이벤트 처리
	$effect(() => {
		if (typeof window === 'undefined') {
			return () => {}; // SSR 시 빈 cleanup 함수 반환
		}

		const handleSidebarWidthChange = (event: CustomEvent) => {
			sidebarWidth = event.detail.width;
		};

		window.addEventListener('sidebar-width-change', handleSidebarWidthChange as EventListener);

		return () => {
			if (typeof window !== 'undefined') {
				window.removeEventListener('sidebar-width-change', handleSidebarWidthChange as EventListener);
			}
		};
	});

	// 키보드 단축키: Ctrl+K 또는 Cmd+K로 검색창 포커스
	$effect(() => {
		if (typeof window === 'undefined') {
			return () => {}; // SSR 시 빈 cleanup 함수 반환
		}

		function handleKeyDown(e: KeyboardEvent) {
			// Ctrl+K (Windows/Linux) 또는 Cmd+K (Mac)
			if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
				// input 필드에 포커스가 있으면 기본 동작 허용
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

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	});
</script>

<header class="h-20 px-6 fixed top-0 left-0 right-0 z-[60] bg-bg transition-all duration-300" style="margin-left: {sidebarWidth}px;">
	<div class="flex h-full items-center justify-between">
		<!-- 왼쪽 섹션: 페이지 제목 -->
		<div class="flex items-center gap-4">
			<div class="hidden md:flex items-center flex-shrink-0">
				<h2 class="text-sm sm:text-base font-semibold truncate" style="color: var(--brand-pink);">
					{getPageTitle($page.url.pathname)}
				</h2>
			</div>
		</div>

		<!-- 오른쪽 섹션: 검색창, 알림, 테마 토글 -->
		<div class="flex items-center gap-2 sm:gap-4 flex-1 justify-end">
			<!-- 검색창 -->
			<div class="flex items-center search-container group">
				<div class="relative w-full min-w-[120px] sm:min-w-[160px] md:min-w-[200px] lg:min-w-[240px] xl:min-w-[280px] max-w-[320px]">
					<Search size={16} class="absolute left-3 top-1/2 transform -translate-y-1/2 lucide-icon lucide-search" aria-hidden="true" />
					<input
						type="text"
						placeholder="검색..."
						bind:this={searchInput}
						bind:value={searchValue}
						aria-label="검색"
						aria-describedby="search-description"
						class="pl-10 {searchValue.trim() ? 'pr-10' : 'pr-4'} py-1.5 w-full bg-surface-1 border border-border-subtle border-[1px] rounded-md text-text-base placeholder-text-muted focus:outline-none focus:ring-0 transition-colors duration-200"
					/>
					{#if searchValue.trim()}
						<button
							type="button"
							onclick={() => {
								searchValue = '';
								searchInput?.focus();
							}}
							class="search-clear-button absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center bg-transparent hover:bg-transparent focus:bg-transparent focus-visible:bg-transparent"
							aria-label="검색 초기화"
						>
							<X size={16} class="lucide-icon" />
						</button>
					{/if}
					<span id="search-description" class="sr-only">Ctrl+K 또는 Cmd+K를 눌러 검색창에 포커스할 수 있습니다</span>
				</div>
			</div>

			<!-- 알림 버튼 -->
			<div class="flex items-center flex-shrink-0">
				<a href="/feedback" class="notification-button relative inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-md transition-colors focus:outline-none focus:ring-0" aria-label="알림">
					<Bell 
						size={14} 
						class="sm:w-4 sm:h-4 transition-colors lucide-icon {$page.url.pathname.startsWith('/feedback') ? 'text-brand-pink' : 'text-text-base'}" 
					/>
					{#if !$page.url.pathname.startsWith('/feedback')}
						<span class="notification-dot absolute -top-0.5 -right-0.5 w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full" style="background-color: var(--brand-pink);"></span>
					{/if}
				</a>
			</div>

			<!-- 테마 토글 -->
			<div class="flex items-center flex-shrink-0">
				<ThemeToggle />
			</div>
		</div>
	</div>
</header>