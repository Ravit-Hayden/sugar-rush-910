<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { ArrowLeft, Save } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';

	const id = $derived($page.params.id);
	let title = $state('앨범 커버 디자인 검토');
	let due = $state('today');
	let priority = $state(true);
	let description = $state('첫 번째 정규 앨범 커버 최종 검토 및 피드백 반영.');

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
</PageContent>
