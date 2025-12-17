<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import ToastContainer from '$lib/components/ToastContainer.svelte';

	let { children } = $props();
	let sidebarCollapsed = $state(true); // 기본값: 축소 상태
	let sidebarOpen = $state(false);

	// 사이드바 이벤트 처리
	$effect(() => {
		if (typeof window === 'undefined') {
			return () => {}; // SSR 시 빈 cleanup 함수 반환
		}

		const handleSidebarCollapseChange = (event: CustomEvent) => {
			sidebarCollapsed = event.detail.collapsed;
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
		};

		window.addEventListener('sidebar-collapse-change', handleSidebarCollapseChange as EventListener);
		window.addEventListener('sidebar-toggle', handleSidebarToggle as EventListener);
		window.addEventListener('sidebar-toggle', handleUISidebarToggle as EventListener);
		
		return () => {
			if (typeof window !== 'undefined') {
				window.removeEventListener('sidebar-collapse-change', handleSidebarCollapseChange as EventListener);
				window.removeEventListener('sidebar-toggle', handleSidebarToggle as EventListener);
				window.removeEventListener('sidebar-toggle', handleUISidebarToggle as EventListener);
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
		{@render children()}
	</main>
	
	<ToastContainer />
</div>