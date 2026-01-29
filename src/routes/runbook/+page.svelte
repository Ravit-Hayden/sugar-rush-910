<script lang="ts">
	import { BookOpen, ArrowLeft } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';

	// 목업: 실제 연결 시 /api/runbook 또는 정적 문서
	const sections = [
		{ id: '1', title: 'CDN 업로드 실패', steps: ['1. 재시도 버튼 클릭', '2. 실패 시 수동 업로드 스크립트 실행'] },
		{ id: '2', title: 'DB 연결 오류', steps: ['1. 연결 풀 확인', '2. 인스턴스 재시작'] }
	];
</script>

<PageContent>
	<PageHeader
		title="안내 가이드 (Runbook)"
		description="장애 유형별 대응 절차를 확인합니다."
		actions={[{ label: '장애 목록', href: '/failures', icon: ArrowLeft }]}
	/>
	<ul class="space-y-4">
		{#each sections as s}
			<li class="bg-surface-2 border border-border-subtle rounded-lg p-5">
				<h3 class="font-semibold text-text-strong mb-2">{s.title}</h3>
				<ol class="list-decimal list-inside text-text-muted text-sm space-y-1">
					{#each s.steps as step}
						<li>{step}</li>
					{/each}
				</ol>
			</li>
		{/each}
	</ul>
	<p class="mt-6 text-sm text-text-muted">실제 연동 시 Runbook API 또는 문서 저장소를 연결하면 바로 사용 가능합니다.</p>
</PageContent>
