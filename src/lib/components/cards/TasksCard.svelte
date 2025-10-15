<script lang="ts">
	import Skeleton from '../Skeleton.svelte';
	import { Info, Plus, MessageCircle } from 'lucide-svelte';

	let { tasks = [], loading = false } = $props();

	const defaultTasks = [
		{ id: '1', title: '새 앨범 작업', priority: true },
		{ id: '2', title: '트랙 마스터링', priority: false },
		{ id: '3', title: '아트워크 검토', priority: false },
		{ id: '4', title: '릴리즈 준비', priority: true }
	];

	const displayTasks = tasks.length > 0 ? tasks : defaultTasks;

	const miniStats = [
		{ label: '열림', value: displayTasks.filter(t => !t.completed).length },
		{ label: '오늘', value: displayTasks.filter(t => t.due === 'today').length },
		{ label: '지연', value: displayTasks.filter(t => t.overdue).length }
	];
</script>

<div class="h-[396px] flex flex-col justify-between p-5 rounded-lg bg-surface-2 border border-border-subtle overflow-hidden pt-[24px]">
	<div>
		<!-- 상단 타이틀영역 -->
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-lg font-bold text-text-strong truncate">할 일 · 멘션</h3>
			<button class="inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-surface-1 transition-colors ml-2" aria-label="정보" title="내가 해야 할 업무와 호출 멘션 요약">
				<Info size={12} class="text-text-muted" />
			</button>
		</div>

		<!-- 중간 요약 영역 -->
		<div class="grid grid-cols-3 gap-2 mb-3">
			{#each miniStats as stat (stat.label)}
				<div class="h-8 bg-surface-1 rounded flex items-center justify-center px-2">
					<span class="text-xs text-text-muted truncate">{stat.label}: {stat.value}</span>
				</div>
			{/each}
		</div>

		<!-- 메인 목록/컨텐츠: 줄/행 개수 무조건 동일, 남는 줄은 placeholder -->
		<div class="grid grid-rows-4 gap-3">
			{#if loading}
				<Skeleton lines={2} />
			{:else}
				{#each displayTasks.slice(0, 4) as task, i (task.id)}
					<a
						href="/tasks/{task.id}"
						class="flex items-center h-12 px-4 bg-surface-1 rounded hover:bg-surface-2 transition-colors"
					>
						<!-- 좌측 체크박스 -->
						<span class="flex-shrink-0 w-5 h-5 flex items-center justify-center mr-3">
							<input 
								type="checkbox" 
								class="w-4 h-4 rounded appearance-none bg-transparent border border-[color:var(--text-base)] 
									   checked:bg-transparent checked:border-[color:var(--brand-pink)] checked:shadow-none
									   hover:border-[color:var(--hover-cyan)] focus:ring-2 focus:ring-[#FF3DAE]
									   transition-all duration-200 cursor-pointer relative" 
								aria-label="작업 완료 체크"
							/>
						</span>
						<!-- 중간 텍스트 (좌측정렬) -->
						<span class="flex-1 text-sm text-text-base truncate text-left">{task.title}</span>
						<!-- 우측 상태/버튼 -->
						<span class="flex-shrink-0 flex items-center gap-x-2">
							{#if task.priority}
								<span class="badge-base badge-high-urgent">높음</span>
							{:else}
								<span class="badge-base badge-medium-yellow">보통</span>
							{/if}
						</span>
					</a>
				{/each}
				{#if displayTasks.length < 4}
					{#each Array.from({length: 4 - displayTasks.length}) as _, i}
						<div class="h-12 px-4 bg-surface-1 rounded opacity-0 pointer-events-none">&nbsp;</div>
					{/each}
				{/if}
			{/if}
		</div>
	</div>

	<!-- 하단 액션 -->
	<div class="flex items-center justify-between mt-3">
		<div class="flex gap-x-2 flex-wrap items-center">
			<a href="/tasks/new" class="inline-flex items-center px-3 py-1 rounded border border-brand-pink text-brand-pink text-xs font-medium hover:bg-brand-pink hover:text-white transition cursor-pointer min-w-[70px]" aria-label="새 태스크" title="새 태스크">
				<Plus size={12} class="mr-1" />
				작업
			</a>
			<a href="/mentions" class="inline-flex items-center px-3 py-1 rounded border border-brand-pink text-brand-pink text-xs font-medium hover:bg-brand-pink hover:text-white transition cursor-pointer min-w-[70px]" aria-label="멘션" title="멘션">
				<MessageCircle size={12} class="mr-1" />
				멘션
			</a>
		</div>
		<a href="/tasks" class="text-brand-pink text-sm font-semibold px-2 py-1 rounded hover:bg-hover-cyan transition-colors">자세히 보기</a>
	</div>
</div>
