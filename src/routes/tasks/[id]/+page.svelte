<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { ArrowLeft, CheckSquare, Calendar } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';

	const id = $derived($page.params.id);
	// 목업: 실제 연결 시 GET /api/tasks/:id 등으로 교체
	const task = {
		id,
		title: '앨범 커버 디자인 검토',
		priority: true,
		completed: false,
		due: 'today',
		description: '첫 번째 정규 앨범 커버 최종 검토 및 피드백 반영.'
	};
</script>

<PageContent>
	<PageHeader
		title={task.title}
		description="태스크 상세"
		actions={[
			{ label: '목록', href: '/tasks', icon: ArrowLeft },
			{ label: '편집', href: '/tasks/' + id + '/edit', icon: CheckSquare }
		]}
	/>
	<div class="max-w-2xl space-y-4">
		<div class="bg-surface-2 border border-border-subtle rounded-lg p-5">
			<p class="text-text-strong">{task.description}</p>
			<div class="mt-4 flex gap-4 text-sm text-text-muted">
				<span>기한: {task.due}</span>
				{#if task.priority}
					<span class="text-brand-pink">우선</span>
				{/if}
			</div>
		</div>
	</div>
	<p class="mt-6 text-sm text-text-muted">실제 연동 시 GET /api/tasks/:id 로 상세 조회 후 표시합니다.</p>
</PageContent>
