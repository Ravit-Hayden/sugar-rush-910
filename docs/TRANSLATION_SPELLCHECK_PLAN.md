# 번역·맞춤법 통합 구현 계획 (정밀 버전)

이 문서는 **이전 논의(DeepL Free·맞춤법·보안 원칙)** 와 **API 외부 노출 금지·보안 철저** 원칙을 합쳐, 구현 단계까지 디테일하게 정리한 계획서다.

---

## 1. 보안 원칙 (최우선 · 절대 준수)

### 1.1 API·키·시크릿

| 항목 | 규칙 | 금지 사항 |
|------|------|-----------|
| **외부 노출** | 모든 API는 **외부에 노출되지 않는다**. 클라이언트가 외부 서비스(DeepL 등)를 **직접 호출하지 않는다**. | 클라이언트에서 DeepL URL·키·토큰 사용 금지. |
| **키·시크릿** | API 키·시크릿·DB 접속 정보는 **서버 환경 변수(또는 시크릿 저장소)에만** 존재한다. | `import.meta.env`에 키 노출, 번들·소스맵·로그·에러 메시지에 키/시크릿 포함 금지. |
| **에러 메시지** | 외부 API 실패 시 클라이언트에 반환하는 메시지는 **사용자용 안내 문구만**. 내부 에러 코드·스택·URL·키 일부 절대 포함 금지. | `"DeepL API key invalid"`, `"429"` 등 노출 금지. |

### 1.2 서버 경유

- **번역**: DeepL 호출은 **우리 백엔드에서만** 수행. 클라이언트는 **우리 도메인의 `/api/translate`(또는 동일 정책의 서버 라우트)만** 호출.
- **인증·권한**: `/api/translate`는 필요 시 세션·토큰 등으로 **인증된 사용자만** 호출 가능하도록 구성. (구현 단계에서 정책 확정.)
- **입력 검증**: 서버에서 `text` 길이·`targetLang` 화이트리스트 검증. 비정상 요청은 400 등으로 거부.
- **레이트 리밋**: IP 또는 사용자 단위로 요청 횟수 제한 검토. (한도는 DeepL 월 한도와 연동.)

---

## 2. 기능 원칙 (사이트 무오류·무피해)

### 2.1 번역·맞춤법의 위치

- **부가 기능**이다. API 실패·한도 초과·키 미설정 시에도 **페이지 동작·저장·제출에는 영향 없음**.
- **에러는 모두 잡아서** 토스트/안내만 하고, **예외 전파·크래시·폼 블로킹 금지**.
- 적용 대상: **프롬프트, 가사, 그 외 “언어적인” 텍스트 입력**이 있는 곳만. (숫자·날짜만 쓰는 필드는 제외.)

### 2.2 번역 실패 시 동작

- **사용자 입력값은 절대 덮어쓰지 않는다.** 실패 시 해당 textarea 내용은 그대로 둠.
- **토스트/알림만** 표시. 전역 오류 화면·모달 강제 종료·폼 초기화 금지.

### 2.3 한도 정책 (DeepL Free)

- **무료만 사용.** DeepL API Free: 월 50만 자.
- **한도 초과 시**: API가 429 등 반환 → 서버는 `LIMIT_EXCEEDED` 등으로 통일 → 클라이언트는 **“한도 초과” 안내 후 사용 금지** (번역 버튼 비활성화 또는 클릭 시 같은 안내만 반복, 추가 요청 금지).

---

## 3. 맞춤법: 브라우저 `spellcheck="true"` (0원, 100% 합법)

### 3.1 특성

- **비용·법적 이슈 없음.**
- **다국어**: `<textarea spellcheck="true" lang="ko">` / `lang="en"` / `lang="ja"` 등 **입력 언어 힌트**로 브라우저 맞춤법 검사. (설치된 사전 범위 내.)
- **위험 없음**: 끄면 기존과 동일, 켜도 레이아웃·저장·제출 로직 변경 없음.

### 3.2 적용 규칙

- 위 “언어적인” 텍스트가 입력되는 **textarea**에만 적용.
- **필수**: `spellcheck="true"`.
- **선택**: `lang="ko"` | `lang="en"` | `lang="ja"` 등 입력 목적에 맞게 지정. 미지정이어도 동작에는 문제 없음.

---

## 4. 번역: DeepL API Free (월 50만자, 한도 초과 시 사용 금지)

### 4.1 특성

