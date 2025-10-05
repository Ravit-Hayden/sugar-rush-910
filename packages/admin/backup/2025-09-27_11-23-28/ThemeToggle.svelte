<script lang="ts">
	import { onMount } from 'svelte';
	import { Eclipse } from 'lucide-svelte';

	let theme = 'dark';

	onMount(() => {
		// 초기 테마 설정
		const savedTheme = localStorage.getItem('sr_theme') || 'dark';
		theme = savedTheme;
		document.documentElement.setAttribute('data-theme', theme);
	});

	function toggleTheme() {
		theme = theme === 'dark' ? 'light' : 'dark';
		localStorage.setItem('sr_theme', theme);
		document.documentElement.setAttribute('data-theme', theme);
	}
</script>

<button
	onclick={toggleTheme}
	class="inline-flex items-center justify-center w-6 h-6 rounded-md hover:bg-surface-1 transition-colors"
	aria-label="테마 전환"
	title="다크/라이트 모드 전환"
>
	<Eclipse size={16} class="text-text-base" />
</button>
