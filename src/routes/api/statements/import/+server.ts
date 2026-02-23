import type { RequestHandler } from './$types';
import type { ApiOk, ApiErr } from '$lib/types/api';

function toNumber(v: unknown): number | null {
	if (typeof v === 'number' && !Number.isNaN(v)) return v;
	if (typeof v === 'string') {
		const cleaned = v.replace(/,/g, '').trim();
		const n = Number(cleaned);
		return Number.isNaN(n) ? null : n;
	}
	return null;
}

function toDateString(v: unknown, fallbackMonth: string): string {
	if (!v) return `${fallbackMonth}-01`;
	if (typeof v === 'string') {
		const s = v.trim().replace(/\./g, '-').slice(0, 10);
		if (/^\d{4}-\d{2}/.test(s)) return s;
	}
	if (typeof v === 'number' && v > 0) {
		const d = new Date((v - 25569) * 86400 * 1000);
		const y = d.getFullYear();
		const m = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		return `${y}-${m}-${day}`;
	}
	return `${fallbackMonth}-01`;
}

function isExpenseRow(typeVal: unknown): boolean {
	if (typeVal == null || typeVal === '') return false;
	const s = String(typeVal).trim().toLowerCase();
	return s === '수수료' || s === '지출' || s === '공제' || s === 'fee' || s === 'expense';
}

/** Music Spray 파서 출력 형식 (parseMusicSprayExcel 반환값) */
type MusicSprayRow = {
	settlementDate: string;
	platform: string;
	amount: number;
	currency: string;
	title?: string;
};

/** Music Spray 정산 요약 (수익 1건 + 지출 2건) */
type MusicSpraySummary = {
	settlementDate: string;
	revenue: { label: string; amount: number };
	expenses: { label: string; amount: number }[];
};

/**
 * 정산 엑셀 데이터를 수익(revenues) / 지출(expenses) 테이블에 반영
 * - format === 'music-spray': body.data = MusicSprayRow[] (컬럼 매핑 없이 바로 반영)
 * - 그 외: rows + platformKey, amountKey, dateKey, typeKey 로 매핑
 */
