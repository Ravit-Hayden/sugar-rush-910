<script lang="ts">
	import { browser } from '$app/environment';
	import { Eclipse } from 'lucide-svelte';

	let theme = $state('dark');
	let mounted = $state(false);

	$effect(() => {
		if (browser) {
			const savedTheme = localStorage.getItem('sr_theme') || 'dark';
			theme = savedTheme;
			document.documentElement.setAttribute('data-theme', theme);
			mounted = true;
		}
		return () => {};
	});

	function toggleTheme() {
		if (browser) {
			theme = theme === 'dark' ? 'light' : 'dark';
			localStorage.setItem('sr_theme', theme);
			document.documentElement.setAttribute('data-theme', theme);
		}
	}
</script>

<button
	onclick={toggleTheme}
	class="theme-toggle-button inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-md transition-colors focus:outline-none focus:ring-0"
	aria-label="테마 전환"
	title="다크/라이트 모드 전환"
	type="button"
	data-action="toggle-theme"
>
	<Eclipse 
		size={14} 
		class="sm:w-4 sm:h-4 transition-colors text-text-base lucide-icon" 
	/>
</button>