# 아티스트 및 앨범 선택 기능 종합 가이드

## 📋 개요

새 트랙 만들기(`/tracks/new`)와 새 앨범 만들기(`/albums/new`) 페이지에서 사용되는 아티스트 및 앨범 선택 기능의 기능과 디자인을 종합 정리한 문서입니다.

---

## 🎯 공통 컴포넌트

### 1. ArtistSelect 컴포넌트 (`src/lib/components/ArtistSelect.svelte`)

#### 기능
- **실시간 검색 필터링**: 첫 글자부터 입력 시 즉시 필터링
- **검색어 하이라이트**: 매칭된 부분을 강조 표시
- **드롭다운 선택**: 클릭 또는 키보드로 선택 가능
- **커스텀 입력**: `allowCustom` prop으로 직접 입력 허용
- **키보드 네비게이션**: Enter, Space, Escape 키 지원
- **외부 클릭 감지**: 드롭다운 외부 클릭 시 자동 닫힘

#### 디자인
- **입력 필드**: 
  - 높이: `h-10` (40px)
  - 배경: `bg-surface-2`
  - 테두리: `border-border-subtle`
  - 포커스: `border-brand-pink` (핑크)
  - 아이콘: User 아이콘 (왼쪽, 16px)
  - 드롭다운 버튼: ChevronDown 아이콘 (오른쪽, 16px, 투명 배경)
- **드롭다운 목록**:
  - 위치: 입력 필드 아래 `mt-[6px]` (6px 여백)
  - 배경: `bg-surface-1`
  - 테두리: `border-border-subtle`, `rounded-[6px]`
  - z-index: `z-[9999]`
- **검색 하이라이트**:
  - 클래스: `text-search-highlight`
  - 다크 모드: `var(--search-highlight-dark)`
  - 라이트 모드: `var(--search-highlight-light)`
  - 폰트: `font-medium`

#### 접근성
- `role="listbox"`, `role="option"`
- `aria-selected`, `aria-expanded`, `aria-haspopup`
- 키보드 네비게이션 완전 지원
- 포커스 관리: 선택 후 입력 필드로 포커스 유지

---

### 2. AlbumSelect 컴포넌트 (`src/lib/components/AlbumSelect.svelte`)

#### 기능
- **아티스트별 필터링**: `filterByArtist` prop으로 해당 아티스트의 앨범 우선 표시
- **실시간 검색**: 앨범 제목 및 아티스트명으로 검색
- **매칭되지 않는 앨범 표시**: 검색어가 일치하면 다른 아티스트의 앨범도 표시 (시각적 구분)
- **검색어 하이라이트**: 앨범 제목과 아티스트명 모두 하이라이트
- **커스텀 입력**: `allowCustom` prop으로 직접 입력 허용
- **키보드 네비게이션**: Enter, Space, Escape 키 지원

#### 디자인
- **입력 필드**: ArtistSelect와 동일한 스타일
  - 아이콘: Disc3 아이콘 (왼쪽, 16px)
- **드롭다운 목록**: ArtistSelect와 동일한 레이아웃
- **앨범 정보 표시**:
  - 앨범 제목: 기본 텍스트
  - 아티스트명: `text-xs` (작은 텍스트), `album-artist-name` 클래스
- **매칭되지 않는 앨범 시각적 구분**:
  - 클래스: `album-unmatched`
  - 기본 상태: `opacity: 0.7`, `color: var(--text-muted)`
  - 호버 시:
    - 다크 모드: `background-color: #2A2A2A` (회색)
    - 라이트 모드: `background-color: #E8DDD0` (베이지)
  - 선택됨 (`aria-selected="true"`):
    - 다크 모드: `background-color: #2A2A2A`, `color: var(--text-base)`
    - 라이트 모드: `background-color: #E8DDD0`, `color: var(--text-muted)`
  - 앨범명과 아티스트명: 같은 색상으로 통일

#### 접근성
- ArtistSelect와 동일한 접근성 속성
- 아티스트명도 스크린 리더에서 읽힘

---

## 📄 페이지별 구현

### 1. 새 트랙 만들기 페이지 (`/tracks/new`)

#### 아티스트 선택
```svelte
<ArtistSelect
  value={formData.artist}
  onChange={(value) => {
    // 검증 에러 제거
    if (validationErrors.artist && value.trim()) {
      validationErrors = { ...validationErrors };
      delete validationErrors.artist;
    }
    formData.artist = value;
    
    // 디바운싱: 500ms 후 경고 체크
    // 앨범과 매칭되지 않으면 경고 Toast 표시
  }}
  required
  placeholder="아티스트를 선택하거나 입력하세요"
  allowCustom={true}
/>
```

