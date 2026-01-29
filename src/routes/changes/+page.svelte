<script lang="ts">
	import { GitBranch, ArrowLeft } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';

	// 목업: 실제 연결 시 /api/changes 등으로 교체
	let changes = $state([
		{ id: '1', text: '앨범 메타데이터 업데이트', time: '2시간 전', recent: true },
		{ id: '2', text: '사용자 권한 정책 변경', time: '1일 전', recent: false },
		{ id: '3', text: 'API 엔드포인트 추가', time: '3시간 전', recent: true }
	]);
</script>

<PageContent>
	<PageHeader
		title="변경 이력"
		description="최근 변경 사항을 확인합니다."
		actions={[{ label: '대시보드', href: '/', icon: ArrowLeft }]}
	/>
	<ul class="space-y-3">
		{#each changes as c}
			<li>
				<a
					href="/changes/{c.id}"
					class="block bg-surface-2 border border-border-subtle rounded-lg p-4 hover:border-[var(--hover-point)] transition-colors"
				>
					<p class="font-medium text-text-strong">{c.text}</p>
					<p class="text-sm text-text-muted mt-1">{c.time}</p>
				</a>
			</li>
		{/each}
	</ul>
	<p class="mt-6 text-sm text-text-muted">실제 연동 시 /api/changes 목록·상세 API를 연결하면 바로 사용 가능합니다.</p>
</PageContent>
