<script lang="ts">
	import { Shield, Lock, Eye, AlertTriangle, CheckCircle, Key, Clock, User, Settings, Bell, Activity, FileText, Users } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';
	import { toast } from '$lib/stores/toast';

	// 보안 상태 타입
	interface SecurityItem {
		id: string;
		title: string;
		status: 'enabled' | 'disabled' | 'warning';
		description: string;
		canToggle?: boolean;
	}

	interface ActivityLog {
		id: string;
		type: 'success' | 'warning' | 'error' | 'info';
		message: string;
		timestamp: string;
		user?: string;
		ip?: string;
	}

	// 보안 상태
	let securityStatus = $state({
		overall: 'good',
		lastScan: new Date().toISOString(),
		threats: 0,
		updates: 2,
		activeUsers: 3,
		failedLogins: 0
	});

	// 보안 설정 항목
	let securityItems = $state<SecurityItem[]>([
		{
			id: '1',
			title: '2단계 인증',
			status: 'enabled',
			description: '계정 보안을 위한 추가 인증 단계',
			canToggle: true
		},
		{
			id: '2',
			title: '비밀번호 정책',
			status: 'enabled',
			description: '강력한 비밀번호 요구사항 적용',
			canToggle: true
		},
		{
			id: '3',
			title: '로그 모니터링',
			status: 'enabled',
			description: '시스템 접근 로그 실시간 모니터링',
			canToggle: true
		},
		{
			id: '4',
			title: '데이터 암호화',
			status: 'enabled',
			description: '민감한 데이터 암호화 저장',
			canToggle: false
		},
		{
			id: '5',
			title: '자동 백업',
			status: 'enabled',
			description: '일일 자동 백업 실행',
			canToggle: true
		},
		{
			id: '6',
			title: 'IP 화이트리스트',
			status: 'disabled',
			description: '특정 IP 주소만 접근 허용',
			canToggle: true
		}
	]);

	// 활동 로그
	let activityLogs = $state<ActivityLog[]>([
		{
			id: '1',
			type: 'success',
			message: '보안 스캔 완료',
			timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
			user: '시스템'
		},
		{
			id: '2',
			type: 'success',
			message: '로그인 성공',
			timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
			user: 'admin',
			ip: '192.168.1.100'
		},
		{
			id: '3',
			type: 'warning',
			message: '의심스러운 활동 감지',
			timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
			user: 'unknown',
			ip: '192.168.1.200'
		},
		{
			id: '4',
			type: 'success',
			message: '시스템 업데이트 완료',
			timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
			user: '시스템'
		},
		{
			id: '5',
			type: 'info',
			message: '백업 생성 완료',
			timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
			user: '시스템'
		}
	]);

	// 필터 상태
	let selectedLogFilter = $state('all');
	let selectedTab = $state('overview'); // overview, settings, logs, permissions

	// 상태 색상 및 라벨
	function getStatusColor(status: string) {
		switch (status) {
			case 'enabled': return 'badge-low-green';
			case 'disabled': return 'badge-high-urgent';
			case 'warning': return 'badge-medium-yellow';
			default: return 'text-text-muted';
		}
	}

	function getStatusLabel(status: string) {
		switch (status) {
			case 'enabled': return '활성화됨';
			case 'disabled': return '비활성화됨';
			case 'warning': return '주의 필요';
			default: return '알 수 없음';
		}
	}

	// 로그 타입 색상
	function getLogTypeColor(type: string) {
		switch (type) {
			case 'success': return 'text-green-500';
			case 'warning': return 'text-yellow-500';
			case 'error': return 'text-red-500';
			case 'info': return 'text-blue-500';
			default: return 'text-text-muted';
		}
	}

	function getLogTypeIcon(type: string) {
		switch (type) {
			case 'success': return CheckCircle;
			case 'warning': return AlertTriangle;
			case 'error': return AlertTriangle;
			case 'info': return Eye;
			default: return CheckCircle;
		}
	}

	// 시간 포맷팅
	function formatTime(dateString: string): string {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return '방금 전';
		if (diffMins < 60) return `${diffMins}분 전`;
		if (diffHours < 24) return `${diffHours}시간 전`;
		if (diffDays < 7) return `${diffDays}일 전`;
		return date.toLocaleDateString('ko-KR');
	}

	// 보안 설정 토글
	function toggleSecurityItem(item: SecurityItem) {
		if (!item.canToggle) {
			toast.add('이 설정은 변경할 수 없습니다.', 'warning');
			return;
		}

		const newStatus = item.status === 'enabled' ? 'disabled' : 'enabled';
		const index = securityItems.findIndex(i => i.id === item.id);
		if (index !== -1) {
			securityItems[index] = { ...securityItems[index], status: newStatus };
			toast.add(`${item.title}이(가) ${newStatus === 'enabled' ? '활성화' : '비활성화'}되었습니다.`, 'success');
		}
	}

	// 필터링된 로그
	const filteredLogs = $derived.by(() => {
		if (selectedLogFilter === 'all') return activityLogs;
		return activityLogs.filter(log => log.type === selectedLogFilter);
	});

	// 전체 보안 점수 계산
	const securityScore = $derived.by(() => {
		const enabledCount = securityItems.filter(item => item.status === 'enabled').length;
		const totalCount = securityItems.length;
		return Math.round((enabledCount / totalCount) * 100);
	});
