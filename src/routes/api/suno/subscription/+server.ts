import type { RequestHandler } from './$types';
import type { ApiErr, ApiOk } from '$lib/types/api';
import type { Producer, SUNOSubscription, SubscriptionPlan, SubscriptionStatus } from '$lib/types/suno';

const DEFAULT_SUBSCRIPTION: SUNOSubscription = {
	planType: 'Premier',
	status: 'active',
	billingDate: 15,
	monthlyCredits: 10000,
	remainingCredits: 6000,
	updatedBy: 'El',
	lastUpdated: new Date().toISOString().split('T')[0]
};

const ALLOWED_STATUSES = new Set<SubscriptionStatus>(['active', 'paused', 'cancelled']);

function isSubscriptionStatus(value: unknown): value is SubscriptionStatus {
	return typeof value === 'string' && ALLOWED_STATUSES.has(value as SubscriptionStatus);
}

const PLAN_CREDITS: Record<SubscriptionPlan, number> = {
	Basic: 50,
	Pro: 2500,
	Premier: 10000
};
const ALLOWED_PRODUCERS = new Set<Producer>(['El', 'Otte']);
const ALLOWED_ACTORS = new Set(['El', 'Otte', 'system']);

const JSON_HEADERS = {
	'content-type': 'application/json',
	'cache-control': 'no-store'
};
const REMOTE_SYNC_TIMEOUT_MS = 6000;

function isPlanType(value: unknown): value is SubscriptionPlan {
	return value === 'Basic' || value === 'Pro' || value === 'Premier';
}

function parsePlanType(value: unknown): SubscriptionPlan | null {
	if (isPlanType(value)) return value;
	if (typeof value !== 'string') return null;
	const normalized = value.trim().toLowerCase();
	if (normalized === 'basic' || normalized === 'free') return 'Basic';
	if (normalized === 'pro' || normalized === 'plus') return 'Pro';
	if (normalized === 'premier' || normalized === 'premium') return 'Premier';
	return null;
}

function toInt(value: unknown): number | null {
	if (typeof value === 'number' && Number.isFinite(value)) return Math.round(value);
	if (typeof value === 'string' && value.trim().length > 0) {
		const parsed = Number(value);
		if (Number.isFinite(parsed)) return Math.round(parsed);
	}
	return null;
}

function normalizeRemoteSubscription(payload: unknown): SUNOSubscription | null {
	if (!payload || typeof payload !== 'object') return null;
	const root = payload as Record<string, unknown>;
	const source =
		root.data && typeof root.data === 'object' ? (root.data as Record<string, unknown>) : root;
	const planType = parsePlanType(
		source.planType ?? source.plan ?? source.tier ?? source.subscriptionPlan ?? source.plan_name
	);
	if (!planType) return null;

	const billingDateRaw = toInt(source.billingDate ?? source.billing_date ?? source.billingDay);
	const billingDate =
		billingDateRaw && billingDateRaw >= 1 && billingDateRaw <= 31 ? billingDateRaw : 15;

	const monthlyCredits = PLAN_CREDITS[planType];
	const remainingRaw = toInt(
		source.remainingCredits ?? source.remaining_credits ?? source.creditsLeft ?? source.credits_left
	);
	const remainingCredits =
		remainingRaw === null ? monthlyCredits : Math.max(0, Math.min(monthlyCredits, remainingRaw));

	const rawStatus = source.status ?? source.subscription_status ?? source.state;
	const status: SubscriptionStatus = isSubscriptionStatus(rawStatus) ? rawStatus : 'active';

	const rawUpdatedBy = source.updatedBy ?? source.updated_by ?? source.actor ?? source.modifiedBy;
	const updatedBy: Producer =
		typeof rawUpdatedBy === 'string' && ALLOWED_PRODUCERS.has(rawUpdatedBy as Producer)
			? (rawUpdatedBy as Producer)
			: 'El';

	const lastUpdatedSource = source.lastUpdated ?? source.last_updated ?? source.updatedAt ?? source.updated_at;
	const lastUpdated =
		typeof lastUpdatedSource === 'string' && lastUpdatedSource.length >= 10
			? lastUpdatedSource.slice(0, 10)
			: new Date().toISOString().split('T')[0];

	return {
		planType,
		status,
		billingDate,
		monthlyCredits,
		remainingCredits,
		updatedBy,
		lastUpdated
	};
}

