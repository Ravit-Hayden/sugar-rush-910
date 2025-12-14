# 최근 작업 커밋 상세 정리

## 📅 작업 일시
- 최신 커밋: 2025-12-13 (Toast 시스템 개선 및 중복 코드 제거)
- 이전 커밋: 2025-12-04 (앨범 페이지 개선 및 버그 수정)

---

## 🎨 커밋 1: 앨범 페이지 UI/UX 개선 및 레이아웃 최적화
**커밋 해시:** `c729e95261c297bcd25d1c3b3f4c48c787aea15c`

### 📁 수정된 파일
- `src/routes/albums/+page.svelte` (233줄 변경)
- `src/app.css` (422줄 추가)

### 📊 변경 통계
- **538줄 추가**
- **117줄 삭제**

### 🔧 주요 변경사항 (작업 순서대로)

#### 1. 앨범 커버 이미지 처리 개선
- **변경 전:** placeholder 아이콘만 표시
- **변경 후:**
  - 실제 이미지가 있을 경우 표시하도록 구현
  - 이미지가 없거나 placeholder인 경우: 회색 배경 + 회색 Disc3 아이콘(투명도 30%) 표시
  - 이미지 로드 실패 시 자동 숨김 처리 (`onerror` 핸들러)
- **구현 위치:** `src/routes/albums/+page.svelte` 237-247줄

#### 2. 카드 호버/포커스 효과 통일
- **변경 사항:**
  - 카드에 `album-card` 클래스 추가
  - 재생 버튼에 `play-button`, `play-button-icon` 클래스 추가
  - CSS의 호버/포커스 효과 적용 (다른 페이지와 일관성 유지)
- **구현 위치:** 
  - `src/routes/albums/+page.svelte` 229줄
  - `src/app.css` (기존 `.album-card` 스타일 활용)

#### 3. 앨범 정보 확장
- **생성일 정보 추가:**
  - 모든 샘플 데이터에 `created_at` 필드 추가
  - 카드 하단에 생성일 표시 (예: "2024-09-15")
- **좋아요 수 추가:**
  - 모든 샘플 데이터에 `likes` 필드 추가
  - 재생 횟수 아래에 좋아요 수 표시
- **구현 위치:** `src/routes/albums/+page.svelte` 11-143줄 (데이터), 271-285줄 (UI)

#### 4. 배지 위치 최적화
- **변경 전:** 이미지 위 오버레이 (`absolute top-2 right-2`)
- **변경 후:** 제목과 같은 줄 우측
- **정렬 개선:**
  - 재생 시간과 우측 정렬 맞춤
  - `pr-0` 클래스 추가로 배지 우측 패딩 제거
  - CSS 규칙 추가: `.bg-surface-1 .badge-base.pr-0 { padding-right: 0 !important; }`
- **구현 위치:**
  - `src/routes/albums/+page.svelte` 258-263줄
  - `src/app.css` (배지 우측 정렬 CSS 규칙)

#### 5. 재생 아이콘 중심 정렬 수정
- **변경 사항:** `ml-1` 클래스 제거
- **결과:** 아이콘이 버튼 중앙에 정확히 배치
- **구현 위치:** `src/routes/albums/+page.svelte` 251줄

#### 6. 재생/좋아요 레이아웃 개선
- **변경 전:** "89 좋아요", "1,250회 재생" (숫자 왼쪽, 텍스트 오른쪽)
- **변경 후:**
  - "좋아요" (왼쪽) **89** (오른쪽, 호버색)
  - "재생" (왼쪽) **1,250** (오른쪽, 호버색)
- **구현:** `flex items-center gap-2`로 텍스트와 숫자 사이 간격 적용
- **숫자 색상:** `text-hover-cyan` 클래스 적용
- **구현 위치:** `src/routes/albums/+page.svelte` 271-280줄

#### 7. 버튼 정렬 및 간격 최적화
- **생성일과 버튼 같은 줄 배치:**
  - 생성일은 좌측, 버튼들은 우측 정렬
- **더보기 버튼 우측 정렬:**
  - `-mr-4` 적용으로 우측 끝에 배치
- **버튼 간 간격 조정:**
  - 초기: `gap-1` → `gap-0.5` → `gap` 제거 → 최종: `-ml-1` (음수 마진)
- **수직 정렬:**
  - `items-baseline` 및 `leading-none` 적용
- **구현 위치:** `src/routes/albums/+page.svelte` 283-292줄

#### 8. CSS 개선
- **배지 우측 정렬 CSS 규칙 추가:**
  ```css
  .bg-surface-1 .badge-base.pr-0 {
    padding-right: 0 !important;
  }
  ```
- **구현 위치:** `src/app.css`

---

## 🎨 커밋 3: Toast 경고 팝업 시스템 개선 및 중복 코드 제거
**커밋 해시:** `0c3d738`