export const POST: RequestHandler = async ({ request, platform }) => {
	try {
		const body = (await request.json()) as {
			format?: 'music-spray' | 'music-spray-summary';
			data?: MusicSprayRow[];
			summary?: MusicSpraySummary;
			statementMonth?: string;
			rows?: Record<string, unknown>[];
			platformKey?: string;
			amountKey?: string;
			dateKey?: string;
			typeKey?: string;
			applyRevenue?: boolean;
			applyExpense?: boolean;
		};

		const db = platform?.env?.DB;
		let revenueCount = 0;
		let expenseCount = 0;

		// Music Spray 전용: 이미 파싱된 배열 그대로 수익 반영
		if (body.format === 'music-spray' && Array.isArray(body.data)) {
			const dataRows = body.data as MusicSprayRow[];
			if (dataRows.length === 0) {
				const response: ApiErr = {
					ok: false,
					error: {
						code: 'VALIDATION_ERROR',
						message: '반영할 데이터가 없습니다.',
						details: 'data is required and must not be empty'
					}
				};
				return new Response(JSON.stringify(response), {
					status: 400,
					headers: { 'content-type': 'application/json' }
				});
			}
			if (db) {
				for (const row of dataRows) {
					if (row.amount == null || row.amount <= 0) continue;
					const revenueId = `rev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
					await db
						.prepare(
							`INSERT INTO revenues (id, platform, amount, date, track_id, album_id, description, created_at, updated_at)
							 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
						)
						.bind(
							revenueId,
							row.platform || '기타',
							row.amount,
							row.settlementDate?.slice(0, 10) || new Date().toISOString().slice(0, 10),
							null,
							null,
							row.title ? `Music Spray 정산 · ${row.title}` : 'Music Spray 정산 엑셀 반영',
							new Date().toISOString(),
							new Date().toISOString()
						)
						.run();
					revenueCount++;
				}
			} else {
				revenueCount = dataRows.filter((r) => r.amount != null && r.amount > 0).length;
			}
			const response: ApiOk<{ revenueCount: number; expenseCount: number }> = {
				ok: true,
				data: { revenueCount, expenseCount }
			};
			return new Response(JSON.stringify(response), {
				status: 201,
				headers: { 'content-type': 'application/json' }
			});
		}

		// Music Spray 정산 요약: 수익 1건 + 지출 2건 (이번달 정산금, 클라우드 수수료, 원천세 공제)
		if (body.format === 'music-spray-summary' && body.summary) {
			const summary = body.summary as MusicSpraySummary;
			const dateStr =
				(typeof summary.settlementDate === 'string' && summary.settlementDate.length >= 10
					? summary.settlementDate.slice(0, 10)
					: '') || new Date().toISOString().slice(0, 10);

			const revAmount = Number(summary.revenue?.amount);
			const hasRevenue = Number.isFinite(revAmount) && revAmount > 0;

			if (db) {
				try {
					if (hasRevenue) {
						const revenueId = `rev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
						await db
							.prepare(
								`INSERT INTO revenues (id, platform, amount, date, track_id, album_id, description, created_at, updated_at)
								 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
							)
							.bind(
								revenueId,
								'Music Spray',
								Math.round(revAmount),
								dateStr,
								null,
								null,
								summary.revenue?.label || '이번달 정산금 (음원 정산)',
								new Date().toISOString(),
								new Date().toISOString()
							)
							.run();
						revenueCount++;
					}
					for (const exp of summary.expenses ?? []) {
						const amt = Number(exp.amount);
						if (!Number.isFinite(amt) || amt <= 0) continue;
						const expenseId = `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
						await db
							.prepare(
								`INSERT INTO expenses (id, category, amount, date, track_id, album_id, description, created_at, updated_at)
								 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
							)
							.bind(
								expenseId,
								'플랫폼 수수료',
								Math.round(amt),
								dateStr,
								null,
								null,
								exp.label || '정산 지출',
								new Date().toISOString(),
								new Date().toISOString()
							)
							.run();
						expenseCount++;
					}
				} catch (dbErr) {
					console.error('Music Spray summary import DB error:', dbErr);
					const msg = dbErr instanceof Error ? dbErr.message : String(dbErr);
					const response: ApiErr = {
						ok: false,
						error: {
							code: 'DB_ERROR',
							message: 'DB 반영 중 오류가 발생했습니다. (revenues/expenses 테이블 확인)',
							details: msg
						}
					};
					return new Response(JSON.stringify(response), {
						status: 503,
						headers: { 'content-type': 'application/json' }
					});
				}
			} else {
				if (hasRevenue) revenueCount = 1;
				expenseCount = (summary.expenses ?? []).filter(
					(e) => Number.isFinite(Number(e.amount)) && Number(e.amount) > 0
				).length;
			}

			const response: ApiOk<{ revenueCount: number; expenseCount: number }> = {
				ok: true,
				data: { revenueCount, expenseCount }
			};
			return new Response(JSON.stringify(response), {
				status: 201,
				headers: { 'content-type': 'application/json' }
			});
		}

		// 기존: 컬럼 매핑 방식
		const rows = body.rows ?? [];
		const statementMonth = (body.statementMonth || '').trim() || new Date().toISOString().slice(0, 7);
		const platformKey = (body.platformKey || '').trim();
		const amountKey = (body.amountKey || '').trim();
		const dateKey = (body.dateKey || '').trim();
		const typeKey = (body.typeKey || '').trim();
		const applyRevenue = body.applyRevenue !== false;
		const applyExpense = body.applyExpense !== false;

		if (rows.length === 0) {
			const response: ApiErr = {
				ok: false,
				error: {
					code: 'VALIDATION_ERROR',
					message: '반영할 데이터 행이 없습니다.',
					details: 'rows is required and must not be empty'
				}
			};
			return new Response(JSON.stringify(response), {
				status: 400,
				headers: { 'content-type': 'application/json' }
			});
		}

		if (!amountKey) {
			const response: ApiErr = {
				ok: false,
				error: {
					code: 'VALIDATION_ERROR',
					message: '금액 컬럼을 선택해주세요.',
					details: 'amountKey is required'
				}
			};
			return new Response(JSON.stringify(response), {
				status: 400,
				headers: { 'content-type': 'application/json' }
			});
		}

		if (db) {
			for (const row of rows) {
				const amount = toNumber(row[amountKey]);
				if (amount == null || amount <= 0) continue;

				const dateStr = dateKey ? toDateString(row[dateKey], statementMonth) : `${statementMonth}-01`;
				const platformName = platformKey ? String(row[platformKey] ?? '').trim() || '정산' : '정산';
				const isExpense = typeKey ? isExpenseRow(row[typeKey]) : false;

				if (isExpense && applyExpense) {
					const expenseId = `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
					await db
						.prepare(
							`INSERT INTO expenses (id, category, amount, date, track_id, album_id, description, created_at, updated_at)
							 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
						)
						.bind(
							expenseId,
							'플랫폼 수수료',
							amount,
							dateStr,
							null,
							null,
							`정산 수수료 · ${platformName}`,
							new Date().toISOString(),
							new Date().toISOString()
						)
						.run();
					expenseCount++;
				} else if (!isExpense && applyRevenue) {
					const revenueId = `rev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
					await db
						.prepare(
							`INSERT INTO revenues (id, platform, amount, date, track_id, album_id, description, created_at, updated_at)
							 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
						)
						.bind(
							revenueId,
							platformName,
							amount,
							dateStr,
							null,
							null,
							'업체 정산 엑셀 반영',
							new Date().toISOString(),
							new Date().toISOString()
						)
						.run();
					revenueCount++;
				}
			}
		} else {
			// DB 없을 때는 건수만 계산해서 응답 (로컬/미연동 환경)
			for (const row of rows) {
				const amount = toNumber(row[amountKey]);
				if (amount == null || amount <= 0) continue;
				const isExpense = typeKey ? isExpenseRow(row[typeKey]) : false;
				if (isExpense && applyExpense) expenseCount++;
				else if (!isExpense && applyRevenue) revenueCount++;
			}
		}

		const response: ApiOk<{ revenueCount: number; expenseCount: number }> = {
			ok: true,
			data: { revenueCount, expenseCount }
		};

		return new Response(JSON.stringify(response), {
			status: 201,
			headers: { 'content-type': 'application/json' }
		});
	} catch (err) {
		console.error('Statement import error:', err);
		const response: ApiErr = {
			ok: false,
			error: {
				code: 'IMPORT_ERROR',
				message: '정산 데이터 반영 중 오류가 발생했습니다.',
				details: err instanceof Error ? err.message : 'Unknown error'
			}
		};
		return new Response(JSON.stringify(response), {
			status: 500,
			headers: { 'content-type': 'application/json' }
		});
	}
};
