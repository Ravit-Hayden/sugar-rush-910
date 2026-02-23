/**
 * Music Spray 정산 엑셀 파서
 * 파일 예: iD_[sugarrush]정영민_202509판매부문.xlsx
 * - 파일명에서 정산월(YYYYMM) 추출
 * - 메타데이터 행 건너뛰고 헤더 행 탐색 (서비스/플랫폼, 정산금액/실지급액 등)
 * - 출력: settlementDate, platform, amount, currency, title?
 */

export type MusicSpraySettlementRow = {
	settlementDate: string;
	platform: string;
	amount: number;
	currency: string;
	title?: string;
};

/** 정산 요약 (상단 B2:M14) - 수익 1건 + 지출 2건 반영용 */
export type MusicSpraySummary = {
	settlementDate: string;
	revenue: { label: string; amount: number };
	expenses: { label: string; amount: number }[];
};

const PLATFORM_HEADERS = ['channel', '서비스', '플랫폼'];
const AMOUNT_HEADERS = ['artist share', '정산금액', '실지급액', '실수령금액', '금액', 'partner share', 'post-tax subtotal'];
const TITLE_HEADERS = ['title', '곡명', '앨범', 'album'];
const CURRENCY_HEADERS = ['currency', '통화'];

/** xlsx가 셀 객체 { v: value } 로 올 수 있음 */
function cellValue(cell: unknown): unknown {
	if (cell != null && typeof cell === 'object' && 'v' in cell && (cell as { v: unknown }).v !== undefined) {
		return (cell as { v: unknown }).v;
	}
	return cell;
}

function normalizeHeader(cell: unknown): string {
	const v = cellValue(cell);
	return String(v ?? '')
		.trim()
		.toLowerCase()
		.replace(/\s+/g, ' ')
		.replace(/\n/g, ' ');
}

function findColumnIndex(headerRow: unknown[], matchers: string[]): number {
	for (let c = 0; c < headerRow.length; c++) {
		const h = normalizeHeader(cellValue(headerRow[c]));
		if (matchers.some((m) => h.includes(m) || m.includes(h))) return c;
	}
	return -1;
}

function isSubHeaderRow(row: unknown[]): boolean {
	const joined = row.map((c) => String(c ?? '').toLowerCase()).join(' ');
	return /q\s*x\s*ws?p|local\s*currency|krw\s*\\/.test(joined);
}

function toNumber(v: unknown): number | null {
	if (typeof v === 'number' && !Number.isNaN(v)) return v;
	if (typeof v === 'string') {
		const cleaned = v.replace(/,/g, '').replace(/\s/g, '').trim();
		const n = Number(cleaned);
		return Number.isNaN(n) ? null : n;
	}
	return null;
}

function cellString(v: unknown): string {
	if (v == null) return '';
	if (typeof v === 'string') return v.trim();
	if (typeof v === 'number') return String(v);
	return String(v);
}

/**
 * 파일명에서 정산월 추출
 * 패턴: iD_[user]name_YYYYMM...xlsx → YYYYMM
 * @returns "YYYY-MM-01" 형식 또는 파싱 실패 시 null
 */
export function parseSettlementMonthFromFilename(filename: string): string | null {
	const match = filename.match(/_(\d{6})/);
	if (!match) return null;
	const yyyymm = match[1];
	const y = yyyymm.slice(0, 4);
	const m = yyyymm.slice(4, 6);
	return `${y}-${m}-01`;
}

/**
 * Music Spray 정산 엑셀에서 데이터 추출
 * - 시트 "음원유통정산내역" 또는 첫 시트 사용
 * - 헤더 행: "Channel" / "서비스" / "플랫폼" 포함 행 탐색 (메타데이터 행 스킵)
 * - 금액: "Artist Share" / "정산금액" / "실지급액" / "금액" 등
 */
