<script lang="ts">
	import Card from '../Card.svelte';
	import { MessageSquare, ThumbsUp, ThumbsDown, Star } from 'lucide-svelte';

	// 목 데이터
	const feedback = [
		{ id: 1, text: 'Sugar Rush Vol.2 음질 개선 요청', type: 'comment' },
		{ id: 2, text: '앨범 아트워크 디자인 리뷰', type: 'review' },
		{ id: 3, text: '발매 일정 조정 요청', type: 'request' },
		{ id: 4, text: '새로운 기능 제안', type: 'suggestion' }
	];

	function getFeedbackIcon(type: string) {
		switch (type) {
			case 'comment': return MessageSquare;
			case 'review': return Star;
			case 'request': return ThumbsUp;
			case 'suggestion': return ThumbsDown;
			default: return MessageSquare;
		}
	}
</script>

<Card title="피드백" tooltip="코멘트/리뷰" href="/feedback">
	<div class="space-y-2">
		{#each feedback.slice(0, 4) as item}
			<div class="flex items-center gap-2 text-sm">
				<svelte:component this={getFeedbackIcon(item.type)} size={14} class="text-text-muted" />
				<span class="text-text-base flex-1">{item.text}</span>
			</div>
		{/each}
	</div>
</Card>
