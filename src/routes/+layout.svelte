<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import ToastContainer from '$lib/components/ToastContainer.svelte';
	import SearchResultsMain from '$lib/components/SearchResultsMain.svelte';

	let { children } = $props();
	let sidebarCollapsed = $state(true); // 기본값: 축소 상태
	let sidebarOpen = $state(false);

	// 검색 상태 (모든 페이지 공통)
	let searchQuery = $state('');
	let searchResults = $state<{
		exact: { id: string; title: string; type: string; href: string }[];
		similar: { id: string; title: string; type: string; href: string; recommendReason?: string }[];
	}>({ exact: [], similar: [] });
	let showSearchResults = $state(false);

	// 검색 초기화 (현재 페이지 유지)
	function clearSearch() {
		// Header 컴포넌트에 검색 초기화 알림
		if (typeof window !== 'undefined') {
			window.dispatchEvent(new CustomEvent('search-clear'));
		}
		// 검색 결과만 숨기고 현재 페이지 유지
		showSearchResults = false;
		searchQuery = '';
		searchResults = { exact: [], similar: [] };
	}

	// body 클래스 동기화 함수
	function updateBodyClass() {
		if (typeof document !== 'undefined') {
			document.body.classList.toggle('sidebar-expanded', !sidebarCollapsed);
			document.body.classList.toggle('sidebar-collapsed', sidebarCollapsed);
		}
	}

	// 사이드바 및 검색 이벤트 처리
	$effect(() => {
		if (typeof window === 'undefined') {
			return () => {}; // SSR 시 빈 cleanup 함수 반환
		}

		// 초기 body 클래스 설정
		updateBodyClass();

		const handleSidebarCollapseChange = (event: CustomEvent) => {
			sidebarCollapsed = event.detail.collapsed;
			updateBodyClass(); // 이벤트 시에도 동기화
		};

		const handleSidebarToggle = (event: CustomEvent) => {
			if (window.innerWidth < 768) {
				sidebarOpen = !sidebarOpen;
			}
		};

		// ui.js에서 발생하는 사이드바 토글 이벤트 처리
		const handleUISidebarToggle = (event: CustomEvent) => {
			const newState = event.detail.state;
			sidebarCollapsed = newState === 'collapsed';
			updateBodyClass(); // ui.js 이벤트 시에도 동기화
		};

		// 검색 상태 변경 이벤트 리스너
		const handleSearchChange = (event: CustomEvent) => {
			searchQuery = event.detail.query;
			searchResults = event.detail.results;
			showSearchResults = event.detail.show;
		};

		window.addEventListener('sidebar-collapse-change', handleSidebarCollapseChange as EventListener);
		window.addEventListener('sidebar-toggle', handleSidebarToggle as EventListener);
		window.addEventListener('sidebar-toggle', handleUISidebarToggle as EventListener);
		window.addEventListener('search-change', handleSearchChange as EventListener);
		
		return () => {
			if (typeof window !== 'undefined') {
				window.removeEventListener('sidebar-collapse-change', handleSidebarCollapseChange as EventListener);
				window.removeEventListener('sidebar-toggle', handleSidebarToggle as EventListener);
				window.removeEventListener('sidebar-toggle', handleUISidebarToggle as EventListener);
				window.removeEventListener('search-change', handleSearchChange as EventListener);
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
		{#if showSearchResults}
			<!-- 검색 결과 (모든 페이지 공통) -->
			<SearchResultsMain
				results={searchResults}
				query={searchQuery}
				onClear={clearSearch}
			/>
		{:else}
			<!-- 원래 페이지 콘텐츠 -->
			{@render children()}
		{/if}
	</main>
	
	<ToastContainer />
</div>