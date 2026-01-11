<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Home, ArrowLeft, AlertCircle } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';

	let { error, status, message }: { error: any; status: number; message: string } = $props();

	const errorTitle = $derived(() => {
		if (status === 404) return '페이지를 찾을 수 없습니다';
		if (status === 500) return '서버 오류가 발생했습니다';
		if (status >= 400 && status < 500) return '요청 오류';
		if (status >= 500) return '서버 오류';
		return '오류가 발생했습니다';
	});

	const errorDescription = $derived(() => {
		if (status === 404) return '요청하신 페이지가 존재하지 않습니다.';
		if (status === 500) return '서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
		if (status >= 400 && status < 500) return '요청을 처리할 수 없습니다.';
		if (status >= 500) return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
		return message || '알 수 없는 오류가 발생했습니다.';
	});
</script>

<PageContent>
	<div class="flex flex-col items-center justify-center min-h-[60vh] text-center">
		<div class="mb-8">
			<div class="w-24 h-24 mx-auto mb-6 rounded-full bg-surface-2 flex items-center justify-center">
				<AlertCircle size={48} class="text-text-muted" />
			</div>
			<h1 class="text-4xl font-bold text-text-strong mb-2">{status || '오류'}</h1>
			<h2 class="text-2xl font-semibold text-text-strong mb-4">{errorTitle}</h2>
			<p class="text-text-muted max-w-md mx-auto mb-8">{errorDescription}</p>
		</div>

		<div class="flex flex-col sm:flex-row gap-3">
			<button
				onclick={() => {
					if (typeof window !== 'undefined' && window.history.length > 1) {
						window.history.back();
					} else {
						goto('/');
					}
				}}
				class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-surface-1 text-text-strong rounded-lg border border-border-subtle hover:bg-surface-2 transition-colors duration-200 font-medium"
				type="button"
			>
				<ArrowLeft size={16} />
				이전 페이지
			</button>
			<button
				onclick={() => goto('/')}
				class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-pink text-white rounded-lg hover:bg-brand-pink/90 transition-colors duration-200 font-medium"
				type="button"
			>
				<Home size={16} />
				홈으로 이동
			</button>
		</div>

		{#if import.meta.env.DEV && error}
			<div class="mt-12 p-6 bg-surface-1 rounded-lg border border-border-subtle max-w-2xl w-full text-left">
				<h3 class="text-sm font-semibold text-text-strong mb-3">개발 모드 오류 정보</h3>
				<pre class="text-xs text-text-muted overflow-auto">{JSON.stringify(error, null, 2)}</pre>
			</div>
		{/if}
	</div>
</PageContent>
