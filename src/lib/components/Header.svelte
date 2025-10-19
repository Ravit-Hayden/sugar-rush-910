<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { Search, Bell, X } from 'lucide-svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	let sidebarWidth = 72; // 기본값: 축소 상태

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

	// 현재 페이지 제목 가져오기
	function getCurrentPageTitle(): string {
		const currentPath = $page.url.pathname;
		const exactMatch = menuItems.find(item => item.href === currentPath);
		if (exactMatch) return exactMatch.label;
		
		const partialMatch = menuItems.find(item => 
			item.href !== '/' && currentPath.startsWith(item.href)
		);
		if (partialMatch) return partialMatch.label;
		
		return '대시보드';
	}

	onMount(() => {
		const handleSidebarWidthChange = (event: CustomEvent) => {
			sidebarWidth = event.detail.width;
		};

		window.addEventListener('sidebar-width-change', handleSidebarWidthChange as EventListener);
		return () => {
			window.removeEventListener('sidebar-width-change', handleSidebarWidthChange as EventListener);
		};
	});
</script>

<header class="h-20 px-6 fixed top-0 left-0 right-0 z-[60] bg-bg transition-all duration-300" style="margin-left: {sidebarWidth}px;">
	<div class="flex h-full items-center justify-between">
		<!-- 왼쪽 섹션: 페이지 제목 -->
		<div class="flex items-center gap-4">
			<div class="hidden md:flex items-center flex-shrink-0">
				<h2 class="text-sm sm:text-base font-semibold truncate" style="color: var(--brand-pink);">
					{getCurrentPageTitle()}
				</h2>
			</div>
		</div>

		<!-- 오른쪽 섹션: 검색창, 알림, 테마 토글 -->
		<div class="flex items-center gap-2 sm:gap-4 flex-1 justify-end">
			<!-- 검색창 -->
			<div class="flex items-center search-container">
				<div class="relative w-full min-w-[120px] sm:min-w-[160px] md:min-w-[200px] lg:min-w-[240px] xl:min-w-[280px] max-w-[320px]">
					<Search size={16} class="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-base" />
					<input
						type="text"
						placeholder="검색..."
						class="pl-10 pr-10 py-1.5 w-full bg-surface-1 border border-border-subtle border-[1px] rounded-md text-text-base placeholder-text-muted hover:border-hover-cyan focus:outline-none focus:ring-0 focus:border-[1px] focus:border-brand-pink transition-colors duration-300"
					/>
				</div>
			</div>

			<!-- 알림 버튼 -->
			<div class="flex items-center flex-shrink-0">
				<button class="relative inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-md transition-colors focus:outline-none focus:ring-0" aria-label="알림" type="button">
					<Bell size={14} class="sm:w-4 sm:h-4 transition-colors text-text-base" />
					<span class="absolute -top-0.5 -right-0.5 w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full" style="background-color: var(--brand-pink);"></span>
				</button>
			</div>

			<!-- 테마 토글 -->
			<div class="flex items-center flex-shrink-0">
				<ThemeToggle />
			</div>
		</div>
	</div>
</header>