**특징**:
- 필수 필드 (`required`)
- 실시간 검증 에러 제거
- 디바운싱으로 경고 Toast 중복 방지
- 앨범과 매칭 검증 (500ms 디바운싱)

#### 앨범 선택
```svelte
<AlbumSelect
  value={formData.album}
  onChange={(value) => {
    formData.album = value;
    
    // 기존 경고 제거
    // 앨범 선택 시 아티스트 자동 동기화
    // 매칭되지 않으면 경고 Toast 표시
  }}
  albums={ALBUMS}
  placeholder="앨범을 선택하거나 입력하세요"
  allowCustom={true}
  filterByArtist={formData.artist || undefined}
/>
```

**특징**:
- 선택 필드 (필수 아님)
- 아티스트별 필터링 (`filterByArtist`)
- 앨범 선택 시 아티스트 자동 동기화
- 매칭되지 않으면 경고 Toast 표시

#### 경고 Toast 시스템
- **중복 방지**: 하나의 경고만 유지 (`albumArtistMismatchToastId` 추적)
- **자동 사라짐 방지**: `duration: 0`으로 사용자 선택 전까지 유지
- **Toast 위치**: `top-20 right-6` (Header 바로 아래, 오른쪽 24px)
- **액션 버튼**:
  - "아티스트 변경" / "앨범 다시 선택": 자동 변경 + Toast 닫기
  - "무시": 경고만 닫기
  - 포커스/호버 효과 지원 (다크/라이트 모드 자동 적용)
- **제거 조건**:
  - 아티스트가 앨범과 일치하면 자동 제거
  - 앨범 삭제 시 제거
  - 사용자가 버튼 클릭 시 제거
- **유틸리티 함수**:
  - `clearToast()`: Toast ID 안전하게 제거
  - `showAlbumArtistMismatchToast()`: 경고 Toast 생성 (공통화)

---

### 2. 새 앨범 만들기 페이지 (`/albums/new`)

#### 아티스트 선택
```svelte
<ArtistSelect
  value={formData.artist}
  onChange={(value) => formData.artist = value}
  required
  placeholder="아티스트를 선택하거나 입력하세요"
  allowCustom={true}
/>
```

**특징**:
- 필수 필드 (`required`)
- 단순한 값 변경만 처리
- 경고 Toast 없음 (앨범 페이지이므로)

---

## 🎨 디자인 규칙

### 공통 스타일

#### 입력 필드
```css
- 높이: 40px (h-10)
- 패딩: 좌우 40px (pl-10 pr-10, 아이콘 공간 포함)
- 배경: bg-surface-2
- 테두리: border-border-subtle
- 포커스: border-brand-pink
- 텍스트: text-text-base
- 포커스 시 텍스트: #FFFFFF (다크 모드), text-base (라이트 모드)
```

#### 드롭다운 버튼
```css
- 배경: 투명 (bg-transparent)
- 호버/포커스: 배경 없음
- 아이콘: text-text-muted
- 호버 시: hover-cyan (아이콘 색상)
- 포커스 시: brand-pink (아이콘 색상)
```

#### 드롭다운 목록
```css
- 위치: absolute, left-0, mt-[6px]
- 배경: bg-surface-1
- 테두리: border-border-subtle, rounded-[6px]
- z-index: z-[9999]
- 패딩: pt-0 (상단 여백 없음)
```

#### 검색 하이라이트
```css
.text-search-highlight {
  color: var(--search-highlight-dark); /* 다크 모드 */
}
[data-theme="light"] .text-search-highlight {
  color: var(--search-highlight-light); /* 라이트 모드 */
}

/* 선택된 항목의 하이라이트는 흰색 */
.filter-dropdown [role="option"][aria-selected="true"] .text-search-highlight {
  color: #fff !important;
}
```

