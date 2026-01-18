<script lang="ts">
	import { CreditCard, Calendar, Zap, TrendingUp, AlertCircle, Check, Edit2 } from 'lucide-svelte';
	import SUNOTabs from '$lib/components/suno/SUNOTabs.svelte';
	import type { SUNOSubscription, SubscriptionPlan } from '$lib/types/suno';

	// 목업 데이터
	let subscription = $state<SUNOSubscription>({
		planType: 'Pro',
		billingDate: 15,
		monthlyCredits: 500,
		remainingCredits: 320,
		lastUpdated: '2026-01-13'
	});

	// 수정 모드
	let isEditing = $state(false);
	let editData = $state({
		planType: subscription.planType,
		billingDate: subscription.billingDate,
		monthlyCredits: subscription.monthlyCredits,
		remainingCredits: subscription.remainingCredits
	});

	// 플랜 정보
	const plans: Record<SubscriptionPlan, { name: string; credits: number; price: string; features: string[] }> = {
		Basic: {
			name: 'Basic',
			credits: 200,
			price: '$10/월',
			features: ['월 200 크레딧', '기본 기능', '표준 품질']
		},
		Pro: {
			name: 'Pro',
			credits: 500,
			price: '$30/월',
			features: ['월 500 크레딧', '고급 기능', '고품질 출력', '우선 처리']
		},
		Premier: {
			name: 'Premier',
			credits: 2000,
			price: '$100/월',
			features: ['월 2000 크레딧', '모든 기능', '최고 품질', '최우선 처리', '전용 지원']
		}
	};

	// 사용률 계산
	const usagePercent = $derived(
		Math.round(((subscription.monthlyCredits - subscription.remainingCredits) / subscription.monthlyCredits) * 100)
	);

	// 다음 결제일까지 남은 일수
	const daysUntilBilling = $derived.by(() => {
		const today = new Date();
		const currentDay = today.getDate();
		if (currentDay < subscription.billingDate) {
			return subscription.billingDate - currentDay;
		}
		const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, subscription.billingDate);
		return Math.ceil((nextMonth.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
	});

	// 저장
	function saveChanges() {
		subscription = {
			...subscription,
			planType: editData.planType,
			billingDate: editData.billingDate,
			monthlyCredits: editData.monthlyCredits,
			remainingCredits: editData.remainingCredits,
			lastUpdated: new Date().toISOString().split('T')[0]
		};
		isEditing = false;
	}

	// 편집 시작
	function startEditing() {
		editData = {
			planType: subscription.planType,
			billingDate: subscription.billingDate,
			monthlyCredits: subscription.monthlyCredits,
			remainingCredits: subscription.remainingCredits
		};
		isEditing = true;
	}

	// 크레딧 상태 색상
	function getCreditStatusColor(): string {
		if (usagePercent >= 90) return 'text-red-500';
		if (usagePercent >= 70) return 'text-yellow-500';
		return 'text-green-500';
	}

	function getCreditBarColor(): string {
		if (usagePercent >= 90) return 'bg-red-500';
		if (usagePercent >= 70) return 'bg-yellow-500';
		return 'bg-green-500';
	}
</script>

<svelte:head>
	<title>구독 관리 | SUNO 제작</title>
</svelte:head>

<div class="pt-0 pb-6 sm:pb-6 pb-20 bg-bg text-text-base">
	<!-- 헤더 -->
	<div class="mb-8 mt-1.5">
		<div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
			<div>
				<h1 class="text-3xl font-bold text-text-strong mb-2">SUNO 제작</h1>
				<p class="text-text-muted">SUNO AI 구독 정보와 크레딧 사용량을 관리합니다</p>
			</div>
			<button
				type="button"
				onclick={() => isEditing ? isEditing = false : startEditing()}
				class="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors flex-shrink-0 {isEditing ? 'bg-surface-2 border-border-subtle text-text-base' : 'border-border-subtle text-text-base hover:border-brand-pink'}"
			>
				<Edit2 size={16} />
				{isEditing ? '취소' : '수정'}
			</button>
		</div>
	</div>

	<!-- 탭 + 콘텐츠 -->
	<SUNOTabs>
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<!-- 현재 플랜 -->
			<div class="lg:col-span-2 bg-surface-2 rounded-lg border border-border-subtle">
				<div class="px-6 py-4 border-b border-border-subtle">
					<h3 class="text-lg font-semibold text-text-strong">현재 구독</h3>
				</div>
				<div class="p-6">
					{#if isEditing}
						<!-- 수정 모드 -->
						<div class="space-y-4">
							<div>
								<label class="block text-sm font-medium text-text-strong mb-2">플랜</label>
								<select bind:value={editData.planType} class="w-full h-10 px-4 bg-bg border border-border-subtle rounded-lg text-text-base focus:outline-none focus:border-brand-pink">
									<option value="Basic">Basic ($10/월)</option>
									<option value="Pro">Pro ($30/월)</option>
									<option value="Premier">Premier ($100/월)</option>
								</select>
							</div>
							<div class="grid grid-cols-2 gap-4">
								<div>
									<label class="block text-sm font-medium text-text-strong mb-2">결제일</label>
									<input
										type="number"
										min="1"
										max="31"
										bind:value={editData.billingDate}
										class="w-full h-10 px-4 bg-bg border border-border-subtle rounded-lg text-text-base focus:outline-none focus:border-brand-pink"
									/>
								</div>
								<div>
									<label class="block text-sm font-medium text-text-strong mb-2">남은 크레딧</label>
									<input
										type="number"
										min="0"
										bind:value={editData.remainingCredits}
										class="w-full h-10 px-4 bg-bg border border-border-subtle rounded-lg text-text-base focus:outline-none focus:border-brand-pink"
									/>
								</div>
							</div>
							<div class="flex justify-end gap-3 pt-4">
								<button
									type="button"
									onclick={() => isEditing = false}
									class="cancel-button px-6 py-2 bg-bg text-text-base rounded-lg border border-border-subtle transition-colors font-medium"
								>
									취소
								</button>
								<button
									type="button"
									onclick={saveChanges}
									class="px-6 py-2 bg-brand-pink text-white rounded-lg transition-colors font-medium"
								>
									저장
								</button>
							</div>
						</div>
					{:else}
						<!-- 보기 모드 -->
						<div class="flex items-center gap-6 mb-6">
							<div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-pink to-purple-600 flex items-center justify-center">
								<Zap size={36} class="text-white" />
							</div>
							<div>
								<div class="flex items-center gap-3">
									<h4 class="text-2xl font-bold text-text-strong">{subscription.planType}</h4>
									<span class="px-3 py-1 rounded-full bg-brand-pink/20 text-brand-pink text-sm font-medium">활성</span>
								</div>
								<p class="text-text-muted mt-1">{plans[subscription.planType].price}</p>
							</div>
						</div>

						<!-- 크레딧 현황 -->
						<div class="mb-6">
							<div class="flex items-center justify-between mb-2">
								<span class="text-sm font-medium text-text-strong">크레딧 사용량</span>
								<span class="text-sm {getCreditStatusColor()}">{usagePercent}% 사용</span>
							</div>
							<div class="h-3 bg-bg rounded-full overflow-hidden">
								<div 
									class="h-full transition-all duration-300 {getCreditBarColor()}"
									style="width: {usagePercent}%"
								></div>
							</div>
							<div class="flex items-center justify-between mt-2 text-sm text-text-muted">
								<span>사용: {subscription.monthlyCredits - subscription.remainingCredits}</span>
								<span>남음: {subscription.remainingCredits} / {subscription.monthlyCredits}</span>
							</div>
						</div>

						<!-- 정보 그리드 -->
						<div class="grid grid-cols-2 gap-4">
							<div class="bg-bg rounded-lg p-4">
								<div class="flex items-center gap-2 text-text-muted mb-1">
									<Calendar size={16} />
									<span class="text-sm">다음 결제일</span>
								</div>
								<p class="text-lg font-semibold text-text-strong">매월 {subscription.billingDate}일</p>
								<p class="text-sm text-brand-pink mt-1">{daysUntilBilling}일 후</p>
							</div>
							<div class="bg-bg rounded-lg p-4">
								<div class="flex items-center gap-2 text-text-muted mb-1">
									<TrendingUp size={16} />
									<span class="text-sm">일 평균 사용</span>
								</div>
								<p class="text-lg font-semibold text-text-strong">
									{Math.round((subscription.monthlyCredits - subscription.remainingCredits) / (30 - daysUntilBilling) || 0)} 크레딧
								</p>
								<p class="text-sm text-text-muted mt-1">예상 소진: {daysUntilBilling}일 전</p>
							</div>
						</div>
					{/if}
				</div>
			</div>

			<!-- 플랜 기능 -->
			<div class="bg-surface-2 rounded-lg border border-border-subtle">
				<div class="px-6 py-4 border-b border-border-subtle">
					<h3 class="text-lg font-semibold text-text-strong">{subscription.planType} 플랜 기능</h3>
				</div>
				<div class="p-6">
					<ul class="space-y-3">
						{#each plans[subscription.planType].features as feature}
							<li class="flex items-center gap-3">
								<div class="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
									<Check size={12} class="text-green-500" />
								</div>
								<span class="text-sm text-text-base">{feature}</span>
							</li>
						{/each}
					</ul>

					{#if usagePercent >= 80}
						<div class="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
							<div class="flex items-start gap-3">
								<AlertCircle size={20} class="text-yellow-500 flex-shrink-0 mt-0.5" />
								<div>
									<p class="text-sm font-medium text-yellow-500">크레딧 부족 경고</p>
									<p class="text-sm text-text-muted mt-1">
										크레딧이 {100 - usagePercent}% 남았습니다. 상위 플랜으로 업그레이드를 고려해보세요.
									</p>
								</div>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- 플랜 비교 -->
		<div class="mt-8">
			<h3 class="text-lg font-semibold text-text-strong mb-4">플랜 비교</h3>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				{#each Object.entries(plans) as [planId, plan]}
					<div class="bg-surface-2 rounded-lg border {subscription.planType === planId ? 'border-brand-pink' : 'border-border-subtle'} p-5">
						<div class="flex items-center justify-between mb-4">
							<h4 class="text-lg font-semibold text-text-strong">{plan.name}</h4>
							{#if subscription.planType === planId}
								<span class="px-2 py-0.5 rounded bg-brand-pink text-white text-xs">현재</span>
							{/if}
						</div>
						<p class="text-2xl font-bold text-text-strong mb-4">{plan.price}</p>
						<ul class="space-y-2">
							{#each plan.features as feature}
								<li class="flex items-center gap-2 text-sm text-text-muted">
									<Check size={14} class="text-green-500" />
									{feature}
								</li>
							{/each}
						</ul>
						{#if subscription.planType !== planId}
							<button
								type="button"
								class="w-full mt-4 py-2 border border-border-subtle rounded-lg text-sm text-text-base hover:border-brand-pink hover:text-brand-pink transition-colors"
							>
								{plans[subscription.planType].credits < plan.credits ? '업그레이드' : '다운그레이드'}
							</button>
						{/if}
					</div>
				{/each}
			</div>
		</div>

		<!-- 마지막 업데이트 -->
		<div class="mt-6 text-sm text-text-muted text-right">
			마지막 업데이트: {subscription.lastUpdated}
		</div>
	</SUNOTabs>
</div>
