<script lang="ts">
	import { MessageSquare, Bell, User, Clock, CheckCircle, AlertCircle, Star, Reply, Archive, Trash2, Filter, Search } from 'lucide-svelte';

	let searchQuery = '';
	let selectedFilter = 'all';
	let selectedTab = 'feedback';

	let feedbacks = [
		{
			id: '1',
			title: '새로운 앨범 컨셉에 대한 피드백',
			from: 'El',
			avatar: 'E',
			time: '1시간 전',
			status: 'unread',
			priority: 'high',
			content: 'Sugar Rush Vol.2의 컨셉에 대해 몇 가지 제안이 있습니다. 현재 방향이 좋지만, 좀 더 실험적인 요소를 추가하면 어떨까요?',
			rating: 5,
			tags: ['앨범', '컨셉', '제안']
		},
		{
			id: '2',
			title: '마케팅 전략 개선 제안',
			from: 'Otte',
			avatar: 'O',
			time: '3시간 전',
			status: 'read',
			priority: 'medium',
			content: '현재 마케팅 전략이 효과적이지만, 소셜 미디어 활용도를 높이면 더 좋을 것 같습니다.',
			rating: 4,
			tags: ['마케팅', '소셜미디어']
		},
		{
			id: '3',
			title: '사용자 인터페이스 개선 요청',
			from: 'Mixer',
			avatar: 'M',
			time: '1일 전',
			status: 'replied',
			priority: 'low',
			content: '업로드 페이지의 사용자 경험을 개선할 수 있는 방법이 있을까요?',
			rating: 3,
			tags: ['UI/UX', '업로드']
		},
		{
			id: '4',
			title: '음질 개선 관련 문의',
			from: 'Producer',
			avatar: 'P',
			time: '2일 전',
			status: 'archived',
			priority: 'medium',
			content: '최근 업로드된 트랙들의 음질이 이전보다 향상된 것 같습니다. 어떤 기술을 사용하셨나요?',
			rating: 5,
			tags: ['음질', '기술']
		}
	];

	let notifications = [
		{
			id: '1',
			title: '새로운 피드백이 도착했습니다',
			message: 'El님이 새로운 피드백을 남겼습니다.',
			time: '5분 전',
			status: 'unread',
			type: 'feedback'
		},
		{
			id: '2',
			title: '앨범 발매 일정 알림',
			message: 'Sugar Rush Vol.1 발매가 3일 남았습니다.',
			time: '1시간 전',
			status: 'read',
			type: 'release'
		},
		{
			id: '3',
			title: '시스템 업데이트 완료',
			message: '보안 업데이트가 성공적으로 완료되었습니다.',
			time: '3시간 전',
			status: 'read',
			type: 'system'
		}
	];

	function getStatusColor(status: string) {
		switch (status) {
			case 'unread': return 'text-blue-500 bg-blue-500/10';
			case 'read': return 'text-gray-500 bg-gray-500/10';
			case 'replied': return 'text-green-500 bg-green-500/10';
			case 'archived': return 'text-yellow-500 bg-yellow-500/10';
			default: return 'text-gray-500 bg-gray-500/10';
		}
	}

	function getStatusLabel(status: string) {
		switch (status) {
			case 'unread': return '읽지 않음';
			case 'read': return '읽음';
			case 'replied': return '답변됨';
			case 'archived': return '보관됨';
			default: return '알 수 없음';
		}
	}

	function getPriorityColor(priority: string) {
		switch (priority) {
			case 'high': return 'text-red-500 bg-red-500/10';
			case 'medium': return 'text-yellow-500 bg-yellow-500/10';
			case 'low': return 'text-green-500 bg-green-500/10';
			default: return 'text-gray-500 bg-gray-500/10';
		}
	}

	function getPriorityLabel(priority: string) {
		switch (priority) {
			case 'high': return '높음';
			case 'medium': return '보통';
			case 'low': return '낮음';
			default: return '알 수 없음';
		}
	}

	function getNotificationTypeColor(type: string) {
		switch (type) {
			case 'feedback': return 'text-brand-pink bg-brand-pink/10';
			case 'release': return 'text-blue-500 bg-blue-500/10';
			case 'system': return 'text-green-500 bg-green-500/10';
			default: return 'text-gray-500 bg-gray-500/10';
		}
	}

	function getNotificationTypeLabel(type: string) {
		switch (type) {
			case 'feedback': return '피드백';
			case 'release': return '발매';
			case 'system': return '시스템';
			default: return '기타';
		}
	}

	const filteredFeedbacks = feedbacks.filter(feedback => {
		const matchesSearch = feedback.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
							 feedback.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
							 feedback.from.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesFilter = selectedFilter === 'all' || feedback.status === selectedFilter;
		return matchesSearch && matchesFilter;
	});

	const unreadCount = feedbacks.filter(f => f.status === 'unread').length;
	const notificationUnreadCount = notifications.filter(n => n.status === 'unread').length;
