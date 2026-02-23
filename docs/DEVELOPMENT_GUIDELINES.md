# 개발 지침 — 개발 전 반드시 읽을 것

**어떤 개발·수정·기능 추가를 하기 전에도, 먼저 이 문서를 읽고 따라야 합니다.**  
이렇게 해야 언제 어느 순간 개발해도 일관되고 문제가 나지 않습니다.

- **사람 개발자**: 작업 시작 전 이 문서를 열어 읽고, 작업 후 체크리스트를 따른다.
- **AI·에이전트**: 세션 또는 작업 지시를 받으면, **첫 번째로 이 문서(DEVELOPMENT_GUIDELINES.md)를 읽은 뒤** 코드 변경·추가를 진행한다. 작업 완료 후에는 "작업이 끝난 뒤" 절차와 체크리스트를 적용한다.

---

## 1. 개발 시작 전 (매번 할 일)

1. **이 문서(DEVELOPMENT_GUIDELINES.md)를 먼저 읽는다.**
2. **관련 참조 문서**를 필요 시 확인한다.
   - `.cursorrules` — 스택·레이아웃·색상·금칙·보안
   - `docs/SITE_RULES.md` — 사이트 규칙 17개 + 보완 규칙
   - `docs/BUTTON_STYLES_REFERENCE.md` — 버튼·인풋·테마 변수
3. **수정 범위**가 목록·상세·편집에 걸리면 **데이터 소스·연결성**을 확인한다.  
   - `docs/CONNECTIVITY_ISSUES.md`, `docs/STATUS_AND_IMPROVEMENTS.md` 참고 가능.

---

## 2. 작업 중 지키는 것

- **같은 종류 UI** → 같은 클래스·같은 동작 (검색창, 인풋, 드롭다운, 캘린더, 스크롤바 등).
- **같은 위치 UI** → 같은 디자인 (카드 헤더, 리스트 행, 폼 블록 등).
- **복사** → 복사 성공/실패 시 **토스트 알림** 필수.
- **삭제** → **확인 질문(confirm/모달)** 후에만 실행.
- **알림** → 커스텀 토스트/모달 등 **공통 디자인·기능** 사용.
- **색·라인** → 지정된 테마 변수만, 라인 두께 1종.
- **버튼** → `app.css`·`BUTTON_STYLES_REFERENCE.md` 기준. Primary / Outline / Icon 구분 유지.
- **타입** → 같은 엔티티는 같은 필드명·`$lib/types` 등 공통 타입 사용.
- **목업** → 기능이 바로 켜지도록 목업 준비. API 연동 시 교체만 하면 되게.
- **연결성** → 목록↔상세↔편집·링크·id·데이터 소스 일치.
- **부족한 부분** 발견 시 → 바로 보완점을 찾아 알리고, 필요 시 보완까지 진행.

---

## 3. 작업이 끝난 뒤 (반드시 할 일)

1. **빌드·정적 검사**
   - `pnpm run build` 또는 `pnpm exec svelte-check --threshold error` 실행.
   - 오류가 있으면 수정 후 다시 실행.
2. **보완할 점**
   - 새로 생긴 TODO, 미완 로직, 꼬인 코드가 없는지 확인.
3. **정상 상태 확인**
   - 꼬인 코드 제거, 정상 동작 여부 확인.
4. **보완할 부분이 없을 때까지** 위를 순서대로 반복한다.

---

## 4. 기술 스택 (고정)

| 항목 | 내용 |
|------|------|
| 프레임워크 | SvelteKit (sv CLI minimal) |
| 패키지 매니저 | pnpm 9.12.0, Node ≥ 20 |
| 스타일 | Tailwind CSS 4.x + @tailwindcss/vite 4.x |
| 폰트 | Pretendard Variable (CDN) |
| 아이콘 | lucide-svelte (다운로드 SVG, 16px, 컨테이너 24×24) |
| 설정 파일 | vite.config.mts |
| (선택) | zod |

---

## 5. 레이아웃·반응형

- **Header**: 56px 고정.
- **Sidebar**: 데스크톱 고정, 태블릿 축소(아이콘/드로어), 모바일 드로어.
- **검색창**: 데스크톱 풀, 태블릿 중간 폭, 모바일 아이콘 탭으로 축소.
- **Main**: 12-col grid. 반응형 &lt;md 1열, md~&lt;lg 2열, ≥lg 3열.
- 카드 h-72, KPI만 h-80. Right panel 없음.

---

## 6. 색상·테마

- **지정된 CSS 변수만 사용**: `--brand-pink`, `--hover-point`, `--text-on-hover`, `--text-base`, `--text-muted`, `--border-subtle`, `--surface-1`, `--surface-2`, `--bg` 등.
- **라인**: 두께 1종, `border-border-subtle` 등 문서화된 것만.
- **포커스** 시 brand-pink 우선. **선택·활성** 위 호버 시 호버 시안/보라색 미적용.

---

## 7. 폴더·구조 관례

- **라우트**: `src/routes/리소스`, `src/routes/리소스/[id]`, `src/routes/리소스/[id]/edit`, `src/routes/리소스/new`.
- **공통 컴포넌트**: `src/lib/components/`.
- **타입**: `src/lib/types/`.
- **목업**: `src/lib/mocks/` (목록·상세가 같은 데이터 소스 쓰도록 통일).
- **API**: `src/routes/api/` (서버 전용, 키·시크릿 노출 금지).

---

## 8. 참조 문서 정리

| 문서 | 용도 |
|------|------|
| **docs/DEVELOPMENT_GUIDELINES.md** | 개발 전·중·후 절차, 이 문서 |
| **.cursorrules** | 스택, 레이아웃, 색상, 금칙, 접근성, API·보안 |
| **docs/SITE_RULES.md** | 사이트 규칙 1~17, 보완 규칙 A~H |
| **docs/BUTTON_STYLES_REFERENCE.md** | 버튼·인풋·테마 변수, 배치·보더 규칙 |
| **docs/CONNECTIVITY_ISSUES.md** | 연결 끊김 정리(목록↔상세 등) |
| **docs/STATUS_AND_IMPROVEMENTS.md** | 현재 상태·보완점·오류·꼬인 코드 정리 |

---

## 9. 작업 후 체크리스트 (복사해서 사용)

- [ ] `docs/DEVELOPMENT_GUIDELINES.md` 시작 전 읽음
- [ ] 복사 시 토스트 알림 적용 여부
- [ ] 삭제 시 확인 질문 적용 여부
- [ ] 같은 종류/위치 UI 공통 디자인·클래스 사용
- [ ] 목록·상세·편집 데이터 소스·연결성 일치
- [ ] `pnpm run build` 또는 `svelte-check` 통과
- [ ] 보완할 점·꼬인 코드 없음 확인
- [ ] (필요 시) STATUS_AND_IMPROVEMENTS.md·CONNECTIVITY_ISSUES.md 갱신

---

**이 지침을 먼저 보고, 뭐든 시작해서 늘 일관되게 개발합니다.**
