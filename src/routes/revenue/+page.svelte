<script lang="ts">
	import { goto } from '$app/navigation';
	import { DollarSign, TrendingUp, TrendingDown, BarChart3, Plus, Edit, Trash2 } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';
	import MoreMenuDropdown from '$lib/components/MoreMenuDropdown.svelte';
	import { toast } from '$lib/stores/toast';

	// 수익 데이터
	let revenues = $state<any[]>([]);
	let loading = $state(true);
	let moreMenuOpenId = $state<string | null>(null);

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

	// 더보기 메뉴 토글
	function handleMoreMenuToggle(id: string) {
		moreMenuOpenId = moreMenuOpenId === id ? null : id;
	}

	function handleMoreMenuClose() {
		moreMenuOpenId = null;
	}

	// 수익 수정
	function handleEdit(id: string) {
		goto(`/revenue/${id}/edit`);
	}

	// 수익 삭제 (API는 나중에 구현)
	async function handleDelete(id: string) {
		if (!confirm('이 수익 항목을 삭제하시겠습니까?')) {
			return;
		}

		try {
			// TODO: API DELETE 구현 후 활성화
			// const response = await fetch(`/api/revenue`, {
			// 	method: 'DELETE',
			// 	headers: { 'Content-Type': 'application/json' },
			// 	body: JSON.stringify({ id })
			// });
			// const result = await response.json();
			// if (!response.ok || !result.ok) {
			// 	throw new Error(result.error?.message || '수익 삭제에 실패했습니다.');
			// }

			// 임시: 목록에서 제거
			revenues = revenues.filter(r => r.id !== id);
			toast.add('수익 항목이 삭제되었습니다.', 'success', 3000);
		} catch (error) {
			console.error('수익 삭제 오류:', error);
			const errorMessage = error instanceof Error 
				? error.message 
				: '수익 삭제 중 오류가 발생했습니다.';
			toast.add(errorMessage, 'error', 5000);
		}
	}

	// 날짜 포맷팅
	function formatDate(dateString: string): string {
		if (!dateString) return '-';
		const date = new Date(dateString);
		return date.toLocaleDateString('ko-KR', { 
			year: 'numeric', 
			month: '2-digit', 
			day: '2-digit' 
		});
	}
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
		<div class="card-base bg-surface-1 rounded-lg p-6 border border-border-subtle mb-8">
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

		<!-- 수익 목록 -->
		<div class="card-base bg-surface-1 rounded-lg border border-border-subtle overflow-hidden">
			<div class="p-6 border-b border-border-subtle">
				<h3 class="text-lg font-semibold text-text-strong">수익 목록</h3>
			</div>
			{#if revenues.length === 0}
				<div class="p-12 text-center">
					<p class="text-text-muted">수익 데이터가 없습니다.</p>
				</div>
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead>
							<tr class="border-b border-border-subtle">
								<th class="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">플랫폼</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">금액</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">날짜</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">설명</th>
								<th class="px-6 py-3 text-right text-xs font-medium text-text-muted uppercase tracking-wider">작업</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-border-subtle">
							{#each revenues as revenue}
								<tr class="hover:bg-surface-2 transition-colors duration-150">
									<td class="px-6 py-4 whitespace-nowrap">
										<span class="text-sm font-medium text-text-strong">{revenue.platform || '-'}</span>
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<span class="text-sm text-text-base" data-type="number">₩{(revenue.amount || 0).toLocaleString()}</span>
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<span class="text-sm text-text-base">{formatDate(revenue.date)}</span>
									</td>
									<td class="px-6 py-4">
										<span class="text-sm text-text-base">{revenue.description || '-'}</span>
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-right">
										<MoreMenuDropdown
											itemId={revenue.id}
											openId={moreMenuOpenId}
											items={[
												{
													label: '수정',
													icon: Edit,
													onClick: () => handleEdit(revenue.id),
													ariaLabel: '수익 수정'
												},
												{
													label: '삭제',
													icon: Trash2,
													onClick: () => handleDelete(revenue.id),
													ariaLabel: '수익 삭제',
													danger: true,
													separator: true
												}
											]}
											onToggle={handleMoreMenuToggle}
											onClose={handleMoreMenuClose}
										/>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>
	{/if}
</PageContent>
