<script lang="ts">
	import { Heart, Users, MessageSquare, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-svelte';

	let projects = [
		{
			id: '1',
			name: 'Sugar Rush Vol.1',
			status: 'active',
			members: 4,
			lastActivity: '2시간 전',
			progress: 85,
			deadline: '2024-12-31'
		},
		{
			id: '2',
			name: 'Summer Night Single',
			status: 'review',
			members: 2,
			lastActivity: '1일 전',
			progress: 95,
			deadline: '2024-10-15'
		},
		{
			id: '3',
			name: 'Demo Collection',
			status: 'completed',
			members: 3,
			lastActivity: '3일 전',
			progress: 100,
			deadline: '2024-09-30'
		}
	];

	function getStatusColor(status: string) {
		switch (status) {
			case 'active': return 'text-blue-500 bg-blue-500/10';
			case 'review': return 'text-yellow-500 bg-yellow-500/10';
			case 'completed': return 'text-green-500 bg-green-500/10';
			default: return 'text-gray-500 bg-gray-500/10';
		}
	}

	function getStatusLabel(status: string) {
		switch (status) {
			case 'active': return '진행 중';
			case 'review': return '검토 중';
			case 'completed': return '완료';
			default: return '알 수 없음';
		}
	}
</script>

<div class="py-6">
	<div class="max-w-7xl mx-auto">
		<!-- 헤더 -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-text-strong mb-2">제작·협업 보드</h1>
			<p class="text-text-muted">팀과 함께 음악 프로젝트를 관리하고 협업하세요.</p>
		</div>

		<!-- 프로젝트 카드들 -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
			{#each projects as project (project.id)}
				<div class="bg-surface-2 rounded-lg p-6 hover:bg-surface-1 transition-colors">
					<div class="flex items-start justify-between mb-4">
						<h3 class="text-lg font-semibold text-text-strong">{project.name}</h3>
						<span class="px-2 py-1 text-xs font-medium rounded-full {getStatusColor(project.status)}">
							{getStatusLabel(project.status)}
						</span>
					</div>

					<div class="space-y-3">
						<!-- 진행률 -->
						<div>
							<div class="flex items-center justify-between text-sm mb-1">
								<span class="text-text-muted">진행률</span>
								<span class="text-text-strong">{project.progress}%</span>
							</div>
							<div class="w-full bg-surface-1 rounded-full h-2">
								<div 
									class="bg-brand-pink h-2 rounded-full transition-all duration-300" 
									style="width: {project.progress}%"
								></div>
							</div>
						</div>

						<!-- 멤버 수 -->
						<div class="flex items-center gap-2 text-sm text-text-muted">
							<Users size={16} />
							<span>{project.members}명 참여</span>
						</div>

						<!-- 마지막 활동 -->
						<div class="flex items-center gap-2 text-sm text-text-muted">
							<Clock size={16} />
							<span>{project.lastActivity}</span>
						</div>

						<!-- 마감일 -->
						<div class="flex items-center gap-2 text-sm text-text-muted">
							<Calendar size={16} />
							<span>{project.deadline}</span>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- 최근 활동 -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<div class="bg-surface-2 rounded-lg p-6">
				<h3 class="text-lg font-semibold text-text-strong mb-4 flex items-center gap-2">
					<MessageSquare size={20} class="text-brand-pink" />
					최근 활동
				</h3>
				<div class="space-y-4">
					<div class="flex items-start gap-3">
						<div class="w-8 h-8 bg-brand-pink/10 rounded-full flex items-center justify-center">
							<CheckCircle size={16} class="text-brand-pink" />
						</div>
						<div class="flex-1">
							<p class="text-sm text-text-strong">Sugar Rush Vol.1 마스터링 완료</p>
							<p class="text-xs text-text-muted">2시간 전 • El</p>
						</div>
					</div>
					<div class="flex items-start gap-3">
						<div class="w-8 h-8 bg-yellow-500/10 rounded-full flex items-center justify-center">
							<AlertCircle size={16} class="text-yellow-500" />
						</div>
						<div class="flex-1">
							<p class="text-sm text-text-strong">Summer Night 가사 검토 필요</p>
							<p class="text-xs text-text-muted">1일 전 • Otte</p>
						</div>
					</div>
					<div class="flex items-start gap-3">
						<div class="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
							<CheckCircle size={16} class="text-green-500" />
						</div>
						<div class="flex-1">
							<p class="text-sm text-text-strong">Demo Collection 프로젝트 완료</p>
							<p class="text-xs text-text-muted">3일 전 • System</p>
						</div>
					</div>
				</div>
			</div>

			<div class="bg-surface-2 rounded-lg p-6">
				<h3 class="text-lg font-semibold text-text-strong mb-4 flex items-center gap-2">
					<Users size={20} class="text-brand-pink" />
					팀 멤버
				</h3>
				<div class="space-y-3">
					<div class="flex items-center gap-3">
						<div class="w-8 h-8 bg-brand-pink rounded-full flex items-center justify-center">
							<span class="text-sm font-medium text-white">E</span>
						</div>
						<div>
							<p class="text-sm font-medium text-text-strong">El</p>
							<p class="text-xs text-text-muted">프로듀서</p>
						</div>
					</div>
					<div class="flex items-center gap-3">
						<div class="w-8 h-8 bg-hover-cyan rounded-full flex items-center justify-center">
							<span class="text-sm font-medium text-black">O</span>
						</div>
						<div>
							<p class="text-sm font-medium text-text-strong">Otte</p>
							<p class="text-xs text-text-muted">작사가</p>
						</div>
					</div>
					<div class="flex items-center gap-3">
						<div class="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
							<span class="text-sm font-medium text-white">M</span>
						</div>
						<div>
							<p class="text-sm font-medium text-text-strong">Mixer</p>
							<p class="text-xs text-text-muted">믹싱 엔지니어</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
