<script lang="ts">
	import { page } from '$app/stores';
	import { ArrowLeft, Activity } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';

	const key = $derived(decodeURIComponent($page.params.key || ''));
	// 목업: 실제 연결 시 GET /api/status/:key
	const status = {
		key,
		value: 'OK',
		detail: '응답 지연 50ms 이하, 가동률 99.9%',
		updatedAt: '2024-01-15 15:00'
	};
</script>

<PageContent>
	<PageHeader
		title="상태 상세"
		description={status.key}
		actions={[{ label: '목록', href: '/status', icon: ArrowLeft }]}
	/>
	<div class="max-w-2xl space-y-4">
		<div class="bg-surface-2 border border-border-subtle rounded-lg p-5">
			<p class="text-text-strong">{status.detail}</p>
			<p class="mt-2 text-sm text-text-muted">상태: {status.value} · 갱신: {status.updatedAt}</p>
		</div>
	</div>
</PageContent>
