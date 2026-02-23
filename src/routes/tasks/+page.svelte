<script lang="ts">
	import { goto } from '$app/navigation';
	import { CheckSquare, Plus, Calendar } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';
	import { mockTasks } from '$lib/mocks/tasks';

	const tasks = mockTasks;
</script>

<PageContent>
	<PageHeader
		title="태스크"
		description="할 일 목록을 관리합니다."
		actions={[
			{ label: '새 태스크', href: '/tasks/new', icon: Plus },
			{ label: '멘션', href: '/mentions', icon: CheckSquare }
		]}
	/>
	<ul class="space-y-3">
		{#each tasks as task}
			<li>
				<a
					href="/tasks/{task.id}"
					class="block bg-surface-2 border border-border-subtle rounded-lg p-4 hover:border-[var(--hover-point)] transition-colors"
				>
					<div class="flex items-center gap-3">
						<CheckSquare size={18} class="text-text-muted flex-shrink-0" />
						<span class="flex-1 font-medium text-text-strong {task.completed ? 'line-through text-text-muted' : ''}">{task.title}</span>
						{#if task.priority}
							<span class="text-xs px-2 py-0.5 rounded bg-brand-pink/20 text-brand-pink">우선</span>
						{/if}
						<span class="text-xs text-text-muted">{task.due}</span>
					</div>
				</a>
			</li>
		{/each}
	</ul>
	<p class="mt-6 text-sm text-text-muted">실제 연동 시 /api/tasks 목록·상세·생성 API를 연결하면 바로 사용 가능합니다.</p>
</PageContent>
