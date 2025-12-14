<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	
	let { children } = $props();
	
	const dispatch = createEventDispatcher();
</script>

<!-- 통일된 페이지 컨테이너 - 전체 너비 사용 -->
<div class="w-full">
	{@render children?.()}
</div>
