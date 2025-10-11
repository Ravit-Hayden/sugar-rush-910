<script lang="ts">
	import Card from '../Card.svelte';
	import Skeleton from '../Skeleton.svelte';
	import { Plus, Upload, DollarSign } from 'lucide-svelte';

	let { actions = [], loading = false } = $props();

	const defaultActions = [
		{ label: '새 앨범', href: '/albums/new', icon: Plus },
		{ label: '새 트랙', href: '/tracks/new', icon: Plus },
		{ label: '파일 업로드', href: '/files/upload', icon: Upload },
		{ label: '수익 관리', href: '/revenue', icon: DollarSign }
	];

	const displayActions = actions.length > 0 ? actions : defaultActions;
</script>

<Card title="빠른 액션" tooltip="새 앨범/트랙/업로드/정산" class="h-80">
	{#if loading}
		<Skeleton lines={4} />
	{:else}
		<div class="grid grid-cols-2 gap-2">
		{#each displayActions.slice(0, 4) as action (action.label)}
			{@const IconComponent = action.icon}
			<a
				href={action.href}
				class="flex items-center gap-2 p-3 bg-surface-1 rounded hover:bg-surface-2 transition-colors"
			>
				<IconComponent size={16} class="text-text-base" />
				<span class="text-sm text-text-base">{action.label}</span>
			</a>
		{/each}
		</div>
	{/if}
</Card>
