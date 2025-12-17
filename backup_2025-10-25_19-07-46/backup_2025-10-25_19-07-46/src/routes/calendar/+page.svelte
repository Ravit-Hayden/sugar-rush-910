<script lang="ts">
	import { Calendar, Clock, Plus, CheckCircle } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';
	import SearchFilterBar from '$lib/components/SearchFilterBar.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';

	let searchQuery = '';
	let selectedFilter = 'all';

	let events = [
		{
			id: '1',
			title: 'Sugar Rush Vol.1 발매',
			date: '2024-12-31',
			time: '14:00',
			type: 'release',
			status: 'upcoming'
		},
		{
			id: '2',
			title: '마스터링 세션',
			date: '2024-10-15',
			time: '10:00',
			type: 'session',
			status: 'completed'
		},
		{
			id: '3',
			title: '팀 미팅',
			date: '2024-10-20',
			time: '15:00',
			type: 'meeting',
			status: 'upcoming'
		}
	];

	function getTypeColor(type: string) {
		switch (type) {
			case 'release': return 'badge-high-urgent';
			case 'session': return 'badge-info-blue';
			case 'meeting': return 'badge-low-green';
			default: return 'text-text-muted';
		}
	}

	function getTypeLabel(type: string) {
		switch (type) {
			case 'release': return '발매';
			case 'session': return '세션';
			case 'meeting': return '미팅';
			default: return '기타';
		}
	}

	function handleAddEvent() {
		console.log('새 일정 추가');
	}

	const typeOptions = [
		{ value: 'all', label: '모든 유형' },
		{ value: 'release', label: '발매' },
		{ value: 'session', label: '세션' },
		{ value: 'meeting', label: '미팅' }
	];

	const filteredEvents = events.filter(event => {
		const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesFilter = selectedFilter === 'all' || event.type === selectedFilter;
		return matchesSearch && matchesFilter;
	});
</script>

<PageContent>
	<PageHeader 
		title="일정·캘린더" 
		description="음악 프로젝트 일정을 관리하세요."
		actions={[
			{
				icon: Plus,
				label: '새 일정 추가',
				onclick: handleAddEvent
			}
		]}
	/>

	<!-- 검색 및 필터 -->
	<SearchFilterBar
		bind:searchQuery
		bind:selectedFilter
		searchPlaceholder="일정 제목 검색..."
		showFilter={true}
		filterOptions={typeOptions}
	/>

	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<!-- 이벤트 목록 -->
		<div class="lg:col-span-2">
			<div class="bg-surface-1 rounded-lg p-6 border border-border-subtle">
				<h3 class="text-lg font-semibold text-text-strong mb-6">다가오는 일정</h3>
				{#if filteredEvents.length > 0}
					<div class="space-y-4">
						{#each filteredEvents as event (event.id)}
						<div class="flex items-center gap-4 p-4 bg-surface-2 rounded-lg hover:bg-surface-1 transition-colors duration-200 border border-border-subtle">
							<div class="flex-shrink-0">
								<div class="w-12 h-12 bg-surface-1 rounded-lg flex items-center justify-center border border-border-subtle">
									<Calendar size={20} class="text-brand-pink" />
								</div>
							</div>
							<div class="flex-1 min-w-0">
								<h4 class="text-sm font-medium text-text-strong mb-1">{event.title}</h4>
								<div class="flex items-center gap-4 text-xs text-text-muted">
									<span class="flex items-center gap-1">
										<Clock size={12} />
										{event.date} {event.time}
									</span>
									<span class="badge-base {getTypeColor(event.type)}">
										{getTypeLabel(event.type)}
									</span>
								</div>
							</div>
							<div class="flex-shrink-0">
								{#if event.status === 'completed'}
									<CheckCircle size={16} class="text-green-500" />
								{:else}
									<div class="w-3 h-3 bg-brand-pink rounded-full"></div>
								{/if}
							</div>
						</div>
					{/each}
					</div>
				{:else}
					<EmptyState
						icon={Calendar}
						title="일정을 찾을 수 없습니다"
						description={searchQuery ? '검색 조건에 맞는 일정이 없습니다.' : '아직 일정이 없습니다.'}
						actionLabel="첫 번째 일정 추가"
						onAction={handleAddEvent}
					/>
				{/if}
			</div>
		</div>

		<!-- 캘린더 위젯 -->
		<div class="lg:col-span-1">
			<div class="bg-surface-1 rounded-lg p-6 border border-border-subtle">
				<h3 class="text-lg font-semibold text-text-strong mb-6">이번 달</h3>
				<div class="text-center">
					<div class="text-4xl font-bold text-brand-pink mb-2">31</div>
					<div class="text-sm text-text-muted">2024년 10월</div>
					<div class="mt-4 text-xs text-text-muted">
						<div class="flex items-center justify-center gap-2 mb-1">
							<div class="w-2 h-2 bg-brand-pink rounded-full"></div>
							<span>발매 예정</span>
						</div>
						<div class="flex items-center justify-center gap-2">
							<div class="w-2 h-2 bg-green-500 rounded-full"></div>
							<span>완료됨</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</PageContent>
