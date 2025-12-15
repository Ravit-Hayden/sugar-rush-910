-- packages/admin/d1/schema.sql
CREATE TABLE IF NOT EXISTS tasks (id TEXT PRIMARY KEY, title TEXT NOT NULL, priority INTEGER NOT NULL DEFAULT 0, due TEXT);
CREATE TABLE IF NOT EXISTS failures (id TEXT PRIMARY KEY, text TEXT NOT NULL, retryable INTEGER NOT NULL DEFAULT 1, status TEXT NOT NULL DEFAULT 'failed');
CREATE TABLE IF NOT EXISTS changes (id TEXT PRIMARY KEY, text TEXT NOT NULL, recent INTEGER NOT NULL DEFAULT 1, ts INTEGER);
CREATE TABLE IF NOT EXISTS metrics (key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS releases (id TEXT PRIMARY KEY, title TEXT NOT NULL, release_time TEXT);
CREATE TABLE IF NOT EXISTS logs (id TEXT PRIMARY KEY, text TEXT NOT NULL, ts INTEGER);
CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE, role TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS audit_log (id TEXT PRIMARY KEY, actor TEXT, action TEXT, target TEXT, ts INTEGER);
CREATE TABLE IF NOT EXISTS artists (id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE, description TEXT, photo_url TEXT, website TEXT, email TEXT, instagram TEXT, twitter TEXT, youtube TEXT, genre TEXT, debut_date TEXT, agency TEXT, country TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);

-- 샘플 아티스트 데이터
INSERT OR IGNORE INTO artists (id, name, description, photo_url, website, email, instagram, twitter, youtube, genre, debut_date, agency, country, created_at, updated_at) VALUES
('artist_sugar-rush_1', 'Sugar Rush', 'Sugar Rush 910 프로젝트의 메인 아티스트. 팝과 일렉트로닉을 결합한 독특한 사운드로 많은 사랑을 받고 있습니다. 감성적인 멜로디와 강렬한 비트의 조화로 독보적인 음악 세계를 구축하고 있습니다.', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop', 'https://sugarrush.com', 'contact@sugarrush.com', 'https://instagram.com/sugarrush', 'https://twitter.com/sugarrush', 'https://youtube.com/@sugarrush', 'Pop, Electronic', '2020-01-15', 'Sugar Rush Entertainment', '대한민국', datetime('now'), datetime('now')),
('artist_various_1', 'Various', '다양한 아티스트들의 협업 프로젝트를 위한 공통 아티스트입니다. 여러 아티스트가 함께 작업한 트랙이나 컴필레이션 앨범에 사용됩니다.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, datetime('now'), datetime('now'));