export async function parseMusicSprayExcel(
	buffer: ArrayBuffer,
	filename?: string
): Promise<MusicSpraySettlementRow[]> {
	const XLSX = await import('xlsx');
	const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });

	const sheetName =
		workbook.SheetNames.find((s) => s.includes('음원유통정산내역') || s.includes('정산')) ||
		workbook.SheetNames[0];
	if (!sheetName) return [];

	const sheet = workbook.Sheets[sheetName];
	const rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' }) as unknown[][];

	if (rawRows.length < 2) return [];

	// 헤더 행 찾기: Channel / 서비스 / 플랫폼 포함 행 (최대 30행까지 탐색)
	let headerRowIndex = -1;
	for (let r = 0; r < Math.min(30, rawRows.length); r++) {
		const row = rawRows[r] as unknown[];
		// 셀 단위로도 검사 (인코딩/공백으로 joined 검사가 실패하는 경우 대비)
		const joined = row.map((c) => normalizeHeader(cellValue(c))).join(' ');
		const hasPlatform = PLATFORM_HEADERS.some((h) => joined.includes(h));
		const hasPlatformCell = row.some((c) => PLATFORM_HEADERS.some((h) => normalizeHeader(cellValue(c)).includes(h)));
		if (hasPlatform || hasPlatformCell) {
			headerRowIndex = r;
			break;
		}
	}

	// Music Spray 실제 파일: 헤더가 16행(인덱스 15) 또는 17행(인덱스 16)인 경우 폴백
	for (const tryIndex of [15, 16]) {
		if (headerRowIndex >= 0 || rawRows.length <= tryIndex + 3) break;
		const tryRow = rawRows[tryIndex] as unknown[] | undefined;
		if (!tryRow || !Array.isArray(tryRow)) continue;
		const c0 = normalizeHeader(cellValue(tryRow[0]));
		const c1 = normalizeHeader(cellValue(tryRow[1]));
		const c11 = tryRow.length > 11 ? normalizeHeader(cellValue(tryRow[11])) : '';
		const c12 = tryRow.length > 12 ? normalizeHeader(cellValue(tryRow[12])) : '';
		const hasPlatform = c0.includes('channel') || c1.includes('channel') || c0.includes('서비스') || c1.includes('플랫폼');
		const hasAmount = c11.includes('artist') || c11.includes('share') || c11.includes('금액') || c12.includes('artist') || c12.includes('share') || c12.includes('금액');
		if (hasPlatform && hasAmount) {
			headerRowIndex = tryIndex;
			break;
		}
	}

	// 명세서에 "Row 3 (Index 2)"라고 한 경우 대비
	if (headerRowIndex < 0 && rawRows.length > 2) {
		headerRowIndex = 2;
	}

	if (headerRowIndex < 0) return [];

	const headerRow = rawRows[headerRowIndex] as unknown[];
	let platformCol = findColumnIndex(headerRow, PLATFORM_HEADERS);
	let amountCol = findColumnIndex(headerRow, AMOUNT_HEADERS);
	const titleCol = findColumnIndex(headerRow, TITLE_HEADERS);
	const currencyCol = findColumnIndex(headerRow, CURRENCY_HEADERS);

	// Music Spray 실제 구조: 2번째 열=Channel, 11/12번째 열=Artist Share 또는 KRW
	if (platformCol < 0 && headerRow.length > 0) {
		for (let i = 0; i < Math.min(3, headerRow.length); i++) {
			if (normalizeHeader(cellValue(headerRow[i])).includes('channel') || normalizeHeader(cellValue(headerRow[i])).includes('플랫폼')) {
				platformCol = i;
				break;
			}
		}
		if (platformCol < 0 && headerRow.length > 1 && normalizeHeader(cellValue(headerRow[1])).includes('channel')) platformCol = 1;
	}
	if (amountCol < 0 && headerRow.length > 11) {
		const h11 = normalizeHeader(cellValue(headerRow[11]));
		const h12 = headerRow.length > 12 ? normalizeHeader(cellValue(headerRow[12])) : '';
		if (h11.includes('artist') || h11.includes('share') || h11.includes('금액') || h11.includes('krw')) amountCol = 11;
		else if (h12.includes('artist') || h12.includes('share') || h12.includes('금액') || h12.includes('krw')) amountCol = 12;
	}
	// 헤더 텍스트로 못 찾으면 마지막 숫자 열(11 또는 12) 사용
	if (amountCol < 0 && headerRow.length >= 12) amountCol = 12;
	else if (amountCol < 0 && headerRow.length >= 11) amountCol = 11;
	if (amountCol < 0) return [];

	// 서브헤더 행(예: Q x WsP, Local Currency)이 있으면 한 행 더 스킵
	let dataStart = headerRowIndex + 1;
	if (rawRows[dataStart] && isSubHeaderRow(rawRows[dataStart] as unknown[])) {
		dataStart++;
	}

	const settlementDate =
		parseSettlementMonthFromFilename(filename || '') ||
		extractSettlementMonthFromSheet(rawRows) ||
		new Date().toISOString().slice(0, 7) + '-01';

	const result: MusicSpraySettlementRow[] = [];

	for (let r = dataStart; r < rawRows.length; r++) {
		const row = rawRows[r] as unknown[];
		const platform = platformCol >= 0 ? cellString(cellValue(row[platformCol])) : '';
		// 일부 시트는 헤더와 값 열이 한 칸 어긋나 있음 (Artist Share 헤더 옆 열에 숫자)
		let amountVal =
			amountCol >= 0 ? toNumber(cellValue(row[amountCol])) : null;
		if ((amountVal == null || amountVal === 0) && amountCol >= 0 && amountCol + 1 < row.length) {
			amountVal = toNumber(cellValue(row[amountCol + 1]));
		}
		const currency =
			currencyCol >= 0 ? cellString(cellValue(row[currencyCol])).toUpperCase() || 'KRW' : 'KRW';
		const title = titleCol >= 0 ? cellString(cellValue(row[titleCol])) : undefined;

		// 플랫폼 또는 금액이 없으면 데이터 행이 아닌 것으로 간주
		if (!platform && (amountVal == null || amountVal === 0)) continue;
		if (amountVal == null || amountVal < 0) continue;
		// 요약/합계 행은 상세 데이터가 아님
		const platformLower = (platform || '').toLowerCase();
		if (platformLower.includes('total earnings') || platformLower.includes('albums on cloud')) continue;

		result.push({
			settlementDate,
			platform: platform || '기타',
			amount: Math.round(amountVal),
			currency: currency || 'KRW',
			...(title && { title })
		});
	}

	return result;
}

