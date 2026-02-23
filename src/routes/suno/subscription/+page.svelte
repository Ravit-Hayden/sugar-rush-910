<script lang="ts">
	import { replaceState } from '$app/navigation';
	import { onMount, tick } from 'svelte';
	import {
		Calendar,
		Zap,
		TrendingUp,
		AlertCircle,
		Check,
		Edit2,
		ChevronDown,
		ChevronUp,
		Circle,
		Crown,
		Lock,
		Pause,
		XCircle
	} from 'lucide-svelte';
	import SUNOTabs from '$lib/components/suno/SUNOTabs.svelte';
	import type { Producer, SUNOSubscription, SubscriptionPlan, SubscriptionStatus } from '$lib/types/suno';
	import type { ApiErr, ApiOk } from '$lib/types/api';

	const DEFAULT_SUBSCRIPTION: SUNOSubscription = {
		planType: 'Premier',
		status: 'active',
		billingDate: 15,
		monthlyCredits: 10000,
		remainingCredits: 6000,
		updatedBy: 'El',
		lastUpdated: '2026-01-13'
	};

	let subscription = $state<SUNOSubscription>({ ...DEFAULT_SUBSCRIPTION });

	// 수정 모드
	let isEditing = $state(false);
	let editData = $state({
		planType: 'Premier' as SubscriptionPlan,
		status: 'active' as SubscriptionStatus,
		billingDate: 15,
		remainingCredits: 6000
	});
	let isLoading = $state(true);
	let isSaving = $state(false);
	let isHistoryLoading = $state(false);
	let showPlanComparison = $state(false);
	let openComparisonSections = $state<Set<number>>(new Set());
	let compareBillingCycle = $state<'monthly' | 'yearly'>('monthly');
	let errorMessage = $state('');
	let successMessage = $state('');
	let historyErrorMessage = $state('');
	let updatedBy = $state<Producer>('El');
	let editInitialUpdatedBy = $state<Producer>('El');
	let historyFilterBy = $state<'all' | Producer>('all');
	let historyRangeDays = $state<0 | 7 | 30 | 90>(30);
	let historySort = $state<'desc' | 'asc'>('desc');
	let historyFilterDropdownOpen = $state(false);
	let historyRangeDropdownOpen = $state(false);
	let historySortDropdownOpen = $state(false);
	let editPlanDropdownOpen = $state(false);
	let editStatusDropdownOpen = $state(false);
	let editUpdatedByDropdownOpen = $state(false);
	let historyFiltersInitialized = $state(false);
	let historyFilterActiveIndex = $state(0);
	let historyRangeActiveIndex = $state(0);
	let historySortActiveIndex = $state(0);
	let editPlanActiveIndex = $state(0);
	let editStatusActiveIndex = $state(0);
	let editUpdatedByActiveIndex = $state(0);
	let historyFilterButtonEl = $state<HTMLButtonElement | null>(null);
	let historyRangeButtonEl = $state<HTMLButtonElement | null>(null);
	let historySortButtonEl = $state<HTMLButtonElement | null>(null);
	let editPlanButtonEl = $state<HTMLButtonElement | null>(null);
	let editStatusButtonEl = $state<HTMLButtonElement | null>(null);
	let editUpdatedByButtonEl = $state<HTMLButtonElement | null>(null);
	let historyFilterListEl = $state<HTMLUListElement | null>(null);
	let historyRangeListEl = $state<HTMLUListElement | null>(null);
	let historySortListEl = $state<HTMLUListElement | null>(null);
	let editPlanListEl = $state<HTMLUListElement | null>(null);
	let editStatusListEl = $state<HTMLUListElement | null>(null);
	let editUpdatedByListEl = $state<HTMLUListElement | null>(null);
	let historyItems = $state<
		Array<{
			id: string;
			updatedBy: string;
			updatedAt: string;
			before: SUNOSubscription | null;
			after: SUNOSubscription;
		}>
	>([]);
	type SubscriptionHistoryItem = (typeof historyItems)[number];
	type SubscriptionHistoryResponse = {
		items: SubscriptionHistoryItem[];
		total: number;
		offset: number;
		limit: number;
		hasMore: boolean;
	};
	const historyPageSize = 10;
	let historyOffset = $state(0);
	let historyTotal = $state(0);
	let historyHasMore = $state(false);
	let historyAbortController: AbortController | null = null;
	let historyRequestId = 0;
	let lastHistoryFilterKey = $state('');
	const historyCount = $derived(historyItems.length);
	const latestHistory = $derived(historyItems[0] ?? null);
	const changedByElCount = $derived(historyItems.filter((item) => item.updatedBy === 'El').length);
	const changedByOtteCount = $derived(historyItems.filter((item) => item.updatedBy === 'Otte').length);

	function formatCount(value: number): string {
		return value.toLocaleString('ko-KR');
	}
	function getAuthorTextClass(name: string): string {
		if (name === 'El') return 'text-elotte-green';
		if (name === 'Otte') return 'text-elotte-orange';
		return 'text-text-strong';
	}
	const HISTORY_SECTION_ID = 'subscription-history-section';
	const HISTORY_FILTER_LISTBOX_ID = 'subscription-history-filter-listbox';
	const HISTORY_RANGE_LISTBOX_ID = 'subscription-history-range-listbox';
	const HISTORY_SORT_LISTBOX_ID = 'subscription-history-sort-listbox';
	const EDIT_PLAN_LISTBOX_ID = 'subscription-edit-plan-listbox';
	const EDIT_UPDATED_BY_LISTBOX_ID = 'subscription-edit-updated-by-listbox';
	const STATUS_BANNER_BASE_CLASS = 'mb-4 rounded-lg border px-4 py-3 text-sm';
	const HISTORY_FILTER_LABELS: Record<'all' | Producer, string> = {
		all: '전체 담당자',
		El: 'El',
		Otte: 'Otte'
	};
	const HISTORY_RANGE_OPTIONS: Array<{ value: 0 | 7 | 30 | 90; label: string }> = [
		{ value: 7, label: '최근 7일' },
		{ value: 30, label: '최근 30일' },
		{ value: 90, label: '최근 90일' },
		{ value: 0, label: '전체 기간' }
	];
	const HISTORY_SORT_LABELS: Record<'desc' | 'asc', string> = {
		desc: '최신순',
		asc: '오래된순'
	};
	const HISTORY_FILTER_VALUES = Object.keys(HISTORY_FILTER_LABELS) as Array<'all' | Producer>;
	const HISTORY_SORT_VALUES = Object.keys(HISTORY_SORT_LABELS) as Array<'desc' | 'asc'>;
	const EDIT_PLAN_VALUES: SubscriptionPlan[] = ['Basic', 'Pro', 'Premier'];
	const EDIT_STATUS_VALUES: SubscriptionStatus[] = ['active', 'paused', 'cancelled'];
	const EDIT_STATUS_LABELS: Record<SubscriptionStatus, string> = {
		active: '활성',
		paused: '일시정지',
		cancelled: '해지'
	};
	const EDIT_UPDATED_BY_VALUES: Producer[] = ['El', 'Otte'];

	async function loadHistory(reset: boolean = true) {
		historyAbortController?.abort();
		const requestId = ++historyRequestId;
		const controller = new AbortController();
		historyAbortController = controller;
		historyErrorMessage = '';
		isHistoryLoading = true;
		try {
			const nextOffset = reset ? 0 : historyOffset;
			const params = new URLSearchParams({
				limit: String(historyPageSize),
				offset: String(nextOffset),
				sort: historySort
			});
			if (historyFilterBy !== 'all') params.set('updatedBy', historyFilterBy);
			if (historyRangeDays > 0) params.set('days', String(historyRangeDays));
			const historyResponse = await fetch(`/api/suno/subscription/history?${params.toString()}`, {
				cache: 'no-store',
				signal: controller.signal
			});
			if (!historyResponse.ok) return;
			const historyResult = (await historyResponse.json()) as ApiOk<SubscriptionHistoryResponse> | ApiErr;
			if (historyResult.ok && requestId === historyRequestId) {
				if (reset) {
					historyItems = historyResult.data.items;
				} else {
					const merged = [...historyItems, ...historyResult.data.items];
					historyItems = merged.filter((item, index, arr) => arr.findIndex((x) => x.id === item.id) === index);
				}
				historyOffset = historyResult.data.offset + historyResult.data.items.length;
				historyTotal = historyResult.data.total;
				historyHasMore = historyResult.data.hasMore;
			}
		} catch (error) {
			if (error instanceof DOMException && error.name === 'AbortError') return;
			historyErrorMessage = '변경 이력을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.';
		} finally {
			if (requestId === historyRequestId) {
				isHistoryLoading = false;
			}
		}
	}

	// 플랜 정보
	type PlanDetails = {
		name: string;
		credits: number;
		price: string;
		monthlyPrice: number;
		yearlyPrice: number;
		yearlyDiscountLabel: string;
		features: string[];
		cardHighlights: string[];
	};
	const plans: Record<SubscriptionPlan, PlanDetails> = {
		Basic: {
			name: 'Free Plan',
			credits: 50,
			price: '₩0/월',
			monthlyPrice: 0,
			yearlyPrice: 0,
			yearlyDiscountLabel: '무료',
			features: [
				'10곡, 매일',
				'최고의 무료 모델(v4.5-all)',
				'공유 대기열에 4개',
				'오디오 업로드 최대 1분'
			],
			cardHighlights: ['10곡, 매일', '일 50크레딧', '최고의 무료 모델(v4.5-all)']
		},
		Pro: {
			name: 'Pro Plan',
			credits: 2500,
			price: '₩15,000/월',
			monthlyPrice: 15000,
			yearlyPrice: 12000,
			yearlyDiscountLabel: '20% 절약',
			features: [
				'매달 500곡',
				'고급 모델(v4, v4.5, v4.5+, v5)',
				'상업적 사용 가능',
				'우선순위 대기열에 10개'
			],
			cardHighlights: ['매달 500곡', '월 2,500크레딧', '고급 모델(v4, v4.5, v4.5+, v5)']
		},
		Premier: {
			name: 'Premier Plan',
			credits: 10000,
			price: '₩45,000/월',
			monthlyPrice: 45000,
			yearlyPrice: 36000,
			yearlyDiscountLabel: '20% 절약',
			features: [
				'매달 2000곡',
				'고급 모델(v4, v4.5, v4.5+, v5)',
				'수노 스튜디오 사용',
				'우선순위 대기열에 10개'
			],
			cardHighlights: ['매달 2000곡', '월 10,000크레딧', '수노 스튜디오 사용']
		}
	};
	type FeatureState = { kind: 'check' } | { kind: 'lock' } | { kind: 'text'; text: string };
	type ComparisonRow = {
		label: string;
		values: Record<SubscriptionPlan, FeatureState>;
	};
	type ComparisonSection = {
		title: string;
		rows: ComparisonRow[];
	};
	const planComparisonSections: ComparisonSection[] = [
		{
			title: '노래 생성',
			rows: [
				{
					label: '노래 수',
					values: {
						Basic: { kind: 'text', text: '매일 10곡' },
						Pro: { kind: 'text', text: '매달 500곡' },
						Premier: { kind: 'text', text: '매달 2000곡' }
					}
				},
				{
					label: '크레딧',
					values: {
						Basic: { kind: 'text', text: '일 50크레딧' },
						Pro: { kind: 'text', text: '월 2,500크레딧' },
						Premier: { kind: 'text', text: '월 10,000크레딧' }
					}
				},
				{
					label: '상업적 권리',
					values: {
						Basic: { kind: 'lock' },
						Pro: { kind: 'check' },
						Premier: { kind: 'check' }
					}
				},
				{
					label: '동시 세대',
					values: {
						Basic: { kind: 'text', text: '공유 대기열에 4개' },
						Pro: { kind: 'text', text: '우선순위 대기열에 10개' },
						Premier: { kind: 'text', text: '우선순위 대기열에 10개' }
					}
				},
				{
					label: '추가 크레딧',
					values: {
						Basic: { kind: 'text', text: '사용할 수 없음' },
						Pro: { kind: 'text', text: '구매 가능' },
						Premier: { kind: 'text', text: '구매 가능' }
					}
				}
			]
		},
		{
			title: '창조의 특징',
			rows: [
				{
					label: '수노 스튜디오',
					values: {
						Basic: { kind: 'lock' },
						Pro: { kind: 'lock' },
						Premier: { kind: 'check' }
					}
				},
				{
					label: '노래 리믹스(확장, 커버, 속도 조절)',
					values: {
						Basic: { kind: 'check' },
						Pro: { kind: 'check' },
						Premier: { kind: 'check' }
					}
				},
				{
					label: 'Suno와 공동 집필',
					values: {
						Basic: { kind: 'check' },
						Pro: { kind: 'check' },
						Premier: { kind: 'check' }
					}
				},
				{
					label: '오디오 업로드',
					values: {
						Basic: { kind: 'text', text: '최대 1분' },
						Pro: { kind: 'text', text: '최대 8분' },
						Premier: { kind: 'text', text: '최대 8분' }
					}
				},
				{
					label: '일관된 목소리(페르소나)',
					values: {
						Basic: { kind: 'lock' },
						Pro: { kind: 'check' },
						Premier: { kind: 'check' }
					}
				},
				{
					label: '보컬 추가',
					values: {
						Basic: { kind: 'lock' },
						Pro: { kind: 'check' },
						Premier: { kind: 'check' }
					}
				},
				{
					label: '악기 추가',
					values: {
						Basic: { kind: 'lock' },
						Pro: { kind: 'check' },
						Premier: { kind: 'check' }
					}
				},
				{
					label: '인스파이어(스타일 참조 생성)',
					values: {
						Basic: { kind: 'lock' },
						Pro: { kind: 'check' },
						Premier: { kind: 'check' }
					}
				},
				{
					label: '매직송 설명',
					values: {
						Basic: { kind: 'lock' },
						Pro: { kind: 'check' },
						Premier: { kind: 'check' }
					}
				}
			]
		},
		{
			title: '편집 기능',
			rows: [
				{
					label: '기본 편집(자르기/페이드)',
					values: {
						Basic: { kind: 'lock' },
						Pro: { kind: 'check' },
						Premier: { kind: 'check' }
					}
				},
				{
					label: '고급 편집(섹션 교체/추가)',
					values: {
						Basic: { kind: 'lock' },
						Pro: { kind: 'check' },
						Premier: { kind: 'check' }
					}
				},
				{
					label: '줄기 추출',
					values: {
						Basic: { kind: 'lock' },
						Pro: { kind: 'check' },
						Premier: { kind: 'check' }
					}
				}
			]
		},
		{
			title: '입장',
			rows: [
				{
					label: '새로운 기능에 대한 조기 액세스',
					values: {
						Basic: { kind: 'lock' },
						Pro: { kind: 'check' },
						Premier: { kind: 'check' }
					}
				}
			]
		}
	];
	const PLAN_COMPARISON_ORDER: SubscriptionPlan[] = ['Basic', 'Pro', 'Premier'];

	// 사용률·남은률 계산 (진행바·경고는 남은량 기준으로 직관적 표시)
	const usagePercent = $derived(
		subscription.monthlyCredits > 0
			? Math.round(
					((subscription.monthlyCredits - subscription.remainingCredits) / subscription.monthlyCredits) * 100
				)
			: 0
	);
	const safeUsagePercent = $derived(Math.max(0, Math.min(100, usagePercent)));
	const remainingPercent = $derived(Math.max(0, Math.min(100, 100 - safeUsagePercent)));

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
	const usedCredits = $derived(Math.max(0, subscription.monthlyCredits - subscription.remainingCredits));
	const elapsedDaysInCycle = $derived(Math.max(1, 30 - daysUntilBilling));
	const averageDailyUsage = $derived(Math.round(usedCredits / elapsedDaysInCycle));
	const isEditValid = $derived.by(() => {
		const maxCredits = plans[editData.planType].credits;
		return (
			Number.isInteger(editData.billingDate) &&
			editData.billingDate >= 1 &&
			editData.billingDate <= 31 &&
			Number.isInteger(editData.remainingCredits) &&
			editData.remainingCredits >= 0 &&
			editData.remainingCredits <= maxCredits
		);
	});
	const hasPendingChanges = $derived.by(
		() =>
			editData.planType !== subscription.planType ||
			editData.status !== subscription.status ||
			editData.billingDate !== subscription.billingDate ||
			editData.remainingCredits !== subscription.remainingCredits ||
			updatedBy !== editInitialUpdatedBy
	);

	// 플랜 비교 카드: 편집 중이면 editData 기준, 아니면 subscription 기준
	const activePlanForComparison = $derived(isEditing ? editData.planType : subscription.planType);

	function toggleComparisonSection(index: number) {
		const next = new Set(openComparisonSections);
		if (next.has(index)) {
			next.delete(index);
		} else {
			next.add(index);
		}
		openComparisonSections = next;
	}

	function formatPrice(value: number): string {
		return `₩${value.toLocaleString('ko-KR')}`;
	}

	function getComparisonPlanPrice(planId: SubscriptionPlan): string {
		const plan = plans[planId];
		const selectedPrice = compareBillingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
		return `${formatPrice(selectedPrice)}/월`;
	}

	function applyPlanFromComparison(planId: SubscriptionPlan) {
		errorMessage = '';
		successMessage = '';

		// 편집 중: editData 기준으로 중복 체크
		if (isEditing) {
			if (editData.planType === planId) {
				successMessage = '이미 선택된 플랜입니다.';
				return;
			}
			editData.planType = planId;
			const maxCredits = plans[planId].credits;
			if (editData.remainingCredits > maxCredits) {
				editData.remainingCredits = maxCredits;
			}
			editPlanActiveIndex = Math.max(0, EDIT_PLAN_VALUES.indexOf(planId));
			successMessage =
				planId === subscription.planType
					? '원래 플랜으로 되돌렸습니다.'
					: '변경할 플랜이 반영되었습니다. 저장 버튼을 눌러 적용하세요.';
			return;
		}

		// 편집 전: subscription 기준으로 중복 체크
		if (subscription.planType === planId) {
			successMessage = '이미 현재 사용 중인 플랜입니다.';
			return;
		}
		startEditing();
		editData.planType = planId;
		const maxCredits = plans[planId].credits;
		if (editData.remainingCredits > maxCredits) {
			editData.remainingCredits = maxCredits;
		}
		editPlanActiveIndex = Math.max(0, EDIT_PLAN_VALUES.indexOf(planId));
		successMessage = '변경할 플랜이 반영되었습니다. 저장 버튼을 눌러 적용하세요.';
	}

	$effect(() => {
		const maxCredits = plans[editData.planType].credits;
		if (!Number.isFinite(editData.remainingCredits) || editData.remainingCredits < 0) {
			editData.remainingCredits = 0;
		} else if (editData.remainingCredits > maxCredits) {
			editData.remainingCredits = maxCredits;
		} else if (!Number.isInteger(editData.remainingCredits)) {
			editData.remainingCredits = Math.round(editData.remainingCredits);
		}

		if (!Number.isFinite(editData.billingDate)) {
			editData.billingDate = 1;
		} else if (editData.billingDate < 1) {
			editData.billingDate = 1;
		} else if (editData.billingDate > 31) {
			editData.billingDate = 31;
		} else if (!Number.isInteger(editData.billingDate)) {
			editData.billingDate = Math.round(editData.billingDate);
		}
	});

	$effect(() => {
		historyFilterBy;
		historyRangeDays;
		historySort;
		const currentKey = `${historyFilterBy}:${historyRangeDays}:${historySort}`;
		if (!isLoading && lastHistoryFilterKey !== currentKey) {
			lastHistoryFilterKey = currentKey;
			void loadHistory(true);
		}
	});

	async function loadSubscription() {
		isLoading = true;
		errorMessage = '';
		successMessage = '';

		try {
			const subscriptionResponse = await fetch('/api/suno/subscription', { cache: 'no-store' });
			const result = (await subscriptionResponse.json()) as ApiOk<SUNOSubscription> | ApiErr;

			if (!subscriptionResponse.ok || !result.ok) {
				const message = result.ok ? '구독 정보를 불러오지 못했습니다.' : result.error.message;
				throw new Error(message);
			}

			subscription = result.data;
			updatedBy = result.data.updatedBy;
		} catch (error) {
			errorMessage =
				error instanceof Error ? error.message : '구독 정보를 불러오는 중 알 수 없는 오류가 발생했습니다.';
			subscription = { ...DEFAULT_SUBSCRIPTION };
			historyItems = [];
			historyOffset = 0;
			historyTotal = 0;
			historyHasMore = false;
			historyErrorMessage = '';
		} finally {
			isLoading = false;
		}
	}

	// 저장
	async function saveChanges() {
		if (!isEditValid) {
			errorMessage = '결제일 또는 남은 크레딧 값을 다시 확인해주세요.';
			return;
		}
		if (!hasPendingChanges) {
			successMessage = '변경된 내용이 없습니다.';
			return;
		}

		isSaving = true;
		errorMessage = '';
		successMessage = '';

		try {
			const payload = {
				planType: editData.planType,
				status: editData.status,
				billingDate: editData.billingDate,
				remainingCredits: editData.remainingCredits,
				updatedBy
			};

			const response = await fetch('/api/suno/subscription', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});

			const result = (await response.json()) as ApiOk<SUNOSubscription> | ApiErr;

			if (!response.ok || !result.ok) {
				const message = result.ok ? '구독 정보 저장에 실패했습니다.' : result.error.message;
				throw new Error(message);
			}

			subscription = result.data;
			editInitialUpdatedBy = updatedBy;
			isEditing = false;
			successMessage = '구독 정보가 저장되었습니다.';
			await loadHistory(true);
		} catch (error) {
			errorMessage =
				error instanceof Error ? error.message : '구독 정보를 저장하는 중 알 수 없는 오류가 발생했습니다.';
		} finally {
			isSaving = false;
		}
	}

	// 편집 시작
	function startEditing() {
		errorMessage = '';
		successMessage = '';
		editData = {
			planType: subscription.planType,
			status: subscription.status,
			billingDate: subscription.billingDate,
			remainingCredits: subscription.remainingCredits
		};
		editPlanDropdownOpen = false;
		editStatusDropdownOpen = false;
		editUpdatedByDropdownOpen = false;
		editPlanActiveIndex = Math.max(0, EDIT_PLAN_VALUES.indexOf(subscription.planType));
		editStatusActiveIndex = Math.max(0, EDIT_STATUS_VALUES.indexOf(subscription.status));
		editUpdatedByActiveIndex = Math.max(0, EDIT_UPDATED_BY_VALUES.indexOf(updatedBy));
		editInitialUpdatedBy = updatedBy;
		isEditing = true;
	}

	function stepBilling(delta: number) {
		const next = Math.round((Number(editData.billingDate) || 1) + delta);
		editData.billingDate = Math.max(1, Math.min(31, next));
	}

	function stepCredits(delta: number) {
		const maxCredits = plans[editData.planType].credits;
		const next = Math.round((Number(editData.remainingCredits) || 0) + delta);
		editData.remainingCredits = Math.max(0, Math.min(maxCredits, next));
	}

	function handleBillingStepClick(event: MouseEvent, delta: number) {
		stepBilling(delta);
		(event.currentTarget as HTMLButtonElement | null)?.blur();
	}

	function handleCreditsStepClick(event: MouseEvent, delta: number) {
		stepCredits(delta);
		(event.currentTarget as HTMLButtonElement | null)?.blur();
	}

	function handleEditToggleClick(event: MouseEvent) {
		if (isEditing) {
			isEditing = false;
		} else {
			startEditing();
		}
		// 마우스 클릭 전환 시 포커스 잔상(핑크 유지) 방지
		if (event.detail > 0) {
			(event.currentTarget as HTMLButtonElement | null)?.blur();
		}
	}

	// 크레딧 상태 색상
	function getCreditStatusColor(): string {
		if (safeUsagePercent >= 90) return 'text-red-500';
		if (safeUsagePercent >= 70) return 'text-yellow-500';
		return 'text-green-500';
	}

	function getCreditBarColor(): string {
		if (safeUsagePercent >= 90) return 'bg-red-500';
		if (safeUsagePercent >= 70) return 'bg-yellow-500';
		return 'bg-green-500';
	}

	function formatHistoryTime(value: string): string {
		const parsed = new Date(value);
		if (Number.isNaN(parsed.getTime())) return value;
		return parsed.toLocaleString('ko-KR', { hour12: false });
	}

	function getHistoryChanges(item: SubscriptionHistoryItem): string[] {
		if (!item.before) return ['초기 구독 정보 생성'];

		const changes: string[] = [];
		if (item.before.planType !== item.after.planType) {
			changes.push(`플랜 ${item.before.planType} → ${item.after.planType}`);
		}
		if (item.before.status !== item.after.status) {
			const label = (s: string) => EDIT_STATUS_LABELS[s as SubscriptionStatus] ?? s;
			changes.push(`상태 ${label(item.before.status)} → ${label(item.after.status)}`);
		}
		if (item.before.billingDate !== item.after.billingDate) {
			changes.push(`결제일 ${item.before.billingDate}일 → ${item.after.billingDate}일`);
		}
		if (item.before.remainingCredits !== item.after.remainingCredits) {
			changes.push(`남은 크레딧 ${item.before.remainingCredits} → ${item.after.remainingCredits}`);
		}
		if (item.before.updatedBy !== item.after.updatedBy) {
			changes.push(`업데이트 담당자 ${item.before.updatedBy} → ${item.after.updatedBy}`);
		}

		return changes.length > 0 ? changes : ['값 변경 없음'];
	}

	async function refreshHistory() {
		await loadHistory(true);
	}

	async function loadMoreHistory() {
		if (isHistoryLoading || !historyHasMore) return;
		await loadHistory(false);
	}

	function closeHistoryDropdowns() {
		historyFilterDropdownOpen = false;
		historyRangeDropdownOpen = false;
		historySortDropdownOpen = false;
	}

	function closeEditDropdowns() {
		editPlanDropdownOpen = false;
		editStatusDropdownOpen = false;
		editUpdatedByDropdownOpen = false;
	}

	function selectHistoryFilter(value: 'all' | Producer) {
		historyFilterBy = value;
		historyFilterDropdownOpen = false;
		if (historyFiltersInitialized) syncHistoryFiltersToUrl();
		historyFilterButtonEl?.focus();
	}

	function selectHistoryRange(value: 0 | 7 | 30 | 90) {
		historyRangeDays = value;
		historyRangeDropdownOpen = false;
		if (historyFiltersInitialized) syncHistoryFiltersToUrl();
		historyRangeButtonEl?.focus();
	}

	function selectHistorySort(value: 'desc' | 'asc') {
		historySort = value;
		historySortDropdownOpen = false;
		if (historyFiltersInitialized) syncHistoryFiltersToUrl();
		historySortButtonEl?.focus();
	}

	async function focusHistoryOption(type: 'filter' | 'range' | 'sort') {
		await tick();
		const activeIndex =
			type === 'filter' ? historyFilterActiveIndex : type === 'range' ? historyRangeActiveIndex : historySortActiveIndex;
		const listEl =
			type === 'filter' ? historyFilterListEl : type === 'range' ? historyRangeListEl : historySortListEl;
		listEl?.querySelector<HTMLLIElement>(`[data-option-index="${activeIndex}"]`)?.focus();
	}

	function openHistoryDropdown(type: 'filter' | 'range' | 'sort') {
		historyFilterDropdownOpen = type === 'filter';
		historyRangeDropdownOpen = type === 'range';
		historySortDropdownOpen = type === 'sort';

		if (type === 'filter') {
			historyFilterActiveIndex = Math.max(0, HISTORY_FILTER_VALUES.indexOf(historyFilterBy));
			void focusHistoryOption('filter');
		}
		if (type === 'range') {
			historyRangeActiveIndex = Math.max(
				0,
				HISTORY_RANGE_OPTIONS.findIndex((option) => option.value === historyRangeDays)
			);
			void focusHistoryOption('range');
		}
		if (type === 'sort') {
			historySortActiveIndex = Math.max(0, HISTORY_SORT_VALUES.indexOf(historySort));
			void focusHistoryOption('sort');
		}
	}

	function toggleHistoryDropdown(type: 'filter' | 'range' | 'sort') {
		const isOpen =
			(type === 'filter' && historyFilterDropdownOpen) ||
			(type === 'range' && historyRangeDropdownOpen) ||
			(type === 'sort' && historySortDropdownOpen);
		if (isOpen) {
			closeHistoryDropdowns();
		} else {
			openHistoryDropdown(type);
		}
	}

	function handleHistoryTriggerKeydown(
		event: KeyboardEvent,
		type: 'filter' | 'range' | 'sort'
	) {
		if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			openHistoryDropdown(type);
		} else if (event.key === 'Escape') {
			closeHistoryDropdowns();
		}
	}

	function handleHistoryListKeydown(
		event: KeyboardEvent,
		type: 'filter' | 'range' | 'sort'
	) {
		const isFilter = type === 'filter';
		const isRange = type === 'range';
		const length = isFilter
			? HISTORY_FILTER_VALUES.length
			: isRange
				? HISTORY_RANGE_OPTIONS.length
				: HISTORY_SORT_VALUES.length;
		let index = isFilter
			? historyFilterActiveIndex
			: isRange
				? historyRangeActiveIndex
				: historySortActiveIndex;

		if (event.key === 'ArrowDown') {
			event.preventDefault();
			index = Math.min(length - 1, index + 1);
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			index = Math.max(0, index - 1);
		} else if (event.key === 'Home') {
			event.preventDefault();
			index = 0;
		} else if (event.key === 'End') {
			event.preventDefault();
			index = length - 1;
		} else if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			if (isFilter) selectHistoryFilter(HISTORY_FILTER_VALUES[historyFilterActiveIndex]);
			if (isRange) selectHistoryRange(HISTORY_RANGE_OPTIONS[historyRangeActiveIndex].value);
			if (!isFilter && !isRange) selectHistorySort(HISTORY_SORT_VALUES[historySortActiveIndex]);
			return;
		} else if (event.key === 'Escape') {
			event.preventDefault();
			closeHistoryDropdowns();
			if (isFilter) historyFilterButtonEl?.focus();
			if (isRange) historyRangeButtonEl?.focus();
			if (!isFilter && !isRange) historySortButtonEl?.focus();
			return;
		} else {
			return;
		}

		if (isFilter) historyFilterActiveIndex = index;
		if (isRange) historyRangeActiveIndex = index;
		if (!isFilter && !isRange) historySortActiveIndex = index;
		void focusHistoryOption(type);
	}

	function handleHistoryOptionKeydown(
		event: KeyboardEvent,
		type: 'filter' | 'range' | 'sort',
		payload: 'all' | Producer | 0 | 7 | 30 | 90 | 'desc' | 'asc'
	) {
		if (event.key !== 'Enter' && event.key !== ' ') return;
		event.preventDefault();
		if (type === 'filter') {
			selectHistoryFilter(payload as 'all' | Producer);
		} else if (type === 'range') {
			selectHistoryRange(payload as 0 | 7 | 30 | 90);
		} else {
			selectHistorySort(payload as 'desc' | 'asc');
		}
	}

	async function focusEditOption(type: 'plan' | 'updatedBy') {
		await tick();
		const activeIndex = type === 'plan' ? editPlanActiveIndex : editUpdatedByActiveIndex;
		const listEl = type === 'plan' ? editPlanListEl : editUpdatedByListEl;
		listEl?.querySelector<HTMLLIElement>(`[data-option-index="${activeIndex}"]`)?.focus();
	}

	function openEditDropdown(type: 'plan' | 'updatedBy') {
		editPlanDropdownOpen = type === 'plan';
		editUpdatedByDropdownOpen = type === 'updatedBy';
		if (type === 'plan') {
			editPlanActiveIndex = Math.max(0, EDIT_PLAN_VALUES.indexOf(editData.planType));
			void focusEditOption('plan');
		} else {
			editUpdatedByActiveIndex = Math.max(0, EDIT_UPDATED_BY_VALUES.indexOf(updatedBy));
			void focusEditOption('updatedBy');
		}
	}

	function toggleEditDropdown(type: 'plan' | 'updatedBy') {
		const isOpen = (type === 'plan' && editPlanDropdownOpen) || (type === 'updatedBy' && editUpdatedByDropdownOpen);
		if (isOpen) closeEditDropdowns();
		else openEditDropdown(type);
	}

	function selectEditPlan(value: SubscriptionPlan) {
		editData.planType = value;
		editPlanDropdownOpen = false;
		editPlanButtonEl?.focus();
	}

	function selectEditUpdatedBy(value: Producer) {
		updatedBy = value;
		editUpdatedByDropdownOpen = false;
		editUpdatedByButtonEl?.focus();
	}

	function handleEditTriggerKeydown(event: KeyboardEvent, type: 'plan' | 'updatedBy') {
		if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			openEditDropdown(type);
		} else if (event.key === 'Escape') {
			closeEditDropdowns();
		}
	}

	function handleEditListKeydown(event: KeyboardEvent, type: 'plan' | 'updatedBy') {
		const isPlan = type === 'plan';
		const length = isPlan ? EDIT_PLAN_VALUES.length : EDIT_UPDATED_BY_VALUES.length;
		let index = isPlan ? editPlanActiveIndex : editUpdatedByActiveIndex;

		if (event.key === 'ArrowDown') {
			event.preventDefault();
			index = Math.min(length - 1, index + 1);
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			index = Math.max(0, index - 1);
		} else if (event.key === 'Home') {
			event.preventDefault();
			index = 0;
		} else if (event.key === 'End') {
			event.preventDefault();
			index = length - 1;
		} else if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			if (isPlan) selectEditPlan(EDIT_PLAN_VALUES[editPlanActiveIndex]);
			else selectEditUpdatedBy(EDIT_UPDATED_BY_VALUES[editUpdatedByActiveIndex]);
			return;
		} else if (event.key === 'Escape') {
			event.preventDefault();
			closeEditDropdowns();
			if (isPlan) editPlanButtonEl?.focus();
			else editUpdatedByButtonEl?.focus();
			return;
		} else {
			return;
		}

		if (isPlan) editPlanActiveIndex = index;
		else editUpdatedByActiveIndex = index;
		void focusEditOption(type);
	}

	function handleEditOptionKeydown(
		event: KeyboardEvent,
		type: 'plan' | 'updatedBy',
		payload: SubscriptionPlan | Producer
	) {
		if (event.key !== 'Enter' && event.key !== ' ') return;
		event.preventDefault();
		if (type === 'plan') selectEditPlan(payload as SubscriptionPlan);
		else selectEditUpdatedBy(payload as Producer);
	}

	function syncHistoryFiltersToUrl() {
		if (typeof window === 'undefined') return;
		const url = new URL(window.location.href);
		if (historyFilterBy === 'all') url.searchParams.delete('hBy');
		else url.searchParams.set('hBy', historyFilterBy);
		if (historyRangeDays === 30) url.searchParams.delete('hDays');
		else url.searchParams.set('hDays', String(historyRangeDays));
		if (historySort === 'desc') url.searchParams.delete('hSort');
		else url.searchParams.set('hSort', historySort);
		const query = url.searchParams.toString();
		const nextUrl = `${url.pathname}${query ? `?${query}` : ''}${url.hash}`;
		replaceState(nextUrl, {});
	}

	function applyHistoryFiltersFromSearch(search: string): boolean {
		const params = new URLSearchParams(search);
		const nextFilter =
			params.get('hBy') === 'El' || params.get('hBy') === 'Otte' || params.get('hBy') === 'all'
				? (params.get('hBy') as 'all' | Producer)
				: 'all';
		const rawDays = Number(params.get('hDays'));
		const nextDays = rawDays === 0 || rawDays === 7 || rawDays === 30 || rawDays === 90 ? rawDays : 30;
		const nextSort = params.get('hSort') === 'asc' ? 'asc' : 'desc';
		const changed =
			nextFilter !== historyFilterBy || nextDays !== historyRangeDays || nextSort !== historySort;
		if (changed) {
			historyFilterBy = nextFilter;
			historyRangeDays = nextDays;
			historySort = nextSort;
		}
		return changed;
	}

	function handleWindowClick(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.history-filter-dropdown')) historyFilterDropdownOpen = false;
		if (!target.closest('.history-range-dropdown')) historyRangeDropdownOpen = false;
		if (!target.closest('.history-sort-dropdown')) historySortDropdownOpen = false;
		if (!target.closest('.edit-plan-dropdown')) editPlanDropdownOpen = false;
		if (!target.closest('.edit-status-dropdown')) editStatusDropdownOpen = false;
		if (!target.closest('.edit-updated-by-dropdown')) editUpdatedByDropdownOpen = false;
	}

	function handleWindowKeydown(event: KeyboardEvent) {
		if (event.key !== 'Escape') return;
		if (historyFilterDropdownOpen) {
			closeHistoryDropdowns();
			historyFilterButtonEl?.focus();
			return;
		}
		if (historyRangeDropdownOpen) {
			closeHistoryDropdowns();
			historyRangeButtonEl?.focus();
			return;
		}
		if (historySortDropdownOpen) {
			closeHistoryDropdowns();
			historySortButtonEl?.focus();
			return;
		}
		if (editPlanDropdownOpen) {
			closeEditDropdowns();
			editPlanButtonEl?.focus();
			return;
		}
		if (editStatusDropdownOpen) {
			closeEditDropdowns();
			editStatusButtonEl?.focus();
			return;
		}
		if (editUpdatedByDropdownOpen) {
			closeEditDropdowns();
			editUpdatedByButtonEl?.focus();
		}
	}

	onMount(() => {
		const handlePopState = () => {
			if (!historyFiltersInitialized) return;
			if (applyHistoryFiltersFromSearch(window.location.search)) {
				const currentKey = `${historyFilterBy}:${historyRangeDays}:${historySort}`;
				lastHistoryFilterKey = currentKey;
				void loadHistory(true);
			}
		};
		window.addEventListener('popstate', handlePopState);
		void (async () => {
			applyHistoryFiltersFromSearch(window.location.search);
			historyFiltersInitialized = true;

			await loadSubscription();
			lastHistoryFilterKey = `${historyFilterBy}:${historyRangeDays}:${historySort}`;
			await loadHistory(true);
		})();
		return () => {
			historyAbortController?.abort();
			window.removeEventListener('popstate', handlePopState);
		};
	});
