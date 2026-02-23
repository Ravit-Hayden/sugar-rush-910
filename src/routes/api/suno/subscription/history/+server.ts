import type { RequestHandler } from './$types';
import type { ApiErr, ApiOk } from '$lib/types/api';
import type { SUNOSubscription } from '$lib/types/suno';

type HistoryItem = {
	id: string;
	updatedBy: string;
	updatedAt: string;
	before: SUNOSubscription | null;
	after: SUNOSubscription;
};
type HistoryResponse = {
	items: HistoryItem[];
	total: number;
	offset: number;
	limit: number;
	hasMore: boolean;
};
const ALLOWED_UPDATED_BY = new Set(['El', 'Otte', 'system']);
const JSON_HEADERS = {
	'content-type': 'application/json',
	'cache-control': 'no-store'
};

function isValidSubscription(value: unknown): value is SUNOSubscription {
	if (!value || typeof value !== 'object') return false;
	const row = value as Record<string, unknown>;
	return (
		(row.planType === 'Basic' || row.planType === 'Pro' || row.planType === 'Premier') &&
		typeof row.billingDate === 'number' &&
		Number.isInteger(row.billingDate) &&
		row.billingDate >= 1 &&
		row.billingDate <= 31 &&
		typeof row.monthlyCredits === 'number' &&
		row.monthlyCredits > 0 &&
		typeof row.remainingCredits === 'number' &&
		row.remainingCredits >= 0 &&
		row.remainingCredits <= row.monthlyCredits &&
		(row.updatedBy === undefined || row.updatedBy === 'El' || row.updatedBy === 'Otte') &&
		typeof row.lastUpdated === 'string'
	);
}

function parseSubscription(jsonText: unknown): SUNOSubscription | null {
	if (typeof jsonText !== 'string' || jsonText.length === 0) return null;
	try {
		const parsed = JSON.parse(jsonText);
		if (!isValidSubscription(parsed)) return null;
		const row = parsed as SUNOSubscription & { updatedBy?: 'El' | 'Otte' };
		return {
			...row,
			updatedBy: row.updatedBy === 'Otte' ? 'Otte' : 'El'
		};
	} catch {
		return null;
	}
}

export const GET: RequestHandler = async ({ platform, url }) => {
	try {
		const db = platform?.env?.DB;
		if (!db) {
			const response: ApiOk<HistoryResponse> = {
				ok: true,
				data: { items: [], total: 0, offset: 0, limit: 20, hasMore: false }
			};
			return new Response(JSON.stringify(response), {
				headers: JSON_HEADERS
			});
		}

		const requestedLimit = Number(url.searchParams.get('limit') ?? 20);
		const limit = Number.isInteger(requestedLimit)
			? Math.max(1, Math.min(100, requestedLimit))
			: 20;
		const requestedOffset = Number(url.searchParams.get('offset') ?? 0);
		const offset = Number.isInteger(requestedOffset) ? Math.max(0, Math.min(10000, requestedOffset)) : 0;
		const sortParam = (url.searchParams.get('sort') ?? 'desc').toLowerCase();
		const sortOrder = sortParam === 'asc' ? 'ASC' : 'DESC';
		const updatedByParam = (url.searchParams.get('updatedBy') ?? '').trim();
		const daysParam = Number(url.searchParams.get('days') ?? 0);
		const hasUpdatedByFilter = updatedByParam.length > 0;
		const normalizedUpdatedBy = hasUpdatedByFilter && ALLOWED_UPDATED_BY.has(updatedByParam) ? updatedByParam : '';
		const validDays = Number.isInteger(daysParam) ? Math.max(0, Math.min(365, daysParam)) : 0;
		const fromDateIso =
			validDays > 0 ? new Date(Date.now() - validDays * 24 * 60 * 60 * 1000).toISOString() : null;

		await db
			.prepare(
				`CREATE TABLE IF NOT EXISTS suno_subscription_logs (
					id TEXT PRIMARY KEY,
					updated_by TEXT NOT NULL,
					updated_at TEXT NOT NULL,
					before_json TEXT,
					after_json TEXT NOT NULL
				)`
			)
			.run();
		await db
			.prepare(
				`CREATE INDEX IF NOT EXISTS idx_suno_subscription_logs_updated_at
				 ON suno_subscription_logs(updated_at DESC)`
			)
			.run();
		await db
			.prepare(
				`CREATE INDEX IF NOT EXISTS idx_suno_subscription_logs_updated_by_updated_at
				 ON suno_subscription_logs(updated_by, updated_at DESC)`
			)
			.run();

		const whereParts: string[] = [];
		const bindValues: unknown[] = [];
		if (normalizedUpdatedBy) {
			whereParts.push('updated_by = ?');
			bindValues.push(normalizedUpdatedBy);
		}
		if (fromDateIso) {
			whereParts.push('updated_at >= ?');
			bindValues.push(fromDateIso);
		}
		const whereClause = whereParts.length > 0 ? `WHERE ${whereParts.join(' AND ')}` : '';

		const countResult = (await db
			.prepare(
				`SELECT COUNT(*) AS total
				 FROM suno_subscription_logs
				 ${whereClause}`
			)
			.bind(...bindValues)
			.first()) as Record<string, unknown> | null;
		const total = typeof countResult?.total === 'number' ? countResult.total : 0;

		const { results } = await db
			.prepare(
				`SELECT id, updated_by, updated_at, before_json, after_json
				 FROM suno_subscription_logs
				 ${whereClause}
				 ORDER BY updated_at ${sortOrder}
				 LIMIT ?
				 OFFSET ?`
			)
			.bind(...bindValues, limit, offset)
			.all();

		const items: HistoryItem[] = (results as Record<string, unknown>[])
			.map((row) => {
				const after = parseSubscription(row.after_json);
				if (!after) return null;
				return {
					id: String(row.id ?? ''),
					updatedBy:
						typeof row.updated_by === 'string' && row.updated_by.length > 0 ? row.updated_by : 'system',
					updatedAt: typeof row.updated_at === 'string' ? row.updated_at : new Date().toISOString(),
					before: parseSubscription(row.before_json),
					after
				};
			})
			.filter((row): row is HistoryItem => row !== null);

		const payload: HistoryResponse = {
			items,
			total,
			offset,
			limit,
			hasMore: offset + items.length < total
		};
		const response: ApiOk<HistoryResponse> = { ok: true, data: payload };
		return new Response(JSON.stringify(response), {
			headers: JSON_HEADERS
		});
	} catch (error) {
		const response: ApiErr = {
			ok: false,
			error: {
				code: 'INTERNAL_ERROR',
				message: '구독 변경 이력을 불러오는 중 오류가 발생했습니다.',
				details: error instanceof Error ? error.message : 'Unknown error'
			}
		};
		return new Response(JSON.stringify(response), {
			status: 500,
			headers: JSON_HEADERS
		});
	}
};
