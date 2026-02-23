<script lang="ts">
	import { page } from '$app/stores';
	import type { Snippet } from 'svelte';
	import { Monitor, Headphones, Type, Book, Mic, Wallet } from 'lucide-svelte';

	let { children = undefined }: { children?: Snippet } = $props();

	// 탭 정의 (SUNOTabs.svelte와 동일 - 데스크톱 탭 기준)
	const tabs = [
		{ id: 'dashboard', label: '인포', href: '/suno', icon: Monitor },
		{ id: 'projects', label: '제작', href: '/suno/projects', icon: Headphones },
		{ id: 'words', label: '워드', href: '/suno/words', icon: Type },
		{ id: 'prompts', label: '프롬프트', href: '/suno/prompts', icon: Book },
		{ id: 'vocals', label: '보컬', href: '/suno/vocals', icon: Mic },
		{ id: 'subscription', label: '구독', href: '/suno/subscription', icon: Wallet }
	];

	function isActiveTab(href: string): boolean {
		const currentPath = $page.url.pathname;
		if (href === '/suno') return currentPath === '/suno';
		return currentPath.startsWith(href);
	}
</script>

<!-- 페이지 콘텐츠 -->
{#if children}
	{@render children()}
{/if}

<!-- 하단 고정 탭 바 (모바일) - 데스크톱 SUNO 탭과 동일 스타일 클래스 사용 -->
<div class="sm:hidden fixed bottom-0 left-0 right-0 bg-surface-1 border-t border-border-subtle z-40 safe-area-bottom">
	<nav class="flex items-center justify-around h-14" aria-label="SUNO 탭">
		{#each tabs as tab}
			{@const Icon = tab.icon}
			{@const active = isActiveTab(tab.href)}
			<a
				href={tab.href}
				class="suno-tab flex flex-col items-center justify-center gap-0.5 flex-1 h-full outline-none {active ? 'suno-tab-active' : 'suno-tab-inactive'}"
				aria-current={active ? 'page' : undefined}
			>
				<Icon size={16} class="flex-shrink-0 transition-colors duration-200 pointer-events-none" />
				<span class="text-[10px] font-medium transition-colors duration-200 pointer-events-none">{tab.label}</span>
			</a>
		{/each}
	</nav>
</div>
