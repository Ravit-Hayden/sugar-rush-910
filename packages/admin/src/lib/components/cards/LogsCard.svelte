<script lang="ts">
	import Card from '../Card.svelte';
	import { FileText, AlertCircle, CheckCircle, Info } from 'lucide-svelte';

	// 목 데이터
	const logs = [
		{ id: 1, text: '앨범 업로드 완료', ts: '14:30', level: 'info' },
		{ id: 2, text: '사용자 로그인', ts: '14:25', level: 'info' },
		{ id: 3, text: 'CDN 캐시 갱신 실패', ts: '14:20', level: 'error' },
		{ id: 4, text: '데이터베이스 백업 완료', ts: '14:15', level: 'success' }
	];

	function getLogIcon(level: string) {
		switch (level) {
			case 'error': return AlertCircle;
			case 'success': return CheckCircle;
			case 'info': return Info;
			default: return FileText;
		}
	}

	function getLogColor(level: string) {
		switch (level) {
			case 'error': return 'text-danger-fg';
			case 'success': return 'text-ok-fg';
			case 'info': return 'text-text-base';
			default: return 'text-text-muted';
		}
	}
</script>

<Card title="시스템 로그" tooltip="운영 이벤트" href="/logs">
	<div class="space-y-2">
		{#each logs.slice(0, 4) as log}
			<div class="flex items-center gap-2 text-sm">
				<svelte:component this={getLogIcon(log.level)} size={14} class={getLogColor(log.level)} />
				<span class="text-text-base flex-1">{log.text}</span>
				<span class="text-text-muted text-xs">{log.ts}</span>
			</div>
		{/each}
	</div>
</Card>
