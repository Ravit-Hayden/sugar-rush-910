<script lang="ts">
	import { onMount } from 'svelte';
	import TasksCard from '$lib/components/cards/TasksCard.svelte';
	import CountdownCard from '$lib/components/cards/CountdownCard.svelte';
	import FailuresCard from '$lib/components/cards/FailuresCard.svelte';
	import StatusCard from '$lib/components/cards/StatusCard.svelte';
	import ChangesCard from '$lib/components/cards/ChangesCard.svelte';
	import FeedbackCard from '$lib/components/cards/FeedbackCard.svelte';
	import ReleasesCard from '$lib/components/cards/ReleasesCard.svelte';
	import ActionsCard from '$lib/components/cards/ActionsCard.svelte';
	import LogsCard from '$lib/components/cards/LogsCard.svelte';
	import KpiCard from '$lib/components/cards/KpiCard.svelte';
	import SearchResultsMain from '$lib/components/SearchResultsMain.svelte';

	// 검색 상태
	let searchQuery = '';
	let searchResults: { id: string; title: string; type: string; href: string }[] = [];
	let showSearchResults = false;

	// 검색 상태 변경 이벤트 리스너
	onMount(() => {
		const handleSearchChange = (event: CustomEvent) => {
			searchQuery = event.detail.query;
			searchResults = event.detail.results;
			showSearchResults = event.detail.show;
		};

		window.addEventListener('search-change', handleSearchChange as EventListener);
		return () => {
			window.removeEventListener('search-change', handleSearchChange as EventListener);
		};
	});

	// 검색 초기화
	function clearSearch() {
		searchQuery = '';
		searchResults = [];
		showSearchResults = false;
		// Header 컴포넌트에 검색 초기화 알림
		window.dispatchEvent(new CustomEvent('search-clear'));
	}

	// 목 데이터
	const tasks = [
		{ id: '1', title: '앨범 커버 디자인 검토', priority: true, completed: false, due: 'today', overdue: false },
		{ id: '2', title: '트랙 마스터링 완료', priority: false, completed: false, due: 'tomorrow', overdue: false },
		{ id: '3', title: '발매 일정 확정', priority: true, completed: false, due: 'yesterday', overdue: true }
	];

	const deadlines = [
		{ id: '1', label: 'Sugar Rush Vol.1 발매', days: 3, week: true, urgent: true, scheduled: true },
		{ id: '2', label: '마케팅 캠페인 마감', days: 7, week: true, urgent: false, scheduled: false },
		{ id: '3', label: '음원 플랫폼 업로드', days: 1, week: false, urgent: true, scheduled: true }
	];

	const failures = [
		{ id: '1', text: 'CDN 업로드 실패', retryable: true, status: 'failed' },
		{ id: '2', text: '데이터베이스 연결 오류', retryable: true, status: 'retrying' },
		{ id: '3', text: '권한 검증 실패', retryable: false, status: 'blocked' }
	];

	const status = [
		{ key: 'API 서버', value: 'OK' },
		{ key: '데이터베이스', value: 'OK' },
		{ key: 'CDN', value: 'Warning' },
		{ key: '이메일 서비스', value: 'OK' }
	];

	const changes = [
		{ id: '1', text: '앨범 메타데이터 업데이트', recent: true, today: true, thisWeek: true, thisMonth: true, time: '2시간 전' },
		{ id: '2', text: '사용자 권한 정책 변경', recent: false, today: false, thisWeek: true, thisMonth: true, time: '1일 전' },
		{ id: '3', text: 'API 엔드포인트 추가', recent: true, today: true, thisWeek: true, thisMonth: true, time: '3시간 전' }
	];

	const feedback = [
		{ id: '1', text: '새로운 앨범 컨셉에 대한 피드백', from: 'El', time: '1시간 전' },
		{ id: '2', text: '마케팅 전략 개선 제안', from: 'Otte', time: '3시간 전' }
	];

	const releases = [
		{ id: '1', title: 'Sugar Rush Vol.1', when: '14:00' },
		{ id: '2', title: 'Single: Summer Night', when: '18:00' }
	];

	const logs = [
		{ id: '1', text: '사용자 로그인: El', time: '10분 전' },
		{ id: '2', text: '앨범 업로드 완료: Sugar Rush Vol.1', time: '1시간 전' },
		{ id: '3', text: '시스템 백업 완료', time: '2시간 전' }
	];

	const kpi = [
		{ name: '수익', points: [{ x: 1, y: 100 }, { x: 2, y: 150 }] },
		{ name: '발매', points: [{ x: 1, y: 5 }, { x: 2, y: 8 }] }
	];
</script>

{#if showSearchResults}
	<!-- 검색 결과 표시 -->
	<SearchResultsMain 
		results={searchResults} 
		query={searchQuery} 
		onClear={clearSearch} 
	/>
{:else}
	<!-- 기본 대시보드 -->
	<div class="py-6">
		<div class="grid grid-cols-12 gap-4">
			<!-- Row 1 -->
			<div class="col-span-12 md:col-span-6 lg:col-span-4">
				<TasksCard {tasks} />
			</div>
			<div class="col-span-12 md:col-span-6 lg:col-span-4">
				<CountdownCard {deadlines} />
			</div>
			<div class="col-span-12 md:col-span-6 lg:col-span-4">
				<FailuresCard {failures} />
			</div>

			<!-- Row 2 -->
			<div class="col-span-12 md:col-span-6 lg:col-span-4">
				<StatusCard {status} />
			</div>
			<div class="col-span-12 md:col-span-6 lg:col-span-4">
				<ChangesCard {changes} />
			</div>
			<div class="col-span-12 md:col-span-6 lg:col-span-4">
				<FeedbackCard {feedback} />
			</div>

			<!-- Row 3 -->
			<div class="col-span-12 md:col-span-6 lg:col-span-4">
				<ReleasesCard {releases} />
			</div>
			<div class="col-span-12 md:col-span-6 lg:col-span-4">
				<ActionsCard />
			</div>
			<div class="col-span-12 md:col-span-6 lg:col-span-4">
				<LogsCard {logs} />
			</div>

			<!-- Row 4 - KPI (풀폭) -->
			<div class="col-span-12">
				<KpiCard {kpi} />
			</div>
		</div>
	</div>
{/if}
