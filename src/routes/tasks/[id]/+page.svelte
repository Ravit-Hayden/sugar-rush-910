<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { ArrowLeft, CheckSquare } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';
	import { mockTasks } from '$lib/mocks/tasks';

	const id = $derived($page.params.id);
	const task = $derived(mockTasks.find((t) => t.id === id) ?? null);
</script>

<PageContent>
	<PageHeader
		title={task?.title ?? '태스크'}
		description="태스크 상세"
		actions={[
			{ label: '목록', href: '/tasks', icon: ArrowLeft },
			{ label: '편집', href: '/tasks/' + id + '/edit', icon: CheckSquare }
		]}
	/>
	{#if task}
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
	{:else}
		<p class="text-text-muted">해당 ID의 태스크를 찾을 수 없습니다.</p>
		<a href="/tasks" class="mt-4 inline-block text-brand-pink text-sm font-medium hover:underline">목록으로 돌아가기</a>
	{/if}
</PageContent>
