<script lang="ts">
	import { goto } from '$app/navigation';
	import { DollarSign, TrendingUp, TrendingDown, BarChart3, Plus } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';

	// 수익 데이터
	let revenues = $state<any[]>([]);
	let loading = $state(true);

	// 수익 통계 계산
	const revenueStats = $derived.by(() => {
		const total = revenues.reduce((sum, r) => sum + (r.amount || 0), 0);
		
		// 이번 달 수익 계산
		const now = new Date();
		const currentMonth = now.getMonth();
		const currentYear = now.getFullYear();
		const monthly = revenues
			.filter(r => {
				if (!r.date) return false;
				const date = new Date(r.date);
				return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
			})
			.reduce((sum, r) => sum + (r.amount || 0), 0);

		// 플랫폼별 수익 집계
		const platformMap = new Map<string, number>();
		revenues.forEach(r => {
			const platform = r.platform || '기타';
			const current = platformMap.get(platform) || 0;
			platformMap.set(platform, current + (r.amount || 0));
		});

		const platforms = Array.from(platformMap.entries())
			.map(([name, amount]) => ({
				name,
				amount,
				percentage: total > 0 ? (amount / total) * 100 : 0
			}))
			.sort((a, b) => b.amount - a.amount);

		// 성장률 계산 (간단한 예시, 실제로는 이전 달과 비교 필요)
		const growth = 12.5; // TODO: 실제 성장률 계산

		return {
			total,
			monthly,
			growth,
			platforms
		};
	});

	// 수익 데이터 로드
	$effect(() => {
		(async () => {
			try {
				loading = true;
				const response = await fetch('/api/revenue?limit=1000');
				const data = await response.json();
				if (data.ok) {
					revenues = data.data || [];
				}
			} catch (error) {
				console.error('Failed to load revenues:', error);
			} finally {
				loading = false;
			}
		})();
		return () => {};
	});
</script>

<PageContent>
	<PageHeader 
		title="수익 관리" 
		description="음악 수익을 분석하고 관리하세요."
		action={{
			label: '수익 추가',
			href: '/revenue/new',
			icon: Plus
		}}
	/>

	{#if loading}
		<div class="flex items-center justify-center py-12">
			<p class="text-text-muted">로딩 중...</p>
		</div>
	{:else}
		<!-- 수익 요약 -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
			<div class="card-base bg-surface-1 rounded-lg p-6 border border-border-subtle">
				<div class="flex items-center gap-3 mb-2">
					<DollarSign size={20} class="text-brand-pink" />
					<span class="text-sm font-medium text-text-muted">총 수익</span>
				</div>
				<div class="text-2xl font-bold text-text-strong" data-type="number">₩{revenueStats.total.toLocaleString()}</div>
			</div>

			<div class="card-base bg-surface-1 rounded-lg p-6 border border-border-subtle">
				<div class="flex items-center gap-3 mb-2">
					<TrendingUp size={20} class="text-green-500" />
					<span class="text-sm font-medium text-text-muted">이번 달</span>
				</div>
				<div class="text-2xl font-bold text-text-strong" data-type="number">₩{revenueStats.monthly.toLocaleString()}</div>
			</div>

			<div class="card-base bg-surface-1 rounded-lg p-6 border border-border-subtle">
				<div class="flex items-center gap-3 mb-2">
					<BarChart3 size={20} class="text-hover-point" />
					<span class="text-sm font-medium text-text-muted">성장률</span>
				</div>
				<div class="text-2xl font-bold text-text-strong" data-type="number">+{revenueStats.growth.toFixed(1)}%</div>
			</div>
		</div>

		<!-- 플랫폼별 수익 -->
		<div class="card-base bg-surface-1 rounded-lg p-6 border border-border-subtle">
			<h3 class="text-lg font-semibold text-text-strong mb-6">플랫폼별 수익</h3>
			{#if revenueStats.platforms.length === 0}
				<p class="text-text-muted text-center py-8">수익 데이터가 없습니다.</p>
			{:else}
				<div class="space-y-4">
					{#each revenueStats.platforms as platform}
						<div>
							<div class="flex items-center justify-between mb-2">
								<span class="text-sm font-medium text-text-strong">{platform.name}</span>
								<span class="text-sm text-text-muted" data-type="number">₩{platform.amount.toLocaleString()}</span>
							</div>
							<div class="w-full bg-surface-2 rounded-full h-2">
								<div 
									class="bg-brand-pink h-2 rounded-full transition-all duration-300" 
									style="width: {platform.percentage}%"
								></div>
							</div>
							<div class="text-xs text-text-muted mt-1" data-type="number">{platform.percentage.toFixed(1)}%</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</PageContent>
