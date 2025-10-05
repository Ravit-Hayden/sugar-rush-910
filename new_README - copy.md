===== START_OF_README =====
# All New Sugar Rush 910 — 음악 협업 · 발매 · 수익 관리 시스템

- 기준일: 2025-08-19 (Asia/Seoul)
- 브랜드/아티스트: Sugar Rush
- 공개 URL: https://sugar-rush.team/
- 관리자 URL: https://admin.sugar-rush.team/ (공개와 완전 분리: 세션/권한/도메인 분리)

---

## 🔒 문서 우선순위 규칙 (Code-first)
- 문서와 코드가 충돌하면 **아래 컴포넌트 코드가 최종 기준**이다.
  - 헤더(상단바): `src/lib/components/Header.svelte`
  - 테마 토글: `src/lib/components/ThemeToggle.svelte`
  - 좌측 사이드바: `src/lib/components/Sidebar.svelte`
  - 레이아웃/스타일: `src/routes/+layout.svelte`, `src/app.css`
- 본 README는 **실행 가이드 + 설계/데이터/운영 규격**을 모두 포함한 통합본이다.

---

## 🎯 비전/원칙 (개인화 우선)
- 원스톱 플로우: 아이디어 → 제작 협업 → 검수 → 발매 예약 → 자동 반영 → 사후분석/권리/수익
- 테마 컬러: 커버 이미지에서 자동 추출 → 후보 3색 제안 → 게이트 평가
- 게이트: ΔE00 ≥ 12, 대비(WCAG 2.2 AA) ≥ 4.5:1, 최근 30개와 중복 금지, 브랜드 색(#FF2D96/#FF008C) **앨범 대표색 금지**
- 특수 조건(전곡): 내부 스키마 `tracks.ai_type = 'ai_composite'` 고정(화면/문서 비노출)

### 외부 금칙(절대 준수)
- 외부 노출(웹·관리자 UI·문서·알림 등)에는 “AI” 단어 금지
- 내부 코드/DB 스키마에서만 ai_type 등 사용
- 위반 시 CI 금칙어 게이트로 빌드 실패

---

## 🧩 기술 스택 & 환경
- 프레임워크: **SvelteKit**
- 스타일: **Tailwind CSS v4.1.13**
- 폰트: **Pretendard Variable**
- 아이콘: **lucide-svelte** (다운로드/번들 사용)
- 패키지: **pnpm 워크스페이스**
- 런타임: Node.js 20.x LTS
- OS: Windows 10/11 (WSL2 가능)
- 백엔드: **Cloudflare Workers + D1**
- 개발 기본: 오류/충돌 없이 가볍게 동작, 설정 통일(기본 설정 확장 방식)

---

## 👥 팀/권한 (개인화)
- 팀 멤버: `El`, `Otte` (둘 다 Owner/Full)
- RBAC 및 필드 ACL 유지(민감 필드 마스킹), 1인 승인 가능
- 승인·중요 이벤트는 Google Chat 알림 동기화

---

## 🎨 브랜드/테마
- 포인트/상태/태그 색상 변수
  ```
  --brand-pink:#FF3DAE;
  --hover-cyan:#17E1BC;
  --danger-fg:#FF6B6B;
  --warn-fg:#fffa00;
  --ok-fg:#00ddff;
  --tag-album:#FF3DAE;
  --tag-track:#68b1ff;
  --tag-deadline:#7ea59e;
  ```
- 다크 모드
  ```
  --text-base:#888888; --text-strong:#B6B6B6; --text-muted:#6F6F6F;
  --bg:#000000; --surface-2:#121212; --surface-1:#1A1A1A; --border-subtle:#252528;
  ```
- 라이트 모드 (Ivory/Cream/Beige)
  ```
  --text-base:#D9CCBC; --text-strong:#C5b5A9; --text-muted:#A59686;
  --bg:#F7F3E9; --surface-2:#F3EBDD; --surface-1:#FFF8EF; --border-subtle:#D9CCBC;
  ```
- 사용자 기본 테마: El=다크, Otte=라이트 (로그인 시 자동 적용)
- 대시보드 사용자 표시색
  ```
  --user-el:#A6FF00;
  --user-ot:#FF835C;
  ```

---

## 🧱 레이아웃 (최신 규칙 반영)
- Right Sidebar: **미사용(삭제 정책)**
- **Header(상단바) 고정 높이 80px** (`h-20`), z-index 60
- **Sidebar(좌측) 폭 72px(축소) ↔ 250px(확장)** 토글, z-index 50
- Header는 사이드바 폭 이벤트에 따라 `margin-left` 자동 보정
- **Main 컨테이너 좌우 여백**: 좌 24px / **우 48px**(= 24 + 16 + 8: 기본 여백 + 가터 + 스크롤바 예약)
- 스크롤 점프 방지: `scrollbar-gutter: stable` 사용(최신 브라우저 대응)
- Main 그리드: `grid grid-cols-12 gap-4`
  - `<md`: `col-span-12`
  - `md~<lg`: `col-span-6`
  - `≥lg`: `col-span-4`
  - **KPI만 예외**: `col-span-12`, 높이 `h-80` / 일반 카드는 `h-72`

### 상단바(헤더) — **최신 추가 내용 반영**
- 좌측: 페이지 타이틀(`Dashboard`)
- 우측: 검색(돋보기 아이콘 내장) · 알림(Bell) · 테마(Eclipse)
- 검색 UX
  - 300ms 디바운스, `GET /api/search?q=&limit=8`
  - 포커스/호버 시 검색 아이콘·테두리 **brand-pink ↔ hover-cyan** 전환
  - 결과 브로드캐스트: `search-change` / 초기화: `search-clear`
  - 검색어 있을 때 타이틀: `검색 결과 (정확 n)`
- 알림: 새 알림이 있을 때만 Bell 우측 상단 `brand-pink` 점 표시
- 테마 전환: Eclipse 아이콘 1개, `localStorage('sr_theme')`, 첫 페인트 전 적용

### 좌측 사이드바 — **최신 추가 내용 반영**
- 데스크톱: 폭 72 ↔ 250 토글, 모바일: 오버레이
- 이벤트: `sidebar-collapse-change`, `sidebar-width-change`, `sidebar-toggle`
- 메뉴(아이콘 | 한글메뉴)
  - LayoutGrid 대시보드
  - Disc3 앨범 관리
  - Music 트랙 관리
  - FolderOpen 업로드·검증 센터
  - Heart 제작·협업 보드
  - Rocket 발매 관리
  - DollarSign 수익 관리
  - Calendar 일정·캘린더
  - MessageSquare 피드백·알림 센터
  - Shield 보안·운영 관리
  - Settings 설정

---

## 📊 Dashboard — 카드 세트 & 규칙
- 카드 목록
  - 할 일 · 멘션 · 카운트다운(마감) · 실패 태스크(재시도) · 시스템 상태 · 최근 변경 · 피드백 · 오늘 발매 일정 · 빠른 액션 · 시스템 로그 · **KPI 그래프(풀폭)**
- 원칙
  - 내부 스크롤 금지, 카드당 최대 4행 노출(초과는 “더보기”)
  - 모바일 실시간 배지: `md:hidden`, 항목당 1개(우선/최근)
  - 상단 미니 통계(3칸): `grid grid-cols-3 gap-2`, `h-8`, `text-[11px]`
  - 하단 전환 버튼: 최대 2개(주/보조)
  - Info 툴팁: hover+focus, `role="tooltip"`
  - 접근성: `aria-label`, `aria-live="polite"`, 대비 AA, 포커스 링 ≥ 1.5px

---

## ⚙️ API 계약 (Admin 대시보드)
```ts
type ApiOk<T> = { ok: true; data: T };
type ApiErr = { ok: false; error: { code: string; message: string; details?: any } };
```

| 카드/기능 | 메소드/경로 | 쿼리 | 응답(요약) |
|---|---|---|---|
| 전역검색 | GET `/api/search` | `q`, `limit=8` | `{ exact:[{id,title,type,href}], similar:[...] }` |
| 할 일 | GET `/api/tasks` | `limit=4` | `{ id,title,priority:boolean,due?:string }[]` |
| 멘션 | GET `/api/mentions` | `limit=4` | `{ id,text,from,ts }[]` |
| 카운트다운 | GET `/api/deadlines` | `limit=4` | `{ id,label,d:string }[]` |
| 실패 태스크 | GET `/api/failures` | `limit=4` | `{ id,text,retryable:boolean }[]` |
| 재시도 | POST `/api/failures/retry` | body `{ id }` | `{ id,status:'queued'|'ok'|'failed' }` |
| 시스템 상태 | GET `/api/status` | - | `{ key:string,value:string }[]` |
| 최근 변경 | GET `/api/changes` | `limit=4` | `{ id,text,recent:boolean }[]` |
| 오늘 발매 | GET `/api/releases/today` | `limit=4` | `{ id,title,when }[]` |
| 빠른 액션 | GET `/api/actions` | - | `{ label,href }[]` |
| 시스템 로그 | GET `/api/logs` | `limit=4` | `{ id,text,ts }[]` |
| KPI | GET `/api/kpi` | `range=7d|30d` | `{ series:{name,points:[{x,y}]}[] }` |

---

## 🗄️ Cloudflare D1 스키마(요약)
```sql
CREATE TABLE IF NOT EXISTS tasks (id TEXT PRIMARY KEY, title TEXT NOT NULL, priority INTEGER NOT NULL DEFAULT 0, due TEXT);
CREATE TABLE IF NOT EXISTS failures (id TEXT PRIMARY KEY, text TEXT NOT NULL, retryable INTEGER NOT NULL DEFAULT 1, status TEXT NOT NULL DEFAULT 'failed');
CREATE TABLE IF NOT EXISTS changes (id TEXT PRIMARY KEY, text TEXT NOT NULL, recent INTEGER NOT NULL DEFAULT 1, ts INTEGER);
CREATE TABLE IF NOT EXISTS metrics (key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS releases (id TEXT PRIMARY KEY, title TEXT NOT NULL, when TEXT);
CREATE TABLE IF NOT EXISTS logs (id TEXT PRIMARY KEY, text TEXT NOT NULL, ts INTEGER);
CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE, role TEXT NOT NULL); -- owner|editor|viewer
CREATE TABLE IF NOT EXISTS audit_log (id TEXT PRIMARY KEY, actor TEXT, action TEXT, target TEXT, ts INTEGER);
```

---

## 🧱 프로젝트 구조
```
sugar-rush-910/
  pnpm-workspace.yaml
  package.json
  apps/
    admin/
      package.json
      svelte.config.js
      vite.config.ts
      tailwind.config.ts
      wrangler.toml
      schema.sql
      static/
        favicon.ico
      src/
        app.html
        app.css
        routes/
          +layout.svelte
          +layout.ts
          +page.svelte
          api/
            search/+server.ts
            tasks/+server.ts
            mentions/+server.ts
            deadlines/+server.ts
            failures/+server.ts
            failures/retry/+server.ts
            status/+server.ts
            changes/+server.ts
            releases/today/+server.ts
            actions/+server.ts
            logs/+server.ts
            kpi/+server.ts
        lib/
          components/
            Header.svelte
            Sidebar.svelte
            ThemeToggle.svelte
```

---

## ⚡ 설치/실행/배포 (Windows + pnpm)

1) 의존성 설치
```bash
pnpm i
```