/** 시트 상단 메타데이터에서 "판매기준월 : YYYY. MM" 형태로 정산월 추출 */
function extractSettlementMonthFromSheet(rawRows: unknown[][]): string | null {
	for (let r = 0; r < Math.min(15, rawRows.length); r++) {
		const row = rawRows[r] as unknown[];
		for (let c = 0; c < row.length; c++) {
			const cell = String(cellValue(row[c]) ?? '');
			const match = cell.match(/판매기준월\s*[:\s]*(\d{4})\.?\s*(\d{1,2})/);
			if (match) {
				const y = match[1];
				const m = match[2].padStart(2, '0');
				return `${y}-${m}-01`;
			}
		}
	}
	return null;
}

/**
 * Music Spray 정산 요약(상단 B2:M14) 추출
 * - 이번달 정산금 (B) → 수익 1건
 * - 클라우드 데이터베이스 수수료 (C), 원천세 공제 (3.3%) → 지출 2건
 */
/** 셀 주소(A1, B2 등)로 값 읽기. col0Based: 0=A, 1=B, ..., 12=M. v(값) 또는 w(표시문자열) 사용 */
function getCellByAddress(sheet: { [addr: string]: { v?: unknown; w?: string } }, row1Based: number, col0Based: number): unknown {
	const letter = col0Based < 26 ? String.fromCharCode(65 + col0Based) : String.fromCharCode(64 + Math.floor(col0Based / 26)) + String.fromCharCode(65 + (col0Based % 26));
	const addr = `${letter}${row1Based}`;
	const cell = sheet[addr];
	if (!cell) return '';
	// 숫자/날짜는 v, 서식 적용 문자열은 w로 올 수 있음
	if (cell.w !== undefined && cell.w !== '') return cell.w;
	return cell.v ?? '';
}

/** 디버그: 요약 구역(1~20행, A~N열) 원본 그리드 반환. 요약=2~14행 L·M열, 상세=16행~ */
export async function getSummaryDebugGrid(buffer: ArrayBuffer): Promise<{ sheetName: string; grid: string[][] } | null> {
	const XLSX = await import('xlsx');
	const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });
	const sheetName =
		workbook.SheetNames.find((s) => s.includes('음원유통정산내역') || s.includes('정산')) ||
		workbook.SheetNames[0];
	if (!sheetName) return null;
	const sheet = workbook.Sheets[sheetName] as { [addr: string]: { v?: unknown; w?: string } };
	const grid: string[][] = [];
	for (let r = 1; r <= 20; r++) {
		const row: string[] = [];
		for (let c = 0; c <= 13; c++) {
			const v = getCellByAddress(sheet, r, c);
			row.push(v === undefined || v === null ? '' : String(v).trim());
		}
		grid.push(row);
	}
	return { sheetName, grid };
}

