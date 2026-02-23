-- revenues / expenses 테이블 추가 (정산 import용)
CREATE TABLE IF NOT EXISTS revenues (id TEXT PRIMARY KEY, platform TEXT, amount INTEGER NOT NULL, date TEXT, track_id TEXT, album_id TEXT, description TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS expenses (id TEXT PRIMARY KEY, category TEXT, amount INTEGER NOT NULL, date TEXT, track_id TEXT, album_id TEXT, description TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
