CREATE TABLE IF NOT EXISTS suno_subscription_logs (
	id TEXT PRIMARY KEY,
	updated_by TEXT NOT NULL,
	updated_at TEXT NOT NULL,
	before_json TEXT,
	after_json TEXT NOT NULL
);
