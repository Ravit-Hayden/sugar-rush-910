<script lang="ts">
	import { onMount } from 'svelte';
	import { Eclipse } from 'lucide-svelte';

	let currentTheme: 'dark' | 'light' = 'dark';

	onMount(() => {
		// 초기 테마 설정
		const savedTheme = localStorage.getItem('sr_theme') as 'dark' | 'light' | null;
		if (savedTheme) {
			currentTheme = savedTheme;
		} else {
			// 기본값 설정 (El: 다크, Otte: 라이트)
			currentTheme = 'dark';
		}
		applyTheme(currentTheme);
	});

	function toggleTheme() {
		currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
		applyTheme(currentTheme);
		localStorage.setItem('sr_theme', currentTheme);
	}

	function applyTheme(theme: 'dark' | 'light') {
		document.documentElement.setAttribute('data-theme', theme);
	}
</script>

<button
	on:click={toggleTheme}
	class="inline-flex items-center justify-center w-6 h-6 rounded-md hover:bg-surface-1 transition-colors duration-200"
	aria-label="테마 전환"
	title="다크/라이트 모드 전환"
>
	<Eclipse size={16} class="text-text-base" />
</button>
