<script lang="ts">
	import { goto } from '$app/navigation';
	import { DollarSign, TrendingDown, BarChart3, Plus, Edit, Trash2 } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';
	import MoreMenuDropdown from '$lib/components/MoreMenuDropdown.svelte';
	import { toast } from '$lib/stores/toast';

	// 지출 데이터
	let expenses = $state<any[]>([]);
	let loading = $state(true);
	let moreMenuOpenId = $state<string | null>(null);

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
				const data = (await response.json()) as { ok?: boolean; data?: unknown[] };
				if (data.ok && Array.isArray(data.data)) {
					expenses = data.data;
				}
			} catch (error) {
				console.error('Failed to load expenses:', error);
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

	// 지출 수정
	function handleEdit(id: string) {
		goto(`/expenses/${id}/edit`);
	}

	// 지출 삭제 (API는 나중에 구현)
	async function handleDelete(id: string) {
		if (!confirm('이 지출 항목을 삭제하시겠습니까?')) {
			return;
		}

		try {
			// TODO: API DELETE 구현 후 활성화
			// const response = await fetch(`/api/expenses`, {
			// 	method: 'DELETE',
			// 	headers: { 'Content-Type': 'application/json' },
			// 	body: JSON.stringify({ id })
			// });
			// const result = await response.json();
			// if (!response.ok || !result.ok) {
			// 	throw new Error(result.error?.message || '지출 삭제에 실패했습니다.');
			// }

			// 임시: 목록에서 제거
			expenses = expenses.filter(e => e.id !== id);
			toast.add('지출 항목이 삭제되었습니다.', 'success', 3000);
		} catch (error) {
			console.error('지출 삭제 오류:', error);
			const errorMessage = error instanceof Error 
				? error.message 
				: '지출 삭제 중 오류가 발생했습니다.';
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

<svelte:head>
	<title>지출 관리</title>
</svelte:head>

<PageContent>
	<PageHeader 
		title="지출 관리" 
		description="음악 제작 지출을 분석하고 관리하세요."
		actions={[{
			label: '지출 추가',
			href: '/expenses/new',
			icon: Plus
		}]}
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
		<div class="card-base bg-surface-1 rounded-lg p-6 border border-border-subtle mb-8">
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

		<!-- 지출 목록 -->
		<div class="card-base bg-surface-1 rounded-lg border border-border-subtle overflow-hidden">
			<div class="p-6 border-b border-border-subtle">
				<h3 class="text-lg font-semibold text-text-strong">지출 목록</h3>
			</div>
			{#if expenses.length === 0}
				<div class="p-12 text-center">
					<p class="text-text-muted">지출 데이터가 없습니다.</p>
				</div>
			{:else}
				<!-- 모바일/좁은 뷰: 카드 -->
				<div class="md:hidden divide-y divide-border-subtle">
					{#each expenses as expense}
						<div class="p-4 hover:bg-surface-2 transition-colors">
							<div class="flex items-start justify-between gap-3">
								<div class="min-w-0 flex-1">
									<p class="text-sm font-medium text-text-strong">{expense.category || '-'}</p>
									<p class="text-sm text-text-base mt-0.5" data-type="number">₩{(expense.amount || 0).toLocaleString()}</p>
									<p class="text-xs text-text-muted mt-1">{formatDate(expense.date)}</p>
									{#if expense.description}
										<p class="text-sm text-text-muted mt-1 break-words">{expense.description}</p>
									{/if}
								</div>
								<div class="flex-shrink-0">
									<MoreMenuDropdown
										itemId={expense.id}
										openId={moreMenuOpenId}
										items={[
											{ label: '수정', icon: Edit, onClick: () => handleEdit(expense.id), ariaLabel: '지출 수정' },
											{ label: '삭제', icon: Trash2, onClick: () => handleDelete(expense.id), ariaLabel: '지출 삭제', danger: true, separator: true }
										]}
										onToggle={handleMoreMenuToggle}
										onClose={handleMoreMenuClose}
									/>
								</div>
							</div>
						</div>
					{/each}
				</div>
				<!-- 데스크톱: 테이블 (가로 스크롤 없음) -->
				<div class="hidden md:block overflow-hidden">
					<table class="w-full">
						<thead>
							<tr class="border-b border-border-subtle">
								<th class="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">카테고리</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">금액</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">날짜</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">설명</th>
								<th class="px-6 py-3 text-right text-xs font-medium text-text-muted uppercase tracking-wider">작업</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-border-subtle">
							{#each expenses as expense}
								<tr class="hover:bg-surface-2 transition-colors duration-150">
									<td class="px-6 py-4 whitespace-nowrap">
										<span class="text-sm font-medium text-text-strong">{expense.category || '-'}</span>
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<span class="text-sm text-text-base" data-type="number">₩{(expense.amount || 0).toLocaleString()}</span>
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<span class="text-sm text-text-base">{formatDate(expense.date)}</span>
									</td>
									<td class="px-6 py-4">
										<span class="text-sm text-text-base">{expense.description || '-'}</span>
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-right">
										<MoreMenuDropdown
											itemId={expense.id}
											openId={moreMenuOpenId}
											items={[
												{
													label: '수정',
													icon: Edit,
													onClick: () => handleEdit(expense.id),
													ariaLabel: '지출 수정'
												},
												{
													label: '삭제',
													icon: Trash2,
													onClick: () => handleDelete(expense.id),
													ariaLabel: '지출 삭제',
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
