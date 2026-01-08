<script lang="ts">
	import { Heart, Users, MessageSquare, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';

	// 프로젝트 데이터 (향후 API 연동)
	let projects = $state([
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
	]);

	// 코멘트 데이터
	let comments = $state<any[]>([]);
	let commentsLoading = $state(true);

	// 코멘트 데이터 로드
	$effect(() => {
		(async () => {
			try {
				commentsLoading = true;
				const response = await fetch('/api/comments?limit=10');
				const data = await response.json();
				if (data.ok) {
					comments = data.data || [];
				}
			} catch (error) {
				console.error('Failed to load comments:', error);
			} finally {
				commentsLoading = false;
			}
		})();
		return () => {};
	});

	function getStatusColor(status: string) {
		switch (status) {
			case 'active': return 'badge-info-blue';
			case 'review': return 'badge-medium-yellow';
			case 'completed': return 'badge-low-green';
			default: return 'text-text-muted';
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

<PageContent>
	<PageHeader 
		title="제작·협업 보드" 
		description="팀과 함께 음악 프로젝트를 관리하고 협업하세요."
	/>

	<!-- 프로젝트 카드들 -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
		{#each projects as project (project.id)}
			<div class="bg-surface-1 rounded-lg p-6 hover:bg-surface-2 transition-colors duration-200 border border-border-subtle">
				<div class="flex items-start justify-between mb-4">
					<h3 class="text-lg font-semibold text-text-strong">{project.name}</h3>
					<span class="badge-base {getStatusColor(project.status)}">
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
						<div class="w-full bg-surface-2 rounded-full h-2">
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
		<div class="bg-surface-1 rounded-lg p-6 border border-border-subtle">
			<h3 class="text-lg font-semibold text-text-strong mb-4 flex items-center gap-2">
				<MessageSquare size={20} class="text-brand-pink" />
				최근 코멘트
			</h3>
			{#if commentsLoading}
				<div class="flex items-center justify-center py-8">
					<p class="text-text-muted">로딩 중...</p>
				</div>
			{:else if comments.length > 0}
				<div class="space-y-4">
					{#each comments.slice(0, 5) as comment}
						<div class="flex items-start gap-3">
							<div class="w-8 h-8 bg-surface-2 rounded-full flex items-center justify-center border border-border-subtle">
								<MessageSquare size={16} class="text-brand-pink" />
							</div>
							<div class="flex-1">
								<p class="text-sm text-text-strong">{comment.content}</p>
								<p class="text-xs text-text-muted">
									{new Date(comment.created_at).toLocaleString('ko-KR', { 
										year: 'numeric', 
										month: 'short', 
										day: 'numeric',
										hour: '2-digit',
										minute: '2-digit'
									})} • {comment.user_name || 'Unknown'}
								</p>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-text-muted text-center py-8">코멘트가 없습니다.</p>
			{/if}
		</div>

		<div class="bg-surface-1 rounded-lg p-6 border border-border-subtle">
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
</PageContent>
