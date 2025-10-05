<script lang="ts">
	import { PanelLeftOpen, PanelLeftClose, Search, Bell } from 'lucide-svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	let sidebarOpen = false;
	let searchValue = '';

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
		// 사이드바 상태를 전역으로 관리할 수 있도록 이벤트 발생
		window.dispatchEvent(new CustomEvent('sidebar-toggle', { detail: { open: sidebarOpen } }));
	}
</script>

<header class="h-24 px-6 sticky top-0 z-50 bg-bg border-b border-border-subtle">
	<div class="flex h-full items-center justify-between">
		<!-- Left Slot: 로고 + 사이드바 토글 (사이드바 영역 내에서 배치) -->
		<div class="flex items-center w-[240px]">
			<img src="/logo.svg" alt="Sugar Rush" class="h-8 w-auto" />
			<div class="flex-1"></div>
			<div class="flex items-center">
				<button
					onclick={toggleSidebar}
					class="inline-flex items-center justify-center w-6 h-6 rounded-md hover:bg-surface-1 transition-colors"
					aria-label="사이드바 토글"
				>
					{#if sidebarOpen}
						<PanelLeftClose size={16} style="color: var(--brand-pink);" />
					{:else}
						<PanelLeftOpen size={16} style="color: var(--brand-pink);" />
					{/if}
				</button>
				<div class="w-12"></div>
			</div>
		</div>

		<!-- Center Slot: 페이지 타이틀 (좌측 정렬) -->
		<div class="flex items-center flex-1 justify-start">
			<h2 class="text-lg font-semibold" style="color: var(--brand-pink);">대시보드</h2>
		</div>

		<!-- Right Slot: 검색창 + 알림 + 테마 토글 -->
		<div class="flex items-center gap-4">
			<!-- 검색창 -->
			<div class="relative">
				<Search 
					size={16} 
					class="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-base transition-colors {searchValue ? 'text-brand-pink' : ''}" 
				/>
				<input
					bind:value={searchValue}
					type="text"
					placeholder="검색..."
					class="pl-10 pr-4 py-1.5 w-64 bg-surface-1 border border-border-subtle rounded-md text-text-base placeholder-text-muted focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink transition-colors"
				/>
			</div>

			<!-- 알림 버튼 -->
			<button
				class="relative inline-flex items-center justify-center w-6 h-6 rounded-md hover:bg-surface-1 transition-colors"
				aria-label="알림"
			>
				<Bell size={16} class="text-text-base" />
				<!-- 새로운 알림 표시 점 -->
				<span class="absolute -top-1 -right-1 w-2 h-2 rounded-full" style="background-color: var(--brand-pink);"></span>
			</button>

			<!-- 테마 토글 -->
			<ThemeToggle />
		</div>
	</div>
</header>