2) 개발 서버 (admin)
```bash
pnpm -C apps/admin dev
```

3) Cloudflare 로그인 & D1 생성
```bash
pnpm -C apps/admin dlx wrangler login
pnpm -C apps/admin dlx wrangler d1 create sugar_rush
```

4) 스키마 적용
```bash
pnpm -C apps/admin dlx wrangler d1 execute sugar_rush --file=./schema.sql
```

5) 스테이징/프로덕션 배포
```bash
pnpm -C apps/admin dlx wrangler deploy --env=staging
pnpm -C apps/admin dlx wrangler deploy --env=production
```

---

## 📦 루트/패키지 설정

`pnpm-workspace.yaml`
```yaml
packages:
  - apps/*
```

`package.json` (루트)
```json
{
  "name": "sugar-rush-910",
  "private": true,
  "workspaces": ["apps/*"],
  "scripts": {
    "dev": "pnpm -C apps/admin dev",
    "build": "pnpm -C apps/admin build",
    "deploy:stg": "pnpm -C apps/admin dlx wrangler deploy --env=staging",
    "deploy:prod": "pnpm -C apps/admin dlx wrangler deploy --env=production"
  }
}
```

`apps/admin/package.json`
```json
{
  "name": "@sugar/admin",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@sveltejs/kit": "2.37.0",
    "svelte": "5.38.6",
    "lucide-svelte": "0.475.0"
  },
  "devDependencies": {
    "@sveltejs/adapter-cloudflare": "7.2.3",
    "@tailwindcss/vite": "4.1.13",
    "tailwindcss": "4.1.13",
    "vite": "7.1.4",
    "wrangler": "3.80.0",
    "typescript": "5.6.3"
  }
}
```

