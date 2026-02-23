<script lang="ts">
	import { goto } from '$app/navigation';
	import { ArrowLeft, Upload, FileSpreadsheet, Loader2, Check } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageContent from '$lib/components/PageContent.svelte';
	import { toast } from '$lib/stores/toast';

	type MusicSprayRow = { settlementDate: string; platform: string; amount: number; currency: string; title?: string };
	type MusicSpraySummary = {
		settlementDate: string;
		revenue: { label: string; amount: number };
		expenses: { label: string; amount: number }[];
	};

	let fileInput: HTMLInputElement;
	let formatType = $state<'music-spray' | 'generic'>('music-spray');
	/** Music Spray: 상세(곡별) 반영 vs 정산 요약(수익 1건 + 지출 2건) 반영 */
	let musicSprayImportMode = $state<'detail' | 'summary'>('detail');
	let file = $state<File | null>(null);
	let parsing = $state(false);
	let importing = $state(false);
	let musicSprayData = $state<MusicSprayRow[] | null>(null);
	let musicSpraySummary = $state<MusicSpraySummary | null>(null);
	/** 요약 금액이 0원일 때 서버가 보내주는 원본 셀 그리드 (디버그용) */
	let musicSprayDebugGrid = $state<{ sheetName: string; grid: string[][] } | null>(null);
	let parseError = $state<string | null>(null);
	let parsed = $state<{ fileName: string; sheets: { name: string; headers: string[]; rows: Record<string, unknown>[] }[] } | null>(null);
	let selectedSheetIndex = $state(0);
	let platformKey = $state('');
	let amountKey = $state('');
	let dateKey = $state('');
	let typeKey = $state('');
	let statementMonth = $state('');
	let applyRevenue = $state(true);
	let applyExpense = $state(true);

	const currentSheet = $derived(
		parsed?.sheets?.[selectedSheetIndex] ?? null
	);
	const currentHeaders = $derived(currentSheet?.headers ?? []);
	const previewRows = $derived((currentSheet?.rows ?? []).slice(0, 20));
	const isMusicSprayDetailReady = $derived(formatType === 'music-spray' && musicSprayData != null && musicSprayData.length > 0);
	const isMusicSpraySummaryReady = $derived(
		formatType === 'music-spray' &&
			musicSpraySummary != null &&
			(musicSpraySummary.revenue?.amount > 0 || (musicSpraySummary.expenses?.length ?? 0) > 0)
	);
	const isMusicSprayReady = $derived(
		musicSprayImportMode === 'detail' ? isMusicSprayDetailReady : isMusicSpraySummaryReady
	);
	const isGenericReady = $derived(formatType === 'generic' && parsed?.sheets?.[selectedSheetIndex] && amountKey);

	async function handleFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const f = target.files?.[0];
		if (!f) return;
		const { MAX_FILE_SIZE_BYTES, getFileSizeErrorMessage } = await import('$lib/constants/upload');
		if (f.size > MAX_FILE_SIZE_BYTES) {
			parseError = getFileSizeErrorMessage();
			file = null;
			parsed = null;
			musicSprayData = null;
			musicSpraySummary = null;
			musicSprayDebugGrid = null;
			platformKey = '';
			amountKey = '';
			dateKey = '';
			typeKey = '';
			selectedSheetIndex = 0;
			target.value = '';
			return;
		}
		file = f;
		parsed = null;
		musicSprayData = null;
		musicSpraySummary = null;
		musicSprayDebugGrid = null;
		parseError = null;
		platformKey = '';
		amountKey = '';
		dateKey = '';
		typeKey = '';
		selectedSheetIndex = 0;

		parsing = true;
		try {
			const form = new FormData();
			form.append('file', f);

			if (formatType === 'music-spray') {
				const res = await fetch('/api/statements/parse-music-spray', { method: 'POST', body: form });
				type ParseResponse = { ok: boolean; data?: { detail: MusicSprayRow[]; summary: MusicSpraySummary | null; debugGrid?: { sheetName: string; grid: string[][] } }; error?: { message?: string } };
				let data: ParseResponse;
				try {
					data = (await res.json()) as ParseResponse;
				} catch {
					throw new Error(res.ok ? '응답 형식 오류입니다.' : `서버 오류 (${res.status}). 다시 시도해 주세요.`);
				}
				if (!data.ok) throw new Error(data.error?.message || 'Music Spray 엑셀 파싱에 실패했습니다.');
				const rows = data.data?.detail ?? [];
				const summary = data.data?.summary ?? null;
				musicSprayData = rows;
				musicSpraySummary = summary;
				musicSprayDebugGrid = data.data?.debugGrid ?? null;
				const hasSummary = summary && (summary.revenue?.amount > 0 || (summary.expenses?.length ?? 0) > 0);
				if (rows.length === 0 && hasSummary) {
					musicSprayImportMode = 'summary';
				} else {
					musicSprayImportMode = 'detail';
				}
				if (rows.length > 0 && rows[0].settlementDate) {
					statementMonth = rows[0].settlementDate.slice(0, 7);
				} else if (summary?.settlementDate) {
					statementMonth = summary.settlementDate.slice(0, 7);
				} else {
					statementMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
				}
			} else {
			const res = await fetch('/api/statements/parse', { method: 'POST', body: form });
			type ParsedSheets = { fileName: string; sheets: { name: string; headers: string[]; rows: Record<string, unknown>[] }[] };
			const data = (await res.json()) as { ok: boolean; data?: ParsedSheets | null; error?: { message?: string } };
			if (!data.ok) throw new Error(data.error?.message || '엑셀 파싱에 실패했습니다.');
			parsed = data.data ?? null;
			statementMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
			if (parsed?.sheets?.length && parsed.sheets[0].headers.length) {
				const headers = parsed.sheets[0].headers;
				amountKey = headers.find((h: string) => /금액|amount|수익|정산/.test(h)) || headers[0] || '';
				platformKey = headers.find((h: string) => /플랫폼|platform|서비스/.test(h)) || headers[0] || '';
				dateKey = headers.find((h: string) => /날짜|date|기간|월/.test(h)) || '';
				typeKey = headers.find((h: string) => /구분|type|수수료|유형/.test(h)) || '';
			}
			}
		} catch (err) {
			const msg = err instanceof Error ? err.message : '엑셀을 읽는 중 오류가 발생했습니다.';
			parseError = msg;
			musicSprayData = null;
			musicSpraySummary = null;
			toast.add(msg, 'error', 5000);
		} finally {
			parsing = false;
		}
	}

	async function handleImport() {
		if (formatType === 'music-spray') {
			if (musicSprayImportMode === 'summary') {
				if (!musicSpraySummary || (musicSpraySummary.revenue?.amount <= 0 && (musicSpraySummary.expenses?.length ?? 0) === 0)) {
					toast.add('반영할 요약 데이터가 없습니다.', 'error', 3000);
					return;
				}
				importing = true;
				try {
					const res = await fetch('/api/statements/import', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ format: 'music-spray-summary', summary: musicSpraySummary })
					});
					const data = (await res.json()) as { ok: boolean; data?: { revenueCount?: number; expenseCount?: number }; error?: { message?: string } };
					if (!data.ok) throw new Error(data.error?.message || '반영에 실패했습니다.');
					const { revenueCount = 0, expenseCount = 0 } = data.data ?? {};
					toast.add(`수익 ${revenueCount}건, 지출 ${expenseCount}건 반영되었습니다.`, 'success', 4000);
					goto('/revenue');
				} catch (err) {
					toast.add(err instanceof Error ? err.message : '반영 중 오류가 발생했습니다.', 'error', 5000);
				} finally {
					importing = false;
				}
				return;
			}
			if (!musicSprayData?.length) {
				toast.add('반영할 데이터가 없습니다.', 'error', 3000);
				return;
			}
			importing = true;
			try {
				const res = await fetch('/api/statements/import', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ format: 'music-spray', data: musicSprayData })
				});
				const data = (await res.json()) as { ok: boolean; data?: { revenueCount?: number }; error?: { message?: string } };
				if (!data.ok) throw new Error(data.error?.message || '반영에 실패했습니다.');
				const { revenueCount } = data.data ?? {};
				toast.add(`수익 ${revenueCount ?? 0}건 반영되었습니다.`, 'success', 4000);
				goto('/revenue');
			} catch (err) {
				toast.add(err instanceof Error ? err.message : '반영 중 오류가 발생했습니다.', 'error', 5000);
			} finally {
				importing = false;
			}
			return;
		}

		if (!parsed?.sheets?.[selectedSheetIndex] || !amountKey) {
			toast.add('금액 컬럼을 선택해주세요.', 'error', 3000);
			return;
		}
		const month = statementMonth.trim() || new Date().toISOString().slice(0, 7);
		importing = true;
		try {
			const res = await fetch('/api/statements/import', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					statementMonth: month,
					rows: currentSheet?.rows ?? [],
					platformKey: platformKey || undefined,
					amountKey,
					dateKey: dateKey || undefined,
					typeKey: typeKey || undefined,
					applyRevenue,
					applyExpense
				})
			});
			const data = (await res.json()) as { ok: boolean; data?: { revenueCount?: number; expenseCount?: number }; error?: { message?: string } };
			if (!data.ok) throw new Error(data.error?.message || '반영에 실패했습니다.');
			const { revenueCount, expenseCount } = data.data ?? {};
			toast.add(
				`수익 ${revenueCount ?? 0}건, 지출 ${expenseCount ?? 0}건 반영되었습니다.`,
				'success',
				4000
			);
			goto('/revenue');
		} catch (err) {
			toast.add(err instanceof Error ? err.message : '반영 중 오류가 발생했습니다.', 'error', 5000);
		} finally {
			importing = false;
		}
	}

	function reset() {
		file = null;
		parsed = null;
		musicSprayData = null;
		musicSpraySummary = null;
		musicSprayDebugGrid = null;
		parseError = null;
		fileInput?.value && (fileInput.value = '');
	}

	const canImport = $derived(formatType === 'music-spray' ? isMusicSprayReady : isGenericReady);

	let previewBlock = $state<HTMLElement | undefined>(undefined);
	$effect(() => {
		const hasMusicSprayData =
			formatType === 'music-spray' &&
			(musicSprayData?.length || (musicSpraySummary && (musicSpraySummary.revenue?.amount > 0 || (musicSpraySummary.expenses?.length ?? 0) > 0)));
		if (hasMusicSprayData && previewBlock) {
			import('svelte').then(({ tick }) => {
				tick().then(() => previewBlock?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
			});
		}
	});
</script>

<PageContent>
	<PageHeader
		title="정산 엑셀 가져오기"
		description="업체에서 받은 월별 정산 엑셀을 업로드하면 수익·지출에 자동 반영됩니다."
		actions={[{ label: '수익 관리', href: '/revenue', icon: ArrowLeft }]}
	/>

	<div class="max-w-2xl space-y-8">
		<!-- 0. 형식 선택 -->
		<div class="card-base bg-surface-1 rounded-lg border border-border-subtle p-6">
			<h2 class="text-lg font-semibold text-text-strong mb-4">0. 정산 형식</h2>
			<div class="flex flex-wrap gap-4">
				<label class="inline-flex items-center gap-2 cursor-pointer">
					<input type="radio" name="format" value="music-spray" bind:group={formatType} class="rounded-full border-border-subtle" />
					<span class="text-text-base">Music Spray (음원유통정산내역)</span>
				</label>
				<label class="inline-flex items-center gap-2 cursor-pointer">
					<input type="radio" name="format" value="generic" bind:group={formatType} class="rounded-full border-border-subtle" />
					<span class="text-text-base">일반 엑셀 (컬럼 매핑)</span>
				</label>
			</div>
		</div>

		<!-- 1. 파일 선택 -->
		<div class="card-base bg-surface-1 rounded-lg border border-border-subtle p-6">
			<h2 class="text-lg font-semibold text-text-strong mb-4">1. 엑셀 파일 선택</h2>
			<div class="flex flex-wrap items-center gap-4">
				<input
					bind:this={fileInput}
					type="file"
					accept=".xlsx,.xls"
					class="hidden"
					onchange={handleFileChange}
				/>
				<button
					type="button"
					onclick={() => fileInput?.click()}
					class="page-header-action-button page-header-primary-button inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 font-medium disabled:opacity-50 border border-transparent"
					disabled={parsing}
				>
					{#if parsing}
						<Loader2 size={18} class="animate-spin" />
						파싱 중...
					{:else}
						<Upload size={18} />
						파일 선택
					{/if}
				</button>
				{#if file}
					<span class="text-sm text-text-base flex items-center gap-2">
						<FileSpreadsheet size={16} class="text-text-muted" />
						{file.name}
					</span>
					<button type="button" class="text-sm text-text-muted hover:text-text-base" onclick={reset}>취소</button>
				{/if}
			</div>
			<p class="text-sm text-text-muted mt-3">
				{#if parsing}
					파싱 중입니다. 잠시 후 아래에 미리보기가 나타납니다.
				{:else if parseError}
					<span class="text-danger-fg">{parseError}</span> 다른 파일을 선택하거나 형식을 확인해 주세요.
				{:else if formatType === 'music-spray' && file && musicSprayData?.length === 0 && !(musicSpraySummary && (musicSpraySummary.revenue?.amount > 0 || (musicSpraySummary.expenses?.length ?? 0) > 0))}
					파싱된 행이 없습니다. Music Spray(음원유통정산내역) 형식의 엑셀인지 확인해 주세요.
				{:else if formatType === 'music-spray' && (musicSprayData?.length || (musicSpraySummary && (musicSpraySummary.revenue?.amount > 0 || (musicSpraySummary.expenses?.length ?? 0) > 0)))}
			아래에서 <strong class="text-text-base">상세 내역</strong> 또는 <strong class="text-text-base">정산 요약</strong>을 선택한 뒤 반영 버튼을 누르세요.
				{:else if file}
					파일을 선택하면 자동으로 파싱됩니다. 아래에 미리보기가 곧 나타납니다.
				{:else}
					파일을 선택하면 자동으로 파싱됩니다. 미리보기 확인 후 <strong class="text-text-base">수익에 반영하기</strong>를 누르세요.
				{/if}
			</p>
		</div>

		{#if formatType === 'music-spray' && musicSprayDebugGrid}
			<!-- 0원일 때: 엑셀 원본 셀 구조 확인용 (파서 수정에 활용) -->
			<div class="card-base bg-surface-1 rounded-lg border border-border-subtle p-6">
				<h2 class="text-lg font-semibold text-text-strong mb-2">원본 셀 확인 (0원일 때 구조 확인용)</h2>
				<p class="text-sm text-text-muted mb-2">시트: {musicSprayDebugGrid.sheetName}</p>
				<p class="text-sm text-text-muted mb-4">
					<strong class="text-text-base">엑셀 구조:</strong> <span class="text-text-muted">2~14행 L·M열 = 요약(이번달 정산금·클라우드 수수료·원천세). 16행~ = 상세(Channel, Post-TAX Subtotal, Artist Share 등).</span> 아래 표에서 해당 위치를 확인할 수 있습니다.
				</p>
				<div class="overflow-hidden rounded-lg border border-border-subtle max-h-96 min-w-0">
					<table class="w-full text-xs border-collapse">
						<thead class="sticky top-0 bg-surface-2">
							<tr class="border-b border-border-subtle">
								<th class="px-2 py-1 text-left text-text-muted font-medium w-8">행</th>
								{#each ['A','B','C','D','E','F','G','H','I','J','K','L','M','N'] as col}
									<th class="px-2 py-1 text-left text-text-muted font-medium whitespace-nowrap {col === 'L' || col === 'M' ? 'bg-surface-3' : ''}" title={col === 'L' || col === 'M' ? '요약 금액/라벨' : ''}>{col}</th>
								{/each}
							</tr>
						</thead>
						<tbody class="divide-y divide-border-subtle">
							{#each musicSprayDebugGrid.grid as row, ri}
								<tr class="hover:bg-surface-2">
									<td class="px-2 py-1 text-text-muted font-medium">{ri + 1}</td>
									{#each row as cell}
										<td class="px-2 py-1 text-text-base whitespace-nowrap max-w-[8rem] truncate" title={cell}>{cell || '—'}</td>
									{/each}
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{/if}

		{#if formatType === 'music-spray' && (musicSprayData?.length || musicSpraySummary)}
			<!-- Music Spray: 반영 방식 선택 + 미리보기 (요약이 있으면 금액 0이어도 표시) -->
			<div bind:this={previewBlock} class="card-base bg-surface-1 rounded-lg border border-border-subtle p-6">
				<h2 class="text-lg font-semibold text-text-strong mb-4">2. 반영 방식</h2>
				<div class="flex flex-wrap gap-6 mb-6">
					{#if musicSprayData && musicSprayData.length > 0}
						<label class="inline-flex items-center gap-2 cursor-pointer">
							<input type="radio" name="musicSprayMode" value="detail" bind:group={musicSprayImportMode} class="rounded-full border-border-subtle" />
							<span class="text-text-base">상세 내역 반영 (곡별 {musicSprayData.length}건)</span>
						</label>
					{/if}
					{#if musicSpraySummary && (musicSpraySummary.revenue?.amount > 0 || (musicSpraySummary.expenses?.length ?? 0) > 0)}
						<label class="inline-flex items-center gap-2 cursor-pointer">
							<input type="radio" name="musicSprayMode" value="summary" bind:group={musicSprayImportMode} class="rounded-full border-border-subtle" />
							<span class="text-text-base">정산 요약 반영 (수익 1건 + 지출 2건)</span>
						</label>
					{/if}
				</div>

				{#if musicSprayImportMode === 'detail' && musicSprayData?.length}
					<div class="mb-6">
						<h3 class="text-base font-medium text-text-strong mb-2">상세 미리보기 (상위 20건)</h3>
						<p class="text-sm text-text-muted mb-3">정산월: {statementMonth} · 총 {musicSprayData.length}건</p>
						<div class="overflow-hidden rounded-lg border border-border-subtle min-w-0">
							<table class="w-full text-sm min-w-0">
								<thead>
									<tr class="border-b border-border-subtle bg-surface-2">
										<th class="px-4 py-2 text-left text-text-muted font-medium">정산일</th>
										<th class="px-4 py-2 text-left text-text-muted font-medium">플랫폼</th>
										<th class="px-4 py-2 text-right text-text-muted font-medium">금액</th>
										<th class="px-4 py-2 text-left text-text-muted font-medium">통화</th>
										<th class="px-4 py-2 text-left text-text-muted font-medium">곡명</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-border-subtle">
									{#each musicSprayData.slice(0, 20) as row}
										<tr class="hover:bg-surface-2">
											<td class="px-4 py-2 text-text-base">{row.settlementDate}</td>
											<td class="px-4 py-2 text-text-base">{row.platform}</td>
											<td class="px-4 py-2 text-text-base text-right" data-type="number">{(row.amount || 0).toLocaleString()}</td>
											<td class="px-4 py-2 text-text-base">{row.currency}</td>
											<td class="px-4 py-2 text-text-base">{row.title ?? '-'}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</div>
				{:else if musicSprayImportMode === 'summary' && musicSpraySummary}
					<div class="mb-6">
						<h3 class="text-base font-medium text-text-strong mb-2">요약 미리보기 (회계 입력용)</h3>
						<p class="text-sm text-text-muted mb-3">정산월: {statementMonth}</p>
						<div class="overflow-hidden rounded-lg border border-border-subtle max-w-xl min-w-0">
							<table class="w-full text-sm min-w-0">
								<thead>
									<tr class="border-b border-border-subtle bg-surface-2">
										<th class="px-4 py-2 text-left text-text-muted font-medium">구분</th>
										<th class="px-4 py-2 text-left text-text-muted font-medium">항목</th>
										<th class="px-4 py-2 text-right text-text-muted font-medium">금액 (KRW)</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-border-subtle">
									{#if musicSpraySummary.revenue?.amount > 0}
										<tr class="hover:bg-surface-2">
											<td class="px-4 py-2 text-text-base">수익</td>
											<td class="px-4 py-2 text-text-base">{musicSpraySummary.revenue.label}</td>
											<td class="px-4 py-2 text-text-base text-right" data-type="number">{musicSpraySummary.revenue.amount.toLocaleString()}</td>
										</tr>
									{/if}
									{#each musicSpraySummary.expenses ?? [] as exp}
										<tr class="hover:bg-surface-2">
											<td class="px-4 py-2 text-text-base">지출</td>
											<td class="px-4 py-2 text-text-base">{exp.label}</td>
											<td class="px-4 py-2 text-text-base text-right" data-type="number">{exp.amount.toLocaleString()}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</div>
				{/if}
			</div>
			<div class="flex justify-end">
				<button
					type="button"
					onclick={handleImport}
					disabled={importing || !isMusicSprayReady}
					class="page-header-action-button page-header-primary-button inline-flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-medium border border-transparent disabled:opacity-50"
				>
					{#if importing}
						<Loader2 size={18} class="animate-spin" />
						반영 중...
					{:else if musicSprayImportMode === 'summary'}
						<Check size={18} />
						수익·지출에 반영하기
					{:else}
						<Check size={18} />
						수익에 반영하기
					{/if}
				</button>
			</div>
		{:else if parsed?.sheets?.length}
			<!-- 2. 시트 선택 & 컬럼 매핑 -->
			<div class="card-base bg-surface-1 rounded-lg border border-border-subtle p-6">
				<h2 class="text-lg font-semibold text-text-strong mb-4">2. 시트·컬럼 매핑</h2>
				<div class="space-y-6">
					<div>
						<label for="import-sheet-select" class="block text-sm font-medium text-text-muted mb-2">시트</label>
						<select
							id="import-sheet-select"
							class="w-full max-w-xs rounded-lg border border-border-subtle bg-surface-2 px-3 py-2 text-text-base"
							bind:value={selectedSheetIndex}
						>
							{#each parsed.sheets as sheet, i}
								<option value={i}>{sheet.name} ({sheet.rows.length}행)</option>
							{/each}
						</select>
					</div>
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<label for="import-platform-key" class="block text-sm font-medium text-text-muted mb-2">플랫폼 컬럼</label>
							<select
								id="import-platform-key"
								class="w-full rounded-lg border border-border-subtle bg-surface-2 px-3 py-2 text-text-base"
								bind:value={platformKey}
							>
								<option value="">— 선택 안 함 —</option>
								{#each currentHeaders as h}
									<option value={h}>{h}</option>
								{/each}
							</select>
						</div>
						<div>
							<label for="import-amount-key" class="block text-sm font-medium text-text-muted mb-2">금액 컬럼 <span class="text-red-500">*</span></label>
							<select
								id="import-amount-key"
								class="w-full rounded-lg border border-border-subtle bg-surface-2 px-3 py-2 text-text-base"
								bind:value={amountKey}
							>
								{#each currentHeaders as h}
									<option value={h}>{h}</option>
								{/each}
							</select>
						</div>
						<div>
							<label for="import-date-key" class="block text-sm font-medium text-text-muted mb-2">날짜 컬럼</label>
							<select
								id="import-date-key"
								class="w-full rounded-lg border border-border-subtle bg-surface-2 px-3 py-2 text-text-base"
								bind:value={dateKey}
							>
								<option value="">— 선택 안 함 (정산월 사용) —</option>
								{#each currentHeaders as h}
									<option value={h}>{h}</option>
								{/each}
							</select>
						</div>
						<div>
							<label for="import-type-key" class="block text-sm font-medium text-text-muted mb-2">구분 컬럼 (수익/수수료)</label>
							<select
								id="import-type-key"
								class="w-full rounded-lg border border-border-subtle bg-surface-2 px-3 py-2 text-text-base"
								bind:value={typeKey}
							>
								<option value="">— 선택 안 함 (전부 수익) —</option>
								{#each currentHeaders as h}
									<option value={h}>{h}</option>
								{/each}
							</select>
						</div>
					</div>
					<div>
						<label for="import-statement-month" class="block text-sm font-medium text-text-muted mb-2">정산월 (날짜 없을 때 사용)</label>
						<input
							id="import-statement-month"
							type="month"
							class="rounded-lg border border-border-subtle bg-surface-2 px-3 py-2 text-text-base"
							bind:value={statementMonth}
						/>
					</div>
					<div class="flex flex-wrap gap-6">
						<label class="inline-flex items-center gap-2 cursor-pointer">
							<input type="checkbox" bind:checked={applyRevenue} class="rounded border-border-subtle" />
							<span class="text-sm text-text-base">수익 행 반영</span>
						</label>
						<label class="inline-flex items-center gap-2 cursor-pointer">
							<input type="checkbox" bind:checked={applyExpense} class="rounded border-border-subtle" />
							<span class="text-sm text-text-base">수수료(지출) 행 반영</span>
						</label>
					</div>
				</div>
			</div>

			<!-- 3. 미리보기 -->
			<div class="card-base bg-surface-1 rounded-lg border border-border-subtle overflow-hidden">
				<div class="p-6 border-b border-border-subtle">
					<h2 class="text-lg font-semibold text-text-strong">3. 미리보기 (상위 20행)</h2>
				</div>
				<div class="overflow-hidden min-w-0">
					<table class="w-full text-sm min-w-0">
						<thead>
							<tr class="border-b border-border-subtle bg-surface-2">
								{#each currentHeaders as h}
									<th class="px-4 py-2 text-left text-text-muted font-medium">{h}</th>
								{/each}
							</tr>
						</thead>
						<tbody class="divide-y divide-border-subtle">
							{#each previewRows as row}
								<tr class="hover:bg-surface-2">
									{#each currentHeaders as h}
										<td class="px-4 py-2 text-text-base whitespace-nowrap">{String(row[h] ?? '')}</td>
									{/each}
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>

			<!-- 4. 반영 버튼 -->
			<div class="flex justify-end">
				<button
					type="button"
					onclick={handleImport}
					disabled={importing || !canImport}
					class="page-header-action-button page-header-primary-button inline-flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-medium border border-transparent disabled:opacity-50"
				>
					{#if importing}
						<Loader2 size={18} class="animate-spin" />
						반영 중...
					{:else}
						<Check size={18} />
						수익·지출에 반영하기
					{/if}
				</button>
			</div>
		{/if}
	</div>
</PageContent>
