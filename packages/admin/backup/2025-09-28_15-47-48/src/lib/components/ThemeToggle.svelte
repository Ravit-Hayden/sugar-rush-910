<script lang="ts">
	import { onMount } from 'svelte';
	import { Eclipse } from 'lucide-svelte';

	let theme = 'dark';
	let themeHovered = false;
	let themeClicked = false;

	onMount(() => {
		// 초기 테마 설정
		const savedTheme = localStorage.getItem('sr_theme') || 'dark';
		theme = savedTheme;
		document.documentElement.setAttribute('data-theme', theme);
	});

	function toggleTheme() {
		themeClicked = true;
		setTimeout(() => {
			themeClicked = false;
		}, 150);
		
		theme = theme === 'dark' ? 'light' : 'dark';
		localStorage.setItem('sr_theme', theme);
		document.documentElement.setAttribute('data-theme', theme);
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

