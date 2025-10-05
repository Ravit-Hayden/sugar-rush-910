<script lang="ts">
	import { DollarSign, TrendingUp, TrendingDown, BarChart3 } from 'lucide-svelte';

	let revenue = {
		total: 125000,
		monthly: 15000,
		growth: 12.5,
		platforms: [
			{ name: 'Spotify', amount: 45000, percentage: 36 },
			{ name: 'Apple Music', amount: 32000, percentage: 25.6 },
			{ name: 'YouTube Music', amount: 28000, percentage: 22.4 },
			{ name: '기타', amount: 20000, percentage: 16 }
		]
	};
</script>

<div class="pt-0 pb-6">
	<div class="max-w-7xl mx-auto">
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-text-strong mb-2">수익 관리</h1>
			<p class="text-text-muted">음악 수익을 분석하고 관리하세요.</p>
		</div>

		<!-- 수익 요약 -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
			<div class="bg-surface-2 rounded-lg p-6">
				<div class="flex items-center gap-3 mb-2">
					<DollarSign size={20} class="text-brand-pink" />
					<span class="text-sm font-medium text-text-muted">총 수익</span>
				</div>
				<div class="text-2xl font-bold text-text-strong">₩{revenue.total.toLocaleString()}</div>
			</div>

			<div class="bg-surface-2 rounded-lg p-6">
				<div class="flex items-center gap-3 mb-2">
					<TrendingUp size={20} class="text-green-500" />
					<span class="text-sm font-medium text-text-muted">이번 달</span>
				</div>
				<div class="text-2xl font-bold text-text-strong">₩{revenue.monthly.toLocaleString()}</div>
			</div>

			<div class="bg-surface-2 rounded-lg p-6">
				<div class="flex items-center gap-3 mb-2">
					<BarChart3 size={20} class="text-hover-cyan" />
					<span class="text-sm font-medium text-text-muted">성장률</span>
				</div>
				<div class="text-2xl font-bold text-text-strong">+{revenue.growth}%</div>
			</div>
		</div>

		<!-- 플랫폼별 수익 -->
		<div class="bg-surface-2 rounded-lg p-6">
			<h3 class="text-lg font-semibold text-text-strong mb-6">플랫폼별 수익</h3>
			<div class="space-y-4">
				{#each revenue.platforms as platform}
					<div>
						<div class="flex items-center justify-between mb-2">
							<span class="text-sm font-medium text-text-strong">{platform.name}</span>
							<span class="text-sm text-text-muted">₩{platform.amount.toLocaleString()}</span>
						</div>
						<div class="w-full bg-surface-1 rounded-full h-2">
							<div 
								class="bg-brand-pink h-2 rounded-full transition-all duration-300" 
								style="width: {platform.percentage}%"
							></div>
						</div>
						<div class="text-xs text-text-muted mt-1">{platform.percentage}%</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
