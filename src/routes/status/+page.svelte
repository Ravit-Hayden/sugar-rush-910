<script lang="ts">
	import { Activity, ArrowLeft } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';

	// 목업: 실제 연결 시 /api/status 등으로 교체
	let statusList = $state([
		{ key: 'API 서버', value: 'OK' },
		{ key: '데이터베이스', value: 'OK' },
		{ key: 'CDN', value: 'Warning' },
		{ key: '이메일 서비스', value: 'OK' }
	]);
</script>

<PageContent>
	<PageHeader
		title="시스템 상태"
		description="서비스별 상태를 확인합니다."
		actions={[{ label: '대시보드', href: '/', icon: ArrowLeft }]}
	/>
	<ul class="space-y-3">
		{#each statusList as item}
			<li>
				<a
					href="/status/{encodeURIComponent(item.key)}"
					class="block bg-surface-2 border border-border-subtle rounded-lg p-4 hover:border-[var(--hover-point)] transition-colors"
				>
					<div class="flex items-center justify-between">
						<span class="font-medium text-text-strong">{item.key}</span>
						<span class="text-sm {item.value === 'OK' ? 'text-ok-fg' : item.value === 'Warning' ? 'text-warn-fg' : 'text-red-400'}">{item.value}</span>
					</div>
				</a>
			</li>
		{/each}
	</ul>
	<p class="mt-6 text-sm text-text-muted">실제 연동 시 /api/status 목록·상세 API를 연결하면 바로 사용 가능합니다.</p>
</PageContent>