async function fetchRemoteSubscription(
	platform: App.Platform | undefined
): Promise<SUNOSubscription | null> {
	const sourceUrl = platform?.env?.SUNO_SUBSCRIPTION_SOURCE_URL;
	if (typeof sourceUrl !== 'string' || sourceUrl.trim().length === 0) {
		return null;
	}

	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), REMOTE_SYNC_TIMEOUT_MS);

	try {
		const headers: Record<string, string> = { Accept: 'application/json' };
		const sourceApiKey = platform?.env?.SUNO_SUBSCRIPTION_SOURCE_API_KEY;
		const sourceBearer = platform?.env?.SUNO_SUBSCRIPTION_SOURCE_BEARER_TOKEN;
		if (typeof sourceApiKey === 'string' && sourceApiKey.length > 0) {
			headers['x-api-key'] = sourceApiKey;
		}
		if (typeof sourceBearer === 'string' && sourceBearer.length > 0) {
			headers.Authorization = `Bearer ${sourceBearer}`;
		}

		const response = await fetch(sourceUrl, {
			method: 'GET',
			headers,
			cache: 'no-store',
			signal: controller.signal
		});
		if (!response.ok) return null;
		const payload = (await response.json()) as unknown;
		return normalizeRemoteSubscription(payload);
	} catch {
		return null;
	} finally {
		clearTimeout(timeout);
	}
}

async function ensureTable(db: D1Database): Promise<void> {
	await db
		.prepare(
			`CREATE TABLE IF NOT EXISTS suno_subscriptions (
				id TEXT PRIMARY KEY,
				plan_type TEXT NOT NULL CHECK (plan_type IN ('Basic', 'Pro', 'Premier')),
				billing_date INTEGER NOT NULL CHECK (billing_date BETWEEN 1 AND 31),
				monthly_credits INTEGER NOT NULL CHECK (monthly_credits > 0),
				remaining_credits INTEGER NOT NULL CHECK (remaining_credits >= 0),
				updated_by TEXT NOT NULL DEFAULT 'El',
				last_updated TEXT NOT NULL
			)`
		)
		.run();
	const subscriptionCols = await db.prepare(`PRAGMA table_info(suno_subscriptions)`).all();
	const colNames = new Set(
		Array.isArray(subscriptionCols.results)
			? subscriptionCols.results.map((col) => String((col as Record<string, unknown>).name))
			: []
	);
	if (!colNames.has('updated_by')) {
		await db
			.prepare(`ALTER TABLE suno_subscriptions ADD COLUMN updated_by TEXT NOT NULL DEFAULT 'El'`)
			.run();
	}
	if (!colNames.has('status')) {
		await db
			.prepare(`ALTER TABLE suno_subscriptions ADD COLUMN status TEXT NOT NULL DEFAULT 'active'`)
			.run();
	}

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
}

function toSubscription(row: Record<string, unknown> | null | undefined): SUNOSubscription | null {
	if (!row) return null;

	const planType = row.plan_type;
	const billingDate = row.billing_date;
	const monthlyCredits = row.monthly_credits;
	const remainingCredits = row.remaining_credits;
	const rawUpdatedBy = row.updated_by;
	const rawStatus = row.status;
	const lastUpdated = row.last_updated;
	const updatedBy =
		typeof rawUpdatedBy === 'string' && ALLOWED_PRODUCERS.has(rawUpdatedBy as Producer)
			? (rawUpdatedBy as Producer)
			: 'El';
	const status: SubscriptionStatus = isSubscriptionStatus(rawStatus) ? rawStatus : 'active';

	if (
		!isPlanType(planType) ||
		typeof billingDate !== 'number' ||
		typeof monthlyCredits !== 'number' ||
		typeof remainingCredits !== 'number' ||
		typeof lastUpdated !== 'string' ||
		!Number.isInteger(billingDate) ||
		billingDate < 1 ||
		billingDate > 31 ||
		monthlyCredits !== PLAN_CREDITS[planType] ||
		remainingCredits < 0 ||
		remainingCredits > monthlyCredits
	) {
		return null;
	}

	return {
		planType,
		status,
		billingDate,
		monthlyCredits,
		remainingCredits,
		updatedBy,
		lastUpdated
	};
}

