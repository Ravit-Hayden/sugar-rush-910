<script lang="ts">
	import { Calendar, Clock, Plus, CheckCircle } from 'lucide-svelte';

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
			case 'release': return 'text-brand-pink bg-brand-pink/10';
			case 'session': return 'text-blue-500 bg-blue-500/10';
			case 'meeting': return 'text-green-500 bg-green-500/10';
			default: return 'text-gray-500 bg-gray-500/10';
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
</script>

<div>
	<div class="w-full">
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
			<div>
				<h1 class="text-3xl font-bold text-text-strong mb-2">일정·캘린더</h1>
				<p class="text-text-muted">음악 프로젝트 일정을 관리하세요.</p>
			</div>
			<button class="inline-flex items-center gap-2 px-4 py-2 bg-brand-pink text-white rounded-md hover:bg-brand-pink/90 transition-colors">
				<Plus size={16} />
				새 일정 추가
			</button>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<!-- 이벤트 목록 -->
			<div class="lg:col-span-2">
				<div class="bg-surface-2 rounded-lg p-6">
					<h3 class="text-lg font-semibold text-text-strong mb-6">다가오는 일정</h3>
					<div class="space-y-4">
						{#each events as event (event.id)}
							<div class="flex items-center gap-4 p-4 bg-surface-1 rounded-lg hover:bg-surface-2 transition-colors">
								<div class="flex-shrink-0">
									<div class="w-12 h-12 bg-surface-2 rounded-lg flex items-center justify-center">
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
										<span class="px-2 py-1 rounded-full text-xs {getTypeColor(event.type)}">
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
				</div>
			</div>

			<!-- 캘린더 위젯 -->
			<div class="lg:col-span-1">
				<div class="bg-surface-2 rounded-lg p-6">
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
	</div>
</div>
