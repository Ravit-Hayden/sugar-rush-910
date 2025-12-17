<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import {
		LayoutGrid, Disc3, Music, FolderOpen, Heart, Rocket,
		DollarSign, Calendar, MessageSquare, Shield, Settings,
		PanelLeftOpen, PanelLeftClose, PanelsTopLeft, Video
	} from 'lucide-svelte';

	let sidebarOpen = $state(false);
	let sidebarCollapsed = $state(true); // 기본값: 축소 상태
	let isSearching = $state(false);
	let sidebarToggleHovered = $state(false);
	let sidebarToggleClicked = $state(false);
	let isMobile = $state(false); // 모바일 화면 크기 추적

	// 화면 크기 감지 함수
	function checkScreenSize() {
		if (typeof window !== 'undefined') {
			const wasMobile = isMobile;
			isMobile = window.innerWidth < 768;
			
			// 화면 크기가 변경될 때 사이드바 상태 조정
			if (wasMobile !== isMobile) {
				if (isMobile) {
					// 모바일로 전환될 때: 사이드바를 축소 상태로 강제 설정
					sidebarCollapsed = true;
					sidebarOpen = false;
					window.dispatchEvent(new CustomEvent('sidebar-collapse-change', { 
						detail: { collapsed: true } 
					}));
					window.dispatchEvent(new CustomEvent('sidebar-width-change', {
						detail: { width: 72 }
					}));
				} else {
					// 데스크톱으로 전환될 때: 기본 축소 상태 유지
					sidebarCollapsed = true;
					sidebarOpen = false;
					window.dispatchEvent(new CustomEvent('sidebar-collapse-change', { 
						detail: { collapsed: true } 
					}));
					window.dispatchEvent(new CustomEvent('sidebar-width-change', {
						detail: { width: 72 }
					}));
				}
			}
		}
	}

	// 사이드바 토글 핸들러
	function handleSidebarToggle() {
		sidebarToggleClicked = true;
		setTimeout(() => {
			sidebarToggleClicked = false;
		}, 150);
		
		if (typeof window !== 'undefined') {
			// 데스크톱: 축소/확장 토글
			if (window.innerWidth >= 768) {
				sidebarCollapsed = !sidebarCollapsed;
				window.dispatchEvent(new CustomEvent('sidebar-collapse-change', { 
					detail: { collapsed: sidebarCollapsed } 
				}));
				window.dispatchEvent(new CustomEvent('sidebar-width-change', {
					detail: { width: sidebarCollapsed ? 72 : 250 }
				}));
			} else {
				// 모바일: 열기/닫기 토글
				sidebarOpen = !sidebarOpen;
				window.dispatchEvent(new CustomEvent('sidebar-toggle', { 
					detail: { open: sidebarOpen } 
				}));
			}
		}
	}

	// 메뉴 아이템 정의
	const menuItems = [
		{ icon: LayoutGrid, label: '대시보드', href: '/' },
		{ icon: Disc3, label: '앨범 관리', href: '/albums' },
		{ icon: Music, label: '트랙 관리', href: '/tracks' },
		{ icon: Video, label: '뮤직비디오 센터', href: '/music-videos' },
		{ icon: FolderOpen, label: '업로드·검증 센터', href: '/upload' },
		{ icon: Heart, label: '제작·협업 보드', href: '/collaboration' },
		{ icon: Rocket, label: '발매 관리', href: '/releases' },
		{ icon: DollarSign, label: '수익 관리', href: '/revenue' },
		{ icon: Calendar, label: '일정·캘린더', href: '/calendar' },
		{ icon: MessageSquare, label: '피드백·알림 센터', href: '/feedback' },
		{ icon: Shield, label: '보안·운영 관리', href: '/security' },
		{ icon: Settings, label: '설정', href: '/settings' }
	];

	// 현재 페이지 활성화 확인
	function isActive(href: string): boolean {
		if (isSearching) return false;
		const currentPath = $page.url.pathname;
		return href === '/' ? currentPath === '/' : currentPath.startsWith(href);
	}

	// 메뉴 클릭 처리
	function handleMenuClick(event: Event, href: string) {
		if (isSearching) {
			window.dispatchEvent(new CustomEvent('search-clear'));
		}
	}

	// 컴포넌트 마운트 시 초기화
	onMount(() => {
		// 초기 화면 크기 확인
		checkScreenSize();
		
		// 초기 사이드바 상태를 헤더에 알림
		if (typeof window !== 'undefined') {
			window.dispatchEvent(new CustomEvent('sidebar-width-change', {
				detail: { width: sidebarCollapsed ? 72 : 250 }
			}));
		}
		
		// 리사이즈 이벤트 리스너
		const handleResize = () => {
			checkScreenSize();
		};
		
		// ui.js에서 발생하는 사이드바 토글 이벤트 수신
		const handleSidebarToggle = (event: CustomEvent) => {
			const newState = event.detail.state;
			sidebarCollapsed = newState === 'collapsed';
			
			// 헤더에 상태 변경 알림
			window.dispatchEvent(new CustomEvent('sidebar-width-change', {
				detail: { width: sidebarCollapsed ? 72 : 250 }
			}));
		};
		
		if (typeof window !== 'undefined') {
			window.addEventListener('resize', handleResize);
			window.addEventListener('sidebar-toggle', handleSidebarToggle as EventListener);
		}
		
		return () => {
			if (typeof window !== 'undefined') {
				window.removeEventListener('resize', handleResize);
				window.removeEventListener('sidebar-toggle', handleSidebarToggle as EventListener);
			}
		};
	});