/** GET: SUNO_SUBSCRIPTION_SOURCE_URL 설정 시 원격 우선 조회 → 성공 시 DB upsert 후 원격 데이터 반환. 타임아웃/5xx 시 null 폴백 → DB 또는 DEFAULT_SUBSCRIPTION 사용. */
export const GET: RequestHandler = async ({ platform }) => {
	try {
		const db = platform?.env?.DB;
		const remoteSubscription = await fetchRemoteSubscription(platform);

		if (!db) {
			const response: ApiOk<SUNOSubscription> = {
				ok: true,
				data: remoteSubscription ?? DEFAULT_SUBSCRIPTION
			};
			return new Response(JSON.stringify(response), {
				headers: JSON_HEADERS
			});
		}

		await ensureTable(db);

		if (remoteSubscription) {
			await db
				.prepare(
					`INSERT INTO suno_subscriptions
					 (id, plan_type, status, billing_date, monthly_credits, remaining_credits, updated_by, last_updated)
					 VALUES (?, ?, ?, ?, ?, ?, ?, ?)
					 ON CONFLICT(id) DO UPDATE SET
					 plan_type = excluded.plan_type,
					 status = excluded.status,
					 billing_date = excluded.billing_date,
					 monthly_credits = excluded.monthly_credits,
					 remaining_credits = excluded.remaining_credits,
					 updated_by = excluded.updated_by,
					 last_updated = excluded.last_updated`
				)
				.bind(
					'default',
					remoteSubscription.planType,
					remoteSubscription.status,
					remoteSubscription.billingDate,
					remoteSubscription.monthlyCredits,
					remoteSubscription.remainingCredits,
					remoteSubscription.updatedBy,
					remoteSubscription.lastUpdated
				)
				.run();
			const response: ApiOk<SUNOSubscription> = { ok: true, data: remoteSubscription };
			return new Response(JSON.stringify(response), {
				headers: JSON_HEADERS
			});
		}

		const row = (await db
			.prepare(
				`SELECT plan_type, status, billing_date, monthly_credits, remaining_credits, last_updated
				 , updated_by
				 FROM suno_subscriptions
				 WHERE id = ?`
			)
			.bind('default')
			.first()) as Record<string, unknown> | null;

		let subscription = toSubscription(row);

		if (!subscription) {
			subscription = {
				...DEFAULT_SUBSCRIPTION,
				lastUpdated: new Date().toISOString().split('T')[0]
			};

			await db
				.prepare(
					`INSERT INTO suno_subscriptions
					 (id, plan_type, status, billing_date, monthly_credits, remaining_credits, updated_by, last_updated)
					 VALUES (?, ?, ?, ?, ?, ?, ?, ?)
					 ON CONFLICT(id) DO UPDATE SET
					 plan_type = excluded.plan_type,
					 status = excluded.status,
					 billing_date = excluded.billing_date,
					 monthly_credits = excluded.monthly_credits,
					 remaining_credits = excluded.remaining_credits,
					 updated_by = excluded.updated_by,
					 last_updated = excluded.last_updated`
				)
				.bind(
					'default',
					subscription.planType,
					subscription.status,
					subscription.billingDate,
					subscription.monthlyCredits,
					subscription.remainingCredits,
					subscription.updatedBy,
					subscription.lastUpdated
				)
				.run();
		}

		const response: ApiOk<SUNOSubscription> = { ok: true, data: subscription };
		return new Response(JSON.stringify(response), {
			headers: JSON_HEADERS
		});
	} catch (error) {
		const response: ApiErr = {
			ok: false,
			error: {
				code: 'INTERNAL_ERROR',
				message: '구독 정보를 불러오는 중 오류가 발생했습니다.',
				details: error instanceof Error ? error.message : 'Unknown error'
			}
		};
		return new Response(JSON.stringify(response), {
			status: 500,
			headers: JSON_HEADERS
		});
	}
};

