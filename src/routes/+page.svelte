<script lang="ts">
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
	import FinancialStatsCard from '$lib/components/cards/FinancialStatsCard.svelte';

	// 목 데이터 — 카드당 리스트 4개 꽉 차게
	const tasks = [
		{ id: '1', title: '앨범 커버 디자인 검토', priority: true, completed: false, due: 'today', overdue: false },
		{ id: '2', title: '트랙 마스터링 완료', priority: false, completed: false, due: 'tomorrow', overdue: false },
		{ id: '3', title: '발매 일정 확정', priority: true, completed: false, due: 'yesterday', overdue: true },
		{ id: '4', title: '아트워크 최종 검수', priority: false, completed: false, due: 'today', overdue: false }
	];

	const deadlines = [
		{ id: '1', label: 'Sugar Rush Vol.1 발매', days: 3, week: true, urgent: true, scheduled: true },
		{ id: '2', label: '마케팅 캠페인 마감', days: 7, week: true, urgent: false, scheduled: false },
		{ id: '3', label: '음원 플랫폼 업로드', days: 1, week: false, urgent: true, scheduled: true },
		{ id: '4', label: 'EP 컴필레이션 마감', days: 14, week: true, urgent: false, scheduled: true }
	];

	const failures = [
		{ id: '1', text: 'CDN 업로드 실패', retryable: true, status: 'failed' },
		{ id: '2', text: '데이터베이스 연결 오류', retryable: true, status: 'retrying' },
		{ id: '3', text: '권한 검증 실패', retryable: false, status: 'blocked' },
		{ id: '4', text: '메일 발송 타임아웃', retryable: true, status: 'failed' }
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
		{ id: '3', text: 'API 엔드포인트 추가', recent: true, today: true, thisWeek: true, thisMonth: true, time: '3시간 전' },
		{ id: '4', text: '트랙 아트워크 교체', recent: true, today: true, thisWeek: true, thisMonth: true, time: '45분 전' }
	];

	const feedback = [
		{ id: '1', text: '새로운 앨범 컨셉에 대한 피드백', from: 'El', time: '1시간 전' },
		{ id: '2', text: '마케팅 전략 개선 제안', from: 'Otte', time: '3시간 전' },
		{ id: '3', text: '음질 마스터링 리뷰 요청', from: 'El', time: '5시간 전' },
		{ id: '4', text: '발매일 조정 관련 의견', from: 'Otte', time: '어제' }
	];

	const releases = [
		{ id: '1', title: 'Sugar Rush Vol.1', when: '14:00' },
		{ id: '2', title: 'Single: Summer Night', when: '18:00' },
		{ id: '3', title: 'EP: Midnight Drive', when: '20:00' },
		{ id: '4', title: '컴필레이션 Vol.2', when: '내일 12:00' }
	];

	const logs = [
		{ id: '1', text: '사용자 로그인: El', time: '10분 전' },
		{ id: '2', text: '앨범 업로드 완료: Sugar Rush Vol.1', time: '1시간 전' },
		{ id: '3', text: '시스템 백업 완료', time: '2시간 전' },
		{ id: '4', text: 'API 배포: v2.1.0', time: '3시간 전' }
	];

	const kpi = [
		{ name: '수익', points: [{ x: 1, y: 100 }, { x: 2, y: 150 }] },
		{ name: '발매', points: [{ x: 1, y: 5 }, { x: 2, y: 8 }] }
	];
</script>

<!-- 대시보드: Main 12-col grid 규격 (반응형 <md 1열, md~<lg 2열, ≥lg 3열) -->
<div class="pt-0 pb-6 bg-bg text-text-base">
		<!-- 헤더 -->
		<div class="mb-8 mt-1.5">
			<h1 class="text-3xl font-bold text-text-strong mb-2">대시보드</h1>
			<p class="text-text-muted">전체 시스템 현황과 주요 지표를 확인하세요.</p>
		</div>

		<div class="grid grid-cols-12 gap-6">
			<!-- 일반 카드: col-span-12 / md:col-span-6 / lg:col-span-4 -->
			<div class="col-span-12 md:col-span-6 lg:col-span-4">
				<TasksCard {tasks} />
			</div>
			<div class="col-span-12 md:col-span-6 lg:col-span-4">
				<CountdownCard {deadlines} />
			</div>
			<div class="col-span-12 md:col-span-6 lg:col-span-4">
				<FailuresCard {failures} />
			</div>
			<div class="col-span-12 md:col-span-6 lg:col-span-4">
				<StatusCard {status} />
			</div>
			<div class="col-span-12 md:col-span-6 lg:col-span-4">
				<ChangesCard {changes} />
			</div>
			<div class="col-span-12 md:col-span-6 lg:col-span-4">
				<FeedbackCard {feedback} />
			</div>
			<div class="col-span-12 md:col-span-6 lg:col-span-4">
				<ReleasesCard {releases} />
			</div>
			<div class="col-span-12 md:col-span-6 lg:col-span-4">
				<ActionsCard />
			</div>
			<div class="col-span-12 md:col-span-6 lg:col-span-4">
				<LogsCard {logs} />
			</div>

			<!-- 수익/지출 통계: 2열 1칸(9번 카드와 한 행), 3열 전체 -->
			<div class="col-span-12 md:col-span-6 lg:col-span-12">
				<FinancialStatsCard />
			</div>

			<!-- KPI: 항상 전체 폭 (카드 높이만큼만 행 확보) -->
			<div class="col-span-12">
				<KpiCard {kpi} />
			</div>
		</div>
</div>