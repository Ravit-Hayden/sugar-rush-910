import type { RequestHandler } from './$types';
import type { ApiOk, ApiErr } from '$lib/types/api';
import { parseMusicSprayExcel, parseMusicSpraySummary, getSummaryDebugGrid } from '$lib/utils/musicSprayStatement';

/**
 * Music Spray 정산 엑셀 전용 파싱 API
 * - multipart로 .xlsx 파일 수신
 * - detail: 하단 상세(곡별) { settlementDate, platform, amount, currency, title? }[]
 * - summary: 상단 요약(B2:M14) 수익 1건 + 지출 2건 (이번달 정산금, 클라우드 수수료, 원천세 공제)
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
		const [detail, summary] = await Promise.all([
			parseMusicSprayExcel(buffer, file.name),
			parseMusicSpraySummary(buffer, file.name)
		]);

		const needsDebug =
			!summary ||
			(summary.revenue?.amount === 0 && (summary.expenses?.length === 0 || summary.expenses.every((e) => e.amount === 0)));
		const debugGrid = needsDebug ? await getSummaryDebugGrid(buffer) : null;

		const response: ApiOk<{ detail: typeof detail; summary: typeof summary; debugGrid?: typeof debugGrid }> = {
			ok: true,
			data: { detail, summary, ...(debugGrid && { debugGrid }) }
		};

		return new Response(JSON.stringify(response), {
			headers: { 'content-type': 'application/json' }
		});
	} catch (err) {
		console.error('Music Spray parse error:', err);
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
