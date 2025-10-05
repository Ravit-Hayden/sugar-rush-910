<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';

	let { children } = $props();
	let sidebarCollapsed = $state(true); // 기본값을 true로 변경 (축소 상태)
	let sidebarOpen = $state(false);
	let isMobile = $state(false); // 모바일 화면 크기 추적

	// 화면 크기 감지 함수
	function checkScreenSize() {
		if (typeof window !== 'undefined') {
			const wasMobile = isMobile;
			isMobile = window.innerWidth < 768;
			
			// 화면 크기 변경 시 사이드바 상태 리셋
			if (wasMobile !== isMobile) {
				sidebarCollapsed = true;
				sidebarOpen = false;
			}
		}
	}

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

		const handleResize = () => {
			checkScreenSize();
		};

		// 초기 화면 크기 확인
		checkScreenSize();

		if (typeof window !== 'undefined') {
			window.addEventListener('sidebar-collapse-change', handleSidebarCollapseChange as EventListener);
			window.addEventListener('sidebar-toggle', handleSidebarToggle as EventListener);
			window.addEventListener('resize', handleResize);
		}
		
		return () => {
			if (typeof window !== 'undefined') {
				window.removeEventListener('sidebar-collapse-change', handleSidebarCollapseChange as EventListener);
				window.removeEventListener('sidebar-toggle', handleSidebarToggle as EventListener);
				window.removeEventListener('resize', handleResize);
			}
		};
	});
</script>

<svelte:head>
	<link rel="icon" href="/favicon.ico" />
	<link rel="icon" type="image/png" href="/favicon.png" />
	<script>
		(function(){
		  function setSBW(){
		    var w=window.innerWidth-document.documentElement.clientWidth;
		    document.documentElement.style.setProperty('--sbw', w+'px');
		  }
		  setSBW();
		  window.addEventListener('resize', setSBW, {passive:true});
		})();
	</script>
</svelte:head>

<div class="min-h-screen bg-bg overflow-x-hidden">
	<Header />
	<Sidebar />
	
	<main class="main-content-area {sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}">
		{@render children?.()}
	</main>
</div>