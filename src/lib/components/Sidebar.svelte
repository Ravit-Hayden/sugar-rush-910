<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import {
		LayoutGrid, Disc, Music, Folder, Handshake, Globe,
		Database, Calendar, MessageSquareDot, ShieldHalf, SlidersHorizontal,
		PanelLeftOpen, PanelLeftClose, PanelsTopLeft, Film, Headphones
	} from 'lucide-svelte';

	let sidebarOpen = $state(false);
	let sidebarCollapsed = $state(true);
	let isSearching = $state(false);
	let sidebarToggleHovered = $state(false);
	let sidebarToggleClicked = $state(false);
	let isMobile = $state(false);
	let mounted = $state(false);

	// 화면 크기 감지 함수
	function checkScreenSize() {
		if (typeof window !== 'undefined') {
			const wasMobile = isMobile;
			isMobile = window.innerWidth < 768;
			
			if (wasMobile !== isMobile) {
				sidebarCollapsed = true;
				sidebarOpen = false;
				updateBodyClass(); // 모바일 전환 시에도 동기화
				window.dispatchEvent(new CustomEvent('sidebar-collapse-change', { 
					detail: { collapsed: true } 
				}));
				window.dispatchEvent(new CustomEvent('sidebar-width-change', {
					detail: { width: 72 }
				}));
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
			if (window.innerWidth >= 768) {
				sidebarCollapsed = !sidebarCollapsed;
				
				// body 클래스 동기화 (v3)
				document.body.classList.toggle('sidebar-expanded', !sidebarCollapsed);
				document.body.classList.toggle('sidebar-collapsed', sidebarCollapsed);
				
				// 기존 이벤트 시스템 유지 (호환성)
				window.dispatchEvent(new CustomEvent('sidebar-collapse-change', { 
					detail: { collapsed: sidebarCollapsed } 
				}));
				window.dispatchEvent(new CustomEvent('sidebar-width-change', {
					detail: { width: sidebarCollapsed ? 72 : 250 }
				}));
			} else {
				sidebarOpen = !sidebarOpen;
				window.dispatchEvent(new CustomEvent('sidebar-toggle', { 
					detail: { open: sidebarOpen } 
				}));
			}
		}
	}

	// 메뉴 아이템 정의 (논리적 작업 흐름 순서)
	const menuItems = [
		{ icon: LayoutGrid, label: '대시보드', href: '/' },
		{ icon: MessageSquareDot, label: '피드백·알림 센터', href: '/feedback' },
		{ icon: Handshake, label: '제작·협업 보드', href: '/collaboration' },
		{ icon: Calendar, label: '일정·캘린더', href: '/calendar' },
		{ icon: Headphones, label: 'SUNO 제작', href: '/suno' },
		{ icon: Folder, label: '음원 관리', href: '/upload' },
		{ icon: Music, label: '트랙 관리', href: '/tracks' },
		{ icon: Disc, label: '앨범 관리', href: '/albums' },
		{ icon: Film, label: '뮤직비디오 센터', href: '/music-videos' },
		{ icon: Globe, label: '발매 관리', href: '/releases' },
		{ icon: Database, label: '수익 관리', href: '/revenue' },
		{ icon: ShieldHalf, label: '보안·운영 관리', href: '/security' },
		{ icon: SlidersHorizontal, label: '설정', href: '/settings' }
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

	// body 클래스 동기화 함수
	function updateBodyClass() {
		if (typeof document !== 'undefined') {
			document.body.classList.toggle('sidebar-expanded', !sidebarCollapsed);
			document.body.classList.toggle('sidebar-collapsed', sidebarCollapsed);
		}
	}

	// 컴포넌트 마운트 시 초기화
	$effect(() => {
		if (!browser) return () => {};
		
		mounted = true;
		checkScreenSize();
		
		// 초기 body 클래스 설정
		updateBodyClass();
		
		window.dispatchEvent(new CustomEvent('sidebar-width-change', {
			detail: { width: sidebarCollapsed ? 72 : 250 }
		}));
		
		const handleResize = () => {
			checkScreenSize();
			updateBodyClass(); // 리사이즈 시에도 동기화
		};
		
		const handleSidebarToggleEvent = (event: CustomEvent) => {
			const newState = event.detail.state;
			sidebarCollapsed = newState === 'collapsed';
			updateBodyClass(); // ui.js 이벤트 시에도 동기화
			
			window.dispatchEvent(new CustomEvent('sidebar-width-change', {
				detail: { width: sidebarCollapsed ? 72 : 250 }
			}));
		};
		
		window.addEventListener('resize', handleResize);
		window.addEventListener('sidebar-toggle', handleSidebarToggleEvent as EventListener);
		
		return () => {
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('sidebar-toggle', handleSidebarToggleEvent as EventListener);
		};
	});
</script>

<!-- 사이드바 컨테이너 -->
<aside 
	class="top-0 fixed left-0 h-screen bg-surface-2 sidebar-border-right z-40 overflow-hidden"
>
	<div class="h-full w-full overflow-hidden flex flex-col">
		<!-- 상단 토글 버튼과 로고 -->
		<div class="flex items-center h-20 border-b border-border-subtle flex-shrink-0 px-6">
			<div class="flex-shrink-0 w-6 h-6 inline-flex items-center justify-center pointer-events-none" 
				 style="color: var(--brand-pink) !important; display: {mounted && isMobile ? 'flex' : 'none'};">
				<PanelsTopLeft 
					size={20} 
					style="color: var(--brand-pink) !important; pointer-events: none;"
				/>
			</div>
			<button
				onclick={handleSidebarToggle}
				onmouseenter={() => sidebarToggleHovered = true}
				onmouseleave={() => sidebarToggleHovered = false}
				class="flex-shrink-0 w-6 h-6 inline-flex items-center justify-center rounded-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-0 cursor-pointer"
				style="display: {mounted && isMobile ? 'none' : 'flex'};"
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
			
			<div class="sidebar-text ml-3">
				<img src="/logo.svg" alt="Sugar Rush" class="h-6 w-auto" />
			</div>
		</div>

		<!-- 메뉴 아이템들 -->
		<nav class="flex-1 overflow-hidden">
			<ul class="space-y-0 h-full overflow-y-auto overflow-x-hidden custom-list-scrollbar">
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
<div class="flex-shrink-0 w-5 h-5 flex items-center justify-center">
	<IconComponent size={20} class="lucide-icon transition-colors duration-200 ease-in-out" />
</div>
							
							<div class="sidebar-text ml-3">
								<span class="text-sm whitespace-nowrap hidden md:inline">{item.label}</span>
							</div>
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</div>
</aside>
