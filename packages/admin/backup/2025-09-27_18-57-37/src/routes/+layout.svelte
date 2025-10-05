<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';

	let { children } = $props();
	let sidebarCollapsed = $state(false);

	onMount(() => {
		const handleSidebarCollapseChange = (event: CustomEvent) => {
			sidebarCollapsed = event.detail.collapsed;
		};

		window.addEventListener('sidebar-collapse-change', handleSidebarCollapseChange as EventListener);
		
		return () => {
			window.removeEventListener('sidebar-collapse-change', handleSidebarCollapseChange as EventListener);
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
	
	<main class="pt-24 px-6 transition-all duration-500 ease-in-out {sidebarCollapsed ? 'md:ml-16' : 'md:ml-[216px]'}">
		{@render children?.()}
	</main>
</div>
