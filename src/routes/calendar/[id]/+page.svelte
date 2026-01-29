<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { ArrowLeft, Calendar, Edit } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';

	const id = $derived($page.params.id);
	// 목업: 실제 연결 시 GET /api/calendar/:id
	const event = $derived({
		id,
		title: 'Sugar Rush Vol.1 발매',
		type: 'release',
		date: '2024-12-31',
		time: '14:00',
		description: '첫 번째 정규 앨범 발매 일정'
	});
</script>

<PageContent>
	<PageHeader
		title={event.title}
		description="일정 상세"
		actions={[
			{ label: '목록', href: '/calendar', icon: ArrowLeft },
			{ label: '편집', href: '/calendar/' + id + '/edit', icon: Edit }
		]}
	/>
	<div class="max-w-2xl space-y-4">
		<div class="bg-surface-2 border border-border-subtle rounded-lg p-5">
			<p class="text-text-strong">{event.description}</p>
			<div class="mt-4 text-sm text-text-muted">
				<span>날짜: {event.date}</span>
				<span class="ml-4">시각: {event.time}</span>
				<span class="ml-4">유형: {event.type}</span>
			</div>
		</div>
	</div>
	<p class="mt-6 text-sm text-text-muted">실제 연동 시 GET /api/calendar/:id 로 상세 조회 후 표시합니다.</p>
</PageContent>
