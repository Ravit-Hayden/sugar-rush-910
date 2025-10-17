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
		Settings,
		PanelLeftOpen,
		PanelLeftClose,
		PanelsTopLeft
	} from 'lucide-svelte';

	let sidebarOpen = $state(false);
	let sidebarCollapsed = $state(true); // 기본값을 true로 변경 (축소 상태)
	let isSearching = $state(false);
	let sidebarToggleHovered = $state(false);
	let sidebarToggleClicked = $state(false);
	let isMobile = $state(false); // 모바일 화면 크기 추적

	// 화면 크기 감지 함수
	function checkScreenSize() {
		if (typeof window !== 'undefined') {
			isMobile = window.innerWidth < 768;
		}
	}

	// 키보드 이벤트 핸들러
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			sidebarOpen = false;
		}
	}

	// 사이드바 토글 핸들러
	function handleSidebarToggle() {
		sidebarToggleClicked = true;
		setTimeout(() => {
			sidebarToggleClicked = false;
		}, 150);
		
		// 브라우저 환경에서만 실행
		if (typeof window !== 'undefined') {
			// 데스크톱에서는 축소/확장 토글
			if (window.innerWidth >= 768) {
				sidebarCollapsed = !sidebarCollapsed;
				console.log('Desktop sidebar toggle - collapsed:', sidebarCollapsed);
				
				// 메인 콘텐츠에 사이드바 상태 알림
				window.dispatchEvent(new CustomEvent('sidebar-collapse-change', { 
					detail: { collapsed: sidebarCollapsed } 
				}));
				// 헤더에 사이드바 너비 변경 알림
				window.dispatchEvent(new CustomEvent('sidebar-width-change', {
					detail: { width: sidebarCollapsed ? 72 : 250 }
				}));
			} else {
				// 모바일에서는 열기/닫기 토글
				sidebarOpen = !sidebarOpen;
				console.log('Mobile sidebar toggle - open:', sidebarOpen);
				
				window.dispatchEvent(new CustomEvent('sidebar-toggle', { 
					detail: { open: sidebarOpen } 
				}));
			}
		}
	}

	// 이벤트 리스너 등록
	onMount(() => {
		const handleSearchChange = (event: CustomEvent) => {
			isSearching = event.detail.show;
			// 강제 리렌더링을 위해 상태 업데이트
			isSearching = isSearching;
		};

		const handleResize = () => {
			checkScreenSize();
		};
		
		if (typeof window !== 'undefined') {
			// 초기 화면 크기 확인
			checkScreenSize();
			
			window.addEventListener('search-change', handleSearchChange as EventListener);
			window.addEventListener('keydown', handleKeydown);
			window.addEventListener('resize', handleResize);
		}
		
		return () => {
			if (typeof window !== 'undefined') {
				window.removeEventListener('search-change', handleSearchChange as EventListener);
				window.removeEventListener('keydown', handleKeydown);
				window.removeEventListener('resize', handleResize);
			}
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

<!-- 사이드바 컨테이너 - 애니메이션은 여기에만 적용 -->
	<aside 
		class="top-0 fixed left-0 h-screen bg-surface-2 border-r border-border-subtle z-50 overflow-hidden"
		class:w-[72px]={sidebarCollapsed}
		class:w-[250px]={!sidebarCollapsed}
		style="transition: width 200ms ease-in-out, transform 200ms ease-in-out;"
	>
	<!-- 내부 컨텐츠 - overflow: hidden으로 튀어나오지 않게 처리 -->
	<div class="h-full w-full overflow-hidden">
		<nav class="h-full flex flex-col">
			<!-- 상단 토글 버튼과 로고 섹션 - 아이콘 위치 고정 -->
			<div class="flex items-center h-20 border-b border-border-subtle flex-shrink-0 px-6">
				<!-- 토글 버튼 - 항상 왼쪽 고정 위치 -->
				<div class="flex-shrink-0 w-6 h-6">
					<button
						onclick={handleSidebarToggle}
						onmouseenter={() => { if (!isMobile) sidebarToggleHovered = true; }}
						onmouseleave={() => { if (!isMobile) sidebarToggleHovered = false; }}
						class="inline-flex items-center justify-center w-6 h-6 rounded-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-0"
						aria-label="사이드바 토글"
						title="사이드바 토글"
					>
						{#if isMobile}
							<!-- 모바일에서는 항상 PanelsTopLeft 아이콘 표시 (호버 효과 없음) -->
							<PanelsTopLeft 
								size={20} 
								class="transition-colors duration-200 ease-in-out {sidebarToggleClicked ? 'text-brand-pink' : 'text-brand-pink'}" 
							/>
						{:else if sidebarCollapsed}
							<!-- 데스크톱에서 축소 상태일 때 -->
							<PanelLeftOpen 
								size={20} 
								class="transition-colors duration-200 ease-in-out {sidebarToggleClicked ? 'text-brand-pink' : sidebarToggleHovered ? 'text-hover-cyan' : 'text-brand-pink'}" 
							/>
						{:else}
							<!-- 데스크톱에서 확장 상태일 때 -->
							<PanelLeftClose 
								size={20} 
								class="transition-colors duration-200 ease-in-out {sidebarToggleClicked ? 'text-brand-pink' : sidebarToggleHovered ? 'text-hover-cyan' : 'text-brand-pink'}" 
							/>
						{/if}
					</button>
				</div>
				
				<!-- 로고 - 메뉴 텍스트와 완전히 동일한 애니메이션 -->
				<div class="sidebar-text-animation ml-3 {sidebarCollapsed ? 'collapsed' : 'expanded'}">
					<img src="/logo.svg" alt="Sugar Rush" class="h-6 w-auto" />
				</div>
			</div>

			<!-- 메뉴 아이템들 - 아이콘 위치 고정 -->
			<ul class="space-y-0 flex-1 overflow-hidden">
			{#each menuItems as item (item.label)}
				{@const IconComponent = item.icon}
				<li class="overflow-hidden">
					<a
						href={item.href}
						onclick={(e) => handleMenuClick(e, item.href)}
						class="sidebar-menu-item flex items-center h-12 w-full text-text-base transition-colors duration-200 ease-in-out px-6 {isActive(item.href) ? 'active' : ''}"
						style="outline: none;"
						title={sidebarCollapsed ? item.label : ''}
					>
						<!-- 아이콘 - 항상 왼쪽 고정 위치 -->
						<div class="flex-shrink-0 w-5 h-5 flex items-center justify-center">
							<IconComponent size={20} class="lucide-icon transition-colors duration-200 ease-in-out" />
						</div>
						
						<!-- 텍스트 - 로고와 완전히 동일한 애니메이션 -->
						<div class="sidebar-text-animation ml-3 {sidebarCollapsed ? 'collapsed' : 'expanded'}">
							<span class="text-sm whitespace-nowrap hidden md:inline">{item.label}</span>
						</div>
					</a>
				</li>
			{/each}
			</ul>
		</nav>
	</div>
</aside>

<!-- 모바일에서는 오버레이 없이 메인 콘텐츠가 밀려나도록 함 -->
