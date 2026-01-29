<script lang="ts">
	import { FileText, ArrowLeft } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';

	// 목업: 실제 연결 시 /api/logs 등으로 교체
	let logs = $state([
		{ id: '1', text: '사용자 로그인: El', time: '10분 전' },
		{ id: '2', text: '앨범 업로드 완료: Sugar Rush Vol.1', time: '1시간 전' },
		{ id: '3', text: '시스템 백업 완료', time: '2시간 전' },
		{ id: '4', text: 'API 배포: v2.1.0', time: '3시간 전' }
	]);
</script>

<PageContent>
	<PageHeader
		title="시스템 로그"
		description="오늘·이번주·이번달 로그를 확인합니다."
		actions={[{ label: '대시보드', href: '/', icon: ArrowLeft }]}
	/>
	<ul class="space-y-3">
		{#each logs as log}
			<li>
				<a
					href="/logs/{log.id}"
					class="block bg-surface-2 border border-border-subtle rounded-lg p-4 hover:border-[var(--hover-point)] transition-colors"
				>
					<div class="flex items-center gap-3">
						<FileText size={18} class="text-text-muted flex-shrink-0" />
						<span class="flex-1 text-text-strong">{log.text}</span>
						<span class="text-sm text-text-muted">{log.time}</span>
					</div>
				</a>
			</li>
		{/each}
	</ul>
	<p class="mt-6 text-sm text-text-muted">실제 연동 시 /api/logs 목록·상세 API를 연결하면 바로 사용 가능합니다.</p>
</PageContent>
