<script lang="ts">
	import { page } from '$app/stores';
	import { ArrowLeft } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';

	const id = $derived($page.params.id);
	// 목업: 실제 연결 시 GET /api/releases/:id
	const release = $derived({
		id,
		title: 'Sugar Rush Vol.1',
		when: '14:00',
		status: 'scheduled',
		platforms: ['Spotify', 'Apple Music', 'YouTube Music'],
		description: '첫 번째 정규 앨범'
	});
</script>

<PageContent>
	<PageHeader
		title={release.title}
		description="발매 상세"
		actions={[{ label: '목록', href: '/releases', icon: ArrowLeft }]}
	/>
	<div class="max-w-2xl space-y-4">
		<div class="bg-surface-2 border border-border-subtle rounded-lg p-5">
			<p class="text-text-strong">{release.description}</p>
			<div class="mt-4 text-sm text-text-muted">
				<span>예정 시각: {release.when}</span>
				<span class="ml-4">상태: {release.status}</span>
			</div>
			<p class="mt-2 text-sm text-text-muted">플랫폼: {release.platforms.join(', ')}</p>
		</div>
	</div>
	<p class="mt-6 text-sm text-text-muted">실제 연동 시 GET /api/releases/:id 로 상세 조회 후 표시합니다.</p>
</PageContent>
