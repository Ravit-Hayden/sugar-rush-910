# 개발 인수인계 문서 — Sugar Rush 910

**대상:** 이어서 이 사이트를 개발하는 개발자·AI(클로드 코드 등)  
**목적:** 필요한 정보를 한곳에 모아, 바로 개발을 이어갈 수 있게 함.

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **프로젝트명** | Sugar Rush 910 (관리자/대시보드) |
| **환경** | Windows, pnpm, Node ≥ 20 |
| **프레임워크** | SvelteKit (minimal 템플릿) |
| **스타일** | Tailwind CSS v4.1.13 + @tailwindcss/vite 4.1.13 |
| **폰트** | Pretendard Variable (CDN) |
| **아이콘** | lucide-svelte (다운로드 SVG, 16px, 컨테이너 24×24) |
| **설정** | vite.config.mts |
| **배포** | Cloudflare (adapter-cloudflare, wrangler) |

---

## 2. 반드시 읽을 문서 (순서)

개발·수정을 **시작하기 전에** 아래 순서로 읽습니다.

| 순서 | 문서 | 용도 |
|------|------|------|
| 1 | **docs/DEVELOPMENT_GUIDELINES.md** | 개발 전·중·후 절차, 기술 스택, 레이아웃·색상·폴더 관례, 작업 후 체크리스트 |
| 2 | **.cursorrules** | 스택, 레이아웃, 반응형, 테마, 금칙어, 접근성, API·보안 |
| 3 | **docs/SITE_RULES.md** | 사이트 규칙 17개 + 보완 규칙 A~H (복사·삭제·알림·연결성·디자인 등) |
| 4 | **docs/STATUS_AND_IMPROVEMENTS.md** | 현재 상태, 오류, 보완할 점, 해야 할 부분, 빌드 경고 표 |
| 5 | **docs/BUTTON_STYLES_REFERENCE.md** | 버튼·인풋·테마 변수 (필요 시) |
| 6 | **docs/CONNECTIVITY_ISSUES.md** | 연결 끊김 정리 (목록↔상세 등, 2026-02 기준 대부분 수정 완료) |

---

## 3. 실행·빌드·검사

```bash
# 의존성
pnpm install

# 개발 서버 (기본)
pnpm run dev

# 개발 서버 (포트 5173)
pnpm run dev:5173

# 프로덕션 빌드
pnpm run build

# 에러만 검사 (경고는 무시)
pnpm exec svelte-check --threshold error

# 미리보기
pnpm run preview
```

- **작업 후:** `pnpm run build` 또는 `svelte-check --threshold error`로 오류 없음을 확인할 것 (DEVELOPMENT_GUIDELINES.md §3).

---

## 4. 지켜야 할 규칙 요약

- **복사** → 복사 성공/실패 시 **토스트 알림** 필수.
- **삭제** → **확인(confirm/모달)** 후에만 실행.
- **같은 종류/위치 UI** → 같은 클래스·같은 디자인 (검색창, 인풋, 캘린더, 카드 헤더 등).
- **색·라인** → 지정된 CSS 변수만, 라인 두께 1종 (`border-border-subtle` 등).
- **버튼** → `app.css`·BUTTON_STYLES_REFERENCE.md 기준 (Primary/Outline/Icon 구분).
- **타입** → 같은 엔티티는 공통 타입·필드명 (`$lib/types` 등).
- **목업** → 기능이 바로 켜지도록 목업 준비, API 연동 시 교체만 하면 되게.
- **연결성** → 목록↔상세↔편집·링크·id·데이터 소스 일치.
- **금칙어** → 공개 UI·문서·알림에 "AI" 문자열 금지 (내부 코드/DB만 허용).
- **API·보안** → API 키·시크릿·DB는 서버만, 클라이언트·번들·로그에 노출 금지.

---

## 5. 레이아웃·반응형

- **Header:** 56px 고정.
- **Sidebar:** 데스크톱 고정, 태블릿 축소(아이콘/드로어), 모바일 드로어.
- **검색창:** 데스크톱 풀, 태블릿 중간 폭, 모바일 아이콘 탭으로 축소.
- **Main:** 12-col grid. 반응형: &lt;md 1열, md~&lt;lg 2열, ≥lg 3열.
- 카드 h-72, KPI만 h-80. Right panel 없음.

---

## 6. 폴더·구조

