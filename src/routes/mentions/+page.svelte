<script lang="ts">
	import { AtSign, ArrowLeft } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';

	// 목업: 실제 연결 시 /api/mentions 등으로 교체
	let mentions = $state([
		{ id: '1', text: '앨범 커버 검토 요청 @design', from: '팀원A', time: '1시간 전' },
		{ id: '2', text: '마스터링 완료 알림 @audio', from: '시스템', time: '3시간 전' }
	]);
</script>

<PageContent>
	<PageHeader
		title="멘션"
		description="나를 멘션한 알림을 확인합니다."
		actions={[{ label: '태스크', href: '/tasks', icon: ArrowLeft }]}
	/>
	<ul class="space-y-3">
		{#each mentions as m}
			<li class="bg-surface-2 border border-border-subtle rounded-lg p-4">
				<p class="text-text-strong">{m.text}</p>
				<p class="text-sm text-text-muted mt-1">{m.from} · {m.time}</p>
			</li>
		{/each}
	</ul>
	<p class="mt-6 text-sm text-text-muted">실제 연동 시 /api/mentions 목록 API를 연결하면 바로 사용 가능합니다.</p>
</PageContent>
