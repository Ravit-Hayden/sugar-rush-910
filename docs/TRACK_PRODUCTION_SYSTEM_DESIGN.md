# 🎵 트랙 제작 시스템 설계 문서

## 📋 목차
1. [시스템 개요](#시스템-개요)
2. [데이터베이스 스키마](#데이터베이스-스키마)
3. [랜덤 주제 생성 시스템](#랜덤-주제-생성-시스템)
4. [태그 시스템](#태그-시스템)
5. [가사 관리 시스템](#가사-관리-시스템)
6. [SUNO AI 통합](#suno-ai-통합)
7. [워크플로우 관리](#워크플로우-관리)
8. [앨범-트랙 연동](#앨범-트랙-연동)
9. [API 엔드포인트](#api-엔드포인트)
10. [페이지 구조](#페이지-구조)

---

## 🎯 시스템 개요

트랙 제작부터 완성까지의 전체 워크플로우를 관리하는 통합 시스템입니다.

### 핵심 기능
- 랜덤 주제 생성 및 태그 시스템
- 가사 작사 및 버전 관리
- SUNO AI 프롬프트 생성 및 관리
- 작업 상태 추적 및 워크플로우 관리
- 앨범-트랙 연동

---

## 🗄️ 데이터베이스 스키마

### `tracks` 테이블 (확장)
```sql
CREATE TABLE tracks (
  id TEXT PRIMARY KEY,
  album_id TEXT,
  track_number INTEGER,
  title_kr TEXT,
  title_en TEXT,
  is_title BOOLEAN DEFAULT 0,
  
  -- SUNO AI 관련
  suno_prompt TEXT, -- 1000자 이내
  suno_exclude_style TEXT, -- 1000자 이내
  suno_vocal_gender TEXT, -- 'male', 'female', 'mixed'
  suno_vocal_features TEXT,
  suno_use_audio BOOLEAN DEFAULT 0,
  suno_use_persona BOOLEAN DEFAULT 0,
  suno_use_inspo BOOLEAN DEFAULT 0,
  suno_weirdness REAL, -- 0-100
  suno_style_influence REAL, -- 0-100
  suno_audio_influence REAL, -- 0-100
  
  -- 작업 상태
  status TEXT, -- 'draft', 'lyrics_writing', 'suno_generating', 'editing', 'completed'
  assigned_to TEXT,
  created_at TEXT,
  updated_at TEXT,
  
  -- 메타데이터
  duration TEXT,
  audio_file_url TEXT,
  final_track_url TEXT,
  
  FOREIGN KEY (album_id) REFERENCES albums(id)
);
```

### `track_tags` 테이블
```sql
CREATE TABLE track_tags (
  id TEXT PRIMARY KEY,
  track_id TEXT,
  tag_category TEXT, -- 'dessert', 'emotion', 'color', 'situation', 'theme'
  tag_value TEXT,
  created_at TEXT,
  FOREIGN KEY (track_id) REFERENCES tracks(id)
);
```

### `lyrics` 테이블
```sql
CREATE TABLE lyrics (
  id TEXT PRIMARY KEY,
  track_id TEXT,
  version INTEGER DEFAULT 1,
  content TEXT,
  language TEXT, -- 'kr', 'en', 'mixed'
  created_by TEXT,
  created_at TEXT,
  updated_at TEXT,
  FOREIGN KEY (track_id) REFERENCES tracks(id)
);
```

### `lyric_sentences` 테이블 (문장 라이브러리)
```sql
CREATE TABLE lyric_sentences (
  id TEXT PRIMARY KEY,
  content TEXT,
  language TEXT, -- 'kr', 'en', 'mixed'
  tags TEXT, -- JSON 배열
  usage_count INTEGER DEFAULT 0,
  created_at TEXT,
  updated_at TEXT
);
```

### `suno_links` 테이블
```sql
CREATE TABLE suno_links (
  id TEXT PRIMARY KEY,
  track_id TEXT,
  url TEXT,
  version INTEGER,
  is_final BOOLEAN DEFAULT 0,
  feedback TEXT,
  created_at TEXT,
  FOREIGN KEY (track_id) REFERENCES tracks(id)
);
```

### `track_workflow` 테이블 (작업 이력)
```sql
CREATE TABLE track_workflow (
  id TEXT PRIMARY KEY,
  track_id TEXT,
  step TEXT, -- 'lyrics_edit', 'music_edit', 'suno_studio_edit', 'download', 'post_edit', 'completed'
  assigned_to TEXT,
  started_at TEXT,
  completed_at TEXT,
  notes TEXT,
  FOREIGN KEY (track_id) REFERENCES tracks(id)
);
```

### `tag_categories` 테이블
```sql
CREATE TABLE tag_categories (
  id TEXT PRIMARY KEY,
  category TEXT UNIQUE, -- 'dessert', 'emotion', 'color', 'situation', 'theme'
  name_kr TEXT,
  name_en TEXT
);
```

### `tag_values` 테이블
```sql
CREATE TABLE tag_values (
  id TEXT PRIMARY KEY,
  category_id TEXT,
  value TEXT,
  usage_count INTEGER DEFAULT 0,
  created_at TEXT,
  FOREIGN KEY (category_id) REFERENCES tag_categories(id)
);
```

---

## 🎲 랜덤 주제 생성 시스템

### 카테고리 정의
```typescript
interface TagCategory {
  id: string;
  name: string;
  values: string[];
}

const TAG_CATEGORIES: TagCategory[] = [
  {
    id: 'dessert',
    name: '디저트',
    values: ['케이크', '마카롱', '초콜릿', '아이스크림', '도넛', '쿠키', ...]
  },
  {
    id: 'emotion',
    name: '감정',
    values: ['행복', '슬픔', '설렘', '그리움', '평온', '열정', ...]
  },
  {
    id: 'color',
    name: '색상',
    values: ['빨강', '파랑', '노랑', '초록', '보라', '핑크', ...]
  },
  {
    id: 'situation',
    name: '상황',
    values: ['비 오는 날', '밤', '여행', '데이트', '운동', ...]
  },
  {
    id: 'theme',
    name: '테마',
    values: ['로맨스', '우정', '성장', '추억', '미래', ...]
  }
];
```

### 랜덤 생성 로직
```typescript
function generateRandomTheme(options: {
  dessertCount?: number;
  emotionCount?: number;
  colorCount?: number;
  situationCount?: number;
  themeCount?: number;
}): string[] {
  // 각 카테고리에서 지정된 개수만큼 랜덤 선택
  // 중복 방지
  // 사용 횟수 낮은 태그 우선 선택 (선택적)
}
```

---

## 🏷️ 태그 시스템

### 기능
- 태그 개수 조절 (각 카테고리별)
- 랜덤 혼합
- 사용 횟수 추적
- 중복 방지 (앨범 주제 겹치지 않게)
- 변형 가능 (유사 태그 제안)

### 태그 사용 횟수 추적
```typescript
interface TagUsage {
  tagId: string;
  category: string;
  value: string;
  usageCount: number;
  lastUsedAt: string;
  usedInAlbums: string[]; // 앨범 ID 배열
}
```

---

## 📝 가사 관리 시스템

### 가사 작사
- 실시간 편집
- 버전 관리 (히스토리)
- 문장 라이브러리에서 가져오기
- 문장 사용 횟수 추적

### 문장 라이브러리
```typescript
interface LyricSentence {
  id: string;
  content: string;
  language: 'kr' | 'en' | 'mixed';
  tags: string[];
  usageCount: number;
  usedInTracks: string[]; // 트랙 ID 배열
  createdAt: string;
}
```

### 필터 기능
- 언어별 필터 (한글, 영어, 혼합)
- 태그별 필터
- 사용 횟수별 정렬
- 검색 기능

---

## 🤖 SUNO AI 통합

### 프롬프트 생성
```typescript
interface SunoPrompt {
  id: string;
  trackId: string;
  version: number;
  prompt: string; // 1000자 이내
  excludeStyle: string; // 1000자 이내
  vocalGender: 'male' | 'female' | 'mixed';
  vocalFeatures: string;
  useAudio: boolean;
  usePersona: boolean;
  useInspo: boolean;
  weirdness: number; // 0-100
  styleInfluence: number; // 0-100
  audioInfluence: number; // 0-100
  createdAt: string;
}
```

### SUNO 링크 관리
- 여러 버전의 SUNO 링크 저장
- 최종 선택곡 표시
- 피드백 및 수정 사항 기록

---

## 🔄 워크플로우 관리

### 작업 단계
1. **가사 작성** (`lyrics_writing`)
2. **SUNO 프롬프트 생성** (`suno_prompt_creation`)
3. **SUNO 생성** (`suno_generating`)
4. **SUNO 스튜디오 편집** (`suno_studio_edit`)
5. **다운로드** (`download`)
6. **다운로드 후 편집** (`post_edit`)
7. **제작 완성** (`completed`)

### 작업자 기록
```typescript
interface WorkflowStep {
  id: string;
  trackId: string;
  step: string;
  assignedTo: string;
  startedAt: string;
  completedAt: string | null;
  notes: string;
}
```

### 알림 시스템
- 작업 할당 시 알림
- 단계 완료 시 알림
- 피드백 요청 시 알림

---

## 🔗 앨범-트랙 연동

### 앨범 추가 페이지
- 트랙 추가 시 트랙 편집 페이지로 이동 가능
- 편집 후 앨범 추가 페이지로 복귀

### 트랙 편집 페이지
- 앨범 추가 페이지에서 온 경우: "앨범 추가로 돌아가기" 버튼
- 일반 편집: "앨범 상세로 돌아가기" 버튼

### URL 구조
```
/albums/new → 트랙 추가 → /tracks/[id]/edit?from=albums/new
/tracks/[id]/edit?from=albums/new → 편집 완료 → /albums/new
```

---

## 🔌 API 엔드포인트

### 태그 관련
- `GET /api/tags/categories` - 카테고리 목록
- `GET /api/tags/values?category=dessert` - 카테고리별 태그 값
- `POST /api/tags/generate-random` - 랜덤 태그 생성
- `GET /api/tags/usage` - 태그 사용 통계

### 가사 관련
- `GET /api/lyrics/[trackId]` - 트랙 가사 조회
- `POST /api/lyrics/[trackId]` - 가사 생성/수정
- `GET /api/lyrics/[trackId]/versions` - 가사 버전 목록
- `GET /api/lyric-sentences` - 문장 라이브러리 조회
- `POST /api/lyric-sentences` - 문장 추가
- `PUT /api/lyric-sentences/[id]/use` - 문장 사용 (횟수 증가)

### SUNO 관련
- `GET /api/tracks/[id]/suno` - SUNO 설정 조회
- `POST /api/tracks/[id]/suno` - SUNO 설정 저장
- `GET /api/tracks/[id]/suno/links` - SUNO 링크 목록
- `POST /api/tracks/[id]/suno/links` - SUNO 링크 추가
- `PUT /api/tracks/[id]/suno/links/[linkId]/final` - 최종 선택

### 워크플로우 관련
- `GET /api/tracks/[id]/workflow` - 워크플로우 조회
- `POST /api/tracks/[id]/workflow/step` - 작업 단계 시작/완료
- `POST /api/tracks/[id]/workflow/assign` - 작업자 할당

---

## 📄 페이지 구조

### `/tracks/[id]/edit` - 트랙 편집 페이지

#### 섹션 1: 기본 정보
- 트랙 제목 (한글/영어)
- 타이틀 곡 여부

#### 섹션 2: 랜덤 주제 생성
- 카테고리별 태그 개수 설정
- 랜덤 생성 버튼
- 생성된 태그 표시 및 수정
- 태그 사용 횟수 표시

#### 섹션 3: 가사 작성
- 가사 편집기
- 문장 라이브러리 패널
- 문장 검색/필터
- 가사 버전 관리
- 문장 사용 횟수 표시

#### 섹션 4: SUNO AI 설정
- 프롬프트 생성 (1000자 이내)
- 제외 스타일 프롬프트 (1000자 이내)
- 보컬 설정 (성별, 특징)
- 옵션 (+Audio, +Persona, +Inspo)
- 수치 설정 (Weirdness, Style Influence, Audio Influence)
- 버전 관리

#### 섹션 5: SUNO 링크 관리
- 링크 추가
- 여러 버전 표시
- 최종 선택
- 피드백 기록

#### 섹션 6: 작업 상태
- 현재 단계 표시
- 작업자 정보
- 작업 날짜 기록
- 워크플로우 진행 상황

#### 섹션 7: 액션 버튼
- "앨범 추가로 돌아가기" (from=albums/new인 경우)
- "앨범 상세로 돌아가기" (일반 편집)
- "저장"
- "다음 단계로"

### `/lyric-sentences` - 문장 라이브러리 페이지
- 문장 목록
- 필터 (언어, 태그, 사용 횟수)
- 검색
- 문장 추가/수정/삭제
- 사용 통계

### `/tags` - 태그 관리 페이지
- 카테고리별 태그 관리
- 사용 통계
- 중복 체크
- 태그 추가/수정/삭제

---

## 🎨 UI/UX 고려사항

### 랜덤 생성 UI
- 슬라이더로 개수 조절
- "랜덤 생성" 버튼
- 생성된 태그를 카드 형태로 표시
- 태그 제거/추가 가능

### 가사 편집 UI
- 실시간 편집기
- 문장 라이브러리 사이드바
- 드래그 앤 드롭으로 문장 추가
- 버전 히스토리 타임라인

### SUNO 설정 UI
- 텍스트 에어리어 (1000자 제한 표시)
- 슬라이더로 수치 조정
- 체크박스로 옵션 선택
- 버전 비교 뷰

### 워크플로우 UI
- 단계별 진행 바
- 각 단계별 상세 정보
- 작업자 아바타 및 이름
- 날짜 타임스탬프

---

## 📊 통계 및 분석

### 태그 통계
- 카테고리별 사용 빈도
- 가장 많이 사용된 태그
- 앨범별 태그 분포

### 가사 통계
- 문장 사용 빈도
- 언어별 분포
- 트랙별 가사 길이

### 작업 통계
- 단계별 평균 소요 시간
- 작업자별 작업량
- 완성률

---

## 🔐 권한 관리

### 역할별 권한
- **관리자**: 모든 기능 접근
- **프로듀서**: 트랙 생성, SUNO 설정, 워크플로우 관리
- **작사가**: 가사 작성, 문장 라이브러리 관리
- **편집자**: 트랙 편집, 다운로드 후 편집

---

## 🚀 구현 우선순위

### Phase 1: 기본 구조 (1주)
1. 데이터베이스 스키마 설계 및 생성
2. API 엔드포인트 기본 구조
3. 트랙 편집 페이지 기본 레이아웃

### Phase 2: 랜덤 주제 생성 (3일)
1. 태그 카테고리 데이터
2. 랜덤 생성 로직
3. 태그 UI

### Phase 3: 가사 관리 (1주)
1. 가사 편집기
2. 문장 라이브러리
3. 버전 관리

### Phase 4: SUNO 통합 (1주)
1. SUNO 설정 UI
2. 프롬프트 생성
3. 링크 관리

### Phase 5: 워크플로우 (1주)
1. 작업 상태 관리
2. 작업자 할당
3. 알림 시스템

### Phase 6: 앨범 연동 (3일)
1. 앨범-트랙 이동
2. 편집 후 복귀
3. 상태 동기화

---

**마지막 업데이트**: 2025-01-05
