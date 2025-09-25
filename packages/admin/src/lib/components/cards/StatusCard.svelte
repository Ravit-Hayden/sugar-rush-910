<script lang="ts">
	import Card from '../Card.svelte';
	import { Server, Database, Cloud, CheckCircle, AlertCircle } from 'lucide-svelte';

	// 목 데이터
	const statusItems = [
		{ key: 'API 서버', value: '정상', status: 'ok' },
		{ key: '데이터베이스', value: '정상', status: 'ok' },
		{ key: 'CDN', value: '지연', status: 'warn' },
		{ key: '이메일 서비스', value: '정상', status: 'ok' }
	];

	function getStatusIcon(status: string) {
		return status === 'ok' ? CheckCircle : AlertCircle;
	}

	function getStatusColor(status: string) {
		return status === 'ok' ? 'text-ok-fg' : 'text-warn-fg';
	}
</script>

<Card title="시스템 상태" tooltip="운영 스냅샷" href="/status">
	<div class="space-y-3">
		{#each statusItems as item}
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<svelte:component this={getStatusIcon(item.status)} size={14} class={getStatusColor(item.status)} />
					<span class="text-sm text-text-base">{item.key}</span>
				</div>
				<span class="text-sm font-medium {getStatusColor(item.status)}">{item.value}</span>
			</div>
		{/each}
	</div>
</Card>