- **다국어**: DeepL Free도 Pro와 동일한 **38개 언어** 지원 (한국어, 영어, 일본어, 중국어, 독일어, 프랑스어 등).  
  [Supported languages](https://developers.deepl.com/docs/getting-started/supported-languages) 참고.
- **자동 감지**: `source_lang`를 `"auto"`로 두면 입력 언어 자동 감지 가능.
- **한도**: 월 50만 글자. 초과 시 API 429 등 → **“한도 초과” 안내 후 사용 금지**.

### 4.2 보안·구현 요구사항

- DeepL API 키는 **서버 환경 변수**에만 둠. (예: `DEEPL_AUTH_KEY`.)
- 클라이언트는 **우리 서버의 `POST /api/translate`만** 호출. 키·DeepL URL 노출 없음.
- 서버에서만 DeepL 요청·응답 처리. 모든 예외 catch, JSON 응답만 반환.

---

## 5. API 계약 (서버 `POST /api/translate`)

### 5.1 요청

- **Method**: `POST`
- **Path**: `/api/translate` (또는 프로젝트 정책에 맞는 동일 보안의 경로)
- **Body (JSON)**:
  - `text: string` (필수, 번역할 텍스트)
  - `targetLang: string` (필수, 대상 언어 코드. 화이트리스트 검증)
  - `sourceLang?: string` (선택, 미지정 시 `"auto"`로 자동 감지)

- **검증**: 서버에서 `text` 최대 길이(예: 50_000자), `targetLang` 허용 목록 검증. 실패 시 400.

### 5.2 응답 (항상 JSON)

| 상황 | HTTP | Body 예시 |
|------|------|-----------|
| 성공 | 200 | `{ "ok": true, "translated": "번역된 문자열" }` |
| 서비스 불가 (키 없음, DeepL 오류, 타임아웃 등) | 200 또는 503 | `{ "ok": false, "code": "UNAVAILABLE", "error": "번역 서비스를 일시적으로 사용할 수 없습니다." }` |
| 한도 초과 | 200 또는 429 | `{ "ok": false, "code": "LIMIT_EXCEEDED", "error": "이번 달 번역 한도를 모두 사용했습니다." }` |
| 잘못된 요청 | 400 | `{ "ok": false, "code": "BAD_REQUEST", "error": "잘못된 요청입니다." }` |

- **에러 메시지**: 사용자용 안내만. 내부 에러 코드·키·URL 노출 금지.

### 5.3 클라이언트 공용 헬퍼

- **함수**: `translateText(text: string, targetLang: string, sourceLang?: string): Promise<{ translated?: string; error?: string; code?: string }>`
- **동작**: `POST /api/translate`만 호출. throw 하지 않고 반환값으로 성공/실패 전달.
- **위치**: 예) `$lib/translate.ts` 또는 `$lib/api/translate.ts`

---

## 6. UI/UX 규칙

### 6.1 번역 버튼

- 각 대상 textarea **옆 또는 위**에 “번역” 버튼(＋ 필요 시 대상 언어 선택 드롭다운).
- **로딩 중**: 버튼 비활성화 + 로딩 표시.
- **성공**: 해당 textarea 내용만 `translated`로 **치환**.
- **실패**: 토스트/알림만. `code === 'LIMIT_EXCEEDED'`면 “이번 달 번역 한도를 모두 사용했습니다. 다음 달에 다시 이용해 주세요.” 표시 후, **번역 버튼 비활성화** 또는 클릭 시 같은 안내만 반복.
- **실패 시 입력값**: 절대 덮어쓰지 않음.

### 6.2 맞춤법

- 별도 버튼 없이 **textarea에 `spellcheck="true"` + 필요 시 `lang`** 만 적용. (기존 “맞춤법 검사” 안내 버튼 유지 여부는 선택.)

---

## 7. 적용 위치 (파일·요소 단위)

### 7.1 맞춤법 적용 (spellcheck + lang)

