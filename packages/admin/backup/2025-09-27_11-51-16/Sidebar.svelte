<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import {
		LayoutGrid,
		Disc3,
		Music,
		FolderOpen,
		Heart,
		Rocket,
		DollarSign,
		Calendar,
		MessageSquare,
		Shield,
		Settings
	} from 'lucide-svelte';

	let sidebarOpen = false;
	let isSearching = false;

	// 키보드 이벤트 핸들러
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			sidebarOpen = false;
		}
	}

	// 이벤트 리스너 등록
	onMount(() => {
		const handleToggle = (event: CustomEvent) => {
			sidebarOpen = event.detail.open;
		};

		const handleSearchChange = (event: CustomEvent) => {
			isSearching = event.detail.show;
			// 검색 상태가 변경되면 강제 리렌더링
			isSearching = isSearching;
		};
		
		window.addEventListener('sidebar-toggle', handleToggle as EventListener);
		window.addEventListener('search-change', handleSearchChange as EventListener);
		window.addEventListener('keydown', handleKeydown);
		
		return () => {
			window.removeEventListener('sidebar-toggle', handleToggle as EventListener);
			window.removeEventListener('search-change', handleSearchChange as EventListener);
			window.removeEventListener('keydown', handleKeydown);
		};
	});

	const menuItems = [
		{ icon: LayoutGrid, label: '대시보드', href: '/' },
		{ icon: Disc3, label: '앨범 관리', href: '/albums' },
		{ icon: Music, label: '트랙 관리', href: '/tracks' },
		{ icon: FolderOpen, label: '업로드·검증 센터', href: '/upload' },
		{ icon: Heart, label: '제작·협업 보드', href: '/collaboration' },
		{ icon: Rocket, label: '발매 관리', href: '/releases' },
		{ icon: DollarSign, label: '수익 관리', href: '/revenue' },
		{ icon: Calendar, label: '일정·캘린더', href: '/calendar' },
		{ icon: MessageSquare, label: '피드백·알림 센터', href: '/feedback' },
		{ icon: Shield, label: '보안·운영 관리', href: '/security' },
		{ icon: Settings, label: '설정', href: '/settings' }
	];

	// 현재 페이지가 메뉴 항목과 일치하는지 확인
	function isActive(href: string): boolean {
		// 검색 중일 때는 모든 메뉴 선택 해제
		if (isSearching) {
			return false;
		}
		
		const currentPath = $page.url.pathname;
		
		// 검색어가 없을 때만 메뉴 선택
		if (href === '/') {
			return currentPath === '/';
		}
		return currentPath.startsWith(href);
	}
</script>

<aside class="w-[240px] top-24 fixed left-0 h-[calc(100vh-96px)] bg-surface-2 border-r border-border-subtle z-40 transition-transform duration-300 {sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0">
	<nav>
		<ul class="space-y-0">
		{#each menuItems as item (item.label)}
			{@const IconComponent = item.icon}
			<li>
				<a
					href={item.href}
					class="flex items-center gap-3 px-6 py-3 w-full text-text-base hover:bg-hover-cyan hover:text-black transition-colors {isActive(item.href) ? 'bg-brand-pink text-white' : ''}"
					style="outline: none;"
				>
					<IconComponent size={16} />
					<span class="text-sm">{item.label}</span>
				</a>
			</li>
		{/each}
		</ul>
	</nav>
</aside>

<!-- 모바일 오버레이 -->
{#if sidebarOpen}
	<div 
		class="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
		role="button"
		tabindex="0"
		onclick={() => sidebarOpen = false}
		onkeydown={(e) => e.key === 'Enter' && (sidebarOpen = false)}
		aria-label="사이드바 닫기"
	></div>
{/if}