`apps/admin/svelte.config.js`
```js
import adapter from '@sveltejs/adapter-cloudflare';
const config = { kit: { adapter: adapter() } };
export default config;
```

`apps/admin/vite.config.ts`
```ts
import { sveltekit } from '@sveltejs/kit/vite'
import tailwind from '@tailwindcss/vite'
import { defineConfig } from 'vite'
export default defineConfig({ plugins: [tailwind(), sveltekit()] })
```

`apps/admin/tailwind.config.ts`
```ts
export default { content: ['./src/**/*.{svelte,ts}'] }
```

`apps/admin/wrangler.toml`
```toml
name = "sugar-rush-admin"
compatibility_date = "2024-11-20"
assets = { directory = "static" }

[[d1_databases]]
binding = "DB"
database_name = "sugar_rush"
database_id = "REPLACE_WITH_YOUR_D1_ID"

[vars]
NODE_VERSION = "20"
```

`apps/admin/schema.sql` → 위 D1 스키마 참조

---

## 🧪 앱 셸 & 레이아웃/스타일 (스크롤바 + 여백 최신 반영)

`apps/admin/src/app.html`
```html
<!doctype html>
<html lang="ko" data-theme="dark">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <link rel="icon" href="/favicon.ico" />
    <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css" />
    <script>
      (function(){
        var t=localStorage.getItem('sr_theme')||'dark';
        document.documentElement.setAttribute('data-theme',t);
      })()
    </script>
    %svelte.head%
  </head>
  <body class="font-[Pretendard]">%svelte.body%</body>
</html>
```

