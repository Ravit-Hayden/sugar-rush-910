<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';

	let { children } = $props();
	let sidebarCollapsed = $state(false);
	let sidebarOpen = $state(false);

	onMount(() => {
		const handleSidebarCollapseChange = (event: CustomEvent) => {
			sidebarCollapsed = event.detail.collapsed;
		};

		const handleSidebarToggle = (event: CustomEvent) => {
			// 모바일에서만 사이드바 열림 상태 추적
			if (window.innerWidth < 768) {
				sidebarOpen = !sidebarOpen;
			}
		};

		window.addEventListener('sidebar-collapse-change', handleSidebarCollapseChange as EventListener);
		window.addEventListener('sidebar-toggle', handleSidebarToggle as EventListener);
		
		return () => {
			window.removeEventListener('sidebar-collapse-change', handleSidebarCollapseChange as EventListener);
			window.removeEventListener('sidebar-toggle', handleSidebarToggle as EventListener);
		};
	});
</script>

<svelte:head>
	<link rel="icon" href="/favicon.ico" />
	<link rel="icon" type="image/png" href="/favicon.png" />
</svelte:head>

<div class="min-h-screen bg-bg">
	<Header />
	<Sidebar />
	
	<main class="py-1.5 px-6 transition-all duration-300 ease-in-out {sidebarCollapsed ? 'md:ml-[72px]' : 'md:ml-[250px]'} {sidebarOpen ? 'ml-[72px]' : 'ml-0'}" style="background-color: var(--bg); min-height: calc(100vh - 96px);">
		{@render children?.()}
	</main>
</div>