### 📁 수정된 파일
- `src/app.css` (56줄 추가)
- `src/lib/components/Toast.svelte` (10줄 변경)
- `src/lib/components/ToastContainer.svelte` (4줄 변경)
- `src/lib/stores/toast.ts` (6줄 변경)
- `src/lib/utils/toastHelpers.ts` (신규, 43줄)
- `src/routes/tracks/new/+page.svelte` (리팩토링, 35줄 감소)

### 📊 변경 통계
- **154줄 추가**
- **66줄 삭제**

### 🔧 주요 변경사항

#### 1. Toast 위치 조정
- **변경 전:** `top-24 right-6` (96px)
- **변경 후:** `top-20 right-6` (80px, Header 바로 아래)
- **이유:** Header 높이(`h-20` = 80px)에 맞춰 더 가깝게 배치

#### 2. "무시" 버튼 포커스/호버 효과 추가
- **CSS 규칙 추가:** `.toast-dismiss-button` 전용 스타일
- **호버 효과:**
  - 다크 모드: `#17E1BC` (hover-cyan)
  - 라이트 모드: `#8A2BE2` (hover-cyan)
- **포커스 효과:** `#FF3DAE` (brand-pink)
- **포커스+호버:** 포커스 색상 유지

#### 3. 경고 아이콘 호버 효과 제거
- **클래스 추가:** `toast-icon`
- **CSS 규칙:** `pointer-events: none`, `color: inherit !important`
- **이유:** 경고 아이콘은 호버 효과 불필요

#### 4. 라이트 모드 경고 색상 개선
- **변경 전:** `#fffa00` (노란색, 라이트 모드에서 대비 낮음)
- **변경 후:** `#FF7A00` (오렌지, 라이트 모드에서 가시성 향상)
- **CSS 변수:** `[data-theme="light"] { --warn-fg: #FF7A00; }`

#### 5. Toast 제거 로직 공통화
- **함수 생성:** `clearToast(toastId: string | null): null`
- **위치:** `src/lib/utils/toastHelpers.ts`
- **효과:** 10곳 이상의 중복 코드 제거
- **사용:** `albumArtistMismatchToastId = clearToast(albumArtistMismatchToastId);`

#### 6. 경고 Toast 생성 로직 공통화
- **함수 생성:** `showAlbumArtistMismatchToast()`
- **위치:** `src/lib/utils/toastHelpers.ts`
- **효과:** 2곳의 중복 코드 제거
- **기능:**
  - `duration: 0` 자동 설정
  - action/dismissAction 버튼 자동 생성
  - "무시" 버튼 라벨 통일

#### 7. duration: 0 처리 개선
- **문제:** `duration || 3000` 패턴으로 `duration: 0`이 `3000`으로 변경됨
- **해결:**
  - `ToastContainer.svelte`: `duration !== undefined ? t.duration : 3000`
  - `Toast.svelte`: `if (duration !== undefined && duration > 0)`
  - `toast.ts`: `if (duration !== undefined && duration > 0)`
- **효과:** 경고 Toast가 사용자 선택 전까지 유지됨

---

## 🐛 커밋 2: 버그 수정 - 중복 이벤트 핸들러 제거 및 CSS 변수 중복 정의 해결
**커밋 해시:** `d51972d21844d21fd107dcd2aa9018df1f839260`

### 📁 수정된 파일
- `src/scripts/ui.js` (24줄 변경)
- `src/app.css` (6줄 변경)

### 📊 변경 통계
- **9줄 추가**
- **21줄 삭제**

### 🔧 버그 수정 사항 (작업 순서대로)

#### 1. SearchFilterBar 중복 이벤트 핸들러 충돌 해결

**문제 상황:**
- `ui.js`의 JavaScript 이벤트 리스너가 Svelte의 `on:click` 핸들러와 동시에 실행되어 충돌 발생
- 두 시스템이 같은 DOM 요소를 조작하려고 시도

**구체적 원인:**
- `ui.js` 84-95줄: `[role="option"]` 요소에 클릭 리스너 추가
- `SearchFilterBar.svelte` 104, 128, 147줄: `on:click` 핸들러 존재
- `ui.js` 91줄: `label.textContent` 직접 조작
- `SearchFilterBar.svelte` 82줄: Svelte 반응형 바인딩 (`{filterOptions.find(...)?.label}`)

**충돌 결과:**
- 상태 동기화 실패 가능성
- DOM 조작 충돌
- 예측 불가능한 UI 동작

**해결 방법:**
- `ui.js`에서 `[role="option"]` 클릭 리스너 완전 제거
- 옵션 클릭 처리는 Svelte 컴포넌트의 `selectOption()` 함수만 사용
- 외부 클릭 감지 및 Escape 키 처리는 유지 (드롭다운 닫기 기능)
- 주석 추가로 Svelte 컴포넌트가 이벤트를 처리함을 명시

**구현 위치:**
- `src/scripts/ui.js` 61-96줄 (수정)
- 제거된 코드: 84-95줄의 옵션 클릭 리스너

