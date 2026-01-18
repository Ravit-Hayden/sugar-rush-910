<script lang="ts">
	import { page } from '$app/stores';
	import { Sparkles, Music, FileText, Palette, Mic2, CreditCard } from 'lucide-svelte';

	// 탭 정의
	const tabs = [
		{ id: 'dashboard', label: '현황', href: '/suno', icon: Sparkles },
		{ id: 'projects', label: '곡', href: '/suno/projects', icon: Music },
		{ id: 'words', label: '워드', href: '/suno/words', icon: FileText },
		{ id: 'prompts', label: '프롬프트', href: '/suno/prompts', icon: Palette },
		{ id: 'vocals', label: '보컬', href: '/suno/vocals', icon: Mic2 },
		{ id: 'subscription', label: '구독', href: '/suno/subscription', icon: CreditCard }
	];

	// 현재 활성 탭 확인
	function isActiveTab(href: string): boolean {
		const currentPath = $page.url.pathname;
		if (href === '/suno') {
			return currentPath === '/suno';
		}
		return currentPath.startsWith(href);
	}
</script>

<!-- 페이지 콘텐츠 -->
<slot />

<!-- 하단 고정 탭 바 (모바일) -->
<div class="sm:hidden fixed bottom-0 left-0 right-0 bg-surface-1 border-t border-border-subtle z-40 safe-area-bottom">
	<nav class="flex items-center justify-around h-14">
		{#each tabs as tab}
			{@const Icon = tab.icon}
			{@const active = isActiveTab(tab.href)}
			<a
				href={tab.href}
				class="flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors {active ? 'text-brand-pink' : 'text-text-muted'}"
			>
				<Icon size={18} />
				<span class="text-[10px]">{tab.label}</span>
			</a>
		{/each}
	</nav>
</div>
