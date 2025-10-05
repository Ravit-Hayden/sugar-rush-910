[5 tools called]

## 📋 좌측 사이드바 관련 코드 전체 정리

### 🎯 **1. 메인 사이드바 컴포넌트**
**파일**: `src/lib/components/Sidebar.svelte`

```svelte
<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import {
		LayoutGrid, Disc3, Music, FolderOpen, Heart, Rocket,
		DollarSign, Calendar, MessageSquare, Shield, Settings,
		PanelLeftOpen, PanelLeftClose, PanelsTopLeft
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
			isMobile = window.innerWidth < 768;
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
</script>

<!-- 사이드바 컨테이너 -->
<aside 
	class="top-0 fixed left-0 h-screen bg-surface-2 border-r border-border-subtle z-50 overflow-hidden"
	class:w-[72px]={sidebarCollapsed}
	class:w-[250px]={!sidebarCollapsed}
	style="transition: width 200ms ease-in-out, transform 200ms ease-in-out;"
>
	<div class="h-full w-full overflow-hidden">
		<nav class="h-full flex flex-col">
			<!-- 상단 토글 버튼과 로고 -->
			<div class="flex items-center h-20 border-b border-border-subtle flex-shrink-0 px-6">
				<!-- 토글 버튼 -->
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
							<PanelsTopLeft 
								size={20} 
								class="transition-colors duration-200 ease-in-out text-brand-pink" 
							/>
						{:else if sidebarCollapsed}
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
				</div>
				
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
```

---

### 🎯 **2. 메인 레이아웃 (사이드바 통합)**
**파일**: `src/routes/+layout.svelte`

```svelte
<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';

	let { children } = $props();
	let sidebarCollapsed = $state(true); // 기본값: 축소 상태
	let sidebarOpen = $state(false);

	onMount(() => {
		const handleSidebarCollapseChange = (event: CustomEvent) => {
			sidebarCollapsed = event.detail.collapsed;
		};

		const handleSidebarToggle = (event: CustomEvent) => {
			if (typeof window !== 'undefined' && window.innerWidth < 768) {
				sidebarOpen = !sidebarOpen;
			}
		};

		if (typeof window !== 'undefined') {
			window.addEventListener('sidebar-collapse-change', handleSidebarCollapseChange as EventListener);
			window.addEventListener('sidebar-toggle', handleSidebarToggle as EventListener);
		}
		
		return () => {
			if (typeof window !== 'undefined') {
				window.removeEventListener('sidebar-collapse-change', handleSidebarCollapseChange as EventListener);
				window.removeEventListener('sidebar-toggle', handleSidebarToggle as EventListener);
			}
		};
	});
</script>

<svelte:head>
	<link rel="icon" href="/favicon.ico" />
	<link rel="icon" type="image/png" href="/favicon.png" />
</svelte:head>

<div class="min-h-screen bg-bg overflow-x-hidden">
	<Header />
	<Sidebar />
	
	<main class="main-content-area {sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}">
		{@render children?.()}
	</main>
</div>
```

---

### 🎯 **3. 헤더 (사이드바 너비 연동)**
**파일**: `src/lib/components/Header.svelte`

```svelte
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
				<button class="relative inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-md transition-colors focus:outline-none focus:ring-0" aria-label="알림">
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
```

---

### 🎯 **4. CSS 스타일 (사이드바 관련)**
**파일**: `src/app.css`

