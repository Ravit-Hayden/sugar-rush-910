<script lang="ts">
	import { page } from '$app/stores';
	import { ArrowLeft } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';

	const id = $derived($page.params.id);
	// 목업: 실제 연결 시 GET /api/changes/:id
	const change = $derived({
		id,
		text: '앨범 메타데이터 업데이트',
		time: '2시간 전',
		detail: '트랙 제목·아티스트명 일괄 수정 반영.'
	});
</script>

<PageContent>
	<PageHeader
		title="변경 상세"
		description={change.text}
		actions={[{ label: '목록', href: '/changes', icon: ArrowLeft }]}
	/>
	<div class="max-w-2xl space-y-4">
		<div class="bg-surface-2 border border-border-subtle rounded-lg p-5">
			<p class="text-text-strong">{change.detail}</p>
			<p class="mt-2 text-sm text-text-muted">{change.time}</p>
		</div>
	</div>
</PageContent>
