<script lang="ts">
	import { AlertCircle, ArrowLeft, BookOpen } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';

	// 목업: 실제 연결 시 /api/failures 등으로 교체
	let failures = $state([
		{ id: '1', text: 'CDN 업로드 실패', retryable: true, status: 'failed' },
		{ id: '2', text: '데이터베이스 연결 오류', retryable: true, status: 'retrying' },
		{ id: '3', text: '권한 검증 실패', retryable: false, status: 'blocked' }
	]);
</script>

<PageContent>
	<PageHeader
		title="장애·오류"
		description="실패·재시도·차단 목록을 확인합니다."
		actions={[
			{ label: '안내 가이드', href: '/runbook', icon: BookOpen },
			{ label: '대시보드', href: '/', icon: ArrowLeft }
		]}
	/>
	<ul class="space-y-3">
		{#each failures as f}
			<li>
				<a
					href="/failures/{f.id}"
					class="block bg-surface-2 border border-border-subtle rounded-lg p-4 hover:border-[var(--hover-point)] transition-colors"
				>
					<div class="flex items-center gap-3">
						<AlertCircle size={18} class="text-warn-fg flex-shrink-0" />
						<span class="flex-1 font-medium text-text-strong">{f.text}</span>
						<span class="text-xs px-2 py-0.5 rounded {f.status === 'retrying' ? 'bg-ok-fg/20 text-ok-fg' : f.status === 'blocked' ? 'bg-warn-fg/20 text-warn-fg' : 'bg-red-500/20 text-red-400'}">{f.status}</span>
					</div>
				</a>
			</li>
		{/each}
	</ul>
	<p class="mt-6 text-sm text-text-muted">실제 연동 시 /api/failures 목록·상세·재시도 API를 연결하면 바로 사용 가능합니다.</p>
</PageContent>