#### 매칭되지 않는 앨범
```css
/* 기본 상태 */
.album-unmatched {
  opacity: 0.7;
  color: var(--text-muted) !important;
}

/* 다크 모드 - 호버 */
.album-unmatched:hover {
  background-color: #2A2A2A !important; /* 회색 */
  color: var(--text-base) !important;
  opacity: 1;
}

/* 라이트 모드 - 호버 */
[data-theme="light"] .album-unmatched:hover {
  background-color: #E8DDD0 !important; /* 베이지 */
  color: var(--text-muted) !important;
  opacity: 0.85;
}

/* 선택됨 - 다크 모드 */
.album-unmatched[aria-selected="true"] {
  background-color: #2A2A2A !important;
  color: var(--text-base) !important;
  opacity: 1;
}

/* 선택됨 - 라이트 모드 */
[data-theme="light"] .album-unmatched[aria-selected="true"] {
  background-color: #E8DDD0 !important;
  color: var(--text-muted) !important;
  opacity: 1;
}

/* 아티스트명 색상 통일 */
.album-unmatched .album-artist-name {
  color: var(--text-muted) !important; /* 앨범명과 같은 색 */
  opacity: 1;
}
```

---

## 🔄 동작 흐름

### 새 트랙 만들기 페이지

#### 1. 아티스트 입력/선택
```
사용자 입력 → 실시간 필터링 → 드롭다운 표시
  ↓
선택 또는 입력 완료 → onChange 호출
  ↓
디바운싱 (500ms) → 앨범 매칭 확인
  ↓
매칭되지 않음 → 경고 Toast 표시 (duration: 0)
  ↓
사용자 선택:
  - "아티스트 변경" → 아티스트 자동 변경 + Toast 닫기
  - "무시" → Toast 닫기
  - X 버튼 → Toast 닫기
```

#### 2. 앨범 선택
```
사용자 입력/선택 → 실시간 필터링 → 드롭다운 표시
  ↓
선택 완료 → onChange 호출
  ↓
기존 경고 제거 → 앨범 정보 확인
  ↓
아티스트와 매칭 확인:
  - 일치 또는 비어있음 → 아티스트 자동 변경 + 성공 Toast
  - 불일치 → 경고 Toast 표시 (duration: 0)
```

### 새 앨범 만들기 페이지

#### 아티스트 선택
```
사용자 입력/선택 → 실시간 필터링 → 드롭다운 표시
  ↓
선택 또는 입력 완료 → onChange 호출
  ↓
formData.artist 업데이트
```

---

## 📊 데이터 구조

### 아티스트 상수 (`src/lib/constants/artists.ts`)
```typescript
export interface Artist {
  id: string;
  name: string;
  description?: string;
  photo_url?: string;
}

export const ARTISTS: Artist[] = [
  { id: 'sugar-rush', name: 'Sugar Rush', ... },
  { id: 'various', name: 'Various', ... }
];
```

### 앨범 상수 (`src/lib/constants/albums.ts`)
```typescript
export interface Album {
  id: string;
  title: string;
  artist: string;
  year?: number;
  status?: string;
}

export const ALBUMS: Album[] = [
  { id: '1', title: 'Sugar Rush Vol.1', artist: 'Sugar Rush', ... },
  { id: '2', title: 'Sugar Rush Vol.2', artist: 'Sugar Rush', ... },
  ...
];
```

---

## 🎯 주요 기능 차이점

| 기능 | 새 트랙 만들기 | 새 앨범 만들기 |
|------|---------------|---------------|
| 아티스트 선택 | ✅ 필수, 경고 Toast | ✅ 필수, 경고 Toast 없음 |
| 앨범 선택 | ✅ 선택, 아티스트 필터링 | ❌ 없음 |
| 경고 Toast | ✅ 앨범-아티스트 매칭 검증 | ❌ 없음 |
| 자동 동기화 | ✅ 앨범 선택 시 아티스트 변경 | ❌ 없음 |
| 디바운싱 | ✅ 500ms | ❌ 없음 |

---

## 🔍 검색 및 필터링

### 아티스트 검색
- **대소문자 무시**: `toLowerCase()` 사용
- **부분 일치**: `includes()` 사용
- **실시간**: 입력 즉시 필터링
- **하이라이트**: 매칭 부분 강조

### 앨범 검색
- **아티스트별 우선**: `filterByArtist`가 있으면 해당 아티스트의 앨범 먼저 표시
- **전체 검색**: 검색어가 일치하면 다른 아티스트의 앨범도 표시
- **이중 검색**: 앨범 제목과 아티스트명 모두 검색
- **시각적 구분**: 매칭되지 않는 앨범은 투명도와 색상으로 구분

---

## ♿ 접근성

### 키보드 네비게이션
- **Tab**: 입력 필드로 이동
- **Enter/Space**: 드롭다운 열기/닫기, 항목 선택
- **Escape**: 드롭다운 닫기
- **화살표 키**: (향후 구현 가능)

