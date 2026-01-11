<script lang="ts">
	import Skeleton from '../Skeleton.svelte';
	import { Plus, Upload, DollarSign, Info } from 'lucide-svelte';

	let { actions = [], loading = false } = $props();

	const defaultActions = [
		{ label: '새 앨범', href: '/albums/new', icon: Plus },
		{ label: '새 트랙', href: '/tracks/new', icon: Plus },
		{ label: '파일 업로드', href: '/files/upload', icon: Upload },
		{ label: '수익 관리', href: '/revenue', icon: DollarSign }
	];

	const displayActions = actions.length > 0 ? actions : defaultActions;
</script>

<div class="card-base h-[396px] flex flex-col justify-between p-5 rounded-lg bg-surface-2 border border-border-subtle overflow-hidden pt-[24px]">
	<div>
		<!-- 상단 타이틀영역 -->
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-lg font-bold text-text-strong truncate">빠른 액션</h3>
			<button class="inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-surface-1 transition-colors ml-2" aria-label="정보" title="새 앨범/트랙/업로드/정산">
				<Info size={12} class="text-text-muted" />
			</button>
		</div>

		<!-- 중간 요약 영역 -->
		<div class="grid grid-cols-3 gap-2 mb-3">
			<div class="h-8 bg-surface-1 rounded flex items-center justify-center px-2">
				<span class="text-xs text-text-muted truncate">앨범: 4</span>
			</div>
			<div class="h-8 bg-surface-1 rounded flex items-center justify-center px-2">
				<span class="text-xs text-text-muted truncate">트랙: 12</span>
			</div>
			<div class="h-8 bg-surface-1 rounded flex items-center justify-center px-2">
				<span class="text-xs text-text-muted truncate">업로드: 8</span>
			</div>
		</div>

		<!-- 메인 목록/컨텐츠: 줄/행 개수 무조건 동일, 남는 줄은 placeholder -->
		<div class="grid grid-rows-4 gap-3">
			{#if loading}
				<Skeleton lines={2} />
			{:else}
				{#each displayActions.slice(0, 4) as action (action.label)}
					{@const IconComponent = action.icon}
					<a
						href={action.href}
						class="flex items-center h-12 px-4 bg-surface-1 rounded hover:bg-surface-2 transition-colors"
					>
						<!-- 좌측 아이콘 -->
						<span class="flex-shrink-0 w-5 h-5 flex items-center justify-center mr-3">
							<IconComponent size={16} class="text-text-base flex-shrink-0" />
						</span>
						<!-- 중간 텍스트 (좌측정렬) -->
						<span class="flex-1 text-sm text-text-base truncate text-left">{action.label}</span>
						<!-- 우측 상태/버튼 -->
						<span class="flex-shrink-0 flex items-center gap-x-2">
							<!-- 빈 공간 유지 -->
						</span>
					</a>
				{/each}
				{#if displayActions.length < 4}
					{#each Array.from({length: 4 - displayActions.length}) as _, i}
						<div class="h-12 px-4 bg-surface-1 rounded opacity-0 pointer-events-none">&nbsp;</div>
					{/each}
				{/if}
			{/if}
		</div>
	</div>

	<!-- 하단 액션 -->
	<a href="/actions" class="self-end text-brand-pink text-sm font-semibold px-2 py-1 rounded hover:bg-hover-cyan transition-colors mt-3">
		더보기
	</a>
</div>