</script>

<PageContent>
	<PageHeader 
		title="보안·운영 관리" 
		description="시스템 보안 상태를 모니터링하고 관리하세요."
	/>

	<!-- 탭 네비게이션 -->
	<div class="mb-6 border-b border-border-subtle">
		<div class="flex gap-4">
			<button
				onclick={() => selectedTab = 'overview'}
				class="px-4 py-2 text-sm font-medium border-b-2 transition-colors {selectedTab === 'overview' ? 'border-brand-pink text-brand-pink' : 'border-transparent text-text-muted hover:text-text-strong'}"
				type="button"
			>
				개요
			</button>
			<button
				onclick={() => selectedTab = 'settings'}
				class="px-4 py-2 text-sm font-medium border-b-2 transition-colors {selectedTab === 'settings' ? 'border-brand-pink text-brand-pink' : 'border-transparent text-text-muted hover:text-text-strong'}"
				type="button"
			>
				보안 설정
			</button>
			<button
				onclick={() => selectedTab = 'logs'}
				class="px-4 py-2 text-sm font-medium border-b-2 transition-colors {selectedTab === 'logs' ? 'border-brand-pink text-brand-pink' : 'border-transparent text-text-muted hover:text-text-strong'}"
				type="button"
			>
				활동 로그
			</button>
		</div>
	</div>

	<!-- 개요 탭 -->
	{#if selectedTab === 'overview'}
		<!-- 보안 상태 요약 -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
			<div class="bg-surface-1 rounded-lg p-6 border border-border-subtle">
				<div class="flex items-center gap-3 mb-2">
					<Shield size={20} class="text-green-500" />
					<span class="text-sm font-medium text-text-muted">보안 점수</span>
				</div>
				<div class="text-2xl font-bold text-green-500">{securityScore}%</div>
				<div class="text-xs text-text-muted mt-1">활성화된 보안 기능</div>
			</div>

			<div class="bg-surface-1 rounded-lg p-6 border border-border-subtle">
				<div class="flex items-center gap-3 mb-2">
					<Eye size={20} class="text-brand-pink" />
					<span class="text-sm font-medium text-text-muted">마지막 스캔</span>
				</div>
				<div class="text-sm text-text-strong">{formatTime(securityStatus.lastScan)}</div>
			</div>

			<div class="bg-surface-1 rounded-lg p-6 border border-border-subtle">
				<div class="flex items-center gap-3 mb-2">
					<AlertTriangle size={20} class="text-red-500" />
					<span class="text-sm font-medium text-text-muted">위협</span>
				</div>
				<div class="text-2xl font-bold text-red-500">{securityStatus.threats}</div>
				<div class="text-xs text-text-muted mt-1">감지된 위협</div>
			</div>

			<div class="bg-surface-1 rounded-lg p-6 border border-border-subtle">
				<div class="flex items-center gap-3 mb-2">
					<Key size={20} class="text-yellow-500" />
					<span class="text-sm font-medium text-text-muted">업데이트</span>
				</div>
				<div class="text-2xl font-bold text-yellow-500">{securityStatus.updates}</div>
				<div class="text-xs text-text-muted mt-1">대기 중인 업데이트</div>
			</div>
		</div>

		<!-- 추가 통계 -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
			<div class="bg-surface-1 rounded-lg p-6 border border-border-subtle">
				<div class="flex items-center gap-3 mb-4">
					<Users size={20} class="text-brand-pink" />
					<h3 class="text-lg font-semibold text-text-strong">활성 사용자</h3>
				</div>
				<div class="text-3xl font-bold text-text-strong">{securityStatus.activeUsers}</div>
				<div class="text-sm text-text-muted mt-1">현재 접속 중인 사용자</div>
			</div>

			<div class="bg-surface-1 rounded-lg p-6 border border-border-subtle">
				<div class="flex items-center gap-3 mb-4">
					<Lock size={20} class="text-red-500" />
					<h3 class="text-lg font-semibold text-text-strong">실패한 로그인</h3>
				</div>
				<div class="text-3xl font-bold text-red-500">{securityStatus.failedLogins}</div>
				<div class="text-sm text-text-muted mt-1">최근 24시간</div>
			</div>
		</div>

		<!-- 최근 활동 -->
		<div class="bg-surface-1 rounded-lg p-6 border border-border-subtle">
			<h3 class="text-lg font-semibold text-text-strong mb-6 flex items-center gap-2">
				<Activity size={20} class="text-brand-pink" />
				최근 활동
			</h3>
			<div class="space-y-3">
				{#each activityLogs.slice(0, 5) as log (log.id)}
					{@const IconComponent = getLogTypeIcon(log.type)}
					<div class="flex items-center gap-3 text-sm p-3 bg-surface-2 rounded-lg border border-border-subtle">
						<IconComponent size={16} class="{getLogTypeColor(log.type)} flex-shrink-0" />
						<div class="flex-1 min-w-0">
							<div class="text-text-strong">{log.message}</div>
							{#if log.user || log.ip}
								<div class="text-xs text-text-muted mt-0.5">
									{#if log.user}
										<span>사용자: {log.user}</span>
									{/if}
									{#if log.ip}
										<span class="ml-2">IP: {log.ip}</span>
									{/if}
								</div>
							{/if}
						</div>
						<span class="text-xs text-text-muted flex-shrink-0">{formatTime(log.timestamp)}</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- 보안 설정 탭 -->
	{#if selectedTab === 'settings'}
		<div class="bg-surface-1 rounded-lg p-6 border border-border-subtle">
			<h3 class="text-lg font-semibold text-text-strong mb-6 flex items-center gap-2">
				<Settings size={20} class="text-brand-pink" />
				보안 설정
			</h3>
			<div class="space-y-4">
				{#each securityItems as item (item.id)}
					<div class="flex items-center justify-between p-4 bg-surface-2 rounded-lg border border-border-subtle hover:bg-surface-1 transition-colors">
						<div class="flex-1">
							<h4 class="text-sm font-medium text-text-strong mb-1">{item.title}</h4>
							<p class="text-xs text-text-muted">{item.description}</p>
						</div>
						<div class="flex items-center gap-3">
							<span class="badge-base {getStatusColor(item.status)}">
								{getStatusLabel(item.status)}
							</span>
							{#if item.canToggle}
								<label class="relative inline-flex items-center cursor-pointer">
									<input
										type="checkbox"
										checked={item.status === 'enabled'}
										onchange={() => toggleSecurityItem(item)}
										class="sr-only peer"
									/>
									<div class="w-11 h-6 bg-surface-1 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-pink rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-pink"></div>
								</label>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- 활동 로그 탭 -->
	{#if selectedTab === 'logs'}
		<div class="mb-6">
			<div class="flex gap-2">
				<button
					onclick={() => selectedLogFilter = 'all'}
					class="px-3 py-1.5 text-sm rounded-lg transition-colors {selectedLogFilter === 'all' ? 'bg-brand-pink text-white' : 'bg-surface-1 text-text-muted hover:text-text-strong'}"
					type="button"
				>
					전체
				</button>
				<button
					onclick={() => selectedLogFilter = 'success'}
					class="px-3 py-1.5 text-sm rounded-lg transition-colors {selectedLogFilter === 'success' ? 'bg-green-500 text-white' : 'bg-surface-1 text-text-muted hover:text-text-strong'}"
					type="button"
				>
					성공
				</button>
				<button
					onclick={() => selectedLogFilter = 'warning'}
					class="px-3 py-1.5 text-sm rounded-lg transition-colors {selectedLogFilter === 'warning' ? 'bg-yellow-500 text-white' : 'bg-surface-1 text-text-muted hover:text-text-strong'}"
					type="button"
				>
					경고
				</button>
				<button
					onclick={() => selectedLogFilter = 'error'}
					class="px-3 py-1.5 text-sm rounded-lg transition-colors {selectedLogFilter === 'error' ? 'bg-red-500 text-white' : 'bg-surface-1 text-text-muted hover:text-text-strong'}"
					type="button"
				>
					오류
				</button>
				<button
					onclick={() => selectedLogFilter = 'info'}
					class="px-3 py-1.5 text-sm rounded-lg transition-colors {selectedLogFilter === 'info' ? 'bg-blue-500 text-white' : 'bg-surface-1 text-text-muted hover:text-text-strong'}"
					type="button"
				>
					정보
				</button>
			</div>
		</div>

		<div class="bg-surface-1 rounded-lg p-6 border border-border-subtle">
			<h3 class="text-lg font-semibold text-text-strong mb-6 flex items-center gap-2">
				<FileText size={20} class="text-brand-pink" />
				활동 로그
			</h3>
			<div class="space-y-3">
				{#if filteredLogs.length === 0}
					<div class="text-center py-8 text-text-muted">
						<FileText size={48} class="mx-auto mb-2 opacity-50" />
						<p>로그가 없습니다.</p>
					</div>
				{:else}
					{#each filteredLogs as log (log.id)}
						{@const IconComponent = getLogTypeIcon(log.type)}
						<div class="flex items-start gap-3 p-4 bg-surface-2 rounded-lg border border-border-subtle hover:bg-surface-1 transition-colors">
							<IconComponent size={20} class="{getLogTypeColor(log.type)} flex-shrink-0 mt-0.5" />
							<div class="flex-1 min-w-0">
								<div class="text-sm text-text-strong mb-1">{log.message}</div>
								{#if log.user || log.ip}
									<div class="text-xs text-text-muted flex items-center gap-2">
										{#if log.user}
											<span class="flex items-center gap-1">
												<User size={12} />
												{log.user}
											</span>
										{/if}
										{#if log.ip}
											<span class="flex items-center gap-1">
												<Key size={12} />
												{log.ip}
											</span>
										{/if}
									</div>
								{/if}
							</div>
							<span class="text-xs text-text-muted flex-shrink-0 flex items-center gap-1">
								<Clock size={12} />
								{formatTime(log.timestamp)}
							</span>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	{/if}
</PageContent>
