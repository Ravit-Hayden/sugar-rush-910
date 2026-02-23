import type { RequestHandler } from './$types';
import type { ApiOk, ApiErr } from '$lib/types/api';

/**
 * 업체 정산 엑셀(.xlsx) 파싱 API
 * - multipart로 .xlsx 파일 수신
 * - 시트별 헤더(첫 행) + 데이터 행 반환 → 프리뷰/컬럼 매핑용
 */
export const POST: RequestHandler = async ({ request }) => {
	try {
		const contentType = request.headers.get('content-type');
		if (!contentType?.includes('multipart/form-data')) {
			const response: ApiErr = {
				ok: false,
				error: {
					code: 'INVALID_CONTENT_TYPE',
					message: 'multipart/form-data 형식이 필요합니다.',
					details: 'Content-Type must be multipart/form-data'
				}
			};
			return new Response(JSON.stringify(response), {
				status: 400,
				headers: { 'content-type': 'application/json' }
			});
		}

		const formData = await request.formData();
		const file = formData.get('file') as File | null;

		if (!file) {
			const response: ApiErr = {
				ok: false,
				error: {
					code: 'MISSING_FILE',
					message: '엑셀 파일을 선택해주세요.',
					details: 'file is required'
				}
			};
			return new Response(JSON.stringify(response), {
				status: 400,
				headers: { 'content-type': 'application/json' }
			});
		}

		const name = (file.name || '').toLowerCase();
		if (!name.endsWith('.xlsx') && !name.endsWith('.xls')) {
			const response: ApiErr = {
				ok: false,
				error: {
					code: 'INVALID_FILE_TYPE',
					message: '.xlsx 또는 .xls 파일만 업로드할 수 있습니다.',
					details: 'Allowed: .xlsx, .xls'
				}
			};
			return new Response(JSON.stringify(response), {
				status: 400,
				headers: { 'content-type': 'application/json' }
			});
		}

		const { MAX_FILE_SIZE_BYTES, getFileSizeErrorMessage } = await import('$lib/constants/upload');
		if (file.size > MAX_FILE_SIZE_BYTES) {
			const response: ApiErr = {
				ok: false,
				error: {
					code: 'FILE_TOO_LARGE',
					message: getFileSizeErrorMessage(),
					details: `File size: ${file.size}, Max: ${MAX_FILE_SIZE_BYTES}`
				}
			};
			return new Response(JSON.stringify(response), {
				status: 400,
				headers: { 'content-type': 'application/json' }
			});
		}

		const buffer = await file.arrayBuffer();
		// dynamic import: xlsx is CJS, ESM 호환
		const XLSX = await import('xlsx');
		const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });

		const sheets: { name: string; headers: string[]; rows: Record<string, unknown>[] }[] = [];

		for (const sheetName of workbook.SheetNames) {
			const sheet = workbook.Sheets[sheetName];
			const rawRows = XLSX.utils.sheet_to_json(sheet, {
				header: 1,
				defval: '',
				raw: false
			}) as unknown[][];

			if (rawRows.length === 0) {
				sheets.push({ name: sheetName, headers: [], rows: [] });
				continue;
			}

			const headerRow = rawRows[0] as unknown[];
			const headers = headerRow.map((h) => String(h ?? '').trim() || `열${headerRow.indexOf(h) + 1}`);
			const rows: Record<string, unknown>[] = [];

			for (let i = 1; i < rawRows.length; i++) {
				const row = rawRows[i] as unknown[];
				const obj: Record<string, unknown> = {};
				headers.forEach((h, j) => {
					let val = row[j];
					if (val instanceof Date) val = val.toISOString().slice(0, 10);
					obj[h] = val ?? '';
				});
				rows.push(obj);
			}

			sheets.push({ name: sheetName, headers, rows });
		}

		const response: ApiOk<{ fileName: string; sheets: typeof sheets }> = {
			ok: true,
			data: { fileName: file.name, sheets }
		};

		return new Response(JSON.stringify(response), {
			headers: { 'content-type': 'application/json' }
		});
	} catch (err) {
		console.error('Statement parse error:', err);
		const response: ApiErr = {
			ok: false,
			error: {
				code: 'PARSE_ERROR',
				message: '엑셀 파일을 읽는 중 오류가 발생했습니다.',
				details: err instanceof Error ? err.message : 'Unknown error'
			}
		};
		return new Response(JSON.stringify(response), {
			status: 500,
			headers: { 'content-type': 'application/json' }
		});
	}
};