</script>

<div class="py-6">
	<div class="max-w-7xl mx-auto">
		<!-- 헤더 -->
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
			<div>
				<h1 class="text-3xl font-bold text-text-strong mb-2">피드백·알림 센터</h1>
				<p class="text-text-muted">사용자 피드백과 시스템 알림을 관리하세요.</p>
			</div>
			<div class="flex items-center gap-2">
				<span class="text-sm text-text-muted">읽지 않은 피드백: {unreadCount}개</span>
				<span class="text-sm text-text-muted">읽지 않은 알림: {notificationUnreadCount}개</span>
			</div>
		</div>

		<!-- 탭 네비게이션 -->
		<div class="mb-8">
			<div class="border-b border-border-subtle">
				<nav class="-mb-px flex space-x-8">
					<button
						onclick={() => selectedTab = 'feedback'}
						class="py-2 px-1 border-b-2 font-medium text-sm transition-colors {selectedTab === 'feedback' ? 'border-brand-pink text-brand-pink' : 'border-transparent text-text-muted hover:text-text-strong hover:border-border-subtle'}"
					>
						<div class="flex items-center gap-2">
							<MessageSquare size={16} />
							피드백 ({feedbacks.length})
						</div>
					</button>
					<button
						onclick={() => selectedTab = 'notifications'}
						class="py-2 px-1 border-b-2 font-medium text-sm transition-colors {selectedTab === 'notifications' ? 'border-brand-pink text-brand-pink' : 'border-transparent text-text-muted hover:text-text-strong hover:border-border-subtle'}"
					>
						<div class="flex items-center gap-2">
							<Bell size={16} />
							알림 ({notifications.length})
						</div>
					</button>
				</nav>
			</div>
		</div>

		{#if selectedTab === 'feedback'}
			<!-- 피드백 섹션 -->
			<div class="mb-8">
				<!-- 검색 및 필터 -->
				<div class="flex flex-col sm:flex-row gap-4 mb-6">
					<div class="flex-1 relative">
						<Search size={16} class="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
						<input 
							type="text" 
							placeholder="피드백 검색..."
							bind:value={searchQuery}
							class="w-full pl-10 pr-4 py-2 bg-surface-2 border border-border-subtle rounded-md text-text-strong placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent"
						/>
					</div>
					<select 
						bind:value={selectedFilter}
						class="px-4 py-2 bg-surface-2 border border-border-subtle rounded-md text-text-strong focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent"
					>
						<option value="all">모든 상태</option>
						<option value="unread">읽지 않음</option>
						<option value="read">읽음</option>
						<option value="replied">답변됨</option>
						<option value="archived">보관됨</option>
					</select>
				</div>

				<!-- 피드백 목록 -->
				<div class="space-y-4">
					{#each filteredFeedbacks as feedback (feedback.id)}
						<div class="bg-surface-2 rounded-lg p-6 hover:bg-surface-1 transition-colors {feedback.status === 'unread' ? 'ring-2 ring-brand-pink/20' : ''}">
							<div class="flex items-start gap-4">
								<!-- 아바타 -->
								<div class="flex-shrink-0">
									<div class="w-10 h-10 bg-brand-pink rounded-full flex items-center justify-center text-white font-medium">
										{feedback.avatar}
									</div>
								</div>

								<!-- 내용 -->
								<div class="flex-1 min-w-0">
									<div class="flex items-start justify-between mb-2">
										<div class="flex-1">
											<h3 class="text-lg font-semibold text-text-strong mb-1">{feedback.title}</h3>
											<div class="flex items-center gap-2 text-sm text-text-muted mb-2">
												<span>{feedback.from}</span>
												<span>•</span>
												<span class="flex items-center gap-1">
													<Clock size={12} />
													{feedback.time}
												</span>
											</div>
										</div>
										<div class="flex items-center gap-2">
											<!-- 우선순위 -->
											<span class="px-2 py-1 text-xs font-medium rounded-full {getPriorityColor(feedback.priority)}">
												{getPriorityLabel(feedback.priority)}
											</span>
											<!-- 상태 -->
											<span class="px-2 py-1 text-xs font-medium rounded-full {getStatusColor(feedback.status)}">
												{getStatusLabel(feedback.status)}
											</span>
										</div>
									</div>

									<!-- 평점 -->
									<div class="flex items-center gap-1 mb-3">
										{#each Array(5) as _, i}
											<Star 
												size={14} 
												class="{i < feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}" 
											/>
										{/each}
										<span class="text-sm text-text-muted ml-2">({feedback.rating}/5)</span>
									</div>

									<!-- 내용 -->
									<p class="text-text-muted mb-4 line-clamp-2">{feedback.content}</p>

									<!-- 태그 -->
									<div class="flex flex-wrap gap-2 mb-4">
										{#each feedback.tags as tag}
											<span class="px-2 py-1 bg-surface-1 text-xs text-text-muted rounded">
												{tag}
											</span>
										{/each}
									</div>

									<!-- 액션 버튼 -->
									<div class="flex items-center gap-2">
										<button class="inline-flex items-center gap-1 px-3 py-1 text-sm bg-brand-pink text-white rounded hover:bg-brand-pink/90 transition-colors">
											<Reply size={14} />
											답변
										</button>
										<button class="inline-flex items-center gap-1 px-3 py-1 text-sm bg-surface-1 text-text-muted rounded hover:bg-surface-2 transition-colors">
											<Archive size={14} />
											보관
										</button>
										<button class="inline-flex items-center gap-1 px-3 py-1 text-sm bg-red-500/10 text-red-500 rounded hover:bg-red-500/20 transition-colors">
											<Trash2 size={14} />
											삭제
										</button>
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>

				<!-- 빈 상태 -->
				{#if filteredFeedbacks.length === 0}
					<div class="text-center py-12">
						<MessageSquare size={48} class="text-text-muted mx-auto mb-4" />
						<h3 class="text-lg font-semibold text-text-strong mb-2">피드백을 찾을 수 없습니다</h3>
						<p class="text-text-muted">
							{searchQuery ? '검색 조건에 맞는 피드백이 없습니다.' : '아직 피드백이 없습니다.'}
						</p>
					</div>
				{/if}
			</div>
		{:else if selectedTab === 'notifications'}
			<!-- 알림 섹션 -->
			<div class="space-y-4">
				{#each notifications as notification (notification.id)}
					<div class="bg-surface-2 rounded-lg p-4 hover:bg-surface-1 transition-colors {notification.status === 'unread' ? 'ring-2 ring-brand-pink/20' : ''}">
						<div class="flex items-start gap-3">
							<div class="flex-shrink-0">
								<div class="w-8 h-8 bg-surface-1 rounded-full flex items-center justify-center">
									<Bell size={16} class="text-brand-pink" />
								</div>
							</div>
							<div class="flex-1 min-w-0">
								<div class="flex items-start justify-between">
									<div class="flex-1">
										<h4 class="text-sm font-medium text-text-strong mb-1">{notification.title}</h4>
										<p class="text-sm text-text-muted mb-2">{notification.message}</p>
										<div class="flex items-center gap-2">
											<span class="px-2 py-1 text-xs font-medium rounded-full {getNotificationTypeColor(notification.type)}">
												{getNotificationTypeLabel(notification.type)}
											</span>
											<span class="text-xs text-text-muted flex items-center gap-1">
												<Clock size={12} />
												{notification.time}
											</span>
										</div>
									</div>
									<div class="flex items-center gap-1">
										{#if notification.status === 'unread'}
											<div class="w-2 h-2 bg-brand-pink rounded-full"></div>
										{/if}
										<button class="p-1 hover:bg-surface-1 rounded transition-colors">
											<Trash2 size={14} class="text-text-muted" />
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<!-- 빈 상태 -->
			{#if notifications.length === 0}
				<div class="text-center py-12">
					<Bell size={48} class="text-text-muted mx-auto mb-4" />
					<h3 class="text-lg font-semibold text-text-strong mb-2">알림이 없습니다</h3>
					<p class="text-text-muted">새로운 알림이 도착하면 여기에 표시됩니다.</p>
				</div>
			{/if}
		{/if}
	</div>
</div>