</script>

<svelte:head>
	<title>구독 관리 | SUNO 제작</title>
</svelte:head>

<svelte:window onclick={handleWindowClick} onkeydown={handleWindowKeydown} />

<div class="pt-0 pb-6 sm:pb-6 pb-20 bg-bg text-text-base">
	<!-- 헤더 -->
	<div class="mb-8 mt-1.5">
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
			<div>
				<h1 class="text-3xl font-bold text-text-strong mb-2">SUNO 제작</h1>
				<p class="text-text-muted">SUNO 구독 정보와 크레딧 사용량을 관리합니다</p>
			</div>
			<button
				type="button"
				onclick={handleEditToggleClick}
				disabled={isLoading || isSaving}
				aria-label={isEditing ? '구독 수정 취소' : '구독 정보 수정'}
				class="btn-outline-hover min-h-11 flex items-center gap-2 px-4 py-2 rounded-lg border flex-shrink-0 text-text-base border-border-subtle focus-visible:outline-none focus-visible:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
			>
				<Edit2 size={16} class="!text-current transition-colors duration-150" />
				<span class="!text-current transition-colors duration-150">{isEditing ? '취소' : '수정'}</span>
			</button>
		</div>
	</div>

	<!-- 탭 + 콘텐츠 -->
	<SUNOTabs>
		{#if errorMessage}
			<div
				role="alert"
				aria-live="assertive"
				class={`${STATUS_BANNER_BASE_CLASS} border-red-500/30 bg-red-500/10 text-red-400`}
			>
				{errorMessage}
			</div>
		{/if}
		{#if successMessage}
			<div
				role="status"
				aria-live="polite"
				class={`${STATUS_BANNER_BASE_CLASS} border-green-500/30 bg-green-500/10 text-green-400`}
			>
				{successMessage}
			</div>
		{/if}

		{#if isLoading}
			<div class="rounded-lg border border-border-subtle bg-surface-2 p-6 text-sm text-text-muted">
				구독 정보를 불러오는 중...
			</div>
		{:else}
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
								<label for="edit-plan-trigger" class="block text-sm font-medium text-text-strong mb-2">플랜</label>
								<div class="relative edit-plan-dropdown min-w-0">
									<button
										id="edit-plan-trigger"
										bind:this={editPlanButtonEl}
										type="button"
										onclick={() => toggleEditDropdown('plan')}
										onkeydown={(e) => handleEditTriggerKeydown(e, 'plan')}
										aria-haspopup="listbox"
										aria-controls={EDIT_PLAN_LISTBOX_ID}
										aria-expanded={editPlanDropdownOpen}
										aria-label="플랜 선택"
										class="status-filter-btn line-3state min-h-11 flex items-center pl-3 pr-8 py-1.5 w-full bg-bg rounded-[6px] text-text-base transition-colors duration-200 cursor-pointer border border-border-subtle focus:outline-none focus:border-brand-pink focus-visible:outline-none focus-visible:outline-none"
									>
										<span class="flex-1 text-left truncate whitespace-nowrap">
											{editData.planType} ({plans[editData.planType].price})
										</span>
										<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
											<ChevronDown size={12} class="text-text-base transition-colors duration-200" />
										</div>
									</button>
									{#if editPlanDropdownOpen}
										<ul
											bind:this={editPlanListEl}
											id={EDIT_PLAN_LISTBOX_ID}
											role="listbox"
											onkeydown={(e) => handleEditListKeydown(e, 'plan')}
											class="absolute left-0 w-full mt-[6px] bg-surface-2 border border-border-subtle rounded-[6px] z-40 max-h-64 overflow-y-auto custom-list-scrollbar"
										>
											{#each EDIT_PLAN_VALUES as value, index}
												<li
													data-option-index={index}
													role="option"
													aria-selected={editData.planType === value}
													tabindex={editPlanActiveIndex === index ? 0 : -1}
													onclick={() => selectEditPlan(value)}
													onkeydown={(e) => handleEditOptionKeydown(e, 'plan', value)}
													onfocus={() => (editPlanActiveIndex = index)}
													class="dropdown-item px-4 py-2 text-sm cursor-pointer transition-colors {editData.planType === value ? 'bg-brand-pink text-white' : 'text-text-base hover:bg-hover-point hover:text-text-on-hover'}"
												>
													{value} ({plans[value].price})
												</li>
											{/each}
										</ul>
									{/if}
								</div>
							</div>
							<div>
								<label for="edit-status-trigger" class="block text-sm font-medium text-text-strong mb-2">구독 상태</label>
								<div class="relative edit-status-dropdown min-w-0">
									<button
										id="edit-status-trigger"
										bind:this={editStatusButtonEl}
										type="button"
										onclick={() => {
											editStatusDropdownOpen = !editStatusDropdownOpen;
											editPlanDropdownOpen = false;
											editUpdatedByDropdownOpen = false;
										}}
										aria-haspopup="listbox"
										aria-expanded={editStatusDropdownOpen}
										aria-label="구독 상태 선택"
										class="status-filter-btn line-3state min-h-11 flex items-center pl-3 pr-8 py-1.5 w-full bg-bg rounded-[6px] text-text-base transition-colors duration-200 cursor-pointer border border-border-subtle focus:outline-none focus:border-brand-pink focus-visible:outline-none focus-visible:outline-none"
									>
										<span class="flex-1 text-left truncate whitespace-nowrap">
											{EDIT_STATUS_LABELS[editData.status]}
										</span>
										<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
											<ChevronDown size={12} class="text-text-base transition-colors duration-200" />
										</div>
									</button>
									{#if editStatusDropdownOpen}
										<ul
											bind:this={editStatusListEl}
											role="listbox"
											class="absolute left-0 w-full mt-[6px] bg-surface-2 border border-border-subtle rounded-[6px] z-40 max-h-64 overflow-y-auto custom-list-scrollbar"
										>
											{#each EDIT_STATUS_VALUES as value, index}
												<li
													data-option-index={index}
													role="option"
													aria-selected={editData.status === value}
													tabindex={editStatusActiveIndex === index ? 0 : -1}
													onclick={() => {
														editData.status = value;
														editStatusActiveIndex = index;
														editStatusDropdownOpen = false;
														editStatusButtonEl?.focus();
													}}
													onkeydown={(e) => {
														if (e.key === 'Enter' || e.key === ' ') {
															e.preventDefault();
															editData.status = value;
															editStatusActiveIndex = index;
															editStatusDropdownOpen = false;
															editStatusButtonEl?.focus();
														}
													}}
													onfocus={() => (editStatusActiveIndex = index)}
													class="dropdown-item px-4 py-2 text-sm cursor-pointer transition-colors {editData.status === value ? 'bg-brand-pink text-white' : 'text-text-base hover:bg-hover-point hover:text-text-on-hover'}"
												>
													{EDIT_STATUS_LABELS[value]}
												</li>
											{/each}
										</ul>
									{/if}
								</div>
							</div>
							<div class="grid grid-cols-2 gap-4">
								<div>
									<label for="edit-billing" class="block text-sm font-medium text-text-strong mb-2">결제일</label>
									<div class="relative">
										<input
											type="number"
											id="edit-billing"
											inputmode="numeric"
											step="1"
											min="1"
											max="31"
											bind:value={editData.billingDate}
											class="edit-number-input line-3state min-h-11 w-full py-1.5 pl-4 pr-10 bg-bg border border-border-subtle rounded-md text-text-base focus:outline-none focus:border-brand-pink focus-visible:outline-none focus-visible:outline-none transition-colors"
										/>
										<div class="absolute right-1 top-1 bottom-1 w-8 flex flex-col">
											<button
												type="button"
												aria-label="결제일 1 증가"
												class="stepper-icon-btn flex-1 flex items-center justify-center !bg-transparent hover:!bg-transparent focus:!bg-transparent focus-visible:!bg-transparent active:!bg-transparent text-text-muted hover:text-hover-point focus-visible:text-brand-pink focus-visible:outline-none transition-colors"
												onclick={(e) => handleBillingStepClick(e, 1)}
											>
												<ChevronUp size={12} />
											</button>
											<button
												type="button"
												aria-label="결제일 1 감소"
												class="stepper-icon-btn flex-1 flex items-center justify-center !bg-transparent hover:!bg-transparent focus:!bg-transparent focus-visible:!bg-transparent active:!bg-transparent text-text-muted hover:text-hover-point focus-visible:text-brand-pink focus-visible:outline-none transition-colors"
												onclick={(e) => handleBillingStepClick(e, -1)}
											>
												<ChevronDown size={12} />
											</button>
										</div>
									</div>
								</div>
								<div>
									<label for="edit-credits" class="block text-sm font-medium text-text-strong mb-2">남은 크레딧</label>
									<div class="relative">
										<input
											type="number"
											id="edit-credits"
											inputmode="numeric"
											step="1"
											min="0"
											max={plans[editData.planType].credits}
											bind:value={editData.remainingCredits}
											class="edit-number-input line-3state min-h-11 w-full py-1.5 pl-4 pr-10 bg-bg border border-border-subtle rounded-md text-text-base focus:outline-none focus:border-brand-pink focus-visible:outline-none focus-visible:outline-none transition-colors"
										/>
										<div class="absolute right-1 top-1 bottom-1 w-8 flex flex-col">
											<button
												type="button"
												aria-label="남은 크레딧 1 증가"
												class="stepper-icon-btn flex-1 flex items-center justify-center !bg-transparent hover:!bg-transparent focus:!bg-transparent focus-visible:!bg-transparent active:!bg-transparent text-text-muted hover:text-hover-point focus-visible:text-brand-pink focus-visible:outline-none transition-colors"
												onclick={(e) => handleCreditsStepClick(e, 1)}
											>
												<ChevronUp size={12} />
											</button>
											<button
												type="button"
												aria-label="남은 크레딧 1 감소"
												class="stepper-icon-btn flex-1 flex items-center justify-center !bg-transparent hover:!bg-transparent focus:!bg-transparent focus-visible:!bg-transparent active:!bg-transparent text-text-muted hover:text-hover-point focus-visible:text-brand-pink focus-visible:outline-none transition-colors"
												onclick={(e) => handleCreditsStepClick(e, -1)}
											>
												<ChevronDown size={12} />
											</button>
										</div>
									</div>
									<p class="mt-1 text-xs text-text-muted">
										선택 플랜 월 크레딧: {plans[editData.planType].credits}
									</p>
								</div>
							</div>
							<div>
								<label for="edit-updated-by-trigger" class="block text-sm font-medium text-text-strong mb-2">업데이트 담당자</label>
								<div class="relative edit-updated-by-dropdown min-w-0">
									<button
										id="edit-updated-by-trigger"
										bind:this={editUpdatedByButtonEl}
										type="button"
										onclick={() => toggleEditDropdown('updatedBy')}
										onkeydown={(e) => handleEditTriggerKeydown(e, 'updatedBy')}
										aria-haspopup="listbox"
										aria-controls={EDIT_UPDATED_BY_LISTBOX_ID}
										aria-expanded={editUpdatedByDropdownOpen}
										aria-label="업데이트 담당자 선택"
										class="status-filter-btn line-3state min-h-11 flex items-center pl-3 pr-8 py-1.5 w-full bg-bg rounded-[6px] text-text-base transition-colors duration-200 cursor-pointer border border-border-subtle focus:outline-none focus:border-brand-pink focus-visible:outline-none focus-visible:outline-none"
									>
										<span class="flex-1 text-left truncate whitespace-nowrap">{updatedBy}</span>
										<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
											<ChevronDown size={12} class="text-text-base transition-colors duration-200" />
										</div>
									</button>
									{#if editUpdatedByDropdownOpen}
										<ul
											bind:this={editUpdatedByListEl}
											id={EDIT_UPDATED_BY_LISTBOX_ID}
											role="listbox"
											onkeydown={(e) => handleEditListKeydown(e, 'updatedBy')}
											class="absolute left-0 w-full mt-[6px] bg-surface-2 border border-border-subtle rounded-[6px] z-40 max-h-64 overflow-y-auto custom-list-scrollbar"
										>
											{#each EDIT_UPDATED_BY_VALUES as value, index}
												<li
													data-option-index={index}
													role="option"
													aria-selected={updatedBy === value}
													tabindex={editUpdatedByActiveIndex === index ? 0 : -1}
													onclick={() => selectEditUpdatedBy(value)}
													onkeydown={(e) => handleEditOptionKeydown(e, 'updatedBy', value)}
													onfocus={() => (editUpdatedByActiveIndex = index)}
													class="dropdown-item px-4 py-2 text-sm cursor-pointer transition-colors {updatedBy === value ? 'bg-brand-pink text-white' : 'text-text-base hover:bg-hover-point hover:text-text-on-hover'}"
												>
													{value}
												</li>
											{/each}
										</ul>
									{/if}
								</div>
							</div>
							{#if !isEditValid}
								<p class="text-sm text-yellow-500">
									결제일은 1~31 정수, 남은 크레딧은 0~{plans[editData.planType].credits} 정수여야 합니다.
								</p>
							{:else if !hasPendingChanges}
								<p class="text-sm text-text-muted">저장할 변경사항이 없습니다.</p>
							{/if}
							<div class="-mx-6 px-6 pt-4 border-t border-border-subtle flex justify-end gap-3">
							<button
								type="button"
								onclick={() => isEditing = false}
								aria-label="구독 수정 취소"
								class="btn-outline-hover min-h-11 px-6 py-2 text-text-base rounded-lg border border-border-subtle font-medium focus-visible:outline-none focus-visible:outline-none"
							>
								취소
							</button>
								<button
									type="button"
									onclick={saveChanges}
									disabled={isSaving || !isEditValid || !hasPendingChanges}
									aria-label="구독 정보 저장"
									class="page-header-primary-button min-h-11 px-6 py-2 rounded-lg font-medium focus-visible:outline-none focus-visible:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
								>
									{isSaving ? '저장 중...' : hasPendingChanges ? '저장' : '변경사항 없음'}
								</button>
							</div>
						</div>
					{:else}
						<!-- 보기 모드 -->
						<div class="flex items-center gap-6 mb-6">
							<div class="w-20 h-20 rounded-2xl border border-border-subtle bg-surface-2 flex items-center justify-center">
								{#if subscription.planType === 'Basic'}
									<Circle size={30} class="text-brand-pink" />
								{:else if subscription.planType === 'Premier'}
									<Crown size={30} class="text-brand-pink" />
								{:else}
									<Zap size={30} class="text-brand-pink" />
								{/if}
							</div>
							<div>
								<div class="flex items-center gap-3">
									<h4 class="text-2xl font-bold text-text-strong">{subscription.planType}</h4>
									{#if subscription.status === 'active'}
										<span class="px-3 py-1 rounded-full bg-brand-pink/20 text-brand-pink text-sm font-medium">활성</span>
									{:else if subscription.status === 'paused'}
										<span class="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-500 text-sm font-medium">일시정지</span>
									{:else}
										<span class="px-3 py-1 rounded-full bg-red-500/20 text-red-500 text-sm font-medium">해지됨</span>
									{/if}
								</div>
								<p class="text-text-muted mt-1">{plans[subscription.planType].price}</p>
							</div>
						</div>

						<!-- 크레딧 현황 (바·퍼센트는 남은량 기준: 꽉 찰수록 많이 남음) -->
						<div class="mb-6">
							<div class="flex items-center justify-between mb-2">
								<span class="text-sm font-medium text-text-strong">크레딧 현황</span>
								<span class="text-sm {getCreditStatusColor()}">{remainingPercent}% 남음</span>
							</div>
							<div class="h-3 bg-bg rounded-full overflow-hidden">
								<div 
									class="h-full transition-all duration-300 {getCreditBarColor()}"
									style="width: {remainingPercent}%"
								></div>
							</div>
							<div class="flex items-center justify-between mt-2 text-sm text-text-muted">
								<span>남음: {subscription.remainingCredits} / {subscription.monthlyCredits}</span>
								<span>사용: {usedCredits}</span>
							</div>
							{#if subscription.status === 'paused'}
								<div class="mt-3 flex items-start gap-2 rounded-md bg-yellow-500/10 px-3 py-2 text-sm text-yellow-500">
									<Pause size={14} class="flex-shrink-0 mt-0.5" />
									<span>일시정지 중 – 다음 결제일에 크레딧이 충전되지 않습니다.</span>
								</div>
							{:else if subscription.status === 'cancelled'}
								<div class="mt-3 flex items-start gap-2 rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-500">
									<XCircle size={14} class="flex-shrink-0 mt-0.5" />
									<span>해지됨 – 남은 크레딧은 기간 종료까지 사용 가능합니다.</span>
								</div>
							{/if}
						</div>

						<!-- 정보 그리드 -->
						<div class="grid grid-cols-2 gap-4">
							<div class="bg-surface-1 rounded-lg p-4">
								<div class="flex items-center gap-2 text-text-muted mb-1">
									<Calendar size={16} />
									<span class="text-sm">다음 결제일</span>
								</div>
								{#if subscription.status === 'cancelled'}
									<p class="text-lg font-semibold text-text-muted">결제 예정 없음</p>
								{:else if subscription.status === 'paused'}
									<p class="text-lg font-semibold text-text-strong">매월 {subscription.billingDate}일</p>
									<p class="text-sm text-yellow-500 mt-1">다음 결제 건너뜀</p>
								{:else}
									<p class="text-lg font-semibold text-text-strong">매월 {subscription.billingDate}일</p>
									<p class="text-sm text-brand-pink mt-1">{daysUntilBilling}일 후</p>
								{/if}
							</div>
							<div class="bg-surface-1 rounded-lg p-4">
								<div class="flex items-center gap-2 text-text-muted mb-1">
									<TrendingUp size={16} />
									<span class="text-sm">일 평균 사용</span>
								</div>
								<p class="text-lg font-semibold text-text-strong">
									{averageDailyUsage} 크레딧
								</p>
								{#if subscription.remainingCredits > 0 && averageDailyUsage > 0}
									<p class="text-sm text-text-muted mt-1">약 {Math.ceil(subscription.remainingCredits / averageDailyUsage)}일 후 소진 예상</p>
								{:else if subscription.remainingCredits <= 0}
									<p class="text-sm text-red-500 mt-1">크레딧 소진됨</p>
								{:else}
									<p class="text-sm text-text-muted mt-1">사용 내역 없음</p>
								{/if}
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

					{#if safeUsagePercent >= 80}
						<div class="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
							<div class="flex items-start gap-3">
								<AlertCircle size={20} class="text-yellow-500 flex-shrink-0 mt-0.5" />
								<div>
									<p class="text-sm font-medium text-yellow-500">크레딧 부족 경고</p>
									<p class="text-sm text-text-muted mt-1">
										크레딧이 {remainingPercent}% 남았습니다.
										{subscription.planType === 'Premier'
											? '다음 결제일까지 사용량을 조절하거나 추가 크레딧 구매를 고려해보세요.'
											: '상위 플랜으로 업그레이드를 고려해보세요.'}
									</p>
								</div>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- 플랜 비교 -->
		<div class="mt-8 rounded-lg border border-border-subtle bg-surface-2">
			<button
				type="button"
				onclick={() => (showPlanComparison = !showPlanComparison)}
				aria-label={showPlanComparison ? '플랜 비교 접기' : '플랜 비교 펼치기'}
				aria-controls="subscription-plan-comparison"
				class="min-h-11 flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-bg/40 focus-visible:outline-none focus-visible:outline-none"
				aria-expanded={showPlanComparison}
			>
				<span class="text-base font-semibold text-text-strong">플랜 비교</span>
				{#if showPlanComparison}
					<ChevronUp size={16} class="text-text-muted" />
				{:else}
					<ChevronDown size={16} class="text-text-muted" />
				{/if}
			</button>
			{#if showPlanComparison}
				<div id="subscription-plan-comparison" class="border-t border-border-subtle p-5">
					<div class="mb-5 flex flex-wrap items-center justify-between gap-3">
						<p class="text-sm text-text-muted">요금제와 기능 차이를 한 번에 비교할 수 있습니다.</p>
						<div class="inline-flex rounded-lg border border-border-subtle bg-surface-1 p-1">
							<button
								type="button"
								onclick={() => (compareBillingCycle = 'monthly')}
								aria-label="월간 요금 보기"
								class="min-h-9 min-w-[84px] rounded-md px-3 text-sm transition-colors focus-visible:outline-none {compareBillingCycle === 'monthly' ? 'bg-brand-pink text-white' : 'text-text-base hover:bg-surface-2'}"
							>
								월간
							</button>
							<button
								type="button"
								onclick={() => (compareBillingCycle = 'yearly')}
								aria-label="연간 요금 보기"
								class="min-h-9 min-w-[104px] rounded-md px-3 text-sm transition-colors focus-visible:outline-none {compareBillingCycle === 'yearly' ? 'bg-brand-pink text-white' : 'text-text-base hover:bg-surface-2'}"
							>
								연간
							</button>
						</div>
					</div>

					<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
						{#each Object.entries(plans) as [planId, plan]}
							{@const isActiveCard = activePlanForComparison === planId}
							<div class="rounded-lg border bg-bg p-5 flex h-full flex-col {isActiveCard ? 'line-active-brand' : 'line-2state'}">
								<div class="mb-3">
									<h4 class="text-lg font-semibold text-text-strong">{plan.name}</h4>
								</div>
								<p class="text-2xl font-bold text-text-strong">{getComparisonPlanPrice(planId as SubscriptionPlan)}</p>
								<p class="mb-1 mt-1 text-xs text-text-muted">
									{compareBillingCycle === 'yearly'
										? `연간 결제 기준 ${plan.yearlyDiscountLabel}`
										: '월간 결제 기준'}
								</p>
								<p class="mb-4 text-xs text-text-muted">월 {plan.credits.toLocaleString('ko-KR')} 크레딧</p>
								<ul class="space-y-2 flex-1">
									{#each plan.cardHighlights as feature}
										<li class="flex items-center gap-2 text-sm text-text-muted">
											<Check size={14} class="text-green-500" />
											{feature}
										</li>
									{/each}
								</ul>
								{#if isActiveCard}
									<button
										type="button"
										disabled
										aria-label={isEditing && editData.planType !== subscription.planType
											? `${plan.name} 선택됨`
											: `${plan.name} 현재 사용 중`}
										class="mt-6 min-h-11 w-full rounded-lg border border-border-subtle bg-surface-2 py-2 text-sm text-text-muted cursor-not-allowed pointer-events-none"
									>
										{isEditing && editData.planType !== subscription.planType ? '선택됨' : '현재 사용 중'}
									</button>
								{:else}
									<button
										type="button"
										onclick={() => applyPlanFromComparison(planId as SubscriptionPlan)}
										aria-label={`${plan.name} 플랜으로 변경 준비`}
										class="btn-outline-hover line-3state mt-6 min-h-11 w-full rounded-lg border border-border-subtle py-2 text-sm text-text-base focus-visible:outline-none focus-visible:outline-none"
									>
										이 플랜으로 변경
									</button>
								{/if}
							</div>
						{/each}
					</div>

					<div class="mt-5 xl:hidden">
						<div class="space-y-2">
							{#each planComparisonSections as section, sectionIndex}
								<section class="rounded-lg border border-border-subtle bg-surface-1 overflow-hidden">
									<button
										type="button"
										onclick={() => toggleComparisonSection(sectionIndex)}
										aria-expanded={openComparisonSections.has(sectionIndex)}
										class="line-3state flex w-full items-center justify-between border-0 px-4 py-3 text-left text-sm font-semibold text-text-muted transition-colors hover:text-text-base focus-visible:outline-none focus-visible:outline-none"
									>
										{section.title}
										{#if openComparisonSections.has(sectionIndex)}
											<ChevronUp size={14} class="text-text-muted flex-shrink-0" />
										{:else}
											<ChevronDown size={14} class="text-text-muted flex-shrink-0" />
										{/if}
									</button>
									{#if openComparisonSections.has(sectionIndex)}
										<div class="border-t border-border-subtle">
											{#each section.rows as row, rowIndex}
												<div class="px-4 py-3 {rowIndex > 0 ? 'border-t border-border-subtle' : ''}">
													<p class="mb-2 text-sm font-medium text-text-base">{row.label}</p>
													<div class="space-y-2">
														{#each PLAN_COMPARISON_ORDER as planId}
															<div class="flex items-center justify-between gap-3 rounded-md bg-surface-2 px-3 py-2">
																<span class="text-xs text-text-muted">
																	{planId === 'Basic' ? 'Free' : planId}
																</span>
																<span class="text-sm text-text-base">
																	{#if row.values[planId].kind === 'check'}
																		<span class="inline-flex items-center justify-center" aria-label="지원">
																			<Check size={16} class="text-green-500" />
																		</span>
																	{:else if row.values[planId].kind === 'lock'}
																		<span class="inline-flex items-center justify-center" aria-label="미지원">
																			<Lock size={15} class="text-text-muted" />
																		</span>
																	{:else}
																		{row.values[planId].text}
																	{/if}
																</span>
															</div>
														{/each}
													</div>
												</div>
											{/each}
										</div>
									{/if}
								</section>
							{/each}
						</div>
					</div>

					<div class="mt-5 hidden xl:block space-y-2">
						{#each planComparisonSections as section, sectionIndex}
							<div class="rounded-lg border border-border-subtle overflow-hidden">
								<button
									type="button"
									onclick={() => toggleComparisonSection(sectionIndex)}
									aria-expanded={openComparisonSections.has(sectionIndex)}
									class="line-3state flex w-full items-center justify-between border-0 bg-bg px-5 py-3 text-left text-sm font-semibold text-text-muted transition-colors hover:text-text-base focus-visible:outline-none focus-visible:outline-none"
								>
									{section.title}
									{#if openComparisonSections.has(sectionIndex)}
										<ChevronUp size={14} class="text-text-muted flex-shrink-0" />
									{:else}
										<ChevronDown size={14} class="text-text-muted flex-shrink-0" />
									{/if}
								</button>
								{#if openComparisonSections.has(sectionIndex)}
									<table class="w-full border-collapse">
										<thead>
											<tr class="border-t border-border-subtle bg-surface-2/40">
												<th class="px-4 py-2 text-left text-xs font-semibold tracking-wide text-text-muted">기능</th>
												<th class="px-4 py-2 text-center text-xs font-semibold tracking-wide text-text-muted">Free</th>
												<th class="px-4 py-2 text-center text-xs font-semibold tracking-wide text-text-muted">Pro</th>
												<th class="px-4 py-2 text-center text-xs font-semibold tracking-wide text-text-muted">Premier</th>
											</tr>
										</thead>
										<tbody>
											{#each section.rows as row}
												<tr class="border-t border-border-subtle">
													<td class="px-4 py-3 text-sm text-text-base">{row.label}</td>
													{#each PLAN_COMPARISON_ORDER as planId}
														<td class="px-4 py-3 text-center text-sm text-text-base">
															{#if row.values[planId].kind === 'check'}
																<span class="inline-flex items-center justify-center" aria-label="지원">
																	<Check size={16} class="text-green-500" />
																</span>
															{:else if row.values[planId].kind === 'lock'}
																<span class="inline-flex items-center justify-center" aria-label="미지원">
																	<Lock size={15} class="text-text-muted" />
																</span>
															{:else}
																{row.values[planId].text}
															{/if}
														</td>
													{/each}
												</tr>
											{/each}
										</tbody>
									</table>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>

		<!-- 마지막 업데이트 -->
		<div class="mt-6 text-sm text-text-muted text-right">
			마지막 업데이트: {subscription.lastUpdated?.trim() || '갱신일 없음'}
		</div>

		<div id={HISTORY_SECTION_ID} aria-busy={isHistoryLoading} class="mt-8 rounded-lg border border-border-subtle bg-surface-2">
			<div class="border-b border-border-subtle px-6 py-4">
				<div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
					<h3 class="text-lg font-semibold text-text-strong">최근 변경 이력</h3>
					<div class="flex flex-col gap-2 xl:flex-row xl:items-center">
						<div class="grid flex-1 grid-cols-1 gap-2 xl:grid-cols-3">
							<div class="relative history-filter-dropdown min-w-0">
							<button
								bind:this={historyFilterButtonEl}
								type="button"
								onclick={() => toggleHistoryDropdown('filter')}
								onkeydown={(e) => handleHistoryTriggerKeydown(e, 'filter')}
								aria-haspopup="listbox"
								aria-controls={HISTORY_FILTER_LISTBOX_ID}
								aria-expanded={historyFilterDropdownOpen}
								aria-label="담당자 필터 선택"
								class="status-filter-btn line-3state min-h-11 flex items-center pl-3 pr-8 py-1.5 w-full bg-surface-2 rounded-[6px] text-text-base transition-colors duration-200 cursor-pointer border border-border-subtle focus:outline-none focus:border-brand-pink focus-visible:outline-none focus-visible:outline-none"
							>
								<span class="flex-1 text-left truncate whitespace-nowrap">{HISTORY_FILTER_LABELS[historyFilterBy]}</span>
								<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
									<ChevronDown size={12} class="text-text-base transition-colors duration-200" />
								</div>
							</button>
							{#if historyFilterDropdownOpen}
								<ul
									bind:this={historyFilterListEl}
									id={HISTORY_FILTER_LISTBOX_ID}
									role="listbox"
									onkeydown={(e) => handleHistoryListKeydown(e, 'filter')}
									class="absolute left-0 w-full mt-[6px] bg-surface-2 border border-border-subtle rounded-[6px] z-40 max-h-64 overflow-y-auto custom-list-scrollbar"
								>
									{#each Object.entries(HISTORY_FILTER_LABELS) as [value, label], index}
										<li
											data-option-index={index}
											role="option"
											aria-selected={historyFilterBy === value}
											tabindex={historyFilterActiveIndex === index ? 0 : -1}
											onclick={() => selectHistoryFilter(value as 'all' | Producer)}
											onkeydown={(e) =>
												handleHistoryOptionKeydown(e, 'filter', value as 'all' | Producer)}
											onfocus={() => (historyFilterActiveIndex = index)}
											class="dropdown-item px-4 py-2 text-sm cursor-pointer transition-colors {historyFilterBy === value ? 'bg-brand-pink text-white' : 'text-text-base hover:bg-hover-point hover:text-text-on-hover'}"
										>
											{label}
										</li>
									{/each}
								</ul>
							{/if}
						</div>

							<div class="relative history-range-dropdown min-w-0">
							<button
								bind:this={historyRangeButtonEl}
								type="button"
								onclick={() => toggleHistoryDropdown('range')}
								onkeydown={(e) => handleHistoryTriggerKeydown(e, 'range')}
								aria-haspopup="listbox"
								aria-controls={HISTORY_RANGE_LISTBOX_ID}
								aria-expanded={historyRangeDropdownOpen}
								aria-label="기간 필터 선택"
								class="status-filter-btn line-3state min-h-11 flex items-center pl-3 pr-8 py-1.5 w-full bg-surface-2 rounded-[6px] text-text-base transition-colors duration-200 cursor-pointer border border-border-subtle focus:outline-none focus:border-brand-pink focus-visible:outline-none focus-visible:outline-none"
							>
								<span class="flex-1 text-left truncate whitespace-nowrap">
									{HISTORY_RANGE_OPTIONS.find((option) => option.value === historyRangeDays)?.label ?? '최근 30일'}
								</span>
								<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
									<ChevronDown size={12} class="text-text-base transition-colors duration-200" />
								</div>
							</button>
							{#if historyRangeDropdownOpen}
								<ul
									bind:this={historyRangeListEl}
									id={HISTORY_RANGE_LISTBOX_ID}
									role="listbox"
									onkeydown={(e) => handleHistoryListKeydown(e, 'range')}
									class="absolute left-0 w-full mt-[6px] bg-surface-2 border border-border-subtle rounded-[6px] z-40 max-h-64 overflow-y-auto custom-list-scrollbar"
								>
									{#each HISTORY_RANGE_OPTIONS as option, index}
										<li
											data-option-index={index}
											role="option"
											aria-selected={historyRangeDays === option.value}
											tabindex={historyRangeActiveIndex === index ? 0 : -1}
											onclick={() => selectHistoryRange(option.value)}
											onkeydown={(e) => handleHistoryOptionKeydown(e, 'range', option.value)}
											onfocus={() => (historyRangeActiveIndex = index)}
											class="dropdown-item px-4 py-2 text-sm cursor-pointer transition-colors {historyRangeDays === option.value ? 'bg-brand-pink text-white' : 'text-text-base hover:bg-hover-point hover:text-text-on-hover'}"
										>
											{option.label}
										</li>
									{/each}
								</ul>
							{/if}
						</div>

							<div class="relative history-sort-dropdown min-w-0">
							<button
								bind:this={historySortButtonEl}
								type="button"
								onclick={() => toggleHistoryDropdown('sort')}
								onkeydown={(e) => handleHistoryTriggerKeydown(e, 'sort')}
								aria-haspopup="listbox"
								aria-controls={HISTORY_SORT_LISTBOX_ID}
								aria-expanded={historySortDropdownOpen}
								aria-label="정렬 방식 선택"
								class="status-filter-btn line-3state min-h-11 flex items-center pl-3 pr-8 py-1.5 w-full bg-surface-2 rounded-[6px] text-text-base transition-colors duration-200 cursor-pointer border border-border-subtle focus:outline-none focus:border-brand-pink focus-visible:outline-none focus-visible:outline-none"
							>
								<span class="flex-1 text-left truncate whitespace-nowrap">{HISTORY_SORT_LABELS[historySort]}</span>
								<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
									<ChevronDown size={12} class="text-text-base transition-colors duration-200" />
								</div>
							</button>
							{#if historySortDropdownOpen}
								<ul
									bind:this={historySortListEl}
									id={HISTORY_SORT_LISTBOX_ID}
									role="listbox"
									onkeydown={(e) => handleHistoryListKeydown(e, 'sort')}
									class="absolute left-0 w-full mt-[6px] bg-surface-2 border border-border-subtle rounded-[6px] z-40 max-h-64 overflow-y-auto custom-list-scrollbar"
								>
									{#each Object.entries(HISTORY_SORT_LABELS) as [value, label], index}
										<li
											data-option-index={index}
											role="option"
											aria-selected={historySort === value}
											tabindex={historySortActiveIndex === index ? 0 : -1}
											onclick={() => selectHistorySort(value as 'desc' | 'asc')}
											onkeydown={(e) =>
												handleHistoryOptionKeydown(e, 'sort', value as 'desc' | 'asc')}
											onfocus={() => (historySortActiveIndex = index)}
											class="dropdown-item px-4 py-2 text-sm cursor-pointer transition-colors {historySort === value ? 'bg-brand-pink text-white' : 'text-text-base hover:bg-hover-point hover:text-text-on-hover'}"
										>
											{label}
										</li>
									{/each}
								</ul>
							{/if}
						</div>
						</div>

						<button
							type="button"
							onclick={refreshHistory}
							disabled={isHistoryLoading}
							aria-label="변경 이력 새로고침"
							class="line-3state min-h-11 w-full xl:w-[132px] xl:flex-none flex items-center justify-center rounded-md border border-border-subtle bg-surface-1 px-3 py-1.5 text-sm text-text-base hover:bg-surface-2 focus-visible:outline-none focus-visible:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
						>
							{isHistoryLoading ? '불러오는 중...' : '새로고침'}
						</button>
					</div>
				</div>
			</div>
			<div class="p-6">
				<div class="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
					<div class="rounded-lg border border-border-subtle bg-surface-1 px-4 py-3">
						<p class="text-[11px] uppercase tracking-wide text-text-muted">조회된 이력</p>
						<p class="mt-1 text-base font-semibold tabular-nums text-text-strong">{formatCount(historyCount)} / {formatCount(historyTotal)}건</p>
					</div>
					<div class="rounded-lg border border-border-subtle bg-surface-1 px-4 py-3">
						<p class="text-[11px] uppercase tracking-wide text-text-muted">El 변경</p>
						<p class="mt-1 text-base font-semibold tabular-nums text-text-strong">{formatCount(changedByElCount)}건</p>
					</div>
					<div class="rounded-lg border border-border-subtle bg-surface-1 px-4 py-3">
						<p class="text-[11px] uppercase tracking-wide text-text-muted">Otte 변경</p>
						<p class="mt-1 text-base font-semibold tabular-nums text-text-strong">{formatCount(changedByOtteCount)}건</p>
					</div>
				</div>

				{#if historyErrorMessage}
					<div
						role="status"
						aria-live="polite"
						class={`${STATUS_BANNER_BASE_CLASS} flex flex-col gap-2 border-yellow-500/30 bg-yellow-500/10 text-yellow-400 sm:flex-row sm:items-center sm:justify-between`}
					>
						<span>{historyErrorMessage}</span>
						<button
							type="button"
							onclick={refreshHistory}
							disabled={isHistoryLoading}
							aria-label="변경 이력 다시 시도"
							class="min-h-11 rounded-md border border-yellow-500/40 bg-yellow-500/10 px-3 py-1.5 text-xs font-medium text-yellow-300 transition-colors hover:bg-yellow-500/20 focus-visible:outline-none focus-visible:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
						>
							다시 시도
						</button>
					</div>
				{/if}

				{#if latestHistory}
					<div class="mb-4 rounded-lg border border-border-subtle bg-surface-1 px-4 py-3 text-sm text-text-muted">
						최근 변경: <span class="font-medium {getAuthorTextClass(latestHistory.updatedBy)}">{latestHistory.updatedBy}</span> ·
						{formatHistoryTime(latestHistory.updatedAt)}
					</div>
				{/if}

				{#if historyItems.length === 0}
					<p class="text-sm text-text-muted">
						{historyFilterBy === 'all' && historyRangeDays === 0
							? '아직 저장된 변경 이력이 없습니다.'
							: '현재 조건에 맞는 변경 이력이 없습니다.'}
					</p>
				{:else}
					<ul class="space-y-3">
						{#each historyItems as item}
							<li class="rounded-lg border border-border-subtle bg-surface-1 p-4">
								<div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
									<p class="text-sm font-medium leading-5">
										<span class={getAuthorTextClass(item.updatedBy)}>{item.updatedBy}</span>
										<span class="text-text-muted"> · {formatHistoryTime(item.updatedAt)}</span>
									</p>
									<p class="text-xs text-text-muted sm:text-right">
										플랜 <span class="font-medium text-text-base">{item.after.planType}</span>
										· <span class="font-medium text-text-base">{EDIT_STATUS_LABELS[item.after.status as SubscriptionStatus] ?? item.after.status ?? '활성'}</span>
										· 남은 <span class="font-medium text-text-base">{item.after.remainingCredits}</span>
									</p>
								</div>
								<div class="mt-2 flex flex-wrap gap-1.5">
									{#each getHistoryChanges(item) as change}
										<span class="rounded-md border border-border-subtle bg-surface-2 px-2 py-0.5 text-xs leading-5 text-text-muted">
											{change}
										</span>
									{/each}
								</div>
							</li>
						{/each}
					</ul>
					{#if historyHasMore}
						<div class="mt-4 flex justify-center">
							<button
								type="button"
								onclick={loadMoreHistory}
								disabled={isHistoryLoading}
								aria-label="변경 이력 더 불러오기"
								class="line-3state min-h-11 rounded-md border border-border-subtle bg-surface-1 px-4 py-2 text-sm text-text-base hover:bg-surface-2 focus-visible:outline-none focus-visible:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
							>
								{isHistoryLoading ? '불러오는 중...' : '이력 더보기'}
							</button>
						</div>
					{/if}
				{/if}
			</div>
		</div>
		{/if}
	</SUNOTabs>
</div>