| 번호 | 경로 | 파일 | 대상 요소 | 비고 |
|------|------|------|-----------|------|
| 1 | SUNO 프롬프트 | `src/routes/suno/prompts/+page.svelte` | 추가/편집 모달 내 “내용” textarea | `spellcheck="true"`, `lang` 선택 |
| 2 | 가사 편집 | `src/lib/components/suno/LyricsEditor.svelte` | 가사 입력 textarea | `spellcheck="true"`, `lang="ko"` 등 |
| 3 | 프로젝트 상세 | `src/routes/suno/projects/[id]/+page.svelte` | 가사·프롬프트 textarea | 각각 목적에 맞는 lang |
| 4 | 프로젝트 생성 | `src/routes/suno/projects/new/+page.svelte` | 설명 등 textarea | spellcheck, lang 선택 |
| 5 | 보컬 | `src/routes/suno/vocals/+page.svelte` | 텍스트 입력 textarea | 동일 |
| 6 | 뮤직비디오 생성 | `src/routes/music-videos/create/+page.svelte` | AI 프롬프트 textarea | 동일 |
| 7 | 피드백 | `src/routes/feedback/+page.svelte` | 의견/내용 textarea | 동일 |
| 8 | 업로드 메모 | `src/routes/upload/+page.svelte` | 메모 textarea | “언어적” 필드만 |
| 9 | 설정 등 | `src/routes/settings/+page.svelte` | 언어적 입력 textarea | 동일 |
| 10 | 릴리즈·앨범 등 | `src/routes/releases/+page.svelte`, `src/routes/albums/new/+page.svelte` | 메모/설명 textarea | “언어적” 필드만 |
| 11 | 협업·캘린더·지출/수익 등 | 해당 +page.svelte | 설명/메모 textarea | “언어적” 필드만 |

### 7.2 번역 버튼 적용

| 번호 | 경로 | 파일 | 위치 | 비고 |
|------|------|------|------|------|
| 1 | SUNO 프롬프트 | `src/routes/suno/prompts/+page.svelte` | 추가/편집 모달 “내용” 라벨 옆 | 기존 “한글→영어” → DeepL 연동으로 교체 |
| 2 | 가사 편집 | `src/lib/components/suno/LyricsEditor.svelte` | 가사 textarea 위/옆 | “번역” 버튼 + 대상 언어 선택 |
| 3 | 프로젝트 상세 | `src/routes/suno/projects/[id]/+page.svelte` | 가사·프롬프트 영역 | 각 textarea별 번역 버튼 |
| 4 | (선택) 보컬 | `src/routes/suno/vocals/+page.svelte` | 텍스트 영역 | 동일 |
| 5 | (선택) 뮤직비디오 생성 | `src/routes/music-videos/create/+page.svelte` | AI 프롬프트 | 동일 |

---

## 8. 구현 단계 (디테일)

### Phase 0: 준비

- [ ] `.env.example`에 `DEEPL_AUTH_KEY=` (값 비움) 추가. 실제 키는 서버 환경에만 설정.
- [ ] DeepL 지원 언어 코드 목록 확정 (예: `EN`, `KO`, `JA`, `ZH` 등). 서버·클라이언트 화이트리스트 공유.

### Phase 1: 서버 API (보안·에러 처리 우선)

- [ ] `src/routes/api/translate/+server.ts` (또는 동일 정책 경로) 생성.
- [ ] 환경 변수에서 `DEEPL_AUTH_KEY` 읽기. **없으면** 200 + `{ ok: false, code: "UNAVAILABLE" }` 반환. (키 노출 금지.)
- [ ] Body 검증: `text`(문자열, 최대 길이), `targetLang`(화이트리스트). 실패 시 400 + `{ ok: false, code: "BAD_REQUEST" }`.
- [ ] DeepL API 호출 (서버에서만). `api-free.deepl.com` 사용.
- [ ] DeepL 429 / character limit exceeded → 200 + `{ ok: false, code: "LIMIT_EXCEEDED", error: "이번 달 번역 한도를 모두 사용했습니다." }`.
- [ ] 그 외 DeepL 오류·네트워크 오류·타임아웃 → try/catch 후 200 + `{ ok: false, code: "UNAVAILABLE", error: "번역 서비스를 일시적으로 사용할 수 없습니다." }`. **내부 로그에는 상세 가능, 응답에는 사용자용 문구만.**
- [ ] 성공 시 200 + `{ ok: true, translated: "..." }`.
- [ ] 모든 분기에서 **JSON만 반환**, 예외 전파 금지.

### Phase 2: 클라이언트 헬퍼

- [ ] `$lib/translate.ts` (또는 `$lib/api/translate.ts`) 생성.
- [ ] `translateText(text, targetLang, sourceLang?)` 구현. 내부에서 `fetch('/api/translate', { method: 'POST', ... })`만 호출.
- [ ] throw 없이 `{ translated?, error?, code? }` 반환. 네트워크 오류도 catch 후 `code: 'UNAVAILABLE'` 등으로 반환.

