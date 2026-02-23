# 현재 상태 및 보완할 점 · 오류 · 코드 꼬인 부분

최종 점검 기준: 연결 끊김 수정 반영 후 상태입니다.

---

## 1. 지금 상태 (요약)

| 구분 | 상태 |
|------|------|
| **pnpm run build** | ✅ 완료됨. 단, Svelte 경고 여러 건 출력(아래 §7). |
| **svelte-check --threshold error** | ❌ API·일부 페이지에서 TypeScript 에러 다수(252건). |
| **추가 보완(§5)** | calendar $state ✅, option ✅, reports label→span ✅, DatePicker aria/키보드 일부 ✅, tasks 편집 초기값 정리 ✅. |
| **연결성·타입** | SUNO·트랙/태스크/앨범 연결 완료. `album.genres` 정리 완료. |

---

## 2. 오류 있는 부분

### 2.1 TypeScript (svelte-check 시)

- **API 라우트** (`src/routes/api/**/+server.ts`): `request.json()` 결과가 `unknown`, `db.prepare().first()` 등 반환 타입에 `results` 없음, `platform.env` 타입에 env 키 없음 등 → **타입 단언/인터페이스 보강 필요**.
- **페이지 일부**: `response.json()` 결과 `data`/`result`가 `unknown`, `album.genres` 타입에 없음 등 → **타입 단언 또는 공용 타입 정의 필요**.

→ **빌드는 되지만, `pnpm exec svelte-check --threshold error` 실행 시 에러가 나는 상태입니다.**

---

## 3. 코드 꼬인/불필요한 부분

### 3.1 ~~`(album as any).genres` 사용~~ ✅ 완료

- **상태**: `album.genres` / `album.genres ?? []`로 정리 완료. albums 경로에 `as any` 없음.

### 3.2 태스크 편집 폼 초기값

- **위치**: `src/routes/tasks/[id]/edit/+page.svelte`
- **내용**: `title`, `due`, `priority`, `description`을 빈 값/기본값으로 두고 `$effect`에서 `mockTasks.find`로 채움. 첫 렌더 직후 잠깐 잘못된 값이 보일 수 있음.
- **보완**: (선택) 초기 렌더 전에 id로 task를 찾아서 `$state(초기값)`으로 넣거나, 상세와 동일하게 `$derived(mockTasks.find(...))` 기반으로 폼을 구성하면 깜빡임을 줄일 수 있음.

---

## 4. 보완할 점 (기능/일관성)

### 4.1 TODO / 미구현

- **API 미연동**
  - `src/lib/api/suno.ts`: 대부분 함수에 `// TODO: 실제 API 연동` 존재.
  - `src/routes/api/upload/audio/+server.ts`: 스토리지 연동 TODO.
  - `src/routes/suno/projects/new/+page.svelte`: 프로젝트 생성 API TODO.
- **DELETE/PUT 미구현**
  - expenses, revenue, calendar, feedback, settings, collaboration 등에서 `// TODO: API DELETE 구현 후 활성화`, `// TODO: API PUT 구현 후 활성화` 등.
- **기타**
  - `src/routes/feedback/+page.svelte`: 답변 기능, 사용자 이름/아바타 TODO.
  - `src/routes/revenue/+page.svelte`: 성장률 계산 TODO.
  - `src/routes/collaboration/+page.svelte`: 사용자 ID/이름 TODO.

→ 오류라기보다 **추후 연동 시 채울 부분**입니다.

### 4.2 레거시/특수 처리

- **`src/scripts/ui.js`**: `// @ts-nocheck` 사용. 레거시 스크립트로 명시되어 있음. 추후 DOM 타입 보강 시 제거 검토.

### 4.3 목업 일관성

- **앨범**: `mockAlbums`에는 id 1만 `release_date_kr`/`release_date_global` 있음. 목록/상세는 `album.release_date_kr || '미정'` 등으로 처리 중이라 동작에는 문제 없음.
- **태스크**: id 1–4, 11–15가 `mockTasks`에 있음. 검색 API의 `/tasks/11` 등과 맞춰 둔 상태.
- **트랙**: `mockTracks`만 사용. 목록/상세 데이터 소스 통일됨.

---

## 5. 할 수 있는 일 (우선순위 순)

| 순서 | 내용 | 비고 |
|------|------|------|
| 1 | **빌드 경고 제거** | 아래 §7 표. DatePicker는 role=application 적용 후에도 div 비대화형 경고 남을 수 있음. |
| 2 | **TypeScript 에러 제거** | API: request.json() 결과 타입 단언/인터페이스, D1 results 타입. 페이지: response.json(), album.genres 등. |
| 3 | **선택** | 태스크 편집 폼 초기값으로 첫 렌더 깜빡임 완화(현재 $effect만 사용). |
| 4 | **추후** | API·스토리지·DELETE/PUT 연동, SUNO·피드백·협업 등 TODO 구현. |

---

## 6. 해야 할 부분 (체크리스트)

### 6.1 바로 손댈 수 있는 것

- [ ] **경고 제거**: expenses/revenue [id]/edit의 categoryInput 등 bind:this → 주석 추가 또는 $state 검토.
- [ ] **경고 제거**: DatePicker 캘린더 div — role=application 적용해도 non-interactive 경고 나오면, 로직 이동 또는 경고 무시 주석.
- [ ] **경고 제거**: ArtistSelect/AlbumSelect listElement bind:this, MoreMenuDropdown svelte:component/quoted class → 각각 주석 또는 수정.
- [ ] **TS 에러**: API 라우트에서 `const body = await request.json() as SomeType` 또는 zod 등으로 검증 후 타입 보장.
- [ ] **TS 에러**: 페이지에서 `const data = await response.json() as { ok: boolean; data?: T }` 등 공용 응답 타입 사용.

### 6.2 중기

- [ ] D1 db.prepare().first() 반환 타입, platform.env 타입 정의(또는 선언 보강).
- [ ] albums 타입에 genres 필드 추가하거나 mock/타입 정리.
- [ ] API·DELETE/PUT·SUNO·스토리지 등 실제 연동.

---

## 7. 빌드 시 경고 (현재 출력)

`pnpm run build` 시 아래 경고 출력. 제거 시 반응성·a11y·일관성 개선.

| 파일 | 내용 | 조치 |
|------|------|------|
| calendar/+page.svelte | searchQuery, selectedFilter 반응성 | let → $state() |
| expenses/[id]/edit, revenue/[id]/edit | categoryInput 등 bind:this 반응성 경고 | bind:this 유지 시 경고 무시 가능 |
| expenses/new, revenue/new, revenue/[id]/edit | `<option />` self-closing | `<option></option>` |
| reports/+page.svelte | label 연관 control 없음 | label for + id |
| DatePicker.svelte | aria-expanded, 클릭+키보드 | role/aria·keydown 처리 |

이 문서는 위와 같은 기준으로 “현재 상태·보완할 점·오류·코드 꼬인 부분”을 정리한 것입니다.