### ARIA 속성
- `role="listbox"`: 드롭다운 목록
- `role="option"`: 각 항목
- `aria-selected`: 선택된 항목
- `aria-expanded`: 드롭다운 열림 상태
- `aria-haspopup`: 팝업 존재 여부
- `aria-label`: 버튼 설명

### 포커스 관리
- 선택 후 입력 필드로 포커스 유지
- 키보드 네비게이션 개선

---

## 🎨 색상 시스템

### 다크 모드
- **입력 필드 배경**: `--surface-2` (#121212)
- **드롭다운 배경**: `--surface-1` (#1A1A1A)
- **매칭되지 않는 앨범 호버**: #2A2A2A (회색)
- **검색 하이라이트**: `--search-highlight-dark`
- **포커스 테두리**: `--brand-pink`
- **호버 아이콘**: `--hover-cyan`

### 라이트 모드
- **입력 필드 배경**: `--surface-2` (#F3EBDD)
- **드롭다운 배경**: `--surface-1` (#FFF8EF)
- **매칭되지 않는 앨범 호버**: #E8DDD0 (베이지)
- **검색 하이라이트**: `--search-highlight-light`
- **포커스 테두리**: `--brand-pink`
- **호버 아이콘**: `--hover-cyan` (보라색)

---

## 📝 사용 예시

### 새 트랙 만들기
1. 아티스트 입력: "Sugar Rush" 입력 → 드롭다운에서 선택
2. 앨범 선택: "Sugar Rush Vol.1" 선택 → 아티스트 자동 동기화
3. 불일치 시: "Various" 앨범 선택 → 경고 Toast 표시 → "아티스트 변경" 클릭

### 새 앨범 만들기
1. 아티스트 입력: "Sugar Rush" 입력 → 드롭다운에서 선택
2. 앨범 제목 입력: "New Album" 입력
3. 저장: 폼 제출

---

## 🔧 확장 가능성

### 향후 개선 사항
- [x] 키보드 화살표 키 네비게이션 (구현 완료)
- [x] 클리어 버튼 (구현 완료)
- [ ] 아티스트/앨범 관리 페이지 연동
- [ ] API에서 동적으로 데이터 가져오기
- [ ] 최근 선택 항목 표시
- [ ] 즐겨찾기 기능

---

## 📚 관련 파일

### 컴포넌트
- `src/lib/components/ArtistSelect.svelte`
- `src/lib/components/AlbumSelect.svelte`

### 페이지
- `src/routes/tracks/new/+page.svelte`
- `src/routes/albums/new/+page.svelte`

### 상수
- `src/lib/constants/artists.ts`
- `src/lib/constants/albums.ts`

### 스타일
- `src/app.css` (artist-select-dropdown, album-select-dropdown 관련)

### 유틸리티
- `src/lib/utils/clickOutside.ts`
- `src/lib/utils/toastHelpers.ts` (Toast 헬퍼 함수)
- `src/lib/stores/toast.ts`

---

## ✅ 체크리스트

### 기능
- [x] 실시간 검색 필터링
- [x] 검색어 하이라이트
- [x] 드롭다운 선택
- [x] 커스텀 입력
- [x] 키보드 네비게이션
- [x] 외부 클릭 감지
- [x] 아티스트별 필터링 (앨범)
- [x] 매칭되지 않는 앨범 시각적 구분
- [x] 경고 Toast 시스템 (트랙 페이지)
- [x] 자동 동기화 (트랙 페이지)

### 디자인
- [x] 일관된 입력 필드 스타일
- [x] 드롭다운 레이아웃
- [x] 다크/라이트 모드 지원
- [x] 검색 하이라이트
- [x] 매칭되지 않는 앨범 스타일
- [x] 호버/포커스 상태
- [x] 아이콘 배치

### 접근성
- [x] ARIA 속성
- [x] 키보드 네비게이션
- [x] 포커스 관리
- [x] 스크린 리더 지원

---

**최종 업데이트**: 2025-12-13
**버전**: 1.1.0

## 📝 변경 이력

### v1.1.0 (2025-12-13)
- Toast 시스템 개선 사항 추가
- 유틸리티 함수 문서화 (`toastHelpers.ts`)
- 키보드 네비게이션 및 클리어 버튼 구현 완료 표시

### v1.0.0 (2025-12-12)
- 초기 문서 작성