### Phase 3: UI – 프롬프트

- [ ] `suno/prompts/+page.svelte`: 추가/편집 모달 “한글→영어” 버튼을 DeepL 연동으로 교체. `translateText` 호출, 로딩·성공·실패·한도 초과 처리.
- [ ] 해당 모달 textarea에 `spellcheck="true"` 및 `lang` 적용 확인.

### Phase 4: UI – 가사·프로젝트

- [ ] `LyricsEditor.svelte`: 가사 textarea에 `spellcheck="true"`, `lang` 적용. “번역” 버튼 추가, `translateText` 연동.
- [ ] `suno/projects/[id]/+page.svelte`: 가사·프롬프트 textarea에 spellcheck 적용. 각 영역에 번역 버튼 추가 및 연동.

### Phase 5: 맞춤법 일괄 적용

- [ ] §7.1 표의 나머지 파일에서 “언어적인” textarea에 `spellcheck="true"` 및 필요 시 `lang` 일괄 적용.

### Phase 6: (선택) 추가 페이지 번역 버튼

- [ ] 보컬, 뮤직비디오 생성 등에서 필요 시 번역 버튼 추가. 동일한 `translateText`·에러·한도 처리 적용.

### Phase 7: 검증

- [ ] 키 없을 때: 번역 버튼 클릭 → “서비스 사용 불가” 안내, 폼 저장·제출 정상 동작 확인.
- [ ] 한도 초과 시뮬레이션(또는 DeepL 429 모킹): “한도 초과” 안내, 번역 버튼 비활성화/재안내, 입력값 유지 확인.
- [ ] 네트워크 오류 시: 토스트만, 입력값 덮어쓰기 없음 확인.
- [ ] 키·DeepL URL이 클라이언트 번들·네트워크 탭에 노출되지 않음 확인.

---

## 9. 요약 체크리스트

| 구분 | 내용 |
|------|------|
| **보안** | API 외부 노출 금지, 키·시크릿 서버만, 에러 메시지 사용자용만, 입력 검증·레이트 리밋 |
| **번역** | DeepL Free만, 월 50만자, 한도 초과 시 안내 후 사용 금지, 서버 경유만 |
| **맞춤법** | 브라우저 `spellcheck="true"` + `lang` 선택, 0원 |
| **안정성** | 번역 실패 시 입력값 유지, 토스트/안내만, 폼·저장·제출 영향 없음 |
| **다국어** | DeepL 38개 언어, spellcheck는 `lang` 힌트로 다국어 지원 |

이 계획에 따라 구현하면 **보안을 해치지 않고**, **사이트 오류 없이**, 프롬프트·가사 등 **언어적 입력이 있는 곳**에만 맞춤법과 번역을 적용할 수 있다.

---

## 10. 사용 전 설정 및 동작 상세

### 10.1 DeepL을 사용하려면 (키 설정)

번역 버튼이 실제로 DeepL을 호출하려면 **서버에서만** API 키를 설정해야 한다. 클라이언트(브라우저)·번들·소스에는 키가 전혀 들어가지 않는다.

#### 1) DeepL API 키 발급

