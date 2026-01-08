<script lang="ts">
	import { goto } from '$app/navigation';
	import { DollarSign, TrendingDown, BarChart3, Plus } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';

	// 지출 데이터
	let expenses = $state<any[]>([]);
	let loading = $state(true);

	// 지출 통계 계산
	const expenseStats = $derived.by(() => {
		const total = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
		
		// 이번 달 지출 계산
		const now = new Date();
		const currentMonth = now.getMonth();
		const currentYear = now.getFullYear();
		const monthly = expenses
			.filter(e => {
				if (!e.date) return false;
				const date = new Date(e.date);
				return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
			})
			.reduce((sum, e) => sum + (e.amount || 0), 0);

		// 카테고리별 지출 집계
		const categoryMap = new Map<string, number>();
		expenses.forEach(e => {
			const category = e.category || '기타';
			const current = categoryMap.get(category) || 0;
			categoryMap.set(category, current + (e.amount || 0));
		});

		const categories = Array.from(categoryMap.entries())
			.map(([name, amount]) => ({
				name,
				amount,
				percentage: total > 0 ? (amount / total) * 100 : 0
			}))
			.sort((a, b) => b.amount - a.amount);

		return {
			total,
			monthly,
			categories
		};
	});

	// 지출 데이터 로드
	$effect(() => {
		(async () => {
			try {
				loading = true;
				const response = await fetch('/api/expenses?limit=1000');
				const data = await response.json();
				if (data.ok) {
					expenses = data.data || [];
				}
			} catch (error) {
				console.error('Failed to load expenses:', error);
			} finally {
				loading = false;
			}
		})();
		return () => {};
	});
</script>

<svelte:head>
	<title>지출 관리</title>
</svelte:head>

<PageContent>
	<PageHeader 
		title="지출 관리" 
		description="음악 제작 지출을 분석하고 관리하세요."
		action={{
			label: '지출 추가',
			href: '/expenses/new',
			icon: Plus
		}}
	/>

	{#if loading}
		<div class="flex items-center justify-center py-12">
			<p class="text-text-muted">로딩 중...</p>
		</div>
	{:else}
		<!-- 지출 요약 -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
			<div class="card-base bg-surface-1 rounded-lg p-6 border border-border-subtle">
				<div class="flex items-center gap-3 mb-2">
					<DollarSign size={20} class="text-brand-pink" />
					<span class="text-sm font-medium text-text-muted">총 지출</span>
				</div>
				<div class="text-2xl font-bold text-text-strong" data-type="number">₩{expenseStats.total.toLocaleString()}</div>
			</div>

			<div class="card-base bg-surface-1 rounded-lg p-6 border border-border-subtle">
				<div class="flex items-center gap-3 mb-2">
					<TrendingDown size={20} class="text-red-500" />
					<span class="text-sm font-medium text-text-muted">이번 달</span>
				</div>
				<div class="text-2xl font-bold text-text-strong" data-type="number">₩{expenseStats.monthly.toLocaleString()}</div>
			</div>
		</div>

		<!-- 카테고리별 지출 -->
		<div class="card-base bg-surface-1 rounded-lg p-6 border border-border-subtle">
			<h3 class="text-lg font-semibold text-text-strong mb-6">카테고리별 지출</h3>
			{#if expenseStats.categories.length === 0}
				<p class="text-text-muted text-center py-8">지출 데이터가 없습니다.</p>
			{:else}
				<div class="space-y-4">
					{#each expenseStats.categories as category}
						<div>
							<div class="flex items-center justify-between mb-2">
								<span class="text-sm font-medium text-text-strong">{category.name}</span>
								<span class="text-sm text-text-muted" data-type="number">₩{category.amount.toLocaleString()}</span>
							</div>
							<div class="w-full bg-surface-2 rounded-full h-2">
								<div 
									class="bg-brand-pink h-2 rounded-full transition-all duration-300" 
									style="width: {category.percentage}%"
								></div>
							</div>
							<div class="text-xs text-text-muted mt-1" data-type="number">{category.percentage.toFixed(1)}%</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</PageContent>
