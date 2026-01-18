<script lang="ts">
	import { MessageSquare, Bell, User, Clock, CheckCircle, AlertCircle, Star, Reply, Archive, Trash2, Filter, Search, Edit } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';
	import SearchFilterBar from '$lib/components/SearchFilterBar.svelte';
	import MoreMenuDropdown from '$lib/components/MoreMenuDropdown.svelte';
	import { toast } from '$lib/stores/toast';

	let searchQuery = '';
	let selectedFilter = 'all';
	let selectedTab = 'feedback';
	let moreMenuOpenId = $state<string | null>(null);
	let editingFeedbackId = $state<string | null>(null);
	let editingTitle = $state('');
	let editingContent = $state('');
	let replyingFeedbackId = $state<string | null>(null);
	let replyContent = $state('');

	// 피드백 작성 상태
	let showNewFeedbackForm = $state(false);
	let newFeedbackTitle = $state('');
	let newFeedbackContent = $state('');
	let newFeedbackPriority = $state('medium');
	let newFeedbackRating = $state(5);
	let isSubmittingFeedback = $state(false);

	// 피드백 데이터
	let feedbacks = $state<any[]>([]);
	let loading = $state(true);

	// 시간 포맷팅 함수
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

	// 피드백 데이터 로드
	$effect(() => {
		(async () => {
			try {
				loading = true;
				const params = new URLSearchParams();
				if (selectedFilter !== 'all') {
					params.append('status', selectedFilter);
				}
				const response = await fetch(`/api/feedback?${params.toString()}&limit=1000`);
				const data = await response.json();
				if (data.ok) {
					feedbacks = (data.data || []).map((fb: any) => ({
						...fb,
						time: formatTime(fb.created_at)
					}));
				}
			} catch (error) {
				console.error('Failed to load feedbacks:', error);
			} finally {
				loading = false;
			}
		})();
		return () => {};
	});

	// 알림 데이터
	let notifications = $state<any[]>([]);
	let notificationsLoading = $state(true);

	// 알림 데이터 로드
	$effect(() => {
		if (selectedTab === 'notifications') {
			(async () => {
				try {
					notificationsLoading = true;
					const response = await fetch('/api/notifications?limit=1000');
					const data = await response.json();
					if (data.ok) {
						notifications = (data.data || []).map((notif: any) => ({
							...notif,
							time: formatTime(notif.created_at)
						}));
					}
				} catch (error) {
					console.error('Failed to load notifications:', error);
				} finally {
					notificationsLoading = false;
				}
			})();
		}
		return () => {};
	});

	// 알림 읽음 처리
	async function markAsRead(notificationId: string) {
		try {
			const response = await fetch('/api/notifications', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: notificationId, status: 'read' })
			});

			const data = await response.json();
			if (data.ok) {
				// 로컬 상태 업데이트
				notifications = notifications.map(n => 
					n.id === notificationId ? { ...n, status: 'read' } : n
				);
			}
		} catch (error) {
			console.error('Failed to mark notification as read:', error);
		}
	}

	function getStatusColor(status: string) {
		switch (status) {
			case 'unread': return 'badge-info-blue';
			case 'read': return 'text-text-muted';
			case 'replied': return 'badge-low-green';
			case 'archived': return 'badge-medium-yellow';
			default: return 'text-text-muted';
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
			case 'high': return 'badge-high-urgent';
			case 'medium': return 'badge-medium-yellow';
			case 'low': return 'badge-low-green';
			default: return 'text-text-muted';
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
			case 'feedback': return 'badge-high-urgent';
			case 'release': return 'badge-info-blue';
			case 'system': return 'badge-low-green';
			default: return 'text-text-muted';
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

	const filteredFeedbacks = $derived(feedbacks.filter(feedback => {
		const matchesSearch = feedback.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
							 feedback.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
							 feedback.from?.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesFilter = selectedFilter === 'all' || feedback.status === selectedFilter;
		return matchesSearch && matchesFilter;
	}));

	const unreadCount = $derived(feedbacks.filter(f => f.status === 'unread').length);
	const notificationUnreadCount = notifications.filter(n => n.status === 'unread').length;

	// 더보기 메뉴 토글
	function handleMoreMenuToggle(id: string) {
		moreMenuOpenId = moreMenuOpenId === id ? null : id;
	}

	function handleMoreMenuClose() {
		moreMenuOpenId = null;
	}

	// 피드백 수정 시작
	function handleEditStart(feedback: any) {
		editingFeedbackId = feedback.id;
		editingTitle = feedback.title || '';
		editingContent = feedback.content || '';
		moreMenuOpenId = null;
	}

	// 피드백 수정 취소
	function handleEditCancel() {
		editingFeedbackId = null;
		editingTitle = '';
		editingContent = '';
	}

	// 피드백 수정 저장
	async function handleEditSave(feedbackId: string) {
		if (!editingTitle.trim() || !editingContent.trim()) {
			toast.add('제목과 내용을 모두 입력해주세요.', 'error', 3000);
			return;
		}

		try {
			const response = await fetch('/api/feedback', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: feedbackId, title: editingTitle.trim(), content: editingContent.trim() })
			});
			const result = await response.json();
			if (!response.ok || !result.ok) {
				throw new Error(result.error?.message || '피드백 수정에 실패했습니다.');
			}

			// 로컬 상태 업데이트
			feedbacks = feedbacks.map(f => 
				f.id === feedbackId 
					? { ...f, title: editingTitle.trim(), content: editingContent.trim() }
					: f
			);
			toast.add('피드백이 수정되었습니다.', 'success', 3000);
			editingFeedbackId = null;
			editingTitle = '';
			editingContent = '';
		} catch (error) {
			console.error('피드백 수정 오류:', error);
			const errorMessage = error instanceof Error 
				? error.message 
				: '피드백 수정 중 오류가 발생했습니다.';
			toast.add(errorMessage, 'error', 5000);
		}
	}

	// 피드백 삭제
	async function handleDelete(feedbackId: string) {
		if (!confirm('이 피드백을 삭제하시겠습니까?')) {
			return;
		}

		try {
			const response = await fetch(`/api/feedback`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: feedbackId })
			});
			const result = await response.json();
			if (!response.ok || !result.ok) {
				throw new Error(result.error?.message || '피드백 삭제에 실패했습니다.');
			}

			// 목록에서 제거
			feedbacks = feedbacks.filter(f => f.id !== feedbackId);
			toast.add('피드백이 삭제되었습니다.', 'success', 3000);
		} catch (error) {
			console.error('피드백 삭제 오류:', error);
			const errorMessage = error instanceof Error 
				? error.message 
				: '피드백 삭제 중 오류가 발생했습니다.';
			toast.add(errorMessage, 'error', 5000);
		}
	}

	// 답변 시작
	function handleReplyStart(feedbackId: string) {
		replyingFeedbackId = feedbackId;
		replyContent = '';
	}

	// 답변 취소
	function handleReplyCancel() {
		replyingFeedbackId = null;
		replyContent = '';
	}

	// 답변 저장
	async function handleReplySave(feedbackId: string) {
		if (!replyContent.trim()) {
			toast.add('답변 내용을 입력해주세요.', 'error', 3000);
			return;
		}

		try {
			// TODO: API 답변 기능 구현 후 활성화
			// const response = await fetch('/api/feedback/reply', {
			// 	method: 'POST',
			// 	headers: { 'Content-Type': 'application/json' },
			// 	body: JSON.stringify({ id: feedbackId, reply: replyContent.trim() })
			// });
			// const result = await response.json();
			// if (!response.ok || !result.ok) {
			// 	throw new Error(result.error?.message || '답변 저장에 실패했습니다.');
			// }

			// 임시: 로컬 상태 업데이트
			feedbacks = feedbacks.map(f => 
				f.id === feedbackId 
					? { ...f, status: 'replied' }
					: f
			);
			toast.add('답변이 저장되었습니다. (API 구현 대기 중)', 'success', 3000);
			replyingFeedbackId = null;
			replyContent = '';
		} catch (error) {
			console.error('답변 저장 오류:', error);
			const errorMessage = error instanceof Error 
				? error.message 
				: '답변 저장 중 오류가 발생했습니다.';
			toast.add(errorMessage, 'error', 5000);
		}
	}

	// 보관 처리
	async function handleArchive(feedbackId: string) {
		try {
			const response = await fetch('/api/feedback', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: feedbackId, status: 'archived' })
			});
			const result = await response.json();
			if (!response.ok || !result.ok) {
				throw new Error(result.error?.message || '보관 처리에 실패했습니다.');
			}

			// 로컬 상태 업데이트
			feedbacks = feedbacks.map(f => 
				f.id === feedbackId 
					? { ...f, status: 'archived' }
					: f
			);
			toast.add('피드백이 보관되었습니다.', 'success', 3000);
		} catch (error) {
			console.error('보관 처리 오류:', error);
			const errorMessage = error instanceof Error 
				? error.message 
				: '보관 처리 중 오류가 발생했습니다.';
			toast.add(errorMessage, 'error', 5000);
		}
	}

	// 피드백 추가
	async function handleAddFeedback() {
		if (!newFeedbackTitle.trim() || !newFeedbackContent.trim()) {
			toast.add('제목과 내용을 모두 입력해주세요.', 'error', 3000);
			return;
		}

		if (isSubmittingFeedback) return;
		isSubmittingFeedback = true;

		try {
			const response = await fetch('/api/feedback', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					title: newFeedbackTitle.trim(),
					content: newFeedbackContent.trim(),
					from: 'El', // TODO: 실제 사용자 이름으로 교체
					avatar: 'E', // TODO: 실제 사용자 아바타로 교체
					status: 'unread',
					priority: newFeedbackPriority,
					rating: newFeedbackRating,
					tags: []
				})
			});

			const result = await response.json();

			if (!response.ok || !result.ok) {
				throw new Error(result.error?.message || '피드백 추가에 실패했습니다.');
			}

			// 목록에 새 피드백 추가 (맨 앞에)
			feedbacks = [{ ...result.data, time: formatTime(result.data.created_at) }, ...feedbacks];
			newFeedbackTitle = '';
			newFeedbackContent = '';
			newFeedbackPriority = 'medium';
			newFeedbackRating = 5;
			showNewFeedbackForm = false;
			toast.add('피드백이 추가되었습니다.', 'success', 3000);
		} catch (error) {
			console.error('피드백 추가 오류:', error);
			const errorMessage = error instanceof Error 
				? error.message 
				: '피드백 추가 중 오류가 발생했습니다.';
			toast.add(errorMessage, 'error', 5000);
		} finally {
			isSubmittingFeedback = false;
		}
	}

	function handleCancelNewFeedback() {
		newFeedbackTitle = '';
		newFeedbackContent = '';
		newFeedbackPriority = 'medium';
		newFeedbackRating = 5;
		showNewFeedbackForm = false;
	}

	// 알림 삭제
	async function handleDeleteNotification(notificationId: string) {
		if (!confirm('이 알림을 삭제하시겠습니까?')) {
			return;
		}

		try {
			// TODO: API DELETE 구현 후 활성화
			// const response = await fetch(`/api/notifications`, {
			// 	method: 'DELETE',
			// 	headers: { 'Content-Type': 'application/json' },
			// 	body: JSON.stringify({ id: notificationId })
			// });
			// const result = await response.json();
			// if (!response.ok || !result.ok) {
			// 	throw new Error(result.error?.message || '알림 삭제에 실패했습니다.');
			// }

			// 임시: 목록에서 제거
			notifications = notifications.filter(n => n.id !== notificationId);
			toast.add('알림이 삭제되었습니다.', 'success', 3000);
		} catch (error) {
			console.error('알림 삭제 오류:', error);
			const errorMessage = error instanceof Error 
				? error.message 
				: '알림 삭제 중 오류가 발생했습니다.';
			toast.add(errorMessage, 'error', 5000);
		}
	}