export const PUT: RequestHandler = async ({ request, platform }) => {
	try {
		const contentType = request.headers.get('content-type') ?? '';
		if (!contentType.toLowerCase().includes('application/json')) {
			const response: ApiErr = {
				ok: false,
				error: {
					code: 'VALIDATION_ERROR',
					message: 'JSON 형식으로 요청해주세요.',
					details: 'content-type must include application/json'
				}
			};
			return new Response(JSON.stringify(response), {
				status: 415,
				headers: JSON_HEADERS
			});
		}

		let payload: Partial<SUNOSubscription> & { updatedBy?: string };
		try {
			payload = (await request.json()) as Partial<SUNOSubscription>;
		} catch {
			const response: ApiErr = {
				ok: false,
				error: {
					code: 'VALIDATION_ERROR',
					message: '요청 JSON 형식이 올바르지 않습니다.',
					details: 'invalid json body'
				}
			};
			return new Response(JSON.stringify(response), {
				status: 400,
				headers: JSON_HEADERS
			});
		}
		if (!payload || typeof payload !== 'object') {
			const response: ApiErr = {
				ok: false,
				error: {
					code: 'VALIDATION_ERROR',
					message: '요청 본문 형식이 올바르지 않습니다.',
					details: 'payload must be a JSON object'
				}
			};
			return new Response(JSON.stringify(response), {
				status: 400,
				headers: JSON_HEADERS
			});
		}

		const planType = payload.planType;
		const status: SubscriptionStatus = isSubscriptionStatus(payload.status) ? payload.status : 'active';
		const billingDate = Number(payload.billingDate);
		const remainingCredits = Number(payload.remainingCredits);
		const rawUpdatedBy =
			typeof payload.updatedBy === 'string' && payload.updatedBy.trim().length > 0
				? payload.updatedBy.trim().slice(0, 40)
				: 'system';
		const logUpdatedBy = ALLOWED_ACTORS.has(rawUpdatedBy) ? rawUpdatedBy : 'system';
		const updatedBy: Producer = ALLOWED_PRODUCERS.has(rawUpdatedBy as Producer)
			? (rawUpdatedBy as Producer)
			: 'El';

		if (!isPlanType(planType)) {
			const response: ApiErr = {
				ok: false,
				error: {
					code: 'VALIDATION_ERROR',
					message: '유효한 플랜을 선택해주세요.',
					details: 'planType must be one of Basic, Pro, Premier'
				}
			};
			return new Response(JSON.stringify(response), {
				status: 400,
				headers: JSON_HEADERS
			});
		}

		if (!Number.isInteger(billingDate) || billingDate < 1 || billingDate > 31) {
			const response: ApiErr = {
				ok: false,
				error: {
					code: 'VALIDATION_ERROR',
					message: '결제일은 1~31 사이 정수여야 합니다.',
					details: 'billingDate must be integer between 1 and 31'
				}
			};
			return new Response(JSON.stringify(response), {
				status: 400,
				headers: JSON_HEADERS
			});
		}

		const monthlyCredits = PLAN_CREDITS[planType];
		if (!Number.isInteger(remainingCredits) || remainingCredits < 0 || remainingCredits > monthlyCredits) {
			const response: ApiErr = {
				ok: false,
				error: {
					code: 'VALIDATION_ERROR',
					message: '남은 크레딧은 0 이상, 월 크레딧 이하여야 합니다.',
					details: `remainingCredits must be between 0 and ${monthlyCredits}`
				}
			};
			return new Response(JSON.stringify(response), {
				status: 400,
				headers: JSON_HEADERS
			});
		}

		const db = platform?.env?.DB;
		if (db) {
			await ensureTable(db);
			const prevRow = (await db
				.prepare(
					`SELECT plan_type, status, billing_date, monthly_credits, remaining_credits, last_updated, updated_by
					 FROM suno_subscriptions
					 WHERE id = ?`
				)
				.bind('default')
				.first()) as Record<string, unknown> | null;
			const prevSubscription = toSubscription(prevRow);

			const hasChanged =
				!prevSubscription ||
				prevSubscription.planType !== planType ||
				prevSubscription.status !== status ||
				prevSubscription.billingDate !== billingDate ||
				prevSubscription.monthlyCredits !== monthlyCredits ||
				prevSubscription.remainingCredits !== remainingCredits ||
				prevSubscription.updatedBy !== updatedBy;

			const nextSubscription: SUNOSubscription = hasChanged
				? {
						planType,
						status,
						billingDate,
						monthlyCredits,
						remainingCredits,
						updatedBy,
						lastUpdated: new Date().toISOString().split('T')[0]
					}
				: (prevSubscription ?? {
						planType,
						status,
						billingDate,
						monthlyCredits,
						remainingCredits,
						updatedBy,
						lastUpdated: new Date().toISOString().split('T')[0]
					});

			if (hasChanged) {
				await db
					.prepare(
						`INSERT INTO suno_subscriptions
						 (id, plan_type, status, billing_date, monthly_credits, remaining_credits, updated_by, last_updated)
						 VALUES (?, ?, ?, ?, ?, ?, ?, ?)
						 ON CONFLICT(id) DO UPDATE SET
						 plan_type = excluded.plan_type,
						 status = excluded.status,
						 billing_date = excluded.billing_date,
						 monthly_credits = excluded.monthly_credits,
						 remaining_credits = excluded.remaining_credits,
						 updated_by = excluded.updated_by,
						 last_updated = excluded.last_updated`
					)
					.bind(
						'default',
						nextSubscription.planType,
						nextSubscription.status,
						nextSubscription.billingDate,
						nextSubscription.monthlyCredits,
						nextSubscription.remainingCredits,
						nextSubscription.updatedBy,
						nextSubscription.lastUpdated
					)
					.run();
			}

			const logId = `sublog_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
			await db
				.prepare(
					`INSERT INTO suno_subscription_logs
					 (id, updated_by, updated_at, before_json, after_json)
					 VALUES (?, ?, ?, ?, ?)`
				)
				.bind(
					logId,
					logUpdatedBy,
					new Date().toISOString(),
					prevSubscription ? JSON.stringify(prevSubscription) : null,
					JSON.stringify(nextSubscription)
				)
				.run();

			const response: ApiOk<SUNOSubscription> = { ok: true, data: nextSubscription };
			return new Response(JSON.stringify(response), {
				headers: JSON_HEADERS
			});
		}

		const nextSubscription: SUNOSubscription = {
			planType,
			status,
			billingDate,
			monthlyCredits,
			remainingCredits,
			updatedBy,
			lastUpdated: new Date().toISOString().split('T')[0]
		};
		const response: ApiOk<SUNOSubscription> = { ok: true, data: nextSubscription };
		return new Response(JSON.stringify(response), {
			headers: JSON_HEADERS
		});
	} catch (error) {
		const response: ApiErr = {
			ok: false,
			error: {
				code: 'INTERNAL_ERROR',
				message: '구독 정보를 저장하는 중 오류가 발생했습니다.',
				details: error instanceof Error ? error.message : 'Unknown error'
			}
		};
		return new Response(JSON.stringify(response), {
			status: 500,
			headers: JSON_HEADERS
		});
	}
};
