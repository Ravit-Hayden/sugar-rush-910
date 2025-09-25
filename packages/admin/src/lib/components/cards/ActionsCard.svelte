<script lang="ts">
	import Card from '../Card.svelte';
	import { Plus, Upload, DollarSign, Disc3 } from 'lucide-svelte';

	// 목 데이터
	const actions = [
		{ label: '새 앨범', href: '/albums/new', icon: Disc3 },
		{ label: '새 트랙', href: '/tracks/new', icon: Plus },
		{ label: '파일 업로드', href: '/files/upload', icon: Upload },
		{ label: '수익 정산', href: '/revenue', icon: DollarSign }
	];
</script>

<Card title="빠른 액션" tooltip="새 앨범/트랙/업로드/정산" href="/actions">
	<div class="grid grid-cols-2 gap-2">
		{#each actions as action}
			<a
				href={action.href}
				class="flex items-center gap-2 p-2 rounded-md bg-surface-1 hover:bg-surface-2 transition-colors duration-200 text-sm"
			>
				<svelte:component this={action.icon} size={14} class="text-brand-pink" />
				<span class="text-text-base">{action.label}</span>
			</a>
		{/each}
	</div>
</Card>
