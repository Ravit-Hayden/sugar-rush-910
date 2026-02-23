CREATE INDEX IF NOT EXISTS idx_suno_subscription_logs_updated_at
ON suno_subscription_logs(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_suno_subscription_logs_updated_by_updated_at
ON suno_subscription_logs(updated_by, updated_at DESC);
