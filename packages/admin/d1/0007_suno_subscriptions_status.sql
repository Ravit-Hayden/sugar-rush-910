-- 구독 상태 컬럼 추가 (active / paused / cancelled)
ALTER TABLE suno_subscriptions ADD COLUMN status TEXT NOT NULL DEFAULT 'active';
