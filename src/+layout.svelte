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
			console.log('Sidebar collapse change:', event.detail);
			sidebarCollapsed = event.detail.collapsed;
		};

		const handleSidebarToggle = (event: CustomEvent) => {
			console.log('Sidebar toggle:', event.detail);
			// 모바일에서만 사이드바 열림 상태 추적
			if (typeof window !== 'undefined' && window.innerWidth < 768) {
				sidebarOpen = event.detail.open;
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
	
	<main class="main-content-area {sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}" 
		  style="transition: margin-left 200ms ease-in-out, width 200ms ease-in-out;">
		{@render children?.()}
	</main>
</div>
