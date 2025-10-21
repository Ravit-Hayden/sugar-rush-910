<script lang="ts">
	import { onMount } from 'svelte';
	import { Eclipse } from 'lucide-svelte';

	let theme = 'dark';

	onMount(() => {
		if (typeof window !== 'undefined') {
			const savedTheme = localStorage.getItem('sr_theme') || 'dark';
			theme = savedTheme;
			document.documentElement.setAttribute('data-theme', theme);
		}
	});

	function toggleTheme() {
		if (typeof window !== 'undefined') {
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