- [DeepL API](https://www.deepl.com/pro-api) 에서 **Free API** 가입 후 키 발급.
- Free 플랜: 월 **50만 자** 무료. 초과 시 API가 429를 반환하며, 우리 서버가 이를 “한도 초과”로 변환해 클라이언트에 안내한다.

#### 2) 키를 넣는 위치 (이 프로젝트는 Cloudflare Workers 사용)

| 환경 | 설정 방법 | 비고 |
|------|-----------|------|
| **로컬 개발** | 프로젝트 루트에 `.dev.vars` 파일 생성 후 한 줄 추가 | `.dev.vars`는 `.gitignore`에 넣어 커밋하지 않는다. |
| **배포(프로덕션)** | Cloudflare 대시보드 → Workers & Pages → 해당 Worker → Settings → **Variables and Secrets** → **Encrypted** 로 `DEEPL_AUTH_KEY` 추가 | 대시보드에서만 설정. 코드/저장소에 키를 넣지 않는다. |

**.dev.vars 예시 (로컬 전용):**

```bash
# .dev.vars (이 파일은 git에 올리지 마세요)
DEEPL_AUTH_KEY=your_deepl_auth_key_here
```

- `wrangler dev` 실행 시 이 값이 `platform.env.DEEPL_AUTH_KEY`로 주입된다.
- `.env.example`에는 `# DEEPL_AUTH_KEY=` 만 적어 두고, 실제 키는 `.dev.vars`나 대시보드에만 둔다.

#### 3) 키가 노출되지 않는 이유

- **클라이언트**: `fetch('/api/translate', { method: 'POST', body: ... })` 만 호출한다. 우리 도메인의 `/api/translate`만 호출하며, DeepL URL·키를 전혀 모른다.
- **서버** (`src/routes/api/translate/+server.ts`): `platform?.env?.DEEPL_AUTH_KEY`로만 키를 읽는다. 이 값은 Cloudflare가 런타임에 넣어 주는 값이라, 빌드 결과물·번들·클라이언트 코드에 포함되지 않는다.
- **에러 메시지**: 키 없음·DeepL 오류 시에도 응답에는 “번역 서비스를 일시적으로 사용할 수 없습니다” 같은 **사용자용 문구만** 반환한다. “key invalid”, “429” 등 내부 정보는 클라이언트로 내려가지 않는다.

---

### 10.2 키가 없을 때 동작 (키 없어도 오류 없음)

키를 아직 설정하지 않았거나, 나중에 키를 지워도 **사이트는 정상 동작**하고, **저장·제출 등 기존 기능에는 영향이 없다.**

| 단계 | 동작 |
|------|------|
| 1. 사용자가 “한글→영어” 버튼 클릭 | 버튼은 그대로 동작한다. (비활성화되지 않는다.) |
| 2. 클라이언트 | `translateText(...)`가 **우리 서버** `POST /api/translate`만 호출한다. |
| 3. 서버 | `DEEPL_AUTH_KEY`가 없으면 DeepL을 호출하지 않고, **200 OK** + `{ "ok": false, "code": "UNAVAILABLE", "error": "번역 서비스를 일시적으로 사용할 수 없습니다." }` 만 반환한다. |
| 4. 클라이언트 | 응답의 `ok: false`를 보고 **토스트**로 위 `error` 문구만 띄운다. |
| 5. 입력값 | **textarea 내용은 절대 바뀌지 않는다.** 덮어쓰기·초기화 없음. |
| 6. 폼·저장·제출 | **추가**, **저장**, **제출** 등 기존 버튼과 플로우는 그대로 동작한다. 번역 실패는 “부가 기능 실패”일 뿐이다. |

정리하면, **키가 없어도** 번역 버튼은 눌리지만, “번역 서비스를 일시적으로 사용할 수 없습니다” 토스트만 뜨고, 입력 내용·저장·제출에는 아무 영향이 없다.

---

### 10.3 한도 초과 시 동작

- DeepL Free 월 50만 자를 다 쓰면 DeepL이 **429** 등을 반환한다.
- 서버는 이를 `{ "ok": false, "code": "LIMIT_EXCEEDED", "error": "이번 달 번역 한도를 모두 사용했습니다. 다음 달에 다시 이용해 주세요." }` 로 변환해 반환한다.
- 클라이언트는 `code === 'LIMIT_EXCEEDED'`일 때 **번역 버튼을 비활성화**하고, 같은 문구를 토스트로 띄운다. (또는 클릭 시 같은 안내만 반복.)
- 이때도 **입력값은 덮어쓰지 않고**, 저장·제출은 그대로 동작한다.

---

### 10.4 “API 외부 노출 없이, 오류 없이 적용된 상태”의 의미

| 항목 | 설명 |
|------|------|
| **API 외부 노출 없음** | 브라우저는 **우리 사이트의 `/api/translate`만** 호출한다. DeepL URL·키가 클라이언트 코드·네트워크 요청에 전혀 노출되지 않는다. |
| **키·시크릿** | `DEEPL_AUTH_KEY`는 **서버(Cloudflare env/시크릿)** 에만 존재한다. 번들·소스맵·에러 메시지에 포함하지 않는다. |
| **오류 없이 적용** | 번역 실패(키 없음, 한도 초과, 네트워크 오류) 시 **예외를 모두 catch** 하고, 사용자에게는 토스트만 보여 준다. 페이지 크래시·폼 블로킹·저장 실패가 발생하지 않는다. |
| **기존 동작 보장** | 번역은 “있으면 좋은” 부가 기능이다. 번역이 실패해도 **프롬프트 저장, 가사 저장, 폼 제출** 등 기존 기능은 100% 그대로 동작한다. |

이 상태를 **“API 외부 노출 없이, 오류 없이 적용된 상태”**라고 정리한 것이다.
