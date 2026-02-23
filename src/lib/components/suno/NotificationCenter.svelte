<script lang="ts">
	import { Bell, X, Check, AlertCircle, Info, CreditCard, Calendar, Trash2 } from 'lucide-svelte';
	import type { Snippet } from 'svelte';
	import type { SUNOSubscription } from '$lib/types/suno';

	// Props (Svelte 5: trigger는 스니펫으로 전달)
	interface Props {
		subscription: SUNOSubscription;
		isOpen?: boolean;
		onClose?: () => void;
		trigger?: Snippet<[{ unreadCount: number }]>;
	}

	let { subscription, isOpen = false, onClose, trigger }: Props = $props();

	// 알림 타입
	interface Notification {
		id: string;
		type: 'info' | 'warning' | 'success' | 'credit' | 'billing';
		title: string;
		message: string;
		date: string;
		isRead: boolean;
	}

	// 알림 생성
	const notifications = $derived.by(() => {
		const items: Notification[] = [];

		// 크레딧 관련 알림
		const usagePercent = Math.round(((subscription.monthlyCredits - subscription.remainingCredits) / subscription.monthlyCredits) * 100);
		
		if (usagePercent >= 90) {
			items.push({
				id: 'credit_critical',
				type: 'warning',
				title: '크레딧 부족 경고',
				message: `크레딧이 ${100 - usagePercent}%만 남았습니다. 상위 플랜 업그레이드를 고려해보세요.`,
				date: new Date().toISOString().split('T')[0],
				isRead: false
			});
		} else if (usagePercent >= 70) {
			items.push({
				id: 'credit_warning',
				type: 'credit',
				title: '크레딧 사용량 알림',
				message: `이번 달 크레딧의 ${usagePercent}%를 사용했습니다.`,
				date: new Date().toISOString().split('T')[0],
				isRead: false
			});
		}

		// 결제일 관련 알림
		const today = new Date();
		const currentDay = today.getDate();
		let daysUntilBilling = subscription.billingDate - currentDay;
		if (daysUntilBilling < 0) {
			daysUntilBilling += 30;
		}

		if (daysUntilBilling <= 3) {
			items.push({
				id: 'billing_soon',
				type: 'billing',
				title: '결제일 임박',
				message: `${daysUntilBilling}일 후 SUNO ${subscription.planType} 플랜이 갱신됩니다.`,
				date: new Date().toISOString().split('T')[0],
				isRead: false
			});
		} else if (daysUntilBilling <= 7) {
			items.push({
				id: 'billing_upcoming',
				type: 'info',
				title: '결제일 안내',
				message: `${daysUntilBilling}일 후 정기 결제가 예정되어 있습니다.`,
				date: new Date().toISOString().split('T')[0],
				isRead: true
			});
		}

		// 기타 알림 (목업)
		items.push({
			id: 'welcome',
			type: 'success',
			title: 'SUNO 제작 시스템에 오신 것을 환영합니다!',
			message: '새로운 프로젝트를 시작하거나 워드 라이브러리를 확인해보세요.',
			date: '2026-01-10',
			isRead: true
		});

		return items;
	});

	// 읽지 않은 알림 수
	const unreadCount = $derived(notifications.filter(n => !n.isRead).length);

	// 아이콘 선택
	function getIcon(type: string) {
		switch (type) {
			case 'warning': return AlertCircle;
			case 'success': return Check;
			case 'credit': return CreditCard;
			case 'billing': return Calendar;
			default: return Info;
		}
	}

	// 색상 선택
	function getColor(type: string): string {
		switch (type) {
			case 'warning': return 'text-yellow-500 bg-yellow-500/20';
			case 'success': return 'text-green-500 bg-green-500/20';
			case 'credit': return 'text-brand-pink bg-brand-pink/20';
			case 'billing': return 'text-blue-500 bg-blue-500/20';
			default: return 'text-text-muted bg-surface-2';
		}
	}

	// 알림 읽음 처리
	function markAsRead(id: string) {
		const notification = notifications.find(n => n.id === id);
		if (notification) {
			notification.isRead = true;
		}
	}

	// 전체 읽음
	function markAllAsRead() {
		notifications.forEach(n => n.isRead = true);
	}
</script>

<!-- 알림 벨 버튼 (외부에서 사용) -->
{#if trigger}
	{@render trigger({ unreadCount })}
{/if}

<!-- 알림 패널 -->
{#if isOpen}
	<div class="absolute right-0 top-full mt-2 w-80 bg-surface-1 rounded-lg border border-border-subtle ring-1 ring-border-subtle/50 z-50 overflow-hidden">
		<!-- 헤더 -->
		<div class="px-4 py-3 border-b border-border-subtle flex items-center justify-between">
			<div class="flex items-center gap-2">
				<Bell size={16} class="text-brand-pink" />
				<span class="text-sm font-semibold text-text-strong">알림</span>
				{#if unreadCount > 0}
					<span class="px-1.5 py-0.5 rounded-full bg-brand-pink text-white text-xs font-medium">
						{unreadCount}
					</span>
				{/if}
			</div>
			<div class="flex items-center gap-2">
				{#if unreadCount > 0}
					<button
						type="button"
						onclick={markAllAsRead}
						class="text-xs text-text-muted hover:text-brand-pink transition-colors"
					>
						모두 읽음
					</button>
				{/if}
				<button type="button" onclick={onClose} class="btn-icon">
					<X size={14} />
				</button>
			</div>
		</div>

		<!-- 알림 목록 -->
		<div class="max-h-80 overflow-y-auto custom-list-scrollbar">
			{#if notifications.length === 0}
				<div class="py-8 text-center text-text-muted text-sm">
					알림이 없습니다
				</div>
			{:else}
				{#each notifications as notification}
					{@const Icon = getIcon(notification.type)}
					<button
						type="button"
						class="w-full text-left px-4 py-3 border-b border-border-subtle last:border-b-0 hover:bg-surface-2/50 transition-colors cursor-pointer
							{notification.isRead ? 'opacity-60' : ''}"
						onclick={() => markAsRead(notification.id)}
					>
						<div class="flex items-start gap-3">
							<div class="w-8 h-8 rounded-full {getColor(notification.type)} flex items-center justify-center flex-shrink-0">
								<Icon size={14} />
							</div>
							<div class="flex-1 min-w-0">
								<div class="flex items-center gap-2">
									<span class="text-sm font-medium text-text-strong truncate">{notification.title}</span>
									{#if !notification.isRead}
										<span class="w-2 h-2 rounded-full bg-brand-pink flex-shrink-0"></span>
									{/if}
								</div>
								<p class="text-xs text-text-muted mt-0.5 line-clamp-2">{notification.message}</p>
								<span class="text-xs text-text-muted mt-1 block">{notification.date}</span>
							</div>
						</div>
					</button>
				{/each}
			{/if}
		</div>

		<!-- 푸터 -->
		<div class="px-4 py-3 border-t border-border-subtle bg-surface-2/30">
			<a 
				href="/suno/subscription" 
				class="text-xs text-brand-pink hover:underline"
			>
				구독 관리 바로가기
			</a>
		</div>
	</div>
{/if}
