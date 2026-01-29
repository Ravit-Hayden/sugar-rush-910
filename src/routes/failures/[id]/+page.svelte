<script lang="ts">
	import { page } from '$app/stores';
	import { ArrowLeft, AlertCircle } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';

	const id = $derived($page.params.id);
	// 목업: 실제 연결 시 GET /api/failures/:id
	const failure = $derived({
		id,
		text: 'CDN 업로드 실패',
		retryable: true,
		status: 'failed',
		detail: '업로드 타임아웃으로 인한 실패. 재시도 가능.',
		occurredAt: '2024-01-15 14:30'
	});
</script>

<PageContent>
	<PageHeader
		title="장애 상세"
		description={failure.text}
		actions={[{ label: '목록', href: '/failures', icon: ArrowLeft }]}
	/>
	<div class="max-w-2xl space-y-4">
		<div class="bg-surface-2 border border-border-subtle rounded-lg p-5">
			<p class="text-text-strong">{failure.detail}</p>
			<div class="mt-4 text-sm text-text-muted">발생: {failure.occurredAt} · 재시도: {failure.retryable ? '가능' : '불가'}</div>
		</div>
	</div>
</PageContent>
