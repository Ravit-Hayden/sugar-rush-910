<script lang="ts">
	import { page } from '$app/stores';
	import { ArrowLeft, FileText } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';

	const id = $derived($page.params.id);
	// 목업: 실제 연결 시 GET /api/logs/:id
	const log = $derived({
		id,
		text: '사용자 로그인: El',
		time: '10분 전',
		detail: 'IP 192.168.1.1, User-Agent Mozilla/5.0...',
		level: 'info'
	});
</script>

<PageContent>
	<PageHeader
		title="로그 상세"
		description={log.text}
		actions={[{ label: '목록', href: '/logs', icon: ArrowLeft }]}
	/>
	<div class="max-w-2xl space-y-4">
		<div class="bg-surface-2 border border-border-subtle rounded-lg p-5">
			<p class="text-text-strong">{log.detail}</p>
			<p class="mt-2 text-sm text-text-muted">레벨: {log.level} · {log.time}</p>
		</div>
	</div>
</PageContent>