`apps/admin/src/app.css`
```css
@tailwind base; @tailwind components; @tailwind utilities;

/* =========================
   색상 토큰
   ========================= */
:root{
  --brand-pink:#FF3DAE; --hover-cyan:#17E1BC;
  --danger-fg:#FF6B6B; --warn-fg:#fffa00; --ok-fg:#00ddff;
  --tag-album:#FF3DAE; --tag-track:#68b1ff; --tag-deadline:#7ea59e;
}

/* =========================
   테마(다크/라이트)
   ========================= */
[data-theme="dark"]{
  --text-base:#888888;--text-strong:#B6B6B6;--text-muted:#6F6F6F;
  --bg:#000000;--surface-2:#121212;--surface-1:#1A1A1A;--border-subtle:#252528;
}
[data-theme="light"]{
  --text-base:#D9CCBC;--text-strong:#C5b5A9;--text-muted:#A59686;
  --bg:#F7F3E9;--surface-2:#F3EBDD;--surface-1:#FFF8EF;--border-subtle:#D9CCBC;
}

/* 전체 배경/글자색 */
html,body,#svelte{
  height:100%;
  background:var(--bg);
  color:var(--text-base);
}

/* =========================
   검색 입력(헤더)
   ========================= */
.input-search{
  outline:0;border:1px solid var(--brand-pink);background:transparent;color:var(--text-strong);
  border-radius:8px;height:36px;padding:0 12px 0 36px;
}
.input-search:hover{border-color:var(--hover-cyan)}
.input-search:focus{border-color:var(--brand-pink)}

/* 알림 dot */
.badge-dot{
  position:absolute;top:-2px;right:-2px;width:8px;height:8px;border-radius:50%;background:var(--brand-pink)
}

/* =========================
   메인 레이아웃
   - 헤더 높이 80px 보정
   - 좌우 여백: 좌 24px / 우 48px (= 24 + 16 + 8)
   - 스크롤바 영역 항상 보존(scrollbar-gutter: stable)
   ========================= */
.main-content-area{
  padding-top:80px;
  padding-bottom:6px;
  padding-left:24px;   /* 좌 기본 여백 24 */
  padding-right:48px;  /* 우 24 + 가터 16 + 스크롤바 8 = 48 */
  overflow-x:hidden;
  scrollbar-gutter: stable;
}

/* 사이드바 상태에 따른 메인 폭/마진 보정 */
.sidebar-collapsed .main-content-area{ margin-left:72px;  width:calc(100% - 72px) }
.sidebar-expanded .main-content-area{  margin-left:250px; width:calc(100% - 250px) }

/* =========================
   전역 스크롤바(크롬/엣지/사파리/웹킷)
   ========================= */
::-webkit-scrollbar{ width:8px; height:8px; }
::-webkit-scrollbar-track{ background:#000000; }
::-webkit-scrollbar-thumb{ background:#121212; border-radius:0px; }
::-webkit-scrollbar-thumb:hover{ background:#323232; }

/* 파이어폭스 스크롤바 (thumb, track) */
*{
  scrollbar-width: thin;
  scrollbar-color: #121212 #000000; /* thumb, track */
}

/* (선택) 라이트 테마에서 스크롤바 색상 살짝 밝게 */
[data-theme="light"] ::-webkit-scrollbar-track{ background:#F7F3E9; }
[data-theme="light"] ::-webkit-scrollbar-thumb{ background:#CFCFCF; }
[data-theme="light"] ::-webkit-scrollbar-thumb:hover{ background:#B5B5B5; }
[data-theme="light"] *{ scrollbar-color:#CFCFCF #F7F3E9; }
```

`apps/admin/src/routes/+layout.ts`
```ts
export const prerender = false
export const ssr = true
```

