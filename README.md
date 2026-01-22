# 좌측 사이드바 완벽판 - 완전 복구 가이드

**작성일**: 2026-01-12  
**버전**: v3 최종  
**상태**: 완벽 동작 보장

---

## 📋 목차

1. [파일 구조](#파일-구조)
2. [핵심 원리](#핵심-원리)
3. [CSS 우선순위 체계](#css-우선순위-체계)
4. [호버/포커스/활성화 상태 규칙](#호버포커스활성화-상태-규칙)
5. [포커스 위 호버 겹침 방지](#포커스-위-호버-겹침-방지)
6. [복구 방법](#복구-방법)
7. [주의사항](#주의사항)

---

## 📁 파일 구조

```
left sidebar/
├── Sidebar.svelte          # 사이드바 컴포넌트
├── +layout.svelte          # 레이아웃 (body 클래스 동기화)
├── Header.svelte           # 헤더 (사이드바 너비 연동)
├── sidebar.css             # 사이드바 관련 모든 CSS
├── ui.js                   # 사이드바 토글 스크립트
└── README.md               # 이 문서
```

---

## 🎯 핵심 원리

### 1. Body 클래스 기반 동기화 (v3)

**기존 방식 (문제점)**:
- 인라인 스타일: `style="width: {sidebarCollapsed ? '72px' : '250px'}"`
- Header 인라인: `style="margin-left: {sidebarWidth}px"`
- 각 컴포넌트가 독립적으로 상태 관리

**v3 방식 (해결책)**:
- **Body 클래스**: `body.sidebar-collapsed`, `body.sidebar-expanded`
- **CSS 변수**: `--sidebar-width-collapsed`, `--sidebar-width-expanded`
- **중앙 관리**: 모든 요소가 body 클래스에 반응

### 2. CSS 변수

```css
:root {
  --sidebar-width-collapsed: 72px;
  --sidebar-width-expanded: 250px;
  --sidebar-text-width: 160px;
  --anim-bezier: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

### 3. 애니메이션 동기화

- **사이드바 본체**: `250ms var(--anim-bezier)`
- **텍스트 영역**: `250ms var(--anim-bezier)`
- **헤더/메인**: `250ms var(--anim-bezier)`
- **모든 요소 동시 움직임 보장**

---

## 🎨 CSS 우선순위 체계

### 우선순위 순서 (낮음 → 높음)

1. **기본 상태** (우선순위: 0)
2. **호버 (Hover)** (우선순위: 1)
   - `:hover:not(.active):not(:focus):not(:focus-visible):not([aria-current="page"])`
3. **포커스 (Focus)** (우선순위: 2)
   - `:focus`, `:focus-visible`
   - `:focus:hover` (포커스 상태에서 호버)
4. **활성화 (Active)** (우선순위: 3 - 최고)
   - `.active` 클래스
   - `[aria-current="page"]` 속성
   - **모든 상태 조합에서 최우선**

### 선택자 특이성 (Specificity)

```
기본: .sidebar-menu-item                    (0,1,0)
호버: .sidebar-menu-item:hover              (0,2,0)
포커스: .sidebar-menu-item:focus            (0,2,0)
활성화: .sidebar-menu-item.active           (0,2,0)
확장: aside nav ul li a.sidebar-menu-item    (0,4,0) ← 더 높음
```

---

## 🎯 호버/포커스/활성화 상태 규칙

### 1. 호버 (Hover) - 우선순위 낮음

**조건**: 활성화/포커스 상태가 아닐 때만

```css
/* 다크 모드 */
.sidebar-menu-item:hover:not(.active):not(:focus):not(:focus-visible):not([aria-current="page"]) {
  background-color: var(--hover-point) !important; /* 시안 */
  color: #000000 !important;
}

/* 라이트 모드 */
[data-theme="light"] .sidebar-menu-item:hover:not(.active):not(:focus):not(:focus-visible):not([aria-current="page"]) {
  background-color: var(--hover-point) !important; /* 보라 */
  color: var(--text-on-hover) !important;
}
```

**제외 조건**:
- `:not(.active)` - 활성화 클래스 제외
- `:not(:focus)` - 포커스 상태 제외
- `:not(:focus-visible)` - 키보드 포커스 제외
- `:not([aria-current="page"])` - 활성화 속성 제외

### 2. 포커스 (Focus) - 우선순위 중간

**조건**: 모든 상태에서 포커스 우선

```css
/* 포커스 기본 */
.sidebar-menu-item:focus,
.sidebar-menu-item:focus-visible {
  background-color: var(--brand-pink) !important;
  color: #ffffff !important;
}

/* 포커스 + 호버 (포커스 상태에서 호버해도 포커스 색상 유지) */
.sidebar-menu-item:focus:hover,
.sidebar-menu-item:focus-visible:hover {
  background-color: var(--brand-pink) !important;
  color: #ffffff !important;
}
```

**핵심**: 포커스 상태에서 호버해도 포커스 색상 유지

### 3. 활성화 (Active) - 우선순위 최고

**조건**: 모든 상태에서 활성화 최우선

```css
/* 활성화 기본 */
.sidebar-menu-item.active,
.sidebar-menu-item[aria-current="page"] {
  background-color: var(--brand-pink) !important;
  color: #ffffff !important;
}

/* 활성화 + 호버 (활성화 상태에서 호버해도 활성화 색상 유지) */
.sidebar-menu-item.active:hover,
.sidebar-menu-item[aria-current="page"]:hover {
  background-color: var(--brand-pink) !important;
  color: #ffffff !important;
}

/* 활성화 + 포커스 (활성화 상태에서 포커스해도 활성화 색상 유지) */
.sidebar-menu-item.active:focus,
.sidebar-menu-item[aria-current="page"]:focus {
  background-color: var(--brand-pink) !important;
  color: #ffffff !important;
}

/* 활성화 + 포커스 + 호버 (3중 조합) */
.sidebar-menu-item.active:focus:hover,
.sidebar-menu-item[aria-current="page"]:focus:hover {
  background-color: var(--brand-pink) !important;
  color: #ffffff !important;
}
```

---

## 🛡️ 포커스 위 호버 겹침 방지

### 문제 상황

**발생 가능한 문제**:
1. 포커스 상태에서 호버 시 호버 색상이 포커스 색상을 덮어씀
2. 활성화 상태에서 호버 시 호버 색상이 활성화 색상을 덮어씀
3. 포커스 + 활성화 상태에서 호버 시 호버 색상이 덮어씀

### 해결 방법

#### 1. 명시적 상태 조합 규칙

**포커스 + 호버**:
```css
/* 포커스 상태에서 호버해도 포커스 색상 유지 */
.sidebar-menu-item:focus:hover,
.sidebar-menu-item:focus-visible:hover {
  background-color: var(--brand-pink) !important; /* 포커스 색상 */
  color: #ffffff !important;
}
```

**활성화 + 호버**:
```css
/* 활성화 상태에서 호버해도 활성화 색상 유지 */
.sidebar-menu-item.active:hover,
.sidebar-menu-item[aria-current="page"]:hover {
  background-color: var(--brand-pink) !important; /* 활성화 색상 */
  color: #ffffff !important;
}
```

**활성화 + 포커스 + 호버**:
```css
/* 3중 조합에서도 활성화 색상 유지 */
.sidebar-menu-item.active:focus:hover,
.sidebar-menu-item[aria-current="page"]:focus:hover {
  background-color: var(--brand-pink) !important; /* 활성화 색상 */
  color: #ffffff !important;
}
```

#### 2. 호버 규칙에서 제외

**호버 규칙에 명시적 제외**:
```css
/* 호버 규칙에서 포커스/활성화 제외 */
.sidebar-menu-item:hover:not(.active):not(:focus):not(:focus-visible):not([aria-current="page"]) {
  /* 호버 효과 */
}
```

#### 3. 최고 우선순위 보장 (핵폭탄 CSS)

**파일 맨 아래에 배치**:
```css
/* 🔥 활성화 호버 완전 차단 - 핵폭탄 우선순위 (최종 보장) */
.sidebar-menu-item[aria-current="page"] {
  background-color: var(--brand-pink) !important;
  color: #ffffff !important;
}

.sidebar-menu-item[aria-current="page"] * {
  background-color: transparent !important;
  color: #ffffff !important;
}

/* 호버 시에도 활성화 상태 무시 */
.sidebar-menu-item[aria-current="page"]:hover,
.sidebar-menu-item[aria-current="page"]:hover *,
.sidebar-menu-item[aria-current="page"]:focus,
.sidebar-menu-item[aria-current="page"]:focus *,
.sidebar-menu-item[aria-current="page"]:focus:hover,
.sidebar-menu-item[aria-current="page"]:focus:hover * {
  background-color: var(--brand-pink) !important;
  color: #ffffff !important;
}
```

**특징**:
- 파일 맨 아래 위치 (CSS 캐스케이드 최우선)
- `!important` 사용
- `*` 선택자로 모든 자식 요소 강제
- 모든 상태 조합 명시

---

## 🔄 복구 방법

### 1. 파일 복사

```powershell
# Windows PowerShell
Copy-Item "C:\Development\left sidebar\Sidebar.svelte" "src\lib\components\"
Copy-Item "C:\Development\left sidebar\+layout.svelte" "src\routes\"
Copy-Item "C:\Development\left sidebar\Header.svelte" "src\lib\components\"
Copy-Item "C:\Development\left sidebar\ui.js" "src\scripts\"
```

### 2. CSS 적용

**방법 1: sidebar.css 전체 복사**
```powershell
# app.css에 sidebar.css 내용 추가
Get-Content "C:\Development\left sidebar\sidebar.css" | Add-Content "src\app.css"
```

**방법 2: 수동 적용**
1. `src/app.css` 파일 열기
2. `sidebar.css` 내용을 파일 맨 아래에 붙여넣기
3. 기존 사이드바 관련 CSS와 중복 확인

### 3. 검증

1. **브라우저 캐시 삭제**: Ctrl + Shift + R
2. **개발자 도구**: F12 → Network 탭 → Disable cache
3. **테스트 시나리오**:
   - 사이드바 토글 동작 확인
   - 활성화 메뉴 호버 시 색상 유지 확인
   - 포커스 상태에서 호버 시 포커스 색상 유지 확인
   - 포커스 + 활성화 상태에서 호버 시 활성화 색상 유지 확인

---

## ⚠️ 주의사항

### 1. CSS 순서

**반드시 지켜야 할 순서**:
1. 기본 호버 규칙 (활성화/포커스 제외)
2. 포커스 규칙 (포커스 + 호버 포함)
3. 활성화 규칙 (활성화 + 호버, 활성화 + 포커스 + 호버 포함)
4. **핵폭탄 CSS (파일 맨 아래)**

### 2. 선택자 특이성

**확장 선택자 사용**:
- 기본: `.sidebar-menu-item`
- 확장: `aside nav ul li a.sidebar-menu-item` (더 높은 특이성)

**두 가지 모두 정의 필요**:
- 기본 선택자로 일반적인 경우 커버
- 확장 선택자로 더 구체적인 경우 커버

### 3. `!important` 사용

**사용 위치**:
- 모든 상태 규칙에 `!important` 사용
- Tailwind 클래스와의 충돌 방지
- 브라우저 기본 스타일 오버라이드

### 4. `aria-current="page"` 처리

**중요**: `.active` 클래스와 `[aria-current="page"]` 속성 모두 처리

```css
/* 둘 다 명시적으로 처리 */
.sidebar-menu-item.active { /* ... */ }
.sidebar-menu-item[aria-current="page"] { /* ... */ }

/* 호버 규칙에서 둘 다 제외 */
:hover:not(.active):not([aria-current="page"])
```

### 5. 아이콘 색상 강제

**활성화 상태 아이콘**:
```css
/* 모든 상태에서 흰색 강제 */
.sidebar-menu-item[aria-current="page"] .lucide-icon,
.sidebar-menu-item[aria-current="page"]:hover .lucide-icon,
.sidebar-menu-item[aria-current="page"]:focus .lucide-icon,
.sidebar-menu-item[aria-current="page"]:focus:hover .lucide-icon {
  color: #ffffff !important;
  transition: none !important; /* 전환 효과 제거 */
}
```

---

## 📊 상태 조합 매트릭스

| 상태 | 배경색 | 텍스트/아이콘 색상 | 우선순위 |
|------|--------|-------------------|---------|
| 기본 | `--surface-2` | `--text-base` | 0 |
| 호버 | `--hover-point` | 다크: `#000000`<br>라이트: `--text-on-hover` | 1 |
| 포커스 | `--brand-pink` | `#ffffff` | 2 |
| 포커스 + 호버 | `--brand-pink` | `#ffffff` | 2 (포커스 유지) |
| 활성화 | `--brand-pink` | `#ffffff` | 3 |
| 활성화 + 호버 | `--brand-pink` | `#ffffff` | 3 (활성화 유지) |
| 활성화 + 포커스 | `--brand-pink` | `#ffffff` | 3 (활성화 유지) |
| 활성화 + 포커스 + 호버 | `--brand-pink` | `#ffffff` | 3 (활성화 유지) |

---

## 🔧 기술 스택

- **SvelteKit**: Svelte 5 Runes (`$state`, `$effect`)
- **Tailwind CSS**: v4.1.13
- **Lucide Icons**: 다운로드하여 사용
- **CSS 변수**: 중앙 관리
- **Body 클래스**: 전역 동기화

---

## 📝 변경 이력

### v3 최종 (2026-01-12)
- Body 클래스 기반 동기화 추가
- CSS 변수 중앙 관리
- 활성화 상태 호버 완전 차단 (핵폭탄 CSS)
- 포커스 위 호버 겹침 방지
- 모든 상태 조합 명시적 정의

### v2 (이전)
- 인라인 스타일 기반
- 각 컴포넌트 독립 관리
- 호버/포커스 충돌 문제

---

## ✅ 검증 체크리스트

- [ ] 사이드바 토글 동작
- [ ] 헤더/메인 동기화
- [ ] 텍스트 페이드 애니메이션
- [ ] 활성화 메뉴 호버 시 색상 유지
- [ ] 포커스 상태 호버 시 포커스 색상 유지
- [ ] 포커스 + 활성화 상태 호버 시 활성화 색상 유지
- [ ] 다크/라이트 모드 호버 색상
- [ ] 반응형 (768px 기준)
- [ ] localStorage 동기화
- [ ] ui.js 통합

---

## 🚀 빠른 복구

```powershell
# 1. 파일 복사
Copy-Item "C:\Development\left sidebar\*.svelte" "src\lib\components\"
Copy-Item "C:\Development\left sidebar\+layout.svelte" "src\routes\"
Copy-Item "C:\Development\left sidebar\ui.js" "src\scripts\"

# 2. CSS 추가
Get-Content "C:\Development\left sidebar\sidebar.css" | Add-Content "src\app.css"

# 3. 브라우저 캐시 삭제
# Ctrl + Shift + R
```

---

**이 문서는 사이드바의 완벽한 복구를 보장합니다. 모든 상태 조합과 우선순위가 명시적으로 정의되어 있습니다.**