#### 2. CSS 변수 중복 정의 제거

**문제 상황:**
- `--badge-medium-yellow` 변수가 같은 CSS 블록에서 두 번 정의됨
- 첫 번째 정의가 무시되어 무용 코드 발생

**구체적 위치:**
- **다크 모드 (`:root`):**
  - 37줄: `--badge-medium-yellow: #FFD700;` (무시됨)
  - 47줄: `--badge-medium-yellow: #FFEB3B;` (실제 사용됨)
- **라이트 모드 (`[data-theme="light"]`):**
  - 94줄: `--badge-medium-yellow: #FF8C00;` (무시됨)
  - 104줄: `--badge-medium-yellow: #FFC107;` (실제 사용됨)

**해결 방법:**
- 중복 정의 제거 및 최종 값만 유지
- **다크 모드:** 37줄의 `#FFD700` 제거, 47줄의 `#FFEB3B` 유지
- **라이트 모드:** 94줄의 `#FF8C00` 제거, 104줄의 `#FFC107` 유지

**구현 위치:**
- `src/app.css` 37줄, 47줄, 94줄, 104줄

**결과:**
- 코드 명확성 향상
- 무용 코드 제거
- 각 모드에서 하나의 값만 사용

---

## 🔄 복구 방법

### 전체 복구 (두 커밋 모두 되돌리기)
```bash
# 현재 상태에서 두 커밋 전으로 되돌리기
git reset --hard HEAD~2

# 또는 특정 커밋 해시로 되돌리기
git reset --hard <이전_커밋_해시>
```

### 부분 복구 (특정 커밋만 되돌리기)

#### 버그 수정 커밋만 되돌리기
```bash
# 버그 수정 커밋만 되돌리기 (앨범 페이지 개선은 유지)
git revert d51972d21844d21fd107dcd2aa9018df1f839260
```

#### 앨범 페이지 개선 커밋만 되돌리기
```bash
# 앨범 페이지 개선 커밋만 되돌리기 (버그 수정은 유지)
git revert c729e95261c297bcd25d1c3b3f4c48c787aea15c
```

### 특정 파일만 복구

#### 앨범 페이지만 이전 상태로
```bash
# 특정 커밋의 파일만 복구
git checkout c729e95~1 -- src/routes/albums/+page.svelte
```

#### ui.js만 이전 상태로
```bash
# 버그 수정 전 상태로 복구
git checkout d51972d~1 -- src/scripts/ui.js
```

#### CSS만 이전 상태로
```bash
# 특정 커밋의 CSS만 복구
git checkout <커밋_해시> -- src/app.css
```

### 커밋 히스토리 확인
```bash
# 최근 5개 커밋 확인
git log -5 --oneline

# 상세 커밋 정보 확인
git show c729e95
git show d51972d
```

### 변경사항 확인 (되돌리기 전)
```bash
# 현재 작업 디렉토리와 마지막 커밋 비교
git diff HEAD

# 특정 커밋과 비교
git diff c729e95 HEAD
```

---

## 📝 작업 순서 요약

### 1단계: 앨범 페이지 개선 (커밋 1)
1. 앨범 커버 이미지 처리 개선
2. 카드 호버/포커스 효과 통일
3. 앨범 정보 확장 (생성일, 좋아요)
4. 배지 위치 최적화
5. 재생 아이콘 중심 정렬 수정
6. 재생/좋아요 레이아웃 개선
7. 버튼 정렬 및 간격 최적화
8. CSS 개선

### 2단계: 버그 수정 (커밋 2)
1. SearchFilterBar 중복 이벤트 핸들러 충돌 해결
2. CSS 변수 중복 정의 제거

---

## ✅ 최종 결과

### 앨범 페이지
- ✅ 실제 이미지 표시 및 기본 이미지 처리
- ✅ 카드 호버/포커스 효과 통일
- ✅ 생성일 및 좋아요 수 표시
- ✅ 배지 위치 최적화 및 정렬 개선
- ✅ 재생/좋아요 레이아웃 개선
- ✅ 버튼 정렬 및 간격 최적화

### 버그 수정
- ✅ 중복 이벤트 핸들러 제거로 안정성 향상
- ✅ CSS 변수 중복 정의 제거로 코드 명확성 향상
- ✅ 상태 동기화 문제 해결
- ✅ DOM 조작 충돌 방지

---

## 🔍 참고 정보

### 커밋 해시
- 앨범 페이지 개선: `c729e95261c297bcd25d1c3b3f4c48c787aea15c`
- 버그 수정: `d51972d21844d21fd107dcd2aa9018df1f839260`

### 주요 변경 파일
- `src/routes/albums/+page.svelte` (앨범 페이지 전체 개선)
- `src/app.css` (배지 정렬 CSS + 변수 중복 제거)
- `src/scripts/ui.js` (중복 이벤트 리스너 제거)

### 백업 위치
- `C:\Development\sugar-rush-1202` (이전 백업 폴더)