`apps/admin/src/routes/+layout.svelte`
```svelte
<script lang="ts">
  import Header from '$lib/components/Header.svelte'
  import Sidebar from '$lib/components/Sidebar.svelte'
  import { onMount } from 'svelte'

  let sidebarWidth = 250
  let collapsed = false
  let isMobileOpen = false

  function applyBodyClass(){
    document.body.classList.remove('sidebar-collapsed','sidebar-expanded')
    document.body.classList.add(collapsed ? 'sidebar-collapsed' : 'sidebar-expanded')
  }
  function setWidth(w:number){
    sidebarWidth = w
    document.documentElement.style.setProperty('--sidebar-width', w + 'px')
    applyBodyClass()
  }

  onMount(()=>{
    setWidth(250)
    addEventListener('sidebar-collapse-change',(e:any)=>{ collapsed = !!e.detail; setWidth(collapsed?72:250) })
    addEventListener('sidebar-width-change',(e:any)=>{ setWidth(e.detail) })
    addEventListener('sidebar-toggle',(e:any)=>{ isMobileOpen = !!e.detail })
  })
</script>

<div class="fixed top-0 left-0 h-screen" style="width:{sidebarWidth}px; z-index:50">
  <Sidebar />
</div>

<div class="fixed top-0 right-0 left-0" style="margin-left:{sidebarWidth}px; z-index:60">
  <Header />
</div>

<main class="main-content-area">
  <slot />
</main>
```

`apps/admin/src/routes/+page.svelte`
```svelte
<section class="grid grid-cols-12 gap-4">
  <div class="col-span-12 md:col-span-6 lg:col-span-4 h-72 bg-[color:var(--surface-2)] rounded-xl p-4">할 일 · 멘션</div>
  <div class="col-span-12 md:col-span-6 lg:col-span-4 h-72 bg-[color:var(--surface-2)] rounded-xl p-4">카운트다운</div>
  <div class="col-span-12 md:col-span-6 lg:col-span-4 h-72 bg-[color:var(--surface-2)] rounded-xl p-4">실패 태스크</div>
  <div class="col-span-12 md:col-span-6 lg:col-span-4 h-72 bg-[color:var(--surface-2)] rounded-xl p-4">시스템 상태</div>
  <div class="col-span-12 md:col-span-6 lg:col-span-4 h-72 bg-[color:var(--surface-2)] rounded-xl p-4">최근 변경</div>
  <div class="col-span-12 md:col-span-6 lg:col-span-4 h-72 bg-[color:var(--surface-2)] rounded-xl p-4">피드백</div>
  <div class="col-span-12 md:col-span-6 lg:col-span-4 h-72 bg-[color:var(--surface-2)] rounded-xl p-4">오늘 발매 일정</div>
  <div class="col-span-12 md:col-span-6 lg:col-span-4 h-72 bg-[color:var(--surface-2)] rounded-xl p-4">빠른 액션</div>
  <div class="col-span-12 md:col-span-6 lg:col-span-4 h-72 bg-[color:var(--surface-2)] rounded-xl p-4">시스템 로그</div>
  <div class="col-span-12 h-80 bg-[color:var(--surface-2)] rounded-xl p-4">KPI 그래프</div>
</section>
```

---

## 🧩 헤더/사이드바 컴포넌트 (최신)

`apps/admin/src/lib/components/ThemeToggle.svelte`
```svelte
<script lang="ts">
  import { Eclipse } from 'lucide-svelte'
  import { onMount } from 'svelte'
  let theme = 'dark'
  function setTheme(next:string){
    theme = next
    localStorage.setItem('sr_theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }
  function toggle(){ setTheme(theme==='dark' ? 'light' : 'dark') }
  onMount(()=>{ setTheme(localStorage.getItem('sr_theme') || 'dark') })
</script>

<button aria-label="테마 전환"
  class="h-9 w-9 rounded-lg inline-flex items-center justify-center bg-[color:var(--surface-1)] border border-[color:var(--border-subtle)]"
  on:click={toggle}>
  <Eclipse size={18} />
</button>
```

`apps/admin/src/lib/components/Header.svelte`
```svelte
<script lang="ts">
  import { Search, Bell } from 'lucide-svelte'
  import ThemeToggle from './ThemeToggle.svelte'

  let q = ''
  let typingTimer:any
  let exact:any[] = []
  let similar:any[] = []
  let showResult = false

  function broadcast(){
    window.dispatchEvent(new CustomEvent('search-change',{
      detail:{ query:q, results:{ exact, similar }, show:showResult }
    }))
  }

  async function run(){
    if(!q){
      exact=[]; similar=[]; showResult=false
      window.dispatchEvent(new CustomEvent('search-clear'))
      return
    }
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=8`).catch(()=>null)
    if(!res || !res.ok){ exact=[]; similar=[]; showResult=false; broadcast(); return }
    const data = await res.json()
    exact = data?.data?.exact || []
    similar = data?.data?.similar || []
    showResult = true
    broadcast()
  }

  function onInput(e:any){
    q = e.currentTarget.value
    clearTimeout(typingTimer)
    typingTimer = setTimeout(run, 300)
  }

  function clear(){
    q=''; exact=[]; similar=[]; showResult=false
    const el = document.getElementById('global-search') as HTMLInputElement
    if(el) el.value = ''
    window.dispatchEvent(new CustomEvent('search-clear'))
  }

  function goFeedback(){ clear(); location.href='/feedback' }
