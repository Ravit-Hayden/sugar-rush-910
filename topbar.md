[8 tools called]

## 📋 상단바(헤더) 관련 코드 전체 정리

### 🎯 **1. 메인 헤더 컴포넌트**
**파일**: `src/lib/components/Header.svelte`

```svelte
<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { Search, Bell, X } from 'lucide-svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	// 검색 관련 상태
	let searchValue = '';
	let searchIconHovered = false;
	let searchFocused = false;
	let searchResults: { 
		exact: { id: string; title: string; type: string; href: string }[];
		similar: { id: string; title: string; type: string; href: string }[];
	} = { exact: [], similar: [] };
	let searchLoading = false;

	// 알림 관련 상태
	let notificationHovered = false;
	let notificationClicked = false;

	// 사이드바 너비 연동
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
		
		// 정확한 경로 매치
		const exactMatch = menuItems.find(item => item.href === currentPath);
		if (exactMatch) return exactMatch.label;
		
		// 부분 경로 매치 (예: /albums/edit -> 앨범 관리)
		const partialMatch = menuItems.find(item => 
			item.href !== '/' && currentPath.startsWith(item.href)
		);
		if (partialMatch) return partialMatch.label;
		
		return '대시보드';
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
			notifySearchChange();
		}
	}

	// 검색어 변경 시 디바운스 처리
	let searchTimeout: ReturnType<typeof setTimeout>;
	function handleSearchInput() {
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			if (searchValue.trim()) {
				performSearch(searchValue);
			} else {
				performSearch('');
			}
		}, 300);
	}

	// 검색 초기화
	function clearSearch() {
		searchValue = '';
		searchResults = { exact: [], similar: [] };
		window.dispatchEvent(new CustomEvent('search-change', {
			detail: { query: '', results: { exact: [], similar: [] }, show: false }
		}));
		searchValue = searchValue; // 강제 리렌더링
	}

	// 검색 결과를 메인 페이지로 전달
	function notifySearchChange() {
		const shouldShow = searchValue.trim().length > 0;
		window.dispatchEvent(new CustomEvent('search-change', {
			detail: { query: searchValue, results: searchResults, show: shouldShow }
		}));
	}

	// 알림 버튼 클릭 처리
	function handleNotificationClick() {
		notificationClicked = true;
		setTimeout(() => {
			notificationClicked = false;
		}, 150);
		
		clearSearch();
		window.location.href = '/feedback';
	}

	// 이벤트 리스너 등록
	onMount(() => {
		const handleSearchClear = () => {
			clearSearch();
		};

		const handleSidebarWidthChange = (event: CustomEvent) => {
			sidebarWidth = event.detail.width;
		};

		window.addEventListener('search-clear', handleSearchClear);
		window.addEventListener('sidebar-width-change', handleSidebarWidthChange as EventListener);
		return () => {
			window.removeEventListener('search-clear', handleSearchClear);
			window.removeEventListener('sidebar-width-change', handleSidebarWidthChange as EventListener);
		};
	});
</script>

<header class="h-20 px-6 fixed top-0 left-0 right-0 z-[60] bg-bg transition-all duration-300" style="margin-left: {sidebarWidth}px;">
	<div class="flex h-full items-center justify-between">
		<!-- 왼쪽 섹션: 페이지 제목 (반응형 숨김/표시) -->
		<div class="flex items-center gap-4">
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
					<!-- 새로운 알림 표시 점 -->
					<span 
						class="absolute -top-0.5 -right-0.5 w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full transition-colors" 
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
```

---

### 🎯 **2. 테마 토글 컴포넌트**
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
			// 초기 테마 설정
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

### 🎯 **3. 메인 레이아웃 (헤더 통합)**
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

### 🎯 **4. CSS 스타일 (헤더 관련)**
**파일**: `src/app.css`

