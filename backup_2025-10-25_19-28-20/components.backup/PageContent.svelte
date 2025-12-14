<script lang="ts">
	export let children: any;
	export let className: string = '';
	export let padding: string = 'pt-0 pb-6';
</script>

<!-- 페이지 컨텐츠 래퍼 -->
<div class="bg-bg text-text-base {padding} {className}">
	{@render children?.()}
</div>