</script>

<!-- 사이드바 컨테이너 -->
<aside 
	class="top-0 fixed left-0 h-screen bg-surface-2 sidebar-border-right z-50 overflow-hidden"
	style="width: {sidebarCollapsed ? '72px' : '250px'}; transition: width 200ms ease-in-out, transform 200ms ease-in-out;"
>
	<div class="h-full w-full overflow-hidden">
		<nav class="h-full flex flex-col">
			<!-- 상단 토글 버튼과 로고 -->
			<div class="flex items-center h-20 border-b border-border-subtle flex-shrink-0 px-6">
				<!-- 상태 표시 아이콘 (클릭 불가, 호버 효과 완전 차단) -->
				{#if isMobile}
					<div class="flex-shrink-0 w-6 h-6 inline-flex items-center justify-center pointer-events-none" style="color: var(--brand-pink) !important;">
						<PanelsTopLeft 
							size={20} 
							style="color: var(--brand-pink) !important; pointer-events: none;"
						/>
					</div>
				{:else}
					<!-- 토글 버튼 (클릭 가능) -->
					<button
						onclick={handleSidebarToggle}
						onmouseenter={() => sidebarToggleHovered = true}
						onmouseleave={() => sidebarToggleHovered = false}
						class="flex-shrink-0 w-6 h-6 inline-flex items-center justify-center rounded-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-0 cursor-pointer"
						aria-label="사이드바 토글"
						type="button"
						data-action="toggle-sidebar"
					>
						{#if sidebarCollapsed}
							<PanelLeftOpen 
								size={20} 
								class="transition-colors duration-200 ease-in-out {sidebarToggleClicked ? 'text-brand-pink' : sidebarToggleHovered ? 'text-hover-cyan' : 'text-brand-pink'}" 
							/>
						{:else}
							<PanelLeftClose 
								size={20} 
								class="transition-colors duration-200 ease-in-out {sidebarToggleClicked ? 'text-brand-pink' : sidebarToggleHovered ? 'text-hover-cyan' : 'text-brand-pink'}" 
							/>
						{/if}
					</button>
				{/if}
				
				<!-- 로고 -->
				<div class="sidebar-text-animation ml-3 {sidebarCollapsed ? 'collapsed' : 'expanded'}">
					<img src="/logo.svg" alt="Sugar Rush" class="h-6 w-auto" />
				</div>
			</div>

			<!-- 메뉴 아이템들 -->
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
						aria-current={isActive(item.href) ? 'page' : undefined}
					>
						<!-- 아이콘 -->
						<div class="flex-shrink-0 w-5 h-5 flex items-center justify-center">
							<IconComponent size={20} class="lucide-icon transition-colors duration-200 ease-in-out" />
						</div>
						
						<!-- 텍스트 -->
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
