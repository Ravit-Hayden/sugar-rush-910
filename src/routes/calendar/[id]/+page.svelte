<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Calendar, Clock, Edit, Trash2, ArrowLeft, CheckCircle, AlertCircle, Users, FileText } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import { toast } from '$lib/stores/toast';

	const eventId = $derived($page.params.id);

	// 샘플 이벤트 데이터
	const events = [
		{
			id: '1',
			title: 'Sugar Rush Vol.1 발매',
			date: '2024-12-31',
			time: '14:00',
			type: 'release',
			status: 'upcoming',
			description: '첫 번째 정규 앨범 발매일입니다.',
			location: '온라인',
			participants: ['Sugar Rush', 'Production Team'],
			created_at: '2024-10-01'
		},
		{
			id: '2',
			title: 'Summer Night 싱글 발매',
			date: '2024-10-15',
			time: '18:00',
			type: 'release',
			status: 'completed',
			description: '여름 시즌 싱글 발매',
			location: '온라인',
			participants: ['Sugar Rush'],
			created_at: '2024-09-20'
		},
		{
			id: '3',
			title: '제작 미팅',
			date: '2024-11-20',
			time: '10:00',
			type: 'meeting',
			status: 'upcoming',
			description: '다음 앨범 제작에 대한 논의',
			location: '스튜디오',
			participants: ['Sugar Rush', 'Producer', 'Engineer'],
			created_at: '2024-10-15'
		},
		{
			id: '4',
			title: '녹음 세션',
			date: '2024-11-25',
			time: '14:00',
			type: 'session',
			status: 'upcoming',
			description: '신곡 녹음 세션',
			location: 'Recording Studio',
			participants: ['Sugar Rush', 'Engineer'],
			created_at: '2024-10-20'
		}
	];

	const event = $derived(events.find(e => e.id === eventId));

	function getTypeLabel(type: string) {
		switch (type) {
			case 'release': return '발매';
			case 'session': return '세션';
			case 'meeting': return '미팅';
			default: return '기타';
		}
	}

	function getStatusLabel(status: string) {
		switch (status) {
			case 'upcoming': return '예정';
			case 'in-progress': return '진행 중';
			case 'completed': return '완료';
			case 'cancelled': return '취소됨';
			default: return '알 수 없음';
		}
	}

	function getStatusColor(status: string) {
		switch (status) {
			case 'upcoming': return 'badge-info-blue';
			case 'in-progress': return 'badge-medium-yellow';
			case 'completed': return 'badge-low-green';
			case 'cancelled': return 'badge-high-urgent';
			default: return 'text-text-muted';
		}
	}

	function handleEdit() {
		goto(`/calendar/${eventId}/edit`);
	}

	function handleDelete() {
		if (confirm(`정말 "${event?.title || '이벤트'}"를 삭제하시겠습니까?`)) {
			toast.add('이벤트가 삭제되었습니다.', 'success');
			goto('/calendar');
		}
	}
</script>

{#if !event}
	<PageContent>
		<EmptyState 
			title="이벤트를 찾을 수 없습니다"
			description="요청하신 이벤트가 존재하지 않습니다."
			actionLabel="캘린더로 돌아가기"
			onAction={() => goto('/calendar')}
		/>
	</PageContent>
{:else}
	<PageContent>
		<PageHeader 
			title={event.title}
			description={getTypeLabel(event.type)}
			actions={[
				{
					icon: ArrowLeft,
					label: '목록으로',
					onclick: () => goto('/calendar')
				},
				{
					icon: Edit,
					label: '편집',
					onclick: handleEdit
				},
				{
					icon: Trash2,
					label: '삭제',
					onclick: handleDelete
				}
			]}
		/>

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<!-- 메인 정보 -->
			<div class="lg:col-span-2 space-y-6">
				<!-- 기본 정보 -->
				<div class="bg-surface-1 rounded-lg p-6 border border-border-subtle">
					<h3 class="text-lg font-semibold text-text-strong mb-4">기본 정보</h3>
					<div class="space-y-4">
						<div class="flex items-center gap-3">
							<Calendar size={20} class="text-text-muted" />
							<div>
								<div class="text-sm text-text-muted">날짜</div>
								<div class="text-text-strong">{event.date}</div>
							</div>
						</div>
						<div class="flex items-center gap-3">
							<Clock size={20} class="text-text-muted" />
							<div>
								<div class="text-sm text-text-muted">시간</div>
								<div class="text-text-strong">{event.time}</div>
							</div>
						</div>
						<div class="flex items-center gap-3">
							<FileText size={20} class="text-text-muted" />
							<div>
								<div class="text-sm text-text-muted">상태</div>
								<span class="badge-base {getStatusColor(event.status)}">
									{getStatusLabel(event.status)}
								</span>
							</div>
						</div>
					</div>
				</div>

				<!-- 설명 -->
				{#if event.description}
					<div class="bg-surface-1 rounded-lg p-6 border border-border-subtle">
						<h3 class="text-lg font-semibold text-text-strong mb-4">설명</h3>
						<p class="text-text-base whitespace-pre-wrap">{event.description}</p>
					</div>
				{/if}

				<!-- 참가자 -->
				{#if event.participants && event.participants.length > 0}
					<div class="bg-surface-1 rounded-lg p-6 border border-border-subtle">
						<h3 class="text-lg font-semibold text-text-strong mb-4 flex items-center gap-2">
							<Users size={20} />
							참가자
						</h3>
						<div class="flex flex-wrap gap-2">
							{#each event.participants as participant}
								<span class="px-3 py-1.5 bg-surface-2 rounded-lg text-sm text-text-strong border border-border-subtle">
									{participant}
								</span>
							{/each}
						</div>
					</div>
				{/if}
			</div>

			<!-- 사이드바 -->
			<div class="space-y-6">
				<!-- 액션 -->
				<div class="bg-surface-1 rounded-lg p-6 border border-border-subtle">
					<h3 class="text-lg font-semibold text-text-strong mb-4">액션</h3>
					<div class="space-y-3">
						<button
							onclick={handleEdit}
							class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-pink text-white rounded-lg hover:bg-brand-pink/90 transition-colors font-medium"
							type="button"
						>
							<Edit size={16} />
							편집
						</button>
						<button
							onclick={handleDelete}
							class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-surface-2 text-text-strong rounded-lg border border-border-subtle hover:bg-surface-1 transition-colors font-medium"
							type="button"
						>
							<Trash2 size={16} />
							삭제
						</button>
					</div>
				</div>

				<!-- 메타 정보 -->
				<div class="bg-surface-1 rounded-lg p-6 border border-border-subtle">
					<h3 class="text-lg font-semibold text-text-strong mb-4">메타 정보</h3>
					<div class="space-y-3 text-sm">
						<div class="flex justify-between">
							<span class="text-text-muted">생성일</span>
							<span class="text-text-strong">{event.created_at}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-text-muted">위치</span>
							<span class="text-text-strong">{event.location}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</PageContent>
{/if}
