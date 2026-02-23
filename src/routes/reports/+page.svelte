<script lang="ts">
	import { Download, FileText, FileJson, Calendar } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';
	import DatePicker from '$lib/components/DatePicker.svelte';

	// 리포트 설정
	let reportType = $state<'financial' | 'revenue' | 'expense'>('financial');
	let reportFormat = $state<'json' | 'csv'>('csv');
	let startDate = $state('');
	let endDate = $state('');
	let generating = $state(false);

	// 날짜 범위 설정
	const currentDate = new Date();
	const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
	const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

	// 기본값 설정
	$effect(() => {
		if (!startDate) {
			startDate = firstDayOfMonth.toISOString().split('T')[0];
		}
		if (!endDate) {
			endDate = lastDayOfMonth.toISOString().split('T')[0];
		}
		return () => {};
	});

	// 리포트 생성 및 다운로드
	async function generateReport() {
		if (generating) return;

		generating = true;
		try {
			const params = new URLSearchParams({
				type: reportType,
				format: reportFormat,
				startDate: startDate || '',
				endDate: endDate || ''
			});

			const response = await fetch(`/api/reports?${params.toString()}`);
			
			if (!response.ok) {
				throw new Error('리포트 생성에 실패했습니다.');
			}

			// 파일 다운로드
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			
			const contentDisposition = response.headers.get('content-disposition');
			if (contentDisposition) {
				const filenameMatch = contentDisposition.match(/filename="(.+)"/);
				if (filenameMatch) {
					a.download = filenameMatch[1];
				}
			} else {
				const extension = reportFormat === 'csv' ? 'csv' : 'json';
				a.download = `report_${reportType}_${new Date().toISOString().split('T')[0]}.${extension}`;
			}
			
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Failed to generate report:', error);
			alert('리포트 생성 중 오류가 발생했습니다.');
		} finally {
			generating = false;
		}
	}
</script>

<svelte:head>
	<title>리포트 생성</title>
</svelte:head>

<PageContent>
	<PageHeader 
		title="리포트 생성"
		description="수익 및 지출 데이터를 리포트로 내보냅니다"
	/>

	<!-- 리포트 생성 폼 -->
	<div class="bg-surface-1 rounded-lg border border-border-subtle overflow-hidden">
		<div class="p-6 space-y-6">
			<!-- 리포트 유형 -->
			<div role="group" aria-labelledby="report-type-label">
				<span id="report-type-label" class="block text-sm font-medium text-text-strong mb-3">
					리포트 유형
				</span>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-3">
					<button
						type="button"
						onclick={() => reportType = 'financial'}
						class="p-4 border-2 rounded-lg transition-all duration-200 {reportType === 'financial' ? 'border-brand-pink bg-brand-pink/10' : 'border-border-subtle hover:border-hover-point'}"
					>
						<div class="text-sm font-medium text-text-strong mb-1">통합 리포트</div>
						<div class="text-xs text-text-muted">수익 + 지출</div>
					</button>
					<button
						type="button"
						onclick={() => reportType = 'revenue'}
						class="p-4 border-2 rounded-lg transition-all duration-200 {reportType === 'revenue' ? 'border-brand-pink bg-brand-pink/10' : 'border-border-subtle hover:border-hover-point'}"
					>
						<div class="text-sm font-medium text-text-strong mb-1">수익 리포트</div>
						<div class="text-xs text-text-muted">수익만</div>
					</button>
					<button
						type="button"
						onclick={() => reportType = 'expense'}
						class="p-4 border-2 rounded-lg transition-all duration-200 {reportType === 'expense' ? 'border-brand-pink bg-brand-pink/10' : 'border-border-subtle hover:border-hover-point'}"
					>
						<div class="text-sm font-medium text-text-strong mb-1">지출 리포트</div>
						<div class="text-xs text-text-muted">지출만</div>
					</button>
				</div>
			</div>

			<!-- 파일 형식 -->
			<div role="group" aria-labelledby="report-format-label">
				<span id="report-format-label" class="block text-sm font-medium text-text-strong mb-3">
					파일 형식
				</span>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
					<button
						type="button"
						onclick={() => reportFormat = 'csv'}
						class="p-4 border-2 rounded-lg transition-all duration-200 flex items-center gap-3 {reportFormat === 'csv' ? 'border-brand-pink bg-brand-pink/10' : 'border-border-subtle hover:border-hover-point'}"
					>
						<FileText size={20} class={reportFormat === 'csv' ? 'text-brand-pink' : 'text-text-muted'} />
						<div class="text-left">
							<div class="text-sm font-medium text-text-strong">CSV</div>
							<div class="text-xs text-text-muted">스프레드시트 호환</div>
						</div>
					</button>
					<button
						type="button"
						onclick={() => reportFormat = 'json'}
						class="p-4 border-2 rounded-lg transition-all duration-200 flex items-center gap-3 {reportFormat === 'json' ? 'border-brand-pink bg-brand-pink/10' : 'border-border-subtle hover:border-hover-point'}"
					>
						<FileJson size={20} class={reportFormat === 'json' ? 'text-brand-pink' : 'text-text-muted'} />
						<div class="text-left">
							<div class="text-sm font-medium text-text-strong">JSON</div>
							<div class="text-xs text-text-muted">데이터 처리용</div>
						</div>
					</button>
				</div>
			</div>

			<!-- 날짜 범위 -->
			<div role="group" aria-labelledby="report-date-range-label">
				<span id="report-date-range-label" class="block text-sm font-medium text-text-strong mb-3">
					날짜 범위
				</span>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label for="start-date" class="block text-xs font-medium text-text-strong mb-2">
							시작일
						</label>
						<DatePicker id="start-date" bind:value={startDate} />
					</div>
					<div>
						<label for="end-date" class="block text-xs font-medium text-text-strong mb-2">
							종료일
						</label>
						<DatePicker id="end-date" bind:value={endDate} />
					</div>
				</div>
			</div>

			<!-- 생성 버튼 -->
			<div class="pt-4 border-t border-border-subtle">
				<button
					type="button"
					onclick={generateReport}
					disabled={generating || !startDate || !endDate}
					class="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-pink text-white rounded-lg hover:bg-brand-pink/90 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<Download size={20} />
					{generating ? '생성 중...' : '리포트 다운로드'}
				</button>
			</div>
		</div>
	</div>
</PageContent>
