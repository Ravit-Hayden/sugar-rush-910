CREATE TABLE IF NOT EXISTS suno_subscriptions (
	id TEXT PRIMARY KEY,
	plan_type TEXT NOT NULL,
	billing_date INTEGER NOT NULL,
	monthly_credits INTEGER NOT NULL,
	remaining_credits INTEGER NOT NULL,
	last_updated TEXT NOT NULL
);
