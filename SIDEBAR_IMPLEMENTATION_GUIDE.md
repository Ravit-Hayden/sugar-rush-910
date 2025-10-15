# 좌측 사이드바 완전 구현 가이드

## 📋 개요
이 가이드는 Sugar Rush 910 프로젝트의 좌측 사이드바를 완전히 동일하게 구현하는 방법을 설명합니다.

## 🎯 핵심 특징
- **반응형 디자인**: 모바일(< 768px)에서는 고정 축소 상태, 데스크톱(≥ 768px)에서는 토글 가능
- **통일된 애니메이션**: 모든 요소가 동시에 움직이는 "하나의 덩어리" 효과
- **고정 아이콘**: 사이드바 축소/확장 시 아이콘 위치 고정
- **SSR 호환**: 서버사이드 렌더링 환경에서 안전하게 동작
- **접근성**: 키보드 네비게이션 및 스크린 리더 지원

## 📁 필요한 파일들

### 1. Sidebar.svelte
**위치**: `src/lib/components/Sidebar.svelte`

```svelte
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
```

### 2. CSS 스타일 (app.css에 추가)
**위치**: `src/app.css`

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

/* 통일된 메인 영역 스타일 */
.main-content-area {
  padding-top: 5rem; /* pt-20 (80px) */
  padding-bottom: 0.375rem; /* pb-1.5 (6px) */
  padding-left: 1.5rem; /* px-6 (24px) */
  padding-right: 1.5rem; /* px-6 (24px) */
  transition: all 300ms ease-in-out;
  overflow-x: hidden;
  background-color: var(--bg);
  min-height: calc(100vh - 80px);
  width: 100%;
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

/* 가로 스크롤바 방지 */
body {
  background-color: var(--bg);
  color: var(--text-base);
  overflow-x: hidden;
  margin: 0;
  padding: 0;
}

html {
  overflow-x: hidden;
  margin: 0;
  padding: 0;
}

.min-h-screen {
  overflow-x: hidden;
}
```

### 3. 레이아웃 파일 (+layout.svelte)
**위치**: `src/routes/+layout.svelte`

```svelte
<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';

	let { children } = $props();
	let sidebarCollapsed = $state(true); // 기본값을 true로 변경 (축소 상태)
	let sidebarOpen = $state(false);

	onMount(() => {
		const handleSidebarCollapseChange = (event: CustomEvent) => {
			sidebarCollapsed = event.detail.collapsed;
		};

		const handleSidebarToggle = (event: CustomEvent) => {
			// 모바일에서만 사이드바 열림 상태 추적
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

## 🔧 핵심 구현 포인트

### 1. 상태 관리
- `sidebarCollapsed`: 데스크톱에서 사이드바 축소/확장 상태
- `sidebarOpen`: 모바일에서 사이드바 열림/닫힘 상태
- `isMobile`: 화면 크기 감지 (768px 기준)

### 2. 애니메이션 통일
- **사이드바 너비**: `transition: width 200ms ease-in-out`
- **텍스트 요소**: `.sidebar-text-animation` 클래스로 통일
- **동시 움직임**: 모든 요소가 같은 타이밍으로 애니메이션

### 3. 반응형 아이콘
- **모바일**: `PanelsTopLeft` (호버 효과 없음, 고정 표시)
- **데스크톱 축소**: `PanelLeftOpen` (호버 효과 있음)
- **데스크톱 확장**: `PanelLeftClose` (호버 효과 있음)

### 4. SSR 호환성
- 모든 `window` 접근에 `typeof window !== 'undefined'` 체크
- `onMount` 내에서 이벤트 리스너 등록/해제

### 5. 이벤트 시스템
- `sidebar-collapse-change`: 메인 콘텐츠 마진 조정
- `sidebar-width-change`: 헤더 마진 조정
- `sidebar-toggle`: 모바일 오버레이 제어

## 🎨 스타일링 규칙

### 색상 변수
```css
:root {
  --brand-pink: #FF3DAE;
  --hover-cyan: #17E1BC;
  --text-base: #888888;
  --text-strong: #B6B6B6;
  --text-muted: #6F6F6F;
  --bg: #000000;
  --surface-2: #121212;
  --surface-1: #1A1A1A;
  --border-subtle: #252528;
}
```

### 크기 규칙
- **축소 상태**: 72px 너비
- **확장 상태**: 250px 너비
- **아이콘**: 20px 크기, 고정 위치
- **텍스트**: 14px 크기, 애니메이션 적용

## 🚀 사용법

1. **파일 생성**: 위의 파일들을 정확한 위치에 생성
2. **의존성 설치**: `lucide-svelte` 패키지 설치
3. **CSS 변수**: 프로젝트의 테마 시스템에 맞게 색상 변수 설정
4. **로고 파일**: `/logo.svg` 파일을 `static` 폴더에 배치

## ⚠️ 주의사항

1. **SSR 호환성**: 모든 브라우저 API 접근에 안전장치 필수
2. **이벤트 정리**: `onMount`에서 등록한 이벤트 리스너 반드시 해제
3. **애니메이션 타이밍**: 모든 요소의 transition 시간 통일 (200ms)
4. **반응형 기준**: 768px 브레이크포인트 고정 사용
5. **접근성**: 키보드 네비게이션 및 스크린 리더 지원

## 🔍 테스트 체크리스트

- [ ] 모바일에서 PanelsTopLeft 아이콘 표시 (호버 효과 없음)
- [ ] 데스크톱에서 PanelLeft 아이콘 토글 (호버 효과 있음)
- [ ] 사이드바 축소/확장 시 모든 요소 동시 애니메이션
- [ ] 아이콘 위치 고정 유지
- [ ] 메인 콘텐츠 마진 자동 조정
- [ ] 키보드 ESC로 모바일 사이드바 닫기
- [ ] SSR 환경에서 오류 없이 렌더링
- [ ] 화면 크기 변경 시 반응형 동작

이 가이드를 따라 구현하면 완전히 동일한 사이드바를 만들 수 있습니다.















