<script lang="ts">
	import { Search, Bell, PanelLeftOpen, PanelLeftClose } from 'lucide-svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	let sidebarOpen = false;
	let searchValue = '';

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
		// 사이드바 상태를 전역으로 관리할 수 있도록 이벤트 발생
		// TODO: 전역 상태 관리로 개선
	}
</script>

<header class="h-[56px] px-6 sticky top-0 z-50 bg-bg border-b border-border-subtle">
	<div class="grid grid-cols-[240px,1fr,auto] h-full items-center">
		<!-- Left Slot: 로고 + 사이드바 토글 -->
		<div class="flex items-center gap-4">
			<div class="text-brand-pink font-bold text-lg">Sugar Rush</div>
			<button
				on:click={toggleSidebar}
				class="inline-flex items-center justify-center w-6 h-6 rounded-md hover:bg-surface-1 transition-colors duration-200"
				aria-label="사이드바 토글"
			>
				{#if sidebarOpen}
					<PanelLeftClose size={16} class="text-text-base" />
				{:else}
					<PanelLeftOpen size={16} class="text-text-base" />
				{/if}
			</button>
		</div>

		<!-- Center Slot: 페이지 타이틀 -->
		<div class="text-brand-pink font-semibold text-sm">
			대시보드
		</div>

		<!-- Right Slot: 검색 + 알림 + 테마 -->
		<div class="flex items-center gap-4">
			<!-- 검색창 -->
			<div class="relative">
				<Search size={16} class="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-base" />
				<input
					type="text"
					bind:value={searchValue}
					placeholder="검색..."
					class="pl-10 pr-4 py-2 w-64 bg-surface-1 border border-brand-pink rounded-md text-text-base placeholder-text-muted focus:outline-none focus:border-hover-cyan focus:ring-1 focus:ring-hover-cyan"
				/>
			</div>

			<!-- 알림 -->
			<button
				class="relative inline-flex items-center justify-center w-6 h-6 rounded-md hover:bg-surface-1 transition-colors duration-200"
				aria-label="알림"
			>
				<Bell size={16} class="text-text-base" />
				<!-- 새로운 알림 표시점 -->
				<div class="absolute -top-1 -right-1 w-2 h-2 bg-brand-pink rounded-full"></div>
			</button>

			<!-- 테마 토글 -->
			<ThemeToggle />
		</div>
	</div>
</header>