export async function parseMusicSpraySummary(
	buffer: ArrayBuffer,
	filename?: string
): Promise<MusicSpraySummary | null> {
	const XLSX = await import('xlsx');
	const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });
	const sheetName =
		workbook.SheetNames.find((s) => s.includes('음원유통정산내역') || s.includes('정산')) ||
		workbook.SheetNames[0];
	if (!sheetName) return null;
	const sheet = workbook.Sheets[sheetName] as { [addr: string]: { v?: unknown; w?: string } };
	const rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' }) as unknown[][];
	if (rawRows.length < 5) return null;

	const settlementDate =
		parseSettlementMonthFromFilename(filename || '') ||
		extractSettlementMonthFromSheet(rawRows) ||
		new Date().toISOString().slice(0, 7) + '-01';

	let revenue: { label: string; amount: number } | null = null;
	const expenses: { label: string; amount: number }[] = [];

	const summaryMatchers: { pattern: RegExp | string; label: string; type: 'revenue' | 'expense' }[] = [
		{ pattern: '이번달 정산금 (B)', label: '이번달 정산금 (음원 정산)', type: 'revenue' },
		{ pattern: '클라우드 데이터베이스 수수료 (C)', label: '클라우드 데이터베이스 수수료', type: 'expense' },
		{ pattern: '원천세 공제 (3.3%)', label: '원천세 공제 (3.3%)', type: 'expense' }
	];

	function tryExtractFromRow(row1Based: number): void {
		// B열(1) ~ N열(13). 실제 파일: 라벨=L(11), 값=M(12) 또는 N(13)
		for (let col = 1; col <= 13; col++) {
			const raw = getCellByAddress(sheet, row1Based, col);
			const cellStr = String(raw ?? '').trim();
			if (!cellStr) continue;

			for (const { pattern, label, type } of summaryMatchers) {
				const matches = typeof pattern === 'string' ? cellStr.includes(pattern) : pattern.test(cellStr);
				if (!matches) continue;

				let amount: number | null = null;
				for (let j = col + 1; j <= 13; j++) {
					const rawVal = getCellByAddress(sheet, row1Based, j);
					const v = toNumber(rawVal);
					if (v != null && v >= 0) {
						amount = v;
						break;
					}
				}
				// 옆 셀에 없으면 같은 셀 문자열에서 숫자 추출 (예: "이번달 정산금 (B) 7,201")
				if (amount == null && /[\d,.]/.test(cellStr)) {
					const numMatch = cellStr.match(/(\d[\d,.\s]*\d|\d+)/);
					if (numMatch) amount = toNumber(numMatch[1]);
				}
				if (amount == null || amount < 0) continue;

				if (type === 'revenue') {
					revenue = { label, amount: Math.round(amount) };
				} else {
					expenses.push({ label, amount: Math.round(amount) });
				}
				return;
			}
		}
	}

	// 1) 셀 주소로 상단 1~20행, B~M열 직접 읽기 (요약표 위치가 달라도 찾기)
	for (let row1 = 1; row1 <= 20; row1++) {
		tryExtractFromRow(row1);
	}

	// 2) sheet_to_json 행 배열로도 시도 (위에서 못 찾은 경우)
	if (!revenue && expenses.length === 0) {
		for (let r = 0; r < Math.min(14, rawRows.length); r++) {
			const row = rawRows[r] as unknown[];
			for (let c = 0; c < row.length; c++) {
				const cellStr = String(cellValue(row[c]) ?? '').trim();
				if (!cellStr) continue;

				for (const { pattern, label, type } of summaryMatchers) {
					const matches = typeof pattern === 'string' ? cellStr.includes(pattern) : pattern.test(cellStr);
					if (!matches) continue;

					let amount: number | null = null;
					for (let j = c + 1; j < row.length; j++) {
						const v = toNumber(cellValue(row[j]));
						if (v != null && v >= 0) {
							amount = v;
							break;
						}
					}
					// 같은 셀 문자열에서 숫자 추출 시도 (예: "이번달 정산금 (B) 7,201")
					if (amount == null && /[\d,.\s]+/.test(cellStr)) {
						const numMatch = cellStr.match(/(\d[\d,.\s]*\d|\d+)/);
						if (numMatch) amount = toNumber(numMatch[1]);
					}
					if (amount == null || amount < 0) continue;

					if (type === 'revenue') {
						revenue = { label, amount: Math.round(amount) };
					} else {
						expenses.push({ label, amount: Math.round(amount) });
					}
					break;
				}
			}
		}
	}

	// 3) 실제 파일: 상단 요약이 비어 있고 하단에 "Total Earnings (B)", "Albums on Cloud (C)" 행만 있는 경우
	let headerRowIndex = -1;
	for (let r = 0; r < Math.min(50, rawRows.length); r++) {
		const row = rawRows[r] as unknown[];
		const b = String(cellValue(row?.[1]) ?? '').toLowerCase();
		if (b.includes('channel')) {
			headerRowIndex = r;
			break;
		}
	}
	if (headerRowIndex >= 0) {
		const dataStart =
			rawRows[headerRowIndex + 1] && isSubHeaderRow(rawRows[headerRowIndex + 1] as unknown[])
				? headerRowIndex + 2
				: headerRowIndex + 1;
		let totalEarningsSum = 0;
		let albumsOnCloudRowIdx = -1;

		for (let r = dataStart; r < rawRows.length; r++) {
			const row = rawRows[r] as unknown[];
			const b = String(cellValue(row?.[1]) ?? '').trim();
			if (b.includes('Total Earnings (B)') || b === 'Total Earnings (B)') {
				const mVal = toNumber(cellValue(row?.[12]));
				if (mVal != null && mVal > 0) totalEarningsSum = mVal;
				break;
			}
			const mVal = toNumber(cellValue(row?.[12]));
			if (mVal != null && mVal > 0) totalEarningsSum += mVal;
		}
		for (let r = dataStart; r < rawRows.length; r++) {
			const row = rawRows[r] as unknown[];
			const b = String(cellValue(row?.[1]) ?? '').trim();
			if (b.includes('Albums on Cloud (C)') || b === 'Albums on Cloud (C)') {
				albumsOnCloudRowIdx = r;
				break;
			}
		}

		if ((revenue?.amount === 0 || revenue === null) && totalEarningsSum > 0) {
			revenue = { label: '이번달 정산금 (음원 정산)', amount: Math.round(totalEarningsSum) };
		}
		if (albumsOnCloudRowIdx >= 0) {
			const row = rawRows[albumsOnCloudRowIdx] as unknown[];
			const cVal = toNumber(cellValue(row?.[2]));
			const dVal = toNumber(cellValue(row?.[3]));
			const gVal = String(cellValue(row?.[6]) ?? '').toUpperCase();
			if (cVal != null && dVal != null && (cVal > 0 || dVal > 0)) {
				const usdAmount = cVal * dVal;
				const krwAmount = gVal === 'USD' ? Math.round(usdAmount * 1370) : Math.round(usdAmount);
				const already = expenses.find((e) => e.label === '클라우드 데이터베이스 수수료');
				if (!already || already.amount === 0) {
					if (already) already.amount = krwAmount;
					else expenses.push({ label: '클라우드 데이터베이스 수수료', amount: krwAmount });
				}
			}
		}
		// 원천세: 최종 지급대기(A+B-C) × 3.3%. 상단 '지난달까지 누적' 있으면 (이월+이번달-수수료)×3.3%
		if (revenue && revenue.amount > 0 && expenses.length > 0) {
			const cloudFee = expenses.find((e) => e.label === '클라우드 데이터베이스 수수료')?.amount ?? 0;
			let carryover = 0;
			for (let row1 = 2; row1 <= 10; row1++) {
				const raw = getCellByAddress(sheet, row1, 11);
				const s = String(raw ?? '').trim();
				if (s.includes('지난달까지 누적') || s.includes('지급대기 정산금 (A)')) {
					const v = toNumber(getCellByAddress(sheet, row1, 12));
					if (v != null && v > 0) {
						carryover = v;
						break;
					}
				}
			}
			const finalPending = carryover + revenue.amount - cloudFee;
			const withholding = finalPending > 0 ? Math.round(finalPending * 0.033) : 0;
			if (withholding > 0) {
				const already = expenses.find((e) => e.label === '원천세 공제 (3.3%)');
				if (!already || already.amount === 0) {
					if (already) already.amount = withholding;
					else expenses.push({ label: '원천세 공제 (3.3%)', amount: withholding });
				}
			}
		}
	}

	if (!revenue && expenses.length === 0) return null;
	return {
		settlementDate,
		revenue: revenue ?? { label: '이번달 정산금 (음원 정산)', amount: 0 },
		expenses
	};
}
