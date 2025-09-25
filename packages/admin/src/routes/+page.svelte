<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
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
</script>

<svelte:head>
	<title>대시보드 - Sugar Rush Admin</title>
</svelte:head>

<Header />
<Sidebar />

<main class="ml-[240px] px-6 pt-16 min-h-screen bg-bg">
	<div class="grid grid-cols-12 gap-4 py-6">
		<!-- Row 1: 즉시 처리(내 작업) -->
		<div class="col-span-12 md:col-span-6 lg:col-span-4">
			<TasksCard />
		</div>
		<div class="col-span-12 md:col-span-6 lg:col-span-4">
			<CountdownCard />
		</div>
		<div class="col-span-12 md:col-span-6 lg:col-span-4">
			<FailuresCard />
		</div>

		<!-- Row 2: 운영 스냅샷 -->
		<div class="col-span-12 md:col-span-6 lg:col-span-4">
			<StatusCard />
		</div>
		<div class="col-span-12 md:col-span-6 lg:col-span-4">
			<ChangesCard />
		</div>
		<div class="col-span-12 md:col-span-6 lg:col-span-4">
			<FeedbackCard />
		</div>

		<!-- Row 3: 당일 중심 일정 -->
		<div class="col-span-12 md:col-span-6 lg:col-span-4">
			<ReleasesCard />
		</div>
		<div class="col-span-12 md:col-span-6 lg:col-span-4">
			<ActionsCard />
		</div>
		<div class="col-span-12 md:col-span-6 lg:col-span-4">
			<LogsCard />
		</div>

		<!-- Row 4: KPI 그래프(전체 너비) -->
		<div class="col-span-12">
			<KpiCard />
		</div>
	</div>
</main>