| 경로 | 용도 |
|------|------|
| `src/routes/` | 페이지 (리소스, [id], [id]/edit, new) |
| `src/routes/api/` | API 엔드포인트 (+server.ts) |
| `src/lib/components/` | 공통 컴포넌트 |
| `src/lib/types/` | 공통 타입 |
| `src/lib/mocks/` | 목업 (목록·상세 동일 소스로 통일) |
| `docs/` | 개발·상태·규칙 문서 |

---

## 7. 현재 상태 (요약)

| 구분 | 상태 |
|------|------|
| **pnpm run build** | ✅ 완료됨. Svelte 경고 여러 건 있음 (STATUS_AND_IMPROVEMENTS.md §7 참고). |
| **svelte-check --threshold error** | ❌ API·일부 페이지에서 TypeScript 에러 다수 (request.json() unknown, D1 results, album.genres 등). |
| **연결성** | SUNO 워드→프로젝트, 최근 활동→프로젝트, 트랙/태스크/앨범 목록↔상세·편집, 검색→태스크 반영 완료. |
| **타입** | `(album as any).genres` → `album.genres` 정리 완료. calendar/expenses/revenue 일부 페이지에 response.json() 타입 단언 적용 완료. |
| **일부 경고** | DatePicker 캘린더 div(svelte-ignore 적용), revenue [id]/edit의 platformInput/amountInput → $state 적용 완료. |

---

## 8. 남은 작업 (우선순위)

### 8.1 바로 손댈 수 있는 것

- **빌드 경고 제거**  
  - expenses/[id]/edit의 **categoryInput, amountInput** bind:this → 주석 또는 `$state` 검토 (revenue [id]/edit는 이미 $state 적용됨).  
  - **ArtistSelect/AlbumSelect** listElement bind:this, **MoreMenuDropdown** svelte:component·quoted class → 주석 또는 수정.  
  - STATUS_AND_IMPROVEMENTS.md §7 표 참고.
- **TypeScript 에러**  
  - **API 라우트:** `request.json()` 결과 타입 단언 또는 zod 검증, D1 `results`·`platform.env` 타입 정의.  
  - **페이지:** `response.json()` 결과에 `as { ok: boolean; data?: T }` 등 공용 타입 사용, albums 타입에 `genres` 추가 등.

### 8.2 선택

- **태스크 편집** (`src/routes/tasks/[id]/edit/+page.svelte`): 첫 렌더 시 폼 깜빡임 완화 (초기값을 id 기반으로 넣거나 $derived 기반 폼 구성).

### 8.3 추후

- API·스토리지·DELETE/PUT 연동.  
- SUNO 실제 API 연동 (`src/lib/api/suno.ts`, 프로젝트 생성 등).  
- 피드백 답변·사용자 이름/아바타, 수익 성장률, 협업 사용자 ID/이름 등 TODO 구현.

자세한 체크리스트는 **docs/STATUS_AND_IMPROVEMENTS.md** §5·§6·§7 참고.

---

## 9. 참고 문서 목록

| 문서 | 용도 |
|------|------|
| DEVELOPMENT_GUIDELINES.md | 개발 전·중·후 절차, 체크리스트 |
| STATUS_AND_IMPROVEMENTS.md | 현재 상태·보완점·오류·빌드 경고 |
| SITE_RULES.md | 사이트 규칙 17개 + 보완 규칙 |
| CONNECTIVITY_ISSUES.md | 연결 끊김 정리 (대부분 수정 완료) |
| BUTTON_STYLES_REFERENCE.md | 버튼·인풋·테마 변수 |
| API_TODO.md | API 수정·검색 API 등 |
| 기타 docs/*.md | SUNO, 디자인, 업로드 제한, 번역 등 (필요 시 참고) |

---

## 10. 작업 시작 시 체크리스트

- [ ] **docs/DEVELOPMENT_GUIDELINES.md**를 먼저 읽음.
- [ ] .cursorrules, docs/SITE_RULES.md 필요 시 확인.
- [ ] 수정 범위가 목록·상세·편집이면 **데이터 소스·연결성** 확인 (STATUS_AND_IMPROVEMENTS.md, CONNECTIVITY_ISSUES.md).
- [ ] 작업 후 **pnpm run build** 또는 **svelte-check --threshold error** 실행해 오류 없음 확인.
- [ ] 보완할 점·꼬인 코드 없음 확인 후, 필요 시 STATUS_AND_IMPROVEMENTS.md 갱신.

---

**이 문서와 위 순서대로 참조 문서를 읽으면, 이어서 개발을 진행할 수 있습니다.**
