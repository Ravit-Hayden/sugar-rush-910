<script lang="ts">
	import { page } from '$app/stores';
	import { Monitor, Headphones, Type, Book, Mic, Wallet } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	// Props
	let { children }: { children?: Snippet } = $props();

	// 탭 정의
	const tabs = [
		{ id: 'dashboard', label: '인포', href: '/suno', icon: Monitor },
		{ id: 'projects', label: '제작', href: '/suno/projects', icon: Headphones },
		{ id: 'words', label: '워드', href: '/suno/words', icon: Type },
		{ id: 'prompts', label: '프롬프트', href: '/suno/prompts', icon: Book },
		{ id: 'vocals', label: '보컬', href: '/suno/vocals', icon: Mic },
		{ id: 'subscription', label: '구독', href: '/suno/subscription', icon: Wallet }
	];

	// 현재 활성 탭 확인
	function isActiveTab(href: string): boolean {
		const currentPath = $page.url.pathname;
		if (href === '/suno') {
			return currentPath === '/suno';
		}
		return currentPath.startsWith(href);
	}

	// 첫 번째 탭 활성 여부
	const isFirstTabActive = $derived(isActiveTab(tabs[0].href));

	// 콘텐츠 영역 라운드 클래스
	// 첫 번째 탭만 콘텐츠 좌측 시작점과 맞닿음
	const contentRoundedClass = $derived.by(() => {
		if (isFirstTabActive) {
			// 첫 번째 탭 활성: 좌상단 각, 나머지 라운드
			return 'rounded-tr-lg rounded-b-lg';
		} else {
			// 다른 탭 활성: 모든 모서리 라운드
			return 'rounded-lg';
		}
	});
</script>

<!-- 탭 + 콘텐츠 컨테이너 -->
<div class="mb-8">
	<!-- 탭 네비게이션 -->
	<nav class="flex items-end w-full max-w-full" aria-label="SUNO 탭">
		{#each tabs as tab, index}
			{@const Icon = tab.icon}
			{@const active = isActiveTab(tab.href)}
			<a
				href={tab.href}
				class="suno-tab relative flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2.5 text-sm font-medium whitespace-nowrap flex-shrink min-w-0 outline-none
					{active 
						? 'suno-tab-active bg-surface-1 border-t border-l border-r border-border-subtle rounded-t-lg' 
						: 'suno-tab-inactive'}"
				aria-current={active ? 'page' : undefined}
			>
				<Icon 
					size={16} 
					class="flex-shrink-0 transition-colors duration-200 pointer-events-none" 
				/>
				<span 
					class="hidden sm:inline transition-colors duration-200 pointer-events-none"
				>{tab.label}</span>
			</a>
		{/each}
	</nav>

	<!-- 콘텐츠 영역 (호버/포커스 효과 없음) -->
	<div class="suno-tab-content bg-surface-1 border border-border-subtle {contentRoundedClass} p-5 sm:p-6 -mt-px">
		{#if children}
			{@render children()}
		{/if}
	</div>
</div>
