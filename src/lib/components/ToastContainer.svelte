<script lang="ts">
	import { toast } from '$lib/stores/toast';
	import Toast from './Toast.svelte';
</script>

<div class="fixed top-20 right-4 z-[9999] flex flex-col gap-2 pointer-events-none" aria-live="polite" aria-label="알림">
	{#each $toast as t (t.id)}
		<div class="pointer-events-auto">
			<Toast 
				message={t.message} 
				type={t.type} 
				duration={t.duration || 3000}
				onClose={() => toast.remove(t.id)}
			/>
		</div>
	{/each}
</div>

