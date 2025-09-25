<script lang="ts">
	import Card from '../Card.svelte';
	import { Calendar, Clock, Rocket } from 'lucide-svelte';

	// 목 데이터
	const releases = [
		{ id: 1, title: 'Sugar Rush Vol.2', when: '14:00' },
		{ id: 2, title: 'Single: Summer Vibes', when: '16:00' },
		{ id: 3, title: 'Remix Album', when: '18:00' },
		{ id: 4, title: 'OST Collection', when: '20:00' }
	];
</script>

<Card title="오늘 발매 일정" tooltip="당일 중심 일정" href="/releases">
	<div class="space-y-2">
		{#each releases.slice(0, 4) as release}
			<div class="flex items-center gap-2 text-sm">
				<Clock size={14} class="text-text-muted" />
				<span class="text-text-base flex-1">{release.title}</span>
				<span class="text-text-muted text-xs">{release.when}</span>
			</div>
		{/each}
	</div>
</Card>