```css
/* 사이드바 아이콘 고정 위치 및 정렬 */
.sidebar-menu-item .lucide-icon {
  display: block;
  margin: 0;
  padding: 0;
  line-height: 1;
  vertical-align: middle;
  position: relative;
}

/* 아이콘 컨테이너 고정 크기 */
.sidebar-menu-item > div:first-child {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* 통일된 메인 영역 스타일 */
.main-content-area {
  padding-top: 5rem; /* pt-20 (80px) */
  padding-bottom: 0.375rem; /* pb-1.5 (6px) */
  padding-left: 1.5rem; /* px-6 (24px) - 고정 */
  padding-right: 1.5rem; /* px-6 (24px) - 고정 */
  transition: all 300ms ease-in-out;
  overflow-x: hidden;
  background-color: var(--bg);
  min-height: calc(100vh - 80px);
  width: 100%;
  scrollbar-gutter: stable;
  box-sizing: border-box;
}

/* 사이드바 상태에 따른 마진 조정 */
.main-content-area.sidebar-collapsed {
  margin-left: 72px;
  width: calc(100% - 72px);
}

.main-content-area.sidebar-expanded {
  margin-left: 250px;
  width: calc(100% - 250px);
}

/* 사이드바 애니메이션 통일 */
.sidebar-text-animation {
  transition: all 200ms ease-in-out;
}

.sidebar-text-animation.collapsed {
  opacity: 0;
  width: 0;
  overflow: hidden;
}

.sidebar-text-animation.expanded {
  opacity: 1;
  width: auto;
}

/* 사이드바 메뉴 아이템 스타일 */
.sidebar-menu-item {
  transition: all 200ms ease-in-out;
}

.sidebar-menu-item:hover:not(.active) {
  background-color: var(--hover-cyan) !important;
  color: #000000 !important;
}

.sidebar-menu-item:hover:not(.active) .lucide-icon {
  color: #000000 !important;
}

.sidebar-menu-item.active {
  background-color: var(--brand-pink) !important;
  color: #FFFFFF !important;
}

.sidebar-menu-item.active .lucide-icon {
  color: #FFFFFF !important;
}

/* 사이드바 전체 애니메이션 최적화 */
aside {
  will-change: transform, width;
}

/* 헤더 반응형 정렬 */
@media (max-width: 767px) {
  .search-container {
    margin-left: 0;
    padding-left: 0;
    flex: 1;
  }
  
  .search-container .relative {
    max-width: none;
  }
  
  header {
    padding-left: 1.5rem !important; /* 24px */
    padding-right: 1.5rem !important; /* 24px */
  }
  
  header .flex-1.justify-end {
    justify-content: flex-start;
  }
}

@media (min-width: 768px) {
  .search-container {
    flex: none;
  }
  
  .search-container .relative {
    max-width: 320px;
  }
  
  header .flex-1.justify-end {
    justify-content: flex-end;
  }
}
```

---

### 🎯 **5. 테마 토글 컴포넌트**
**파일**: `src/lib/components/ThemeToggle.svelte`

```svelte
<script lang="ts">
	import { onMount } from 'svelte';
	import { Eclipse } from 'lucide-svelte';

	let theme = 'dark';
	let themeHovered = false;
	let themeClicked = false;

	onMount(() => {
		if (typeof window !== 'undefined') {
			const savedTheme = localStorage.getItem('sr_theme') || 'dark';
			theme = savedTheme;
			document.documentElement.setAttribute('data-theme', theme);
		}
	});

	function toggleTheme() {
		themeClicked = true;
		setTimeout(() => {
			themeClicked = false;
		}, 150);
		
		if (typeof window !== 'undefined') {
			theme = theme === 'dark' ? 'light' : 'dark';
			localStorage.setItem('sr_theme', theme);
			document.documentElement.setAttribute('data-theme', theme);
		}
	}
</script>

<button
	onclick={toggleTheme}
	class="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-md transition-colors focus:outline-none focus:ring-0"
	onmouseenter={() => themeHovered = true}
	onmouseleave={() => themeHovered = false}
	aria-label="테마 전환"
	title="다크/라이트 모드 전환"
>
	<Eclipse 
		size={14} 
		class="sm:w-4 sm:h-4 transition-colors {themeClicked ? 'text-brand-pink' : themeHovered ? 'text-hover-cyan' : 'text-text-base'}" 
	/>
</button>
```

---

## 🔧 **핵심 기능 요약**

### **사이드바 상태 관리**:
- `sidebarCollapsed`: 데스크톱에서 축소/확장 상태
- `sidebarOpen`: 모바일에서 열기/닫기 상태
- `isMobile`: 화면 크기 감지

### **반응형 동작**:
- **데스크톱 (≥768px)**: 축소(72px) ↔ 확장(250px) 토글
- **모바일 (<768px)**: 고정 축소 상태, PanelsTopLeft 아이콘 표시

### **애니메이션**:
- 사이드바 너비: 200ms ease-in-out
- 텍스트 페이드: 200ms ease-in-out
- 통일된 타이밍으로 부드러운 전환

### **이벤트 통신**:
- `sidebar-collapse-change`: 메인 레이아웃에 상태 전달
- `sidebar-width-change`: 헤더에 너비 변경 알림
- `sidebar-toggle`: 모바일 열기/닫기 상태 전달