# Sugar Rush 910 — 완전한 디자인 시스템 가이드

> **⚠️ 이 문서는 프로젝트의 유일한 공식 디자인 시스템 가이드입니다.**
> 
> 모든 UI 컴포넌트, 호버/포커스 효과, 색상, 타이포그래피, 레이아웃 규칙을 포함합니다.
> 
> **마지막 업데이트**: 2026-01-11

---

## 📋 목차

1. [기본 원칙](#1-기본-원칙)
2. [색상 시스템](#2-색상-시스템)
3. [타이포그래피](#3-타이포그래피)
4. [레이아웃 시스템](#4-레이아웃-시스템)
5. [공통 CSS 패턴](#5-공통-css-패턴)
6. [컴포넌트 규격](#6-컴포넌트-규격)
7. [카드 시스템](#7-카드-시스템)
8. [폼 요소](#8-폼-요소)
9. [버튼 시스템](#9-버튼-시스템)
10. [아이콘 시스템](#10-아이콘-시스템)
11. [사이드바 (예외 영역)](#11-사이드바-예외-영역)
12. [헤더 (예외 영역)](#12-헤더-예외-영역)
13. [특수 상태](#13-특수-상태)
14. [검증 체크리스트](#14-검증-체크리스트)
15. [금지 사항](#15-금지-사항)

---

## 1. 기본 원칙

### 1.1 핵심 규칙 (반드시 준수)

| 우선순위 | 규칙 | 설명 |
|---------|------|------|
| **1** | **포커스 > 호버** | 포커스 효과가 호버 효과보다 항상 우선순위를 가집니다 |
| **2** | **활성화/선택 > 포커스 > 호버** | 활성화(active)/선택(selected) 상태는 모든 효과를 무시합니다 |
| **3** | **세트 개념** | 같은 기능/영역의 요소들은 동일한 효과가 동시에 적용됩니다 |
| **4** | **색상만 변경** | 모든 호버/포커스 효과는 색상만 변경합니다 (위치, 크기 변경 금지) |
| **5** | **아이콘 배경 투명** | 호버/포커스 기능만 있는 아이콘의 배경색은 항상 투명입니다 |

### 1.2 디자인 철학

- **미니멀리즘**: 선(line)과 면(surface)의 컬러로만 디자인 완성
- **일관성**: 공통 패턴은 동일한 코드/클래스명 사용
- **접근성**: WCAG 2.2 AA 준수 (대비 ≥4.5:1, 포커스 링 ≥1.5px)
- **반응형**: 모든 환경에서 유연하게 대응

### 1.3 제약사항

| 금지 항목 | 이유 |
|----------|------|
| `transform`, `translate`, `scale`, `rotate` | 위치/크기 이동 효과 금지 |
| 두꺼운 라인 효과 (3px 초과) | 미니멀 디자인과 불일치 |
| 그림자 및 입체 효과 (`box-shadow` 등) | 미니멀 디자인과 불일치 |
| "AI" 문자열 (외부 노출) | 금칙어 위반 (내부 코드/DB에서만 `ai_type` 허용) |

---

## 2. 색상 시스템

### 2.1 CSS 변수 정의

#### 다크 모드 (기본)

```css
:root {
  /* === 기본 색상 === */
  --bg: #000000;                 /* 배경색 (검정) */
  --surface-1: #1A1A1A;          /* 표면 색상 1 (카드 내부) */
  --surface-2: #121212;          /* 표면 색상 2 (카드 배경) */
  
  /* === 텍스트 색상 === */
  --text-base: #888888;          /* 기본 텍스트 */
  --text-strong: #B6B6B6;        /* 강조 텍스트 */
  --text-muted: #6F6F6F;         /* 약한 텍스트 (플레이스홀더) */
  
  /* === 보더 색상 === */
  --border-subtle: #252528;      /* 기본 보더 */
  
  /* === 브랜드 색상 === */
  --brand-pink: #FF3DAE;         /* 포커스/활성화 색상 (핫핑크) */
  
  /* === 호버 색상 === */
  --hover-point: #17E1BC;        /* 호버 포인트 (시안) */
  --text-on-hover: #000000;      /* 호버 시 텍스트 (검정) */
}
```

#### 라이트 모드

```css
[data-theme="light"] {
  /* === 기본 색상 === */
  --bg: #F7F3E9;                 /* 배경색 (베이지 톤) */
  --surface-1: #FFF8EF;          /* 표면 색상 1 */
  --surface-2: #F3EBDD;          /* 표면 색상 2 */
  
  /* === 텍스트 색상 === */
  --text-base: #8B7355;          /* 기본 텍스트 */
  --text-strong: #6B5B47;        /* 강조 텍스트 */
  --text-muted: #5C4F3F;         /* 약한 텍스트 */
  
  /* === 보더 색상 === */
  --border-subtle: #B8A896;      /* 기본 보더 */
  
  /* === 호버 색상 === */
  --hover-point: #8A2BE2;        /* 호버 포인트 (보라) */
  --text-on-hover: #F3EBDD;      /* 호버 시 텍스트 (베이지) */
}
```

### 2.2 색상 사용 요약표

| 상태 | 다크 모드 | 라이트 모드 |
|------|----------|------------|
| **기본** | 텍스트: `#888888` | 텍스트: `#8B7355` |
| **호버** | 배경/보더: `#17E1BC` (시안), 텍스트: `#000000` (검정) | 배경/보더: `#8A2BE2` (보라), 텍스트: `#F3EBDD` (베이지) |
| **포커스** | 배경/보더: `#FF3DAE` (핫핑크), 텍스트: `#FFFFFF` (흰색) | 배경/보더: `#FF3DAE` (핫핑크), 텍스트: `#FFFFFF` (흰색) |
| **활성화** | 배경: `#FF3DAE`, 텍스트: `#FFFFFF` | 배경: `#FF3DAE`, 텍스트: `#FFFFFF` |

---

## 3. 타이포그래피

### 3.1 폰트 패밀리

```css
font-family: 'Pretendard Variable', Pretendard, -apple-system, 
             BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 
             'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 
             'Malgun Gothic', sans-serif;
```

### 3.2 폰트 크기 규격

| 용도 | 크기 | Tailwind 클래스 |
|------|------|----------------|
| 카드 타이틀 | 18px | `text-lg font-bold` |
| 섹션 타이틀 | 12px | `text-xs font-semibold` |
| 본문 텍스트 | 14px | `text-sm` |
| 배지/라벨 | 12px | `text-xs font-bold` |
| 플레이스홀더 | 14px | `text-sm text-text-muted` |

---

## 4. 레이아웃 시스템

### 4.1 전체 구조

```
┌────────────────────────────────────────────────────────────────┐
│ Header (56px 고정, z-[60])                                      │
├──────────────┬─────────────────────────────────────────────────┤
│ Sidebar      │ Main Content Area                                │
│ (240px 토글) │ (12-col grid, gap-6)                             │
│ z-40         │                                                  │
│              │                                                  │
│              │                                                  │
│              │                                                  │
│              │                                                  │
└──────────────┴─────────────────────────────────────────────────┘
```

### 4.2 반응형 그리드

| 화면 크기 | 컬럼 수 | Tailwind 클래스 |
|----------|--------|----------------|
| `<md` (768px 미만) | 1열 | `grid-cols-1` |
| `md~<lg` (768px~1024px) | 2열 | `sm:grid-cols-2` |
| `≥lg` (1024px 이상) | 3열 | `lg:grid-cols-3` |

### 4.3 카드 크기 규격

| 카드 유형 | 높이 | 열 스팬 (3열 기준) |
|----------|------|------------------|
| 일반 카드 | `h-[396px]` | `col-span-1` |
| KPI 카드 | 가변 (내용에 따름) | `col-span-3` (전체) |
| 수익/지출 통계 | `h-[396px]` | 2열: `col-span-1`, 3열: `col-span-3` |

---

## 5. 공통 CSS 패턴

### 5.1 호버 효과 패턴 (★★★ 필수 ★★★)

**모든 호버 효과는 반드시 `:not(:focus):not(:focus-visible)` 조건을 포함해야 합니다.**

```css
/* ✅ 올바른 예 */
.element:hover:not(:focus):not(:focus-visible) {
  color: var(--hover-point);
}

/* ❌ 잘못된 예 */
.element:hover {
  color: var(--hover-point); /* 포커스 상태에서도 호버 효과가 적용됨 */
}
```

### 5.2 포커스 효과 패턴

```css
/* 포커스 (최우선) */
.element:focus,
.element:focus-visible {
  color: var(--brand-pink) !important;
  outline: none;
}

/* 포커스+호버 (포커스 색상 유지) */
.element:focus:hover,
.element:focus-visible:hover {
  color: var(--brand-pink) !important;
}
```

### 5.3 트랜지션 규격

```css
/* 기본 트랜지션 */
transition: all 0.2s ease;
transition: color 0.2s ease;
transition: background-color 0.2s ease;
transition: border-color 0.2s ease;

/* Tailwind 클래스 */
transition-colors    /* 색상 트랜지션 */
duration-200         /* 200ms */
```

---

## 6. 컴포넌트 규격

### 6.1 카드 리스트 항목 (★★★ 핵심 패턴 ★★★)

**적용 대상**: 모든 대시보드 카드 내부의 클릭 가능한 리스트 항목

#### HTML 구조

```html
<a 
  href="/path/to/item" 
  class="flex items-center h-12 px-4 bg-surface-1 rounded hover:bg-surface-2 transition-colors min-w-0"
>
  <!-- 좌측 요소 (아이콘/체크박스) -->
  <span class="flex-shrink-0 w-5 h-5 flex items-center justify-center mr-3">
    <IconComponent size={16} class="text-text-base" />
  </span>
  
  <!-- 중간 텍스트 (좌측정렬, 말줄임) -->
  <span class="flex-1 text-sm text-text-base truncate text-left min-w-0">
    {item.text}
  </span>
  
  <!-- 우측 요소 (배지/시간) -->
  <span class="flex-shrink-0 flex items-center gap-x-2 ml-2">
    <span class="badge-base badge-medium-yellow">상태</span>
  </span>
</a>
```

#### 필수 Tailwind 클래스

| 클래스 | 용도 |
|-------|------|
| `flex items-center` | 수평 정렬 |
| `h-12` | 고정 높이 48px |
| `px-4` | 좌우 패딩 16px |
| `bg-surface-1` | 기본 배경색 |
| `rounded` | 모서리 라운드 |
| `hover:bg-surface-2` | 호버 시 배경색 변경 |
| `transition-colors` | 색상 트랜지션 |
| `min-w-0` | 텍스트 말줄임 허용 |

#### CSS 효과 규격

```css
/* 호버 효과 (포커스가 아닐 때만) */
a[href*="/path/"]:hover:not(:focus):not(:focus-visible) {
  background-color: var(--surface-2) !important;
  border-color: var(--hover-point) !important;
}

/* 호버 시 내부 텍스트 색상 변경 */
a[href*="/path/"]:hover:not(:focus):not(:focus-visible) .text-text-base {
  color: var(--hover-point) !important;
}

/* 포커스 효과 (호버보다 우선) */
a[href*="/path/"]:focus,
a[href*="/path/"]:focus-visible {
  border-color: var(--brand-pink) !important;
  color: var(--brand-pink) !important;
}

/* 포커스+호버 (포커스 색상 유지) */
a[href*="/path/"]:focus:hover,
a[href*="/path/"]:focus-visible:hover {
  border-color: var(--brand-pink) !important;
  color: var(--brand-pink) !important;
}
```

### 6.2 미니 통계 영역

**적용 대상**: 카드 상단의 요약 통계 표시 영역

```html
<div class="grid grid-cols-3 gap-2 mb-3">
  <div class="h-8 bg-surface-1 rounded flex items-center justify-center px-2">
    <span class="text-xs text-text-muted truncate">라벨: 값</span>
  </div>
</div>
```

### 6.3 더보기 버튼

```html
<a 
  href="/path" 
  class="self-end text-brand-pink text-sm font-semibold px-2 py-1 rounded hover:bg-hover-cyan transition-colors mt-3"
>
  더보기
</a>
```

---

## 7. 카드 시스템

### 7.1 카드 기본 구조

```html
<div class="card-base h-[396px] flex flex-col justify-between p-5 rounded-lg bg-surface-2 border border-border-subtle overflow-hidden pt-[24px]">
  <!-- 헤더 -->
  <div>
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-bold text-text-strong truncate">카드 타이틀</h3>
      <button class="..." aria-label="정보">
        <Info size={12} class="text-text-muted" />
      </button>
    </div>
    
    <!-- 미니 통계 -->
    <div class="grid grid-cols-3 gap-2 mb-3">...</div>
    
    <!-- 리스트 항목 -->
    <div class="grid grid-rows-4 gap-3 min-h-0">...</div>
  </div>
  
  <!-- 하단 액션 -->
  <a href="/path" class="self-end text-brand-pink text-sm font-semibold ...">
    더보기
  </a>
</div>
```

### 7.2 카드 호버 효과

```css
/* 인터랙티브 카드만 호버 효과 적용 */
.card-base.card-interactive:hover {
  border-color: var(--hover-point);
}

/* 폼 컨테이너는 호버 효과 없음 */
.card-base:has(form):hover {
  border-color: var(--border-subtle) !important;
}
```

### 7.3 카드 종류별 규격

| 카드 | 높이 | 리스트 행 수 | 특이사항 |
|------|------|-------------|---------|
| TasksCard | 396px | 4행 | 체크박스 포함 |
| ReleasesCard | 396px | 4행 | 상태 배지 |
| ChangesCard | 396px | 4행 | 작성자 표시 |
| LogsCard | 396px | 4행 | 시간 표시 |
| FeedbackCard | 396px | 4행 | 평점 표시 |
| FinancialStatsCard | 396px | 2행 x 2열 | 수치 포맷팅 |
| KpiCard | 가변 | - | 전체 너비 |

---

## 8. 폼 요소

### 8.1 입력 필드 (.input-base)

```css
.input-base {
  @apply w-full px-4 py-2 rounded-lg border outline-none;
  border-color: var(--border-subtle);
  background-color: var(--surface-2);
  color: var(--text-base);
}

/* 호버 (포커스 없을 때만) */
.input-base:hover:not(:focus):not(:focus-within) {
  border-color: var(--hover-point);
}

/* 포커스 (최우선) */
.input-base:focus,
.input-base:focus-within,
.input-base[aria-expanded="true"] {
  border-color: var(--brand-pink) !important;
}
```

### 8.2 체크박스

```html
<input 
  type="checkbox" 
  class="w-4 h-4 rounded appearance-none bg-transparent 
         border border-[color:var(--text-base)] 
         checked:bg-transparent checked:border-[color:var(--brand-pink)]
         hover:border-[color:var(--hover-cyan)] 
         focus:ring-2 focus:ring-[#FF3DAE]
         transition-all duration-200 cursor-pointer" 
/>
```

### 8.3 플레이스홀더

```css
input::placeholder,
input::-webkit-input-placeholder,
input::-moz-placeholder {
  color: var(--text-muted) !important;
  opacity: 1 !important;
}
```

### 8.4 에러 상태

```css
input[aria-invalid="true"] {
  border-color: var(--danger-fg) !important;
}

input[aria-invalid="true"]:focus {
  border-color: var(--danger-fg) !important;
  box-shadow: 0 0 0 1px var(--danger-fg);
}
```

---

## 9. 버튼 시스템

### 9.1 배경색이 있는 버튼 (bg-brand-pink)

| 상태 | 다크 모드 | 라이트 모드 |
|------|----------|------------|
| **기본** | 배경: `#FF3DAE`, 텍스트: `#FFFFFF` | 동일 |
| **호버** | 배경: `#17E1BC`, 텍스트: `#000000` | 배경: `#8A2BE2`, 텍스트: `#F3EBDD` |
| **포커스** | 배경: `#FF3DAE`, 텍스트: `#FFFFFF` | 동일 |

```css
button.bg-brand-pink:hover:not(:focus):not(:focus-visible) {
  background-color: var(--hover-point) !important;
  color: var(--text-on-hover) !important;
}

button.bg-brand-pink:focus,
button.bg-brand-pink:focus-visible {
  background-color: var(--brand-pink) !important;
  color: #FFFFFF !important;
  outline: none !important;
}
```

### 9.2 아이콘 버튼 (.btn-icon)

```css
.btn-icon {
  background-color: transparent;
  color: var(--text-muted);
}

.btn-icon:hover:not(:focus):not(:focus-visible) {
  background-color: transparent;
  color: var(--hover-point);
}

.btn-icon:focus,
.btn-icon:focus-visible {
  background-color: transparent;
  color: var(--brand-pink);
  outline: none;
}
```

### 9.3 취소 버튼 (.cancel-button)

```css
.cancel-button:hover:not(:focus):not(:focus-visible) {
  background-color: transparent !important;
  color: var(--hover-point) !important;
  border-color: var(--hover-point) !important;
}

.cancel-button:focus,
.cancel-button:focus-visible {
  background-color: transparent !important;
  color: var(--brand-pink) !important;
  border-color: var(--brand-pink) !important;
  outline: none;
}
```

---

## 10. 아이콘 시스템

### 10.1 Lucide 아이콘 기본 규격

| 속성 | 값 |
|------|-----|
| 라이브러리 | lucide-svelte |
| 기본 크기 | 16px |
| 컨테이너 크기 | 24px × 24px |
| 다운로드 방식 | SVG 직접 다운로드 |

### 10.2 아이콘 호버/포커스 효과

```css
/* 일반 아이콘 호버 */
.lucide-icon:hover {
  color: var(--hover-point) !important;
}

/* 아이콘 포커스 */
.lucide-icon:focus,
.lucide-icon:focus-visible {
  color: var(--brand-pink) !important;
}

/* 포커스+호버 (포커스 색상 유지) */
.lucide-icon:focus:hover,
.lucide-icon:focus-visible:hover {
  color: var(--brand-pink) !important;
}
```

---

## 11. 사이드바 (예외 영역)

> **⚠️ 사이드바는 글로벌 디자인 시스템을 따르지 않습니다.**
> 직접적인 명령 전까지 절대 수정 금지입니다.

### 11.1 사이드바 규격

| 속성 | 값 |
|------|-----|
| 너비 (열림) | 250px |
| 너비 (접힘) | 72px |
| z-index | 40 |
| 위치 | `fixed left-0 top-0 h-screen` |

### 11.2 사이드바 메뉴 아이템 상태

| 상태 | 배경색 | 텍스트/아이콘 |
|------|--------|-------------|
| **기본** | 투명 | `var(--text-base)` |
| **호버** | `var(--hover-point)` | `#000000` (다크), `var(--surface-2)` (라이트) |
| **포커스** | `var(--brand-pink)` | `#FFFFFF` |
| **활성화 (active)** | `var(--brand-pink)` | `#FFFFFF` |
| **활성화+호버** | `var(--brand-pink)` (유지) | `#FFFFFF` (유지) |

### 11.3 사이드바 스크롤바

```css
/* 스크롤바 완전히 투명 처리 */
aside nav ul::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

aside nav ul {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}
```

---

## 12. 헤더 (예외 영역)

> **⚠️ 헤더 레이아웃은 수정 금지입니다.**
> 내부 검색창과 버튼만 글로벌 규칙을 따릅니다.

### 12.1 헤더 규격

| 속성 | 값 |
|------|-----|
| 높이 | 56px |
| z-index | 60 |
| 위치 | `fixed top-0` |

### 12.2 검색창 세트 개념

검색창은 **보더 + 아이콘**이 세트로 동작합니다.

```css
/* 호버 (포커스 없을 때) */
.search-container:hover:not(:focus-within) input {
  border-color: var(--hover-point) !important;
}
.search-container:hover:not(:focus-within) .lucide-icon {
  color: var(--hover-point) !important;
}

/* 포커스 */
.search-container:focus-within input {
  border-color: var(--brand-pink) !important;
}
.search-container:focus-within .lucide-icon {
  color: var(--brand-pink) !important;
}
```

---

## 13. 특수 상태

### 13.1 선택된 상태 (Selected)

**선택된 요소는 호버/포커스 효과를 무시합니다.**

```css
.tag-chip.selected,
.tag-chip[data-selected="true"],
[aria-selected="true"] {
  background-color: var(--brand-pink) !important;
  color: white !important;
}

/* 선택된 상태에서 호버해도 색상 유지 */
.tag-chip.selected:hover {
  background-color: var(--brand-pink) !important;
  color: white !important;
}
```

### 13.2 키보드 포커스 (keyboard-focused)

```css
.filter-dropdown [role="option"].keyboard-focused {
  background-color: var(--brand-pink) !important;
  color: #fff !important;
  outline: none;
}
```

### 13.3 드래그 상태

```css
.draggable-item {
  cursor: grab;
}

.draggable-item:active {
  cursor: grabbing;
  border-color: var(--brand-pink);
}

.draggable-item[data-dragging="true"] {
  border-color: var(--brand-pink);
}

.draggable-item[data-drop-target="true"] {
  background-color: color-mix(in srgb, var(--hover-point) 10%, transparent);
}
```

### 13.4 텍스트 선택 (::selection)

```css
::selection {
  background-color: color-mix(in srgb, var(--brand-pink) 30%, transparent);
  color: white; /* 다크 모드 */
}

[data-theme="light"] ::selection {
  background-color: color-mix(in srgb, var(--brand-pink) 30%, transparent);
  color: black; /* 라이트 모드 */
}
```

---

## 14. 검증 체크리스트

### 14.1 기본 규칙 검증

- [ ] 모든 호버 효과에 `:not(:focus):not(:focus-visible)` 조건이 있는가?
- [ ] 포커스 효과가 호버 효과보다 우선순위를 가지는가?
- [ ] 포커스 상태에서 호버해도 포커스 색상이 유지되는가?
- [ ] 활성화/선택 상태에서 호버/포커스 효과가 무시되는가?
- [ ] 다크 모드와 라이트 모드 모두 올바른 색상이 적용되는가?

### 14.2 세트 개념 검증

- [ ] 보더와 아이콘이 세트로 동작하는가? (검색창, DatePicker, 드롭다운)
- [ ] 버튼 배경에 색상이 들어간 경우 아이콘+텍스트가 같은 색상으로 적용되는가?
- [ ] 카드 리스트 항목의 배경+보더+텍스트가 동시에 변경되는가?

### 14.3 색상 검증

| 상태 | 다크 모드 | 라이트 모드 |
|------|----------|------------|
| 호버 배경/보더 | `#17E1BC` (시안) | `#8A2BE2` (보라) |
| 호버 텍스트 | `#000000` (검정) | `#F3EBDD` (베이지) |
| 포커스 배경/보더 | `#FF3DAE` (핫핑크) | `#FF3DAE` (핫핑크) |
| 포커스 텍스트 | `#FFFFFF` (흰색) | `#FFFFFF` (흰색) |

### 14.4 레이아웃 검증

- [ ] 가로 스크롤바가 나타나지 않는가?
- [ ] 카드 높이가 `h-[396px]`로 통일되어 있는가?
- [ ] 반응형 그리드가 올바르게 작동하는가? (1열/2열/3열)
- [ ] 사이드바 스크롤이 투명하고 레이아웃에 영향을 주지 않는가?

---

## 15. 금지 사항

### 15.1 절대 금지

| 항목 | 설명 |
|------|------|
| 위치/크기 변경 효과 | `transform`, `translate`, `scale`, `rotate` 사용 금지 |
| 그림자/입체 효과 | `box-shadow` 사용 금지 (미니멀 디자인) |
| 두꺼운 라인 | 보더 3px 초과 금지 |
| "AI" 문자열 | 외부 노출 UI/문서/알림에 금지 |
| 사이드바 수정 | 직접 명령 없이 수정 금지 |
| 헤더 레이아웃 수정 | 직접 명령 없이 수정 금지 |

### 15.2 가로 스크롤바 방지

```css
html, body {
  overflow-x: hidden;
}

/* 모든 요소에 min-w-0 적용 */
.truncate { min-width: 0; }
```

### 15.3 코드 중복 방지

- 공통 패턴은 동일한 CSS 클래스 사용
- Tailwind 유틸리티 클래스 우선 사용
- CSS 변수로 색상 통일

---

## 📚 파일 참조

| 파일 | 역할 |
|------|------|
| `src/app.css` | 글로벌 CSS (모든 스타일 정의) |
| `src/routes/+layout.svelte` | 전역 레이아웃 |
| `src/lib/components/Sidebar.svelte` | 사이드바 컴포넌트 |
| `src/lib/components/Header.svelte` | 헤더 컴포넌트 |
| `new_README.md` | 프로젝트 전체 가이드 |

---

**마지막 업데이트**: 2026-01-11

**작성자**: AI Assistant (based on codebase analysis)