</script>

<div>
	<PageContent>
		<PageHeader 
			title="피드백·알림 센터" 
			description="사용자 피드백과 시스템 알림을 관리하세요."
		/>

		<!-- 탭 네비게이션 -->
		<div class="mb-8">
			<div class="border-b border-border-subtle">
				<nav class="-mb-px flex space-x-8">
					<button
						onclick={() => selectedTab = 'feedback'}
						class="py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 {selectedTab === 'feedback' ? 'border-brand-pink text-brand-pink' : 'border-transparent text-text-muted hover:text-text-strong hover:border-border-subtle'}"
						type="button"
					>
						<div class="flex items-center gap-2">
							<MessageSquare size={16} />
							피드백 ({feedbacks.length})
						</div>
					</button>
					<button
						onclick={() => selectedTab = 'notifications'}
						class="py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 {selectedTab === 'notifications' ? 'border-brand-pink text-brand-pink' : 'border-transparent text-text-muted hover:text-text-strong hover:border-border-subtle'}"
						type="button"
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
				<SearchFilterBar
					bind:searchQuery
					bind:selectedFilter
					searchPlaceholder="피드백 검색..."
					showFilter={true}
					filterOptions={[
						{ value: 'all', label: '모든 상태' },
						{ value: 'unread', label: '읽지 않음' },
						{ value: 'read', label: '읽음' },
						{ value: 'replied', label: '답변됨' },
						{ value: 'archived', label: '보관됨' }
					]}
				/>

				<!-- 피드백 작성 폼 -->
				<div class="mb-6">
					{#if !showNewFeedbackForm}
						<button
							type="button"
							onclick={() => showNewFeedbackForm = true}
							class="w-full px-4 py-3 bg-surface-1 border border-border-subtle rounded-lg hover:bg-surface-2 transition-colors duration-200 flex items-center justify-center gap-2 text-text-base"
						>
							<MessageSquare size={16} />
							<span class="font-medium">새 피드백 작성</span>
						</button>
					{:else}
						<div class="bg-surface-1 rounded-lg border border-border-subtle p-6">
							<h3 class="text-lg font-semibold text-text-strong mb-4">피드백 작성</h3>
							<div class="space-y-4">
								<!-- 제목 -->
								<div>
									<label for="new-feedback-title" class="block text-sm font-medium text-text-strong mb-2">
										제목
									</label>
									<input
										type="text"
										id="new-feedback-title"
										bind:value={newFeedbackTitle}
										placeholder="피드백 제목을 입력하세요"
										class="input-base w-full h-10 px-4 text-base placeholder:text-text-muted"
									/>
								</div>

								<!-- 내용 -->
								<div>
									<label for="new-feedback-content" class="block text-sm font-medium text-text-strong mb-2">
										내용
									</label>
									<textarea
										id="new-feedback-content"
										bind:value={newFeedbackContent}
										rows="4"
										placeholder="피드백 내용을 입력하세요"
										class="input-base w-full px-4 py-2 text-base placeholder:text-text-muted resize-none"
									></textarea>
								</div>

								<!-- 우선순위 -->
								<div>
									<label for="new-feedback-priority" class="block text-sm font-medium text-text-strong mb-2">
										우선순위
									</label>
									<select
										id="new-feedback-priority"
										bind:value={newFeedbackPriority}
										class="input-base w-full h-10 px-4 text-base"
									>
										<option value="low">낮음</option>
										<option value="medium">보통</option>
										<option value="high">높음</option>
									</select>
								</div>

								<!-- 평점 -->
								<div>
									<label for="new-feedback-rating" class="block text-sm font-medium text-text-strong mb-2">
										평점
									</label>
									<select
										id="new-feedback-rating"
										bind:value={newFeedbackRating}
										class="input-base w-full h-10 px-4 text-base"
									>
										<option value={1}>1</option>
										<option value={2}>2</option>
										<option value={3}>3</option>
										<option value={4}>4</option>
										<option value={5}>5</option>
									</select>
								</div>

								<!-- 버튼 -->
								<div class="flex items-center justify-end gap-3 pt-2">
									<button
										type="button"
										onclick={handleCancelNewFeedback}
										class="cancel-button px-4 py-2 bg-surface-2 text-text-base rounded-lg border border-border-subtle transition-colors duration-200 font-medium"
									>
										취소
									</button>
									<button
										type="button"
										onclick={handleAddFeedback}
										disabled={isSubmittingFeedback}
										class="px-4 py-2 bg-brand-pink text-white rounded-lg hover:bg-brand-pink/90 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{isSubmittingFeedback ? '추가 중...' : '피드백 추가'}
									</button>
								</div>
							</div>
						</div>
					{/if}
				</div>

				<!-- 피드백 목록 -->
				{#if loading}
					<div class="flex items-center justify-center py-12">
						<p class="text-text-muted">로딩 중...</p>
					</div>
				{:else}
				<div class="space-y-4">
					{#each filteredFeedbacks as feedback (feedback.id)}
						<div class="bg-surface-1 rounded-lg p-6 hover:bg-surface-2 transition-colors duration-200 border border-border-subtle">
							<div class="flex items-start gap-4">
								<!-- 아바타 -->
								<div class="flex-shrink-0">
									<div class="w-10 h-10 bg-brand-pink rounded-full flex items-center justify-center text-white font-medium">
										{feedback.avatar}
									</div>
								</div>

								<!-- 내용 -->
								<div class="flex-1 min-w-0">
									{#if editingFeedbackId === feedback.id}
										<!-- 수정 모드 -->
										<div class="space-y-3 mb-4">
											<input
												type="text"
												bind:value={editingTitle}
												placeholder="피드백 제목"
												class="input-base w-full h-10 px-4 text-base"
											/>
											<textarea
												bind:value={editingContent}
												rows="4"
												placeholder="피드백 내용"
												class="input-base w-full px-4 py-2 text-base resize-none"
											></textarea>
											<div class="flex items-center gap-2">
												<button
													type="button"
													onclick={() => handleEditSave(feedback.id)}
													class="px-3 py-1.5 text-sm bg-brand-pink text-white rounded-lg hover:bg-brand-pink/90 transition-colors duration-200 font-medium"
												>
													저장
												</button>
												<button
													type="button"
													onclick={handleEditCancel}
													class="px-3 py-1.5 text-sm bg-surface-2 text-text-base rounded-lg border border-border-subtle hover:bg-surface-1 transition-colors duration-200 font-medium"
												>
													취소
												</button>
											</div>
										</div>
									{:else}
										<!-- 보기 모드 -->
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
											<span class="badge-base {getPriorityColor(feedback.priority)}">
												{getPriorityLabel(feedback.priority)}
											</span>
											<!-- 상태 -->
											<span class="badge-base {getStatusColor(feedback.status)}">
												{getStatusLabel(feedback.status)}
											</span>
												<!-- 더보기 메뉴 -->
												<MoreMenuDropdown
													itemId={feedback.id}
													openId={moreMenuOpenId}
													items={[
														{
															label: '수정',
															icon: Edit,
															onClick: () => handleEditStart(feedback),
															ariaLabel: '피드백 수정'
														},
														{
															label: '삭제',
															icon: Trash2,
															onClick: () => handleDelete(feedback.id),
															ariaLabel: '피드백 삭제',
															danger: true,
															separator: true
														}
													]}
													onToggle={handleMoreMenuToggle}
													onClose={handleMoreMenuClose}
												/>
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

										<!-- 답변 영역 -->
										{#if replyingFeedbackId === feedback.id}
											<div class="mb-4 p-4 bg-surface-2 rounded-lg border border-border-subtle">
												<textarea
													bind:value={replyContent}
													rows="3"
													placeholder="답변을 입력하세요"
													class="input-base w-full px-3 py-2 text-sm resize-none mb-2"
												></textarea>
												<div class="flex items-center gap-2">
													<button
														type="button"
														onclick={() => handleReplySave(feedback.id)}
														class="px-3 py-1.5 text-sm bg-brand-pink text-white rounded-lg hover:bg-brand-pink/90 transition-colors duration-200 font-medium"
													>
														저장
													</button>
													<button
														type="button"
														onclick={handleReplyCancel}
														class="px-3 py-1.5 text-sm bg-surface-1 text-text-base rounded-lg border border-border-subtle hover:bg-surface-2 transition-colors duration-200 font-medium"
													>
														취소
													</button>
												</div>
											</div>
										{/if}

									<!-- 액션 버튼 -->
									<div class="flex items-center gap-2">
											<button 
												type="button"
												onclick={() => handleReplyStart(feedback.id)}
												class="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-brand-pink text-white rounded-lg hover:bg-brand-pink/90 transition-colors duration-200 font-medium"
											>
											<Reply size={14} />
											답변
										</button>
											<button 
												type="button"
												onclick={() => handleArchive(feedback.id)}
												class="cancel-button inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-surface-2 text-text-muted rounded-lg border border-border-subtle transition-colors duration-200 font-medium"
											>
											<Archive size={14} />
											보관
										</button>
									</div>
									{/if}
								</div>
							</div>
						</div>
					{/each}
				</div>
				{/if}

				<!-- 빈 상태 -->
				{#if !loading && filteredFeedbacks.length === 0}
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
			{#if notificationsLoading}
				<div class="flex items-center justify-center py-12">
					<p class="text-text-muted">로딩 중...</p>
				</div>
			{:else}
			<div class="space-y-4">
				{#each notifications as notification (notification.id)}
					<div class="bg-surface-1 rounded-lg p-4 hover:bg-surface-2 transition-colors duration-200 border border-border-subtle">
						<div class="flex items-start gap-3">
							<div class="flex-shrink-0">
								<div class="w-8 h-8 bg-surface-2 rounded-full flex items-center justify-center border border-border-subtle">
									<Bell size={16} class="text-brand-pink" />
								</div>
							</div>
							<div class="flex-1 min-w-0">
								<div class="flex items-start justify-between">
									<div class="flex-1">
										<h4 class="text-sm font-medium text-text-strong mb-1">{notification.title}</h4>
										<p class="text-sm text-text-muted mb-2">{notification.message}</p>
										<div class="flex items-center gap-2">
											<span class="badge-base {getNotificationTypeColor(notification.type)}">
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
											<button
												onclick={() => markAsRead(notification.id)}
												class="p-1 hover:bg-surface-2 rounded transition-colors duration-200"
												type="button"
												aria-label="읽음 처리"
											>
											<div class="w-2 h-2 bg-brand-pink rounded-full"></div>
											</button>
										{/if}
										<button 
											type="button"
											onclick={() => handleDeleteNotification(notification.id)}
											class="p-1 hover:bg-surface-2 rounded transition-colors duration-200"
											aria-label="알림 삭제"
										>
											<Trash2 size={14} class="text-text-muted" />
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
			{/if}

			<!-- 빈 상태 -->
			{#if !notificationsLoading && notifications.length === 0}
				<div class="text-center py-12">
					<Bell size={48} class="text-text-muted mx-auto mb-4" />
					<h3 class="text-lg font-semibold text-text-strong mb-2">알림이 없습니다</h3>
					<p class="text-text-muted">새로운 알림이 도착하면 여기에 표시됩니다.</p>
				</div>
			{/if}
		{/if}
	</PageContent>
</div>
