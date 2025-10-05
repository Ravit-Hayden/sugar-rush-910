<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import {
		LayoutGrid,
		Disc3,
		Music,
		FolderOpen,
		Heart,
		Rocket,
		DollarSign,
		Calendar,
		MessageSquare,
		Shield,
		Settings
	} from 'lucide-svelte';

	let sidebarOpen = $state(false);
	let sidebarCollapsed = $state(false);
	let isSearching = $state(false);

	// 키보드 이벤트 핸들러
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			sidebarOpen = false;
		}
	}

	// 이벤트 리스너 등록
	onMount(() => {
		const handleToggle = (event: CustomEvent) => {
			// 데스크톱에서는 축소/확장 토글
			if (window.innerWidth >= 768) {
				sidebarCollapsed = !sidebarCollapsed;
				// 메인 콘텐츠에 사이드바 상태 알림
				window.dispatchEvent(new CustomEvent('sidebar-collapse-change', { 
					detail: { collapsed: sidebarCollapsed } 
				}));
			} else {
				// 모바일에서는 열기/닫기 토글
				sidebarOpen = !sidebarOpen;
			}
		};

		const handleSearchChange = (event: CustomEvent) => {
			isSearching = event.detail.show;
			// 강제 리렌더링을 위해 상태 업데이트
			isSearching = isSearching;
		};
		
		window.addEventListener('sidebar-toggle', handleToggle as EventListener);
		window.addEventListener('search-change', handleSearchChange as EventListener);
		window.addEventListener('keydown', handleKeydown);
		
		return () => {
			window.removeEventListener('sidebar-toggle', handleToggle as EventListener);
			window.removeEventListener('search-change', handleSearchChange as EventListener);
			window.removeEventListener('keydown', handleKeydown);
		};
	});

	const menuItems = [
		{ icon: LayoutGrid, label: '대시보드', href: '/' },
		{ icon: Disc3, label: '앨범 관리', href: '/albums' },
		{ icon: Music, label: '트랙 관리', href: '/tracks' },
		{ icon: FolderOpen, label: '업로드·검증 센터', href: '/upload' },
		{ icon: Heart, label: '제작·협업 보드', href: '/collaboration' },
		{ icon: Rocket, label: '발매 관리', href: '/releases' },
		{ icon: DollarSign, label: '수익 관리', href: '/revenue' },
		{ icon: Calendar, label: '일정·캘린더', href: '/calendar' },
		{ icon: MessageSquare, label: '피드백·알림 센터', href: '/feedback' },
		{ icon: Shield, label: '보안·운영 관리', href: '/security' },
		{ icon: Settings, label: '설정', href: '/settings' }
	];

	// 현재 페이지가 메뉴 항목과 일치하는지 확인
	function isActive(href: string): boolean {
		// 검색 중일 때는 모든 메뉴 선택 해제
		if (isSearching) {
			return false;
		}
		
		const currentPath = $page.url.pathname;
		const isCurrentPage = href === '/' ? currentPath === '/' : currentPath.startsWith(href);
		
		return isCurrentPage;
	}

	// 메뉴 클릭 시 검색 초기화 및 페이지 이동
	function handleMenuClick(event: Event, href: string) {
		// 검색 상태라면 검색 초기화
		if (isSearching) {
			window.dispatchEvent(new CustomEvent('search-clear'));
		}
		
		// 접힌 상태에서도 페이지 이동 허용
		// 기본 링크 동작을 막지 않음
	}
</script>

	<aside class="top-24 fixed left-0 h-[calc(100vh-96px)] bg-surface-2 border-r border-border-subtle z-50 transition-all duration-500 ease-in-out {sidebarOpen ? 'translate-x-0 w-16' : '-translate-x-full w-16'} md:translate-x-0 {sidebarCollapsed ? 'md:w-16' : 'md:w-[216px]'}" style="transition: width 500ms cubic-bezier(0.4, 0, 0.2, 1), transform 500ms cubic-bezier(0.4, 0, 0.2, 1);">
		<nav class="h-full overflow-hidden">
			<ul class="space-y-0 h-full">
			{#each menuItems as item (item.label)}
				{@const IconComponent = item.icon}
				<li class="overflow-hidden">
					<a
						href={item.href}
						onclick={(e) => handleMenuClick(e, item.href)}
						class="sidebar-menu-item flex items-center h-12 w-full text-text-base transition-colors duration-200 px-6 {isActive(item.href) ? 'active' : ''}"
						style="outline: none;"
						title={sidebarCollapsed ? item.label : ''}
					>
						<IconComponent size={16} class="flex-shrink-0 lucide-icon" />
						{#if !sidebarCollapsed}
							<span class="text-sm whitespace-nowrap transition-opacity duration-300 ml-3 hidden md:inline">{item.label}</span>
						{/if}
					</a>
				</li>
			{/each}
			</ul>
		</nav>
	</aside>

<!-- 모바일에서는 오버레이 없이 메인 콘텐츠가 밀려나도록 함 -->
