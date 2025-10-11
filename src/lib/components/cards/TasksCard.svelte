<script lang="ts">
	import Card from '../Card.svelte';
	import Skeleton from '../Skeleton.svelte';
	import { Plus, MessageSquare } from 'lucide-svelte';

	let { tasks = [], loading = false } = $props();

	const miniStats = [
		{ label: '열림', value: tasks.filter(t => !t.completed).length },
		{ label: '오늘', value: tasks.filter(t => t.due === 'today').length },
		{ label: '지연', value: tasks.filter(t => t.overdue).length }
	];
</script>

<Card title="할 일 · 멘션" tooltip="내가 해야 할 업무와 호출 멘션 요약">
	{#if loading}
		<Skeleton lines={4} />
	{:else}
		<!-- 미니 통계 -->
		<div class="grid grid-cols-3 gap-2 mb-4">
			{#each miniStats as stat (stat.label)}
				<div class="h-8 bg-surface-1 rounded flex items-center justify-center">
					<span class="text-[11px] text-text-muted">{stat.label}: {stat.value}</span>
				</div>
			{/each}
		</div>

		<!-- 할 일 목록 -->
		<div class="space-y-2 mb-4">
			{#each tasks.slice(0, 4) as task (task.id)}
				<div class="flex items-center justify-between p-2 bg-surface-1 rounded">
					<div class="flex items-center gap-2">
						<input type="checkbox" class="rounded" />
						<span class="text-sm text-text-base truncate">{task.title}</span>
						{#if task.priority}
							<span class="text-[10px] px-1 py-0.5 rounded text-white" style="background-color: var(--danger-fg);">우선</span>
						{/if}
					</div>
				</div>
			{/each}
		</div>

		<!-- 하단 액션 그룹 -->
		<div class="flex flex-row justify-end gap-x-2 mt-3">
			<a href="/tasks/new" class="btn-retry text-[10px] px-2 py-1 flex items-center justify-center rounded-full bg-brand-pink hover:bg-hover-cyan text-white font-semibold">
				<Plus size={12} class="mr-1" />
				<span>새 태스크</span>
			</a>
			<a href="/mentions" class="btn-retry text-[10px] px-2 py-1 flex items-center justify-center rounded-full bg-brand-pink hover:bg-hover-cyan text-white font-semibold">
				<MessageSquare size={12} class="mr-1" />
				<span>멘션</span>
			</a>
		</div>
	{/if}
</Card>
