<script lang="ts">
	import { onMount } from 'svelte';
	import { Eclipse } from 'lucide-svelte';

	let theme = 'dark';
	let themeHovered = false;
	let themeClicked = false;

	onMount(() => {
		// 브라우저 환경에서만 실행
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
		
		// 브라우저 환경에서만 실행
		if (typeof window !== 'undefined') {
			theme = theme === 'dark' ? 'light' : 'dark';
			localStorage.setItem('sr_theme', theme);
			document.documentElement.setAttribute('data-theme', theme);
		}
	}
</script>

<button
	onclick={toggleTheme}
	class="h-9 w-9 rounded-lg inline-flex items-center justify-center bg-surface-1 border border-border-subtle transition-colors focus:outline-none focus:ring-0"
	onmouseenter={() => themeHovered = true}
	onmouseleave={() => themeHovered = false}
	aria-label="테마 전환"
	title="다크/라이트 모드 전환"
>
	<Eclipse 
		size={18} 
		class="transition-colors {themeClicked ? 'text-brand-pink' : themeHovered ? 'text-hover-cyan' : 'text-text-base'}" 
	/>
</button>