</script>

<header class="w-full h-20 flex items-center justify-between px-6 bg-[color:var(--bg)] border-b border-[color:var(--border-subtle)]">
  <!-- 좌측: 페이지 타이틀 -->
  <div class="flex items-center gap-3">
    <div class="text-[18px] font-semibold text-[color:var(--brand-pink)]">Dashboard</div>
  </div>

  <!-- 우측: 검색 · 알림 · 테마 -->
  <div class="flex items-center gap-3">
    <div class="relative">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" size={16} />
      <input id="global-search" class="input-search w-80 max-md:w-56" placeholder="검색..." on:input={onInput} />
      {#if q}
        <button aria-label="검색 초기화" class="absolute right-2 top-1/2 -translate-y-1/2 text-sm" on:click={clear}>✕</button>
      {/if}
    </div>

    <button aria-label="알림"
      class="relative h-9 w-9 rounded-lg inline-flex items-center justify-center bg-[color:var(--surface-1)] border border-[color:var(--border-subtle)]"
      on:click={goFeedback}>
      <Bell size={18} />
      <span class="badge-dot"></span>
    </button>

    <ThemeToggle />
  </div>
</header>
```

`apps/admin/src/lib/components/Sidebar.svelte`
```svelte
<script lang="ts">
  import {
    LayoutGrid, Disc3, Music, FolderOpen, Heart, Rocket,
    DollarSign, Calendar, MessageSquare, Shield, Settings,
    PanelLeftOpen, PanelLeftClose
  } from 'lucide-svelte'
  import { onMount } from 'svelte'

  let collapsed = false
  let width = 250

  function emit(){
    window.dispatchEvent(new CustomEvent('sidebar-collapse-change',{ detail:collapsed }))
    window.dispatchEvent(new CustomEvent('sidebar-width-change',{ detail:width }))
  }
  function toggle(){ collapsed = !collapsed; width = collapsed ? 72 : 250; emit() }
  function isActive(path:string){
    return location.pathname===path || (location.pathname.startsWith(path) && path!=='/')
  }

  const menus = [
    { icon: LayoutGrid, label: '대시보드', href: '/' },
    { icon: Disc3, label: '앨범 관리', href: '/albums' },
    { icon: Music, label: '트랙 관리', href: '/tracks' },
    { icon: FolderOpen, label: '업로드·검증 센터', href: '/uploads' },
    { icon: Heart, label: '제작·협업 보드', href: '/board' },
    { icon: Rocket, label: '발매 관리', href: '/releases' },
    { icon: DollarSign, label: '수익 관리', href: '/revenue' },
    { icon: Calendar, label: '일정·캘린더', href: '/calendar' },
    { icon: MessageSquare, label: '피드백·알림 센터', href: '/feedback' },
    { icon: Shield, label: '보안·운영 관리', href: '/security' },
    { icon: Settings, label: '설정', href: '/settings' }
  ]

  onMount(()=>{ emit() })
</script>

<aside class="h-screen bg-[color:var(--surface-1)] border-r border-[color:var(--border-subtle)] flex flex-col">
  <div class="h-20 px-3 flex items-center justify-end">
    <button aria-label="사이드바 토글"
      class="h-9 w-9 rounded-lg inline-flex items-center justify-center bg-[color:var(--surface-2)] border border-[color:var(--border-subtle)]"
      on:click={toggle}>
      {#if collapsed}<PanelLeftOpen size={18} />{:else}<PanelLeftClose size={18} />{/if}
    </button>
  </div>

  <nav class="flex-1 px-2 space-y-1">
    {#each menus as m}
      <a href={m.href}
        class="group flex items-center gap-3 rounded-lg px-3 h-10 border border-transparent transition"
        class:bg-[color:var(--brand-pink)]={isActive(m.href)}
        class:text-white={isActive(m.href)}
        class:hover:bg-[color:var(--hover-cyan)]
        class:hover:text-black>
        <svelte:component this={m.icon} size={16} />
        {#if !collapsed}<span class="text-sm">{m.label}</span>{/if}
      </a>
    {/each}
  </nav>
</aside>
```

---

## 🛠️ API 라우트 예시 (SvelteKit)
`apps/admin/src/routes/api/search/+server.ts`
```ts
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ url }) => {
  const q = url.searchParams.get('q') || ''
  const limit = Number(url.searchParams.get('limit') || '8')

  if (!q) {
    return new Response(JSON.stringify({ ok:true, data:{ exact:[], similar:[] } }), {
      headers:{'content-type':'application/json'}
    })
  }

  // TODO: 실제 검색 로직 주입
  const data = { exact:[], similar:[] }

  return new Response(JSON.stringify({ ok:true, data }), {
    headers:{'content-type':'application/json'}
  })
}
```

`apps/admin/src/routes/api/tasks/+server.ts`
```ts
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ platform, url }) => {
  const limit = Number(url.searchParams.get('limit') ?? 4)
  const db = platform?.env?.DB as D1Database
  const { results } = await db
    .prepare('SELECT id,title,priority,due FROM tasks LIMIT ?')
    .bind(limit)
    .all()

  return new Response(JSON.stringify({ ok:true, data:results }), {
    headers:{'content-type':'application/json'}
  })
}
```

`apps/admin/src/routes/api/failures/retry/+server.ts`
```ts
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request, platform }) => {
  const body = await request.json().catch(()=>({}))
  if(!body.id){
    return new Response(
      JSON.stringify({ ok:false, error:{ code:'BAD_INPUT', message:'id required' } }),
      { status:400, headers:{'content-type':'application/json'} }
    )
  }
  const db = platform?.env?.DB as D1Database
  await db.prepare('UPDATE failures SET status=? WHERE id=?').bind('queued', body.id).run()

  return new Response(JSON.stringify({ ok:true, data:{ id:body.id, status:'queued' } }), {
    headers:{'content-type':'application/json'}
  })
}
```

> 참고: 나머지 엔드포인트도 동일 패턴으로 구현.

---

## 🚨 에러/상태 처리
- HTTP: 2xx=성공, 4xx=검증/권한, 5xx=서버
- UI: 로딩(스피너/disable), 실패 2초 경고, 재시도 쿨다운 15s
- 접근성: `aria-label`, `aria-live="polite"`, 대비 AA(≥ 4.5:1), 포커스 링 ≥ 1.5px

표준 에러 예시:
```json
{ "ok": false, "error": { "code":"NOT_AUTHORIZED", "message":"권한이 없습니다." } }
```

---

## 🔐 보안/권한 검증
- 인증: **Cloudflare Access → 세션 쿠키**
- RBAC: `users.role ∈ {owner, editor, viewer}` (재시도는 editor+)
- 입력 검증: 모든 파라미터 서버 검증 + SQL 바인딩
- 감사 로그: 변경/재시도는 `audit_log` 기록

`apps/admin/src/hooks.server.ts`
```ts
import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
  // TODO: Access/세션 검증 → event.locals.user = { id, role }
  return resolve(event)
}
```

---

## 🧠 설계/데이터 모델 (통합본)

### BaseEntity
```ts
interface BaseEntity { created_at: Date; updated_at: Date; }
```

### Enum/상태 그룹
```ts
enum TrackStageGroup { PRE_PRODUCTION='pre_production', PRODUCTION='production', POST_PRODUCTION='post_production' }
enum TrackState {
  WRITING_LYRICS='writing_lyrics', ARTWORK_PREP='artwork_preparation', WAITING_COMPOSE='waiting_compose',
  IMPROVING='improving', FINALIZING='finalizing', POST_DOWNLOAD='post_download',
  CHECKING='checking', RELEASING='releasing', RELEASED='released'
}
const TRACK_STAGE_GROUP_COLOR: Record<TrackStageGroup,string> = {
  [TrackStageGroup.PRE_PRODUCTION]:'#F7C948',
  [TrackStageGroup.PRODUCTION]:'#36B37E',
  [TrackStageGroup.POST_PRODUCTION]:'#0065FF'
}
enum AlbumStatus { UPCOMING='upcoming', RELEASING='releasing', COMPLETE='complete', RESERVED='reserved' }
enum AudioPostProcessStage { RAW='raw', MIXING='mixing', MASTERING='mastering', FINALIZED='finalized', OTHER='other' }
```

### 엔티티 요약
```ts
interface Tag { id:string; name:string; color?:string }
interface Persona { name:string; traits:string[] }

