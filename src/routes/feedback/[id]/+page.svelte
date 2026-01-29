<script lang="ts">
	import { page } from '$app/stores';
	import { ArrowLeft } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';

	const id = $derived($page.params.id);
	// 목업: 실제 연결 시 GET /api/feedback/:id
	const feedback = {
		id,
		title: '새로운 앨범 컨셉에 대한 피드백',
		from: 'El',
		time: '1시간 전',
		content: '커버 아트 방향성과 트랙 순서에 대한 제안이 있습니다.',
		status: 'unread'
	};
</script>

<PageContent>
	<PageHeader
		title={feedback.title}
		description="피드백 상세"
		actions={[{ label: '목록', href: '/feedback', icon: ArrowLeft }]}
	/>
	<div class="max-w-2xl space-y-4">
		<div class="bg-surface-2 border border-border-subtle rounded-lg p-5">
			<p class="text-text-strong">{feedback.content}</p>
			<p class="mt-2 text-sm text-text-muted">보낸 사람: {feedback.from} · {feedback.time}</p>
		</div>
	</div>
	<p class="mt-6 text-sm text-text-muted">실제 연동 시 GET /api/feedback/:id 로 상세 조회 후 표시합니다.</p>
</PageContent>
