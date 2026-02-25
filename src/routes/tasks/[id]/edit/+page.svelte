<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { untrack } from 'svelte';
	import { ArrowLeft, Save } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';
	import { mockTasks } from '$lib/mocks/tasks';

	const id = $derived($page.params.id);
	const initialTask = $derived(mockTasks.find((t) => t.id === id));

	// 초기값을 즉시 반영하여 첫 렌더 깜빡임 방지 (의도적 초기값 캡처)
	let title = $state(untrack(() => initialTask?.title ?? ''));
	let due = $state(untrack(() => initialTask?.due ?? 'today'));
	let priority = $state(untrack(() => initialTask?.priority ?? false));
	let description = $state(untrack(() => initialTask?.description ?? ''));

	// id(페이지) 변경 시 폼 값 동기화 (SPA 내 태스크 간 이동)
	let prevId = $state(untrack(() => id));
	$effect(() => {
		if (id !== prevId) {
			prevId = id;
			const next = initialTask;
			if (next) {
				title = next.title;
				due = next.due;
				priority = next.priority;
				description = next.description;
			}
		}
	});

	function handleSubmit(e: Event) {
		e.preventDefault();
		// 목업: 실제 연결 시 PUT /api/tasks/:id 후 상세로 이동
		goto('/tasks/' + id);
	}
</script>

<PageContent>
	<PageHeader
		title="태스크 편집"
		description={title}
		actions={[{ label: '목록', href: '/tasks', icon: ArrowLeft }]}
	/>
	{#if initialTask}
		<form onsubmit={handleSubmit} class="max-w-xl space-y-4">
			<div>
				<label for="title" class="block text-sm font-medium text-text-strong mb-2">제목</label>
				<input id="title" type="text" bind:value={title} class="w-full px-3 py-2 bg-surface-2 border border-border-subtle rounded-lg text-text-strong focus:outline-none focus:ring-2 focus:ring-brand-pink" required />
			</div>
			<div>
				<label for="desc" class="block text-sm font-medium text-text-strong mb-2">설명</label>
				<textarea id="desc" bind:value={description} class="w-full px-3 py-2 bg-surface-2 border border-border-subtle rounded-lg text-text-strong focus:outline-none focus:ring-2 focus:ring-brand-pink" rows="3"></textarea>
			</div>
			<div>
				<label for="due" class="block text-sm font-medium text-text-strong mb-2">기한</label>
				<select id="due" bind:value={due} class="w-full px-3 py-2 bg-surface-2 border border-border-subtle rounded-lg text-text-strong focus:outline-none focus:ring-2 focus:ring-brand-pink">
					<option value="today">오늘</option>
					<option value="tomorrow">내일</option>
					<option value="this_week">이번 주</option>
				</select>
			</div>
			<div class="flex items-center gap-2">
				<input id="priority" type="checkbox" bind:checked={priority} class="rounded border-border-subtle text-brand-pink focus:ring-brand-pink" />
				<label for="priority" class="text-sm text-text-strong">우선순위</label>
			</div>
			<button type="submit" class="inline-flex items-center gap-2 px-4 py-2 bg-brand-pink text-[var(--surface-2)] rounded-lg font-medium hover:opacity-90">
				<Save size={16} />
				저장
			</button>
		</form>
	{:else}
		<p class="text-text-muted">해당 ID의 태스크를 찾을 수 없습니다.</p>
		<a href="/tasks" class="mt-4 inline-block text-brand-pink text-sm font-medium hover:underline">목록으로 돌아가기</a>
	{/if}
</PageContent>
