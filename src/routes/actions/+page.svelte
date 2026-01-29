<script lang="ts">
	import { Zap, DollarSign, Calendar, FileText } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';

	// 목업: 대시보드 ActionsCard와 동일 구조, 실제 연결 시 /api/actions 등
	const actions = [
		{ label: '수익 관리', href: '/revenue', icon: DollarSign },
		{ label: '지출 관리', href: '/expenses', icon: FileText },
		{ label: '일정 관리', href: '/calendar', icon: Calendar }
	];
</script>

<PageContent>
	<PageHeader
		title="액션"
		description="자주 쓰는 작업으로 이동합니다."
		actions={[{ label: '대시보드', href: '/', icon: Zap }]}
	/>
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each actions as action}
			<a
				href={action.href}
				class="flex items-center gap-4 p-5 bg-surface-2 border border-border-subtle rounded-lg hover:border-[var(--hover-point)] transition-colors"
			>
				<svelte:component this={action.icon} size={24} class="text-brand-pink flex-shrink-0" />
				<span class="font-medium text-text-strong">{action.label}</span>
			</a>
		{/each}
	</div>
	<p class="mt-6 text-sm text-text-muted">실제 연동 시 /api/actions 또는 메뉴 설정 API를 연결하면 바로 사용 가능합니다.</p>
</PageContent>
