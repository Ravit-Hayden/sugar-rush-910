<script lang="ts">
	import { Shield, Lock, Eye, AlertTriangle, CheckCircle, Key } from 'lucide-svelte';

	let securityStatus = {
		overall: 'good',
		lastScan: '2024-10-15 14:30',
		threats: 0,
		updates: 2
	};

	let securityItems = [
		{
			id: '1',
			title: '2단계 인증',
			status: 'enabled',
			description: '계정 보안을 위한 추가 인증 단계'
		},
		{
			id: '2',
			title: '비밀번호 정책',
			status: 'enabled',
			description: '강력한 비밀번호 요구사항 적용'
		},
		{
			id: '3',
			title: '로그 모니터링',
			status: 'enabled',
			description: '시스템 접근 로그 실시간 모니터링'
		},
		{
			id: '4',
			title: '데이터 암호화',
			status: 'enabled',
			description: '민감한 데이터 암호화 저장'
		}
	];

	function getStatusColor(status: string) {
		switch (status) {
			case 'enabled': return 'text-green-500 bg-green-500/10';
			case 'disabled': return 'text-red-500 bg-red-500/10';
			case 'warning': return 'text-yellow-500 bg-yellow-500/10';
			default: return 'text-gray-500 bg-gray-500/10';
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
</script>

<div class="py-6">
	<div class="max-w-7xl mx-auto">
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-text-strong mb-2">보안·운영 관리</h1>
			<p class="text-text-muted">시스템 보안 상태를 모니터링하고 관리하세요.</p>
		</div>

		<!-- 보안 상태 요약 -->
		<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
			<div class="bg-surface-2 rounded-lg p-6">
				<div class="flex items-center gap-3 mb-2">
					<Shield size={20} class="text-green-500" />
					<span class="text-sm font-medium text-text-muted">전체 상태</span>
				</div>
				<div class="text-2xl font-bold text-green-500">양호</div>
			</div>

			<div class="bg-surface-2 rounded-lg p-6">
				<div class="flex items-center gap-3 mb-2">
					<Eye size={20} class="text-brand-pink" />
					<span class="text-sm font-medium text-text-muted">마지막 스캔</span>
				</div>
				<div class="text-sm text-text-strong">{securityStatus.lastScan}</div>
			</div>

			<div class="bg-surface-2 rounded-lg p-6">
				<div class="flex items-center gap-3 mb-2">
					<AlertTriangle size={20} class="text-red-500" />
					<span class="text-sm font-medium text-text-muted">위협</span>
				</div>
				<div class="text-2xl font-bold text-red-500">{securityStatus.threats}</div>
			</div>

			<div class="bg-surface-2 rounded-lg p-6">
				<div class="flex items-center gap-3 mb-2">
					<Key size={20} class="text-yellow-500" />
					<span class="text-sm font-medium text-text-muted">업데이트</span>
				</div>
				<div class="text-2xl font-bold text-yellow-500">{securityStatus.updates}</div>
			</div>
		</div>

		<!-- 보안 설정 -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<div class="bg-surface-2 rounded-lg p-6">
				<h3 class="text-lg font-semibold text-text-strong mb-6 flex items-center gap-2">
					<Lock size={20} class="text-brand-pink" />
					보안 설정
				</h3>
				<div class="space-y-4">
					{#each securityItems as item (item.id)}
						<div class="flex items-center justify-between p-4 bg-surface-1 rounded-lg">
							<div class="flex-1">
								<h4 class="text-sm font-medium text-text-strong mb-1">{item.title}</h4>
								<p class="text-xs text-text-muted">{item.description}</p>
							</div>
							<span class="px-2 py-1 text-xs font-medium rounded-full {getStatusColor(item.status)}">
								{getStatusLabel(item.status)}
							</span>
						</div>
					{/each}
				</div>
			</div>

			<div class="bg-surface-2 rounded-lg p-6">
				<h3 class="text-lg font-semibold text-text-strong mb-6 flex items-center gap-2">
					<CheckCircle size={20} class="text-green-500" />
					최근 활동
				</h3>
				<div class="space-y-3">
					<div class="flex items-center gap-3 text-sm">
						<CheckCircle size={16} class="text-green-500" />
						<span class="text-text-strong">보안 스캔 완료</span>
						<span class="text-text-muted ml-auto">2시간 전</span>
					</div>
					<div class="flex items-center gap-3 text-sm">
						<CheckCircle size={16} class="text-green-500" />
						<span class="text-text-strong">로그인 성공</span>
						<span class="text-text-muted ml-auto">4시간 전</span>
					</div>
					<div class="flex items-center gap-3 text-sm">
						<AlertTriangle size={16} class="text-yellow-500" />
						<span class="text-text-strong">의심스러운 활동 감지</span>
						<span class="text-text-muted ml-auto">1일 전</span>
					</div>
					<div class="flex items-center gap-3 text-sm">
						<CheckCircle size={16} class="text-green-500" />
						<span class="text-text-strong">시스템 업데이트 완료</span>
						<span class="text-text-muted ml-auto">3일 전</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
