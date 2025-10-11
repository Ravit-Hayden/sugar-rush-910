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

<Card title="할 일 · 멘션" tooltip="내가 해야 할 업무와 호출 멘션 요약" class="h-80">
	{#if loading}
		<Skeleton lines={4} />
	{:else}
		<!-- 미니 통계 -->
		<div class="grid grid-cols-3 gap-2 mb-3">
			{#each miniStats as stat (stat.label)}
				<div class="h-8 bg-surface-1 rounded flex items-center justify-center">
					<span class="text-[11px] text-text-muted truncate">{stat.label}: {stat.value}</span>
				</div>
			{/each}
		</div>

		<!-- 할 일 목록 -->
		<div class="space-y-2 mb-3">
			{#each tasks.slice(0, 3) as task (task.id)}
				<div class="flex items-center justify-between p-2 bg-surface-1 rounded">
					<div class="flex items-center gap-2 min-w-0 flex-1">
						<input type="checkbox" class="rounded flex-shrink-0" />
						<span class="text-sm text-text-base truncate">{task.title}</span>
						{#if task.priority}
							<span class="text-[10px] px-1 py-0.5 rounded text-white flex-shrink-0" style="background-color: var(--danger-fg);">우선</span>
						{/if}
					</div>
				</div>
			{/each}
		</div>

		<!-- 하단 액션 그룹 -->
		<div class="mt-auto flex flex-row justify-end gap-x-2 mb-2">
			<a href="/tasks/new" class="text-[10px] px-2 py-1 flex items-center justify-center rounded-md bg-brand-pink hover:bg-hover-cyan text-white font-semibold h-[18px] min-w-[38px]">
				<Plus size={12} class="mr-1" />
				<span>새 태스크</span>
			</a>
			<a href="/mentions" class="text-[10px] px-2 py-1 flex items-center justify-center rounded-md bg-brand-pink hover:bg-hover-cyan text-white font-semibold h-[18px] min-w-[38px]">
				<MessageSquare size={12} class="mr-1" />
				<span>멘션</span>
			</a>
			<a href="/tasks" class="text-brand-pink font-semibold text-sm px-4 py-1 rounded transition-colors hover:bg-hover-cyan">
				자세히 보기
			</a>
		</div>
	{/if}
</Card>