interface Artist extends BaseEntity { id:string; name:string; description:string; photo_url:string }

interface AudioPostProcess { stage:AudioPostProcessStage; file:string; updated_at:Date; memo?:string }
interface SunoAIData { prompt:string; style_code:string; exclude_tags:Tag[]; persona:Persona; weirdness:number; style_influence:number; final_track_url:string }
interface ProgressStep { state:TrackState; assigned_to:string; updated_at:Date }
interface VersionEntry { version:string; changes:string; updated_at:Date }

interface Track extends BaseEntity {
  id:string; album_id:string; track_number:number; title:{kr:string; en:string};
  is_title:boolean; lyrics:string; audio_files:{ original:string; versions:string[]; post_proc:AudioPostProcess[] };
  suno_ai:SunoAIData; progress:ProgressStep[]; version_history:VersionEntry[];
}

interface ReleaseCompany extends BaseEntity { id:string; name:string; website:string; account_id:string; password_encrypted:string }
interface CalendarEvent extends BaseEntity { id:string; title:string; date:Date; description:string }
interface Comment extends BaseEntity { id:string; user_id:string; user_name:string; content:string }
interface Collaboration { calendar_events:CalendarEvent[]; comments:Comment[] }

interface Album extends BaseEntity {
  id:string; slug:string; name:{kr:string; en:string}; summary:string; description:string;
  album_art:{ thumbnail:string; low_res:string; high_res:string; final_cover:string };
  artist:Artist; release_date:Date; status:AlbumStatus; theme_color:string; tracks:Track[];
  release_company:ReleaseCompany; collaboration:Collaboration;
}
```

### 슬러그(slug) 규칙
- `Album.slug`는 **영문소문자+숫자+하이픈**만 허용, **유니크**해야 함
- 저장 전 **자동 중복 체크** (예: `"blue-dream"`, `"blue-dream-2"`)

---

## 📓 변경 내역(Changelog) 자동화
- 모든 수정(앨범/트랙/가사/프롬프트/스타일 코드 등)에 대해 **자동 로그/버전 기록**
- UI: 관리자에서 리스트·상세 확인, 코멘트/롤백
- D1: `audit_log` 및 별도 `changelog` 테이블 권장(인덱싱)

예시 JSON
```json
{
  "id": "uuid",
  "entity_type": "album|track|lyrics|ai_prompt",
  "entity_id": "uuid",
  "version": "v1.2",
  "changed_by": "username",
  "changed_at": "2025-09-10T15:00:00Z",
  "change_summary": "가사 수정 및 스타일 코드 업데이트",
  "detailed_changes": [
    {"field": "lyrics", "old_value": "기존", "new_value": "수정"},
    {"field": "suno_ai.style_code", "old_value": "style1", "new_value": "style2"}
  ]
}
```

---

## 🧭 실전 적용 순서 (온보딩 가이드)
1) **ERD 시각화**: Album-Track-Artist-Tag 관계도  
2) **OpenAPI(Swagger)**: 모든 REST 명세 자동화  
3) **Mock 데이터**: UI/흐름 조기 검증(실데이터 미준비 시)  
4) **컴포넌트 문서화**: AlbumCard, TrackProgressBar, PersonaBadge 등  
5) **디자인 시스템 연동**: 색상/간격/타이포 규칙 Storybook/Figma와 동기화

---

## ✅ 접근성/품질 체크리스트
- 텍스트 대비 ≥ 4.5:1
- 포커스 링 ≥ 1.5px
- 툴팁 hover+focus 접근 가능
- 상태 갱신: `aria-live="polite"`
- 시맨틱 영역: `header/aside/main` 준수

---

## 🧰 트러블슈팅(Quick)
- 500 오류 → `wrangler.toml` DB ID, `schema.sql` 적용, Node 20/pnpm 9 확인
- Tailwind 적용 안됨 → `@tailwindcss/vite` 플러그인/버전 체크, `src/app.css` 로드 확인
- 폰트 깨짐 → Pretendard 링크 `app.html` 포함 확인
- 스크롤 점프/우측 여백 이상 → `.main-content-area`의 `padding-right:48px` 및 `scrollbar-gutter: stable` 확인

---

## 📌 결론
이 문서는 **실행 가능한 개발 README**와 **설계·데이터·운영 스펙**을 하나로 통합한 **최신본**이다.  
오늘 확정된 **스크롤바 색상/효과 전역 적용**과 **메인 여백(좌 24 / 우 48)**,  
그리고 **상단바(80px, 검색 이벤트, 알림 dot, Eclipse 토글)** 및  
**좌측 사이드바(72↔250, 이벤트 브로드캐스트, 11개 메뉴)**가 **최우선 기준**으로 반영되어 있다.  
그대로 복사-붙여넣기 후 `pnpm -C apps/admin dev`를 실행하면 동일 구조가 즉시 구동된다.

===== END_OF_README =====