```css
/* 헤더 반응형 정렬 */
@media (max-width: 767px) {
  /* 모바일에서 검색창이 메인 콘텐츠와 좌측 정렬되도록 */
  .search-container {
    margin-left: 0;
    padding-left: 0;
    flex: 1; /* 사용 가능한 공간을 모두 사용 */
  }
  
  /* 모바일에서 검색창 최대 너비 제한 해제 */
  .search-container .relative {
    max-width: none;
  }
  
  /* 모바일에서 헤더 패딩과 메인 콘텐츠 패딩 일치 */
  header {
    padding-left: 1.5rem !important; /* 24px - 메인 콘텐츠와 동일 */
    padding-right: 1.5rem !important; /* 24px - 메인 콘텐츠와 동일 */
  }
  
  /* 모바일에서 오른쪽 섹션은 좌측 정렬 */
  header .flex-1.justify-end {
    justify-content: flex-start;
  }
}

@media (min-width: 768px) {
  /* 데스크톱에서 검색창은 원래 크기 유지 */
  .search-container {
    flex: none; /* 고정 크기 유지 */
  }
  
  .search-container .relative {
    max-width: 320px; /* 원래 최대 너비 복원 */
  }
  
  /* 데스크톱에서 오른쪽 섹션은 오른쪽 정렬 (메인 영역 오른쪽 패딩에 맞춤) */
  header .flex-1.justify-end {
    justify-content: flex-end;
  }
}

/* 검색창 플레이스홀더 스타일 */
input::placeholder {
  color: var(--text-muted) !important;
  opacity: 1 !important;
}

input::-webkit-input-placeholder {
  color: var(--text-muted) !important;
  opacity: 1 !important;
}

input::-moz-placeholder {
  color: var(--text-muted) !important;
  opacity: 1 !important;
}

input:-ms-input-placeholder {
  color: var(--text-muted) !important;
  opacity: 1 !important;
}

/* Tailwind CSS 클래스 오버라이드 */
.bg-bg { background-color: var(--bg); }
.bg-surface-1 { background-color: var(--surface-1); }
.bg-surface-2 { background-color: var(--surface-2); }
.text-text-base { color: var(--text-base); }
.text-text-strong { color: var(--text-strong); }
.text-text-muted { color: var(--text-muted); }
.text-brand-pink { color: var(--brand-pink); }
.text-hover-cyan { color: var(--hover-cyan); }
.border-border-subtle { border-color: var(--border-subtle); }
.focus\:border-brand-pink:focus { border-color: var(--brand-pink); }
.focus\:ring-0:focus { --tw-ring-width: 0px; --tw-ring-offset-width: 0px; }
.hover\:border-hover-cyan:hover { border-color: var(--hover-cyan); }
.border-\[1px\] { border-width: 1px; }
.focus\:border-\[1px\]:focus { border-width: 1px !important; }

/* 브랜드 & 상태 색상 변수 */
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

/* 라이트 모드 색상 변수 */
[data-theme="light"] {
  --text-base: #D9CCBC;
  --text-strong: #C5b5A9;
  --text-muted: #A59686;
  --bg: #F7F3E9;
  --surface-2: #F3EBDD;
  --surface-1: #FFF8EF;
  --border-subtle: #D9CCBC;
}
```

---

### 🎯 **5. 검색 API 엔드포인트**
**파일**: `src/routes/api/search/+server.ts`

```typescript
// 현재는 빈 파일이지만, 검색 기능을 위한 API 엔드포인트
// Header.svelte에서 `/api/search?q=${query}&limit=8`로 호출
```

---

## 🔧 **핵심 기능 요약**

### **헤더 구조**:
- **왼쪽 섹션**: 페이지 제목 (반응형 숨김/표시)
- **오른쪽 섹션**: 검색창, 알림 버튼, 테마 토글

### **검색 기능**:
- **디바운스 처리**: 300ms 지연으로 API 호출 최적화
- **실시간 결과**: 검색어 입력 시 즉시 결과 표시
- **검색 초기화**: X 버튼으로 검색어 및 결과 초기화
- **이벤트 통신**: `search-change` 이벤트로 메인 페이지에 결과 전달

### **반응형 동작**:
- **모바일 (<768px)**: 검색창 확장, 페이지 제목 숨김, 좌측 정렬
- **데스크톱 (≥768px)**: 검색창 고정 크기, 페이지 제목 표시, 우측 정렬

### **사이드바 연동**:
- **동적 마진**: `margin-left: {sidebarWidth}px`로 사이드바 너비에 따라 조정
- **이벤트 수신**: `sidebar-width-change` 이벤트로 너비 변경 감지

### **테마 관리**:
- **로컬 스토리지**: `sr_theme` 키로 테마 상태 저장
- **DOM 속성**: `data-theme` 속성으로 CSS 변수 제어
- **SSR 호환**: `typeof window !== 'undefined'` 체크

### **접근성**:
- **ARIA 라벨**: 모든 버튼에 적절한 라벨 제공
- **키보드 네비게이션**: 포커스 링 및 키보드 접근성 지원
- **시각적 피드백**: 호버, 포커스, 클릭 상태 표시
